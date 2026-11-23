// ╭───────────────────────────────────────────────────────────────╮
// │                Complex numbers: exact arithmetic               │
// ╰───────────────────────────────────────────────────────────────╯
// The math behind /tools/complex_numbers/ (see ../complex_numbers.ts): complex numbers a + bi with
// exact fractions a and b, angles as rational multiples of π, square roots k√n, the practice
// problems, and their encoding in the page's address.

import { Fraction, add, div, equals, fraction, isZero, mul, neg, parseEntry, reduce, sub } from "../matrix/fraction";

export const F = (num: number | bigint, den: number | bigint = 1): Fraction => fraction(num, den);
export const ZERO = F(0);
export const ONE = F(1);
export const toNumber = (x: Fraction) => Number(x.num) / Number(x.den);
const isInt = (x: Fraction) => reduce(x).den === 1n;
const absF = (x: Fraction): Fraction => (x.num < 0n ? neg(x) : x);

// ⋘──────── Complex numbers ────────⋙

export interface C { re: Fraction; im: Fraction }
export const cx = (re: number | Fraction, im: number | Fraction): C =>
  ({ re: typeof re === "number" ? F(re) : reduce(re), im: typeof im === "number" ? F(im) : reduce(im) });
export const cadd = (z: C, w: C): C => ({ re: add(z.re, w.re), im: add(z.im, w.im) });
export const csub = (z: C, w: C): C => ({ re: sub(z.re, w.re), im: sub(z.im, w.im) });
export const cmul = (z: C, w: C): C => ({ re: sub(mul(z.re, w.re), mul(z.im, w.im)), im: add(mul(z.re, w.im), mul(z.im, w.re)) });
export const cconj = (z: C): C => ({ re: z.re, im: neg(z.im) });
/** |z|² = a² + b². */
export const cnormSq = (z: C): Fraction => add(mul(z.re, z.re), mul(z.im, z.im));
export const cIsZero = (z: C) => isZero(z.re) && isZero(z.im);
export const ceq = (z: C, w: C) => equals(z.re, w.re) && equals(z.im, w.im);
/** z/w, for w ≠ 0: (z w̄)/|w|². */
export function cdiv(z: C, w: C): C {
  const top = cmul(z, cconj(w)), bottom = cnormSq(w);
  return { re: div(top.re, bottom), im: div(top.im, bottom) };
}
/** zⁿ for an integer n ≥ 0. */
export function cpow(z: C, n: number): C {
  let result = cx(1, 0);
  for (let k = 0; k < n; k++) result = cmul(result, z);
  return result;
}
/** iⁿ for an integer n ≥ 0: i, −1, −i, or 1. */
export const ipow = (n: number): C => [cx(1, 0), cx(0, 1), cx(-1, 0), cx(0, -1)][((n % 4) + 4) % 4];
export const cNumbers = (z: C): [number, number] => [toNumber(z.re), toNumber(z.im)];

// ⋘──────── Angles, as multiples of π ────────⋙

/** The same angle in (−1, 1] (that is, in (−π, π]). */
export function normAngle(t: Fraction): Fraction {
  const x = reduce(t);
  const period = 2n * x.den;
  let num = ((x.num % period) + period) % period;  // In [0, 2)
  if (num > x.den) num -= period;
  return reduce({ num, den: x.den });
}

/** arg z/π exactly, when z is on an axis or a diagonal; else null (and for z = 0). */
export function niceArg(z: C): Fraction | null {
  const { re, im } = z;
  if (isZero(re) && isZero(im)) return null;
  if (isZero(im)) return re.num > 0n ? ZERO : ONE;
  if (isZero(re)) return im.num > 0n ? F(1, 2) : F(-1, 2);
  if (equals(absF(re), absF(im))) {
    if (re.num > 0n) return im.num > 0n ? F(1, 4) : F(-1, 4);
    return im.num > 0n ? F(3, 4) : F(-3, 4);
  }
  return null;
}

/** arg z/π in (−1, 1], as a decimal. */
export const argNumber = (z: C): number => {
  const t = Math.atan2(toNumber(z.im), toNumber(z.re)) / Math.PI;
  return t <= -1 ? t + 2 : t;
};

/** Whether t and u (multiples of π) are the same angle, within `tol` (in multiples of π). */
export function sameAngle(t: number, u: number, tol = 1e-9): boolean {
  const d = (((t - u) % 2) + 2) % 2;
  return d <= tol || 2 - d <= tol;
}

// ⋘──────── Polar form ────────⋙

