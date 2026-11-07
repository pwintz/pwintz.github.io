// ╭───────────────────────────────────────────────────────────────╮
// │   Search, filter, and sort the terms on /tools/uaw_glossary/  │
// ╰───────────────────────────────────────────────────────────────╯
// The page renders every term from _data/union_glossary.csv (sorted by term), with its category,
// rarity, and raw links in data attributes, so it still works without JavaScript. This script turns
// the links and the URLs in each meaning into anchors, reveals the toolbar, and re-renders the list
// to match the search box and menus. The settings are mirrored in the URL
// (e.g. /tools/uaw_glossary/?q=perb&rarity=common) so a filtered view can be shared.

// ⋘──────── Types and constants ────────⋙

type SortOrder   = "term" | "category";
type RarityLevel = "all" | "uncommon" | "common";

interface Entry {
  item     : HTMLLIElement;
  term     : string;
  category : string;
  rarity   : string;   // "Common", "Uncommon", "Rare", or "" if the row has none
  heading  : string;   // Lowercase term and abbreviation, for ranking matches
  text     : string;   // Lowercase text of the whole entry, for searching
}

const OTHER = "Other";   // Category for terms whose row lists none
const SORT_ORDERS: SortOrder[]   = ["term", "category"];
const RARITIES:    RarityLevel[] = ["all", "uncommon", "common"];
const SHOWN_RARITIES: Record<RarityLevel, string[] | null> = {
  all      : null,
  uncommon : ["Common", "Uncommon"],
  common   : ["Common"],
};

const URL_PATTERN = /https?:\/\/[^\s,)]+[^\s,).;:"'”]/g;

// ⋘──────── Elements ────────⋙

const toolbar      = document.getElementById("glossary-toolbar")  as HTMLElement | null;
const search       = document.getElementById("glossary-search")   as HTMLInputElement | null;
const categoryMenu = document.getElementById("glossary-category") as HTMLSelectElement | null;
const rarityMenu   = document.getElementById("glossary-rarity")   as HTMLSelectElement | null;
const sortMenu     = document.getElementById("glossary-sort")     as HTMLSelectElement | null;
const results      = document.getElementById("glossary-results")  as HTMLElement | null;
const summary      = document.getElementById("glossary-summary")  as HTMLElement | null;

// ⋘──────── Links ────────⋙

interface Link {
  label : string;
  url   : string;
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// The links columns hold "[label](URL)" Markdown links, "label: URL" lines, and bare URLs, along
// with titles of links whose URLs were lost (which are skipped). Bare URLs are labeled by their site.
function parseLinks(raw: string): Link[] {
  const links: Link[] = [];
  const add = (label: string, url: string) => {
    if (!links.some((l) => l.url === url)) links.push({ label: label || hostname(url), url });
  };

  const rest = raw.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (_, label: string, url: string) => {
    add(label.trim(), url);
    return "\n";
  });
  for (const line of rest.split("\n")) {
    for (const match of line.matchAll(URL_PATTERN)) {
      // Use the text before the URL as its label when the line has the form "label: URL".
      const before = line.slice(0, match.index).trim();
      const label  = before.endsWith(":") && !before.includes("http") ? before.slice(0, -1).trim() : "";
      add(label, match[0]);
    }
  }
  return links;
}

function makeAnchor(label: string, url: string): HTMLAnchorElement {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.textContent = label;
  anchor.target = "_blank";
  anchor.rel = "noopener";
  return anchor;
}

// Replaces each URL in the meaning's text with an anchor.
function linkifyMeaning(meaning: HTMLElement): void {
  const text = meaning.textContent ?? "";
  const parts: (string | Node)[] = [];
  let end = 0;
  for (const match of text.matchAll(URL_PATTERN)) {
    parts.push(text.slice(end, match.index), makeAnchor(match[0], match[0]));
    end = match.index! + match[0].length;
  }
  if (end > 0) meaning.replaceChildren(...parts, text.slice(end));
}

function addLinks(item: HTMLLIElement): void {
  const meaning = item.querySelector<HTMLElement>(".glossary-meaning");
  if (meaning) linkifyMeaning(meaning);

  const links = parseLinks(item.dataset.links ?? "");
  if (links.length === 0) return;
  const list = document.createElement("div");
  list.className = "glossary-links";
  for (const link of links) list.appendChild(makeAnchor(link.label, link.url));
  item.querySelector(".glossary-meta")?.before(list);
}

// ⋘──────── Reading the entries from the page ────────⋙

