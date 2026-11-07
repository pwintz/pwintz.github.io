// ╭───────────────────────────────────────────────────────────────╮
// │            Measuring distance with the phase of light         │
// ╰───────────────────────────────────────────────────────────────╯
// A Michelson interferometer: a laser beam is split in two, each half bounces off a mirror, and the
// halves are recombined at a detector. Moving one mirror by d lengthens that beam's round trip by 2d,
// which shifts its phase by Δφ = 2π·2d/λ = 4πd/λ relative to the other beam. The two waves add, and
// the brightness of the sum, (1 + cos Δφ)/2 of its maximum, reveals the shift. One full bright–dark–
// bright cycle (a "fringe") corresponds to moving the mirror by half a wavelength.
//
// The page shows a schematic (with the mirror's motion hugely exaggerated so it can be seen), the
// two returning waves and their sum with a phase dial, and the brightness against mirror position.

import { setupHelp } from './common/help';
import { setupPanels } from './common/panels';
import { loadJSON, saveJSON } from './common/storage';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const FIXED_COLOR = '#0072B2';  // The beam from the fixed mirror.
const MOVED_COLOR = '#D55E00';  // The beam from the moving mirror.
const LASER_COLOR = '#CC79A7';  // The beam on its way to the beam splitter.

// ── Settings ───────────────────────────────────────────────────────
const settings = {
  displacement: 0,  // How far the moving mirror has moved (nm); positive is farther away.
  wavelength: 633,  // The laser's wavelength (nm).
  oscillate: false, // Move the mirror back and forth automatically.
};
Object.assign(settings, loadJSON<Partial<typeof settings>>('phase_distance_settings') ?? {});
if (![633, 1550].includes(settings.wavelength)) settings.wavelength = 633;
settings.displacement = Math.max(-800, Math.min(800, Number(settings.displacement) || 0));
const saveSettings = () => saveJSON('phase_distance_settings', settings);

/** The phase shift of the moving mirror's beam relative to the fixed one (radians). */
const phaseShift = () => (4 * Math.PI * settings.displacement) / settings.wavelength;
/** The detector's brightness, as a fraction of its maximum. */
const brightness = (phi: number) => (1 + Math.cos(phi)) / 2;

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

function title(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  ctx.fillStyle = '#3c4043';
  ctx.font = '600 12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
  ctx.textAlign = 'start';
}

