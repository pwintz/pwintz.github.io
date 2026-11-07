// ╭───────────────────────────────────────────────────────────────╮
// │                       Example problems                        │
// ╰───────────────────────────────────────────────────────────────╯
// Examples 1 and 2 are from Prajna and Jadbabaie (HSCC 2004), rewritten as hybrid inclusions.

import { JumpSpec, ModeSpec, ProblemSpec } from "./problem";

export function blankMode(name = ""): ModeSpec {
  return {
    name, flowMap: [], flowSet: "", flowDist: "", init: "", unsafe: "",
    barrierDegree: 2, barrier: "", lambda: "0", lambdaDegree: 2,
  };
}

export function blankJump(from = 0, to = 0): JumpSpec {
  return { from, to, jumpSet: "", jumpMap: [], jumpDist: "", sigma: "1", sigmaDegree: 0 };
}

export interface Preset { id: string; title: string; description: string; spec: ProblemSpec; }

export const PRESETS: Preset[] = [
  {
    id: "bouncing-ball",
    title: "Bouncing ball",
    description: "A ball dropped from at most 1 m with speed at most 1 m/s never reaches 2 m. One mode; the jump map is the impact.",
    spec: {
      stateVars: "x1 x2",
      flowDistVars: "",
      jumpDistVars: "",
      params: "gamma = 9.81  # Gravity\nr = 0.8       # Coefficient of restitution",
      task: "synthesize",
      epsilon: "0.1",
      extraDegree: 0,
      iqc: "",
      modes: [{
        ...blankMode(),
        flowMap: ["x2", "-gamma"],
        flowSet: "x1 >= 0",
        init: "0 <= x1 <= 1\nx2^2 <= 1",
        unsafe: "x1 >= 2",
        barrierDegree: 2,
        barrier: "gamma*x1 + x2^2/2 - 11",
        lambdaDegree: 0,
      }],
      jumps: [{
        ...blankJump(0, 0),
        jumpSet: "x1 = 0\nx2 <= 0",
        jumpMap: ["", "-r*x2"],
        sigma: "1",
      }],
    },
  },
  {
    id: "prajna-1",
    title: "Prajna & Jadbabaie, Example 1",
    description: "A nonlinear ODE with an uncertain constant parameter p ∈ [0.9, 1.1]. The parameter becomes a state with ṗ = 0, and its range goes into C and X0.",
    spec: {
      stateVars: "x1 x2 p",
      flowDistVars: "",
      jumpDistVars: "",
      params: "",
      task: "synthesize",
      epsilon: "0.1",
      extraDegree: 0,
      iqc: "",
      modes: [{
        ...blankMode(),
        flowMap: ["x2", "-x1 + p/3*x1^3 - x2", "0"],
        flowSet: "0.9 <= p <= 1.1",
        init: "(x1 - 1.5)^2 + x2^2 <= 0.25\n0.9 <= p <= 1.1",
        unsafe: "(x1 + 1)^2 + (x2 + 1)^2 <= 0.16\n0.9 <= p <= 1.1",
        barrierDegree: 4,
      }],
      jumps: [],
    },
  },
  {
    id: "prajna-2",
    title: "Prajna & Jadbabaie, Example 2",
    description: "Two modes (no control and control) with a disturbance w on the flows. The unsafe set |x1| ≥ 5 is a union of two pieces.",
    spec: {
      stateVars: "x1 x2 x3",
      flowDistVars: "w",
      jumpDistVars: "",
      params: "",
      task: "synthesize",
      epsilon: "0.1",
      extraDegree: 0,
      iqc: "",
      modes: [
        {
          ...blankMode("no control"),
          flowMap: ["x2", "-x1 + x3", "x1 + (2*x2 + 3*x3)*(1 + x3^2) + w"],
          flowSet: "x1^2 + 0.01*x2^2 + 0.01*x3^2 <= 1.01",
          flowDist: "-1 <= w <= 1",
          init: "x1^2 + x2^2 + x3^2 <= 0.01",
          unsafe: "",
          barrierDegree: 4,
        },
        {
          ...blankMode("control"),
          flowMap: ["x2", "-x1 + x3", "-x1 - 2*x2 - 3*x3 + w"],
          flowSet: "x1^2 + x2^2 + x3^2 >= 0.03\nx1^2 <= 5.1^2",
          flowDist: "-1 <= w <= 1",
          init: "",
          unsafe: "5 <= x1 <= 5.1\nor\n-5.1 <= x1 <= -5",
          barrierDegree: 4,
        },
      ],
      jumps: [
        { ...blankJump(0, 1), jumpSet: "0.99 <= x1^2 + 0.01*x2^2 + 0.01*x3^2 <= 1.01", sigma: "1" },
        { ...blankJump(1, 0), jumpSet: "0.03 <= x1^2 + x2^2 + x3^2 <= 0.05", sigma: "1" },
      ],
    },
  },
];
