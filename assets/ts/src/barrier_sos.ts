// ╭───────────────────────────────────────────────────────────────╮
// │   Barrier certificate SOS formulator: page wiring             │
// ╰───────────────────────────────────────────────────────────────╯
// The user describes a hybrid system H = (C, F, D, G) with an initial set and an unsafe set. The
// page shows the SOS program whose feasibility proves safety, as rendered math, LaTeX source, and
// MATLAB code for SOSTOOLS and YALMIP. Nothing is solved here. See barrier_sos/problem.ts for the
// conditions and barrier_sos/codegen.ts for the output formats.
//
// The specification lives in `spec` and is saved to localStorage, so the page reopens where the
// user left off. Mode and jump cards are rebuilt only when cards are added or removed or a preset
// is loaded; typing just updates `spec` and regenerates the output.

import {
  Compiled, accentName, compile, JumpSpec, legacyMapToComponents, ModeSpec, ProblemSpec, Task, variableNames,
} from "./barrier_sos/problem";
import { nameToLatex } from "./barrier_sos/poly";
import {
  buildLatex, generateLatexSource, generateSostools, generateYalmip, problemSize, Target,
} from "./barrier_sos/codegen";
import { automatonData, renderAutomaton } from "./barrier_sos/automaton";
import { PRESETS, blankJump, blankMode } from "./barrier_sos/presets";
import { loadJSON, saveJSON } from "./common/storage";

import { enqueueMath, mathJaxReady, typeset } from "./common/mathjax";

const STORAGE_KEY = "barrier_sos_spec_v1";
const UPDATE_DELAY_MS = 250;

// ⋘──────── Field definitions ────────⋙

interface FieldDef<T> {
  key: keyof T & string;
  label: string;         // May contain math; "#" becomes the mode or jump number
  kind: "text" | "textarea" | "number" | "map";  // A map has one text box per state variable
  rows?: number;
  placeholder?: string;
  help?: string;
  task?: Task;           // Shown only for this task
  min?: number;
  step?: number;
  wide?: boolean;        // Spans both columns
  needs?: "w" | "v";     // Hidden when there are no flow (w) or jump (v) disturbance variables
}

const SET_HELP = 'One constraint per line, like "x1^2 + x2^2 <= 1" or "0 <= x1 <= 1". Separate pieces of a union with a line saying "or".';

const MODE_FIELDS: FieldDef<ModeSpec>[] = [
  { key: "name", label: "Name (optional)", kind: "text", placeholder: "e.g. no control", wide: true },
  { key: "flowMap", label: "Flow map \\(\\dot z = f_{#}(z, w)\\)", kind: "map", wide: true },
  { key: "flowSet", label: "Flow set \\(C_{#}\\)", kind: "textarea", rows: 2, placeholder: "Blank: all z", help: SET_HELP },
  { key: "flowDist", label: "Flow disturbance set \\(W_{#}\\)", kind: "textarea", rows: 2, placeholder: "Blank: all w", help: "Constraints on the flow disturbances.", needs: "w" },
  { key: "init", label: "Initial set \\(X_{0,#}\\)", kind: "textarea", rows: 2, placeholder: "Blank: no initial states in this mode" },
  { key: "unsafe", label: "Unsafe set \\(X_{u,#}\\)", kind: "textarea", rows: 2, placeholder: "Blank: no unsafe states in this mode" },
  { key: "barrierDegree", label: "Degree of \\(B_{#}\\)", kind: "number", min: 1, step: 1, task: "synthesize" },
  { key: "lambda", label: "\\(\\lambda_{#}(z)\\), fixed", kind: "text", placeholder: "0", help: "Flow condition: ⟨∇B, f⟩ ≤ λB. Any polynomial in z.", task: "synthesize" },
  { key: "barrier", label: "Barrier \\(B_{#}(z)\\)", kind: "textarea", rows: 2, placeholder: "x1^2 + x2^2 - 1", task: "verify", wide: true },
  { key: "lambdaDegree", label: "Degree of \\(\\lambda_{#}\\) (unknown)", kind: "number", min: 0, step: 1, help: "Flow condition: ⟨∇B, f⟩ ≤ λB.", task: "verify" },
];

