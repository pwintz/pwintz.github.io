// ╭───────────────────────────────────────────────────────────────╮
// │          Angles: the figure, its measure, its sign, turning      │
// ╰───────────────────────────────────────────────────────────────╯
// Params (all optional):
//   mode: "angle" (default): the angle ∠ABC, whose sides are rays from the vertex B through the
//           points A and C that the reader drags. The figure marks the angle's measure and says
//           whether it is acute, right, obtuse, or straight. Near 90° and 180°, a side snaps there.
//         "measure": the same, with a circle of radius r (set by a slider) around the vertex, and
//           the length s of the arc that the angle cuts from it, so θ = s / r.
//         "signed": vectors x and y from the origin, and the signed angle from x to y, drawn as
//           a turn from x toward y the short way.
//         "rotation": a segment that the reader turns about its endpoint, as many times around as
//           they like; the figure adds up the angle of rotation and compares it with the angle
//           between the starting and final positions.
//   square: (mode "angle") draw the angle as the corner of a square, which can't be dragged.
//   face:   (mode "rotation") "clock" for a clock's minute hand or "wheel" for a spoke of a wheel.
//   start:  (mode "rotation") the starting direction in degrees, counterclockwise from the right
//           (default 0, or 90 for a clock, whose hand starts at 12).
//   play:   (mode "rotation") a turn in degrees, such as 720, that a button plays.

import { enableDrag } from "../common/drag_points";
import { OKABE_ITO, PlotLabel, SPAN_COLOR, SPAN_EDGE, SPAN_GRID, Scene, Vec3 } from "../common/scene3d";
import { accumulate, angleBetween, angleKind, direction, signedAngle, snapDirection, turnSpiral, wrap } from "./angles";
import { Pt } from "./geometry";
import { FigureEnv, Widget, addButton, addSlider, anchorsAround, degrees, it, labelFont, showCalc, steadyDegrees, steadyFixed, steadyFixedTex, texNumber } from "./widget";

const v3 = ([x, y]: Pt): Vec3 => [x, y, 0];
const tex = (t: string): PlotLabel => ({ text: t, tex: t });
const polar = (r: number, t: number): Pt => [r * Math.cos(t), r * Math.sin(t)];
const DEG = Math.PI / 180;
const SIDE = "#3b4252";
const ARC = OKABE_ITO.vermillion;
const CCW = OKABE_ITO.bluishGreen;
const CW = OKABE_ITO.vermillion;

/** Points on the circle of radius r about c, from the direction t0, turning by `delta` radians. */
function arc(c: Pt, r: number, t0: number, delta: number, n = 60): Pt[] {
  const steps = Math.max(2, Math.ceil((n * Math.abs(delta)) / Math.PI));
  return Array.from({ length: steps + 1 }, (_, i): Pt => {
    const t = t0 + (delta * i) / steps;
    return [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)];
  });
}

/** An arrowhead at the end of a curve drawn through `pts`, pointing along its last step. */
function arrowHead(s: Scene, pts: Pt[], color: string, size = 10): void {
  const [ex, ey] = s.project(v3(pts[pts.length - 1]));
  // A point a little way back along the curve gives the direction on the screen.
  let k = pts.length - 2, bx = ex, by = ey;
  while (k >= 0 && Math.hypot(ex - bx, ey - by) < 6) [bx, by] = s.project(v3(pts[k--]));
  const len = Math.hypot(ex - bx, ey - by);
  if (len < 1) return;
  const ux = (ex - bx) / len, uy = (ey - by) / len;
  const ctx = s.ctx;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(ex + ux * 2, ey + uy * 2);
  ctx.lineTo(ex - ux * size - uy * size * 0.45, ey - uy * size + ux * size * 0.45);
  ctx.lineTo(ex - ux * size + uy * size * 0.45, ey - uy * size - ux * size * 0.45);
  ctx.closePath();
  ctx.fill();
}

