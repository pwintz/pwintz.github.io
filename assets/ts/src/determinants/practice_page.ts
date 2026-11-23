// ╭───────────────────────────────────────────────────────────────╮
// │                    Practice: determinants                      │
// ╰───────────────────────────────────────────────────────────────╯
// Random problems worked in checked steps (common/step_practice.ts): 2 × 2 determinants and the
// areas they give, triangular matrices, cofactor expansions, row reduction, and the properties of
// determinants. The math is in det_math.ts.

import { Stage } from "../common/practice";
import { Group, Step, StepPractice, Verdict, exact, parseAll, setupStepPractice } from "../common/step_practice";
import { Fraction, add, div, equals, isZero, mul, neg } from "../matrix/fraction";
import { FMat } from "../matrix/linalg";
import {
  F, KINDS, Kind, Line, Problem, Term, URL_KEYS, bestLine, cofactorSign, decodeProblem, det, diagonal, eliminate, encodeProblem,
  expansion, fracTex, fracText, hasProblem, isTriangular, isUpper, lineEntries, matTex, minorMatrix, paren, parenTex, prodTex, product, randomProblem, signedSum,
} from "./det_math";

const $ = (tex: string) => `\\(${tex}\\)`;
const $$ = (tex: string) => `\\[${tex}\\]`;

export const PIN_KEY = "determinants_pinned";

// ⋘──────── Stages of the practice path ────────⋙

export const STAGES: (Stage & { kind: Kind })[] = [
  { id: "det2", kind: "det2", title: "2 × 2 matrices", note: "det A = ad − bc, and |det A| is the area of the parallelogram spanned by the columns." },
  { id: "tri", kind: "tri", title: "Triangular matrices", note: "Triangular matrices are a special case where computing the determinant is easier: it is the product of the diagonal entries." },
  { id: "cofactor3", kind: "cofactor3", title: "3 × 3: cofactor expansion", note: "Write det A as a sum of entries of a row or column, with signs, times smaller determinants. The row or column with the most zeros has the fewest terms." },
  { id: "rowreduce3", kind: "rowreduce3", title: "3 × 3: row reduction", note: "Row reduce to a triangular matrix: row replacements keep the determinant, and each swap changes its sign." },
  { id: "props", kind: "props", title: "Properties of determinants", note: "How transposes, row operations, scalar multiples, powers, and inverses change the determinant." },
  { id: "cofactor4", kind: "cofactor4", title: "4 × 4: cofactor expansion", note: "Expand along a row or a column with three zeros: one 3 × 3 minor is left." },
];

// ⋘──────── Helpers ────────⋙

const partial = (step: Step): Step => ({ ...step, given: 2 });
const final = (step: Step): Step => ({ ...step, final: true });
const ordinal = (k: number) => `${k + 1}`;
const sub2 = (i: number, j: number) => `${i + 1}${j + 1}`;
const lineName = (line: Line) => `${line.type === "row" ? "row" : "column"} ${line.index + 1}`;
const scalar = (before: string, after?: string): Group => ({ type: "scalar", before, after });

/** A whole-matrix check: every entry is marked. */
const matCheck = (expected: FMat, message: string) => exact(expected.flat(), message);

/** Checks one number, with messages for common mistakes. */
function numCheck(expected: Fraction, mistakes: { value: Fraction; message: string }[] = [], fallback?: string) {
  return (values: string[]): Verdict => {
    const verdict = exact([expected])(values);
    if (verdict.ok) return verdict;
    const got = parseAll(values)[0];
    const hit = got && mistakes.find(m => !equals(m.value, expected) && equals(got, m.value));
    return { ...verdict, message: hit ? hit.message : fallback };
  };
}

/** The title of the step that finds det A, which the singular question waits for. */
const DET_TITLE = `Find ${$("\\det A")}`;

/** The last question of a matrix problem: whether A is singular (det A = 0, so not invertible). */
function singularStep(A: FMat, prereqs: number[]): Step {
  const D = det(A);
  const singular = isZero(D);
  return final({
    title: `Is ${$("A")} singular?`,
    groups: [{ type: "yesno", before: `${$("A")} is singular:` }],
    answer: [singular ? "yes" : "no"],
    check: values => {
      const ok = values[0] === (singular ? "yes" : "no");
      return {
        ok, marks: [ok],
        message: ok ? undefined : `Look at your determinant: ${$("A")} is singular exactly when ${$("\\det A = 0")}.`,
      };
    },
    hints: [`A square matrix is <em>singular</em> (not invertible) exactly when its determinant is 0.`],
    worked: singular
      ? `<p>Since ${$("\\det A = 0")}, ${$("A")} <strong>is</strong> singular: it is not invertible, and its columns are linearly dependent.</p>`
      : `<p>Since ${$(`\\det A = ${fracTex(D)} \\neq 0`)}, ${$("A")} is <strong>not</strong> singular: it is invertible.</p>`,
    prereqs,
  });
}

