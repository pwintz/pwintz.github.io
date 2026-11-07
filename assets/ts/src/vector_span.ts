import { typeset } from './common/mathjax';
import { setupPanels } from './common/panels';
import { loadJSON, loadString, saveJSON } from './common/storage';
import { enableDragReorder } from './common/drag_reorder';

// ╭───────────────────────────────────────────────────────────────╮
// │                    Span of vectors in 2D/3D                   │
// ╰───────────────────────────────────────────────────────────────╯
// Up to three vectors are drawn in ℝ² or ℝ³ along with their span: the origin alone, a line, a
// plane, or all of space. Sliders choose coefficients c₁, c₂, c₃, and the linear combination
// c₁v₁ + c₂v₂ + c₃v₃ is drawn tip to tail, so it is visible that every combination lands in the span.
//
// In 2D, the tips of the vectors can be dragged. In 3D, dragging the canvas rotates the view, and the
// vectors are edited in the number fields; a fling keeps the view spinning until it is clicked.
// Three small side views look along the coordinate axes. The scene uses an orthographic projection.

type Vec = [number, number, number];

const MAX_VECTORS = 5;
// The Okabe–Ito palette, chosen to stay distinguishable under the common kinds of color blindness:
// vermillion, blue, bluish green, reddish purple, and sky blue. The result is black.
const COLORS = ['#D55E00', '#0072B2', '#009E73', '#CC79A7', '#56B4E9'];
const ALL = [0, 1, 2, 3, 4]; // Indices of every vector, in their default order.
const COMBO_COLOR = '#000000';
// The span is a neutral gray-blue so it doesn't compete with the vectors' colors.
const SPAN_COLOR = 'rgba(120, 140, 170, 0.22)';
const SPAN_EDGE = 'rgba(90, 110, 140, 0.9)';
const SPAN_GRID = 'rgba(90, 110, 140, 0.3)';
const TOL = 1e-9;

const state = {
  dim: 3 as 2 | 3,
  count: 2,
  /** The order in which the vectors are added tip to tail, as indices into `vectors`. */
  order: [...ALL],
  vectors: [[2, 1, 0], [-1, 2, 1], [1, 3, 1], [0, -1, 2], [-2, 1, -1]] as Vec[],
  coeffs: [1.5, 1.5, 0, 0, 0],
  yaw: -0.6,
  pitch: 0.45,
};

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const canvas = $<HTMLCanvasElement>('span-canvas');
let ctx = canvas.getContext('2d')!;

// ── Vector arithmetic ──────────────────────────────────────────────
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (k: number, a: Vec): Vec => [k * a[0], k * a[1], k * a[2]];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a: Vec) => Math.sqrt(dot(a, a));
const cross = (a: Vec, b: Vec): Vec =>
  [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

function activeVectors(): Vec[] {
  return state.vectors.slice(0, state.count).map(
    v => (state.dim === 2 ? [v[0], v[1], 0] : v) as Vec);
}

/** An orthonormal basis of the span, found by Gram–Schmidt. */
function spanBasis(vs: Vec[]): Vec[] {
  const basis: Vec[] = [];
  for (const v of vs) {
    let w = v;
    for (const b of basis) w = add(w, scale(-dot(w, b), b));
    const n = norm(w);
    if (n > TOL * Math.max(1, norm(v)) && n > 1e-6) basis.push(scale(1 / n, w));
  }
  return basis;
}

/** The indices of the active vectors, in the order they are added. */
function addOrder(): number[] {
  return state.order.filter(i => i < state.count);
}

/**
 * The reduced row echelon form of the matrix whose columns are `vs` (using the first `state.dim`
 * coordinates), and its pivot columns. Entries within a small tolerance of zero are set to 0.
 */
function rref(vs: Vec[]): { R: number[][]; pivots: number[] } {
  const n = vs.length, m = state.dim;
  const R = Array.from({ length: m }, (_, r) => vs.map(v => v[r]));
  const tol = 1e-9 * Math.max(1, ...vs.flat().map(Math.abs));
  const pivots: number[] = [];
  let r = 0;
  for (let c = 0; c < n && r < m; c++) {
    let best = r;
    for (let k = r + 1; k < m; k++) if (Math.abs(R[k][c]) > Math.abs(R[best][c])) best = k;
    if (Math.abs(R[best][c]) < tol) continue;
    [R[r], R[best]] = [R[best], R[r]];
    const pv = R[r][c];
    R[r] = R[r].map(x => x / pv);
    for (let k = 0; k < m; k++) {
      if (k === r) continue;
      const f = R[k][c];
      R[k] = R[k].map((x, j) => x - f * R[r][j]);
    }
    pivots.push(c);
    r++;
  }
  for (const row of R) row.forEach((x, j) => { if (Math.abs(x) < tol) row[j] = 0; });
  return { R, pivots };
}

/**
 * A basis of the null space of the matrix whose columns are `vs`: the coefficient changes that
 * leave c₁v₁ + ⋯ + cₖvₖ unchanged. Read from the RREF, one vector per free column; each is scaled
 * so its largest entry is 1.
 */
function nullSpace(vs: Vec[]): number[][] {
  const n = vs.length;
  const { R, pivots } = rref(vs);
  const basis: number[][] = [];
  for (let free = 0; free < n; free++) {
    if (pivots.includes(free)) continue;
    const x = new Array(n).fill(0);
    x[free] = 1;
    pivots.forEach((pc, pr) => (x[pc] = -R[pr][free]));
    const big = x.reduce((m, y) => (Math.abs(y) > Math.abs(m) ? y : m), 0);
    basis.push(x.map(y => y / big));
  }
  return basis;
}

// ── Projection ─────────────────────────────────────────────────────
let pxPerUnit = 1;
let cx = 0;
let cy = 0;

/** Projects a world point to canvas pixels, also returning its depth (larger is nearer). */
function project(world: Vec): [number, number, number] {
  // The view is centered on `center`, which keeps the vectors in the middle of the plot.
  const p: Vec = [world[0] - center[0], world[1] - center[1], world[2] - center[2]];
  if (state.dim === 2) return [cx + p[0] * pxPerUnit, cy - p[1] * pxPerUnit, 0];
  // World z is up. Rotate by yaw about z, then pitch about the screen's horizontal axis.
  const cyw = Math.cos(view.yaw), syw = Math.sin(view.yaw);
  const x1 = cyw * p[0] - syw * p[1];
  const y1 = syw * p[0] + cyw * p[1];
  const cp = Math.cos(view.pitch), sp = Math.sin(view.pitch);
  // The camera looks along +y (rotated), so x points right, z up, and y away from the viewer, which
  // is right-handed. With a positive pitch the camera looks down, so farther points appear higher.
  const up = cp * p[2] + sp * y1;
  const depth = cp * y1 - sp * p[2]; // Distance away from the viewer.
  // With perspective, the camera sits a few box-widths in front of the center, and points shrink
  // toward the screen's center as they get farther away. At depth 0 the scale is unchanged.
  const k = view.perspective ? CAMERA_DISTANCE / (CAMERA_DISTANCE + depth / extent) : 1;
  return [cx + x1 * pxPerUnit * k, cy - up * pxPerUnit * k, -depth];
}

/** The camera's distance from the center of the box, in units of the box's half-width. */
const CAMERA_DISTANCE = 7;

function line(a: Vec, b: Vec, color: string, width = 1, dash: number[] = []) {
  const [ax, ay] = project(a), [bx, by] = project(b);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();
  ctx.setLineDash([]);
}

function arrow(from: Vec, to: Vec, color: string, width: number, label?: string, dash: number[] = []) {
  const [ax, ay] = project(from), [bx, by] = project(to);
  const len = Math.hypot(bx - ax, by - ay);
  if (len < 1) return;
  const ux = (bx - ax) / len, uy = (by - ay) / len;
  const head = Math.min(12, len * 0.4);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx - ux * head * 0.8, by - uy * head * 0.8);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(bx - ux * head - uy * head * 0.45, by - uy * head + ux * head * 0.45);
  ctx.lineTo(bx - ux * head + uy * head * 0.45, by - uy * head - ux * head * 0.45);
  ctx.closePath();
  ctx.fill();
  if (label) {
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText(label, bx + 6 + uy * 4, by - 6 - ux * 4);
  }
}

