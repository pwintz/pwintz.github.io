// ╭───────────────────────────────────────────────────────────────╮
// │     Exact projections and least squares for practice problems  │
// ╰───────────────────────────────────────────────────────────────╯
// Shared by the practice section of /tools/projection_least_squares/ (practice_page.ts) and its
// tests. Every calculation is exact, in fractions (../matrix/fraction.ts). The random problems are
// built backward from their answers so that the numbers stay small: projection coefficients have
// denominators of at most 3, and least squares solutions and fitted lines have integer entries
// (the residual is chosen first, orthogonal to the columns of A).

import { Fraction, add, div, equals, formatFraction, fraction, isZero, mul, parseEntry, sub } from "../matrix/fraction";
import { FMat, FVec, ZERO, clearDenominators, fdot, fscale, fsub, isZeroVec, rref } from "../matrix/linalg";

export const F = (n: number | bigint, d: number | bigint = 1): Fraction => fraction(n, d);
export type Rng = () => number;

// ⋘──────── Vectors ────────⋙

export const normSq = (v: FVec) => fdot(v, v);
export const vecEq = (a: FVec, b: FVec) => a.length === b.length && a.every((x, i) => equals(x, b[i]));
/** The matrix whose columns are `cols`, as a list of rows. */
export const fromCols = (cols: FVec[]): FMat => cols[0].map((_, i) => cols.map(c => c[i]));
export const matVec = (A: FMat, v: FVec): FVec => A.map(row => fdot(row, v));
/** A linear combination c₁v₁ + c₂v₂ + ⋯. */
export const combo = (cs: Fraction[], vs: FVec[]): FVec =>
  vs.reduce((s, v, j) => s.map((x, i) => add(x, mul(cs[j], v[i]))), vs[0].map(() => ZERO));
export const rankOf = (M: FMat) => rref(M).pivots.length;

export function cross(a: FVec, b: FVec): FVec {
  return [
    sub(mul(a[1], b[2]), mul(a[2], b[1])),
    sub(mul(a[2], b[0]), mul(a[0], b[2])),
    sub(mul(a[0], b[1]), mul(a[1], b[0])),
  ];
}

/** A basis of the null space of M, each vector scaled to integers with no common factor. */
export function nullBasis(M: FMat): FVec[] {
  const n = M[0].length;
  const { r, pivots } = rref(M);
  const basis: FVec[] = [];
  for (let f = 0; f < n; f++) {
    if (pivots.includes(f)) continue;
    const v: FVec = Array.from({ length: n }, (_, j) => F(j === f ? 1 : 0));
    pivots.forEach((pc, i) => { v[pc] = F(0n - r[i][f].num, r[i][f].den); });
    basis.push(clearDenominators(v).v);
  }
  return basis;
}

/** The coefficient ⟨x, v⟩/‖v‖² of the projection of x onto a nonzero v. */
export const projCoeff = (x: FVec, v: FVec) => div(fdot(x, v), normSq(v));

/**
 * Gram–Schmidt's second vector, v₂ − (⟨v₂, v₁⟩/‖v₁‖²)v₁, and the same vector scaled to
 * integers with no common factor (as the solutions show it).
 */
export function gramSchmidt2(v1: FVec, v2: FVec): { raw: FVec; u2: FVec } {
  const raw = fsub(v2, fscale(projCoeff(v2, v1), v1));
  return { raw, u2: clearDenominators(raw).v };
}

/** The normal equation AᵀAx = Aᵀb, for A with linearly independent columns `cols`. */
export function normalSolution(cols: FVec[], target: FVec) {
  const n = cols.length;
  const AtA: FMat = cols.map(a => cols.map(c => fdot(a, c)));
  const Atb: FVec = cols.map(a => fdot(a, target));
  const { r: R } = rref(AtA.map((row, i) => [...row, Atb[i]]));
  const xstar: FVec = R.slice(0, n).map(row => row[n]);
  const p = combo(xstar, cols);
  return { AtA, Atb, R, xstar, p, r: fsub(target, p) };
}

// ⋘──────── Problems ────────⋙

export type Kind = "projv" | "projline" | "projorth" | "projgs" | "lsq" | "lsqres" | "fitline";
export const KINDS: readonly Kind[] = ["projv", "projline", "projorth", "projgs", "lsq", "lsqres", "fitline"];
export type Family = "proj" | "lsq" | "fit";
export const familyOf = (k: Kind): Family => (k.startsWith("proj") ? "proj" : k === "fitline" ? "fit" : "lsq");