function readEntries(container: HTMLElement): Entry[] {
  return Array.from(container.querySelectorAll<HTMLLIElement>("li[data-term]")).map((item) => ({
    item,
    term     : item.dataset.term ?? "",
    category : item.dataset.category || OTHER,
    rarity   : item.dataset.rarity ?? "",
    heading  : (item.querySelector("h2")?.textContent ?? "").replace(/[#()]/g, " ").toLowerCase(),
    text     : (item.textContent ?? "").replace(/\s+/g, " ").toLowerCase(),
  }));
}

// Categories sorted alphabetically, with "Other" last.
function allCategories(entries: Entry[]): string[] {
  const names = new Set(entries.map((e) => e.category));
  return Array.from(names).sort((a, b) => (a === OTHER ? 1 : b === OTHER ? -1 : a.localeCompare(b)));
}

// ⋘──────── Filtering and sorting ────────⋙

function searchTerms(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

function matchesSearch(entry: Entry, terms: string[]): boolean {
  return terms.every((term) => entry.text.includes(term));
}

// While searching, terms whose name or abbreviation matches come before terms that match only in
// their meaning, and an exact match on a word of the name or abbreviation comes first of all.
function searchRank(entry: Entry, terms: string[]): number {
  if (terms.length === 0) return 0;
  const words = entry.heading.split(/[\s,]+/);
  if (terms.every((term) => words.includes(term))) return 0;
  if (terms.every((term) => entry.heading.includes(term))) return 1;
  return 2;
}

// Alphabetical, ignoring leading quotation marks and other punctuation.
function byTerm(a: Entry, b: Entry): number {
  const key = (e: Entry) => e.term.replace(/^[^\p{L}\p{N}]+/u, "");
  return key(a).localeCompare(key(b), undefined, { sensitivity: "base" });
}

// ⋘──────── Rendering ────────⋙

function makeList(entries: Entry[]): HTMLUListElement {
  const list = document.createElement("ul");
  list.className = "glossary-list";
  for (const entry of entries) list.appendChild(entry.item);
  return list;
}

function makeHeading(text: string, count: number): HTMLHeadingElement {
  const heading = document.createElement("h2");
  heading.className = "glossary-group-heading";
  heading.textContent = text;
  const badge = document.createElement("span");
  badge.className = "glossary-group-count";
  badge.textContent = String(count);
  heading.appendChild(badge);
  return heading;
}

function makeEmptyMessage(onClear: () => void): HTMLElement {
  const message = document.createElement("p");
  message.className = "glossary-empty";
  message.append("No terms match. ");
  const clear = document.createElement("button");
  clear.type = "button";
  clear.className = "glossary-clear";
  clear.textContent = "Clear filters";
  clear.addEventListener("click", onClear);
  message.appendChild(clear);
  return message;
}

// ⋘──────── Setup ────────⋙

function init(): void {
  if (!toolbar || !search || !categoryMenu || !rarityMenu || !sortMenu || !results || !summary) return;

  const entries    = readEntries(results);
  const categories = allCategories(entries);
  for (const entry of entries) addLinks(entry.item);

  for (const name of categories) {
    const count = entries.filter((e) => e.category === name).length;
    categoryMenu.appendChild(new Option(`${name} (${count})`, name));
  }

  // Restore the view from the URL.
  const params = new URLSearchParams(window.location.search);
  let query    = params.get("q") ?? "";
  let category = categories.includes(params.get("category") ?? "") ? params.get("category")! : "";
  let rarity   = (RARITIES as string[]).includes(params.get("rarity") ?? "") ? params.get("rarity") as RarityLevel : "all";
  let sort     = (SORT_ORDERS as string[]).includes(params.get("sort") ?? "") ? params.get("sort") as SortOrder : "term";

  function updateUrl(): void {
    const next = new URLSearchParams();
    if (query.trim())     next.set("q", query.trim());
    if (category)         next.set("category", category);
    if (rarity !== "all") next.set("rarity", rarity);
    if (sort !== "term")  next.set("sort", sort);
    const qs = next.toString();
    history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash);
  }

  function update(): void {
    const terms    = searchTerms(query);
    const rarities = SHOWN_RARITIES[rarity];
    const shown    = entries
      .filter((e) => (!category || e.category === category)
                  && (!rarities || rarities.includes(e.rarity))
                  && matchesSearch(e, terms))
      .sort((a, b) => searchRank(a, terms) - searchRank(b, terms) || byTerm(a, b));
    results!.replaceChildren();

    if (shown.length === 0) {
      results!.appendChild(makeEmptyMessage(() => {
        query = "";
        category = "";
        rarity = "all";
        search!.value = "";
        categoryMenu!.value = "";
        rarityMenu!.value = "all";
        update();
      }));
    } else if (sort === "category") {
      for (const name of categories) {
        const group = shown.filter((e) => e.category === name);
        if (group.length === 0) continue;
        results!.appendChild(makeHeading(name, group.length));
        results!.appendChild(makeList(group));
      }
    } else {
      results!.appendChild(makeList(shown));
    }

    summary!.textContent = shown.length === entries.length
      ? `${entries.length} terms`
      : `Showing ${shown.length} of ${entries.length} terms`;
    updateUrl();
  }

  search.value       = query;
  categoryMenu.value = category;
  rarityMenu.value   = rarity;
  sortMenu.value     = sort;
  search.addEventListener("input", () => {
    query = search.value;
    update();
  });
  categoryMenu.addEventListener("change", () => {
    category = categoryMenu.value;
    update();
  });
  rarityMenu.addEventListener("change", () => {
    rarity = rarityMenu.value as RarityLevel;
    update();
  });
  sortMenu.addEventListener("change", () => {
    sort = sortMenu.value as SortOrder;
    update();
  });

  toolbar.hidden = false;
  update();

  // Re-rendering moves the entries, so scroll to a linked term again once it's in place.
  if (window.location.hash) document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView();
}

init();

// Make this file a module, so its top-level names do not clash with other scripts.
export {};
