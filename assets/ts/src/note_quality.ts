// ╭───────────────────────────────────────────────────────────────╮
// │    Note Quality Analyzer: how steady, warm, and clean a note is    │
// ╰───────────────────────────────────────────────────────────────╯
// Listens to one note at a time and grades it on five aspects: the steadiness of its pitch and of
// its volume, its tone color (warm or thin), and the quality of its attack and its release. The
// analysis is in note_quality/; this file connects it to the page and draws the results.

import { midiToFreq, noteName, formatCents, centsOff } from "./audio/notes";
import { AudioInput } from "./audio/input";
import { BG, TEXT, MUTED, GRID, fitCanvas, placeholder, setupPanels, setupHelp, setupSavedControls, float32ToBase64, base64ToFloat32 } from "./audio/ui";
import { SampleBuffer, startCapture } from "./note_quality/capture";
import { NoteAnalyzer, type AnalyzerSettings, type NoiseCalibration } from "./note_quality/analyzer";
import { analyzeNote, START_DB, SETTLE_CENTS, type Aspect, type AttackPart, type Grade, type Instrument, type NoteReport } from "./note_quality/metrics";
import { WARMTH_LABELS, NOISE_BANDS, type TimbreProfile } from "./note_quality/timbre";
import { linearFit, median } from "./note_quality/stats";
import type { Hop, HopLog, Segmenter } from "./note_quality/segmenter";
import { ModulationAnalyzer, modulationPeak, STEP_HOPS, type ModulationSpectrum } from "./note_quality/vibrato";

// ⋘──────── Constants ────────⋙

const BUFFER_SECONDS = 12;  // Audio kept for the analysis
const LIVE_SECONDS   = 6;   // Time span of the live graphs
const PITCH_H        = 220; // Heights of the live graphs (px)
const VOLUME_H       = 170;
const VIBRATO_H      = 220;
const OVERTONES_H    = 300; // Height of the overtones graph (px)
const RECENT_NOTES   = 12;  // Notes listed under "Recent notes"
const HARMONIC_DB_MIN = -60; // Bottom of the overtones graph (dB)

const ATTACK_SHADE  = "rgba(249, 171, 0, 0.16)";
const SUSTAIN_SHADE = "rgba(52, 168, 83, 0.12)";
const RELEASE_SHADE = "rgba(66, 133, 244, 0.18)";
const CURRENT_SHADE = "rgba(255, 255, 255, 0.06)";
const PITCH_COLOR   = "#6ea8fe";
const LEVEL_COLOR   = "#d8dce2";
const IN_TUNE_COLOR = "rgba(52, 168, 83, 0.55)";
const GRADE_COLORS: Record<Grade, string> = { good: "#34a853", okay: "#f9ab00", work: "#d93025", info: "#4285f4" };
const GRADE_NAMES: Record<Grade, string> = { good: "Good", okay: "Okay", work: "Needs work", info: "" };

// ⋘──────── DOM ────────⋙

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const instrumentSelect = $<HTMLSelectElement>("nq-instrument");
const tonePitch    = $<HTMLInputElement>("nq-tone-pitch");
const tonePitchOut = $<HTMLOutputElement>("nq-tone-pitch-out");
const toneTimbre   = $<HTMLSelectElement>("nq-tone-timbre");
const toneStyle    = $<HTMLSelectElement>("nq-tone-style");
const toneAudible  = $<HTMLInputElement>("nq-tone-audible");
const toneLevel    = $<HTMLInputElement>("nq-tone-level");          // dB
const toneVibRate  = $<HTMLInputElement>("nq-tone-vibrato-rate");   // Hz
const toneVibWidth = $<HTMLInputElement>("nq-tone-vibrato-width");  // ± cents
const toneNotes    = $<HTMLSelectElement>("nq-tone-notes");          // "repeat" or "hold"
const pitchCanvas     = $<HTMLCanvasElement>("nq-pitch");
const volumeCanvas    = $<HTMLCanvasElement>("nq-volume");
const vibratoCanvas   = $<HTMLCanvasElement>("nq-vibrato");
const overtonesCanvas = $<HTMLCanvasElement>("nq-overtones");
const attacksCanvas   = $<HTMLCanvasElement>("nq-attacks");
const releasesCanvas  = $<HTMLCanvasElement>("nq-releases");
const reportTitle  = $<HTMLElement>("nq-report-title");
const reportMeta   = $<HTMLElement>("nq-report-meta");
const latestButton = $<HTMLButtonElement>("nq-latest");
const recentBody   = $<HTMLTableSectionElement>("nq-recent");
const recentEmpty  = $<HTMLElement>("nq-recent-empty");

// ⋘──────── Settings ────────⋙

const settings: AnalyzerSettings = { onsetDb: 15, minNoteSeconds: 0.25, a4: 440, instrument: "voice" };
const display = {
  memory    : 0.5, // Time constant of the fading of older values from the distributions (s)
  pitchRange: 200, // Half the height of the pitch graph's axis (cents)
  levelRange: 36,  // Range of the volume graph's axis (dB)
};

function readSettings(): void {
  settings.onsetDb        = Number($<HTMLInputElement>("nq-onset").value);
  settings.minNoteSeconds = Number($<HTMLInputElement>("nq-min-length").value);
  const a4 = Number($<HTMLInputElement>("nq-a4").value);
  if (a4 >= 300 && a4 <= 600) settings.a4 = a4;
  $<HTMLOutputElement>("nq-onset-out").value = `${settings.onsetDb} dB`;
  $<HTMLOutputElement>("nq-min-length-out").value = `${Math.round(1000 * settings.minNoteSeconds)} ms`;
  display.memory     = Number($<HTMLInputElement>("nq-memory").value);
  display.pitchRange = Number($<HTMLInputElement>("nq-pitch-range").value);
  display.levelRange = Number($<HTMLInputElement>("nq-level-range").value);
  $<HTMLOutputElement>("nq-memory-out").value = `${display.memory.toFixed(1)} s`;
  $<HTMLOutputElement>("nq-pitch-range-out").value = `±${display.pitchRange}¢`;
  $<HTMLOutputElement>("nq-level-range-out").value = `${display.levelRange} dB`;
  const midi = Number(tonePitch.value);
  tonePitchOut.value = `${noteName(midi)} ${formatCents(centsOff(midi))} (${midiToFreq(midi, settings.a4).toFixed(1)} Hz)`;
  $<HTMLOutputElement>("nq-tone-level-out").value = `${toneLevel.value} dB`;
  $<HTMLOutputElement>("nq-tone-vibrato-rate-out").value = `${Number(toneVibRate.value).toFixed(1)} Hz`;
  $<HTMLOutputElement>("nq-tone-vibrato-width-out").value = Number(toneVibWidth.value) ? `±${toneVibWidth.value}¢` : "none";
  $("nq-tone-vibrato-rate-label").hidden = !Number(toneVibWidth.value); // No rate without vibrato
}

// A new instrument changes the descriptions, so the notes so far are graded again.
function readInstrument(): void {
  settings.instrument = instrumentSelect.value as Instrument;
  reports = reports.map(r => {
    if (r.instrument === settings.instrument) return r;
    return analyzeNote(r.hops, r.frames, r.span, settings.instrument, r.before) ?? r;
  });
  if (selected) selected = reports.find(r => r.start === selected!.start) ?? null;
  showReport();
  showRecent();
}

// ⋘──────── Audio ────────⋙

let buffer: SampleBuffer | null = null;
let analyzer: NoteAnalyzer | null = null;

const input = new AudioInput("nq", {
  onContext(ctx, node) {
    buffer = new SampleBuffer(2 ** Math.ceil(Math.log2(BUFFER_SECONDS * ctx.sampleRate)));
    analyzer = new NoteAnalyzer(buffer, ctx.sampleRate, settings);
    applyCalibration();
    startCapture(ctx, node, buffer).catch((err: Error) =>
      input.setStatus(`This browser can't analyze audio on this page (${err.message}).`));
  },
  startTone,
});

// ⋘──────── Background noise ────────⋙
// Calibrating while it's quiet measures the background noise's level, which then decides when a
// sound is loud enough to be a note, and its spectrum, which is removed when measuring the noise
// in a note's tone. Without a calibration, both are estimated between notes. The calibration is
// saved in the browser and used again on later visits, as long as the sample rate is the same.

const NOISE_SECONDS     = 4;
const NOISE_STORAGE_KEY = "note_quality_noise";
const CALIBRATION_MISMATCH = "The background noise calibration was made with a different audio device, so it isn't being used. Recalibrate while it's quiet.";
const noiseButton      = $<HTMLButtonElement>("nq-noise");
const clearNoiseButton = $<HTMLButtonElement>("nq-noise-clear");
const noiseNote        = $<HTMLSpanElement>("nq-noise-note");
const micControls      = $<HTMLDetailsElement>("nq-mic-controls");
const noiseStatus      = $<HTMLParagraphElement>("nq-noise-status");
const noiseSummaryNote = $<HTMLSpanElement>("nq-noise-summary-note"); // The warning in the box's header, while it's collapsed

// Messages about calibrating are shown in the microphone's box.
function setNoiseStatus(message: string): void {
  noiseStatus.textContent = message;
  noiseStatus.hidden = !message;
}

let calibration: NoiseCalibration | null = null;

// Uses the calibration, if it was made with the current sample rate.
function applyCalibration(): void {
  if (analyzer) {
    const applies = analyzer.setCalibration(calibration);
    if (!applies) setNoiseStatus(CALIBRATION_MISMATCH);
    else if (noiseStatus.textContent === CALIBRATION_MISMATCH) setNoiseStatus("");
  }
  updateNoiseControls();
}

let countdown = 0; // Whole seconds of calibrating left, as last shown

