import { test } from "node:test";
import assert from "node:assert/strict";
import { assertArrayClose, assertClose, assertMatClose } from "./helpers";
import {
  IDENTITY, Mat3, Quat, Sequence, Vec3, axisRotation, cross, det, dot, eulerRates, eulerToMat,
  matMul, matToEuler, matToQuat, matVec, nearestRotation, normalize, orthogonalityError, qDerivative,
  qFromAxisAngle, qMul, qNearest, qNeg, qNorm, qSlerp, qToAxisAngle, qToMat, skew, torqueFreeStep,
  transpose,
} from "../src/rotation/rotation_math";

const I3: Mat3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
const quatArr = (q: Quat) => [q.w, q.x, q.y, q.z];
// q and −q are the same rotation.
const assertSameRotation = (a: Quat, b: Quat, tol = 1e-9) =>
  assertArrayClose(quatArr(qNearest(a, b)), quatArr(b), tol);

// A fixed set of rotations, so the tests don't depend on Math.random.
const SAMPLE_QUATS: Quat[] = [
  IDENTITY,
  qFromAxisAngle([1, 0, 0], 0.3),
  qFromAxisAngle([0, 1, 0], 2.9),
  qFromAxisAngle([1, 2, 3], 1.1),
  qFromAxisAngle([-1, 0.5, 0.2], Math.PI),     // 180°: trace = −1
  qFromAxisAngle([0, 0, 1], Math.PI - 1e-3),
  qFromAxisAngle([0.3, -0.7, 0.1], 4.0),
];

test("vector helpers", () => {
  assert.equal(dot([1, 2, 3], [4, 5, 6]), 32);
  assert.deepEqual(cross([1, 0, 0], [0, 1, 0]), [0, 0, 1]);
  assertArrayClose(normalize([3, 0, 4]), [0.6, 0, 0.8]);
  assert.deepEqual(normalize([0, 0, 0]), [0, 0, 0]);
});

test("axisRotation is right-handed", () => {
  assertArrayClose(matVec(axisRotation(2, Math.PI / 2), [1, 0, 0]), [0, 1, 0]);
  assertArrayClose(matVec(axisRotation(0, Math.PI / 2), [0, 1, 0]), [0, 0, 1]);
  assertArrayClose(matVec(axisRotation(1, Math.PI / 2), [0, 0, 1]), [1, 0, 0]);
});

test("det, transpose, and orthogonalityError", () => {
  const r = axisRotation(1, 0.7);
  assertClose(det(r), 1);
  assertMatClose(matMul(transpose(r), r), I3);
  assertClose(orthogonalityError(r), 0);
  assertClose(orthogonalityError([[2, 0, 0], [0, 1, 0], [0, 0, 1]]), 3);
});

test("nearestRotation recovers a rotation from a perturbed one and rejects reflections", () => {
  const r = qToMat(qFromAxisAngle([1, 1, 0], 0.8));
  const noisy = r.map((row, i) => row.map((x, j) => x + 0.01 * Math.sin(3 * i + j)));
  const fixed = nearestRotation(noisy)!;
  assert.ok(orthogonalityError(fixed) < 1e-12);
  assertClose(det(fixed), 1, 1e-12);
  assertMatClose(fixed, r, 0.03);
  assertMatClose(nearestRotation(r)!, r, 1e-12);
  assert.equal(nearestRotation([[-1, 0, 0], [0, 1, 0], [0, 0, 1]]), null);
  assert.equal(nearestRotation([[0, 0, 0], [0, 0, 0], [0, 0, 0]]), null);
});

test("quaternion product composes rotations like matrix product", () => {
  const a = SAMPLE_QUATS[3], b = SAMPLE_QUATS[6];
  assertMatClose(qToMat(qMul(a, b)), matMul(qToMat(a), qToMat(b)));
  assertSameRotation(qMul(IDENTITY, a), a);
});

test("qToMat and matToQuat are inverse, including near 180°", () => {
  for (const q of SAMPLE_QUATS) {
    const r = qToMat(q);
    assert.ok(orthogonalityError(r) < 1e-12);
    assertSameRotation(matToQuat(r), q);
    assertClose(qNorm(matToQuat(r)), 1);
  }
});

test("qFromAxisAngle and qToAxisAngle round-trip", () => {
  const { axis, angle } = qToAxisAngle(qFromAxisAngle([0, 3, 4], 1.2));
  assertArrayClose(axis, [0, 0.6, 0.8]);
  assertClose(angle, 1.2);
  assert.deepEqual(qToAxisAngle(IDENTITY), { axis: [0, 0, 1], angle: 0 });
  assert.equal(qToAxisAngle(qNeg(IDENTITY)).angle, 2 * Math.PI);
  // −q gives the angle 2π − θ about −n.
  const neg = qToAxisAngle(qNeg(qFromAxisAngle([1, 0, 0], 1)));
  assertArrayClose(neg.axis, [-1, 0, 0]);
  assertClose(neg.angle, 2 * Math.PI - 1);
});

test("qNearest picks the sign closer to the reference", () => {
  const q = qFromAxisAngle([0, 0, 1], 0.5);
  assert.deepEqual(qNearest(qNeg(q), q), q);
  assert.deepEqual(qNearest(q, q), q);
});

