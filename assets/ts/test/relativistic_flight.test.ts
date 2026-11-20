import { test } from "node:test";
import assert from "node:assert/strict";
import { assertArrayClose, assertClose } from "./helpers";
import {
  MAX_BETA, Mass, addVelocities, blackbodyRGB, formatScientific, formatTime, kinematics, maxProperSpeed,
  metricFactor, seededRandom, segmentHitsCircle, segmentsCross, timeRateColor, wavelengthRGB,
} from "../src/relativistic_flight/physics";
import { GhostSample, Run, decodeGhost, encodeGhost, ghostKey, insertRun, sampleRunAt } from "../src/relativistic_flight/runs";

const c = 300;
const speed = (v: { x: number; y: number }) => Math.hypot(v.x, v.y);
const xy = (v: { x: number; y: number }) => [v.x, v.y];

test("addVelocities: adding zero", () => {
  assertArrayClose(xy(addVelocities(c, 0, 0, 120, -50)), [120, -50]);
  assertArrayClose(xy(addVelocities(c, 120, -50, 0, 0)), [120, -50]);
});

test("addVelocities: collinear speeds add relativistically", () => {
  const u = 0.6 * c, v = 0.8 * c;
  assertArrayClose(xy(addVelocities(c, u, 0, v, 0)), [(u + v) / (1 + u * v / c ** 2), 0]);
  assertArrayClose(xy(addVelocities(c, 0, u, 0, -u)), [0, 0], 1e-12);
});

test("addVelocities never exceeds c, and light stays at c", () => {
  const rand = seededRandom(1);
  for (let i = 0; i < 200; i++) {
    const angle = () => 2 * Math.PI * rand();
    const [a, b] = [angle(), angle()];
    const [sv, sw] = [0.999 * c * rand(), 0.999 * c * rand()];
    const sum = addVelocities(c, sv * Math.cos(a), sv * Math.sin(a), sw * Math.cos(b), sw * Math.sin(b));
    assert.ok(speed(sum) < c, `speed ${speed(sum)}`);
    const light = addVelocities(c, sv * Math.cos(a), sv * Math.sin(a), c * Math.cos(b), c * Math.sin(b));
    assertClose(speed(light), c, 1e-9);
  }
});

test("addVelocities with −v undoes adding v", () => {
  const v = [0.7 * c, 0.2 * c], w = [-0.3 * c, 0.5 * c];
  const there = addVelocities(c, v[0], v[1], w[0], w[1]);
  assertArrayClose(xy(addVelocities(c, -v[0], -v[1], there.x, there.y)), w, 1e-9);
});

test("addVelocities: a transverse velocity is slowed by 1/γ", () => {
  const v = 0.8 * c, gamma = 1 / Math.sqrt(1 - 0.64);
  assertArrayClose(xy(addVelocities(c, v, 0, 0, 0.1 * c)), [v, 0.1 * c / gamma]);
});

test("maxProperSpeed corresponds to MAX_BETA", () => {
  const u = maxProperSpeed(c);
  assertClose(u / Math.sqrt(1 + (u / c) ** 2), MAX_BETA * c, 1e-9);
  assertClose(maxProperSpeed(2 * c), 2 * u);
});

const SUN: Mass = { x: 0, y: 0, r: 10, GM: 300 * c * c };   // Schwarzschild radius 600

test("metricFactor", () => {
  assert.equal(metricFactor(5, 5, [], c), 1);
  assertClose(metricFactor(6000, 0, [SUN], c), 1 - 600 / 6000);
  // Two masses add.
  assertClose(metricFactor(6000, 0, [SUN, { ...SUN, x: 12000 }], c), 1 - 2 * 600 / 6000);
  // Inside a body, r is taken as its radius; very deep wells are capped.
  assertClose(metricFactor(0, 0, [{ ...SUN, r: 1200 }], c), 0.5);
  assert.equal(metricFactor(0, 0, [SUN], c), 1e-4);
});

test("kinematics in flat spacetime", () => {
  const ship = { x: 0, y: 0, ux: 0.75 * c, uy: c };   // Proper speed 1.25c
  const k = kinematics(ship, [], c);
  assertClose(k.g, Math.sqrt(1 + 1.25 ** 2));
  assertClose(k.f, 1);
  assertClose(k.tdot, k.g);
  assertArrayClose([k.vx, k.vy], [ship.ux / k.g, ship.uy / k.g]);
  assert.ok(Math.hypot(k.vx, k.vy) < c);
  assert.deepEqual(kinematics({ x: 0, y: 0, ux: 0, uy: 0 }, [], c), { f: 1, tdot: 1, g: 1, vx: 0, vy: 0 });
});

