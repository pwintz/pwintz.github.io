// ╭───────────────────────────────────────────────────────────────╮
// │        Sets, curves, and vectors in the plane, or on a line     │
// ╰───────────────────────────────────────────────────────────────╯
// A drawing of shapes in ℝ² (with one scale for both axes), given entirely by the params:
//
//   x, y:        the ranges to show (both are shown in full; the canvas's shape decides the rest).
//   grid:        whether to draw the grid and axes (default true).
//   number_line: draw only the x-axis, as a number line, with ticks at `ticks` (default: evenly spaced).
//   field:       ["f(x, y)", "g(x, y)"], a vector field (such as the right side of ẋ = f, ẏ = g), drawn as
//                short gray arrows of one length; `vars` renames x and y (such as ["q", "p"]).
//   reflect:     whether clicking a line reflects the other shapes across it (animated; clicking it again
//                reflects them back), as for the lines of symmetry of a shape.
//   rotate:      an angle in degrees, such as 90: a button turns the shapes (but not the lines) by it,
//                counterclockwise about `rotate_center` (default the origin), as for rotational symmetry.
//                With `reflect` or `rotate`, a button puts the shapes back.
//   shapes:      a list, drawn in order. Each has one of these keys:
//     disk: [cx, cy, r]        a filled disk; `hole: r0` makes it an annulus.
//     circle: [cx, cy, r]      a circle.
//     polygon: [[x, y], ...]   a filled polygon; `fill: false` draws only its sides. `edges: [c, ...]` draws
//                              each side (from the first corner to the next, and so on) thick, in its own
//                              color (numbers as for `color`), on a neutral fill, so that a symmetry that
//                              moves the sides shows.
//     curve: ["x(t)", "y(t)"]  a parametric curve, for t in `t: [a, b]` (numbers or formulas such as "2 pi");
//                              `closed: true` joins its ends.
//     segment: [[x, y], [x, y]]
//     line: [[x, y], [dx, dy]] the whole line through a point, in a direction.
//     halfplane: [[x, y], [nx, ny]]  the points p such that (p − (x, y)) · (nx, ny) ≤ 0.
//     vector: [x, y] (from the origin) or [[x0, y0], [x1, y1]]
//     point: [x, y]            a dot; `open: true` for a hollow one.
//     interval: [a, b]         a thick segment on the x-axis (or at `height` above it), with `ends`
//                              such as "[)" (filled or hollow dots; a space for none).
//     trajectory: [x0, y0]     the solution of the `field` from (x0, y0), for the time `t: T` (negative
//                              for backward in time), with an arrowhead showing its direction.
//   and, optionally:
//     open:     for a disk, polygon, or half-plane, a dashed boundary (the set doesn't contain it).
//     color:    a number, choosing from the colors of ./function_plot.ts (default 0, blue; 6 is gray).
//     dash:     dash the curve, segment, line, or circle.
//     label:    TeX, placed beside the shape, or at `label_at: [x, y]`. With `words: true`, the label is
//               words instead, in the page's font, like the text around the figure.
//     map:      [[a, b], [c, d]], to draw the image of the shape under the linear map with this matrix.

import { PlotLabel, SPAN_COLOR, SPAN_GRID, Vec3, gridStep, tickLabel, ticks } from "../common/scene3d";
import { FnN, parseFormula, parseFormulaIn } from "./expression";
import { PLOT_COLORS } from "./function_plot";
import { Pt, circlePoints } from "./geometry";
import { AXIS_COLOR } from "./plot2d";
import { Widget, addButton, anchorsAround, labelFont } from "./widget";

type Matrix = [[number, number], [number, number]];
// The radius of a point's dot, in pixels.
const DOT = 5;

export interface ShapeSpec {
  disk?: [number, number, number]; hole?: number;
  circle?: [number, number, number];
  polygon?: Pt[]; fill?: boolean; edges?: number[];
  curve?: [string, string]; t?: [number | string, number | string] | number; closed?: boolean; samples?: number;
  segment?: [Pt, Pt];
  line?: [Pt, Pt];
  halfplane?: [Pt, Pt];
  vector?: Pt | [Pt, Pt];
  point?: Pt;
  interval?: [number, number]; ends?: string; height?: number;
  trajectory?: Pt;
  open?: boolean; color?: number; dash?: boolean; label?: string; label_at?: Pt; map?: Matrix; words?: boolean;
}

