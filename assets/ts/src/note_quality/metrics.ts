// ╭───────────────────────────────────────────────────────────────╮
// │              Grading a note: the five aspects of quality             │
// ╰───────────────────────────────────────────────────────────────╯
// A finished note is split into its attack (from the start until it reaches full volume and a
// steady pitch), its sustain (the steady middle), and its release (from when it starts to fade
// until it's gone). The sustain gives the pitch's and volume's steadiness and the tone color, and
// the attack and release are graded on their own. The numbers are turned into short descriptions
// for the chosen instrument, using the thresholds below, which are first guesses.

import { noteName, formatCents } from "../audio/notes";
import type { Hop, NoteSpan } from "./segmenter";
import { timbreProfile, NOISE_BANDS, type HarmonicFrame, type TimbreProfile } from "./timbre";
import { mean, median, rms, linearFit, detrend, movingAverage, strongestOscillation } from "./stats";

export type Instrument = "voice" | "strings" | "winds";
export type Grade = "good" | "okay" | "work" | "info";

export interface Aspect {
  grade  : Grade;
  verdict: string;
  detail : string;
  numbers: [string, string][]; // Label and value
  parts? : Partial<Record<AttackPart, Part>>; // Separate grades of an attack's volume, pitch, and noise
}

export type AttackPart = "volume" | "pitch" | "noise";
export interface Part {
  grade  : Grade;
  verdict: string;
  text   : string; // The numbers it's based on, in a line
}

export interface NoteReport {
  start       : number; // Time of the note's start (s)
  end         : number; // …and end
  attackEnd   : number; // When the sustain begins (s)
  releaseStart: number; // When the release begins (s)
  releaseEnd  : number; // When the release has faded (s)
  midi        : number; // Center pitch (MIDI)
  level       : number; // Sustain level (dB)
  legatoStart : boolean;
  legatoEnd   : boolean;
  instrument  : Instrument;
  hops        : Hop[];
  before      : Hop[];         // The moments just before the note started (set by the analyzer)
  frames      : HarmonicFrame[];
  span        : NoteSpan;      // Kept, with the hops and frames, so the note can be graded again
  timbre      : TimbreProfile | null;
  pitch       : Aspect;
  volume      : Aspect;
  tone        : Aspect;
  noise       : Aspect;
  attack      : Aspect;
  release     : Aspect;
}

// ⋘──────── Thresholds ────────⋙

const CLEAR             = 0.8;   // Hops at least this clear have a reliable pitch
const MIN_CLEAR_HOPS    = 8;     // Fewer clear hops than this, and the sound isn't a note
const MIN_SUSTAIN       = 0.15;  // Shortest sustain whose steadiness is graded (s)
const FULL_VOLUME_DB    = 3;     // The attack reaches full volume within this many dB of the sustain level
export const START_DB   = 20;    // The attack starts when the level is within this many dB of the sustain level
export const SETTLE_CENTS = 15;    // The pitch has settled once it stays this close to the note's pitch…
const SETTLE_HOLD       = 0.1;   // …for this long (s)
const LEGATO_TRIM       = 0.05;  // Time before a change of pitch that's left out of the sustain (s)
const RELEASE_GONE_DB   = 30;    // The release ends this far below the sustain level (or near the noise)

const PITCH_WOBBLE      = [4, 10];  // Cents RMS: up to the first is steady, up to the second is okay
const PITCH_DRIFT       = [20, 40]; // Cents over the note
const VIBRATO_MIN_CENTS = 8;        // Smallest vibrato (± cents) that's reported
const VIBRATO_EXPLAINS  = 0.35;     // Least share of the pitch's variation that vibrato must explain
const VIBRATO_HZ        = [3, 9];   // Range of vibrato rates looked for (Hz)
const VIBRATO_SLOW_HZ   = 4.5, VIBRATO_FAST_HZ = 7;
const VOLUME_WOBBLE     = [1, 2.5]; // dB RMS
const VOLUME_TREND_DB   = 4;        // A change in level this large over the note is mentioned
const TREMOLO_MIN_DB    = 1;        // Smallest regular pulsing of the volume (± dB) that's reported

