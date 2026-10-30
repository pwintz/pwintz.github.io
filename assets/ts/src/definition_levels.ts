// Level switcher for the Dictionary of Fine Distinctions (_layouts/distinction.html).
// Each definition is rendered at every level it has (elementary, high school, undergraduate, graduate).
// This script shows one level per definition. If a definition has no version at the selected level,
// the nearest lower level is shown, or, failing that, the lowest level it has.
// Examples above the selected level are hidden.
// Each definition also has level buttons in its header, which show that definition (and its examples) at another level.
// The reader's choice is remembered across pages. A ?level= parameter in the URL selects the level when the page opens.

const STORAGE_KEY = "distinctions.definitionLevel";

function readStoredLevel(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeLevel(level: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, level);
  } catch {
    // Storage is unavailable (e.g., private browsing). The choice applies to this page only.
  }
}

function init(): void {
  const switcher = document.querySelector<HTMLElement>(".level-switcher");
  if (!switcher) return;

  const buttons = Array.from(switcher.querySelectorAll<HTMLButtonElement>(".level-switcher__button"));
  // The buttons are rendered in order from least to most advanced.
  const order = buttons.map((button) => button.dataset.level ?? "");
  const names = new Map(buttons.map((button) => [button.dataset.level ?? "", button.textContent?.trim() ?? ""]));
  const minIndex = Math.max(0, order.indexOf(switcher.dataset.minLevel ?? ""));

  // Clamp a level to those that this page allows.
  const clamp = (level: string | null): string => {
    const index = level === null ? -1 : order.indexOf(level);
    return order[Math.max(index, minIndex)];
  };

  const terms = Array.from(document.querySelectorAll<HTMLElement>(".distinction__term"));
  // Levels chosen for single definitions with the buttons in their headers. The page-wide switcher clears them.
  const termLevels = new Map<HTMLElement, string>();
  let pageLevel = "";

  // Show one definition at a level: the given level if it has one, else the nearest lower level, else its lowest
  // level. Also hide the examples listed under it that are above the level.
  function showTerm(term: HTMLElement, level: string): void {
    const target = order.indexOf(level);
    const block = term.querySelector<HTMLElement>(".definition-levels[data-switchable]");
    const entries = block ? Array.from(block.querySelectorAll<HTMLElement>(".definition-level")) : [];
    if (block && entries.length > 0) {
      const indexOf = (entry: HTMLElement) => order.indexOf(entry.dataset.level ?? "");
      const atOrBelow = entries.filter((entry) => indexOf(entry) <= target);
      const shown = atOrBelow.length > 0 ? atOrBelow[atOrBelow.length - 1] : entries[0];
      for (const entry of entries) {
        entry.hidden = entry !== shown;
      }
      for (const badge of term.querySelectorAll<HTMLElement>("[data-show-level]")) {
        badge.setAttribute("aria-pressed", String(badge.dataset.showLevel === shown.dataset.level));
      }

      let note = block.querySelector<HTMLElement>(".definition-levels__note");
      if (shown.dataset.level === level) {
        note?.remove();
      } else {
        if (!note) {
          note = document.createElement("p");
          note.className = "definition-levels__note";
          block.prepend(note);
        }
        note.textContent = `No ${names.get(level)?.toLowerCase()} version. Showing the ${names.get(shown.dataset.level ?? "")?.toLowerCase()} version.`;
      }
    }

    for (const item of term.querySelectorAll<HTMLElement>("[data-example-level]")) {
      item.hidden = order.indexOf(item.dataset.exampleLevel ?? "") > target;
    }
    // Hide a list of examples if none of its examples is at or below the level.
    for (const list of term.querySelectorAll<HTMLElement>(".definition-examples")) {
      list.hidden = !list.querySelector("[data-example-level]:not([hidden])");
    }
  }

  // Apply a level to the whole page: every definition, and the examples table.
  function apply(level: string): void {
    pageLevel = level;
    termLevels.clear();
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.level === level));
    }
    for (const term of terms) showTerm(term, level);
    filterTable(level);
  }

  // Hovering over (or focusing) a level button in a definition's header previews that level of the definition.
  // Clicking it keeps that level for the definition until the page-wide level changes.
  for (const term of terms) {
    const restore = () => showTerm(term, termLevels.get(term) ?? pageLevel);
    for (const badge of term.querySelectorAll<HTMLElement>("[data-show-level]")) {
      const preview = () => showTerm(term, badge.dataset.showLevel ?? "");
      badge.addEventListener("mouseenter", preview);
      badge.addEventListener("focus", preview);
      badge.addEventListener("mouseleave", restore);
      badge.addEventListener("blur", restore);
      badge.addEventListener("click", () => {
        termLevels.set(term, badge.dataset.showLevel ?? "");
        restore();
      });
    }
    const selector = term.querySelector<HTMLElement>(".definition-level-selector");
    if (selector) selector.hidden = false;
  }

  // Hide rows of the examples table above the level, and say how many are hidden.
  function filterTable(level: string): void {
    const target = order.indexOf(level);
    const rows = Array.from(document.querySelectorAll<HTMLElement>("tr[data-example-level]"));
    if (rows.length === 0) return;
    for (const row of rows) {
      row.hidden = order.indexOf(row.dataset.exampleLevel ?? "") > target;
    }
    const hiddenCount = rows.filter((row) => row.hidden).length;
    const table = document.querySelector<HTMLElement>(".distinction__examples");
    if (table) table.hidden = hiddenCount === rows.length;
    const message = document.querySelector<HTMLElement>(".distinction__examples-hidden");
    if (message) {
      const levelName = names.get(level)?.toLowerCase();
      message.hidden = hiddenCount === 0;
      message.textContent =
        hiddenCount === rows.length
          ? `None of the examples is at the ${levelName} level. Choose a higher level to see them.`
          : `${hiddenCount} ${hiddenCount === 1 ? "example is" : "examples are"} above the ${levelName} level and hidden. Choose a higher level to see ${hiddenCount === 1 ? "it" : "them"}.`;
    }
  }

  // Keep ?level= in the URL in sync with the chosen level, so the page can be shared at that level.
  function setUrlLevel(level: string): void {
    const url = new URL(window.location.href);
    url.searchParams.set("level", level);
    window.history.replaceState(null, "", url);
  }

  for (const button of buttons) {
    button.addEventListener("click", () => {
      const level = button.dataset.level;
      if (!level || button.disabled) return;
      storeLevel(level);
      setUrlLevel(level);
      apply(level);
    });
  }

  // A level in the URL (e.g., from a filtered list of distinctions) takes precedence over the stored choice.
  const urlLevel = new URL(window.location.href).searchParams.get("level");
  if (urlLevel && order.includes(urlLevel)) storeLevel(urlLevel);
  const initial = urlLevel && order.includes(urlLevel) ? urlLevel : readStoredLevel();

  switcher.hidden = false;
  apply(clamp(initial));
}

init();

// Make this file a module, so its top-level names do not clash with other scripts.
export {};
