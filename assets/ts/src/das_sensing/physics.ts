// ╭───────────────────────────────────────────────────────────────╮
// │        DAS: the physics of the fiber, its sources, and pulses  │
// ╰───────────────────────────────────────────────────────────────╯
// The calculations for ../das_sensing.ts (see there for an overview of the model), with no page
// code or state, so they can be tested. Each function takes the settings it depends on.

export const C_LIGHT = 3e8;      // Speed of light in vacuum (m/s).
export const N_FIBER = 1.468;    // Refractive index of the fiber's core.
export const LAMBDA  = 1550e-9;  // Laser wavelength (m).
export const XI      = 0.78;     // Strain-optic factor: how much stretching changes the optical path.

// ⋘──────── The interrogator ────────⋙

/** Time for a pulse to reach the end of a fiber of the given length (m) and its light to return (s). */
export function roundTrip(fiberLength: number): number {
  return (2 * N_FIBER * fiberLength) / C_LIGHT;
}

/** Each pulse must return before the next is sent, so the pulse rate is at most 1 / round trip. */
export function maxPulseRate(fiberLength: number): number {
  return 1 / roundTrip(fiberLength);
}

/** The spatial resolution set by the pulse width: half the pulse's length in the fiber (m). */
export function pulseResolution(pulseNs: number): number {
  return (C_LIGHT * pulseNs * 1e-9) / (2 * N_FIBER);
}

/** The pulse's length in the fiber (m). */
export function pulseLength(pulseNs: number): number {
  return (C_LIGHT * pulseNs * 1e-9) / N_FIBER;
}

/** Fiber loss of about 0.2 dB/km each way: the returned light's amplitude falls 0.4 dB per km. */
export const lossAt = (z: number) => Math.pow(10, (-0.4 * z) / 1000 / 20);

// ⋘──────── Sources ────────⋙

/** A Ricker ("Mexican hat") wavelet with peak frequency f, centered at τ = 0. */
export function ricker(tau: number, f: number): number {
  const a = Math.PI * f * tau;
  const a2 = a * a;
  return a2 > 30 ? 0 : (1 - 2 * a2) * Math.exp(-a2);
}

/**
 * The strain rate along the fiber under a point load moving along a road, as a function of q = s/D,
 * where s is the distance along the fiber from the load and D is the road's distance from the fiber.
 * It is −dε/ds (the strain rate divided by the speed), which is 0 directly beside the load.
 */
export function movingLoadShape(q: number): number {
  return (2 * q * (3 - q * q)) / Math.pow(q * q + 1, 3);
}

/** The range of p·u over the corners of the map (x from 0 to length, y from −halfHeight to halfHeight)
 *  for a plane wave traveling at `angle` degrees from the fiber. */
export function frontRange(angle: number, length: number, halfHeight: number): [number, number] {
  const a = (angle * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a);
  const ds = [[0, -halfHeight], [0, halfHeight], [length, -halfHeight], [length, halfHeight]].map(([x, y]) => x * ux + y * uy);
  return [Math.min(...ds), Math.max(...ds)];
}

export interface Strike { x: number; y: number; t0: number; f: number; amp: number }
export interface Car { on: boolean; x: number; y: number; speed: number }
// A plane wave from far away. Its front is the line of points p with p·u = d, where u is its
// direction of travel; d starts at d0, just outside the map, and grows at the wave speed.
export interface Quake { t0: number; angle: number; speed: number; f: number; amp: number; d0: number; d1: number }

export interface Scene {
  waveSpeed : number;   // Ground wave speed (m/s)
  strikes   : Strike[];
  car       : Car;
  quakes    : Quake[];
}

/**
 * The strain rate along the fiber at distance x at time t, before gauge averaging, in arbitrary
 * units scaled so that typical signals are around 1. A fiber feels only the strain along its own
 * length, so a wave arriving at angle θ from the fiber is felt with a factor cos²θ.
 */
export function pointStrainRate(x: number, t: number, scene: Scene): number {
  let s = 0;
  const v = scene.waveSpeed;
  for (const st of scene.strikes) {
    const dx = x - st.x, r = Math.hypot(dx, st.y);
    const tau = t - st.t0 - r / v;
    if (tau < -2 / st.f || tau > 2 / st.f) continue;
    const cos2 = r > 1e-6 ? (dx * dx) / (r * r) : 1;
    s += st.amp * cos2 / Math.sqrt(Math.max(r, 8)) * ricker(tau, st.f);
  }
  const car = scene.car;
  if (car.on) s += 0.9 * (car.speed / 20) * movingLoadShape((x - car.x) / Math.abs(car.y));
  for (const qk of scene.quakes) {
    const a = (qk.angle * Math.PI) / 180;
    // A plane wave: its arrival along the fiber advances at the apparent speed V / cos(angle).
    // The front reaches fiber point x (where p·u = x cos a) after traveling from d0.
    const tau = t - qk.t0 - (x * Math.cos(a) - qk.d0) / qk.speed;
    if (tau < -2 / qk.f || tau > 2 / qk.f) continue;
    s += qk.amp * Math.cos(a) ** 2 * ricker(tau, qk.f);
  }
  return s;
}

// ⋘──────── Channels ────────⋙

export interface ChannelLayout {
  dx          : number;   // Spacing of the fine samples (m)
  channel     : number;   // Channel spacing (m)
  channels    : number;   // Number of channels
  gauge       : number;   // Gauge length (m)
  resolution  : number;   // The pulse's resolution (m), which blurs the samples before the gauge
  fiberLength : number;   // Channels past the end of the fiber measure nothing (NaN)
}

