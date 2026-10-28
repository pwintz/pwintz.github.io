// ╭───────────────────────────────────────────────────────────────╮
// │     Multi-note Music Tuner: live spectrum and note finder     │
// ╰───────────────────────────────────────────────────────────────╯
// A web version of my Processing sketch "FFTTuning". Audio from the microphone, a test tone, or a
// file is windowed and transformed with an FFT. Each peak in the spectrum is located more precisely
// than the FFT's bin spacing by fitting a Gaussian through the three largest bins (a parabola
// through the logarithms of their magnitudes), following M. Gasior and J. L. Gonzalez, "Improving
// FFT Frequency Measurement Resolution by Parabolic and Gaussian Spectrum Interpolation" (2004).
// Peaks that line up with a whole-number multiple of a lower peak are treated as its harmonics,
// and the rest are named as notes and shown with how many cents sharp or flat they are.

export {}; // Makes this file a module, so its names don't collide with other pages' scripts.

// ⋘──────── Constants ────────⋙

const NOTE_NAMES      = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const BLACK_KEYS      = new Set([1, 3, 6, 8, 10]);
const EPS             = 1e-12;
const GAUSS_ALPHA     = 0.25; // Width of the Gauss window, as a fraction of half its length (Minim's default)
const DETECT_MIN_HZ   = 25;   // Peaks are searched for between these frequencies
const DETECT_MAX_HZ   = 10000;
const MAX_PEAKS       = 16;   // The strongest peaks kept in each frame
const HARMONIC_CENTS  = 35;   // How close a peak must be to n × a lower peak to count as its harmonic
const MAX_PEAK_GAIN    = 1.6;  // Most that interpolation can put a peak above its highest bin (the rectangular window's worst case)
const WEAK_HARMONIC    = 0.003; // Quietest harmonic (relative to the loudest peak) that's marked below the threshold
const WEAK_FUNDAMENTAL = 0.003; // Quietest fundamental (relative to the loudest peak) that's restored below the threshold (−50 dB, since laptop microphones pick up little below about 150 Hz)
const N_HARMONICS     = 10;   // Highest harmonic of a note that's marked when it's below the threshold
const IN_TUNE_CENTS   = 5;    // The tuner's green zone is ± this many cents
const INTERVAL_RANGE  = 30;   // The interval meter runs from −30 to +30 cents
const HISTORY_SECONDS = 10;   // Time span of the note history
const HISTORY_MIN_SPAN = 18;  // Fewest semitones shown in the note history
const HISTORY_MIN_NOTE_SECONDS = 0.15; // Shortest note that widens the note history's range
const HISTORY_GAP_SECONDS      = 0.1;  // Longest gap in a note that still counts as the same note
const NOTE_CONFIRM_SECONDS     = 0.06; // How long a note must last before it's recorded or shown on the tuner
const HIDDEN_COLOR = "#ffc400"; // Marks where notes outside the note history's range are hidden

const BG    = "#121417";
const PANEL = "#1b1e23";
const TEXT  = "#d8dce2";
const MUTED = "#8a919c";
const GRID  = "rgba(255, 255, 255, 0.08)";

// ⋘──────── DOM ────────⋙

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const sourceSelect   = $<HTMLSelectElement>("ft-source");
const startButton    = $<HTMLButtonElement>("ft-start");
const freezeButton   = $<HTMLButtonElement>("ft-freeze");
const statusLine     = $<HTMLParagraphElement>("ft-status");
const toneControls   = $<HTMLDivElement>("ft-tone-controls");
const tonePitch      = $<HTMLInputElement>("ft-tone-pitch");
const tonePitchOut   = $<HTMLOutputElement>("ft-tone-pitch-out");
const toneTimbre     = $<HTMLSelectElement>("ft-tone-timbre");
const toneChord      = $<HTMLSelectElement>("ft-tone-chord");
const toneAudible    = $<HTMLInputElement>("ft-tone-audible");
const fileControls   = $<HTMLDivElement>("ft-file-controls");
const fileInput      = $<HTMLInputElement>("ft-file");
const audioElement   = $<HTMLAudioElement>("ft-audio");

const tunerCanvas     = $<HTMLCanvasElement>("ft-tuner");
const spectrumCanvas  = $<HTMLCanvasElement>("ft-spectrum");
const historyCanvas   = $<HTMLCanvasElement>("ft-history");

// ⋘──────── Settings ────────⋙

const settings = {
  axis          : "note" as "note" | "linear", // Horizontal axis: equal spacing per semitone, or per Hz
  scale         : "linear" as "linear" | "db",
  window        : "gauss",
  fftSize       : 8192,
  smoothing     : 0.5,  // Weight of the previous spectrum when averaging with the new one
  threshold     : 0.3,  // Peaks weaker than this fraction of the strongest are ignored
  minDb         : -70,  // Peaks quieter than this (dB relative to a full-scale sine) are ignored
  a4            : 440,
  fMin          : 50,
  fMax          : 4000,
  hideHarmonics : true,
  showFits      : true,
  showWaveform  : false,
  noiseStrength : 1,    // Multiple of the calibrated background noise that's removed
  tunerNotes    : 2,    // How many of the loudest notes the tuner shows
  intervalRef   : "just" as "just" | "equal", // What the tuner's interval meter compares with
  tunerSmoothing: 0.75, // How slowly the tuner's dials follow a note (only the display)
  tunerHold     : 1.5,  // Seconds the tuner keeps showing a note at full brightness after it stops
};

// The range of the frequency axis is chosen in notes when the axis is in notes, and in Hz otherwise.
const axisSelect    = $<HTMLSelectElement>("ft-axis");
const rangeLabel    = $<HTMLLabelElement>("ft-range-label");
const noteRange     = $<HTMLSpanElement>("ft-range-notes");
const hzRange       = $<HTMLSpanElement>("ft-range-hz");
const fMinInput     = $<HTMLInputElement>("ft-fmin");
const fMaxInput     = $<HTMLInputElement>("ft-fmax");
const RANGE_NOTE_LO = 12;  // C0, the lowest note that can be chosen for the range
const RANGE_NOTE_HI = 131; // B9, the highest

// Each end of the note range is chosen as a note name and an octave.
interface RangeEnd { name: HTMLSelectElement; octave: HTMLSelectElement; }
const rangeLo: RangeEnd = { name: $<HTMLSelectElement>("ft-note-min-name"), octave: $<HTMLSelectElement>("ft-note-min-octave") };
const rangeHi: RangeEnd = { name: $<HTMLSelectElement>("ft-note-max-name"), octave: $<HTMLSelectElement>("ft-note-max-octave") };
const rangeEndSelects = [rangeLo.name, rangeLo.octave, rangeHi.name, rangeHi.octave];

const rangeEndNote = (end: RangeEnd) => 12 * (Number(end.octave.value) + 1) + Number(end.name.value);

function setRangeEnd(end: RangeEnd, midi: number): void {
  end.name.value   = String(((midi % 12) + 12) % 12);
  end.octave.value = String(Math.floor(midi / 12) - 1);
}

function fillRangeEnds(): void {
  for (const end of [rangeLo, rangeHi]) {
    NOTE_NAMES.forEach((name, pc) => end.name.add(new Option(name, String(pc))));
    for (let octave = RANGE_NOTE_LO / 12 - 1; octave <= (RANGE_NOTE_HI + 1) / 12 - 2; octave++) {
      end.octave.add(new Option(String(octave), String(octave)));
    }
  }
  setRangeEnd(rangeLo, 31);  // G1
  setRangeEnd(rangeHi, 108); // C8
}

function showRangeUnits(axis: "note" | "linear"): void {
  noteRange.hidden = axis !== "note";
  hzRange.hidden   = axis === "note";
  rangeLabel.textContent = axis === "note" ? "Note range" : "Frequency range (Hz)";
  rangeLabel.htmlFor = axis === "note" ? rangeLo.name.id : fMinInput.id;
}

// Carries the current range over to the controls for the other units.
function switchRangeUnits(axis: "note" | "linear"): void {
  if (axis === "note") {
    const clamp = (m: number) => Math.min(RANGE_NOTE_HI, Math.max(RANGE_NOTE_LO, Math.round(m)));
    const lo = clamp(midiFromFreq(settings.fMin) + 0.5), hi = clamp(midiFromFreq(settings.fMax) - 0.5);
    setRangeEnd(rangeLo, lo);
    setRangeEnd(rangeHi, Math.max(lo, hi));
  } else {
    fMinInput.value = String(Math.round(settings.fMin));
    fMaxInput.value = String(Math.round(settings.fMax));
  }
  showRangeUnits(axis);
}

// Reads the range from the controls for the current units, marking an unusable range in red
// rather than silently ignoring it.
function readRange(): void {
  let message = "";
  if (settings.axis === "note") {
    // The range includes all of both end notes, so a single note can be chosen to zoom in on it.
    const lo = rangeEndNote(rangeLo), hi = rangeEndNote(rangeHi);
    if (hi >= lo) {
      settings.fMin = freqFromMidi(lo - 0.5);
      settings.fMax = freqFromMidi(hi + 0.5);
    } else {
      message = "The lowest note must not be above the highest.";
    }
    rangeEndSelects.forEach(select => select.setCustomValidity(message));
  } else {
    const fMin = Number(fMinInput.value), fMax = Number(fMaxInput.value);
    if (fMin >= 10 && fMax > fMin && fMax <= 20000) {
      settings.fMin = fMin;
      settings.fMax = fMax;
    } else {
      message = "Use a range from 10 Hz to 20000 Hz, with the lowest frequency below the highest.";
    }
    fMinInput.setCustomValidity(message);
    fMaxInput.setCustomValidity(message);
  }
}