/** A wave drawn along the segment from (x0, y0) to (x1, y1), with the given phase at its start. */
function waveAlong(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number,
  wavePx: number, phase: number, amp: number, color: string) {
  const len = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / len, uy = (y1 - y0) / len;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let s = 0; s <= len; s += 1.5) {
    const a = amp * Math.sin((2 * Math.PI * s) / wavePx - phase);
    const x = x0 + ux * s - uy * a, y = y0 + uy * s + ux * a;
    if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// ── Schematic ──────────────────────────────────────────────────────
let clock = 0; // Animation time (s), which moves the waves along.
const schematic = $<HTMLCanvasElement>('pd-schematic');

function drawSchematic() {
  const [ctx, w, h] = fit(schematic);
  title(ctx, 'A Michelson interferometer', w / 2, 16);
  const phi = phaseShift();
  // Layout: laser on the left, beam splitter in the middle, the fixed mirror above it, the moving
  // mirror to its right, and the detector below.
  const bsX = w * 0.42, bsY = h * 0.48;
  const laserX = 70, fixedY = 48, detY = h - 34;
  // The moving mirror's displacement, exaggerated so that a full wavelength of motion is visible.
  const EXAGGERATION = 40 / settings.wavelength; // Pixels per nanometer.
  const movedX = Math.min(w - 40, bsX + w * 0.36) + settings.displacement * EXAGGERATION;
  const wavePx = 26, amp = 5, travel = clock * 40;

  // Beams: laser → splitter, splitter → fixed mirror and back, splitter → moving mirror and back,
  // and both returning beams together down to the detector.
  waveAlong(ctx, laserX + 28, bsY, bsX, bsY, wavePx, travel / wavePx * 2 * Math.PI, amp, LASER_COLOR);
  waveAlong(ctx, bsX, bsY, bsX, fixedY + 6, wavePx, travel / wavePx * 2 * Math.PI, amp, FIXED_COLOR);
  waveAlong(ctx, bsX + 2, bsY, movedX - 6, bsY, wavePx, travel / wavePx * 2 * Math.PI, amp, MOVED_COLOR);
  ctx.globalAlpha = 0.85;
  waveAlong(ctx, bsX - 4, bsY + 4, bsX - 4, detY - 18, wavePx, travel / wavePx * 2 * Math.PI, amp, FIXED_COLOR);
  waveAlong(ctx, bsX + 4, bsY + 4, bsX + 4, detY - 18, wavePx, travel / wavePx * 2 * Math.PI + phi, amp, MOVED_COLOR);
  ctx.globalAlpha = 1;

  // Laser.
  ctx.fillStyle = '#3c4043';
  ctx.fillRect(laserX - 34, bsY - 14, 62, 28);
  ctx.fillStyle = '#fff'; ctx.font = '600 11px system-ui, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Laser', laserX - 3, bsY + 4);
  // Beam splitter: a half-silvered mirror at 45°.
  ctx.strokeStyle = '#5f6368'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(bsX - 16, bsY + 16); ctx.lineTo(bsX + 16, bsY - 16); ctx.stroke();
  ctx.fillStyle = '#5f6368'; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'right';
  ctx.fillText('beam splitter', bsX - 22, bsY - 14);
  // Fixed mirror.
  ctx.fillStyle = '#3c4043';
  ctx.fillRect(bsX - 26, fixedY - 4, 52, 8);
  ctx.textAlign = 'center'; ctx.fillStyle = '#5f6368';
  ctx.fillText('fixed mirror', bsX, fixedY - 10);
  // Moving mirror, with its resting position marked.
  const restX = Math.min(w - 40, bsX + w * 0.36);
  ctx.setLineDash([3, 3]); ctx.strokeStyle = '#9aa0a6'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(restX, bsY - 34); ctx.lineTo(restX, bsY + 34); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#3c4043';
  ctx.fillRect(movedX - 4, bsY - 26, 8, 52);
  ctx.fillStyle = '#5f6368';
  ctx.fillText('moving mirror', movedX, bsY - 34);
  ctx.fillText(`moved ${settings.displacement > 0 ? '+' : settings.displacement < 0 ? '−' : ''}${Math.abs(settings.displacement)} nm`, movedX, bsY + 42);
  // A screen pixel is about 0.26 mm (260,000 nm), so the drawing magnifies the motion this much.
  const magnification = EXAGGERATION * 260000;
  ctx.fillText(`(motion drawn about ${(Math.round(magnification / 1000) * 1000).toLocaleString()}× larger)`, movedX, bsY + 56);
  // Detector: a disk whose brightness is what it measures.
  const b = brightness(phi);
  const g = Math.round(40 + 215 * b);
  ctx.fillStyle = `rgb(${g},${g},${Math.round(g * 0.85)})`;
  ctx.strokeStyle = '#3c4043'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(bsX, detY, 16, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#5f6368'; ctx.textAlign = 'left';
  ctx.fillText(`detector: ${Math.round(b * 100)}% bright`, bsX + 24, detY + 4);
  ctx.textAlign = 'start';
}

// ── Waves, dial, and brightness ────────────────────────────────────
const wavesCanvas = $<HTMLCanvasElement>('pd-waves');

function drawWaves() {
  const [ctx, w, h] = fit(wavesCanvas);
  const phi = phaseShift();
  title(ctx, 'The two returning waves, and what the detector sees', w / 2, 16);
  const left = 170, waveW = Math.max(120, w * 0.62 - left), amp = 12, k = (2 * Math.PI) / 70;
  const rows: [string, string, (x: number) => number][] = [
    ['from the fixed mirror', FIXED_COLOR, x => Math.sin(k * x - clock * 3)],
    ['from the moving mirror', MOVED_COLOR, x => Math.sin(k * x - clock * 3 + phi)],
    ['combined', '#000', x => Math.sin(k * x - clock * 3) + Math.sin(k * x - clock * 3 + phi)],
  ];
  rows.forEach(([label, color, f], i) => {
    const y0 = 46 + i * 44 + (i === 2 ? 10 : 0);
    ctx.fillStyle = '#5f6368'; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(label, left - 10, y0 + 4);
    ctx.textAlign = 'start';
    ctx.strokeStyle = 'rgba(128,128,128,0.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(left, y0); ctx.lineTo(left + waveW, y0); ctx.stroke();
    ctx.strokeStyle = color; ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let x = 0; x <= waveW; x += 2) {
      const y = y0 - f(x) * amp;
      if (x === 0) ctx.moveTo(left + x, y); else ctx.lineTo(left + x, y);
    }
    ctx.stroke();
  });

  // Phase dial: the two waves as arrows at angles 0 and Δφ; their sum is the combined wave.
  const cx = left + waveW + 90, cy = h / 2 + 8, R = Math.min(48, h / 2 - 32);
  ctx.strokeStyle = 'rgba(128,128,128,0.4)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();
  const arrow = (x0: number, y0: number, x1: number, y1: number, color: string, width: number) => {
    ctx.strokeStyle = ctx.fillStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    const a = Math.atan2(y1 - y0, x1 - x0);
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - 8 * Math.cos(a - 0.4), y1 - 8 * Math.sin(a - 0.4));
    ctx.lineTo(x1 - 8 * Math.cos(a + 0.4), y1 - 8 * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill();
  };
  const r = R / 2;
  arrow(cx, cy, cx + r, cy, FIXED_COLOR, 2.5);
  arrow(cx + r, cy, cx + r + r * Math.cos(phi), cy - r * Math.sin(phi), MOVED_COLOR, 2.5);
  if (Math.hypot(r + r * Math.cos(phi), r * Math.sin(phi)) > 4) arrow(cx, cy, cx + r + r * Math.cos(phi), cy - r * Math.sin(phi), '#000', 1.5);
  ctx.fillStyle = '#5f6368'; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('phase shift', cx, cy + R + 16);
  ctx.fillText(`Δφ = ${phi >= 0 ? '' : '−'}${Math.abs(phi).toFixed(2)} rad`, cx, cy + R + 30);
  // Brightness bar.
  const bx = cx + R + 50, bw = 22, bh = 2 * R, by = cy - R, b = brightness(phi);
  ctx.strokeStyle = 'rgba(128,128,128,0.6)';
  ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = '#000';
  ctx.fillRect(bx + 1, by + bh * (1 - b), bw - 2, bh * b);
  ctx.fillStyle = '#5f6368';
  ctx.fillText('brightness', bx + bw / 2, cy + R + 16);
  ctx.fillText(`${Math.round(b * 100)}%`, bx + bw / 2, cy + R + 30);
  ctx.textAlign = 'start';
}

