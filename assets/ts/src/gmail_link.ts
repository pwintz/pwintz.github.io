// ╭───────────────────────────────────────────────────────────────╮
// │        Convert index-based Google URLs to email-based         │
// ╰───────────────────────────────────────────────────────────────╯
// Converts URLs like https://mail.google.com/mail/u/0/#inbox/abc into
// https://mail.google.com/mail/a/me@gmail.com/#inbox/abc so that the link opens
// in the same account regardless of the order the accounts were signed in.
//
// Gmail accepts the email in the path ("/a/email/"), but Drive, Docs, Calendar, and other Google
// apps don't, so for those the account index is removed from the path and the email is given as
// the "authuser" query parameter instead (e.g. https://drive.google.com/drive/my-drive?authuser=me@gmail.com).
//
// The index → email mapping is stored only in this browser's localStorage,
// so no email addresses are published in the site's source.

import { loadJSON, saveJSON } from "./common/storage";
import { enableDragReorder } from "./common/drag_reorder";
import { convertUrl, emailProblem, trimTrailingBlanks } from "./gmail_link/convert";

// ⋘──────── Constants ────────⋙

const STORAGE_KEY = "gmail-link-accounts";        // localStorage key for the account list

// Icons for the account rows (static markup, styled by the page's CSS).
const GRIP_ICON  = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>`;
const TRASH_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>`;

// ╭────────────────────────────────────────╮
// │             Account storage            │
// ╰────────────────────────────────────────╯

// Reads the saved account list; storage can be unavailable (private mode, blocked cookies).
function loadAccounts(): string[] {
  const parsed = loadJSON(STORAGE_KEY);
  return Array.isArray(parsed) ? parsed.map(String) : [];
}

// Blank entries at the end aren't stored (see trimTrailingBlanks).
function saveAccounts(accounts: string[]): void {
  const stored = trimTrailingBlanks(accounts);
  // If storage is unavailable, the list still works for this visit, it just won't persist.
  saveJSON(STORAGE_KEY, stored);
}

// ╭────────────────────────────────────────╮
// │              Page wiring               │
// ╰────────────────────────────────────────╯

