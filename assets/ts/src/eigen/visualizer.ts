// ╭───────────────────────────────────────────────────────────────╮
// │              Eigenvectors in a picture: x and Ax               │
// ╰───────────────────────────────────────────────────────────────╯
// The student drags a vector x anywhere in the plane (or presses Sweep, which turns it while
// keeping its length), and the page draws Ax.
// Where Ax lies on the line through x, x is an eigenvector. The real eigenvector directions are
// drawn as dashed lines, and x snaps to them when it comes close, so the readout can say exactly
// "Ax = λx". Optional layers: the unit circle and its image (an ellipse), and the image of the grid.
// Below the plot, the characteristic polynomial, eigenvalues, and eigenvectors are worked exactly.
//
// The matrix is the practice problem's (practice_page.ts), set with `showProblem`; the student
// can't type in it here (to practice with another matrix, they design a problem). Until the
// steps are finished, the picture shows the eigenvector lines but not the eigenvalues, the values
// of Ax, or the calculations (`setNumbersShown`).

import { typeset } from "../common/mathjax";
import { loadJSON, saveJSON } from "../common/storage";
import { Fraction, isZero, parseEntry } from "../matrix/fraction";
import { FMat } from "../matrix/linalg";
import {
  F, colTex, diagTermTex, eigen2, eigenvector2, fracTex, isRational, matTex, nullBasis, parenTex, plusTerm, polyTex, prodTex,
  charPoly, shift, shiftName, shiftTex, slashTex, surdDecimal, surdTex, surdValue, toNum, vecTex, Surd,
} from "./eigen_math";
import { rref } from "../matrix/linalg";

const SETTINGS_KEY = "eigenvalues_visualizer";
// Okabe–Ito: blue for x, vermillion for Ax, bluish green and reddish purple for the eigenvector lines.
const X_COLOR = "#0072B2";
const AX_COLOR = "#D55E00";
const EIG_COLORS = ["#009E73", "#CC79A7"];
const IMAGE_COLOR = "#5f7896";   // Gray-blue, for the image of the circle and of the grid
const SNAP = (2.5 * Math.PI) / 180;

const EXAMPLES: Record<string, string[]> = {
  diag: ["2", "0", "0", "1/2"],
  sym: ["2", "1", "1", "2"],
  tri: ["2", "1", "0", "3"],
  neg: ["1", "2", "2", "1"],
  reflect: ["0", "1", "1", "0"],
  proj: ["1/2", "1/2", "1/2", "1/2"],
  golden: ["1", "1", "1", "0"],
  scalar: ["2", "0", "0", "2"],
  shear: ["1", "1", "0", "1"],
  rot: ["0", "-1", "1", "0"],
  spiral: ["1", "-1", "1", "1"],
};

interface Saved { entries?: string[]; lines?: boolean; ellipse?: boolean; grid?: boolean; theta?: number; len?: number }

const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const $ = (tex: string) => `\\(${tex}\\)`;
const $$ = (tex: string) => `\\[${tex}\\]`;
const fixed = (x: number, digits = 2) => (Math.abs(x) < 0.5 * 10 ** -digits ? 0 : x).toFixed(digits).replace("-", "−");

export interface Visualizer {
  /** Shows a 2 × 2 matrix (as typed entries) and points x along v, if given; null hides the picture. */
  showProblem: (entries: string[] | null, v?: number[]) => void;
  setNumbersShown: (shown: boolean) => void;
}