// ── Brightness against mirror position ─────────────────────────────
const fringeCanvas = $<HTMLCanvasElement>('pd-fringes');

function drawFringes() {
  const [ctx, w, h] = fit(fringeCanvas);
  title(ctx, 'Brightness at the detector against how far the mirror has moved', w / 2, 16);
  const pad = { left: 56, right: 16, top: 28, bottom: 42 }; // Room for the tick labels and a caption.
  const pw = w - pad.left - pad.right, ph = h - pad.top - pad.bottom;
  const range = 800; // nm each way.
  const X = (d: number) => pad.left + ((d + range) / (2 * range)) * pw;
  const Y = (b: number) => pad.top + (1 - b) * ph;
  ctx.strokeStyle = 'rgba(128,128,128,0.4)'; ctx.lineWidth = 1;
  ctx.strokeRect(pad.left, pad.top, pw, ph);
  // Shade every half wavelength, one fringe each.
  const half = settings.wavelength / 2;
  for (let k = Math.ceil(-range / half); k * half < range; k++) {
    if (k % 2 === 0) continue;
    const a = Math.max(-range, k * half), b = Math.min(range, (k + 1) * half);
    ctx.fillStyle = 'rgba(120,140,170,0.12)';
    ctx.fillRect(X(a), pad.top, X(b) - X(a), ph);
  }
  ctx.strokeStyle = '#000'; ctx.lineWidth = 1.8;
  ctx.beginPath();
  for (let px = 0; px <= pw; px++) {
    const d = -range + (px / pw) * 2 * range;
    const y = Y(brightness((4 * Math.PI * d) / settings.wavelength));
    if (px === 0) ctx.moveTo(pad.left + px, y); else ctx.lineTo(pad.left + px, y);
  }
  ctx.stroke();
  // The mirror's current position.
  const cx = X(settings.displacement), cy = Y(brightness(phaseShift()));
  ctx.strokeStyle = MOVED_COLOR; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
  ctx.beginPath(); ctx.moveTo(cx, pad.top); ctx.lineTo(cx, pad.top + ph); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = MOVED_COLOR;
  ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 2 * Math.PI); ctx.fill();
  // Axes.
  ctx.fillStyle = '#5f6368'; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
  for (let d = -800; d <= 800; d += 200) ctx.fillText(`${d > 0 ? '+' : d < 0 ? '−' : ''}${Math.abs(d)} nm`, X(d), pad.top + ph + 14);
  ctx.fillText(`Each shaded or unshaded band is half a wavelength (${half} nm): one full bright–dark–bright cycle.`, pad.left + pw / 2, pad.top + ph + 29);
  ctx.textAlign = 'right';
  ctx.fillText('100%', pad.left - 6, pad.top + 9);
  ctx.fillText('0%', pad.left - 6, pad.top + ph);
  ctx.textAlign = 'start';
}

