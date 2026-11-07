// Relativistic Flight: a time-trial race around a course of gates at close to the speed of light.
//
// The course, the stars, the grid, and the clocks are at rest relative to each other and define the
// "rest frame". The screen shows the world in the ship's instantaneous rest frame: for each object we
// find the event on its worldline that the ship considers simultaneous with now, then Lorentz
// transform that event into ship coordinates. This produces length contraction along the direction of
// travel, time dilation of the clocks on the course, and the relativity of simultaneity (clocks ahead
// of you read later than clocks behind you).
//
// Colors include the relativistic Doppler shift of the light that reaches the ship from each object.
// Every light source is modeled as a blackbody, because the Doppler shift turns a blackbody spectrum at
// temperature T into another blackbody spectrum at temperature D·T, where D is the Doppler factor.

export {};

// ─── Constants ─────────────────────────────────────────────────────────────────────────────────────

/** Speed of light, in world units per second. The player can change it with a slider. */
const DEFAULT_C = 300;
let C = DEFAULT_C;
let C2 = C * C;
/** World units spanned by the longest side of the canvas when the ship is at rest. */
const VIEW_SPAN = 1500;
/** The engines cut out at this fraction of the speed of light. */
const MAX_BETA = 0.999;
/** The largest proper speed γv, which corresponds to MAX_BETA. */
function maxU(): number {
  return C * MAX_BETA / Math.sqrt(1 - MAX_BETA * MAX_BETA);
}
/** Default proper acceleration of the engines, in units of c per second. */
const DEFAULT_THRUST = 1;
/** Turning rate, in radians per second of ship time. */
const TURN_RATE = 3.4;
const SHIP_RADIUS = 11;
const LAPS = 2;
const COUNTDOWN = 3;
const TRACK_WIDTH = 420;
const SAMPLE_SPACING = 40;
const LAMP_EVERY = 5; // samples between lamps along the track edges
const GATE_EVERY = 30; // samples between gates
const POST_RADIUS = 14;
const STAR_TILE = 2000;
const STARS_PER_TILE = 150;
const CLOCK_SPACING = 1000;
const CLOCK_RADIUS = 20;
/** Seconds of rest-frame time for one turn of a clock hand. */
const CLOCK_PERIOD = 10;
const GRID_SPACING = 250;
const GHOST_SAMPLE_INTERVAL = 0.05;
const STORAGE_KEY = "relativistic-flight-best-v1";

const TRAIL_TIME = 2.5; // seconds of ship time shown in the trail
const TRAIL_INTERVAL = 0.03;
const CRASH_TIME = 1.5;
const MIN_ZOOM_FOR_LAMPS = 0.3;
const MIN_ZOOM_FOR_CLOCKS = 0.15;

/** How light sources are colored. "vivid": each source emits a single wavelength, which the Doppler
 *  shift moves through the rainbow. "blackbody": each source glows like a hot object. "off": no
 *  Doppler shift. */
type ColorMode = "vivid" | "blackbody" | "off";
let colorMode: ColorMode = "vivid";

/** A light source, with the temperature it has in blackbody mode and the wavelength (nm) it emits in
 *  vivid mode. In blackbody mode its color is multiplied by `tint` (for sunlight reflected off a
 *  colored surface). */
interface Source {
  T: number;
  lambda: number;
  tint?: [number, number, number];
}

const SOURCES = {
  trackLamp: { T: 4200, lambda: 575 },
  gate: { T: 2300, lambda: 615 },
  start: { T: 6500, lambda: 530 },
  clock: { T: 11000, lambda: 495 },
  ghost: { T: 3000, lambda: 640 },
} satisfies Record<string, Source>;

// ─── Solar system ──────────────────────────────────────────────────────────────────────────────────

/** Kilometers per light-second. The world is scaled so that light crosses c world units per second,
 *  so one world unit is 299792.458 / c kilometers. */
const KM_PER_LIGHT_SECOND = 299792.458;

interface BodyData {
  name: string;
  radiusKm: number;
  /** Orbital radius, in kilometers (the semi-major axis; orbits are drawn as circles). */
  orbitKm: number;
  /** Mean longitude at J2000 (degrees) and its rate (degrees per Julian century), from JPL's
   *  approximate planetary elements. */
  L0: number;
  rate: number;
  src: Source;
}

const SUNLIGHT = 5800;
const PLANETS: BodyData[] = [
  { name: "Mercury", radiusKm: 2439.7, orbitKm: 57.909e6, L0: 252.25, rate: 149472.67, src: { T: SUNLIGHT, lambda: 590, tint: [0.7, 0.68, 0.65] } },
  { name: "Venus", radiusKm: 6051.8, orbitKm: 108.21e6, L0: 181.98, rate: 58517.82, src: { T: SUNLIGHT, lambda: 580, tint: [1, 0.9, 0.7] } },
  { name: "Earth", radiusKm: 6371, orbitKm: 149.598e6, L0: 100.46, rate: 35999.37, src: { T: SUNLIGHT, lambda: 470, tint: [0.35, 0.55, 1] } },
  { name: "Mars", radiusKm: 3389.5, orbitKm: 227.94e6, L0: -4.55, rate: 19140.3, src: { T: SUNLIGHT, lambda: 625, tint: [1, 0.5, 0.3] } },
  { name: "Jupiter", radiusKm: 69911, orbitKm: 778.48e6, L0: 34.4, rate: 3034.75, src: { T: SUNLIGHT, lambda: 597, tint: [0.9, 0.75, 0.6] } },
  { name: "Saturn", radiusKm: 58232, orbitKm: 1433.5e6, L0: 49.95, rate: 1222.49, src: { T: SUNLIGHT, lambda: 585, tint: [0.95, 0.85, 0.6] } },
  { name: "Uranus", radiusKm: 25362, orbitKm: 2872.5e6, L0: 313.24, rate: 428.48, src: { T: SUNLIGHT, lambda: 505, tint: [0.6, 0.9, 0.95] } },
  { name: "Neptune", radiusKm: 24622, orbitKm: 4495.1e6, L0: -55.12, rate: 218.46, src: { T: SUNLIGHT, lambda: 460, tint: [0.4, 0.55, 1] } },
];
const SUN = { name: "Sun", radiusKm: 695700, src: { T: SUNLIGHT, lambda: 565 } as Source };
const MOON = { name: "Moon", radiusKm: 1737.4, orbitKm: 384400, src: { T: SUNLIGHT, lambda: 560, tint: [0.75, 0.75, 0.75] } as Source };
/** The Earth sits beside the course at this centerline sample, on the first straight. */
const EARTH_SAMPLE = 50;

/** A body placed in world coordinates, with the orbit it is drawn on. */
interface Body {
  name: string;
  x: number;
  y: number;
  /** Radius; for a black hole, the Schwarzschild radius (the event horizon). */
  r: number;
  src: Source;
  orbitX: number;
  orbitY: number;
  orbitR: number;
  /** Gravitational parameter GM, in world units³/s². Its Schwarzschild radius is 2GM/c². */
  GM: number;
  kind: "body" | "blackhole";
  glow?: boolean;
}

type SystemMode = "real" | "fantasy";
let systemMode: SystemMode = "real";
/** Whether gravity (general relativity) is on. */
let gravityOn = true;
/** The bodies for the current settings, updated once per frame. */
let currentBodies: Body[] = [];

/** Gravitational parameters GM of the real bodies, in km³/s². */
const GM_KM3: Record<string, number> = {
  Sun: 1.32712440018e11, Mercury: 22031.8, Venus: 324858.6, Earth: 398600.4, Mars: 42828.4,
  Jupiter: 1.26686534e8, Saturn: 3.7931187e7, Uranus: 5.793939e6, Neptune: 6.836529e6, Moon: 4902.8,
};

/** Schwarzschild radius of the fantasy black hole, in world units. */
const BLACK_HOLE_RS = 80;
const DISK_SRC: Source = { T: 7000, lambda: 590 };

function placeBodies(track: Track): Body[] {
  return systemMode === "fantasy" ? placeFantasyBodies(track) : placeRealBodies(track);
}

/** A made-up planetary system sized for racing, with a black hole beside the course. Sizes are fixed
 *  in world units. Each body's mass is set by its compactness r_s/R (Schwarzschild radius over
 *  radius), so GM = (r_s/R)·R·c²/2 scales with c², and gravity is equally relativistic at every speed
 *  of light. */
function placeFantasyBodies(track: Track): Body[] {
  const star = { x: -4200, y: 3150 };
  const body = (name: string, x: number, y: number, r: number, compactness: number, src: Source,
                orbit: { x: number; y: number } = star): Body => ({
    name, x, y, r, src, kind: "body", GM: (compactness * r * C2) / 2,
    orbitX: orbit.x, orbitY: orbit.y, orbitR: Math.hypot(x - orbit.x, y - orbit.y),
  });
  const i = EARTH_SAMPLE;
  const gaia = { x: 8800, y: 3000 };
  return [
    { ...body("Ember", star.x, star.y, 700, 0.02, { T: 4500, lambda: 600 }), orbitR: 0, glow: true },
    body("Azure", track.cx[i] + track.ty[i] * 60, track.cy[i] - track.tx[i] * 60, 70, 0.1,
         { T: SUNLIGHT, lambda: 475, tint: [0.4, 0.6, 1] }),
    body("Rust", 900, 3100, 160, 0.08, { T: SUNLIGHT, lambda: 625, tint: [1, 0.5, 0.3] }),
    body("Cobalt", 3600, 7300, 120, 0.1, { T: SUNLIGHT, lambda: 455, tint: [0.35, 0.45, 1] }),
    body("Gaia", gaia.x, gaia.y, 300, 0.1, { T: SUNLIGHT, lambda: 540, tint: [0.5, 0.9, 0.5] }),
    body("Pebble", gaia.x, gaia.y - 700, 45, 0.05, { T: SUNLIGHT, lambda: 570, tint: [0.75, 0.75, 0.75] }, gaia),
    {
      name: "Black hole", x: 4700, y: 1050, r: BLACK_HOLE_RS, src: { T: 0, lambda: 0 }, kind: "blackhole",
      GM: (BLACK_HOLE_RS * C2) / 2, orbitX: 0, orbitY: 0, orbitR: 0,
    },
  ];
}