/** An affine map p ↦ m p + b. */
export interface Affine { m: Matrix; b: Pt }
export const IDENTITY: Affine = { m: [[1, 0], [0, 1]], b: [0, 0] };

export const applyAffine = (a: Affine, p: Pt): Pt => {
  const [x, y] = applyMap(a.m, p);
  return [x + a.b[0], y + a.b[1]];
};

/** The reflection across the line through q in the direction d. */
export function reflectionAcross(q: Pt, d: Pt): Affine {
  const n = d[0] * d[0] + d[1] * d[1];
  const m: Matrix = [[(2 * d[0] * d[0]) / n - 1, (2 * d[0] * d[1]) / n], [(2 * d[0] * d[1]) / n, (2 * d[1] * d[1]) / n - 1]];
  const mq = applyMap(m, q);
  return { m, b: [q[0] - mq[0], q[1] - mq[1]] };
}

/** The rotation by the angle t (in radians, counterclockwise) about the point c. */
export function rotationAbout(c: Pt, t: number): Affine {
  const m: Matrix = [[Math.cos(t), -Math.sin(t)], [Math.sin(t), Math.cos(t)]];
  const mc = applyMap(m, c);
  return { m, b: [c[0] - mc[0], c[1] - mc[1]] };
}

/** The map `outer` after `inner`: p ↦ outer(inner(p)). */
export function composeAffine(outer: Affine, inner: Affine): Affine {
  const [[a, b], [c, d]] = outer.m, [[e, f], [g, h]] = inner.m;
  return { m: [[a * e + b * g, a * f + b * h], [c * e + d * g, c * f + d * h]], b: applyAffine(outer, inner.b) };
}

/**
 * The map a fraction t of the way from `from` to `to`, entry by entry. Between a shape and its mirror image, the shape
 * squeezes onto the mirror and opens out on the other side, as if it turned over.
 */
export function lerpAffine(from: Affine, to: Affine, t: number): Affine {
  const l = (x: number, y: number) => x + (y - x) * t;
  return {
    m: [[l(from.m[0][0], to.m[0][0]), l(from.m[0][1], to.m[0][1])], [l(from.m[1][0], to.m[1][0]), l(from.m[1][1], to.m[1][1])]],
    b: [l(from.b[0], to.b[0]), l(from.b[1], to.b[1])],
  };
}

/** The distance from p to the line through q in the direction d. */
export function distanceToLine(p: Pt, q: Pt, d: Pt): number {
  return Math.abs((p[0] - q[0]) * d[1] - (p[1] - q[1]) * d[0]) / Math.hypot(d[0], d[1]);
}

/** The image of a point under the linear map with matrix m (or the point itself, without one). */
export const applyMap = (m: Matrix | undefined, [x, y]: Pt): Pt =>
  m ? [m[0][0] * x + m[0][1] * y, m[1][0] * x + m[1][1] * y] : [x, y];

/** A number given as a number or as a formula without variables, such as "2 pi". */
export function constantValue(v: number | string): number {
  return typeof v === "number" ? v : parseFormula(v)(0);
}

/**
 * The part of the polygon `poly` where (p − a) · n ≤ 0 (Sutherland–Hodgman clipping by one edge).
 */
export function clipHalfPlane(poly: Pt[], a: Pt, n: Pt): Pt[] {
  const side = (p: Pt) => (p[0] - a[0]) * n[0] + (p[1] - a[1]) * n[1];
  const out: Pt[] = [];
  poly.forEach((p, i) => {
    const q = poly[(i + 1) % poly.length];
    const sp = side(p), sq = side(q);
    if (sp <= 0) out.push(p);
    if ((sp < 0 && sq > 0) || (sp > 0 && sq < 0)) {
      const t = sp / (sp - sq);
      out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
    }
  });
  return out;
}

/** The view's half-width in world units such that the ranges x and y both fit on a w × h canvas. */
export function fitExtent(x: [number, number], y: [number, number], w: number, h: number): number {
  const m = Math.min(w, h);
  return Math.max(((x[1] - x[0]) / 2) * (m / w), ((y[1] - y[0]) / 2) * (m / h));
}