const HARD_RISE         = 0.02;  // An attack faster than this (s)…
const HARD_OVERSHOOT    = 3;     // …that overshoots the sustain level by this many dB is hard
const BIG_OVERSHOOT     = 6;     // dB
const SLOW_RISE         = 0.15;  // s
const NOISE_LEAD        = 0.05;  // Noise before the tone longer than this (s) is breathy or scratchy
const LONG_NOISE_LEAD   = 0.12;  // s
const CLARITY_DROP      = 0.15;  // A drop in clarity this large at the start or end is noisy
const SCOOP_CENTS       = 30;    // A start this far from the pitch that takes a while to settle is a scoop
const BIG_SCOOP_CENTS   = 60;
const SLOW_SETTLE       = 0.08;  // s
const CHANGE_CLEAN      = 0.08;  // A change of note (legato) faster than this (s) is clean…
const CHANGE_SLOW       = 0.2;   // …and one slower than this is a slide
const CHANGE_DIP_DB     = [6, 12]; // A dip in volume during a change of note this large (dB) is noted, or large
const CHANGE_CLARITY    = 0.2;   // So is a dip in clarity this large
const OVERSHOOT_FROM    = 15;    // A note must start this far off its pitch (cents) for an overshoot to be measured
const PITCH_OVERSHOOT   = [15, 40]; // Cents past the pitch (beyond any vibrato): over the first is noted, over the second is large
const ABRUPT_RELEASE    = 0.04;  // A release faster than this (s) is a cutoff
const END_PITCH_CENTS   = [20, 40];
const NOISE_DB          = [-35, -20]; // Noise between the harmonics, relative to them: up to the first is clear
const SUBHARMONIC_DB    = [-30, -20]; // Subharmonics, relative to the lowest harmonics
const H1H2_BREATHY      = 10, H1H2_PRESSED = -3; // dB (voice)

// ⋘──────── Analysis ────────⋙

// `before` is the moments just before the note started, which for a note that began by changing
// pitch from the previous one (legato) show where the change came from.
export function analyzeNote(hops: Hop[], frames: HarmonicFrame[], span: NoteSpan, instrument: Instrument,
    before: Hop[] = []): NoteReport | null {
  const clear = hops.filter(h => h.clarity >= CLEAR && Number.isFinite(h.midi));
  if (clear.length < MIN_CLEAR_HOPS) return null;
  const t0 = hops[0].t, t1 = hops[hops.length - 1].t, dur = t1 - t0;
  const dt = dur / Math.max(1, hops.length - 1);
  const inRange = (h: { t: number }, a: number, b: number) => h.t >= a && h.t <= b;

  // The sustain level and pitch, from the middle of the note.
  const middle = hops.filter(h => inRange(h, t0 + 0.25 * dur, t0 + 0.85 * dur));
  const level = median((middle.length ? middle : hops).map(h => h.level));
  const middleClear = middle.filter(h => h.clarity >= CLEAR && Number.isFinite(h.midi));
  const midi = median((middleClear.length >= 3 ? middleClear : clear).map(h => h.midi));
  const cents = (h: Hop) => 100 * (h.midi - midi);
  // With vibrato, the pitch swings around the note's pitch, so the attack and release allow for it.
  const swing = vibratoSwing(middleClear);

  // ⋘── Attack ──⋙
  const tStart = (hops.find(h => h.level >= level - START_DB) ?? hops[0]).t;
  const tFull  = (hops.find(h => h.t >= tStart && h.level >= level - FULL_VOLUME_DB) ?? hops[0]).t;
  const rise = tFull - tStart;
  const attackWindow = hops.filter(h => inRange(h, tStart, Math.min(tFull + 0.15, t0 + 0.4 * dur)));
  const overshoot = Math.max(...attackWindow.map(h => h.level)) - level;
  const firstClear = clear.find(h => h.t >= tStart);
  const noiseLead = firstClear ? firstClear.t - tStart : 0;
  // The starting pitch is from the first few clear hops (about 15 ms), so a fast slide's start
  // isn't averaged away.
  const early = clear.filter(h => h.t >= tStart).slice(0, 3);
  const initCents = median((early.length ? early : clear.slice(0, 3)).map(cents));
  const settle = settleTime(clear, tStart, cents, SETTLE_CENTS + swing) - tStart;
  // ⋘── A change from the previous note ──⋙
  // For a note that began by changing pitch, where the pitch came from (the previous note's pitch,
  // early in the moments before), and when it left it, which starts the change.
  let fromCents = NaN, changeStart = t0;
  if (span.legatoStart) {
    const prev = before.filter(h => h.clarity >= CLEAR && Number.isFinite(h.midi));
    const prevEarly = prev.slice(0, Math.max(1, Math.floor(prev.length / 3)));
    if (prev.length) {
      fromCents = median(prevEarly.map(cents));
      changeStart = [...prev, ...clear].find(h => Math.abs(cents(h) - fromCents) > SETTLE_CENTS)?.t ?? t0;
    }
  }
  const settled = tStart + Math.max(0, settle);
  const pitchOvershoot = overshootPast(clear, tStart, settled, cents, Number.isFinite(fromCents) ? fromCents : initCents, swing);
  const onsetClarity = mean(hops.filter(h => inRange(h, tStart, tStart + 0.06)).map(h => h.clarity));
  const attackEnd = Math.min(tStart + Math.max(rise, settle), t0 + 0.4 * dur);

  // ⋘── Release ──⋙
  let iRelease = hops.length - 1;
  while (iRelease > 0 && (hops[iRelease].level < level - FULL_VOLUME_DB) && hops[iRelease].t > attackEnd) iRelease--;
  // When the note changes pitch without a break, the last moments are part of the change.
  const releaseStart = Math.max(span.legatoEnd ? t1 - LEGATO_TRIM : hops[iRelease].t, attackEnd);
  const gone = hops.find(h => h.t > releaseStart && (h.level <= level - RELEASE_GONE_DB || h.level <= span.floor + 3));
  const releaseEnd = gone?.t ?? t1;
  const fade = releaseEnd - releaseStart;
  const fadeRate = fade > 0 ? (hops[iRelease].level - (gone ?? hops[hops.length - 1]).level) / fade : 0;
  const t20 = hops.find(h => h.t > releaseStart && h.level < level - START_DB)?.t ?? releaseEnd;
  const ending = clear.filter(h => inRange(h, t20 - 0.1, t20) && h.t >= releaseStart - 0.05);
  const endCents = ending.length ? median(ending.map(cents)) : NaN;
  const endClarity = mean(hops.filter(h => inRange(h, releaseStart, t20)).map(h => h.clarity));

  // ⋘── Sustain ──⋙
  const sustain = hops.filter(h => inRange(h, attackEnd, releaseStart));
  const sustainClear = sustain.filter(h => h.clarity >= CLEAR && Number.isFinite(h.midi));
  const sustainClarity = median((sustain.length ? sustain : hops).map(h => h.clarity));
  const sustainLength = releaseStart - attackEnd;

  // Harmonic frames measure audio that's centered at their times, so those inside the sustain
  // are used (or all of the note's, if the sustain is too short to hold any).
  const sustainFrames = frames.filter(f => inRange(f, attackEnd, releaseStart));
  const noteFrames = frames.filter(f => inRange(f, tStart, releaseEnd));
  const timbre = timbreProfile(sustainFrames.length ? sustainFrames : noteFrames, sustainClarity);

  // How far the volume and clarity dipped during a change of note.
  const change = [...before, ...hops].filter(h => inRange(h, changeStart, Math.max(settled, changeStart + 0.03)));
  const volumeDip = change.length ? Math.max(0, level - Math.min(...change.map(h => h.level))) : 0;
  const clarityDip = change.length ? Math.max(0, sustainClarity - Math.min(...change.map(h => h.clarity))) : 0;

  const facts: AttackFacts & ReleaseFacts = {
    rise, overshoot, noiseLead, initCents, settle, pitchOvershoot, onsetClarity, sustainClarity,
    fromCents, changeTime: settled - changeStart, volumeDip, clarityDip,
    fade, fadeRate, endCents, endClarity, legatoEnd: span.legatoEnd, legatoStart: span.legatoStart, swing,
  };
  return {
    start: t0, end: t1, attackEnd, releaseStart, releaseEnd, midi, level,
    legatoStart: span.legatoStart, legatoEnd: span.legatoEnd, instrument, hops, before, frames, span, timbre,
    pitch  : sustainLength >= MIN_SUSTAIN && sustainClear.length >= MIN_CLEAR_HOPS
      ? pitchAspect(sustainClear, midi, dt) : tooShort(),
    volume : sustainLength >= MIN_SUSTAIN ? volumeAspect(sustain, level, dt, instrument) : tooShort(),
    tone   : toneAspect(timbre, instrument),
    noise  : noiseAspect(timbre, instrument),
    attack : attackAspect(facts, instrument),
    release: releaseAspect(facts, instrument),
  };
}