/**
 * A worked determinant of a small matrix M: ad − bc for a 2 × 2 matrix; for a larger one, the
 * product of the diagonal if it is triangular, else a cofactor expansion along its best line.
 */
export function detWorkedTex(M: FMat, name: string): string {
  const n = M.length;
  const d = det(M);
  if (n === 1) return `${name} = ${fracTex(M[0][0], true)}`;
  if (n === 2) {
    return `${name} = ${prodTex([M[0][0], M[1][1]], true)} - ${prodTex([M[0][1], M[1][0]], true)} = ${fracTex(d, true)}`;
  }
  if (isTriangular(M)) return `${name} = ${prodTex(diagonal(M), true)} = ${fracTex(d, true)}`;
  const line = bestLine(M);
  const terms = expansion(M, line);
  if (terms.length === 0) return `${name} = 0`;
  const symbolic = terms.map((t, k) => {
    const sign = cofactorSign(t.i, t.j) > 0 ? (k === 0 ? "" : " + ") : (k === 0 ? "-" : " - ");
    return `${sign}${parenTex(t.entry, true)}${matTex(minorMatrix(M, t.i, t.j), "vmatrix")}`;
  }).join("");
  const values = signedSum(terms.map(t => mul(t.entry, t.cofactor)), true);
  return `\\begin{aligned} ${name} &= ${symbolic} \\\\ &= ${values} = ${fracTex(d, true)} \\end{aligned}`;
}

/** "the area of the parallelogram" (2 × 2) or "the volume of the parallelepiped" (3 × 3). */
function sizeStep(A: FMat, prereqs: number[]): Step {
  const d = det(A);
  const area = d.num < 0n ? neg(d) : d;
  const two = A.length === 2;
  const what = two ? "area of the parallelogram" : "volume of the parallelepiped";
  const word = two ? "area" : "volume";
  const cols = two ? `${$("\\vect{a}_1")} and ${$("\\vect{a}_2")}` : `${$("\\vect{a}_1")}, ${$("\\vect{a}_2")}, and ${$("\\vect{a}_3")}`;
  const orientation = isZero(d)
    ? `The columns are linearly dependent, so the ${two ? "parallelogram is flat (a segment or a point)" : "parallelepiped is flat"}.`
    : two
      ? `The sign of ${$("\\det A")} gives the orientation: ${d.num > 0n ? "positive, so turning from \\(\\vect{a}_1\\) toward \\(\\vect{a}_2\\) the short way is counterclockwise" : "negative, so turning from \\(\\vect{a}_1\\) toward \\(\\vect{a}_2\\) the short way is clockwise: \\(A\\) flips the plane over"}.`
      : `The sign of ${$("\\det A")} gives the orientation: ${d.num > 0n ? "positive, so the columns are right-handed, like the standard basis" : "negative, so the columns are left-handed: \\(A\\) turns space into its mirror image"}.`;
  return {
    title: `Find the ${what} spanned by the columns of ${$("A")}`,
    intro: `<p>The columns of ${$("A")} are ${cols}. ${two ? "The parallelogram" : "The parallelepiped"} with these sides is the image of the unit ${two ? "square" : "cube"} under ${$("A")}.</p>`,
    groups: [scalar(`${word[0].toUpperCase()}${word.slice(1)} =`)],
    answer: [fracText(area)],
    check: numCheck(area, [], `The ${word} is ${$("\\abs{\\det A}")}.`),
    hints: [
      `The ${word} is the absolute value of the determinant: ${$(`\\text{${word}} = \\abs{\\det A}`)}.`,
      `${$(`\\abs{${fracTex(d)}} = ${fracTex(area)}`)}.`,
    ],
    worked: $$(`\\text{${word}} = \\abs{\\det A} = \\abs{${fracTex(d, true)}} = ${fracTex(area, true)}`) + `<p>${orientation}</p>`,
    prereqs,
  };
}

// ⋘──────── 2 × 2 ────────⋙

function det2Steps(A: FMat): Step[] {
  const [[a, b], [c, d]] = A;
  const ad = mul(a, d), bc = mul(b, c), D = det(A);
  return [
    {
      title: `Find the products ${$("ad")} and ${$("bc")}`,
      intro: `<p>For ${$("A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}")}, ${$("ad")} is the product of the main diagonal (top left to bottom right) and ${$("bc")} is the product of the other diagonal.</p>`,
      groups: [scalar($("ad =")), scalar($("bc ="))],
      answer: [fracText(ad), fracText(bc)],
      check: exact([ad, bc], "Multiply the two entries on each diagonal."),
      hints: [
        "The main diagonal runs from the top left entry to the bottom right entry; the other diagonal runs from the top right to the bottom left.",
        `${$(`ad = ${prodTex([a, d])}`)} and ${$(`bc = ${prodTex([b, c])}`)}.`,
      ],
      worked: $$(`ad = ${prodTex([a, d], true)} = ${fracTex(ad, true)}, \\qquad bc = ${prodTex([b, c], true)} = ${fracTex(bc, true)}`),
      prereqs: [],
    },
    final({
      title: `Find ${$("\\det A")}`,
      groups: [scalar($("\\det A ="))],
      answer: [fracText(D)],
      check: numCheck(D, [
        { value: neg(D), message: `That's ${$("bc - ad")}: subtract ${$("bc")} from ${$("ad")}.` },
        { value: add(ad, bc), message: `Subtract the products: ${$("\\det A = ad - bc")}, not ${$("ad + bc")}.` },
      ], `${$("\\det A = ad - bc")}.`),
      hints: [
        `${$("\\det \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} = ad - bc")}.`,
        `${$(`\\det A = ${fracTex(ad)} - ${parenTex(bc)}`)}.`,
      ],
      worked: $$(`\\det A = ad - bc = ${fracTex(ad, true)} - ${parenTex(bc, true)} = ${fracTex(D, true)}`),
      prereqs: [0],
    }),
    final(sizeStep(A, [1])),
  ];
}

