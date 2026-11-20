import { test } from "node:test";
import assert from "node:assert/strict";
import { assertClose } from "./helpers";
import { HANON_EXERCISES } from "../src/data/hanon_data";
import {
  ARTICULATIONS, Articulation, Key, MODES, Mode, RHYTHMS, ROOTS, Rhythm, STEP_MIDDLE_C, articulationIn,
  asciiKeyLabel, buildPerformance, chooseClef, fingeringAbove, isAvailable, keyLabel, keySignatureSpec,
  ledgerLines, makeTransposer, midiOf, modeFormula, parseHand, prettyTonic, signatureKey, signatureSize,
  styleMeasures, toMeasures, visibleMeasures,
} from "../src/hanon/music";

const MODE_NAMES = Object.keys(MODES) as Mode[];
const ALL_KEYS: Key[] = ROOTS.flatMap(tonic => MODE_NAMES.map(mode => ({ tonic, mode })));
const AVAILABLE = ALL_KEYS.filter(isAvailable);
const label = (k: Key) => `${k.tonic} ${k.mode}`;

test("signatureKey finds the parent major key", () => {
  const sig = (tonic: string, mode: Mode) => signatureKey({ tonic, mode });
  assert.equal(sig("C", "major"), "C");
  assert.equal(sig("D", "dorian"), "C");
  assert.equal(sig("A", "natural-minor"), "C");
  assert.equal(sig("E", "harmonic-minor"), "G");
  assert.equal(sig("Bb", "major"), "Bb");
  assert.equal(sig("Db", "dorian"), "Cb");
  assert.equal(sig("F#", "locrian"), "G");
  assert.equal(sig("G#", "major"), null, "would need 8 sharps");
  assert.equal(sig("Fb", "major"), null);
});

test("signatureSize counts sharps or flats", () => {
  const size = (tonic: string, mode: Mode = "major") => signatureSize({ tonic, mode });
  assert.equal(size("C"), 0);
  assert.equal(size("F#"), 6);
  assert.equal(size("C#"), 7);
  assert.equal(size("Bb"), 2);
  assert.equal(size("Cb"), 7);
  assert.equal(size("G#"), Infinity);
});

test("most keys are available, and every mode has some", () => {
  assert.ok(AVAILABLE.length > ALL_KEYS.length / 2);
  for (const mode of MODE_NAMES) assert.ok(AVAILABLE.some(k => k.mode === mode), mode);
});

test("labels", () => {
  assert.equal(prettyTonic("Bb"), "B♭");
  assert.equal(prettyTonic("F#"), "F♯");
  assert.equal(prettyTonic("B"), "B");
  assert.equal(keyLabel({ tonic: "Eb", mode: "harmonic-minor" }), "E♭ harmonic minor");
  assert.equal(asciiKeyLabel({ tonic: "C#", mode: "major" }), "C-sharp major");
  assert.equal(asciiKeyLabel({ tonic: "Bb", mode: "dorian" }), "B-flat Dorian");
  assert.equal(asciiKeyLabel({ tonic: "B", mode: "major" }), "B major");
  assert.equal(modeFormula(MODES.dorian.scale), "1 2 ♭3 4 5 6 ♭7");
  assert.equal(modeFormula(MODES["lydian-augmented"].scale), "1 2 3 ♯4 ♯5 6 7");
  assert.equal(modeFormula(MODES.major.scale), "1 2 3 4 5 6 7");
  assert.equal(keySignatureSpec({ tonic: "D", mode: "dorian" }), "C");
  assert.throws(() => keySignatureSpec({ tonic: "G#", mode: "major" }), /G♯ major has no standard key signature/);
});

test("transposition keeps every scale degree's pitch and spells it with its own letter", () => {
  for (const key of AVAILABLE) {
    const t = makeTransposer(key);
    const scale = MODES[key.mode].scale;
    const tonicMidi = midiOf(t.vexKey(STEP_MIDDLE_C));
    const letters = new Set<string>();
    for (let degree = 0; degree < 7; degree++) {
      const vex = t.vexKey(STEP_MIDDLE_C + degree);
      assert.equal(midiOf(vex) - tonicMidi, scale[degree], `${label(key)} degree ${degree + 1}: ${vex}`);
      letters.add(vex[0]);
    }
    assert.equal(letters.size, 7, `${label(key)} uses each letter once`);
    assert.equal(midiOf(t.vexKey(STEP_MIDDLE_C + 7)) - tonicMidi, 12, `${label(key)} octave`);
    assert.equal(t.vexKey(STEP_MIDDLE_C)[0], key.tonic[0].toLowerCase());
  }
});

test("the tonic stays within a fourth of C4 by letter (G♭3 to F♯4)", () => {
  for (const key of AVAILABLE) {
    const midi = midiOf(makeTransposer(key).vexKey(STEP_MIDDLE_C));
    assert.ok(midi >= 54 && midi <= 66, `${label(key)}: ${midi}`);
  }
  assert.equal(makeTransposer({ tonic: "G", mode: "major" }).vexKey(STEP_MIDDLE_C), "g/3");
  assert.equal(makeTransposer({ tonic: "F", mode: "major" }).vexKey(STEP_MIDDLE_C), "f/4");
});

