// ╭───────────────────────────────────────────────────────────────╮
// │                Tone color: the strength of each harmonic               │
// ╰───────────────────────────────────────────────────────────────╯
// A note's spectrum has peaks at whole-number multiples of its pitch: the harmonics. How strong
// they are relative to each other is most of what makes a tone sound warm, bright, or thin.
// Every few hops, a Gauss-windowed FFT measures each harmonic's amplitude, using the Gaussian
// peak interpolation shared with the tuner. The amplitudes are averaged over the steady middle
// of a note and summarized as a `TimbreProfile`.
//
// The same FFT also measures the noise: the energy between the harmonics, such as breath, air,
// or bow noise, after removing the room's background noise (measured between notes). It's split
// into bands, since breath and air noise is mostly high, and a crunching bow is broader. The
// energy halfway between the harmonics (the subharmonics) shows a vibration that only repeats
// every second period, as in a crunching bow or a creaky or rough voice.
//
// A profile can be compared with another (`compareProfiles`), so that a recording of a tone to
// imitate can later be used as a reference.

import { FFT, fitPeak, makeWindow } from "../audio/fft";
import { median, linearFit } from "./stats";

export const SHOWN_HARMONICS = 16; // Harmonics in the profile and its chart
const MAX_HARMONIC_HZ = 5000;      // Harmonics are measured up to this frequency…
const MAX_HARMONICS   = 60;        // …or this many, whichever is fewer
const SEARCH_CENTS    = 40;        // Each harmonic's peak is looked for within this many cents of n × f0
const FLOOR_DB        = -80;       // Weaker harmonics are shown at this level (dB below the strongest)
const TILT_FLOOR_DB   = -60;       // Harmonics weaker than this aren't used for the tilt
const BRILLIANCE_LO   = 2000, BRILLIANCE_HI = 4000; // Hz (the singer's formant, or a string's brilliance)
const LOBE_BINS       = 5;         // Half-width of a steady harmonic's peak with the Gauss window (bins)
const SMEAR_MARGIN    = 1.5;       // A moving pitch's peaks are widened by this multiple of how far it moves
const NOISE_MIN_HZ    = 80;        // Noise is measured from this frequency (or half the pitch, if higher)…
const NOISE_MAX_HZ    = 8000;      // …up to this one
export const NOISE_BANDS: [number, number, string][] = [ // Hz, and the band's name
  [0, 1000, "Below 1 kHz"],
  [1000, 4000, "1–4 kHz"],
  [4000, NOISE_MAX_HZ, "4–8 kHz"],
];
const SUBHARMONICS    = 8;         // Subharmonics measured: halfway between harmonics 0 and 1, …, 7 and 8
const BACKGROUND_EASE = 0.1;       // Weight of each new spectrum in the background noise's average
const NOISE_FLOOR_DB  = -70;       // Less noise than this is shown as this (dB)

// ⋘──────── Thresholds of the descriptions ────────⋙
// Warmth runs from 0 (thin) to 1 (warm), and is the average of two scores: how low the
// spectrum's center of mass is (in harmonics), and how strong the fundamental is.
const WARMTH_CENTROID_SPAN = 2;  // A centroid this many harmonics above the fundamental scores 0
const WARMTH_H1_SPAN       = 24; // A fundamental this many dB below the strongest harmonic scores 0
const PURE_OVERTONES_DB    = -20; // Overtones together this far below the fundamental: a pure tone
export const WARMTH_LABELS: [number, string][] = [ // Lowest warmth for each description
  [0.75, "Warm"],
  [0.5,  "Balanced"],
  [0.3,  "Bright"],
  [-Infinity, "Thin"],
];

export interface HarmonicFrame {
  t       : number;       // Time of the middle of the analyzed audio (s)
  f0      : number;       // Pitch used (Hz)
  amps    : Float32Array; // Amplitude of each harmonic (index 0 is the fundamental); NaN above the limit
  harmonic: number;       // Power in the harmonics' peaks, up to NOISE_MAX_HZ
  noise   : Float32Array; // Power between the peaks in each of NOISE_BANDS, less the background noise
  low     : number;       // Power in the peaks of harmonics 1 to SUBHARMONICS
  sub     : number;       // Power at the subharmonics, less the background noise
  subNoise: number;       // The part of `sub` expected from the noise around the subharmonics
}