// ⋘──────── Triangular ────────⋙

function triSteps(A: FMat): Step[] {
  const n = A.length, D = det(A), diag = diagonal(A);
  const upper = isUpper(A);
  const kind = upper ? "upper triangular: every entry below the diagonal is 0" : "lower triangular: every entry above the diagonal is 0";
  const names = diag.map((_, i) => `a_{${sub2(i, i)}}`).join(" ");
  return [final({
    title: `Find ${$("\\det A")}`,
    intro: `<p>Triangular matrices are a special case where computing the determinant is easier: no cofactor expansion or row reduction is needed.</p>`,
    groups: [scalar($("\\det A ="))],
    answer: [fracText(D)],
    check: numCheck(D, [
      { value: diag.reduce(add, F(0)), message: "Multiply the diagonal entries; don't add them." },
      { value: neg(D), message: "Check the signs of the diagonal entries." },
    ], "The determinant of a triangular matrix is the product of its diagonal entries."),
    hints: [
      `${$("A")} is ${kind}.`,
      `The determinant of a triangular matrix is the product of its diagonal entries: ${$(`\\det A = ${names}`)}.`,
      `${$(`\\det A = ${prodTex(diag)}`)}.`,
    ],
    worked: $$(`\\det A = ${names} = ${prodTex(diag, true)} = ${fracTex(D, true)}`)
      + `<p>Why: a cofactor expansion along the ${upper ? "first column" : "first row"} has only one term, ${$(`a_{11}`)} times the determinant of a smaller triangular matrix, and repeating this ${n - 1} times leaves the product of the diagonal entries.</p>`,
    prereqs: [],
  })];
}

// ⋘──────── Cofactor expansion ────────⋙

// Colors of a cofactor expansion (Okabe–Ito): the row or column expanded along, the entries of a
// minor, and the other entries crossed out with it.
const LINE_COLOR = "#D55E00";
const MINOR_COLOR = "#0072B2";
const CROSSED_COLOR = "#9aa0a6";
/** TeX in a color, grouped so that both MathJax readings of \color give the same result. */
const colored = (tex: string, color: string) => `{\\color{${color}}{${tex}}}`;
/** A matrix whose entries are colored by `colorOf` ("box": boxed, in the line's color). */
export function colorMatTex(A: FMat, colorOf: (i: number, j: number) => string | null, env: "bmatrix" | "vmatrix" = "bmatrix"): string {
  const entry = (x: Fraction, i: number, j: number) => {
    const c = colorOf(i, j), t = fracTex(x, true);
    return c === null ? t : c === "box" ? colored(`\\boxed{${t}}`, LINE_COLOR) : colored(t, c);
  };
  return `\\begin{${env}} ${A.map((row, i) => row.map((x, j) => entry(x, i, j)).join(" & ")).join(" \\\\ ")} \\end{${env}}`;
}

