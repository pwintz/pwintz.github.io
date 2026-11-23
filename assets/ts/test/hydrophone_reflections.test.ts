import { test } from "node:test";
import assert from "node:assert/strict";
import { assertClose } from "./helpers";
import {
  Boundaries, SEAFLOOR_GAIN, SURFACE_GAIN, bouncePoint, mirror, soundPaths,
} from "../src/hydrophone_array/reflections";

const B: Boundaries = { surface: 100, floor: 500, echoes: { surface: true, seafloor: true } };

test("mirror images across the surface and seafloor", () => {
  const ph = { x: 3, y: 4, z: 200 };
  assert.deepEqual(mirror(ph, "surface", B),  { x: 3, y: 4, z: -400 }); // 300 m below the surface → 300 m above it
  assert.deepEqual(mirror(ph, "seafloor", B), { x: 3, y: 4, z: 800 });  // 300 m above the floor → 300 m below it
});

test("sound paths include only the reflections that are switched on", () => {
  const ph = { x: 0, y: 0, z: 0 };
  assert.deepEqual(soundPaths(ph, { ...B, echoes: { surface: false, seafloor: false } }).map(p => p.kind), ["direct"]);
  const paths = soundPaths(ph, B);
  assert.deepEqual(paths.map(p => p.kind), ["direct", "surface", "seafloor"]);
  assert.deepEqual(paths.map(p => p.gain), [1, SURFACE_GAIN, SEAFLOOR_GAIN]);
  assert.equal(paths[0].receiver, ph);
});

test("a reflected path is longer than the direct one by the image geometry", () => {
  // Whale and hydrophone both at the whale's depth, 800 m apart horizontally: the surface echo
  // travels √(800² + 200²).
  const whale = { x: 0, y: 0, z: 0 }, ph = { x: 800, y: 0, z: 0 };
  const image = mirror(ph, "surface", B);
  assertClose(Math.hypot(image.x - whale.x, image.z - whale.z), Math.hypot(800, 200));
});

test("the bounce point lies on the boundary, halfway across for equal depths", () => {
  const whale = { x: 0, y: 0, z: 0 }, ph = { x: 800, y: 600, z: 0 };
  const p = bouncePoint(whale, mirror(ph, "surface", B), "surface", B);
  assertClose(p.x, 400);
  assertClose(p.y, 300);
  assert.equal(p.z, -100);
  // Angle of incidence equals angle of reflection: equal horizontal run per unit of vertical drop.
  const deep = { x: 900, y: 0, z: 300 };
  const q = bouncePoint(whale, mirror(deep, "seafloor", B), "seafloor", B);
  assert.equal(q.z, 500);
  assertClose(q.x / 500, (900 - q.x) / 200);
});
