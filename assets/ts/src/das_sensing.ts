// ╭───────────────────────────────────────────────────────────────╮
// │              Distributed acoustic sensing (DAS)               │
// ╰───────────────────────────────────────────────────────────────╯
// A 1 km optical fiber lies along a road (y = 0, from x = 0 at the interrogator to x = L). Sources
// near it (hammer strikes, a passing car, a walker, an earthquake wave) send vibrations through the
// ground. The page shows:
//   • a map of the sources and their wavefronts, with the fiber colored by the strain rate it feels,
//   • a waterfall: strain rate along the fiber (horizontal) against time (vertical), the standard
//     way DAS data is displayed, and a trace of one channel over time,
//   • a slow-motion view of the interrogator: a laser pulse travels down the fiber, light scatters
//     back from flaws in the glass (Rayleigh backscatter), the round-trip time gives the distance,
//     and the change in phase between pulses gives the strain.
//
// The physics is simplified for illustration:
//   • Each source makes a strain-rate wavelet (a Ricker wavelet) that travels at the wave speed.
//   • A fiber feels only the strain along its own length, so a wave crossing it at angle θ (from
//     the fiber's direction) is felt with a factor cos²θ: waves arriving broadside are nearly
//     invisible, which is a real property of DAS.
//   • Each channel reports the strain rate averaged over the gauge length, so wavelengths shorter
//     than the gauge length are smeared out.
//   • A passing car presses on the ground, which stretches and compresses the fiber in a pattern
//     that moves with the car (modeled as the strain under a moving point load).

import { setupHelp } from './common/help';
import { setupPanels } from './common/panels';
import { loadJSON, saveJSON } from './common/storage';

// ── Constants ──────────────────────────────────────────────────────
const L = 1000;           // Fiber length (m).
const H = 160;            // The map shows y from −H to H (m).
const DX = 1;             // Spacing of the fine samples along the fiber (m).
const N_FINE = L / DX + 1;
// The channel spacing (m) and the number of channels. The spacing is a setting; the buffers sized
// by it are rebuilt by rebuildBuffers.
let CHANNEL = 2;
let N_CH = L / CHANNEL;
// The waterfall records one row per pulse, up to OUTPUT_RATE rows per second; faster pulse rates
// are averaged down to that rate. It keeps WINDOW seconds of history.
const OUTPUT_RATE = 200;  // Hz.
const WINDOW = 4;         // s.
let ROW_DT = 0.01;        // Time between waterfall rows (s); set from the pulse rate.
let N_ROWS = 400;         // Rows of history.
const C_LIGHT = 3e8;      // Speed of light in vacuum (m/s).
const N_FIBER = 1.468;    // Refractive index of the fiber's core.

// Colors (Okabe–Ito where possible, so they stay distinct under color blindness).
const SOURCE_COLOR = '#D55E00';
const CAR_COLOR = '#0072B2';
const WALKER_COLOR = '#009E73';
const QUAKE_COLOR = '#CC79A7';
const FIBER_IDLE = '#9aa0a6';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// ── Settings ───────────────────────────────────────────────────────
const settings = {
  waveSpeed: 300,   // Ground wave speed (m/s).
  gauge: 10,        // Gauge length (m).
  speed: 1,         // Simulation speed (1 = real time).
  noise: true,      // Add random background noise.
  gain: 1,          // Color scale.
  quakeAngle: 20,   // Direction the earthquake wave travels, in degrees from the fiber.
  channel: 2,       // Channel spacing (m): one of CHANNEL_OPTIONS.
  prf: 100,         // Pulse repetition rate (Hz).
  pulseNs: 20,      // Pulse width (ns).
  fiberKm: 1,       // Length of the whole fiber (km); the map shows its first L meters.
  slowmo: 4,        // Real seconds per slow-motion round trip.
  scatter: 'random' as 'random' | 'even', // How the scatterers are placed along the fiber.
  returnView: 'arrows' as 'arrows' | 'intensity', // How the returning light is drawn.
  prfAuto: false,   // Pulse as fast as the fiber allows: one pulse per round trip.
  strainSource: 'map' as 'map' | 'manual', // Where the interrogator view's strain comes from.
  manualStrain: 20,    // Strain of the stretched section, in nanostrain (10⁻⁹), when set here.
  manualAt: 400,       // Center of the stretched section (m).
  manualLength: 20,    // Length of the stretched section (m).
};
Object.assign(settings, loadJSON<Partial<typeof settings>>('das_settings') ?? {});
const saveSettings = () => saveJSON('das_settings', settings);
const CHANNEL_OPTIONS = [1, 2, 5, 10, 20]; // Each divides L, so the channels tile the fiber.
if (!CHANNEL_OPTIONS.includes(settings.channel)) settings.channel = 2;
CHANNEL = settings.channel;
N_CH = L / CHANNEL;
const PRF_OPTIONS = [20, 50, 100, 200, 1000, 10000, 100000, 500000, 1000000];
const PULSE_OPTIONS = [10, 20, 50, 100, 200];
const FIBER_OPTIONS = [0.1, 0.5, 1, 5, 10, 25, 50]; // km. Fibers shorter than L end partway across the map.
const SLOWMO_OPTIONS = [0.5, 2, 4, 8, 16];
if (!PULSE_OPTIONS.includes(settings.pulseNs)) settings.pulseNs = 20;
if (!FIBER_OPTIONS.includes(settings.fiberKm)) settings.fiberKm = 1;
if (!SLOWMO_OPTIONS.includes(settings.slowmo)) settings.slowmo = 4;
if (settings.scatter !== 'even') settings.scatter = 'random';
if (settings.returnView !== 'intensity') settings.returnView = 'arrows';
if (settings.strainSource !== 'manual') settings.strainSource = 'map';
if (!PRF_OPTIONS.includes(settings.prf) || settings.prf > maxPulseRate()) settings.prf = 100;

/** The fiber's whole length (m). */
function fiberLength(): number { return settings.fiberKm * 1000; }
/** Time for a pulse to reach the end of the fiber and its light to return (s). */
function roundTrip(): number { return (2 * N_FIBER * fiberLength()) / C_LIGHT; }
/** Each pulse must return before the next is sent, so the pulse rate is at most 1 / round trip. */
function maxPulseRate(): number { return 1 / roundTrip(); }
/** The spatial resolution set by the pulse width: half the pulse's length in the fiber (m). */
function pulseResolution(): number { return (C_LIGHT * settings.pulseNs * 1e-9) / (2 * N_FIBER); }
/** The waterfall's sample rate: the pulse rate, averaged down to at most OUTPUT_RATE. */
/** The pulse rate in use: the chosen one, or with Auto, as fast as the fiber allows. */
function pulseRate(): number { return settings.prfAuto ? maxPulseRate() : settings.prf; }
function outputRate(): number { return Math.min(pulseRate(), OUTPUT_RATE); }
ROW_DT = 1 / outputRate();
N_ROWS = Math.round(WINDOW * outputRate());

// ── Sources ────────────────────────────────────────────────────────
interface Strike { x: number; y: number; t0: number; f: number; amp: number; color: string }
const strikes: Strike[] = [];

const car = { on: false, x: 0, y: -25, speed: 20 };        // Drives along a road 25 m from the fiber.
const walker = { on: false, x: 0, y: 12, speed: 1.4, nextStep: 0, stepEvery: 0.55 };
// A plane wave from far away. Its front is the line of points p with p·u = d, where u is its
// direction of travel; d starts at d0, just outside the map, and grows at the wave speed.
interface Quake { t0: number; angle: number; speed: number; f: number; amp: number; d0: number; d1: number }

/** The range of p·u over the map's corners, for a wave traveling at `angle` degrees. */
function frontRange(angle: number): [number, number] {
  const a = (angle * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a);
  const ds = [[0, -H], [0, H], [L, -H], [L, H]].map(([x, y]) => x * ux + y * uy);
  return [Math.min(...ds), Math.max(...ds)];
}
const quakes: Quake[] = [];

let simTime = 0;
let playing = true;

/** A Ricker ("Mexican hat") wavelet with peak frequency f, centered at τ = 0. */
function ricker(tau: number, f: number): number {
  const a = Math.PI * f * tau;
  const a2 = a * a;
  return a2 > 30 ? 0 : (1 - 2 * a2) * Math.exp(-a2);
}

/**
 * The strain rate along the fiber at fine sample k (x = k·DX) at time t, before gauge averaging,
 * in arbitrary units scaled so that typical signals are around 1.
 */
