// ╭───────────────────────────────────────────────────────────────╮
// │           Note analyzer: from samples to graded notes            │
// ╰───────────────────────────────────────────────────────────────╯
// Steps through the captured samples one hop at a time. Each hop measures the level and pitch,
// the segmenter decides where notes start and end, and, while a note sounds, every few hops a
// larger FFT measures its harmonics. When a note ends, it's graded. This module doesn't touch the
// page, so it can be tested on its own.

import { freqToMidi } from "../audio/notes";
import type { SampleBuffer } from "./capture";
import { PitchDetector } from "./pitch";
import { HopLog, Segmenter, type Hop } from "./segmenter";
import { HarmonicAnalyzer, timbreProfile, type HarmonicFrame, type TimbreProfile } from "./timbre";
import { analyzeNote, type Instrument, type NoteReport } from "./metrics";
import { median } from "./stats";

// A measurement of the background noise while it's quiet, which is used to find notes and to
// remove the noise from the measurement of the noise in a note's tone.
export interface NoiseCalibration {
  sampleRate: number;
  fftSize   : number;       // Size of the FFT that measured the spectrum
  level     : number;       // Median level (dB)
  spectrum  : Float32Array; // Average power of each bin
  savedAt   : number;       // When it was calibrated (ms since 1970)
  previous  : boolean;      // Whether it was loaded from an earlier visit
}

export interface AnalyzerSettings {
  onsetDb       : number; // How far above the background noise a note must rise (dB)
  minNoteSeconds: number; // Shorter notes are ignored
  a4            : number; // Reference pitch (Hz)
  instrument    : Instrument;
}

const HOP_SECONDS      = 0.005; // Time between hops
const LEVEL_SECONDS    = 0.01;  // Length of the audio whose RMS level is measured
const PITCH_SECONDS    = 0.04;  // Length of the audio whose pitch is measured (rounded up to a power of 2)
const HARMONIC_SECONDS = 0.17;  // Length of the audio whose harmonics are measured (rounded up to a power of 2)
const HARMONIC_EVERY   = 4;     // Hops between measurements of the harmonics
const LOG_SECONDS      = 30;    // How long hops are kept
const LIVE_SKIP        = 0.1;   // The live tone color skips this much of the note's start (s)
const PREROLL_SECONDS  = 0.3;   // How much from before a note starts is kept with it (for a change of note, where it came from)
const SINE_RMS_DB      = 20 * Math.log10(Math.SQRT1_2); // RMS level of a full-scale sine

const nextPow2 = (x: number) => 2 ** Math.ceil(Math.log2(x));

export class NoteAnalyzer {
  readonly sampleRate: number;
  readonly hopSize: number;
  readonly log: HopLog;
  readonly segmenter: Segmenter;
  frames: HarmonicFrame[] = [];
  readonly prerollHops: number;
  // The last sound that ended without being counted as a note, and why.
  lastDiscard: { t: number; reason: string } | null = null;
  private readonly levelBuf: Float32Array;
  private readonly pitchBuf: Float32Array;
  private readonly harmonicBuf: Float32Array;
  private readonly pitch: PitchDetector;
  private readonly harmonics: HarmonicAnalyzer;
  private nextEnd: number; // Sample just after the next hop's audio
  private hopCount = 0;
  private quietSince = Infinity; // Sample where the time between notes began
  private calibrating: { end: number; levels: number[]; spectra: Float32Array[]; done: (c: NoiseCalibration) => void } | null = null;

