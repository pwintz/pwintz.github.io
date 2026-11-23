// ╭───────────────────────────────────────────────────────────────╮
// │              Practice: eigenvalues and eigenvectors            │
// ╰───────────────────────────────────────────────────────────────╯
// Random problems, worked in steps. Each step has entry boxes (numbers, vectors, matrices, or a
// Yes/No pill), and Check, Hint, and Show buttons, as on the other linear algebra practice pages.
// A step whose answer depends on an earlier one stays hidden until that step is right or shown,
// so the steps don't give away answers (such as how many eigenvalues there are, or the dimension of
// an eigenspace) before the student finds them.
//
// Support levels: with full support the page works every step (a worked example); with partial
// support it works the routine calculations (Av, A − λI, determinants, the characteristic
// polynomial, and dimensions), and the student does the rest; with none, the student works the
// whole problem by hand, on paper, and enters only the answers (the steps marked `final`). The other
// steps stay hidden until the answers are finished, and then the page shows them, worked. The
// picture (visualizer.ts) is of the same problem, and its values stay hidden until the steps are
// finished.
//
// The practice path (common/practice.ts) goes from checking a given vector or number, through the
// eigenvalues and eigenvectors of 2 × 2 matrices, to the eigenspaces of 3 × 3 matrices. The
// problem is saved in the URL (eigen_math.ts: encodeProblem), and the student's entries, hints, and
// checks are saved in this browser for that problem.

import { setupPractice, Stage } from "../common/practice";
import { typeset as typesetMath } from "../common/mathjax";
import { loadJSON, saveJSON } from "../common/storage";
import { byHandNote } from "../common/step_practice";
import { Fraction, equals, formatFraction, isZero, mul, parseEntry } from "../matrix/fraction";
import { FMat, FVec, isZeroVec, matVec, rref } from "../matrix/linalg";
import {
  F, Kind, KINDS, Problem, kindSizes, problemError, charPoly, colTex, decodeProblem, det, eigen2, eigenvalueOf, encodeProblem, fracTex, matTex,
  parenTex, polyTex, randomProblem, rankOf, rationalEigen, shift, shiftTex, surdTex, trace, vecTex, Eigenspace,
  diagTermTex, prodTex, shiftName,
} from "./eigen_math";

// Typesets math, then takes it out of the Tab order (MathJax makes each formula focusable), so that
// Tab moves between the entry boxes and buttons.
function typeset(els: Element[]): Promise<void> {
  return typesetMath(els).then(() => {
    for (const el of els) el.querySelectorAll<HTMLElement>("mjx-container[tabindex]").forEach(m => { m.tabIndex = -1; });
  });
}

const $ = (tex: string) => `\\(${tex}\\)`;
const $$ = (tex: string) => `\\[${tex}\\]`;
const str = (x: Fraction) => formatFraction(x).replace("−", "-");
const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = "", html = ""): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html) e.innerHTML = html;
  return e;
}

// ⋘──────── Stages of the practice path ────────⋙

const STAGES: (Stage & { kind: Kind })[] = [
  { id: "evec", kind: "evec", title: "Check an eigenvector", note: "Multiply Av and decide whether it is a multiple of v. If it is, the multiple is the eigenvalue." },
  { id: "evalcheck", kind: "evalcheck", title: "Check an eigenvalue", note: "Write A − λI and find its determinant: λ is an eigenvalue exactly when det(A − λI) = 0." },
  { id: "tri", kind: "tri", title: "Triangular matrices", note: "The eigenvalues of a triangular matrix are its diagonal entries." },
  { id: "poly2", kind: "poly2", title: "Eigenvalues of a 2 × 2 matrix", note: "Find the characteristic polynomial det(A − λI) and its roots." },
  { id: "vecs2", kind: "vecs2", title: "Eigenvectors of a 2 × 2 matrix", note: "The eigenvalues are given: for each one, solve (A − λI)x = 0." },
  { id: "full2", kind: "full2", title: "Eigenvalues and eigenvectors", note: "The whole process for a 2 × 2 matrix: the characteristic polynomial, its roots, and an eigenvector for each root." },
  { id: "repeated2", kind: "repeated2", title: "A repeated eigenvalue", note: "A 2 × 2 matrix with only one eigenvalue: find its eigenspace and decide whether the matrix is diagonalizable." },
  { id: "complex2", kind: "complex2", title: "Complex eigenvalues", note: "The characteristic polynomial has no real roots: find the complex eigenvalues a ± bi." },
  { id: "eig3", kind: "eig3", title: "Eigenspaces of a 3 × 3 matrix", note: "Given the characteristic polynomial, find the eigenvalues, a basis of each eigenspace, and whether the matrix is diagonalizable." },
];
const CLEAN_TO_ADVANCE_STAGE = 2;
const SETTINGS_KEY = "eigenvalues_practice_settings";
const WORKS_KEY = "eigenvalues_works";
const PIN_KEY = "eigenvalues_pinned_panels";
const SUPPORT_NAMES = ["Full", "Partial", "None"];
const SUPPORT_DESCRIPTIONS = [
  "The page works every step: a worked example",
  "The page does the routine calculations; you do the main steps",
  "Solve the whole problem by hand, then enter the answers",
];

// ⋘──────── Steps ────────⋙

type Group =
  | { type: "scalar"; before?: string; after?: string; whenYes?: boolean }
  | { type: "vec"; n: number; before?: string }
  | { type: "mat"; n: number; before?: string }
  | { type: "yesno"; before?: string };
const groupSize = (g: Group) => (g.type === "vec" ? g.n : g.type === "mat" ? g.n * g.n : 1);

// marks: for each box, true (right), false (wrong), or null (not marked).
interface Verdict { ok: boolean; message?: string; marks?: (boolean | null)[] }

interface Step {
  title: string;
  intro?: string;
  uses?: Use[];                           // What the step uses from the problem and earlier steps
  groups: Group[];
  answer: string[];                       // One per box; "yes"/"no" for Yes/No
  check: (values: string[]) => Verdict;
  hints: string[];
  worked: string;                         // Shown once the step is right or shown
  prereqs: number[];                      // Steps that must be right or shown first
  given?: number;                         // The last support level at which the page works this step (default 1)
  final?: boolean;                        // An answer to the problem, entered at the last level (by hand)
}

const parseAll = (values: string[]) => values.map(v => parseEntry(v));

/** Each box must equal its expected value; each box is marked. */
const exact = (expected: Fraction[], message?: string) => (values: string[]): Verdict => {
  const got = parseAll(values);
  const marks = got.map((x, i) => x !== null && equals(x, expected[i]));
  return { ok: marks.every(Boolean), marks, message: marks.every(Boolean) ? undefined : message };
};

/** The boxes must be the expected numbers in some order, each as many times as expected. */
const multiset = (expected: Fraction[]) => (values: string[]): Verdict => {
  const got = parseAll(values);
  const left = [...expected];
  const marks = got.map(x => {
    if (!x) return false;
    const i = left.findIndex(e => equals(e, x));
    if (i < 0) return false;
    left.splice(i, 1);
    return true;
  });
  if (marks.every(Boolean)) return { ok: true, marks };
  const allRoots = got.every(x => x && expected.some(e => equals(e, x)));
  return {
    ok: false,
    marks,
    message: allRoots
      ? "Each of these is an eigenvalue, but a repeated root of the characteristic polynomial should be listed as many times as it is a root."
      : `Not every number here is a root of ${$("\\det(A - \\lambda I)")}. Plug each one in to check.`,
  };
};

const yesNo = (v: string) => (v === "yes" || v === "no" ? v : "");
const lt = (x: Fraction) => parenTex(x);                       // λ inside A − λI: "3" or "(-2)"

function rrefDisplay(M: FMat): string {
  const { r } = rref(M);
  return matTex(r);
}

/** "Free variable x₂" sentences for a null space basis. */
function freeVars(M: FMat): number[] {
  const { pivots } = rref(M);
  return M[0].map((_, j) => j).filter(j => !pivots.includes(j));
}

function stepAvOf(A: FMat, v: FVec): Step {
  const n = A.length, Av = matVec(A, v);
  const rows = A.map(row => row.map((x, j) => `${fracTex(x)} \\cdot ${parenTex(v[j])}`).join(" + "));
  return {
    title: `Compute ${$("A\\vect{v}")}`,
    groups: [{ type: "vec", n, before: $("A\\vect{v} =") }],
    answer: Av.map(str),
    check: exact(Av),
    hints: [
      `Entry \\(i\\) of ${$("A\\vect{v}")} is row \\(i\\) of \\(A\\) times ${$("\\vect{v}")}: multiply the matching entries and add.`,
      `The first entry is ${$(rows[0])}.`,
    ],
    worked: $$(`A\\vect{v} = ${matTex(A)}${vecTex(v)} = ${colTex(rows)} = ${vecTex(Av)}`),
    prereqs: [],
  };
}

