import { test } from "node:test";
import assert from "node:assert/strict";
import { assertArrayClose, assertClose } from "./helpers";
import {
  LAMBDA, MID, NEG, NO_FIBER, N_FIBER, POS, Scene, Stretch, XI, accumulatedPhase, boxAverage,
  channelAverages, colorOf, distanceLabel, fmtRate, frontRange, gaugeStrain, lengthChange, lossAt,
  maxPulseRate, movingLoadShape, niceStep, noiseScale, phaseFromStrain, pointStrainRate, pulseLength,
  pulseResolution, ricker, roundTrip,
} from "../src/das_sensing/physics";

const EMPTY: Scene = { waveSpeed: 300, strikes: [], car: { on: false, x: 0, y: -25, speed: 20 }, quakes: [] };

test("interrogator timing and resolution", () => {
  assertClose(roundTrip(1000), 2 * 1.468 * 1000 / 3e8);
  assertClose(roundTrip(1000) * 1e6, 9.787, 1e-3);   // About 10 μs per km
  assertClose(maxPulseRate(1000), 1 / roundTrip(1000));
  assertClose(maxPulseRate(50000), 2043.6, 0.1);
  assertClose(pulseResolution(10), 1.0218, 1e-4);     // About 1 m per 10 ns
  assertClose(pulseLength(10), 2 * pulseResolution(10));
  assert.equal(roundTrip(0), 0);
  assert.equal(maxPulseRate(0), Infinity);
});

test("lossAt falls 0.4 dB per km", () => {
  assert.equal(lossAt(0), 1);
  assertClose(20 * Math.log10(lossAt(1000)), -0.4);
  assertClose(lossAt(2000), lossAt(1000) ** 2);
});

test("the Ricker wavelet", () => {
  assert.equal(ricker(0, 10), 1);
  // Zeros at τ = ±1/(π f √2), and symmetric.
  assertClose(ricker(1 / (Math.PI * 10 * Math.SQRT2), 10), 0, 1e-12);
  assertClose(ricker(0.013, 10), ricker(-0.013, 10), 0);
  assert.ok(ricker(0.05, 10) < 0, "negative side lobes");
  assert.equal(ricker(10, 10), 0, "cut off far from the center");
});

test("the moving load's strain-rate shape", () => {
  assert.equal(movingLoadShape(0), 0);
  assertClose(movingLoadShape(-0.7), -movingLoadShape(0.7), 1e-15);
  // Zeros at q = ±√3, and it fades far away.
  assertClose(movingLoadShape(Math.sqrt(3)), 0, 1e-12);
  assert.ok(Math.abs(movingLoadShape(100)) < 1e-4);
});

test("frontRange covers the map's corners", () => {
  assert.deepEqual(frontRange(0, 1000, 160), [0, 1000]);
  const [lo, hi] = frontRange(90, 1000, 160);
  assertClose(lo, -160);
  assertClose(hi, 160);
  const [lo45, hi45] = frontRange(45, 1000, 160);
  assertClose(lo45, -160 * Math.SQRT1_2);
  assertClose(hi45, 1160 * Math.SQRT1_2);
});

test("pointStrainRate: an empty scene is quiet", () => {
  assert.equal(pointStrainRate(500, 1, EMPTY), 0);
});

test("pointStrainRate: a strike's wave arrives at r / v and fades with distance", () => {
  const scene: Scene = { ...EMPTY, strikes: [{ x: 300, y: 0, t0: 0, f: 10, amp: 1 }] };
  // On the fiber's line (y = 0), the wave is felt fully: cos²θ = 1.
  assertClose(pointStrainRate(400, 100 / 300, scene), 1 / Math.sqrt(100));
  assertClose(pointStrainRate(200, 100 / 300, scene), 1 / Math.sqrt(100), 1e-12);
  assert.equal(pointStrainRate(400, 0, scene), 0, "before the wave arrives");
  // Close to the source, the 1/√r falloff is capped at r = 8 m.
  assertClose(pointStrainRate(300, 0, scene), 1 / Math.sqrt(8));
});

test("pointStrainRate: a broadside wave is barely felt", () => {
  const strike = { x: 500, y: 100, t0: 0, f: 10, amp: 1 };
  const scene: Scene = { ...EMPTY, strikes: [strike] };
  assertClose(pointStrainRate(500, 100 / 300, scene), 0, 1e-15);   // Arrives broadside: cos²θ = 0
  const along = pointStrainRate(600, Math.hypot(100, 100) / 300, scene);
  assertClose(along, 0.5 / Math.sqrt(Math.hypot(100, 100)));   // At 45°: cos²θ = ½
});

test("pointStrainRate: quakes are felt with cos² of their angle", () => {
  const quake = (angle: number) => ({ t0: 0, angle, speed: 1000, f: 5, amp: 1, d0: 0, d1: 2000 });
  const at = (angle: number, x: number) => {
    const a = angle * Math.PI / 180;
    return pointStrainRate(x, x * Math.cos(a) / 1000, { ...EMPTY, quakes: [quake(angle)] });
  };
  assertClose(at(0, 300), 1);
  assertClose(at(60, 300), 0.25);
  assertClose(at(90, 300), 0, 1e-15);
});

test("pointStrainRate: a car's pattern moves with it", () => {
  const car = { on: true, x: 200, y: -25, speed: 20 };
  const scene: Scene = { ...EMPTY, car };
  assertClose(pointStrainRate(200, 0, scene), 0);
  assertClose(pointStrainRate(225, 0, scene), 0.9 * movingLoadShape(1));
  assertClose(pointStrainRate(225, 0, { ...scene, car: { ...car, speed: 40 } }), 1.8 * movingLoadShape(1));
  assertClose(pointStrainRate(225, 0, { ...scene, car: { ...car, y: 25 } }), 0.9 * movingLoadShape(1), 1e-15);
});

