// ╭───────────────────────────────────────────────────────────────╮
// │            Pitch of a single note (McLeod pitch method)            │
// ╰───────────────────────────────────────────────────────────────╯
// P. McLeod and G. Wyvill, "A Smarter Way to Find Pitch" (2005). The normalized square difference
// function (NSDF) compares a block of audio with itself delayed by τ samples:
//   n(τ) = 2 Σ x[j] x[j+τ] / Σ (x[j]² + x[j+τ]²),
// which is 1 when the signal repeats exactly every τ samples. The pitch's period is the first
// peak of n(τ) that's nearly as high as the highest one, and the height of that peak (the
// "clarity") says how periodic the sound is: near 1 for a clear tone, and lower for breathy,
// scratchy, or noisy sound. The sums Σ x[j] x[j+τ] for all τ come from an FFT.

import { FFT } from "../audio/fft";

const PEAK_RATIO = 0.9;  // A peak this fraction of the highest one counts as the period
const MIN_CLARITY = 0.5; // Below this, the sound isn't treated as having a pitch
const MIN_HZ = 50, MAX_HZ = 2000;

export interface PitchEstimate {
  freq   : number; // Hz, or 0 if there's no clear pitch
  clarity: number; // Height of the NSDF peak, from 0 (noise) to 1 (perfectly periodic)
}

export class PitchDetector {
  readonly size: number; // Samples analyzed at once
  private readonly fft: FFT;
  private readonly re: Float64Array;
  private readonly im: Float64Array;
  private readonly nsdf: Float64Array;

  constructor(size: number, private readonly sampleRate: number) {
    this.size = size;
    this.fft  = new FFT(2 * size); // Padded with zeros, so the autocorrelation doesn't wrap around
    this.re   = new Float64Array(2 * size);
    this.im   = new Float64Array(2 * size);
    this.nsdf = new Float64Array(size / 2 + 2);
  }

  detect(x: Float32Array | Float64Array): PitchEstimate {
    const W = this.size, re = this.re, im = this.im, nsdf = this.nsdf;
    let mean = 0;
    for (let i = 0; i < W; i++) mean += x[i];
    mean /= W;

    // Autocorrelation r(τ) = Σ x[j] x[j+τ], as the transform of the power spectrum. (The power
    // spectrum is real and symmetric, so a forward transform gives the same result as an inverse
    // one, times the length.)
    for (let i = 0; i < 2 * W; i++) {
      re[i] = i < W ? x[i] - mean : 0;
      im[i] = 0;
    }
    this.fft.transform(re, im);
    for (let i = 0; i < 2 * W; i++) {
      re[i] = re[i] * re[i] + im[i] * im[i];
      im[i] = 0;
    }
    this.fft.transform(re, im);
    const scale = 1 / (2 * W);

    // m(τ) = Σ (x[j]² + x[j+τ]²) over the overlap, updated as τ grows.
    const tauMax = Math.min(W / 2, Math.floor(this.sampleRate / MIN_HZ));
    let m = 2 * re[0] * scale;
    if (m <= 1e-12) return { freq: 0, clarity: 0 };
    for (let tau = 0; tau <= tauMax + 1; tau++) {
      if (tau > 0) {
        const a = x[tau - 1] - mean, b = x[W - tau] - mean;
        m -= a * a + b * b;
      }
      nsdf[tau] = m > 1e-12 ? 2 * re[tau] * scale / m : 0;
    }

    // The highest point of each positive stretch of the NSDF, after its first dip below zero.
    const tauMin = Math.floor(this.sampleRate / MAX_HZ);
    const peaks: number[] = [];
    let tau = 1;
    while (tau < tauMax && nsdf[tau] > 0) tau++;
    while (tau < tauMax) {
      while (tau < tauMax && nsdf[tau] <= 0) tau++;
      let best = tau;
      while (tau < tauMax && nsdf[tau] > 0) {
        if (nsdf[tau] > nsdf[best]) best = tau;
        tau++;
      }
      if (best < tauMax && best >= tauMin) peaks.push(best);
    }
    if (!peaks.length) return { freq: 0, clarity: 0 };

    const highest = Math.max(...peaks.map(t => nsdf[t]));
    const chosen = peaks.find(t => nsdf[t] >= PEAK_RATIO * highest)!;
    // A parabola through the peak and its neighbors locates it between samples.
    const a = nsdf[chosen - 1], b = nsdf[chosen], c = nsdf[chosen + 1];
    const denom = a - 2 * b + c;
    const delta = denom < 0 ? 0.5 * (a - c) / denom : 0;
    const clarity = Math.min(1, b - 0.25 * (a - c) * delta);
    if (clarity < MIN_CLARITY) return { freq: 0, clarity };
    return { freq: this.sampleRate / (chosen + delta), clarity };
  }
}
