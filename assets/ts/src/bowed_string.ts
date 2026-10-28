// ╭───────────────────────────────────────────────────────────────╮
// │                 The physics of a bowed string                 │
// ╰───────────────────────────────────────────────────────────────╯
// Animates a simulated violin string (see bowed_string/string_model.ts) in slow motion, with charts
// of the string's velocity under the bow, the friction between them, and the bridge's motion; a map
// of which bowings produce Helmholtz motion; and a button that renders the bridge's motion as audio.

import {
  BRIDGE_MASS, BowSettings, BowedString, BridgeSettings, DEFAULT_DECAY_TIME, DEFAULT_FRICTION, Motion, STRINGS, StringSpec,
  fundamental, schellengMaxForce, settledMotion,
} from "./bowed_string/string_model";
import { SoundSource } from "./bowed_string/output_stage";
import type { LiveMessage } from "./bowed_string_audio";

// ⋘──────── Constants ────────⋙

const INK      = "#222";
const MUTED    = "#6b6b6b";
const GRID     = "rgba(0, 0, 0, 0.08)";
const STRING   = "#3a5a8c";
const STUCK    = "#2a78d6";
const SLIP     = "#eb6834";
const VELOCITY = "#6250d6";
const FORCE    = "#008300";
const MOTION_COLORS: Record<Motion, string> = { helmholtz: "#1baf7a", multiple: "#a9bfe8", raucous: "#f3b08f" };

const FORCE_MIN = 0.05, FORCE_MAX = 8;    // Range of the bow-force slider and map (N)
const SPEED_MIN = 0.05, SPEED_MAX = 1;    // (m/s)
const POSITION_MIN = 0.03, POSITION_MAX = 0.3;
const STIFFNESS_MIN = 1e2, STIFFNESS_MAX = 1e7; // Range of the bridge-stiffness slider (N/m)
const DAMPING_MIN = 0.01, DAMPING_MAX = 100;    // ... and the bridge-damping slider (N·s/m)
const DENSITY_MIN = 0.2e-3, DENSITY_MAX = 6e-3; // ... and the string-density slider (kg/m)
const DECAY_MIN = 0.05, DECAY_MAX = 10;          // ... and the string-damping slider (s)
const MU_STATIC_MIN = 0.2, MU_STATIC_MAX = 1.5;   // ... and the friction sliders
const MU_DYNAMIC_MIN = 0.05, MU_DYNAMIC_MAX = 1;
const MU_GAP = 0.05;      // Sliding friction is kept at least this much below static friction
const HISTORY_PERIODS = 3;                // Length of the charts, in vibrations
const TRAIL_SNAPSHOTS = 24;               // String shapes kept for the trail, over one vibration
const PLUCK_AT     = 0.3;                 // Where the string is plucked, as a fraction from the bridge
const PLUCK_HEIGHT = 1e-3;                // (m)
const AUDIO_RATE    = 44100;
const AUDIO_SECONDS = 2;
const FFT_SIZE = 2048;                    // Steps of output kept for the spectrum
const HARMONICS = 16;                     // Harmonics shown in the spectrum
const SPECTRUM_DB = 60;                   // Range of the spectrum, below its highest peak (dB)
const SETTLE_PERIODS = 60;                // Vibrations run ahead so that the view shows the settled motion

// Each example is tuned for the A string at the default bow speed and friction.
const PRESETS: Record<string, BowSettings> = {
  helmholtz : { force: 0.65, speed: 0.2, position: 0.15, ...DEFAULT_FRICTION },
  light     : { force: 0.2,  speed: 0.2, position: 0.15, ...DEFAULT_FRICTION },
  heavy     : { force: 2,    speed: 0.2, position: 0.15, ...DEFAULT_FRICTION },
  bridge    : { force: 1.5,  speed: 0.2, position: 0.07, ...DEFAULT_FRICTION },
};
const DEFAULT_STRING = 2; // A

// A bridge resonance near 2.8 kHz with Q ≈ 9, like the "bridge hill" of a real violin.
const DEFAULT_BRIDGE: BridgeSettings = { stiffness: 3e5, damping: 2 };

// Map grid: bow position across, bow force up, both on log scales.
const MAP_COLS = 22, MAP_ROWS = 20;

// ⋘──────── Formatting ────────⋙

const fmt = (x: number, digits: number) => x.toFixed(digits);
const fmtForce = (f: number) => `${fmt(f, f < 1 ? 2 : 1)} N`;

// A number as "3.0 × 10⁵", or plainly when it's between 0.01 and 1000.
function fmtSci(x: number): string {
  if (x >= 0.01 && x < 1000) return fmt(x, x < 1 ? 2 : x < 10 ? 1 : 0);
  const exp = Math.floor(Math.log10(x));
  const sup = String(exp).replace(/./g, ch => "⁰¹²³⁴⁵⁶⁷⁸⁹⁻"["0123456789-".indexOf(ch)]);
  return `${fmt(x / Math.pow(10, exp), 1)} × 10${sup}`;
}
// A round grid spacing at least minPx apart. When the scale is degenerate (zero, negative, or not a
// number), it's Infinity, so that loops stepping by it draw nothing instead of running forever.
function niceStep(unitsPerPx: number, minPx: number): number {
  const raw = unitsPerPx * minPx;
  if (!(raw > 0 && Number.isFinite(raw))) return Infinity;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const m of [1, 2, 5, 10]) if (m * pow >= raw) return m * pow;
  return 10 * pow;
}

// ⋘──────── DOM ────────⋙

function $<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

const playButton    = $<HTMLButtonElement>("bs-play");
const rateSelect    = $<HTMLSelectElement>("bs-rate");
const restartButton = $<HTMLButtonElement>("bs-restart");
const pluckButton   = $<HTMLButtonElement>("bs-pluck");
const listenButton  = $<HTMLButtonElement>("bs-listen");
const liveButton    = $<HTMLButtonElement>("bs-live");
const statusLine    = $<HTMLParagraphElement>("bs-status");
const forceInput    = $<HTMLInputElement>("bs-force");
const speedInput    = $<HTMLInputElement>("bs-speed");
const positionInput = $<HTMLInputElement>("bs-position");
const forceOut      = $<HTMLOutputElement>("bs-force-out");
const speedOut      = $<HTMLOutputElement>("bs-speed-out");
const positionOut   = $<HTMLOutputElement>("bs-position-out");
const muStaticInput  = $<HTMLInputElement>("bs-mu-static");
const muDynamicInput = $<HTMLInputElement>("bs-mu-dynamic");
const muStaticOut    = $<HTMLOutputElement>("bs-mu-static-out");
const muDynamicOut   = $<HTMLOutputElement>("bs-mu-dynamic-out");
const decayInput     = $<HTMLInputElement>("bs-decay");
const decayOut       = $<HTMLOutputElement>("bs-decay-out");
const stiffnessInput = $<HTMLInputElement>("bs-stiffness");
const dampingInput   = $<HTMLInputElement>("bs-damping");
const stiffnessOut   = $<HTMLOutputElement>("bs-stiffness-out");
const dampingOut     = $<HTMLOutputElement>("bs-damping-out");
const bridgeReset    = $<HTMLButtonElement>("bs-bridge-reset");
const stringSelect  = $<HTMLSelectElement>("bs-string-select");
const tensionInput  = $<HTMLInputElement>("bs-tension");
const densityInput  = $<HTMLInputElement>("bs-density");
const lengthInput   = $<HTMLInputElement>("bs-length");
const tensionOut    = $<HTMLOutputElement>("bs-tension-out");
const densityOut    = $<HTMLOutputElement>("bs-density-out");
const lengthOut     = $<HTMLOutputElement>("bs-length-out");
const pitchOut      = $<HTMLOutputElement>("bs-pitch-out");
const bowingPanel   = $<HTMLFieldSetElement>("bs-bowing");
const pluckedNote   = $<HTMLParagraphElement>("bs-plucked-note");
const showTrail     = $<HTMLInputElement>("bs-show-trail");
const showCorner    = $<HTMLInputElement>("bs-show-corner");
const showVelocity  = $<HTMLInputElement>("bs-show-velocity");
const showForce     = $<HTMLInputElement>("bs-show-force");
const mapProgress   = $<HTMLParagraphElement>("bs-map-progress");

const stringCanvas  = $<HTMLCanvasElement>("bs-string");
const chartsCanvas  = $<HTMLCanvasElement>("bs-charts");
const mapCanvas     = $<HTMLCanvasElement>("bs-map");
const scopeCanvas   = $<HTMLCanvasElement>("bs-scope");
const spectrumCanvas = $<HTMLCanvasElement>("bs-spectrum");
const animationView = $<HTMLDivElement>("bs-animation");
const chartsView    = $<HTMLDivElement>("bs-charts-view");
const pinAnimation  = $<HTMLButtonElement>("bs-pin-animation");
const pinCharts     = $<HTMLButtonElement>("bs-pin-charts");
const soundView     = $<HTMLDivElement>("bs-sound-view");
const pinSound      = $<HTMLButtonElement>("bs-pin-sound");
const mapView       = $<HTMLDivElement>("bs-map-view");
const playbackRow   = animationView.querySelector<HTMLElement>(".bs-playback")!;

