import { mathHTML, typeset } from './common/mathjax';
import { setupPanels } from './common/panels';
import { setupHelp } from './common/help';
import { loadJSON, saveJSON } from './common/storage';
import {
  EasedBox, PlotLabel, OKABE_ITO, redrawOnMathLabels, Rotator, SIDE_VIEW_ANGLES, Scene, Vec3, add3, fitBox, gridStep, norm3,
  orthonormalBasis, scale3, sub3, tickLabel, ticks, toVec3,
} from './common/scene3d';
import { Fraction, div, equals, formatFraction, isZero, parseEntry, reduce } from './matrix/fraction';
import {
  FMat, FVec, ZERO, clearDenominators, fadd, fdot, fscale, fsub, isZeroVec, rref, toNumber,
} from './matrix/linalg';

// ╭───────────────────────────────────────────────────────────────╮
// │              Projections and least squares                    │
// ╰───────────────────────────────────────────────────────────────╯
// Three problems that are one idea seen three ways:
//   • Projection: the closest point proj_W x in a subspace W = span{v₁, …, v_k} to a vector x.
//   • Least squares: an x* that makes Ax* as close as possible to b. Ax* is the projection of b
//     onto the column space of A, and x* solves the normal equation AᵀAx = Aᵀb.
//   • Curve fitting: the polynomial whose values at the data's x's are closest to the data's y's,
//     which is a least squares problem with one row per data point.
//
// Projection and least squares problems in ℝ² and ℝ³ are drawn with the 3D view of the
// span-of-vectors tool (common/scene3d.ts): drag to rotate, fling to spin, and in ℝ² drag the tips
// of the vectors. Below the plot, the calculations are shown step by step in exact fractions,
// following the methods from lecture: the projection formula, Gram–Schmidt for a basis that isn't
// orthogonal, and the normal equation.

type Mode = 'proj' | 'lsq' | 'fit';

declare global {
  interface Window { GAUSSIAN_PRACTICE_URL?: string }
}

const MAX_SPAN = 3;     // Spanning vectors in projection problems
const MAX_ROWS = 6;     // Rows of A
const MAX_COLS = 4;     // Columns of A
const MAX_POINTS = 12;  // Data points
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sub = (k: number) => [...String(k)].map(d => SUB[Number(d)]).join('');

// Okabe–Ito colors: the spanning vectors (or columns of A) are blue, bluish green, sky blue, and
// orange; the projection is vermillion and the residual (the orthogonal component) reddish purple.
// The target vector is black. Yellow is skipped: it is hard to see on white.
const COL_COLORS = [OKABE_ITO.blue, OKABE_ITO.bluishGreen, OKABE_ITO.skyBlue, OKABE_ITO.orange];
const TARGET_COLOR = '#000000';
const PROJ_COLOR = OKABE_ITO.vermillion;
const RESID_COLOR = OKABE_ITO.reddishPurple;
const CAND_COLOR = '#80868b';
// Curve fitting: the data points are black, the fitted curve blue, and the residuals reddish purple,
// as in the other modes, with their squares shaded the same color.
const FIT_COLOR = OKABE_ITO.blue;

const state = {
  mode: 'proj' as Mode,
  // Projection: x onto span{v₁, …, v_count} in ℝ^dim. Entries are kept as typed, such as "1/3".
  dim: 3 as 2 | 3,
  count: 2,
  vs: [['1', '0', '1'], ['1', '1', '0'], ['0', '1', '1']],
  x: ['1', '2', '3'],
  // Least squares: A is m × n, b is in ℝᵐ. The arrays are full size, so shrinking and growing A
  // keeps the entries.
  m: 3,
  n: 2,
  A: [['4', '0', '0', '0'], ['0', '2', '0', '0'], ['1', '1', '0', '0'], ['0', '0', '0', '0'], ['0', '0', '0', '0'], ['0', '0', '0', '0']],
  b: ['2', '0', '11', '0', '0', '0'],
  // Curve fitting: a polynomial of this degree through these (x, y) points.
  degree: 1,
  pts: [['3', '0'], ['1', '8'], ['-1', '-8']],
  yaw: -0.6,
  pitch: 0.45,
  compare: false,
  squares: true,
};
// Depth cues for the 3D view, remembered in this browser, as in the span tool.
const cues = { perspective: true, dropLines: true };
// The coefficients of the comparison point (not saved).
let cand: number[] = [0.5, 0.5, 0, 0];

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const canvas = $<HTMLCanvasElement>('pl-canvas');

// ╭───────────────────────────────────────────────────────────────╮
// │                   The problem, in fractions                   │
// ╰───────────────────────────────────────────────────────────────╯

/** The columns of A (or the spanning vectors) and the target b (or x), as exact fractions. */
interface Problem { cols: FVec[]; target: FVec }

const parseVec = (entries: string[]): FVec | null => {
  const out = entries.map(parseEntry);
  return out.every(x => x !== null) ? (out as FVec) : null;
};

function readProblem(): Problem | null {
  if (state.mode === 'proj') {
    const cols = state.vs.slice(0, state.count).map(v => parseVec(v.slice(0, state.dim)));
    const target = parseVec(state.x.slice(0, state.dim));
    return cols.every(c => c !== null) && target ? { cols: cols as FVec[], target } : null;
  }
  if (state.mode === 'lsq') {
    const cols = Array.from({ length: state.n }, (_, j) => parseVec(state.A.slice(0, state.m).map(row => row[j])));
    const target = parseVec(state.b.slice(0, state.m));
    return cols.every(c => c !== null) && target ? { cols: cols as FVec[], target } : null;
  }
  const pts = state.pts.map(p => parseVec(p));
  if (pts.length === 0 || pts.some(p => p === null)) return null;
  const xs = (pts as FVec[]).map(p => p[0]), ys = (pts as FVec[]).map(p => p[1]);
  const cols = Array.from({ length: state.degree + 1 }, (_, k) => xs.map(x => power(x, k)));
  return { cols, target: ys };
}

function power(x: Fraction, k: number): Fraction {
  let out: Fraction = { num: 1n, den: 1n };
  for (let i = 0; i < k; i++) out = reduce({ num: out.num * x.num, den: out.den * x.den });
  return out;
}

/** A least squares solution, from the normal equation AᵀAx = Aᵀb. */
interface Solution {
  AtA: FMat;
  Atb: FVec;
  R: FMat;           // The RREF of [AᵀA | Aᵀb]
  pivots: number[];
  free: number[];    // Free variables of the normal equation
  xstar: FVec;       // The least squares solution with every free variable 0
  nullBasis: FVec[]; // One direction for each free variable
  p: FVec;           // Ax*, the projection of b onto the column space of A
  r: FVec;           // b − Ax*, the residual
  rr: Fraction;      // ‖r‖²
}

function solve({ cols, target }: Problem): Solution {
  const n = cols.length;
  const AtA = cols.map(a => cols.map(c => fdot(a, c)));
  const Atb = cols.map(a => fdot(a, target));
  const { r: R, pivots } = rref(AtA.map((row, i) => [...row, Atb[i]]));
  const free = Array.from({ length: n }, (_, j) => j).filter(j => !pivots.includes(j));
  const xstar: FVec = Array.from({ length: n }, () => ZERO);
  pivots.forEach((pc, row) => (xstar[pc] = R[row][n]));
  const nullBasis = free.map(f => {
    const v: FVec = Array.from({ length: n }, () => ZERO);
    v[f] = { num: 1n, den: 1n };
    pivots.forEach((pc, row) => (v[pc] = reduce({ num: -R[row][f].num, den: R[row][f].den })));
    return v;
  });
  const p = cols.reduce((s, c, j) => fadd(s, fscale(xstar[j], c)), target.map(() => ZERO));
  const r = fsub(target, p);
  return { AtA, Atb, R, pivots, free, xstar, nullBasis, p, r, rr: fdot(r, r) };
}

let problem: Problem | null = null;
let solution: Solution | null = null;

/** Rereads the entries and solves the problem. */
function refresh(): void {
  problem = readProblem();
  solution = problem ? solve(problem) : null;
}

// ╭───────────────────────────────────────────────────────────────╮
// │                  Drawing projections in 2D/3D                 │
// ╰───────────────────────────────────────────────────────────────╯

/** The dimension of the picture, or null when there is none (curve fitting, or b in ℝ⁴ or more). */
function geoDim(): 2 | 3 | null {
  if (state.mode === 'proj') return state.dim;
  if (state.mode === 'lsq') return state.m <= 3 ? (state.m as 2 | 3) : null;
  return null;
}

// Plot labels, with TeX so they're drawn in the same font as the explanations.
const colLetter = () => (state.mode === 'proj' ? 'v' : 'a');
const colLabel = (i: number): PlotLabel =>
  ({ text: `${colLetter()}${sub(i + 1)}`, tex: `\\vect{${colLetter()}}_{${i + 1}}` });
/** The name of the subspace drawn: W = span{v₁, …} for a projection, or col A for least squares. */
const subspaceLabel = (k: number): PlotLabel => {
  const cols = Array.from({ length: k }, (_, i) => colLabel(i) as { text: string; tex: string });
  return state.mode === 'proj'
    ? { text: `W = span{${cols.map(c => c.text).join(', ')}}`, tex: `W = \\Span{${cols.map(c => c.tex).join(', ')}}` }
    : { text: 'col A', tex: '\\colspace{A}' };
};
const targetLabel = (): { text: string; tex: string } => (state.mode === 'proj'
  ? { text: 'x', tex: '\\vect{x}' } : { text: 'b', tex: '\\vect{b}' });
const projLabel = (): { text: string; tex: string } => (state.mode === 'proj'
  ? { text: 'p', tex: '\\vect{p}' } : { text: 'Ax*', tex: 'A\\vect{x}_*' });
/** A number for a plot label: the text with a true minus sign, the TeX with a hyphen. */
const numLabel = (x: number) => ({ text: fixed(x), tex: fixed(x).replace('−', '-') });

/** The problem in floating point, for drawing. */
function geometry() {
  const cols = problem!.cols.map(c => toVec3(c.map(toNumber)));
  const target = toVec3(problem!.target.map(toNumber));
  const p = toVec3(solution!.p.map(toNumber));
  const coeffs = solution!.xstar.map(toNumber);
  const w = cols.reduce((s, c, i) => add3(s, scale3(cand[i] ?? 0, c)), [0, 0, 0] as Vec3);
  return { cols, target, p, coeffs, w, basis: orthonormalBasis(cols) };
}

