// ╭───────────────────────────────────────────────────────────────╮
// │          Exact vector and matrix arithmetic (fractions)       │
// ╰───────────────────────────────────────────────────────────────╯
// Inner products, matrix products, and row reduction with exact fractions (./fraction.ts), for the
// tools that show their calculations step by step.

import { Fraction, add, div, fraction, isZero, mul, sub } from './fraction';

export type FVec = Fraction[];
export type FMat = Fraction[][];  // A list of rows

export const ZERO = fraction(0);
export const toNumber = (x: Fraction) => Number(x.num) / Number(x.den);

export const fdot = (a: FVec, b: FVec) => a.reduce((s, x, i) => add(s, mul(x, b[i])), ZERO);
export const fscale = (k: Fraction, a: FVec) => a.map(x => mul(k, x));
export const fadd = (a: FVec, b: FVec) => a.map((x, i) => add(x, b[i]));
export const fsub = (a: FVec, b: FVec) => a.map((x, i) => sub(x, b[i]));
export const isZeroVec = (a: FVec) => a.every(isZero);

export const transpose = (m: FMat): FMat => (m[0] ?? []).map((_, j) => m.map(row => row[j]));
export const matMul = (a: FMat, b: FMat): FMat =>
  a.map(row => b[0].map((_, j) => row.reduce((s, x, k) => add(s, mul(x, b[k][j])), ZERO)));
export const matVec = (a: FMat, v: FVec): FVec => a.map(row => fdot(row, v));
/** The matrix whose columns are `cols`. */
export const fromColumns = (cols: FVec[]): FMat => transpose(cols);

/** Row reduces a copy of `m`, returning its RREF and pivot columns. */
export function rref(m: FMat): { r: FMat; pivots: number[] } {
  const r = m.map(row => [...row]);
  const pivots: number[] = [];
  let row = 0;
  for (let col = 0; col < (r[0]?.length ?? 0) && row < r.length; col++) {
    const p = r.findIndex((x, i) => i >= row && !isZero(x[col]));
    if (p < 0) continue;
    [r[row], r[p]] = [r[p], r[row]];
    const lead = r[row][col];
    r[row] = r[row].map(x => div(x, lead));
    for (let i = 0; i < r.length; i++) {
      if (i === row || isZero(r[i][col])) continue;
      const c = r[i][col];
      r[i] = r[i].map((x, k) => sub(x, mul(c, r[row][k])));
    }
    pivots.push(col);
    row++;
  }
  return { r, pivots };
}

/** The greatest common divisor of two BigInts, which is never negative. */
function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

/**
 * The positive multiple of `v` with integer entries that have no common factor, and the factor
 * used. Scaling a vector this way doesn't change the line it spans, and it makes hand
 * calculations simpler. The zero vector is returned unchanged.
 */
export function clearDenominators(v: FVec): { v: FVec; factor: Fraction } {
  if (isZeroVec(v)) return { v, factor: fraction(1) };
  let lcm = 1n;
  for (const x of v) lcm = lcm / gcd(lcm, x.den) * x.den;
  let g = 0n;
  for (const x of v) g = gcd(g, x.num * (lcm / x.den));
  const factor = fraction(lcm, g);
  return { v: fscale(factor, v), factor };
}
