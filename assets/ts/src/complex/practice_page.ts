// ╭───────────────────────────────────────────────────────────────╮
// │                 Practice: complex numbers                      │
// ╰───────────────────────────────────────────────────────────────╯
// Random problems worked in checked steps (common/step_practice.ts): powers of i, arithmetic in
// the form a + bi, conjugates and moduli, division, and polar form. The math is in complex_math.ts.

import { Stage } from "../common/practice";
import { Group, Step, StepPractice, Verdict, exact, parseAll, setupStepPractice } from "../common/step_practice";
import { Fraction, add, equals, mul, neg, sub } from "../matrix/fraction";
import {
  C, F, KINDS, Kind, Polar, Problem, URL_KEYS, angleTex, argNumber, cParen, cTex, cadd, cconj, cdiv, cmul, cnormSq, cosSinTex, cpow,
  csub, decodeProblem, degreesText, encodeProblem, expTex, fracTex, fracText, hasProblem, ipow, isRootEntry, niceArg, normAngle,
  parenTex, parseRoot, pdiv, pmul, polarTex, randomProblem, rootEquals, rootPow, rootSquare, rootTex, rootText, sameAngle, slashTex,
  sqrtOf, toNumber,
} from "./complex_math";

const $ = (tex: string) => `\\(${tex}\\)`;
const $$ = (tex: string) => `\\[${tex}\\]`;

export const PIN_KEY = "complex_numbers_pinned";

// ⋘──────── Stages of the practice path ────────⋙

export const STAGES: (Stage & { kind: Kind })[] = [
  { id: "powi", kind: "powi", title: "Powers of i", note: "Find i⁰ and i¹, then start from i² = −1 and multiply by i one power at a time." },
  { id: "add", kind: "add", title: "Adding and subtracting", note: "Add or subtract the real parts and the imaginary parts separately." },
  { id: "mul", kind: "mul", title: "Multiplying", note: "Expand the product, then replace i² with −1." },
  { id: "conj", kind: "conj", title: "Conjugate and modulus", note: "Change the sign of the imaginary part, and find |z| = √(a² + b²)." },
  { id: "div", kind: "div", title: "Dividing", note: "Multiply the numerator and the denominator by the conjugate of the denominator." },
  { id: "polar", kind: "polar", title: "Polar form", note: "Find the modulus r and the angle θ, so that z = re^{iθ}." },
  { id: "polarmul", kind: "polarmul", title: "Multiplying in polar form", note: "Multiply the moduli and add the angles; for a quotient, divide the moduli and subtract the angles." },
  { id: "power", kind: "power", title: "Powers in polar form", note: "Write z in polar form, raise it to a power with De Moivre's theorem, then convert back to a + bi." },
];

// ⋘──────── Entry boxes ────────⋙

/** Boxes for a + bi: "<name> = [a] + [b] i". */
const complexGroups = (name: string): Group[] => [
  { type: "scalar", before: $(`${name} =`), after: $("+") },
  { type: "scalar", after: $("i"), joined: true },
];
const answerOf = (z: C) => [fracText(z.re), fracText(z.im)];

const ROOT_HELP = "Enter a number like <code>5</code> or <code>3/2</code>, or a square root like <code>√13</code>, <code>2√2</code>, <code>sqrt(13)</code>, or <code>√2/2</code>.";
const rootGroup = (before: string): Group => ({ type: "scalar", before, accept: isRootEntry, acceptHelp: ROOT_HELP, wide: true });
// How to type a square root, for the steps whose answer can be one.
const ROOT_INTRO = `<p>If the answer is a square root, type <code>sqrt</code> or <code>√</code>: for example, <code>sqrt(13)</code> or <code>√13</code> for ${$("\\sqrt{13}")}, <code>2sqrt(2)</code> or <code>2√2</code> for ${$("2\\sqrt{2}")}, and <code>sqrt(2)/2</code> for ${$("\\sqrt{2}/2")}.</p>`;
const angleGroup = (before: string): Group => ({ type: "scalar", before, after: $("\\pi") });

/** Checks a + bi, with a message for common mistakes. */
function complexCheck(expected: C, mistakes: { value: C; message: string }[] = [], fallback?: string) {
  return (values: string[]): Verdict => {
    const verdict = exact([expected.re, expected.im])(values);
    if (verdict.ok) return verdict;
    const got = parseAll(values);
    if (got.every(g => g !== null)) {
      const [a, b] = got as Fraction[];
      const hit = mistakes.find(m => equals(a, m.value.re) && equals(b, m.value.im));
      if (hit) return { ...verdict, message: hit.message };
      if (equals(a, expected.re) && equals(b, neg(expected.im))) return { ...verdict, message: "Check the sign of the imaginary part." };
    }
    return { ...verdict, message: fallback };
  };
}

