// ╭───────────────────────────────────────────────────────────────╮
// │     Multi-note Music Tuner: finding peaks and their notes      │
// ╰───────────────────────────────────────────────────────────────╯
// The spectrum analysis for ../multi_note_tuner.ts (see there for an overview), with no page or
// audio code, so it can be tested.

import { fitPeak } from "../audio/fft";
import { freqToMidi } from "../audio/notes";

// ⋘──────── Constants ────────⋙

export const DETECT_MIN_HZ   = 25;   // Peaks are searched for between these frequencies
export const DETECT_MAX_HZ   = 10000;
export const MAX_PEAKS       = 16;   // The strongest peaks kept in each frame
export const HARMONIC_CENTS  = 35;   // How close a peak must be to n × a lower peak to count as its harmonic
export const WEAK_HARMONIC    = 0.003; // Quietest harmonic (relative to the loudest peak) that's marked below the threshold
export const WEAK_FUNDAMENTAL = 0.003; // Quietest fundamental (relative to the loudest peak) that's restored below the threshold (−50 dB, since laptop microphones pick up little below about 150 Hz)
export const N_HARMONICS     = 10;   // Highest harmonic of a note that's marked when it's below the threshold

export interface Peak {
  freq       : number;      // Interpolated center frequency (Hz)
  mag        : number;      // Interpolated peak magnitude
  bin        : number;      // Magnitude of the peak's highest bin, as drawn on the spectrum
  curv       : number;      // Curvature of ln(magnitude) at the peak, per Hz² (negative)
  midi       : number;
  fundamental: Peak | null; // The lower peak that this one is a harmonic of, if any
  harmonic   : number;      // Which harmonic of `fundamental` this is (1 if it isn't a harmonic)
}

export interface PeakOptions {
  threshold     : number;   // Peaks weaker than this fraction of the strongest are ignored
  minDb         : number;   // Peaks quieter than this (dB relative to a full-scale sine) are ignored
  hideHarmonics : boolean;  // Also mark quieter peaks at the notes' harmonics as harmonics
  a4            : number;   // Reference pitch of A4 (Hz)
}

// ⋘──────── Peaks ────────⋙

// Fits a Gaussian through bins k − 1, k, and k + 1, which is a parabola through the logarithms of
// their magnitudes, and returns its peak.
export function interpolatePeak(spectrum: ArrayLike<number>, k: number, binHz: number, a4: number): Peak | null {
  const fit = fitPeak(spectrum, k);
  if (!fit) return null;
  const freq = (k + fit.delta) * binHz;
  return {
    freq,
    mag        : fit.mag,
    bin        : spectrum[k],
    curv       : fit.curv / (binHz * binHz),
    midi       : freqToMidi(freq, a4),
    fundamental: null,
    harmonic   : 1,
  };
}

// The peaks of a magnitude spectrum with bins binHz apart, lowest first, and the level below which
// peaks were ignored.
export function findPeaks(spectrum: ArrayLike<number>, binHz: number, options: PeakOptions): { peaks: Peak[]; floor: number } {
  const kLo = Math.max(2, Math.ceil(DETECT_MIN_HZ / binHz));
  const kHi = Math.min(spectrum.length - 2, Math.floor(DETECT_MAX_HZ / binHz));
  const candidates: Peak[] = [];
  let strongest = 0;
  for (let k = kLo; k <= kHi; k++) {
    if (spectrum[k] > spectrum[k - 1] && spectrum[k] >= spectrum[k + 1]) {
      const p = interpolatePeak(spectrum, k, binHz, options.a4);
      if (!p) continue;
      candidates.push(p);
      strongest = Math.max(strongest, p.bin);
    }
  }
  // Peaks are compared with the cutoffs by their highest bins, so that what's counted matches
  // the spectrum and the cutoff line drawn on it.
  const minMag = 10 ** (options.minDb / 20);
  const floor  = Math.max(options.threshold * strongest, minMag);
  candidates.sort((a, b) => b.bin - a.bin);
  const found = candidates.filter(p => p.bin >= floor).slice(0, MAX_PEAKS);

  // A note's fundamental can be much quieter than its harmonics (as on a violin's G string), so
  // a quieter peak is kept if at least two of the peaks found are its harmonics.
  const explained = new Set<Peak>();
  for (const c of candidates) {
    if (c.bin >= floor || c.bin < Math.max(WEAK_FUNDAMENTAL * strongest, minMag)) continue;
    const overtones = found.filter(p => !explained.has(p) && harmonicNumber(p.freq, c.freq) > 0);
    if (overtones.length >= 2) {
      found.push(c);
      overtones.forEach(p => explained.add(p));
    }
  }
  found.sort((a, b) => a.freq - b.freq);

  // Marks each peak that sits at a whole-number multiple of a lower peak as that peak's harmonic.
  for (const p of found) {
    for (const q of found) {
      if (q.freq >= p.freq) break;
      if (q.fundamental) continue;
      const n = harmonicNumber(p.freq, q.freq);
      if (n) {
        p.fundamental = q;
        p.harmonic    = n;
        break;
      }
    }
  }

  // Quieter peaks at the harmonics of the notes found are marked as harmonics too (but never
  // named as notes): for each note and each harmonic it doesn't have yet, the strongest candidate
  // there that's at least WEAK_HARMONIC of the loudest peak (and above the quietest-peak level).
  if (options.hideHarmonics) {
    const taken = new Set(found);
    const weakest = Math.max(WEAK_HARMONIC * strongest, minMag);
    for (const q of found.filter(p => !p.fundamental)) {
      const has = new Set(found.filter(p => p.fundamental === q).map(p => p.harmonic));
      for (const c of candidates) { // Loudest first
        if (c.bin < weakest) break;
        const n = harmonicNumber(c.freq, q.freq);
        if (!n || n > N_HARMONICS || has.has(n) || taken.has(c)) continue;
        c.fundamental = q;
        c.harmonic    = n;
        has.add(n);
        taken.add(c);
        found.push(c);
      }
    }
    found.sort((a, b) => a.freq - b.freq);
  }
  return { peaks: found, floor };
}