// ⋘──────── State ────────⋙

const { name: _defaultName, ...defaultString } = STRINGS[DEFAULT_STRING];
const spec: StringSpec = { ...defaultString };
const bow: BowSettings = { ...PRESETS.helmholtz };
const bridge: BridgeSettings = { ...DEFAULT_BRIDGE };
let sim = new BowedString(spec, bow, bridge);
let stepsPerPeriod = Math.round(sim.period / sim.dt);

let playing = true;
let lastFrame = 0;
let pendingSteps = 0;  // Fraction of a step left over from the last frame
let stepCount = 0;     // Steps since the last restart

// Recent history of the string under the bow and of the bridge, for the charts.
let historyLength = 0;
let bowVelocity  = new Float64Array(0);
let friction     = new Float64Array(0);
let bridgeMotion = new Float64Array(0); // Bridge displacement (µm)
let wasStuck     = new Uint8Array(0);
let historyHead  = 0;  // Where the next step is written
let historyCount = 0;

// The output (bridge displacement) over the last FFT_SIZE steps, for the oscilloscope and spectrum.
// Unlike the charts, it isn't cleared on a restart, so that these panels roll over from the old
// sound to the new one, except when the string (and so the time step) changes.
const output = new Float64Array(FFT_SIZE);
let outputHead = 0, outputCount = 0;

// Snapshots of the string's shape over the last vibration, for the trail.
let trail: Float64Array[] = [];
let trailHead = 0;

// Slip and stuck counts at the end of each of the last two vibrations, for the status line.
let periodMarks: { slips: number; stuck: number }[] = [];

let yScale = 0;        // Vertical scale of the string view (px per m)
let settled: Motion = "helmholtz";
let settledKey = "";   // The settings that `settled` was computed for
let statusDirty = true;

function resetHistory(): void {
  stepsPerPeriod = Math.round(sim.period / sim.dt);
  historyLength = HISTORY_PERIODS * stepsPerPeriod;
  bowVelocity = new Float64Array(historyLength);
  friction     = new Float64Array(historyLength);
  bridgeMotion = new Float64Array(historyLength);
  wasStuck     = new Uint8Array(historyLength);
  historyHead = historyCount = 0;
  trail = [];
  trailHead = 0;
  periodMarks = [];
  stepCount = 0;
  pendingSteps = 0;
  for (const key in chartRanges) delete chartRanges[key];
  statusDirty = true;
}

// Bows the string from rest. Unless `fromRest` is set, the string is first run until its motion
// settles, which takes dozens of vibrations, so that the view matches the status line and the map.
// Shows the bowing settings only while the string is being bowed.
function syncMode(): void {
  bowingPanel.hidden = !sim.bowing;
  pluckedNote.hidden = sim.bowing;
}

function startBowing(fromRest = false): void {
  sim.reset();
  sim.bowing = true;
  syncMode();
  resetHistory();
  if (fromRest) yScale = 0;
  else advance(SETTLE_PERIODS * stepsPerPeriod);
}

function pluck(): void {
  sim.pluck(PLUCK_AT, PLUCK_HEIGHT);
  syncMode();
  resetHistory();
  yScale = 0;
}

// Called whenever the string's tension, density, or length changes. The time step depends on all
// three, so the string starts over.
function stringChanged(): void {
  const bowing = sim.bowing;
  sim = new BowedString(spec, bow, bridge);
  sendLiveSettings();
  outputHead = outputCount = 0;
  yScale = 0;
  syncStringInputs();
  if (bowing) startBowing();
  else pluck();
  requestMap();
  requestBands();
}

function setStringPreset(index: number): void {
  // A preset sets the string's tension, density, and length, but keeps its damping.
  const { name: _name, decayTime: _decayTime, ...preset } = STRINGS[index];
  Object.assign(spec, preset);
  stringChanged();
}

// ⋘──────── Simulation ────────⋙

function advance(steps: number): void {
  const snapEvery = stepsPerPeriod / TRAIL_SNAPSHOTS;
  for (let s = 0; s < steps; s++) {
    const wasSticking = sim.sticking;
    sim.step();
    stepCount++;

    bowVelocity[historyHead] = sim.v[sim.bowIndex];
    // At the step where the string breaks loose, the chart shows the force it would have taken to
    // hold it, which is what crossed the limit.
    const breakaway = sim.bowing && wasSticking && !sim.sticking;
    friction[historyHead]     = breakaway ? sim.holding : sim.friction;
    bridgeMotion[historyHead] = sim.bridgeDisplacement * 1e6;
    wasStuck[historyHead]    = sim.bowing && sim.sticking ? 1 : 0;
    historyHead = (historyHead + 1) % historyLength;
    historyCount = Math.min(historyLength, historyCount + 1);
    output[outputHead] = sim.bridgeDisplacement;
    outputHead = (outputHead + 1) % FFT_SIZE;
    outputCount = Math.min(FFT_SIZE, outputCount + 1);

    if (stepCount % snapEvery === 0) {
      if (trail.length < TRAIL_SNAPSHOTS) trail.push(sim.y.slice());
      else trail[trailHead].set(sim.y);
      trailHead = (trailHead + 1) % TRAIL_SNAPSHOTS;
    }
    if (stepCount % stepsPerPeriod === 0) {
      periodMarks.push({ slips: sim.slips, stuck: sim.stuckSteps });
      if (periodMarks.length > 2) periodMarks.shift();
      statusDirty = true;
    }
  }
}

// ⋘──────── Canvas sizing ────────⋙

const dpr = () => window.devicePixelRatio || 1;

function sizeCanvas(canvas: HTMLCanvasElement, width: number, height: number): void {
  canvas.width  = Math.round(width * dpr());
  canvas.height = Math.round(height * dpr());
  canvas.style.height = `${height}px`;
}

function context(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
  return ctx;
}

let stringW = 0, stringH = 0, chartsW = 0, chartsH = 0, mapW = 0, mapH = 0;
let scopeW = 0, spectrumW = 0;
let soundH = 0;          // Height of the oscilloscope and spectrum (px)

const isPinned = (view: HTMLElement) => view.classList.contains("bs-pinned");

// Pinned views are shorter, so that together they leave room to read the page under them.
function pinnedHeight(height: number, min: number): number {
  return Math.round(Math.min(height, Math.max(min, 0.3 * window.innerHeight)));
}

// The height a view's canvas gets in full screen: the screen, less the view's padding (and, for
// the animation, its playback controls).
const FULL_PAD = 24 + 4; // Padding, plus a little for the canvas's border (px)
const isFull = (view: HTMLElement) => document.fullscreenElement === view;

function layout(): void {
  stringW = stringCanvas.clientWidth;
  stringH = Math.round(Math.min(360, Math.max(220, stringW * 0.42)));
  if (isFull(animationView)) stringH = Math.max(200, window.innerHeight - FULL_PAD - playbackRow.offsetHeight - 8);
  else if (isPinned(animationView)) stringH = pinnedHeight(stringH, 150);
  sizeCanvas(stringCanvas, stringW, stringH);
  chartsW = chartsCanvas.clientWidth;
  chartsH = isFull(chartsView) ? Math.max(270, window.innerHeight - FULL_PAD)
    : isPinned(chartsView) ? pinnedHeight(420, 270) : 420;
  sizeCanvas(chartsCanvas, chartsW, chartsH);
  scopeW = scopeCanvas.clientWidth;
  if (isFull(soundView)) {
    // Side by side, each gets the whole height; stacked (on a narrow screen), half each.
    const stacked = spectrumCanvas.getBoundingClientRect().top > scopeCanvas.getBoundingClientRect().bottom - 1;
    soundH = Math.max(160, Math.floor((window.innerHeight - FULL_PAD) / (stacked ? 2 : 1)) - (stacked ? 8 : 0));
  } else {
    soundH = isPinned(soundView) ? pinnedHeight(230, 160) : 230;
  }
  sizeCanvas(scopeCanvas, scopeW, soundH);
  spectrumW = spectrumCanvas.clientWidth;
  sizeCanvas(spectrumCanvas, spectrumW, soundH);
  mapW = mapCanvas.clientWidth;
  mapH = isFull(mapView) ? Math.max(260, window.innerHeight - FULL_PAD)
    : Math.round(Math.min(400, Math.max(260, mapW * 0.55)));
  sizeCanvas(mapCanvas, mapW, mapH);
  // Pinned views stack in page order, each below the pinned ones above it.
  const chartsTop = isPinned(animationView) ? animationView.offsetHeight : 0;
  chartsView.style.setProperty("--bs-charts-top", `${chartsTop}px`);
  const soundTop = chartsTop + (isPinned(chartsView) ? chartsView.offsetHeight : 0);
  soundView.style.setProperty("--bs-sound-top", `${soundTop}px`);
}

