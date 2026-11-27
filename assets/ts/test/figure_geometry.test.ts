import { test } from "node:test";
import assert from "node:assert/strict";
import { assertClose } from "./helpers";
import {
  Pt, blobBoundary, circlePoints, distanceToBoundary, distanceToPolyline, firstBasisBall, nearestOnBoundary, nearestOnSegment,
  pointInPolygon, scaleAbout, translate,
} from "../src/figures/geometry";

const square: Pt[] = [[0, 0], [2, 0], [2, 2], [0, 2]];

test("pointInPolygon tells inside from outside", () => {
  assert.equal(pointInPolygon([1, 1], square), true);
  assert.equal(pointInPolygon([0.1, 1.9], square), true);
  assert.equal(pointInPolygon([3, 1], square), false);
  assert.equal(pointInPolygon([1, -0.1], square), false);
  // A nonconvex polygon: an L shape, whose notch is outside.
  const ell: Pt[] = [[0, 0], [2, 0], [2, 1], [1, 1], [1, 2], [0, 2]];
  assert.equal(pointInPolygon([0.5, 1.5], ell), true);
  assert.equal(pointInPolygon([1.5, 1.5], ell), false);
});

test("nearestOnSegment clamps to the endpoints", () => {
  assert.deepEqual(nearestOnSegment([1, 5], [0, 0], [2, 0]), [1, 0]);
  assert.deepEqual(nearestOnSegment([-3, 1], [0, 0], [2, 0]), [0, 0]);
  assert.deepEqual(nearestOnSegment([9, 9], [0, 0], [2, 0]), [2, 0]);
  // A segment that is a single point.
  assert.deepEqual(nearestOnSegment([1, 1], [0, 0], [0, 0]), [0, 0]);
});

test("distanceToBoundary measures to the nearest edge, from inside or outside", () => {
  assertClose(distanceToBoundary([1, 1], square), 1);
  assertClose(distanceToBoundary([0.25, 1], square), 0.25);
  assertClose(distanceToBoundary([3, 1], square), 1);
  assertClose(distanceToBoundary([3, 3], square), Math.SQRT2);
  assert.deepEqual(nearestOnBoundary([1, 1.75], square), [1, 2]);
});

test("a circle polygon is close to the circle", () => {
  const c = circlePoints([1, -1], 0.5, 360);
  assert.equal(c.length, 360);
  for (const [x, y] of c) assertClose(Math.hypot(x - 1, y + 1), 0.5);
  // The inscribed polygon's edges are within r(1 − cos(π/n)) of the circle.
  assertClose(distanceToBoundary([1, -1], c), 0.5, 0.5 * (1 - Math.cos(Math.PI / 360)) + 1e-12);
});

test("a blob without wobble is a circle, and its boundary stays at the given radius", () => {
  for (const [x, y] of blobBoundary({ center: [0, 0], radius: 2, wobble: [] }, 60)) assertClose(Math.hypot(x, y), 2);
  const b = blobBoundary({ center: [1, 1], radius: 1, wobble: [[2, 0.3, 0]] }, 4);
  // At θ = 0, π/2, π, 3π/2, cos(2θ) is 1, −1, 1, −1.
  assertClose(b[0][0], 2.3);
  assertClose(b[1][1], 1.7);
  assert.equal(pointInPolygon([1, 1], blobBoundary({ center: [1, 1], radius: 1, wobble: [[3, 0.2, 1]] })), true);
});

test("translate and scaleAbout move and resize polygons", () => {
  assert.deepEqual(translate(square, 1, -1)[2], [3, 1]);
  const half = scaleAbout(square, [1, 1], 0.5);
  assert.deepEqual(half[0], [0.5, 0.5]);
  assert.deepEqual(half[2], [1.5, 1.5]);
});

test("firstBasisBall finds the first ball of radius 1/k that fits", () => {
  assert.equal(firstBasisBall(2), 1);
  assert.equal(firstBasisBall(1), 1);       // The open ball of radius 1 fits when the boundary is at distance 1.
  assert.equal(firstBasisBall(0.99), 2);
  assert.equal(firstBasisBall(0.5), 2);
  assert.equal(firstBasisBall(1 / 3), 3);
  assert.equal(firstBasisBall(0.3), 4);
  assert.equal(firstBasisBall(0), Infinity);
  assert.equal(firstBasisBall(-1), Infinity);
});

test("distanceToPolyline measures to the nearest piece, without closing the polyline", () => {
  const ell: Pt[] = [[0, 0], [2, 0], [2, 2]];
  assertClose(distanceToPolyline([1, 1], ell), 1);
  assertClose(distanceToPolyline([3, 1], ell), 1);
  // Nearer the missing closing side, from (2, 2) back to (0, 0), than to the polyline.
  assertClose(distanceToPolyline([0.5, 1.5], ell), 1.5);
  assertClose(distanceToPolyline([1, 1], [[0, 0]]), Math.SQRT2);
  assert.equal(distanceToPolyline([1, 1], []), Infinity);
});
