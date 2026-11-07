// ╭───────────────────────────────────────────────────────────────╮
// │                  3D rotation representations                  │
// ╰───────────────────────────────────────────────────────────────╯
// An airplane is drawn rotated in 3D, and the rotation is shown four ways at once: Euler angles
// (any of the twelve sequences, intrinsic or extrinsic), an axis and angle, a unit quaternion, and
// a rotation matrix. Editing any representation, or dragging the airplane, updates the rest.
//
// The airplane can also spin with an angular velocity ω, either steadily or as a rigid body with no
// torque (which tumbles when spun about its middle principal axis). The angular velocity panel
// shows ω and the rate of change of each representation, including the Euler-angle rates, which
// blow up at gimbal lock. Without moving the airplane, the motion can also be previewed: faint
// copies show where the airplane will be over the next second or two, and dotted curves show the
// paths of a few of its points. While paused, the copies flow out of the airplane in real time and
// fade as they go.
//
// The rotation is stored as a unit quaternion. The panel being edited keeps the values as entered
// (so an Euler angle of 180° doesn't jump to −180°, for example) and the other panels are
// recomputed from the quaternion.
//
// The scene is drawn on a 2D canvas with a painter's algorithm: the airplane's faces (subdivided
// into small quads so that sorting by depth works where parts meet) and the line segments of the
// axes and rings are sorted from far to near and drawn in that order.
//
// The rotation is saved in the page's URL so a link can share it: ?q=w,x,y,z for the quaternion,
// &seq=ZYX for the Euler sequence, &ext=1 for extrinsic Euler angles, &w=x,y,z for the angular
// velocity in body coordinates, &free=1 for the torque-free motion, and &ahead=1 for the seconds of
// motion previewed.

import {
  IDENTITY, Mat3, Quat, Sequence, Vec3, addV, cross, det, dot, eulerRates, eulerToMat, isProper,
  matMul, matToEuler, matToQuat, matVec, nearestRotation, norm, normalize, axisRotation,
  orthogonalityError, qDerivative, qFromAxisAngle, qMul, qNearest, qNeg, qNorm, qNormalize, qRandom,
  qSlerp, qToAxisAngle, qToMat, scale, skew, torqueFreeStep, transpose,
} from "./rotation/rotation_math";

// ⋘──────── Constants ────────⋙

const DEG = Math.PI / 180;
const AXIS_NAMES = ["x", "y", "z"];
const AXIS_COLORS = ["#d93025", "#188038", "#1a73e8"];  // Body axes, and the matching matrix columns
const AXIS_LIGHT  = ["#f28b82", "#81c995", "#8ab4f8"];  // Lighter shades of the axis colors
const ROT_AXIS_COLOR = "#9334e6";
const OMEGA_COLOR    = "#a0522d";
const VELOCITY_COLOR = "rgba(160, 82, 45, 0.8)";
const MOMENTUM_COLOR = "#455a64";
const WORLD_COLOR = "rgba(60, 64, 67, 0.55)";
const LABEL_COLOR = "#3c4043";
const ANGLE_NAMES = ["α", "β", "γ"];
const PRIMES = ["", "′", "″"];

const CAMERA_DIST = 7;     // Distance from the camera to the origin, for the perspective
const VIEW_RADIUS = 2.35;  // Radius of the scene that fits in the canvas
const DRAG_SPEED  = 0.01;  // Radians per pixel dragged
const LOCK_TOL    = 0.03;  // |cos β| (or |sin β|) below which the Euler panel warns of gimbal lock

const DEFAULT_OMEGA: Vec3 = [0.3, 0.2, 0.9];  // Starting angular velocity, in body coordinates (rad/s)
const INERTIA: Vec3   = [1, 1.6, 2.4];  // Principal moments of inertia about the body axes
const PRESET_SPEED    = 1.5;            // rad/s, for the "Spin about" buttons
const PRESET_WOBBLE   = 0.03;           // rad/s added about the other axes, so the unstable spin tumbles
const MAX_STEP        = 1 / 400;        // Longest time step of the torque-free integration (s)
const OMEGA_SCALE     = 1.3;            // Length of the ω arrow per rad/s (longer than the body axes at the preset speed)
const OMEGA_ARROW_MAX = 2.1;            // Longest ω arrow drawn; faster spins are drawn at this length
const VELOCITY_SCALE  = 0.35;           // Length of a point-velocity arrow per unit of speed
const TRAIL_SECONDS   = 6;              // How long the trail of ω's tip lasts
const RATE_WARN       = 0.15;           // |det J| below which the Euler rates are flagged as large
const PHANTOM_COUNT   = 5;              // Copies of the airplane in the motion preview
const PATH_SAMPLES    = 60;             // Points along each previewed path
const PHANTOM_ALPHA   = 0.4;            // Opacity of a flowing copy as it leaves the airplane

// ⋘──────── State ────────⋙

type Source = "euler" | "axis" | "quat" | "matrix" | "other";

const state = {
  q: { ...IDENTITY } as Quat,
  seq: [2, 1, 0] as Sequence,
  extrinsic: false,
  euler: [0, 0, 0] as Vec3,  // Radians; consistent with q, except while an animation shows a step
  axis: [0, 0, 1] as Vec3,   // Kept when the angle is 0, where the axis is arbitrary
  az: 35 * DEG,              // Camera azimuth and elevation
  el: 22 * DEG,
  omegaB: [...DEFAULT_OMEGA] as Vec3,  // Angular velocity in body coordinates (rad/s)
  free: false,                      // Torque-free motion instead of a steady ω
  ahead: 0,                         // Seconds of motion previewed (0 for none)
};

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

// ⋘──────── Number formatting ────────⋙

function fmt(v: number, digits: number): string {
  if (Math.abs(v) < 0.5 * 10 ** -digits) v = 0;
  return v.toFixed(digits).replace("-", "−");
}

// Accepts a number, with "−" for minus, or a fraction such as "1/2". Returns NaN otherwise.
function parseNum(text: string): number {
  const s = text.trim().replace(/−/g, "-");
  if (s === "") return NaN;
  const parts = s.split("/");
  if (parts.length === 2) return Number(parts[0]) / Number(parts[1]);
  return Number(s);
}

// ⋘──────── Updating the rotation ────────⋙

function setRotation(q: Quat, source: Source) {
  state.q = qNormalize(q);
  if (source !== "euler") state.euler = matToEuler(qToMat(state.q), state.seq, state.extrinsic);
  refreshPanels(source);
  scheduleUrlUpdate();
  requestDraw();
}

