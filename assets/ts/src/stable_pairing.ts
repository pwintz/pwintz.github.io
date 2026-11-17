// ╭───────────────────────────────────────────────────────────────╮
// │          Stable pairings: people as boids looking for love    │
// ╰───────────────────────────────────────────────────────────────╯
// Each person is a dot that moves like a boid. Each person i has an attraction a[i][j] in [0, 1]
// toward each other person j (not necessarily mutual).
//   • Movement: each person is pulled toward the people they would rather be with than their
//     current partner, in proportion to how much more attractive those people are (a single person
//     is pulled toward everyone, in proportion to attraction). People also wander a little, keep
//     their distance from people they don't want (so content couples spread out, and people move
//     away from admirers they don't want), keep from bumping into each other, and stay inside the
//     canvas. Partners are held a short distance apart and move together.
//   • Meetings: when two people come within MEET_DIST of each other and each would rather be with
//     the other than with their current partner (a "blocking pair"), they pair up, and their former
//     partners become single. An attraction of 0 means no interest: people pair only with people
//     they're attracted to, and being single is worse than being with any of them. After a change of
//     partner, the people involved wait COOLDOWN seconds before changing again (otherwise a clump
//     of people with no stable pairing would change partners at every step).
//   • Loyalty changes how attractive a person's own partner seems: not at all, infinitely
//     (never leave), by a fixed boost, by a boost that grows with time together, or by a penalty
//     that grows with time together (boredom).
// The page reports the blocking pairs, the number of breakups over time, and whether a stable
// pairing exists for the attractions (Irving's algorithm, in stable_pairing/roommates.ts).
//
// Distances are in "world" pixels. The canvas shows the world at a zoom of 1 (CSS pixels) or more:
// a few people in a large canvas are drawn larger, so they fill the space better.

import { setupHelp } from './common/help';
import { setupPanels } from './common/panels';
import { loadJSON, saveJSON } from './common/storage';
import { stablePairing } from './stable_pairing/roommates';

// ── Constants ──────────────────────────────────────────────────────
const RADIUS = 13;        // Radius of a person's dot (px).
const PAIR_DIST = 30;     // Distance between partners with no loyalty (px).
const PAIR_DIST_LOYAL = 21; // Distance between the most loyal partners, who overlap (px).
const PAIR_DIST_BORED = 36; // Distance between the most bored partners (px).
const SEPARATION = 60;    // People who aren't partners push apart when closer than this (px).
const MEET_DIST = 70;     // People this close have met (px).
const CRUSH_SHARE = 0.15; // Pull toward someone who doesn't want one back, relative to a mutual want.
const DESIRE = 150;       // Strongest pull toward wanted people (px/s²).
const CENTER = 30;        // Pull toward the middle of the canvas at its edges (px/s²).
const WANDER = 45;        // Random wandering (px/s²).
const TURN = 1.6;         // Random kicks to the turning rate (rad/s per √s).
const TURN_RETURN = 1.5;  // How fast the turning rate returns toward straight ahead (1/s).
const WALL_TURN = 3;      // Fastest turn away from a wall straight ahead (rad/s).
const WALL_SIGHT = 120;   // People don't wander toward walls closer than this (px).
const HAPPY_WANDER = 0.5; // Happy couples wander this fraction as much...
const HAPPY_DRAG = 1.5;   // ...and lose this much more velocity per second, so they drift calmly.
const PUSH = 1200;        // Strongest push apart (px/s²).
const SPACE = 150;        // Personal space: people push away from people they don't want within this (px).
const SPACE_PUSH = 110;   // Strongest push out of personal space (px/s²).
const DRAG = 0.9;         // Velocity lost per second (fraction).
const MAX_SPEED = 120;    // px/s.
const WALL = 40;          // People turn back within this distance of the edges (px).
const MAX_STEP = 1 / 60;  // Longest simulation step (s).
const PAIR_RATE = 5;      // How fast new partners close the gap between them (1/s).
const AREA_PER_PERSON = 150 * 150; // At zoom 1; with more room per person, the view zooms in (px²).
const MAX_ZOOM = 2.5;
const PROXIMITY_RANGE = 200; // With the proximity option, attraction grows for people closer than this (px).
const HEARTBREAK_TIME = 8; // Heartbreak decays by a factor of e every this many seconds (s).
const HEARTBREAK_MOPE = 0.6; // A fresh heartbreak weakens the pull toward others by this fraction.
const COOLDOWN = 1.5;     // After a change of partner, a person waits this long before the next (s).
const PAIR_FONT = 'bold 13px system-ui, -apple-system, "Segoe UI", sans-serif';
const SMALL_FONT = 'bold 10px system-ui, -apple-system, "Segoe UI", sans-serif'; // Two-character names

// Colors: Okabe–Ito, so they stay distinct under color blindness.
const GROUP_COLORS = ['#0072B2', '#E69F00'];
const GROUP_TEXT = ['#fff', '#202124'];
const HEART_COLOR = '#D55E00';
const BLOCKING_COLOR = '#CC79A7';
const COUPLE_COLOR = 'rgba(60, 64, 67, 0.55)';
const CRUSH_COLOR = '#9aa0a6';
const LINE_COLOR = '#0072B2';
const REFERENCE_COLOR = '#9aa0a6';
const HURT_COLOR = '#6b7078';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// ── Settings ───────────────────────────────────────────────────────
type Pairing = 'anyone' | 'groups';
type Kind = 'random' | 'mutual' | 'shared' | 'custom';
type Loyalty = 'none' | 'absolute' | 'boost' | 'growing' | 'boredom' | 'mixed';

const MAX_TABLE = 26;     // The attraction table is shown for at most this many people.
const COUNTS = [4, 6, 8, 10, 12, 16, 20, 24, 30, 40, 50, 60, 80, 100];
const SPEEDS = [0.25, 0.5, 1, 2, 4];
const INTERESTS = [0, 3, 5, 10, 20];
const FLUCTUATIONS = [0, 0.1, 0.2, 0.35];
const PROXIMITIES = [0, 0.1, 0.2, 0.4];
const DEFAULTS = {
  count: 8,
  pairing: 'anyone' as Pairing,
  kind: 'random' as Kind,
  seed: 1,
  fluctuation: 0,   // How far attractions swing around their usual values (0: not at all).
  proximity: 0,     // How much attraction grows for people close by (0: not at all).
  // Happiness (only the graph):
  hurtCost: 0.5,       // Unhappiness of a fresh heartbreak.
  singleJoy: 0,        // Happiness of being single.
  countLoyalty: false, // Whether loyalty adds to happiness.
  interest: 10,     // How many others each person is attracted to (0: everyone).
  loyalty: 'none' as Loyalty,
  boost: 0.2,       // Added to the attraction to one's partner.
  growth: 0.1,      // Loyalty gained per second together.
  growthMax: 1,     // Most loyalty that can grow.
  boredom: 0.05,    // Attraction lost per second together.
  speed: 1,
  showBlocking: true,
  showCrushes: false,
};
const settings = { ...DEFAULTS };
Object.assign(settings, loadJSON<Partial<typeof settings>>('sp_settings') ?? {});
if (!COUNTS.includes(settings.count)) settings.count = DEFAULTS.count;
if (!SPEEDS.includes(settings.speed)) settings.speed = 1;
if (!FLUCTUATIONS.includes(settings.fluctuation)) settings.fluctuation = 0;
if (!(settings.growthMax >= 0.05 && settings.growthMax <= 1)) settings.growthMax = 1;
settings.proximity = 0; // The Proximity setting is hidden for now, so it's off.
const HURT_COSTS = [0, 0.25, 0.5, 1];
const SINGLE_JOYS = [0, 0.2, 0.4];
if (!HURT_COSTS.includes(settings.hurtCost)) settings.hurtCost = 0.5;
if (!SINGLE_JOYS.includes(settings.singleJoy)) settings.singleJoy = 0;
settings.countLoyalty = settings.countLoyalty === true;
if (!INTERESTS.includes(settings.interest)) settings.interest = DEFAULTS.interest;
if (!['anyone', 'groups'].includes(settings.pairing)) settings.pairing = 'anyone';
if (!['random', 'mutual', 'shared', 'custom'].includes(settings.kind)) settings.kind = 'random';
if (!['none', 'absolute', 'boost', 'growing', 'boredom', 'mixed'].includes(settings.loyalty)) settings.loyalty = 'none';
const saveSettings = () => saveJSON('sp_settings', settings);

// a[i][j]: how attracted person i is to person j.
let attraction: number[][] = [];
const saveAttraction = () => saveJSON('sp_attraction', attraction);

// ── Attraction right now ───────────────────────────────────────────
// `attraction` holds each person's usual attraction (the table's values). `live` is the attraction
// right now, which can differ in two ways:
//   • Fluctuation: each attraction rises and falls around its usual value, as the sum of two slow
//     waves with their own periods and phases for each ordered pair.
//   • Proximity: attraction grows for people nearby, by up to settings.proximity for people who
//     are touching, falling off linearly to nothing at PROXIMITY_RANGE.
// An attraction of 0 (no interest) stays 0.
let live: number[][] = [];
let waves = new Float32Array(0); // Per pair: frequency 1, phase 1, frequency 2, phase 2.

