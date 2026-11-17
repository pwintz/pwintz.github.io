// ╭───────────────────────────────────────────────────────────────╮
// │              Matrix of a linear map relative to bases         │
// ╰───────────────────────────────────────────────────────────────╯
// Students find the matrix A of a linear map T : V → W relative to a basis 𝒱 of V and a basis 𝒲
// of W, following the method in the AM10 lecture notes (Module C, "The Matrix of a Linear Map"):
//   1. Apply T to each basis vector vⱼ in 𝒱.
//   2. Find the coordinates [T(vⱼ)]_𝒲 relative to 𝒲.
//   3. Place the coordinate vectors into the columns of A.
//   4. Use A to find [T(x)]_𝒲 = A[x]_𝒱 for a vector x.
// Then, following "Onto Functions and Rank" and "One-to-One Functions and Nullity" (LTC5 and LTC6),
// part 3 asks for the rank and nullity of A, and whether T is onto (rank A = dim W) and
// one-to-one (null A = 0).
// The student chooses which steps to do; the page works the others and shows its work. Each step
// has Check, Hint (two levels), and Show buttons, and the page counts hints and shown answers.
//
// Internally, every vector is a column of numbers: a vector in ℝᵏ is itself, and a polynomial
// a₀ + a₁x + a₂x² is (a₀, a₁, a₂). A problem stores
//   M, the matrix of T relative to the standard bases (so T(x) = Mx),
//   B, whose columns are the basis vectors of 𝒱, and
//   C, whose columns are the basis vectors of 𝒲,
// so that T(vⱼ) = M bⱼ, the coordinates c of T(vⱼ) solve C c = T(vⱼ), and A = C⁻¹ M B. Random
// problems pick C with determinant ±1 (or, when W is a plane or line in ℝ³, M with columns in the
// span of C), so every answer is an integer.
//
// The problem is saved in the page's URL (see encodeProblem), and the student's entries and hints
// are saved in this browser for that URL.

import {
  Fraction, add, equals, formatFraction, fraction, isOne, isZero, mul, neg, parseEntry, sub, div,
} from "./matrix/fraction";
import { setupPanels } from "./common/panels";
import { setupHelp } from "./common/help";
import { setupPractice } from "./common/practice";
import { typeset as typesetMath } from "./common/mathjax";
import { loadJSON, saveJSON } from "./common/storage";

// Typesets math, then takes it out of the Tab order (MathJax makes each formula focusable), so that
// Tab moves between the entry boxes and buttons rather than stopping on labels like "x" and "x²".
function typeset(els: Element[]): Promise<void> {
  return typesetMath(els).then(() => {
    for (const el of els) el.querySelectorAll<HTMLElement>("mjx-container[tabindex]").forEach(m => { m.tabIndex = -1; });
  });
}

declare global {
  interface Window { GAUSSIAN_PRACTICE_URL?: string }
}

// ⋘──────── Matrices of fractions ────────⋙

type Vec = Fraction[];
type Mat = Fraction[][];  // Rows

const F = (n: number) => fraction(n);
const fromInts = (rows: number[][]): Mat => rows.map(row => row.map(F));
const column = (m: Mat, j: number): Vec => m.map(row => row[j]);
const fromColumns = (cols: Vec[]): Mat => cols[0].map((_, i) => cols.map(c => c[i]));
const transpose = (m: Mat): Mat => m[0].map((_, j) => column(m, j));
const matVec = (m: Mat, v: Vec): Vec => m.map(row => row.reduce((s, x, k) => add(s, mul(x, v[k])), F(0)));
const matMul = (a: Mat, b: Mat): Mat => a.map(row => b[0].map((_, j) => row.reduce((s, x, k) => add(s, mul(x, b[k][j])), F(0))));
const vecEq = (a: Vec, b: Vec) => a.length === b.length && a.every((x, i) => equals(x, b[i]));
const matEq = (a: Mat, b: Mat) => a.length === b.length && a.every((row, i) => vecEq(row, b[i]));
const identity = (k: number): Mat => Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => F(i === j ? 1 : 0)));
const isIdentity = (m: Mat) => m.length === m[0].length && matEq(m, identity(m.length));
const maxAbs = (m: Mat) => Math.max(...m.flat().map(x => Math.abs(Number(x.num) / Number(x.den))));

// Row reduces a copy of m, returning the RREF and its pivot columns.
function rref(m: Mat): { r: Mat; pivots: number[] } {
  const r = m.map(row => [...row]);
  const pivots: number[] = [];
  let row = 0;
  for (let col = 0; col < r[0].length && row < r.length; col++) {
    const p = r.findIndex((x, i) => i >= row && !isZero(x[col]));
    if (p < 0) continue;
    [r[row], r[p]] = [r[p], r[row]];
    const lead = r[row][col];
    r[row] = r[row].map(x => div(x, lead));
    for (let i = 0; i < r.length; i++) {
      if (i === row || isZero(r[i][col])) continue;
      const c = r[i][col];
      r[i] = r[i].map((x, k) => sub(x, mul(c, r[row][k])));
    }
    pivots.push(col);
    row++;
  }
  return { r, pivots };
}
const rank = (m: Mat) => rref(m).pivots.length;

// The solution c of C c = y, if there is exactly one.
function solve(C: Mat, y: Vec): Vec | null {
  const n = C[0].length;
  const { r, pivots } = rref(C.map((row, i) => [...row, y[i]]));
  if (pivots.length !== n || pivots.includes(n)) return null;
  return r.slice(0, n).map(row => row[n]);
}

// ⋘──────── TeX ────────⋙

const tex = (x: Fraction) => formatFraction(x).replace("−", "-");

// A linear combination like "2x_1 - x_2" or "1 + 3x". Terms with a coefficient of 0 are left out.
function combo(terms: { c: Fraction; v: string }[]): string {
  let out = "";
  for (const { c, v } of terms) {
    if (isZero(c)) continue;
    const negative = c.num < 0n;
    const a = negative ? neg(c) : c;
    const coef = v === "" ? tex(a) : isOne(a) ? "" : a.den !== 1n ? `(${tex(a)})` : tex(a);
    const sign = out === "" ? (negative ? "-" : "") : (negative ? " - " : " + ");
    out += sign + coef + v;
  }
  return out === "" ? "0" : out;
}

const POWERS = ["", "x", "x^2", "x^3"];
const polyTex = (p: Vec) => combo(p.map((c, i) => ({ c, v: POWERS[i] })));
const colTex = (v: string[]) => `\\begin{bmatrix} ${v.join(" \\\\ ")} \\end{bmatrix}`;
const vecTex = (v: Vec) => colTex(v.map(tex));
const matTex = (m: Mat) => `\\begin{bmatrix} ${m.map(row => row.map(tex).join(" & ")).join(" \\\\ ")} \\end{bmatrix}`;
// An augmented matrix [m | last], with each column of m (and the last column) in a color.
const augTex = (m: Mat, last: Vec, colors: string[], lastColor: string) =>
  `\\left[\\begin{array}{${"c".repeat(m[0].length)}|c} ${m.map((row, i) =>
    [...row.map((x, j) => colorTex(colors[j], tex(x))), colorTex(lastColor, tex(last[i]))].join(" & ")).join(" \\\\ ")} \\end{array}\\right]`;
const $ = (s: string) => `\\(${s}\\)`;

// Colors from the Okabe–Ito palette: for v₁, v₂, v₃ (the same as in the vector span tool), and for
// w₁, w₂, w₃.
const V_COLORS = ["#D55E00", "#0072B2", "#009E73"];
const W_COLORS = ["#CC79A7", "#8F6A00", "#56B4E9"];  // Purple, a dark gold (orange, darkened to read as text and to differ from v₁), and sky blue
const rgb = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(",");
const colorTex = (hex: string, s: string) => `{\\color[RGB]{${rgb(hex)}}${s}}`;
const $$ = (s: string) => `\\[${s}\\]`;

// ⋘──────── Spaces and maps ────────⋙

// A space of column vectors ("R") or polynomials ("P"). `ambient` is the number of entries (or
// coefficients); `dim` is the number of basis vectors, which is smaller when W is a plane or a line
// in ℝ³.
interface Space { kind: "R" | "P"; ambient: number; dim: number }
const Rn = (k: number): Space => ({ kind: "R", ambient: k, dim: k });
const Pn = (d: number): Space => ({ kind: "P", ambient: d + 1, dim: d + 1 });

const SPACES: Record<string, { V: Space; W: Space }> = {
  r2r2: { V: Rn(2), W: Rn(2) },
  r3r3: { V: Rn(3), W: Rn(3) },
  r3r2: { V: Rn(3), W: Rn(2) },
  r2r3: { V: Rn(2), W: Rn(3) },
  r3plane: { V: Rn(3), W: { kind: "R", ambient: 3, dim: 2 } },
  r3line: { V: Rn(3), W: { kind: "R", ambient: 3, dim: 1 } },
  p2p2: { V: Pn(2), W: Pn(2) },
  p2p1: { V: Pn(2), W: Pn(1) },
  p1p2: { V: Pn(1), W: Pn(2) },
};
type SpaceId = keyof typeof SPACES;

const isSubspace = (s: Space) => s.dim < s.ambient;
function spaceTex(s: Space): string {
  if (isSubspace(s)) return "W";
  return s.kind === "R" ? `\\mathbb{R}^{${s.ambient}}` : `\\mathcal{P}_{${s.ambient - 1}}`;
}

// Maps described in words. `text` finishes the sentence "Let T : V → W be …", and `hint` is the
// first hint for step 1(a).
interface NamedMap { spaces: SpaceId; M: number[][]; text: string; hint: string }
const NAMED: Record<string, NamedMap> = {
  rot90: {
    spaces: "r2r2", M: [[0, -1], [1, 0]],
    text: "the rotation by \\(90^\\circ\\) counterclockwise about the origin",
    hint: "Rotating \\((a, b)\\) by \\(90^\\circ\\) counterclockwise gives \\((-b, a)\\). Draw each basis vector and rotate it.",
  },
  rot90cw: {
    spaces: "r2r2", M: [[0, 1], [-1, 0]],
    text: "the rotation by \\(90^\\circ\\) clockwise about the origin",
    hint: "Rotating \\((a, b)\\) by \\(90^\\circ\\) clockwise gives \\((b, -a)\\). Draw each basis vector and rotate it.",
  },
  rot180: {
    spaces: "r2r2", M: [[-1, 0], [0, -1]],
    text: "the rotation by \\(180^\\circ\\) about the origin",
    hint: "Rotating a vector by \\(180^\\circ\\) points it the opposite way: \\((a, b)\\) becomes \\((-a, -b)\\).",
  },
  reflx1: {
    spaces: "r2r2", M: [[1, 0], [0, -1]],
    text: "the reflection across the \\(x_1\\)-axis",
    hint: "Reflecting \\((a, b)\\) across the \\(x_1\\)-axis keeps \\(a\\) and flips the sign of \\(b\\).",
  },
  reflx2: {
    spaces: "r2r2", M: [[-1, 0], [0, 1]],
    text: "the reflection across the \\(x_2\\)-axis",
    hint: "Reflecting \\((a, b)\\) across the \\(x_2\\)-axis flips the sign of \\(a\\) and keeps \\(b\\).",
  },
  refldiag: {
    spaces: "r2r2", M: [[0, 1], [1, 0]],
    text: "the reflection across the line \\(x_2 = x_1\\)",
    hint: "Reflecting \\((a, b)\\) across the line \\(x_2 = x_1\\) swaps its entries, giving \\((b, a)\\).",
  },
  projx1: {
    spaces: "r2r2", M: [[1, 0], [0, 0]],
    text: "the orthogonal projection onto the \\(x_1\\)-axis",
    hint: "Projecting \\((a, b)\\) onto the \\(x_1\\)-axis keeps \\(a\\) and replaces \\(b\\) with 0.",
  },
  stretch2: {
    spaces: "r2r2", M: [[2, 0], [0, 2]],
    text: "the stretch by a factor of 2 (so \\(T(\\mathbf{x}) = 2\\mathbf{x}\\))",
    hint: "Stretching by a factor of 2 doubles every entry.",
  },
  rotz: {
    spaces: "r3r3", M: [[0, -1, 0], [1, 0, 0], [0, 0, 1]],
    text: "the rotation by \\(90^\\circ\\) about the \\(x_3\\)-axis, counterclockwise when seen from above",
    hint: "This rotation turns \\((a, b, c)\\) into \\((-b, a, c)\\): the first two entries rotate as in the plane, and the third stays put.",
  },
  reflx1x2: {
    spaces: "r3r3", M: [[1, 0, 0], [0, 1, 0], [0, 0, -1]],
    text: "the reflection across the \\(x_1x_2\\)-plane",
    hint: "Reflecting \\((a, b, c)\\) across the \\(x_1x_2\\)-plane flips the sign of \\(c\\).",
  },
  projx1x2: {
    spaces: "r3r3", M: [[1, 0, 0], [0, 1, 0], [0, 0, 0]],
    text: "the orthogonal projection onto the \\(x_1x_2\\)-plane",
    hint: "Projecting \\((a, b, c)\\) onto the \\(x_1x_2\\)-plane replaces \\(c\\) with 0.",
  },
  deriv: {
    spaces: "p2p2", M: [[0, 1, 0], [0, 0, 2], [0, 0, 0]],
    text: "the derivative, \\(T(p) = p'\\)",
    hint: "Differentiate each basis polynomial: the derivative of \\(a_0 + a_1 x + a_2 x^2\\) is \\(a_1 + 2a_2 x\\).",
  },
  shift: {
    spaces: "p2p2", M: [[1, 1, 1], [0, 1, 2], [0, 0, 1]],
    text: "the shift \\(T(p)(x) = p(x + 1)\\)",
    hint: "Replace each \\(x\\) in the basis polynomial with \\(x + 1\\), then expand. For example, \\(x^2\\) becomes \\((x + 1)^2 = 1 + 2x + x^2\\).",
  },
  xderiv: {
    spaces: "p2p2", M: [[0, 0, 0], [0, 1, 0], [0, 0, 2]],
    text: "the map \\(T(p)(x) = x\\,p'(x)\\)",
    hint: "Differentiate the basis polynomial, then multiply by \\(x\\).",
  },
  flip: {
    spaces: "p2p2", M: [[1, 0, 0], [0, -1, 0], [0, 0, 1]],
    text: "the map \\(T(p)(x) = p(-x)\\)",
    hint: "Replace each \\(x\\) in the basis polynomial with \\(-x\\). The sign of each odd power flips.",
  },
  deriv21: {
    spaces: "p2p1", M: [[0, 1, 0], [0, 0, 2]],
    text: "the derivative, \\(T(p) = p'\\)",
    hint: "Differentiate each basis polynomial: the derivative of \\(a_0 + a_1 x + a_2 x^2\\) is \\(a_1 + 2a_2 x\\).",
  },
  evals: {
    spaces: "p2p1", M: [[1, 0, 0], [1, 1, 1]],
    text: "the map \\(T(p)(x) = p(0) + p(1)\\,x\\)",
    hint: "Evaluate the basis polynomial at 0 and at 1: these are the constant term and the coefficient of \\(x\\) of the result.",
  },
  mulx: {
    spaces: "p1p2", M: [[0, 0], [1, 0], [0, 1]],
    text: "the map \\(T(p)(x) = x\\,p(x)\\)",
    hint: "Multiply the basis polynomial by \\(x\\): each power of \\(x\\) goes up by one.",
  },
  mulx1: {
    spaces: "p1p2", M: [[1, 0], [1, 1], [0, 1]],
    text: "the map \\(T(p)(x) = (x + 1)\\,p(x)\\)",
    hint: "Multiply the basis polynomial by \\(x + 1\\) and expand.",
  },
};

