import { test } from "node:test";
import assert from "node:assert/strict";
import { assertClose } from "./helpers";
import type { Scene } from "../src/common/scene3d";
import { canvasRect } from "../src/figures/plot2d";
import { FUNCTIONS, areaCentroid, integrate, texAt, normalCdf, normalPdf, riemannRects, riemannSum, signPieces } from "../src/figures/functions";
import { accumulate, angleBetween, angleKind, direction, signedAngle, snapDirection, turnSpiral, wrap } from "../src/figures/angles";
import { cantorIntervals, coverBalls, coverSum, kochCurve, sierpinskiTriangles, similarityDimension } from "../src/figures/fractals";
import { ARENS_FORT_SETS } from "../src/figures/arens_fort_sets";
import { clipToShape } from "../src/figures/diagram";
import { probabilityText, shadedCentroid } from "../src/figures/density";
import { GpsFlight, GustSim, hash01, normalPair, seeded } from "../src/figures/quadcopter";
import { degrees, fixed, nearestWithin, texColor, steady, steadyDegrees, steadyFixed, steadyFixedTex, steadyTex, texNumber } from "../src/figures/widget";

const DEG = Math.PI / 180;

test("integrate matches exact integrals, with a sign for reversed limits", () => {
  const f = FUNCTIONS["half-plus-sine"].f;
  const exact = (a: number, b: number) => 0.5 * (b - a) - Math.cos(b) + Math.cos(a);
  assertClose(integrate(f, 0.5, 3), exact(0.5, 3), 1e-9);
  assertClose(integrate(f, 3, 0.5), -exact(0.5, 3), 1e-9);
  assertClose(integrate(x => x * x, 0, 1), 1 / 3, 1e-12);
  assert.equal(integrate(f, 2, 2), 0);
});

test("the standard normal density integrates to 1, and its CDF has the known values", () => {
  assertClose(integrate(normalPdf, -8, 8), 1, 1e-9);
  assertClose(normalCdf(0), 0.5, 1e-12);
  assertClose(normalCdf(1) - normalCdf(-1), 0.682689492, 1e-7);
  assertClose(normalCdf(1.96), 0.975002105, 1e-7);
  assert.equal(normalCdf(-9), 0);
  assert.equal(normalCdf(9), 1);
});

test("Riemann sums sample where asked and approach the integral", () => {
  const sq = (x: number) => x * x;
  const left = riemannRects(sq, 0, 1, 4, "left");
  assert.deepEqual(left.map(r => r.t), [0, 0.25, 0.5, 0.75]);
  assert.deepEqual(riemannRects(sq, 0, 1, 2, "right").map(r => r.t), [0.5, 1]);
  assert.deepEqual(riemannRects(sq, 0, 1, 2, "midpoint").map(r => r.t), [0.25, 0.75]);
  // Left sums of an increasing function are too small, and right sums too large.
  assert.ok(riemannSum(left) < 1 / 3);
  assert.ok(riemannSum(riemannRects(sq, 0, 1, 4, "right")) > 1 / 3);
  assertClose(riemannSum(riemannRects(sq, 0, 1, 400, "midpoint")), 1 / 3, 1e-5);
});

test("signPieces splits an interval at the zeros of the function", () => {
  const f = FUNCTIONS["half-plus-sine"].f;
  const pieces = signPieces(f, 0, 7);
  assert.deepEqual(pieces.map(p => p.sign), [1, -1, 1]);
  assertClose(pieces[0].x1, (7 * Math.PI) / 6, 1e-9);
  assertClose(pieces[1].x1, (11 * Math.PI) / 6, 1e-9);
  assert.equal(pieces[0].x0, 0);
  assert.equal(pieces[2].x1, 7);
  assert.deepEqual(signPieces(f, 0, 2).map(p => p.sign), [1]);
  // A function that touches 0 at the start isn't split there.
  assert.deepEqual(signPieces(x => x * x, 0, 1).map(p => p.sign), [1]);
  assert.deepEqual(signPieces(f, 3, 3), []);
});