function readSettings(): void {
  const axis = axisSelect.value as "note" | "linear";
  if (axis !== settings.axis) switchRangeUnits(axis);
  settings.axis          = axis;
  settings.scale         = $<HTMLSelectElement>("ft-scale").value as "linear" | "db";
  settings.window        = $<HTMLSelectElement>("ft-window").value;
  settings.smoothing     = Number($<HTMLInputElement>("ft-smoothing").value);
  settings.threshold     = Number($<HTMLInputElement>("ft-threshold").value) / 100;
  settings.minDb         = Number($<HTMLInputElement>("ft-min-level").value);
  settings.hideHarmonics = $<HTMLInputElement>("ft-ignore-harmonics").checked;
  settings.showFits      = $<HTMLInputElement>("ft-show-fits").checked;
  settings.showWaveform  = $<HTMLInputElement>("ft-show-waveform").checked;
  settings.noiseStrength = Number($<HTMLInputElement>("ft-noise-strength").value);
  $<HTMLOutputElement>("ft-noise-strength-out").value = `${settings.noiseStrength.toFixed(2)}×`;
  settings.tunerNotes     = Number($<HTMLSelectElement>("ft-tuner-notes").value);
  settings.intervalRef    = $<HTMLSelectElement>("ft-interval-ref").value as "just" | "equal";
  settings.tunerSmoothing = Number($<HTMLInputElement>("ft-tuner-smoothing").value);
  settings.tunerHold      = Number($<HTMLInputElement>("ft-tuner-hold").value);
  $<HTMLOutputElement>("ft-tuner-smoothing-out").value = settings.tunerSmoothing.toFixed(2);
  $<HTMLOutputElement>("ft-tuner-hold-out").value = `${settings.tunerHold.toFixed(1)} s`;

  const a4 = Number($<HTMLInputElement>("ft-a4").value);
  if (a4 >= 300 && a4 <= 600) settings.a4 = a4;
  readRange();

  const fftSize = Number($<HTMLSelectElement>("ft-size").value);
  if (fftSize !== settings.fftSize || windowName !== settings.window) {
    settings.fftSize = fftSize;
    configureAnalysis();
  }

  $<HTMLOutputElement>("ft-smoothing-out").value = settings.smoothing.toFixed(2);
  $<HTMLOutputElement>("ft-threshold-out").value = formatThreshold();
  // In the same units as the spectrum's magnitude axis.
  $<HTMLOutputElement>("ft-min-level-out").value = settings.scale === "db"
    ? `${settings.minDb} dB`
    : (10 ** (settings.minDb / 20)).toPrecision(2);
  updateResolutionNote();
  updateTonePitch();
}

// The peak threshold, relative to the loudest peak, in the same units as the spectrum's magnitude
// axis: a fraction of its height, or how many decibels below it.
function formatThreshold(): string {
  return settings.scale === "db"
    ? `−${(-20 * Math.log10(settings.threshold)).toFixed(1)} dB`
    : settings.threshold.toFixed(2);
}

// ⋘──────── Pitch ────────⋙
// Pitches are MIDI note numbers: 69 is A4, and each semitone is 1, so the fractional part is the
// distance from the nearest note in hundredths of a semitone (cents).

const midiFromFreq = (f: number) => 69 + 12 * Math.log2(f / settings.a4);
const freqFromMidi = (m: number) => settings.a4 * 2 ** ((m - 69) / 12);
const centsOff     = (midi: number) => 100 * (midi - Math.round(midi));

function noteName(midi: number): string {
  const m = Math.round(midi);
  return NOTE_NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
}

function formatCents(cents: number): string {
  const c = Math.round(cents);
  return c === 0 ? "±0¢" : `${c > 0 ? "+" : "−"}${Math.abs(c)}¢`;
}

// The color of a pitch, running through the rainbow from low to high (as in the original sketch).
const pitchHue = (midi: number) => (((midi - 21) / 130) * 360 - 18 + 360) % 360;

// Green when in tune, through yellow, to red at a quarter tone off.
const centsColor = (cents: number) => `hsl(${120 * (1 - Math.min(1, Math.abs(cents) / 50))}, 80%, 55%)`;

// ⋘──────── FFT ────────⋙

type WindowFunction = (n: number, N: number) => number;
const WINDOWS: Record<string, WindowFunction> = {
  rectangular  : () => 1,
  bartlett     : (n, N) => 1 - Math.abs(2 * n / (N - 1) - 1),
  bartletthann : (n, N) => 0.62 - 0.48 * Math.abs(n / (N - 1) - 0.5) - 0.38 * Math.cos(2 * Math.PI * n / (N - 1)),
  blackman     : (n, N) => 0.42 - 0.5 * Math.cos(2 * Math.PI * n / (N - 1)) + 0.08 * Math.cos(4 * Math.PI * n / (N - 1)),
  cosine       : (n, N) => Math.sin(Math.PI * n / (N - 1)),
  gauss        : (n, N) => Math.exp(-0.5 * ((n - (N - 1) / 2) / (GAUSS_ALPHA * (N - 1) / 2)) ** 2),
  hamming      : (n, N) => 0.54 - 0.46 * Math.cos(2 * Math.PI * n / (N - 1)),
  hann         : (n, N) => 0.5 - 0.5 * Math.cos(2 * Math.PI * n / (N - 1)),
  lanczos      : (n, N) => {
    const x = 2 * n / (N - 1) - 1;
    return x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);
  },
  triangular   : (n, N) => 1 - Math.abs((n - (N - 1) / 2) / (N / 2)),
};

// In-place radix-2 FFT of a power-of-two length.
class FFT {
  readonly size: number;
  private readonly reversed: Uint32Array;
  private readonly cos: Float64Array;
  private readonly sin: Float64Array;

  constructor(size: number) {
    this.size = size;
    const bits = Math.log2(size);
    this.reversed = new Uint32Array(size);
    for (let i = 0; i < size; i++) {
      let r = 0;
      for (let b = 0; b < bits; b++) r |= ((i >> b) & 1) << (bits - 1 - b);
      this.reversed[i] = r;
    }
    this.cos = new Float64Array(size / 2);
    this.sin = new Float64Array(size / 2);
    for (let k = 0; k < size / 2; k++) {
      this.cos[k] = Math.cos(2 * Math.PI * k / size);
      this.sin[k] = Math.sin(2 * Math.PI * k / size);
    }
  }

  transform(re: Float64Array, im: Float64Array): void {
    const n = this.size;
    for (let i = 0; i < n; i++) {
      const j = this.reversed[i];
      if (j > i) {
        [re[i], re[j]] = [re[j], re[i]];
        [im[i], im[j]] = [im[j], im[i]];
      }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const half = len >> 1, step = n / len;
      for (let i = 0; i < n; i += len) {
        for (let j = 0; j < half; j++) {
          const wr = this.cos[j * step], wi = -this.sin[j * step];
          const a = i + j, b = a + half;
          const tr = re[b] * wr - im[b] * wi;
          const ti = re[b] * wi + im[b] * wr;
          re[b] = re[a] - tr;
          im[b] = im[a] - ti;
          re[a] += tr;
          im[a] += ti;
        }
      }
    }
  }
}

// ⋘──────── Analysis state ────────⋙

let sampleRate = 48000;
let binHz      = 0;
let fft        = new FFT(2);
let windowName = "";
let win        = new Float64Array(0);
let winSum     = 1;
let timeBuf    = new Float32Array(0);
let re         = new Float64Array(0);
let im         = new Float64Array(0);
let spectrum   = new Float64Array(0); // Smoothed magnitude of each bin; a full-scale sine has magnitude 1

function configureAnalysis(): void {
  const N = settings.fftSize;
  if (analyser) {
    analyser.fftSize = N;
    sampleRate = analyser.context.sampleRate;
  }
  binHz = sampleRate / N;
  if (fft.size !== N) {
    fft      = new FFT(N);
    timeBuf  = new Float32Array(N);
    re       = new Float64Array(N);
    im       = new Float64Array(N);
    spectrum = new Float64Array(N / 2 + 1);
  }
  windowName = settings.window;
  const w = WINDOWS[windowName];
  win = new Float64Array(N);
  winSum = 0;
  for (let n = 0; n < N; n++) winSum += win[n] = w(n, N);
  updateResolutionNote();
  // The noise measured in each bin depends on the bins and the window.
  noiseFrames = null;
  applyCalibration();
}

function updateResolutionNote(): void {
  const N = settings.fftSize;
  $<HTMLOutputElement>("ft-size-out").value =
    `${(sampleRate / N).toFixed(1)} Hz between bins, ${Math.round(1000 * N / sampleRate)} ms of audio`;
}

interface Peak {
  freq       : number;      // Interpolated center frequency (Hz)
  mag        : number;      // Interpolated peak magnitude
  bin        : number;      // Magnitude of the peak's highest bin, as drawn on the spectrum
  curv       : number;      // Curvature of ln(magnitude) at the peak, per Hz² (negative)
  midi       : number;
  fundamental: Peak | null; // The lower peak that this one is a harmonic of, if any
  harmonic   : number;      // Which harmonic of `fundamental` this is (1 if it isn't a harmonic)
}

let peaks: Peak[] = [];
let peakFloor = 0; // Peaks whose highest bin is below this are ignored

// Fits a Gaussian through bins k − 1, k, and k + 1, which is a parabola through the logarithms of
// their magnitudes, and returns its peak.
function interpolatePeak(k: number): Peak | null {
  const la = Math.log(spectrum[k - 1] + EPS);
  const lb = Math.log(spectrum[k] + EPS);
  const lc = Math.log(spectrum[k + 1] + EPS);
  const denom = la - 2 * lb + lc;
  if (!(denom < 0)) return null;
  const delta = 0.5 * (la - lc) / denom; // Offset of the peak from bin k, in bins (between −½ and ½)
  const freq  = (k + delta) * binHz;
  return {
    freq,
    // When a neighboring bin is nearly zero (as after removing background noise), the parabola
    // through the logarithms is very lopsided and overshoots, so the peak is capped at the most
    // that any of the windows can put it above its highest bin.
    mag        : Math.min(Math.exp(lb - 0.25 * (la - lc) * delta), MAX_PEAK_GAIN * spectrum[k]),
    bin        : spectrum[k],
    curv       : denom / (2 * binHz * binHz),
    midi       : midiFromFreq(freq),
    fundamental: null,
    harmonic   : 1,
  };
}

