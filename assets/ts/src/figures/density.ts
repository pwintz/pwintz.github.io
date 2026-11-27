// ╭───────────────────────────────────────────────────────────────╮
// │        Probabilities as areas under a probability density       │
// ╰───────────────────────────────────────────────────────────────╯
// The density f of the standard normal distribution, with the area under it shaded.
//
// Params (all optional):
//   mode: "interval" (default): the reader drags a and b, and the shaded area from a to b is
//           P(a ≤ X ≤ b).
//         "cumulative": the reader drags x, and the shaded area to the left of x is
//           F(x) = P(X ≤ x). A second plot below shows the graph of the cumulative distribution
//           function F, with its height at x. The value of F(x) labels both the shaded area (at its
//           center) and the point (x, F(x)).

import { OKABE_ITO } from "../common/scene3d";
import { areaCentroid, normalCdf, normalPdf } from "./functions";
import { ABOVE, AREA_FONT, CURVE, HANDLE, dragEndpoints, drawEndpoint } from "./integral";
import { Plot2D, Rect, canvasRect } from "./plot2d";
import { Widget, fixed, it, showCalc, steadyFixedTex, texColor } from "./widget";

const X_RANGE: [number, number] = [-3.6, 3.6];
const PDF_Y: [number, number] = [-0.05, 0.47];
const CDF_Y: [number, number] = [-0.12, 1.15];
const CDF_COLOR = OKABE_ITO.vermillion;

const AREA_COLOR = OKABE_ITO.blue;

/**
 * The center (centroid) of the region under the standard normal density f to the left of x:
 * its mean x-coordinate, ∫ t f(t) dt / F(x) = −f(x) / F(x), and its mean y-coordinate,
 * ∫ f(t)²/2 dt / F(x), where f(t)² = e^{−t²} / (2π) integrates to Φ(x√2) / (2√π).
 */
export function shadedCentroid(x: number): [number, number] {
  const F = normalCdf(x);
  return [-normalPdf(x) / F, normalCdf(x * Math.SQRT2) / (4 * Math.sqrt(Math.PI) * F)];
}

const P = (event: string) => `${it("P")}(${event})`;

/**
 * A probability with two decimals, or with more (up to four) where two would round it to 0.00 or 1.00, which would
 * read as an impossible or a certain event.
 */
export function probabilityText(p: number): string {
  let digits = 2;
  while (digits < 4 && p > 0 && p < 1 && (Number(fixed(p, digits)) === 0 || Number(fixed(p, digits)) === 1)) digits++;
  return fixed(p, digits);
}