export interface TimbreProfile {
  f0         : number;   // Hz
  harmonicsDb: number[]; // Harmonics 1 to SHOWN_HARMONICS, in dB below the strongest (NaN above Nyquist)
  centroid   : number;   // Center of mass of the harmonics' power, in harmonics (1 for a pure tone)
  tilt       : number;   // Slope of the harmonics' levels (dB per octave)
  h1h2       : number;   // Level of the fundamental minus the second harmonic (dB)
  oddEven    : number;   // Power of the odd harmonics (from the third) over the even ones (dB)
  overtones  : number;   // Power of all the overtones over the fundamental (dB)
  brilliance : number;   // Share of the harmonics' power between 2 and 4 kHz (dB), or NaN
  hnr        : number;   // Harmonics-to-noise ratio (dB), from the pitch's clarity
  noise      : number;   // Power between the harmonics over the power in them (dB)
  noiseBands : number[]; // The same, for each of NOISE_BANDS (dB)
  subharmonics: number;  // Power at the subharmonics, above the noise around them, over the power in the lowest harmonics (dB)
  warmth     : number;   // 0 (thin) to 1 (warm)
  label      : string;   // "Pure", or the warmth's description
}

export class HarmonicAnalyzer {
  readonly size: number;
  private readonly fft: FFT;
  private readonly win: Float64Array;
  private readonly scale: number;
  private readonly re: Float64Array;
  private readonly im: Float64Array;
  private readonly mags: Float64Array;
  private background: Float64Array | null = null; // Average power of each bin between notes
  calibrated: Float32Array | null = null;         // Power of each bin from a noise calibration, used instead when set

  constructor(size: number, private readonly sampleRate: number) {
    this.size = size;
    this.fft  = new FFT(size);
    const { win, sum } = makeWindow("gauss", size);
    this.win   = win;
    this.scale = 2 / sum; // A full-scale sine has magnitude 1
    this.re    = new Float64Array(size);
    this.im    = new Float64Array(size);
    this.mags  = new Float64Array(size / 2 + 1);
  }

  private spectrum(x: Float32Array | Float64Array): Float64Array {
    const N = this.size, re = this.re, im = this.im, mags = this.mags;
    for (let i = 0; i < N; i++) {
      re[i] = x[i] * this.win[i];
      im[i] = 0;
    }
    this.fft.transform(re, im);
    for (let k = 0; k < mags.length; k++) mags[k] = Math.hypot(re[k], im[k]) * this.scale;
    return mags;
  }

  // The power of each bin in the block of samples x.
  powerSpectrum(x: Float32Array | Float64Array): Float32Array {
    return Float32Array.from(this.spectrum(x), m => m * m);
  }

  // Adds a block of samples heard between notes to the average background noise.
  addBackground(x: Float32Array | Float64Array): void {
    const mags = this.spectrum(x);
    if (!this.background) {
      this.background = mags.map(m => m * m);
      return;
    }
    for (let k = 0; k < mags.length; k++) this.background[k] += (mags[k] * mags[k] - this.background[k]) * BACKGROUND_EASE;
  }