/** Days since the J2000 epoch, for placing the planets where they are today. */
const DAYS_SINCE_J2000 = (Date.now() - Date.UTC(2000, 0, 1, 12)) / 86400000;

/** Places the Sun, planets, and Moon to scale for the current speed of light. Planets are at rest in
 *  the rest frame: their orbital speeds are around 0.01% of the speed of light. */
function placeRealBodies(track: Track): Body[] {
  const k = C / KM_PER_LIGHT_SECOND; // world units per kilometer
  const lon = (b: BodyData) => ((b.L0 + (b.rate * DAYS_SINCE_J2000) / 36525) * Math.PI) / 180;
  // The Earth sits just left of the centerline. The Moon is placed (at the default speed of light)
  // on the right side of the course, farther along it.
  const i = EARTH_SAMPLE;
  const leftX = track.ty[i];
  const leftY = -track.tx[i];
  const ex = track.cx[i] + leftX * 60;
  const ey = track.cy[i] + leftY * 60;
  const earth = PLANETS[2];
  const le = lon(earth);
  const sunX = ex - earth.orbitKm * k * Math.cos(le);
  const sunY = ey + earth.orbitKm * k * Math.sin(le);
  const bodies: Body[] = [
    {
      name: SUN.name, x: sunX, y: sunY, r: SUN.radiusKm * k, src: SUN.src, orbitX: 0, orbitY: 0, orbitR: 0,
      GM: GM_KM3.Sun * k ** 3, kind: "body", glow: true,
    },
  ];
  for (const b of PLANETS) {
    const L = lon(b);
    bodies.push({
      name: b.name,
      x: sunX + b.orbitKm * k * Math.cos(L),
      y: sunY - b.orbitKm * k * Math.sin(L),
      r: b.radiusKm * k, src: b.src,
      orbitX: sunX, orbitY: sunY, orbitR: b.orbitKm * k,
      GM: GM_KM3[b.name] * k ** 3, kind: "body",
    });
  }
  const moonAngle = Math.asin(180 / 384);
  const md = MOON.orbitKm * k;
  bodies.push({
    name: MOON.name,
    x: ex + md * (Math.cos(moonAngle) * track.tx[i] - Math.sin(moonAngle) * leftX),
    y: ey + md * (Math.cos(moonAngle) * track.ty[i] - Math.sin(moonAngle) * leftY),
    r: MOON.radiusKm * k, src: MOON.src,
    orbitX: ex, orbitY: ey, orbitR: md,
    GM: GM_KM3.Moon * k ** 3, kind: "body",
  });
  return bodies;
}

/** Whether the segment from (x0, y0) to (x1, y1) passes within r of (cx, cy). */
function segmentHitsCircle(x0: number, y0: number, x1: number, y1: number, cx: number, cy: number, r: number): boolean {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len2 = dx * dx + dy * dy;
  const t = len2 > 0 ? Math.max(0, Math.min(1, ((cx - x0) * dx + (cy - y0) * dy) / len2)) : 0;
  const px = x0 + t * dx - cx;
  const py = y0 + t * dy - cy;
  return px * px + py * py < r * r;
}

// ─── Course ────────────────────────────────────────────────────────────────────────────────────────

/** Control points of the course centerline, traversed in order. */
const CONTROL_POINTS: [number, number][] = [
  [0, 0], [9000, 0], [11000, 1200], [11000, 3000], [9500, 4000], [6000, 3600], [4500, 5200],
  [6000, 7000], [10000, 7600], [11500, 9000], [10000, 10500], [2000, 10500], [-1000, 9000],
  [-1500, 5000], [-1000, 1500],
].map(([x, y]) => [x * 0.6, y * 0.6] as [number, number]);