function findPeaks(): Peak[] {
  const kLo = Math.max(2, Math.ceil(DETECT_MIN_HZ / binHz));
  const kHi = Math.min(spectrum.length - 2, Math.floor(DETECT_MAX_HZ / binHz));
  const candidates: Peak[] = [];
  let strongest = 0;
  for (let k = kLo; k <= kHi; k++) {
    if (spectrum[k] > spectrum[k - 1] && spectrum[k] >= spectrum[k + 1]) {
      const p = interpolatePeak(k);
      if (!p) continue;
      candidates.push(p);
      strongest = Math.max(strongest, p.bin);
    }
  }
  // Peaks are compared with the cutoffs by their highest bins, so that what's counted matches
  // the spectrum and the cutoff line drawn on it.
  const minMag = 10 ** (settings.minDb / 20);
  const floor  = peakFloor = Math.max(settings.threshold * strongest, minMag);
  candidates.sort((a, b) => b.bin - a.bin);
  const found = candidates.filter(p => p.bin >= floor).slice(0, MAX_PEAKS);

  // A note's fundamental can be much quieter than its harmonics (as on a violin's G string), so
  // a quieter peak is kept if at least two of the peaks found are its harmonics.
  const explained = new Set<Peak>();
  for (const c of candidates) {
    if (c.bin >= floor || c.bin < Math.max(WEAK_FUNDAMENTAL * strongest, minMag)) continue;
    const overtones = found.filter(p => !explained.has(p) && harmonicNumber(p.freq, c.freq) > 0);
    if (overtones.length >= 2) {
      found.push(c);
      overtones.forEach(p => explained.add(p));
    }
  }
  found.sort((a, b) => a.freq - b.freq);

  // Marks each peak that sits at a whole-number multiple of a lower peak as that peak's harmonic.
  for (const p of found) {
    for (const q of found) {
      if (q.freq >= p.freq) break;
      if (q.fundamental) continue;
      const n = harmonicNumber(p.freq, q.freq);
      if (n) {
        p.fundamental = q;
        p.harmonic    = n;
        break;
      }
    }
  }

  // Quieter peaks at the harmonics of the notes found are marked as harmonics too (but never
  // named as notes): for each note and each harmonic it doesn't have yet, the strongest candidate
  // there that's at least WEAK_HARMONIC of the loudest peak (and above the quietest-peak level).
  if (settings.hideHarmonics) {
    const taken = new Set(found);
    const weakest = Math.max(WEAK_HARMONIC * strongest, minMag);
    for (const q of found.filter(p => !p.fundamental)) {
      const has = new Set(found.filter(p => p.fundamental === q).map(p => p.harmonic));
      for (const c of candidates) { // Loudest first
        if (c.bin < weakest) break;
        const n = harmonicNumber(c.freq, q.freq);
        if (!n || n > N_HARMONICS || has.has(n) || taken.has(c)) continue;
        c.fundamental = q;
        c.harmonic    = n;
        has.add(n);
        taken.add(c);
        found.push(c);
      }
    }
    found.sort((a, b) => a.freq - b.freq);
  }
  return found;
}

// n if f is close to the nth harmonic of f0 (for n ≥ 2), and otherwise 0.
function harmonicNumber(f: number, f0: number): number {
  const ratio = f / f0, n = Math.round(ratio);
  return n >= 2 && Math.abs(1200 * Math.log2(ratio / n)) < HARMONIC_CENTS ? n : 0;
}

// ⋘──────── Tuner and history state ────────⋙

// The notes shown on the tuner, lowest first: each one's smoothed pitch, and when it was last heard.
interface TunerSlot { midi: number; lastHeard: number; }
let tunerSlots: TunerSlot[] = [];
let clock     = 0;                   // Time of the latest analyzed frame (s); stops while frozen
let frozen    = false;

interface HistoryNote { midi: number; level: number; }
interface HistoryFrame { t: number; notes: HistoryNote[]; }
const history: HistoryFrame[] = [];

// Each note (by its nearest semitone) heard recently: when it started, when it was last heard,
// whether it has lasted long enough to count, and (until then) its entries waiting to be added
// to the history.
interface NoteRun { start: number; last: number; confirmed: boolean; pending: { frame: HistoryFrame; note: HistoryNote }[]; }
const noteRuns = new Map<number, NoteRun>();
let historyLo = 57, historyHi = 81; // Range of notes shown in the history, eased toward the notes heard

function analyze(): void {
  if (!analyser) return;
  analyser.getFloatTimeDomainData(timeBuf);
  for (let i = 0; i < re.length; i++) {
    re[i] = timeBuf[i] * win[i];
    im[i] = 0;
  }
  fft.transform(re, im);
  const a = settings.smoothing, scale = 2 / winSum, strength = settings.noiseStrength;
  const raw = noiseFrames ? new Float32Array(spectrum.length) : null; // Recorded while calibrating
  for (let k = 0; k < spectrum.length; k++) {
    let mag = Math.hypot(re[k], im[k]) * scale;
    if (raw) raw[k] = mag;
    if (noise) mag = Math.max(0, mag - strength * noise[k]);
    spectrum[k] = a * spectrum[k] + (1 - a) * mag;
  }
  if (raw) recordNoiseFrame(raw);

  clock = performance.now() / 1000;
  peaks = findPeaks();
  let strongest: Peak | null = null;
  for (const p of peaks) if (!strongest || p.mag > strongest.mag) strongest = p;

  // Noise can poke a peak just above the cutoff for a frame or two, so a note is only recorded,
  // and only shown on the tuner, once it has lasted NOTE_CONFIRM_SECONDS. Its first moments are
  // then added to the history too, so the note starts at the right time.
  const frame: HistoryFrame = { t: clock, notes: [] };
  const shown = new Set(notePeaks());
  for (const p of peaks) {
    const row = Math.round(p.midi);
    let run = noteRuns.get(row);
    if (!run || clock - run.last > HISTORY_GAP_SECONDS) noteRuns.set(row, run = { start: clock, last: clock, confirmed: false, pending: [] });
    run.last = clock;
    if (shown.has(p)) {
      const note = { midi: p.midi, level: strongest ? p.mag / strongest.mag : 0 };
      if (run.confirmed) frame.notes.push(note);
      else run.pending.push({ frame, note });
    }
    if (!run.confirmed && clock - run.start >= NOTE_CONFIRM_SECONDS) {
      run.confirmed = true;
      run.pending.forEach(({ frame, note }) => frame.notes.push(note));
      run.pending = [];
    }
  }
  for (const [row, run] of noteRuns) if (clock - run.last > HISTORY_GAP_SECONDS) noteRuns.delete(row);
  history.push(frame);
  while (history.length && history[0].t < clock - HISTORY_SECONDS) history.shift();

  updateTuner();
}

// Points the tuner's slots at the loudest notes that have lasted long enough to count, by the
// loudness of each note together with its harmonics (so that a low note with a weak fundamental
// isn't passed over). A slot follows its note while it's sounding, eased by the display smoothing,
// and jumps to a new note when its own has stopped. The slots are kept in order of pitch.
function updateTuner(): void {
  const count = settings.tunerNotes;
  if (tunerSlots.length > count) tunerSlots = tunerSlots.sort((a, b) => b.lastHeard - a.lastHeard).slice(0, count);

  const loudness = new Map<Peak, number>();
  for (const p of notePeaks()) if (noteRuns.get(Math.round(p.midi))?.confirmed) loudness.set(p, p.mag);
  for (const p of peaks) {
    if (p.fundamental && loudness.has(p.fundamental)) loudness.set(p.fundamental, loudness.get(p.fundamental)! + p.mag);
  }
  const targets = [...loudness.keys()].sort((a, b) => loudness.get(b)! - loudness.get(a)!).slice(0, count);

  const ease = 1 - settings.tunerSmoothing;
  const used = new Set<TunerSlot>();
  for (const note of targets) {
    let slot = tunerSlots.find(s => !used.has(s) && Math.abs(s.midi - note.midi) < 0.5);
    if (slot) {
      slot.midi += (note.midi - slot.midi) * ease;
    } else if (tunerSlots.length < count) {
      tunerSlots.push(slot = { midi: note.midi, lastHeard: clock });
    } else {
      // The slot whose note was heard least recently switches to this note.
      slot = tunerSlots.filter(s => !used.has(s)).sort((a, b) => a.lastHeard - b.lastHeard)[0];
      slot.midi = note.midi;
    }
    slot.lastHeard = clock;
    used.add(slot);
  }
  tunerSlots.sort((a, b) => a.midi - b.midi);
}

// The peaks that are labeled as notes.
const notePeaks = () => settings.hideHarmonics ? peaks.filter(p => !p.fundamental) : peaks;

// ⋘──────── Audio sources ────────⋙

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let stopSource: (() => void) | null = null;
let mediaNode: MediaElementAudioSourceNode | null = null;

function ensureContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    analyser = audioCtx.createAnalyser();
    // Some browsers only process nodes that lead to the output, so the analyser feeds a silent gain.
    const sink = audioCtx.createGain();
    sink.gain.value = 0;
    analyser.connect(sink).connect(audioCtx.destination);
    configureAnalysis();
  }
  void audioCtx.resume();
  return audioCtx;
}

function setStatus(message: string, kind: "error" | "info" = "error"): void {
  statusLine.textContent = message;
  statusLine.hidden = !message;
  statusLine.classList.toggle("ft-status-info", kind === "info");
}

function stop(): void {
  stopSource?.();
  stopSource = null;
  startButton.textContent = "▶ Start";
}