function updateNoiseControls(): void {
  // The microphone's controls (including calibrating its background noise) are only for the microphone.
  micControls.hidden = input.source !== "mic";
  const busy = !!analyzer?.isCalibrating;
  noiseButton.disabled = busy;
  countdown = busy ? Math.ceil(analyzer!.calibrationRemaining) : 0;
  noiseButton.textContent = busy ? `Calibrating… ${countdown}` : calibration ? "Recalibrate background noise" : "Calibrate background noise";
  if (busy) setNoiseStatus(`Calibrating the background noise. Keep quiet for ${countdown} more second${countdown === 1 ? "" : "s"}.`);
  clearNoiseButton.hidden = !calibration || busy;
  // A calibration from an earlier visit is pointed out, in the box's header while it's collapsed.
  const previous = !!calibration && calibration.previous && !busy;
  noiseNote.hidden = !previous || !micControls.open;
  noiseSummaryNote.hidden = !previous || micControls.open;
  if (previous) {
    const when = new Date(calibration!.savedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
    noiseNote.textContent = noiseSummaryNote.textContent = `⚠ Using a calibration from ${when}`;
  }
}

function calibrateNoise(): void {
  if (!analyzer || !input.running || input.ctx?.state !== "running") {
    setNoiseStatus("Start the microphone first, then calibrate the background noise while it's quiet.");
    return;
  }
  if (input.frozen) input.setFrozen(false);
  analyzer.calibrate(NOISE_SECONDS, c => {
    calibration = c;
    saveCalibration();
    applyCalibration();
    setNoiseStatus("Background noise calibrated. It's now used to find notes and to measure the noise in each note.");
  });
  updateNoiseControls();
}

// Counts down the seconds left while calibrating.
function updateCountdown(): void {
  if (analyzer?.isCalibrating && Math.ceil(analyzer.calibrationRemaining) !== countdown) updateNoiseControls();
}

function clearNoise(): void {
  analyzer?.cancelCalibration();
  calibration = null;
  try {
    localStorage.removeItem(NOISE_STORAGE_KEY);
  } catch { /* Nothing saved */ }
  applyCalibration();
  setNoiseStatus("");
}

function saveCalibration(): void {
  const c = calibration!;
  const saved = { sampleRate: c.sampleRate, fftSize: c.fftSize, level: c.level, savedAt: c.savedAt, spectrum: float32ToBase64(c.spectrum) };
  try {
    localStorage.setItem(NOISE_STORAGE_KEY, JSON.stringify(saved));
  } catch { /* Not saved, for example if storage is full or unavailable */ }
}

function loadCalibration(): void {
  try {
    const saved = JSON.parse(localStorage.getItem(NOISE_STORAGE_KEY) ?? "null");
    if (!saved) return;
    calibration = {
      sampleRate: saved.sampleRate, fftSize: saved.fftSize, level: saved.level, savedAt: saved.savedAt,
      spectrum: base64ToFloat32(saved.spectrum), previous: true,
    };
  } catch { /* Nothing usable saved */ }
}

noiseButton.addEventListener("click", calibrateNoise);
micControls.addEventListener("toggle", updateNoiseControls);
clearNoiseButton.addEventListener("click", clearNoise);
// Changing the input stops a calibration in progress, since it would measure the wrong sound.
input.sourceSelect.addEventListener("change", () => {
  analyzer?.cancelCalibration();
  updateNoiseControls();
});

// ⋘──────── Test tone ────────⋙
// Repeating notes (or one held note) in a choice of styles, each showing something the analysis
// looks for, with adjustable vibrato. The pitch, level, and vibrato follow their sliders while
// the tone plays.

// Harmonic amplitudes (starting with the fundamental) of the test tone's timbres.
const TIMBRES: Record<string, number[]> = {
  sine  : [1],
  warm  : Array.from({ length: 16 }, (_, i) => 1 / (i + 1) ** 2),
  bright: Array.from({ length: 16 }, (_, i) => 1 / (i + 1)),
  thin  : [0.08, 0.3, 0.6, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2],
};

interface ToneStyle {
  attack: number; sustain: number; release: number; // s
  overshoot?: number;     // Extra gain at the start, which decays quickly
  scoop?: number;         // Cents the pitch starts away from the note
  sag?: number;           // Cents the pitch moves during the release
  wobble?: [number, number];  // Rate (Hz) and depth (cents) of a slow, unsteady swing of the pitch
  tremolo?: [number, number]; // Rate (Hz) and depth (fraction of the gain)
  breath?: number;        // Amplitude of high-pitched noise mixed into the tone
  rough?: number;         // Amplitude of the subharmonics (halfway between the harmonics)
}
const STYLES: Record<string, ToneStyle> = {
  clean   : { attack: 0.08, sustain: 1.2, release: 0.25 },
  hard    : { attack: 0.004, sustain: 1.2, release: 0.008, overshoot: 1.2 },
  scoop   : { attack: 0.25, sustain: 1.2, release: 0.35, scoop: -70, sag: -60 },
  unsteady: { attack: 0.08, sustain: 1.6, release: 0.25, wobble: [1.3, 18], tremolo: [2.2, 0.3] },
  breathy : { attack: 0.12, sustain: 1.4, release: 0.3, breath: 0.25 },
  rough   : { attack: 0.08, sustain: 1.4, release: 0.25, rough: 0.12 },
};
const TONE_GAP = 0.7; // Silence between notes (s)

function startTone(ctx: AudioContext, node: AudioNode): () => void {
  const amps = TIMBRES[toneTimbre.value];
  const wave = ctx.createPeriodicWave(new Float32Array(amps.length + 1), new Float32Array([0, ...amps]));
  const style = STYLES[toneStyle.value];

  const osc = ctx.createOscillator();
  osc.setPeriodicWave(wave);
  const env = ctx.createGain();
  env.gain.value = 0;
  const trem = ctx.createGain();
  const out = ctx.createGain();
  out.gain.value = toneAudible.checked ? 1 : 0;
  const level = ctx.createGain();
  level.gain.value = 10 ** (Number(toneLevel.value) / 20); // Periodic waves have a peak of 1
  osc.connect(env).connect(trem).connect(level);
  level.connect(node);
  level.connect(out).connect(ctx.destination);
  const sources: AudioScheduledSourceNode[] = [osc];

  // A rough tone has a second oscillator an octave lower, with only its odd harmonics, which fall
  // halfway between the tone's harmonics.
  const oscs: [OscillatorNode, number][] = [[osc, 1]]; // Each oscillator, and its frequency's ratio to the tone's
  if (style.rough) {
    const imag = new Float32Array(17);
    for (let n = 0; n < 8; n++) imag[2 * n + 1] = amps[n] ?? 0;
    const sub = ctx.createOscillator();
    // Periodic waves are scaled to a peak of 1, so the subharmonics' level is set by a gain.
    sub.setPeriodicWave(ctx.createPeriodicWave(new Float32Array(17), imag));
    const amount = ctx.createGain();
    amount.gain.value = style.rough;
    sub.connect(amount).connect(env);
    oscs.push([sub, 0.5]);
    sources.push(sub);
  }
  // A breathy tone has noise above 1 kHz, which follows the tone's envelope.
  if (style.breath) {
    const noise = ctx.createBufferSource();
    const data = new Float32Array(2 * ctx.sampleRate).map(() => Math.random() * 2 - 1);
    noise.buffer = ctx.createBuffer(1, data.length, ctx.sampleRate);
    noise.buffer.copyToChannel(data, 0);
    noise.loop = true;
    const highPass = ctx.createBiquadFilter();
    highPass.type = "highpass";
    highPass.frequency.value = 1000;
    const amount = ctx.createGain();
    amount.gain.value = style.breath * Math.max(...amps);
    noise.connect(highPass).connect(amount).connect(env);
    sources.push(noise);
  }

  // The notes are scheduled at the pitch the tone started at, and the pitch slider then shifts
  // every oscillator (and so the vibrato, the scoops, and the sags with it) by detuning.
  const base = Number(tonePitch.value), f = midiToFreq(base, settings.a4);
  const hzOfCents = (c: number) => f * (2 ** (c / 1200) - 1);

  // Vibrato, the wobble, and tremolo come from slow oscillators added to the pitch and the gain.
  const lfos: OscillatorNode[] = [];
  const swing = (rate: number, cents: number) => {
    const lfo = ctx.createOscillator(), depth = ctx.createGain();
    lfo.frequency.value = rate;
    depth.gain.value = hzOfCents(cents);
    lfo.connect(depth);
    for (const [o, ratio] of oscs) {
      const scaled = ctx.createGain();
      scaled.gain.value = ratio;
      depth.connect(scaled).connect(o.frequency);
    }
    lfos.push(lfo);
    return { lfo, depth };
  };
  const vibrato = swing(Number(toneVibRate.value), Number(toneVibWidth.value));
  if (style.wobble) swing(...style.wobble);
  if (style.tremolo) {
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = style.tremolo[0];
    depth.gain.value = style.tremolo[1];
    lfo.connect(depth).connect(trem.gain);
    lfos.push(lfo);
  }

  // A held note has an attack but no release, and lasts until the tone stops.
  const hold = toneNotes.value === "hold";
  let next = ctx.currentTime + 0.1;
  let timer = 0;
  const schedule = () => {
    const T = next;
    const cents = (c: number) => f * 2 ** (c / 1200);
    const Tr = T + style.attack + style.sustain, Te = Tr + style.release;
    for (const [o, ratio] of oscs) {
      o.frequency.setValueAtTime(ratio * cents(style.scoop ?? 0), T);
      if (style.scoop) o.frequency.linearRampToValueAtTime(ratio * f, T + 0.2);
      if (hold) continue;
      o.frequency.setValueAtTime(ratio * f, Tr);
      if (style.sag) o.frequency.linearRampToValueAtTime(ratio * cents(style.sag), Te);
    }

    env.gain.setValueAtTime(0, T);
    env.gain.linearRampToValueAtTime(1 + (style.overshoot ?? 0), T + style.attack);
    if (style.overshoot) env.gain.setTargetAtTime(1, T + style.attack, 0.03);
    if (hold) return;
    env.gain.setValueAtTime(1, Tr);
    env.gain.linearRampToValueAtTime(0, Te);

    next = Te + TONE_GAP;
    timer = window.setTimeout(schedule, Math.max(0, (next - ctx.currentTime - 0.3) * 1000));
  };
  schedule();
  sources.forEach(source => source.start());
  lfos.forEach(lfo => lfo.start());

  const audibleChanged = () => out.gain.setTargetAtTime(toneAudible.checked ? 1 : 0, ctx.currentTime, 0.02);
  toneAudible.addEventListener("change", audibleChanged);
  const slidersChanged = () => {
    const now = ctx.currentTime;
    for (const [o] of oscs) o.detune.setTargetAtTime(100 * (Number(tonePitch.value) - base), now, 0.02);
    level.gain.setTargetAtTime(10 ** (Number(toneLevel.value) / 20), now, 0.02);
    vibrato.lfo.frequency.setTargetAtTime(Number(toneVibRate.value), now, 0.02);
    vibrato.depth.gain.setTargetAtTime(hzOfCents(Number(toneVibWidth.value)), now, 0.02);
  };
  const sliders = [tonePitch, toneLevel, toneVibRate, toneVibWidth];
  sliders.forEach(el => el.addEventListener("input", slidersChanged));
  return () => {
    clearTimeout(timer);
    sliders.forEach(el => el.removeEventListener("input", slidersChanged));
    sources.forEach(source => source.stop());
    lfos.forEach(lfo => lfo.stop());
    level.disconnect();
    out.disconnect();
    toneAudible.removeEventListener("change", audibleChanged);
  };
}

for (const el of [toneTimbre, toneStyle, toneNotes]) el.addEventListener("change", () => input.restartTone());

// ⋘──────── Reports ────────⋙

let reports: NoteReport[] = [];       // Newest last
let selected: NoteReport | null = null; // The note whose report is shown, or null for the latest

const shownReport = () => selected ?? reports[reports.length - 1] ?? null;
const ASPECTS = ["pitch", "volume", "tone", "noise", "attack", "release"] as const;
const noteLabel = (r: NoteReport) => `${noteName(r.midi)} ${formatCents(100 * (r.midi - Math.round(r.midi)))}`;

function showReport(): void {
  const r = shownReport();
  latestButton.hidden = !selected;
  if (!r) return;
  reportTitle.textContent = noteLabel(r);
  const parts = [`${(r.end - r.start).toFixed(1)} s`, ({ voice: "voice", strings: "bowed strings", winds: "wind or brass" })[r.instrument]];
  if (selected) parts.push(`note ${reports.length - reports.indexOf(r)} back`);
  reportMeta.textContent = parts.join(" · ");
  for (const key of ASPECTS) fillCard($(`nq-card-${key}`), r[key]);
}

function fillCard(card: HTMLElement, aspect: Aspect): void {
  card.className = `nq-card nq-grade-${aspect.grade}`;
  const grade = card.querySelector<HTMLElement>(".nq-grade")!;
  grade.className = `nq-grade nq-grade-${aspect.grade}`;
  grade.textContent = GRADE_NAMES[aspect.grade];
  grade.hidden = !GRADE_NAMES[aspect.grade];
  card.querySelector(".nq-verdict")!.textContent = aspect.verdict;
  card.querySelector(".nq-detail")!.textContent = aspect.detail;
  const numbers = card.querySelector(".nq-numbers")!;
  numbers.replaceChildren(...aspect.numbers.flatMap(([label, value]) => {
    const dt = document.createElement("dt"), dd = document.createElement("dd");
    dt.textContent = label;
    dd.textContent = value;
    return [dt, dd];
  }));
}

function showRecent(): void {
  const shown = shownReport();
  recentEmpty.hidden = reports.length > 0;
  recentBody.replaceChildren(...reports.slice(-RECENT_NOTES).reverse().map(r => {
    const row = document.createElement("tr");
    row.setAttribute("aria-selected", String(r === shown));
    const cell = (text: string, grade?: Grade) => {
      const td = document.createElement("td");
      if (grade) {
        const dot = document.createElement("span");
        dot.className = `nq-dot nq-grade-${grade}`;
        td.append(dot);
      }
      td.append(text);
      row.append(td);
    };
    cell(noteLabel(r));
    cell(`${(r.end - r.start).toFixed(1)} s`);
    for (const key of ASPECTS) cell(r[key].verdict, r[key].grade);
    row.addEventListener("click", () => {
      selected = r === reports[reports.length - 1] ? null : r;
      showReport();
      showRecent();
    });
    return row;
  }));
}

latestButton.addEventListener("click", () => {
  selected = null;
  showReport();
  showRecent();
});

function addReports(added: NoteReport[]): void {
  if (!added.length) return;
  reports.push(...added);
  if (reports.length > RECENT_NOTES) reports = reports.slice(-RECENT_NOTES);
  if (selected && !reports.includes(selected)) selected = null;
  showReport();
  showRecent();
}

// ⋘──────── Live graphs ────────⋙
// The pitch, the volume, and the vibrato over the last LIVE_SECONDS, on the same time axis, with
// each note's attack, sustain, and release shaded.

const LIVE_PAD_L = 44, LIVE_PAD_R = 12, LIVE_PAD_T = 22, LIVE_AXIS_H = 18;
const SIDE_GAP = 10; // Space between each graph and the distribution to its right, which is a third of the graph's width (px)

interface LiveView {
  log    : HopLog;
  now    : number;       // Time of the newest hop (s)
  first  : number;       // Number of the oldest hop shown
  visible: NoteReport[]; // Notes that are at least partly shown
  seg    : Segmenter;
}

function liveView(): LiveView | null {
  if (!analyzer || analyzer.log.end === analyzer.log.first) return null;
  const log = analyzer.log, now = log.get(log.end - 1).t;
  return {
    log, now,
    first  : Math.max(log.first, log.end - Math.ceil(LIVE_SECONDS / 0.005) - 2),
    visible: reports.filter(r => r.releaseEnd > now - LIVE_SECONDS),
    seg    : analyzer.segmenter,
  };
}

// Draws a live graph's frame: the shading of the notes between `top` and `bottom`, and the time
// axis below. Returns the horizontal scale and where the distribution goes, or null (after
// drawing a placeholder) if there's nothing to show yet.
function liveFrame(ctx: CanvasRenderingContext2D, w: number, h: number, v: LiveView | null, top: number, bottom: number):
    { L: number; R: number; xOf: (t: number) => number; side: [number, number] } | null {
  if (!v) {
    placeholder(ctx, w, h, input.running ? "Play or sing a note" : "Start an input to see the sound");
    return null;
  }
  const sideWidth = (w - LIVE_PAD_L - LIVE_PAD_R - SIDE_GAP) / 4;
  const L = LIVE_PAD_L, R = w - LIVE_PAD_R - sideWidth - SIDE_GAP;
  const side: [number, number] = [R + SIDE_GAP, w - LIVE_PAD_R];
  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.fillRect(side[0], top, side[1] - side[0], bottom - top);
  const xOf = (t: number) => R - (v.now - t) / LIVE_SECONDS * (R - L);
  ctx.save();
  ctx.beginPath();
  ctx.rect(L, top, R - L, bottom - top);
  ctx.clip();
  const shade = (t0: number, t1: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(xOf(t0), top, xOf(t1) - xOf(t0), bottom - top);
  };
  for (const r of v.visible) {
    shade(r.start, r.attackEnd, ATTACK_SHADE);
    shade(r.attackEnd, r.releaseStart, SUSTAIN_SHADE);
    shade(r.releaseStart, r.releaseEnd, RELEASE_SHADE);
  }
  if (v.seg.inNote && v.log.has(v.seg.noteStart)) shade(v.log.get(v.seg.noteStart).t, v.now, CURRENT_SHADE);
  ctx.restore();

  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = MUTED;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let s = 0; s <= LIVE_SECONDS; s++) ctx.fillText(s === 0 ? "now" : `−${s} s`, xOf(v.now - s), h - LIVE_AXIS_H + 4);
  return { L, R, xOf, side };
}

