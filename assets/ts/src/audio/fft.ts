// ╭───────────────────────────────────────────────────────────────╮
// │          FFT, window functions, and peak interpolation          │
// ╰───────────────────────────────────────────────────────────────╯
// Shared by the audio tools (the multi-note tuner and the note quality analyzer).

const EPS = 1e-12;
export const GAUSS_ALPHA   = 0.25; // Width of the Gauss window, as a fraction of half its length (Minim's default)
export const MAX_PEAK_GAIN = 1.6;  // Most that interpolation can put a peak above its highest bin (the rectangular window's worst case)

export type WindowFunction = (n: number, N: number) => number;
export const WINDOWS: Record<string, WindowFunction> = {
  rectangular  : () => 1,
  bartlett     : (n, N) => 1 - Math.abs(2 * n / (N - 1) - 1),
  bartletthann : (n, N) => 0.62 - 0.48 * Math.abs(n / (N - 1) - 0.5) - 0.38 * Math.cos(2 * Math.PI * n / (N - 1)),
  blackman     : (n, N) => 0.42 - 0.5 * Math.cos(2 * Math.PI * n / (N - 1)) + 0.08 * Math.cos(4 * Math.PI * n / (N - 1)),
  cosine       : (n, N) => Math.sin(Math.PI * n / (N - 1)),
  gauss        : (n, N) => Math.exp(-0.5 * ((n - (N - 1) / 2) / (GAUSS_ALPHA * (N - 1) / 2)) ** 2),
  hamming      : (n, N) => 0.54 - 0.46 * Math.cos(2 * Math.PI * n / (N - 1)),
  hann         : (n, N) => 0.5 - 0.5 * Math.cos(2 * Math.PI * n / (N - 1)),
  lanczos      : (n, N) => {
    const x = 2 * n / (N - 1) - 1;
    return x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);
  },
  triangular   : (n, N) => 1 - Math.abs((n - (N - 1) / 2) / (N / 2)),
};

// In-place radix-2 FFT of a power-of-two length.
export class FFT {
  readonly size: number;
  private readonly reversed: Uint32Array;
  private readonly cos: Float64Array;
  private readonly sin: Float64Array;

  constructor(size: number) {
    this.size = size;
    const bits = Math.log2(size);
    this.reversed = new Uint32Array(size);
    for (let i = 0; i < size; i++) {
      let r = 0;
      for (let b = 0; b < bits; b++) r |= ((i >> b) & 1) << (bits - 1 - b);
      this.reversed[i] = r;
    }
    this.cos = new Float64Array(size / 2);
    this.sin = new Float64Array(size / 2);
    for (let k = 0; k < size / 2; k++) {
      this.cos[k] = Math.cos(2 * Math.PI * k / size);
      this.sin[k] = Math.sin(2 * Math.PI * k / size);
    }
  }

  transform(re: Float64Array, im: Float64Array): void {
    const n = this.size;
    for (let i = 0; i < n; i++) {
      const j = this.reversed[i];
      if (j > i) {
        [re[i], re[j]] = [re[j], re[i]];
        [im[i], im[j]] = [im[j], im[i]];
      }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const half = len >> 1, step = n / len;
      for (let i = 0; i < n; i += len) {
        for (let j = 0; j < half; j++) {
          const wr = this.cos[j * step], wi = -this.sin[j * step];
          const a = i + j, b = a + half;
          const tr = re[b] * wr - im[b] * wi;
          const ti = re[b] * wi + im[b] * wr;
          re[b] = re[a] - tr;
          im[b] = im[a] - ti;
          re[a] += tr;
          im[a] += ti;
        }
      }
    }
  }
}

// A window function's values for a block of N samples, and their sum.
export function makeWindow(name: string, N: number): { win: Float64Array; sum: number } {
  const w = WINDOWS[name];
  const win = new Float64Array(N);
  let sum = 0;
  for (let n = 0; n < N; n++) sum += win[n] = w(n, N);
  return { win, sum };
}

export interface PeakFit {
  delta: number; // Offset of the peak from bin k, in bins (between −½ and ½)
  mag  : number; // Interpolated peak magnitude
  curv : number; // Curvature of ln(magnitude) at the peak, per bin² (negative)
}

// Fits a Gaussian through bins k − 1, k, and k + 1 of a magnitude spectrum, which is a parabola
// through the logarithms of their magnitudes, and returns its peak.
export function fitPeak(spectrum: ArrayLike<number>, k: number): PeakFit | null {
  const la = Math.log(spectrum[k - 1] + EPS);
  const lb = Math.log(spectrum[k] + EPS);
  const lc = Math.log(spectrum[k + 1] + EPS);
  const denom = la - 2 * lb + lc;
  if (!(denom < 0)) return null;
  const delta = 0.5 * (la - lc) / denom;
  return {
    delta,
    // When a neighboring bin is nearly zero (as after removing background noise), the parabola
    // through the logarithms is very lopsided and overshoots, so the peak is capped at the most
    // that any of the windows can put it above its highest bin.
    mag : Math.min(Math.exp(lb - 0.25 * (la - lc) * delta), MAX_PEAK_GAIN * spectrum[k]),
    curv: denom / 2,
  };
}
