// ╭───────────────────────────────────────────────────────────────╮
// │          The integral as the area under a graph (and sums)       │
// ╰───────────────────────────────────────────────────────────────╯
// The graph of a function with the region between the graph and the x-axis shaded from a to b,
// blue above the axis and orange below it, where the area counts as negative. The reader drags
// a and b along the x-axis. With `riemann`, the figure draws the rectangles of a Riemann sum
// instead, with a slider for the number of subintervals and a menu for the sample points.
//
// Params (all optional):
//   fn:      a key of FUNCTIONS in ./functions.ts (default "half-plus-sine").
//   riemann: whether to draw a Riemann sum (default false).
//   a, b:    where the endpoints start (default: the function's own).

import { enableDrag } from "../common/drag_points";
import { OKABE_ITO, Scene } from "../common/scene3d";
import { FUNCTIONS, Tag, areaCentroid, integrate, riemannRects, riemannSum, signPieces } from "./functions";
import { Plot2D, canvasRect } from "./plot2d";
import { FigureEnv, Widget, addSelect, addSlider, fixed, it, HoverTips, showCalc, showKey, steadyFixedTex, steadyTex, texColor, texHTML, texNumber } from "./widget";

export const CURVE = OKABE_ITO.blue;
export const ABOVE = { fill: "rgba(0, 114, 178, 0.22)", stroke: "rgba(0, 114, 178, 0.75)", text: OKABE_ITO.blue };
export const BELOW = { fill: "rgba(213, 94, 0, 0.22)", stroke: "rgba(213, 94, 0, 0.8)", text: OKABE_ITO.vermillion };
export const HANDLE = "#333";

/** "∫ₐᵇ f(x) dx" in HTML, with the given limits. */
/** The font of the area written in a shaded region. */
export const AREA_FONT = (s: Scene) => `bold ${s.px(15)}px system-ui, sans-serif`;

// The ends x_k of a Riemann sum's subintervals, and its sample points t_k.
const ENDS = "#3b4252";
const SAMPLE = OKABE_ITO.reddishPurple;

export const integralHtml = (a: string, b: string, f = "f") =>
  `∫<sub>${a}</sub><sup>${b}</sup> ${it(f)}(${it("x")}) d${it("x")}`;

/**
 * Endpoints that the reader drags along the x-axis of a plot. Each stays in view, `order` keeps
 * them in order (a little apart), and an endpoint moves only to places that `allowed` accepts.
 */
export function dragEndpoints(
  env: FigureEnv, plot: () => Plot2D, ends: Record<string, number>, order: string[] = [],
  allowed: (x: number) => boolean = () => true,
): void {
  const keys = Object.keys(ends);
  enableDrag(env.canvas, {
    pick: (px, py) => {
      const p = plot();
      // Grab an endpoint anywhere on the vertical line through it.
      const r = p.rect;
      if (py < r.y || py > r.y + r.h + 8) return null;
      let best: string | null = null, bestD = 12;
      for (const k of keys) {
        const d = Math.abs(px - p.px(ends[k], 0)[0]);
        if (d < bestD) { bestD = d; best = k; }
      }
      return best;
    },
    move: (k, px) => {
      const p = plot();
      const [x0, x1] = p.xRange;
      const gap = (x1 - x0) / 60, margin = (x1 - x0) / 80;
      let x = Math.min(x1 - margin, Math.max(x0 + margin, p.fromPx(px, 0)[0]));
      const i = order.indexOf(k);
      if (i > 0) x = Math.max(x, ends[order[i - 1]] + gap);
      if (i >= 0 && i < order.length - 1) x = Math.min(x, ends[order[i + 1]] - gap);
      if (!allowed(x)) return;
      ends[k] = x;
      env.redraw();
    },
  });
}

/**
 * Draws an endpoint on the x-axis: a dot with its name below it (with its value, as in "a = 0.50", if `withValue`),
 * and a dashed line up to the graph.
 */
