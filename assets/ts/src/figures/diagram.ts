// ╭───────────────────────────────────────────────────────────────╮
// │     Diagrams of boxes and arrows, or of dots and lines          │
// ╰───────────────────────────────────────────────────────────────╯
// Flowcharts, block diagrams, and drawings of networks, given entirely by the params:
//
//   nodes: [{ id, text, x, y, shape }]
//     x, y:  the node's center, in any units, with y pointing down (as the diagram is read). The
//            drawing is scaled to fit the canvas.
//     shape: "box" (default), "terminal" (a rounded box, for the start and end of a flowchart),
//            "diamond" (a decision), "circle" (a summing junction), "dot" (a vertex of a network,
//            with its text beside it), or "text" (text without a border, such as a signal's name).
//     place: (for a dot) where its text goes: "above", "below", "left", or "right" (default: any clear spot).
//   edges: [{ from, to, text, via, head }]
//     via:   points [x, y] that the edge bends at, on its way.
//     text:  a label beside the edge's first segment (or its middle segment, with `via`).
//     head:  a label beside the arrowhead, such as "−" at a summing junction.
//   arrows: whether edges have arrowheads (default true).

import { OKABE_ITO } from "../common/scene3d";
import { Pt } from "./geometry";
import { Widget } from "./widget";

export type NodeShape = "box" | "terminal" | "diamond" | "circle" | "dot" | "text";

interface NodeSpec { id: string; text?: string; x: number; y: number; shape?: NodeShape; place?: string }
interface EdgeSpec { from: string; to: string; text?: string; via?: Pt[]; head?: string }

/**
 * The point where the segment from a node's center c toward the point p leaves the node, whose
 * shape has half-width hw and half-height hh (for a circle or dot, hw is the radius).
 */
export function clipToShape(shape: NodeShape, hw: number, hh: number, c: Pt, p: Pt): Pt {
  const dx = p[0] - c[0], dy = p[1] - c[1];
  const len = Math.hypot(dx, dy);
  if (len === 0) return c;
  let t: number;
  if (shape === "circle" || shape === "dot") t = hw / len;
  else if (shape === "diamond") t = 1 / (Math.abs(dx) / hw + Math.abs(dy) / hh);
  else t = Math.min(Math.abs(dx) > 0 ? hw / Math.abs(dx) : Infinity, Math.abs(dy) > 0 ? hh / Math.abs(dy) : Infinity);
  t = Math.min(t, 1);
  return [c[0] + t * dx, c[1] + t * dy];
}

const INK = "#2f3542";
const FILL: Partial<Record<NodeShape, string>> = {
  box: "rgba(86, 180, 233, 0.16)", terminal: "rgba(0, 158, 115, 0.16)", diamond: "rgba(230, 159, 0, 0.18)", circle: "#fff",
};

