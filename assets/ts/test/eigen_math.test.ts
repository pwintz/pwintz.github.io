import { test } from "node:test";
import assert from "node:assert/strict";
import {
  F, KINDS, charPoly, decodeProblem, eigen2, eigenvalueOf, eigenvector2, encodeProblem, fromInts, matEq, nullBasis,
  polyTex, randomProblem, rationalEigen, rationalRoots, shift, sqrtParts, surdTex, surdValue, toNum,
} from "../src/eigen/eigen_math";
import { matVec } from "../src/matrix/linalg";

const nums = (v: { num: bigint; den: bigint }[]) => v.map(toNum);

// A seeded random number generator, so failures can be reproduced.
function rng(seed: number): () => number {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

test("charPoly of 2 × 2 and 3 × 3 matrices is det(A − λI)", () => {
  assert.deepEqual(nums(charPoly(fromInts([[2, 1], [1, 2]]))), [3, -4, 1]);
  // Upper triangular: (1 − λ)(2 − λ)(3 − λ) = −λ³ + 6λ² − 11λ + 6.
  assert.deepEqual(nums(charPoly(fromInts([[1, 5, 7], [0, 2, 4], [0, 0, 3]]))), [6, -11, 6, -1]);
  assert.equal(polyTex(charPoly(fromInts([[2, 1], [1, 2]]))), "\\lambda^{2} - 4\\lambda + 3");
});

test("rationalRoots finds roots with multiplicity", () => {
  // (λ − 2)²(λ + 1) = λ³ − 3λ² + 4
  const { roots, rest } = rationalRoots([F(4), F(0), F(-3), F(1)]);
  assert.deepEqual(nums(roots), [-1, 2, 2]);
  assert.equal(rest.length, 1);
  // λ² − 2 has no rational roots.
  assert.equal(rationalRoots([F(-2), F(0), F(1)]).roots.length, 0);
  // 2λ² − λ = λ(2λ − 1)
  assert.deepEqual(nums(rationalRoots([F(0), F(-1), F(2)]).roots), [0, 0.5]);
});

test("nullBasis and rationalEigen give eigenspaces", () => {
  const A = fromInts([[2, 0, 0], [0, 2, 0], [0, 0, 5]]);
  const { spaces, complete } = rationalEigen(A);
  assert.ok(complete);
  assert.deepEqual(spaces.map(s => [toNum(s.value), s.algebraic, s.basis.length]), [[2, 2, 2], [5, 1, 1]]);
  const J = fromInts([[3, 1], [0, 3]]);
  assert.equal(nullBasis(shift(J, F(3))).length, 1);
});

test("sqrtParts pulls out square factors", () => {
  assert.deepEqual(sqrtParts(12n), { s: 2n, r: 3n });
  assert.deepEqual(sqrtParts(-16n), { s: 4n, r: -1n });
  assert.deepEqual(sqrtParts(49n * 1000003n * 1000003n), { s: 7n * 1000003n, r: 1n });
});

test("eigen2 handles distinct, irrational, repeated, and complex eigenvalues", () => {
  const e = eigen2(fromInts([[2, 1], [1, 2]]));
  assert.equal(e.kind, "distinct");
  assert.deepEqual(e.roots.map(s => surdValue(s).re), [1, 3]);
  const fib = eigen2(fromInts([[1, 1], [1, 0]]));
  assert.equal(surdTex(fib.roots[1]), "\\frac{1 + \\sqrt{5}}{2}");
  assert.equal(surdTex(fib.roots[0]), "\\frac{1 - \\sqrt{5}}{2}");
  assert.equal(eigen2(fromInts([[1, 1], [0, 1]])).kind, "repeated");
  const rot = eigen2(fromInts([[0, -1], [1, 0]]));
  assert.equal(rot.kind, "complex");
  assert.equal(surdTex(rot.roots[0]), "i");
  assert.equal(surdTex(rot.roots[1]), "-i");
  assert.equal(surdTex(eigen2(fromInts([[1, -2], [2, 1]])).roots[0]), "1 + 2i");
});

test("eigenvector2 satisfies Av = λv (numerically, for surds)", () => {
  for (const rows of [[[1, 1], [1, 0]], [[2, 3], [1, 4]], [[0, 0], [5, 2]], [[3, 0], [0, 7]], [[1, -2], [2, 1]]]) {
    const A = fromInts(rows);
    for (const lambda of eigen2(A).roots) {
      const v = eigenvector2(A, lambda).map(surdValue);
      const l = surdValue(lambda);
      for (let i = 0; i < 2; i++) {
        // (Av)_i − λ v_i, with complex arithmetic.
        const re = toNum(A[i][0]) * v[0].re + toNum(A[i][1]) * v[1].re - (l.re * v[i].re - l.im * v[i].im);
        const im = toNum(A[i][0]) * v[0].im + toNum(A[i][1]) * v[1].im - (l.re * v[i].im + l.im * v[i].re);
        assert.ok(Math.abs(re) < 1e-9 && Math.abs(im) < 1e-9, `rows ${JSON.stringify(rows)}`);
      }
      assert.ok(v.some(x => x.re !== 0 || x.im !== 0));
    }
  }
});

test("random problems are valid and survive the URL", () => {
  const r = rng(12345);
  for (const kind of KINDS) {
    for (let k = 0; k < 40; k++) {
      const p = randomProblem(kind, r);
      const back = decodeProblem(encodeProblem(p));
      assert.ok(back, `${kind}: ${encodeProblem(p)}`);
      assert.ok(matEq(back.A, p.A));
      assert.ok(p.A.flat().every(x => x.den === 1n));
      if (kind === "evec") assert.ok(p.v && p.v.some(x => x.num !== 0n));
      if (kind === "eig3" || kind === "tri" || kind === "full2") assert.ok(rationalEigen(p.A).complete);
      if (kind === "evec" && p.v) {
        const l = eigenvalueOf(p.A, p.v);
        if (l) assert.deepEqual(nums(matVec(p.A, p.v)), nums(p.v.map(x => ({ num: x.num * l.num, den: x.den * l.den }))));
      }
    }
  }
});