const JUMP_FIELDS: FieldDef<JumpSpec>[] = [
  { key: "jumpSet", label: "Jump set \\(D_{#}\\)", kind: "textarea", rows: 2, placeholder: "Blank: all z", help: SET_HELP },
  { key: "jumpMap", label: "Jump map \\(z^+ = g_{#}(z, v)\\)", kind: "map", help: "Blank boxes mean that variable doesn't change." },
  { key: "jumpDist", label: "Jump disturbance set \\(V_{#}\\)", kind: "textarea", rows: 2, placeholder: "Blank: all v", needs: "v" },
  { key: "sigma", label: "\\(\\sigma_{#} \\ge 0\\), fixed", kind: "text", placeholder: "1", help: "Jump condition: B(g) ≤ σB. σ = 1 means B doesn't increase at jumps; σ = 0 means B(g) ≤ 0 on all of D.", task: "synthesize" },
  { key: "sigmaDegree", label: "Degree of \\(\\sigma_{#}\\) (unknown SOS)", kind: "number", min: 0, step: 2, help: "Jump condition: B(g) ≤ σB.", task: "verify" },
];

// ⋘──────── State ────────⋙

const BLANK_SPEC: ProblemSpec = {
  stateVars: "x1 x2", flowDistVars: "", jumpDistVars: "", params: "", task: "synthesize",
  epsilon: "0.1", extraDegree: 0, iqc: "", modes: [blankMode()], jumps: [],
};

let spec: ProblemSpec = loadSpec() ?? structuredClone(PRESETS[0].spec);
let activeTab: Target | "program" = "program";
let latestOutputs: Record<Target, string> = { latex: "", sostools: "", yalmip: "" };

function loadSpec(): ProblemSpec | null {
  try {
    const parsed = loadJSON<ProblemSpec>(STORAGE_KEY);
    if (!parsed) return null;
    if (!Array.isArray(parsed.modes) || !Array.isArray(parsed.jumps)) return null;
    // Older versions stored each map as one block of text.
    const names = stateNames(parsed);
    for (const m of parsed.modes) {
      if (typeof m.flowMap === "string") m.flowMap = legacyMapToComponents(m.flowMap, names);
    }
    for (const j of parsed.jumps) {
      if (typeof j.jumpMap === "string") j.jumpMap = legacyMapToComponents(j.jumpMap, names);
    }
    return parsed;
  } catch {
    return null;
  }
}

// The state variable names as typed, even if some are invalid, for labeling map components.
function stateNames(s: ProblemSpec = spec): string[] {
  return variableNames(s.stateVars, "x");
}

function saveSpec(): void {
  saveJSON(STORAGE_KEY, spec);
}

// ⋘──────── DOM helpers ────────⋙

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, ...children: (Node | string)[]): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  e.append(...children);
  return e;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

function fieldElement<T>(def: FieldDef<T>, value: unknown, id: string, index: number): HTMLElement {
  def = { ...def, label: def.label.replaceAll("#", String(index + 1)) };
  if (def.kind === "map") return mapFieldElement(def, Array.isArray(value) ? value : [], id);
  let input: HTMLInputElement | HTMLTextAreaElement;
  if (def.kind === "textarea") {
    input = el("textarea", { rows: String(def.rows ?? 2), spellcheck: "false" });
    input.value = String(value ?? "");
  } else {
    input = el("input", { type: def.kind, spellcheck: "false", autocomplete: "off" });
    if (def.min !== undefined) input.setAttribute("min", String(def.min));
    if (def.step !== undefined) input.setAttribute("step", String(def.step));
    input.value = String(value ?? "");
  }
  input.id = id;
  input.dataset.field = def.key;
  if (def.placeholder) input.placeholder = def.placeholder;
  const wrapper = el("div", { class: `bs-field${def.wide ? " bs-wide" : ""}${def.task ? ` bs-only-${def.task}` : ""}${def.needs ? ` bs-needs-${def.needs}` : ""}` },
    el("label", { for: id }, def.label), input);
  addFieldExtras(input);
  if (def.help) wrapper.append(el("small", {}, def.help));
  return wrapper;
}

