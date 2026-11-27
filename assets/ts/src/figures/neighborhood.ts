// ╭───────────────────────────────────────────────────────────────╮
// │          A neighborhood (or open neighborhood) of x in ℝ²       │
// ╰───────────────────────────────────────────────────────────────╯
// A shaded set and a point x that the reader drags. Inside the set, the figure draws an open ball
// around x that fits inside; near the boundary, x snaps onto it, where every ball reaches outside.
//
// Params (all optional):
//   set:  "closed" (default; the set N includes its solid boundary, so it isn't open) or
//         "open" (the set U doesn't include its dashed boundary).
//   ball: whether to draw the ball around x (default true).
//   name: the set's name (default N for a closed set, U for an open one).
//   point: the point's name in TeX (default x), such as \vect{x} for a point of ℝⁿ written as a vector.

import { enableDrag } from "../common/drag_points";
import { OKABE_ITO, PlotLabel, SPAN_COLOR, SPAN_EDGE, Vec3 } from "../common/scene3d";
import { Blob, Pt, blobBoundary, circlePoints, distanceToBoundary, nearestOnBoundary, pointInPolygon } from "./geometry";
import { Widget, anchorsAround, beginPlane, fixed, labelFont, steady, texHTML } from "./widget";

const SET: Blob = { center: [0, 0], radius: 1.35, wobble: [[2, 0.22, 0.5], [3, 0.14, 2.2]] };
const VIEW_EXTENT = 1.75;
// How close (in pixels) x must come to the boundary to snap onto it.
const SNAP_PX = 8;
// The ball drawn around a point inside is this fraction of the largest that fits, so that it
// clearly doesn't touch the boundary.
const BALL_FRACTION = 0.85;
const FITS = { stroke: OKABE_ITO.bluishGreen, fill: "rgba(0, 158, 115, 0.18)" };
const LEAVES = { stroke: OKABE_ITO.vermillion, fill: "rgba(213, 94, 0, 0.14)" };

const v3 = ([x, y]: Pt): Vec3 => [x, y, 0];
const tex = (text: string, t: string): PlotLabel => ({ text, tex: t });

export const neighborhood: Widget = env => {
  const open = env.params.set === "open";
  const showBall = env.params.ball !== false;
  const name = String(env.params.name ?? (open ? "U" : "N"));
  const boundary = blobBoundary(SET);
  let x: Pt = [0.55, 0.35];
  let onBoundary = false;

  enableDrag(env.canvas, {
    pick: (px, py) => {
      const [sx, sy] = env.scene.project(v3(x));
      return Math.hypot(px - sx, py - sy) < 16 ? "x" : null;
    },
    move: (_target, px, py) => {
      const s = env.scene;
      const p = s.unproject2D(px, py);
      const q = nearestOnBoundary(p, boundary);
      const [qx, qy] = s.project(v3(q));
      onBoundary = Math.hypot(px - qx, py - qy) < SNAP_PX;
      // Keep x a little inside the view, so it can be grabbed again.
      const m = 10 / s.pxPerUnit;
      x = onBoundary ? q : [Math.min(s.hi[0] - m, Math.max(s.lo[0] + m, p[0])), Math.min(s.hi[1] - m, Math.max(s.lo[1] + m, p[1]))];
      env.redraw();
    },
  });

  const point = String(env.params.point ?? "x");
  // The readout, with its math typeset like the math in the text around the figure.
  const say = (where: "inside" | "boundary" | "outside", eps: number): string => {
    const T = (t: string) => texHTML(env, t);
    const X = T(point), S = T(name), inS = T(`${point} \\in ${name}`), notInS = T(`${point} \\notin ${name}`);
    const ballFits = `The open ball of radius ${T("\\varepsilon")} = ${steady(fixed(eps), "0.00")} around ${X} lies inside ${S}`;
    if (open) {
      return where === "inside" ? (showBall ? `${ballFits}. ` : "") + `${S} is open and ${inS}, so ${S} is an open neighborhood of ${X}.`
        : where === "boundary" ? `${X} is on the boundary of ${S}. The open set ${S} doesn't contain its boundary, so ${notInS}, and ${S} is not an open neighborhood of ${X}.`
        : `${notInS}, so ${S} is not an open neighborhood of ${X}.`;
    }
    return where === "inside" ? `${ballFits}, so ${S} is a neighborhood of ${X}.`
      : where === "boundary" ? `${X} is on the boundary of ${S}. Every open ball around ${X} reaches outside ${S}, so ${S} is not a neighborhood of ${X}, even though ${inS}.`
      : `${notInS}, so ${S} is not a neighborhood of ${X}.`;
  };

  return () => {
    const s = env.scene;
    beginPlane(env, SET.center, VIEW_EXTENT);
    const where = onBoundary ? "boundary" : pointInPolygon(x, boundary) ? "inside" : "outside";
    s.region(boundary.map(v3), SPAN_COLOR, SPAN_EDGE, open);

    let eps = 0;
    if (showBall && where !== "outside") {
      const fits = where === "inside";
      eps = fits ? BALL_FRACTION * distanceToBoundary(x, boundary) : 0.4;
      const c = fits ? FITS : LEAVES;
      s.region(circlePoints(x, eps).map(v3), c.fill, c.stroke, true, 1.5);
      const t = (-35 * Math.PI) / 180;
      const end: Pt = [x[0] + eps * Math.cos(t), x[1] + eps * Math.sin(t)];
      s.line(v3(x), v3(end), c.stroke, 1.5);
      s.segmentLabel(v3(x), v3(end), tex("ε", "\\varepsilon"), c.stroke, false);
    }

    s.dot(v3(x), 5, OKABE_ITO.blue);
    const [sx, sy] = s.project(v3(x));
    s.labelAway(tex("x", point), anchorsAround(sx, sy), OKABE_ITO.blue, labelFont(s), 5);
    // The set's name, outside its upper-right edge.
    const corner = boundary.reduce((a, b) => (b[0] + b[1] > a[0] + a[1] ? b : a));
    const [cx, cy] = s.project(v3(corner));
    s.labelAway(tex(name, name), anchorsAround(cx, cy), SPAN_EDGE, labelFont(s), 6);
    s.finish();

    env.readout.innerHTML = say(where, eps);
  };
};
