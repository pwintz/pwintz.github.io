// ╭───────────────────────────────────────────────────────────────╮
// │            3D rotations and their representations             │
// ╰───────────────────────────────────────────────────────────────╯
// Conversions between unit quaternions, rotation matrices (elements of SO(3)), Euler angles (any
// of the twelve axis sequences, intrinsic or extrinsic), and axis–angle pairs.
//
// Conventions: rotations are active (they move vectors, v ↦ R v), matrices are row-major, axes are
// indexed X = 0, Y = 1, Z = 2, and angles are in radians.

export type Vec3 = [number, number, number];
export type Mat3 = number[][];
export interface Quat { w: number; x: number; y: number; z: number; }

export const IDENTITY: Quat = { w: 1, x: 0, y: 0, z: 0 };

// ⋘──────── Vectors and matrices ────────⋙

export const dot   = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec3, b: Vec3): Vec3 =>
  [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
export const addV  = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const norm  = (a: Vec3) => Math.hypot(a[0], a[1], a[2]);

export function normalize(a: Vec3): Vec3 {
  const n = norm(a);
  return n === 0 ? [0, 0, 0] : scale(a, 1 / n);
}

export function matMul(a: Mat3, b: Mat3): Mat3 {
  return [0, 1, 2].map(i => [0, 1, 2].map(j => a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j]));
}

export const matVec = (m: Mat3, v: Vec3): Vec3 => [
  m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
  m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
  m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
];

export const transpose = (m: Mat3): Mat3 => [0, 1, 2].map(i => [0, 1, 2].map(j => m[j][i]));

export function det(m: Mat3): number {
  return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
       - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
       + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
}

// The largest entry of RᵀR − I, which is 0 exactly when R is orthogonal.
export function orthogonalityError(m: Mat3): number {
  const p = matMul(transpose(m), m);
  let err = 0;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) err = Math.max(err, Math.abs(p[i][j] - (i === j ? 1 : 0)));
  return err;
}

// The rotation matrix nearest to m (the orthogonal factor of its polar decomposition), found by
// averaging m with its inverse transpose until it converges. Returns null if det m ≤ 0, since then
// the nearest orthogonal matrix is a reflection, not a rotation.
export function nearestRotation(m: Mat3): Mat3 | null {
  if (!(det(m) > 1e-9)) return null;
  let x = m.map(row => [...row]);
  for (let iter = 0; iter < 50; iter++) {
    const d = det(x);
    // Inverse transpose = cofactor matrix / det.
    const cof: Mat3 = [0, 1, 2].map(i => [0, 1, 2].map(j => {
      const r = [0, 1, 2].filter(k => k !== i), c = [0, 1, 2].filter(k => k !== j);
      const minor = x[r[0]][c[0]] * x[r[1]][c[1]] - x[r[0]][c[1]] * x[r[1]][c[0]];
      return ((i + j) % 2 === 0 ? 1 : -1) * minor;
    }));
    const next = x.map((row, i) => row.map((v, j) => (v + cof[i][j] / d) / 2));
    const change = Math.max(...next.flatMap((row, i) => row.map((v, j) => Math.abs(v - x[i][j]))));
    x = next;
    if (change < 1e-14) break;
  }
  return x;
}

// Rotation by angle a about coordinate axis i.
export function axisRotation(i: number, a: number): Mat3 {
  const c = Math.cos(a), s = Math.sin(a);
  if (i === 0) return [[1, 0, 0], [0, c, -s], [0, s, c]];
  if (i === 1) return [[c, 0, s], [0, 1, 0], [-s, 0, c]];
  return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
}

// ⋘──────── Quaternions ────────⋙

export function qMul(a: Quat, b: Quat): Quat {
  return {
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
  };
}

export const qNorm = (q: Quat) => Math.hypot(q.w, q.x, q.y, q.z);
export const qDot  = (a: Quat, b: Quat) => a.w * b.w + a.x * b.x + a.y * b.y + a.z * b.z;
export const qNeg  = (q: Quat): Quat => ({ w: -q.w, x: -q.x, y: -q.y, z: -q.z });