function pointStrainRate(x: number, t: number): number {
  let s = 0;
  const v = settings.waveSpeed;
  for (const st of strikes) {
    const dx = x - st.x, r = Math.hypot(dx, st.y);
    const tau = t - st.t0 - r / v;
    if (tau < -2 / st.f || tau > 2 / st.f) continue;
    const cos2 = r > 1e-6 ? (dx * dx) / (r * r) : 1;
    s += st.amp * cos2 / Math.sqrt(Math.max(r, 8)) * ricker(tau, st.f);
  }
  if (car.on) {
    // Strain under a moving point load at distance D from the fiber, as a function of q = s/D,
    // where s is the distance along the fiber from the car. The strain rate is −u·dε/ds.
    const D = Math.abs(car.y), q = (x - car.x) / D;
    const g = (2 * q * (3 - q * q)) / Math.pow(q * q + 1, 3);
    s += 0.9 * (car.speed / 20) * g;
  }
  for (const qk of quakes) {
    const a = (qk.angle * Math.PI) / 180;
    // A plane wave: its arrival along the fiber advances at the apparent speed V / cos(angle).
    // The front reaches fiber point x (where p·u = x cos a) after traveling from d0.
    const tau = t - qk.t0 - (x * Math.cos(a) - qk.d0) / qk.speed;
    if (tau < -2 / qk.f || tau > 2 / qk.f) continue;
    s += qk.amp * Math.cos(a) ** 2 * ricker(tau, qk.f);
  }
  return s;
}

// Gaussian-ish random numbers for the background noise, fixed per call.
function noise(): number {
  return (Math.random() + Math.random() + Math.random() - 1.5) * 0.07;
}

// ── One row of data ────────────────────────────────────────────────
const fine = new Float64Array(N_FINE);
const prefix = new Float64Array(N_FINE + 1);
const blurred = new Float64Array(N_FINE);

/**
 * The gauge-averaged strain rate at each channel at time t: the interrogator compares the phase
 * of light scattered from either end of a gauge-length section, so each channel sees the average
 * strain rate over that section.
 */
function channelRow(t: number, out: Float32Array) {
  for (let k = 0; k < N_FINE; k++) fine[k] = pointStrainRate(k * DX, t);
  // The pulse's length blurs everything along the fiber over its resolution, before the gauge.
  const blur = Math.round(pulseResolution() / DX / 2);
  if (blur > 0) {
    prefix[0] = 0;
    for (let k = 0; k < N_FINE; k++) prefix[k + 1] = prefix[k] + fine[k];
    for (let k = 0; k < N_FINE; k++) {
      const lo = Math.max(0, k - blur), hi = Math.min(N_FINE - 1, k + blur);
      blurred[k] = (prefix[hi + 1] - prefix[lo]) / (hi - lo + 1);
    }
    fine.set(blurred);
  }
  prefix[0] = 0;
  for (let k = 0; k < N_FINE; k++) prefix[k + 1] = prefix[k] + fine[k];
  const half = Math.max(0, Math.round(settings.gauge / DX / 2));
  for (let c = 0; c < N_CH; c++) {
    const center = Math.round(((c + 0.5) * CHANNEL) / DX);
    const lo = Math.max(0, center - half), hi = Math.min(N_FINE - 1, center + half);
    // A longer gauge collects more light-phase change for the same strain, so its noise is smaller
    // relative to the signal, falling as 1/√(gauge length) (scaled to 1 at 10 m).
    // Pulse rates above the waterfall's sample rate are averaged down, which lowers the noise too.
    const noiseScale = Math.sqrt(10 / Math.max(1, settings.gauge)) * Math.sqrt(outputRate() / pulseRate());
    // A channel past the end of the fiber measures nothing (NaN, drawn as "no fiber").
    out[c] = (c + 0.5) * CHANNEL > fiberLength() ? NaN
      : (prefix[hi + 1] - prefix[lo]) / (hi - lo + 1) + (settings.noise ? noise() * noiseScale : 0);
  }
}

// History of rows, as a ring buffer, for the waterfall and the channel trace.
let history = new Float32Array(N_ROWS * N_CH);
let newestRow = -1; // Index (in the ring) of the newest row.
let rowsFilled = 0;
let latest = new Float32Array(N_CH);
let nextRowTime = 0;
let selectedChannel = Math.round(N_CH * 0.45);

// ── Colors ─────────────────────────────────────────────────────────
// A diverging map: blue for compression rate (negative), white for zero, orange for stretching
// rate (positive). Blue–orange stays readable under the common kinds of color blindness.
const NEG = [33, 102, 172], MID = [247, 247, 247], POS = [179, 88, 6];
const NO_FIBER = [226, 226, 226]; // Waterfall color where there is no fiber.
function colorOf(v: number): [number, number, number] {
  if (Number.isNaN(v)) return NO_FIBER as [number, number, number];
  const u = Math.max(-1, Math.min(1, v * settings.gain));
  const [a, b] = u < 0 ? [MID, NEG] : [MID, POS];
  const w = Math.abs(u);
  return [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w, a[2] + (b[2] - a[2]) * w];
}
const css = (rgb: number[]) => `rgb(${rgb[0] | 0},${rgb[1] | 0},${rgb[2] | 0})`;

// ── Canvas helpers ─────────────────────────────────────────────────
function fit(canvas: HTMLCanvasElement): [CanvasRenderingContext2D, number, number] {
  const r = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, r.width, r.height);
  return [ctx, r.width, r.height];
}

// ── Map ────────────────────────────────────────────────────────────
const mapCanvas = $<HTMLCanvasElement>('das-map');
const MAP_PAD = { left: 70, right: 16, top: 12, bottom: 26 };
let mapScale = 1;
const mapX = (x: number) => MAP_PAD.left + x * mapScale;
const mapY = (y: number) => MAP_PAD.top + (H - y) * mapScale;

