// The steps of the step-by-step practice pages: the answers entered at the last support level (by
// hand), the transpose step, and the comparison with the plot.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSteps as projectionSteps } from "../src/projection/practice_page";
import { buildSteps as eigenSteps } from "../src/eigen/practice_page";
import { byHandNote } from "../src/common/step_practice";
import { KINDS as PROJ_KINDS, F, Problem, randomProblem as projectionProblem } from "../src/projection/practice_math";
import { KINDS as EIGEN_KINDS, randomProblem as eigenProblem } from "../src/eigen/eigen_math";

function rng(seed: number): () => number {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const v = (...xs: number[]) => xs.map(x => F(x));

test("projection practice: every problem has answers, and the student works some of them at partial support", () => {
  const r = rng(7);
  for (const kind of PROJ_KINDS) {
    for (let i = 0; i < 10; i++) {
      const steps = projectionSteps(projectionProblem(kind, r));
      const answers = steps.filter(s => s.final);
      assert.ok(answers.length > 0, kind);
      // At partial support (level 2), the student works the main answer (the page works Ax*).
      assert.ok(answers.some(s => (s.given ?? 1) < 2), kind);
      // Prerequisites come earlier.
      steps.forEach((s, k) => s.prereqs.forEach(p => assert.ok(p < k, `${kind}: step ${k + 1}`)));
    }
  }
});

test("projection practice: least squares starts with an optional Aᵀ step, and A^TA and A^Tb don't wait for it", () => {
  const p: Problem = { kind: "lsqres", cols: [v(4, 0, 1), v(0, 2, 1)], target: v(2, 0, 11) };
  const steps = projectionSteps(p);
  assert.match(steps[0].title, /transpose/);
  assert.equal(steps[0].given ?? 1, 1);         // The student writes Aᵀ at partial support.
  assert.deepEqual(steps[0].answer, ["4", "0", "1", "0", "2", "1"]);
  assert.equal(steps[1].given, 2);              // The page computes AᵀA at partial support,
  assert.deepEqual(steps[1].prereqs, []);       // without waiting for Aᵀ, which is optional.
  assert.ok(steps[0].optional);
  assert.deepEqual(steps[2].prereqs, []);
  // Ax* explains why it is the projection.
  assert.match(steps[4].worked, /Why/);
  assert.match(steps[4].worked, /orthogonal/);
});

test("projection practice: the last step compares the answer with the plot, when there is one", () => {
  const drawn: Problem = { kind: "projv", cols: [v(4, 2)], target: v(1, 3) };
  const steps = projectionSteps(drawn, true);
  const last = steps[steps.length - 1];
  assert.match(last.title, /plot/);
  assert.ok(last.final);
  assert.deepEqual(last.prereqs, [steps.length - 2]);
  assert.ok(last.check(["yes"]).ok);
  assert.ok(!last.check(["no"]).ok);
  assert.equal(last.autoCheck, "yes");          // Choosing Yes checks the step.
  // The step is hidden for now, unless asked for.
  assert.equal(projectionSteps(drawn).length, steps.length - 1);
  // A 3D picture gets no comparison step.
  const space: Problem = { kind: "projv", cols: [v(4, 2, 1)], target: v(1, 3, 2) };
  assert.ok(!projectionSteps(space, true).some(s => /plot/.test(s.title)));
  // A line fit is drawn in the plane, so it gets the step, even with three points.
  const fit: Problem = { kind: "fitline", cols: [v(1, 1, 1), v(0, 1, 2)], target: v(1, 2, 4), xs: v(0, 1, 2) };
  assert.match(projectionSteps(fit, true).at(-1)!.title, /plot/);
  // The first step of a line fit asks for both A and y.
  const design = projectionSteps(fit)[0];
  assert.deepEqual(design.answer, ["1", "0", "1", "1", "1", "2", "1", "2", "4"]);
  assert.ok(design.check(design.answer).ok);
  assert.deepEqual(design.check(["1", "0", "1", "1", "1", "2", "1", "2", "5"]).marks, [...Array(8).fill(true), false]);
  // With four rows, b is in ℝ⁴, so there is no picture.
  const tall: Problem = { kind: "lsqres", cols: [v(1, 1, 1, 1), v(0, 1, 2, 3)], target: v(1, 2, 2, 4) };
  assert.ok(!projectionSteps(tall, true).some(s => /plot/.test(s.title)));
});

test("eigenvalue practice: every problem has answers, and the routine calculations aren't answers", () => {
  const r = rng(11);
  for (const kind of EIGEN_KINDS) {
    for (let i = 0; i < 10; i++) {
      const steps = eigenSteps(eigenProblem(kind, r));
      assert.ok(steps.some(s => s.final), kind);
      for (const s of steps) assert.equal(s.final, (s.given ?? 1) < 2, `${kind}: ${s.title}`);
    }
  }
});

test("by-hand note: names the hidden steps", () => {
  const tail = " hidden until your answers are finished.";
  assert.ok(byHandNote([0, 1, 2]).endsWith(" Steps 1–3 are" + tail));
  assert.ok(byHandNote([1]).endsWith(" Step 2 is" + tail));
  assert.ok(byHandNote([0, 1]).endsWith(" Steps 1 and 2 are" + tail));
  assert.ok(byHandNote([0, 1, 2, 4]).endsWith(" Steps 1–3 and 5 are" + tail));
  assert.ok(byHandNote([0, 2, 4, 5, 6]).endsWith(" Steps 1, 3, and 5–7 are" + tail));
  assert.ok(!byHandNote([]).includes("hidden"));
});