function refreshPanels(source: Source) {
  for (const name of ["euler", "axis", "quat", "matrix"]) {
    $(`rot-panel-${name}`).classList.toggle("rot-source", name === source);
  }
  if (source !== "euler") refreshEuler();
  else refreshEulerNotes();
  if (source !== "axis") refreshAxis();
  refreshQuat();
  refreshMatrix();
  refreshOmega();
}

// ⋘──────── Euler angles panel ────────⋙

interface SliderRow { label: HTMLElement; range: HTMLInputElement; num: HTMLInputElement; }
const eulerRows: SliderRow[] = [];

function buildEulerSliders() {
  const box = $("rot-euler-sliders");
  for (let n = 0; n < 3; n++) {
    const row = document.createElement("div");
    row.className = "rot-slider";
    const label = document.createElement("label");
    label.htmlFor = `rot-euler-range-${n}`;
    const range = document.createElement("input");
    range.type = "range";
    range.id = `rot-euler-range-${n}`;
    range.step = "0.1";
    const num = document.createElement("input");
    num.className = "rot-num";
    num.type = "text";
    num.inputMode = "decimal";
    num.setAttribute("aria-label", `Angle ${ANGLE_NAMES[n]} in degrees`);
    row.append(label, range, num);
    box.append(row);
    eulerRows.push({ label, range, num });

    range.addEventListener("input", () => {
      stopAnimation();
      num.value = fmt(Number(range.value), 1);
      setEulerAngle(n, Number(range.value) * DEG);
    });
    num.addEventListener("change", () => {
      const v = parseNum(num.value);
      if (!Number.isFinite(v)) { num.value = fmt(state.euler[n] / DEG, 1); return; }
      stopAnimation();
      range.value = String(v);
      setEulerAngle(n, v * DEG);
    });
  }
}

function setEulerAngle(n: number, value: number) {
  state.euler[n] = value;
  const r = eulerToMat(state.seq, state.euler, state.extrinsic);
  setRotation(qNearest(matToQuat(r), state.q), "euler");
}

// Each Euler rotation is colored like the axis it is about. In a proper Euler sequence the first and
// third rotations share an axis, so the third gets a lighter shade to tell them apart.
const eulerColor = (n: number) =>
  (n === 2 && isProper(state.seq) ? AXIS_LIGHT : AXIS_COLORS)[state.seq[n]];

// The axis that each Euler rotation is about, such as "y′" for the second intrinsic rotation.
const stepAxisName = (n: number) => AXIS_NAMES[state.seq[n]] + (state.extrinsic ? "" : PRIMES[n]);

function updateEulerLabels() {
  const tb = !isProper(state.seq);
  const zyx = !state.extrinsic && state.seq.join("") === "210";
  const aeroNames = ["yaw", "pitch", "roll"];
  eulerRows.forEach((row, n) => {
    row.label.innerHTML =
      `<span class="rot-swatch" style="background:${eulerColor(n)}"></span>` +
      `<i>${ANGLE_NAMES[n]}</i> about <i>${stepAxisName(n)}</i>` +
      (zyx ? ` <small>(${aeroNames[n]})</small>` : "");
    const middle = n === 1;
    row.range.min = middle ? (tb ? "-90" : "0") : "-180";
    row.range.max = middle ? (tb ? "90" : "180") : "180";
  });

  const f = (n: number) =>
    `<span style="color:${eulerColor(n)}">R<sub>${AXIS_NAMES[state.seq[n]]}</sub>(${ANGLE_NAMES[n]})</span>`;
  $("rot-euler-formula").innerHTML = "<i>R</i> = " + (state.extrinsic ? [2, 1, 0] : [0, 1, 2]).map(f).join(" ");
  $("rot-euler-explain").innerHTML = state.extrinsic
    ? `Rotate by <i>α</i> about the fixed <i>${stepAxisName(0)}</i>-axis, then by <i>β</i> about the fixed
       <i>${stepAxisName(1)}</i>-axis, then by <i>γ</i> about the fixed <i>${stepAxisName(2)}</i>-axis.
       Each later rotation multiplies on the left.`
    : `Rotate by <i>α</i> about the <i>${stepAxisName(0)}</i>-axis, then by <i>β</i> about the airplane's
       new <i>${stepAxisName(1)}</i>-axis, then by <i>γ</i> about its newer <i>${stepAxisName(2)}</i>-axis.
       Each later rotation multiplies on the right.`;
}

function refreshEuler() {
  eulerRows.forEach((row, n) => {
    const d = state.euler[n] / DEG;
    row.range.value = String(d);
    row.num.value = fmt(d, 1);
  });
  refreshEulerNotes();
}

function refreshEulerNotes() {
  const b = state.euler[1];
  const proper = isProper(state.seq);
  const locked = proper ? Math.abs(Math.sin(b)) < LOCK_TOL : Math.abs(Math.cos(b)) < LOCK_TOL;
  const warning = $("rot-gimbal-warning");
  warning.hidden = !locked;
  if (locked) {
    const which = proper ? "0° or 180°" : "±90°";
    warning.innerHTML =
      `<strong>Gimbal lock.</strong> With <i>β</i> = ${which}, the first and third rotations are about the
       same axis, so only ${proper && Math.cos(b) < 0 ? "<i>α</i> − <i>γ</i>" : "a combination of <i>α</i> and <i>γ</i>"}
       matters: changing <i>α</i> and <i>γ</i> together can leave the airplane unmoved, and one direction of
       rotation can't be reached by a small change of the angles.`;
  }
}

// ⋘──────── Axis–angle panel ────────⋙

const axisInputs = () => [0, 1, 2].map(i => $<HTMLInputElement>(`rot-axis-${"xyz"[i]}`));

function refreshAxis() {
  const { axis, angle } = qToAxisAngle(state.q);
  const atIdentity = Math.hypot(state.q.x, state.q.y, state.q.z) < 1e-9;
  if (!atIdentity) state.axis = axis;
  axisInputs().forEach((input, i) => input.value = fmt(state.axis[i], 3));
  const deg = angle / DEG;
  $<HTMLInputElement>("rot-angle-range").value = String(deg);
  $<HTMLInputElement>("rot-angle").value = fmt(deg, 1);
  refreshRotationVector(angle);
}

function refreshRotationVector(angle: number) {
  const v = scale(normalize(state.axis), angle);
  $("rot-rotvec").innerHTML =
    `Rotation vector <i>θn</i> = (${v.map(c => fmt(c, 3)).join(", ")}) rad, of length <i>θ</i> = ${fmt(angle, 3)} rad.`;
}