function geoTargetBox() {
  if (!problem || !solution) return { center: [0, 0, 0] as Vec3, extent: 1 };
  const g = geometry();
  const points: Vec3[] = [...g.cols, g.target, g.p];
  let tip: Vec3 = [0, 0, 0];
  g.coeffs.forEach((c, i) => { tip = add3(tip, scale3(c, g.cols[i])); points.push(tip); });
  if (state.compare) points.push(g.w);
  return fitBox(points, geoDim() ?? 3);
}

const box = new EasedBox(geoTargetBox, () => renderAll());
// Plot labels are typeset by MathJax, which may finish after the first draw.
redrawOnMathLabels(() => renderAll());
const mainScene = new Scene();

// The top, front, and side views are turned off: they didn't make the picture clearer. The
// panel stays in the page (hidden) so the saved pins of the other panels keep their places.
const SHOW_SIDE_VIEWS = false;
const SIDE_VIEWS = (['top', 'front', 'side'] as const).map(name => ({
  ...SIDE_VIEW_ANGLES[name], canvas: $<HTMLCanvasElement>(`pl-view-${name}`), scene: new Scene(),
}));

function renderGeo(sc: Scene, target: HTMLCanvasElement, yaw: number, pitch: number, small: boolean): void {
  const dim = geoDim()!;
  const overlay = $('pl-overlay');
  sc.begin(target, {
    dim, yaw, pitch, perspective: dim === 3 && !small && cues.perspective,
    center: box.center, extent: box.extent,
    avoid: !small && overlay.closest('.pl-stage') ? overlay : null,
  });
  const g = geometry();
  if (dim === 2) {
    sc.subspace(g.basis, small ? undefined : subspaceLabel(g.cols.length));
    sc.gridAndAxes('rgba(128,128,128,0.25)');
  } else {
    sc.gridAndAxes('rgba(128,128,128,0.18)');
    sc.subspace(g.basis, small ? undefined : subspaceLabel(g.cols.length));
  }

  // The projection as a combination of the columns, drawn tip to tail, as in the span tool.
  let tip: Vec3 = [0, 0, 0];
  g.coeffs.forEach((c, i) => {
    if (Math.abs(c) < 1e-12) return;
    const next = add3(tip, scale3(c, g.cols[i]));
    sc.arrow(tip, next, COL_COLORS[i], small ? 1 : 1.5, undefined, [5, 4]);
    if (!small) {
      const n = numLabel(c), v = colLabel(i) as { text: string; tex: string };
      sc.segmentLabel(tip, next, { text: n.text + v.text, tex: n.tex + v.tex }, COL_COLORS[i], false);
    }
    tip = next;
  });

  // Another point of the subspace, and its (longer) distance to the target.
  if (state.compare) {
    sc.arrow([0, 0, 0], g.w, CAND_COLOR, small ? 1.5 : 2);
    sc.line(g.w, g.target, CAND_COLOR, small ? 1 : 1.5, [3, 4]);
    if (!small) sc.segmentLabel(g.w, g.target, numLabel(norm3(sub3(g.target, g.w))), CAND_COLOR, false);
  }

  // The residual, from the projection to the target, at a right angle to the subspace.
  const r = sub3(g.target, g.p);
  if (norm3(r) > 1e-9) {
    sc.arrow(g.p, g.target, RESID_COLOR, small ? 1.5 : 2.5, undefined, [6, 4]);
    if (!small) sc.segmentLabel(g.p, g.target, { text: `${targetLabel().text} − ${projLabel().text}`, tex: `${targetLabel().tex} - ${projLabel().tex}` }, RESID_COLOR, true);
    const along = norm3(g.p) > 1e-9 ? g.p : g.basis[0];
    if (along) sc.rightAngle(g.p, r, scale3(-1, along), '#3c4043', small ? 7 : 11);
  }

  if (dim === 3 && !small && cues.dropLines) {
    sc.dropLines([...g.cols.map((c, i): [Vec3, string] => [c, COL_COLORS[i]]), [g.target, TARGET_COLOR], [g.p, PROJ_COLOR]]);
  }
  g.cols.forEach((c, i) => sc.arrow([0, 0, 0], c, COL_COLORS[i], small ? 2 : 3, small ? undefined : colLabel(i)));
  sc.arrow([0, 0, 0], g.target, TARGET_COLOR, small ? 2 : 3, small ? undefined : targetLabel());
  sc.arrow([0, 0, 0], g.p, PROJ_COLOR, small ? 2.5 : 3.5, small ? undefined : projLabel());
  sc.dot([0, 0, 0], small ? 2.5 : 3.5, '#202124');
  sc.finish();
}

// ╭───────────────────────────────────────────────────────────────╮
// │                    Drawing a fitted curve                     │
// ╰───────────────────────────────────────────────────────────────╯
// The data and the fitted polynomial on their own x and y scales, which fill the plot. Each
// residual is a vertical segment from the curve to its data point, and (if shown) the side of a
// square, whose area is the squared residual: least squares makes their total area as small as
// possible.

interface Chart { x0: number; x1: number; y0: number; y1: number; left: number; top: number; w: number; h: number }
let chart: Chart | null = null;
let holdChart = false;

const polyAt = (c: number[], x: number) => c.reduceRight((s, ck) => s * x + ck, 0);

function dataPoints(): [number, number][] {
  return state.pts.map(p => p.map(s => parseEntry(s)) as [Fraction | null, Fraction | null])
    .filter(([x, y]) => x && y).map(([x, y]) => [toNumber(x!), toNumber(y!)]);
}

function chartBounds(pts: [number, number][], coeffs: number[] | null) {
  if (pts.length === 0) return { x0: -5, x1: 5, y0: -5, y1: 5 };
  const xs = pts.map(p => p[0]);
  let x0 = Math.min(...xs), x1 = Math.max(...xs);
  if (x1 - x0 < 1e-9) { x0 -= 1; x1 += 1; }
  const padX = (x1 - x0) * 0.15;
  x0 -= padX;
  x1 += padX;
  const ys = pts.map(p => p[1]);
  if (coeffs) for (const [x] of pts) ys.push(polyAt(coeffs, x));
  let y0 = Math.min(...ys), y1 = Math.max(...ys);
  if (y1 - y0 < 1e-9) { y0 -= 1; y1 += 1; }
  const padY = (y1 - y0) * 0.18;
  return { x0, x1, y0: y0 - padY, y1: y1 + padY };
}

const toPx = (c: Chart, x: number, y: number): [number, number] =>
  [c.left + (x - c.x0) / (c.x1 - c.x0) * c.w, c.top + (c.y1 - y) / (c.y1 - c.y0) * c.h];
const fromPx = (c: Chart, px: number, py: number): [number, number] =>
  [c.x0 + (px - c.left) / c.w * (c.x1 - c.x0), c.y1 - (py - c.top) / c.h * (c.y1 - c.y0)];

function renderFit(): void {
  const ctx = canvas.getContext('2d')!;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
  const pts = dataPoints();
  const coeffs = solution ? solution.xstar.map(toNumber) : null;

  // The plot fills the space beside (or below) the readout box, leaving room for tick labels.
  const overlay = $('pl-overlay');
  let region = { x: 0, y: 0, w: rect.width, h: rect.height };
  if (overlay.closest('.pl-stage') && overlay.offsetWidth > 0) {
    const o = overlay.getBoundingClientRect();
    const right = { x: o.right - rect.left, y: 0, w: rect.right - o.right, h: rect.height };
    const below = { x: 0, y: o.bottom - rect.top, w: rect.width, h: rect.bottom - o.bottom };
    region = right.w * right.h > below.w * below.h ? right : below;
    if (region.w < 0.4 * rect.width && region.h < 0.4 * rect.height) region = { x: 0, y: 0, w: rect.width, h: rect.height };
  }
  const bounds = holdChart && chart ? chart : chartBounds(pts, coeffs);
  const c: Chart = { ...bounds, left: region.x + 44, top: region.y + 12, w: region.w - 60, h: region.h - 50 };
  chart = c;

  // Grid lines and tick labels on both axes.
  const xStep = gridStep((c.x1 - c.x0) / 2), yStep = gridStep((c.y1 - c.y0) / 2);
  ctx.font = '11px system-ui, sans-serif';
  ctx.lineWidth = 1;
  for (const x of ticks(c.x0, c.x1, xStep)) {
    const [px] = toPx(c, x, 0);
    ctx.strokeStyle = Math.abs(x) < 1e-9 ? '#5f6368' : 'rgba(128,128,128,0.22)';
    ctx.beginPath(); ctx.moveTo(px, c.top); ctx.lineTo(px, c.top + c.h); ctx.stroke();
    ctx.fillStyle = '#5f6368';
    ctx.textAlign = 'center';
    ctx.fillText(tickLabel(x), px, c.top + c.h + 14);
  }
  for (const y of ticks(c.y0, c.y1, yStep)) {
    const [, py] = toPx(c, 0, y);
    ctx.strokeStyle = Math.abs(y) < 1e-9 ? '#5f6368' : 'rgba(128,128,128,0.22)';
    ctx.beginPath(); ctx.moveTo(c.left, py); ctx.lineTo(c.left + c.w, py); ctx.stroke();
    ctx.fillStyle = '#5f6368';
    ctx.textAlign = 'right';
    ctx.fillText(tickLabel(y), c.left - 5, py + 4);
  }
  ctx.textAlign = 'start';
  ctx.fillStyle = '#5f6368';
  ctx.font = 'italic 14px serif';
  ctx.fillText('x', c.left + c.w + 6, c.top + c.h + 4);
  ctx.fillText('y', c.left - 38, c.top + 10);

  ctx.save();
  ctx.beginPath();
  ctx.rect(c.left, c.top, c.w, c.h);
  ctx.clip();
  if (coeffs) {
    // The squares of the residuals, then the residuals, under the curve and the points.
    for (const [x, y] of pts) {
      const [px, py] = toPx(c, x, y);
      const [, fy] = toPx(c, x, polyAt(coeffs, x));
      const side = Math.abs(fy - py);
      if (state.squares && side > 0.5) {
        // On the right of the segment, unless that would leave the plot.
        const sx = px + side > c.left + c.w ? px - side : px;
        ctx.fillStyle = 'rgba(204, 121, 167, 0.16)';
        ctx.strokeStyle = 'rgba(204, 121, 167, 0.75)';
        ctx.lineWidth = 1;
        ctx.fillRect(sx, Math.min(py, fy), side, side);
        ctx.strokeRect(sx, Math.min(py, fy), side, side);
      }
      ctx.strokeStyle = RESID_COLOR;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, fy); ctx.stroke();
    }
    ctx.strokeStyle = FIT_COLOR;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const x = c.x0 + (c.x1 - c.x0) * i / 300;
      const [px, py] = toPx(c, x, polyAt(coeffs, x));
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();
  pts.forEach(([x, y], i) => {
    const [px, py] = toPx(c, x, y);
    ctx.fillStyle = TARGET_COLOR;
    ctx.beginPath(); ctx.arc(px, py, hoveredPoint === i ? 7 : 5, 0, 2 * Math.PI); ctx.fill();
  });
}

