// ╭───────────────────────────────────────────────────────────────╮
// │                  Exact fractions for matrices                 │
// ╰───────────────────────────────────────────────────────────────╯
// Matrix entries are exact fractions of BigInts, so row operations never round: "0.1" is exactly
// 1/10, and 1/3 + 1/3 + 1/3 is exactly 1. Shared by the matrix tools (see ../echelon_form.ts and
// ../gaussian_elimination.ts).

export interface Fraction { num: bigint; den: bigint }  // den > 0; not necessarily reduced

// A number with an optional decimal point, like "3", "2.5", "4.", or ".5".
const NUMBER   = String.raw`(\d+(?:\.\d*)?|\.\d+)`;
const ENTRY_RE = new RegExp(`^([+-]?)${NUMBER}(?:/([+-]?)${NUMBER})?$`);

function decimal(text: string): Fraction {
  const [whole, frac = ""] = text.split(".");
  return { num: BigInt(whole + frac), den: 10n ** BigInt(frac.length) };
}

// Parses an entry like "3", "-2.5", or "1/3". A blank entry is zero. Returns null if the text
// isn't a number (or divides by zero).
export function parseEntry(text: string): Fraction | null {
  const s = text.replace(/\s+/g, "").replace(/[−–]/g, "-");  // Accept typographic minus signs
  if (s === "") return { num: 0n, den: 1n };
  const match = ENTRY_RE.exec(s);
  if (!match) return null;
  const [, sign, top, bottomSign, bottom] = match;
  let { num, den } = decimal(top);
  if (sign === "-") num = -num;
  if (bottom !== undefined) {
    const divisor = decimal(bottom);
    if (divisor.num === 0n) return null;
    // (n1/d1) / (n2/d2) = (n1 d2) / (d1 n2)
    num *= divisor.den;
    den *= divisor.num;
    if (bottomSign === "-") num = -num;
  }
  return { num, den };
}

export const isZero = (x: Fraction) => x.num === 0n;
export const isOne  = (x: Fraction) => x.num === x.den;

// The greatest common divisor, which is never negative.
function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

// Formats a fraction in lowest terms, like "−3" or "1/2".
export function formatFraction(x: Fraction): string {
  const g = gcd(x.num, x.den) || 1n;
  const num = x.num / g, den = x.den / g;
  const text = den === 1n ? `${num}` : `${num}/${den}`;
  return text.replace("-", "−");
}

// ⋘──────── Arithmetic ────────⋙

export const fraction = (num: bigint | number, den: bigint | number = 1): Fraction =>
  reduce({ num: BigInt(num), den: BigInt(den) });

// Lowest terms, with a positive denominator.
export function reduce(x: Fraction): Fraction {
  const sign = x.den < 0n ? -1n : 1n;
  const g = gcd(x.num, x.den) || 1n;
  return { num: sign * x.num / g, den: sign * x.den / g };
}

export const add = (x: Fraction, y: Fraction) => reduce({ num: x.num * y.den + y.num * x.den, den: x.den * y.den });
export const sub = (x: Fraction, y: Fraction) => reduce({ num: x.num * y.den - y.num * x.den, den: x.den * y.den });
export const mul = (x: Fraction, y: Fraction) => reduce({ num: x.num * y.num, den: x.den * y.den });
export const neg = (x: Fraction): Fraction => ({ num: -x.num, den: x.den });
// x / y, for y ≠ 0.
export const div = (x: Fraction, y: Fraction) => reduce({ num: x.num * y.den, den: x.den * y.num });
export const equals = (x: Fraction, y: Fraction) => x.num * y.den === y.num * x.den;