export const diagram: Widget = env => {
  const nodes = (env.params.nodes as NodeSpec[] | undefined) ?? [];
  const edges = (env.params.edges as EdgeSpec[] | undefined) ?? [];
  const arrows = env.params.arrows !== false;
  const byId = new Map(nodes.map(n => [n.id, n]));

  return () => {
    const s = env.scene;
    s.begin(env.canvas, { dim: 2, yaw: 0, pitch: 0, perspective: false, center: [0, 0, 0], extent: 1 });
    const ctx = s.ctx;
    const font = s.font(`${s.px(14)}px system-ui, sans-serif`);
    ctx.font = font;
    const lineH = s.px(14) * 1.25;

    // Each node's size on the screen, from its text.
    const size = new Map<string, { hw: number; hh: number; lines: string[] }>();
    for (const n of nodes) {
      const shape = n.shape ?? "box";
      const lines = (n.text ?? "").split("\n");
      const tw = Math.max(0, ...lines.map(l => ctx.measureText(l).width)), th = lines.length * lineH;
      const pad = s.px(9);
      let hw = tw / 2 + pad, hh = th / 2 + pad * 0.7;
      if (shape === "diamond") { hw = tw / 2 + th / 2 + pad * 1.6; hh = th / 2 + tw / 4 + pad; }
      if (shape === "circle") hw = hh = Math.max(tw, th) / 2 + s.px(6);
      if (shape === "dot") hw = hh = 5;
      if (shape === "text") { hw = tw / 2 + 3; hh = th / 2 + 2; }
      size.set(n.id, { hw, hh, lines });
    }
    // Fit the nodes' centers, and their sizes, inside the canvas.
    const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    // A dot's name sits beside it, so a network needs room for the widest name on either side.
    const dotName = Math.max(0, ...nodes.filter(n => n.shape === "dot").map(n => ctx.measureText(n.text ?? "").width));
    const marginX = Math.max(...nodes.map(n => size.get(n.id)!.hw)) + (dotted(nodes) ? dotName + s.px(14) : s.px(8));
    const marginY = Math.max(...nodes.map(n => size.get(n.id)!.hh)) + s.px(dotted(nodes) ? 26 : 8);
    const k = Math.min((s.width - 2 * marginX) / Math.max(1e-9, x1 - x0), (s.height - 2 * marginY) / Math.max(1e-9, y1 - y0));
    const ox = (s.width - k * (x1 - x0)) / 2, oy = (s.height - k * (y1 - y0)) / 2;
    const at = ([x, y]: Pt): Pt => [ox + k * (x - x0), oy + k * (y - y0)];

    // Edges first, so that the nodes cover their ends.
    for (const e of edges) {
      const a = byId.get(e.from), b = byId.get(e.to);
      if (!a || !b) continue;
      const route = [at([a.x, a.y]), ...(e.via ?? []).map(at), at([b.x, b.y])];
      const sa = size.get(a.id)!, sb = size.get(b.id)!;
      route[0] = clipToShape(a.shape ?? "box", sa.hw, sa.hh, route[0], route[1]);
      const last = route.length - 1;
      route[last] = clipToShape(b.shape ?? "box", sb.hw, sb.hh, route[last], route[last - 1]);
      ctx.strokeStyle = INK;
      ctx.lineWidth = dotted(nodes) ? 2.5 : 1.75;
      ctx.lineJoin = "round";
      ctx.beginPath();
      route.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
      const [px, py] = route[last - 1], [ex, ey] = route[last];
      const len = Math.hypot(ex - px, ey - py) || 1;
      const ux = (ex - px) / len, uy = (ey - py) / len;
      if (arrows) {
        const h = s.px(10);
        ctx.fillStyle = INK;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - ux * h - uy * h * 0.45, ey - uy * h + ux * h * 0.45);
        ctx.lineTo(ex - ux * h + uy * h * 0.45, ey - uy * h - ux * h * 0.45);
        ctx.closePath();
        ctx.fill();
      }
      if (e.text) {
        const i = Math.floor((route.length - 2) / 2);
        const [ax, ay] = route[i], [bx, by] = route[i + 1];
        const mx = (ax + bx) / 2, my = (ay + by) / 2;
        const l = Math.hypot(bx - ax, by - ay) || 1;
        const nx = -(by - ay) / l, ny = (bx - ax) / l;
        s.labelAway(e.text, [[mx, my, -nx, -ny], [mx, my, nx, ny]], OKABE_ITO.vermillion, `bold ${font}`, 4);
      }
      if (e.head) {
        // Beside the tip, on the side away from the edge's direction.
        s.labelAway(e.head, [[ex, ey, -ux * 0.6 - uy * 0.8, -uy * 0.6 + ux * 0.8], [ex, ey, -ux * 0.6 + uy * 0.8, -uy * 0.6 - ux * 0.8]], INK, `bold ${s.px(16)}px system-ui, sans-serif`, 3);
      }
    }

    for (const n of nodes) {
      const shape = n.shape ?? "box";
      const { hw, hh, lines } = size.get(n.id)!;
      const [cx, cy] = at([n.x, n.y]);
      ctx.beginPath();
      if (shape === "box") ctx.rect(cx - hw, cy - hh, 2 * hw, 2 * hh);
      else if (shape === "terminal") ctx.roundRect(cx - hw, cy - hh, 2 * hw, 2 * hh, hh);
      else if (shape === "diamond") {
        ctx.moveTo(cx, cy - hh); ctx.lineTo(cx + hw, cy); ctx.lineTo(cx, cy + hh); ctx.lineTo(cx - hw, cy); ctx.closePath();
      } else if (shape === "circle" || shape === "dot") ctx.arc(cx, cy, hw, 0, 2 * Math.PI);
      if (shape === "dot") {
        ctx.fillStyle = OKABE_ITO.blue;
        ctx.fill();
        if (n.text) {
          const dirs: Record<string, [number, number]> = { above: [0, -1], below: [0, 1], left: [-1, 0], right: [1, 0] };
          const anchors: [number, number, number, number][] = n.place && dirs[n.place]
            ? [[cx, cy, ...dirs[n.place]]]
            : [[cx, cy, 0, -1], [cx, cy, 0, 1], [cx, cy, 1, 0], [cx, cy, -1, 0]];
          s.labelAway(n.text, anchors, INK, font, 9);
        }
        continue;
      }
      if (shape !== "text") {
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.fillStyle = FILL[shape] ?? "#fff";
        ctx.fill();
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1.75;
        ctx.stroke();
      }
      ctx.font = shape === "text" ? `italic ${s.px(16)}px serif` : font;
      ctx.fillStyle = INK;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      lines.forEach((l, i) => ctx.fillText(l, cx, cy + (i - (lines.length - 1) / 2) * lineH));
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }
    s.finish();
    env.readout.innerHTML = "";
  };
};

/** Whether the diagram is a network of dots, which needs room for the dots' names. */
const dotted = (nodes: NodeSpec[]) => nodes.some(n => n.shape === "dot");
