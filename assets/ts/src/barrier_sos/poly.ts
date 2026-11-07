// ╭───────────────────────────────────────────────────────────────╮
// │   Multivariate polynomials: parsing, arithmetic, formatting   │
// ╰───────────────────────────────────────────────────────────────╯
// A Poly is a map from exponent vectors to real coefficients. Every polynomial in a problem uses
// the same ordered list of variables (state, then flow disturbances, then jump disturbances), so
// exponent vectors from different polynomials line up. Exponent vectors are stored as strings
// ("2,0,1" means x1^2*x3) so they can be used as Map keys.

// Coefficients smaller than this are treated as round-off and dropped.
const ZERO_TOL = 1e-13;

export class Poly {
  readonly n: number;
  readonly terms: Map<string, number>;

  constructor(n: number, terms?: Map<string, number>) {
    this.n = n;
    this.terms = terms ?? new Map();
  }

  static constant(n: number, c: number): Poly {
    const p = new Poly(n);
    if (Math.abs(c) > ZERO_TOL) p.terms.set(new Array(n).fill(0).join(","), c);
    return p;
  }

  static variable(n: number, i: number): Poly {
    const exps = new Array(n).fill(0);
    exps[i] = 1;
    return new Poly(n, new Map([[exps.join(","), 1]]));
  }

  static monomial(exps: number[]): Poly {
    return new Poly(exps.length, new Map([[exps.join(","), 1]]));
  }

  isZero(): boolean { return this.terms.size === 0; }

  // The value of a constant polynomial, or null if the polynomial isn't constant.
  constantValue(): number | null {
    if (this.isZero()) return 0;
    if (this.terms.size > 1) return null;
    const [[key, c]] = this.terms;
    return key.split(",").every((e) => e === "0") ? c : null;
  }

  add(other: Poly): Poly {
    const terms = new Map(this.terms);
    for (const [key, c] of other.terms) addTerm(terms, key, c);
    return new Poly(this.n, terms);
  }

  sub(other: Poly): Poly { return this.add(other.scale(-1)); }

  scale(s: number): Poly {
    const terms = new Map<string, number>();
    for (const [key, c] of this.terms) addTerm(terms, key, s * c);
    return new Poly(this.n, terms);
  }

  mul(other: Poly): Poly {
    const terms = new Map<string, number>();
    for (const [k1, c1] of this.terms) {
      const e1 = parseKey(k1);
      for (const [k2, c2] of other.terms) {
        const e2 = parseKey(k2);
        addTerm(terms, e1.map((e, i) => e + e2[i]).join(","), c1 * c2);
      }
    }
    return new Poly(this.n, terms);
  }

  pow(k: number): Poly {
    let result = Poly.constant(this.n, 1);
    for (let i = 0; i < k; i++) result = result.mul(this);
    return result;
  }

  // Partial derivative with respect to variable i.
  diff(i: number): Poly {
    const terms = new Map<string, number>();
    for (const [key, c] of this.terms) {
      const exps = parseKey(key);
      if (exps[i] === 0) continue;
      const c2 = c * exps[i];
      exps[i] -= 1;
      addTerm(terms, exps.join(","), c2);
    }
    return new Poly(this.n, terms);
  }

  // Substitutes subs[i] for variable i wherever subs[i] is defined.
  compose(subs: (Poly | undefined)[]): Poly {
    let result = new Poly(this.n);
    for (const [key, c] of this.terms) {
      let term = Poly.constant(this.n, c);
      parseKey(key).forEach((e, i) => {
        if (e === 0) return;
        const s = subs[i];
        term = term.mul(s ? s.pow(e) : Poly.variable(this.n, i).pow(e));
      });
      result = result.add(term);
    }
    return result;
  }

  // Total degree in the variables with the given indices (all variables by default). The zero
  // polynomial has degree -1.
  degree(indices?: number[]): number {
    let deg = -1;
    for (const key of this.terms.keys()) {
      const exps = parseKey(key);
      const d = (indices ?? exps.map((_, i) => i)).reduce((sum, i) => sum + exps[i], 0);
      deg = Math.max(deg, d);
    }
    return deg;
  }

  // Indices of the variables that appear in the polynomial.
  variablesUsed(): Set<number> {
    const used = new Set<number>();
    for (const key of this.terms.keys()) {
      parseKey(key).forEach((e, i) => { if (e > 0) used.add(i); });
    }
    return used;
  }

