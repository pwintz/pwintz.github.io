// ╭───────────────────────────────────────────────────────────────╮
// │        Hybrid automaton view: modes and the jumps between them │
// ╰───────────────────────────────────────────────────────────────╯
// Draws each mode as a box with its flow map and flow set, and each jump as an arrow labeled with
// its jump set and the state components that its jump map changes, like Fig. 2 of Prajna and
// Jadbabaie. Mode q gets an incoming arrow labeled X_{0,q} if it has initial states, and is red if
// it has unsafe states.
//
// Boxes and labels are HTML so that MathJax can typeset them. After typesetting, they're
// measured, placed (one mode in the middle, two side by side, more on a circle), and the arrows
// are drawn in an SVG underneath.

import { Poly, SemiSet, polyToLatex } from "./poly";
import { Compiled, accentName } from "./problem";

interface NodeData { title: string; flow: string; flowSet: string; initial: boolean; unsafe: boolean; }
interface EdgeData { from: number; to: number; label: string; }
export interface AutomatonData { nodes: NodeData[]; edges: EdgeData[]; }

type Pt = { x: number; y: number };
const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y });
const mul = (a: Pt, s: number): Pt => ({ x: a.x * s, y: a.y * s });
const norm = (a: Pt): Pt => { const l = Math.hypot(a.x, a.y) || 1; return { x: a.x / l, y: a.y / l }; };
const dir = (angle: number): Pt => ({ x: Math.cos(angle), y: Math.sin(angle) });

const SVG_NS = "http://www.w3.org/2000/svg";
const PAD = 16;

// Constraints of a set, one per line, with "or" between pieces of a union.
function constraintLines(set: SemiSet): string {
  if (set.pieces.length === 0) return "\\emptyset";
  return set.pieces.map((p) => p.latex.join(" \\\\ ")).join(" \\\\ \\text{or} \\\\ ");
}

export function automatonData(cp: Compiled): AutomatonData {
  const tex = (p: Poly) => polyToLatex(p, cp.latexNames);
  const nodes = cp.modes.map((m, qi) => ({
    title: `Mode ${qi + 1}${m.name.trim() ? `: ${m.name.trim()}` : ""}`,
    flow: `\\begin{aligned} ${m.f.map((p, k) => `${accentName(cp.latexNames[cp.z[k]], "\\dot")} &= ${tex(p)}`).join(" \\\\ ")} \\end{aligned}`,
    flowSet: m.C.pieces.length === 1 && m.C.pieces[0].latex.length === 0 ? "" : `\\begin{gathered} ${constraintLines(m.C)} \\end{gathered}`,
    initial: m.X0.pieces.length > 0,
    unsafe: m.Xu.pieces.length > 0,
  }));
  const edges = cp.jumps.map((j) => {
    const changed = j.g.flatMap((p, k) => {
      const zi = cp.z[k];
      return p.sub(Poly.variable(p.n, zi)).isZero() ? [] : [`${accentName(cp.latexNames[zi], "+")} = ${tex(p)}`];
    });
    const lines = [];
    if (!(j.D.pieces.length === 1 && j.D.pieces[0].latex.length === 0)) lines.push(constraintLines(j.D));
    if (changed.length) lines.push(...changed);
    return { from: j.from, to: j.to, label: lines.length ? `\\begin{gathered} ${lines.join(" \\\\ ")} \\end{gathered}` : "" };
  });
  return { nodes, edges };
}

function mathDiv(cls: string, latex: string): HTMLDivElement {
  const div = document.createElement("div");
  div.className = cls;
  div.textContent = `\\(\\displaystyle ${latex}\\)`;
  return div;
}