function initPage(): void {
  // ⋘──────── Element lookups ────────⋙
  const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;

  const form        = $<HTMLFormElement>("gl-form");
  if (!form) return;   // Not on the converter page
  const input       = $<HTMLInputElement>("gl-input");
  const output      = $<HTMLDivElement>("gl-output");
  const outputLink  = $<HTMLAnchorElement>("gl-output-link");
  const copyButton  = $<HTMLButtonElement>("gl-copy");
  const clearButton = $<HTMLButtonElement>("gl-clear");
  const message     = $<HTMLParagraphElement>("gl-message");
  const accountList = $<HTMLOListElement>("gl-accounts");
  const addButton   = $<HTMLButtonElement>("gl-add");
  const bookmarklet = $<HTMLAnchorElement>("gl-bookmarklet");

  let accounts = loadAccounts();
  if (accounts.length === 0) {
    accounts = [""];   // Start with one empty row for u/0
  }

  // ⋘──────── Account table (u/N) ────────⋙

  // Shows or clears the validation error on each row. A row's error is shown once the user has
  // left its field (or it was loaded from storage), so half-typed addresses aren't flagged.
  // Every row is rechecked because editing one row can create or resolve a duplicate in another.
  function showAccountErrors(): void {
    accounts.forEach((_, index) => {
      const field = document.getElementById(`gl-account-${index}`) as HTMLInputElement | null;
      const error = document.getElementById(`gl-account-error-${index}`);
      if (!field || !error) return;
      const problem = field.dataset.touched ? emailProblem(index, accounts) : "";
      error.textContent = problem;
      error.hidden      = problem === "";
      field.setAttribute("aria-invalid", String(problem !== ""));
    });
  }

  // Replaces the account list (after a removal or reorder), then saves, redraws, and reconverts.
  function setAccounts(next: string[]): void {
    accounts = next.length > 0 ? next : [""];   // Always keep one row for u/0
    saveAccounts(accounts);
    renderAccounts();
    convert();
  }

  // Moves the account at `from` to position `to` (keyboard reordering).
  function moveAccount(from: number, to: number): void {
    if (to < 0 || to >= accounts.length) return;
    const next = [...accounts];
    next.splice(to, 0, ...next.splice(from, 1));
    setAccounts(next);
    document.getElementById(`gl-handle-${to}`)?.focus();
  }

  // Relabels rows by their current position, so "u/N" updates live while a row is dragged.
  function relabelRows(): void {
    accountList.querySelectorAll("label").forEach((label, position) => {
      label.textContent = `u/${position}`;
    });
  }

  // Lets a row be reordered by dragging its handle (see common/drag_reorder.ts).
  // The whole <li> moves in the DOM, but relabelRows() rewrites every "u/N" label by position,
  // so the numbers stay where they are and only the email entries appear to move.
  function enableDrag(row: HTMLLIElement, handle: HTMLButtonElement): void {
    enableDragReorder({
      list: accountList,
      item: row,
      handle,
      bodyOf: (other) => other.querySelector<HTMLElement>(".gl-account-body")!,
      draggingClass: "gl-dragging",
      onMove: relabelRows,
      // Saving redraws the list.
      onEnd: (order, changed) => {
        if (changed) setAccounts(order.map((original) => accounts[original]));
      },
    });
  }

  // Rebuilds the account rows from the `accounts` array.
  function renderAccounts(): void {
    accountList.replaceChildren();
    accounts.forEach((email, index) => {
      const row = document.createElement("li");
      row.className     = "gl-account";
      row.dataset.index = String(index);

      const handle = document.createElement("button");
      handle.type      = "button";
      handle.id        = `gl-handle-${index}`;
      handle.className = "gl-handle";
      handle.title     = "Drag to reorder (or use the arrow keys)";
      handle.setAttribute("aria-label", `Move account u/${index}. Use the up and down arrow keys.`);
      handle.innerHTML = GRIP_ICON;
      handle.hidden    = accounts.length < 2;   // Nothing to reorder with a single account
      handle.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          event.preventDefault();
          moveAccount(index, index + (event.key === "ArrowUp" ? -1 : 1));
        }
      });
      enableDrag(row, handle);

      const label = document.createElement("label");
      label.textContent = `u/${index}`;
      label.htmlFor = `gl-account-${index}`;

      const field = document.createElement("input");
      field.type         = "email";
      field.id           = `gl-account-${index}`;
      field.value        = email;
      field.placeholder  = "you@example.com";
      field.autocomplete = "email";
      field.setAttribute("aria-describedby", `gl-account-error-${index}`);
      if (email) field.dataset.touched = "true";   // Saved entries are checked right away
      field.addEventListener("input", () => {
        accounts[index] = field.value.trim();
        saveAccounts(accounts);
        showAccountErrors();   // Clears an error as soon as the address becomes valid
        convert();             // Keep the result in sync with the account table
      });
      field.addEventListener("change", () => {
        field.dataset.touched = "true";
        showAccountErrors();
      });

      const error = document.createElement("p");
      error.id        = `gl-account-error-${index}`;
      error.className = "gl-account-error";
      error.hidden    = true;

      const remove = document.createElement("button");
      remove.type      = "button";
      remove.className = "gl-icon-button gl-remove";
      remove.title     = "Remove";
      remove.innerHTML = TRASH_ICON;
      remove.setAttribute("aria-label", `Remove account u/${index}`);
      remove.addEventListener("click", () => {
        // Later accounts shift down, matching Google's numbering.
        setAccounts(accounts.filter((_, other) => other !== index));
      });

      // The drag handle and remove button sit inside the email box, at its left and right edges.
      const box = document.createElement("div");
      box.className = "gl-field";
      box.append(handle, field, remove);

      // The label stays in its slot (relabelRows keeps "u/N" positional); only the body moves
      // while dragging, so the account numbers appear fixed.
      const body = document.createElement("div");
      body.className = "gl-account-body";
      body.append(box, error);

      row.append(label, body);
      accountList.append(row);
    });
    showAccountErrors();
  }

  addButton.addEventListener("click", () => {
    accounts.push("");
    saveAccounts(accounts);
    renderAccounts();
    document.getElementById(`gl-account-${accounts.length - 1}`)?.focus();
  });

  // ⋘──────── Conversion ────────⋙

  function showMessage(text: string, isError: boolean): void {
    message.textContent = text;
    message.classList.toggle("gl-error", isError);
    message.hidden = text === "";
  }

  function convert(): void {
    clearButton.hidden = input.value === "";
    if (input.value.trim() === "") {   // Nothing typed yet: show nothing instead of an error
      output.hidden = true;
      showMessage("", false);
      return;
    }
    try {
      const result = convertUrl(input.value, accounts);
      outputLink.href        = result.url;
      outputLink.textContent = result.url;
      output.hidden          = false;
      showMessage(result.note ?? "", false);
    } catch (error) {
      output.hidden = true;
      showMessage(error instanceof Error ? error.message : String(error), true);
    }
  }

  // Convert whenever the text changes (typing, pasting, or deleting).
  input.addEventListener("input", convert);

  clearButton.addEventListener("click", () => {
    input.value = "";
    convert();
    input.focus();   // Ready for the next paste
    // Drop a ?url= from the bookmarklet so a reload doesn't bring the old URL back.
    if (new URLSearchParams(location.search).has("url")) {
      history.replaceState(null, "", location.pathname);
    }
  });

  // Pressing Enter shouldn't reload the page.
  form.addEventListener("submit", (event) => event.preventDefault());

  // The button shows an icon; success and failure are shown by swapping the icon and color via CSS classes.
  let copyResetTimer: number | undefined;
  copyButton.addEventListener("click", async () => {
    let state: "gl-copied" | "gl-copy-failed";
    try {
      await navigator.clipboard.writeText(outputLink.href);
      state = "gl-copied";
    } catch {
      state = "gl-copy-failed";
    }
    copyButton.classList.remove("gl-copied", "gl-copy-failed");
    void copyButton.offsetWidth;   // Restart the CSS animation on repeated clicks
    copyButton.classList.add(state);
    copyButton.setAttribute("aria-label", state === "gl-copied" ? "Copied" : "Copy failed");
    clearTimeout(copyResetTimer);
    copyResetTimer = window.setTimeout(() => {
      copyButton.classList.remove("gl-copied", "gl-copy-failed");
      copyButton.setAttribute("aria-label", "Copy link");
    }, 1500);
  });

  // ⋘──────── Bookmarklet and ?url= input ────────⋙

  // The bookmarklet sends the current tab's URL to this page as ?url=...
  const pageUrl = location.origin + location.pathname;
  bookmarklet.href =
    `javascript:location.href=${JSON.stringify(pageUrl + "?url=")}+encodeURIComponent(location.href)`;

  renderAccounts();

  const incoming = new URLSearchParams(location.search).get("url");
  if (incoming) {
    input.value = incoming;
    convert();
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