test("angles between vectors, signed and unsigned", () => {
  assertClose(angleBetween([1, 0], [0, 2]), Math.PI / 2);
  assertClose(signedAngle([1, 0], [0, 2]), Math.PI / 2);
  assertClose(signedAngle([0, 2], [1, 0]), -Math.PI / 2);
  // Opposite directions give +π, from either side.
  assert.equal(signedAngle([1, 0], [-1, 0]), Math.PI);
  assert.equal(signedAngle([1, -0], [-1, -0]), Math.PI);
  assertClose(angleBetween([1, 1], [1, 1]), 0);
  assertClose(wrap(3 * Math.PI), Math.PI);
  assertClose(wrap(-Math.PI), Math.PI);
  assertClose(wrap(-0.5), -0.5);
  assertClose(direction([0, -1]), -Math.PI / 2);
});

test("angleKind names angles by their measure", () => {
  assert.equal(angleKind(0), "zero");
  assert.equal(angleKind(45), "acute");
  assert.equal(angleKind(89.6), "right");
  assert.equal(angleKind(120), "obtuse");
  assert.equal(angleKind(180), "straight");
});

test("snapDirection snaps near the targets on either side, and nowhere else", () => {
  assertClose(snapDirection(91 * DEG, 0, [Math.PI / 2], 2 * DEG), Math.PI / 2);
  assertClose(snapDirection(-89 * DEG, 0, [Math.PI / 2], 2 * DEG), -Math.PI / 2);
  assertClose(snapDirection(179 * DEG, 0, [Math.PI / 2, Math.PI], 2 * DEG), Math.PI);
  assertClose(snapDirection(-179 * DEG, 0, [Math.PI], 2 * DEG), Math.PI);
  assertClose(snapDirection(80 * DEG, 0, [Math.PI / 2], 2 * DEG), 80 * DEG);
});

test("accumulate adds up a turn of more than one full turn", () => {
  let total = 0, dir = 0;
  for (let k = 1; k <= 72; k++) {
    const next = wrap(k * 10 * DEG);
    total = accumulate(total, dir, next);
    dir = next;
  }
  assertClose(total, 720 * DEG, 1e-9);
  // Back the other way past the start.
  assertClose(accumulate(0, 10 * DEG, -10 * DEG), -20 * DEG);
});

test("turnSpiral starts at the start direction and ends at the final one, farther out", () => {
  const pts = turnSpiral(Math.PI / 2, -Math.PI / 2, 0.3, 0.1);
  assertClose(pts[0][0], 0);
  assertClose(pts[0][1], 0.3);
  const end = pts[pts.length - 1];
  assertClose(direction(end), 0);
  assertClose(Math.hypot(...end), 0.3 + 0.1 / 4);
});

test("self-similar sets have the right numbers of pieces and dimensions", () => {
  assertClose(similarityDimension(2, 2), 1);
  assertClose(similarityDimension(4, 2), 2);
  assertClose(similarityDimension(2, 3), 0.6309297536);
  assertClose(similarityDimension(3, 2), 1.5849625007);
  const c2 = cantorIntervals(2);
  assert.equal(c2.length, 4);
  c2.forEach(([a, b], i) => assertClose(b - a, 1 / 9, 1e-12, `interval ${i}`));
  assert.deepEqual(c2.map(([a]) => Math.round(a * 9)), [0, 2, 6, 8]);
  // The first half of the list is the left copy, and the second half the right copy.
  assert.ok(cantorIntervals(4).slice(0, 8).every(([, b]) => b <= 1 / 3 + 1e-12));
  const tris = sierpinskiTriangles(3);
  assert.equal(tris.length, 27);
  assert.ok(tris.slice(0, 9).every(t => t.every(([x, y]) => x <= 0.5 + 1e-12 && y <= Math.sqrt(3) / 4 + 1e-12)));
  const koch = kochCurve(2);
  assert.equal(koch.length, 17);
  assert.deepEqual(koch[0], [0, 0]);
  assertClose(koch[16][0], 1);
  assertClose(koch[16][1], 0);
  // Each of its 16 segments has length 1/9, and the peak of the first step is at height √3/6.
  for (let i = 0; i < 16; i++) assertClose(Math.hypot(koch[i + 1][0] - koch[i][0], koch[i + 1][1] - koch[i][1]), 1 / 9, 1e-12);
  assertClose(kochCurve(1)[2][1], Math.sqrt(3) / 6);
});