/** r e^{iπt}, with r > 0 and t in (−1, 1]. */
export interface Polar { r: Fraction; t: Fraction }
export const polarNumbers = (p: Polar): [number, number] =>
  [toNumber(p.r) * Math.cos(Math.PI * toNumber(p.t)), toNumber(p.r) * Math.sin(Math.PI * toNumber(p.t))];
export const pmul = (p: Polar, q: Polar): Polar => ({ r: mul(p.r, q.r), t: normAngle(add(p.t, q.t)) });
export const pdiv = (p: Polar, q: Polar): Polar => ({ r: div(p.r, q.r), t: normAngle(sub(p.t, q.t)) });

// cos(πt) and sin(πt) in TeX, for t a multiple of 1/4 or 1/6 (else null).
const SQRT2 = "\\frac{\\sqrt{2}}{2}", SQRT3 = "\\frac{\\sqrt{3}}{2}", HALF = "\\frac{1}{2}";
export function cosSinTex(t: Fraction): [string, string] | null {
  const x = normAngle(t);
  const twelfths = Number(x.num) * 12 / Number(x.den);
  if (!Number.isInteger(twelfths) || twelfths % 2 !== 0 && twelfths % 3 !== 0) return null;
  // The value at each multiple of π/12 that is a multiple of π/6 or π/4, for 0 to π/2.
  const first: Record<number, [string, string]> = {
    0: ["1", "0"], 2: [SQRT3, HALF], 3: [SQRT2, SQRT2], 4: [HALF, SQRT3],
  };
  const k = ((twelfths % 24) + 24) % 24;  // In [0, 24)
  const quadrant = Math.floor(k / 6), within = k % 6;
  // Angles in later quadrants: rotate by π/2 each time: (c, s) → (−s, c).
  let [c, s] = first[within];
  const negate = (v: string) => (v === "0" ? "0" : v.startsWith("-") ? v.slice(1) : `-${v}`);
  for (let q = 0; q < quadrant; q++) [c, s] = [negate(s), c];
  return [c, s];
}

// ⋘──────── Square roots ────────⋙

/** k√n, with k ≥ 0 a fraction and n a squarefree positive integer. */
export interface Root { k: Fraction; n: bigint }

/** √s for a fraction s ≥ 0, simplified: √8 = 2√2, √(1/2) = √2/2. */
export function sqrtOf(s: Fraction): Root {
  const x = reduce(s);
  if (x.num <= 0n) return { k: ZERO, n: 1n };
  // √(p/q) = √(pq)/q
  let m = x.num * x.den, out = 1n;
  for (let f = 2n; f * f <= m && f < 1000000n; f++) {
    while (m % (f * f) === 0n) { m /= f * f; out *= f; }
  }
  return { k: F(out, x.den), n: m };
}
export const rootSquare = (r: Root): Fraction => mul(mul(r.k, r.k), F(r.n));
export const rootNumber = (r: Root): number => toNumber(r.k) * Math.sqrt(Number(r.n));
/** k√n raised to the power m ≥ 0, as a root again. */
export const rootPow = (r: Root, m: number): Root => {
  let sq = ONE;
  for (let j = 0; j < m; j++) sq = mul(sq, rootSquare(r));
  return sqrtOf(sq);
};

/** A root as typed text, such as "5", "√2", "2√2", or "√2/2". */
export function rootText(r: Root): string {
  if (r.n === 1n) return fracText(r.k);
  const k = reduce(r.k);
  const top = k.num === 1n ? `√${r.n}` : `${k.num}√${r.n}`;
  return k.den === 1n ? top : `${top}/${k.den}`;
}
/** A root in TeX: √2/2 inline, \frac{\sqrt{2}}{2} in a display. */
export function rootTex(r: Root, display = false): string {
  if (r.n === 1n) return display ? fracTex(r.k) : slashTex(r.k);
  const k = reduce(r.k);
  const top = `${k.num === 1n ? "" : k.num}\\sqrt{${r.n}}`;
  if (k.den === 1n) return top;
  return display ? `\\frac{${top}}{${k.den}}` : `${top}/${k.den}`;
}

const NUM = String.raw`\d+(?:\.\d*)?|\.\d+`;
const FRAC = `(?:${NUM})(?:/(?:${NUM}))?`;
// A fraction under the root needs parentheses: "√2/2" is (√2)/2, and "√(1/2)" is the root of 1/2.
const ROOT_RE = new RegExp(`^(-?)(${FRAC})?\\*?√(?:\\((${FRAC})\\)|(${NUM}))(?:/(${NUM}))?$`);

/**
 * The square of an entry like "5", "√13", "2√2", "sqrt(8)", "3*sqrt2", or "√2/2", with whether
 * it's negative; null if it isn't one.
 */
