// ╭───────────────────────────────────────────────────────────────╮
// │        LaTeX to Unicode: conversion and explanations          │
// ╰───────────────────────────────────────────────────────────────╯
// The conversion logic for ../latex_unicode.ts, with no page code, so it can be tested.

import { distance } from "fastest-levenshtein";
import { replace, ReplaceOptions } from "unicodeit/ts_src/replace";
import { replacements, combiningmarks, subsuperscripts } from "unicodeit/ts_src/data";

// ⋘──────── Types and constants ────────⋙

export interface SymbolEntry {
  command : string;   // The LaTeX command, e.g. "\alpha" or "\hat{}"
  symbol  : string;   // What it becomes, e.g. "α" (combining marks are shown on a dotted circle)
}

// A piece of the converted text, flagged if UnicodeIt couldn't convert it.
export interface Reason {
  summary  : string;    // A short reason, always shown
  details? : string;    // Longer explanation, shown on request (e.g. which characters have superscripts)
}

export interface Segment {
  text         : string;
  unsupported? : Reason;   // Why it wasn't converted
}

const DOTTED_CIRCLE = "◌";   // Base character for showing combining marks alone

// What's left in UnicodeIt's output that it couldn't convert:
//  1. Commands it doesn't know, with any brace arguments (e.g. "\overbrace{abc}").
//  2. "^" or "_" before a character, or a group of them, without Unicode super/subscripts
//     (e.g. "^π" or "_{x→0}"). UnicodeIt converts a group only if it can convert all of it.
const UNSUPPORTED_RE = /(\\[A-Za-z]+(?:\{[^{}]*\})*)|([_^])(\{[^{}]*\}|.)/gu;

// Every command, shortest first so that searches put "\in" before "\infty", "\int", etc.
export const SYMBOLS: SymbolEntry[] = [
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
export function quoteList(items: string[]): string {
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
export function explain(text: string, after: string): Reason {
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
export function suggest(name: string): string | undefined {
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
export function searchSymbols(query: string): SymbolEntry[] {
  const q = query.trim().replace(/^\\/, "").toLowerCase();
  if (!q) return SYMBOLS;
  return SYMBOLS.filter((s) => s.command.toLowerCase().includes(q) || s.symbol.includes(query.trim()));
}
