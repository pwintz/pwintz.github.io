// ╭───────────────────────────────────────────────────────────────╮
// │              Convert LaTeX commands to Unicode                │
// ╰───────────────────────────────────────────────────────────────╯
// Uses UnicodeIt (https://github.com/svenkreiss/unicodeit) to turn LaTeX like "\alpha^2 \leq x_{12}"
// into plain Unicode text ("α² ≤ x₁₂") that can be pasted anywhere, such as emails or code comments.
// The page also lists every symbol UnicodeIt knows, so they can be searched and inserted.

import { convertLatex, Reason, searchSymbols } from "./latex_unicode/convert";
import { loadString as load, saveString as save } from "./common/storage";

// ⋘──────── Constants ────────⋙

const MAX_SHOWN     = 240;   // Most symbols shown at once, to keep the list fast
const INPUT_KEY     = "latex-unicode-input";   // localStorage keys for the last entry and style
const STYLE_KEY     = "latex-unicode-style";
const VULGAR_KEY    = "latex-unicode-vulgar-fractions";

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
