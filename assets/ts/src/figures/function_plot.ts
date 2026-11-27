// ╭───────────────────────────────────────────────────────────────╮
// │            Plots of functions given by formulas                 │
// ╰───────────────────────────────────────────────────────────────╯
// The graphs of one or more functions of one variable, each given by a formula in the front matter
// (see ./expression.ts), with dots for endpoints and single values. For example, the step function:
//
//   params:
//     x: [-2, 2]                  # the x-range shown
//     y: [-0.5, 1.5]              # the y-range shown (default: fit to the graphs)
//     var: x                      # the variable's name in the formulas and on the axis (default x)
//     y_var: y                    # the name (TeX) on the vertical axis (default y)
//     curves:
//       - { f: "0", to: 0, ends: "  )", label: f }
//       - { f: "1", from: 0, ends: "[ ", same: true }
//     points:
//       - { at: [0, 1] }          # a filled dot; `open: true` for a hollow one
//     segments:
//       - { from: [0, -1], to: [0, 1], color: 1 }   # a segment, such as a vertical one; `dash: true` dashes it
//
// A curve is drawn from `from` to `to` (default: the edges of the plot). `ends` marks its ends: "["
// or "]" is a filled dot (the end is in the domain), "(" or ")" a hollow one, and a space nothing.
// Curves get the colors in order; `same: true` keeps the previous curve's color (for the pieces of
// one function), and `color` picks one by number. `label` (TeX) names the curve beside its graph,
// at `label_at` (default: near the right end of what is in view), and `dash: true` dashes it.
// `discrete: true` draws a sequence instead: a dot at each integer from `from` to `to`, such as
// `{ f: "1/n", from: 1, to: 12, discrete: true }` with `var: n`. The pointer over a term shows its value.
//
// `key` (TeX) on a curve or a segment names it in a key in a corner of the figure. Pointing at a part, in the plot or in
// the key, highlights it in both, such as the two parts of the topologist's sine curve.
//
// `equal: true` gives both axes the same scale (widening the shorter range), so that slopes and shapes are true, such
// as the line y = x at 45° and the graphs of a function and its inverse as mirror images across it. A figure `aspect`
// near the ratio of the ranges keeps the widening small.
//
// `zoom: { at: "sqrt(2)", factor: 10, steps: 6 }` adds buttons that stretch the y-axis by `factor` (default 10)
// about the height `at` (a number or a formula), up to `steps` times (default 6), to tell apart values too close
// to see apart, such as the terms of a sequence near its limit.

import { OKABE_ITO } from "../common/scene3d";
import { Fn, parseFormula } from "./expression";
import { distanceToPolyline } from "./geometry";
import { Plot2D, canvasRect, equalRanges, stepFor } from "./plot2d";
import { HoverTips, Widget, addButton, hoverKey, markKey, showKey, texHTML, texNumber } from "./widget";

interface CurveSpec {
  f: string; from?: number; to?: number; ends?: string; label?: string; label_at?: number;
  same?: boolean; color?: number; dash?: boolean; samples?: number; discrete?: boolean; key?: string;
}
interface PointSpec { at: [number, number]; open?: boolean; color?: number }
interface SegmentSpec { from: [number, number]; to: [number, number]; color?: number; dash?: boolean; key?: string }

// The last, a neutral gray (number 6), is for guides, such as lines of symmetry, that should not compete with the shapes.
export const PLOT_COLORS = [OKABE_ITO.blue, OKABE_ITO.vermillion, OKABE_ITO.bluishGreen, OKABE_ITO.reddishPurple, OKABE_ITO.orange, OKABE_ITO.skyBlue, "#5f6368"];

/**
 * Samples f on [a, b] and splits the samples into runs that can be joined by lines: a run ends at a
 * value that isn't a finite number, or at a jump (such as at an asymptote) of more than `jump`.
 */
export function sampleRuns(f: Fn, a: number, b: number, n: number, jump: number): [number, number][][] {
  const runs: [number, number][][] = [];
  let run: [number, number][] = [];
  let prev: number | null = null;
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n;
    const y = f(x);
    if (!Number.isFinite(y) || (prev !== null && Math.abs(y - prev) > jump)) {
      if (run.length > 1) runs.push(run);
      run = [];
    }
    if (Number.isFinite(y)) run.push([x, y]);
    prev = Number.isFinite(y) ? y : null;
  }
  if (run.length > 1) runs.push(run);
  return runs;
}

