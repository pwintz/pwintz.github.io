// ╭───────────────────────────────────────────────────────────────╮
// │        Gmail link converter: converting URLs                   │
// ╰───────────────────────────────────────────────────────────────╯
// The conversion logic for ../gmail_link.ts, with no page code, so it can be tested.

// ⋘──────── Types and constants ────────⋙

export interface ConversionResult {
  url   : string;          // The converted URL
  index : number | null;   // The account index that was replaced (null if none)
  email : string | null;   // The email substituted for that index
  note? : string;          // Optional informational message for the user
}

const ACCOUNT_RE  = /\/u\/(\d+)(?=\/|$)/;          // Matches "/u/0" followed by "/" or end of path
const EMAIL_RE    = /\/[ua]\/([^/]+@[^/]+)(?=\/|$)/; // Matches "/a/someone@example.com" (or "/u/…")
const ADDRESS_RE  = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/; // A plausible email: "name@domain.tld", no spaces

// ╭────────────────────────────────────────╮
// │            Conversion logic            │
// ╰────────────────────────────────────────╯

// Encodes an email for use in a URL path, keeping "@" readable (Google accepts it literally).
export function encodeEmail(email: string): string {
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

// The URL as text, with "@" left readable in the authuser parameter (Google accepts it unencoded).
export function readableHref(url: URL): string {
  return url.href.replace(/([?&]authuser=)([^&#]*)/, (_, key: string, value: string) => key + value.replace(/%40/gi, "@"));
}

// Looks up the email for an account index, throwing a readable error if it's missing or invalid.
export function emailFor(index: number, accounts: string[]): string {
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

  const isGmail = url.hostname === "mail.google.com";

  // ⋘──────── Already email-based ────────⋙
  const emailInPath = url.pathname.match(EMAIL_RE);
  if (emailInPath && !isGmail) {
    // Other apps don't accept an email in the path (e.g. links made by an earlier version of this
    // tool), so move it to the authuser parameter.
    const email = decodeURIComponent(emailInPath[1]);
    url.pathname = url.pathname.replace(EMAIL_RE, "");
    url.searchParams.set("authuser", email);
    return { url: readableHref(url), index: null, email, note: "Moved the email address to the authuser parameter, which this app supports." };
  }
  if (emailInPath || url.searchParams.get("authuser")?.includes("@")) {
    return { url: readableHref(url), index: null, email: null, note: "This URL already uses an email address." };
  }

  // ⋘──────── Case 1: "/u/N/" in the path: Gmail → "/a/email/", other apps → "?authuser=email" ────────⋙
  const match = url.pathname.match(ACCOUNT_RE);
  if (match) {
    const index = parseInt(match[1], 10);
    const email = emailFor(index, accounts);
    if (isGmail) {
      url.pathname = url.pathname.replace(ACCOUNT_RE, `/a/${encodeEmail(email)}`);
    } else {
      url.pathname = url.pathname.replace(ACCOUNT_RE, "");
      url.searchParams.set("authuser", email);
    }
    return { url: readableHref(url), index, email };
  }

  // ⋘──────── Case 2: "?authuser=N" query parameter ────────⋙
  const authuser = url.searchParams.get("authuser");
  if (authuser !== null && /^\d+$/.test(authuser)) {
    const index = parseInt(authuser, 10);
    const email = emailFor(index, accounts);
    url.searchParams.set("authuser", email);
    return { url: readableHref(url), index, email };
  }

  // ⋘──────── Case 3: bare Gmail URL ("/mail/" with no index means account 0) ────────⋙
  if (url.hostname === "mail.google.com" && /^\/mail(\/|$)/.test(url.pathname)) {
    const email = emailFor(0, accounts);
    url.pathname = url.pathname.replace(/^\/mail\/?/, `/mail/a/${encodeEmail(email)}/`);
    return { url: readableHref(url), index: 0, email, note: "No account index found, so u/0 (the default) was assumed." };
  }

  throw new Error("Couldn't find an account index (/u/N/ or authuser=N) in that URL.");
}

// Blank entries at the end of the account list aren't stored. Blanks in the middle are kept, since
// they hold the numbering (u/N) of the accounts after them.
export function trimTrailingBlanks(accounts: string[]): string[] {
  const stored = [...accounts];
  while (stored.length > 0 && stored[stored.length - 1].trim() === "") {
    stored.pop();
  }
  return stored;
}
