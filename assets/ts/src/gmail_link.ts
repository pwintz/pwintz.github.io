// ╭───────────────────────────────────────────────────────────────╮
// │        Convert index-based Google URLs to email-based         │
// ╰───────────────────────────────────────────────────────────────╯
// Converts URLs like https://mail.google.com/mail/u/0/#inbox/abc into
// https://mail.google.com/mail/a/me@gmail.com/#inbox/abc so that the link opens
// in the same account regardless of the order the accounts were signed in.
//
// The index → email mapping is stored only in this browser's localStorage,
// so no email addresses are published in the site's source.

// ⋘──────── Types and constants ────────⋙

export interface ConversionResult {
  url   : string;          // The converted URL
  index : number | null;   // The account index that was replaced (null if none)
  email : string | null;   // The email substituted for that index
  note? : string;          // Optional informational message for the user
}

const STORAGE_KEY = "gmail-link-accounts";        // localStorage key for the account list
const ACCOUNT_RE  = /\/u\/(\d+)(?=\/|$)/;          // Matches "/u/0" followed by "/" or end of path
const EMAIL_RE    = /\/[ua]\/[^/]+@[^/]+(?=\/|$)/; // Matches "/a/someone@example.com" (or "/u/…")
const ADDRESS_RE  = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/; // A plausible email: "name@domain.tld", no spaces

// Icons for the account rows (static markup, styled by the page's CSS).
const GRIP_ICON  = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>`;
const TRASH_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>`;

// ╭────────────────────────────────────────╮
// │            Conversion logic            │
// ╰────────────────────────────────────────╯

// Encodes an email for use in a URL path, keeping "@" readable (Google accepts it literally).
function encodeEmail(email: string): string {
  return encodeURIComponent(email).replace(/%40/g, "@");
}

// Returns a user-facing problem with the email saved for account u/index, or "" if it's fine.
// An empty entry is not an error here; it just means the account hasn't been filled in.
export function emailProblem(index: number, accounts: string[]): string {
  const email = (accounts[index] ?? "").trim();
  if (!email) {
    return "";
  }
  if (!ADDRESS_RE.test(email)) {
    return "Enter a valid email address, like name@example.com.";
  }
  const first = accounts.findIndex((other) => other.trim().toLowerCase() === email.toLowerCase());
  if (first !== index) {
    return `This email is already used for u/${first}. Each account appears only once in Google's list.`;
  }
  return "";
}

// Looks up the email for an account index, throwing a readable error if it's missing or invalid.
function emailFor(index: number, accounts: string[]): string {
  const email = (accounts[index] ?? "").trim();
  if (!email) {
    throw new Error(`No email address is saved for account u/${index}. Add it in the table below.`);
  }
  const problem = emailProblem(index, accounts);
  if (problem) {
    throw new Error(`The email saved for u/${index} needs fixing: ${problem}`);
  }
  return email;
}

// Converts a single URL. Throws an Error with a user-facing message on failure.
export function convertUrl(input: string, accounts: string[]): ConversionResult {
  // ⋘──────── Parse the input ────────⋙
  let raw = input.trim();
  if (!raw) {
    throw new Error("Paste a URL first.");
  }
  if (!/^[a-z]+:\/\//i.test(raw)) {
    raw = `https://${raw}`;   // Allow pasting without the scheme
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }

  if (!/(^|\.)google\.com$/i.test(url.hostname)) {
    throw new Error("Only google.com URLs (Gmail, Drive, Docs, Calendar, …) are supported.");
  }

  // ⋘──────── Already email-based: nothing to do ────────⋙
  if (EMAIL_RE.test(url.pathname)) {
    return { url: url.href, index: null, email: null, note: "This URL already uses an email address." };
  }

  // ⋘──────── Case 1: "/u/N/" in the path (Gmail, Drive, Docs, Calendar) → "/a/email/" ────────⋙
  const match = url.pathname.match(ACCOUNT_RE);
  if (match) {
    const index = parseInt(match[1], 10);
    const email = emailFor(index, accounts);
    url.pathname = url.pathname.replace(ACCOUNT_RE, `/a/${encodeEmail(email)}`);
    return { url: url.href, index, email };
  }

  // ⋘──────── Case 2: "?authuser=N" query parameter ────────⋙
  const authuser = url.searchParams.get("authuser");
  if (authuser !== null && /^\d+$/.test(authuser)) {
    const index = parseInt(authuser, 10);
    const email = emailFor(index, accounts);
    url.searchParams.set("authuser", email);
    return { url: url.href, index, email };
  }

  // ⋘──────── Case 3: bare Gmail URL ("/mail/" with no index means account 0) ────────⋙
  if (url.hostname === "mail.google.com" && /^\/mail(\/|$)/.test(url.pathname)) {
    const email = emailFor(0, accounts);
    url.pathname = url.pathname.replace(/^\/mail\/?/, `/mail/a/${encodeEmail(email)}/`);
    return { url: url.href, index: 0, email, note: "No account index found, so u/0 (the default) was assumed." };
  }

  throw new Error("Couldn't find an account index (/u/N/ or authuser=N) in that URL.");
}