/** An angle θ as a multiple of π: exactly, or (when it isn't a simple fraction of π) to within 0.001π. */
interface Angle { exact: Fraction | null; value: number }
const angleOf = (z: C): Angle => ({ exact: niceArg(z), value: argNumber(z) });
const angleText = (a: Angle) => (a.exact ? fracText(a.exact) : a.value.toFixed(4));
const angleShown = (a: Angle, display = false) => (a.exact ? angleTex(a.exact, display) : `${a.value.toFixed(4)}\\pi`);
function angleMatches(text: string, a: Angle): boolean | null {
  const got = parseAll([text])[0];
  if (got === null) return null;
  return a.exact ? sameAngle(toNumber(got), toNumber(a.exact)) : sameAngle(toNumber(got), a.value, 0.001);
}
const ANGLE_NOTE = "(other angles that differ by a multiple of 2π are right too)";

// ⋘──────── Steps ────────⋙

// With partial support, the page works these routine steps. The student works step 1 of every
// problem at partial support, so it is never one of them.
const partial = (step: Step): Step => ({ ...step, given: 2 });
const final = (step: Step): Step => ({ ...step, final: true });

// The largest power of i that is worked one power at a time (larger ones use the remainder of n ÷ 4).
export const POWI_STEP_BY_STEP = 5;

function powiSteps(n: number): Step[] {
  return n <= POWI_STEP_BY_STEP ? powiOneAtATime(n) : powiByRemainder(n);
}

/** iⁿ for a small n, one power at a time: i² = −1, then i³ = i² · i, and so on. */
function powiOneAtATime(n: number): Step[] {
  const iPow = (m: number) => (m === 1 ? "i^1" : `i^{${m}}`);
  if (n <= 1) {
    const value = ipow(n);
    return [final({
      title: `Find ${$(iPow(n))}`,
      groups: complexGroups(iPow(n)),
      answer: answerOf(value),
      check: complexCheck(value, [], n === 0 ? `Every nonzero number to the power ${$("0")} is ${$("1")}.` : `Every number to the power ${$("1")} is itself.`),
      hints: [n === 0 ? `Every nonzero number to the power ${$("0")} is ${$("1")}.` : `Every number to the power ${$("1")} is itself.`],
      worked: $$(`${iPow(n)} = ${cTex(value, true)}`),
      prereqs: [],
    })];
  }
  const steps: Step[] = [];
  for (let m = 2; m <= n; m++) {
    const value = ipow(m), prev = ipow(m - 1);
    const name = iPow(m), prevName = m === 2 ? "i" : iPow(m - 1);
    const step: Step = m === 2
      ? {
        title: `Find ${$("i^2")}`,
        groups: complexGroups("i^2"),
        answer: answerOf(value),
        check: complexCheck(value, [], `The imaginary unit ${$("i")} is defined by its square.`),
        hints: [`The imaginary unit ${$("i")} is the number whose square is ${$("-1")}.`],
        worked: $$("i^2 = -1"),
        prereqs: [],
      }
      : {
        title: `Find ${$(name)}`,
        intro: `<p>Multiply the previous power by ${$("i")}: ${$(`${name} = ${prevName} \\cdot i`)}.</p>`,
        groups: complexGroups(name),
        answer: answerOf(value),
        check: complexCheck(value, [], `${$(`${name} = ${prevName} \\cdot i`)}, and ${$("i^2 = -1")}.`),
        hints: [
          `${$(`${name} = ${prevName} \\cdot i = ${cParen(prev)} \\cdot i`)}.`,
          ...(m === 3 || m === 4 ? [`Use ${$("i^2 = -1")}.`] : []),
        ],
        worked: $$(`${name} = ${prevName} \\cdot i = ${cParen(prev, true)} \\cdot i${m === 4 ? " = -i^2" : ""} = ${cTex(value, true)}`),
        prereqs: [steps.length - 1],
      };
    steps.push(m === n ? final(step) : step);
  }
  return steps;
}