function applyAxisAngle() {
  const axis = axisInputs().map(input => parseNum(input.value)) as Vec3;
  const deg = parseNum($<HTMLInputElement>("rot-angle").value);
  if (axis.some(c => !Number.isFinite(c)) || Math.hypot(...axis) === 0 || !Number.isFinite(deg)) {
    refreshAxis();  // Restore the last valid values
    return;
  }
  stopAnimation();
  state.axis = normalize(axis);
  axisInputs().forEach((input, i) => input.value = fmt(state.axis[i], 3));
  refreshRotationVector(deg * DEG);
  setRotation(qFromAxisAngle(state.axis, deg * DEG), "axis");
}

// ⋘──────── Quaternion panel ────────⋙

const QUAT_KEYS = ["w", "x", "y", "z"] as const;
const quatInputs: HTMLInputElement[] = [];
const quatBars: HTMLElement[] = [];

function buildQuat() {
  const box = $("rot-quat");
  for (const key of QUAT_KEYS) {
    const label = document.createElement("label");
    label.className = "rot-quat-label";
    label.htmlFor = `rot-quat-${key}`;
    label.textContent = key;
    const input = document.createElement("input");
    input.id = `rot-quat-${key}`;
    input.className = "rot-num";
    input.type = "text";
    input.inputMode = "decimal";
    const bar = document.createElement("div");
    bar.className = "rot-bar";
    const fill = document.createElement("div");
    fill.className = "rot-bar-fill";
    bar.append(fill);
    box.append(label, input, bar);
    quatInputs.push(input);
    quatBars.push(fill);
    input.addEventListener("change", applyQuat);
  }
}

function applyQuat() {
  const [w, x, y, z] = quatInputs.map(input => parseNum(input.value));
  const q = { w, x, y, z };
  const error = $("rot-quat-error");
  if (![w, x, y, z].every(Number.isFinite) || qNorm(q) === 0) {
    error.textContent = "Enter four numbers, not all zero.";
    return;
  }
  stopAnimation();
  const n = qNorm(q);
  error.textContent = Math.abs(n - 1) > 1e-6 ? `Divided by |q| = ${fmt(n, 4)} to make a unit quaternion.` : "";
  setRotation(q, "quat");
}

function refreshQuat() {
  QUAT_KEYS.forEach((key, n) => {
    const v = state.q[key];
    quatInputs[n].value = fmt(v, 4);
    const fill = quatBars[n];
    fill.style.left  = `${50 + Math.min(0, v) * 50}%`;
    fill.style.width = `${Math.abs(v) * 50}%`;
  });
  const { angle } = qToAxisAngle(state.q);
  $("rot-quat-formula").innerHTML =
    `= cos(<i>θ</i>/2) + sin(<i>θ</i>/2)(<i>n<sub>x</sub></i>𝐢 + <i>n<sub>y</sub></i>𝐣 + <i>n<sub>z</sub></i>𝐤),
     with <i>θ</i>/2 = ${fmt(angle / 2 / DEG, 1)}°`;
}

// ⋘──────── Rotation matrix panel ────────⋙

const matrixInputs: HTMLInputElement[][] = [[], [], []];
const SUBSCRIPTS = ["₁", "₂", "₃"];

function buildMatrix() {
  const box = $("rot-matrix");
  for (let j = 0; j < 3; j++) {
    const head = document.createElement("div");
    head.className = "rot-matrix-head";
    head.style.color = AXIS_COLORS[j];
    head.innerHTML = `<i>Re</i>${SUBSCRIPTS[j]}`;
    head.title = `Where the ${AXIS_NAMES[j]}-axis goes`;
    box.append(head);
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const input = document.createElement("input");
      input.className = "rot-num";
      input.type = "text";
      input.inputMode = "decimal";
      input.style.borderLeftColor = AXIS_COLORS[j];
      input.setAttribute("aria-label", `Row ${i + 1}, column ${j + 1}`);
      input.addEventListener("change", applyMatrix);
      box.append(input);
      matrixInputs[i][j] = input;
    }
  }
}

function applyMatrix() {
  const m: Mat3 = matrixInputs.map(row => row.map(input => parseNum(input.value)));
  const error = $("rot-matrix-error");
  if (!m.flat().every(Number.isFinite)) {
    error.textContent = "Enter a number in every entry.";
    return;
  }
  const r = nearestRotation(m);
  if (!r) {
    error.textContent = `This matrix has det = ${fmt(det(m), 3)} ≤ 0, so it isn't close to any rotation ` +
      `(a matrix with negative determinant includes a reflection).`;
    return;
  }
  stopAnimation();
  const off = orthogonalityError(m), d = det(m);
  error.textContent = off > 1e-6 || Math.abs(d - 1) > 1e-6
    ? `The entered matrix has det = ${fmt(d, 3)} and RᵀR differs from I by up to ${fmt(off, 3)}, ` +
      `so it isn't in SO(3). It was replaced by the nearest rotation matrix.`
    : "";
  setRotation(qNearest(matToQuat(r), state.q), "matrix");
}

function refreshMatrix() {
  const r = qToMat(state.q);
  r.forEach((row, i) => row.forEach((v, j) => matrixInputs[i][j].value = fmt(v, 4)));
  const off = orthogonalityError(r), d = det(r);
  $("rot-checks").innerHTML =
    `<span>det <i>R</i> =</span><span class="${Math.abs(d - 1) < 1e-9 ? "rot-ok" : "rot-bad"}">${fmt(d, 6)}</span>` +
    `<span>max |<i>R</i>ᵀ<i>R</i> − <i>I</i>| =</span><span class="${off < 1e-9 ? "rot-ok" : "rot-bad"}">${off.toExponential(1)}</span>` +
    `<span>trace <i>R</i> =</span><span>${fmt(r[0][0] + r[1][1] + r[2][2], 4)} = 1 + 2 cos <i>θ</i></span>`;
}

// ⋘──────── Angular velocity panel ────────⋙

const omegaInputs  = () => [0, 1, 2].map(i => $<HTMLInputElement>(`rot-omega-${"xyz"[i]}`));
const omegaBInputs = () => [0, 1, 2].map(i => $<HTMLInputElement>(`rot-omegab-${"xyz"[i]}`));
const omegaWorld   = () => matVec(qToMat(state.q), state.omegaB);
let editingOmega = false;  // While true, refreshOmega leaves the ω inputs as typed