function updateLive(): void {
  const n = attraction.length;
  if (settings.fluctuation === 0 && settings.proximity === 0) { live = attraction; return; }
  if (waves.length !== 4 * n * n) {
    waves = new Float32Array(4 * n * n);
    for (let k = 0; k < n * n; k++) {
      waves[4 * k] = (2 * Math.PI) / (8 + 10 * Math.random());       // Period 8–18 s
      waves[4 * k + 1] = 2 * Math.PI * Math.random();
      waves[4 * k + 2] = (2 * Math.PI) / (25 + 25 * Math.random());  // Period 25–50 s
      waves[4 * k + 3] = 2 * Math.PI * Math.random();
    }
  }
  if (live === attraction || live.length !== n) live = attraction.map(row => [...row]);
  const amp = settings.fluctuation, near = settings.proximity;
  const sameSize = people.length === n;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const a = attraction[i][j];
      if (a <= 0) { live[i][j] = 0; continue; }
      const k = 4 * (i * n + j);
      let v = a;
      if (amp > 0) v += amp * (0.6 * Math.sin(waves[k] * simTime + waves[k + 1]) + 0.4 * Math.sin(waves[k + 2] * simTime + waves[k + 3]));
      if (near > 0 && sameSize) {
        const d = Math.hypot(people[i].x - people[j].x, people[i].y - people[j].y);
        if (d < PROXIMITY_RANGE) v += near * (1 - d / PROXIMITY_RANGE);
      }
      live[i][j] = Math.min(1, Math.max(0.01, v));
    }
  }
  matrixDirty = true;
}

// ── Attractions ────────────────────────────────────────────────────
/** A small seeded random number generator (mulberry32), so "New attractions" can be repeated. */
function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const groupOf = (i: number) => (settings.pairing === 'groups' && i >= settings.count / 2 ? 1 : 0);
const canPair = (i: number, j: number) => i !== j && (settings.pairing === 'anyone' || groupOf(i) !== groupOf(j));
// A to Z; with more than 26 people, A1 to Z1, A2 to Z2, and so on, so all names look alike.
const name = (i: number) => String.fromCharCode(65 + (i % 26)) + (settings.count > 26 ? String(Math.floor(i / 26) + 1) : '');

/** Attractions with two decimals. Each person's attractions are distinct where possible, so that
 *  everyone has a clear order of preference. */
function generate(kind: Kind, n: number, seed: number, interest = settings.interest): number[][] {
  const rand = seededRandom(seed);
  const value = () => (1 + Math.floor(rand() * 99)) / 100; // 0.01 to 0.99
  const a = Array.from({ length: n }, () => Array<number>(n).fill(0));
  const used = Array.from({ length: n }, () => new Set<number>());
  const fresh = (rows: number[]) => {
    for (let tries = 0; ; tries++) {
      const v = value();
      if (tries > 200 || rows.every(r => !used[r].has(v))) { rows.forEach(r => used[r].add(v)); return v; }
    }
  };
  if (kind === 'shared') {
    const looks = Array.from({ length: n }, () => fresh([0]));
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) a[i][j] = looks[j];
  } else if (kind === 'mutual') {
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) a[i][j] = a[j][i] = fresh([i, j]);
  } else {
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) a[i][j] = fresh([i]);
  }
  // Sparse attraction: each person is attracted to only `interest` others, chosen at random
  // (for mutual attraction, the pairs either of them chose, so it stays mutual).
  if (interest > 0 && interest < n - 1) {
    const chosen = Array.from({ length: n }, () => Array<boolean>(n).fill(false));
    for (let i = 0; i < n; i++) {
      const others = [...Array(n).keys()].filter(j => j !== i);
      for (let k = others.length - 1; k > 0; k--) {
        const m = Math.floor(rand() * (k + 1));
        [others[k], others[m]] = [others[m], others[k]];
      }
      others.slice(0, interest).forEach(j => { chosen[i][j] = true; });
    }
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const keep = kind === 'mutual' ? chosen[i][j] || chosen[j][i] : chosen[i][j];
        if (!keep) a[i][j] = 0;
      }
    }
  }
  return a;
}

// The classic example with no stable pairing: A, B, and C each like the next one best (A likes B,
// B likes C, C likes A), and everyone likes D least.
const CLASSIC = [
  [0, 0.9, 0.6, 0.2],
  [0.6, 0, 0.9, 0.2],
  [0.9, 0.6, 0, 0.2],
  [0.7, 0.5, 0.3, 0],
];

// ── People ─────────────────────────────────────────────────────────
interface Person {
  x: number; y: number; vx: number; vy: number;
  heading: number;  // Direction of wandering (radians).
  turn: number;     // How fast the heading is turning (rad/s).
  partner: number;  // Index of their partner, or −1 if single.
  since: number;    // Simulation time when they paired with their partner (s).
  changed: number;  // Simulation time of their last change of partner (s).
  loyal: boolean;   // With mixed loyalty: grows more loyal over time (true) or more bored (false).
  hurt: number;     // Heartbreak at time hurtAt: 1 when just left by a partner, then decaying.
  hurtAt: number;   // Simulation time of their last heartbreak (s).
}
let people: Person[] = [];
let width = 800, height = 450; // Size of the world: the canvas's size divided by the zoom.
let zoom = 1;                  // CSS pixels per world pixel.
// The info box's corner of the plot (world px), which people avoid: x from boxLeft to the right
// edge, y from the top to boxBottom. On small screens the box is below the plot, so boxLeft = ∞.
let boxLeft = Infinity, boxBottom = 0;

let simTime = 0;
let breakups = 0;
let lastBreakup = -1;              // Simulation time of the last breakup, or −1.
let history: [number, number][] = [[0, 0]]; // (time, breakups so far) at each breakup.
let pairsChanged = true;           // Redraw the table's partner outlines.

interface Effect { x: number; y: number; t: number; kind: 'heart' | 'dumped'; who: number }
let effects: Effect[] = [];

function restart(): void {
  const n = settings.count;
  updateLive();
  people = [];
  resizeCanvas(); // The zoom depends on the number of people.
  people = [];
  for (let i = 0; i < n; i++) {
    let x = 0, y = 0;
    for (let tries = 0; tries < 50; tries++) {
      x = WALL + Math.random() * Math.max(1, width - 2 * WALL);
      y = WALL + Math.random() * Math.max(1, height - 2 * WALL);
      if (people.every(p => Math.hypot(p.x - x, p.y - y) > 3 * RADIUS)) break;
    }
    const angle = Math.random() * 2 * Math.PI;
    people.push({ x, y, vx: 40 * Math.cos(angle), vy: 40 * Math.sin(angle), heading: angle, turn: 0, partner: -1, since: 0, changed: -Infinity, loyal: i % 2 === 0, hurt: 0, hurtAt: 0 });
  }
  simTime = 0;
  followed = -1;
  breakups = 0;
  lastBreakup = -1;
  history = [[0, 0]];
  happyHistory = [];
  effects = [];
  pairsChanged = true;
  matrixDirty = true;
  updateStatus();
}

// ── Loyalty and blocking pairs ─────────────────────────────────────
/** How attractive person i's partner seems to i, with loyalty: −∞ if i is single, +∞ if i never
 *  leaves. */
function partnerValue(i: number): number {
  const p = people[i].partner;
  if (p < 0) return -Infinity;
  const base = live[i][p];
  const together = simTime - people[i].since;
  switch (settings.loyalty) {
    case 'absolute': return Infinity;
    case 'boost': return base + settings.boost;
    case 'growing': return base + Math.min(settings.growthMax, settings.growth * together);
    case 'boredom': return base - settings.boredom * together;
    case 'mixed': return base + (people[i].loyal ? Math.min(settings.growthMax, settings.growth * together) : -settings.boredom * together);
    default: return base;
  }
}

/** How heartbroken person i is now: their last heartbreak, decaying exponentially, so it fades to
 *  about a third after HEARTBREAK_TIME seconds. */
function heartbreak(i: number): number {
  const p = people[i];
  return p.hurt === 0 ? 0 : p.hurt * Math.exp(-(simTime - p.hurtAt) / HEARTBREAK_TIME);
}

/** How fast someone turns away from walls (and the info box's corner) closer than WALL_SIGHT:
 *  toward the direction pointing away from them, faster when closer and when heading at them. */
function wallTurn(p: Person): number {
  let awayX = 0, awayY = 0;
  const near = (d: number) => Math.max(0, 1 - d / WALL_SIGHT);
  awayX += near(p.x) - near(width - p.x);
  awayY += near(p.y) - near(height - p.y);
  if (p.x > boxLeft - WALL_SIGHT && p.y < boxBottom + WALL_SIGHT) {
    // Away from the box: left out of its left side, or down out of its bottom, whichever is nearer.
    const dx = boxLeft - p.x, dy = p.y - boxBottom;
    if (dx > dy) awayX -= near(Math.max(0, dx)); else awayY += near(Math.max(0, dy));
  }
  const strength = Math.hypot(awayX, awayY);
  if (strength === 0) return 0;
  const hx = Math.cos(p.heading), hy = Math.sin(p.heading);
  const ax = awayX / strength, ay = awayY / strength;
  if (hx * ax + hy * ay > 0.3) return 0; // Already heading away
  // Turn toward the away direction, the shorter way around (cross product's sign).
  const side = hx * ay - hy * ax >= 0 ? 1 : -1;
  return side * WALL_TURN * Math.min(1, strength);
}

/** A couple wanders in its first partner's direction; before partners change, everyone takes on
 *  the direction they've been following, so nobody's direction jumps. */
function adoptCoupleHeading(k: number): void {
  const partner = people[k].partner;
  if (partner < 0) return;
  const lead = people[Math.min(k, partner)];
  people[k].heading = lead.heading;
  people[k].turn = lead.turn;
}

