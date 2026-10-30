// ╭───────────────────────────────────────────────────────────────╮
// │        A string as a chain of masses, bowed or plucked        │
// ╰───────────────────────────────────────────────────────────────╯
// The string is N equal segments with a point mass at each joint, held at both ends. Each mass is
// pulled by the tension in the two segments beside it, so (for small displacements) the net
// vertical force on mass i is T (y[i+1] − 2 y[i] + y[i−1]) / h, where h is the segment length.
//
// The time step is chosen so that a wave crosses exactly one segment per step (dt = h / c). With
// that step, the update below solves the wave equation exactly at the masses, so a sharp corner
// travels along the string without spreading out. Small losses round it off slowly, as on a real
// string.
//
// The bow acts on a single mass. While it sticks, that mass moves with the bow; it starts to slip
// when holding it would take more force than static friction can give, and sticks again when its
// velocity comes back to the bow's.
//
// The nut is fixed, but the bridge end of the string rests on a mass held by a spring and a damper,
// standing in for the bridge and the violin body under it. The string pushes the bridge around,
// and the bridge's motion is what makes the sound.

export interface StringSpec {
  tension   : number; // (N)
  density   : number; // Mass per unit length (kg/m)
  length    : number; // Vibrating length, from nut to bridge (m)
  decayTime : number; // Time for a free vibration's amplitude to fall to 1/e, from the string's own
                      // losses (air drag and internal friction, lumped together) (s)
  finger    : number; // Where a finger stops the string, as a fraction of its length from the nut
                      // (0 for the open string)
}

export interface StringPreset extends StringSpec { name: string; }

// Waves travel along the string at c = √(T/μ), and the open string's pitch is c / 2L.
export const waveSpeed   = (spec: StringSpec) => Math.sqrt(spec.tension / spec.density);
export const fundamental = (spec: StringSpec) => waveSpeed(spec) / (2 * spec.length);

// Typical synthetic-core violin strings, with the density that gives each its standard pitch.
const VIOLIN_LENGTH = 0.328;
export const DEFAULT_DECAY_TIME = 1.2;
const violinString = (name: string, frequency: number, tension: number): StringPreset => ({
  name, tension, length: VIOLIN_LENGTH, decayTime: DEFAULT_DECAY_TIME, finger: 0,
  density: tension / Math.pow(2 * VIOLIN_LENGTH * frequency, 2),
});
export const STRINGS: StringPreset[] = [
  violinString("G", 196.00, 44),
  violinString("D", 293.66, 43),
  violinString("A", 440.00, 50),
  violinString("E", 659.26, 78),
];

export interface BowSettings {
  force     : number; // Normal force of the bow on the string (N)
  speed     : number; // (m/s)
  position  : number; // Distance from the bridge, as a fraction of the string length
  muStatic  : number; // Friction coefficient of the rosin while sticking
  muDynamic : number; // ... and while slipping very fast (less than muStatic)
}

export const DEFAULT_FRICTION = { muStatic: 0.8, muDynamic: 0.3 };

export interface BridgeSettings {
  stiffness : number; // Restoring force per unit displacement (N/m)
  damping   : number; // Damping force per unit velocity (N·s/m)
}
export const BRIDGE_MASS = 1e-3; // Effective moving mass of the bridge (kg)

const SLIP_SCALE = 0.1;  // Slip speed at which friction is halfway between the two (m/s)
const SMOOTHING  = 0.015; // Strength of the extra loss at short wavelengths (per step)
const MIN_SLIP_STEPS = 3; // Shortest slip that counts as one
const FINGER_DAMPING_TIME = 0.003; // Time for the finger's flesh to damp the string on the nut's side of it (s)

// Friction coefficient while the string slips past the bow at relative speed |dv|: μₛ when barely
// slipping, falling toward μ_d as the slip gets faster.
export function slipFriction(bow: BowSettings, dv: number): number {
  return bow.muDynamic + (bow.muStatic - bow.muDynamic) * SLIP_SCALE / (SLIP_SCALE + Math.abs(dv));
}

export class BowedString {
  readonly n: number;          // Number of segments
  readonly spec: StringSpec;
  h: number;                   // Segment length (m)
  c: number;                   // Wave speed (m/s)
  mass: number;                // Mass at each joint (kg)
  dt: number;                  // Time step (s)

  y: Float64Array;             // Displacement of each mass (m); y[0] is the nut, y[n] the bridge
  v: Float64Array;             // Velocity of each mass (m/s)
  force: Float64Array;         // Net tension force on each mass during the last step (N)
  t = 0;                       // (s)

  bow: BowSettings;
  bridge: BridgeSettings;
  bowing = true;
  sticking = true;
  friction = 0;                // Friction force of the bow on the string during the last step (N)
  holding = 0;                 // Friction that would have kept the string with the bow (N)
  slips = 0;                   // Number of slips so far, not counting momentary ones
  stuckSteps = 0;              // Number of steps so far that the bow held the string
  private slipRun = 0;         // Steps since the current slip started