test("the Arens–Fort sets agree with their stated openness", () => {
  for (const [key, set] of Object.entries(ARENS_FORT_SETS)) {
    // A column is missed infinitely often if the set misses many of its points far up.
    for (let m = 0; m < 30; m++) {
      let misses = 0;
      for (let n = 100; n < 200; n++) if (!set.has(m, n)) misses++;
      assert.equal(misses > 50, set.missesInfinitely(m), `${key}, column ${m}`);
    }
    // Open: no origin, or the origin and finitely many columns missed infinitely often (here, among the first 30).
    const flagged = Array.from({ length: 30 }, (_, m) => set.missesInfinitely(m)).filter(Boolean).length;
    const open = !set.has(0, 0) || flagged < 10;
    assert.equal(open, set.open, key);
  }
});

test("clipToShape stops an edge at a node's border", () => {
  assert.deepEqual(clipToShape("box", 2, 1, [0, 0], [10, 0]), [2, 0]);
  assert.deepEqual(clipToShape("box", 2, 1, [0, 0], [0, -10]), [0, -1]);
  assert.deepEqual(clipToShape("box", 2, 1, [0, 0], [4, 4]), [1, 1]);
  assert.deepEqual(clipToShape("diamond", 2, 1, [0, 0], [0, 5]), [0, 1]);
  const [x, y] = clipToShape("diamond", 2, 1, [0, 0], [4, 2]);
  assertClose(Math.abs(x) / 2 + Math.abs(y) / 1, 1);
  const [cx, cy] = clipToShape("circle", 3, 3, [1, 1], [5, 4]);
  assertClose(Math.hypot(cx - 1, cy - 1), 3);
  // A target inside the node isn't passed.
  assert.deepEqual(clipToShape("box", 2, 2, [0, 0], [1, 0]), [1, 0]);
});

test("seeded random numbers repeat, and their normal samples look standard", () => {
  const a = seeded(3), b = seeded(3);
  for (let i = 0; i < 5; i++) assert.equal(a(), b());
  const rand = seeded(11);
  let sum = 0, sq = 0;
  for (let i = 0; i < 5000; i++) {
    for (const z of normalPair(rand)) { sum += z; sq += z * z; }
  }
  assertClose(sum / 10000, 0, 0.05);
  assertClose(sq / 10000, 1, 0.05);
});

test("readout numbers use a true minus and no negative zero", () => {
  assert.equal(fixed(-1.5), "−1.50");
  assert.equal(fixed(-0.001), "0.00");
  assert.equal(fixed(2), "2.00");
  assert.equal(degrees(-Math.PI / 2), "−90°");
  assert.equal(degrees(-0.001), "0°");
});

test("shadedCentroid is the center of the area under the normal density to the left of x", () => {
  // Far to the right, the region is the whole area under f, centered at x = 0.
  const [x, y] = shadedCentroid(8);
  assertClose(x, 0, 1e-9);
  // The mean height of the whole region: ∫ f²/2 = 1/(4√π).
  assertClose(y, 1 / (4 * Math.sqrt(Math.PI)), 1e-9);
  // At x = 0, by numerical integration.
  let m = 0, a = 0, h = 0;
  for (let t = -10; t < 0; t += 1e-4) { const f = Math.exp(-t * t / 2) / Math.sqrt(2 * Math.PI); a += f * 1e-4; m += t * f * 1e-4; h += f * f / 2 * 1e-4; }
  const [x0, y0] = shadedCentroid(0);
  assertClose(x0, m / a, 1e-3);
  assertClose(y0, h / a, 1e-3);
});

test("GustSim: the drone stays at the target without wind, and wanders near it in wind", () => {
  const calm = new GustSim(seeded(1));
  for (let i = 0; i < 200; i++) calm.step(0.05, 0);
  assert.deepEqual(calm.pos, [0, 0]);
  const windy = new GustSim(seeded(1));
  let far = 0, moved = 0;
  for (let i = 0; i < 400; i++) {
    const before = windy.pos;
    windy.step(0.05, 1);
    far = Math.max(far, Math.hypot(...windy.pos));
    moved += Math.hypot(windy.pos[0] - before[0], windy.pos[1] - before[1]);
  }
  // It moves around, but the controller keeps it within reach of the target.
  assert.ok(moved > 1, `moved ${moved}`);
  assert.ok(far < 1, `strayed ${far}`);
});

