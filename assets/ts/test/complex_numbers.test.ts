// The complex numbers practice page: exact arithmetic, angles, square roots, the address encoding,
// random problems, and the steps (each step's own answer passes its check).
import { test } from "node:test";
import assert from "node:assert/strict";
import { equals } from "../src/matrix/fraction";
import {
  F, KINDS, Problem, angleTex, argNumber, cTex, cdiv, cmul, cnormSq, cosSinTex, cpow, cx, decodeProblem, encodeProblem, ipow, niceArg,
  normAngle, parseRoot, pictureOf, problemError, randomProblem, rootEquals, rootPow, rootText, sameAngle, sqrtOf, toNumber,
} from "../src/complex/complex_math";
import { buildSteps } from "../src/complex/practice_page";
import { assertArrayClose } from "./helpers";

function rng(seed: number): () => number {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const ceqNum = (z: { re: { num: bigint; den: bigint }; im: { num: bigint; den: bigint } }, re: number, im: number) =>
  assertArrayClose([toNumber(z.re), toNumber(z.im)], [re, im]);

test("complex arithmetic: products, quotients, powers, and powers of i", () => {
  ceqNum(cmul(cx(2, 3), cx(4, -1)), 11, 10);
  ceqNum(cmul(cx(0, 1), cx(0, 1)), -1, 0);
  ceqNum(cdiv(cx(3, 4), cx(1, 2)), 11 / 5, -2 / 5);
  ceqNum(cdiv(cx(1, 0), cx(0, 1)), 0, -1);
  ceqNum(cpow(cx(1, 1), 8), 16, 0);
  ceqNum(cpow(cx(1, -1), 5), -4, 4);
  assert.equal(toNumber(cnormSq(cx(3, -4))), 25);
  for (const [n, re, im] of [[0, 1, 0], [1, 0, 1], [2, -1, 0], [3, 0, -1], [4, 1, 0], [2026, -1, 0]]) ceqNum(ipow(n), re, im);
});

test("formatting a + bi in TeX", () => {
  assert.equal(cTex(cx(3, -2)), "3 - 2i");
  assert.equal(cTex(cx(0, -1)), "-i");
  assert.equal(cTex(cx(0, 1)), "i");
  assert.equal(cTex(cx(-5, 0)), "-5");
  assert.equal(cTex(cx(F(1, 2), F(3, 2))), "1/2 + (3/2)i");
  assert.equal(cTex(cx(F(1, 2), F(-3, 2)), true), "\\frac{1}{2} - \\frac{3}{2}i");
});

test("angles: normalized to (−π, π], exact on the axes and diagonals", () => {
  assert.ok(equals(normAngle(F(7, 4)), F(-1, 4)));
  assert.ok(equals(normAngle(F(-1)), F(1)));
  assert.ok(equals(normAngle(F(5, 2)), F(1, 2)));
  assert.ok(equals(normAngle(F(-3, 2)), F(1, 2)));
  assert.ok(equals(niceArg(cx(-3, 3))!, F(3, 4)));
  assert.ok(equals(niceArg(cx(0, -2))!, F(-1, 2)));
  assert.ok(equals(niceArg(cx(-1, 0))!, F(1)));
  assert.equal(niceArg(cx(1, 2)), null);
  assert.equal(niceArg(cx(0, 0)), null);
  assert.ok(Math.abs(argNumber(cx(1, 2)) - Math.atan2(2, 1) / Math.PI) < 1e-12);
  assert.ok(sameAngle(1.75, -0.25));
  assert.ok(!sameAngle(0.75, -0.25));
  assert.equal(angleTex(F(3, 4)), "3\\pi/4");
  assert.equal(angleTex(F(-1, 2)), "-\\pi/2");
  assert.equal(angleTex(F(1)), "\\pi");
});

test("cos and sin of multiples of π/4 and π/6", () => {
  assert.deepEqual(cosSinTex(F(0)), ["1", "0"]);
  assert.deepEqual(cosSinTex(F(1, 2)), ["0", "1"]);
  assert.deepEqual(cosSinTex(F(1)), ["-1", "0"]);
  assert.deepEqual(cosSinTex(F(3, 4)), ["-\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{2}}{2}"]);
  assert.deepEqual(cosSinTex(F(-1, 3)), ["\\frac{1}{2}", "-\\frac{\\sqrt{3}}{2}"]);
  assert.equal(cosSinTex(F(1, 5)), null);
});

test("square roots: simplified, typed, and read back", () => {
  assert.equal(rootText(sqrtOf(F(8))), "2√2");
  assert.equal(rootText(sqrtOf(F(25))), "5");
  assert.equal(rootText(sqrtOf(F(13))), "√13");
  assert.equal(rootText(sqrtOf(F(1, 2))), "√2/2");
  assert.equal(rootText(rootPow(sqrtOf(F(2)), 3)), "2√2");
  for (const text of ["2√2", "2 sqrt(2)", "sqrt(8)", "√8", "2*sqrt2", "√(8)"]) {
    assert.ok(rootEquals(text, F(8)), text);
  }
  assert.ok(rootEquals("√2/2", F(1, 2)));
  assert.ok(rootEquals("√(1/2)", F(1, 2)));
  // The forms suggested on the page.
  assert.ok(rootEquals("sqrt(13)", F(13)));
  assert.ok(rootEquals("2sqrt(2)", F(8)));
  assert.ok(rootEquals("sqrt(2)/2", F(1, 2)));
  assert.ok(rootEquals("3√5/2", F(45, 4)));
  assert.ok(rootEquals("5", F(25)));
  assert.ok(!rootEquals("-5", F(25)));
  assert.ok(!rootEquals("2.8", F(8)));
  assert.equal(parseRoot("abc"), null);
  assert.equal(parseRoot(""), null);
  assert.equal(parseRoot("√-2"), null);
});

test("problems survive the address, and invalid ones are rejected", () => {
  const r = rng(3);
  for (const kind of KINDS) {
    for (let i = 0; i < 20; i++) {
      const p = randomProblem(kind, r);
      assert.equal(problemError(p), null, `${kind}: ${encodeProblem(p)}`);
      const back = decodeProblem(encodeProblem(p));
      assert.ok(back, encodeProblem(p));
      assert.equal(encodeProblem(back!), encodeProblem(p));
    }
  }
  assert.equal(decodeProblem("ck=div&cz=1,2&cw=0,0"), null);
  assert.equal(decodeProblem("ck=polar&cz=0,0"), null);
  assert.equal(decodeProblem("ck=nope"), null);
  assert.equal(decodeProblem("ck=add&cz=1,2"), null);
  assert.equal(decodeProblem("ck=power&cz=1,1&cn=40"), null);
});

test("random polar problems have angles that are multiples of π/4, and powers stay small", () => {
  const r = rng(11);
  for (let i = 0; i < 50; i++) {
    const p = randomProblem("polar", r) as Extract<Problem, { kind: "conj" | "polar" }>;
    assert.ok(niceArg(p.z));
    const q = randomProblem("power", r) as Extract<Problem, { kind: "power" }>;
    assert.ok(toNumber(cnormSq(cpow(q.z, q.n))) <= 64 ** 2);
  }
});

test("every step's own answer passes its check, at every kind", () => {
  const r = rng(5);
  const examples: Problem[] = [
    { kind: "polar", z: cx(1, 2) },  // An angle that isn't a simple fraction of π
    { kind: "power", z: cx(2, 1), n: 3 },
    { kind: "div", z: cx(1, 0), w: cx(1, 1) },
    { kind: "polarmul", z: { r: F(1), t: F(3, 4) }, w: { r: F(2), t: F(-3, 4) } },
  ];
  const problems = [...KINDS.flatMap(kind => Array.from({ length: 15 }, () => randomProblem(kind, r))), ...examples];
  for (const p of problems) {
    const steps = buildSteps(p);
    assert.ok(steps.some(s => s.final), p.kind);
    // At partial support, the student works at least one answer.
    assert.ok(steps.some(s => s.final && (s.given ?? 1) < 2), p.kind);
    // At partial support, the student works step 1.
    assert.ok((steps[0].given ?? 1) < 2, `${p.kind}: step 1 is worked by the page at partial support`);
    steps.forEach((s, k) => {
      s.prereqs.forEach(q => assert.ok(q < k, `${p.kind}: step ${k + 1}`));
      assert.equal(s.answer.length, s.groups.length, `${p.kind}: step ${k + 1} boxes`);
      assert.ok(s.check(s.answer).ok, `${encodeProblem(p)}: step ${k + 1} (${s.title}) with ${s.answer.join(", ")}`);
    });
  }
});

test("powers of i: small powers are worked one power at a time, large ones by the remainder", () => {
  // i⁰ and i¹ are one step each; iⁿ for n from 2 to 5 is found from i², i³, …, iⁿ.
  assert.equal(buildSteps({ kind: "powi", n: 0 }).length, 1);
  assert.equal(buildSteps({ kind: "powi", n: 1 }).length, 1);
  const five = buildSteps({ kind: "powi", n: 5 });
  assert.deepEqual(five.map(s => s.answer), [["-1", "0"], ["0", "-1"], ["1", "0"], ["0", "1"]]);
  assert.deepEqual(five.map(s => !!s.final), [false, false, false, true]);
  // Larger powers, which a student can choose, use the remainder of n divided by 4.
  assert.match(buildSteps({ kind: "powi", n: 2026 })[0].title, /Divide 2026 by 4/);
  // Random problems are powers from 0 to 5, including 0 and 1.
  const r = rng(9);
  const seen = new Set(Array.from({ length: 200 }, () => (randomProblem("powi", r) as { n: number }).n));
  assert.deepEqual([...seen].sort(), [0, 1, 2, 3, 4, 5]);
});

test("checks catch common mistakes", () => {
  // zw without i² = −1: (2 + 3i)(4 − i) = 8 − 2i + 12i − 3i² → 5 + 10i would be wrong (11 + 10i is right).
  const mul = buildSteps({ kind: "mul", z: cx(2, 3), w: cx(4, -1) });
  const wrong = mul[1].check(["5", "10"]);
  assert.equal(wrong.ok, false);
  assert.match(wrong.message ?? "", /i\^2 = -1/);
  // The middle terms of the expansion can come in either order.
  assert.ok(mul[0].check(["8", "12", "-2", "-3"]).ok);
  // A coterminal angle is right.
  const polar = buildSteps({ kind: "polar", z: cx(1, -1) });
  assert.ok(polar[2].check(["7/4"]).ok);
  assert.ok(!polar[2].check(["1/4"]).ok);
  // |z| as √(a² + b²), in any form, but not |z|².
  const conj = buildSteps({ kind: "conj", z: cx(1, 1) });
  assert.ok(conj[2].check(["sqrt(2)"]).ok);
  assert.ok(!conj[2].check(["2"]).ok);
});

test("the picture: answers for each kind", () => {
  const pic = pictureOf({ kind: "mul", z: cx(1, 1), w: cx(1, -1) });
  assert.deepEqual(pic.given.map(p => p.name), ["z", "w"]);
  assertArrayClose(pic.answers[0].z, [2, 0]);
  const polar = pictureOf({ kind: "polarmul", z: { r: F(2), t: F(1, 2) }, w: { r: F(1), t: F(1, 2) } });
  assertArrayClose(polar.answers[0].z, [-2, 0], 1e-12);
  assertArrayClose(polar.answers[1].z, [2, 0], 1e-12);
});
