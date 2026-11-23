// ╭───────────────────────────────────────────────────────────────╮
// │        Discrete-time linear systems: x_{k+1} = A x_k           │
// ╰───────────────────────────────────────────────────────────────╯
// The page /tools/discrete_linear_system/ (collections/_pages/discrete_linear_system.html).
// The visitor types a 2 × 2 matrix A and a starting state x₀ (or drags x₀ in the plot), then steps
// or plays through the states x₀, x₁ = Ax₀, …, x_N. The picture shows the eigenvector lines of A,
// and splits the current state into its eigenvector parts c₁λ₁ᵏv₁ and c₂λ₂ᵏv₂, so it is visible
// that each part changes on its own. Two graphs plot the coordinates of x_k and its eigenvector
// coefficients against k. The math is in discrete_system/system_math.ts.

import { setupHelp } from "./common/help";
import { mathHTML, typeset } from "./common/mathjax";
import { setupPanels } from "./common/panels";
import { replaceQuery } from "./common/query";
import { loadJSON, saveJSON } from "./common/storage";
import { parseEntry } from "./matrix/fraction";
import {
  EigenInfo, Mat2, Vec2, apply, coordinates, eigenInfo, fate, norm, snapToLine, stepBetween, trajectory,
} from "./discrete_system/system_math";
import { SHARE_KEYS, decodeSettings, encodeSettings } from "./discrete_system/share";

const SETTINGS_KEY = "discrete_linear_system";
const PIN_KEY = "discrete_linear_system_pins";
// Okabe–Ito: blue and vermillion (orange) for the eigenvectors and their parts, bluish green and
// reddish purple for the two coordinates, black for the states, and gray-blue for the circle.
const EIG_COLORS = ["#0072B2", "#D55E00"];
const COORD_COLORS = ["#009E73", "#CC79A7"];
const STATE_COLOR = "#000000";
const CIRCLE_COLOR = "#5f7896";
const SNAP = (2.5 * Math.PI) / 180;
const PLAY_INTERVAL_MS = 450;
const STEP_ANIMATION_MS = 330;    // Shorter than a Play step, so each step finishes before the next
const GHOST_ALPHA = 0.3;          // The previous state's arrow fades to this
const CIRCLE_DOTS = 12;

interface Example { A: string[]; x0: string[]; steps?: number }
const EXAMPLES: Record<string, Example> = {
  saddle: { A: ["1", "1", "0.1", "1"], x0: ["-5", "2"], steps: 20 },
  decay: { A: ["0.7", "0.2", "0.2", "0.4"], x0: ["-1", "1.5"], steps: 20 },
  grow: { A: ["1.3", "0.1", "0.2", "1.2"], x0: ["1", "-0.5"], steps: 10 },
  markov: { A: ["0.9", "0.2", "0.1", "0.8"], x0: ["0", "3"], steps: 20 },
  flip: { A: ["0.1", "0.9", "0.9", "0.1"], x0: ["2", "0"], steps: 20 },
  fib: { A: ["1", "1", "1", "0"], x0: ["1", "0"], steps: 10 },
  scalar: { A: ["0.8", "0", "0", "0.8"], x0: ["1.5", "1"], steps: 20 },
  defective: { A: ["0.9", "0.5", "0", "0.9"], x0: ["0", "2"], steps: 50 },
  rotate: { A: ["0.8", "-0.6", "0.6", "0.8"], x0: ["2", "0"], steps: 20 },
  spiralin: { A: ["0.8", "-0.5", "0.5", "0.8"], x0: ["2", "0"], steps: 30 },
  spiralout: { A: ["1", "-0.3", "0.3", "1"], x0: ["1", "0"], steps: 30 },
};

interface Saved { A?: string[]; x0?: string[]; steps?: number; k?: number; lines?: boolean; parts?: boolean; circle?: boolean }

const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const $ = (tex: string) => `\\(${tex}\\)`;
const $$ = (tex: string) => `\\[${tex}\\]`;
const SUBSCRIPTS = "₀₁₂₃₄₅₆₇₈₉";
const sub = (k: number) => String(k).split("").map(d => SUBSCRIPTS[+d]).join("");
const toNum = (s: string): number | null => {
  const f = parseEntry(s.trim() === "" ? "x" : s);
  return f ? Number(f.num) / Number(f.den) : null;
};

// ⋘──────── Number formats ────────⋙

/** Fixed decimals (for numbers that change while dragging), with huge or tiny numbers in TeX powers of 10. */
function fixedTex(x: number, digits = 2): string {
  const size = Math.abs(x);
  if (size >= 1e5 || (size > 0 && size < 0.5 * 10 ** -digits && size >= 1e-12)) {
    const e = Math.floor(Math.log10(size));
    return `${(x / 10 ** e).toFixed(digits)} \\times 10^{${e}}`;
  }
  return (size < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits);
}
/** Plain text with a typographic minus, for the canvas and the status line. */
const fixedText = (x: number, digits = 2) => fixedTex(x, digits).replace(/ \\times 10\^\{(-?\d+)\}/, "×10^$1").replace(/-/g, "−");
/** Up to three decimals, without trailing zeros, for values that don't change while dragging. */
const short = (x: number) => `${+x.toFixed(3)}`;
const shortText = (x: number) => short(x).replace("-", "−");
/** "= 1.5" if `x` is exactly 1.5, or "\approx 1.618" if it was rounded. */
const eqTex = (x: number) => (Math.abs(+x.toFixed(3) - x) > 1e-9 ? "\\approx " : "= ") + short(x);
/** An angle in degrees, to one decimal: "= 90" or "\approx 32.0". */
const degTex = (deg: number) => (Math.abs(+deg.toFixed(1) - deg) > 1e-9 ? `\\approx ${deg.toFixed(1)}` : `= ${+deg.toFixed(1)}`);
const colTex = (v: string[]) => `\\begin{bmatrix} ${v.join(" \\\\ ")} \\end{bmatrix}`;
const vecShort = (v: Vec2) => colTex(v.map(short));
const vecFixed = (v: Vec2) => colTex(v.map(x => fixedTex(x)));
const paren = (t: string) => `\\left(${t}\\right)`;