// ⋘──── Distributions ────⋙
// Beside each graph, the distribution of its recent values, on the same vertical axis: a
// histogram smoothed with a Gaussian kernel, in which each value counts less the older it is.

// Each distribution is colored by how good it is, as described below it.
const PITCH_WOBBLE = [5, 12];   // Pitch's RMS movement within notes (cents, not counting vibrato): up to the first is steady
const LEVEL_SPREAD = [1, 2.5];  // Level's standard deviation over the steady parts of notes (dB)
const VIBRATO_EVEN = [0.75, 0.5]; // Share of the pitch's movement in the vibrato's peak: at least the first is even
const IN_TUNE_CENTS = 5;        // The in-tune zone beside the pitch graph is ± this
const PITCH_FULL_SPREAD = 4;    // A pitch distribution this narrow (cents), with all the weight, fills the width
const LEVEL_FULL_SPREAD = 0.5;  // …and a volume distribution this narrow (dB)

interface Sample { value: number; weight: number; }
interface Quality { grade: Grade; text: string; }

const gradeBy = (x: number, [good, okay]: number[], words: [string, string, string]): Quality =>
  x <= good ? { grade: "good", text: words[0] } : x <= okay ? { grade: "okay", text: words[1] } : { grade: "work", text: words[2] };

const decayWeight = (now: number, t: number) => Math.exp(-(now - t) / display.memory);

// Draws the distribution of the samples between x0 and x1, from `top` to `bottom`, where yOf
// places a value and `bandwidth` is the kernel's width (px). A density of `full` fills the width
// (larger densities are cut off), so a distribution that's spread out draws short. It's colored
// by `grade`, and drawn with the given opacity. Returns the y of its peak, or NaN.
function drawDistribution(ctx: CanvasRenderingContext2D, [x0, x1]: [number, number], top: number, bottom: number,
    samples: Sample[], yOf: (value: number) => number, bandwidth: number,
    { grade = "info", full, opacity = 1 }: { grade?: Grade; full: number; opacity?: number }): number {
  const rows = Math.ceil(bottom - top);
  const hist = new Float64Array(rows);
  for (const { value, weight } of samples) {
    const r = Math.floor(yOf(value) - top);
    if (r >= 0 && r < rows) hist[r] += weight;
  }
  const bw = Math.max(0.75, bandwidth), reach = Math.ceil(3 * bw);
  const kernel = Array.from({ length: 2 * reach + 1 }, (_, k) => Math.exp(-0.5 * ((k - reach) / bw) ** 2));
  const density = new Float64Array(rows);
  for (let i = 0; i < rows; i++) {
    if (!hist[i]) continue;
    for (let k = -reach; k <= reach; k++) if (i + k >= 0 && i + k < rows) density[i + k] += hist[i] * kernel[k + reach];
  }
  let peak = 0;
  for (let i = 1; i < rows; i++) if (density[i] > density[peak]) peak = i;
  if (!(density[peak] > 0)) return NaN;

  ctx.beginPath();
  ctx.moveTo(x0, top);
  for (let i = 0; i < rows; i++) ctx.lineTo(x0 + Math.min(1, density[i] / full) * (x1 - x0 - 2), top + i + 0.5);
  ctx.lineTo(x0, bottom);
  ctx.closePath();
  ctx.fillStyle = GRADE_COLORS[grade];
  ctx.globalAlpha = 0.3 * opacity;
  ctx.fill();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = GRADE_COLORS[grade];
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.globalAlpha = 1;
  return top + peak + 0.5;
}

// The pitch and volume distributions have a fixed scale. A continuous sound builds up a total
// weight of fullWeight() (the sum of the weights of a hop every HOP_SECONDS), and the width is
// filled by a distribution with all of that weight that's as narrow as `spread`. The opacity is
// the share of that weight present, so a distribution fades away once the sound stops.

function fullWeight(): number {
  const hop = analyzer ? analyzer.hopSize / analyzer.sampleRate : 0.005;
  return 1 / (1 - Math.exp(-hop / display.memory));
}

// The density (as drawDistribution computes it, with a kernel of `bandwidth` px) that fills the
// width: all the weight in a Gaussian of `spread` px.
function fullDensity(bandwidth: number, spread: number): number {
  const bw = Math.max(0.75, bandwidth);
  return fullWeight() * bw / Math.hypot(bw, spread);
}

const opacityOf = (samples: Sample[]) => Math.min(1, samples.reduce((sum, s) => sum + s.weight, 0) / fullWeight());

// Weighted standard deviation of the samples' values.
function spread(samples: Sample[]): number {
  let w = 0, m = 0;
  for (const s of samples) { w += s.weight; m += s.weight * s.value; }
  if (!(w > 0)) return NaN;
  m /= w;
  let v = 0;
  for (const s of samples) v += s.weight * (s.value - m) ** 2;
  return Math.sqrt(v / w);
}