// ── How DAS uses this ──────────────────────────────────────────────
// In DAS the "mirrors" are two random scatterers in the fiber, one gauge length apart. Stretching
// the section between them by ΔL lengthens the light's round trip through it by 2nΔL, and the
// photo-elastic effect reduces that by ξ ≈ 0.78, so the phase shift is Δφ = 4πnξΔL/λ at 1550 nm.
const DAS_N = 1.468, DAS_XI = 0.78, DAS_LAMBDA = 1550;
const das = { stretch: 0 };                       // Extra length of the gauge section (nm).
const dasPhase = () => (4 * Math.PI * DAS_N * DAS_XI * das.stretch) / DAS_LAMBDA;
// Each gauge's resting phase difference is random, set by its scatterers. A fixed value here.
const REST = 0.9;

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

const NEAR_COLOR = '#0072B2', FAR_COLOR = '#D55E00';
const imbalancedCanvas = $<HTMLCanvasElement>('pd-imbalanced');

/** The receiver used in many DAS systems: an imbalanced Mach–Zehnder with a 3×3 coupler. */
function drawImbalanced() {
  // The diagram needs about DIAGRAM_W pixels. The waves go to its right on a wide screen, and
  // below it on a narrower one, with the canvas made taller to fit.
  const DIAGRAM_W = 600;
  const width = imbalancedCanvas.getBoundingClientRect().width;
  const stacked = width < DIAGRAM_W + 520;
  const wantHeight = stacked ? '420px' : '250px';
  if (imbalancedCanvas.style.height !== wantHeight) imbalancedCanvas.style.height = wantHeight;
  const [ctx, w] = fit(imbalancedCanvas);
  title(ctx, 'A DAS receiver: an interferometer whose arms differ by one gauge length', w / 2, 16);
  const phi = REST + dasPhase();
  ctx.font = '11px system-ui, sans-serif';

  // The sensing fiber, with the two scatterers at z and z + G and the stretched section between.
  const fy = 58, f0 = 30, f1 = DIAGRAM_W - 40;
  const zA = f0 + (f1 - f0) * 0.3, zB = f0 + (f1 - f0) * 0.62;
  ctx.strokeStyle = '#3c4043'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(f0, fy); ctx.lineTo(f1, fy); ctx.stroke();
  ctx.fillStyle = das.stretch >= 0 ? 'rgba(179,88,6,0.3)' : 'rgba(33,102,172,0.3)';
  if (das.stretch !== 0) ctx.fillRect(zA, fy - 9, zB - zA, 18);
  // Arrows along the fiber, just outside the gauge section, show it stretching or compressing and
  // by how much; the change in length is written under "gauge length G".
  strainArrows(ctx, zA - 8, zB + 8, fy, das.stretch / 600, '');
  ctx.fillStyle = das.stretch >= 0 ? '#B35806' : '#2166AC';
  ctx.font = '600 11px system-ui, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(`ΔL = ${lengthChange(das.stretch)}`, (zA + zB) / 2, fy + 34);
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  for (const [x, c, label] of [[zA, NEAR_COLOR, 'scatterer at z'], [zB, FAR_COLOR, 'scatterer at z + G']] as const) {
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, fy, 5, 0, 2 * Math.PI); ctx.fill();
    ctx.fillStyle = '#5f6368';
    ctx.fillText(label, x, fy - 14);
  }
  ctx.fillText('gauge length G', (zA + zB) / 2, fy + 20);
  ctx.textAlign = 'right';
  ctx.fillText('sensing fiber →', f1, fy - 14);
  // Light returns to the left, down into the receiver.
  const ry = fy + 72, rx0 = f0 + 24;
  ctx.strokeStyle = '#9aa0a6'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(f0, fy); ctx.lineTo(f0, ry); ctx.lineTo(rx0, ry); ctx.stroke();

  // Receiver: a splitter into a short arm and a long arm (extra fiber that delays by 2nG/c),
  // recombined in a 3×3 coupler that feeds three detectors.
  const split = rx0 + 16, join = rx0 + 250, longY = ry + 56;
  ctx.strokeStyle = '#5f6368'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(rx0, ry); ctx.lineTo(split, ry); ctx.lineTo(join, ry); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(split, ry); ctx.lineTo(split + 30, longY); ctx.lineTo(join - 30, longY); ctx.lineTo(join, ry); ctx.stroke();
  const coilX = (split + join) / 2;
  for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.ellipse(coilX - 18 + k * 12, longY, 8, 12, 0, 0, 2 * Math.PI); ctx.stroke(); }
  ctx.fillStyle = '#5f6368'; ctx.textAlign = 'center';
  ctx.fillText('short arm: light from z + G', coilX, ry - 8);
  ctx.fillText('long arm (extra fiber delays it by 2nG/c): light from z', coilX, longY + 28);
  ctx.fillStyle = '#3c4043';
  ctx.fillRect(join, ry - 14, 26, 28);
  ctx.fillStyle = '#fff'; ctx.font = '600 10px system-ui, sans-serif';
  ctx.fillText('3×3', join + 13, ry + 4);
  ctx.font = '11px system-ui, sans-serif';
  const outs = [0, 1, 2].map(k => (1 + Math.cos(phi + (2 * Math.PI * k) / 3)) / 2);
  const bx0 = join + 46;
  outs.forEach((b, k) => {
    const y = ry - 26 + k * 26;
    ctx.strokeStyle = '#5f6368'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(join + 26, ry); ctx.lineTo(bx0, y); ctx.stroke();
    ctx.strokeStyle = 'rgba(128,128,128,0.6)'; ctx.lineWidth = 1;
    ctx.strokeRect(bx0, y - 8, 80, 16);
    ctx.fillStyle = '#000'; ctx.fillRect(bx0 + 1, y - 7, 78 * b, 14);
    ctx.fillStyle = '#5f6368'; ctx.textAlign = 'left';
    ctx.fillText(`detector ${k + 1} (+${k * 120}°): ${Math.round(b * 100)}%`, bx0 + 88, y + 4);
  });

  // The two waves meeting in the coupler, and their sum.
  const labelW = 150;
  const left = stacked ? f0 + labelW : DIAGRAM_W + labelW;
  const waveW = Math.max(100, w - left - 20);
  const wavesTop = stacked ? longY + 70 : 52;
  const amp = 11, k = (2 * Math.PI) / 60;
  const rows: [string, string, (x: number) => number][] = [
    ['from z (long arm)', NEAR_COLOR, x => Math.sin(k * x - clock * 3)],
    ['from z + G (short arm)', FAR_COLOR, x => Math.sin(k * x - clock * 3 + phi)],
    ['combined', '#000', x => Math.sin(k * x - clock * 3) + Math.sin(k * x - clock * 3 + phi)],
  ];
  rows.forEach(([label, color, f], i) => {
    const y0 = wavesTop + i * 44 + (i === 2 ? 10 : 0);
    ctx.fillStyle = '#5f6368'; ctx.textAlign = 'right';
    ctx.fillText(label, left - 10, y0 + 4);
    ctx.strokeStyle = 'rgba(128,128,128,0.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(left, y0); ctx.lineTo(left + waveW, y0); ctx.stroke();
    ctx.strokeStyle = color; ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let x = 0; x <= waveW; x += 2) { const y = y0 - f(x) * amp; if (x === 0) ctx.moveTo(left + x, y); else ctx.lineTo(left + x, y); }
    ctx.stroke();
  });
  ctx.textAlign = 'center'; ctx.fillStyle = '#5f6368';
  ctx.fillText(`phase difference = resting ${REST.toFixed(2)} rad ${dasPhase() >= 0 ? '+' : '−'} ${Math.abs(dasPhase()).toFixed(2)} rad from the stretch`,
    left + waveW / 2, wavesTop + 2 * 44 + 10 + 34);
  ctx.textAlign = 'start';
}

