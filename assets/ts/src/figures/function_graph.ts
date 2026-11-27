// ╭───────────────────────────────────────────────────────────────╮
// │            The graph of a function, point by point             │
// ╰───────────────────────────────────────────────────────────────╯
// The graph of a function on coordinate axes. The reader drags an input x along the x-axis, and
// the figure marks the point (x, f(x)) of the graph, with dashed lines to both axes.
//
// Params (all optional):
//   fn:       a key of FUNCTIONS in ./functions.ts (default "square").
//   equation: whether to name the graph by its equation, "y = x²" (default false: name it f).

import { FUNCTIONS, texAt } from "./functions";
import { CURVE, HANDLE, dragEndpoints } from "./integral";
import { Plot2D, canvasRect } from "./plot2d";
import { Widget, anchorsAround, fixed, showCalc, steadyFixedTex, texNumber } from "./widget";

export const functionGraph: Widget = env => {
  const named = FUNCTIONS[String(env.params.fn ?? "square")] ?? FUNCTIONS["square"];
  const { f } = named;
  const equation = env.params.equation === true;
  const ends = { x: 1.5 };
  let plot = new Plot2D(env.scene, { x: 0, y: 0, w: 1, h: 1 }, named.x, named.y);
  // The point (x, f(x)) stays in view.
  dragEndpoints(env, () => plot, ends, [], x => f(x) > named.y[0] && f(x) < named.y[1] - 0.04 * (named.y[1] - named.y[0]));

  return () => {
    const s = env.scene;
    s.begin(env.canvas, { dim: 2, yaw: 0, pitch: 0, perspective: false, center: [0, 0, 0], extent: 1 });
    plot = new Plot2D(s, canvasRect(s, 4, env.calc), named.x, named.y);
    const { x } = ends, y = f(x);
    // No tick labels where the label of x goes.
    plot.axes({ names: [{ text: "x", tex: "x" }, { text: "y", tex: "y" }], clearOf: [x] });
    plot.clipped(() => {
      plot.path(Array.from({ length: 401 }, (_, i) => {
        const t = named.x[0] + ((named.x[1] - named.x[0]) * i) / 400;
        return [t, f(t)];
      }), CURVE, 2.25, [], true);
    });
    // The guides to the axes, which the point's label keeps clear of.
    plot.path([[x, 0], [x, y]], HANDLE, 1.25, [4, 3], true);
    plot.path([[0, y], [x, y]], HANDLE, 1.25, [4, 3], true);
    plot.dot(x, 0, 5, HANDLE);
    const [px, py] = plot.px(x, 0);
    plot.label({ text: `x = ${fixed(x)}`, tex: `x = ${texNumber(fixed(x))}` }, x, 0, HANDLE, [[px, py, 0, y >= 0 ? 1 : -1]], 7);
    plot.dot(x, y, 5.5, CURVE);
    const [gx, gy] = plot.px(x, y);
    // In TeX, like the math in the text around the figure.
    const pair = { text: `(${fixed(x)}, ${fixed(y)})`, tex: `(${texNumber(fixed(x))}, ${texNumber(fixed(y))})` };
    const outward = x >= 0 ? 1 : -1;
    plot.label(pair, x, y, CURVE, [[gx, gy, outward * 0.8, 0.6], [gx, gy, outward, 0], [gx, gy, -outward * 0.8, -0.6]], 6);
    // The graph's name, near its upper-left end.
    const xl = named.x[0] + 0.14 * (named.x[1] - named.x[0]);
    // Beside the graph, clear of it (with the other directions around the point in case these are covered).
    const [nx, ny] = plot.px(xl, f(xl));
    plot.label(equation ? { text: "y = x²", tex: `y = ${named.tex}` } : { text: "f", tex: "f" }, xl, f(xl), CURVE,
      [[nx, ny, 1, 0.15], [nx, ny, 0.7, 0.7], ...anchorsAround(nx, ny)], 10);
    s.finish();

    const X = steadyFixedTex(x, ...named.x);
    showCalc(env, [`${equation ? "y" : `f(${X})`} = ${texAt(named.tex, X)} = ${texNumber(fixed(y))}`]);
    // The calculation is in the box over the canvas, so there is nothing more to say below it.
    env.readout.innerHTML = "";
  };
};
