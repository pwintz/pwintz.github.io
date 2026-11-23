// ╭───────────────────────────────────────────────────────────────╮
// │           Practice: projections and least squares              │
// ╰───────────────────────────────────────────────────────────────╯
// Random problems worked in checked steps (common/step_practice.ts), following the methods from
// lecture: the projection formula onto one vector, the sum of projections onto an orthogonal basis,
// Gram–Schmidt for a basis that isn't orthogonal, and the normal equation for least squares and
// lines of best fit. The math is in practice_math.ts.

import { Stage } from "../common/practice";
import { Step, StepPractice, Verdict, exact, parseAll, setupStepPractice, yesNo } from "../common/step_practice";
import { Fraction, equals, isZero } from "../matrix/fraction";
import { FMat, FVec, fdot, fsub, isZeroVec, rref } from "../matrix/linalg";
import {
  KINDS, Kind, Problem, URL_KEYS, familyOf, hasProblem, augTex, combo, decodeProblem, encodeProblem, fracTex, fromCols, gramSchmidt2,
  ipExpand, lineTex, matTex, matVec, normSq, normSqExpand, normalSolution, parenTex, projCoeff, randomProblem, rankOf,
  ratioTex, slashTex, sqrtTex, vecTex,
} from "./practice_math";

const $ = (tex: string) => `\\(${tex}\\)`;
const $$ = (tex: string) => `\\[${tex}\\]`;
const str = (x: Fraction) => slashTex(x);
const X = "\\vect{x}";

// ⋘──────── Stages of the practice path ────────⋙

const STAGES: (Stage & { kind: Kind })[] = [
  { id: "projv", kind: "projv", title: "Projection onto a vector", note: "Find ⟨x, v⟩ and ‖v‖², then the projection (⟨x, v⟩/‖v‖²)v, in ℝ²." },
  { id: "projline", kind: "projline", title: "Projection onto a line in ℝ³", note: "The same formula in ℝ³, then the component of x orthogonal to v." },
  { id: "projorth", kind: "projorth", title: "Projection onto a plane: orthogonal basis", note: "Check that the spanning vectors are orthogonal, then add the projections onto each one." },
  { id: "projgs", kind: "projgs", title: "Projection onto a plane: Gram–Schmidt", note: "The spanning vectors aren't orthogonal: make an orthogonal basis with Gram–Schmidt, then add the projections onto its vectors." },
  { id: "lsq", kind: "lsq", title: "Least squares solution", note: "Compute AᵀA and Aᵀb, then solve the normal equation AᵀAx = Aᵀb." },
  { id: "lsqres", kind: "lsqres", title: "Projection and residual", note: "Find the least squares solution x*, then the projection Ax* of b onto the column space of A, and the residual b − Ax*." },
  { id: "fitline", kind: "fitline", title: "Line of best fit", note: "Write the data as a system Ac = y, then solve its normal equation for the line y = c₀ + c₁x." },
];

// ⋘──────── Steps: inner products and projections ────────⋙

/** ⟨a, b⟩, or ‖a‖² when a and b are the same vector. */
function stepIpOf(a: FVec, b: FVec, aName: string, bName: string, prereqs: number[], extra = ""): Step {
  const same = aName === bName;
  const lhs = same ? `\\norm{${aName}}^2` : `\\ip{${aName}}{${bName}}`;
  const value = fdot(a, b);
  return {
    title: `Compute ${$(lhs)}`,
    groups: [{ type: "scalar", before: $(`${lhs} =`) }],
    answer: [str(value)],
    check: exact([value]),
    hints: same
      ? [`${$(lhs)} is the inner product of ${$(aName)} with itself: the sum of the squares of its entries.`, `${$(`${lhs} = ${normSqExpand(a)}`)}.`]
      : [`The inner product multiplies matching entries and adds the products: ${$("\\ip{\\vect{a}}{\\vect{b}} = a_1 b_1 + a_2 b_2 + \\cdots")}.`, `${$(`${lhs} = ${ipExpand(a, b)}`)}.`],
    worked: $$(`${lhs} = ${same ? normSqExpand(a) : ipExpand(a, b)} = ${fracTex(value)}`) + extra,
    prereqs,
  };
}

/** A vector answer, checked entry by entry. */
function vecStep(title: string, before: string, value: FVec, hints: string[], worked: string, prereqs: number[], message?: string): Step {
  return {
    title,
    groups: [{ type: "vec", n: value.length, before }],
    answer: value.map(str),
    check: exact(value, message),
    hints,
    worked,
    prereqs,
  };
}

