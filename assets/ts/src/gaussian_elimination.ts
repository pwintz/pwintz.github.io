// ╭───────────────────────────────────────────────────────────────╮
// │                 Gaussian elimination practice                 │
// ╰───────────────────────────────────────────────────────────────╯
// Students row reduce a matrix one row operation at a time. The page starts with a random matrix
// (or one the student types in), and the student applies replacements (Ri → Ri + c Rj), scalings
// (Ri → c Ri), and swaps (Ri ↔ Rj). Every step is kept, like work on paper, with undo. The
// current matrix's leading entries are circled, and a checklist shows which of the REF and RREF
// conditions (as worded in ./matrix/echelon.ts) still fail. A hint suggests a next step, following
// the standard algorithm, as a subgoal (like "make the entries below the leading entry in column 1
// into 0s") rather than the step itself, and the page counts the hints used for each matrix.
//
// The student practices one or both tasks: choosing the row operations, and computing the new rows.
// When the student doesn't choose, the page gives each step (the standard algorithm's next one).
// Optionally, the student also has to recognize when the goal is reached: the page doesn't say
// whether the matrix is in REF or RREF until the student declares it.
// When the student computes the new rows, their rows aren't checked automatically: a mistake carries
// forward, as on paper. "Check" checks a row before it's applied, "Check all steps" checks the
// rows so far, and "Show" fills a row in; each counts as a hint. Hints come in two
// levels: a subgoal, then (on request) a more specific hint.
//
// A completed step can be edited: its operation (and entered row) is loaded into the form, and
// updating it redoes the steps after it, keeping their operations and any rows the student entered.
//
// Random matrices are made by scrambling a matrix in RREF with integer row operations, so their
// entries are small integers and reducing them by hand works out reasonably.
//
// The starting matrix and the steps are saved in the page's URL, so that reloading the page keeps
// the student's work and a link can share it: ?m=1,2,3;4,5,6 (rows separated by ";"), &aug=0 if
// the matrix isn't augmented, &goal=REF if the goal is REF instead of RREF, &compute=1 if the
// student computes the new rows, &hints=N for the hints used, and &ops=... with the steps
// separated by "," (see encodeStep).

import {
  Fraction, add, div, equals, formatFraction, fraction, isOne, isZero, mul, neg, parseEntry, reduce,
} from "./matrix/fraction";
import { CONDITIONS, REF_CONDITIONS, analyze, joinAnd } from "./matrix/echelon";

// ⋘──────── Types and constants ────────⋙

export type Matrix = Fraction[][];
type Goal = "REF" | "RREF";

export type Op =
  | { kind: "replace"; i: number; j: number; c: Fraction }  // Ri → Ri + c Rj
  | { kind: "scale";   i: number; c: Fraction }             // Ri → c Ri
  | { kind: "swap";    i: number; j: number };              // Ri ↔ Rj

// Sizes offered for random matrices: rows × columns (including the constants column).
const SIZES: [number, number][] = [[2, 3], [3, 3], [3, 4], [4, 4], [4, 5]];
const DEFAULT_SIZE = "3x4";
const MAX_ENTRY = 12;  // Largest entry (in absolute value) in a random matrix
const MAX_SIZE  = 8;   // Largest matrix a student can type in
// Whether to offer "Share result" after finishing (see shareBox). Hidden for now.
const SHOW_SHARE_BUTTON = false;

// ⋘──────── Row operations ────────⋙

export function applyOp(m: Matrix, op: Op): Matrix {
  const out = m.map(row => [...row]);
  switch (op.kind) {
    case "replace": out[op.i] = m[op.i].map((x, k) => add(x, mul(op.c, m[op.j][k]))); break;
    case "scale":   out[op.i] = m[op.i].map(x => mul(op.c, x)); break;
    case "swap":    [out[op.i], out[op.j]] = [out[op.j], out[op.i]]; break;
  }
  return out;
}

// Why an operation isn't allowed, or null if it is.
export function opProblem(op: Op, rows: number): string | null {
  const valid = (r: number) => Number.isInteger(r) && r >= 0 && r < rows;
  if (!valid(op.i) || (op.kind !== "scale" && !valid(op.j))) return "Choose rows of the matrix.";
  if (op.kind === "swap" && op.i === op.j) return "Choose two different rows to swap.";
  if (op.kind === "replace" && op.i === op.j) {
    return "Add a multiple of a different row. (To multiply a row by a number, use Scale.)";
  }
  if (op.kind === "scale" && isZero(op.c)) {
    return "A row can't be multiplied by 0: that would lose the row's information for good.";
  }
  if (op.kind === "replace" && isZero(op.c)) return "Adding 0 times a row doesn't change anything.";
  return null;
}

const R = (i: number) => `R<sub>${i + 1}</sub>`;

// The coefficient written in front of a row: "" for 1, "−" for −1, "3", or "(1/2)".
function coefficient(c: Fraction): string {
  if (isOne(c)) return "";
  if (equals(c, fraction(-1))) return "−";
  const text = formatFraction(c);
  return text.includes("/") ? `(${text})` : text;
}

// An operation as written on paper (HTML), like "R₂ → R₂ − 3R₁".
export function opLabel(op: Op): string {
  switch (op.kind) {
    case "replace": {
      const negative = op.c.num < 0n;
      return `${R(op.i)} → ${R(op.i)} ${negative ? "−" : "+"} ${coefficient(negative ? neg(op.c) : op.c)}${R(op.j)}`;
    }
    case "scale": return `${R(op.i)} → ${coefficient(op.c)}${R(op.i)}`;
    case "swap":  return `${R(op.i)} ↔ ${R(op.j)}`;
  }
}

// For the URL: "r2.1.-3" (R2 → R2 − 3R1), "m2.1/2" (R2 → (1/2)R2), and "s1.3" (R1 ↔ R3).
const plain = (c: Fraction) => formatFraction(c).replace("−", "-");
export function encodeOp(op: Op): string {
  switch (op.kind) {
    case "replace": return `r${op.i + 1}.${op.j + 1}.${plain(op.c)}`;
    case "scale":   return `m${op.i + 1}.${plain(op.c)}`;
    case "swap":    return `s${op.i + 1}.${op.j + 1}`;
  }
}

export function decodeOp(text: string): Op | null {
  const [kind, ...parts] = [text[0], ...text.slice(1).split(".")];
  const row = (s: string | undefined) => Number(s) - 1;
  const c = parts.at(-1) === undefined ? null : parseEntry(parts.at(-1)!);
  if (kind === "r" && parts.length === 3 && c) return { kind: "replace", i: row(parts[0]), j: row(parts[1]), c: reduce(c) };
  if (kind === "m" && parts.length === 2 && c) return { kind: "scale", i: row(parts[0]), c: reduce(c) };
  if (kind === "s" && parts.length === 2) return { kind: "swap", i: row(parts[0]), j: row(parts[1]) };
  return null;
}

// ⋘──────── Hints ────────⋙

// The next step of the standard algorithm (used for testing that it always finishes), the subgoal
// it works toward, which is the first hint the student sees, and a more specific second hint,
// which names the kind of operation and the rows but leaves the multiplier to the student.
export interface Hint { op: Op; subgoal: string; specific: string }

const isUnit = (x: Fraction) => isOne(x) || equals(x, fraction(-1));