/** iⁿ for a large n, from the remainder of n divided by 4. */
function powiByRemainder(n: number): Step[] {
  const q = Math.floor(n / 4), r = n % 4;
  const value = ipow(n);
  const cycle = "i^1 = i, \\quad i^2 = -1, \\quad i^3 = -i, \\quad i^4 = 1";
  return [
    {
      title: `Divide ${n} by 4`,
      intro: `<p>The powers of ${$("i")} repeat every four steps, so write ${$(`${n} = 4q + r`)} with a remainder ${$("r")} from 0 to 3.</p>`,
      groups: [{ type: "scalar", before: $(`${n} = 4 \\cdot`) }, { type: "scalar", before: $("+") }],
      answer: [`${q}`, `${r}`],
      check: exact([F(q), F(r)], `The remainder is between 0 and 3, and ${$("4q + r")} must equal ${n}.`),
      hints: [`Find the largest multiple of 4 that is at most ${n}.`, `${$(`4 \\cdot ${q} = ${4 * q}`)}, and ${$(`${n} - ${4 * q} = ${r}`)}.`],
      worked: $$(`${n} = 4 \\cdot ${q} + ${r}`),
      prereqs: [],
    },
    final({
      title: `Find ${$(`i^{${n}}`)}`,
      groups: complexGroups(`i^{${n}}`),
      answer: answerOf(value),
      check: complexCheck(value, [], `Only the remainder ${r} matters: ${$(`i^{${n}} = i^{${r}}`)}.`),
      hints: [
        `Since ${$("i^4 = 1")}, ${$(`i^{${n}} = (i^4)^{${q}} \\cdot i^{${r}} = i^{${r}}`)}.`,
        `${$(cycle)}, and ${$("i^0 = 1")}.`,
      ],
      worked: $$(`i^{${n}} = \\left(i^4\\right)^{${q}} \\cdot i^{${r}} = 1^{${q}} \\cdot i^{${r}} = ${cTex(value, true)}`),
      prereqs: [0],
    }),
  ];
}

function addSteps(z: C, w: C): Step[] {
  const sum = cadd(z, w), diff = csub(z, w);
  const parts = (op: string, x: C) => `\\left(${fracTex(z.re)} ${op} ${parenTex(w.re, true)}\\right) + \\left(${fracTex(z.im)} ${op} ${parenTex(w.im, true)}\\right)i = ${cTex(x, true)}`;
  return [
    final({
      title: `Find ${$("z + w")}`,
      groups: complexGroups("z + w"),
      answer: answerOf(sum),
      check: complexCheck(sum, [], "Add the real parts, and add the imaginary parts."),
      hints: [
        `Add the real parts, and add the imaginary parts: ${$("(a + bi) + (c + di) = (a + c) + (b + d)i")}.`,
        `The real part is ${$(`${slashTex(z.re)} + ${parenTex(w.re)}`)}, and the imaginary part is ${$(`${slashTex(z.im)} + ${parenTex(w.im)}`)}.`,
      ],
      worked: $$(`z + w = ${parts("+", sum)}`),
      prereqs: [],
    }),
    final({
      title: `Find ${$("z - w")}`,
      groups: complexGroups("z - w"),
      answer: answerOf(diff),
      check: complexCheck(diff, [
        { value: cx(sub(z.re, w.re), add(z.im, w.im)), message: `Subtract both parts of ${$("w")}, the imaginary part too.` },
        { value: csub(w, z), message: `That's ${$("w - z")}: subtract ${$("w")} from ${$("z")}.` },
      ], "Subtract the real parts, and subtract the imaginary parts."),
      hints: [
        `Subtract the real parts, and subtract the imaginary parts: ${$("(a + bi) - (c + di) = (a - c) + (b - d)i")}.`,
        `The real part is ${$(`${slashTex(z.re)} - ${parenTex(w.re)}`)}, and the imaginary part is ${$(`${slashTex(z.im)} - ${parenTex(w.im)}`)}.`,
      ],
      worked: $$(`z - w = ${parts("-", diff)}`),
      prereqs: [],
    }),
  ];
}
const cx = (re: Fraction, im: Fraction): C => ({ re, im });

