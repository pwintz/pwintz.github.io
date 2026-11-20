// ╭───────────────────────────────────────────────────────────────╮
// │        Exact eigenvalue calculations and practice problems     │
// ╰───────────────────────────────────────────────────────────────╯
// Shared by the eigenvalues tool (../eigenvalues.ts) and its tests.
//
// Every calculation is exact. Matrix entries are fractions (../matrix/fraction.ts). The
// eigenvalues of a 2 × 2 matrix are roots of a quadratic, so they are written as a + b√r, with
// a and b fractions and r a squarefree integer ("surds"); a negative r gives complex eigenvalues,
// with √r = i√|r|. Practice problems are built so that every eigenvalue is an integer (except the
// complex ones), and the characteristic polynomial of a 3 × 3 matrix is factored with the rational
// root theorem.

import { Fraction, add, div, equals, formatFraction, fraction, isZero, mul, neg, parseEntry, sub } from "../matrix/fraction";
import { FMat, FVec, ZERO, clearDenominators, matVec, rref } from "../matrix/linalg";

export const F = (n: number | bigint, d: number | bigint = 1): Fraction => fraction(n, d);
export const fromInts = (rows: number[][]): FMat => rows.map(row => row.map(x => F(x)));
export const toNum = (x: Fraction) => Number(x.num) / Number(x.den);
export const identity = (n: number): FMat => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => F(i === j ? 1 : 0)));
export const vecEq = (a: FVec, b: FVec) => a.length === b.length && a.every((x, i) => equals(x, b[i]));
export const matEq = (a: FMat, b: FMat) => a.length === b.length && a.every((row, i) => vecEq(row, b[i]));
/** A − λI. */
export const shift = (A: FMat, lambda: Fraction): FMat => A.map((row, i) => row.map((x, j) => (i === j ? sub(x, lambda) : x)));

function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}
const lcm = (a: bigint, b: bigint) => (a === 0n || b === 0n ? 0n : (a / gcd(a, b)) * b);
const abs = (n: bigint) => (n < 0n ? -n : n);

// ⋘──────── Determinants and characteristic polynomials ────────⋙

export function det(A: FMat): Fraction {
  const n = A.length;
  if (n === 1) return A[0][0];
  if (n === 2) return sub(mul(A[0][0], A[1][1]), mul(A[0][1], A[1][0]));
  // Cofactor expansion along the first row.
  let total = ZERO;
  for (let j = 0; j < n; j++) {
    const minor = A.slice(1).map(row => row.filter((_, k) => k !== j));
    const term = mul(A[0][j], det(minor));
    total = j % 2 === 0 ? add(total, term) : sub(total, term);
  }
  return total;
}

export const trace = (A: FMat) => A.reduce((s, row, i) => add(s, row[i]), ZERO);

/** A polynomial in λ, as its coefficients from the constant term up. */
export type Poly = Fraction[];

/**
 * The characteristic polynomial det(A − λI) of a 1 × 1, 2 × 2, or 3 × 3 matrix:
 *   2 × 2:  λ² − (tr A)λ + det A,
 *   3 × 3:  −λ³ + (tr A)λ² − (sum of the principal 2 × 2 minors)λ + det A.
 */
export function charPoly(A: FMat): Poly {
  const n = A.length;
  if (n === 1) return [A[0][0], F(-1)];
  if (n === 2) return [det(A), neg(trace(A)), F(1)];
  if (n === 3) {
    const minor = (i: number, j: number) => sub(mul(A[i][i], A[j][j]), mul(A[i][j], A[j][i]));
    const m = add(add(minor(0, 1), minor(0, 2)), minor(1, 2));
    return [det(A), neg(m), trace(A), F(-1)];
  }
  throw new Error("charPoly: only matrices up to 3 × 3");
}

export function polyEval(p: Poly, x: Fraction): Fraction {
  let y = ZERO;
  for (let i = p.length - 1; i >= 0; i--) y = add(mul(y, x), p[i]);
  return y;
}

/** p(λ) / (λ − r), for a root r of p. */
function deflate(p: Poly, r: Fraction): Poly {
  const n = p.length - 1;
  const q: Fraction[] = new Array(n);
  let carry = ZERO;
  for (let i = n; i >= 1; i--) {
    carry = add(p[i], mul(carry, r));
    q[i - 1] = carry;
  }
  return q;
}