// ╭───────────────────────────────────────────────────────────────╮
// │                     Drawing everything                        │
// ╰───────────────────────────────────────────────────────────────╯

/** Redraws, saves, eases the axes toward the size that fits, and updates the calculations. */
function draw(): void {
  renderAll();
  saveState();
  if (geoDim()) box.update();
  scheduleCalc();
}

function renderAll(): void {
  const dim = geoDim();
  const plotted = state.mode === 'fit' || dim !== null;
  $('pl-plot-panel').hidden = !plotted;
  $('pl-noplot').hidden = plotted;
  $('pl-side-panel').hidden = !SHOW_SIDE_VIEWS || dim !== 3 || !solution;
  updateReadout();
  if (!plotted) return;
  if (state.mode === 'fit') {
    renderFit();
    return;
  }
  if (!solution) {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  if (SHOW_SIDE_VIEWS && dim === 3) for (const v of SIDE_VIEWS) renderGeo(v.scene, v.canvas, v.yaw, v.pitch, true);
  // The main view is drawn last, so `mainScene` matches it for pointer handling.
  renderGeo(mainScene, canvas, state.yaw, state.pitch, false);
}

// ╭───────────────────────────────────────────────────────────────╮
// │              The readout box and the comparison               │
// ╰───────────────────────────────────────────────────────────────╯
// Numbers that change while dragging use a fixed number of decimals so their widths don't chatter.

const fixed = (x: number) => (Math.abs(x) < 0.005 ? 0 : x).toFixed(2).replace('-', '−');
const fixedInput = (x: number) => fixed(x).replace('−', '-');
// The readout, the comparison, and the entry labels are MathJax too, in the same font as the
// calculations. `m` converts TeX to HTML right away (see common/mathjax.ts), so it can run on every
// frame of a drag; until MathJax is ready, the readout and labels are redrawn once it is.
const m = (tex: string) => mathHTML(tex, () => { compareKey = ''; updateReadout(); buildEntries(); });
/** A colored TeX symbol, such as the projection's \vect{p}. */
const mc = (hex: string, tex: string) => `{\\color[RGB]{${[1, 3, 5].map(k => parseInt(hex.slice(k, k + 2), 16)).join(',')}}${tex}}`;
/** A number with fixed decimals, in TeX. */
const fixedTex = (x: number) => fixedInput(x);
const colvec = (v: number[]) => m(`\\begin{bmatrix}${v.map(fixedTex).join('\\\\')}\\end{bmatrix}`);
const row = (lhsTex: string, rhs: string) => `<span class="pl-lhs">${m(lhsTex)}</span><span>${m('=')}</span><span>${rhs}</span>`;

function updateReadout(): void {
  const out = $('pl-readout');
  if (!problem || !solution) {
    out.innerHTML = `<p class="pl-read-note">${state.mode === 'fit' && state.pts.length === 0
      ? 'Add a data point to fit a curve.' : 'Fix the highlighted entries to see the result.'}</p>`;
    return;
  }
  const s = solution;
  const dist = Math.sqrt(toNumber(s.rr));
  if (state.mode === 'fit') {
    out.innerHTML = `<p class="pl-read-note">The ${MODELS[state.degree].name.toLowerCase()} of best fit${s.free.length ? ' (one of many)' : ''}:</p>
      <div class="pl-eq">${m(`${mc(FIT_COLOR, 'y')} = ${polyTexFixed(s.xstar.map(toNumber))}`)}</div>
      <div class="pl-sum"><span class="pl-lhs">Sum of squared residuals</span><span>${m('=')}</span><span>${m(fixedTex(toNumber(s.rr)))}</span></div>`;
    return;
  }
  const p = s.p.map(toNumber);
  const P = mc(PROJ_COLOR, state.mode === 'proj' ? '\\vect{p}' : 'A\\vect{x}_*');
  if (state.mode === 'proj') {
    out.innerHTML = `<p class="pl-read-note">${m(`${P} = \\operatorname{proj}_W \\vect{x}`)}, the point of ${m('W')} closest to ${m('\\vect{x}')}:</p>
      <div class="pl-sum">${row(P, colvec(p))}${row(`\\norm{\\vect{x} - ${P}}`, m(fixedTex(dist)))}</div>`;
  } else {
    out.innerHTML = `<p class="pl-read-note">${m('\\vect{x}_*')} makes ${m('\\norm{A\\vect{x} - \\vect{b}}')} as small as possible${s.free.length ? ' (one of many)' : ''}:</p>
      <div class="pl-sum">${row('\\vect{x}_*', colvec(s.xstar.map(toNumber)))}${row(P, colvec(p))}${row(`\\norm{\\vect{b} - ${P}}`, m(fixedTex(dist)))}</div>`;
  }
  updateCompareReadout();
}

/** "1.00 + 2.00x − 0.50x²" in TeX, with fixed decimals. */
function polyTexFixed(c: number[]): string {
  let out = '';
  c.forEach((ck, k) => {
    const mono = k === 0 ? '' : k === 1 ? 'x' : `x^{${k}}`;
    const sign = out === '' ? (ck < -0.005 ? '-' : '') : (ck < -0.005 ? ' - ' : ' + ');
    out += `${sign}${fixedTex(Math.abs(ck))}${mono}`;
  });
  return out;
}

// The comparison: sliders choose another point w = c₁v₁ + ⋯ of W (or another x, giving Ax), and
// the box shows that it is farther from the target than the projection.
let compareKey = '';

function buildCompare(): void {
  const panel = $('pl-compare');
  const n = problem?.cols.length ?? 0;
  const key = `${state.mode}|${state.compare}|${n}`;
  if (key === compareKey) return;
  compareKey = key;
  panel.innerHTML = '';
  panel.hidden = !state.compare || state.mode === 'fit' || n === 0;
  if (panel.hidden) return;
  const proj = state.mode === 'proj';
  const title = document.createElement('div');
  title.className = 'pl-read-note';
  title.innerHTML = proj
    ? `Another point of ${m('W')}, ${m(`${mc(CAND_COLOR, '\\vect{w}')} = ${Array.from({ length: n }, (_, i) => `c_{${i + 1}} ${mc(COL_COLORS[i], `\\vect{v}_{${i + 1}}`)}`).join(' + ')}`)}:`
    : `Another ${m('\\vect{x}')}, for comparison:`;
  panel.append(title);
  for (let i = 0; i < n; i++) {
    const rowEl = document.createElement('label');
    rowEl.className = 'pl-coeff';
    const name = document.createElement('span');
    name.style.color = COL_COLORS[i];
    name.innerHTML = m(mc(COL_COLORS[i], proj ? `c_{${i + 1}}` : `x_{${i + 1}}`));
    const text = document.createElement('input');
    text.type = 'text';
    text.inputMode = 'decimal';
    text.setAttribute('aria-label', proj ? `coefficient c${i + 1}` : `entry x${i + 1}`);
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '-4';
    slider.max = '4';
    slider.step = '0.05';
    slider.tabIndex = -1;
    text.addEventListener('input', () => {
      const x = parseFloat(text.value.replace('−', '-'));
      if (!Number.isFinite(x)) return;
      cand[i] = x;
      slider.value = String(x);
      draw();
    });
    text.addEventListener('change', () => (text.value = fixedInput(cand[i])));
    slider.addEventListener('input', () => {
      cand[i] = parseFloat(slider.value);
      text.value = fixedInput(cand[i]);
      draw();
    });
    rowEl.append(name, text, slider);
    panel.append(rowEl);
  }
  const out = document.createElement('div');
  out.className = 'pl-sum';
  out.id = 'pl-compare-out';
  const closest = document.createElement('button');
  closest.type = 'button';
  closest.className = 'pl-small';
  closest.textContent = proj ? 'Move w to the projection' : 'Set x to x*';
  closest.addEventListener('click', () => {
    if (!solution) return;
    cand = solution.xstar.map(toNumber);
    syncCompare();
    draw();
  });
  panel.append(out, closest);
  syncCompare();
}

function syncCompare(): void {
  $('pl-compare').querySelectorAll<HTMLLabelElement>('.pl-coeff').forEach((rowEl, i) => {
    const [text, slider] = rowEl.querySelectorAll('input');
    if (document.activeElement !== text) text.value = fixedInput(cand[i]);
    slider.value = String(cand[i]);
  });
}

function updateCompareReadout(): void {
  buildCompare();
  const out = document.getElementById('pl-compare-out');
  if (!out || !problem || !solution) return;
  const g = geometry();
  const w = problem.target.map((_, k) => g.w[k]);
  const d = norm3(sub3(g.target, g.w)), best = Math.sqrt(toNumber(solution.rr));
  const cmp = d > best + 0.005 ? '>' : '=';
  out.innerHTML = state.mode === 'proj'
    ? `${row(mc(CAND_COLOR, '\\vect{w}'), colvec(w))}${row(`\\norm{\\vect{x} - ${mc(CAND_COLOR, '\\vect{w}')}}`, m(`${fixedTex(d)} ${cmp} ${fixedTex(best)}`))}`
    : `${row('A\\vect{x}', colvec(w))}${row('\\norm{\\vect{b} - A\\vect{x}}', m(`${fixedTex(d)} ${cmp} ${fixedTex(best)}`))}`;
}

// ╭───────────────────────────────────────────────────────────────╮
// │                         Calculations                          │
// ╰───────────────────────────────────────────────────────────────╯
// Step by step, in exact fractions. Fractions with large denominators (from entries like 0.137)
// are shown as decimals instead, with a note.

let rounded = false;

function texNum(x: Fraction, big = false): string {
  const r = reduce(x);
  const n = r.num < 0n ? -r.num : r.num;
  if (r.den <= 999n && n <= 999999n) {
    if (r.den === 1n) return `${r.num}`;
    return `${r.num < 0n ? '-' : ''}\\${big ? '' : 't'}frac{${n}}{${r.den}}`;
  }
  rounded = true;
  return decimal(toNumber(r)).replace('−', '-');
}
/** A number for inline math, with fractions written a/b (an inline \\frac is too small to read). */
const inlineNum = (x: Fraction) => texNum(x, true).replace(/^(-?)\\frac\{(\d+)\}\{(\d+)\}$/, '$1$2/$3');
/** Up to four decimals, without trailing zeros. */
const decimal = (x: number) => String(Number(x.toFixed(4))).replace('-', '−');
/** A number as a factor or term: negative numbers and fractions in parentheses. */
const paren = (x: Fraction) => (x.num < 0n || reduce(x).den !== 1n ? `\\left(${texNum(x)}\\right)` : texNum(x));

const bmat = (v: FVec) => `\\begin{bmatrix} ${v.map(x => texNum(x)).join(' \\\\ ')} \\end{bmatrix}`;
const matTex = (m: FMat) => `\\begin{bmatrix} ${m.map(r => r.map(x => texNum(x)).join(' & ')).join(' \\\\ ')} \\end{bmatrix}`;
const augTex = (m: FMat) => `\\left[\\begin{array}{${'c'.repeat(m[0].length - 1)}|c} ${m.map(r => r.map(x => texNum(x)).join(' & ')).join(' \\\\ ')} \\end{array}\\right]`;
// MathJax's color package has no HTML color names here, so give RGB values from 0 to 255.
const rgb = (hex: string) => [1, 3, 5].map(k => parseInt(hex.slice(k, k + 2), 16)).join(',');
const color = (hex: string, body: string) => `{\\color[RGB]{${rgb(hex)}}${body}}`;
const d$ = (body: string) => `<div class="pl-tex">\\[ ${body} \\]</div>`;

/** "(1)(4) + (3)(2)", as in lecture. */
const factor = (x: Fraction) => (reduce(x).den === 1n ? `(${texNum(x)})` : `\\left(${texNum(x)}\\right)`);
const ipExpand = (a: FVec, b: FVec) => a.map((x, i) => `${factor(x)}${factor(b[i])}`).join(' + ');
/** "4^2 + 2^2" */
const normSqExpand = (a: FVec) => a.map(x => `${paren(x)}^2`).join(' + ');

/** s/t as a big fraction, followed by its reduced value when that is simpler. */
function ratio(s: Fraction, t: Fraction): string {
  const q = reduce(div(s, t));
  const plainInts = reduce(s).den === 1n && reduce(t).den === 1n;
  const first = plainInts
    ? `${s.num < 0n ? '-' : ''}\\frac{${s.num < 0n ? -s.num : s.num}}{${t.num}}`
    : `\\frac{${texNum(s)}}{${texNum(t)}}`;
  const reducedText = texNum(q, true);
  return reducedText === first ? first : `${first} = ${reducedText}`;
}
/** Only the reduced coefficient s/t. */
const coeff = (s: Fraction, t: Fraction) => texNum(div(s, t), true);

/** The distance √(rr), exact when rr is a perfect square. */
function sqrtTex(rr: Fraction): string {
  const r = reduce(rr);
  const rn = isqrt(r.num), rd = isqrt(r.den);
  if (rn * rn === r.num && rd * rd === r.den) return texNum({ num: rn, den: rd }, true);
  return `\\sqrt{${texNum(r, true)}} \\approx ${decimal(Math.sqrt(toNumber(r))).replace('−', '-')}`;
}
function isqrt(n: bigint): bigint {
  if (n < 2n) return n;
  let x = BigInt(Math.floor(Math.sqrt(Number(n))));
  while (x * x > n) x--;
  while ((x + 1n) * (x + 1n) <= n) x++;
  return x;
}

let calcKey = '';
let calcTimer = 0;

/** Rebuilds the calculations soon (not on every frame of a drag). */
function scheduleCalc(): void {
  window.clearTimeout(calcTimer);
  calcTimer = window.setTimeout(updateCalc, 250);
}

function updateCalc(): void {
  const key = JSON.stringify([state.mode, state.dim, state.count, state.vs, state.x, state.m, state.n, state.A, state.b, state.degree, state.pts]);
  if (key === calcKey) return;
  calcKey = key;
  const out = $('pl-calc');
  rounded = false;
  let html: string;
  if (!problem || !solution) {
    html = `<p>${state.mode === 'fit' && state.pts.length === 0 ? 'Add a data point to see the calculations.' : 'Some entries aren’t numbers. Fix the highlighted entries to see the calculations.'}</p>`;
  } else if (state.mode === 'proj') {
    html = projectionCalc(problem, solution);
  } else if (state.mode === 'lsq') {
    html = leastSquaresCalc(problem, solution);
  } else {
    html = fitCalc(problem, solution);
  }
  if (rounded) html += '<p class="pl-note">Some numbers have large denominators, so they are shown as decimals rounded to four places. The calculations themselves are exact.</p>';
  out.innerHTML = html;
  out.querySelectorAll<HTMLButtonElement>('[data-open-lsq]').forEach(b => b.addEventListener('click', openAsLeastSquares));
  void typeset([out]);
}

// ⋘──────── Projection onto a subspace ────────⋙
// Following lecture: the formula for the projection onto one vector, the orthogonal decomposition
// theorem for an orthogonal basis, and Gram–Schmidt to find an orthogonal basis when needed.

const vName = (i: number) => color(COL_COLORS[i], `\\vect{v}_{${i + 1}}`);
const X = '\\vect{x}';
const P = (W: string) => color(PROJ_COLOR, `\\operatorname{proj}_{${W}} ${X}`);

function projectionCalc(pr: Problem, s: Solution): string {
  const { cols: vs, target: x } = pr;
  const k = vs.length;
  const spanTex = `\\Span{${vs.map((_, i) => vName(i)).join(', ')}}`;
  let html = `<p>The projection of ${'\\(' + X + '\\)'} onto \\(W = ${spanTex}\\) is the point of \\(W\\) closest to \\(${X}\\).</p>`;
  if (vs.every(isZeroVec)) {
    return html + `<p>Every spanning vector is zero, so \\(W = \\setdef{\\vect{0}}\\), and the closest (only) point is ${'\\(' + P('W') + ' = \\vect{0}\\)'}.</p>`;
  }
  let pTex: string;
  if (k === 1) {
    const v = vs[0];
    const xv = fdot(x, v), vv = fdot(v, v);
    pTex = P(`${vName(0)}`);
    html += `<p>For one nonzero vector \\(\\vect{v}\\), the projection of \\(${X}\\) onto \\(\\vect{v}\\) is</p>
      ${d$(`\\operatorname{proj}_{\\vect{v}} ${X} = \\left( \\frac{\\ip{${X}}{\\vect{v}}}{\\norm{\\vect{v}}^2} \\right) \\vect{v}.`)}
      <p>Compute the inner product and the squared length:</p>
      ${d$(`\\begin{aligned} \\ip{${X}}{${vName(0)}} &= ${ipExpand(x, v)} = ${texNum(xv)}, \\\\ \\norm{${vName(0)}}^2 &= ${normSqExpand(v)} = ${texNum(vv)}. \\end{aligned}`)}
      <p>Then</p>
      ${d$(`${pTex} = ${ratio(xv, vv)} \\, ${vName(0)} = ${coeff(xv, vv)} ${bmat(v)} = ${bmat(s.p)}.`)}`;
  } else {
    // Is the spanning set orthogonal? List the inner product of each pair.
    const pairs: string[] = [];
    let orthogonal = true;
    for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) {
      const ip = fdot(vs[i], vs[j]);
      if (!isZero(ip)) orthogonal = false;
      pairs.push(`\\ip{${vName(i)}}{${vName(j)}} &= ${ipExpand(vs[i], vs[j])} = ${texNum(ip)}`);
    }
    const zeros = vs.map((v, i) => (isZeroVec(v) ? i : -1)).filter(i => i >= 0);
    html += `<p><strong>Step 1: Check whether the spanning vectors are orthogonal.</strong>
      The sum-of-projections formula below works only for an orthogonal basis.</p>
      ${d$(`\\begin{aligned} ${pairs.join(' \\\\ ')} \\end{aligned}`)}`;
    let basis: FVec[];
    let uName: (j: number) => string;
    if (orthogonal) {
      basis = vs.filter(v => !isZeroVec(v));
      const kept = vs.map((_, i) => i).filter(i => !zeros.includes(i));
      uName = j => vName(kept[j]);
      html += `<p>Every pair is orthogonal${zeros.length ? `, and the zero vector${zeros.length > 1 ? 's add' : ' adds'} nothing to the span, so leave ${zeros.length > 1 ? 'them' : 'it'} out` : ''}.
        So \\(${kept.map(vName).join(', ')}\\) form an orthogonal basis of \\(W\\).</p>`;
    } else {
      ({ basis, html } = gramSchmidt(vs, html));
      uName = j => `\\vect{u}_{${j + 1}}`;
    }
    pTex = P('W');
    const terms = basis.map((u, j) => ({ u, name: uName(j), xu: fdot(x, u), uu: fdot(u, u) }));
    const formula = terms.map(t => `\\frac{\\ip{${X}}{${t.name}}}{\\norm{${t.name}}^2} ${t.name}`).join(' + ');
    const numbers = signedSum(terms.map(t => `${ratioOnly(t.xu, t.uu)} ${bmat(t.u)}`));
    const vectors = terms.map(t => bmat(fscale(div(t.xu, t.uu), t.u))).join(' + ');
    html += `<p><strong>Step ${orthogonal ? 2 : 3}: Add the projections onto the orthogonal basis vectors.</strong>
      By the orthogonal decomposition theorem,</p>
      ${d$(`\\begin{aligned} ${pTex} &= ${formula} \\\\ &= ${numbers} \\\\ &= ${terms.length > 1 ? `${vectors} \\\\ &= ` : ''}${bmat(s.p)}, \\end{aligned}`)}
      <p>using</p>
      ${d$(`\\begin{aligned} ${terms.map(t => `\\ip{${X}}{${t.name}} &= ${ipExpand(x, t.u)} = ${texNum(t.xu)}, & \\norm{${t.name}}^2 &= ${normSqExpand(t.u)} = ${texNum(t.uu)}`).join(' \\\\ ')}. \\end{aligned}`)}`;
    if (basis.length === x.length) {
      html += `<p>Here \\(W\\) has dimension ${basis.length}, so \\(W = \\reals^${x.length}\\) and the projection is \\(${X}\\) itself.</p>`;
    }
  }

  // The orthogonal component and the distance.
  const r = s.r;
  const orth = color(RESID_COLOR, k === 1 ? `\\operatorname{orth}_{${vName(0)}} ${X}` : '\\vect{r}');
  html += `<p><strong>${k === 1 ? '' : 'Last step: '}The orthogonal component</strong> is what's left of \\(${X}\\):</p>
    ${d$(`${orth} = ${X} - ${pTex} = ${bmat(x)} - ${bmat(s.p)} = ${bmat(r)}.`)}
    <p>It is orthogonal to ${k === 1 ? 'the spanning vector' : 'every spanning vector'}, which checks the answer:</p>
    ${d$(`\\begin{aligned} ${vs.map((v, i) => `\\ip{${orth}}{${vName(i)}} &= ${ipExpand(r, v)} = ${texNum(fdot(r, v))}`).join(' \\\\ ')}. \\end{aligned}`)}
    <p>The distance from \\(${X}\\) to \\(W\\) is the length of \\(${orth}\\):</p>
    ${d$(`\\norm{${X} - ${pTex}} = \\sqrt{${normSqExpand(r)}} = ${sqrtTex(s.rr)}.`)}`;
  if (isZeroVec(r)) html += `<p>The distance is 0, so \\(${X}\\) is already in \\(W\\).</p>`;
  if (k > 1) {
    html += `<p class="pl-note">Another way: \\(${pTex} = A\\vect{x}_*\\), where \\(A = \\begin{bmatrix} ${vs.map((_, i) => vName(i)).join(' & ')} \\end{bmatrix}\\) and \\(\\vect{x}_*\\) solves the normal equation \\(A\\trans A \\vect{x} = A\\trans ${X}\\).
      That method needs no orthogonal basis.
      <button type="button" class="pl-small" data-open-lsq>Solve it as a least squares problem</button></p>`;
  }
  return html;
}

