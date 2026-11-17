// ╭───────────────────────────────────────────────────────────────╮
// │                Notation page (/dictionary/notation/)          │
// ╰───────────────────────────────────────────────────────────────╯
// Lets the reader pick their notation for the items in _data/notation.yml. The choices are saved in this browser
// (localStorage "notation.choices", as {itemId: optionId}, listing only the items not at their defaults).
// assets/js/mathjax_config.js reads them before MathJax starts, so every page opened afterward uses them.
// On this page, the samples and the preview are typeset again right away.

import { loadJSON, saveJSON, removeSaved } from "./common/storage";
import { enqueueMath, mathJaxReady } from "./common/mathjax";
import { setupHelp } from "./common/help";

interface NotationOption { id: string; tex: string; tex_of?: string; used_by?: string }
interface NotationItem {
  id: string; name: string; group: string; macro: string; args?: number;
  default: string; help?: string; sample?: string; options: NotationOption[];
}
type Choices = Record<string, string>;

const STORAGE_KEY = "notation.choices"; // Also read by assets/js/mathjax_config.js.

interface MathJaxWithConfig {
  config: { tex: { macros: Record<string, string | [string, number]> } };
  startup: { getComponents: () => void };
  typesetClear: (els: Element[]) => void;
  typesetPromise: (els: Element[]) => Promise<void>;
}

const items: NotationItem[] = JSON.parse(document.getElementById("notation-data")?.textContent ?? "[]");

function loadChoices(): Choices {
  const saved = loadJSON<Choices>(STORAGE_KEY);
  return saved && typeof saved === "object" ? saved : {};
}

let choices = loadChoices();

function chosenOption(item: NotationItem): NotationOption {
  return item.options.find((o) => o.id === choices[item.id])
    ?? item.options.find((o) => o.id === item.default)
    ?? item.options[0];
}

