// ╭───────────────────────────────────────────────────────────────╮
// │     Relativistic Flight: relativity, geometry, and colors     │
// ╰───────────────────────────────────────────────────────────────╯
// The physics for ../relativistic_flight.ts (see there for an overview), with no game state, so it
// can be tested. Functions take the speed of light `c` (world units per second) and the masses
// that curve spacetime (none when gravity is off) as arguments.

/** The engines cut out at this fraction of the speed of light. */
export const MAX_BETA = 0.9999;

/** The largest proper speed γv, which corresponds to MAX_BETA. */
export function maxProperSpeed(c: number): number {
  return c * MAX_BETA / Math.sqrt(1 - MAX_BETA * MAX_BETA);
}

/** A mass that curves spacetime: its position, radius (for a black hole, its Schwarzschild radius),
 *  and gravitational parameter GM (world units³/s², so its Schwarzschild radius is 2GM/c²). */
export interface Mass {
  x: number;
  y: number;
  r: number;
  GM: number;
}

/** A ship's position and proper velocity u = dx/dτ (world units per second of ship time). */
export interface ShipMotion {
  x: number;
  y: number;
  ux: number;
  uy: number;
}

export interface Kinematics {
  f: number;
  tdot: number;
  g: number;
  vx: number;
  vy: number;
}

// ⋘──────── Curved spacetime ────────⋙

/** The factor 1 − Σ r_s/r in the metric, g_tt = −(1 − Σ r_s/r) c². A clock at rest at (x, y) runs
 *  at √(1 − Σ r_s/r) times the rate of a clock far from every mass. This superposition of weak
 *  fields is exact for a single black hole (Schwarzschild) and a good approximation for planets. */
export function metricFactor(x: number, y: number, masses: Mass[], c: number): number {
  const C2 = c * c;
  let sum = 0;
  for (const b of masses) {
    const r = Math.max(Math.hypot(x - b.x, y - b.y), b.r);
    sum += (2 * b.GM) / (C2 * r);
  }
  return Math.max(1e-4, 1 - sum);
}

/** The ship's motion in curved spacetime. The ship's state is its position (x, y) and its proper
 *  velocity u = dx/dτ in the map coordinates. Returns
 *  - f: the metric factor at the ship,
 *  - tdot: dt/dτ, the rate of rest-frame (far-away) time per second of ship time,
 *  - g: the Lorentz factor relative to an observer at rest at the ship's position,
 *  - (vx, vy): the ship's velocity measured by that observer. */
export function kinematics(ship: ShipMotion, masses: Mass[], c: number): Kinematics {
  const C2 = c * c;
  const f = metricFactor(ship.x, ship.y, masses, c);
  // Measured by an observer at rest at the ship's position, radial proper lengths near a mass are
  // stretched by 1/√(1 − r_s/r), so the part of u pointing toward each mass counts for more locally.
  // Each body adds its own stretch along its own direction. This is exact for a single black hole,
  // and unlike stretching along the direction of the single strongest body, it changes smoothly as
  // the ship moves among many bodies.
  let lx = ship.ux;
  let ly = ship.uy;
  for (const b of masses) {
    const dx = ship.x - b.x;
    const dy = ship.y - b.y;
    const d = Math.hypot(dx, dy);
    if (d === 0) continue;
    const compact = Math.min(0.9999, (2 * b.GM) / (C2 * Math.max(d, b.r)));
    const stretch = 1 / Math.sqrt(1 - compact) - 1;
    const ur = (ship.ux * dx + ship.uy * dy) / d;
    lx += (stretch * ur * dx) / d;
    ly += (stretch * ur * dy) / d;
  }
  const g = Math.sqrt(1 + (lx * lx + ly * ly) / C2);
  return { f, tdot: g / Math.sqrt(f), g, vx: lx / g, vy: ly / g };
}

// ⋘──────── Geometry and velocities ────────⋙

/** Whether the segment from (x0, y0) to (x1, y1) passes within r of (cx, cy). */
export function segmentHitsCircle(x0: number, y0: number, x1: number, y1: number, cx: number, cy: number, r: number): boolean {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len2 = dx * dx + dy * dy;
  const t = len2 > 0 ? Math.max(0, Math.min(1, ((cx - x0) * dx + (cy - y0) * dy) / len2)) : 0;
  const px = x0 + t * dx - cx;
  const py = y0 + t * dy - cy;
  return px * px + py * py < r * r;
}