const heterodyneCanvas = $<HTMLCanvasElement>('pd-heterodyne');

/**
 * Coherent detection: the returning light is mixed with a copy of the laser shifted in frequency by
 * Δf, so each point's light makes a beat at Δf whose phase is that light's phase. The beats from
 * z and z + G are drawn on the same time axis; the stretch slides one relative to the other.
 */
function drawHeterodyne() {
  // The explanation sits right of the beats on a wide screen and below them on a narrow one.
  const narrow = heterodyneCanvas.getBoundingClientRect().width < 820;
  const wantHeight = narrow ? '320px' : '200px';
  if (heterodyneCanvas.style.height !== wantHeight) heterodyneCanvas.style.height = wantHeight;
  const [ctx, w] = fit(heterodyneCanvas);
  title(ctx, 'Coherent detection: each point’s light beats against a frequency-shifted copy of the laser', w / 2, 16);
  const phi = REST + dasPhase();
  const left = 130, pw = Math.max(160, (narrow ? w - 20 : w * 0.66) - left), amp = 16, cycles = 4;
  const rows: [string, string, number][] = [
    ['beat from z', NEAR_COLOR, 0],
    ['beat from z + G', FAR_COLOR, phi],
  ];
  rows.forEach(([label, color, ph], i) => {
    const y0 = 56 + i * 52;
    ctx.fillStyle = '#5f6368'; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(label, left - 10, y0 + 4);
    ctx.strokeStyle = 'rgba(128,128,128,0.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(left, y0); ctx.lineTo(left + pw, y0); ctx.stroke();
    ctx.strokeStyle = color; ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let x = 0; x <= pw; x += 2) {
      const y = y0 - Math.cos((2 * Math.PI * cycles * x) / pw - clock * 2 - ph) * amp;
      if (x === 0) ctx.moveTo(left + x, y); else ctx.lineTo(left + x, y);
    }
    ctx.stroke();
  });
  // Mark one peak of each beat, to show the offset between them.
  const peakX = (ph: number) => {
    const per = pw / cycles;
    let x = (((clock * 2 + ph) / (2 * Math.PI)) * per) % per;
    if (x < 0) x += per;
    return left + x + per; // The second cycle, away from the edge.
  };
  const xa = peakX(0), xb = peakX(phi);
  ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
  ctx.strokeStyle = NEAR_COLOR; ctx.beginPath(); ctx.moveTo(xa, 34); ctx.lineTo(xa, 56 + 52 + 22); ctx.stroke();
  ctx.strokeStyle = FAR_COLOR; ctx.beginPath(); ctx.moveTo(xb, 34); ctx.lineTo(xb, 56 + 52 + 22); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#5f6368'; ctx.font = '11px system-ui, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('time →', left + pw / 2, 56 + 52 + 40);
  ctx.fillText(`the beats are offset by the phase difference: ${(((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)).toFixed(2)} rad`, left + pw / 2, 56 + 52 + 58);

  // How the phases are found: each beat's phase is read from the detector signal, then subtracted.
  const tx = narrow ? left : left + pw + 30, ty = narrow ? 56 + 52 + 90 : 52;
  ctx.textAlign = 'left'; ctx.fillStyle = '#3c4043'; ctx.font = '600 11px system-ui, sans-serif';
  ctx.fillText('The interrogator:', tx, ty);
  ctx.font = '11px system-ui, sans-serif'; ctx.fillStyle = '#5f6368';
  const lines = [
    '1. measures each point’s beat phase',
    '2. subtracts the phases at z and z + G',
    `3. gets ${(((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)).toFixed(2)} rad, whose change`,
    '    from the resting value gives the strain',
    'The gauge length is chosen in software,',
    'so it can be changed after recording.',
  ];
  lines.forEach((t, i) => ctx.fillText(t, tx, ty + 18 + i * 16));
  ctx.textAlign = 'start';
}

