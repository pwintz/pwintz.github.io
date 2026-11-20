import { test } from "node:test";
import assert from "node:assert/strict";
import {
  add, div, equals, formatFraction, fraction, isOne, isZero, mul, neg, parseEntry, reduce, sub,
} from "../src/matrix/fraction";

test("parseEntry reads integers, decimals, and fractions exactly", () => {
  assert.deepEqual(parseEntry("3"), { num: 3n, den: 1n });
  assert.deepEqual(parseEntry("-2.5"), { num: -25n, den: 10n });
  assert.deepEqual(parseEntry(".5"), { num: 5n, den: 10n });
  assert.deepEqual(parseEntry("4."), { num: 4n, den: 1n });
  assert.deepEqual(parseEntry("1/3"), { num: 1n, den: 3n });
  assert.ok(equals(parseEntry("0.5/0.25")!, fraction(2)));
});

test("parseEntry handles signs, whitespace, and typographic minus signs", () => {
  assert.ok(equals(parseEntry(" − 7 ")!, fraction(-7)));
  assert.ok(equals(parseEntry("–1/2")!, fraction(-1, 2)));
  assert.ok(equals(parseEntry("1/-2")!, fraction(-1, 2)));
  assert.ok(equals(parseEntry("-1/-2")!, fraction(1, 2)));
  assert.ok(equals(parseEntry("+3")!, fraction(3)));
});

test("parseEntry treats a blank entry as zero", () => {
  assert.deepEqual(parseEntry(""), { num: 0n, den: 1n });
  assert.deepEqual(parseEntry("   "), { num: 0n, den: 1n });
});

test("parseEntry rejects non-numbers and division by zero", () => {
  for (const bad of ["abc", "1/0", "1/0.0", "1//2", "1.2.3", "e", "--1", "1/"]) {
    assert.equal(parseEntry(bad), null, bad);
  }
});

test("reduce gives lowest terms with a positive denominator", () => {
  assert.deepEqual(reduce({ num: 6n, den: -4n }), { num: -3n, den: 2n });
  assert.deepEqual(reduce({ num: 0n, den: -5n }), { num: 0n, den: 1n });
  assert.deepEqual(fraction(10, 4), { num: 5n, den: 2n });
});

test("arithmetic is exact", () => {
  const third = fraction(1, 3);
  assert.deepEqual(add(add(third, third), third), fraction(1));
  assert.deepEqual(sub(fraction(1, 2), fraction(1, 3)), fraction(1, 6));
  assert.deepEqual(mul(fraction(2, 3), fraction(9, 4)), fraction(3, 2));
  assert.deepEqual(div(fraction(2, 3), fraction(4, 9)), fraction(3, 2));
  assert.deepEqual(div(fraction(1), fraction(-2)), fraction(-1, 2));
  assert.deepEqual(neg(fraction(3, 4)), { num: -3n, den: 4n });
  assert.deepEqual(add(parseEntry("0.1")!, parseEntry("0.2")!), parseEntry("0.3"));
});

test("equals compares unreduced fractions", () => {
  assert.ok(equals({ num: 2n, den: 4n }, { num: 1n, den: 2n }));
  assert.ok(!equals(fraction(1, 2), fraction(1, 3)));
});

test("isZero and isOne", () => {
  assert.ok(isZero({ num: 0n, den: 7n }));
  assert.ok(!isZero(fraction(1, 7)));
  assert.ok(isOne({ num: 3n, den: 3n }));
  assert.ok(!isOne(fraction(-1)));
});

test("formatFraction uses lowest terms and a typographic minus sign", () => {
  assert.equal(formatFraction({ num: 6n, den: 2n }), "3");
  assert.equal(formatFraction({ num: -2n, den: 4n }), "−1/2");
  assert.equal(formatFraction({ num: 0n, den: 5n }), "0");
});