/**
 * Labels a dashed term such as "1.7v₁" at its midpoint, offset to one side so the text doesn't sit
 * on the line. A light halo keeps it readable over the grid and the span.
 */
function dashLabel(from: Vec, to: Vec, text: string, color: string, bold: boolean) {
  const [ax, ay] = project(from), [bx, by] = project(to);
  const len = Math.hypot(bx - ax, by - ay);
  if (len < 12) return;
  // The perpendicular pointing up-screen (or right, for a vertical line).
  let nx = -(by - ay) / len, ny = (bx - ax) / len;
  if (ny > 0 || (ny === 0 && nx < 0)) { nx = -nx; ny = -ny; }
  const mx = (ax + bx) / 2 + nx * 12, my = (ay + by) / 2 + ny * 12;
  ctx.font = `${bold ? 'bold ' : ''}13px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.strokeText(text, mx, my);
  ctx.fillStyle = color;
  ctx.fillText(text, mx, my);
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
}

function polygon(points: Vec[], fill: string, stroke?: string) {
  ctx.beginPath();
  points.forEach((p, i) => {
    const [x, y] = project(p);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

// ── Drawing ────────────────────────────────────────────────────────
// Everything is drawn inside the box from `lo` to `hi`, which holds the origin and every arrow.
// The box is centered on `center` with half-width `extent` (in ℝ², stretched along one axis to the
// canvas's shape). Both ease smoothly to fit the vectors; see "Axis scaling" below.
let lo: Vec = [-1, -1, -1];
let hi: Vec = [1, 1, 1];

/** A grid spacing of 1, 2, or 5 times a power of 10 that gives about 2 to 4 lines per half-width. */
function gridStep(E: number): number {
  const raw = E / 4;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  return [1, 2, 5, 10].map(m => m * p).find(step => step >= raw)!;
}

/** The multiples of `step` from `a` to `b`. */
function ticks(a: number, b: number, step: number): number[] {
  const out: number[] = [];
  for (let i = Math.ceil(a / step - 1e-9); i * step <= b + 1e-9; i++) out.push(i * step);
  return out;
}

/** Draws the grid on the plane z = 0 and the coordinate axes, all within the box. */
function drawGridAndAxes(gridColor: string) {
  const step = gridStep(extent);
  for (const t of ticks(lo[0], hi[0], step)) line([t, lo[1], 0], [t, hi[1], 0], gridColor);
  for (const t of ticks(lo[1], hi[1], step)) line([lo[0], t, 0], [hi[0], t, 0], gridColor);
  const names = ['x', 'y', 'z'];
  for (let k = 0; k < state.dim; k++) {
    const a: Vec = [0, 0, 0], b: Vec = [0, 0, 0];
    a[k] = lo[k];
    b[k] = hi[k];
    line(a, b, '#5f6368', state.dim === 2 ? 1.5 : 1.2);
    if (state.dim === 3) {
      const [x, y] = project(b);
      ctx.fillStyle = '#5f6368';
      ctx.font = 'italic 14px serif';
      ctx.fillText(names[k], x + 4, y - 4);
    }
  }
  // Label one grid line so the scale can be read as the axes change. Prefer the positive side.
  const t = hi[0] >= step ? step : -step;
  const [x, y] = project([t, 0, 0]);
  ctx.fillStyle = '#5f6368';
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(fmt(t), x, y + 13);
  ctx.textAlign = 'start';
}

/** The segment of the line through the origin along `d` that lies inside the box. */
function clipLine(d: Vec): [Vec, Vec] {
  let tMin = -Infinity, tMax = Infinity;
  for (let k = 0; k < state.dim; k++) {
    if (Math.abs(d[k]) < 1e-12) continue;
    const [t1, t2] = [lo[k] / d[k], hi[k] / d[k]].sort((m, n) => m - n);
    tMin = Math.max(tMin, t1);
    tMax = Math.min(tMax, t2);
  }
  return [scale(tMin, d), scale(tMax, d)];
}

/**
 * The polygon where the plane through the origin spanned by orthonormal `u`, `w` meets the box:
 * the plane's crossings of the box's 12 edges, sorted by angle around their centroid.
 */
function clipPlane(u: Vec, w: Vec): Vec[] {
  const n = cross(u, w);
  const points: Vec[] = [];
  for (let k = 0; k < 3; k++) {
    if (Math.abs(n[k]) < 1e-12) continue;
    // Edges parallel to axis k: each other coordinate is at its low or high bound.
    const [a, b] = [0, 1, 2].filter(j => j !== k);
    for (const sa of [lo[a], hi[a]]) for (const sb of [lo[b], hi[b]]) {
      const p: Vec = [0, 0, 0];
      p[a] = sa;
      p[b] = sb;
      p[k] = -(n[a] * sa + n[b] * sb) / n[k];
      if (p[k] >= lo[k] - 1e-9 && p[k] <= hi[k] + 1e-9) points.push(p);
    }
  }
  if (points.length === 0) return points;
  const mid = scale(1 / points.length, points.reduce(add));
  const angle = (p: Vec) => { const q = add(p, scale(-1, mid)); return Math.atan2(dot(q, w), dot(q, u)); };
  return points.sort((p, q) => angle(p) - angle(q));
}

/** The six faces of the box, as corner lists. */
function boxFaces(): Vec[][] {
  const c = (i: number, j: number, k: number): Vec => [[lo[0], hi[0]][i], [lo[1], hi[1]][j], [lo[2], hi[2]][k]];
  return [
    [c(0, 0, 0), c(1, 0, 0), c(1, 1, 0), c(0, 1, 0)],
    [c(0, 0, 1), c(1, 0, 1), c(1, 1, 1), c(0, 1, 1)],
    [c(0, 0, 0), c(1, 0, 0), c(1, 0, 1), c(0, 0, 1)],
    [c(0, 1, 0), c(1, 1, 0), c(1, 1, 1), c(0, 1, 1)],
    [c(0, 0, 0), c(0, 1, 0), c(0, 1, 1), c(0, 0, 1)],
    [c(1, 0, 0), c(1, 1, 0), c(1, 1, 1), c(1, 0, 1)],
  ];
}

function drawSpan(basis: Vec[]) {
  if (basis.length === 1) {
    const [from, to] = clipLine(basis[0]);
    line(from, to, SPAN_EDGE, 5);
  } else if (basis.length === 2 && state.dim === 3) {
    const [u, w] = basis;
    const outline = clipPlane(u, w);
    if (outline.length < 3) return;
    polygon(outline, SPAN_COLOR, SPAN_EDGE);
    // Grid lines on the plane, clipped to the outline.
    ctx.save();
    ctx.beginPath();
    outline.forEach((p, i) => {
      const [x, y] = project(p);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.clip();
    const R = Math.max(...outline.map(norm)), step = gridStep(extent) * 2;
    for (let t = -Math.floor(R / step) * step; t <= R; t += step) {
      line(add(scale(t, u), scale(-R, w)), add(scale(t, u), scale(R, w)), SPAN_GRID);
      line(add(scale(-R, u), scale(t, w)), add(scale(R, u), scale(t, w)), SPAN_GRID);
    }
    ctx.restore();
  } else if (basis.length === 2) {
    polygon([[lo[0], lo[1], 0], [hi[0], lo[1], 0], [hi[0], hi[1], 0], [lo[0], hi[1], 0]], SPAN_COLOR);
  } else if (basis.length === 3) {
    // All of ℝ³: shade the whole box.
    for (const f of boxFaces()) polygon(f, 'rgba(120, 140, 170, 0.08)', 'rgba(90, 110, 140, 0.5)');
  }
}

// ── Axis scaling ───────────────────────────────────────────────────
// The target box fits the origin and every arrow drawn (the vectors, each partial sum of the
// tip-to-tail path, and the result) with a small margin. While anything is being dragged, the
// target is frozen so the axes don't move under the pointer; when the drag ends, the box eases to
// the new target.
const MIN_EXTENT = 0.5; // Keeps the view finite when every vector is zero.
const MARGIN = 1.15;
let extent = 5;
let center: Vec = [0, 0, 0];
let extentFrame = 0;
let holdExtent = false;

function targetBox(): { center: Vec; extent: number } {
  const vs = activeVectors();
  const points: Vec[] = [[0, 0, 0], ...vs];
  let tip: Vec = [0, 0, 0];
  for (const i of addOrder()) {
    tip = add(tip, scale(state.coeffs[i], vs[i]));
    points.push(tip);
  }
  const mid: Vec = [0, 0, 0];
  let half = 0;
  for (let k = 0; k < state.dim; k++) {
    const a = Math.min(...points.map(p => p[k])), b = Math.max(...points.map(p => p[k]));
    mid[k] = (a + b) / 2;
    half = Math.max(half, (b - a) / 2);
  }
  // In 3D, the view can be rotated to any angle, so fit the sphere around the points rather than
  // their bounding box: its radius bounds how far any point can appear from the center on screen.
  if (state.dim === 3) half = Math.max(...points.map(p => norm(add(p, scale(-1, mid)))));
  return { center: mid, extent: Math.max(MIN_EXTENT, half * MARGIN) };
}

/** Starts easing the box toward its target, unless a drag is holding it. */
function updateExtent() {
  if (holdExtent || extentFrame) return;
  const near = (t: { center: Vec; extent: number }) =>
    Math.abs(t.extent - extent) < 1e-3 * t.extent
    && Math.max(...t.center.map((c, k) => Math.abs(c - center[k]))) < 1e-3 * t.extent;
  const step = (prev: number) => {
    extentFrame = requestAnimationFrame(now => {
      const target = targetBox();
      const dt = Math.min(50, now - prev);
      const k = 1 - Math.exp(-dt / 90);
      // Ease the size in log scale so growing and shrinking feel the same at any size.
      extent = Math.exp(Math.log(extent) + (Math.log(target.extent) - Math.log(extent)) * k);
      center = center.map((c, j) => c + (target.center[j] - c) * k) as Vec;
      const done = near(target) || holdExtent;
      if (done && !holdExtent) ({ extent, center } = target);
      renderAll();
      if (done) extentFrame = 0;
      else step(now);
    });
  };
  if (!near(targetBox())) step(performance.now());
}

/** Freezes the axes during a drag; releasing lets them ease to fit. */
function setHoldExtent(hold: boolean) {
  holdExtent = hold;
  if (!hold) updateExtent();
}

/** The camera orientation used by `project` for the canvas being drawn. */
let view = { yaw: state.yaw, pitch: state.pitch, perspective: false };

// Depth cues for the main 3D view, toggled in the settings.
const cues = { perspective: true, dropLines: true };

// Fixed views along the coordinate axes, shown beside the main view in 3D. Each keeps the
// right-hand rule: the third axis points toward the viewer.
const SIDE_VIEWS = [
  { id: 'span-view-top', yaw: 0, pitch: Math.PI / 2 },     // x right, y up, z toward viewer.
  { id: 'span-view-front', yaw: 0, pitch: 0 },             // x right, z up, y away.
  { id: 'span-view-side', yaw: -Math.PI / 2, pitch: 0 },   // y right, z up, x toward viewer.
].map(v => ({ ...v, canvas: $<HTMLCanvasElement>(v.id) }))
  // Skip any view whose canvas is missing (such as a cached copy of the page from before they existed).
  .filter(v => v.canvas);

/** Draws the scene onto `target` from the given view. Returns the tip of the linear combination. */
function render(target: HTMLCanvasElement, yaw: number, pitch: number, small: boolean): Vec {
  ctx = target.getContext('2d')!;
  // The side views look straight along an axis, so they stay orthographic.
  view = { yaw, pitch, perspective: !small && cues.perspective };
  const rect = target.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  target.width = Math.round(rect.width * dpr);
  target.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const w = rect.width, h = rect.height;
  ctx.clearRect(0, 0, w, h);
  // The plot goes in the middle of the space the coefficient box leaves open: either the strip to
  // its right or the strip below it, whichever fits a larger square. The side views have no box.
  let region = { x: 0, y: 0, w, h };
  const overlay = small ? null : document.querySelector<HTMLElement>('.span-overlay');
  // Only an overlay inside the plot takes up room there; on small screens it sits above the plot.
  if (overlay && overlay.offsetWidth > 0 && overlay.closest('.span-stage')) {
    const o = overlay.getBoundingClientRect();
    const right = { x: o.right - rect.left, y: 0, w: rect.right - o.right, h };
    const below = { x: 0, y: o.bottom - rect.top, w, h: rect.bottom - o.bottom };
    const best = [right, below].reduce((a, b) => (Math.min(b.w, b.h) > Math.min(a.w, a.h) ? b : a));
    // Avoid the box whenever the open strip is usable; only when it is really cramped (under a
    // third of the canvas) would the plot get too small, so then draw under the box instead.
    if (Math.min(best.w, best.h) > 0.33 * Math.min(w, h)) region = best;
  }
  cx = region.x + region.w / 2;
  cy = region.y + region.h / 2;
  const size = Math.min(region.w, region.h);
  if (state.dim === 2) {
    pxPerUnit = size / (2 * extent);
    // The grid still fills the whole canvas, out to its edges.
    lo = [center[0] - cx / pxPerUnit, center[1] - (h - cy) / pxPerUnit, 0];
    hi = [center[0] + (w - cx) / pxPerUnit, center[1] + cy / pxPerUnit, 0];
  } else {
    lo = center.map(c => c - extent) as Vec;
    hi = center.map(c => c + extent) as Vec;
    // Every vector lies within `extent` of the center, so it stays in view at any rotation. Only
    // perspective can push a point farther out, by at most CAMERA_DISTANCE / (CAMERA_DISTANCE − 1).
    // The shaded box's corners can still run off the canvas, which is fine.
    pxPerUnit = size / (2 * extent) * (cues.perspective ? (CAMERA_DISTANCE - 1) / CAMERA_DISTANCE : 1);
  }

  const vs = activeVectors();
  const basis = spanBasis(vs);

  if (state.dim === 2) {
    drawSpan(basis);
    drawGridAndAxes('rgba(128,128,128,0.25)');
  } else {
    drawGridAndAxes('rgba(128,128,128,0.18)');
    drawSpan(basis);
  }

  // The linear combination, drawn tip to tail.
  let tip: Vec = [0, 0, 0];
  addOrder().forEach(i => {
    const next = add(tip, scale(state.coeffs[i], vs[i]));
    if (!small) dashSegments.push({ i, from: tip, to: next });
    if (state.coeffs[i] === 0 && !small) {
      // A zero term is a small ring in its color, so it can be found and dragged out.
      const [px, py] = project(tip);
      ctx.strokeStyle = COLORS[i];
      ctx.lineWidth = highlighted === i ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.arc(px, py, highlighted === i ? 8 : 6, 0, 2 * Math.PI);
      ctx.stroke();
    }
    if (state.coeffs[i] !== 0) {
      if (highlighted === i) {
        // A wide translucent band under the highlighted term, then the term itself, thicker.
        ctx.globalAlpha = 0.25;
        line(tip, next, COLORS[i], small ? 6 : 12);
        ctx.globalAlpha = 1;
        arrow(tip, next, COLORS[i], small ? 2 : 3, undefined, [7, 4]);
      } else {
        arrow(tip, next, COLORS[i], small ? 1 : 1.5, undefined, [5, 4]);
      }
      if (!small) dashLabel(tip, next, `${fixed(state.coeffs[i])}v${'₁₂₃₄₅'[i]}`, COLORS[i], highlighted === i);
    }
    tip = next;
  });

  // Drop lines: a dotted line from each tip straight down (or up) to the plane z = 0, ending in a
  // small mark there, so the height and floor position of each vector can be read.
  if (state.dim === 3 && !small && cues.dropLines) {
    const tips: [Vec, string][] = [...vs.map((v, i): [Vec, string] => [v, COLORS[i]]), [tip, COMBO_COLOR]];
    for (const [t, color] of tips) {
      if (Math.abs(t[2]) < 1e-9) continue;
      const foot: Vec = [t[0], t[1], 0];
      ctx.globalAlpha = 0.6;
      line(t, foot, color, 1, [2, 3]);
      line([0, 0, 0], foot, color, 1, [2, 3]);
      const [fx, fy] = project(foot);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(fx, fy, 2.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  vs.forEach((v, i) => arrow([0, 0, 0], v, COLORS[i], small ? 2 : 3, small ? undefined : `v${'₁₂₃₄₅'[i]}`));
  arrow([0, 0, 0], tip, COMBO_COLOR, small ? 2.5 : 3.5);
  const [ox, oy] = project([0, 0, 0]);
  ctx.fillStyle = '#202124';
  ctx.beginPath();
  ctx.arc(ox, oy, small ? 2.5 : 3.5, 0, 2 * Math.PI);
  ctx.fill();
  return tip;
}

// The dashed terms cᵢvᵢ of the main view, as last drawn, for pointer hit-testing.
let dashSegments: { i: number; from: Vec; to: Vec }[] = [];
// The term highlighted in the plot: the one whose coefficient is being hovered or dragged.
let highlighted: number | null = null;
const hoverSources = { slider: null as number | null, canvas: null as number | null };

function setHover(source: keyof typeof hoverSources, i: number | null) {
  hoverSources[source] = i;
  // What the pointer is on in the plot wins over a coefficient row, which can stay highlighted
  // while its text field has focus.
  const next = (dragging?.kind === 'dash' ? dragging.i : null) ?? hoverSources.canvas ?? hoverSources.slider;
  if (next !== highlighted) {
    highlighted = next;
    draw();
  }
}

/** Redraws, and eases the axes toward the size that fits the vectors. */
function draw() {
  renderAll();
  saveState();
  updateExtent();
}

/** Draws every view at the current extent. */
function renderAll() {
  dashSegments = [];
  updateNullSliders();
  const sideViews = document.getElementById('span-side-panel');
  if (sideViews) sideViews.hidden = state.dim === 2;
  const cueBox = document.getElementById('span-cues');
  if (cueBox) cueBox.hidden = state.dim === 2;
  if (state.dim === 3) {
    for (const v of SIDE_VIEWS) render(v.canvas, v.yaw, v.pitch, true);
  }
  // The main view is drawn last so that the projection globals match it for pointer handling.
  const tip = render(canvas, state.yaw, state.pitch, false);
  const vs = activeVectors();
  updateSumBox(tip);
  updateMatrices(vs);
}

// ── Matrix, RREF, and basis ────────────────────────────────────────
// Below the plot: the matrix A = [v₁ ⋯ vₖ], its reduced row echelon form, and the basis of the
// span formed by the pivot columns of A. Pivot columns are highlighted in both matrices. Rebuilt
// only when the vectors change, since draw() runs on every animation frame.
let matrixKey = '';

/** Writes x as a fraction when it is one with a small denominator, and as a decimal otherwise. */
function fracText(x: number): string {
  for (let d = 1; d <= 12; d++) {
    const n = Math.round(x * d);
    if (Math.abs(n / d - x) < 1e-9) {
      const sign = n < 0 ? '−' : '';
      return d === 1 ? `${sign}${Math.abs(n)}` : `${sign}${Math.abs(n)}/${d}`;
    }
  }
  return fixed(x);
}

/**
 * A bracketed matrix as an HTML table. `ids` are the vector indices of the columns (for their
 * names and colors in the header) and `pivots` the column positions to highlight.
 */
function matrixHTML(
  cols: number[][], ids: number[], pivots: number[],
  // The header names each column by its vector (v) or, in the null-space section, its coefficient
  // (c); `highlightClass` marks the highlighted columns.
  opts: { letter?: 'v' | 'c'; highlightClass?: string } = {},
): string {
  const rows = cols[0]?.length ?? 0;
  const letter = opts.letter ?? 'v', cls = opts.highlightClass ?? 'span-pivot';
  const name = (id: number) => (letter === 'v' ? `v${SUB[id]}` : `<i>c</i>${SUB[id]}`);
  // The wrapper draws the square brackets below the header row.
  let html = '<span class="span-matwrap span-has-head"><table class="span-mat"><thead><tr>';
  html += ids.map((id, j) =>
    `<th class="${pivots.includes(j) ? cls : ''}" style="color:${COLORS[id]}">${name(id)}</th>`).join('');
  html += '</tr></thead><tbody>';
  for (let r = 0; r < rows; r++) {
    html += '<tr>' + cols.map((c, j) =>
      `<td class="${pivots.includes(j) ? cls : ''}">${fracText(c[r])}</td>`).join('') + '</tr>';
  }
  return html + '</tbody></table></span>';
}

function updateMatrices(vs: Vec[]) {
  const box = document.getElementById('span-matrices');
  if (!box || vs.length === 0) return;
  // The columns of A are the vectors in the order they are added, so dragging a vector reorders A.
  const ids = addOrder();
  const key = JSON.stringify([state.dim, vs, ids]);
  if (key === matrixKey) return;
  matrixKey = key;
  const ordered = ids.map(i => vs[i]);
  const { R, pivots } = rref(ordered);
  const A = ordered.map(v => v.slice(0, state.dim));
  const rCols = ordered.map((_, j) => R.map(row => row[j]));
  const pivotIds = pivots.map(j => ids[j]);

  const texNum = (x: number) => {
    const t = fracText(x).replace('−', '-');
    const [n, d] = t.split('/');
    return d ? `${n.startsWith('-') ? '-' : ''}\\tfrac{${n.replace('-', '')}}{${d}}` : t;
  };
  // MathJax's color package has no HTML model, so give the color as RGB values from 0 to 255.
  // \color colors everything after it, so each name is wrapped in its own group.
  const rgb = (hex: string) => [1, 3, 5].map(k => parseInt(hex.slice(k, k + 2), 16)).join(',');
  const name = (i: number) => `{\\color[RGB]{${rgb(COLORS[i])}}\\mathbf{v}_{${i + 1}}}`;

  // A = [v… v…] = (matrix) ∼ (RREF) = rref(A), as one equation: the TeX pieces sit between the
  // HTML tables, which keep their pivot highlighting.
  const lhs = `\\(A = \\begin{bmatrix} ${ids.map(name).join(' & ')} \\end{bmatrix} =\\)`;
  // The basis in TeX: {v…, …} = {[column], …}.
  const basis = `\\[ \\{ ${pivotIds.map(name).join(',\\, ')} \\} = \\left\\{ ${
    pivots.map(j => `\\begin{bmatrix}${A[j].map(texNum).join('\\\\')}\\end{bmatrix}`).join(',\\, ')} \\right\\} \\]`;
  box.innerHTML = `
    <div class="span-mat-row">
      <span class="span-mat-tex">${lhs}</span>
      ${matrixHTML(A, ids, pivots)}
      <span class="span-mat-tex">\\(\\sim\\)</span>
      ${matrixHTML(rCols, ids, pivots)}
      <span class="span-mat-tex">\\(= \\operatorname{rref}(A)\\)</span>
    </div>
    <p class="span-mat-note">The highlighted columns are the pivot columns.
      ${pivots.length === 0
        ? 'There are none, because every vector is zero, so the span is \\(\\{\\mathbf{0}\\}\\) and its basis is empty.'
        : `The matching columns of \\(A\\) (not of the RREF) form a basis for the span, which has dimension ${pivots.length}:`}
    </p>
    ${pivots.length ? `<div class="span-basis">${basis}</div>` : ''}
    ${pivots.length && pivots.length < vs.length
      ? `<p class="span-mat-note">Each other vector is a combination of \\(${pivotIds.map(name).join(', ')}\\), with coefficients read from its column of the RREF.
         Which vectors are pivots depends on the order of the columns, so dragging the vectors into a different order can give a different basis.</p>`
      : ''}`;
  void typeset([box]);
  updateNullSection(ids, R, pivots, texNum);
}

/**
 * The null space section: 𝒩(A) = {c : Ac = 0}, the coefficient vectors that combine the columns of
 * A to zero. Its basis has one vector per free (non-pivot) column, read from the RREF: that
 * column's coefficient is 1, the other free columns' are 0, and each pivot column's is minus the
 * RREF entry in its row.
 */
function updateNullSection(ids: number[], R: number[][], pivots: number[], texNum: (x: number) => string) {
  const box = document.getElementById('span-nullspace');
  if (!box) return;
  const k = ids.length, rank = pivots.length;
  const free = ids.map((_, j) => j).filter(j => !pivots.includes(j));
  const rgb = (hex: string) => [1, 3, 5].map(n => parseInt(hex.slice(n, n + 2), 16)).join(',');
  const cName = (i: number) => `{\\color[RGB]{${rgb(COLORS[i])}}c_{${i + 1}}}`;
  const basis = free.map(f => {
    const x = new Array(k).fill(0);
    x[f] = 1;
    pivots.forEach((pc, pr) => (x[pc] = -R[pr][f]));
    return x;
  });
  const cVec = `\\begin{bmatrix}${ids.map(cName).join('\\\\')}\\end{bmatrix}`;
  const intro = `<p>The <em>null space</em> of \\(A\\) is the set of coefficient vectors that combine the columns of \\(A\\) to zero:</p>
    <div class="span-tex">\\[ \\mathcal{N}(A) = \\left\\{ ${cVec} \\;\\middle|\\; ${ids.map(i => `${cName(i)}\\mathbf{v}_{${i + 1}}`).join(' + ')} = \\mathbf{0} \\right\\}. \\]</div>`;
  let body: string;
  if (free.length === 0) {
    body = `<p>Every column of \\(A\\) is a pivot column, so the only solution is all zero coefficients:</p>
      <div class="span-tex">\\[ \\mathcal{N}(A) = \\{\\mathbf{0}\\}. \\]</div>
      <p>This is what it means for the vectors to be linearly independent:
      each vector in the span is a combination of them in exactly one way.</p>`;
  } else {
    const cols = basis.map(x => `\\begin{bmatrix}${x.map(texNum).join('\\\\')}\\end{bmatrix}`).join(',\\, ');
    const freeNames = `\\(${free.map(j => cName(ids[j])).join(', ')}\\)`;
    const boundNames = `\\(${pivots.map(j => cName(ids[j])).join(', ')}\\)`;
    // rref(A) with its columns named by coefficient, the free (non-pivot) columns highlighted.
    const rCols = ids.map((_, j) => R.map(row => row[j]));
    const rrefTable = matrixHTML(rCols, ids, free, { letter: 'c', highlightClass: 'span-free' });
    const bmat = (entries: string[]) => `\\begin{bmatrix}${entries.join('\\\\')}\\end{bmatrix}`;

    /** A sum Σ aᵢ·nameᵢ in TeX, skipping zero terms and writing ±1 as a bare sign; 0 if empty. */
    const linear = (terms: [number, string][]) => {
      const parts = terms.filter(([a]) => Math.abs(a) > 1e-12).map(([a, name], n) => {
        const mag = Math.abs(Math.abs(a) - 1) < 1e-12 ? '' : texNum(Math.abs(a));
        const sign = a < 0 ? '-' : n === 0 ? '' : '+';
        return `${sign} ${mag}${name}`;
      });
      return parts.length ? parts.join(' ') : '0';
    };

    // Step 1: each nonzero row of the RREF is an equation with zero on the right.
    const system = pivots.map((pc, r) =>
      `${linear([[1, cName(ids[pc])], ...free.map((fj): [number, string] => [R[r][fj], cName(ids[fj])])])} &= 0`,
    ).join(' \\\\ ');
    // Step 2: solved for the pivot (bound) coefficients in terms of the free ones.
    const pivotExpr = (r: number) => linear(free.map((fj): [number, string] => [-R[r][fj], cName(ids[fj])]));
    const equations = pivots.map((pc, r) => `${cName(ids[pc])} &= ${pivotExpr(r)}`).join(' \\\\ ');
    // Steps 3–4: c, with each bound coefficient replaced, then split by free coefficient.
    const substituted = ids.map((_, j) => {
      const r = pivots.indexOf(j);
      return r >= 0 ? pivotExpr(r) : cName(ids[j]);
    });
    const combination = free.map((fj, n) => `${cName(ids[fj])} ${bmat(basis[n].map(texNum))}`).join(' + ');

    body = `<p>Solving \\(A\\mathbf{c} = \\mathbf{0}\\) is the same as solving \\(\\operatorname{rref}(A)\\,\\mathbf{c} = \\mathbf{0}\\).
      Its non-pivot columns, highlighted here, belong to the <em>free coefficients</em> ${freeNames}, which can be any real number.
      The other coefficients, ${boundNames}, are <em>bound</em>: they are determined by the free ones.</p>
      <div class="span-mat-row">
        <span class="span-mat-tex">\\(\\operatorname{rref}(A) =\\)</span>${rrefTable}
      </div>
      <p>Each nonzero row of \\(\\operatorname{rref}(A)\\) is one equation:</p>
      <div class="span-tex">\\[ \\left\\{ \\begin{aligned} ${system} \\end{aligned} \\right. \\]</div>
      <p>Solve each equation for its bound coefficient, in terms of the free coefficients:</p>
      <div class="span-tex">\\[ \\left\\{ \\begin{aligned} ${equations} \\end{aligned} \\right. \\]</div>
      <p>Substitute these into \\(\\mathbf{c}\\), then split it into one vector for each free coefficient:</p>
      <div class="span-tex">\\[ \\mathbf{c} = ${cVec} = ${bmat(substituted)} = ${combination}. \\]</div>
      <p>Every vector in the null space is a combination of these vectors, with the free coefficients as weights, so they form a basis:</p>
      <div class="span-tex">\\[ \\mathcal{N}(A)
        = \\left\\{ ${combination} \\;\\middle|\\; ${free.map(fj => cName(ids[fj])).join(', ')} \\in \\mathbb{R} \\right\\}
        = \\operatorname{span}\\left\\{ ${cols} \\right\\}, \\]</div>
      <p>where each entry is the coefficient of the matching column of \\(A\\).
      Its dimension is ${free.length}, and the rank–nullity theorem says
      \\(\\operatorname{rank}(A) + \\operatorname{nullity}(A) = ${rank} + ${free.length} = ${k}\\), the number of vectors.</p>
      <p>Adding any vector in \\(\\mathcal{N}(A)\\) to the coefficients changes the tip-to-tail path but not where it ends.
      The \\(t\\) slider${free.length > 1 ? 's' : ''} on the plot move${free.length > 1 ? '' : 's'} the coefficients along ${free.length > 1 ? 'these directions' : 'this direction'}.</p>`;
  }
  box.innerHTML = intro + body;
  void typeset([box]);
}

// ── Text readout ───────────────────────────────────────────────────
/**
 * Always two decimal places (with a true minus sign), for numbers that change while something is
 * dragged, so their width doesn't chatter. Values that round to zero show as 0.00, not −0.00.
 */
const fixed = (x: number) => (Math.abs(x) < 0.005 ? 0 : x).toFixed(2).replace('-', '−');
/** The same, with an ASCII hyphen, for <input> values. */
const fixedInput = (x: number) => fixed(x).replace('−', '-');

const fmt = (x: number) => {
  const r = Math.round(x * 100) / 100;
  return (Object.is(r, -0) ? 0 : r).toString().replace('-', '−');
};

/** Writes v = c₁v₁ + ⋯ = [result] in the coefficient box. */
function updateSumBox(tip: Vec) {

  // In the coefficient box: v = c₁v₁ + ⋯ = [the result as a column], with each term in its
  // vector's color and the terms in the order they are added.
  const sumBox = document.getElementById('span-sum');
  if (sumBox) {
    const symbolic = addOrder().map(i =>
      `<span style="color:${COLORS[i]}"><i>c</i>${SUB[i]}<b>v</b>${SUB[i]}</span>`).join('\u2009+\u2009'); // Thin spaces keep the line short.
    const column = tip.slice(0, state.dim).map(x => `<span>${fixed(x)}</span>`).join('');
    // Two grid rows, so the equals signs line up: "v | = terms" over " | = column".
    sumBox.innerHTML = `<span class="span-sum-lhs"><b>v</b></span><span>=</span><span class="span-sum-terms">${symbolic}</span>`
      + `<span></span><span>=</span><span class="span-colvec">${column}</span>`;
  }
}

// ── Controls ───────────────────────────────────────────────────────
const SUB = '₁₂₃₄₅';

/** Builds the vector entries (as bracketed column vectors) and the coefficient overlay. */
function buildInputs() {
  const box = $('span-vectors');
  box.innerHTML = '';
  for (const i of addOrder()) {
    const col = document.createElement('div');
    col.className = 'span-vec';
    // Only the inner body moves while dragging, so the column boxes give fixed slot positions.
    const body = document.createElement('div');
    body.className = 'span-vec-body';
    col.appendChild(body);
    col.dataset.index = String(i);
    const handle = document.createElement('button');
    handle.type = 'button';
    handle.className = 'span-handle';
    // The handle only works by dragging, so Tab skips it and goes straight to the entries.
    handle.tabIndex = -1;
    handle.title = 'Drag to change the order the vectors are added';
    handle.setAttribute('aria-label', `Reorder v${i + 1}`);
    handle.textContent = '⠿';
    body.appendChild(handle);
    const label = document.createElement('span');
    label.className = 'span-name';
    label.style.color = COLORS[i];
    label.textContent = `v${SUB[i]} =`;
    const bracket = document.createElement('div');
    bracket.className = 'span-bracket';
    bracket.style.setProperty('--vec-color', COLORS[i]);
    for (let k = 0; k < state.dim; k++) {
      const input = document.createElement('input');
      input.type = 'number';
      input.step = '0.5';
      input.value = fixedInput(state.vectors[i][k]);
      input.setAttribute('aria-label', `v${i + 1} component ${k + 1}`);
      input.dataset.i = String(i);
      input.dataset.k = String(k);
      input.addEventListener('input', () => {
        const x = parseFloat(input.value);
        if (Number.isFinite(x)) {
          state.vectors[i][k] = x;
          saveUrl();
          draw();
        }
      });
      bracket.appendChild(input);
    }
    body.append(label, bracket);
    box.appendChild(col);
    enableDragReorder({
      list: box,
      item: col,
      handle,
      axis: 'wrap',
      bodyOf: other => other.querySelector<HTMLElement>('.span-vec-body')!,
      draggingClass: 'span-dragging',
      // Compare with the current order, not with `changed`: the data-index values are vector
      // numbers, so `changed` only says whether the new order differs from v₁, v₂, v₃.
      onEnd: order => {
        if (order.every((i, k) => i === addOrder()[k])) return;
        state.order = [...order, ...state.order.filter(j => !order.includes(j))];
        saveUrl();
        buildInputs();
        draw();
      },
    });
  }

  // Each coefficient has a text field and a slider that stay in sync. The text field accepts any
  // number; the slider covers −3 to 3.
  const overlay = $('span-coeffs');
  overlay.innerHTML = '';
  for (const i of addOrder()) {
    const row = document.createElement('label');
    row.className = 'span-coeff';
    row.dataset.i = String(i);
    const name = document.createElement('span');
    name.style.color = COLORS[i];
    name.textContent = `c${SUB[i]}`;
    const text = document.createElement('input');
    text.type = 'text';
    text.inputMode = 'decimal';
    text.value = fixedInput(state.coeffs[i]);
    text.setAttribute('aria-label', `coefficient c${i + 1}`);
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '-3';
    slider.max = '3';
    slider.step = '0.05';
    slider.value = String(state.coeffs[i]);
    slider.tabIndex = -1;
    text.addEventListener('input', () => {
      const x = parseFloat(text.value.replace('−', '-'));
      if (!Number.isFinite(x)) return;
      state.coeffs[i] = x;
      slider.value = String(x);
      draw();
    });
    text.addEventListener('change', () => (text.value = fixedInput(state.coeffs[i])));
    slider.addEventListener('input', () => {
      state.coeffs[i] = parseFloat(slider.value);
      setHover('slider', i);
      text.value = fixedInput(state.coeffs[i]);
      draw();
    });
    row.append(name, text, slider);
    // Highlight cᵢvᵢ while the row is hovered, while its slider is held (even if the pointer
    // wanders off the row), or while it has keyboard focus.
    row.addEventListener('pointerenter', () => setHover('slider', i));
    row.addEventListener('pointerleave', e => {
      if (e.buttons === 0) setHover('slider', null);
      else window.addEventListener('pointerup', () => setHover('slider', null), { once: true });
    });
    row.addEventListener('focusin', e => {
      if ((e.target as HTMLElement).matches(':focus-visible')) setHover('slider', i);
    });
    row.addEventListener('focusout', () => setHover('slider', null));
    overlay.appendChild(row);
  }
  nullKey = '';
  updateNullSliders();
}

/** Writes the coefficients into their text fields and sliders, except the field being typed in. */
function syncCoeffInputs() {
  document.querySelectorAll<HTMLElement>('#span-coeffs .span-coeff[data-i]').forEach(row => {
    const i = Number(row.dataset.i);
    const text = row.querySelector<HTMLInputElement>('input[type=text]')!;
    if (document.activeElement !== text) text.value = fixedInput(state.coeffs[i]);
    row.querySelector<HTMLInputElement>('input[type=range]')!.value = String(state.coeffs[i]);
  });
}

// ── Null-space sliders ─────────────────────────────────────────────
// When the vectors are dependent, each degree of freedom in the coefficients gets a slider. Moving
// it adds a multiple of a null-space vector to the coefficients, which changes the tip-to-tail path
// but not the resulting vector. The sliders are rebuilt only when the null space changes.
let nullKey = '';

function updateNullSliders() {
  const box = $('span-null');
  const vs = activeVectors();
  const basis = nullSpace(vs);
  const key = JSON.stringify(basis.map(b => b.map(x => x.toFixed(6))));
  if (key === nullKey) return;
  nullKey = key;
  box.innerHTML = '';
  if (basis.length === 0) return;
  const title = document.createElement('div');
  title.className = 'span-null-title';
  title.textContent = basis.length === 1
    ? 'Same result, different coefficients:'
    : `Same result, different coefficients (${basis.length} degrees of freedom):`;
  box.appendChild(title);
  basis.forEach((n, j) => {
    const row = document.createElement('label');
    row.className = 'span-coeff';
    const name = document.createElement('span');
    name.textContent = `t${SUB[j]}`;
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '-3';
    slider.max = '3';
    slider.step = '0.05';
    slider.value = '0';
    slider.setAttribute('aria-label', `null-space direction ${j + 1}`);
    // The direction is shown on hover rather than as text, to keep the box narrow.
    row.title = 'Each unit of this slider changes the coefficients by ('
      + addOrder().map(i => fmt(n[i])).join(', ') + '), in the order they are added';
    let last = 0;
    slider.addEventListener('input', () => {
      const t = parseFloat(slider.value);
      n.forEach((x, i) => (state.coeffs[i] += (t - last) * x));
      last = t;
      syncCoeffInputs();
      draw();
    });
    row.append(name, slider);
    box.appendChild(row);
  });
}

function syncInputs() {
  document.querySelectorAll<HTMLInputElement>('#span-vectors input[type=number]').forEach(input => {
    const i = Number(input.dataset.i), k = Number(input.dataset.k);
    if (document.activeElement !== input) input.value = fixedInput(state.vectors[i][k]);
  });
}

function setControls() {
  $<HTMLSelectElement>('span-dim').value = String(state.dim);
  $<HTMLSelectElement>('span-count').value = String(state.count);
  buildInputs();
}

const PRESETS: Record<string, { dim: 2 | 3; vectors: Vec[]; count: number }> = {
  'line2': { dim: 2, count: 2, vectors: [[2, 1, 0], [-4, -2, 0], [1, 3, 1]] },
  'plane2': { dim: 2, count: 2, vectors: [[2, 1, 0], [-1, 2, 0], [1, 3, 1]] },
  'line3': { dim: 3, count: 2, vectors: [[1, 2, 1], [-2, -4, -2], [1, 3, 1]] },
  'plane3': { dim: 3, count: 2, vectors: [[2, 1, 0], [-1, 2, 1], [1, 3, 1]] },
  'dep3': { dim: 3, count: 3, vectors: [[2, 1, 0], [-1, 2, 1], [1, 3, 1]] },
  // v₃ = v₁ + v₂ and v₄ = v₁ − v₂, so all four lie in the plane spanned by v₁ and v₂.
  'dep4': { dim: 3, count: 4, vectors: [[2, 1, 0], [-1, 2, 1], [1, 3, 1], [3, -1, -1]] },
  'space3': { dim: 3, count: 3, vectors: [[2, 0, 0], [0, 2, 0], [1, 1, 2]] },
};

// Depth-cue toggles, remembered in this browser.
const CUES_KEY = 'vector_span_depth_cues';
Object.assign(cues, loadJSON<Partial<typeof cues>>(CUES_KEY) ?? {});
for (const [id, cue] of [['span-perspective', 'perspective'], ['span-droplines', 'dropLines']] as const) {
  const box = $<HTMLInputElement>(id);
  box.checked = cues[cue];
  box.addEventListener('change', () => {
    cues[cue] = box.checked;
    saveJSON(CUES_KEY, cues);
    draw();
  });
}

$('span-dim').addEventListener('change', e => {
  state.dim = Number((e.target as HTMLSelectElement).value) as 2 | 3;
  setControls();
  saveUrl();
  draw();
});
$('span-count').addEventListener('change', e => {
  state.count = Number((e.target as HTMLSelectElement).value);
  state.order = [...addOrder(), ...ALL.filter(j => !addOrder().includes(j))];
  setControls();
  saveUrl();
  draw();
});
// The Example menu loads a preset, then returns to its "Examples" prompt so the same
// example can be chosen again.
const exampleMenu = $<HTMLSelectElement>('span-example');
exampleMenu.addEventListener('change', () => {
  const p = PRESETS[exampleMenu.value];
  exampleMenu.value = '';
  if (!p) return;
  state.dim = p.dim;
  state.count = p.count;
  // Presets list only the vectors they use; the rest keep their current values.
  p.vectors.forEach((v, i) => (state.vectors[i] = [...v] as Vec));
  // Coefficients of 1.5 rather than 1, so the scaling of each vector is easy to see.
  state.coeffs = [1.5, 1.5, 0, 0, 0];
  state.order = [...ALL];
  setControls();
  saveUrl();
  draw();
});

// ── Pointer interaction ────────────────────────────────────────────
let dragging:
  | { kind: 'tip'; i: number }
  | { kind: 'dash'; i: number; x: number; y: number; c: number }
  | { kind: 'rotate'; x: number; y: number; t: number }
  | null = null;

/** The dashed term cᵢvᵢ within reach of the canvas point (x, y), if any. */
/** The fewest on-screen pixels that count as one unit of a coefficient when dragging. */
const MIN_DRAG_LENGTH = 40;

function dashAt(x: number, y: number): number | null {
  // A term with coefficient 0 has no length, so it can only be grabbed at its point; give it
  // priority there over longer arrows that pass through the same point.
  for (const seg of dashSegments) {
    if (state.coeffs[seg.i] !== 0) continue;
    const [ax, ay] = project(seg.from);
    if (Math.hypot(ax - x, ay - y) < 12) return seg.i;
  }
  let best: number | null = null, bestD = 10;
  for (const seg of dashSegments) {
    const [ax, ay] = project(seg.from), [bx, by] = project(seg.to);
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
    const t = len2 > 0 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len2)) : 0;
    const d = Math.hypot(ax + t * dx - x, ay + t * dy - y);
    if (d < bestD) { bestD = d; best = seg.i; }
  }
  return best;
}

/** The 2D vector whose tip is within reach of (x, y), if any. */
// A finger is less precise than a mouse, so touches get a larger target around each vector tip.
let touchInput = false;

function tipAt(x: number, y: number): number | null {
  if (state.dim !== 2) return null;
  let best: number | null = null, bestD = touchInput ? 30 : 18;
  activeVectors().forEach((v, i) => {
    const [px, py] = project(v);
    const d = Math.hypot(px - x, py - y);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}

function pointerPos(e: PointerEvent): [number, number] {
  const r = canvas.getBoundingClientRect();
  return [e.clientX - r.left, e.clientY - r.top];
}

canvas.addEventListener('pointerdown', e => {
  touchInput = e.pointerType === 'touch';
  const [x, y] = pointerPos(e);
  cancelAnimationFrame(spinFrame);
  spinFrame = 0;
  // Vector tips take priority, then the dashed terms; anywhere else rotates the 3D view.
  const tipI = tipAt(x, y);
  const dashI = tipI === null ? dashAt(x, y) : null;
  if (tipI !== null) {
    dragging = { kind: 'tip', i: tipI };
  } else if (dashI !== null) {
    dragging = { kind: 'dash', i: dashI, x, y, c: state.coeffs[dashI] };
    setHover('canvas', dashI);
  } else if (state.dim === 3) {
    dragging = { kind: 'rotate', x, y, t: performance.now() };
    spin.yaw = spin.pitch = 0;
  } else {
    return;
  }
  canvas.style.cursor = 'grabbing';
  if (dragging.kind !== 'rotate') setHoldExtent(true);
  canvas.setPointerCapture(e.pointerId);
  e.preventDefault();
});

canvas.addEventListener('pointermove', e => {
  const [x, y] = pointerPos(e);
  if (!dragging) {
    const dashI = tipAt(x, y) === null ? dashAt(x, y) : null;
    setHover('canvas', dashI);
    canvas.style.cursor = tipAt(x, y) !== null || dashI !== null || state.dim === 3 ? 'grab' : 'default';
    return;
  }
  if (dragging.kind === 'dash') {
    // Moving the pointer along vᵢ's on-screen direction changes cᵢ; one length of vᵢ is 1.
    const i = dragging.i;
    const [ox, oy] = project([0, 0, 0]);
    const [vx, vy] = project(activeVectors()[i]);
    const sx = vx - ox, sy = vy - oy;
    // A vector that is short on screen would make each pixel change cᵢ by a lot (on a phone, a
    // finger's sweep could add dozens), so treat it as at least MIN_DRAG_LENGTH pixels long.
    const len = Math.hypot(sx, sy);
    if (len > 0.5) {
      const along = ((x - dragging.x) * sx + (y - dragging.y) * sy) / len;
      const c = dragging.c + along / Math.max(len, MIN_DRAG_LENGTH);
      state.coeffs[i] = Math.round(c * 20) / 20;
      syncCoeffInputs();
    }
    draw();
    return;
  }
  if (dragging.kind === 'tip') {
    // Snap to tenths. Dividing by 10 (not multiplying by 0.1) keeps values like 0.3 exact.
    const snap = (t: number) => Math.round(t * 10) / 10;
    const wx = Math.max(lo[0], Math.min(hi[0], snap((x - cx) / pxPerUnit + center[0])));
    const wy = Math.max(lo[1], Math.min(hi[1], snap((cy - y) / pxPerUnit + center[1])));
    state.vectors[dragging.i][0] = wx;
    state.vectors[dragging.i][1] = wy;
    syncInputs();
  } else {
    const now = performance.now();
    const dt = Math.max(1, now - dragging.t);
    const dyaw = (x - dragging.x) * 0.01, dpitch = (y - dragging.y) * 0.01;
    // Smooth the angular velocity (radians per millisecond) so a fling uses the recent motion.
    spin.yaw = 0.6 * (dyaw / dt) + 0.4 * spin.yaw;
    spin.pitch = 0.6 * (dpitch / dt) + 0.4 * spin.pitch;
    rotateBy(dyaw, dpitch);
    dragging.x = x;
    dragging.y = y;
    dragging.t = now;
  }
  draw();
});

// ── Momentum ───────────────────────────────────────────────────────
// After a fling, the view keeps rotating with the release velocity until the canvas is touched again.
const spin = { yaw: 0, pitch: 0 }; // Radians per millisecond.
let spinFrame = 0;

function rotateBy(dyaw: number, dpitch: number) {
  state.yaw += dyaw;
  state.pitch = Math.max(-1.5, Math.min(1.5, state.pitch + dpitch));
}

function coast(prev: number) {
  spinFrame = requestAnimationFrame(now => {
    const dt = Math.min(50, now - prev);
    rotateBy(spin.yaw * dt, spin.pitch * dt);
    // Stop pitching at the limits instead of pushing against them.
    if (Math.abs(state.pitch) >= 1.5) spin.pitch = 0;
    draw();
    if (Math.hypot(spin.yaw, spin.pitch) > 2e-5) coast(now);
    else spinFrame = 0;
  });
}

const endDrag = (e: PointerEvent) => {
  canvas.style.cursor = 'grab';
  if (dragging && dragging.kind !== 'rotate') setHoldExtent(false);
  if (dragging?.kind === 'dash') {
    dragging = null;
    setHover('canvas', null);
    return;
  }
  if (dragging?.kind === 'tip') saveUrl();
  if (dragging?.kind === 'rotate') {
    // A pause before release means the pointer was held still, so no fling.
    if (performance.now() - dragging.t > 80) spin.yaw = spin.pitch = 0;
    if (e.type === 'pointerup' && Math.hypot(spin.yaw, spin.pitch) > 1e-4) coast(performance.now());
  }
  dragging = null;
};
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
// While something on the plot is being dragged, keep the browser from also scrolling the page.
// (touch-action: none covers most browsers; this also covers ones that ignore it.)
canvas.addEventListener('touchmove', e => { if (dragging) e.preventDefault(); }, { passive: false });

// ── URL state ──────────────────────────────────────────────────────
// The URL stores the dimension, one parameter per vector, and the addition order when it isn't the
// default, written out by hand so that commas stay readable instead of becoming %2C:
//   ?dim=3&v1=2,1,0&v2=-1,2,1&order=21
// The number of vectors is the number of v parameters. (Links from before used v=2,1,0;-1,2,1.)
function saveUrl() {
  const parts = [`dim=${state.dim}`];
  state.vectors.slice(0, state.count).forEach((v, i) => parts.push(`v${i + 1}=${v.slice(0, state.dim).join(',')}`));
  const order = addOrder();
  if (order.some((i, k) => i !== k)) parts.push(`order=${order.map(i => i + 1).join('')}`);
  history.replaceState(null, '', `${location.pathname}?${parts.join('&')}`);
}

function loadUrl() {
  const params = new URLSearchParams(location.search);
  const dim = params.get('dim');
  if (dim === '2' || dim === '3') state.dim = Number(dim) as 2 | 3;
  const toVec = (text: string): Vec => {
    const nums = text.split(',').map(Number);
    return [nums[0] || 0, nums[1] || 0, nums[2] || 0];
  };
  const named: Vec[] = [];
  for (let i = 1; i <= MAX_VECTORS && params.has(`v${i}`); i++) named.push(toVec(params.get(`v${i}`)!));
  if (named.length > 0) {
    state.count = named.length;
    named.forEach((p, i) => (state.vectors[i] = p));
  }
  const v = params.get('v');
  if (v && named.length === 0) {
    const parsed = v.split(';').slice(0, MAX_VECTORS).map(s => {
      const nums = s.split(',').map(Number);
      return [nums[0] || 0, nums[1] || 0, nums[2] || 0] as Vec;
    });
    if (parsed.length > 0) {
      state.count = parsed.length;
      parsed.forEach((p, i) => (state.vectors[i] = p));
    }
  }
  // &order=213 adds v₂, then v₁, then v₃.
  const order = (params.get('order') ?? '').split('').map(d => Number(d) - 1);
  if (order.length === state.count && [...new Set(order)].length === order.length
      && order.every(i => i >= 0 && i < state.count)) {
    state.order = [...order, ...ALL.filter(j => !order.includes(j))];
  }
}

// ── Pinning ────────────────────────────────────────────────────────
// The settings, the plot, and the side views each have the same pin button as the other tools
// (see common/panels.ts). Which ones are pinned is saved in this browser.
const PIN_KEY = 'vector_span_pinned_panels_v2'; // v2: the coefficient panel was added.
// ── Coefficients on small screens ──────────────────────────────────
// On a wide screen the coefficient box floats over the plot. On a small one it would cover most of
// the plot, so it moves into its own panel above the plot, which can be pinned like the others.
const SMALL_SCREEN = window.matchMedia('(max-width: 700px)');
function placeCoefficients() {
  const overlay = document.querySelector<HTMLElement>('.span-overlay')!;
  const panel = $('span-coeff-panel');
  const home = SMALL_SCREEN.matches ? $('span-coeff-slot') : document.querySelector<HTMLElement>('.span-stage')!;
  if (overlay.parentElement !== home) home.appendChild(overlay);
  panel.hidden = !SMALL_SCREEN.matches;
  draw();
}
SMALL_SCREEN.addEventListener('change', placeCoefficients);

const panels = setupPanels('vs', () =>
  saveJSON(PIN_KEY, panels.list.map((panel, i) => (panels.isPinned(panel) ? i : -1)).filter(i => i >= 0)));
const savedPins = loadJSON<number[]>(PIN_KEY);
if (Array.isArray(savedPins)) {
  for (const i of savedPins) if (panels.list[i]) panels.setPinned(panels.list[i], true);
} else if (loadString('vector_span_pinned') === '1') {
  panels.setPinned(panels.list[0], true); // Saved by an earlier version, which pinned only the settings.
}

// Sliders are dragged too, so the axes also hold still while one is held.
document.querySelector('.span-stage')!.addEventListener('pointerdown', e => {
  if (!(e.target as HTMLElement).matches('input[type=range]')) return;
  setHoldExtent(true);
  window.addEventListener('pointerup', () => setHoldExtent(false), { once: true });
  window.addEventListener('pointercancel', () => setHoldExtent(false), { once: true });
});

// ── Saved state ────────────────────────────────────────────────────
// The plot (vectors, coefficients, order, and view angle) is saved in this browser and restored on
// the next visit. A link's ?dim=, ?v=, and ?order= then override those parts of the saved state.
const STATE_KEY = 'vector_span_state';
let saveTimer = 0;

function saveState() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => saveJSON(STATE_KEY, {
    dim: state.dim, count: state.count, order: state.order, vectors: state.vectors,
    coeffs: state.coeffs, yaw: state.yaw, pitch: state.pitch,
  }), 300);
}

function loadState() {
  const saved = loadJSON<Partial<typeof state>>(STATE_KEY);
  if (!saved) return;
  const isNums = (a: unknown, n: number) =>
    Array.isArray(a) && a.length === n && a.every(x => typeof x === 'number' && Number.isFinite(x));
  if (saved.dim === 2 || saved.dim === 3) state.dim = saved.dim;
  if (typeof saved.count === 'number' && saved.count >= 1 && saved.count <= MAX_VECTORS) state.count = saved.count;
  if (Array.isArray(saved.vectors) && saved.vectors.length === MAX_VECTORS && saved.vectors.every(v => isNums(v, 3))) {
    state.vectors = saved.vectors.map(v => [...v] as Vec);
  }
  if (isNums(saved.coeffs, MAX_VECTORS)) state.coeffs = [...saved.coeffs!];
  if (isNums(saved.order, MAX_VECTORS) && [...new Set(saved.order)].length === MAX_VECTORS
      && saved.order!.every(i => ALL.includes(i))) state.order = [...saved.order!];
  if (typeof saved.yaw === 'number' && Number.isFinite(saved.yaw)) state.yaw = saved.yaw;
  if (typeof saved.pitch === 'number' && Math.abs(saved.pitch) <= 1.5) state.pitch = saved.pitch;
}

loadState();
loadUrl();
setControls();
({ extent, center } = targetBox()); // Start at the right size instead of easing to it.
draw();
const resizer = new ResizeObserver(() => draw());
resizer.observe(canvas);
// The plot is centered beside the coefficient box, so refit when the box changes size.
resizer.observe(document.querySelector('.span-overlay')!);
placeCoefficients();
SIDE_VIEWS.forEach(v => resizer.observe(v.canvas));