/** The point where the ray from p in the direction t leaves the view, a little inside its edge. */
function rayEnd(s: Scene, p: Pt, t: number): Pt {
  const m = 12 / s.pxPerUnit;
  const d: Pt = [Math.cos(t), Math.sin(t)];
  let tMax = Infinity;
  for (const k of [0, 1]) {
    if (Math.abs(d[k]) < 1e-12) continue;
    const edge = d[k] > 0 ? s.hi[k] - m : s.lo[k] + m;
    tMax = Math.min(tMax, (edge - p[k]) / d[k]);
  }
  return [p[0] + tMax * d[0], p[1] + tMax * d[1]];
}

/** The small square that marks a right angle at p between the directions t1 and t1 + 90° (or t1 − 90°). */
function rightAngleMark(s: Scene, p: Pt, t1: number, t2: number, size: number, color: string): void {
  const a = polar(size, t1), b = polar(size, t2);
  s.path([[p[0] + a[0], p[1] + a[1], 0], [p[0] + a[0] + b[0], p[1] + a[1] + b[1], 0], [p[0] + b[0], p[1] + b[1], 0]], color, 1.75);
}

function begin(env: FigureEnv, center: Pt, extent: number, grid: boolean): void {
  env.scene.begin(env.canvas, { dim: 2, yaw: 0, pitch: 0, perspective: false, center: [center[0], center[1], 0], extent });
  if (grid) env.scene.gridAndAxes(SPAN_GRID);
}

/** Lets the reader drag the named points, keeping each at least `minR` from the vertex at the origin. */
function dragPoints(env: FigureEnv, points: Record<string, Pt>, minR: number, moved: (k: string) => void): void {
  enableDrag(env.canvas, {
    pick: (px, py) => {
      let best: string | null = null, bestD = 16;
      for (const [k, p] of Object.entries(points)) {
        const [sx, sy] = env.scene.project(v3(p));
        const d = Math.hypot(px - sx, py - sy);
        if (d < bestD) { bestD = d; best = k; }
      }
      return best;
    },
    move: (k, px, py) => {
      const s = env.scene;
      const m = 10 / s.pxPerUnit;
      let p = s.unproject2D(px, py);
      p = [Math.min(s.hi[0] - m, Math.max(s.lo[0] + m, p[0])), Math.min(s.hi[1] - m, Math.max(s.lo[1] + m, p[1]))];
      const r = Math.hypot(p[0], p[1]);
      points[k] = r < minR ? polar(minR, direction(r > 0 ? p : points[k])) : p;
      moved(k);
      env.redraw();
    },
  });
}

