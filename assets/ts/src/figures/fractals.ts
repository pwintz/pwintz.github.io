// ╭───────────────────────────────────────────────────────────────╮
// │        Self-similar sets, step by step, and their dimension      │
// ╰───────────────────────────────────────────────────────────────╯
// A self-similar set is made of N copies of itself, each scaled down by a factor of r. Scaling it
// up by r then gives N copies of the set, so its "size" is multiplied by N = r^d, and its
// (similarity, and here Hausdorff) dimension is d = log N / log r.
// Each construction lists its pieces copy by copy: the first 1/N of the list is the first copy.

import { Pt } from "./geometry";

/** The dimension d such that N = r^d. */
export const similarityDimension = (copies: number, factor: number) => Math.log(copies) / Math.log(factor);

/** The intervals left after `steps` steps of removing the open middle third of each interval of [0, 1]. */
export function cantorIntervals(steps: number): [number, number][] {
  let out: [number, number][] = [[0, 1]];
  for (let k = 0; k < steps; k++) {
    // Each interval becomes its left third and its right third. Doing every left third first
    // would mix the copies, so the list is rebuilt as two scaled copies of itself.
    out = [...out.map(([a, b]): [number, number] => [a / 3, b / 3]), ...out.map(([a, b]): [number, number] => [2 / 3 + a / 3, 2 / 3 + b / 3])];
  }
  return out;
}

/** The corners of the first triangle of the Sierpinski triangle, an equilateral triangle with side 1. */
export const SIERPINSKI_CORNERS: [Pt, Pt, Pt] = [[0, 0], [1, 0], [0.5, Math.sqrt(3) / 2]];

/** The triangles left after `steps` steps of removing the middle quarter of each triangle. */
export function sierpinskiTriangles(steps: number): [Pt, Pt, Pt][] {
  let out: [Pt, Pt, Pt][] = [SIERPINSKI_CORNERS];
  for (let k = 0; k < steps; k++) {
    // Three copies of the whole list, each scaled by 1/2 toward one corner.
    out = SIERPINSKI_CORNERS.flatMap(c =>
      out.map(tri => tri.map(([x, y]): Pt => [c[0] / 2 + x / 2, c[1] / 2 + y / 2]) as [Pt, Pt, Pt]));
  }
  return out;
}

/**
 * The polygonal curve after `steps` steps of replacing the middle third of each segment of the
 * segment from (0, 0) to (1, 0) by the two other sides of an equilateral triangle, pointing up.
 */
export function kochCurve(steps: number): Pt[] {
  let pts: Pt[] = [[0, 0], [1, 0]];
  for (let k = 0; k < steps; k++) {
    const next: Pt[] = [pts[0]];
    for (let i = 0; i + 1 < pts.length; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
      const dx = (bx - ax) / 3, dy = (by - ay) / 3;
      const p: Pt = [ax + dx, ay + dy], q: Pt = [ax + 2 * dx, ay + 2 * dy];
      // The peak: the middle third turned 60° counterclockwise about its start.
      const peak: Pt = [p[0] + dx / 2 - (dy * Math.sqrt(3)) / 2, p[1] + dy / 2 + (dx * Math.sqrt(3)) / 2];
      next.push(p, peak, q, [bx, by]);
    }
    pts = next;
  }
  return pts;
}

export type SelfSimilarShape = "segment" | "square" | "cantor" | "sierpinski" | "koch";

/** A ball (a disk in the plane), by its center and radius. */
export interface Ball { c: Pt; r: number }

/**
 * A cover of a self-similar set by balls, one for each of its pieces after k steps (each piece a
 * copy of the whole set scaled down k times): the ball around each piece with the piece's center.
 * The segment [0, 1] and the Cantor set lie on the x-axis, the square is [0, 1]², and the
 * Sierpinski triangle and the Koch curve are those of sierpinskiTriangles and kochCurve.
 */
export function coverBalls(shape: SelfSimilarShape, k: number): Ball[] {
  if (shape === "segment" || shape === "cantor") {
    const pieces = shape === "cantor" ? cantorIntervals(k)
      : Array.from({ length: 2 ** k }, (_, i): [number, number] => [i / 2 ** k, (i + 1) / 2 ** k]);
    return pieces.map(([a, b]) => ({ c: [(a + b) / 2, 0], r: (b - a) / 2 }));
  }
  if (shape === "square") {
    const n = 2 ** k, a = 1 / n;
    return Array.from({ length: n * n }, (_, i) => ({ c: [((i % n) + 0.5) * a, (Math.floor(i / n) + 0.5) * a] as Pt, r: a / Math.SQRT2 }));
  }
  if (shape === "sierpinski") {
    // The circle through a triangle's corners, around its centroid.
    return sierpinskiTriangles(k).map(t => {
      const a = Math.hypot(t[1][0] - t[0][0], t[1][1] - t[0][1]);
      return { c: [(t[0][0] + t[1][0] + t[2][0]) / 3, (t[0][1] + t[1][1] + t[2][1]) / 3] as Pt, r: a / Math.sqrt(3) };
    });
  }
  // Each piece of the Koch curve lies over a segment of step k (its base), within half the base's
  // length of the base's midpoint, since the curve rises only √3/6 of the base above it.
  const pts = kochCurve(k);
  return pts.slice(1).map(([bx, by], i) => {
    const [ax, ay] = pts[i];
    return { c: [(ax + bx) / 2, (ay + by) / 2] as Pt, r: Math.hypot(bx - ax, by - ay) / 2 };
  });
}

/** The sum of the diameters of the balls, each raised to the power s, as in the Hausdorff measure. */
export const coverSum = (balls: Ball[], s: number) => balls.reduce((sum, b) => sum + (2 * b.r) ** s, 0);