function cofactorSteps(A: FMat): Step[] {
  const n = A.length, D = det(A);
  const line = bestLine(A);
  // Every entry of the line, zeros included; `terms` are the nonzero ones, whose minors are needed.
  const all: Term[] = lineEntries(A, line).map(([i, j]) => {
    const minor = det(minorMatrix(A, i, j));
    return { i, j, entry: A[i][j], minor, cofactor: cofactorSign(i, j) > 0 ? minor : neg(minor) };
  });
  const terms = all.filter(t => !isZero(t.entry));
  const lineZeros = n - terms.length;
  // The line expanded along, named in its color.
  const lineSpan = `<span style="color:${LINE_COLOR}">${lineName(line)}</span>`;
  const why = lineZeros === 0
    ? `No row or column has a zero, so expansion is equally difficult along any of them. Let's expand along ${lineSpan}.`
    : lineZeros === n
      ? `<span style="color:${LINE_COLOR}">${lineName(line)[0].toUpperCase()}${lineName(line).slice(1)}</span> is all zeros, so let's expand along it: a zero entry gives a term of zero, whose smaller determinant we don't need to find.`
      : `We could expand along any row or column, but a zero entry gives a term of zero, whose smaller determinant we don't need to find. So let's expand along ${lineSpan}, which has the most zeros (${lineZeros}).`;
  const M =(t: Term) => `M_{${sub2(t.i, t.j)}}`;
  const inLine = (i: number, j: number) => (line.type === "row" ? i === line.index : j === line.index);
  // The sign written in front of a term: its checkerboard sign, or + for a zero entry.
  const sign = (t: Term) => (isZero(t.entry) ? 1 : cofactorSign(t.i, t.j));
  // The signed coefficient of a term: (−1)^(i+j) a_ij, as the student enters it.
  const coef = (t: Term) => (sign(t) > 0 ? t.entry : neg(t.entry));
  const minorTex = (t: Term) => colorMatTex(minorMatrix(A, t.i, t.j), () => MINOR_COLOR, "vmatrix");
  // The k-th term with its sign in front (the first term's only when negative): " - 3 |…|".
  const signed = (t: Term, k: number, body: string) =>
    `${sign(t) > 0 ? (k === 0 ? "" : " + ") : (k === 0 ? "-" : " - ")}${body}`;
  // The entries, each with its sign: "3", " - 5", " + (-4)".
  const entryTex = (t: Term, k: number) => signed(t, k, colored(parenTex(t.entry, true), LINE_COLOR));
  const expansionTex = all.map((t, k) => `${entryTex(t, k)}${minorTex(t)}`).join("");
  const signs = `\\begin{bmatrix} ${Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (cofactorSign(i, j) > 0 ? "+" : "-")).join(" & ")).join(" \\\\ ")} \\end{bmatrix}`;
  // A with the entry of term t boxed, its crossed-out row and column gray, and its minor blue.
  const crossedTex = (t: Term) => colorMatTex(A, (i, j) => {
    if (i === t.i && j === t.j) return "box";
    if (inLine(i, j)) return LINE_COLOR;
    if (i === t.i || j === t.j) return CROSSED_COLOR;
    return MINOR_COLOR;
  });
  const size = (n - 1) * (n - 1);
  const minorEntries = all.map(t => minorMatrix(A, t.i, t.j).flat());

  // Step 1: one term for every entry of the line. Entering 0 as a coefficient grays out (skips)
  // that term's matrix, which a zero entry doesn't need.
  const expandStep: Step = {
    title: `Write the cofactor expansion of ${$("\\det A")} along ${lineName(line)}`,
    intro: `<p>${why}</p>`
      + $$(`A = ${colorMatTex(A, (i, j) => (inLine(i, j) ? LINE_COLOR : null))}`),
    groups: all.flatMap((_, k): Group[] => [
      scalar(k === 0 ? $("\\det A =") : $("+")),
      { type: "mat", rows: n - 1, cols: n - 1, bars: true, skipIfZero: 2 * k },
    ]),
    answer: all.flatMap((t, k) => [fracText(coef(t)), ...(isZero(t.entry) ? minorEntries[k].map(() => "") : minorEntries[k].map(fracText))]),
    check(values) {
      const got = parseAll(values);
      const at = (k: number) => k * (size + 1);  // The index of term k's coefficient
      const marks: (boolean | null)[] = [];
      let badSign = false, badMinor = false;
      all.forEach((t, k) => {
        const c = values[at(k)] === "" ? null : got[at(k)];
        const coefOk = c !== null && equals(c, coef(t));
        if (c !== null && !coefOk && equals(c, neg(coef(t)))) badSign = true;
        marks.push(coefOk);
        // A coefficient of 0 skips its matrix (its boxes are blank).
        const skip = c !== null && isZero(c);
        minorEntries[k].forEach((x, e) => {
          if (skip) { marks.push(null); return; }
          const v = values[at(k) + 1 + e] === "" ? null : got[at(k) + 1 + e];
          const ok = v !== null && equals(v, x);
          if (!ok) badMinor = true;
          marks.push(ok);
        });
      });
      const ok = marks.every(m => m !== false);
      if (ok) return { ok, marks };
      const messages = [
        ...(badSign ? [`Check the signs: a term's sign is ${$("+")} where the checkerboard has ${$("+")}, and ${$("-")} where it has ${$("-")}.`] : []),
        ...(badMinor ? ["Each smaller matrix is what's left of \\(A\\) after crossing out the row and the column of its entry."] : []),
      ];
      return { ok, marks, message: messages.join(" ") || "Each coefficient is an orange entry, with its sign from the checkerboard." };
    },
    hints: [
      `<p>Write ${$("\\det A")} as a sum of terms, one for each orange entry: the entry, with a sign from the checkerboard pattern, times the determinant of the ${n - 1} × ${n - 1} matrix left after crossing out the entry's row and column.</p>`
        + $$(signs),
      `<p>Cross out the row and the column of each nonzero orange entry (boxed); the entries left, in <span style="color:${MINOR_COLOR}">blue</span>, make up its smaller matrix:</p>`
        + terms.map(t => $$(`${crossedTex(t)} \\quad\\longrightarrow\\quad ${signed(t, 0, colored(parenTex(t.entry, true), LINE_COLOR))}${minorTex(t)}`)).join(""),
    ],
    worked: $$(`\\det A = ${expansionTex}`)
      + `<p>The determinants of the smaller matrices are the <em>minors</em> ${$(all.map(M).join(", "))}.${lineZeros > 0 ? ` A term whose entry is 0 is 0, so its minor isn't needed.` : ""}</p>`,
    prereqs: [],
  };

  // Step 2: the minors of the nonzero entries, entered in the expansion; a zero term is just "+ 0".
  const subs = terms.map(t => minorMatrix(A, t.i, t.j));
  const two = n === 3;  // The minors are 2 × 2
  const AD_BC = $("\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc");
  const subExpansion = (sub: FMat) => expansion(sub, bestLine(sub)).map((u, k2) =>
    `${cofactorSign(u.i, u.j) > 0 ? (k2 === 0 ? "" : " + ") : (k2 === 0 ? "-" : " - ")}${parenTex(u.entry, true)}${matTex(minorMatrix(sub, u.i, u.j), "vmatrix")}`).join("");
  // The second line: the text before each box (and after the last one), with each zero term as "+ 0".
  const pieces: { before: string; after: string }[] = [];
  let pending = "\\phantom{\\det A} = ";
  all.forEach((t, k) => {
    if (isZero(t.entry)) {
      if (pieces.length > 0 && all.slice(k).every(u => isZero(u.entry))) pieces[pieces.length - 1].after += ` + ${colored("0", LINE_COLOR)}`;
      else pending += `${k === 0 ? "" : " + "}${colored("0", LINE_COLOR)} `;
      return;
    }
    pieces.push({ before: `${pending}${pieces.length === 0 && k === 0 ? "" : "{}"}${entryTex(t, k)} \\Bigl(`, after: "\\Bigr)" });
    pending = "";
  });
  const minorsStep: Step = {
    title: `Find the minor${terms.length > 1 ? "s" : ""} and put ${terms.length > 1 ? "them" : "it"} into the expansion`,
    intro: `<p>Find the determinant of ${terms.length > 1 ? "each smaller matrix" : "the smaller matrix"} in the expansion from step 1 (${terms.length > 1 ? "the minors" : "the minor"}), and enter ${terms.length > 1 ? "them" : "it"} below.${lineZeros > 0 ? " A term whose entry is 0 is 0." : ""}</p>`,
    // The expansion, with the boxes on the next line; the phantom "det A" lines up the equal signs,
    // and "{}" keeps the spacing of the binary operators.
    lead: $(`\\displaystyle \\det A = ${expansionTex}`),
    groups: pieces.map((p, k): Group => ({ type: "scalar", before: $(p.before), after: $(p.after), joined: k > 0 })),
    answer: terms.map(t => fracText(t.minor)),
    check(values) {
      const verdict = exact(terms.map(t => t.minor))(values);
      if (verdict.ok) return verdict;
      const got = parseAll(values);
      const flipped = terms.some((t, k) => got[k] !== null && !equals(got[k]!, t.minor) && equals(got[k]!, neg(t.minor)));
      return {
        ...verdict,
        message: flipped
          ? (two ? `Check the order: ${$("ad - bc")}.` : "Check the signs in your expansion of the minor.")
          : (two ? `${AD_BC}.` : "Expand this determinant too."),
      };
    },
    hints: [
      two
        ? `${AD_BC}.`
        : `Find ${terms.length > 1 ? "each" : "this"} 3 × 3 determinant by a cofactor expansion too, along the row or column with the most zeros.`,
      two
        ? $$(terms.map((t, k) => `${minorTex(t)} = ${prodTex([subs[k][0][0], subs[k][1][1]], true)} - ${prodTex([subs[k][0][1], subs[k][1][0]], true)}`).join(", \\qquad "))
        : terms.map((t, k) => `<p>Along ${lineName(bestLine(subs[k]))} of the smaller matrix:</p>${$$(`${minorTex(t)} = ${subExpansion(subs[k])}`)}`).join(""),
    ],
    worked: terms.map((t, k) => $$(detWorkedTex(subs[k], `${M(t)} = ${minorTex(t)}`))).join("")
      + `<p>So</p>${$$(`\\det A = ${all.map((t, k) => (isZero(t.entry) ? `${k === 0 ? "" : " + "}${colored("0", LINE_COLOR)}` : `${entryTex(t, k)}${paren(t.minor, true)}`)).join("")}`)}`,
    prereqs: [0],
  };

  // Step 3: multiply and add.
  const products = terms.map(t => mul(coef(t), t.minor));
  const plugged = terms.map((t, k) => `${entryTex(t, k)}${paren(t.minor, true)}`).join("");
  const detStep: Step = final({
    title: `Find ${$("\\det A")}`,
    groups: [scalar($("\\det A ="))],
    answer: [fracText(D)],
    check: numCheck(D, [
      { value: terms.map(t => mul(t.entry, t.minor)).reduce(add, F(0)), message: "Keep the signs from the checkerboard: some terms are subtracted." },
    ], terms.length === 0 ? "Every term of the expansion in step 1 has a factor 0." : "Multiply each entry by its minor, as in step 2, and add, keeping the signs."),
    hints: terms.length === 0
      ? [`Every term of the expansion in step 1 has a factor 0.`]
      : [
        `Multiply each entry by its minor, as in step 2, and add, keeping the signs.`,
        `${$(`\\det A = ${terms.map((t, k) => signed(t, k, `${parenTex(t.entry)}(${fracTex(t.minor)})`)).join("")}`)}.`,
      ],
    worked: terms.length === 0
      ? $$(`\\det A = ${all.map(() => colored("0", LINE_COLOR)).join(" + ")} = 0`)
      : $$(`\\det A = ${plugged} = ${signedSum(products, true)} = ${fracTex(D, true)}`),
    prereqs: terms.length === 0 ? [0] : [1],
  });
  // With a line of zeros, no minor is needed, so there is no step 2.
  const steps = terms.length === 0 ? [expandStep, detStep] : [expandStep, minorsStep, detStep];
  return n === 3 ? [...steps, final(sizeStep(A, [steps.length - 1]))] : steps;
}

