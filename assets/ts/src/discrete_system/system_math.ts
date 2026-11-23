// ╭───────────────────────────────────────────────────────────────╮
// │        The discrete-time linear system x_{k+1} = A x_k         │
// ╰───────────────────────────────────────────────────────────────╯
// Shared by the discrete linear system tool (../discrete_linear_system.ts) and its tests.
//
// For a 2 × 2 matrix A, `eigenInfo` sorts A into one of four cases:
//   "real":      two distinct real eigenvalues, with an eigenvector for each;
//   "scalar":    A = λI, so every nonzero vector is an eigenvector;
//   "defective": one repeated eigenvalue with only one eigenvector line;
//   "complex":   a pair of complex eigenvalues a ± bi = r e^{±iθ}, so no real eigenvector.
// In the "real" case, every x₀ is a combination c₁v₁ + c₂v₂, and x_k = c₁λ₁ᵏv₁ + c₂λ₂ᵏv₂.

export type Vec2 = [number, number];
export type Mat2 = [[number, number], [number, number]];

export type EigenInfo =
  | { kind: "real"; values: [number, number]; vectors: [Vec2, Vec2] }
  | { kind: "scalar"; value: number }
  | { kind: "defective"; value: number; vector: Vec2 }
  | { kind: "complex"; re: number; im: number; modulus: number; angle: number };

const EPS = 1e-9;

export const apply = (A: Mat2, x: Vec2): Vec2 => [A[0][0] * x[0] + A[0][1] * x[1], A[1][0] * x[0] + A[1][1] * x[1]];
export const norm = (x: Vec2) => Math.hypot(x[0], x[1]);

/** x₀, x₁ = Ax₀, …, x_n. */
export function trajectory(A: Mat2, x0: Vec2, n: number): Vec2[] {
  const xs: Vec2[] = [x0];
  for (let k = 0; k < n; k++) xs.push(apply(A, xs[k]));
  return xs;
}

/**
 * Scales an eigenvector so that it reads simply: its component of smallest nonzero size becomes
 * ±1 (so (2, 4) becomes (1, 2)), and its first nonzero component is positive.
 */
export function niceVector(v: Vec2): Vec2 {
  const sizes = v.map(Math.abs).filter(s => s > EPS);
  if (sizes.length === 0) return [0, 0];
  let w = v.map(c => c / Math.min(...sizes)) as Vec2;
  const first = Math.abs(w[0]) > EPS ? w[0] : w[1];
  if (first < 0) w = [-w[0], -w[1]];
  // Clean rounding errors, so that 0.9999999999 reads as 1.
  return w.map(c => (Math.abs(c - Math.round(c)) < 1e-9 ? Math.round(c) : c) + 0) as Vec2;
}

/** An eigenvector of A for the real eigenvalue λ: a nonzero solution of (A − λI)v = 0. */
export function eigenvectorFor(A: Mat2, lambda: number): Vec2 {
  const [[a, b], [c, d]] = A;
  // Each row (p, q) of A − λI is orthogonal to v, so v = (q, −p) for the larger row.
  const r1: Vec2 = [a - lambda, b], r2: Vec2 = [c, d - lambda];
  const row = norm(r1) >= norm(r2) ? r1 : r2;
  if (norm(row) < EPS) return [1, 0];
  return niceVector([row[1], -row[0]]);
}

export function eigenInfo(A: Mat2): EigenInfo {
  const [[a, b], [c, d]] = A;
  const tr = a + d, det = a * d - b * c;
  const disc = tr * tr - 4 * det;
  const scale = Math.max(1, Math.abs(a), Math.abs(b), Math.abs(c), Math.abs(d));
  if (Math.abs(disc) <= 1e-12 * scale * scale) {
    const value = tr / 2;
    if (Math.abs(b) < EPS && Math.abs(c) < EPS) return { kind: "scalar", value };
    return { kind: "defective", value, vector: eigenvectorFor(A, value) };
  }
  if (disc < 0) {
    const re = tr / 2, im = Math.sqrt(-disc) / 2;
    return { kind: "complex", re, im, modulus: Math.hypot(re, im), angle: Math.atan2(im, re) };
  }
  // The larger eigenvalue in size comes first: it decides what x_k looks like for large k.
  const s = Math.sqrt(disc);
  let values: [number, number] = [(tr + s) / 2, (tr - s) / 2];
  if (Math.abs(values[1]) > Math.abs(values[0]) + EPS) values = [values[1], values[0]];
  return { kind: "real", values, vectors: [eigenvectorFor(A, values[0]), eigenvectorFor(A, values[1])] };
}