async function startMicrophone(): Promise<void> {
  const ctx = ensureContext();
  if (!navigator.mediaDevices?.getUserMedia) {
    setStatus("This browser doesn't allow microphone access on this page.");
    return;
  }
  try {
    // Echo cancellation and noise suppression are designed for speech and would distort the spectrum.
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    });
    const node = ctx.createMediaStreamSource(stream);
    node.connect(analyser!);
    stopSource = () => {
      node.disconnect();
      stream.getTracks().forEach(track => track.stop());
    };
    startButton.textContent = "■ Stop";
    setStatus("");
    resumeWhenAllowed(ctx);
  } catch (err) {
    setStatus(`Couldn't open the microphone (${(err as Error).message}).`);
  }
}

// Starts listening right away for visitors who have already allowed this page to use the
// microphone (and who were using the microphone last time).
async function autoStartMicrophone(): Promise<void> {
  if (sourceSelect.value !== "mic") return;
  try {
    const permission = await navigator.permissions.query({ name: "microphone" as PermissionName });
    if (permission.state === "granted" && !stopSource) await startMicrophone();
  } catch { /* The browser can't report whether the microphone is allowed */ }
}

// Browsers may keep audio paused until the visitor interacts with the page, which happens when
// the microphone starts without a click. Listening then begins on the first click or key press.
function resumeWhenAllowed(ctx: AudioContext): void {
  setTimeout(() => {
    if (ctx.state === "running") return;
    setStatus("Click anywhere on the page to start listening.", "info");
    const resume = () => {
      void ctx.resume().then(() => setStatus(""));
      document.removeEventListener("pointerdown", resume);
      document.removeEventListener("keydown", resume);
    };
    document.addEventListener("pointerdown", resume);
    document.addEventListener("keydown", resume);
  }, 500);
}

// Harmonic amplitudes (starting with the fundamental) of the test tone's timbres.
const TIMBRES: Record<string, number[]> = {
  sine   : [1],
  bright : Array.from({ length: 16 }, (_, i) => 1 / (i + 1)),
  hollow : Array.from({ length: 16 }, (_, i) => i % 2 === 0 ? 1 / (i + 1) : 0),
  missing: [0.05, 1, 0.8, 0.6, 0.4, 0.3, 0.2],
};
// Intervals (in semitones) above the test tone's pitch of each extra note.
const CHORDS: Record<string, number[]> = {
  single : [0],
  fifth  : [0, 7],
  triad  : [0, 4, 7],
  minor7 : [0, 3, 7, 10],
};

let toneOscillators: OscillatorNode[] = [];

function startTone(): void {
  const ctx = ensureContext();
  const amps  = TIMBRES[toneTimbre.value];
  const real  = new Float32Array(amps.length + 1);
  const imag  = new Float32Array([0, ...amps]);
  const wave  = ctx.createPeriodicWave(real, imag);
  const chord = CHORDS[toneChord.value];

  const bus = ctx.createGain();
  bus.gain.value = 0.25 / chord.length;
  const out = ctx.createGain();
  out.gain.value = toneAudible.checked ? 1 : 0;
  bus.connect(analyser!);
  bus.connect(out).connect(ctx.destination);

  toneOscillators = chord.map(interval => {
    const osc = ctx.createOscillator();
    osc.setPeriodicWave(wave);
    osc.frequency.value = freqFromMidi(Number(tonePitch.value) + interval);
    osc.connect(bus);
    osc.start();
    return osc;
  });
  const audibleChanged = () => out.gain.setTargetAtTime(toneAudible.checked ? 1 : 0, ctx.currentTime, 0.02);
  toneAudible.addEventListener("change", audibleChanged);

  stopSource = () => {
    toneOscillators.forEach(osc => osc.stop());
    toneOscillators = [];
    bus.disconnect();
    out.disconnect();
    toneAudible.removeEventListener("change", audibleChanged);
  };
  startButton.textContent = "■ Stop";
}

function updateTonePitch(): void {
  const midi = Number(tonePitch.value);
  tonePitchOut.value = `${noteName(midi)} ${formatCents(centsOff(midi))} (${freqFromMidi(midi).toFixed(1)} Hz)`;
  const chord = CHORDS[toneChord.value];
  if (!audioCtx) return;
  toneOscillators.forEach((osc, i) =>
    osc.frequency.setTargetAtTime(freqFromMidi(midi + chord[i]), audioCtx!.currentTime, 0.02));
}

function connectFile(): void {
  const ctx = ensureContext();
  if (!mediaNode) {
    mediaNode = ctx.createMediaElementSource(audioElement);
    mediaNode.connect(ctx.destination);
  }
  mediaNode.connect(analyser!);
  stopSource = () => {
    audioElement.pause();
    mediaNode!.disconnect(analyser!);
  };
}

function showSourceControls(): void {
  const source = sourceSelect.value;
  toneControls.hidden = source !== "tone";
  fileControls.hidden = source !== "file";
  startButton.hidden  = source === "file";
}

sourceSelect.addEventListener("change", () => {
  stop();
  setStatus("");
  showSourceControls();
  if (sourceSelect.value === "file" && audioElement.src) connectFile();
});

startButton.addEventListener("click", () => {
  if (stopSource) { stop(); return; }
  if (sourceSelect.value === "mic") void startMicrophone();
  else if (sourceSelect.value === "tone") startTone();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  if (audioElement.src) URL.revokeObjectURL(audioElement.src);
  audioElement.src = URL.createObjectURL(file);
  audioElement.hidden = false;
  if (!stopSource) connectFile();
  void audioElement.play();
});
audioElement.addEventListener("play", () => {
  void audioCtx?.resume();
  if (!stopSource) connectFile();
});

// Restarts the test tone when its timbre or chord changes.
for (const el of [toneTimbre, toneChord]) {
  el.addEventListener("change", () => {
    if (stopSource && sourceSelect.value === "tone") {
      stop();
      startTone();
    }
  });
}

// ⋘──────── Background noise ────────⋙
// Steady background noise, like the hum of a fan or traffic, can make the largest peaks in the
// spectrum, usually at low frequencies. Calibrating while it's quiet records each bin's
// magnitude over a few seconds. The level that each bin stays below 95% of the time is taken
// as its noise level, which covers the noise's random ups and downs, and is then spread to the
// neighboring bins, which covers a hum whose pitch drifts slightly. That level, times the
// "noise removal strength" setting, is subtracted from every spectrum.
//
// The calibration is saved in the browser and used again on later visits, as long as the FFT
// size, window, and sample rate are the same (since each bin's noise level depends on them).

const NOISE_SECONDS     = 4;
const NOISE_FRAME_SECS  = 0.04; // Shortest time between the spectra recorded while calibrating
const NOISE_PERCENTILE  = 0.95;
const NOISE_SPREAD_BINS = 2;
const NOISE_STORAGE_KEY = "multi_note_tuner_noise";
const CALIBRATION_MISMATCH = "The background noise calibration doesn't apply with this window, FFT size, or audio device, so noise isn't being removed. Recalibrate, or change the settings back.";
const noiseButton      = $<HTMLButtonElement>("ft-noise");
const clearNoiseButton = $<HTMLButtonElement>("ft-noise-clear");
const noiseNote        = $<HTMLSpanElement>("ft-noise-note");

interface NoiseCalibration {
  fftSize   : number;
  window    : string;
  sampleRate: number;
  level     : Float32Array; // Noise level of each bin
  savedAt   : number;       // When it was calibrated (ms since 1970)
  previous  : boolean;      // Whether it was loaded from an earlier visit
}

let calibration: NoiseCalibration | null = null;
let noise: Float32Array | null = null;          // The calibration's levels, while it applies to the current settings
let noiseFrames: Float32Array[] | null = null;  // Spectra recorded while calibrating
let noiseLastFrame = 0;                         // When the last spectrum was recorded (s)
let noiseEnd       = 0;                         // When calibrating stops (s)

// Uses the calibration only if it was made with the current FFT size, window, and sample rate.
function applyCalibration(): void {
  const c = calibration;
  const matches = !!c && c.fftSize === settings.fftSize && c.window === settings.window && c.sampleRate === sampleRate;
  if (c && !matches && noise) setStatus(CALIBRATION_MISMATCH, "info");
  else if (matches && statusLine.textContent === CALIBRATION_MISMATCH) setStatus("", "info");
  noise = matches ? c!.level : null;
  updateNoiseControls();
}

