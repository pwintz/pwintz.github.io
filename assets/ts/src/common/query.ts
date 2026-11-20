// ╭───────────────────────────────────────────────────────────────╮
// │              Sharing the address between sections              │
// ╰───────────────────────────────────────────────────────────────╯
// On pages with more than one section that saves its state in the address (such as a visualizer
// and a practice problem), each section replaces only its own parameters and keeps the others.
// Parameters are written by hand, not with URLSearchParams, so commas and semicolons stay
// readable ("A=1,2;3,4" rather than "A=1%2C2%3B3%2C4").

/**
 * The query string `search` (with or without its "?") with every parameter named in `ownKeys`
 * removed and `parts` (such as "A=1,2;3,4") added at the end. Returns "" when nothing is left, or
 * else the query with its "?".
 */
export function mergeQuery(search: string, ownKeys: readonly string[], parts: readonly string[]): string {
  const kept = search.replace(/^\?/, "").split("&").filter(part => {
    if (part === "") return false;
    const key = decodeURIComponent(part.split("=")[0]);
    return !ownKeys.includes(key);
  });
  const all = [...kept, ...parts.filter(p => p !== "")];
  return all.length ? `?${all.join("&")}` : "";
}

/** Replaces this section's parameters in the address (without adding a history entry). */
export function replaceQuery(ownKeys: readonly string[], parts: readonly string[]): void {
  history.replaceState(null, "", `${location.pathname}${mergeQuery(location.search, ownKeys, parts)}${location.hash}`);
}