/** Terms joined by + or −, where a term starting with "-" is subtracted. */
const signedSum = (terms: string[]) =>
  terms.map((t, i) => (i === 0 ? t : t.startsWith('-') ? ` - ${t.slice(1)}` : ` + ${t}`)).join('');

/** The coefficient s/t, unreduced when both are integers (as in the formula), for sums. */
function ratioOnly(s: Fraction, t: Fraction): string {
  const plainInts = reduce(s).den === 1n && reduce(t).den === 1n;
  if (!plainInts) return `\\frac{${texNum(s)}}{${texNum(t)}}`;
  return `${s.num < 0n ? '-' : ''}\\frac{${s.num < 0n ? -s.num : s.num}}{${t.num}}`;
}

/** Gram–Schmidt, with each new vector scaled to clear fractions. Appends its steps to `html`. */
function gramSchmidt(vs: FVec[], html: string): { basis: FVec[]; html: string } {
  const basis: FVec[] = [];
  const steps: string[] = [];
  const u = (j: number) => `\\vect{u}_{${j + 1}}`;
  vs.forEach((v, i) => {
    if (basis.length === 0) {
      if (isZeroVec(v)) {
        steps.push(`<p>\\(${vName(i)} = \\vect{0}\\) adds nothing to the span, so leave it out.</p>`);
        return;
      }
      basis.push(v);
      steps.push(d$(`${u(0)} = ${vName(i)} = ${bmat(v)}`));
      return;
    }
    const j = basis.length;
    const coeffs = basis.map(b => div(fdot(v, b), fdot(b, b)));
    let w = v;
    basis.forEach((b, l) => (w = fsub(w, fscale(coeffs[l], b))));
    const formula = basis.map((_, l) => ` - \\frac{\\ip{${vName(i)}}{${u(l)}}}{\\norm{${u(l)}}^2} ${u(l)}`).join('');
    const numbers = basis.map((b, l) => {
      const ip = fdot(v, b);
      return ` ${ip.num < 0n ? '+' : '-'} ${ratioOnly(ip.num < 0n ? { num: -ip.num, den: ip.den } : ip, fdot(b, b))} ${bmat(b)}`;
    }).join('');
    const lhs = isZeroVec(w) ? '' : u(j);
    let step = d$(`${lhs ? `${lhs} = ` : ''}${vName(i)}${formula} = ${bmat(v)}${numbers} = ${bmat(w)}`);
    if (isZeroVec(w)) {
      step += `<p>The result is \\(\\vect{0}\\), so \\(${vName(i)}\\) is already in the span of the vectors before it. Leave it out.</p>`;
    } else {
      const { v: scaled, factor } = clearDenominators(w);
      if (!equals(factor, { num: 1n, den: 1n })) {
        step += `<p>Scaling \\(${u(j)}\\) doesn't change the projections onto it, so multiply by \\(${inlineNum(factor)}\\) to get the simpler \\(${u(j)} = ${bmat(scaled)}\\).</p>`;
        w = scaled;
      }
      basis.push(w);
    }
    steps.push(step);
  });
  html += `<p>They aren't orthogonal, so the formula would give the wrong point.</p>
    <p><strong>Step 2: Find an orthogonal basis of \\(W\\) with Gram–Schmidt.</strong>
    Subtract from each vector its projections onto the basis vectors found so far.</p>
    ${steps.join('')}
    <p>So \\(${basis.map((_, j) => u(j)).join(', ')}\\) form an orthogonal basis of \\(W\\).</p>`;
  return { basis, html };
}

