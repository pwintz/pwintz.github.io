import { test } from "node:test";
import assert from "node:assert/strict";
import { dateKey, formatDate, formatDateSpec, formatDateValue, isDateSpec, setDateStyle } from "../src/syllabus/dates";
import { approximateTerm, holidaysBetween } from "../src/syllabus/holidays";

const ymd = (d: Date) => [d.getFullYear(), d.getMonth() + 1, d.getDate()];

test("formatDateValue in each fixed style", () => {
  const d = new Date(2026, 9, 21);  // Wednesday, October 21, 2026
  assert.equal(formatDateValue(d, false, "long"), "Wednesday, October 21");
  assert.equal(formatDateValue(d, true, "long"), "Wednesday, October 21, 2026");
  assert.equal(formatDateValue(d, false, "medium"), "Wed, Oct 21");
  assert.equal(formatDateValue(d, false, "noWeekday"), "October 21");
  assert.equal(formatDateValue(d, false, "dayFirst"), "Wednesday 21 October");
  assert.equal(formatDateValue(d, false, "numeric"), "10/21");
  assert.equal(formatDateValue(d, true, "numeric"), "10/21/2026");
  assert.equal(formatDateValue(new Date(2026, 0, 5), false, "iso"), "2026-01-05");
});

test("formatDate and formatDateSpec use the chosen style", () => {
  setDateStyle("long");
  assert.equal(formatDate("2026-10-21"), "Wednesday, October 21");
  assert.equal(formatDate(" 2026-10-21 ", true), "Wednesday, October 21, 2026");
  assert.equal(formatDate("Oct 21"), null);
  assert.equal(formatDateSpec("2026-11-26..2026-11-27"), "Thursday, November 26 – Friday, November 27");
  // With a range, only the end gets the year.
  assert.equal(formatDateSpec("2026-11-26..2026-11-27", true), "Thursday, November 26 – Friday, November 27, 2026");
  assert.equal(formatDateSpec("2026-11-26..junk"), "Thursday, November 26");
  assert.equal(formatDateSpec("junk"), null);
  setDateStyle("iso");
  assert.equal(formatDate("2026-10-21"), "2026-10-21");
  setDateStyle("not a style");  // Falls back to "long"
  assert.equal(formatDate("2026-10-21"), "Wednesday, October 21");
  setDateStyle(undefined);
});

test("dateKey and isDateSpec", () => {
  assert.equal(dateKey("2026-11-26..2026-11-27"), "2026-11-26");
  assert.equal(dateKey(" 2026-01-02 "), "2026-01-02");
  assert.equal(dateKey("Week 3"), null);
  assert.ok(isDateSpec("2026-01-02"));
  assert.ok(!isDateSpec("2026-1-2"));
});

test("holidays for 2026 fall on the right dates", () => {
  const list = holidaysBetween(new Date(2026, 0, 1), new Date(2026, 11, 31));
  const byName = Object.fromEntries(list.map(h => [h.name, ymd(h.date)]));
  assert.deepEqual(byName["New Year's Day"], [2026, 1, 1]);
  assert.deepEqual(byName["Martin Luther King Jr. Day"], [2026, 1, 19]);
  assert.deepEqual(byName["Presidents' Day"], [2026, 2, 16]);
  assert.deepEqual(byName["Memorial Day"], [2026, 5, 25]);
  assert.deepEqual(byName["Independence Day"], [2026, 7, 3]);  // July 4 is a Saturday
  assert.deepEqual(byName["Labor Day"], [2026, 9, 7]);
  assert.deepEqual(byName["Indigenous Peoples' Day"], [2026, 10, 12]);
  assert.deepEqual(byName["Thanksgiving"], [2026, 11, 26]);
  assert.deepEqual(byName["Day after Thanksgiving"], [2026, 11, 27]);
  assert.deepEqual(byName["Christmas"], [2026, 12, 25]);
  assert.equal(list.length, 13);
  for (let i = 1; i < list.length; i++) assert.ok(list[i - 1].date <= list[i].date, "sorted");
});

test("a holiday on Sunday is observed on Monday", () => {
  // Juneteenth 2022 was a Sunday.
  const [h] = holidaysBetween(new Date(2022, 5, 18), new Date(2022, 5, 21)).filter(h => h.name === "Juneteenth");
  assert.deepEqual(ymd(h.date), [2022, 6, 20]);
});

test("holidaysBetween is inclusive and spans years", () => {
  const list = holidaysBetween(new Date(2026, 11, 25), new Date(2027, 0, 1));
  assert.deepEqual(list.map(h => h.name), ["Christmas", "New Year's Day"]);
  assert.deepEqual(holidaysBetween(new Date(2026, 2, 1), new Date(2026, 2, 30)), []);
});

test("approximateTerm returns a start before the end", () => {
  for (const term of ["fall", "winter", "spring", "summer"] as const) {
    const [start, end] = approximateTerm(term, 2027);
    assert.equal(start.getFullYear(), 2027);
    assert.ok(start < end, term);
  }
});
