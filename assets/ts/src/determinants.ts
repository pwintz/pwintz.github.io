// ╭───────────────────────────────────────────────────────────────╮
// │                          Determinants                          │
// ╰───────────────────────────────────────────────────────────────╯
// The page /tools/determinants/ (collections/_pages/determinants.html): practice problems worked
// in steps (determinants/practice_page.ts), with the parallelogram or parallelepiped spanned by the
// columns of the problem's matrix (determinants/visualizer.ts). The math is in
// determinants/det_math.ts.
//
// One problem: the practice problem is the one drawn. With "Design your own problems", the matrix
// can be typed in the form below the kind of problem, its columns dragged (2 × 2), or an example loaded.

import { setupHelp } from "./common/help";
import { setupPanels } from "./common/panels";
import { loadJSON, saveJSON } from "./common/storage";
import { Fraction, parseEntry, reduce } from "./matrix/fraction";
import { F, Kind, Problem, fracText, fromInts, kindSizes, problemError, randomProblem } from "./determinants/det_math";
import { PIN_KEY, setupPracticePage } from "./determinants/practice_page";
import { setupVisualizer } from "./determinants/visualizer";

// ⋘──────── Examples ────────⋙

const mat = (kind: Exclude<Kind, "props">, rows: number[][]): Problem => ({ kind, A: fromInts(rows) });
const EXAMPLES: Record<string, Problem> = {
  scale: mat("det2", [[3, 0], [0, 2]]),
  shear: mat("det2", [[1, 2], [0, 1]]),
  rotate: mat("det2", [[0, -1], [1, 0]]),
  reflect: mat("det2", [[0, 1], [1, 0]]),
  general2: mat("det2", [[3, 1], [2, 4]]),
  dependent2: mat("det2", [[2, 4], [1, 2]]),
  upper3: mat("tri", [[2, 5, -1], [0, 3, 4], [0, 0, -1]]),
  lower4: mat("tri", [[1, 0, 0, 0], [4, -2, 0, 0], [7, 3, 3, 0], [-5, 8, 6, 2]]),
  zeroDiag: mat("tri", [[4, 7, 2], [0, 0, 5], [0, 0, 3]]),
  noZeros3: mat("cofactor3", [[2, 1, 3], [1, -1, 2], [3, 2, 1]]),
  zeroRow3: mat("cofactor3", [[1, 2, 3], [0, 4, 0], [5, 6, 7]]),
  zeroCol3: mat("cofactor3", [[3, 0, 2], [1, 0, -4], [2, 5, 1]]),
  classic3: mat("cofactor3", [[1, 2, 3], [4, 5, 6], [7, 8, 9]]),
  rrBasic: mat("rowreduce3", [[1, 2, 1], [2, 5, 4], [-1, 1, 6]]),
  rrSwap: mat("rowreduce3", [[0, 1, 2], [1, 3, 1], [2, 4, 3]]),
  rrFractions: mat("rowreduce3", [[2, 1, 3], [1, 2, 1], [3, 1, 2]]),
  rrSingular: mat("rowreduce3", [[1, 2, 3], [4, 5, 6], [7, 8, 9]]),
  four: mat("cofactor4", [[2, 1, 0, 3], [0, 0, 4, 0], [1, -1, 2, 2], [3, 0, 5, 1]]),
  fourCol: mat("cofactor4", [[1, 0, 2, 1], [3, 0, 1, 2], [2, 5, -1, 0], [1, 0, 0, 3]]),
  props3: { kind: "props", n: 3, d: F(5), k: F(2), m: F(3) },
  props2: { kind: "props", n: 2, d: F(-4), k: F(3), m: F(-2) },
  props4: { kind: "props", n: 4, d: F(2), k: F(-1), m: F(5) },
};

const SIZE_KEY = "determinants_tri_size";

