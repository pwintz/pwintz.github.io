// ╭───────────────────────────────────────────────────────────────╮
// │         Plane geometry for the dictionary's figures            │
// ╰───────────────────────────────────────────────────────────────╯
// Sets in ℝ² are drawn as polygons with many sides: smooth "blobs" for general sets and
// circles for balls. These functions build them and answer the questions the figures ask:
// is a point inside, and how far is it from the boundary (the radius of the largest open ball
// around the point that fits inside)?

export type Pt = [number, number];

/**
 * A smooth, star-shaped set: in the direction at angle θ from `center`, its boundary is at distance
 * radius + Σ amp · cos(k θ + phase). Keep Σ |amp| below `radius` so that the distance stays positive.
 */
export interface Blob {
  center: Pt;
  radius: number;
  wobble: [k: number, amp: number, phase: number][];
}

/** The boundary of the blob as a polygon with `n` vertices, counterclockwise. */
export function blobBoundary(b: Blob, n = 240): Pt[] {
  return Array.from({ length: n }, (_, i): Pt => {
    const t = (2 * Math.PI * i) / n;
    const r = b.radius + b.wobble.reduce((s, [k, amp, phase]) => s + amp * Math.cos(k * t + phase), 0);
    return [b.center[0] + r * Math.cos(t), b.center[1] + r * Math.sin(t)];
  });
}

/** The circle of radius r around c as a polygon with `n` vertices. */
export function circlePoints(c: Pt, r: number, n = 120): Pt[] {
  return Array.from({ length: n }, (_, i): Pt => {
    const t = (2 * Math.PI * i) / n;
    return [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)];
  });
}

/** The polygon moved by (dx, dy). */
export const translate = (poly: Pt[], dx: number, dy: number): Pt[] => poly.map(([x, y]): Pt => [x + dx, y + dy]);

/** The polygon scaled by s about the point c. */
export const scaleAbout = (poly: Pt[], c: Pt, s: number): Pt[] =>
  poly.map(([x, y]): Pt => [c[0] + s * (x - c[0]), c[1] + s * (y - c[1])]);

/** Whether p is strictly inside the polygon (ray casting; points on an edge may go either way). */
export function pointInPolygon(p: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < xi + ((p[1] - yi) * (xj - xi)) / (yj - yi)) inside = !inside;
  }
  return inside;
}

/** The point of the segment from a to b nearest to p. */
export function nearestOnSegment(p: Pt, a: Pt, b: Pt): Pt {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2));
  return [a[0] + t * dx, a[1] + t * dy];
}

/** The distance from p to the polyline through the points (not closed), or Infinity for an empty one. */
export function distanceToPolyline(p: Pt, points: Pt[]): number {
  if (points.length === 1) return Math.hypot(points[0][0] - p[0], points[0][1] - p[1]);
  let best = Infinity;
  for (let i = 1; i < points.length; i++) {
    const q = nearestOnSegment(p, points[i - 1], points[i]);
    best = Math.min(best, Math.hypot(q[0] - p[0], q[1] - p[1]));
  }
  return best;
}

/** The point of the polygon's boundary nearest to p. */
export function nearestOnBoundary(p: Pt, poly: Pt[]): Pt {
  let best: Pt = poly[0], bestD = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const q = nearestOnSegment(p, poly[i], poly[(i + 1) % poly.length]);
    const d = Math.hypot(q[0] - p[0], q[1] - p[1]);
    if (d < bestD) { bestD = d; best = q; }
  }
  return best;
}

/** The distance from p to the polygon's boundary. */
export function distanceToBoundary(p: Pt, poly: Pt[]): number {
  const q = nearestOnBoundary(p, poly);
  return Math.hypot(q[0] - p[0], q[1] - p[1]);
}

/**
 * The first k such that the open ball of radius 1/k around a point lies inside an open set whose
 * boundary is at distance `dist` from the point. The ball of radius r fits when r ≤ dist, since
 * the open ball doesn't contain the points at distance exactly r.
 */
export function firstBasisBall(dist: number): number {
  if (!(dist > 0)) return Infinity;
  // Rounding: 1/k = dist exactly should give k, not k + 1.
  return Math.max(1, Math.ceil(1 / dist - 1e-9));
}