test("kinematics near a mass: clocks at rest run slow, radial motion is stretched", () => {
  const at = 6000, f = 1 - 600 / at;
  const rest = kinematics({ x: at, y: 0, ux: 0, uy: 0 }, [SUN], c);
  assertClose(rest.f, f);
  assertClose(rest.tdot, 1 / Math.sqrt(f));
  const radial = kinematics({ x: at, y: 0, ux: 0.1 * c, uy: 0 }, [SUN], c);
  const tangential = kinematics({ x: at, y: 0, ux: 0, uy: 0.1 * c }, [SUN], c);
  assertClose(radial.vx * radial.g, 0.1 * c / Math.sqrt(f));
  assertClose(tangential.vy * tangential.g, 0.1 * c);
  assert.ok(radial.g > tangential.g);
  // At the mass's center, there is no direction to stretch along.
  assert.equal(kinematics({ x: 0, y: 0, ux: 30, uy: 0 }, [SUN], c).vx * kinematics({ x: 0, y: 0, ux: 30, uy: 0 }, [SUN], c).g, 30);
});

test("segmentsCross", () => {
  assert.ok(segmentsCross(0, 0, 2, 2, 0, 2, 2, 0));
  assert.ok(!segmentsCross(0, 0, 1, 1, 2, 0, 3, 1), "apart");
  assert.ok(!segmentsCross(0, 0, 2, 0, 0, 1, 2, 1), "parallel");
  assert.ok(!segmentsCross(0, 0, 2, 0, 1, 0, 3, 0), "collinear");
  assert.ok(!segmentsCross(0, 0, 1, 1, 1, 1, 2, 0), "touching at an endpoint");
});

test("segmentHitsCircle", () => {
  assert.ok(segmentHitsCircle(-10, 1, 10, 1, 0, 0, 2));
  assert.ok(!segmentHitsCircle(-10, 3, 10, 3, 0, 0, 2));
  assert.ok(!segmentHitsCircle(3, 0, 10, 0, 0, 0, 2), "the closest point is an endpoint");
  assert.ok(segmentHitsCircle(1, 0, 1, 0, 0, 0, 2), "a zero-length segment inside");
  assert.ok(!segmentHitsCircle(2, 0, 10, 0, 0, 0, 2), "tangent at the edge doesn't count");
});

test("seededRandom is repeatable and in [0, 1)", () => {
  const a = seededRandom(42), b = seededRandom(42), other = seededRandom(43);
  const xs = Array.from({ length: 1000 }, a);
  assert.deepEqual(Array.from({ length: 1000 }, b), xs);
  assert.notEqual(other(), xs[0]);
  assert.ok(xs.every(x => x >= 0 && x < 1));
  const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
  assertClose(mean, 0.5, 0.05);
});

test("blackbodyRGB", () => {
  const [r, g, b] = blackbodyRGB(6600);
  assert.ok(r === 255 && g > 240 && b === 255, "about white near 6600 K");
  assert.deepEqual(blackbodyRGB(500), blackbodyRGB(1000), "clamped below 1000 K");
  assert.deepEqual(blackbodyRGB(1e6), blackbodyRGB(40000), "clamped above 40000 K");
  assert.equal(blackbodyRGB(1500)[2], 0, "cool stars have no blue");
  // Hotter is bluer.
  let previous = -Infinity;
  for (let T = 1000; T <= 40000; T += 500) {
    const [red, , blue] = blackbodyRGB(T);
    assert.ok(blue - red >= previous - 1, `${T} K`);
    previous = blue - red;
  }
});

test("wavelengthRGB", () => {
  assert.deepEqual(wavelengthRGB(530), [Math.round(255 * Math.pow(20 / 70, 0.8)), 255, 0]);
  assert.deepEqual(wavelengthRGB(450).slice(1), [Math.round(255 * Math.pow(0.2, 0.8)), 255]);
  assert.deepEqual(wavelengthRGB(700), [255, 0, 0]);
  assert.ok(wavelengthRGB(380).every(x => x <= Math.round(255 * Math.pow(0.3, 0.8))), "dim at the violet end");
  for (let l = 380; l <= 780; l += 5) assert.ok(wavelengthRGB(l).every(x => x >= 0 && x <= 255), `${l} nm`);
});

test("timeRateColor", () => {
  assert.equal(timeRateColor(1), "rgb(223, 232, 255)");
  assert.equal(timeRateColor(0.5), "rgb(223, 232, 255)", "below 1 stays white");
  assert.equal(timeRateColor(20), "rgb(255, 80, 110)");
  assert.equal(timeRateColor(1000), "rgb(255, 80, 110)");
  assert.equal(timeRateColor(20 ** 0.2), "rgb(255, 236, 120)");
});

