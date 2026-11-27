// ╭───────────────────────────────────────────────────────────────╮
// │      A plot with separate scales on its two axes (y = f(x))     │
// ╰───────────────────────────────────────────────────────────────╯
// The Scene of common/scene3d.ts draws ℝ² with one scale for both axes, which suits geometry, but
// a graph such as a probability density (heights near 0.4 over widths near 7) needs its own scale
// on each axis. A Plot2D maps a box [x0, x1] × [y0, y1] onto a rectangle of the canvas. It draws
// with the Scene's canvas, and uses the Scene's labels, so that labels avoid each other.

import { PlotLabel, Scene, gridStep, tickLabel, ticks } from "../common/scene3d";
import { anchorsAround } from "./widget";

/** A rectangle of the canvas, in CSS pixels. */
export interface Rect { x: number; y: number; w: number; h: number }

export const AXIS_COLOR = "#5f6368";
export const GRID_COLOR = "rgba(90, 110, 140, 0.18)";

/** The canvas of a Scene that has begun its frame, less a margin on each side. */
/**
 * The canvas (inside a margin) as a rectangle for a plot, without the bands along the top and the bottom edges that
 * hold the boxes `avoid` (such as a figure's box of calculations and its key), so that the boxes cover none of the plot.
 */
export function canvasRect(scene: Scene, margin = 4, ...avoid: (HTMLElement | null | undefined)[]): Rect {
  let top = 0, bottom = 0;
  for (const box of avoid) {
    if (!box || box.hidden || box.offsetHeight === 0) continue;
    // The band from the canvas's top (or bottom) edge to the far side of the box over it.
    if (box.dataset.corner?.startsWith("bottom")) bottom = Math.max(bottom, scene.height - box.offsetTop);
    else top = Math.max(top, box.offsetTop + box.offsetHeight);
  }
  return { x: margin, y: margin + top, w: scene.width - 2 * margin, h: scene.height - 2 * margin - top - bottom };
}

/**
 * The ranges, widened about their centers so that one unit is as long across as up, in a w × h area: the range with
 * more room per unit grows until it has as little as the other. (Neither shrinks, so all of both ranges stays in view.)
 */
export function equalRanges(x: [number, number], y: [number, number], w: number, h: number): [[number, number], [number, number]] {
  const unit = Math.min(w / (x[1] - x[0]), h / (y[1] - y[0]));
  const around = ([a, b]: [number, number], width: number): [number, number] => [(a + b) / 2 - width / 2, (a + b) / 2 + width / 2];
  return [around(x, w / unit), around(y, h / unit)];
}

/** A grid step for a range of the given width: 1, 2, or 5 times a power of 10, giving about 4 to 8 lines. */
export const stepFor = (width: number) => gridStep(width / 2);

export class Plot2D {
  constructor(
    public scene: Scene,
    public rect: Rect,
    public xRange: [number, number],
    public yRange: [number, number],
  ) {}

  get ctx(): CanvasRenderingContext2D { return this.scene.ctx; }

  /** The canvas point of the plot point (x, y). */
  px(x: number, y: number): [number, number] {
    const { rect: r, xRange: [x0, x1], yRange: [y0, y1] } = this;
    return [r.x + ((x - x0) / (x1 - x0)) * r.w, r.y + ((y1 - y) / (y1 - y0)) * r.h];
  }

  /** The plot point under the canvas point (px, py). */
  fromPx(px: number, py: number): [number, number] {
    const { rect: r, xRange: [x0, x1], yRange: [y0, y1] } = this;
    return [x0 + ((px - r.x) / r.w) * (x1 - x0), y1 - ((py - r.y) / r.h) * (y1 - y0)];
  }

  /** Runs `draw` with drawing limited to the plot's rectangle. */
  clipped(draw: () => void): void {
    const ctx = this.ctx, r = this.rect;
    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    draw();
    ctx.restore();
  }