/** The coefficients c such that c₁v₁ + c₂v₂ = x (the eigenvector coordinates of x). */
export function coordinates(vectors: [Vec2, Vec2], x: Vec2): Vec2 {
  const [[p, r], [q, s]] = vectors;   // The columns v₁ = (p, r) and v₂ = (q, s)
  const det = p * s - q * r;
  return [(s * x[0] - q * x[1]) / det, (p * x[1] - r * x[0]) / det];
}

/** The two parts c₁λ₁ᵏv₁ and c₂λ₂ᵏv₂ of x_k, whose sum is x_k. */
export function partsAt(values: [number, number], vectors: [Vec2, Vec2], c: Vec2, k: number): [Vec2, Vec2] {
  return [0, 1].map(i => {
    const f = c[i] * values[i] ** k;
    return [f * vectors[i][0], f * vectors[i][1]];
  }) as [Vec2, Vec2];
}

/** If x lies within `tolerance` radians of the line through v, the point on that line nearest x. */
export function snapToLine(x: Vec2, v: Vec2, tolerance: number): Vec2 | null {
  const n = norm(v);
  if (n < EPS || norm(x) < EPS) return null;
  const u: Vec2 = [v[0] / n, v[1] / n];
  const along = x[0] * u[0] + x[1] * u[1];
  const across = x[0] * u[1] - x[1] * u[0];
  if (Math.abs(Math.atan2(Math.abs(across), Math.abs(along))) > tolerance) return null;
  return [along * u[0], along * u[1]];
}

// ⋘──────── What happens as k grows ────────⋙

export type Fate = "decays" | "grows" | "bounded" | "saddle";

/**
 * The long-run behavior of x_k for a typical starting state, from the sizes |λ| of the eigenvalues:
 *   "decays":  every |λ| < 1, so x_k → 0 for every x₀;
 *   "grows":   the largest |λ| is greater than 1 and the smallest |λ| is at least 1, or A is
 *              defective with |λ| = 1 (then x_k grows like k);
 *   "saddle":  one |λ| > 1 and one |λ| < 1;
 *   "bounded": the largest |λ| is 1 and A has two independent eigenvectors (real or complex), so x_k
 *              neither decays to 0 nor grows without bound.
 */
export function fate(info: EigenInfo): Fate {
  const TOL = 1e-9;
  const sizes = info.kind === "real" ? info.values.map(Math.abs)
    : info.kind === "complex" ? [info.modulus, info.modulus] : [Math.abs(info.value), Math.abs(info.value)];
  const big = Math.max(...sizes), small = Math.min(...sizes);
  if (big < 1 - TOL) return "decays";
  if (big <= 1 + TOL) return info.kind === "defective" ? "grows" : "bounded";
  return small < 1 - TOL ? "saddle" : "grows";
}

// ⋘──────── Between two steps (for the animation) ────────⋙
// The page animates the step from p to Ap. Where A has two real eigenvectors, the point moves so
// that each eigenvector coefficient goes from c to cλ smoothly: geometrically (c λ^t) when c and cλ
// have the same sign, so the motion matches the growth or decay of each part, and in a straight
// line through 0 when λ < 0 flips the part. Otherwise (complex eigenvalues, or one eigenvector
// line), the point turns and scales: its angle changes linearly and its length geometrically.

/** A value between a (at t = 0) and b (at t = 1): geometric if they share a sign, linear otherwise. */
export function blend(a: number, b: number, t: number): number {
  if (a * b > 0) return a * (b / a) ** t;
  return a + (b - a) * t;
}

/** The point between p (t = 0) and q (t = 1) that turns by the smaller angle and scales geometrically. */
export function turnBetween(p: Vec2, q: Vec2, t: number): Vec2 {
  const r0 = norm(p), r1 = norm(q);
  if (r0 < EPS || r1 < EPS) return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const a0 = Math.atan2(p[1], p[0]);
  let turn = Math.atan2(q[1], q[0]) - a0;
  while (turn > Math.PI) turn -= 2 * Math.PI;
  while (turn <= -Math.PI) turn += 2 * Math.PI;
  const r = blend(r0, r1, t), a = a0 + turn * t;
  return [r * Math.cos(a), r * Math.sin(a)];
}

/** The point a fraction t of the way through the step from p to Ap. */
export function stepBetween(A: Mat2, info: EigenInfo, p: Vec2, t: number): Vec2 {
  if (t <= 0) return p;
  const q = apply(A, p);
  if (t >= 1) return q;
  if (info.kind === "real") {
    const c = coordinates(info.vectors, p);
    const f = [0, 1].map(i => blend(c[i], c[i] * info.values[i], t));
    return [0, 1].map(j => f[0] * info.vectors[0][j] + f[1] * info.vectors[1][j]) as Vec2;
  }
  if (info.kind === "scalar") {
    const f = blend(1, info.value, t);
    return [f * p[0], f * p[1]];
  }
  return turnBetween(p, q, t);
}