function setPinned(view: HTMLElement, button: HTMLButtonElement, pinned: boolean): void {
  view.classList.toggle("bs-pinned", pinned);
  button.setAttribute("aria-pressed", String(pinned));
  button.title = pinned ? "Unpin from the top of the window" : "Pin to the top of the window while scrolling";
  button.ariaLabel = button.title;
  layout();
}

// ⋘──────── String view ────────⋙

const S_PAD_X = 28, S_PAD_T = 26, S_PAD_B = 34;

// The size of Helmholtz motion at the middle of the string (half the peak-to-peak swing), used to
// pick the starting scale before the string has moved.
function expectedAmplitude(): number {
  if (!sim.bowing) return PLUCK_HEIGHT;
  return bow.speed * sim.period / (8 * bow.position);
}

// Zooms out at once when the string would leave the view, and back in slowly when it's small.
function updateScale(plotH: number): void {
  let amp = 0;
  for (const shape of [sim.y, ...trail]) for (const y of shape) amp = Math.max(amp, Math.abs(y));
  if (yScale === 0) yScale = 0.38 * plotH / (amp || expectedAmplitude());
  if (amp === 0) return;
  if (amp * yScale > 0.48 * plotH) yScale = 0.45 * plotH / amp;
  else if (amp * yScale < 0.25 * plotH) yScale = Math.min(yScale * 1.02, 0.4 * plotH / amp);
}

// Indices of the sharp bends in the string: local peaks of curvature at least half the largest.
function corners(): number[] {
  const { y, n } = sim;
  const bend = (i: number) => Math.abs(y[i + 1] - 2 * y[i] + y[i - 1]);
  let max = 0;
  for (let i = 1; i < n; i++) max = Math.max(max, bend(i));
  if (max === 0) return [];
  const found: number[] = [];
  for (let i = 1; i < n; i++) {
    const b = bend(i);
    if (b >= 0.5 * max && b >= bend(Math.max(1, i - 1)) && b > bend(Math.min(n - 1, i + 1))) found.push(i);
  }
  return found;
}

function drawArrows(ctx: CanvasRenderingContext2D, values: Float64Array, color: string,
                    xOf: (i: number) => number, yOf: (i: number) => number, maxLen: number): void {
  let max = 0;
  for (let i = 1; i < sim.n; i++) max = Math.max(max, Math.abs(values[i]));
  if (max === 0) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 2; i < sim.n; i += 3) {
    const x = xOf(i), y = yOf(i);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - values[i] / max * maxLen);
  }
  ctx.stroke();
}