test("boxAverage", () => {
  assertArrayClose(boxAverage([1, 2, 3, 4, 5], 1), [1.5, 2, 3, 4, 4.5]);
  assertArrayClose(boxAverage([1, 2, 3], 0), [1, 2, 3]);
  assertArrayClose(boxAverage([3, 3, 3], 10), [3, 3, 3]);
});

const LAYOUT = { dx: 1, channel: 10, channels: 10, gauge: 10, resolution: 0, fiberLength: 1000 };

test("channelAverages averages over the gauge", () => {
  const fine = Float64Array.from({ length: 101 }, (_, k) => k);   // Strain rate = x
  const avg = channelAverages(fine, LAYOUT);
  // A linear signal's average over a symmetric window is its value at the center (5, 15, ...).
  assertArrayClose(avg.slice(1, 9), [15, 25, 35, 45, 55, 65, 75, 85]);
  // A constant stays constant, whatever the gauge and blur.
  const flat = channelAverages(new Float64Array(101).fill(2), { ...LAYOUT, gauge: 30, resolution: 8 });
  assertArrayClose(flat, new Array(10).fill(2));
});

test("channelAverages: a short spike is spread over the gauge", () => {
  const fine = new Float64Array(101);
  fine[45] = 11;
  const avg = channelAverages(fine, LAYOUT);
  assertClose(avg[4], 1);   // Channel 4 is centered at 45 m, and its gauge covers 40–50 m (11 samples)
  assert.equal(avg[2], 0);
  // Without averaging (gauge 0), the channel sees only its center sample.
  assert.equal(channelAverages(fine, { ...LAYOUT, gauge: 0 })[4], 11);
});

test("channelAverages: channels past the fiber's end read NaN", () => {
  const avg = channelAverages(new Float64Array(101), { ...LAYOUT, fiberLength: 50 });
  assert.deepEqual([...avg].map(Number.isNaN), [false, false, false, false, false, true, true, true, true, true]);
});

test("noiseScale", () => {
  assert.equal(noiseScale(10, 200, 200), 1);
  assertClose(noiseScale(40, 200, 200), 0.5);
  assertClose(noiseScale(10, 200, 800), 0.5);
  assert.equal(noiseScale(0, 200, 200), Math.sqrt(10), "gauges under 1 m count as 1 m");
});

const STRETCH: Stretch = { at: 400, length: 20, strain: 100 };

test("gaugeStrain averages the stretch over the gauge", () => {
  assertClose(gaugeStrain(400, 10, STRETCH), 100e-9);    // Gauge inside the stretch
  assertClose(gaugeStrain(400, 40, STRETCH), 50e-9);     // Stretch covers half the gauge
  assertClose(gaugeStrain(410, 10, STRETCH), 50e-9);     // Gauge half over the stretch's end
  assert.equal(gaugeStrain(300, 10, STRETCH), 0);
});

test("phase from strain", () => {
  assertClose(phaseFromStrain(1e-9, 10), 4 * Math.PI * N_FIBER * XI * 10 * 1e-9 / LAMBDA);
  // About 0.09 rad per nanostrain over a 10 m gauge.
  assertClose(phaseFromStrain(1e-9, 10), 0.0928, 1e-4);
  assert.equal(phaseFromStrain(0, 10), 0);
});

test("accumulatedPhase ramps through the stretch and stays shifted after it", () => {
  const full = accumulatedPhase(410, STRETCH);
  assert.equal(accumulatedPhase(100, STRETCH), 0);
  assertClose(accumulatedPhase(400, STRETCH), full / 2);
  assertClose(accumulatedPhase(900, STRETCH), full);
  assertClose(full, phaseFromStrain(100e-9, 20));
  // A stretch that starts before the interrogator only counts from 0.
  assertClose(accumulatedPhase(100, { at: 0, length: 20, strain: 100 }), phaseFromStrain(100e-9, 10));
});

test("colorOf", () => {
  assert.deepEqual(colorOf(0, 1), MID);
  assert.deepEqual(colorOf(-1, 1), NEG);
  assert.deepEqual(colorOf(5, 1), POS, "clipped");
  assert.deepEqual(colorOf(0.5, 2), POS, "gain");
  assert.deepEqual(colorOf(NaN, 1), NO_FIBER);
  assertArrayClose(colorOf(0.5, 1), MID.map((m, i) => (m + POS[i]) / 2));
});

test("labels", () => {
  assert.equal(lengthChange(0), "0.0 nm");
  assert.equal(lengthChange(5.25), "+5.3 nm");
  assert.equal(lengthChange(-250), "−250 nm");
  assert.equal(lengthChange(1500), "+1.50 μm");
  assert.equal(lengthChange(-25000), "−25.0 μm");
  assert.equal(distanceLabel(999.4), "999 m");
  assert.equal(distanceLabel(1000), "1 km");
  assert.equal(distanceLabel(2500), "2.5 km");
  assert.equal(fmtRate(100), "100 Hz");
  assert.equal(fmtRate(2043.6), "2 kHz");
  assert.equal(fmtRate(1500), "1.5 kHz");
  assert.equal(fmtRate(1e6), "1 MHz");
});

test("niceStep", () => {
  assert.equal(niceStep(10, 5), 2);
  assert.equal(niceStep(9.8, 5), 2);
  assert.equal(niceStep(1000, 5), 200);
  assert.equal(niceStep(30, 5), 10);
  assertClose(niceStep(0.7, 5), 0.2, 1e-15);
});