/** Expanding (a + bi)(c + di) = ac + adi + bci + bdi². */
function expandStep(z: C, w: C, zName: string, wName: string, product: string, prereqs: number[]): Step {
  const [a, b, c, d] = [z.re, z.im, w.re, w.im];
  const terms = [mul(a, c), mul(a, d), mul(b, c), mul(b, d)];
  return {
    title: `Expand ${$(`${product}`)}`,
    intro: `<p>Multiply each term of ${$(zName)} by each term of ${$(wName)}: ${$(`${cParen(z)}${cParen(w)}`)}.</p>`,
    groups: [
      { type: "scalar", before: $(`${product} =`) },
      { type: "scalar", before: $("+"), after: $("i") },
      { type: "scalar", before: $("+"), after: $("i") },
      { type: "scalar", before: $("+"), after: $("i^2") },
    ],
    answer: terms.map(fracText),
    check(values) {
      const got = parseAll(values);
      const is = (k: number, x: Fraction) => got[k] !== null && equals(got[k]!, x);
      // The two middle terms can come in either order.
      const swapped = is(1, terms[2]) && is(2, terms[1]);
      const marks = [is(0, terms[0]), is(1, terms[1]) || swapped, is(2, terms[2]) || swapped, is(3, terms[3])];
      const ok = marks.every(Boolean);
      return { ok, marks, message: ok ? undefined : "Multiply the real parts, the real part by the imaginary part (both ways), and the imaginary parts." };
    },
    hints: [
      `Use ${$("(a + bi)(c + di) = ac + adi + bci + bdi^2")}: first, outer, inner, last.`,
      `${$(`ac = ${slashTex(a)} \\cdot ${parenTex(c)}`)}, ${$(`ad = ${slashTex(a)} \\cdot ${parenTex(d)}`)}, ${$(`bc = ${slashTex(b)} \\cdot ${parenTex(c)}`)}, and ${$(`bd = ${slashTex(b)} \\cdot ${parenTex(d)}`)}.`,
    ],
    worked: $$(`${cParen(z, true)}${cParen(w, true)} = ${fracTex(terms[0])} + ${parenTex(terms[1], true)}i + ${parenTex(terms[2], true)}i + ${parenTex(terms[3], true)}i^2`),
    prereqs,
  };
}

/** Collecting the expansion into a + bi, using i² = −1. */
function collectStep(z: C, w: C, product: string, prereqs: number[]): Step {
  const [a, b, c, d] = [z.re, z.im, w.re, w.im];
  const value = cmul(z, w);
  return {
    title: `Use ${$("i^2 = -1")} to write ${$(product)} as ${$("a + bi")}`,
    groups: complexGroups(product),
    answer: answerOf(value),
    check: complexCheck(value, [
      { value: cx(add(mul(a, c), mul(b, d)), add(mul(a, d), mul(b, c))), message: `Remember that ${$("i^2 = -1")}: the last term ${$("bdi^2")} is ${$("-bd")}, a real number.` },
    ], `The real part is ${$("ac - bd")}, and the imaginary part is ${$("ad + bc")}.`),
    hints: [
      `Replace ${$("i^2")} with ${$("-1")}, then collect the real terms and the imaginary terms.`,
      `${$(`${product} = (ac - bd) + (ad + bc)i`)}, with ${$(`ac - bd = ${slashTex(mul(a, c))} - ${parenTex(mul(b, d))}`)} and ${$(`ad + bc = ${slashTex(mul(a, d))} + ${parenTex(mul(b, c))}`)}.`,
    ],
    worked: $$(`${product} = \\left(${fracTex(mul(a, c))} - ${parenTex(mul(b, d), true)}\\right) + \\left(${fracTex(mul(a, d))} + ${parenTex(mul(b, c), true)}\\right)i = ${cTex(value, true)}`),
    prereqs,
  };
}

function mulSteps(z: C, w: C): Step[] {
  return [expandStep(z, w, "z", "w", "zw", []), final(collectStep(z, w, "zw", [0]))];
}

/** The conjugate of `name` = x. */
function conjStep(x: C, name: string, prereqs: number[]): Step {
  const value = cconj(x);
  return {
    title: `Find the conjugate ${$(`\\overline{${name}}`)}`,
    groups: complexGroups(`\\overline{${name}}`),
    answer: answerOf(value),
    check: complexCheck(value, [
      { value: cx(neg(x.re), x.im), message: "The conjugate keeps the real part and changes the sign of the imaginary part." },
      { value: x, message: "The conjugate changes the sign of the imaginary part." },
    ]),
    hints: [`The conjugate changes the sign of the imaginary part: ${$("\\overline{a + bi} = a - bi")}.`],
    worked: $$(`\\overline{${name}} = \\overline{${cTex(x, true)}} = ${cTex(value, true)}`),
    prereqs,
  };
}

/** x times its conjugate, which is |x|² = a² + b². */
function normSqStep(x: C, name: string, prereqs: number[], title = `Find ${$(`${name}\\overline{${name}}`)}`): Step {
  const value = cnormSq(x);
  const squares = `${parenTex(x.re, true)}^2 + ${parenTex(x.im, true)}^2`;
  return {
    title,
    groups: [{ type: "scalar", before: $(`${name}\\overline{${name}} = \\abs{${name}}^2 =`) }],
    answer: [fracText(value)],
    check: exact([value], `The imaginary terms cancel, and ${$("i^2 = -1")}, so ${$("(a + bi)(a - bi) = a^2 + b^2")}.`),
    hints: [
      `${$("(a + bi)(a - bi) = a^2 - abi + abi - b^2 i^2 = a^2 + b^2")}, a real number.`,
      `${$(`${name}\\overline{${name}} = ${parenTex(x.re)}^2 + ${parenTex(x.im)}^2`)}.`,
    ],
    worked: $$(`${name}\\overline{${name}} = \\abs{${name}}^2 = ${squares} = ${fracTex(value)}`),
    prereqs,
  };
}