// How far (in cents) the pitch went past the note's pitch, on the far side from where it started,
// between first reaching it and settling (at `until`), beyond the swing of any vibrato. A note
// that starts near its pitch has no overshoot.
function overshootPast(clear: Hop[], tStart: number, until: number, cents: (h: Hop) => number, initCents: number, swing: number): number {
  if (!(Math.abs(initCents) >= OVERSHOOT_FROM)) return 0;
  const side = Math.sign(initCents);
  let reached = false, farthest = 0;
  for (const h of clear) {
    if (h.t < tStart) continue;
    if (h.t > until) break;
    const c = side * cents(h); // Positive on the side the note started from
    if (!reached && c <= 0) reached = true;
    if (reached) farthest = Math.max(farthest, -c);
  }
  return Math.max(0, farthest - swing);
}

// When the pitch first stays within `tolerance` cents of the note's pitch for SETTLE_HOLD.
function settleTime(clear: Hop[], tStart: number, cents: (h: Hop) => number, tolerance: number): number {
  const after = clear.filter(h => h.t >= tStart);
  for (let i = 0; i < after.length; i++) {
    let j = i;
    while (j < after.length && Math.abs(cents(after[j])) <= tolerance) {
      if (after[j].t - after[i].t >= SETTLE_HOLD) return after[i].t;
      j++;
    }
  }
  return after.length ? after[after.length - 1].t : tStart;
}

// The amplitude (cents) of the vibrato in the clear hops, or 0 if there's none.
function vibratoSwing(clear: Hop[]): number {
  if (clear.length < MIN_CLEAR_HOPS) return 0;
  const ts = clear.map(h => h.t);
  const osc = strongestOscillation(ts, detrend(ts, clear.map(h => 100 * h.midi)), VIBRATO_HZ[0], VIBRATO_HZ[1]);
  const span = ts[ts.length - 1] - ts[0];
  return osc.amp >= VIBRATO_MIN_CENTS && osc.explained >= VIBRATO_EXPLAINS && span * osc.freq >= 2.5 ? osc.amp : 0;
}