function stepIsEigenvector(A: FMat, v: FVec): Step {
  const lambda = eigenvalueOf(A, v);
  const Av = matVec(A, v);
  let worked: string;
  if (lambda) {
    worked = `<p>${$(`A\\vect{v} = ${vecTex(Av)} = ${fracTex(lambda)}${vecTex(v)} = ${fracTex(lambda)}\\vect{v}`)}, so ${$("\\vect{v}")} <strong>is</strong> an eigenvector of \\(A\\), with eigenvalue ${$(`\\lambda = ${fracTex(lambda)}`)}.</p>`;
  } else {
    // Why not: two entries with different ratios, or a zero entry of v where Av isn't zero.
    const ratios = v.map((x, i) => (isZero(x) ? null : { i, r: mul(Av[i], { num: x.den, den: x.num }) }));
    const known = ratios.filter((r): r is { i: number; r: Fraction } => r !== null);
    const differ = known.find(r => !equals(r.r, known[0].r));
    const zero = v.findIndex((x, i) => isZero(x) && !isZero(Av[i]));
    const why = differ
      ? `entry ${known[0].i + 1} of ${$("A\\vect{v}")} is ${$(fracTex(known[0].r))} times entry ${known[0].i + 1} of ${$("\\vect{v}")}, but entry ${differ.i + 1} is ${$(fracTex(differ.r))} times entry ${differ.i + 1}`
      : `entry ${zero + 1} of ${$("\\vect{v}")} is 0, but entry ${zero + 1} of ${$("A\\vect{v}")} isn't`;
    worked = `<p>${$(`A\\vect{v} = ${vecTex(Av)}`)} is not a multiple of ${$(`\\vect{v} = ${vecTex(v)}`)}: ${why}.
      No single number \\(\\lambda\\) has ${$("A\\vect{v} = \\lambda\\vect{v}")}, so ${$("\\vect{v}")} is <strong>not</strong> an eigenvector of \\(A\\).</p>`;
  }
  return {
    title: `Determine whether ${$("\\vect{v}")} is an eigenvector of \\(A\\)`,
    groups: [
      { type: "yesno", before: `${$("\\vect{v}")} is an eigenvector of \\(A\\):` },
      { type: "scalar", before: `If yes, its eigenvalue is ${$("\\lambda =")}`, whenYes: true },
    ],
    answer: lambda ? ["yes", str(lambda)] : ["no", ""],
    check(values) {
      const answer = yesNo(values[0]);
      if (!lambda) {
        return answer === "no" ? { ok: true, marks: [true, null] }
          : { ok: false, marks: [false, null], message: `${$("A\\vect{v}")} isn't a multiple of ${$("\\vect{v}")}: compare the ratios of matching entries.` };
      }
      if (answer !== "yes") return { ok: false, marks: [false, null], message: `Compare the entries again: check whether each entry of ${$("A\\vect{v}")} is the same multiple of the matching entry of ${$("\\vect{v}")}.` };
      const l = parseEntry(values[1]);
      if (!l || !equals(l, lambda)) return { ok: false, marks: [true, false], message: `${$("\\vect{v}")} is an eigenvector, but that isn't its eigenvalue. Divide an entry of ${$("A\\vect{v}")} by the matching nonzero entry of ${$("\\vect{v}")}.` };
      return { ok: true, marks: [true, true] };
    },
    hints: [
      `${$("\\vect{v}")} is an eigenvector of \\(A\\) exactly when ${$("A\\vect{v}")} is a multiple of ${$("\\vect{v}")}: ${$("A\\vect{v} = \\lambda\\vect{v}")} for one number \\(\\lambda\\).`,
      `Divide each entry of ${$("A\\vect{v}")} by the matching entry of ${$("\\vect{v}")} (where that entry isn't 0). ${$("\\vect{v}")} is an eigenvector if every ratio is the same number \\(\\lambda\\) and ${$("A\\vect{v}")} is 0 wherever ${$("\\vect{v}")} is 0.`,
    ],
    worked,
    prereqs: [0],
  };
}

function stepShiftOf(A: FMat, lambda: Fraction, prereqs: number[], title?: string): Step {
  const M = shift(A, lambda);
  return {
    title: title ?? `Write ${$(shiftName(lambda))}`,
    groups: [{ type: "mat", n: A.length, before: $(`${shiftName(lambda)} =`) }],
    answer: M.flat().map(str),
    check: exact(M.flat()),
    hints: [`Subtract ${$(fracTex(lambda))} from each diagonal entry of \\(A\\); the other entries stay the same.`],
    worked: $$(`${shiftName(lambda)} = ${matTex(A)} - ${lt(lambda)}${matTex(A.map((row, i) => row.map((_, j) => F(i === j ? 1 : 0))))} = ${matTex(M)}`),
    prereqs,
  };
}

function detWorked(M: FMat, name: string): string {
  if (M.length === 2) {
    return $$(`\\det(${name}) = ${prodTex(M[0][0], M[1][1])} - ${prodTex(M[0][1], M[1][0])} = ${fracTex(det(M))}`);
  }
  const minor = (j: number) => M.slice(1).map(row => row.filter((_, k) => k !== j));
  const terms = [0, 1, 2].map(j => `${j === 0 ? "" : j === 1 ? " - " : " + "}${parenTex(M[0][j])}${matTex(minor(j)).replace(/bmatrix/g, "vmatrix")}`).join("");
  const values = [0, 1, 2].map(j => `${j === 0 ? "" : j === 1 ? " - " : " + "}${prodTex(M[0][j], det(minor(j)))}`).join("");
  return $$(`\\begin{aligned} \\det(${name}) &= ${terms} \\\\ &= ${values} = ${fracTex(det(M))} \\end{aligned}`);
}

function stepDetOf(A: FMat, lambda: Fraction, prereqs: number[]): Step {
  const M = shift(A, lambda);
  const name = shiftName(lambda);
  return {
    title: `Find ${$(`\\det(${name})`)}`,
    groups: [{ type: "scalar", before: $(`\\det(${name}) =`) }],
    answer: [str(det(M))],
    check: exact([det(M)]),
    hints: A.length === 2
      ? [`For a 2 × 2 matrix, ${$("\\det\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} = ad - bc")}.`]
      : [
        "Use a cofactor expansion, along a row or column with zeros if there is one.",
        `Along the first row: ${$("\\det M = m_{11}\\det M_{11} - m_{12}\\det M_{12} + m_{13}\\det M_{13}")}, where ${$("M_{1j}")} is \\(M\\) without row 1 and column \\(j\\).`,
      ],
    worked: detWorked(M, name),
    prereqs,
  };
}

function stepIsEigenvalue(A: FMat, lambda: Fraction, prereqs: number[]): Step {
  const M = shift(A, lambda);
  const yes = isZero(det(M));
  const lam = fracTex(lambda);
  let worked: string;
  if (yes) {
    const { spaces } = rationalEigen(A);
    const v = spaces.find(s => equals(s.value, lambda))!.basis[0];
    worked = `<p>${$(`\\det(${shiftName(lambda)}) = 0`)}, so ${$(shiftName(lambda))} isn't invertible, and ${$(`(${shiftName(lambda)})\\vect{x} = \\vect{0}`)} has nonzero solutions. So ${$(`\\lambda = ${lam}`)} <strong>is</strong> an eigenvalue of \\(A\\).
      For example, ${$(`\\vect{x} = ${vecTex(v)}`)} has ${$(`A\\vect{x} = ${vecTex(matVec(A, v))} = ${lam}\\vect{x}`)}.</p>`;
  } else {
    worked = `<p>${$(`\\det(${shiftName(lambda)}) = ${fracTex(det(M))} \\neq 0`)}, so ${$(shiftName(lambda))} is invertible, and ${$(`(${shiftName(lambda)})\\vect{x} = \\vect{0}`)} has only the solution ${$("\\vect{x} = \\vect{0}")}. So ${$(`\\lambda = ${lam}`)} is <strong>not</strong> an eigenvalue of \\(A\\).</p>`;
  }
  return {
    title: `Determine whether ${$(`\\lambda = ${lam}`)} is an eigenvalue of \\(A\\)`,
    groups: [{ type: "yesno", before: `${$(lam)} is an eigenvalue of \\(A\\):` }],
    answer: [yes ? "yes" : "no"],
    check(values) {
      const ok = yesNo(values[0]) === (yes ? "yes" : "no");
      return ok ? { ok, marks: [true] } : {
        ok, marks: [false],
        message: `Look at your determinant: \\(\\lambda\\) is an eigenvalue exactly when ${$(`\\det(A - \\lambda I) = 0`)}.`,
      };
    },
    hints: [`\\(\\lambda\\) is an eigenvalue of \\(A\\) exactly when ${$("(A - \\lambda I)\\vect{x} = \\vect{0}")} has a nonzero solution, that is, when ${$("A - \\lambda I")} isn't invertible: ${$("\\det(A - \\lambda I) = 0")}.`],
    worked,
    prereqs,
  };
}