function updateNoiseControls(): void {
  noiseButton.disabled = !!noiseFrames;
  noiseButton.textContent = noiseFrames ? "Calibrating…" : noise ? "Recalibrate background noise" : "Calibrate background noise";
  clearNoiseButton.hidden = !noise || !!noiseFrames;
  const previous = !!noise && calibration!.previous && !noiseFrames;
  noiseNote.hidden = !previous;
  if (previous) {
    const when = new Date(calibration!.savedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
    noiseNote.textContent = `⚠ Using a calibration from ${when}`;
  }
}

function calibrateNoise(): void {
  if (!stopSource || audioCtx?.state !== "running") {
    setStatus("Start the input first, then calibrate the background noise while it's quiet.", "info");
    return;
  }
  if (frozen) freezeButton.click();
  noiseFrames    = [];
  noiseLastFrame = 0;
  noiseEnd       = performance.now() / 1000 + NOISE_SECONDS;
  updateNoiseControls();
  setStatus(`Calibrating the background noise. Keep quiet for ${NOISE_SECONDS} seconds.`, "info");
}

// Called with each new spectrum's magnitudes (before any noise is removed) while calibrating.
function recordNoiseFrame(mags: Float32Array): void {
  const now = performance.now() / 1000;
  if (now - noiseLastFrame >= NOISE_FRAME_SECS) {
    noiseFrames!.push(mags);
    noiseLastFrame = now;
  }
  if (now >= noiseEnd) finishNoise();
}

function finishNoise(): void {
  const frames = noiseFrames!, bins = frames[0].length;
  const percentile = new Float32Array(bins), values = new Float32Array(frames.length);
  for (let k = 0; k < bins; k++) {
    frames.forEach((frame, i) => values[i] = frame[k]);
    values.sort();
    percentile[k] = values[Math.floor(NOISE_PERCENTILE * (values.length - 1))];
  }
  const level = new Float32Array(bins);
  for (let k = 0; k < bins; k++) {
    for (let j = Math.max(0, k - NOISE_SPREAD_BINS); j <= Math.min(bins - 1, k + NOISE_SPREAD_BINS); j++) {
      level[k] = Math.max(level[k], percentile[j]);
    }
  }
  noiseFrames = null;
  calibration = { fftSize: settings.fftSize, window: settings.window, sampleRate, level, savedAt: Date.now(), previous: false };
  saveCalibration();
  applyCalibration();
  setStatus("Background noise calibrated. It's now removed from the spectrum.", "info");
}

function clearNoise(): void {
  calibration = null;
  noiseFrames = null;
  try {
    localStorage.removeItem(NOISE_STORAGE_KEY);
  } catch { /* Nothing saved */ }
  applyCalibration();
  setStatus("", "info");
}

function saveCalibration(): void {
  const c = calibration!;
  const bytes = new Uint8Array(c.level.buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  const saved = { fftSize: c.fftSize, window: c.window, sampleRate: c.sampleRate, savedAt: c.savedAt, level: btoa(binary) };
  try {
    localStorage.setItem(NOISE_STORAGE_KEY, JSON.stringify(saved));
  } catch { /* Not saved, for example if storage is full or unavailable */ }
}

function loadCalibration(): void {
  try {
    const saved = JSON.parse(localStorage.getItem(NOISE_STORAGE_KEY) ?? "null");
    if (!saved) return;
    const binary = atob(saved.level);
    const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
    calibration = {
      fftSize: saved.fftSize, window: saved.window, sampleRate: saved.sampleRate, savedAt: saved.savedAt,
      level: new Float32Array(bytes.buffer), previous: true,
    };
  } catch { /* Nothing usable saved */ }
}

noiseButton.addEventListener("click", calibrateNoise);
clearNoiseButton.addEventListener("click", clearNoise);

freezeButton.addEventListener("click", () => {
  frozen = !frozen;
  freezeButton.textContent = frozen ? "▶ Resume" : "❚❚ Freeze";
  freezeButton.setAttribute("aria-pressed", String(frozen));
});

document.querySelectorAll<HTMLElement>(".ft-settings input, .ft-settings select, #ft-tone-pitch").forEach(el =>
  el.addEventListener("input", readSettings));

// ⋘──────── Canvas helpers ────────⋙

const dpr = () => window.devicePixelRatio || 1;

// Matches the canvas's resolution to its displayed width and returns a context in CSS pixels.
// In full screen, a canvas fills the screen's height. Otherwise it's `height` tall.
const FULL_PAD = 24; // Padding of a panel in full screen (px)

function canvasHeight(canvas: HTMLCanvasElement, height: number): number {
  const full = document.fullscreenElement;
  if (!full || !full.contains(canvas)) return height;
  return Math.max(height / 2, Math.floor(window.innerHeight - FULL_PAD));
}

const TUNER_H    = 160; // Height of a tuner dial (px)
const INTERVAL_H = 76;  // Height of the interval readout below two dials (px)

function fitCanvas(canvas: HTMLCanvasElement, normalHeight: number): { ctx: CanvasRenderingContext2D; w: number; h: number } {
  const height = canvasHeight(canvas, normalHeight);
  const w = canvas.clientWidth;
  if (canvas.width !== Math.round(w * dpr()) || canvas.height !== Math.round(height * dpr())) {
    canvas.width  = Math.round(w * dpr());
    canvas.height = Math.round(height * dpr());
    canvas.style.height = `${height}px`;
  }
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, height);
  return { ctx, w, h: height };
}

function placeholder(ctx: CanvasRenderingContext2D, w: number, h: number, text: string): void {
  ctx.fillStyle = MUTED;
  ctx.font = "14px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);
}

// ⋘──────── Tuner ────────⋙

function drawTuner(): void {
  const two = settings.tunerNotes === 2;
  const layoutH = TUNER_H + (two ? INTERVAL_H : 0);
  const { ctx, w: canvasW, h } = fitCanvas(tunerCanvas, layoutH);
  // The tuner is laid out for a layoutH-tall canvas. In full screen it's scaled up to fill the
  // larger one (as far as the width allows) and centered.
  const scale = Math.max(1, Math.min(h / layoutH, canvasW / (two ? 520 : 320)));
  ctx.translate(0, (h - layoutH * scale) / 2);
  ctx.scale(scale, scale);
  const w = canvasW / scale;

  if (!two) {
    drawDial(ctx, tunerSlots[0], 0, w, "Play a note");
    return;
  }
  const [low, high] = tunerSlots;
  drawDial(ctx, low, 0, w / 2, "Play a note");
  drawDial(ctx, high, w / 2, w / 2, low ? "Play a second note" : "");
  ctx.strokeStyle = GRID;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w / 2, 12);
  ctx.lineTo(w / 2, TUNER_H - 12);
  ctx.moveTo(20, TUNER_H + 0.5);
  ctx.lineTo(w - 20, TUNER_H + 0.5);
  ctx.stroke();
  drawInterval(ctx, low, high, w);
}

const isRecent = (slot: TunerSlot) => clock - slot.lastHeard < settings.tunerHold;

// One note's name, frequency, and a meter from −50 to +50 cents, in the column [x0, x0 + width].
// Notes that stopped more than the hold time ago are dimmed.
function drawDial(ctx: CanvasRenderingContext2D, slot: TunerSlot | undefined, x0: number, width: number, emptyText: string): void {
  const cx = x0 + width / 2;
  ctx.globalAlpha = slot && isRecent(slot) ? 1 : 0.35;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = TEXT;
  ctx.font = "bold 44px system-ui, sans-serif";
  ctx.fillText(slot ? noteName(slot.midi) : "–", cx, 52);

  const cents = slot ? centsOff(slot.midi) : 0;
  ctx.font = "14px system-ui, sans-serif";
  ctx.fillStyle = MUTED;
  ctx.fillText(slot ? `${freqFromMidi(slot.midi).toFixed(1)} Hz   ·   ${formatCents(cents)}` : emptyText, cx, 76);

  const L = x0 + 20, R = x0 + width - 20, y = 112, xOf = (c: number) => L + (c + 50) / 100 * (R - L);
  ctx.fillStyle = "rgba(60, 200, 90, 0.25)";
  ctx.fillRect(xOf(-IN_TUNE_CENTS), y - 16, xOf(IN_TUNE_CENTS) - xOf(-IN_TUNE_CENTS), 32);
  ctx.strokeStyle = MUTED;
  ctx.lineWidth = 1;
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillStyle = MUTED;
  for (let c = -50; c <= 50; c += 10) {
    const len = c % 50 === 0 ? 14 : 7;
    ctx.beginPath();
    ctx.moveTo(xOf(c), y - len);
    ctx.lineTo(xOf(c), y + len);
    ctx.stroke();
    if (c % 50 === 0 || (c % 25 === 0 && R - L > 200)) ctx.fillText(c === 0 ? "0" : formatCents(c), xOf(c), y + 32);
  }
  if (slot) drawNeedle(ctx, xOf(cents), y, 18, centsColor(cents));
  ctx.globalAlpha = 1;
}

function drawNeedle(ctx: CanvasRenderingContext2D, x: number, y: number, half: number, color: string): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y - half);
  ctx.lineTo(x, y + half);
  ctx.stroke();
  ctx.lineCap = "butt";
}

// The interval between the two notes: its name and size, how far it is from the equal-tempered
// and the pure (just) interval, and a meter of how far it is from the one chosen in the settings.
function drawInterval(ctx: CanvasRenderingContext2D, low: TunerSlot | undefined, high: TunerSlot | undefined, w: number): void {
  const top = TUNER_H;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  if (!low || !high) {
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = MUTED;
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText("The interval between two notes is shown here", w / 2, top + INTERVAL_H / 2 + 5);
    ctx.globalAlpha = 1;
    return;
  }
  const interval = describeInterval(100 * (high.midi - low.midi));
  ctx.globalAlpha = isRecent(low) && isRecent(high) ? 1 : 0.35;
  ctx.fillStyle = TEXT;
  ctx.font = "bold 15px system-ui, sans-serif";
  ctx.fillText(`${interval.name}   ·   ${Math.round(interval.cents)}¢`, w / 2, top + 20);
  ctx.fillStyle = MUTED;
  ctx.font = "13px system-ui, sans-serif";
  ctx.fillText(`${formatCents(interval.fromEqual)} from equal-tempered   ·   ${formatCents(interval.fromJust)} from pure (${interval.ratio})`, w / 2, top + 40);

  // Meter of the difference from the chosen reference.
  const off = settings.intervalRef === "just" ? interval.fromJust : interval.fromEqual;
  const half = Math.min(170, w / 2 - 30), L = w / 2 - half, R = w / 2 + half, y = top + 60;
  const xOf = (c: number) => L + (Math.max(-INTERVAL_RANGE, Math.min(INTERVAL_RANGE, c)) + INTERVAL_RANGE) / (2 * INTERVAL_RANGE) * (R - L);
  ctx.fillStyle = "rgba(60, 200, 90, 0.25)";
  ctx.fillRect(xOf(-IN_TUNE_CENTS), y - 7, xOf(IN_TUNE_CENTS) - xOf(-IN_TUNE_CENTS), 14);
  ctx.strokeStyle = MUTED;
  ctx.lineWidth = 1;
  for (let c = -INTERVAL_RANGE; c <= INTERVAL_RANGE; c += 10) {
    const len = c === 0 || Math.abs(c) === INTERVAL_RANGE ? 7 : 4;
    ctx.beginPath();
    ctx.moveTo(xOf(c), y - len);
    ctx.lineTo(xOf(c), y + len);
    ctx.stroke();
  }
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillStyle = MUTED;
  ctx.fillText(settings.intervalRef === "just" ? "vs. pure" : "vs. equal", L - 8, y + 4);
  drawNeedle(ctx, xOf(off), y, 8, centsColor(off));
  ctx.globalAlpha = 1;
}