function tooShort(): Aspect {
  return { grade: "info", verdict: "Too short to judge", detail: "The note's steady part was too short to measure how steady it is.", numbers: [] };
}

const worse = (a: Grade, b: Grade): Grade => {
  const order: Grade[] = ["info", "good", "okay", "work"];
  return order.indexOf(a) >= order.indexOf(b) ? a : b;
};

const gradeOf = (x: number, [good, okay]: number[]): Grade => x <= good ? "good" : x <= okay ? "okay" : "work";
// With a sign, but without one for a value that rounds to zero.
const signed = (x: number, digits = 0) => {
  const text = Math.abs(x).toFixed(digits);
  return Number(text) === 0 ? text : `${x > 0 ? "+" : "−"}${text}`;
};
const ms = (s: number) => `${Math.round(1000 * s)} ms`;

// ⋘──────── Pitch ────────⋙
// The pitch's wobble is how far it wanders from a straight line (its drift) after vibrato is
// taken out: with vibrato, it's how much the vibrato's center moves.

function pitchAspect(clear: Hop[], midi: number, dt: number): Aspect {
  const ts = clear.map(h => h.t), cs = clear.map(h => 100 * (h.midi - midi));
  const { slope } = linearFit(ts, cs);
  const span = ts[ts.length - 1] - ts[0];
  const drift = slope * span;
  const residual = detrend(ts, cs);
  const osc = strongestOscillation(ts, residual, VIBRATO_HZ[0], VIBRATO_HZ[1]);
  const vibrato = osc.amp >= VIBRATO_MIN_CENTS && osc.explained >= VIBRATO_EXPLAINS && span * osc.freq >= 2.5;
  const wobble = vibrato
    ? rms(movingAverage(residual, Math.round(0.5 / (osc.freq * dt))))
    : rms(movingAverage(residual, 3)); // Averaged over about 30 ms, which removes the pitch detector's own noise

  let grade = gradeOf(wobble, PITCH_WOBBLE);
  grade = worse(grade, gradeOf(Math.abs(drift), PITCH_DRIFT));
  let verdict = { good: "Steady", okay: "Slightly unsteady", work: "Unsteady", info: "" }[grade];
  if (Math.abs(drift) > PITCH_DRIFT[0]) verdict += `, drifting ${drift > 0 ? "sharp" : "flat"}`;

  let detail = "Wobble is how far the pitch wanders from a smooth line, not counting vibrato. "
    + `Under ${PITCH_WOBBLE[0]}¢ is very steady; over ${PITCH_WOBBLE[1]}¢ is easy to hear.`;
  if (vibrato) {
    const speed = osc.freq < VIBRATO_SLOW_HZ ? "slow" : osc.freq > VIBRATO_FAST_HZ ? "fast" : "moderate";
    detail += ` The vibrato is ${speed}, and ${osc.explained > 0.7 ? "regular" : "somewhat irregular"}.`;
  }
  return {
    grade, verdict, detail,
    numbers: [
      ["Pitch", `${noteName(midi)} ${formatCents(100 * (midi - Math.round(midi)))}`],
      ["Wobble (RMS)", `${wobble.toFixed(1)}¢`],
      ["Drift", `${signed(drift)}¢`],
      ["Vibrato", vibrato ? `${osc.freq.toFixed(1)} Hz, ±${osc.amp.toFixed(0)}¢` : "None"],
    ],
  };
}

// ⋘──────── Volume ────────⋙

function volumeAspect(sustain: Hop[], level: number, dt: number, instrument: Instrument): Aspect {
  const ts = sustain.map(h => h.t), ls = sustain.map(h => h.level);
  const { slope } = linearFit(ts, ls);
  const span = ts[ts.length - 1] - ts[0];
  const trend = slope * span;
  const residual = detrend(ts, ls);
  const osc = strongestOscillation(ts, residual, VIBRATO_HZ[0], VIBRATO_HZ[1]);
  const tremolo = osc.amp >= TREMOLO_MIN_DB && osc.explained >= VIBRATO_EXPLAINS && span * osc.freq >= 2.5;
  const wobble = rms(movingAverage(residual, tremolo ? Math.round(0.5 / (osc.freq * dt)) : 3));

  const grade = gradeOf(wobble, VOLUME_WOBBLE);
  let verdict = { good: "Steady", okay: "Slightly uneven", work: "Uneven", info: "" }[grade];
  if (trend >= VOLUME_TREND_DB) verdict += ", growing louder";
  if (trend <= -VOLUME_TREND_DB) verdict += ", fading";

  let detail = "Unevenness is how much the volume wavers around a smooth line. "
    + `Under ${VOLUME_WOBBLE[0]} dB is very even.`;
  if (trend <= -VOLUME_TREND_DB && instrument !== "strings") {
    detail += " A note that fades when it isn't meant to often means the breath support is running out.";
  } else if (trend <= -VOLUME_TREND_DB) {
    detail += " A note that fades when it isn't meant to often means the bow is slowing or lightening.";
  }
  if (tremolo) detail += " The volume pulses regularly, as it often does along with vibrato.";
  return {
    grade, verdict, detail,
    numbers: [
      ["Level", `${level.toFixed(0)} dB`],
      ["Unevenness (RMS)", `${wobble.toFixed(1)} dB`],
      ["Trend", `${signed(trend)} dB`],
      ["Pulsing", tremolo ? `${osc.freq.toFixed(1)} Hz, ±${osc.amp.toFixed(1)} dB` : "None"],
    ],
  };
}