// ⋘──────── Row reduction ────────⋙

function rowReduceSteps(A: FMat): Step[] {
  const n = A.length, D = det(A);
  const { steps: elim, U, swaps } = eliminate(A);
  const R = (i: number) => `R_{${i + 1}}`;
  const opTex = (j: number, op: { row: number; factor: Fraction }) => {
    const f = op.factor;
    const coef = equals(f, F(1)) || equals(f, F(-1)) ? "" : parenTex(f.num < 0n ? neg(f) : f);
    return `${R(op.row)} ${f.num < 0n ? "+" : "-"} ${coef}${R(j)}`;
  };
  const name = (k: number) => (k === elim.length - 1 ? "U" : `A_{${k + 1}}`);
  const steps: Step[] = elim.map((e, k) => {
    const j = e.col;
    const prev = k === 0 ? "A" : name(k - 1);
    const swapText = e.swap === null ? ""
      : `<p>The diagonal entry in row ${j + 1}, column ${j + 1} is 0, so first swap rows ${j + 1} and ${e.swap + 1}. A swap changes the sign of the determinant.</p>`;
    const ops = e.ops.map(op => `${R(op.row)} \\leftarrow ${opTex(j, op)}`);
    const step: Step = {
      title: `Make the entries below the diagonal in column ${j + 1} zero`,
      intro: swapText
        + `<p>Subtract multiples of row ${j + 1} from the rows below it (row replacements, which don't change the determinant). Leave the other rows as they are.${k === elim.length - 1 ? ` The result is the upper triangular matrix ${$("U")}.` : ""}</p>`,
      groups: [{ type: "mat", rows: n, cols: n, before: $(`${name(k)} =`) }],
      answer: e.after.flat().map(fracText),
      check: matCheck(e.after, `To make the entry in row ${$("i")}, column ${j + 1} zero, subtract (that entry ÷ the diagonal entry of column ${j + 1}) times row ${j + 1} from row ${$("i")}.`),
      hints: [
        `${e.swap === null ? "" : `After swapping rows ${j + 1} and ${e.swap + 1}, `}${e.swap === null ? "To" : "to"} make the entry in row ${$("i")}, column ${j + 1} zero, subtract ${$(`a_{i${j + 1}} / a_{${j + 1}${j + 1}}`)} times row ${j + 1} from row ${$("i")}.`,
        ops.length > 0 ? `Use ${ops.map(o => $(o)).join(" and ")}.` : "No row replacements are needed after the swap.",
      ],
      worked: $$(`${prev} = ${matTex(e.before)} \\xrightarrow{${[...(e.swap === null ? [] : [`${R(j)} \\leftrightarrow ${R(e.swap)}`]), ...e.ops.map(op => opTex(j, op))].join(",\\;")}} ${matTex(e.after)} = ${name(k)}`),
      prereqs: k === 0 ? [] : [k - 1],
    };
    return k === 0 ? step : partial(step);
  });
  const diag = diagonal(U);
  const sign = swaps % 2 === 0 ? 1 : -1;
  const uName = elim.length === 0 ? "A" : "U";
  const detStep: Step = final({
    title: `Find ${$("\\det A")}`,
    intro: elim.length === 0 ? `<p>${$("A")} is already upper triangular.</p>` : undefined,
    groups: [scalar($("\\det A ="))],
    answer: [fracText(D)],
    check: numCheck(D, [
      { value: neg(D), message: swaps > 0 ? "Each row swap changes the sign of the determinant." : "Row replacements don't change the determinant: no sign changes are needed." },
    ], `${$(`\\det ${uName}`)} is the product of its diagonal entries${swaps > 0 ? `, and each swap changes the sign` : ""}.`),
    hints: [
      `Row replacements don't change the determinant${swaps > 0 ? `, and each row swap changes its sign: ${$(`\\det A = (-1)^{${swaps}} \\det U`)}` : `, so ${$(`\\det A = \\det ${uName}`)}`}.`,
      `${$(`\\det ${uName}`)} is the product of its diagonal entries: ${$(`\\det ${uName} = ${prodTex(diag)}`)}.`,
    ],
    worked: $$(`\\det A = ${swaps > 0 ? `(-1)^{${swaps}}` : ""} \\det ${uName} = ${sign < 0 ? "-" : ""}${swaps > 0 ? `(${prodTex(diag, true)})` : prodTex(diag, true)} = ${fracTex(D, true)}`),
    prereqs: elim.length === 0 ? [] : [elim.length - 1],
  });
  return [...steps, detStep, ...(n === 3 ? [final(sizeStep(A, [steps.length]))] : [])];
}

