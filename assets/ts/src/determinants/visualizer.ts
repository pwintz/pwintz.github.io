// ╭───────────────────────────────────────────────────────────────╮
// │        The parallelogram or parallelepiped of the columns       │
// ╰───────────────────────────────────────────────────────────────╯
// Draws the columns of the practice problem's 2 × 2 or 3 × 3 matrix A as arrows, with the
// parallelogram (or parallelepiped) they span: the image of the unit square (or cube) under A. Its
// area (or volume) is |det A|, and the sign of det A is its orientation. The values, and the
// shading by orientation, appear once the steps are finished. While designing a 2 × 2 problem, the
// tips of the columns can be dragged (they snap to whole numbers); a 3 × 3 picture rotates by dragging.

import {
  EasedBox, OKABE_ITO, PlotLabel, Rotator, SPAN_COLOR, SPAN_EDGE, Scene, Vec3, add3, fitBox, redrawOnMathLabels, scale3, toVec3,
} from "../common/scene3d";
import { loadJSON, saveJSON } from "../common/storage";
import { isZero } from "../matrix/fraction";
import { FMat } from "../matrix/linalg";
import { F, Problem, det, plainText, toNumber } from "./det_math";

const VIEW_KEY = "determinants_view";
const COLORS = [OKABE_ITO.blue, OKABE_ITO.orange, OKABE_ITO.bluishGreen];
// Blue–orange for the orientation: sky blue for positive, vermillion for negative.
const POSITIVE_FILL = "rgba(86, 180, 233, 0.28)";
const NEGATIVE_FILL = "rgba(213, 94, 0, 0.2)";
const UNIT_COLOR = "rgba(60, 64, 67, 0.55)";
const ORIENT_UNIT = "#5f6368";
const SUBSCRIPTS = "₀₁₂₃";
const colLabel = (j: number): PlotLabel => ({ text: `a${SUBSCRIPTS[j + 1]}`, tex: `\\vect{a}_${j + 1}` });

export interface Visualizer {
  show(p: Problem, mode: "path" | "custom"): void;
  setFinished(finished: boolean): void;
}