export function qNormalize(q: Quat): Quat {
  const n = qNorm(q);
  return n === 0 ? { ...IDENTITY } : { w: q.w / n, x: q.x / n, y: q.y / n, z: q.z / n };
}

// q and −q are the same rotation. Returns whichever of them is closer to `ref`, so that a
// quaternion computed from another representation doesn't flip sign from one moment to the next.
export const qNearest = (q: Quat, ref: Quat) => (qDot(q, ref) < 0 ? qNeg(q) : q);

export function qFromAxisAngle(axis: Vec3, angle: number): Quat {
  const n = normalize(axis), s = Math.sin(angle / 2);
  return { w: Math.cos(angle / 2), x: n[0] * s, y: n[1] * s, z: n[2] * s };
}

// The angle is in [0, 2π]: q = cos(θ/2) + sin(θ/2) n, with the sign of q kept as given (so −q
// gives the angle 2π − θ about −n, which is the same rotation). For the identity, the axis is
// arbitrary and returned as the z-axis.
export function qToAxisAngle(q: Quat): { axis: Vec3; angle: number } {
  const s = Math.hypot(q.x, q.y, q.z);
  if (s < 1e-12) return { axis: [0, 0, 1], angle: q.w >= 0 ? 0 : 2 * Math.PI };
  return { axis: [q.x / s, q.y / s, q.z / s], angle: 2 * Math.atan2(s, q.w) };
}

export function qToMat(q: Quat): Mat3 {
  const { w, x, y, z } = q;
  return [
    [1 - 2 * (y * y + z * z), 2 * (x * y - w * z),     2 * (x * z + w * y)],
    [2 * (x * y + w * z),     1 - 2 * (x * x + z * z), 2 * (y * z - w * x)],
    [2 * (x * z - w * y),     2 * (y * z + w * x),     1 - 2 * (x * x + y * y)],
  ];
}

// Shepperd's method: divide by the largest of the four possible denominators, for accuracy.
export function matToQuat(r: Mat3): Quat {
  const tr = r[0][0] + r[1][1] + r[2][2];
  let q: Quat;
  if (tr > 0) {
    const s = 2 * Math.sqrt(tr + 1);
    q = { w: s / 4, x: (r[2][1] - r[1][2]) / s, y: (r[0][2] - r[2][0]) / s, z: (r[1][0] - r[0][1]) / s };
  } else if (r[0][0] > r[1][1] && r[0][0] > r[2][2]) {
    const s = 2 * Math.sqrt(1 + r[0][0] - r[1][1] - r[2][2]);
    q = { w: (r[2][1] - r[1][2]) / s, x: s / 4, y: (r[0][1] + r[1][0]) / s, z: (r[0][2] + r[2][0]) / s };
  } else if (r[1][1] > r[2][2]) {
    const s = 2 * Math.sqrt(1 + r[1][1] - r[0][0] - r[2][2]);
    q = { w: (r[0][2] - r[2][0]) / s, x: (r[0][1] + r[1][0]) / s, y: s / 4, z: (r[1][2] + r[2][1]) / s };
  } else {
    const s = 2 * Math.sqrt(1 + r[2][2] - r[0][0] - r[1][1]);
    q = { w: (r[1][0] - r[0][1]) / s, x: (r[0][2] + r[2][0]) / s, y: (r[1][2] + r[2][1]) / s, z: s / 4 };
  }
  return qNormalize(q);
}

// A rotation drawn uniformly at random (Shoemake's method).
export function qRandom(): Quat {
  const u1 = Math.random(), u2 = 2 * Math.PI * Math.random(), u3 = 2 * Math.PI * Math.random();
  const a = Math.sqrt(1 - u1), b = Math.sqrt(u1);
  return { w: a * Math.sin(u2), x: a * Math.cos(u2), y: b * Math.sin(u3), z: b * Math.cos(u3) };
}

