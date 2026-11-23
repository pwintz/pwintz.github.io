import { test } from "node:test";
import assert from "node:assert/strict";
import { assertClose } from "./helpers";
import { FLAT_LAYOUTS, LAYOUTS, LAYOUT_COUNTS, SURFACE_PHONE_DEPTH, layoutPhones } from "../src/hydrophone_array/layouts";

test("every layout places n hydrophones within the depth range", () => {
  for (const layout of LAYOUTS.filter(l => l !== "singleFloor" && l !== "singleSurface")) {
    for (const n of [1, 2, 5, 8]) {
      const phones = layoutPhones(layout, n, 400, 600);
      assert.equal(phones.length, n, layout);
      for (const p of phones) {
        assert.ok(p.z >= 0 && p.z <= 600, `${layout} depth ${p.z}`);
        if (FLAT_LAYOUTS.includes(layout)) assert.equal(p.z, 0, layout);
      }
    }
  }
});

test("lines are centered with the given spacing", () => {
  const xs = layoutPhones("level", 5, 400, 600).map(p => p.x);
  assert.deepEqual(xs, [-800, -400, 0, 400, 800]);
  const slope = layoutPhones("slope", 3, 400, 600).map(p => p.z);
  assert.deepEqual(slope, [0, 300, 600]);
});

test("neighbors on a ring are one spacing apart", () => {
  const ring = layoutPhones("ring", 6, 400, 600);
  for (let i = 0; i < 6; i++) {
    const a = ring[i], b = ring[(i + 1) % 6];
    assertClose(Math.hypot(a.x - b.x, a.y - b.y), 400, 1e-9);
  }
});

test("a grid fills rows and columns around the origin", () => {
  const grid = layoutPhones("grid", 4, 100, 600);
  assert.deepEqual(grid.map(p => [p.x, p.y]), [[-50, -50], [50, -50], [-50, 50], [50, 50]]);
});

test("the first four box corners form a regular tetrahedron when the box is a cube", () => {
  const t = layoutPhones("box", 4, 100, 100);
  const d = (i: number, j: number) => Math.hypot(t[i].x - t[j].x, t[i].y - t[j].y, t[i].z - t[j].z);
  for (const [i, j] of [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]) assertClose(d(i, j), 100 * Math.SQRT2, 1e-9);
});

test("every layout has a starting number of hydrophones within the slider's range", () => {
  for (const layout of LAYOUTS) {
    const n = LAYOUT_COUNTS[layout];
    assert.ok(Number.isInteger(n) && n >= 1 && n <= 8, layout);
  }
});

test("single hydrophones sit on the seafloor or just below the surface", () => {
  assert.deepEqual(layoutPhones("singleFloor", 1, 400, 600, 300, 1000), [{ x: 0, y: 0, z: 1000 }]);
  assert.deepEqual(layoutPhones("singleSurface", 1, 400, 600, 300, 1000), [{ x: 0, y: 0, z: -(300 - SURFACE_PHONE_DEPTH) }]);
  assert.equal(LAYOUT_COUNTS.singleFloor, 1);
  assert.equal(LAYOUT_COUNTS.singleSurface, 1);
});