/** ∠ABC (and, in the "measure" mode, the arc s that it cuts from a circle of radius r). */
function angleFigure(env: FigureEnv, measure: boolean): () => void {
  const square = !measure && env.params.square === true;
  const pts: Record<string, Pt> = square ? { A: [1, 0], C: [0, 1] } : { A: [1.1, 0], C: polar(1.1, 55 * DEG) };
  let r = 0.8;
  if (measure) addSlider(env, `Radius ${it("r")}`, { min: 0.3, max: 1.2, step: 0.01, value: r }, v => { r = v; });
  if (!square) {
    dragPoints(env, pts, 0.3, k => {
      // A side near a right or straight angle with the other side snaps onto it.
      const other = pts[k === "A" ? "C" : "A"];
      const p = pts[k], len = Math.hypot(p[0], p[1]);
      pts[k] = polar(len, snapDirection(direction(p), direction(other), [Math.PI / 2, Math.PI], 2.5 * DEG));
    });
  }
  const center: Pt = square ? [0.45, 0.45] : [0.2, 0.35];
  const B: Pt = [0, 0];

  return () => {
    const s = env.scene;
    begin(env, center, square ? 0.85 : 1.05, false);
    const tA = direction(pts.A), tC = direction(pts.C);
    const delta = signedAngle(pts.A, pts.C);
    const theta = Math.abs(delta);
    const kind = angleKind(theta / DEG);
    if (square) s.region([[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]], SPAN_COLOR, SPAN_EDGE, false);

    // The sides: rays from B, through A and C, out of the view.
    // (The sides of a square are segments, which end at the next corners.)
    for (const t of [tA, tC]) {
      if (square) s.line(v3(B), v3(polar(1, t)), SIDE, 2.5);
      else s.arrow(v3(B), v3(rayEnd(s, B, t)), SIDE, 2);
    }
    if (measure) {
      s.path(arc(B, r, 0, 2 * Math.PI, 120).map(v3), SPAN_EDGE, 1.25, [5, 4]);
      s.path(arc(B, r, tA, delta).map(v3), ARC, 4);
      s.segmentLabel(v3(B), v3(polar(r, tA)), tex("r"), SIDE, false);
    } else if (kind === "right") {
      rightAngleMark(s, B, tA, tC, 0.16, ARC);
    } else if (kind !== "zero") {
      s.path(arc(B, 0.28, tA, delta).map(v3), ARC, 2);
    }
    // The measure, outside the middle of the arc.
    const mid = tA + delta / 2;
    const rl = measure ? r : 0.28;
    const [mx, my] = s.project(v3(polar(rl, mid)));
    const dir: [number, number, number, number] = [mx, my, Math.cos(mid), -Math.sin(mid)];
    s.labelAway(measure ? tex("s") : degrees(theta), [dir], ARC, measure ? labelFont(s) : `${s.px(15)}px system-ui, sans-serif`, 5);

    s.dot(v3(B), 4.5, SIDE);
    const [bx, by] = s.project(v3(B));
    s.labelAway(tex("B"), anchorsAround(bx, by).slice(3), SIDE, labelFont(s), 5);
    for (const k of ["A", "C"]) {
      s.dot(v3(pts[k]), square ? 4.5 : 6, square ? SIDE : OKABE_ITO.blue);
      const [x, y] = s.project(v3(pts[k]));
      s.labelAway(tex(k), anchorsAround(x, y), square ? SIDE : OKABE_ITO.blue, labelFont(s), 6);
    }
    s.finish();

    const rad = `${steadyFixed(theta, 0, Math.PI)} radians`;
    const deg = steadyDegrees(theta, 0, Math.PI);
    if (measure) {
      showCalc(env, [
        `s = ${steadyFixedTex(theta * r, 0, 1.2 * Math.PI)}, \\quad r = ${steadyFixedTex(r, 0.3, 1.2)}`,
        `\\theta = s/r = ${steadyFixedTex(theta, 0, Math.PI)} \\text{ radians} = ${texNumber(degrees(theta))}`,
      ]);
      env.readout.innerHTML = `Changing ${it("r")} changes ${it("s")}, but not ${it("θ")}.`;
      return;
    }
    if (square) { env.readout.innerHTML = ""; return; }
    const angle = "∠<i>ABC</i>";
    const says: Record<string, string> = {
      zero: `${angle} measures 0°, because the two sides are the same ray.`,
      acute: `${angle} measures ${deg} (${rad}), which is less than 90°, so ${angle} is acute.`,
      right: `${angle} measures 90° (π/2 radians), so ${angle} is a right angle.`,
      obtuse: `${angle} measures ${deg} (${rad}), which is between 90° and 180°, so ${angle} is obtuse.`,
      straight: `${angle} measures 180° (π radians), because the sides point in opposite directions, so ${angle} is a straight angle.`,
    };
    env.readout.innerHTML = says[kind];
  };
}