// ⋘──────── Euler angles ────────⋙
// A sequence is three axis indices, such as [2, 1, 0] for z-y-x. With angles (a, b, c):
//   intrinsic: rotate by a about the first axis, then by b about the *rotated* second axis, then
//              by c about the twice-rotated third axis, so R = R₁(a) R₂(b) R₃(c);
//   extrinsic: rotate about the fixed axes in order, so R = R₃(c) R₂(b) R₁(a).
// An extrinsic sequence is therefore the reversed intrinsic sequence with the angles reversed.
// Tait–Bryan sequences use three different axes (such as z-y-x, for yaw, pitch, and roll) and
// proper Euler sequences repeat the first axis (such as z-x-z).

export type Sequence = [number, number, number];

export const isProper = (seq: Sequence) => seq[0] === seq[2];

export function eulerToMat(seq: Sequence, angles: Vec3, extrinsic: boolean): Mat3 {
  const [r1, r2, r3] = seq.map((axis, n) => axisRotation(axis, angles[n]));
  return extrinsic ? matMul(r3, matMul(r2, r1)) : matMul(r1, matMul(r2, r3));
}

// Within EPS of gimbal lock, the first and third angles can't be separated, so the third is set to
// 0 and the first takes the whole rotation about the shared axis.
const GIMBAL_EPS = 1e-7;

// Angles in (−π, π], except the middle one, which is in [−π/2, π/2] for Tait–Bryan sequences and
// in [0, π] for proper Euler sequences.
export function matToEuler(r: Mat3, seq: Sequence, extrinsic: boolean): Vec3 {
  if (extrinsic) {
    const [c, b, a] = matToEulerIntrinsic(r, [seq[2], seq[1], seq[0]]);
    return [a, b, c];
  }
  return matToEulerIntrinsic(r, seq);
}

function matToEulerIntrinsic(r: Mat3, seq: Sequence): Vec3 {
  const [i, j] = seq;
  const k = 3 - i - j;                            // The axis that isn't i or j
  const s = (j - i + 3) % 3 === 1 ? 1 : -1;       // +1 if (i, j, k) is a cyclic order of (x, y, z)
  // At gimbal lock, R = Rᵢ(a) Rⱼ(b), whose j-th column is Rᵢ(a) eⱼ = cos(a) eⱼ + s sin(a) eₖ.
  const lockedFirst = () => Math.atan2(s * r[k][j], r[j][j]);
  if (isProper(seq)) {
    const sb = Math.hypot(r[i][j], r[i][k]);
    const b  = Math.atan2(sb, r[i][i]);
    if (sb < GIMBAL_EPS) return [lockedFirst(), b, 0];
    return [Math.atan2(r[j][i], -s * r[k][i]), b, Math.atan2(r[i][j], s * r[i][k])];
  }
  const cb = Math.hypot(r[i][i], r[i][j]);
  const b  = Math.atan2(s * r[i][k], cb);
  if (cb < GIMBAL_EPS) return [lockedFirst(), b, 0];
  return [Math.atan2(-s * r[j][k], r[k][k]), b, Math.atan2(-s * r[i][j], r[i][i])];
}

// ⋘──────── Angular velocity ────────⋙
// If R(t) is a rotation that changes with time, then Ṙ = [ω]× R = R [ω_b]×, where ω is the angular
// velocity in fixed coordinates, ω_b = Rᵀω is the same vector in body coordinates, and [v]× is the
// matrix of the cross product with v.

export const skew = (v: Vec3): Mat3 => [[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]];

// q̇ = ½ ω q, with ω (in fixed coordinates) as a pure quaternion.
export function qDerivative(q: Quat, omega: Vec3): Quat {
  const p = qMul({ w: 0, x: omega[0], y: omega[1], z: omega[2] }, q);
  return { w: p.w / 2, x: p.x / 2, y: p.y / 2, z: p.z / 2 };
}

const unitVec = (i: number): Vec3 => [i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0];

