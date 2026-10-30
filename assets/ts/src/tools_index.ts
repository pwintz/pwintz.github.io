// ╭───────────────────────────────────────────────────────────────╮
// │        Filter, sort, and group the cards on /tools/           │
// ╰───────────────────────────────────────────────────────────────╯
// The page renders every tool as a card (sorted by title) with its categories and date in data
// attributes, so it still works without JavaScript. This script reveals the toolbar and re-renders
// the cards to match the search box, the selected category, and the sort order. The settings are
// mirrored in the URL (e.g. /tools/?category=Music&sort=newest) so a filtered view can be shared.

// ⋘──────── Types and constants ────────⋙

type SortOrder = "category" | "title" | "newest";

interface Tool {
  card       : HTMLLIElement;
  title      : string;
  categories : string[];   // In front-matter order; the first is the tool's main category
  date       : string;     // "YYYY-MM-DD", or "" if the page has no date_added
  text       : string;     // Lowercase title, description, and categories, for searching
}

const OTHER = "Other";     // Category for tools whose front matter lists none
const SORT_ORDERS: SortOrder[] = ["category", "title", "newest"];

// ⋘──────── Elements ────────⋙

const toolsBar = document.getElementById("tools-toolbar")  as HTMLElement | null;
const search   = document.getElementById("tools-search")   as HTMLInputElement | null;
const sortMenu = document.getElementById("tools-sort")     as HTMLSelectElement | null;
const chipList = document.getElementById("tools-chips")    as HTMLElement | null;
const results  = document.getElementById("tools-results")  as HTMLElement | null;
const summary  = document.getElementById("tools-summary")  as HTMLElement | null;

// ⋘──────── Reading the tools from the page ────────⋙

function readTools(container: HTMLElement): Tool[] {
  return Array.from(container.querySelectorAll<HTMLLIElement>("li[data-title]")).map((card) => {
    const categories = (card.dataset.categories ?? "").split("|").map((c) => c.trim()).filter(Boolean);
    if (categories.length === 0) categories.push(OTHER);
    return {
      card,
      title : card.dataset.title ?? "",
      categories,
      date  : card.dataset.date ?? "",
      text  : (card.textContent ?? "").replace(/\s+/g, " ").toLowerCase(),
    };
  });
}

// Categories sorted alphabetically, with "Other" last.
function allCategories(tools: Tool[]): string[] {
  const names = new Set(tools.flatMap((t) => t.categories));
  return Array.from(names).sort((a, b) => (a === OTHER ? 1 : b === OTHER ? -1 : a.localeCompare(b)));
}

// ⋘──────── Filtering and sorting ────────⋙

function matchesSearch(tool: Tool, query: string): boolean {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return terms.every((term) => tool.text.includes(term));
}

function byTitle(a: Tool, b: Tool): number {
  return a.title.localeCompare(b.title);
}

// Newest first; tools without a date go last.
function byNewest(a: Tool, b: Tool): number {
  if (a.date !== b.date) {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  }
  return byTitle(a, b);
}

// ⋘──────── Rendering ────────⋙

function makeList(tools: Tool[]): HTMLUListElement {
  const list = document.createElement("ul");
  list.className = "tools-list";
  for (const tool of tools) list.appendChild(tool.card);
  return list;
}

function makeHeading(text: string, count: number): HTMLHeadingElement {
  const heading = document.createElement("h2");
  heading.className = "tools-group-heading";
  heading.textContent = text;
  const badge = document.createElement("span");
  badge.className = "tools-group-count";
  badge.textContent = String(count);
  heading.appendChild(badge);
  return heading;
}

function makeEmptyMessage(onClear: () => void): HTMLElement {
  const message = document.createElement("p");
  message.className = "tools-empty";
  message.append("No tools match. ");
  const clear = document.createElement("button");
  clear.type = "button";
  clear.className = "tools-clear";
  clear.textContent = "Clear filters";
  clear.addEventListener("click", onClear);
  message.appendChild(clear);
  return message;
}

// ⋘──────── Setup ────────⋙

function init(): void {
  if (!toolsBar || !search || !sortMenu || !chipList || !results || !summary) return;

  const tools      = readTools(results);
  const categories = allCategories(tools);

  // Restore the view from the URL.
  const params = new URLSearchParams(window.location.search);
  let query    = params.get("q") ?? "";
  let category = categories.includes(params.get("category") ?? "") ? params.get("category")! : "";
  let sort     = (SORT_ORDERS as string[]).includes(params.get("sort") ?? "") ? params.get("sort") as SortOrder : "category";

  // One chip per category, plus "All".
  const chips = new Map<string, HTMLButtonElement>();
  for (const name of ["", ...categories]) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "tools-chip";
    const count = name ? tools.filter((t) => t.categories.includes(name)).length : tools.length;
    chip.textContent = name || "All";
    const badge = document.createElement("span");
    badge.className = "tools-chip-count";
    badge.textContent = String(count);
    chip.appendChild(badge);
    chip.addEventListener("click", () => {
      category = name;
      update();
    });
    chips.set(name, chip);
    chipList.appendChild(chip);
  }

  function updateUrl(): void {
    const next = new URLSearchParams();
    if (query.trim())        next.set("q", query.trim());
    if (category)            next.set("category", category);
    if (sort !== "category") next.set("sort", sort);
    const qs = next.toString();
    history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash);
  }

  function update(): void {
    for (const [name, chip] of chips) chip.setAttribute("aria-pressed", String(name === category));

    const shown = tools.filter((t) => (!category || t.categories.includes(category)) && matchesSearch(t, query));
    results!.replaceChildren();

    if (shown.length === 0) {
      results!.appendChild(makeEmptyMessage(() => {
        query = "";
        category = "";
        search!.value = "";
        update();
      }));
    } else if (sort === "category") {
      // Group under each tool's main category, or under the selected one when filtering.
      const groupOf = (t: Tool) => category || t.categories[0];
      for (const name of categories) {
        const group = shown.filter((t) => groupOf(t) === name).sort(byTitle);
        if (group.length === 0) continue;
        results!.appendChild(makeHeading(name, group.length));
        results!.appendChild(makeList(group));
      }
    } else {
      results!.appendChild(makeList(shown.sort(sort === "newest" ? byNewest : byTitle)));
    }

    summary!.textContent = shown.length === tools.length
      ? `${tools.length} tools`
      : `Showing ${shown.length} of ${tools.length} tools`;
    updateUrl();
  }

  search.value   = query;
  sortMenu.value = sort;
  search.addEventListener("input", () => {
    query = search.value;
    update();
  });
  sortMenu.addEventListener("change", () => {
    sort = sortMenu.value as SortOrder;
    update();
  });

  toolsBar.hidden = false;
  update();
}

init();
