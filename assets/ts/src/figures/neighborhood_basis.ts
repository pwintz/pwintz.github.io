// ╭───────────────────────────────────────────────────────────────╮
// │      A countable neighborhood basis: balls of radius 1/k       │
// ╰───────────────────────────────────────────────────────────────╯
// The point x is fixed at the origin, with the open balls N₁, N₂, N₃, … of radius 1/k around it.
// The reader drags an open set U and shrinks it with a slider. While U contains x, the figure
// highlights the first ball N_k that lies inside U: however small U gets, some ball still fits.
//
// Params (all optional):
//   name: the open set's name (default U).

import { enableDrag } from "../common/drag_points";
import { OKABE_ITO, PlotLabel, SPAN_COLOR, SPAN_EDGE, Vec3 } from "../common/scene3d";
import { Blob, Pt, blobBoundary, circlePoints, distanceToBoundary, firstBasisBall, pointInPolygon, scaleAbout, translate } from "./geometry";
import { Widget, anchorsAround, beginPlane, labelFont, steady } from "./widget";

const U_BLOB: Blob = { center: [0.3, 0.1], radius: 1.2, wobble: [[2, 0.2, 1.1], [3, 0.12, 0.3]] };
const VIEW_EXTENT = 1.6;
const MIN_SIZE = 0.06;
// Balls beyond this many are too small to draw apart.
const MAX_BALLS = 60;
const BALL = OKABE_ITO.blue;
const POINT = "#000";
const FITS = { stroke: OKABE_ITO.bluishGreen, fill: "rgba(0, 158, 115, 0.22)" };

const v3 = ([x, y]: Pt): Vec3 => [x, y, 0];
const ballLabel = (k: number): PlotLabel => ({ text: `N${String(k).replace(/\d/g, d => "₀₁₂₃₄₅₆₇₈₉"[+d])}`, tex: `N_{${k}}` });

export const neighborhoodBasis: Widget = env => {
  const name = String(env.params.name ?? "U");
  const base = blobBoundary(U_BLOB);
  const x: Pt = [0, 0];
  const ORIGIN: Pt = [0, 0];
  let offset: Pt = [0, 0];
  let size = 1;
  // The slider scales U about x, about a fixed point, so x can be dragged in or out of it.
  const currentU = () => scaleAbout(translate(base, offset[0], offset[1]), ORIGIN, size);

  const label = document.createElement("label");
  label.className = "dict-figure__slider";
  label.innerHTML = `Size of <i>${name}</i>`;
  const slider = document.createElement("input");
  Object.assign(slider, { type: "range", min: String(MIN_SIZE), max: "1", step: "0.01", value: "1" });
  slider.addEventListener("input", () => { size = Number(slider.value); env.redraw(); });
  label.append(slider);
  env.controls.append(label);

  enableDrag(env.canvas, {
    pick: (px, py) => {
      const [sx, sy] = env.scene.project(v3(x));
      if (Math.hypot(px - sx, py - sy) <= 12) return "x";
      return pointInPolygon(env.scene.unproject2D(px, py), currentU()) ? "U" : null;
    },
    move: (target, _px, _py, dx, dy) => {
      const k = env.scene.pxPerUnit;
      if (target === "x") {
        const lim = VIEW_EXTENT * 0.9;
        x[0] = Math.max(-lim, Math.min(lim, x[0] + dx / k));
        x[1] = Math.max(-lim, Math.min(lim, x[1] - dy / k));
        env.redraw();
        return;
      }
      // U's center on the screen follows the pointer, but stays within the view.
      const lim = VIEW_EXTENT * 0.9;
      const clamp = (v: number) => Math.max(-lim, Math.min(lim, v));
      const cx = clamp(size * (U_BLOB.center[0] + offset[0]) + dx / k);
      const cy = clamp(size * (U_BLOB.center[1] + offset[1]) - dy / k);
      // U may only move to places where it still contains x: try the full move, then each axis alone.
      const want: Pt = [cx / size - U_BLOB.center[0], cy / size - U_BLOB.center[1]];
      for (const next of [want, [want[0], offset[1]], [offset[0], want[1]]] as Pt[]) {
        if (pointInPolygon(x, scaleAbout(translate(base, next[0], next[1]), ORIGIN, size))) {
          offset = next;
          break;
        }
      }
      env.redraw();
    },
  });

  const X = "<i>x</i>", S = `<i>${name}</i>`;
  return () => {
    const s = env.scene;
    beginPlane(env, [0, 0], VIEW_EXTENT);
    const U = currentU();
    const inside = pointInPolygon(x, U);
    const k = inside ? firstBasisBall(distanceToBoundary(x, U)) : Infinity;
    // A set not containing x is not a neighborhood of x, so it is drawn in red.
    s.region(U.map(v3), inside ? SPAN_COLOR : "rgba(213, 94, 0, 0.18)", inside ? SPAN_EDGE : OKABE_ITO.vermillion, true);

    const count = Math.min(MAX_BALLS, Math.max(3, Number.isFinite(k) ? k : 0));
    for (let j = 1; j <= count; j++) {
      if (j === k) continue;
      s.path(circlePoints(x, 1 / j).map(v3), BALL, j <= 3 ? 1.75 : 1.1, [4, 4], true);
    }
    if (k <= MAX_BALLS) s.region(circlePoints(x, 1 / k).map(v3), FITS.fill, FITS.stroke, true, 2);

    s.dot(v3(x), 4, POINT);
    const [sx, sy] = s.project(v3(x));
    // Each ball's name sits outside its upper-left edge. The highlighted ball is named first, so it gets its spot.
    const named = [...(k <= MAX_BALLS ? [k] : []), ...[1, 2].filter(j => j !== k)];
    for (const j of named) {
      const t = (125 * Math.PI) / 180;
      const [bx, by] = s.project([x[0] + Math.cos(t) / j, x[1] + Math.sin(t) / j, 0]);
      s.labelAway(ballLabel(j), [[bx, by, Math.cos(t), -Math.sin(t)]], j === k ? FITS.stroke : BALL, labelFont(s), 4);
    }
    s.labelAway({ text: "x", tex: "x" }, anchorsAround(sx, sy).slice(2), POINT, labelFont(s), 4);
    const corner = U.reduce((a, b) => (b[0] + b[1] > a[0] + a[1] ? b : a));
    const [cx, cy] = s.project(v3(corner));
    s.labelAway({ text: name, tex: name }, anchorsAround(cx, cy), SPAN_EDGE, labelFont(s), 6);
    s.finish();

    // (A subscript keeps its plain width: room for more digits there would read as a gap in the name.)
    const nk = `<i>N</i><sub>${k}</sub>`;
    env.readout.innerHTML = !inside
      ? `${X} ∉ ${S}, so ${S} is not a neighborhood of ${X}. Drag ${S} back over ${X}.`
      : k > MAX_BALLS
        ? `The balls are too small to draw here, but some ball of radius 1/<i>k</i> lies inside ${S}.`
        : `${nk}, the open ball of radius 1/${steady(String(k), String(MAX_BALLS))} around ${X}, lies inside ${S}${k > 1 ? `, but <i>N</i><sub>${k - 1}</sub> doesn't` : ""}.`;
  };
};