/** Averages of `values` over windows of ±half samples (fewer at the ends). */
export function boxAverage(values: ArrayLike<number>, half: number): Float64Array {
  const n = values.length;
  const prefix = new Float64Array(n + 1);
  for (let k = 0; k < n; k++) prefix[k + 1] = prefix[k] + values[k];
  const out = new Float64Array(n);
  for (let k = 0; k < n; k++) {
    const lo = Math.max(0, k - half), hi = Math.min(n - 1, k + half);
    out[k] = (prefix[hi + 1] - prefix[lo]) / (hi - lo + 1);
  }
  return out;
}

/**
 * Each channel's reading, from the strain rate at fine samples along the fiber: the pulse's length
 * blurs the samples over its resolution, and then the interrogator compares the phase of light
 * scattered from either end of a gauge-length section, so each channel sees the average strain
 * rate over that section, centered on the channel.
 */
export function channelAverages(fine: ArrayLike<number>, layout: ChannelLayout): Float64Array {
  const n = fine.length;
  const blur = Math.round(layout.resolution / layout.dx / 2);
  const blurred = blur > 0 ? boxAverage(fine, blur) : Float64Array.from(fine);
  const prefix = new Float64Array(n + 1);
  for (let k = 0; k < n; k++) prefix[k + 1] = prefix[k] + blurred[k];
  const half = Math.max(0, Math.round(layout.gauge / layout.dx / 2));
  const out = new Float64Array(layout.channels);
  for (let c = 0; c < layout.channels; c++) {
    const at = (c + 0.5) * layout.channel;
    const center = Math.round(at / layout.dx);
    const lo = Math.max(0, center - half), hi = Math.min(n - 1, center + half);
    out[c] = at > layout.fiberLength ? NaN : (prefix[hi + 1] - prefix[lo]) / (hi - lo + 1);
  }
  return out;
}

/**
 * How the background noise scales: a longer gauge collects more light-phase change for the same
 * strain, so its noise is smaller relative to the signal, falling as 1/√(gauge length) (scaled to 1
 * at 10 m). Pulse rates above the waterfall's sample rate are averaged down, which lowers it too.
 */
export function noiseScale(gauge: number, outputRate: number, pulseRate: number): number {
  return Math.sqrt(10 / Math.max(1, gauge)) * Math.sqrt(outputRate / pulseRate);
}

// ⋘──────── Phase and strain ────────⋙

export interface Stretch {
  at     : number;   // Center of the stretched section (m)
  length : number;   // Its length (m)
  strain : number;   // Its strain, in nanostrain (10⁻⁹)
}

/** The strain (unitless) of a stretched section, averaged over a gauge of length G centered at z. */
export function gaugeStrain(z: number, gauge: number, stretch: Stretch): number {
  const a0 = z - gauge / 2, a1 = z + gauge / 2;
  const b0 = stretch.at - stretch.length / 2, b1 = stretch.at + stretch.length / 2;
  const overlap = Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
  return (overlap / gauge) * stretch.strain * 1e-9;
}

/** The phase difference across a gauge G of fiber with strain ε: Δφ = 4πnξG·ε/λ (radians). */
export function phaseFromStrain(eps: number, gauge: number): number {
  return (4 * Math.PI * N_FIBER * XI * gauge * eps) / LAMBDA;
}

/** The round-trip phase of light from distance z, compared with the unstretched fiber: it builds
 *  up through the stretched section and stays shifted beyond it. */
export function accumulatedPhase(z: number, stretch: Stretch): number {
  const b0 = stretch.at - stretch.length / 2, b1 = stretch.at + stretch.length / 2;
  const inside = Math.max(0, Math.min(z, b1) - Math.max(0, b0));
  return (4 * Math.PI * N_FIBER * XI * inside * stretch.strain * 1e-9) / LAMBDA;
}

// ⋘──────── Colors and labels ────────⋙

// A diverging map: blue for compression rate (negative), white for zero, orange for stretching
// rate (positive). Blue–orange stays readable under the common kinds of color blindness.
export const NEG = [33, 102, 172], MID = [247, 247, 247], POS = [179, 88, 6];
export const NO_FIBER = [226, 226, 226]; // Waterfall color where there is no fiber.

export function colorOf(v: number, gain: number): [number, number, number] {
  if (Number.isNaN(v)) return NO_FIBER as [number, number, number];
  const u = Math.max(-1, Math.min(1, v * gain));
  const [a, b] = u < 0 ? [MID, NEG] : [MID, POS];
  const w = Math.abs(u);
  return [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w, a[2] + (b[2] - a[2]) * w];
}

/** A change in length, given in nanometers, with a sign and a suitable unit. */
export function lengthChange(nm: number): string {
  const sign = nm > 0 ? '+' : nm < 0 ? '−' : '';
  const a = Math.abs(nm);
  return a >= 1000 ? `${sign}${(a / 1000).toFixed(a >= 10000 ? 1 : 2)} μm` : `${sign}${a.toFixed(a < 10 ? 1 : 0)} nm`;
}

/** A round step (1, 2, or 5 times a power of 10) giving about `count` ticks across `span`. */
export function niceStep(span: number, count: number): number {
  const raw = span / count, p = Math.pow(10, Math.floor(Math.log10(raw)));
  return [1, 2, 5, 10].map(m => m * p).find(step => step >= raw)!;
}

export const distanceLabel = (m: number) => (m >= 1000 ? `${+(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`);

export const fmtRate = (hz: number) =>
  hz >= 1e6 ? `${+(hz / 1e6).toFixed(1)} MHz` : hz >= 1000 ? `${+(hz / 1000).toFixed(1)} kHz` : `${Math.round(hz)} Hz`;
