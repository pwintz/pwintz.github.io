// ╭───────────────────────────────────────────────────────────────╮
// │        A quadcopter drone, and the signals that act on it       │
// ╰───────────────────────────────────────────────────────────────╯
// A side view of a hovering drone, for the examples of exogenous inputs.
//
// Params:
//   scenario: "gust":    gusty wind (with a slider for its strength) pushes the drone around the
//                        point where it is trying to hover (a disturbance), as an animation that
//                        a button pauses (paused at the start for readers who ask for reduced motion).
//             "gps":     the drone flies steadily to the right (it stays in the middle, while clouds and
//                        trees scroll past), and GPS readings of its position, taken periodically,
//                        scatter around where it was (with a slider for the noise level), while the
//                        drone itself flies straight (measurement noise). Animated like "gust".
//             "motors":  a slider for the motor command sets the thrust, which the flight
//                        controller chooses (a control input).
//             "payload": a payload makes the drone heavier than modeled (with a slider for the
//                        extra mass), while the thrust is set for the modeled mass (a perturbation).

import { OKABE_ITO, Scene, Vec3 } from "../common/scene3d";
import { Pt } from "./geometry";
import { Widget, addButton, addSlider, showKey, steady } from "./widget";

const BODY = "#3b4252";
const GHOST = "rgba(59, 66, 82, 0.55)";
const THRUST = OKABE_ITO.bluishGreen;
const WEIGHT = OKABE_ITO.vermillion;
const WIND = OKABE_ITO.skyBlue;
const READING = OKABE_ITO.reddishPurple;
// The scenery that scrolls past the flying drone: muted, so that the readings stand out.
const CLOUD = "rgba(150, 170, 195, 0.22)";
const GROUND = "rgba(120, 150, 100, 0.16)";
const GROUND_EDGE = "rgba(100, 130, 85, 0.5)";
const TREE = "rgba(95, 145, 90, 0.55)";
const TRUNK = "rgba(110, 90, 70, 0.6)";

/** Draws the drone centered at `c`, tilted clockwise by `tilt` radians, and `scale` times its usual size; a ghost is a dashed outline. */
export function drawQuadcopter(s: Scene, c: Pt, tilt: number, ghost = false, scale = 1): void {
  const cos = Math.cos(-tilt) * scale, sin = Math.sin(-tilt) * scale;
  const P = ([x, y]: Pt): Vec3 => [c[0] + x * cos - y * sin, c[1] + x * sin + y * cos, 0];
  const shape = (pts: Pt[], fill: string) => {
    if (ghost) s.path(pts.map(P), GHOST, 1.5, [5, 4], true);
    else s.polygon(pts.map(P), fill);
  };
  const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  // Arms, body, motors, propellers (seen edge-on, blurred), and landing legs.
  shape(rect(-0.46, 0.015, 0.46, 0.055), BODY);
  shape(rect(-0.17, -0.06, 0.17, 0.09), BODY);
  for (const side of [-1, 1]) {
    shape(rect(side * 0.44 - 0.035, 0.055, side * 0.44 + 0.035, 0.12), BODY);
    if (ghost) s.line(P([side * 0.44 - 0.17, 0.135]), P([side * 0.44 + 0.17, 0.135]), GHOST, 1.5, [5, 4]);
    else {
      s.line(P([side * 0.44 - 0.17, 0.135]), P([side * 0.44 + 0.17, 0.135]), "rgba(59, 66, 82, 0.35)", 6);
      s.line(P([side * 0.44 - 0.17, 0.135]), P([side * 0.44 + 0.17, 0.135]), BODY, 1.5);
    }
    s.line(P([side * 0.1, -0.06]), P([side * 0.16, -0.16]), ghost ? GHOST : BODY, 2, ghost ? [4, 3] : []);
    s.line(P([side * 0.09, -0.16]), P([side * 0.23, -0.16]), ghost ? GHOST : BODY, 2, ghost ? [4, 3] : []);
  }
  if (!ghost) s.dot(P([0.12, 0.015]), 2.5, OKABE_ITO.yellow);
}

