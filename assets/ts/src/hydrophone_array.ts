// ╭───────────────────────────────────────────────────────────────╮
// │        Whale calls recorded by an array of hydrophones        │
// ╰───────────────────────────────────────────────────────────────╯
// A whale swims along a straight line past a row of hydrophones while repeating a short call.
// Sound travels at a finite speed, so each hydrophone hears a call some time after the whale makes
// it (the delay depends on the distance), and because the whale is moving, the pitch each hears is
// shifted up while the whale approaches it and down after it passes (the Doppler effect).
//
// Everything is computed exactly from the geometry: a hydrophone at r hears, at time t, the
// sound the whale emitted at the time τ that solves t = τ + |r − p(τ)| / c. The received signal
// is the emitted signal evaluated at τ(t), which produces both the delay and the Doppler shift
// without treating them separately.

import { PITCH_LIMIT, Rotator, Scene, Vec3 } from "./common/scene3d";
import { setupHelp } from "./common/help";
import { FIXED_DEPTH_LAYOUTS, LAYOUT_COUNTS, Layout, layoutPhones } from "./hydrophone_array/layouts";
import { setupPanels } from "./common/panels";
import { loadJSON, saveJSON } from "./common/storage";
import { replaceQuery } from "./common/query";
import { Boundaries, PathKind, SoundPath, bouncePoint, mirror, soundPaths } from "./hydrophone_array/reflections";
import { SHARE_KEYS, SavedState, decodeState, encodeState } from "./hydrophone_array/share";

// ⋘──────── Constants ────────⋙

const C           = 1500;  // Speed of sound in seawater (m/s)
// The whale sings for emission times τ ∈ [0, songEnd) and is closest to the array's center at
// cpaTime, halfway through. The song lasts long enough for the whale to swim a track several
// times as long as its distance from the array, so it passes through a wide range of directions
// and distances even at a realistic speed (see updateSong).
let songEnd = 24;   // (s)
let cpaTime = 12;   // (s)
const MIN_SONG   = 24;   // Shortest song (s)
const MAX_SONG   = 1800; // Longest song (s), reached only at the slowest speeds
const TRACK_SPAN = 5;    // Length of the whale's track, in multiples of its distance from the array
const AUDIO_RATE  = 44100; // Sample rate of the rendered audio

// Categorical colors for the hydrophones, in fixed order.
// Okabe–Ito, which stays distinguishable under the common kinds of color blindness (its yellow is
// replaced by a gray, which is too faint on the light background), then a dark brown.
const COLORS = ["#0072B2", "#D55E00", "#009E73", "#E69F00", "#CC79A7", "#56B4E9", "#7f7f7f", "#8c564b"];
const INK    = "#222";
const MUTED  = "#6b6b6b";
const GRID   = "rgba(0, 0, 0, 0.08)";
const WAVE   = "#3a5a8c";

// Margins of the time charts (px).
const PAD_L = 84, PAD_R = 46, PAD_T = 12, PAD_B = 28;

// ⋘──────── The call ────────⋙
// The whale makes a tone at a single pitch, TONE_FREQ, in one of several patterns: calls of
// pulseDur seconds starting every pulsePeriod seconds, or one continuous tone.

const TONE_FREQ   = 500;  // Pitch of the call, as the whale makes it (Hz)
const PULSE_START = 0.3;  // The first call starts a moment after the recording begins (s)
const FADE        = 0.03; // Longest attack and release time of each call (s)

interface CallPattern { dur: number; period: number; }
const PATTERNS: Record<string, CallPattern> = {
  short      : { dur: 0.3,  period: 1.5  },
  long       : { dur: 1.0,  period: 3.0  },
  pulses     : { dur: 0.05, period: 0.25 },
  continuous : { dur: 0, period: 0 }, // One tone for the whole song (see setPattern)
};

let continuous  = false; // Whether the whale makes one continuous tone instead of separate calls
let pulseDur    = 0;     // Length of each call (s)
let pulsePeriod = 0;     // Time from the start of one call to the start of the next (s)
let nPulses     = 0;

function setPattern(name: string): void {
  continuous = name === "continuous";
  ({ dur: pulseDur, period: pulsePeriod } = continuous
    ? { dur: songEnd - 2 * PULSE_START, period: songEnd } : PATTERNS[name]);
  nPulses = Math.ceil((songEnd - PULSE_START - pulseDur) / pulsePeriod);
}
setPattern("short");

// Sets the song's length from the whale's speed and distance (see songEnd).
function updateSong(): void {
  const length = params.speed > 0 ? TRACK_SPAN * params.distance / params.speed : MIN_SONG;
  songEnd = Math.round(Math.min(MAX_SONG, Math.max(MIN_SONG, length)));
  cpaTime = songEnd / 2;
  setPattern(patternSelect.value);
}

const pulseCenter = (k: number) => PULSE_START + k * pulsePeriod + pulseDur / 2;
const callIndex   = (tau: number) => Math.round((tau - pulseCenter(0)) / pulsePeriod);

// The emission time that represents the sound made at τ: for separate calls, the middle of the
// call; for a continuous tone, τ itself.
function snapToCall(tau: number): number {
  if (continuous) return Math.min(Math.max(tau, PULSE_START), PULSE_START + pulseDur);
  return pulseCenter(Math.min(nPulses - 1, Math.max(0, callIndex(tau))));
}

// Loudness envelope of the call at emission time τ, with raised-cosine edges.
function emittedAmp(tau: number): number {
  if (tau < PULSE_START || tau >= songEnd) return 0;
  const s = (tau - PULSE_START) % pulsePeriod;
  if (s >= pulseDur) return 0;
  const fade = Math.min(FADE, pulseDur / 4);
  const edge = Math.min(1, s / fade, (pulseDur - s) / fade);
  return 0.5 - 0.5 * Math.cos(Math.PI * edge);
}

// ⋘──────── Scenario and geometry ────────⋙
// The hydrophones start out spaced along the x-axis, centered at the origin, each at its own depth
// z below the whale's depth; dragging them moves them anywhere. The whale swims along the line
// y = distance (at depth 0) in the +x direction and passes x = 0 at emission time cpaTime.

interface Phone { x: number; y: number; z: number; } // Horizontal position and depth below the whale (m)

interface Params {
  speed    : number; // Whale speed (m/s)
  distance : number; // Distance from the array line to the whale's track (m)
  count    : number; // Number of hydrophones
  spacing  : number; // Distance between neighboring hydrophones (m)
  depths   : string; // How the hydrophones are arranged (see layoutPhones)
  depth    : number; // Greatest depth of a hydrophone below the whale (m)
  surface  : number; // Depth of the whale below the sea surface (m)
  floor    : number; // Depth of the seafloor below the whale (m)
  echoes   : string; // Which reflections are heard: "none", "surface", "seafloor", or "both"
}

const params: Params = {
  speed: 250, distance: 1200, count: 5, spacing: 400, depths: "level", depth: 600,
  surface: 300, floor: 1000, echoes: "both",
};

function boundaries(): Boundaries {
  return {
    surface: params.surface,
    floor  : params.floor,
    echoes : {
      surface : params.echoes === "surface"  || params.echoes === "both",
      seafloor: params.echoes === "seafloor" || params.echoes === "both",
    },
  };
}

// The direct path and the switched-on reflected paths to a hydrophone. A reflected path is
// computed as a direct path to the hydrophone's mirror image, so every function below that takes
// a Phone also works for the reflections when given path.receiver.
const pathsTo = (ph: Phone): SoundPath<Phone>[] => soundPaths(ph, boundaries());
const ECHO_NAMES: Record<PathKind, string> = { direct: "direct", surface: "surface echo", seafloor: "seafloor echo" };
let phones: Phone[] = [];
let tEnd = 30; // The last received time shown (s)

const whaleX = (tau: number) => params.speed * (tau - cpaTime);

// Distance from the whale at emission time τ to a hydrophone, at least 1 m so that a hydrophone
// dragged onto the whale's track doesn't divide by zero.
function distanceAt(ph: Phone, tau: number): number {
  return Math.max(1, Math.hypot(whaleX(tau) - ph.x, params.distance - ph.y, ph.z));
}

// Loudness relative to a hydrophone at the closest distance of the original array, capped at 1.
const loudness = (ph: Phone, tau: number) => Math.min(1, params.distance / distanceAt(ph, tau));

// The emission time τ of the sound that reaches hydrophone ph at time t, found with Newton's
// method on g(τ) = τ + D(τ)/c − t. Since the whale is slower than sound, g is increasing, so the
// root is unique, and since g is convex, Newton's method converges to it from any starting point
// (slowly from far away when the whale is close to the speed of sound, hence the iteration limit
// without a guess). With a guess from a nearby time, a few iterations are enough.
function emissionTime(ph: Phone, t: number, guess?: number): number {
  let tau = guess ?? t - distanceAt(ph, t) / C;
  const iterations = guess === undefined ? 60 : 3;
  for (let k = 0; k < iterations; k++) {
    const dx = whaleX(tau) - ph.x;
    const D  = distanceAt(ph, tau);
    const g  = tau + D / C - t;
    const dD = dx * params.speed / D; // dD/dτ: negative while the whale approaches
    const step = g / (1 + dD / C);
    tau -= step;
    if (Math.abs(step) < 1e-9) break;
  }
  return tau;
}

// Ratio of received to emitted frequency for sound emitted at τ: f_r / f_s = dτ/dt = 1 / (1 + D'(τ)/c).
function dopplerFactor(ph: Phone, tau: number): number {
  const dx = whaleX(tau) - ph.x;
  return 1 / (1 + dx * params.speed / distanceAt(ph, tau) / C);
}

// Places the hydrophones as set by the controls, discarding any dragging.
function placePhones(): void {
  phones = layoutPhones(params.depths, params.count, params.spacing, params.depth, params.surface, params.floor)
    .map(p => ({ ...p, z: clamp(p.z, -params.surface, params.floor) }));
}

function updateGeometry(): void {
  let maxDelay = 0;
  for (const ph of phones) {
    for (const { receiver } of pathsTo(ph)) {
      maxDelay = Math.max(maxDelay, distanceAt(receiver, 0), distanceAt(receiver, songEnd));
    }
  }
  tEnd = Math.ceil(songEnd + maxDelay / C + 0.5);
}

// ⋘──────── Formatting helpers ────────⋙

