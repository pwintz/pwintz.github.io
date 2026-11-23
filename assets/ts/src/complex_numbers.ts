// ╭───────────────────────────────────────────────────────────────╮
// │                       Complex numbers                          │
// ╰───────────────────────────────────────────────────────────────╯
// The page /tools/complex_numbers/ (collections/_pages/complex_numbers.html): practice problems
// worked in steps (complex/practice_page.ts), drawn in the complex plane (complex/visualizer.ts).
// The math is in complex/complex_math.ts.
//
// One problem: the practice problem is the one drawn. With "Design your own problems", the numbers
// can be typed in the form below the kind of problem, dragged in the plane, or loaded from Examples.

import { setupHelp } from "./common/help";
import { setupPanels } from "./common/panels";
import { loadJSON, saveJSON } from "./common/storage";
import { parseEntry, reduce } from "./matrix/fraction";
import { C, F, Kind, Polar, Problem, cx, fracText, normAngle, problemError } from "./complex/complex_math";
import { PIN_KEY, setupPracticePage } from "./complex/practice_page";
import { setupVisualizer } from "./complex/visualizer";

// ⋘──────── Examples ────────⋙

const polar = (r: number, num: number, den: number): Polar => ({ r: F(r), t: normAngle(F(num, den)) });
const EXAMPLES: Record<string, Problem> = {
  i0: { kind: "powi", n: 0 },
  i2: { kind: "powi", n: 2 },
  i5: { kind: "powi", n: 5 },
  i2026: { kind: "powi", n: 2026 },
  addBasic: { kind: "add", z: cx(3, 2), w: cx(1, -4) },
  addConj: { kind: "add", z: cx(2, 5), w: cx(2, -5) },
  mulI: { kind: "mul", z: cx(0, 1), w: cx(0, 1) },
  mulConj: { kind: "mul", z: cx(1, 1), w: cx(1, -1) },
  mulBasic: { kind: "mul", z: cx(2, 3), w: cx(4, -1) },
  conj345: { kind: "conj", z: cx(3, 4) },
  conjDiag: { kind: "conj", z: cx(1, 1) },
  divI: { kind: "div", z: cx(1, 0), w: cx(0, 1) },
  divBasic: { kind: "div", z: cx(3, 4), w: cx(1, 2) },
  divFrac: { kind: "div", z: cx(1, 0), w: cx(1, 1) },
  polarDiag: { kind: "polar", z: cx(1, 1) },
  polarNeg: { kind: "polar", z: cx(-3, 3) },
  polarAxis: { kind: "polar", z: cx(0, -2) },
  polarOdd: { kind: "polar", z: cx(1, 2) },
  pmulBasic: { kind: "polarmul", z: polar(2, 1, 3), w: polar(3, 1, 6) },
  pmulWrap: { kind: "polarmul", z: polar(1, 3, 4), w: polar(2, -3, 4) },
  power8: { kind: "power", z: cx(1, 1), n: 8 },
  power5: { kind: "power", z: cx(1, -1), n: 5 },
  powerI: { kind: "power", z: cx(0, 2), n: 3 },
};

// ⋘──────── The design form ────────⋙
// The boxes for each number of the problem: a + bi, or r and θ (as a multiple of π) in polar form.

interface Field { id: string; label: string; help?: string }
function fieldsFor(kind: Kind): Field[] {
  const rect = (name: string): Field[] => [{ id: `${name}-re`, label: `Re ${name}` }, { id: `${name}-im`, label: `Im ${name}` }];
  switch (kind) {
    case "powi": return [{ id: "n", label: "n" }];
    case "add": case "mul": case "div": return [...rect("z"), ...rect("w")];
    case "conj": case "polar": return rect("z");
    case "power": return [...rect("z"), { id: "n", label: "n" }];
    case "polarmul": return [{ id: "z-r", label: "r of z" }, { id: "z-t", label: "θ/π of z" }, { id: "w-r", label: "r of w" }, { id: "w-t", label: "θ/π of w" }];
  }
}