function drawString(): void {
  const ctx = context(stringCanvas);
  const W = stringW, H = stringH;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, H);

  const plotW = W - 2 * S_PAD_X, plotH = H - S_PAD_T - S_PAD_B;
  const mid = S_PAD_T + plotH / 2;
  updateScale(plotH);
  const xOf = (i: number) => S_PAD_X + (i / sim.n) * plotW;
  const yOfShape = (shape: Float64Array, i: number) => mid - shape[i] * yScale;
  const yOf = (i: number) => yOfShape(sim.y, i);

  // Rest position and the two ends.
  ctx.strokeStyle = GRID;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(S_PAD_X, mid);
  ctx.lineTo(S_PAD_X + plotW, mid);
  ctx.stroke();
  ctx.setLineDash([]);
  // The nut is fixed. The bridge moves with the end of the string, on a spring (drawn on the same
  // exaggerated scale as the string) anchored at the bottom of the view.
  const xBridge = S_PAD_X + plotW, yBridge = yOf(sim.n), ground = S_PAD_T + plotH;
  const coilTop = yBridge + 12, coils = 6;
  const coilStep = Math.max(1, ground - coilTop) / (2 * coils);
  ctx.strokeStyle = MUTED;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(xBridge, coilTop);
  for (let k = 1; k < 2 * coils; k++) ctx.lineTo(xBridge + (k % 2 ? 5 : -5), coilTop + k * coilStep);
  ctx.lineTo(xBridge, coilTop + 2 * coils * coilStep);
  ctx.moveTo(xBridge - 9, ground);
  ctx.lineTo(xBridge + 9, ground);
  ctx.stroke();
  ctx.fillStyle = MUTED;
  for (const [x, y] of [[S_PAD_X, mid], [xBridge, yBridge]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 7, y + 12);
    ctx.lineTo(x + 7, y + 12);
    ctx.closePath();
    ctx.fill();
  }
  ctx.font = "12px system-ui, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText("nut", S_PAD_X - 8, H - 10);
  ctx.textAlign = "right";
  ctx.fillText("bridge", S_PAD_X + plotW + 12, H - 10);
  ctx.textAlign = "left";
  const exaggeration = yScale / (plotW / spec.length);
  // Shortened on narrow screens to leave room for the pin button.
  let caption = `${pitchName(fundamental(spec))} · vertical scale exaggerated ×${Math.round(exaggeration)}`;
  if (ctx.measureText(caption).width > W - 100) caption = `${pitchName(fundamental(spec), false)} · vertical ×${Math.round(exaggeration)}`;
  ctx.fillText(caption, 8, 17);

  // The bow, seen end-on, with stripes that move at the bow's (slowed) speed. While the string
  // sticks, the mass under the bow moves with the stripes.
  const ib = sim.bowIndex, xb = xOf(ib);
  if (sim.bowing) {
    const color = sim.sticking ? STUCK : SLIP;
    const half = 8;
    ctx.save();
    ctx.beginPath();
    ctx.rect(xb - half, S_PAD_T, 2 * half, plotH);
    ctx.clip();
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = color;
    ctx.fillRect(xb - half, S_PAD_T, 2 * half, plotH);
    ctx.globalAlpha = 1;
    const spacing = 14;
    const offset = ((bow.speed * sim.t * yScale) % spacing + spacing) % spacing;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
    ctx.beginPath();
    for (let y = S_PAD_T + plotH + spacing - offset; y > S_PAD_T - spacing; y -= spacing) {
      ctx.moveTo(xb - half, y);
      ctx.lineTo(xb + half, y);
    }
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = MUTED;
    ctx.textAlign = "right";
    ctx.fillText(`bow (β = ${fmt(bow.position, 3)})`, xb - half - 4, H - 10);
  }

  if (showTrail.checked) {
    ctx.strokeStyle = "rgba(58, 90, 140, 0.16)";
    ctx.lineWidth = 1;
    for (const shape of trail) {
      ctx.beginPath();
      for (let i = 0; i <= sim.n; i++) {
        if (i === 0) ctx.moveTo(xOf(i), yOfShape(shape, i));
        else ctx.lineTo(xOf(i), yOfShape(shape, i));
      }
      ctx.stroke();
    }
  }

  const arrowLen = 0.22 * plotH;
  if (showVelocity.checked) drawArrows(ctx, sim.v, VELOCITY, xOf, yOf, arrowLen);
  if (showForce.checked) drawArrows(ctx, sim.force, FORCE, xOf, yOf, arrowLen);

  ctx.strokeStyle = STRING;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= sim.n; i++) {
    if (i === 0) ctx.moveTo(xOf(i), yOf(i));
    else ctx.lineTo(xOf(i), yOf(i));
  }
  ctx.stroke();
  ctx.fillStyle = STRING;
  for (let i = 1; i < sim.n; i++) {
    ctx.beginPath();
    ctx.arc(xOf(i), yOf(i), 1.6, 0, 2 * Math.PI);
    ctx.fill();
  }

  if (showCorner.checked) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.5;
    for (const i of corners()) {
      ctx.beginPath();
      ctx.arc(xOf(i), yOf(i), 8, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  if (sim.bowing) {
    ctx.fillStyle = sim.sticking ? STUCK : SLIP;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(xb, yOf(ib), 5.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
}

// ⋘──────── Charts ────────⋙
// Three charts share a time axis covering the last few vibrations, with the present at the right.

const C_PAD_L = 64, C_PAD_R = 16, C_PAD_T = 34, C_GAP = 34, C_PAD_B = 28;

// Each chart's range only grows at once; it shrinks slowly so that it doesn't jitter.
const chartRanges: Record<string, [number, number]> = {};

// A dashed horizontal line on a chart. Lines with a label are listed beside the chart's title and
// always kept in range; unlabeled ones are drawn only when they're in range.
interface Reference { value: number; color: string; label?: string; short?: string; }

function updateRange(key: string, lo: number, hi: number): [number, number] {
  const pad = 0.1 * (hi - lo || 1e-6);
  lo -= pad;
  hi += pad;
  const old = chartRanges[key];
  if (!old) return (chartRanges[key] = [lo, hi]);
  const ease = (a: number, b: number) => a + 0.03 * (b - a);
  return (chartRanges[key] = [Math.min(lo, ease(old[0], lo)), Math.max(hi, ease(old[1], hi))]);
}

function historyAt(data: ArrayLike<number>, k: number): number {
  // k = 0 is the oldest of the historyCount entries.
  return data[(historyHead - historyCount + k + historyLength) % historyLength];
}

// The short title and labels are used when the long ones don't fit beside the pin button.
function drawChart(ctx: CanvasRenderingContext2D, top: number, height: number, titles: [string, string], unit: string,
                   data: Float64Array, references: Reference[]): void {
  const key = titles[1];
  const plotW = chartsW - C_PAD_L - C_PAD_R;
  let lo = 0, hi = 0;
  for (let k = 0; k < historyCount; k++) {
    const v = historyAt(data, k);
    lo = Math.min(lo, v);
    hi = Math.max(hi, v);
  }
  for (const r of references) {
    if (!r.label) continue;
    lo = Math.min(lo, r.value);
    hi = Math.max(hi, r.value);
  }
  const [ymin, ymax] = updateRange(key, lo, hi);
  const yOf = (v: number) => top + height - ((v - ymin) / (ymax - ymin)) * height;
  const xOf = (k: number) => C_PAD_L + ((historyLength - historyCount + k) / (historyLength - 1)) * plotW;

  ctx.font = "11px system-ui, sans-serif";
  const labelWidth = (label: string) => 22 + ctx.measureText(label).width + 14;
  const longWidth = ctx.measureText(titles[0]).width + 16
    + references.reduce((sum, r) => sum + (r.label ? labelWidth(r.label) : 0), 0);
  const useShort = C_PAD_L + longWidth > chartsW - 80;
  const title = useShort ? titles[1] : titles[0];
  ctx.fillStyle = INK;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(title, C_PAD_L, top - 8);

  // Value axis.
  const step = niceStep((ymax - ymin) / height, 28);
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let v = Math.ceil(ymin / step) * step; v <= ymax; v += step) {
    const y = yOf(v);
    ctx.strokeStyle = Math.abs(v) < step / 2 ? "rgba(0, 0, 0, 0.25)" : GRID;
    ctx.beginPath();
    ctx.moveTo(C_PAD_L, y);
    ctx.lineTo(C_PAD_L + plotW, y);
    ctx.stroke();
    ctx.fillStyle = MUTED;
    const digits = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
    ctx.fillText(`${fmt(Math.abs(v) < step / 2 ? 0 : v, digits)} ${unit}`, C_PAD_L - 6, y);
  }

  // Labeled beside the title, since the lines themselves can run under the pin button.
  let legendX = C_PAD_L + ctx.measureText(title).width + 16;
  ctx.lineWidth = 1;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  for (const r of references) {
    if (r.value < ymin || r.value > ymax) continue;
    ctx.strokeStyle = r.color;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(C_PAD_L, yOf(r.value));
    ctx.lineTo(C_PAD_L + plotW, yOf(r.value));
    if (r.label) {
      ctx.moveTo(legendX, top - 12);
      ctx.lineTo(legendX + 18, top - 12);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    if (r.label) {
      const label = useShort && r.short ? r.short : r.label;
      ctx.fillStyle = r.color;
      ctx.fillText(label, legendX + 22, top - 8);
      legendX += labelWidth(label);
    }
  }

  // The line, colored by whether the bow held the string at each step.
  ctx.lineWidth = 1.8;
  ctx.lineJoin = "round";
  let k = 0;
  while (k < historyCount - 1) {
    const stuck = historyAt(wasStuck, k + 1);
    ctx.strokeStyle = !sim.bowing ? STRING : stuck ? STUCK : SLIP;
    ctx.beginPath();
    ctx.moveTo(xOf(k), yOf(historyAt(data, k)));
    while (k < historyCount - 1 && historyAt(wasStuck, k + 1) === stuck) {
      k++;
      ctx.lineTo(xOf(k), yOf(historyAt(data, k)));
    }
    ctx.stroke();
  }
}

function drawCharts(): void {
  const ctx = context(chartsCanvas);
  ctx.clearRect(0, 0, chartsW, chartsH);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, chartsW, chartsH);
  // Without the bow there's no friction to show, so the other two charts share its space.
  const count = sim.bowing ? 3 : 2;
  const height = (chartsH - C_PAD_T - (count - 1) * C_GAP - C_PAD_B) / count;
  const tops = Array.from({ length: count }, (_, k) => C_PAD_T + k * (height + C_GAP));
  drawChart(ctx, tops[0], height,
            [sim.bowing ? "Velocity of the string under the bow" : "Velocity of the string at the bow position", "Velocity at bow"],
            "m/s", bowVelocity, sim.bowing ? [{ value: bow.speed, color: STUCK, label: "bow speed: sticks again here", short: "bow speed" }] : []);
  // Friction can hold the string with up to μₛN either way. Sliding friction falls toward μ_d N.
  if (sim.bowing) {
    const holdLimit = bow.muStatic * bow.force, sliding = bow.muDynamic * bow.force;
    drawChart(ctx, tops[1], height, ["Friction force of the bow on the string", "Bow friction"], "N", friction, [
      { value: holdLimit, color: INK, label: "most the bow can hold, μₛN", short: "μₛN" },
      { value: sliding, color: MUTED, label: "fast sliding, μ_d N", short: "μ_d N" },
      { value: -holdLimit, color: INK },
      { value: -sliding, color: MUTED },
    ]);
  }
  const top2 = tops[count - 1];
  drawChart(ctx, top2, height, ["Displacement of the bridge", "Bridge displacement"], "µm", bridgeMotion, []);
  chartsCanvas.ariaLabel = sim.bowing
    ? "Velocity of the string under the bow, bow friction, and bridge displacement over time"
    : "Velocity of the string at the bow position and bridge displacement over time";

  // Shared time axis, in milliseconds before now, with the vibration period marked.
  const plotW = chartsW - C_PAD_L - C_PAD_R;
  const span = historyLength * sim.dt * 1000;
  const step = niceStep(span / plotW, 60);
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = MUTED;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const base = top2 + height;
  for (let ms = 0; ms <= span + 1e-9; ms += step) {
    const x = C_PAD_L + plotW - (ms / span) * plotW;
    ctx.strokeStyle = GRID;
    ctx.beginPath();
    ctx.moveTo(x, C_PAD_T);
    ctx.lineTo(x, base);
    ctx.stroke();
    ctx.fillText(ms === 0 ? "now" : `−${fmt(ms, step < 1 ? 1 : 0)} ms`, x, base + 6);
  }
}

// ⋘──────── Oscilloscope and spectrum ────────⋙
// Both show the output, the bridge's displacement, with its steady offset removed.

const O_PAD_L = 52, O_PAD_R = 12, O_PAD_T = 26, O_PAD_B = 30;

// The output in time order, oldest first, with its mean removed.
function outputSignal(): Float64Array {
  const signal = new Float64Array(outputCount);
  let mean = 0;
  for (let k = 0; k < outputCount; k++) {
    signal[k] = output[(outputHead - outputCount + k + FFT_SIZE) % FFT_SIZE];
    mean += signal[k];
  }
  mean /= outputCount || 1;
  for (let k = 0; k < outputCount; k++) signal[k] -= mean;
  return signal;
}

function clearPanel(canvas: HTMLCanvasElement, width: number, title: string): CanvasRenderingContext2D {
  const ctx = context(canvas);
  ctx.clearRect(0, 0, width, soundH);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, soundH);
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = INK;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(title, O_PAD_L, 16);
  return ctx;
}

function drawScope(): void {
  // One natural period of the string, 2L/c, which is exactly 2n steps.
  const ctx = clearPanel(scopeCanvas, scopeW,
    `Oscilloscope: the output over one period, 2L/c = ${fmt(sim.period * 1000, sim.period < 0.01 ? 2 : 1)} ms`);
  const plotW = scopeW - O_PAD_L - O_PAD_R, plotH = soundH - O_PAD_T - O_PAD_B;
  const length = stepsPerPeriod;
  const signal = outputSignal();
  if (signal.length < length + stepsPerPeriod) return;

  // Trigger on the highest point of a vibration, so that the trace holds still. The search covers
  // one vibration, ending where the trace must start to fit before now.
  const lead = Math.round(0.1 * stepsPerPeriod);
  const searchEnd = signal.length - length + lead;
  let trigger = searchEnd - stepsPerPeriod;
  for (let k = trigger; k < searchEnd; k++) if (signal[k] > signal[trigger]) trigger = k;
  const start = trigger - lead;

  let peak = 0;
  for (let k = start; k < start + length; k++) peak = Math.max(peak, Math.abs(signal[k]));
  const [lo, hi] = updateRange("scope", -peak * 1e6, peak * 1e6);
  const yOf = (v: number) => O_PAD_T + plotH - ((v - lo) / (hi - lo)) * plotH;
  const xOf = (k: number) => O_PAD_L + (k / (length - 1)) * plotW;

  // Value and time grids.
  const vStep = niceStep((hi - lo) / plotH, 30);
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let v = Math.ceil(lo / vStep) * vStep; v <= hi; v += vStep) {
    ctx.strokeStyle = Math.abs(v) < vStep / 2 ? "rgba(0, 0, 0, 0.25)" : GRID;
    ctx.beginPath();
    ctx.moveTo(O_PAD_L, yOf(v));
    ctx.lineTo(O_PAD_L + plotW, yOf(v));
    ctx.stroke();
    ctx.fillStyle = MUTED;
    const digits = Math.max(0, -Math.floor(Math.log10(vStep) + 1e-9));
    ctx.fillText(`${fmt(Math.abs(v) < vStep / 2 ? 0 : v, digits)} µm`, O_PAD_L - 5, yOf(v));
  }
  const span = length * sim.dt * 1000;
  const tStep = niceStep(span / plotW, 50);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let ms = 0; ms <= span + 1e-9; ms += tStep) {
    const x = O_PAD_L + (ms / span) * plotW;
    ctx.strokeStyle = GRID;
    ctx.beginPath();
    ctx.moveTo(x, O_PAD_T);
    ctx.lineTo(x, O_PAD_T + plotH);
    ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.fillText(`${fmt(ms, tStep < 1 ? 1 : 0)} ms`, x, O_PAD_T + plotH + 6);
  }

  ctx.strokeStyle = STRING;
  ctx.lineWidth = 1.6;
  ctx.lineJoin = "round";
  ctx.beginPath();
  for (let k = 0; k < length; k++) {
    const y = yOf(signal[start + k] * 1e6);
    if (k === 0) ctx.moveTo(xOf(k), y);
    else ctx.lineTo(xOf(k), y);
  }
  ctx.stroke();
}

