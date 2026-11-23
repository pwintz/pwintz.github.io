// ╭───────────────────────────────────────────────────────────────╮
// │          Exact determinants and their practice problems        │
// ╰───────────────────────────────────────────────────────────────╯
// Shared by the determinants tool (../determinants.ts) and its tests. Every calculation is exact:
// matrix entries are fractions (../matrix/fraction.ts).
//
// The kinds of problems: a 2 × 2 determinant (and the area it gives), a triangular matrix, a 3 × 3
// or 4 × 4 cofactor expansion, row reduction to a triangular matrix, and the properties of
// determinants (transposes, row operations, scalar multiples, powers, and inverses).

import { Fraction, add, div, equals, fraction, isZero, mul, neg, parseEntry, reduce, sub } from "../matrix/fraction";
import { FMat } from "../matrix/linalg";

export const F = (num: number | bigint, den: number | bigint = 1): Fraction => fraction(num, den);
export const ZERO = F(0);
export const ONE = F(1);
export const toNumber = (x: Fraction) => Number(x.num) / Number(x.den);
export const fromInts = (rows: number[][]): FMat => rows.map(row => row.map(x => F(x)));
const isInt = (x: Fraction) => reduce(x).den === 1n;

// ⋘──────── Determinants ────────⋙

/** The matrix left after crossing out row i and column j (0-based). */
export const minorMatrix = (A: FMat, i: number, j: number): FMat =>
  A.filter((_, r) => r !== i).map(row => row.filter((_, c) => c !== j));

/** The sign (−1)^(i + j) of the (i, j) cofactor (0-based, so the same as 1-based). */
export const cofactorSign = (i: number, j: number): 1 | -1 => ((i + j) % 2 === 0 ? 1 : -1);

/** The determinant, by cofactor expansion along the first row. */
export function det(A: FMat): Fraction {
  const n = A.length;
  if (n === 0) return ONE;
  if (n === 1) return A[0][0];
  if (n === 2) return sub(mul(A[0][0], A[1][1]), mul(A[0][1], A[1][0]));
  let total = ZERO;
  for (let j = 0; j < n; j++) {
    if (isZero(A[0][j])) continue;
    const term = mul(A[0][j], det(minorMatrix(A, 0, j)));
    total = cofactorSign(0, j) > 0 ? add(total, term) : sub(total, term);
  }
  return total;
}

export const isUpper = (A: FMat) => A.every((row, i) => row.every((x, j) => j >= i || isZero(x)));
export const isLower = (A: FMat) => A.every((row, i) => row.every((x, j) => j <= i || isZero(x)));
export const isTriangular = (A: FMat) => isUpper(A) || isLower(A);
export const diagonal = (A: FMat) => A.map((row, i) => row[i]);
export const product = (xs: Fraction[]) => xs.reduce(mul, ONE);

// ⋘──────── Cofactor expansion ────────⋙

/** A row or a column of a matrix (0-based). */
export interface Line { type: "row" | "col"; index: number }

export const lineEntries = (A: FMat, line: Line): [number, number][] =>
  A.map((_, k): [number, number] => (line.type === "row" ? [line.index, k] : [k, line.index]));

/**
 * The row or column with the most zeros, which needs the fewest minors. Among ties, a row comes
 * before a column, and an earlier one before a later one, so a matrix without zeros uses row 1.
 */
export function bestLine(A: FMat): Line {
  const n = A.length;
  const lines: Line[] = [
    ...Array.from({ length: n }, (_, i): Line => ({ type: "row", index: i })),
    ...Array.from({ length: n }, (_, j): Line => ({ type: "col", index: j })),
  ];
  const zeros = (line: Line) => lineEntries(A, line).filter(([i, j]) => isZero(A[i][j])).length;
  return lines.reduce((best, line) => (zeros(line) > zeros(best) ? line : best));
}

/** The terms of the expansion along `line`: each nonzero entry, its minor, and its cofactor. */
export interface Term { i: number; j: number; entry: Fraction; minor: Fraction; cofactor: Fraction }
export function expansion(A: FMat, line: Line): Term[] {
  return lineEntries(A, line).filter(([i, j]) => !isZero(A[i][j])).map(([i, j]) => {
    const minor = det(minorMatrix(A, i, j));
    return { i, j, entry: A[i][j], minor, cofactor: cofactorSign(i, j) > 0 ? minor : neg(minor) };
  });
}

// ⋘──────── Row reduction ────────⋙

/** Row i ← row i − factor · row `pivot` (0-based). */
export interface RowOp { row: number; factor: Fraction }
/**
 * One column cleared below the diagonal: the rows swapped first (if the diagonal entry is 0), the
 * row replacements, and the matrix after them.
 */
