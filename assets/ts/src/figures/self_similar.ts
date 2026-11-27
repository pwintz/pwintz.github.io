// ╭───────────────────────────────────────────────────────────────╮
// │       Copies of a shape inside itself, and its dimension        │
// ╰───────────────────────────────────────────────────────────────╯
// A segment, a square, or a fractal, drawn with its N copies of itself (each scaled down by a
// factor of r) in different colors, so that the dimension d with N = r^d can be read off. For a
// fractal, a slider sets the step of its construction.
//
// A menu switches to a cover of the set by small balls, as in the definition of the Hausdorff
// measure: one ball around each piece after k steps, each of diameter δ (shrinking as k grows), with
// a slider for the exponent s and the sum of the diameters to the power s. As δ → 0 the sum grows
// without bound for s < d and shrinks to 0 for s > d.
//
// Params (all optional):
//   shape: "segment", "square", "cantor", "sierpinski", or "koch". Without it, a menu chooses
//          the shape, starting with the square.
//   steps: the step that a fractal's construction starts at (default 4).

import { OKABE_ITO, Vec3 } from "../common/scene3d";
import { SIERPINSKI_CORNERS, SelfSimilarShape, cantorIntervals, coverBalls, coverSum, kochCurve, sierpinskiTriangles, similarityDimension } from "./fractals";
import { Pt } from "./geometry";
import { Widget, addSelect, addSlider, fixed, it, showCalc, steadyFixedTex, steadyTex } from "./widget";

type Shape = SelfSimilarShape;

const SHAPES: Record<Shape, { name: string; copies: number; factor: number; maxSteps: number; dim: string }> = {
  segment: { name: "segment", copies: 2, factor: 2, maxSteps: 0, dim: "1" },
  square: { name: "square", copies: 4, factor: 2, maxSteps: 0, dim: "2" },
  cantor: { name: "Cantor set", copies: 2, factor: 3, maxSteps: 6, dim: "log 2 / log 3" },
  sierpinski: { name: "Sierpinski triangle", copies: 3, factor: 2, maxSteps: 7, dim: "log 3 / log 2" },
  koch: { name: "Koch curve", copies: 4, factor: 3, maxSteps: 6, dim: "log 4 / log 3" },
};
// The finest cover drawn, for each shape (the number of balls grows quickly).
const COVER_STEPS: Record<Shape, number> = { segment: 7, square: 5, cantor: 6, sierpinski: 6, koch: 5 };
const BALL = { stroke: "rgba(40, 45, 55, 0.75)", fill: "rgba(40, 45, 55, 0.07)" };
const COPY_COLORS = [OKABE_ITO.blue, OKABE_ITO.orange, OKABE_ITO.bluishGreen, OKABE_ITO.reddishPurple];
const ONE_COLOR = "rgb(90, 110, 140)";
const v3 = ([x, y]: Pt): Vec3 => [x, y, 0];