function divisors(n: bigint): bigint[] {
  n = abs(n);
  if (n === 0n || n > 10n ** 12n) return [];
  const small: bigint[] = [], large: bigint[] = [];
  for (let d = 1n; d * d <= n; d++) {
    if (n % d !== 0n) continue;
    small.push(d);
    if (d * d !== n) large.unshift(n / d);
  }
  return [...small, ...large];
}

/**
 * The rational roots of p, each listed as many times as it is a root (its multiplicity), from the
 * least to the greatest, and what's left of p after dividing out those roots.
 */
export function rationalRoots(p: Poly): { roots: Fraction[]; rest: Poly } {
  let cur = [...p];
  while (cur.length > 1 && isZero(cur[cur.length - 1])) cur.pop();
  const roots: Fraction[] = [];
  while (cur.length > 1 && isZero(cur[0])) {
    roots.push(ZERO);
    cur = cur.slice(1);
  }
  if (cur.length > 1) {
    // Integer coefficients, for the rational root theorem: a root p/q has p | c₀ and q | cₙ.
    const L = cur.reduce((l, x) => lcm(l, x.den), 1n);
    const ints = cur.map(x => (x.num * L) / x.den);
    const candidates: Fraction[] = [];
    for (const top of divisors(ints[0])) {
      for (const bottom of divisors(ints[ints.length - 1])) {
        for (const c of [F(top, bottom), F(-top, bottom)]) {
          if (!candidates.some(x => equals(x, c))) candidates.push(c);
        }
      }
    }
    for (const c of candidates) {
      while (cur.length > 1 && isZero(polyEval(cur, c))) {
        roots.push(c);
        cur = deflate(cur, c);
      }
    }
  }
  roots.sort((a, b) => toNum(a) - toNum(b));
  return { roots, rest: cur };
}

// ⋘──────── Eigenspaces ────────⋙

/** A basis of the null space of M, each vector scaled to integers with no common factor. */
export function nullBasis(M: FMat): FVec[] {
  const n = M[0].length;
  const { r, pivots } = rref(M);
  const basis: FVec[] = [];
  for (let f = 0; f < n; f++) {
    if (pivots.includes(f)) continue;
    const v: FVec = Array.from({ length: n }, (_, j) => F(j === f ? 1 : 0));
    pivots.forEach((pc, i) => { v[pc] = neg(r[i][f]); });
    basis.push(clearDenominators(v).v);
  }
  return basis;
}

export const rankOf = (M: FMat) => rref(M).pivots.length;

export interface Eigenspace { value: Fraction; algebraic: number; basis: FVec[] }

/**
 * The eigenvalues of A that are rational, from the least to the greatest, each with its algebraic
 * multiplicity and a basis of its eigenspace. `complete` is false if some eigenvalues aren't
 * rational (they're left out).
 */
export function rationalEigen(A: FMat): { spaces: Eigenspace[]; roots: Fraction[]; complete: boolean } {
  const { roots, rest } = rationalRoots(charPoly(A));
  const spaces: Eigenspace[] = [];
  for (const r of roots) {
    const last = spaces[spaces.length - 1];
    if (last && equals(last.value, r)) last.algebraic++;
    else spaces.push({ value: r, algebraic: 1, basis: nullBasis(shift(A, r)) });
  }
  return { spaces, roots, complete: rest.length === 1 };
}

/** The eigenvalue of v, if v is an eigenvector of A; null otherwise (including for v = 0). */
export function eigenvalueOf(A: FMat, v: FVec): Fraction | null {
  const i = v.findIndex(x => !isZero(x));
  if (i < 0) return null;
  const Av = matVec(A, v);
  const lambda = div(Av[i], v[i]);
  return Av.every((x, k) => equals(x, mul(lambda, v[k]))) ? lambda : null;
}

// ⋘──────── Square roots and surds ────────⋙

export function isqrt(n: bigint): bigint {
  if (n < 0n) throw new Error("isqrt of a negative number");
  if (n < 2n) return n;
  let x = BigInt(Math.floor(Math.sqrt(Number(n))));
  // Correct the floating-point estimate.
  while (x * x > n) x = (x + n / x) / 2n;
  while ((x + 1n) * (x + 1n) <= n) x++;
  return x;
}