function applyOmega(body: boolean) {
  const v = (body ? omegaBInputs() : omegaInputs()).map(input => parseNum(input.value)) as Vec3;
  if (v.some(c => !Number.isFinite(c))) { refreshOmega(); return; }
  setOmegaB(body ? v : matVec(transpose(qToMat(state.q)), v));
}

function setOmegaB(wb: Vec3) {
  state.omegaB = wb;
  trail.length = 0;
  refreshOmega();
  scheduleUrlUpdate();
  requestDraw();
}

// A matrix as a small read-only grid.
const mini = (m: Mat3, digits = 3) =>
  `<span class="rot-mini">${m.flat().map(v => `<span>${fmt(v, digits)}</span>`).join("")}</span>`;

function refreshOmega() {
  const r = qToMat(state.q), w = omegaWorld();
  if (!editingOmega) {
    omegaInputs().forEach((input, i) => input.value = fmt(w[i], 3));
    omegaBInputs().forEach((input, i) => input.value = fmt(state.omegaB[i], 3));
  }
  const speed = norm(w);
  $("rot-spin-speed").textContent = `|ω| = ${fmt(speed, 3)} rad/s = ${fmt(speed / (2 * Math.PI) * 60, 1)} rpm`;

  if (state.free) {
    const l = matVec(r, state.omegaB.map((c, i) => INERTIA[i] * c) as Vec3);
    const energy = state.omegaB.reduce((sum, c, i) => sum + INERTIA[i] * c * c, 0) / 2;
    $("rot-omega-note").innerHTML =
      `No torque: the angular momentum <i>L</i> = <i>R</i> 𝕀 ω<sub>b</sub> = (${l.map(c => fmt(c, 3)).join(", ")})
       and the kinetic energy ${fmt(energy, 3)} stay the same, while ω moves (its trail is drawn).
       The moments of inertia are 1, 1.6, and 2.4 about <i>Re</i>₁, <i>Re</i>₂, <i>Re</i>₃, so a spin
       about <i>Re</i>₂ is unstable.`;
  } else {
    $("rot-omega-note").innerHTML =
      `The airplane turns steadily about the line through ω. Compare it with the axis <i>n</i> of the
       rotation from the starting position, which moves as the airplane turns.`;
  }

  // Rates of change of each representation.
  const rDot = matMul(skew(w), r);
  const qDot = qDerivative(state.q, w);
  const { rates, jacobianDet } = eulerRates(state.seq, state.euler, state.extrinsic, w);
  const eulerRate = (n: number) => {
    const deg = rates[n] / DEG;
    const big = Math.abs(jacobianDet) < RATE_WARN && Math.abs(deg) > 2 * speed / DEG;
    return `<i class="rot-dot">${ANGLE_NAMES[n]}</i> = <span class="${big ? "rot-big" : ""}">${Number.isFinite(deg) ? fmt(deg, 1) : "∞"}</span>°/s`;
  };
  $("rot-rates").innerHTML =
    `<div class="rot-rate"><span class="rot-rate-name">[ω]<sub>×</sub> =</span>${mini(skew(w))}</div>` +
    `<div class="rot-rate"><span class="rot-rate-name"><i>Ṙ</i> = [ω]<sub>×</sub><i>R</i> =</span>${mini(rDot)}</div>` +
    `<div class="rot-rate"><span class="rot-rate-name"><i>q̇</i> = ½ ω <i>q</i> =</span>
       <span>(${QUAT_KEYS.map(k => fmt(qDot[k], 3)).join(", ")})</span></div>` +
    `<div class="rot-rate"><span class="rot-rate-name">Euler rates</span>
       <span>${[0, 1, 2].map(eulerRate).join(", ")}</span>
       <span class="rot-note" style="margin:0">(det <i>J</i> = ${fmt(jacobianDet, 3)})</span></div>`;

  const warning = $("rot-rates-warning");
  warning.hidden = !(Math.abs(jacobianDet) < RATE_WARN && speed > 1e-9);
  if (!warning.hidden) {
    warning.innerHTML =
      `<strong>Near gimbal lock</strong>, det <i>J</i> is close to 0, so the Euler angles can need to change
       much faster than the airplane is actually turning. The matrix and quaternion rates stay
       proportional to |ω|.`;
  }
}

// ⋘──────── Spinning ────────⋙
// Each animation frame advances the rotation by the time since the last frame: exactly, for a
// steady ω, and by small Runge–Kutta steps of Euler's equations for the torque-free motion.

let spinFrame: number | null = null;
let spinLast: number | null = null;
const trail: Vec3[] = [];  // Recent positions of ω's tip, in fixed coordinates

function startSpin() {
  stopAnimation();
  trail.length = 0;
  spinLast = null;
  const step = (now: number) => {
    const dt = spinLast === null ? 0 : Math.min(0.05, (now - spinLast) / 1000);
    spinLast = now;
    advance(dt);
    spinFrame = requestAnimationFrame(step);
  };
  spinFrame = requestAnimationFrame(step);
  updateSpinButton();
  updatePreviewLoop();
}

function stopSpin() {
  if (spinFrame !== null) cancelAnimationFrame(spinFrame);
  spinFrame = null;
  updateSpinButton();
  updatePreviewLoop();
}

const isSpinning = () => spinFrame !== null;

function updateSpinButton() {
  $("rot-spin").textContent = isSpinning() ? "❚❚ Pause" : "▶ Spin";
}

function advance(dt: number) {
  let q = state.q, wb = state.omegaB;
  if (state.free) {
    const n = Math.ceil(dt / MAX_STEP);
    for (let k = 0; k < n; k++) ({ q, wb } = torqueFreeStep(q, wb, INERTIA, dt / n));
  } else if (dt > 0) {
    q = qMul(q, qFromAxisAngle(wb, norm(wb) * dt));
  }
  state.omegaB = wb;
  setRotation(q, "other");
  trail.push(omegaWorld());
  const maxLength = Math.round(TRAIL_SECONDS * 60);
  if (trail.length > maxLength) trail.splice(0, trail.length - maxLength);
}

// The rotations at the times t = k T / samples for k = 0, ..., samples, if the airplane moved from
// where it is now for T seconds, without changing the state.
function futureRotations(seconds: number, samples: number): Quat[] {
  let q = state.q, wb = state.omegaB;
  const out = [q];
  const dt = seconds / samples;
  for (let k = 1; k <= samples; k++) {
    if (state.free) {
      const n = Math.ceil(dt / MAX_STEP);
      for (let j = 0; j < n; j++) ({ q, wb } = torqueFreeStep(q, wb, INERTIA, dt / n));
    } else {
      q = qMul(q, qFromAxisAngle(wb, norm(wb) * dt));
    }
    out.push(q);
  }
  return out;
}