export function parseRoot(text: string): { square: Fraction; negative: boolean } | null {
  const s = text.replace(/\s+/g, "").replace(/[−–]/g, "-").replace(/sqrt/gi, "√");
  if (!s.includes("√")) {
    const x = parseEntry(s);
    if (x === null || s === "") return null;
    return { square: mul(x, x), negative: x.num < 0n };
  }
  const m = ROOT_RE.exec(s);
  if (!m) return null;
  const [, sign, coef, inParens, bare, bottom] = m;
  const radicand = inParens ?? bare;
  const k = coef ? parseEntry(coef) : ONE;
  const n = parseEntry(radicand);
  const d = bottom ? parseEntry(bottom) : ONE;
  if (k === null || n === null || d === null || isZero(d) || n.num < 0n) return null;
  const kd = div(k, d);
  return { square: mul(mul(kd, kd), n), negative: sign === "-" && !isZero(kd) && !isZero(n) };
}
export const isRootEntry = (text: string) => parseRoot(text) !== null;
/** Whether the entry is the nonnegative square root of `square`. */
export function rootEquals(text: string, square: Fraction): boolean {
  const got = parseRoot(text);
  return got !== null && !got.negative && equals(got.square, square);
}

// ⋘──────── Formatting ────────⋙

/** A fraction as typed text, such as "-3" or "1/2". */
export function fracText(x: Fraction): string {
  const f = reduce(x);
  return f.den === 1n ? `${f.num}` : `${f.num}/${f.den}`;
}
/** In TeX for a display: \frac{1}{2}. */
export function fracTex(x: Fraction): string {
  const f = reduce(x);
  if (f.den === 1n) return `${f.num}`;
  return `${f.num < 0n ? "-" : ""}\\frac{${f.num < 0n ? -f.num : f.num}}{${f.den}}`;
}
/** In TeX for inline math, as a/b (\frac is too small inline). */
export const slashTex = (x: Fraction) => fracText(x);
/** In parentheses when negative or a fraction, for products like 2(−3). */
export const parenTex = (x: Fraction, display = false) => {
  const t = display ? fracTex(x) : slashTex(x);
  return x.num < 0n || !isInt(x) ? `\\left(${t}\\right)` : t;
};

/** a + bi in TeX, such as "3 - 2i", "-i", "\frac{1}{2} + \frac{3}{2}i" (display), or "1/2 + (3/2)i". */
export function cTex(z: C, display = false): string {
  const re = reduce(z.re), im = reduce(z.im);
  const frac = display ? fracTex : slashTex;
  const imAbs = absF(im);
  const imPart = equals(imAbs, ONE) ? "i" : isInt(imAbs) || display ? `${frac(imAbs)}i` : `(${frac(imAbs)})i`;
  if (isZero(im)) return frac(re);
  if (isZero(re)) return `${im.num < 0n ? "-" : ""}${imPart}`;
  return `${frac(re)} ${im.num < 0n ? "-" : "+"} ${imPart}`;
}
/** a + bi in parentheses when it has two terms or a minus sign, for products. */
export const cParen = (z: C, display = false) => {
  const t = cTex(z, display);
  return /^[0-9]*i?$/.test(t) ? t : `\\left(${t}\\right)`;
};
/** a + bi as plain text, for the readout: "3 − 2i". */
export const cText = (z: C) => cTex(z).replace(/-/g, "−");

/** An angle πt in TeX: "0", "\pi", "-\pi/2", "3\pi/4" (or \frac{3\pi}{4} in a display). */
export function angleTex(t: Fraction, display = false): string {
  const x = reduce(t);
  if (isZero(x)) return "0";
  const sign = x.num < 0n ? "-" : "";
  const a = x.num < 0n ? -x.num : x.num;
  const top = `${a === 1n ? "" : a}\\pi`;
  if (x.den === 1n) return `${sign}${top}`;
  return display ? `${sign}\\frac{${top}}{${x.den}}` : `${sign}${top}/${x.den}`;
}
/** e^{iπt} in TeX, such as "e^{i\pi/3}" or "e^{-i\pi/4}". */
export function expTex(t: Fraction): string {
  const x = reduce(t);
  if (isZero(x)) return "e^{0}";
  return x.num < 0n ? `e^{-i ${angleTex(neg(x))}}` : `e^{i ${angleTex(x)}}`;
}
/** r e^{iπt} in TeX. */
export const polarTex = (p: Polar) => `${equals(p.r, ONE) ? "" : slashTex(p.r)}${expTex(p.t)}`;
/** An angle in degrees, such as "135°" or "≈ 63.43°". */
export function degreesText(t: number): string {
  const d = t * 180;
  return Math.abs(d - Math.round(d)) < 1e-9 ? `${Math.round(d)}°` : `≈ ${d.toFixed(2)}°`;
}