/** |x| = √(x x̄). */
function modulusStep(x: C, name: string, prereqs: number[]): Step {
  const sq = cnormSq(x), root = sqrtOf(sq);
  const simplified = root.n !== 1n && !equals(root.k, F(1));
  return {
    title: `Find the modulus ${$(`\\abs{${name}}`)}`,
    intro: ROOT_INTRO,
    groups: [rootGroup($(`\\abs{${name}} =`))],
    answer: [rootText(root)],
    check(values) {
      const got = parseRoot(values[0]);
      const ok = rootEquals(values[0], sq);
      if (ok) return { ok, marks: [true] };
      const message = got && equals(got.square, mul(sq, sq))
        ? `That's ${$(`\\abs{${name}}^2`)}: take its square root.`
        : got?.negative ? "The modulus is a length, so it isn't negative."
          : `${$(`\\abs{${name}} = \\sqrt{a^2 + b^2}`)}.`;
      return { ok, marks: [false], message };
    },
    hints: [
      `${$(`\\abs{${name}} = \\sqrt{${name}\\overline{${name}}} = \\sqrt{a^2 + b^2}`)}: the distance from 0 to ${$(name)} in the plane.`,
      `${$(`\\abs{${name}} = \\sqrt{${fracTex(sq)}}`)}${simplified ? `. Take the square factor out of the root: ${$(`\\sqrt{${fracTex(sq)}} = ${rootTex(root)}`)}` : ""}.`,
    ],
    worked: $$(`\\abs{${name}} = \\sqrt{${fracTex(sq)}}${root.n === 1n || simplified || root.k.den !== 1n ? ` = ${rootTex(root, true)}` : ""}`),
    prereqs,
  };
}

function conjSteps(z: C): Step[] {
  return [final(conjStep(z, "z", [])), partial(normSqStep(z, "z", [0])), final(modulusStep(z, "z", [1]))];
}

function divSteps(z: C, w: C): Step[] {
  const wb = cconj(w), top = cmul(z, wb), bottom = cnormSq(w), value = cdiv(z, w);
  return [
    {
      ...conjStep(w, "w", []),
      intro: `<p>To divide by ${$("w")}, multiply the numerator and the denominator by the conjugate ${$("\\overline{w}")}: ${$("\\dfrac{z}{w} = \\dfrac{z\\overline{w}}{w\\overline{w}}")}. The denominator becomes a real number.</p>`,
    },
    expandAndCollect(z, wb, "z\\overline{w}", [0]),
    partial(normSqStep(w, "w", [0], `Find the denominator ${$("w\\overline{w}")}`)),
    final({
      title: `Find ${$("z/w")}`,
      groups: complexGroups("z/w"),
      answer: answerOf(value),
      check: complexCheck(value, [
        { value: top, message: `Divide ${$("z\\overline{w}")} by ${$("w\\overline{w}")}.` },
      ], `Divide both parts of ${$("z\\overline{w}")} by the real number ${$("w\\overline{w}")}.`),
      hints: [
        `${$("\\dfrac{z}{w} = \\dfrac{z\\overline{w}}{w\\overline{w}}")}: divide the real part and the imaginary part of ${$("z\\overline{w}")} by ${$("w\\overline{w}")}.`,
        `${$(`z/w = (${cTex(top)})/${slashTex(bottom)}`)}. Simplify each fraction.`,
      ],
      worked: $$(`\\frac{z}{w} = \\frac{z\\overline{w}}{w\\overline{w}} = \\frac{${cTex(top, true)}}{${fracTex(bottom)}} = ${cTex(value, true)}`),
      prereqs: [1, 2],
    }),
  ];
}

/** z times another number, in one step (expanded and collected): for z w̄. */
function expandAndCollect(z: C, w: C, product: string, prereqs: number[]): Step {
  const collect = collectStep(z, w, product, prereqs);
  const expand = expandStep(z, w, "z", "\\overline{w}", product, prereqs);
  return {
    ...collect,
    title: `Find the numerator ${$(product)}`,
    intro: `<p>Multiply ${$(`${cParen(z)}${cParen(w)}`)}, then use ${$("i^2 = -1")}.</p>`,
    hints: [expand.hints[0], ...collect.hints],
    worked: expand.worked + collect.worked,
  };
}

