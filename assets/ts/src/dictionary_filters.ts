// Filters for the Dictionary of Fine Distinctions index pages (/distinctions/ and /definitions/).
// The form (_includes/dictionary-filters.html) filters items marked with data-filter-item by
//   - search text, matched against data-search (every word must appear),
//   - subject, matched against the space-separated data-subjects,
//   - kind, matched against data-kind,
//   - level, matched against the space-separated data-levels. The level acts as a maximum: each page lists in
//     data-levels every level at which an item is available, i.e., its own level and all higher ones.
// Groups (data-filter-group) with no visible items are hidden. An item listed in several groups (with the same
// data-filter-key) is counted once. The filters are stored in the URL, so a
// filtered list can be linked to, e.g., /definitions/?subject=topology&level=undergraduate.
// On the definitions page, choosing a level also shows each definition's text at the most advanced level up to it,
// and hovering over a definition's level badge shows its text at that level.
// On the distinctions page, an item matches a level if every term it compares has a definition at that level
// or a lower one (data-levels is computed accordingly), and links to distinction pages carry ?level=.

const PARAMS = ["q", "subject", "kind", "level"] as const;

// Lowercase, remove accents (so "holder" matches "Hölder"), and replace LaTeX punctuation with spaces.
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[\\$_{}^]/g, " ");
}

function init(): void {
  const form = document.querySelector<HTMLFormElement>(".dictionary-filters");
  const list = document.querySelector<HTMLElement>("[data-filter-list]");
  if (!form || !list) return;

  const items = Array.from(list.querySelectorAll<HTMLElement>("[data-filter-item]"));
  const groups = Array.from(list.querySelectorAll<HTMLElement>("[data-filter-group]"));
  const count = form.querySelector<HTMLElement>(".dictionary-filters__count");
  const empty = document.querySelector<HTMLElement>(".dictionary-empty");
  const searchText = new Map(items.map((item) => [item, normalize(item.dataset.search ?? "")]));
  const total = new Set(items.map((item, i) => item.dataset.filterKey ?? String(i))).size;

  const control = (name: string) =>
    form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;

  // The levels, from least to most advanced, as listed in the level filter.
  const levelSelect = control("level");
  const levelOrder =
    levelSelect instanceof HTMLSelectElement ? Array.from(levelSelect.options, (option) => option.value).filter(Boolean) : [];

  // Restore the filters from the URL.
  const url = new URL(window.location.href);
  for (const name of PARAMS) {
    const value = url.searchParams.get(name);
    const element = control(name);
    if (value && element) element.value = value;
  }

  // On the definitions page, each item has one text per level (marked with data-level). Show the text at the
  // given level, or, if there is none, at the most advanced level below it, or else at the lowest level.
  // An empty level means the lowest level.
  function showText(item: HTMLElement, level: string): void {
    const texts = Array.from(item.querySelectorAll<HTMLElement>("[data-level]"));
    if (texts.length === 0) return;
    const atOrBelow = texts.filter((t) => levelOrder.indexOf(t.dataset.level ?? "") <= levelOrder.indexOf(level));
    const shown = level && atOrBelow.length > 0 ? atOrBelow[atOrBelow.length - 1] : texts[0];
    for (const t of texts) t.hidden = t !== shown;
    for (const badge of item.querySelectorAll<HTMLElement>("[data-show-level]")) {
      badge.setAttribute("aria-pressed", String(badge.dataset.showLevel === shown.dataset.level));
    }
  }

  // Hovering over (or focusing) a level badge previews the text at that level. Clicking (or tapping) it keeps
  // that level for the item until the level filter changes.
  const pinned = new Map<HTMLElement, string>();
  let lastLevel = "";
  const restore = (item: HTMLElement) => showText(item, pinned.get(item) ?? control("level")?.value ?? "");
  for (const item of items) {
    for (const badge of item.querySelectorAll<HTMLElement>("[data-show-level]")) {
      const preview = () => showText(item, badge.dataset.showLevel ?? "");
      badge.addEventListener("mouseenter", preview);
      badge.addEventListener("focus", preview);
      badge.addEventListener("mouseleave", () => restore(item));
      badge.addEventListener("blur", () => restore(item));
      badge.addEventListener("click", () => {
        pinned.set(item, badge.dataset.showLevel ?? "");
        restore(item);
      });
    }
  }

  function apply(): void {
    const words = normalize(control("q")?.value ?? "").split(/\s+/).filter(Boolean);
    const subject = control("subject")?.value ?? "";
    const kind = control("kind")?.value ?? "";
    const level = control("level")?.value ?? "";

    if (level !== lastLevel) pinned.clear();
    lastLevel = level;

    const visibleKeys = new Set<string>();
    for (const item of items) {
      const text = searchText.get(item) ?? "";
      const matches =
        words.every((word) => text.includes(word)) &&
        (!subject || (item.dataset.subjects ?? "").split(" ").includes(subject)) &&
        (!kind || item.dataset.kind === kind) &&
        (!level || (item.dataset.levels ?? "").split(" ").includes(level));
      item.hidden = !matches;
      if (matches) visibleKeys.add(item.dataset.filterKey ?? String(items.indexOf(item)));

      showText(item, pinned.get(item) ?? level);
    }

    // Links to distinction pages carry the chosen level, so the page opens at that level.
    for (const item of items) {
      for (const link of item.querySelectorAll<HTMLAnchorElement>('a[href*="/distinctions/"]')) {
        const target = new URL(link.href);
        if (level) target.searchParams.set("level", level);
        else target.searchParams.delete("level");
        link.href = target.pathname + target.search + target.hash;
      }
    }

    for (const group of groups) {
      group.hidden = !group.querySelector("[data-filter-item]:not([hidden])");
    }
    const visible = visibleKeys.size;
    if (count) {
      count.textContent = visible === total ? `Showing all ${total}.` : `Showing ${visible} of ${total}.`;
    }
    if (empty) empty.hidden = visible > 0;

    // Keep the URL in sync, so that the filtered list can be shared.
    const next = new URL(window.location.href);
    for (const name of PARAMS) {
      const value = control(name)?.value ?? "";
      if (value) next.searchParams.set(name, value);
      else next.searchParams.delete(name);
    }
    window.history.replaceState(null, "", next);
  }

  form.addEventListener("input", apply);
  form.addEventListener("change", apply);
  form.addEventListener("submit", (event) => event.preventDefault());
  // The "reset" event fires before the controls are cleared.
  form.addEventListener("reset", () => window.setTimeout(apply, 0));

  form.hidden = false;
  apply();
}

init();

// Make this file a module, so its top-level names do not clash with other scripts.
export {};