function stepPoly2Of(A: FMat): Step {
  const p = charPoly(A);  // [det, −tr, 1]
  const [[a, b], [c, d]] = A;
  return {
    title: "Find the characteristic polynomial",
    intro: `<p>Enter its coefficients; they can be negative or 0.</p>`,
    groups: [
      { type: "scalar", before: $("\\det(A - \\lambda I) = \\lambda^2 +"), after: $("\\lambda \\;+") },
      { type: "scalar" },
    ],
    answer: [str(p[1]), str(p[0])],
    check: exact([p[1], p[0]]),
    hints: [
      `Subtract \\(\\lambda\\) from the diagonal entries of \\(A\\), then use ${$("\\det\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} = ad - bc")} and expand.`,
      `The coefficient of \\(\\lambda\\) is ${$("-(a_{11} + a_{22})")}, minus the trace of \\(A\\), and the constant term is ${$("\\det A")}.`,
    ],
    worked: $$(`\\det(A - \\lambda I) = \\det ${shiftTex(A)} = ${diagTermTex(a)}${diagTermTex(d)} - ${prodTex(b, c)} = ${polyTex(p)}`),
    prereqs: [],
  };
}

const sub = (k: number, count: number) => (count === 1 ? "" : `_${k + 1}`);

function stepEigenvalues(A: FMat, roots: Fraction[], hints: string[], worked: string, prereqs: number[], title = "Find the eigenvalues"): Step {
  return {
    title,
    intro: roots.length > 1 ? `<p>List them in any order, a repeated eigenvalue as many times as it is a root.</p>` : undefined,
    groups: roots.map((_, k) => ({ type: "scalar" as const, before: $(`\\lambda${sub(k, roots.length)} =`) })),
    answer: roots.map(str),
    check: multiset(roots),
    hints,
    worked,
    prereqs,
  };
}

/** (λ − r₁)(λ − r₂)…, grouping repeated roots as powers. */
function factoredTex(roots: Fraction[], leadingMinus: boolean): string {
  const groups: { r: Fraction; k: number }[] = [];
  for (const r of roots) {
    const last = groups[groups.length - 1];
    if (last && equals(last.r, r)) last.k++;
    else groups.push({ r, k: 1 });
  }
  const factor = (r: Fraction) => (isZero(r) ? "\\lambda" : r.num < 0n ? `(\\lambda + ${fracTex({ num: -r.num, den: r.den })})` : `(\\lambda - ${fracTex(r)})`);
  return `${leadingMinus ? "-" : ""}${groups.map(g => `${factor(g.r)}${g.k > 1 ? `^{${g.k}}` : ""}`).join("")}`;
}

function eigenvectorWorked(A: FMat, lambda: Fraction, name: string, vname: string): string {
  const M = shift(A, lambda);
  const v = rationalEigen(A).spaces.find(s => equals(s.value, lambda))!.basis[0];
  const free = freeVars(M);
  return `<p>For ${$(`${name} = ${fracTex(lambda)}`)}, row reduce ${$(shiftName(lambda))}:</p>${$$(`${shiftName(lambda)} = ${matTex(M)} \\sim ${rrefDisplay(M)}`)}`
    + `<p>The variable ${$(`x_${free[0] + 1}`)} is free. Setting it to a convenient value (and clearing fractions) gives ${$(`${vname} = ${vecTex(v)}`)}.
      Every nonzero multiple of ${$(vname)} is also an eigenvector for ${$(fracTex(lambda))}.</p>`;
}

function stepEigenvector(A: FMat, lambda: Fraction, name: string, vname: string, prereqs: number[], withMatrix: boolean): Step {
  const M = shift(A, lambda);
  const v = rationalEigen(A).spaces.find(s => equals(s.value, lambda))!.basis[0];
  return {
    title: `An eigenvector for ${$(`${name} = ${fracTex(lambda)}`)}`,
    groups: [{ type: "vec", n: A.length, before: $(`${vname} =`) }],
    answer: v.map(str),
    check(values) {
      const x = parseAll(values);
      if (x.some(e => e === null)) return { ok: false };
      const u = x as FVec;
      if (isZeroVec(u)) return { ok: false, marks: u.map(() => false), message: "The zero vector is never an eigenvector: enter a nonzero solution." };
      const r = matVec(M, u);
      if (isZeroVec(r)) return { ok: true, marks: u.map(() => true) };
      return { ok: false, marks: u.map(() => false), message: `This vector isn't an eigenvector for ${$(fracTex(lambda))}: ${$(`(${shiftName(lambda)})${vname} = ${vecTex(r)}`)}, not ${$("\\vect{0}")}.` };
    },
    hints: [
      `Solve ${$(`(${shiftName(lambda)})\\vect{x} = \\vect{0}`)}${withMatrix ? `, where ${$(`${shiftName(lambda)} = ${matTex(M)}`)}` : ""}. Any nonzero solution is an eigenvector.`,
      `Row reducing gives ${$$(`${shiftName(lambda)} = ${matTex(M)} \\sim ${rrefDisplay(M)}.`)} Choose a value for the free variable (such as 1) and solve for the other.`,
    ],
    worked: eigenvectorWorked(A, lambda, name, vname),
    prereqs,
  };
}

function stepDimensionOf(A: FMat, space: Eigenspace, prereqs: number[]): Step {
  const M = shift(A, space.value);
  const n = A.length, k = space.basis.length;
  const lam = fracTex(space.value);
  return {
    title: `The dimension of the eigenspace for ${$(`\\lambda = ${lam}`)}`,
    groups: [{ type: "scalar", before: `${$(`\\dim(\\nullspaceOf{${shiftName(space.value)}}) =`)}` }],
    answer: [`${k}`],
    check: exact([F(k)], `Count the free variables when ${$(shiftName(space.value))} is row reduced.`),
    hints: [
      `The eigenspace for ${$(lam)} is the null space of ${$(shiftName(space.value))}. Its dimension is the number of free variables in ${$(`(${shiftName(space.value)})\\vect{x} = \\vect{0}`)}.`,
      `Row reducing gives ${$$(`${shiftName(space.value)} = ${matTex(M)} \\sim ${rrefDisplay(M)}.`)}`,
    ],
    worked: `${$$(`${shiftName(space.value)} = ${matTex(M)} \\sim ${rrefDisplay(M)}`)}<p>There ${n - k === 1 ? "is 1 pivot" : `are ${n - k} pivots`}, so ${k === 1 ? "1 variable is" : `${k} variables are`} free, and the eigenspace has dimension ${$(`${n} - ${n - k} = ${k}`)}.${space.algebraic > k ? ` That's less than ${space.algebraic}, the number of times ${$(lam)} is a root of the characteristic polynomial.` : ""}</p>`,
    prereqs,
  };
}

function stepBasis(A: FMat, space: Eigenspace, prereqs: number[], first: number): Step {
  const M = shift(A, space.value);
  const k = space.basis.length, n = A.length;
  const lam = fracTex(space.value);
  const names = space.basis.map((_, j) => `\\vect{v}_{${first + j + 1}}`);
  const free = freeVars(M);
  return {
    title: `A basis of the eigenspace for ${$(`\\lambda = ${lam}`)}`,
    groups: space.basis.map((_, j) => ({ type: "vec" as const, n, before: $(`${names[j]} =`) })),
    answer: space.basis.flat().map(str),
    check(values) {
      const x = parseAll(values);
      if (x.some(e => e === null)) return { ok: false };
      const vs = Array.from({ length: k }, (_, j) => (x as FVec).slice(j * n, (j + 1) * n));
      const marks: boolean[] = [];
      let message: string | undefined;
      vs.forEach((u, j) => {
        const inSpace = !isZeroVec(u) && isZeroVec(matVec(M, u));
        for (let i = 0; i < n; i++) marks.push(inSpace);
        if (!inSpace && !message) {
          message = isZeroVec(u) ? `${$(names[j])} is the zero vector, which can't be in a basis.`
            : `${$(names[j])} isn't in the eigenspace: ${$(`(${shiftName(space.value)})${names[j]} = ${vecTex(matVec(M, u))}`)}, not ${$("\\vect{0}")}.`;
        }
      });
      if (message) return { ok: false, marks, message };
      if (rankOf(vs) < k) return { ok: false, marks: marks.map(() => false), message: "Each vector is in the eigenspace, but they are linearly dependent, so they aren't a basis. One is a multiple of the other." };
      return { ok: true, marks };
    },
    hints: [
      `Row reduce ${$(shiftName(space.value))}, write the solutions of ${$(`(${shiftName(space.value)})\\vect{x} = \\vect{0}`)} in parametric form, and take one vector for each free variable.`,
      `Row reducing gives ${$$(`${shiftName(space.value)} = ${matTex(M)} \\sim ${rrefDisplay(M)}.`)} The free ${free.length === 1 ? "variable is" : "variables are"} ${free.map(j => $(`x_${j + 1}`)).join(" and ")}.`,
    ],
    worked: `${$$(`${shiftName(space.value)} = ${matTex(M)} \\sim ${rrefDisplay(M)}`)}<p>The free ${free.length === 1 ? "variable is" : "variables are"} ${free.map(j => $(`x_${j + 1}`)).join(" and ")}.
      ${free.length === 1 ? "Setting it to 1" : "Setting each free variable to 1 and the other to 0"} (and clearing fractions) gives ${space.basis.map((b, j) => $(`${names[j]} = ${vecTex(b)}`)).join(" and ")}.
      ${k === 1 ? "Every eigenvector for this eigenvalue is a nonzero multiple of it." : "Every eigenvector for this eigenvalue is a nonzero combination of these vectors."}</p>`,
    prereqs,
  };
}

