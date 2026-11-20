import { test } from "node:test";
import assert from "node:assert/strict";
import { ambiguityNote, analyze, joinAnd, systemInfo } from "../src/matrix/echelon";
import { Fraction, fraction } from "../src/matrix/fraction";

const m = (rows: number[][]): Fraction[][] => rows.map(r => r.map(x => fraction(x)));
const counts = (rows: number[][]) => analyze(m(rows)).violations.map(v => v.length);

test("joinAnd joins with commas and 'and'", () => {
  assert.equal(joinAnd([]), "");
  assert.equal(joinAnd([1]), "1");
  assert.equal(joinAnd([1, 2]), "1 and 2");
  assert.equal(joinAnd([2, 3, 5]), "2, 3, and 5");
});

test("analyze recognizes RREF", () => {
  const a = analyze(m([[1, 0, 2], [0, 1, 3], [0, 0, 0]]));
  assert.equal(a.form, "RREF");
  assert.deepEqual(a.leading, [0, 1, null]);
  assert.deepEqual(a.ambiguous, []);
  assert.deepEqual(a.violations.map(v => v.length), [0, 0, 0, 0]);
});

test("analyze recognizes REF that is not RREF", () => {
  // Leading entry 2 breaks condition 3; the 4 above the second pivot breaks condition 4.
  const a = analyze(m([[2, 4, 1], [0, 1, 3]]));
  assert.equal(a.form, "REF");
  assert.deepEqual(a.violations.map(v => v.length), [0, 0, 1, 1]);
  assert.match(a.violations[2][0].message, /row 1 is 2, not 1/);
  assert.deepEqual(a.violations[3][0].cells, [[1, 1], [0, 1]]);
});

test("a zero row above a nonzero row violates condition 1 and makes condition 2 ambiguous", () => {
  const a = analyze(m([[1, 0], [0, 0], [0, 1]]));
  assert.equal(a.form, "neither");
  assert.equal(a.violations[0].length, 1);
  assert.match(a.violations[0][0].message, /Row 2 is all zeros, but row 3/);
  assert.deepEqual(a.ambiguous, [2]);
  assert.match(ambiguityNote(a), /^Row 3 has a zero row directly above/);
});

test("leading entries in the same column or moving left violate condition 2", () => {
  assert.deepEqual(counts([[1, 2], [1, 3]]).slice(0, 2), [0, 1]);
  const left = analyze(m([[0, 1], [1, 0]]));
  assert.equal(left.form, "neither");
  assert.match(left.violations[1][0].message, /left of the leading entry of row 1/);
});

test("the zero matrix and the empty matrix are in RREF", () => {
  assert.equal(analyze(m([[0, 0], [0, 0]])).form, "RREF");
  assert.equal(analyze([]).form, "RREF");
});

test("ambiguityNote lists several rows", () => {
  const a = analyze(m([[0, 0, 0], [1, 0, 0], [0, 0, 0], [0, 1, 0]]));
  assert.deepEqual(a.ambiguous, [1, 3]);
  assert.match(ambiguityNote(a), /^Rows 2 and 4 have/);
});

test("systemInfo: unique solution", () => {
  const info = systemInfo([0, 1], 3);
  assert.deepEqual(info, { rankA: 2, rankAb: 2, pivotCols: [0, 1], freeCols: [], bRow: null, solutions: "one" });
});

test("systemInfo: infinitely many solutions", () => {
  const info = systemInfo([0, null], 4);
  assert.deepEqual(info.freeCols, [1, 2]);
  assert.equal(info.solutions, "infinite");
});

test("systemInfo: an inconsistent row means no solution", () => {
  const info = systemInfo([0, 2], 3);
  assert.equal(info.bRow, 1);
  assert.equal(info.rankA, 1);
  assert.equal(info.rankAb, 2);
  assert.equal(info.solutions, "none");
});