// In-place radix-2 FFT. The length must be a power of 2.
function fft(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const angle = -2 * Math.PI / len;
    const wr = Math.cos(angle), wi = Math.sin(angle);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = a + len / 2;
        const xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
        re[b] = re[a] - xr;
        im[b] = im[a] - xi;
        re[a] += xr;
        im[a] += xi;
        [cr, ci] = [cr * wr - ci * wi, cr * wi + ci * wr];
      }
    }
  }
}

function drawSpectrum(): void {
  const plotW = spectrumW - O_PAD_L - O_PAD_R, plotH = soundH - O_PAD_T - O_PAD_B;
  if (outputCount < FFT_SIZE) {
    clearPanel(spectrumCanvas, spectrumW, "Spectrum of the output");
    return;
  }
  // Hann-windowed power spectrum, in dB below its highest point.
  const re = outputSignal(), im = new Float64Array(FFT_SIZE);
  for (let k = 0; k < FFT_SIZE; k++) re[k] *= 0.5 - 0.5 * Math.cos(2 * Math.PI * k / (FFT_SIZE - 1));
  fft(re, im);
  const bins = FFT_SIZE / 2;
  const db = new Float64Array(bins);
  let maxDb = -Infinity;
  for (let k = 1; k < bins; k++) {
    db[k] = 10 * Math.log10(re[k] * re[k] + im[k] * im[k] + 1e-300);
    maxDb = Math.max(maxDb, db[k]);
  }
  const df = 1 / (FFT_SIZE * sim.dt); // Width of each bin (Hz)

  // The fundamental: the strongest peak near the open string's pitch, refined by fitting a
  // parabola through it and its neighbors.
  const nominal = fundamental(spec);
  let kPeak = Math.round(0.85 * nominal / df);
  for (let k = kPeak; k <= Math.round(1.15 * nominal / df); k++) if (db[k] > db[kPeak]) kPeak = k;
  const [a, b, c] = [db[kPeak - 1], db[kPeak], db[kPeak + 1]];
  // Without a clear peak (a quiet or dying signal), the fit can land anywhere, so it's kept within
  // the bin it refines.
  const offset = 0.5 * (a - c) / (a - 2 * b + c || 1);
  const f0 = (kPeak + (Number.isFinite(offset) ? Math.max(-0.5, Math.min(0.5, offset)) : 0)) * df;

  const ctx = clearPanel(spectrumCanvas, spectrumW, `Spectrum of the output · fundamental ${fmt(f0, 1)} Hz`);
  const fMax = (HARMONICS + 0.5) * nominal;
  const xOf = (f: number) => O_PAD_L + (f / fMax) * plotW;
  const yOf = (d: number) => O_PAD_T + Math.min(1, Math.max(0, (maxDb - d) / SPECTRUM_DB)) * plotH;

  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let d = 0; d <= SPECTRUM_DB; d += 20) {
    const y = O_PAD_T + (d / SPECTRUM_DB) * plotH;
    ctx.strokeStyle = GRID;
    ctx.beginPath();
    ctx.moveTo(O_PAD_L, y);
    ctx.lineTo(O_PAD_L + plotW, y);
    ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.fillText(`${d === 0 ? 0 : -d} dB`, O_PAD_L - 5, y);
  }
  const kStep = niceStep(fMax / 1000 / plotW, 45);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let kHz = 0; kHz <= fMax / 1000; kHz += kStep) {
    ctx.fillStyle = MUTED;
    ctx.fillText(`${fmt(kHz, kStep < 1 ? 1 : 0)} kHz`, xOf(kHz * 1000), O_PAD_T + plotH + 16);
  }

  // The bridge's resonance.
  const resonance = Math.sqrt(bridge.stiffness / BRIDGE_MASS) / (2 * Math.PI);
  if (resonance < fMax) {
    const x = xOf(resonance);
    ctx.strokeStyle = SLIP;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(x, O_PAD_T);
    ctx.lineTo(x, O_PAD_T + plotH);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = SLIP;
    ctx.textAlign = x > O_PAD_L + plotW - 90 ? "right" : "left";
    ctx.textBaseline = "top";
    ctx.fillText("bridge resonance", x + (ctx.textAlign === "left" ? 4 : -4), O_PAD_T + 2);
  }

  // The spectrum itself.
  ctx.beginPath();
  ctx.moveTo(xOf(df), O_PAD_T + plotH);
  for (let k = 1; k < bins && k * df <= fMax; k++) ctx.lineTo(xOf(k * df), yOf(db[k]));
  ctx.lineTo(xOf(Math.min(fMax, (bins - 1) * df)), O_PAD_T + plotH);
  ctx.closePath();
  ctx.fillStyle = "rgba(58, 90, 140, 0.15)";
  ctx.fill();
  ctx.beginPath();
  for (let k = 1; k < bins && k * df <= fMax; k++) {
    if (k === 1) ctx.moveTo(xOf(k * df), yOf(db[k]));
    else ctx.lineTo(xOf(k * df), yOf(db[k]));
  }
  ctx.strokeStyle = STRING;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Each harmonic: a dot at its peak and its number below the axis. The numbers are thinned out
  // when they'd crowd each other.
  const labelEvery = Math.ceil(16 / (xOf(f0) - xOf(0)));
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  for (let n = 1; n <= HARMONICS && n * f0 <= fMax; n++) {
    const k = Math.round(n * f0 / df);
    let level = -Infinity;
    for (let j = Math.max(1, k - 2); j <= Math.min(bins - 1, k + 2); j++) level = Math.max(level, db[j]);
    const x = xOf(n * f0);
    ctx.fillStyle = n === 1 ? STUCK : INK;
    ctx.beginPath();
    ctx.arc(x, yOf(level), n === 1 ? 4 : 2.5, 0, 2 * Math.PI);
    ctx.fill();
    if (n === 1 || n % labelEvery === 0) {
      ctx.fillText(n === 1 ? "f₀" : String(n), x, O_PAD_T + plotH + 3);
    }
  }
}

// ⋘──────── Status ────────⋙