  // Terms sorted from highest to lowest degree, then by exponents.
  sortedTerms(): { exps: number[]; c: number }[] {
    return [...this.terms]
      .map(([key, c]) => ({ exps: parseKey(key), c }))
      .sort((a, b) => {
        const da = sum(a.exps), db = sum(b.exps);
        if (da !== db) return db - da;
        for (let i = 0; i < a.exps.length; i++) {
          if (a.exps[i] !== b.exps[i]) return b.exps[i] - a.exps[i];
        }
        return 0;
      });
  }
}

function addTerm(terms: Map<string, number>, key: string, c: number): void {
  const total = (terms.get(key) ?? 0) + c;
  if (Math.abs(total) <= ZERO_TOL) terms.delete(key);
  else terms.set(key, total);
}

function parseKey(key: string): number[] { return key.split(",").map(Number); }

function sum(xs: number[]): number { return xs.reduce((a, b) => a + b, 0); }

// All exponent vectors over `vars` (indices into an n-variable space) with total degree in
// [minDeg, maxDeg], ordered by degree and then lexicographically (x1 before x2).
export function monomialExponents(n: number, vars: number[], maxDeg: number, minDeg = 0): number[][] {
  const result: number[][] = [];
  const exps = new Array(n).fill(0);
  const recurse = (k: number, remaining: number): void => {
    if (k === vars.length) {
      if (remaining === 0) result.push([...exps]);
      return;
    }
    for (let e = remaining; e >= 0; e--) {
      exps[vars[k]] = e;
      recurse(k + 1, remaining - e);
    }
    exps[vars[k]] = 0;
  };
  for (let d = minDeg; d <= maxDeg; d++) recurse(0, d);
  return result;
}

// ⋘──────── Parsing ────────⋙

export class ParseError extends Error {}

export interface ParseContext {
  n: number;                            // Total number of variables
  varIndex: Map<string, number>;        // Every variable in the problem
  allowed: Set<string>;                 // Variables allowed in this expression
  params: Map<string, number>;          // Named constants
  latexNames: string[];                 // LaTeX for each variable, used to display constraints
}

type Token = { kind: "num"; value: number } | { kind: "id"; name: string } | { kind: "op"; op: string };

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  const re = /\s*(?:(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?)|([A-Za-z_][A-Za-z0-9_]*)|(\*\*|[-+*/^()]))/y;
  let pos = 0;
  while (pos < src.length) {
    if (/^\s*$/.test(src.slice(pos))) break;
    re.lastIndex = pos;
    const m = re.exec(src);
    if (!m) throw new ParseError(`Unexpected character "${src.slice(pos).trim()[0]}" in "${src.trim()}".`);
    if (m[1] !== undefined) tokens.push({ kind: "num", value: parseFloat(m[1]) });
    else if (m[2] !== undefined) tokens.push({ kind: "id", name: m[2] });
    else tokens.push({ kind: "op", op: m[3] === "**" ? "^" : m[3] });
    pos = re.lastIndex;
  }
  return tokens;
}