export interface ElimStep { col: number; swap: number | null; ops: RowOp[]; before: FMat; after: FMat }

/**
 * Reduces A to an upper triangular matrix U with row replacements, swapping rows only when a
 * diagonal entry is 0 (with the first row below that has a nonzero entry in that column). A column
 * with zeros on and below the diagonal is skipped, and so is one with zeros below it already.
 * So det A = (−1)^swaps · det U.
 */
export function eliminate(A: FMat): { steps: ElimStep[]; U: FMat; swaps: number } {
  let M = A.map(row => [...row]);
  const steps: ElimStep[] = [];
  let swaps = 0;
  const n = A.length;
  for (let j = 0; j < n - 1; j++) {
    const before = M.map(row => [...row]);
    let swap: number | null = null;
    if (isZero(M[j][j])) {
      const k = M.findIndex((row, r) => r > j && !isZero(row[j]));
      if (k < 0) continue;
      [M[j], M[k]] = [M[k], M[j]];
      swap = k;
      swaps++;
    }
    const ops: RowOp[] = [];
    for (let i = j + 1; i < n; i++) {
      if (isZero(M[i][j])) continue;
      const factor = div(M[i][j], M[j][j]);
      M[i] = M[i].map((x, c) => sub(x, mul(factor, M[j][c])));
      ops.push({ row: i, factor });
    }
    if (swap === null && ops.length === 0) continue;
    steps.push({ col: j, swap, ops, before, after: M.map(row => [...row]) });
    M = M.map(row => [...row]);
  }
  return { steps, U: M, swaps };
}

// ⋘──────── Formatting ────────⋙

/** A fraction as typed text, such as "-3" or "1/2". */
export function fracText(x: Fraction): string {
  const f = reduce(x);
  return f.den === 1n ? `${f.num}` : `${f.num}/${f.den}`;
}
/** In TeX: \frac{1}{2} in a display, or 1/2 inline (\frac is too small inline). */
export function fracTex(x: Fraction, display = false): string {
  const f = reduce(x);
  if (f.den === 1n || !display) return fracText(f);
  return `${f.num < 0n ? "-" : ""}\\frac{${f.num < 0n ? -f.num : f.num}}{${f.den}}`;
}
/** In parentheses when negative or a fraction, for products like 2(−3). */
/** In parentheses: plain ones around an integer (\\left( adds space), stretchy ones around a fraction. */
export const paren = (x: Fraction, display = false) =>
  (isInt(x) || !display ? `(${fracTex(x, display)})` : `\\left(${fracTex(x, display)}\\right)`);
/** In parentheses when negative or a fraction, for products like 2(-3). */
export const parenTex = (x: Fraction, display = false) =>
  (x.num < 0n || !isInt(x) ? paren(x, display) : fracTex(x, display));
/**
 * A product of numbers written with parentheses, not dots (which look like decimal points):
 * "3(-2)(4)", or "(-3)(2)" when the first factor is negative.
 */
export const prodTex = (xs: Fraction[], display = false) =>
  xs.map((x, k) => (k === 0 ? parenTex(x, display) : paren(x, display))).join("");
/** A matrix in TeX, in brackets (bmatrix) or bars (vmatrix). */
export const matTex = (A: FMat, env: "bmatrix" | "vmatrix" = "bmatrix", display = true) =>
  `\\begin{${env}} ${A.map(row => row.map(x => fracTex(x, display)).join(" & ")).join(" \\\\ ")} \\end{${env}}`;
/** A sum of terms with signs, such as "6 - 2 + (1/2)" → "6 - 2 + \frac{1}{2}". */
export function signedSum(xs: Fraction[], display = false): string {
  return xs.map((x, k) => {
    const neg_ = x.num < 0n;
    const abs = fracTex(neg_ ? neg(x) : x, display);
    return k === 0 ? (neg_ ? `-${abs}` : abs) : `${neg_ ? " - " : " + "}${abs}`;
  }).join("") || "0";
}
/** Plain text with a true minus sign, for the readout. */
export const plainText = (x: Fraction) => fracText(x).replace("-", "−");

// ⋘──────── Problems ────────⋙

export type Kind = "det2" | "tri" | "cofactor3" | "rowreduce3" | "cofactor4" | "props";
export const KINDS: readonly Kind[] = ["det2", "tri", "cofactor3", "rowreduce3", "cofactor4", "props"];
export type MatKind = Exclude<Kind, "props">;

export type Problem =
  | { kind: MatKind; A: FMat }
  // A is an n × n matrix with det A = d; D scales a row of A by k, and C adds m times a row to another.
  | { kind: "props"; n: number; d: Fraction; k: Fraction; m: Fraction };