export function setupVisualizer(onDesign: (p: Problem) => void): Visualizer {
  const canvas = document.getElementById("dt-canvas") as HTMLCanvasElement;
  const figure = document.getElementById("dt-viz") as HTMLDivElement;
  const readout = document.getElementById("dt-readout") as HTMLDivElement;
  const hint = document.getElementById("dt-plot-hint") as HTMLParagraphElement;
  const caption = document.getElementById("dt-caption") as HTMLElement;
  const unitBox = document.getElementById("dt-unit") as HTMLInputElement;
  const orientBox = document.getElementById("dt-orientation") as HTMLInputElement;
  const toolbar = document.getElementById("dt-plot-toolbar") as HTMLDivElement;
  const saved = loadJSON<{ unit?: boolean; orientation?: boolean }>(VIEW_KEY) ?? {};
  unitBox.checked = saved.unit ?? true;
  orientBox.checked = saved.orientation ?? true;
  for (const box of [unitBox, orientBox]) {
    box.addEventListener("change", () => {
      saveJSON(VIEW_KEY, { unit: unitBox.checked, orientation: orientBox.checked });
      draw();
    });
  }
  const orientLabel = orientBox.closest("label") as HTMLElement;

  let problem: Problem | null = null;
  let mode: "path" | "custom" = "path";
  let finished = false;
  const view = { yaw: -0.6, pitch: 0.45 };
  let dragging: { kind: "tip"; j: number } | { kind: "rotate" } | null = null;

  /** The matrix drawn: a 2 × 2 or 3 × 3 problem's, else null. */
  const matrix = (): FMat | null =>
    problem && problem.kind !== "props" && (problem.A.length === 2 || problem.A.length === 3) ? problem.A : null;
  const dim = () => (matrix()?.length === 3 ? 3 : 2) as 2 | 3;
  const columns = (): Vec3[] => {
    const A = matrix();
    return A ? A[0].map((_, j) => toVec3(A.map(row => toNumber(row[j])))) : [];
  };
  /** The corners of the parallelogram or parallelepiped, from the origin. */
  const corners = (cols: Vec3[]): Vec3[] => {
    const out: Vec3[] = [[0, 0, 0]];
    for (const c of cols) out.push(...out.map(p => add3(p, c)));
    return out;
  };

  const box = new EasedBox(() => fitBox([...corners(columns()), [1, 1, dim() === 3 ? 1 : 0]], dim(), 1.15, 1.5), () => draw());
  redrawOnMathLabels(() => draw());
  const scene = new Scene();

  // ⋘──────── Drawing ────────⋙
  function draw(): void {
    const A = matrix();
    if (!A) return;
    const d = dim(), cols = columns();
    const sc = scene;
    sc.begin(canvas, { dim: d, yaw: view.yaw, pitch: view.pitch, perspective: false, center: box.center, extent: box.extent });
    sc.gridAndAxes(d === 2 ? "rgba(128,128,128,0.22)" : "rgba(128,128,128,0.16)", d === 2);
    const D = det(A);
    const fill = !finished ? SPAN_COLOR : isZero(D) ? SPAN_COLOR : D.num > 0n ? POSITIVE_FILL : NEGATIVE_FILL;
    if (d === 2) {
      const [u, v] = cols;
      if (unitBox.checked) {
        const sq: Vec3[] = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]];
        sq.forEach((p, k) => sc.line(p, sq[(k + 1) % 4], UNIT_COLOR, 1.3, [5, 4]));
      }
      sc.polygon([[0, 0, 0], u, add3(u, v), v], fill, SPAN_EDGE);
      if (finished && orientBox.checked) {
        // The unit square turns counterclockwise from e₁ to e₂; its image turns the same way when
        // det A > 0, and the other way when det A < 0.
        if (unitBox.checked) circleArrow(sc, [[1, 0, 0], [0, 1, 0]], true, ORIENT_UNIT);
        if (!isZero(D)) circleArrow(sc, [u, v], D.num > 0n, D.num > 0n ? OKABE_ITO.blue : OKABE_ITO.vermillion);
      }
    } else {
      if (unitBox.checked) {
        const c = corners([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        edges(c).forEach(([a, b]) => sc.line(a, b, UNIT_COLOR, 1.1, [4, 4]));
      }
      const c = corners(cols);
      // The faces, back to front, so the nearer ones are drawn over the farther ones.
      const faces = FACE_CORNERS.map(f => f.map(k => c[k]));
      const depth = (f: Vec3[]) => f.reduce((s, p) => s + sc.project(p)[2], 0) / f.length;
      faces.sort((a, b) => depth(a) - depth(b)).forEach(f => sc.polygon(f, fill));
      edges(c).forEach(([a, b]) => sc.line(a, b, SPAN_EDGE, 1.3));
    }
    cols.forEach((c, j) => sc.arrow([0, 0, 0], c, COLORS[j], 3, colLabel(j)));
    sc.dot([0, 0, 0], 3.5, "#202124");
    // Draggable tips, while designing a 2 × 2 problem.
    if (tipsDraggable()) {
      cols.forEach((c, j) => {
        const [x, y] = sc.project(c);
        const ctx = sc.ctx;
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = COLORS[j];
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, 6, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
      });
    }
    sc.finish();
  }

  /**
   * A circular arrow in the middle of the parallelogram with sides u and v, turning counterclockwise
   * (on the page) when `ccw`, else clockwise. It fits inside the parallelogram when there is room.
   */
  function circleArrow(sc: Scene, [u, v]: [Vec3, Vec3], ccw: boolean, color: string): void {
    const ctx = sc.ctx;
    const [ox, oy] = sc.project([0, 0, 0]);
    const [ux, uy] = sc.project(u), [vx, vy] = sc.project(v);
    const [cx, cy] = sc.project(scale3(0.5, add3(u, v)));
    // Half the parallelogram's smaller height, in pixels.
    const area = Math.abs((ux - ox) * (vy - oy) - (uy - oy) * (vx - ox));
    const halfHeight = area / Math.max(1, Math.hypot(ux - ox, uy - oy), Math.hypot(vx - ox, vy - oy)) / 2;
    const r = Math.max(8, Math.min(20, 0.6 * halfHeight));
    // An arc of about 300°, with a gap at the top; on the canvas, y points down, so a counterclockwise
    // turn on the page is `anticlockwise` in canvas terms.
    const gap = 0.6;
    const top = -Math.PI / 2;
    const start = ccw ? top - gap / 2 : top + gap / 2;
    const end = ccw ? top + gap / 2 - 2 * Math.PI : top - gap / 2 + 2 * Math.PI;
    ctx.save();
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    // A white halo, so the arrow reads over the shading and the grid.
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, end, ccw);
    ctx.stroke();
    ctx.strokeStyle = ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, end, ccw);
    ctx.stroke();
    // The arrowhead at the end, pointing along the turn.
    const ex = cx + r * Math.cos(end), ey = cy + r * Math.sin(end);
    const dir = ccw ? -1 : 1;
    const tx = -Math.sin(end) * dir, ty = Math.cos(end) * dir;  // The direction of travel
    const nx = Math.cos(end), ny = Math.sin(end);
    const h = Math.max(5, Math.min(7, r * 0.45));
    ctx.beginPath();
    ctx.moveTo(ex + tx * h * 0.7, ey + ty * h * 0.7);
    ctx.lineTo(ex - tx * h * 0.5 + nx * h * 0.7, ey - ty * h * 0.5 + ny * h * 0.7);
    ctx.lineTo(ex - tx * h * 0.5 - nx * h * 0.7, ey - ty * h * 0.5 - ny * h * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // ⋘──────── The readout ────────⋙
  const swatch = (color: string) => `<span class="dt-swatch" style="background:${color}"></span>`;
  const hidden = `<span class="dt-hidden">finish the steps to see it</span>`;

  function renderReadout(): void {
    const A = matrix();
    if (!A) { readout.innerHTML = ""; return; }
    const n = A.length, D = det(A), abs = D.num < 0n ? F(-D.num, D.den) : D;
    const rows: string[] = A[0].map((_, j) =>
      `<div class="dt-readout-row">${swatch(COLORS[j])}<span class="dt-readout-name"><b>a</b><sub>${j + 1}</sub></span><span>(${A.map(row => plainText(row[j])).join(", ")})</span></div>`);
    const line = (name: string, value: string) => rows.push(`<div class="dt-readout-row"><span class="dt-readout-name">${name}</span><span>${value}</span></div>`);
    line("det <i>A</i>", finished ? plainText(D) : hidden);
    line(n === 2 ? "Area" : "Volume", finished ? plainText(abs) : hidden);
    const orientation = isZero(D) ? "none: the columns are linearly dependent, so the shape is flat"
      : n === 2
        ? D.num > 0n ? "kept: from <b>a</b><sub>1</sub> to <b>a</b><sub>2</sub> is counterclockwise" : "flipped: from <b>a</b><sub>1</sub> to <b>a</b><sub>2</sub> is clockwise"
        : D.num > 0n ? "kept: the columns are right-handed" : "flipped: the columns are left-handed";
    line("Orientation", finished ? orientation : hidden);
    readout.innerHTML = rows.join("");
  }

  function update(): void {
    const A = matrix();
    figure.hidden = !A;
    toolbar.hidden = !A;
    orientLabel.hidden = dim() === 3;
    caption.textContent = dim() === 3 ? "The parallelepiped spanned by the columns of A" : "The parallelogram spanned by the columns of A";
    unitBox.nextElementSibling!.textContent = dim() === 3 ? "Unit cube" : "Unit square";
    hint.textContent = !A
      ? problem?.kind === "props"
        ? "This problem has no matrix to draw. Try a 2 × 2 or 3 × 3 problem to see determinants as areas and volumes."
        : "The picture shows 2 × 2 and 3 × 3 matrices. A 4 × 4 determinant is a volume in four dimensions."
      : tipsDraggable() ? "Drag the tip of a column to change the matrix."
        : dim() === 3 ? (finished ? "Drag to rotate." : "Drag to rotate. The values appear when you finish the steps.")
          : finished ? "" : "The values appear when you finish the steps.";
    renderReadout();
    box.update();
    draw();
  }

  // ⋘──────── Dragging ────────⋙
  const tipsDraggable = () => mode === "custom" && problem?.kind === "det2";
  const rotator = new Rotator(view, () => draw());

  function tipAt(x: number, y: number): number | null {
    if (!tipsDraggable()) return null;
    let best: number | null = null, bestD = 20;
    columns().forEach((c, j) => {
      const [px, py] = scene.project(c);
      const dd = Math.hypot(px - x, py - y);
      if (dd < bestD) { bestD = dd; best = j; }
    });
    return best;
  }

  const pointer = (e: PointerEvent): [number, number] => {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  canvas.addEventListener("pointerdown", e => {
    if (!matrix()) return;
    const [x, y] = pointer(e);
    rotator.stop();
    const j = tipAt(x, y);
    if (j !== null) {
      dragging = { kind: "tip", j };
      box.setHold(true);
    } else if (dim() === 3) {
      dragging = { kind: "rotate" };
      rotator.start(x, y);
    } else {
      return;
    }
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add("dt-dragging");
    e.preventDefault();
  });
  canvas.addEventListener("pointermove", e => {
    const [x, y] = pointer(e);
    if (!dragging) {
      canvas.style.cursor = tipAt(x, y) !== null || (matrix() && dim() === 3) ? "grab" : "";
      return;
    }
    if (dragging.kind === "rotate") {
      rotator.move(x, y);
      return;
    }
    const [wx, wy] = scene.unproject2D(x, y);
    const lim = 20;
    const snap = (t: number) => F(Math.max(-lim, Math.min(lim, Math.round(t))));
    const j = dragging.j;
    const A = matrix()!.map(row => [...row]);
    A[0][j] = snap(wx);
    A[1][j] = snap(wy);
    problem = { kind: "det2", A };
    renderReadout();
    draw();
  });
  const drop = (e: PointerEvent) => {
    if (!dragging) return;
    if (dragging.kind === "rotate") rotator.end(e.type === "pointerup");
    else {
      box.setHold(false);
      if (problem) onDesign(problem);
    }
    dragging = null;
    canvas.classList.remove("dt-dragging");
  };
  canvas.addEventListener("pointerup", drop);
  canvas.addEventListener("pointercancel", drop);
  canvas.addEventListener("touchmove", e => { if (dragging) e.preventDefault(); }, { passive: false });

  new ResizeObserver(() => draw()).observe(canvas);

  return {
    show(p, m) {
      problem = p;
      mode = m;
      if (!dragging) box.snap();
      update();
    },
    setFinished(f) {
      finished = f;
      update();
    },
  };
}

// The six faces of the parallelepiped, as indices into `corners` (bit k set: column k added).
const FACE_CORNERS = [
  [0, 1, 3, 2], [4, 5, 7, 6],  // Without and with a₃
  [0, 1, 5, 4], [2, 3, 7, 6],  // Without and with a₂
  [0, 2, 6, 4], [1, 3, 7, 5],  // Without and with a₁
];

/** The 12 edges between corners that differ by one column. */
function edges(c: Vec3[]): [Vec3, Vec3][] {
  const out: [Vec3, Vec3][] = [];
  for (let a = 0; a < c.length; a++) {
    for (let k = 0; (1 << k) < c.length; k++) if (!(a & (1 << k))) out.push([c[a], c[a | (1 << k)]]);
  }
  return out;
}
