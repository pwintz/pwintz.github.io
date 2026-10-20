// ╭───────────────────────────────────────────────────────────────╮
// │                      REF/RREF study tool                      │
// ╰───────────────────────────────────────────────────────────────╯
// In explore mode, students type the entries of an (augmented) matrix, and the page reports
// whether it is in reduced row echelon form (RREF), row echelon form (REF), or neither, listing
// each violated condition with the rows and columns that violate it and highlighting those
// entries. (In the code, explore mode is called "check".)
//
// The conditions match the wording and numbering in the lecture notes this tool accompanies.
// A matrix is in REF if
//   1. Every zero row is at the bottom (below any nonzero rows).
//   2. The leading entry of each nonzero row is to the right of the leading entry of the row above it.
// It is in RREF if, in addition,
//   3. Every leading entry is 1.
//   4. Every entry above a leading entry is 0.
// A row's leading entry is its leftmost nonzero entry. (Conditions 1 and 2 imply that every entry
// below a leading entry is 0, so that isn't a separate condition.)
//
// Condition 2 compares each leading entry with the leading entry of the row directly above. If
// that row is a zero row, it has no leading entry, so the condition is ambiguous; such rows are
// not checked (condition 1 is violated then anyway), and the quiz accepts either answer.
//
// For an augmented matrix, the constants column is treated like any other column (so a row
// [0 0 | 5] has its leading entry there), which is how textbooks apply the definitions.
//
// Entries are parsed as exact fractions, so "1/3", "0.5", and "-2" all work, and "0.10" is
// exactly 1/10 rather than a floating-point approximation.
//
// The matrix is saved in the page's URL as ?m=1,2,3;0,1,4 (rows separated by ";") and
// &aug=0 when the matrix isn't augmented, so that a matrix can be shared as a link.
//
// For a matrix in REF, the page also shows the rank and nullity of A and [A | b], and the number
// of solutions of Ax = b with the reason (or of Ax = 0 when the matrix isn't augmented).
//
// In quiz mode, the page shows a random matrix (read-only) and asks the student whether each
// condition holds (yes or no) and which form the matrix is in. The leading entries and explanations
// stay hidden until the student checks their answers. The URL has &quiz=1 in quiz mode.
// Optionally, students can also mark the leading entries (by clicking entries) and the zero rows
// (by clicking row labels), and these marks are graded along with the answers. If the matrix is
// in REF, a second part then asks for the rank, nullity, and number of solutions.

// ⋘──────── Types and constants ────────⋙

export interface Fraction { num: bigint; den: bigint }  // den > 0; not necessarily reduced
export type Cell = [row: number, col: number];          // Zero-based
export interface Violation { message: string; cells: Cell[] }
export type Form = "RREF" | "REF" | "neither";

export interface Analysis {
  leading    : (number | null)[];  // Column of each row's leading entry, or null for a zero row
  violations : Violation[][];      // Violations of each condition, indexed like CONDITIONS
  ambiguous  : number[];           // Nonzero rows below a zero row, where condition 2 is ambiguous
  form       : Form;
}

export const CONDITIONS = [
  "Every zero row is at the bottom (below any nonzero rows).",
  "The leading entry of each nonzero row is to the right of the leading entry of the row above it.",
  "Every leading entry is 1.",
  "Every entry above a leading entry is 0.",
];
const REF_CONDITIONS = 2;  // The first two conditions define REF; RREF requires all four

// A color for each condition, used to tint the entries that break it and in the list of
// conditions. These avoid blue (leading entries), green (correct), and red (wrong).
const CONDITION_COLORS = ["#e8710a", "#9334e6", "#0d9488", "#d01884"];
const tint = (i: number) => `${CONDITION_COLORS[i]}40`;  // 25% opacity

// A small square in a condition's color, as a key for the tinted entries.
function conditionSwatch(i: number): HTMLSpanElement {
  const swatch = element("span", "mx-condition-swatch");
  swatch.style.setProperty("--mx-color", CONDITION_COLORS[i]);
  swatch.style.setProperty("--mx-tint", tint(i));
  swatch.setAttribute("aria-hidden", "true");
  return swatch;
}

// The background for an entry that breaks the given conditions: that condition's tint, or
// diagonal stripes of each one's tint.
function brokenBackground(conditions: number[]): string {
  if (conditions.length === 1) return tint(conditions[0]);
  const stripe = 6;  // px
  const stops = conditions.map((i, k) => `${tint(i)} ${k * stripe}px ${(k + 1) * stripe}px`);
  return `repeating-linear-gradient(135deg, ${stops.join(", ")})`;
}

type Mode = "check" | "quiz";
// The quiz's choices for the matrix's form.
const FORM_CHOICES: [Form, string][] = [["neither", "Neither"], ["REF", "REF, but not RREF"], ["RREF", "RREF"]];

const MIN_SIZE = 1;
const MAX_SIZE = 8;
// Sizes of new quiz matrices: rows and columns (including the constants column).
const QUIZ_ROWS: [number, number] = [2, 4];
const QUIZ_COLS: [number, number] = [3, 5];
// Shown when the page opens without a matrix in its URL: in REF, but not RREF.
const DEFAULT_MATRIX = [
  ["1", "2", "-1", "3"],
  ["0", "1",  "4", "2"],
  ["0", "0",  "2", "6"],
];

// A number with an optional decimal point, like "3", "2.5", "4.", or ".5".
const NUMBER   = String.raw`(\d+(?:\.\d*)?|\.\d+)`;
const ENTRY_RE = new RegExp(`^([+-]?)${NUMBER}(?:/([+-]?)${NUMBER})?$`);

// ⋘──────── Parsing and formatting entries ────────⋙

function decimal(text: string): Fraction {
  const [whole, frac = ""] = text.split(".");
  return { num: BigInt(whole + frac), den: 10n ** BigInt(frac.length) };
}

// Parses an entry like "3", "-2.5", or "1/3". A blank entry is zero. Returns null if the text
// isn't a number (or divides by zero).
export function parseEntry(text: string): Fraction | null {
  const s = text.replace(/\s+/g, "").replace(/[−–]/g, "-");  // Accept typographic minus signs
  if (s === "") return { num: 0n, den: 1n };
  const match = ENTRY_RE.exec(s);
  if (!match) return null;
  const [, sign, top, bottomSign, bottom] = match;
  let { num, den } = decimal(top);
  if (sign === "-") num = -num;
  if (bottom !== undefined) {
    const divisor = decimal(bottom);
    if (divisor.num === 0n) return null;
    // (n1/d1) / (n2/d2) = (n1 d2) / (d1 n2)
    num *= divisor.den;
    den *= divisor.num;
    if (bottomSign === "-") num = -num;
  }
  return { num, den };
}

const isZero = (x: Fraction) => x.num === 0n;
const isOne  = (x: Fraction) => x.num === x.den;

function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

// Formats a fraction in lowest terms, like "−3" or "1/2".
export function formatFraction(x: Fraction): string {
  const g = gcd(x.num, x.den) || 1n;
  const num = x.num / g, den = x.den / g;
  const text = den === 1n ? `${num}` : `${num}/${den}`;
  return text.replace("-", "−");
}

// ⋘──────── Checking the conditions ────────⋙