// Names of the intervals within an octave, and the whole-number ratios of their pure (just)
// versions.
const INTERVALS: [string, number, number][] = [
  ["Unison", 1, 1], ["Minor second", 16, 15], ["Major second", 9, 8], ["Minor third", 6, 5],
  ["Major third", 5, 4], ["Perfect fourth", 4, 3], ["Tritone", 45, 32], ["Perfect fifth", 3, 2],
  ["Minor sixth", 8, 5], ["Major sixth", 5, 3], ["Minor seventh", 9, 5], ["Major seventh", 15, 8],
];
// Names of the intervals between an octave and two octaves.
const COMPOUND_INTERVALS = [
  "Octave", "Minor ninth", "Major ninth", "Minor tenth", "Major tenth", "Perfect eleventh",
  "Augmented eleventh", "Perfect twelfth", "Minor thirteenth", "Major thirteenth",
  "Minor fourteenth", "Major fourteenth",
];

// The nearest named interval to an interval of the given size (in cents), with how far the size
// is from its equal-tempered and pure versions.
function describeInterval(cents: number): { name: string; cents: number; fromEqual: number; fromJust: number; ratio: string } {
  const semitones = Math.max(0, Math.round(cents / 100));
  const octaves = Math.floor(semitones / 12), within = semitones % 12;
  const [simpleName, num, den] = INTERVALS[within];
  const name =
    octaves === 0 ? simpleName :
    octaves === 1 ? COMPOUND_INTERVALS[within] :
    within === 0  ? `${octaves} octaves` :
                    `${simpleName} + ${octaves} octaves`;
  let top = num * 2 ** octaves, bottom = den;
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  const g = gcd(top, bottom);
  top /= g;
  bottom /= g;
  return {
    name,
    cents,
    fromEqual: cents - 100 * semitones,
    fromJust : cents - 1200 * Math.log2(top / bottom),
    ratio    : `${top}:${bottom}`,
  };
}

// ⋘──────── Spectrum ────────⋙

const SPEC_PAD_L = 44, SPEC_PAD_R = 12, SPEC_PAD_T = 12, SPEC_LABEL_H = 70, SPEC_AXIS_H = 18;
let yMax = 0.01; // Top of the linear magnitude axis, which follows the loudest bin
let hover: { x: number; y: number } | null = null;

spectrumCanvas.addEventListener("pointermove", e => {
  const rect = spectrumCanvas.getBoundingClientRect();
  hover = { x: e.clientX - rect.left, y: e.clientY - rect.top };
});
spectrumCanvas.addEventListener("pointerleave", () => { hover = null; });

function drawSpectrum(): void {
  const { ctx, w, h } = fitCanvas(spectrumCanvas, 380);
  const L = SPEC_PAD_L, R = w - SPEC_PAD_R, top = SPEC_PAD_T;
  const base = h - SPEC_LABEL_H - SPEC_AXIS_H;
  const { fMin, fMax } = settings;
  const mLo = midiFromFreq(fMin), mHi = midiFromFreq(fMax);

  const xOf = settings.axis === "note"
    ? (f: number) => L + (midiFromFreq(f) - mLo) / (mHi - mLo) * (R - L)
    : (f: number) => L + (f - fMin) / (fMax - fMin) * (R - L);
  const fOf = settings.axis === "note"
    ? (x: number) => freqFromMidi(mLo + (x - L) / (R - L) * (mHi - mLo))
    : (x: number) => fMin + (x - L) / (R - L) * (fMax - fMin);

  const dbFloor = settings.minDb - 30;
  const yOf = settings.scale === "db"
    ? (mag: number) => base - Math.max(0, (20 * Math.log10(mag + EPS) - dbFloor) / -dbFloor) * (base - top)
    : (mag: number) => base - Math.min(1.05, mag / yMax) * (base - top);

  // Frequency gridlines: each C (and each semitone when there's room) or round numbers of Hz.
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.lineWidth = 1;
  if (settings.axis === "note") {
    const pxPerSemitone = (R - L) / (mHi - mLo);
    for (let m = Math.ceil(mLo); m <= mHi; m++) {
      const isC = ((m % 12) + 12) % 12 === 0;
      if (!isC && pxPerSemitone < 6) continue;
      const x = xOf(freqFromMidi(m));
      ctx.strokeStyle = isC ? "rgba(255, 255, 255, 0.16)" : GRID;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, base);
      ctx.stroke();
      if (isC || pxPerSemitone > 26) {
        ctx.fillStyle = isC ? TEXT : MUTED;
        ctx.fillText(noteName(m), x, h - 5);
      }
    }
  } else {
    const span = fMax - fMin;
    const step = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000].find(s => span / s <= (R - L) / 70) ?? 5000;
    for (let f = Math.ceil(fMin / step) * step; f <= fMax; f += step) {
      const x = xOf(f);
      ctx.strokeStyle = GRID;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, base);
      ctx.stroke();
      ctx.fillStyle = MUTED;
      ctx.fillText(f >= 1000 ? `${f / 1000} kHz` : `${f} Hz`, x, h - 5);
    }
  }

  // Magnitude gridlines, labeled in decibels relative to a full-scale sine.
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  if (settings.scale === "db") {
    for (let db = 0; db >= dbFloor; db -= 10) {
      const y = yOf(10 ** (db / 20));
      ctx.strokeStyle = GRID;
      ctx.beginPath();
      ctx.moveTo(L, y);
      ctx.lineTo(R, y);
      ctx.stroke();
      if (db % 20 === 0) {
        ctx.fillStyle = MUTED;
        ctx.fillText(`${db}`, L - 6, y);
      }
    }
    ctx.save();
    ctx.translate(11, (top + base) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = MUTED;
    ctx.fillText("dB", 0, 0);
    ctx.restore();
  } else {
    // Gridlines at round magnitudes (where a full-scale sine is 1), so they move and re-space as
    // the axis rescales to louder or quieter sounds.
    const step = niceStep(yMax / 4);
    const digits = Math.max(0, -Math.floor(Math.log10(step)));
    for (let i = 1; i * step <= yMax; i++) {
      const y = yOf(i * step);
      ctx.strokeStyle = GRID;
      ctx.beginPath();
      ctx.moveTo(L, y);
      ctx.lineTo(R, y);
      ctx.stroke();
      ctx.fillStyle = MUTED;
      ctx.fillText((i * step).toFixed(digits), L - 6, y);
    }
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.beginPath();
  ctx.moveTo(L, base + 0.5);
  ctx.lineTo(R, base + 0.5);
  ctx.stroke();

  if (!analyser || binHz === 0) {
    placeholder(ctx, w, base, "Choose an input and press Start");
    return;
  }

  // The spectrum, keeping the largest bin at each pixel column so narrow peaks aren't lost.
  const kLo = Math.max(1, Math.floor(fMin / binHz)), kHi = Math.min(spectrum.length - 1, Math.ceil(fMax / binHz));
  let visibleMax = 0;
  const xs: number[] = [], ys: number[] = [];
  for (let k = kLo; k <= kHi; k++) {
    const x = Math.round(xOf(k * binHz));
    visibleMax = Math.max(visibleMax, spectrum[k]);
    if (xs.length && xs[xs.length - 1] === x) {
      ys[ys.length - 1] = Math.min(ys[ys.length - 1], yOf(spectrum[k]));
    } else {
      xs.push(x);
      ys.push(yOf(spectrum[k]));
    }
  }
  if (!frozen) {
    const target = Math.max(visibleMax * 1.15, 4 * 10 ** (settings.minDb / 20));
    yMax = target > yMax ? target : yMax + (target - yMax) * 0.03;
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(L, top - 4, R - L, base - top + 4);
  ctx.clip();
  const gradient = ctx.createLinearGradient(L, 0, R, 0);
  for (let i = 0; i <= 24; i++) {
    gradient.addColorStop(i / 24, `hsl(${pitchHue(midiFromFreq(fOf(L + i / 24 * (R - L))))}, 85%, 60%)`);
  }
  ctx.beginPath();
  ctx.moveTo(xs[0], base);
  xs.forEach((x, i) => ctx.lineTo(x, ys[i]));
  ctx.lineTo(xs[xs.length - 1], base);
  ctx.closePath();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  xs.forEach((x, i) => i ? ctx.lineTo(x, ys[i]) : ctx.moveTo(x, ys[i]));
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  if (noise) {
    // The background noise being removed, as a shaded area (keeping the highest bin at each pixel
    // column, like the spectrum), so that noise rising above it can be seen.
    const strength = settings.noiseStrength;
    ctx.beginPath();
    ctx.moveTo(xOf(kLo * binHz), base);
    let column = NaN, colMax = 0;
    for (let k = kLo; k <= kHi + 1; k++) {
      const x = k <= kHi ? Math.round(xOf(k * binHz)) : NaN;
      if (x !== column) {
        if (!Number.isNaN(column)) ctx.lineTo(column, yOf(strength * colMax));
        column = x;
        colMax = 0;
      }
      if (k <= kHi) colMax = Math.max(colMax, noise[k]);
    }
    ctx.lineTo(xOf(kHi * binHz), base);
    ctx.closePath();
    ctx.fillStyle = "rgba(110, 150, 255, 0.1)";
    ctx.fill();
    ctx.strokeStyle = "rgba(140, 175, 255, 0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();
    const label = "▮ background noise being removed";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(18, 20, 23, 0.85)";
    ctx.fillRect(L + 2, top, ctx.measureText(label).width + 8, 15);
    ctx.fillStyle = "rgba(160, 190, 255, 0.95)";
    ctx.fillText(label, L + 6, top + 2);
  }

  if (settings.showWaveform) {
    // The most recent audio samples, across the top of the chart.
    const mid = top + 40, n = timeBuf.length;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = L; x <= R; x++) {
      const i0 = Math.floor((x - L) / (R - L) * n), i1 = Math.max(i0 + 1, Math.floor((x + 1 - L) / (R - L) * n));
      let lo = 1, hi = -1;
      for (let i = i0; i < Math.min(i1, n); i++) {
        lo = Math.min(lo, timeBuf[i]);
        hi = Math.max(hi, timeBuf[i]);
      }
      ctx.moveTo(x + 0.5, mid - hi * 120);
      ctx.lineTo(x + 0.5, mid - lo * 120 + 0.5);
    }
    ctx.stroke();
  }

  // The Gaussian fitted to each peak, and the harmonic numbers of the peaks that are harmonics.
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  for (const p of peaks) {
    if (p.freq < fMin || p.freq > fMax) continue;
    const x = xOf(p.freq), isNote = !(settings.hideHarmonics && p.fundamental);
    if (settings.showFits) {
      const halfWidth = 3 / Math.sqrt(-p.curv);
      ctx.strokeStyle = isNote ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const f = p.freq + (i / 20 - 1) * halfWidth;
        const y = yOf(p.mag * Math.exp(p.curv * (f - p.freq) ** 2));
        i ? ctx.lineTo(xOf(f), y) : ctx.moveTo(xOf(f), y);
      }
      ctx.moveTo(x, base);
      ctx.lineTo(x, yOf(p.mag));
      ctx.stroke();
    }
  }
  ctx.restore();

  // The cutoff: peaks whose highest bin is below this line aren't counted.
  const cutoffY = yOf(peakFloor);
  if (peakFloor > 0 && cutoffY > top && cutoffY < base) {
    ctx.strokeStyle = "rgba(255, 196, 0, 0.7)";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(L, cutoffY);
    ctx.lineTo(R, cutoffY);
    ctx.stroke();
    ctx.setLineDash([]);
    const fromThreshold = peakFloor > 10 ** (settings.minDb / 20);
    ctx.fillStyle = "rgba(255, 196, 0, 0.9)";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    const thresholdText = settings.scale === "db" ? `${formatThreshold()} from loudest` : `${formatThreshold()} × loudest`;
    ctx.fillText(`cutoff: ${fromThreshold ? thresholdText : "quietest peak"}`, R - 4, cutoffY - 2);
  }

  drawPeakLabels(ctx, xOf, base, L, R);

  if (hover && hover.x >= L && hover.x <= R && hover.y <= base) drawHover(ctx, hover.x, fOf(hover.x), top, base, R);
}

