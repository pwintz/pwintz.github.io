// ╭───────────────────────────────────────────────────────────────╮
// │           Vectors in ℝ² and ℝ³ drawn on a canvas              │
// ╰───────────────────────────────────────────────────────────────╯
// The drawing pieces of the span-of-vectors tool (../vector_span.ts), shared so other linear algebra
// tools look and behave the same: an orthographic (or perspective) view that rotates by dragging
// and keeps spinning after a fling, a grid on the plane z = 0 with labeled axes, arrows, dashed
// terms of a linear combination drawn tip to tail, a shaded subspace (line, plane, or all of
// space), and axes that ease to fit what's drawn.

import { mathHTML, mathHTMLReady, mathJaxReady } from './mathjax';

export type Vec3 = [number, number, number];

/**
 * A label in a plot: plain text, or text with TeX that MathJax draws in the same font as the math
 * in the explanations (with the reader's notation, such as for \vect). The text is drawn until
 * MathJax is ready.
 */
export type PlotLabel = string | { text: string; tex: string };

// ⋘──────── Math labels ────────⋙
// Each TeX label is typeset once by MathJax as an SVG, which becomes an image that canvases can draw.
// Images load asynchronously, so the plots that use them are redrawn when one is ready.

interface MathImage { img: HTMLImageElement; w: number; h: number; ready: boolean; failed?: boolean }
const mathImages = new Map<string, MathImage | null>();
const mathRedraws = new Set<() => void>();
let mathWaiting = false;
let redrawFrame = 0;

/** Calls `redraw` whenever a math label becomes ready to draw, so the plot can show it. */
export function redrawOnMathLabels(redraw: () => void): void {
  mathRedraws.add(redraw);
}

function requestRedraws(): void {
  if (redrawFrame) return;
  redrawFrame = requestAnimationFrame(() => {
    redrawFrame = 0;
    mathRedraws.forEach(f => f());
  });
}

// Whether MathJax failed to load, so that math labels are drawn as plain text instead.
let mathUnavailable = false;

/**
 * The image of `tex` in `color`, with its font `size` pixels; "pending" until it can be drawn; or "failed" if it
 * can't be (MathJax didn't load, or the TeX has an error), for the caller to draw plain text instead.
 */
function mathImage(tex: string, color: string, size: number): MathImage | "pending" | "failed" {
  const key = `${size}|${color}|${tex}`;
  const cached = mathImages.get(key);
  if (cached) return cached.ready ? cached : cached.failed ? "failed" : "pending";
  if (mathUnavailable) return "failed";
  const mj = (window as unknown as { MathJax?: { tex2svg?: (t: string, o: object) => HTMLElement } }).MathJax;
  if (!mj?.tex2svg) {
    if (!mathWaiting) {
      mathWaiting = true;
      void mathJaxReady().then(ok => {
        if (!ok) mathUnavailable = true;
        requestRedraws();
      });
    }
    return "pending";
  }
  let svg: SVGSVGElement | null = null;
  try {
    svg = mj.tex2svg(tex, { display: false }).querySelector('svg');
  } catch { /* Fall back to the text. */ }
  if (!svg || svg.querySelector('[data-mjx-error]')) {
    mathImages.set(key, { img: new Image(), w: 0, h: 0, ready: false, failed: true });
    return "failed";
  }
  // MathJax sizes the SVG in ex; an ex of its TeX font is about 0.45 of the font size.
  const ex = 0.45 * size;
  const w = parseFloat(svg.getAttribute('width') ?? '0') * ex;
  const h = parseFloat(svg.getAttribute('height') ?? '0') * ex;
  svg.setAttribute('width', `${w}`);
  svg.setAttribute('height', `${h}`);
  svg.setAttribute('color', color);
  svg.style.color = color;
  const img = new Image();
  const entry: MathImage = { img, w, h, ready: false };
  img.onload = () => { entry.ready = true; requestRedraws(); };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
  mathImages.set(key, entry);
  return "pending";
}