export const selfSimilar: Widget = env => {
  const fixedShape = env.params.shape as Shape | undefined;
  let shape: Shape = fixedShape && fixedShape in SHAPES ? fixedShape : "square";
  let steps = Number(env.params.steps ?? 4);
  let slider: HTMLInputElement | null = null;
  let cover = false;
  let power = 1;
  let powerSlider: HTMLInputElement | null = null;
  const fitSlider = () => {
    if (!slider) return;
    const max = cover ? COVER_STEPS[shape] : SHAPES[shape].maxSteps;
    // The label's first child is its text.
    (slider.parentElement!.firstChild as Text).textContent = cover ? "Step k (smaller balls)" : "Step of the construction";
    if (powerSlider) (powerSlider.parentElement as HTMLElement).style.display = cover ? "" : "none";
    slider.max = String(max);
    steps = Math.min(steps, max);
    slider.value = String(steps);
    // (The label's own display: flex would override the hidden attribute.)
    (slider.parentElement as HTMLElement).style.display = max === 0 ? "none" : "";
  };
  if (!fixedShape) {
    addSelect<Shape>(env, "Shape", (Object.keys(SHAPES) as Shape[]).map(k => [k, SHAPES[k].name[0].toUpperCase() + SHAPES[k].name.slice(1)]), shape, v => {
      shape = v;
      if (SHAPES[v].maxSteps > 0 && steps === 0) steps = 4;
      fitSlider();
    });
  }
  addSelect<"copies" | "cover">(env, "Show", [["copies", "Copies of the set"], ["cover", "A cover by small balls"]], "copies", v => {
    cover = v === "cover";
    // A cover with a few large balls to start, so that the balls and the set both show.
    if (cover) steps = 2;
    fitSlider();
  });
  slider = addSlider(env, "Step of the construction", { min: 0, max: 7, step: 1, value: steps }, v => { steps = v; });
  powerSlider = addSlider(env, "Exponent <i>s</i>", { min: 0, max: 2, step: 0.01, value: power }, v => { power = v; });
  fitSlider();

  return () => {
    const s = env.scene;
    const info = SHAPES[shape];
    // A flat shape gets a wide canvas, so it doesn't sit in empty space. (A new shape changes the
    // canvas's size, which draws the figure again.)
    const view: Record<Shape, [aspect: string, cy: number, extent: number]> = {
      segment: ["3 / 1", 0.2, 0.2], square: ["4 / 3", 0.5, 0.56], cantor: ["2 / 1", 0.2, 0.4],
      sierpinski: ["4 / 3", Math.sqrt(3) / 4, 0.56], koch: ["2 / 1", 0.14, 0.29],
    };
    const [aspect, cy, extent] = view[shape];
    if (env.canvas.style.aspectRatio !== aspect) env.canvas.style.aspectRatio = aspect;
    // Below the box of calculations, which would cover part of the shape.
    s.begin(env.canvas, { dim: 2, yaw: 0, pitch: 0, perspective: false, center: [0.5, cy, 0], extent, avoid: env.calc, avoidBelow: true });
    const ctx = s.ctx;
    // A piece's color: its copy's color, from the first step on.
    const color = (i: number, count: number) => (steps === 0 && info.maxSteps > 0 ? ONE_COLOR : COPY_COLORS[Math.floor((i * info.copies) / count)]);
    const bar = (a: number, b: number, y: number, h: number, c: string) => {
      const [x0, y0] = s.project([a, y + h / 2, 0]), [x1, y1] = s.project([b, y - h / 2, 0]);
      ctx.fillStyle = c;
      // At least a pixel wide, so that the smallest intervals still show.
      ctx.fillRect(x0, y0, Math.max(1, x1 - x0), y1 - y0);
    };

    if (cover) {
      drawCover();
      return;
    }

    if (shape === "segment") {
      bar(0, 0.5, 0.2, 0.05, COPY_COLORS[0]);
      bar(0.5, 1, 0.2, 0.05, COPY_COLORS[1]);
    } else if (shape === "square") {
      for (let i = 0; i < 4; i++) {
        const x = (i % 2) / 2, y = Math.floor(i / 2) / 2;
        s.polygon([[x, y, 0], [x + 0.5, y, 0], [x + 0.5, y + 0.5, 0], [x, y + 0.5, 0]], COPY_COLORS[i], "#fff");
      }
    } else if (shape === "cantor") {
      // Every step up to the chosen one, stacked from the top, as the construction is usually drawn.
      const rowGap = 0.11;
      for (let k = 0; k <= steps; k++) {
        const pieces = cantorIntervals(k);
        const y = 0.2 + (steps / 2 - k) * rowGap;
        pieces.forEach(([a, b], i) => bar(a, b, y, 0.05, k === 0 ? ONE_COLOR : COPY_COLORS[Math.floor((i * 2) / pieces.length)]));
      }
    } else if (shape === "sierpinski") {
      const tris = sierpinskiTriangles(steps);
      // The outline of the first triangle, so that the removed triangles show as holes.
      s.path(SIERPINSKI_CORNERS.map(v3), "rgba(90, 110, 140, 0.5)", 1, [], true);
      tris.forEach((t, i) => s.polygon(t.map(v3), color(i, tris.length)));
    } else {
      const pts = kochCurve(steps);
      const segs = pts.length - 1;
      for (let j = 0; j < (steps === 0 ? 1 : 4); j++) {
        const per = steps === 0 ? segs : segs / 4;
        s.path(pts.slice(j * per, (j + 1) * per + 1).map(v3), color(j * per, segs), 2.25);
      }
    }
    s.finish();

    const { copies: N, factor: r, name } = info;
    const d = similarityDimension(N, r);
    const exact = Number.isInteger(Math.round(d * 1e9) / 1e9);
    const dim = exact ? `${it("d")} = ${info.dim}` : `${it("d")} = ${info.dim} ≈ ${fixed(d)}`;
    showCalc(env, [`${N} = ${r}^{d}`, exact ? `d = ${Math.round(d)}` : `d = \\log ${N} / \\log ${r} \\approx ${fixed(d)}`]);
    const step = info.maxSteps === 0 ? "" : steps === 0
      ? ` The construction starts from the ${shape === "sierpinski" ? "solid triangle" : "segment"} shown here; slide to a later step to see the copies.`
      : ` Step ${steps} of the construction is made of ${N} copies of step ${steps - 1} in the same way.`;
    env.readout.innerHTML = `The ${name} is made of ${N} copies of itself (in colors), each scaled down by a factor of ${r}. ` +
      `So scaling the ${name} up by a factor of ${r} multiplies its size by ${N}, and its dimension ${it("d")} solves ${N} = ${r}<sup>${it("d")}</sup>.` + step;

    /** The set (finely drawn), the balls of the cover after `steps` steps, and the sum of their diameters to the power s. */
    function drawCover(): void {
      const y0 = shape === "segment" || shape === "cantor" ? 0.2 : 0;
      if (shape === "segment") bar(0, 1, 0.2, 0.012, ONE_COLOR);
      else if (shape === "square") s.polygon([[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]], "rgba(90, 110, 140, 0.35)");
      else if (shape === "cantor") cantorIntervals(7).forEach(([a, b]) => bar(a, b, 0.2, 0.012, ONE_COLOR));
      else if (shape === "sierpinski") sierpinskiTriangles(7).forEach(t => s.polygon(t.map(v3), "rgba(90, 110, 140, 0.6)"));
      else s.path(kochCurve(6).map(v3), ONE_COLOR, 1.5);
      const balls = coverBalls(shape, steps);
      ctx.lineWidth = balls.length > 300 ? 0.75 : 1.25;
      for (const b of balls) {
        const [x, y] = s.project([b.c[0], b.c[1] + y0, 0]);
        const r = b.r * s.pxPerUnit;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(r, 0.75), 0, 2 * Math.PI);
        ctx.fillStyle = BALL.fill;
        ctx.fill();
        ctx.strokeStyle = BALL.stroke;
        ctx.stroke();
      }
      s.finish();

      const { copies: N, factor: r, name } = info;
      const d = similarityDimension(N, r);
      const delta = 2 * balls[0].r;
      const sum = coverSum(balls, power);
      // Each step multiplies the number of balls by N and their diameters by 1/r, so the sum by N / r^s.
      const q = N / r ** power;
      // In TeX, a number too large or small for decimals is written in scientific notation.
      const numTex = (v: number) => {
        if (!(v >= 1e4 || (v < 1e-3 && v > 0))) return v.toPrecision(3);
        const [m, e] = v.toExponential(2).split("e");
        return `${m} \\times 10^{${Number(e)}}`;
      };
      const num = (v: number) => (v >= 1e4 || (v < 1e-3 && v > 0) ? v.toExponential(2).replace("e+", " × 10^").replace("e-", " × 10^−") : v.toPrecision(3));
      const trend = Math.abs(q - 1) < 0.005
        ? `This ${it("s")} is the dimension ${it("d")} ≈ ${fixed(d)}, where each step leaves the sum the same`
        : q > 1
          ? `Each step multiplies the sum by ${N}/${r}<sup>${it("s")}</sup> ≈ ${fixed(q)}, so as ${it("δ")} → 0 the sum grows without bound: this ${it("s")} is less than the dimension ${it("d")} ≈ ${fixed(d)}`
          : `Each step multiplies the sum by ${N}/${r}<sup>${it("s")}</sup> ≈ ${fixed(q)}, so as ${it("δ")} → 0 the sum shrinks to 0: this ${it("s")} is more than the dimension ${it("d")} ≈ ${fixed(d)}`;
      // Room for the most balls and the smallest diameter that the slider reaches (see steady).
      const finest = coverBalls(shape, COVER_STEPS[shape]);
      const count = steadyTex(String(balls.length), String(finest.length));
      const diameter = steadyTex(num(delta), num(2 * finest[0].r), num(2 * coverBalls(shape, 0)[0].r));
      showCalc(env, [
        `N = ${count} \\text{ balls}, \\quad \\delta = ${diameter}`,
        `N \\delta^{s} = ${count} \\times ${diameter}^{${steadyFixedTex(power, 0, 2)}} = ${numTex(sum)}`,
      ]);
      env.readout.innerHTML = `${it("N")} balls of diameter ${it("δ")} cover the ${name}, and the sum of their diameters to the power ${it("s")} = ${fixed(power)} is ${it("N")}${it("δ")}<sup>${it("s")}</sup>. ` +
        `${trend}.`;
    }
  };
};