/** A color with the given opacity, from "#rrggbb". */
export function translucent(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/**
 * The solution of ẋ = f(x) in ℝ² from x0 for the time T (backward if T < 0), by the Runge–Kutta
 * method with steps of h, stopping early if it leaves the disk of radius `bound`.
 */
export function integrate(f: (p: Pt) => Pt, x0: Pt, T: number, h = 0.01, bound = 1e3): Pt[] {
  const n = Math.ceil(Math.abs(T) / h), dt = T / Math.max(1, n);
  const pts: Pt[] = [x0];
  let [x, y] = x0;
  for (let i = 0; i < n; i++) {
    const k1 = f([x, y]);
    const k2 = f([x + (dt / 2) * k1[0], y + (dt / 2) * k1[1]]);
    const k3 = f([x + (dt / 2) * k2[0], y + (dt / 2) * k2[1]]);
    const k4 = f([x + dt * k3[0], y + dt * k3[1]]);
    x += (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
    y += (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y) || Math.hypot(x, y) > bound) break;
    pts.push([x, y]);
  }
  return pts;
}

const v3 = ([x, y]: Pt): Vec3 => [x, y, 0];
const DASH = [7, 5];

export const planeFigure: Widget = env => {
  const p = env.params;
  const numberLine = p.number_line === true;
  const xRange = (p.x as [number, number] | undefined) ?? [-2, 2];
  const yRange = (p.y as [number, number] | undefined) ?? (numberLine ? [-0.5, 0.5] : [-2, 2]);
  const shapes = (p.shapes as ShapeSpec[] | undefined) ?? [];
  // Reflecting the shapes across a clicked line, or rotating them with a button: the map applied to every shape but
  // the lines once they arrive (`to`), the way there from where they were while it is animated (`path`), and the line
  // under the pointer. A click during an animation acts on where the shapes are headed, not where they are now.
  const mirrors = p.reflect === true ? shapes.filter(sh => sh.line) : [];
  const turn = typeof p.rotate === "number" ? (p.rotate * Math.PI) / 180 : 0;
  let to = IDENTITY, path: ((t: number) => Affine) | null = null, started = 0, hovered: ShapeSpec | null = null;
  const DURATION = 700;
  const moving = () => {
    if (!path) return to;
    const t = Math.min(1, (performance.now() - started) / DURATION);
    if (t >= 1) { path = null; return to; }
    return path(t * t * (3 - 2 * t));
  };
  const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  /** Moves the shapes to `next`, along `way` (from the current map, at t = 0, to `next`, at t = 1). */
  const animateTo = (next: Affine, way: (from: Affine) => (t: number) => Affine) => {
    const from = moving();
    spin = null;
    to = next;
    if (reduce) { path = null; env.redraw(); return; }
    path = way(from);
    started = performance.now();
    const step = () => { env.redraw(); if (path) requestAnimationFrame(step); };
    step();
  };
  // A rotation under way: the shapes are the map `base` turned by `angle(t)`, which reaches `total` at t = 1.
  let spin: { base: Affine; total: number; angle: (t: number) => number } | null = null;
  if (turn) {
    const c = (p.rotate_center as Pt | undefined) ?? [0, 0];
    const degrees = Math.abs(p.rotate as number);
    addButton(env, `Rotate ${degrees}° ${turn > 0 ? "counterclockwise" : "clockwise"}`, () => {
      // During a rotation, the turn is added to it: the shapes keep turning from where they are now to the end of
      // both turns. Otherwise, they turn from where they are headed.
      const t = path && spin ? Math.min(1, (performance.now() - started) / DURATION) : 1;
      const now = spin && path ? spin.angle(t * t * (3 - 2 * t)) : 0;
      const base = spin && path ? spin.base : to;
      const total = (spin && path ? spin.total : 0) + turn;
      const next = composeAffine(rotationAbout(c, total), base);
      animateTo(next, () => u => composeAffine(rotationAbout(c, now + (total - now) * u), base));
      spin = { base, total, angle: u => now + (total - now) * u };
    });
  }
  if (turn || mirrors.length) {
    addButton(env, "Reset", () => animateTo(IDENTITY, from => t => lerpAffine(from, IDENTITY, t)));
  }
  if (mirrors.length) {
    // The line within a few pixels of the pointer, if any.
    const near = (e: PointerEvent): ShapeSpec | null => {
      const r = env.canvas.getBoundingClientRect();
      const q = env.scene.unproject2D(e.clientX - r.left, e.clientY - r.top);
      const best = mirrors.map(sh => ({ sh, d: distanceToLine(q, sh.line![0], sh.line![1]) * env.scene.pxPerUnit }))
        .reduce((a, b) => (b.d < a.d ? b : a));
      return best.d <= 10 ? best.sh : null;
    };
    env.canvas.addEventListener("pointermove", e => {
      const h = near(e);
      env.canvas.style.cursor = h ? "pointer" : "";
      if (h !== hovered) { hovered = h; env.redraw(); }
    });
    env.canvas.addEventListener("pointerleave", () => { if (hovered) { hovered = null; env.redraw(); } });
    env.canvas.addEventListener("pointerdown", e => {
      const mirror = near(e);
      if (!mirror) return;
      const next = composeAffine(reflectionAcross(mirror.line![0], mirror.line![1]), to);
      animateTo(next, from => t => lerpAffine(from, next, t));
    });
  }
  // The vector field, if any.
  let field: ((q: Pt) => Pt) | null = null;
  if (Array.isArray(p.field)) {
    try {
      const vars = (p.vars as string[] | undefined) ?? ["x", "y"];
      const [f, g] = (p.field as string[]).map(src => parseFormulaIn(src, vars)) as [FnN, FnN];
      field = q => [f(q), g(q)];
    } catch (e) {
      console.warn(`Plane figure: ${(e as Error).message}`);
    }
  }
  // Curves and trajectories, computed once.
  const curvePoints = new Map<ShapeSpec, Pt[]>();
  for (const sh of shapes) {
    if (sh.trajectory && field) {
      const bound = 20 * Math.max(...xRange.map(Math.abs), ...yRange.map(Math.abs));
      curvePoints.set(sh, integrate(field, sh.trajectory, typeof sh.t === "number" ? sh.t : 10, 0.01, bound));
    }
    if (!sh.curve) continue;
    try {
      const fx = parseFormula(sh.curve[0], "t"), fy = parseFormula(sh.curve[1], "t");
      const [a, b] = (Array.isArray(sh.t) ? sh.t : [0, 1]).map(constantValue);
      const n = sh.samples ?? 600;
      curvePoints.set(sh, Array.from({ length: n + 1 }, (_, i): Pt => { const t = a + ((b - a) * i) / n; return [fx(t), fy(t)]; })
        .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y)));
    } catch (e) {
      console.warn(`Plane figure: ${(e as Error).message}`);
    }
  }

  return () => {
    const s = env.scene, ctx = () => s.ctx;
    const rect = env.canvas.getBoundingClientRect();
    const extent = fitExtent(xRange, yRange, rect.width || 1, rect.height || 1);
    const center: Pt = [(xRange[0] + xRange[1]) / 2, (yRange[0] + yRange[1]) / 2];
    s.begin(env.canvas, { dim: 2, yaw: 0, pitch: 0, perspective: false, center: [center[0], center[1], 0], extent });
    // With every tick labeled, so that coordinates can be read off.
    if (p.grid !== false && !numberLine) s.gridAndAxes(SPAN_GRID, true);
    if (numberLine) drawNumberLine();
    const box: Pt[] = [[s.lo[0], s.lo[1]], [s.hi[0], s.lo[1]], [s.hi[0], s.hi[1]], [s.lo[0], s.hi[1]]];
    const far = 4 * (s.hi[0] - s.lo[0] + s.hi[1] - s.lo[1]);

    if (field) drawField(field);

    const placed = moving();
    for (const sh of shapes) {
      const color = PLOT_COLORS[(sh.color ?? 0) % PLOT_COLORS.length];
      const fill = translucent(color, 0.2);
      const m = sh.map;
      // The shape's own map, then the reflections so far (the lines themselves stay put).
      const map = (q: Pt) => (sh.line ? applyMap(m, q) : applyAffine(placed, applyMap(m, q)));
      const dash = sh.dash ? DASH : [];
      let at: Pt | null = sh.label_at ?? null;
      let anchors: [number, number, number, number][] | null = null;
      const label: PlotLabel | null = !sh.label ? null : sh.words ? sh.label : { text: sh.label, tex: sh.label };

      if (sh.disk || sh.circle) {
        const [cx, cy, r] = (sh.disk ?? sh.circle)!;
        const outer = circlePoints([cx, cy], r, 180).map(map);
        if (sh.disk) {
          const c = ctx();
          c.beginPath();
          trace(outer);
          const inner = sh.hole ? circlePoints([cx, cy], sh.hole, 180).map(map).reverse() : null;
          if (inner) trace(inner);
          c.fillStyle = fill;
          c.fill("evenodd");
          s.path(outer.map(v3), color, 2, sh.open ? DASH : [], true);
          if (inner) s.path(inner.map(v3), color, 2, sh.open ? DASH : [], true);
        } else s.path(outer.map(v3), color, 2.25, dash, true);
        if (!at) at = map([cx + r * Math.SQRT1_2, cy + r * Math.SQRT1_2]);
      } else if (sh.polygon) {
        const pts = sh.polygon.map(map);
        if (sh.edges) {
          s.polygon(pts.map(v3), SPAN_COLOR);
          pts.forEach((a, i) => {
            const c = PLOT_COLORS[(sh.edges![i % sh.edges!.length] ?? 0) % PLOT_COLORS.length];
            s.line(v3(a), v3(pts[(i + 1) % pts.length]), c, 5);
          });
        } else if (sh.fill === false) s.path(pts.map(v3), color, 2.25, dash, true);
        else s.region(pts.map(v3), fill, color, sh.open === true, 2);
        if (!at) at = pts.reduce((a, b) => (b[0] + b[1] > a[0] + a[1] ? b : a));
      } else if (sh.curve) {
        const pts = (curvePoints.get(sh) ?? []).map(map);
        if (pts.length > 1) s.path(pts.map(v3), color, 2.25, dash, sh.closed === true);
        if (!at && pts.length) at = pts[Math.floor(pts.length * 0.8)];
      } else if (sh.trajectory) {
        const pts = (curvePoints.get(sh) ?? []).map(map);
        if (pts.length > 1) {
          s.path(pts.map(v3), color, 2.5, dash);
          drawDot(pts[0], color, false);
          // An arrowhead partway along, in the direction of motion.
          const k = Math.min(pts.length - 2, Math.floor(pts.length * 0.3));
          arrowhead(pts[k], pts[k + 1], color, 11);
        }
        if (!at && pts.length) at = pts[0];
      } else if (sh.segment) {
        const [a, b] = sh.segment.map(map);
        s.line(v3(a), v3(b), color, 2.5, dash);
        if (label && !sh.label_at) { s.segmentLabel(v3(a), v3(b), label, color, false); continue; }
      } else if (sh.line) {
        const [q, d] = sh.line;
        const a = map([q[0] - far * d[0], q[1] - far * d[1]]), b = map([q[0] + far * d[0], q[1] + far * d[1]]);
        // A line that can be clicked is drawn thicker under the pointer.
        s.line(v3(a), v3(b), color, sh === hovered ? 4 : 2.25, dash);
        // Labels (such as of a corner that the line passes through) keep off the line.
        const [ax, ay] = s.project(v3(a)), [bx, by] = s.project(v3(b));
        s.avoidSegment(ax, ay, bx, by);
        if (!at) at = map([q[0] + d[0], q[1] + d[1]]);
      } else if (sh.halfplane) {
        const [a, n] = sh.halfplane;
        const region = clipHalfPlane(box, a, n);
        if (region.length > 2) {
          s.polygon(region.map(v3), fill);
          const d: Pt = [-n[1], n[0]];
          s.line(v3([a[0] - far * d[0], a[1] - far * d[1]]), v3([a[0] + far * d[0], a[1] + far * d[1]]), color, 2, sh.open ? DASH : []);
        }
      } else if (sh.vector) {
        const v = sh.vector as unknown[];
        const [from, to] = (Array.isArray(v[0]) ? (v as [Pt, Pt]) : [[0, 0], v as Pt] as [Pt, Pt]).map(map);
        s.arrow(v3(from), v3(to), color, 2.5, sh.label_at ? undefined : label ?? undefined);
        if (!sh.label_at) continue;
      } else if (sh.point) {
        const q = map(sh.point);
        drawDot(q, color, sh.open === true);
        if (!at) {
          at = q;
          // Its label outside, away from the middle of the view (such as outside the corner of a polygon).
          const [px, py] = s.project(v3(q)), [mx, my] = s.project(v3(center));
          const out = [px - mx, py - my], len = Math.hypot(out[0], out[1]) || 1;
          anchors = anchorsAround(px, py).sort((u, v) => (v[2] * out[0] + v[3] * out[1] - u[2] * out[0] - u[3] * out[1]) / len);
        }
      } else if (sh.interval) {
        const [a, b] = sh.interval, h = sh.height ?? 0;
        s.line(v3([a, h]), v3([b, h]), color, 5);
        const ends = sh.ends ?? "[]";
        if (ends[0] && ends[0] !== " ") drawDot([a, h], color, ends[0] === "(");
        const last = ends[ends.length - 1];
        if (last && last !== " ") drawDot([b, h], color, last === ")");
        if (!at) {
          at = [(a + b) / 2, h];
          const [px, py] = s.project(v3(at));
          anchors = [[px, py, 0, -1], [px, py, 0.6, -0.8], [px, py, -0.6, -0.8]];
        }
      }
      if (label && at) {
        const [px, py] = s.project(v3(at));
        // Clear of a point's dot (of radius DOT), not just of its center.
        const font = sh.words ? `${s.px(15)}px system-ui, sans-serif` : labelFont(s);
        s.labelAway(label, anchors ?? anchorsAround(px, py), color, font, sh.point && !sh.label_at ? DOT + 4 : 6);
      }
    }
    s.finish();
    env.readout.innerHTML = "";

    function trace(pts: Pt[]): void {
      const c = ctx();
      pts.forEach((q, i) => {
        const [x, y] = s.project(v3(q));
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
      });
      c.closePath();
    }

    function drawDot(q: Pt, color: string, hollow: boolean): void {
      const c = ctx();
      const [x, y] = s.project(v3(q));
      c.beginPath();
      c.arc(x, y, DOT, 0, 2 * Math.PI);
      c.fillStyle = hollow ? "#fff" : color;
      c.fill();
      if (hollow) {
        c.strokeStyle = color;
        c.lineWidth = 2;
        c.stroke();
      }
    }

    function arrowhead(from: Pt, to: Pt, color: string, size: number): void {
      const c = ctx();
      const [ax, ay] = s.project(v3(from)), [bx, by] = s.project(v3(to));
      const len = Math.hypot(bx - ax, by - ay);
      if (len < 1e-6) return;
      const ux = (bx - ax) / len, uy = (by - ay) / len;
      c.fillStyle = color;
      c.beginPath();
      c.moveTo(bx + ux * size * 0.5, by + uy * size * 0.5);
      c.lineTo(bx - ux * size * 0.5 - uy * size * 0.45, by - uy * size * 0.5 + ux * size * 0.45);
      c.lineTo(bx - ux * size * 0.5 + uy * size * 0.45, by - uy * size * 0.5 - ux * size * 0.45);
      c.closePath();
      c.fill();
    }

    /** Short arrows of one length on a grid, pointing along the field. */
    function drawField(f: (q: Pt) => Pt): void {
      const c = ctx();
      const spacing = Math.max(26, Math.min(s.width, s.height) / 14);
      const len = spacing * 0.42;
      c.strokeStyle = "rgba(95, 99, 104, 0.55)";
      c.fillStyle = "rgba(95, 99, 104, 0.55)";
      c.lineWidth = 1.2;
      for (let px = spacing / 2; px < s.width; px += spacing) {
        for (let py = spacing / 2; py < s.height; py += spacing) {
          const [u, w] = f(s.unproject2D(px, py));
          const norm = Math.hypot(u, w);
          if (!Number.isFinite(norm)) continue;
          if (norm < 1e-9) { c.beginPath(); c.arc(px, py, 1.5, 0, 2 * Math.PI); c.fill(); continue; }
          // Screen y points down.
          const ux = u / norm, uy = -w / norm;
          const x0 = px - ux * len / 2, y0 = py - uy * len / 2, x1 = px + ux * len / 2, y1 = py + uy * len / 2;
          c.beginPath();
          c.moveTo(x0, y0);
          c.lineTo(x1, y1);
          c.stroke();
          c.beginPath();
          c.moveTo(x1, y1);
          c.lineTo(x1 - ux * 5 - uy * 3, y1 - uy * 5 + ux * 3);
          c.lineTo(x1 - ux * 5 + uy * 3, y1 - uy * 5 - ux * 3);
          c.closePath();
          c.fill();
        }
      }
    }

    function drawNumberLine(): void {
      const c = ctx();
      s.line([s.lo[0], 0, 0], [s.hi[0], 0, 0], AXIS_COLOR, 1.5);
      const values = (p.ticks as number[] | undefined) ?? ticks(xRange[0], xRange[1], gridStep((xRange[1] - xRange[0]) / 2));
      const font = `${s.px(13)}px system-ui, sans-serif`;
      for (const t of values) {
        const [x, y] = s.project([t, 0, 0]);
        c.strokeStyle = AXIS_COLOR;
        c.lineWidth = 1.5;
        c.beginPath();
        c.moveTo(x, y - 6);
        c.lineTo(x, y + 6);
        c.stroke();
        c.textBaseline = "middle";
        s.haloText(tickLabel(t), x, y + s.px(13) * 1.4, AXIS_COLOR, font);
        c.textBaseline = "alphabetic";
      }
    }
  };
};