function initPage(): void {
  const kindSelect = document.getElementById("dt-kind") as HTMLSelectElement;
  const sizeField = document.getElementById("dt-size-field") as HTMLLabelElement;
  const sizeSelect = document.getElementById("dt-size") as HTMLSelectElement;
  const design = document.getElementById("dt-design") as HTMLDivElement;
  const designError = document.getElementById("dt-design-error") as HTMLParagraphElement;
  const exampleSelect = document.getElementById("dt-example") as HTMLSelectElement;
  sizeSelect.value = `${loadJSON<number>(SIZE_KEY) ?? 3}`;

  // ⋘──────── The design form ────────⋙
  // A matrix of boxes for A, or (for the properties) boxes for n, det A, k, and m.
  let entries: HTMLInputElement[][] = [];
  let fields: Record<string, HTMLInputElement> = {};
  let formShape = "";

  function entry(label: string, onChange = applyDesign): HTMLInputElement {
    const input = document.createElement("input");
    input.className = "dt-design-entry";
    input.inputMode = "decimal";
    input.autocomplete = "off";
    input.setAttribute("aria-label", label);
    input.addEventListener("change", () => onChange());
    input.addEventListener("keydown", e => { if (e.key === "Enter") onChange(); });
    return input;
  }

  function fillDesign(p: Problem): void {
    const shape = p.kind === "props" ? "props" : `${p.kind}-${p.A.length}`;
    if (shape !== formShape) {
      formShape = shape;
      entries = [];
      fields = {};
      if (p.kind === "props") {
        const items = [["n", "Size n"], ["d", "det A"], ["k", "k"], ["m", "m"]].map(([id, text]) => {
          const label = document.createElement("label");
          label.className = "dt-design-item";
          const name = document.createElement("span");
          name.textContent = text;
          fields[id] = entry(text);
          label.append(name, fields[id]);
          return label;
        });
        design.replaceChildren(...items);
      } else {
        const n = p.A.length;
        const item = document.createElement("span");
        item.className = "dt-design-item";
        const name = document.createElement("span");
        name.innerHTML = "<i>A</i> =";
        const bracket = document.createElement("span");
        bracket.className = "dt-bracket";
        bracket.style.gridTemplateColumns = `repeat(${n}, auto)`;
        entries = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => entry(`Row ${i + 1}, column ${j + 1} of A`)));
        bracket.append(...entries.flat());
        item.append(name, bracket);
        design.replaceChildren(item);
      }
    }
    if (p.kind === "props") {
      fields.n.value = `${p.n}`;
      fields.d.value = fracText(p.d);
      fields.k.value = fracText(p.k);
      fields.m.value = fracText(p.m);
    } else {
      p.A.forEach((row, i) => row.forEach((x, j) => { entries[i][j].value = fracText(x); }));
    }
    sizeField.hidden = kindSizes(p.kind as Kind).length < 2 || p.kind === "props";
    if (p.kind === "tri") sizeSelect.value = `${p.A.length}`;
    designError.hidden = true;
  }

  /** The problem in the boxes, if they make one, or a message saying what's wrong. */
  function readDesign(): Problem | string {
    const kind = kindSelect.value as Kind;
    const num = (input: HTMLInputElement, what: string): Fraction => {
      const x = input.value.trim() === "" ? null : parseEntry(input.value);
      if (x === null) throw new Error(`Enter a number like 3, -2, or 1/2 for ${what}.`);
      return reduce(x);
    };
    try {
      let p: Problem;
      if (kind === "props") {
        const n = num(fields.n, "n");
        if (n.den !== 1n) throw new Error("Enter a whole number for n.");
        p = { kind, n: Number(n.num), d: num(fields.d, "det A"), k: num(fields.k, "k"), m: num(fields.m, "m") };
      } else {
        p = { kind, A: entries.map((row, i) => row.map((input, j) => num(input, `row ${i + 1}, column ${j + 1}`))) };
      }
      return problemError(p) ?? p;
    } catch (e) {
      return (e as Error).message;
    }
  }

  function applyDesign(): void {
    const p = readDesign();
    if (typeof p === "string") {
      designError.textContent = p;
      designError.hidden = false;
      return;
    }
    designError.hidden = true;
    loadDesigned(p);
  }

  function loadDesigned(p: Problem): void {
    practice.show(p);
    visualizer.show(p, "custom");
    fillDesign(p);
  }

  const visualizer = setupVisualizer(p => loadDesigned(p));
  const practice = setupPracticePage({
    size: () => Number(sizeSelect.value),
    onLoad(p, mode) {
      visualizer.show(p, mode);
      fillDesign(p);
    },
    onStatus({ finished }) {
      visualizer.setFinished(finished);
    },
  });

  sizeSelect.addEventListener("change", () => {
    saveJSON(SIZE_KEY, Number(sizeSelect.value));
    if (kindSelect.value === "tri") loadDesigned(randomProblem("tri", Math.random, Number(sizeSelect.value)));
  });

  exampleSelect.addEventListener("change", () => {
    const p = EXAMPLES[exampleSelect.value];
    exampleSelect.value = "";  // So the same example can be chosen again
    if (!p) return;
    kindSelect.value = p.kind;
    loadDesigned(p);
  });

  setupHelp("dt");
  const panels = setupPanels("dt", () =>
    saveJSON(PIN_KEY, panels.list.map((panel, i) => (panels.isPinned(panel) ? i : -1)).filter(i => i >= 0)));
  for (const i of loadJSON<number[]>(PIN_KEY) ?? []) {
    if (panels.list[i]) panels.setPinned(panels.list[i], true);
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initPage);
  else initPage();
}