/** The projection of x onto one vector v. */
function stepProjOntoVector(x: FVec, v: FVec, prereqs: number[]): Step {
  const c = projCoeff(x, v), p = combo([c], [v]);
  const xv = fdot(x, v), vv = normSq(v);
  return {
    ...vecStep(
      `Find the projection ${$(`\\operatorname{proj}_{\\vect{v}} ${X}`)}`,
      $(`\\operatorname{proj}_{\\vect{v}} ${X} =`),
      p,
      [
        `${$(`\\operatorname{proj}_{\\vect{v}} ${X} = \\dfrac{\\ip{${X}}{\\vect{v}}}{\\norm{\\vect{v}}^2} \\vect{v}`)}: multiply ${$("\\vect{v}")} by the ratio of the two numbers you found.`,
        `The ratio is ${$(`${slashTex(xv)}/${slashTex(vv)} = ${slashTex(c)}`)}, so multiply each entry of ${$("\\vect{v}")} by ${$(slashTex(c))}.`,
      ],
      $$(`\\operatorname{proj}_{\\vect{v}} ${X} = \\frac{\\ip{${X}}{\\vect{v}}}{\\norm{\\vect{v}}^2} \\vect{v} = ${[...new Set([`\\frac{${fracTex(xv)}}{${fracTex(vv)}}`, fracTex(c)])].map(k => `${k} ${vecTex(v)}`).join(" = ")} = ${vecTex(p)}`)
        + `<p>It is the point of the line through ${$("\\vect{v}")} closest to ${$(X)}.</p>`,
      prereqs,
    ),
    check(values) {
      const got = parseAll(values);
      if (got.some(g => g === null)) return { ok: false };
      const u = got as FVec;
      const marks = u.map((g, i) => equals(g, p[i]));
      if (marks.every(Boolean)) return { ok: true, marks };
      // On the line through v, but with the wrong coefficient?
      const onLine = rankOf([v, u]) <= 1;
      return {
        ok: false, marks,
        message: onLine
          ? `This vector is a multiple of ${$("\\vect{v}")}, but not the right one: the coefficient is ${$("\\ip{\\vect{x}}{\\vect{v}}")} divided by ${$("\\norm{\\vect{v}}^2")}.`
          : `The projection onto ${$("\\vect{v}")} is a multiple of ${$("\\vect{v}")}.`,
      };
    },
  };
}

/** The coefficient ⟨x, u⟩/‖u‖² of u in the projection onto an orthogonal basis. */
function stepCoeff(x: FVec, u: FVec, uName: string, cName: string, prereqs: number[], intro?: string): Step {
  const xu = fdot(x, u), uu = normSq(u), c = projCoeff(x, u);
  return {
    title: `The coefficient of ${$(uName)}`,
    intro,
    groups: [{ type: "scalar", before: $(`${cName} = \\ip{${X}}{${uName}} / \\norm{${uName}}^2 =`) }],
    answer: [str(c)],
    check: exact([c], `Compute ${$(`\\ip{${X}}{${uName}}`)} and ${$(`\\norm{${uName}}^2`)} separately, then divide.`),
    hints: [
      `Compute the inner product ${$(`\\ip{${X}}{${uName}}`)} and the squared length ${$(`\\norm{${uName}}^2`)}, then divide.`,
      `${$(`\\ip{${X}}{${uName}} = ${ipExpand(x, u)} = ${slashTex(xu)}`)} and ${$(`\\norm{${uName}}^2 = ${normSqExpand(u)} = ${slashTex(uu)}`)}.`,
    ],
    worked: $$(`${cName} = \\frac{\\ip{${X}}{${uName}}}{\\norm{${uName}}^2} = \\frac{${ipExpand(x, u)}}{${normSqExpand(u)}} = ${ratioTex(xu, uu)}`),
    prereqs,
  };
}

/** The projection c₁u₁ + c₂u₂ onto the plane with orthogonal basis u₁, u₂. */
function stepPlaneProj(x: FVec, us: FVec[], names: string[], prereqs: number[]): Step {
  const cs = us.map(u => projCoeff(x, u));
  const p = combo(cs, us);
  const terms = cs.map((c, j) => `${parenTex(c)} ${vecTex(us[j])}`).join(" + ");
  const vectors = cs.map((c, j) => vecTex(combo([c], [us[j]]))).join(" + ");
  return vecStep(
    `Find the projection ${$(`\\operatorname{proj}_W ${X}`)}`,
    $(`\\operatorname{proj}_W ${X} =`),
    p,
    [
      `Add the projections onto the orthogonal basis vectors: ${$(`\\operatorname{proj}_W ${X} = c_1 ${names[0]} + c_2 ${names[1]}`)}, with the coefficients you found.`,
      `${$(`\\operatorname{proj}_W ${X} = ${cs.map((c, j) => `${parenTex(c, slashTex)} ${names[j]}`).join(" + ")}`)}.`,
    ],
    $$(`\\operatorname{proj}_W ${X} = ${terms} = ${vectors} = ${vecTex(p)}`),
    prereqs,
    `Multiply each basis vector by its coefficient, then add.`,
  );
}

/** The component z = x − p of x orthogonal to the subspace. */
function stepOrthComponent(x: FVec, p: FVec, vs: FVec[], vNames: string[], pName: string, prereqs: number[]): Step {
  const z = fsub(x, p);
  const checks = vs.map((v, i) => `\\ip{\\vect{z}}{${vNames[i]}} &= ${ipExpand(z, v)} = ${fracTex(fdot(z, v))}`).join(" \\\\ ");
  return vecStep(
    `Find the orthogonal component ${$(`\\vect{z} = ${X} - ${pName}`)}`,
    $(`\\vect{z} = ${X} - ${pName} =`),
    z,
    [`Subtract the projection from ${$(X)}, entry by entry.`],
    $$(`\\vect{z} = ${X} - ${pName} = ${vecTex(x)} - ${vecTex(p)} = ${vecTex(z)}`)
      + `<p>Check: ${$("\\vect{z}")} is orthogonal to ${vs.length === 1 ? $(vNames[0]) : "every spanning vector"},</p>${$$(`\\begin{aligned} ${checks} \\end{aligned}`)}`
      + `<p>The distance from ${$(X)} to ${vs.length === 1 ? "the line" : $("W")} is ${$(`\\norm{\\vect{z}} = ${sqrtTex(normSq(z))}`)}.</p>`,
    prereqs,
    `Subtract each entry of the projection from the matching entry of ${$(X)}.`,
  );
}