/** The signed angle from the vector x to the vector y. */
function signedFigure(env: FigureEnv): () => void {
  const pts: Record<string, Pt> = { x: [1.1, 0.3], y: polar(1, 120 * DEG) };
  dragPoints(env, pts, 0.3, k => {
    const other = pts[k === "x" ? "y" : "x"];
    const p = pts[k], len = Math.hypot(p[0], p[1]);
    pts[k] = polar(len, snapDirection(direction(p), direction(other), [0, Math.PI], 2 * DEG));
  });
  const colors: Record<string, string> = { x: OKABE_ITO.blue, y: OKABE_ITO.reddishPurple };

  return () => {
    const s = env.scene;
    begin(env, [0, 0], 1.4, true);
    const theta = signedAngle(pts.x, pts.y);
    const c = theta >= 0 ? CCW : CW;
    const turn = arc([0, 0], 0.4, direction(pts.x), theta);
    if (Math.abs(theta) > 3 * DEG) {
      s.path(turn.map(v3), c, 2.25);
      arrowHead(s, turn, c);
    }
    for (const k of ["x", "y"]) s.arrow([0, 0, 0], v3(pts[k]), colors[k], 2.5, { text: k, tex: `\\mathbf{${k}}` });
    const mid = direction(pts.x) + theta / 2;
    const [mx, my] = s.project(v3(polar(0.4, mid)));
    s.labelAway(degrees(theta), [[mx, my, Math.cos(mid), -Math.sin(mid)]], c, `${s.px(15)}px system-ui, sans-serif`, 6);
    s.finish();

    const X = "<b>x</b>", Y = "<b>y</b>";
    const d = Math.round(theta / DEG);
    env.readout.innerHTML =
      d === 0 ? `The signed angle from ${X} to ${Y} is 0°, because ${X} and ${Y} point in the same direction.`
      : d === 180 ? `The signed angle from ${X} to ${Y} is 180°: ${X} and ${Y} point in opposite directions, so both ways around are the same, and the signed angle is taken to be 180° rather than −180°.`
      : `The signed angle from ${X} to ${Y} is ${steadyDegrees(theta, -Math.PI, Math.PI)}, because turning ${X} toward ${Y} the short way is ${d > 0 ? "counterclockwise" : "clockwise"}.`;
  };
}