test("examples of spelled notes", () => {
  const eb = makeTransposer({ tonic: "Eb", mode: "major" });
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6].map(d => eb.vexKey(STEP_MIDDLE_C + d)), ["eb/4", "f/4", "g/4", "ab/4", "bb/4", "c/5", "d/5"]);
  // G♯ harmonic minor needs a double sharp on its seventh degree.
  const gs = makeTransposer({ tonic: "G#", mode: "harmonic-minor" });
  assert.equal(gs.vexKey(STEP_MIDDLE_C + 6), "f##/4");
  // Melodic minor descends with the natural minor's sixth and seventh.
  const mm = makeTransposer({ tonic: "A", mode: "melodic-minor" });
  assert.equal(mm.vexKey(STEP_MIDDLE_C), "a/3");
  assert.equal(mm.vexKey(STEP_MIDDLE_C + 6), "g#/4");
  assert.equal(mm.vexKey(STEP_MIDDLE_C + 6, true), "g/4");
  assert.equal(makeTransposer({ tonic: "A", mode: "dorian" }).vexKey(STEP_MIDDLE_C + 6, true), "g/4", "modes without a descending form");
  // Steps below octave 0 still work.
  assert.equal(makeTransposer({ tonic: "C", mode: "major" }).vexKey(-1), "b/-1");
});