// ⋘──────── Properties ────────⋙

export const powTex = (k: Fraction, n: number) => `${parenTex(k)}^{${n}}`;
/** kA in TeX: "2A", "-A", or "(1/2)A". */
export const scaledA = (k: Fraction) =>
  equals(k, F(1)) ? "A" : equals(k, F(-1)) ? "-A" : k.den === 1n ? `${fracTex(k)}A` : `(${fracTex(k)})A`;

function propsSteps(n: number, d: Fraction, k: Fraction, m: Fraction): Step[] {
  const kn = Array.from({ length: n }, () => k).reduce(mul, F(1));
  const dt = fracTex(d), kt = fracTex(k);
  // `_id` names the step, for reading the code.
  const one = (_id: string, lhs: string, value: Fraction, hints: string[], worked: string, mistakes: { value: Fraction; message: string }[] = [], fallback?: string): Step => final({
    title: `Find ${$(lhs)}`,
    groups: [scalar($(`${lhs} =`))],
    answer: [fracText(value)],
    check: numCheck(value, mistakes, fallback),
    hints,
    worked,
    prereqs: [],
  });
  return [
    one("transpose", "\\det(A\\trans)", d,
      [`Transposing a matrix doesn't change its determinant: ${$("\\det(A\\trans) = \\det A")}.`],
      $$(`\\det(A\\trans) = \\det A = ${dt}`)
      + "<p>A cofactor expansion along a row of \\(A\\) is the same as one along the matching column of \\(A\\trans\\).</p>"),
    one("swap", "\\det B", neg(d),
      [`Swapping two rows changes the sign of the determinant.`],
      $$(`\\det B = -\\det A = ${fracTex(neg(d))}`),
      [{ value: d, message: "A row swap changes the sign of the determinant." }]),
    one("replace", "\\det C", d,
      [`Adding a multiple of one row to another (a row replacement) doesn't change the determinant.`],
      $$(`\\det C = \\det A = ${dt}`)
      + `<p>A row replacement shears the parallelepiped spanned by the rows, which keeps its volume.</p>`,
      [
        { value: mul(m, d), message: `Adding ${$(`${fracTex(m)}`)} times row 1 to row 2 doesn't scale row 2: it is a row replacement.` },
        { value: neg(d), message: "A row replacement doesn't change the sign; only a swap does." },
      ]),
    one("scale row", "\\det D", mul(k, d),
      [`Multiplying one row by ${$("k")} multiplies the determinant by ${$("k")}.`],
      $$(`\\det D = ${kt} \\det A = ${prodTex([k, d], true)} = ${fracTex(mul(k, d), true)}`),
      [{ value: mul(kn, d), message: `Only one row of ${$("A")} is multiplied by ${$(kt)}, not all ${n}.` }]),
    one("scalar multiple", `\\det(${scaledA(k)})`, mul(kn, d),
      [
        `Multiplying ${$("A")} by ${$(kt)} multiplies each of its ${n} rows by ${$(kt)}, and each row multiplies the determinant by ${$(kt)}.`,
        `${$(`\\det(kA) = k^{n} \\det A`)} for an ${$("n \\times n")} matrix: ${$(`\\det(${scaledA(k)}) = ${powTex(k, n)}(${fracTex(d)})`)}.`,
      ],
      $$(`\\det(${scaledA(k)}) = ${powTex(k, n)} \\det A = ${fracTex(kn, true)}${paren(d, true)} = ${fracTex(mul(kn, d), true)}`),
      [{ value: mul(k, d), message: `${$(`${scaledA(k)}`)} multiplies every row of ${$("A")} by ${$(kt)}: all ${n} of them.` }],
      `${$("\\det(kA) = k^n \\det A")} for an ${$("n \\times n")} matrix.`),
    one("square", "\\det(A^2)", mul(d, d),
      [`The determinant of a product is the product of the determinants: ${$("\\det(AB) = \\det A \\det B")}.`, `${$(`\\det(A^2) = \\det A \\cdot \\det A = ${parenTex(d)}^2`)}.`],
      $$(`\\det(A^2) = \\det(AA) = (\\det A)^2 = ${parenTex(d, true)}^2 = ${fracTex(mul(d, d), true)}`),
      [{ value: mul(F(2), d), message: `${$("\\det(A^2) = \\det A \\cdot \\det A")}: multiply, don't double.` }]),
    one("inverse", "\\det(A^{-1})", div(F(1), d),
      [
        `${$("AA^{-1} = I")}, and ${$("\\det I = 1")}.`,
        `So ${$("\\det A \\cdot \\det(A^{-1}) = 1")}, and ${$(`\\det(A^{-1}) = 1/\\det A`)}.`,
      ],
      $$(`\\det(A^{-1}) = \\frac{1}{\\det A} = ${fracTex(div(F(1), d), true)}`),
      [
        { value: neg(d), message: `${$("\\det(A^{-1})")} is the reciprocal of ${$("\\det A")}, not its negative.` },
        { value: neg(div(F(1), d)), message: `Check the sign: ${$("\\det(A^{-1}) = 1/\\det A")}.` },
      ],
      `${$("\\det(A^{-1}) = 1/\\det A")}.`),
  ];
}