// ⋘──────── Problems ────────⋙

export type Kind = "powi" | "add" | "mul" | "conj" | "div" | "polar" | "polarmul" | "power";
export const KINDS: readonly Kind[] = ["powi", "add", "mul", "conj", "div", "polar", "polarmul", "power"];

export type Problem =
  | { kind: "powi"; n: number }
  | { kind: "add" | "mul" | "div"; z: C; w: C }
  | { kind: "conj" | "polar"; z: C }
  | { kind: "power"; z: C; n: number }
  | { kind: "polarmul"; z: Polar; w: Polar };

export const URL_KEYS = ["ck", "cz", "cw", "cn"] as const;
const MAX_POWI = 1000, MAX_POWER = 10;

/** Why a problem can't be practiced, or null if it can. */
export function problemError(p: Problem): string | null {
  switch (p.kind) {
    case "powi":
      return Number.isInteger(p.n) && p.n >= 0 && p.n <= MAX_POWI ? null : `Choose a whole number n from 0 to ${MAX_POWI}.`;
    case "div":
      return cIsZero(p.w) ? "Division by zero isn't defined: choose w ≠ 0." : null;
    case "polar":
      return cIsZero(p.z) ? "The angle of 0 isn't defined: choose z ≠ 0." : null;
    case "power":
      if (cIsZero(p.z)) return "Choose z ≠ 0.";
      return Number.isInteger(p.n) && p.n >= 2 && p.n <= MAX_POWER ? null : `Choose a power n from 2 to ${MAX_POWER}.`;
    case "polarmul":
      return p.z.r.num > 0n && p.w.r.num > 0n ? null : "The moduli r must be positive.";
    default:
      return null;
  }
}

const pairText = (a: Fraction, b: Fraction) => `${fracText(a)},${fracText(b)}`;
export function encodeProblem(p: Problem): string {
  const parts = [`ck=${p.kind}`];
  if (p.kind === "polarmul") parts.push(`cz=${pairText(p.z.r, p.z.t)}`, `cw=${pairText(p.w.r, p.w.t)}`);
  else if (p.kind !== "powi") {
    parts.push(`cz=${pairText(p.z.re, p.z.im)}`);
    if ("w" in p) parts.push(`cw=${pairText(p.w.re, p.w.im)}`);
  }
  if ("n" in p) parts.push(`cn=${p.n}`);
  return parts.join("&");
}

export const hasProblem = (query: string) => new URLSearchParams(query).has("ck");

export function decodeProblem(query: string): Problem | null {
  const q = new URLSearchParams(query);
  const kind = q.get("ck") as Kind | null;
  if (!kind || !KINDS.includes(kind)) return null;
  const pair = (key: string): [Fraction, Fraction] | null => {
    const parts = (q.get(key) ?? "").split(",");
    if (parts.length !== 2 || parts.some(x => x.trim() === "")) return null;
    const [a, b] = parts.map(x => parseEntry(x));
    return a && b ? [reduce(a), reduce(b)] : null;
  };
  const n = Number(q.get("cn"));
  const zp = pair("cz"), wp = pair("cw");
  let p: Problem | null = null;
  switch (kind) {
    case "powi": p = { kind, n }; break;
    case "add": case "mul": case "div":
      if (zp && wp) p = { kind, z: cx(...zp), w: cx(...wp) };
      break;
    case "conj": case "polar":
      if (zp) p = { kind, z: cx(...zp) };
      break;
    case "power":
      if (zp) p = { kind, z: cx(...zp), n };
      break;
    case "polarmul":
      if (zp && wp) p = { kind, z: { r: zp[0], t: normAngle(zp[1]) }, w: { r: wp[0], t: normAngle(wp[1]) } };
      break;
  }
  return p && problemError(p) === null ? p : null;
}

// ⋘──────── Random problems ────────⋙

export type Rng = () => number;
const int = (rnd: Rng, lo: number, hi: number) => lo + Math.floor(rnd() * (hi - lo + 1));
const nonzero = (rnd: Rng, max: number) => (rnd() < 0.5 ? -1 : 1) * int(rnd, 1, max);
const pick = <T>(rnd: Rng, xs: readonly T[]): T => xs[Math.floor(rnd() * xs.length)];
const sign = (rnd: Rng) => (rnd() < 0.5 ? -1 : 1);

// Directions with angles that are multiples of π/4.
const AXES: [number, number][] = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const DIAGONALS: [number, number][] = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
// Legs of right triangles with whole-number hypotenuses.
const TRIPLES: [number, number][] = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]];

