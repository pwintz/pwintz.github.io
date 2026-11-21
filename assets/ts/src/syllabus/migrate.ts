// ╭───────────────────────────────────────────────────────────────╮
// │      Syllabus designer: answers saved by older versions       │
// ╰───────────────────────────────────────────────────────────────╯
// Questions change shape between versions of the page. `migrate` updates saved answers (in the
// browser or in a saved answers file) to the current questions, so that no decision is lost.

import { State } from "./generate";

export function migrate(s: State): State {
  // IDs, help during exams, and announcing the time were options of the proctoring question;
  // each is now its own question.
  const proctoring = s.multi.proctoring;
  if (proctoring) {
    if (proctoring.includes("ids")) s.choice.examIds ??= "during";
    if (proctoring.includes("questions")) s.choice.examHelp ??= "clarify";
    if (proctoring.includes("time")) s.choice.examEnd ??= "seated";
    const rest = proctoring.filter(x => x !== "ids" && x !== "questions" && x !== "time");
    if (rest.length) s.multi.proctoring = rest;
    else delete s.multi.proctoring;
  }

  // "Notes, slides, and readings" became two uses of the course website.
  const uses = s.multi.lmsUses;
  if (uses?.includes("materials")) s.multi.lmsUses = [...new Set(uses.flatMap(u => (u === "materials" ? ["notes", "readings"] : [u])))];

  // "Graded for completion only" was an answer to who grades section quizzes; it is now an answer
  // to how they are graded.
  if (s.choice.sectionQuizGrading === "completion") {
    s.choice.sectionQuizStakes ??= "completion";
    delete s.choice.sectionQuizGrading;
  }

  // Accommodated exams "at the same time or earlier" and "or later" became a range of start times.
  if (s.choice.accommodationTiming === "early" || s.choice.accommodationTiming === "late") {
    s.field["accom.window"] ??= s.choice.accommodationTiming === "early" ? "earlier in the day up to the start of the main exam" : "the start of the main exam until later the same day";
    s.choice.accommodationTiming = "window";
  }

  // Lecture attendance was one choice for each role (required, encouraged, or not required), or
  // one choice for every role before that; it is now the list of roles that are required.
  const old = Object.keys(s.choice).filter(k => k === "teamLecture" || k.startsWith("teamLecture."));
  if (old.length) {
    const team = (s.multi.teamRoles ?? []).filter(r => r === "ta" || r === "tutor" || r === "reader");
    const choiceFor = (role: string) => s.choice[`teamLecture.${role}`] || s.choice.teamLecture;
    const answered = team.filter(r => choiceFor(r));
    if (!s.multi.teamLecture && answered.length) {
      const required = answered.filter(r => choiceFor(r) === "required");
      s.multi.teamLecture = required.length ? required : ["none"];
    }
    for (const k of old) delete s.choice[k];
  }
  return s;
}
