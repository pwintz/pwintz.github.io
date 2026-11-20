import { test } from "node:test";
import assert from "node:assert/strict";
import { assertArrayClose, assertClose } from "./helpers";
import { FFT, makeWindow } from "../src/audio/fft";
import {
  HistoryFrame, PeakOptions, centsColor, findPeaks, formatThreshold, harmonicNumber, interpolatePeak,
  noiseLevels, pitchHue, tunerLanes,
} from "../src/multi_note_tuner/peaks";

const RATE = 48000, N = 8192, BIN_HZ = RATE / N;
const OPTIONS: PeakOptions = { threshold: 0.3, minDb: -70, hideHarmonics: true, a4: 440 };

// The magnitude spectrum of a sum of sines (frequency in Hz, amplitude), scaled as on the page so
// that a full-scale sine has magnitude 1.
function spectrumOf(partials: [number, number][], window = "gauss"): Float64Array {
  const { win, sum } = makeWindow(window, N);
  const re = new Float64Array(N), im = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    for (const [f, a] of partials) re[i] += a * Math.sin(2 * Math.PI * f * i / RATE + 0.3 * f);
    re[i] *= win[i];
  }
  new FFT(N).transform(re, im);
  return Float64Array.from({ length: N / 2 }, (_, k) => Math.hypot(re[k], im[k]) * 2 / sum);
}

test("harmonicNumber", () => {
  assert.equal(harmonicNumber(440, 220), 2);
  assert.equal(harmonicNumber(660 * 2 ** (30 / 1200), 220), 3, "within 35 cents");
  assert.equal(harmonicNumber(660 * 2 ** (40 / 1200), 220), 0, "more than 35 cents off");
  assert.equal(harmonicNumber(220, 220), 0, "not a harmonic of itself");
  assert.equal(harmonicNumber(110, 220), 0);
  assert.equal(harmonicNumber(330, 220), 0, "3/2 isn't a whole number");
});

test("interpolatePeak finds a sine's frequency and amplitude between bins", () => {
  const f = 441.7;
  const spectrum = spectrumOf([[f, 0.5]]);
  const k = Math.round(f / BIN_HZ);
  const peak = interpolatePeak(spectrum, k, BIN_HZ, 440)!;
  assertClose(peak.freq, f, 0.05);
  assertClose(peak.mag, 0.5, 0.005);
  assertClose(peak.midi, 69 + 12 * Math.log2(f / 440), 0.001);
  assert.ok(peak.curv < 0);
  assert.equal(peak.fundamental, null);
  assert.equal(peak.harmonic, 1);
});

test("findPeaks names a note and marks its harmonics", () => {
  const { peaks, floor } = findPeaks(spectrumOf([[220, 0.6], [440, 0.4], [660, 0.3]]), BIN_HZ, OPTIONS);
  assert.deepEqual(peaks.map(p => Math.round(p.freq)), [220, 440, 660]);
  assert.equal(peaks[0].fundamental, null);
  assert.deepEqual(peaks.slice(1).map(p => [p.fundamental, p.harmonic]), [[peaks[0], 2], [peaks[0], 3]]);
  assertClose(floor, 0.3 * peaks[0].bin, 1e-12);
});

test("findPeaks keeps the notes of a chord apart", () => {
  const chord: [number, number][] = [[440, 0.5], [554.37, 0.5], [659.26, 0.5]];   // A major
  const { peaks } = findPeaks(spectrumOf(chord), BIN_HZ, OPTIONS);
  assertArrayClose(peaks.map(p => p.freq), chord.map(([f]) => f), 0.1);
  assert.ok(peaks.every(p => p.fundamental === null));
  assertArrayClose(peaks.map(p => p.midi), [69, 73, 76], 0.01);
});

test("findPeaks ignores peaks below the threshold and the quietest level", () => {
  const spectrum = spectrumOf([[300, 0.8], [1234, 0.1]]);
  assert.deepEqual(findPeaks(spectrum, BIN_HZ, OPTIONS).peaks.map(p => Math.round(p.freq)), [300]);
  assert.deepEqual(findPeaks(spectrum, BIN_HZ, { ...OPTIONS, threshold: 0.05 }).peaks.map(p => Math.round(p.freq)), [300, 1234]);
  // With everything quieter than −10 dB ignored, nothing is left.
  assert.deepEqual(findPeaks(spectrumOf([[300, 0.1]]), BIN_HZ, { ...OPTIONS, minDb: -10 }).peaks, []);
});