/** The angle θ of x, as a multiple of π. */
function angleStep(x: C, name: string, prereqs: number[]): Step {
  const a = angleOf(x);
  const [re, im] = [toNumber(x.re), toNumber(x.im)];
  const quadrant = re > 0 && im > 0 ? "first" : re < 0 && im > 0 ? "second" : re < 0 && im < 0 ? "third" : re > 0 && im < 0 ? "fourth" : null;
  const where = quadrant ? `${$(name)} is in the ${quadrant} quadrant` : `${$(name)} is on the ${im === 0 ? "real" : "imaginary"} axis`;
  const tan = re !== 0 ? `${$(`\\tan \\theta = b/a = ${slashTex(x.im)}/${parenTex(x.re)}`)}` : "";
  return {
    title: `Find the angle ${$("\\theta")} of ${$(name)}`,
    intro: `<p>Enter ${$("\\theta")} as a multiple of ${$("\\pi")}, such as <code>3/4</code> for ${$("3\\pi/4")}${a.exact ? "" : `, to within ${$("0.001\\pi")}`}.</p>`,
    groups: [angleGroup($("\\theta ="))],
    answer: [angleText(a)],
    shownNote: ANGLE_NOTE,
    check(values) {
      const ok = angleMatches(values[0], a) === true;
      if (ok) return { ok, marks: [true] };
      const got = parseAll(values)[0];
      const mirrored = got !== null && (sameAngle(toNumber(got), 1 - a.value, 0.001) || sameAngle(toNumber(got), -a.value, 0.001) || sameAngle(toNumber(got), a.value + 1, 0.001));
      return {
        ok, marks: [false],
        message: mirrored
          ? `Right reference angle, wrong quadrant: ${where}.`
          : `${$("\\theta")} is the angle from the positive real axis to ${$(name)}, measured counterclockwise.`,
      };
    },
    hints: [
      `Plot ${$(name)}: ${where}. ${$("\\theta")} is the angle from the positive real axis to ${$(name)}, measured counterclockwise.`,
      a.exact
        ? `${tan ? `${tan}. ` : ""}The angle is ${$(angleTex(a.exact))} (${degreesText(toNumber(a.exact))}).`
        : `${tan}, so the reference angle is ${$(`\\arctan(${slashTex(absFr(x.im))}/${slashTex(absFr(x.re))})`)}. ${re < 0 ? `Since ${$(name)} is to the left of the imaginary axis, add or subtract ${$("\\pi")}.` : ""}`,
    ],
    worked: a.exact
      ? $$(`\\theta = ${angleTex(a.exact, true)} \\quad (${degreesText(toNumber(a.exact)).replace("°", "^\\circ")})`)
      : $$(`\\theta \\approx ${a.value.toFixed(4)}\\pi \\quad (${degreesText(a.value).replace("≈ ", "\\approx ").replace("°", "^\\circ")})`),
    prereqs,
  };
}
const absFr = (x: Fraction): Fraction => (x.num < 0n ? neg(x) : x);

function polarSteps(z: C): Step[] {
  const root = sqrtOf(cnormSq(z)), a = angleOf(z);
  const angle = angleStep(z, "z", []);
  return [
    { ...normSqStep(z, "z", []), title: `Find ${$("\\abs{z}^2 = a^2 + b^2")}` },
    final(modulusStep(z, "z", [0])),
    final({
      ...angle,
      worked: angle.worked + `<p>So ${$(`z = ${rootTex(root)}${a.exact ? expTex(a.exact) : `e^{${a.value.toFixed(4)}\\pi i}`}`)}.</p>`,
    }),
  ];
}