/** The sizes a kind of problem's matrix can have. */
export function kindSizes(kind: Kind): number[] {
  switch (kind) {
    case "det2": return [2];
    case "tri": return [3, 4];
    case "cofactor3": case "rowreduce3": return [3];
    case "cofactor4": return [4];
    case "props": return [2, 3, 4];
  }
}

export const MAX_PROPS_N = 6;

/** Why a problem can't be practiced, or null if it can. */
export function problemError(p: Problem): string | null {
  if (p.kind === "props") {
    if (!Number.isInteger(p.n) || p.n < 2 || p.n > MAX_PROPS_N) return `Choose a size n from 2 to ${MAX_PROPS_N}.`;
    if (isZero(p.d)) return "Choose det A ≠ 0, so that A is invertible.";
    if (isZero(p.k)) return "Choose k ≠ 0.";
    if (isZero(p.m)) return "Choose m ≠ 0.";
    return null;
  }
  const n = p.A.length;
  if (!kindSizes(p.kind).includes(n) || p.A.some(row => row.length !== n)) {
    return `Enter a ${kindSizes(p.kind).map(s => `${s} × ${s}`).join(" or ")} matrix.`;
  }
  if (p.kind === "tri" && !isTriangular(p.A)) {
    return "Enter a triangular matrix: zeros everywhere below the diagonal, or everywhere above it.";
  }
  return null;
}

export const URL_KEYS = ["dk", "dA", "dn", "dd", "ds", "dm"] as const;

export function encodeProblem(p: Problem): string {
  if (p.kind === "props") return `dk=props&dn=${p.n}&dd=${fracText(p.d)}&ds=${fracText(p.k)}&dm=${fracText(p.m)}`;
  return `dk=${p.kind}&dA=${p.A.map(row => row.map(fracText).join(",")).join(";")}`;
}

export const hasProblem = (query: string) => new URLSearchParams(query).has("dk");

export function decodeProblem(query: string): Problem | null {
  const q = new URLSearchParams(query);
  const kind = q.get("dk") as Kind | null;
  if (!kind || !KINDS.includes(kind)) return null;
  const num = (key: string): Fraction | null => {
    const text = q.get(key);
    if (text === null || text.trim() === "") return null;
    const x = parseEntry(text);
    return x && reduce(x);
  };
  let p: Problem | null = null;
  if (kind === "props") {
    const d = num("dd"), k = num("ds"), m = num("dm");
    if (d && k && m) p = { kind, n: Number(q.get("dn")), d, k, m };
  } else {
    const rows = (q.get("dA") ?? "").split(";").map(row => row.split(",").map(x => (x.trim() === "" ? null : parseEntry(x))));
    if (rows.every(row => row.every(x => x !== null))) p = { kind, A: rows.map(row => row.map(x => reduce(x!))) };
  }
  return p && problemError(p) === null ? p : null;
}

// ⋘──────── Random problems ────────⋙

export type Rng = () => number;
const int = (rnd: Rng, lo: number, hi: number) => lo + Math.floor(rnd() * (hi - lo + 1));
const nonzero = (rnd: Rng, max: number) => (rnd() < 0.5 ? -1 : 1) * int(rnd, 1, max);
const pick = <T>(rnd: Rng, xs: readonly T[]): T => xs[Math.floor(rnd() * xs.length)];
const square = (n: number, f: (i: number, j: number) => number) =>
  Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => f(i, j)));
/** The chance that a random matrix problem's matrix is singular (det A = 0). */
const SINGULAR_CHANCE = 0.35;
/**
 * Makes a square matrix singular, in place: one row (or column) becomes a multiple of another, so
 * the rows (or columns) are linearly dependent.
 */
function makeDependent(A: number[][], rnd: Rng): void {
  const n = A.length;
  const from = int(rnd, 0, n - 1);
  const to = (from + int(rnd, 1, n - 1)) % n;
  const t = pick(rnd, [1, -1, 2, -2]);
  if (rnd() < 0.5) A[to] = A[from].map(x => t * x);
  else A.forEach(row => { row[to] = t * row[from]; });
}
/** The chance that an entry of a random cofactor-expansion problem is 0. */
const ZERO_CHANCE = 0.3;
/** Whether a square matrix of numbers has a row or a column of zeros. */
const hasZeroLine = (A: number[][]) =>
  A.some(row => row.every(x => x === 0)) || A[0].some((_, j) => A.every(row => row[j] === 0));
const matMulInts =(L: number[][], U: number[][]) =>
  L.map(row => U[0].map((_, j) => row.reduce((s, x, k) => s + x * U[k][j], 0)));