test("findPeaks restores a quiet fundamental under two or more of its harmonics", () => {
  const spectrum = spectrumOf([[196, 0.05], [392, 0.8], [588, 0.7], [784, 0.5]]);   // Like a violin's open G
  const { peaks } = findPeaks(spectrum, BIN_HZ, OPTIONS);
  assert.equal(Math.round(peaks[0].freq), 196);
  assert.ok(peaks.slice(1).every(p => p.fundamental === peaks[0]));
  // A quiet peak under only one louder peak isn't restored.
  const lone = findPeaks(spectrumOf([[196, 0.05], [392, 0.8]]), BIN_HZ, OPTIONS).peaks;
  assert.deepEqual(lone.map(p => Math.round(p.freq)), [392]);
});

test("findPeaks marks quieter harmonics only when hiding harmonics", () => {
  const partials: [number, number][] = [[220, 1], [440, 0.05], [660, 0.02]];
  const hidden = findPeaks(spectrumOf(partials), BIN_HZ, OPTIONS).peaks;
  assert.deepEqual(hidden.map(p => [Math.round(p.freq), p.harmonic]), [[220, 1], [440, 2], [660, 3]]);
  const shown = findPeaks(spectrumOf(partials), BIN_HZ, { ...OPTIONS, hideHarmonics: false }).peaks;
  assert.deepEqual(shown.map(p => Math.round(p.freq)), [220]);
});

test("findPeaks of silence", () => {
  assert.deepEqual(findPeaks(new Float64Array(N / 2), BIN_HZ, OPTIONS).peaks, []);
});

test("findPeaks keeps at most 16 peaks, the loudest", () => {
  const partials: [number, number][] = Array.from({ length: 20 }, (_, i) => [300 * 1.13 ** i, 0.02 + 0.002 * i]);
  const { peaks } = findPeaks(spectrumOf(partials), BIN_HZ, { ...OPTIONS, threshold: 0.01, hideHarmonics: false });
  assert.equal(peaks.length, 16);
  assert.ok(peaks[0].freq > 300 * 1.13 ** 3.5, "the four quietest (lowest) are dropped");
});

test("noiseLevels takes a percentile per bin and spreads it", () => {
  const frames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => Float32Array.from([i, 0, 0, 0, 0, 0, 100 - i]));
  const levels = noiseLevels(frames, 0.9, 1);
  assertArrayClose(levels, [8, 8, 0, 0, 0, 99, 99]);
  assertArrayClose(noiseLevels(frames, 0, 0), [0, 0, 0, 0, 0, 0, 91]);
  assertArrayClose(noiseLevels([Float32Array.from([1, 2, 3])], 0.95, 0), [1, 2, 3]);
});

test("tunerLanes lists recent notes, highest first, with their loudest level", () => {
  const history: HistoryFrame[] = [
    { t: 1, notes: [{ midi: 60.2, level: 1 }] },
    { t: 2, notes: [{ midi: 64, level: 0.3 }, { midi: 59.8, level: 0.5 }] },
    { t: 3, notes: [{ midi: 64.1, level: 0.6 }] },
  ];
  assert.deepEqual(tunerLanes(history, 2), [{ row: 64, last: 3, level: 0.6 }, { row: 60, last: 2, level: 0.5 }]);
  assert.deepEqual(tunerLanes(history, 0), [{ row: 64, last: 3, level: 0.6 }, { row: 60, last: 2, level: 1 }]);
  assert.deepEqual(tunerLanes(history, 4), []);
  assert.deepEqual(tunerLanes([], 0), []);
});

test("colors and text", () => {
  assertClose(pitchHue(21), 342);
  assertClose(pitchHue(151), 342);
  assert.ok(pitchHue(80) >= 0 && pitchHue(80) < 360);
  assert.equal(centsColor(0), "hsl(120, 80%, 55%)");
  assert.equal(centsColor(-25), "hsl(60, 80%, 55%)");
  assert.equal(centsColor(80), "hsl(0, 80%, 55%)");
  assert.equal(formatThreshold(0.3, "linear"), "0.30");
  assert.equal(formatThreshold(0.1, "db"), "−20.0 dB");
});