/** i and j pair up, leaving their partners. */
function pairUp(i: number, j: number): void {
  for (const k of [i, j, people[i].partner, people[j].partner]) if (k >= 0) adoptCoupleHeading(k);
  // The new couple sets off in the average of the two directions, so neither turns suddenly.
  const lead = people[Math.min(i, j)], a = people[i], b = people[j];
  lead.heading = Math.atan2(Math.sin(a.heading) + Math.sin(b.heading), Math.cos(a.heading) + Math.cos(b.heading));
  lead.turn = (a.turn + b.turn) / 2;
  for (const k of [i, j]) {
    const old = people[k].partner;
    if (old < 0) continue;
    people[old].partner = -1;
    people[old].changed = simTime;
    // Being left hurts; heartbreaks add up.
    people[old].hurt = heartbreak(old) + 1;
    people[old].hurtAt = simTime;
    breakups++;
    lastBreakup = simTime;
    effects.push({ x: people[old].x, y: people[old].y, t: simTime, kind: 'dumped', who: old });
  }
  if (history[history.length - 1][1] !== breakups) history.push([simTime, breakups]);
  people[i].partner = j;
  people[j].partner = i;
  people[i].since = people[j].since = simTime;
  people[i].changed = people[j].changed = simTime;
  effects.push({ x: (people[i].x + people[j].x) / 2, y: (people[i].y + people[j].y) / 2, t: simTime, kind: 'heart', who: i });
  pairsChanged = true;
  matrixDirty = true;
  recordHappiness();
}

// ── Who wants whom ─────────────────────────────────────────────────
// Flat n×n arrays, rebuilt once per frame (loyalty can change with time) and after each change of
// partner, so the inner loops don't call partnerValue or canPair.
//   want[i·n + j]:   1 if i would rather be with j than with i's partner.
//   weight[i·n + j]: how strongly i is pulled toward j: how much more attractive j is than i's
//                    partner (for a single person, how attractive j is).
let want = new Uint8Array(0);
let weight = new Float32Array(0);
let matrixDirty = true;

function updateMatrices(): void {
  const n = people.length;
  if (want.length !== n * n) { want = new Uint8Array(n * n); weight = new Float32Array(n * n); }
  for (let i = 0; i < n; i++) {
    const value = partnerValue(i);
    const floor = value === -Infinity ? 0 : value;
    const row = live[i];
    const partner = people[i].partner;
    for (let j = 0; j < n; j++) {
      const k = i * n + j;
      if (j === i || j === partner || !canPair(i, j)) { want[k] = 0; weight[k] = 0; continue; }
      want[k] = row[j] > 0 && row[j] > value ? 1 : 0;
      weight[k] = row[j] > 0 ? Math.max(0, row[j] - floor) : 0;
    }
  }
  matrixDirty = false;
}

/** Whether i and j would each rather be with the other than with their partners. */
function isBlocking(i: number, j: number): boolean {
  if (matrixDirty) updateMatrices();
  const n = people.length;
  return want[i * n + j] === 1 && want[j * n + i] === 1;
}

function blockingPairs(): [number, number][] {
  if (matrixDirty) updateMatrices();
  const n = people.length;
  const pairs: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) if (want[i * n + j] && want[j * n + i]) pairs.push([i, j]);
  }
  return pairs;
}

/** How merged couple i is drawn, from −1 (bored: barely touching) through 0 (no loyalty) to 1
 *  (loyal: nearly one blob), from the loyalty added to the attraction to a partner. */
function bond(i: number): number {
  const p = people[i].partner;
  if (p < 0) return 0;
  if (settings.loyalty === 'absolute') return 1;
  const extra = (k: number, partner: number) => partnerValue(k) - live[k][partner];
  const mean = (extra(i, p) + extra(p, i)) / 2;
  return Math.max(-1, Math.min(1, mean / 0.5)); // A boost of 0.5 looks fully merged.
}

/** The distance partners settle at, closer for more loyal couples. */
function pairDistance(i: number): number {
  const b = bond(i);
  return b >= 0 ? PAIR_DIST + (PAIR_DIST_LOYAL - PAIR_DIST) * b : PAIR_DIST + (PAIR_DIST - PAIR_DIST_BORED) * b;
}

// ── Motion ─────────────────────────────────────────────────────────
let dragged = -1;                     // Index of the person being dragged, or −1.
let dragX = 0, dragY = 0;             // Where the pointer is (CSS px).

// Scratch arrays for step, reused rather than allocated every step.
let ax = new Float64Array(0), ay = new Float64Array(0);
let sx = new Float64Array(0), sy = new Float64Array(0), total = new Float64Array(0);
let calm = new Uint8Array(0); // 1 for people in a happy couple (neither partner wants anyone else)

function step(dt: number): void {
  const n = people.length;
  if (matrixDirty) updateMatrices();
  if (ax.length !== n) {
    ax = new Float64Array(n); ay = new Float64Array(n);
    sx = new Float64Array(n); sy = new Float64Array(n); total = new Float64Array(n); calm = new Uint8Array(n);
  } else {
    ax.fill(0); ay.fill(0); sx.fill(0); sy.fill(0); total.fill(0);
  }
  const meetings: [number, number, number][] = [];
  const ready = people.map(p => simTime - p.changed >= COOLDOWN);
  // Each pair once: pulls toward wanted people, pushes apart, and meetings.
  for (let i = 0; i < n; i++) {
    const p = people[i];
    for (let j = i + 1; j < n; j++) {
      const q = people[j];
      const dx = q.x - p.x, dy = q.y - p.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1e-6;
      const ux = dx / d, uy = dy / d;
      // People pull harder toward people who want them back (a blocking pair) than toward crushes.
      const mutual = want[i * n + j] === 1 && want[j * n + i] === 1 ? 1 : CRUSH_SHARE;
      const wij = weight[i * n + j] * mutual, wji = weight[j * n + i] * mutual;
      // total adds the unscaled weights, so a pull toward crushes alone stays weak after the pull
      // is normalized below (it would otherwise be scaled back up to a full pull).
      if (wij > 0) { sx[i] += wij * ux; sy[i] += wij * uy; total[i] += weight[i * n + j]; }
      if (wji > 0) { sx[j] -= wji * ux; sy[j] -= wji * uy; total[j] += weight[j * n + i]; }
      if (p.partner === j || d >= SPACE) continue;
      // Everyone keeps from bumping into others, and keeps their distance from people they don't want.
      const sep = d < SEPARATION ? PUSH * (1 - d / SEPARATION) ** 2 : 0;
      const space = SPACE_PUSH * (1 - d / SPACE);
      const pushI = sep + (weight[i * n + j] === 0 ? space : 0), pushJ = sep + (weight[j * n + i] === 0 ? space : 0);
      ax[i] -= pushI * ux; ay[i] -= pushI * uy;
      ax[j] += pushJ * ux; ay[j] += pushJ * uy;
      if (d < MEET_DIST && ready[i] && ready[j]) meetings.push([d, i, j]);
    }
  }
  for (let i = 0; i < n; i++) {
    const p = people[i];
    // The pull saturates: wanting someone 0.1 more than one's partner is already a full pull.
    const scale = DESIRE / Math.max(total[i], 0.1);
    // A heartbroken person mopes: their pull toward others is weaker until the heartbreak fades.
    const mope = 1 - HEARTBREAK_MOPE * Math.min(1, heartbreak(i));
    sx[i] *= scale * mope; // Now the pull toward wanted people (px/s²), added to ax and ay below.
    sy[i] *= scale * mope;
    // A couple wanders together, in the direction of its first partner (by index), so the two
    // partners aren't pushed different ways (see pairUp for how the direction carries over).
    const lead = p.partner >= 0 ? people[Math.min(i, p.partner)] : p;
    if (lead === p) {
      // The turning rate wanders (it is pulled back toward 0 while random kicks push it around),
      // and the heading follows it, so the wandering direction turns in smooth arcs.
      p.turn += (-TURN_RETURN * p.turn) * dt + (Math.random() - 0.5) * TURN * Math.sqrt(12 * dt);
      p.heading += (p.turn + wallTurn(p)) * dt;
    }
    // Wandering, and a small pull toward the middle that grows with distance from it. Happy
    // people (paired, and wanting nobody else) don't feel the pull, so they drift out of the way
    // of people who are still looking.
    const happy = p.partner >= 0 && total[i] === 0;
    calm[i] = happy && total[p.partner] === 0 ? 1 : 0; // A happy couple
    const center = happy ? 0 : CENTER;
    const wander = WANDER * (calm[i] ? HAPPY_WANDER : 1);
    ax[i] += (center * (width / 2 - p.x)) / (width / 2) + wander * Math.cos(lead.heading);
    ay[i] += (center * (height / 2 - p.y)) / (height / 2) + wander * Math.sin(lead.heading);
    if (p.x < WALL) ax[i] += (SPACE_PUSH * 4 * (WALL - p.x)) / WALL;
    if (p.x > width - WALL) ax[i] -= (SPACE_PUSH * 4 * (p.x - width + WALL)) / WALL;
    if (p.y < WALL) ay[i] += (SPACE_PUSH * 4 * (WALL - p.y)) / WALL;
    if (p.y > height - WALL) ay[i] -= (SPACE_PUSH * 4 * (p.y - height + WALL)) / WALL;
    // Keep out of the info box's corner, like a wall: push out through its nearer side.
    if (boxLeft < width) {
      const inX = p.x - (boxLeft - WALL), inY = boxBottom + WALL - p.y;
      if (inX > 0 && inY > 0) {
        if (inX < inY) ax[i] -= (SPACE_PUSH * 4 * Math.min(inX, WALL)) / WALL;
        else ay[i] += (SPACE_PUSH * 4 * Math.min(inY, WALL)) / WALL;
      }
    }
  }
  // Partners share their pushes, so a couple moves as one. A couple follows its more eager
  // partner's pull: averaging the pulls would let two partners who want people in opposite
  // directions hold the couple still, so their blocking pairs could never meet.
  for (let i = 0; i < n; i++) {
    const j = people[i].partner;
    if (j < i) continue;
    const mx = (ax[i] + ax[j]) / 2, my = (ay[i] + ay[j]) / 2;
    ax[i] = (ax[i] + mx) / 2; ay[i] = (ay[i] + my) / 2;
    ax[j] = (ax[j] + mx) / 2; ay[j] = (ay[j] + my) / 2;
    // Eagerness rises and falls slowly (each person at their own phase), so partners take turns
    // leading and a pair that the leaders keep apart eventually meets.
    const eager = (k: number) => Math.hypot(sx[k], sy[k]) * (1 + 0.8 * Math.sin(0.6 * simTime + 2.4 * k));
    const k = eager(i) >= eager(j) ? i : j;
    sx[i] = sx[j] = sx[k];
    sy[i] = sy[j] = sy[k];
  }
  for (let i = 0; i < n; i++) { ax[i] += sx[i]; ay[i] += sy[i]; }
  const keep = Math.exp(-DRAG * dt), keepCalm = Math.exp(-(DRAG + HAPPY_DRAG) * dt);
  for (let i = 0; i < n; i++) {
    const p = people[i];
    const k = calm[i] ? keepCalm : keep;
    p.vx = (p.vx + ax[i] * dt) * k;
    p.vy = (p.vy + ay[i] * dt) * k;
    const speed = Math.hypot(p.vx, p.vy);
    if (speed > MAX_SPEED) { p.vx *= MAX_SPEED / speed; p.vy *= MAX_SPEED / speed; }
  }
  // Partners move together: their velocities approach their average.
  const blend = 1 - Math.exp(-6 * dt);
  for (let i = 0; i < n; i++) {
    const j = people[i].partner;
    if (j < i) continue;
    const a = people[i], b = people[j];
    const mvx = (a.vx + b.vx) / 2, mvy = (a.vy + b.vy) / 2;
    a.vx += (mvx - a.vx) * blend; a.vy += (mvy - a.vy) * blend;
    b.vx += (mvx - b.vx) * blend; b.vy += (mvy - b.vy) * blend;
  }
  for (const p of people) { p.x += p.vx * dt; p.y += p.vy * dt; }
  if (dragged >= 0) {
    const p = people[dragged];
    p.vx = (dragX - p.x) / Math.max(dt, 1e-3) * 0.3;
    p.vy = (dragY - p.y) / Math.max(dt, 1e-3) * 0.3;
    p.x = dragX;
    p.y = dragY;
  }
  // Partners glide toward their pair distance apart rather than jumping there, so a new couple merges
  // smoothly (the dragged person stays under the pointer).
  const ease = dt === 0 ? 0.2 : 1 - Math.exp(-PAIR_RATE * dt);
  for (let i = 0; i < n; i++) {
    const j = people[i].partner;
    if (j < i) continue;
    const a = people[i], b = people[j];
    const dx = b.x - a.x, dy = b.y - a.y;
    const d = Math.hypot(dx, dy) || 1e-6;
    const err = (d - pairDistance(i)) * ease;
    const shareA = i === dragged ? 0 : j === dragged ? 1 : 0.5;
    const shareB = 1 - shareA;
    a.x += (shareA * err * dx) / d; a.y += (shareA * err * dy) / d;
    b.x -= (shareB * err * dx) / d; b.y -= (shareB * err * dy) / d;
  }
  for (const p of people) {
    if (p.x < RADIUS) { p.x = RADIUS; p.vx = Math.abs(p.vx); }
    if (p.x > width - RADIUS) { p.x = width - RADIUS; p.vx = -Math.abs(p.vx); }
    if (p.y < RADIUS) { p.y = RADIUS; p.vy = Math.abs(p.vy); }
    if (p.y > height - RADIUS) { p.y = height - RADIUS; p.vy = -Math.abs(p.vy); }
  }
  simTime += dt;
  // Meetings: the closest blocking pairs pair up first.
  meetings.sort((m, k) => m[0] - k[0]);
  for (const [, i, j] of meetings) {
    if (simTime - people[i].changed >= COOLDOWN && simTime - people[j].changed >= COOLDOWN && isBlocking(i, j)) pairUp(i, j);
  }
}

