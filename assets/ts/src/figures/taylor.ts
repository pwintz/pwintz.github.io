// ╭───────────────────────────────────────────────────────────────╮
// │           Taylor polynomials of a function at a point            │
// ╰───────────────────────────────────────────────────────────────╯
// The graph of a function and of its Taylor polynomial of degree n at a point a, with a slider for n and the
// polynomial written out in a box. With `drag`, the reader drags a along the x-axis.
//
// Params (all optional):
//   fn:         a key of TAYLOR_FUNCTIONS (default "sin").
//   at:         the center a (default 0).
//   drag:       whether the reader can drag a (default false).
//   degree:     the degree n shown first (default 1).
//   max_degree: the largest degree on the slider (default 15).
//   x, y:       the ranges shown (default: the function's own).

import { OKABE_ITO } from "../common/scene3d";
import { Fn } from "./expression";
import { sampleRuns } from "./function_plot";
import { HANDLE, dragEndpoints, drawEndpoint } from "./integral";
import { Plot2D, canvasRect } from "./plot2d";
import { Widget, addSlider, fixed, it, showCalc, showKey, texHTML, texNumber } from "./widget";

const CURVE = OKABE_ITO.blue;
const POLY = OKABE_ITO.vermillion;

/** A term of a Taylor polynomial at 0 in exact form: its sign and its TeX without the sign, or null for a zero term. */
type ExactTerm = { negative: boolean; tex: string } | null;

export interface TaylorFunction {
  /** The function's formula in TeX, such as "\sin x". */
  tex: string;
  f: Fn;
  /** The k-th derivative at a. */
  derivative: (k: number, a: number) => number;
  /** The k-th term of the Taylor polynomial at 0, exactly. */
  termAt0: (k: number) => ExactTerm;
  /** Whether a can be the center (in the domain, where the derivatives exist). */
  center: (a: number) => boolean;
  x: [number, number];
  y: [number, number];
}

/** The power x^k in TeX: "" for k = 0, "x" for k = 1. */
export const powerTex = (k: number, base = "x") => (k === 0 ? "" : k === 1 ? base : `${base}^{${k}}`);

/** The term c · x^k / d in TeX, with "1" for an empty numerator, and no fraction for d = "1". */
const ratio = (k: number, d: string, negative: boolean): ExactTerm => {
  const top = powerTex(k) || "1";
  return { negative, tex: d === "1" ? top : `\\frac{${top}}{${d}}` };
};
const factorial = (k: number) => (k <= 1 ? "1" : `${k}!`);

export const TAYLOR_FUNCTIONS: Record<string, TaylorFunction> = {
  sin: {
    tex: "\\sin x", f: Math.sin,
    derivative: (k, a) => Math.sin(a + (k * Math.PI) / 2),
    termAt0: k => (k % 2 === 0 ? null : ratio(k, factorial(k), (k - 1) % 4 === 2)),
    center: () => true, x: [-7, 7], y: [-2.5, 2.5],
  },
  cos: {
    tex: "\\cos x", f: Math.cos,
    derivative: (k, a) => Math.cos(a + (k * Math.PI) / 2),
    termAt0: k => (k % 2 === 1 ? null : ratio(k, factorial(k), k % 4 === 2)),
    center: () => true, x: [-7, 7], y: [-2.5, 2.5],
  },
  exp: {
    tex: "e^x", f: Math.exp,
    derivative: (_k, a) => Math.exp(a),
    termAt0: k => ratio(k, factorial(k), false),
    center: () => true, x: [-4, 3], y: [-2, 8],
  },
  // ln(1 + x), whose Taylor series at 0 converges only for −1 < x ≤ 1.
  ln1p: {
    tex: "\\ln(1 + x)", f: x => (x > -1 ? Math.log1p(x) : NaN),
    derivative: (k, a) => {
      if (k === 0) return Math.log1p(a);
      let g = 1;
      for (let j = 2; j < k; j++) g *= j;
      return ((k % 2 === 1 ? 1 : -1) * g) / Math.pow(1 + a, k);
    },
    termAt0: k => (k === 0 ? null : ratio(k, String(k), k % 2 === 0)),
    center: a => a > -1, x: [-1.5, 3], y: [-3, 2.5],
  },
  // 1 / (1 − x), whose Taylor series at 0 is the geometric series, which converges only for −1 < x < 1.
  geometric: {
    tex: "\\frac{1}{1 - x}", f: x => 1 / (1 - x),
    derivative: (k, a) => {
      let g = 1;
      for (let j = 2; j <= k; j++) g *= j;
      return g / Math.pow(1 - a, k + 1);
    },
    termAt0: k => ratio(k, "1", false),
    center: a => a < 1, x: [-2.5, 2], y: [-2, 5],
  },
};

