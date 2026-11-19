// ╭───────────────────────────────────────────────────────────────╮
// │      Syllabus designer: holidays in the term                  │
// ╰───────────────────────────────────────────────────────────────╯
// US holidays that commonly close campuses, computed for any year, so the page can list the
// holidays that fall within the term and say which weekdays they land on. Campuses differ (for
// example, in observing Indigenous Peoples' Day or Cesar Chavez Day), so the notes say so.

export interface Holiday { name: string; date: Date; note?: string }

// The nth weekday (0 = Sunday) of a month (0 = January); n = -1 for the last one.
function nthWeekday(year: number, month: number, weekday: number, n: number): Date {
  if (n > 0) {
    const first = new Date(year, month, 1);
    return new Date(year, month, 1 + ((weekday - first.getDay() + 7) % 7) + 7 * (n - 1));
  }
  const last = new Date(year, month + 1, 0);
  return new Date(year, month, last.getDate() - ((last.getDay() - weekday + 7) % 7));
}

// A fixed-date holiday is observed on Friday when it falls on Saturday, and on Monday when it falls
// on Sunday.
function observed(year: number, month: number, day: number): Date {
  const date = new Date(year, month, day);
  if (date.getDay() === 6) return new Date(year, month, day - 1);
  if (date.getDay() === 0) return new Date(year, month, day + 1);
  return date;
}

function holidaysIn(year: number): Holiday[] {
  const thanksgiving = nthWeekday(year, 10, 4, 4);
  return [
    { name: "New Year's Day", date: observed(year, 0, 1) },
    { name: "Martin Luther King Jr. Day", date: nthWeekday(year, 0, 1, 3) },
    { name: "Presidents' Day", date: nthWeekday(year, 1, 1, 3) },
    { name: "Cesar Chavez Day", date: observed(year, 2, 31), note: "in California" },
    { name: "Memorial Day", date: nthWeekday(year, 4, 1, -1) },
    { name: "Juneteenth", date: observed(year, 5, 19) },
    { name: "Independence Day", date: observed(year, 6, 4) },
    { name: "Labor Day", date: nthWeekday(year, 8, 1, 1) },
    { name: "Indigenous Peoples' Day", date: nthWeekday(year, 9, 1, 2), note: "on some campuses" },
    { name: "Veterans Day", date: observed(year, 10, 11) },
    { name: "Thanksgiving", date: thanksgiving },
    { name: "Day after Thanksgiving", date: new Date(year, 10, thanksgiving.getDate() + 1) },
    { name: "Christmas", date: observed(year, 11, 25) },
  ];
}

// The holidays from start to end (inclusive).
export function holidaysBetween(start: Date, end: Date): Holiday[] {
  const out: Holiday[] = [];
  for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
    for (const h of holidaysIn(year)) if (h.date >= start && h.date <= end) out.push(h);
  }
  return out.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// Approximate instruction dates for a term and year, when the first and last days aren't entered.
// Spring covers both semesters (January–May) and quarters (March–June).
export function approximateTerm(term: "fall" | "winter" | "spring" | "summer", year: number): [Date, Date] {
  switch (term) {
    case "fall": return [new Date(year, 7, 20), new Date(year, 11, 15)];
    case "winter": return [new Date(year, 0, 3), new Date(year, 2, 22)];
    case "spring": return [new Date(year, 0, 10), new Date(year, 5, 12)];
    case "summer": return [new Date(year, 5, 15), new Date(year, 7, 31)];
  }
}