// n if f is close to the nth harmonic of f0 (for n ≥ 2), and otherwise 0.
export function harmonicNumber(f: number, f0: number): number {
  const ratio = f / f0, n = Math.round(ratio);
  return n >= 2 && Math.abs(1200 * Math.log2(ratio / n)) < HARMONIC_CENTS ? n : 0;
}

// ⋘──────── Background noise ────────⋙

// The background noise level of each bin, from spectra recorded in silence: each bin's
// `percentile` level over the recordings, then the largest of those within `spread` bins, so a
// noise peak that wanders a little is still covered.
export function noiseLevels(frames: Float32Array[], percentile: number, spread: number): Float32Array {
  const bins = frames[0].length;
  const levels = new Float32Array(bins), values = new Float32Array(frames.length);
  for (let k = 0; k < bins; k++) {
    frames.forEach((frame, i) => values[i] = frame[k]);
    values.sort();
    levels[k] = values[Math.floor(percentile * (values.length - 1))];
  }
  const level = new Float32Array(bins);
  for (let k = 0; k < bins; k++) {
    for (let j = Math.max(0, k - spread); j <= Math.min(bins - 1, k + spread); j++) {
      level[k] = Math.max(level[k], levels[j]);
    }
  }
  return level;
}

// ⋘──────── Notes over time ────────⋙

export interface HistoryNote { midi: number; level: number; }
export interface HistoryFrame { t: number; notes: HistoryNote[]; hiddenAbove?: boolean; hiddenBelow?: boolean; }

// The notes heard since time `since`, from highest to lowest pitch: each note (by its nearest
// semitone), when it was last heard, and its loudest level.
export function tunerLanes(history: HistoryFrame[], since: number): { row: number; last: number; level: number }[] {
  const lanes = new Map<number, { row: number; last: number; level: number }>();
  for (let i = history.length - 1; i >= 0 && history[i].t >= since; i--) {
    for (const n of history[i].notes) {
      const row = Math.round(n.midi), lane = lanes.get(row);
      if (!lane) lanes.set(row, { row, last: history[i].t, level: n.level });
      else lane.level = Math.max(lane.level, n.level);
    }
  }
  return [...lanes.values()].sort((a, b) => b.row - a.row);
}

// ⋘──────── Colors and text ────────⋙

// The color of a pitch, running through the rainbow from low to high (as in the original sketch).
export const pitchHue = (midi: number) => (((midi - 21) / 130) * 360 - 18 + 360) % 360;

// Green when in tune, through yellow, to red at a quarter tone off.
export const centsColor = (cents: number) => `hsl(${120 * (1 - Math.min(1, Math.abs(cents) / 50))}, 80%, 55%)`;

// The peak threshold as shown in the settings: a fraction of the loudest peak, or in decibels.
export function formatThreshold(threshold: number, scale: "linear" | "db"): string {
  return scale === "db" ? `−${(-20 * Math.log10(threshold)).toFixed(1)} dB` : threshold.toFixed(2);
}
