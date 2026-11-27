import { test } from "node:test";
import assert from "node:assert/strict";
import { assertClose } from "./helpers";
import { cantorFunction, parseFormula } from "../src/figures/expression";
import { fitRange, sampleRuns, termName, termText, zoomRange, nearestPart } from "../src/figures/function_plot";
import { tickLabel } from "../src/common/scene3d";
import { equalRanges } from "../src/figures/plot2d";

const at = (src: string, x: number, v = "x") => parseFormula(src, v)(x);

test("parseFormula reads operators with the usual precedence", () => {
  assert.equal(at("1 + 2 * 3", 0), 7);
  assert.equal(at("(1 + 2) * 3", 0), 9);
  assert.equal(at("2^3^2", 0), 512);
  assert.equal(at("-x^2", 3), -9);
  assert.equal(at("2^-1", 0), 0.5);
  assert.equal(at("x - 1 - 1", 5), 3);
  assert.equal(at("8 / 4 / 2", 0), 1);
  assert.equal(at("x−1", 3), 2);
});

test("parseFormula reads products written without a times sign", () => {
  assert.equal(at("2x", 3), 6);
  assert.equal(at("2x^2 + x", 2), 10);
  assert.equal(at("(x + 1)(x - 1)", 3), 8);
  assertClose(at("x sin(1/x)", 0.5), 0.5 * Math.sin(2));
  assertClose(at("x^2 sin(1/x)", 0.5), 0.25 * Math.sin(2));
  assertClose(at("2 pi", 0), 2 * Math.PI);
});

test("parseFormula knows the functions and constants, and another variable", () => {
  assertClose(at("exp(-abs(t))", -2, "t"), Math.exp(-2));
  assertClose(at("e^t", 1, "t"), Math.E);
  assertClose(at("ln(e)", 0), 1);
  assertClose(at("sqrt(x - 4)", 13), 3);
  assertClose(at("sin x", Math.PI / 2), 1);
  assertClose(at("arctan(r)", 1, "r"), Math.PI / 4);
  assertClose(at("1 / ln(1/x)", 0.25), 1 / Math.log(4));
  assert.ok(Number.isNaN(at("sqrt(x)", -1)));
});

test("parseFormula rejects what it can't read", () => {
  assert.throws(() => parseFormula("x +"));
  assert.throws(() => parseFormula("(x"));
  assert.throws(() => parseFormula("y + 1"));
  assert.throws(() => parseFormula("x ? 2"));
  assert.throws(() => parseFormula("x)"));
});

test("the Cantor function", () => {
  assert.equal(cantorFunction(0), 0);
  assert.equal(cantorFunction(1), 1);
  assert.equal(cantorFunction(0.5), 0.5);
  assertClose(cantorFunction(1 / 3), 0.5, 1e-9);
  // Constant on the removed interval (1/9, 2/9).
  assertClose(cantorFunction(0.15), 0.25, 1e-9);
  assertClose(cantorFunction(0.2), 0.25, 1e-9);
  assertClose(cantorFunction(1 / 4), 1 / 3, 1e-9);
  assertClose(cantorFunction(3 / 4), 2 / 3, 1e-9);
});

test("sampleRuns breaks at asymptotes and at values that aren't numbers", () => {
  const tan = sampleRuns(Math.tan, -3, 3, 600, 10);
  // tan has asymptotes at ±π/2 in [−3, 3], so it is drawn in three pieces.
  assert.equal(tan.length, 3);
  const sqrt = sampleRuns(Math.sqrt, -1, 1, 200, 10);
  assert.equal(sqrt.length, 1);
  assert.ok(sqrt[0][0][0] >= 0);
  assert.equal(sampleRuns(x => x, 0, 1, 10, 10)[0].length, 11);
});

test("fitRange shows the values with a margin, and the x-axis when nearby", () => {
  const [lo, hi] = fitRange([1, 2, 3, 4]);
  assert.ok(lo <= 0 && hi > 4);
  const [lo2, hi2] = fitRange([100, 101]);
  assert.ok(lo2 > 99 && lo2 < 100 && hi2 > 101);
  const [lo3, hi3] = fitRange([5, 5]);
  assert.ok(lo3 < 5 && hi3 > 5);
  assert.deepEqual(fitRange([NaN]), [-1, 1]);
});

test("zoomRange stretches about a height that keeps its place", () => {
  const [y0, y1] = zoomRange([1, 2], 1.5, 10);
  assertClose(y0, 1.45, 1e-12);
  assertClose(y1, 1.55, 1e-12);
  // Off center: a quarter of the way up stays a quarter of the way up.
  const [z0, z1] = zoomRange([0, 4], 1, 4);
  assertClose(z0, 0.75, 1e-12);
  assertClose(z1, 1.75, 1e-12);
  assert.deepEqual(zoomRange([0, 4], 1, 1), [0, 4]);
});

test("termText drops rounding error but keeps the digits of a decimal approximation", () => {
  assert.equal(termText(Math.floor(1e7 * Math.SQRT2) / 1e7), "1.4142135");
  assert.equal(termText(0.1 + 0.2), "0.3");
  assert.equal(termText(-2), "-2");
});

test("tickLabel shows as many decimals as the tick step needs", () => {
  assert.equal(tickLabel(1.4), "1.4");
  assert.equal(tickLabel(1.23456), "1.23");
  assert.equal(tickLabel(-0.5), "−0.5");
  assert.equal(tickLabel(14142 * 0.0001, 0.0001), "1.4142");
  assert.equal(tickLabel(1.41421 + 2e-6, 5e-6), "1.414212");
  assert.equal(tickLabel(1.5, 0.5), "1.5");
});

test("termName puts the index in place of the variable in the subscript", () => {
  assert.equal(termName("a_n", "n", 3), "a_{3}");
  assert.equal(termName("x_{k}", "k", 12), "x_{12}");
  assert.equal(termName("y", "n", 3), "y \\text{ at } n = 3");
});

test("equalRanges widens the range with more room per unit, about its center", () => {
  // 400 × 300 pixels for x in [0, 4] (100 px per unit) and y in [0, 2] (150 px per unit): y widens to 3 units.
  assert.deepEqual(equalRanges([0, 4], [0, 2], 400, 300), [[0, 4], [-0.5, 2.5]]);
  // The other way: x widens.
  assert.deepEqual(equalRanges([-1, 1], [0, 4], 300, 300), [[-2, 2], [0, 4]]);
  // Already equal: unchanged.
  assert.deepEqual(equalRanges([-3, 3], [-3, 3], 500, 500), [[-3, 3], [-3, 3]]);
});

test("nearestPart finds the part near the pointer, the nearest of several, and none far from all", () => {
  const parts = [
    { id: "curve", lines: [[[0, 0], [100, 0]], [[0, 50], [100, 50]]] as [number, number][][] },
    { id: "segment", lines: [[[0, -20], [0, 20]]] as [number, number][][] },
  ];
  assert.equal(nearestPart(parts, [50, 5], 8), "curve");
  assert.equal(nearestPart(parts, [50, 47], 8), "curve");
  assert.equal(nearestPart(parts, [-3, 10], 8), "segment");
  // Within reach of both: 2 from the segment, and about 4.5 from the curve.
  assert.equal(nearestPart(parts, [-2, 4], 8), "segment");
  assert.equal(nearestPart(parts, [50, 25], 8), null);
  assert.equal(nearestPart([{ id: "empty", lines: [] }], [0, 0], 8), null);
});