  constructor(spec: StringSpec, bow: BowSettings, bridge: BridgeSettings, n = 120) {
    this.n    = n;
    this.spec = { ...spec };
    this.h    = spec.length / n;
    this.c    = waveSpeed(spec);
    this.mass = spec.density * this.h;
    this.dt   = this.h / this.c;
    this.y     = new Float64Array(n + 1);
    this.v     = new Float64Array(n + 1);
    this.force = new Float64Array(n + 1);
    this.bow  = bow;
    this.bridge = bridge;
  }

  // Changes the string's tension, density, length, damping, or finger while it vibrates. Its shape
  // and velocity stay as they are, and it carries on from them with the new properties.
  retune(spec: StringSpec): void {
    Object.assign(this.spec, spec);
    this.h    = spec.length / this.n;
    this.c    = waveSpeed(spec);
    this.mass = spec.density * this.h;
    this.dt   = this.h / this.c;
  }

  // Puts the bow on the string as it is, without stopping its vibration.
  startBowing(): void {
    if (this.bowing) return;
    this.bowing = true;
    this.sticking = false;
  }

  // Index of the mass under the bow, counted from the nut.
  get bowIndex(): number {
    return Math.min(this.n - 1, Math.max(1, Math.round(this.n * (1 - this.bow.position))));
  }

  // Index of the mass held still by the finger, or 0 (the nut) without one. A finger can only stop
  // the string at a mass, and it stays at least two masses on the nut's side of the bow.
  get fingerIndex(): number {
    if (this.spec.finger <= 0) return 0;
    return Math.max(0, Math.min(Math.round(this.n * this.spec.finger), this.bowIndex - 2));
  }

  // Length of the part of the string that vibrates, from the finger (or nut) to the bridge (m).
  get vibratingLength(): number { return this.spec.length * (1 - this.fingerIndex / this.n); }

  // The natural period, 2L / c for the vibrating length L, which is a whole number of steps. A
  // moving bridge makes the real one slightly different.
  get period(): number { return 2 * this.vibratingLength / this.c; }

  // The bow's distance from the bridge, as a fraction of the vibrating length. This, not the
  // fraction of the whole string, is what sets the details of Helmholtz motion.
  get bowFraction(): number { return (this.n - this.bowIndex) / (this.n - this.fingerIndex); }

  // The force of the string on the bridge, which is what drives the violin body (N).
  get bridgeForce(): number {
    return this.spec.tension * (this.y[this.n - 1] - this.y[this.n]) / this.h;
  }

  get bridgeDisplacement(): number { return this.y[this.n]; }

  reset(): void {
    this.y.fill(0);
    this.v.fill(0);
    this.force.fill(0);
    this.t = 0;
    this.sticking = true;
    this.friction = 0;
    this.slips = 0;
    this.stuckSteps = 0;
    this.slipRun = 0;
  }

  // Pull the string aside at fraction `at` of its vibrating length from the bridge and let go.
  pluck(at: number, height: number): void {
    this.reset();
    this.bowing = false;
    const f = this.fingerIndex, n = this.n;
    const k = Math.round(n - at * (n - f));
    for (let i = f; i <= n; i++) {
      this.y[i] = i <= k ? height * (i - f) / (k - f) : height * (n - i) / (n - k);
    }
  }

  step(): void {
    const { n, y, v, force, dt } = this;
    const k = this.spec.tension / this.h;
    // Damping only the velocity by 2 dt/τ per step makes the amplitude decay as e^(−t/τ).
    const damping = 1 - 2 * dt / this.spec.decayTime;

    for (let i = 1; i < n; i++) force[i] = k * (y[i + 1] - 2 * y[i] + y[i - 1]);
    for (let i = 1; i < n; i++) v[i] = damping * (v[i] + force[i] / this.mass * dt);

    // The finger holds its mass still, pressing the string to the fingerboard, so the string on the
    // nut's side of it is cut off from the rest. It's applied before the smoothing below, so that
    // nothing leaks past it, and again after the bow. The fingertip's flesh also quickly damps
    // whatever vibration is left on the nut's side when the finger comes down.
    const f = this.fingerIndex;
    if (f > 0) {
      v[f] = force[f] = 0;
      const nutSide = Math.exp(-dt / FINGER_DAMPING_TIME);
      for (let i = 1; i < f; i++) v[i] *= nutSide;
    }

    // Short wavelengths lose energy faster than long ones, which rounds sharp corners.
    let prev = v[0];
    for (let i = 1; i < n; i++) {
      const here = v[i];
      v[i] += SMOOTHING * (prev - 2 * here + v[i + 1]);
      prev = here;
    }

    // The bridge: pushed by the string, pulled back by its spring, and slowed by its damper. The
    // forces are evaluated at the end of the step (implicitly), so that the update stays stable for
    // any stiffness, damping, and time step. Moving the bridge by v dt changes the string's pull on
    // it by −(T/h) v dt and the spring's by −k v dt.
    const { stiffness, damping: bridgeDamping } = this.bridge;
    const pushed = v[n] + (this.bridgeForce - stiffness * y[n]) / BRIDGE_MASS * dt;
    v[n] = pushed / (1 + (bridgeDamping * dt + (stiffness + k) * dt * dt) / BRIDGE_MASS);

    if (this.bowing) {
      this.applyBow();
      // Ripples reaching the bow can break it loose for a step or two without changing the
      // motion, so only longer slips are counted.
      if (this.sticking) {
        this.slipRun = 0;
        this.stuckSteps++;
      } else if (++this.slipRun === MIN_SLIP_STEPS) {
        this.slips++;
      }
    } else {
      this.friction = 0;
    }

    if (f > 0) y[f] = v[f] = 0;

    for (let i = 1; i <= n; i++) y[i] += v[i] * dt;
    this.t += dt;
  }