// One text box per state variable, labeled "x1' =" for flows or "x1+ =" for jumps. Each box has
// its own error message, and the preview of the whole map goes below them.
function mapFieldElement<T>(def: FieldDef<T>, values: string[], id: string): HTMLElement {
  const jump = def.key === "jumpMap";
  const heading = el("span", { class: "bs-map-label", id: `${id}-label` }, def.label);
  const wrapper = el("div", { class: `bs-field bs-map${def.wide ? " bs-wide" : ""}`, role: "group", "aria-labelledby": heading.id }, heading);
  stateNames().forEach((name, k) => {
    const input = el("input", { type: "text", spellcheck: "false", autocomplete: "off", id: `${id}-${k}` });
    input.dataset.field = def.key;
    input.dataset.component = String(k);
    input.value = values[k] ?? "";
    input.placeholder = jump ? `${name} (unchanged)` : "";
    // Valid names are shown as math (ẋ₁ = or x₁⁺ =), and are typeset after the cards are rendered.
    const lhs = /^[A-Za-z][A-Za-z0-9_]*$/.test(name)
      ? `\\(${accentName(nameToLatex(name), jump ? "+" : "\\dot")} =\\)`
      : `${name}${jump ? "+" : "'"} =`;
    const row = el("div", { class: "bs-map-row" }, el("label", { for: input.id }, lhs), input);
    wrapper.append(row);
    addFieldExtras(input);
  });
  const error = el("div", { class: "bs-field-error", id: `${id}-error`, role: "alert" });
  error.hidden = true;
  const preview = el("div", { class: "bs-preview", id: `${id}-preview` });
  preview.hidden = true;
  wrapper.append(error, preview);
  if (def.help) wrapper.append(el("small", {}, def.help));
  return wrapper;
}

// Adds an error message and a rendered preview below an input.
function addFieldExtras(input: HTMLElement): void {
  const error = el("div", { class: "bs-field-error", id: `${input.id}-error`, role: "alert" });
  error.hidden = true;
  const preview = el("div", { class: "bs-preview", id: `${input.id}-preview` });
  preview.hidden = true;
  input.setAttribute("aria-describedby", error.id);
  input.after(error, preview);
}

// ⋘──────── Rendering the form ────────⋙

function modeOptionLabel(i: number): string {
  const name = spec.modes[i]?.name.trim();
  return name ? `${i + 1}: ${name}` : `Mode ${i + 1}`;
}

function renderCards(): void {
  const modes = $("bs-modes");
  modes.replaceChildren(...spec.modes.map((mode, i) => {
    const legend = el("legend", {}, `Mode ${i + 1}`);
    if (spec.modes.length > 1) {
      legend.append(el("button", { type: "button", class: "bs-remove", "data-remove": "mode", "data-index": String(i), "aria-label": `Remove mode ${i + 1}` }, "Remove"));
    }
    return el("fieldset", { class: "bs-card", "data-kind": "mode", "data-index": String(i) },
      legend,
      el("div", { class: "bs-grid" }, ...MODE_FIELDS.map((f) => fieldElement(f, mode[f.key], `bs-mode-${i}-${f.key}`, i))));
  }));

  const jumps = $("bs-jumps");
  jumps.replaceChildren(...spec.jumps.map((jump, i) => {
    const select = (key: "from" | "to") => {
      const s = el("select", { id: `bs-jump-${i}-${key}` });
      s.dataset.field = key;
      spec.modes.forEach((_, qi) => s.append(el("option", { value: String(qi) }, modeOptionLabel(qi))));
      s.value = String(jump[key]);
      return el("div", { class: "bs-field" }, el("label", { for: s.id }, key === "from" ? "From mode" : "To mode"), s);
    };
    return el("fieldset", { class: "bs-card", "data-kind": "jump", "data-index": String(i) },
      el("legend", {}, `Jump ${i + 1}`,
        el("button", { type: "button", class: "bs-remove", "data-remove": "jump", "data-index": String(i), "aria-label": `Remove jump ${i + 1}` }, "Remove")),
      el("div", { class: "bs-grid" },
        ...(spec.modes.length > 1 ? [select("from"), select("to")] : []),
        ...JUMP_FIELDS.map((f) => fieldElement(f, jump[f.key], `bs-jump-${i}-${f.key}`, i))));
  }));
  if (spec.jumps.length === 0) jumps.append(el("p", { class: "bs-empty" }, "No jumps: D is empty."));
  // Labels contain math, like "Flow set C₁" and "ẋ₁ =".
  void typeset([...document.querySelectorAll(".bs-card label, .bs-card .bs-map-label")]);
}

// Refreshes the mode names in the jumps' "from" and "to" menus.
function refreshModeOptions(): void {
  document.querySelectorAll<HTMLSelectElement>("#bs-jumps select").forEach((s) => {
    Array.from(s.options).forEach((o, qi) => { o.textContent = modeOptionLabel(qi); });
  });
}