  // The harmonics of f0 and the noise between them in the block of samples x. `spread` is how far
  // (in cents) the pitch moves during the block, which widens the harmonics' peaks.
  measure(x: Float32Array | Float64Array, t: number, f0: number, spread: number): HarmonicFrame {
    const N = this.size, mags = this.spectrum(x);
    const binHz = this.sampleRate / N;
    const count = Math.min(MAX_HARMONICS, Math.floor(MAX_HARMONIC_HZ / f0));
    const amps = new Float32Array(Math.max(count, SHOWN_HARMONICS)).fill(NaN);
    for (let n = 1; n <= count; n++) {
      const f = n * f0;
      const reach = Math.min(2 ** (SEARCH_CENTS / 1200) - 1, 0.45 / n); // Stays clear of the neighboring harmonics
      if (f >= this.sampleRate / 2 - 2 * binHz) break;
      const lo = Math.max(1, Math.floor(f * (1 - reach) / binHz));
      const hi = Math.min(mags.length - 2, Math.ceil(f * (1 + reach) / binHz));
      let k = Math.round(f / binHz);
      for (let j = lo; j <= hi; j++) if (mags[j] > mags[k]) k = j;
      const isPeak = mags[k] > mags[k - 1] && mags[k] >= mags[k + 1];
      amps[n - 1] = isPeak ? (fitPeak(mags, k)?.mag ?? mags[k]) : mags[k];
    }

    // Each bin is in a harmonic's peak, or between the peaks. A peak widens with the harmonic's
    // number when the pitch moves (as with vibrato), and once the peaks touch, there's no room
    // left between them to measure the noise.
    const spacing = f0 / binHz;
    const widening = 2 ** (spread / 1200) - 1;
    const bg = this.calibrated ?? this.background;
    const noise = new Float32Array(NOISE_BANDS.length);
    let harmonic = 0, low = 0, sub = 0, subBins = 0, around = 0, aroundBins = 0;
    const kLo = Math.max(1, Math.ceil(Math.max(NOISE_MIN_HZ, f0 / 2) / binHz));
    const kHi = Math.min(mags.length - 2, Math.ceil(NOISE_MAX_HZ / binHz) - 1);
    for (let k = kLo; k <= kHi; k++) {
      const p = mags[k] * mags[k];
      const n = Math.round(k / spacing);
      const halfWidth = LOBE_BINS + SMEAR_MARGIN * n * spacing * widening;
      if (n >= 1 && Math.abs(k - n * spacing) <= halfWidth) {
        harmonic += p;
        if (n <= SUBHARMONICS) low += p;
        continue;
      }
      // The background is subtracted without stopping at zero, since the noise in each bin rises
      // and falls at random; only the totals are kept from going below zero.
      const extra = p - (bg ? bg[k] : 0);
      const f = k * binHz;
      noise[NOISE_BANDS.findIndex(([lo, hi]) => f >= lo && f < hi)] += extra;
      const m = Math.round(k / spacing - 0.5);
      if (m >= SUBHARMONICS) continue;
      if (Math.abs(k - (m + 0.5) * spacing) <= LOBE_BINS) {
        sub += extra;
        subBins++;
      } else {
        around += extra;
        aroundBins++;
      }
    }
    for (let b = 0; b < noise.length; b++) noise[b] = Math.max(0, noise[b]);
    const subNoise = aroundBins ? Math.max(0, around) / aroundBins * subBins : 0;
    return { t, f0, amps, harmonic, noise, low, sub: Math.max(0, sub), subNoise };
  }
}