// Marks the distribution's peak with a line and a label above it, and writes its spread and
// quality below the distribution (in the time axis's row).
function markDistribution(ctx: CanvasRenderingContext2D, [x0, x1]: [number, number], peakY: number, label: string,
    spreadText: string, spreadY: number, quality?: Quality): void {
  ctx.font = "10px system-ui, sans-serif";
  ctx.textAlign = "right";
  if (Number.isFinite(peakY)) {
    ctx.strokeStyle = TEXT;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, peakY);
    ctx.lineTo(x1, peakY);
    ctx.stroke();
    ctx.fillStyle = TEXT;
    ctx.textBaseline = "bottom";
    ctx.fillText(label, x1, peakY - 2);
  }
  ctx.textBaseline = "top";
  let x = x1;
  if (quality) {
    ctx.fillStyle = GRADE_COLORS[quality.grade];
    ctx.font = "bold 10px system-ui, sans-serif";
    ctx.fillText(quality.text, x, spreadY);
    x -= ctx.measureText(quality.text).width + 6;
    ctx.font = "10px system-ui, sans-serif";
  }
  if (spreadText) {
    ctx.fillStyle = MUTED;
    ctx.fillText(spreadText, x, spreadY);
  }
}

// Horizontal gridlines at the given values, labeled at the left.
function gridlines(ctx: CanvasRenderingContext2D, L: number, R: number, lines: { y: number; label: string; color?: string; labelColor?: string }[]): void {
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (const { y, label, color, labelColor } of lines) {
    ctx.strokeStyle = color ?? GRID;
    ctx.beginPath();
    ctx.moveTo(L, y);
    ctx.lineTo(R, y);
    ctx.stroke();
    ctx.fillStyle = labelColor ?? MUTED;
    ctx.fillText(label, L - 6, y);
  }
}

function readout(ctx: CanvasRenderingContext2D, R: number, top: number, text: string): void {
  ctx.fillStyle = TEXT;
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText(text, R - 2, top - 18);
}

// ⋘──── Pitch ────⋙
// The pitch axis is a window onto the pitches that follows the note being played. Its center is
// pulled toward the median pitch of the last moment, which spans a couple of vibrato cycles so
// that vibrato doesn't move it, and it stays put while that pitch is near its center.

const PITCH_DEAD_CENTS     = 30;   // The axis doesn't move while the pitch stays this close to its center
const PITCH_FOLLOW_SECONDS = 0.4;  // The axis follows the median pitch over this long
const PITCH_PULL_SECONDS   = 0.35; // Time constant of the axis being pulled along
const PITCH_MIN_CLEAR      = 10;   // Clear hops needed to move the axis (about 50 ms)
const PITCH_JOIN           = 0.5;  // Pitches further apart than this (semitones) in consecutive hops aren't joined
const PITCH_KERNEL_CENTS   = 3;    // Width of the pitch distribution's kernel
let pitchViewCenter = NaN; // MIDI
let pitchViewTime   = 0;   // When the axis was last moved (s, from the page's clock)

function updatePitchView(log: HopLog, now: number): void {
  const wall = performance.now() / 1000, dt = Math.min(0.1, wall - pitchViewTime);
  pitchViewTime = wall;
  const recent: number[] = [];
  for (let i = log.end - 1; i >= log.first; i--) {
    const hop = log.get(i);
    if (hop.t < now - PITCH_FOLLOW_SECONDS) break;
    if (hop.clarity >= 0.8 && Number.isFinite(hop.midi)) recent.push(hop.midi);
  }
  if (recent.length < PITCH_MIN_CLEAR) return;
  const target = median(recent);
  if (!Number.isFinite(pitchViewCenter)) {
    pitchViewCenter = target;
    return;
  }
  const dead = PITCH_DEAD_CENTS / 100;
  const excess = target - Math.min(pitchViewCenter + dead, Math.max(pitchViewCenter - dead, target));
  pitchViewCenter += excess * (1 - Math.exp(-dt / PITCH_PULL_SECONDS));
}

