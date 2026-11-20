import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ParseContext, ParseError, Poly, WHOLE_SPACE, formatNumber, monomialExponents, nameToLatex, parsePoly,
  parseSet, polyToCode, polyToLatex, setToLatex,
} from "../src/barrier_sos/poly";

const NAMES = ["x1", "x2", "d"];
const ctx = (allowed = ["x1", "x2"]): ParseContext => ({
  n: 3,
  varIndex: new Map(NAMES.map((name, i) => [name, i])),
  allowed: new Set(allowed),
  params: new Map([["p", 2], ["k", 0.5]]),
  latexNames: ["x_{1}", "x_{2}", "d"],
});
const parse = (src: string) => parsePoly(src, ctx());
const code = (p: Poly) => polyToCode(p, NAMES);

test("Poly arithmetic", () => {
  const x = Poly.variable(3, 0), y = Poly.variable(3, 1);
  assert.equal(code(x.add(y).pow(2)), "x1^2 + 2*x1*x2 + x2^2");
  assert.equal(code(x.sub(x)), "0");
  assert.ok(x.sub(x).isZero());
  assert.equal(code(x.scale(-3)), "-3*x1");
  assert.equal(code(x.pow(0)), "1");
  assert.equal(Poly.constant(3, 1e-15).isZero(), true);
});

test("constantValue, degree, and variablesUsed", () => {
  assert.equal(Poly.constant(3, 4).constantValue(), 4);
  assert.equal(new Poly(3).constantValue(), 0);
  assert.equal(Poly.variable(3, 0).constantValue(), null);
  const p = parse("x1^3*x2 + x2^2 + 1");
  assert.equal(p.degree(), 4);
  assert.equal(p.degree([1]), 2);
  assert.equal(new Poly(3).degree(), -1);
  assert.deepEqual([...p.variablesUsed()].sort(), [0, 1]);
});

test("diff takes partial derivatives", () => {
  const p = parse("x1^3*x2 + 5*x2 - 7");
  assert.equal(code(p.diff(0)), "3*x1^2*x2");
  assert.equal(code(p.diff(1)), "x1^3 + 5");
  assert.ok(p.diff(2).isZero());
});

test("compose substitutes polynomials for variables", () => {
  const p = parse("x1^2 + x2");
  const q = p.compose([parse("x2 + 1"), undefined]);
  assert.equal(code(q), "x2^2 + 3*x2 + 1");
});

test("monomialExponents lists exponents by degree", () => {
  assert.deepEqual(monomialExponents(3, [0, 1], 2), [
    [0, 0, 0], [1, 0, 0], [0, 1, 0], [2, 0, 0], [1, 1, 0], [0, 2, 0],
  ]);
  assert.deepEqual(monomialExponents(3, [0, 2], 1, 1), [[1, 0, 0], [0, 0, 1]]);
});

test("parsePoly handles precedence, parameters, powers, and division by constants", () => {
  assert.equal(code(parse("1 + 2*3^2")), "19");
  assert.equal(code(parse("-x1^2")), "-x1^2");
  assert.equal(code(parse("(x1 + x2)**2 / 2")), "0.5*x1^2 + x1*x2 + 0.5*x2^2");
  assert.equal(code(parse("p*x1 - k")), "2*x1 - 0.5");
  assert.equal(code(parse("2^-0")), "1");
  assert.equal(code(parse("1.5e2 + .5")), "150.5");
  assert.equal(parse("pi").constantValue(), Math.PI);
});

test("parsePoly accepts typographic minus signs", () => {
  assert.equal(code(parse("−x1 − 2")), "-x1 - 2");
  assert.equal(code(parse("x1 – x2")), "x1 - x2");
  assert.equal(code(parse("x1^−0")), "1");
  const set = parseSet("x1 ≥ −1", ctx(), "all");
  assert.deepEqual(set.pieces[0].ineqs.map(code), ["x1 + 1"]);
  assert.deepEqual(set.pieces[0].latex, ["x_{1} \\ge -1"]);
});

