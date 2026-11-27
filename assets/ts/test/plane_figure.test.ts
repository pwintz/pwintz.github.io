import { test } from "node:test";
import assert from "node:assert/strict";
import { assertClose } from "./helpers";
import { parseFormulaIn } from "../src/figures/expression";
import { integersIn } from "../src/figures/function_plot";
import { Affine, IDENTITY, applyAffine, applyMap, clipHalfPlane, composeAffine, constantValue, distanceToLine, fitExtent, integrate, lerpAffine, reflectionAcross, rotationAbout, translucent } from "../src/figures/plane_figure";

test("parseFormulaIn reads formulas of several variables", () => {
  const f = parseFormulaIn("x^2 - 3 y", ["x", "y"]);
  assert.equal(f([2, 1]), 1);
  const g = parseFormulaIn("(1 - q^2) p - q", ["q", "p"]);
  assert.equal(g([2, 1]), -5);
  assert.throws(() => parseFormulaIn("x + z", ["x", "y"]), /Unknown name "z"/);
});

test("integersIn lists the integers in an interval", () => {
  assert.deepEqual(integersIn(0.5, 4), [1, 2, 3, 4]);
  assert.deepEqual(integersIn(-1, 1), [-1, 0, 1]);
  assert.deepEqual(integersIn(2.2, 2.8), []);
});

test("applyMap applies a matrix, or nothing without one", () => {
  assert.deepEqual(applyMap([[0, -1], [1, 0]], [1, 0]), [0, 1]);
  assert.deepEqual(applyMap([[2, 0], [0, 3]], [1, 1]), [2, 3]);
  assert.deepEqual(applyMap(undefined, [4, 5]), [4, 5]);
});

test("constantValue reads numbers and formulas without variables", () => {
  assert.equal(constantValue(2), 2);
  assertClose(constantValue("2 pi"), 2 * Math.PI);
});

test("clipHalfPlane keeps the part of a polygon on one side of a line", () => {
  const square: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  // The left half: points p with p · (1, 0) ≤ 0.
  const left = clipHalfPlane(square, [0, 0], [1, 0]);
  assert.deepEqual(left.map(([x, y]) => [x, y]).sort(), [[-1, -1], [-1, 1], [0, -1], [0, 1]].sort());
  assert.equal(clipHalfPlane(square, [-2, 0], [1, 0]).length, 0);
  assert.equal(clipHalfPlane(square, [2, 0], [1, 0]).length, 4);
});

test("fitExtent fits both ranges on the canvas", () => {
  // A wide canvas: the x-range decides.
  assertClose(fitExtent([0, 8], [-1, 1], 400, 100), 1);
  // A square canvas: the larger half-range.
  assertClose(fitExtent([-1, 1], [-3, 3], 300, 300), 3);
});

test("translucent turns a hex color into rgba", () => {
  assert.equal(translucent("#0072B2", 0.2), "rgba(0, 114, 178, 0.2)");
});

test("integrate follows the harmonic oscillator around the circle", () => {
  const pts = integrate(([x, y]) => [y, -x], [1, 0], 2 * Math.PI);
  const [x, y] = pts[pts.length - 1];
  assertClose(x, 1, 1e-6);
  assertClose(y, 0, 1e-6);
  for (const [a, b] of pts) assertClose(Math.hypot(a, b), 1, 1e-6);
  // Backward in time, it turns the other way.
  const back = integrate(([x, y]) => [y, -x], [1, 0], -Math.PI / 2);
  assertClose(back[back.length - 1][1], 1, 1e-6);
});

test("integrate stops when the solution blows up", () => {
  // ẋ = x² from 1 reaches infinity at time 1.
  const pts = integrate(([x]) => [x * x, 0], [1, 0], 2, 0.001, 1e3);
  assert.ok(pts.length < 1100, `${pts.length} points`);
});

test("reflectionAcross reflects across a line, and twice is the identity", () => {
  // Across y = x: (2, 1) goes to (1, 2).
  const r = reflectionAcross([0, 0], [1, 1]);
  const p = applyAffine(r, [2, 1]);
  assertClose(p[0], 1, 1e-12);
  assertClose(p[1], 2, 1e-12);
  // Across the vertical line x = 1: (3, 5) goes to (−1, 5).
  const v = applyAffine(reflectionAcross([1, 0], [0, 2]), [3, 5]);
  assertClose(v[0], -1, 1e-12);
  assertClose(v[1], 5, 1e-12);
  // Reflecting twice gives back every point.
  const twice = composeAffine(r, r);
  const q = applyAffine(twice, [0.3, -4]);
  assertClose(q[0], 0.3, 1e-12);
  assertClose(q[1], -4, 1e-12);
});

test("composeAffine applies the inner map first", () => {
  const shift: Affine = { m: [[1, 0], [0, 1]], b: [1, 0] };
  const double: Affine = { m: [[2, 0], [0, 2]], b: [0, 0] };
  assert.deepEqual(applyAffine(composeAffine(double, shift), [1, 1]), [4, 2]);
  assert.deepEqual(applyAffine(composeAffine(shift, double), [1, 1]), [3, 2]);
});

test("lerpAffine goes from one map to the other, flattening a reflection halfway", () => {
  const r = reflectionAcross([0, 0], [1, 0]);
  assert.deepEqual(lerpAffine(IDENTITY, r, 0), IDENTITY);
  assert.deepEqual(lerpAffine(IDENTITY, r, 1), r);
  // Halfway through a reflection across the x-axis, every point is on the axis.
  assertClose(applyAffine(lerpAffine(IDENTITY, r, 0.5), [2, 3])[1], 0, 1e-12);
});

test("distanceToLine measures across the line", () => {
  assertClose(distanceToLine([0, 1], [0, 0], [1, 1]), Math.SQRT1_2, 1e-12);
  assertClose(distanceToLine([5, 0], [0, 0], [3, 0]), 0, 1e-12);
});

test("rotationAbout turns about the given point", () => {
  // A quarter turn about (1, 1) takes (2, 1) to (1, 2), and leaves (1, 1) in place.
  const r = rotationAbout([1, 1], Math.PI / 2);
  const p = applyAffine(r, [2, 1]);
  assertClose(p[0], 1, 1e-12);
  assertClose(p[1], 2, 1e-12);
  const c = applyAffine(r, [1, 1]);
  assertClose(c[0], 1, 1e-12);
  assertClose(c[1], 1, 1e-12);
});