export function randomProblem(kind: Kind, rnd: Rng = Math.random): Problem {
  switch (kind) {
    case "powi":
      return { kind, n: int(rnd, 0, 5) };
    case "add":
      return { kind, z: cx(nonzero(rnd, 9), nonzero(rnd, 9)), w: cx(nonzero(rnd, 9), nonzero(rnd, 9)) };
    case "mul":
      return { kind, z: cx(nonzero(rnd, 6), nonzero(rnd, 6)), w: cx(nonzero(rnd, 6), nonzero(rnd, 6)) };
    case "conj": {
      if (rnd() < 0.6) {
        const [a, b] = pick(rnd, TRIPLES);
        return { kind, z: cx(sign(rnd) * a, sign(rnd) * b) };
      }
      return { kind, z: cx(nonzero(rnd, 6), nonzero(rnd, 6)) };
    }
    case "div": {
      const w = cx(nonzero(rnd, 4), nonzero(rnd, 4));
      // Half the time, a quotient with whole-number parts.
      const z = rnd() < 0.5 ? cmul(cx(nonzero(rnd, 4), int(rnd, -4, 4)), w) : cx(nonzero(rnd, 8), nonzero(rnd, 8));
      return { kind, z, w };
    }
    case "polar": {
      const [a, b] = pick(rnd, rnd() < 0.7 ? DIAGONALS : AXES);
      const k = int(rnd, 1, 5);
      return { kind, z: cx(k * a, k * b) };
    }
    case "polarmul": {
      const angle = () => {
        const den = pick(rnd, [2, 3, 4, 6]);
        return normAngle(F(int(rnd, -den + 1, den), den));
      };
      return { kind, z: { r: F(int(rnd, 1, 6)), t: angle() }, w: { r: F(int(rnd, 1, 4)), t: angle() } };
    }
    case "power": {
      for (;;) {
        const [a, b] = pick(rnd, rnd() < 0.75 ? DIAGONALS : AXES);
        const k = rnd() < 0.7 ? 1 : 2;
        const z = cx(k * a, k * b), n = int(rnd, 2, 8);
        // Keep |zⁿ| at most 64.
        if (toNumber(cnormSq(z)) ** n <= 64 ** 2) return { kind, z, n };
      }
    }
  }
}

// ⋘──────── The answers, for the picture ────────⋙

export interface Point { name: string; z: [number, number] }
const SUPERSCRIPTS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
/** A whole number in superscript digits, for labels such as z⁵. */
export const superscript = (n: number) => `${n}`.replace(/\d/g, d => SUPERSCRIPTS[Number(d)]);
export interface Picture { given: Point[]; answers: Point[] }

/** The problem's numbers (given) and its answers, as points of the plane. */
export function pictureOf(p: Problem): Picture {
  switch (p.kind) {
    case "powi":
      return { given: [{ name: "i", z: [0, 1] }], answers: [{ name: `i${superscript(p.n)}`, z: cNumbers(ipow(p.n)) }] };
    case "add":
      return {
        given: [{ name: "z", z: cNumbers(p.z) }, { name: "w", z: cNumbers(p.w) }],
        answers: [{ name: "z + w", z: cNumbers(cadd(p.z, p.w)) }, { name: "z − w", z: cNumbers(csub(p.z, p.w)) }],
      };
    case "mul":
      return { given: [{ name: "z", z: cNumbers(p.z) }, { name: "w", z: cNumbers(p.w) }], answers: [{ name: "zw", z: cNumbers(cmul(p.z, p.w)) }] };
    case "div":
      return { given: [{ name: "z", z: cNumbers(p.z) }, { name: "w", z: cNumbers(p.w) }], answers: [{ name: "z/w", z: cNumbers(cdiv(p.z, p.w)) }] };
    case "conj":
      return { given: [{ name: "z", z: cNumbers(p.z) }], answers: [{ name: "z̄", z: cNumbers(cconj(p.z)) }] };
    case "polar":
      return { given: [{ name: "z", z: cNumbers(p.z) }], answers: [] };
    case "power":
      return { given: [{ name: "z", z: cNumbers(p.z) }], answers: [{ name: `z${superscript(p.n)}`, z: cNumbers(cpow(p.z, p.n)) }] };
    case "polarmul":
      return {
        given: [{ name: "z", z: polarNumbers(p.z) }, { name: "w", z: polarNumbers(p.w) }],
        answers: [{ name: "zw", z: polarNumbers(pmul(p.z, p.w)) }, { name: "z/w", z: polarNumbers(pdiv(p.z, p.w)) }],
      };
  }
}
