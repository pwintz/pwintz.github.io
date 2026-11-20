import { test } from "node:test";
import assert from "node:assert/strict";
import { assertArrayClose, assertClose } from "./helpers";
import { detrend, linearFit, mean, median, movingAverage, rms, strongestOscillation } from "../src/note_quality/stats";

test("mean, median, and rms", () => {
  assert.equal(mean([1, 2, 3, 4]), 2.5);
  assert.equal(mean(Float64Array.from([2, 4])), 3);
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([4, 1, 3, 2]), 2.5);
  const input = [3, 1, 2];
  median(input);
  assert.deepEqual(input, [3, 1, 2], "median leaves its input unsorted");
  assertClose(rms([3, -4]), Math.sqrt(12.5));
});

test("linearFit and detrend", () => {
  const xs = [0, 1, 2, 3], ys = xs.map(x => 2 - 0.5 * x);
  const { slope, intercept } = linearFit(xs, ys);
  assertClose(slope, -0.5);
  assertClose(intercept, 2);
  assertArrayClose(detrend(xs, ys), [0, 0, 0, 0]);
  assert.deepEqual(linearFit([1, 1], [2, 4]), { slope: 0, intercept: 3 });
});

test("movingAverage shrinks the window at the ends", () => {
  assertArrayClose(movingAverage([1, 2, 3, 4, 5], 1), [1.5, 2, 3, 4, 4.5]);
  assert.deepEqual(movingAverage([1, 2, 3], 0), [1, 2, 3]);
});

test("strongestOscillation finds a sinusoid in unevenly spaced samples", () => {
  const ts: number[] = [];
  for (let t = 0; t < 2; t += 0.01 + 0.004 * Math.sin(37 * t)) ts.push(t);
  const ys = ts.map(t => 3 * Math.sin(2 * Math.PI * 5.5 * t + 0.4));
  const { freq, amp, explained } = strongestOscillation(ts, ys, 4, 8);
  assertClose(freq, 5.5, 0.051);
  assertClose(amp, 3, 0.3);
  assert.ok(explained > 0.8, `explained ${explained}`);
});

test("strongestOscillation of zeros explains nothing", () => {
  assert.deepEqual(strongestOscillation([0, 0.1, 0.2], [0, 0, 0], 1, 2), { freq: 0, amp: 0, explained: 0 });
});