export const density: Widget = env => {
  const cumulative = env.params.mode === "cumulative";
  const ends: Record<string, number> = cumulative ? { x: 0.5 } : { a: -1, b: 1 };
  // The plot that maps the x-coordinate (both plots share it) and that the pointer can grab in.
  let span = new Plot2D(env.scene, { x: 0, y: 0, w: 1, h: 1 }, X_RANGE, PDF_Y);
  dragEndpoints(env, () => span, ends, cumulative ? [] : ["a", "b"]);

  const graph = (plot: Plot2D, f: (x: number) => number, color: string) =>
    plot.path(Array.from({ length: 301 }, (_, i) => {
      const x = X_RANGE[0] + ((X_RANGE[1] - X_RANGE[0]) * i) / 300;
      return [x, f(x)];
    }), color, 2.25, [], true);

  return () => {
    const s = env.scene;
    s.begin(env.canvas, { dim: 2, yaw: 0, pitch: 0, perspective: false, center: [0, 0, 0], extent: 1 });
    const whole = canvasRect(s, 4, env.calc);
    // In the cumulative mode, the density is on top and F below it, with a gap for the tick labels.
    const gap = s.px(14);
    const top: Rect = cumulative ? { ...whole, h: (whole.h - gap) * 0.5 } : whole;
    const pdf = new Plot2D(s, top, X_RANGE, PDF_Y);
    span = new Plot2D(s, whole, X_RANGE, PDF_Y);
    // No tick labels where the labels of a and b (or x) go.
    pdf.axes({ yStep: 0.1, names: [{ text: "x", tex: "x" }, { text: "y", tex: "y" }], clearOf: cumulative ? [ends.x] : [ends.a, ends.b] });

    if (!cumulative) {
      const { a, b } = ends;
      pdf.clipped(() => {
        pdf.areaUnder(normalPdf, a, b, ABOVE.fill);
        graph(pdf, normalPdf, CURVE);
      });
      drawEndpoint(pdf, a, "a", normalPdf(a), HANDLE, true);
      drawEndpoint(pdf, b, "b", normalPdf(b), HANDLE, true);
      pdf.label({ text: "f", tex: "f" }, 1.9, normalPdf(1.9), CURVE);
      const p = normalCdf(b) - normalCdf(a);
      // The probability in the shaded region (where it is wide enough), in the same color as in the calculation.
      const [cx, cy] = areaCentroid(normalPdf, a, b);
      const [px, py] = pdf.px(cx, cy), [left] = pdf.px(a, 0), [right] = pdf.px(b, 0);
      s.ctx.font = s.font(AREA_FONT(s));
      if (right - left > s.ctx.measureText(probabilityText(p)).width + 6) {
        s.ctx.textBaseline = "middle";
        s.haloText(probabilityText(p), px, py, AREA_COLOR, AREA_FONT(s));
        s.ctx.textBaseline = "alphabetic";
      }
      s.finish();
      const [A, B] = [steadyFixedTex(a, ...X_RANGE), steadyFixedTex(b, ...X_RANGE)];
      showCalc(env, [`P(${A} \\le X \\le ${B}) = \\displaystyle\\int_{${A}}^{${B}} f(x) \\, \\dx = ${texColor(AREA_COLOR, probabilityText(p))}`]);
      env.readout.innerHTML = `The probability ${P(`${it("a")} ≤ ${it("X")} ≤ ${it("b")}`)} is the shaded area under the density ${it("f")}. ` +
        `The whole area under ${it("f")} is 1.`;
      return;
    }

    const { x } = ends;
    const Fx = normalCdf(x);
    const bottom: Rect = { ...whole, y: top.y + top.h + gap, h: whole.h - top.h - gap };
    const cdf = new Plot2D(s, bottom, X_RANGE, CDF_Y);
    cdf.axes({ yStep: 0.5, names: [{ text: "x", tex: "x" }, { text: "y", tex: "y" }], clearOf: [x] });
    pdf.clipped(() => {
      pdf.areaUnder(normalPdf, X_RANGE[0], x, ABOVE.fill);
      graph(pdf, normalPdf, CURVE);
    });
    cdf.clipped(() => {
      graph(cdf, normalCdf, CDF_COLOR);
      // The height of F at x, against the y-axis.
      cdf.segment([0, Fx], [x, Fx], CDF_COLOR, 1.25, [4, 3]);
    });
    // x, with its value, in both plots.
    drawEndpoint(pdf, x, "x", normalPdf(x), HANDLE, true);
    drawEndpoint(cdf, x, "x", Fx, HANDLE, true);
    cdf.dot(x, Fx, 5, CDF_COLOR);
    // The names of the graphs first, so that the value's label below avoids them.
    pdf.label({ text: "f", tex: "f" }, 2.1, normalPdf(2.1), CURVE);
    cdf.label({ text: "F", tex: "F" }, 2.6, normalCdf(2.6), CDF_COLOR, [[...cdf.px(2.6, normalCdf(2.6)), 0, -1] as [number, number, number, number]]);
    // F(x), as the shaded area (at its center) and as the height of the point (x, F(x)).
    const value = probabilityText(Fx);
    const font = AREA_FONT(s);
    const [cx, cy] = shadedCentroid(x);
    const [ax, ay] = pdf.px(Math.max(cx, X_RANGE[0] + 0.45), cy);
    s.ctx.textBaseline = "middle";
    s.haloText(value, ax, ay, AREA_COLOR, font);
    s.ctx.textBaseline = "alphabetic";
    const [px, py] = cdf.px(x, Fx);
    s.labelAway(value, [[px, py, -0.6, -0.8], [px, py, 0.6, 0.8], [px, py, -1, 0], [px, py, 1, 0]], AREA_COLOR, font, 6);
    s.finish();
    const X = steadyFixedTex(x, ...X_RANGE);
    showCalc(env, [`F(${X}) = P(X \\le ${X}) = ${texColor(AREA_COLOR, value)}`], "bottom-right");
    env.readout.innerHTML = `The value ${it("F")}(${it("x")}) is the shaded area under the density ${it("f")} to the left of ${it("x")}, ` +
      `and the height of the graph of ${it("F")} at ${it("x")}.`;
  };
};