// The smallest of 1, 2, or 5 times a power of ten that is at least x.
function niceStep(x: number): number {
  const power = 10 ** Math.floor(Math.log10(x));
  return [1, 2, 5, 10].map(m => m * power).find(s => s >= x)!;
}

// Below each note's peak: its name and a small tuner showing how far off it is, and below each
// harmonic's peak, its harmonic number (×2, ×3, …). Labels go in the first of two rows where they
// don't overlap another label, with the notes placed first, loudest first.
function drawPeakLabels(ctx: CanvasRenderingContext2D, xOf: (f: number) => number, base: number, L: number, R: number): void {
  const BOX_W = 56, HARMONIC_W = 26, BOX_H = 30, ROW_GAP = 4;
  const rows: { x: number; half: number }[][] = [[], []];
  const inView = (p: Peak) => p.freq >= settings.fMin && p.freq <= settings.fMax;
  const byLoudness = (a: Peak, b: Peak) => b.mag - a.mag;
  const notes = notePeaks().filter(inView).sort(byLoudness);
  const harmonicPeaks = settings.hideHarmonics ? peaks.filter(p => p.fundamental && inView(p)).sort(byLoudness) : [];

  // Finds a row with room for a label of the given width centered near px, and returns its
  // position, or null if there's no room.
  const place = (px: number, width: number) => {
    const half = width / 2, x = Math.min(R - half, Math.max(L + half, px));
    const row = rows.findIndex(row => row.every(o => Math.abs(o.x - x) >= o.half + half + 2));
    if (row < 0) return null;
    rows[row].push({ x, half });
    return { x, y: base + 6 + row * (BOX_H + ROW_GAP) };
  };
  const connect = (px: number, x: number, y: number, alpha: number) => {
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, base);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  for (const p of notes) {
    const px = xOf(p.freq), spot = place(px, BOX_W);
    if (!spot) continue;
    const { x, y } = spot;
    const cents = centsOff(p.midi);

    connect(px, x, y, 0.25);
    ctx.fillStyle = PANEL;
    ctx.fillRect(x - BOX_W / 2, y, BOX_W, BOX_H);
    ctx.fillStyle = `hsl(${pitchHue(p.midi)}, 85%, 70%)`;
    ctx.font = "bold 12px system-ui, sans-serif";
    ctx.fillText(noteName(p.midi), x, y + 13);

    const tw = BOX_W - 12, tx = x - tw / 2, ty = y + 19;
    ctx.fillStyle = "#333840";
    ctx.fillRect(tx, ty, tw, 6);
    ctx.fillStyle = "rgba(60, 200, 90, 0.45)";
    ctx.fillRect(x - tw * IN_TUNE_CENTS / 100, ty, tw * IN_TUNE_CENTS / 50, 6);
    ctx.fillStyle = centsColor(cents);
    ctx.fillRect(x + tw * cents / 100 - 1.5, ty - 2, 3, 10);
  }

  ctx.font = "11px system-ui, sans-serif";
  for (const p of harmonicPeaks) {
    const px = xOf(p.freq), spot = place(px, HARMONIC_W);
    if (!spot) continue;
    const { x, y } = spot;
    connect(px, x, y, 0.15);
    ctx.fillStyle = PANEL;
    ctx.fillRect(x - HARMONIC_W / 2, y, HARMONIC_W, BOX_H);
    ctx.fillStyle = MUTED;
    ctx.fillText(`×${p.harmonic}`, x, y + 13);
  }
}

function drawHover(ctx: CanvasRenderingContext2D, x: number, f: number, top: number, base: number, R: number): void {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(x + 0.5, top);
  ctx.lineTo(x + 0.5, base);
  ctx.stroke();
  ctx.setLineDash([]);

  const midi = midiFromFreq(f);
  const mag  = spectrum[Math.round(f / binHz)] ?? 0;
  const lines = [
    `${f.toFixed(1)} Hz`,
    `${noteName(midi)} ${formatCents(centsOff(midi))}`,
    // The magnitude, in the same units as the vertical axis.
    settings.scale === "db"
      ? `${(20 * Math.log10(mag + EPS)).toFixed(0)} dB`
      : `magnitude ${mag.toFixed(Math.max(0, 1 - Math.floor(Math.log10(niceStep(yMax / 4)))))}`,
  ];
  ctx.font = "12px system-ui, sans-serif";
  const boxW = Math.max(...lines.map(s => ctx.measureText(s).width)) + 14, boxH = lines.length * 16 + 8;
  const bx = x + 10 + boxW > R ? x - 10 - boxW : x + 10;
  ctx.fillStyle = "rgba(20, 22, 26, 0.92)";
  ctx.fillRect(bx, top + 4, boxW, boxH);
  ctx.fillStyle = TEXT;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  lines.forEach((s, i) => ctx.fillText(s, bx + 7, top + 20 + i * 16));
}

// ⋘──────── Note history ────────⋙