test("coverBalls covers each self-similar set with N^k equal balls", () => {
  const cases: [Parameters<typeof coverBalls>[0], number, number][] = [["segment", 2, 1], ["square", 4, Math.SQRT2], ["cantor", 2, 1], ["sierpinski", 3, 2 / Math.sqrt(3)], ["koch", 4, 1]];
  const factor = { segment: 2, square: 2, cantor: 3, sierpinski: 2, koch: 3 };
  for (const [shape, copies, d0] of cases) {
    for (const k of [0, 1, 3]) {
      const balls = coverBalls(shape, k);
      assert.equal(balls.length, copies ** k, `${shape} at step ${k}`);
      for (const b of balls) assertClose(2 * b.r, d0 / factor[shape] ** k, 1e-12);
    }
  }
});

test("coverBalls: every point of a fine approximation of the set lies in some ball", () => {
  const inSome = (balls: { c: [number, number]; r: number }[], [x, y]: [number, number]) =>
    balls.some(b => Math.hypot(x - b.c[0], y - b.c[1]) <= b.r + 1e-9);
  const koch = coverBalls("koch", 2);
  for (const p of kochCurve(5)) assert.ok(inSome(koch, p), `Koch point ${p}`);
  const tri = coverBalls("sierpinski", 2);
  for (const t of sierpinskiTriangles(4)) for (const p of t) assert.ok(inSome(tri, p), `Sierpinski point ${p}`);
  const cantor = coverBalls("cantor", 2);
  for (const [a, b] of cantorIntervals(4)) for (const x of [a, b]) assert.ok(inSome(cantor, [x, 0]));
  const square = coverBalls("square", 2);
  for (let i = 0; i <= 8; i++) for (let j = 0; j <= 8; j++) assert.ok(inSome(square, [i / 8, j / 8]));
});

test("coverSum at the dimension stays the same from step to step", () => {
  const d = similarityDimension(4, 3);
  assertClose(coverSum(coverBalls("koch", 1), d), coverSum(coverBalls("koch", 4), d), 1e-9);
  // Below the dimension it grows, above it shrinks.
  assert.ok(coverSum(coverBalls("koch", 4), 1) > coverSum(coverBalls("koch", 1), 1));
  assert.ok(coverSum(coverBalls("koch", 4), 1.5) < coverSum(coverBalls("koch", 1), 1.5));
});

// The invisible copies that set a steady number's width, and the number itself (the last span).
const rooms = (html: string) => [...html.matchAll(/<span class="dict-figure__num-room" aria-hidden="true">([^<]*)<\/span>/g)].map(m => m[1]);
const shownNumber = (html: string) => /<span>([^<]*)<\/span><\/span>$/.exec(html)?.[1];

test("steady keeps room for the widest values and shows the number", () => {
  const html = steady("5", "100");
  assert.deepEqual(rooms(html), ["100"]);
  assert.equal(shownNumber(html), "5");
});

test("steadyFixed keeps room for the digits of both ends of the range, but not for a sign", () => {
  const html = steadyFixed(0.5, -2.6, 12);
  assert.deepEqual(rooms(html), ["2.60", "12.00"]);
  assert.equal(shownNumber(html), "0.50");
});

test("steadyDegrees keeps room for its bounds, or for three digits without them", () => {
  assert.deepEqual(rooms(steadyDegrees(Math.PI / 4, 0, Math.PI)), ["0°", "180°"]);
  assert.deepEqual(rooms(steadyDegrees(Math.PI / 4)), ["000°", "000°"]);
  assert.equal(shownNumber(steadyDegrees(-Math.PI / 2)), "−90°");
});

test("probabilityText uses more digits only where two would round to 0 or 1", () => {
  assert.equal(probabilityText(0.6915), "0.69");
  assert.equal(probabilityText(0.004), "0.004");
  assert.equal(probabilityText(0.996), "0.996");
  assert.equal(probabilityText(normalCdf(-3.6)), "0.0002");
  assert.equal(probabilityText(normalCdf(3.6)), "0.9998");
  // The ends are exact, and stay two digits.
  assert.equal(probabilityText(0), "0.00");
  assert.equal(probabilityText(1), "1.00");
});

test("texNumber writes the minus sign and degrees in TeX", () => {
  assert.equal(texNumber("−1.50"), "-1.50");
  assert.equal(texNumber("−90°"), "-90^{\\circ}");
});