interface Track {
  /** Centerline samples, evenly spaced by arclength. */
  cx: number[];
  cy: number[];
  /** Unit tangents. */
  tx: number[];
  ty: number[];
  lx: number[];
  ly: number[];
  rx: number[];
  ry: number[];
  /** Sample indices of the gates; gate 0 is the start/finish line. */
  gates: number[];
  length: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function buildTrack(): Track {
  // Closed Catmull–Rom spline through the control points, densely sampled.
  const dense: [number, number][] = [];
  const n = CONTROL_POINTS.length;
  for (let i = 0; i < n; i++) {
    const p0 = CONTROL_POINTS[(i - 1 + n) % n];
    const p1 = CONTROL_POINTS[i];
    const p2 = CONTROL_POINTS[(i + 1) % n];
    const p3 = CONTROL_POINTS[(i + 2) % n];
    for (let s = 0; s < 200; s++) {
      const t = s / 200;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      dense.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  // Resample evenly by arclength.
  const cum = [0];
  for (let i = 1; i <= dense.length; i++) {
    const a = dense[i - 1];
    const b = dense[i % dense.length];
    cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  const length = cum[cum.length - 1];
  const count = Math.round(length / SAMPLE_SPACING / GATE_EVERY) * GATE_EVERY;
  const spacing = length / count;
  // Start the course (and so the start/finish line) partway down the first straight.
  const startOffset = 1500;
  const cx: number[] = [];
  const cy: number[] = [];
  let j = 0;
  for (let i = 0; i < count; i++) {
    const s = (i * spacing + startOffset) % length;
    if (cum[j] > s) j = 0; // wrapped around past the end of the loop
    while (cum[j + 1] < s) j++;
    const f = (s - cum[j]) / (cum[j + 1] - cum[j]);
    const a = dense[j];
    const b = dense[(j + 1) % dense.length];
    cx.push(a[0] + f * (b[0] - a[0]));
    cy.push(a[1] + f * (b[1] - a[1]));
  }
  const tx: number[] = [], ty: number[] = [], lx: number[] = [], ly: number[] = [], rx: number[] = [], ry: number[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i - 1 + count) % count;
    const b = (i + 1) % count;
    const dx = cx[b] - cx[a];
    const dy = cy[b] - cy[a];
    const len = Math.hypot(dx, dy);
    tx.push(dx / len);
    ty.push(dy / len);
    // With y pointing down, (ty, -tx) points to the left of the direction of travel.
    lx.push(cx[i] + (dy / len) * TRACK_WIDTH / 2);
    ly.push(cy[i] - (dx / len) * TRACK_WIDTH / 2);
    rx.push(cx[i] - (dy / len) * TRACK_WIDTH / 2);
    ry.push(cy[i] + (dx / len) * TRACK_WIDTH / 2);
  }
  const gates: number[] = [];
  for (let i = 0; i < count; i += GATE_EVERY) gates.push(i);
  return {
    cx, cy, tx, ty, lx, ly, rx, ry, gates, length,
    minX: Math.min(...lx, ...rx), maxX: Math.max(...lx, ...rx),
    minY: Math.min(...ly, ...ry), maxY: Math.max(...ly, ...ry),
  };
}

// ─── Small helpers ─────────────────────────────────────────────────────────────────────────────────

/** A small deterministic PRNG (mulberry32). */
function seededRandom(seed: number): () => number {
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
function segmentsCross(px: number, py: number, qx: number, qy: number,
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
 *  velocity w into the observer's frame. */
function addVelocities(vx: number, vy: number, wx: number, wy: number): { x: number; y: number } {
  const v2 = vx * vx + vy * vy;
  const g = 1 / Math.sqrt(1 - v2 / C2);
  const vw = vx * wx + vy * wy;
  const k = g / (g + 1) * vw / C2;
  const denom = 1 + vw / C2;
  return { x: (wx / g + vx + k * vx) / denom, y: (wy / g + vy + k * vy) / denom };
}

// ─── Blackbody colors ──────────────────────────────────────────────────────────────────────────────

const BB_MIN_LOG = Math.log(300);
const BB_MAX_LOG = Math.log(400000);
const BB_STEPS = 400;

/** RGB of a blackbody, using Tanner Helland's fit (valid from about 1000 K to 40000 K, and clamped
 *  outside that range). Brightness is handled separately. */
function blackbodyRGB(kelvin: number): [number, number, number] {
  const t = Math.min(Math.max(kelvin, 1000), 40000) / 100;
  const clamp = (x: number) => Math.round(Math.min(255, Math.max(0, x)));
  const r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592);
  const g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * Math.pow(t - 60, -0.0755148492);
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  return [clamp(r), clamp(g), clamp(b)];
}

const BB_TABLE: [number, number, number][] = [];
for (let i = 0; i <= BB_STEPS; i++) {
  BB_TABLE.push(blackbodyRGB(Math.exp(BB_MIN_LOG + (i / BB_STEPS) * (BB_MAX_LOG - BB_MIN_LOG))));
}
/** RGB of monochromatic light, after Dan Bruton's approximation, for 380–780 nm. */
function wavelengthRGB(l: number): [number, number, number] {
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

const colorCache = new Map<string, string>();

/** CSS color of a light source seen with Doppler factor D (observed / emitted frequency), with
 *  `alpha` scaling its opacity. */
function sourceColor(src: Source, D: number, alpha = 1): string {
  let rgb: [number, number, number];
  let brightness: number;
  let key: string;
  if (colorMode === "blackbody") {
    // A blackbody at temperature T looks like a blackbody at temperature D·T. Below 1000 K the color
    // stops changing, but the light keeps getting dimmer, since its brightness falls like D⁴.
    const T = src.T * D;
    const idx = Math.round(((Math.log(Math.max(T, 300)) - BB_MIN_LOG) / (BB_MAX_LOG - BB_MIN_LOG)) * BB_STEPS);
    const i = Math.min(BB_STEPS, Math.max(0, idx));
    rgb = BB_TABLE[i];
    if (src.tint) rgb = [rgb[0] * src.tint[0], rgb[1] * src.tint[1], rgb[2] * src.tint[2]];
    brightness = Math.min(1, Math.max(0.07, Math.pow(Math.min(D, 1), 3)));
    key = `b${i}`;
  } else {
    // A single wavelength λ is received as λ / D. Light shifted out of the visible range is drawn
    // as blue-violet (ultraviolet) or deep red (infrared), dimmer than visible light, so the course
    // stays visible.
    const l = Math.round(src.lambda / D);
    rgb = wavelengthRGB(Math.min(760, Math.max(415, l)));
    brightness = l < 380 ? Math.max(0.6, 1 - (380 - l) / 80) : l > 780 ? Math.max(0.45, 1 - (l - 780) / 150) : 1;
    key = `w${Math.min(1000, Math.max(250, l))}`;
  }
  const a = Math.round(Math.min(1, alpha * brightness) * 40);
  key += `|${a}|${src.tint && colorMode === "blackbody" ? src.tint.join() : ""}`;
  let str = colorCache.get(key);
  if (!str) {
    str = `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${a / 40})`;
    colorCache.set(key, str);
  }
  return str;
}

// ─── Game state ────────────────────────────────────────────────────────────────────────────────────

interface Ship {
  x: number;
  y: number;
  /** Proper velocity γv, in world units per second of ship time. */
  ux: number;
  uy: number;
  heading: number;
  /** Rest-frame time at the ship, measured from the start signal. */
  t: number;
  /** Ship's own clock, measured from the start signal. */
  tau: number;
}

/** A sample of a recorded run, for replaying it as a ghost. */
interface GhostSample {
  t: number;
  x: number;
  y: number;
  h: number;
  vx: number;
  vy: number;
  tau: number;
}

interface Run {
  t: number;
  tau: number;
  samples: GhostSample[];
}

type Phase = "countdown" | "racing" | "finished";

interface State {
  ship: Ship;
  phase: Phase;
  /** Gates passed in order; the race ends after passing gate 0 for the (LAPS + 1)th time. */
  passed: number;
  thrusting: boolean;
  recording: GhostSample[];
  lastSampleT: number;
  result: Run | null;
  newBest: boolean;
  /** Whether the speed of light, the system, or gravity changed during the race, which keeps the run
   *  from counting. */
  rulesChanged: boolean;
  /** Ship time left before the ship reappears after a crash; zero when flying. */
  crashTimer: number;
  crashedInto: string;
  /** Recent positions, left at rest in the rest frame. */
  trail: { x: number; y: number; t: number; tau: number }[];
  lastTrailTau: number;
  sparks: { x: number; y: number; vx: number; vy: number; life: number }[];
}

function newState(track: Track): State {
  const back = 3; // start a few samples behind the start line
  const i = track.cx.length - back;
  return {
    ship: {
      x: track.cx[i], y: track.cy[i], ux: 0, uy: 0,
      heading: Math.atan2(track.ty[0], track.tx[0]),
      t: -COUNTDOWN, tau: -COUNTDOWN,
    },
    phase: "countdown",
    passed: 0,
    thrusting: false,
    recording: [],
    lastSampleT: -Infinity,
    result: null,
    newBest: false,
    rulesChanged: false,
    crashTimer: 0,
    crashedInto: "",
    trail: [],
    lastTrailTau: -Infinity,
    sparks: [],
  };
}

/** The factor 1 − Σ r_s/r in the metric, g_tt = −(1 − Σ r_s/r) c². A clock at rest at (x, y) runs
 *  at √(1 − Σ r_s/r) times the rate of a clock far from every mass. This superposition of weak
 *  fields is exact for a single black hole (Schwarzschild) and a good approximation for planets. */
function metricFactor(x: number, y: number): number {
  if (!gravityOn) return 1;
  let sum = 0;
  for (const b of currentBodies) {
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
function kinematics(ship: Ship): { f: number; tdot: number; g: number; vx: number; vy: number } {
  const f = metricFactor(ship.x, ship.y);
  // Split u into parts along and across the direction to the body whose field is strongest here.
  // Radial proper lengths are stretched by 1/√f, so the radial part counts as u_r/√f locally.
  let rx = 0;
  let ry = 0;
  if (gravityOn) {
    let strongest = 0;
    for (const b of currentBodies) {
      const d = Math.hypot(ship.x - b.x, ship.y - b.y);
      const phi = b.GM / Math.max(d, b.r);
      if (d > 0 && phi > strongest) {
        strongest = phi;
        rx = (ship.x - b.x) / d;
        ry = (ship.y - b.y) / d;
      }
    }
  }
  const ur = ship.ux * rx + ship.uy * ry;
  const lx = ship.ux + ur * rx * (1 / Math.sqrt(f) - 1);
  const ly = ship.uy + ur * ry * (1 / Math.sqrt(f) - 1);
  const g = Math.sqrt(1 + (lx * lx + ly * ly) / C2);
  return { f, tdot: g / Math.sqrt(f), g, vx: lx / g, vy: ly / g };
}

function gammaOf(ship: Ship): number {
  return kinematics(ship).g;
}

function velocityOf(ship: Ship): { vx: number; vy: number; g: number } {
  const { vx, vy, g } = kinematics(ship);
  return { vx, vy, g };
}

/** Best runs are stored separately for each speed of light, system, and gravity setting. */
function storageKey(): string {
  return `${STORAGE_KEY}-c${C}${systemMode === "real" ? "" : "-fantasy"}${gravityOn ? "" : "-nogravity"}`;
}

function loadBest(): Run | null {
  try {
    const raw = localStorage.getItem(storageKey());
    return raw ? JSON.parse(raw) as Run : null;
  } catch {
    return null;
  }
}

function saveBest(run: Run): void {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(run));
  } catch {
    // Storage may be unavailable; the best run then lasts only until the page is closed.
  }
}

// ─── Physics update ────────────────────────────────────────────────────────────────────────────────

interface Controls {
  left: boolean;
  right: boolean;
  thrust: boolean;
  brake: boolean;
}

/** Advances the ship by dτ seconds of ship time. Returns true when the race has just finished. */
/** Puts the ship at rest on the last gate it passed (or the start), facing along the course. */
function respawn(state: State, track: Track): void {
  const ship = state.ship;
  const n = track.cx.length;
  const i = state.passed > 0 ? track.gates[(state.passed - 1) % track.gates.length] : n - 3;
  ship.x = track.cx[i];
  ship.y = track.cy[i];
  ship.ux = 0;
  ship.uy = 0;
  ship.heading = Math.atan2(track.ty[i], track.tx[i]);
  state.trail = [];
}

function step(state: State, track: Track, bodies: Body[], controls: Controls, dtau: number, thrust: number): boolean {
  const ship = state.ship;
  state.thrusting = false;
  for (const sp of state.sparks) {
    sp.x += sp.vx * dtau;
    sp.y += sp.vy * dtau;
    sp.life -= dtau;
  }
  state.sparks = state.sparks.filter(sp => sp.life > 0);
  if (state.crashTimer > 0) {
    state.crashTimer -= dtau;
    if (state.crashTimer <= 0) {
      state.crashTimer = 0;
      respawn(state, track);
    }
  }
  const canFly = state.phase !== "countdown" && state.crashTimer === 0;

  if (canFly) {
    if (controls.left) ship.heading -= TURN_RATE * dtau;
    if (controls.right) ship.heading += TURN_RATE * dtau;
    const g = gammaOf(ship);
    const uMag = Math.hypot(ship.ux, ship.uy);
    const nx = uMag > 0 ? ship.ux / uMag : 0;
    const ny = uMag > 0 ? ship.uy / uMag : 0;
    if (controls.thrust) {
      // A proper acceleration a' in the ship's frame changes the proper velocity by
      // (a'⊥ + γ a'∥) dτ, where ∥ and ⊥ are relative to the ship's velocity.
      state.thrusting = true;
      const ax = thrust * Math.cos(ship.heading) * dtau;
      const ay = thrust * Math.sin(ship.heading) * dtau;
      const par = ax * nx + ay * ny;
      ship.ux += ax + (g - 1) * par * nx;
      ship.uy += ay + (g - 1) * par * ny;
    }
    if (controls.brake && uMag > 0) {
      const newMag = Math.max(0, uMag - g * thrust * dtau);
      ship.ux = nx * newMag;
      ship.uy = ny * newMag;
    }
    // The engines cut out at the speed limit, though gravity can still speed the ship up.
    const u = Math.hypot(ship.ux, ship.uy);
    if (u > maxU() && u > uMag) {
      const target = Math.max(uMag, maxU());
      ship.ux *= target / u;
      ship.uy *= target / u;
    }
  }

  // Gravity. For a Schwarzschild geodesic, in terms of proper time and the map coordinates, the
  // acceleration toward the mass is (GM/r²)(1 + 3L²/(c²r²)), where L = r × u is the angular
  // momentum per unit mass. The second term is the general-relativistic correction that makes
  // orbits precess and lets a black hole capture fast-moving things. Fields of several bodies are
  // added together.
  if (gravityOn && state.phase !== "countdown" && state.crashTimer === 0) {
    for (const b of bodies) {
      const dx = ship.x - b.x;
      const dy = ship.y - b.y;
      const r2 = dx * dx + dy * dy;
      if (r2 < b.r * b.r) continue;
      const r = Math.sqrt(r2);
      const L = dx * ship.uy - dy * ship.ux;
      const a = (b.GM / r2) * (1 + (3 * L * L) / (C2 * r2));
      ship.ux -= ((a * dx) / r) * dtau;
      ship.uy -= ((a * dy) / r) * dtau;
    }
  }

  const { tdot } = kinematics(ship);
  const x0 = ship.x;
  const y0 = ship.y;
  ship.x += ship.ux * dtau;
  ship.y += ship.uy * dtau;
  ship.t += tdot * dtau;
  ship.tau += dtau;
  if (state.phase === "countdown" && ship.t >= 0) {
    state.phase = "racing";
    ship.t = 0;
    ship.tau = 0;
  }

  // Crashing into the Sun, a planet, or the Moon, or falling into the black hole.
  if (state.crashTimer === 0 && (ship.x !== x0 || ship.y !== y0)) {
    for (const b of bodies) {
      if (!segmentHitsCircle(x0, y0, ship.x, ship.y, b.x, b.y, b.r)) continue;
      state.crashTimer = CRASH_TIME;
      state.crashedInto = b.kind === "blackhole" ? "Fell through the event horizon!"
        : `Crashed into ${b.name === "Sun" || b.name === "Moon" ? "the " : ""}${b.name}!`;
      ship.ux = 0;
      ship.uy = 0;
      for (let k = 0; k < 40; k++) {
        const dir = Math.random() * Math.PI * 2;
        const sp = 20 + Math.random() * 120;
        state.sparks.push({ x: 0, y: 0, vx: sp * Math.cos(dir), vy: sp * Math.sin(dir), life: 0.5 + Math.random() });
      }
      return false;
    }
  }

  // The trail: markers left at rest where the ship has been.
  if (state.crashTimer === 0 && ship.tau - state.lastTrailTau >= TRAIL_INTERVAL) {
    state.trail.push({ x: ship.x, y: ship.y, t: ship.t, tau: ship.tau });
    state.lastTrailTau = ship.tau;
    while (state.trail.length > 0 && state.trail[0].tau < ship.tau - TRAIL_TIME) state.trail.shift();
  }

  let finished = false;
  if (state.phase === "racing") {
    // Gates count only when crossed in order and in the direction of the course.
    const gi = track.gates[state.passed % track.gates.length];
    const along = (ship.x - x0) * track.tx[gi] + (ship.y - y0) * track.ty[gi];
    if (along > 0 && segmentsCross(x0, y0, ship.x, ship.y, track.lx[gi], track.ly[gi], track.rx[gi], track.ry[gi])) {
      state.passed++;
      if (state.passed === LAPS * track.gates.length + 1) {
        state.phase = "finished";
        finished = true;
      }
    }
    if (ship.t - state.lastSampleT >= GHOST_SAMPLE_INTERVAL || finished) {
      const { vx, vy } = velocityOf(ship);
      state.recording.push({ t: ship.t, x: ship.x, y: ship.y, h: ship.heading, vx, vy, tau: ship.tau });
      state.lastSampleT = ship.t;
    }
  }
  return finished;
}

// ─── View transform ────────────────────────────────────────────────────────────────────────────────

/** Maps rest-frame events to positions in the ship's frame. */
class View {
  /** Unit vector along the ship's velocity. */
  nx = 1;
  ny = 0;
  vx = 0;
  vy = 0;
  g = 1;
  lorentz = true;
  doppler = true;
  /** Metric factor at the ship. */
  fShip = 1;
  constructor(public ship: Ship) {}

  update(lorentz: boolean): void {
    this.lorentz = lorentz;
    this.doppler = colorMode !== "off";
    this.fShip = metricFactor(this.ship.x, this.ship.y);
    const { vx, vy, g } = velocityOf(this.ship);
    const v = Math.hypot(vx, vy);
    this.vx = vx;
    this.vy = vy;
    this.g = g;
    if (v > 0) {
      this.nx = vx / v;
      this.ny = vy / v;
    }
  }

  /** Contraction factor along the ship's velocity. */
  get k(): number {
    return this.lorentz ? 1 / this.g : 1;
  }

  /** Lengths along the ship's velocity shrink by 1/γ. */
  contract(dx: number, dy: number): { x: number; y: number } {
    const par = (dx * this.nx + dy * this.ny) * (1 - this.k);
    return { x: dx - par * this.nx, y: dy - par * this.ny };
  }

  expand(dx: number, dy: number): { x: number; y: number } {
    const par = (dx * this.nx + dy * this.ny) * (1 / this.k - 1);
    return { x: dx + par * this.nx, y: dy + par * this.ny };
  }

  /** The contraction as a canvas transform [a, b, c, d]. */
  matrix(): [number, number, number, number] {
    const f = 1 - this.k;
    return [1 - f * this.nx * this.nx, -f * this.nx * this.ny, -f * this.nx * this.ny, 1 - f * this.ny * this.ny];
  }

  /** For a point at rest at (x, y), its position in ship coordinates and the rest-frame time of the
   *  event there that the ship considers simultaneous with now: t = t₀ + v·Δx / c². */
  locateStatic(x: number, y: number): { sx: number; sy: number; t: number } {
    const dx = x - this.ship.x;
    const dy = y - this.ship.y;
    const p = this.contract(dx, dy);
    const dt = this.lorentz ? (this.vx * dx + this.vy * dy) / C2 : 0;
    return { sx: p.x, sy: p.y, t: this.ship.t + dt };
  }

  /** Doppler factor (observed / emitted frequency) of light from a source at rest-frame offset
   *  (dx, dy) moving with rest-frame velocity (sx, sy). With n the direction from the ship to the
   *  source, the kinematic part is D = γ_ship (1 + β_ship·n) / (γ_source (1 + β_source·n)). The
   *  gravitational part, √(f_source / f_ship), redshifts light climbing out of a gravity well and
   *  blueshifts light falling into one. */
  dopplerFactor(dx: number, dy: number, sx = 0, sy = 0): number {
    if (!this.doppler) return 1;
    const d = Math.hypot(dx, dy);
    if (d === 0) return 1;
    const nx = dx / d;
    const ny = dy / d;
    const gs = 1 / Math.sqrt(1 - Math.min(0.9999, (sx * sx + sy * sy) / C2));
    const kinematic = (this.g * (1 + (this.vx * nx + this.vy * ny) / C)) / (gs * (1 + (sx * nx + sy * ny) / C));
    const gravitational = gravityOn ? Math.sqrt(metricFactor(this.ship.x + dx, this.ship.y + dy) / this.fShip) : 1;
    return kinematic * gravitational;
  }

  /** Finds the event on a recorded worldline that the ship considers simultaneous with now. */
  locateRun(samples: GhostSample[]): { sample: GhostSample; sx: number; sy: number } | null {
    if (samples.length === 0) return null;
    const at = (t: number): GhostSample => {
      if (t <= samples[0].t) return { ...samples[0], t, vx: 0, vy: 0 };
      const last = samples[samples.length - 1];
      if (t >= last.t) return { ...last, t, vx: 0, vy: 0 };
      let lo = 0;
      let hi = samples.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (samples[mid].t <= t) lo = mid;
        else hi = mid;
      }
      const a = samples[lo];
      const b = samples[hi];
      const f = (t - a.t) / (b.t - a.t);
      const mix = (p: number, q: number) => p + f * (q - p);
      let dh = b.h - a.h;
      dh -= 2 * Math.PI * Math.round(dh / (2 * Math.PI));
      return { t, x: mix(a.x, b.x), y: mix(a.y, b.y), h: a.h + f * dh, vx: mix(a.vx, b.vx), vy: mix(a.vy, b.vy), tau: mix(a.tau, b.tau) };
    };
    const t0 = this.ship.t;
    let sample: GhostSample;
    if (!this.lorentz) {
      sample = at(t0);
    } else {
      // f(t) = (t − t₀) − v·(X(t) − x₀)/c² increases with t, since nothing outruns light.
      const f = (t: number) => {
        const s = at(t);
        return t - t0 - (this.vx * (s.x - this.ship.x) + this.vy * (s.y - this.ship.y)) / C2;
      };
      // Anything far enough away to be off screen is outside this window.
      const span = 30000 / C + 10;
      let lo = t0 - span;
      let hi = t0 + span;
      if (f(lo) > 0 || f(hi) < 0) return null;
      for (let i = 0; i < 40; i++) {
        const mid = (lo + hi) / 2;
        if (f(mid) < 0) lo = mid;
        else hi = mid;
      }
      sample = at((lo + hi) / 2);
    }
    const p = this.contract(sample.x - this.ship.x, sample.y - this.ship.y);
    return { sample, sx: p.x, sy: p.y };
  }
}

// ─── Rendering ─────────────────────────────────────────────────────────────────────────────────────

interface Options {
  grid: boolean;
  clocks: boolean;
  ghost: boolean;
  orbits: boolean;
  zoom: number;
}

interface Stars {
  x: Float32Array;
  y: Float32Array;
  temp: Float32Array;
  lambda: Float32Array;
  b: Float32Array;
  s: Uint8Array;
}

function makeStars(): Stars {
  const rand = seededRandom(12345);
  const n = STARS_PER_TILE;
  const stars: Stars = {
    x: new Float32Array(n), y: new Float32Array(n), temp: new Float32Array(n), lambda: new Float32Array(n), b: new Float32Array(n), s: new Uint8Array(n),
  };
  for (let i = 0; i < n; i++) {
    stars.x[i] = rand() * STAR_TILE;
    stars.y[i] = rand() * STAR_TILE;
    stars.temp[i] = 2800 + 9000 * rand() ** 2;
    stars.lambda[i] = 420 + 260 * rand();
    stars.b[i] = 0.3 + 0.7 * rand() ** 2;
    stars.s[i] = rand() < 0.1 ? 2 : 1;
  }
  return stars;
}

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const HUD = "#dfe8ff";

/** Distance from the ship to the surface of the nearest body, in light-travel time. */
function nearestBodyLine(ship: Ship, bodies: Body[]): string {
  let best = bodies[0];
  let bestD = Infinity;
  for (const b of bodies) {
    const d = Math.hypot(b.x - ship.x, b.y - ship.y) - b.r;
    if (d < bestD) {
      bestD = d;
      best = b;
    }
  }
  const lightSeconds = Math.max(0, bestD) / C;
  const when = lightSeconds < 120 ? `${lightSeconds.toFixed(2)} light-s`
             : lightSeconds < 7200 ? `${(lightSeconds / 60).toFixed(1)} light-min`
             : `${(lightSeconds / 3600).toFixed(2)} light-h`;
  return `nearest: ${best.name}, ${when}`;
}

function formatTime(t: number): string {
  const sign = t < 0 ? "−" : "";
  const a = Math.abs(t);
  const m = Math.floor(a / 60);
  const s = a - 60 * m;
  return `${sign}${m}:${s.toFixed(2).padStart(5, "0")}`;
}

function render(ctx: CanvasRenderingContext2D, state: State, track: Track, bodies: Body[], stars: Stars,
                best: Run | null, view: View, opts: Options, width: number, height: number, dpr: number,
                overlay: string | null): void {
  const ship = state.ship;
  /** Pixels per world unit at zoom 1; icons (the ships) keep this size at every zoom. */
  const baseScale = Math.max(width, height) / VIEW_SPAN;
  const scale = baseScale * opts.zoom;
  const cx = width / 2;
  const cy = height / 2;
  const halfW = cx / scale;
  const halfH = cy / scale;
  const [ma, mb, mc, md] = view.matrix();
  const toX = (sx: number) => cx + sx * scale;
  const toY = (sy: number) => cy + sy * scale;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = "#04060d";
  ctx.fillRect(0, 0, width, height);

  const onScreen = (sx: number, sy: number, margin: number) =>
    Math.abs(sx) < halfW + margin && Math.abs(sy) < halfH + margin;

  // The rest-frame region (relative to the ship) that can appear on screen.
  const corners = [[-halfW, -halfH], [halfW, -halfH], [-halfW, halfH], [halfW, halfH]].map(([x, y]) => view.expand(x, y));
  const minX = Math.min(...corners.map(p => p.x)) - 100;
  const maxX = Math.max(...corners.map(p => p.x)) + 100;
  const minY = Math.min(...corners.map(p => p.y)) - 100;
  const maxY = Math.max(...corners.map(p => p.y)) + 100;
  const inRegion = (x: number, y: number) => {
    const dx = x - ship.x;
    const dy = y - ship.y;
    return dx > minX && dx < maxX && dy > minY && dy < maxY;
  };
  // Level of detail: when zoomed out, stars, grid lines, and clocks are spaced farther apart so the
  // number drawn stays manageable.
  const regionW = maxX - minX;
  const regionH = maxY - minY;
  const spacingFor = (base: number, maxCount: number) => {
    let sp = base;
    while ((regionW / sp) * (regionH / sp) > maxCount) sp *= 2;
    return sp;
  };
  let gridSpacing = GRID_SPACING;
  while (regionW / gridSpacing + regionH / gridSpacing > 120) gridSpacing *= 2;
  const starTile = spacingFor(STAR_TILE, 60);
  const starScale = starTile / STAR_TILE;
  const clockSpacing = spacingFor(CLOCK_SPACING, 150);

  // Rest-frame grid: coordinate lines rather than physical objects, so no Doppler shift.
  if (opts.grid) {
    ctx.lineWidth = 1;
    const drawLines = (vertical: boolean) => {
      const base = vertical ? ship.x : ship.y;
      const lo = vertical ? minX : minY;
      const hi = vertical ? maxX : maxY;
      for (let k = Math.ceil((base + lo) / gridSpacing); k * gridSpacing <= base + hi; k++) {
        const off = k * gridSpacing - base;
        const a = vertical ? view.contract(off, minY) : view.contract(minX, off);
        const b = vertical ? view.contract(off, maxY) : view.contract(maxX, off);
        ctx.strokeStyle = ((k % 4) + 4) % 4 === 0 ? "rgba(90, 130, 220, 0.22)" : "rgba(90, 130, 220, 0.09)";
        ctx.beginPath();
        ctx.moveTo(toX(a.x), toY(a.y));
        ctx.lineTo(toX(b.x), toY(b.y));
        ctx.stroke();
      }
    };
    drawLines(true);
    drawLines(false);
  }

  // Stars, repeated on square tiles.
  const starSrc: Source = { T: 0, lambda: 0 };
  for (let ti = Math.floor((ship.x + minX) / starTile); ti * starTile <= ship.x + maxX; ti++) {
    for (let tj = Math.floor((ship.y + minY) / starTile); tj * starTile <= ship.y + maxY; tj++) {
      for (let i = 0; i < STARS_PER_TILE; i++) {
        const dx = ti * starTile + stars.x[i] * starScale - ship.x;
        const dy = tj * starTile + stars.y[i] * starScale - ship.y;
        const p = view.contract(dx, dy);
        if (!onScreen(p.x, p.y, 2)) continue;
        const s = stars.s[i];
        starSrc.T = stars.temp[i];
        starSrc.lambda = stars.lambda[i];
        ctx.fillStyle = sourceColor(starSrc, view.dopplerFactor(dx, dy), stars.b[i]);
        ctx.fillRect(toX(p.x) - s / 2, toY(p.y) - s / 2, s, s);
      }
    }
  }

  // Clocks on a square lattice. Each reads the rest-frame race time of the event that the ship
  // considers simultaneous with now.
  if (opts.clocks && opts.zoom >= MIN_ZOOM_FOR_CLOCKS) {
    ctx.font = `11px ${MONO}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const half = clockSpacing / 2;
    for (let i = Math.ceil((ship.x + minX - half) / clockSpacing); i * clockSpacing + half <= ship.x + maxX; i++) {
      for (let j = Math.ceil((ship.y + minY - half) / clockSpacing); j * clockSpacing + half <= ship.y + maxY; j++) {
        const x = i * clockSpacing + half;
        const y = j * clockSpacing + half;
        const loc = view.locateStatic(x, y);
        if (!onScreen(loc.sx, loc.sy, CLOCK_RADIUS + 60 / scale)) continue;
        if (bodies.some(b => Math.hypot(x - b.x, y - b.y) < b.r + CLOCK_RADIUS)) continue;
        // A clock deep in a gravity well runs slow: it reads √f times the rest-frame time.
        const reading = loc.t * Math.sqrt(metricFactor(x, y));
        const color = sourceColor(SOURCES.clock, view.dopplerFactor(x - ship.x, y - ship.y));
        const px = toX(loc.sx);
        const py = toY(loc.sy);
        ctx.save();
        ctx.translate(px, py);
        ctx.transform(ma, mb, mc, md, 0, 0);
        ctx.scale(scale, scale);
        ctx.lineWidth = 1.5 / scale;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, CLOCK_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
        for (let h = 0; h < 10; h++) {
          const a = (h / 10) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(Math.sin(a) * CLOCK_RADIUS * 0.8, -Math.cos(a) * CLOCK_RADIUS * 0.8);
          ctx.lineTo(Math.sin(a) * CLOCK_RADIUS, -Math.cos(a) * CLOCK_RADIUS);
          ctx.stroke();
        }
        const hand = (reading / CLOCK_PERIOD) * Math.PI * 2;
        ctx.lineWidth = 2.2 / scale;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.sin(hand) * CLOCK_RADIUS * 0.85, -Math.cos(hand) * CLOCK_RADIUS * 0.85);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = color;
        ctx.fillText(`${reading.toFixed(1)} s`, px, py + CLOCK_RADIUS * scale + 4);
      }
    }
  }

  // Track edges, colored segment by segment because the Doppler factor depends on direction.
  const n = track.cx.length;
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  for (const [ex, ey] of [[track.lx, track.ly], [track.rx, track.ry]]) {
    let currentColor = "";
    let open = false;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      if (!inRegion(ex[i], ey[i]) && !inRegion(ex[j], ey[j])) {
        if (open) ctx.stroke();
        open = false;
        continue;
      }
      const mx = (ex[i] + ex[j]) / 2 - ship.x;
      const my = (ey[i] + ey[j]) / 2 - ship.y;
      const color = sourceColor(SOURCES.trackLamp, view.dopplerFactor(mx, my), 0.75);
      const a = view.contract(ex[i] - ship.x, ey[i] - ship.y);
      const b = view.contract(ex[j] - ship.x, ey[j] - ship.y);
      if (!open || color !== currentColor) {
        if (open) ctx.stroke();
        ctx.strokeStyle = color;
        currentColor = color;
        ctx.beginPath();
        ctx.moveTo(toX(a.x), toY(a.y));
        open = true;
      }
      ctx.lineTo(toX(b.x), toY(b.y));
    }
    if (open) ctx.stroke();
    // Lamps along the edge.
    for (let i = 0; i < (opts.zoom >= MIN_ZOOM_FOR_LAMPS ? n : 0); i += LAMP_EVERY) {
      if (!inRegion(ex[i], ey[i])) continue;
      const dx = ex[i] - ship.x;
      const dy = ey[i] - ship.y;
      const p = view.contract(dx, dy);
      if (!onScreen(p.x, p.y, 4)) continue;
      ctx.fillStyle = sourceColor(SOURCES.trackLamp, view.dopplerFactor(dx, dy));
      ctx.beginPath();
      ctx.arc(toX(p.x), toY(p.y), 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Gates. The next gate to pass is drawn across the track; the others show only their posts.
  const nextGate = state.phase === "finished" ? -1 : state.passed % track.gates.length;
  const pulse = 0.65 + 0.35 * Math.sin(performance.now() / 160);
  track.gates.forEach((gi, g) => {
    const isStart = g === 0;
    const src = isStart ? SOURCES.start : SOURCES.gate;
    const ends = [[track.lx[gi], track.ly[gi]], [track.rx[gi], track.ry[gi]]];
    if (!ends.some(([x, y]) => inRegion(x, y))) return;
    const pts = ends.map(([x, y]) => view.contract(x - ship.x, y - ship.y));
    const midD = view.dopplerFactor(track.cx[gi] - ship.x, track.cy[gi] - ship.y);
    if (g === nextGate || isStart) {
      ctx.strokeStyle = sourceColor(src, midD, g === nextGate ? pulse : 0.35);
      ctx.lineWidth = g === nextGate ? 3 : 2;
      ctx.setLineDash(isStart ? [10, 8] : []);
      ctx.beginPath();
      ctx.moveTo(toX(pts[0].x), toY(pts[0].y));
      ctx.lineTo(toX(pts[1].x), toY(pts[1].y));
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ends.forEach(([x, y], e) => {
      ctx.save();
      ctx.translate(toX(pts[e].x), toY(pts[e].y));
      ctx.transform(ma, mb, mc, md, 0, 0);
      ctx.scale(scale, scale);
      ctx.fillStyle = sourceColor(src, view.dopplerFactor(x - ship.x, y - ship.y), g === nextGate ? 1 : 0.7);
      ctx.beginPath();
      ctx.arc(0, 0, POST_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  });

  // Orbits: circles at rest in the rest frame, so ellipses in the ship's frame. Only the part of each
  // orbit near the view is drawn, since the outer orbits are millions of units across.
  const reach = Math.hypot(Math.max(-minX, maxX), Math.max(-minY, maxY));
  if (opts.orbits) {
    ctx.strokeStyle = "rgba(150, 175, 230, 0.35)";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    for (const b of bodies) {
      if (b.orbitR === 0) continue;
      const ox = ship.x - b.orbitX;
      const oy = ship.y - b.orbitY;
      const d = Math.hypot(ox, oy);
      if (Math.abs(d - b.orbitR) > reach) continue;
      let a0 = 0;
      let a1 = Math.PI * 2;
      if (b.orbitR > reach && d > 0) {
        const mid = Math.atan2(oy, ox);
        const halfSpan = Math.min(Math.PI, 2 * Math.asin(Math.min(1, reach / b.orbitR)) + 0.01);
        a0 = mid - halfSpan;
        a1 = mid + halfSpan;
      }
      ctx.beginPath();
      const segs = 240;
      for (let k = 0; k <= segs; k++) {
        const a = a0 + ((a1 - a0) * k) / segs;
        const p = view.contract(b.orbitX + b.orbitR * Math.cos(a) - ship.x, b.orbitY + b.orbitR * Math.sin(a) - ship.y);
        if (k === 0) ctx.moveTo(toX(p.x), toY(p.y));
        else ctx.lineTo(toX(p.x), toY(p.y));
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  /** A black hole: an accretion disk of gas orbiting from the innermost stable orbit (3 r_s) outward,
   *  the photon sphere (1.5 r_s), where light can orbit, and the black event horizon (r_s). */
  const drawBlackHole = (b: Body) => {
    const rs = b.r;
    const dotPx = Math.max(1.5, rs * 0.2 * scale);
    for (let ring = 0; ring < 7; ring++) {
      const rr = rs * (3 + ring * 0.75);
      // Orbital speed of the gas, measured by an observer at rest there.
      const beta = Math.min(0.7, Math.sqrt(b.GM / (rr - rs)) / C);
      const steps = 90;
      for (let k = 0; k < steps; k++) {
        const a = ((k + (ring % 2) * 0.5) / steps) * Math.PI * 2;
        const gx = b.x + rr * Math.cos(a);
        const gy = b.y + rr * Math.sin(a);
        const dx = gx - ship.x;
        const dy = gy - ship.y;
        const p = view.contract(dx, dy);
        if (!onScreen(p.x, p.y, dotPx)) continue;
        // The gas circles counterclockwise on screen.
        const D = view.dopplerFactor(dx, dy, beta * C * Math.sin(a), -beta * C * Math.cos(a));
        ctx.fillStyle = sourceColor(DISK_SRC, D, 0.55 * (1 - ring / 9));
        ctx.fillRect(toX(p.x) - dotPx / 2, toY(p.y) - dotPx / 2, dotPx, dotPx);
      }
    }
    const p = view.contract(b.x - ship.x, b.y - ship.y);
    ctx.save();
    ctx.translate(toX(p.x), toY(p.y));
    ctx.transform(ma, mb, mc, md, 0, 0);
    ctx.scale(scale, scale);
    ctx.lineWidth = 1.2 / scale;
    ctx.setLineDash([4 / scale, 4 / scale]);
    ctx.strokeStyle = "rgba(255, 230, 180, 0.5)";
    ctx.beginPath();
    ctx.arc(0, 0, 1.5 * rs, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(rs, 2.5 / scale), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  // The Sun, planets, and Moon, to scale. Each is drawn at least a few pixels across so it can be
  // found, and labeled.
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  // Labels are skipped where they would overlap a label already drawn.
  const labels: { x: number; y: number }[] = [];
  const priority = (b: Body) => ["Sun", "Earth", "Moon"].indexOf(b.name) >>> 0; // others last
  for (const b of [...bodies].sort((p, q) => priority(p) - priority(q))) {
    const dx = b.x - ship.x;
    const dy = b.y - ship.y;
    const p = view.contract(dx, dy);
    // A black hole's accretion disk reaches about 8 r_s.
    if (!onScreen(p.x, p.y, b.r * (b.kind === "blackhole" ? 8 : 1) + 40 / scale)) continue;
    const rPx = b.r * scale;
    if (b.kind === "blackhole") {
      drawBlackHole(b);
    } else {
      const color = sourceColor(b.src, view.dopplerFactor(dx, dy));
      ctx.fillStyle = color;
      if (b.glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 30;
      }
      ctx.save();
      ctx.translate(toX(p.x), toY(p.y));
      if (rPx >= 2.5) {
        ctx.transform(ma, mb, mc, md, 0, 0);
        ctx.beginPath();
        ctx.arc(0, 0, rPx, 0, Math.PI * 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();
      ctx.shadowBlur = 0;
    }
    const lx = toX(p.x);
    const ly = toY(p.y) + Math.max(rPx, 2.5) + 4;
    if (labels.some(l => Math.abs(l.x - lx) < 50 && Math.abs(l.y - ly) < 14)) continue;
    labels.push({ x: lx, y: ly });
    ctx.fillStyle = "rgba(223, 232, 255, 0.75)";
    ctx.fillText(b.name, lx, ly);
  }

  // The trail, fading over the last few seconds of ship time. Its markers are at rest, so each is
  // shown only once the ship considers it to have been left behind.
  ctx.lineWidth = 2;
  for (let i = 1; i < state.trail.length; i++) {
    const a = state.trail[i - 1];
    const b = state.trail[i];
    const la = view.locateStatic(a.x, a.y);
    const lb = view.locateStatic(b.x, b.y);
    if (la.t < a.t || lb.t < b.t) continue;
    const age = (ship.tau - b.tau) / TRAIL_TIME;
    ctx.strokeStyle = `rgba(255, 111, 174, ${(0.7 * (1 - age)).toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(toX(la.sx), toY(la.sy));
    ctx.lineTo(toX(lb.sx), toY(lb.sy));
    ctx.stroke();
  }

  // Ghost of the best run, shown at the event on its worldline that is simultaneous with now.
  if (opts.ghost && best && state.phase !== "countdown") {
    const loc = view.locateRun(best.samples);
    if (loc && onScreen(loc.sx, loc.sy, 40)) {
      const s = loc.sample;
      const D = view.dopplerFactor(s.x - ship.x, s.y - ship.y, s.vx, s.vy);
      const color = sourceColor(SOURCES.ghost, D, 0.85);
      // The ghost is contracted along its velocity relative to the ship.
      const w = view.lorentz ? addVelocities(-view.vx, -view.vy, s.vx, s.vy) : { x: 0, y: 0 };
      const wMag = Math.hypot(w.x, w.y);
      ctx.save();
      ctx.translate(toX(loc.sx), toY(loc.sy));
      if (wMag > 1e-6) {
        const k = Math.sqrt(1 - Math.min(wMag * wMag / C2, 0.9999));
        const ux = w.x / wMag;
        const uy = w.y / wMag;
        const f = 1 - k;
        ctx.transform(1 - f * ux * ux, -f * ux * uy, -f * ux * uy, 1 - f * uy * uy, 0, 0);
      }
      ctx.rotate(s.h);
      const r = SHIP_RADIUS * baseScale;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(r * 1.3, 0);
      ctx.lineTo(-r * 0.9, -r * 0.8);
      ctx.lineTo(-r * 0.55, 0);
      ctx.lineTo(-r * 0.9, r * 0.8);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      ctx.fillStyle = color;
      ctx.font = `11px ${MONO}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(`ghost τ ${s.tau.toFixed(1)} s`, toX(loc.sx), toY(loc.sy) + 18);
    }
  }

  // Arrow toward the next gate when it is off screen.
  if (nextGate >= 0) {
    const gi = track.gates[nextGate];
    const p = view.contract(track.cx[gi] - ship.x, track.cy[gi] - ship.y);
    if (!onScreen(p.x, p.y, -30)) {
      const ang = Math.atan2(p.y, p.x);
      const rx = (halfW - 30 / scale) * scale;
      const ry = (halfH - 30 / scale) * scale;
      const t = Math.min(rx / Math.abs(Math.cos(ang) || 1e-9), ry / Math.abs(Math.sin(ang) || 1e-9));
      ctx.save();
      ctx.translate(cx + Math.cos(ang) * t, cy + Math.sin(ang) * t);
      ctx.rotate(ang);
      ctx.fillStyle = `rgba(255, 196, 120, ${pulse})`;
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(-8, -9);
      ctx.lineTo(-8, 9);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  // The ship, at the center of its own frame.
  const { vx, vy } = velocityOf(ship);
  const beta = Math.hypot(vx, vy) / C;
  if (beta > 0.001) {
    const len = 18 + 70 * beta;
    ctx.strokeStyle = "rgba(255, 111, 174, 0.55)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + view.nx * len, cy + view.ny * len);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  for (const sp of state.sparks) {
    ctx.fillStyle = `rgba(255, 190, 120, ${Math.min(1, sp.life).toFixed(3)})`;
    ctx.fillRect(cx + sp.x * baseScale - 1.5, cy + sp.y * baseScale - 1.5, 3, 3);
  }
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(ship.heading);
  ctx.globalAlpha = state.crashTimer > 0 ? 0 : 1;
  const s = SHIP_RADIUS * baseScale;
  if (state.thrusting) {
    ctx.fillStyle = "#ff9d3c";
    ctx.beginPath();
    ctx.moveTo(-s * 0.6, -s * 0.35);
    ctx.lineTo(-s * (1.1 + Math.random() * 0.6), 0);
    ctx.lineTo(-s * 0.6, s * 0.35);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = "#e8f1ff";
  ctx.fillStyle = "rgba(232, 241, 255, 0.15)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(s * 1.3, 0);
  ctx.lineTo(-s * 0.9, -s * 0.8);
  ctx.lineTo(-s * 0.55, 0);
  ctx.lineTo(-s * 0.9, s * 0.8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.globalAlpha = 1;

  // Heads-up display.
  const g = gammaOf(ship);
  const gatesPerLap = track.gates.length;
  const lap = Math.min(LAPS, Math.max(1, Math.floor((state.passed - 1) / gatesPerLap) + 1));
  const gateInLap = state.passed === 0 ? 0 : ((state.passed - 1) % gatesPerLap) + 1;
  const lines = [
    `v = ${beta.toFixed(4)} c   γ = ${g.toFixed(3)}`,
    `race time (rest frame) ${formatTime(state.phase === "finished" && state.result ? state.result.t : ship.t)}`,
    `your clock τ           ${formatTime(state.phase === "finished" && state.result ? state.result.tau : ship.tau)}`,
    state.phase === "finished" ? "finished" : `lap ${lap}/${LAPS}   gate ${gateInLap}/${gatesPerLap}`,
    best ? `best ${formatTime(best.t)}  (τ ${formatTime(best.tau)})` : "best —",
    `c = ${C} units/s`,
    nearestBodyLine(ship, bodies),
  ];
  if (gravityOn) lines.splice(3, 0, `clock rate dτ/dt        ${(1 / kinematics(ship).tdot).toFixed(4)}`);
  if (state.rulesChanged && state.phase !== "countdown") lines.push("settings changed: run won't count");
  ctx.font = `13px ${MONO}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(4, 6, 13, 0.65)";
  ctx.fillRect(8, 8, 300, 18 * lines.length + 22);
  ctx.fillStyle = HUD;
  lines.forEach((line, i) => ctx.fillText(line, 16, 15 + 18 * i));
  const barW = 284 - 16;
  const barY = 15 + 18 * lines.length + 2;
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.fillRect(16, barY, barW, 5);
  ctx.fillStyle = "#ff6fae";
  ctx.fillRect(16, barY, barW * beta, 5);

  // Rest-frame map of the course.
  const mapW = Math.min(170, width * 0.28);
  const mapScale = mapW / (track.maxX - track.minX);
  const mapH = (track.maxY - track.minY) * mapScale;
  const mx0 = width - mapW - 14;
  const my0 = 14;
  const mapX = (x: number) => mx0 + (x - track.minX) * mapScale;
  const mapY = (y: number) => my0 + (y - track.minY) * mapScale;
  ctx.fillStyle = "rgba(4, 6, 13, 0.65)";
  ctx.fillRect(mx0 - 6, my0 - 6, mapW + 12, mapH + 12);
  ctx.strokeStyle = "rgba(223, 232, 255, 0.4)";
  ctx.lineWidth = Math.max(2, TRACK_WIDTH * mapScale);
  ctx.lineJoin = "round";
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const k = i % n;
    if (i === 0) ctx.moveTo(mapX(track.cx[k]), mapY(track.cy[k]));
    else ctx.lineTo(mapX(track.cx[k]), mapY(track.cy[k]));
  }
  ctx.stroke();
  if (nextGate >= 0) {
    const gi = track.gates[nextGate];
    ctx.fillStyle = "#ffc478";
    ctx.beginPath();
    ctx.arc(mapX(track.cx[gi]), mapY(track.cy[gi]), 3, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const b of bodies) {
    const bx = mapX(b.x);
    const by = mapY(b.y);
    if (bx < mx0 - 6 || bx > mx0 + mapW + 6 || by < my0 - 6 || by > my0 + mapH + 6) continue;
    const r = Math.max(1.8, b.r * mapScale);
    ctx.beginPath();
    ctx.arc(bx, by, b.kind === "blackhole" ? Math.max(3, 3 * b.r * mapScale) : r, 0, Math.PI * 2);
    if (b.kind === "blackhole") {
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.strokeStyle = "#ffcf8a";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    } else {
      const tint = b.src.tint ?? [1, 1, 1];
      ctx.fillStyle = `rgb(${tint.map(c => Math.round(220 * c)).join(", ")})`;
      ctx.fill();
    }
  }
  ctx.fillStyle = "#ff6fae";
  ctx.beginPath();
  ctx.arc(mapX(ship.x), mapY(ship.y), 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Countdown and results.
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (state.crashTimer > 0 && !overlay) {
    ctx.fillStyle = "#ffb86b";
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.fillText(state.crashedInto, cx, cy - 80);
  } else if (state.phase === "countdown" && !overlay) {
    ctx.fillStyle = HUD;
    ctx.font = "bold 64px system-ui, sans-serif";
    ctx.fillText(String(Math.ceil(-ship.t)), cx, cy - 80);
  } else if (state.phase === "racing" && ship.t < 1) {
    ctx.fillStyle = `rgba(223, 232, 255, ${1 - ship.t})`;
    ctx.font = "bold 64px system-ui, sans-serif";
    ctx.fillText("GO", cx, cy - 80);
  } else if (state.phase === "finished" && state.result && !overlay) {
    ctx.fillStyle = "rgba(4, 6, 13, 0.7)";
    ctx.fillRect(cx - 190, height - 104, 380, 86);
    ctx.fillStyle = HUD;
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.fillText(state.newBest ? "Finished — new best!" : state.rulesChanged ? "Finished (settings changed, not counted)" : "Finished",
                 cx, height - 84);
    ctx.font = `13px ${MONO}`;
    ctx.fillText(`rest frame ${formatTime(state.result.t)}   your clock ${formatTime(state.result.tau)}`, cx, height - 60);
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText("Press R to race again", cx, height - 36);
  }

  if (overlay) {
    ctx.fillStyle = "rgba(4, 6, 13, 0.55)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = HUD;
    const parts = overlay.split("\n");
    parts.forEach((line, i) => {
      ctx.font = i === 0 ? "bold 22px system-ui, sans-serif" : "15px system-ui, sans-serif";
      ctx.fillText(line, cx, cy + (i - (parts.length - 1) / 2) * 30);
    });
  }
}

// ─── Setup ─────────────────────────────────────────────────────────────────────────────────────────

function init(): void {
  const root = document.getElementById("rf-game");
  const canvas = document.getElementById("rf-canvas") as HTMLCanvasElement | null;
  if (!root || !canvas) return;
  const ctx = canvas.getContext("2d")!;
  const box = (id: string) => document.getElementById(id) as HTMLInputElement;
  const lorentzBox = box("rf-lorentz");
  const dopplerSelect = document.getElementById("rf-doppler") as HTMLSelectElement;
  const orbitsBox = box("rf-orbits");
  const systemSelect = document.getElementById("rf-system") as HTMLSelectElement;
  const gravityBox = box("rf-gravity");
  systemMode = systemSelect.value as SystemMode;
  gravityOn = gravityBox.checked;
  const zoomSlider = box("rf-zoom");
  const zoomOut = document.getElementById("rf-zoom-out") as HTMLOutputElement;
  const zoomValue = () => Math.pow(10, Number(zoomSlider.value));
  const showZoom = () => {
    const z = zoomValue();
    zoomOut.textContent = z >= 0.995 ? `${z.toFixed(z < 10 ? 1 : 0)}×` : `1/${Math.round(1 / z).toLocaleString()}×`;
  };
  const setZoom = (log10: number) => {
    zoomSlider.value = String(Math.min(Number(zoomSlider.max), Math.max(Number(zoomSlider.min), log10)));
    showZoom();
  };
  zoomSlider.addEventListener("input", showZoom);
  zoomSlider.addEventListener("change", () => canvas.focus());
  showZoom();
  dopplerSelect.addEventListener("change", () => {
    colorMode = dopplerSelect.value as ColorMode;
    canvas.focus();
  });
  colorMode = dopplerSelect.value as ColorMode;
  const gridBox = box("rf-grid");
  const clocksBox = box("rf-clocks");
  const ghostBox = box("rf-ghost");
  const thrustSlider = box("rf-thrust");
  const thrustOut = document.getElementById("rf-thrust-out") as HTMLOutputElement;
  const thrustAccel = () => Number(thrustSlider.value) * C;
  const showThrust = () => { thrustOut.textContent = `${Number(thrustSlider.value).toFixed(2)} c/s`; };
  const cSlider = box("rf-c");
  const cOut = document.getElementById("rf-c-out") as HTMLOutputElement;
  cSlider.value = String(DEFAULT_C);
  cOut.textContent = `${DEFAULT_C} units/s`;
  thrustSlider.value = String(DEFAULT_THRUST);
  showThrust();
  thrustSlider.addEventListener("input", showThrust);
  thrustSlider.addEventListener("change", () => canvas.focus());
  const fullscreenBtn = document.getElementById("rf-fullscreen") as HTMLButtonElement;
  const restartBtn = document.getElementById("rf-restart") as HTMLButtonElement;
  const clearBtn = document.getElementById("rf-clear-best") as HTMLButtonElement;

  const track = buildTrack();
  const stars = makeStars();
  let best = loadBest();
  let state = newState(track);
  let view = new View(state.ship);
  const controls: Controls = { left: false, right: false, thrust: false, brake: false };

  // Changing the speed of light keeps the ship's ordinary speed (capped below the new c), so lowering
  // c makes the same motion more relativistic.
  cSlider.addEventListener("input", () => {
    const ship = state.ship;
    const { vx, vy } = velocityOf(ship);
    C = Number(cSlider.value);
    C2 = C * C;
    cOut.textContent = `${C} units/s`;
    const speed = Math.hypot(vx, vy);
    const capped = Math.min(speed, MAX_BETA * C);
    const g = 1 / Math.sqrt(1 - (capped * capped) / C2);
    ship.ux = speed > 0 ? (vx / speed) * capped * g : 0;
    ship.uy = speed > 0 ? (vy / speed) * capped * g : 0;
    if (state.phase !== "countdown") state.rulesChanged = true;
    best = loadBest();
  });
  cSlider.addEventListener("change", () => canvas.focus());
  const rulesChanged = () => {
    systemMode = systemSelect.value as SystemMode;
    gravityOn = gravityBox.checked;
    if (state.phase !== "countdown") state.rulesChanged = true;
    best = loadBest();
    canvas.focus();
  };
  systemSelect.addEventListener("change", rulesChanged);
  gravityBox.addEventListener("change", rulesChanged);
  let focused = false;
  let paused = false;
  let started = false;

  let width = 0;
  let height = 0;
  let dpr = 1;
  const resize = () => {
    dpr = window.devicePixelRatio || 1;
    const isFull = document.fullscreenElement === root;
    width = canvas.parentElement!.clientWidth;
    height = isFull ? window.innerHeight - (root.querySelector(".rf-touch") as HTMLElement).offsetHeight
                    : Math.min(Math.round(width * 0.62), Math.round(window.innerHeight * 0.75));
    canvas.style.height = `${height}px`;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  };
  new ResizeObserver(resize).observe(canvas.parentElement!);
  window.addEventListener("resize", resize);
  resize();

  const restart = () => {
    state = newState(track);
    view = new View(state.ship);
    paused = false;
    canvas.focus();
  };

  const keyMap: Record<string, keyof Controls> = {
    ArrowLeft: "left", KeyA: "left",
    ArrowRight: "right", KeyD: "right",
    ArrowUp: "thrust", KeyW: "thrust",
    ArrowDown: "brake", KeyS: "brake",
  };
  canvas.addEventListener("keydown", e => {
    const control = keyMap[e.code];
    if (control) {
      controls[control] = true;
      e.preventDefault();
    } else if (e.code === "KeyP" || e.code === "Escape") {
      paused = !paused;
      e.preventDefault();
    } else if (e.code === "KeyR" || (e.code === "Enter" && state.phase === "finished")) {
      restart();
      e.preventDefault();
    } else if (e.code === "KeyL") {
      lorentzBox.checked = !lorentzBox.checked;
    } else if (e.code === "KeyC") {
      const modes: ColorMode[] = ["vivid", "blackbody", "off"];
      colorMode = modes[(modes.indexOf(colorMode) + 1) % modes.length];
      dopplerSelect.value = colorMode;
    } else if (e.code === "Equal" || e.code === "NumpadAdd") {
      setZoom(Number(zoomSlider.value) + 0.1);
      e.preventDefault();
    } else if (e.code === "Minus" || e.code === "NumpadSubtract") {
      setZoom(Number(zoomSlider.value) - 0.1);
      e.preventDefault();
    } else if (e.code === "Space") {
      e.preventDefault();
    }
  });
  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    setZoom(Number(zoomSlider.value) - e.deltaY * 0.002);
  }, { passive: false });
  canvas.addEventListener("keyup", e => {
    const control = keyMap[e.code];
    if (control) controls[control] = false;
  });
  canvas.addEventListener("focus", () => {
    focused = true;
    started = true;
  });
  canvas.addEventListener("blur", () => {
    focused = false;
    for (const k of Object.keys(controls) as (keyof Controls)[]) controls[k] = false;
  });

  // On-screen buttons for touch screens.
  root.querySelectorAll<HTMLButtonElement>("[data-control]").forEach(btn => {
    const control = btn.dataset.control as keyof Controls;
    const set = (on: boolean) => (e: PointerEvent) => {
      e.preventDefault();
      controls[control] = on;
      btn.classList.toggle("rf-pressed", on);
      if (on) {
        started = true;
        paused = false;
        btn.setPointerCapture(e.pointerId);
      }
    };
    btn.addEventListener("pointerdown", set(true));
    btn.addEventListener("pointerup", set(false));
    btn.addEventListener("pointercancel", set(false));
    btn.addEventListener("contextmenu", e => e.preventDefault());
  });

  restartBtn.addEventListener("click", restart);
  clearBtn.addEventListener("click", () => {
    best = null;
    try {
      localStorage.removeItem(storageKey());
    } catch {
      // Nothing stored.
    }
    canvas.focus();
  });
  fullscreenBtn.addEventListener("click", () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void root.requestFullscreen?.().then(() => canvas.focus());
  });
  document.addEventListener("fullscreenchange", () => {
    fullscreenBtn.textContent = document.fullscreenElement ? "Exit full screen" : "Full screen";
    resize();
  });
  [lorentzBox, orbitsBox, gridBox, clocksBox, ghostBox].forEach(b => b.addEventListener("change", () => canvas.focus()));

  const touchOnly = window.matchMedia("(pointer: coarse)").matches;
  let last = performance.now();
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const running = started && !paused && (focused || touchOnly) && !document.hidden;
    currentBodies = placeBodies(track);
    if (running) {
      // Small steps keep gate crossings and orbits near the black hole accurate.
      const n = Math.ceil(dt / 0.004);
      for (let i = 0; i < n; i++) {
        if (step(state, track, currentBodies, controls, dt / n, thrustAccel())) {
          state.result = { t: state.ship.t, tau: state.ship.tau, samples: state.recording };
          if (!state.rulesChanged && (!best || state.result.t < best.t)) {
            best = state.result;
            state.newBest = true;
            saveBest(best);
          }
        }
      }
    }
    view.update(lorentzBox.checked);

    let overlay: string | null = null;
    if (!started) overlay = "Click here to start\n↑ thrust · ↓ brake · ← → turn · + − zoom";
    else if (!running) overlay = touchOnly || focused ? "Paused\nPress P to resume" : "Paused\nClick the game to resume";
    render(ctx, state, track, currentBodies, stars, best, view,
           { grid: gridBox.checked, clocks: clocksBox.checked, ghost: ghostBox.checked, orbits: orbitsBox.checked, zoom: zoomValue() },
           width, height, dpr, overlay);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

init();