// While the preview is on and the airplane is paused, the scene is redrawn every frame so that the
// copies flow forward. Viewers who ask for reduced motion get the fixed copies instead.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const previewFlows = () => !isSpinning() && !reducedMotion.matches;
let previewFrame: number | null = null;

function updatePreviewLoop() {
  const run = state.ahead > 0 && previewFlows();
  if (run && previewFrame === null) {
    const tick = () => { requestDraw(); previewFrame = requestAnimationFrame(tick); };
    previewFrame = requestAnimationFrame(tick);
  } else if (!run && previewFrame !== null) {
    cancelAnimationFrame(previewFrame);
    previewFrame = null;
  }
}

// ⋘──────── The airplane ────────⋙
// In body coordinates: x forward, y to the left wing, z up.

interface Face { pts: Vec3[]; normal: Vec3; color: [number, number, number]; }

const MAX_QUAD = 0.22;  // Faces are subdivided into quads no larger than this

function box(min: Vec3, max: Vec3, color: [number, number, number], faces: Face[]) {
  for (let axis = 0; axis < 3; axis++) {
    const [u, v] = [0, 1, 2].filter(k => k !== axis);
    const nu = Math.max(1, Math.ceil((max[u] - min[u]) / MAX_QUAD));
    const nv = Math.max(1, Math.ceil((max[v] - min[v]) / MAX_QUAD));
    for (const side of [-1, 1]) {
      const normal: Vec3 = [0, 0, 0];
      normal[axis] = side;
      for (let a = 0; a < nu; a++) for (let b = 0; b < nv; b++) {
        const corner = (da: number, db: number): Vec3 => {
          const p: Vec3 = [0, 0, 0];
          p[axis] = side > 0 ? max[axis] : min[axis];
          p[u] = min[u] + (max[u] - min[u]) * (a + da) / nu;
          p[v] = min[v] + (max[v] - min[v]) * (b + db) / nv;
          return p;
        };
        faces.push({ pts: [corner(0, 0), corner(1, 0), corner(1, 1), corner(0, 1)], normal, color });
      }
    }
  }
}

const AIRPLANE: Face[] = (() => {
  const faces: Face[] = [];
  const body: [number, number, number] = [218, 220, 224];
  const wing: [number, number, number] = [120, 160, 220];
  const tail: [number, number, number] = [242, 153, 0];
  const nose: [number, number, number] = [217, 48, 37];
  box([-0.95, -0.16, -0.16], [0.9, 0.16, 0.16], body, faces);   // Fuselage
  box([0.9, -0.11, -0.11], [1.15, 0.11, 0.11], nose, faces);    // Nose
  box([-0.15, -1.05, -0.03], [0.3, 1.05, 0.03], wing, faces);   // Wings
  box([-0.95, -0.42, -0.02], [-0.7, 0.42, 0.02], wing, faces);  // Horizontal stabilizer
  box([-0.95, -0.02, 0.16], [-0.66, 0.02, 0.6], tail, faces);   // Vertical fin
  return faces;
})();

// Points whose velocity v = ω × r is drawn: the nose, the wingtips, and the top of the fin.
const TRACKED_POINTS: Vec3[] = [[1.15, 0, 0], [0.07, 1.05, 0], [0.07, -1.05, 0], [-0.8, 0, 0.6]];

// ⋘──────── Drawing ────────⋙

const canvas = $<HTMLCanvasElement>("rot-canvas");
const ctx = canvas.getContext("2d")!;
let drawPending = false;

function requestDraw() {
  if (drawPending) return;
  drawPending = true;
  requestAnimationFrame(() => { drawPending = false; draw(); });
}

interface Item { depth: number; paint: () => void; }