/** A seeded pseudorandom generator (mulberry32), so the scattered readings stay put between frames. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Standard normal samples from a uniform generator (Box–Muller). */
export function normalPair(rand: () => number): [number, number] {
  const u = 1 - rand(), v = rand();
  const r = Math.sqrt(-2 * Math.log(u));
  return [r * Math.cos(2 * Math.PI * v), r * Math.sin(2 * Math.PI * v)];
}

/**
 * The drone in gusty wind, in the plane of the side view: the wind's force d(t) (a steady breeze,
 * slow swells, and random gusts) pushes the drone, and its flight controller pulls it back toward
 * the target at the origin, like a damped spring: p″ = s·d(t) − k p − c p′, with s the gust strength.
 */
export class GustSim {
  t = 0;
  pos: Pt = [0, 0];
  vel: Pt = [0, 0];
  /** The random part of the wind: a process that drifts back toward 0 (Ornstein–Uhlenbeck), smoothed. */
  private raw: Pt = [0, 0];
  private gust: Pt = [0, 0];
  constructor(private rand: () => number, public k = 2.5, public c = 2) {}

  /** The wind's force at the current time, for gust strength 1. */
  wind(): Pt {
    const t = this.t;
    return [
      0.55 + 0.4 * Math.sin(0.7 * t) + 0.25 * Math.sin(1.9 * t + 1) + this.gust[0],
      0.25 * Math.sin(1.1 * t + 2) + 0.15 * Math.sin(2.3 * t) + 0.35 * this.gust[1],
    ];
  }

  /** The controller's force: back toward the target, damped. */
  control(): Pt {
    return [-this.k * this.pos[0] - this.c * this.vel[0], -this.k * this.pos[1] - this.c * this.vel[1]];
  }

  /** Advances the time by dt (in small steps), with gust strength `strength`. */
  step(dt: number, strength: number): void {
    const n = Math.max(1, Math.ceil(dt / 0.005)), h = dt / n;
    for (let i = 0; i < n; i++) {
      const [z0, z1] = normalPair(this.rand);
      const theta = 1.2, sigma = 1.3, lag = 0.7;
      this.raw = [
        this.raw[0] - theta * this.raw[0] * h + sigma * Math.sqrt(h) * z0,
        this.raw[1] - theta * this.raw[1] * h + sigma * Math.sqrt(h) * z1,
      ];
      // A low-pass filter, so that the gusts swell and fade instead of jittering.
      this.gust = [this.gust[0] + ((this.raw[0] - this.gust[0]) * h) / lag, this.gust[1] + ((this.raw[1] - this.gust[1]) * h) / lag];
      const w = this.wind(), u = this.control();
      const a: Pt = [strength * w[0] + u[0], strength * w[1] + u[1]];
      this.vel = [this.vel[0] + a[0] * h, this.vel[1] + a[1] * h];
      this.pos = [this.pos[0] + this.vel[0] * h, this.pos[1] + this.vel[1] * h];
      this.t += h;
    }
  }
}

/** One GPS reading: where the drone was when it was taken, and the reading's error for noise level 1. */
export interface GpsReading { at: Pt; error: Pt }

/**
 * The drone flying to the right at `speed` along the line y = `y`, from x = 0, with a GPS reading every `period`
 * seconds. The readings less than `keep` behind the drone are kept, so that they trail behind it.
 */
export class GpsFlight {
  t = 0;
  readings: GpsReading[] = [];
  private nextReading = 0;
  constructor(private rand: () => number, public y: number, public speed = 0.3, public period = 0.6, public keep = 3) {}

  /** The drone's position now. */
  position(): Pt {
    return [this.speed * this.t, this.y];
  }

  /** Advances the time by dt, taking the readings that fall due, and dropping the ones too far behind. */
  step(dt: number): void {
    this.t += dt;
    while (this.nextReading <= this.t) {
      this.readings.push({ at: [this.speed * this.nextReading, this.y], error: normalPair(this.rand) });
      this.nextReading += this.period;
    }
    const x = this.position()[0];
    this.readings = this.readings.filter(r => r.at[0] > x - this.keep);
  }
}