function drawHistory(): void {
  const { ctx, w, h } = fitCanvas(historyCanvas, 300);
  const L = 44, R = w - 8, top = 8, bottom = h - 22;

  // The history shows only notes within the spectrum's range.
  const rangeLo = Math.ceil(midiFromFreq(settings.fMin) - 1e-6);
  const rangeHi = Math.max(rangeLo, Math.floor(midiFromFreq(settings.fMax) + 1e-6));

  // Within that, ease the rows shown toward the notes in the history, with a few spare above and
  // below. Only notes that last a little while count, so that a brief stray note doesn't stretch
  // the rows (it's still drawn if it's within them). A note counts as continuing across short
  // gaps where it isn't detected.
  let lo = Infinity, hi = -Infinity;
  const runs = new Map<number, { start: number; last: number }>();
  for (const frame of history) for (const n of frame.notes) {
    const row = Math.round(n.midi);
    if (row < rangeLo || row > rangeHi) continue;
    let run = runs.get(row);
    if (run && frame.t - run.last <= HISTORY_GAP_SECONDS) run.last = frame.t;
    else runs.set(row, run = { start: frame.t, last: frame.t });
    if (run.last - run.start >= HISTORY_MIN_NOTE_SECONDS) {
      lo = Math.min(lo, row);
      hi = Math.max(hi, row);
    }
  }
  if (lo <= hi) {
    lo -= 3;
    hi += 3;
  } else {
    lo = historyLo;
    hi = historyHi;
  }
  [lo, hi] = fitHistorySpan(lo, hi, rangeLo, rangeHi);
  if (!frozen) {
    historyLo += (lo - historyLo) * 0.08;
    historyHi += (hi - historyHi) * 0.08;
  }
  // The highest and lowest rows that are drawn; notes beyond them are hidden.
  const shownLo = Math.max(rangeLo, historyLo - 0.5), shownHi = Math.min(rangeHi, historyHi + 0.5);
  const rowH = (bottom - top) / (historyHi - historyLo + 1);
  const yOf = (midi: number) => bottom - (midi - historyLo + 0.5) * rowH;
  const xOf = (t: number) => R - (clock - t) / HISTORY_SECONDS * (R - L);

  // Piano-roll rows, with the black keys shaded.
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let m = Math.ceil(historyLo - 0.5); m <= Math.floor(historyHi + 0.5); m++) {
    const y = yOf(m), pc = ((m % 12) + 12) % 12;
    ctx.fillStyle = BLACK_KEYS.has(pc) ? "rgba(0, 0, 0, 0.35)" : "rgba(255, 255, 255, 0.025)";
    ctx.fillRect(L, y - rowH / 2, R - L, rowH);
    if (pc === 0) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
      ctx.beginPath();
      ctx.moveTo(L, y + rowH / 2);
      ctx.lineTo(R, y + rowH / 2);
      ctx.stroke();
    }
    if (pc === 0 || rowH >= 11) {
      ctx.fillStyle = pc === 0 ? TEXT : MUTED;
      ctx.fillText(noteName(m), L - 6, y);
    }
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = MUTED;
  for (let s = 0; s <= HISTORY_SECONDS; s += 2) ctx.fillText(s ? `−${s} s` : "now", R - s / HISTORY_SECONDS * (R - L), h - 6);

  if (!history.length) {
    placeholder(ctx, w, h - 20, "Notes you play will scroll by here");
    return;
  }

  // Each note as a bar in its row, with a line inside it offset by how sharp or flat it was.
  ctx.save();
  ctx.beginPath();
  ctx.rect(L, top, R - L, bottom - top);
  ctx.clip();
  let hiddenAbove = false, hiddenBelow = false;
  for (let i = 1; i < history.length; i++) {
    const frame = history[i], prev = history[i - 1];
    const x1 = xOf(frame.t), x0 = frame.t - prev.t > 0.25 ? x1 - 2 : xOf(prev.t);
    let above = false, below = false;
    for (const n of frame.notes) {
      const row = Math.round(n.midi), cents = centsOff(n.midi);
      if (row > shownHi) { above = true; continue; }
      if (row < shownLo) { below = true; continue; }
      ctx.globalAlpha = 0.15 + 0.35 * n.level;
      ctx.fillStyle = `hsl(${pitchHue(n.midi)}, 70%, 55%)`;
      ctx.fillRect(x0, yOf(row) - rowH / 2, x1 - x0 + 0.5, rowH);
      ctx.globalAlpha = 0.35 + 0.65 * n.level;
      ctx.fillStyle = centsColor(cents);
      ctx.fillRect(x0, yOf(n.midi) - 1.5, x1 - x0 + 0.5, 3);
    }
    // Marks the top or bottom edge when notes beyond it are hidden.
    ctx.globalAlpha = 1;
    ctx.fillStyle = HIDDEN_COLOR;
    if (above) ctx.fillRect(x0, top, x1 - x0 + 0.5, 3);
    if (below) ctx.fillRect(x0, bottom - 3, x1 - x0 + 0.5, 3);
    hiddenAbove ||= above;
    hiddenBelow ||= below;
  }
  ctx.restore();
  ctx.globalAlpha = 1;

  // Labels on the left, clear of the panel's buttons on the right.
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "left";
  for (const [hidden, text, y, baseline] of [
    [hiddenAbove, "▲ higher notes not shown", top + 5, "top"],
    [hiddenBelow, "▼ lower notes not shown", bottom - 5, "bottom"],
  ] as const) {
    if (!hidden) continue;
    ctx.textBaseline = baseline;
    const tw = ctx.measureText(text).width;
    ctx.fillStyle = "rgba(18, 20, 23, 0.85)";
    ctx.fillRect(L + 2, baseline === "top" ? y - 1 : y - 14, tw + 8, 15);
    ctx.fillStyle = HIDDEN_COLOR;
    ctx.fillText(text, L + 6, y);
  }
}

// Widens [lo, hi] to at least HISTORY_MIN_SPAN semitones (or the whole note range, if that's
// narrower) and shifts it to lie within the note range [min, max].
function fitHistorySpan(lo: number, hi: number, min: number, max: number): [number, number] {
  const span = Math.min(HISTORY_MIN_SPAN, max - min);
  if (hi - lo < span) {
    const mid = (lo + hi) / 2;
    lo = mid - span / 2;
    hi = mid + span / 2;
  }
  if (lo < min) { hi += min - lo; lo = min; }
  if (hi > max) { lo -= hi - max; hi = max; }
  return [Math.max(lo, min), hi];
}

// ⋘──────── Pinning and full screen ────────⋙
// Each panel has a pin button that keeps it at the top of the window while scrolling, stacked
// below any pinned panels above it, and (in browsers that allow it) a button that shows it full
// screen.

const PIN_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/></svg>`;
const FULL_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
const EXIT_FULL_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`;
const panels = [...document.querySelectorAll<HTMLElement>(".ft-panel")];

function stackPinned(): void {
  let top = 0;
  for (const panel of panels) {
    if (!panel.classList.contains("ft-pinned")) {
      panel.style.top = "";
      continue;
    }
    panel.style.top = `${top}px`;
    top += panel.offsetHeight;
  }
}

function setPinned(panel: HTMLElement, pinned: boolean): void {
  panel.classList.toggle("ft-pinned", pinned);
  panel.querySelector(".ft-pin")!.setAttribute("aria-pressed", String(pinned));
  stackPinned();
}

for (const panel of panels) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "ft-pin";
  button.innerHTML = PIN_ICON;
  button.setAttribute("aria-label", "Pin to the top of the window");
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => {
    setPinned(panel, !panel.classList.contains("ft-pinned"));
    saveControls();
  });
  panel.append(button);

  const full = document.createElement("button");
  full.type = "button";
  full.className = "ft-full";
  full.innerHTML = FULL_ICON;
  full.setAttribute("aria-label", "Full screen");
  full.hidden = !document.fullscreenEnabled;
  full.addEventListener("click", () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void panel.requestFullscreen();
  });
  panel.append(full);
}
// The panels' heights change as the canvases are first drawn and when the window is resized.
const panelResizes = new ResizeObserver(stackPinned);
panels.forEach(panel => panelResizes.observe(panel));
document.addEventListener("fullscreenchange", () => {
  for (const panel of panels) {
    const button = panel.querySelector<HTMLButtonElement>(".ft-full")!;
    const isFull = document.fullscreenElement === panel;
    button.innerHTML = isFull ? EXIT_FULL_ICON : FULL_ICON;
    button.setAttribute("aria-label", isFull ? "Exit full screen" : "Full screen");
  }
  stackPinned();
});

// ⋘──────── Setting explanations ────────⋙
// Each setting's label with a `data-help` explanation gets a "?" button after it that shows the
// explanation in a popup below the button.

const helpPopup = $<HTMLDivElement>("ft-help-popup");
let openHelp: HTMLButtonElement | null = null;

function closeHelp(): void {
  helpPopup.hidden = true;
  openHelp?.setAttribute("aria-expanded", "false");
  openHelp = null;
}

function showHelp(button: HTMLButtonElement, text: string): void {
  closeHelp();
  openHelp = button;
  button.setAttribute("aria-expanded", "true");
  helpPopup.textContent = text;
  helpPopup.hidden = false;
  // Below the button, kept within the window.
  const r = button.getBoundingClientRect();
  const left = Math.min(r.left, document.documentElement.clientWidth - helpPopup.offsetWidth - 8);
  helpPopup.style.left = `${Math.max(8, left) + window.scrollX}px`;
  helpPopup.style.top  = `${r.bottom + 6 + window.scrollY}px`;
}

document.body.append(helpPopup); // Positioned relative to the page
for (const label of document.querySelectorAll<HTMLElement>(".ft [data-help]")) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "ft-help";
  button.textContent = "?";
  button.setAttribute("aria-label", `About ${label.textContent}`);
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", helpPopup.id);
  button.addEventListener("click", e => {
    e.stopPropagation();
    if (openHelp === button) closeHelp();
    else showHelp(button, label.dataset.help!);
  });
  label.after(button);
}
document.addEventListener("click", e => { if (!helpPopup.contains(e.target as Node)) closeHelp(); });
document.addEventListener("keydown", e => {
  if (e.key !== "Escape" || !openHelp) return;
  const button = openHelp;
  closeHelp();
  button.focus();
});

// ⋘──────── Saved settings ────────⋙
// The controls and pinned panels are saved in the browser, so they're the same when a visitor
// returns. Storage can be unavailable (for example, in some private windows), in which case the
// page works as usual without saving.

const STORAGE_KEY = "multi_note_tuner";
const savedControls = [...document.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
  ".ft-settings input, .ft-settings select, #ft-source, #ft-tone-controls input, #ft-tone-controls select")];

interface SavedState { controls: Record<string, string | boolean>; pinned: number[]; }

function saveControls(): void {
  const state: SavedState = { controls: {}, pinned: [] };
  for (const el of savedControls) {
    state.controls[el.id] = el instanceof HTMLInputElement && el.type === "checkbox" ? el.checked : el.value;
  }
  panels.forEach((panel, i) => { if (panel.classList.contains("ft-pinned")) state.pinned.push(i); });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* Not saved */ }
}

function restoreControls(): void {
  let state: Partial<SavedState>;
  try {
    state = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return;
  }
  for (const el of savedControls) {
    const value = state.controls?.[el.id];
    if (value === undefined) continue;
    if (el instanceof HTMLInputElement && el.type === "checkbox") {
      el.checked = value === true;
    } else if (!(el instanceof HTMLSelectElement) || [...el.options].some(o => o.value === value)) {
      el.value = String(value);
    }
  }
  for (const i of state.pinned ?? []) if (panels[i]) setPinned(panels[i], true);
}

savedControls.forEach(el => {
  el.addEventListener("input", saveControls);
  el.addEventListener("change", saveControls);
});

// ⋘──────── Main loop ────────⋙

function frame(): void {
  if (!frozen) analyze();
  drawTuner();
  drawSpectrum();
  drawHistory();
  requestAnimationFrame(frame);
}

fillRangeEnds();
restoreControls();
loadCalibration();
settings.axis = axisSelect.value as "note" | "linear";
showRangeUnits(settings.axis);
showSourceControls();
readSettings();
requestAnimationFrame(frame);
void autoStartMicrophone();
