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

import { setupPanels } from "./common/panels";
import { loadJSON, saveJSON } from "./common/storage";
import { setupHelp } from "./common/help";

// ─── Constants ─────────────────────────────────────────────────────────────────────────────────────

/** The real speed of light, in world units per second. This fixes the size of a world unit: one unit
 *  is 299,792,458 / 300 meters, about 999 km. Every map is fixed in these units. */
const REAL_C = 300;
const REAL_C2 = REAL_C * REAL_C;
const METERS_PER_UNIT = 299792458 / REAL_C;
/** Speed of light, in world units per second. The player can change it with a slider, which changes
 *  only how fast light travels: the maps, sizes, and masses stay the same. */
const DEFAULT_C = REAL_C;
let C = DEFAULT_C;
let C2 = C * C;
/** How many seconds of ship time pass per second of real time. Turning, the crash animation, the
 *  trail, and the rewind after a crash are measured in real time, so the ship stays controllable. */
let gameSpeed = 1;
const GAME_SPEEDS = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];
/** World units spanned by the longest side of the canvas when the ship is at rest. */
const VIEW_SPAN = 1500;
/** The engines cut out at this fraction of the speed of light. */
const MAX_BETA = 0.9999;
/** The largest proper speed γv, which corresponds to MAX_BETA. */
function maxU(): number {
  return C * MAX_BETA / Math.sqrt(1 - MAX_BETA * MAX_BETA);
}
/** Default proper acceleration of the engines, in units of c per second. */
const DEFAULT_THRUST = 1;
/** Turning rate, in radians per second of ship time. */
const TURN_RATE = 3.4;
const SHIP_RADIUS = 11;
/** Whether the device has a touch screen and no mouse, so the game shows on-screen buttons. */
const TOUCH_ONLY = window.matchMedia("(pointer: coarse)").matches;
const LAMP_EVERY = 5; // samples between lamps along the track edges
const POST_RADIUS = 14;
const STAR_TILE = 2000;
const STARS_PER_TILE = 150;
const CLOCK_SPACING = 1000;
const CLOCK_RADIUS = 20;
/** Seconds of rest-frame time for one turn of a clock hand. */
const CLOCK_PERIOD = 10;
const GRID_SPACING = 250;
/** Ghosts are recorded every this many seconds of ship time. Ship time, unlike race time, passes at a
 *  bounded rate however fast the ship goes, which keeps recordings small enough to store. */
const GHOST_SAMPLE_INTERVAL = 0.1;
/** Number of best runs kept for each combination of settings, each replayed as a ghost. */
const MAX_BEST_RUNS = 5;
const GHOST_MARKER_COLOR = "#c3adff";
/** Best runs are saved under this prefix, per map (v2: maps and standard settings were added). */
const STORAGE_KEY = "relativistic-flight-v2";
const PIN_KEY = "relativistic_flight_pinned_panels";
const SETTINGS_KEY = "relativistic_flight_settings";

/** Settings remembered between visits. */
interface SavedSettings {
  map: string;
  c: number;
  thrust: number;
  gravity: boolean;
  lorentz: boolean;
  doppler: ColorMode;
  ghosts: boolean;
  clocks: boolean;
  grid: boolean;
  orbits: boolean;
  zoom: number;
  gameSpeed: number;
}

const TRAIL_TIME = 2.5; // seconds of real time shown in the trail
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
  /** Whether to draw the body's name (default true). */
  label?: boolean;
}

/** Whether gravity (general relativity) is on. */
let gravityOn = true;
/** The bodies for the current settings, updated once per frame. */
let currentBodies: Body[] = [];

/** Gravitational parameters GM of the real bodies, in km³/s². */
const GM_KM3: Record<string, number> = {
  Sun: 1.32712440018e11, Mercury: 22031.8, Venus: 324858.6, Earth: 398600.4, Mars: 42828.4,
  Jupiter: 1.26686534e8, Saturn: 3.7931187e7, Uranus: 5.793939e6, Neptune: 6.836529e6, Moon: 4902.8,
};

const DISK_SRC: Source = { T: 7000, lambda: 590 };

/** The planet run: a wide course strewn with planets to dodge, a black hole in the corridor, and a
 *  star inside the loop. Sizes are fixed in world units. Each body's mass is given by its compactness
 *  r_s/R (Schwarzschild radius over radius) at the real speed of light, GM = (r_s/R)·R·c²/2. The masses
 *  stay fixed when the speed of light changes, so a slower speed of light makes every body more
 *  compact and every black hole's horizon larger. The layout is random but seeded, so it is the same
 *  on every visit and best times stay comparable. */
const PLANET_RUN_COUNT = 90;
/** Minimum gap between planets, so there is always room to fly between them. */
const PLANET_RUN_GAP = 250;
const PLANET_RUN_HOLE_RS = 50;

function placePlanetRunBodies(track: Track): Body[] {
  const n = track.cx.length;
  const rand = seededRandom(20261108);
  const bodies: Body[] = [];
  const hue = (lambda: number): [number, number, number] =>
    lambda < 490 ? [0.4, 0.55, 1] : lambda < 560 ? [0.5, 0.9, 0.6] : lambda < 600 ? [0.95, 0.85, 0.55] : [1, 0.5, 0.35];
  // Distance along the course, in samples, from sample i to the nearest gate or the start.
  const gateDistance = (i: number) => Math.min(...[...track.gates, n - 3].map(g => {
    const d = Math.abs(i - g);
    return Math.min(d, n - d);
  }));
  const spacing = track.length / n;
  const half = track.width / 2;
  const at = (i: number, lateral: number) => ({
    x: track.cx[i] + track.ty[i] * lateral,
    y: track.cy[i] - track.tx[i] * lateral,
  });

  // A black hole in the middle of the corridor, a little past halfway around.
  let holeI = Math.round(n * 0.55);
  while (gateDistance(holeI) * spacing < 900) holeI++;
  const hole = at(holeI, 0);
  bodies.push({
    name: "Black hole", x: hole.x, y: hole.y, r: (PLANET_RUN_HOLE_RS * REAL_C2) / C2, src: { T: 0, lambda: 0 }, kind: "blackhole",
    GM: (PLANET_RUN_HOLE_RS * REAL_C2) / 2, orbitX: 0, orbitY: 0, orbitR: 0,
  });

  for (let attempt = 0; attempt < 4000 && bodies.length < PLANET_RUN_COUNT + 1; attempt++) {
    const r = 60 * Math.pow(220 / 60, rand()); // radii from 60 to 220, more small than large
    const i = Math.floor(rand() * n);
    const lateral = (rand() * 2 - 1) * (half - 40);
    // Keep the gates, the start, and the black hole's surroundings clear.
    if (gateDistance(i) * spacing < r + 350) continue;
    const { x, y } = at(i, lateral);
    if (Math.hypot(x - hole.x, y - hole.y) < 900) continue;
    if (bodies.some(b => Math.hypot(x - b.x, y - b.y) < r + b.r + PLANET_RUN_GAP)) continue;
    const lambda = 440 + rand() * 220;
    const compactness = 0.05 + rand() * 0.1;
    bodies.push({
      name: `Planet ${bodies.length}`, x, y, r, kind: "body", label: false,
      src: { T: SUNLIGHT, lambda, tint: hue(lambda) }, GM: (compactness * r * REAL_C2) / 2,
      orbitX: 0, orbitY: 0, orbitR: 0,
    });
  }

  // A star in the middle of the loop, if it fits clear of the course.
  const mx = track.cx.reduce((a, b) => a + b, 0) / n;
  const my = track.cy.reduce((a, b) => a + b, 0) / n;
  const clear = Math.min(...track.cx.map((x, i) => Math.hypot(x - mx, track.cy[i] - my))) - half;
  if (clear > 900) {
    bodies.push({
      name: "Ember", x: mx, y: my, r: Math.min(700, clear - 300), src: { T: 4500, lambda: 600 }, kind: "body",
      GM: (0.02 * Math.min(700, clear - 300) * REAL_C2) / 2, orbitX: 0, orbitY: 0, orbitR: 0, glow: true,
    });
  }
  return bodies;
}

/** Days since the J2000 epoch, for placing the planets where they are today. */
const DAYS_SINCE_J2000 = (Date.now() - Date.UTC(2000, 0, 1, 12)) / 86400000;

/** The real solar system beside the grand loop. The Earth sits just left of the centerline of the
 *  first straight, and the Moon (at the default speed of light) on the right side of the course,
 *  farther along it. */