/** The coefficients f^(k)(a) / k! of the Taylor polynomial of degree n at a, for k = 0, …, n. */
export function taylorCoefficients(fn: TaylorFunction, a: number, n: number): number[] {
  const out: number[] = [];
  let factorialK = 1;
  for (let k = 0; k <= n; k++) {
    if (k > 0) factorialK *= k;
    out.push(fn.derivative(k, a) / factorialK);
  }
  return out;
}

/** The value at x of the polynomial with these coefficients in powers of (x − a). */
export function evaluateAt(coefficients: number[], a: number, x: number): number {
  let y = 0;
  for (let k = coefficients.length - 1; k >= 0; k--) y = y * (x - a) + coefficients[k];
  return y;
}

/**
 * The Taylor polynomial in TeX, without "P_n(x) =": exact at a = 0, and otherwise with coefficients to three decimals
 * in powers of (x − a). Zero terms are left out, and a long polynomial shows its first three terms, a "⋯", and its last.
 */
export function taylorTex(fn: TaylorFunction, a: number, n: number): string {
  const terms: { negative: boolean; tex: string }[] = [];
  if (a === 0) {
    for (let k = 0; k <= n; k++) {
      const t = fn.termAt0(k);
      if (t) terms.push(t);
    }
  } else {
    const shift = `(x ${a < 0 ? "+" : "-"} ${texNumber(fixed(Math.abs(a)))})`;
    taylorCoefficients(fn, a, n).forEach((c, k) => {
      const digits = fixed(Math.abs(c), 3);
      if (Number(digits) === 0) return;
      const power = powerTex(k, shift);
      terms.push({ negative: c < 0, tex: power ? (digits === "1.000" ? power : `${digits}\\,${power}`) : digits });
    });
  }
  if (terms.length === 0) return "0";
  const shown = terms.length > 5 ? [...terms.slice(0, 3), null, terms[terms.length - 1]] : terms;
  return shown.map((t, i) => {
    if (!t) return " + \\cdots";
    return i === 0 ? `${t.negative ? "-" : ""}${t.tex}` : ` ${t.negative ? "-" : "+"} ${t.tex}`;
  }).join("");
}

export const taylor: Widget = env => {
  const p = env.params;
  const fn = TAYLOR_FUNCTIONS[String(p.fn ?? "sin")] ?? TAYLOR_FUNCTIONS.sin;
  const xRange = (p.x as [number, number] | undefined) ?? fn.x;
  const yRange = (p.y as [number, number] | undefined) ?? fn.y;
  const maxDegree = Number(p.max_degree ?? 15);
  let n = Math.min(maxDegree, Number(p.degree ?? 1));
  const center = { a: Number(p.at ?? 0) };
  addSlider(env, `Degree ${it("n")}`, { min: 0, max: maxDegree, step: 1, value: n }, v => { n = v; });

  let plot = new Plot2D(env.scene, { x: 0, y: 0, w: 1, h: 1 }, xRange, yRange);
  if (p.drag === true) dragEndpoints(env, () => plot, center, [], fn.center);

  return () => {
    const s = env.scene;
    s.begin(env.canvas, { dim: 2, yaw: 0, pitch: 0, perspective: false, center: [0, 0, 0], extent: 1 });
    plot = new Plot2D(s, canvasRect(s, 4, env.calc, env.key), xRange, yRange);
    const { a } = center;
    plot.axes({ names: [{ text: "x", tex: "x" }, { text: "y", tex: "y" }], clearOf: [a] });

    const coefficients = taylorCoefficients(fn, a, n);
    // Values far outside the plot are held at a bound, so that a steep polynomial doesn't make huge canvas coordinates.
    const h = yRange[1] - yRange[0];
    const held = (y: number) => Math.max(yRange[0] - 20 * h, Math.min(yRange[1] + 20 * h, y));
    plot.clipped(() => {
      for (const run of sampleRuns(fn.f, xRange[0], xRange[1], 1500, 2 * h)) plot.path(run, CURVE, 2.25, [], true);
      for (const run of sampleRuns(x => held(evaluateAt(coefficients, a, x)), xRange[0], xRange[1], 1500, 50 * h)) {
        plot.path(run, POLY, 2.25, [7, 5], true);
      }
    });
    drawEndpoint(plot, a, "a", fn.f(a), HANDLE, p.drag === true);
    plot.dot(a, fn.f(a), 4.5, HANDLE);

    showCalc(env, [`P_{${n}}(x) = ${taylorTex(fn, a, n)}`], "top-left");
    showKey(env, [
      { symbol: "━", color: CURVE, label: texHTML(env, `f(x) = ${fn.tex}`) },
      { symbol: "╍", color: POLY, label: `Taylor polynomial ${texHTML(env, "P_n")}` },
    ], "bottom-right");
    s.finish();
    env.readout.innerHTML = "";
  };
};