// ╭────────────────────────────────────────╮
// │             Account storage            │
// ╰────────────────────────────────────────╯

// Reads the saved account list; storage can be unavailable (private mode, blocked cookies).
function loadAccounts(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

// Blank entries at the end aren't stored. Blanks in the middle are kept, since they hold the
// numbering (u/N) of the accounts after them.
function saveAccounts(accounts: string[]): void {
  const stored = [...accounts];
  while (stored.length > 0 && stored[stored.length - 1].trim() === "") {
    stored.pop();
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage unavailable: the list still works for this visit, it just won't persist.
  }
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

  // Lets a row be reordered by dragging its handle. Pointer events cover mouse, pen, and touch.
  // The whole <li> moves in the DOM, but relabelRows() rewrites every "u/N" label by position,
  // so the numbers stay where they are and only the email entries appear to move.
  function enableDrag(row: HTMLLIElement, handle: HTMLButtonElement): void {
    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      row.classList.add("gl-dragging");
      // Listen on window rather than using pointer capture: moving the row in the DOM releases
      // capture, which would drop the rest of the drag.

      // Only the body (the email box, with its handle) is transformed, never the <li>, so <li> boxes
      // always give the untransformed slot positions.
      const body     = row.querySelector<HTMLElement>(".gl-account-body")!;
      const startY   = event.clientY;
      const startTop = row.getBoundingClientRect().top;
      const bodyOf   = (other: Element) => other.querySelector<HTMLElement>(".gl-account-body")!;

      // Keeps the dragged body under the pointer, wherever its row currently sits in the list.
      const follow = (clientY: number) => {
        const shift = row.getBoundingClientRect().top - startTop;
        body.style.transform = `translateY(${clientY - startY - shift}px)`;
      };

      // Moves the dragged row before `before` (null = to the end), sliding the other entries to
      // their new slots: record where they were, move the row, then animate from old to new.
      const moveRow = (before: Element | null) => {
        const others  = [...accountList.children].filter((other) => other !== row);
        const oldTops = new Map(others.map((other) => [other, other.getBoundingClientRect().top]));
        accountList.insertBefore(row, before);
        relabelRows();
        for (const other of others) {
          const delta = oldTops.get(other)! - other.getBoundingClientRect().top;
          if (delta === 0) continue;
          bodyOf(other).animate(
            [{ transform: `translateY(${delta}px)` }, { transform: "translateY(0)" }],
            { duration: 150, easing: "ease-out" },
          );
        }
      };

      const middle = (other: Element) => {
        const box = other.getBoundingClientRect();
        return box.top + box.height / 2;
      };

      // Swap with a neighbor once the dragged entry's edge crosses that neighbor's midpoint.
      // Loop so a fast drag can pass several rows in one move.
      const onMove = (moveEvent: PointerEvent) => {
        follow(moveEvent.clientY);
        for (;;) {
          const dragged = body.getBoundingClientRect();
          const next    = row.nextElementSibling;
          const prev    = row.previousElementSibling;
          if (next && dragged.bottom > middle(next)) {
            moveRow(next.nextElementSibling);
          } else if (prev && dragged.top < middle(prev)) {
            moveRow(prev);
          } else {
            break;
          }
          follow(moveEvent.clientY);
        }
      };

      const onEnd = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);

        // Each row remembers its original index; read the new order from the DOM.
        const order   = [...accountList.children].map((other) => Number((other as HTMLElement).dataset.index));
        const changed = order.some((original, position) => original !== position);

        // Settle the dragged entry into its slot, then save (which redraws the list).
        const settle = body.animate(
          [{ transform: body.style.transform || "translateY(0)" }, { transform: "translateY(0)" }],
          { duration: 120, easing: "ease-out" },
        );
        body.style.transform = "";
        settle.onfinish = () => {
          row.classList.remove("gl-dragging");
          if (changed) setAccounts(order.map((original) => accounts[original]));
        };
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);
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
