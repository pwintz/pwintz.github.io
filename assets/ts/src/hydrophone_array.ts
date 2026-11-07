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

// ⋘──────── Constants ────────⋙

const C           = 1500;  // Speed of sound in seawater (m/s)
const SONG_END    = 24;    // The whale sings for emission times τ ∈ [0, SONG_END) (s)
const CPA_TIME    = 12;    // Emission time at which the whale is closest to the array's center (s)
const AUDIO_RATE  = 44100; // Sample rate of the rendered audio

// Categorical colors for the hydrophones, in fixed order.
const COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6", "#e34948"];
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
  continuous : { dur: SONG_END - 2 * PULSE_START, period: SONG_END },
};

let continuous  = false; // Whether the whale makes one continuous tone instead of separate calls
let pulseDur    = 0;     // Length of each call (s)
let pulsePeriod = 0;     // Time from the start of one call to the start of the next (s)
let nPulses     = 0;

function setPattern(name: string): void {
  ({ dur: pulseDur, period: pulsePeriod } = PATTERNS[name]);
  continuous = name === "continuous";
  nPulses = Math.ceil((SONG_END - PULSE_START - pulseDur) / pulsePeriod);
}
setPattern("short");

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
  if (tau < PULSE_START || tau >= SONG_END) return 0;
  const s = (tau - PULSE_START) % pulsePeriod;
  if (s >= pulseDur) return 0;
  const fade = Math.min(FADE, pulseDur / 4);
  const edge = Math.min(1, s / fade, (pulseDur - s) / fade);
  return 0.5 - 0.5 * Math.cos(Math.PI * edge);
}

// ⋘──────── Scenario and geometry ────────⋙
// The hydrophones start out spaced along the x-axis, centered at the origin, each at its own depth
// z below the whale's depth; dragging them moves them anywhere. The whale swims along the line
// y = distance (at depth 0) in the +x direction and passes x = 0 at emission time CPA_TIME.

interface Phone { x: number; y: number; z: number; } // Horizontal position and depth below the whale (m)

interface Params {
  speed    : number; // Whale speed (m/s)
  distance : number; // Distance from the array line to the whale's track (m)
  count    : number; // Number of hydrophones
  spacing  : number; // Distance between neighboring hydrophones (m)
  depths   : string; // How the hydrophones' depths are arranged (see hydrophoneDepth)
  depth    : number; // Greatest depth of a hydrophone below the whale (m)
}

const params: Params = { speed: 250, distance: 1200, count: 5, spacing: 400, depths: "level", depth: 600 };
let phones: Phone[] = [];
let tEnd = 30; // The last received time shown (s)

const whaleX = (tau: number) => params.speed * (tau - CPA_TIME);

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

// Depth of hydrophone i below the whale for each depth arrangement.
function hydrophoneDepth(i: number): number {
  const n = params.count, max = params.depth;
  switch (params.depths) {
    case "slope"     : return n === 1 ? max : (max * i) / (n - 1);
    case "alternate" : return i % 2 === 0 ? 0 : max;
    case "valley"    : return n === 1 ? max : max * (1 - Math.abs((2 * i) / (n - 1) - 1));
    case "scattered" : return max * SCATTER[i % SCATTER.length];
    default          : return 0; // "level": all at the whale's depth
  }
}
// Fixed "random" fractions of the maximum depth, so the scattered arrangement doesn't jump around.
const SCATTER = [0.55, 0.1, 0.85, 0.35, 1.0, 0.2, 0.7, 0.45];

// Places the hydrophones as set by the controls, discarding any dragging.
function placePhones(): void {
  phones = Array.from({ length: params.count }, (_, i) => ({
    x: (i - (params.count - 1) / 2) * params.spacing,
    y: 0,
    z: hydrophoneDepth(i),
  }));
}

