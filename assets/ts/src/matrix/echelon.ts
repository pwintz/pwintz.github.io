// ╭───────────────────────────────────────────────────────────────╮
// │            Row echelon forms: the conditions and rank         │
// ╰───────────────────────────────────────────────────────────────╯
// Checks whether a matrix is in REF or RREF, using the conditions as worded in the lecture notes
// the matrix tools accompany (see ../echelon_form.ts for details), and finds the rank and number
// of solutions of a system in REF. Shared by the matrix tools.

import { Fraction, formatFraction, isOne, isZero } from "./fraction";

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
export const REF_CONDITIONS = 2;  // The first two conditions define REF; RREF requires all four

// ⋘──────── Checking the conditions ────────⋙

// "rows 2, 3, and 5"
export function joinAnd(items: (number | string)[]): string {
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
