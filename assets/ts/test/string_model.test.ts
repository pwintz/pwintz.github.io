import { test } from "node:test";
import assert from "node:assert/strict";
import { assertClose } from "./helpers";
import {
  BowSettings, DEFAULT_FRICTION, STRINGS, fundamental, schellengMaxForce, slipFriction, waveSpeed,
} from "../src/bowed_string/string_model";

const bow: BowSettings = { force: 0.5, speed: 0.2, position: 0.1, ...DEFAULT_FRICTION };

test("each preset string has its standard pitch", () => {
  const expected: Record<string, number> = { G: 196, D: 293.66, A: 440, E: 659.26 };
  for (const s of STRINGS) {
    const letter = Object.keys(expected).find(k => s.name.startsWith(k));
    assert.ok(letter, `unrecognized string ${s.name}`);
    assertClose(fundamental(s), expected[letter!], 0.5);
    assertClose(waveSpeed(s), 2 * s.length * fundamental(s), 1e-9);
  }
});

test("slipFriction falls from static to dynamic friction", () => {
  assertClose(slipFriction(bow, 0), bow.muStatic);
  assertClose(slipFriction(bow, 1e9), bow.muDynamic, 1e-9);
  assert.equal(slipFriction(bow, -0.3), slipFriction(bow, 0.3));
  assertClose(slipFriction(bow, 0.1), (bow.muStatic + bow.muDynamic) / 2);
});

test("schellengMaxForce scales with speed and inversely with bow position", () => {
  const spec = STRINGS[0];
  const f = schellengMaxForce(spec, bow);
  assert.ok(f > 0);
  assertClose(schellengMaxForce(spec, { ...bow, speed: 2 * bow.speed }), 2 * f, 1e-9 * f);
  assertClose(schellengMaxForce(spec, bow, 2 * bow.position), f / 2, 1e-9 * f);
  // A finger halfway shortens the vibrating length, which doubles β.
  assertClose(schellengMaxForce({ ...spec, finger: 0.5 }, bow), f / 2, 1e-9 * f);
});
