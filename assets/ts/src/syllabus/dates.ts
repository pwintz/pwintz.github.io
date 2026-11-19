// ╭───────────────────────────────────────────────────────────────╮
// │      Syllabus designer: dates                                 │
// ╰───────────────────────────────────────────────────────────────╯
// Dates are entered with date pickers and stored as ISO dates ("2026-10-21"); a range is stored as
// "2026-11-26..2026-11-27". Every date in the documents is written in one style, chosen in the View
// menu (such as "Wednesday, October 21"). Text that isn't an ISO date (from answers saved before
// the date pickers) is shown as written.

export type DateStyle = "auto" | "long" | "medium" | "noWeekday" | "dayFirst" | "numeric" | "iso";

export const DATE_STYLES: [DateStyle, string][] = [
  ["auto", "Automatic (for your region)"],
  ["long", "Weekday, month, and day"],
  ["medium", "Abbreviated"],
  ["noWeekday", "Month and day"],
  ["dayFirst", "Day before month"],
  ["numeric", "Numbers"],
  ["iso", "Year-month-day (ISO 8601)"],
];

let style: DateStyle = "long";
export function setDateStyle(s: string | undefined): void {
  style = DATE_STYLES.some(([id]) => id === s) ? s as DateStyle : "long";
}

// English month and weekday names, in the order used in the reader's region (from the browser).
function regionLocale(): string {
  try {
    const region = new Intl.Locale(navigator.language).maximize().region;
    return region ? `en-${region}` : "en-US";
  } catch {
    return "en-US";
  }
}

// A date in the chosen style, optionally with the year.
export function formatDateValue(date: Date, year = false, which: DateStyle = style): string {
  const y = year ? { year: "numeric" as const } : {};
  switch (which) {
    case "auto": return date.toLocaleDateString(regionLocale(), { weekday: "long", month: "long", day: "numeric", ...y });
    case "long": return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", ...y });
    case "medium": return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", ...y });
    case "noWeekday": return date.toLocaleDateString("en-US", { month: "long", day: "numeric", ...y });
    case "dayFirst": return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", ...y });
    case "numeric": return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric", ...(year ? { year: "numeric" as const } : {}) });
    case "iso": {
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }
  }
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;

function parse(iso: string): Date | null {
  if (!ISO.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

// An ISO date in the chosen style (such as "Wednesday, October 21"), optionally with the year.
export function formatDate(iso: string, year = false): string | null {
  const date = parse(iso.trim());
  return date ? formatDateValue(date, year) : null;
}

// A date or a range of dates ("start..end"), formatted; null if it isn't one.
export function formatDateSpec(spec: string, year = false): string | null {
  const [start, end] = spec.trim().split("..");
  const a = formatDate(start ?? "", year && !end);
  if (!a) return null;
  if (!end) return a;
  const b = formatDate(end, year);
  return b ? `${a} – ${b}` : a;
}

// The start of a date or range, for sorting; null if it isn't one.
export function dateKey(spec: string): string | null {
  const start = spec.trim().split("..")[0];
  return parse(start) ? start : null;
}

export function isDateSpec(spec: string): boolean {
  return dateKey(spec) !== null;
}