// The next step of the standard algorithm from the current matrix, or null if the goal is
// reached. Forward phase: for each pivot position from left to right, swap a nonzero entry into
// it (preferring ±1, to avoid fractions), then make the entries below it 0. Backward phase (for
// RREF): from the last pivot up, scale it to 1 and make the entries above it 0. The steps depend
// only on the current matrix, so a hint makes sense whatever the student did before.
export function nextStep(m: Matrix, goal: Goal): Hint | null {
  const rows = m.length, cols = m[0].length;
  const pivots: [number, number][] = [];  // (row, column) of each pivot found
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    const candidates = [...Array(rows).keys()].filter(k => k >= r && !isZero(m[k][c]));
    if (candidates.length === 0) continue;
    if (isZero(m[r][c])) {
      const p = candidates.find(k => isUnit(m[k][c])) ?? candidates[0];
      return {
        op: { kind: "swap", i: r, j: p },
        subgoal: `Get a nonzero entry into row ${r + 1}, column ${c + 1}, so it can be the next leading entry.`,
        specific: `Swap row ${r + 1} with a row below it that has a nonzero entry in column ${c + 1}, like row ${p + 1}.`,
      };
    }
    const clearBelow = `Make the entries below the leading entry in column ${c + 1} into 0s.`;
    const unit = candidates.find(k => isUnit(m[k][c]));
    if (!isUnit(m[r][c]) && unit !== undefined) {
      return {
        op: { kind: "swap", i: r, j: unit },
        subgoal: `${clearBelow} (Tip: a leading entry of 1 or −1 avoids fractions, and a row below has one in this column.)`,
        specific: `Swap rows ${r + 1} and ${unit + 1}, so that the leading entry in column ${c + 1} is `
          + `${formatFraction(m[unit][c])}. Then add multiples of row ${r + 1} to the rows below it.`,
      };
    }
    const k = candidates.find(k => k !== r);
    if (k !== undefined) {
      return {
        op: { kind: "replace", i: k, j: r, c: neg(div(m[k][c], m[r][c])) },
        subgoal: clearBelow,
        specific: `Add a multiple of row ${r + 1} to row ${k + 1}, choosing the multiple so that the entry in `
          + `row ${k + 1}, column ${c + 1} becomes 0.`,
      };
    }
    pivots.push([r, c]);
    r++;
  }
  if (goal === "REF") return null;
  for (const [i, c] of [...pivots].reverse()) {
    if (!isOne(m[i][c])) {
      return {
        op: { kind: "scale", i, c: div(fraction(1), m[i][c]) },
        subgoal: `Make the leading entry of row ${i + 1} a 1.`,
        specific: `Scale row ${i + 1}: multiply it by the number that turns its leading entry, `
          + `${formatFraction(m[i][c])}, into 1.`,
      };
    }
    const k = [...Array(i).keys()].find(k => !isZero(m[k][c]));
    if (k !== undefined) {
      return {
        op: { kind: "replace", i: k, j: i, c: neg(m[k][c]) },
        subgoal: `Make the entries above the leading 1 in column ${c + 1} into 0s.`,
        specific: `Add a multiple of row ${i + 1} to row ${k + 1}, choosing the multiple so that the entry in `
          + `row ${k + 1}, column ${c + 1} becomes 0.`,
      };
    }
  }
  return null;
}

// ⋘──────── Random matrices ────────⋙

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const pick = <T>(items: T[]) => items[randomInt(0, items.length - 1)];

// k distinct numbers from 0, ..., n − 1, in increasing order.
function randomSubset(n: number, k: number): number[] {
  const items = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items.slice(0, k).sort((a, b) => a - b);
}

// A random matrix in RREF. When augmented, the system usually has a solution (unique when there
// are enough rows), sometimes has free variables, and sometimes has none.
function randomRref(rows: number, cols: number, augmented: boolean): number[][] {
  const vars = augmented ? cols - 1 : cols;
  const full = Math.min(rows, vars);
  const roll = Math.random();
  let pivots: number[];
  if (augmented && roll < 0.15 && full < rows + 1) {
    pivots = [...randomSubset(vars, Math.min(rows, vars + 1) - 1), vars];  // No solution
  } else if (roll < 0.35 && full > 1) {
    pivots = randomSubset(vars, full - 1);                                // A free variable
  } else {
    pivots = randomSubset(vars, full);
  }
  const m = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
  pivots.forEach((p, r) => {
    m[r][p] = 1;
    for (let c = p + 1; c < cols; c++) {
      if (!pivots.includes(c)) m[r][c] = Math.random() < 0.3 ? 0 : randomInt(-4, 4);
    }
  });
  return m;
}

// Scrambles a matrix with random integer row operations (mostly replacements).
function scramble(rref: number[][]): number[][] {
  const m = rref.map(row => [...row]);
  const rows = m.length;
  if (rows < 2) return m.map(row => row.map(x => x * pick([2, -1, 3])));
  const steps = rows + randomInt(2, rows + 1);
  for (let t = 0; t < steps; t++) {
    const i = randomInt(0, rows - 1);
    const j = (i + randomInt(1, rows - 1)) % rows;
    const roll = Math.random();
    if (roll < 0.7) {
      const c = pick([1, 2, 3, -1, -2, -3]);
      m[i] = m[i].map((x, k) => x + c * m[j][k]);
    } else if (roll < 0.85) {
      [m[i], m[j]] = [m[j], m[i]];
    } else {
      const c = pick([-1, 2, -2, 3]);
      m[i] = m[i].map(x => x * c);
    }
  }
  return m;
}

const toFractions = (m: number[][]): Matrix => m.map(row => row.map(x => fraction(x)));

// A random matrix to reduce: small integer entries, not already in REF, and no zero rows.
export function randomProblem(rows: number, cols: number, augmented: boolean): Matrix {
  let best: number[][] | null = null;
  for (let attempt = 0; attempt < 500; attempt++) {
    const m = scramble(randomRref(rows, cols, augmented));
    const big = Math.max(...m.flat().map(Math.abs));
    if (big > MAX_ENTRY || m.some(row => row.every(x => x === 0))) continue;
    if (analyze(toFractions(m)).form !== "neither") { best ??= m; continue; }
    return toFractions(m);
  }
  return toFractions(best ?? randomRref(rows, cols, augmented));
}

// ⋘──────── Parsing a typed matrix ────────⋙

// Parses rows on separate lines, with entries separated by spaces or commas, and an optional "|"
// before the constants column (in every row, or none). Returns an error message if it can't.
export function parseMatrix(text: string): { m: Matrix; augmented: boolean } | string {
  const lines = text.split("\n").map(line => line.trim()).filter(line => line !== "");
  if (lines.length === 0) return "Type the matrix's rows on separate lines.";
  const bars = lines.map(line => line.includes("|"));
  if (bars.some(b => b !== bars[0])) return "Put a | before the constants in every row, or in none.";
  const m: Matrix = [];
  for (const [r, line] of lines.entries()) {
    const row: Fraction[] = [];
    for (const text of line.replace("|", " ").split(/[\s,]+/).filter(s => s !== "")) {
      const x = parseEntry(text);
      if (!x) return `Row ${r + 1}: “${text}” isn't a number.`;
      row.push(reduce(x));
    }
    m.push(row);
  }
  if (m.some(row => row.length !== m[0].length)) return "Every row needs the same number of entries.";
  if (m.length > MAX_SIZE || m[0].length > MAX_SIZE) return `Use at most ${MAX_SIZE} rows and ${MAX_SIZE} columns.`;
  if (bars[0] && m[0].length < 2) return "An augmented matrix needs at least two columns.";
  return { m, augmented: bars[0] };
}

const matrixText = (m: Matrix, augmented: boolean) => m.map(row => {
  const entries = row.map(x => plain(x).padStart(3));
  if (augmented) entries.splice(row.length - 1, 0, "|");
  return entries.join(" ");
}).join("\n");

// ⋘──────── Unsimplified rows ────────⋙

// A placeholder for a part of an operation that hasn't been chosen yet.
const MISSING = (text: string) => `<span class="ge-missing">${text}</span>`;
// The scalar (violet) and the entries of the row being added (blue), so the parts of each
// expression can be traced back to the operation.
const SCALAR = (text: string) => `<span class="ge-scalar">${text}</span>`;
const ADDED  = (text: string) => `<span class="ge-added">${text}</span>`;

// An entry inside an expression: in parentheses if it's negative or a fraction.
function factor(x: Fraction): string {
  const text = formatFraction(x);
  return x.num < 0n || text.includes("/") ? `(${text})` : text;
}

// One entry of a replaced row, before simplifying, like "3 − 2(−1)" for a + c·b (HTML). A null
// multiplier hasn't been chosen yet.
export function replaceExpression(a: Fraction, b: Fraction, c: Fraction | null): string {
  if (!c) return `${formatFraction(a)} + ${MISSING("c")}(${ADDED(formatFraction(b))})`;
  const negative = c.num < 0n;
  const coef = coefficient(negative ? neg(c) : c);
  // The sign goes with the scalar: in "4 − 2(3)", the scalar is −2.
  const scalar = SCALAR(`${negative ? "−" : "+"}${coef === "" ? "" : ` ${coef}`}`);
  return `${formatFraction(a)} ${scalar}${coef === "" ? ` ${ADDED(factor(b))}` : `(${ADDED(formatFraction(b))})`}`;
}