// ⋘──────── Problems ────────⋙

type BasesChoice = "wstd" | "vstd" | "both" | "same" | "std";
// How the problem gives T: a formula, a matrix (T(x) = Mx), a description in words (NAMED), or
// what T does to the standard basis vectors ("basis").
type Form = "formula" | "matrix" | "named" | "basis";

interface Problem {
  spaces: SpaceId;
  form: Form;
  named: string;   // The NAMED key when form is "named"
  M: Mat;          // T relative to the standard bases
  B: Mat;          // Columns: the basis 𝒱
  C: Mat;          // Columns: the basis 𝒲
  same: boolean;   // One basis ℬ for V and W
  x: Vec;          // [x]_𝒱, for step 2(a)
}

// T(vⱼ), [T(vⱼ)]_𝒲, A, the vector x itself (from [x]_𝒱 = p.x), and [T(x)]_𝒲.
interface Solution { TV: Vec[]; coords: Vec[]; A: Mat; xVec: Vec; Tx: Vec }

export function solveProblem(p: Problem): Solution {
  const n = p.B[0].length;
  const TV = Array.from({ length: n }, (_, j) => matVec(p.M, column(p.B, j)));
  const coords = TV.map(y => solve(p.C, y)!);
  const A = fromColumns(coords);
  return { TV, coords, A, xVec: matVec(p.B, p.x), Tx: matVec(A, p.x) };
}

// The URL: ?sp=r2r2&map=f (formula), m (matrix), or a NAMED key, &M=…&V=…&W=… (matrices with rows
// separated by ";" and the basis vectors as columns), &same=1 for one basis, and &x=2,-1.
const plain = (x: Fraction) => tex(x);
const encodeMat = (m: Mat) => m.map(row => row.map(plain).join(",")).join(";");
function decodeMat(text: string | null): Mat | null {
  if (!text) return null;
  const rows = text.split(";").map(row => row.split(",").map(parseEntry));
  if (rows.some(row => row.some(x => x === null) || row.length !== rows[0].length)) return null;
  return rows as Mat;
}

export function encodeProblem(p: Problem): string {
  const params = new URLSearchParams();
  params.set("sp", p.spaces);
  params.set("map", p.form === "named" ? p.named : p.form === "matrix" ? "m" : p.form === "basis" ? "b" : "f");
  params.set("M", encodeMat(p.M));
  params.set("V", encodeMat(p.B));
  params.set("W", encodeMat(p.C));
  if (p.same) params.set("same", "1");
  params.set("x", p.x.map(plain).join(","));
  return params.toString().replace(/%2C/g, ",").replace(/%3B/g, ";").replace(/%2F/g, "/");
}

export function decodeProblem(search: string): Problem | null {
  const params = new URLSearchParams(search);
  const spaces = params.get("sp") ?? "";
  if (!(spaces in SPACES)) return null;
  const { V, W } = SPACES[spaces];
  const map = params.get("map") ?? "f";
  const named = map in NAMED && NAMED[map].spaces === spaces ? map : "";
  const form: Form = named ? "named" : map === "m" && V.kind === "R" ? "matrix" : map === "b" ? "basis" : "formula";
  const M = named ? fromInts(NAMED[named].M) : decodeMat(params.get("M"));
  const B = decodeMat(params.get("V"));
  const C = decodeMat(params.get("W"));
  const x = decodeMat(params.get("x"))?.[0];
  if (!M || !B || !C || !x) return null;
  const sizesOk = M.length === W.ambient && M[0].length === V.ambient
    && B.length === V.ambient && B[0].length === V.dim
    && C.length === W.ambient && C[0].length === W.dim && x.length === V.dim;
  if (!sizesOk || rank(B) !== V.dim || rank(C) !== W.dim) return null;
  const problem: Problem = { spaces, form, named, M, B, C, same: params.get("same") === "1" && matEq(B, C), x };
  // Every T(vⱼ) has to lie in W.
  if (Array.from({ length: V.dim }, (_, j) => solve(C, matVec(M, column(B, j)))).some(c => c === null)) return null;
  return problem;
}

// ⋘──────── Random problems ────────⋙

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const pick = <T>(items: readonly T[]) => items[randomInt(0, items.length - 1)];
const randomInts = (rows: number, cols: number, min: number, max: number) =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => randomInt(min, max)));
const intMaxAbs = (m: number[][]) => Math.max(...m.flat().map(Math.abs));
const hasZeroColumn = (m: number[][]) => m[0].some((_, j) => m.every(row => row[j] === 0));

// A basis whose matrix has determinant ±1 (so coordinates relative to it are integers), made by
// column operations on the identity. It isn't the standard basis.
function unimodularBasis(k: number): number[][] {
  for (;;) {
    const m: number[][] = Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => (i === j ? 1 : 0)));
    for (let s = 0; s < k + 1; s++) {
      const i = randomInt(0, k - 1);
      let j = randomInt(0, k - 2);
      if (j >= i) j++;
      const c = pick([-1, 1, 1, 2, -2]);
      const next = m.map(row => row.map((x, col) => (col === i ? x + c * row[j] : x)));
      if (intMaxAbs(next) <= 3) m.splice(0, k, ...next);
    }
    if (Math.random() < 0.3) {
      const j = randomInt(0, k - 1);
      m.forEach(row => { row[j] = -row[j]; });
    }
    if (m.some((row, i) => row.some((x, j) => i !== j && x !== 0))) return m;
  }
}

// A basis with small entries (any nonzero determinant), which isn't the standard basis.
function smallBasis(k: number): number[][] {
  if (Math.random() < 0.5) return unimodularBasis(k);
  for (;;) {
    const m = randomInts(k, k, -2, 3);
    if (hasZeroColumn(m) || rank(fromInts(m)) < k) continue;
    if (isIdentity(fromInts(m))) continue;
    return m;
  }
}

// A basis of a plane or a line in ℝᵏ: dim independent columns with small entries.
function subspaceBasis(k: number, dim: number): number[][] {
  for (;;) {
    const m = randomInts(k, dim, -2, 2);
    if (hasZeroColumn(m) || rank(fromInts(m)) < dim) continue;
    // Not a coordinate axis or plane, which would make the problem too easy.
    if (m.filter(row => row.every(x => x === 0)).length > 0) continue;
    return m;
  }
}

// "path": problems come from the practice path's current stage (an index into STAGES); "custom":
// from the spaces, bases, and form the student chooses (see common/practice.ts).
export interface Settings { spaces: string; bases: string; form: string; level: number; mode: "path" | "custom"; stage: number }

// The practice path: stages from easy to hard, each adding one idea. Each stage gives random
// problems of its kind; `spaces` lists the spaces it picks from. Progress is saved by `id`, so
// stages can be added, removed, or reordered without mixing up saved progress.
interface Stage { id: string; title: string; note: string; spaces: SpaceId[]; bases: string; form: string }
export const STAGES: Stage[] = [
  { id: "std", title: "Standard bases", spaces: ["r2r2"], bases: "std", form: "formula",
    note: "With the standard basis, coordinates are just entries, so each column of A is T applied to a standard basis vector." },
  { id: "on-basis", title: "A map given on a basis", spaces: ["r2r2"], bases: "std", form: "basis",
    note: "The map is given by what it does to the standard basis vectors." },
  { id: "nonstandard", title: "Nonstandard bases", spaces: ["r2r2"], bases: "any", form: "any",
    note: "One or both bases are nonstandard: a nonstandard domain basis 𝒱, a nonstandard target basis 𝒲, one basis ℬ for both, or two different bases." },
  { id: "dimensions", title: "Different dimensions", spaces: ["r3r2", "r2r3"], bases: "both", form: "any",
    note: "The domain and the target have different dimensions, so A isn't square." },
  { id: "geometric", title: "A geometric map", spaces: ["r2r2"], bases: "any", form: "named",
    note: "The map is described in words, such as a rotation or a reflection, with standard or nonstandard bases. Find what it does to each basis vector; drawing it helps." },
  { id: "poly-std", title: "Polynomials, standard bases", spaces: ["p2p2", "p2p1", "p1p2"], bases: "std", form: "any",
    note: "Maps on polynomials, such as the derivative, with the standard bases 1, x, x², …." },
  { id: "poly", title: "Polynomials, nonstandard bases", spaces: ["p2p2", "p2p1", "p1p2"], bases: "both", form: "any",
    note: "Maps on polynomials with nonstandard bases." },
  { id: "subspace", title: "A plane or a line in ℝ³", spaces: ["r3plane", "r3line"], bases: "both", form: "any",
    note: "The target W is a plane or a line in ℝ³, so its basis has fewer vectors than ℝ³ has entries." },
  { id: "r3", title: "Three dimensions", spaces: ["r3r3"], bases: "both", form: "any",
    note: "Maps from ℝ³ to ℝ³ with nonstandard bases: the most arithmetic." },
];
const CLEAN_TO_ADVANCE_STAGE = 2;  // Problems right with no hints before suggesting the next stage

// The spaces, bases, and form to use for a new problem.
function problemSettings(settings: Settings): Settings {
  if (settings.mode !== "path") return settings;
  const stage = STAGES[Math.min(Math.max(settings.stage, 0), STAGES.length - 1)];
  return { ...settings, spaces: pick(stage.spaces), bases: stage.bases, form: stage.form };
}

// The steps: 0 apply T to each vⱼ, 1 find [T(vⱼ)]_𝒲, 2 assemble A, 3 find [x]_𝒱, 4 find
// [T(x)]_𝒲 = A[x]_𝒱, 5 find rank A and null A, and 6 decide whether T is onto and one-to-one.
// Each step opens once the steps it uses (PREREQS) are done.
const STEPS = [0, 1, 2, 3, 4, 5, 6] as const;
const PREREQS: number[][] = [[], [0], [1], [], [2, 3], [2], [5]];
// Step 3(b)'s answers are "yes" or "no", stored as 1 or 0.
const YES_NO_STEP = 6;
// The parts of the problem are numbered 1, 2, 3, and the steps of each part are lettered: 1(a),
// 1(b), 1(c) find A; 2(a), 2(b) use it; 3(a), 3(b) decide onto and one-to-one.
const STEP_PART = [0, 0, 0, 1, 1, 2, 2];
const STEP_LABELS = ["1(a)", "1(b)", "1(c)", "2(a)", "2(b)", "3(a)", "3(b)"];

// The levels, from easiest to hardest (each labeled on the page): the steps the student does; the
// page works the others. At the last level, the whole problem is done by hand (see byHand).
const LEVELS: { tasks: boolean[] }[] = [
  { tasks: [false, false, true, false, true, true, true] },  // Assemble A from given coordinates
  { tasks: [false, true, true, true, true, true, true] },    // Find coordinates and assemble A
  { tasks: [true, true, true, true, true, true, true] },     // Apply T, find coordinates, and assemble A
  { tasks: [false, false, true, false, true, true, true] },  // Solve the whole problem by hand
];

export function randomProblem(settings: Settings): Problem {
  const spaces = (settings.spaces in SPACES ? settings.spaces : pick(Object.keys(SPACES))) as SpaceId;
  const { V, W } = SPACES[spaces];
  const sub = isSubspace(W);
  const sameSpace = !sub && V.kind === W.kind && V.ambient === W.ambient;
  const allBases: BasesChoice[] = sameSpace ? ["wstd", "vstd", "both", "same"] : sub ? ["vstd", "both"] : ["wstd", "vstd", "both"];
  let bases = (settings.bases === "any" ? pick(allBases) : settings.bases) as BasesChoice;
  // "std" (both bases standard, used by the practice path) needs W to be a whole space.
  if (!allBases.includes(bases) && !(bases === "std" && !sub)) bases = "both";
  const namedKeys = Object.keys(NAMED).filter(key => NAMED[key].spaces === spaces);
  const forms: Form[] = ["formula", "basis", ...(V.kind === "R" ? ["matrix" as const] : []), ...(namedKeys.length ? ["named" as const] : [])];
  let form = (settings.form === "any" ? pick(forms) : settings.form) as Form;
  if (!forms.includes(form)) form = "formula";

  for (let attempt = 0; ; attempt++) {
    const named = form === "named" ? pick(namedKeys) : "";
    let B: number[][], C: number[][];
    const I = (k: number) => Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => (i === j ? 1 : 0)));
    switch (bases) {
      case "wstd": B = smallBasis(V.dim); C = I(W.dim); break;
      case "vstd": B = I(V.dim); C = sub ? subspaceBasis(W.ambient, W.dim) : unimodularBasis(W.dim); break;
      case "same": B = unimodularBasis(V.dim); C = B; break;
      case "std": B = I(V.dim); C = I(W.dim); break;
      default: B = smallBasis(V.dim); C = sub ? subspaceBasis(W.ambient, W.dim) : unimodularBasis(W.dim);
    }
    // About half of the random maps have less than full rank, so that, in part 3, some maps
    // aren't onto or one-to-one even when dim V = dim W. Such a map is a product of a tall
    // matrix and a wide one, through a space of dimension `inner`.
    const intMul = (a: number[][], b: number[][]) => a.map(row => b[0].map((_, j) => row.reduce((s, x, k) => s + x * b[k][j], 0)));
    const fullRank = Math.min(V.dim, W.dim);
    const inner = fullRank > 1 && Math.random() < 0.5 ? randomInt(1, fullRank - 1) : 0;
    let M: number[][];
    if (named) {
      M = NAMED[named].M;
    } else if (sub) {
      const N = inner ? intMul(randomInts(W.dim, inner, -1, 2), randomInts(inner, V.ambient, -2, 2)) : randomInts(W.dim, V.ambient, -2, 2);
      M = intMul(C, N);
    } else {
      M = inner ? intMul(randomInts(W.ambient, inner, -2, 2), randomInts(inner, V.ambient, -2, 2)) : randomInts(W.ambient, V.ambient, -3, 3);
    }
    const x = randomInts(1, V.dim, -2, 3)[0];
    const problem: Problem = {
      spaces, form, named, M: fromInts(M), B: fromInts(B), C: fromInts(C), same: bases === "same" || (bases === "std" && sameSpace), x: x.map(F),
    };
    const s = solveProblem(problem);
    const ok = s.coords.every(c => c && c.every(v => v.den === 1n))
      && maxAbs(problem.M) <= 9 && maxAbs(fromColumns(s.TV)) <= 12 && maxAbs(s.A) <= 12
      && s.A.flat().some(v => !isZero(v)) && maxAbs([s.xVec]) <= 9 && x.filter(v => v !== 0).length >= Math.min(2, V.dim);
    if (ok || attempt > 500) return problem;
  }
}