/** r and θ of a product or quotient in polar form. */
function polarOpStep(z: Polar, w: Polar, op: "mul" | "div", prereqs: number[]): Step {
  const value = op === "mul" ? pmul(z, w) : pdiv(z, w);
  const name = op === "mul" ? "zw" : "z/w";
  const rawT = op === "mul" ? add(z.t, w.t) : sub(z.t, w.t);
  const rText = op === "mul" ? `${slashTex(z.r)} \\cdot ${slashTex(w.r)}` : `${slashTex(z.r)}/${slashTex(w.r)}`;
  const tText = `${angleTex(z.t)} ${op === "mul" ? "+" : "-"} ${angleTex(w.t).startsWith("-") ? `(${angleTex(w.t)})` : angleTex(w.t)}`;
  const reduced = !equals(rawT, value.t);
  return {
    title: `Find ${$(name)} in polar form`,
    intro: `<p>Write ${$(`${name} = re^{i\\theta}`)}, with ${$("\\theta")} as a multiple of ${$("\\pi")} (such as <code>-1/2</code> for ${$("-\\pi/2")}).</p>`,
    groups: [{ type: "scalar", before: $("r =") }, angleGroup($("\\theta ="))],
    answer: [fracText(value.r), fracText(value.t)],
    shownNote: ANGLE_NOTE,
    check(values) {
      const [r] = parseAll(values);
      const rOk = r !== null && equals(r, value.r);
      const tOk = angleMatches(values[1], { exact: value.t, value: toNumber(value.t) }) === true;
      const ok = rOk && tOk;
      const message = ok ? undefined
        : op === "mul" ? "Multiply the moduli, and add the angles." : "Divide the moduli, and subtract the angles (the angle of z minus the angle of w).";
      return { ok, marks: [rOk, tOk], message };
    },
    hints: [
      op === "mul"
        ? `${$("r_1 e^{i\\theta_1} \\cdot r_2 e^{i\\theta_2} = r_1 r_2 e^{i(\\theta_1 + \\theta_2)}")}: multiply the moduli and add the angles.`
        : `${$("\\dfrac{r_1 e^{i\\theta_1}}{r_2 e^{i\\theta_2}} = \\dfrac{r_1}{r_2} e^{i(\\theta_1 - \\theta_2)}")}: divide the moduli and subtract the angles.`,
      `${$(`r = ${rText}`)} and ${$(`\\theta = ${tText}`)}.`,
    ],
    worked: $$(`${name} = ${op === "mul" ? `${rText} \\, e^{i(${tText})}` : `\\frac{${fracTex(z.r)}}{${fracTex(w.r)}} e^{i(${tText})}`} = ${polarTex({ r: value.r, t: rawT })}`)
      + (reduced ? `<p>Adding or subtracting ${$("2\\pi")} gives the same angle in ${$("(-\\pi, \\pi]")}: ${$(`${name} = ${polarTex(value)}`)}.</p>` : ""),
    prereqs,
  };
}

function polarmulSteps(z: Polar, w: Polar): Step[] {
  return [final(polarOpStep(z, w, "mul", [])), final(polarOpStep(z, w, "div", []))];
}

function powerSteps(z: C, n: number): Step[] {
  const r = sqrtOf(cnormSq(z)), a = angleOf(z);
  const rn = rootPow(r, n), value = cpow(z, n);
  const nt: Angle = a.exact ? { exact: normAngle(mul(a.exact, F(n))), value: 0 } : { exact: null, value: 0 };
  nt.value = nt.exact ? toNumber(nt.exact) : ((((a.value * n) % 2) + 3) % 2) - 1;
  const ntRaw = a.exact ? `${n} \\cdot ${a.exact.num < 0n ? `(${angleTex(a.exact)})` : angleTex(a.exact)}` : `${n} \\cdot ${a.value.toFixed(4)}\\pi`;
  const trig = nt.exact ? cosSinTex(nt.exact) : null;
  return [
    modulusStep(z, "z", []),
    partial(angleStep(z, "z", [])),
    {
      title: `Find ${$(`z^{${n}}`)} in polar form`,
      intro: `<p>Write ${$(`z^{${n}} = Re^{i\\Theta}`)}, with ${$("\\Theta")} as a multiple of ${$("\\pi")}.</p>` + ROOT_INTRO,
      groups: [rootGroup($("R =")), angleGroup($("\\Theta ="))],
      answer: [rootText(rn), angleText(nt)],
      shownNote: ANGLE_NOTE,
      check(values) {
        const rOk = rootEquals(values[0], rootSquare(rn));
        const tOk = angleMatches(values[1], nt) === true;
        const ok = rOk && tOk;
        return { ok, marks: [rOk, tOk], message: ok ? undefined : `${$(`z^{${n}} = r^{${n}} e^{i ${n}\\theta}`)}: raise the modulus to the power ${n}, and multiply the angle by ${n}.` };
      },
      hints: [
        `De Moivre's theorem: ${$(`\\left(re^{i\\theta}\\right)^{${n}} = r^{${n}} e^{i ${n}\\theta}`)}.`,
        `${$(`R = \\left(${rootTex(r)}\\right)^{${n}}`)} and ${$(`\\Theta = ${ntRaw}`)}.`,
      ],
      worked: $$(`z^{${n}} = \\left(${rootTex(r, true)}\\right)^{${n}} e^{i \\cdot ${ntRaw}} = ${rootTex(rn, true)} \\, ${nt.exact ? expTex(nt.exact) : `e^{${nt.value.toFixed(4)}\\pi i}`}`),
      prereqs: [0, 1],
    },
    final({
      title: `Write ${$(`z^{${n}}`)} as ${$("a + bi")}`,
      groups: complexGroups(`z^{${n}}`),
      answer: answerOf(value),
      check: complexCheck(value, [], `${$("Re^{i\\Theta} = R\\cos \\Theta + iR\\sin \\Theta")}.`),
      hints: [
        `Euler's formula: ${$("Re^{i\\Theta} = R\\cos \\Theta + iR\\sin \\Theta")}.`,
        trig
          ? `${$(`\\cos \\Theta = ${trig[0]}`)} and ${$(`\\sin \\Theta = ${trig[1]}`)}.`
          : `Multiply ${$("z")} by itself ${n} times instead, as a check.`,
      ],
      worked: $$(`z^{${n}} = ${rootTex(rn, true)}\\left(\\cos ${angleShown(nt, true)} + i \\sin ${angleShown(nt, true)}\\right)${trig ? ` = ${rootTex(rn, true)}\\left(${trig[0]} + ${trig[1].startsWith("-") ? `\\left(${trig[1]}\\right)` : trig[1]} i\\right)` : ""} = ${cTex(value, true)}`),
      prereqs: [2],
    }),
  ];
}

