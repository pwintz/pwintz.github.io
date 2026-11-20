import { test } from "node:test";
import assert from "node:assert/strict";
import { assertArrayClose, assertClose } from "./helpers";
import { FFT, WINDOWS, fitPeak, makeWindow } from "../src/audio/fft";
import { centsOff, formatCents, freqToMidi, midiToFreq, noteName } from "../src/audio/notes";

// The DFT computed directly, to check the FFT against.
function naiveDft(re: number[], im: number[]): [number[], number[]] {
  const n = re.length, outRe: number[] = [], outIm: number[] = [];
  for (let k = 0; k < n; k++) {
    let sr = 0, si = 0;
    for (let t = 0; t < n; t++) {
      const a = -2 * Math.PI * k * t / n;
      sr += re[t] * Math.cos(a) - im[t] * Math.sin(a);
      si += re[t] * Math.sin(a) + im[t] * Math.cos(a);
    }
    outRe.push(sr); outIm.push(si);
  }
  return [outRe, outIm];
}

test("FFT matches the direct DFT", () => {
  for (const n of [1, 2, 8, 64]) {
    const re = Array.from({ length: n }, (_, i) => Math.sin(1.3 * i) + 0.2 * i);
    const im = Array.from({ length: n }, (_, i) => Math.cos(0.7 * i * i));
    const [eRe, eIm] = naiveDft(re, im);
    const r = Float64Array.from(re), m = Float64Array.from(im);
    new FFT(n).transform(r, m);
    assertArrayClose(r, eRe, 1e-9);
    assertArrayClose(m, eIm, 1e-9);
  }
});

test("FFT of a sinusoid at a bin center has a single peak", () => {
  const n = 256, k = 10;
  const re = Float64Array.from({ length: n }, (_, i) => Math.cos(2 * Math.PI * k * i / n));
  const im = new Float64Array(n);
  new FFT(n).transform(re, im);
  assertClose(re[k], n / 2, 1e-9);
  assertClose(re[n - k], n / 2, 1e-9);
  assertClose(Math.hypot(re[k + 3], im[k + 3]), 0, 1e-9);
});

test("windows are symmetric and peak in the middle", () => {
  const N = 65;
  for (const name of Object.keys(WINDOWS)) {
    const { win, sum } = makeWindow(name, N);
    assertClose(sum, win.reduce((s, x) => s + x, 0), 1e-12);
    for (let n = 0; n < N; n++) assertClose(win[n], win[N - 1 - n], 1e-12, `${name} symmetric at ${n}`);
    const mid = win[(N - 1) / 2];
    assert.ok(win.every(x => x <= mid + 1e-12), `${name} peaks in the middle`);
  }
  assertClose(makeWindow("hann", N).win[0], 0, 1e-15);
  assertClose(makeWindow("hann", N).win[32], 1, 1e-15);
  assert.equal(makeWindow("rectangular", 8).sum, 8);
});

test("fitPeak recovers the peak of a sampled Gaussian exactly", () => {
  const center = 10.3, width = 1.7, height = 5;
  const spectrum = Array.from({ length: 20 }, (_, k) => height * Math.exp(-((k - center) ** 2) / (2 * width ** 2)));
  const fit = fitPeak(spectrum, 10)!;
  assertClose(fit.delta, 0.3, 1e-9);
  assertClose(fit.mag, height, 1e-9);
  assertClose(fit.curv, -1 / (2 * width ** 2), 1e-9);
});

test("fitPeak finds a sinusoid's frequency between bins", () => {
  const n = 1024, freqBins = 37.25;
  const { win } = makeWindow("hann", n);
  const re = Float64Array.from({ length: n }, (_, i) => win[i] * Math.sin(2 * Math.PI * freqBins * i / n));
  const im = new Float64Array(n);
  new FFT(n).transform(re, im);
  const mag = Array.from({ length: n / 2 }, (_, k) => Math.hypot(re[k], im[k]));
  const k = mag.indexOf(Math.max(...mag));
  assert.equal(k, 37);
  assertClose(k + fitPeak(mag, k)!.delta, freqBins, 0.02);
});

test("fitPeak rejects points that aren't a peak and caps the magnitude", () => {
  assert.equal(fitPeak([3, 2, 3], 1), null);  // A dip, not a peak
  assert.equal(fitPeak([2, 2, 2], 1), null);
  const fit = fitPeak([0, 1, 1e-9], 1)!;
  assert.ok(fit.mag <= 1.6 + 1e-12);
});

test("note conversions", () => {
  assert.equal(freqToMidi(440, 440), 69);
  assertClose(freqToMidi(261.6255653, 440), 60, 1e-6);
  assertClose(midiToFreq(81, 440), 880);
  assertClose(midiToFreq(freqToMidi(123.4, 442), 442), 123.4);
  assertClose(centsOff(69.25), 25);
  assertClose(centsOff(68.75), -25);
});

test("noteName", () => {
  assert.equal(noteName(69), "A4");
  assert.equal(noteName(60), "C4");
  assert.equal(noteName(61.4), "C♯4");
  assert.equal(noteName(59.6), "C4");
  assert.equal(noteName(0), "C-1");
  assert.equal(noteName(-1), "B-2");
});

test("formatCents", () => {
  assert.equal(formatCents(0.4), "±0¢");
  assert.equal(formatCents(12.3), "+12¢");
  assert.equal(formatCents(-7.6), "−8¢");
});