function stepDiagonalizable(A: FMat, spaces: Eigenspace[], prereqs: number[]): Step {
  const n = A.length;
  const total = spaces.reduce((s, sp) => s + sp.basis.length, 0);
  const yes = total === n;
  let worked = `<p>The dimensions of the eigenspaces add up to ${$(`${spaces.map(s => s.basis.length).join(" + ")} = ${total}`)}`;
  if (yes) {
    const P = spaces.flatMap(s => s.basis);
    const D = spaces.flatMap(s => s.basis.map(() => s.value));
    const Pm = P[0].map((_, i) => P.map(col => col[i]));
    const Dm = D.map((x, i) => D.map((_, j) => (i === j ? x : F(0))));
    worked += `, which is ${n}, so \\(A\\) has ${n} linearly independent eigenvectors and <strong>is</strong> diagonalizable: ${$$(`A = PDP^{-1}, \\quad P = ${matTex(Pm)}, \\quad D = ${matTex(Dm)}.`)}</p>`;
  } else {
    worked += `, which is less than ${n}, so \\(A\\) doesn't have ${n} linearly independent eigenvectors: it is <strong>not</strong> diagonalizable.</p>`;
  }
  return {
    title: `Determine whether \\(A\\) is diagonalizable`,
    groups: [{ type: "yesno", before: "\\(A\\) is diagonalizable:" }],
    answer: [yes ? "yes" : "no"],
    check(values) {
      const ok = yesNo(values[0]) === (yes ? "yes" : "no");
      return ok ? { ok, marks: [true] } : { ok, marks: [false], message: "Add up the dimensions of the eigenspaces and compare the total with the size of \\(A\\)." };
    },
    hints: [`An ${$(`${n} \\times ${n}`)} matrix is diagonalizable exactly when it has ${n} linearly independent eigenvectors: when the dimensions of its eigenspaces add up to ${n}.`],
    worked,
    prereqs,
  };
}

function stepComplex(A: FMat): Step {
  const e = eigen2(A);
  const re = e.roots[0].a, im = e.half;  // λ = re ± im·i (r = −1 for practice problems)
  return {
    title: "Find the complex eigenvalues",
    groups: [
      { type: "scalar", before: $("\\lambda ="), after: $("\\pm") },
      { type: "scalar", after: $("i") },
    ],
    answer: [str(re), str(im)],
    check(values) {
      const [a, b] = parseAll(values);
      const markA = a !== null && equals(a, re);
      const markB = b !== null && (equals(b, im) || equals(b, { num: -im.num, den: im.den }));
      return { ok: markA && markB, marks: [markA, markB], message: markA && markB ? undefined : "Use the quadratic formula on your characteristic polynomial, with \\(\\sqrt{-k} = i\\sqrt{k}\\)." };
    },
    hints: [
      `Use the quadratic formula on ${$("\\lambda^2 + b\\lambda + c = 0")}: ${$("\\lambda = (-b \\pm \\sqrt{b^2 - 4c})/2")}. The discriminant is negative here.`,
      `The square root of a negative number is imaginary: ${$("\\sqrt{-16} = 4i")}. The discriminant is ${$(fracTex(e.disc))}.`,
    ],
    worked: $$(`\\lambda = \\frac{${fracTex(e.t)} \\pm \\sqrt{${parenTex(e.t)}^2 - 4 \\cdot ${parenTex(e.d)}}}{2} = \\frac{${fracTex(e.t)} \\pm \\sqrt{${fracTex(e.disc)}}}{2} = ${surdTex({ ...e.roots[0], b: e.half }, true)}`)
      + `<p>The eigenvalues are ${$(`\\lambda_1 = ${surdTex(e.roots[0])}`)} and ${$(`\\lambda_2 = ${surdTex(e.roots[1])}`)}, complex conjugates. \\(A\\) has no real eigenvectors: it turns every nonzero vector of the plane.</p>`,
    prereqs: [0],
  };
}

// With partial support, the page works these routine calculations.
const partial = (step: Step): Step => ({ ...step, given: 2 });
const stepAv = (...a: Parameters<typeof stepAvOf>) => partial(stepAvOf(...a));
const stepShift = (...a: Parameters<typeof stepShiftOf>) => partial(stepShiftOf(...a));
const stepDet = (...a: Parameters<typeof stepDetOf>) => partial(stepDetOf(...a));
const stepPoly2 = (...a: Parameters<typeof stepPoly2Of>) => partial(stepPoly2Of(...a));
const stepDimension = (...a: Parameters<typeof stepDimensionOf>) => partial(stepDimensionOf(...a));

// ⋘──────── Problems ────────⋙

function statementHtml(p: Problem): string {
  const A = `A = ${matTex(p.A)}`;
  switch (p.kind) {
    case "evec":
      return `<p>Let ${$$(`${A}, \\qquad \\vect{v} = ${vecTex(p.v!)}.`)} Determine whether ${$("\\vect{v}")} is an eigenvector of \\(A\\). If it is, find its eigenvalue.</p>`;
    case "evalcheck":
      return `<p>Determine whether ${$(`\\lambda = ${fracTex(p.lambda!)}`)} is an eigenvalue of the matrix ${$$(`${A}.`)}</p>`;
    case "tri":
      return `<p>Find the eigenvalues of the triangular matrix ${$$(`${A}.`)}</p>`;
    case "poly2":
      return `<p>Find the characteristic polynomial and the eigenvalues of ${$$(`${A}.`)}</p>`;
    case "vecs2": {
      const roots = rationalEigen(p.A).roots;
      return `<p>The matrix ${$$(A)} has the eigenvalues ${$(`\\lambda_1 = ${fracTex(roots[0])}`)} and ${$(`\\lambda_2 = ${fracTex(roots[1])}`)}. Find an eigenvector for each eigenvalue.</p>`;
    }
    case "full2":
      return `<p>Find the eigenvalues of ${$$(A)} and an eigenvector for each eigenvalue.</p>`;
    case "repeated2":
      return `<p>The matrix ${$$(A)} has only one eigenvalue. Find it, find a basis of its eigenspace, and decide whether \\(A\\) is diagonalizable.</p>`;
    case "complex2":
      return `<p>Find the eigenvalues of ${$$(`${A}.`)}</p>`;
    case "eig3":
      return `<p>The matrix ${$$(A)} has the characteristic polynomial ${$$(`\\det(A - \\lambda I) = ${polyTex(charPoly(p.A))}.`)}
        Find the eigenvalues of \\(A\\), a basis of each eigenspace, and whether \\(A\\) is diagonalizable.</p>`;
  }
}

export function buildSteps(p: Problem): Step[] {
  const A = p.A;
  // What each step uses, from the problem and from earlier steps (whose answers are found by the
  // time the step appears), so the student doesn't have to scroll back.
  const problem = "the problem";
  const stepN = (k: number) => `step ${k + 1}`;
  const uA: Use = { from: problem, tex: `A = ${matTex(A)}` };
  const uPoly = (from: string): Use => ({ from, tex: `\\det(A - \\lambda I) = ${polyTex(charPoly(A))}` });
  const uShift = (lambda: Fraction, from: string): Use => ({ from, tex: `${shiftName(lambda)} = ${matTex(shift(A, lambda))}` });
  const uLambda = (name: string, lambda: Fraction, from: string): Use => ({ from, tex: `${name} = ${fracTex(lambda)}` });
  const uDim = (space: Eigenspace, from: string): Use => ({ from, tex: `\\dim(\\nullspaceOf{${shiftName(space.value)}}) = ${space.basis.length}` });
  const steps = buildBareSteps(p);
  const uses = usesFor(p, steps.length, { problem, stepN, uA, uPoly, uShift, uLambda, uDim });
  // The answers (entered at the last level, by hand) are the main steps: every step but the routine
  // calculations that the page works at partial support (`partial`), such as A − λI and det(A − λI).
  return steps.map((s, k) => ({ ...s, final: s.final ?? (s.given ?? 1) < 2, ...(uses[k]?.length ? { uses: uses[k] } : {}) }));
}

interface Use { from: string; tex: string }

/** The steps (0-based) that a use comes from, such as 1 for "the problem and step 2". */
const useSteps = (u: Use) => [...u.from.matchAll(/step (\d+)/g)].map(match => Number(match[1]) - 1);