export function buildSteps(p: Problem): Step[] {
  if (p.kind === "props") return propsSteps(p.n, p.d, p.k, p.m);
  const steps = p.kind === "det2" ? det2Steps(p.A)
    : p.kind === "tri" ? triSteps(p.A)
      : p.kind === "rowreduce3" ? rowReduceSteps(p.A)
        : cofactorSteps(p.A);
  // Every matrix problem ends by asking whether A is singular, once det A is found.
  return [...steps, singularStep(p.A, [steps.findIndex(s => s.title === DET_TITLE)])];
}

// ⋘──────── The problem statement ────────⋙

export function statementHtml(p: Problem): string {
  if (p.kind === "props") {
    const n = p.n, kt = fracTex(p.k), mt = fracTex(p.m);
    return `<p>Let ${$("A")} be an ${$(`${n} \\times ${n}`)} matrix with ${$(`\\det A = ${fracTex(p.d)}`)}, and let</p>
      <ul>
        <li>${$("B")} be ${$("A")} with rows 1 and 2 swapped,</li>
        <li>${$("C")} be ${$("A")} with ${$(mt)} times row 1 added to row 2, and</li>
        <li>${$("D")} be ${$("A")} with row 1 multiplied by ${$(kt)}.</li>
      </ul>
      <p>Find the determinants of ${$("A\\trans")}, ${$("B")}, ${$("C")}, ${$("D")}, ${$(scaledA(p.k))}, ${$("A^2")}, and ${$("A^{-1}")}.</p>`;
  }
  const A = $$(`A = ${matTex(p.A)}`);
  const singular = `<p>Then decide whether ${$("A")} is singular.</p>`;
  switch (p.kind) {
    case "det2":
      return `<p>Find the determinant of</p>${A}<p>and the area of the parallelogram spanned by its columns.</p>` + singular;
    case "tri":
      return `<p>Find the determinant of the triangular matrix</p>${A}` + singular;
    case "cofactor3":
      return `<p>Use a cofactor expansion to find the determinant of</p>${A}<p>and the volume of the parallelepiped spanned by its columns.</p>` + singular;
    case "rowreduce3":
      return `<p>Use row reduction to find the determinant of</p>${A}<p>Reduce ${$("A")} to an upper triangular matrix ${$("U")} with row replacements (swapping rows only when a diagonal entry is 0), then find ${$("\\det A")} from ${$("U")}, and the volume of the parallelepiped spanned by the columns of ${$("A")}.</p>` + singular;
    case "cofactor4":
      return `<p>Use a cofactor expansion to find the determinant of</p>${A}` + singular;
  }
}