  constructor(private readonly buffer: SampleBuffer, sampleRate: number, private readonly settings: AnalyzerSettings) {
    this.sampleRate  = sampleRate;
    this.hopSize     = Math.round(HOP_SECONDS * sampleRate);
    this.levelBuf    = new Float32Array(Math.round(LEVEL_SECONDS * sampleRate));
    this.pitch       = new PitchDetector(nextPow2(PITCH_SECONDS * sampleRate), sampleRate);
    this.pitchBuf    = new Float32Array(this.pitch.size);
    this.harmonics   = new HarmonicAnalyzer(nextPow2(HARMONIC_SECONDS * sampleRate), sampleRate);
    this.harmonicBuf = new Float32Array(this.harmonics.size);
    this.log         = new HopLog(Math.round(LOG_SECONDS / HOP_SECONDS));
    this.segmenter   = new Segmenter(this.log, settings);
    this.nextEnd     = this.pitch.size;
    this.prerollHops = Math.round(PREROLL_SECONDS / HOP_SECONDS);
  }

  get isCalibrating(): boolean { return !!this.calibrating; }

  // Seconds of audio left to hear while calibrating.
  get calibrationRemaining(): number {
    return this.calibrating ? Math.max(0, (this.calibrating.end - this.buffer.total) / this.sampleRate) : 0;
  }

  // Uses a noise calibration (or stops using one, given null). Returns false if the calibration
  // was made with a different sample rate or FFT size, so it can't be used.
  setCalibration(c: NoiseCalibration | null): boolean {
    const matches = !!c && c.sampleRate === this.sampleRate && c.fftSize === this.harmonics.size
      && c.spectrum.length === this.harmonics.size / 2 + 1;
    this.segmenter.fixedFloor = matches ? c!.level : null;
    this.harmonics.calibrated = matches ? c!.spectrum : null;
    if (!matches) this.segmenter.floor = NaN; // Follows the noise again from the next quiet moment
    return matches || !c;
  }

  // Listens to the background noise for `seconds` (of audio from now on), during which no notes
  // are found, and then calls `done` with the calibration.
  calibrate(seconds: number, done: (c: NoiseCalibration) => void): void {
    this.segmenter.reset();
    this.calibrating = { end: this.buffer.total + seconds * this.sampleRate, levels: [], spectra: [], done };
  }

  cancelCalibration(): void { this.calibrating = null; }

  // Time of the newest sample (s).
  get now(): number { return this.buffer.total / this.sampleRate; }

  // Analyzes every hop whose audio has arrived, and returns the notes that ended.
  process(): NoteReport[] {
    // After a pause (as when the page was in the background), the audio that was missed isn't
    // analyzed, and the note in progress is dropped.
    if (!this.buffer.holds(this.nextEnd - this.harmonics.size, this.nextEnd) && this.buffer.total - this.nextEnd > this.sampleRate) {
      this.skip();
    }
    const reports: NoteReport[] = [];
    while (this.nextEnd <= this.buffer.total) {
      const report = this.step(this.nextEnd);
      if (report) reports.push(report);
      this.nextEnd += this.hopSize;
    }
    return reports;
  }

  // Ignores the audio received so far, as while frozen, and drops the note in progress. The hops
  // already analyzed are kept, so they can still be shown.
  skip(): void {
    this.nextEnd = Math.max(this.pitch.size, this.buffer.total);
    this.segmenter.reset();
  }

  // The tone color of the note that's sounding, from its harmonics after its first moments.
  liveTimbre(): TimbreProfile | null {
    if (!this.segmenter.inNote) return null;
    const start = this.log.get(this.segmenter.noteStart).t + LIVE_SKIP;
    const frames = this.frames.filter(f => f.t >= start);
    const hops = this.log.slice(this.segmenter.noteStart, this.log.end).filter(h => h.t >= start);
    if (!frames.length || !hops.length) return null;
    return timbreProfile(frames, median(hops.map(h => h.clarity)));
  }