/** The uses, grouped by where they come from: "From step 1:" and a display of them. */
function usesHtml(uses: Use[]): string {
  const groups: Use[][] = [];
  for (const u of uses) {
    const g = groups[groups.length - 1];
    if (g && g[0].from === u.from) g.push(u);
    else groups.push([u]);
  }
  return groups.map(g => `<div class="ev-uses-group"><p class="ev-uses-title">From ${g[0].from}:</p>${$$(`${g.map(u => u.tex).join(", \\qquad ")}`)}</div>`).join("");
}

interface UseMakers {
  problem: string;
  stepN: (k: number) => string;
  uA: Use;
  uPoly: (from: string) => Use;
  uShift: (lambda: Fraction, from: string) => Use;
  uLambda: (name: string, lambda: Fraction, from: string) => Use;
  uDim: (space: Eigenspace, from: string) => Use;
}

/** For each step of a problem, the information it uses. */
function usesFor(p: Problem, count: number, m: UseMakers): Use[][] {
  const A = p.A;
  const { roots, spaces } = rationalEigen(A);
  const { problem, stepN, uA, uPoly, uShift, uLambda, uDim } = m;
  switch (p.kind) {
    case "evec": {
      const uV: Use = { from: problem, tex: `\\vect{v} = ${vecTex(p.v!)}` };
      return [[uA, uV], [uV, { from: stepN(0), tex: `A\\vect{v} = ${vecTex(matVec(A, p.v!))}` }]];
    }
    case "evalcheck": {
      const uL: Use = { from: problem, tex: `\\lambda = ${fracTex(p.lambda!)}` };
      return [
        [uA, uL],
        [uShift(p.lambda!, stepN(0))],
        [uL, { from: stepN(1), tex: `\\det(${shiftName(p.lambda!)}) = ${fracTex(det(shift(A, p.lambda!)))}` }],
      ];
    }
    case "tri":
      return [[uA]];
    case "poly2":
    case "complex2":
      return [[uA], [uPoly(stepN(0))]];
    case "vecs2":
      return [
        [uA, uLambda("\\lambda_1", roots[0], problem)],
        [uLambda("\\lambda_1", roots[0], problem), uShift(roots[0], stepN(0))],
        [uA, uLambda("\\lambda_2", roots[1], problem)],
        [uLambda("\\lambda_2", roots[1], problem), uShift(roots[1], stepN(2))],
      ];
    case "full2":
      return [
        [uA],
        [uPoly(stepN(0))],
        [uA, uLambda("\\lambda_1", roots[0], stepN(1))],
        [uA, uLambda("\\lambda_2", roots[1], stepN(1))],
      ];
    case "repeated2": {
      const space = spaces[0];
      return [
        [uA],
        [uPoly(stepN(0))],
        [uA, uLambda("\\lambda", roots[0], stepN(1))],
        [uShift(roots[0], problem + " and " + stepN(1)), uDim(space, stepN(2))],
        [{ from: problem, tex: "A \\text{ is } 2 \\times 2" }, uDim(space, stepN(2))],
      ];
    }
    case "eig3": {
      const out: Use[][] = [[uA, uPoly(problem)]];
      const dimSteps: number[] = [];
      for (const space of spaces) {
        out.push([uA, uLambda("\\lambda", space.value, stepN(0))]);
        dimSteps.push(out.length - 1);
        out.push([uShift(space.value, problem + " and " + stepN(0)), uDim(space, stepN(out.length - 1))]);
      }
      out.push([{ from: problem, tex: "A \\text{ is } 3 \\times 3" }, ...spaces.map((s, k) => uDim(s, stepN(dimSteps[k])))]);
      return out.slice(0, count);
    }
  }
}

function buildBareSteps(p: Problem): Step[] {
  const A = p.A;
  const { roots, spaces } = rationalEigen(A);
  const eigenvaluesFrom2 = (prereqs: number[]) => stepEigenvalues(A, roots,
    [
      `The eigenvalues are the roots of ${$("\\det(A - \\lambda I) = 0")}. Factor the characteristic polynomial, or use the quadratic formula.`,
      `To factor it as ${$("(\\lambda - r)(\\lambda - s)")}, find two numbers \\(r\\) and \\(s\\) whose product is ${$(`\\det A = ${fracTex(det(A))}`)} and whose sum is ${$(`\\operatorname{tr} A = ${fracTex(trace(A))}`)}.`,
    ],
    $$(`${polyTex(charPoly(A))} = ${factoredTex(roots, false)} = 0`) + `<p>so the eigenvalue${roots.length === 1 || equals(roots[0], roots[roots.length - 1]) ? " is" : "s are"} ${roots.map((r, k) => $(`\\lambda${sub(k, roots.length)} = ${fracTex(r)}`)).join(" and ")}.</p>`,
    prereqs);
  switch (p.kind) {
    case "evec":
      return [stepAv(A, p.v!), stepIsEigenvector(A, p.v!)];
    case "evalcheck":
      return [stepShift(A, p.lambda!, []), stepDet(A, p.lambda!, [0]), stepIsEigenvalue(A, p.lambda!, [1])];
    case "tri": {
      const diag = A.map((row, i) => row[i]);
      return [stepEigenvalues(A, roots,
        [
          `${$("A - \\lambda I")} is triangular too, and the determinant of a triangular matrix is the product of its diagonal entries.`,
          `So ${$(`\\det(A - \\lambda I) = ${diag.map(d => `(${fracTex(d)} - \\lambda)`).join("")}`)}.`,
        ],
        $$(`\\det(A - \\lambda I) = ${diag.map(d => `(${fracTex(d)} - \\lambda)`).join("")} = 0`)
          + `<p>The eigenvalues are the diagonal entries: ${roots.map(r => $(fracTex(r))).join(", ")}.</p>`,
        [])];
    }
    case "poly2":
      return [stepPoly2(A), eigenvaluesFrom2([0])];
    case "vecs2":
      return [
        stepShift(A, roots[0], [], `Write ${$(`A - \\lambda_1 I`)}`),
        stepEigenvector(A, roots[0], "\\lambda_1", "\\vect{v}_1", [0], false),
        stepShift(A, roots[1], [], `Write ${$(`A - \\lambda_2 I`)}`),
        stepEigenvector(A, roots[1], "\\lambda_2", "\\vect{v}_2", [2], false),
      ];
    case "full2":
      return [
        stepPoly2(A),
        eigenvaluesFrom2([0]),
        stepEigenvector(A, roots[0], "\\lambda_1", "\\vect{v}_1", [1], true),
        stepEigenvector(A, roots[1], "\\lambda_2", "\\vect{v}_2", [1], true),
      ];
    case "repeated2": {
      const space = spaces[0];
      return [
        stepPoly2(A),
        stepEigenvalues(A, [roots[0]],
          [`Set ${$("\\det(A - \\lambda I) = 0")}. The polynomial is a perfect square, ${$("(\\lambda - r)^2")}.`],
          $$(`${polyTex(charPoly(A))} = ${factoredTex(roots, false)} = 0`) + `<p>so ${$(`\\lambda = ${fracTex(roots[0])}`)}, a double root.</p>`,
          [0], "Find the eigenvalue"),
        stepDimension(A, space, [1]),
        stepBasis(A, space, [2], 0),
        stepDiagonalizable(A, spaces, [2]),
      ];
    }
    case "complex2":
      return [stepPoly2(A), stepComplex(A)];
    case "eig3": {
      const steps: Step[] = [stepEigenvalues(A, roots,
        [
          "Factor the characteristic polynomial. Try small integers that divide the constant term: an integer root \\(r\\) makes the polynomial 0.",
          `Once you find a root \\(r\\), divide by ${$("(\\lambda - r)")} and factor the quadratic that's left.`,
        ],
        $$(`${polyTex(charPoly(A))} = ${factoredTex(roots, true)}`) + `<p>so the eigenvalues are ${roots.map(r => $(fracTex(r))).join(", ")}.</p>`,
        [])];
      const dims: number[] = [];
      let first = 0;
      for (const space of spaces) {
        steps.push(stepDimension(A, space, [0]));
        dims.push(steps.length - 1);
        steps.push(stepBasis(A, space, [steps.length - 1], first));
        first += space.basis.length;
      }
      steps.push(stepDiagonalizable(A, spaces, dims));
      return steps;
    }
  }
}

// ⋘──────── The page ────────⋙

type Status = "" | "right" | "shown";
interface Work {
  problem: string;
  entries: string[][];
  status: Status[];
  hintLevel: number[];
  hintsUsed: number;
  wrongChecks: number;
  wrongSeen: string[][];
}

export interface PracticeHooks {
  onLoad: (p: Problem, mode: "path" | "custom") => void;
  onStatus: (status: { finished: boolean }) => void;
}