export function buildSteps(p: Problem): Step[] {
  switch (p.kind) {
    case "powi": return powiSteps(p.n);
    case "add": return addSteps(p.z, p.w);
    case "mul": return mulSteps(p.z, p.w);
    case "conj": return conjSteps(p.z);
    case "div": return divSteps(p.z, p.w);
    case "polar": return polarSteps(p.z);
    case "polarmul": return polarmulSteps(p.z, p.w);
    case "power": return powerSteps(p.z, p.n);
  }
}

// ⋘──────── The problem statement ────────⋙

export function statementHtml(p: Problem): string {
  const zw = (z: C, w: C) => $$(`z = ${cTex(z, true)}, \\qquad w = ${cTex(w, true)}`);
  switch (p.kind) {
    case "powi":
      return `<p>Find ${$(`i^{${p.n}}`)}, and write it in the form ${$("a + bi")}.</p>`;
    case "add":
      return `<p>Find ${$("z + w")} and ${$("z - w")} for</p>${zw(p.z, p.w)}`;
    case "mul":
      return `<p>Find the product ${$("zw")}, in the form ${$("a + bi")}, for</p>${zw(p.z, p.w)}`;
    case "conj":
      return `<p>Find the conjugate ${$("\\overline{z}")} and the modulus ${$("\\abs{z}")} of</p>${$$(`z = ${cTex(p.z, true)}.`)}`;
    case "div":
      return `<p>Find the quotient ${$("z/w")}, in the form ${$("a + bi")}, for</p>${zw(p.z, p.w)}`;
    case "polar":
      return `<p>Write ${$("z")} in polar form ${$("z = re^{i\\theta}")}, with ${$("r > 0")} and ${$("-\\pi < \\theta \\le \\pi")}, for</p>${$$(`z = ${cTex(p.z, true)}.`)}`;
    case "polarmul":
      return `<p>Find ${$("zw")} and ${$("z/w")} in polar form for</p>${$$(`z = ${polarTex(p.z)}, \\qquad w = ${polarTex(p.w)}.`)}`;
    case "power":
      return `<p>Use polar form to find ${$(`z^{${p.n}}`)}, in the form ${$("a + bi")}, for</p>${$$(`z = ${cTex(p.z, true)}.`)}`;
  }
}

// ⋘──────── The page ────────⋙

type Hooks = Required<Pick<Parameters<typeof setupStepPractice<Problem, Kind>>[0], "onLoad" | "onStatus">>;

export function setupPracticePage(hooks: Hooks): StepPractice<Problem> {
  return setupStepPractice<Problem, Kind>({
    prefix: "cx",
    key: "complex_numbers",
    stages: STAGES,
    kinds: KINDS,
    helpText: "Guided Learning is a series of levels, from easy to hard: powers of i, then adding, multiplying, and dividing in the form a + bi, then polar form. Each level gives a new random problem of its kind each time. After two problems at a level with no hints, the page suggests the next level. To choose the kind of problem, type your own numbers, or drag them in the plane, choose “Design your own problems” instead.",
    urlKeys: URL_KEYS,
    randomProblem: kind => randomProblem(kind),
    encode: encodeProblem,
    decode: decodeProblem,
    hasProblem,
    statementHtml,
    buildSteps,
    levels: {
      names: ["Full", "Partial", "None"],
      descriptions: ["The page works every step: a worked example", "The page does the routine steps; you do the main ones", "Solve the whole problem by hand, then enter the answers"],
      helpText: "#cx-help-support",
    },
    onLoad: hooks.onLoad,
    onStatus: hooks.onStatus,
  });
}