// ⋘──────── Least squares, by the normal equation ────────⋙

interface Names {
  A: string;
  x: string;                    // The unknown vector, such as \vect{x}
  entry: (j: number) => string; // Its entries, such as x_1
  b: string;                    // The target, such as \vect{b}
  colName?: (j: number) => string;
}

function normalEquationSteps(pr: Problem, s: Solution, nm: Names, first: number): string {
  const { cols, target } = pr;
  const n = cols.length;
  const At: FMat = cols;
  const A: FMat = target.map((_, i) => cols.map(c => c[i]));
  const xs = `${nm.x}_*`;
  let html = `<p><strong>Step ${first}: Compute \\(${nm.A}\\trans ${nm.A}\\) and \\(${nm.A}\\trans ${nm.b}\\).</strong>
    Entry \\((i, j)\\) of \\(${nm.A}\\trans ${nm.A}\\) is the inner product of columns \\(i\\) and \\(j\\) of \\(${nm.A}\\).</p>
    ${d$(`\\begin{aligned} ${nm.A}\\trans ${nm.A} &= ${matTex(At)} ${matTex(A)} = ${matTex(s.AtA)}, \\\\ ${nm.A}\\trans ${nm.b} &= ${matTex(At)} ${bmat(target)} = ${bmat(s.Atb)}. \\end{aligned}`)}`;
  if (target.length > n) {
    html += `<p class="pl-note">\\(${nm.A}\\) has more rows than columns, so \\(${nm.A}\\trans ${nm.A}\\) (${n} × ${n}) is smaller than \\(${nm.A}\\) (${target.length} × ${n}).</p>`;
  }
  const aug = s.AtA.map((r, i) => [...r, s.Atb[i]]);
  const practice = practiceLink(aug);
  html += `<p><strong>Step ${first + 1}: Solve the normal equation \\(${nm.A}\\trans ${nm.A} ${nm.x} = ${nm.A}\\trans ${nm.b}\\)</strong> by row reducing its augmented matrix${practice}:</p>
    ${d$(`${augTex(aug)} \\sim ${augTex(s.R)}.`)}`;
  if (s.free.length === 0) {
    html += `<p>Every column of \\(${nm.A}\\trans ${nm.A}\\) has a pivot, so there is exactly one least squares solution:</p>
      ${d$(`${xs} = ${bmat(s.xstar)}.`)}`;
  } else {
    const freeNames = s.free.map(nm.entry);
    const general = `${bmat(s.xstar)} + ${s.free.map((f, l) => `${nm.entry(f)} ${bmat(s.nullBasis[l])}`).join(' + ')}`;
    html += `<p>${freeNames.length > 1 ? 'The variables' : 'The variable'} \\(${freeNames.join(', ')}\\) ${freeNames.length > 1 ? 'are' : 'is'} free, because the columns of \\(${nm.A}\\) are linearly dependent.
      So there are infinitely many least squares solutions, one for each value of ${freeNames.length > 1 ? 'the free variables' : 'the free variable'}:</p>
      ${d$(`${nm.x} = ${general}.`)}
      <p>Every one of them gives the same \\(${nm.A}${nm.x}\\), the projection of \\(${nm.b}\\).
      Setting ${freeNames.length > 1 ? 'each free variable' : 'the free variable'} to 0 gives the one drawn above:</p>
      ${d$(`${xs} = ${bmat(s.xstar)}.`)}`;
  }
  const r = color(RESID_COLOR, '\\vect{r}');
  html += `<p><strong>Step ${first + 2}: Find the projection and the residual.</strong>
    \\(${nm.A}${xs}\\) is the point of \\(\\colspace{${nm.A}}\\) closest to \\(${nm.b}\\), and the residual \\(${r} = ${nm.b} - ${nm.A}${xs}\\) is what's left over:</p>
    ${d$(`\\begin{aligned} ${color(PROJ_COLOR, `${nm.A}${xs}`)} &= ${matTex(A)} ${bmat(s.xstar)} = ${bmat(s.p)} = \\operatorname{proj}_{\\colspace{${nm.A}}} ${nm.b}, \\\\ ${r} &= ${nm.b} - ${nm.A}${xs} = ${bmat(target)} - ${bmat(s.p)} = ${bmat(s.r)}. \\end{aligned}`)}
    <p>The residual is orthogonal to every column of \\(${nm.A}\\), which is what the normal equation says:</p>
    ${d$(`${nm.A}\\trans ${r} = ${nm.A}\\trans ${nm.b} - ${nm.A}\\trans ${nm.A} ${xs} = ${bmat(cols.map(() => ZERO))}.`)}
    <p>The error is the length of the residual:</p>
    ${d$(`\\norm{${nm.b} - ${nm.A}${xs}} = \\sqrt{${normSqExpand(s.r)}} = ${sqrtTex(s.rr)}.`)}`;
  if (isZeroVec(s.r)) {
    html += `<p>The error is 0: \\(${nm.b}\\) is in \\(\\colspace{${nm.A}}\\), so \\(${nm.A}${nm.x} = ${nm.b}\\) is consistent, and \\(${xs}\\) is an exact solution.</p>`;
  }
  return html;
}

/** A link to practice the row reduction, when the numbers are small enough to do by hand. */
function practiceLink(aug: FMat): string {
  const plain = (x: Fraction) => formatFraction(x).replace('−', '-');
  if (aug.flat().some(x => reduce(x).den > 99n || (x.num < 0n ? -x.num : x.num) > 9999n)) return '';
  const url = `${window.GAUSSIAN_PRACTICE_URL ?? '/tools/gaussian_elimination_practice/'}?m=${aug.map(r => r.map(plain).join(',')).join(';')}`;
  return ` (<a href="${url}" target="_blank" rel="noopener">practice this row reduction</a>)`;
}

function leastSquaresCalc(pr: Problem, s: Solution): string {
  return `<p>A least squares solution of \\(A\\vect{x} = \\vect{b}\\) is a vector \\(\\vect{x}_*\\) that makes \\(\\norm{A\\vect{x} - \\vect{b}}\\) as small as possible.
    Every least squares solution solves the <em>normal equation</em></p>
    ${d$('A\\trans A \\vect{x} = A\\trans \\vect{b}.')}
    ${normalEquationSteps(pr, s, { A: 'A', x: '\\vect{x}', entry: j => `x_{${j + 1}}`, b: '\\vect{b}' }, 1)}`;
}