// ⋘──────── Examples ────────⋙

const EXAMPLES: Record<string, Problem> = {
  rotation: {
    spaces: "r2r2", form: "named", named: "rot90", M: fromInts(NAMED.rot90.M),
    B: identity(2), C: identity(2), same: true, x: [F(1), fraction(1, 2)],
  },
  derivative: {
    spaces: "p2p2", form: "named", named: "deriv", M: fromInts(NAMED.deriv.M),
    B: identity(3), C: identity(3), same: true, x: [F(6), F(-5), F(3)],
  },
  line: {
    spaces: "r3line", form: "formula", named: "", M: fromInts([[1, 0, 0], [1, 0, 0], [1, 0, 0]]),
    B: identity(3), C: fromInts([[1], [1], [1]]), same: false, x: [F(2), F(-1), F(5)],
  },
  skewed: {
    spaces: "r2r2", form: "named", named: "rot90", M: fromInts(NAMED.rot90.M),
    B: fromInts([[1, 1], [0, 1]]), C: fromInts([[1, 1], [0, 1]]), same: true, x: [F(1), F(1)],
  },
  shift: {
    spaces: "p2p2", form: "named", named: "shift", M: fromInts(NAMED.shift.M),
    B: fromInts([[1, -1, 1], [0, 1, -2], [0, 0, 1]]), C: fromInts([[1, -1, 1], [0, 1, -2], [0, 0, 1]]), same: true, x: [F(2), F(0), F(1)],
  },
  projection: {
    spaces: "r2r2", form: "named", named: "projx1", M: fromInts(NAMED.projx1.M),
    B: fromInts([[1, 1], [1, 2]]), C: fromInts([[1, 1], [0, 1]]), same: false, x: [F(3), F(-1)],
  },
};

// ⋘──────── Page ────────⋙

const SETTINGS_KEY = "matrix_of_linear_map_settings";
// The student's work on recent problems, by problem (so Previous can return to it).
const WORKS_KEY = "matrix_of_linear_map_works";
const MAX_SAVED_WORKS = 40;
const PIN_KEY = "matrix_of_linear_map_pinned";
const CLEAN_TO_ADVANCE = 3;  // Problems right with no hints before suggesting the next level

type Status = "" | "right" | "shown";
// `hintsUsed` counts hints, shown answers, and wrong checks; `wrongChecks` counts just the wrong
// checks, and `lastWrong` holds each step's last wrong answer, so checking it again doesn't count.
interface Work {
  problem: string; entries: string[][]; status: Status[]; hintLevel: number[]; hintsUsed: number;
  wrongChecks?: number; lastWrong?: string[];
}

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = "", html = ""): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (html) el.innerHTML = html;
  return el;
}