function draw() {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  // Camera: d points from the origin toward the camera, and (right, up, d) is right-handed.
  const { az, el } = state;
  const d: Vec3 = [Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)];
  const right: Vec3 = [-Math.sin(az), Math.cos(az), 0];
  const up = cross(d, right);
  const eye = scale(d, CAMERA_DIST);
  const light = normalize(addV(addV(d, scale(up, 0.8)), scale(right, -0.4)));
  const k = Math.min(w, h) / 2 / VIEW_RADIUS;
  const project = (p: Vec3) => {
    const z = dot(p, d), s = CAMERA_DIST / (CAMERA_DIST - z);
    return { x: w / 2 + k * s * dot(p, right), y: h / 2 - k * s * dot(p, up), z };
  };

  const items: Item[] = [];
  const labels: { p: Vec3; text: string; color: string }[] = [];
  const r = qToMat(state.q);

  // A polyline, split into short segments that are depth-sorted separately.
  const line = (pts: Vec3[], color: string, width: number, dash: number[] = []) => {
    for (let n = 0; n + 1 < pts.length; n++) {
      const a = project(pts[n]), b = project(pts[n + 1]);
      items.push({
        depth: (a.z + b.z) / 2,
        paint: () => {
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.setLineDash(dash);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        },
      });
    }
  };
  const segments = (a: Vec3, b: Vec3, n: number) =>
    Array.from({ length: n + 1 }, (_, t) => addV(scale(a, 1 - t / n), scale(b, t / n)));

  // An arrow from a to b, with its head drawn in screen space.
  const arrow = (a: Vec3, b: Vec3, color: string, width: number, dash: number[] = []) => {
    line(segments(a, b, 12), color, width, dash);
    const tip = project(b), back = project(addV(b, scale(normalize(addV(a, scale(b, -1))), 0.14)));
    items.push({
      depth: tip.z,
      paint: () => {
        const dx = tip.x - back.x, dy = tip.y - back.y, len = Math.hypot(dx, dy);
        if (len < 1) return;
        const ux = dx / len, uy = dy / len, size = 9;
        ctx.setLineDash([]);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y);
        ctx.lineTo(tip.x - size * ux + size * 0.45 * uy, tip.y - size * uy - size * 0.45 * ux);
        ctx.lineTo(tip.x - size * ux - size * 0.45 * uy, tip.y - size * uy + size * 0.45 * ux);
        ctx.closePath();
        ctx.fill();
      },
    });
  };

  // A circle of the given radius about `center`, in the plane spanned by u and v.
  const circle = (center: Vec3, u: Vec3, v: Vec3, radius: number, from = 0, to = 2 * Math.PI, n = 72) =>
    Array.from({ length: n + 1 }, (_, t) => {
      const a = from + (to - from) * t / n;
      return addV(center, addV(scale(u, radius * Math.cos(a)), scale(v, radius * Math.sin(a))));
    });

  const faces = (rot: Mat3, alpha: number) => {
    for (const face of AIRPLANE) {
      const pts = face.pts.map(p => matVec(rot, p));
      const normal = matVec(rot, face.normal);
      const center = scale(pts.reduce(addV), 1 / pts.length);
      if (dot(normal, addV(eye, scale(center, -1))) <= 0) continue;  // Facing away
      const shade = 0.55 + 0.45 * Math.max(0, dot(normal, light));
      const [cr, cg, cb] = face.color.map(c => Math.round(c * shade));
      const fill = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
      const screen = pts.map(project);
      items.push({
        depth: dot(center, d),
        paint: () => {
          ctx.fillStyle = fill;
          ctx.strokeStyle = fill;  // Covers the hairline gaps between neighboring quads
          ctx.lineWidth = alpha < 1 ? 0 : 0.8;
          ctx.setLineDash([]);
          ctx.beginPath();
          screen.forEach((p, n) => n === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
          ctx.closePath();
          ctx.fill();
          if (alpha === 1) ctx.stroke();
        },
      });
    }
  };

  const E: Vec3[] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

  // Fixed axes, and the unit circle's shadow on the xy-plane for a sense of depth.
  if ($<HTMLInputElement>("rot-show-world").checked) {
    E.forEach((e, i) => {
      arrow(scale(e, -2.0), scale(e, 2.0), WORLD_COLOR, 1, [4, 4]);
      labels.push({ p: scale(e, 2.18), text: AXIS_NAMES[i], color: LABEL_COLOR });
    });
    line(circle([0, 0, 0], E[0], E[1], 1.9), "rgba(60, 64, 67, 0.15)", 1);
  }

  if ($<HTMLInputElement>("rot-show-ghost").checked) faces(qToMat(IDENTITY), 0.13);
  // The motion preview: faint copies of the airplane ahead in time, and the paths of the tracked
  // points (to which their velocity arrows are tangent). While paused, the copies are evenly spaced
  // in time, each moving from the airplane to the end of the preview in real time and fading as it
  // goes; while spinning, they stay at fixed times ahead.
  if (state.ahead > 0 && norm(state.omegaB) > 1e-9) {
    const futureQ = futureRotations(state.ahead, PATH_SAMPLES);
    const future = futureQ.map(qToMat);
    const at = (fraction: number) => {
      const x = fraction * PATH_SAMPLES, i = Math.min(PATH_SAMPLES - 1, Math.floor(x));
      return qToMat(qSlerp(futureQ[i], futureQ[i + 1], x - i));
    };
    if (previewFlows()) {
      const phase = (performance.now() / 1000 / state.ahead) % 1;
      for (let k = 0; k < PHANTOM_COUNT; k++) {
        const fraction = (phase + k / PHANTOM_COUNT) % 1;
        const alpha = PHANTOM_ALPHA * (1 - fraction);
        if (alpha > 0.01) faces(at(fraction), alpha);
      }
    } else {
      for (let k = 1; k <= PHANTOM_COUNT; k++) faces(at(k / PHANTOM_COUNT), 0.3 - 0.04 * k);
    }
    for (const point of TRACKED_POINTS) line(future.map(m => matVec(m, point)), VELOCITY_COLOR, 1.5, [2, 3]);
    const nose = matVec(future[PATH_SAMPLES], addV(TRACKED_POINTS[0], [0.2, 0, 0]));
    labels.push({ p: nose, text: `+${state.ahead} s`, color: OMEGA_COLOR });
  }

  faces(r, 1);

  // Angular velocity ω, the velocity v = ω × r of a few points on the airplane, and (for the
  // torque-free motion) the angular momentum L. The trail shows where ω's tip has been.
  if ($<HTMLInputElement>("rot-show-omega").checked) {
    const w = omegaWorld(), speed = norm(w);
    const arrowScale = speed > 0 ? Math.min(OMEGA_SCALE, OMEGA_ARROW_MAX / speed) : OMEGA_SCALE;
    if (trail.length > 1) line(trail.map(p => scale(p, arrowScale)), "rgba(160, 82, 45, 0.35)", 1.5);
    if (speed > 1e-6) {
      arrow([0, 0, 0], scale(w, arrowScale), OMEGA_COLOR, 3);
      labels.push({ p: scale(w, arrowScale + 0.18 / speed), text: "ω", color: OMEGA_COLOR });
      for (const point of TRACKED_POINTS) {
        const p = matVec(r, point), v = cross(w, p);
        const length = Math.min(0.8, norm(v) * VELOCITY_SCALE);
        if (length > 0.03) arrow(p, addV(p, scale(normalize(v), length)), VELOCITY_COLOR, 1.5);
      }
    }
    if (state.free) {
      const l = matVec(r, state.omegaB.map((c, i) => INERTIA[i] * c) as Vec3);
      // Scaled like ω, divided by the middle moment of inertia, so that L and ω are comparable.
      const lv = scale(l, arrowScale / INERTIA[1]);
      if (norm(lv) > 1e-6) {
        arrow([0, 0, 0], lv, MOMENTUM_COLOR, 2, [5, 3]);
        labels.push({ p: addV(lv, scale(normalize(lv), 0.18)), text: "L", color: MOMENTUM_COLOR });
      }
    }
  }

  if ($<HTMLInputElement>("rot-show-body").checked) {
    E.forEach((e, j) => {
      const tip = matVec(r, scale(e, 1.55));
      arrow([0, 0, 0], tip, AXIS_COLORS[j], 2.5);
      labels.push({ p: matVec(r, scale(e, 1.72)), text: `Re${SUBSCRIPTS[j]}`, color: AXIS_COLORS[j] });
    });
  }

  // The rotation axis n, and an arc near its tip showing the angle θ.
  if ($<HTMLInputElement>("rot-show-axis").checked) {
    const { axis, angle } = qToAxisAngle(state.q);
    if (angle > 1e-6 && angle < 2 * Math.PI - 1e-6) {
      line(segments(scale(axis, -2.0), [0, 0, 0], 12), ROT_AXIS_COLOR, 1.5, [6, 4]);
      arrow([0, 0, 0], scale(axis, 2.0), ROT_AXIS_COLOR, 1.5, [6, 4]);
      labels.push({ p: scale(axis, 2.2), text: "n", color: ROT_AXIS_COLOR });
      const helper: Vec3 = Math.abs(axis[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
      const u = normalize(cross(axis, helper)), v = cross(axis, u);
      const center = scale(axis, 1.65);
      const arc = circle(center, u, v, 0.32, 0, angle, Math.max(8, Math.round(angle * 16)));
      line([center, arc[0]], ROT_AXIS_COLOR, 1, [2, 3]);
      line(arc.slice(0, -1), ROT_AXIS_COLOR, 2);
      arrow(arc[arc.length - 2], arc[arc.length - 1], ROT_AXIS_COLOR, 2);
      const mid = circle(center, u, v, 0.5, angle / 2, angle / 2, 1)[0];
      labels.push({ p: mid, text: "θ", color: ROT_AXIS_COLOR });
    }
  }

  // Gimbals: one ring per Euler rotation, nested from the outermost (the first rotation of the
  // intrinsic sequence) inward. Each ring turns about its own axis, carrying the rings inside it.
  if ($<HTMLInputElement>("rot-show-gimbal").checked) {
    const seq = state.extrinsic ? [state.seq[2], state.seq[1], state.seq[0]] : state.seq;
    const angles = state.extrinsic ? [state.euler[2], state.euler[1], state.euler[0]] : state.euler;
    let frame: Mat3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    [1.95, 1.8, 1.65].forEach((radius, m) => {
      frame = matMul(frame, axisRotation(seq[m], angles[m]));
      const [ui, vi] = [0, 1, 2].filter(c => c !== seq[m]);
      const u = matVec(frame, E[ui]), v = matVec(frame, E[vi]);
      const color = eulerColor(state.extrinsic ? 2 - m : m);
      line(circle([0, 0, 0], u, v, radius), color, 3);
      // A knob on the ring shows how far it has turned.
      line([scale(u, radius - 0.08), scale(u, radius + 0.08)], color, 6);
    });
  }

  items.sort((a, b) => a.depth - b.depth);
  for (const item of items) item.paint();

  ctx.setLineDash([]);
  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const label of labels) {
    const p = project(label.p);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(251, 251, 252, 0.9)";
    ctx.strokeText(label.text, p.x, p.y);
    ctx.fillStyle = label.color;
    ctx.fillText(label.text, p.x, p.y);
  }
}

// ⋘──────── Dragging ────────⋙

// While the airplane spins, dragging holds it, and letting go flings it with the angular velocity of
// the drag (or resumes the old spin, if the pointer had stopped moving).
let drag: { x: number; y: number; id: number; wasSpinning: boolean; time: number; omega: Vec3 } | null = null;
const FLING_MIN = 0.3;  // rad/s; slower releases resume the old spin

canvas.addEventListener("pointerdown", event => {
  drag = { x: event.clientX, y: event.clientY, id: event.pointerId, wasSpinning: isSpinning(), time: performance.now(), omega: [0, 0, 0] };
  canvas.setPointerCapture(event.pointerId);
  canvas.classList.add("rot-dragging");
  stopAnimation();
});

canvas.addEventListener("pointermove", event => {
  if (!drag || event.pointerId !== drag.id) return;
  const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
  drag.x = event.clientX;
  drag.y = event.clientY;
  if (dx === 0 && dy === 0) return;
  const mode = document.querySelector<HTMLInputElement>('input[name="rot-drag"]:checked')!.value;
  if (mode === "view" || event.shiftKey) {
    state.az -= dx * DRAG_SPEED;
    state.el = Math.max(-89 * DEG, Math.min(89 * DEG, state.el + dy * DRAG_SPEED));
    requestDraw();
    return;
  }
  // Turn the airplane about the screen axis perpendicular to the drag, so the near side of the
  // airplane follows the pointer.
  const { az, el } = state;
  const d: Vec3 = [Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)];
  const right: Vec3 = [-Math.sin(az), Math.cos(az), 0];
  const up = cross(d, right);
  const axis = addV(scale(up, dx), scale(right, dy));
  const angle = Math.hypot(dx, dy) * DRAG_SPEED;
  setRotation(qMul(qFromAxisAngle(axis, angle), state.q), "other");
  // Smoothed angular velocity of the drag, in fixed coordinates.
  const now = performance.now(), dt = Math.max(1, now - drag.time) / 1000;
  drag.omega = addV(scale(drag.omega, 0.5), scale(normalize(axis), 0.5 * angle / dt));
  drag.time = now;
});