// ── Controls ───────────────────────────────────────────────────────
const slider = $<HTMLInputElement>('pd-displacement');
const sliderOut = $('pd-displacement-out');
function syncSlider() {
  slider.value = String(settings.displacement);
  sliderOut.textContent = `${settings.displacement > 0 ? '+' : settings.displacement < 0 ? '−' : ''}${Math.abs(settings.displacement)} nm`;
}
slider.addEventListener('input', () => {
  settings.displacement = Number(slider.value);
  syncSlider();
  saveSettings();
});
const wavelengthSel = $<HTMLSelectElement>('pd-wavelength');
wavelengthSel.value = String(settings.wavelength);
wavelengthSel.addEventListener('change', () => { settings.wavelength = Number(wavelengthSel.value); saveSettings(); });
const oscBtn = $<HTMLButtonElement>('pd-oscillate');
function syncOscillate() {
  oscBtn.setAttribute('aria-pressed', String(settings.oscillate));
  oscBtn.textContent = settings.oscillate ? 'Stop moving' : 'Move back and forth';
}
oscBtn.addEventListener('click', () => { settings.oscillate = !settings.oscillate; syncOscillate(); saveSettings(); });

// The Examples menu moves the mirror to a telling position, then returns to its "Examples" prompt.
const exampleMenu = $<HTMLSelectElement>('pd-example');
exampleMenu.addEventListener('change', () => {
  const lambda = settings.wavelength;
  const target: Record<string, number> = {
    rest: 0,
    quarter: Math.round(lambda / 4),
    half: Math.round(lambda / 2),
    oneNm: 1,
  };
  const d = target[exampleMenu.value];
  exampleMenu.value = '';
  if (d === undefined) return;
  settings.oscillate = false;
  settings.displacement = d;
  syncOscillate();
  syncSlider();
  saveSettings();
});

