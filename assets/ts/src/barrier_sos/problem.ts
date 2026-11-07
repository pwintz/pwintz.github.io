// ╭───────────────────────────────────────────────────────────────╮
// │     Hybrid system specification and its SOS conditions        │
// ╰───────────────────────────────────────────────────────────────╯
// A hybrid system H = (C, F, D, G) in the framework of Goebel, Sanfelice, and Teel, with state
// x = (z, q), where z ∈ R^n is continuous and q is a logic variable (mode) in a finite set. For
// each mode q, flows satisfy ż ∈ F_q(z) = {f_q(z, w) : w ∈ W_q} while z ∈ C_q. Jumps are listed
// as pieces: from mode q to q', z⁺ ∈ G_j(z) = {g_j(z, v) : v ∈ V_j} while z ∈ D_j. With one mode
// and no logic variable, this is the plain hybrid inclusion H = (C, F, D, G).
//
// We look for B(z, q) = B_q(z) such that, for some ε > 0 and every mode q and jump piece j,
//   (init)    B_q(z) ≤ 0                                   on X0_q,
//   (unsafe)  B_q(z) ≥ ε                                   on Xu_q,
//   (flow)    ⟨∇B_q(z), f_q(z, w)⟩ ≤ λ_q(z) B_q(z)         on C_q × W_q,
//   (jump)    B_q'(g_j(z, v)) ≤ σ_j(z, v) B_q(z)            on D_j × V_j,  with σ_j ≥ 0,
// where λ_q is any polynomial. Each condition is relaxed to an SOS constraint with the
// generalized S-procedure (Prajna & Jadbabaie 2004, Prop. 3). When an integral constraint
// ∫ φ(z, w) dt ≥ 0 is given, the flow condition gets an extra -τ φ term with τ ≥ 0, and λ_q = 0
// and σ_j = 1 are required (Prajna & Jadbabaie 2004, Thm. 3).

import {
  Poly, ParseContext, ParseError, SemiSet, WHOLE_SPACE, formatNumber, nameToLatex, parsePoly, parseSet, polyToLatex, setToLatex,
} from "./poly";

// ⋘──────── Specification (as entered on the page) ────────⋙

export type Task = "synthesize" | "verify";

export interface ModeSpec {
  name: string;
  flowMap: string[];     // ẋ_k for each state variable x_k, in order
  flowSet: string;       // C_q
  flowDist: string;      // W_q
  init: string;          // X0 restricted to mode q
  unsafe: string;        // Xu restricted to mode q
  barrierDegree: number; // Degree of B_q when synthesizing
  barrier: string;       // B_q when verifying
  lambda: string;        // Fixed λ_q when synthesizing
  lambdaDegree: number;  // Degree of λ_q when verifying
}

export interface JumpSpec {
  from: number;          // Mode indices (0-based)
  to: number;
  jumpSet: string;       // D_j
  jumpMap: string[];     // x_k⁺ for each state variable x_k, in order; blank means unchanged
  jumpDist: string;      // V_j
  sigma: string;         // Fixed σ_j ≥ 0 when synthesizing
  sigmaDegree: number;   // Degree of the SOS multiplier σ_j when verifying
}

export interface ProblemSpec {
  stateVars: string;
  flowDistVars: string;
  jumpDistVars: string;
  params: string;
  task: Task;
  epsilon: string;
  extraDegree: number;
  iqc: string;           // φ(z, w) in ∫ φ dt ≥ 0, or blank
  modes: ModeSpec[];
  jumps: JumpSpec[];
}

// ⋘──────── Compiled problem ────────⋙

export type BarrierDef = { kind: "unknown"; degree: number } | { kind: "given"; poly: Poly };

export interface CompiledMode {
  name: string;
  B: BarrierDef;
  f: Poly[];
  C: SemiSet;
  W: SemiSet;
  X0: SemiSet;
  Xu: SemiSet;
  lambda: { kind: "fixed"; poly: Poly } | { kind: "free"; degree: number };
  wVars: number[];       // Flow disturbance variables that this mode uses
}

