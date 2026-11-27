// ╭───────────────────────────────────────────────────────────────╮
// │                 Angles for the dictionary's figures             │
// ╰───────────────────────────────────────────────────────────────╯
// Measures of angles between directions in the plane, in radians, and the bookkeeping for a turning
// motion that can go around more than once.

import { Pt } from "./geometry";

const TAU = 2 * Math.PI;

/** The direction of p from the origin, in (−π, π]. */
export const direction = (p: Pt) => Math.atan2(p[1], p[0]);

/** The angle t reduced to (−π, π]. */
export function wrap(t: number): number {
  let r = ((t + Math.PI) % TAU + TAU) % TAU - Math.PI;
  if (r <= -Math.PI) r += TAU;
  return r;
}

/** The measure of the angle between nonzero vectors u and v, in [0, π]. */
export function angleBetween(u: Pt, v: Pt): number {
  return Math.abs(signedAngle(u, v));
}

/** The signed angle from u to v, in (−π, π]: positive when turning u toward v the short way is counterclockwise. */
export function signedAngle(u: Pt, v: Pt): number {
  const t = Math.atan2(u[0] * v[1] - u[1] * v[0], u[0] * v[0] + u[1] * v[1]);
  // atan2(0, negative) is π, and atan2(−0, negative) is −π; both mean opposite directions.
  return t === -Math.PI ? Math.PI : t;
}

export type AngleKind = "zero" | "acute" | "right" | "obtuse" | "straight";

/** The kind of an angle with the measure `deg` in degrees, from 0 to 180, rounded to whole degrees. */
export function angleKind(deg: number): AngleKind {
  const d = Math.round(deg);
  return d <= 0 ? "zero" : d < 90 ? "acute" : d === 90 ? "right" : d < 180 ? "obtuse" : "straight";
}

/**
 * The direction `t`, moved onto `base + target` or `base − target` for the first target (in radians)
 * that it is within `tol` of, so that the reader can reach a right or straight angle exactly.
 */
export function snapDirection(t: number, base: number, targets: number[], tol: number): number {
  for (const target of targets) {
    for (const sgn of [1, -1]) {
      const want = base + sgn * target;
      if (Math.abs(wrap(t - want)) < tol) return wrap(want);
    }
  }
  return t;
}

/**
 * The total angle turned by something whose direction went from `from` to `to` in one small step,
 * added to `total`: the step is taken the short way, so that turning around more than once adds up.
 */
export const accumulate = (total: number, from: number, to: number) => total + wrap(to - from);

/**
 * Points along a spiral that shows a turn of `total` radians starting at the direction `start`:
 * the radius grows by `growth` for each full turn, so that the turns don't lie on top of each other.
 */
export function turnSpiral(start: number, total: number, r0: number, growth: number, stepsPerTurn = 120): Pt[] {
  const n = Math.max(2, Math.ceil((Math.abs(total) / TAU) * stepsPerTurn));
  return Array.from({ length: n + 1 }, (_, i): Pt => {
    const t = (total * i) / n;
    const r = r0 + (growth * Math.abs(t)) / TAU;
    return [r * Math.cos(start + t), r * Math.sin(start + t)];
  });
}