function drawPitch(v: LiveView | null, vib: VibratoNow | null): void {
  const { ctx, w, h } = fitCanvas(pitchCanvas, PITCH_H);
  const top = LIVE_PAD_T, bottom = h - LIVE_AXIS_H;
  const frame = liveFrame(ctx, w, h, v, top, bottom);
  if (!v || !frame) return;
  const { L, R, xOf, side } = frame;
  updatePitchView(v.log, v.now);
  const center = Number.isFinite(pitchViewCenter) ? pitchViewCenter : 69;
  const pxPerSemitone = (bottom - top) / 2 / (display.pitchRange / 100);
  const yMidi = (m: number) => (top + bottom) / 2 - (m - center) * pxPerSemitone;
  const midiAt = (y: number) => center + ((top + bottom) / 2 - y) / pxPerSemitone;

  // A line in tune with each note, labeled with its name, and fainter lines halfway between.
  const span = display.pitchRange / 100;
  const lines = [];
  for (let q = Math.ceil(2 * (center - span)); q <= Math.floor(2 * (center + span)); q++) {
    const isNote = q % 2 === 0;
    lines.push({ y: yMidi(q / 2), label: isNote ? noteName(q / 2) : "", color: isNote ? IN_TUNE_COLOR : GRID, labelColor: TEXT });
  }
  gridlines(ctx, L, R, lines);

  // The pitch, dimmer where it's less clear.
  ctx.save();
  ctx.beginPath();
  ctx.rect(L, top, R - L, bottom - top);
  ctx.clip();
  ctx.lineWidth = 2;
  ctx.strokeStyle = PITCH_COLOR;
  let prev: { x: number; y: number; midi: number } | null = null;
  for (let i = v.first; i < v.log.end; i++) {
    const hop = v.log.get(i);
    if (!Number.isFinite(hop.midi) || hop.clarity < 0.6) { prev = null; continue; }
    const x = xOf(hop.t), y = yMidi(hop.midi);
    if (prev && Math.abs(hop.midi - prev.midi) <= PITCH_JOIN) {
      ctx.globalAlpha = 0.25 + 0.75 * Math.max(0, (hop.clarity - 0.6) / 0.4);
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    prev = { x, y, midi: hop.midi };
  }
  ctx.restore();

  // The distribution of the recent clear pitches, beside the in-tune zone of each note. Its color
  // shows how steady the pitch is, from its movement within notes (see vibratoNow), so it doesn't
  // depend on how well the notes are tuned or on changes from one note to another.
  ctx.save();
  ctx.beginPath();
  ctx.rect(side[0], top, side[1] - side[0], bottom - top);
  ctx.clip();
  ctx.fillStyle = "rgba(52, 168, 83, 0.18)";
  for (let m = Math.ceil(center - span - 1); m <= center + span + 1; m++) {
    ctx.fillRect(side[0], yMidi(m + IN_TUNE_CENTS / 100), side[1] - side[0], 2 * IN_TUNE_CENTS / 100 * pxPerSemitone);
  }
  ctx.restore();
  const samples: Sample[] = [];
  for (let i = v.first; i < v.log.end; i++) {
    const hop = v.log.get(i);
    if (hop.clarity >= 0.8 && Number.isFinite(hop.midi)) samples.push({ value: hop.midi, weight: decayWeight(v.now, hop.t) });
  }
  const wobble = vib?.wobble ?? NaN;
  const quality = Number.isFinite(wobble) ? gradeBy(wobble, PITCH_WOBBLE, ["steady", "wavering", "unsteady"]) : undefined;
  const bandwidth = PITCH_KERNEL_CENTS / 100 * pxPerSemitone;
  const opacity = opacityOf(samples);
  const peakY = drawDistribution(ctx, side, top, bottom, samples, yMidi, bandwidth,
    { grade: quality?.grade, full: fullDensity(bandwidth, PITCH_FULL_SPREAD / 100 * pxPerSemitone), opacity });
  const peak = midiAt(peakY);
  ctx.globalAlpha = opacity;
  markDistribution(ctx, side, peakY, Number.isFinite(peak) ? `${noteName(peak)} ${formatCents(centsOff(peak))}` : "",
    Number.isFinite(wobble) ? `wobble ${wobble.toFixed(0)}¢` : "", h - LIVE_AXIS_H + 4, quality);
  ctx.globalAlpha = 1;

  // Note names above each note.
  ctx.fillStyle = TEXT;
  ctx.font = "bold 12px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  const labels = v.visible.map(r => ({ t: r.start, midi: r.midi }));
  if (v.seg.inNote && v.log.has(v.seg.noteStart)) {
    const clear = v.log.slice(v.seg.noteStart, v.log.end).filter(h => h.clarity >= 0.8 && Number.isFinite(h.midi));
    if (clear.length) labels.push({ t: v.log.get(v.seg.noteStart).t, midi: median(clear.map(h => h.midi)) });
  }
  for (const { t, midi } of labels) {
    const x = Math.max(L, xOf(t));
    if (x < R - 30) ctx.fillText(noteName(midi), x + 2, top - 4);
  }
}

// ⋘──── Volume ────⋙
// The volume axis is zoomed in, so that the small changes within a note are visible. Its top
// follows the loudest level shown: up at once, and down gradually. The level is lightly smoothed,
// by averaging the power over a few hops on either side.

const LEVEL_GRID   = 6;    // dB between the volume axis's gridlines
const LEVEL_EASE   = 0.05; // How quickly the volume axis comes down after a loud sound (per frame)
const LEVEL_SMOOTH = 3;    // Hops on either side that each level is averaged with (about 15 ms)
const LEVEL_KERNEL = 0.5;  // Width of the volume distribution's kernel (dB)
const LEVEL_SETTLE = 0.15; // The note that's sounding counts in the distribution after this long (s)…
const LEVEL_NEAR_PEAK = 6; // …while it's within this many dB of its loudest so far (not while it fades)
let levelAxisTop = 0; // dB

function smoothedLevels(log: HopLog, first: number): number[] {
  const power: number[] = [];
  for (let i = first; i < log.end; i++) power.push(10 ** (log.get(i).level / 10));
  return power.map((_, i) => {
    const lo = Math.max(0, i - LEVEL_SMOOTH), hi = Math.min(power.length - 1, i + LEVEL_SMOOTH);
    let sum = 0;
    for (let j = lo; j <= hi; j++) sum += power[j];
    return 10 * Math.log10(sum / (hi - lo + 1));
  });
}

function drawVolume(v: LiveView | null): void {
  const { ctx, w, h } = fitCanvas(volumeCanvas, VOLUME_H);
  const top = LIVE_PAD_T, bottom = h - LIVE_AXIS_H;
  const frame = liveFrame(ctx, w, h, v, top, bottom);
  if (!v || !frame) return;
  const { L, R, xOf, side } = frame;
  const levels = smoothedLevels(v.log, v.first);

  const span = display.levelRange;
  const target = Math.min(LEVEL_GRID, Math.max(-100 + span, Math.ceil((Math.max(...levels) + 2) / LEVEL_GRID) * LEVEL_GRID));
  levelAxisTop = target >= levelAxisTop ? target : levelAxisTop + (target - levelAxisTop) * LEVEL_EASE;
  const dbTop = levelAxisTop, dbBottom = dbTop - span;
  const yLevel = (db: number) => top + (dbTop - Math.min(dbTop, Math.max(dbBottom, db))) / span * (bottom - top);

  const lines = [];
  for (let db = Math.floor(dbTop / LEVEL_GRID) * LEVEL_GRID; db >= dbBottom; db -= LEVEL_GRID) lines.push({ y: yLevel(db), label: `${db} dB` });
  gridlines(ctx, L, R, lines);

  ctx.save();
  ctx.beginPath();
  ctx.rect(L, top, R - L, bottom - top);
  ctx.clip();
  // The noise level (dashed) and the level that starts a note (dotted).
  if (Number.isFinite(v.seg.floor)) {
    ctx.strokeStyle = MUTED;
    for (const [level, dash] of [[v.seg.floor, [5, 4]], [v.seg.onsetLevel, [1, 3]]] as [number, number[]][]) {
      ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.moveTo(L, yLevel(level));
      ctx.lineTo(R, yLevel(level));
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }
  ctx.strokeStyle = LEVEL_COLOR;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  levels.forEach((db, i) => {
    const x = xOf(v.log.get(v.first + i).t), y = yLevel(db);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.restore();

  // The distribution of the recent levels in the steady parts of notes (not their attacks or
  // releases, or the silence between notes). The note that's sounding hasn't been split into its
  // parts yet, so it counts after its first moments, while it's near its loudest so far.
  const sustains = v.visible.map(r => [r.attackEnd, r.releaseStart]);
  const current = v.seg.inNote && v.log.has(v.seg.noteStart) ? v.log.get(v.seg.noteStart).t + LEVEL_SETTLE : Infinity;
  let currentPeak = -Infinity;
  const samples: Sample[] = [];
  levels.forEach((db, i) => {
    const hop = v.log.get(v.first + i);
    if (hop.t >= current) currentPeak = Math.max(currentPeak, db);
    const steady = sustains.some(([a, b]) => hop.t >= a && hop.t <= b)
      || (hop.t >= current && hop.level >= v.seg.onsetLevel && db >= currentPeak - LEVEL_NEAR_PEAK);
    if (steady) samples.push({ value: db, weight: decayWeight(v.now, hop.t) });
  });
  const pxPerDb = (bottom - top) / span;
  const sd = spread(samples);
  const quality = Number.isFinite(sd) ? gradeBy(sd, LEVEL_SPREAD, ["even", "uneven", "very uneven"]) : undefined;
  const opacity = opacityOf(samples);
  const peakY = drawDistribution(ctx, side, top, bottom, samples, yLevel, LEVEL_KERNEL * pxPerDb,
    { grade: quality?.grade, full: fullDensity(LEVEL_KERNEL * pxPerDb, LEVEL_FULL_SPREAD * pxPerDb), opacity });
  ctx.globalAlpha = opacity;
  markDistribution(ctx, side, peakY, `${(dbTop - (peakY - top) / pxPerDb).toFixed(0)} dB`,
    Number.isFinite(sd) ? `σ ${sd.toFixed(1)} dB` : "", h - LIVE_AXIS_H + 4, quality);
  ctx.globalAlpha = 1;

  const latest = levels[levels.length - 1];
  readout(ctx, R, top, latest > -100 ? `${latest.toFixed(0)} dB` : "silent");
}

// ⋘──── Vibrato ────⋙
// A modulation spectrogram: for each moment, how strongly the pitch oscillates at each rate (from
// note_quality/vibrato.ts), as brightness. Steady vibrato makes a bright horizontal band at its
// rate. Each spectrum covers the second before it, so it's drawn half a second back, at its
// middle. Beside it is the recent spectrum, an average of the spectra weighted like the
// distributions.

const MOD_AXIS        = [1, 12];   // Range of the modulation rates shown (Hz)
const VIBRATO_TYPICAL = [4.5, 7];  // Range of typical vibrato rates, marked (Hz)
const VIBRATO_RANGE   = [3, 9];    // Rates that count as vibrato (Hz)
const VIBRATO_MIN_EXTENT = 5;      // A smaller peak isn't reported as vibrato (cents)
const MOD_MIN_SCALE   = 20;        // Least amplitude (cents) at the top of the color scale
// Colors from no oscillation to the most, as [position, r, g, b].
const MOD_COLORS: [number, number, number, number][] = [
  [0, 18, 20, 23], [0.2, 38, 52, 120], [0.45, 33, 128, 156], [0.7, 92, 190, 100], [1, 250, 228, 80],
];
let modulation: ModulationAnalyzer | null = null;
let modScale = MOD_MIN_SCALE; // Amplitude at the top of the color scale, which follows the largest shown
const modImage = document.createElement("canvas");

function modColor(x: number): [number, number, number] {
  const c = Math.min(1, Math.max(0, x));
  const j = MOD_COLORS.findIndex(([p]) => p >= c);
  if (j <= 0) return [MOD_COLORS[0][1], MOD_COLORS[0][2], MOD_COLORS[0][3]];
  const [p0, r0, g0, b0] = MOD_COLORS[j - 1], [p1, r1, g1, b1] = MOD_COLORS[j];
  const f = (c - p0) / (p1 - p0);
  return [r0 + (r1 - r0) * f, g0 + (g1 - g0) * f, b0 + (b1 - b0) * f];
}

// The spectra shown, and the recent spectrum (weighted like the distributions) with its peak, if
// it's large enough to be vibrato, and the evenness of the vibrato: how much of all of the
// pitch's movement the peak accounts for. The pitch's wobble is the RMS of its recent movement
// within the spectra's windows (each with its straight-line trend removed, and none spanning a
// change of note) without the vibrato, whose swing of ±A cents accounts for A²/2 of the power.
interface VibratoNow {
  spectra: (ModulationSpectrum | null)[];
  binHz  : number;
  recent : Float64Array | null;
  peak   : { rate: number; extent: number } | null;
  quality: Quality;
  wobble : number; // Cents, or NaN if there's no recent spectrum
}

function vibratoNow(v: LiveView): VibratoNow | null {
  if (!analyzer) return null;
  modulation ??= new ModulationAnalyzer(analyzer.hopSize / analyzer.sampleRate);
  // Each spectrum is drawn at the middle of its window, so the spectra reach back half a window
  // before the graph's left edge.
  const spectra = modulation.spectra(v.log, v.first - Math.ceil(modulation.windowHops / 2));
  const valid = spectra.filter(s => s) as ModulationSpectrum[];
  const none: Quality = { grade: "info", text: "none" };
  if (!valid.length) return { spectra, binHz: modulation.binHz, recent: null, peak: null, quality: none, wobble: NaN };
  const recent = new Float64Array(valid[0].amps.length);
  let weight = 0, power = 0;
  for (const s of valid) {
    const wgt = decayWeight(v.now, s.t);
    weight += wgt;
    power += wgt * s.swing ** 2 / 2;
    for (let k = 0; k < recent.length; k++) recent[k] += wgt * s.amps[k];
  }
  for (let k = 0; k < recent.length; k++) recent[k] /= weight;
  power /= weight;
  const swing = Math.sqrt(2 * power);
  const found = modulationPeak(recent, modulation.binHz, VIBRATO_RANGE[0], VIBRATO_RANGE[1]);
  if (found.extent < VIBRATO_MIN_EXTENT) {
    return { spectra, binHz: modulation.binHz, recent, peak: null, quality: none, wobble: Math.sqrt(power) };
  }
  const wobble = Math.sqrt(Math.max(0, power - found.extent ** 2 / 2));
  // Graded on its evenness alone; a rate outside the typical range is named but not counted against it.
  const evenness = Math.min(1, found.extent / swing);
  const speed = found.rate < VIBRATO_TYPICAL[0] ? "slow, " : found.rate > VIBRATO_TYPICAL[1] ? "fast, " : "";
  const quality: Quality =
    evenness < VIBRATO_EVEN[1] ? { grade: "work", text: `${speed}uneven` }
    : evenness < VIBRATO_EVEN[0] ? { grade: "okay", text: `${speed}uneven` }
    : { grade: "good", text: `${speed}even` };
  return { spectra, binHz: modulation.binHz, recent, peak: found, quality, wobble };
}

function drawVibrato(v: LiveView | null, vib: VibratoNow | null): void {
  const { ctx, w, h } = fitCanvas(vibratoCanvas, VIBRATO_H);
  const top = LIVE_PAD_T, bottom = h - LIVE_AXIS_H;
  const frame = liveFrame(ctx, w, h, v, top, bottom);
  if (!v || !frame || !analyzer || !vib) return;
  const { L, R, xOf, side } = frame;
  const { binHz, spectra, recent, peak } = vib;
  const [fLo, fHi] = MOD_AXIS;
  const yRate = (f: number) => bottom - (f - fLo) / (fHi - fLo) * (bottom - top);
  const kLo = Math.floor(fLo / binHz), kHi = Math.ceil(fHi / binHz);

  // The spectrogram, drawn as an image with one column per spectrum and one row per bin.
  let largest = 0;
  for (const s of spectra) if (s) for (let k = kLo; k <= kHi; k++) largest = Math.max(largest, s.amps[k]);
  const target = Math.max(MOD_MIN_SCALE, largest);
  modScale = target > modScale ? target : modScale + (target - modScale) * 0.05;
  const valid = spectra.filter(s => s) as ModulationSpectrum[];
  if (valid.length) {
    const cols = spectra.length, rows = kHi - kLo + 1;
    modImage.width = cols;
    modImage.height = rows;
    const mctx = modImage.getContext("2d")!;
    const image = mctx.createImageData(cols, rows);
    spectra.forEach((s, c) => {
      if (!s) return;
      for (let k = kLo; k <= kHi; k++) {
        const x = s.amps[k] / modScale, [r, g, b] = modColor(x);
        const p = 4 * ((kHi - k) * cols + c);
        image.data[p] = r;
        image.data[p + 1] = g;
        image.data[p + 2] = b;
        image.data[p + 3] = 255 * Math.min(1, 0.25 + 1.5 * x); // Faint where there's little oscillation, so the notes' shading shows
      }
    });
    mctx.putImageData(image, 0, 0);
    // The image's columns are STEP_HOPS apart, centered on their spectra's times, and its rows
    // are the bins from kLo to kHi.
    const first = spectra.findIndex(s => s), last = spectra.length - 1 - [...spectra].reverse().findIndex(s => s);
    const step = spectra.length > 1 && spectra[last] && spectra[first] && last > first
      ? (spectra[last]!.t - spectra[first]!.t) / (last - first) : STEP_HOPS * analyzer.hopSize / analyzer.sampleRate;
    const t0 = spectra[first]!.t - first * step;
    ctx.save();
    ctx.beginPath();
    ctx.rect(L, top, R - L, bottom - top);
    ctx.clip();
    ctx.imageSmoothingEnabled = true;
    const x0 = xOf(t0 - step / 2), x1 = xOf(t0 + (cols - 0.5) * step);
    const y0 = yRate((kHi + 0.5) * binHz), y1 = yRate((kLo - 0.5) * binHz);
    ctx.drawImage(modImage, x0, y0, x1 - x0, y1 - y0);
    ctx.restore();
  }

  gridlines(ctx, L, R, [2, 4, 6, 8, 10, 12].map(f => ({ y: yRate(f), label: `${f} Hz` })));
  // The range of typical vibrato rates.
  ctx.save();
  ctx.strokeStyle = IN_TUNE_COLOR;
  ctx.setLineDash([4, 4]);
  for (const f of VIBRATO_TYPICAL) {
    ctx.beginPath();
    ctx.moveTo(L, yRate(f));
    ctx.lineTo(R, yRate(f));
    ctx.stroke();
  }
  ctx.restore();

  // The recent spectrum, scaled like the spectrogram's colors so that little oscillation draws as
  // little, and its peak.
  if (recent) {
    const samples: Sample[] = [];
    for (let k = kLo; k <= kHi; k++) samples.push({ value: k * binHz, weight: recent[k] });
    const bandwidth = (bottom - top) / (fHi - fLo) * binHz;
    const kernelPeak = Math.sqrt(2 * Math.PI) * Math.max(0.75, bandwidth) / ((bottom - top) / (fHi - fLo) * binHz);
    drawDistribution(ctx, side, top, bottom, samples, yRate, bandwidth, { grade: vib.quality.grade, full: modScale * kernelPeak });
  }
  if (peak) {
    markDistribution(ctx, side, yRate(peak.rate), `${peak.rate.toFixed(1)} Hz`, `±${Math.round(peak.extent)}¢`, h - LIVE_AXIS_H + 4, vib.quality);
  }
  readout(ctx, R, top, peak ? `${peak.rate.toFixed(1)} Hz · ±${Math.round(peak.extent)}¢` : "No vibrato");
}

// ⋘──────── Attacks and releases ────────⋙
// The recent notes' attacks (and, separately, their releases) overlaid on one time axis, each
// aligned at the same moment: an attack where the level comes within START_DB of the note's
// steady level (where the analysis starts timing it), and a release where the note starts to
// fade. Each graph has three strips: the volume relative to the note's steady level, the pitch
// relative to the note's pitch, and the clarity (how free of noise the sound is). The report's
// note is drawn brightest, older notes fainter, and the note that's sounding in amber.

const OVERLAY_NOTES   = 8;              // Notes overlaid
const ATTACK_WINDOW   = [-0.05, 0.4];   // Time shown around each attack (s)
const RELEASE_WINDOW  = [-0.2, 0.5];    // …and each release
const OVERLAY_H       = 380;            // Height of each graph (px)
const OVERLAY_PAD_L = 52, OVERLAY_PAD_R = 24, OVERLAY_PAD_T = 8, OVERLAY_AXIS_H = 26, STRIP_GAP = 22;
const LIVE_NOTE_COLOR = "#f9ab00"; // The note that's sounding
const OVERLAY_QUIET_DB = 30; // Pitch and clarity aren't drawn this far below a note's steady level (dB), where they mean nothing
const DISCARD_NOTICE  = 4;   // How long a sound that wasn't counted as a note is mentioned (s)
const ADAPT_LINES     = 6;   // Most gridlines in an adaptive strip
const ADAPT_OUTLIERS  = 0.02; // Share of a note's values at each end that an adaptive strip doesn't fit…
const ADAPT_MIN_VALUES = 20;  // …when it has at least this many
const ADAPT_DECAY     = 0.9; // When a new note arrives, an adaptive strip's limits shrink toward 0 by this factor
// Each adaptive strip's limits, and the start of the note they were last fitted to, by graph and strip.
const adaptiveRanges  = new Map<string, { lower: number; upper: number; note: number }>();

// A note as the overlays draw it: a finished note's report, or the note that's sounding.
interface OverlayNote {
  start       : number;  // Time of the note's start (s)
  hops        : Hop[];   // Its hops, with the moments before it started
  level       : number;  // Steady level (dB)
  midi        : number;  // Pitch (MIDI), or NaN
  legatoStart : boolean;
  legatoEnd   : boolean;
  releaseStart: number;  // When the release began (s), or NaN
}

// Where a note is lined up, and the level and pitch that its values are measured from.
interface Alignment { t: number; level: number; midi: number; }

interface Strip {
  label : string;
  range : [number, number]; // Values at the strip's bottom and top
  grid  : number[];
  format: (v: number) => string;
  value : (hop: Hop, a: Alignment) => number | null; // Null where there's nothing to draw
  loose?: (hop: Hop, a: Alignment) => number | null; // Less certain values, drawn dashed beneath `value`
  assess?: AttackPart; // The part of an attack's assessment about this strip
  marks?: { value: number; color: string; dash?: number[] }[];
  band? : [number, number]; // A range shaded green
  // A strip whose limits follow the notes, so the current note (the one sounding, or else the
  // latest) is never cut off. Within a note, the limits grow at once to fit it, with `margin` to
  // spare. When a new note arrives, the earlier limits shrink toward 0 by ADAPT_DECAY, but no
  // further than the new note needs, or than `range` (the narrowest the strip gets), and never
  // beyond `extreme`. `grid` is then replaced by gridlines spaced by the first of `steps` that
  // gives at most ADAPT_LINES of them.
  adapt?: { margin: number; extreme: [number, number]; steps: number[] };
}

const OVERLAY_STRIPS: Strip[] = [
  {
    label : "Volume (dB from the note's steady level)",
    range : [-40, 6],
    grid  : [],
    adapt : { margin: 2, extreme: [-60, 40], steps: [5, 10, 20, 40] }, // Silence before a note is well below −60 dB
    format: v => v > 0 ? `+${v}` : `${v}`,
    value : (hop, a) => hop.level - a.level,
    marks : [{ value: 0, color: IN_TUNE_COLOR }, { value: -3, color: MUTED, dash: [4, 4] }, { value: -START_DB, color: MUTED, dash: [1, 3] }],
    assess: "volume",
  },
  {
    label : "Pitch (cents from the note)",
    range : [-50, 50],
    grid  : [],
    adapt : { margin: 10, extreme: [-1200, 1200], steps: [25, 50, 100, 200, 500] },
    format: v => v === 0 ? "0¢" : formatCents(v),
    value : (hop, a) => hop.clarity >= 0.6 ? pitchCents(hop, a) : null,
    // At the start (and end) of a note, the pitch is often found while the sound is still noisy.
    loose : pitchCents,
    marks : [{ value: 0, color: IN_TUNE_COLOR }],
    band  : [-SETTLE_CENTS, SETTLE_CENTS],
    assess: "pitch",
  },
  {
    label : "Clarity (how free of noise)",
    range : [0.4, 1],
    grid  : [1, 0.8, 0.6, 0.4],
    format: v => `${Math.round(100 * v)}%`,
    value : (hop, a) => audible(hop, a) ? hop.clarity : null,
    assess: "noise",
  },
];

function audible(hop: Hop, a: Alignment): boolean { return hop.level >= a.level - OVERLAY_QUIET_DB; }

// A hop's pitch in cents from the note's, if one was found (with any clarity).
function pitchCents(hop: Hop, a: Alignment): number | null {
  return audible(hop, a) && Number.isFinite(hop.midi) && Number.isFinite(a.midi) ? 100 * (hop.midi - a.midi) : null;
}

// An attack is measured against the note's level and pitch in its first ATTACK_FINAL seconds
// (after its first moments, or before then, its loudest level so far), the same way for the note
// that's sounding and for a finished note, so it stops changing after ATTACK_FINAL, and doesn't
// move when the note ends. A note that began by changing pitch from the previous one is lined up
// at the change, and its graph shows where the pitch came from.
const ATTACK_FINAL = 0.5; // s
const LIVE_SETTLE  = 0.15; // s

// The hops from times t0 to t1 are hops[i0] to hops[i1 − 1]. (Hops are in order of time.)
function hopRange(hops: Hop[], t0: number, t1: number): [number, number] {
  const firstAtOrAfter = (t: number) => {
    let lo = 0, hi = hops.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (hops[mid].t < t) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };
  return [firstAtOrAfter(t0), firstAtOrAfter(t1 + 1e-9)];
}

// An attack's alignment is final once the note has lasted ATTACK_FINAL, so it's kept, by the
// note's start, from then on (for the note that's sounding, and then for its report).
const attackAlignments = new Map<number, Alignment | null>();

function attackAlignment(r: OverlayNote): Alignment | null {
  const known = attackAlignments.get(r.start);
  if (known !== undefined) return known;
  const [i0, i1] = hopRange(r.hops, r.start, r.start + ATTACK_FINAL);
  const early = r.hops.slice(i0, i1);
  if (!early.length) return null;
  const settled = early.filter(h => h.t >= r.start + LIVE_SETTLE);
  const steady = settled.length >= 10 ? settled : early;
  const level = settled.length >= 10 ? median(settled.map(h => h.level)) : Math.max(...early.map(h => h.level));
  const clear = steady.filter(h => h.clarity >= 0.8 && Number.isFinite(h.midi));
  const midi = clear.length ? median(clear.map(h => h.midi)) : NaN;
  const alignment = { t: (early.find(h => h.level >= level - START_DB) ?? early[0]).t, level, midi };
  if (r.hops[r.hops.length - 1].t >= r.start + ATTACK_FINAL) {
    if (attackAlignments.size > 100) attackAlignments.clear(); // Old notes; the shown ones are found again
    attackAlignments.set(r.start, alignment);
  }
  return alignment;
}

function releaseAlignment(r: OverlayNote): Alignment | null {
  if (r.legatoEnd || !Number.isFinite(r.releaseStart)) return null;
  return { t: r.releaseStart, level: r.level, midi: r.midi };
}

// A finished note, with the moments before it started.
const overlayNotes = new WeakMap<NoteReport, OverlayNote>();
function overlayNote(r: NoteReport): OverlayNote {
  let note = overlayNotes.get(r);
  if (!note) {
    note = { ...r, hops: [...r.before, ...r.hops] };
    overlayNotes.set(r, note);
  }
  return note;
}

// The note that's sounding, as far as it's gone. Its steady level and pitch are estimated from
// its hops after its first moments, and it's in its release once it has lasted a while and fallen
// more than FULL_VOLUME_DB below its steady level.
const LIVE_RELEASE_AFTER = 0.3; // s
const LIVE_RECENT_HOPS   = 6;   // The level now is the average power of this many hops
const FULL_VOLUME_DB     = 3;

const LIVE_STEADY_SECONDS = 3; // The steady level and pitch come from at most the last this-many seconds

function liveNote(v: LiveView | null): OverlayNote | null {
  if (!v || !analyzer || !v.seg.inNote || !v.log.has(v.seg.noteStart)) return null;
  const start = v.seg.noteStart, t0 = v.log.get(start).t;
  const hops = v.log.slice(Math.max(v.log.first, start - analyzer.prerollHops), v.log.end);
  const note = hops.slice(hopRange(hops, t0, Infinity)[0]);
  const settled = note.slice(hopRange(note, Math.max(t0 + LIVE_SETTLE, v.now - LIVE_STEADY_SECONDS), Infinity)[0]);
  const steady = settled.length >= 20 ? settled : note;
  const level = settled.length >= 20 ? median(settled.map(h => h.level)) : Math.max(...note.map(h => h.level));
  const clear = steady.filter(h => h.clarity >= 0.8 && Number.isFinite(h.midi));
  const midi = clear.length ? median(clear.map(h => h.midi)) : NaN;

  let releaseStart = NaN;
  const recent = note.slice(-LIVE_RECENT_HOPS);
  const now = 10 * Math.log10(recent.reduce((sum, h) => sum + 10 ** (h.level / 10), 0) / recent.length);
  if (note[note.length - 1].t - t0 >= LIVE_RELEASE_AFTER && now < level - FULL_VOLUME_DB) {
    for (let i = note.length - 1; i >= 0; i--) {
      if (note[i].level >= level - FULL_VOLUME_DB) {
        releaseStart = note[i].t;
        break;
      }
    }
  }
  return { start: t0, hops, level, midi, legatoStart: v.seg.legatoStart, legatoEnd: false, releaseStart };
}

// ⋘──── The attack's assessment ────⋙
// A box in the corner of the attacks graph grades an attack, like the report's attack card: the
// note that's sounding once it has lasted ATTACK_ASSESS (its attack is then graded once, from
// what's been heard so far), or else the report's note.

const ATTACK_ASSESS = 0.8; // s
const BOX_SPAN      = 0.45; // A box covers about the right part of the graph from this fraction of the way across
const liveAttacks = new Map<number, Aspect | null>(); // The sounding notes' attacks, by their starts

interface Assessment { aspect: Aspect; live: boolean; }

function attackAssessment(live: OverlayNote | null): Assessment | null {
  if (live && analyzer && live.hops[live.hops.length - 1].t >= live.start + ATTACK_ASSESS) {
    if (!liveAttacks.has(live.start)) {
      if (liveAttacks.size > 50) liveAttacks.clear();
      const i = hopRange(live.hops, live.start, Infinity)[0];
      const hops = live.hops.slice(i), before = live.hops.slice(0, i);
      const span = { start: 0, end: hops.length, legatoStart: live.legatoStart, legatoEnd: false, floor: analyzer.segmenter.floor };
      liveAttacks.set(live.start, analyzeNote(hops, [], span, settings.instrument, before)?.attack ?? null);
    }
    const aspect = liveAttacks.get(live.start);
    if (aspect) return { aspect, live: true };
  }
  const report = shownReport();
  return report ? { aspect: report.attack, live: false } : null;
}

// Draws a box in the right corner of a strip (from `top` to `bottom`), at the bottom, or at the
// top if `atTop`: a verdict in its grade's color, and the numbers it's based on, outlined in the
// same color. For the note that's sounding, the assessment is preliminary, so the outline is
// dashed. Returns where it was drawn.
function drawAssessmentBox(ctx: CanvasRenderingContext2D, verdict: string, grade: Grade, text: string, live: boolean,
    right: number, top: number, bottom: number, atTop: boolean): DOMRect {
  const pad = 6, lineH = 15;
  ctx.font = "bold 12px system-ui, sans-serif";
  const verdictW = ctx.measureText(verdict).width;
  ctx.font = "11px system-ui, sans-serif";
  const width = Math.max(verdictW, ctx.measureText(text).width) + 2 * pad;
  const height = 2 * pad + 2 * lineH - 3;
  const x = right - width, y = atTop ? top + 5 : bottom - 5 - height;
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(18, 20, 23, 0.9)";
  ctx.strokeStyle = GRADE_COLORS[grade];
  ctx.lineWidth = live ? 1.5 : 1;
  ctx.setLineDash(live ? [4, 3] : []);
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 6);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = "bold 12px system-ui, sans-serif";
  ctx.fillStyle = GRADE_COLORS[grade];
  ctx.fillText(verdict, x + pad, y + pad);
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = TEXT;
  ctx.fillText(text, x + pad, y + pad + lineH);
  return new DOMRect(x, y, width, height);
}

// The boxes drawn on each graph, which are links to the report's card.
const assessmentBoxes = new Map<HTMLCanvasElement, DOMRect[]>();

function linkAssessmentBoxes(canvas: HTMLCanvasElement, card: HTMLElement): void {
  const boxAt = (e: MouseEvent) => {
    const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    return (assessmentBoxes.get(canvas) ?? []).some(b => x >= b.left && x <= b.right && y >= b.top && y <= b.bottom);
  };
  canvas.addEventListener("mousemove", e => { canvas.style.cursor = boxAt(e) ? "pointer" : ""; });
  canvas.addEventListener("click", e => {
    if (boxAt(e)) card.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function drawOverlay(canvas: HTMLCanvasElement, align: (r: OverlayNote) => Alignment | null, [w0, w1]: number[], empty: string,
    v: LiveView | null, live: OverlayNote | null, assessment: Assessment | null = null): void {
  const { ctx, w, h } = fitCanvas(canvas, OVERLAY_H);
  const shownNote = shownReport();
  const shown = shownNote && overlayNote(shownNote);
  type Drawn = { note: OverlayNote; a: Alignment };
  const aligned = (note: OverlayNote): Drawn | null => {
    const a = align(note);
    return a && { note, a };
  };
  const recent = reports.slice(-OVERLAY_NOTES).map(overlayNote).filter(n => n !== shown);
  const finished = recent.map(aligned).filter((d): d is Drawn => !!d);
  const shownDrawn = shown ? aligned(shown) : null;
  const liveDrawn = live ? aligned(live) : null;

  // A sound that just ended without being counted as a note is mentioned, with the reason.
  const discard = analyzer?.lastDiscard;
  const notice = discard && v && v.now - discard.t < DISCARD_NOTICE ? `Last sound ignored: ${discard.reason}` : "";

  const boxes: DOMRect[] = [];
  assessmentBoxes.set(canvas, boxes);
  if (!finished.length && !shownDrawn && !liveDrawn) {
    placeholder(ctx, w, h, notice || empty);
    return;
  }
  const L = OVERLAY_PAD_L, R = w - OVERLAY_PAD_R;
  const xOf = (dt: number) => L + (dt - w0) / (w1 - w0) * (R - L);
  const stripH = (h - OVERLAY_PAD_T - OVERLAY_AXIS_H - STRIP_GAP * OVERLAY_STRIPS.length) / OVERLAY_STRIPS.length;
  const axisY = h - OVERLAY_AXIS_H + 10;

  // The time axis, with the moment the notes are aligned at.
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = MUTED;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const step = (w1 - w0) > 0.5 ? 0.1 : 0.05;
  for (let t = Math.ceil(w0 / step) * step; t <= w1 + 1e-9; t += step) {
    ctx.fillText(`${Math.round(1000 * t)} ms`, xOf(t), axisY);
  }

  OVERLAY_STRIPS.forEach((strip, s) => {
    const top = OVERLAY_PAD_T + STRIP_GAP + s * (stripH + STRIP_GAP), bottom = top + stripH;
    let [lo, hi] = strip.range, grid = strip.grid;
    if (strip.adapt) {
      const { margin, extreme, steps } = strip.adapt;
      const key = `${canvas.id}:${s}`;
      let limits = adaptiveRanges.get(key);
      // What a note needs: the range of its values, leaving out the most extreme few (brief
      // spikes, like the pitch detector's octave errors), so one bad moment doesn't widen the
      // strip for long.
      const need = ({ note, a }: Drawn): [number, number] => {
        const values: number[] = [];
        const [i0, i1] = hopRange(note.hops, a.t + w0, a.t + w1);
        for (let i = i0; i < i1; i++) {
          const value = strip.value(note.hops[i], a);
          if (value !== null) values.push(value);
        }
        values.sort((x, y) => x - y);
        const cut = values.length >= ADAPT_MIN_VALUES ? Math.floor(ADAPT_OUTLIERS * values.length) : 0;
        const lo = values.length ? values[cut] - margin : Infinity;
        const hi = values.length ? values[values.length - 1 - cut] + margin : -Infinity;
        return [Math.max(extreme[0], Math.min(strip.range[0], lo)), Math.min(extreme[1], Math.max(strip.range[1], hi))];
      };
      // The limits are kept from the finished notes (so a sound that ends up ignored doesn't
      // change them), and the note that's sounding only widens them while it's shown.
      const current = [...finished, ...(shownDrawn ? [shownDrawn] : [])].reduce<Drawn | null>(
        (best, d) => !best || d.note.start > best.note.start ? d : best, null);
      if (current) {
        const [needLo, needHi] = need(current);
        if (!limits) {
          limits = { lower: needLo, upper: needHi, note: current.note.start };
        } else if (limits.note !== current.note.start) {
          limits = {
            lower: Math.min(needLo, Math.min(strip.range[0], ADAPT_DECAY * limits.lower)),
            upper: Math.max(needHi, Math.max(strip.range[1], ADAPT_DECAY * limits.upper)),
            note : current.note.start,
          };
        } else {
          limits = { lower: Math.min(limits.lower, needLo), upper: Math.max(limits.upper, needHi), note: limits.note };
        }
        adaptiveRanges.set(key, limits);
      }
      [lo, hi] = limits ? [limits.lower, limits.upper] : strip.range;
      if (liveDrawn) {
        const [liveLo, liveHi] = need(liveDrawn);
        lo = Math.min(lo, liveLo);
        hi = Math.max(hi, liveHi);
      }
      const spacing = steps.find(st => (hi - lo) / st <= ADAPT_LINES) ?? steps[steps.length - 1];
      grid = [];
      for (let g = Math.floor(hi / spacing) * spacing; g >= lo; g -= spacing) grid.push(g);
    }
    const yOf = (value: number) => bottom - (Math.min(hi, Math.max(lo, value)) - lo) / (hi - lo) * (bottom - top);
    ctx.fillStyle = TEXT;
    ctx.font = "12px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(strip.label, L, top - 4);
    if (s === 0 && notice) {
      ctx.fillStyle = LIVE_NOTE_COLOR;
      ctx.textAlign = "right";
      ctx.fillText(notice, R - 60, top - 4); // Left of the panel's buttons
    }
    if (strip.band) {
      ctx.fillStyle = "rgba(52, 168, 83, 0.12)";
      ctx.fillRect(L, yOf(strip.band[1]), R - L, yOf(strip.band[0]) - yOf(strip.band[1]));
    }
    gridlines(ctx, L, R, grid.map(value => ({ y: yOf(value), label: strip.format(value) })));
    for (const mark of strip.marks ?? []) {
      ctx.strokeStyle = mark.color;
      ctx.setLineDash(mark.dash ?? []);
      ctx.beginPath();
      ctx.moveTo(L, yOf(mark.value));
      ctx.lineTo(R, yOf(mark.value));
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.beginPath();
    ctx.moveTo(xOf(0), top);
    ctx.lineTo(xOf(0), bottom);
    ctx.stroke();

    // The notes, oldest first, so the newest, the report's note, and the note that's sounding
    // are on top.
    ctx.save();
    ctx.beginPath();
    ctx.rect(L, top, R - L, bottom - top);
    ctx.clip();
    const ordered = [...finished, ...(shownDrawn ? [shownDrawn] : []), ...(liveDrawn ? [liveDrawn] : [])];
    ordered.forEach(({ note, a }, i) => {
      const isShown = note === shown, isLive = note === live;
      const alpha = isLive || isShown ? 1 : 0.2 + 0.5 * (i + 1) / Math.max(1, finished.length);
      ctx.strokeStyle = isLive ? LIVE_NOTE_COLOR : isShown ? TEXT : PITCH_COLOR;
      ctx.lineWidth = isLive || isShown ? 2 : 1.25;
      const trace = (value: (hop: Hop, a: Alignment) => number | null) => {
        ctx.beginPath();
        let drawing = false;
        const [i0, i1] = hopRange(note.hops, a.t + w0 - 0.01, a.t + w1 + 0.01);
        for (let i = i0; i < i1; i++) {
          const hop = note.hops[i], dt = hop.t - a.t;
          const v = value(hop, a);
          if (v === null) { drawing = false; continue; }
          if (drawing) ctx.lineTo(xOf(dt), yOf(v));
          else ctx.moveTo(xOf(dt), yOf(v));
          drawing = true;
        }
        ctx.stroke();
      };
      if (strip.loose) {
        ctx.globalAlpha = 0.6 * alpha;
        ctx.setLineDash([3, 3]);
        trace(strip.loose);
        ctx.setLineDash([]);
      }
      ctx.globalAlpha = alpha;
      trace(strip.value);
    });
    ctx.restore();

    // This strip's part of the assessment, in the corner (bottom or top) away from where the
    // assessed note's line is at the right.
    if (assessment && strip.assess) {
      const { aspect, live: isLive } = assessment;
      const part = aspect.parts?.[strip.assess] ?? { grade: aspect.grade, verdict: aspect.verdict, text: "" };
      const text = part.text;
      const assessed = assessment.live ? liveDrawn : shownDrawn;
      let atTop = false;
      if (assessed) {
        const [i0, i1] = hopRange(assessed.note.hops, assessed.a.t + w0 + BOX_SPAN * (w1 - w0), assessed.a.t + w1);
        const ys: number[] = [];
        for (let i = i0; i < i1; i++) {
          const value = strip.value(assessed.note.hops[i], assessed.a);
          if (value !== null) ys.push(yOf(value));
        }
        atTop = ys.length > 0 && median(ys) > (top + bottom) / 2;
      }
      boxes.push(drawAssessmentBox(ctx, part.verdict, part.grade, text, isLive, R - 6, top, bottom, atTop));
    }
  });
}

linkAssessmentBoxes(attacksCanvas, $("nq-card-attack"));

// ⋘──────── Overtones graph ────────⋙
// The strength of each harmonic, with a scale from thin to warm across the top.

const OT_PAD_L = 44, OT_PAD_R = 12, OT_SCALE_Y = 50, OT_AXIS_H = 20;

function drawOvertones(): void {
  const { ctx, w, h } = fitCanvas(overtonesCanvas, OVERTONES_H);
  const live = analyzer?.liveTimbre() ?? null;
  const timbre: TimbreProfile | null = live ?? shownReport()?.timbre ?? null;
  if (!timbre) {
    placeholder(ctx, w, h, "The harmonics of the next note will be shown here");
    return;
  }
  const L = OT_PAD_L, R = w - OT_PAD_R;
  const top = OT_SCALE_Y + 26, bottom = h - OT_AXIS_H;
  const n = timbre.harmonicsDb.length;
  const slot = (R - L) / (n + 1 + NOISE_BANDS.length); // The harmonics, a gap, and the noise bands
  const yOf = (db: number) => top + (Math.max(HARMONIC_DB_MIN, db) / HARMONIC_DB_MIN) * (bottom - top);

  // What's shown, in the top left (clear of the panel's buttons).
  ctx.fillStyle = live ? "#6ea8fe" : MUTED;
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`${live ? "Live" : "Report's note"}: ${timbre.label}, ${Math.round(timbre.f0)} Hz`, L, 10);

  // The warmth scale, with the descriptions' ranges.
  const scaleL = L, scaleR = R, scaleY = OT_SCALE_Y;
  const xWarmth = (x: number) => scaleL + x * (scaleR - scaleL);
  const gradient = ctx.createLinearGradient(scaleL, 0, scaleR, 0);
  gradient.addColorStop(0, "#5b8def");
  gradient.addColorStop(0.5, "#c9b458");
  gradient.addColorStop(1, "#e8743b");
  ctx.fillStyle = gradient;
  ctx.globalAlpha = 0.55;
  ctx.fillRect(scaleL, scaleY, scaleR - scaleL, 6);
  ctx.globalAlpha = 1;
  ctx.font = "11px system-ui, sans-serif";
  ctx.textBaseline = "bottom";
  ctx.textAlign = "center";
  const bounds = [...WARMTH_LABELS.map(([min]) => Math.max(0, min)), 1].sort((a, b) => a - b);
  [...WARMTH_LABELS].reverse().forEach(([, label], i) => {
    ctx.fillStyle = MUTED;
    ctx.fillText(label, xWarmth((bounds[i] + bounds[i + 1]) / 2), scaleY - 4);
    if (i > 0) {
      ctx.fillStyle = BG;
      ctx.fillRect(xWarmth(bounds[i]) - 1, scaleY, 2, 6);
    }
  });
  const marker = xWarmth(timbre.warmth);
  ctx.fillStyle = TEXT;
  ctx.beginPath();
  ctx.moveTo(marker, scaleY + 4);
  ctx.lineTo(marker - 6, scaleY + 14);
  ctx.lineTo(marker + 6, scaleY + 14);
  ctx.closePath();
  ctx.fill();

  // Gridlines.
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let db = 0; db >= HARMONIC_DB_MIN; db -= 20) {
    ctx.strokeStyle = GRID;
    ctx.beginPath();
    ctx.moveTo(L, yOf(db));
    ctx.lineTo(R, yOf(db));
    ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.fillText(`${db} dB`, L - 6, yOf(db));
  }

  // Bars.
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  timbre.harmonicsDb.forEach((db, i) => {
    const x = L + i * slot;
    ctx.fillStyle = MUTED;
    ctx.fillText(i === 0 ? "H1" : String(i + 1), x + slot / 2, bottom + 4);
    if (Number.isNaN(db)) return;
    ctx.fillStyle = `hsl(${30 - 25 * Math.min(1, i / 8)}, 70%, ${60 - 15 * Math.min(1, i / 12)}%)`;
    if (i === 0) ctx.fillStyle = "#e8b04b";
    const y = yOf(db);
    ctx.fillRect(x + slot * 0.18, y, slot * 0.64, bottom - y);
  });

  // The noise bands, relative to the harmonics' total power. (The bars are relative to the
  // strongest harmonic, which is a little less than the total.)
  const noiseX = L + (n + 1) * slot;
  ctx.fillStyle = MUTED;
  ctx.fillText("noise", noiseX + slot * NOISE_BANDS.length / 2, bottom + 4);
  timbre.noiseBands.forEach((db, b) => {
    const x = noiseX + b * slot, y = yOf(db);
    ctx.fillStyle = "rgba(138, 145, 156, 0.75)";
    ctx.fillRect(x + slot * 0.18, y, slot * 0.64, bottom - y);
    ctx.fillStyle = MUTED;
    ctx.font = "10px system-ui, sans-serif";
    ctx.fillText(["<1k", "1–4k", "4–8k"][b], x + slot / 2, y - 13);
    ctx.font = "11px system-ui, sans-serif";
  });

  // The harmonics' slope, as a dashed line.
  const xs: number[] = [], ys: number[] = [];
  timbre.harmonicsDb.forEach((db, i) => { if (db > HARMONIC_DB_MIN) { xs.push(Math.log2(i + 1)); ys.push(db); } });
  if (xs.length >= 3) {
    const fit = linearFit(xs, ys);
    ctx.save();
    ctx.beginPath();
    ctx.rect(L, top, R - L, bottom - top);
    ctx.clip();
    ctx.strokeStyle = TEXT;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x = L + (i + 0.5) * slot, y = yOf(fit.intercept + fit.slope * Math.log2(i + 1));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

}

// ⋘──────── Pinning, help, and saved settings ────────⋙
// The collapsible sections (the test tone's controls start open, and the settings collapsed) stay
// open or closed as the visitor left them.

const SECTIONS_KEY = "note_quality_sections";
const sections = [...document.querySelectorAll<HTMLDetailsElement>("details.nq-settings")];
try {
  const open: Record<string, boolean> = JSON.parse(localStorage.getItem(SECTIONS_KEY) ?? "{}");
  for (const section of sections) if (typeof open[section.id] === "boolean") section.open = open[section.id];
} catch { /* Nothing saved */ }
sections.forEach(section => section.addEventListener("toggle", () => {
  try {
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(Object.fromEntries(sections.map(s => [s.id, s.open]))));
  } catch { /* Not saved */ }
}));

setupPanels("nq", () => saved.save());
setupHelp("nq");
const saved = setupSavedControls("note_quality",
  ".nq-settings input, .nq-settings select, #nq-source, #nq-instrument, #nq-tone-controls input, #nq-tone-controls select", null);

document.querySelectorAll<HTMLElement>(".nq-settings input, #nq-tone-controls input[type=range]").forEach(el =>
  el.addEventListener("input", readSettings));
instrumentSelect.addEventListener("change", readInstrument);

// ⋘──────── Main loop ────────⋙

function drawAll(): void {
  const v = liveView();
  const vib = v && vibratoNow(v);
  drawPitch(v, vib);
  drawVolume(v);
  drawVibrato(v, vib);
  const live = liveNote(v);
  drawOverlay(attacksCanvas, attackAlignment, ATTACK_WINDOW, "The attacks of the next notes will be shown here", v, live, attackAssessment(live));
  drawOverlay(releasesCanvas, releaseAlignment, RELEASE_WINDOW, "The releases of the next notes will be shown here", v, live);
  drawOvertones();
}

function frame(): void {
  if (analyzer) {
    if (input.frozen) analyzer.skip();
    else addReports(analyzer.process());
    updateCountdown();
  }
  if (!input.frozen) drawAll();
  requestAnimationFrame(frame);
}

saved.restore();
loadCalibration();
updateNoiseControls();
settings.instrument = instrumentSelect.value as Instrument;
input.showSourceControls();
readSettings();
// Drawn once while frozen, so the graphs don't stay blank.
drawAll();
requestAnimationFrame(frame);
void input.autoStartMicrophone();