test("steadyTex leaves room for the widest value with a phantom, and none when the number is the widest", () => {
  assert.equal(steadyTex("5", "40"), "{\\phantom{40}\\llap{5}}");
  assert.equal(steadyTex("40", "5"), "{40}");
  // Room for digits, but not for a sign.
  assert.equal(steadyFixedTex(0.5, -2.6, 12), "{\\phantom{12.00}\\llap{0.50}}");
  assert.equal(steadyFixedTex(0.5, -2.6, 2.6), "{0.50}");
});

test("texAt substitutes the value for x, but not for the x in a command", () => {
  assert.equal(texAt("x^2", "1.50"), "(1.50)^2");
  assert.equal(texAt("\\tfrac{1}{2} + \\sin x", "-0.50"), "\\tfrac{1}{2} + \\sin (-0.50)");
  assert.equal(texAt("\\exp x", "2"), "\\exp (2)");
});

test("GpsFlight takes a reading each period at the drone's position, and drops the ones far behind", () => {
  const flight = new GpsFlight(seeded(1), 0.5, 0.5, 0.25, 1);
  flight.step(0.01);
  assert.equal(flight.readings.length, 1);
  for (let i = 0; i < 99; i++) flight.step(0.01);
  // One second: readings at 0, 0.25, 0.5, 0.75, and 1, at the drone's position then.
  assert.equal(flight.readings.length, 5);
  assertClose(flight.readings[2].at[0], 0.25, 1e-9);
  assert.equal(flight.readings[2].at[1], 0.5);
  assertClose(flight.position()[0], 0.5, 1e-9);
  // After four seconds, the drone is at x = 2, and only the readings within 1 behind it are kept.
  for (let i = 0; i < 300; i++) flight.step(0.01);
  assert.ok(flight.readings.every(r => r.at[0] > flight.position()[0] - 1));
  // The readings from times 2.25 to 4 (the last one depends on rounding in the sum of the steps).
  assert.ok(flight.readings.length >= 7 && flight.readings.length <= 8);
});

test("hash01 depends only on its input, and is between 0 and 1", () => {
  assert.equal(hash01(17), hash01(17));
  assert.notEqual(hash01(17), hash01(18));
  for (let i = -50; i < 50; i++) assert.ok(hash01(i) >= 0 && hash01(i) < 1);
});

test("nearestWithin finds the nearest point within the radius, the first among ties", () => {
  const pts = [{ x: 0, y: 0, id: "a" }, { x: 10, y: 0, id: "b" }, { x: 0, y: 0, id: "c" }];
  assert.equal(nearestWithin(pts, [8, 0], 5)?.id, "b");
  assert.equal(nearestWithin(pts, [1, 0], 5)?.id, "a");
  assert.equal(nearestWithin(pts, [5, 20], 5), null);
});

test("canvasRect leaves out the bands of the boxes along the top and the bottom", () => {
  const scene = { width: 400, height: 300 } as Scene;
  const box = (corner: string, offsetTop: number, offsetHeight: number, hidden = false) =>
    ({ dataset: { corner }, offsetTop, offsetHeight, hidden } as unknown as HTMLElement);
  assert.deepEqual(canvasRect(scene, 4), { x: 4, y: 4, w: 392, h: 292 });
  assert.deepEqual(canvasRect(scene, 4, box("top-left", 10, 50), box("bottom-right", 240, 50)), { x: 4, y: 64, w: 392, h: 172 });
  // A hidden box takes no room.
  assert.deepEqual(canvasRect(scene, 4, box("top-left", 10, 50, true), null), { x: 4, y: 4, w: 392, h: 292 });
});

test("areaCentroid is the centroid of the region under the graph, below the axis for a negative function", () => {
  // Under y = 1 on [0, 2]: a rectangle centered at (1, 1/2).
  const [x1, y1] = areaCentroid(() => 1, 0, 2);
  assertClose(x1, 1, 1e-9);
  assertClose(y1, 0.5, 1e-9);
  // Under y = x on [0, 1]: a triangle, centered at (2/3, 1/3).
  const [x2, y2] = areaCentroid(x => x, 0, 1, 2000);
  assertClose(x2, 2 / 3, 1e-6);
  assertClose(y2, 1 / 3, 1e-6);
  // Above y = −1 on [0, 2]: centered at (1, −1/2).
  assertClose(areaCentroid(() => -1, 0, 2)[1], -0.5, 1e-9);
});

test("texColor colors TeX with an HTML color", () => {
  assert.equal(texColor("#0072b2", "0.68"), "{\\color[RGB]{0,114,178}{0.68}}");
});