/** A small deterministic PRNG (mulberry32). */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Whether segment PQ crosses segment AB. */
export function segmentsCross(px: number, py: number, qx: number, qy: number,
                       ax: number, ay: number, bx: number, by: number): boolean {
  const cross = (ox: number, oy: number, ux: number, uy: number, vx: number, vy: number) =>
    (ux - ox) * (vy - oy) - (uy - oy) * (vx - ox);
  const d1 = cross(ax, ay, bx, by, px, py);
  const d2 = cross(ax, ay, bx, by, qx, qy);
  const d3 = cross(px, py, qx, qy, ax, ay);
  const d4 = cross(px, py, qx, qy, bx, by);
  return d1 * d2 < 0 && d3 * d4 < 0;
}

/** Relativistic velocity addition: the rest-frame velocity of something moving at w in the frame of
 *  an observer who moves at v relative to the rest frame. Passing -v instead converts a rest-frame
 *  velocity w into the observer's frame. `c` is the speed of light. */
export function addVelocities(c: number, vx: number, vy: number, wx: number, wy: number): { x: number; y: number } {
  const C2 = c * c;
  const v2 = vx * vx + vy * vy;
  const g = 1 / Math.sqrt(1 - v2 / C2);
  const vw = vx * wx + vy * wy;
  const k = g / (g + 1) * vw / C2;
  const denom = 1 + vw / C2;
  return { x: (wx / g + vx + k * vx) / denom, y: (wy / g + vy + k * vy) / denom };
}

// ⋘──────── Colors ────────⋙

/** RGB of a blackbody, using Tanner Helland's fit (valid from about 1000 K to 40000 K, and clamped
 *  outside that range). Brightness is handled separately. */
export function blackbodyRGB(kelvin: number): [number, number, number] {
  const t = Math.min(Math.max(kelvin, 1000), 40000) / 100;
  const clamp = (x: number) => Math.round(Math.min(255, Math.max(0, x)));
  const r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592);
  const g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * Math.pow(t - 60, -0.0755148492);
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  return [clamp(r), clamp(g), clamp(b)];
}

/** RGB of monochromatic light, after Dan Bruton's approximation, for 380–780 nm. */
export function wavelengthRGB(l: number): [number, number, number] {
  let r = 0, g = 0, b = 0;
  if (l < 440) { r = (440 - l) / 60; b = 1; }
  else if (l < 490) { g = (l - 440) / 50; b = 1; }
  else if (l < 510) { g = 1; b = (510 - l) / 20; }
  else if (l < 580) { r = (l - 510) / 70; g = 1; }
  else if (l < 645) { r = 1; g = (645 - l) / 65; }
  else { r = 1; }
  // The eye is less sensitive toward the ends of the visible range.
  const f = l < 420 ? 0.3 + (0.7 * (l - 380)) / 40 : l > 700 ? 0.3 + (0.7 * (780 - l)) / 80 : 1;
  const c = (x: number) => Math.round(255 * Math.pow(Math.max(0, Math.min(1, x * f)), 0.8));
  return [c(r), c(g), c(b)];
}

/** Color for a ratio dt/dτ of race time to ship time: white at 1 (clocks in step), then yellow,
 *  orange, and red as the race clock runs up to 20 or more times faster than the ship's clock. */
export function timeRateColor(rate: number): string {
  const stops: [number, [number, number, number]][] = [
    [0, [223, 232, 255]], [0.2, [255, 236, 120]], [0.5, [255, 160, 60]], [1, [255, 80, 110]],
  ];
  const f = Math.min(1, Math.max(0, Math.log(rate) / Math.log(20)));
  let i = 0;
  while (i < stops.length - 2 && f > stops[i + 1][0]) i++;
  const [f0, c0] = stops[i];
  const [f1, c1] = stops[i + 1];
  const u = (f - f0) / (f1 - f0);
  return `rgb(${c0.map((c, k) => Math.round(c + u * (c1[k] - c))).join(", ")})`;
}

/** A number in scientific notation with superscript exponent, like "2.998 × 10⁸". */
export function formatScientific(x: number, digits = 4): string {
  const exponent = Math.floor(Math.log10(Math.abs(x)));
  const mantissa = x / 10 ** exponent;
  const superscripts = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sup = String(exponent).replace(/\d/g, d => superscripts[Number(d)]).replace("-", "⁻");
  return `${mantissa.toFixed(digits - 1)} × 10${sup}`;
}

// ⋘──────── Text ────────⋙

/** A time as minutes and seconds, to the hundredth: "1:05.50". */
export function formatTime(t: number): string {
  // Round first, so that 59.999 s is "1:00.00", not "0:60.00".
  const hundredths = Math.round(Math.abs(t) * 100);
  const sign = t < 0 && hundredths > 0 ? "−" : "";
  const m = Math.floor(hundredths / 6000);
  const s = (hundredths - 6000 * m) / 100;
  return `${sign}${m}:${s.toFixed(2).padStart(5, "0")}`;
}