// Hides each mode's W box and each jump's V box when there are no disturbance variables.
function updateDisturbanceVisibility(): void {
  const form = $("bs-form");
  form.dataset.hasW = String(variableNames(spec.flowDistVars, "w").length > 0);
  form.dataset.hasV = String(variableNames(spec.jumpDistVars, "v").length > 0);
}

function renderGlobals(): void {
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-global]").forEach((input) => {
    input.value = String(spec[input.dataset.global as keyof ProblemSpec] ?? "");
  });
  document.querySelectorAll<HTMLInputElement>('input[name="bs-task"]').forEach((r) => { r.checked = r.value === spec.task; });
  $("bs-form").dataset.task = spec.task;
  updateDisturbanceVisibility();
}

function renderAll(): void {
  renderGlobals();
  renderCards();
  update();
}

// ⋘──────── Output ────────⋙

let updateTimer: number | undefined;
function scheduleUpdate(): void {
  window.clearTimeout(updateTimer);
  updateTimer = window.setTimeout(update, UPDATE_DELAY_MS);
}

function update(): void {
  saveSpec();
  const { compiled, errors, previews } = compile(spec);
  showFieldMessages(errors, previews);
  const messages = $("bs-messages");
  messages.replaceChildren();
  const general = errors.filter((e) => !e.field || !document.getElementById(`${e.field}-error`));
  const fieldCount = new Set(errors.filter((e) => !general.includes(e)).map((e) => e.field)).size;
  if (general.length > 0 || fieldCount > 0) {
    messages.append(el("ul", { class: "bs-errors" },
      ...general.map((e) => el("li", {}, el("strong", {}, `${e.where}: `), e.message)),
      ...(fieldCount > 0 ? [el("li", {}, `Fix the ${fieldCount} field${fieldCount === 1 ? "" : "s"} marked in red above.`)] : [])));
  }
  if (!compiled) {
    $("bs-output").hidden = true;
    return;
  }
  void updateAutomaton(compiled);
  if (compiled.warnings.length > 0) {
    messages.append(el("ul", { class: "bs-warnings" }, ...compiled.warnings.map((w) => el("li", {}, w))));
  }
  $("bs-output").hidden = false;
  renderSize(compiled);

  latestOutputs = {
    latex: generateLatexSource(compiled),
    sostools: generateSostools(compiled),
    yalmip: generateYalmip(compiled),
  };
  for (const target of ["latex", "sostools", "yalmip"] as Target[]) {
    $(`bs-code-${target}`).textContent = latestOutputs[target];
  }

  const program = buildLatex(compiled);
  const html: string[] = [];
  html.push('<div class="bs-defs">');
  for (const d of program.defs) {
    html.push(`<div><h4>${escapeHtml(d.heading)}</h4><ul>`);
    for (const it of d.items) html.push(`<li>\\(${escapeHtml(it.math)}\\)${it.note ? ` <span class="bs-note">${escapeHtml(it.note)}</span>` : ""}</li>`);
    html.push("</ul></div>");
  }
  html.push("</div>");
  html.push(`<p>${compiled.task === "synthesize" ? "Find the unknowns above" : "Find multipliers"} such that each of the following polynomials is a sum of squares (SOS).</p>`);
  html.push('<ol class="bs-conditions">');
  for (const c of program.conditions) {
    html.push(`<li><strong>${escapeHtml(c.title)}.</strong> Ensures \\(${escapeHtml(c.property)}\\).`);
    html.push(`<div class="bs-display">\\[${escapeHtml(c.sos)}\\]</div>`);
    if (c.multipliers) html.push(`<div class="bs-mults">where \\(${escapeHtml(c.multipliers)}\\).</div>`);
    html.push("</li>");
  }
  html.push("</ol>");
  const pane = $("bs-pane-program");
  window.MathJax?.typesetClear?.([pane]);
  pane.innerHTML = html.join("");
  void typeset([pane]);
}