export interface CompiledJump {
  from: number;
  to: number;
  D: SemiSet;
  g: Poly[];             // One entry per state component
  V: SemiSet;
  sigma: { kind: "fixed"; value: number } | { kind: "free"; degree: number };
  vVars: number[];       // Jump disturbance variables that this jump uses
}

export interface Multiplier {
  name: string;          // Name in generated code
  kind: "sos" | "free";  // SOS for inequalities g ≥ 0, free for equalities h = 0
  degree: number;
  constraint: Poly;      // The g or h that it multiplies
}

export interface Condition {
  kind: "init" | "unsafe" | "flow" | "jump";
  mode: number;          // For a jump, the mode jumped from
  jump: number;          // Jump index, or -1
  piece: string;         // Which pieces of unions this condition covers, e.g. " (piece 2 of Xu)"
  vars: number[];        // Variables of the SOS constraint
  degree: number;        // Even degree bound of the SOS constraint
  multipliers: Multiplier[];
}

export interface Compiled {
  names: string[];       // All variables: state, then flow disturbances, then jump disturbances
  latexNames: string[];
  z: number[];
  w: number[];
  v: number[];
  task: Task;
  epsilon: number;
  iqc: Poly | null;
  modes: CompiledMode[];
  jumps: CompiledJump[];
  conditions: Condition[];
  warnings: string[];
}

export interface SpecError { where: string; message: string; field?: string; }

// Names used by the generated code (or reserved by MATLAB) that variables can't use.
const RESERVED = new RegExp("^(" + [
  // Generated code (also with suffixes like B_1 and c_s_2)
  "(B|Bplus|dB|f|g|lam|clam|sig|csig|s|c_s|m|c_m|mB|cB)_\\d+", "z", "tau", "phi", "epsB", "prog",
  "opts", "ops", "sol", "constraints", "decvars",
  // MATLAB, SOSTOOLS, and YALMIP
  "i", "j", "pi", "eps", "ans", "inf", "Inf", "nan", "NaN", "end", "function", "if", "for", "while",
  "sym", "syms", "pvar", "sdpvar", "monomials", "sos", "diff", "subs", "jacobian", "polynomial",
].join("|") + ")$");

// ⋘──────── Compilation ────────⋙

const MAX_NUMBERED_VARIABLES = 50;