test("no available key needs a triple accidental", () => {
  for (const key of AVAILABLE) {
    const t = makeTransposer(key);
    for (let step = 0; step < 70; step++) {
      for (const descending of [false, true]) assert.match(t.vexKey(step, descending), /^[a-g](#{1,2}|b{1,2})?\/-?\d+$/, label(key));
    }
  }
});

test("midiOf", () => {
  assert.equal(midiOf("c/4"), 60);
  assert.equal(midiOf("a/4"), 69);
  assert.equal(midiOf("eb/4"), 63);
  assert.equal(midiOf("b#/3"), 60);
  assert.equal(midiOf("cbb/4"), 58);
  assert.equal(midiOf("f##/4"), 67);
  assert.equal(midiOf("c/-1"), 0);
  for (const bad of ["h/4", "c4", "c###/4", "C/4", "c/"]) assert.throws(() => midiOf(bad), /Bad key/, bad);
});

test("parseHand", () => {
  assert.deepEqual(parseHand(" C4/1 | E3+C4/5\nC3:2 "), [
    { steps: [28], fingers: ["1"], duration: "16" },
    { steps: [23, 28], fingers: [null, "5"], duration: "16" },
    { steps: [21], fingers: [null], duration: "2" },
  ]);
  assert.deepEqual(parseHand(""), []);
  for (const bad of ["H4", "C", "C4/", "c4", "C4+"]) assert.throws(() => parseHand(bad), /Bad note token/, bad);
});

test("toMeasures splits into 2/4 measures", () => {
  const sixteenths = parseHand("C4 D4 E4 F4 G4 A4 B4 C5 C4:2");
  const measures = toMeasures(sixteenths);
  assert.deepEqual(measures.map(m => m.length), [8, 1]);
  // An incomplete last measure is dropped.
  assert.equal(toMeasures(parseHand("C4 D4 E4")).length, 0);
});

test("every exercise parses into whole measures, the same number for both hands", () => {
  assert.equal(HANON_EXERCISES.length, 20);
  for (const ex of HANON_EXERCISES) {
    const right = toMeasures(parseHand(ex.rightHand)), left = toMeasures(parseHand(ex.leftHand));
    const count = (hand: string) => parseHand(hand).reduce((sum, e) => sum + (e.duration === "2" ? 8 : 1), 0);
    assert.equal(count(ex.rightHand) % 8, 0, `exercise ${ex.number} right hand`);
    assert.equal(count(ex.leftHand) % 8, 0, `exercise ${ex.number} left hand`);
    assert.equal(right.length, left.length, `exercise ${ex.number}`);
    assert.ok(ex.turn > 0 && ex.turn < right.length, `exercise ${ex.number} turn`);
  }
});

const RHYTHM_NAMES = Object.keys(RHYTHMS) as Rhythm[];
const ARTICULATION_NAMES = Object.keys(ARTICULATIONS) as Articulation[];

test("every rhythm fills each beat with four sixteenths' worth", () => {
  for (const rhythm of RHYTHM_NAMES) {
    assertClose(RHYTHMS[rhythm].beat.reduce((sum, n) => sum + n.length, 0), 4, 1e-12, rhythm);
    const triplets = RHYTHMS[rhythm].beat.filter(n => n.triplet).length;
    assert.ok(triplets === 0 || triplets === 3, `${rhythm} triplets come in threes`);
  }
});

test("every articulation marks eight notes with balanced slurs, in every rhythm", () => {
  for (const articulation of ARTICULATION_NAMES) {
    for (const rhythm of RHYTHM_NAMES) {
      const { marks } = articulationIn(articulation, rhythm);
      assert.match(marks, /^[ .()-]{8}$/, `${articulation} in ${rhythm}`);
      let open = false;
      for (const mark of marks) {
        if (mark === "(") { assert.ok(!open); open = true; }
        else if (mark === ")") { assert.ok(open); open = false; }
        else if (mark === "-") assert.ok(open, `${articulation}: "-" inside a slur`);
      }
      assert.ok(!open, `${articulation} in ${rhythm}: slur closed`);
    }
  }
  assert.equal(articulationIn("slurred-staccato", "triplet-long").marks, "(-).(-).");
  assert.equal(articulationIn("slurred-staccato", "even").marks, "()..()..");
});

test("styleMeasures applies the rhythm and marks", () => {
  const measures = toMeasures(parseHand("C4 D4 E4 F4 G4 A4 B4 C5 C4:2"));
  const styled = styleMeasures(measures, "long-short", "staccato-legato");
  assert.deepEqual(styled[0].map(e => e.length), [1.5, 0.5, 1.5, 0.5, 1.5, 0.5, 1.5, 0.5]);
  assert.deepEqual(styled[0].map(e => e.staccato), [true, true, true, true, false, false, false, false]);
  assert.deepEqual(styled[0].map(e => e.slur), [null, null, null, null, "start", null, null, "end"]);
  // The final half note keeps its value.
  assert.deepEqual([styled[1][0].length, styled[1][0].beatNote, styled[1][0].staccato], [8, null, false]);
});

test("buildPerformance lasts the whole exercise in every rhythm, without drifting", () => {
  const ex = HANON_EXERCISES[0];
  const measures = toMeasures(parseHand(ex.rightHand)).length;
  for (const rhythm of RHYTHM_NAMES) {
    const p = buildPerformance(ex, { tonic: "C", mode: "major" }, rhythm, "legato");
    assertClose(p.length, measures * 8, 1e-9, rhythm);
    assert.equal(p.events.length, parseHand(ex.rightHand).length);
    // Each measure's first event starts exactly on its downbeat.
    for (const e of p.events) if (e.event === 0) assert.equal(e.start, e.measure * 8);
    for (let i = 1; i < p.events.length; i++) assert.ok(p.events[i].start > p.events[i - 1].start);
  }
});

test("buildPerformance shortens staccato notes and descends after the turn", () => {
  const ex = HANON_EXERCISES[0];
  const p = buildPerformance(ex, { tonic: "A", mode: "melodic-minor" }, "even", "staccato");
  assertClose(p.notes[0].duration, 0.4);
  const half = p.notes.filter(n => n.duration === 8);
  assert.ok(half.length > 0, "the final half notes aren't shortened");
  // G♯ only in the ascending half; G only in the descending half.
  const pitchClasses = (from: number, to: number) => new Set(p.notes.filter(n => n.start >= from && n.start < to).map(n => n.midi % 12));
  assert.ok(pitchClasses(0, ex.turn * 8).has(8) && !pitchClasses(0, ex.turn * 8).has(7));
  assert.ok(pitchClasses(ex.turn * 8, Infinity).has(7) && !pitchClasses(ex.turn * 8, Infinity).has(8));
});

test("ledger lines and clefs", () => {
  const C4 = STEP_MIDDLE_C;
  assert.equal(ledgerLines(C4, "treble"), 1);
  assert.equal(ledgerLines(C4, "bass"), 1);
  assert.equal(ledgerLines(C4 + 4, "treble"), 0);
  assert.equal(ledgerLines(C4 + 12, "treble"), 1, "A5");
  assert.equal(ledgerLines(C4 - 14, "bass"), 2, "C2");
  const t = makeTransposer({ tonic: "C", mode: "major" });
  const low = toMeasures(parseHand("C2 D2 E2 F2 G2 A2 B2 C3"));
  const high = toMeasures(parseHand("C5 D5 E5 F5 G5 A5 B5 C6"));
  assert.equal(chooseClef(low, t, true), "bass", "the right hand moves to the bass clef when low");
  assert.equal(chooseClef(high, t, false), "treble");
  assert.equal(chooseClef(toMeasures(parseHand("C4 C4 C4 C4 C4 C4 C4 C4")), t, false), "bass", "ties keep the usual clef");
  assert.equal(fingeringAbove(C4 + 20, "treble", false), true);
  assert.equal(fingeringAbove(C4 - 20, "treble", true), false);
  assert.equal(fingeringAbove(C4 + 4, "treble", true), true);
  assert.equal(fingeringAbove(C4 + 4, "treble", false), false);
});

test("visibleMeasures", () => {
  const ex = { ...HANON_EXERCISES[0], turn: 14 };
  assert.deepEqual(visibleMeasures(ex, 30, false).length, 30);
  assert.deepEqual(visibleMeasures(ex, 30, true), [0, 1, 13, 14, 28, 29]);
  assert.deepEqual(visibleMeasures({ ...ex, turn: 2 }, 4, true), [0, 1, 2, 3]);
  assert.deepEqual(visibleMeasures({ ...ex, turn: 1 }, 2, true), [0, 1]);
});