// ⋘──────── The page ────────⋙

type Hooks = Required<Pick<Parameters<typeof setupStepPractice<Problem, Kind>>[0], "onLoad" | "onStatus">> & {
  size: () => number;  // The size chosen for a triangular matrix
};

export function setupPracticePage(hooks: Hooks): StepPractice<Problem> {
  return setupStepPractice<Problem, Kind>({
    prefix: "dt",
    key: "determinants",
    stages: STAGES,
    kinds: KINDS,
    helpText: "Guided Learning is a series of levels, from easy to hard: 2 × 2 matrices, triangular matrices, cofactor expansions and row reduction for 3 × 3 matrices, the properties of determinants, and a 4 × 4 cofactor expansion. Each level gives a new random problem of its kind each time. After two problems at a level with no hints, the page suggests the next level. To choose the kind of problem or type your own matrix, choose “Design your own problems” instead.",
    urlKeys: URL_KEYS,
    randomProblem: kind => randomProblem(kind, Math.random, hooks.size()),
    encode: encodeProblem,
    decode: decodeProblem,
    hasProblem,
    statementHtml,
    buildSteps,
    levels: {
      names: ["Full", "Partial", "None"],
      descriptions: ["The page works every step: a worked example", "The page does the routine steps; you do the main ones", "Solve the whole problem by hand, then enter the answers"],
      helpText: "#dt-help-support",
    },
    onLoad: hooks.onLoad,
    onStatus: hooks.onStatus,
  });
}