/** A number from 0 to 1 that depends only on `i`, for scenery that stays put as it scrolls past. */
export const hash01 = (i: number) => seeded(Math.imul(i, 2654435761) ^ 0x9e3779b9)();

/**
 * Clouds and a ground with trees, scrolled for a camera at x = `camera` that follows the drone, so that the drone
 * looks as if it is flying to the right. The clouds are farther away, so they scroll more slowly.
 */
function drawScenery(s: Scene, camera: number): void {
  const ctx = s.ctx;
  const left = s.lo[0], right = s.hi[0];
  // The clouds, at 0.35 of the speed (a little parallax).
  const cloudShift = camera * 0.35, cloudGap = 1.1;
  for (let k = Math.floor((left + cloudShift - 0.5) / cloudGap); k <= (right + cloudShift + 0.5) / cloudGap; k++) {
    const cx = k * cloudGap + 0.4 * hash01(k) - cloudShift + 0.1, cy = 0.5 + 0.3 * hash01(k + 1000);
    const size = 0.1 + 0.06 * hash01(k + 2000);
    ctx.fillStyle = CLOUD;
    ctx.beginPath();
    for (const [dx, dy, r] of [[-1.1, -0.2, 0.75], [0, 0.15, 1], [1.1, -0.15, 0.8], [0.4, -0.35, 0.7], [-0.5, -0.35, 0.7]]) {
      const [x, y] = s.project([cx + dx * size, cy + dy * size, 0]);
      ctx.moveTo(x + r * size * s.pxPerUnit, y);
      ctx.arc(x, y, r * size * s.pxPerUnit, 0, 2 * Math.PI);
    }
    ctx.fill();
  }
  // The ground, with trees, scrolling with the drone's speed.
  const groundY = -0.62;
  s.polygon([[left, groundY, 0], [right, groundY, 0], [right, s.lo[1], 0], [left, s.lo[1], 0]], GROUND);
  s.line([left, groundY, 0], [right, groundY, 0], GROUND_EDGE, 1.5);
  const treeGap = 0.45;
  for (let k = Math.floor((left + camera - 0.3) / treeGap); k <= (right + camera + 0.3) / treeGap; k++) {
    if (hash01(k + 3000) < 0.2) continue;
    const x = k * treeGap + 0.2 * hash01(k + 4000) - camera + 0.1, h = 0.12 + 0.1 * hash01(k + 5000);
    s.line([x, groundY, 0], [x, groundY + h, 0], TRUNK, 3.5);
    const [tx, ty] = s.project([x, groundY + h, 0]);
    ctx.fillStyle = TREE;
    ctx.beginPath();
    ctx.arc(tx, ty, (0.07 + 0.04 * hash01(k + 6000)) * s.pxPerUnit, 0, 2 * Math.PI);
    ctx.fill();
  }
}

/** A percentage in a readout, with room for 100% (see steady). */
const pct = (v: number) => steady(`${Math.round(v * 100)}%`, "100%");