function updateStatus(): void {
  statusDirty = false;
  if (!sim.bowing) {
    statusLine.dataset.motion = "plucked";
    statusLine.innerHTML = "<strong>Plucked:</strong> with no bow, the string vibrates freely and slowly dies away. "
      + "The bend where it was plucked splits into two corners that travel in opposite directions.";
    return;
  }
  const key = `${stringKey()}:${bow.force}:${bow.speed}:${bow.position}:${bridgeKey()}`;
  if (key !== settledKey) {
    settled = settledMotion(spec, bow, bridge);
    settledKey = key;
  }
  statusLine.dataset.motion = settled;
  const summary: Record<Motion, string> = {
    helmholtz: "<strong>Helmholtz motion:</strong> with these settings, the string settles into one slip per vibration.",
    multiple : "<strong>Not clean:</strong> with these settings, the string slips more than once per vibration or wobbles back and forth while it slips.",
    raucous  : "<strong>Too much force:</strong> with these settings, the bow holds the string too long, and the motion is irregular.",
  };
  let text = summary[settled];
  if (periodMarks.length === 2) {
    const [a, b] = periodMarks;
    const slips = b.slips - a.slips;
    const held = (b.stuck - a.stuck) / stepsPerPeriod;
    text += ` In the last vibration, it slipped ${slips} time${slips === 1 ? "" : "s"} and the bow held it for `
      + `${Math.round(100 * held)}% of the time (Helmholtz motion: ${Math.round(100 * (1 - bow.position))}%).`;
  } else {
    text += " Watch for a few vibrations as it gets going.";
  }
  statusLine.innerHTML = text;
}

// ⋘──────── Playable-region map ────────⋙
// Each cell is computed by bowing a fresh string from rest. The cells are computed a few at a time
// between frames, and cached per string and bow speed.

const M_PAD_L = 62, M_PAD_R = 16, M_PAD_T = 12, M_PAD_B = 42;
const MOTION_CODES: Motion[] = ["helmholtz", "multiple", "raucous"];
const mapCache = new Map<string, Int8Array>();
let mapCells: Int8Array = new Int8Array(MAP_COLS * MAP_ROWS).fill(-1);
let mapGeneration = 0;
let mapTimer = 0;

const logFrac = (v: number, lo: number, hi: number) => Math.log(v / lo) / Math.log(hi / lo);
const logLerp = (f: number, lo: number, hi: number) => lo * Math.pow(hi / lo, f);
const cellPosition = (col: number) => logLerp((col + 0.5) / MAP_COLS, POSITION_MIN, POSITION_MAX);
const cellForce    = (row: number) => logLerp((row + 0.5) / MAP_ROWS, FORCE_MIN, FORCE_MAX);

const mapPlotW = () => mapW - M_PAD_L - M_PAD_R;
const mapPlotH = () => mapH - M_PAD_T - M_PAD_B;
const positionToX = (p: number) => M_PAD_L + logFrac(p, POSITION_MIN, POSITION_MAX) * mapPlotW();
const forceToY    = (f: number) => M_PAD_T + (1 - logFrac(f, FORCE_MIN, FORCE_MAX)) * mapPlotH();

const bridgeKey = () => `${bridge.stiffness}:${bridge.damping}`;
const stringKey = () => `${spec.tension}:${spec.density}:${spec.length}:${spec.decayTime}`;
const frictionKey = () => `${bow.muStatic}:${bow.muDynamic}`;

function requestMap(): void {
  window.clearTimeout(mapTimer);
  // Wait until a slider stops moving.
  mapTimer = window.setTimeout(computeMap, 150);
}

function computeMap(): void {
  const key = `${stringKey()}:${bow.speed}:${frictionKey()}:${bridgeKey()}`;
  const generation = ++mapGeneration;
  const cached = mapCache.get(key);
  if (cached) {
    mapCells = cached;
    mapProgress.textContent = "";
    return;
  }
  const cells = new Int8Array(MAP_COLS * MAP_ROWS).fill(-1);
  mapCells = cells;
  const thisSpec = { ...spec }, thisBow = { ...bow }, speed = bow.speed, thisBridge = { ...bridge };
  let next = 0;
  const work = () => {
    if (generation !== mapGeneration) return;
    const deadline = performance.now() + 12;
    while (next < cells.length && performance.now() < deadline) {
      const col = next % MAP_COLS, row = Math.floor(next / MAP_COLS);
      const motion = settledMotion(thisSpec, { ...thisBow, force: cellForce(row), position: cellPosition(col) }, thisBridge);
      cells[next++] = MOTION_CODES.indexOf(motion);
    }
    if (next < cells.length) {
      mapProgress.textContent = `Computing the map for this string at ${fmt(speed * 100, 0)} cm/s: ${Math.round(100 * next / cells.length)}%`;
      window.setTimeout(work, 0);
    } else {
      mapCache.set(key, cells);
      mapProgress.textContent = "";
    }
  };
  work();
}