// One entry of a scaled row, before simplifying, like "(1/2)(4)" for c·a (HTML).
export function scaleExpression(a: Fraction, c: Fraction | null): string {
  if (!c) return `${MISSING("c")}(${formatFraction(a)})`;
  if (isOne(c)) return formatFraction(a);
  return `${SCALAR(coefficient(c))}(${formatFraction(a)})`;
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

interface MatrixOptions {
  augmented : boolean;
  labels?   : boolean;                // Row labels R1, R2, ...
  leading?  : (number | null)[];      // Columns of leading entries to circle
  target?   : number;                 // Row being changed (highlighted)
  source?   : number;                 // Row being added (outlined)
  className?: string;
  html?     : Map<number, string[]>;  // Rows shown as HTML instead of their entries (by row)
}

// A bracketed matrix, with a bar before the constants column when augmented.
function matrixElement(m: Matrix, options: MatrixOptions): HTMLElement {
  const rows = m.length, cols = m[0].length;
  const grid = element("div", `ge-matrix ${options.className ?? ""}`);
  const first = options.labels ? 2 : 1;  // Grid column of the first entry
  grid.style.gridTemplateColumns = `${options.labels ? "auto " : ""}repeat(${cols}, auto)`;
  const place = (item: HTMLElement, row: number, col: number, rowSpan = 1, colSpan = 1) => {
    item.style.gridRow = `${row} / span ${rowSpan}`;
    item.style.gridColumn = `${col} / span ${colSpan}`;
    grid.append(item);
  };
  m.forEach((row, r) => {
    if (options.labels) place(element("span", "ge-row-label", `R${r + 1}`), r + 1, 1);
    row.forEach((x, c) => {
      const cell = element("span", "ge-cell", formatFraction(x));
      cell.dataset.row = `${r}`;
      const html = options.html?.get(r)?.[c];
      if (html !== undefined) cell.innerHTML = html;
      cell.style.setProperty("--len", `${cell.textContent!.length}`);
      if (options.leading?.[r] === c) cell.classList.add("ge-pivot");
      if (options.target === r) cell.classList.add("ge-target");
      if (options.source === r) cell.classList.add("ge-source");
      place(cell, r + 1, first + c);
    });
  });
  place(element("div", "ge-brackets"), 1, first, rows, cols);
  if (options.augmented && cols >= 2) place(element("div", "ge-aug-bar"), 1, first + cols - 1, rows);
  return grid;
}

function initPage(): void {
  const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const sizeSelect   = byId<HTMLSelectElement>("ge-size");
  const augmentedBox = byId<HTMLInputElement>("ge-augmented");
  const goalButtons  = [...document.querySelectorAll<HTMLInputElement>("input[name=ge-goal]")];
  const current      = byId<HTMLDivElement>("ge-current");
  const status       = byId<HTMLDivElement>("ge-status");
  const form         = byId<HTMLFormElement>("ge-form");
  const kindRadios   = [...document.querySelectorAll<HTMLInputElement>("input[name=ge-kind]")];
  const preview      = byId<HTMLParagraphElement>("ge-preview");
  const errorText    = byId<HTMLParagraphElement>("ge-error");
  const undoButton   = byId<HTMLButtonElement>("ge-undo");
  const restartButton = byId<HTMLButtonElement>("ge-restart");
  const hintButton   = byId<HTMLButtonElement>("ge-hint");
  const hintBox      = byId<HTMLDivElement>("ge-hint-box");
  const stepsList    = byId<HTMLOListElement>("ge-steps");
  const stepCount    = byId<HTMLSpanElement>("ge-step-count");
  const ownText      = byId<HTMLTextAreaElement>("ge-own-text");
  const ownError     = byId<HTMLParagraphElement>("ge-own-error");
  const ownDialog    = byId<HTMLDialogElement>("ge-own-dialog");
  const chooseBox    = byId<HTMLInputElement>("ge-task-choose");
  const computeBox   = byId<HTMLInputElement>("ge-task-compute");
  const recognizeBox = byId<HTMLInputElement>("ge-task-recognize");
  const recognizeLabel = byId<HTMLSpanElement>("ge-task-recognize-label");
  const rowEntry     = byId<HTMLDivElement>("ge-row-entry");
  const rowEntryCells = byId<HTMLDivElement>("ge-row-entry-cells");
  const revealButton = byId<HTMLButtonElement>("ge-reveal");
  const checkStepButton = byId<HTMLButtonElement>("ge-check-step");
  const checkAllButton = byId<HTMLButtonElement>("ge-check-all");
  const formTitle    = byId<HTMLHeadingElement>("ge-form-title");
  const currentTilde = byId<HTMLSpanElement>("ge-current-tilde");
  const stepsHeader  = document.querySelector<HTMLDivElement>(".ge-steps-header")!;
  const workspace    = byId<HTMLDivElement>("ge-workspace");
  const nextTitle    = byId<HTMLSpanElement>("ge-next-title");
  const nextMissing  = byId<HTMLSpanElement>("ge-next-missing");
  const nextMatrix   = byId<HTMLDivElement>("ge-next-matrix");
  const nextStatus   = byId<HTMLDivElement>("ge-next-status");
  const nextBox      = document.querySelector<HTMLDivElement>(".ge-next")!;
  const kindPills    = document.querySelector<HTMLElement>(".ge-kinds")!;
  const givenBox     = byId<HTMLDivElement>("ge-given");
  const givenOp      = byId<HTMLParagraphElement>("ge-given-op");
  const applyButton  = byId<HTMLButtonElement>("ge-apply");
  const cancelEditButton = byId<HTMLButtonElement>("ge-cancel-edit");
  const hintCount    = byId<HTMLSpanElement>("ge-hint-count");
  // The current matrix sticks to the top of the window (see the page's CSS). A sentinel just above
  // it shows when it's stuck, to add a shadow separating it from the form scrolling under it.
  const sentinel = element("div");
  workspace.before(sentinel);
  new IntersectionObserver(([entry]) => workspace.classList.toggle("ge-stuck", !entry.isIntersecting)).observe(sentinel);
  // Each kind of operation's fields, by data-kind, with their row selects and multiplier inputs.
  const fields = (kind: string) => form.querySelector<HTMLElement>(`.ge-fields[data-kind=${kind}]`)!;
  const rowSelect = (kind: string, name: string) => fields(kind).querySelector<HTMLSelectElement>(`select[name=${name}]`)!;
  const multiplier = (kind: string) => fields(kind).querySelector<HTMLInputElement>("input[name=c]")!;

  let start: Matrix = [];
  let augmented = true;
  let goal: Goal = "RREF";
  // Each step's operation and resulting matrix. In compute mode, `entered` is the new row the
  // student typed, which is used as is (right or wrong), as on paper; see stepIsRight.
  interface Step { op: Op; m: Matrix; entered?: Fraction[] }
  let steps: Step[] = [];
  let checkedThrough = 0;   // The steps marked right or wrong by "Check all steps"
  let editing: number | null = null;  // The step being edited, if any
  // The practice tasks: choosing the row operations, and computing the new rows. At least one is
  // on. When the student doesn't choose the operations, the page gives the next step of the
  // standard algorithm (see nextStep), and the student computes the new row.
  let chooseOps = true;
  let computeRows = false;
  // A third task: recognizing when the goal is reached. Then the page doesn't say whether the
  // matrix is in REF or RREF until the student declares it is ("It's in RREF"). It needs the
  // student to choose the operations: if the page gave them, running out would give it away.
  let recognize = false;
  let declaredAt = "";      // The state (see workKey) in which the student correctly declared the goal
  let notYetAt = "";        // The state in which the student declared too early, to say "Not yet"
  let hintsUsed = 0;        // For the current matrix
  const matrix = () => steps.at(-1)?.m ?? start;
  const matrixBefore = (n: number) => n === 0 ? start : steps[n - 1].m;
  // The matrix the form's operation applies to: the current one, or the one before the step being
  // edited.
  const formBase = () => editing === null ? matrix() : matrixBefore(editing);

  // ⋘──────── URL ────────⋙

  function saveToUrl(): void {
    const params = new URLSearchParams();
    params.set("m", start.map(row => row.map(plain).join(",")).join(";"));
    if (!augmented) params.set("aug", "0");
    if (goal !== "RREF") params.set("goal", goal);
    if (computeRows) params.set("compute", "1");
    if (!chooseOps) params.set("choose", "0");
    if (recognize) params.set("recognize", "1");
    if (hintsUsed > 0) params.set("hints", `${hintsUsed}`);
    if (steps.length > 0) params.set("ops", steps.map(encodeStep).join(","));
    // URLSearchParams escapes these, but they're legal in a query and easier to read.
    const query = params.toString().replace(/%2C/g, ",").replace(/%3B/g, ";").replace(/%2F/g, "/").replace(/%3A/g, ":");
    history.replaceState(null, "", `${location.pathname}?${query}`);
  }

  // Loads the matrix and steps from the URL. Returns false if there's no valid matrix there.
  function loadFromUrl(): boolean {
    const params = new URLSearchParams(location.search);
    goal = params.get("goal") === "REF" ? "REF" : "RREF";
    computeRows = params.get("compute") === "1";
    recognize = params.get("recognize") === "1";
    chooseOps = params.get("choose") !== "0" || !computeRows;  // At least one task is on
    if (!chooseOps) recognize = false;
    hintsUsed = Math.max(0, Math.floor(Number(params.get("hints")) || 0));
    const text = params.get("m");
    if (!text) return false;
    const rowsText = text.split(";").map(row => row.split(",").map(parseEntry));
    if (rowsText.some(row => row.includes(null) || row.length !== rowsText[0].length)) return false;
    start = (rowsText as Fraction[][]).map(row => row.map(reduce));
    if (start.length > MAX_SIZE || start[0].length > MAX_SIZE) return false;
    augmented = params.get("aug") !== "0" && start[0].length >= 2;
    steps = [];
    for (const code of (params.get("ops") ?? "").split(",").filter(s => s !== "")) {
      const [opCode, rowCode] = code.split(":");
      const op = decodeOp(opCode);
      if (!op || opProblem(op, start.length)) break;
      const entered = rowCode?.split("_").map(parseEntry);
      if (op.kind !== "swap" && entered?.length === start[0].length && !entered.includes(null)) {
        pushStep(op, (entered as Fraction[]).map(reduce));
      } else {
        pushStep(op);
      }
    }
    return true;
  }

  // ⋘──────── The operation form ────────⋙

  // The kind of operation chosen, if any. None is chosen when the page opens or after a step.
  const kind = () => kindRadios.find(radio => radio.checked)?.value ?? null;
  // Clicking the chosen kind again unselects it. Radio buttons don't do that on their own, so the
  // chosen kind is remembered to tell when that happens.
  let pickedKind: string | null = null;
  const clearKind = () => {
    kindRadios.forEach(radio => { radio.checked = false; });
    pickedKind = null;
  };

  function fillRowSelects(): void {
    const rows = start.length;
    for (const select of form.querySelectorAll<HTMLSelectElement>("select")) {
      const value = Number(select.value) || 0;
      select.replaceChildren(...[...Array(rows).keys()].map(r => {
        const option = element("option", "", `R${r + 1}`);
        option.value = `${r}`;
        return option;
      }));
      select.value = `${Math.min(value, rows - 1)}`;
    }
    // Default to different rows for the operations that need two.
    for (const k of ["replace", "swap"]) {
      if (rowSelect(k, "i").value === rowSelect(k, "j").value) rowSelect(k, "i").value = `${Math.min(1, rows - 1)}`;
    }
  }

  // The operation in the form, or a message about what's missing.
  function formOp(): Op | string {
    const k = kind();
    if (!k) return chooseOps ? "Choose Replace, Scale, or Swap." : `No more steps: the matrix is in ${goal}.`;
    const row = (name: string) => Number(rowSelect(k, name).value);
    if (k === "swap") return { kind: "swap", i: row("i"), j: row("j") };
    const text = multiplier(k).value;
    if (text.trim() === "") return "Enter a multiplier.";
    const c = parseEntry(text);
    if (!c) return `“${text}” isn't a number. Enter an integer, decimal, or fraction like −3 or 1/2.`;
    return k === "scale" ? { kind: "scale", i: row("i"), c: reduce(c) } : { kind: "replace", i: row("i"), j: row("j"), c: reduce(c) };
  }

  // Shows the form's kind of operation, and previews it: the rows involved are highlighted, and
  // the new row is shown.
  function updateForm(): void {
    // When the page chooses the operations, the given step is written as a sentence instead.
    for (const k of ["replace", "scale", "swap"]) fields(k).hidden = k !== kind() || !chooseOps;
    kindPills.hidden = !chooseOps;
    givenBox.hidden = chooseOps;
    preview.hidden = !chooseOps;
    if (!chooseOps) {
      const given = formOp();
      givenOp.innerHTML = typeof given === "string" ? given
        : given.kind === "swap" ? `Given the row operation ${opLabel(given)}, rows ${given.i + 1} and ${given.j + 1} trade places.`
        : `Given the row operation ${opLabel(given)}, the new values of row ${given.i + 1} are`;
    }
    // Each "Ri" written after the arrow repeats the row chosen before it.
    for (const echo of form.querySelectorAll<HTMLElement>(".ge-echo")) {
      echo.innerHTML = R(Number(rowSelect(echo.dataset.kind!, "i").value));
    }
    errorText.textContent = "";
    errorText.classList.remove("ge-ok");
    const op = formOp();
    const problem = typeof op === "string" ? op : opProblem(op, start.length);
    if (typeof op === "string" || problem) {
      preview.textContent = typeof op === "string" && op === "Enter a multiplier." ? "" : problem ?? "";
      preview.classList.add("ge-preview-problem");
      renderRowEntry(null);
      setApplyReady(typeof op === "string" ? op : problem!);
      renderCurrent();
      renderNext();
      return;
    }
    preview.classList.remove("ge-preview-problem");
    const after = applyOp(formBase(), op);
    const rowText = (r: number) => {
      const entries = after[r].map(formatFraction);
      if (augmented) entries.splice(entries.length - 1, 0, "|");
      return `[ ${entries.join("  ")} ]`;
    };
    // When the student computes the new rows, the preview mustn't give them away.
    preview.innerHTML = op.kind === "swap" ? `${opLabel(op)}: rows ${op.i + 1} and ${op.j + 1} trade places.`
      : computeRows ? `${opLabel(op)}: enter the new row ${op.i + 1} below.`
      : `${opLabel(op)}: the new row ${op.i + 1} is ${rowText(op.i)}.`;
    renderRowEntry(op);
    // When the student computes the new row, it needs every entry before it can be applied.
    const entriesReady = !computeRows || op.kind === "swap"
      || rowInputs.every(input => input.value.trim() !== "" && parseEntry(input.value) !== null);
    setApplyReady(entriesReady ? null : "Enter every entry of the new row.");
    // "Check" also needs the whole row ("Show" doesn't).
    checkStepButton.disabled = !entriesReady;
    checkStepButton.title = entriesReady ? "Check the new row (counts as a hint)" : "Enter every entry of the new row to check it.";
    renderCurrent();
    renderNext();
  }

  // "Apply" is enabled once the step is fully entered; otherwise its tooltip says what's missing.
  function setApplyReady(missing: string | null): void {
    applyButton.disabled = missing !== null;
    applyButton.title = missing ?? "";
  }

  // The whole next step, as it will look in the steps: "∼", the new matrix with the changed row
  // unsimplified (like "3 − 2(−1)"), and the operation. Parts not chosen yet are placeholders, and a
  // note says what's missing. The unsimplified row shows the setup, not the arithmetic, so it's
  // shown in both modes.
  function renderNext(): void {
    const k = kind();
    const base = formBase();
    const title = editing === null ? "Next step preview" : `Step ${editing + 1} preview, as edited`;
    // Until an operation is chosen, the preview is just the current matrix, so it's grayed out.
    nextBox.classList.toggle("ge-next-empty", !k);
    if (!k) {
      nextTitle.textContent = title;
      nextMissing.textContent = chooseOps ? "Choose a row operation" : `No more steps: the matrix is in ${goal}.`;
      nextStatus.hidden = true;
      nextMatrix.replaceChildren(matrixElement(base, { augmented, labels: true, className: "ge-large ge-next-preview" }));
      return;
    }
    const i = Number(rowSelect(k, "i").value);
    const j = k === "scale" ? i : Number(rowSelect(k, "j").value);
    const text = k === "swap" ? "" : multiplier(k).value.trim();
    const c = text === "" ? null : parseEntry(text);
    const missing: string[] = [];
    if (k !== "swap" && text === "") missing.push("a multiplier");
    if (k !== "swap" && text !== "" && !c) missing.push("a multiplier that's a number, like −3 or 1/2");
    if (k !== "scale" && i === j) missing.push("two different rows");
    const multiplierText = c ? SCALAR(coefficient(reduce(c))) : MISSING("c");

    let shown = base;
    const html = new Map<number, string[]>();
    let label: string;
    if (k === "swap") {
      label = `${R(i)} ↔ ${R(j)}`;
      if (i !== j) shown = applyOp(base, { kind: "swap", i, j });
    } else if (k === "scale") {
      label = `${R(i)} → ${multiplierText}${R(i)}`;
      html.set(i, base[i].map(x => scaleExpression(x, c && reduce(c))));
    } else {
      if (c) {
        const negative = reduce(c).num < 0n;
        const coef = coefficient(negative ? neg(reduce(c)) : reduce(c));
        // "R₂ → R₂ − 2R₁", or "R₂ → R₂ − R₁" (with a space after the sign when there's no coefficient).
        label = `${R(i)} → ${R(i)} ${SCALAR(`${negative ? "−" : "+"}${coef === "" ? "" : ` ${coef}`}`)}${coef === "" ? " " : ""}${ADDED(R(j))}`;
      } else {
        label = `${R(i)} → ${R(i)} + ${multiplierText}${ADDED(R(j))}`;
      }
      if (i !== j) html.set(i, base[i].map((x, col) => replaceExpression(x, base[j][col], c && reduce(c))));
    }
    // When the student computes the new row, the preview shows only what they've entered ("?" for
    // entries not entered yet), not the unsimplified row.
    let entered: (Fraction | null)[] | null = null;
    if (computeRows && k !== "swap" && (k === "scale" || i !== j)) {
      entered = base[i].map((_, col) => {
        const text = rowEntry.hidden ? "" : rowInputs[col]?.value.trim() ?? "";
        const x = text === "" ? null : parseEntry(text);
        return x && reduce(x);
      });
      html.set(i, entered.map(x => x ? formatFraction(x) : MISSING("?")));
      if (entered.includes(null)) missing.push("the new row's entries");
    }
    // The status after the step, once the step is fully chosen: the operation's result, or with
    // the row the student entered.
    nextStatus.hidden = missing.length > 0 || (k !== "swap" && !c) || hidingForm();
    if (!nextStatus.hidden) {
      const op: Op = k === "swap" ? { kind: "swap", i, j }
        : k === "scale" ? { kind: "scale", i, c: reduce(c!) } : { kind: "replace", i, j, c: reduce(c!) };
      nextStatus.hidden = opProblem(op, start.length) !== null;
      if (!nextStatus.hidden) {
        const after = applyOp(base, op);
        if (entered) after[i] = entered as Fraction[];
        nextStatus.replaceChildren(statusElement(after, "next"));
      }
    }
    nextTitle.innerHTML = `${title}: ${label}`;
    nextMissing.textContent = missing.length === 0 ? "" : `Still needed: ${missing.join(" and ")}.`;
    nextMatrix.replaceChildren(matrixElement(shown, {
      augmented,
      labels: true,
      target: k === "swap" && i !== j ? j : i,
      source: k === "scale" || i === j ? undefined : k === "swap" ? i : j,
      html,
      className: "ge-large ge-next-preview",
    }));
  }

  // ⋘──────── Computing the new row (in compute mode) ────────⋙

  let rowInputs: HTMLInputElement[] = [];
  let rowEntryKey = "";  // Which row the inputs are for, so typed entries survive other changes

  // Shows a box for each entry of the row the operation changes (not for swaps).
  function renderRowEntry(op: Op | null): void {
    const show = computeRows && op !== null && op.kind !== "swap";
    rowEntry.hidden = !show;
    if (!show) return;
    const key = `${op.kind}:${op.i}:${editing ?? "end"}:${steps.length}:${start[0].length}:${augmented}:${chooseOps}`;
    if (key === rowEntryKey) return;
    rowEntryKey = key;
    rowInputs = start[0].map((_, c) => {
      const input = element("input", "ge-entry");
      input.type = "text";
      input.inputMode = "decimal";  // A number keyboard on phones (see the "−" and "/" keys)
      input.autocomplete = "off";
      input.spellcheck = false;
      input.setAttribute("aria-label", `New row ${op.i + 1}, column ${c + 1}`);
      input.addEventListener("input", () => input.classList.remove("ge-right", "ge-wrong"));
      return input;
    });
    const label = element("span", "ge-row-entry-label");
    label.innerHTML = chooseOps ? `New ${R(op.i)} =` : `${R(op.i)} =`;
    const cells: HTMLElement[] = [label, element("span", "ge-bracket", "[")];
    rowInputs.forEach((input, c) => {
      if (augmented && c === rowInputs.length - 1) cells.push(element("span", "ge-bar", "|"));
      cells.push(input);
    });
    cells.push(element("span", "ge-bracket", "]"));
    rowEntryCells.replaceChildren(...cells);
  }

  // Marks each entered entry right or wrong. Returns the (zero-based) columns of the wrong ones.
  function checkRowEntry(op: Op): number[] {
    const expected = applyOp(formBase(), op)[op.i];
    const wrong: number[] = [];
    rowInputs.forEach((input, c) => {
      const x = input.value.trim() === "" ? null : parseEntry(input.value);
      const right = x !== null && equals(reduce(x), expected[c]);
      input.classList.toggle("ge-right", right);
      input.classList.toggle("ge-wrong", !right);
      if (!right) wrong.push(c);
    });
    return wrong;
  }

  // A step from a matrix: the operation applied exactly, or with the row the student entered.
  function makeStep(op: Op, base: Matrix, entered?: Fraction[]): Step {
    const m = applyOp(base, op);
    if (entered) m[op.i] = entered;
    return { op, m, entered };
  }

  const pushStep = (op: Op, entered?: Fraction[]) => steps.push(makeStep(op, matrix(), entered));

  // Redoes the steps from step n on, after an earlier step changed. Their operations are kept, and
  // rows the student entered are kept as entered, as when changing an earlier line on paper.
  function replayFrom(n: number): void {
    for (let k = n; k < steps.length; k++) {
      steps[k] = makeStep(steps[k].op, matrixBefore(k), steps[k].entered);
    }
  }

  // Whether a step's entered row (if any) is what its operation gives.
  function stepIsRight(n: number): boolean {
    const { op, entered } = steps[n];
    if (!entered) return true;
    return applyOp(matrixBefore(n), op)[op.i].every((x, c) => equals(x, entered[c]));
  }

  // A step for the URL: the operation, and the entered row after ":" (entries separated by "_").
  const encodeStep = (step: Step) =>
    encodeOp(step.op) + (step.entered ? `:${step.entered.map(plain).join("_")}` : "");

  function applyForm(): void {
    const op = formOp();
    const problem = typeof op === "string" ? op : opProblem(op, start.length);
    if (typeof op === "string" || problem) {
      errorText.textContent = typeof op === "string" ? op : problem!;
      return;
    }
    let entered: Fraction[] | undefined;
    if (computeRows && op.kind !== "swap") {
      // The student's row is applied as is, without checking it (see "Check").
      const values = rowInputs.map(input => input.value.trim() === "" ? null : parseEntry(input.value));
      if (values.includes(null)) {
        errorText.textContent = rowInputs.some(input => input.value.trim() === "")
          ? "Enter every entry of the new row."
          : "Each entry must be a number, like −3, 0.5, or 1/2.";
        return;
      }
      entered = (values as Fraction[]).map(reduce);
    }
    if (editing !== null) {
      // Replace the step, and redo the steps after it. Checks of those steps no longer apply.
      steps[editing] = makeStep(op, matrixBefore(editing), entered);
      replayFrom(editing + 1);
      checkedThrough = Math.min(checkedThrough, editing);
      stopEditing();
      animateApplied(op);
      return;
    }
    pushStep(op, entered);
    if (op.kind !== "swap") multiplier(op.kind).value = "";
    clearKind();
    hintBox.hidden = true;
    refresh();
    animateApplied(op);
    kindRadios[0].focus();
  }

  // A brief animation when a step is applied: the current matrix (the new last line) slides into
  // place, and the rows the step changed flash. The classes are added to the elements just drawn;
  // redrawing (as the student starts the next step) simply removes them.
  function animateApplied(op: Op): void {
    const rows = op.kind === "swap" ? [op.i, op.j] : [op.i];
    current.querySelector(".ge-matrix")?.classList.add("ge-arrive");
    for (const r of rows) {
      for (const cell of current.querySelectorAll<HTMLElement>(`.ge-cell[data-row="${r}"]`)) cell.classList.add("ge-flash");
    }
  }

  // ⋘──────── Rendering ────────⋙

  // The current matrix (or, when editing a step, the matrix before it), with the rows chosen in
  // the form highlighted. It's the last line of the steps, so it starts with "∼" (unless
  // it's the starting matrix), and its caption is the operation that produced it.
  function renderCurrent(): void {
    const m = formBase();
    const { target, source } = formRows();
    const shownStep = editing === null ? steps.length - 1 : editing - 1;  // −1 for the start
    const caption = element("div", "ge-current-op");
    if (editing !== null) {
      caption.append(element("span", "ge-current-caption", `Before step ${editing + 1}:`));
    } else if (shownStep < 0) {
      caption.append(element("span", "ge-note", "Start"));
    } else {
      const label = element("span");
      label.innerHTML = `Step ${shownStep + 1}: ${opLabel(steps[shownStep].op)}`;
      caption.append(label, editButton(shownStep));
      const mark = stepMark(shownStep);
      if (mark) caption.append(mark);
    }
    currentTilde.textContent = shownStep >= 0 ? "∼" : "";
    current.replaceChildren(caption, matrixElement(m, {
      augmented,
      labels : true,
      leading: analyze(m).leading,
      target,
      source,
      className: "ge-large",
    }));
  }

  // A button to edit step n.
  function editButton(n: number): HTMLButtonElement {
    const edit = element("button", "ge-edit", n === editing ? "Editing" : "Edit");
    edit.type = "button";
    edit.disabled = n === editing;
    edit.setAttribute("aria-label", `Edit step ${n + 1}`);
    edit.addEventListener("click", () => startEditing(n));
    return edit;
  }

  // After "Check all steps", a mark for step n's entered row: ✓, or ✗ with the right row.
  function stepMark(n: number): HTMLSpanElement | null {
    const { op, entered } = steps[n];
    if (!entered || n >= checkedThrough) return null;
    if (stepIsRight(n)) return element("span", "ge-step-right", "✓");
    const correct = applyOp(matrixBefore(n), op)[op.i].map(formatFraction);
    if (augmented) correct.splice(correct.length - 1, 0, "|");
    return element("span", "ge-step-wrong", `✗ Row ${op.i + 1} should be [ ${correct.join("  ")} ]`);
  }

  // A small, expandable status: a one-line verdict for a matrix, and on expanding, the
  // conditions (and, for the current matrix, what to work on next). `open` remembers whether the
  // student expanded it, across redrawing.
  const statusOpen = { current: false, next: false };
  function statusElement(m: Matrix, which: "current" | "next"): HTMLDetailsElement {
    const a = analyze(m);
    const reached = a.form === "RREF" || (goal === "REF" && a.form === "REF");
    // Reaching the goal with a mistake in an entered row isn't done: the result isn't the RREF (or
    // REF) of the starting matrix. Which step has the mistake is left for the student to find.
    const mistaken = which === "current" && editing === null && reached
      && steps.some((step, n) => step.entered !== undefined && !stepIsRight(n));
    const done = which === "current" && editing === null && reached && !mistaken;
    const form = a.form === "RREF" ? "in RREF" : a.form === "REF" ? "in REF, but not RREF" : "not yet in REF";
    const ops = steps.length === 1 ? "1 step" : `${steps.length} steps`;
    const summary = element("summary", "", done ? `✓ Done: ${form}${steps.length > 0 ? ` after ${ops}` : ""}`
      : mistaken ? `⚠ ${form[0].toUpperCase() + form.slice(1)}, but check your work`
      : form[0].toUpperCase() + form.slice(1));
    const details = element("details", `ge-mini-status ge-status-${done ? "done" : mistaken ? "mistake" : a.form.toLowerCase()}`);
    details.open = statusOpen[which];
    details.addEventListener("toggle", () => { statusOpen[which] = details.open; });
    details.append(summary);
    if (which === "current") {
      details.append(element("p", "", mistaken
        ? `At least one of the rows you computed has a mistake, so this isn't the ${goal} of the starting `
          + "matrix. Use “Check all steps” to find it, then edit that step."
        : done
        ? (goal === "REF" && a.form !== "RREF" ? "Keep going (Gauss–Jordan elimination) to reach RREF." : "Nice work!")
        : a.form === "REF"
          ? "Next: make each leading entry 1, and the entries above the leading entries 0."
          : "Next: get the leading entries into a staircase, with 0s below them."));
    }
    const list = element("ul", "ge-checklist");
    CONDITIONS.forEach((text, i) => {
      if (goal === "REF" && i >= REF_CONDITIONS) return;
      const ok = a.violations[i].length === 0;
      const item = element("li", ok ? "ge-pass" : "ge-fail");
      item.append(element("span", "ge-check", ok ? "✓" : "✗"), element("span", "", `${i + 1}. ${text}`));
      list.append(item);
    });
    details.append(list);
    return details;
  }

  // The status of the matrix shown beside the latest step (or before the step being edited).
  function renderStatus(): void {
    // When the student recognizes the goal themselves, the status is replaced by a button to
    // declare it, until they do so correctly.
    if (hidingForm()) {
      status.replaceChildren(declareBox(), checkAllButton);
      return;
    }
    // "Check all steps" sits under this status (it's shown when there are computed rows to check).
    status.replaceChildren(statusElement(formBase(), "current"), checkAllButton);
    if (SHOW_SHARE_BUTTON && cleanFinish()) status.append(shareBox());
    // After finishing with the page doing the arithmetic, suggest computing the rows next time.
    const a = analyze(matrix());
    const finished = editing === null && (a.form === "RREF" || (goal === "REF" && a.form === "REF"));
    if (finished && !computeRows && steps.length > 0) {
      const suggestion = element("p", "ge-suggestion", "Ready for more? Try computing each new row yourself. ");
      const button = element("button", "", "New matrix, computing the rows myself");
      button.type = "button";
      button.addEventListener("click", () => {
        computeRows = true;
        rowEntryKey = "";
        newRandomMatrix();
      });
      suggestion.append(button);
      status.append(suggestion);
    }
  }

  // ⋘──────── Sharing a result ────────⋙

  // Whether the student has finished with no mistakes in their computed rows (and, when
  // recognizing the goal, has said so).
  function cleanFinish(): boolean {
    return editing === null && steps.length > 0 && goalReached(matrix()) && !hidingForm()
      && !steps.some((step, n) => step.entered !== undefined && !stepIsRight(n));
  }

  // A summary of the result, like "I row reduced a 3 × 4 matrix to RREF in 8 steps with 2 hints
  // (choosing the row operations and computing the rows) on Gaussian Elimination Practice."
  function resultText(): string {
    const count = (n: number, noun: string) => `${n} ${noun}${n === 1 ? "" : "s"}`;
    const tasks = [
      chooseOps ? "choosing the row operations" : "",
      computeRows ? "computing the rows" : "",
      recognize ? `recognizing ${goal}` : "",
    ].filter(task => task !== "");
    return `I row reduced a ${start.length} × ${start[0].length} matrix to ${goal} in ${count(steps.length, "step")} `
      + `with ${count(hintsUsed, "hint")} (${joinAnd(tasks)}) on Gaussian Elimination Practice.`;
  }

  // "Share result": the summary and a link to the work (the page's URL holds the matrix, steps,
  // and settings). Uses the device's share menu if there is one, or else copies to the clipboard.
  function shareBox(): HTMLElement {
    const box = element("p", "ge-share");
    const button = element("button", "", "Share result");
    button.type = "button";
    const feedback = element("span", "ge-share-feedback");
    feedback.setAttribute("role", "status");
    button.addEventListener("click", async () => {
      const text = resultText();
      const url = location.href;
      if (navigator.share) {
        try {
          await navigator.share({ title: "Gaussian Elimination Practice", text, url });
        } catch { /* The student closed the share menu */ }
        return;
      }
      // If copying fails (or a browser leaves it waiting, e.g., on a permission prompt), show the
      // text to copy by hand instead.
      const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 1500));
      try {
        await Promise.race([navigator.clipboard.writeText(`${text} ${url}`), timeout]);
        feedback.textContent = "Copied the result and a link to your work.";
      } catch {
        feedback.textContent = `Copy this: ${text} ${url}`;
      }
    });
    box.append(button, feedback);
    return box;
  }

  // ⋘──────── Recognizing the goal ────────⋙

  // The current work, to tell whether a declaration still applies after more steps or edits.
  const workKey = () => [start.map(row => row.map(plain).join(",")).join(";"), goal, ...steps.map(encodeStep)].join("|");
  const goalReached = (m: Matrix) => {
    const form = analyze(m).form;
    return form === "RREF" || (goal === "REF" && form === "REF");
  };
  // Whether the page is keeping quiet about the form (until the student correctly declares it).
  const hidingForm = () => recognize && declaredAt !== workKey();

  function declareBox(): HTMLElement {
    const box = element("div", "ge-declare");
    box.append(element("span", "", `Is it in ${goal}?`));
    const button = element("button", "", `It's in ${goal}`);
    button.type = "button";
    button.title = `Decide for yourself when the matrix is in ${goal}. Saying so too early counts as a hint.`;
    button.disabled = editing !== null;
    button.addEventListener("click", () => {
      if (goalReached(matrix())) {
        declaredAt = workKey();
        refresh();
      } else {
        // Saying so too early tells the student something, so it counts as a hint.
        countHint("declared too early", workKey());
        notYetAt = workKey();
        renderStatus();
      }
    });
    box.append(button);
    if (notYetAt === workKey()) {
      box.append(element("p", "ge-declare-wrong", `Not yet: this matrix isn't in ${goal}. Keep going.`));
    }
    return box;
  }

  // The work so far, one line per step as on paper: "∼", the matrix, and the operation that
  // produced it. The first line is the starting matrix. The last matrix is shown below the list,
  // larger (see renderCurrent), except while editing, when the list shows every step.
  function renderSteps(): void {
    const leading = (m: Matrix) => analyze(m).leading;
    const shown = editing === null ? steps.length - 1 : steps.length;  // Steps in the list
    const items: HTMLElement[] = [];
    if (shown >= 0) {
      const startItem = element("li", "ge-step");
      startItem.append(element("span", "ge-tilde"), matrixElement(start, { augmented, leading: leading(start), className: "ge-small" }),
        element("span", "ge-op", "Start"));
      items.push(startItem);
    }
    steps.slice(0, Math.max(0, shown)).forEach(({ op, m }, n) => {
      const item = element("li", "ge-step");
      const label = element("span", "ge-op");
      label.innerHTML = opLabel(op);
      item.append(element("span", "ge-tilde", "∼"), matrixElement(m, { augmented, leading: leading(m), className: "ge-small" }), label, editButton(n));
      item.classList.toggle("ge-step-editing", n === editing);
      const mark = stepMark(n);
      if (mark) item.append(mark);
      items.push(item);
    });
    checkAllButton.hidden = !steps.some(step => step.entered);
    stepsList.replaceChildren(...items);
    stepsHeader.hidden = steps.length === 0;
    stepCount.textContent = steps.length === 0 ? "" : `(${steps.length})`;
  }

  // The rows chosen in the form, to highlight in the current matrix as soon as they're chosen
  // (before the multiplier is entered): the row that changes, and the row added to it (or, for a
  // swap, the other row).
  function formRows(): { target?: number; source?: number } {
    const k = kind();
    if (!k) return {};
    const i = Number(rowSelect(k, "i").value);
    if (k === "scale") return { target: i };
    const j = Number(rowSelect(k, "j").value);
    return i === j ? { target: i } : { target: i, source: j };
  }

  // ⋘──────── Editing a step ────────⋙

  // Loads a step into the form to change it. The form then applies to the matrix before the step.
  function startEditing(n: number): void {
    editing = n;
    const { op, entered } = steps[n];
    for (const radio of kindRadios) radio.checked = radio.value === op.kind;
    pickedKind = op.kind;
    rowSelect(op.kind, "i").value = `${op.i}`;
    if (op.kind !== "scale") rowSelect(op.kind, "j").value = `${op.j}`;
    if (op.kind !== "swap") multiplier(op.kind).value = plain(op.c);
    hintBox.hidden = true;
    rowEntryKey = "";
    refresh();
    if (entered && computeRows) entered.forEach((x, c) => { rowInputs[c].value = plain(x); });
    form.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function stopEditing(): void {
    editing = null;
    clearKind();
    for (const k of ["replace", "scale"]) multiplier(k).value = "";
    rowEntryKey = "";
    refresh();
  }

  function refresh(): void {
    saveToUrl();
    if (editing !== null && editing >= steps.length) editing = null;
    undoButton.disabled = restartButton.disabled = steps.length === 0 || editing !== null;
    hintButton.disabled = editing !== null;
    applyButton.textContent = editing === null ? "Apply" : `Update step ${editing + 1}`;
    cancelEditButton.hidden = editing === null;
    for (const radio of goalButtons) radio.checked = radio.value === goal;
    chooseBox.checked = chooseOps;
    computeBox.checked = computeRows;
    // The last task that's on can't be turned off.
    chooseBox.disabled = chooseOps && !computeRows;
    recognizeBox.checked = recognize;
    recognizeBox.disabled = !chooseOps;  // Needs the student to choose the operations
    recognizeBox.title = chooseOps ? "" : "Needs “Choose row operations”";
    recognizeLabel.textContent = `Recognize when it's in ${goal}`;
    computeBox.disabled = computeRows && !chooseOps;
    // When the page chooses the operations, the form shows the next one, locked.
    if (!chooseOps) fillGivenOp();
    for (const control of form.querySelectorAll<HTMLInputElement | HTMLSelectElement>(".ge-kinds input, .ge-fields select, .ge-fields input")) {
      control.disabled = !chooseOps;
    }
    formTitle.textContent = editing !== null ? `Edit step ${editing + 1}` : chooseOps ? "Next row operation" : "Next row operation (given)";
    hintCount.textContent = `Hints used: ${hintsUsed}`;
    // Once the goal is reached, there's no next step to hint at.
    const a = analyze(matrix());
    // (When recognizing the goal, the student has to say it's finished, so Hint stays until then.)
    const finished = (a.form === "RREF" || (goal === "REF" && a.form === "REF")) && !hidingForm();
    hintButton.hidden = finished || !chooseOps;  // No hints needed when the operation is given
    if (finished) hintBox.hidden = true;
    hintButton.setAttribute("aria-expanded", `${!hintBox.hidden}`);
    renderStatus();
    renderSteps();
    updateForm();
  }

  // Puts the next operation of the standard algorithm (or the step being edited) into the form,
  // when the page chooses the operations.
  function fillGivenOp(): void {
    const op = editing !== null ? steps[editing].op : nextStep(matrix(), goal)?.op;
    if (!op) {
      clearKind();
      return;
    }
    for (const radio of kindRadios) radio.checked = radio.value === op.kind;
    pickedKind = op.kind;
    rowSelect(op.kind, "i").value = `${op.i}`;
    if (op.kind !== "scale") rowSelect(op.kind, "j").value = `${op.j}`;
    if (op.kind !== "swap") multiplier(op.kind).value = plain(op.c);
  }

  // Starts over with a new starting matrix.
  function setStart(m: Matrix, isAugmented: boolean): void {
    start = m;
    augmented = isAugmented;
    steps = [];
    checkedThrough = 0;
    editing = null;
    hintsUsed = 0;
    declaredAt = notYetAt = "";
    augmentedBox.checked = augmented;
    hintBox.hidden = true;
    fillRowSelects();
    refresh();
  }

  function newRandomMatrix(): void {
    const [rows, cols] = sizeSelect.value.split("x").map(Number);
    setStart(randomProblem(rows, cols, augmentedBox.checked), augmentedBox.checked);
  }

  // ⋘──────── Controls ────────⋙

  sizeSelect.replaceChildren(...SIZES.map(([rows, cols]) => {
    const option = element("option", "", `${rows} × ${cols}`);
    option.value = `${rows}x${cols}`;
    return option;
  }));
  sizeSelect.value = DEFAULT_SIZE;

  byId("ge-new").addEventListener("click", newRandomMatrix);
  sizeSelect.addEventListener("change", newRandomMatrix);
  // For a typed matrix, the bar only changes how it's drawn; for a random one, it also changes
  // what kind of matrix to make next, so it takes effect right away only by redrawing.
  augmentedBox.addEventListener("change", () => {
    augmented = augmentedBox.checked && start[0].length >= 2;
    refresh();
  });
  for (const radio of goalButtons) {
    radio.addEventListener("change", () => {
      goal = radio.value as Goal;
      hintBox.hidden = true;
      refresh();
    });
  }

  for (const radio of kindRadios) radio.addEventListener("change", updateForm);
  form.querySelector(".ge-kinds")!.addEventListener("click", event => {
    const radio = event.target;
    if (!(radio instanceof HTMLInputElement)) return;
    if (pickedKind === radio.value) {
      clearKind();
      updateForm();
    } else {
      pickedKind = radio.value;
    }
  });
  byId("ge-choose-myself").addEventListener("click", () => {
    chooseBox.checked = true;
    chooseBox.dispatchEvent(new Event("change"));
  });
  for (const box of [chooseBox, computeBox, recognizeBox]) {
    box.addEventListener("change", () => {
      chooseOps = chooseBox.checked;
      computeRows = computeBox.checked;
      if (!chooseOps && !computeRows) chooseOps = true;  // At least one task is on
      recognize = recognizeBox.checked && chooseOps;
      notYetAt = "";
      rowEntryKey = "";
      clearKind();
      for (const k of ["replace", "scale"]) multiplier(k).value = "";
      hintBox.hidden = true;
      refresh();
    });
  }
  revealButton.addEventListener("click", () => {
    const op = formOp();
    if (typeof op === "string" || opProblem(op, start.length) || op.kind === "swap") return;
    applyOp(formBase(), op)[op.i].forEach((x, c) => {
      rowInputs[c].value = plain(x);
      rowInputs[c].classList.remove("ge-right", "ge-wrong");
    });
    countHint("show row", ...steps.map(encodeStep), encodeOp(op));
    updateForm();  // The row is now complete, so "Apply" can be enabled
  });
  form.addEventListener("input", updateForm);

  // In a row menu, typing a row's number selects it. (The browser's own type-to-select matches
  // the start of the options' text, which is "R" for every row.)
  for (const select of form.querySelectorAll<HTMLSelectElement>("select")) {
    select.addEventListener("keydown", event => {
      const n = Number(event.key);
      if (!Number.isInteger(n) || n < 1 || n > start.length) return;
      select.value = `${n - 1}`;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      event.preventDefault();
    });
  }

  // On touch screens, the number keyboard may have no "−" or "/", so a bar with those keys appears
  // while a number box has focus. Pressing a key doesn't take the focus, so the keyboard stays up.
  const keyBar = byId<HTMLDivElement>("ge-keys");
  const isNumberBox = (el: EventTarget | null): el is HTMLInputElement =>
    el instanceof HTMLInputElement && (el.name === "c" || el.classList.contains("ge-entry"));
  let keyTarget: HTMLInputElement | null = null;
  form.addEventListener("focusin", event => {
    if (!isNumberBox(event.target)) return;
    keyTarget = event.target;
    keyBar.classList.add("ge-active");
  });
  form.addEventListener("focusout", event => {
    if (!isNumberBox(event.relatedTarget)) keyBar.classList.remove("ge-active");
  });
  for (const key of keyBar.querySelectorAll<HTMLButtonElement>("button")) {
    key.addEventListener("pointerdown", event => event.preventDefault());
    key.addEventListener("click", () => {
      const input = keyTarget;
      if (!input) return;
      if (key.dataset.key === "minus") {
        // Flips the sign of the number.
        input.value = input.value.trimStart().startsWith("-") || input.value.trimStart().startsWith("−")
          ? input.value.trimStart().slice(1) : `-${input.value.trimStart()}`;
      } else {
        // Inserts a fraction bar where the cursor is.
        const at = input.selectionStart ?? input.value.length;
        input.value = `${input.value.slice(0, at)}/${input.value.slice(input.selectionEnd ?? at)}`;
        input.setSelectionRange(at + 1, at + 1);
      }
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }
  form.addEventListener("change", updateForm);
  form.addEventListener("submit", event => {
    event.preventDefault();
    applyForm();
  });

  cancelEditButton.addEventListener("click", stopEditing);
  undoButton.addEventListener("click", () => {
    steps.pop();
    checkedThrough = Math.min(checkedThrough, steps.length);
    hintBox.hidden = true;
    refresh();
  });
  restartButton.addEventListener("click", () => {
    if (steps.length > 1 && !confirm("Start over from the original matrix? Your steps will be cleared.")) return;
    steps = [];
    checkedThrough = 0;
    hintBox.hidden = true;
    refresh();
  });

  // The hints the student has seen for this matrix and goal, so that seeing the same subgoal again
  // (after hiding it, after a step toward it, or after undoing) isn't counted as another hint.
  const seenHints = new Set<string>();
  // Counts a hint, unless the student has already had this one (identified by `parts`).
  function countHint(...parts: string[]): void {
    const key = [start.map(row => row.map(plain).join(",")).join(";"), goal, ...parts].join("|");
    if (seenHints.has(key)) return;
    seenHints.add(key);
    hintsUsed++;
    hintCount.textContent = `Hints used: ${hintsUsed}`;
    saveToUrl();
  }

  hintButton.addEventListener("click", () => {
    // A second click hides the hint.
    if (!hintBox.hidden) {
      hintBox.hidden = true;
      hintButton.setAttribute("aria-expanded", "false");
      return;
    }
    const hint = nextStep(matrix(), goal);
    hintBox.hidden = false;
    hintButton.setAttribute("aria-expanded", "true");
    if (!hint) {
      // When recognizing the goal, this tells the student they've reached it, so it's a hint.
      if (hidingForm()) countHint("already done", workKey());
      hintBox.replaceChildren(element("p", "", `The matrix is already in ${goal}, so no more steps are needed.`));
      return;
    }
    countHint("subgoal", hint.subgoal);
    // A second, more specific hint, on request (and counted as another hint).
    const more = element("button", "", "More specific hint");
    more.type = "button";
    more.addEventListener("click", () => {
      countHint("specific", hint.specific);
      more.replaceWith(element("p", "", hint.specific));
    });
    hintBox.replaceChildren(element("p", "", `Next goal: ${hint.subgoal}`), more);
  });

  // "Check" marks the entered row right or wrong before it's applied; it counts as a hint
  // (once for each set of entries checked).
  checkStepButton.addEventListener("click", () => {
    const op = formOp();
    if (typeof op === "string" || opProblem(op, start.length) || op.kind === "swap") return;
    countHint("check", ...steps.map(encodeStep), encodeOp(op), ...rowInputs.map(input => input.value.trim()));
    const wrong = checkRowEntry(op).map(c => c + 1);
    errorText.classList.toggle("ge-ok", wrong.length === 0);
    errorText.textContent = wrong.length === 0 ? "✓ All the entries are right."
      : wrong.length === 1 ? `Entry ${wrong[0]} is incorrect.`
      : `Entries ${joinAnd(wrong)} are incorrect.`;
  });

  // "Check all steps" marks every computed row so far right or wrong; it also counts as a hint.
  checkAllButton.addEventListener("click", () => {
    countHint("check all", ...steps.map(encodeStep));
    checkedThrough = steps.length;
    renderSteps();
    updateForm();
  });

  byId("ge-own-use").addEventListener("click", () => {
    const result = parseMatrix(ownText.value);
    if (typeof result === "string") {
      ownError.textContent = result;
      return;
    }
    ownError.textContent = "";
    setStart(result.m, result.augmented);
    ownDialog.close();
  });
  // The dialog starts with the current starting matrix, to edit or type over.
  byId("ge-own-open").addEventListener("click", () => {
    ownText.value = matrixText(start, augmented);
    ownError.textContent = "";
    ownDialog.showModal();
    ownText.select();
  });

  if (loadFromUrl()) {
    augmentedBox.checked = augmented;
    fillRowSelects();
    refresh();
  } else {
    newRandomMatrix();
  }
}

if (typeof document !== "undefined") {
  // Module scripts are deferred, but guard in case the DOM is still loading.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    initPage();
  }
}