/**
 * A problem. For a projection, `cols` are the spanning vectors and `target` is x. For least
 * squares, `cols` are the columns of A and `target` is b. For a line of best fit, `xs` are the
 * x-values of the data, `cols` are the columns of A (ones, then the xs), and `target` is y.
 */
export interface Problem { kind: Kind; cols: FVec[]; target: FVec; xs?: FVec }

const randInt = (rng: Rng, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const randVec = (rng: Rng, n: number, lo: number, hi: number): FVec => Array.from({ length: n }, () => F(randInt(rng, lo, hi)));
const maxAbs = (v: FVec) => Math.max(...v.map(x => Math.abs(Number(x.num) / Number(x.den))));
const nonzeros = (v: FVec) => v.filter(x => !isZero(x)).length;
const smallDen = (x: Fraction, max = 3n) => fraction(x.num, x.den).den <= max;
const isInt = (x: Fraction) => fraction(x.num, x.den).den === 1n;

/** The integer vector v with no common factor, keeping its direction. */
const primitive = (v: FVec) => clearDenominators(v).v;

function fitColumns(xs: FVec): FVec[] {
  return [xs.map(() => F(1)), xs];
}

/** Tries `make` until it returns a problem (with a fallback after many tries). */
function attempt(make: () => Problem | null, fallback: () => Problem): Problem {
  for (let i = 0; i < 2000; i++) {
    const p = make();
    if (p) return p;
  }
  return fallback();
}

const ints = (rows: number[][]): FVec[] => rows.map(r => r.map(x => F(x)));

export function randomProblem(kind: Kind, rng: Rng = Math.random): Problem {
  switch (kind) {
    case "projv":
      return attempt(() => {
        const v = randVec(rng, 2, -4, 4), x = randVec(rng, 2, -5, 5);
        if (nonzeros(v) < 2 || isZeroVec(x)) return null;
        const c = projCoeff(x, v);
        if (isZero(c) || !smallDen(c) || isZero(sub(mul(x[0], v[1]), mul(x[1], v[0])))) return null;
        return { kind, cols: [v], target: x };
      }, () => ({ kind, cols: ints([[4, 2]]), target: ints([[1, 3]])[0] }));
    case "projline":
      return attempt(() => {
        const v = randVec(rng, 3, -3, 3), x = randVec(rng, 3, -4, 4);
        if (nonzeros(v) < 2 || nonzeros(x) < 2) return null;
        const c = projCoeff(x, v);
        if (isZero(c) || !smallDen(c) || isZeroVec(cross(x, v))) return null;
        return { kind, cols: [v], target: x };
      }, () => ({ kind, cols: ints([[1, 2, 2]]), target: ints([[3, 0, 3]])[0] }));
    case "projorth":
      return attempt(() => {
        const v1 = randVec(rng, 3, -2, 2), w = randVec(rng, 3, -2, 2);
        if (nonzeros(v1) < 2) return null;
        const c = cross(v1, w);
        if (isZeroVec(c)) return null;
        const v2 = primitive(c);
        if (maxAbs(v2) > 4 || nonzeros(v2) < 2) return null;
        const x = randVec(rng, 3, -4, 4);
        const c1 = projCoeff(x, v1), c2 = projCoeff(x, v2);
        if (!smallDen(c1) || !smallDen(c2) || (isZero(c1) && isZero(c2))) return null;
        if (isZeroVec(fsub(x, combo([c1, c2], [v1, v2])))) return null;
        return { kind, cols: [v1, v2], target: x };
      }, () => ({ kind, cols: ints([[1, 1, 0], [1, -1, 1]]), target: ints([[2, 4, 3]])[0] }));
    case "projgs":
      return attempt(() => {
        const v1 = randVec(rng, 3, -2, 2), v2 = randVec(rng, 3, -2, 2);
        if (nonzeros(v1) < 2 || nonzeros(v2) < 2) return null;
        if (isZero(fdot(v1, v2)) || isZeroVec(cross(v1, v2))) return null;
        const { u2 } = gramSchmidt2(v1, v2);
        if (maxAbs(u2) > 5) return null;
        const x = randVec(rng, 3, -4, 4);
        const c1 = projCoeff(x, v1), c2 = projCoeff(x, u2);
        if (!smallDen(c1) || !smallDen(c2) || (isZero(c1) && isZero(c2))) return null;
        if (isZeroVec(fsub(x, combo([c1, c2], [v1, u2])))) return null;
        return { kind, cols: [v1, v2], target: x };
      }, () => ({ kind, cols: ints([[1, 0, 1], [1, 1, 0]]), target: ints([[1, 2, 3]])[0] }));
    case "lsq":
    case "lsqres":
      return attempt(() => {
        const m = kind === "lsq" ? 3 : randInt(rng, 3, 4);
        const a1 = randVec(rng, m, -2, 3), a2 = randVec(rng, m, -2, 3);
        if (nonzeros(a1) < 2 || nonzeros(a2) < 2) return null;
        if (rankOf(fromCols([a1, a2])) < 2) return null;
        const AtA = [[normSq(a1), fdot(a1, a2)], [fdot(a1, a2), normSq(a2)]];
        if (AtA.flat().some(x => Math.abs(Number(x.num)) > 20)) return null;
        // The residual: a small vector orthogonal to both columns, so that x* has integer entries.
        const basis = nullBasis([a1, a2]);
        const s = basis.map(() => F(randInt(rng, -1, 1)));
        const r = combo(s, basis);
        if (isZeroVec(r) || maxAbs(r) > 4) return null;
        const xstar = randVec(rng, 2, -3, 3);
        if (isZeroVec(xstar)) return null;
        const b = r.map((ri, i) => add(ri, add(mul(a1[i], xstar[0]), mul(a2[i], xstar[1]))));
        if (maxAbs(b) > 12 || nonzeros(b) < 2) return null;
        return { kind, cols: [a1, a2], target: b };
      }, () => ({ kind, cols: ints([[4, 0, 1], [0, 2, 1]]), target: ints([[2, 0, 11]])[0] }));
    case "fitline":
      return attempt(() => {
        const N = randInt(rng, 3, 5);
        const pool = [-2, -1, 0, 1, 2, 3, 4];
        const xsNum: number[] = [];
        while (xsNum.length < N) {
          const x = pool[randInt(rng, 0, pool.length - 1)];
          if (!xsNum.includes(x)) xsNum.push(x);
        }
        xsNum.sort((a, b) => a - b);
        const xs = xsNum.map(x => F(x));
        const cols = fitColumns(xs);
        const basis = nullBasis(cols);
        const s = basis.map(() => F(randInt(rng, -1, 1)));
        const r = combo(s, basis);
        if (isZeroVec(r) || maxAbs(r) > 3) return null;
        const c0 = randInt(rng, -4, 4), c1 = randInt(rng, -3, 3);
        if (c1 === 0) return null;
        const y = xs.map((x, i) => add(r[i], add(F(c0), mul(F(c1), x))));
        if (maxAbs(y) > 15) return null;
        return { kind, cols, target: y, xs };
      }, () => {
        const xs = ints([[3, 1, -1]])[0];
        return { kind, cols: fitColumns(xs), target: ints([[0, 8, -8]])[0], xs };
      });
  }
}

/** Whether a problem (such as one read from the address) can be practiced: its answers exist and are unique. */
export function isValid(p: Problem): boolean {
  const { kind, cols, target } = p;
  if (cols.length === 0 || cols.some(c => c.length !== target.length)) return false;
  switch (kind) {
    case "projv":
      return cols.length === 1 && target.length === 2 && !isZeroVec(cols[0]);
    case "projline":
      return cols.length === 1 && target.length === 3 && !isZeroVec(cols[0]);
    case "projorth":
      return cols.length === 2 && target.length === 3 && !isZeroVec(cols[0]) && !isZeroVec(cols[1]) && isZero(fdot(cols[0], cols[1]));
    case "projgs":
      return cols.length === 2 && target.length === 3 && rankOf(cols) === 2 && !isZero(fdot(cols[0], cols[1]));
    case "lsq":
    case "lsqres":
      return target.length >= 2 && target.length <= 6 && cols.length <= 3 && cols.length < target.length && rankOf(cols) === cols.length;
    case "fitline":
      return !!p.xs && cols.length === 2 && target.length >= 2 && target.length <= 8 && rankOf(cols) === 2;
  }
}

// ⋘──────── Problems in the address ────────⋙
// The same parameters as the visualizer (../projection_least_squares.ts), plus the kind of steps:
//   "mode=proj&v1=1,0,1&v2=1,1,0&x=1,2,3&pk=projgs"
//   "mode=lsq&A=4,0;0,2;1,1&b=2,0,11&pk=lsq"     (A by rows)
//   "mode=fit&deg=1&pts=3,0;1,8;-1,-8&pk=fitline"

export const URL_KEYS = ["mode", "v1", "v2", "v3", "x", "A", "b", "deg", "pts", "pk"] as const;
const str = (x: Fraction) => formatFraction(x).replace("−", "-");
const list = (v: FVec) => v.map(str).join(",");

export function encodeProblem(p: Problem): string {
  switch (familyOf(p.kind)) {
    case "proj":
      return `mode=proj&${p.cols.map((c, i) => `v${i + 1}=${list(c)}`).join("&")}&x=${list(p.target)}&pk=${p.kind}`;
    case "lsq":
      return `mode=lsq&A=${fromCols(p.cols).map(list).join(";")}&b=${list(p.target)}&pk=${p.kind}`;
    case "fit":
      return `mode=fit&deg=1&pts=${p.xs!.map((x, i) => `${str(x)},${str(p.target[i])}`).join(";")}&pk=${p.kind}`;
  }
}

/**
 * The kind of steps for a problem (such as one the student typed in the visualizer), or null when
 * no kind fits. `prefer` is kept when it fits (such as "lsq" rather than "lsqres").
 */
export function classify(family: Family, cols: FVec[], target: FVec, degree = 1, prefer?: Kind): Problem | null {
  const xs = family === "fit" ? cols[1] : undefined;
  if (family === "fit" && (degree !== 1 || !xs)) return null;
  const make = (kind: Kind): Problem | null => {
    const p: Problem = { kind, cols, target, ...(xs ? { xs } : {}) };
    return familyOf(kind) === family && isValid(p) ? p : null;
  };
  if (prefer) {
    const p = make(prefer);
    if (p) return p;
  }
  const order: Kind[] = family === "proj" ? ["projv", "projline", "projorth", "projgs"] : family === "lsq" ? ["lsqres"] : ["fitline"];
  for (const k of order) {
    const p = make(k);
    if (p) return p;
  }
  return null;
}

/** Whether the address names a problem (even one without steps). */
export const hasProblem = (query: string) => new URLSearchParams(query.replace(/^\?/, "")).has("mode");

export function decodeProblem(query: string): Problem | null {
  const params = new URLSearchParams(query.replace(/^\?/, ""));
  const mode = params.get("mode");
  const pk = params.get("pk") as Kind | null;
  const prefer = pk && KINDS.includes(pk) ? pk : undefined;
  const vec = (s: string | null): FVec | null => {
    if (!s) return null;
    const v = s.split(",").map(t => parseEntry(t));
    return v.every(x => x !== null) ? (v as FVec) : null;
  };
  const vecs = (s: string | null): FVec[] | null => {
    if (!s) return null;
    const vs = s.split(";").map(vec);
    return vs.every(v => v !== null) ? (vs as FVec[]) : null;
  };
  if (mode === "proj") {
    const cols: FVec[] = [];
    for (let i = 1; i <= 3 && params.has(`v${i}`); i++) {
      const v = vec(params.get(`v${i}`));
      if (!v) return null;
      cols.push(v);
    }
    const target = vec(params.get("x"));
    return cols.length && target ? classify("proj", cols, target, 1, prefer) : null;
  }
  if (mode === "lsq") {
    const rows = vecs(params.get("A")), target = vec(params.get("b"));
    if (!rows || !target || !rows.every(r => r.length === rows[0].length) || rows.length !== target.length) return null;
    return classify("lsq", rows[0].map((_, j) => rows.map(r => r[j])), target, 1, prefer);
  }
  if (mode === "fit") {
    const pts = vecs(params.get("pts"));
    if (!pts || !pts.every(pt => pt.length === 2)) return null;
    const xs = pts.map(pt => pt[0]);
    return classify("fit", fitColumns(xs), pts.map(pt => pt[1]), Number(params.get("deg") ?? 1), prefer);
  }
  return null;
}

// ⋘──────── The problem in the visualizer ────────⋙
// The same shape as the visualizer's examples (../projection_least_squares.ts).

export type Picture =
  | { mode: "proj"; dim: 2 | 3; vs: string[][]; x: string[] }
  | { mode: "lsq"; A: string[][]; b: string[] }
  | { mode: "fit"; degree: number; pts: string[][] };

export function pictureOf(p: Problem): Picture {
  const strs = (v: FVec) => v.map(str);
  switch (familyOf(p.kind)) {
    case "proj":
      return { mode: "proj", dim: p.target.length as 2 | 3, vs: p.cols.map(strs), x: strs(p.target) };
    case "lsq":
      return { mode: "lsq", A: fromCols(p.cols).map(strs), b: strs(p.target) };
    case "fit":
      return { mode: "fit", degree: 1, pts: p.xs!.map((x, i) => [str(x), str(p.target[i])]) };
  }
}

// ⋘──────── TeX ────────⋙

const abs = (n: bigint) => (n < 0n ? -n : n);
/** A fraction in TeX, with \frac (for display math). */
export function fracTex(x: Fraction): string {
  const f = fraction(x.num, x.den);
  if (f.den === 1n) return `${f.num}`;
  return `${f.num < 0n ? "-" : ""}\\frac{${abs(f.num)}}{${f.den}}`;
}
/** A fraction in TeX as a/b (for inline math, where \frac is too small). */
export const slashTex = (x: Fraction) => str(x);
/** In parentheses when negative or a fraction, for products like 2(−3). */
export const parenTex = (x: Fraction, frac = fracTex) => (x.num < 0n || !isInt(x) ? `\\left(${frac(x)}\\right)` : frac(x));
export const colTex = (v: string[]) => `\\begin{bmatrix} ${v.join(" \\\\ ")} \\end{bmatrix}`;
export const vecTex = (v: FVec) => colTex(v.map(fracTex));
export const matTex = (m: FMat) => `\\begin{bmatrix} ${m.map(row => row.map(fracTex).join(" & ")).join(" \\\\ ")} \\end{bmatrix}`;
export const augTex = (m: FMat) => `\\left[\\begin{array}{${"c".repeat(m[0].length - 1)}|c} ${m.map(r => r.map(fracTex).join(" & ")).join(" \\\\ ")} \\end{array}\\right]`;
/** "(1)(4) + (3)(2)": the products in an inner product, as in lecture. */
export const ipExpand = (a: FVec, b: FVec) => a.map((x, i) => `(${fracTex(x)})(${fracTex(b[i])})`).join(" + ");
/** "4^2 + 2^2" */
export const normSqExpand = (a: FVec) => a.map(x => `${parenTex(x)}^2`).join(" + ");
/** The unreduced ratio s/t of two integers (as the formula gives it), then its reduced value if that differs. */
export function ratioTex(s: Fraction, t: Fraction): string {
  const q = div(s, t);
  const first = isInt(s) && isInt(t)
    ? `${s.num < 0n ? "-" : ""}\\frac{${abs(fraction(s.num, s.den).num)}}{${fraction(t.num, t.den).num}}`
    : `\\frac{${fracTex(s)}}{${fracTex(t)}}`;
  const reduced = fracTex(q);
  return reduced === first ? first : `${first} = ${reduced}`;
}

/** "c₀ + c₁x" in TeX, such as "-2 + 2x", "3 - x", or "\frac{1}{2}x". */
export function lineTex(c0: Fraction, c1: Fraction): string {
  if (isZero(c1)) return fracTex(c0);
  const a = fracTex({ num: c1.num < 0n ? -c1.num : c1.num, den: c1.den });
  const term = `${a === "1" ? "" : a}x`;
  if (isZero(c0)) return `${c1.num < 0n ? "-" : ""}${term}`;
  return `${fracTex(c0)} ${c1.num < 0n ? "-" : "+"} ${term}`;
}

/** The distance √(rr), exact when rr is a perfect square. */
export function sqrtTex(rr: Fraction): string {
  const r = fraction(rr.num, rr.den);
  const isqrt = (n: bigint) => {
    if (n < 2n) return n;
    let x = BigInt(Math.floor(Math.sqrt(Number(n))));
    while (x * x > n) x--;
    while ((x + 1n) * (x + 1n) <= n) x++;
    return x;
  };
  const rn = isqrt(r.num), rd = isqrt(r.den);
  if (rn * rn === r.num && rd * rd === r.den) return fracTex(F(rn, rd));
  return `\\sqrt{${slashTex(r)}} \\approx ${Number((Math.sqrt(Number(r.num) / Number(r.den))).toFixed(3))}`;
}