/** "− c" in TeX, written "+ |c|" when c is negative. */
const minusTimes = (c: Fraction) => (c.num < 0n ? `+ ${fracTex({ num: -c.num, den: c.den })}` : `- ${fracTex(c)}`);

/** Gram–Schmidt's second vector u₂ = v₂ − (⟨v₂, u₁⟩/‖u₁‖²)u₁, with u₁ = v₁. Nonzero multiples are right too. */
function stepGramSchmidt(v1: FVec, v2: FVec, prereqs: number[]): Step {
  const { raw, u2 } = gramSchmidt2(v1, v2);
  const a = fdot(v2, v1), b = normSq(v1);
  const scaled = !raw.every((x, i) => equals(x, u2[i]));
  return {
    title: `Find an orthogonal basis with Gram–Schmidt: ${$("\\vect{u}_2")}`,
    intro: `<p>Keep ${$("\\vect{u}_1 = \\vect{v}_1")}, and subtract from ${$("\\vect{v}_2")} its projection onto ${$("\\vect{u}_1")}. Then ${$("\\vect{u}_1, \\vect{u}_2")} is an orthogonal basis of \\(W\\). You can scale ${$("\\vect{u}_2")} to clear fractions.</p>`,
    groups: [{ type: "vec", n: 3, before: $("\\vect{u}_2 =") }],
    answer: u2.map(str),
    check(values): Verdict {
      const got = parseAll(values);
      if (got.some(g => g === null)) return { ok: false };
      const u = got as FVec;
      const no = (message: string): Verdict => ({ ok: false, marks: u.map(() => false), message });
      if (isZeroVec(u)) return no(`${$("\\vect{u}_2")} can't be the zero vector.`);
      if (!isZero(fdot(u, v1))) return no(`This vector isn't orthogonal to ${$("\\vect{u}_1 = \\vect{v}_1")}: ${$(`\\ip{\\vect{u}_2}{\\vect{v}_1} = ${slashTex(fdot(u, v1))}`)}, not 0.`);
      if (rankOf([v1, v2, u]) > 2) return no(`This vector is orthogonal to ${$("\\vect{v}_1")}, but it isn't in \\(W\\). Start from ${$("\\vect{v}_2")}.`);
      return { ok: true, marks: u.map(() => true) };
    },
    hints: [
      `${$(`\\vect{u}_2 = \\vect{v}_2 - \\dfrac{\\ip{\\vect{v}_2}{\\vect{u}_1}}{\\norm{\\vect{u}_1}^2} \\vect{u}_1`)}.`,
      `${$(`\\ip{\\vect{v}_2}{\\vect{u}_1} = ${slashTex(a)}`)} and ${$(`\\norm{\\vect{u}_1}^2 = ${slashTex(b)}`)}, so ${$(`\\vect{u}_2 = \\vect{v}_2 - ${parenTex(projCoeff(v2, v1), slashTex)} \\vect{v}_1`)}.`,
    ],
    worked: $$(`\\vect{u}_2 = \\vect{v}_2 - \\frac{\\ip{\\vect{v}_2}{\\vect{u}_1}}{\\norm{\\vect{u}_1}^2} \\vect{u}_1 = ${vecTex(v2)} ${minusTimes(projCoeff(v2, v1))} ${vecTex(v1)} = ${vecTex(raw)}`)
      + (scaled
        ? `<p>Scaling ${$("\\vect{u}_2")} doesn't change the projection onto it, so the steps below use the simpler multiple ${$(`\\vect{u}_2 = ${vecTex(u2)}`)}.</p>`
        : "")
      + `<p>Check: ${$(`\\ip{\\vect{u}_1}{\\vect{u}_2} = ${ipExpand(v1, u2)} = 0`)}.</p>`,
    prereqs,
    shownNote: "(every nonzero multiple of this vector is right too)",
  };
}

// ⋘──────── Steps: least squares ────────⋙

interface LsqNames { A: string; b: string; x: string }

/** Aᵀ, whose rows are the columns of A. At partial support, the student writes it, once per problem. */
function stepTranspose(cols: FVec[], nm: LsqNames, prereqs: number[]): Step {
  const A = fromCols(cols), m = A.length, n = cols.length;
  return {
    title: `Write the transpose ${$(`${nm.A}\\trans`)}`,
    intro: `<p>The next steps use ${$(`${nm.A}\\trans`)}, so writing it first can help. This step is optional: you can skip it, and Show doesn't count as a hint.</p>`,
    groups: [{ type: "mat", rows: n, cols: m, before: $(`${nm.A}\\trans =`) }],
    answer: cols.flat().map(str),
    check: exact(cols.flat(), `Row \\(i\\) of ${$(`${nm.A}\\trans`)} is column \\(i\\) of ${$(nm.A)}.`),
    hints: [
      `The rows of ${$(`${nm.A}\\trans`)} are the columns of ${$(nm.A)}. ${$(nm.A)} is ${m} × ${n}, so ${$(`${nm.A}\\trans`)} is ${n} × ${m}.`,
      `Row 1 of ${$(`${nm.A}\\trans`)} is column 1 of ${$(nm.A)}: ${$(`\\begin{bmatrix} ${cols[0].map(fracTex).join(" & ")} \\end{bmatrix}`)}.`,
    ],
    worked: $$(`${nm.A} = ${matTex(A)} \\qquad \\Longrightarrow \\qquad ${nm.A}\\trans = ${matTex(cols)}`),
    prereqs,
    optional: true,
  };
}