/** n = s²·r with r squarefree (as far as trial division finds), the sign of n in r. */
export function sqrtParts(n: bigint): { s: bigint; r: bigint } {
  if (n === 0n) return { s: 0n, r: 1n };
  const sign = n < 0n ? -1n : 1n;
  let m = abs(n), s = 1n;
  for (let p = 2n; p * p <= m && p < 100000n; p++) {
    while (m % (p * p) === 0n) { m /= p * p; s *= p; }
  }
  const root = isqrt(m);
  if (root * root === m) { s *= root; m = 1n; }
  return { s, r: sign * m };
}

/** a + b√r, where r is squarefree. r = 1 only when b = 0. For r < 0, √r means i√|r|. */
export interface Surd { a: Fraction; b: Fraction; r: bigint }
export const rational = (a: Fraction): Surd => ({ a, b: ZERO, r: 1n });
export const isRational = (s: Surd) => isZero(s.b);
export const isReal = (s: Surd) => isZero(s.b) || s.r > 0n;
export const surdMinus = (s: Surd, q: Fraction): Surd => ({ ...s, a: sub(s.a, q) });
/** A real surd's value, or a complex one's real and imaginary parts. */
export const surdValue = (s: Surd): { re: number; im: number } =>
  isZero(s.b) ? { re: toNum(s.a), im: 0 }
    : s.r > 0n ? { re: toNum(s.a) + toNum(s.b) * Math.sqrt(Number(s.r)), im: 0 }
    : { re: toNum(s.a), im: toNum(s.b) * Math.sqrt(Number(-s.r)) };

export interface Eigen2 {
  t: Fraction;           // tr A
  d: Fraction;           // det A
  disc: Fraction;        // (tr A)² − 4 det A
  kind: "distinct" | "repeated" | "complex";
  roots: Surd[];         // Real ones from the least to the greatest; complex ones a + bi, then a − bi
  half: Fraction;        // The roots are t/2 ± half·√r
  r: bigint;
}

/** The eigenvalues of a 2 × 2 matrix, exactly, from the quadratic formula. */
export function eigen2(A: FMat): Eigen2 {
  const t = trace(A), d = det(A);
  const disc = sub(mul(t, t), mul(F(4), d));
  const center = div(t, F(2));
  // √(N/D) = √(N·D) / D = (s/D)√r.
  const { s, r } = sqrtParts(disc.num * disc.den);
  const half = F(s, 2n * disc.den);
  if (isZero(disc)) return { t, d, disc, kind: "repeated", roots: [rational(center)], half, r: 1n };
  if (r === 1n) return { t, d, disc, kind: "distinct", roots: [rational(sub(center, half)), rational(add(center, half))], half, r };
  if (r > 0n) return { t, d, disc, kind: "distinct", roots: [{ a: center, b: neg(half), r }, { a: center, b: half, r }], half, r };
  return { t, d, disc, kind: "complex", roots: [{ a: center, b: half, r }, { a: center, b: neg(half), r }], half, r };
}

/**
 * An eigenvector of a 2 × 2 matrix A for its eigenvalue λ, from one row of A − λI: the row
 * (a − λ, b) is orthogonal to (b, λ − a). Scaled so that its parts are integers with no common
 * factor. For a multiple of I, every vector is an eigenvector; this gives (1, 0).
 */
export function eigenvector2(A: FMat, lambda: Surd): Surd[] {
  let v: Surd[];
  if (!isZero(A[0][1])) v = [rational(A[0][1]), surdMinus(lambda, A[0][0])];
  else if (!isZero(A[1][0])) v = [surdMinus(lambda, A[1][1]), rational(A[1][0])];
  else v = isRational(lambda) && equals(lambda.a, A[0][0]) ? [rational(F(1)), rational(F(0))] : [rational(F(0)), rational(F(1))];
  // Clear denominators, then common factors.
  const parts = v.flatMap(x => [x.a, x.b]);
  const L = parts.reduce((l, x) => lcm(l, x.den), 1n);
  const g = parts.reduce((acc, x) => gcd(acc, (x.num * L) / x.den), 0n) || 1n;
  const k = F(L, g);
  v = v.map(x => ({ a: mul(x.a, k), b: mul(x.b, k), r: lambda.r }));
  // The first entry positive, when it's a plain number.
  if (isRational(v[0]) && v[0].a.num < 0n) v = v.map(x => ({ a: neg(x.a), b: neg(x.b), r: x.r }));
  return v;
}