function updateGeometry(): void {
  let maxDelay = 0;
  for (const ph of phones) {
    maxDelay = Math.max(maxDelay, distanceAt(ph, 0), distanceAt(ph, SONG_END));
  }
  tEnd = Math.ceil(SONG_END + maxDelay / C + 0.5);
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
const resetPhonesButton = $<HTMLButtonElement>("wh-reset-phones");
const readoutBody  = $<HTMLTableSectionElement>("wh-readout-body");
const tooltip      = $<HTMLDivElement>("wh-tooltip");

const mapCanvas     = $<HTMLCanvasElement>("wh-map");
const sideCanvas    = $<HTMLCanvasElement>("wh-side");
const freqCanvas    = $<HTMLCanvasElement>("wh-freq");
const delayCanvas   = $<HTMLCanvasElement>("wh-delay");

// ⋘──────── State ────────⋙

let now      = 13.3;     // Current received time (s); starts just after the highlighted call is made
let marked   = snapToCall(CPA_TIME); // Emission time of the highlighted call (s)
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

function layout(): void {
  mapWidth  = mapCanvas.clientWidth;
  mapHeight = Math.round(Math.min(440, Math.max(260, mapWidth * 0.5)));
  sizeCanvas(mapCanvas, mapWidth, mapHeight);

  // The side view is drawn at the map's scale when that fits, so that distances match.
  sideWidth  = sideCanvas.clientWidth;
  sideHeight = Math.round(Math.min(300, Math.max(120, SIDE_TOP + SIDE_BOTTOM + sideDepth() * mapView().scale)));
  sizeCanvas(sideCanvas, sideWidth, sideHeight);

  for (const chart of timeCharts) {
    chart.width  = chart.canvas.clientWidth;
    chart.height = chart === freqChart ? 300 : 220;
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
    for (const tau of [0, SONG_END]) {
      lo = Math.min(lo, dopplerFactor(ph, tau));
      hi = Math.max(hi, dopplerFactor(ph, tau));
    }
  }
  lo = Math.min(lo, 0.99);
  hi = Math.max(hi, 1.01);
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
    ctx.fillText(`${fmt(f, step < 1 ? 1 : 0)} Hz`, PAD_L - 6, y);
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

  // Each hydrophone: a thin curve for the Doppler-shifted frequency and bold segments where a call
  // is arriving, fading with distance.
  const ends: { i: number; y: number }[] = [];
  phones.forEach((ph, i) => {
    const samples: { x: number; y: number; amp: number }[] = [];
    let guess: number | undefined;
    for (let x = PAD_L; x <= right; x += 0.5) {
      const tau = emissionTime(ph, xToT(chart, x), guess);
      guess = tau;
      if (tau < 0 || tau > SONG_END) continue;
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
  for (const ph of phones) maxDelay = Math.max(maxDelay, distanceAt(ph, 0) / C, distanceAt(ph, SONG_END) / C);
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

  const ends: { i: number; y: number }[] = [];
  phones.forEach((ph, i) => {
    ctx.strokeStyle = COLORS[i];
    ctx.lineWidth = 2;
    ctx.beginPath();
    let started = false, lastY = 0;
    let guess: number | undefined;
    for (let x = PAD_L; x <= chart.width - PAD_R; x += 1) {
      const t = xToT(chart, x);
      const tau = emissionTime(ph, t, guess);
      guess = tau;
      if (tau < 0 || tau > SONG_END) { started = false; continue; }
      lastY = toY(t - tau);
      if (started) ctx.lineTo(x, lastY); else ctx.moveTo(x, lastY);
      started = true;
    }
    ctx.stroke();
    ends.push({ i, y: lastY });
  });
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
                          offset: number, maxR: number, highlighted: boolean): void {
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
    ctx.globalAlpha = (continuous ? 0.2 : 0.35) * Math.max(0.12, 1 - inPlane(C * (now - start)) / maxR);
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
      ctx.globalAlpha = 0.6 * Math.max(0.15, 1 - inPlane(r) / maxR);
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
  const halfW = Math.max(params.speed * CPA_TIME + 300, xMax + 400, params.distance * 1.3, 1500);
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
    if (tau < 0 || tau > SONG_END) return;
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
    drawPhoneMarker(ctx, sx(ph.x), sy(ph.y), i, ph.z < 0.5);
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
const sideDepth = () => Math.max(200, ...phones.map(ph => ph.z)) * 1.1; // Deepest depth shown (m)
let sideWidth = 0, sideHeight = 0;

let frozenSideScale: number | null = null; // The scale while a hydrophone is being dragged

function sideScale(): number {
  return frozenSideScale ?? Math.min(mapView().scale, (sideHeight - SIDE_TOP - SIDE_BOTTOM) / sideDepth());
}

function drawSide(): void {
  const ctx = context(sideCanvas);
  const scale = sideScale();
  const sx = (x: number) => sideWidth / 2 + x * scale;
  const sz = (z: number) => SIDE_TOP + z * scale;

  const water = ctx.createLinearGradient(0, 0, 0, sideHeight);
  water.addColorStop(0, "#e6f0f8");
  water.addColorStop(1, "#cfdfee");
  ctx.fillStyle = water;
  ctx.fillRect(0, 0, sideWidth, sideHeight);

  const maxR = Math.hypot(sideWidth, sideHeight) / scale;
  drawSoundInPlane(ctx, scale, x => [sx(x), sz(0)], params.distance, maxR, false);
  drawSoundInPlane(ctx, scale, x => [sx(x), sz(0)], params.distance, maxR, true);

  // Depth gridlines.
  const step = niceStep(1 / scale, 40);
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  for (let z = step; sz(z) < sideHeight - 4; z += step) {
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
  ctx.fillText(`Whale's depth (the whale swims ${params.distance} m in front of this plane)`, 6, sz(0) - 4);

  // Sound in flight, as in the map, but only drawn to where its path crosses this plane.
  phones.forEach((ph, i) => {
    const tau = emissionTime(ph, now);
    if (tau < 0 || tau > SONG_END) return;
    const audible = emittedAmp(tau) > 0.05;
    ctx.strokeStyle = COLORS[i];
    ctx.lineWidth = audible ? 1.75 : 1;
    ctx.globalAlpha = audible ? 0.9 : 0.35;
    ctx.setLineDash(audible ? [] : [3, 4]);
    ctx.beginPath(); ctx.moveTo(sx(whaleX(tau)), sz(0)); ctx.lineTo(sx(ph.x), sz(ph.z)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  });

  ctx.globalAlpha = 0.45;
  drawWhale(ctx, sx(whaleX(now)), sz(0), 1, emittedAmp(now) > 0.05);
  ctx.globalAlpha = 1;

  const roomy = params.spacing * scale >= 20;
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  phones.forEach((ph, i) => {
    drawPhoneMarker(ctx, sx(ph.x), sz(ph.z), i, Math.abs(ph.y) < 0.5);
    if (roomy || phonesMoved || i === 0 || i === params.count - 1) {
      ctx.fillStyle = INK;
      ctx.fillText(phoneName(i), sx(ph.x), sz(ph.z) + 9);
    }
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
    return [row.insertCell(), row.insertCell(), row.insertCell(), row.insertCell(), row.insertCell(), row.insertCell()];
  });
}

function updateReadout(): void {
  const taus = phones.map(ph => emissionTime(ph, now));
  const arrivalsOfMarked = phones.map(ph => marked + distanceAt(ph, marked) / C);
  const firstArrival = Math.min(...arrivalsOfMarked);
  phones.forEach((ph, i) => {
    const [depth, dist, delay, lag, shift, hearing] = readoutCells[i];
    const tau = taus[i];
    const inSong = tau >= 0 && tau <= SONG_END;
    const factor = dopplerFactor(ph, tau);
    depth.textContent = `${Math.round(ph.z)} m`;
    dist.textContent  = `${Math.round(distanceAt(ph, tau))} m`;
    delay.textContent = `${fmt(now - tau, 3)} s`;
    lag.textContent   = `${fmt(arrivalsOfMarked[i] - firstArrival, 3)} s`;
    shift.textContent = inSong ? `${signed(100 * (factor - 1), 2)}% (${signed(semitones(factor), 2)} semitones)` : "—";
    hearing.textContent = inSong && emittedAmp(tau) > 0.05
      ? `${fmt(TONE_FREQ * factor, 1)} Hz` : "silence";
  });
}

// ⋘──────── Audio ────────⋙
// The recording at one hydrophone is rendered sample by sample: y(t) = s(τ(t)) · d / D(τ(t)).
// The Doppler shift and delay come out of τ(t) on their own.

let audioCtx: AudioContext | null = null;
let audioSource: AudioBufferSourceNode | null = null;
let audioStart = { ctxTime: 0, t: 0 }; // Maps the audio clock to the simulation time
const channelCache = new Map<string, Float32Array<ArrayBuffer>>(); // Rendered recordings, by listener

// Renders what a listener ("whale" or a hydrophone index) hears over the whole simulation.
function renderChannel(listener: string): Float32Array<ArrayBuffer> {
  const cached = channelCache.get(listener);
  if (cached) return cached;
  const n = Math.ceil(tEnd * AUDIO_RATE);
  const data = new Float32Array(n);
  const ph = listener === "whale" ? null : phones[Number(listener)];
  let tau: number | undefined;
  for (let k = 0; k < n; k++) {
    const t = k / AUDIO_RATE;
    let gain = 1;
    if (ph === null) {
      tau = t;
    } else {
      tau = emissionTime(ph, t, tau);
      gain = loudness(ph, tau);
    }
    const amp = emittedAmp(tau);
    if (amp === 0) continue;
    // Near the speed of sound the pitch rises up to tenfold, so overtones that would go past the
    // highest frequency the sample rate can represent are left out to avoid aliasing.
    const heard = TONE_FREQ * (ph === null ? 1 : dopplerFactor(ph, tau));
    const phase = 2 * Math.PI * TONE_FREQ * tau;
    let wave = Math.sin(phase);
    if (2 * heard < 0.45 * AUDIO_RATE) wave += 0.3 * Math.sin(2 * phase);
    if (3 * heard < 0.45 * AUDIO_RATE) wave += 0.12 * Math.sin(3 * phase);
    data[k] = 0.45 * gain * amp * wave;
  }
  channelCache.set(listener, data);
  return data;
}

// A stereo buffer with one listener in each speaker ("off" leaves that speaker silent).
function renderAudio(ctx: AudioContext, left: string, right: string): AudioBuffer {
  const buffer = ctx.createBuffer(2, Math.ceil(tEnd * AUDIO_RATE), AUDIO_RATE);
  [left, right].forEach((listener, channel) => {
    if (listener !== "off") buffer.copyToChannel(renderChannel(listener), channel);
  });
  return buffer;
}

function stopAudio(): void {
  if (audioSource) {
    audioSource.onended = null;
    audioSource.stop();
    audioSource.disconnect();
    audioSource = null;
  }
}

// Starts the audio at the current time, if sound is on and playback is at normal speed.
function startAudio(): void {
  stopAudio();
  const left = leftSelect.value, right = rightSelect.value;
  const silent = left === "off" && right === "off";
  const realTime = Number(rateSelect.value) === 1;
  audioNote.hidden = silent || realTime;
  if (silent || !realTime || !playing) return;
  audioCtx ??= new AudioContext();
  void audioCtx.resume();
  const source = audioCtx.createBufferSource();
  source.buffer = renderAudio(audioCtx, left, right);
  const fade = audioCtx.createGain();
  fade.gain.setValueAtTime(0, audioCtx.currentTime);
  fade.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.03);
  source.connect(fade).connect(audioCtx.destination);
  source.start(0, now);
  audioSource = source;
  audioStart = { ctxTime: audioCtx.currentTime, t: now };
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
    if (audioSource && audioCtx) {
      now = audioStart.t + (audioCtx.currentTime - audioStart.ctxTime);
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
    const inSong = tau >= 0 && tau <= SONG_END;
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
  speedOut.textContent   = `${params.speed} m/s (${fmt(params.speed / C * 100, params.speed < 15 ? 2 : 1)}% of the speed of sound)`;
  distOut.textContent    = `${params.distance} m`;
  countOut.textContent   = String(params.count);
  spacingOut.textContent = `${params.spacing} m`;
  params.depths   = depthsSelect.value;
  params.depth    = Number(depthInput.value);
  depthOut.textContent   = `${params.depth} m`;
  depthInput.disabled    = params.depths === "level";
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
  readParams();
  if (rearrange) {
    placePhones();
    phonesMoved = false;
    resetPhonesButton.hidden = true;
  }
  updateGeometry();
  timeSlider.max = String(tEnd);
  now = Math.min(now, tEnd);
  if (countChanged) {
    rebuildListenOptions();
    buildReadout();
  }
  layout(); // The side view's height depends on the depths
  channelCache.clear();
  invalidateCharts();
  if (playing) startAudio();
}

for (const input of [speedInput, distInput]) {
  input.addEventListener("input", () => onParamsChanged(false));
}
for (const input of [countInput, spacingInput, depthInput, depthsSelect]) {
  input.addEventListener("input", () => onParamsChanged(true));
}
resetPhonesButton.addEventListener("click", () => onParamsChanged(true));

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-wh-speed]")) {
  button.addEventListener("click", () => {
    speedInput.value = button.dataset.whSpeed!;
    onParamsChanged(false);
  });
}

// ⋘──────── Dragging hydrophones ────────⋙
// In the map, dragging moves a hydrophone horizontally; in the side view, along the array and up
// or down. The views' scales are frozen during a drag so the hydrophone stays under the pointer.

interface Drag { index: number; }
let drag: Drag | null = null;
let phonesMoved = false; // Whether any hydrophone has been dragged from where the controls put it

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
  },
  side: {
    canvas: sideCanvas,
    toScreen: (ph: Phone): [number, number] => {
      const scale = sideScale();
      return [sideWidth / 2 + ph.x * scale, SIDE_TOP + ph.z * scale];
    },
    moveTo: (ph: Phone, px: number, py: number) => {
      const scale = sideScale();
      ph.x = clamp((px - sideWidth / 2) / scale, -20000, 20000);
      ph.z = clamp((py - SIDE_TOP) / scale, 0, 5000);
    },
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
  channelCache.clear();
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
  canvas.addEventListener("pointerdown", e => {
    const index = phoneAt(...pointer(e));
    if (index === null) return;
    frozenMapView = mapView();
    frozenSideScale = sideScale();
    drag = { index };
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
    e.preventDefault();
  });
  canvas.addEventListener("pointermove", e => {
    if (!drag) {
      canvas.style.cursor = phoneAt(...pointer(e)) === null ? "" : "grab";
      return;
    }
    view.moveTo(phones[drag.index], ...pointer(e));
    onPhonesMoved(false);
  });
  const drop = () => {
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
  channelCache.clear();
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

// ⋘──────── Start ────────⋙

setPattern(patternSelect.value);
marked = snapToCall(marked);
readParams();
placePhones();
updateGeometry();
timeSlider.max = String(tEnd);
rebuildListenOptions();
buildReadout();
layout();
requestAnimationFrame(frame);