const endDrag = (event: PointerEvent) => {
  if (drag && event.type === "pointerup" && drag.wasSpinning) {
    const moving = performance.now() - drag.time < 80 && norm(drag.omega) > FLING_MIN;
    if (moving) setOmegaB(matVec(transpose(qToMat(state.q)), drag.omega));
    startSpin();
  }
  drag = null;
  canvas.classList.remove("rot-dragging");
};
canvas.addEventListener("pointerup", endDrag);
canvas.addEventListener("pointercancel", endDrag);

new ResizeObserver(requestDraw).observe(canvas);

// ⋘──────── Animations ────────⋙
// "Play axis–angle" turns the airplane from the identity about n through the angle θ, and "Play
// Euler steps" does the three Euler rotations one after another, moving the sliders along.

let animation: number | null = null;

function stopAnimation() {
  if (animation !== null) cancelAnimationFrame(animation);
  animation = null;
  stopSpin();
}

const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 0.5 - 0.5 * Math.cos(Math.PI * t));

function animate(duration: number, frame: (t: number) => void, done: () => void) {
  stopAnimation();
  const start = performance.now();
  const step = (now: number) => {
    const t = (now - start) / duration;
    if (t >= 1) { animation = null; done(); return; }
    frame(t);
    animation = requestAnimationFrame(step);
  };
  animation = requestAnimationFrame(step);
}

function playAxisAngle() {
  const target = state.q;
  const { axis, angle } = qToAxisAngle(target);
  animate(Math.max(800, angle / Math.PI * 1800),
    t => setRotation(qFromAxisAngle(axis, ease(t) * angle), "other"),
    () => setRotation(target, "other"));
}

function playEulerSteps() {
  const target = state.q, final = [...state.euler] as Vec3;
  const show = (angles: Vec3) => {
    state.euler = angles;
    state.q = qNearest(matToQuat(eulerToMat(state.seq, angles, state.extrinsic)), state.q);
    refreshPanels("euler");
    refreshEuler();
    requestDraw();
  };
  animate(3600,
    t => show(final.map((a, n) => a * ease(t * 3 - n)) as Vec3),
    () => { show(final); state.q = target; refreshPanels("euler"); });
}

// ⋘──────── URL ────────⋙

let urlTimer: number | undefined;
let urlReady = false;  // Loading the page doesn't write the starting rotation into the URL