export function setupPracticePage(hooks: PracticeHooks): void {
  const statement = byId<HTMLDivElement>("ev-statement");
  const stepsBox = byId<HTMLDivElement>("ev-steps");
  const hintCount = byId<HTMLSpanElement>("ev-hint-count");
  const doneBox = byId<HTMLDivElement>("ev-done");
  const doneText = byId<HTMLElement>("ev-done-text");
  const doneSuggest = byId<HTMLParagraphElement>("ev-done-suggest");
  const doneSuggestText = byId<HTMLSpanElement>("ev-done-suggest-text");
  const doneNextLevel = byId<HTMLButtonElement>("ev-done-next-level");
  const kindSelect = byId<HTMLSelectElement>("ev-kind");
  let doneSuggestAction: () => void = () => undefined;

  const savedSettings = loadJSON<{ kind?: string; level?: number }>(SETTINGS_KEY) ?? {};
  if (savedSettings.kind && KINDS.includes(savedSettings.kind as Kind)) kindSelect.value = savedSettings.kind;
  const saveSettings = () => saveJSON(SETTINGS_KEY, { kind: kindSelect.value, level });

  // ⋘──────── Support ────────⋙
  let level = Number.isInteger(savedSettings.level) && savedSettings.level! >= 1 && savedSettings.level! <= SUPPORT_NAMES.length
    ? savedSettings.level! : 2;
  const box = byId<HTMLDivElement>("ev-practice");
  const levelRadios = SUPPORT_NAMES.map((name, i) => {
    const radio = element("input");
    radio.type = "radio";
    radio.name = "ev-support";
    radio.value = `${i + 1}`;
    radio.checked = i + 1 === level;
    radio.addEventListener("change", () => {
      level = i + 1;
      saveSettings();
      renderSteps();
      practice.levelChanged();
    });
    return radio;
  });
  {
    const row = element("div", "pr-levels");
    const label = element("span", "pr-levels-label");
    const text = element("span", "", "Support");
    text.dataset.help = "#ev-help-support";
    label.append(text);
    const list = element("span", "pr-level-list");
    list.setAttribute("role", "radiogroup");
    list.setAttribute("aria-label", "Support");
    levelRadios.forEach((radio, i) => {
      const item = element("label", "pr-level");
      item.append(radio, element("span", "pr-pill", SUPPORT_NAMES[i]), element("span", "", SUPPORT_DESCRIPTIONS[i]));
      list.append(item);
    });
    row.append(label, list);
    box.append(element("hr", "pr-divider"), row);
  }

  const practice = setupPractice({
    key: "eigenvalues",
    stages: STAGES,
    cleanToAdvanceStage: CLEAN_TO_ADVANCE_STAGE,
    levels: {
      count: SUPPORT_NAMES.length,
      names: SUPPORT_NAMES,
      cleanToAdvance: 2,
      current: () => level,
      set: (lv: number) => {
        level = lv;
        levelRadios.forEach(r => { r.checked = Number(r.value) === lv; });
        saveSettings();
      },
    },
    box,
    customControls: [byId<HTMLDivElement>("ev-custom-controls")],
    progress: byId<HTMLElement>("ev-progress"),
    newProblem: () => newProblem(),
    helpText: "Guided Learning is a series of levels, from easy to hard: checking a given vector or number, then finding eigenvalues, eigenvectors, and eigenspaces. Each level gives a new random problem of its kind each time. After two problems at a level with no hints, the page suggests the next level. To pick the kind of problem yourself, choose “Design your own problems” instead.",
  });

  // ⋘──────── State ────────⋙
  let problem!: Problem;
  let steps: Step[] = [];
  let work!: Work;
  let inputs: HTMLInputElement[][] = [];
  let cards: HTMLElement[] = [];
  let feedbacks: HTMLDivElement[] = [];
  let hintBoxes: HTMLDivElement[] = [];
  let workedBoxes: HTMLDivElement[] = [];
  let checkButtons: HTMLButtonElement[] = [];
  let actionRows: HTMLDivElement[] = [];
  let yesNoBoxes: { box: HTMLElement; input: HTMLInputElement; radios: HTMLInputElement[] }[][] = [];
  let moreNote: HTMLParagraphElement;

  const saveWork = () => {
    const all = loadJSON<Record<string, Work>>(WORKS_KEY) ?? {};
    delete all[work.problem];
    all[work.problem] = work;
    const keys = Object.keys(all);
    for (const k of keys.slice(0, Math.max(0, keys.length - 40))) delete all[k];
    saveJSON(WORKS_KEY, all);
  };

  // At the last level, the student works on paper and enters only the answers.
  const byHand = () => level === SUPPORT_NAMES.length;
  // A step that isn't an answer, hidden at the last level until the answers are finished.
  const hiddenByHand = (s: number) => byHand() && !steps[s].final;
  // A step the page works at this support level: filled in, with its worked solution.
  const given = (s: number) => level <= (steps[s].given ?? 1) || hiddenByHand(s);
  // A step the page works is done once the steps it uses are (so it waits for a step the student
  // works, such as Aᵀ before AᵀA, and the steps after it wait too).
  const isDone = (s: number): boolean => work.status[s] !== "" || (given(s) && steps[s].prereqs.every(isDone));
  const unlocked = (s: number) => steps[s].prereqs.every(isDone);

  // ⋘──────── Building the steps ────────⋙
  function entryInput(label: string, s: number): HTMLInputElement {
    const input = element("input", "ev-entry");
    input.type = "text";
    input.inputMode = "decimal";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("aria-label", label);
    input.addEventListener("input", () => {
      input.classList.remove("ev-wrong", "ev-right");
      work.entries[s] = inputs[s].map(i => i.value);
      saveWork();
      updateButtons(s);
    });
    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && !checkButtons[s].disabled) check(s);
    });
    return input;
  }

  function buildGroup(g: Group, s: number, gi: number): HTMLElement {
    const wrap = element("span", "ev-entry-group");
    if (g.before) wrap.append(element("span", "ev-entry-label", g.before));
    const plain = (html: string) => html.replace(/\\\(|\\\)|\\vect\{(\w)\}|\\/g, (_m, v) => v ?? "");
    const label = plain(g.before ?? steps[s].title);
    if (g.type === "scalar") {
      const input = entryInput(label || "Answer", s);
      input.dataset.group = `${gi}`;
      inputs[s].push(input);
      wrap.append(input);
      if (g.after) wrap.append(element("span", "ev-entry-label", g.after));
    } else if (g.type === "vec" || g.type === "mat") {
      const n = g.n, cols = g.type === "vec" ? 1 : n;
      const bracket = element("span", "ev-bracket");
      bracket.style.gridTemplateColumns = `repeat(${cols}, auto)`;
      for (let k = 0; k < (g.type === "vec" ? n : n * n); k++) {
        const name = g.type === "vec" ? `entry ${k + 1}` : `row ${Math.floor(k / n) + 1}, column ${(k % n) + 1}`;
        const input = entryInput(`${label}, ${name}`, s);
        input.dataset.group = `${gi}`;
        inputs[s].push(input);
        bracket.append(input);
      }
      wrap.append(bracket);
    } else {
      // Yes/No: a hidden input holds the answer, set by two radio buttons styled as a pill.
      const box = element("span", "ev-yes-no");
      box.setAttribute("role", "radiogroup");
      box.setAttribute("aria-label", plain(g.before ?? "Yes or no"));
      const input = element("input");
      input.type = "hidden";
      input.dataset.group = `${gi}`;
      inputs[s].push(input);
      const name = `ev-yn-${s}-${gi}`;
      const radios = (["yes", "no"] as const).map(value => {
        const option = element("label", "ev-yn-option");
        const radio = element("input");
        radio.type = "radio";
        radio.name = name;
        radio.value = value;
        radio.addEventListener("change", () => {
          input.value = value;
          box.classList.remove("ev-wrong", "ev-right");
          work.entries[s] = inputs[s].map(i => i.value);
          saveWork();
          updateButtons(s);
        });
        option.append(radio, element("span", "", value === "yes" ? "Yes" : "No"));
        box.append(option);
        return radio;
      });
      yesNoBoxes[s].push({ box, input, radios });
      wrap.append(box, input);
    }
    return wrap;
  }

  const syncYesNo = (s: number) => {
    for (const { input, radios } of yesNoBoxes[s]) radios.forEach(r => { r.checked = r.value === input.value; });
  };

  function renderSteps(): void {
    stepsBox.innerHTML = "";
    inputs = steps.map(() => []);
    yesNoBoxes = steps.map(() => []);
    cards = []; feedbacks = []; hintBoxes = []; workedBoxes = []; checkButtons = []; actionRows = [];
    steps.forEach((step, s) => {
      const card = element("section", "ev-step");
      card.append(element("h4", "", `Step ${s + 1}. ${step.title}`));
      // By hand, a step uses nothing from the hidden steps: the student found those values on paper.
      const uses = (step.uses ?? []).filter(u => !useSteps(u).some(hiddenByHand));
      if (uses.length) card.append(element("div", "ev-uses", usesHtml(uses)));
      if (step.intro) card.append(element("div", "ev-step-intro", step.intro));
      const entries = element("div", "ev-entries");
      step.groups.forEach((g, gi) => entries.append(buildGroup(g, s, gi)));
      card.append(entries);
      const actions = element("div", "ev-step-actions");
      const checkButton = element("button", "ev-primary", "Check");
      checkButton.type = "button";
      checkButton.addEventListener("click", () => check(s));
      const hintButton = element("button", "ev-hint-button", "Hint");
      hintButton.type = "button";
      hintButton.addEventListener("click", () => hint(s));
      const showButton = element("button", "", "Show");
      showButton.type = "button";
      showButton.title = "Fill in the answer (counts as a hint)";
      showButton.addEventListener("click", () => show(s));
      actions.append(checkButton, hintButton, showButton);
      card.append(actions);
      const hintBox = element("div", "ev-hint-box");
      hintBox.hidden = true;
      const feedback = element("div", "ev-feedback");
      feedback.setAttribute("role", "status");
      const worked = element("div", "ev-worked");
      card.append(hintBox, feedback, worked);
      stepsBox.append(card);
      cards.push(card); feedbacks.push(feedback); hintBoxes.push(hintBox); workedBoxes.push(worked);
      checkButtons.push(checkButton); actionRows.push(actions);
    });
    moreNote = element("p", "ev-more-steps", "More steps appear as you finish the steps above.");
    stepsBox.append(moreNote);
    if (byHand()) {
      stepsBox.prepend(element("p", "ev-by-hand-note",
        byHandNote(steps.map((_, s) => s).filter(hiddenByHand))));
    }
    // Restore saved entries and marks, and fill in the steps the page works.
    steps.forEach((step, s) => {
      if (given(s)) {
        inputs[s].forEach((input, i) => { input.value = step.answer[i] ?? ""; });
        syncYesNo(s);
        cards[s].classList.add("ev-step-given");
        actionRows[s].hidden = true;
        feedbacks[s].innerHTML = `<p class="ev-feedback-note">Worked by the page.</p>`;
        return;
      }
      inputs[s].forEach((input, i) => { input.value = work.entries[s]?.[i] ?? ""; });
      syncYesNo(s);
      if (work.status[s]) mark(s, work.status[s] === "right" ? "ev-right" : "ev-shown");
      if (work.hintLevel[s] > 0) renderHint(s);
    });
    update();
    void typeset([stepsBox]);  // Also when the steps are rebuilt for another support level
  }

  // ⋘──────── Marks, buttons, and visibility ────────⋙
  function clearMarks(s: number): void {
    inputs[s].forEach(i => i.classList.remove("ev-right", "ev-wrong", "ev-shown"));
    yesNoBoxes[s].forEach(y => y.box.classList.remove("ev-right", "ev-wrong", "ev-shown"));
  }

  /** Marks every box of a step, or each box by `marks`. */
  function mark(s: number, cls: string, marks?: (boolean | null)[]): void {
    clearMarks(s);
    const yn = new Map(yesNoBoxes[s].map(y => [y.input, y.box]));
    inputs[s].forEach((input, i) => {
      const m = marks ? marks[i] : true;
      if (m === null || m === undefined) return;
      const c = marks ? (m ? "ev-right" : "ev-wrong") : cls;
      (yn.get(input) ?? input).classList.add(c);
    });
  }

  /** The boxes that must be filled for Check: all, except an eigenvalue box after "No". */
  function required(s: number): HTMLInputElement[] {
    const yes = yesNoBoxes[s][0]?.input.value === "yes";
    return inputs[s].filter(input => {
      const g = steps[s].groups[Number(input.dataset.group)];
      return !(g.type === "scalar" && g.whenYes && !yes);
    });
  }

  function updateButtons(s: number): void {
    const done = isDone(s);
    const filled = required(s).every(i => i.value.trim() !== "");
    checkButtons[s].disabled = done || !filled;
    for (const b of actionRows[s].querySelectorAll("button")) if (b !== checkButtons[s]) (b as HTMLButtonElement).disabled = done;
    // Hint says "Next hint" while more hints are left, and is disabled once none are.
    const hintButton = actionRows[s].querySelector<HTMLButtonElement>(".ev-hint-button");
    if (hintButton) {
      const left = work.hintLevel[s] < steps[s].hints.length;
      hintButton.textContent = work.hintLevel[s] > 0 && left ? "Next hint" : "Hint";
      hintButton.disabled = done || !left;
      hintButton.title = !done && !left ? "No more hints for this step" : "";
    }
    // The eigenvalue box beside a Yes/No question is for "Yes" only.
    const yes = yesNoBoxes[s][0]?.input.value === "yes";
    inputs[s].forEach(input => {
      const g = steps[s].groups[Number(input.dataset.group)];
      input.disabled = done || (g.type === "scalar" && !!g.whenYes && !yes);
    });
    yesNoBoxes[s].forEach(y => y.radios.forEach(r => { r.disabled = done; }));
  }

  function update(answered = false): void {
    const changed: Element[] = [];
    let anyHidden = false;
    // By hand, the steps that aren't answers appear (worked) once the answers are finished.
    const answersDone = steps.every((_, s) => isDone(s));
    // The current step: the first one that the student still works.
    const current = steps.findIndex((_, s) => !isDone(s) && (hiddenByHand(s) ? answersDone : unlocked(s)));
    steps.forEach((step, s) => {
      const visible = hiddenByHand(s) ? answersDone : unlocked(s);
      cards[s].classList.toggle("ev-step-current", s === current);
      if (!visible && !hiddenByHand(s)) anyHidden = true;
      cards[s].hidden = !visible;
      cards[s].classList.toggle("ev-step-right", work.status[s] === "right");
      cards[s].classList.toggle("ev-step-shown", work.status[s] === "shown");
      const html = isDone(s) ? step.worked : "";
      if (workedBoxes[s].dataset.html !== html) {
        workedBoxes[s].dataset.html = html;
        workedBoxes[s].innerHTML = html;
        changed.push(workedBoxes[s]);
      }
      updateButtons(s);
    });
    moreNote.hidden = !anyHidden;
    if (changed.length) void typeset(changed);
    const wrong = work.wrongChecks;
    hintCount.textContent = work.hintsUsed === 0 ? "No hints used"
      : `Hints used: ${work.hintsUsed}${wrong > 0 ? ` (including ${wrong} wrong check${wrong === 1 ? "" : "s"})` : ""}`;
    const finished = steps.every((_, s) => isDone(s));
    const workedExample = finished && !byHand() && steps.every((_, s) => given(s));
    doneBox.hidden = !finished;
    let next: { text: string; label: string; action: () => void } | null = null;
    if (workedExample) {
      doneText.textContent = "A worked example: the page did every step. Read each one, then try the next problem.";
      next = { text: "Ready to work some steps yourself?", label: "Try partial support", action: () => practice.goToLevel(2) };
    } else if (finished) {
      const mine = steps.map((_, s) => s).filter(s => !given(s));
      const allRight = mine.every(s => work.status[s] === "right");
      doneText.textContent = allRight
        ? work.hintsUsed === 0 ? "Every step is right, with no hints!" : `Every step is right (hints used: ${work.hintsUsed}).`
        : "All steps are finished. Try another problem to get them right on your own.";
      practice.record(work.problem, work.hintsUsed, allRight && work.hintsUsed === 0, answered);
      next = practice.suggestion();
    }
    hooks.onStatus({ finished });
    doneSuggest.hidden = next === null;
    if (next) {
      doneSuggestText.textContent = next.text;
      doneNextLevel.textContent = next.label;
      doneSuggestAction = next.action;
    }
  }

  // ⋘──────── Check, Hint, Show ────────⋙
  function check(s: number): void {
    if (isDone(s)) return;
    const values = inputs[s].map(i => i.value.trim());
    // Entries that aren't numbers are marked without counting as a wrong check.
    const bad = inputs[s].filter((input, i) => input.type !== "hidden" && !input.disabled && values[i] !== "" && parseEntry(values[i]) === null);
    if (bad.length > 0) {
      bad.forEach(i => i.classList.add("ev-wrong"));
      feedbacks[s].innerHTML = `<p class="ev-feedback-wrong">Enter numbers like <code>-3</code>, <code>0.5</code>, or <code>1/2</code>.</p>`;
      return;
    }
    const verdict = steps[s].check(values);
    if (verdict.ok) {
      work.status[s] = "right";
      mark(s, "ev-right");
      feedbacks[s].innerHTML = `<p class="ev-feedback-right">Right!</p>`;
    } else {
      const key = values.join("|");
      work.wrongSeen[s] = work.wrongSeen[s] ?? [];
      if (!work.wrongSeen[s].includes(key)) {
        work.wrongSeen[s].push(key);
        work.hintsUsed++;
        work.wrongChecks++;
      }
      if (verdict.marks) mark(s, "", verdict.marks);
      else mark(s, "ev-wrong");
      feedbacks[s].innerHTML = `<p class="ev-feedback-wrong">Not quite.</p>${verdict.message ? `<p class="ev-feedback-note">${verdict.message}</p>` : ""}`;
      void typeset([feedbacks[s]]);
    }
    saveWork();
    update(verdict.ok);
    if (verdict.ok) focusNext(s);
  }

  // After a right answer, the first box of the next open step.
  function focusNext(s: number): void {
    for (let t = s + 1; t < steps.length; t++) {
      if (!isDone(t) && unlocked(t)) {
        const first = inputs[t].find(i => i.type !== "hidden" && !i.disabled);
        (first ?? yesNoBoxes[t][0]?.radios[0])?.focus({ preventScroll: true });
        return;
      }
    }
  }

  function renderHint(s: number): void {
    const level = Math.min(work.hintLevel[s], steps[s].hints.length);
    hintBoxes[s].hidden = level === 0;
    hintBoxes[s].innerHTML = steps[s].hints.slice(0, level).map(h => `<p>${h}</p>`).join("");
    void typeset([hintBoxes[s]]);
  }

  function hint(s: number): void {
    if (work.hintLevel[s] < steps[s].hints.length) {
      work.hintLevel[s]++;
      work.hintsUsed++;
      saveWork();
    }
    renderHint(s);
    update();
  }

  function show(s: number): void {
    if (isDone(s)) return;
    work.entries[s] = [...steps[s].answer];
    inputs[s].forEach((input, i) => { input.value = steps[s].answer[i] ?? ""; });
    syncYesNo(s);
    work.status[s] = "shown";
    work.hintsUsed++;
    mark(s, "ev-shown");
    feedbacks[s].innerHTML = `<p class="ev-feedback-note">The answer is filled in${steps[s].answer.length > 1 && steps[s].groups.some(g => g.type === "vec") ? " (other nonzero multiples are right too)" : ""}.</p>`;
    saveWork();
    update(true);
  }

  // ⋘──────── Loading problems ────────⋙
  const seen: string[] = [];
  let seenIndex = -1;
  const prevButton = byId<HTMLButtonElement>("ev-prev");
  const nextButton = byId<HTMLButtonElement>("ev-next");
  const updateNav = () => { prevButton.disabled = seenIndex <= 0; };

  function load(p: Problem, restore: boolean, fromStage: number | null, remember = true): void {
    problem = p;
    practice.setProblemStage(fromStage);
    steps = buildSteps(p);
    const code = encodeProblem(p);
    const query = `${code}${fromStage === null ? "" : `&st=${fromStage + 1}`}`;
    history.replaceState(null, "", `${location.pathname}?${query}${location.hash}`);
    if (remember) {
      seen.splice(seenIndex + 1);
      seen.push(query);
      seenIndex = seen.length - 1;
      updateNav();
    }
    const saved = (loadJSON<Record<string, Work>>(WORKS_KEY) ?? {})[code];
    work = restore && saved && saved.problem === code && Array.isArray(saved.entries) && saved.status?.length === steps.length
      ? { ...saved, wrongSeen: saved.wrongSeen ?? steps.map(() => []), wrongChecks: saved.wrongChecks ?? 0 }
      : {
        problem: code, entries: steps.map(() => []), status: steps.map(() => "" as Status), hintLevel: steps.map(() => 0),
        hintsUsed: 0, wrongChecks: 0, wrongSeen: steps.map(() => []),
      };
    statement.innerHTML = statementHtml(p);
    setEditor(p);
    hooks.onLoad(p, practice.mode());
    renderSteps();
    void typeset([statement, stepsBox]);
    if (!restore) saveWork();
  }

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
    else randomNext();
  });

  // A random problem: from the stage in Guided Learning, or of the kind and size chosen in the
  // editor (as a starting point to edit) when designing problems.
  function randomNext(): void {
    if (practice.mode() === "path") load(randomProblem(STAGES[practice.stage()].kind), false, practice.stage());
    else load(randomProblem(designKind(), Math.random, editorSize()), false, null);
  }
  // Called by common/practice.ts when the mode or stage changes. Designing problems starts from
  // the problem shown, which is already in the editor.
  function newProblem(): void {
    if (practice.mode() === "path") randomNext();
    else loadFromEditor();
  }

  // ⋘──────── Designing a problem ────────⋙
  // The editor shows the current problem's matrix (and v or λ), so the student can change it and
  // click "Practice this problem". Problems whose answers can't be typed (such as irrational
  // eigenvalues) are explained instead of loaded.
  const sizeSelect = byId<HTMLSelectElement>("ev-size");
  const sizeField = byId<HTMLLabelElement>("ev-size-field");
  const designA = byId<HTMLSpanElement>("ev-design-a");
  const designV = byId<HTMLSpanElement>("ev-design-v");
  const vItem = byId<HTMLSpanElement>("ev-design-v-item");
  const lItem = byId<HTMLLabelElement>("ev-design-l-item");
  const lInput = byId<HTMLInputElement>("ev-design-l");
  const designError = byId<HTMLParagraphElement>("ev-design-error");
  let aInputs: HTMLInputElement[][] = [];
  let vInputs: HTMLInputElement[] = [];
  const designKind = () => kindSelect.value as Kind;
  const editorSize = () => {
    const sizes = kindSizes(designKind());
    return sizes.includes(Number(sizeSelect.value)) ? Number(sizeSelect.value) : sizes[0];
  };

  function designInput(label: string, value: string): HTMLInputElement {
    const input = element("input", "ev-matrix-entry");
    input.inputMode = "decimal";
    input.autocomplete = "off";
    input.setAttribute("aria-label", label);
    input.value = value;
    input.addEventListener("input", () => input.classList.remove("ev-bad"));
    input.addEventListener("keydown", e => { if (e.key === "Enter") loadFromEditor(); });
    return input;
  }

  // Rebuilds the boxes for an n × n matrix, keeping the entries that still fit.
  function buildEditor(n: number, A = aInputs.map(row => row.map(i => i.value)), v = vInputs.map(i => i.value)): void {
    aInputs = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) =>
      designInput(`Row ${i + 1}, column ${j + 1} of A`, A[i]?.[j] ?? "")));
    designA.style.gridTemplateColumns = `repeat(${n}, auto)`;
    designA.replaceChildren(...aInputs.flat());
    vInputs = Array.from({ length: n }, (_, i) => designInput(`Entry ${i + 1} of v`, v[i] ?? ""));
    designV.style.gridTemplateColumns = "auto";
    designV.replaceChildren(...vInputs);
    sizeSelect.value = `${n}`;
    sizeField.hidden = kindSizes(designKind()).length < 2;
    vItem.hidden = designKind() !== "evec";
    lItem.hidden = designKind() !== "evalcheck";
  }

  function setEditor(p: Problem): void {
    kindSelect.value = p.kind;
    buildEditor(p.A.length, p.A.map(row => row.map(str)), p.v?.map(str) ?? []);
    lInput.value = p.lambda ? str(p.lambda) : lInput.value;
    designError.hidden = true;
  }

  function readEditor(): Problem | string {
    const kind = designKind();
    const boxes = [...aInputs.flat(), ...(kind === "evec" ? vInputs : []), ...(kind === "evalcheck" ? [lInput] : [])];
    const values = boxes.map(b => (b.value.trim() === "" ? null : parseEntry(b.value)));
    boxes.forEach((b, i) => b.classList.toggle("ev-bad", values[i] === null));
    if (values.some(v => v === null)) {
      return boxes.some(b => b.value.trim() === "") ? "Fill in every entry (enter 0 for zeros)." : "Enter numbers like -3, 0.5, or 1/2.";
    }
    const n = aInputs.length;
    const f = values as Fraction[];
    const p: Problem = { kind, A: Array.from({ length: n }, (_, i) => f.slice(i * n, (i + 1) * n)) };
    if (kind === "evec") p.v = f.slice(n * n, n * n + n);
    if (kind === "evalcheck") p.lambda = f[n * n];
    return problemError(p) ?? p;
  }

  function loadFromEditor(): void {
    const p = readEditor();
    designError.hidden = typeof p !== "string";
    if (typeof p === "string") {
      designError.textContent = p;
      return;
    }
    // A problem already shown is restored with the work done on it.
    load(p, true, null);
  }

  kindSelect.addEventListener("change", () => {
    saveSettings();
    buildEditor(editorSize());
    loadFromEditor();
  });
  sizeSelect.addEventListener("change", () => {
    buildEditor(editorSize());
    designError.hidden = true;
  });
  byId<HTMLButtonElement>("ev-design-go").addEventListener("click", loadFromEditor);
  lInput.addEventListener("keydown", e => { if (e.key === "Enter") loadFromEditor(); });
  lInput.addEventListener("input", () => lInput.classList.remove("ev-bad"));
  byId<HTMLButtonElement>("ev-done-new").addEventListener("click", () => {
    nextButton.click();
    window.scrollTo({ top: statement.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
  });
  doneNextLevel.addEventListener("click", () => doneSuggestAction());

  const fromUrl = decodeProblem(location.search);
  if (fromUrl) load(fromUrl, true, practice.urlStage);
  else newProblem();
  practice.render();
  void problem;
}

export { PIN_KEY };