// ── Drawing the people ─────────────────────────────────────────────
const canvas = $<HTMLCanvasElement>('sp-canvas');
const ctx = canvas.getContext('2d')!;

/** Sizes the canvas and chooses the zoom: larger when each person has more room. People keep
 *  their places on the screen. */
function resizeCanvas(): void {
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 10 || rect.height < 10) return;
  const dpr = window.devicePixelRatio || 1;
  const perPerson = (rect.width * rect.height) / Math.max(1, settings.count);
  const newZoom = Math.min(MAX_ZOOM, Math.max(1, Math.sqrt(perPerson / AREA_PER_PERSON)));
  const rescale = zoom / newZoom;
  zoom = newZoom;
  width = rect.width / zoom;
  height = rect.height / zoom;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr * zoom, 0, 0, dpr * zoom, 0, 0);
  // The box is 19rem wide and about 12.5rem tall for a couple, 0.5rem in from the plot's corner
  // (see .sp-tooltip); the theme's rem varies with the window's width.
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const boxWidth = 20 * rem, boxHeight = 13.5 * rem;
  const boxInside = !window.matchMedia('(max-width: 700px)').matches && rect.width > 2 * boxWidth;
  boxLeft = boxInside ? (rect.width - boxWidth) / zoom : Infinity;
  boxBottom = boxHeight / zoom;
  for (const p of people) {
    p.x = Math.min(Math.max(p.x * rescale, RADIUS), width - RADIUS);
    p.y = Math.min(Math.max(p.y * rescale, RADIUS), height - RADIUS);
  }
}

function heart(x: number, y: number, size: number, outline = false): void {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.35);
  ctx.bezierCurveTo(x - size * 1.1, y - size * 0.35, x - size * 0.45, y - size * 1.05, x, y - size * 0.45);
  ctx.bezierCurveTo(x + size * 0.45, y - size * 1.05, x + size * 1.1, y - size * 0.35, x, y + size * 0.35);
  if (outline) ctx.stroke();
  else ctx.fill();
}

function arrow(x0: number, y0: number, x1: number, y1: number): void {
  const d = Math.hypot(x1 - x0, y1 - y0);
  if (d < 2 * RADIUS + 6) return;
  const ux = (x1 - x0) / d, uy = (y1 - y0) / d;
  const sx = x0 + ux * (RADIUS + 2), sy = y0 + uy * (RADIUS + 2);
  const ex = x1 - ux * (RADIUS + 3), ey = y1 - uy * (RADIUS + 3);
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ex, ey);
  ctx.lineTo(ex - ux * 7 - uy * 4, ey - uy * 7 + ux * 4);
  ctx.lineTo(ex - ux * 7 + uy * 4, ey - uy * 7 - ux * 4);
  ctx.closePath();
  ctx.fill();
}

/** Fills the neck joining two circles of radius r, so that with the circles it looks like two
 *  merging metaballs. Each side of the neck is a cubic Bézier curve leaving each circle along its
 *  tangent (after Hiroyuki Sato's 2D metaball construction). Returns false if the circles are too
 *  far apart to join. */