  /**
   * The grid, the axes (where x = 0 and y = 0, or along the edges when those lines are out of view),
   * and labels on the ticks. `names` puts a name at the end of each axis. The x-axis has no tick labels near the
   * points `clearOf`, whose own labels (such as "a = 0.50") go there instead.
   */
  axes(o: { xStep?: number; yStep?: number; names?: [PlotLabel, PlotLabel]; clearOf?: number[] } = {}): void {
    const ctx = this.ctx, s = this.scene;
    const [x0, x1] = this.xRange, [y0, y1] = this.yRange;
    const xStep = o.xStep ?? stepFor(x1 - x0), yStep = o.yStep ?? stepFor(y1 - y0);
    const xTicks = ticks(x0, x1, xStep), yTicks = ticks(y0, y1, yStep);
    for (const t of xTicks) this.segment([t, y0], [t, y1], GRID_COLOR, 1);
    for (const t of yTicks) this.segment([x0, t], [x1, t], GRID_COLOR, 1);
    const ax = Math.min(x1, Math.max(x0, 0)), ay = Math.min(y1, Math.max(y0, 0));
    this.segment([x0, ay], [x1, ay], AXIS_COLOR, 1.5);
    this.segment([ax, y0], [ax, y1], AXIS_COLOR, 1.5);

    const font = `${s.px(11)}px system-ui, sans-serif`;
    ctx.font = s.font(font);
    ctx.textBaseline = "middle";
    const [, axisY] = this.px(0, ay), [axisX] = this.px(ax, 0);
    for (const t of xTicks) {
      if (Math.abs(t - ax) < xStep / 2) continue;
      const [x] = this.px(t, 0);
      const hw = ctx.measureText(tickLabel(t, xStep)).width / 2;
      if (x - hw < this.rect.x || x + hw > this.rect.x + this.rect.w) continue;
      if ((o.clearOf ?? []).some(c => Math.abs(this.px(c, 0)[0] - x) < hw + s.px(15) * 2.8)) continue;
      // Below the axis, unless the axis is at the bottom edge.
      const below = axisY + s.px(11) * 1.1 <= this.rect.y + this.rect.h;
      s.haloText(tickLabel(t, xStep), x, axisY + (below ? 1 : -1) * s.px(11) * 0.95, AXIS_COLOR, font);
    }
    for (const t of yTicks) {
      if (Math.abs(t - ay) < yStep / 2) continue;
      const [, y] = this.px(0, t);
      // None at the top, where the axis's name goes, or at the bottom edge.
      if (y < this.rect.y + (o.names ? s.px(15) * 1.6 : 6) || y > this.rect.y + this.rect.h - 6) continue;
      // Left of the axis, unless the axis is at the left edge.
      const w = ctx.measureText(tickLabel(t, yStep)).width;
      const left = axisX - w - 6 >= this.rect.x;
      s.haloText(tickLabel(t, yStep), axisX + (left ? -5 : 5), y, AXIS_COLOR, font, left ? "right" : "left");
    }
    ctx.textBaseline = "alphabetic";
    if (o.names) {
      const [ex, ey] = this.px(x1, ay), [nx, ny] = this.px(ax, y1);
      s.labelAway(o.names[0], [[ex, ey, -0.7, -0.7], [ex, ey, -0.7, 0.7]], AXIS_COLOR, `italic ${s.px(15)}px serif`, 4);
      s.labelAway(o.names[1], [[nx, ny, 0.7, 0.7], [nx, ny, -0.7, 0.7]], AXIS_COLOR, `italic ${s.px(15)}px serif`, 4);
    }
  }

  segment(a: [number, number], b: [number, number], color: string, width = 1.5, dash: number[] = []): void {
    this.path([a, b], color, width, dash);
  }

  /** A polyline. With `avoid` (for a graph), labels placed after it keep clear of it. */
  path(points: [number, number][], color: string, width = 2, dash: number[] = [], avoid = false): void {
    const ctx = this.ctx;
    ctx.beginPath();
    let last: [number, number] | null = null;
    points.forEach(([x, y], i) => {
      const [px, py] = this.px(x, y);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      // Only the parts on the canvas matter (a graph can shoot far off it).
      if (avoid && last && Number.isFinite(py) && Math.abs(py) < 1e5 && Math.abs(last[1]) < 1e5) this.scene.avoidSegment(last[0], last[1], px, py);
      last = [px, py];
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = "round";
    ctx.setLineDash(dash);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /** A filled polygon, with an optional outline. */
  polygon(points: [number, number][], fill: string, stroke?: string, width = 1): void {
    const ctx = this.ctx;
    ctx.beginPath();
    points.forEach(([x, y], i) => {
      const [px, py] = this.px(x, y);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.stroke();
    }
  }

  /** The region between the graph of f and the x-axis, for x from x0 to x1. */
  areaUnder(f: (x: number) => number, x0: number, x1: number, fill: string): void {
    if (!(x1 > x0)) return;
    const n = Math.max(2, Math.ceil(((x1 - x0) / (this.xRange[1] - this.xRange[0])) * 300));
    const pts: [number, number][] = [[x0, 0]];
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      pts.push([x, f(x)]);
    }
    pts.push([x1, 0]);
    this.polygon(pts, fill);
  }

  dot(x: number, y: number, radius: number, color: string, ring = false): void {
    const ctx = this.ctx;
    const [px, py] = this.px(x, y);
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, 2 * Math.PI);
    if (ring) {
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  /** A label near the plot point (x, y), placed by the Scene to avoid other labels. */
  label(text: PlotLabel, x: number, y: number, color: string, anchors = anchorsAround(...this.px(x, y)), gap = 5): void {
    this.scene.labelAway(text, anchors, color, `${this.scene.px(16)}px serif`, gap);
  }
}
