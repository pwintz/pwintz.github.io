// ╭───────────────────────────────────────────────────────────────╮
// │            The tool's settings in the page's address           │
// ╰───────────────────────────────────────────────────────────────╯
// Shared by the discrete linear system tool (../discrete_linear_system.ts) and its tests.
// The address holds the matrix, the starting state, the number of steps, the current step, and
// the view options, so a link opens the page as it was:
//   ?A=1,1;0.1,1&x0=-5,2&n=20&k=3&show=lp
// Entries are kept as typed (such as "1/4"). In `show`, l = eigenvector lines, p = eigenvector
// parts, and c = circle of starting states.

export interface SharedSettings {
  A: string[];          // a₁₁, a₁₂, a₂₁, a₂₂, as typed
  x0: string[];         // The two coordinates of x₀, as typed
  steps: number;
  k: number;
  lines: boolean;
  parts: boolean;
  circle: boolean;
}

export const SHARE_KEYS = ["A", "x0", "n", "k", "show"] as const;

// Entries are numbers, decimals, and fractions, so only a few characters need escaping.
const ENTRY = /^[-−–]?[0-9.]*(\/[-−–]?[0-9.]*)?$/;
const clean = (s: string) => s.trim().replace(/[−–]/g, "-");

/** The query parameters (without "?") for these settings. */
export function encodeSettings(s: SharedSettings): string[] {
  const show = `${s.lines ? "l" : ""}${s.parts ? "p" : ""}${s.circle ? "c" : ""}`;
  return [
    `A=${s.A.slice(0, 2).map(clean).join(",")};${s.A.slice(2).map(clean).join(",")}`,
    `x0=${s.x0.map(clean).join(",")}`,
    `n=${s.steps}`,
    `k=${s.k}`,
    `show=${show}`,
  ];
}

/**
 * The settings in a query string, each one only if it is present and valid. `isEntry` checks that
 * an entry can be read as a number. `stepChoices` lists the allowed numbers of steps.
 */
export function decodeSettings(search: string, isEntry: (s: string) => boolean, stepChoices: readonly number[]): Partial<SharedSettings> {
  const params = new Map<string, string>();
  for (const part of search.replace(/^\?/, "").split("&")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    try {
      params.set(decodeURIComponent(part.slice(0, i)), decodeURIComponent(part.slice(i + 1).replace(/\+/g, " ")));
    } catch { /* A malformed escape: skip this parameter */ }
  }
  const out: Partial<SharedSettings> = {};
  const entries = (text: string | undefined, n: number) => {
    const list = text?.split(/[,;]/).map(clean);
    return list && list.length === n && list.every(e => e !== "" && ENTRY.test(e) && isEntry(e)) ? list : undefined;
  };
  const A = entries(params.get("A"), 4);
  if (A) out.A = A;
  const x0 = entries(params.get("x0"), 2);
  if (x0) out.x0 = x0;
  const n = Number(params.get("n"));
  if (stepChoices.includes(n)) out.steps = n;
  const k = params.has("k") ? Number(params.get("k")) : NaN;
  if (Number.isInteger(k) && k >= 0) out.k = Math.min(k, out.steps ?? Math.max(...stepChoices));
  const show = params.get("show");
  if (show !== undefined && /^[lpc]*$/.test(show)) {
    out.lines = show.includes("l");
    out.parts = show.includes("p");
    out.circle = show.includes("c");
  }
  return out;
}
