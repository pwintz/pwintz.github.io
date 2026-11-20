import { test } from "node:test";
import assert from "node:assert/strict";
import { clockText, endTime, remainingText, todayAt } from "../src/exam_timer/timing";

test("remainingText rounds up to whole minutes and never shows seconds", () => {
  assert.equal(remainingText(0), "Time is up");
  assert.equal(remainingText(-5000), "Time is up");
  assert.equal(remainingText(30_000), "Less than 1\u00a0minute");
  assert.equal(remainingText(60_000), "Less than 1\u00a0minute");
  assert.equal(remainingText(60_001), "2\u00a0min");
  assert.equal(remainingText(4 * 60_000 + 1), "5\u00a0min");
  assert.equal(remainingText(60 * 60_000), "1\u00a0hr");
  assert.equal(remainingText(84 * 60_000 + 10_000), "1\u00a0hr 25\u00a0min");
});

test("endTime adds every extension", () => {
  const start = new Date(2026, 10, 20, 10, 0);
  assert.equal(endTime(start, [{ minutes: 5, reason: "" }, { minutes: 10, reason: "fire alarm" }]).getMinutes(), 15);
  assert.equal(endTime(start, []).getTime(), start.getTime());
});

test("todayAt reads a time on the given day", () => {
  const now = new Date(2026, 10, 20, 9, 0);
  assert.deepEqual(todayAt("10:25", now), new Date(2026, 10, 20, 10, 25));
  assert.equal(todayAt("25:00", now), null);
  assert.equal(todayAt("", now), null);
});

test("clockText shows hours and minutes only", () => {
  assert.equal(clockText(new Date(2026, 0, 1, 0, 5), true), "12:05 am");
  assert.equal(clockText(new Date(2026, 0, 1, 13, 7, 59), true), "1:07 pm");
  assert.equal(clockText(new Date(2026, 0, 1, 13, 7), false), "13:07");
});
