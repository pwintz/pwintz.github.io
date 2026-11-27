// ╭───────────────────────────────────────────────────────────────╮
// │        Illustrations in the Dictionary of Fine Distinctions    │
// ╰───────────────────────────────────────────────────────────────╯
// A definition level or an example can have a `figure` in its front matter:
//
//   figure:
//     widget: neighborhood          # a key of WIDGETS below
//     params: { set: open }         # passed to the widget
//     caption: |-                   # Markdown, below the figure
//       ...
//     alt: ...                      # a description of the picture, for screen readers
//
// _includes/dictionary-figure.html turns it into a <figure> with a canvas, and this script draws
// each one with its widget (in ./figures/), using the plotting code of the tools (common/scene3d.ts).
// A figure is redrawn when its size changes, which includes when a hidden definition level is shown.

import { Scene, redrawOnMathLabels } from "./common/scene3d";
import { angle } from "./figures/angle";
import { arensFort } from "./figures/arens_fort";
import { density } from "./figures/density";
import { diagram } from "./figures/diagram";
import { functionGraph } from "./figures/function_graph";
import { functionPlot } from "./figures/function_plot";
import { integral } from "./figures/integral";
import { neighborhood } from "./figures/neighborhood";
import { neighborhoodBasis } from "./figures/neighborhood_basis";
import { planeFigure } from "./figures/plane_figure";
import { quadcopter } from "./figures/quadcopter";
import { selfSimilar } from "./figures/self_similar";
import { taylor } from "./figures/taylor";
import { FigureEnv, Widget } from "./figures/widget";

const WIDGETS: Record<string, Widget> = {
  "angle": angle,
  "arens-fort": arensFort,
  "density": density,
  "diagram": diagram,
  "function-graph": functionGraph,
  "function-plot": functionPlot,
  "integral": integral,
  "neighborhood": neighborhood,
  "neighborhood-basis": neighborhoodBasis,
  "plane": planeFigure,
  "quadcopter": quadcopter,
  "self-similar": selfSimilar,
  "taylor": taylor,
};

function setup(figure: HTMLElement): void {
  const name = figure.dataset.widget ?? "";
  const widget = WIDGETS[name];
  const canvas = figure.querySelector<HTMLCanvasElement>(".dict-figure__canvas");
  if (!widget || !canvas) {
    console.warn(`Dictionary figure: no widget named "${name}".`);
    return;
  }
  let params: Record<string, unknown> = {};
  try {
    params = JSON.parse(figure.dataset.params || "null") ?? {};
  } catch {
    console.warn(`Dictionary figure "${name}": params aren't valid JSON.`);
  }
  let frame = 0;
  let draw = () => {};
  const env: FigureEnv = {
    figure,
    canvas,
    scene: new Scene(),
    controls: figure.querySelector<HTMLElement>(".dict-figure__controls")!,
    readout: figure.querySelector<HTMLElement>(".dict-figure__readout")!,
    calc: figure.querySelector<HTMLElement>(".dict-figure__calc")!,
    key: figure.querySelector<HTMLElement>(".dict-figure__key")!,
    params,
    redraw: () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        // A figure in a hidden definition level has no size; it is drawn when it is shown.
        if (canvas.clientWidth === 0) return;
        // The figure's text matches the page's text around it (whose size can change with the window's width).
        const style = getComputedStyle(figure);
        env.scene.pageText = { size: parseFloat(style.fontSize), family: style.fontFamily };
        // Math labels as HTML over the canvas, typeset like the math in the text.
        env.scene.htmlLayer = canvas.parentElement;
        draw();
      });
    },
  };
  draw = widget(env);
  new ResizeObserver(() => env.redraw()).observe(canvas);
  redrawOnMathLabels(env.redraw);
  env.redraw();
}

document.querySelectorAll<HTMLElement>(".dict-figure[data-widget]").forEach(setup);