function drawMap(): void {
  const ctx = context(mapCanvas);
  ctx.clearRect(0, 0, mapW, mapH);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, mapW, mapH);
  const plotW = mapPlotW(), plotH = mapPlotH();

  const cellW = plotW / MAP_COLS, cellH = plotH / MAP_ROWS;
  for (let row = 0; row < MAP_ROWS; row++) {
    for (let col = 0; col < MAP_COLS; col++) {
      const code = mapCells[row * MAP_COLS + col];
      ctx.fillStyle = code < 0 ? "rgba(0, 0, 0, 0.04)" : MOTION_COLORS[MOTION_CODES[code]];
      // Overlap neighbors slightly so that no seams show between cells.
      ctx.fillRect(M_PAD_L + col * cellW, M_PAD_T + (MAP_ROWS - 1 - row) * cellH, cellW + 0.5, cellH + 0.5);
    }
  }

  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = MUTED;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
  ctx.lineWidth = 1;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (const p of [0.03, 0.05, 0.07, 0.1, 0.15, 0.2, 0.3]) {
    const x = positionToX(p);
    ctx.beginPath();
    ctx.moveTo(x, M_PAD_T);
    ctx.lineTo(x, M_PAD_T + plotH);
    ctx.stroke();
    ctx.fillText(String(p), x, M_PAD_T + plotH + 5);
  }
  ctx.fillText("Distance from the bridge, as a fraction β of the string length", M_PAD_L + plotW / 2, M_PAD_T + plotH + 22);
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (const f of [0.05, 0.1, 0.2, 0.5, 1, 2, 5]) {
    const y = forceToY(f);
    ctx.beginPath();
    ctx.moveTo(M_PAD_L, y);
    ctx.lineTo(M_PAD_L + plotW, y);
    ctx.stroke();
    ctx.fillText(`${f} N`, M_PAD_L - 6, y);
  }
  ctx.save();
  ctx.translate(12, M_PAD_T + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillText("Bow force", 0, 0);
  ctx.restore();

  // Schelleng's maximum force, a straight line on these log scales.
  ctx.save();
  ctx.beginPath();
  ctx.rect(M_PAD_L, M_PAD_T, plotW, plotH);
  ctx.clip();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(positionToX(POSITION_MIN), forceToY(schellengMaxForce(spec, bow, POSITION_MIN)));
  ctx.lineTo(positionToX(POSITION_MAX), forceToY(schellengMaxForce(spec, bow, POSITION_MAX)));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // The current bowing.
  const x = positionToX(bow.position), y = forceToY(bow.force);
  ctx.fillStyle = INK;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function setFromMap(event: PointerEvent): void {
  const rect = mapCanvas.getBoundingClientRect();
  const fx = (event.clientX - rect.left - M_PAD_L) / mapPlotW();
  const fy = 1 - (event.clientY - rect.top - M_PAD_T) / mapPlotH();
  bow.position = Math.round(logLerp(Math.min(1, Math.max(0, fx)), POSITION_MIN, POSITION_MAX) * 1000) / 1000;
  bow.force = logLerp(Math.min(1, Math.max(0, fy)), FORCE_MIN, FORCE_MAX);
  syncInputs();
  settingsChanged();
}

// ⋘──────── Helmholtz bands under the sliders ────────⋙
// Under each bowing slider, a green band marks the values that give Helmholtz motion with the other
// settings as they are. Each band is sampled across its slider, a few samples at a time between
// frames, and cached by the settings it depends on (which don't include its own slider).

const BAND_SAMPLES = 40;
const BAND_COLOR = "#1baf7a";

interface Band {
  element : HTMLElement;
  sample  : (f: number) => Partial<BowSettings>; // The setting at fraction f along the slider
  own     : keyof BowSettings;
}

const bands: Band[] = [
  { element: $("bs-force-band"),    own: "force",    sample: f => ({ force: logLerp(f, FORCE_MIN, FORCE_MAX) }) },
  { element: $("bs-speed-band"),    own: "speed",    sample: f => ({ speed: SPEED_MIN + f * (SPEED_MAX - SPEED_MIN) }) },
  { element: $("bs-position-band"), own: "position", sample: f => ({ position: POSITION_MIN + f * (POSITION_MAX - POSITION_MIN) }) },
  { element: $("bs-mu-static-band"),  own: "muStatic",  sample: f => ({ muStatic: MU_STATIC_MIN + f * (MU_STATIC_MAX - MU_STATIC_MIN) }) },
  { element: $("bs-mu-dynamic-band"), own: "muDynamic", sample: f => ({ muDynamic: MU_DYNAMIC_MIN + f * (MU_DYNAMIC_MAX - MU_DYNAMIC_MIN) }) },
];
const bandCache = new Map<string, boolean[]>();
let bandGeneration = 0;
let bandTimer = 0;

function bandKey(band: Band): string {
  const others = (Object.keys(bow) as (keyof BowSettings)[]).filter(k => k !== band.own).map(k => bow[k]);
  return `${band.own}:${stringKey()}:${others.join(":")}:${bridgeKey()}`;
}

function paintBand(band: Band, helmholtz: boolean[]): void {
  const stops = helmholtz.map((h, i) =>
    `${h ? BAND_COLOR : "transparent"} ${(100 * i / BAND_SAMPLES).toFixed(2)}% ${(100 * (i + 1) / BAND_SAMPLES).toFixed(2)}%`);
  band.element.style.backgroundImage = `linear-gradient(to right, ${stops.join(", ")})`;
}

function requestBands(): void {
  for (const band of bands) band.element.classList.toggle("bs-band-stale", !bandCache.has(bandKey(band)));
  window.clearTimeout(bandTimer);
  bandTimer = window.setTimeout(computeBands, 150);
}

function computeBands(): void {
  const generation = ++bandGeneration;
  const jobs: { band: Band; key: string; settings: BowSettings; results: boolean[] }[] = [];
  for (const band of bands) {
    const key = bandKey(band);
    const cached = bandCache.get(key);
    if (cached) {
      paintBand(band, cached);
      band.element.classList.remove("bs-band-stale");
    } else {
      jobs.push({ band, key, settings: { ...bow }, results: [] });
    }
  }
  const thisSpec = { ...spec }, thisBridge = { ...bridge };
  const work = () => {
    if (generation !== bandGeneration) return;
    const deadline = performance.now() + 12;
    while (jobs.length > 0 && performance.now() < deadline) {
      const job = jobs[0];
      const f = (job.results.length + 0.5) / BAND_SAMPLES;
      // Sliding friction above static friction isn't allowed, so those values are never green.
      const settings = { ...job.settings, ...job.band.sample(f) };
      job.results.push(settings.muDynamic <= settings.muStatic - MU_GAP
        && settledMotion(thisSpec, settings, thisBridge) === "helmholtz");
      if (job.results.length === BAND_SAMPLES) {
        bandCache.set(job.key, job.results);
        paintBand(job.band, job.results);
        job.band.element.classList.remove("bs-band-stale");
        jobs.shift();
      }
    }
    if (jobs.length > 0) window.setTimeout(work, 0);
  };
  work();
}

// ⋘──────── Audio ────────⋙
// Renders the bridge's displacement as a string is bowed (or plucked) from rest.

let audioCtx: AudioContext | null = null;
let audioSource: AudioBufferSourceNode | null = null;

function renderAudio(ctx: AudioContext): AudioBuffer {
  const s = new BowedString(spec, { ...bow }, { ...bridge });
  if (!sim.bowing) s.pluck(PLUCK_AT, PLUCK_HEIGHT);
  // Resampled the same way, and at the same fixed gain, as the live sound.
  const source = new SoundSource(s, AUDIO_RATE);
  const length = Math.ceil(AUDIO_SECONDS * AUDIO_RATE);
  const buffer = ctx.createBuffer(1, length, AUDIO_RATE);
  const out = buffer.getChannelData(0);
  const fadeIn = 0.005 * AUDIO_RATE, fadeOut = 0.1 * AUDIO_RATE;
  for (let j = 0; j < length; j++) out[j] = Math.min(1, j / fadeIn, (length - 1 - j) / fadeOut) * source.next();
  return buffer;
}

function listen(): void {
  audioCtx ??= new AudioContext();
  audioSource?.stop();
  const source = audioCtx.createBufferSource();
  source.buffer = renderAudio(audioCtx);
  source.connect(audioCtx.destination);
  source.start();
  audioSource = source;
}

// Continuous sound: a copy of the string runs in real time on the audio thread (see
// bowed_string_audio.ts). It gets every change of the settings, and carries on from its current
// motion instead of restarting, so the sound changes the way a real string's would.

const WORKLET_URL = new URL("./bowed_string_audio.js", import.meta.url);
let liveNode: AudioWorkletNode | null = null;
let liveGain: GainNode | null = null;
let liveOn = false;
let liveBowing = true; // Whether the live string is being bowed (rather than plucked)

function postLive(message: LiveMessage): void {
  liveNode?.port.postMessage(message);
}

function sendLiveSettings(): void {
  postLive({ type: "settings", settings: { string: { ...spec }, bow: { ...bow }, bridge: { ...bridge } } });
}

// Fades the live sound in or out, to avoid clicks.
function rampLive(level: number): void {
  if (!audioCtx || !liveGain) return;
  const t = audioCtx.currentTime;
  liveGain.gain.cancelScheduledValues(t);
  liveGain.gain.setValueAtTime(liveGain.gain.value, t);
  liveGain.gain.linearRampToValueAtTime(level, t + 0.05);
}

async function setLive(on: boolean): Promise<void> {
  liveOn = on;
  liveButton.setAttribute("aria-pressed", String(on));
  liveButton.textContent = on ? "🔇 Stop sound" : "🎻 Play continuously";
  if (!on) {
    rampLive(0);
    // Stop computing once the fade is done, unless the sound was turned back on meanwhile.
    window.setTimeout(() => { if (!liveOn) postLive({ type: "pause" }); }, 100);
    return;
  }
  audioCtx ??= new AudioContext();
  if (!liveNode) {
    try {
      await audioCtx.audioWorklet.addModule(WORKLET_URL);
    } catch {
      liveOn = false;
      liveButton.disabled = true;
      liveButton.textContent = "🎻 Continuous sound isn't available in this browser";
      return;
    }
    liveNode = new AudioWorkletNode(audioCtx, "bowed-string");
    liveGain = audioCtx.createGain();
    liveGain.gain.value = 0;
    liveNode.connect(liveGain).connect(audioCtx.destination);
  }
  if (!liveOn) return; // Turned off while the module was loading
  // Continuous sound is always bowed, even after a pluck, and the animation follows.
  sendLiveSettings();
  if (!sim.bowing) startBowing();
  liveBowing = true;
  postLive({ type: "bow" });
  postLive({ type: "resume" });
  await audioCtx.resume();
  rampLive(1);
}

// ⋘──────── Inputs ────────⋙

// The log-scale sliders run from 0 to 1000.
const toLogSlider   = (x: number, lo: number, hi: number) => String(Math.round(1000 * logFrac(x, lo, hi)));
const fromLogSlider = (v: string, lo: number, hi: number) => logLerp(Number(v) / 1000, lo, hi);

function syncInputs(): void {
  forceInput.value     = toLogSlider(bow.force, FORCE_MIN, FORCE_MAX);
  speedInput.value     = String(bow.speed);
  positionInput.value  = String(bow.position);
  muStaticInput.value  = String(bow.muStatic);
  muDynamicInput.value = String(bow.muDynamic);
  stiffnessInput.value = toLogSlider(bridge.stiffness, STIFFNESS_MIN, STIFFNESS_MAX);
  dampingInput.value   = toLogSlider(bridge.damping, DAMPING_MIN, DAMPING_MAX);
  updateOutputs();
}

function updateOutputs(): void {
  forceOut.textContent    = fmtForce(bow.force);
  speedOut.textContent    = `${fmt(bow.speed * 100, 0)} cm/s`;
  muStaticOut.textContent  = `μₛ = ${fmt(bow.muStatic, 2)}`;
  muDynamicOut.textContent = `μ_d = ${fmt(bow.muDynamic, 2)}`;
  positionOut.textContent = `β = ${fmt(bow.position, 3)} (${fmt(bow.position * spec.length * 1000, 0)} mm)`;
  const omega = Math.sqrt(bridge.stiffness / BRIDGE_MASS); // Bridge resonance (rad/s)
  const resonance = omega / (2 * Math.PI);
  stiffnessOut.textContent = `${fmtSci(bridge.stiffness)} N/m (resonance ${resonance < 1000 ? `${fmt(resonance, 0)} Hz` : `${fmt(resonance / 1000, 1)} kHz`})`;
  dampingOut.textContent   = `${fmtSci(bridge.damping)} N·s/m (Q = ${fmtSci(omega * BRIDGE_MASS / bridge.damping)})`;
}

// Called whenever a setting changes.
function settingsChanged(): void {
  updateOutputs();
  sendLiveSettings();
  // Changing a setting after plucking goes back to bowing, in the sound as in the animation.
  if (!liveBowing) {
    postLive({ type: "bow" });
    liveBowing = true;
  }
  startBowing();
  requestMap();
  requestBands();
}

// ⋘──────── String settings ────────⋙

const NOTE_NAMES = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];