export const add3 = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub3 = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale3 = (k: number, a: Vec3): Vec3 => [k * a[0], k * a[1], k * a[2]];
export const dot3 = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const norm3 = (a: Vec3) => Math.sqrt(dot3(a, a));
export const cross3 = (a: Vec3, b: Vec3): Vec3 =>
  [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
/** Pads a vector in ℝ¹, ℝ², or ℝ³ with zeros. */
export const toVec3 = (v: number[]): Vec3 => [v[0] ?? 0, v[1] ?? 0, v[2] ?? 0];

/** An orthonormal basis of the span of `vs`, found by Gram–Schmidt. */
export function orthonormalBasis(vs: Vec3[]): Vec3[] {
  const basis: Vec3[] = [];
  for (const v of vs) {
    let w = v;
    for (const b of basis) w = add3(w, scale3(-dot3(w, b), b));
    const n = norm3(w);
    if (n > 1e-9 * Math.max(1, norm3(v)) && n > 1e-6) basis.push(scale3(1 / n, w));
  }
  return basis;
}

// The Okabe–Ito palette, which stays distinguishable under the common kinds of color blindness.
export const OKABE_ITO = {
  orange: '#E69F00', skyBlue: '#56B4E9', bluishGreen: '#009E73', yellow: '#F0E442',
  blue: '#0072B2', vermillion: '#D55E00', reddishPurple: '#CC79A7',
};
// A subspace is a neutral gray-blue so it doesn't compete with the vectors' colors.
export const SPAN_COLOR = 'rgba(120, 140, 170, 0.22)';
export const SPAN_EDGE = 'rgba(90, 110, 140, 0.9)';
export const SPAN_GRID = 'rgba(90, 110, 140, 0.3)';

/** The camera's distance from the center of the box, in units of the box's half-width. */
export const CAMERA_DISTANCE = 7;

// Fixed views along the coordinate axes, shown beside the main view in 3D. Each keeps the
// right-hand rule: the third axis points toward the viewer.
export const SIDE_VIEW_ANGLES = {
  top: { yaw: 0, pitch: Math.PI / 2 },      // x right, y up, z toward the viewer.
  front: { yaw: 0, pitch: 0 },              // x right, z up, y away.
  side: { yaw: -Math.PI / 2, pitch: 0 },    // y right, z up, x toward the viewer.
};

/** A grid spacing of 1, 2, or 5 times a power of 10 that gives about 2 to 4 lines per half-width. */
export function gridStep(halfWidth: number): number {
  const raw = halfWidth / 4;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  return [1, 2, 5, 10].map(m => m * p).find(step => step >= raw)!;
}

/** The multiples of `step` from `a` to `b`. */
export function ticks(a: number, b: number, step: number): number[] {
  const out: number[] = [];
  for (let i = Math.ceil(a / step - 1e-9); i * step <= b + 1e-9; i++) out.push(i * step);
  return out;
}

/**
 * A number with a true minus sign, for axis labels: with at most two decimals, or as many as ticks `step` apart need
 * to differ (such as 1.4142 and 1.4143, for ticks 0.0001 apart).
 */
export const tickLabel = (x: number, step?: number) => {
  const digits = Math.min(15, Math.max(2, step ? Math.ceil(-Math.log10(step) - 1e-9) : 0));
  const r = Number(x.toFixed(digits));
  return (Object.is(r, -0) ? 0 : r).toString().replace('-', '−');
};

export interface FrameOptions {
  dim: 2 | 3;
  yaw: number;
  pitch: number;
  perspective: boolean;
  center: Vec3;
  extent: number;
  /** An element over the canvas (such as a box of sliders); the plot is centered beside it. */
  avoid?: HTMLElement | null;
  /** Centers the plot below `avoid` (a box along the top), rather than wherever there is more room. */
  avoidBelow?: boolean;
}

/**
 * One canvas being drawn. `begin` sizes the canvas and sets up the projection; the drawing methods
 * then take points in world coordinates.
 */
export class Scene {
  ctx!: CanvasRenderingContext2D;
  dim: 2 | 3 = 3;
  yaw = 0;
  pitch = 0;
  perspective = false;
  center: Vec3 = [0, 0, 0];
  extent = 1;
  // Everything is drawn inside the box from `lo` to `hi` (in ℝ², stretched to the canvas's shape).
  lo: Vec3 = [-1, -1, -1];
  hi: Vec3 = [1, 1, 1];
  pxPerUnit = 1;
  cx = 0;
  cy = 0;
  /** The canvas's size in CSS pixels. */
  width = 0;
  height = 0;
  /**
   * How much to enlarge text and the gaps around it: 1 on a plot up to about 480 pixels across,
   * growing with the plot up to 1.5, so labels stay readable on a large screen.
   */
  textScale = 1;
  /**
   * The page's text, for a plot whose text should match the text around it (a dictionary figure), or null. When set,
   * `px(15)` is the page's font size, smaller and larger sizes are drawn closer to it (so tick labels are smaller,
   * but still readable), and text in system-ui is drawn in the page's font instead.
   */
  pageText: { size: number; family: string } | null = null;
  /**
   * A layer over the canvas (positioned like it) for math labels as HTML, typeset by MathJax exactly like the math
   * in the text around the plot, or null to draw math labels on the canvas as images.
   */
  htmlLayer: HTMLElement | null = null;
  private htmlLabels: HTMLElement[] = [];
  private htmlUsed = 0;
  // What has been drawn this frame that a label shouldn't cover: arrow shafts (as screen
  // segments) and the boxes of earlier labels.
  private shafts: [number, number, number, number][] = [];
  private labelBoxes: { x0: number; y0: number; x1: number; y1: number }[] = [];
  /** Marks a segment (in canvas pixels) that labels placed after it should keep clear of, such as a piece of a graph. */
  avoidSegment(x0: number, y0: number, x1: number, y1: number): void {
    this.shafts.push([x0, y0, x1, y1]);
  }

  // Labels wait until `finish`, so that they can avoid every arrow, including ones drawn after them.
  private pending: { priority: number; draw: () => void }[] = [];

  begin(canvas: HTMLCanvasElement, o: FrameOptions): void {
    this.ctx = canvas.getContext('2d')!;
    // The HTML labels of the last frame, hidden until this frame uses them again.
    this.htmlLabels.forEach(el => { el.hidden = true; });
    this.htmlUsed = 0;
    Object.assign(this, { dim: o.dim, yaw: o.yaw, pitch: o.pitch, perspective: o.perspective, center: o.center, extent: o.extent });
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width, h = rect.height;
    this.width = w;
    this.height = h;
    this.ctx.clearRect(0, 0, w, h);
    const region = plotRegion(rect, o.avoid ?? null, o.avoidBelow === true);
    this.cx = region.x + region.w / 2;
    this.cy = region.y + region.h / 2;
    const size = Math.min(region.w, region.h);
    this.textScale = this.pageText ? this.pageText.size / 15 : Math.max(1, Math.min(1.5, size / 480));
    this.shafts = [];
    this.labelBoxes = [];
    this.pending = [];
    const { center, extent } = o;
    if (o.dim === 2) {
      this.pxPerUnit = size / (2 * extent);
      // The grid still fills the whole canvas, out to its edges.
      this.lo = [center[0] - this.cx / this.pxPerUnit, center[1] - (h - this.cy) / this.pxPerUnit, 0];
      this.hi = [center[0] + (w - this.cx) / this.pxPerUnit, center[1] + this.cy / this.pxPerUnit, 0];
    } else {
      this.lo = center.map(c => c - extent) as Vec3;
      this.hi = center.map(c => c + extent) as Vec3;
      // Every point lies within `extent` of the center, so it stays in view at any rotation. Only
      // perspective can push a point farther out, by at most CAMERA_DISTANCE / (CAMERA_DISTANCE − 1).
      this.pxPerUnit = size / (2 * extent) * (o.perspective ? (CAMERA_DISTANCE - 1) / CAMERA_DISTANCE : 1);
    }
  }

  /** Projects a world point to canvas pixels, also returning its depth (larger is nearer). */
  project(world: Vec3): [number, number, number] {
    const p = sub3(world, this.center);
    if (this.dim === 2) return [this.cx + p[0] * this.pxPerUnit, this.cy - p[1] * this.pxPerUnit, 0];
    // World z is up. Rotate by yaw about z, then pitch about the screen's horizontal axis.
    const cyw = Math.cos(this.yaw), syw = Math.sin(this.yaw);
    const x1 = cyw * p[0] - syw * p[1];
    const y1 = syw * p[0] + cyw * p[1];
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    // The camera looks along +y (rotated), so x points right, z up, and y away from the viewer,
    // which is right-handed. With a positive pitch the camera looks down.
    const up = cp * p[2] + sp * y1;
    const depth = cp * y1 - sp * p[2]; // Distance away from the viewer.
    // With perspective, points shrink toward the screen's center as they get farther away.
    const k = this.perspective ? CAMERA_DISTANCE / (CAMERA_DISTANCE + depth / this.extent) : 1;
    return [this.cx + x1 * this.pxPerUnit * k, this.cy - up * this.pxPerUnit * k, -depth];
  }

  /** The world point under the canvas point (x, y), in ℝ². */
  unproject2D(x: number, y: number): [number, number] {
    return [(x - this.cx) / this.pxPerUnit + this.center[0], (this.cy - y) / this.pxPerUnit + this.center[1]];
  }

  line(a: Vec3, b: Vec3, color: string, width = 1, dash: number[] = []): void {
    const ctx = this.ctx;
    const [ax, ay] = this.project(a), [bx, by] = this.project(b);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  arrow(from: Vec3, to: Vec3, color: string, width: number, label?: PlotLabel, dash: number[] = []): void {
    const ctx = this.ctx;
    const [ax, ay] = this.project(from), [bx, by] = this.project(to);
    const len = Math.hypot(bx - ax, by - ay);
    if (len < 1) return;
    const ux = (bx - ax) / len, uy = (by - ay) / len;
    const head = Math.min(12, len * 0.4);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx - ux * head * 0.8, by - uy * head * 0.8);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx - ux * head - uy * head * 0.45, by - uy * head + ux * head * 0.45);
    ctx.lineTo(bx - ux * head + uy * head * 0.45, by - uy * head - ux * head * 0.45);
    ctx.closePath();
    ctx.fill();
    this.shafts.push([ax, ay, bx, by]);
    if (label) {
      // Beyond the tip, unless something drawn is there; then turned to one side or the other.
      const turn = (deg: number): [number, number] => {
        const t = deg * Math.PI / 180;
        return [ux * Math.cos(t) - uy * Math.sin(t), ux * Math.sin(t) + uy * Math.cos(t)];
      };
      const anchors = [0, -45, 45, -90, 90].map((deg): [number, number, number, number] => [bx, by, ...turn(deg)]);
      this.later(0, () => this.labelAway(label, anchors, color, `bold ${this.px(16)}px system-ui, sans-serif`, 8));
    }
  }

  /**
   * Draws the labels of arrows and segments, after everything else. Arrow labels are placed first,
   * so they get the spots nearest their tips.
   */
  finish(): void {
    const pending = this.pending;
    this.pending = [];
    pending.sort((a, b) => a.priority - b.priority).forEach(p => p.draw());
  }

  private later(priority: number, draw: () => void): void {
    this.pending.push({ priority, draw });
  }

  /** A font size in pixels, enlarged on a large plot, or matched to the page's text (see `pageText`). */
  px(size: number): number {
    if (this.pageText) return Math.round(this.pageText.size * (size / 15) ** 0.6);
    return Math.round(size * this.textScale);
  }

  /** A CSS font, with system-ui replaced by the page's font when the plot matches the page (see `pageText`). */
  font(font: string): string {
    return this.pageText ? font.replace(/system-ui, sans-serif/, this.pageText.family) : font;
  }

  /**
   * Text placed `gap` pixels from one of the `anchors` in its direction (a unit vector), measured to
   * the nearest edge of the text's box, so the text doesn't cover the anchor point. The anchors are
   * in order of preference; the first whose box is clear of the arrows and labels drawn so far is
   * used, or else the one that covers the least (covering a label is worse than crossing an arrow).
   * The text is kept inside the canvas.
   */
  labelAway(label: PlotLabel, anchors: [number, number, number, number][], color: string, font: string, gap: number): void {
    const ctx = this.ctx;
    const text = typeof label === 'string' ? label : label.text;
    const size = parseFloat(font.match(/(\d+(?:\.\d+)?)px/)?.[1] ?? '14');
    if (this.htmlLayer && typeof label !== 'string') {
      this.htmlLabel(label.tex, anchors, color, size, gap);
      return;
    }
    // TeX is drawn a little larger than the text, so its letters look the same size.
    const state = typeof label === 'string' ? "failed" : mathImage(label.tex, color, Math.round(size * 1.15));
    // Until MathJax draws a math label, it waits unseen: plain text in another style would show first and then
    // change, and TeX with commands (such as "f \\circ g") would show as code.
    if (state === "pending") return;
    const math = state === "failed" ? null : state;
    ctx.font = this.font(font);
    const hw = math ? math.w / 2 : ctx.measureText(text).width / 2;
    const hh = math ? math.h / 2 : size * 0.4;
    const place = ([x, y, ux, uy]: [number, number, number, number]) => {
      // The distance from the box's center to its edge in the direction (ux, uy).
      const d = gap * this.textScale + Math.abs(ux) * hw + Math.abs(uy) * hh;
      const lx = Math.max(hw + 2, Math.min(this.width - hw - 2, x + ux * d));
      const ly = Math.max(hh + 2, Math.min(this.height - hh - 2, y + uy * d));
      return { lx, ly, box: { x0: lx - hw - 2, y0: ly - hh - 2, x1: lx + hw + 2, y1: ly + hh + 2 } };
    };
    const cost = (b: { x0: number; y0: number; x1: number; y1: number }) =>
      this.shafts.filter(s => segmentHitsBox(s, b)).length
      + 10 * this.labelBoxes.filter(o => o.x0 < b.x1 && b.x0 < o.x1 && o.y0 < b.y1 && b.y0 < o.y1).length;
    // The cheapest spot, keeping the earliest among ties.
    const spot = anchors.map(place).map(c => ({ ...c, cost: cost(c.box) }))
      .reduce((best, c) => (c.cost < best.cost ? c : best));
    this.labelBoxes.push(spot.box);
    if (math) {
      this.haloImage(math, spot.lx, spot.ly);
      return;
    }
    ctx.textBaseline = 'middle';
    this.haloText(text, spot.lx, spot.ly, color, font);
    ctx.textBaseline = 'alphabetic';
  }

  /**
   * A math label as HTML in `htmlLayer`, placed like `labelAway` places text: typeset by MathJax (once it is ready;
   * until then, nothing shows), in the page's font size `size`, so that it matches the math around the plot.
   */
  private htmlLabel(tex: string, anchors: [number, number, number, number][], color: string, size: number, gap: number): void {
    if (!mathHTMLReady()) {
      // Typesets nothing yet, but redraws the plots once MathJax is ready.
      mathHTML(tex, requestRedraws);
      return;
    }
    let el = this.htmlLabels[this.htmlUsed];
    if (!el) {
      el = document.createElement('span');
      el.className = 'scene-math-label';
      this.htmlLayer!.append(el);
      this.htmlLabels.push(el);
    }
    this.htmlUsed++;
    el.hidden = false;
    el.style.color = color;
    el.style.fontSize = `${size}px`;
    if (el.dataset.tex !== tex) {
      el.dataset.tex = tex;
      el.innerHTML = mathHTML(tex, requestRedraws);
    }
    const hw = el.offsetWidth / 2, hh = el.offsetHeight / 2;
    const spot = this.placeLabel(anchors, hw, hh, gap);
    el.style.left = `${spot.lx - hw}px`;
    el.style.top = `${spot.ly - hh}px`;
  }

  /** The spot for a label box of half-size (hw, hh) near one of `anchors` (see `labelAway`), recorded as taken. */
  private placeLabel(anchors: [number, number, number, number][], hw: number, hh: number, gap: number): { lx: number; ly: number } {
    const place = ([x, y, ux, uy]: [number, number, number, number]) => {
      const d = gap * this.textScale + Math.abs(ux) * hw + Math.abs(uy) * hh;
      const lx = Math.max(hw + 2, Math.min(this.width - hw - 2, x + ux * d));
      const ly = Math.max(hh + 2, Math.min(this.height - hh - 2, y + uy * d));
      return { lx, ly, box: { x0: lx - hw - 2, y0: ly - hh - 2, x1: lx + hw + 2, y1: ly + hh + 2 } };
    };
    const cost = (b: { x0: number; y0: number; x1: number; y1: number }) =>
      this.shafts.filter(s => segmentHitsBox(s, b)).length
      + 10 * this.labelBoxes.filter(o => o.x0 < b.x1 && b.x0 < o.x1 && o.y0 < b.y1 && b.y0 < o.y1).length;
    const spot = anchors.map(place).map(c => ({ ...c, cost: cost(c.box) }))
      .reduce((best, c) => (c.cost < best.cost ? c : best));
    this.labelBoxes.push(spot.box);
    return spot;
  }

  /** A math label centered at (x, y), with a light halo like `haloText`. */
  private haloImage(m: MathImage, x: number, y: number): void {
    const ctx = this.ctx;
    const x0 = x - m.w / 2, y0 = y - m.h / 2;
    // The halo: the image, made white, drawn shifted in eight directions under it.
    const halo = haloCanvas(m);
    const r = 1.6 * this.textScale;
    ctx.globalAlpha = 0.85;
    for (let k = 0; k < 8; k++) {
      const t = k * Math.PI / 4;
      ctx.drawImage(halo, x0 + r * Math.cos(t), y0 + r * Math.sin(t), m.w, m.h);
    }
    ctx.globalAlpha = 1;
    ctx.drawImage(m.img, x0, y0, m.w, m.h);
  }

  /** Text with a light halo, so it stays readable over the grid and the shading. */
  haloText(text: string, x: number, y: number, color: string, font: string, align: CanvasTextAlign = 'center'): void {
    const ctx = this.ctx;
    ctx.font = this.font(font);
    ctx.textAlign = align;
    ctx.lineWidth = 3 * this.textScale;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.textAlign = 'start';
  }

  /**
   * Labels a segment such as the dashed term "1.7v₁" at its midpoint, offset to one side far
   * enough that the text's box clears the line.
   */
  segmentLabel(from: Vec3, to: Vec3, text: PlotLabel, color: string, bold: boolean): void {
    const [ax, ay] = this.project(from), [bx, by] = this.project(to);
    const len = Math.hypot(bx - ax, by - ay);
    if (len < 12) return;
    // The perpendicular pointing up-screen (or right, for a vertical line).
    let nx = -(by - ay) / len, ny = (bx - ax) / len;
    if (ny > 0 || (ny === 0 && nx < 0)) { nx = -nx; ny = -ny; }
    const font = `${bold ? 'bold ' : ''}${this.px(14)}px system-ui, sans-serif`;
    // At the midpoint, on either side, then nearer one end or the other.
    const anchors = [0.5, 0.35, 0.65].flatMap((t): [number, number, number, number][] => {
      const x = ax + (bx - ax) * t, y = ay + (by - ay) * t;
      return [[x, y, nx, ny], [x, y, -nx, -ny]];
    });
    this.later(1, () => this.labelAway(text, anchors, color, font, 6));
  }

  dot(p: Vec3, radius: number, color: string): void {
    const [x, y] = this.project(p);
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  polygon(points: Vec3[], fill: string, stroke?: string): void {
    const ctx = this.ctx;
    this.tracePath(points);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  /** A polyline through the points, such as a curve or the graph of a function; `closed` joins its ends. */
  path(points: Vec3[], color: string, width = 1.5, dash: number[] = [], closed = false): void {
    const ctx = this.ctx;
    this.tracePath(points, closed);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.setLineDash(dash);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /**
   * A shaded set bounded by the closed polygon `boundary`. The boundary is drawn dashed for an open
   * set (which doesn't contain its boundary) and solid for a closed one (which does).
   */
  region(boundary: Vec3[], fill: string, stroke: string, open: boolean, width = 1.75): void {
    this.tracePath(boundary, true);
    this.ctx.fillStyle = fill;
    this.ctx.fill();
    this.path(boundary, stroke, width, open ? [7, 5] : [], true);
  }

  private tracePath(points: Vec3[], closed = true): void {
    const ctx = this.ctx;
    ctx.beginPath();
    points.forEach((p, i) => {
      const [x, y] = this.project(p);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    if (closed) ctx.closePath();
  }

  /**
   * Draws the grid on the plane z = 0 and the coordinate axes, all within the box. One grid line is
   * labeled, or with `allTicks`, every tick on every axis (so coordinates can be read off).
   */
  gridAndAxes(gridColor: string, allTicks = false): void {
    const { lo, hi, ctx } = this;
    const step = gridStep(this.extent);
    for (const t of ticks(lo[0], hi[0], step)) this.line([t, lo[1], 0], [t, hi[1], 0], gridColor);
    for (const t of ticks(lo[1], hi[1], step)) this.line([lo[0], t, 0], [hi[0], t, 0], gridColor);
    const names = ['x', 'y', 'z'];
    for (let k = 0; k < this.dim; k++) {
      const a: Vec3 = [0, 0, 0], b: Vec3 = [0, 0, 0];
      a[k] = lo[k];
      b[k] = hi[k];
      this.line(a, b, '#5f6368', this.dim === 2 ? 1.5 : 1.2);
      if (this.dim === 3) {
        // Past the end of the axis, in its direction on screen, with a gap between the axis and
        // the nearest edge of the letter.
        const [ax, ay] = this.project(a), [x, y] = this.project(b);
        const len = Math.hypot(x - ax, y - ay) || 1;
        const ux = (x - ax) / len, uy = (y - ay) / len;
        const size = this.px(15);
        ctx.font = `italic ${size}px serif`;
        const hw = ctx.measureText(names[k]).width / 2, hh = size * 0.4;
        const d = 6 * this.textScale + Math.abs(ux) * hw + Math.abs(uy) * hh;
        const lx = x + ux * d, ly = y + uy * d;
        ctx.fillStyle = '#5f6368';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(names[k], lx, ly);
        ctx.textAlign = 'start';
        ctx.textBaseline = 'alphabetic';
        this.labelBoxes.push({ x0: lx - hw - 2, y0: ly - hh - 2, x1: lx + hw + 2, y1: ly + hh + 2 });
      }
    }
    if (allTicks) {
      this.tickLabels(step);
      return;
    }
    // Label one grid line so the scale can be read as the axes change. Prefer the positive side.
    const t = hi[0] >= step ? step : -step;
    const [x, y] = this.project([t, 0, 0]);
    ctx.fillStyle = '#5f6368';
    ctx.font = this.font(`${this.px(11)}px system-ui, sans-serif`);
    ctx.textAlign = 'center';
    ctx.fillText(tickLabel(t), x, y + this.px(13));
    ctx.textAlign = 'start';
  }

  /**
   * Labels the ticks (multiples of `step`, except 0) along each axis, beside the axis: below a
   * horizontal axis and left of a vertical one. Where the ticks are too close on screen for their
   * labels (an axis seen nearly end-on), every other one is labeled, or none. In ℝ², the labels of
   * an axis outside the view stay at the edge of the canvas.
   */
  private tickLabels(step: number): void {
    const { lo, hi, ctx } = this;
    const font = `${this.px(11)}px system-ui, sans-serif`;
    ctx.font = this.font(font);
    const hh = this.px(11) * 0.45;
    for (let k = 0; k < this.dim; k++) {
      const unit: Vec3 = [0, 0, 0];
      unit[k] = step;
      const [ox, oy] = this.project([0, 0, 0]), [ex, ey] = this.project(unit);
      const spacing = Math.hypot(ex - ox, ey - oy);
      if (spacing < 1) continue;
      const ux = (ex - ox) / spacing, uy = (ey - oy) / spacing;
      // The side of the axis for the labels: down, or left for a vertical axis.
      let nx = -uy, ny = ux;
      if (ny < -1e-9 || (Math.abs(ny) <= 1e-9 && nx > 0)) { nx = -nx; ny = -ny; }
      const ts = ticks(lo[k], hi[k], step).filter(t => Math.abs(t) > step / 2);
      const widest = Math.max(0, ...ts.map(t => ctx.measureText(tickLabel(t)).width));
      // The room each label takes along the axis.
      const room = Math.abs(ux) * (widest + 6) + Math.abs(uy) * (2 * hh + 4);
      const every = spacing >= room ? 1 : 2 * spacing >= room ? 2 : 0;
      if (every === 0) continue;
      for (const t of ts) {
        if (Math.round(t / step) % every !== 0) continue;
        const label = tickLabel(t);
        const hw = ctx.measureText(label).width / 2;
        const p: Vec3 = [0, 0, 0];
        p[k] = t;
        const [x, y] = this.project(p);
        const d = 4 * this.textScale + Math.abs(nx) * hw + Math.abs(ny) * hh;
        let lx = x + nx * d, ly = y + ny * d;
        if (this.dim === 2) {
          lx = Math.min(Math.max(lx, hw + 3), this.width - hw - 3);
          ly = Math.min(Math.max(ly, hh + 3), this.height - hh - 3);
        }
        ctx.textBaseline = 'middle';
        this.haloText(label, lx, ly, '#5f6368', font);
        ctx.textBaseline = 'alphabetic';
        this.labelBoxes.push({ x0: lx - hw - 2, y0: ly - hh - 2, x1: lx + hw + 2, y1: ly + hh + 2 });
      }
    }
  }

  /** The segment of the line through the origin along `d` that lies inside the box. */
  clipLine(d: Vec3): [Vec3, Vec3] {
    let tMin = -Infinity, tMax = Infinity;
    for (let k = 0; k < this.dim; k++) {
      if (Math.abs(d[k]) < 1e-12) continue;
      const [t1, t2] = [this.lo[k] / d[k], this.hi[k] / d[k]].sort((m, n) => m - n);
      tMin = Math.max(tMin, t1);
      tMax = Math.min(tMax, t2);
    }
    return [scale3(tMin, d), scale3(tMax, d)];
  }

  /**
   * The polygon where the plane through the origin spanned by orthonormal `u`, `w` meets the box:
   * the plane's crossings of the box's 12 edges, sorted by angle around their centroid.
   */
  clipPlane(u: Vec3, w: Vec3): Vec3[] {
    const { lo, hi } = this;
    const n = cross3(u, w);
    const points: Vec3[] = [];
    for (let k = 0; k < 3; k++) {
      if (Math.abs(n[k]) < 1e-12) continue;
      // Edges parallel to axis k: each other coordinate is at its low or high bound.
      const [a, b] = [0, 1, 2].filter(j => j !== k);
      for (const sa of [lo[a], hi[a]]) for (const sb of [lo[b], hi[b]]) {
        const p: Vec3 = [0, 0, 0];
        p[a] = sa;
        p[b] = sb;
        p[k] = -(n[a] * sa + n[b] * sb) / n[k];
        if (p[k] >= lo[k] - 1e-9 && p[k] <= hi[k] + 1e-9) points.push(p);
      }
    }
    if (points.length === 0) return points;
    const mid = scale3(1 / points.length, points.reduce(add3));
    const angle = (p: Vec3) => { const q = sub3(p, mid); return Math.atan2(dot3(q, w), dot3(q, u)); };
    return points.sort((p, q) => angle(p) - angle(q));
  }

  /** The six faces of the box, as corner lists. */
  boxFaces(): Vec3[][] {
    const { lo, hi } = this;
    const c = (i: number, j: number, k: number): Vec3 => [[lo[0], hi[0]][i], [lo[1], hi[1]][j], [lo[2], hi[2]][k]];
    return [
      [c(0, 0, 0), c(1, 0, 0), c(1, 1, 0), c(0, 1, 0)],
      [c(0, 0, 1), c(1, 0, 1), c(1, 1, 1), c(0, 1, 1)],
      [c(0, 0, 0), c(1, 0, 0), c(1, 0, 1), c(0, 0, 1)],
      [c(0, 1, 0), c(1, 1, 0), c(1, 1, 1), c(0, 1, 1)],
      [c(0, 0, 0), c(0, 1, 0), c(0, 1, 1), c(0, 0, 1)],
      [c(1, 0, 0), c(1, 1, 0), c(1, 1, 1), c(1, 0, 1)],
    ];
  }

  /**
   * Shades the subspace with the orthonormal basis `basis`: a line, a plane, or all of space.
   * A line or a plane in ℝ³ gets the `label`, if one is given, near its edge.
   */
  subspace(basis: Vec3[], label?: PlotLabel): void {
    const font = `${this.px(15)}px system-ui, sans-serif`;
    if (basis.length === 1) {
      const [from, to] = this.clipLine(basis[0]);
      this.line(from, to, SPAN_EDGE, 5);
      if (label) {
        // Near one end of the line, beside it: try both ends and both sides.
        const [ax, ay] = this.project(from), [bx, by] = this.project(to);
        const len = Math.hypot(bx - ax, by - ay);
        if (len > 1) {
          const nx = -(by - ay) / len, ny = (bx - ax) / len;
          const anchors = [0.88, 0.12].flatMap((t): [number, number, number, number][] => {
            const x = ax + (bx - ax) * t, y = ay + (by - ay) * t;
            return [[x, y, nx, ny], [x, y, -nx, -ny]];
          });
          this.later(2, () => this.labelAway(label, anchors, SPAN_EDGE, font, 6));
        }
      }
    } else if (basis.length === 2 && this.dim === 3) {
      const [u, w] = basis;
      const outline = this.clipPlane(u, w);
      if (outline.length < 3) return;
      this.polygon(outline, SPAN_COLOR, SPAN_EDGE);
      if (label) {
        // Inside the plane, near one of its corners, toward the center.
        const mid = scale3(1 / outline.length, outline.reduce(add3));
        const [mx, my] = this.project(mid);
        const anchors = outline.map((c): [number, number, number, number] => {
          const [cx, cy] = this.project(add3(mid, scale3(0.93, sub3(c, mid))));
          const d = Math.hypot(mx - cx, my - cy) || 1;
          return [cx, cy, (mx - cx) / d, (my - cy) / d];
        });
        this.later(2, () => this.labelAway(label, anchors, SPAN_EDGE, font, 4));
      }
      // Grid lines on the plane, clipped to the outline.
      const ctx = this.ctx;
      ctx.save();
      this.tracePath(outline);
      ctx.clip();
      const R = Math.max(...outline.map(norm3)), step = gridStep(this.extent) * 2;
      for (let t = -Math.floor(R / step) * step; t <= R; t += step) {
        this.line(add3(scale3(t, u), scale3(-R, w)), add3(scale3(t, u), scale3(R, w)), SPAN_GRID);
        this.line(add3(scale3(-R, u), scale3(t, w)), add3(scale3(R, u), scale3(t, w)), SPAN_GRID);
      }
      ctx.restore();
    } else if (basis.length === 2) {
      const { lo, hi } = this;
      this.polygon([[lo[0], lo[1], 0], [hi[0], lo[1], 0], [hi[0], hi[1], 0], [lo[0], hi[1], 0]], SPAN_COLOR);
    } else if (basis.length === 3) {
      // All of ℝ³: shade the whole box.
      for (const f of this.boxFaces()) this.polygon(f, 'rgba(120, 140, 170, 0.08)', 'rgba(90, 110, 140, 0.5)');
    }
  }

  /** A right-angle mark at `corner` between the directions `u` and `w`, `size` pixels on a side. */
  rightAngle(corner: Vec3, u: Vec3, w: Vec3, color: string, size = 11): void {
    const nu = norm3(u), nw = norm3(w);
    if (nu < 1e-12 || nw < 1e-12) return;
    const k = size / this.pxPerUnit;
    const a = add3(corner, scale3(k / nu, u)), b = add3(corner, scale3(k / nw, w));
    const c = add3(a, scale3(k / nw, w));
    this.line(a, c, color, 1.3);
    this.line(c, b, color, 1.3);
  }

  /**
   * Drop lines: a dotted line from each tip straight down (or up) to the plane z = 0, and from
   * there to the origin, so the height and floor position of each point can be read.
   */
  dropLines(tips: [Vec3, string][]): void {
    for (const [t, color] of tips) {
      if (Math.abs(t[2]) < 1e-9) continue;
      const foot: Vec3 = [t[0], t[1], 0];
      this.ctx.globalAlpha = 0.6;
      this.line(t, foot, color, 1, [2, 3]);
      this.line([0, 0, 0], foot, color, 1, [2, 3]);
      this.dot(foot, 2.5, color);
      this.ctx.globalAlpha = 1;
    }
  }
}

const halos = new WeakMap<MathImage, HTMLCanvasElement>();

/** A white copy of a math label's image, for its halo. */
function haloCanvas(m: MathImage): HTMLCanvasElement {
  let c = halos.get(m);
  if (!c) {
    c = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    c.width = Math.max(1, Math.ceil(m.w * dpr));
    c.height = Math.max(1, Math.ceil(m.h * dpr));
    const x = c.getContext('2d')!;
    x.drawImage(m.img, 0, 0, c.width, c.height);
    x.globalCompositeOperation = 'source-in';
    x.fillStyle = '#fff';
    x.fillRect(0, 0, c.width, c.height);
    halos.set(m, c);
  }
  return c;
}

/** Whether the segment [x0, y0, x1, y1] passes through the box (by Liang–Barsky clipping). */
function segmentHitsBox([x0, y0, x1, y1]: [number, number, number, number], b: { x0: number; y0: number; x1: number; y1: number }): boolean {
  const dx = x1 - x0, dy = y1 - y0;
  let t0 = 0, t1 = 1;
  for (const [p, q] of [[-dx, x0 - b.x0], [dx, b.x1 - x0], [-dy, y0 - b.y0], [dy, b.y1 - y0]]) {
    if (p === 0) {
      if (q < 0) return false;
    } else {
      const t = q / p;
      if (p < 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
      if (t0 > t1) return false;
    }
  }
  return true;
}

/**
 * Where to center the plot: the whole canvas, or, when an element floats over it, the strip to its
 * right or the strip below it, whichever fits a larger square.
 */
function plotRegion(rect: DOMRect, avoid: HTMLElement | null, onlyBelow = false): { x: number; y: number; w: number; h: number } {
  const w = rect.width, h = rect.height;
  let region = { x: 0, y: 0, w, h };
  if (avoid && avoid.offsetWidth > 0) {
    const o = avoid.getBoundingClientRect();
    const right = { x: o.right - rect.left, y: 0, w: rect.right - o.right, h };
    const under = { x: 0, y: o.bottom - rect.top, w, h: rect.bottom - o.bottom };
    const best = onlyBelow ? under : [right, under].reduce((a, b) => (Math.min(b.w, b.h) > Math.min(a.w, a.h) ? b : a));
    // Only when the open strip is really cramped (under a third of the canvas) would the plot get
    // too small, so then draw under the box instead.
    if (Math.min(best.w, best.h) > 0.33 * Math.min(w, h)) region = best;
  }
  return region;
}

// ⋘──────── Axes that ease to fit ────────⋙
// The target box fits the given points with a small margin. While anything is being dragged, the
// target is held so the axes don't move under the pointer; when the drag ends, the box eases to
// the new target.

export interface Box { center: Vec3; extent: number }

/** The box around `points` (with the origin), with a margin. In 3D it fits their bounding sphere. */
export function fitBox(points: Vec3[], dim: 2 | 3, margin = 1.15, minExtent = 0.5): Box {
  const all: Vec3[] = [[0, 0, 0], ...points];
  const mid: Vec3 = [0, 0, 0];
  let half = 0;
  for (let k = 0; k < dim; k++) {
    const a = Math.min(...all.map(p => p[k])), b = Math.max(...all.map(p => p[k]));
    mid[k] = (a + b) / 2;
    half = Math.max(half, (b - a) / 2);
  }
  // In 3D, the view can be rotated to any angle, so fit the sphere around the points rather than
  // their bounding box: its radius bounds how far any point can appear from the center on screen.
  if (dim === 3) half = Math.max(...all.map(p => norm3(sub3(p, mid))));
  return { center: mid, extent: Math.max(minExtent, half * margin) };
}

export class EasedBox implements Box {
  center: Vec3 = [0, 0, 0];
  extent = 5;
  private frame = 0;
  private hold = false;

  /** `target` gives the box to ease toward; `redraw` draws a frame at the current box. */
  constructor(private target: () => Box, private redraw: () => void) {}

  /** Jumps to the target, such as on the first draw. */
  snap(): void {
    ({ center: this.center, extent: this.extent } = this.target());
  }

  /** Starts easing toward the target, unless a drag is holding the box. */
  update(): void {
    if (this.hold || this.frame) return;
    const near = (t: Box) =>
      Math.abs(t.extent - this.extent) < 1e-3 * t.extent
      && Math.max(...t.center.map((c, k) => Math.abs(c - this.center[k]))) < 1e-3 * t.extent;
    const step = (prev: number) => {
      this.frame = requestAnimationFrame(now => {
        const target = this.target();
        const dt = Math.min(50, now - prev);
        const k = 1 - Math.exp(-dt / 90);
        // Ease the size in log scale so growing and shrinking feel the same at any size.
        this.extent = Math.exp(Math.log(this.extent) + (Math.log(target.extent) - Math.log(this.extent)) * k);
        this.center = this.center.map((c, j) => c + (target.center[j] - c) * k) as Vec3;
        const done = near(target) || this.hold;
        if (done && !this.hold) ({ center: this.center, extent: this.extent } = target);
        this.redraw();
        if (done) this.frame = 0;
        else step(now);
      });
    };
    if (!near(this.target())) step(performance.now());
  }

  /** Holds the axes during a drag; releasing lets them ease to fit. */
  setHold(hold: boolean): void {
    this.hold = hold;
    if (!hold) this.update();
  }
}

// ⋘──────── Rotating by dragging, with momentum ────────⋙
// Dragging rotates the view. After a fling, the view keeps rotating with the release velocity until
// the canvas is touched again: the pitch (vertical) part slows to a stop, while the yaw
// (horizontal) part keeps its speed.

export const PITCH_LIMIT = 1.5;
/** Time for the pitch speed of a fling to fall by a factor of e, in milliseconds. */
const PITCH_DAMPING_TIME = 500;

export class Rotator {
  private velocity = { yaw: 0, pitch: 0 }; // Radians per millisecond.
  private frame = 0;
  private last: { x: number; y: number; t: number } | null = null;

  /** `angles` is the view's orientation, changed in place; `redraw` is called after each change. */
  constructor(private angles: { yaw: number; pitch: number }, private redraw: () => void) {}

  get dragging(): boolean { return this.last !== null; }

  /** Stops any spin, such as when the canvas is touched. */
  stop(): void {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  start(x: number, y: number): void {
    this.stop();
    this.velocity = { yaw: 0, pitch: 0 };
    this.last = { x, y, t: performance.now() };
  }

  move(x: number, y: number): void {
    if (!this.last) return;
    const now = performance.now();
    const dt = Math.max(1, now - this.last.t);
    const dyaw = (x - this.last.x) * 0.01, dpitch = (y - this.last.y) * 0.01;
    // Smooth the angular velocity so a fling uses the recent motion.
    this.velocity.yaw = 0.6 * (dyaw / dt) + 0.4 * this.velocity.yaw;
    this.velocity.pitch = 0.6 * (dpitch / dt) + 0.4 * this.velocity.pitch;
    this.rotateBy(dyaw, dpitch);
    this.last = { x, y, t: now };
    this.redraw();
  }

  /** Ends a drag; `fling` is false for a cancelled pointer. */
  end(fling: boolean): void {
    if (!this.last) return;
    // A pause before release means the pointer was held still, so no fling.
    const still = performance.now() - this.last.t > 80;
    this.last = null;
    if (fling && !still && Math.hypot(this.velocity.yaw, this.velocity.pitch) > 1e-4) this.coast(performance.now());
  }

  private rotateBy(dyaw: number, dpitch: number): void {
    this.angles.yaw += dyaw;
    this.angles.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, this.angles.pitch + dpitch));
  }

  private coast(prev: number): void {
    this.frame = requestAnimationFrame(now => {
      const dt = Math.min(50, now - prev);
      this.rotateBy(this.velocity.yaw * dt, this.velocity.pitch * dt);
      this.velocity.pitch *= Math.exp(-dt / PITCH_DAMPING_TIME);
      // Stop pitching at the limits instead of pushing against them.
      if (Math.abs(this.angles.pitch) >= PITCH_LIMIT) this.velocity.pitch = 0;
      this.redraw();
      if (Math.hypot(this.velocity.yaw, this.velocity.pitch) > 2e-5) this.coast(now);
      else this.frame = 0;
    });
  }
}