/** A y-range that shows the finite values, with a margin, and the x-axis if it is nearby. */
export function fitRange(values: number[]): [number, number] {
  const ys = values.filter(Number.isFinite).sort((p, q) => p - q);
  if (ys.length === 0) return [-1, 1];
  // Ignore the most extreme 1% at each end, so that a value near an asymptote doesn't flatten the rest.
  const cut = Math.floor(ys.length * 0.01);
  let lo = ys[cut], hi = ys[ys.length - 1 - cut];
  if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
  const span = hi - lo;
  if (lo > 0 && lo < span * 0.6) lo = 0;
  if (hi < 0 && -hi < span * 0.6) hi = 0;
  const pad = 0.1 * (hi - lo);
  return [lo - pad, hi + pad];
}

/** The range [y0, y1] stretched by the factor `scale` about the height `at`, which keeps its place in the range. */
export function zoomRange([y0, y1]: [number, number], at: number, scale: number): [number, number] {
  return [at - (at - y0) / scale, at + (y1 - at) / scale];
}

/** A term of a sequence for a tip, with up to 10 significant digits (enough for 1.4142135, but not its rounding error). */
export const termText = (y: number) => texNumber(String(Number(y.toPrecision(10))));

/**
 * The TeX name of the term with index n, such as a_{3} for the name a_n with the variable n, or, for a name without
 * the variable as its subscript, the name with the index beside it, such as "y \text{ at } n = 3".
 */
export function termName(name: string, v: string, n: number): string {
  for (const sub of [`_${v}`, `_{${v}}`]) {
    if (name.endsWith(sub)) return `${name.slice(0, -sub.length)}_{${n}}`;
  }
  return `${name} \\text{ at } ${v} = ${n}`;
}

/** The id of the part (in `lines`, polylines on the canvas) within `radius` of the point, the nearest if several are. */
export function nearestPart(parts: { id: string; lines: [number, number][][] }[], at: [number, number], radius: number): string | null {
  let best: string | null = null, bestD = radius;
  for (const part of parts) {
    for (const line of part.lines) {
      const d = distanceToPolyline(at, line);
      if (d <= bestD) { bestD = d; best = part.id; }
    }
  }
  return best;
}

/** The integers from a to b (at most 1000 of them). */
export function integersIn(a: number, b: number): number[] {
  const out: number[] = [];
  for (let n = Math.ceil(a); n <= b && out.length < 1000; n++) out.push(n);
  return out;
}