// "440 Hz (A4)", or "440 Hz (A4 + 12¢)" when it's off the nearest note. Without details, just the
// frequency.
function pitchName(f: number, details = true): string {
  const hz = `${fmt(f, f < 100 ? 1 : 0)} Hz`;
  if (!details) return hz;
  const midi = 69 + 12 * Math.log2(f / 440);
  const nearest = Math.round(midi);
  const cents = Math.round(100 * (midi - nearest));
  const note = `${NOTE_NAMES[((nearest % 12) + 12) % 12]}${Math.floor(nearest / 12) - 1}`;
  return `${hz} (${note}${cents === 0 ? "" : ` ${cents > 0 ? "+" : "−"} ${Math.abs(cents)}¢`})`;
}

for (const [i, s] of STRINGS.entries()) {
  const option = document.createElement("option");
  option.value = String(i);
  option.textContent = `Violin ${s.name} (${fmt(fundamental(s), 0)} Hz)`;
  stringSelect.append(option);
}
const customOption = document.createElement("option");
customOption.value = "custom";
customOption.textContent = "Custom";
customOption.disabled = true;
stringSelect.append(customOption);

// The preset that matches the current string, if any.
function matchingPreset(): number {
  return STRINGS.findIndex(s =>
    Math.abs(s.tension - spec.tension) < 1e-9 && Math.abs(s.density / spec.density - 1) < 1e-6 && Math.abs(s.length - spec.length) < 1e-9);
}

function syncStringInputs(): void {
  tensionInput.value = String(spec.tension);
  densityInput.value = toLogSlider(spec.density, DENSITY_MIN, DENSITY_MAX);
  lengthInput.value  = String(Math.round(spec.length * 1000));
  decayInput.value   = toLogSlider(spec.decayTime, DECAY_MIN, DECAY_MAX);
  decayOut.textContent = `τ = ${fmt(spec.decayTime, spec.decayTime < 1 ? 2 : 1)} s`;
  tensionOut.textContent = `${fmt(spec.tension, 0)} N`;
  densityOut.textContent = `${fmt(spec.density * 1000, 2)} g/m`;
  lengthOut.textContent  = `${fmt(spec.length * 1000, 0)} mm`;
  pitchOut.textContent   = pitchName(fundamental(spec));
  const preset = matchingPreset();
  stringSelect.value = preset >= 0 ? String(preset) : "custom";
  updateOutputs();
}

stringSelect.addEventListener("change", () => setStringPreset(Number(stringSelect.value)));
tensionInput.addEventListener("input", () => {
  spec.tension = Number(tensionInput.value);
  stringChanged();
});
densityInput.addEventListener("input", () => {
  spec.density = fromLogSlider(densityInput.value, DENSITY_MIN, DENSITY_MAX);
  stringChanged();
});
lengthInput.addEventListener("input", () => {
  spec.length = Number(lengthInput.value) / 1000;
  stringChanged();
});
decayInput.addEventListener("input", () => {
  spec.decayTime = fromLogSlider(decayInput.value, DECAY_MIN, DECAY_MAX);
  stringChanged();
});

forceInput.addEventListener("input", () => {
  bow.force = fromLogSlider(forceInput.value, FORCE_MIN, FORCE_MAX);
  settingsChanged();
});
speedInput.addEventListener("input", () => {
  bow.speed = Number(speedInput.value);
  settingsChanged();
});
positionInput.addEventListener("input", () => {
  bow.position = Number(positionInput.value);
  settingsChanged();
});
// Sliding friction stays below static friction: lowering one past the other pushes it along.
muStaticInput.addEventListener("input", () => {
  bow.muStatic = Number(muStaticInput.value);
  bow.muDynamic = Math.min(bow.muDynamic, Math.round((bow.muStatic - MU_GAP) * 100) / 100);
  muDynamicInput.value = String(bow.muDynamic);
  settingsChanged();
});
muDynamicInput.addEventListener("input", () => {
  bow.muDynamic = Math.min(Number(muDynamicInput.value), Math.round((bow.muStatic - MU_GAP) * 100) / 100);
  muDynamicInput.value = String(bow.muDynamic);
  settingsChanged();
});
stiffnessInput.addEventListener("input", () => {
  bridge.stiffness = fromLogSlider(stiffnessInput.value, STIFFNESS_MIN, STIFFNESS_MAX);
  settingsChanged();
});
dampingInput.addEventListener("input", () => {
  bridge.damping = fromLogSlider(dampingInput.value, DAMPING_MIN, DAMPING_MAX);
  settingsChanged();
});
bridgeReset.addEventListener("click", () => {
  Object.assign(bridge, DEFAULT_BRIDGE);
  syncInputs();
  settingsChanged();
});

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-preset]")) {
  // The examples are tuned for the violin's A string, with its default damping, and the default
  // bridge.
  button.addEventListener("click", () => {
    Object.assign(bow, PRESETS[button.dataset.preset!]);
    Object.assign(bridge, DEFAULT_BRIDGE);
    syncInputs();
    if (matchingPreset() !== DEFAULT_STRING || spec.decayTime !== DEFAULT_DECAY_TIME) {
      spec.decayTime = DEFAULT_DECAY_TIME;
      setStringPreset(DEFAULT_STRING);
    }
    settingsChanged();
    setPlaying(true);
  });
}

function setPlaying(value: boolean): void {
  playing = value;
  playButton.textContent = playing ? "❚❚ Pause" : "▶ Play";
}

playButton.addEventListener("click", () => setPlaying(!playing));
restartButton.addEventListener("click", () => {
  startBowing(true);
  postLive({ type: "bow" });
  liveBowing = true;
  setPlaying(true);
});
pluckButton.addEventListener("click", () => {
  pluck();
  postLive({ type: "pluck", at: PLUCK_AT, height: PLUCK_HEIGHT });
  liveBowing = false;
  setPlaying(true);
});
listenButton.addEventListener("click", listen);
liveButton.addEventListener("click", () => { void setLive(!liveOn); });
pinAnimation.addEventListener("click", () => setPinned(animationView, pinAnimation, !isPinned(animationView)));
pinCharts.addEventListener("click", () => setPinned(chartsView, pinCharts, !isPinned(chartsView)));
pinSound.addEventListener("click", () => setPinned(soundView, pinSound, !isPinned(soundView)));

// Full screen, for browsers that allow it for page elements (not iPhone Safari).
const fullButtons = document.querySelectorAll<HTMLButtonElement>(".bs-full");
for (const button of fullButtons) {
  button.hidden = !document.fullscreenEnabled;
  button.addEventListener("click", () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void $(button.dataset.full!).requestFullscreen();
  });
}
document.addEventListener("fullscreenchange", () => {
  for (const button of fullButtons) {
    const full = document.fullscreenElement === $(button.dataset.full!);
    button.textContent = full ? "✕" : "⛶";
    button.title = button.ariaLabel = full ? "Exit full screen" : "Full screen";
  }
  layout();
});

let draggingMap = false;
mapCanvas.addEventListener("pointerdown", e => {
  draggingMap = true;
  mapCanvas.setPointerCapture(e.pointerId);
  setFromMap(e);
});
mapCanvas.addEventListener("pointermove", e => { if (draggingMap) setFromMap(e); });
mapCanvas.addEventListener("pointerup", () => { draggingMap = false; });
mapCanvas.addEventListener("pointercancel", () => { draggingMap = false; });

for (const input of [showVelocity, showForce]) {
  const legend = $(input === showVelocity ? "bs-legend-velocity" : "bs-legend-force");
  const sync = () => { legend.hidden = !input.checked; };
  input.addEventListener("change", sync);
  sync();
}

// ⋘──────── Animation ────────⋙

function frame(time: number): void {
  if (playing && lastFrame > 0) {
    // At most a tenth of a second at a time, so that returning to the tab doesn't jump.
    const elapsed = Math.min(0.1, (time - lastFrame) / 1000);
    pendingSteps += elapsed * stepsPerPeriod / Number(rateSelect.value);
    const steps = Math.floor(pendingSteps);
    pendingSteps -= steps;
    advance(steps);
  }
  lastFrame = time;
  if (statusDirty) updateStatus();
  drawString();
  drawCharts();
  drawScope();
  drawSpectrum();
  drawMap();
  requestAnimationFrame(frame);
}

syncInputs();
syncStringInputs();
startBowing();
setPinned(animationView, pinAnimation, true);
setPinned(chartsView, pinCharts, false);
setPinned(soundView, pinSound, false);
new ResizeObserver(layout).observe(animationView.parentElement!);
window.addEventListener("resize", layout);
computeMap();
computeBands();
requestAnimationFrame(frame);