// ── Main loop ──────────────────────────────────────────────────────
let last = performance.now();
let oscPhase = 0;
function frame(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  clock += dt;
  if (settings.oscillate) {
    // Sweep slowly across a little over one wavelength each way.
    oscPhase += dt * 0.6;
    settings.displacement = Math.round(Math.sin(oscPhase) * Math.min(800, settings.wavelength));
    syncSlider();
  }
  drawSchematic();
  drawWaves();
  drawFringes();
  drawImbalanced();
  drawHeterodyne();
  requestAnimationFrame(frame);
}

const PIN_KEY = 'phase_distance_pinned_panels';
const panels = setupPanels('pd', () =>
  saveJSON(PIN_KEY, panels.list.map((p, i) => (panels.isPinned(p) ? i : -1)).filter(i => i >= 0)));
for (const i of loadJSON<number[]>(PIN_KEY) ?? []) if (panels.list[i]) panels.setPinned(panels.list[i], true);
{
  // The DAS demos share one control: how much the gauge section is stretched.
  const input = $<HTMLInputElement>('pd-das-stretch'), out = $('pd-das-stretch-out');
  const sync = () => {
    out.textContent = `${das.stretch > 0 ? '+' : das.stretch < 0 ? '−' : ''}${Math.abs(das.stretch)} nm`;
    $('pd-das-phase').textContent = `${dasPhase() >= 0 ? '+' : '−'}${Math.abs(dasPhase()).toFixed(2)} rad`;
  };
  input.value = '0';
  input.addEventListener('input', () => { das.stretch = Number(input.value); sync(); });
  sync();
}
setupHelp('pd');
syncSlider();
syncOscillate();
requestAnimationFrame(frame);