// Parses an expression such as "x1^2 - 3*(x2 + p)/2" into a polynomial.
export function parsePoly(src: string, ctx: ParseContext): Poly {
  const tokens = tokenize(src);
  if (tokens.length === 0) throw new ParseError("Expected an expression.");
  let pos = 0;
  const peek = () => tokens[pos];
  const isOp = (op: string) => { const t = peek(); return t?.kind === "op" && t.op === op; };

  const expr = (): Poly => {
    let p = term();
    while (isOp("+") || isOp("-")) {
      const op = (tokens[pos++] as { op: string }).op;
      const rhs = term();
      p = op === "+" ? p.add(rhs) : p.sub(rhs);
    }
    return p;
  };
  const term = (): Poly => {
    let p = unary();
    while (isOp("*") || isOp("/")) {
      const op = (tokens[pos++] as { op: string }).op;
      const rhs = unary();
      if (op === "*") { p = p.mul(rhs); continue; }
      const c = rhs.constantValue();
      if (c === null) throw new ParseError(`Can only divide by constants in "${src.trim()}".`);
      if (c === 0) throw new ParseError(`Division by zero in "${src.trim()}".`);
      p = p.scale(1 / c);
    }
    return p;
  };
  const unary = (): Poly => {
    if (isOp("-")) { pos++; return unary().scale(-1); }
    if (isOp("+")) { pos++; return unary(); }
    return power();
  };
  const power = (): Poly => {
    const base = primary();
    if (!isOp("^")) return base;
    pos++;
    const k = unary().constantValue();
    if (k === null || k < 0 || !Number.isInteger(k)) {
      throw new ParseError(`Exponents must be nonnegative integers in "${src.trim()}".`);
    }
    return base.pow(k);
  };
  const primary = (): Poly => {
    const t = tokens[pos++];
    if (!t) throw new ParseError(`Unexpected end of "${src.trim()}".`);
    if (t.kind === "num") return Poly.constant(ctx.n, t.value);
    if (t.kind === "id") {
      if (ctx.params.has(t.name)) return Poly.constant(ctx.n, ctx.params.get(t.name)!);
      if (t.name === "pi") return Poly.constant(ctx.n, Math.PI);
      if (ctx.allowed.has(t.name)) return Poly.variable(ctx.n, ctx.varIndex.get(t.name)!);
      if (ctx.varIndex.has(t.name)) throw new ParseError(`"${t.name}" can't be used here.`);
      throw new ParseError(`Unknown symbol "${t.name}". Declare it as a variable or parameter.`);
    }
    if (t.op === "(") {
      const p = expr();
      if (!isOp(")")) throw new ParseError(`Missing ")" in "${src.trim()}".`);
      pos++;
      return p;
    }
    throw new ParseError(`Unexpected "${t.op}" in "${src.trim()}".`);
  };

  const result = expr();
  if (pos < tokens.length) {
    const t = tokens[pos];
    const text = t.kind === "num" ? String(t.value) : t.kind === "id" ? t.name : t.op;
    throw new ParseError(`Unexpected "${text}" in "${src.trim()}". (Use * for multiplication.)`);
  }
  return result;
}

// ⋘──────── Semialgebraic sets ────────⋙
// A set is a union of pieces, and each piece is {x : g_i(x) >= 0 for all i, h_k(x) = 0 for all k}.

export interface SetPiece {
  ineqs: Poly[];  // g_i >= 0
  eqs: Poly[];    // h_k = 0
  latex: string[]; // The constraints as written (with parameters evaluated), for display
}

// `pieces` is empty for the empty set and is [{ineqs: [], eqs: []}] for the whole space.
export interface SemiSet { pieces: SetPiece[]; }

export const WHOLE_SPACE: SemiSet = { pieces: [{ ineqs: [], eqs: [], latex: [] }] };