// ⋘──────── Tone color ────────⋙

function toneAspect(timbre: TimbreProfile | null, instrument: Instrument): Aspect {
  if (!timbre) return { grade: "info", verdict: "Not measured", detail: "The note was too short to measure its harmonics.", numbers: [] };
  const hints: string[] = [];
  if (timbre.label === "Pure") {
    hints.push("The tone has almost no overtones, like a sine wave or a whistle.");
  } else {
    hints.push(timbre.warmth >= 0.5
      ? "Most of the tone's energy is in its fundamental and lowest harmonics."
      : "Much of the tone's energy is in its upper harmonics, compared with its fundamental.");
  }
  if (instrument === "voice" && timbre.label !== "Pure") {
    if (timbre.h1h2 > H1H2_BREATHY) hints.push("A fundamental much stronger than the second harmonic often goes with a breathy tone.");
    if (timbre.h1h2 < H1H2_PRESSED) hints.push("A second harmonic stronger than the fundamental often goes with a pressed or tight tone.");
  }
  const brilliance = { voice: "Ring (2–4 kHz)", strings: "Brilliance (2–4 kHz)", winds: "Brilliance (2–4 kHz)" }[instrument];
  return {
    grade: "info",
    verdict: timbre.label,
    detail: hints.join(" "),
    numbers: [
      ["Warmth", `${Math.round(100 * timbre.warmth)}%`],
      ["Center of mass", `harmonic ${timbre.centroid.toFixed(1)}`],
      ["Slope", Number.isFinite(timbre.tilt) ? `${timbre.tilt.toFixed(1)} dB/octave` : "—"],
      ["H1 − H2", `${signed(timbre.h1h2, 1)} dB`],
      [brilliance, Number.isFinite(timbre.brilliance) ? `${timbre.brilliance.toFixed(0)} dB` : "—"],
    ],
  };
}

// ⋘──────── Noise ────────⋙
// The noise between the harmonics, relative to the harmonics. Noise that's mostly above 1 kHz
// sounds like breath or air; a vibration that repeats only every second period (subharmonics),
// or noise that's mostly low, sounds rough or crunchy.

function noiseAspect(timbre: TimbreProfile | null, instrument: Instrument): Aspect {
  if (!timbre) return { grade: "info", verdict: "Not measured", detail: "The note was too short to measure the noise in its tone.", numbers: [] };
  const [low, mid, high] = timbre.noiseBands.map(db => 10 ** (db / 10));
  const noisy = timbre.noise > NOISE_DB[0];
  const rough = timbre.subharmonics > SUBHARMONIC_DB[0];
  const airy = mid + high >= low;
  const grade = worse(gradeOf(timbre.noise, NOISE_DB), gradeOf(timbre.subharmonics, SUBHARMONIC_DB));
  const words = {
    voice  : { rough: "Rough or creaky", airy: "Breathy", low: "Noisy", clear: "Clear" },
    strings: { rough: "Crunchy", airy: "Airy (surface noise)", low: "Crunchy", clear: "Clear" },
    winds  : { rough: "Rough or buzzy", airy: "Airy", low: "Noisy", clear: "Clear" },
  }[instrument];
  const verdict = rough ? words.rough : noisy ? (airy ? words.airy : words.low) : words.clear;
  const hints = ["The noise is the energy between the harmonics (after removing the room's background noise), relative to the harmonics."];
  if (rough) {
    hints.push({
      voice  : "Energy halfway between the harmonics means the vocal folds are vibrating unevenly, as in vocal fry or a pressed, rough tone.",
      strings: "Energy halfway between the harmonics means the string isn't vibrating evenly, as when the bow presses too hard for its speed.",
      winds  : "Energy halfway between the harmonics means the vibration isn't even, as with too much lip pressure or a rough reed.",
    }[instrument]);
  } else if (noisy && airy) {
    hints.push({
      voice  : "The noise is mostly above 1 kHz, as from air escaping through vocal folds that don't fully close.",
      strings: "The noise is mostly above 1 kHz, as when the bow is too light or too far from the bridge for its speed.",
      winds  : "The noise is mostly above 1 kHz, as from air that isn't all becoming tone.",
    }[instrument]);
  } else if (noisy) {
    hints.push("The noise is mostly below 1 kHz.");
  } else {
    hints.push(`Under ${NOISE_DB[0]} dB, the tone sounds clear.`);
  }
  return {
    grade, verdict, detail: hints.join(" "),
    numbers: [
      ["Noise", `${timbre.noise.toFixed(0)} dB`],
      ...NOISE_BANDS.map(([, , name], b): [string, string] => [name, `${timbre.noiseBands[b].toFixed(0)} dB`]),
      ["Subharmonics", `${timbre.subharmonics.toFixed(0)} dB`],
    ],
  };
}