// Renders the automaton into `container`. `typeset` must typeset MathJax in the given elements.
export async function renderAutomaton(container: HTMLElement, data: AutomatonData,
    typeset: (els: Element[]) => Promise<void>): Promise<void> {
  const stage = document.createElement("div");
  stage.className = "bs-automaton-stage";
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "bs-automaton-edges");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<defs><marker id="bs-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>`;
  stage.append(svg);

  const nodeEls = data.nodes.map((n) => {
    const div = document.createElement("div");
    div.className = `bs-node${n.unsafe ? " bs-node-unsafe" : ""}`;
    const title = document.createElement("div");
    title.className = "bs-node-title";
    title.textContent = n.title;
    div.append(title, mathDiv("bs-node-flow", n.flow));
    if (n.flowSet) div.append(mathDiv("bs-node-set", n.flowSet));
    if (n.unsafe) {
      const note = document.createElement("div");
      note.className = "bs-node-note";
      note.textContent = "has unsafe states";
      div.append(note);
    }
    stage.append(div);
    return div;
  });
  const labelEls = data.edges.map((e) => {
    const div = mathDiv("bs-edge-label", e.label || "\\text{always}");
    stage.append(div);
    return div;
  });
  const startEls = data.nodes.map((n, i) => {
    if (!n.initial) return null;
    const div = mathDiv("bs-edge-label bs-start-label", `X_{0,${i + 1}}`);
    stage.append(div);
    return div;
  });

  stage.style.visibility = "hidden";
  container.replaceChildren(stage);
  await typeset([stage]);

  // Measure.
  const size = (el: HTMLElement) => ({ w: el.offsetWidth, h: el.offsetHeight });
  const nodeSizes = nodeEls.map(size);
  const labelSizes = labelEls.map(size);
  const n = data.nodes.length;

  // Place modes.
  const maxLabelW = Math.max(0, ...labelSizes.map((s) => s.w));
  const gap = Math.max(140, maxLabelW + 60);
  let centers: Pt[];
  if (n === 1) {
    centers = [{ x: 0, y: 0 }];
  } else if (n === 2) {
    const d = nodeSizes[0].w / 2 + nodeSizes[1].w / 2 + gap;
    centers = [{ x: -d / 2, y: 0 }, { x: d / 2, y: 0 }];
  } else {
    const maxDiag = Math.max(...nodeSizes.map((s) => Math.hypot(s.w, s.h)));
    const r = (maxDiag + gap) / (2 * Math.sin(Math.PI / n));
    centers = centers0(n).map((a) => mul(dir(a), r));
  }
  const centroid = mul(centers.reduce(add, { x: 0, y: 0 }), 1 / n);
  const outward = (i: number) => n <= 2 ? (n === 1 ? Math.PI : (centers[i].x < 0 ? Math.PI : 0))
    : Math.atan2(centers[i].y - centroid.y, centers[i].x - centroid.x);

  // The point where a ray from the center of node i in direction u leaves its box.
  const boundary = (i: number, u: Pt): Pt => {
    const { w, h } = nodeSizes[i];
    const v = norm(u);
    const t = Math.min((w / 2 + 3) / Math.abs(v.x || 1e-9), (h / 2 + 3) / Math.abs(v.y || 1e-9));
    return add(centers[i], mul(v, t));
  };
  // Center for a label of the given size next to `at`, pushed away from the curve along `normal`.
  const labelCenter = (at: Pt, normal: Pt, s: { w: number; h: number }): Pt =>
    add(at, mul(normal, Math.abs(normal.x) * s.w / 2 + Math.abs(normal.y) * s.h / 2 + 6));

  const paths: string[] = [];
  const labelBoxes: { el: HTMLElement; c: Pt; s: { w: number; h: number } }[] = [];
  const extraPoints: Pt[] = [];

  // Jumps between different modes. Arrows in opposite directions bend apart; repeated arrows in
  // the same direction bend further.
  const seen = new Map<string, number>();
  const loopsAt = new Map<number, number>();
  data.edges.forEach((e, k) => {
    if (e.from === e.to) {
      const i = e.from;
      const count = loopsAt.get(i) ?? 0;
      loopsAt.set(i, count + 1);
      const base = n <= 2 ? -Math.PI / 2 : outward(i);
      const theta = base + [0, Math.PI, 0.9, -0.9, 1.8, -1.8][count % 6];
      const s = boundary(i, dir(theta - 0.35)), t = boundary(i, dir(theta + 0.35));
      const c1 = add(s, mul(dir(theta - 0.5), 70)), c2 = add(t, mul(dir(theta + 0.5), 70));
      paths.push(`M${s.x},${s.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${t.x},${t.y}`);
      const mid = mul(add(add(s, t), mul(add(c1, c2), 3)), 1 / 8);
      labelBoxes.push({ el: labelEls[k], c: labelCenter(mid, dir(theta), labelSizes[k]), s: labelSizes[k] });
      extraPoints.push(c1, c2);
      return;
    }
    const key = `${e.from}->${e.to}`;
    const index = seen.get(key) ?? 0;
    seen.set(key, index + 1);
    const hasReverse = data.edges.some((f) => f.from === e.to && f.to === e.from);
    const bend = (hasReverse ? 45 : 0) + 55 * index;
    const p = centers[e.from], q = centers[e.to];
    const d = norm(sub(q, p));
    const normal = { x: d.y, y: -d.x };
    const c = add(mul(add(p, q), 0.5), mul(normal, bend));
    const s = boundary(e.from, sub(c, p)), t = boundary(e.to, sub(c, q));
    paths.push(`M${s.x},${s.y} Q${c.x},${c.y} ${t.x},${t.y}`);
    const mid = mul(add(add(s, t), mul(c, 2)), 1 / 4);
    labelBoxes.push({ el: labelEls[k], c: labelCenter(mid, normal, labelSizes[k]), s: labelSizes[k] });
    extraPoints.push(c);
  });

  // Arrows into modes with initial states.
  startEls.forEach((el, i) => {
    if (!el) return;
    const angle = n <= 2 ? outward(i) : outward(i) + 0.8;
    const end = boundary(i, dir(angle));
    const tail = add(end, mul(dir(angle), 45));
    paths.push(`M${tail.x},${tail.y} L${end.x},${end.y}`);
    const s = size(el);
    labelBoxes.push({ el, c: labelCenter(tail, dir(angle), s), s });
  });

  // Fit everything into the stage.
  const xs: number[] = [], ys: number[] = [];
  centers.forEach((c, i) => { xs.push(c.x - nodeSizes[i].w / 2, c.x + nodeSizes[i].w / 2); ys.push(c.y - nodeSizes[i].h / 2, c.y + nodeSizes[i].h / 2); });
  labelBoxes.forEach((b) => { xs.push(b.c.x - b.s.w / 2, b.c.x + b.s.w / 2); ys.push(b.c.y - b.s.h / 2, b.c.y + b.s.h / 2); });
  extraPoints.forEach((pt) => { xs.push(pt.x); ys.push(pt.y); });
  const minX = Math.min(...xs) - PAD, minY = Math.min(...ys) - PAD;
  const width = Math.max(...xs) + PAD - minX, height = Math.max(...ys) + PAD - minY;
  const dx = -minX + Math.max(0, (container.clientWidth - width) / 2), dy = -minY;

  stage.style.width = `${Math.max(width, container.clientWidth)}px`;
  stage.style.height = `${height}px`;
  svg.setAttribute("width", stage.style.width);
  svg.setAttribute("height", `${height}`);
  const g = document.createElementNS(SVG_NS, "g");
  g.setAttribute("transform", `translate(${dx},${dy})`);
  for (const d of paths) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("marker-end", "url(#bs-arrow)");
    g.append(path);
  }
  svg.append(g);
  nodeEls.forEach((el, i) => {
    el.style.left = `${centers[i].x - nodeSizes[i].w / 2 + dx}px`;
    el.style.top = `${centers[i].y - nodeSizes[i].h / 2 + dy}px`;
  });
  labelBoxes.forEach((b) => {
    b.el.style.left = `${b.c.x - b.s.w / 2 + dx}px`;
    b.el.style.top = `${b.c.y - b.s.h / 2 + dy}px`;
  });
  stage.style.visibility = "";
}

// Angles for n modes on a circle, starting at the top and going clockwise.
function centers0(n: number): number[] {
  return Array.from({ length: n }, (_, i) => -Math.PI / 2 + (2 * Math.PI * i) / n);
}
