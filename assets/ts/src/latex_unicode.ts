// ╭───────────────────────────────────────────────────────────────╮
// │              Convert LaTeX commands to Unicode                │
// ╰───────────────────────────────────────────────────────────────╯
// Uses UnicodeIt (https://github.com/svenkreiss/unicodeit) to turn LaTeX like "\alpha^2 \leq x_{12}"
// into plain Unicode text ("α² ≤ x₁₂") that can be pasted anywhere, such as emails or code comments.
// The page also lists every symbol UnicodeIt knows, so they can be searched and inserted.

import { distance } from "fastest-levenshtein";
import { replace, ReplaceOptions } from "unicodeit/ts_src/replace";
import { replacements, combiningmarks, subsuperscripts } from "unicodeit/ts_src/data";

// ⋘──────── Types and constants ────────⋙

interface SymbolEntry {
  command : string;   // The LaTeX command, e.g. "\alpha" or "\hat{}"
  symbol  : string;   // What it becomes, e.g. "α" (combining marks are shown on a dotted circle)
}

// A piece of the converted text, flagged if UnicodeIt couldn't convert it.
interface Reason {
  summary  : string;    // A short reason, always shown
  details? : string;    // Longer explanation, shown on request (e.g. which characters have superscripts)
}

interface Segment {
  text         : string;
  unsupported? : Reason;   // Why it wasn't converted
}

const MAX_SHOWN     = 240;   // Most symbols shown at once, to keep the list fast
const INPUT_KEY     = "latex-unicode-input";   // localStorage keys for the last entry and style
const STYLE_KEY     = "latex-unicode-style";
const VULGAR_KEY    = "latex-unicode-vulgar-fractions";
const DOTTED_CIRCLE = "◌";   // Base character for showing combining marks alone

// What's left in UnicodeIt's output that it couldn't convert:
//  1. Commands it doesn't know, with any brace arguments (e.g. "\overbrace{abc}").
//  2. "^" or "_" before a character, or a group of them, without Unicode super/subscripts
//     (e.g. "^π" or "_{x→0}"). UnicodeIt converts a group only if it can convert all of it.
const UNSUPPORTED_RE = /(\\[A-Za-z]+(?:\{[^{}]*\})*)|([_^])(\{[^{}]*\}|.)/gu;

// Every command, shortest first so that searches put "\in" before "\infty", "\int", etc.
const SYMBOLS: SymbolEntry[] = [
  ...replacements.map(([command, symbol]) => ({ command, symbol })),
  ...combiningmarks.map(([command, mark]) => ({ command: command + "{}", symbol: DOTTED_CIRCLE + mark })),
].sort((a, b) => a.command.length - b.command.length || a.command.localeCompare(b.command));

// Characters that have a Unicode superscript ("^") or subscript ("_"), from UnicodeIt's table.
const SCRIPT_BASES: Record<string, string[]> = { "^": [], "_": [] };
for (const [latex] of subsuperscripts) SCRIPT_BASES[latex[0]].push(latex.slice(1));
for (const kind in SCRIPT_BASES) SCRIPT_BASES[kind].sort();

// Commands for suggestions when one isn't recognized: every symbol, plus what UnicodeIt
// handles specially (layout, text, operator names, and spacing).
const KNOWN_COMMANDS = [...new Set([
  ...SYMBOLS.map((s) => s.command.match(/^\\[A-Za-z]+/)?.[0]).filter((c): c is string => !!c),
  ..."frac dfrac tfrac sqrt left right middle big Big bigg Bigg text mbox operatorname mathrm begin end qquad"
    .split(" ").map((c) => "\\" + c),
  ..."arccos arcsin arctan arg cos cosh cot coth csc deg det dim exp gcd hom inf ker lg lim liminf limsup ln log max min Pr sec sin sinh sup tan tanh"
    .split(" ").map((c) => "\\" + c),
])];
const SUPPORTED_ENVIRONMENTS = ["matrix", "pmatrix", "bmatrix", "Bmatrix", "vmatrix", "Vmatrix", "smallmatrix", "cases"];
const ENVIRONMENTS = SUPPORTED_ENVIRONMENTS.slice(0, -1).join(", ") + ", and cases";
const MAX_LISTED   = 60;   // Most arguments listed for commands like \mathcal
// How to write commands that UnicodeIt handles but that need arguments (accents get "\hat{x}").
const ARGUMENT_EXAMPLES: Record<string, string> = {
  frac: "\\frac{a}{b}", dfrac: "\\dfrac{a}{b}", tfrac: "\\tfrac{a}{b}", sqrt: "\\sqrt{x}",
  text: "\\text{words}", mbox: "\\mbox{words}", operatorname: "\\operatorname{sgn}",
  mathrm: "\\mathrm{d}", left: "\\left( ... \\right)", right: "\\left( ... \\right)",
};