  private step(end: number): NoteReport | null {
    const W = this.pitch.size, L = this.levelBuf.length;
    const center = end - W / 2;
    this.buffer.read(end, this.pitchBuf);
    this.buffer.read(center + L / 2, this.levelBuf);
    let sum = 0;
    for (const x of this.levelBuf) sum += x * x;
    const level = 10 * Math.log10(sum / L + 1e-20) - SINE_RMS_DB;
    const { freq, clarity } = this.pitch.detect(this.pitchBuf);
    const hop: Hop = { t: center / this.sampleRate, level, freq, clarity, midi: freq ? freqToMidi(freq, this.settings.a4) : NaN };
    this.log.push(hop);
    if (this.calibrating) {
      this.recordCalibration(end, level);
      return null;
    }
    const span = this.segmenter.update(this.log.end - 1);

    if (this.hopCount++ % HARMONIC_EVERY === 0) {
      if (this.segmenter.inNote) {
        this.measureHarmonics(end);
        this.quietSince = Infinity;
      } else {
        this.quietSince = Math.min(this.quietSince, end);
        // The background noise is measured once the whole block of audio is between notes.
        if (end - this.quietSince >= this.harmonics.size && this.buffer.holds(end - this.harmonics.size, end)) {
          this.buffer.read(end, this.harmonicBuf);
          this.harmonics.addBackground(this.harmonicBuf);
        }
      }
    }
    while (this.frames.length && this.log.end > this.log.first && this.frames[0].t < this.log.get(this.log.first).t) this.frames.shift();

    if (!span) return null;
    const hops = this.log.slice(span.start, span.end);
    if (!hops.length) return null;
    const t0 = hops[0].t, t1 = hops[hops.length - 1].t;
    if (t1 - t0 < this.settings.minNoteSeconds) {
      this.lastDiscard = { t: t1, reason: `shorter than the shortest note (${Math.round(1000 * (t1 - t0))} ms)` };
      return null;
    }
    const frames = this.frames.filter(f => f.t >= t0 && f.t <= t1);
    const before = this.log.slice(Math.max(this.log.first, span.start - this.prerollHops), span.start);
    const report = analyzeNote(hops, frames, span, this.settings.instrument, before);
    if (!report) {
      this.lastDiscard = { t: t1, reason: "no clear pitch" };
      return null;
    }
    return report;
  }

  private recordCalibration(end: number, level: number): void {
    const c = this.calibrating!, N = this.harmonics.size;
    c.levels.push(level);
    if (this.hopCount++ % HARMONIC_EVERY === 0 && this.buffer.holds(end - N, end)) {
      this.buffer.read(end, this.harmonicBuf);
      c.spectra.push(this.harmonics.powerSpectrum(this.harmonicBuf));
    }
    if (end < c.end || !c.spectra.length) return;
    this.calibrating = null;
    const spectrum = new Float32Array(c.spectra[0].length);
    for (const s of c.spectra) for (let k = 0; k < s.length; k++) spectrum[k] += s[k] / c.spectra.length;
    const calibration: NoiseCalibration = {
      sampleRate: this.sampleRate, fftSize: N, level: median(c.levels), spectrum, savedAt: Date.now(), previous: false,
    };
    this.setCalibration(calibration);
    c.done(calibration);
  }

  // Measures the harmonics of the audio that ends at `end`, using the pitch of the hops around
  // its middle (which the Gauss window weights most).
  private measureHarmonics(end: number): void {
    const N = this.harmonics.size;
    if (!this.buffer.holds(end - N, end)) return;
    const t = (end - N / 2) / this.sampleRate;
    const reach = N / 3 / this.sampleRate; // Where the window falls to about 1%
    const near: Hop[] = [];
    for (let i = this.log.end - 1; i >= this.log.first; i--) {
      const h = this.log.get(i);
      if (h.t < t - reach) break;
      if (h.t <= t + reach && h.freq > 0 && h.clarity >= 0.8) near.push(h);
    }
    if (near.length < 3) return;
    const f0 = median(near.map(h => h.freq));
    const midis = near.map(h => h.midi);
    const spread = 50 * (Math.max(...midis) - Math.min(...midis)); // Half the range, in cents
    this.buffer.read(end, this.harmonicBuf);
    this.frames.push(this.harmonics.measure(this.harmonicBuf, t, f0, spread));
  }
}