/** A segment turned about its endpoint, adding up the angle of rotation. */
function rotationFigure(env: FigureEnv): () => void {
  const face = String(env.params.face ?? "");
  const clock = face === "clock", wheel = face === "wheel";
  const start = Number(env.params.start ?? (clock ? 90 : 0)) * DEG;
  const length = clock ? 0.68 : 1;
  let dir = start, total = 0;
  let anim = 0;
  const stop = () => { if (anim) cancelAnimationFrame(anim); anim = 0; };

  enableDrag(env.canvas, {
    pick: (px, py) => {
      const [sx, sy] = env.scene.project(v3(polar(length, dir)));
      return Math.hypot(px - sx, py - sy) < 18 ? "hand" : null;
    },
    move: (_k, px, py) => {
      stop();
      const p = env.scene.unproject2D(px, py);
      if (Math.hypot(p[0], p[1]) < 0.15) return;
      const next = direction(p);
      total = accumulate(total, dir, next);
      dir = next;
      env.redraw();
    },
  });
  const play = Number(env.params.play ?? 0);
  if (play) {
    addButton(env, `Turn ${Math.abs(play)}° ${play > 0 ? "counterclockwise" : "clockwise"}`, () => {
      stop();
      const goal = play * DEG;
      const ms = Math.max(1200, (Math.abs(goal) / (2 * Math.PI)) * 1600);
      let t0 = 0;
      const step = (now: number) => {
        if (!t0) t0 = now;
        const u = Math.min(1, (now - t0) / ms);
        const eased = u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u);
        total = goal * eased;
        dir = wrap(start + total);
        env.redraw();
        anim = u < 1 ? requestAnimationFrame(step) : 0;
      };
      anim = requestAnimationFrame(step);
    });
  }
  addButton(env, "Reset", () => { stop(); total = 0; dir = start; env.redraw(); });

  const HAND = OKABE_ITO.blue;
  return () => {
    const s = env.scene;
    begin(env, [0, 0], 1.25, false);
    const O: Vec3 = [0, 0, 0];
    if (clock) {
      s.path(arc([0, 0], 1.12, 0, 2 * Math.PI, 120).map(v3), SIDE, 2.5);
      for (let h = 0; h < 12; h++) {
        const t = Math.PI / 2 - (h * Math.PI) / 6;
        s.line(v3(polar(1.12, t)), v3(polar(h % 3 ? 1.04 : 0.98, t)), SIDE, h % 3 ? 1.5 : 2.5);
      }
      const font = `${s.px(17)}px system-ui, sans-serif`;
      s.ctx.textBaseline = "middle";
      for (const [h, t] of [[12, 90], [3, 0], [6, -90], [9, 180]]) {
        const [x, y] = s.project(v3(polar(0.84, t * DEG)));
        s.haloText(String(h), x, y, SIDE, font);
      }
      s.ctx.textBaseline = "alphabetic";
    }
    if (wheel) {
      s.path(arc([0, 0], 1.1, 0, 2 * Math.PI, 120).map(v3), SIDE, 4);
      for (let k = 1; k < 6; k++) s.line(O, v3(polar(1.1, dir + (k * Math.PI) / 3)), "rgba(59, 66, 82, 0.45)", 2);
    }
    // The turn so far, as a spiral, so that each extra time around shows.
    const c = total >= 0 ? CCW : CW;
    if (Math.abs(total) > 2 * DEG) {
      const spiral = turnSpiral(start, total, clock ? 0.3 : 0.32, 0.12);
      s.path(spiral.map(v3), c, 2.25);
      arrowHead(s, spiral, c);
      // The angle of rotation, outside the middle of the spiral's last turn (or of the whole turn, if less).
      const back = Math.sign(total) * Math.min(Math.abs(total), 2 * Math.PI) / 2;
      const k = Math.round(((total - back) / total) * (spiral.length - 1));
      const t = start + total - back;
      const [lx, ly] = s.project(v3(spiral[k]));
      s.labelAway(degrees(total), [[lx, ly, Math.cos(t), -Math.sin(t)], [lx, ly, -Math.cos(t), Math.sin(t)]], c, `bold ${s.px(16)}px system-ui, sans-serif`, 6);
    }
    // The starting position, dashed, and the hand (or spoke) now.
    s.line(O, v3(polar(length, start)), SIDE, 2, [6, 5]);
    s.line(O, v3(polar(length, dir)), HAND, clock ? 5 : 4);
    s.dot(v3(polar(length, dir)), 6, HAND);
    s.dot(O, 5, SIDE);
    const [ex, ey] = s.project(v3(polar(length, start)));
    if (!clock) s.labelAway("start", [[ex, ey, Math.cos(start), -Math.sin(start)], [ex, ey, -Math.sin(start), -Math.cos(start)]], SIDE, `${s.px(15)}px system-ui, sans-serif`, 6);
    s.finish();

    const between = steadyDegrees(angleBetween(polar(1, start), polar(1, dir)), 0, Math.PI);
    const what = clock ? "hand" : wheel ? "spoke" : "segment";
    env.readout.innerHTML = Math.abs(total) < 0.5 * DEG
      ? `Drag the end of the ${what} around the center to turn it.`
      : `The angle of rotation is ${steadyDegrees(total)} (${total > 0 ? "counterclockwise" : "clockwise"}). ` +
        `The angle between the starting position (dashed) and the final position of the ${what} measures ${between}.`;
  };
}

export const angle: Widget = env => {
  switch (env.params.mode) {
    case "measure": return angleFigure(env, true);
    case "signed": return signedFigure(env);
    case "rotation": return rotationFigure(env);
    default: return angleFigure(env, false);
  }
};