// ⋘──────── Curve fitting ────────⋙

const MODELS = [
  { name: 'Constant', formula: 'y = c₀' },
  { name: 'Line', formula: 'y = c₀ + c₁x' },
  { name: 'Quadratic', formula: 'y = c₀ + c₁x + c₂x²' },
  { name: 'Cubic', formula: 'y = c₀ + c₁x + c₂x² + c₃x³' },
];

/** A polynomial in TeX, such as "-2 + 2x". */
function polyTex(c: (string | Fraction)[]): string {
  let out = '';
  c.forEach((ck, k) => {
    const mono = k === 0 ? '' : k === 1 ? 'x' : `x^${k}`;
    if (typeof ck === 'string') {
      const negative = ck.startsWith('-');
      out += `${out ? (negative ? ' - ' : ' + ') : (negative ? '-' : '')}${negative ? ck.slice(1) : ck}${mono}`;
      return;
    }
    if (isZero(ck)) return;
    const negative = ck.num < 0n;
    const a = negative ? { num: -ck.num, den: ck.den } : ck;
    const one = a.num === a.den && mono !== '';
    out += `${out ? (negative ? ' - ' : ' + ') : (negative ? '-' : '')}${one ? '' : texNum(a)}${mono}`;
  });
  return out || '0';
}

function fitCalc(pr: Problem, s: Solution): string {
  const d = state.degree, N = pr.target.length;
  const cNames = Array.from({ length: d + 1 }, (_, k) => `c_{${k}}`);
  const pts = state.pts.map(p => p.map(t => parseEntry(t)!));
  const model = polyTex(cNames);
  const equations = pts.map(([x, y]) => {
    const terms = cNames.map((c, k) => (k === 0 ? c : `${paren(x)}${k > 1 ? `^${k}` : ''} ${c}`));
    return `${terms.join(' + ')} &= ${texNum(y)}`;
  });
  const A: FMat = pr.target.map((_, i) => pr.cols.map(c => c[i]));
  let html = `<p>The model \\(y = ${model}\\) has ${d + 1} unknown coefficient${d ? 's' : ''}.
    Each data point \\((x_i, y_i)\\) gives one equation, \\(${polyTex(cNames).replace(/x/g, 'x_i')} = y_i\\):</p>
    ${d$(`\\left\\{ \\begin{aligned} ${equations.join(' \\\\ ')} \\end{aligned} \\right.`)}
    <p>As a matrix equation \\(A\\vect{c} = \\vect{y}\\), with column \\(k\\) of \\(A\\) holding the \\(x_i^{k}\\) (starting at \\(x_i^0 = 1\\)):</p>
    ${d$(`\\underbrace{${matTex(A)}}_{A} \\begin{bmatrix} ${cNames.join(' \\\\ ')} \\end{bmatrix} = \\underbrace{${bmat(pr.target)}}_{\\vect{y}}.`)}`;
  html += N > d + 1
    ? `<p>With ${N} points and ${d + 1} unknowns, this system usually has no solution: no ${MODELS[d].name.toLowerCase()} goes through every point.
      A least squares solution makes the sum of the squared residuals, \\(\\norm{\\vect{y} - A\\vect{c}}^2 = \\sum_i \\left(y_i - (${polyTex(cNames).replace(/x/g, 'x_i')})\\right)^2\\), as small as possible.
      It solves the normal equation \\(A\\trans A \\vect{c} = A\\trans \\vect{y}\\).</p>`
    : `<p>With ${N} point${N > 1 ? 's' : ''} and ${d + 1} unknowns, a ${MODELS[d].name.toLowerCase()} can go through every point${N < d + 1 ? ' (in more than one way)' : ''}${N === new Set(pts.map(p => formatFraction(p[0]))).size ? '' : ', unless two points share an \\(x\\)'}.
      The normal equation \\(A\\trans A \\vect{c} = A\\trans \\vect{y}\\) still finds it.</p>`;
  html += normalEquationSteps(pr, s, { A: 'A', x: '\\vect{c}', entry: k => `c_{${k}}`, b: '\\vect{y}' }, 1);
  const approx = s.xstar.some(c => reduce(c).den !== 1n)
    ? ` \\approx ${polyTex(s.xstar.map(c => decimal(toNumber(c)).replace('−', '-')))}` : '';
  html += `<p><strong>The ${MODELS[d].name.toLowerCase()} of best fit</strong>${s.free.length ? ' (the one drawn above)' : ''} is</p>
    ${d$(`${color(FIT_COLOR, `y = ${polyTex(s.xstar)}`)}${approx}.`)}
    <p>Its sum of squared residuals is \\(\\norm{${color(RESID_COLOR, '\\vect{r}')}}^2 = ${inlineNum(s.rr)}\\)${reduce(s.rr).den !== 1n ? ` \\(\\approx ${decimal(toNumber(s.rr)).replace('−', '-')}\\)` : ''}, the total area of the squares in the plot.</p>`;
  if (N <= 3 && d + 1 <= MAX_COLS && N >= 2) {
    html += `<p class="pl-note">With ${N} points, \\(\\vect{y}\\) is in \\(\\reals^${N}\\), so the problem can be drawn as a projection onto \\(\\colspace{A}\\).
      <button type="button" class="pl-small" data-open-lsq>See it in ℝ${N === 2 ? '²' : '³'}</button></p>`;
  }
  return html;
}

/** Opens the current projection or fitting problem as a least squares problem with the same A and b. */
function openAsLeastSquares(): void {
  if (!problem) return;
  const plain = (x: Fraction) => formatFraction(x).replace('−', '-');
  const m = problem.target.length, n = problem.cols.length;
  if (m > MAX_ROWS || n > MAX_COLS) return;
  state.m = m;
  state.n = n;
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) state.A[i][j] = plain(problem.cols[j][i]);
  problem.target.forEach((t, i) => (state.b[i] = plain(t)));
  setMode('lsq');
  $('pl-settings').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ╭───────────────────────────────────────────────────────────────╮
// │                           Settings                            │
// ╰───────────────────────────────────────────────────────────────╯

function entryInput(value: string, label: string, onChange: (text: string) => void, colorHex?: string): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'text';
  input.inputMode = 'decimal';
  input.className = 'pl-entry';
  input.value = value;
  input.setAttribute('aria-label', label);
  if (colorHex) input.style.setProperty('--vec-color', colorHex);
  const mark = () => input.classList.toggle('pl-bad', parseEntry(input.value) === null);
  mark();
  input.addEventListener('input', () => {
    mark();
    onChange(input.value);
    refresh();
    saveUrl();
    draw();
  });
  return input;
}

/** A bracketed column of entries, labeled like "v₁ =". */
function columnEntry(name: string, colorHex: string, values: string[], set: (k: number, text: string) => void, tex = ''): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'pl-vec';
  const label = document.createElement('span');
  label.className = 'pl-name';
  label.style.color = colorHex;
  label.innerHTML = tex ? m(`${mc(colorHex, tex)} =`) : name;
  const bracket = document.createElement('div');
  bracket.className = 'pl-bracket';
  values.forEach((v, k) => bracket.append(entryInput(v, `${name.replace(/<[^>]+>/g, '')} entry ${k + 1}`, t => set(k, t), colorHex)));
  wrap.append(label, bracket);
  return wrap;
}