export const quadcopter: Widget = env => {
  const scenario = String(env.params.scenario ?? "gust");
  let level = scenario === "motors" ? 0.6 : scenario === "payload" ? 0.1 : scenario === "gps" ? 0.15 : 0.6;
  const labels: Record<string, [string, number, number]> = {
    gust: ["Gust strength", 0, 1], gps: ["Noise level", 0, 1], motors: ["Motor command", 0, 1], payload: ["Extra mass", 0, 0.3],
  };
  const [labelText, min, max] = labels[scenario] ?? labels.gust;
  addSlider(env, labelText, { min, max, step: 0.01, value: level }, v => { level = v; });

  // The animations of the gust and of the flight: they run while the figure is on screen and not paused.
  const sim = new GustSim(seeded(11));
  const flight = new GpsFlight(seeded(7), 0.15);
  const trail: Pt[] = [];
  let paused = false, visible = false, frame = 0, last = 0;
  const tick = (now: number) => {
    frame = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    if (scenario === "gps") flight.step(dt);
    else {
      sim.step(dt, level);
      trail.push(sim.pos);
      if (trail.length > 150) trail.shift();
    }
    env.redraw();
    schedule();
  };
  const schedule = () => {
    if (!frame && !paused && visible) frame = requestAnimationFrame(tick);
    if (paused || !visible) last = 0;
  };
  if (scenario === "gust" || scenario === "gps") {
    paused = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const button = addButton(env, paused ? "Play" : "Pause", () => {
      paused = !paused;
      button.textContent = paused ? "Play" : "Pause";
      if (paused && frame) { cancelAnimationFrame(frame); frame = 0; }
      schedule();
    });
    new IntersectionObserver(entries => {
      visible = entries.some(e => e.isIntersecting);
      if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; }
      schedule();
    }).observe(env.figure);
  }
  const font = (s: Scene) => `${s.px(13)}px system-ui, sans-serif`;

  return () => {
    const s = env.scene;
    s.begin(env.canvas, { dim: 2, yaw: 0, pitch: 0, perspective: false, center: [0.1, 0, 0], extent: 0.95 });

    if (scenario === "gust") {
      const g = level;
      const target: Pt = [0.1, 0.05];
      const at: Pt = [target[0] + sim.pos[0], target[1] + sim.pos[1]];
      // The wind now: arrows along its direction, upwind of the target, as long and thick as it is strong.
      const [wx, wy] = sim.wind();
      const strength = g * Math.hypot(wx, wy);
      if (strength > 0.02) {
        const ux = wx / Math.hypot(wx, wy), uy = wy / Math.hypot(wx, wy);
        const len = 0.1 + 0.22 * Math.min(strength, 1.6);
        for (let i = 0; i < 4; i++) {
          const off = -0.42 + i * 0.28, back = 0.72 + (i % 2) * 0.08;
          const x0 = target[0] - ux * back - uy * off, y0 = target[1] - uy * back + ux * off;
          s.arrow([x0 - ux * len, y0 - uy * len, 0], [x0, y0, 0], WIND, 1.5 + 2 * Math.min(strength, 1.2), i === 0 ? "gust" : undefined);
        }
      }
      // Where the drone has been lately, fading out.
      const ctx = s.ctx;
      for (let i = 1; i < trail.length; i++) {
        const [ax, ay] = s.project([target[0] + trail[i - 1][0], target[1] + trail[i - 1][1], 0]);
        const [bx, by] = s.project([target[0] + trail[i][0], target[1] + trail[i][1], 0]);
        ctx.strokeStyle = `rgba(0, 114, 178, ${(0.5 * i) / trail.length})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
      drawQuadcopter(s, target, 0, true);
      s.line([target[0] - 0.06, target[1], 0], [target[0] + 0.06, target[1], 0], GHOST, 1.5);
      s.line([target[0], target[1] - 0.06, 0], [target[0], target[1] + 0.06, 0], GHOST, 1.5);
      const [tx, ty] = s.project([target[0], target[1] - 0.2, 0]);
      s.labelAway("target", [[tx, ty, 0, 1]], BODY, font(s), 6);
      // The drone tilts toward the controller's force, to aim its thrust that way.
      const [fx] = sim.control();
      drawQuadcopter(s, at, Math.max(-0.35, Math.min(0.35, 0.15 * fx)));
      s.finish();
      env.readout.innerHTML = g < 0.02
        ? "With no wind, the drone hovers at its target."
        : "The wind pushes the drone around its target (dashed), and the flight controller keeps pulling it back. " +
          "The wind changes where the drone actually is, which is part of the drone's state.";
      return;
    }

    if (scenario === "gps") {
      // The view follows the drone, which stays in the middle, while the scenery and the readings scroll past it.
      const camera = flight.position()[0];
      const view = ([x, y]: Pt): Vec3 => [x - camera + 0.1, y, 0];
      drawScenery(s, camera);
      const ctx = s.ctx;
      // The readings, each with a dot where the drone actually was when it was taken, and a faint line between them.
      // The newest readings are the boldest.
      flight.readings.forEach((r, i) => {
        const [ax, ay] = s.project(view(r.at));
        const [x, y] = s.project(view([r.at[0] + 0.35 * level * r.error[0], r.at[1] + 0.35 * level * r.error[1]]));
        const age = flight.readings.length - 1 - i;
        ctx.globalAlpha = Math.max(0.4, 1 - 0.07 * age);
        ctx.strokeStyle = READING;
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(ax, ay); ctx.lineTo(x, y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = BODY;
        ctx.beginPath();
        ctx.arc(ax, ay, s.px(3.5), 0, 2 * Math.PI);
        ctx.fill();
        // As large as the × in the key, which is in the page's font.
        const h = 0.24 * s.px(15);
        ctx.strokeStyle = READING;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - h, y - h); ctx.lineTo(x + h, y + h);
        ctx.moveTo(x + h, y - h); ctx.lineTo(x - h, y + h);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
      // The drone, small so that the readings around it show.
      drawQuadcopter(s, [0.1, flight.y], 0, false, 0.45);
      s.finish();
      showKey(env, [
        { symbol: "×", color: READING, label: "GPS reading" },
        { symbol: "●", color: BODY, label: "True position" },
      ], "top-left");
      env.readout.innerHTML = level < 0.01
        ? "Without noise, every GPS reading is where the drone actually was."
        : "The GPS readings jump around the drone's path, but the drone itself flies straight: the noise changes what the flight controller sees, not where the drone is.";
      return;
    }

    // The forces: the thrust of the two rotors seen from the side, and the weight.
    const c: Pt = [0.1, 0.15];
    const payload = scenario === "payload";
    const thrust = payload ? 0.5 : level;
    const weight = payload ? 0.5 * (1 + level) : 0.5;
    if (payload) {
      s.line([c[0], c[1] - 0.06, 0], [c[0], c[1] - 0.4, 0], BODY, 1.25);
      const w = 0.12 + 0.3 * level;
      s.polygon([[c[0] - w / 2, c[1] - 0.4, 0], [c[0] + w / 2, c[1] - 0.4, 0], [c[0] + w / 2, c[1] - 0.4 - w * 0.8, 0], [c[0] - w / 2, c[1] - 0.4 - w * 0.8, 0]], "rgba(230, 159, 0, 0.55)", BODY);
    }
    drawQuadcopter(s, c, 0);
    for (const side of [-1, 1]) {
      const x = c[0] + side * 0.44;
      s.arrow([x, c[1] + 0.16, 0], [x, c[1] + 0.16 + 0.55 * thrust, 0], THRUST, 3, side > 0 ? "thrust" : undefined);
    }
    // The weight, beside the drone so it doesn't cover it, as long as the two thrust arrows together.
    const wx = c[0] - 0.75;
    s.arrow([wx, c[1], 0], [wx, c[1] - 1.1 * weight, 0], WEIGHT, 3, "weight");
    s.finish();

    if (payload) {
      env.readout.innerHTML = level < 0.005
        ? "With no payload, the drone's mass matches its model, and the thrust, set for the modeled mass, balances the weight."
        : `The thrust is set for the modeled mass, but the payload makes the drone ${pct(level)} heavier, so the weight is ${pct(level)} more than the thrust. ` +
          "The payload changes a parameter of the drone (its mass), not a signal going into it.";
      return;
    }
    const d = Math.round(level * 100) - 50;
    env.readout.innerHTML = `The flight controller chooses a motor command of ${pct(level)}. ` + (d === 0
      ? "The thrust balances the weight, so the drone hovers."
      : d > 0 ? "The thrust is more than the weight, so the drone speeds up upward."
      : "The thrust is less than the weight, so the drone speeds up downward.");
  };
};