// ⋘──────── TeX ────────⋙

/** A fraction in TeX, with \frac (for display math). */
export function fracTex(x: Fraction): string {
  const f = fraction(x.num, x.den);
  if (f.den === 1n) return `${f.num}`;
  return `${f.num < 0n ? "-" : ""}\\frac{${abs(f.num)}}{${f.den}}`;
}
/** A fraction in TeX as a/b (for inline math, where \frac is too small). */
export const slashTex = (x: Fraction) => formatFraction(x).replace("−", "-");
/** In parentheses when negative or a fraction, for products like 2(−3). */
export const parenTex = (x: Fraction, frac = fracTex) => (x.num < 0n || fraction(x.num, x.den).den !== 1n ? `\\left(${frac(x)}\\right)` : frac(x));

const rootTex = (r: bigint) => (r === -1n ? "i" : r < 0n ? `\\sqrt{${-r}}\\,i` : `\\sqrt{${r}}`);
const termTex = (k: bigint, r: bigint) => `${abs(k) === 1n ? "" : abs(k)}${rootTex(r)}`;

/**
 * A surd a + b√r in TeX, over one denominator: (3 + √5)/2 as \frac{3 + \sqrt{5}}{2}, or, for
 * inline math (where \frac is too small), as (3 + \sqrt{5})/2.
 */
export function surdTex(s: Surd, pm = false, inline = false): string {
  if (isZero(s.b)) return inline ? slashTex(s.a) : fracTex(s.a);
  const L = lcm(s.a.den, s.b.den);
  const A = (s.a.num * L) / s.a.den, B = (s.b.num * L) / s.b.den;
  const op = pm ? "\\pm" : B < 0n ? "-" : "+";
  let top: string, sign = "";
  if (A === 0n) {
    top = termTex(B, s.r);
    if (pm) top = `\\pm ${top}`;
    else if (B < 0n) sign = "-";
  } else {
    top = `${A} ${op} ${termTex(B, s.r)}`;
  }
  if (L === 1n) return `${sign}${top}`;
  if (inline) return A === 0n ? `${sign}${top}/${L}` : `(${top})/${L}`;
  return `${sign}\\frac{${top}}{${L}}`;
}

/** "A - 3I", "A - (-2)I", "A - (1/2)I", or "A - I" (for inline math). */
export const shiftName = (x: Fraction) => (equals(x, F(1)) ? "A - I" : `A - ${parenTex(x, slashTex)}I`);
/** A product of two numbers, like "2 \cdot (-3)". */
export const prodTex = (x: Fraction, y: Fraction) => `${parenTex(x)} \\cdot ${parenTex(y)}`;
/** A diagonal entry of A − λI: "(2 - λ)", or "(-λ)" for a zero entry. */
export const diagTermTex = (x: Fraction, lambda = "\\lambda") => (isZero(x) ? `(-${lambda})` : `(${fracTex(x)} - ${lambda})`);
/** A term c·v after another term: " + 2x_2", " - x_2", " + 0x_2" is left out. */
export function plusTerm(c: Fraction, v: string): string {
  if (isZero(c)) return "";
  const negative = c.num < 0n, a = negative ? neg(c) : c;
  return ` ${negative ? "-" : "+"} ${equals(a, F(1)) ? "" : fracTex(a)}${v}`;
}

/** A surd as a decimal (or a complex number a ± bi), with `digits` decimals. */
export function surdDecimal(s: Surd, digits = 2): string {
  const { re, im } = surdValue(s);
  const f = (x: number) => (Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits).replace("-", "−");
  if (im === 0) return f(re);
  return `${f(re)} ${im < 0 ? "−" : "+"} ${f(Math.abs(im))}i`;
}