// ⋘──────── Attack and release ────────⋙
// Each instrument has its own list of problems to look for. The first problem found gives the
// verdict, and the others are mentioned in the detail.

interface AttackFacts {
  rise: number; overshoot: number; noiseLead: number; initCents: number; settle: number;
  pitchOvershoot: number; // Cents the pitch went past the note's pitch, on the far side from where it started
  fromCents: number;      // For a change of note: the previous note's pitch, in cents from this one's (or NaN)
  changeTime: number;     // …how long the change took, from leaving the previous pitch to settling (s)
  volumeDip: number;      // …how far the volume dipped during it (dB)
  clarityDip: number;     // …and how far the clarity dipped
  onsetClarity: number; sustainClarity: number; legatoStart: boolean;
  swing: number; // Amplitude of the vibrato (cents)
}
interface ReleaseFacts {
  fade: number; fadeRate: number; endCents: number; endClarity: number; sustainClarity: number; legatoEnd: boolean;
  swing: number;
}
interface Issue { grade: Grade; verdict: string; detail: string; }

function judge(issues: (Issue | false)[], fine: Issue): Pick<Aspect, "grade" | "verdict" | "detail"> {
  const found = issues.filter((i): i is Issue => !!i);
  if (!found.length) return fine;
  return {
    grade  : found.reduce<Grade>((g, i) => worse(g, i.grade), "good"),
    verdict: found[0].verdict,
    detail : found.map(i => i.detail).join(" "),
  };
}