// Variable names from a list like "x1 x2" (separated by spaces, commas, or semicolons). A number n
// instead gives n names: prefix1, ..., prefixn.
export function variableNames(src: string, prefix: string): string[] {
  const trimmed = src.trim();
  if (/^\d+$/.test(trimmed)) {
    const count = Math.min(Number(trimmed), MAX_NUMBERED_VARIABLES);
    return Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`);
  }
  return trimmed.split(/[\s,;]+/).filter((s) => s !== "");
}

// DOM ids of the inputs on the page, so that errors and previews can be shown next to them.
export const GLOBAL_FIELD_IDS = {
  stateVars: "bs-state-vars", flowDistVars: "bs-flow-dist", jumpDistVars: "bs-jump-dist",
  params: "bs-params", epsilon: "bs-epsilon", iqc: "bs-iqc",
} as const;
export const modeFieldId = (qi: number, key: keyof ModeSpec) => `bs-mode-${qi}-${key}`;
export const jumpFieldId = (ji: number, key: keyof JumpSpec) => `bs-jump-${ji}-${key}`;

export interface CompileResult {
  compiled: Compiled | null;
  errors: SpecError[];
  previews: Map<string, string>;   // Field id -> LaTeX of what was parsed from it
}

export function compile(spec: ProblemSpec): CompileResult {
  const errors: SpecError[] = [];
  const warnings: string[] = [];
  const previews = new Map<string, string>();
  const attempt = <T>(where: string, field: string, fn: () => T): T | null => {
    try {
      return fn();
    } catch (e) {
      if (e instanceof ParseError) { errors.push({ where, field, message: e.message }); return null; }
      throw e;
    }
  };

  // Variables.
  const parseNames = (src: string, prefix: string, where: string, field: string): string[] => {
    if (/^\s*\d+\s*$/.test(src) && Number(src) > MAX_NUMBERED_VARIABLES) {
      errors.push({ where, field, message: `Use at most ${MAX_NUMBERED_VARIABLES} variables.` });
      return [];
    }
    const names = variableNames(src, prefix);
    for (const name of names) {
      if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(name)) {
        errors.push({ where, field, message: `"${name}" isn't a valid variable name. Use letters, digits, and underscores, starting with a letter.` });
      } else if (RESERVED.test(name)) {
        errors.push({ where, field, message: `"${name}" is reserved by the generated code. Please choose another name.` });
      }
    }
    return names;
  };
  const zNames = parseNames(spec.stateVars, "x", "State variables", GLOBAL_FIELD_IDS.stateVars);
  const wNames = parseNames(spec.flowDistVars, "w", "Flow disturbance variables", GLOBAL_FIELD_IDS.flowDistVars);
  const vNames = parseNames(spec.jumpDistVars, "v", "Jump disturbance variables", GLOBAL_FIELD_IDS.jumpDistVars);
  if (zNames.length === 0) errors.push({ where: "State variables", field: GLOBAL_FIELD_IDS.stateVars, message: "Enter at least one state variable." });
  const names = [...zNames, ...wNames, ...vNames];
  // Report each repeated name on the list where it repeats.
  const lists: [string[], string, string][] = [
    [zNames, "State variables", GLOBAL_FIELD_IDS.stateVars],
    [wNames, "Flow disturbance variables", GLOBAL_FIELD_IDS.flowDistVars],
    [vNames, "Jump disturbance variables", GLOBAL_FIELD_IDS.jumpDistVars],
  ];
  const seenNames = new Set<string>();
  const reported = new Set<string>();
  for (const [list, where, field] of lists) {
    for (const name of list) {
      if (seenNames.has(name) && !reported.has(name)) {
        reported.add(name);
        errors.push({ where, field, message: `"${name}" is declared more than once.` });
      }
      seenNames.add(name);
    }
  }
  if (errors.length > 0) return { compiled: null, errors, previews };

  const n = names.length;
  const z = zNames.map((_, i) => i);
  const w = wNames.map((_, i) => zNames.length + i);
  const v = vNames.map((_, i) => zNames.length + wNames.length + i);
  const varIndex = new Map(names.map((name, i) => [name, i]));
  const latexNames = names.map(nameToLatex);
  const tuple = (idx: number[]) => idx.length === 1 ? latexNames[idx[0]] : `(${idx.map((i) => latexNames[i]).join(", ")})`;
  const space = (idx: number[]) => `\\mathbb{R}^{${idx.length}}`;
  const tex = (p: Poly) => polyToLatex(p, latexNames);

  previews.set(GLOBAL_FIELD_IDS.stateVars, `z = ${tuple(z)} \\in ${space(z)}`);
  if (w.length) previews.set(GLOBAL_FIELD_IDS.flowDistVars, `${tuple(w) === "w" ? "" : "w = "}${tuple(w)} \\in ${space(w)}`);
  if (v.length) previews.set(GLOBAL_FIELD_IDS.jumpDistVars, `${tuple(v) === "v" ? "" : "v = "}${tuple(v)} \\in ${space(v)}`);

  // Parameters, which may use earlier parameters.
  const params = new Map<string, number>();
  const paramCtx: ParseContext = { n, varIndex, allowed: new Set(), params, latexNames };
  const paramLatex: string[] = [];
  spec.params.split("\n").forEach((line) => {
    line = line.replace(/[#%].*$/, "").trim();
    if (line === "") return;
    attempt("Parameters", GLOBAL_FIELD_IDS.params, () => {
      const m = /^([A-Za-z][A-Za-z0-9_]*)\s*=\s*(.+)$/.exec(line);
      if (!m) throw new ParseError(`Expected "name = value", got "${line}".`);
      if (varIndex.has(m[1])) throw new ParseError(`"${m[1]}" is already a variable.`);
      const value = parsePoly(m[2], paramCtx).constantValue();
      if (value === null) throw new ParseError(`The value of "${m[1]}" must be a constant.`);
      params.set(m[1], value);
      paramLatex.push(`${nameToLatex(m[1])} = ${formatNumber(value)}`);
    });
  });
  if (paramLatex.length) previews.set(GLOBAL_FIELD_IDS.params, paramLatex.join(",\\quad "));

  const ctx = (allowed: number[]): ParseContext =>
    ({ n, varIndex, params, latexNames, allowed: new Set(allowed.map((i) => names[i])) });
  const ctxZ = ctx(z), ctxZW = ctx([...z, ...w]), ctxZV = ctx([...z, ...v]);

  // Parses a set and records its preview.
  const set = (where: string, field: string, src: string, blank: "all" | "empty", name: string, vars: number[], c: ParseContext) => {
    const result = attempt(where, field, () => parseSet(src, c, blank));
    if (result && (vars.length > 0 || src.trim() !== "")) previews.set(field, `${name} = ${setToLatex(result, tuple(vars), space(vars))}`);
    return result ?? { pieces: [] };
  };
  // Parses one expression per state variable. A blank flow component is an error; a blank jump
  // component means that the variable doesn't change. Returns null if any component fails.
  const components = (entries: string[], kind: "flow" | "jump", c: ParseContext,
      where: (k: number) => string, field: (k: number) => string): Poly[] | null => {
    const result = z.map((zi, k) => attempt(where(k), field(k), () => {
      const src = (entries[k] ?? "").replace(/[#%].*$/, "").trim();
      if (src !== "") return parsePoly(src, c);
      if (kind === "jump") return Poly.variable(n, zi);
      throw new ParseError(`Enter ${zNames[k]}'. (Use 0 for a constant.)`);
    }));
    return result.every((p) => p !== null) ? result as Poly[] : null;
  };
  // Displays a map as one aligned line per component, like ẋ₁ = x₂.
  const mapPreview = (field: string, polys: Poly[], accent: (s: string) => string) => {
    previews.set(field, `\\begin{aligned} ${polys.map((p, k) => `${accent(latexNames[z[k]])} &= ${tex(p)}`).join(" \\\\ ")} \\end{aligned}`);
  };

  const epsilon = attempt("ε", GLOBAL_FIELD_IDS.epsilon, () => {
    const value = parsePoly(spec.epsilon, paramCtx).constantValue();
    if (value === null || value <= 0) throw new ParseError("ε must be a positive constant.");
    return value;
  }) ?? 1;

  const iqc = spec.iqc.trim() === "" ? null
    : attempt("Integral constraint", GLOBAL_FIELD_IDS.iqc, () => parsePoly(spec.iqc, ctxZW));
  if (iqc) previews.set(GLOBAL_FIELD_IDS.iqc, `\\int_0^T \\phi\\,dt \\ge 0, \\quad \\phi = ${tex(iqc)}`);

  if (spec.modes.length === 0) errors.push({ where: "Modes", message: "Add at least one mode." });

  // Modes.
  const modes: CompiledMode[] = spec.modes.map((m, qi) => {
    const q = qi + 1;
    const where = (label: string) => `${modeLabel(spec, qi)} › ${label}`;
    const id = (key: keyof ModeSpec) => modeFieldId(qi, key);
    const f = components(m.flowMap, "flow", ctxZW, (k) => where(`Flow map, ${zNames[k]}'`), (k) => componentFieldId(id("flowMap"), k));
    if (f) mapPreview(id("flowMap"), f, (s) => accentName(s, "\\dot"));
    const C = set(where("Flow set C"), id("flowSet"), m.flowSet, "all", `C_{${q}}`, z, ctxZ);
    // Without flow disturbance variables, the W box is hidden and ignored.
    const W = w.length === 0 ? WHOLE_SPACE
      : set(where("Disturbance set W"), id("flowDist"), m.flowDist, "all", `W_{${q}}`, w, ctx(w));
    const X0 = set(where("Initial set"), id("init"), m.init, "empty", `X_{0,${q}}`, z, ctxZ);
    const Xu = set(where("Unsafe set"), id("unsafe"), m.unsafe, "empty", `X_{u,${q}}`, z, ctxZ);

    let B: BarrierDef;
    if (spec.task === "synthesize") {
      if (!(m.barrierDegree >= 1)) errors.push({ where: where("Degree of B"), field: id("barrierDegree"), message: "The degree of B must be at least 1." });
      B = { kind: "unknown", degree: Math.max(1, Math.floor(m.barrierDegree)) };
    } else {
      const poly = attempt(where("Barrier B"), id("barrier"), () => parsePoly(m.barrier, ctxZ));
      if (poly) previews.set(id("barrier"), `B_{${q}}(z) = ${tex(poly)}`);
      B = { kind: "given", poly: poly ?? new Poly(n) };
    }

    let lambda: CompiledMode["lambda"];
    if (iqc) {
      lambda = { kind: "fixed", poly: new Poly(n) };
    } else if (spec.task === "synthesize") {
      const src = m.lambda.trim() === "" ? "0" : m.lambda;
      const poly = attempt(where("λ"), id("lambda"), () => parsePoly(src, ctxZ));
      if (poly && !poly.isZero()) previews.set(id("lambda"), `\\lambda_{${q}}(z) = ${tex(poly)}`);
      lambda = { kind: "fixed", poly: poly ?? new Poly(n) };
    } else {
      lambda = { kind: "free", degree: Math.max(0, Math.floor(m.lambdaDegree || 0)) };
    }

    const wUsed = new Set<number>();
    for (const p of [...(f ?? []), ...pieceConstraints(W), ...(iqc ? [iqc] : [])]) {
      for (const i of p.variablesUsed()) if (w.includes(i)) wUsed.add(i);
    }
    if (W.pieces.length === 0) warnings.push(`${modeLabel(spec, qi)}: the disturbance set W is empty, so no flows are checked.`);
    return { name: m.name, B, f: f ?? [], C, W, X0, Xu, lambda, wVars: w.filter((i) => wUsed.has(i)) };
  });

  // Jumps.
  const jumps: CompiledJump[] = spec.jumps.map((jp, ji) => {
    const j = ji + 1;
    const where = (label: string) => `Jump ${j} › ${label}`;
    const id = (key: keyof JumpSpec) => jumpFieldId(ji, key);
    if (!(jp.from >= 0 && jp.from < modes.length && jp.to >= 0 && jp.to < modes.length)) {
      errors.push({ where: where("Modes"), field: id("from"), message: "Choose the modes that this jump goes from and to." });
    }
    const D = set(where("Jump set D"), id("jumpSet"), jp.jumpSet, "all", `D_{${j}}`, z, ctxZ);
    const g = components(jp.jumpMap, "jump", ctxZV, (k) => where(`Jump map, ${zNames[k]}+`), (k) => componentFieldId(id("jumpMap"), k));
    if (g) mapPreview(id("jumpMap"), g, (s) => accentName(s, "+"));
    const V = v.length === 0 ? WHOLE_SPACE
      : set(where("Disturbance set V"), id("jumpDist"), jp.jumpDist, "all", `V_{${j}}`, v, ctx(v));

    let sigma: CompiledJump["sigma"];
    if (iqc) {
      sigma = { kind: "fixed", value: 1 };
    } else if (spec.task === "synthesize") {
      const src = jp.sigma.trim() === "" ? "0" : jp.sigma;
      const value = attempt(where("σ"), id("sigma"), () => {
        const c = parsePoly(src, paramCtx).constantValue();
        if (c === null || c < 0) throw new ParseError("σ must be a nonnegative constant when synthesizing B.");
        return c;
      });
      sigma = { kind: "fixed", value: value ?? 0 };
    } else {
      sigma = { kind: "free", degree: evenFloor(Math.max(0, Math.floor(jp.sigmaDegree || 0))) };
    }

    const vUsed = new Set<number>();
    for (const p of [...(g ?? []), ...pieceConstraints(V)]) {
      for (const i of p.variablesUsed()) if (v.includes(i)) vUsed.add(i);
    }
    return { from: jp.from, to: jp.to, D, g: g ?? [], V, sigma, vVars: v.filter((i) => vUsed.has(i)) };
  });

  if (errors.length > 0) return { compiled: null, errors, previews };

  if (modes.every((m) => m.Xu.pieces.length === 0)) {
    warnings.push("No unsafe set is given, so any B ≤ 0 (such as B = −1) works.");
  }
  if (modes.every((m) => m.X0.pieces.length === 0)) {
    warnings.push("No initial set is given, so there are no solutions to check.");
  }
  if (iqc && spec.task === "synthesize" && (spec.modes.some((m) => m.lambda.trim() !== "" && m.lambda.trim() !== "0")
      || spec.jumps.some((j) => j.sigma.trim() !== "" && j.sigma.trim() !== "1"))) {
    warnings.push("With an integral constraint, λ = 0 and σ = 1 are used regardless of the values entered.");
  }

  const compiled: Compiled = {
    names, latexNames, z, w, v, task: spec.task, epsilon, iqc, modes, jumps, conditions: [], warnings,
  };
  compiled.conditions = buildConditions(compiled, Math.max(0, Math.floor(spec.extraDegree || 0)));
  return { compiled, errors, previews };
}

// Puts an accent on a variable's LaTeX name, keeping any subscript outside of it:
// ("x_{1}", "\dot") -> "\dot{x}_{1}" and ("x_{1}", "+") -> "x^{+}_{1}".
export function accentName(latex: string, accent: "\\dot" | "+"): string {
  const m = /^(.*?)(_\{.*\})?$/.exec(latex)!;
  return accent === "+" ? `${m[1]}^{+}${m[2] ?? ""}` : `\\dot{${m[1]}}${m[2] ?? ""}`;
}

export function modeLabel(spec: ProblemSpec, qi: number): string {
  const name = spec.modes[qi]?.name.trim();
  return name ? `Mode ${qi + 1} (${name})` : `Mode ${qi + 1}`;
}

export const componentFieldId = (mapFieldId: string, k: number) => `${mapFieldId}-${k}`;

// Converts a map written in the old one-textarea format ("x1' = x2" lines, or bare expressions
// in state order) to one entry per state variable, so that saved forms still load.
export function legacyMapToComponents(src: string, zNames: string[]): string[] {
  const result: string[] = zNames.map(() => "");
  let next = 0;
  for (const line of src.split("\n").map((l) => l.trim()).filter((l) => l !== "")) {
    const m = /^([A-Za-z][A-Za-z0-9_]*)\s*(?:'|\+|_dot|_plus|⁺)?\s*=\s*(.+)$/.exec(line);
    const k = m && zNames.includes(m[1]) ? zNames.indexOf(m[1]) : next;
    if (k < result.length) result[k] = m && zNames.includes(m[1]) ? m[2] : line;
    next = k + 1;
  }
  return result;
}

function pieceConstraints(set: SemiSet): Poly[] {
  return set.pieces.flatMap((p) => [...p.ineqs, ...p.eqs]);
}

function evenFloor(k: number): number { return k - (k % 2); }
function evenCeil(k: number): number { return k + (k % 2); }

// ⋘──────── SOS conditions ────────⋙

export function barrierDegree(B: BarrierDef, z: number[]): number {
  return B.kind === "unknown" ? B.degree : Math.max(0, B.poly.degree(z));
}

// ⟨∇B, f⟩ for a known B.
export function lieDerivative(B: Poly, f: Poly[], z: number[]): Poly {
  return z.reduce((acc, zi, k) => acc.add(B.diff(zi).mul(f[k])), new Poly(B.n));
}

function buildConditions(cp: Compiled, extraDegree: number): Condition[] {
  const conditions: Condition[] = [];
  let sosCount = 0, freeCount = 0;

  // Adds a condition whose fixed terms have degree `baseDegree`, with multipliers for each
  // constraint of the given pieces.
  const add = (base: Omit<Condition, "degree" | "multipliers">, baseDegree: number, pieces: SemiSetPiece[]) => {
    const constraints = pieces.flatMap((p) => [...p.ineqs, ...p.eqs]);
    const maxDeg = Math.max(baseDegree, ...constraints.map((c) => c.degree(base.vars)), 0);
    const degree = evenCeil(maxDeg) + 2 * extraDegree;
    const multipliers: Multiplier[] = [];
    for (const p of pieces) {
      for (const g of p.ineqs) {
        multipliers.push({ name: `s_${++sosCount}`, kind: "sos", degree: evenFloor(Math.max(0, degree - g.degree(base.vars))), constraint: g });
      }
      for (const h of p.eqs) {
        multipliers.push({ name: `m_${++freeCount}`, kind: "free", degree: Math.max(0, degree - h.degree(base.vars)), constraint: h });
      }
    }
    conditions.push({ ...base, degree, multipliers });
  };

  const pieceLabel = (set: SemiSet, k: number, setName: string) =>
    set.pieces.length > 1 ? `piece ${k + 1} of ${setName}` : "";
  const joinLabels = (...labels: string[]) => {
    const nonEmpty = labels.filter((l) => l !== "");
    return nonEmpty.length ? ` (${nonEmpty.join(", ")})` : "";
  };

  cp.modes.forEach((mode, q) => {
    const degB = barrierDegree(mode.B, cp.z);

    mode.X0.pieces.forEach((piece, k) => add(
      { kind: "init", mode: q, jump: -1, piece: joinLabels(pieceLabel(mode.X0, k, "X0")), vars: cp.z },
      degB, [piece]));

    mode.Xu.pieces.forEach((piece, k) => add(
      { kind: "unsafe", mode: q, jump: -1, piece: joinLabels(pieceLabel(mode.Xu, k, "Xu")), vars: cp.z },
      degB, [piece]));

    // Degree of ⟨∇B, f⟩ + λ B + τ φ.
    const vars = [...cp.z, ...mode.wVars];
    let flowDeg: number;
    if (mode.B.kind === "given") {
      flowDeg = lieDerivative(mode.B.poly, mode.f, cp.z).degree(vars);
    } else {
      flowDeg = Math.max(...mode.f.map((fi) => fi.isZero() ? -1 : degB - 1 + fi.degree(vars)));
    }
    const lambdaDeg = mode.lambda.kind === "free" ? mode.lambda.degree
      : mode.lambda.poly.isZero() ? -Infinity : mode.lambda.poly.degree(cp.z);
    flowDeg = Math.max(flowDeg, lambdaDeg + degB, cp.iqc ? cp.iqc.degree(vars) : -1);
    mode.C.pieces.forEach((cPiece, i) => mode.W.pieces.forEach((wPiece, k) => add(
      { kind: "flow", mode: q, jump: -1, piece: joinLabels(pieceLabel(mode.C, i, "C"), pieceLabel(mode.W, k, "W")), vars },
      flowDeg, [cPiece, wPiece])));
  });

  cp.jumps.forEach((jump, j) => {
    const vars = [...cp.z, ...jump.vVars];
    const from = cp.modes[jump.from], to = cp.modes[jump.to];
    let jumpDeg: number;
    if (to.B.kind === "given") {
      jumpDeg = to.B.poly.compose(jump.g).degree(vars);
    } else {
      jumpDeg = to.B.degree * Math.max(0, ...jump.g.map((gi) => gi.degree(vars)));
    }
    const sigmaDeg = jump.sigma.kind === "free" ? jump.sigma.degree : jump.sigma.value === 0 ? -Infinity : 0;
    jumpDeg = Math.max(jumpDeg, sigmaDeg + barrierDegree(from.B, cp.z));
    jump.D.pieces.forEach((dPiece, i) => jump.V.pieces.forEach((vPiece, k) => add(
      { kind: "jump", mode: jump.from, jump: j, piece: joinLabels(pieceLabel(jump.D, i, "D"), pieceLabel(jump.V, k, "V")), vars },
      jumpDeg, [dPiece, vPiece])));
  });

  return conditions;
}

type SemiSetPiece = SemiSet["pieces"][number];
