// Small statistics helpers for the note quality analysis.

export const mean = (xs: ArrayLike<number>) => {
  let sum = 0;
  for (let i = 0; i < xs.length; i++) sum += xs[i];
  return sum / xs.length;
};

export function median(xs: number[]): number {
  const sorted = [...xs].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function rms(xs: ArrayLike<number>): number {
  let sum = 0;
  for (let i = 0; i < xs.length; i++) sum += xs[i] * xs[i];
  return Math.sqrt(sum / xs.length);
}

// Least-squares line y ≈ intercept + slope x.
export function linearFit(xs: number[], ys: number[]): { slope: number; intercept: number } {
  const mx = mean(xs), my = mean(ys);
  let sxy = 0, sxx = 0;
  for (let i = 0; i < xs.length; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const slope = sxx > 0 ? sxy / sxx : 0;
  return { slope, intercept: my - slope * mx };
}

// Each value minus the least-squares line through the values.
export function detrend(ts: number[], ys: number[]): number[] {
  const { slope, intercept } = linearFit(ts, ys);
  return ys.map((y, i) => y - intercept - slope * ts[i]);
}

// Average of each value with its neighbors within `half` places on either side.
export function movingAverage(ys: number[], half: number): number[] {
  return ys.map((_, i) => {
    const lo = Math.max(0, i - half), hi = Math.min(ys.length - 1, i + half);
    let sum = 0;
    for (let j = lo; j <= hi; j++) sum += ys[j];
    return sum / (hi - lo + 1);
  });
}

// The strongest sinusoid between fLo and fHi in the (zero-mean) values ys at times ts, which may
// be unevenly spaced: its frequency (Hz), its amplitude, and the fraction of the values' variance
// that it explains.
export function strongestOscillation(ts: number[], ys: number[], fLo: number, fHi: number, step = 0.05):
    { freq: number; amp: number; explained: number } {
  const variance = mean(ys.map(y => y * y));
  let best = { freq: 0, amp: 0, explained: 0 };
  for (let f = fLo; f <= fHi + 1e-9; f += step) {
    const w = 2 * Math.PI * f;
    let c = 0, s = 0;
    for (let i = 0; i < ts.length; i++) {
      c += ys[i] * Math.cos(w * ts[i]);
      s += ys[i] * Math.sin(w * ts[i]);
    }
    const amp = 2 * Math.hypot(c, s) / ts.length;
    if (amp > best.amp) best = { freq: f, amp, explained: variance > 0 ? Math.min(1, amp * amp / 2 / variance) : 0 };
  }
  return best;
}