test("parsePoly reports errors", () => {
  const bad: [string, RegExp][] = [
    ["", /Expected an expression/],
    ["x1 / x2", /divide by constants/],
    ["x1 / (p - 2)", /Division by zero/],
    ["x1^x2", /nonnegative integers/],
    ["x1^1.5", /nonnegative integers/],
    ["y + 1", /Unknown symbol "y"/],
    ["d + 1", /"d" can't be used here/],
    ["(x1 + 1", /Missing "\)"/],
    ["2 x1", /Use \* for multiplication/],
    ["x1 $ 2", /Unexpected character "\$"/],
    ["x1 +", /Unexpected end/],
  ];
  for (const [src, message] of bad) {
    assert.throws(() => parse(src), (e: unknown) => e instanceof ParseError && message.test(e.message), src);
  }
});

test("parseSet reads constraints, chains, and unions", () => {
  const set = parseSet("0 <= x1 <= 1, x2 = p\nor\nx1 >= 3 # comment", ctx(), "all");
  assert.equal(set.pieces.length, 2);
  const [a, b] = set.pieces;
  assert.deepEqual(a.ineqs.map(code), ["x1", "-x1 + 1"]);
  assert.deepEqual(a.eqs.map(code), ["x2 - 2"]);
  assert.deepEqual(b.ineqs.map(code), ["x1 - 3"]);
  assert.deepEqual(a.latex, ["0 \\le x_{1} \\le 1", "x_{2} = 2"]);
});

test("parseSet handles blank, empty, and malformed input", () => {
  assert.equal(parseSet("  \n", ctx(), "all"), WHOLE_SPACE);
  assert.deepEqual(parseSet("", ctx(), "empty"), { pieces: [] });
  assert.deepEqual(parseSet("∅", ctx(), "all"), { pieces: [] });
  assert.throws(() => parseSet("x1 + 1", ctx(), "all"), /Expected a comparison/);
  assert.throws(() => parseSet("x1 >= 0\nor", ctx(), "all"), /at least one constraint/);
});

test("formatting numbers, polynomials, and names", () => {
  assert.equal(formatNumber(3), "3");
  assert.equal(formatNumber(0.1 + 0.2), "0.3");
  assert.equal(polyToCode(parse("x1^2 - x2"), NAMES, ".^"), "x1.^2 - x2");
  assert.equal(polyToLatex(parse("-2*x1^2 + x2 - 1"), ctx().latexNames), "-2 x_{1}^{2} + x_{2} - 1");
  assert.equal(polyToLatex(parse("1e-8 * x1 + 1e30"), ctx().latexNames), "1 \\times 10^{-8} x_{1} + 1 \\times 10^{30}");
  assert.ok(parse("1e-20 * x1").isZero(), "round-off coefficients are dropped");
  assert.equal(nameToLatex("x1"), "x_{1}");
  assert.equal(nameToLatex("theta2"), "\\theta_{2}");
  assert.equal(nameToLatex("x_dot"), "x_{\\mathrm{dot}}");
  assert.equal(nameToLatex("x_3"), "x_{3}");
  assert.equal(nameToLatex("vel"), "\\mathit{vel}");
  assert.equal(nameToLatex("Omega"), "\\Omega");
});

test("setToLatex", () => {
  assert.equal(setToLatex({ pieces: [] }, "x", "\\mathbb{R}^2"), "\\emptyset");
  assert.equal(setToLatex(WHOLE_SPACE, "x", "\\mathbb{R}^2"), "\\mathbb{R}^2");
  const set = parseSet("x1 >= 0\nor\nx2 <= 0", ctx(), "all");
  assert.equal(setToLatex(set, "x", ""), "\\left\\{ x : x_{1} \\ge 0 \\right\\} \\cup \\left\\{ x : x_{2} \\le 0 \\right\\}");
});