/** A matrix of TeX entries. */
const texMat = (m: string[][]) => `\\begin{bmatrix} ${m.map(row => row.join(" & ")).join(" \\\\ ")} \\end{bmatrix}`;

function stepAtAOf(cols: FVec[], nm: LsqNames, prereqs: number[]): Step {
  const A = fromCols(cols), n = cols.length;
  const AtA: FMat = cols.map(a => cols.map(c => fdot(a, c)));
  // Each entry as the sum of products, as in an inner product.
  const expanded = texMat(cols.map(a => cols.map(c => ipExpand(a, c))));
  return {
    title: `Compute ${$(`${nm.A}\\trans ${nm.A}`)}`,
    groups: [{ type: "mat", rows: n, cols: n, before: $(`${nm.A}\\trans ${nm.A} =`) }],
    answer: AtA.flat().map(str),
    check: exact(AtA.flat(), `Entry \\((i, j)\\) of ${$(`${nm.A}\\trans ${nm.A}`)} is the inner product of columns \\(i\\) and \\(j\\) of ${$(nm.A)}.`),
    hints: [
      `Entry \\((i, j)\\) of ${$(`${nm.A}\\trans ${nm.A}`)} is the inner product of column \\(i\\) and column \\(j\\) of ${$(nm.A)}. So ${$(`${nm.A}\\trans ${nm.A}`)} is symmetric, and its diagonal entries are the squared lengths of the columns.`,
      `${$(`${nm.A}\\trans ${nm.A} = ${matTex(cols)} ${matTex(A)}`)}.`,
    ],
    worked: $$(`${nm.A}\\trans ${nm.A} = \\underbrace{${matTex(cols)}}_{${nm.A}\\trans} \\underbrace{${matTex(A)}}_{${nm.A}} = ${expanded} = ${matTex(AtA)}`),
    prereqs,
  };
}

function stepAtbOf(cols: FVec[], b: FVec, nm: LsqNames, prereqs: number[]): Step {
  const Atb = cols.map(a => fdot(a, b));
  const expanded = texMat(cols.map(a => [ipExpand(a, b)]));
  return vecStep(
    `Compute ${$(`${nm.A}\\trans ${nm.b}`)}`,
    $(`${nm.A}\\trans ${nm.b} =`),
    Atb,
    [
      `Entry \\(i\\) of ${$(`${nm.A}\\trans ${nm.b}`)} is the inner product of column \\(i\\) of ${$(nm.A)} with ${$(nm.b)}.`,
      `${$(`${nm.A}\\trans ${nm.b} = ${matTex(cols)} ${vecTex(b)}`)}.`,
    ],
    $$(`${nm.A}\\trans ${nm.b} = \\underbrace{${matTex(cols)}}_{${nm.A}\\trans} \\underbrace{${vecTex(b)}}_{${nm.b}} = ${expanded} = ${vecTex(Atb)}`),
    prereqs,
  );
}

/** A link to practice a row reduction (on the Gaussian elimination page). */
function practiceLink(aug: FMat): string {
  const base = (typeof window === "undefined" ? undefined : (window as { GAUSSIAN_PRACTICE_URL?: string }).GAUSSIAN_PRACTICE_URL) ?? "/tools/gaussian_elimination_practice/";
  return `<a href="${base}?m=${aug.map(r => r.map(str).join(",")).join(";")}" target="_blank" rel="noopener">practice this row reduction</a>`;
}

/** Solving the normal equation, by row reducing [AᵀA | Aᵀb]. */
function normalSolveParts(cols: FVec[], b: FVec) {
  const s = normalSolution(cols, b);
  const aug = s.AtA.map((row, i) => [...row, s.Atb[i]]);
  return { ...s, aug, rrefAug: rref(aug).r };
}

function stepSolveNormal(cols: FVec[], b: FVec, nm: LsqNames, prereqs: number[]): Step {
  const s = normalSolveParts(cols, b);
  const xs = `${nm.x}_*`;
  return {
    ...vecStep(
      `Solve the normal equation ${$(`${nm.A}\\trans ${nm.A} ${nm.x} = ${nm.A}\\trans ${nm.b}`)}`,
      $(`${xs} =`),
      s.xstar,
      [
        `Row reduce the augmented matrix ${$(`\\left[\\, ${nm.A}\\trans ${nm.A} \\;\\middle|\\; ${nm.A}\\trans ${nm.b} \\,\\right]`)}. The columns of ${$(nm.A)} are linearly independent, so there is exactly one solution.`,
        `<p>The augmented matrix is</p>${$$(augTex(s.aug))}<p>(${practiceLink(s.aug)}).</p>`,
      ],
      $$(`${augTex(s.aug)} \\sim ${augTex(s.rrefAug)}`) + `<p>so the least squares solution is ${$(`${xs} = ${vecTex(s.xstar)}`)}.</p>`,
      prereqs,
    ),
    check(values) {
      const got = parseAll(values);
      if (got.some(g => g === null)) return { ok: false };
      const u = got as FVec;
      const marks = u.map((g, i) => equals(g, s.xstar[i]));
      if (marks.every(Boolean)) return { ok: true, marks };
      const lhs = matVec(s.AtA, u);
      return {
        ok: false, marks,
        message: `With this vector, ${$(`${nm.A}\\trans ${nm.A} ${nm.x} = ${vecTex(lhs)}`)}, but ${$(`${nm.A}\\trans ${nm.b} = ${vecTex(s.Atb)}`)}.`,
      };
    },
  };
}