function attackAspect(f: AttackFacts, instrument: Instrument): Aspect {
  if (f.legatoStart) return changeAspect(f, instrument);
  const overshootText = f.pitchOvershoot >= 1 ? formatCents(-Math.sign(f.initCents) * f.pitchOvershoot) : "none";
  const numbers: [string, string][] = [
    ["Rise time", f.rise < 0.005 ? "under 5 ms" : ms(f.rise)], // Measured in hops of 5 ms
    ["Overshoot", `${Math.max(0, f.overshoot).toFixed(1)} dB`],
    ["Starting pitch", Number.isFinite(f.initCents) ? formatCents(f.initCents) : "—"],
    ["Pitch settles in", ms(Math.max(0, f.settle))],
    ["Pitch overshoot", overshootText],
    ["Noise before tone", ms(f.noiseLead)],
  ];
  const n = Object.fromEntries(numbers);
  const hard   = f.rise < HARD_RISE && f.overshoot > HARD_OVERSHOOT;
  const noisy  = f.noiseLead > NOISE_LEAD || f.onsetClarity < f.sustainClarity - CLARITY_DROP;
  const slow   = f.rise > SLOW_RISE;
  const scoop  = Math.abs(f.initCents) > SCOOP_CENTS + f.swing && f.settle > SLOW_SETTLE;
  const noisyGrade: Grade = f.noiseLead > LONG_NOISE_LEAD ? "work" : "okay";
  const scoopGrade: Grade = Math.abs(f.initCents) > BIG_SCOOP_CENTS + f.swing ? "work" : "okay";
  const scoopWords = f.initCents < 0 ? "Scooped up into the pitch" : "Started sharp and came down";
  const scoopDetail = `The note started ${formatCents(f.initCents)} from its pitch and took ${ms(f.settle)} to settle.`;
  // Going past the pitch and coming back, after starting below it (or above it).
  const overshot = f.pitchOvershoot > PITCH_OVERSHOOT[0];
  const overshootGrade = gradeOf(f.pitchOvershoot, PITCH_OVERSHOOT) === "work" ? "work" : "okay";
  const overshootWords = scoop ? (f.initCents < 0 ? "Scooped up past the pitch" : "Came down past the pitch")
    : f.initCents < 0 ? "Overshot the pitch" : "Undershot the pitch";
  const overshootIssue: Issue = {
    grade: overshootGrade, verdict: overshootWords,
    detail: `The pitch went ${overshootText} past the note before coming back.`,
  };

  const judged = {
    voice: () => judge([
      hard && { grade: f.overshoot > BIG_OVERSHOOT ? "work" : "okay", verdict: "Hard (glottal) onset", detail: "The tone started with a sudden burst, as when the vocal folds are pressed together before the note." },
      noisy && { grade: noisyGrade, verdict: "Breathy onset", detail: "Air could be heard before the tone began." },
      overshot && overshootIssue,
      scoop && { grade: scoopGrade, verdict: scoopWords, detail: scoopDetail },
    ], { grade: "good", verdict: "Balanced onset", detail: "The tone started cleanly, without a burst or a breathy lead-in." }),
    strings: () => judge([
      noisy && !slow && { grade: noisyGrade, verdict: "Scratchy start", detail: "Noise came before the string started to ring, as when the bow's pressure is too high for its speed." },
      (slow || f.noiseLead > LONG_NOISE_LEAD) && { grade: "okay", verdict: "Slow to speak", detail: "The string took a while to reach its full sound." },
      overshot && overshootIssue,
      scoop && { grade: scoopGrade, verdict: f.initCents < 0 ? "Slid up into the pitch" : "Slid down into the pitch", detail: scoopDetail },
      f.overshoot > BIG_OVERSHOOT && { grade: "okay", verdict: "Strongly accented start", detail: "The start was much louder than the rest of the note." },
    ], { grade: "good", verdict: "Clean start", detail: "The string spoke right away, without scratch or delay." }),
    winds: () => judge([
      noisy && { grade: noisyGrade, verdict: "Airy start", detail: "Air could be heard before the tone began, as when the tongue releases before the air is ready." },
      overshot && overshootIssue,
      scoop && { grade: scoopGrade, verdict: scoopWords, detail: scoopDetail },
      f.overshoot > BIG_OVERSHOOT && { grade: "okay", verdict: "Explosive attack", detail: "The start was much louder than the rest of the note." },
      slow && { grade: "okay", verdict: "Soft, slow start", detail: "The tone took a while to reach its full volume." },
    ], { grade: "good", verdict: "Clean start", detail: "The tone started right away, cleanly and on pitch." }),
  }[instrument]();

  // The same problems, graded separately for the attack's volume, pitch, and noise. A slow rise
  // is fine for a voice, but makes a string or wind instrument slow to speak.
  const accented = f.overshoot > BIG_OVERSHOOT;
  const volumeText = `Rise ${n["Rise time"]} · overshoot ${n["Overshoot"]}`;
  const pitchText = [`Starts at ${n["Starting pitch"]}`, overshot && `overshoots ${overshootText}`, `settles in ${n["Pitch settles in"]}`]
    .filter(Boolean).join(" · ");
  const noiseText = `Noise before the tone: ${n["Noise before tone"]}`;
  const parts: Record<AttackPart, Part> = {
    volume: hard ? { grade: f.overshoot > BIG_OVERSHOOT ? "work" : "okay", verdict: instrument === "voice" ? "Hard (glottal) onset" : "Hard, sudden start", text: volumeText }
      : accented && instrument !== "voice" ? { grade: "okay", verdict: instrument === "winds" ? "Explosive attack" : "Strongly accented start", text: volumeText }
      : slow && instrument !== "voice" ? { grade: "okay", verdict: instrument === "strings" ? "Slow to speak" : "Soft, slow start", text: volumeText }
      : { grade: "good", verdict: slow ? "Gradual rise" : "Clean rise", text: volumeText },
    pitch: overshot ? { grade: scoop ? worse(scoopGrade, overshootGrade) : overshootGrade, verdict: overshootWords, text: pitchText }
      : scoop ? { grade: scoopGrade, verdict: instrument === "strings" ? (f.initCents < 0 ? "Slid up into the pitch" : "Slid down into the pitch") : scoopWords, text: pitchText }
      : { grade: "good", verdict: "On pitch right away", text: pitchText },
    noise: noisy ? { grade: noisyGrade, verdict: { voice: "Breathy onset", strings: "Scratchy start", winds: "Airy start" }[instrument], text: noiseText }
      : { grade: "good", verdict: "No noise before the tone", text: noiseText },
  };
  return { ...judged, numbers, parts };
}

