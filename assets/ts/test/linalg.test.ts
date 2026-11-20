import { test } from "node:test";
import assert from "node:assert/strict";
import { fraction } from "../src/matrix/fraction";
import {
  FMat, clearDenominators, fadd, fdot, fromColumns, fscale, fsub, isZeroVec, matMul, matVec, rref,
  toNumber, transpose,
} from "../src/matrix/linalg";

const v = (...xs: number[]) => xs.map(x => fraction(x));
const mat = (rows: number[][]): FMat => rows.map(r => v(...r));

test("vector arithmetic", () => {
  assert.deepEqual(fdot(v(1, 2, 3), v(4, 5, 6)), fraction(32));
  assert.deepEqual(fscale(fraction(1, 2), v(2, 4)), v(1, 2));
  assert.deepEqual(fadd(v(1, 2), v(3, 4)), v(4, 6));
  assert.deepEqual(fsub(v(1, 2), v(3, 4)), v(-2, -2));
  assert.ok(isZeroVec(v(0, 0)));
  assert.ok(!isZeroVec(v(0, 1)));
  assert.equal(toNumber(fraction(3, 4)), 0.75);
});

test("transpose, fromColumns, and products", () => {
  const a = mat([[1, 2, 3], [4, 5, 6]]);
  assert.deepEqual(transpose(a), mat([[1, 4], [2, 5], [3, 6]]));
  assert.deepEqual(transpose([]), []);
  assert.deepEqual(fromColumns([v(1, 2), v(3, 4)]), mat([[1, 3], [2, 4]]));
  assert.deepEqual(matMul(mat([[1, 2], [3, 4]]), mat([[5, 6], [7, 8]])), mat([[19, 22], [43, 50]]));
  assert.deepEqual(matVec(a, v(1, 0, -1)), v(-2, -2));
});

test("rref of an invertible matrix is the identity", () => {
  const { r, pivots } = rref(mat([[2, 1], [1, 3]]));
  assert.deepEqual(r, mat([[1, 0], [0, 1]]));
  assert.deepEqual(pivots, [0, 1]);
});

test("rref of a rank-deficient matrix, with exact fractions", () => {
  const { r, pivots } = rref(mat([[1, 2, 3], [2, 4, 7], [3, 6, 10]]));
  assert.deepEqual(r, mat([[1, 2, 0], [0, 0, 1], [0, 0, 0]]));
  assert.deepEqual(pivots, [0, 2]);
  const thirds = rref(mat([[3, 1]])).r;
  assert.deepEqual(thirds, [[fraction(1), fraction(1, 3)]]);
});

test("rref swaps rows to find a pivot and leaves its input unchanged", () => {
  const input = mat([[0, 1], [1, 0]]);
  const copy = input.map(row => [...row]);
  assert.deepEqual(rref(input).r, mat([[1, 0], [0, 1]]));
  assert.deepEqual(input, copy);
});

test("clearDenominators gives the primitive integer multiple", () => {
  const { v: w, factor } = clearDenominators([fraction(1, 2), fraction(-1, 3), fraction(0)]);
  assert.deepEqual(w, v(3, -2, 0));
  assert.deepEqual(factor, fraction(6));
  assert.deepEqual(clearDenominators(v(4, 6)).v, v(2, 3));
  assert.deepEqual(clearDenominators(v(-4, 6)).v, v(-2, 3));
  const zero = v(0, 0);
  assert.deepEqual(clearDenominators(zero), { v: zero, factor: fraction(1) });
});
