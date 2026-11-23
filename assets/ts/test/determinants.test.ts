// The determinants practice page: exact determinants, cofactor expansions, row reduction, the
// address encoding, random problems, and the steps (each step's own answer passes its check).
import { test } from "node:test";
import assert from "node:assert/strict";
import { equals } from "../src/matrix/fraction";
import {
  F, KINDS, Problem, bestLine, decodeProblem, det, eliminate, encodeProblem, expansion, fromInts, isTriangular, isUpper, kindSizes,
  minorMatrix, problemError, randomProblem, toNumber,
} from "../src/determinants/det_math";
import { buildSteps, scaledA } from "../src/determinants/practice_page";
import { sameAsLastLevel } from "../src/common/step_practice";

function rng(seed: number): () => number {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const detOf = (rows: number[][]) => toNumber(det(fromInts(rows)));

test("determinants of 2 × 2, 3 × 3, and 4 × 4 matrices", () => {
  assert.equal(detOf([[3, 1], [2, 4]]), 10);
  assert.equal(detOf([[0, 1], [1, 0]]), -1);
  assert.equal(detOf([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), 0);
  assert.equal(detOf([[2, 1, 3], [1, -1, 2], [3, 2, 1]]), 10);
  assert.equal(detOf([[2, 1, 0, 3], [0, 0, 4, 0], [1, -1, 2, 2], [3, 0, 5, 1]]), -4 * detOf([[2, 1, 3], [1, -1, 2], [3, 0, 1]]));
  assert.equal(detOf([[1, 0, 0, 0], [4, -2, 0, 0], [7, 3, 3, 0], [-5, 8, 6, 2]]), -12);
  assert.ok(equals(det([[F(1, 2), F(1)], [F(1), F(4)]]), F(1)));
});

test("minors, the best line to expand along, and the expansion's terms", () => {
  const A = fromInts([[1, 2, 3], [0, 4, 0], [5, 6, 7]]);
  assert.deepEqual(minorMatrix(A, 1, 1).map(r => r.map(toNumber)), [[1, 3], [5, 7]]);
  assert.deepEqual(bestLine(A), { type: "row", index: 1 });
  const terms = expansion(A, bestLine(A));
  assert.equal(terms.length, 1);
  assert.equal(toNumber(terms[0].minor), -8);
  assert.equal(toNumber(terms[0].cofactor), -8);
  // A column with the most zeros.
  assert.deepEqual(bestLine(fromInts([[3, 0, 2], [1, 0, -4], [2, 5, 1]])), { type: "col", index: 1 });
  // No zeros: row 1.
  assert.deepEqual(bestLine(fromInts([[2, 1, 3], [1, -1, 2], [3, 2, 1]])), { type: "row", index: 0 });
  // Cofactor signs: the (1, 2) cofactor is the negative of its minor.
  const B = fromInts([[2, 1, 3], [1, -1, 2], [3, 2, 1]]);
  const t = expansion(B, { type: "row", index: 0 });
  assert.equal(toNumber(t[1].cofactor), -toNumber(t[1].minor));
  assert.equal(t.reduce((s, x) => s + toNumber(x.entry) * toNumber(x.cofactor), 0), 10);
});

test("row reduction to an upper triangular matrix keeps track of swaps", () => {
  const A = fromInts([[1, 2, 1], [2, 5, 4], [-1, 1, 6]]);
  const { steps, U, swaps } = eliminate(A);
  assert.equal(steps.length, 2);
  assert.equal(swaps, 0);
  assert.ok(isUpper(U));
  assert.deepEqual(U.map(r => r.map(toNumber)), [[1, 2, 1], [0, 1, 2], [0, 0, 1]]);
  assert.deepEqual(steps[0].ops.map(o => toNumber(o.factor)), [2, -1]);

  const S = fromInts([[0, 1, 2], [1, 3, 1], [2, 4, 3]]);
  const s = eliminate(S);
  assert.equal(s.swaps, 1);
  assert.equal(s.steps[0].swap, 1);
  const prod = s.U.reduce((p, row, i) => p * toNumber(row[i]), 1);
  assert.equal(-prod, detOf([[0, 1, 2], [1, 3, 1], [2, 4, 3]]));

  // A column with no pivot is skipped, and the determinant is 0.
  const Z = eliminate(fromInts([[0, 1, 2], [0, 3, 1], [0, 4, 3]]));
  assert.equal(Z.U.reduce((p, row, i) => p * toNumber(row[i]), 1), 0);
  // An upper triangular matrix needs no steps.
  assert.equal(eliminate(fromInts([[2, 1], [0, 3]])).steps.length, 0);
});

test("problems round-trip through the address, and bad ones are refused", () => {
  const ps: Problem[] = [
    { kind: "det2", A: fromInts([[3, -1], [2, 4]]) },
    { kind: "tri", A: [[F(1, 2), F(3), F(1)], [F(0), F(-2), F(1)], [F(0), F(0), F(5)]] },
    { kind: "props", n: 3, d: F(-5), k: F(1, 2), m: F(3) },
  ];
  for (const p of ps) {
    assert.equal(problemError(p), null, encodeProblem(p));
    assert.deepEqual(decodeProblem(encodeProblem(p)), p);
  }
  assert.equal(decodeProblem("dk=tri&dA=1,2,3;4,5,6;7,8,9"), null);
  assert.equal(decodeProblem("dk=det2&dA=1,2;3"), null);
  assert.equal(decodeProblem("dk=cofactor4&dA=1,2;3,4"), null);
  assert.equal(decodeProblem("dk=props&dn=3&dd=0&ds=2&dm=1"), null);
  assert.equal(decodeProblem("dk=nope"), null);
});

test("random problems are valid, and have the features each kind practices", () => {
  const rnd = rng(7);
  for (const kind of KINDS) {
    for (let k = 0; k < 200; k++) {
      const p = randomProblem(kind, rnd);
      assert.equal(problemError(p), null, `${kind}: ${encodeProblem(p)}`);
      if (p.kind === "props") continue;
      assert.ok(kindSizes(kind).includes(p.A.length));
      if (kind === "tri") assert.ok(isTriangular(p.A));
      if (kind === "cofactor4") assert.equal(expansion(p.A, bestLine(p.A)).length, 1, encodeProblem(p));
      if (kind === "rowreduce3") {
        // Whole numbers all the way through the elimination.
        const { steps, U } = eliminate(p.A);
        for (const s of steps) assert.ok(s.after.flat().every(x => x.den === 1n), encodeProblem(p));
        assert.ok(isUpper(U));
      }
    }
  }
  for (const size of [3, 4]) assert.equal((randomProblem("tri", rnd, size) as { A: unknown[] }).A.length, size);
});

test("every step's own answer passes its check, and its prerequisites come before it", () => {
  const rnd = rng(11);
  for (const kind of KINDS) {
    for (let k = 0; k < 60; k++) {
      const p = randomProblem(kind, rnd);
      const steps = buildSteps(p);
      assert.ok(steps.length > 0);
      assert.ok(steps.some(s => s.final), `${kind}: no answer step`);
      steps.forEach((s, i) => {
        const verdict = s.check(s.answer);
        assert.ok(verdict.ok, `${kind} step ${i + 1} (${s.title}) of ${encodeProblem(p)}`);
        assert.ok(s.prereqs.every(j => j < i));
        assert.ok(s.hints.length > 0);
      });
      // The last answer is det A (or, with a picture, the area or volume |det A|).
      const D = det(p.kind === "props" ? [[p.d]] : p.A);
      const dStep = steps.find(s => s.title.includes("\\det A\\)") && s.final);
      if (p.kind !== "props") assert.ok(dStep && equals(F(BigInt(dStep.answer[0].split("/")[0]), BigInt(dStep.answer[0].split("/")[1] ?? 1)), D));
    }
  }
  // Wrong answers fail, with a message for common mistakes.
  const steps = buildSteps({ kind: "det2", A: fromInts([[3, 1], [2, 4]]) });
  const v = steps[1].check(["-10"]);
  assert.equal(v.ok, false);
  assert.match(v.message ?? "", /bc - ad/);
  assert.match(steps[1].check(["14"]).message ?? "", /ad \+ bc/);
  const props = buildSteps({ kind: "props", n: 3, d: F(5), k: F(2), m: F(3) });
  assert.equal(props.length, 7);
  assert.deepEqual(props.map(s => s.answer[0]), ["5", "-5", "5", "10", "40", "25", "1/5"]);
});

test("kA in TeX", () => {
  assert.equal(scaledA(F(2)), "2A");
  assert.equal(scaledA(F(-1)), "-A");
  assert.equal(scaledA(F(1, 2)), "(1/2)A");
});

test("a support level that would repeat the last one is hidden (triangular and properties problems)", () => {
  const tri = buildSteps({ kind: "tri", A: fromInts([[2, 5, -1], [0, 3, 4], [0, 0, -1]]) });
  assert.equal(sameAsLastLevel(tri, 2, 3), true);   // Partial = None
  assert.equal(sameAsLastLevel(tri, 1, 3), false);  // Full is a worked example
  assert.equal(sameAsLastLevel(tri, 3, 3), false);  // The last level itself
  const props = buildSteps({ kind: "props", n: 3, d: F(5), k: F(2), m: F(3) });
  assert.equal(sameAsLastLevel(props, 2, 3), true);
  // Problems with steps that aren't answers keep every level.
  for (const kind of ["det2", "cofactor3", "rowreduce3", "cofactor4"] as const) {
    assert.equal(sameAsLastLevel(buildSteps(randomProblem(kind, rng(3))), 2, 3), false, kind);
  }
});

test("the cofactor expansion step: signed entries and the smaller matrices, typed out", () => {
  // Along row 1 of [[2, 1, 3], [1, -1, 2], [3, 2, 1]]: 2|−1 2; 2 1| − 1|1 2; 3 1| + 3|1 −1; 3 2|.
  const steps = buildSteps({ kind: "cofactor3", A: fromInts([[2, 1, 3], [1, -1, 2], [3, 2, 1]]) });
  const expand = steps[0];
  assert.deepEqual(expand.answer, ["2", "-1", "2", "2", "1", "-1", "1", "2", "3", "1", "3", "1", "-1", "3", "2"]);
  assert.equal(expand.check(expand.answer).ok, true);
  const wrongSign = [...expand.answer];
  wrongSign[5] = "1";
  const v = expand.check(wrongSign);
  assert.equal(v.ok, false);
  assert.match(v.message ?? "", /signs/);
  const wrongMinor = [...expand.answer];
  wrongMinor[1] = "2";
  assert.match(expand.check(wrongMinor).message ?? "", /crossing out/);
  // Then one step for the minors, det A, the volume, and whether A is singular.
  assert.deepEqual(steps[1].answer, ["-5", "-5", "5"]);
  assert.deepEqual(steps.slice(2).map(s => s.answer[0]), ["10", "10", "no"]);
});

test("the cofactor expansion step keeps zero terms, whose matrices are skipped", () => {
  // Along row 2 of [[1, 2, 3], [0, 4, 0], [5, 6, 7]]: 0|2 3; 6 7| + 4|1 3; 5 7| + 0|1 2; 5 6|.
  const steps = buildSteps({ kind: "cofactor3", A: fromInts([[1, 2, 3], [0, 4, 0], [5, 6, 7]]) });
  const expand = steps[0];
  assert.deepEqual(expand.answer, ["0", "", "", "", "", "4", "1", "3", "5", "7", "0", "", "", "", ""]);
  const v = expand.check(expand.answer);
  assert.equal(v.ok, true);
  assert.equal(v.marks?.[1], null);  // A skipped box isn't marked
  // A zero coefficient for a nonzero entry is wrong.
  const wrong = [...expand.answer];
  wrong[5] = "0";
  assert.equal(expand.check(wrong).ok, false);
  // Step 2 asks only for the one minor that is needed.
  assert.deepEqual(steps[1].answer, ["-8"]);
  assert.equal(steps[1].groups.length, 1);
});

test("every matrix problem ends by asking whether A is singular, after det A", () => {
  const rnd = rng(5);
  for (const kind of ["det2", "tri", "cofactor3", "rowreduce3", "cofactor4"] as const) {
    let singular = 0;
    for (let k = 0; k < 300; k++) {
      const p = randomProblem(kind, rnd);
      const steps = buildSteps(p);
      const last = steps[steps.length - 1];
      assert.match(last.title, /singular/);
      assert.equal(last.final, true);
      const d = steps.findIndex(s => s.title === "Find \\(\\det A\\)");
      assert.ok(d >= 0 && last.prereqs.includes(d), kind);
      const isSingular = p.kind !== "props" && equals(det(p.A), F(0));
      assert.deepEqual(last.answer, [isSingular ? "yes" : "no"]);
      assert.equal(last.check([isSingular ? "no" : "yes"]).ok, false);
      if (isSingular) singular++;
    }
    // Singular matrices come up often (about a third of the time).
    assert.ok(singular > 60 && singular < 160, `${kind}: ${singular} of 300 singular`);
  }
  // Properties problems don't have the question.
  assert.ok(!buildSteps({ kind: "props", n: 3, d: F(5), k: F(2), m: F(3) }).some(s => /singular/.test(s.title)));
});

test("a row of zeros is still expanded: every coefficient is 0, and no minor is needed", () => {
  const steps = buildSteps({ kind: "cofactor3", A: fromInts([[1, 2, 3], [0, 0, 0], [5, 6, 7]]) });
  // Step 1 (the expansion), det A, the volume, and whether A is singular.
  assert.equal(steps.length, 4);
  assert.match(steps[0].title, /cofactor expansion/);
  assert.deepEqual(steps[0].answer.filter(x => x !== ""), ["0", "0", "0"]);
  assert.equal(steps[0].check(steps[0].answer).ok, true);
  assert.deepEqual(steps[1].answer, ["0"]);
  assert.deepEqual(steps[1].prereqs, [0]);
  assert.deepEqual(steps[3].answer, ["yes"]);
});