/** A random problem of the kind; `size` chooses the size of a triangular matrix (3 or 4). */
export function randomProblem(kind: Kind, rnd: Rng = Math.random, size?: number): Problem {
  switch (kind) {
    case "det2": {
      // Sometimes, dependent columns: a determinant of 0.
      if (rnd() < SINGULAR_CHANCE) {
        const a = nonzero(rnd, 4), c = int(rnd, -4, 4), t = nonzero(rnd, 2);
        return { kind, A: fromInts([[a, t * a], [c, t * c]]) };
      }
      for (;;) {
        const A = square(2, () => int(rnd, -6, 6));
        // At most one zero, so the products aren't trivial.
        if (A.flat().filter(x => x === 0).length <= 1) return { kind, A: fromInts(A) };
      }
    }
    case "tri": {
      const n = size === 3 || size === 4 ? size : rnd() < 0.6 ? 3 : 4;
      const upper = rnd() < 0.6;
      const zeroAt = rnd() < SINGULAR_CHANCE ? int(rnd, 0, n - 1) : -1;
      const A = square(n, (i, j) => (i === j ? (i === zeroAt ? 0 : nonzero(rnd, n === 3 ? 5 : 3))
        : (upper ? j > i : j < i) ? int(rnd, -9, 9) : 0));
      return { kind, A: fromInts(A) };
    }
    case "cofactor3": {
      // Each entry is 0 with probability 0.3, so most matrices have rows or columns with one or two
      // zeros (and, rarely, a row or column of three).
      for (;;) {
        const A = square(3, () => (rnd() < ZERO_CHANCE ? 0 : nonzero(rnd, 5)));
        if (rnd() < SINGULAR_CHANCE) makeDependent(A, rnd);
        if (!hasZeroLine(A) || rnd() < 0.05) return { kind, A: fromInts(A) };
      }
    }
    case "rowreduce3": {
      // A = LU with whole-number multipliers in L, so the elimination stays in whole numbers.
      const L = [[1, 0, 0], [int(rnd, -3, 3), 1, 0], [int(rnd, -3, 3), int(rnd, -2, 2), 1]];
      const zeroLast = rnd() < SINGULAR_CHANCE;
      const U = [
        [nonzero(rnd, 2), int(rnd, -4, 4), int(rnd, -4, 4)],
        [0, nonzero(rnd, 3), int(rnd, -4, 4)],
        [0, 0, zeroLast ? 0 : nonzero(rnd, 4)],
      ];
      // Sometimes the first diagonal entry is 0, so that a swap is needed: then the second row of
      // LU starts with 0, and it goes first.
      if (rnd() < 0.2) {
        L[1][0] = 0;
        const M = matMulInts(L, U);
        return { kind, A: fromInts([M[1], M[0], M[2]]) };
      }
      return { kind, A: fromInts(matMulInts(L, U)) };
    }
    case "cofactor4": {
      // A row or a column with three zeros, whose one nonzero entry's minor has a zero too. The other
      // entries are 0 with probability 0.3, so other rows and columns often have zeros too.
      const entry = (max: number) => (rnd() < ZERO_CHANCE ? 0 : nonzero(rnd, max));
      for (;;) {
        const B = square(3, () => entry(4));
        const zeros = rnd() < 0.5 ? 1 : 2;
        const bRow = int(rnd, 0, 2);
        for (const k of [0, 1, 2].sort(() => rnd() - 0.5).slice(0, zeros)) B[bRow][k] = 0;
        // A singular minor makes A singular.
        if (rnd() < SINGULAR_CHANCE) makeDependent(B, rnd);
        const p = int(rnd, 0, 3), q = int(rnd, 0, 3), a = nonzero(rnd, 3);
        const asRow = rnd() < 0.5;
        // Fill the 4 × 4 matrix: row p and column q are crossed out to leave B.
        const A = square(4, () => 0);
        const others = (skip: number) => [0, 1, 2, 3].filter(k => k !== skip);
        others(p).forEach((i, bi) => others(q).forEach((j, bj) => { A[i][j] = B[bi][bj]; }));
        A[p][q] = a;
        // Row p (or column q) has only the entry a; the rest of column q (or row p) is random.
        for (let k = 0; k < 4; k++) {
          if (asRow && k !== p) A[k][q] = entry(4);
          if (!asRow && k !== q) A[p][k] = entry(4);
        }
        // No row or column of zeros (which would make the problem trivial).
        if (!hasZeroLine(A)) return { kind, A: fromInts(A) };
      }
    }
    case "props":
      return {
        kind,
        n: int(rnd, 2, 4),
        d: F(nonzero(rnd, 6)),
        k: F(pick(rnd, [2, 3, -1, -2])),
        m: F(nonzero(rnd, 4)),
      };
  }
}