// Shows each field's errors below it, or else a rendered preview of what was parsed from it.
function showFieldMessages(errors: { field?: string; message: string }[], previews: Map<string, string>): void {
  const byField = new Map<string, string[]>();
  for (const e of errors) if (e.field) byField.set(e.field, [...(byField.get(e.field) ?? []), e.message]);
  const changed: Element[] = [];
  document.querySelectorAll<HTMLElement>("#bs-form [id$='-error']").forEach((errorEl) => {
    const id = errorEl.id.slice(0, -"-error".length);
    const input = document.getElementById(id);
    const previewEl = document.getElementById(`${id}-preview`);
    const messages = byField.get(id);
    errorEl.hidden = !messages;
    errorEl.textContent = messages ? messages.join(" ") : "";
    input?.classList.toggle("bs-invalid", !!messages);
    input?.setAttribute("aria-invalid", String(!!messages));
    if (!previewEl) return;
    const latex = messages ? undefined : previews.get(id);
    previewEl.hidden = !latex;
    if (latex && previewEl.dataset.latex !== latex) {
      previewEl.dataset.latex = latex;
      previewEl.textContent = `\\[${latex}\\]`;
      changed.push(previewEl);
    }
  });
  if (changed.length) void typeset(changed);
}

function renderSize(cp: Compiled): void {
  const size = problemSize(cp);
  const fmt = (k: number) => k.toLocaleString("en-US");
  const row = (label: string, value: string) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`;
  const unknownRows = size.unknowns.map((g) =>
    row(`${escapeHtml(g.label)} \\(${g.latex}\\)`, `${fmt(g.count)} (${fmt(g.coefficients)} coefficients)`)).join("");
  const blocks = size.sdp.blocks.map((b) => `${fmt(b.count)} × ${b.size}×${b.size}`).join(", ");
  const html = `
    <div><h4>SOS program</h4><table>
      ${row("Indeterminates (z, w, v)", fmt(size.indeterminates))}
      ${unknownRows}
      ${row("Unknown coefficients", fmt(size.coefficients))}
      ${row("SOS constraints (conditions)", fmt(size.sosConstraints))}
      ${row("SOS constraints (multipliers)", fmt(size.sosMultipliers))}
    </table></div>
    <div><h4>Semidefinite program</h4><table>
      ${row("PSD blocks", `${fmt(size.sdp.blocks.reduce((s, b) => s + b.count, 0))}: ${blocks}`)}
      ${row("Largest block", size.sdp.blocks.length ? `${size.sdp.blocks[0].size}×${size.sdp.blocks[0].size}` : "none")}
      ${row("Scalar variables", `${fmt(size.sdp.freeScalars + size.sdp.gramScalars)} (${fmt(size.sdp.gramScalars)} Gram entries, ${fmt(size.sdp.freeScalars)} free coefficients)`)}
      ${row("Linear equality constraints", fmt(size.sdp.equalities))}
    </table></div>`;
  const box = $("bs-size");
  window.MathJax?.typesetClear?.([box]);
  box.innerHTML = html;
  void typeset([box]);
}

let automatonKey = "";
async function updateAutomaton(cp: Compiled): Promise<void> {
  const data = automatonData(cp);
  const key = JSON.stringify(data);
  const container = $("bs-automaton");
  if (key === automatonKey && container.clientWidth === Number(container.dataset.width)) return;
  automatonKey = key;
  container.dataset.width = String(container.clientWidth);
  // Render through the MathJax queue so that layouts don't interleave.
  await enqueueMath(() => renderAutomaton(container, data, async (els) => {
    if (!(await mathJaxReady())) return;
    await window.MathJax!.typesetPromise!(els).catch(() => { /* Leave the TeX source visible */ });
  })).catch((e) => console.error("Automaton rendering failed", e));
}

function showTab(tab: Target | "program"): void {
  activeTab = tab;
  document.querySelectorAll<HTMLButtonElement>(".bs-tabs [role=tab]").forEach((b) => {
    const selected = b.dataset.tab === tab;
    b.setAttribute("aria-selected", String(selected));
    b.tabIndex = selected ? 0 : -1;
  });
  document.querySelectorAll<HTMLElement>(".bs-pane").forEach((p) => { p.hidden = p.id !== `bs-pane-${tab}`; });
  $("bs-copy").hidden = $("bs-download").hidden = tab === "program";
}

const FILE_NAMES: Record<Target, string> = {
  latex: "barrier_sos_program.tex",
  sostools: "barrier_sos_sostools.m",
  yalmip: "barrier_sos_yalmip.m",
};

// ⋘──────── Events ────────⋙

function init(): void {
  const presetSelect = $<HTMLSelectElement>("bs-preset");
  presetSelect.append(...PRESETS.map((p) => el("option", { value: p.id }, p.title)), el("option", { value: "blank" }, "Blank system"));
  presetSelect.value = "";
  $("bs-load").addEventListener("click", () => {
    const id = presetSelect.value;
    if (!id) return;
    spec = structuredClone(id === "blank" ? BLANK_SPEC : PRESETS.find((p) => p.id === id)!.spec);
    $("bs-preset-description").textContent = PRESETS.find((p) => p.id === id)?.description ?? "";
    renderAll();
  });
  presetSelect.addEventListener("change", () => {
    $("bs-preset-description").textContent = PRESETS.find((p) => p.id === presetSelect.value)?.description ?? "";
  });

  const form = $("bs-form");
  form.addEventListener("submit", (e) => e.preventDefault());
  const onEdit = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    if (target.name === "bs-task") {
      spec.task = target.value as Task;
      form.dataset.task = spec.task;
      scheduleUpdate();
      return;
    }
    if (target.dataset.global) {
      const key = target.dataset.global as keyof ProblemSpec;
      const before = stateNames().join(" ");
      (spec as unknown as Record<string, unknown>)[key] = key === "extraDegree" ? Number(target.value) : target.value;
      // Each map has one box per state variable, so rebuild the cards when the variables change.
      if (key === "stateVars" && stateNames().join(" ") !== before) renderCards();
      updateDisturbanceVisibility();
      scheduleUpdate();
      return;
    }
    const card = target.closest<HTMLElement>(".bs-card");
    const field = target.dataset.field;
    if (!card || !field) return;
    const index = Number(card.dataset.index);
    const item = (card.dataset.kind === "mode" ? spec.modes[index] : spec.jumps[index]) as unknown as Record<string, unknown>;
    if (target.dataset.component !== undefined) {
      const entries = Array.isArray(item[field]) ? item[field] as string[] : [];
      entries[Number(target.dataset.component)] = target.value;
      item[field] = Array.from(entries, (e) => e ?? "");
    } else {
      item[field] = typeof item[field] === "number" ? Number(target.value) : target.value;
    }
    if (field === "name") refreshModeOptions();
    scheduleUpdate();
  };
  form.addEventListener("input", onEdit);
  form.addEventListener("change", onEdit);

  form.addEventListener("click", (e) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>("button");
    if (!button) return;
    if (button.id === "bs-add-mode") {
      spec.modes.push(blankMode());
    } else if (button.id === "bs-add-jump") {
      spec.jumps.push(blankJump(0, 0));
    } else if (button.dataset.remove === "mode") {
      const qi = Number(button.dataset.index);
      spec.modes.splice(qi, 1);
      // Drop jumps to or from the removed mode and renumber the rest.
      spec.jumps = spec.jumps
        .filter((j) => j.from !== qi && j.to !== qi)
        .map((j) => ({ ...j, from: j.from > qi ? j.from - 1 : j.from, to: j.to > qi ? j.to - 1 : j.to }));
    } else if (button.dataset.remove === "jump") {
      spec.jumps.splice(Number(button.dataset.index), 1);
    } else {
      return;
    }
    renderCards();
    update();
  });

  document.querySelectorAll<HTMLButtonElement>(".bs-tabs [role=tab]").forEach((b) => {
    b.addEventListener("click", () => showTab(b.dataset.tab as Target | "program"));
  });
  $("bs-copy").addEventListener("click", async () => {
    if (activeTab === "program") return;
    const button = $("bs-copy");
    try {
      await navigator.clipboard.writeText(latestOutputs[activeTab]);
      button.textContent = "Copied";
    } catch {
      button.textContent = "Copy failed";
    }
    window.setTimeout(() => { button.textContent = "Copy"; }, 1500);
  });
  $("bs-download").addEventListener("click", () => {
    if (activeTab === "program") return;
    const url = URL.createObjectURL(new Blob([latestOutputs[activeTab]], { type: "text/plain" }));
    const a = el("a", { href: url, download: FILE_NAMES[activeTab] });
    a.click();
    URL.revokeObjectURL(url);
  });

  document.querySelectorAll<HTMLElement>("[data-global]").forEach(addFieldExtras);
  let resizeTimer: number | undefined;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => { automatonKey = ""; update(); }, 300);
  });

  showTab("program");
  renderAll();
}

init();