// Parses one constraint per line (or separated by commas or semicolons), with pieces of a union
// separated by lines that say "or". A chain like "0 <= x1 <= 1" gives two constraints. Strict
// inequalities are treated as non-strict. Blank input means `blank`; "empty" means the empty set.
export function parseSet(src: string, ctx: ParseContext, blank: "all" | "empty"): SemiSet {
  const lines = src.split("\n").map((l) => l.replace(/[#%].*$/, "").trim()).filter((l) => l !== "");
  if (lines.length === 0) return blank === "all" ? WHOLE_SPACE : { pieces: [] };
  if (lines.length === 1 && /^(empty|∅|none)$/i.test(lines[0])) return { pieces: [] };

  const pieces: SetPiece[] = [{ ineqs: [], eqs: [], latex: [] }];
  for (const line of lines) {
    if (/^or$/i.test(line)) { pieces.push({ ineqs: [], eqs: [], latex: [] }); continue; }
    for (const part of line.split(/[,;]|\band\b/)) {
      if (part.trim() === "") continue;
      parseConstraint(part, ctx, pieces[pieces.length - 1]);
    }
  }
  if (pieces.some((p) => p.ineqs.length === 0 && p.eqs.length === 0)) {
    throw new ParseError('Each piece of a union (between "or" lines) needs at least one constraint.');
  }
  return { pieces };
}

function parseConstraint(src: string, ctx: ParseContext, piece: SetPiece): void {
  const parts = src.split(/(<=|>=|==|=|<|>|≤|≥)/);
  if (parts.length < 3) {
    throw new ParseError(`Expected a comparison such as "<=", ">=", or "=" in "${src.trim()}".`);
  }
  const sides = parts.filter((_, i) => i % 2 === 0).map((s) => parsePoly(s, ctx));
  const ops = parts.filter((_, i) => i % 2 === 1);
  const opLatex = (op: string) => op === "=" || op === "==" ? "=" : /<|≤/.test(op) ? "\\le" : "\\ge";
  piece.latex.push(sides.map((side, i) =>
    (i > 0 ? ` ${opLatex(ops[i - 1])} ` : "") + polyToLatex(side, ctx.latexNames)).join(""));
  ops.forEach((op, i) => {
    const [a, b] = [sides[i], sides[i + 1]];
    if (op === "=" || op === "==") piece.eqs.push(a.sub(b));
    else if (op === "<=" || op === "<" || op === "≤") piece.ineqs.push(b.sub(a));
    else piece.ineqs.push(a.sub(b));
  });
}

// ⋘──────── Formatting ────────⋙

export function formatNumber(c: number): string {
  if (Number.isInteger(c) && Math.abs(c) < 1e15) return String(c);
  return String(parseFloat(c.toPrecision(12)));
}

// Formats a polynomial as MATLAB code.
export function polyToCode(p: Poly, names: string[], powOp = "^"): string {
  if (p.isZero()) return "0";
  return joinTerms(p.sortedTerms().map(({ exps, c }) => {
    const factors = exps.flatMap((e, i) => e === 0 ? [] : [e === 1 ? names[i] : `${names[i]}${powOp}${e}`]);
    const mag = Math.abs(c);
    const body = factors.length === 0 ? formatNumber(mag)
      : mag === 1 ? factors.join("*")
      : `${formatNumber(mag)}*${factors.join("*")}`;
    return { negative: c < 0, body };
  }));
}

export function polyToLatex(p: Poly, names: string[]): string {
  if (p.isZero()) return "0";
  return joinTerms(p.sortedTerms().map(({ exps, c }) => {
    const factors = exps.flatMap((e, i) => e === 0 ? [] : [e === 1 ? names[i] : `${names[i]}^{${e}}`]);
    const mag = Math.abs(c);
    const body = factors.length === 0 ? numberToLatex(mag)
      : mag === 1 ? factors.join(" ")
      : `${numberToLatex(mag)} ${factors.join(" ")}`;
    return { negative: c < 0, body };
  }));
}

function numberToLatex(c: number): string {
  const s = formatNumber(c);
  const m = /^(-?[\d.]+)e([+-]?\d+)$/.exec(s);
  if (!m) return s;
  return `${m[1]} \\times 10^{${parseInt(m[2])}}`;
}

function joinTerms(terms: { negative: boolean; body: string }[]): string {
  return terms.map((t, i) => i === 0 ? (t.negative ? `-${t.body}` : t.body) : `${t.negative ? " - " : " + "}${t.body}`).join("");
}

const GREEK = new Set([
  "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa", "lambda",
  "mu", "nu", "xi", "pi", "rho", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega",
  "Gamma", "Delta", "Theta", "Lambda", "Xi", "Pi", "Sigma", "Phi", "Psi", "Omega",
]);

// "x1" -> "x_{1}", "theta2" -> "\theta_{2}", "x_dot" -> "x_{\mathrm{dot}}", "vel" -> "\mathit{vel}".
export function nameToLatex(name: string): string {
  const base = (s: string) => GREEK.has(s) ? `\\${s}` : s.length === 1 ? s : `\\mathit{${s}}`;
  let m = /^([A-Za-z]+?)(\d+)$/.exec(name);
  if (m) return `${base(m[1])}_{${m[2]}}`;
  m = /^([A-Za-z]+)_([A-Za-z0-9]+)$/.exec(name);
  if (m) return `${base(m[1])}_{${/^\d+$/.test(m[2]) ? m[2] : `\\mathrm{${m[2]}}`}}`;
  return base(name);
}

// Displays a set as {tuple : constraints} pieces joined by ∪. `space` is used for the whole space.
export function setToLatex(set: SemiSet, tuple: string, space: string): string {
  if (set.pieces.length === 0) return "\\emptyset";
  if (set.pieces.length === 1 && set.pieces[0].latex.length === 0) return space;
  return set.pieces.map((p) => `\\left\\{ ${tuple} : ${p.latex.join(",\\ ")} \\right\\}`).join(" \\cup ");
}