function metaballNeck(x1: number, y1: number, x2: number, y2: number, r: number, fill: string | CanvasGradient, spread = 0.5): boolean {
  const d = Math.hypot(x2 - x1, y2 - y1);
  // spread: how far around each circle the neck attaches (0 to 1); wider looks more merged.
  const handle = 2.4;         // Length of the curves' handles, relative to the radius.
  if (d > 6 * r || d < 1e-6) return d < 1e-6;
  const u = d < 2 * r ? Math.acos(d / (2 * r)) : 0; // Where the circles overlap.
  const base = Math.atan2(y2 - y1, x2 - x1);
  const maxSpread = Math.PI / 2;
  const a1 = base + u + (maxSpread - u) * spread;
  const a2 = base - u - (maxSpread - u) * spread;
  const a3 = base + Math.PI - u - (Math.PI - u - maxSpread) * spread;
  const a4 = base - Math.PI + u + (Math.PI - u - maxSpread) * spread;
  const at = (x: number, y: number, a: number, len: number) => [x + len * Math.cos(a), y + len * Math.sin(a)];
  const p1 = at(x1, y1, a1, r), p2 = at(x1, y1, a2, r), p3 = at(x2, y2, a3, r), p4 = at(x2, y2, a4, r);
  const h = Math.min(spread * handle, Math.hypot(p3[0] - p1[0], p3[1] - p1[1]) / (2 * r)) * Math.min(1, d / r) * r;
  const h1 = at(p1[0], p1[1], a1 - Math.PI / 2, h), h2 = at(p2[0], p2[1], a2 + Math.PI / 2, h);
  const h3 = at(p3[0], p3[1], a3 + Math.PI / 2, h), h4 = at(p4[0], p4[1], a4 - Math.PI / 2, h);
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.bezierCurveTo(h1[0], h1[1], h3[0], h3[1], p3[0], p3[1]);
  ctx.lineTo(p4[0], p4[1]);
  ctx.bezierCurveTo(h4[0], h4[1], h2[0], h2[1], p2[0], p2[1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  return true;
}

function draw(blocking: [number, number][]): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  const n = people.length;

  // Crushes: an arrow from each person toward the person they're pulled toward most.
  if (settings.showCrushes) {
    ctx.strokeStyle = ctx.fillStyle = CRUSH_COLOR;
    ctx.lineWidth = 1.2;
    for (let i = 0; i < n; i++) {
      let best = -1, bestPull = 0;
      for (let j = 0; j < n; j++) {
        const w = weight[i * n + j];
        if (w > bestPull) { bestPull = w; best = j; }
      }
      if (best < 0) continue;
      ctx.globalAlpha = 0.35 + 0.65 * Math.min(1, bestPull / 0.3);
      arrow(people[i].x, people[i].y, people[best].x, people[best].y);
    }
    ctx.globalAlpha = 1;
  }

  // Blocking pairs: dashed lines between people who would leave their partners for each other.
  if (settings.showBlocking) {
    ctx.strokeStyle = BLOCKING_COLOR;
    // Fainter when there are many, so the people stay visible. Dashes are slow to draw, so many
    // lines are drawn solid and thin.
    const many = blocking.length > 40;
    ctx.lineWidth = many ? 1 : 2;
    ctx.globalAlpha = Math.min(1, Math.max(0.15, 6 / Math.sqrt(blocking.length + 1)));
    ctx.setLineDash(many ? [] : [6, 5]);
    ctx.beginPath(); // One path for all the lines: much faster than a stroke per line.
    for (const [i, j] of blocking) {
      ctx.moveTo(people[i].x, people[i].y);
      ctx.lineTo(people[j].x, people[j].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }

  // Couples: partners merge into one blob, like metaballs (the dots are drawn over the neck below).
  for (let i = 0; i < n; i++) {
    const j = people[i].partner;
    if (j < i) continue;
    const a = people[i], b = people[j];
    const ci = GROUP_COLORS[groupOf(i)], cj = GROUP_COLORS[groupOf(j)];
    let fill: string | CanvasGradient = ci;
    if (ci !== cj) {
      fill = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      fill.addColorStop(0.45, ci);
      fill.addColorStop(0.55, cj);
    }
    // More loyal couples are drawn more merged: closer (see pairDistance) with a wider neck.
    const spread = 0.5 + 0.4 * bond(i);
    if (!metaballNeck(a.x, a.y, b.x, b.y, RADIUS + 1.25, fill, spread)) {
      // Too far apart for a neck (while being dragged): a line instead.
      ctx.strokeStyle = COUPLE_COLOR;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }

  // Effects: a heart that rises and fades when a couple forms, and a fading gray ring around
  // someone who was left.
  effects = effects.filter(e => simTime - e.t < 1.2);
  for (const e of effects) {
    const age = (simTime - e.t) / 1.2;
    ctx.globalAlpha = 1 - age;
    if (e.kind === 'heart') {
      ctx.fillStyle = HEART_COLOR;
      heart(e.x, e.y - 30 * age, 8 + 10 * age);
    } else {
      const p = people[e.who];
      ctx.strokeStyle = '#5f6368';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, RADIUS + 4 + 18 * age, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // People: filled if paired, hollow if single.
  ctx.font = PAIR_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < n; i++) {
    const p = people[i];
    const g = groupOf(i);
    const single = p.partner < 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = single ? '#fff' : GROUP_COLORS[g];
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = GROUP_COLORS[g];
    ctx.stroke();
    ctx.fillStyle = single ? (g === 1 ? '#8a5a00' : GROUP_COLORS[g]) : GROUP_TEXT[g];
    const font = name(i).length > 1 ? SMALL_FONT : PAIR_FONT;
    if (ctx.font !== font) ctx.font = font;
    // Heartbroken people are grayed out until the heartbreak fades.
    const hurt = Math.min(1, heartbreak(i));
    if (hurt > 0.02) {
      ctx.globalAlpha = 0.6 * hurt;
      ctx.fillStyle = HURT_COLOR;
      ctx.beginPath();
      ctx.arc(p.x, p.y, RADIUS + 1.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = single ? (g === 1 ? '#8a5a00' : GROUP_COLORS[g]) : GROUP_TEXT[g];
      if (hurt > 0.3) ctx.fillStyle = '#fff';
    }
    ctx.fillText(name(i), p.x, p.y + 0.5);
  }

  // A ring around the person (and partner) whose info is shown; a thicker one when followed.
  const focus = shown();
  if (focus >= 0) {
    ctx.strokeStyle = '#202124';
    ctx.lineWidth = focus === followed ? 2.5 : 1.5;
    for (const k of [focus, people[focus].partner]) {
      if (k < 0) continue;
      ctx.beginPath();
      ctx.arc(people[k].x, people[k].y, RADIUS + 4, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  // Hearts between partners, drawn over the dots' edges.
  ctx.fillStyle = HEART_COLOR;
  for (let i = 0; i < n; i++) {
    const j = people[i].partner;
    if (j < i) continue;
    // The heart's size shows how attracted the partners are to each other right now (their mean).
    const mutual = (live[i][j] + live[j][i]) / 2;
    const hx = (people[i].x + people[j].x) / 2, hy = (people[i].y + people[j].y) / 2 + 1;
    heart(hx, hy, 3 + 8 * mutual);
    // With fluctuation or proximity, an outline heart shows their usual attraction, so the solid
    // heart's growing or shrinking against it shows the change.
    const usual = (attraction[i][j] + attraction[j][i]) / 2;
    if (live !== attraction) { // Shown whenever attractions can change, even when equal to usual, so it doesn't flicker.
      // A black outline fixed at the usual size, with the solid heart growing and shrinking
      // behind it.
      ctx.strokeStyle = '#202124';
      ctx.lineWidth = 1.25;
      heart(hx, hy, 3 + 8 * usual, true);
    }
  }
}

// ── Graphs over time ───────────────────────────────────────────────
interface Graph { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; width: number; height: number }

function makeGraph(id: string): Graph {
  const canvas = $<HTMLCanvasElement>(id);
  return { canvas, ctx: canvas.getContext('2d')!, width: 600, height: 160 };
}
const breakupGraph = makeGraph('sp-graph');
const happyGraph = makeGraph('sp-happy-graph');

function resizeGraph(g: Graph): void {
  const rect = g.canvas.getBoundingClientRect();
  if (rect.width < 10) return;
  const dpr = window.devicePixelRatio || 1;
  g.width = rect.width;
  g.height = rect.height;
  g.canvas.width = Math.round(g.width * dpr);
  g.canvas.height = Math.round(g.height * dpr);
  g.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
const resizeGraphs = () => { resizeGraph(breakupGraph); resizeGraph(happyGraph); };

/** A "nice" tick spacing (1, 2, or 5 times a power of ten) giving about `count` ticks. */
function niceStep(span: number, count: number): number {
  const raw = span / count;
  const p = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 5, 10].map(m => m * p).find(s => s >= raw) ?? 10 * p;
}

/** Draws a step function of (time, value) points against time, from 0 to the current time,
 *  with an optional dashed reference line. The y-axis runs from 0 to above the largest value. */
function drawSteps(g: Graph, points: [number, number][], reference: number | null, integer: boolean, until = simTime, dashedFrom = Infinity): void {
  const ctx = g.ctx;
  const left = 40, right = 12, top = 8, bottom = 30;
  const w = g.width - left - right, h = g.height - top - bottom;
  const tMax = Math.max(30, simTime);
  // Room above the line, rounded up to a tick.
  let low = 0, high = reference ?? 0;
  for (const [, v] of points) { if (v < low) low = v; if (v > high) high = v; }
  let top_ = high * 1.1 - low * 0.1;
  if (integer) top_ += 1;
  const yStep = integer ? Math.max(1, niceStep(Math.max(top_ - low, 4), 4)) : niceStep(Math.max(top_ - low, 1), 4);
  const yMax = Math.max(integer ? 4 : 1, Math.ceil(top_ / yStep) * yStep);
  const yMin = Math.floor(low / yStep) * yStep; // Below 0 only for values below 0.
  const xs = (t: number) => left + (t / tMax) * w;
  const ys = (v: number) => top + h - ((v - yMin) / (yMax - yMin)) * h;
  ctx.clearRect(0, 0, g.width, g.height);
  ctx.font = '12px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.fillStyle = '#5f6368';
  ctx.strokeStyle = 'rgba(128, 128, 128, 0.25)';
  ctx.lineWidth = 1;
  // Grid lines and tick labels.
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const decimals = yStep < 1 ? Math.ceil(-Math.log10(yStep)) : 0;
  for (let v = yMin; v <= yMax + 1e-9; v += yStep) {
    ctx.beginPath(); ctx.moveTo(left, ys(v)); ctx.lineTo(left + w, ys(v)); ctx.stroke();
    ctx.fillText((Math.abs(v) < 1e-9 ? 0 : v).toFixed(decimals), left - 6, ys(v));
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const tStep = niceStep(tMax, 6);
  for (let t = 0; t <= tMax + 1e-9; t += tStep) ctx.fillText(String(Math.round(t)), xs(t), top + h + 5);
  ctx.fillText('time (s)', left + w / 2, top + h + 17);
  if (reference !== null) {
    ctx.strokeStyle = REFERENCE_COLOR;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(left, ys(reference)); ctx.lineTo(left + w, ys(reference)); ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = 2;
  // Solid up to dashedFrom, and dashed after it (for values that may still change).
  ctx.beginPath();
  ctx.moveTo(xs(0), ys(points[0][1]));
  let prev = points[0][1];
  let dashed = false;
  const toDashed = (t: number) => {
    ctx.lineTo(xs(t), ys(prev));
    ctx.stroke();
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(xs(t), ys(prev));
    dashed = true;
  };
  for (const [t, v] of points) {
    if (!dashed && t >= dashedFrom) toDashed(dashedFrom);
    ctx.lineTo(xs(t), ys(prev));
    ctx.lineTo(xs(t), ys(v));
    prev = v;
  }
  if (!dashed && until > dashedFrom) toDashed(dashedFrom);
  ctx.lineTo(xs(until), ys(prev));
  ctx.stroke();
  ctx.setLineDash([]);
}

// ── Happiness ──────────────────────────────────────────────────────
// The graph records the parts of the total happiness at each moment, and the happiness settings
// (which don't affect the people's motion) combine them when the graph is drawn, so changing a
// setting redraws the whole history.
interface HappyParts {
  attraction: number; // Sum, over everyone with a partner, of their current attraction to them.
  hurt: number;       // Sum of everyone's current heartbreak.
  singles: number;    // Number of single people.
  loyalty: number;    // Sum, over everyone with a partner, of what loyalty adds to the attraction.
}

function happyParts(partner: number[], withPeople: boolean): HappyParts {
  const parts = { attraction: 0, hurt: 0, singles: 0, loyalty: 0 };
  partner.forEach((j, i) => {
    if (j < 0) { parts.singles++; return; }
    parts.attraction += live[i][j];
    // Never leaving counts as a loyalty of 1.
    if (withPeople) parts.loyalty += Math.min(1, partnerValue(i) - live[i][j]);
  });
  if (withPeople) for (let i = 0; i < people.length; i++) parts.hurt += heartbreak(i);
  return parts;
}

/** Total happiness from its parts, with the happiness settings. */
function happyValue(p: HappyParts): number {
  return p.attraction + settings.singleJoy * p.singles - settings.hurtCost * p.hurt
    + (settings.countLoyalty ? p.loyalty : 0);
}

let happyHistory: [number, HappyParts][] = [];
/** Records the happiness when the pairing changes, and every SAMPLE seconds as heartbreaks fade
 *  and attractions change. */
const SAMPLE = 0.25;
function recordHappiness(): void {
  const parts = happyParts(people.map(p => p.partner), true);
  const last = happyHistory[happyHistory.length - 1];
  if (last && simTime - last[0] < SAMPLE) {
    if (happyValue(last[1]) === happyValue(parts) && last[1].singles === parts.singles) return;
    if (last[0] === simTime) happyHistory.pop();
  }
  happyHistory.push([simTime, parts]);
}

/** Breakups per minute in fixed bins of RATE_BIN seconds (0–5 s, 5–10 s, …), as a step function up
 *  to now. Fixed bins don't change once complete, so only the end of the graph changes (a sliding
 *  window would make the whole line flutter). The current bin counts its breakups so far over the
 *  whole bin, so it starts at 0 and steps up with each breakup. A rate also shows changes that the
 *  running total hides once it is large. */
const RATE_BIN = 5;
function breakupRate(): [number, number][] {
  const bins = Math.floor(simTime / RATE_BIN) + 1; // Including the current bin
  const counts = Array<number>(bins).fill(0);
  // history holds (time, breakups so far) at each breakup, in time order.
  for (let k = 1; k < history.length; k++) {
    const bin = Math.floor(history[k][0] / RATE_BIN);
    if (bin < bins) counts[bin] += history[k][1] - history[k - 1][1];
  }
  return counts.map((c, k) => [k * RATE_BIN, (c / RATE_BIN) * 60]);
}

function drawGraphs(): void {
  // The current bin is still counting, so it's dashed.
  drawSteps(breakupGraph, breakupRate(), null, false, simTime, Math.floor(simTime / RATE_BIN) * RATE_BIN);
  const points = happyHistory.map(([t, p]): [number, number] => [t, happyValue(p)]);
  if (points.length === 0) points.push([0, 0]);
  // The stable pairing's happiness, with no heartbreak or loyalty.
  const reference = stableFound ? happyValue(happyParts(stableFound, false)) : null;
  drawSteps(happyGraph, points, reference, false);
}

// ── Status ─────────────────────────────────────────────────────────
const statusBreakups = $('sp-breakups');
const statusSince = $('sp-since');
const statusBlocking = $('sp-blocking');
const statusStable = $('sp-stable');

function updateStatus(blocking: [number, number][] = blockingPairs()): void {
  statusBreakups.textContent = String(breakups);
  statusSince.textContent = lastBreakup < 0 ? '—' : `${(simTime - lastBreakup).toFixed(1)} s`;
  const shown = blocking.slice(0, 8).map(([i, j]) => `${name(i)}–${name(j)}`).join(', ');
  statusBlocking.textContent = blocking.length === 0 ? 'none'
    : blocking.length <= 8 ? shown
    : `${blocking.length} (${shown}, …)`;
  statusStable.hidden = blocking.length > 0;
}

// ── Does a stable pairing exist? ───────────────────────────────────
const existence = $('sp-existence');
let stableFound: number[] | null = null;

function updateExistence(): void {
  stableFound = stablePairing(attraction, canPair);
  const ignored = [settings.loyalty !== 'none' ? 'loyalty' : '', settings.fluctuation > 0 ? 'fluctuation' : '', settings.proximity > 0 ? 'proximity' : ''].filter(Boolean);
  const list = ignored.length < 3 ? ignored.join(' and ') : `${ignored.slice(0, 2).join(', ')}, and ${ignored[2]}`;
  const note = ignored.length === 0 ? '' : ` (ignoring ${list})`;
  existence.replaceChildren();
  if (stableFound) {
    const s = stableFound;
    const couples = s.map((j, i) => (i < j ? `${name(i)}–${name(j)}` : '')).filter(Boolean).join(', ');
    const singles = s.map((j, i) => (j < 0 ? name(i) : '')).filter(Boolean);
    const alone = singles.length === 0 ? '' : `, with ${singles.join(', ')} single`;
    existence.append(`A stable pairing exists for these attractions${note}: ${couples || 'nobody paired'}${alone}. `);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Pair them this way';
    button.addEventListener('click', () => applyPairing(s));
    existence.append(button);
  } else {
    existence.append(`No pairing is stable for these attractions${note}: in every pairing, two people would rather be with each other than with their partners.`);
  }
}

/** Pairs everyone as given, placing each person next to their partner. */
function applyPairing(partner: number[]): void {
  partner.forEach((j, i) => {
    people[i].partner = j;
    if (j < 0) return;
    people[i].since = simTime;
    if (i < j) {
      const angle = Math.random() * 2 * Math.PI;
      people[j].x = people[i].x + pairDistance(i) * Math.cos(angle);
      people[j].y = people[i].y + pairDistance(i) * Math.sin(angle);
    }
  });
  pairsChanged = true;
  matrixDirty = true;
  recordHappiness();
  updateStatus();
}

// ── Attraction table ───────────────────────────────────────────────
const table = $<HTMLTableElement>('sp-matrix');
let cells: (HTMLInputElement | null)[][] = [];

function cellColor(v: number): string {
  return v > 0 ? `rgba(120, 140, 170, ${(0.08 + 0.55 * v).toFixed(3)})` : 'transparent';
}

function buildTable(): void {
  const n = settings.count;
  table.replaceChildren();
  // A table for more than MAX_TABLE people is too large to read (and slow), so it's hidden.
  const tooLarge = n > MAX_TABLE;
  $('sp-matrix-wrap').hidden = tooLarge;
  $('sp-matrix-hidden').hidden = !tooLarge;
  if (tooLarge) { cells = []; pairsChanged = true; return; }
  cells = [];
  const head = table.createTHead().insertRow();
  const corner = document.createElement('th');
  corner.className = 'sp-corner';
  corner.innerHTML = '<span>toward →</span><span>who ↓</span>';
  head.append(corner);
  for (let j = 0; j < n; j++) {
    const th = document.createElement('th');
    th.textContent = name(j);
    th.style.color = GROUP_COLORS[groupOf(j)];
    head.append(th);
  }
  const body = table.createTBody();
  for (let i = 0; i < n; i++) {
    const row = body.insertRow();
    const th = document.createElement('th');
    th.textContent = name(i);
    th.style.color = GROUP_COLORS[groupOf(i)];
    row.append(th);
    const rowCells: (HTMLInputElement | null)[] = [];
    for (let j = 0; j < n; j++) {
      const td = row.insertCell();
      if (!canPair(i, j)) {
        td.textContent = '—';
        td.className = 'sp-none';
        rowCells.push(null);
        continue;
      }
      const input = document.createElement('input');
      input.type = 'text';
      input.inputMode = 'decimal';
      input.placeholder = '0';
      input.value = attraction[i][j] > 0 ? attraction[i][j].toFixed(2) : '';
      input.setAttribute('aria-label', `${name(i)}'s attraction to ${name(j)}`);
      td.style.background = cellColor(attraction[i][j]);
      input.addEventListener('change', () => {
        const v = Number(input.value);
        if (Number.isFinite(v)) attraction[i][j] = Math.min(1, Math.max(0, Math.round(v * 100) / 100));
        input.value = attraction[i][j] > 0 ? attraction[i][j].toFixed(2) : '';
        td.style.background = cellColor(attraction[i][j]);
        settings.kind = 'custom';
        kindSel.value = 'custom';
        saveSettings();
        saveAttraction();
        updateLive();
        updateExistence();
        recordHappiness();
      });
      td.append(input);
      rowCells.push(input);
    }
    cells.push(rowCells);
  }
  marked = [];
  pairsChanged = true;
}

/** Outlines each person's attraction to their partner, touching only the cells that changed
 *  (restyling every cell of a large table is slow). */
let marked: number[] = []; // marked[i]: the column outlined in row i, or −1.
function markPartners(): void {
  if (marked.length !== cells.length) marked = Array(cells.length).fill(-1);
  cells.forEach((row, i) => {
    const now = people[i]?.partner ?? -1;
    if (marked[i] === now) return;
    if (marked[i] >= 0) row[marked[i]]?.parentElement!.classList.remove('sp-partner');
    if (now >= 0) row[now]?.parentElement!.classList.add('sp-partner');
    marked[i] = now;
  });
}

// ── Controls ───────────────────────────────────────────────────────
const countSel = $<HTMLSelectElement>('sp-count');
const pairingSel = $<HTMLSelectElement>('sp-pairing');
const kindSel = $<HTMLSelectElement>('sp-kind');
const loyaltySel = $<HTMLSelectElement>('sp-loyalty');
const speedSel = $<HTMLSelectElement>('sp-speed');
const interestSel = $<HTMLSelectElement>('sp-interest');
const fluctuationSel = $<HTMLSelectElement>('sp-fluctuation');
const proximitySel = $<HTMLSelectElement>('sp-proximity');
const hurtCostSel = $<HTMLSelectElement>('sp-hurt-cost');
const singleJoySel = $<HTMLSelectElement>('sp-single-joy');
const countLoyaltyBox = $<HTMLInputElement>('sp-count-loyalty');
HURT_COSTS.forEach(v => hurtCostSel.add(new Option(v === 0 ? 'None' : v.toFixed(2), String(v))));
SINGLE_JOYS.forEach(v => singleJoySel.add(new Option(v.toFixed(1), String(v))));
hurtCostSel.addEventListener('change', () => { settings.hurtCost = Number(hurtCostSel.value); saveSettings(); drawGraphs(); });
singleJoySel.addEventListener('change', () => { settings.singleJoy = Number(singleJoySel.value); saveSettings(); drawGraphs(); });
countLoyaltyBox.addEventListener('change', () => { settings.countLoyalty = countLoyaltyBox.checked; saveSettings(); drawGraphs(); });
const playButton = $<HTMLButtonElement>('sp-play');
const blockingBox = $<HTMLInputElement>('sp-show-blocking');
const crushBox = $<HTMLInputElement>('sp-show-crushes');
const sliders = {
  boost: { input: $<HTMLInputElement>('sp-boost'), out: $('sp-boost-out'), field: $('sp-boost-field'), unit: '' },
  growth: { input: $<HTMLInputElement>('sp-growth'), out: $('sp-growth-out'), field: $('sp-growth-field'), unit: ' per s' },
  growthMax: { input: $<HTMLInputElement>('sp-growth-max'), out: $('sp-growth-max-out'), field: $('sp-growth-max-field'), unit: '' },
  boredom: { input: $<HTMLInputElement>('sp-boredom'), out: $('sp-boredom-out'), field: $('sp-boredom-field'), unit: ' per s' },
};
let playing = true;

COUNTS.forEach(c => countSel.add(new Option(String(c), String(c))));
SPEEDS.forEach(s => speedSel.add(new Option(`${s}×`, String(s))));
INTERESTS.forEach(k => interestSel.add(new Option(k === 0 ? 'Everyone' : `${k} others`, String(k))));

function syncControls(): void {
  countSel.value = String(settings.count);
  pairingSel.value = settings.pairing;
  kindSel.value = settings.kind;
  loyaltySel.value = settings.loyalty;
  speedSel.value = String(settings.speed);
  interestSel.value = String(settings.interest);
  fluctuationSel.value = String(settings.fluctuation);
  proximitySel.value = String(settings.proximity);
  hurtCostSel.value = String(settings.hurtCost);
  singleJoySel.value = String(settings.singleJoy);
  countLoyaltyBox.checked = settings.countLoyalty;
  blockingBox.checked = settings.showBlocking;
  crushBox.checked = settings.showCrushes;
  for (const key of ['boost', 'growth', 'growthMax', 'boredom'] as const) {
    const s = sliders[key];
    s.input.value = String(settings[key]);
    s.out.textContent = settings[key].toFixed(2) + s.unit;
    const mode = key === 'growth' || key === 'growthMax' ? 'growing' : key;
    s.field.hidden = !(settings.loyalty === mode || (settings.loyalty === 'mixed' && key !== 'boost'));
  }
  playButton.textContent = playing ? 'Pause' : 'Play';
  playButton.setAttribute('aria-pressed', String(!playing));
}

/** New attractions for the current settings (kept if they were edited and still fit). */
function newAttractions(keepCustom: boolean): void {
  if (!(keepCustom && settings.kind === 'custom' && attraction.length === settings.count)) {
    if (settings.kind === 'custom') settings.kind = 'random';
    attraction = generate(settings.kind, settings.count, settings.seed);
  }
  saveAttraction();
  buildTable();
  updateExistence();
}

countSel.addEventListener('change', () => {
  settings.count = Number(countSel.value);
  newAttractions(false);
  restart();
  syncControls();
  saveSettings();
});
pairingSel.addEventListener('change', () => {
  settings.pairing = pairingSel.value as Pairing;
  newAttractions(true);
  restart();
  syncControls();
  saveSettings();
});
kindSel.addEventListener('change', () => {
  settings.kind = kindSel.value as Kind;
  newAttractions(true);
  restart();
  syncControls();
  saveSettings();
});
proximitySel.addEventListener('change', () => {
  settings.proximity = Number(proximitySel.value);
  updateLive();
  updateExistence();
  syncControls();
  saveSettings();
});
fluctuationSel.addEventListener('change', () => {
  settings.fluctuation = Number(fluctuationSel.value);
  updateLive();
  updateExistence();
  syncControls();
  saveSettings();
});
interestSel.addEventListener('change', () => {
  settings.interest = Number(interestSel.value);
  newAttractions(false);
  restart();
  syncControls();
  saveSettings();
});
// New attractions keeps everyone where they are, with their partners, so only who likes whom
// changes; Restart starts over with everyone single.
/** Clears the graphs and breakup count, keeping everyone where they are with their partners.
 *  Time restarts at 0, so every stored time is moved back by the same amount. */
function resetGraphs(): void {
  const shift = simTime;
  for (const p of people) { p.since -= shift; p.changed -= shift; p.hurtAt -= shift; }
  for (const e of effects) e.t -= shift;
  simTime = 0;
  breakups = 0;
  lastBreakup = -1;
  history = [[0, 0]];
  happyHistory = [];
  recordHappiness();
  updateStatus();
}

$('sp-new').addEventListener('click', () => {
  settings.seed++;
  if (settings.kind === 'custom') settings.kind = 'random';
  newAttractions(false);
  updateLive();
  matrixDirty = true;
  resetGraphs();
  syncControls();
  saveSettings();
});
loyaltySel.addEventListener('change', () => {
  settings.loyalty = loyaltySel.value as Loyalty;
  // Loyalty that grows with time starts from the moment it's chosen.
  for (const p of people) p.since = simTime;
  syncControls();
  updateExistence();
  saveSettings();
});
for (const key of ['boost', 'growth', 'growthMax', 'boredom'] as const) {
  sliders[key].input.addEventListener('input', () => {
    settings[key] = Number(sliders[key].input.value);
    syncControls();
    saveSettings();
  });
}
speedSel.addEventListener('change', () => { settings.speed = Number(speedSel.value); saveSettings(); });
blockingBox.addEventListener('change', () => { settings.showBlocking = blockingBox.checked; saveSettings(); });
crushBox.addEventListener('change', () => { settings.showCrushes = crushBox.checked; saveSettings(); });
playButton.addEventListener('click', () => { playing = !playing; syncControls(); });
$('sp-restart').addEventListener('click', restart);

// ── Examples ───────────────────────────────────────────────────────
/** The first seed from `seed` whose random attractions among `n` people do (or don't) have a
 *  stable pairing. */
function findSeed(n: number, stable: boolean): number {
  const can = (i: number, j: number) => i !== j;
  for (let seed = 1; ; seed++) {
    if ((stablePairing(generate('random', n, seed, 0), can) !== null) === stable) return seed;
  }
}

interface Example { count: number; pairing: Pairing; kind: Kind; seed?: number; matrix?: number[][]; loyalty?: Loyalty; boost?: number; growth?: number; boredom?: number }
const EXAMPLES: Record<string, () => Example> = {
  classic: () => ({ count: 4, pairing: 'anyone', kind: 'custom', matrix: CLASSIC }),
  randomNone: () => ({ count: 10, pairing: 'anyone', kind: 'random', seed: findSeed(10, false) }),
  groups: () => ({ count: 10, pairing: 'groups', kind: 'random', seed: 1 }),
  mutual: () => ({ count: 10, pairing: 'anyone', kind: 'mutual', seed: 1 }),
  shared: () => ({ count: 10, pairing: 'anyone', kind: 'shared', seed: 1 }),
  randomStable: () => ({ count: 10, pairing: 'anyone', kind: 'random', seed: findSeed(10, true) }),
  classicAbsolute: () => ({ count: 4, pairing: 'anyone', kind: 'custom', matrix: CLASSIC, loyalty: 'absolute' }),
  classicBoost: () => ({ count: 4, pairing: 'anyone', kind: 'custom', matrix: CLASSIC, loyalty: 'boost', boost: 0.35 }),
  classicGrowing: () => ({ count: 4, pairing: 'anyone', kind: 'custom', matrix: CLASSIC, loyalty: 'growing', growth: 0.1 }),
  mutualBoredom: () => ({ count: 10, pairing: 'anyone', kind: 'mutual', seed: 1, loyalty: 'boredom', boredom: 0.03 }),
};

const exampleSel = $<HTMLSelectElement>('sp-example');
exampleSel.addEventListener('change', () => {
  const make = EXAMPLES[exampleSel.value];
  exampleSel.value = '';
  if (!make) return;
  const ex = make();
  settings.count = ex.count;
  settings.pairing = ex.pairing;
  settings.kind = ex.kind;
  if (ex.seed !== undefined) settings.seed = ex.seed;
  settings.fluctuation = 0;
  settings.proximity = 0;
  settings.interest = 0; // The examples have ten people or fewer, each attracted to everyone.
  settings.loyalty = ex.loyalty ?? 'none';
  if (ex.boost !== undefined) settings.boost = ex.boost;
  if (ex.growth !== undefined) settings.growth = ex.growth;
  settings.growthMax = 1; // The examples' loyalty grows without a lower maximum.
  if (ex.boredom !== undefined) settings.boredom = ex.boredom;
  attraction = ex.matrix ? ex.matrix.map(row => [...row]) : generate(ex.kind, ex.count, settings.seed);
  saveAttraction();
  buildTable();
  updateExistence();
  restart();
  playing = true;
  syncControls();
  saveSettings();
});

// ── Dragging people ────────────────────────────────────────────────
function pointerPos(e: PointerEvent): [number, number] {
  const rect = canvas.getBoundingClientRect();
  return [(e.clientX - rect.left) / zoom, (e.clientY - rect.top) / zoom];
}
function personAt(x: number, y: number): number {
  let best = -1, bestD = RADIUS + 8;
  people.forEach((p, i) => {
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}
canvas.addEventListener('pointerdown', e => {
  const [x, y] = pointerPos(e);
  dragged = personAt(x, y);
  if (dragged < 0) return;
  dragX = x; dragY = y;
  canvas.setPointerCapture(e.pointerId);
  canvas.style.cursor = 'grabbing';
  e.preventDefault();
});
canvas.addEventListener('pointermove', e => {
  const [x, y] = pointerPos(e);
  if (dragged >= 0) {
    dragX = Math.min(Math.max(x, RADIUS), width - RADIUS);
    dragY = Math.min(Math.max(y, RADIUS), height - RADIUS);
  } else {
    canvas.style.cursor = personAt(x, y) >= 0 ? 'grab' : '';
  }
});
const endDrag = (e: PointerEvent) => {
  dragged = -1;
  canvas.style.cursor = '';
  if (e.pointerType !== 'mouse') setHovered(-1); // Touch has no hover, so hide the info after a drag.
};
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);

// ── Info about the person or couple under the pointer ──────────────
const tooltip = $('sp-tooltip');
let hovered = -1;  // Index of the person under the pointer, or −1.
let followed = -1; // Index of the person clicked on, whose info stays shown as they move, or −1.

/** The person whose info is shown: the one under the pointer, else the one being followed. */
function shown(): number {
  const i = hovered >= 0 ? hovered : followed;
  return i < people.length ? i : -1;
}

function setHovered(i: number): void {
  hovered = i;
  updateTooltip(true);
}

canvas.addEventListener('pointermove', e => {
  const [x, y] = pointerPos(e);
  setHovered(dragged >= 0 ? dragged : personAt(x, y));
});
canvas.addEventListener('pointerleave', () => { if (dragged < 0) setHovered(-1); });

// A click (a press and release without dragging) on a person follows them: their info stays shown
// as they move. A click on them again, on empty space, or Escape stops following.
let downX = 0, downY = 0;
canvas.addEventListener('pointerdown', e => {
  downX = e.clientX;
  downY = e.clientY;
  if (dragged >= 0) setHovered(dragged);
});
canvas.addEventListener('pointerup', e => {
  if (Math.hypot(e.clientX - downX, e.clientY - downY) > 5) return; // A drag, not a click
  const [x, y] = pointerPos(e);
  const i = personAt(x, y);
  followed = i === followed ? -1 : i;
  updateTooltip(true);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && followed >= 0) { followed = -1; updateTooltip(true); }
});

const fmt = (v: number) => v.toFixed(2);
const signed = (v: number) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2);

/** Shows the info box (in a fixed corner of the plot, so it doesn't jump around) for the shown
 *  person, or hides it. Its text is rewritten only if `content`, since the numbers needn't change
 *  every frame. */
function updateTooltip(content: boolean): void {
  const i = shown();
  const wasHidden = tooltip.hidden;
  tooltip.hidden = i < 0;
  if (i < 0 || !(content || wasHidden)) return;
  if (matrixDirty) updateMatrices();
  tooltipText(i, people[i].partner);
}

/** Who k would rather be with than their partner, most attractive first, with those who want k
 *  back marked "mutual" (a blocking pair); or "happy". */
function wantsText(k: number): string {
  const n = people.length;
  const wanted = [...Array(n).keys()].filter(j => want[k * n + j]).sort((a, b) => live[k][b] - live[k][a]);
  const single = people[k].partner < 0;
  if (wanted.length === 0) return `<b>${name(k)}</b> ${single ? 'wants nobody' : 'is happy'}`;
  const names = wanted.map(j => name(j) + (want[j * n + k] ? ' (mutual)' : '')).join(', ');
  return `<b>${name(k)}</b> ${single ? 'wants' : 'would rather be with'} ${names}`;
}

/** The info box's text. Its layout is the same for every value: a grid of numbers with fixed
 *  rows, then one line per person (cut off with "…" if too long) for who they want, then a note,
 *  so changing numbers don't move the lines below them. */
function tooltipText(i: number, j: number): void {
  // The shown (hovered or followed) person comes first, so they stay in the left column even as
  // their partners change.
  const who = j >= 0 ? [i, j] : [i];
  const title = j >= 0
    ? `${name(who[0])} ♥ ${name(who[1])}, together ${(simTime - people[i].since).toFixed(1)} s`
    : `${name(i)}, single`;
  const cell = (text: string) => `<div class="sp-info-value">${text}</div>`;
  const row = (label: string, value: (k: number) => string) =>
    `<div class="sp-info-label">${label}</div>` + who.map(k => cell(value(k))).join('') + (who.length === 1 ? cell('') : '');
  const toPartner = (k: number, f: (p: number) => string) => (people[k].partner >= 0 ? f(people[k].partner) : '—');
  const grid = [
    `<div></div>` + who.map(k => cell(`<b>${name(k)}</b>` + (people[k].partner >= 0 ? ` → ${name(people[k].partner)}` : ''))).join('') + (who.length === 1 ? cell('') : ''),
    row('Attraction', k => toPartner(k, p => fmt(live[k][p]))),
    row('Baseline', k => toPartner(k, p => (live === attraction ? '—' : fmt(attraction[k][p])))),
    row('Fluctuation', k => toPartner(k, p => (live === attraction ? '—' : signed(live[k][p] - attraction[k][p])))),
    row('Loyalty', k => toPartner(k, p => {
      const extra = partnerValue(k) - live[k][p];
      return extra === Infinity ? 'never leaves' : Math.abs(extra) < 0.005 ? '—' : signed(extra);
    })),
    row('Heartbreak', k => (heartbreak(k) >= 0.01 ? signed(-heartbreak(k)) : '—')), // Negative: it's unhappiness
  ].join('');
  const note = i === followed && hovered < 0 ? `Following ${name(i)}. Click elsewhere to stop.` : 'Click a person to keep following them.';
  tooltip.innerHTML =
    `<div class="sp-tooltip-title">${title}</div>` +
    `<div class="sp-info-grid">${grid}</div>` +
    who.map(k => `<div class="sp-info-line">${wantsText(k)}</div>`).join('') +
    `<div class="sp-tooltip-note">${note}</div>`;
}

// ── Animation ──────────────────────────────────────────────────────
let last = performance.now();
let frameCount = 0;
function frame(now: number): void {
  const elapsed = Math.min(0.05, (now - last) / 1000);
  last = now;
  updateLive();
  updateMatrices();
  if (playing) {
    let remaining = elapsed * settings.speed;
    while (remaining > 1e-9) {
      const dt = Math.min(MAX_STEP, remaining);
      step(dt);
      remaining -= dt;
    }
  } else if (dragged >= 0) {
    // While paused, a dragged person (and their partner) still follows the pointer.
    step(0);
  }
  updateMatrices();
  const blocking = blockingPairs();
  draw(blocking);
  recordHappiness();
  if (frameCount % 4 === 0) drawGraphs();
  if (pairsChanged) { markPartners(); pairsChanged = false; }
  if (shown() >= 0) updateTooltip(frameCount % 6 === 0);
  if (frameCount++ % 6 === 0) updateStatus(blocking);
  requestAnimationFrame(frame);
}

// ── Start ──────────────────────────────────────────────────────────
const savedAttraction = loadJSON<number[][]>('sp_attraction');
const validSaved = Array.isArray(savedAttraction) && savedAttraction.length === settings.count &&
  savedAttraction.every(row => Array.isArray(row) && row.length === settings.count && row.every(v => typeof v === 'number'));
attraction = validSaved ? savedAttraction! : generate(settings.kind === 'custom' ? 'random' : settings.kind, settings.count, settings.seed);
if (!validSaved && settings.kind === 'custom') settings.kind = 'random';

new ResizeObserver(() => { resizeCanvas(); resizeGraphs(); }).observe(canvas);
new ResizeObserver(resizeGraphs).observe(breakupGraph.canvas);
resizeCanvas();
resizeGraphs();
syncControls();
buildTable();
updateExistence();
restart();

const PIN_KEY = 'sp_pinned_panels';
const panels = setupPanels('sp', () =>
  saveJSON(PIN_KEY, panels.list.map((p, i) => (panels.isPinned(p) ? i : -1)).filter(i => i >= 0)));
for (const i of loadJSON<number[]>(PIN_KEY) ?? []) if (panels.list[i]) panels.setPinned(panels.list[i], true);
setupHelp('sp');
requestAnimationFrame(frame);
