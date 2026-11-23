// ╭───────────────────────────────────────────────────────────────╮
// │                Arrangements of the hydrophones                │
// ╰───────────────────────────────────────────────────────────────╯
// Each preset places n hydrophones with neighbors about `spacing` apart, centered under the
// origin, at depths z from 0 (the whale's depth) down to `depth`. The whale's track is parallel to
// the x-axis, so the lines run alongside it.

import { Point3 } from "./reflections";

export const LAYOUTS = [
  "level", "slope", "alternate", "valley", "scattered", // Lines along x, at various depths
  "vertical", "grid", "ring", "helix", "box",            // Arrangements in a plane or in 3D
  "singleLevel", "singleFloor", "singleSurface",         // One hydrophone
] as const;
export type Layout = typeof LAYOUTS[number];

// The number of hydrophones each layout starts with, which shows its shape best: a full grid,
// a ring, or all eight corners of a box.
export const LAYOUT_COUNTS: Record<Layout, number> = {
  level: 5, slope: 5, alternate: 6, valley: 5, scattered: 6,
  vertical: 5, grid: 6, ring: 6, helix: 8, box: 8,
  singleLevel: 1, singleFloor: 1, singleSurface: 1,
};

// Layouts whose hydrophones are all at the whale's depth, so the depth setting doesn't apply.
export const FLAT_LAYOUTS: readonly Layout[] = ["level", "grid", "ring", "singleLevel"];
// Layouts that place hydrophones at fixed depths, so the greatest-depth setting doesn't apply.
export const FIXED_DEPTH_LAYOUTS: readonly Layout[] = [...FLAT_LAYOUTS, "singleFloor", "singleSurface"];

// How far below the sea surface the "singleSurface" hydrophone hangs, as from a buoy (m).
export const SURFACE_PHONE_DEPTH = 10;

// Fixed "random" fractions of the maximum depth, so the scattered arrangement doesn't jump around.
const SCATTER = [0.55, 0.1, 0.85, 0.35, 1.0, 0.2, 0.7, 0.45];

// Corners of a unit cube (x and y from −½ to ½, z from 0 to 1), ordered so that the first four
// form a tetrahedron, which spreads a few hydrophones as widely as possible in 3D.
const CUBE: [number, number, number][] = [
  [-0.5, -0.5, 0], [0.5, 0.5, 0], [0.5, -0.5, 1], [-0.5, 0.5, 1],
  [0.5, -0.5, 0], [-0.5, 0.5, 0], [-0.5, -0.5, 1], [0.5, 0.5, 1],
];

// `surface` and `floor` are the depths of the sea surface above the whale and the seafloor below
// it (m), for the layouts placed at those boundaries; the "singleSurface" hydrophone is above the
// whale, so its depth z is negative.
export function layoutPhones(layout: string, n: number, spacing: number, depth: number,
                             surface = Infinity, floor = Infinity): Point3[] {
  const along = (i: number) => (i - (n - 1) / 2) * spacing; // Position along a centered line
  const frac  = (i: number) => (n === 1 ? 1 : i / (n - 1));  // 0 for the first, 1 for the last
  return Array.from({ length: n }, (_, i): Point3 => {
    switch (layout) {
      case "slope"     : return { x: along(i), y: 0, z: depth * frac(i) };
      case "alternate" : return { x: along(i), y: 0, z: i % 2 === 0 ? 0 : depth };
      case "valley"    : return { x: along(i), y: 0, z: depth * (1 - Math.abs(2 * frac(i) - 1)) };
      case "scattered" : return { x: along(i), y: 0, z: depth * SCATTER[i % SCATTER.length] };
      // A vertical string, as hung from a buoy, from the whale's depth down to the greatest depth.
      case "vertical"  : return { x: 0, y: 0, z: n === 1 ? 0 : depth * frac(i) };
      // A square-ish grid in the horizontal plane, filled row by row.
      case "grid": {
        const cols = Math.ceil(Math.sqrt(n)), rows = Math.ceil(n / cols);
        const r = Math.floor(i / cols), c = i % cols;
        return { x: (c - (cols - 1) / 2) * spacing, y: (r - (rows - 1) / 2) * spacing, z: 0 };
      }
      // A horizontal circle with neighbors `spacing` apart along it.
      case "ring": case "helix": {
        if (n === 1) return { x: 0, y: 0, z: 0 };
        const radius = spacing / (2 * Math.sin(Math.PI / n));
        const a = (2 * Math.PI * i) / n;
        return { x: radius * Math.cos(a), y: radius * Math.sin(a), z: layout === "helix" ? depth * frac(i) : 0 };
      }
      // The corners of a box `spacing` wide, from the whale's depth down to the greatest depth.
      case "box": {
        const [cx, cy, cz] = CUBE[i % CUBE.length];
        return { x: cx * spacing, y: cy * spacing, z: cz * depth };
      }
      // A line on the seafloor, or hanging just below the surface; a single hydrophone by default.
      case "singleFloor"  : return { x: along(i), y: 0, z: floor };
      case "singleSurface": return { x: along(i), y: 0, z: -Math.max(0, surface - SURFACE_PHONE_DEPTH) };
      default: return { x: along(i), y: 0, z: 0 }; // "level": a line at the whale's depth
    }
  });
}