function stepAxOf(cols: FVec[], b: FVec, nm: LsqNames, prereqs: number[]): Step {
  const { xstar, p } = normalSolution(cols, b);
  const A = fromCols(cols);
  return vecStep(
    `Find the projection ${$(`${nm.A}${nm.x}_*`)} of ${$(nm.b)} onto ${$(`\\colspace{${nm.A}}`)}`,
    $(`${nm.A}${nm.x}_* =`),
    p,
    [`Multiply ${$(nm.A)} by ${$(`${nm.x}_*`)}: entry \\(i\\) is row \\(i\\) of ${$(nm.A)} times ${$(`${nm.x}_*`)}.`],
    $$(`${nm.A}${nm.x}_* = ${matTex(A)} ${vecTex(xstar)} = ${vecTex(p)}`)
      + `<p>Why ${$(`${nm.A}${nm.x}_*`)} is the projection of ${$(nm.b)} onto ${$(`\\colspace{${nm.A}}`)}:</p>`
      + `<ul><li>${$(`${nm.A}${nm.x}_*`)} is a linear combination of the columns of ${$(nm.A)}, so ${$(`${nm.A}${nm.x}_*`)} is in ${$(`\\colspace{${nm.A}}`)}.</li>`
      + `<li>${$(`${nm.x}_*`)} solves the normal equation ${$(`${nm.A}\\trans ${nm.A} ${nm.x}_* = ${nm.A}\\trans ${nm.b}`)}, so</li></ul>`
      + $$(`${nm.A}\\trans (${nm.b} - ${nm.A}${nm.x}_*) = ${nm.A}\\trans ${nm.b} - ${nm.A}\\trans ${nm.A} ${nm.x}_* = \\vect{0}.`)
      + `<p>Entry \\(i\\) of ${$(`${nm.A}\\trans (${nm.b} - ${nm.A}${nm.x}_*)`)} is the inner product of column \\(i\\) of ${$(nm.A)} with ${$(`${nm.b} - ${nm.A}${nm.x}_*`)}.
        So ${$(`${nm.b} - ${nm.A}${nm.x}_*`)} is orthogonal to every column of ${$(nm.A)}, and so to ${$(`\\colspace{${nm.A}}`)}.
        Then ${$(`${nm.b} = ${nm.A}${nm.x}_* + (${nm.b} - ${nm.A}${nm.x}_*)`)} writes ${$(nm.b)} as a vector in ${$(`\\colspace{${nm.A}}`)} plus a vector orthogonal to ${$(`\\colspace{${nm.A}}`)}.
        There is only one way to do that, and its first part is the projection:</p>`
      + $$(`${nm.A}${nm.x}_* = \\operatorname{proj}_{\\colspace{${nm.A}}} ${nm.b}.`)
      + `<p>So ${$(`${nm.A}${nm.x}_*`)} is the point of ${$(`\\colspace{${nm.A}}`)} closest to ${$(nm.b)}.</p>`,
    prereqs,
  );
}

function stepResidual(cols: FVec[], b: FVec, nm: LsqNames, prereqs: number[]): Step {
  const { p, r } = normalSolution(cols, b);
  const Atr = cols.map(a => fdot(a, r));
  return vecStep(
    `Find the residual ${$(`\\vect{r} = ${nm.b} - ${nm.A}${nm.x}_*`)}`,
    $(`\\vect{r} =`),
    r,
    [`Subtract ${$(`${nm.A}${nm.x}_*`)} from ${$(nm.b)}, entry by entry.`],
    $$(`\\vect{r} = ${nm.b} - ${nm.A}${nm.x}_* = ${vecTex(b)} - ${vecTex(p)} = ${vecTex(r)}`)
      + `<p>Check: the residual is orthogonal to every column of ${$(nm.A)}, ${$(`${nm.A}\\trans \\vect{r} = ${vecTex(Atr)}`)}.
        The least squares error is ${$(`\\norm{${nm.b} - ${nm.A}${nm.x}_*} = \\norm{\\vect{r}} = ${sqrtTex(normSq(r))}`)}, the shortest distance from ${$(nm.b)} to ${$(`\\colspace{${nm.A}}`)}.</p>`,
    prereqs,
  );
}

// ⋘──────── Steps: a line of best fit ────────⋙

const pointList = (xs: FVec, ys: FVec) => xs.map((x, i) => $(`(${slashTex(x)}, ${slashTex(ys[i])})`)).join(", ");

