// ╭───────────────────────────────────────────────────────────────╮
// │            What a dictionary figure's widget is given           │
// ╰───────────────────────────────────────────────────────────────╯
// _includes/dictionary-figure.html makes a <figure> with a canvas, a box for controls (such as a
// slider), and a line of live text (the readout). ../dictionary_figures.ts finds the widget named
// in the figure's data-widget attribute and calls it once with this environment; the widget sets
// up its state and controls and returns the function that draws a frame.

import { mathHTML } from "../common/mathjax";
import { Scene, SPAN_GRID } from "../common/scene3d";
import { Pt } from "./geometry";

export interface FigureEnv {
  figure: HTMLElement;
  canvas: HTMLCanvasElement;
  scene: Scene;
  /** For sliders and other controls, below the canvas. */
  controls: HTMLElement;
  /** A line of text below the canvas that describes what the figure shows now. */
  readout: HTMLElement;
  /** A box over a corner of the canvas for the calculations behind the figure (see `showCalc`). */
  calc: HTMLElement;
  /** A box over a corner of the canvas for the key to the figure's symbols (see `showKey`). */
  key: HTMLElement;
  /** The figure's `params` from the front matter. */
  params: Record<string, unknown>;
  /** Asks for a new frame (at most one per animation frame). */
  redraw(): void;
}

export type Widget = (env: FigureEnv) => () => void;

/** Starts a frame of a plot of ℝ², with the grid unless the params say `grid: false`. */
export function beginPlane(env: FigureEnv, center: Pt, extent: number): void {
  env.scene.begin(env.canvas, { dim: 2, yaw: 0, pitch: 0, perspective: false, center: [center[0], center[1], 0], extent });
  if (env.params.grid !== false) env.scene.gridAndAxes(SPAN_GRID);
}

/** A label font for names of points and sets, enlarged on a large plot. */
export const labelFont = (scene: Scene) => `${scene.px(17)}px serif`;

/** Anchors for `Scene.labelAway` around a canvas point, in order of preference: up-right first, then around. */
export function anchorsAround(x: number, y: number): [number, number, number, number][] {
  return [45, 135, -45, -135, 90, 0, 180, -90].map((deg): [number, number, number, number] => {
    const t = (deg * Math.PI) / 180;
    return [x, y, Math.cos(t), -Math.sin(t)];
  });
}

/** Two decimals with a typographic minus, so the readout's width doesn't chatter while dragging. */
export const fixed = (v: number, digits = 2) => {
  const s = v.toFixed(digits);
  // −0.00 reads as a different number from 0.00.
  return (Number(s) === 0 ? s.replace("-", "") : s).replace("-", "−");
};

/** A slider below the canvas, with its label (HTML) beside it. Calls `input` with each new value. */
export function addSlider(
  env: FigureEnv, labelHtml: string, o: { min: number; max: number; step: number; value: number },
  input: (value: number) => void,
): HTMLInputElement {
  const label = document.createElement("label");
  label.className = "dict-figure__slider";
  label.innerHTML = labelHtml;
  const slider = document.createElement("input");
  Object.assign(slider, { type: "range", min: String(o.min), max: String(o.max), step: String(o.step), value: String(o.value) });
  slider.addEventListener("input", () => { input(Number(slider.value)); env.redraw(); });
  label.append(slider);
  env.controls.append(label);
  return slider;
}

/** A menu below the canvas, with its label (HTML) beside it. Calls `change` with each new choice. */
export function addSelect<T extends string>(
  env: FigureEnv, labelHtml: string, options: [value: T, text: string][], value: T, change: (value: T) => void,
): HTMLSelectElement {
  const label = document.createElement("label");
  label.className = "dict-figure__select";
  label.innerHTML = labelHtml;
  const select = document.createElement("select");
  for (const [v, text] of options) select.add(new Option(text, v, v === value, v === value));
  select.addEventListener("change", () => { change(select.value as T); env.redraw(); });
  label.append(select);
  env.controls.append(label);
  return select;
}

/** A button below the canvas. */
export function addButton(env: FigureEnv, text: string, click: () => void): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "dict-figure__button";
  button.textContent = text;
  button.addEventListener("click", click);
  env.controls.append(button);
  return button;
}

/** A whole number of degrees, such as "63°", with a typographic minus. */
export const degrees = (radians: number) => `${Math.round((radians * 180) / Math.PI)}°`.replace("-", "−");

/** A number without its sign: steady numbers keep room for digits only, since a gap for a sign looks like a typo. */
const unsigned = (text: string) => text.replace(/^[−-]/, "");

