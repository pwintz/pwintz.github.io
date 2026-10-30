// ╭───────────────────────────────────────────────────────────────╮
// │       Page helpers: canvases, panels, help, saved settings       │
// ╰───────────────────────────────────────────────────────────────╯
// Shared by the audio tools. Class names start with the page's prefix (for example, "ft-panel"),
// so that each page's styles stay separate.

// ⋘──────── Chart colors ────────⋙

export const BG    = "#121417";
export const PANEL = "#1b1e23";
export const TEXT  = "#d8dce2";
export const MUTED = "#8a919c";
export const GRID  = "rgba(255, 255, 255, 0.08)";

// ⋘──────── Canvas helpers ────────⋙

export const dpr = () => window.devicePixelRatio || 1;

// Matches the canvas's resolution to its displayed width and returns a context in CSS pixels.
// In full screen, a canvas fills the screen's height. Otherwise it's `height` tall.
const FULL_PAD = 24; // Padding of a panel in full screen (px)

function canvasHeight(canvas: HTMLCanvasElement, height: number): number {
  const full = document.fullscreenElement;
  if (!full || !full.contains(canvas)) return height;
  return Math.max(height / 2, Math.floor(window.innerHeight - FULL_PAD));
}

export function fitCanvas(canvas: HTMLCanvasElement, normalHeight: number): { ctx: CanvasRenderingContext2D; w: number; h: number } {
  const height = canvasHeight(canvas, normalHeight);
  const w = canvas.clientWidth;
  if (canvas.width !== Math.round(w * dpr()) || canvas.height !== Math.round(height * dpr())) {
    canvas.width  = Math.round(w * dpr());
    canvas.height = Math.round(height * dpr());
    canvas.style.height = `${height}px`;
  }
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, height);
  return { ctx, w, h: height };
}

export function placeholder(ctx: CanvasRenderingContext2D, w: number, h: number, text: string): void {
  ctx.fillStyle = MUTED;
  ctx.font = "14px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);
}

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

// ⋘──────── Setting explanations ────────⋙
// Each label with a `data-help` explanation (inside the element with the class `prefix`) gets a
// "?" button after it that shows the explanation in a popup (the element "<prefix>-help-popup")
// below the button.

export function setupHelp(prefix: string): void {
  const helpPopup = document.getElementById(`${prefix}-help-popup`) as HTMLDivElement;
  let openHelp: HTMLButtonElement | null = null;

  function closeHelp(): void {
    helpPopup.hidden = true;
    openHelp?.setAttribute("aria-expanded", "false");
    openHelp = null;
  }

  function showHelp(button: HTMLButtonElement, text: string): void {
    closeHelp();
    openHelp = button;
    button.setAttribute("aria-expanded", "true");
    helpPopup.textContent = text;
    helpPopup.hidden = false;
    // Below the button, kept within the window.
    const r = button.getBoundingClientRect();
    const left = Math.min(r.left, document.documentElement.clientWidth - helpPopup.offsetWidth - 8);
    helpPopup.style.left = `${Math.max(8, left) + window.scrollX}px`;
    helpPopup.style.top  = `${r.bottom + 6 + window.scrollY}px`;
  }

  document.body.append(helpPopup); // Positioned relative to the page
  for (const label of document.querySelectorAll<HTMLElement>(`.${prefix} [data-help]`)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `${prefix}-help`;
    button.textContent = "?";
    button.setAttribute("aria-label", `About ${label.textContent}`);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", helpPopup.id);
    button.addEventListener("click", e => {
      e.stopPropagation();
      if (openHelp === button) closeHelp();
      else showHelp(button, label.dataset.help!);
    });
    label.after(button);
  }
  document.addEventListener("click", e => { if (!helpPopup.contains(e.target as Node)) closeHelp(); });
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape" || !openHelp) return;
    const button = openHelp;
    closeHelp();
    button.focus();
  });
}

// ⋘──────── Saving arrays ────────⋙
// Arrays of numbers (like a noise calibration's spectrum) are saved in the browser as base64 text,
// which is much smaller than JSON.

export function float32ToBase64(values: Float32Array): string {
  const bytes = new Uint8Array(values.buffer, values.byteOffset, values.byteLength);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

export function base64ToFloat32(text: string): Float32Array {
  const bytes = Uint8Array.from(atob(text), ch => ch.charCodeAt(0));
  return new Float32Array(bytes.buffer);
}

// ⋘──────── Saved settings ────────⋙
// The controls and pinned panels are saved in the browser, so they're the same when a visitor
// returns. Storage can be unavailable (for example, in some private windows), in which case the
// page works as usual without saving.

interface SavedState { controls: Record<string, string | boolean>; pinned: number[]; }

export interface SavedControls { save(): void; restore(): void; }

// Saves the controls matched by `selector`, and which of `panels` are pinned, under `storageKey`.
export function setupSavedControls(storageKey: string, selector: string, panels: Panels | null): SavedControls {
  const controls = [...document.querySelectorAll<HTMLInputElement | HTMLSelectElement>(selector)];

  function save(): void {
    const state: SavedState = { controls: {}, pinned: [] };
    for (const el of controls) {
      state.controls[el.id] = el instanceof HTMLInputElement && el.type === "checkbox" ? el.checked : el.value;
    }
    panels?.list.forEach((panel, i) => { if (panels.isPinned(panel)) state.pinned.push(i); });
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch { /* Not saved */ }
  }

  function restore(): void {
    let state: Partial<SavedState>;
    try {
      state = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
    } catch {
      return;
    }
    for (const el of controls) {
      const value = state.controls?.[el.id];
      if (value === undefined) continue;
      if (el instanceof HTMLInputElement && el.type === "checkbox") {
        el.checked = value === true;
      } else if (!(el instanceof HTMLSelectElement) || [...el.options].some(o => o.value === value)) {
        el.value = String(value);
      }
    }
    if (panels) for (const i of state.pinned ?? []) if (panels.list[i]) panels.setPinned(panels.list[i], true);
  }

  controls.forEach(el => {
    el.addEventListener("input", save);
    el.addEventListener("change", save);
  });
  return { save, restore };
}