/** A polynomial in λ in TeX, from the highest power down, like "λ^2 - 5λ + 6". */
export function polyTex(p: Poly, x = "\\lambda"): string {
  let out = "";
  for (let i = p.length - 1; i >= 0; i--) {
    const c = p[i];
    if (isZero(c)) continue;
    const negative = c.num < 0n;
    const a = negative ? neg(c) : c;
    const power = i === 0 ? "" : i === 1 ? x : `${x}^{${i}}`;
    const coef = i > 0 && equals(a, F(1)) ? "" : fracTex(a);
    out += out === "" ? `${negative ? "-" : ""}${coef}${power}` : ` ${negative ? "-" : "+"} ${coef}${power}`;
  }
  return out === "" ? "0" : out;
}

export const colTex = (v: string[]) => `\\begin{bmatrix} ${v.join(" \\\\ ")} \\end{bmatrix}`;
export const vecTex = (v: FVec) => colTex(v.map(fracTex));
export const matTexOf = (m: string[][]) => `\\begin{bmatrix} ${m.map(row => row.join(" & ")).join(" \\\\ ")} \\end{bmatrix}`;
export const matTex = (m: FMat) => matTexOf(m.map(row => row.map(fracTex)));

/** A − λI with λ written as a symbol: "2 - λ", "-λ", "1/2 - λ". */
export function shiftTex(A: FMat, lambda = "\\lambda"): string {
  return matTexOf(A.map((row, i) => row.map((x, j) => (i !== j ? fracTex(x) : isZero(x) ? `-${lambda}` : `${fracTex(x)} - ${lambda}`))));
}

// ⋘──────── Practice problems ────────⋙

export type Kind = "evec" | "evalcheck" | "tri" | "poly2" | "vecs2" | "full2" | "repeated2" | "complex2" | "eig3";
export const KINDS: Kind[] = ["evec", "evalcheck", "tri", "poly2", "vecs2", "full2", "repeated2", "complex2", "eig3"];

export interface Problem {
  kind: Kind;
  A: FMat;
  v?: FVec;           // evec: the vector to check
  lambda?: Fraction;  // evalcheck: the number to check
}