function stepDesignMatrix(xs: FVec, ys: FVec): Step {
  const A = fromCols([xs.map(() => ({ num: 1n, den: 1n })), xs]);
  const expected = [...A.flat(), ...ys];
  const nA = A.flat().length;
  const equations = xs.map((x, i) => `c_0 + ${parenTex(x)} c_1 &= ${fracTex(ys[i])}`).join(" \\\\ ");
  return {
    title: `Write the matrix \\(A\\) and the vector ${$("\\vect{y}")} of the system ${$("A\\vect{c} = \\vect{y}")}`,
    intro: `<p>Each data point ${$("(x_i, y_i)")} gives one equation ${$("c_0 + c_1 x_i = y_i")} for the unknowns ${$("\\vect{c} = (c_0, c_1)")}.</p>`,
    groups: [
      { type: "mat", rows: xs.length, cols: 2, before: $("A =") },
      { type: "vec", n: ys.length, before: $("\\vect{y} =") },
    ],
    answer: expected.map(str),
    check(values) {
      const marks = parseAll(values).map((g, i) => g !== null && equals(g, expected[i]));
      if (marks.every(Boolean)) return { ok: true, marks };
      const messages: string[] = [];
      if (!marks.slice(0, nA).every(Boolean)) messages.push(`Row \\(i\\) of \\(A\\) holds the coefficients of ${$("c_0")} and ${$("c_1")} in the equation for point \\(i\\).`);
      if (!marks.slice(nA).every(Boolean)) messages.push(`Entry \\(i\\) of ${$("\\vect{y}")} is the right side of the equation for point \\(i\\).`);
      return { ok: false, marks, message: messages.join(" ") };
    },
    hints: [
      `Row \\(i\\) of \\(A\\) is ${$("\\begin{bmatrix} 1 & x_i \\end{bmatrix}")}: the coefficient of ${$("c_0")} is 1, and the coefficient of ${$("c_1")} is ${$("x_i")}. Entry \\(i\\) of ${$("\\vect{y}")} is ${$("y_i")}, the height of point \\(i\\).`,
    ],
    worked: $$(`\\left\\{ \\begin{aligned} ${equations} \\end{aligned} \\right. \\qquad \\Longrightarrow \\qquad \\underbrace{${matTex(A)}}_{A} \\begin{bmatrix} c_0 \\\\ c_1 \\end{bmatrix} = \\underbrace{${vecTex(ys)}}_{\\vect{y}}`)
      + `<p>The data points aren't on one line, so this system has no solution, and the line of best fit is its least squares solution.</p>`,
    prereqs: [],
  };
}

function stepLine(cols: FVec[], ys: FVec, prereqs: number[]): Step {
  const s = normalSolveParts(cols, ys);
  const [c0, c1] = s.xstar;
  return {
    title: `Solve the normal equation ${$("A\\trans A \\vect{c} = A\\trans \\vect{y}")} for the line`,
    groups: [
      { type: "scalar", before: $("y ="), after: $("+") },
      { type: "scalar", after: $("x"), joined: true },
    ],
    answer: [str(c0), str(c1)],
    check(values) {
      const got = parseAll(values);
      if (got.some(g => g === null)) return { ok: false };
      const u = got as FVec;
      const marks = u.map((g, i) => equals(g, s.xstar[i]));
      if (marks.every(Boolean)) return { ok: true, marks };
      return {
        ok: false, marks,
        message: `With these coefficients, ${$(`A\\trans A \\vect{c} = ${vecTex(matVec(s.AtA, u))}`)}, but ${$(`A\\trans \\vect{y} = ${vecTex(s.Atb)}`)}.`,
      };
    },
    hints: [
      `Row reduce the augmented matrix ${$("\\left[\\, A\\trans A \\;\\middle|\\; A\\trans \\vect{y} \\,\\right]")} to find ${$("c_0")} and ${$("c_1")}.`,
      `<p>The augmented matrix is</p>${$$(augTex(s.aug))}<p>(${practiceLink(s.aug)}).</p>`,
    ],
    worked: $$(`${augTex(s.aug)} \\sim ${augTex(s.rrefAug)}`)
      + `<p>so ${$(`c_0 = ${slashTex(c0)}`)} and ${$(`c_1 = ${slashTex(c1)}`)}, and the line of best fit is ${$(`y = ${lineTex(c0, c1)}`)}.
        Its sum of squared residuals is ${$(`\\norm{\\vect{y} - A\\vect{c}}^2 = ${slashTex(normSq(s.r))}`)}, the least of every line.</p>`,
    prereqs,
  };
}

// ⋘──────── Steps: checking against the plot ────────⋙

/**
 * Whether the problem gets a step that compares the answer with the plot: only flat (2D) plots, since
 * reading values from a 3D plot is hard. A line fit is drawn in the plane, whatever the number of points.
 */
const hasPicture = (p: Problem) => familyOf(p.kind) === "fit" || p.target.length === 2;

/**
 * The last step: compare the answer with the picture, where the page draws the answer (without its
 * values) until the steps are finished.
 */