// The Euler-angle rates for the angular velocity ω (in fixed coordinates). In the intrinsic form
// R = R₁(a) R₂(b) R₃(c), ω = ȧ e₁ + ḃ R₁(a) e₂ + ċ R₁(a) R₂(b) e₃: the three columns of J are the
// axes of the gimbal rings. J is singular at gimbal lock (det J = ±cos b for Tait–Bryan sequences
// and ±sin b for proper Euler sequences), where the rates are infinite for some ω.
export function eulerRates(seq: Sequence, angles: Vec3, extrinsic: boolean, omega: Vec3):
    { rates: Vec3; jacobianDet: number } {
  const s = extrinsic ? [seq[2], seq[1], seq[0]] : seq;
  const a = extrinsic ? [angles[2], angles[1], angles[0]] : angles;
  const r1 = axisRotation(s[0], a[0]);
  const c1 = unitVec(s[0]);
  const c2 = matVec(r1, unitVec(s[1]));
  const c3 = matVec(matMul(r1, axisRotation(s[1], a[1])), unitVec(s[2]));
  const d = dot(c1, cross(c2, c3));
  // Cramer's rule.
  const r: Vec3 = [dot(omega, cross(c2, c3)) / d, dot(c1, cross(omega, c3)) / d, dot(c1, cross(c2, omega)) / d];
  return { rates: extrinsic ? [r[2], r[1], r[0]] : r, jacobianDet: d };
}

// One step of a rigid body turning with no torque: Euler's equations I ω̇_b = (I ω_b) × ω_b for the
// body angular velocity, with q̇ = ½ q ω_b, integrated by fourth-order Runge–Kutta. `inertia` holds
// the principal moments of inertia about the body axes.
export function torqueFreeStep(q: Quat, wb: Vec3, inertia: Vec3, dt: number): { q: Quat; wb: Vec3 } {
  const f = (q: Quat, w: Vec3) => {
    const lw: Vec3 = [inertia[0] * w[0], inertia[1] * w[1], inertia[2] * w[2]];
    const t = cross(lw, w);
    const p = qMul(q, { w: 0, x: w[0], y: w[1], z: w[2] });
    return { dq: { w: p.w / 2, x: p.x / 2, y: p.y / 2, z: p.z / 2 }, dw: [t[0] / inertia[0], t[1] / inertia[1], t[2] / inertia[2]] as Vec3 };
  };
  const qAdd = (a: Quat, b: Quat, h: number): Quat => ({ w: a.w + h * b.w, x: a.x + h * b.x, y: a.y + h * b.y, z: a.z + h * b.z });
  const k1 = f(q, wb);
  const k2 = f(qAdd(q, k1.dq, dt / 2), addV(wb, scale(k1.dw, dt / 2)));
  const k3 = f(qAdd(q, k2.dq, dt / 2), addV(wb, scale(k2.dw, dt / 2)));
  const k4 = f(qAdd(q, k3.dq, dt), addV(wb, scale(k3.dw, dt)));
  const sum = <T>(pick: (k: typeof k1) => T, add: (a: T, b: T, h: number) => T, base: T) =>
    add(add(add(add(base, pick(k1), dt / 6), pick(k2), dt / 3), pick(k3), dt / 3), pick(k4), dt / 6);
  return {
    q: qNormalize(sum(k => k.dq, qAdd, q)),
    wb: sum(k => k.dw, (a, b, h) => addV(a, scale(b, h)), wb),
  };
}

// Spherical linear interpolation from a (at t = 0) to b (at t = 1), along the shorter arc.
export function qSlerp(a: Quat, b: Quat, t: number): Quat {
  b = qNearest(b, a);
  const cos = Math.min(1, qDot(a, b));
  if (cos > 0.9995) {
    return qNormalize({ w: a.w + t * (b.w - a.w), x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y), z: a.z + t * (b.z - a.z) });
  }
  const angle = Math.acos(cos), s = Math.sin(angle);
  const ka = Math.sin((1 - t) * angle) / s, kb = Math.sin(t * angle) / s;
  return { w: ka * a.w + kb * b.w, x: ka * a.x + kb * b.x, y: ka * a.y + kb * b.y, z: ka * a.z + kb * b.z };
}
