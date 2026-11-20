import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeQuery } from "../src/common/query";
import { fdot, isZeroVec } from "../src/matrix/linalg";
import { isZero } from "../src/matrix/fraction";
import {
  F, KINDS, Problem, classify, combo, hasProblem, decodeProblem, encodeProblem, familyOf, fromCols, gramSchmidt2, isValid, lineTex, normalSolution,
  nullBasis, pictureOf, projCoeff, randomProblem, rankOf,
} from "../src/projection/practice_math";

const v = (...xs: number[]) => xs.map(x => F(x));
const nums = (xs: { num: bigint; den: bigint }[]) => xs.map(x => Number(x.num) / Number(x.den));
const den = (x: { num: bigint; den: bigint }) => F(x.num, x.den).den;

// A seeded random number generator, so failures can be reproduced.
function rng(seed: number): () => number {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

test("mergeQuery replaces only its own parameters", () => {
  assert.equal(mergeQuery("?mode=lsq&A=1,2;3,4&pk=projv&pv=4,2", ["pk", "pv", "px"], ["pk=projgs", "px=1,2,3"]),
    "?mode=lsq&A=1,2;3,4&pk=projgs&px=1,2,3");
  assert.equal(mergeQuery("", ["mode"], ["mode=fit"]), "?mode=fit");
  assert.equal(mergeQuery("?mode=fit", ["mode"], []), "");
  assert.equal(mergeQuery("st=2&x=1", ["st"], ["st=3"]), "?x=1&st=3");
});

test("the lecture examples: projection onto a vector, least squares, and a line of best fit", () => {
  // x = (1, 3) onto v = (4, 2): ⟨x, v⟩/‖v‖² = 10/20 = 1/2.
  assert.deepEqual(nums([projCoeff(v(1, 3), v(4, 2))]), [0.5]);
  // Lay, Example 6.1: x* = (1, 2).
  const s = normalSolution([v(4, 0, 1), v(0, 2, 1)], v(2, 0, 11));
  assert.deepEqual(nums(s.xstar), [1, 2]);
  assert.deepEqual(nums(s.r), [-2, -4, 8]);
  // The line through (3, 0), (1, 8), (−1, −8): y = −2 + 2x.
  const fit = normalSolution([v(1, 1, 1), v(3, 1, -1)], v(0, 8, -8));
  assert.deepEqual(nums(fit.xstar), [-2, 2]);
  assert.equal(lineTex(fit.xstar[0], fit.xstar[1]), "-2 + 2x");
  assert.equal(lineTex(F(3), F(-1)), "3 - x");
  assert.equal(lineTex(F(0), F(1, 2)), "\\frac{1}{2}x");
});

test("gramSchmidt2 gives an integer vector orthogonal to v₁ in the span", () => {
  const v1 = v(1, 0, 1), v2 = v(1, 1, 0);
  const { raw, u2 } = gramSchmidt2(v1, v2);
  assert.deepEqual(nums(raw), [0.5, 1, -0.5]);
  assert.deepEqual(nums(u2), [1, 2, -1]);
  assert.ok(isZero(fdot(u2, v1)));
  assert.equal(rankOf([v1, v2, u2]), 2);
});

test("nullBasis is orthogonal to the rows", () => {
  const rows = [v(1, 1, 1, 1), v(0, 1, 2, 3)];
  const basis = nullBasis(rows);
  assert.equal(basis.length, 2);
  for (const b of basis) for (const r of rows) assert.ok(isZero(fdot(b, r)));
});

test("random problems are valid, have small numbers, and survive the address", () => {
  const r = rng(12345);
  for (const kind of KINDS) {
    for (let i = 0; i < 40; i++) {
      const p = randomProblem(kind, r);
      assert.equal(p.kind, kind);
      assert.ok(isValid(p), `${kind}: ${encodeProblem(p)}`);
      const back = decodeProblem(`?${encodeProblem(p)}&st=2`) as Problem;
      assert.ok(back, `${kind} decodes`);
      assert.equal(encodeProblem(back), encodeProblem(p));
      const family = familyOf(kind);
      if (family === "proj") {
        // The coefficients (with Gram–Schmidt's u₂ for a basis that isn't orthogonal) have small denominators.
        const us = kind === "projgs" ? [p.cols[0], gramSchmidt2(p.cols[0], p.cols[1]).u2] : p.cols;
        const cs = us.map(u => projCoeff(p.target, u));
        for (const c of cs) assert.ok(den(c) <= 3n, `${kind}: ${encodeProblem(p)}`);
        if (kind === "projorth") assert.ok(isZero(fdot(p.cols[0], p.cols[1])));
        if (kind === "projgs") assert.ok(!isZero(fdot(p.cols[0], p.cols[1])));
        if (kind !== "projv") assert.ok(!isZeroVec(combo(cs, us).map((x, k) => F(p.target[k].num * x.den - x.num * p.target[k].den, x.den * p.target[k].den))));
      } else {
        // Integer least squares solutions, and a residual orthogonal to the columns but not zero.
        const s = normalSolution(p.cols, p.target);
        for (const x of s.xstar) assert.equal(den(x), 1n, `${kind}: ${encodeProblem(p)}`);
        assert.ok(!isZeroVec(s.r));
        for (const c of p.cols) assert.ok(isZero(fdot(c, s.r)));
      }
    }
  }
});

test("decodeProblem reads the visualizer's parameters and classifies the problem", () => {
  assert.equal(decodeProblem("?mode=proj&v1=0,0&x=1,2"), null);
  assert.equal(decodeProblem("?mode=proj&v1=1,0,1&v2=1,1,0&v3=0,1,1&x=1,2,3"), null);  // Three vectors
  assert.equal(decodeProblem("?mode=lsq&A=1,2;2,4;1,2&b=1,0,2"), null);                // Dependent columns
  assert.equal(decodeProblem("?mode=fit&deg=1&pts=1,2;1,3"), null);                     // One x-value
  assert.equal(decodeProblem("?mode=fit&deg=2&pts=1,2;2,3;3,5"), null);                 // Not a line
  assert.equal(decodeProblem("?pk=projv"), null);
  assert.equal(decodeProblem("?mode=proj&v1=4,2&x=1,3")!.kind, "projv");
  assert.equal(decodeProblem("?mode=proj&v1=1,2,2&x=3,0,3")!.kind, "projline");
  assert.equal(decodeProblem("?mode=proj&v1=1,1,0&v2=1,-1,1&x=2,4,3")!.kind, "projorth");
  assert.equal(decodeProblem("?mode=proj&v1=1,0,1&v2=1,1,0&x=1,2,3")!.kind, "projgs");
  assert.equal(decodeProblem("?mode=lsq&A=4,0;0,2;1,1&b=2,0,11")!.kind, "lsqres");
  assert.equal(decodeProblem("?mode=lsq&A=4,0;0,2;1,1&b=2,0,11&pk=lsq&st=5")!.kind, "lsq");
  // A kind that doesn't fit the problem is replaced by one that does.
  assert.equal(decodeProblem("?mode=proj&v1=4,2&x=1,3&pk=projorth")!.kind, "projv");
  assert.equal(decodeProblem("?mode=fit&deg=1&pts=3,0;1,8;-1,-8")!.kind, "fitline");
  assert.ok(hasProblem("?mode=proj&v1=0,0&x=1,2"));
  assert.ok(!hasProblem("?st=2"));
});

test("classify follows a problem designed in the visualizer", () => {
  assert.equal(classify("proj", [v(4, 2)], v(1, 3))!.kind, "projv");
  assert.equal(classify("lsq", [v(4, 0, 1), v(0, 2, 1)], v(2, 0, 11), 1, "lsq")!.kind, "lsq");
  assert.equal(classify("lsq", [v(4, 0, 1), v(0, 2, 1)], v(2, 0, 11), 1, "projv")!.kind, "lsqres");
  assert.equal(classify("fit", [v(1, 1, 1), v(3, 1, -1)], v(0, 8, -8), 2), null);
});

test("pictureOf matches the visualizer's examples", () => {
  const p = decodeProblem("?mode=lsq&A=4,0;0,2;1,1&b=2,0,11")!;
  assert.deepEqual(pictureOf(p), { mode: "lsq", A: [["4", "0"], ["0", "2"], ["1", "1"]], b: ["2", "0", "11"] });
  const f = decodeProblem("?mode=fit&deg=1&pts=3,0;1,8;-1,-8")!;
  assert.deepEqual(pictureOf(f), { mode: "fit", degree: 1, pts: [["3", "0"], ["1", "8"], ["-1", "-8"]] });
  assert.deepEqual(fromCols([v(1, 2), v(3, 4)]).map(nums), [[1, 3], [2, 4]]);
});