function stepPlotCheck(p: Problem, prereqs: number[]): Step {
  const family = familyOf(p.kind);
  const { xstar, p: proj } = normalSolution(p.cols, p.target);
  let what: string, question: string, hints: string[], worked: string;
  if (family === "fit") {
    const [c0, c1] = xstar;
    what = `The plot draws the line of best fit (blue), as the page computed it, without its equation.`;
    question = "Is your line close to the blue line in the plot?";
    hints = [`On your line, ${$(`y = ${slashTex(c0)}`)} at ${$("x = 0")}, and \\(y\\) changes by ${$(slashTex(c1))} for each step of 1 to the right. Read the same values from the blue line, using the labels on the axes.`];
    worked = `<p>The blue line is ${$(`y = ${lineTex(c0, c1)}`)}: at ${$("x = 0")} its height is ${$(slashTex(c0))}, and its slope is ${$(slashTex(c1))}.</p>`;
  } else if (p.kind === "lsq") {
    what = `The plot draws ${$("A\\vect{x}_*")} (vermillion) as the page computed it, reached from the origin by the dashed arrows ${$("x_1 \\vect{a}_1")} and then ${$("x_2 \\vect{a}_2")}, along the columns of \\(A\\).`;
    question = `Does each dashed arrow look like your entry of ${$("\\vect{x}_*")} times its column?`;
    hints = [`Compare the length of each dashed arrow with the length of its column ${$("\\vect{a}_i")}: the ratio is ${$("|x_i|")}, and the arrow points the opposite way when ${$("x_i")} is negative.`];
    worked = `<p>With ${$(`\\vect{x}_* = ${vecTex(xstar)}`)}, the dashed arrows are ${xstar.map((c, i) => $(`${parenTex(c)} \\vect{a}_{${i + 1}}`)).join(" and ")}, and they end at ${$(`A\\vect{x}_* = ${vecTex(proj)}`)}.</p>`;
  } else {
    const name = family === "proj" ? "\\vect{p}" : "A\\vect{x}_*";
    what = `The plot draws the projection ${$(name)} (vermillion) as the page computed it, without its values.`;
    question = `Is your projection close to the tip of ${$(name)} in the plot?`;
    hints = [`Read the coordinates of the tip of ${$(name)} from the labels on the axes, and compare them with the entries you found.`];
    worked = `<p>The tip of ${$(name)} in the plot is at ${$(vecTex(proj))}, the projection found above.</p>`;
  }
  return {
    title: "Compare your answer with the plot",
    intro: `<p>${what} Your answer should match it.</p>`,
    groups: [{ type: "yesno", before: question }],
    answer: ["yes"],
    check: values => (yesNo(values[0]) === "yes"
      ? { ok: true }
      : { ok: false, message: "Your answer is right, so the plot should match it. Look again, more closely: read the values from the labels on the axes." }),
    hints,
    worked,
    prereqs,
    final: true,
    autoCheck: "yes",
  };
}

// At partial support, the page works the arithmetic (inner products, AᵀA, Aᵀb, and Ax*) and the
// student works the main steps (including Aᵀ, once). At the last level, the student works the whole
// problem by hand and enters only the answers (the steps marked with `answer`).
const partial = (step: Step): Step => ({ ...step, given: 2 });
const stepIp = (...a: Parameters<typeof stepIpOf>) => partial(stepIpOf(...a));
const stepAtA = (...a: Parameters<typeof stepAtAOf>) => partial(stepAtAOf(...a));
const stepAtb = (...a: Parameters<typeof stepAtbOf>) => partial(stepAtbOf(...a));
const stepAx = (...a: Parameters<typeof stepAxOf>) => partial(stepAxOf(...a));

// ⋘──────── Problems ────────⋙

const VS = ["\\vect{v}_1", "\\vect{v}_2"];

/** The task. The given vectors, matrices, or points are in the entries just above it. */
function statementHtml(p: Problem): string {
  switch (p.kind) {
    case "projv":
      return `<p>Find the projection of ${$(X)} onto ${$("\\vect{v}")}.</p>`;
    case "projline":
      return `<p>Find the projection of ${$(X)} onto the line through ${$("\\vect{v}")}, and the component of ${$(X)} orthogonal to ${$("\\vect{v}")}.</p>`;
    case "projorth":
    case "projgs":
      return `<p>Find the projection of ${$(X)} onto ${$(`W = \\Span{${VS.join(", ")}}`)}.</p>`;
    case "lsq":
      return `<p>Find the least squares solution of ${$("A\\vect{x} = \\vect{b}")}.</p>`;
    case "lsqres":
      return `<p>Find the least squares solution ${$("\\vect{x}_*")} of ${$("A\\vect{x} = \\vect{b}")}, the projection ${$("A\\vect{x}_*")} of ${$("\\vect{b}")} onto ${$("\\colspace{A}")}, and the residual ${$("\\vect{b} - A\\vect{x}_*")}.</p>`;
    case "fitline":
      return `<p>Find the line ${$("y = c_0 + c_1 x")} of best fit (in the least squares sense) for the data points.</p>`;
  }
}

/** An answer to the problem: at the last support level, the student enters only these. */
const answer = (step: Step): Step => ({ ...step, final: true });

/** Whether problems end with the step that compares the answer with the plot (hidden for now). */
export const PLOT_CHECK = false;

/** The steps, then (when the problem is drawn, and plotCheck is set) the comparison with the plot. */
export function buildSteps(p: Problem, plotCheck = PLOT_CHECK): Step[] {
  const steps = buildWorkSteps(p);
  if (plotCheck && hasPicture(p)) steps.push(stepPlotCheck(p, [steps.length - 1]));
  return steps;
}