function valuesOf(p: Problem): Record<string, string> {
  const v: Record<string, string> = {};
  const rect = (name: string, z: C) => { v[`${name}-re`] = fracText(z.re); v[`${name}-im`] = fracText(z.im); };
  const pol = (name: string, z: Polar) => { v[`${name}-r`] = fracText(z.r); v[`${name}-t`] = fracText(z.t); };
  if (p.kind === "polarmul") { pol("z", p.z); pol("w", p.w); }
  else if (p.kind !== "powi") { rect("z", p.z); if ("w" in p) rect("w", p.w); }
  if ("n" in p) v.n = `${p.n}`;
  return v;
}

function initPage(): void {
  const kindSelect = document.getElementById("cx-kind") as HTMLSelectElement;
  const design = document.getElementById("cx-design") as HTMLDivElement;
  const designError = document.getElementById("cx-design-error") as HTMLParagraphElement;
  const exampleSelect = document.getElementById("cx-example") as HTMLSelectElement;
  let inputs: Record<string, HTMLInputElement> = {};
  let formKind: Kind | null = null;

  // The boxes for the problem's kind, filled in from the problem.
  function fillDesign(p: Problem): void {
    if (formKind !== p.kind) {
      formKind = p.kind;
      inputs = {};
      design.replaceChildren(...fieldsFor(p.kind).map(f => {
        const label = document.createElement("label");
        label.className = "cx-design-item";
        const name = document.createElement("span");
        name.textContent = f.label;
        const input = document.createElement("input");
        input.className = "cx-design-entry";
        input.inputMode = "decimal";
        input.autocomplete = "off";
        input.setAttribute("aria-label", f.label);
        input.addEventListener("change", applyDesign);
        input.addEventListener("keydown", e => { if (e.key === "Enter") applyDesign(); });
        inputs[f.id] = input;
        label.append(name, input);
        return label;
      }));
    }
    const values = valuesOf(p);
    for (const [id, input] of Object.entries(inputs)) input.value = values[id] ?? "";
    designError.hidden = true;
  }

  // The problem in the boxes, if they make one.
  function readDesign(): Problem | string {
    const kind = formKind!;
    const num = (id: string) => {
      const x = parseEntry(inputs[id].value);
      if (x === null) throw new Error(`Enter a number like 3, -2, or 1/2 for ${fieldsFor(kind).find(f => f.id === id)!.label}.`);
      return reduce(x);
    };
    const int = (id: string) => {
      const x = num(id);
      if (x.den !== 1n) throw new Error("Enter a whole number for n.");
      return Number(x.num);
    };
    try {
      const z = () => cx(num("z-re"), num("z-im")), w = () => cx(num("w-re"), num("w-im"));
      const pol = (name: string): Polar => ({ r: num(`${name}-r`), t: normAngle(num(`${name}-t`)) });
      let p: Problem;
      switch (kind) {
        case "powi": p = { kind, n: int("n") }; break;
        case "add": case "mul": case "div": p = { kind, z: z(), w: w() }; break;
        case "conj": case "polar": p = { kind, z: z() }; break;
        case "power": p = { kind, z: z(), n: int("n") }; break;
        case "polarmul": p = { kind, z: pol("z"), w: pol("w") }; break;
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
    onLoad(p, mode) {
      visualizer.show(p, mode);
      fillDesign(p);
    },
    onStatus({ finished }) {
      visualizer.setFinished(finished);
    },
  });

  exampleSelect.addEventListener("change", () => {
    const p = EXAMPLES[exampleSelect.value];
    exampleSelect.value = "";  // So the same example can be chosen again
    if (!p) return;
    kindSelect.value = p.kind;
    loadDesigned(p);
  });

  setupHelp("cx");
  const panels = setupPanels("cx", () =>
    saveJSON(PIN_KEY, panels.list.map((panel, i) => (panels.isPinned(panel) ? i : -1)).filter(i => i >= 0)));
  for (const i of loadJSON<number[]>(PIN_KEY) ?? []) {
    if (panels.list[i]) panels.setPinned(panels.list[i], true);
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initPage);
  else initPage();
}