function initPage(): void {
  const canvas = byId<HTMLCanvasElement>("dls-canvas");
  const ctx = canvas.getContext("2d")!;
  const aInputs = ["dls-a00", "dls-a01", "dls-a10", "dls-a11"].map(id => byId<HTMLInputElement>(id));
  const xInputs = ["dls-x0", "dls-x1"].map(id => byId<HTMLInputElement>(id));
  const example = byId<HTMLSelectElement>("dls-example");
  const stepsSelect = byId<HTMLSelectElement>("dls-steps");
  const showLines = byId<HTMLInputElement>("dls-show-lines");
  const showParts = byId<HTMLInputElement>("dls-show-parts");
  const showCircle = byId<HTMLInputElement>("dls-show-circle");
  const slider = byId<HTMLInputElement>("dls-k");
  const kLabel = byId<HTMLSpanElement>("dls-k-label");
  const playButton = byId<HTMLButtonElement>("dls-play");
  const resetButton = byId<HTMLButtonElement>("dls-reset");
  const backButton = byId<HTMLButtonElement>("dls-back");
  const forwardButton = byId<HTMLButtonElement>("dls-forward");
  const eigList = byId<HTMLUListElement>("dls-eigs");
  const sumBox = byId<HTMLDivElement>("dls-sum");
  const status = byId<HTMLParagraphElement>("dls-status");
  const graphXY = byId<HTMLCanvasElement>("dls-graph-xy");
  const graphEig = byId<HTMLCanvasElement>("dls-graph-eig");
  const eigLegend = byId<HTMLParagraphElement>("dls-eig-legend");
  const eigNote = byId<HTMLParagraphElement>("dls-eig-note");
  const analysis = byId<HTMLDivElement>("dls-analysis");

  // ⋘──────── State ────────⋙
  let A: Mat2 = [[1, 1], [0.25, 1]];
  let x0: Vec2 = [0.5, 1];
  let steps = 20;
  let k = 0;
  let info: EigenInfo = eigenInfo(A);
  let xs: Vec2[] = [];
  let coeffs: Vec2 | null = null;     // c₁, c₂ in the case of two distinct real eigenvalues
  let playTimer: number | null = null;
  let dragging = false;

  // Settings in the address (from a shared link) win over the ones saved in this browser.
  const stepChoices = [...stepsSelect.options].map(o => +o.value);
  const saved: Saved = { ...(loadJSON<Saved>(SETTINGS_KEY) ?? {}), ...decodeSettings(location.search, e => toNum(e) !== null, stepChoices) };
  const validEntries = (e: unknown, n: number): e is string[] =>
    Array.isArray(e) && e.length === n && e.every(s => typeof s === "string" && toNum(s) !== null);
  const startA = validEntries(saved.A, 4) ? saved.A : EXAMPLES.saddle.A;
  const startX = validEntries(saved.x0, 2) ? saved.x0 : EXAMPLES.saddle.x0;
  aInputs.forEach((input, i) => { input.value = startA[i]; });
  xInputs.forEach((input, i) => { input.value = startX[i]; });
  if (typeof saved.steps === "number" && [...stepsSelect.options].some(o => +o.value === saved.steps)) stepsSelect.value = String(saved.steps);
  else stepsSelect.value = String(EXAMPLES.saddle.steps);
  if (typeof saved.lines === "boolean") showLines.checked = saved.lines;
  if (typeof saved.parts === "boolean") showParts.checked = saved.parts;
  if (typeof saved.circle === "boolean") showCircle.checked = saved.circle;
  steps = +stepsSelect.value;
  if (typeof saved.k === "number" && Number.isInteger(saved.k)) k = Math.min(Math.max(saved.k, 0), steps);

  // Saves the settings in this browser and in the page's address, so the address can be shared.
  function save(): void {
    const settings = {
      A: aInputs.map(i => i.value), x0: xInputs.map(i => i.value), steps, k,
      lines: showLines.checked, parts: showParts.checked, circle: showCircle.checked,
    } satisfies Saved;
    saveJSON(SETTINGS_KEY, settings);
    replaceQuery(SHARE_KEYS, encodeSettings(settings));
  }

  // ⋘──────── Reading the entries ────────⋙
  function readMatrix(): boolean {
    const values = aInputs.map(input => toNum(input.value));
    aInputs.forEach((input, i) => input.classList.toggle("dls-bad", values[i] === null));
    if (values.some(v => v === null)) return false;
    const v = values as number[];
    A = [[v[0], v[1]], [v[2], v[3]]];
    info = eigenInfo(A);
    return true;
  }

  function readX0(): boolean {
    const values = xInputs.map(input => toNum(input.value));
    xInputs.forEach((input, i) => input.classList.toggle("dls-bad", values[i] === null));
    if (values.some(v => v === null)) return false;
    x0 = values as Vec2;
    return true;
  }

  function recompute(): void {
    xs = trajectory(A, x0, steps);
    coeffs = info.kind === "real" ? coordinates(info.vectors, x0) : null;
  }

  // Which eigenvector line x₀ lies on (0 or 1), if any: a coefficient that is tiny next to the other.
  function lineOfX0(): number | null {
    if (!coeffs || info.kind !== "real") return null;
    const sizes = coeffs.map((c, i) => Math.abs(c) * norm(info.kind === "real" ? info.vectors[i] : [0, 0]));
    if (Math.max(...sizes) < 1e-12) return null;
    if (sizes[1] <= 1e-9 * sizes[0]) return 0;
    if (sizes[0] <= 1e-9 * sizes[1]) return 1;
    return null;
  }

  // ⋘──────── The plane ────────⋙
  let width = 0, height = 0, scale = 1;
  let R = 2;           // Half the width of the plot, in plot units, as drawn (eased toward `targetR`)
  let targetR = 2;
  let easing: number | null = null;
  const toPx = (x: number, y: number): [number, number] => [width / 2 + x * scale, height / 2 - y * scale];
  const fromPx = (px: number, py: number): Vec2 => [(px - width / 2) / scale, (height / 2 - py) / scale];

  function niceStep(span: number, ticks = 6): number {
    const raw = span / ticks;
    const p = 10 ** Math.floor(Math.log10(raw));
    for (const m of [1, 2, 5, 10]) if (raw <= m * p) return m * p;
    return 10 * p;
  }

  function matPow(n: number): Mat2 {
    let M: Mat2 = [[1, 0], [0, 1]];
    for (let i = 0; i < n; i++) M = [[A[0][0] * M[0][0] + A[0][1] * M[1][0], A[0][0] * M[0][1] + A[0][1] * M[1][1]],
      [A[1][0] * M[0][0] + A[1][1] * M[1][0], A[1][0] * M[0][1] + A[1][1] * M[1][1]]];
    return M;
  }

  // The points of the circle through x₀, after `n` steps.
  function circleAt(n: number, count: number): Vec2[] {
    const r = norm(x0), start = Math.atan2(x0[1], x0[0]);
    const M = matPow(n);
    return Array.from({ length: count }, (_, i) => {
      const t = start + (2 * Math.PI * i) / count;
      return apply(M, [r * Math.cos(t), r * Math.sin(t)]);
    });
  }

  // The plot fits every state up to the current one, so it zooms out as the states grow, but keeps
  // x₀ in view as they shrink. While x₀ is dragged, the scale stays put.
  function fitTarget(): number {
    let reach = 0;
    for (let j = 0; j <= k; j++) reach = Math.max(reach, norm(xs[j]));
    if (showCircle.checked) {
      for (let j = 0; j <= k; j++) for (const p of circleAt(j, 24)) reach = Math.max(reach, norm(p));
    }
    // The eigenvector arrows v₁ and v₂, too.
    if (showLines.checked) {
      const vs = info.kind === "real" ? info.vectors : info.kind === "defective" ? [info.vector] : [];
      for (const v of vs) reach = Math.max(reach, norm(v));
    }
    if (!Number.isFinite(reach)) reach = 1e12;
    return reach > 1e-9 ? reach * 1.2 : 2;
  }

  function refit(immediately = false): void {
    if (dragging) return;
    targetR = fitTarget();
    if (immediately) R = targetR;
    if (easing === null) easing = requestAnimationFrame(easeStep);
  }

  function easeStep(): void {
    easing = null;
    const ratio = targetR / R;
    if (Math.abs(Math.log(ratio)) < 0.003) R = targetR;
    else R *= ratio ** 0.25;
    drawPlane();
    if (R !== targetR) easing = requestAnimationFrame(easeStep);
  }

  function arrowBetween(from: Vec2, to: Vec2, color: string, lineWidth: number, dashed = false): void {
    const [x0p, y0p] = toPx(...from), [x1, y1] = toPx(...to);
    const len = Math.hypot(x1 - x0p, y1 - y0p);
    if (len < 1) return;
    const ux = (x1 - x0p) / len, uy = (y1 - y0p) / len;
    const head = Math.min(12, len * 0.45);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    if (dashed) ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(x0p, y0p);
    ctx.lineTo(x1 - ux * head * 0.8, y1 - uy * head * 0.8);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - ux * head - uy * head * 0.45, y1 - uy * head + ux * head * 0.45);
    ctx.lineTo(x1 - ux * head + uy * head * 0.45, y1 - uy * head - ux * head * 0.45);
    ctx.closePath();
    ctx.fill();
  }

  function label(text: string, x: number, y: number, color: string, dx: number, dy: number): void {
    const [px, py] = toPx(x, y);
    ctx.font = "bold 15px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    const half = ctx.measureText(text).width / 2 + 4;
    const tx = Math.min(Math.max(px + dx, half), width - half), ty = Math.min(Math.max(py + dy, 12), height - 12);
    ctx.strokeText(text, tx, ty);
    ctx.fillStyle = color;
    ctx.fillText(text, tx, ty);
  }

  // An offset of `d` pixels away from the origin, in the direction of v.
  const outward = (v: Vec2, d: number): [number, number] => {
    const n = norm(v) || 1;
    return [(d * v[0]) / n, (-d * v[1]) / n];
  };

  function sizeCanvas(c: HTMLCanvasElement, context: CanvasRenderingContext2D): [number, number] {
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, w, h);
    return [w, h];
  }

  function drawPlane(): void {
    [width, height] = sizeCanvas(canvas, ctx);
    if (width === 0 || height === 0) return;
    scale = Math.min(width, height) / (2 * R);
    const halfW = width / 2 / scale, halfH = height / 2 / scale;

    // The grid and axes, with tick labels.
    const step = niceStep(2 * R);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(128, 128, 128, 0.16)";
    ctx.beginPath();
    for (let i = Math.ceil(-halfW / step); i * step <= halfW; i++) {
      const [px] = toPx(i * step, 0);
      ctx.moveTo(px, 0); ctx.lineTo(px, height);
    }
    for (let i = Math.ceil(-halfH / step); i * step <= halfH; i++) {
      const [, py] = toPx(0, i * step);
      ctx.moveTo(0, py); ctx.lineTo(width, py);
    }
    ctx.stroke();
    ctx.strokeStyle = "rgba(60, 64, 67, 0.55)";
    ctx.beginPath();
    const [ox, oy] = toPx(0, 0);
    ctx.moveTo(0, oy); ctx.lineTo(width, oy);
    ctx.moveTo(ox, 0); ctx.lineTo(ox, height);
    ctx.stroke();
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillStyle = "#80868b";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const tick = (v: number) => (Math.abs(v) >= 1e5 ? v.toExponential(0) : `${+v.toPrecision(6)}`).replace("-", "−");
    for (let i = Math.ceil(-halfW / step); i * step <= halfW; i++) {
      if (i === 0) continue;
      const [px] = toPx(i * step, 0);
      if (px > 14 && px < width - 14) ctx.fillText(tick(i * step), px, oy + 3);
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = Math.ceil(-halfH / step); i * step <= halfH; i++) {
      if (i === 0) continue;
      const [, py] = toPx(0, i * step);
      if (py > 8 && py < height - 8) ctx.fillText(tick(i * step), ox - 4, py);
    }

    // The eigenvector lines, each labeled with its eigenvalue. The eigenvectors listed in the
    // readout (v₁ and v₂) are drawn as arrows later, on top of the eigenvector parts.
    const lines: { v: Vec2; text: string; name: string; color: string }[] = [];
    if (showLines.checked) {
      if (info.kind === "real") {
        info.vectors.forEach((v, i) => lines.push({ v, text: `λ${sub(i + 1)} = ${shortText(info.kind === "real" ? info.values[i] : 0)}`, name: `v${sub(i + 1)}`, color: EIG_COLORS[i] }));
      } else if (info.kind === "defective") {
        lines.push({ v: info.vector, text: `λ = ${shortText(info.value)}`, name: "v", color: EIG_COLORS[0] });
      }
      for (const line of lines) {
        const n = norm(line.v);
        let c = line.v[0] / n, s = line.v[1] / n;
        if (s < 0 || (s === 0 && c < 0)) { c = -c; s = -s; }   // Label the upper end
        const far = 3 * R;
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(...toPx(-far * c, -far * s));
        ctx.lineTo(...toPx(far * c, far * s));
        ctx.stroke();
        ctx.setLineDash([]);
        const t = 0.82 * Math.min(halfW / Math.max(Math.abs(c), 1e-9), halfH / Math.max(Math.abs(s), 1e-9));
        label(line.text, t * c, t * s, line.color, -42 * s, -16 * c);
      }
    }

    // While a step is animated (animT is not null), the newest state moves from x_{k−1} toward x_k.
    const moving = (p: Vec2) => (animT === null ? apply(A, p) : stepBetween(A, info, p, animT));
    const circleNow = (count: number) => (animT === null ? circleAt(k, count) : circleAt(k - 1, count).map(moving));

    // The circle of starting states, after k steps, with some of its points.
    if (showCircle.checked && norm(x0) > 0) {
      const curve = circleNow(180);
      ctx.strokeStyle = CIRCLE_COLOR;
      ctx.lineWidth = 2;
      ctx.beginPath();
      curve.forEach((p, i) => { const [px, py] = toPx(...p); if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); });
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = CIRCLE_COLOR;
      for (const p of circleNow(CIRCLE_DOTS)) {
        const [px, py] = toPx(...p);
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // The path x₀ → x₁ → ⋯ → x_k, with a dot at each state.
    const xk = animT === null || k === 0 ? xs[k] : moving(xs[k - 1]);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let j = 0; j <= k; j++) {
      const [px, py] = toPx(...(j === k ? xk : xs[j]));
      if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    for (let j = 1; j < k; j++) {
      const [px, py] = toPx(...xs[j]);
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, 2 * Math.PI);
      ctx.fill();
    }

    // The eigenvector parts of x_k: two arrows from the origin, and dashed lines that complete the
    // parallelogram whose diagonal is x_k.
    if (showParts.checked && info.kind === "real" && coeffs) {
      const vectors = info.vectors, c = coordinates(vectors, xk);
      const parts = [0, 1].map(i => [c[i] * vectors[i][0], c[i] * vectors[i][1]] as Vec2);
      ctx.strokeStyle = "rgba(95, 99, 104, 0.6)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (const p of parts) { ctx.moveTo(...toPx(...p)); ctx.lineTo(...toPx(...xk)); }
      ctx.stroke();
      ctx.setLineDash([]);
      parts.forEach((p, i) => arrowBetween([0, 0], p, EIG_COLORS[i], 3));
    }

    // The eigenvectors v₁ and v₂ from the readout: thin arrows with a white edge, so they stand out
    // where they overlap the eigenvector parts.
    for (const line of lines) {
      arrowBetween([0, 0], line.v, "#fff", 5);
      arrowBetween([0, 0], line.v, line.color, 2);
      const n = norm(line.v);
      label(line.name, line.v[0], line.v[1], line.color, ...outward(line.v, 4).map((d, j) => d + (j === 0 ? -1 : 1) * 17 * [line.v[1], line.v[0]][j] / n) as [number, number]);
    }

    // The previous state, as a faded arrow: it fades as the new state moves away from it.
    if (k > 0) {
      ctx.globalAlpha = animT === null ? GHOST_ALPHA : 1 - (1 - GHOST_ALPHA) * animT;
      arrowBetween([0, 0], xs[k - 1], STATE_COLOR, 3);
      ctx.globalAlpha = 1;
    }

    // The current state, as an arrow, and x₀ as a handle.
    arrowBetween([0, 0], xk, STATE_COLOR, 3);
    const [hx, hy] = toPx(...x0);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = STATE_COLOR;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(hx, hy, 6.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    label("x₀", x0[0], x0[1], STATE_COLOR, ...outward(x0, 18));
    if (k > 0 && Math.hypot(...toPx(...xk).map((p, i) => p - [hx, hy][i])) > 20) {
      label(`x${sub(k)}`, xk[0], xk[1], STATE_COLOR, ...outward(xk, 20));
    }
  }

  // ⋘──────── Graphs against k ────────⋙
  function drawGraph(c: HTMLCanvasElement, series: { values: number[]; color: string }[]): void {
    const g = c.getContext("2d")!;
    const [w, h] = sizeCanvas(c, g);
    if (w === 0 || h === 0) return;
    const left = 46, right = 24, top = 10, bottom = 24;
    let lo = 0, hi = 0;
    for (const s of series) for (let j = 0; j <= k; j++) {
      if (Number.isFinite(s.values[j])) { lo = Math.min(lo, s.values[j]); hi = Math.max(hi, s.values[j]); }
    }
    if (hi - lo < 1e-12) { hi += 1; lo -= 1; }
    const pad = 0.08 * (hi - lo);
    lo -= pad; hi += pad;
    const X = (j: number) => left + ((w - left - right) * j) / steps;
    const Y = (v: number) => top + ((h - top - bottom) * (hi - v)) / (hi - lo);

    // Grid lines and tick labels.
    g.font = "11px system-ui, sans-serif";
    g.fillStyle = "#80868b";
    g.lineWidth = 1;
    const yStep = niceStep(hi - lo, 4);
    g.textAlign = "right";
    g.textBaseline = "middle";
    for (let i = Math.ceil(lo / yStep); i * yStep <= hi; i++) {
      const y = Y(i * yStep);
      g.strokeStyle = i === 0 ? "rgba(60, 64, 67, 0.55)" : "rgba(128, 128, 128, 0.16)";
      g.beginPath(); g.moveTo(left, y); g.lineTo(w - right, y); g.stroke();
      const v = i * yStep;
      g.fillText((Math.abs(v) >= 1e5 ? v.toExponential(0) : `${+v.toPrecision(6)}`).replace("-", "−"), left - 5, y);
    }
    const xStep = Math.max(1, niceStep(steps, 5));
    g.textAlign = "center";
    g.textBaseline = "top";
    for (let j = 0; j <= steps; j += xStep) g.fillText(String(j), X(j), h - bottom + 5);
    g.textAlign = "left";
    g.fillText("k", w - right + 9, h - bottom - 14);

    // The current step.
    g.strokeStyle = "rgba(0, 0, 0, 0.25)";
    g.setLineDash([4, 4]);
    g.beginPath(); g.moveTo(X(k), top); g.lineTo(X(k), h - bottom); g.stroke();
    g.setLineDash([]);

    // Each series: points joined by thin lines, up to step k.
    g.save();
    g.beginPath();
    g.rect(left, 0, w - left - right + 6, h);
    g.clip();
    for (const s of series) {
      g.strokeStyle = s.color;
      g.globalAlpha = 0.5;
      g.lineWidth = 1.5;
      g.beginPath();
      for (let j = 0; j <= k; j++) { if (j === 0) g.moveTo(X(j), Y(s.values[j])); else g.lineTo(X(j), Y(s.values[j])); }
      g.stroke();
      g.globalAlpha = 1;
      g.fillStyle = s.color;
      for (let j = 0; j <= k; j++) {
        g.beginPath();
        g.arc(X(j), Y(s.values[j]), j === k ? 4.5 : 3, 0, 2 * Math.PI);
        g.fill();
      }
    }
    g.restore();
  }

  function drawGraphs(): void {
    drawGraph(graphXY, [0, 1].map(i => ({ values: xs.map(x => x[i]), color: COORD_COLORS[i] })));
    const real = info.kind === "real" && coeffs !== null;
    graphEig.hidden = !real;
    eigLegend.hidden = !real;
    eigNote.hidden = real;
    if (real && info.kind === "real" && coeffs) {
      const c = coeffs, values = info.values;
      drawGraph(graphEig, [0, 1].map(i => ({ values: xs.map((_, j) => c[i] * values[i] ** j), color: EIG_COLORS[i] })));
    } else {
      eigNote.textContent = info.kind === "complex"
        ? "A has complex eigenvalues, so it has no real eigenvectors to split the states into."
        : info.kind === "scalar"
          ? "A = λI, so every nonzero vector is an eigenvector, and each state is λ times the one before."
          : "A has only one eigenvector line, so the states can't be split into two eigenvector parts.";
    }
  }

  // ⋘──────── Readout ────────⋙
  const redrawReadout = () => updateReadout();

  function eigenItems(): string {
    const m = (tex: string) => mathHTML(tex, redrawReadout);
    const swatch = (color: string) => `<span class="dls-swatch" style="color: ${color}"></span>`;
    switch (info.kind) {
      case "real":
        return info.values.map((value, i) => `<li style="color: ${EIG_COLORS[i]}">${swatch(EIG_COLORS[i])}${m(`\\lambda_${i + 1} ${eqTex(value)}, \\enspace \\vect{v}_${i + 1} = (${(info.kind === "real" ? info.vectors[i] : [0, 0]).map(short).join(", ")})`)}</li>`).join("");
      case "scalar":
        return `<li>${m(`\\lambda ${eqTex(info.value)}`)} (repeated); every nonzero vector is an eigenvector</li>`;
      case "defective":
        return `<li style="color: ${EIG_COLORS[0]}">${swatch(EIG_COLORS[0])}${m(`\\lambda ${eqTex(info.value)}, \\enspace \\vect{v} = (${info.vector.map(short).join(", ")})`)}</li><li>(repeated, with one eigenvector line)</li>`;
      case "complex":
        return `<li>${m(`\\lambda = ${short(info.re)} \\pm ${short(info.im)} i`)}</li><li>${m(`|\\lambda| ${eqTex(info.modulus)}`)}, turning ${m(`\\theta ${degTex((info.angle * 180) / Math.PI)}^\\circ`)} per step</li>`;
    }
  }

  function sumTex(): string[] {
    const xk = xs[k];
    const K = `{${k}}`;
    if (info.kind === "real" && coeffs) {
      const c = coeffs, l = info.values;
      // Each eigenvector's term in its color, as in the eigenvalue list and the plot.
      const rgb = (hex: string) => [1, 3, 5].map(j => parseInt(hex.slice(j, j + 2), 16)).join(",");
      const col = (i: number, tex: string) => `{\\color[RGB]{${rgb(EIG_COLORS[i])}}${tex}}`;
      const general = `\\vect{x}_${K} = ${col(0, `c_1 \\lambda_1^${K} \\vect{v}_1`)} + ${col(1, `c_2 \\lambda_2^${K} \\vect{v}_2`)}`;
      const term = (i: number) => col(i, `${paren(fixedTex(c[i]))}${paren(fixedTex(l[i]))}^${K} \\vect{v}_${i + 1}`);
      const f = [0, 1].map(i => c[i] * l[i] ** k);
      const second = `${f[1] < 0 ? "-" : "+"} ${col(1, `${fixedTex(Math.abs(f[1]))}\\vect{v}_2`)}`;
      return [general, `= ${term(0)} + ${term(1)}`, `= ${col(0, `${fixedTex(f[0])}\\vect{v}_1`)} ${second}`, `= ${vecFixed(xk)}`];
    }
    if (info.kind === "scalar") {
      return [`\\vect{x}_${K} = \\lambda^${K} \\vect{x}_0 = ${paren(short(info.value))}^${K} ${vecFixed(x0)}`, `= ${vecFixed(xk)}`];
    }
    return [`\\vect{x}_${K} = A^${K} \\vect{x}_0 = ${vecFixed(xk)}`];
  }

  function updateReadout(): void {
    eigList.innerHTML = eigenItems();
    sumBox.innerHTML = sumTex().map(t => `<div>${mathHTML(t, redrawReadout)}</div>`).join("");
    const s = statusText();
    status.innerHTML = s.text;
    status.classList.toggle("dls-on-line", s.color !== null);
    status.style.setProperty("--dls-line-color", s.color ?? "");
  }

  // ⋘──────── What the states do ────────⋙
  // A sentence for the readout (plain text, updated while dragging) and the analysis below.
  function statusText(): { text: string; color: string | null } {
    const size = (x: number) => (Math.abs(x) < 1 - 1e-9 ? "shrinks" : Math.abs(x) > 1 + 1e-9 ? "grows" : "keeps its size");
    const flips = (x: number) => (x < 0 ? ", flipping sign at each step" : "");
    if (norm(x0) < 1e-12) return { text: "x₀ = 0, so every state is 0.", color: null };
    switch (info.kind) {
      case "real": {
        const [l1, l2] = info.values;
        const on = lineOfX0();
        if (on !== null) {
          const l = info.values[on];
          return {
            text: `<strong>x₀ is on the v${sub(on + 1)} line</strong>, so it is an eigenvector: every state stays on that line, and x<sub>k</sub> = (${shortText(l)})<sup>k</sup> x₀. Each step, the state ${size(l)}${flips(l)}.`,
            color: EIG_COLORS[on],
          };
        }
        const parts = `Each step, the v₁ part ${size(l1)}${flips(l1)}, and the v₂ part ${size(l2)}${flips(l2)}.`;
        const f = fate(info);
        if (Math.abs(Math.abs(l1) - Math.abs(l2)) < 1e-9) {
          return { text: `${parts} The parts change size at the same rate, so neither one takes over.`, color: null };
        }
        const end = f === "decays" ? "The v₂ part shrinks faster, so the states approach 0 along the v₁ line."
          : f === "grows" ? "The v₁ part grows faster, so the states end up nearly on the v₁ line, growing."
            : f === "saddle" ? "The v₂ part fades away, so the states end up nearly on the v₁ line, growing."
              : Math.abs(l1 - 1) < 1e-9 ? `The v₂ part fades away, so the states approach c₁v₁ = (${xsLimit().map(x => fixedText(x)).join(", ")}).`
                : "The v₂ part fades away, so the states end up jumping between c₁v₁ and −c₁v₁.";
        return { text: `${parts} ${end}`, color: null };
      }
      case "scalar": {
        const l = info.value;
        return { text: `A = λI, so every nonzero vector is an eigenvector, and x<sub>k</sub> = (${shortText(l)})<sup>k</sup> x₀ stays on the line through x₀. Each step, the state ${size(l)}${flips(l)}.`, color: EIG_COLORS[0] };
      }
      case "defective": {
        const l = info.value;
        if (Math.abs(x0[0] * info.vector[1] - x0[1] * info.vector[0]) < 1e-9 * norm(x0) * norm(info.vector)) {
          return { text: `<strong>x₀ is on the eigenvector line</strong>, so every state stays on it, and x<sub>k</sub> = (${shortText(l)})<sup>k</sup> x₀.`, color: EIG_COLORS[0] };
        }
        const where = Math.abs(l) < 1 - 1e-9 ? "Because |λ| < 1, the states still approach 0, but they first swing toward the line."
          : "The states grow at least like k, turning toward the eigenvector line.";
        return { text: `A has only one eigenvector line. States off the line turn toward it at each step: x<sub>k</sub> = λ<sup>k</sup>x₀ + kλ<sup>k−1</sup>(A − λI)x₀. ${where}`, color: null };
      }
      case "complex": {
        const r = info.modulus;
        const shape = r < 1 - 1e-9 ? "spiral inward to 0" : r > 1 + 1e-9 ? "spiral outward" : "go around one ellipse";
        return { text: `No real vector keeps its direction, so the states circle the origin, about ${+((info.angle * 180) / Math.PI).toFixed(1)}° per step on average. Because |λ| = ${shortText(r)}, they ${shape}.`, color: null };
      }
    }
  }

  // The limit c₁v₁, when λ₁ = 1.
  function xsLimit(): Vec2 {
    if (info.kind !== "real" || !coeffs) return [0, 0];
    return [coeffs[0] * info.vectors[0][0], coeffs[0] * info.vectors[0][1]];
  }

  // ⋘──────── The analysis below the plots (typeset, so not redone while dragging) ────────⋙
  let analysisTimer: number | null = null;
  function scheduleAnalysis(): void {
    if (analysisTimer !== null) window.clearTimeout(analysisTimer);
    analysisTimer = window.setTimeout(() => { analysisTimer = null; writeAnalysis(); }, 250);
  }

  function writeAnalysis(): void {
    const Atex = colTexMat(A);
    const parts: string[] = [];
    const x0tex = vecFixed(x0);
    switch (info.kind) {
      case "real": {
        const [l1, l2] = info.values;
        const [v1, v2] = info.vectors;
        const c = coeffs!;
        parts.push(`<p>The eigenvalues of ${$(`A = ${Atex}`)} are ${$(`\\lambda_1 ${eqTex(l1)}`)} and ${$(`\\lambda_2 ${eqTex(l2)}`)}, with eigenvectors
          ${$$(`\\vect{v}_1 ${approxVec(v1)} ${vecShort(v1)}, \\qquad \\vect{v}_2 ${approxVec(v2)} ${vecShort(v2)}.`)}</p>`);
        parts.push(`<p>The starting state is the linear combination
          ${$$(`\\vect{x}_0 = ${x0tex} = ${paren(fixedTex(c[0]))} ${vecShort(v1)} + ${paren(fixedTex(c[1]))} ${vecShort(v2)}.`)}</p>`);
        parts.push(`<p>Each step multiplies the first part by ${$(`\\lambda_1`)} and the second part by ${$(`\\lambda_2`)}, so
          ${$$(`\\vect{x}_k = ${paren(fixedTex(c[0]))} ${paren(short(l1))}^k ${vecShort(v1)} + ${paren(fixedTex(c[1]))} ${paren(short(l2))}^k ${vecShort(v2)}.`)}</p>`);
        break;
      }
      case "scalar":
        parts.push(`<p>The matrix ${$(`A = ${Atex}`)} is ${$(`${short(info.value)} I`)}, so ${$(`A \\vect{x} = ${short(info.value)} \\vect{x}`)} for every vector ${$("\\vect{x}")}: every nonzero vector is an eigenvector, with eigenvalue ${$(short(info.value))}.
          Starting from ${$(`\\vect{x}_0 = ${x0tex}`)},
          ${$$(`\\vect{x}_k = ${paren(short(info.value))}^k ${x0tex}.`)}</p>`);
        break;
      case "defective": {
        const l = info.value;
        const S: Mat2 = [[A[0][0] - l, A[0][1]], [A[1][0], A[1][1] - l]];
        const w = apply(S, x0);
        parts.push(`<p>The matrix ${$(`A = ${Atex}`)} has the repeated eigenvalue ${$(`\\lambda ${eqTex(l)}`)}, but its eigenvectors are only the nonzero multiples of ${$(`\\vect{v} = ${vecShort(info.vector)}`)}.
          So ${$("\\vect{x}_0")} can't be split into two eigenvector parts.
          Instead, ${$("A = \\lambda I + N")} with ${$("N = A - \\lambda I")}, and ${$("N^2 = 0")}, so
          ${$$(`\\vect{x}_k = \\lambda^k \\vect{x}_0 + k \\lambda^{k-1} N \\vect{x}_0 = ${paren(short(l))}^k ${x0tex} + k ${paren(short(l))}^{k-1} ${vecFixed(w)}.`)}
          The vector ${$(`N \\vect{x}_0 = ${vecFixed(w)}`)} is on the eigenvector line, and its coefficient ${$("k \\lambda^{k-1}")} grows relative to ${$("\\lambda^k")}, so the states turn toward the eigenvector line.</p>`);
        break;
      }
      case "complex": {
        const deg = (info.angle * 180) / Math.PI;
        parts.push(`<p>The eigenvalues of ${$(`A = ${Atex}`)} are the complex numbers
          ${$$(`\\lambda = ${short(info.re)} \\pm ${short(info.im)} i = r (\\cos \\theta \\pm i \\sin \\theta),`)}
          with ${$(`r = |\\lambda| ${eqTex(info.modulus)}`)} and ${$(`\\theta ${degTex(deg)}^\\circ`)}.
          No real vector is an eigenvector, so every state turns at each step.
          In a suitable basis, ${$("A")} rotates by ${$("\\theta")} and then scales by ${$("r")}, so ${$("\\vect{x}_k")} goes around the origin about once every ${$(`360^\\circ / \\theta \\approx ${(360 / deg).toFixed(1)}`)} steps, while its size is multiplied by about ${$("r^k")}.</p>`);
        break;
      }
    }
    parts.push(`<p>${statusText().text}</p>`);
    analysis.innerHTML = parts.join("");
    void typeset([analysis]);
  }

  const colTexMat = (M: Mat2) => `\\begin{bmatrix} ${M.map(row => row.map(short).join(" & ")).join(" \\\\ ")} \\end{bmatrix}`;
  const approxVec = (v: Vec2) => (v.some(x => Math.abs(+x.toFixed(3) - x) > 1e-9) ? "\\approx" : "=");

  // ⋘──────── Updating ────────⋙
  function updateStepControls(): void {
    slider.max = String(steps);
    slider.value = String(k);
    kLabel.textContent = `k = ${k}`;
    backButton.disabled = k === 0;
    resetButton.disabled = k === 0;
    forwardButton.disabled = k === steps;
  }

  function redraw(): void {
    updateStepControls();
    refit();
    drawPlane();
    drawGraphs();
    updateReadout();
  }

  // ⋘──────── Animating a step ────────⋙
  // A step forward by one animates the new state: it starts as a copy of the previous state and
  // moves to its place (stepBetween: each eigenvector part grows or shrinks by its own eigenvalue),
  // while the previous state's arrow fades. Jumps, steps back, and reduced motion skip it.
  let animT: number | null = null;     // Eased progress of the animated step, from 0 to 1
  let animFrame: number | null = null;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");

  function cancelAnimation(): void {
    if (animFrame !== null) cancelAnimationFrame(animFrame);
    animFrame = null;
    animT = null;
  }

  function animateStep(): void {
    cancelAnimation();
    const start = performance.now();
    const frame = (now: number) => {
      const u = Math.min((now - start) / STEP_ANIMATION_MS, 1);
      animT = u < 1 ? (u < 0.5 ? 4 * u ** 3 : 1 - (-2 * u + 2) ** 3 / 2) : null;   // Ease in and out
      animFrame = u < 1 ? requestAnimationFrame(frame) : null;
      drawPlane();
    };
    animT = 0;
    animFrame = requestAnimationFrame(frame);
  }

  function setK(next: number): void {
    next = Math.min(Math.max(next, 0), steps);
    const animate = next === k + 1 && !dragging && !reducedMotion?.matches;
    k = next;
    if (animate) animateStep(); else cancelAnimation();
    redraw();
    save();
  }

  function stop(): void {
    if (playTimer !== null) window.clearInterval(playTimer);
    playTimer = null;
    playButton.textContent = "▶ Play";
    playButton.setAttribute("aria-pressed", "false");
  }

  function play(): void {
    if (k >= steps) setK(0);
    playButton.textContent = "⏸ Pause";
    playButton.setAttribute("aria-pressed", "true");
    playTimer = window.setInterval(() => {
      if (k >= steps) { stop(); return; }
      setK(k + 1);
      if (k >= steps) stop();
    }, PLAY_INTERVAL_MS);
  }

  function onSystemChange(): void {
    cancelAnimation();
    recompute();
    redraw();
    scheduleAnalysis();
    save();
  }

  // ⋘──────── Events ────────⋙
  aInputs.forEach(input => input.addEventListener("input", () => { if (readMatrix()) onSystemChange(); }));
  xInputs.forEach(input => input.addEventListener("input", () => { if (readX0()) onSystemChange(); }));
  stepsSelect.addEventListener("change", () => {
    steps = +stepsSelect.value;
    k = Math.min(k, steps);
    onSystemChange();
  });
  for (const box of [showLines, showParts, showCircle]) box.addEventListener("change", () => { redraw(); save(); });
  slider.addEventListener("input", () => { stop(); setK(+slider.value); });
  playButton.addEventListener("click", () => (playTimer === null ? play() : stop()));
  resetButton.addEventListener("click", () => { stop(); setK(0); });
  backButton.addEventListener("click", () => { stop(); setK(k - 1); });
  forwardButton.addEventListener("click", () => { stop(); setK(k + 1); });

  example.addEventListener("change", () => {
    const ex = EXAMPLES[example.value];
    example.value = "";
    if (!ex) return;
    stop();
    aInputs.forEach((input, i) => { input.value = ex.A[i]; });
    xInputs.forEach((input, i) => { input.value = ex.x0[i]; });
    if (ex.steps) { stepsSelect.value = String(ex.steps); steps = ex.steps; }
    k = 0;
    readMatrix();
    readX0();
    recompute();
    refit(true);
    redraw();
    scheduleAnalysis();
    save();
  });

  // Dragging in the plot moves x₀, which snaps to the eigenvector lines.
  function moveX0(e: PointerEvent): void {
    const rect = canvas.getBoundingClientRect();
    let p = fromPx(e.clientX - rect.left, e.clientY - rect.top);
    const lines = info.kind === "real" ? info.vectors : info.kind === "defective" ? [info.vector] : [];
    if (showLines.checked) {
      for (const v of lines) {
        const snapped = snapToLine(p, v, SNAP);
        if (snapped) { p = snapped; break; }
      }
    }
    cancelAnimation();
    x0 = p;
    xInputs.forEach((input, i) => { input.value = (Math.abs(x0[i]) < 0.005 ? 0 : x0[i]).toFixed(2); input.classList.remove("dls-bad"); });
    recompute();
    redraw();
  }
  canvas.addEventListener("pointerdown", e => {
    stop();
    dragging = true;
    canvas.setPointerCapture(e.pointerId);
    moveX0(e);
  });
  canvas.addEventListener("pointermove", e => { if (dragging) moveX0(e); });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    refit();
    scheduleAnalysis();
    save();
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  new ResizeObserver(() => { drawPlane(); drawGraphs(); }).observe(canvas);
  new ResizeObserver(() => drawGraphs()).observe(graphXY);

  // "Copy link": the page's address, which holds the current settings.
  const copyButton = byId<HTMLButtonElement>("dls-copy-link");
  const copyFeedback = byId<HTMLSpanElement>("dls-copy-feedback");
  let feedbackTimer: number | null = null;
  copyButton.addEventListener("click", async () => {
    save();
    const url = location.href;
    // If copying fails (or a browser leaves it waiting on a permission prompt), show the link to
    // copy by hand instead.
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 1500));
    try {
      await Promise.race([navigator.clipboard.writeText(url), timeout]);
      copyFeedback.textContent = "Copied a link to these settings.";
    } catch {
      copyFeedback.textContent = `Copy this link: ${url}`;
    }
    if (feedbackTimer !== null) window.clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => { copyFeedback.textContent = ""; }, 6000);
  });

  // ⋘──────── Start ────────⋙
  readMatrix();
  readX0();
  recompute();
  targetR = R = fitTarget();
  redraw();
  writeAnalysis();
  save();

  setupHelp("dls");
  const panels = setupPanels("dls", () =>
    saveJSON(PIN_KEY, panels.list.map((panel, i) => (panels.isPinned(panel) ? i : -1)).filter(i => i >= 0)));
  for (const i of loadJSON<number[]>(PIN_KEY) ?? []) {
    if (panels.list[i]) panels.setPinned(panels.list[i], true);
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initPage);
  else initPage();
}