export function drawEndpoint(p: Plot2D, x: number, name: string, height: number, color = HANDLE, withValue = false): void {
  p.segment([x, 0], [x, height], color, 1.25, [4, 3]);
  p.dot(x, 0, 5, color);
  const [px, py] = p.px(x, 0);
  // Below the axis, or above it where the graph is below.
  const dirs: [number, number, number, number][] = height >= 0 ? [[px, py, 0, 1], [px, py, 0, -1]] : [[px, py, 0, -1], [px, py, 0, 1]];
  const label = withValue ? { text: `${name} = ${fixed(x)}`, tex: `${name} = ${texNumber(fixed(x))}` } : { text: name, tex: name };
  p.label(label, x, 0, color, dirs, 7);
}

export const integral: Widget = env => {
  const named = FUNCTIONS[String(env.params.fn ?? "half-plus-sine")] ?? FUNCTIONS["half-plus-sine"];
  const { f } = named;
  const ends = { a: Number(env.params.a ?? named.a), b: Number(env.params.b ?? named.b) };
  const riemann = env.params.riemann === true;
  let n = 4;
  let tag: Tag = "midpoint";
  if (riemann) {
    addSlider(env, `Subintervals ${it("n")}`, { min: 1, max: 40, step: 1, value: n }, v => { n = v; });
    addSelect<Tag>(env, "Sample points", [["left", "Left endpoints"], ["midpoint", "Midpoints"], ["right", "Right endpoints"]], tag, v => { tag = v; });
  }

  let plot = new Plot2D(env.scene, { x: 0, y: 0, w: 1, h: 1 }, named.x, named.y);
  const tips = new HoverTips(env);
  dragEndpoints(env, () => plot, ends, ["a", "b"]);

  return () => {
    const s = env.scene;
    s.begin(env.canvas, { dim: 2, yaw: 0, pitch: 0, perspective: false, center: [0, 0, 0], extent: 1 });
    plot = new Plot2D(s, canvasRect(s, 4, env.calc, env.key), named.x, named.y);
    const { a, b } = ends;
    // No tick labels where the labels of a and b go.
    plot.axes({ names: [{ text: "x", tex: "x" }, { text: "y", tex: "y" }], clearOf: [a, b] });

    const rects = riemann ? riemannRects(f, a, b, n, tag) : [];
    plot.clipped(() => {
      if (riemann) {
        for (const r of rects) {
          const c = r.height >= 0 ? ABOVE : BELOW;
          plot.polygon([[r.x0, 0], [r.x0, r.height], [r.x1, r.height], [r.x1, 0]], c.fill, c.stroke, 1);
        }
      } else {
        for (const piece of signPieces(f, a, b)) plot.areaUnder(f, piece.x0, piece.x1, piece.sign > 0 ? ABOVE.fill : BELOW.fill);
      }
      plot.path(Array.from({ length: 401 }, (_, i) => {
        const x = named.x[0] + ((named.x[1] - named.x[0]) * i) / 400;
        return [x, f(x)];
      }), CURVE, 2.25, [], true);
    });
    if (riemann) {
      // The ends x_k of the subintervals on the x-axis, and the sample points t_k on it and on the graph, smaller on
      // top (a sample point can be an end).
      const radius = n > 20 ? 2.25 : 3.5;
      const ends = [...rects.map(r => r.x0), b];
      ends.forEach(x => plot.dot(x, 0, radius, ENDS));
      for (const r of rects) {
        plot.dot(r.t, 0, radius * 0.75, SAMPLE);
        plot.dot(r.t, r.height, radius * 0.75, SAMPLE);
      }
      // What each dot is, while the pointer is over it. (The sample points first, so that one that is also an end
      // shows as a sample point.)
      tips.clear();
      rects.forEach((r, i) => {
        const k = i + 1;
        tips.add(...plot.px(r.t, 0), texHTML(env, `t_{${k}} = ${texNumber(fixed(r.t))}`));
        tips.add(...plot.px(r.t, r.height), texHTML(env, `(t_{${k}}, f(t_{${k}})) = (${texNumber(fixed(r.t))}, ${texNumber(fixed(r.height))})`));
      });
      ends.forEach((x, k) => tips.add(...plot.px(x, 0), texHTML(env, `x_{${k}} = ${texNumber(fixed(x))}`)));
      tips.update();
    }
    drawEndpoint(plot, a, "a", f(a), HANDLE, true);
    drawEndpoint(plot, b, "b", f(b), HANDLE, true);
    // The graph's name, near its right end.
    const xl = named.x[0] + 0.93 * (named.x[1] - named.x[0]);
    plot.label({ text: "f", tex: "f" }, xl, f(xl), CURVE);
    s.finish();

    const value = integrate(f, a, b);
    // The widest that the limits and the areas can be, so that the numbers keep their widths (see steady).
    const width = named.x[1] - named.x[0];
    const limit = (v: number) => steadyFixedTex(v, ...named.x);
    // An area at the end of a line needs no room.
    const area = (v: number) => texNumber(fixed(v));
    const integralLine = (rest: string) => `\\displaystyle\\int_{${limit(a)}}^{${limit(b)}} f(x) \\, \\dx = ${rest}`;
    if (riemann) {
      const where = { left: "left endpoints", midpoint: "midpoints", right: "right endpoints" }[tag];
      // Side by side, with three decimals, to compare them.
      showCalc(env, [
        `\\displaystyle\\sum_{k=1}^{${steadyTex(String(n), "40")}} f(t_k) \\, \\Delta x = ${steadyFixedTex(riemannSum(rects), -9, 9, 3)}, ` +
        `\\qquad ${integralLine(texNumber(fixed(value, 3)))}`,
      ]);
      showKey(env, [
        { symbol: "●", color: ENDS, label: `${texHTML(env, "x_k")}: ends of the subintervals` },
        { symbol: "●", color: SAMPLE, label: `${texHTML(env, "t_k")}: sample points (${where})` },
      ], "bottom-right");
      env.readout.innerHTML = `The Riemann sum adds the signed areas of ${it("n")} = ${n} rectangles from ${it("a")} to ${it("b")}, ` +
        `each of width Δ${it("x")} = (${it("b")} − ${it("a")})/${it("n")} = ${fixed((b - a) / n)} and of height ${it("f")}(${it("t")}<sub>${it("k")}</sub>) at its sample point ${it("t")}<sub>${it("k")}</sub>. ` +
        `As ${it("n")} grows, it approaches the integral.`;
      return;
    }
    // Each shaded piece's area, in the piece and in the calculation, in the piece's color, so that the two match.
    const areas = signPieces(f, a, b)
      .map(p => ({ ...p, area: Math.abs(integrate(f, p.x0, p.x1, 200)) }))
      .filter(p => fixed(p.area) !== "0.00");
    for (const p of areas) {
      const [cx, cy] = areaCentroid(f, p.x0, p.x1);
      const text = fixed(p.area);
      const [px, py] = plot.px(cx, cy);
      // Only where the piece is wide enough on the screen for its number.
      const [left] = plot.px(p.x0, 0), [right] = plot.px(p.x1, 0);
      s.ctx.font = s.font(AREA_FONT(s));
      if (right - left < s.ctx.measureText(text).width + 6) continue;
      s.ctx.textBaseline = "middle";
      s.haloText(text, px, py, (p.sign > 0 ? ABOVE : BELOW).text, AREA_FONT(s));
      s.ctx.textBaseline = "alphabetic";
    }
    const terms = areas.map((p, i) => `${p.sign < 0 ? "-" : i > 0 ? "+" : ""} ${texColor((p.sign > 0 ? ABOVE : BELOW).text, texNumber(fixed(p.area)))}`);
    if (areas.length <= 1) {
      showCalc(env, [integralLine(areas.length === 1 ? terms[0] : area(value))]);
      env.readout.innerHTML = areas.some(p => p.sign < 0)
        ? `The area below the ${it("x")}-axis counts as negative.`
        // The calculation is in the box over the canvas, so there is nothing more to say below it.
        : "";
    } else {
      showCalc(env, [integralLine(`${terms.join(" ")} = ${area(value)}`)]);
      env.readout.innerHTML = `The area above the ${it("x")}-axis counts as positive, and the area below it counts as negative.`;
    }
  };
};
