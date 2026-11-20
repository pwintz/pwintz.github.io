// Shared assertions for the unit tests.
import assert from "node:assert/strict";

export function assertClose(actual: number, expected: number, tol = 1e-9, message?: string): void {
  assert.ok(Math.abs(actual - expected) <= tol,
    message ?? `expected ${expected}, got ${actual} (tolerance ${tol})`);
}

export function assertArrayClose(actual: ArrayLike<number>, expected: ArrayLike<number>, tol = 1e-9): void {
  assert.equal(actual.length, expected.length, "lengths differ");
  for (let i = 0; i < expected.length; i++) {
    assertClose(actual[i], expected[i], tol, `index ${i}: expected ${expected[i]}, got ${actual[i]}`);
  }
}

export function assertMatClose(actual: number[][], expected: number[][], tol = 1e-9): void {
  assert.equal(actual.length, expected.length, "row counts differ");
  actual.forEach((row, i) => assertArrayClose(row, expected[i], tol));
}