export function setupVisualizer(): Visualizer {
  const canvas = byId<HTMLCanvasElement>("ev-canvas");
  const ctx = canvas.getContext("2d")!;
  const inputs = ["ev-a00", "ev-a01", "ev-a10", "ev-a11"].map(id => byId<HTMLInputElement>(id));
  const showLines = byId<HTMLInputElement>("ev-show-lines");
  const showEllipse = byId<HTMLInputElement>("ev-show-ellipse");
  const showGrid = byId<HTMLInputElement>("ev-show-grid");
  const sweepButton = byId<HTMLButtonElement>("ev-sweep");
  const xBox = byId<HTMLSpanElement>("ev-x");
  const axBox = byId<HTMLSpanElement>("ev-ax");
  const status = byId<HTMLParagraphElement>("ev-status");
  const eigList = byId<HTMLUListElement>("ev-eigs");
  const calc = byId<HTMLDivElement>("ev-calc");
  const example = document.getElementById("ev-example") as HTMLSelectElement | null;
  const plotPanel = byId<HTMLDivElement>("ev-plot-panel");
  const noPlot = byId<HTMLParagraphElement>("ev-noplot");
  let numbersShown = true;
  inputs.forEach(input => { input.readOnly = true; });

  const saved = loadJSON<Saved>(SETTINGS_KEY) ?? {};
  const startEntries = Array.isArray(saved.entries) && saved.entries.length === 4 && saved.entries.every(e => parseEntry(e))
    ? saved.entries : EXAMPLES.sym;
  inputs.forEach((input, i) => { input.value = startEntries[i]; });
  if (typeof saved.lines === "boolean") showLines.checked = saved.lines;
  if (typeof saved.ellipse === "boolean") showEllipse.checked = saved.ellipse;
  if (typeof saved.grid === "boolean") showGrid.checked = saved.grid;

  // ⋘──────── State ────────⋙
  let A: FMat = [[F(2), F(1)], [F(1), F(2)]];
  let a = [[2, 1], [1, 2]];          // A as numbers, for drawing
  // x = len·(cos θ, sin θ): its direction θ and its length.
  let theta = typeof saved.theta === "number" && Number.isFinite(saved.theta) ? saved.theta : Math.PI / 6;
  let len = typeof saved.len === "number" && Number.isFinite(saved.len) && saved.len > 0 ? saved.len : 1;
  const xVec = () => [len * Math.cos(theta), len * Math.sin(theta)];
  let R = 2;                          // Half the width of the plot, in plot units
  // The real eigenvector directions (angles in [0, π)), with their eigenvalues and colors.
  let directions: { angle: number; lambda: number; label: string; color: string }[] = [];
  let scalar = false;                 // A = cI: every vector is an eigenvector
  let complex = false;

  const save = () => saveJSON(SETTINGS_KEY, {
    entries: inputs.map(i => i.value), lines: showLines.checked, ellipse: showEllipse.checked, grid: showGrid.checked, theta, len,
  } satisfies Saved);

  const apply = (v: number[]) => [a[0][0] * v[0] + a[0][1] * v[1], a[1][0] * v[0] + a[1][1] * v[1]];

  // ⋘──────── The matrix ────────⋙
  function readMatrix(): boolean {
    const values = inputs.map(input => parseEntry(input.value.trim() === "" ? "x" : input.value));
    inputs.forEach((input, i) => input.classList.toggle("ev-bad", values[i] === null));
    if (values.some(v => v === null)) return false;
    const f = values as Fraction[];
    A = [[f[0], f[1]], [f[2], f[3]]];
    a = A.map(row => row.map(toNum));
    analyze();
    return true;
  }

  function analyze(): void {
    const e = eigen2(A);
    complex = e.kind === "complex";
    scalar = isZero(A[0][1]) && isZero(A[1][0]) && e.kind === "repeated";
    directions = [];
    if (!complex && !scalar) {
      e.roots.forEach((root, k) => {
        const v = eigenvector2(A, root).map(s => surdValue(s).re);
        let ang = Math.atan2(v[1], v[0]);
        if (ang < 0) ang += Math.PI;
        if (ang >= Math.PI) ang -= Math.PI;
        const sub = e.roots.length === 1 ? "" : k === 0 ? "₁" : "₂";
        directions.push({ angle: ang, lambda: surdValue(root).re, label: `λ${sub} = ${surdDecimal(root)}`, color: EIG_COLORS[k] });
      });
    }
    // The plot shows the unit circle and its image: the image reaches as far as the largest
    // singular value of A, √(largest eigenvalue of AᵀA).
    const [p, q, r, s] = [a[0][0], a[0][1], a[1][0], a[1][1]];
    const m11 = p * p + r * r, m12 = p * q + r * s, m22 = q * q + s * s;
    const sigma = Math.sqrt((m11 + m22) / 2 + Math.sqrt(((m11 - m22) / 2) ** 2 + m12 * m12));
    // Room to drag x past the unit circle, too.
    R = Math.max(2.5, sigma * 1.2);
  }

  // ⋘──────── Drawing ────────⋙
  let width = 0, height = 0, scale = 1;
  const toPx = (x: number, y: number): [number, number] => [width / 2 + x * scale, height / 2 - y * scale];

  function niceStep(span: number): number {
    const raw = span / 6;
    const p = 10 ** Math.floor(Math.log10(raw));
    for (const m of [1, 2, 5, 10]) if (raw <= m * p) return m * p;
    return 10 * p;
  }

  function arrow(x: number, y: number, color: string, lineWidth: number): void {
    const [x0, y0] = toPx(0, 0), [x1, y1] = toPx(x, y);
    const len = Math.hypot(x1 - x0, y1 - y0);
    if (len < 1) return;
    const ux = (x1 - x0) / len, uy = (y1 - y0) / len;
    const head = Math.min(13, len * 0.45);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1 - ux * head * 0.8, y1 - uy * head * 0.8);
    ctx.stroke();
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

  function draw(): void {
    const dpr = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (width === 0 || height === 0) return;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    scale = Math.min(width, height) / (2 * R);
    const halfW = width / 2 / scale, halfH = height / 2 / scale;

    // The grid and axes, with tick labels.
    const step = niceStep(2 * R);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(128, 128, 128, 0.16)";
    ctx.beginPath();
    for (let k = Math.ceil(-halfW / step); k * step <= halfW; k++) {
      const [px] = toPx(k * step, 0);
      ctx.moveTo(px, 0); ctx.lineTo(px, height);
    }
    for (let k = Math.ceil(-halfH / step); k * step <= halfH; k++) {
      const [, py] = toPx(0, k * step);
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
    const tick = (v: number) => `${+v.toFixed(3)}`.replace("-", "−");
    for (let k = Math.ceil(-halfW / step); k * step <= halfW; k++) {
      if (k === 0) continue;
      const [px] = toPx(k * step, 0);
      if (px > 10 && px < width - 10) ctx.fillText(tick(k * step), px, oy + 3);
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let k = Math.ceil(-halfH / step); k * step <= halfH; k++) {
      if (k === 0) continue;
      const [, py] = toPx(0, k * step);
      if (py > 8 && py < height - 8) ctx.fillText(tick(k * step), ox - 4, py);
    }

    // The image of the grid: the lines x = k and y = k, carried by A.
    if (showGrid.checked) {
      const gStep = niceStep(2 * R);
      const reach = Math.ceil(R / gStep) + 1;
      const far = 40 * R;
      ctx.strokeStyle = "rgba(95, 120, 150, 0.32)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let k = -reach; k <= reach; k++) {
        for (const [base, dir] of [[[k * gStep, 0], [0, 1]], [[0, k * gStep], [1, 0]]]) {
          const b = apply(base), d = apply(dir);
          if (Math.hypot(d[0], d[1]) < 1e-12) continue;
          const [x0, y0] = toPx(b[0] - far * d[0], b[1] - far * d[1]);
          const [x1, y1] = toPx(b[0] + far * d[0], b[1] + far * d[1]);
          ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
        }
      }
      ctx.stroke();
    }

    // The circle through x (dashed) and its image, the ellipse that Ax traces as x turns.
    if (showEllipse.checked) {
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "rgba(95, 99, 104, 0.55)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(ox, oy, len * scale, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = IMAGE_COLOR;
      ctx.beginPath();
      for (let k = 0; k <= 180; k++) {
        const t = (k / 180) * 2 * Math.PI;
        const [px, py] = toPx(...(apply([len * Math.cos(t), len * Math.sin(t)]) as [number, number]));
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // The eigenvector lines, each labeled with its eigenvalue.
    if (showLines.checked) {
      for (const d of directions) {
        const c = Math.cos(d.angle), s = Math.sin(d.angle);
        const far = 3 * R;
        ctx.strokeStyle = d.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(...toPx(-far * c, -far * s));
        ctx.lineTo(...toPx(far * c, far * s));
        ctx.stroke();
        ctx.setLineDash([]);
        // The label near where the line leaves the plot, off to its side.
        const t = 0.82 * Math.min(halfW / Math.max(Math.abs(c), 1e-9), halfH / Math.max(Math.abs(s), 1e-9));
        // Off to the side of the line (its angle is in [0, π), so this end is in the upper half).
        if (numbersShown) label(d.label, t * c, t * s, d.color, -42 * s, -16 * c);
      }
    }

    // x and Ax.
    const x = xVec();
    const ax = apply(x);
    const eigen = currentEigen();
    arrow(ax[0], ax[1], AX_COLOR, eigen ? 4 : 3);
    arrow(x[0], x[1], X_COLOR, 3);
    const [hx, hy] = toPx(x[0], x[1]);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = X_COLOR;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(hx, hy, 6.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    const out = (v: number[], k: number) => { const n = Math.hypot(v[0], v[1]) || 1; return [k * v[0] / n, -k * v[1] / n]; };
    const [lx, ly] = out(x, 18);
    label("x", x[0], x[1], X_COLOR, lx, ly);
    if (Math.hypot(ax[0], ax[1]) > 0.02) {
      const [mx, my] = out(ax, 22);
      label("Ax", ax[0], ax[1], AX_COLOR, mx, my);
    }
  }

  // The eigenvector direction x is on, if any: by the snapped angle, or for A = cI, every angle.
  function currentEigen(): { lambda: number; color: string; label: string } | null {
    if (scalar) return { lambda: a[0][0], color: EIG_COLORS[0], label: `λ = ${fixed(a[0][0])}` };
    let t = theta % Math.PI;
    if (t < 0) t += Math.PI;
    for (const d of directions) {
      const diff = Math.abs(t - d.angle);
      if (Math.min(diff, Math.PI - diff) < 1e-6) return d;
    }
    return null;
  }

  // ⋘──────── The readout ────────⋙
  const colvec = (v: number[]) => v.map(c => `<span>${fixed(c)}</span>`).join("");

  function renderReadout(): void {
    const x = xVec();
    const ax = apply(x);
    xBox.innerHTML = colvec(x);
    axBox.innerHTML = numbersShown ? colvec(ax) : "<span>?</span><span>?</span>";
    if (!numbersShown) {
      status.classList.remove("ev-is-eigen");
      status.textContent = "Drag x until Ax lies on the line through x. The values appear when you finish the steps below.";
      return;
    }
    const eigen = currentEigen();
    status.classList.toggle("ev-is-eigen", eigen !== null);
    status.style.setProperty("--ev-eig-color", eigen?.color ?? "");
    if (eigen) {
      const lambda = eigen.lambda;
      const what = Math.abs(lambda) < 1e-9 ? "A sends x to 0"
        : lambda < 0 ? `A flips x and scales it by ${fixed(Math.abs(lambda))}`
          : `A scales x by ${fixed(lambda)}`;
      status.innerHTML = `<strong>x is an eigenvector:</strong> Ax = ${fixed(lambda)}x. ${what}${scalar ? ". For this matrix, every nonzero vector is an eigenvector." : ", without turning it off its line."}`;
    } else {
      const cross = x[0] * ax[1] - x[1] * ax[0], dot = x[0] * ax[0] + x[1] * ax[1];
      const turn = Math.abs((Math.atan2(cross, dot) * 180) / Math.PI);
      const off = Math.round(Math.min(turn, 180 - turn));
      status.innerHTML = Math.hypot(ax[0], ax[1]) < 1e-9 ? "Ax = 0."
        : `Ax is not on the line through x: it's turned ${off === 0 ? "less than 1" : off}° off that line.${complex ? " This matrix turns every vector, so it has no real eigenvectors." : showLines.checked ? " Drag x toward a dashed line." : " Turn x until Ax lines up with it."}`;
    }
  }

  function renderEigenvalues(): void {
    if (!numbersShown) {
      eigList.innerHTML = "<li>Shown when you finish the steps below.</li>";
      return;
    }
    const e = eigen2(A);
    const items: string[] = [];
    if (e.kind === "complex") {
      items.push(`<li>λ = ${surdDecimal(e.roots[0])}, ${surdDecimal(e.roots[1])}</li>`);
      items.push(`<li>Complex, so there are no eigenvector lines in the real plane.</li>`);
    } else if (scalar) {
      items.push(`<li>λ = ${surdDecimal(e.roots[0])}, twice. Every nonzero vector is an eigenvector.</li>`);
    } else {
      directions.forEach(d => items.push(`<li style="color: ${d.color}"><span class="ev-swatch"></span><span style="color: #202124">${d.label}${e.kind === "repeated" ? ", twice (only one line of eigenvectors)" : ""}</span></li>`));
    }
    eigList.innerHTML = items.join("");
  }

  // ⋘──────── The calculations ────────⋙
  function eigenvectorHtml(lambda: Surd, name: string, vname: string): string {
    if (isRational(lambda)) {
      const M = shift(A, lambda.a);
      const { r } = rref(M);
      const basis = nullBasis(M);
      const lam = slashTex(lambda.a);
      const S = shiftName(lambda.a);
      const reduce = `${$$(`${S} = ${matTex(M)} \\sim ${matTex(r)}`)}`;
      if (basis.length === 2) {
        return `<p>For ${$(`${name} = ${lam}`)}: ${$$(`${S} = ${matTex(M)},`)} so every vector solves ${$(`(${S})\\vect{x} = \\vect{0}`)}: every nonzero vector is an eigenvector.</p>`;
      }
      return `<p>For ${$(`${name} = ${lam}`)}, row reduce:</p>${reduce}`
        + `<p>The solutions of ${$(`(${S})\\vect{x} = \\vect{0}`)} are the multiples of ${$(`${vname} = ${vecTex(basis[0])}`)}, so the eigenvectors for ${$(name)} are the nonzero multiples of ${$(vname)}.</p>`;
    }
    // An irrational or complex eigenvalue: A − λI has rank 1, so one row determines the solutions.
    const v = eigenvector2(A, lambda);
    const useFirst = !isZero(A[0][1]);
    const rowTex = useFirst
      ? `${diagTermTex(A[0][0], name)}x_1${plusTerm(A[0][1], "x_2")} = 0`
      : `${fracTex(A[1][0]).replace(/^1$/, "").replace(/^-1$/, "-")}x_1 + ${diagTermTex(A[1][1], name)}x_2 = 0`;
    return `<p>For ${$(`${name} = ${surdTex(lambda, false, true)}`)}: since ${$(`\\det(A - ${name} I) = 0`)}, the two rows of ${$(`A - ${name} I`)} are multiples of each other, so the ${useFirst ? "first" : "second"} row's equation ${$(rowTex)} gives every solution.
      One solution (scaled to avoid fractions) is ${$$(`${vname} = ${colTex(v.map(s => surdTex(s)))}.`)}</p>`;
  }

  function renderCalc(): void {
    if (!numbersShown) {
      calc.innerHTML = `<p class="ev-matrix-note">The full solution, with every calculation, appears here when you finish the steps above.</p>`;
      return;
    }
    const e = eigen2(A);
    const [[p, q], [r, s]] = A;
    const parts: string[] = [];
    parts.push(`<h3>Characteristic polynomial</h3>`);
    parts.push($$(`\\det(A - \\lambda I) = \\det ${shiftTex(A)} = ${diagTermTex(p)}${diagTermTex(s)} - ${prodTex(q, r)} = ${polyTex(charPoly(A))}.`));
    parts.push(`<p>In general, this is ${$("\\lambda^2 - (\\operatorname{tr} A)\\lambda + \\det A")}, with ${$(`\\operatorname{tr} A = ${slashTex(e.t)}`)} and ${$(`\\det A = ${slashTex(e.d)}`)}.</p>`);
    parts.push(`<h3>Eigenvalues</h3>`);
    const formula = `\\lambda = \\frac{${fracTex(e.t)} \\pm \\sqrt{${parenTex(e.t)}^2 - 4 \\cdot ${parenTex(e.d)}}}{2} = \\frac{${fracTex(e.t)} \\pm \\sqrt{${fracTex(e.disc)}}}{2}`;
    if (e.kind === "repeated") {
      parts.push(`<p>The roots of ${$("\\det(A - \\lambda I) = 0")} are ${$$(`${formula} = ${surdTex(e.roots[0])}.`)} The discriminant is 0, so ${$("A")} has one eigenvalue, ${$(`\\lambda = ${surdTex(e.roots[0], false, true)}`)}, a double root (algebraic multiplicity 2).</p>`);
    } else if (e.kind === "complex") {
      parts.push(`<p>The roots of ${$("\\det(A - \\lambda I) = 0")} are ${$$(`${formula} = ${surdTex({ ...e.roots[0], b: e.half }, true)}.`)} The discriminant is negative, so the eigenvalues are complex: ${$(`\\lambda_1 = ${surdTex(e.roots[0], false, true)}`)} and ${$(`\\lambda_2 = ${surdTex(e.roots[1], false, true)}`)}.
        No real vector has ${$("A\\vect{x} = \\lambda\\vect{x}")}: ${$("A")} turns every nonzero vector of the plane off its line.</p>`);
    } else {
      parts.push(`<p>The roots of ${$("\\det(A - \\lambda I) = 0")} are ${$$(`${formula},`)} so ${$(`\\lambda_1 = ${surdTex(e.roots[0], false, true)}`)} and ${$(`\\lambda_2 = ${surdTex(e.roots[1], false, true)}`)}.</p>`);
    }
    parts.push(`<h3>Eigenvectors</h3>`);
    if (e.kind === "repeated") {
      parts.push(eigenvectorHtml(e.roots[0], "\\lambda", "\\vect{v}"));
      if (!scalar) parts.push(`<p>The eigenvalue is a double root, but its eigenvectors fill only a line, so ${$("A")} doesn't have two independent eigenvectors: it is not diagonalizable.</p>`);
    } else {
      e.roots.forEach((root, k) => parts.push(eigenvectorHtml(root, `\\lambda_${k + 1}`, `\\vect{v}_${k + 1}`)));
      if (e.kind === "complex") parts.push(`<p>The two eigenvectors are complex conjugates, like the eigenvalues.</p>`);
    }
    parts.push(`<p class="ev-matrix-note">Every nonzero multiple of an eigenvector is also an eigenvector, so a textbook may show a different (but parallel) vector.</p>`);
    calc.innerHTML = parts.join("");
    void typeset([calc]);
  }

  // ⋘──────── Turning x ────────⋙
  function setTheta(t: number, snap = true): void {
    theta = t;
    if (snap) {
      let m = theta % Math.PI;
      if (m < 0) m += Math.PI;
      for (const d of directions) {
        let diff = d.angle - m;
        if (diff > Math.PI / 2) diff -= Math.PI;
        if (diff < -Math.PI / 2) diff += Math.PI;
        if (Math.abs(diff) < SNAP) { theta += diff; break; }
      }
    }
    redraw();
  }

  function redraw(): void {
    draw();
    renderReadout();
  }

  // x follows the pointer anywhere in the plot (kept inside it while dragging past the edge).
  let dragging = false;
  function moveToPointer(e: PointerEvent): void {
    const rect = canvas.getBoundingClientRect();
    const halfW = rect.width / 2 - 2, halfH = rect.height / 2 - 2;
    const px = Math.min(Math.max(e.clientX - rect.left - rect.width / 2, -halfW), halfW);
    const py = Math.min(Math.max(rect.height / 2 - (e.clientY - rect.top), -halfH), halfH);
    if (Math.hypot(px, py) < 4) return;  // Too close to the origin to have a direction
    len = Math.hypot(px, py) / scale;
    setTheta(Math.atan2(py, px));
  }
  canvas.addEventListener("pointerdown", e => {
    stopSweep();
    dragging = true;
    canvas.classList.add("ev-dragging");
    canvas.setPointerCapture(e.pointerId);
    moveToPointer(e);
  });
  canvas.addEventListener("pointermove", e => {
    if (dragging) moveToPointer(e);
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    canvas.classList.remove("ev-dragging");
    save();
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  // Sweep: x turns steadily and pauses on each eigenvector line.
  let sweeping = false, last = 0, pauseUntil = 0;
  const SPEED = (40 * Math.PI) / 180;  // Radians per second
  function frame(now: number): void {
    if (!sweeping) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (now >= pauseUntil) {
      const next = theta + SPEED * dt;
      // A crossing of an eigenvector line (in either direction along it) pauses there.
      let hit: number | null = null;
      for (const d of directions) {
        for (const base of [d.angle, d.angle + Math.PI]) {
          const k = Math.ceil((theta + 1e-9 - base) / (2 * Math.PI));
          const target = base + 2 * Math.PI * k;
          if (target > theta + 1e-9 && target <= next && (hit === null || target < hit)) hit = target;
        }
      }
      if (hit !== null) {
        theta = hit;
        pauseUntil = now + 1100;
      } else {
        theta = next;
      }
      if (theta > 2 * Math.PI) theta -= 2 * Math.PI;
      redraw();
    }
    requestAnimationFrame(frame);
  }
  function stopSweep(): void {
    if (!sweeping) return;
    sweeping = false;
    sweepButton.textContent = "▶ Sweep";
    sweepButton.setAttribute("aria-pressed", "false");
    save();
  }
  sweepButton.addEventListener("click", () => {
    if (sweeping) { stopSweep(); return; }
    sweeping = true;
    // Show the circle x turns on and the ellipse Ax traces.
    if (!showEllipse.checked) {
      showEllipse.checked = true;
      save();
    }
    sweepButton.textContent = "❚❚ Pause";
    sweepButton.setAttribute("aria-pressed", "true");
    last = performance.now();
    pauseUntil = 0;
    requestAnimationFrame(frame);
  });

  // ⋘──────── Settings ────────⋙
  let calcTimer = 0;
  function matrixChanged(): void {
    if (!readMatrix()) return;
    len = Math.min(len, 0.95 * R);  // Keep x in the plot when the view shrinks
    setTheta(theta);
    renderEigenvalues();
    save();
    window.clearTimeout(calcTimer);
    calcTimer = window.setTimeout(renderCalc, 250);
  }
  inputs.forEach(input => input.addEventListener("input", matrixChanged));
  for (const box of [showLines, showEllipse, showGrid]) box.addEventListener("change", () => { redraw(); save(); });
  example?.addEventListener("change", () => {
    const entries = EXAMPLES[example.value];
    example.value = "";  // So the same example can be chosen again
    if (!entries) return;
    inputs.forEach((input, i) => { input.value = entries[i]; });
    matrixChanged();
  });
  new ResizeObserver(() => draw()).observe(canvas);

  readMatrix();
  setTheta(theta, false);
  renderEigenvalues();
  renderCalc();

  return {
    showProblem(entries, v) {
      const has = entries !== null;
      plotPanel.hidden = !has;
      noPlot.hidden = has;
      if (!entries) return;
      inputs.forEach((input, i) => { input.value = entries[i]; });
      if (v && Math.hypot(v[0], v[1]) > 0) theta = Math.atan2(v[1], v[0]);
      matrixChanged();
    },
    setNumbersShown(shown) {
      if (shown === numbersShown) return;
      numbersShown = shown;
      redraw();
      renderEigenvalues();
      renderCalc();
    },
  };
}