// Averages the harmonics' power over the frames and describes the result. `clarity` is the
// median clarity of the pitch over the same time.
export function timbreProfile(frames: HarmonicFrame[], clarity: number): TimbreProfile | null {
  if (!frames.length) return null;
  const count = Math.min(...frames.map(f => f.amps.length));
  const power = new Float64Array(count);
  const used  = new Uint32Array(count);
  for (const frame of frames) {
    for (let n = 0; n < count; n++) {
      const a = frame.amps[n];
      if (Number.isNaN(a)) continue;
      power[n] += a * a;
      used[n]++;
    }
  }
  const f0 = median(frames.map(f => f.f0));
  for (let n = 0; n < count; n++) power[n] = used[n] ? power[n] / used[n] : NaN;

  // The description uses the first SHOWN_HARMONICS harmonics, so that it compares fairly across
  // pitches; the brilliance uses all of them.
  const shown = Array.from(power.slice(0, SHOWN_HARMONICS));
  const strongest = Math.max(...shown.filter(p => !Number.isNaN(p)));
  if (!(strongest > 0)) return null;
  const harmonicsDb = shown.map(p => Number.isNaN(p) ? NaN : Math.max(FLOOR_DB, 10 * Math.log10(p / strongest + 1e-20)));

  let total = 0, moment = 0, odd = 0, even = 0;
  shown.forEach((p, i) => {
    if (Number.isNaN(p)) return;
    total  += p;
    moment += (i + 1) * p;
    if (i >= 2) {
      if (i % 2 === 0) odd += p;
      else even += p;
    }
  });
  const centroid = moment / total;

  // Slope of the harmonics' levels against log₂ of their number, by least squares.
  const xs: number[] = [], ys: number[] = [];
  harmonicsDb.forEach((db, i) => {
    if (db > TILT_FLOOR_DB) { xs.push(Math.log2(i + 1)); ys.push(db); }
  });
  const tilt = xs.length >= 3 ? linearFit(xs, ys).slope : NaN;

  let all = 0, bright = 0;
  for (let n = 0; n < count; n++) {
    if (Number.isNaN(power[n])) continue;
    all += power[n];
    const f = (n + 1) * f0;
    if (f >= BRILLIANCE_LO && f <= BRILLIANCE_HI) bright += power[n];
  }
  const reachesBrilliance = count * f0 >= BRILLIANCE_LO && !Number.isNaN(power[Math.min(count - 1, Math.ceil(BRILLIANCE_LO / f0) - 1)]);

  const p1 = shown[0];
  const overtones = 10 * Math.log10((total - p1) / p1 + 1e-20);
  const h1Db = harmonicsDb[0];
  const centroidScore = clamp01(1 - (centroid - 1) / WARMTH_CENTROID_SPAN);
  const h1Score       = clamp01(1 + h1Db / WARMTH_H1_SPAN);
  const warmth = (centroidScore + h1Score) / 2;
  const c = Math.min(clarity, 0.9999);

  // Noise, from the total power over the frames.
  const sum = (get: (f: HarmonicFrame) => number) => frames.reduce((s, f) => s + get(f), 0);
  const harmonicPower = sum(f => f.harmonic);
  const ratioDb = (p: number, ref: number) => Math.max(NOISE_FLOOR_DB, 10 * Math.log10(p / ref + 1e-20));
  const noiseBands = NOISE_BANDS.map((_, b) => ratioDb(sum(f => f.noise[b]), harmonicPower));
  const noise = ratioDb(sum(f => f.noise.reduce((a, b) => a + b, 0)), harmonicPower);
  const subharmonics = ratioDb(Math.max(0, sum(f => f.sub) - sum(f => f.subNoise)), sum(f => f.low));

  return {
    f0,
    harmonicsDb,
    centroid,
    tilt,
    h1h2      : harmonicsDb[0] - harmonicsDb[1],
    oddEven   : 10 * Math.log10((odd + 1e-20) / (even + 1e-20)),
    overtones,
    brilliance: reachesBrilliance ? 10 * Math.log10(bright / all + 1e-20) : NaN,
    hnr       : 10 * Math.log10(c / (1 - c)),
    noise,
    noiseBands,
    subharmonics,
    warmth,
    label     : overtones < PURE_OVERTONES_DB ? "Pure" : WARMTH_LABELS.find(([min]) => warmth >= min)![1],
  };
}

export interface ProfileComparison {
  distance: number;   // RMS difference of the harmonics' levels (dB)
  diffs   : number[]; // Each harmonic's level in `a` minus its level in `b` (dB)
}

// How different two tones' harmonics are. Not used yet: it's for comparing a note with a
// reference recording of the tone to imitate.
export function compareProfiles(a: TimbreProfile, b: TimbreProfile): ProfileComparison {
  const diffs = a.harmonicsDb.map((db, i) => db - b.harmonicsDb[i]);
  const valid = diffs.filter(d => !Number.isNaN(d));
  const distance = Math.sqrt(valid.reduce((sum, d) => sum + d * d, 0) / Math.max(1, valid.length));
  return { distance, diffs };
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
