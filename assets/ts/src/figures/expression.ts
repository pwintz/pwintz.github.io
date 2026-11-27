// ╭───────────────────────────────────────────────────────────────╮
// │        Formulas of one variable, read from a figure's params     │
// ╰───────────────────────────────────────────────────────────────╯
// A small parser for formulas such as "x^2 sin(1/x)" or "exp(-abs(t))", so that a page's front
// matter can give the function to plot. It knows +, −, *, /, ^ (power, right to left), unary minus,
// parentheses, the constants pi and e, the functions below, and a product written without "*"
// ("2x", "x sin(x)", "(x + 1)(x - 1)"). The variable is a single name, "x" by default; with
// parseFormulaIn, a formula can have several variables, such as "y" and "-x" for a vector field.

export type Fn = (x: number) => number;
/** A formula of several variables, evaluated at the values of the variables, in order. */
export type FnN = (values: number[]) => number;

/** The Cantor function on [0, 1] (and 0 to the left, 1 to the right), from the base-3 digits of x. */
export function cantorFunction(x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  let value = 0, scale = 0.5;
  for (let k = 0; k < 50; k++) {
    x *= 3;
    const digit = Math.floor(x);
    x -= digit;
    // A digit 1 means x is in a removed middle third, where the function is constant.
    if (digit === 1) return value + scale;
    if (digit === 2) value += scale;
    scale /= 2;
  }
  return value;
}

const FUNCTIONS: Record<string, Fn> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan, arctan: Math.atan, atan: Math.atan,
  exp: Math.exp, ln: Math.log, log: Math.log, sqrt: Math.sqrt, abs: Math.abs,
  sign: Math.sign, floor: Math.floor, cantor: cantorFunction,
};
const CONSTANTS: Record<string, number> = { pi: Math.PI, e: Math.E };

type Token = { kind: "num"; value: number } | { kind: "name"; value: string } | { kind: "op"; value: string };

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    const num = /^(\d+\.?\d*|\.\d+)/.exec(src.slice(i));
    if (num) { tokens.push({ kind: "num", value: Number(num[1]) }); i += num[1].length; continue; }
    const name = /^[A-Za-z]+/.exec(src.slice(i));
    if (name) {
      // A run of letters is one name, so names that multiply need a space: "x sin(x)", not "xsin(x)".
      tokens.push({ kind: "name", value: name[0] });
      i += name[0].length;
      continue;
    }
    if ("+-*/^()".includes(c)) { tokens.push({ kind: "op", value: c }); i++; continue; }
    if (c === "−") { tokens.push({ kind: "op", value: "-" }); i++; continue; }
    throw new Error(`Unexpected "${c}" in "${src}"`);
  }
  return tokens;
}

/**
 * Parses a formula in the variable `v` into a function. Throws an Error for a formula it can't read.
 */
export function parseFormula(src: string, v = "x"): Fn {
  const f = parseFormulaIn(src, [v]);
  const values = [0];
  return x => { values[0] = x; return f(values); };
}

/**
 * Parses a formula in the variables `vars` into a function of their values (in the same order).
 * Throws an Error for a formula it can't read.
 */
export function parseFormulaIn(src: string, vars: string[]): FnN {
  type Fn = FnN;
  const tokens = tokenize(src);
  let pos = 0;
  const peek = () => tokens[pos];
  const isOp = (t: Token | undefined, op: string) => t?.kind === "op" && t.value === op;
  const expect = (op: string) => {
    if (!isOp(peek(), op)) throw new Error(`Expected "${op}" in "${src}"`);
    pos++;
  };

  // sum := product (("+" | "-") product)*
  const sum = (): Fn => {
    let f = product();
    while (isOp(peek(), "+") || isOp(peek(), "-")) {
      const op = tokens[pos++].value, a = f, b = product();
      f = op === "+" ? x => a(x) + b(x) : x => a(x) - b(x);
    }
    return f;
  };
  // product := unary (("*" | "/")? unary)*, where a missing operator means "*".
  const product = (): Fn => {
    let f = unary();
    for (;;) {
      const t = peek();
      if (isOp(t, "*") || isOp(t, "/")) {
        pos++;
        const a = f, b = unary();
        f = t!.value === "*" ? x => a(x) * b(x) : x => a(x) / b(x);
      } else if (t && (t.kind === "num" || t.kind === "name" || isOp(t, "("))) {
        const a = f, b = power();
        f = x => a(x) * b(x);
      } else return f;
    }
  };
  // unary := "-" unary | power
  const unary = (): Fn => {
    if (isOp(peek(), "-")) { pos++; const a = unary(); return x => -a(x); }
    if (isOp(peek(), "+")) { pos++; return unary(); }
    return power();
  };
  // power := atom ("^" unary)?, so that 2^-x and x^2^3 = x^(2^3) work.
  const power = (): Fn => {
    const base = atom();
    if (!isOp(peek(), "^")) return base;
    pos++;
    const exp = unary();
    return x => Math.pow(base(x), exp(x));
  };
  const atom = (): Fn => {
    const t = tokens[pos++];
    if (!t) throw new Error(`Unexpected end of "${src}"`);
    if (t.kind === "num") { const c = t.value; return () => c; }
    if (isOp(t, "(")) { const f = sum(); expect(")"); return f; }
    if (t.kind === "name") {
      const k = vars.indexOf(t.value);
      if (k >= 0) return x => x[k];
      if (t.value in CONSTANTS) { const c = CONSTANTS[t.value]; return () => c; }
      if (t.value in FUNCTIONS) {
        const g = FUNCTIONS[t.value];
        // A function takes a parenthesized argument, or (like "sin x") the next power.
        const arg = isOp(peek(), "(") ? (pos++, (() => { const f = sum(); expect(")"); return f; })()) : power();
        return x => g(arg(x));
      }
      throw new Error(`Unknown name "${t.value}" in "${src}"`);
    }
    throw new Error(`Unexpected "${t.value}" in "${src}"`);
  };

  const f = sum();
  if (pos < tokens.length) throw new Error(`Unexpected "${tokens[pos].value}" in "${src}"`);
  return f;
}