function scheduleUrlUpdate() {
  if (!urlReady) return;
  clearTimeout(urlTimer);
  urlTimer = window.setTimeout(() => {
    const params = new URLSearchParams(window.location.search);
    const isIdentity = Math.abs(state.q.w) > 1 - 1e-12;
    if (isIdentity) params.delete("q");
    else params.set("q", QUAT_KEYS.map(key => String(Number(state.q[key].toFixed(6)))).join(","));
    const seq = state.seq.map(i => "XYZ"[i]).join("");
    if (seq === "ZYX") params.delete("seq"); else params.set("seq", seq);
    if (state.extrinsic) params.set("ext", "1"); else params.delete("ext");
    const w = state.omegaB.map(c => String(Number(c.toFixed(4)))).join(",");
    if (w === DEFAULT_OMEGA.join(",")) params.delete("w"); else params.set("w", w);
    if (state.free) params.set("free", "1"); else params.delete("free");
    if (state.ahead > 0) params.set("ahead", String(state.ahead)); else params.delete("ahead");
    const query = params.toString();
    history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : "") + window.location.hash);
  }, 300);
}

function readUrl() {
  const params = new URLSearchParams(window.location.search);
  const seq = params.get("seq")?.toUpperCase();
  if (seq && /^[XYZ]{3}$/.test(seq) && seq[0] !== seq[1] && seq[1] !== seq[2]) {
    state.seq = [...seq].map(c => "XYZ".indexOf(c)) as Sequence;
  }
  state.extrinsic = params.get("ext") === "1";
  state.free = params.get("free") === "1";
  const ahead = Number(params.get("ahead"));
  if ([0.5, 1, 2].includes(ahead)) state.ahead = ahead;
  const w = params.get("w")?.split(",").map(Number);
  if (w && w.length === 3 && w.every(Number.isFinite)) state.omegaB = w as Vec3;
  const q = params.get("q")?.split(",").map(Number);
  if (q && q.length === 4 && q.every(Number.isFinite) && Math.hypot(...q) > 0) {
    state.q = qNormalize({ w: q[0], x: q[1], y: q[2], z: q[3] });
  }
}

// ⋘──────── Setup ────────⋙

function setSequence() {
  updateEulerLabels();
  state.euler = matToEuler(qToMat(state.q), state.seq, state.extrinsic);
  refreshEuler();
  refreshOmega();
  scheduleUrlUpdate();
  requestDraw();
}

buildEulerSliders();
buildQuat();
buildMatrix();
readUrl();

const seqSelect = $<HTMLSelectElement>("rot-seq");
seqSelect.value = state.seq.map(i => "XYZ"[i]).join("");
document.querySelector<HTMLInputElement>(`input[name="rot-frame"][value="${state.extrinsic ? "extrinsic" : "intrinsic"}"]`)!.checked = true;

seqSelect.addEventListener("change", () => {
  stopAnimation();
  state.seq = [...seqSelect.value].map(c => "XYZ".indexOf(c)) as Sequence;
  setSequence();
});
document.querySelectorAll<HTMLInputElement>('input[name="rot-frame"]').forEach(input =>
  input.addEventListener("change", () => {
    stopAnimation();
    state.extrinsic = input.value === "extrinsic";
    setSequence();
  }));

axisInputs().forEach(input => input.addEventListener("change", applyAxisAngle));
$("rot-angle").addEventListener("change", applyAxisAngle);
$<HTMLInputElement>("rot-angle-range").addEventListener("input", () => {
  $<HTMLInputElement>("rot-angle").value = fmt(Number($<HTMLInputElement>("rot-angle-range").value), 1);
  applyAxisAngle();
});

$("rot-negate").addEventListener("click", () => {
  stopAnimation();
  $("rot-quat-error").textContent = "";
  setRotation(qNeg(state.q), "quat");
});
$("rot-reset").addEventListener("click", () => {
  stopAnimation();
  state.az = 35 * DEG;
  state.el = 22 * DEG;
  setRotation(IDENTITY, "other");
});
$("rot-random").addEventListener("click", () => { stopAnimation(); setRotation(qRandom(), "other"); });
$("rot-animate-axis").addEventListener("click", playAxisAngle);
$("rot-animate-euler").addEventListener("click", playEulerSteps);
omegaInputs().forEach(input => input.addEventListener("change", () => applyOmega(false)));
omegaBInputs().forEach(input => input.addEventListener("change", () => applyOmega(true)));
for (const input of [...omegaInputs(), ...omegaBInputs()]) {
  input.addEventListener("focus", () => editingOmega = true);
  input.addEventListener("blur", () => { editingOmega = false; refreshOmega(); });
}
$("rot-spin").addEventListener("click", () => (isSpinning() ? stopSpin() : startSpin()));
document.querySelectorAll<HTMLButtonElement>("[data-spin-axis]").forEach(button =>
  button.addEventListener("click", () => {
    const j = Number(button.dataset.spinAxis);
    setOmegaB([0, 1, 2].map(i => (i === j ? PRESET_SPEED : PRESET_WOBBLE)) as Vec3);
    if (!isSpinning()) startSpin();
  }));
document.querySelector<HTMLInputElement>(`input[name="rot-motion"][value="${state.free ? "free" : "steady"}"]`)!.checked = true;
document.querySelector<HTMLInputElement>(`input[name="rot-ahead"][value="${state.ahead}"]`)!.checked = true;
document.querySelectorAll<HTMLInputElement>('input[name="rot-ahead"]').forEach(input =>
  input.addEventListener("change", () => {
    state.ahead = Number(input.value);
    updatePreviewLoop();
    scheduleUrlUpdate();
    requestDraw();
  }));
reducedMotion.addEventListener("change", updatePreviewLoop);
document.querySelectorAll<HTMLInputElement>('input[name="rot-motion"]').forEach(input =>
  input.addEventListener("change", () => {
    state.free = input.value === "free";
    trail.length = 0;
    refreshOmega();
    scheduleUrlUpdate();
    requestDraw();
  }));
for (const id of ["rot-show-world", "rot-show-body", "rot-show-axis", "rot-show-gimbal", "rot-show-ghost", "rot-show-omega"]) {
  $(id).addEventListener("change", requestDraw);
}

// Start at a rotation that shows something, unless the URL gives one.
if (!new URLSearchParams(window.location.search).has("q")) {
  state.q = matToQuat(eulerToMat([2, 1, 0], [-40 * DEG, -20 * DEG, 15 * DEG], false));
}
updateEulerLabels();
setRotation(state.q, "other");
updatePreviewLoop();
urlReady = true;