// A note that began by changing pitch from the previous note (legato) has a change instead of an
// attack: how quickly and cleanly the pitch moved to the new note, whether it went past it, and
// whether the volume or clarity dipped on the way.
function changeAspect(f: AttackFacts, instrument: Instrument): Aspect {
  const change = Math.max(0, f.changeTime);
  const overshootText = f.pitchOvershoot >= 1 && Number.isFinite(f.fromCents) ? formatCents(-Math.sign(f.fromCents) * f.pitchOvershoot) : "none";
  const numbers: [string, string][] = [
    ["Came from", Number.isFinite(f.fromCents) ? formatCents(f.fromCents) : "—"],
    ["Change takes", ms(change)],
    ["Pitch overshoot", overshootText],
    ["Volume dip", `${f.volumeDip.toFixed(1)} dB`],
    ["Clarity dip", `${Math.round(100 * f.clarityDip)}%`],
  ];
  const overshot = f.pitchOvershoot > PITCH_OVERSHOOT[0];
  const up = f.fromCents < 0;
  const pitch: Part = overshot
    ? { grade: gradeOf(f.pitchOvershoot, PITCH_OVERSHOOT) === "work" ? "work" : "okay", verdict: up ? "Went past the new note (above)" : "Went past the new note (below)", text: "" }
    : change > CHANGE_SLOW ? { grade: "info", verdict: "Slow slide into the note", text: "" }
    : change > CHANGE_CLEAN ? { grade: "good", verdict: "Smooth slide into the note", text: "" }
    : { grade: "good", verdict: "Clean change of pitch", text: "" };
  pitch.text = [`From ${numbers[0][1]}`, overshot && `overshoots ${overshootText}`, `takes ${ms(change)}`].filter(Boolean).join(" · ");
  const volume: Part = {
    grade  : f.volumeDip > CHANGE_DIP_DB[1] ? "work" : f.volumeDip > CHANGE_DIP_DB[0] ? "okay" : "good",
    verdict: f.volumeDip > CHANGE_DIP_DB[0] ? "Volume dipped during the change" : "Steady volume through the change",
    text   : `Dips ${f.volumeDip.toFixed(1)} dB during the change`,
  };
  const noisy = f.clarityDip > CHANGE_CLARITY;
  const noise: Part = {
    grade  : noisy ? "okay" : "good",
    verdict: noisy ? { voice: "Break or breath in the change", strings: "Noisy change (bow or finger)", winds: "Airy change" }[instrument] : "Clear through the change",
    text   : `Clarity dips ${Math.round(100 * f.clarityDip)}% during the change`,
  };
  const parts = { pitch, volume, noise };
  const problems = [pitch, volume, noise].filter(p => p.grade === "okay" || p.grade === "work");
  return {
    grade  : problems.reduce<Grade>((g, p) => worse(g, p.grade), "good"),
    verdict: problems[0]?.verdict ?? (pitch.grade === "info" ? pitch.verdict : "Clean change from the previous note"),
    detail : "This note began by changing pitch from the previous one without a break, so its start is graded as a change of note: "
      + "how quickly and cleanly the pitch moved, and whether the volume or clarity dipped on the way.",
    numbers, parts,
  };
}

function releaseAspect(f: ReleaseFacts, instrument: Instrument): Aspect {
  const numbers: [string, string][] = [
    ["Fade time", ms(f.fade)],
    ["Fade rate", `${Math.round(f.fadeRate)} dB/s`],
    ["Ending pitch", Number.isFinite(f.endCents) ? formatCents(f.endCents) : "—"],
    ["Clarity at end", `${Math.round(100 * f.endClarity)}% (middle ${Math.round(100 * f.sustainClarity)}%)`],
  ];
  if (f.legatoEnd) {
    return { grade: "info", verdict: "Connected to the next note", detail: "The note ended by changing pitch without a break, so it has no release.", numbers };
  }
  const abrupt = f.fade < ABRUPT_RELEASE;
  const pitchMoved = Math.abs(f.endCents) > END_PITCH_CENTS[0] + f.swing;
  const pitchGrade = gradeOf(Math.abs(f.endCents) - f.swing, END_PITCH_CENTS);
  const noisy = f.endClarity < f.sustainClarity - CLARITY_DROP;
  const pitchWords = f.endCents < 0 ? "Pitch drops at the end" : "Pitch rises at the end";
  const pitchDetail = `As the note faded, its pitch moved ${formatCents(f.endCents)}.`;

  const judged = {
    voice: () => judge([
      abrupt && { grade: "okay", verdict: "Cut off", detail: "The note stopped suddenly, as when the throat closes (a glottal stop)." },
      pitchMoved && { grade: pitchGrade, verdict: pitchWords, detail: pitchDetail },
      noisy && { grade: "okay", verdict: "Breathy ending", detail: "Breath noise could be heard as the note ended." },
    ], { grade: "good", verdict: "Clean release", detail: "The note ended smoothly and stayed on pitch." }),
    strings: () => judge([
      noisy && { grade: abrupt ? "work" : "okay", verdict: abrupt ? "Crunchy stop" : "Noisy ending", detail: "The bow made noise as the note ended." },
      pitchMoved && { grade: pitchGrade, verdict: pitchWords, detail: pitchDetail + " This can come from the finger moving or the bow's pressure changing." },
    ], { grade: "good", verdict: abrupt ? "Clean stop" : "Clean release", detail: abrupt ? "The bow stopped the string cleanly." : "The note faded cleanly and stayed on pitch." }),
    winds: () => judge([
      abrupt && { grade: "okay", verdict: "Tongued cutoff", detail: "The note stopped suddenly, as when the tongue stops the air." },
      pitchMoved && { grade: pitchGrade, verdict: f.endCents < 0 ? "Pitch sags at the end" : "Pitch rises at the end", detail: pitchDetail + " Pitch often sags when the air support drops as a note ends." },
      noisy && { grade: "okay", verdict: "Airy ending", detail: "Air noise could be heard as the note ended." },
    ], { grade: "good", verdict: "Clean release", detail: "The note ended smoothly and stayed on pitch." }),
  }[instrument]();
  return { ...judged, numbers };
}
