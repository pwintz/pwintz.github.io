// ╭───────────────────────────────────────────────────────────────╮
// │              The complex plane, for the practice problem        │
// ╰───────────────────────────────────────────────────────────────╯
// Draws the practice problem's numbers as arrows from 0 in the complex plane, with the answers
// added once the steps are finished. While designing a problem, the numbers can be dragged (they
// snap to whole numbers, or, in polar form, to whole moduli and multiples of 15°).

import { loadJSON, saveJSON } from "../common/storage";
import { Fraction, isZero } from "../matrix/fraction";
import {
  C, F, Polar, Problem, cIsZero, cText, cconj, cnormSq, cx, normAngle, pictureOf, sqrtOf, rootText, argNumber,
  niceArg, fracText, degreesText, pmul, pdiv, cadd, csub, cmul, cdiv, cpow, ipow, toNumber,
} from "./complex_math";

const VIEW_KEY = "complex_numbers_view";
// Okabe–Ito colors: the given numbers, then the answers.
const GIVEN_COLORS = ["#0072B2", "#E69F00"];
const ANSWER_COLORS = ["#009E73", "#D55E00"];

export interface Visualizer {
  show(p: Problem, mode: "path" | "custom"): void;
  setFinished(finished: boolean): void;
}

export function setupVisualizer(onDesign: (p: Problem) => void): Visualizer {
  const canvas = document.getElementById("cx-canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const readout = document.getElementById("cx-readout") as HTMLDivElement;
  const hint = document.getElementById("cx-plot-hint") as HTMLParagraphElement;
  const boxes = {
    unit: document.getElementById("cx-unit-circle") as HTMLInputElement,
    angles: document.getElementById("cx-angles") as HTMLInputElement,
    parallelogram: document.getElementById("cx-parallelogram") as HTMLInputElement,
  };
  const saved = loadJSON<Record<string, boolean>>(VIEW_KEY) ?? {};
  boxes.unit.checked = saved.unit ?? true;
  boxes.angles.checked = saved.angles ?? false;
  boxes.parallelogram.checked = saved.parallelogram ?? true;
  for (const box of Object.values(boxes)) {
    box.addEventListener("change", () => {
      saveJSON(VIEW_KEY, { unit: boxes.unit.checked, angles: boxes.angles.checked, parallelogram: boxes.parallelogram.checked });
      draw();
    });
  }
  const parallelogramLabel = boxes.parallelogram.closest("label") as HTMLElement;

  let problem: Problem | null = null;
  let mode: "path" | "custom" = "path";
  let finished = false;
  let extent = 5;                       // The plot shows [−extent, extent] on both axes
  let dragging: "z" | "w" | null = null;

  // ⋘──────── Coordinates ────────⋙
  const size = () => canvas.clientWidth;
  const toPx = ([x, y]: [number, number]): [number, number] => {
    const s = size() / (2 * extent);
    return [size() / 2 + x * s, size() / 2 - y * s];
  };
  const fromPx = (px: number, py: number): [number, number] => {
    const s = size() / (2 * extent);
    return [(px - size() / 2) / s, (size() / 2 - py) / s];
  };

  function fitExtent(): void {
    if (!problem) return;
    const pic = pictureOf(problem);
    // The answers count only once they're shown, so the view doesn't give away their size.
    const all = [...pic.given, ...(finished ? pic.answers : [])].flatMap(p => p.z.map(Math.abs));
    extent = Math.max(2, Math.ceil(Math.max(1, ...all) * 1.2));
  }

  // ⋘──────── Drawing ────────⋙
  function arrow(to: [number, number], color: string, width = 2.5): void {
    const [x0, y0] = toPx([0, 0]), [x1, y1] = toPx(to);
    const len = Math.hypot(x1 - x0, y1 - y0);
    ctx.strokeStyle = ctx.fillStyle = color;
    ctx.lineWidth = width;
    if (len < 1) return;
    const ux = (x1 - x0) / len, uy = (y1 - y0) / len, head = Math.min(11, len / 2);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1 - ux * head * 0.7, y1 - uy * head * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - ux * head - uy * head * 0.45, y1 - uy * head + ux * head * 0.45);
    ctx.lineTo(x1 - ux * head + uy * head * 0.45, y1 - uy * head - ux * head * 0.45);
    ctx.closePath();
    ctx.fill();
  }

  function label(at: [number, number], text: string, color: string): void {
    const [x, y] = toPx(at);
    const len = Math.hypot(at[0], at[1]);
    const [ux, uy] = len < 1e-9 ? [0.7, 0.7] : [at[0] / len, at[1] / len];
    ctx.font = "italic 600 15px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const tx = x + ux * 16, ty = y - uy * 16;
    // A white halo keeps labels readable over the grid and other arrows.
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#fff";
    ctx.strokeText(text, tx, ty);
    ctx.fillStyle = color;
    ctx.fillText(text, tx, ty);
  }

  const dashed = (on: boolean) => ctx.setLineDash(on ? [5, 4] : []);

  function circle(r: number, color: string): void {
    const [cx0, cy0] = toPx([0, 0]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.3;
    dashed(true);
    ctx.beginPath();
    ctx.arc(cx0, cy0, r * size() / (2 * extent), 0, 2 * Math.PI);
    ctx.stroke();
    dashed(false);
  }

  function angleArc(z: [number, number], radiusPx: number, color: string): void {
    const t = Math.atan2(z[1], z[0]);
    const [cx0, cy0] = toPx([0, 0]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(cx0, cy0, radiusPx, 0, -t, t > 0);
    ctx.stroke();
  }

  function segment(a: [number, number], b: [number, number], color: string): void {
    const [x0, y0] = toPx(a), [x1, y1] = toPx(b);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.3;
    dashed(true);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    dashed(false);
  }

  function gridStep(): number {
    for (const s of [1, 2, 5, 10, 20, 50, 100, 200, 500]) if (extent / s <= 8) return s;
    return 1000;
  }

  function draw(): void {
    const dpr = window.devicePixelRatio || 1;
    const px = size();
    if (canvas.width !== Math.round(px * dpr)) {
      canvas.width = Math.round(px * dpr);
      canvas.height = Math.round(px * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, px, px);
    // The grid, axes, and tick labels.
    const step = gridStep();
    ctx.lineWidth = 1;
    for (let k = -Math.floor(extent / step) * step; k <= extent; k += step) {
      const [gx] = toPx([k, 0]), [, gy] = toPx([0, k]);
      ctx.strokeStyle = k === 0 ? "#5f6368" : "rgba(128, 128, 128, 0.18)";
      ctx.lineWidth = k === 0 ? 1.4 : 1;
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, px); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(px, gy); ctx.stroke();
      if (k !== 0 && gx > 14 && gx < px - 14 && gy > 14 && gy < px - 14) {
        ctx.fillStyle = "#6b6b6b";
        ctx.font = "12px system-ui, sans-serif";
        const [ox, oy] = toPx([0, 0]);
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillText(`${k}`, gx, oy + 4);
        ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(`${k}i`, ox - 5, gy);
      }
    }
    ctx.fillStyle = "#3c4043";
    ctx.font = "13px system-ui, sans-serif";
    ctx.textAlign = "right"; ctx.textBaseline = "bottom";
    ctx.fillText("Re", px - 6, toPx([0, 0])[1] - 4);
    ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.fillText("Im", toPx([0, 0])[0] + 6, 6);
    if (!problem) return;

    if (boxes.unit.checked) circle(1, "rgba(90, 100, 120, 0.55)");
    const pic = pictureOf(problem);
    const show = finished;
    // The modulus circle, for polar form (its size, not its value, so it doesn't give the answer away).
    if (problem.kind === "polar" || problem.kind === "conj") circle(Math.hypot(...pic.given[0].z), "rgba(0, 114, 178, 0.35)");
    if (show && problem.kind === "add" && boxes.parallelogram.checked) {
      const [z, w] = pic.given.map(p => p.z);
      const sum = pic.answers[0].z;
      segment(z, sum, GIVEN_COLORS[1]);
      segment(w, sum, GIVEN_COLORS[0]);
      segment(w, z, ANSWER_COLORS[1]);  // z − w is the arrow from w to z, moved to start at 0
    }
    if (boxes.angles.checked) {
      const points = [...pic.given, ...(show ? pic.answers : [])];
      const colors = [...GIVEN_COLORS.slice(0, pic.given.length), ...ANSWER_COLORS];
      points.forEach((p, i) => { if (Math.hypot(...p.z) > 1e-9) angleArc(p.z, 22 + 9 * i, colors[i]); });
    }
    if (show) pic.answers.forEach((p, i) => arrow(p.z, ANSWER_COLORS[i]));
    pic.given.forEach((p, i) => arrow(p.z, GIVEN_COLORS[i], 3));
    // An answer at the same point as a given number (such as i⁵ = i) shares its label: "i = i⁵".
    const samePoint = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-9;
    const shared = (z: [number, number]) => (show ? pic.answers.filter(a => samePoint(a.z, z)).map(a => a.name) : []);
    if (show) {
      pic.answers.forEach((p, i) => {
        if (!pic.given.some(g => samePoint(g.z, p.z))) label(p.z, p.name, ANSWER_COLORS[i]);
      });
    }
    pic.given.forEach((p, i) => label(p.z, [p.name, ...shared(p.z)].join(" = "), GIVEN_COLORS[i]));
    // Draggable tips.
    if (draggable()) {
      pic.given.forEach((p, i) => {
        const [x, y] = toPx(p.z);
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = GIVEN_COLORS[i];
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, 6, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
      });
    }
  }

  // ⋘──────── The readout ────────⋙
  const swatch = (color: string) => `<span class="cx-swatch" style="background:${color}"></span>`;
  const polarText = (p: Polar) => `${toNumber(p.r) === 1 ? "" : fracText(p.r)}<i>e</i><sup><i>i</i>${angleText(p.t)}</sup>`;
  const angleText = (t: Fraction) => {
    if (isZero(t)) return "0";
    const s = fracText(t).replace("-", "−");
    const [top, bottom] = s.split("/");
    const num = top === "1" ? "π" : top === "−1" ? "−π" : `${top}π`;
    return bottom ? `${num}/${bottom}` : num;
  };
  const modArg = (z: C) => {
    const exact = niceArg(z);
    const theta = exact ? `${angleText(exact)} (${degreesText(toNumber(exact))})` : `${degreesText(argNumber(z))}`;
    return `|${"z"}| = ${rootText(sqrtOf(cnormSq(z)))}, θ = ${theta}`;
  };

  function renderReadout(): void {
    if (!problem) { readout.innerHTML = ""; return; }
    const p = problem;
    const rows: string[] = [];
    const row = (color: string, name: string, value: string) =>
      rows.push(`<div class="cx-readout-row">${swatch(color)}<span class="cx-readout-name">${name}</span><span>${value}</span></div>`);
    const hidden = `<span class="cx-hidden">finish the steps to see it</span>`;
    const val = (text: string) => (finished ? text.replace(/-/g, "−") : hidden);
    switch (p.kind) {
      case "powi":
        row(GIVEN_COLORS[0], "<i>i</i>", "the point 0 + 1<i>i</i>");
        row(ANSWER_COLORS[0], `<i>i</i><sup>${p.n}</sup>`, val(cText(ipow(p.n))));
        break;
      case "add":
        row(GIVEN_COLORS[0], "<i>z</i>", cText(p.z));
        row(GIVEN_COLORS[1], "<i>w</i>", cText(p.w));
        row(ANSWER_COLORS[0], "<i>z</i> + <i>w</i>", val(cText(cadd(p.z, p.w))));
        row(ANSWER_COLORS[1], "<i>z</i> − <i>w</i>", val(cText(csub(p.z, p.w))));
        break;
      case "mul": case "div":
        row(GIVEN_COLORS[0], "<i>z</i>", cText(p.z));
        row(GIVEN_COLORS[1], "<i>w</i>", cText(p.w));
        row(ANSWER_COLORS[0], p.kind === "mul" ? "<i>zw</i>" : "<i>z</i>/<i>w</i>", val(cText(p.kind === "mul" ? cmul(p.z, p.w) : cdiv(p.z, p.w))));
        break;
      case "conj":
        row(GIVEN_COLORS[0], "<i>z</i>", cText(p.z));
        row(ANSWER_COLORS[0], "<i>z̄</i>", val(cText(cconj(p.z))));
        row("transparent", "", finished ? `|<i>z</i>| = ${rootText(sqrtOf(cnormSq(p.z)))}` : `|<i>z</i>| = ${hidden}`);
        break;
      case "polar":
        row(GIVEN_COLORS[0], "<i>z</i>", cText(p.z));
        row("transparent", "", finished ? modArg(p.z).replace("|z|", "|<i>z</i>|") : `|<i>z</i>| and θ: ${hidden}`);
        break;
      case "polarmul":
        row(GIVEN_COLORS[0], "<i>z</i>", polarText(p.z));
        row(GIVEN_COLORS[1], "<i>w</i>", polarText(p.w));
        row(ANSWER_COLORS[0], "<i>zw</i>", finished ? polarText(pmul(p.z, p.w)) : hidden);
        row(ANSWER_COLORS[1], "<i>z</i>/<i>w</i>", finished ? polarText(pdiv(p.z, p.w)) : hidden);
        break;
      case "power":
        row(GIVEN_COLORS[0], "<i>z</i>", cText(p.z));
        row(ANSWER_COLORS[0], `<i>z</i><sup>${p.n}</sup>`, val(cText(cpow(p.z, p.n))));
        break;
    }
    readout.innerHTML = rows.join("");
  }

  function update(): void {
    parallelogramLabel.hidden = problem?.kind !== "add";
    hint.textContent = draggable()
      ? "Drag the tip of an arrow to change the problem."
      : finished ? "" : "The answers appear in the picture when you finish the steps.";
    renderReadout();
    draw();
  }

  // ⋘──────── Dragging (while designing a problem) ────────⋙
  const draggable = () => mode === "custom" && problem !== null && problem.kind !== "powi";

  function nearest(px: number, py: number): "z" | "w" | null {
    if (!problem) return null;
    const pic = pictureOf(problem);
    let best: "z" | "w" | null = null, bestD = 18;
    pic.given.forEach((p, i) => {
      const [x, y] = toPx(p.z);
      const d = Math.hypot(x - px, y - py);
      if (d < bestD) { bestD = d; best = i === 0 ? "z" : "w"; }
    });
    return best;
  }

  /** The problem with `which` moved to the point (x, y) of the plane, snapped; null if not allowed there. */
  function moved(which: "z" | "w", x: number, y: number): Problem | null {
    const p = problem!;
    if (p.kind === "polarmul") {
      const r = Math.max(1, Math.round(Math.hypot(x, y)));
      const t = normAngle(F(Math.round(Math.atan2(y, x) / Math.PI * 12), 12));
      const q: Polar = { r: F(r), t };
      return { ...p, [which]: q };
    }
    const lim = extent;
    const z = cx(Math.max(-lim, Math.min(lim, Math.round(x))), Math.max(-lim, Math.min(lim, Math.round(y))));
    if (p.kind === "powi") return null;
    if (which === "w" && "w" in p) {
      if (p.kind === "div" && cIsZero(z)) return null;
      return { ...p, w: z } as Problem;
    }
    if ((p.kind === "polar" || p.kind === "power") && cIsZero(z)) return null;
    return { ...p, z } as Problem;
  }

  const pointer = (e: PointerEvent): [number, number] => {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  canvas.addEventListener("pointerdown", e => {
    if (!draggable()) return;
    dragging = nearest(...pointer(e));
    if (!dragging) return;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add("cx-dragging");
    e.preventDefault();
  });
  canvas.addEventListener("pointermove", e => {
    if (!dragging) {
      canvas.style.cursor = draggable() && nearest(...pointer(e)) ? "grab" : "";
      return;
    }
    const next = moved(dragging, ...fromPx(...pointer(e)));
    if (!next) return;
    problem = next;
    renderReadout();
    draw();
  });
  const drop = () => {
    if (!dragging) return;
    dragging = null;
    canvas.classList.remove("cx-dragging");
    if (problem) onDesign(problem);
  };
  canvas.addEventListener("pointerup", drop);
  canvas.addEventListener("pointercancel", drop);

  new ResizeObserver(() => draw()).observe(canvas);

  return {
    show(p, m) {
      problem = p;
      mode = m;
      if (!dragging) fitExtent();
      update();
    },
    setFinished(f) {
      if (f === finished) { update(); return; }
      finished = f;
      if (!dragging) fitExtent();
      update();
    },
  };
}