function drawMap() {
  const [ctx, w, h] = fit(mapCanvas);
  mapScale = Math.min((w - MAP_PAD.left - MAP_PAD.right) / L, (h - MAP_PAD.top - MAP_PAD.bottom) / (2 * H));

  // Ground.
  ctx.fillStyle = '#f3efe6';
  ctx.fillRect(mapX(0), mapY(H), L * mapScale, 2 * H * mapScale);
  // The road the car drives on, and the path the walker takes.
  ctx.fillStyle = '#d9d6cf';
  ctx.fillRect(mapX(0), mapY(car.y + 4), L * mapScale, 8 * mapScale);
  ctx.setLineDash([3, 4]);
  ctx.strokeStyle = '#b8b2a5';
  ctx.beginPath(); ctx.moveTo(mapX(0), mapY(walker.y)); ctx.lineTo(mapX(L), mapY(walker.y)); ctx.stroke();
  ctx.setLineDash([]);

  // Everything on the ground is clipped to the map area.
  ctx.save();
  ctx.beginPath(); ctx.rect(mapX(0), mapY(H), L * mapScale, 2 * H * mapScale); ctx.clip();
  // Wavefronts from strikes: a ring at the distance the wave has traveled, fading as it spreads.
  // Footsteps are much weaker than a hammer, so their rings are fainter and fade sooner.
  for (const st of strikes) {
    const r = settings.waveSpeed * (simTime - st.t0);
    if (r <= 0) continue;
    const alpha = st.color === WALKER_COLOR ? Math.max(0, 0.45 - r / 250) : Math.max(0, 0.8 - r / 600);
    if (alpha <= 0) continue;
    ctx.strokeStyle = st.color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(mapX(st.x), mapY(st.y), r * mapScale, 0, 2 * Math.PI); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // Earthquake plane waves: a line perpendicular to the direction of travel.
  for (const qk of quakes) {
    const a = (qk.angle * Math.PI) / 180;
    const d = qk.d0 + qk.speed * (simTime - qk.t0); // Where the front is now.
    const ux = Math.cos(a), uy = Math.sin(a);
    // Points p with p·u = d form the front; draw a long segment of it.
    // The front, with a fading trail behind it.
    ctx.strokeStyle = QUAKE_COLOR;
    for (let k = 0; k < 5; k++) {
      const dk = d - k * 18;
      const px = ux * dk, py = uy * dk;
      ctx.lineWidth = k === 0 ? 3 : 2;
      ctx.globalAlpha = 0.85 * (1 - k / 5);
      ctx.beginPath();
      ctx.moveTo(mapX(px - uy * 3000), mapY(py + ux * 3000));
      ctx.lineTo(mapX(px + uy * 3000), mapY(py - ux * 3000));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  // The car and the walker.
  if (car.on) {
    ctx.fillStyle = CAR_COLOR;
    const cx = mapX(car.x), cy = mapY(car.y);
    ctx.beginPath(); ctx.roundRect(cx - 9, cy - 5, 18, 10, 3); ctx.fill();
  }
  if (walker.on) {
    ctx.fillStyle = WALKER_COLOR;
    ctx.beginPath(); ctx.arc(mapX(walker.x), mapY(walker.y), 4.5, 0, 2 * Math.PI); ctx.fill();
  }
  ctx.restore();

  // The fiber, colored by the strain rate at each channel.
  const fy = mapY(0);
  const fiberEnd = Math.min(L, fiberLength()); // Where the fiber ends on the map.
  for (let c = 0; c < N_CH && c * CHANNEL < fiberEnd; c++) {
    ctx.strokeStyle = rowsFilled && !Number.isNaN(latest[c]) ? css(colorOf(latest[c])) : FIBER_IDLE;
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(mapX(c * CHANNEL), fy); ctx.lineTo(mapX((c + 1) * CHANNEL) + 0.5, fy); ctx.stroke();
  }
  ctx.strokeStyle = '#3c4043';
  ctx.lineWidth = 1;
  ctx.strokeRect(mapX(0), fy - 3.5, fiberEnd * mapScale, 7);
  if (fiberEnd < L) {
    ctx.fillStyle = '#3c4043';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('end of fiber', mapX(fiberEnd) + 6, fy + 4);
  }
  // The selected channel.
  const sx = mapX((selectedChannel + 0.5) * CHANNEL);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(sx, fy - 12); ctx.lineTo(sx, fy + 12); ctx.stroke();

  // The interrogator, at the start of the fiber.
  ctx.fillStyle = '#3c4043';
  ctx.fillRect(8, fy - 18, MAP_PAD.left - 14, 36);
  ctx.fillStyle = '#fff';
  ctx.font = '600 10px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Inter-', 8 + (MAP_PAD.left - 14) / 2, fy - 3);
  ctx.fillText('rogator', 8 + (MAP_PAD.left - 14) / 2, fy + 10);

  // A wave arriving nearly broadside barely registers, which can look like a bug; say why.
  const broadside = quakes.find(qk => qk.angle >= 75 && qk.d0 + qk.speed * (simTime - qk.t0) < qk.d1);
  if (broadside) {
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    const text = `Arriving at ${broadside.angle}° to the fiber: it barely stretches the fiber, so DAS barely sees it`;
    const tw = ctx.measureText(text).width;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(mapX(L / 2) - tw / 2 - 6, mapY(-H) - 26, tw + 12, 20);
    ctx.fillStyle = QUAKE_COLOR;
    ctx.fillText(text, mapX(L / 2), mapY(-H) - 12);
    ctx.textAlign = 'start';
  }
  // Where each recent hammer strike hit.
  for (const st of strikes) {
    if (st.color !== SOURCE_COLOR || simTime - st.t0 > 1.5) continue;
    ctx.fillStyle = SOURCE_COLOR;
    ctx.beginPath(); ctx.arc(mapX(st.x), mapY(st.y), 5, 0, 2 * Math.PI); ctx.fill();
  }

  // Distance axis.
  ctx.fillStyle = '#5f6368';
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  for (let d = 0; d <= L; d += 100) ctx.fillText(`${d}${d === L ? ' m' : ''}`, mapX(d), h - 8);
  ctx.textAlign = 'start';
}

// ── Waterfall and channel trace ────────────────────────────────────
const wfCanvas = $<HTMLCanvasElement>('das-waterfall');
const traceCanvas = $<HTMLCanvasElement>('das-trace');
// The waterfall image: one pixel per channel and per row, scaled up when drawn.
const wfImage = document.createElement('canvas');
wfImage.width = N_CH;
wfImage.height = N_ROWS;
const wfCtx = wfImage.getContext('2d')!;
wfCtx.fillStyle = css(MID);
wfCtx.fillRect(0, 0, N_CH, N_ROWS);
let rowPixels = wfCtx.createImageData(N_CH, 1);
const WF_PAD = { left: 44, right: 10, top: 8, bottom: 26 };

function pushRow(t: number) {
  channelRow(t, latest);
  newestRow = (newestRow + 1) % N_ROWS;
  history.set(latest, newestRow * N_CH);
  for (let c = 0; c < N_CH; c++) {
    if (!Number.isNaN(latest[c])) phaseAcc[c] = phaseAcc[c] * 0.995 + latest[c] * ROW_DT * 12;
  }
  rowsFilled = Math.min(N_ROWS, rowsFilled + 1);
  // Scroll the image up one row and draw the new row at the bottom (time runs downward).
  wfCtx.drawImage(wfImage, 0, -1);
  for (let c = 0; c < N_CH; c++) {
    const [r, g, b] = colorOf(latest[c]);
    rowPixels.data[c * 4] = r; rowPixels.data[c * 4 + 1] = g; rowPixels.data[c * 4 + 2] = b; rowPixels.data[c * 4 + 3] = 255;
  }
  wfCtx.putImageData(rowPixels, 0, N_ROWS - 1);
}

/** Recolors the whole waterfall image from the history, after the color scale changes. */
function repaintWaterfall() {
  const img = wfCtx.createImageData(N_CH, N_ROWS);
  for (let k = 0; k < N_ROWS; k++) {
    const age = N_ROWS - 1 - k;  // Row k of the image is `age` rows older than the newest.
    const ring = (newestRow - age + N_ROWS * 2) % N_ROWS;
    for (let c = 0; c < N_CH; c++) {
      const v = age < rowsFilled ? history[ring * N_CH + c] : 0;
      const [r, g, b] = colorOf(v);
      const p = (k * N_CH + c) * 4;
      img.data[p] = r; img.data[p + 1] = g; img.data[p + 2] = b; img.data[p + 3] = 255;
    }
  }
  wfCtx.putImageData(img, 0, 0);
}

function drawWaterfall() {
  const [ctx, w, h] = fit(wfCanvas);
  const pw = w - WF_PAD.left - WF_PAD.right, ph = h - WF_PAD.top - WF_PAD.bottom;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(wfImage, WF_PAD.left, WF_PAD.top, pw, ph);
  ctx.strokeStyle = '#3c4043';
  ctx.lineWidth = 1;
  ctx.strokeRect(WF_PAD.left, WF_PAD.top, pw, ph);
  // Selected channel.
  const sx = WF_PAD.left + ((selectedChannel + 0.5) / N_CH) * pw;
  ctx.setLineDash([4, 3]);
  ctx.strokeStyle = '#000';
  ctx.beginPath(); ctx.moveTo(sx, WF_PAD.top); ctx.lineTo(sx, WF_PAD.top + ph); ctx.stroke();
  ctx.setLineDash([]);
  // Axes: distance along the bottom, time (seconds ago) on the left.
  ctx.fillStyle = '#5f6368';
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  for (let d = 0; d <= L; d += 200) ctx.fillText(`${d}${d === L ? ' m' : ''}`, WF_PAD.left + (d / L) * pw, h - 8);
  ctx.textAlign = 'right';
  const seconds = (N_ROWS * ROW_DT);
  for (let s = 0; s <= seconds; s += 1) {
    const y = WF_PAD.top + ph - (s / seconds) * ph;
    ctx.fillText(s === 0 ? 'now' : `−${s} s`, WF_PAD.left - 5, y + 4);
  }
  ctx.textAlign = 'start';
}

function drawTrace() {
  const [ctx, w, h] = fit(traceCanvas);
  const pad = { left: 10, right: 10, top: 22, bottom: 26 };
  const pw = w - pad.left - pad.right, ph = h - pad.top - pad.bottom;
  // The zero line; time runs downward, as in the waterfall.
  ctx.strokeStyle = 'rgba(128,128,128,0.35)';
  ctx.beginPath(); ctx.moveTo(pad.left + pw / 2, pad.top); ctx.lineTo(pad.left + pw / 2, pad.top + ph); ctx.stroke();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const noFiber = (selectedChannel + 0.5) * CHANNEL > fiberLength();
  if (noFiber) {
    ctx.fillStyle = '#5f6368'; ctx.font = 'italic 12px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('No fiber here', pad.left + pw / 2, pad.top + ph / 2);
    ctx.textAlign = 'start';
  }
  for (let age = 0; !noFiber && age < rowsFilled; age++) {
    const ring = (newestRow - age + N_ROWS) % N_ROWS;
    const v = Math.max(-1.2, Math.min(1.2, history[ring * N_CH + selectedChannel] * settings.gain));
    // Time runs downward here too, to match the waterfall: the newest sample is at the bottom.
    const x = pad.left + pw / 2 + (v / 1.2) * (pw / 2);
    const y = pad.top + ph - (age / (N_ROWS - 1)) * ph;
    if (age === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = '#3c4043';
  ctx.font = '600 12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Channel at ${((selectedChannel + 0.5) * CHANNEL).toFixed(0)} m`, pad.left + pw / 2, 14);
  ctx.textAlign = 'start';
  ctx.fillStyle = '#5f6368';
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('squeezing', pad.left, h - 8);
  ctx.textAlign = 'right';
  ctx.fillText('stretching', pad.left + pw, h - 8);
  ctx.textAlign = 'start';
}

// ── Interrogator (slow motion) ─────────────────────────────────────
// A laser pulse takes 2nL/c (about 9.8 μs per km) to go down the fiber and back. Shown slowed down
// so one round trip takes settings.slowmo seconds of real time.
const iCanvas = $<HTMLCanvasElement>('das-interrogator');
let pulseClock = 0;   // Real seconds into the current slow-motion round trip.
let animPlaying = true; // The slow-motion view can be paused on its own.
// Each pulse measures one row: the strain along the fiber at the moment the pulse was sent.
// (In reality the fiber barely changes during a 10 μs round trip.) The slow-motion view keeps
// that row, rather than following the live simulation, and reveals it as the light returns.
let pulseRow = new Float32Array(N_CH);
let pulseCount = 0; // Pulses sent so far; the first has no previous pulse to compare with.

// With the strain set here, a section of fiber is stretched by settings.manualStrain (nanostrain).
// The phase difference across a gauge G is Δφ = 4πnξG·ε/λ (in radians), using ε averaged over the
// gauge; between pulses the change in phase comes from the change in ε.
const LAMBDA = 1550e-9, XI = 0.78;
/** The gauge-averaged strain (unitless) of the manually stretched section, around distance z. */
function manualGaugeStrain(z: number): number {
  const G = Math.max(settings.gauge, pulseResolution());
  const a0 = z - G / 2, a1 = z + G / 2;
  const b0 = settings.manualAt - settings.manualLength / 2, b1 = settings.manualAt + settings.manualLength / 2;
  const overlap = Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
  return (overlap / G) * settings.manualStrain * 1e-9;
}
const phaseFromStrain = (eps: number) => (4 * Math.PI * N_FIBER * XI * settings.gauge * eps) / LAMBDA;
let prevManualRow: Float32Array | null = null; // Gauge strains measured by the previous pulse.

// What each pulse measures, saved when the pulse is sent:
//   pulseAccum[c]: the round-trip phase of the light from channel c, compared with the unstretched
//     fiber. It builds up through every stretched section on the way there and back, so it ramps
//     through a stretch and stays shifted beyond it.
//   pulseShift[c]: the difference of that phase across one gauge, which is what DAS reports; it is
//     nonzero only where the fiber is stretched, which is what localizes the strain.
let pulseAccum = new Float32Array(N_CH);
let pulseShift = new Float32Array(N_CH);

function measurePhases() {
  const manual = settings.strainSource === 'manual';
  let total = 0;
  for (let c = 0; c < N_CH; c++) {
    if (manual) {
      // Integrate the stretched section's strain from the interrogator up to this channel.
      const z = (c + 0.5) * CHANNEL;
      const b0 = settings.manualAt - settings.manualLength / 2, b1 = settings.manualAt + settings.manualLength / 2;
      const inside = Math.max(0, Math.min(z, b1) - Math.max(0, b0));
      pulseAccum[c] = (4 * Math.PI * N_FIBER * XI * inside * settings.manualStrain * 1e-9) / LAMBDA;
      pulseShift[c] = phaseFromStrain(manualGaugeStrain(z));
    } else {
      // Each channel's phase covers one gauge; per channel spacing, it adds CHANNEL / gauge of it.
      if (Number.isFinite(phaseAcc[c])) total += (phaseAcc[c] * CHANNEL) / Math.max(1, settings.gauge);
      pulseAccum[c] = total;
      pulseShift[c] = phaseAcc[c];
    }
  }
}

const startPulse = () => {
  pulseClock = 0;
  pulseCount++;
  measurePhases();
  if (settings.strainSource === 'map') { pulseRow.set(latest); return; }
  // Set here: the change in phase since the previous pulse, scaled so π radians fills the plot.
  const now = new Float32Array(N_CH);
  for (let c = 0; c < N_CH; c++) now[c] = manualGaugeStrain((c + 0.5) * CHANNEL);
  for (let c = 0; c < N_CH; c++) pulseRow[c] = prevManualRow ? phaseFromStrain(now[c] - prevManualRow[c]) / Math.PI : 0;
  if (!prevManualRow) pulseCount = 0; // Nothing to compare with yet.
  prevManualRow = now;
};

// Each channel's phase shift (map strain), accumulated from its strain rate, for the phase-shift
// graph. A slow leak keeps noise from wandering it far from its resting value.
let phaseAcc = new Float32Array(N_CH);


/**
 * Rebuilds the waterfall's buffers after the channel spacing or the pulse rate changes. The
 * history has one value per channel and per row, so it starts over; the selected channel stays at
 * the same place along the fiber.
 */
function rebuildBuffers() {
  const selectedAt = (selectedChannel + 0.5) * CHANNEL;
  CHANNEL = settings.channel;
  N_CH = L / CHANNEL;
  ROW_DT = 1 / outputRate();
  N_ROWS = Math.round(WINDOW * outputRate());
  wfImage.height = N_ROWS;
  history = new Float32Array(N_ROWS * N_CH);
  latest = new Float32Array(N_CH);
  pulseRow = new Float32Array(N_CH);
  pulseAccum = new Float32Array(N_CH);
  pulseShift = new Float32Array(N_CH);
  phaseAcc = new Float32Array(N_CH);
  prevManualRow = null;
  newestRow = -1;
  rowsFilled = 0;
  wfImage.width = N_CH; // Resizing also clears it.
  wfCtx.fillStyle = css(MID);
  wfCtx.fillRect(0, 0, N_CH, N_ROWS);
  rowPixels = wfCtx.createImageData(N_CH, 1);
  selectedChannel = Math.max(0, Math.min(N_CH - 1, Math.floor(selectedAt / CHANNEL)));
}
// Rayleigh backscatter: each meter of fiber returns light with a random amplitude (a fixed
// "fingerprint" of the fiber). The amplitude of a sum of many random phasors is Rayleigh-distributed.
// Generated once, per meter, for the longest fiber offered. Its running sum lets the plot average
// it over the pulse's resolution quickly.
const MAX_FIBER = Math.max(...FIBER_OPTIONS) * 1000;
const backscatter = new Float32Array(MAX_FIBER + 1);
for (let k = 0; k <= MAX_FIBER; k++) {
  let re = 0, im = 0;
  for (let j = 0; j < 6; j++) { const a = Math.random() * 2 * Math.PI; re += Math.cos(a); im += Math.sin(a); }
  backscatter[k] = Math.hypot(re, im) / 6;
}
const backscatterSum = new Float64Array(MAX_FIBER + 2);
for (let k = 0; k <= MAX_FIBER; k++) backscatterSum[k + 1] = backscatterSum[k] + backscatter[k];
/** Fiber loss of about 0.2 dB/km each way: the returned light's amplitude falls 0.4 dB per km. */
const lossAt = (z: number) => Math.pow(10, (-0.4 * z) / 1000 / 20);
// A sprinkling of scatterers drawn on the fiber, as fractions of its length.
const N_SCATTERERS = 60;
const randomScatterers = Array.from({ length: N_SCATTERERS }, () => Math.random());
const evenScatterers = Array.from({ length: N_SCATTERERS }, (_, i) => (i + 0.5) / N_SCATTERERS);
const scatterers = () => (settings.scatter === 'even' ? evenScatterers : randomScatterers);
// Average backscatter amplitude, used when the scatterers are evenly spaced and identical: their
// returns then add up the same way everywhere, so the backscatter is steady instead of speckled.
const MEAN_BACKSCATTER = backscatterSum[MAX_FIBER + 1] / (MAX_FIBER + 1);

/** The backscattered amplitude from distance z, averaged over the pulse's resolution, with loss. */
function returnedAmplitude(z: number): number {
  if (settings.scatter === 'even') return MEAN_BACKSCATTER * lossAt(z);
  const half = Math.max(0.5, pulseResolution() / 2);
  const lo = Math.max(0, Math.floor(z - half)), hi = Math.min(MAX_FIBER, Math.ceil(z + half));
  return ((backscatterSum[hi + 1] - backscatterSum[lo]) / (hi - lo + 1)) * lossAt(z);
}

/**
 * Arrows at both ends of a stretched or compressed section (from x0 to x1), pointing outward when
 * it is stretched and inward when it is compressed, with lengths scaled by `amount` (from −1 to 1),
 * and a label above them.
 */
function strainArrows(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, amount: number, label: string) {
  const color = amount >= 0 ? '#B35806' : '#2166AC';
  const len = 6 + 34 * Math.min(1, Math.abs(amount));
  const arrow = (from: number, to: number) => {
    ctx.strokeStyle = ctx.fillStyle = color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(from, y); ctx.lineTo(to, y); ctx.stroke();
    const dir = Math.sign(to - from) || 1;
    ctx.beginPath(); ctx.moveTo(to, y); ctx.lineTo(to - dir * 7, y - 4); ctx.lineTo(to - dir * 7, y + 4); ctx.closePath(); ctx.fill();
  };
  if (amount !== 0) {
    if (amount > 0) { arrow(x0, x0 - len); arrow(x1, x1 + len); } else { arrow(x0 - len, x0); arrow(x1 + len, x1); }
  }
  ctx.fillStyle = color; ctx.font = '600 11px system-ui, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(label, (x0 + x1) / 2, y - 8);
  ctx.textAlign = 'start';
}

/** A change in length, given in nanometers, with a sign and a suitable unit. */
function lengthChange(nm: number): string {
  const sign = nm > 0 ? '+' : nm < 0 ? '−' : '';
  const a = Math.abs(nm);
  return a >= 1000 ? `${sign}${(a / 1000).toFixed(a >= 10000 ? 1 : 2)} μm` : `${sign}${a.toFixed(a < 10 ? 1 : 0)} nm`;
}

/** A round step (1, 2, or 5 times a power of 10) giving about `count` ticks across `span`. */
function niceStep(span: number, count: number): number {
  const raw = span / count, p = Math.pow(10, Math.floor(Math.log10(raw)));
  return [1, 2, 5, 10].map(m => m * p).find(step => step >= raw)!;
}
const distanceLabel = (m: number) => (m >= 1000 ? `${+(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`);

function drawInterrogator() {
  const [ctx, w] = fit(iCanvas);
  const pad = { left: 70, right: 16 };
  const fw = w - pad.left - pad.right;
  const LF = fiberLength(), RT = roundTrip();
  const X = (x: number) => pad.left + (x / LF) * fw;
  const fiberY = 88; // Leaves room above the fiber for the returning light's phase.
  const frac = Math.min(1, pulseClock / settings.slowmo); // Fraction of the round trip.
  const tNow = frac * RT;                                  // Time since the pulse left (s).
  const pulseLen = (C_LIGHT * settings.pulseNs * 1e-9) / N_FIBER; // The pulse's length in the fiber (m).
  // Where the pulse's leading edge would be if the fiber went on forever. The pulse is drawn only
  // where it is inside the fiber, and once all of it is past the end, nothing scatters.
  const pulseFront = (C_LIGHT / N_FIBER) * tNow;
  const manual = settings.strainSource === 'manual';
  // Both phase graphs and the returning light's phase show what this pulse measured: the fiber's
  // state when the pulse was sent (see measurePhases), not the live state.
  const accum = pulseAccum;
  const shiftAt = (c: number) => pulseShift[c];
  /** The accumulated round-trip phase for light from distance z (constant beyond the mapped part). */
  const accumAt = (z: number) => {
    const c = Math.min(N_CH - 1, Math.max(0, Math.floor(Math.min(z, L) / CHANNEL)));
    return z <= 0 ? 0 : accum[c];
  };

  // Fiber, interrogator.
  ctx.strokeStyle = '#3c4043'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(X(0), fiberY); ctx.lineTo(X(LF), fiberY); ctx.stroke();
  ctx.strokeStyle = '#dfe3e8'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(X(0), fiberY); ctx.lineTo(X(LF), fiberY); ctx.stroke();
  // The section stretched by hand, when the strain is set here.
  if (settings.strainSource === 'manual') {
    const a = Math.max(0, settings.manualAt - settings.manualLength / 2), b = Math.min(LF, settings.manualAt + settings.manualLength / 2);
    if (b > a) {
      ctx.fillStyle = settings.manualStrain >= 0 ? 'rgba(179,88,6,0.35)' : 'rgba(33,102,172,0.35)';
      ctx.fillRect(X(a), fiberY - 9, Math.max(2, X(b) - X(a)), 18);
      // Its change in length: strain × length, in nanometers (the strain is in nanostrain).
      const deltaNm = settings.manualStrain * 1e-9 * (b - a) * 1e9;
      strainArrows(ctx, X(a), X(b), fiberY - 17, settings.manualStrain / 200, `ΔL = ${lengthChange(deltaNm)}`);
    }
  }
  // The part of the fiber shown on the map.
  if (LF > L) {
    ctx.fillStyle = 'rgba(0,114,178,0.18)';
    ctx.fillRect(X(0), fiberY - 7, X(L) - X(0), 14);
  }
  ctx.fillStyle = '#3c4043';
  ctx.fillRect(8, fiberY - 18, pad.left - 14, 36);
  ctx.fillStyle = '#fff'; ctx.font = '600 10px system-ui, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Laser +', 8 + (pad.left - 14) / 2, fiberY - 3);
  ctx.fillText('detector', 8 + (pad.left - 14) / 2, fiberY + 10);
  ctx.textAlign = 'start';
  // Scatterers: tiny flaws in the glass. Each flashes as the pulse passes over it, which is when it
  // reflects a little of the pulse's light back toward the detector.
  for (const s of scatterers()) {
    const z = s * LF;
    // Flash while the pulse covers the scatterer (for at least a short visible stretch).
    const flashing = z <= pulseFront && z >= pulseFront - Math.max(pulseLen, LF * 0.015);
    ctx.fillStyle = flashing ? '#D55E00' : '#5f6368';
    ctx.beginPath(); ctx.arc(X(z), fiberY, flashing ? 4 : 2, 0, 2 * Math.PI); ctx.fill();
    if (flashing) {
      ctx.strokeStyle = 'rgba(213,94,0,0.6)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(X(z), fiberY, 8, 0, 2 * Math.PI); ctx.stroke();
    }
  }
  // Outgoing pulse, drawn solid at its true length in the fiber, and labeled with that length.
  // A pulse too short to see at this scale is drawn MIN_PULSE_PX wide and labeled as not to scale.
  const MIN_PULSE_PX = 4;
  if (pulseFront - pulseLen < LF) {
    // The part of the pulse inside the fiber: its front stops at the end while its tail catches up.
    const x1 = X(Math.min(LF, pulseFront)), trueX0 = X(Math.max(0, pulseFront - pulseLen));
    const toScale = x1 - trueX0 >= MIN_PULSE_PX;
    const x0 = toScale ? trueX0 : x1 - MIN_PULSE_PX;
    ctx.fillStyle = '#D55E00';
    ctx.fillRect(x0, fiberY - 6, x1 - x0, 12);
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    const label = `${toScale ? 'pulse' : 'pulse, not to scale'}: ${pulseLen.toFixed(pulseLen < 10 ? 1 : 0)} m`;
    const lw = ctx.measureText(label).width;
    // Keep the label over the pulse but inside the canvas.
    const lx = Math.min(pad.left + fw - lw / 2, Math.max(pad.left + lw / 2, (x0 + x1) / 2));
    ctx.fillText(label, lx, fiberY - 12);
    ctx.textAlign = 'start';
  }
  // Backscattered light heading home. Light scattered at z when the pulse passed (time z·n/c) is
  // now at x = 2z − c·tNow/n. Either draw an arrow for each scatterer's light, or graph the
  // intensity of all the returning light along the fiber, which flows left toward the detector.
  if (settings.returnView === 'intensity') {
    const baseY = fiberY + 7, height = 14;
    ctx.fillStyle = 'rgba(213,94,0,0.3)'; // The pulse's color: this is the pulse's light, scattered back.
    ctx.strokeStyle = '#D55E00';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(X(0), baseY);
    const top = (px: number) => {
      const x = (px / fw) * LF;
      // The light now at x was scattered at z, which the pulse must have reached, inside the fiber.
      const z = (x + pulseFront) / 2;
      if (x > pulseFront || z > LF) return baseY;
      return baseY + Math.min(1, returnedAmplitude(z) / 0.9) * height;
    };
    for (let px = 0; px <= fw; px++) ctx.lineTo(pad.left + px, top(px));
    ctx.lineTo(X(LF), baseY);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    for (let px = 0; px <= fw; px++) { const y = top(px); if (px === 0) ctx.moveTo(pad.left, y); else ctx.lineTo(pad.left + px, y); }
    ctx.stroke();
  }
  for (const s of settings.returnView === 'arrows' ? scatterers() : []) {
    const z = s * LF, scatteredAt = (z * N_FIBER) / C_LIGHT;
    if (tNow < scatteredAt) continue;
    const pos = z - ((tNow - scatteredAt) * C_LIGHT) / N_FIBER;
    if (pos < 0) continue;
    // A small arrow pointing back toward the detector.
    const ax = X(pos), ay = fiberY + 11;
    ctx.strokeStyle = ctx.fillStyle = 'rgba(0,114,178,0.85)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ax + 9, ay); ctx.lineTo(ax + 2, ay); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ax - 2, ay); ctx.lineTo(ax + 3, ay - 3); ctx.lineTo(ax + 3, ay + 3); ctx.closePath(); ctx.fill();
  }
  // The returning light's phase shift, drawn above the fiber wherever light is heading back.
  // Light now at x was scattered at z = (x + front)/2. It picked up the phase of every stretch on the
  // way out to z (half the round-trip phase there) and on the way back from z to x, so its shift is
  // accum(z) − accum(x)/2. The line is scaled to the largest shift anywhere on the fiber.
  {
    // A band well above the stretch arrows and their ΔL label, so a large shift can't reach them.
    const waveY = fiberY - 52, band = 10;
    ctx.fillStyle = '#5f6368'; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('returning', pad.left - 6, waveY - 2); // Two lines, to fit left of the plot.
    ctx.fillText('light phase', pad.left - 6, waveY + 10);
    ctx.textAlign = 'start';
    ctx.strokeStyle = 'rgba(128,128,128,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(X(0), waveY); ctx.lineTo(X(LF), waveY); ctx.stroke();
    // At least ±π, like the phase graphs below, so background noise isn't magnified to fill the band.
    let biggest = Math.PI;
    for (let c = 0; c < N_CH; c++) if (Number.isFinite(accum[c])) biggest = Math.max(biggest, Math.abs(accum[c]));
    ctx.strokeStyle = '#0072B2'; ctx.lineWidth = 2;
    ctx.beginPath();
    let drawing = false;
    for (let px = 0; px <= fw; px++) {
      const x = (px / fw) * LF, z = (x + pulseFront) / 2;
      if (x > pulseFront || z > LF) { drawing = false; continue; }
      const shift = accumAt(z) - accumAt(x) / 2;
      const y = waveY - (shift / biggest) * band;
      if (!drawing) { ctx.moveTo(pad.left + px, y); drawing = true; } else ctx.lineTo(pad.left + px, y);
    }
    ctx.stroke();
    // The shift of the light now reaching the detector.
    if (pulseFront > 0) {
      const z0 = Math.min(LF, pulseFront / 2);
      const shift0 = accumAt(z0);
      ctx.fillStyle = '#0072B2'; ctx.font = '600 11px system-ui, sans-serif';
      ctx.fillText(`arriving now: ${shift0 >= 0 ? '+' : '−'}${Math.abs(shift0).toFixed(2)} rad`, X(0), waveY - band - 5);
    }
  }
  // Legend, along the right of the fiber's label row.
  ctx.font = '11px system-ui, sans-serif';
  const legend: [string, string, 'dot' | 'flash' | 'pulse' | 'arrow'][] = [
    ['#5f6368', 'scatterer (a tiny flaw in the glass)', 'dot'],
    ['#D55E00', 'scattering as the pulse passes', 'flash'],
    ['#D55E00', 'outgoing pulse', 'pulse'],
    ['#0072B2', 'light returning to the detector', 'arrow'],
  ];
  let lx = pad.left + fw;
  ctx.textAlign = 'right';
  for (let i = legend.length - 1; i >= 0; i--) {
    const [color, text, kind] = legend[i];
    ctx.fillStyle = '#5f6368';
    ctx.fillText(text, lx, fiberY + 30);
    lx -= ctx.measureText(text).width + 14;
    ctx.fillStyle = ctx.strokeStyle = color;
    const sy = fiberY + 26;
    if (kind === 'dot') { ctx.beginPath(); ctx.arc(lx + 6, sy, 2, 0, 2 * Math.PI); ctx.fill(); }
    if (kind === 'flash') { ctx.beginPath(); ctx.arc(lx + 6, sy, 3, 0, 2 * Math.PI); ctx.fill(); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(lx + 6, sy, 6, 0, 2 * Math.PI); ctx.stroke(); }
    if (kind === 'pulse') ctx.fillRect(lx, sy - 3, 12, 6);
    if (kind === 'arrow') { ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(lx + 12, sy); ctx.lineTo(lx + 3, sy); ctx.stroke(); ctx.beginPath(); ctx.moveTo(lx, sy); ctx.lineTo(lx + 4, sy - 3); ctx.lineTo(lx + 4, sy + 3); ctx.closePath(); ctx.fill(); }
    lx -= 22;
  }
  ctx.textAlign = 'start';
  if (LF > L) {
    ctx.fillStyle = '#0072B2';
    ctx.fillText('shown on the map', X(0), fiberY - 14);
  }

  // The phase shift along the fiber, measured from the unstretched fiber (not from the previous
  // pulse), drawn live so it follows the strain as it changes. The axis is distance, with the
  // round-trip time at which the light from each distance reaches the detector.
  const ph = 62;
  const plotX = (t: number) => pad.left + (t / RT) * fw;
  const received = Math.min(LF, (C_LIGHT * tNow) / (2 * N_FIBER)); // Distance whose echo has arrived.
  /**
   * One phase plot at `plotTop`, with its own scale (at least ±π, or enough for its largest value).
   * Values continue at `beyond` along the part of a long fiber past the map.
   */
  const phasePlot = (plotTop: number, value: (c: number) => number, beyond: (lastValue: number) => number,
    color: string, heading: string) => {
    let peak = Math.PI;
    for (let c = 0; c < N_CH; c++) { const v = Math.abs(value(c)); if (v > peak && Number.isFinite(v)) peak = v; }
    const yOf = (v: number) => plotTop + ph / 2 - (v / (peak * 1.1)) * (ph / 2);
    ctx.strokeStyle = 'rgba(128,128,128,0.4)'; ctx.lineWidth = 1;
    ctx.strokeRect(pad.left, plotTop, fw, ph);
    ctx.beginPath(); ctx.moveTo(pad.left, plotTop + ph / 2); ctx.lineTo(pad.left + fw, plotTop + ph / 2); ctx.stroke();
    ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.beginPath();
    let started = false, last = 0;
    // Known only as far as this pulse's light has returned, so it fills in from near to far.
    for (let c = 0; c < N_CH && (c + 0.5) * CHANNEL <= Math.min(L, LF, received); c++) {
      const v = value(c);
      if (!Number.isFinite(v)) continue;
      last = v;
      const x = X((c + 0.5) * CHANNEL), y = yOf(v);
      if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
    }
    if (LF > L && received > L) ctx.lineTo(X(received), yOf(beyond(last)));
    ctx.stroke();
    ctx.fillStyle = '#3c4043'; ctx.font = '600 12px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(heading, pad.left + fw / 2, plotTop - 8);
    ctx.fillStyle = '#5f6368'; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(`+${(peak * 1.1).toFixed(1)} rad`, pad.left - 4, plotTop + 9);
    ctx.fillText('0', pad.left - 4, plotTop + ph / 2 + 4);
    ctx.fillText(`−${(peak * 1.1).toFixed(1)} rad`, pad.left - 4, plotTop + ph - 2);
    ctx.textAlign = 'start';
  };
  const unit = manual ? '' : ' (arbitrary scale)';
  // The phase of the light from each point: it carries the shift from every stretch before it, so
  // past the map it keeps its last value.
  const top = 156;
  phasePlot(top, c => accum[c], v => v, '#0072B2', `Phase of the light returning from each point, compared with the unstretched fiber${unit}`);
  // What DAS reports: the difference across one gauge, nonzero only where the fiber is stretched.
  const topB = top + ph + 34;
  phasePlot(topB, shiftAt, () => 0, '#009E73', `Phase difference across one gauge length: what DAS reports${unit}`);
  // Distance (and when its light returns) along the bottom of the second plot.
  ctx.fillStyle = '#5f6368'; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
  const stepUs = niceStep(RT * 1e6, 5);
  for (let us = 0; us <= RT * 1e6 + 1e-9; us += stepUs) {
    const d = (C_LIGHT * us * 1e-6) / (2 * N_FIBER);
    ctx.fillText(distanceLabel(d), plotX(us * 1e-6), topB + ph + 13);
    ctx.fillText(`${+us.toFixed(3)} μs`, plotX(us * 1e-6), topB + ph + 26);
  }
  // Axis titles sit left of the first tick label, which is centered on the plot's left edge.
  ctx.textAlign = 'right';
  ctx.fillText('distance:', pad.left - 22, topB + ph + 13);
  ctx.fillText('time:', pad.left - 22, topB + ph + 26);
  ctx.textAlign = 'start';

  // Phase change since the previous pulse, along the fiber: proportional to the gauge-averaged
  // strain rate, which is exactly what one row of the waterfall shows. It is known at distance z
  // only once the light from z has returned, so it is drawn only that far, filling in with the
  // backscatter plot above.
  const top2 = topB + ph + 62, ph2 = 70;
  ctx.strokeStyle = 'rgba(128,128,128,0.4)';
  ctx.strokeRect(pad.left, top2, fw, ph2);
  ctx.beginPath(); ctx.moveTo(pad.left, top2 + ph2 / 2); ctx.lineTo(pad.left + fw, top2 + ph2 / 2); ctx.stroke();
  ctx.strokeStyle = '#D55E00'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  // The first pulse has nothing to compare with, so it shows no change in phase.
  if (pulseCount === 0) {
    ctx.fillStyle = '#5f6368'; ctx.font = 'italic 12px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('First pulse: no previous pulse to compare with yet', pad.left + fw / 2, top2 + ph2 / 2 - 6);
    ctx.textAlign = 'start';
  }
  // The axis covers the part of the fiber on the map: its first L meters, or all of a shorter one.
  const span = Math.min(L, LF);
  for (let c = 0; pulseCount > 0 && c < N_CH && (c + 0.5) * CHANNEL <= Math.min(received, span); c++) {
    const x = pad.left + ((c + 0.5) * CHANNEL / span) * fw;
    const v = Math.max(-1.2, Math.min(1.2, pulseRow[c] * settings.gain));
    const y = top2 + ph2 / 2 - (v / 1.2) * (ph2 / 2) * 0.95;
    if (c === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = '#3c4043'; ctx.font = '600 12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Change in phase since the previous pulse${LF > L ? `, first ${distanceLabel(L)}` : ''} (this pulse’s row of the waterfall)`, pad.left + fw / 2, top2 - 8);
  ctx.textAlign = 'start';
  ctx.fillStyle = '#5f6368'; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
  const dStep = niceStep(span, 5);
  for (let d = 0; d <= span + 1e-9; d += dStep) ctx.fillText(distanceLabel(d), pad.left + (d / span) * fw, top2 + ph2 + 13);
  ctx.textAlign = 'start';
}

// ── Interaction ────────────────────────────────────────────────────
function mapToWorld(e: PointerEvent): [number, number] {
  const r = mapCanvas.getBoundingClientRect();
  const px = e.clientX - r.left, py = e.clientY - r.top;
  return [(px - MAP_PAD.left) / mapScale, H - (py - MAP_PAD.top) / mapScale];
}

mapCanvas.addEventListener('pointerdown', e => {
  const [x, y] = mapToWorld(e);
  if (x < 0 || x > L || y < -H || y > H) return;
  // A click on (or right next to) the fiber picks that channel; anywhere else is a hammer strike.
  if (Math.abs(y) * mapScale < 8 && x <= Math.min(L, fiberLength())) {
    selectedChannel = Math.max(0, Math.min(N_CH - 1, Math.floor(x / CHANNEL)));
  } else {
    strikes.push({ x, y, t0: simTime, f: 12, amp: 7, color: SOURCE_COLOR });
  }
  e.preventDefault();
});
mapCanvas.addEventListener('pointermove', e => {
  const [x, y] = mapToWorld(e);
  const inside = x >= 0 && x <= L && y >= -H && y <= H;
  mapCanvas.style.cursor = !inside ? 'default' : Math.abs(y) * mapScale < 8 ? 'pointer' : 'crosshair';
});

function pickChannelFromWaterfall(e: PointerEvent) {
  const r = wfCanvas.getBoundingClientRect();
  const pw = r.width - WF_PAD.left - WF_PAD.right;
  const u = (e.clientX - r.left - WF_PAD.left) / pw;
  if (u >= 0 && u <= 1) selectedChannel = Math.max(0, Math.min(N_CH - 1, Math.floor(u * N_CH)));
}
wfCanvas.addEventListener('pointerdown', e => { pickChannelFromWaterfall(e); wfCanvas.setPointerCapture(e.pointerId); });
wfCanvas.addEventListener('pointermove', e => { if (e.buttons) pickChannelFromWaterfall(e); });

const carBtn = $<HTMLButtonElement>('das-car');
const walkerBtn = $<HTMLButtonElement>('das-walker');
const playBtn = $<HTMLButtonElement>('das-play');
function syncButtons() {
  carBtn.textContent = car.on ? 'Stop the car' : 'Drive a car past';
  walkerBtn.textContent = walker.on ? 'Stop the walker' : 'Walk along the fiber';
  playBtn.textContent = playing ? '❚❚ Pause' : '▶ Play';
  carBtn.setAttribute('aria-pressed', String(car.on));
  walkerBtn.setAttribute('aria-pressed', String(walker.on));
}
carBtn.addEventListener('click', () => { car.on = !car.on; car.x = -40; syncButtons(); });
walkerBtn.addEventListener('click', () => {
  walker.on = !walker.on; walker.x = 150; walker.nextStep = simTime; syncButtons();
});
$('das-quake').addEventListener('click', () => {
  // The front starts just outside the map and sweeps across it.
  const [lo, hi] = frontRange(settings.quakeAngle);
  // 1000 m/s is slower than a real earthquake wave, so that the front can be followed on the map.
  quakes.push({ t0: simTime, angle: settings.quakeAngle, speed: 1000, f: 4, amp: 1.1, d0: lo - 60, d1: hi + 60 });
});
function clearSources() {
  strikes.length = 0; quakes.length = 0; car.on = false; walker.on = false; syncButtons();
}
$('das-clear').addEventListener('click', clearSources);

/** Sets a slider's setting and moves the slider to match. */
function setSlider(id: string, key: 'gauge' | 'quakeAngle', value: number) {
  settings[key] = value;
  const input = $<HTMLInputElement>(id);
  input.value = String(value);
  input.dispatchEvent(new Event('input'));
}

// The Examples menu sets up a scene, then returns to its "Examples" prompt so the same example
// can be chosen again.
const EXAMPLES: Record<string, () => void> = {
  hammer: () => strikes.push({ x: 450, y: 60, t0: simTime + 0.1, f: 12, amp: 7, color: SOURCE_COLOR }),
  car: () => { car.on = true; car.x = -40; },
  walker: () => { walker.on = true; walker.x = 150; walker.nextStep = simTime; },
  quakeAlong: () => { setSlider('das-quake-angle', 'quakeAngle', 0); $('das-quake').click(); },
  quakeBroadside: () => { setSlider('das-quake-angle', 'quakeAngle', 90); $('das-quake').click(); },
  longGauge: () => { setSlider('das-gauge', 'gauge', 50); walker.on = true; walker.x = 150; walker.nextStep = simTime; },
};
const exampleMenu = $<HTMLSelectElement>('das-example');
exampleMenu.addEventListener('change', () => {
  const run = EXAMPLES[exampleMenu.value];
  exampleMenu.value = '';
  if (!run) return;
  clearSources();
  run();
  playing = true;
  syncButtons();
});
playBtn.addEventListener('click', () => { playing = !playing; syncButtons(); });

/** Connects a range input to a setting, with a readout. */
function slider(id: string, key: 'waveSpeed' | 'gauge' | 'gain' | 'quakeAngle', fmt: (v: number) => string, onChange?: () => void) {
  const input = $<HTMLInputElement>(id);
  const out = $(id + '-out');
  input.value = String(settings[key]);
  out.textContent = fmt(settings[key]);
  input.addEventListener('input', () => {
    settings[key] = Number(input.value);
    out.textContent = fmt(settings[key]);
    saveSettings();
    onChange?.();
  });
}
slider('das-wave-speed', 'waveSpeed', v => `${v} m/s`);
/** Warns when the gauge is shorter than the channel spacing, which leaves fiber unmeasured. */
function updateGaugeWarning() {
  const pulseWarning = $('das-pulse-warning');
  pulseWarning.hidden = settings.gauge >= pulseResolution();
  $('das-pulse-warning-text').textContent =
    `The ${settings.gauge} m gauge is shorter than the ${pulseResolution().toFixed(1)} m resolution of a ` +
    `${settings.pulseNs} ns pulse, so the pulse, not the gauge, sets how much fiber each channel averages over.`;
  const warning = $('das-gauge-warning');
  warning.hidden = settings.gauge >= settings.channel;
  const unmeasured = Math.round(100 * (1 - settings.gauge / settings.channel));
  $('das-gauge-warning-text').textContent =
    `The ${settings.gauge} m gauge is shorter than the ${settings.channel} m channel spacing, ` +
    `so about ${unmeasured}% of the fiber isn't measured, and waves shorter than about ` +
    `${2 * settings.channel} m can be misread as longer ones (spatial aliasing). ` +
    'Real systems use a gauge at least as long as the spacing.';
}
slider('das-gauge', 'gauge', v => `${v} m`, updateGaugeWarning);
slider('das-gain', 'gain', v => `×${v.toFixed(1)}`, repaintWaterfall);
slider('das-quake-angle', 'quakeAngle', v => `${v}°${v === 90 ? ' (broadside)' : v === 0 ? ' (along the fiber)' : ''}`);
const speedSel = $<HTMLSelectElement>('das-speed');
speedSel.value = String(settings.speed);
speedSel.addEventListener('change', () => { settings.speed = Number(speedSel.value); saveSettings(); });
const channelSel = $<HTMLSelectElement>('das-channel');
channelSel.value = String(settings.channel);
channelSel.addEventListener('change', () => {
  settings.channel = Number(channelSel.value);
  saveSettings();
  rebuildBuffers();
  updateGaugeWarning();
});
updateGaugeWarning();
// ── Interrogator controls ──────────────────────────────────────────
const fmtRate = (hz: number) =>
  hz >= 1e6 ? `${+(hz / 1e6).toFixed(1)} MHz` : hz >= 1000 ? `${+(hz / 1000).toFixed(1)} kHz` : `${Math.round(hz)} Hz`;

/** Shows the quantities that follow from the interrogator settings. */
function updateInterrogatorReadout() {
  $('das-i-readout').textContent =
    `Round trip ${(roundTrip() * 1e6).toFixed(1)} μs · ` +
    `fastest possible pulse rate ${fmtRate(maxPulseRate())} · ` +
    `pulse ${((C_LIGHT * settings.pulseNs * 1e-9) / N_FIBER).toFixed(1)} m long in the fiber, ` +
    `so ${pulseResolution().toFixed(1)} m resolution · ` +
    `waterfall sampled at ${fmtRate(outputRate())}` +
    (settings.prfAuto ? ` (Auto: pulsing at ${fmtRate(pulseRate())})` : '') +
    (pulseRate() > OUTPUT_RATE ? ` (${Math.round(pulseRate() / OUTPUT_RATE).toLocaleString()} pulses averaged per row)` : '');
}

/** Disables pulse rates the fiber is too long for; each pulse must return before the next. */
function syncPulseRates() {
  const sel = $<HTMLSelectElement>('das-prf');
  for (const opt of sel.options) opt.disabled = opt.value !== 'auto' && Number(opt.value) > maxPulseRate();
  if (settings.prfAuto) { rebuildBuffers(); return; } // Auto follows the fiber's length.
  if (settings.prf > maxPulseRate()) {
    settings.prf = Math.max(...PRF_OPTIONS.filter(r => r <= maxPulseRate()));
    sel.value = String(settings.prf);
    rebuildBuffers();
  }
}

function bindSelect(id: string, key: 'prf' | 'pulseNs' | 'fiberKm' | 'slowmo', onChange: () => void) {
  const sel = $<HTMLSelectElement>(id);
  sel.value = String(settings[key]);
  sel.addEventListener('change', () => {
    settings[key] = Number(sel.value);
    saveSettings();
    onChange();
    updateInterrogatorReadout();
    updateGaugeWarning();
  });
}
{
  const sel = $<HTMLSelectElement>('das-prf');
  sel.value = settings.prfAuto ? 'auto' : String(settings.prf);
  sel.addEventListener('change', () => {
    settings.prfAuto = sel.value === 'auto';
    if (!settings.prfAuto) settings.prf = Number(sel.value);
    saveSettings();
    rebuildBuffers();
    updateInterrogatorReadout();
  });
}
bindSelect('das-pulse', 'pulseNs', () => {});
// A new fiber length starts a new pulse, so the slow-motion view isn't left mid-flight on the
// old fiber; it has nothing to compare with yet.
bindSelect('das-fiber', 'fiberKm', () => {
  syncPulseRates();
  pulseCount = -1;
  startPulse();
  syncManualRange();
  // Keep the selected channel on the fiber: move it to the middle of a fiber that now ends before it.
  if ((selectedChannel + 0.5) * CHANNEL > fiberLength()) selectedChannel = Math.floor(fiberLength() / 2 / CHANNEL);
});
bindSelect('das-slowmo', 'slowmo', () => {});
for (const [id, key] of [['das-scatter', 'scatter'], ['das-return', 'returnView'], ['das-strain-source', 'strainSource']] as const) {
  const sel = $<HTMLSelectElement>(id);
  sel.value = settings[key];
  sel.addEventListener('change', () => {
    (settings as Record<string, unknown>)[key] = sel.value;
    saveSettings();
    if (key === 'strainSource') syncStrainSource();
  });
}
/** Shows the strain sliders only when the strain is set here, and starts a fresh comparison. */
function syncStrainSource() {
  $('das-manual-strain').hidden = settings.strainSource !== 'manual';
  prevManualRow = null;
  pulseCount = -1;
  startPulse();
}
for (const [id, key, fmt] of [
  ['das-ms-strain', 'manualStrain', (v: number) => `${v} nε`],
  ['das-ms-at', 'manualAt', (v: number) => `${v} m`],
  ['das-ms-length', 'manualLength', (v: number) => `${v} m`],
] as const) {
  const input = $<HTMLInputElement>(id), out = $(id + '-out');
  input.value = String(settings[key]);
  out.textContent = fmt(settings[key]);
  input.addEventListener('input', () => {
    settings[key] = Number(input.value);
    out.textContent = fmt(settings[key]);
    saveSettings();
  });
}
$('das-manual-strain').hidden = settings.strainSource !== 'manual';
/** The stretched section can be anywhere on the fiber (its first L meters, for a long one). */
function syncManualRange() {
  const input = $<HTMLInputElement>('das-ms-at');
  input.max = String(Math.min(L, fiberLength()));
  if (settings.manualAt > Number(input.max)) { input.value = input.max; input.dispatchEvent(new Event('input')); }
}
syncManualRange();
const animBtn = $<HTMLButtonElement>('das-anim-play');
animBtn.addEventListener('click', () => {
  animPlaying = !animPlaying;
  animBtn.textContent = animPlaying ? '❚❚ Pause' : '▶ Play';
});
syncPulseRates();
updateInterrogatorReadout();

const noiseBox = $<HTMLInputElement>('das-noise');
noiseBox.checked = settings.noise;
noiseBox.addEventListener('change', () => { settings.noise = noiseBox.checked; saveSettings(); });

// ── Main loop ──────────────────────────────────────────────────────
function advance(dt: number) {
  const end = simTime + dt;
  while (nextRowTime <= end) {
    simTime = nextRowTime;
    // Move the car and the walker, and let the walker take steps.
    if (car.on) { car.x += car.speed * ROW_DT; if (car.x > L + 100) car.x = -100; }
    if (walker.on) {
      walker.x += walker.speed * ROW_DT;
      if (walker.x > L - 20) walker.x = 20;
      if (simTime >= walker.nextStep) {
        strikes.push({ x: walker.x, y: walker.y, t0: simTime, f: 15, amp: 4, color: WALKER_COLOR });
        walker.nextStep = simTime + walker.stepEvery;
      }
    }
    pushRow(simTime);
    nextRowTime += ROW_DT;
  }
  simTime = end;
  // Forget sources whose waves have passed the whole fiber.
  const v = settings.waveSpeed;
  for (let i = strikes.length - 1; i >= 0; i--) {
    if (simTime - strikes[i].t0 > (Math.hypot(L, H) + 50) / v + 0.5) strikes.splice(i, 1);
  }
  for (let i = quakes.length - 1; i >= 0; i--) {
    const qk = quakes[i];
    if (qk.d0 + qk.speed * (simTime - qk.t0) > qk.d1 + qk.speed * 0.5) quakes.splice(i, 1);
  }
}

let last = performance.now();
function frame(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (playing) {
    advance(dt * settings.speed);
    if (animPlaying) {
      pulseClock += dt;
      if (pulseClock > settings.slowmo * 1.25) startPulse(); // A short pause between pulses.
    }
  }
  drawMap();
  drawWaterfall();
  drawTrace();
  drawInterrogator();
  requestAnimationFrame(frame);
}

// ── Panels ─────────────────────────────────────────────────────────
const PIN_KEY = 'das_pinned_panels';
const panels = setupPanels('das', () =>
  saveJSON(PIN_KEY, panels.list.map((p, i) => (panels.isPinned(p) ? i : -1)).filter(i => i >= 0)));
for (const i of loadJSON<number[]>(PIN_KEY) ?? []) if (panels.list[i]) panels.setPinned(panels.list[i], true);

// Start with a hammer strike so there is something to see.
strikes.push({ x: 380, y: 70, t0: 0.2, f: 12, amp: 7, color: SOURCE_COLOR });
setupHelp('das');
syncButtons();
requestAnimationFrame(frame);
