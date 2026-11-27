// ╭───────────────────────────────────────────────────────────────╮
// │        Functions of one variable for the dictionary's plots      │
// ╰───────────────────────────────────────────────────────────────╯
// The functions that the plots of graphs, integrals, and probability densities draw, and the
// numerical work they need: integrals, Riemann sums, and where a function changes sign.

export type Fn = (x: number) => number;

/** A function that a figure can name in its params, with the part of the plane to show. */
export interface NamedFunction {
  f: Fn;
  /** The function's formula in TeX, after "f(x) = ". */
  tex: string;
  /** The formula in HTML, evaluated at the number written as `x` (such as "1.50" or "−1.50"). */
  html: (x: string) => string;
  /** The part of the plane to show: [xMin, xMax] and [yMin, yMax]. */
  x: [number, number];
  y: [number, number];
  /** Where the draggable endpoints a and b start. */
  a: number;
  b: number;
}

/** The density of the standard normal distribution. */
export const normalPdf: Fn = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);

/** The cumulative distribution function of the standard normal distribution. */
export function normalCdf(x: number): number {
  // Φ(0) = 1/2, plus the integral of the density from 0 to x (by Simpson's rule).
  if (x < -8) return 0;
  if (x > 8) return 1;
  return x >= 0 ? 0.5 + integrate(normalPdf, 0, x, 800) : 0.5 - integrate(normalPdf, x, 0, 800);
}

export const FUNCTIONS: Record<string, NamedFunction> = {
  // Positive, then negative, then positive again, so that dragging b to the right shows negative area.
  "half-plus-sine": { f: x => 0.5 + Math.sin(x), tex: "\\tfrac{1}{2} + \\sin x", html: x => `½ + sin ${x}`, x: [-0.6, 7.2], y: [-0.9, 1.9], a: 0.5, b: 3 },
  "square": { f: x => x * x, tex: "x^2", html: x => `${x.startsWith("−") ? `(${x})` : x}<sup>2</sup>`, x: [-2.6, 2.6], y: [-0.6, 4.6], a: 0, b: 1.5 },
  "normal": { f: normalPdf, tex: "\\tfrac{1}{\\sqrt{2\\pi}} e^{-x^2/2}", html: x => `e<sup>−(${x})²/2</sup>/√(2π)`, x: [-3.6, 3.6], y: [-0.06, 0.5], a: -1, b: 1 },
};

/**
 * The centroid of the region between the graph of f and the x-axis from x0 to x1, where f keeps its sign: the point
 * at which to label the region's area. (For a region below the axis, the centroid is below it too.)
 */
export function areaCentroid(f: Fn, x0: number, x1: number, n = 200): [number, number] {
  let m = 0, mx = 0, my = 0;
  const h = (x1 - x0) / n;
  for (let i = 0; i < n; i++) {
    const x = x0 + (i + 0.5) * h, y = f(x);
    m += y * h;
    mx += x * y * h;
    my += (y * y * h) / 2;
  }
  return m === 0 ? [(x0 + x1) / 2, 0] : [mx / m, my / m];
}

/** A formula's TeX (in the variable x) evaluated at the TeX number `value`, in parentheses, as in "(1.50)^2". */
export const texAt = (tex: string, value: string) => tex.replace(/(?<![\\a-zA-Z])x(?![a-zA-Z])/g, `(${value})`);

/**
 * The integral of f from a to b by Simpson's rule with `n` subintervals (rounded up to an even
 * number). It is negative when b < a.
 */
export function integrate(f: Fn, a: number, b: number, n = 400): number {
  if (a === b) return 0;
  const m = n + (n % 2);
  const h = (b - a) / m;
  let sum = f(a) + f(b);
  for (let i = 1; i < m; i++) sum += (i % 2 ? 4 : 2) * f(a + i * h);
  return (sum * h) / 3;
}

/** Where each rectangle of a Riemann sum samples the function, in its subinterval. */
export type Tag = "left" | "midpoint" | "right";

export interface RiemannRect {
  /** The subinterval [x0, x1]. */
  x0: number;
  x1: number;
  /** The sample point t in [x0, x1] and the height f(t). */
  t: number;
  height: number;
}

/** The rectangles of the Riemann sum of f over n equal subintervals of [a, b]. */
export function riemannRects(f: Fn, a: number, b: number, n: number, tag: Tag): RiemannRect[] {
  const w = (b - a) / n;
  const along = tag === "left" ? 0 : tag === "right" ? 1 : 0.5;
  return Array.from({ length: n }, (_, k) => {
    const x0 = a + k * w, x1 = a + (k + 1) * w;
    const t = x0 + along * w;
    return { x0, x1, t, height: f(t) };
  });
}

/** The Riemann sum Σ f(t_k) (x_k − x_{k−1}) of the rectangles. */
export const riemannSum = (rects: RiemannRect[]) => rects.reduce((s, r) => s + r.height * (r.x1 - r.x0), 0);

/** A piece of [a, b] where f keeps one sign: +1 where f ≥ 0 and −1 where f < 0. */
export interface SignPiece { x0: number; x1: number; sign: 1 | -1 }

/**
 * Splits [a, b] into the pieces where f keeps its sign, finding each zero between `samples`
 * equally spaced points by bisection. (Zeros closer together than the spacing can be missed.)
 */
export function signPieces(f: Fn, a: number, b: number, samples = 200): SignPiece[] {
  if (!(b > a)) return [];
  const sign = (x: number): 1 | -1 => (f(x) >= 0 ? 1 : -1);
  const pieces: SignPiece[] = [];
  let start = a, s = sign(a);
  // The sign at a lone zero (f(a) = 0, say) is taken from just inside, so a piece isn't split at a touch.
  if (f(a) === 0) s = sign(a + (b - a) / samples / 2);
  let prev = a;
  for (let i = 1; i <= samples; i++) {
    const x = a + ((b - a) * i) / samples;
    if (sign(x) !== s && f(x) !== 0) {
      let lo = prev, hi = x;
      for (let k = 0; k < 50; k++) {
        const mid = (lo + hi) / 2;
        if (sign(mid) === s && f(mid) !== 0) lo = mid; else hi = mid;
      }
      pieces.push({ x0: start, x1: hi, sign: s });
      start = hi;
      s = sign(x);
    }
    prev = x;
  }
  pieces.push({ x0: start, x1: b, sign: s });
  return pieces;
}

/** Points (x, f(x)) from x0 to x1, for drawing the graph. */
export function sample(f: Fn, x0: number, x1: number, n = 300): [number, number][] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / n;
    return [x, f(x)];
  });
}