// "rows 2, 3, and 5"
function joinAnd(items: (number | string)[]): string {
  if (items.length <= 2) return items.join(" and ");
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

// Describes the nonzero entries in the given (zero-based) rows of one column.
function nonzeroEntriesIn(rows: number[]): string {
  return rows.length === 1
    ? `a nonzero entry in row ${rows[0] + 1}`
    : `nonzero entries in rows ${joinAnd(rows.map(r => r + 1))}`;
}

// Explains why condition 2 isn't checked for rows below a zero row.
export function ambiguityNote(a: Analysis): string {
  const rows = a.ambiguous.map(r => r + 1);
  const which = rows.length === 1 ? `Row ${rows[0]} has` : `Rows ${joinAnd(rows)} have`;
  return `${which} a zero row directly above, which has no leading entry to compare with, so `
    + `condition 2 is ambiguous there and isn't checked. (Condition 1 is violated instead.)`;
}

// When a student picks the wrong form, the conditions (by index) whose answers would have pointed
// to the right one, each with a note on how. Conditions 1 and 2 decide REF; 3 and 4 decide RREF.
export function formHints(a: Analysis, picked: Form): Map<number, string> {
  const hints = new Map<number, string>();
  const holds = (i: number) => a.violations[i].length === 0;
  if (picked === "neither") {
    // The matrix is in REF (at least), so conditions 1 and 2 both hold.
    for (const i of [0, 1]) hints.set(i, "Conditions 1 and 2 both hold, so the matrix is in REF.");
    if (a.form === "RREF") {
      for (const i of [2, 3]) hints.set(i, "Conditions 3 and 4 also hold, so the matrix is in RREF.");
    }
  } else {
    for (const i of [0, 1]) {
      if (!holds(i)) hints.set(i, "Since this condition fails, the matrix isn't in REF.");
    }
    if (picked === "RREF") {
      for (const i of [2, 3]) {
        if (!holds(i)) hints.set(i, "Since this condition fails, the matrix isn't in RREF.");
      }
    } else if (a.form === "RREF") {
      for (const i of [2, 3]) hints.set(i, "Conditions 3 and 4 both hold, so the matrix is in RREF.");
    }
  }
  return hints;
}

export function analyze(m: Fraction[][]): Analysis {
  const rowCount = m.length;
  const leading = m.map(row => {
    const col = row.findIndex(x => !isZero(x));
    return col < 0 ? null : col;
  });
  const violations: Violation[][] = CONDITIONS.map(() => []);
  const rowCells = (r: number): Cell[] => m[r].map((_, c) => [r, c]);

  // 1. All rows of zeros are at the bottom.
  for (let r = 0; r < rowCount; r++) {
    if (leading[r] !== null) continue;
    const below = leading.findIndex((col, k) => k > r && col !== null);
    if (below >= 0) {
      violations[0].push({
        message: `Row ${r + 1} is all zeros, but row ${below + 1} below it is not.`,
        cells: [...rowCells(r), [below, leading[below]!]],
      });
    }
  }

  // 2. Each leading entry is to the right of the leading entry of the row directly above it. If
  // that row is a zero row, the condition is ambiguous, so the row isn't checked.
  const ambiguous: number[] = [];
  for (let r = 1; r < rowCount; r++) {
    const col = leading[r];
    if (col === null) continue;
    const previous = r - 1;
    if (leading[previous] === null) {
      ambiguous.push(r);
    } else {
      const previousCol = leading[previous]!;
      if (col === previousCol) {
        violations[1].push({
          message: `The leading entries of rows ${previous + 1} and ${r + 1} are both in column ${col + 1}.`,
          cells: [[previous, previousCol], [r, col]],
        });
      } else if (col < previousCol) {
        violations[1].push({
          message: `The leading entry of row ${r + 1} is in column ${col + 1}, which is left of `
            + `the leading entry of row ${previous + 1} in column ${previousCol + 1}.`,
          cells: [[previous, previousCol], [r, col]],
        });
      }
    }
  }

  for (let r = 0; r < rowCount; r++) {
    const col = leading[r];
    if (col === null) continue;
    const pivot: Cell = [r, col];
    const nonzeroRows = (keep: (k: number) => boolean) =>
      m.map((_, k) => k).filter(k => keep(k) && !isZero(m[k][col]));

    // 3. Every leading entry is 1.
    if (!isOne(m[r][col])) {
      violations[2].push({
        message: `The leading entry of row ${r + 1} is ${formatFraction(m[r][col])}, not 1.`,
        cells: [pivot],
      });
    }

    // 4. Every entry above a leading entry is 0.
    const above = nonzeroRows(k => k < r);
    if (above.length > 0) {
      violations[3].push({
        message: `Column ${col + 1} has ${nonzeroEntriesIn(above)}, above the leading entry of row ${r + 1}.`,
        cells: [pivot, ...above.map((k): Cell => [k, col])],
      });
    }
  }

  const holds = (i: number) => violations[i].length === 0;
  const isRef = CONDITIONS.slice(0, REF_CONDITIONS).every((_, i) => holds(i));
  const form: Form = !isRef ? "neither" : CONDITIONS.every((_, i) => holds(i)) ? "RREF" : "REF";
  return { leading, violations, ambiguous, form };
}

// ⋘──────── Rank, nullity, and solutions ────────⋙

export type SolutionCount = "none" | "one" | "infinite";

export interface SystemInfo {
  rankA      : number;    // Rank of the coefficient matrix A (all but the last column)
  rankAb     : number;    // Rank of the augmented matrix [A | b]
  pivotCols  : number[];  // Columns of A with a leading entry (basic variables)
  freeCols   : number[];  // Columns of A without one (free variables)
  bRow       : number | null;  // The row whose leading entry is in the b column, if any
  solutions  : SolutionCount;
}

// Rank and solutions of Ax = b for an augmented matrix [A | b] with the given leading-entry
// columns. Only valid in REF, where the rank is the number of leading entries; in REF, at most one
// row can have its leading entry in the b column.
export function systemInfo(leading: (number | null)[], cols: number): SystemInfo {
  const variables = cols - 1;
  const pivotCols = leading.filter((col): col is number => col !== null && col < variables);
  const freeCols  = [...Array(variables).keys()].filter(col => !pivotCols.includes(col));
  const bRow      = leading.indexOf(variables);
  const rankA     = pivotCols.length;
  const rankAb    = leading.filter(col => col !== null).length;
  const solutions = bRow >= 0 ? "none" : freeCols.length === 0 ? "one" : "infinite";
  return { rankA, rankAb, pivotCols, freeCols, bRow: bRow >= 0 ? bRow : null, solutions };
}

// ⋘──────── Random matrices ────────⋙

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const randomNonzero = () => randomInt(1, 5) * (Math.random() < 0.5 ? -1 : 1);
const pick = <T>(items: T[]) => items[randomInt(0, items.length - 1)];

// Picks from weighted choices, like [["a", 2], ["b", 1]].
function weighted<T>(choices: [T, number][]): T {
  let x = Math.random() * choices.reduce((sum, [, w]) => sum + w, 0);
  for (const [choice, w] of choices) if ((x -= w) < 0) return choice;
  return choices[choices.length - 1][0];
}

// Shuffles in place (Fisher–Yates), so that every order is equally likely.
function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

// k distinct numbers from 0, ..., n − 1, in increasing order.
function randomSubset(n: number, k: number): number[] {
  return shuffle([...Array(n).keys()]).slice(0, k).sort((a, b) => a - b);
}

// Columns for k leading entries, with kMin ≤ k ≤ kMax, chosen so that (treating the last column
// as b) the system has no solution, exactly one, or infinitely many about equally often.
function pivotColumns(cols: number, kMin: number, kMax: number): number[] {
  const vars = cols - 1;
  const options: (() => number[] | null)[] = [
    // Exactly one solution: every variable's column has a leading entry.
    () => kMin <= vars && vars <= kMax && vars >= 1 ? [...Array(vars).keys()] : null,
    // No solution: one leading entry is in the b column.
    () => {
      const hi = Math.min(kMax, vars + 1);
      return kMin <= hi ? [...randomSubset(vars, randomInt(kMin, hi) - 1), vars] : null;
    },
    // Infinitely many solutions: some variable's column has no leading entry.
    () => {
      const hi = Math.min(kMax, vars - 1);
      return kMin <= hi ? randomSubset(vars, randomInt(kMin, hi)) : null;
    },
  ];
  for (const option of shuffle(options)) {
    const pivots = option();
    if (pivots) return pivots;
  }
  return randomSubset(cols, Math.max(1, Math.min(kMax, cols)));
}

// Builds a random matrix by first choosing its form and which conditions it breaks, so that each
// condition is violated reasonably often (rather than, e.g., the leading entries almost never
// being 1 by chance). A matrix that breaks neither condition 1 nor 2 is in REF, so conditions 1
// and 2 can only fail in the "neither" matrices, which are weighted more heavily to compensate.
// Some choices are impossible for small matrices (e.g., a zero row above a nonzero row in a
// matrix with one row); those are skipped, and the page's analysis is always what's graded.
export function randomMatrix(rows: number, cols: number): number[][] {
  // ⋘──────── Which conditions to break ────────⋙
  const form = weighted<Form>([["neither", 45], ["REF", 30], ["RREF", 25]]);
  const breaks = [false, false, false, false];  // Indexed like CONDITIONS
  if (form === "neither") {
    [breaks[0], breaks[1]] = weighted([[[true, false], 35], [[false, true], 35], [[true, true], 30]]);
    breaks[2] = Math.random() < 0.5;
    breaks[3] = Math.random() < 0.5;
  } else if (form === "REF") {
    [breaks[2], breaks[3]] = pick([[true, false], [false, true], [true, true]]);
  }

  // ⋘──────── Leading entries ────────⋙
  // Breaking condition 1 needs a zero row; breaking 2 or 4 needs two nonzero rows.
  const kMax = Math.max(1, Math.min(breaks[0] ? rows - 1 : rows, cols));
  const kMin = Math.min(breaks[1] || breaks[3] ? 2 : 1, kMax);
  const pivots = pivotColumns(cols, kMin, kMax);
  const k = pivots.length;

  // When breaking condition 3, each leading entry is something other than 1 half the time
  // (and at least one is).
  const notOne = pivots.map(() => breaks[2] && Math.random() < 0.5);
  if (breaks[2] && !notOne.includes(true)) notOne[randomInt(0, k - 1)] = true;

  // When breaking condition 4, some entries above leading entries are nonzero (at least one).
  const above = new Set<string>();  // "row,col" of nonzero entries above leading entries
  if (breaks[3] && k >= 2) {
    for (let j = 1; j < k; j++) for (let i = 0; i < j; i++) if (Math.random() < 0.4) above.add(`${i},${pivots[j]}`);
    if (above.size === 0) {
      const j = randomInt(1, k - 1);
      above.add(`${randomInt(0, j - 1)},${pivots[j]}`);
    }
  }

  // ⋘──────── Entries (in REF) ────────⋙
  const m = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
  pivots.forEach((pivotCol, r) => {
    m[r][pivotCol] = notOne[r] ? pick([2, 3, 4, 5, -1, -2, -3]) : 1;
    for (let c = pivotCol + 1; c < cols; c++) {
      if (pivots.includes(c)) {
        if (above.has(`${r},${c}`)) m[r][c] = randomNonzero();
      } else {
        m[r][c] = Math.random() < 0.3 ? 0 : randomNonzero();
      }
    }
  });

  // ⋘──────── Breaking conditions 2 and 1 ────────⋙
  let broken2 = -1;  // The row whose leading entry breaks condition 2, if any
  if (breaks[1] && k >= 2) {
    const r = randomInt(0, k - 2);
    broken2 = r + 1;
    if (Math.random() < 0.5) {
      [m[r], m[r + 1]] = [m[r + 1], m[r]];      // Leading entry left of the one above it
    } else {
      m[r + 1][pivots[r]] = randomNonzero();    // Leading entry in the same column as above
    }
  }
  if (breaks[0] && k < rows) {
    // Move a zero row above a nonzero row, but not directly above the row that breaks
    // condition 2, which would make that violation ambiguous.
    const [zeroRow] = m.splice(rows - 1, 1);
    m.splice(pick([...Array(k).keys()].filter(i => i !== broken2)), 0, zeroRow);
  }
  return m;
}

// ⋘──────── Page ────────⋙

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K, className?: string, text?: string,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

const clampSize = (n: number) => Math.min(MAX_SIZE, Math.max(MIN_SIZE, n));

// Typesets math added to the page after MathJax's first pass (the site loads MathJax on every
// page; this does nothing if it hasn't loaded).
function typeset(el: Element): void {
  const mathJax = (globalThis as { MathJax?: { typesetPromise?: (els: Element[]) => Promise<void> } }).MathJax;
  mathJax?.typesetPromise?.([el]).catch(() => { /* Leave the TeX source showing */ });
}

// ⋘──────── Grading the quiz marks ────────⋙

const MARK_RESULTS = ["mx-mark-right", "mx-mark-wrong", "mx-mark-missed"];

// The class for a cell or row the student marked (or should have): right, wrong, or missed.
function markResult(actual: boolean, marked: boolean): string | null {
  if (marked) return actual ? "mx-mark-right" : "mx-mark-wrong";
  return actual ? "mx-mark-missed" : null;
}

// A feedback line for one kind of mark, like "✗ Leading entries: you missed 1 (dashed red) and
// circled 1 that isn't a leading entry (solid red)." Nothing if the student didn't use this kind
// of mark.
function markFeedback<T>(marked: Set<T>, actual: Set<T>, nouns: [string, string], verb: string): HTMLLIElement[] {
  if (marked.size === 0) return [];
  const right  = [...marked].filter(x => actual.has(x)).length;
  const wrong  = marked.size - right;
  const missed = actual.size - right;
  const item = element("li", wrong + missed === 0 ? "mx-q-right" : "mx-q-wrong");
  if (wrong + missed === 0) {
    item.textContent = `✓ You ${verb} all the ${nouns[1]} correctly.`;
  } else {
    const parts: string[] = [];
    if (missed > 0) parts.push(`missed ${missed} (dashed red)`);
    if (wrong > 0) parts.push(`${verb} ${wrong} that ${wrong === 1 ? `isn't a ${nouns[0]}` : `aren't ${nouns[1]}`} (solid red)`);
    const label = nouns[1][0].toUpperCase() + nouns[1].slice(1);
    item.textContent = `✗ ${label}: you ${joinAnd(parts)}.`;
  }
  return [item];
}

function initPage(): void {
  const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const grid          = byId<HTMLDivElement>("mx-grid");
  const rowCountText  = byId<HTMLOutputElement>("mx-rows");
  const colCountText  = byId<HTMLOutputElement>("mx-cols");
  const augmentedBox  = byId<HTMLInputElement>("mx-augmented");
  const verdict       = byId<HTMLDivElement>("mx-verdict");
  const conditionList = byId<HTMLDivElement>("mx-conditions");
  const system        = byId<HTMLDivElement>("mx-system");
  const results       = byId<HTMLDivElement>("mx-results");
  const explanationTitle = byId<HTMLHeadingElement>("mx-explanation-title");
  const legend        = byId<HTMLParagraphElement>("mx-legend");
  const checkButtons  = byId<HTMLSpanElement>("mx-check-buttons");
  const modeCheck     = byId<HTMLButtonElement>("mx-mode-check");
  const modeQuiz      = byId<HTMLButtonElement>("mx-mode-quiz");
  const quizPanel     = byId<HTMLElement>("mx-quiz");
  const quizList      = byId<HTMLOListElement>("mx-quiz-list");
  const quizCheck     = byId<HTMLButtonElement>("mx-quiz-check");
  const quizReady     = byId<HTMLSpanElement>("mx-quiz-ready");
  const quizNext      = byId<HTMLButtonElement>("mx-quiz-next");
  const quizPrev      = byId<HTMLButtonElement>("mx-quiz-prev");
  const quizNav       = byId<HTMLDivElement>("mx-quiz-nav");
  const quizScore     = byId<HTMLSpanElement>("mx-quiz-score");
  const quizMarks     = byId<HTMLUListElement>("mx-quiz-marks");
  const quizPart2     = byId<HTMLDivElement>("mx-quiz-part2");
  const quizList2     = byId<HTMLOListElement>("mx-quiz-list2");
  const quizCheck2    = byId<HTMLButtonElement>("mx-quiz-check2");

  // Entries are kept for the full maximum size, so shrinking and regrowing the matrix keeps them.
  const entries: string[][] = Array.from({ length: MAX_SIZE }, () => new Array<string>(MAX_SIZE).fill(""));
  let rows = DEFAULT_MATRIX.length;
  let cols = DEFAULT_MATRIX[0].length;
  let cells: HTMLElement[][] = [];  // Text boxes, or in quiz mode, buttons that mark leading entries
  let rowLabels: HTMLElement[] = [];
  let mode: Mode = "check";
  let analysis: Analysis | null = null;  // Of the current matrix, or null if an entry is invalid
  let quizChecked = false;                // Whether the current quiz answers have been checked
  // The student's optional quiz marks: leading entries (as "row,col") and zero rows.
  const markedLeading = new Set<string>();
  const markedZero    = new Set<number>();
  const canMark = () => mode === "quiz" && !quizChecked;
  const toggle = <T>(set: Set<T>, item: T) => { if (!set.delete(item)) set.add(item); };

  function setMatrix(matrix: string[][]): void {
    for (const row of entries) row.fill("");
    rows = clampSize(matrix.length);
    cols = clampSize(Math.max(...matrix.map(row => row.length)));
    matrix.slice(0, rows).forEach((row, r) => row.slice(0, cols).forEach((x, c) => { entries[r][c] = x; }));
  }

  // ⋘──────── URL ────────⋙

  function loadFromUrl(): void {
    const params = new URLSearchParams(location.search);
    const m = params.get("m");
    setMatrix(m ? m.split(";").map(row => row.split(",")) : DEFAULT_MATRIX);
    augmentedBox.checked = params.get("aug") !== "0";
    // A quiz link without a matrix starts with a random one.
    if (params.get("quiz") === "1") setMode("quiz", !m);
  }

  function saveToUrl(): void {
    const params = new URLSearchParams(location.search);
    params.set("m", entries.slice(0, rows).map(row => row.slice(0, cols).join(",")).join(";"));
    if (augmentedBox.checked) params.delete("aug"); else params.set("aug", "0");
    if (mode === "quiz") params.set("quiz", "1"); else params.delete("quiz");
    // URLSearchParams escapes "," and ";", but they're legal in a query and easier to read.
    const query = params.toString().replace(/%2C/g, ",").replace(/%3B/g, ";").replace(/%2F/g, "/");
    history.replaceState(null, "", `${location.pathname}?${query}`);
  }

  // ⋘──────── Matrix grid ────────⋙

  function moveFocus(r: number, c: number): void {
    const cell = cells[r]?.[c];
    cell?.focus();
    if (cell instanceof HTMLInputElement) cell.select();
  }

  // An editable entry, for checker mode.
  function entryCell(r: number, c: number, setLength: () => void): HTMLInputElement {
    const input = element("input", "mx-cell");
    input.type = "text";
    input.value = entries[r][c];
    input.placeholder = "0";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("aria-label", `Row ${r + 1}, column ${c + 1}`);
    input.addEventListener("input", () => {
      entries[r][c] = input.value.trim();
      setLength();
      update();
    });
    input.addEventListener("focus", () => input.select());
    input.addEventListener("keydown", event => {
      const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
      const atEnd   = input.selectionStart === input.value.length;
      const allSelected = input.selectionStart === 0 && input.selectionEnd === input.value.length;
      switch (event.key) {
        case "ArrowUp":    moveFocus(r - 1, c); break;
        case "ArrowDown":  moveFocus(r + 1, c); break;
        case "Enter":      moveFocus(event.shiftKey ? r - 1 : r + 1, c); break;
        case "ArrowLeft":  if (atStart || allSelected) moveFocus(r, c - 1); else return; break;
        case "ArrowRight": if (atEnd   || allSelected) moveFocus(r, c + 1); else return; break;
        default: return;
      }
      event.preventDefault();
    });
    return input;
  }

  // A fixed entry, for quiz mode: a plain number that the student clicks to mark as a leading
  // entry (with Enter or Space from the keyboard, and the arrow keys to move between entries).
  function quizCell(r: number, c: number): HTMLButtonElement {
    const value = entries[r][c] || "0";
    const button = element("button", "mx-cell mx-cell-static", value);
    button.type = "button";
    button.setAttribute("aria-label", `Row ${r + 1}, column ${c + 1}: ${value}`);
    button.addEventListener("click", () => {
      if (!canMark()) return;
      toggle(markedLeading, `${r},${c}`);
      update();
    });
    button.addEventListener("keydown", event => {
      const [dr, dc] = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[event.key] ?? [];
      if (dr === undefined) return;
      moveFocus(r + dr, c + dc);
      event.preventDefault();
    });
    return button;
  }

  function renderGrid(): void {
    rowCountText.value = `${rows}`;
    colCountText.value = `${cols}`;
    // The constants column needs a coefficient column to its left.
    augmentedBox.disabled = cols < 2;
    const augmented = augmentedBox.checked && cols >= 2;

    grid.replaceChildren();
    grid.style.gridTemplateColumns = `auto repeat(${cols}, var(--mx-cell-width))`;
    // Every item gets an explicit grid position (1-based, with the labels in row and column 1);
    // otherwise, auto-placed cells would flow around the bracket overlays added below.
    const place = (item: HTMLElement, gridRow: number, gridColumn: number) => {
      item.style.gridRow    = `${gridRow}`;
      item.style.gridColumn = `${gridColumn}`;
      grid.append(item);
    };
    for (let c = 0; c < cols; c++) {
      place(element("span", "mx-col-label", `${c + 1}`), 1, c + 2);
    }

    grid.classList.toggle("mx-marking", canMark());
    cells = [];
    rowLabels = [];
    for (let r = 0; r < rows; r++) {
      // In quiz mode, a row label is a button that marks the row as a zero row.
      const label = element(mode === "quiz" ? "button" : "span", "mx-row-label", `R${r + 1}`);
      if (label instanceof HTMLButtonElement) {
        label.type = "button";
        label.title = "Mark as a zero row";
        label.setAttribute("aria-label", `Mark row ${r + 1} as a zero row`);
        label.addEventListener("click", () => {
          if (!canMark()) return;
          toggle(markedZero, r);
          update();
        });
      }
      place(label, r + 2, 1);
      rowLabels.push(label);
      cells.push([]);
      for (let c = 0; c < cols; c++) {
        // The wrapper draws the circle around a leading entry, sized by the entry's length.
        const wrap = element("span", "mx-cell-wrap");
        const setLength = () => wrap.style.setProperty("--mx-len", `${Math.max(1, entries[r][c].length)}`);
        setLength();
        const cell = mode === "quiz" ? quizCell(r, c) : entryCell(r, c, setLength);
        wrap.append(cell);
        place(wrap, r + 2, c + 2);
        cells[r].push(cell);
      }
    }

    // Brackets around the entries and the bar before the constants column, drawn on top of the
    // grid cells they span.
    const brackets = element("div", "mx-brackets");
    brackets.style.gridRow    = `2 / span ${rows}`;
    brackets.style.gridColumn = `2 / span ${cols}`;
    grid.append(brackets);
    if (augmented) {
      const bar = element("div", "mx-aug-bar");
      bar.style.gridRow    = `2 / span ${rows}`;
      bar.style.gridColumn = `${cols + 1}`;
      grid.append(bar);
    }
  }

  // ⋘──────── Results ────────⋙

  // Highlights the cells of the violation the pointer is over (or that has keyboard focus).
  // Outlines the entries of the violation under the pointer in its condition's color.
  function setFocusCells(focused: Cell[], color = ""): void {
    for (const row of cells) for (const cell of row) cell.classList.remove("mx-focus");
    for (const [r, c] of focused) {
      cells[r][c].classList.add("mx-focus");
      cells[r][c].style.setProperty("--mx-focus", color);
    }
  }

  function renderCondition(index: number, analysis: Analysis): HTMLLIElement {
    const violations = analysis.violations[index];
    const ok = violations.length === 0;
    const item = element("li", ok ? "mx-pass" : "mx-fail");
    item.value = index + 1;
    const icon = element("span", "mx-icon", ok ? "✓" : "✗");
    icon.setAttribute("aria-label", ok ? "Satisfied:" : "Violated:");
    item.append(icon, conditionSwatch(index), element("span", "mx-condition-text", CONDITIONS[index]));
    if (!ok) {
      const list = element("ul", "mx-violations");
      for (const violation of violations) {
        const li = element("li", "mx-violation", violation.message);
        li.tabIndex = 0;
        li.style.setProperty("--mx-tint", tint(index));
        const show = () => setFocusCells(violation.cells, CONDITION_COLORS[index]);
        const hide = () => setFocusCells([]);
        li.addEventListener("mouseenter", show);
        li.addEventListener("mouseleave", hide);
        li.addEventListener("focus", show);
        li.addEventListener("blur", hide);
        list.append(li);
      }
      item.append(list);
    }
    if (index === 1 && analysis.ambiguous.length > 0) {
      item.append(element("p", "mx-condition-note", `Note: ${ambiguityNote(analysis)}`));
    }
    return item;
  }

  function renderResults(analysis: Analysis): void {
    const augmented = augmentedBox.checked && cols >= 2;
    const [title, detail] = {
      RREF   : ["Reduced row echelon form (RREF)",
                "Every matrix in RREF is also in row echelon form (REF)."],
      REF    : ["Row echelon form (REF), but not reduced",
                "Conditions 1 and 2 hold, but not both of conditions 3 and 4."],
      neither: ["Neither REF nor RREF",
                "Condition 1 or 2 fails, so the matrix isn't in REF (and so not in RREF)."],
    }[analysis.form];
    verdict.className = `mx-verdict mx-verdict-${analysis.form.toLowerCase()}`;
    verdict.replaceChildren(element("strong", "", title), element("span", "", detail));

    // A row [0 ⋯ 0 | b] with b ≠ 0 says 0 = b, whatever form the matrix is in. (In REF, the
    // solutions section explains this instead.)
    if (augmented && analysis.form === "neither") {
      const inconsistent = analysis.leading
        .map((col, r) => col === cols - 1 ? r + 1 : null)
        .filter((r): r is number => r !== null);
      if (inconsistent.length > 0) {
        const rowsText = inconsistent.length === 1 ? `Row ${inconsistent[0]} reads` : `Rows ${joinAnd(inconsistent)} read`;
        verdict.append(element("span", "mx-note",
          `${rowsText} 0 = b with b ≠ 0, so the system has no solution.`));
      }
    }

    const refList = element("ol", "mx-condition-list");
    const rrefList = element("ol", "mx-condition-list");
    CONDITIONS.forEach((_, i) => (i < REF_CONDITIONS ? refList : rrefList).append(renderCondition(i, analysis)));
    conditionList.replaceChildren(
      element("h3", "", "Row echelon form (REF)"), refList,
      element("h3", "", "Reduced row echelon form (RREF)"),
      element("p", "mx-condition-intro", "REF, and also:"), rrefList,
    );
  }

  // Rank, nullity, and the number of solutions. All of these are read off from the leading
  // entries, which only works in REF. The text below interpolates only numbers, so it's safe to
  // set as HTML.
  // The rank and solutions of Ax = b, or of Ax = 0 if the matrix isn't augmented. Valid in REF.
  function systemOf(a: Analysis) {
    const augmented = augmentedBox.checked && cols >= 2;
    const n = augmented ? cols - 1 : cols;  // Number of variables, i.e., columns of A
    // Without a b column, the solutions of Ax = 0 are those of [A | 0], whose zero column never
    // has a leading entry.
    return { augmented, n, info: systemInfo(a.leading, n + 1) };
  }

  function renderSystem(analysis: Analysis, m: Fraction[][]): void {
    const heading = "<h3>Rank, nullity, and solutions</h3>";
    if (analysis.form === "neither") {
      system.innerHTML = heading + `<p class="mx-condition-intro">These are shown once the matrix
        is in REF. The rank is the number of leading entries only for a matrix in echelon form, so
        use row operations to put the matrix in REF first.</p>`;
      return;
    }

    const { augmented, n, info } = systemOf(analysis);
    const A  = "<i>A</i>";
    const Ab = `[<i>A</i>&thinsp;|&thinsp;<b>b</b>]`;
    const x  = (col: number) => `<i>x</i><sub>${col + 1}</sub>`;
    const tableRow = (name: string, columns: number, rank: number) =>
      `<tr><th scope="row">${name}</th><td>${rows} × ${columns}</td><td>${rank}</td><td>${columns - rank}</td></tr>`;
    const table = `
      <table class="mx-rank-table">
        <thead><tr><th>Matrix</th><th>Size</th><th>Rank</th><th>Nullity</th></tr></thead>
        <tbody>
          ${tableRow(A, n, info.rankA)}
          ${augmented ? tableRow(Ab, cols, info.rankAb) : ""}
        </tbody>
      </table>
      <p class="mx-condition-intro">In echelon form, the rank is the number of leading entries
        (the number of nonzero rows), and the nullity is the number of columns without a leading
        entry (columns − rank).</p>`;

    // "Columns 2 and 4 of A have no leading entry, so x₂ and x₄ are free variables"
    const { freeCols, pivotCols } = info;
    const free = `${freeCols.length === 1 ? "Column" : "Columns"} ${joinAnd(freeCols.map(c => c + 1))}
      of ${A} ${freeCols.length === 1 ? "has" : "have"} no leading entry, so
      ${joinAnd(freeCols.map(x))} ${freeCols.length === 1 ? "is a free variable" : "are free variables"}
      (nullity ${A} = ${freeCols.length}).`;
    const Axb = `${A}<b>x</b> = <b>b</b>`;
    let title: string, explanation: string;

    if (!augmented) {
      const Ax0 = `${A}<b>x</b> = <b>0</b>`;
      [title, explanation] = info.solutions === "one"
        ? [`${Ax0} has only the trivial solution`,
           `Every column of ${A} has a leading entry, so there are no free variables
            (nullity ${A} = 0), and <b>x</b> = <b>0</b> is the only solution.`]
        : [`${Ax0} has infinitely many solutions`,
           `${free} Each choice of values for the free variables gives a different solution.`];
      explanation += ` Check “Augmented” to treat the last column as <b>b</b> and count the
        solutions of ${Axb}.`;
    } else if (info.solutions === "none") {
      const r = info.bRow!;
      const b = formatFraction(m[r][n]);
      const zeros = n === 1 ? `0${x(0)}` : n === 2 ? `0${x(0)} + 0${x(1)}` : `0${x(0)} + ⋯ + 0${x(n - 1)}`;
      title = `${Axb} has no solution`;
      explanation = `Row ${r + 1} has its leading entry in the <b>b</b> column, so it stands for
        the equation ${zeros} = ${b}, that is, 0 = ${b}, which no values of the variables satisfy.
        Equivalently, rank ${Ab} = ${info.rankAb} is greater than rank ${A} = ${info.rankA}, so
        <b>b</b> is not a linear combination of the columns of ${A}.`;
    } else {
      const consistent = `No row has its leading entry in the <b>b</b> column, so the system is
        consistent: rank ${Ab} = rank ${A} = ${info.rankA}.`;
      const basic = pivotCols.length === 1 ? "basic variable" : "basic variables";
      if (info.solutions === "one") {
        title = `${Axb} has exactly one solution`;
        explanation = `${consistent} Every column of ${A} has a leading entry, so
          ${n === 1 ? `${x(0)} is a ${basic}` : `${joinAnd(pivotCols.map(x))} are all ${basic}`}
          and there are no free variables (nullity ${A} = 0). Back substitution determines the
          value of each variable, so the solution is unique.`;
      } else {
        title = `${Axb} has infinitely many solutions`;
        explanation = `${consistent} ${free} Each choice of values for the free variables gives
          a different solution, so there are infinitely many.`;
        if (pivotCols.length > 0) {
          explanation += ` The ${basic} ${joinAnd(pivotCols.map(x))}
            ${pivotCols.length === 1 ? "is" : "are"} then determined by back substitution.`;
        }
      }
    }

    system.innerHTML = `${heading}${table}
      <div class="mx-verdict mx-solutions-${info.solutions}">
        <strong>${title}</strong><span>${explanation}</span>
      </div>`;
  }

  function update(): void {
    saveToUrl();
    const parsed = cells.map((row, r) => row.map((_, c) => parseEntry(entries[r][c])));
    for (const [r, row] of cells.entries()) {
      for (const [c, cell] of row.entries()) {
        cell.classList.toggle("mx-invalid", parsed[r][c] === null);
        cell.classList.remove("mx-bad", "mx-focus");
        cell.style.removeProperty("--mx-bad-bg");
        if (cell instanceof HTMLButtonElement) cell.setAttribute("aria-pressed", `${markedLeading.has(`${r},${c}`)}`);
        cell.parentElement!.classList.remove("mx-pivot", "mx-marked", "mx-zero-row", ...MARK_RESULTS);
      }
    }

    // The student's quiz marks (both sets are empty outside quiz mode).
    for (const key of markedLeading) {
      const [r, c] = key.split(",").map(Number);
      cells[r]?.[c]?.parentElement!.classList.add("mx-marked");
    }
    rowLabels.forEach((label, r) => {
      const marked = markedZero.has(r);
      label.classList.remove(...MARK_RESULTS);
      label.classList.toggle("mx-zero-marked", marked);
      if (label instanceof HTMLButtonElement) label.setAttribute("aria-pressed", `${marked}`);
      // Shade a marked row while marking; afterwards, the label's color shows the result, and
      // shading would hide the tint on entries that break a condition.
      if (marked && canMark()) for (const cell of cells[r]) cell.parentElement!.classList.add("mx-zero-row");
    });
    grid.classList.toggle("mx-marking", canMark());

    // In quiz mode, the leading entries and explanations are hidden until the answers are checked.
    const reveal = mode === "check" || quizChecked;
    results.hidden = legend.hidden = !reveal;
    explanationTitle.hidden = mode !== "quiz";
    quizPanel.classList.toggle("mx-quiz-checked", quizChecked);

    if (parsed.some(row => row.includes(null))) {
      analysis = null;
      results.hidden = false;
      verdict.className = "mx-verdict mx-verdict-invalid";
      verdict.replaceChildren(
        element("strong", "", "Some entries aren't numbers"),
        element("span", "", "Enter integers, decimals, or fractions like 3, −2.5, or 1/3."),
      );
      conditionList.replaceChildren();
      system.replaceChildren();
      return;
    }

    analysis = analyze(parsed as Fraction[][]);
    if (!reveal) return;
    analysis.leading.forEach((col, r) => { if (col !== null) cells[r][col].parentElement!.classList.add("mx-pivot"); });
    if (mode === "quiz") showMarkResults(analysis);
    // Tint each entry by the conditions it breaks.
    const broken = cells.map(row => row.map(() => new Set<number>()));
    analysis.violations.forEach((violations, i) => {
      for (const violation of violations) for (const [r, c] of violation.cells) broken[r][c].add(i);
    });
    cells.forEach((row, r) => row.forEach((cell, c) => {
      if (broken[r][c].size === 0) return;
      cell.classList.add("mx-bad");
      cell.style.setProperty("--mx-bad-bg", brokenBackground([...broken[r][c]].sort()));
    }));
    renderResults(analysis);
    renderSystem(analysis, parsed as Fraction[][]);
    // In quiz mode, the rank and solutions stay hidden until part 2 is checked.
    system.hidden = mode === "quiz" && !part2Checked && analysis.form !== "neither";
  }

  // After checking, colors each of the student's marks: right (green), wrong (red), or missed
  // (dashed red). Only kinds of marks the student used are graded, since marking is optional.
  function showMarkResults(a: Analysis): void {
    if (markedLeading.size > 0) {
      cells.forEach((row, r) => row.forEach((cell, c) => {
        const isLeading = a.leading[r] === c;
        const marked = markedLeading.has(`${r},${c}`);
        const result = markResult(isLeading, marked);
        if (result) cell.parentElement!.classList.add(result);
      }));
    }
    if (markedZero.size > 0) {
      rowLabels.forEach((label, r) => {
        const result = markResult(a.leading[r] === null, markedZero.has(r));
        if (result) label.classList.add(result);
      });
    }
  }

  function rebuild(): void {
    renderGrid();
    update();
  }

  // ⋘──────── Controls ────────⋙

  // ⋘──────── Quiz ────────⋙

  // Part 1 asks about the conditions and the form. If the matrix is in REF, part 2 then asks for
  // the rank, nullity, and number of solutions, which can be read off from the leading entries.
  // (Part 2 appears only after part 1 is checked, so that its appearance doesn't give away the
  // form.)

  // A question with radio-button choices or a number box. `key` gives the correct answer.
  interface Question {
    item     : HTMLLIElement;
    key      : (a: Analysis) => string;
    label    : (key: string) => string;          // How an answer is shown, e.g., "Yes" for "yes"
    describe?: (key: string) => string;          // Why, after the right answer (HTML, may have TeX)
    answer   : () => string | undefined;         // The student's answer, if any
    lock     : (accepted: string[], result: Result) => void;  // Disables it and shows the result
    // When a question is ambiguous for a matrix, every answer it accepts and why.
    ambiguity?: (a: Analysis) => { accepted: string[]; note: string } | null;
    reset    : () => void;
    setAnswer: (answer: string | undefined) => void;  // To restore an earlier matrix's answers
  }
  // Skipped questions get gentle, neutral feedback: the quiz is meant to be fine to answer only
  // in part (e.g., just the form), so a blank isn't marked wrong.
  type Result = "right" | "wrong" | "skipped";
  const part1: Question[] = [];
  const part2: Question[] = [];
  let part2Checked = false;
  let questionCount = 0;  // For unique radio names and ids

  // Adds a question's row (its text, then `input`, then a line for the result) to `list`.
  function addItem(list: HTMLOListElement, text: string, input: HTMLElement, className: string): HTMLLIElement {
    const item = element("li", `mx-quiz-item ${className}`);
    const question = element("span", "mx-quiz-question", text);
    question.id = `mx-q${questionCount++}-label`;
    input.setAttribute("aria-labelledby", question.id);
    item.append(question, input, element("span", "mx-quiz-mark"));
    list.append(item);
    return item;
  }

  function choiceQuestion(list: HTMLOListElement, text: string, choices: [string, string][],
                          key: Question["key"], describe?: Question["describe"], className = ""): Question {
    const name = `mx-q${questionCount}`;
    const group = element("span", "mx-choices");
    group.setAttribute("role", "radiogroup");
    // Clicking the selected choice again unselects it. Radio buttons don't do that on their own,
    // so the group remembers its selection (in data-picked) to tell when that happens.
    group.addEventListener("click", event => {
      const radio = event.target;
      if (!(radio instanceof HTMLInputElement) || radio.disabled) return;
      if (group.dataset.picked === radio.value) {
        radio.checked = false;
        delete group.dataset.picked;
      } else {
        group.dataset.picked = radio.value;
      }
    });
    for (const [value, label] of choices) {
      const choice = element("label", "mx-choice");
      const radio = element("input");
      radio.type = "radio";
      radio.name = name;
      radio.value = value;
      choice.append(radio, element("span", "", label));
      group.append(choice);
    }
    const item = addItem(list, text, group, className);
    const radios = [...group.querySelectorAll("input")];
    return {
      item, key, describe,
      // Multi-word choices are quoted, like “REF, but not RREF”.
      label: k => {
        const label = choices.find(([value]) => value === k)?.[1] ?? k;
        return /[\s,]/.test(label) ? `“${label}”` : label;
      },
      answer: () => radios.find(radio => radio.checked)?.value,
      lock: (accepted, result) => {
        for (const radio of radios) {
          radio.disabled = true;
          radio.parentElement!.classList.toggle("mx-key", accepted.includes(radio.value));
          if (radio.checked) radio.parentElement!.classList.add(result === "right" ? "mx-right" : "mx-wrong");
        }
      },
      reset: () => {
        delete group.dataset.picked;
        for (const radio of radios) {
          radio.checked = radio.disabled = false;
          radio.parentElement!.classList.remove("mx-key", "mx-right", "mx-wrong");
        }
      },
      setAnswer: answer => {
        for (const radio of radios) radio.checked = radio.value === answer;
        if (answer === undefined) delete group.dataset.picked; else group.dataset.picked = answer;
      },
    };
  }

  function numberQuestion(list: HTMLOListElement, text: string,
                          key: Question["key"], describe: Question["describe"]): Question {
    const input = element("input", "mx-quiz-number");
    // A text box rather than type="number", which would add increment and decrement buttons.
    input.type = "text";
    input.inputMode = "numeric";
    input.autocomplete = "off";  // Otherwise browsers suggest earlier answers
    const item = addItem(list, text, input, "");
    return {
      item, key, describe,
      label: k => k,
      answer: () => input.value.trim() === "" ? undefined : `${Number(input.value)}`,
      lock: (_, result) => {
        input.disabled = true;
        if (result !== "skipped") input.classList.add(result === "right" ? "mx-right" : "mx-wrong");
      },
      reset: () => {
        input.value = "";
        input.disabled = false;
        input.classList.remove("mx-right", "mx-wrong");
      },
      setAnswer: answer => { input.value = answer ?? ""; },
    };
  }

  // Marks each answer right or wrong and locks it.
  function grade(questions: Question[], a: Analysis): void {
    for (const q of questions) {
      const key = q.key(a);
      const answer = q.answer();
      const ambiguity = q.ambiguity?.(a);
      const accepted = ambiguity?.accepted ?? [key];
      const right = answer !== undefined && accepted.includes(answer);
      const result: Result = answer === undefined ? "skipped" : right ? "right" : "wrong";
      q.item.classList.add(`mx-q-${result}`);
      const mark = q.item.querySelector(".mx-quiz-mark")!;
      const reason = q.describe ? ` ${q.describe(key)}` : "";
      mark.innerHTML = ambiguity ? `${right ? "✓ Correct. " : ""}${ambiguity.note}`
        : result === "right"   ? "✓ Correct"
        : result === "skipped" ? `The answer is ${q.label(key)}.${reason}`
        : `✗ Incorrect. The correct answer is ${q.label(key)}.${reason}`;
      if (!right) typeset(mark);
      q.lock(accepted, result);
    }
  }

  CONDITIONS.forEach((text, i) => {
    const q = choiceQuestion(quizList,
      `${i + 1}. ${text}`,
      [["yes", "Yes"], ["no", "No"]],
      a => a.violations[i].length === 0 ? "yes" : "no",
    );
    // The condition's color, matching the entries that break it once the answers are checked.
    q.item.querySelector(".mx-quiz-question")!.prepend(conditionSwatch(i));
    if (i === 1) q.ambiguity = a => a.violations[1].length === 0 && a.ambiguous.length > 0
      ? { accepted: ["yes", "no"], note: `Either answer is accepted: ${ambiguityNote(a)}` }
      : null;
    part1.push(q);
  });
  part1.push(choiceQuestion(quizList, "Which form is the matrix in?", FORM_CHOICES, a => a.form,
    undefined, "mx-quiz-form"));

  // "Check answers" needs at least the form; the other questions are optional. Clicks on the
  // answers bubble here after each question's own handler (which may unselect a choice).
  const formQuestion = part1[CONDITIONS.length];
  function updateQuizCheck(): void {
    const ready = formQuestion.answer() !== undefined;
    quizCheck.disabled = !ready;
    quizCheck.title = ready ? "" : "Choose the matrix's form first";
    // Says that only the form is needed, so students don't think they must answer everything.
    quizReady.hidden = ready;
  }
  quizList.addEventListener("click", updateQuizCheck);

  // Part 2's questions depend on whether the matrix is augmented, so they're rebuilt each time.
  function buildPart2(): void {
    part2.length = 0;
    quizList2.replaceChildren();
    const { augmented, n } = systemOf(analysis!);
    // "There are 2 leading entries in A (to the left of the line), so rank(A) = 2."
    const rankReason = (rank: number, where: string, name: string) =>
      String.raw`There ${rank === 1 ? "is 1 leading entry" : `are ${rank} leading entries`} in ${where}, so
       \(\operatorname{rank}(${name}) = ${rank}\).`;
    // null(A) = n − rank(A) = 4 − 2 = 2, where n = 4 is the number of columns of A.
    const nullityReason = (columns: number, rank: number, name: string) =>
      String.raw`$$\operatorname{null}(${name}) = n - \operatorname{rank}(${name}) = ${columns} - ${rank} = ${columns - rank},$$
       where \(n = ${columns}\) is the number of columns of \(${name}\).`;
    const A = "A", Ab = String.raw`[A \mid b]`;
    part2.push(
      numberQuestion(quizList2, "Rank of A", a => `${systemOf(a).info.rankA}`,
        key => rankReason(Number(key), augmented ? "A (to the left of the line)" : "A", A)),
      numberQuestion(quizList2, "Nullity of A", a => `${n - systemOf(a).info.rankA}`,
        () => nullityReason(n, systemOf(analysis!).info.rankA, A)),
    );
    if (augmented) {
      part2.push(
        numberQuestion(quizList2, "Rank of [A | b]", a => `${systemOf(a).info.rankAb}`,
          key => rankReason(Number(key), "[A | b] (on either side of the line)", Ab)),
        numberQuestion(quizList2, "Nullity of [A | b]", a => `${cols - systemOf(a).info.rankAb}`,
          () => nullityReason(cols, systemOf(analysis!).info.rankAb, Ab)),
        choiceQuestion(quizList2, "How many solutions does Ax = b have?",
          [["none", "None"], ["one", "Exactly one"], ["infinite", "Infinitely many"]],
          a => systemOf(a).info.solutions,
          () => "See the explanation below.",
          "mx-quiz-form"),
      );
    } else {
      part2.push(choiceQuestion(quizList2, "How many solutions does Ax = 0 have?",
        [["one", "Only x = 0"], ["infinite", "Infinitely many"]],
        a => systemOf(a).info.solutions,
        () => "See the explanation below.",
        "mx-quiz-form"));
    }
    quizCheck2.hidden = false;
  }

  // Clears the answers and hides the explanations, e.g., for a new matrix.
  function resetQuiz(): void {
    quizChecked = part2Checked = false;
    for (const q of part1) {
      q.item.classList.remove("mx-q-right", "mx-q-wrong", "mx-q-skipped", "mx-q-hint");
      q.item.querySelector(".mx-quiz-mark")!.textContent = "";
      q.reset();
    }
    part2.length = 0;
    quizList2.replaceChildren();
    quizPart2.hidden = true;
    quizScore.textContent = "";
    quizMarks.replaceChildren();
    markedLeading.clear();
    markedZero.clear();
    quizCheck.hidden = false;
    updateQuizCheck();
    quizNext.classList.remove("mx-primary");
  }

  function checkQuiz(): void {
    if (!analysis || quizChecked) return;
    grade(part1, analysis);
    // If the form is wrong, highlight the skipped conditions that show the right form.
    const pickedForm = part1[CONDITIONS.length].answer() as Form | undefined;
    if (pickedForm && pickedForm !== analysis.form) {
      for (const [i, hint] of formHints(analysis, pickedForm)) {
        const q = part1[i];
        if (q.answer() !== undefined) continue;  // Answered conditions are already marked
        q.item.classList.add("mx-q-hint");
        q.item.querySelector(".mx-quiz-mark")!.append(` ${hint}`);
      }
    }
    quizMarks.replaceChildren(
      ...markFeedback(markedLeading, new Set(analysis.leading.flatMap((c, r) => c === null ? [] : [`${r},${c}`])),
                      ["leading entry", "leading entries"], "circled"),
      ...markFeedback(markedZero, new Set(analysis.leading.flatMap((c, r) => c === null ? [r] : [])),
                      ["zero row", "zero rows"], "marked"),
    );
    quizChecked = true;
    quizCheck.hidden = true;
    if (analysis.form === "neither") {
      quizNext.classList.add("mx-primary");
      quizNext.focus({ preventScroll: true });
    } else {
      buildPart2();
      quizPart2.hidden = false;
      quizScore.textContent = "The matrix is in REF, so now try part 2 below.";
    }
    update();
  }

  function checkPart2(): void {
    if (!analysis || part2Checked) return;
    grade(part2, analysis);
    part2Checked = true;
    quizCheck2.hidden = true;
    quizNext.classList.add("mx-primary");
    update();
    quizNext.focus({ preventScroll: true });
  }

  // ⋘──────── Quiz history ────────⋙

  // The quiz matrices seen so far, each with the student's answers and marks, so that "Previous
  // matrix" can go back to one exactly as the student left it. Checked answers are restored by
  // grading them again, which reproduces the same feedback.
  interface QuizState {
    matrix   : string[][];
    answers  : (string | undefined)[];  // Part 1
    answers2 : (string | undefined)[];  // Part 2
    leading  : string[];
    zero     : number[];
    checked  : boolean;
    checked2 : boolean;
  }
  let quizHistory: QuizState[] = [];
  let historyIndex = -1;  // The current matrix's place in the history

  function currentState(): QuizState {
    return {
      matrix  : entries.slice(0, rows).map(row => row.slice(0, cols)),
      answers : part1.map(q => q.answer()),
      answers2: part2.map(q => q.answer()),
      leading : [...markedLeading],
      zero    : [...markedZero],
      checked : quizChecked,
      checked2: part2Checked,
    };
  }

  function restoreState(state: QuizState): void {
    setMatrix(state.matrix);
    resetQuiz();
    state.leading.forEach(key => markedLeading.add(key));
    state.zero.forEach(r => markedZero.add(r));
    rebuild();
    part1.forEach((q, i) => q.setAnswer(state.answers[i]));
    updateQuizCheck();
    if (state.checked) {
      checkQuiz();
      part2.forEach((q, i) => q.setAnswer(state.answers2[i]));
      if (state.checked2) checkPart2();
    }
    updateHistoryButtons();
  }

  // Starts the history over with the current matrix (e.g., when entering quiz mode).
  function startHistory(): void {
    quizHistory = [currentState()];
    historyIndex = 0;
    updateHistoryButtons();
  }

  function updateHistoryButtons(): void {
    quizPrev.hidden = mode !== "quiz" || historyIndex <= 0;
  }

  function previousMatrix(): void {
    if (historyIndex <= 0) return;
    quizHistory[historyIndex] = currentState();
    restoreState(quizHistory[--historyIndex]);
  }

  // Goes forward to a matrix seen before, or else to a new one.
  function nextMatrix(): void {
    if (historyIndex < quizHistory.length - 1) {
      quizHistory[historyIndex] = currentState();
      restoreState(quizHistory[++historyIndex]);
    } else {
      newQuizMatrix();
    }
  }

  // A new random quiz matrix, of a random size unless the student just chose the size. It goes
  // after the current matrix in the history, replacing any matrices after it.
  function newQuizMatrix(randomSize = true): void {
    if (historyIndex >= 0) quizHistory[historyIndex] = currentState();
    const [r, c] = randomSize ? [randomInt(...QUIZ_ROWS), randomInt(...QUIZ_COLS)] : [rows, cols];
    setMatrix(randomMatrix(r, c).map(row => row.map(String)));
    resetQuiz();
    rebuild();
    quizHistory = quizHistory.slice(0, historyIndex + 1);
    quizHistory.push(currentState());
    historyIndex = quizHistory.length - 1;
    updateHistoryButtons();
  }

  // Switches between checking the student's own matrix and quizzing them on random ones. A new
  // quiz starts with a random matrix unless `fresh` is false (for a matrix from the URL).
  function setMode(newMode: Mode, fresh = true): void {
    mode = newMode;
    modeCheck.setAttribute("aria-pressed", `${mode === "check"}`);
    modeQuiz.setAttribute("aria-pressed", `${mode === "quiz"}`);
    quizPanel.hidden = mode !== "quiz";
    checkButtons.hidden = mode === "quiz";
    quizNav.hidden = mode !== "quiz";
    resetQuiz();
    if (mode === "quiz" && fresh) {
      setMatrix(randomMatrix(randomInt(...QUIZ_ROWS), randomInt(...QUIZ_COLS)).map(row => row.map(String)));
    }
    rebuild();
    startHistory();
  }

  // ⋘──────── Controls ────────⋙

  // In quiz mode, the entries can't be edited, so a new size gets a new random matrix.
  const resize = (dRows: number, dCols: number) => () => {
    rows = clampSize(rows + dRows);
    cols = clampSize(cols + dCols);
    if (mode === "quiz") newQuizMatrix(false); else rebuild();
  };
  byId("mx-rows-minus").addEventListener("click", resize(-1, 0));
  byId("mx-rows-plus" ).addEventListener("click", resize(+1, 0));
  byId("mx-cols-minus").addEventListener("click", resize(0, -1));
  byId("mx-cols-plus" ).addEventListener("click", resize(0, +1));
  augmentedBox.addEventListener("change", () => {
    // Part 2's questions depend on whether the matrix is augmented.
    if (mode === "quiz" && !quizPart2.hidden && !part2Checked) buildPart2();
    rebuild();
  });
  modeCheck.addEventListener("click", () => { if (mode !== "check") setMode("check"); });
  modeQuiz.addEventListener("click", () => { if (mode !== "quiz") setMode("quiz"); });
  quizCheck.addEventListener("click", checkQuiz);
  quizCheck2.addEventListener("click", checkPart2);
  quizNext.addEventListener("click", nextMatrix);
  quizPrev.addEventListener("click", previousMatrix);

  byId("mx-random").addEventListener("click", () => {
    setMatrix(randomMatrix(rows, cols).map(row => row.map(String)));
    rebuild();
  });
  byId("mx-clear").addEventListener("click", () => {
    setMatrix(Array.from({ length: rows }, () => new Array<string>(cols).fill("")));
    rebuild();
    moveFocus(0, 0);
  });

  // Remember whether each set of instructions is collapsed (only in this browser).
  for (const details of document.querySelectorAll<HTMLDetailsElement>(".mx-instructions")) {
    const key = `echelon-form-${details.id}-open`;
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) details.open = saved === "1";
    } catch { /* Storage may be unavailable, e.g., in a private window */ }
    details.addEventListener("toggle", () => {
      try { localStorage.setItem(key, details.open ? "1" : "0"); } catch { /* As above */ }
    });
  }

  // The matrix sticks to the top of the window while scrolling (see the page's CSS). A sentinel
  // just above it shows when it's stuck, to add a shadow separating it from the page below.
  const matrixBox = byId<HTMLDivElement>("mx-sticky");
  const sentinel = element("div");
  matrixBox.before(sentinel);
  new IntersectionObserver(([entry]) => matrixBox.classList.toggle("mx-stuck", !entry.isIntersecting))
    .observe(sentinel);

  loadFromUrl();
  rebuild();
}

if (typeof document !== "undefined") {
  // Module scripts are deferred, but guard in case the DOM is still loading.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    initPage();
  }
}