export const functionPlot: Widget = env => {
  const p = env.params;
  const v = String(p.var ?? "x");
  const yName = String(p.y_var ?? "y");
  const xAsked = (p.x as [number, number] | undefined) ?? [-3, 3];
  const specs = (p.curves as CurveSpec[] | undefined) ?? [];
  const points = (p.points as PointSpec[] | undefined) ?? [];
  const segments = (p.segments as SegmentSpec[] | undefined) ?? [];
  const curves = specs.map(c => {
    try {
      return { spec: c, f: parseFormula(c.f, v) };
    } catch (e) {
      console.warn(`Function plot: ${(e as Error).message}`);
      return { spec: c, f: (() => NaN) as Fn };
    }
  });
  // Each curve's color: the next color, the previous curve's (`same`), or the one asked for.
  let next = -1;
  const colors = curves.map(({ spec }) => {
    if (spec.color !== undefined) { next = spec.color; return PLOT_COLORS[spec.color % PLOT_COLORS.length]; }
    if (!spec.same || next < 0) next++;
    return PLOT_COLORS[next % PLOT_COLORS.length];
  });
  // The part of a curve's domain within the x-range xr.
  const domain = (c: CurveSpec, xr: [number, number]): [number, number] =>
    [Math.max(xr[0], c.from ?? -Infinity), Math.min(xr[1], c.to ?? Infinity)];
  const fullRange = (p.y as [number, number] | undefined) ?? fitRange([
    ...curves.flatMap(({ spec, f }) => {
      const [a, b] = domain(spec, xAsked);
      if (spec.discrete) return integersIn(a, b).map(f);
      return Array.from({ length: 401 }, (_, i) => f(a + ((b - a) * i) / 400));
    }),
    ...points.map(pt => pt.at[1]),
  ]);

  // Zooming in on the y-axis: the number of times stretched by the zoom factor (`level`), and the level shown, which
  // moves to `level` gradually.
  const zoom = p.zoom as { at: number | string; factor?: number; steps?: number } | undefined;
  const factor = zoom?.factor ?? 10, steps = zoom?.steps ?? 6;
  let at = 0, level = 0, shown = 0;
  if (zoom) {
    try {
      at = typeof zoom.at === "number" ? zoom.at : parseFormula(String(zoom.at), v)(0);
    } catch (e) {
      console.warn(`Function plot: ${(e as Error).message}`);
    }
    const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    let from = 0, started = 0;
    const DURATION = 450;
    const zoomTo = (next: number) => {
      level = Math.max(0, Math.min(steps, next));
      zoomIn.disabled = level === steps;
      zoomOut.disabled = level === 0;
      if (reduce) { shown = level; env.redraw(); return; }
      from = shown;
      started = performance.now();
      const step = () => {
        const t = Math.min(1, (performance.now() - started) / DURATION);
        shown = from + (level - from) * t * t * (3 - 2 * t);
        env.redraw();
        if (t < 1) requestAnimationFrame(step);
      };
      step();
    };
    const zoomIn = addButton(env, `Zoom in ×${factor}`, () => zoomTo(level + 1));
    const zoomOut = addButton(env, "Zoom out", () => zoomTo(level - 1));
    zoomOut.disabled = true;
  }
  const tips = curves.some(c => c.spec.discrete) ? new HoverTips(env) : null;

  // The parts named in the key (curves and segments with a `key`), where each was drawn on the canvas in the last
  // frame, and the one the reader points at, in the plot or in the key.
  const parts = [
    ...curves.flatMap(({ spec }, i) => (spec.key ? [{ id: `curve-${i}`, key: spec.key, color: colors[i], dash: spec.dash === true }] : [])),
    ...segments.flatMap((sg, i) => (sg.key ? [{ id: `segment-${i}`, key: sg.key, color: PLOT_COLORS[(sg.color ?? 0) % PLOT_COLORS.length], dash: sg.dash === true }] : [])),
  ];
  const drawn = new Map<string, [number, number][][]>();
  let hovered: string | null = null;
  const hover = (id: string | null) => { if (id !== hovered) { hovered = id; env.redraw(); } };
  if (parts.length) {
    hoverKey(env, hover);
    const track = (e: PointerEvent) => {
      const r = env.canvas.getBoundingClientRect();
      hover(nearestPart(parts.map(pt => ({ id: pt.id, lines: drawn.get(pt.id) ?? [] })), [e.clientX - r.left, e.clientY - r.top], 8));
    };
    env.canvas.addEventListener("pointermove", track);
    env.canvas.addEventListener("pointerdown", track);
    env.canvas.addEventListener("pointerleave", () => hover(null));
  }

  return () => {
    const zoomed = zoom ? zoomRange(fullRange, at, Math.pow(factor, shown)) : fullRange;
    const s = env.scene;
    s.begin(env.canvas, { dim: 2, yaw: 0, pitch: 0, perspective: false, center: [0, 0, 0], extent: 1 });
    const rect = parts.length ? canvasRect(s, 4, env.key) : canvasRect(s);
    // The ranges shown: as asked for, or wider for equal scales.
    const [xRange, yRange] = p.equal === true ? equalRanges(xAsked, zoomed, rect.w, rect.h) : [xAsked, zoomed];
    const plot = new Plot2D(s, rect, xRange, yRange);
    // With equal scales, the same grid step on both axes, so that the grid is of squares.
    const step = p.equal === true ? stepFor(Math.max(xRange[1] - xRange[0], yRange[1] - yRange[0])) : undefined;
    plot.axes({ names: [{ text: v, tex: v }, { text: yName, tex: yName }], xStep: step, yStep: step });
    const jump = 2 * (yRange[1] - yRange[0]);
    // While a part of the key is pointed at, the other parts are faded, and it is drawn wider, over them.
    const ctx = plot.ctx;
    const faded = (id: string | undefined, draw: () => void) => {
      ctx.save();
      if (hovered && id !== hovered) ctx.globalAlpha = 0.3;
      draw();
      ctx.restore();
    };
    const pxLine = (line: [number, number][]) => line.map(([x, y]) => plot.px(x, y));
    drawn.clear();
    const drawCurve = (i: number) => {
      const { spec, f } = curves[i];
      const [a, b] = domain(spec, xRange);
      if (!(b > a) || spec.discrete) return;
      const id = spec.key ? `curve-${i}` : undefined;
      const runs = sampleRuns(f, a, b, spec.samples ?? 1500, jump);
      if (id) drawn.set(id, runs.map(pxLine));
      faded(id, () => { for (const run of runs) plot.path(run, colors[i], id === hovered ? 4 : 2.25, spec.dash ? [7, 5] : [], true); });
    };
    const drawSegment = (i: number) => {
      const sg = segments[i];
      const id = sg.key ? `segment-${i}` : undefined;
      if (id) drawn.set(id, [pxLine([sg.from, sg.to])]);
      faded(id, () => plot.segment(sg.from, sg.to, PLOT_COLORS[(sg.color ?? 0) % PLOT_COLORS.length], id === hovered ? 4.5 : 2.5, sg.dash ? [7, 5] : []));
    };
    plot.clipped(() => {
      curves.forEach((_, i) => { if (`curve-${i}` !== hovered) drawCurve(i); });
      segments.forEach((_, i) => { if (`segment-${i}` !== hovered) drawSegment(i); });
      if (hovered?.startsWith("curve-")) drawCurve(Number(hovered.slice(6)));
      if (hovered?.startsWith("segment-")) drawSegment(Number(hovered.slice(8)));
    });
    // The terms of sequences (with their values in tips), then dots at the ends of the curves and at single points,
    // over the curves.
    tips?.clear();
    curves.forEach(({ spec, f }, i) => {
      if (!spec.discrete) return;
      const [a, b] = domain(spec, xRange);
      for (const n of integersIn(a, b)) {
        const y = f(n);
        if (!Number.isFinite(y) || y < yRange[0] || y > yRange[1]) continue;
        plot.dot(n, y, 4, colors[i]);
        tips?.add(...plot.px(n, y), texHTML(env, `${termName(yName, v, n)} = ${termText(y)}`));
      }
    });
    tips?.update();
    curves.forEach(({ spec, f }, i) => {
      const ends = spec.ends ?? "";
      const at = [[spec.from, ends[0]], [spec.to, ends[ends.length - 1]]] as [number | undefined, string | undefined][];
      for (const [x, mark] of at) {
        if (x === undefined || !mark || mark === " " || x < xRange[0] || x > xRange[1]) continue;
        const y = f(x);
        if (Number.isFinite(y)) plot.dot(x, y, 4.5, colors[i], mark === "(" || mark === ")");
      }
    });
    for (const pt of points) plot.dot(pt.at[0], pt.at[1], 4.5, PLOT_COLORS[(pt.color ?? 0) % PLOT_COLORS.length], pt.open === true);
    // The names of the curves, beside their graphs.
    curves.forEach(({ spec, f }, i) => {
      if (!spec.label) return;
      const [a, b] = domain(spec, xRange);
      let x = spec.label_at;
      if (x === undefined) {
        // The rightmost place, in the right part of the curve's domain, where the graph is in view.
        for (let t = 0.9; t >= 0.1; t -= 0.05) {
          const cand = spec.discrete ? Math.round(a + t * (b - a)) : a + t * (b - a), y = f(cand);
          if (Number.isFinite(y) && y > yRange[0] + 0.08 * (yRange[1] - yRange[0]) && y < yRange[1] - 0.08 * (yRange[1] - yRange[0])) { x = cand; break; }
        }
      }
      if (x === undefined || !Number.isFinite(f(x))) return;
      const [px, py] = plot.px(x, f(x));
      const dirs: [number, number, number, number][] = [[px, py, -0.6, -0.8], [px, py, 0.6, 0.8], [px, py, 0.6, -0.8], [px, py, -0.6, 0.8]];
      plot.label({ text: spec.label, tex: spec.label }, x, f(x), colors[i], dirs, 6);
    });
    if (parts.length) {
      showKey(env, parts.map(pt => ({ symbol: pt.dash ? "╍" : "━", color: pt.color, label: texHTML(env, pt.key), id: pt.id })));
      markKey(env, hovered);
    }
    s.finish();
    env.readout.innerHTML = "";
  };
};