function buildWorkSteps(p: Problem): Step[] {
  const { cols, target: x } = p;
  const lsqNames: LsqNames = { A: "A", b: "\\vect{b}", x: "\\vect{x}" };
  switch (p.kind) {
    case "projv":
    case "projline": {
      const v = cols[0];
      const steps = [
        stepIp(x, v, X, "\\vect{v}", []),
        stepIp(v, v, "\\vect{v}", "\\vect{v}", []),
        answer(stepProjOntoVector(x, v, [0, 1])),
      ];
      if (p.kind === "projline") {
        steps.push(answer(stepOrthComponent(x, combo([projCoeff(x, v)], [v]), [v], ["\\vect{v}"], "\\operatorname{proj}_{\\vect{v}} \\vect{x}", [2])));
      }
      return steps;
    }
    case "projorth": {
      const [v1, v2] = cols;
      return [
        stepIp(v1, v2, VS[0], VS[1], [], `<p>The spanning vectors are orthogonal, so they are an orthogonal basis of \\(W\\), and the projection onto \\(W\\) is the sum of the projections onto ${$(VS[0])} and ${$(VS[1])}.</p>`),
        stepCoeff(x, v1, VS[0], "c_1", [0]),
        stepCoeff(x, v2, VS[1], "c_2", [0]),
        answer(stepPlaneProj(x, [v1, v2], VS, [1, 2])),
        answer(stepOrthComponent(x, combo([projCoeff(x, v1), projCoeff(x, v2)], [v1, v2]), [v1, v2], VS, "\\operatorname{proj}_W \\vect{x}", [3])),
      ];
    }
    case "projgs": {
      const [v1, v2] = cols;
      const { u2 } = gramSchmidt2(v1, v2);
      const U = ["\\vect{u}_1", "\\vect{u}_2"];
      return [
        stepIp(v1, v2, VS[0], VS[1], [], `<p>The inner product isn't 0, so the spanning vectors aren't orthogonal, and adding the projections onto ${$(VS[0])} and ${$(VS[1])} would give the wrong point. First, find an orthogonal basis of \\(W\\).</p>`),
        stepGramSchmidt(v1, v2, [0]),
        stepCoeff(x, v1, U[0], "c_1", [1], `<p>Here ${$(`\\vect{u}_1 = \\vect{v}_1 = ${vecTex(v1)}`)}.</p>`),
        stepCoeff(x, u2, U[1], "c_2", [1], `<p>Use ${$(`\\vect{u}_2 = ${vecTex(u2)}`)}. (A multiple of it gives the same projection.)</p>`),
        answer(stepPlaneProj(x, [v1, u2], U, [2, 3])),
      ];
    }
    case "lsq":
      return [
        stepTranspose(cols, lsqNames, []),
        stepAtA(cols, lsqNames, []),
        stepAtb(cols, x, lsqNames, []),
        answer(stepSolveNormal(cols, x, lsqNames, [1, 2])),
      ];
    case "lsqres":
      return [
        stepTranspose(cols, lsqNames, []),
        stepAtA(cols, lsqNames, []),
        stepAtb(cols, x, lsqNames, []),
        answer(stepSolveNormal(cols, x, lsqNames, [1, 2])),
        answer(stepAx(cols, x, lsqNames, [3])),
        answer(stepResidual(cols, x, lsqNames, [4])),
      ];
    case "fitline": {
      const fitNames: LsqNames = { A: "A", b: "\\vect{y}", x: "\\vect{c}" };
      return [
        stepDesignMatrix(p.xs!, x),
        stepTranspose(cols, fitNames, [0]),
        stepAtA(cols, fitNames, [0]),
        stepAtb(cols, x, fitNames, [0]),
        answer(stepLine(cols, x, [2, 3])),
      ];
    }
  }
}

// ⋘──────── The page ────────⋙

type Hooks = Required<Pick<Parameters<typeof setupStepPractice<Problem, Kind>>[0], "onLoad" | "onStatus">>;
export type PracticeHooks = Hooks;

export function setupPracticePage(hooks: PracticeHooks): StepPractice<Problem> {
  return setupStepPractice<Problem, Kind>({
    prefix: "pl",
    key: "projection_least_squares",
    stages: STAGES,
    kinds: KINDS,
    helpText: "Guided Learning is a series of levels, from easy to hard: projections onto a vector, onto a line, and onto a plane, then least squares solutions and lines of best fit. Each level gives a new random problem of its kind each time. After two problems at a level with no hints, the page suggests the next level. To make your own problems in the picture, or to choose the kind of random problem, choose “Design your own problems” instead.",
    urlKeys: URL_KEYS,
    randomProblem: kind => randomProblem(kind),
    encode: encodeProblem,
    decode: decodeProblem,
    hasProblem,
    statementHtml,
    buildSteps,
    levels: {
      names: ["Full", "Partial", "None"],
      descriptions: ["The page works every step: a worked example", "The page does the arithmetic; you do the main steps", "Solve the whole problem by hand, then enter the answers"],
      helpText: "#pl-help-support",
    },
    noStepsHtml: NO_STEPS,
    onLoad: hooks.onLoad,
    onStatus: hooks.onStatus,
  });
}

const NO_STEPS = `<p class="sp-no-steps">This problem has no practice steps, so its full solution is shown below.
  Steps are available for the projection onto one nonzero vector, or onto a plane in ℝ³ spanned by two linearly independent vectors;
  for least squares with at most three linearly independent columns and more rows than columns;
  and for a line (not another curve) of best fit.</p>`;