function initPage(): void {
  const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const spacesSelect = byId<HTMLSelectElement>("mm-spaces");
  const basesSelect = byId<HTMLSelectElement>("mm-bases");
  const formSelect = byId<HTMLSelectElement>("mm-form");
  const exampleSelect = byId<HTMLSelectElement>("mm-example");
  const levelButtons = [...document.querySelectorAll<HTMLInputElement>("input[name=mm-level]")];
  const statement = byId<HTMLDivElement>("mm-statement");
  const figureSvg = byId<HTMLDivElement>("mm-figure-svg");
  const figureNote = byId<HTMLParagraphElement>("mm-figure-note");
  const stepsBox = byId<HTMLDivElement>("mm-steps");
  const hintCount = byId<HTMLSpanElement>("mm-hint-count");
  const doneBox = byId<HTMLDivElement>("mm-done");
  const doneText = byId<HTMLElement>("mm-done-text");
  const doneSuggest = byId<HTMLParagraphElement>("mm-done-suggest");
  const doneSuggestText = byId<HTMLSpanElement>("mm-done-suggest-text");
  const doneNextLevel = byId<HTMLButtonElement>("mm-done-next-level");
  let doneSuggestAction = () => { /* Set by updateWorked */ };
  const picture = byId<HTMLElement>("mm-picture");
  const pictureText = byId<HTMLDivElement>("mm-picture-text");

  // ⋘──────── Settings ────────⋙
  const saved = loadJSON<Partial<Settings>>(SETTINGS_KEY) ?? {};
  const setSelect = (select: HTMLSelectElement, value: unknown) => {
    if (typeof value === "string" && [...select.options].some(o => o.value === value)) select.value = value;
  };
  setSelect(spacesSelect, saved.spaces);
  setSelect(basesSelect, saved.bases);
  setSelect(formSelect, saved.form);
  const savedLevel = levelButtons.find(b => Number(b.value) === saved.level);
  if (savedLevel) savedLevel.checked = true;
  const level = () => Number(levelButtons.find(b => b.checked)?.value ?? 3);

  // The practice path (stages from easy to hard) or the student's own choices; see
  // common/practice.ts, which also keeps the progress section.
  // Progress saved by the version of this page from before common/practice.ts moves to its keys.
  for (const [from, to] of [["history", "practice_log"], ["left_off", "practice_left_off"]]) {
    const old = loadJSON(`matrix_of_linear_map_${from}`);
    if (old !== null && loadJSON(`matrix_of_linear_map_${to}`) === null) saveJSON(`matrix_of_linear_map_${to}`, old);
  }
  const practice = setupPractice({
    key: "matrix_of_linear_map",
    stages: STAGES,
    cleanToAdvanceStage: CLEAN_TO_ADVANCE_STAGE,
    levels: {
      count: LEVELS.length,
      names: ["Full", "Partial", "Minimal", "None"],  // Shown as "Support" (see common/practice.ts)
      cleanToAdvance: CLEAN_TO_ADVANCE,
      current: () => level(),
      set: (lv: number) => {
        const button = levelButtons.find(b => Number(b.value) === lv);
        if (button) button.checked = true;
        saveSettings();
      },
    },
    box: byId<HTMLDivElement>("mm-practice"),
    customControls: [byId<HTMLDivElement>("mm-custom-controls")],
    progress: byId<HTMLElement>("mm-progress"),
    newProblem: () => newProblem(),
    helpText: "The practice path is a series of levels, from easy to hard. Each level adds one new idea, such as a nonstandard basis, a map on polynomials, or a target that is a plane in ℝ³, and gives a new random problem of that kind each time. After two problems at a level with no hints, the page suggests the next level. To pick the spaces, bases, and kind of map yourself, choose “Choose problems” instead.",
  });

  const settings = (): Settings => ({
    spaces: spacesSelect.value, bases: basesSelect.value, form: formSelect.value, level: level(),
    mode: practice.mode(), stage: practice.stage(),
  });
  const saveSettings = () => saveJSON(SETTINGS_KEY, settings());
  // The steps the student does at this level; the page works the others.
  const tasks = () => LEVELS[level() - 1].tasks;
  // At the last level, the student works the whole problem on paper, and enters only A (step 1(c)),
  // the answer to part 2 (step 2(b)), and part 3. Steps 1(a), 1(b), and 2(a) are hidden rather than
  // worked by the page.
  const byHand = () => level() === LEVELS.length;
  const hiddenByHand = (s: number) => byHand() && (s === 0 || s === 1 || s === 3);

  // ⋘──────── State ────────⋙
  let problem!: Problem;
  let sol!: Solution;
  let work!: Work;
  // The entry boxes of each step, in the order of Work.entries.
  let inputs: HTMLInputElement[][] = STEPS.map(() => []);
  const feedbacks: HTMLDivElement[] = [];
  const hintBoxes: HTMLDivElement[] = [];
  const workedBoxes: HTMLDivElement[] = [];
  const cards: HTMLElement[] = [];
  const lockNotes: HTMLParagraphElement[] = [];
  // In step 2(b): the answers it uses, A and [x]_𝒱, repeated so the student doesn't have to scroll.
  // In step 3(a), A is repeated the same way.
  const usesBoxes: (HTMLDivElement | undefined)[] = [];
  // For each step: notes on the student's last wrong answer (shown by Hint, not by Check), and the
  // notes the hint box is showing.
  let answerNotes: string[] = STEPS.map(() => "");
  let shownNotes: string[] = STEPS.map(() => "");

  // Each step's Check button (see updateButtons).
  const checkButtons: (HTMLButtonElement | undefined)[] = [];
  const isFilled = (s: number) => inputs[s].length > 0 && inputs[s].every(i => i.value.trim() !== "");
  // A step's buttons are enabled only while they can do something:
  //   Check: hidden once the answer is shown; disabled until every box is filled in, and once right.
  //   Hint:  disabled once the step is answered (right or shown), and when no hints are left.
  //   Show:  disabled once the step is answered.
  // Every button is disabled while the step is locked (waiting on an earlier step).
  function updateButtons(s: number): void {
    const card = cards[s];
    if (!card || !card.isConnected) return;
    const locked = card.classList.contains("mm-step-locked");
    const status = work.status[s];
    const answered = status !== "";
    const checkButton = checkButtons[s];
    if (checkButton) {
      checkButton.hidden = status === "shown";
      checkButton.disabled = locked || status === "right" || !isFilled(s);
      checkButton.title = locked ? "" : status === "right" ? "This step is right"
        : !isFilled(s) ? "Fill in every box to check your answer" : "";
    }
    const hintButton = card.querySelector<HTMLButtonElement>(".mm-hint-button");
    if (hintButton) {
      const noteWaiting = answerNotes[s] !== "" && shownNotes[s] !== answerNotes[s];
      const hintsLeft = work.hintLevel[s] < hintLevels(s).length;
      hintButton.disabled = locked || answered || (!noteWaiting && !hintsLeft);
      hintButton.title = locked ? "" : answered ? "This step is answered" : !noteWaiting && !hintsLeft ? "No more hints for this step" : "";
    }
    const showButton = card.querySelector<HTMLButtonElement>(".mm-show-button");
    if (showButton) {
      showButton.disabled = locked || answered;
      showButton.title = locked ? "" : answered ? "This step is answered" : "Fill in the answer (counts as a hint)";
    }
  }

  const V = () => SPACES[problem.spaces].V;
  const W = () => SPACES[problem.spaces].W;
  const n = () => V().dim;
  const m = () => W().dim;
  const vStd = () => isIdentity(problem.B);
  const wStd = () => !isSubspace(W()) && isIdentity(problem.C);
  // Names: 𝒱 and 𝒲 with vⱼ and wⱼ, or ℬ with bⱼ for one basis.
  const Vset = () => (problem.same ? "\\mathcal{B}" : "\\mathcal{V}");
  const Wset = () => (problem.same ? "\\mathcal{B}" : "\\mathcal{W}");
  // Colors (as in the vector span tool): each basis vector has its own color, used for its name,
  // its entries (or polynomial), its arrow in the picture, and the things that come from it:
  // [T(vⱼ)]_𝒲, and column j of A. A coordinate vector relative to a basis has each entry in the
  // color of the basis vector it multiplies. With one basis ℬ, both use the colors of 𝒱.
  const wColors = () => (problem.same ? V_COLORS : W_COLORS);
  const v = (j: number) => colorTex(V_COLORS[j], `\\mathbf{${problem.same ? "b" : "v"}}_{${j + 1}}`);
  const w = (j: number) => colorTex(wColors()[j], `\\mathbf{${problem.same ? "b" : "w"}}_{${j + 1}}`);
  const xName = () => (V().kind === "P" ? "p" : "\\mathbf{x}");
  const coordTex = (inner: string, set: string) => `\\left[${inner}\\right]_{${set}}`;
  const TvTex = (j: number) => `T(${v(j)})`;  // Only the basis vector is colored
  const elementTex = (space: Space, entries: Vec) => (space.kind === "P" ? polyTex(entries) : vecTex(entries));
  // An element of a space in a color (a column vector, or a polynomial in parentheses if needed).
  const coloredElement = (space: Space, entries: Vec, color: string) => colorTex(color, elementTex(space, entries));
  // A basis as a set of names, then of vectors: "{v₁, v₂} = {1, x}", so the names used in the
  // solution are defined.
  const basisTex = (space: Space, basis: Mat, colors: string[], name: (j: number) => string) => {
    const js = Array.from({ length: basis[0].length }, (_, j) => j);
    return `\\left\\{ ${js.map(name).join(",\\ ")} \\right\\} = \\left\\{ ${js.map(j => coloredElement(space, column(basis, j), colors[j])).join(",\\ ")} \\right\\}`;
  };
  // A coordinate vector, each entry in the color of its basis vector.
  const coordVecTex = (c: Vec, colors: string[]) => colTex(c.map((x, i) => colorTex(colors[i], tex(x))));
  // A matrix with column j in the color of vⱼ (the columns of A are the [T(vⱼ)]_𝒲).
  const colorColsTex = (a: Mat) =>
    `\\begin{bmatrix} ${a.map(row => row.map((x, j) => colorTex(V_COLORS[j], tex(x))).join(" & ")).join(" \\\\ ")} \\end{bmatrix}`;
  // Coordinates and their basis vectors share colors: in a combination like 1 · v₁ − 2 · v₂ (written
  // as in the lecture notes, with every coefficient shown), each coefficient is in its vector's
  // color, and so are the unknowns c₁, c₂, … that stand for coordinates.
  const coordCombo = (cs: Vec, name: (i: number) => string, colors: string[]) => cs.map((c, i) => {
    const negative = c.num < 0n;
    const magnitude = colorTex(colors[i], tex(negative ? neg(c) : c));
    return `${i === 0 ? (negative ? "-" : "") : negative ? " - " : " + "}${magnitude} \\cdot ${name(i)}`;
  }).join("");
  const cName = (i: number, colors: string[]) => colorTex(colors[i], `c_{${i + 1}}`);
  const cList = (k: number, colors: string[]) => Array.from({ length: k }, (_, i) => cName(i, colors)).join(", ");
  const cSum = (k: number, name: (i: number) => string, colors: string[]) =>
    Array.from({ length: k }, (_, i) => `${cName(i, colors)}${name(i)}`).join(" + ");
  const xCombo = () => coordCombo(problem.x, v, V_COLORS);
  const xTex = () => elementTex(V(), sol.xVec);  // The vector x itself
  const vj = () => `\\mathbf{${problem.same ? "b" : "v"}}_j`;  // A generic basis vector, uncolored
  const TvjTex = () => `T(${vj()})`;
  // Whether a step's answer is known: the page works it, or the student got it right or shown.
  const isDone = (s: number) => !tasks()[s] || work.status[s] !== "";
  // Part 3: the rank and nullity of A, and whether T is onto and one-to-one (LTC5 and LTC6).
  const rankA = () => rank(sol.A);
  const nullA = () => n() - rankA();
  const isOnto = () => rankA() === m();
  const isOneToOne = () => nullA() === 0;
  const dimTex = (space: Space) => `\\dim ${spaceTex(space)}`;
  const yesNo = (b: boolean) => (b ? "yes" : "no");

  // ⋘──────── Saving the work ────────⋙
  const saveWork = () => {
    work.entries = inputs.map(list => list.map(i => i.value));
    const works = loadJSON<Record<string, Work>>(WORKS_KEY) ?? {};
    delete works[work.problem];  // So the newest is last, and the oldest are dropped first
    works[work.problem] = work;
    const codes = Object.keys(works);
    for (const old of codes.slice(0, Math.max(0, codes.length - MAX_SAVED_WORKS))) delete works[old];
    saveJSON(WORKS_KEY, works);
  };

  // ⋘──────── The problem statement ────────⋙

  function mapTex(): string {
    const { V: sv } = SPACES[problem.spaces];
    if (problem.form === "named") return `${NAMED[problem.named].text}.`;
    if (problem.form === "matrix") {
      return `defined by ${$$(`T(\\mathbf{x}) = ${matTex(problem.M)}\\mathbf{x}.`)}`;
    }
    if (problem.form === "basis") return `the linear map such that ${$$(actionTex())}${actionWhere()}`;
    return `defined by ${$$(`${formulaTex(sv)}.`)}`;
  }

  // The standard basis vectors of V: e₁, e₂, … for column vectors, or 1, x, x², … for polynomials.
  const stdName = (k: number) => (V().kind === "P" ? (POWERS[k] || "1") : `\\mathbf{e}_{${k + 1}}`);

  // What T does to the standard basis of V, one line each: T(e₁) = …, or T(1) = ….
  // When 𝒱 (or ℬ) is the standard basis, each input is in the color of its basis vector, as in the bases.
  function actionTex(): string {
    const sv = V(), sw = W();
    const input = (k: number) => (vStd() ? colorTex(V_COLORS[k], stdName(k)) : stdName(k));
    const lines = Array.from({ length: sv.ambient }, (_, k) =>
      `T(${input(k)}) &= ${elementTex(sw, column(problem.M, k))}`);
    return `\\begin{aligned} ${lines.join(", \\\\ ")}. \\end{aligned}`;
  }
  const actionWhere = () => (V().kind === "R"
    ? ` Here, ${$(Array.from({ length: V().ambient }, (_, k) => stdName(k)).join(", "))} are the standard basis vectors of ${$(spaceTex(V()))}.`
    : "");

  // T written as a formula: T([x₁; x₂]) = [2x₁ + x₂; …], or T(a₀ + a₁x + a₂x²) = (a₁ + 2a₂) + ….
  function formulaTex(sv: Space): string {
    const Mm = problem.M;
    if (sv.kind === "R") {
      const vars = Array.from({ length: sv.ambient }, (_, k) => `x_{${k + 1}}`);
      const rows = Mm.map(row => combo(row.map((c, k) => ({ c, v: vars[k] }))));
      return `T\\left(${colTex(vars)}\\right) = ${colTex(rows)}`;
    }
    const arg = combo(Array.from({ length: sv.ambient }, (_, k) => ({ c: F(1), v: `a_{${k}}${POWERS[k] ? " " + POWERS[k] : ""}` })));
    let out = "";
    Mm.forEach((row, i) => {
      const terms = row.map((c, k) => ({ c, v: `a_{${k}}` })).filter(t => !isZero(t.c));
      if (terms.length === 0) return;
      let chunk: string;
      if (i === 0) chunk = combo(terms);
      else if (terms.length === 1) chunk = combo([{ c: terms[0].c, v: `${terms[0].v} ${POWERS[i]}` }]);
      else chunk = `(${combo(terms)})${POWERS[i]}`;
      if (out === "") out = chunk;
      else out += chunk.startsWith("-") ? ` - ${chunk.slice(1)}` : ` + ${chunk}`;
    });
    return `T(${arg}) = ${out === "" ? "0" : out}`;
  }

  // The two parts of the problem, (a) and (b), as worded in the statement and above their steps.
  function partQuestion(part: number): string {
    const relative = problem.same ? "\\(\\mathcal{B}\\)" : "\\(\\mathcal{V}\\) and \\(\\mathcal{W}\\)";
    if (part === 2) return "Use the rank and nullity of \\(A\\) to determine whether \\(T\\) is onto and whether \\(T\\) is one-to-one";
    return part === 0
      ? `Find the matrix \\(A\\) of \\(T\\) relative to ${relative}`
      : `Use \\(A\\) to find ${$(coordTex(`T(${xName()})`, Wset()))}`;
  }

  function renderStatement(): void {
    const sv = V(), sw = W();
    const parts: string[] = [];
    if (isSubspace(sw)) {
      const kind = sw.dim === 2 ? "plane" : "line";
      parts.push(`<p>Let \\(W\\) be the ${kind} in \\(\\mathbb{R}^{${sw.ambient}}\\) with basis ${$$(`\\mathcal{W} := ${basisTex(sw, problem.C, wColors(), w)}.`)}</p>`);
    }
    const mapPart = `<p>Let ${$(`T : ${spaceTex(sv)} \\to ${spaceTex(sw)}`)} be ${mapTex()}</p>`;
    // A map given by its values on basis vectors comes after the bases, so the reader has the bases first.
    const basesFirst = problem.form === "basis";
    if (!basesFirst) parts.push(mapPart);
    const std = (space: Space) => (space.kind === "P" ? "the standard basis of monomials" : "the standard basis");
    const note = (isStd: boolean, space: Space) => (isStd ? `\\quad \\text{(${std(space)})}` : "");
    if (problem.same || isSubspace(sw)) {
      const name = problem.same ? "\\mathcal{B}" : "\\mathcal{V}";
      parts.push(`<p>Consider the basis ${$$(`${name} := ${basisTex(sv, problem.B, V_COLORS, v)} \\text{ of } ${spaceTex(sv)}${note(vStd(), sv)}.`)}</p>`);
    } else {
      parts.push(`<p>Consider the bases ${$$(`\\begin{aligned}
        \\mathcal{V} &:= ${basisTex(sv, problem.B, V_COLORS, v)} \\text{ of } ${spaceTex(sv)}${note(vStd(), sv)}, \\\\
        \\mathcal{W} &:= ${basisTex(sw, problem.C, wColors(), w)} \\text{ of } ${spaceTex(sw)}${note(wStd(), sw)}.
        \\end{aligned}`)}</p>`);
    }
    if (basesFirst) parts.push(mapPart);
    // The questions: (a) find A, (b) use it, and (c) decide whether T is onto and one-to-one.
    const questions = [`${partQuestion(0)}.`, `${partQuestion(1)} for ${$$(`${xName()} := ${xTex()}.`)}`, `${partQuestion(2)}.`];
    parts.push(`<ol class="mm-parts">${questions.map(q => `<li>${q}</li>`).join("")}</ol>`);
    statement.innerHTML = parts.join("");
  }

  // ⋘──────── The picture (ℝ² → ℝ² only) ────────⋙

  // Beside the picture: how the steps look in it. Each step's numbers appear once the step is done
  // (or, by hand, once part 1 is), so the picture doesn't give answers away.
  function renderPictureText(): void {
    const Wn = Wset(), Vn = Vset();
    const wName = problem.same ? "basis vectors" : `basis vectors of ${$(Wn)}`;
    const revealA = byHand() ? work.status[2] !== "" : isDone(1);
    const revealT = byHand() ? work.status[2] !== "" : isDone(0);
    const parts: string[] = [];
    parts.push(`<p>The gray lines form the <strong>grid of ${$(Wn)}</strong>: they meet at the points ${$(cSum(2, w, wColors()))} for whole numbers ${$(cName(0, wColors()))} and ${$(cName(1, wColors()))}.
      To find the coordinates of a vector relative to ${$(Wn)}, count how many steps along ${$(w(0))} and along ${$(w(1))} it takes to reach its tip.
      Each line of the grid is parallel to one of the ${wName}.</p>`);
    parts.push(`<p><strong>1(a). Apply \\(T\\).</strong> The solid arrows ${$(`${v(0)}, ${v(1)}`)} are the basis ${$(Vn)}.
      ${revealT ? `The dashed arrows are their images ${$(`${TvTex(0)}, ${TvTex(1)}`)}.` : "Their images under \\(T\\) appear as dashed arrows once you find them."}</p>`);
    const coordLine = (j: number) => `${$(`${TvTex(j)} = ${coordCombo(sol.coords[j], w, wColors())}`)}, so ${$(`${coordTex(TvTex(j), Wn)} = ${coordVecTex(sol.coords[j], wColors())}`)}`;
    parts.push(`<p><strong>1(b). Find coordinates.</strong> Count the grid steps from the origin to the tip of each ${$(TvjTex())}.
      ${revealA ? `${coordLine(0)}; and ${coordLine(1)}.` : ""}</p>`);
    parts.push(`<p><strong>1(c). Assemble \\(A\\).</strong> These coordinate vectors are the columns of \\(A\\)${revealA ? `: ${$$(`A = ${colorColsTex(sol.A)}.`)}` : "."}</p>`);
    const html = parts.join("");
    if (pictureText.dataset.html !== html) {
      pictureText.dataset.html = html;
      pictureText.innerHTML = html;
      void typeset([pictureText]);
    }
  }

  const SUB = ["₁", "₂", "₃"];

  function renderFigure(): void {
    picture.hidden = problem.spaces !== "r2r2";
    if (picture.hidden) return;
    renderPictureText();
    const num = (x: Fraction) => Number(x.num) / Number(x.den);
    const pt = (vec: Vec): [number, number] => [num(vec[0]), num(vec[1])];
    // By hand, the images would give away step 1(a), so they wait until part 1 is finished.
    const showImages = byHand() ? work.status[2] !== "" : isDone(0);
    const vName = problem.same ? "b" : "v", wName = problem.same ? "b" : "w";
    interface Arrow { p: [number, number]; color: string; label: string; dashed: boolean }
    const arrows: Arrow[] = [];
    for (let j = 0; j < 2; j++) arrows.push({ p: pt(column(problem.B, j)), color: V_COLORS[j], label: `${vName}${SUB[j]}`, dashed: false });
    if (!problem.same) {
      for (let j = 0; j < 2; j++) arrows.push({ p: pt(column(problem.C, j)), color: wColors()[j], label: `${wName}${SUB[j]}`, dashed: false });
    }
    if (showImages) {
      for (let j = 0; j < 2; j++) arrows.push({ p: pt(sol.TV[j]), color: V_COLORS[j], label: `T(${vName}${SUB[j]})`, dashed: true });
    }
    const reach = Math.max(2, ...arrows.flatMap(a => a.p.map(Math.abs)));
    const R = Math.ceil(reach + 0.8);
    const size = 300, scale = size / (2 * R);
    const X = (x: number) => (x + R) * scale, Y = (y: number) => (R - y) * scale;
    const svg: string[] = [];
    svg.push(`<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="The basis vectors${showImages ? " and their images under T" : ""}, on the grid of the target basis">`);
    svg.push(`<defs><clipPath id="mm-clip"><rect x="0" y="0" width="${size}" height="${size}"/></clipPath>`);
    for (const color of [...V_COLORS, ...W_COLORS]) {
      svg.push(`<marker id="mm-head-${color.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${color}"/></marker>`);
    }
    svg.push(`</defs><g clip-path="url(#mm-clip)">`);
    // The grid of the target basis: lines through the integer combinations of w₁ and w₂, along
    // which coordinates relative to 𝒲 can be counted.
    const w1 = pt(column(problem.C, 0)), w2 = pt(column(problem.C, 1));
    const corners = [[-R, -R], [R, -R], [R, R], [-R, R]].map(([a, b]) => solve(problem.C, [F(a), F(b)])!.map(num));
    const lo = (k: number) => Math.floor(Math.min(...corners.map(c => c[k]))) - 1;
    const hi = (k: number) => Math.ceil(Math.max(...corners.map(c => c[k]))) + 1;
    const line = (from: [number, number], dir: [number, number], style: string) => {
      const L = 4 * R;
      svg.push(`<line x1="${X(from[0] - L * dir[0])}" y1="${Y(from[1] - L * dir[1])}" x2="${X(from[0] + L * dir[0])}" y2="${Y(from[1] + L * dir[1])}" ${style}/>`);
    };
    const gridStyle = `stroke="#c9ced6" stroke-width="1"`;
    for (let t = lo(1); t <= hi(1); t++) line([t * w2[0], t * w2[1]], w1, gridStyle);
    for (let s = lo(0); s <= hi(0); s++) line([s * w1[0], s * w1[1]], w2, gridStyle);
    // The axes.
    svg.push(`<line x1="0" y1="${Y(0)}" x2="${size}" y2="${Y(0)}" stroke="#5f6368" stroke-width="1.2"/>`);
    svg.push(`<line x1="${X(0)}" y1="0" x2="${X(0)}" y2="${size}" stroke="#5f6368" stroke-width="1.2"/>`);
    for (const a of arrows) {
      svg.push(`<line x1="${X(0)}" y1="${Y(0)}" x2="${X(a.p[0])}" y2="${Y(a.p[1])}" stroke="${a.color}" stroke-width="2.6"${a.dashed ? ` stroke-dasharray="6 4"` : ""} marker-end="url(#mm-head-${a.color.slice(1)})"/>`);
    }
    svg.push(`</g>`);
    // Labels: arrows with the same tip share one label, like "w₁ = T(v₂)".
    const groups = new Map<string, Arrow[]>();
    for (const a of arrows) {
      const key = a.p.join(",");
      groups.set(key, [...(groups.get(key) ?? []), a]);
    }
    for (const group of groups.values()) {
      const [x, y] = group[0].p;
      if (x === 0 && y === 0) {
        // A zero vector has no arrow: a dot at the origin, labeled in the diagonal direction farthest
        // from every arrow, so the label doesn't cover one.
        svg.push(`<circle cx="${X(0)}" cy="${Y(0)}" r="5" fill="${group[0].color}" stroke="#fff" stroke-width="1.5"/>`);
        const angles = arrows.filter(a => a.p[0] !== 0 || a.p[1] !== 0).map(a => Math.atan2(a.p[1], a.p[0]));
        const gap = (t: number) => Math.min(Math.PI, ...angles.map(u => Math.abs(Math.atan2(Math.sin(t - u), Math.cos(t - u)))));
        const [dx, dy] = [[1, -1], [-1, -1], [-1, 1], [1, 1]]
          .reduce((best, d) => (gap(Math.atan2(d[1], d[0])) > gap(Math.atan2(best[1], best[0])) + 1e-6 ? d : best));  // Ties: the first (lower right)
        const lx = X(0) + dx * 10;
        const top = Y(0) - dy * 14 - (dy > 0 ? (group.length - 1) * 16 : 0) + (dy < 0 ? 6 : 0);
        const lines = group.map((a, i) => `<tspan x="${lx}" dy="${i === 0 ? "0.35em" : "1.15em"}" fill="${a.color}">${a.label} = 0</tspan>`).join("");
        svg.push(`<text y="${top}" text-anchor="${dx > 0 ? "start" : "end"}" font-size="14" font-weight="bold" paint-order="stroke" stroke="#fff" stroke-width="3">${lines}</text>`);
        continue;
      }
      // Beside the tip, one name per line (all equal), kept inside the picture.
      const len = Math.hypot(x, y);
      let lx = X(x + (0.45 * x) / len);
      const ly = Y(y + (0.45 * y) / len) - ((group.length - 1) * 16) / 2;
      let anchor = Math.abs(x) / len < 0.3 ? "middle" : x > 0 ? "start" : "end";
      const width = Math.max(...group.map(a => a.label.length)) * 8 + 16;
      if (anchor === "start" && lx + width > size) { anchor = "end"; lx = size - 4; }
      if (anchor === "end" && lx - width < 0) { anchor = "start"; lx = 4; }
      if (anchor === "middle") lx = Math.min(size - width / 2, Math.max(width / 2, lx));
      const lines = group.map((a, i) => `<tspan x="${lx}" dy="${i === 0 ? "0.35em" : "1.15em"}" fill="${a.color}">${(i < group.length - 1 ? a.label + " =" : a.label)}</tspan>`).join("");
      svg.push(`<text y="${Math.max(14, Math.min(size - 6 - (group.length - 1) * 16, ly))}" text-anchor="${anchor}" font-size="14" font-weight="bold" paint-order="stroke" stroke="#fff" stroke-width="3">${lines}</text>`);
    }
    svg.push(`</svg>`);
    figureSvg.innerHTML = svg.join("");
    const gridName = problem.same ? "ℬ" : "𝒲";
    figureNote.textContent = `Gray lines: the grid of ${gridName}.`
      + (showImages ? " Dashed: the images under T." : byHand() ? " The images under T appear after part 1." : " The images under T appear after step 1(a).");
  }

  // ⋘──────── Steps ────────⋙

  const STEP_TITLES = () => [
    `Apply \\(T\\) to each basis vector in \\(${Vset()}\\)`,
    `Find the coordinates of each \\(T(${vj()})\\) relative to \\(${Wset()}\\)`,
    "Place the coordinate vectors into the columns of \\(A\\)",
    `Find the coordinate vector of \\(${xName()}\\) relative to \\(${Vset()}\\)`,
    `Use \\(A\\) and \\(${coordTex(xName(), Vset())}\\) to find the coordinate vector of \\(T(${xName()})\\) relative to \\(${Wset()}\\)`,
    "Find the rank and the nullity of \\(A\\)",
    "Determine whether \\(T\\) is onto and whether \\(T\\) is one-to-one",
  ];

  function entryInput(label: string, step: number): HTMLInputElement {
    const input = element("input", "mm-entry");
    input.type = "text";
    input.inputMode = "decimal";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("aria-label", label);
    input.addEventListener("input", () => {
      input.classList.remove("mm-right", "mm-wrong", "mm-shown");
      answerNotes[step] = "";  // About the answer before this change
      updateButtons(step);
      saveWork();
    });
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); if (isFilled(step)) check(step); }
    });
    inputs[step].push(input);
    return input;
  }

  // An entry box with a colored left edge (see the colors at `v` and `w`).
  const tinted = (input: HTMLInputElement, color: string) => {
    input.classList.add("mm-tinted");
    input.style.setProperty("--mm-color", color);
    return input;
  };

  // A column of entry boxes in brackets; `color` gives each entry's color.
  function columnEntry(count: number, step: number, label: (i: number) => string, color?: (i: number) => string): HTMLElement {
    const box = element("span", "mm-bracket");
    for (let i = 0; i < count; i++) {
      const input = entryInput(label(i), step);
      box.append(color ? tinted(input, color(i)) : input);
    }
    return box;
  }

  // A polynomial's coefficients, [ ] + [ ]x + [ ]x² (uncolored: these are the images T(vⱼ)).
  function polyEntry(count: number, step: number, label: (i: number) => string): HTMLElement {
    const box = element("span", "mm-poly");
    for (let i = 0; i < count; i++) {
      if (i > 0) box.append(element("span", "", "+"));
      box.append(entryInput(label(i), step));
      if (POWERS[i]) box.append(element("span", "", $(POWERS[i])));
    }
    return box;
  }

  function group(labelTex: string, body: HTMLElement): HTMLElement {
    const g = element("span", "mm-entry-group");
    g.append(element("span", "mm-entry-label", $(labelTex)), body);
    return g;
  }

  // A Yes/No question: a split pill of two radio buttons (one group per question, so each question
  // keeps its own answer) that set a hidden entry box to "yes" or "no". The box keeps the answer
  // (and is marked right, wrong, or shown), so checking and saving work as for numbers.
  const yesNoSyncs: (() => void)[] = [];
  function yesNoEntry(label: string): HTMLElement {
    const box = element("span", "mm-yes-no");
    box.setAttribute("role", "radiogroup");
    box.setAttribute("aria-label", label);
    const input = entryInput(label, YES_NO_STEP);
    input.type = "hidden";
    const name = `mm-yn-${yesNoSyncs.length}`;
    const radios = (["yes", "no"] as const).map(value => {
      const option = element("label", "mm-yn-option");
      const radio = element("input");
      radio.type = "radio";
      radio.name = name;
      radio.value = value;
      radio.addEventListener("change", () => {
        if (!radio.checked) return;
        input.value = value;
        input.dispatchEvent(new Event("input"));
        sync();
      });
      option.append(radio, element("span", "", value === "yes" ? "Yes" : "No"));
      box.append(option);
      return radio;
    });
    const sync = () => radios.forEach(r => {
      r.checked = input.value === r.value;
      r.disabled = input.disabled;
    });
    yesNoSyncs.push(sync);
    box.prepend(input);
    return box;
  }
  const syncYesNo = () => yesNoSyncs.forEach(f => f());
  // A step's entry as a number: step 3(b)'s "yes" and "no" are 1 and 0.
  const parseFor = (s: number, text: string): Fraction | null => {
    if (s !== YES_NO_STEP) return parseEntry(text);
    const t = text.trim().toLowerCase();
    return t === "yes" ? F(1) : t === "no" ? F(0) : null;
  };
  const formatFor = (s: number, x: Fraction) => (s === YES_NO_STEP ? yesNo(!isZero(x)) : formatFraction(x).replace("−", "-"));

  function buildEntries(step: number): HTMLElement {
    const box = element("div", "mm-entries");
    const sw = W();
    if (step === 0) {
      for (let j = 0; j < n(); j++) {
        const label = (i: number) => (sw.kind === "P" ? `T(v${j + 1}), coefficient of ${POWERS[i] || "1"}` : `T(v${j + 1}), entry ${i + 1}`);
        box.append(group(`${TvTex(j)} =`, sw.kind === "P"
          ? polyEntry(sw.ambient, 0, label)
          : columnEntry(sw.ambient, 0, label)));
      }
    } else if (step === 1) {
      // Each coordinate in the color of the basis vector of 𝒲 it multiplies.
      for (let j = 0; j < n(); j++) {
        box.append(group(`${coordTex(TvTex(j), Wset())} =`, columnEntry(m(), 1, i => `Coordinate ${i + 1} of T(v${j + 1})`, i => wColors()[i])));
      }
    } else if (step === 2) {
      // Column j in the color of vⱼ.
      const grid = element("span", "mm-bracket");
      grid.style.gridTemplateColumns = `repeat(${n()}, auto)`;
      for (let i = 0; i < m(); i++) for (let j = 0; j < n(); j++) grid.append(tinted(entryInput(`A, row ${i + 1}, column ${j + 1}`, 2), V_COLORS[j]));
      box.append(group("A =", grid));
    } else if (step === 3) {
      box.append(group(`${coordTex(xName(), Vset())} =`, columnEntry(n(), 3, i => `Coordinate ${i + 1} of x`, i => V_COLORS[i])));
    } else if (step === 4) {
      box.append(group(`${coordTex(`T(${xName()})`, Wset())} =`, columnEntry(m(), 4, i => `Coordinate ${i + 1} of T(x)`, i => wColors()[i])));
    } else if (step === 5) {
      box.append(group("\\operatorname{rank} A =", entryInput("Rank of A", 5)));
      box.append(group("\\operatorname{null} A =", entryInput("Nullity of A", 5)));
    } else {
      // One question per line, so a question and its Yes/No pill stay together.
      box.classList.add("mm-yes-no-list");
      for (const [question, label] of [["Is \\(T\\) onto?", "Is T onto?"], ["Is \\(T\\) one-to-one?", "Is T one-to-one?"]]) {
        const row = element("div", "mm-yes-no-row");
        row.append(element("span", "mm-entry-label", question), yesNoEntry(label));
        box.append(row);
      }
    }
    return box;
  }

  // The answers of each step, in the order of the entry boxes.
  const answers = (step: number): Fraction[] => {
    switch (step) {
      case 0: return sol.TV.flat();
      case 1: return sol.coords.flat();
      case 2: return sol.A.flat();
      case 3: return problem.x;
      case 4: return sol.Tx;
      case 5: return [F(rankA()), F(nullA())];
      default: return [F(isOnto() ? 1 : 0), F(isOneToOne() ? 1 : 0)];
    }
  };

  function renderSteps(): void {
    stepsBox.innerHTML = "";
    inputs = STEPS.map(() => []);
    yesNoSyncs.length = 0;
    const titles = STEP_TITLES();
    const doing = tasks();
    for (const s of STEPS) {
      // Each part's heading comes before its first step. By hand, the cards for A and [T(x)]_𝒲 are
      // themselves parts 1 and 2.
      if ((!byHand() && (s === 0 || s === 3)) || s === 5) {
        const part = STEP_PART[s];
        stepsBox.append(element("h3", "mm-part-heading", `${part + 1}. ${partQuestion(part)}`));
      }
      const card = element("section", "mm-step");
      cards[s] = card;
      // By hand, only the answers are entered: A for part 1, [T(x)]_𝒲 for part 2, and part 3.
      card.hidden = hiddenByHand(s);
      const given = !doing[s];
      card.classList.toggle("mm-step-given", given);
      const title = !byHand() || s >= 5 ? `${STEP_LABELS[s]} ${titles[s]}`
        : s === 2 ? `1. The matrix \\(A\\) of \\(T\\) relative to \\(${problem.same ? Vset() : `${Vset()}\\) and \\(${Wset()}`}\\)`
        : `2. ${titles[4]}`;
      card.append(element("h3", "", `${title}${given ? `<span class="mm-given-tag">(worked by the page)</span>` : ""}`));
      lockNotes[s] = element("p", "mm-lock-note");
      lockNotes[s].hidden = true;
      card.append(lockNotes[s]);
      if (s === 4 || s === 5) {
        usesBoxes[s] = element("div", "mm-uses");
        card.append(usesBoxes[s]!);
      }
      if (!given) {
        card.append(buildEntries(s));
        const actions = element("div", "mm-step-actions");
        const checkButton = element("button", "mm-primary", "Check");
        checkButton.type = "button";
        checkButton.addEventListener("click", () => check(s));
        checkButtons[s] = checkButton;
        const hintButton = element("button", "mm-hint-button", "Hint");
        hintButton.type = "button";
        hintButton.addEventListener("click", () => hint(s));
        const showButton = element("button", "mm-show-button", "Show");
        showButton.type = "button";
        showButton.title = "Fill in the answer (counts as a hint)";
        showButton.addEventListener("click", () => show(s));
        actions.append(checkButton, hintButton, showButton);
        card.append(actions);
      }
      hintBoxes[s] = element("div", "mm-hint-box");
      hintBoxes[s].hidden = true;
      feedbacks[s] = element("div", "mm-feedback");
      feedbacks[s].setAttribute("role", "status");
      workedBoxes[s] = element("div", "mm-worked");
      card.append(hintBoxes[s], feedbacks[s], workedBoxes[s]);
      stepsBox.append(card);
    }
    // Restore saved entries.
    inputs.forEach((list, s) => list.forEach((input, i) => { input.value = work.entries[s]?.[i] ?? ""; }));
    for (const s of STEPS) {
      if (work.status[s] === "shown") markAll(s, "mm-shown");
      if (work.status[s] === "right") markAll(s, "mm-right");
      if (work.hintLevel[s] > 0) renderHint(s);
    }
    updateWorked();
    syncYesNo();
  }

  const markAll = (s: number, cls: string) => inputs[s].forEach(i => i.classList.add(cls));

  // ⋘──────── Worked answers ────────⋙

  // One output entry (or coefficient) of T, with numbers substituted for the inputs:
  // "2(1) - (3)" for the row 2x₁ − x₂ and inputs (1, 3), each input in `color`.
  function substitutedRow(row: Fraction[], inputs: Vec, color: string): string {
    let out = "";
    row.forEach((c, k) => {
      if (isZero(c)) return;
      const negative = c.num < 0n, a = negative ? neg(c) : c;
      const term = `${isOne(a) ? "" : tex(a)}(${colorTex(color, tex(inputs[k]))})`;
      out += out === "" ? (negative ? "-" : "") + term : (negative ? " - " : " + ") + term;
    });
    return out || "0";
  }

  // The calculation of T(vⱼ), as on paper: T(vⱼ) = T(its value) = (the definition of T with
  // vⱼ's entries or coefficients plugged in) = the result. For a map given on the standard basis,
  // the middle steps write vⱼ as a combination of the standard basis and use linearity.
  function applyChain(j: number): string[] {
    const sv = V(), sw = W(), color = V_COLORS[j];
    const b = column(problem.B, j), y = sol.TV[j];
    const value = `T\\left(${coloredElement(sv, b, color)}\\right)`;
    let middle: string[];
    if (problem.form === "basis") {
      const coefs = (name: (k: number) => string) => coordCombo(b, name, b.map(() => color));
      const image = (k: number) => (sw.kind === "P" ? `(${elementTex(sw, column(problem.M, k))})` : elementTex(sw, column(problem.M, k)));
      middle = [
        `T\\left(${coefs(stdName)}\\right)`,
        coefs(k => `T(${stdName(k)})`),
        coefs(image),
      ];
    } else if (problem.form === "matrix") {
      middle = [`${matTex(problem.M)}${coloredElement(sv, b, color)}`];
    } else if (sw.kind === "R") {
      middle = [colTex(problem.M.map(row => substitutedRow(row, b, color)))];
    } else {
      // Polynomials: each coefficient of the result, with the coefficients aₖ of vⱼ plugged in.
      let sum = "";
      problem.M.forEach((row, i) => {
        if (row.every(isZero)) return;
        const piece = `(${substitutedRow(row, b, color)})${POWERS[i] ? " " + POWERS[i] : ""}`;
        sum += sum === "" ? piece : ` + ${piece}`;
      });
      middle = [sum || "0"];
    }
    return [TvTex(j), value, ...middle, elementTex(sw, y)];
  }

  // The chain as a display, broken into lines of at most two "=" each so it fits.
  function chainDisplay(parts: string[], tail = ""): string {
    const [lhs, ...rest] = parts;
    const lines: string[] = [];
    for (let i = 0; i < rest.length; i += 2) lines.push(`&= ${rest.slice(i, i + 2).join(" = ")}`);
    lines[lines.length - 1] += tail;
    return $$(`\\begin{aligned} ${lhs} ${lines.join(" \\\\ ")} \\end{aligned}`);
  }

  function workedHtml(s: number): string {
    switch (s) {
      case 0:
        return sol.TV.map((_, j) => chainDisplay(applyChain(j), ".")).join("");
      case 1:
        // The calculation of T(vⱼ) again, then T(vⱼ) as a combination of the basis vectors of 𝒲.
        return sol.coords.map((c, j) =>
          chainDisplay([...applyChain(j), coordCombo(c, w, wColors())], ",")
          + `<p>so ${$(`${coordTex(TvTex(j), Wset())} = ${coordVecTex(c, wColors())}`)}.</p>`).join("");
      case 2: {
        const cols = Array.from({ length: n() }, (_, j) => coordTex(TvTex(j), Wset())).join(" & ");
        const assemble = $$(`A = \\begin{bmatrix} ${cols} \\end{bmatrix} = ${colorColsTex(sol.A)}`);
        if (!byHand()) return assemble;
        // By hand, the whole solution, step by step.
        const titles = STEP_TITLES();
        return `<p><strong>1(a). ${titles[0]}.</strong></p>${workedHtml(0)}`
          + `<p><strong>1(b). ${titles[1]}.</strong></p>${workedHtml(1)}`
          + `<p><strong>1(c). ${titles[2]}.</strong></p>${assemble}`;
      }
      case 3:
        return `<p>${$(`${xName()} = ${xTex()} = ${xCombo()}`)}, so ${$(`${coordTex(xName(), Vset())} = ${coordVecTex(problem.x, V_COLORS)}`)}.</p>`;
      case 5: {
        const { r, pivots } = rref(sol.A);
        const pivotWord = pivots.length === 1 ? "pivot" : "pivots";
        const rrefText = isIdentity(sol.A) || matEq(r, sol.A) ? `\\(A\\) is in reduced row echelon form` : `Row reducing \\(A\\) gives ${$$(`A \\sim ${matTex(r)}.`)} The reduced row echelon form`;
        return `<p>${rrefText} has ${pivots.length} ${pivotWord}, so ${$(`\\operatorname{rank} A = ${rankA()}`)}.
          Since \\(A\\) has ${n()} column${n() === 1 ? "" : "s"}, ${$(`\\operatorname{null} A = ${n()} - ${rankA()} = ${nullA()}`)}.</p>`;
      }
      case 6: {
        // As in lecture: the definition, the theorem that turns it into a question about A, the
        // numbers, and, when the answer is no, an example that shows why.
        const sv = V(), sw = W();
        const rk = rankA(), nl = nullA();
        const parts: string[] = [];
        // Onto.
        parts.push(`<p><strong>Onto.</strong> \\(T\\) is onto if every vector in ${$(spaceTex(sw))} is ${$(`T(${xName()})`)} for some ${$(xName())} in ${$(spaceTex(sv))}, that is, if ${$(`\\operatorname{range} T = ${spaceTex(sw)}`)}.
          Since ${$(`\\dim(\\operatorname{range} T) = \\operatorname{rank} A`)}, \\(T\\) is onto exactly when ${$(`\\operatorname{rank} A = ${dimTex(sw)}`)}.</p>`);
        if (isOnto()) {
          parts.push(`<p>Here, ${$(`\\operatorname{rank} A = ${rk} = ${dimTex(sw)}`)}, so \\(T\\) is <strong>onto</strong>: its range is all of ${$(spaceTex(sw))}.</p>`);
        } else {
          // A basis vector of 𝒲 outside the range: its coordinates eᵢ aren't a combination of the columns of A.
          const e = (i: number) => Array.from({ length: m() }, (_, k) => F(k === i ? 1 : 0));
          const missing = Array.from({ length: m() }, (_, i) => i).find(i => rank(sol.A.map((row, k) => [...row, e(i)[k]])) > rk);
          const example = missing === undefined ? ""
            : ` For example, ${$(w(missing))} isn't ${$(`T(${xName()})`)} for any ${$(xName())}: its coordinates ${$(`${coordTex(w(missing), Wset())} = ${vecTex(e(missing))}`)} aren't a combination of the columns of \\(A\\), so ${$(`A${coordTex(xName(), Vset())} = ${vecTex(e(missing))}`)} has no solution.`;
          const why = n() < m() ? ` (In fact, \\(A\\) has only ${n()} column${n() === 1 ? "" : "s"}, so its rank is at most ${n()}, and no linear map from ${$(spaceTex(sv))} to ${$(spaceTex(sw))} is onto.)` : "";
          parts.push(`<p>Here, ${$(`\\operatorname{rank} A = ${rk} < ${m()} = ${dimTex(sw)}`)}, so \\(T\\) is <strong>not onto</strong>: its range is only ${rk === 0 ? $("\\{\\mathbf{0}\\}") : `${rk}-dimensional`}.${example}${why}</p>`);
        }
        // One-to-one.
        parts.push(`<p><strong>One-to-one.</strong> \\(T\\) is one-to-one if different vectors in ${$(spaceTex(sv))} have different images. For a linear map, that happens exactly when only ${$("\\mathbf{0}")} maps to ${$("\\mathbf{0}")}, that is, when ${$("\\ker T = \\{\\mathbf{0}\\}")}.
          Since ${$("\\dim(\\ker T) = \\operatorname{null} A")}, \\(T\\) is one-to-one exactly when ${$("\\operatorname{null} A = 0")}.</p>`);
        if (isOneToOne()) {
          parts.push(`<p>Here, ${$("\\operatorname{null} A = 0")}: every column of the reduced row echelon form of \\(A\\) has a pivot, so ${$(`A${coordTex(xName(), Vset())} = \\mathbf{0}`)} only when ${$(`${coordTex(xName(), Vset())} = \\mathbf{0}`)}. So \\(T\\) is <strong>one-to-one</strong>.</p>`);
        } else {
          // A nonzero vector in the kernel: the first free variable is 1, and each pivot variable comes from the RREF.
          const { r, pivots } = rref(sol.A);
          const free = Array.from({ length: n() }, (_, j) => j).find(j => !pivots.includes(j))!;
          const c: Vec = Array.from({ length: n() }, (_, j) => F(j === free ? 1 : 0));
          pivots.forEach((pj, i) => { c[pj] = neg(r[i][free]); });
          // Scaled to whole numbers: the free variable is the least common denominator instead of 1.
          const gcd = (a: bigint, b: bigint): bigint => (b === 0n ? a : gcd(b, a % b));
          const lcd = c.reduce((l, x) => (l * x.den) / gcd(l, x.den), 1n);
          c.forEach((x, j) => { c[j] = mul(x, fraction(Number(lcd))); });
          const u = sv.kind === "P" ? "q" : "\\mathbf{u}";
          const why = n() > m() ? ` (In fact, \\(A\\) has more columns than rows, so some column has no pivot, and no linear map from ${$(spaceTex(sv))} to ${$(spaceTex(sw))} is one-to-one.)` : "";
          parts.push(`<p>Here, ${$(`\\operatorname{null} A = ${nl} > 0`)}: column ${free + 1} of the reduced row echelon form of \\(A\\) has no pivot. So \\(T\\) is <strong>not one-to-one</strong>.
            For example, setting the free variable ${$(cName(free, V_COLORS))} to ${tex(c[free])} gives ${$(`${coordTex(u, Vset())} = ${coordVecTex(c, V_COLORS)}`)}, with ${$(`A${coordTex(u, Vset())} = \\mathbf{0}`)}. So the nonzero vector ${$$(`${u} = ${coordCombo(c, v, V_COLORS)} = ${elementTex(sv, matVec(problem.B, c))}`)} has ${$(`T(${u}) = \\mathbf{0} = T(\\mathbf{0})`)}: two different vectors with the same image.${why}</p>`);
        }
        return parts.join("");
      }
      default: {
        const use = $$(`${coordTex(`T(${xName()})`, Wset())} = A${coordTex(xName(), Vset())} = ${colorColsTex(sol.A)}${coordVecTex(problem.x, V_COLORS)} = ${coordVecTex(sol.Tx, wColors())}.`);
        if (!byHand()) return use;
        // By hand, part 2 step by step: the coordinates of x, then A times them.
        const titles = STEP_TITLES();
        return `<p><strong>2(a). ${titles[3]}.</strong></p>${workedHtml(3)}<p><strong>2(b). ${titles[4]}.</strong></p>${use}`;
      }
    }
  }

  // `answered` is true after a check or Show, which can finish the problem and so record it.
  function updateWorked(answered = false): void {
    const changed: Element[] = [];
    const doing = tasks();
    for (const s of STEPS) {
      const show = !doing[s] || work.status[s] !== "";
      const html = show ? workedHtml(s) : "";
      if (workedBoxes[s].dataset.html !== html) {
        workedBoxes[s].dataset.html = html;
        workedBoxes[s].innerHTML = html;
        changed.push(workedBoxes[s]);
      }
      cards[s].classList.toggle("mm-step-right", doing[s] && work.status[s] === "right");
      cards[s].classList.toggle("mm-step-shown", doing[s] && work.status[s] === "shown");
      // A step the student does is disabled until the steps whose answers it uses are right, shown,
      // or worked by the page.
      const blocker = PREREQS[s].find(p => !isDone(p));
      const locked = doing[s] && blocker !== undefined;
      cards[s].classList.toggle("mm-step-locked", locked);
      inputs[s].forEach(input => { input.disabled = locked; });
      updateButtons(s);
      lockNotes[s].hidden = !locked;
      const usesBox = usesBoxes[s];
      if (s === 5 && usesBox) {
        const html = isDone(2) && !locked
          ? `<p class="mm-uses-title">From ${byHand() ? "part 1" : "step 1(c)"}:</p>${$$(`A = ${colorColsTex(sol.A)}`)}`
            + (byHand() ? "" : `<p class="mm-uses-title">Row reduce \\(A\\) to find its rank and nullity${rankPracticeLink()}.</p>`)
          : "";
        if (usesBox.dataset.html !== html) {
          usesBox.dataset.html = html;
          usesBox.innerHTML = html;
          changed.push(usesBox);
        }
      }
      if (s === 4 && usesBox) {
        // Once they're found (or given): A, and [x]_𝒱 unless the student finds it on paper (by hand).
        const parts: string[] = [];
        if (isDone(2) && !locked) parts.push(`A = ${colorColsTex(sol.A)}`);
        if (isDone(3) && !locked && !byHand()) parts.push(`${coordTex(xName(), Vset())} = ${coordVecTex(problem.x, V_COLORS)}`);
        const html = parts.length === 0 ? "" : `<p class="mm-uses-title">From ${byHand() ? "part 1" : "steps 1(c) and 2(a)"}:</p>${$$(parts.join(", \\qquad "))}`;
        if (usesBox.dataset.html !== html) {
          usesBox.dataset.html = html;
          usesBox.innerHTML = html;
          changed.push(usesBox);
        }
      }
      if (locked) {
        const waiting = PREREQS[s].filter(p => !isDone(p) && !hiddenByHand(p));
        const names = byHand() && s <= 5 ? "part 1" : waiting.length > 1 ? `steps ${waiting.map(p => STEP_LABELS[p]).join(" and ")}` : `step ${STEP_LABELS[blocker]}`;
        lockNotes[s].textContent = `Finish ${names} first (check, or click Show).`;
      }
    }
    if (changed.length) void typeset(changed);
    syncYesNo();
    renderFigure();
    const wrong = work.wrongChecks ?? 0;
    hintCount.textContent = work.hintsUsed === 0 ? "No hints used"
      : `Hints used: ${work.hintsUsed}${wrong > 0 ? ` (including ${wrong} wrong check${wrong === 1 ? "" : "s"})` : ""}`;
    const needed = STEPS.filter(s => doing[s]);
    const finished = needed.length > 0 && needed.every(s => work.status[s] !== "");
    doneBox.hidden = !finished;
    if (finished) {
      const allRight = needed.every(s => work.status[s] === "right");
      doneText.textContent = allRight
        ? work.hintsUsed === 0 ? "Every step is right, with no hints!" : `Every step is right (hints used: ${work.hintsUsed}).`
        : "All steps are finished. Try another problem to get them right on your own.";
      practice.record(work.problem, work.hintsUsed, allRight && work.hintsUsed === 0, answered);
    }
    // After finishing: the next stage of the path, or the next level, if this one is mastered.
    const next = finished ? practice.suggestion() : null;
    doneSuggest.hidden = next === null;
    if (next) {
      doneSuggestText.textContent = next.text;
      doneNextLevel.textContent = next.label;
      doneSuggestAction = next.action;
    }
  }

  // ⋘──────── Checking ────────⋙

  // Reads a step's entries; blank entries are 0. Null if any entry isn't a number (those are marked).
  function read(s: number): Fraction[] | null {
    let ok = true;
    const values = inputs[s].map(input => {
      const x = parseFor(s, input.value);
      if (!x) { input.classList.add("mm-wrong"); ok = false; }
      return x ?? F(0);
    });
    return ok ? values : null;
  }
  const chunks = (values: Fraction[], size: number): Vec[] =>
    Array.from({ length: values.length / size }, (_, j) => values.slice(j * size, (j + 1) * size));
  // The student's answers to a step, if they're filled in, numbers, and the step is one they do.
  function studentValues(s: number): Fraction[] | null {
    if (!tasks()[s] || inputs[s].every(i => i.value.trim() === "")) return null;
    const values = inputs[s].map(i => parseFor(s, i.value));
    return values.some(x => x === null) ? null : (values as Fraction[]);
  }

  function check(s: number): void {
    const list = inputs[s];
    list.forEach(i => i.classList.remove("mm-right", "mm-wrong", "mm-shown"));
    if (list.every(i => i.value.trim() === "")) {
      showFeedback(s, `<p class="mm-feedback-wrong">Fill in the entries first.</p>`);
      return;
    }
    const values = read(s);
    if (!values) {
      showFeedback(s, s === YES_NO_STEP ? `<p class="mm-feedback-wrong">Answer both questions.</p>`
        : `<p class="mm-feedback-wrong">Each entry has to be a number, like -3, 0.5, or 1/2.</p>`);
      return;
    }
    const key = answers(s);
    const right = values.every((x, i) => equals(x, key[i]));
    answerNotes[s] = "";
    // A wrong check counts as a hint, since it tells the student something (checking the same
    // answer again doesn't count twice).
    const answerText = list.map(i => i.value.trim()).join(",");
    if (!right && work.lastWrong?.[s] !== answerText) {
      work.wrongChecks = (work.wrongChecks ?? 0) + 1;
      work.hintsUsed++;
      work.lastWrong = Object.assign(STEPS.map(() => ""), work.lastWrong ?? [], { [s]: answerText });
    }
    if (right) {
      list.forEach(i => i.classList.add("mm-right"));
      work.status[s] = "right";
      showFeedback(s, `<p class="mm-feedback-right">Right!</p>`);
    } else if (s === 0) {
      // T(vⱼ): each entry is marked, with notes on likely mistakes.
      values.forEach((x, i) => list[i].classList.add(equals(x, key[i]) ? "mm-right" : "mm-wrong"));
      if (work.status[s] === "right") work.status[s] = "";
      showFeedback(s, `<p class="mm-feedback-wrong">Not quite: the boxes in red aren't right.</p>${diagnose(s, values)}`);
    } else {
      // Coordinates and A: a wrong entry usually means the method went wrong, not that one number
      // did, so the check doesn't say which entries are right. It says which coordinate vectors
      // (or columns of A) aren't, and Hint explains what's wrong with the answer.
      if (work.status[s] === "right") work.status[s] = "";
      answerNotes[s] = diagnose(s, values);
      showFeedback(s, `<p class="mm-feedback-wrong">${wrongSummary(s, values)}</p>`
        + `<p class="mm-feedback-note">Rework your answer, or click <strong>Hint</strong> to see what's wrong with it.</p>`);
    }
    saveWork();
    updateWorked(true);
  }

  // The "Not quite" message for coordinates and A, naming the coordinate vectors or columns that
  // aren't right (each as a whole).
  function wrongSummary(s: number, values: Fraction[]): string {
    if (s === 3 || s === 4) return "Not quite: these coordinates aren't right.";
    if (s === 5) {
      const [r, k] = [equals(values[0], F(rankA())), equals(values[1], F(nullA()))];
      return r ? "Not quite: the nullity isn't right." : k ? "Not quite: the rank isn't right." : "Not quite: the rank and the nullity aren't right.";
    }
    if (s === YES_NO_STEP) return "Not quite: at least one answer isn't right.";
    const size = s === 1 ? m() : 0;
    const wrong = Array.from({ length: n() }, (_, j) => j).filter(j => s === 1
      ? !vecEq(values.slice(j * size, (j + 1) * size), sol.coords[j])
      : !vecEq(column(chunks(values, n()), j), column(sol.A, j)));
    if (s === 2) {
      return wrong.length === n() ? "Not quite: the columns of \\(A\\) aren't right."
        : `Not quite: ${wrong.length === 1 ? "column" : "columns"} ${wrong.map(j => j + 1).join(" and ")} of \\(A\\) ${wrong.length === 1 ? "isn't" : "aren't"} right.`;
    }
    const names = wrong.map(j => $(coordTex(TvTex(j), Wset()))).join(" and ");
    return `Not quite: ${names} ${wrong.length === 1 ? "isn't" : "aren't"} right.`;
  }

  // Explains likely mistakes: after "Not quite" for step 1(a), and through Hint for the other steps.
  function diagnose(s: number, values: Fraction[]): string {
    const notes: string[] = [];
    const sw = W();
    const note = (html: string) => notes.push(`<p class="mm-feedback-note">${html}</p>`);
    if (s === 0) {
      const given = chunks(values, sw.ambient);
      given.forEach((y, j) => {
        if (vecEq(y, sol.TV[j])) return;
        if (sw.ambient === V().ambient && vecEq(y, column(problem.B, j))) {
          note(`${$(TvTex(j))} is what \\(T\\) does to ${$(v(j))}, not ${$(v(j))} itself.`);
        } else {
          note(`${$(TvTex(j))} isn't right yet.`);
        }
      });
    } else if (s === 1) {
      const given = chunks(values, m());
      const mine = studentValues(0);
      given.forEach((c, j) => {
        if (vecEq(c, sol.coords[j])) return;
        const theirT = mine ? chunks(mine, sw.ambient)[j] : null;
        const theirCoords = theirT && !vecEq(theirT, sol.TV[j]) ? solve(problem.C, theirT) : null;
        const lhs = coordTex(TvTex(j), Wset());
        if (theirCoords && vecEq(c, theirCoords)) {
          note(`${$(lhs)} is right for the ${$(TvTex(j))} you found in step 1(a), but that ${$(TvTex(j))} isn't right.`);
        } else if (!wStd() && c.length === sol.TV[j].length && vecEq(c, sol.TV[j])) {
          note(`For ${$(lhs)}, you entered the entries of ${$(TvTex(j))} itself. Its coordinates relative to ${$(Wset())} are the numbers ${$(cList(m(), wColors()))} such that ${$(`${TvTex(j)} = ${cSum(m(), w, wColors())}`)}.`);
        } else {
          const result = matVec(problem.C, c);
          const comboTex = coordCombo(c, w, wColors());
          note(`For ${$(lhs)}: your coordinates give ${$(`${comboTex} = ${elementTex(sw, result)}`)}, but ${$(`${TvTex(j)} = ${isDone(0) ? elementTex(sw, sol.TV[j]) : "\\ldots"}`)}.`);
        }
      });
    } else if (s === 2) {
      const S = chunks(values, n());
      const mine = studentValues(1);
      const mineA = mine ? fromColumns(chunks(mine, m())) : null;
      const MB = matMul(problem.M, problem.B);
      if (m() === n() && matEq(S, transpose(sol.A))) {
        note(`Each coordinate vector ${$(coordTex(TvjTex(), Wset()))} goes in a <em>column</em> of \\(A\\), not a row.`);
      } else if (mineA && matEq(S, mineA)) {
        note("Your matrix matches your coordinate vectors from step 1(b), but some of those aren't right.");
      } else if (!wStd() && MB.length === m() && matEq(S, MB)) {
        note(`The columns you entered are the vectors ${$(TvjTex())} themselves. The columns of \\(A\\) are their <em>coordinates</em> relative to ${$(Wset())}.`);
      } else if ((!vStd() || !wStd()) && problem.M.length === m() && problem.M[0].length === n() && matEq(S, problem.M)) {
        note("That's the matrix of \\(T\\) relative to the <em>standard</em> bases. Use the bases in the problem.");
      } else {
        for (let j = 0; j < n(); j++) {
          if (!vecEq(column(S, j), column(sol.A, j))) note(`Column ${j + 1} should be ${$(coordTex(TvTex(j), Wset()))}.`);
        }
      }
    } else if (s === 3) {
      const xc = coordTex(xName(), Vset());
      if (!vStd() && values.length === sol.xVec.length && vecEq(values, sol.xVec)) {
        note(`Those are the entries of ${$(xName())} itself. Its coordinates relative to ${$(Vset())} are the numbers ${$(cList(n(), V_COLORS))} such that ${$(`${xName()} = ${cSum(n(), v, V_COLORS)}`)}.`);
      } else {
        const comboTex = coordCombo(values, v, V_COLORS);
        note(`Your coordinates give ${$(`${comboTex} = ${elementTex(V(), matVec(problem.B, values))}`)}, but ${$(`${xName()} = ${xTex()}`)}. Check ${$(xc)}.`);
      }
    } else if (s === 5) {
      const [r, k] = values.map(x => Number(x.num) / Number(x.den));
      if (r === nullA() && k === rankA() && r !== k) {
        note("It looks like the rank and the nullity are swapped. The rank is the number of pivots; the nullity is the number of columns without a pivot.");
      } else if (r + k !== n()) {
        note(`The rank and the nullity add up to the number of columns of \\(A\\), which is ${n()} (the dimension of ${$(spaceTex(V()))}). Yours add up to ${r + k}.`);
      } else if (r === m() && m() !== rankA()) {
        note(`The rank is the number of pivots in the reduced row echelon form of \\(A\\), which can be less than the number of rows.`);
      }
    } else if (s === YES_NO_STEP) {
      const [onto, one] = values.map(x => !isZero(x));
      const mine = studentValues(5);
      const [r, k] = mine ? mine.map(x => Number(x.num) / Number(x.den)) : [rankA(), nullA()];
      if (onto !== isOnto()) {
        if (mine && (r !== rankA()) && onto === (r === m())) note("Your answer for onto fits the rank you found in step 3(a), but that rank isn't right.");
        else if (onto === (rankA() === n()) && m() !== n()) note(`For onto, compare the rank with the dimension of the <em>target</em> ${$(spaceTex(W()))}, which is ${m()}, not the dimension of the domain.`);
        else note(`For onto, compare ${$("\\operatorname{rank} A")} with ${$(dimTex(W()))}.`);
      }
      if (one !== isOneToOne()) {
        if (mine && k !== nullA() && one === (k === 0)) note("Your answer for one-to-one fits the nullity you found in step 3(a), but that nullity isn't right.");
        else note(`For one-to-one, look at the nullity: \\(T\\) is one-to-one exactly when ${$("\\operatorname{null} A = 0")}, that is, when only ${$("\\mathbf{0}")} maps to ${$("\\mathbf{0}")}.`);
      }
    } else {
      // Mistakes carried forward from A (step 1(c)) or [x]_𝒱 (step 2(a)), as the student entered them.
      const mine = studentValues(2);
      const mineA = mine ? chunks(mine, n()) : sol.A;
      const mineX = studentValues(3) ?? problem.x;
      const xc = coordTex(xName(), Vset());
      if ((!matEq(mineA, sol.A) || !vecEq(mineX, problem.x)) && vecEq(values, matVec(mineA, mineX))) {
        note(`That's right for the ${!matEq(mineA, sol.A) ? "matrix \\(A\\)" : `coordinates ${$(xc)}`} you entered, but ${!matEq(mineA, sol.A) ? "that matrix isn't" : "those aren't"} right.`);
      } else if (!vStd() && values.length === m() && vecEq(values, matVec(sol.A, sol.xVec))) {
        note(`It looks like you multiplied \\(A\\) by ${$(xName())} itself. Multiply \\(A\\) by the coordinate vector ${$(xc)} instead.`);
      } else if (m() === n() && vecEq(values, matVec(transpose(sol.A), problem.x))) {
        note(`It looks like you multiplied by the rows of \\(A\\) as columns. Each entry of ${$(`A${coordTex(xName(), Vset())}`)} is a row of \\(A\\) times ${$(coordTex(xName(), Vset()))}.`);
      } else if (vecEq(values.slice(0, problem.x.length), problem.x) && values.length === problem.x.length) {
        note(`That's ${$(coordTex(xName(), Vset()))}. Multiply it by \\(A\\) to get ${$(coordTex(`T(${xName()})`, Wset()))}.`);
      }
    }
    return notes.join("");
  }

  function showFeedback(s: number, html: string): void {
    feedbacks[s].innerHTML = html;
    void typeset([feedbacks[s]]);
  }

  function show(s: number): void {
    const key = answers(s);
    inputs[s].forEach((input, i) => {
      input.value = formatFor(s, key[i]);
      input.classList.remove("mm-right", "mm-wrong");
      input.classList.add("mm-shown");
    });
    if (work.status[s] !== "right") {
      work.status[s] = "shown";
      work.hintsUsed++;
    }
    showFeedback(s, "");
    saveWork();
    updateWorked(true);
  }

  // ⋘──────── Hints ────────⋙

  const gaussUrl = (C: Mat, y: Vec) =>
    `${window.GAUSSIAN_PRACTICE_URL ?? "/tools/gaussian_elimination_practice/"}?m=${C.map((row, i) => [...row, y[i]].map(plain).join(",")).join(";")}`;
  // The same page for a matrix that isn't augmented (such as A, to find its rank and nullity).
  const gaussMatUrl = (a: Mat) =>
    `${window.GAUSSIAN_PRACTICE_URL ?? "/tools/gaussian_elimination_practice/"}?m=${a.map(row => row.map(plain).join(",")).join(";")}&aug=0`;
  // A link to row reduce A there; left out by hand (level 4), where the work is on paper.
  const rankPracticeLink = () => (byHand() ? ""
    : ` (<a href="${gaussMatUrl(sol.A)}" target="_blank" rel="noopener">practice this row reduction</a>)`);

  function hintLevels(s: number): string[] {
    const sv = V(), sw = W();
    const Wn = Wset(), Vn = Vset();
    switch (s) {
      case 0: {
        const stdList = Array.from({ length: sv.ambient }, (_, k) => stdName(k)).join(", ");
        const first = problem.form === "named"
          ? NAMED[problem.named].hint
          : problem.form === "basis"
            ? `Write each basis vector ${$(vj())} as a combination of ${$(stdList)}${sv.kind === "P" ? " (its coefficients)" : " (its entries)"}. Then use linearity: \\(T\\) of a combination is the same combination of ${$(Array.from({ length: sv.ambient }, (_, k) => `T(${stdName(k)})`).join(", "))}.`
          : problem.form === "matrix"
            ? `Multiply the matrix by each basis vector: ${$(`${TvjTex()} = M${vj()}`)}, where \\(M\\) is the matrix in the formula for \\(T\\).`
            : sv.kind === "P"
              ? "Write each basis polynomial as \\(a_0 + a_1 x + \\cdots\\), and substitute its coefficients into the formula for \\(T\\)."
              : "Substitute the entries of each basis vector for \\(x_1, x_2, \\ldots\\) in the formula for \\(T\\).";
        const b1 = column(problem.B, 0);
        let second: string;
        if (problem.form === "named") {
          second = `In formulas, ${$$(formulaTex(sv))}`;
        } else if (problem.form === "basis") {
          // T(v₁) = c₁T(e₁) + c₂T(e₂) + ⋯, with the images written out.
          const sw2 = W();
          const asCombo = combo(b1.map((c, k) => ({ c, v: stdName(k) })));  // Column vectors only
          const images = combo(b1.map((c, k) => ({ c, v: sw2.kind === "P" ? `(${elementTex(sw2, column(problem.M, k))})` : elementTex(sw2, column(problem.M, k)) })));
          const imagesNamed = combo(b1.map((c, k) => ({ c, v: `T(${stdName(k)})` })));
          second = `For example, ${$(`${v(0)} = ${sv.kind === "P" ? polyTex(b1) : asCombo}`)}, so ${$$(`${TvTex(0)} = ${imagesNamed} = ${images}.`)}`;
        } else if (problem.form === "matrix") {
          second = `For example, ${$$(`${TvTex(0)} = ${matTex(problem.M)}${vecTex(b1)}.`)}`;
        } else if (sv.kind === "P") {
          const coefs = b1.map((c, k) => `a_{${k}} = ${tex(c)}`).join(",\\ ");
          second = `For example, ${$(`${v(0)} = ${polyTex(b1)}`)} has ${$(coefs)}. Substitute these into the formula.`;
        } else {
          const rows = problem.M.map(row => {
            let out = "";
            row.forEach((c, k) => {
              if (isZero(c)) return;
              const negative = c.num < 0n, a = negative ? neg(c) : c;
              const coef = isOne(a) ? "" : tex(a);
              const term = `${coef}(${tex(b1[k])})`;
              out += out === "" ? (negative ? "-" : "") + term : (negative ? " - " : " + ") + term;
            });
            return out || "0";
          });
          second = `For example, ${$$(`${TvTex(0)} = T\\left(${vecTex(b1)}\\right) = ${colTex(rows)}.`)}`;
        }
        return [first, second];
      }
      case 1: {
        if (wStd()) {
          return [sw.kind === "P"
            ? `Relative to the standard basis ${$(`\\{1, x, \\ldots\\}`)}, the coordinates of a polynomial are its coefficients.`
            : "Relative to the standard basis, the coordinates of a vector are its entries."];
        }
        const first = `Find the numbers ${$(cList(m(), wColors()))} such that ${$(`${cSum(m(), w, wColors())} = ${TvjTex()}`)}.`
          + (sw.kind === "P" ? " Match the coefficients of each power of \\(x\\) on both sides." : "")
          + " This is a linear system: its augmented matrix has the basis vectors of " + $(Wn) + " as columns, then " + $(TvjTex()) + ".";
        let second: string;
        if (isDone(0)) {
          second = sol.TV.map((y, j) => `<p>For ${$(TvTex(j))}, row reduce ${$(augTex(problem.C, y, wColors(), V_COLORS[j]))}
            (<a href="${gaussUrl(problem.C, y)}" target="_blank" rel="noopener">practice this row reduction</a>).</p>`).join("");
          if (n() > 1) second += `<p>Since the left side is the same for every column, you can also row reduce all of them at once, with ${$(`${TvTex(0)}, \\ldots, ${TvTex(n() - 1)}`)} all to the right of the bar.</p>`;
        } else {
          const cols = Array.from({ length: m() }, (_, i) => w(i)).join(" & ");
          second = `Row reduce ${$(`\\left[\\begin{array}{${"c".repeat(m())}|c} ${cols} & ${TvjTex()} \\end{array}\\right]`)} for each \\(j\\). Finish step 1(a) first to fill in the numbers.`;
        }
        return [first, second];
      }
      case 2: {
        const cols = Array.from({ length: n() }, (_, j) => coordTex(TvTex(j), Wn)).join(" & ");
        if (byHand()) {
          // One hint at a time, through the steps, starting with the plan. (Step 1(b)'s second hint
          // would give away the answers to step 1(a), so it's left out.)
          const [apply, applyMore] = hintLevels(0);
          return [
            `Work in three steps: apply \\(T\\) to each basis vector in ${$(Vn)}, find the coordinates of each result relative to ${$(Wn)}, and place those coordinate vectors into the columns of \\(A\\): ${$$(`A = \\begin{bmatrix} ${cols} \\end{bmatrix}.`)}`,
            `<strong>Step 1(a).</strong> ${apply}`,
            `<strong>Step 1(a), more specifically.</strong> ${applyMore}`,
            `<strong>Step 1(b).</strong> ${hintLevels(1)[0]}`,
          ];
        }
        return [`Column \\(j\\) of \\(A\\) is the coordinate vector ${$(coordTex(TvjTex(), Wn))} from step 1(b): ${$$(`A = \\begin{bmatrix} ${cols} \\end{bmatrix}.`)}
          So \\(A\\) has ${m()} row${m() > 1 ? "s" : ""} (the dimension of \\(${spaceTex(sw)}\\)) and ${n()} column${n() > 1 ? "s" : ""} (the dimension of \\(${spaceTex(sv)}\\)).`];
      }
      case 3: {
        const xc = coordTex(xName(), Vn);
        if (vStd()) {
          return [sv.kind === "P"
            ? `Relative to the standard basis ${$(`\\{1, x, \\ldots\\}`)}, the coordinates of a polynomial are its coefficients.`
            : "Relative to the standard basis, the coordinates of a vector are its entries."];
        }
        const first = `Find the numbers ${$(cList(n(), V_COLORS))} such that ${$(`${cSum(n(), v, V_COLORS)} = ${xName()}`)}; then ${$(`${xc} = ${colTex(Array.from({ length: n() }, (_, i) => cName(i, V_COLORS)))}`)}.`
          + (sv.kind === "P" ? " Match the coefficients of each power of \\(x\\) on both sides." : "")
          + ` This is a linear system: its augmented matrix has the basis vectors of ${$(Vn)} as columns, then ${$(xName())}.`;
        const second = `Row reduce ${$(augTex(problem.B, sol.xVec, V_COLORS, "#202124"))}
          (<a href="${gaussUrl(problem.B, sol.xVec)}" target="_blank" rel="noopener">practice this row reduction</a>).`;
        return [first, second];
      }
      case 5: {
        const { r, pivots } = rref(sol.A);
        return [
          "Row reduce \\(A\\). The rank is the number of pivots (leading entries) in its reduced row echelon form, and the nullity is the number of columns without a pivot: " + $$(`\\operatorname{rank} A + \\operatorname{null} A = \\text{number of columns} = ${n()}.`),
          `The reduced row echelon form of \\(A\\)${rankPracticeLink()} is ${$$(`${matTex(r)},`)} with pivots in column${pivots.length === 1 ? "" : "s"} ${pivots.map(j => j + 1).join(" and ") || "(none)"}.`,
        ];
      }
      case 6: {
        const sw = W();
        return [
          `From lecture (with ${$("A_T")} the matrix of \\(T\\) relative to any bases): ${$$(`T \\text{ is onto} \\iff \\operatorname{rank} A_T = \\dim W, \\qquad T \\text{ is one-to-one} \\iff \\operatorname{null} A_T = 0.`)}`,
          `Here, \\(W = ${spaceTex(sw)}\\)${isSubspace(sw) ? ` (the ${sw.dim === 2 ? "plane" : "line"})` : ""}, so ${$(`${dimTex(sw)} = ${m()}`)}. Compare this with the rank from step 3(a), and check whether the nullity is 0.`,
        ];
      }
      default: {
        const first = `Multiply the matrix \\(A\\) from step 1(c) by the coordinate vector from step 2(a): ${$(`${coordTex(`T(${xName()})`, Wn)} = A${coordTex(xName(), Vn)}`)}.`;
        const columnsTex = coordCombo(problem.x, j => `\\text{(column ${j + 1} of } A)`, V_COLORS);
        const second = `By linearity, since ${$(`${xName()} = ${xCombo()}`)}, we have ${$(`T(${xName()}) = ${coordCombo(problem.x, TvTex, V_COLORS)}`)}, so ${$(`${coordTex(`T(${xName()})`, Wn)}`)} is ${$(columnsTex)}.`;
        if (byHand()) {
          // By hand, part 2 includes finding [x]_𝒱 (step 2(a)), so its hints come first.
          return [`Work in two steps: find the coordinate vector ${$(coordTex(xName(), Vn))}, then multiply: ${$(`${coordTex(`T(${xName()})`, Wn)} = A${coordTex(xName(), Vn)}`)}.`,
            ...hintLevels(3).map((h, i) => `<strong>Finding ${$(coordTex(xName(), Vn))}${i > 0 ? ", more specifically" : ""}.</strong> ${h}`)];
        }
        return [first, second];
      }
    }
  }

  function renderHint(s: number): void {
    const levels = hintLevels(s);
    const shown = levels.slice(0, Math.min(work.hintLevel[s], levels.length));
    const about = shownNotes[s] ? `<p><strong>About your answer:</strong></p>${shownNotes[s]}` : "";
    hintBoxes[s].hidden = shown.length === 0 && about === "";
    hintBoxes[s].innerHTML = about + shown.map(h => (h.startsWith("<p>") ? h : `<p>${h}</p>`)).join("")
      + (work.hintLevel[s] < levels.length ? `<p><em>Click Hint again for ${shown.length === 0 ? "a hint" : "a more specific hint"}.</em></p>` : "");
    void typeset([hintBoxes[s]]);
  }

  // After a wrong check of coordinates or A, the first Hint explains what's wrong with the answer
  // (see check); later ones give the step's hints, from general to specific.
  function hint(s: number): void {
    const levels = hintLevels(s);
    if (answerNotes[s] && shownNotes[s] !== answerNotes[s]) {
      shownNotes[s] = answerNotes[s];
      work.hintsUsed++;
    } else if (work.hintLevel[s] < levels.length) {
      work.hintLevel[s]++;
      work.hintsUsed++;
    }
    renderHint(s);
    saveWork();
    updateWorked();
  }

  // ⋘──────── Loading problems ────────⋙

  // `fromStage` is the practice-path stage the problem comes from (null for custom problems and
  // examples); it goes in the URL as &st=N (1-based), so a reload or a shared link keeps it.
  // ⋘──────── Previous and next problems ────────⋙
  // The problems seen in this visit, as URL queries, so Previous and Next can go back and forth.
  // Next goes forward through them, and then to a new problem.
  const seen: string[] = [];
  let seenIndex = -1;
  const prevButton = byId<HTMLButtonElement>("mm-prev");
  const nextButton = byId<HTMLButtonElement>("mm-next");
  const updateNav = () => { prevButton.disabled = seenIndex <= 0; };
  function goTo(index: number): void {
    seenIndex = index;
    const query = seen[index];
    const p = decodeProblem(query);
    const st = Number(new URLSearchParams(query).get("st"));
    if (p) load(p, true, Number.isInteger(st) && st >= 1 && st <= STAGES.length ? st - 1 : null, false);
    updateNav();
  }
  prevButton.addEventListener("click", () => { if (seenIndex > 0) goTo(seenIndex - 1); });
  nextButton.addEventListener("click", () => {
    if (seenIndex < seen.length - 1) goTo(seenIndex + 1);
    else newProblem();
  });

  // `remember`: whether this is a problem to add to the ones seen (rather than one Previous or
  // Next is returning to).
  function load(p: Problem, restore: boolean, fromStage: number | null, remember = true): void {
    problem = p;
    practice.setProblemStage(fromStage);
    sol = solveProblem(p);
    answerNotes = STEPS.map(() => "");
    shownNotes = STEPS.map(() => "");
    const code = encodeProblem(p);
    history.replaceState(null, "", `${location.pathname}?${code}${fromStage === null ? "" : `&st=${fromStage + 1}`}${location.hash}`);
    if (remember) {
      seen.splice(seenIndex + 1);
      seen.push(location.search);
      seenIndex = seen.length - 1;
      updateNav();
    }
    const savedWork = (loadJSON<Record<string, Work>>(WORKS_KEY) ?? {})[code];
    // Work saved by an older version of the page, with fewer steps, is dropped.
    work = restore && savedWork && savedWork.problem === code && Array.isArray(savedWork.entries)
      && savedWork.status?.length === STEPS.length
      ? savedWork
      : { problem: code, entries: STEPS.map(() => []), status: STEPS.map(() => "" as Status), hintLevel: STEPS.map(() => 0), hintsUsed: 0 };
    render();
    if (!restore) saveWork();
  }

  function render(): void {
    renderStatement();
    renderSteps();
    void typeset([statement, stepsBox]);
  }

  const newProblem = () => load(randomProblem(problemSettings(settings())), false, practice.mode() === "path" ? practice.stage() : null);

  // ⋘──────── Events ────────⋙

  for (const select of [spacesSelect, basesSelect, formSelect]) {
    select.addEventListener("change", () => { saveSettings(); newProblem(); });
  }
  levelButtons.forEach(button => button.addEventListener("change", () => {
    saveSettings();
    saveWork();
    render();
    practice.levelChanged();
  }));
  byId<HTMLButtonElement>("mm-done-new").addEventListener("click", () => {
    nextButton.click();
    window.scrollTo({ top: statement.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
  });
  doneNextLevel.addEventListener("click", () => doneSuggestAction());
  exampleSelect.addEventListener("change", () => {
    const example = EXAMPLES[exampleSelect.value];
    exampleSelect.value = "";  // So the same example can be chosen again
    if (example) load(example, false, null);
  });

  setupHelp("mm");
  const panels = setupPanels("mm", () =>
    saveJSON(PIN_KEY, panels.list.map((panel, i) => (panels.isPinned(panel) ? i : -1)).filter(i => i >= 0)));
  for (const i of loadJSON<number[]>(PIN_KEY) ?? []) {
    if (panels.list[i]) panels.setPinned(panels.list[i], true);
  }

  const fromUrl = decodeProblem(location.search);
  if (fromUrl) load(fromUrl, true, practice.urlStage);
  else newProblem();
  practice.render();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initPage);
  else initPage();
}
