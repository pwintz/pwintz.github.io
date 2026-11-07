// ╭───────────────────────────────────────────────────────────────╮
// │                 Pinnable and full-screen panels               │
// ╰───────────────────────────────────────────────────────────────╯
// Shared by the tools whose sections can be pinned to the top of the window.

// ⋘──────── Pinning and full screen ────────⋙
// Each panel (an element with the class "<prefix>-panel") has a pin button that keeps it at the
// top of the window while scrolling, stacked below any pinned panels above it, and (in browsers
// that allow it, and unless the panel has data-fullscreen="false") a button that shows it full
// screen.

const PIN_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/></svg>`;
const FULL_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
const EXIT_FULL_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`;

export interface Panels {
  list: HTMLElement[];
  isPinned(panel: HTMLElement): boolean;
  setPinned(panel: HTMLElement, pinned: boolean): void;
}

// `onPinChange` is called when the visitor pins or unpins a panel.
export function setupPanels(prefix: string, onPinChange: () => void): Panels {
  const pinnedClass = `${prefix}-pinned`;
  const list = [...document.querySelectorAll<HTMLElement>(`.${prefix}-panel`)];

  function stackPinned(): void {
    let top = 0;
    for (const panel of list) {
      if (!panel.classList.contains(pinnedClass)) {
        panel.style.top = "";
        continue;
      }
      panel.style.top = `${top}px`;
      top += panel.offsetHeight;
    }
  }

  function setPinned(panel: HTMLElement, pinned: boolean): void {
    panel.classList.toggle(pinnedClass, pinned);
    panel.querySelector(`.${prefix}-pin`)!.setAttribute("aria-pressed", String(pinned));
    stackPinned();
  }

  for (const panel of list) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `${prefix}-pin`;
    button.innerHTML = PIN_ICON;
    button.setAttribute("aria-label", "Pin to the top of the window");
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      setPinned(panel, !panel.classList.contains(pinnedClass));
      onPinChange();
    });
    panel.append(button);
    if (panel.dataset.fullscreen === "false") continue;

    const full = document.createElement("button");
    full.type = "button";
    full.className = `${prefix}-full`;
    full.innerHTML = FULL_ICON;
    full.setAttribute("aria-label", "Full screen");
    full.hidden = !document.fullscreenEnabled;
    full.addEventListener("click", () => {
      if (document.fullscreenElement) void document.exitFullscreen();
      else void panel.requestFullscreen();
    });
    panel.append(full);
  }
  // The panels' heights change as the canvases are first drawn and when the window is resized.
  const panelResizes = new ResizeObserver(stackPinned);
  list.forEach(panel => panelResizes.observe(panel));
  document.addEventListener("fullscreenchange", () => {
    for (const panel of list) {
      const button = panel.querySelector<HTMLButtonElement>(`.${prefix}-full`);
      if (!button) continue;
      const isFull = document.fullscreenElement === panel;
      button.innerHTML = isFull ? EXIT_FULL_ICON : FULL_ICON;
      button.setAttribute("aria-label", isFull ? "Exit full screen" : "Full screen");
    }
    stackPinned();
  });

  return { list, isPinned: panel => panel.classList.contains(pinnedClass), setPinned };
}
