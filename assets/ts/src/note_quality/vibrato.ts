// ╭───────────────────────────────────────────────────────────────╮
// │        Vibrato: the spectrum of the pitch's oscillations        │
// ╰───────────────────────────────────────────────────────────────╯
// Vibrato is a frequency modulation: the pitch itself oscillates. Its rate and extent come from a
// second Fourier transform, of the pitch trace (in cents) rather than of the sound. Every few hops,
// the last second of pitch has its straight-line trend removed (so a slide or drift doesn't count),
// is multiplied by a Hann window, and is transformed. A sinusoidal swing of ±A cents at f Hz then
// makes a peak of height A at f. The results are kept by hop, so each one is computed only once.

import { FFT } from "../audio/fft";
import { linearFit, median } from "./stats";
import type { HopLog } from "./segmenter";

const WINDOW_SECONDS = 1;    // Length of the pitch trace that's transformed
const PAD            = 4;    // The trace is padded with zeros to this many times its length (finer bins)
const MAX_HZ         = 15;   // Highest modulation rate kept
const CLEAR          = 0.8;  // Hops at least this clear have a usable pitch
const MIN_CLEAR      = 0.8;  // Share of the window's hops that must be clear
const MAX_JUMP       = 0.5;  // A jump between clear hops larger than this (semitones) is a new note
const MAX_SHIFT      = 50;   // So is a difference this large (cents) between the window's first and last quarters
export const STEP_HOPS = 4;  // Hops between spectra

export interface ModulationSpectrum {
  t   : number;       // Time of the middle of the window (s)
  amps: Float32Array; // Amplitude (cents) at each bin, from 0 Hz in steps of `binHz`
  swing: number;      // Amplitude (cents) of a sine wave as strong as all of the window's movement
}

export class ModulationAnalyzer {
  readonly windowHops: number;
  readonly binHz: number;
  private readonly fft: FFT;
  private readonly win: Float64Array;
  private readonly winSum: number;
  private readonly re: Float64Array;
  private readonly im: Float64Array;
  private readonly cache = new Map<number, ModulationSpectrum | null>(); // By the number of the window's last hop

  constructor(private readonly hopSeconds: number) {
    this.windowHops = Math.round(WINDOW_SECONDS / hopSeconds);
    const size = 2 ** Math.ceil(Math.log2(this.windowHops * PAD));
    this.fft = new FFT(size);
    this.binHz = 1 / (size * hopSeconds);
    this.win = Float64Array.from({ length: this.windowHops }, (_, n) => 0.5 - 0.5 * Math.cos(2 * Math.PI * (n + 0.5) / this.windowHops));
    this.winSum = this.win.reduce((a, b) => a + b, 0);
    this.re = new Float64Array(size);
    this.im = new Float64Array(size);
  }

  // The spectra whose windows end at hops first + windowHops … log.end − 1 (every STEP_HOPS),
  // or null where the pitch isn't usable. Computes any that are new, and forgets older ones.
  spectra(log: HopLog, first: number): (ModulationSpectrum | null)[] {
    for (const key of this.cache.keys()) if (key < log.first + this.windowHops) this.cache.delete(key);
    const out: (ModulationSpectrum | null)[] = [];
    const start = Math.ceil((Math.max(first, log.first) + this.windowHops) / STEP_HOPS) * STEP_HOPS;
    for (let end = start; end < log.end; end += STEP_HOPS) {
      if (!this.cache.has(end)) this.cache.set(end, this.compute(log, end));
      out.push(this.cache.get(end)!);
    }
    return out;
  }

  private compute(log: HopLog, end: number): ModulationSpectrum | null {
    const N = this.windowHops, start = end - N + 1;
    if (!log.has(start)) return null;
    // The pitch of each hop, with short unclear stretches filled in by straight lines.
    const ts: number[] = [], ms: number[] = [];
    let last = NaN;
    for (let i = start; i <= end; i++) {
      const hop = log.get(i);
      if (hop.clarity < CLEAR || !Number.isFinite(hop.midi)) continue;
      if (Math.abs(hop.midi - last) > MAX_JUMP) return null;
      ts.push(i - start);
      ms.push(hop.midi);
      last = hop.midi;
    }
    if (ts.length < MIN_CLEAR * N) return null;
    const cents = new Float64Array(N);
    for (let k = 0, n = 0; n < N; n++) {
      while (k + 1 < ts.length && ts[k + 1] <= n) k++;
      const a = ts[k], b = ts[Math.min(k + 1, ts.length - 1)];
      const ma = ms[k], mb = ms[Math.min(k + 1, ms.length - 1)];
      cents[n] = 100 * (n <= a ? ma : n >= b ? mb : ma + (mb - ma) * (n - a) / (b - a));
    }
    // A window that spans a change of note, even a quick glide, isn't the movement of one note.
    // (The quarters' medians are near the note's center, whatever its vibrato.)
    const quarter = Math.floor(N / 4);
    const firstQuarter = median(Array.from(cents.subarray(0, quarter)));
    const lastQuarter  = median(Array.from(cents.subarray(N - quarter)));
    if (Math.abs(lastQuarter - firstQuarter) > MAX_SHIFT) return null;

    const xs = Array.from({ length: N }, (_, n) => n);
    const { slope, intercept } = linearFit(xs, Array.from(cents));

    const re = this.re, im = this.im;
    re.fill(0);
    im.fill(0);
    let power = 0;
    for (let n = 0; n < N; n++) {
      const x = cents[n] - intercept - slope * n;
      power += x * x / N;
      re[n] = x * this.win[n];
    }
    this.fft.transform(re, im);
    const bins = Math.min(re.length / 2, Math.ceil(MAX_HZ / this.binHz) + 1);
    const amps = new Float32Array(bins);
    for (let k = 0; k < bins; k++) amps[k] = 2 * Math.hypot(re[k], im[k]) / this.winSum;
    return { t: log.get(start).t + (log.get(end).t - log.get(start).t) / 2, amps, swing: Math.sqrt(2 * power) };
  }
}

// The highest peak of a spectrum between lo and hi Hz, located between bins by a parabola.
export function modulationPeak(amps: ArrayLike<number>, binHz: number, lo: number, hi: number): { rate: number; extent: number } {
  let best = -1;
  for (let k = Math.max(1, Math.ceil(lo / binHz)); k <= Math.min(amps.length - 2, Math.floor(hi / binHz)); k++) {
    if (best < 0 || amps[k] > amps[best]) best = k;
  }
  if (best < 0) return { rate: NaN, extent: 0 };
  const a = amps[best - 1], b = amps[best], c = amps[best + 1];
  const denom = a - 2 * b + c;
  const delta = denom < 0 ? 0.5 * (a - c) / denom : 0;
  return { rate: (best + delta) * binHz, extent: b - 0.25 * (a - c) * delta };
}