function placeGrandLoopBodies(track: Track): Body[] {
  const i = EARTH_SAMPLE;
  const leftX = track.ty[i];
  const leftY = -track.tx[i];
  const ex = track.cx[i] + leftX * 60;
  const ey = track.cy[i] + leftY * 60;
  const moonAngle = Math.asin(180 / 384);
  const dirX = Math.cos(moonAngle) * track.tx[i] - Math.sin(moonAngle) * leftX;
  const dirY = Math.cos(moonAngle) * track.ty[i] - Math.sin(moonAngle) * leftY;
  return placeSolarSystem(ex, ey, dirX, dirY);
}

/** Places the Sun, planets, and Moon to scale, with the Earth at
 *  (ex, ey) and the Moon in the direction (dirX, dirY) from it. Planets are at rest in the rest
 *  frame: their orbital speeds are around 0.01% of the speed of light. */
function placeSolarSystem(ex: number, ey: number, dirX: number, dirY: number): Body[] {
  const k = REAL_C / KM_PER_LIGHT_SECOND; // world units per kilometer
  const lon = (b: BodyData) => ((b.L0 + (b.rate * DAYS_SINCE_J2000) / 36525) * Math.PI) / 180;
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
  const md = MOON.orbitKm * k;
  bodies.push({
    name: MOON.name,
    x: ex + md * dirX,
    y: ey + md * dirY,
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

// ─── Maps ──────────────────────────────────────────────────────────────────────────────────────────

/** The settings that count for a map's standard best times. */
interface Standard {
  /** Speed of light, in units per second. */
  c: number;
  /** Engine power, in c per second. */
  thrust: number;
  gravity: boolean;
}

interface MapDef {
  id: string;
  name: string;
  /** Control points of the course centerline, traversed in order. */
  points: [number, number][];
  trackWidth: number;
  /** Distance between centerline samples, and the number of samples between gates. */
  sampleSpacing: number;
  gateEvery: number;
  /** Distance along the spline from its first control point to the start line. */
  startOffset: number;
  laps: number;
  /** Zoom (log₁₀ of the magnification) to start the map at. */
  zoom: number;
  bodies: (track: Track) => Body[];
  standard: Standard;
}

/** The grand loop, used by two maps. */
const GRAND_LOOP: [number, number][] = [
  [0, 0], [9000, 0], [11000, 1200], [11000, 3000], [9500, 4000], [6000, 3600], [4500, 5200],
  [6000, 7000], [10000, 7600], [11500, 9000], [10000, 10500], [2000, 10500], [-1000, 9000],
  [-1500, 5000], [-1000, 1500],
].map(([x, y]) => [x * 0.6, y * 0.6] as [number, number]);

/** Dense "giant" planets for the slalom: compactness r_s/R = 0.3, far beyond any real planet. */
function placeSlalomBodies(): Body[] {
  const giant = (name: string, x: number, y: number, r: number, compactness: number, src: Source): Body => ({
    name, x, y, r, src, kind: "body", GM: (compactness * r * REAL_C2) / 2, orbitX: 0, orbitY: 0, orbitR: 0,
  });
  return [
    giant("Atlas", 1500, -80, 300, 0.3, { T: SUNLIGHT, lambda: 610, tint: [1, 0.6, 0.35] }),
    giant("Boreas", 3000, -620, 300, 0.3, { T: SUNLIGHT, lambda: 480, tint: [0.45, 0.65, 1] }),
    giant("Cronus", 4500, -80, 300, 0.3, { T: SUNLIGHT, lambda: 560, tint: [0.8, 0.8, 0.6] }),
    giant("Dione", 6000, -620, 300, 0.3, { T: SUNLIGHT, lambda: 520, tint: [0.5, 0.95, 0.6] }),
    giant("Eos", 7500, -80, 300, 0.3, { T: SUNLIGHT, lambda: 640, tint: [1, 0.45, 0.4] }),
    giant("Helios", 4500, 1450, 600, 0.05, { T: 5000, lambda: 590 }),
  ];
}

/** The slingshot map: black holes in a row, SLINGSHOT_SPACING apart, with the course looping around
 *  each of them at distance SLINGSHOT_RADIUS. */
const SLINGSHOT_HOLES = 4;
const SLINGSHOT_SPACING = 1600;
const SLINGSHOT_RADIUS = 500;

/** The slingshot black holes, with very different masses, given by their Schwarzschild radii (which
 *  are proportional to mass). The course loops around each at SLINGSHOT_RADIUS = 500, which is 33
 *  horizon radii from Wisp but only 3.1 from Behemoth, just outside its innermost stable orbit. */
const SLINGSHOT_HOLE_SIZES: [string, number][] = [["Wisp", 15], ["Behemoth", 160], ["Sprite", 40], ["Titan", 100]];

function placeSlingshotBodies(): Body[] {
  return SLINGSHOT_HOLE_SIZES.slice(0, SLINGSHOT_HOLES).map(([name, rs], k) => ({
    name, x: k * SLINGSHOT_SPACING, y: 0, r: (rs * REAL_C2) / C2, src: { T: 0, lambda: 0 }, kind: "blackhole" as const,
    GM: (rs * REAL_C2) / 2, orbitX: 0, orbitY: 0, orbitR: 0,
  }));
}

/** A chain of figure eights through the black holes. The course goes out along the wave
 *  y = R cos(πx/D), passing below and above the holes in turn, wraps around the last hole, comes
 *  back along the mirror image y = −R cos(πx/D), and wraps around the first hole. The two waves
 *  cross between each pair of holes, so the course loops around each hole, alternating between
 *  clockwise and counterclockwise. Near each hole, the wave's radius of curvature, D²/(π²R), is
 *  close to R, so each loop is nearly a circle around its hole. */
function figureEightChain(): [number, number][] {
  const D = SLINGSHOT_SPACING;
  const R = SLINGSHOT_RADIUS;
  const end = (SLINGSHOT_HOLES - 1) * D;
  const points: [number, number][] = [];
  const steps = 8 * (SLINGSHOT_HOLES - 1);
  for (let i = 0; i < steps; i++) {
    const x = (end * i) / steps;
    points.push([x, R * Math.cos((Math.PI * x) / D)]);
  }
  // Around the last hole, from the outward wave to the return wave.
  const sign = Math.cos((Math.PI * end) / D); // +1 if the outward wave ends below the hole
  for (let i = 0; i < 8; i++) {
    const a = sign * (Math.PI / 2 - (Math.PI * i) / 8);
    points.push([end + R * Math.cos(a), R * Math.sin(a)]);
  }
  for (let i = 0; i < steps; i++) {
    const x = end - (end * i) / steps;
    points.push([x, -R * Math.cos((Math.PI * x) / D)]);
  }
  // Around the first hole, from the return wave back to the start of the outward wave.
  for (let i = 0; i < 8; i++) {
    const a = -Math.PI / 2 - (Math.PI * i) / 8;
    points.push([R * Math.cos(a), R * Math.sin(a)]);
  }
  return points;
}

/** A smooth figure eight around the Earth and Moon: a lemniscate of Bernoulli whose foci are the
 *  Earth, at (0, 0), and the Moon, 384 units away at (384, 0), stretched vertically by 1.5 to make its
 *  loops rounder. It passes no closer than 80 units to either body and crosses itself at right
 *  angles halfway between them. */
function lemniscatePoints(): [number, number][] {
  const a = 192; // half the distance between the foci
  const stretch = 1.5;
  const points: [number, number][] = [];
  const n = 48;
  for (let i = 0; i < n; i++) {
    const t = (2 * Math.PI * i) / n;
    const d = 1 + Math.sin(t) ** 2;
    points.push([a + (a * Math.SQRT2 * Math.cos(t)) / d, (stretch * a * Math.SQRT2 * Math.sin(t) * Math.cos(t)) / d]);
  }
  return points;
}

const MAPS: MapDef[] = [
  {
    id: "earth-moon",
    name: "Earth and Moon",
    points: lemniscatePoints(),
    trackWidth: 70,
    sampleSpacing: 10,
    gateEvery: 20,
    startOffset: 120,
    laps: 3,
    zoom: 0.3,
    bodies: () => placeSolarSystem(0, 0, 1, 0),
    standard: { c: 300, thrust: 0.2, gravity: true },
  },
  {
    id: "grand-loop",
    name: "Grand loop (solar system)",
    points: GRAND_LOOP,
    trackWidth: 420,
    sampleSpacing: 40,
    gateEvery: 30,
    startOffset: 1500,
    laps: 2,
    zoom: 0,
    bodies: placeGrandLoopBodies,
    standard: { c: 300, thrust: 1, gravity: true },
  },
  {
    id: "planet-run",
    name: "Planet run (fantasy)",
    // A wide, irregular loop with gates far apart.
    points: [[0, 0], [7000, -1500], [12000, 1000], [11000, 6000], [6000, 7500], [1500, 5000],
             [-2000, 6500], [-4500, 3000]].map(([x, y]) => [x * 0.65, y * 0.65] as [number, number]),
    trackWidth: 1400,
    sampleSpacing: 40,
    gateEvery: 63,
    startOffset: 600,
    laps: 2,
    zoom: -0.15,
    bodies: placePlanetRunBodies,
    standard: { c: 300, thrust: 1, gravity: true },
  },
  {
    id: "slingshot",
    name: "Black hole slingshot (fantasy)",
    points: figureEightChain(),
    trackWidth: 300,
    sampleSpacing: 40,
    gateEvery: 30,
    startOffset: 600,
    laps: 2,
    zoom: 0,
    bodies: placeSlingshotBodies,
    standard: { c: 300, thrust: 0.5, gravity: true },
  },
  {
    id: "slalom",
    name: "Giants' slalom (fantasy)",
    points: [[0, 0], [1500, -700], [3000, 0], [4500, -700], [6000, 0], [7500, -700], [9000, 0],
             [10200, 1200], [9000, 2600], [4500, 3000], [0, 2600], [-1200, 1200]],
    trackWidth: 300,
    sampleSpacing: 40,
    gateEvery: 30,
    startOffset: 300,
    laps: 2,
    zoom: 0,
    bodies: placeSlalomBodies,
    standard: { c: 300, thrust: 0.5, gravity: true },
  },
];

let currentMap: MapDef = MAPS[0];
/** Engine power, in c per second. */
let thrustSetting = DEFAULT_THRUST;

let bodiesCache: { track: Track; c: number; map: MapDef; bodies: Body[] } | null = null;

function placeBodies(track: Track): Body[] {
  if (!bodiesCache || bodiesCache.track !== track || bodiesCache.c !== C || bodiesCache.map !== currentMap) {
    bodiesCache = { track, c: C, map: currentMap, bodies: currentMap.bodies(track) };
  }
  return bodiesCache.bodies;
}

/** Whether the current physics settings are the current map's standard ones. */
function isStandard(): boolean {
  const std = currentMap.standard;
  return C === std.c && thrustSetting === std.thrust && gravityOn === std.gravity && gameSpeed === 1;
}

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
  width: number;
  laps: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function buildTrack(map: MapDef): Track {
  const points = map.points;
  const width = map.trackWidth;
  // Closed Catmull–Rom spline through the control points, densely sampled.
  const dense: [number, number][] = [];
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    for (let k = 0; k < 200; k++) {
      const t = k / 200;
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
  const count = Math.round(length / map.sampleSpacing / map.gateEvery) * map.gateEvery;
  const spacing = length / count;
  const startOffset = map.startOffset;
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
    lx.push(cx[i] + (dy / len) * width / 2);
    ly.push(cy[i] - (dx / len) * width / 2);
    rx.push(cx[i] - (dy / len) * width / 2);
    ry.push(cy[i] + (dx / len) * width / 2);
  }
  const gates: number[] = [];
  for (let i = 0; i < count; i += map.gateEvery) gates.push(i);
  return {
    cx, cy, tx, ty, lx, ly, rx, ry, gates, length, width, laps: map.laps,
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
  /** Identifies the run's ghost recording in storage. */
  id?: string;
  t: number;
  tau: number;
  samples: GhostSample[];
}

/** "ready": waiting at the start line, with the clocks stopped, until the first thrust. */
type Phase = "ready" | "racing" | "finished";

interface State {
  ship: Ship;
  phase: Phase;
  /** Gates passed in order; the race ends after passing gate 0 for the (laps + 1)th time. */
  passed: number;
  thrusting: boolean;
  recording: GhostSample[];
  lastSampleTau: number;
  result: Run | null;
  /** Rank of the finished run among the best runs, or 0 if it didn't make the list. */
  newRank: number;
  /** Whether the speed of light, the system, or gravity changed during the race, which keeps the run
   *  from counting. */
  rulesChanged: boolean;
  /** The storage key for the settings at the start signal, where this run's time can be saved. */
  startKey: string;
  /** Whether the settings at the start signal were the map's standard ones. */
  standardAtStart: boolean;
  /** Whether a finished run with custom settings can still be saved. */
  awaitingSave: boolean;
  /** Ship time left before the ship reappears after a crash; zero when flying. */
  crashTimer: number;
  crashedInto: string;
  /** Recent positions, left at rest in the rest frame. */
  trail: { x: number; y: number; t: number; tau: number }[];
  lastTrailTau: number;
  /** Debris from a crash, at rest-frame positions. */
  sparks: { x: number; y: number; vx: number; vy: number; life: number }[];
  /** Ship time spent flying in the race, which excludes the returns after crashes. A crash rewinds
   *  it along with the ship. */
  flightTau: number;
  /** Snapshots of the ship throughout the race's flight, for rewinding after a crash. The whole race
   *  is kept, since back-to-back crashes can rewind further and further back. */
  history: Snapshot[];
  /** Snapshots taken at the start (index 0) and as the ship passed each gate (index = gates passed). */
  checkpoints: Snapshot[];
  /** The point a crash goes back to if it was at least REWIND_TIME seconds of flight earlier: the last
   *  gate passed, or the point the last crash went back to, whichever is more recent. */
  anchor: Snapshot;
  /** Where the ship crashed, and the snapshot it returns to. */
  crashFrom: { x: number; y: number; heading: number };
  restoreTo: Snapshot;
}

/** The ship's state at one moment of flight. Returning to a snapshot restores its velocity too, so a
 *  crash can't be used to shed speed. */
interface Snapshot {
  flightTau: number;
  x: number;
  y: number;
  ux: number;
  uy: number;
  heading: number;
  passed: number;
}

/** After a crash, the ship goes back to the last gate if it passed it at least this many seconds of
 *  flight earlier, and otherwise to where it was this many seconds before the crash. */
const REWIND_TIME = 2;
const HISTORY_INTERVAL = 0.05;

function snapshot(state: State): Snapshot {
  const ship = state.ship;
  return {
    flightTau: state.flightTau, x: ship.x, y: ship.y, ux: ship.ux, uy: ship.uy, heading: ship.heading,
    passed: state.passed,
  };
}

function newState(track: Track): State {
  const back = 3; // start a few samples behind the start line
  const i = track.cx.length - back;
  const start: Snapshot = {
    flightTau: 0, x: track.cx[i], y: track.cy[i], ux: 0, uy: 0, heading: Math.atan2(track.ty[0], track.tx[0]),
    passed: 0,
  };
  return {
    ship: {
      x: track.cx[i], y: track.cy[i], ux: 0, uy: 0,
      heading: Math.atan2(track.ty[0], track.tx[0]),
      t: 0, tau: 0,
    },
    phase: "ready",
    passed: 0,
    thrusting: false,
    recording: [],
    lastSampleTau: -Infinity,
    result: null,
    newRank: 0,
    rulesChanged: false,
    startKey: "",
    standardAtStart: true,
    awaitingSave: false,
    crashTimer: 0,
    crashedInto: "",
    trail: [],
    lastTrailTau: -Infinity,
    sparks: [],
    flightTau: 0,
    history: [],
    checkpoints: [start],
    anchor: start,
    crashFrom: { x: 0, y: 0, heading: 0 },
    restoreTo: start,
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
  // Measured by an observer at rest at the ship's position, radial proper lengths near a mass are
  // stretched by 1/√(1 − r_s/r), so the part of u pointing toward each mass counts for more locally.
  // Each body adds its own stretch along its own direction. This is exact for a single black hole,
  // and unlike stretching along the direction of the single strongest body, it changes smoothly as
  // the ship moves among many bodies.
  let lx = ship.ux;
  let ly = ship.uy;
  if (gravityOn) {
    for (const b of currentBodies) {
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
  }
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

/** The key for the best runs of the current map with the current settings. Each map has one list
 *  for its standard settings, and a separate list for each combination of custom settings. */
function storageKey(): string {
  const base = `${STORAGE_KEY}-${currentMap.id}`;
  return isStandard() ? base
    : `${base}-custom-c${C}-e${thrustSetting}${gravityOn ? "" : "-nogravity"}${gameSpeed === 1 ? "" : `-x${gameSpeed}`}`;
}

// Each list of best runs is stored in two parts, so that a full storage can't cost a best time: the
// times themselves, which are tiny, under the list's key; and each run's ghost recording under its own
// key. If a recording doesn't fit, its run keeps its place on the list without a ghost.

const GHOST_SEPARATOR = "~ghost~";

function ghostKey(listKey: string, id: string): string {
  return `${listKey}${GHOST_SEPARATOR}${id}`;
}

/** A ghost recording stored as columns of rounded numbers, which is several times smaller than a
 *  list of objects. */
interface StoredGhost {
  t: number[];
  x: number[];
  y: number[];
  h: number[];
  vx: number[];
  vy: number[];
  tau: number[];
}

function encodeGhost(samples: GhostSample[]): StoredGhost {
  const column = (get: (q: GhostSample) => number, digits: number) =>
    samples.map(q => Math.round(get(q) * 10 ** digits) / 10 ** digits);
  return {
    t: column(q => q.t, 3), x: column(q => q.x, 1), y: column(q => q.y, 1), h: column(q => q.h, 3),
    vx: column(q => q.vx, 1), vy: column(q => q.vy, 1), tau: column(q => q.tau, 3),
  };
}

function decodeGhost(stored: StoredGhost | null): GhostSample[] {
  if (!stored || !Array.isArray(stored.t)) return [];
  return stored.t.map((t, i) => ({
    t, x: stored.x[i], y: stored.y[i], h: stored.h[i], vx: stored.vx[i], vy: stored.vy[i], tau: stored.tau[i],
  }));
}

function newRunId(): string {
  return `${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
}

/** Loads the best runs saved under `key`, fastest first, with their ghost recordings. (Earlier
 *  versions stored each run's recording inside the list; those are kept until the list is saved.) */
function loadBests(key: string): Run[] {
  const parsed = loadJSON<(Run & { samples?: GhostSample[] })[]>(key);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(r => typeof r?.t === "number" && typeof r?.tau === "number")
    .map(r => Array.isArray(r.samples)
      ? { ...r, id: r.id ?? newRunId() }
      : { id: r.id, t: r.t, tau: r.tau, samples: r.id ? decodeGhost(loadJSON<StoredGhost>(ghostKey(key, r.id))) : [] })
    .sort((a, b) => a.t - b.t);
}

/** Saves the best runs under `key`: the times first, then any ghost recordings not yet stored, and
 *  removes the recordings of runs that are no longer on the list. */
function saveBests(runs: Run[], key: string): void {
  for (const run of runs) run.id ??= newRunId();
  saveJSON(key, runs.map(r => ({ id: r.id, t: r.t, tau: r.tau })));
  const keep = new Set(runs.map(r => ghostKey(key, r.id!)));
  try {
    for (const run of runs) {
      const gk = ghostKey(key, run.id!);
      if (run.samples.length === 0 || localStorage.getItem(gk) !== null) continue;
      try {
        localStorage.setItem(gk, JSON.stringify(encodeGhost(run.samples)));
      } catch {
        // Storage is full: the run stays on the list without a ghost.
      }
    }
    const stale: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(`${key}${GHOST_SEPARATOR}`) && !keep.has(k)) stale.push(k);
    }
    stale.forEach(k => localStorage.removeItem(k));
  } catch {
    // Storage is unavailable.
  }
}

/** Removes a list of best runs and its ghost recordings. */
function clearBests(key: string): void {
  saveBests([], key);
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing stored.
  }
}

/** Every saved list of best runs in this browser, by storage key. */
function allSavedLists(): Record<string, Run[]> {
  const lists: Record<string, Run[]> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(`${STORAGE_KEY}-`) || key.includes(GHOST_SEPARATOR)) continue;
      const runs = loadBests(key);
      if (runs.length > 0) lists[key] = runs;
    }
  } catch {
    // Storage is unavailable.
  }
  return lists;
}

const TRANSFER_FORMAT = "relativistic-flight-best-times";

/** Merges the lists from a shared file into this browser's lists, keeping the fastest runs of each.
 *  Returns the number of runs added. */
function importLists(text: string): number {
  const data = JSON.parse(text) as { format?: string; lists?: Record<string, unknown> };
  if (data.format !== TRANSFER_FORMAT || typeof data.lists !== "object" || data.lists === null) {
    throw new Error("This file doesn't contain best times from this game.");
  }
  let added = 0;
  for (const [key, value] of Object.entries(data.lists)) {
    if (!key.startsWith(`${STORAGE_KEY}-`) || key.includes(GHOST_SEPARATOR) || !Array.isArray(value)) continue;
    const runs = loadBests(key);
    for (const run of value as Run[]) {
      const valid = typeof run?.t === "number" && typeof run?.tau === "number" && Array.isArray(run.samples);
      if (!valid || runs.some(r => r.t === run.t && r.tau === run.tau)) continue;
      if (insertRun(runs, run) > 0) added++;
    }
    saveBests(runs, key);
  }
  return added;
}

/** Adds a run to the list of best runs, keeping the fastest MAX_BEST_RUNS. Returns the run's rank
 *  (1 for the fastest), or 0 if it is too slow to make the list. */
function insertRun(runs: Run[], run: Run): number {
  const rank = runs.filter(r => r.t <= run.t).length + 1;
  if (rank > MAX_BEST_RUNS) return 0;
  runs.splice(rank - 1, 0, run);
  runs.length = Math.min(runs.length, MAX_BEST_RUNS);
  return rank;
}

// ─── Physics update ────────────────────────────────────────────────────────────────────────────────

interface Controls {
  left: boolean;
  right: boolean;
  thrust: boolean;
  brake: boolean;
}

/** Full turns the ship spins while it returns to an earlier point after a crash. */
const CRASH_SPINS = 2;

/** Moves a crashed ship along its way back to the snapshot it returns to. Over CRASH_TIME seconds of
 *  ship time it moves back to the snapshot's position while its velocity grows to the snapshot's
 *  velocity. It spins fastest right after the crash, then slows down and settles at the snapshot's
 *  heading. */
function animateCrash(state: State): void {
  const ship = state.ship;
  const from = state.crashFrom;
  const to = state.restoreTo;
  const progress = 1 - Math.max(0, state.crashTimer) / CRASH_TIME;
  const e = progress * progress * (3 - 2 * progress); // ease in and out
  ship.x = from.x + (to.x - from.x) * e;
  ship.y = from.y + (to.y - from.y) * e;
  // The heading's offset from the final heading shrinks like (1 − progress)³: it starts at the
  // crash heading, plus CRASH_SPINS full turns, and comes to rest at the snapshot's heading.
  let turn = from.heading - to.heading;
  turn -= 2 * Math.PI * Math.floor(turn / (2 * Math.PI));
  ship.heading = to.heading + (turn + CRASH_SPINS * 2 * Math.PI) * (1 - progress) ** 3;
  ship.ux = to.ux * e;
  ship.uy = to.uy * e;
  if (state.crashTimer <= 0) {
    state.crashTimer = 0;
    ship.heading = to.heading;
    state.trail = [];
  }
}

/** Advances the ship by dτ seconds of ship time. Returns true when the race has just finished. */
function step(state: State, track: Track, bodies: Body[], controls: Controls, dtau: number, thrust: number): boolean {
  const ship = state.ship;
  /** The real time this step takes, for the effects that run in real time. */
  const realDt = dtau / gameSpeed;
  state.thrusting = false;
  for (const sp of state.sparks) {
    sp.x += sp.vx * realDt;
    sp.y += sp.vy * realDt;
    sp.life -= realDt;
  }
  state.sparks = state.sparks.filter(sp => sp.life > 0);
  const crashing = state.crashTimer > 0;
  if (crashing) {
    state.crashTimer -= realDt;
    animateCrash(state);
  }
  if (state.phase === "ready" && controls.thrust) {
    state.phase = "racing";
    state.startKey = storageKey();
    state.standardAtStart = isStandard();
  }
  const canFly = state.crashTimer === 0;

  if (canFly) {
    if (controls.left) ship.heading -= TURN_RATE * realDt;
    if (controls.right) ship.heading += TURN_RATE * realDt;
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
  if (gravityOn && state.phase !== "ready" && state.crashTimer === 0) {
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
  // While returning after a crash, the animation sets the position.
  if (!crashing) {
    ship.x += ship.ux * dtau;
    ship.y += ship.uy * dtau;
  }
  // The clocks start with the race.
  if (state.phase !== "ready") {
    ship.t += tdot * dtau;
    ship.tau += dtau;
  }

  // Crashing into the Sun, a planet, or the Moon, or falling into the black hole.
  if (state.crashTimer === 0 && (ship.x !== x0 || ship.y !== y0)) {
    for (const b of bodies) {
      if (!segmentHitsCircle(x0, y0, ship.x, ship.y, b.x, b.y, b.r)) continue;
      state.crashTimer = CRASH_TIME;
      state.crashedInto = b.kind === "blackhole" ? "Fell through the event horizon!"
        : `Crashed into ${b.name === "Sun" || b.name === "Moon" ? "the " : ""}${b.name}!`;
      state.crashFrom = { x: ship.x, y: ship.y, heading: ship.heading };
      // Go back to the anchor (the last gate, or where the last crash went back to) if it was at least
      // REWIND_TIME seconds of flight ago, and otherwise to where the ship was REWIND_TIME seconds ago
      // (which may be before the last gate). Back-to-back crashes so step back REWIND_TIME at a time,
      // rather than to a gate passed long ago.
      const anchor = state.anchor;
      const back = state.flightTau - REWIND_TIME * gameSpeed;
      const earlier = state.history.filter(h => h.flightTau <= back);
      const target = anchor.flightTau <= back ? anchor : earlier.length > 0 ? earlier[earlier.length - 1] : state.checkpoints[0];
      state.restoreTo = target;
      state.anchor = target;
      if (state.phase === "racing") {
        state.passed = target.passed;
        state.checkpoints.length = target.passed + 1;
      }
      state.flightTau = target.flightTau;
      state.history = state.history.filter(h => h.flightTau <= target.flightTau);
      ship.ux = 0;
      ship.uy = 0;
      for (let k = 0; k < 40; k++) {
        const dir = Math.random() * Math.PI * 2;
        const sp = 40 + Math.random() * 240;
        state.sparks.push({ x: ship.x, y: ship.y, vx: sp * Math.cos(dir), vy: sp * Math.sin(dir), life: 0.5 + Math.random() });
      }
      return false;
    }
  }

  // Flight time and snapshots for rewinding.
  if (state.phase === "racing" && state.crashTimer === 0) {
    state.flightTau += dtau;
    const last = state.history[state.history.length - 1];
    if (!last || state.flightTau - last.flightTau >= HISTORY_INTERVAL) state.history.push(snapshot(state));
  }

  // The trail: markers left at rest where the ship has been.
  if (state.crashTimer === 0 && ship.tau - state.lastTrailTau >= TRAIL_INTERVAL) {
    state.trail.push({ x: ship.x, y: ship.y, t: ship.t, tau: ship.tau });
    state.lastTrailTau = ship.tau;
    while (state.trail.length > 0 && state.trail[0].tau < ship.tau - TRAIL_TIME * gameSpeed) state.trail.shift();
  }

  let finished = false;
  if (state.phase === "racing") {
    // Gates count only when crossed in order and in the direction of the course, and not while the
    // ship returns to its checkpoint after a crash.
    const gi = track.gates[state.passed % track.gates.length];
    // Gates count only when crossed within 60° of the course direction, so a ship on another part of
    // a self-crossing course can't pass them.
    const along = (ship.x - x0) * track.tx[gi] + (ship.y - y0) * track.ty[gi];
    const flying = !crashing && state.crashTimer === 0;
    if (flying && along > 0.5 * Math.hypot(ship.x - x0, ship.y - y0) && segmentsCross(x0, y0, ship.x, ship.y, track.lx[gi], track.ly[gi], track.rx[gi], track.ry[gi])) {
      state.passed++;
      state.checkpoints.push(snapshot(state));
      state.anchor = state.checkpoints[state.checkpoints.length - 1];
      if (state.passed === track.laps * track.gates.length + 1) {
        state.phase = "finished";
        finished = true;
      }
    }
    if (ship.tau - state.lastSampleTau >= GHOST_SAMPLE_INTERVAL || finished) {
      const { vx, vy } = velocityOf(ship);
      state.recording.push({ t: ship.t, x: ship.x, y: ship.y, h: ship.heading, vx, vy, tau: ship.tau });
      state.lastSampleTau = ship.tau;
    }
  }
  return finished;
}

/** The state of a recorded run at rest-frame time t. Before the start and after the finish, the
 *  ghost waits at rest at its first and last positions. */
function sampleRunAt(samples: GhostSample[], t: number): GhostSample {
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
    const at = (t: number) => sampleRunAt(samples, t);
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
      const span = 200000 / C + 10;
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

/** Color for a ratio dt/dτ of race time to ship time: white at 1 (clocks in step), then yellow,
 *  orange, and red as the race clock runs up to 20 or more times faster than the ship's clock. */
function timeRateColor(rate: number): string {
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
function formatScientific(x: number, digits = 4): string {
  const exponent = Math.floor(Math.log10(Math.abs(x)));
  const mantissa = x / 10 ** exponent;
  const superscripts = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sup = String(exponent).replace(/\d/g, d => superscripts[Number(d)]).replace("-", "⁻");
  return `${mantissa.toFixed(digits - 1)} × 10${sup}`;
}

/** The speed of light in meters per second, and how it compares with the real value. */
function speedOfLightText(): { text: string; real: boolean } {
  const real = C === REAL_C;
  const text = `${formatScientific(C * METERS_PER_UNIT)} m/s`;
  return { text: real ? `${text} (real)` : `${text} (${(C / REAL_C).toFixed(2)}× real)`, real };
}

function formatTime(t: number): string {
  const sign = t < 0 ? "−" : "";
  const a = Math.abs(t);
  const m = Math.floor(a / 60);
  const s = a - 60 * m;
  return `${sign}${m}:${s.toFixed(2).padStart(5, "0")}`;
}

function render(ctx: CanvasRenderingContext2D, state: State, track: Track, bodies: Body[], stars: Stars,
                bests: Run[], view: View, opts: Options, width: number, height: number, dpr: number,
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

  // Stars in nested layers: layer k repeats the same pattern on tiles 2^k times as large, so every
  // star stays in place as the view grows. As the view stretches or zooms out, the densest layer
  // fades out gradually, which keeps the number of stars drawn manageable without stars jumping.
  const starSrc: Source = { T: 0, lambda: 0 };
  const starLevel = Math.max(0, 0.5 * Math.log2((regionW * regionH) / (30 * STAR_TILE * STAR_TILE)));
  const firstLayer = Math.floor(starLevel);
  for (let layer = firstLayer; layer < firstLayer + 3; layer++) {
    const tile = STAR_TILE * 2 ** layer;
    const tileScale = tile / STAR_TILE;
    const layerAlpha = layer === firstLayer ? 1 - (starLevel - firstLayer) : 1;
    for (let ti = Math.floor((ship.x + minX) / tile); ti * tile <= ship.x + maxX; ti++) {
      for (let tj = Math.floor((ship.y + minY) / tile); tj * tile <= ship.y + maxY; tj++) {
        for (let i = 0; i < STARS_PER_TILE; i++) {
          const dx = ti * tile + stars.x[i] * tileScale - ship.x;
          const dy = tj * tile + stars.y[i] * tileScale - ship.y;
          const p = view.contract(dx, dy);
          if (!onScreen(p.x, p.y, 2)) continue;
          const s = stars.s[i];
          starSrc.T = stars.temp[i];
          starSrc.lambda = stars.lambda[i];
          ctx.fillStyle = sourceColor(starSrc, view.dopplerFactor(dx, dy), stars.b[i] * layerAlpha);
          ctx.fillRect(toX(p.x) - s / 2, toY(p.y) - s / 2, s, s);
        }
      }
    }
  }

  // Clocks on a square lattice. Each reads the rest-frame race time of the event that the ship
  // considers simultaneous with now.
  if (opts.clocks && opts.zoom >= MIN_ZOOM_FOR_CLOCKS) {
    ctx.font = `11px ${MONO}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    // The lattice is offset by half the finest spacing, so each coarser lattice (used when zoomed out
    // or moving fast) is a subset of the finer ones and its clocks stay put.
    const half = CLOCK_SPACING / 2;
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
      ctx.arc(0, 0, Math.min(POST_RADIUS, track.width * 0.04), 0, Math.PI * 2);
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
    if (b.label === false) continue;
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
    const age = (ship.tau - b.tau) / (TRAIL_TIME * gameSpeed);
    ctx.strokeStyle = `rgba(255, 111, 174, ${(0.7 * (1 - age)).toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(toX(la.sx), toY(la.sy));
    ctx.lineTo(toX(lb.sx), toY(lb.sy));
    ctx.stroke();
  }

  // Where a ray from the center of the screen at angle `ang` meets a rectangle inset from the edges.
  const edgePoint = (ang: number, inset: number) => {
    const rx = cx - inset;
    const ry = cy - inset;
    const t = Math.min(rx / Math.abs(Math.cos(ang) || 1e-9), ry / Math.abs(Math.sin(ang) || 1e-9));
    return { x: cx + Math.cos(ang) * t, y: cy + Math.sin(ang) * t };
  };

  // Ghosts of the best runs, each shown at the event on its worldline that is simultaneous with now.
  // Ghosts off screen get a numbered marker on the edge of the screen pointing toward them; the
  // markers are drawn last, on top of the display panels.
  const ghostMarkers: { ang: number; rank: number }[] = [];
  if (opts.ghost && state.phase !== "ready") {
    bests.forEach((run, rank) => {
      const loc = view.locateRun(run.samples);
      if (!loc) return;
      if (!onScreen(loc.sx, loc.sy, 0)) {
        ghostMarkers.push({ ang: Math.atan2(loc.sy, loc.sx), rank });
        return;
      }
      const q = loc.sample;
      const D = view.dopplerFactor(q.x - ship.x, q.y - ship.y, q.vx, q.vy);
      const color = sourceColor(SOURCES.ghost, D, 0.85);
      // The ghost is contracted along its velocity relative to the ship.
      const w = view.lorentz ? addVelocities(-view.vx, -view.vy, q.vx, q.vy) : { x: 0, y: 0 };
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
      ctx.rotate(q.h);
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
      ctx.fillText(`#${rank + 1}  τ ${q.tau.toFixed(1)} s`, toX(loc.sx), toY(loc.sy) + 18);
    });
  }

  // Arrow toward the next gate when it is off screen.
  if (nextGate >= 0) {
    const gi = track.gates[nextGate];
    const p = view.contract(track.cx[gi] - ship.x, track.cy[gi] - ship.y);
    if (!onScreen(p.x, p.y, -30 / scale)) {
      const ang = Math.atan2(p.y, p.x);
      const e = edgePoint(ang, 30);
      ctx.save();
      ctx.translate(e.x, e.y);
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
    const q = view.contract(sp.x - ship.x, sp.y - ship.y);
    ctx.fillStyle = `rgba(255, 190, 120, ${Math.min(1, sp.life).toFixed(3)})`;
    ctx.fillRect(toX(q.x) - 1.5, toY(q.y) - 1.5, 3, 3);
  }
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(ship.heading);
  ctx.globalAlpha = state.crashTimer > 0 ? 0.6 : 1;
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
  const lap = Math.min(track.laps, Math.max(1, Math.floor((state.passed - 1) / gatesPerLap) + 1));
  const gateInLap = state.passed === 0 ? 0 : ((state.passed - 1) % gatesPerLap) + 1;
  const lines = [
    `v = ${beta.toFixed(4)} c   γ = ${g.toFixed(3)}`,
    state.phase === "finished" ? "finished" : `lap ${lap}/${track.laps}   gate ${gateInLap}/${gatesPerLap}`,
    `c = ${speedOfLightText().text}`,
    nearestBodyLine(ship, bodies),
  ];
  if (gravityOn) lines.splice(1, 0, `clock rate dτ/dt = ${(1 / kinematics(ship).tdot).toFixed(4)}`);
  if (gameSpeed !== 1) lines.push(`game speed ${gameSpeed}× real time`);
  if (state.rulesChanged && state.phase !== "ready") lines.push("settings changed: run can't be saved");
  else if (!isStandard()) lines.push("custom settings");
  ctx.font = `13px ${MONO}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(4, 6, 13, 0.65)";
  ctx.fillRect(8, 8, 300, 18 * lines.length + 22);
  ctx.fillStyle = HUD;
  lines.forEach((line, i) => {
    // A speed of light other than the real one, and a game speed other than 1×, are shown in orange.
    const unusual = (line.startsWith("c = ") && C !== REAL_C) || line.startsWith("game speed");
    ctx.fillStyle = unusual ? "#ffb86b" : HUD;
    ctx.fillText(line, 16, 15 + 18 * i);
  });
  const barW = 284 - 16;
  const barY = 15 + 18 * lines.length + 2;
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.fillRect(16, barY, barW, 5);
  ctx.fillStyle = "#ff6fae";
  ctx.fillRect(16, barY, barW * beta, 5);

  // Race clocks and best times, in the lower right.
  {
    const done = state.phase === "finished" && state.result;
    const raceT = done ? state.result!.t : ship.t;
    const raceTau = done ? state.result!.tau : ship.tau;
    const big = width < 560 ? 18 : width < 900 ? 22 : 28;
    const small = 12;
    const panelW = Math.min(width - 24, big * 11.5);
    const listLines = Math.max(1, bests.length) + 1;
    const listTitle = isStandard() ? "Best times" : "Best (custom)";
    const mid = Math.round(big * 0.6);
    const panelH = small * 1.5 * listLines + 10 + big * 1.6 + mid * 1.5 + 16;
    const px0 = width - panelW - 12;
    const py0 = height - panelH - 12;
    ctx.fillStyle = "rgba(4, 6, 13, 0.7)";
    ctx.fillRect(px0, py0, panelW, panelH);
    ctx.textBaseline = "top";
    let y = py0 + 8;
    ctx.font = `bold ${small}px system-ui, sans-serif`;
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(223, 232, 255, 0.7)";
    ctx.fillText(listTitle, px0 + 10, y);
    ctx.textAlign = "right";
    ctx.fillText("rest frame    your clock", px0 + panelW - 10, y);
    y += small * 1.5;
    ctx.font = `${small}px ${MONO}`;
    if (bests.length === 0) {
      ctx.textAlign = "left";
      ctx.fillText("none yet", px0 + 10, y);
      y += small * 1.5;
    }
    bests.forEach((run, i) => {
      ctx.fillStyle = done && state.newRank === i + 1 ? "#ffd27a" : "rgba(223, 232, 255, 0.85)";
      ctx.textAlign = "left";
      ctx.fillText(`${i + 1}.`, px0 + 10, y);
      ctx.textAlign = "right";
      ctx.fillText(`${formatTime(run.t)}     ${formatTime(run.tau)}`, px0 + panelW - 10, y);
      y += small * 1.5;
    });
    y += 6;
    ctx.strokeStyle = "rgba(223, 232, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px0 + 10, y);
    ctx.lineTo(px0 + panelW - 10, y);
    ctx.stroke();
    y += 8;
    // The race time is large and colored by how much faster it runs than your clock, dt/dτ.
    const rate = done ? 1 : kinematics(ship).tdot;
    const rateColor = timeRateColor(rate);
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(223, 232, 255, 0.7)";
    ctx.font = `${small}px system-ui, sans-serif`;
    ctx.fillText("race time", px0 + 10, y + big * 0.45);
    ctx.fillStyle = rateColor;
    ctx.font = `bold ${small}px ${MONO}`;
    ctx.fillText(`×${rate < 10 ? rate.toFixed(2) : rate.toFixed(1)}`, px0 + 10, y + big * 0.45 + small * 1.3);
    ctx.font = `bold ${big}px ${MONO}`;
    ctx.textAlign = "right";
    ctx.fillText(formatTime(raceT), px0 + panelW - 10, y + big * 0.7);
    y += big * 1.6;
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(223, 232, 255, 0.7)";
    ctx.font = `${small}px system-ui, sans-serif`;
    ctx.fillText("your clock τ", px0 + 10, y + mid * 0.6);
    ctx.font = `${mid}px ${MONO}`;
    ctx.textAlign = "right";
    ctx.fillText(formatTime(raceTau), px0 + panelW - 10, y + mid * 0.6);
    ctx.textBaseline = "top";
  }

  // Rest-frame map of the course.
  const mapW = Math.min(170, width * 0.28);
  const mapScale = mapW / (track.maxX - track.minX);
  const mapH = (track.maxY - track.minY) * mapScale;
  const mx0 = width - mapW - 14;
  const my0 = 46;
  const mapX = (x: number) => mx0 + (x - track.minX) * mapScale;
  const mapY = (y: number) => my0 + (y - track.minY) * mapScale;
  ctx.fillStyle = "rgba(4, 6, 13, 0.65)";
  ctx.fillRect(mx0 - 6, my0 - 6, mapW + 12, mapH + 12);
  ctx.strokeStyle = "rgba(223, 232, 255, 0.4)";
  ctx.lineWidth = Math.max(2, track.width * mapScale);
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
  // Ghosts on the map, at the ship's current rest-frame time (the map shows the rest frame).
  if (opts.ghost && state.phase !== "ready") {
    ctx.font = `9px ${MONO}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    bests.forEach((run, rank) => {
      const q = sampleRunAt(run.samples, ship.t);
      ctx.fillStyle = GHOST_MARKER_COLOR;
      ctx.beginPath();
      ctx.arc(mapX(q.x), mapY(q.y), 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(String(rank + 1), mapX(q.x) + 4, mapY(q.y));
    });
  }
  ctx.fillStyle = "#ff6fae";
  ctx.beginPath();
  ctx.arc(mapX(ship.x), mapY(ship.y), 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Markers pointing toward off-screen ghosts. Markers that would overlap are spread along the edge.
  const placed: { x: number; y: number }[] = [];
  for (const { ang, rank } of ghostMarkers) {
    let e = edgePoint(ang, 22);
    for (let tries = 0; tries < 10 && placed.some(m => Math.hypot(m.x - e.x, m.y - e.y) < 22); tries++) {
      e = { x: e.x - Math.sin(ang) * 22, y: e.y + Math.cos(ang) * 22 };
    }
    placed.push(e);
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.fillStyle = GHOST_MARKER_COLOR;
    ctx.strokeStyle = GHOST_MARKER_COLOR;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(Math.cos(ang) * 17, Math.sin(ang) * 17);
    ctx.lineTo(Math.cos(ang + 0.5) * 10.5, Math.sin(ang + 0.5) * 10.5);
    ctx.lineTo(Math.cos(ang - 0.5) * 10.5, Math.sin(ang - 0.5) * 10.5);
    ctx.closePath();
    ctx.fill();
    ctx.font = `bold 11px ${MONO}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(rank + 1), 0, 0.5);
    ctx.restore();
  }

  // Countdown and results.
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (state.crashTimer > 0 && !overlay) {
    ctx.fillStyle = "#ffb86b";
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.fillText(state.crashedInto, cx, cy - 80);
  } else if (state.phase === "ready" && !overlay) {
    ctx.fillStyle = HUD;
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.fillText(TOUCH_ONLY ? "Press Thrust to start" : "Press ↑ to start", cx, cy - 80);
  } else if (state.phase === "racing" && ship.t < 1) {
    ctx.fillStyle = `rgba(223, 232, 255, ${1 - ship.t})`;
    ctx.font = "bold 64px system-ui, sans-serif";
    ctx.fillText("GO", cx, cy - 80);
  } else if (state.phase === "finished" && state.result && !overlay) {
    const by = cy + 20;
    const bw = Math.min(width - 24, 420);
    ctx.fillStyle = "rgba(4, 6, 13, 0.75)";
    ctx.fillRect(cx - bw / 2, by, bw, 64);
    ctx.fillStyle = HUD;
    ctx.font = "bold 17px system-ui, sans-serif";
    const list = state.standardAtStart ? "best times" : "best times for these custom settings";
    const heading = state.rulesChanged ? "Finished (settings changed during the race)"
      : state.awaitingSave ? "Finished with custom settings"
      : state.newRank === 1 ? `Finished — new #1 on your ${list}!`
      : state.newRank > 1 ? `Finished — #${state.newRank} on your ${list}`
      : "Finished";
    ctx.fillText(heading, cx, by + 20, bw - 16);
    ctx.font = `13px ${MONO}`;
    ctx.fillText(`rest frame ${formatTime(state.result.t)}   your clock ${formatTime(state.result.tau)}`, cx, by + 46, bw - 16);
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
  const mapSelect = document.getElementById("rf-map") as HTMLSelectElement;
  for (const m of MAPS) mapSelect.add(new Option(m.name, m.id));
  const gravityBox = box("rf-gravity");
  const warning = document.getElementById("rf-custom-warning") as HTMLElement;
  const standardBtn = document.getElementById("rf-standard") as HTMLButtonElement;
  const endBox = document.getElementById("rf-end") as HTMLElement;
  const endSave = document.getElementById("rf-end-save") as HTMLButtonElement;
  const endRestart = document.getElementById("rf-end-restart") as HTMLButtonElement;
  const zoomSlider = box("rf-zoom");
  const zoomOut = document.getElementById("rf-zoom-out") as HTMLOutputElement;
  const zoomValue = () => Math.pow(10, Number(zoomSlider.value));
  const showZoom = () => {
    const z = zoomValue();
    zoomOut.textContent = z >= 0.995 ? `${z.toFixed(z < 10 ? 1 : 0)}×`
      : z >= 0.1 ? `${z.toFixed(2)}×`
      : `1/${Math.round(1 / z).toLocaleString()}×`;
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
  const thrustAccel = () => thrustSetting * C;
  const showThrust = () => { thrustOut.textContent = `${Number(thrustSlider.value).toFixed(2)} c/s`; };
  const cSlider = box("rf-c");
  const speedSlider = box("rf-speed");
  const speedOut = document.getElementById("rf-speed-out") as HTMLOutputElement;
  const cOut = document.getElementById("rf-c-out") as HTMLOutputElement;
  const restartBtn = document.getElementById("rf-restart") as HTMLButtonElement;
  const clearBtn = document.getElementById("rf-clear-best") as HTMLButtonElement;
  const exportBtn = document.getElementById("rf-export") as HTMLButtonElement;
  const importBtn = document.getElementById("rf-import") as HTMLButtonElement;
  const importFile = document.getElementById("rf-import-file") as HTMLInputElement;
  const transferStatus = document.getElementById("rf-transfer-status") as HTMLElement;

  let track = buildTrack(currentMap);
  const stars = makeStars();
  let bests = loadBests(storageKey());
  let state = newState(track);
  let view = new View(state.ship);
  const controls: Controls = { left: false, right: false, thrust: false, brake: false };

  /** Shows the warning about custom settings when they differ from the map's standard ones. */
  const updateWarning = () => {
    warning.hidden = isStandard();
  };
  /** After a physics setting changes: a race in progress can no longer be saved, and the best times
   *  shown are the ones for the new settings. */
  const settingsChanged = () => {
    if (state.phase === "racing") state.rulesChanged = true;
    bests = loadBests(storageKey());
    updateWarning();
  };

  /** Sets the speed of light. The ship keeps its ordinary speed (capped below the new c), so lowering
   *  c makes the same motion more relativistic. On a map measured in real distances, the course and
   *  the ship's position scale with c. */
  const setC = (c: number) => {
    const ship = state.ship;
    const { vx, vy } = velocityOf(ship);
    C = c;
    C2 = C * C;
    cSlider.value = String(C);
    const { text, real } = speedOfLightText();
    cOut.textContent = text;
    cOut.classList.toggle("rf-unreal", !real);
    const speed = Math.hypot(vx, vy);
    const capped = Math.min(speed, MAX_BETA * C);
    const g = 1 / Math.sqrt(1 - (capped * capped) / C2);
    ship.ux = speed > 0 ? (vx / speed) * capped * g : 0;
    ship.uy = speed > 0 ? (vy / speed) * capped * g : 0;
  };
  const setGameSpeed = (speed: number) => {
    gameSpeed = speed;
    speedSlider.value = String(Math.max(0, GAME_SPEEDS.indexOf(speed)));
    speedSlider.max = String(GAME_SPEEDS.length - 1);
    speedOut.textContent = `${speed}×`;
    speedOut.classList.toggle("rf-unreal", speed !== 1);
  };
  const setThrust = (thrust: number) => {
    thrustSetting = thrust;
    thrustSlider.value = String(thrust);
    showThrust();
  };
  const setGravity = (on: boolean) => {
    gravityOn = on;
    gravityBox.checked = on;
  };
  const applyStandard = () => {
    const std = currentMap.standard;
    setC(std.c);
    setThrust(std.thrust);
    setGravity(std.gravity);
    setGameSpeed(1);
    settingsChanged();
  };

  cSlider.addEventListener("input", () => {
    setC(Number(cSlider.value));
    settingsChanged();
  });
  cSlider.addEventListener("change", () => canvas.focus());
  thrustSlider.addEventListener("input", () => {
    setThrust(Number(thrustSlider.value));
    settingsChanged();
  });
  thrustSlider.addEventListener("change", () => canvas.focus());
  speedSlider.addEventListener("input", () => {
    setGameSpeed(GAME_SPEEDS[Number(speedSlider.value)] ?? 1);
    settingsChanged();
  });
  speedSlider.addEventListener("change", () => canvas.focus());
  gravityBox.addEventListener("change", () => {
    setGravity(gravityBox.checked);
    settingsChanged();
    canvas.focus();
  });
  standardBtn.addEventListener("click", () => {
    applyStandard();
    canvas.focus();
  });
  for (const input of [cSlider, thrustSlider, speedSlider, gravityBox, lorentzBox, ghostBox, clocksBox, gridBox, orbitsBox,
                       zoomSlider, dopplerSelect, standardBtn]) {
    input.addEventListener(input === standardBtn ? "click" : "change", () => saveSettings());
  }
  /** Whether keystrokes reach the game. Read from the browser each frame, since the canvas can be
   *  focused before the focus listener is attached (when saved settings restart the race). */
  const hasFocus = () => document.activeElement === canvas && document.hasFocus();
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

  /** Starts a new race; `focus` moves keyboard focus to the game (but not when the page loads). */
  const restart = (focus = true) => {
    track = buildTrack(currentMap);
    state = newState(track);
    view = new View(state.ship);
    paused = false;
    started = focus;
    if (focus) canvas.focus();
  };
  const saveSettings = () => saveJSON(SETTINGS_KEY, {
    map: currentMap.id, c: C, thrust: thrustSetting, gravity: gravityOn,
    lorentz: lorentzBox.checked, doppler: colorMode, ghosts: ghostBox.checked, clocks: clocksBox.checked,
    grid: gridBox.checked, orbits: orbitsBox.checked, zoom: Number(zoomSlider.value), gameSpeed,
  } satisfies SavedSettings);
  mapSelect.addEventListener("change", () => {
    currentMap = MAPS.find(m => m.id === mapSelect.value) ?? MAPS[0];
    applyStandard();
    setZoom(currentMap.zoom);
    restart();
    saveSettings();
  });

  // Restore the settings from the last visit, if any; otherwise start with the first map's standard
  // settings.
  const saved = loadJSON<Partial<SavedSettings>>(SETTINGS_KEY);
  currentMap = MAPS.find(m => m.id === saved?.map) ?? MAPS[0];
  mapSelect.value = currentMap.id;
  applyStandard();
  setZoom(currentMap.zoom);
  if (saved) {
    const inRange = (input: HTMLInputElement, v: unknown) =>
      typeof v === "number" && v >= Number(input.min) && v <= Number(input.max);
    if (inRange(cSlider, saved.c)) setC(saved.c!);
    if (inRange(thrustSlider, saved.thrust)) setThrust(saved.thrust!);
    if (typeof saved.gravity === "boolean") setGravity(saved.gravity);
    if (typeof saved.lorentz === "boolean") lorentzBox.checked = saved.lorentz;
    if (typeof saved.ghosts === "boolean") ghostBox.checked = saved.ghosts;
    if (typeof saved.clocks === "boolean") clocksBox.checked = saved.clocks;
    if (typeof saved.grid === "boolean") gridBox.checked = saved.grid;
    if (typeof saved.orbits === "boolean") orbitsBox.checked = saved.orbits;
    if (saved.doppler === "vivid" || saved.doppler === "blackbody" || saved.doppler === "off") {
      colorMode = saved.doppler;
      dopplerSelect.value = colorMode;
    }
    if (inRange(zoomSlider, saved.zoom)) setZoom(saved.zoom!);
    if (typeof saved.gameSpeed === "number" && GAME_SPEEDS.includes(saved.gameSpeed)) setGameSpeed(saved.gameSpeed);
    settingsChanged();
    restart(false);
  }

  // At the end of a run with custom settings, the run can be saved to the list for those settings.
  endSave.addEventListener("click", () => {
    if (!state.awaitingSave || !state.result) return;
    const runs = loadBests(state.startKey);
    state.newRank = insertRun(runs, state.result);
    if (state.newRank > 0) saveBests(runs, state.startKey);
    state.awaitingSave = false;
    bests = loadBests(storageKey());
    canvas.focus();
  });
  endRestart.addEventListener("click", () => restart());

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
    } else if (e.code === "KeyF") {
      // The same as the full-screen button on the game (see common/panels.ts).
      if (document.fullscreenElement) void document.exitFullscreen();
      else void root.requestFullscreen?.();
      e.preventDefault();
    } else if (e.code === "KeyL") {
      lorentzBox.checked = !lorentzBox.checked;
      saveSettings();
    } else if (e.code === "KeyC") {
      const modes: ColorMode[] = ["vivid", "blackbody", "off"];
      colorMode = modes[(modes.indexOf(colorMode) + 1) % modes.length];
      dopplerSelect.value = colorMode;
      saveSettings();
    } else if (e.code === "Equal" || e.code === "NumpadAdd") {
      setZoom(Number(zoomSlider.value) + 0.1);
      saveSettings();
      e.preventDefault();
    } else if (e.code === "Minus" || e.code === "NumpadSubtract") {
      setZoom(Number(zoomSlider.value) - 0.1);
      saveSettings();
      e.preventDefault();
    } else if (e.code === "Space") {
      e.preventDefault();
    }
  });
  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    setZoom(Number(zoomSlider.value) - e.deltaY * 0.002);
    saveSettings();
  }, { passive: false });
  canvas.addEventListener("keyup", e => {
    const control = keyMap[e.code];
    if (control) controls[control] = false;
  });
  canvas.addEventListener("focus", () => {
    started = true;
  });
  canvas.addEventListener("pointerdown", () => {
    started = true;
    canvas.focus();
  });
  canvas.addEventListener("blur", () => {
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

  restartBtn.addEventListener("click", () => restart());
  clearBtn.addEventListener("click", () => {
    bests = [];
    clearBests(storageKey());
    canvas.focus();
  });
  // Sharing best times and ghosts: a JSON file with every saved list, shared through the device's
  // share sheet where available and downloaded otherwise; and loading such a file.
  const runsText = (n: number) => `${n} ${n === 1 ? "run" : "runs"}`;
  exportBtn.addEventListener("click", async () => {
    const lists = allSavedLists();
    const count = Object.values(lists).reduce((n, runs) => n + runs.length, 0);
    if (count === 0) {
      transferStatus.textContent = "No best times to share yet.";
      return;
    }
    const json = JSON.stringify({ format: TRANSFER_FORMAT, version: 2, exported: new Date().toISOString(), lists });
    const name = "relativistic-flight-best-times.json";
    const file = new File([json], name, { type: "application/json" });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Racing Near the Speed of Light: best times" });
        transferStatus.textContent = `Shared ${runsText(count)}.`;
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    transferStatus.textContent = `Downloaded ${runsText(count)} as ${name}.`;
  });
  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", async () => {
    const file = importFile.files?.[0];
    importFile.value = "";
    if (!file) return;
    try {
      const added = importLists(await file.text());
      bests = loadBests(storageKey());
      transferStatus.textContent = added === 0
        ? "Nothing added: these runs are already here or slower than your five best."
        : `Added ${runsText(added)}.`;
    } catch (e) {
      transferStatus.textContent = e instanceof SyntaxError ? "This file isn't a best-times file." : (e as Error).message;
    }
  });

  document.addEventListener("fullscreenchange", () => {
    resize();
    if (document.fullscreenElement === root) canvas.focus();
  });

  setupHelp("rf");

  // The game and the settings can be pinned, and the game shown full screen (see common/panels.ts).
  const panels = setupPanels("rf", () =>
    saveJSON(PIN_KEY, panels.list.map((panel, i) => (panels.isPinned(panel) ? i : -1)).filter(i => i >= 0)));
  const savedPins = loadJSON<number[]>(PIN_KEY);
  if (Array.isArray(savedPins)) {
    for (const i of savedPins) if (panels.list[i]) panels.setPinned(panels.list[i], true);
  }
  [lorentzBox, orbitsBox, gridBox, clocksBox, ghostBox].forEach(b => b.addEventListener("change", () => canvas.focus()));

  let last = performance.now();
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const running = started && !paused && (hasFocus() || TOUCH_ONLY) && !document.hidden;
    currentBodies = placeBodies(track);
    if (running) {
      // Small steps of ship time keep gate crossings and orbits accurate at every game speed.
      const shipDt = dt * gameSpeed;
      const n = Math.ceil(shipDt / 0.004);
      for (let i = 0; i < n; i++) {
        if (step(state, track, currentBodies, controls, shipDt / n, thrustAccel())) {
          state.result = { t: state.ship.t, tau: state.ship.tau, samples: state.recording };
          if (state.rulesChanged) {
            // A run whose settings changed during the race isn't saved.
          } else if (state.standardAtStart) {
            state.newRank = insertRun(bests, state.result);
            if (state.newRank > 0) saveBests(bests, state.startKey);
          } else {
            state.awaitingSave = true;
          }
        }
      }
    }
    view.update(lorentzBox.checked);
    endBox.hidden = state.phase !== "finished";
    endSave.hidden = !state.awaitingSave;

    let overlay: string | null = null;
    if (!started) overlay = TOUCH_ONLY ? "Tap a control to start" : "Click here to start\n↑ thrust · ↓ brake · ← → turn · + − zoom";
    else if (!running) overlay = TOUCH_ONLY || hasFocus() ? "Paused\nPress P to resume" : "Paused\nClick the game to resume";
    render(ctx, state, track, currentBodies, stars, bests, view,
           { grid: gridBox.checked, clocks: clocksBox.checked, ghost: ghostBox.checked, orbits: orbitsBox.checked, zoom: zoomValue() },
           width, height, dpr, overlay);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

init();