function buildEntries(): void {
  const box = $('pl-entries');
  box.innerHTML = '';
  if (state.mode === 'proj') {
    for (let i = 0; i < state.count; i++) {
      box.append(columnEntry(`<b>v</b>${sub(i + 1)} =`, COL_COLORS[i], state.vs[i].slice(0, state.dim), (k, t) => (state.vs[i][k] = t), `\\vect{v}_{${i + 1}}`));
    }
    const x = columnEntry('<b>x</b> =', TARGET_COLOR, state.x.slice(0, state.dim), (k, t) => (state.x[k] = t), '\\vect{x}');
    x.classList.add('pl-target');
    box.append(x);
  } else if (state.mode === 'lsq') {
    // A as a grid of entries with each column's color, then b.
    const wrap = document.createElement('div');
    wrap.className = 'pl-vec';
    const label = document.createElement('span');
    label.className = 'pl-name';
    label.innerHTML = m('A =');
    const grid = document.createElement('div');
    grid.className = 'pl-bracket pl-grid';
    grid.style.gridTemplateColumns = `repeat(${state.n}, auto)`;
    for (let i = 0; i < state.m; i++) for (let j = 0; j < state.n; j++) {
      grid.append(entryInput(state.A[i][j], `A row ${i + 1} column ${j + 1}`, t => (state.A[i][j] = t), COL_COLORS[j]));
    }
    wrap.append(label, grid);
    const b = columnEntry('<b>b</b> =', TARGET_COLOR, state.b.slice(0, state.m), (k, t) => (state.b[k] = t), '\\vect{b}');
    b.classList.add('pl-target');
    box.append(wrap, b);
  } else {
    const list = document.createElement('div');
    list.className = 'pl-points';
    state.pts.forEach((p, i) => {
      const item = document.createElement('div');
      item.className = 'pl-point';
      const open = document.createElement('span');
      open.textContent = '(';
      const comma = document.createElement('span');
      comma.textContent = ',';
      const close = document.createElement('span');
      close.textContent = ')';
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'pl-remove';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Remove point ${i + 1}`);
      remove.addEventListener('click', () => {
        state.pts.splice(i, 1);
        afterPointsChange();
      });
      item.append(open, entryInput(p[0], `x of point ${i + 1}`, t => (p[0] = t)), comma,
        entryInput(p[1], `y of point ${i + 1}`, t => (p[1] = t)), close, remove);
      list.append(item);
    });
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'pl-small';
    add.textContent = '+ Point';
    add.disabled = state.pts.length >= MAX_POINTS;
    add.addEventListener('click', () => {
      const xs = dataPoints().map(p => p[0]);
      const next = xs.length ? Math.max(...xs) + 1 : 0;
      state.pts.push([String(next), '0']);
      afterPointsChange();
    });
    list.append(add);
    box.append(list);
  }
}

function afterPointsChange(): void {
  holdChart = false;
  buildEntries();
  refresh();
  saveUrl();
  draw();
}

/** Writes the entries into their fields (after a drag), except the field being typed in. */
function syncEntries(): void {
  const values: string[] = state.mode === 'proj'
    ? [...state.vs.slice(0, state.count).flatMap(v => v.slice(0, state.dim)), ...state.x.slice(0, state.dim)]
    : state.mode === 'lsq'
      ? [...state.A.slice(0, state.m).flatMap(r => r.slice(0, state.n)), ...state.b.slice(0, state.m)]
      : state.pts.flat();
  $('pl-entries').querySelectorAll<HTMLInputElement>('input.pl-entry').forEach((input, i) => {
    if (document.activeElement !== input && values[i] !== undefined) input.value = values[i];
    input.classList.toggle('pl-bad', parseEntry(input.value) === null);
  });
}

function setControls(): void {
  document.querySelectorAll<HTMLButtonElement>('#pl-modes button').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.mode === state.mode)));
  document.querySelectorAll<HTMLElement>('[data-for-mode]').forEach(el =>
    (el.hidden = !el.dataset.forMode!.split(' ').includes(state.mode)));
  $<HTMLSelectElement>('pl-dim').value = String(state.dim);
  $<HTMLSelectElement>('pl-count').value = String(state.count);
  $<HTMLSelectElement>('pl-rows').value = String(state.m);
  $<HTMLSelectElement>('pl-cols').value = String(state.n);
  $<HTMLSelectElement>('pl-degree').value = String(state.degree);
  $<HTMLInputElement>('pl-compare-box').checked = state.compare;
  $<HTMLInputElement>('pl-squares').checked = state.squares;
  // Depth cues only matter for a 3D picture.
  $('pl-cues').hidden = geoDim() !== 3;
  $('pl-plot-hint').textContent = state.mode === 'fit'
    ? 'Drag a data point to move it, or click an empty spot to add one.'
    : geoDim() === 2 ? 'Drag the tip of a vector to move it.' : 'Drag the plot to turn it; fling it to keep it spinning.';
  buildEntries();
  compareKey = '';
}

function setMode(mode: Mode): void {
  state.mode = mode;
  holdChart = false;
  refresh();
  setControls();
  saveUrl();
  box.snap();
  placeOverlay();
  draw();
}

// The settings that change the shape of the problem.
document.querySelectorAll<HTMLButtonElement>('#pl-modes button').forEach(b =>
  b.addEventListener('click', () => setMode(b.dataset.mode as Mode)));
const onSelect = (id: string, apply: (value: number) => void) => $<HTMLSelectElement>(id).addEventListener('change', e => {
  apply(Number((e.target as HTMLSelectElement).value));
  refresh();
  setControls();
  saveUrl();
  draw();
});
onSelect('pl-dim', v => (state.dim = v as 2 | 3));
onSelect('pl-count', v => (state.count = v));
onSelect('pl-rows', v => (state.m = v));
onSelect('pl-cols', v => (state.n = v));
onSelect('pl-degree', v => (state.degree = v));
$<HTMLInputElement>('pl-compare-box').addEventListener('change', e => {
  state.compare = (e.target as HTMLInputElement).checked;
  // Start the comparison point away from the projection, so the difference shows.
  if (state.compare && solution) cand = solution.xstar.map(x => toNumber(x) + 0.6);
  compareKey = '';
  draw();
});
$<HTMLInputElement>('pl-squares').addEventListener('change', e => {
  state.squares = (e.target as HTMLInputElement).checked;
  draw();
});

const CUES_KEY = 'projection_least_squares_depth_cues';
Object.assign(cues, loadJSON<Partial<typeof cues>>(CUES_KEY) ?? {});
for (const [id, cue] of [['pl-perspective', 'perspective'], ['pl-droplines', 'dropLines']] as const) {
  const input = $<HTMLInputElement>(id);
  input.checked = cues[cue];
  input.addEventListener('change', () => {
    cues[cue] = input.checked;
    saveJSON(CUES_KEY, cues);
    draw();
  });
}

// ⋘──────── Examples ────────⋙

type Example =
  | { mode: 'proj'; dim: 2 | 3; vs: string[][]; x: string[] }
  | { mode: 'lsq'; A: string[][]; b: string[] }
  | { mode: 'fit'; degree: number; pts: string[][] };

const EXAMPLES: Record<string, Example> = {
  // From lecture: x₁ = (1, 3) and x₂ = (0, −2) onto v = (4, 2).
  'vec2a': { mode: 'proj', dim: 2, vs: [['4', '2']], x: ['1', '3'] },
  'vec2b': { mode: 'proj', dim: 2, vs: [['4', '2']], x: ['0', '-2'] },
  'line3': { mode: 'proj', dim: 3, vs: [['1', '2', '2']], x: ['3', '0', '3'] },
  'orthPlane': { mode: 'proj', dim: 3, vs: [['1', '1', '0'], ['1', '-1', '1']], x: ['2', '4', '3'] },
  'plane': { mode: 'proj', dim: 3, vs: [['1', '0', '1'], ['1', '1', '0']], x: ['1', '2', '3'] },
  'inW': { mode: 'proj', dim: 3, vs: [['1', '0', '1'], ['1', '1', '0']], x: ['3', '2', '1'] },
  'dependent': { mode: 'proj', dim: 3, vs: [['1', '1', '0'], ['2', '2', '0'], ['0', '1', '1']], x: ['1', '2', '3'] },
  // From lecture (Lay, Example 6.1): x* = (1, 2).
  'lay': { mode: 'lsq', A: [['4', '0'], ['0', '2'], ['1', '1']], b: ['2', '0', '11'] },
  'consistent': { mode: 'lsq', A: [['1', '0'], ['0', '1'], ['1', '1']], b: ['1', '2', '3'] },
  'depCols': { mode: 'lsq', A: [['1', '2'], ['2', '4'], ['1', '2']], b: ['1', '0', '2'] },
  'oneCol': { mode: 'lsq', A: [['4'], ['2']], b: ['1', '3'] },
  'tall': { mode: 'lsq', A: [['1', '0'], ['1', '1'], ['1', '2'], ['1', '3']], b: ['1', '2', '2', '4'] },
  // From lecture: the line of best fit y = −2 + 2x, and the quadratic through the same points.
  'fitLecture': { mode: 'fit', degree: 1, pts: [['3', '0'], ['1', '8'], ['-1', '-8']] },
  'fitQuadLecture': { mode: 'fit', degree: 2, pts: [['3', '0'], ['1', '8'], ['-1', '-8']] },
  'fitFive': { mode: 'fit', degree: 1, pts: [['0', '1'], ['1', '3'], ['2', '2'], ['3', '5'], ['4', '4']] },
  'fitQuad': { mode: 'fit', degree: 2, pts: [['-2', '5'], ['-1', '1.5'], ['0', '0.5'], ['1', '1'], ['2', '4.5'], ['3', '9']] },
  'fitMean': { mode: 'fit', degree: 0, pts: [['1', '2'], ['2', '5'], ['3', '3'], ['4', '6']] },
};

const exampleMenu = $<HTMLSelectElement>('pl-example');
exampleMenu.addEventListener('change', () => {
  const ex = EXAMPLES[exampleMenu.value];
  exampleMenu.value = '';
  if (!ex) return;
  if (ex.mode === 'proj') {
    state.dim = ex.dim;
    state.count = ex.vs.length;
    ex.vs.forEach((v, i) => (state.vs[i] = [...v, '0'].slice(0, 3)));
    state.x = [...ex.x, '0'].slice(0, 3);
  } else if (ex.mode === 'lsq') {
    state.m = ex.A.length;
    state.n = ex.A[0].length;
    ex.A.forEach((r, i) => r.forEach((t, j) => (state.A[i][j] = t)));
    ex.b.forEach((t, i) => (state.b[i] = t));
  } else {
    state.degree = ex.degree;
    state.pts = ex.pts.map(p => [...p]);
  }
  cand = [0.5, 0.5, 0, 0];
  setMode(ex.mode);
});

// ╭───────────────────────────────────────────────────────────────╮
// │                      Pointer interaction                      │
// ╰───────────────────────────────────────────────────────────────╯
// In ℝ², the tips of the vectors can be dragged. In ℝ³, dragging rotates the view (with momentum,
// as in the span tool). In curve fitting, the data points can be dragged, and clicking an empty
// spot adds a point.

const rotator = new Rotator(state, () => { renderAll(); saveState(); });
let dragging: { kind: 'tip'; i: number } | { kind: 'point'; i: number } | { kind: 'rotate' } | null = null;
let touchInput = false;
let hoveredPoint: number | null = null;
// A click that adds a point must not be the end of a drag.
let pressedEmpty: { x: number; y: number } | null = null;

const pointerPos = (e: PointerEvent): [number, number] => {
  const r = canvas.getBoundingClientRect();
  return [e.clientX - r.left, e.clientY - r.top];
};

/** The vector tip within reach of (x, y) in ℝ²: a column's index, or −1 for the target. */
function tipAt(x: number, y: number): number | null {
  if (geoDim() !== 2 || !problem || !solution) return null;
  const g = geometry();
  let best: number | null = null, bestD = touchInput ? 30 : 18;
  [...g.cols, g.target].forEach((v, i) => {
    const [px, py] = mainScene.project(v);
    const d = Math.hypot(px - x, py - y);
    if (d < bestD) { bestD = d; best = i === g.cols.length ? -1 : i; }
  });
  return best;
}

function pointAt(x: number, y: number): number | null {
  if (state.mode !== 'fit' || !chart) return null;
  let best: number | null = null, bestD = touchInput ? 26 : 14;
  state.pts.forEach((p, i) => {
    const px = parseEntry(p[0]), py = parseEntry(p[1]);
    if (!px || !py) return;
    const [sx, sy] = toPx(chart!, toNumber(px), toNumber(py));
    const d = Math.hypot(sx - x, sy - y);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}

/** A number for an entry: rounded to a multiple of `step`, written without float noise. */
function snapText(v: number, step: number): string {
  const decimals = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
  const r = Math.round(v / step) * step;
  return String(Number(r.toFixed(decimals)));
}

canvas.addEventListener('pointerdown', e => {
  touchInput = e.pointerType === 'touch';
  const [x, y] = pointerPos(e);
  rotator.stop();
  pressedEmpty = null;
  const tip = tipAt(x, y), pt = pointAt(x, y);
  if (tip !== null) {
    dragging = { kind: 'tip', i: tip };
    box.setHold(true);
  } else if (pt !== null) {
    dragging = { kind: 'point', i: pt };
    holdChart = true;
  } else if (geoDim() === 3) {
    dragging = { kind: 'rotate' };
    rotator.start(x, y);
  } else {
    if (state.mode === 'fit') pressedEmpty = { x, y };
    return;
  }
  canvas.style.cursor = 'grabbing';
  canvas.setPointerCapture(e.pointerId);
  e.preventDefault();
});

canvas.addEventListener('pointermove', e => {
  const [x, y] = pointerPos(e);
  if (!dragging) {
    const pt = pointAt(x, y);
    if (pt !== hoveredPoint) {
      hoveredPoint = pt;
      if (state.mode === 'fit') renderAll();
    }
    canvas.style.cursor = tipAt(x, y) !== null || pt !== null || geoDim() === 3 ? 'grab'
      : state.mode === 'fit' ? 'crosshair' : 'default';
    return;
  }
  if (dragging.kind === 'rotate') {
    rotator.move(x, y);
    return;
  }
  if (dragging.kind === 'tip') {
    const [wx, wy] = mainScene.unproject2D(x, y);
    const values = [snapText(wx, 0.1), snapText(wy, 0.1)];
    const i = dragging.i;
    if (state.mode === 'proj') {
      const v = i === -1 ? state.x : state.vs[i];
      v[0] = values[0];
      v[1] = values[1];
    } else {
      [0, 1].forEach(k => (i === -1 ? (state.b[k] = values[k]) : (state.A[k][i] = values[k])));
    }
  } else if (chart) {
    const [wx, wy] = fromPx(chart, x, y);
    const step = (c: number) => gridStep(c / 2) / 10;
    state.pts[dragging.i] = [snapText(wx, step(chart.x1 - chart.x0)), snapText(wy, step(chart.y1 - chart.y0))];
  }
  syncEntries();
  refresh();
  draw();
});

const endDrag = (e: PointerEvent) => {
  if (pressedEmpty && e.type === 'pointerup' && chart && state.pts.length < MAX_POINTS) {
    const [x, y] = pointerPos(e);
    if (Math.hypot(x - pressedEmpty.x, y - pressedEmpty.y) < 5
        && x >= chart.left && x <= chart.left + chart.w && y >= chart.top && y <= chart.top + chart.h) {
      const [wx, wy] = fromPx(chart, x, y);
      const step = (c: number) => gridStep(c / 2) / 10;
      state.pts.push([snapText(wx, step(chart.x1 - chart.x0)), snapText(wy, step(chart.y1 - chart.y0))]);
      holdChart = true;  // Keep the axes still, so the point lands where it was clicked.
      buildEntries();
      refresh();
      saveUrl();
      draw();
    }
  }
  pressedEmpty = null;
  if (!dragging) return;
  canvas.style.cursor = 'grab';
  if (dragging.kind === 'rotate') rotator.end(e.type === 'pointerup');
  if (dragging.kind === 'tip') box.setHold(false);
  if (dragging.kind !== 'rotate') saveUrl();
  if (dragging.kind === 'point') {
    holdChart = false;
    draw();
  }
  dragging = null;
};
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
canvas.addEventListener('pointerleave', () => {
  if (dragging) return;
  // Points added by clicking keep the axes still until the pointer leaves the plot.
  if (hoveredPoint !== null || holdChart) {
    hoveredPoint = null;
    holdChart = false;
    renderAll();
  }
});
// While something on the plot is dragged, keep the browser from also scrolling the page.
canvas.addEventListener('touchmove', e => { if (dragging) e.preventDefault(); }, { passive: false });

// The comparison sliders are dragged too, so the axes hold still while one is held.
$('pl-overlay').addEventListener('pointerdown', e => {
  if (!(e.target as HTMLElement).matches('input[type=range]')) return;
  box.setHold(true);
  window.addEventListener('pointerup', () => box.setHold(false), { once: true });
  window.addEventListener('pointercancel', () => box.setHold(false), { once: true });
});

// ╭───────────────────────────────────────────────────────────────╮
// │                   The address and saved state                 │
// ╰───────────────────────────────────────────────────────────────╯
// The problem is kept in the address so it can be shared, written out by hand so commas stay
// readable:
//   ?mode=proj&v1=1,0,1&v2=1,1,0&x=1,2,3
//   ?mode=lsq&A=4,0;0,2;1,1&b=2,0,11
//   ?mode=fit&deg=1&pts=3,0;1,8;-1,-8
// The rest of the state (and every mode's problem) is saved in this browser.

const clean = (t: string) => t.replace(/[^0-9./+\-−]/g, '') || '0';

function saveUrl(): void {
  const parts = [`mode=${state.mode}`];
  if (state.mode === 'proj') {
    state.vs.slice(0, state.count).forEach((v, i) => parts.push(`v${i + 1}=${v.slice(0, state.dim).map(clean).join(',')}`));
    parts.push(`x=${state.x.slice(0, state.dim).map(clean).join(',')}`);
  } else if (state.mode === 'lsq') {
    parts.push(`A=${state.A.slice(0, state.m).map(r => r.slice(0, state.n).map(clean).join(',')).join(';')}`);
    parts.push(`b=${state.b.slice(0, state.m).map(clean).join(',')}`);
  } else {
    parts.push(`deg=${state.degree}`, `pts=${state.pts.map(p => p.map(clean).join(',')).join(';')}`);
  }
  history.replaceState(null, '', `${location.pathname}?${parts.join('&')}`);
}

function loadUrl(): void {
  const params = new URLSearchParams(location.search);
  const mode = params.get('mode');
  if (mode !== 'proj' && mode !== 'lsq' && mode !== 'fit') return;
  state.mode = mode;
  const split = (s: string) => s.split(',').map(t => t.trim());
  if (mode === 'proj') {
    const vs: string[][] = [];
    for (let i = 1; i <= MAX_SPAN && params.has(`v${i}`); i++) vs.push(split(params.get(`v${i}`)!));
    const x = split(params.get('x') ?? '');
    const dim = Math.max(x.length, ...vs.map(v => v.length));
    if (vs.length && (dim === 2 || dim === 3)) {
      state.dim = dim;
      state.count = vs.length;
      vs.forEach((v, i) => (state.vs[i] = [...v, '0', '0', '0'].slice(0, 3)));
      state.x = [...x, '0', '0', '0'].slice(0, 3);
    }
  } else if (mode === 'lsq') {
    const A = (params.get('A') ?? '').split(';').filter(Boolean).map(split);
    const b = split(params.get('b') ?? '');
    const n = Math.max(0, ...A.map(r => r.length));
    if (A.length >= 2 && A.length <= MAX_ROWS && n >= 1 && n <= MAX_COLS) {
      state.m = A.length;
      state.n = n;
      A.forEach((r, i) => { for (let j = 0; j < n; j++) state.A[i][j] = r[j] ?? '0'; });
      for (let i = 0; i < state.m; i++) state.b[i] = b[i] ?? '0';
    }
  } else {
    const deg = Number(params.get('deg'));
    if (deg >= 0 && deg <= 3) state.degree = deg;
    const pts = (params.get('pts') ?? '').split(';').filter(Boolean).map(split).filter(p => p.length === 2);
    if (pts.length) state.pts = pts.slice(0, MAX_POINTS);
  }
}

const STATE_KEY = 'projection_least_squares_state';
let saveTimer = 0;

function saveState(): void {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => saveJSON(STATE_KEY, state), 300);
}

function loadState(): void {
  const saved = loadJSON<Partial<typeof state>>(STATE_KEY);
  if (!saved) return;
  const strings = (a: unknown, rows: number, cols: number) => Array.isArray(a) && a.length === rows
    && a.every(r => Array.isArray(r) && r.length === cols && r.every(t => typeof t === 'string'));
  const strs = (a: unknown, n: number) => Array.isArray(a) && a.length === n && a.every(t => typeof t === 'string');
  if (saved.mode === 'proj' || saved.mode === 'lsq' || saved.mode === 'fit') state.mode = saved.mode;
  if (saved.dim === 2 || saved.dim === 3) state.dim = saved.dim;
  if (typeof saved.count === 'number' && saved.count >= 1 && saved.count <= MAX_SPAN) state.count = saved.count;
  if (strings(saved.vs, 3, 3)) state.vs = saved.vs!;
  if (strs(saved.x, 3)) state.x = saved.x!;
  if (typeof saved.m === 'number' && saved.m >= 2 && saved.m <= MAX_ROWS) state.m = saved.m;
  if (typeof saved.n === 'number' && saved.n >= 1 && saved.n <= MAX_COLS) state.n = saved.n;
  if (strings(saved.A, MAX_ROWS, MAX_COLS)) state.A = saved.A!;
  if (strs(saved.b, MAX_ROWS)) state.b = saved.b!;
  if (typeof saved.degree === 'number' && saved.degree >= 0 && saved.degree <= 3) state.degree = saved.degree;
  if (Array.isArray(saved.pts) && saved.pts.length <= MAX_POINTS && saved.pts.every(p => strs(p, 2))) state.pts = saved.pts;
  if (typeof saved.yaw === 'number' && Number.isFinite(saved.yaw)) state.yaw = saved.yaw;
  if (typeof saved.pitch === 'number' && Math.abs(saved.pitch) <= 1.5) state.pitch = saved.pitch;
  if (typeof saved.compare === 'boolean') state.compare = saved.compare;
  if (typeof saved.squares === 'boolean') state.squares = saved.squares;
}

// ╭───────────────────────────────────────────────────────────────╮
// │                  Panels, small screens, start                 │
// ╰───────────────────────────────────────────────────────────────╯

// On a wide screen the readout box floats over the plot. On a small one it would cover most of the
// plot, so it moves into its own panel above the plot, which can be pinned like the others.
const SMALL_SCREEN = window.matchMedia('(max-width: 700px)');
function placeOverlay(): void {
  const overlay = $('pl-overlay');
  const home = SMALL_SCREEN.matches ? $('pl-overlay-slot') : document.querySelector<HTMLElement>('.pl-stage')!;
  if (overlay.parentElement !== home) home.appendChild(overlay);
  $('pl-overlay-panel').hidden = !SMALL_SCREEN.matches || $('pl-plot-panel').hidden;
  renderAll();
}
SMALL_SCREEN.addEventListener('change', placeOverlay);

const PIN_KEY = 'projection_least_squares_pinned_panels';
const panels = setupPanels('pl', () =>
  saveJSON(PIN_KEY, panels.list.map((panel, i) => (panels.isPinned(panel) ? i : -1)).filter(i => i >= 0)));
const savedPins = loadJSON<number[]>(PIN_KEY);
if (Array.isArray(savedPins)) for (const i of savedPins) if (panels.list[i]) panels.setPinned(panels.list[i], true);

setupHelp('pl');
loadState();
loadUrl();
refresh();
setControls();
saveUrl();
box.snap();
placeOverlay();
draw();
const resizer = new ResizeObserver(() => renderAll());
resizer.observe(canvas);
resizer.observe($('pl-overlay'));
SIDE_VIEWS.forEach(v => resizer.observe(v.canvas));