  private applyBow(): void {
    const i = this.bowIndex;
    const { speed, force: normal } = this.bow;
    const vFree = this.v[i];
    // Friction needed to bring the mass to the bow's speed within this step.
    const holding = this.mass * (speed - vFree) / this.dt;
    this.holding = holding;

    if (this.sticking && Math.abs(holding) <= this.bow.muStatic * normal) {
      this.v[i] = speed;
      this.friction = holding;
      return;
    }
    // Slipping: friction pulls the string toward the bow's velocity.
    const dv = vFree - speed;
    const f = -Math.sign(dv) * slipFriction(this.bow, dv) * normal;
    if (Math.abs(f) >= Math.abs(holding)) {
      // Friction would carry the string past the bow's speed, so it catches the bow again.
      this.v[i] = speed;
      this.friction = holding;
      this.sticking = true;
    } else {
      this.v[i] = vFree + f / this.mass * this.dt;
      this.friction = f;
      this.sticking = false;
    }
  }
}

// ⋘──────── Kinds of motion ────────⋙
// In clean Helmholtz motion, each period has exactly one slip, the string swings backward once
// during it and doesn't come forward until the bow catches it, and the string sticks to the bow for
// the fraction 1 − β of each period (β being the bow's distance from the bridge as a fraction of
// the vibrating length). With too much force, it stays stuck too long, and the motion becomes irregular
// ("raucous"). Anything else, such as extra slips or a string that wobbles back and forth during
// the slip, isn't clean.

export type Motion = "helmholtz" | "multiple" | "raucous";

const STUCK_TOLERANCE = 0.04;  // Allowed difference from 1 − β in the fraction of time stuck
const REVERSAL_AVERAGE = 4;    // Steps to average velocity over when looking for reversals, to
                               // ignore the step-to-step jitter of the single bowed mass

// Bow a string from rest and classify the motion it settles into.
export function settledMotion(spec: StringSpec, bow: BowSettings, bridge: BridgeSettings,
                              settle = 40, measure = 10): Motion {
  const s = new BowedString(spec, { ...bow }, { ...bridge });
  const steps = Math.round(s.period / s.dt);
  for (let i = 0; i < settle * steps; i++) s.step();

  const recent = new Float64Array(REVERSAL_AVERAGE).fill(bow.speed);
  let clean = true, fewSlips = false;
  const stuck0 = s.stuckSteps;
  let backward = false;
  for (let p = 0; p < measure; p++) {
    const slips0 = s.slips;
    let reversals = 0;
    for (let j = 0; j < steps; j++) {
      s.step();
      recent[j % REVERSAL_AVERAGE] = s.v[s.bowIndex];
      let v = 0;
      for (const r of recent) v += r;
      v /= REVERSAL_AVERAGE;
      // A reversal is a swing from moving with the bow to moving clearly backward.
      if (!backward && v < -0.5 * bow.speed) {
        backward = true;
        reversals++;
      } else if (backward && v > 0.5 * bow.speed) {
        backward = false;
      }
    }
    const slips = s.slips - slips0;
    if (slips < 1) fewSlips = true;
    if (slips !== 1 || reversals !== 1) clean = false;
  }
  const stuckFraction = (s.stuckSteps - stuck0) / (measure * steps);
  const beta = s.bowFraction;
  if (clean && Math.abs(stuckFraction - (1 - beta)) <= STUCK_TOLERANCE) return "helmholtz";
  if (fewSlips || stuckFraction > 1 - 0.7 * beta) return "raucous";
  return "multiple";
}

// Schelleng's estimate of the largest bow force that allows Helmholtz motion (N). Z₀ = √(Tμ) = T/c
// is the string's characteristic impedance.
// The bow position is a fraction of the whole string, so with a finger, it's converted to a
// fraction of the vibrating length.
export function schellengMaxForce(spec: StringSpec, bow: BowSettings, position = bow.position): number {
  const impedance = Math.sqrt(spec.tension * spec.density);
  const beta = position / (1 - spec.finger);
  return 2 * impedance * bow.speed / (beta * (bow.muStatic - bow.muDynamic));
}