export type Rng = () => number;
const randInt = (rng: Rng, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const pick = <T>(rng: Rng, items: T[]): T => items[Math.floor(rng() * items.length)];
function distinctInts(rng: Rng, count: number, lo: number, hi: number): number[] {
  const out: number[] = [];
  while (out.length < count) {
    const x = randInt(rng, lo, hi);
    if (!out.includes(x)) out.push(x);
  }
  return out;
}

/** The inverse of an invertible square matrix. */
export function inverse(M: FMat): FMat {
  const n = M.length;
  const { r } = rref(M.map((row, i) => [...row, ...identity(n)[i]]));
  return r.map(row => row.slice(n));
}
const matMul = (a: FMat, b: FMat): FMat => a.map(row => b[0].map((_, j) => row.reduce((s, x, k) => add(s, mul(x, b[k][j])), ZERO)));

/** A random integer matrix with determinant ±1 (so its inverse has integer entries too). */
export function randomUnimodular(n: number, rng: Rng): FMat {
  const P = identity(n);
  const ops = n === 2 ? 2 : 3 + randInt(rng, 0, 1);
  for (let k = 0; k < ops; k++) {
    const i = randInt(rng, 0, n - 1);
    let j = randInt(rng, 0, n - 2);
    if (j >= i) j++;
    const c = F(pick(rng, [1, -1, 1, -1, 2, -2]));
    P[i] = P[i].map((x, col) => add(x, mul(c, P[j][col])));  // Row i += c · row j
  }
  if (rng() < 0.3) [P[0], P[1]] = [P[1], P[0]];
  return P;
}

const maxAbs = (M: FMat) => Math.max(...M.flat().map(x => Math.abs(toNum(x))));
const offDiagonalNonzero = (M: FMat) => M.flatMap((row, i) => row.filter((x, j) => i !== j && !isZero(x))).length;
const isTriangular = (M: FMat) =>
  M.every((row, i) => row.every((x, j) => j >= i || isZero(x))) || M.every((row, i) => row.every((x, j) => j <= i || isZero(x)));

/**
 * P J P⁻¹ for a random P with determinant ±1, with entries at most `maxEntry` and (for 2 × 2) not
 * triangular, so the problem isn't too easy. Null if no such matrix turns up.
 */
function similar(J: FMat, rng: Rng, maxEntry: number): FMat | null {
  const n = J.length;
  for (let attempt = 0; attempt < 300; attempt++) {
    const P = randomUnimodular(n, rng);
    const A = matMul(matMul(P, J), inverse(P));
    if (maxAbs(A) > maxEntry) continue;
    if (n === 2 ? isTriangular(A) : offDiagonalNonzero(A) < 4) continue;
    return A;
  }
  return null;
}

const diag = (values: number[]): FMat => values.map((x, i) => values.map((_, j) => F(i === j ? x : 0)));

/** A matrix with the given integer eigenvalues (a diagonalizable one), by retrying. */
function withEigenvalues(rng: Rng, n: number, choose: () => number[], maxEntry: number): FMat {
  for (;;) {
    const A = similar(diag(choose()), rng, maxEntry);
    if (A) return A;
  }
}

export function randomProblem(kind: Kind, rng: Rng = Math.random, size?: number): Problem {
  switch (kind) {
    case "evec": {
      const n = size ?? (rng() < 0.6 ? 2 : 3);
      const A = withEigenvalues(rng, n, () => distinctInts(rng, n, -3, 5), n === 2 ? 9 : 7);
      const eigenvectors = rationalEigen(A).spaces.flatMap(s => s.basis);
      if (rng() < 0.5) {
        const v = pick(rng, eigenvectors).map(x => mul(x, F(pick(rng, [1, 1, -1, 2]))));
        return { kind, A, v };
      }
      for (;;) {
        const v = Array.from({ length: n }, () => F(randInt(rng, -3, 3)));
        if (v.every(isZero) || eigenvalueOf(A, v)) continue;
        return { kind, A, v };
      }
    }
    case "evalcheck": {
      const n = size ?? (rng() < 0.7 ? 2 : 3);
      const A = withEigenvalues(rng, n, () => distinctInts(rng, n, -3, 5), n === 2 ? 9 : 7);
      const actual = rationalEigen(A).roots.map(toNum);
      let lambda: number;
      if (rng() < 0.5) lambda = pick(rng, actual);
      else do lambda = randInt(rng, -4, 6); while (actual.includes(lambda));
      return { kind, A, lambda: F(lambda) };
    }
    case "tri": {
      const n = size ?? 3;
      const pool = distinctInts(rng, 2, -4, 6);
      const d = Array.from({ length: n }, () => (rng() < 0.75 ? randInt(rng, -4, 6) : pick(rng, pool)));
      const upper = rng() < 0.6;
      let A: FMat;
      do {
        A = d.map((x, i) => d.map((_, j) => F(i === j ? x : (upper ? j > i : j < i) ? randInt(rng, -4, 4) : 0)));
      } while (offDiagonalNonzero(A) < n - 1);  // 1 for 2 × 2, 2 for 3 × 3
      return { kind, A };
    }
    case "poly2":
    case "vecs2":
    case "full2":
      return { kind, A: withEigenvalues(rng, 2, () => distinctInts(rng, 2, -4, 6), 9) };
    case "repeated2": {
      const lambda = randInt(rng, -3, 4);
      if (rng() < 0.2) return { kind, A: diag([lambda, lambda]) };
      for (;;) {
        const A = similar([[F(lambda), F(1)], [F(0), F(lambda)]], rng, 9);
        if (A) return { kind, A };
      }
    }
    case "complex2": {
      for (;;) {
        const a = randInt(rng, -3, 3), b = randInt(rng, 1, 3);
        const C = fromInts([[a, -b], [b, a]]);
        if (rng() < 0.2) return { kind, A: C };
        const A = similar(C, rng, 9);
        if (A) return { kind, A };
      }
    }
    case "eig3": {
      const pattern = rng();
      for (;;) {
        const [l, m, k] = distinctInts(rng, 3, -3, 4);
        let J: FMat;
        if (pattern < 0.5) J = diag([l, m, k]);
        else if (pattern < 0.8) J = diag([l, l, m]);
        else J = fromInts([[l, 1, 0], [0, l, 0], [0, 0, m]]);
        const A = similar(J, rng, 7);
        if (A) return { kind, A };
      }
    }
  }
}

// ⋘──────── Problems in the URL ────────⋙
// "k=evec&A=2,1;1,2&v=1,-1" (with &l=3 for evalcheck).

const entryText = (x: Fraction) => formatFraction(x).replace("−", "-");
const vecText = (v: FVec) => v.map(entryText).join(",");

export function encodeProblem(p: Problem): string {
  const params = new URLSearchParams();
  params.set("k", p.kind);
  params.set("A", p.A.map(vecText).join(";"));
  if (p.v) params.set("v", vecText(p.v));
  if (p.lambda) params.set("l", entryText(p.lambda));
  return params.toString().replace(/%2C/g, ",").replace(/%3B/g, ";").replace(/%2F/g, "/");
}

const parseList = (text: string): FVec | null => {
  const out = text.split(",").map(s => (s.trim() === "" ? null : parseEntry(s)));
  return out.every(x => x !== null) ? (out as FVec) : null;
};

/** The problem in a URL query, or null if there is none or it doesn't make sense. */
export function decodeProblem(query: string): Problem | null {
  const params = new URLSearchParams(query);
  const kind = params.get("k") as Kind | null;
  const rows = params.get("A");
  if (!kind || !KINDS.includes(kind) || !rows) return null;
  const A = rows.split(";").map(parseList);
  if (A.some(r => r === null)) return null;
  const M = A as FMat;
  const n = M.length;
  if (n < 2 || n > 3 || M.some(r => r.length !== n)) return null;
  const p: Problem = { kind, A: M };
  if (kind === "evec") {
    const v = parseList(params.get("v") ?? "");
    if (!v || v.length !== n || v.every(isZero)) return null;
    p.v = v;
  }
  if (kind === "evalcheck") {
    const l = parseEntry(params.get("l") ?? "x");
    if (!l) return null;
    p.lambda = l;
  }
  return problemError(p) === null ? p : null;
}

/** The sizes of matrix each kind of problem uses. */
export const kindSizes = (kind: Kind): number[] =>
  kind === "evec" || kind === "evalcheck" || kind === "tri" ? [2, 3] : kind === "eig3" ? [3] : [2];

/**
 * Why a problem (such as one the student designs) can't be practiced, or null if it can. Each
 * kind needs answers that can be typed as numbers: rational eigenvalues, or complex ones a ± bi
 * with a and b rational.
 */
export function problemError(p: Problem): string | null {
  const n = p.A.length;
  if (!kindSizes(p.kind).includes(n)) return `This kind of problem uses a ${kindSizes(p.kind).map(k => `${k} × ${k}`).join(" or ")} matrix.`;
  if (p.kind === "evec") return !p.v || p.v.length !== n || p.v.every(isZero) ? "Enter a nonzero vector v: the zero vector is never an eigenvector." : null;
  if (p.kind === "evalcheck") return p.lambda ? null : "Enter the number λ to check.";
  if (p.kind === "tri") return isTriangular(p.A) ? null : "Enter a triangular matrix: all zeros below the diagonal, or all zeros above it.";
  const e = n === 2 ? eigen2(p.A) : null;
  const rationalRoots = rationalEigen(p.A).complete;
  switch (p.kind) {
    case "complex2":
      if (e!.kind !== "complex") return "This matrix has real eigenvalues. Choose one whose characteristic polynomial has no real roots, such as [1, −2; 2, 1].";
      return e!.r === -1n ? null : `This matrix's eigenvalues are about ${surdDecimal(e!.roots[0])} and ${surdDecimal(e!.roots[1])}, with an irrational imaginary part that can't be typed as a number. Choose a matrix whose eigenvalues are a ± bi with a and b rational.`;
    case "repeated2":
      return e!.kind === "repeated" ? null : "This matrix has two different eigenvalues. Choose one with a repeated eigenvalue: (tr A)² = 4 det A.";
    case "vecs2":
    case "full2":
      if (e!.kind === "repeated") return "This matrix has only one eigenvalue. Choose the “repeated eigenvalue” problem instead.";
      return e!.kind === "distinct" && e!.r === 1n ? null : "This matrix's eigenvalues aren't rational numbers, so they can't be typed as answers. Choose a matrix whose characteristic polynomial factors over the rationals.";
    case "poly2":
    case "eig3":
      return rationalRoots ? null : "This matrix's eigenvalues aren't all rational numbers, so they can't be typed as answers. Choose a matrix whose characteristic polynomial factors over the rationals.";
  }
  return null;
}
