import { test } from "node:test";
import assert from "node:assert/strict";
import { assertClose } from "./helpers";
import { TAYLOR_FUNCTIONS, evaluateAt, taylorCoefficients, taylorTex } from "../src/figures/taylor";

test("taylorCoefficients at 0 are the familiar series coefficients", () => {
  const sin = taylorCoefficients(TAYLOR_FUNCTIONS.sin, 0, 5);
  [0, 1, 0, -1 / 6, 0, 1 / 120].forEach((c, k) => assertClose(sin[k], c, 1e-12));
  const ln = taylorCoefficients(TAYLOR_FUNCTIONS.ln1p, 0, 4);
  [0, 1, -1 / 2, 1 / 3, -1 / 4].forEach((c, k) => assertClose(ln[k], c, 1e-12));
  const geo = taylorCoefficients(TAYLOR_FUNCTIONS.geometric, 0, 3);
  [1, 1, 1, 1].forEach((c, k) => assertClose(geo[k], c, 1e-12));
});

test("taylorCoefficients away from 0 match the derivatives there", () => {
  // e^x at a = 1: every coefficient is e / k!.
  const exp = taylorCoefficients(TAYLOR_FUNCTIONS.exp, 1, 3);
  [Math.E, Math.E, Math.E / 2, Math.E / 6].forEach((c, k) => assertClose(exp[k], c, 1e-12));
  // 1/(1 − x) at a = −1: 1/2, 1/4, 1/8, ….
  const geo = taylorCoefficients(TAYLOR_FUNCTIONS.geometric, -1, 3);
  [1 / 2, 1 / 4, 1 / 8, 1 / 16].forEach((c, k) => assertClose(geo[k], c, 1e-12));
});

test("evaluateAt approximates the function near the center", () => {
  const c = taylorCoefficients(TAYLOR_FUNCTIONS.cos, 0.5, 12);
  assertClose(evaluateAt(c, 0.5, 1.2), Math.cos(1.2), 1e-9);
  assert.equal(evaluateAt([1, 2, 3], 1, 3), 1 + 2 * 2 + 3 * 4);
});

test("taylorTex writes the polynomial exactly at 0 and shortens long ones", () => {
  assert.equal(taylorTex(TAYLOR_FUNCTIONS.sin, 0, 3), "x - \\frac{x^{3}}{3!}");
  assert.equal(taylorTex(TAYLOR_FUNCTIONS.cos, 0, 4), "1 - \\frac{x^{2}}{2!} + \\frac{x^{4}}{4!}");
  assert.equal(taylorTex(TAYLOR_FUNCTIONS.ln1p, 0, 2), "x - \\frac{x^{2}}{2}");
  assert.equal(taylorTex(TAYLOR_FUNCTIONS.sin, 0, 0), "0");
  assert.equal(taylorTex(TAYLOR_FUNCTIONS.geometric, 0, 9), "1 + x + x^{2} + \\cdots + x^{9}");
});

test("taylorTex uses decimals in powers of (x − a) away from 0", () => {
  assert.equal(taylorTex(TAYLOR_FUNCTIONS.geometric, -1, 1), "0.500 + 0.250\\,(x + 1.00)");
  assert.equal(taylorTex(TAYLOR_FUNCTIONS.exp, 1, 2), "2.718 + 2.718\\,(x - 1.00) + 1.359\\,(x - 1.00)^{2}");
});
