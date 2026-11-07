// ╭───────────────────────────────────────────────────────────────╮
// │       Page helpers: canvases, panels, help, saved settings       │
// ╰───────────────────────────────────────────────────────────────╯
// Shared by the audio tools. Class names start with the page's prefix (for example, "ft-panel"),
// so that each page's styles stay separate.

import { loadJSON, saveJSON } from "../common/storage";
import type { Panels } from "../common/panels";

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
// Moved to common/panels.ts so that non-audio tools can use it too.
export { setupPanels } from "../common/panels";
export type { Panels } from "../common/panels";

// ⋘──────── Setting explanations ────────⋙
// Moved to common/help.ts so that non-audio tools can use it too.
export { setupHelp } from "../common/help";

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
    saveJSON(storageKey, state);
  }

  function restore(): void {
    const state = loadJSON<Partial<SavedState>>(storageKey) ?? {};
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
