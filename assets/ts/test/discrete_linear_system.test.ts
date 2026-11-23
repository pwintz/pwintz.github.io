import { test } from "node:test";
import assert from "node:assert/strict";
import {
  Mat2, Vec2, apply, blend, coordinates, eigenInfo, eigenvectorFor, fate, niceVector, partsAt, snapToLine, stepBetween, trajectory, turnBetween,
} from "../src/discrete_system/system_math";
import { assertArrayClose, assertClose } from "./helpers";

test("trajectory applies A repeatedly", () => {
  // The Fibonacci matrix: (F_{k+1}, F_k).
  const xs = trajectory([[1, 1], [1, 0]], [1, 0], 6);
  assert.deepEqual(xs.map(x => x[1]), [0, 1, 1, 2, 3, 5, 8]);
  assert.equal(xs.length, 7);
});

test("niceVector makes the smallest component ±1 and the first one positive", () => {
  assert.deepEqual(niceVector([2, 4]), [1, 2]);
  assert.deepEqual(niceVector([-3, 6]), [1, -2]);
  assert.deepEqual(niceVector([0, -5]), [0, 1]);
  assert.deepEqual(niceVector([0, 0]), [0, 0]);
});

test("eigenInfo: two distinct real eigenvalues, the larger in size first", () => {
  const A: Mat2 = [[1, 1], [0.25, 1]];
  const info = eigenInfo(A);
  assert.equal(info.kind, "real");
  if (info.kind !== "real") return;
  assertArrayClose(info.values, [1.5, 0.5]);
  assertArrayClose(info.vectors[0], [2, 1]);
  assertArrayClose(info.vectors[1], [2, -1]);
  for (let i = 0; i < 2; i++) {
    assertArrayClose(apply(A, info.vectors[i]), info.vectors[i].map(c => c * info.values[i]));
  }
  // A negative eigenvalue larger in size comes first.
  const B = eigenInfo([[0.5, 0], [0, -2]]);
  assert.equal(B.kind, "real");
  if (B.kind === "real") {
    assertArrayClose(B.values, [-2, 0.5]);
    assertArrayClose(B.vectors[0], [0, 1]);
  }
});

test("eigenInfo: repeated, scalar, and complex cases", () => {
  assert.deepEqual(eigenInfo([[0.8, 0], [0, 0.8]]), { kind: "scalar", value: 0.8 });
  const shear = eigenInfo([[0.9, 0.5], [0, 0.9]]);
  assert.equal(shear.kind, "defective");
  if (shear.kind === "defective") assertArrayClose(shear.vector, [1, 0]);
  const rot = eigenInfo([[0.8, -0.6], [0.6, 0.8]]);
  assert.equal(rot.kind, "complex");
  if (rot.kind === "complex") {
    assertClose(rot.modulus, 1);
    assertClose(rot.angle, Math.atan2(0.6, 0.8));
  }
});

test("eigenvectorFor solves (A − λI)v = 0 when a row of A − λI is zero", () => {
  assertArrayClose(eigenvectorFor([[2, 0], [3, 5]], 2), [1, -1]);
  assertArrayClose(eigenvectorFor([[2, 0], [3, 5]], 5), [0, 1]);
});

test("x_k = c₁λ₁ᵏv₁ + c₂λ₂ᵏv₂ matches the trajectory", () => {
  const A: Mat2 = [[0.7, 0.2], [0.2, 0.4]];
  const info = eigenInfo(A);
  assert.equal(info.kind, "real");
  if (info.kind !== "real") return;
  const x0: Vec2 = [0.5, 1];
  const c = coordinates(info.vectors, x0);
  const xs = trajectory(A, x0, 8);
  for (let k = 0; k <= 8; k++) {
    const [p, q] = partsAt(info.values, info.vectors, c, k);
    assertArrayClose([p[0] + q[0], p[1] + q[1]], xs[k], 1e-12);
  }
});

test("snapToLine snaps only within the tolerance", () => {
  assertArrayClose(snapToLine([1, 1.01], [1, 1], 0.05)!, [1.005, 1.005]);
  assert.equal(snapToLine([1, 1.5], [1, 1], 0.05), null);
  // Either direction along the line.
  assertArrayClose(snapToLine([-2, -2.02], [1, 1], 0.05)!, [-2.01, -2.01]);
});

test("fate sorts the long-run behavior by the sizes of the eigenvalues", () => {
  assert.equal(fate(eigenInfo([[0.7, 0.2], [0.2, 0.4]])), "decays");
  assert.equal(fate(eigenInfo([[1.3, 0.1], [0.2, 1.2]])), "grows");
  assert.equal(fate(eigenInfo([[1, 1], [0.25, 1]])), "saddle");
  assert.equal(fate(eigenInfo([[1, 1], [1, 0]])), "saddle");
  assert.equal(fate(eigenInfo([[0.9, 0.2], [0.1, 0.8]])), "bounded");
  assert.equal(fate(eigenInfo([[0.8, -0.6], [0.6, 0.8]])), "bounded");
  assert.equal(fate(eigenInfo([[0.8, -0.5], [0.5, 0.8]])), "decays");
  assert.equal(fate(eigenInfo([[1, 1], [0, 1]])), "grows");
});

test("blend is geometric for values of one sign and linear across 0", () => {
  assertClose(blend(1, 4, 0.5), 2);
  assertClose(blend(-1, -4, 0.5), -2);
  assertClose(blend(1, -3, 0.25), 0);
  assertClose(blend(0, 2, 0.5), 1);
});

test("turnBetween turns by the smaller angle and scales geometrically", () => {
  assertArrayClose(turnBetween([1, 0], [0, 4], 0.5), [Math.SQRT2, Math.SQRT2]);
  assertArrayClose(turnBetween([1, 0], [0, -1], 0.5), [Math.SQRT1_2, -Math.SQRT1_2]);
});

test("stepBetween runs from p to Ap, and each eigenvector part changes on its own", () => {
  const A: Mat2 = [[1, 1], [0.25, 1]];   // λ = 1.5 along (2, 1) and 0.5 along (2, −1)
  const info = eigenInfo(A);
  const p: Vec2 = [0.5, 1];
  assertArrayClose(stepBetween(A, info, p, 0), p);
  assertArrayClose(stepBetween(A, info, p, 1), apply(A, p));
  // Halfway, each coefficient is multiplied by √λ: the state "x_{1/2}".
  if (info.kind !== "real") return;
  const c = coordinates(info.vectors, p);
  const half = stepBetween(A, info, p, 0.5);
  assertArrayClose(coordinates(info.vectors, half), [c[0] * Math.sqrt(1.5), c[1] * Math.sqrt(0.5)]);
  // A rotation turns at constant length.
  const R: Mat2 = [[0, -1], [1, 0]];
  assertArrayClose(stepBetween(R, eigenInfo(R), [2, 0], 0.5), [Math.SQRT2, Math.SQRT2]);
  // A = −I shrinks through the origin rather than turning.
  const N: Mat2 = [[-1, 0], [0, -1]];
  assertArrayClose(stepBetween(N, eigenInfo(N), [2, 0], 0.5), [0, 0]);
});
