import { test } from "node:test";
import assert from "node:assert/strict";
import { stablePairing } from "../src/stable_pairing/roommates";

const always = () => true;

// A deterministic pseudo-random number generator, so the tests are repeatable.
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 2 ** 32;
}

const acceptable = (a: number[][], canPair: (i: number, j: number) => boolean, i: number, j: number) =>
  i !== j && canPair(i, j) && a[i][j] > 0 && a[j][i] > 0;

// Whether i would rather be with j than with their partner p (−1 for single).
const prefers = (a: number[][], i: number, j: number, p: number) => p === -1 || a[i][j] > a[i][p];

function blockingPair(a: number[][], canPair: (i: number, j: number) => boolean, partner: number[]): [number, number] | null {
  for (let i = 0; i < a.length; i++) {
    for (let j = i + 1; j < a.length; j++) {
      if (partner[i] === j || !acceptable(a, canPair, i, j)) continue;
      if (prefers(a, i, j, partner[i]) && prefers(a, j, i, partner[j])) return [i, j];
    }
  }
  return null;
}

function isValidPairing(a: number[][], canPair: (i: number, j: number) => boolean, partner: number[]): boolean {
  return partner.every((j, i) => j === -1 || (partner[j] === i && acceptable(a, canPair, i, j)));
}

// Every pairing (including ones that leave people single) of n people.
function* allPairings(n: number, canPair: (i: number, j: number) => boolean, a: number[][]): Generator<number[]> {
  const partner = Array(n).fill(-2);
  function* go(): Generator<number[]> {
    const i = partner.indexOf(-2);
    if (i < 0) { yield [...partner]; return; }
    partner[i] = -1;
    yield* go();
    for (let j = i + 1; j < n; j++) {
      if (partner[j] !== -2 || !acceptable(a, canPair, i, j)) continue;
      partner[i] = j; partner[j] = i;
      yield* go();
      partner[j] = -2;
    }
    partner[i] = -2;
  }
  yield* go();
}

const hasStablePairing = (a: number[][], canPair: (i: number, j: number) => boolean) =>
  [...allPairings(a.length, canPair, a)].some(p => blockingPair(a, canPair, p) === null);

test("two people who like each other are paired", () => {
  assert.deepEqual(stablePairing([[0, 1], [1, 0]], always), [1, 0]);
});

test("people who don't find each other acceptable stay single", () => {
  assert.deepEqual(stablePairing([[0, 1], [0, 0]], always), [-1, -1]);
  assert.deepEqual(stablePairing([[0, 1], [1, 0]], () => false), [-1, -1]);
  assert.deepEqual(stablePairing([], always), []);
});

test("the classic instance with no stable pairing", () => {
  // 0 prefers 1, 1 prefers 2, 2 prefers 0, and everyone ranks 3 last.
  const a = [
    [0, 3, 2, 1],
    [2, 0, 3, 1],
    [3, 2, 0, 1],
    [3, 2, 1, 0],
  ];
  assert.equal(stablePairing(a, always), null);
  assert.equal(hasStablePairing(a, always), false);
});

test("a known stable pairing", () => {
  // 0 and 1 are each other's first choice, and so are 2 and 3.
  const a = [
    [0, 9, 1, 2],
    [9, 0, 2, 1],
    [1, 2, 0, 9],
    [2, 1, 9, 0],
  ];
  assert.deepEqual(stablePairing(a, always), [1, 0, 3, 2]);
});

test("matches brute force on random instances", () => {
  const rand = lcg(12345);
  let found = 0, none = 0;
  for (let trial = 0; trial < 400; trial++) {
    const n = 2 + Math.floor(rand() * 5);  // 2 to 6 people
    // Distinct attractions per row (no ties); some pairs are unacceptable.
    const a = Array.from({ length: n }, (_, i) => {
      const values = [...Array(n).keys()].map(k => k + 1).sort(() => rand() - 0.5);
      return values.map((v, j) => (i === j ? 0 : rand() < 0.15 ? -1 : v));
    });
    const forbidden = new Set<string>();
    if (rand() < 0.3) forbidden.add(`${0},${n - 1}`);
    const canPair = (i: number, j: number) => !forbidden.has(`${Math.min(i, j)},${Math.max(i, j)}`);
    const result = stablePairing(a, canPair);
    const exists = hasStablePairing(a, canPair);
    if (result) {
      found++;
      assert.ok(isValidPairing(a, canPair, result), `invalid pairing ${result} for ${JSON.stringify(a)}`);
      assert.equal(blockingPair(a, canPair, result), null, `unstable pairing ${result} for ${JSON.stringify(a)}`);
    } else {
      none++;
      assert.equal(exists, false, `missed a stable pairing for ${JSON.stringify(a)}`);
    }
  }
  assert.ok(found > 0 && none > 0, `found ${found}, none ${none}`);
});