const fmt = (x: number, digits: number) => x.toFixed(digits);
const signed = (x: number, digits: number) => (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(digits);
const semitones = (factor: number) => 12 * Math.log2(factor);
const phoneName = (i: number) => `H${i + 1}`;

// A "nice" tick step (1, 2, or 5 × 10ⁿ) so that ticks are at least minPx apart.
function niceStep(unitsPerPx: number, minPx: number): number {
  const raw = unitsPerPx * minPx;
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

const playButton   = $<HTMLButtonElement>("wh-play");
const timeSlider   = $<HTMLInputElement>("wh-time");
const timeOutput   = $<HTMLOutputElement>("wh-time-out");
const rateSelect   = $<HTMLSelectElement>("wh-rate");
const loopInput    = $<HTMLInputElement>("wh-loop");
const leftSelect   = $<HTMLSelectElement>("wh-left");
const rightSelect  = $<HTMLSelectElement>("wh-right");
const patternSelect = $<HTMLSelectElement>("wh-pattern");
const audioNote    = $<HTMLElement>("wh-audio-note");
const speedInput   = $<HTMLInputElement>("wh-speed");
const distInput    = $<HTMLInputElement>("wh-distance");
const countInput   = $<HTMLInputElement>("wh-count");
const spacingInput = $<HTMLInputElement>("wh-spacing");
const speedOut     = $<HTMLOutputElement>("wh-speed-out");
const distOut      = $<HTMLOutputElement>("wh-distance-out");
const countOut     = $<HTMLOutputElement>("wh-count-out");
const spacingOut   = $<HTMLOutputElement>("wh-spacing-out");
const depthsSelect = $<HTMLSelectElement>("wh-depths");
const depthInput   = $<HTMLInputElement>("wh-depth");
const depthOut     = $<HTMLOutputElement>("wh-depth-out");
const echoesSelect = $<HTMLSelectElement>("wh-echoes");
const surfaceInput = $<HTMLInputElement>("wh-surface");
const surfaceOut   = $<HTMLOutputElement>("wh-surface-out");
const floorInput   = $<HTMLInputElement>("wh-floor");
const floorOut     = $<HTMLOutputElement>("wh-floor-out");
const resetPhonesButton = $<HTMLButtonElement>("wh-reset-phones");
const readoutBody  = $<HTMLTableSectionElement>("wh-readout-body");
const tooltip      = $<HTMLDivElement>("wh-tooltip");

const mapCanvas     = $<HTMLCanvasElement>("wh-map");
const view3dCanvas  = $<HTMLCanvasElement>("wh-3d");
const sideCanvas    = $<HTMLCanvasElement>("wh-side");
const freqCanvas    = $<HTMLCanvasElement>("wh-freq");
const delayCanvas   = $<HTMLCanvasElement>("wh-delay");

// ⋘──────── State ────────⋙

let now      = 13.3;     // Current received time (s); starts just after the highlighted call is made
let marked   = snapToCall(cpaTime); // Emission time of the highlighted call (s)
let hoverT: number | null = null;
let hoverTau: number | null = null; // Emission time of the call under the mouse in the frequency chart
let playing  = false;
let lastFrame = 0;

// ⋘──────── Canvas sizing ────────⋙
// Each canvas is drawn at device resolution. The time charts have a cached static layer
// (everything that doesn't depend on the current time), redrawn only when something changes.

interface Chart {
  canvas : HTMLCanvasElement;
  layer  : HTMLCanvasElement;   // Cached static drawing
  width  : number;              // CSS px
  height : number;              // CSS px
  dirty  : boolean;
  drawStatic: (ctx: CanvasRenderingContext2D, chart: Chart) => void;
}

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

function makeChart(canvas: HTMLCanvasElement, drawStatic: Chart["drawStatic"]): Chart {
  return { canvas, layer: document.createElement("canvas"), width: 0, height: 0, dirty: true, drawStatic };
}

const freqChart  = makeChart(freqCanvas, drawFreqStatic);
const delayChart = makeChart(delayCanvas, drawDelayStatic);
const timeCharts = [freqChart, delayChart];

let mapWidth = 0, mapHeight = 0;

// The height left for a canvas whose panel is shown full screen (below its title), or null.
function fullScreenHeight(canvas: HTMLElement): number | null {
  const panel = canvas.closest(".wh-panel");
  if (!panel || document.fullscreenElement !== panel) return null;
  return Math.max(200, Math.floor(window.innerHeight - canvas.getBoundingClientRect().top - 16));
}

function layout(): void {
  mapWidth  = mapCanvas.clientWidth;
  mapHeight = fullScreenHeight(mapCanvas) ?? Math.round(Math.min(440, Math.max(260, mapWidth * 0.5)));
  sizeCanvas(mapCanvas, mapWidth, mapHeight);

  // The side view is drawn at the map's scale when that fits, so that distances match.
  sideWidth  = sideCanvas.clientWidth;
  sideHeight = fullScreenHeight(sideCanvas)
    ?? Math.round(Math.min(300, Math.max(120, SIDE_TOP + SIDE_BOTTOM + sideDepth() * mapView().scale)));
  sizeCanvas(sideCanvas, sideWidth, sideHeight);
  // The 3D view sizes itself from its CSS height (see Scene.begin).
  view3dCanvas.style.height = fullScreenHeight(view3dCanvas) === null ? "" : `${fullScreenHeight(view3dCanvas)}px`;

  for (const chart of timeCharts) {
    chart.width  = chart.canvas.clientWidth;
    chart.height = fullScreenHeight(chart.canvas) ?? (chart === freqChart ? 300 : 220);
    sizeCanvas(chart.canvas, chart.width, chart.height);
    sizeCanvas(chart.layer, chart.width, chart.height);
    chart.dirty = true;
  }
}

function invalidateCharts(): void {
  for (const chart of timeCharts) chart.dirty = true;
}

// Time ↔ x for the time charts.
const plotWidth = (chart: Chart) => chart.width - PAD_L - PAD_R;
const tToX = (chart: Chart, t: number) => PAD_L + (t / tEnd) * plotWidth(chart);
const xToT = (chart: Chart, x: number) => Math.min(tEnd, Math.max(0, ((x - PAD_L) / plotWidth(chart)) * tEnd));

function drawTimeAxis(ctx: CanvasRenderingContext2D, chart: Chart, top: number, bottom: number): void {
  const step = niceStep(tEnd / plotWidth(chart), 55);
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let t = 0; t <= tEnd + 1e-9; t += step) {
    const x = tToX(chart, t);
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.fillText(`${t} s`, x, bottom + 6);
  }
}

// Places labels at the right end of each series, nudged apart so they don't overlap.
function drawEndLabels(ctx: CanvasRenderingContext2D, chart: Chart, ys: { i: number; y: number }[]): void {
  ys.sort((a, b) => a.y - b.y);
  for (let k = 1; k < ys.length; k++) ys[k].y = Math.max(ys[k].y, ys[k - 1].y + 12);
  // If that pushed labels past the bottom of the plot, push them back up.
  const bottom = chart.height - PAD_B;
  for (let k = ys.length - 1; k >= 0; k--) {
    ys[k].y = Math.min(ys[k].y, k === ys.length - 1 ? bottom : ys[k + 1].y - 12);
  }
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  for (const { i, y } of ys) {
    ctx.fillStyle = COLORS[i];
    ctx.fillRect(chart.width - PAD_R + 6, y - 1, 8, 2);
    ctx.fillStyle = INK;
    ctx.fillText(phoneName(i), chart.width - PAD_R + 17, y);
  }
}

// ⋘──────── Chart: received frequency ────────⋙
// The frequency each hydrophone hears vs time. Bold segments are the calls as they arrive; the
// thin curves show the frequency the hydrophone would hear if the whale called continuously. The
// whale's own calls are drawn in black at TONE_FREQ, and the highlighted call is connected to its
// arrival at each hydrophone.

// The frequency axis's range (Hz). The Doppler factor changes monotonically along the whale's
// track, so the extremes are at the start and end of the calls. Approaching shifts the pitch up
// more than receding shifts it down, so the range is lopsided at high speeds.
function freqRange(): { lo: number; hi: number } {
  let lo = 1, hi = 1;
  for (const ph of phones) {
    for (const { receiver } of pathsTo(ph)) {
      for (const tau of [0, songEnd]) {
        lo = Math.min(lo, dopplerFactor(receiver, tau));
        hi = Math.max(hi, dopplerFactor(receiver, tau));
      }
    }
  }
  // A narrow band of frequencies (a slow whale) is spread over the chart's height, down to a
  // range of ±0.05% (±0.25 Hz), so the hydrophones' bars don't crowd together.
  lo = Math.min(lo, 0.9995);
  hi = Math.max(hi, 1.0005);
  const pad = 0.08 * (hi - lo);
  return { lo: TONE_FREQ * (lo - pad), hi: TONE_FREQ * (hi + pad) };
}

function freqToY(chart: Chart, f: number): number {
  const top = PAD_T, bottom = chart.height - PAD_B;
  const { lo, hi } = freqRange();
  return bottom - (bottom - top) * (f - lo) / (hi - lo);
}

function drawFreqStatic(ctx: CanvasRenderingContext2D, chart: Chart): void {
  const top = PAD_T, bottom = chart.height - PAD_B, right = chart.width - PAD_R;
  const { lo, hi } = freqRange();
  drawTimeAxis(ctx, chart, top, bottom);

  // Horizontal gridlines in Hz, with the call's own frequency emphasized.
  const step = niceStep((hi - lo) / (bottom - top), 32);
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let f = TONE_FREQ - Math.floor((TONE_FREQ - lo) / step) * step; f <= hi + 1e-9; f += step) {
    const y = freqToY(chart, f);
    ctx.strokeStyle = GRID;
    ctx.beginPath(); ctx.moveTo(PAD_L, y); ctx.lineTo(right, y); ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.fillText(`${fmt(f, Math.max(0, Math.ceil(-Math.log10(step) - 1e-9)))} Hz`, PAD_L - 6, y);
  }
  const y0 = freqToY(chart, TONE_FREQ);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.45)";
  ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.moveTo(PAD_L, y0); ctx.lineTo(right, y0); ctx.stroke();
  ctx.setLineDash([]);

  // The curves start high on the left and end low on the right, so the opposite corners are clear.
  ctx.fillStyle = MUTED;
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText("Higher pitch: whale approaching", right - 6, top + 4);
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText("Lower pitch: whale moving away", PAD_L + 6, bottom - 4);

  // Echoes first, so the direct sound is drawn on top: thinner bars, fainter by the loss at the
  // bounce, without the continuous curve.
  phones.forEach((ph, i) => {
    for (const path of pathsTo(ph)) {
      if (path.kind === "direct") continue;
      const echo = path.receiver;
      let prev: { x: number; y: number; amp: number } | null = null;
      let guess: number | undefined;
      ctx.strokeStyle = COLORS[i];
      ctx.lineWidth = 2;
      for (let x = PAD_L; x <= right; x += 0.5) {
        const tau = emissionTime(echo, xToT(chart, x), guess);
        guess = tau;
        if (tau < 0 || tau > songEnd) { prev = null; continue; }
        const p = {
          x, y: freqToY(chart, TONE_FREQ * dopplerFactor(echo, tau)),
          amp: emittedAmp(tau) * loudness(echo, tau) * Math.abs(path.gain),
        };
        if (prev && prev.amp >= 0.03 && p.amp >= 0.03) {
          ctx.globalAlpha = 0.15 + 0.5 * Math.min(1, p.amp);
          ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        }
        prev = p;
      }
      ctx.globalAlpha = 1;
    }
  });

  // Each hydrophone: a thin curve for the Doppler-shifted frequency and bold segments where a call
  // is arriving, fading with distance.
  const ends: { i: number; y: number }[] = [];
  phones.forEach((ph, i) => {
    const samples: { x: number; y: number; amp: number }[] = [];
    let guess: number | undefined;
    for (let x = PAD_L; x <= right; x += 0.5) {
      const tau = emissionTime(ph, xToT(chart, x), guess);
      guess = tau;
      if (tau < 0 || tau > songEnd) continue;
      const amp = emittedAmp(tau) * loudness(ph, tau);
      samples.push({ x, y: freqToY(chart, TONE_FREQ * dopplerFactor(ph, tau)), amp });
    }
    ctx.strokeStyle = COLORS[i];
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    samples.forEach((p, k) => (k === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.lineCap = "butt";
    for (let k = 1; k < samples.length; k++) {
      const a = samples[k - 1], b = samples[k];
      if (a.amp < 0.03 || b.amp < 0.03) continue;
      ctx.globalAlpha = 0.3 + 0.7 * Math.min(1, b.amp);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    if (samples.length) ends.push({ i, y: samples[samples.length - 1].y });
  });
  drawEndLabels(ctx, chart, ends);

  // The whale's calls, at the frequency it makes them.
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  for (let k = 0; k < nPulses; k++) {
    const start = pulseCenter(k) - pulseDur / 2;
    ctx.beginPath(); ctx.moveTo(tToX(chart, start), y0); ctx.lineTo(tToX(chart, start + pulseDur), y0); ctx.stroke();
  }

  // The highlighted call: a marker where the whale makes it, connected to each arrival.
  const x0 = tToX(chart, marked);
  const arrivals = phones.map((ph, i) => ({
    i,
    x: tToX(chart, marked + distanceAt(ph, marked) / C),
    y: freqToY(chart, TONE_FREQ * dopplerFactor(ph, marked)),
  }));
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.25;
  ctx.setLineDash([4, 3]);
  for (const a of arrivals) {
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(a.x, a.y); ctx.stroke();
  }
  ctx.setLineDash([]);
  const dot = (x: number, y: number, color: string) => {
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(x, y, 6, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, 4, 0, 2 * Math.PI); ctx.fill();
  };
  for (const a of arrivals) dot(a.x, a.y, COLORS[a.i]);
  dot(x0, y0, INK);
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = INK;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(`made at ${fmt(marked, 2)} s`, x0 - 10, y0 - 12);
}

// Points along the bar that hydrophone ph records for call k, in chart coordinates.
function receivedBar(chart: Chart, ph: Phone, k: number): { x: number; y: number }[] {
  const start = pulseCenter(k) - pulseDur / 2;
  const points = [];
  for (let j = 0; j <= 20; j++) {
    const tau = start + (j / 20) * pulseDur;
    points.push({
      x: tToX(chart, tau + distanceAt(ph, tau) / C),
      y: freqToY(chart, TONE_FREQ * dopplerFactor(ph, tau)),
    });
  }
  return points;
}

// The emission time of the sound whose black bar, or whose bar at any hydrophone, is at (x, y) in
// the frequency chart, snapped to the middle of its call.
function emissionAt(chart: Chart, x: number, y: number): number | null {
  const t = xToT(chart, x);
  const tolerance = 6 * tEnd / plotWidth(chart); // 6 px, in seconds
  const isCall = (tau: number) => {
    const k = callIndex(tau);
    return k >= 0 && k < nPulses && Math.abs(pulseCenter(k) - tau) < pulseDur / 2 + tolerance;
  };
  if (isCall(t) && Math.abs(y - freqToY(chart, TONE_FREQ)) < 10) return snapToCall(t);
  for (const ph of phones) {
    const tau = emissionTime(ph, t);
    if (isCall(tau) && Math.abs(y - freqToY(chart, TONE_FREQ * dopplerFactor(ph, tau))) < 8) {
      return snapToCall(tau);
    }
  }
  return null;
}

// Emphasizes the sound made at τ in the frequency chart: dashed lines from the whale to where it
// arrives at each hydrophone, and, for separate calls, the whole call's bars.
function drawHoveredCall(ctx: CanvasRenderingContext2D, chart: Chart, tau: number): void {
  const x0 = tToX(chart, tau), y0 = freqToY(chart, TONE_FREQ);
  const arrivals = phones.map(ph => ({
    x: tToX(chart, tau + distanceAt(ph, tau) / C),
    y: freqToY(chart, TONE_FREQ * dopplerFactor(ph, tau)),
  }));
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.25;
  ctx.setLineDash([4, 3]);
  for (const a of arrivals) {
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(a.x, a.y); ctx.stroke();
  }
  // Fainter lines to where each echo of the same sound arrives, when it's loud enough to hear.
  ctx.globalAlpha = 0.35;
  for (const ph of phones) {
    for (const path of pathsTo(ph)) {
      if (path.kind === "direct") continue;
      if (loudness(path.receiver, tau) * Math.abs(path.gain) < 0.03) continue;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(tToX(chart, tau + distanceAt(path.receiver, tau) / C), freqToY(chart, TONE_FREQ * dopplerFactor(path.receiver, tau)));
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  ctx.setLineDash([]);
  ctx.lineCap = "round";
  const stroke = (points: { x: number; y: number }[], color: string) => {
    for (const [width, style] of [[9, "#fff"], [5, color]] as const) {
      ctx.strokeStyle = style;
      ctx.lineWidth = width;
      ctx.beginPath();
      points.forEach((p, j) => (j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
    }
  };
  if (continuous) {
    // The whole tone is one call, so mark just this instant.
    arrivals.forEach((a, i) => stroke([a, { x: a.x + 0.01, y: a.y }], COLORS[i]));
    stroke([{ x: x0, y: y0 }, { x: x0 + 0.01, y: y0 }], INK);
  } else {
    const k = callIndex(tau);
    phones.forEach((ph, i) => stroke(receivedBar(chart, ph, k), COLORS[i]));
    const half = (pulseDur / 2) * plotWidth(chart) / tEnd;
    stroke([{ x: x0 - half, y: y0 }, { x: x0 + half, y: y0 }], INK);
  }
  ctx.lineCap = "butt";
}

// ⋘──────── Chart: travel time ────────⋙

function drawDelayStatic(ctx: CanvasRenderingContext2D, chart: Chart): void {
  const top = PAD_T, bottom = chart.height - PAD_B;
  let maxDelay = 0;
  for (const ph of phones) {
    for (const { receiver } of pathsTo(ph)) {
      maxDelay = Math.max(maxDelay, distanceAt(receiver, 0) / C, distanceAt(receiver, songEnd) / C);
    }
  }
  const yMax = maxDelay * 1.1;
  const toY = (d: number) => bottom - (d / yMax) * (bottom - top);
  drawTimeAxis(ctx, chart, top, bottom);

  const step = niceStep(yMax / (bottom - top), 32);
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let d = 0; d <= yMax + 1e-9; d += step) {
    const y = toY(d);
    ctx.strokeStyle = d === 0 ? "rgba(0, 0, 0, 0.35)" : GRID;
    ctx.beginPath(); ctx.moveTo(PAD_L, y); ctx.lineTo(chart.width - PAD_R, y); ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.fillText(`${fmt(d, step < 0.1 ? 2 : step < 1 ? 1 : 0)} s`, PAD_L - 6, y);
  }

  // Each hydrophone's direct sound as a solid curve; its echoes, which travel farther and so
  // arrive later, as dashed (surface) and dotted (seafloor) curves above it.
  const ends: { i: number; y: number }[] = [];
  phones.forEach((ph, i) => {
    for (const path of pathsTo(ph)) {
      const direct = path.kind === "direct";
      ctx.strokeStyle = COLORS[i];
      ctx.lineWidth = direct ? 2 : 1.25;
      ctx.globalAlpha = direct ? 1 : 0.75;
      ctx.setLineDash(direct ? [] : path.kind === "surface" ? [6, 4] : [2, 3]);
      ctx.beginPath();
      let started = false, lastY = 0;
      let guess: number | undefined;
      for (let x = PAD_L; x <= chart.width - PAD_R; x += 1) {
        const t = xToT(chart, x);
        const tau = emissionTime(path.receiver, t, guess);
        guess = tau;
        if (tau < 0 || tau > songEnd) { started = false; continue; }
        lastY = toY(t - tau);
        if (started) ctx.lineTo(x, lastY); else ctx.moveTo(x, lastY);
        started = true;
      }
      ctx.stroke();
      if (direct) ends.push({ i, y: lastY });
    }
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  });
  if (params.echoes !== "none") {
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillStyle = MUTED;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const kinds = [params.echoes !== "seafloor" && "dashed: surface echo", params.echoes !== "surface" && "dotted: seafloor echo"];
    ctx.fillText(`Solid: direct sound; ${kinds.filter(Boolean).join("; ")}`, PAD_L + 6, top + 4);
  }
  drawEndLabels(ctx, chart, ends);
}

// Draws a time chart: the cached static layer, then the playhead and hover crosshair.
function drawTimeChart(chart: Chart): void {
  if (chart.dirty) {
    const lctx = context(chart.layer);
    lctx.clearRect(0, 0, chart.width, chart.height);
    chart.drawStatic(lctx, chart);
    chart.dirty = false;
  }
  const ctx = chart.canvas.getContext("2d")!;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, chart.canvas.width, chart.canvas.height);
  ctx.drawImage(chart.layer, 0, 0);
  ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);

  const bottom = chart.height - PAD_B;
  const x = tToX(chart, now);
  ctx.strokeStyle = "#d22";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(x, PAD_T); ctx.lineTo(x, bottom); ctx.stroke();

  if (chart === freqChart && hoverTau !== null) drawHoveredCall(ctx, chart, hoverTau);

  if (hoverT !== null) {
    const hx = tToX(chart, hoverT);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(hx, PAD_T); ctx.lineTo(hx, bottom); ctx.stroke();
    ctx.setLineDash([]);
  }
}

// ⋘──────── Sound in a plane ────────⋙
// Each call is a shell of sound: the region between the sphere reached by the start of the call
// (centered where the whale was when the call started) and the sphere reached by its end
// (centered where the whale was when it ended, or at the whale while it's still calling). The
// spheres aren't concentric, so the shell is thicker ahead of the whale and thinner behind.
//
// The views show where the shells cross a plane containing a line parallel to the whale's track,
// `offset` meters from it. A sphere of radius r crosses it in a circle of radius √(r² − offset²),
// centered at the point of the plane nearest the sphere's center; center(x) gives the screen
// position of that point when the whale is at x along its track.

function drawSoundInPlane(ctx: CanvasRenderingContext2D, scale: number, center: (x: number) => [number, number],
                          offset: number, maxR: number, highlighted: boolean, strength = 1): void {
  const inPlane = (r: number) => Math.sqrt(Math.max(0, r * r - offset * offset));
  const circle = (tau: number, r: number) => {
    const [cx, cy] = center(whaleX(tau));
    ctx.moveTo(cx + r * scale, cy);
    ctx.arc(cx, cy, r * scale, 0, 2 * Math.PI);
  };
  // Outlines the region of call k in the plane; false if it hasn't reached the plane.
  const callBand = (k: number) => {
    const start = pulseCenter(k) - pulseDur / 2;
    const end   = Math.min(now, start + pulseDur);
    const outer = C * (now - start), inner = C * (now - end);
    if (outer <= offset) return false;
    ctx.beginPath();
    circle(start, inPlane(outer));
    if (inner > offset) circle(end, inPlane(inner));
    return true;
  };
  const visibleCall = (k: number) => {
    const start = pulseCenter(k) - pulseDur / 2;
    return start <= now && inPlane(C * (now - start - pulseDur)) < maxR;
  };

  if (highlighted) {
    // The highlighted call, outlined; for a continuous tone, the wavefront of the highlighted instant.
    const r = C * (now - marked);
    if (continuous) {
      if (r > offset) {
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2;
        ctx.beginPath(); circle(marked, inPlane(r)); ctx.stroke();
      }
    } else if (visibleCall(callIndex(marked)) && callBand(callIndex(marked))) {
      ctx.fillStyle = INK;
      ctx.globalAlpha = 0.18;
      ctx.fill("evenodd");
      ctx.globalAlpha = 1;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.25;
      ctx.stroke();
    }
    return;
  }

  ctx.fillStyle = WAVE;
  for (let k = 0; k < nPulses; k++) {
    if (!visibleCall(k) || (!continuous && pulseCenter(k) === marked)) continue;
    const start = pulseCenter(k) - pulseDur / 2;
    if (!callBand(k)) continue;
    ctx.globalAlpha = strength * (continuous ? 0.2 : 0.35) * Math.max(0.12, 1 - inPlane(C * (now - start)) / maxR);
    ctx.fill("evenodd");
  }
  // A continuous tone fills one big region, so wavefronts are drawn inside it at regular
  // intervals to show how they bunch up ahead of the whale.
  if (continuous) {
    ctx.strokeStyle = WAVE;
    ctx.lineWidth = 1;
    for (let tau = PULSE_START; tau <= Math.min(now, PULSE_START + pulseDur); tau += 0.5) {
      const r = C * (now - tau);
      if (r <= offset || inPlane(r) > maxR) continue;
      ctx.globalAlpha = strength * 0.6 * Math.max(0.15, 1 - inPlane(r) / maxR);
      ctx.beginPath(); circle(tau, inPlane(r)); ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

// ⋘──────── Map ────────⋙

interface MapView { scale: number; ox: number; oy: number; }

let frozenMapView: MapView | null = null; // The view while a hydrophone is being dragged

function mapView(): MapView {
  if (frozenMapView) return frozenMapView;
  const xMax = Math.max(...phones.map(ph => Math.abs(ph.x)));
  const halfW = Math.max(params.speed * cpaTime + 300, xMax + 400, params.distance * 1.3, 1500);
  const ySpan = Math.max(params.distance, 600);
  const yMin = Math.min(-0.35 * ySpan, ...phones.map(ph => ph.y - 0.25 * ySpan));
  const yMax = Math.max(params.distance + 0.35 * ySpan, ...phones.map(ph => ph.y + 0.25 * ySpan));
  const scale = Math.min(mapWidth / (2 * halfW), mapHeight / (yMax - yMin));
  return { scale, ox: mapWidth / 2, oy: mapHeight / 2 + ((yMax + yMin) / 2) * scale };
}

// A whale seen from above: the body is symmetric, with a pectoral fin on each side and the tail
// flukes spread sideways.
function drawWhaleTop(ctx: CanvasRenderingContext2D, x: number, y: number, facing: number, singing: boolean): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.fillStyle = "#2f3b4a";
  ctx.beginPath();
  for (const side of [1, -1]) {
    // Long, slender pectoral fins, swept back.
    ctx.moveTo(8, 5 * side);
    ctx.quadraticCurveTo(2, 15 * side, -9, 18 * side);
    ctx.quadraticCurveTo(-1, 11 * side, 3, 5 * side);
    // Flukes.
    ctx.moveTo(-17, 0);
    ctx.quadraticCurveTo(-21, 3 * side, -27, 10 * side);
    ctx.quadraticCurveTo(-25, 4 * side, -24, 0);
  }
  ctx.fill();
  ctx.beginPath();
  // Body: rounded head at +x, widest just behind it, tapering to the tail stock.
  ctx.moveTo(18, 0);
  ctx.bezierCurveTo(18, -5, 12, -6.5, 4, -6.5);
  ctx.bezierCurveTo(-6, -6.5, -12, -3, -18, -1.2);
  ctx.lineTo(-18, 1.2);
  ctx.bezierCurveTo(-12, 3, -6, 6.5, 4, 6.5);
  ctx.bezierCurveTo(12, 6.5, 18, 5, 18, 0);
  ctx.fill();
  // Blowhole.
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.beginPath(); ctx.ellipse(9, 0, 1.6, 0.9, 0, 0, 2 * Math.PI); ctx.fill();
  if (singing) {
    ctx.strokeStyle = "#2f3b4a";
    ctx.lineWidth = 1.5;
    for (const r of [24, 30]) {
      ctx.beginPath(); ctx.arc(6, 0, r, -0.5, 0.5); ctx.stroke();
    }
  }
  ctx.restore();
}

// A hydrophone marker: filled when the hydrophone lies in the plane the view shows, hollow when
// it's in front of or behind it (so the bands drawn there don't show what it hears).
function drawPhoneMarker(ctx: CanvasRenderingContext2D, x: number, y: number, i: number, inPlane: boolean): void {
  const dragged = drag?.index === i;
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(x, y, dragged ? 9 : 7, 0, 2 * Math.PI); ctx.fill();
  if (inPlane) {
    ctx.fillStyle = COLORS[i];
    ctx.beginPath(); ctx.arc(x, y, dragged ? 7 : 5, 0, 2 * Math.PI); ctx.fill();
  } else {
    ctx.strokeStyle = COLORS[i];
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(x, y, dragged ? 6 : 4.25, 0, 2 * Math.PI); ctx.stroke();
  }
}

function drawWhale(ctx: CanvasRenderingContext2D, x: number, y: number, facing: number, singing: boolean): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.fillStyle = "#2f3b4a";
  ctx.beginPath();
  // Body (head at +x) and tail flukes.
  ctx.moveTo(16, 0);
  ctx.bezierCurveTo(16, -9, 2, -10, -8, -5);
  ctx.lineTo(-17, -1);
  ctx.lineTo(-24, -7);
  ctx.lineTo(-21, 0);
  ctx.lineTo(-24, 7);
  ctx.lineTo(-17, 1);
  ctx.lineTo(-8, 5);
  ctx.bezierCurveTo(2, 9, 16, 8, 16, 0);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.arc(9, -2, 1.3, 0, 2 * Math.PI); ctx.fill();
  if (singing) {
    ctx.strokeStyle = "#2f3b4a";
    ctx.lineWidth = 1.5;
    for (const r of [22, 28]) {
      ctx.beginPath(); ctx.arc(4, 0, r, -0.5, 0.5); ctx.stroke();
    }
  }
  ctx.restore();
}

function drawMap(): void {
  const ctx = context(mapCanvas);
  const { scale, ox, oy } = mapView();
  const sx = (x: number) => ox + x * scale;
  const sy = (y: number) => oy - y * scale;

  const water = ctx.createLinearGradient(0, 0, 0, mapHeight);
  water.addColorStop(0, "#eef5fb");
  water.addColorStop(1, "#dce9f4");
  ctx.fillStyle = water;
  ctx.fillRect(0, 0, mapWidth, mapHeight);

  const maxR = Math.hypot(mapWidth, mapHeight) / scale;
  // Echoes come from the whale's mirror images, directly above and below it, so in this view they
  // are fainter rings that reach each point later than the direct sound.
  const b = boundaries();
  for (const [on, height, gain] of [[b.echoes.surface, 2 * params.surface, 0.9], [b.echoes.seafloor, 2 * params.floor, 0.5]] as const) {
    if (on) drawSoundInPlane(ctx, scale, x => [sx(x), sy(params.distance)], height, maxR, false, 0.6 * gain);
  }
  drawSoundInPlane(ctx, scale, x => [sx(x), sy(params.distance)], 0, maxR, false);

  // The whale's track, with the point of closest approach to the array's center.
  ctx.strokeStyle = "rgba(47, 59, 74, 0.35)";
  ctx.setLineDash([6, 5]);
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, sy(params.distance)); ctx.lineTo(mapWidth, sy(params.distance)); ctx.stroke();
  ctx.setLineDash([]);

  // The highlighted call: where the whale made it, and its band of sound, outlined.
  const markX = sx(whaleX(marked)), markY = sy(params.distance);
  drawSoundInPlane(ctx, scale, x => [sx(x), sy(params.distance)], 0, maxR, true);
  ctx.fillStyle = INK;
  ctx.beginPath(); ctx.arc(markX, markY, 3.5, 0, 2 * Math.PI); ctx.fill();
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(`${continuous ? "sound" : "call"} made at ${fmt(marked, 2)} s`, markX, markY - 22);

  // Sound in flight: for each hydrophone, a line from where the whale was when it sang what the
  // hydrophone hears right now.
  phones.forEach((ph, i) => {
    const tau = emissionTime(ph, now);
    if (tau < 0 || tau > songEnd) return;
    const audible = emittedAmp(tau) > 0.05;
    ctx.strokeStyle = COLORS[i];
    ctx.lineWidth = audible ? 1.75 : 1;
    ctx.globalAlpha = audible ? 0.9 : 0.35;
    ctx.setLineDash(audible ? [] : [3, 4]);
    ctx.beginPath(); ctx.moveTo(sx(whaleX(tau)), sy(params.distance)); ctx.lineTo(sx(ph.x), sy(ph.y)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = COLORS[i];
    ctx.beginPath(); ctx.arc(sx(whaleX(tau)), sy(params.distance), 3, 0, 2 * Math.PI); ctx.fill();
    ctx.globalAlpha = 1;
  });

  // Hydrophones, labeled when there's room.
  const roomy = params.spacing * scale >= 20;
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.textBaseline = "top";
  phones.forEach((ph, i) => {
    drawPhoneMarker(ctx, sx(ph.x), sy(ph.y), i, Math.abs(ph.z) < 0.5);
    if (roomy || phonesMoved || i === 0 || i === params.count - 1) {
      ctx.fillStyle = INK;
      ctx.fillText(phoneName(i), sx(ph.x), sy(ph.y) + 10);
    }
  });

  drawWhaleTop(ctx, sx(whaleX(now)), sy(params.distance), params.speed >= 0 ? 1 : -1, emittedAmp(now) > 0.05);

  // Scale bar.
  const barMeters = niceStep(1 / scale, 70);
  const barPx = barMeters * scale;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(12, mapHeight - 14); ctx.lineTo(12 + barPx, mapHeight - 14); ctx.stroke();
  ctx.fillStyle = INK;
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(barMeters >= 1000 ? `${barMeters / 1000} km` : `${barMeters} m`, 12, mapHeight - 18);
  ctx.textAlign = "right";
  ctx.fillText(`t = ${fmt(now, 2)} s`, mapWidth - 10, mapHeight - 10);
}

// ⋘──────── Side view ────────⋙
// The vertical plane through the hydrophones, seen from the whale's side: position along the array
// across, depth down. The whale swims parallel to this plane, params.distance in front of it, so
// it's drawn faintly at its depth.

const SIDE_TOP = 26, SIDE_BOTTOM = 22; // Margins (px)
const sideDepth = () => params.surface + params.floor; // Depth range shown, surface to seafloor (m)
let sideWidth = 0, sideHeight = 0;

let frozenSideScale: number | null = null; // The scale while a hydrophone is being dragged

function sideScale(): number {
  const fit = (sideHeight - SIDE_TOP - SIDE_BOTTOM) / sideDepth();
  // Matches the map's scale when that fits, except in full screen, where the depths fill the screen.
  const full = document.fullscreenElement === sideCanvas.closest(".wh-panel");
  return frozenSideScale ?? (full ? fit : Math.min(mapView().scale, fit));
}

// Screen y of depth z (below the whale) in the side view.
const sideZ = (z: number, scale: number) => SIDE_TOP + (z + params.surface) * scale;

function drawSide(): void {
  const ctx = context(sideCanvas);
  const scale = sideScale();
  const sx = (x: number) => sideWidth / 2 + x * scale;
  const sz = (z: number) => sideZ(z, scale);
  const yTop = sz(-params.surface), yFloor = sz(params.floor);

  // Sky above the surface, water, and sediment below the seafloor.
  ctx.fillStyle = "#f6f9fc";
  ctx.fillRect(0, 0, sideWidth, yTop);
  const water = ctx.createLinearGradient(0, yTop, 0, yFloor);
  water.addColorStop(0, "#e6f0f8");
  water.addColorStop(1, "#cfdfee");
  ctx.fillStyle = water;
  ctx.fillRect(0, yTop, sideWidth, yFloor - yTop);
  ctx.fillStyle = "#d9cdb4";
  ctx.fillRect(0, yFloor, sideWidth, sideHeight - yFloor);

  // Sound stays in the water. Echoes spread from the whale's mirror images above the surface and
  // below the seafloor, and only the parts that have bounced back into the water are drawn.
  ctx.save();
  ctx.beginPath(); ctx.rect(0, yTop, sideWidth, yFloor - yTop); ctx.clip();
  const maxR = Math.hypot(sideWidth, sideHeight) / scale;
  const b = boundaries();
  if (b.echoes.surface) {
    drawSoundInPlane(ctx, scale, x => [sx(x), sz(-2 * params.surface)], params.distance, maxR, false, 0.55);
  }
  if (b.echoes.seafloor) {
    drawSoundInPlane(ctx, scale, x => [sx(x), sz(2 * params.floor)], params.distance, maxR, false, 0.35);
  }
  drawSoundInPlane(ctx, scale, x => [sx(x), sz(0)], params.distance, maxR, false);
  drawSoundInPlane(ctx, scale, x => [sx(x), sz(0)], params.distance, maxR, true);
  ctx.restore();

  // Depth gridlines.
  const step = niceStep(1 / scale, 40);
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  for (let z = step; sz(z) < yFloor - 14; z += step) {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.07)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, sz(z)); ctx.lineTo(sideWidth, sz(z)); ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.fillText(`${z} m deeper`, 6, sz(z) - 2);
  }
  ctx.strokeStyle = "rgba(47, 59, 74, 0.35)";
  ctx.setLineDash([6, 5]);
  ctx.beginPath(); ctx.moveTo(0, sz(0)); ctx.lineTo(sideWidth, sz(0)); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = MUTED;
  ctx.fillText(`Whale's depth (${params.distance} m in front of this plane)`, 6, sz(0) - 4);

  // The surface and the seafloor.
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#5b8fc4";
  ctx.beginPath(); ctx.moveTo(0, yTop); ctx.lineTo(sideWidth, yTop); ctx.stroke();
  ctx.strokeStyle = "#8a7550";
  ctx.beginPath(); ctx.moveTo(0, yFloor); ctx.lineTo(sideWidth, yFloor); ctx.stroke();
  ctx.fillStyle = MUTED;
  ctx.fillText(`Sea surface (${params.surface} m above the whale)`, 6, yTop - 3);
  ctx.textBaseline = "top";
  ctx.fillText(`Seafloor (${params.floor} m below the whale)`, 6, yFloor + 3);
  ctx.textBaseline = "bottom";

  // Sound in flight, as in the map, but only drawn to where its path crosses this plane. Echoes
  // are drawn from the whale to where they bounce and on to the hydrophone, thinner.
  phones.forEach((ph, i) => {
    for (const path of pathsTo(ph)) {
      const tau = emissionTime(path.receiver, now);
      if (tau < 0 || tau > songEnd) continue;
      const audible = emittedAmp(tau) > 0.05;
      const direct = path.kind === "direct";
      ctx.strokeStyle = COLORS[i];
      ctx.lineWidth = (audible ? 1.75 : 1) * (direct ? 1 : 0.7);
      ctx.globalAlpha = (audible ? 0.9 : 0.35) * (direct ? 1 : 0.6);
      ctx.setLineDash(audible ? [] : [3, 4]);
      ctx.beginPath();
      ctx.moveTo(sx(whaleX(tau)), sz(0));
      if (path.kind !== "direct") {
        const whale = { x: whaleX(tau), y: params.distance, z: 0 };
        const bounce = bouncePoint(whale, path.receiver, path.kind, boundaries());
        ctx.lineTo(sx(bounce.x), sz(bounce.z));
      }
      ctx.lineTo(sx(ph.x), sz(ph.z));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }
  });

  ctx.globalAlpha = 0.45;
  drawWhale(ctx, sx(whaleX(now)), sz(0), 1, emittedAmp(now) > 0.05);
  ctx.globalAlpha = 1;

  const roomy = params.spacing * scale >= 20;
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  phones.forEach((ph, i) => {
    drawPhoneMarker(ctx, sx(ph.x), sz(ph.z), i, Math.abs(ph.y) < 0.5);
    if (roomy || phonesMoved || i === 0 || i === params.count - 1) {
      ctx.fillStyle = INK;
      ctx.fillText(phoneName(i), sx(ph.x), sz(ph.z) - 9);
    }
  });
}

// ⋘──────── 3D view ────────⋙
// The whole scene in 3D, drawn with the linear algebra tools' Scene, so it rotates the same way:
// drag to turn it, fling to set it spinning. Scene's z points up, so a depth z below the whale is
// drawn at height −z. Sound spheres are shown by the circles where they cut the sea surface, the
// whale's depth, and the seafloor.

const view3d = { yaw: -0.6, pitch: 0.35 };
const scene3d = new Scene();
const toWorld = (x: number, y: number, z: number): Vec3 => [x, y, -z];

function draw3D(): void {
  const { scale } = mapView();
  const halfW = mapWidth / 2 / scale;
  const yLo = Math.min(-0.3 * params.distance, ...phones.map(ph => ph.y - 200));
  const yHi = Math.max(1.3 * params.distance, ...phones.map(ph => ph.y + 200));
  const x0 = -halfW, x1 = halfW, top = -params.surface, bottom = params.floor;
    // Scene fits a sphere of radius `extent` in the canvas's shorter side, which leaves a wide canvas
  // mostly empty, so the extent is shrunk by the aspect ratio. The ends of the box can then leave
  // the canvas at some angles, which is fine for a long, flat stretch of ocean.
  const rect = view3dCanvas.getBoundingClientRect();
  const aspect = Math.min(1, rect.height / Math.max(1, rect.width));
  const box = {
    center: toWorld(0, (yLo + yHi) / 2, (top + bottom) / 2),
    extent: 1.1 * aspect * Math.max(halfW, (yHi - yLo) / 2, (bottom - top) / 2),
  };
  const sc = scene3d;
  sc.begin(view3dCanvas, { dim: 3, yaw: view3d.yaw, pitch: view3d.pitch, perspective: true, ...box });
  const ctx = sc.ctx;

  const sheet = (z: number) => [toWorld(x0, yLo, z), toWorld(x1, yLo, z), toWorld(x1, yHi, z), toWorld(x0, yHi, z)];
  sc.polygon(sheet(bottom), "rgba(190, 170, 130, 0.55)", "#8a7550");
  for (const x of [x0, x1]) for (const y of [yLo, yHi]) sc.line(toWorld(x, y, top), toWorld(x, y, bottom), "rgba(90, 120, 160, 0.35)");

  // A circle in the horizontal plane at depth z, cut off at the edges of the box.
  const ring = (cx: number, cy: number, z: number, r: number, color: string, width: number, alpha: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    let pen = false;
    const n = 96;
    for (let k = 0; k <= n; k++) {
      const a = (2 * Math.PI * k) / n;
      const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
      if (x < x0 || x > x1 || y < yLo || y > yHi) { pen = false; continue; }
      const [px, py] = sc.project(toWorld(x, y, z));
      if (pen) ctx.lineTo(px, py); else ctx.moveTo(px, py);
      pen = true;
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  const maxR = Math.hypot(2 * halfW, yHi - yLo, top - bottom);
  for (let k = 0; k < nPulses; k++) {
    const start = pulseCenter(k) - pulseDur / 2;
    const r = C * (now - start);
    if (r <= 0 || r > maxR) continue;
    const highlighted = !continuous && pulseCenter(k) === marked;
    const color = highlighted ? INK : WAVE;
    const alpha = highlighted ? 0.9 : 0.35 + 0.4 * (1 - r / maxR);
    for (const z of [top, 0, bottom]) {
      if (r > Math.abs(z)) ring(whaleX(start), params.distance, z, Math.sqrt(r * r - z * z), color, highlighted ? 1.75 : 1, alpha);
    }
  }

  // The whale's track, and the paths of the sound each hydrophone hears now, bouncing for echoes.
  sc.line(toWorld(x0, params.distance, 0), toWorld(x1, params.distance, 0), "rgba(47, 59, 74, 0.45)", 1, [6, 5]);
  phones.forEach((ph, i) => {
    sc.line(toWorld(ph.x, ph.y, ph.z), toWorld(ph.x, ph.y, bottom), "rgba(0, 0, 0, 0.25)", 1, [2, 3]);
    for (const path of pathsTo(ph)) {
      const tau = emissionTime(path.receiver, now);
      if (tau < 0 || tau > songEnd) continue;
      const audible = emittedAmp(tau) > 0.05;
      const direct = path.kind === "direct";
      const whale = { x: whaleX(tau), y: params.distance, z: 0 };
      const points = [whale];
      if (path.kind !== "direct") points.push(bouncePoint(whale, path.receiver, path.kind, boundaries()));
      points.push(ph);
      ctx.globalAlpha = (audible ? 0.9 : 0.35) * (direct ? 1 : 0.6);
      for (let j = 1; j < points.length; j++) {
        const a = points[j - 1], b = points[j];
        sc.line(toWorld(a.x, a.y, a.z), toWorld(b.x, b.y, b.z), COLORS[i], (audible ? 1.75 : 1) * (direct ? 1 : 0.7), audible ? [] : [3, 4]);
      }
      ctx.globalAlpha = 1;
    }
  });

  sc.polygon(sheet(top), "rgba(120, 170, 220, 0.18)", "#5b8fc4");

  const font = `bold ${sc.px(11)}px system-ui, sans-serif`;
  phones.forEach((ph, i) => {
    const p = toWorld(ph.x, ph.y, ph.z);
    sc.dot(p, 6, "#fff");
    sc.dot(p, 4.5, COLORS[i]);
    const [px, py] = sc.project(p);
    sc.haloText(phoneName(i), px, py - 10, INK, font);
  });
  const [wx, wy] = sc.project(toWorld(whaleX(now), params.distance, 0));
  sc.dot(toWorld(whaleX(now), params.distance, 0), 7, "#2f3b4a");
  sc.haloText("whale", wx, wy - 12, "#2f3b4a", font);
  sc.finish();
}

const rotator = new Rotator(view3d, () => { if (!playing) draw3D(); });
view3dCanvas.addEventListener("pointerdown", e => {
  rotator.start(e.clientX, e.clientY);
  view3dCanvas.setPointerCapture(e.pointerId);
  view3dCanvas.style.cursor = "grabbing";
});
view3dCanvas.addEventListener("pointermove", e => rotator.move(e.clientX, e.clientY));
for (const type of ["pointerup", "pointercancel"] as const) {
  view3dCanvas.addEventListener(type, () => {
    rotator.end(type === "pointerup");
    view3dCanvas.style.cursor = "grab";
  });
}

// ⋘──────── Readout table ────────⋙

let readoutCells: HTMLTableCellElement[][] = [];

function buildReadout(): void {
  readoutBody.replaceChildren();
  readoutCells = phones.map((_, i) => {
    const row = readoutBody.insertRow();
    const name = row.insertCell();
    name.innerHTML = `<span class="wh-swatch" style="background:${COLORS[i]}"></span>${phoneName(i)}`;
    return [row.insertCell(), row.insertCell(), row.insertCell(), row.insertCell(), row.insertCell(), row.insertCell(), row.insertCell()];
  });
}

function updateReadout(): void {
  const taus = phones.map(ph => emissionTime(ph, now));
  const arrivalsOfMarked = phones.map(ph => marked + distanceAt(ph, marked) / C);
  const firstArrival = Math.min(...arrivalsOfMarked);
  phones.forEach((ph, i) => {
    const [depth, dist, delay, lag, echoes, shift, hearing] = readoutCells[i];
    const tau = taus[i];
    const inSong = tau >= 0 && tau <= songEnd;
    const factor = dopplerFactor(ph, tau);
    depth.textContent = ph.z < -0.5 ? `${Math.round(-ph.z)} m above` : `${Math.round(ph.z)} m`;
    dist.textContent  = `${Math.round(distanceAt(ph, tau))} m`;
    delay.textContent = `${fmt(now - tau, 3)} s`;
    lag.textContent   = `${fmt(arrivalsOfMarked[i] - firstArrival, 3)} s`;
    const echoLags = pathsTo(ph).filter(p => p.kind !== "direct")
      .map(p => `${ECHO_NAMES[p.kind].replace(" echo", "")} +${fmt((distanceAt(p.receiver, marked) - distanceAt(ph, marked)) / C, 3)} s`);
    echoes.innerHTML = echoLags.length ? echoLags.join("<br>") : "—";
    shift.textContent = inSong ? `${signed(100 * (factor - 1), 2)}% (${signed(semitones(factor), 2)} semitones)` : "—";
    hearing.textContent = inSong && emittedAmp(tau) > 0.05
      ? `${fmt(TONE_FREQ * factor, 1)} Hz` : "silence";
  });
}

// ⋘──────── Audio ────────⋙
// The recording at one hydrophone is rendered sample by sample: y(t) = s(τ(t)) · d / D(τ(t)).
// The Doppler shift and delay come out of τ(t) on their own.

let audioCtx: AudioContext | null = null;
let audioOut: GainNode | null = null;          // Where the chunks play, faded in at the start
let audioSources: AudioBufferSourceNode[] = []; // Chunks scheduled to play
let audioQueuedUntil = 0;                      // Simulation time up to which audio is scheduled
let audioStart = { ctxTime: 0, t: 0 };         // Maps the audio clock to the simulation time

// A song can last half an hour, too long to render at once, so the audio is rendered in chunks
// of AUDIO_CHUNK seconds, each scheduled to start exactly when the one before it ends.
const AUDIO_CHUNK = 20; // (s)

// Renders n samples, starting at time t0, of what a listener ("whale" or a hydrophone index) hears.
function renderChannel(listener: string, t0: number, n: number): Float32Array<ArrayBuffer> {
  const data = new Float32Array(n);
  // The whale hears itself directly; a hydrophone hears the direct sound plus each echo, each
  // computed as the direct sound at the hydrophone's mirror image, times the bounce's gain.
  const paths: { receiver: Phone | null; gain: number }[] = listener === "whale"
    ? [{ receiver: null, gain: 1 }] : pathsTo(phones[Number(listener)]);
  // Echoes add to the direct sound, so the mix is scaled down to keep it from clipping.
  const mix = 0.45 / Math.sqrt(paths.length);
  for (const { receiver, gain: bounce } of paths) {
    let tau: number | undefined = receiver === null ? undefined : emissionTime(receiver, t0);
    for (let k = 0; k < n; k++) {
      const t = t0 + k / AUDIO_RATE;
      let gain = bounce;
      if (receiver === null) {
        tau = t;
      } else {
        tau = emissionTime(receiver, t, tau);
        gain *= loudness(receiver, tau);
      }
      const amp = emittedAmp(tau);
      if (amp === 0) continue;
      // Near the speed of sound the pitch rises up to tenfold, so overtones that would go past the
      // highest frequency the sample rate can represent are left out to avoid aliasing.
      const heard = TONE_FREQ * (receiver === null ? 1 : dopplerFactor(receiver, tau));
      const phase = 2 * Math.PI * TONE_FREQ * tau;
      let wave = Math.sin(phase);
      if (2 * heard < 0.45 * AUDIO_RATE) wave += 0.3 * Math.sin(2 * phase);
      if (3 * heard < 0.45 * AUDIO_RATE) wave += 0.12 * Math.sin(3 * phase);
      data[k] += mix * gain * amp * wave;
    }
  }
  return data;
}

// Schedules the chunk of audio that starts at simulation time t0.
function scheduleChunk(t0: number): void {
  if (!audioCtx || !audioOut) return;
  const t1 = Math.min(tEnd, t0 + AUDIO_CHUNK);
  const n = Math.round((t1 - t0) * AUDIO_RATE);
  if (n <= 0) return;
  const buffer = audioCtx.createBuffer(2, n, AUDIO_RATE);
  [leftSelect.value, rightSelect.value].forEach((listener, channel) => {
    if (listener !== "off") buffer.copyToChannel(renderChannel(listener, t0, n), channel);
  });
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioOut);
  source.onended = () => { audioSources = audioSources.filter(s => s !== source); };
  source.start(audioStart.ctxTime + (t0 - audioStart.t));
  audioSources.push(source);
  audioQueuedUntil = t0 + n / AUDIO_RATE;
}

// Keeps the next chunk scheduled a few seconds before the current one runs out.
function topUpAudio(): void {
  if (audioSources.length && audioQueuedUntil < tEnd && now > audioQueuedUntil - 5) scheduleChunk(audioQueuedUntil);
}

function stopAudio(): void {
  for (const source of audioSources) {
    source.onended = null;
    source.stop();
    source.disconnect();
  }
  audioSources = [];
  audioOut?.disconnect();
  audioOut = null;
}

// Starts the audio at the current time, if sound is on and playback is at normal speed.
function startAudio(): void {
  stopAudio();
  const silent = leftSelect.value === "off" && rightSelect.value === "off";
  const realTime = Number(rateSelect.value) === 1;
  audioNote.hidden = silent || realTime;
  if (silent || !realTime || !playing) return;
  audioCtx ??= new AudioContext();
  void audioCtx.resume();
  audioOut = audioCtx.createGain();
  // Rendering the first chunk takes a moment, so it starts slightly in the future.
  const start = audioCtx.currentTime + 0.05;
  audioOut.gain.setValueAtTime(0, start);
  audioOut.gain.linearRampToValueAtTime(1, start + 0.03);
  audioOut.connect(audioCtx.destination);
  audioStart = { ctxTime: start, t: now };
  scheduleChunk(now);
}

// ⋘──────── Playback ────────⋙

function setPlaying(value: boolean): void {
  playing = value;
  playButton.textContent = playing ? "❚❚ Pause" : "▶ Play";
  if (playing) {
    if (now >= tEnd - 0.01) now = 0;
    lastFrame = performance.now();
    startAudio();
  } else {
    stopAudio();
  }
}

function seek(t: number): void {
  now = Math.min(tEnd, Math.max(0, t));
  if (playing) startAudio();
}

function frame(time: number): void {
  if (playing) {
    if (audioSources.length && audioCtx) {
      now = Math.max(audioStart.t, audioStart.t + (audioCtx.currentTime - audioStart.ctxTime));
      topUpAudio();
    } else {
      now += ((time - lastFrame) / 1000) * Number(rateSelect.value);
    }
    if (now >= tEnd) {
      if (loopInput.checked) {
        seek(0); // Restarts the audio too
      } else {
        now = tEnd;
        setPlaying(false);
      }
    }
  }
  lastFrame = time;
  render();
  requestAnimationFrame(frame);
}

function render(): void {
  timeSlider.value = String(now);
  timeOutput.textContent = `${fmt(now, 2)} s`;
  drawMap();
  drawSide();
  draw3D();
  for (const chart of timeCharts) drawTimeChart(chart);
  updateReadout();
}

// ⋘──────── Hover tooltip ────────⋙

function showTooltip(event: MouseEvent, chart: Chart): void {
  const rect = chart.canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  if (x < PAD_L || x > chart.width - PAD_R) { hideTooltip(); return; }
  hoverT = xToT(chart, x);
  hoverTau = chart === freqChart ? emissionAt(chart, x, event.clientY - rect.top) : null;
  chart.canvas.style.cursor = hoverTau !== null ? "pointer" : "";
  const rows = phones.map((ph, i) => {
    const tau = emissionTime(ph, hoverT!);
    const inSong = tau >= 0 && tau <= songEnd;
    const factor = dopplerFactor(ph, tau);
    return `<tr><td><span class="wh-swatch" style="background:${COLORS[i]}"></span>${phoneName(i)}</td>` +
           `<td>${fmt(hoverT! - tau, 2)} s</td>` +
           `<td>${inSong ? `${fmt(TONE_FREQ * factor, 1)} Hz` : "—"}</td>` +
           `<td>${inSong ? `${signed(100 * (factor - 1), 2)}%` : "—"}</td></tr>`;
  }).join("");
  const callLine = hoverTau === null ? "" :
    `<div>${continuous ? "Sound" : "Call"} made at ${fmt(hoverTau, 2)} s${hoverTau === marked ? "" : " (click to follow it)"}</div>`;
  tooltip.innerHTML = `<div class="wh-tooltip-title">t = ${fmt(hoverT, 2)} s</div>${callLine}` +
    `<table><tr><th></th><th>Delay</th><th>Frequency</th><th>Shift</th></tr>${rows}</table>`;
  tooltip.hidden = false;
  const box = tooltip.getBoundingClientRect();
  const left = event.clientX + 14 + box.width > window.innerWidth ? event.clientX - 14 - box.width : event.clientX + 14;
  tooltip.style.left = `${left + window.scrollX}px`;
  tooltip.style.top  = `${event.clientY + window.scrollY + 14}px`;
}

function hideTooltip(): void {
  hoverT = null;
  hoverTau = null;
  tooltip.hidden = true;
}

// ⋘──────── Controls ────────⋙

function readParams(): void {
  params.speed    = Number(speedInput.value);
  params.distance = Number(distInput.value);
  params.count    = Number(countInput.value);
  params.spacing  = Number(spacingInput.value);
  speedOut.textContent   = `${params.speed} m/s (${fmt(params.speed / C * 100, 1)}% of c)`;
  distOut.textContent    = `${params.distance} m`;
  countOut.textContent   = String(params.count);
  spacingOut.textContent = `${params.spacing} m`;
  // Spacing means nothing with a single hydrophone.
  spacingInput.closest("label")!.hidden = params.count === 1;
  params.surface  = Number(surfaceInput.value);
  params.floor    = Number(floorInput.value);
  params.echoes   = echoesSelect.value;
  surfaceOut.textContent = `${params.surface} m`;
  floorOut.textContent   = `${params.floor} m`;
  // Hydrophones can't be deeper than the seafloor; lowering the maximum also lowers the value.
  depthInput.max  = String(params.floor);
  params.depths   = depthsSelect.value;
  params.depth    = Number(depthInput.value);
  depthOut.textContent   = `${params.depth} m`;
  depthInput.disabled    = FIXED_DEPTH_LAYOUTS.includes(params.depths as Layout);
  updateSong();
}

function rebuildListenOptions(): void {
  for (const select of [leftSelect, rightSelect]) {
    const previous = select.value;
    select.replaceChildren(new Option("Off", "off"), new Option("Whale", "whale"));
    phones.forEach((_, i) => select.add(new Option(phoneName(i), String(i))));
    const stillThere = Array.from(select.options).some(o => o.value === previous);
    select.value = stillThere ? previous : "off";
  }
}

// Called when a control changes; `rearrange` is whether it changes where the hydrophones are.
function onParamsChanged(rearrange: boolean): void {
  const countChanged = params.count !== Number(countInput.value);
  const oldSong = songEnd;
  readParams();
  // When the song's length changes, the time and the highlighted call move with it, so they stay
  // at the same point of the whale's track.
  if (songEnd !== oldSong) {
    now *= songEnd / oldSong;
    marked = snapToCall(marked * songEnd / oldSong);
  }
  // The single hydrophones on the seafloor or below the surface move with it, unless dragged.
  if (rearrange || (!phonesMoved && params.depths.startsWith("single"))) {
    placePhones();
    phonesMoved = false;
    resetPhonesButton.hidden = true;
  }
  // A raised seafloor lifts hydrophones with it, and a lowered surface pushes them down.
  for (const ph of phones) ph.z = clamp(ph.z, -params.surface, params.floor);
  updateGeometry();
  timeSlider.max = String(tEnd);
  now = Math.min(now, tEnd);
  if (countChanged) {
    rebuildListenOptions();
    buildReadout();
  }
  layout(); // The side view's height depends on the depths
  invalidateCharts();
  if (playing) startAudio();
}

for (const input of [speedInput, distInput, surfaceInput, floorInput, echoesSelect]) {
  input.addEventListener("input", () => onParamsChanged(false));
}
// Choosing a layout also sets the number of hydrophones that suits it; it can be changed afterward.
depthsSelect.addEventListener("input", () => {
  const count = LAYOUT_COUNTS[depthsSelect.value as Layout];
  if (count) countInput.value = String(count);
});
for (const input of [countInput, spacingInput, depthInput, depthsSelect]) {
  input.addEventListener("input", () => onParamsChanged(true));
}
resetPhonesButton.addEventListener("click", () => onParamsChanged(true));

// Each whale preset sets some of the whale's settings; the others keep their values.
const WHALE_PRESETS: Record<string, [HTMLInputElement, string][]> = {
  realistic  : [[speedInput, "3"]],
  fast       : [[speedInput, "250"]],
  nearSound  : [[speedInput, "1350"]],
  nearSurface: [[surfaceInput, "20"]],
  deep       : [[surfaceInput, "800"]],
};
const whalePresetSelect = $<HTMLSelectElement>("wh-whale-preset");
whalePresetSelect.addEventListener("change", () => {
  const preset = WHALE_PRESETS[whalePresetSelect.value];
  whalePresetSelect.value = ""; // Back to the prompt, so the same preset can be chosen again
  if (!preset) return;
  for (const [el, value] of preset) el.value = value;
  onParamsChanged(false);
});

// ⋘──────── Dragging hydrophones ────────⋙
// In the map, dragging moves a hydrophone horizontally; in the side view, along the array and up
// or down. The views' scales are frozen during a drag so the hydrophone stays under the pointer.

interface Drag { index: number; }
let drag: Drag | null = null;
let phonesMoved = false; // Whether any hydrophone has been dragged from where the controls put it
// Whether the whale is being dragged along its track, which moves the time to when it was there.
let whaleDrag = false;

// Screen position of a hydrophone in each view, and the inverse.
const views = {
  map: {
    canvas: mapCanvas,
    toScreen: (ph: Phone): [number, number] => {
      const { scale, ox, oy } = mapView();
      return [ox + ph.x * scale, oy - ph.y * scale];
    },
    moveTo: (ph: Phone, px: number, py: number) => {
      const { scale, ox, oy } = mapView();
      ph.x = clamp((px - ox) / scale, -20000, 20000);
      ph.y = clamp((oy - py) / scale, -20000, 20000);
    },
    whaleScreen: (): [number, number] => {
      const { scale, ox, oy } = mapView();
      return [ox + whaleX(now) * scale, oy - params.distance * scale];
    },
    trackX: (px: number) => (px - mapView().ox) / mapView().scale,
  },
  side: {
    canvas: sideCanvas,
    toScreen: (ph: Phone): [number, number] => {
      const scale = sideScale();
      return [sideWidth / 2 + ph.x * scale, sideZ(ph.z, scale)];
    },
    moveTo: (ph: Phone, px: number, py: number) => {
      const scale = sideScale();
      ph.x = clamp((px - sideWidth / 2) / scale, -20000, 20000);
      ph.z = clamp((py - SIDE_TOP) / scale - params.surface, -params.surface, params.floor);
    },
    whaleScreen: (): [number, number] => [sideWidth / 2 + whaleX(now) * sideScale(), sideZ(0, sideScale())],
    trackX: (px: number) => (px - sideWidth / 2) / sideScale(),
  },
};

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

// Recomputes everything that depends on where the hydrophones are. While dragging, the costlier
// parts (resizing the side view, re-rendering the audio) wait until the drop.
function onPhonesMoved(dropped: boolean): void {
  phonesMoved = true;
  resetPhonesButton.hidden = false;
  updateGeometry();
  timeSlider.max = String(tEnd);
  now = Math.min(now, tEnd);
  invalidateCharts();
  if (dropped) {
    layout();
    if (playing) startAudio();
  }
}

for (const view of Object.values(views)) {
  const canvas = view.canvas;
  const pointer = (e: PointerEvent): [number, number] => {
    const rect = canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  };
  // The hydrophone under the pointer, preferring the one drawn on top.
  const phoneAt = (px: number, py: number): number | null => {
    for (let i = phones.length - 1; i >= 0; i--) {
      const [x, y] = view.toScreen(phones[i]);
      if (Math.hypot(px - x, py - y) <= 11) return i;
    }
    return null;
  };
  // Whether the whale is under the pointer. It can be dragged only while it swims.
  const onWhale = (px: number, py: number): boolean => {
    const [x, y] = view.whaleScreen();
    return params.speed > 0 && Math.abs(px - x) <= 26 && Math.abs(py - y) <= 14;
  };
  // Moves the time to when the whale was at the pointer's position along its track.
  const dragWhaleTo = (px: number) => seek(cpaTime + view.trackX(px) / params.speed);
  canvas.addEventListener("pointerdown", e => {
    const index = phoneAt(...pointer(e));
    if (index === null) {
      if (!onWhale(...pointer(e))) return;
      // Dragging the whale scrubs through time, so playback pauses.
      if (playing) setPlaying(false);
      whaleDrag = true;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
      e.preventDefault();
      return;
    }
    frozenMapView = mapView();
    frozenSideScale = sideScale();
    drag = { index };
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
    e.preventDefault();
  });
  canvas.addEventListener("pointermove", e => {
    if (whaleDrag) {
      dragWhaleTo(pointer(e)[0]);
      return;
    }
    if (!drag) {
      canvas.style.cursor = phoneAt(...pointer(e)) !== null || onWhale(...pointer(e)) ? "grab" : "";
      return;
    }
    view.moveTo(phones[drag.index], ...pointer(e));
    onPhonesMoved(false);
  });
  const drop = () => {
    if (whaleDrag) {
      whaleDrag = false;
      canvas.style.cursor = "";
      return;
    }
    if (!drag) return;
    drag = null;
    frozenMapView = null;
    frozenSideScale = null;
    canvas.style.cursor = "";
    onPhonesMoved(true);
  };
  canvas.addEventListener("pointerup", drop);
  canvas.addEventListener("pointercancel", drop);
}

playButton.addEventListener("click", () => setPlaying(!playing));
timeSlider.addEventListener("input", () => seek(Number(timeSlider.value)));
rateSelect.addEventListener("change", () => { lastFrame = performance.now(); startAudio(); });
for (const select of [leftSelect, rightSelect]) {
  select.addEventListener("change", () => {
    // Choosing something to listen to starts playback, since that's almost always the intent.
    if (select.value !== "off" && !playing) setPlaying(true); else startAudio();
  });
}
patternSelect.addEventListener("change", () => {
  setPattern(patternSelect.value);
  marked = snapToCall(marked);
  invalidateCharts();
  if (playing) startAudio();
});

for (const chart of timeCharts) {
  chart.canvas.addEventListener("mousemove", e => showTooltip(e, chart));
  chart.canvas.addEventListener("mouseleave", hideTooltip);
  chart.canvas.addEventListener("click", e => {
    const rect = chart.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    if (x < PAD_L || x > chart.width - PAD_R) return;
    // Clicking a call (the whale's black bar or any hydrophone's bar for it) highlights it;
    // clicking anywhere else seeks.
    const tau = chart === freqChart ? emissionAt(chart, x, y) : null;
    if (tau !== null) {
      marked = tau;
      invalidateCharts();
    } else {
      seek(xToT(chart, x));
    }
  });
}

document.addEventListener("keydown", e => {
  const target = e.target as HTMLElement;
  if (e.key === " " && !["INPUT", "SELECT", "BUTTON", "TEXTAREA"].includes(target.tagName)) {
    e.preventDefault();
    setPlaying(!playing);
  }
});

new ResizeObserver(() => { layout(); render(); }).observe(mapCanvas.parentElement!);
// Entering or leaving full screen changes how tall the plots should be. The 3D view's height is
// reset first so that it doesn't keep the full-screen height when measured.
document.addEventListener("fullscreenchange", () => {
  view3dCanvas.style.height = "";
  requestAnimationFrame(() => { layout(); render(); });
});

// ⋘──────── Saved state ────────⋙
// The controls, dragged hydrophones, highlighted call, current time, and 3D view angles are saved
// in this browser, so a refreshed page comes back as it was left (but paused), along with the
// speaker choices.

const STATE_KEY = "hydrophone-array-state";
const SAVED_CONTROLS = [
  patternSelect, speedInput, distInput, countInput, spacingInput, depthsSelect, floorInput,
  depthInput, echoesSelect, surfaceInput, rateSelect,
];

// The state to start from: a configuration in the address (from a shared link) replaces the one
// saved in this browser, so the link opens exactly as it was shared.
const startState = decodeState(location.search) ?? loadJSON<Partial<SavedState>>(STATE_KEY);

let saveTimer = 0;
function saveState(): void {
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(saveNow, 300);
}
// Saves the state in this browser and in the page's address, so the address can be shared.
function saveNow(): void {
  clearTimeout(saveTimer);
  const state: SavedState = {
    controls: Object.fromEntries(SAVED_CONTROLS.map(el => [el.id, el.value])),
    loop: loopInput.checked,
    speakers: { left: leftSelect.value, right: rightSelect.value },
    phones: phonesMoved ? phones.map(ph => ({ ...ph })) : null,
    marked, now, view3d: { ...view3d },
  };
  saveJSON(STATE_KEY, state);
  replaceQuery(SHARE_KEYS, encodeState(state));
}

// Restores the starting state, checking each part, since it may come from an older version of the
// page or a hand-edited link.
function restoreState(): void {
  const saved = startState;
  if (!saved) return;
  const finite = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
  // The floor comes before the depth, since it sets the depth slider's maximum.
  for (const el of SAVED_CONTROLS) {
    const value = saved.controls?.[el.id];
    if (typeof value !== "string") continue;
    if (el instanceof HTMLSelectElement && !Array.from(el.options).some(o => o.value === value)) continue;
    if (el === depthInput) depthInput.max = floorInput.value;
    el.value = value;
  }
  if (typeof saved.loop === "boolean") loopInput.checked = saved.loop;
  setPattern(patternSelect.value);
  readParams();
  placePhones();
  const savedPhones = saved.phones;
  if (Array.isArray(savedPhones) && savedPhones.length === params.count
      && savedPhones.every(ph => finite(ph?.x) && finite(ph?.y) && finite(ph?.z))) {
    phones = savedPhones.map(ph => ({ x: ph.x, y: ph.y, z: clamp(ph.z, -params.surface, params.floor) }));
    phonesMoved = true;
    resetPhonesButton.hidden = false;
  }
  if (finite(saved.marked)) marked = saved.marked;
  if (finite(saved.now)) now = Math.max(0, saved.now);
  if (finite(saved.view3d?.yaw) && finite(saved.view3d?.pitch)) {
    view3d.yaw = saved.view3d.yaw;
    view3d.pitch = clamp(saved.view3d.pitch, -PITCH_LIMIT, PITCH_LIMIT);
  }
}

// Restores the speakers once their options (one per hydrophone) exist. Playback still waits for a
// click, since browsers don't let a page start sound on its own.
function restoreSpeakers(): void {
  const saved = startState?.speakers;
  for (const [select, value] of [[leftSelect, saved?.left], [rightSelect, saved?.right]] as const) {
    if (typeof value === "string" && Array.from(select.options).some(o => o.value === value)) select.value = value;
  }
}

// Saves after any change to a control or a click or drag in a view; the time while playing is
// saved when the page is left.
const whaleRoot = playButton.closest(".whale")!;
for (const type of ["input", "change", "pointerup", "click"]) whaleRoot.addEventListener(type, saveState);
window.addEventListener("pagehide", saveNow);
document.addEventListener("visibilitychange", () => { if (document.hidden) saveNow(); });

// "Copy link": the page's address, updated first so it holds the current time.
const copyButton   = $<HTMLButtonElement>("wh-copy-link");
const copyFeedback = $<HTMLElement>("wh-copy-feedback");
let copyTimer = 0;
copyButton.addEventListener("click", async () => {
  saveNow();
  const url = location.href;
  // If copying fails (or a browser leaves it waiting on a permission prompt), show the link to
  // copy by hand instead.
  const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 1500));
  try {
    await Promise.race([navigator.clipboard.writeText(url), timeout]);
    copyFeedback.textContent = "Copied a link to this configuration.";
  } catch {
    copyFeedback.textContent = `Copy this link: ${url}`;
  }
  copyFeedback.hidden = false;
  clearTimeout(copyTimer);
  copyTimer = window.setTimeout(() => { copyFeedback.hidden = true; }, 8000);
});

// ⋘──────── Help and pinning ────────⋙

setupHelp("wh");
// v2: the views from above and from the side became one panel, which shifted the others.
const PIN_KEY = "hydrophone-array-pinned-panels-v2";
const panels = setupPanels("wh", () =>
  saveJSON(PIN_KEY, panels.list.map((p, i) => (panels.isPinned(p) ? i : -1)).filter(i => i >= 0)));
for (const i of loadJSON<number[]>(PIN_KEY) ?? []) if (panels.list[i]) panels.setPinned(panels.list[i], true);

// ⋘──────── Start ────────⋙

setPattern(patternSelect.value);
readParams();
placePhones();
restoreState();
marked = snapToCall(marked);
updateGeometry();
timeSlider.max = String(tEnd);
now = Math.min(now, tEnd);
rebuildListenOptions();
restoreSpeakers();
buildReadout();
layout();
requestAnimationFrame(frame);