test("formatScientific", () => {
  assert.equal(formatScientific(299792458), "2.998 × 10⁸");
  assert.equal(formatScientific(0.001234, 3), "1.23 × 10⁻³");
  assert.equal(formatScientific(5), "5.000 × 10⁰");
  assert.equal(formatScientific(-4200), "-4.200 × 10³");
});

test("formatTime", () => {
  assert.equal(formatTime(0), "0:00.00");
  assert.equal(formatTime(65.5), "1:05.50");
  assert.equal(formatTime(-3.25), "−0:03.25");
  assert.equal(formatTime(3600), "60:00.00");
});

test("formatTime rounds up into the next minute", () => {
  assert.equal(formatTime(59.999), "1:00.00");
  assert.equal(formatTime(119.996), "2:00.00");
  assert.equal(formatTime(-0.001), "0:00.00");
});

const SAMPLES: GhostSample[] = [
  { t: 0, x: 0, y: 0, h: 3, vx: 10, vy: 0, tau: 0 },
  { t: 1, x: 10, y: 0, h: -3, vx: 20, vy: 0, tau: 0.5 },
  { t: 3, x: 30, y: 20, h: -3, vx: 0, vy: 10, tau: 1.5 },
];

test("sampleRunAt interpolates, and waits at rest before and after", () => {
  const mid = sampleRunAt(SAMPLES, 2);
  assertArrayClose([mid.x, mid.y, mid.vx, mid.vy, mid.tau, mid.h], [20, 10, 10, 5, 1, -3]);
  assert.deepEqual(sampleRunAt(SAMPLES, -1), { ...SAMPLES[0], t: -1, vx: 0, vy: 0 });
  assert.deepEqual(sampleRunAt(SAMPLES, 9), { ...SAMPLES[2], t: 9, vx: 0, vy: 0 });
  assert.deepEqual(sampleRunAt(SAMPLES, 1), { ...SAMPLES[1] });
});

test("sampleRunAt turns the short way across ±π", () => {
  // From h = 3 to h = −3 is a turn of 2π − 6 ≈ 0.28 rad, not −6 rad.
  const half = sampleRunAt(SAMPLES, 0.5);
  assertClose(half.h, 3 + (2 * Math.PI - 6) / 2);
});

test("sampleRunAt with one sample", () => {
  assert.deepEqual(sampleRunAt([SAMPLES[0]], 5), { ...SAMPLES[0], t: 5, vx: 0, vy: 0 });
});

test("ghosts round-trip through storage, rounded", () => {
  const precise: GhostSample[] = [{ t: 1.23456, x: 10.06, y: -3.04, h: 0.12345, vx: 1.26, vy: -2.24, tau: 0.98765 }];
  assert.deepEqual(decodeGhost(encodeGhost(precise)), [{ t: 1.235, x: 10.1, y: -3, h: 0.123, vx: 1.3, vy: -2.2, tau: 0.988 }]);
  assert.deepEqual(decodeGhost(encodeGhost(SAMPLES)), SAMPLES);
  assert.deepEqual(decodeGhost(null), []);
  assert.deepEqual(decodeGhost({} as never), []);
  assert.deepEqual(encodeGhost([]), { t: [], x: [], y: [], h: [], vx: [], vy: [], tau: [] });
  assert.equal(ghostKey("list", "abc"), "list~ghost~abc");
});

const run = (t: number): Run => ({ t, tau: t / 2, samples: [] });

test("insertRun keeps the fastest runs in order", () => {
  const runs: Run[] = [];
  assert.equal(insertRun(runs, run(30)), 1);
  assert.equal(insertRun(runs, run(10)), 1);
  assert.equal(insertRun(runs, run(20)), 2);
  assert.deepEqual(runs.map(r => r.t), [10, 20, 30]);
  // A tie goes after the earlier run.
  assert.equal(insertRun(runs, run(20)), 3);
  assert.equal(insertRun(runs, run(40)), 5);
  assert.deepEqual(runs.map(r => r.t), [10, 20, 20, 30, 40]);
  // Full: a faster run pushes out the slowest; a slower one doesn't make the list.
  assert.equal(insertRun(runs, run(15)), 2);
  assert.deepEqual(runs.map(r => r.t), [10, 15, 20, 20, 30]);
  assert.equal(insertRun(runs, run(50)), 0);
  assert.equal(insertRun(runs, run(30)), 0, "a tie with the slowest doesn't make a full list");
  assert.equal(runs.length, 5);
  assert.equal(insertRun([run(1)], run(2), 1), 0);
});