// The macro definitions for an item's chosen option, the same as in assets/js/mathjax_config.js.
function macroDefinitions(item: NotationItem): [string, string | [string, number]][] {
  const option = chosenOption(item);
  const args = item.args ?? 0;
  if (args === 0) return [[item.macro, option.tex]];
  const texOf = option.tex_of ?? (/ #1$/.test(option.tex) ? option.tex.replace(/ #1$/, "(#1)") : option.tex);
  return [[item.macro, [option.tex, args]], [item.macro + "Of", [texOf, args]]];
}

// The TeX of an option's sample: each "@{x}" in the item's sample is the option's TeX with #1 replaced by x.
function sampleTex(item: NotationItem, option: NotationOption): string {
  return (item.sample ?? "@{T}").replace(/@\{([^{}]*)\}/g, (_, arg: string) => option.tex.replace(/#1/g, arg));
}

// ⋘──────── Typesetting ────────⋙
// Each piece of math on the page that depends on the choices has its TeX in data-tex, so it can be typeset again
// after MathJax has replaced it.

function mathElements(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(".notation [data-tex]"));
}

function retypeset(): Promise<void> {
  return enqueueMath(async () => {
    if (!(await mathJaxReady())) return;
    const mj = (window as unknown as { MathJax: MathJaxWithConfig }).MathJax;
    for (const item of items) {
      for (const [name, definition] of macroDefinitions(item)) mj.config.tex.macros[name] = definition;
    }
    // Rebuilds the TeX input with the new macros.
    mj.startup.getComponents();
    const els = mathElements();
    for (const el of els) el.textContent = `\\(${el.dataset.tex}\\)`;
    await mj.typesetPromise(els).catch(() => { /* Leave the TeX source visible */ });
  });
}

// ⋘──────── LaTeX export ────────⋙

function latexMacros(): string {
  const lines = [
    "% Notation chosen at https://paulwintz.com/dictionary/notation/",
    "% Needs \\usepackage{amsmath, amssymb}.",
  ];
  for (const item of items) {
    const args = item.args ?? 0;
    for (const [name, definition] of macroDefinitions(item)) {
      const tex = Array.isArray(definition) ? definition[0] : definition;
      lines.push(`\\newcommand{\\${name}}${args > 0 ? `[${args}]` : ""}{${tex}}`);
    }
  }
  lines.push(
    "\\newcommand{\\setdef}[1]{\\left\\{#1\\right\\}}",
    "\\newcommand{\\reals}{\\numberset{R}}",
    "\\newcommand{\\nats}{\\numberset{N}}",
    "\\newcommand{\\integers}{\\numberset{Z}}",
    "\\newcommand{\\rationals}{\\numberset{Q}}",
    "\\newcommand{\\complexes}{\\numberset{C}}",
  );
  return lines.join("\n");
}

// ⋘──────── Page ────────⋙

function buildItems(container: HTMLElement): void {
  let group = "";
  for (const item of items) {
    if (item.group !== group) {
      group = item.group;
      const heading = document.createElement("h2");
      heading.textContent = group;
      container.append(heading);
    }
    const fieldset = document.createElement("fieldset");
    fieldset.className = "notation__item";
    const legend = document.createElement("legend");
    const name = document.createElement("span");
    name.textContent = item.name;
    if (item.help) name.dataset.help = item.help;
    legend.append(name);
    fieldset.append(legend);

    const options = document.createElement("div");
    options.className = "notation__options";
    for (const option of item.options) {
      const label = document.createElement("label");
      label.className = "notation__option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `notation-${item.id}`;
      input.value = option.id;
      input.addEventListener("change", () => {
        if (option.id === item.default) delete choices[item.id];
        else choices[item.id] = option.id;
        save();
      });
      const sample = document.createElement("span");
      sample.className = "notation__sample";
      sample.dataset.tex = sampleTex(item, option);
      sample.textContent = `\\(${sample.dataset.tex}\\)`;
      label.append(input, sample);
      if (option.used_by) {
        const usedBy = document.createElement("span");
        usedBy.className = "notation__used-by";
        usedBy.textContent = option.used_by;
        label.append(usedBy);
      }
      options.append(label);
    }
    fieldset.append(options);
    container.append(fieldset);
  }
}

function showChoices(): void {
  for (const item of items) {
    const chosen = chosenOption(item).id;
    for (const input of document.querySelectorAll<HTMLInputElement>(`input[name="notation-${item.id}"]`)) {
      input.checked = input.value === chosen;
    }
  }
  const latex = document.getElementById("notation-latex");
  if (latex) latex.textContent = latexMacros();
  const status = document.getElementById("notation-status");
  if (status) {
    const changed = Object.keys(choices).length;
    status.textContent = changed === 0 ? "Using the default notation." : `${changed} ${changed === 1 ? "item differs" : "items differ"} from the default notation.`;
  }
}

function save(): void {
  if (Object.keys(choices).length === 0) removeSaved(STORAGE_KEY);
  else saveJSON(STORAGE_KEY, choices);
  showChoices();
  void retypeset();
}

function init(): void {
  const container = document.getElementById("notation-items");
  if (!container) return;
  buildItems(container);
  showChoices();
  setupHelp("notation");
  void retypeset();

  document.getElementById("notation-reset")?.addEventListener("click", () => {
    choices = {};
    save();
  });

  const copy = document.getElementById("notation-copy");
  copy?.addEventListener("click", async () => {
    const text = latexMacros();
    try {
      await navigator.clipboard.writeText(text);
      copy.textContent = "Copied";
    } catch {
      // Select the text so that the reader can copy it.
      const latex = document.getElementById("notation-latex");
      if (latex) window.getSelection()?.selectAllChildren(latex);
      copy.textContent = "Press Ctrl+C to copy";
    }
    window.setTimeout(() => { copy.textContent = "Copy"; }, 2000);
  });

  // Another tab changed the choices.
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    choices = loadChoices();
    showChoices();
    void retypeset();
  });
}

init();