/**
 * A number in a readout that keeps the width of the widest of `widest` (strings formatted the same way, such as
 * the number's extremes), so that the text after it doesn't shift when the number gains or loses a digit. The number
 * is right-aligned in that width, like a counter, so its last digit stays put. (A number at the end of a line needs
 * none of this.)
 */
export const steady = (text: string, ...widest: string[]) =>
  `<span class="dict-figure__num">${widest.map(w => `<span class="dict-figure__num-room" aria-hidden="true">${unsigned(w)}</span>`).join("")}<span>${text}</span></span>`;

/** `fixed(v, digits)` in a readout, as wide as the widest value from `lo` to `hi` (see `steady`). */
export const steadyFixed = (v: number, lo: number, hi: number, digits = 2) =>
  steady(fixed(v, digits), fixed(lo, digits), fixed(hi, digits));

/**
 * `degrees(radians)` in a readout, as wide as the widest angle from `lo` to `hi` radians (see `steady`). An angle with
 * no bound (a rotation can be any number of turns) gets room for three digits, and grows past that.
 */
export const steadyDegrees = (radians: number, lo = -Infinity, hi = Infinity) => {
  const room = (r: number) => (Number.isFinite(r) ? degrees(r) : `${r < 0 ? "−" : ""}000°`);
  return steady(degrees(radians), room(lo), room(hi));
};

export type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

/**
 * Shows the calculations behind the figure, one line of TeX each, typeset by MathJax in a box over a corner of the
 * canvas, where they are larger and easier to notice than in the readout below it. No lines hide the box. The
 * figure's `calc_corner` param, if given, overrides `corner`, for a drawing that would be covered there.
 */
export function showCalc(env: FigureEnv, lines: string[], corner: Corner = "top-left"): void {
  const box = env.calc;
  // Until MathJax is ready, mathHTML gives a hidden placeholder, and redraws the figure once it is.
  const html = lines.map(line => `<div>${mathHTML(line, env.redraw)}</div>`).join("");
  box.hidden = lines.length === 0;
  box.dataset.corner = String(env.params.calc_corner ?? corner);
  // Rewriting the box only when it changes keeps it from flickering and from repeating itself to screen readers.
  if (calcShown.get(box) !== html) {
    calcShown.set(box, html);
    box.innerHTML = html;
  }
  const height = box.hidden ? 0 : box.offsetHeight;
  if (calcHeight.get(box) !== height) {
    calcHeight.set(box, height);
    env.redraw();
  }
}
const calcHeight = new WeakMap<HTMLElement, number>();
const calcShown = new WeakMap<HTMLElement, string>();

/**
 * Shows a key to the figure's symbols in a box over a corner of the canvas: each entry is a symbol (HTML, drawn in its
 * color) and what it stands for. No entries hide the box. The figure's `key_corner` param, if given, overrides `corner`.
 */
export function showKey(env: FigureEnv, entries: { symbol: string; color: string; label: string; id?: string }[], corner: Corner = "top-right"): void {
  const box = env.key;
  // An entry with an `id` names a part of the figure that the reader can point at in the key (see hoverKey).
  const html = entries.map(e => {
    const attrs = e.id === undefined ? "" : ` data-key-id="${e.id}" tabindex="0"`;
    return `<div${attrs}><span class="dict-figure__key-symbol" style="color: ${e.color}">${e.symbol}</span> ${e.label}</div>`;
  }).join("");
  box.hidden = entries.length === 0;
  box.dataset.corner = String(env.params.key_corner ?? corner);
  if (calcShown.get(box) !== html) {
    calcShown.set(box, html);
    box.innerHTML = html;
  }
  const height = box.hidden ? 0 : box.offsetHeight;
  if (calcHeight.get(box) !== height) {
    calcHeight.set(box, height);
    env.redraw();
  }
}

/**
 * Calls `onHover` with the id of the key's entry under the pointer (or focused), and with null once there is none, for
 * the entries of showKey that have an id.
 */
export function hoverKey(env: FigureEnv, onHover: (id: string | null) => void): void {
  const box = env.key;
  const entry = (e: Event) => (e.target as Element | null)?.closest?.<HTMLElement>("[data-key-id]")?.dataset.keyId ?? null;
  box.addEventListener("pointerover", e => onHover(entry(e)));
  box.addEventListener("pointerleave", () => onHover(null));
  box.addEventListener("focusin", e => onHover(entry(e)));
  box.addEventListener("focusout", () => onHover(null));
}