// "“a”", "“a” and “b”", or "“a”, “b”, and “c”".
function quoteList(items: string[]): string {
  const quoted = items.map((item) => `“${item}”`);
  return quoted.length < 3 ? quoted.join(" and ")
    : `${quoted.slice(0, -1).join(", ")}, and ${quoted[quoted.length - 1]}`;
}

function shortList(items: string[]): string {
  return items.length > MAX_LISTED ? items.slice(0, MAX_LISTED).join(" ") + " …" : items.join(" ");
}

// Why a \begin or \end wasn't converted. Supported environments are converted whenever they are
// complete, so one that is highlighted is missing its \end or \begin, or a brace.
function explainEnvironment(name: string, argument: string, after: string): Reason {
  const environment = argument.match(/^\{([^{}]*)\}/)?.[1];
  if (environment === undefined) {
    const unclosed = after.match(/^\s*\{([A-Za-z*]*)/);
    return {
      summary: unclosed ? `${name}{${unclosed[1]} is missing its closing brace “}”.`
                        : `${name} needs an environment name in braces, like ${name}{bmatrix}.`,
    };
  }
  if (!SUPPORTED_ENVIRONMENTS.includes(environment)) {
    return {
      summary: `The ${environment} environment isn't supported.`,
      details: `Only ${ENVIRONMENTS} are converted.`,
    };
  }
  return {
    summary: name === "\\begin"
      ? `The ${environment} environment isn't closed. Add \\end{${environment}} after it.`
      : `This \\end{${environment}} has no matching \\begin{${environment}} before it.`,
  };
}

// Why a highlighted piece of the output couldn't be converted, given the text that follows it.
function explain(text: string, after: string): Reason {
  const script = text.match(/^([_^])\{?(.*?)\}?$/su);
  if (script) {
    const name    = script[1] === "^" ? "superscript" : "subscript";
    const bases   = SCRIPT_BASES[script[1]];
    const missing = [...new Set([...script[2]].filter((c) => !/\s/.test(c) && !bases.includes(c)))];
    return {
      summary: `Unicode has no ${name} ${missing.length ? quoteList(missing) : "for this"}.`,
      details: `${name[0].toUpperCase() + name.slice(1)}s exist only for ${bases.join(" ")}.`,
    };
  }

  const [, name, argument] = text.match(/^(\\[A-Za-z]+)(.*)$/su)!;
  if (name === "\\begin" || name === "\\end") return explainEnvironment(name, argument, after);
  // Commands like \mathcal{A} that work for some arguments but not this one.
  const variants = replacements.map(([latex]) => latex)
    .filter((latex) => latex.startsWith(name + "{"))
    .map((latex) => latex.slice(name.length).replace(/^\{(.*)\}$/s, "$1"));
  if (variants.length && argument) {
    return {
      summary: `Unicode has no ${name} version of “${argument.replace(/^\{(.*)\}$/s, "$1")}”.`,
      details: `${name} works for ${shortList(variants)}.`,
    };
  }
  // A command UnicodeIt knows but couldn't convert here is missing its arguments.
  const example = ARGUMENT_EXAMPLES[name.slice(1)]
    ?? (combiningmarks.some(([mark]) => mark === name) ? name + "{x}" : undefined);
  if (example) {
    const count = /\\[dt]?frac$/.test(name) ? "two arguments" : "an argument";
    return { summary: `${name} needs ${count}, like ${example}.` };
  }
  const suggestion = suggest(name);
  return {
    summary: suggestion ? `UnicodeIt doesn't know ${name}. Did you mean ${suggestion}?`
                        : `UnicodeIt doesn't know ${name}.`,
  };
}

// The known command closest to a misspelled one, if any is within two edits. Among equally close
// commands, one with the same letters is preferred, so "\alpah" suggests "\alpha", not "\aleph".
function suggest(name: string): string | undefined {
  const letters = (s: string) => [...s].sort().join("");
  let best: string | undefined;
  let bestScore = 3;
  for (const command of KNOWN_COMMANDS) {
    const score = distance(name, command) - (letters(command) === letters(name) ? 0.5 : 0);
    if (score < bestScore && command !== name) [best, bestScore] = [command, score];
  }
  return best;
}

// ╭────────────────────────────────────────╮
// │            Conversion logic            │
// ╰────────────────────────────────────────╯

// Converts LaTeX to Unicode, split into segments so the parts that weren't converted can be highlighted.
export function convertLatex(latex: string, options: ReplaceOptions = {}): Segment[] {
  const text = replace(latex, { mathSpacing: true, ...options });
  const segments: Segment[] = [];
  let last = 0;
  for (const match of text.matchAll(UNSUPPORTED_RE)) {
    const whole = match[0];
    if (match.index > last) segments.push({ text: text.slice(last, match.index) });
    segments.push({ text: whole, unsupported: explain(whole, text.slice(match.index + whole.length)) });
    last = match.index + whole.length;
  }
  if (last < text.length) segments.push({ text: text.slice(last) });
  return segments;
}

// Symbols whose command contains the query (ignoring a leading backslash) or whose symbol equals it.
function searchSymbols(query: string): SymbolEntry[] {
  const q = query.trim().replace(/^\\/, "").toLowerCase();
  if (!q) return SYMBOLS;
  return SYMBOLS.filter((s) => s.command.toLowerCase().includes(q) || s.symbol.includes(query.trim()));
}

// ╭────────────────────────────────────────╮
// │              Page wiring               │
// ╰────────────────────────────────────────╯

function initPage(): void {
  // ⋘──────── Element lookups ────────⋙
  const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;

  const input        = $<HTMLTextAreaElement>("lu-input");
  if (!input) return;   // Not on the converter page
  const clearButton  = $<HTMLButtonElement>("lu-clear");
  const output       = $<HTMLDivElement>("lu-output");
  const copyButton   = $<HTMLButtonElement>("lu-copy");
  const message      = $<HTMLUListElement>("lu-message");
  const styleForm    = $<HTMLFormElement>("lu-style");
  const vulgarBox    = $<HTMLInputElement>("lu-vulgar");
  const search       = $<HTMLInputElement>("lu-search");
  const symbolList   = $<HTMLUListElement>("lu-symbols");
  const symbolStatus = $<HTMLParagraphElement>("lu-symbol-status");

  // ⋘──────── Conversion ────────⋙

  // localStorage can be unavailable (private windows, blocked storage); the page works without it.
  const load = (key: string): string | null => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key: string, value: string): void => { try { localStorage.setItem(key, value); } catch { /* not saved */ } };

  // Pieces whose details are open, so they stay open while typing.
  const openDetails = new Set<string>();

  // One item per distinct piece that wasn't converted: a short reason, and a "?" button for details.
  function reasonItem(text: string, reason: Reason): HTMLLIElement {
    const item = document.createElement("li");
    const code = document.createElement("code");
    code.textContent = text;
    item.append(code, " ", reason.summary);
    if (reason.details) {
      const button  = document.createElement("button");
      const details = document.createElement("p");
      button.type = "button";
      button.className = "lu-why";
      button.textContent = "?";
      button.setAttribute("aria-label", "Why?");
      button.title = "More details";
      details.className = "lu-why-details";
      details.textContent = reason.details;
      const show = (open: boolean) => {
        details.hidden = !open;
        button.setAttribute("aria-expanded", String(open));
      };
      show(openDetails.has(text));
      button.addEventListener("click", () => {
        const open = details.hidden;
        if (open) openDetails.add(text); else openDetails.delete(text);
        show(open);
      });
      item.append(" ", button, details);
    }
    return item;
  }

  // An empty input shows the example (the placeholder) converted, dimmed, as a hint.
  function convert(): void {
    const hint        = input.value === "";
    const display     = new FormData(styleForm).get("style") === "display";
    const segments    = convertLatex(hint ? input.placeholder : input.value,
                                     { display, vulgarFractions: vulgarBox.checked });
    const unsupported = segments.filter((s) => s.unsupported);
    output.classList.toggle("lu-output-hint", hint);
    clearButton.hidden = hint;
    copyButton.hidden  = hint;
    output.replaceChildren(...segments.map((segment) => {
      if (!segment.unsupported) return segment.text;
      const mark = document.createElement("mark");
      mark.textContent = segment.text;
      mark.title = segment.unsupported.summary
        + (segment.unsupported.details ? "\n" + segment.unsupported.details : "");
      return mark;
    }));
    const reasons = new Map(unsupported.map((s) => [s.text, s.unsupported!]));
    message.hidden = reasons.size === 0;
    message.replaceChildren(...[...reasons].map(([text, reason]) => reasonItem(text, reason)));
  }

  input.addEventListener("input", () => {
    save(INPUT_KEY, input.value);
    convert();
  });
  styleForm.addEventListener("change", () => {
    save(STYLE_KEY, new FormData(styleForm).get("style") as string);
    convert();
  });
  // Clearing goes through the browser's editing commands so that Ctrl+Z brings the text back
  // (setting input.value would clear the undo history). That fires "input", which saves and converts.
  vulgarBox.addEventListener("change", () => {
    save(VULGAR_KEY, String(vulgarBox.checked));
    convert();
  });
  clearButton.addEventListener("click", () => {
    input.focus();
    input.select();
    if (!document.execCommand("delete")) {
      input.value = "";
      input.dispatchEvent(new Event("input"));
    }
  });

  // Restore the last entry and style from a previous visit.
  input.value = load(INPUT_KEY) ?? "";
  const savedStyle = styleForm.querySelector<HTMLInputElement>(`input[value="${load(STYLE_KEY)}"]`);
  if (savedStyle) savedStyle.checked = true;
  vulgarBox.checked = load(VULGAR_KEY) === "true";

  // The button shows an icon; success and failure are shown by swapping the icon and color via CSS classes.
  let copyResetTimer: number | undefined;
  copyButton.addEventListener("click", async () => {
    let state: "lu-copied" | "lu-copy-failed";
    try {
      await navigator.clipboard.writeText(output.textContent ?? "");
      state = "lu-copied";
    } catch {
      state = "lu-copy-failed";
    }
    copyButton.classList.remove("lu-copied", "lu-copy-failed");
    void copyButton.offsetWidth;   // Restart the CSS animation on repeated clicks
    copyButton.classList.add(state);
    copyButton.setAttribute("aria-label", state === "lu-copied" ? "Copied" : "Copy failed");
    clearTimeout(copyResetTimer);
    copyResetTimer = window.setTimeout(() => {
      copyButton.classList.remove("lu-copied", "lu-copy-failed");
      copyButton.setAttribute("aria-label", "Copy result");
    }, 1500);
  });

  // ⋘──────── Symbol list ────────⋙

  // Inserts a command at the cursor in the input. A space is added after commands that end in a
  // letter so that typing more letters doesn't merge with the command (e.g. "\alpha x", not "\alphax").
  function insertCommand(command: string): void {
    const insertion = /[A-Za-z]$/.test(command) ? command + " " : command;
    const start = input.selectionStart;
    const end   = input.selectionEnd;
    input.setRangeText(insertion, start, end, "end");
    // Put the cursor inside the braces of commands like "\hat{}".
    if (command.endsWith("{}")) input.selectionStart = input.selectionEnd = start + insertion.length - 1;
    input.focus();
    convert();
  }

  function renderSymbols(): void {
    const matches = searchSymbols(search.value);
    symbolList.replaceChildren(...matches.slice(0, MAX_SHOWN).map((entry) => {
      const item   = document.createElement("li");
      const button = document.createElement("button");
      button.type  = "button";
      button.className = "lu-symbol";
      button.title = `Insert ${entry.command}`;
      const symbol  = document.createElement("span");
      symbol.className = "lu-symbol-char";
      symbol.textContent = entry.symbol;
      const command = document.createElement("code");
      command.textContent = entry.command;
      button.append(symbol, command);
      button.addEventListener("click", () => insertCommand(entry.command));
      item.append(button);
      return item;
    }));
    symbolStatus.textContent =
      matches.length === 0         ? "No matching symbols."
      : matches.length > MAX_SHOWN ? `Showing ${MAX_SHOWN} of ${matches.length} symbols. Search to narrow the list.`
      :                              `${matches.length} symbol${matches.length === 1 ? "" : "s"}.`;
  }

  search.addEventListener("input", renderSymbols);

  convert();
  renderSymbols();
}

if (typeof document !== "undefined") {
  // Module scripts are deferred, but guard in case the DOM is still loading.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    initPage();
  }
}