const SEQUENCES: Sequence[] = [[2, 1, 0], [0, 1, 2], [1, 2, 0], [2, 0, 2], [0, 1, 0], [1, 0, 1]];

test("matToEuler inverts eulerToMat for every sequence, intrinsic and extrinsic", () => {
  for (const seq of SEQUENCES) {
    const proper = seq[0] === seq[2];
    const angles: Vec3 = proper ? [0.4, 1.1, -2.0] : [0.4, -0.6, 2.5];
    for (const extrinsic of [false, true]) {
      const r = eulerToMat(seq, angles, extrinsic);
      const back = matToEuler(r, seq, extrinsic);
      assertArrayClose(back, angles, 1e-9);
    }
  }
});

test("extrinsic Euler angles equal the reversed intrinsic sequence with reversed angles", () => {
  const ext = eulerToMat([2, 1, 0], [0.1, 0.2, 0.3], true);
  const int = eulerToMat([0, 1, 2], [0.3, 0.2, 0.1], false);
  assertMatClose(ext, int);
});

test("matToEuler at gimbal lock puts the whole rotation into the first angle", () => {
  const r = eulerToMat([2, 1, 0], [0.5, Math.PI / 2, 0.2], false);
  const back = matToEuler(r, [2, 1, 0], false);
  assertClose(back[1], Math.PI / 2, 1e-6);
  assert.equal(back[2], 0);
  assertMatClose(eulerToMat([2, 1, 0], back, false), r, 1e-6);
});

test("qDerivative matches a finite difference of a steady rotation", () => {
  const omega: Vec3 = [0.3, -0.2, 0.5];
  const speed = Math.hypot(...omega), h = 1e-6;
  const q0 = SAMPLE_QUATS[3];
  const q1 = qMul(qFromAxisAngle(omega, speed * h), q0);
  const d = qDerivative(q0, omega);
  assertArrayClose(quatArr(d), quatArr(q1).map((x, i) => (x - quatArr(q0)[i]) / h), 1e-5);
});

test("skew is the matrix of the cross product", () => {
  const a: Vec3 = [1, 2, 3], b: Vec3 = [-2, 0.5, 4];
  assertArrayClose(matVec(skew(a), b), cross(a, b));
});

test("eulerRates reproduce the angular velocity", () => {
  const seq: Sequence = [2, 1, 0], angles: Vec3 = [0.3, 0.4, -0.2], omega: Vec3 = [0.1, -0.5, 0.7];
  for (const extrinsic of [false, true]) {
    const { rates, jacobianDet } = eulerRates(seq, angles, extrinsic, omega);
    assert.ok(Math.abs(jacobianDet) > 0.1);
    const h = 1e-6;
    const r0 = eulerToMat(seq, angles, extrinsic);
    const r1 = eulerToMat(seq, angles.map((a, i) => a + h * rates[i]) as Vec3, extrinsic);
    // Ṙ Rᵀ = [ω]×
    const rdot = r1.map((row, i) => row.map((x, j) => (x - r0[i][j]) / h));
    assertMatClose(matMul(rdot, transpose(r0)), skew(omega), 1e-5);
  }
});

test("eulerRates is singular at gimbal lock", () => {
  const { jacobianDet } = eulerRates([2, 1, 0], [0.2, Math.PI / 2, 0.1], false, [0, 0, 1]);
  assertClose(jacobianDet, 0, 1e-12);
});

test("torqueFreeStep conserves energy and angular momentum", () => {
  const inertia: Vec3 = [1, 2, 3];
  let q: Quat = IDENTITY, wb: Vec3 = [0.1, 1.0, 0.1];
  const energy = (w: Vec3) => w.reduce((s, x, i) => s + inertia[i] * x * x, 0) / 2;
  const momentum = (q: Quat, w: Vec3) => matVec(qToMat(q), [inertia[0] * w[0], inertia[1] * w[1], inertia[2] * w[2]]);
  const e0 = energy(wb), l0 = momentum(q, wb);
  for (let i = 0; i < 2000; i++) ({ q, wb } = torqueFreeStep(q, wb, inertia, 0.005));
  assertClose(energy(wb), e0, 1e-6);
  assertArrayClose(momentum(q, wb), l0, 1e-5);
  assertClose(qNorm(q), 1, 1e-12);
});

test("qSlerp interpolates along the shorter arc", () => {
  const a = IDENTITY, b = qFromAxisAngle([0, 0, 1], 1);
  assertSameRotation(qSlerp(a, b, 0), a);
  assertSameRotation(qSlerp(a, b, 1), b);
  assertSameRotation(qSlerp(a, b, 0.5), qFromAxisAngle([0, 0, 1], 0.5));
  // −b is the same rotation, so slerp still turns by 0.5 rad, not the long way round.
  assertSameRotation(qSlerp(a, qNeg(b), 0.5), qFromAxisAngle([0, 0, 1], 0.5));
  // Nearly equal quaternions use the normalized linear interpolation branch.
  const c = qFromAxisAngle([0, 0, 1], 1e-3);
  assertClose(qNorm(qSlerp(a, c, 0.5)), 1);
});