/** Highlights the key's entry with this id, and no other. */
export function markKey(env: FigureEnv, id: string | null): void {
  for (const row of env.key.querySelectorAll<HTMLElement>("[data-key-id]")) row.classList.toggle("is-active", row.dataset.keyId === id);
}

/**
 * Information about points of the figure, shown in a tip while the pointer is over one (or after a tap on one). Each
 * frame, the widget calls `clear` and then `add` for each point, with its position on the canvas and the tip's HTML.
 */
export class HoverTips {
  private points: { x: number; y: number; html: string }[] = [];
  private tip: HTMLElement;
  private at: [number, number] | null = null;

  constructor(private env: FigureEnv, private radius = 9) {
    this.tip = document.createElement("div");
    this.tip.className = "dict-figure__tip";
    this.tip.hidden = true;
    env.canvas.parentElement!.append(this.tip);
    const canvas = env.canvas;
    const track = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      this.at = [e.clientX - r.left, e.clientY - r.top];
      this.update();
    };
    canvas.addEventListener("pointermove", track);
    canvas.addEventListener("pointerdown", track);
    canvas.addEventListener("pointerleave", () => { this.at = null; this.update(); });
  }

  clear(): void {
    this.points = [];
  }

  add(x: number, y: number, html: string): void {
    this.points.push({ x, y, html });
  }

  /** Shows the tip of the point nearest the pointer, if it is close enough, or hides the tip. (Call after a frame.) */
  update(): void {
    const near = this.at && nearestWithin(this.points, this.at, this.radius);
    this.tip.hidden = !near;
    if (!near) return;
    if (this.tip.dataset.html !== near.html) {
      this.tip.dataset.html = near.html;
      this.tip.innerHTML = near.html;
    }
    this.tip.style.left = `${near.x}px`;
    this.tip.style.top = `${near.y}px`;
  }
}

/** The point nearest `at` within `radius`, or null (the first, among points equally near). */
export function nearestWithin<P extends { x: number; y: number }>(points: P[], at: [number, number], radius: number): P | null {
  let best: P | null = null, bestD = radius;
  for (const p of points) {
    const d = Math.hypot(p.x - at[0], p.y - at[1]);
    if (d <= bestD && (!best || d < bestD)) { best = p; bestD = d; }
  }
  return best;
}

/** Math in a key or readout, typeset by MathJax (hidden until MathJax is ready, and then the figure is redrawn). */
export const texHTML = (env: FigureEnv, tex: string) => mathHTML(tex, env.redraw);

/** TeX in a color (written as #rrggbb), to tie a number in a calculation to the part of the figure that shows it. */
export function texColor(color: string, tex: string): string {
  const n = parseInt(color.replace("#", ""), 16);
  return `{\\color[RGB]{${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}}{${tex}}}`;
}

/** TeX for a number as fixed() or degrees() writes it: a hyphen for the minus sign (TeX spaces it as a sign), and ^\circ. */
export const texNumber = (text: string) => text.replace(/−/g, "-").replace(/°/g, "^{\\circ}");

/** About how wide a number is in TeX's math font, in em, to choose the widest of several. */
export const texNumberWidth = (text: string) =>
  [...text].reduce((w, c) => w + (/\d/.test(c) ? 0.5 : c === "." ? 0.28 : c === "−" || c === "-" ? 0.78 : c === "°" ? 0.4 : 0.5), 0);

/**
 * TeX for a number that keeps the width of the widest of `widest` (formatted the same way), right-aligned in it, so
 * that the math after it doesn't shift when the number gains or loses a digit: steady() for showCalc.
 */
export function steadyTex(text: string, ...widest: string[]): string {
  const room = widest.map(unsigned).reduce((a, b) => (texNumberWidth(b) > texNumberWidth(a) ? b : a), text);
  return room === text ? `{${texNumber(text)}}` : `{\\phantom{${texNumber(room)}}\\llap{${texNumber(text)}}}`;
}

/** `fixed(v, digits)` in TeX, as wide as the widest value from `lo` to `hi` (see `steadyTex`). */
export const steadyFixedTex = (v: number, lo: number, hi: number, digits = 2) =>
  steadyTex(fixed(v, digits), fixed(lo, digits), fixed(hi, digits));

/** `degrees(radians)` in TeX, as wide as the widest angle from `lo` to `hi` radians (see `steadyTex`). */
export const steadyDegreesTex = (radians: number, lo: number, hi: number) =>
  steadyTex(degrees(radians), degrees(lo), degrees(hi));

/** Italic names in readouts: "<i>x</i>". */
export const it = (name: string) => `<i>${name}</i>`;
