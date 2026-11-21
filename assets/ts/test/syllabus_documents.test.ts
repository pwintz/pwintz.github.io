import { test } from "node:test";
import assert from "node:assert/strict";
import { setDateStyle } from "../src/syllabus/dates";
import { State, generate } from "../src/syllabus/generate";
import { Block } from "../src/syllabus/markup";
import { migrate } from "../src/syllabus/migrate";
import { generatePlan } from "../src/syllabus/plan";
import { PRESETS } from "../src/syllabus/presets";
import { QUESTION_BY_ID } from "../src/syllabus/questions";
import { generateTeam } from "../src/syllabus/team";

const empty = (): State => ({ choice: {}, multi: {}, field: {}, weights: [], scale: [] });
const answers = (part: Partial<State>): State => ({ ...empty(), ...part });

// All of the text in a document, for searching.
function text(blocks: Block[]): string {
  return blocks.map(b => {
    switch (b.t) {
      case "ul": case "ol": return b.items.map(i => (typeof i === "string" ? i : i.text)).join("\n");
      case "kv": return b.rows.map(([k, v]) => `${k} ${text(v)}`).join("\n");
      case "table": return [b.head.join(" | "), ...b.rows.map(r => r.join(" | "))].join("\n");
      default: return b.text;
    }
  }).join("\n");
}

test("migrate splits the old proctoring options into their own questions", () => {
  const s = migrate(answers({ multi: { proctoring: ["allowed", "ids", "questions", "time", "incidents"] } }));
  assert.deepEqual(s.multi.proctoring, ["allowed", "incidents"]);
  assert.equal(s.choice.examIds, "during");
  assert.equal(s.choice.examHelp, "clarify");
  assert.equal(s.choice.examEnd, "seated");
  // Answers to the new questions are kept.
  const kept = migrate(answers({ choice: { examEnd: "rows" }, multi: { proctoring: ["time"] } }));
  assert.equal(kept.choice.examEnd, "rows");
  assert.equal(kept.multi.proctoring, undefined);
});

test("migrate turns per-role lecture attendance into the roles that are required", () => {
  const s = migrate(answers({ choice: { "teamLecture.ta": "encouraged", "teamLecture.tutor": "required", "teamLecture.reader": "required" }, multi: { teamRoles: ["ta", "tutor"] } }));
  assert.deepEqual(s.multi.teamLecture, ["tutor"]);
  assert.equal(Object.keys(s.choice).some(k => k.startsWith("teamLecture")), false);
  // One answer for every role, from before the choice was per role.
  assert.deepEqual(migrate(answers({ choice: { teamLecture: "notRequired" }, multi: { teamRoles: ["ta"] } })).multi.teamLecture, ["none"]);
  assert.deepEqual(migrate(answers({ choice: { teamLecture: "required" }, multi: { teamRoles: ["ta", "reader"] } })).multi.teamLecture, ["ta", "reader"]);
});

test("the examples use only current questions and options", () => {
  for (const [id, preset] of Object.entries(PRESETS)) {
    for (const [key, value] of Object.entries(preset.state.choice)) {
      const [q, role] = key.split(".");
      const question = QUESTION_BY_ID.get(q);
      assert.ok(question, `${id}: unknown question ${q}`);
      if (role) assert.ok(question.roles?.some(r => r.id === role), `${id}: unknown row ${key}`);
      else assert.notEqual(question.kind, "multi", `${id}: ${q} is a multi question`);
      assert.ok(question.options?.some(o => o.id === value), `${id}: unknown option ${key} = ${value}`);
    }
    for (const [q, values] of Object.entries(preset.state.multi)) {
      const question = QUESTION_BY_ID.get(q);
      assert.equal(question?.kind, "multi", `${id}: ${q} isn't a multi question`);
      for (const v of values) assert.ok(question.options?.some(o => o.id === v), `${id}: unknown option ${q} = ${v}`);
    }
  }
});

test("the exam questions write exam-day rules for students and proctors", () => {
  const s = answers({
    choice: { examSchedule: "twoMidterms", examIds: "turnIn", examHelp: "check", examEnd: "front" },
    multi: { proctoring: ["allowed"], teamRoles: ["ta"] },
    field: { "exam.leaveEarly": "1" },
  });
  const student = text(generate(s));
  assert.match(student, /Show it to the proctor when you turn in your exam/);
  assert.match(student, /ask a proctor whether an answer is correct/);
  assert.match(student, /bring your exam to the front, with your student ID\. If you finish early/);
  const team = text(generateTeam(s));
  assert.match(team, /\*\*IDs\.\*\* Check each student's ID/);
  assert.match(team, /\*\*Checking answers\.\*\*/);
  assert.match(team, /Announce the time remaining at the halfway point and at 15 and 5 minutes\./);
});

test("the student syllabus says who answers regrade requests", () => {
  const s = answers({ choice: { regrades: "platform", regradeHandler: "headTA" }, field: { "team.regradeTA": "Ada Lovelace", "team.regradeDue": "three days" } });
  const student = text(generate(s));
  assert.match(student, /One TA answers every regrade request, usually within three days\./);
  assert.doesNotMatch(student, /Ada Lovelace/);
  assert.match(student, /A regrade request should include:/);
  assert.match(student, /submit a separate request for each problem/);
});

test("the teaching team syllabus lists lecture attendance, duties, and course tasks", () => {
  const s = answers({
    choice: { format: "lecture", recordings: "posted", "teamTasks.videos": "headTA", "teamTasks.pages": "tas", "teamTasks.rubrics": "instructor" },
    multi: { teamRoles: ["ta", "reader"], teamLecture: ["reader"], teamConduct: ["reporting"] },
    field: { "team.headTA": "Grace Hopper", "team.taHours": "20" },
  });
  const team = text(generateTeam(s));
  assert.match(team, /\*\*Lectures are optional for you\.\*\* Attend when it helps/);
  assert.match(team, /\*\*Attend lectures\*\*, so that you grade with the same methods/);
  assert.match(team, /Role \| Main duties \| Hours per week/);
  assert.match(team, /Head TA \(Grace Hopper\) \| The TA duties and upload lecture videos\./);
  assert.match(team, /TAs take turns to create assignment pages/);
  assert.match(team, /Write rubrics \| Instructor \|/);
  // Tasks that don't apply (no tutors) aren't listed.
  assert.doesNotMatch(team, /Coordinate tutors/);
  assert.match(team, /team members are required to report/);
  assert.match(team, /what you learn in other ways/);
});

test("the instructor checklist assigns tasks and records the planning decisions", () => {
  const s = answers({
    choice: { homework: "problemSets", recordings: "posted", "teamTasks.videos": "tas", lateAdds: "extend", prereqs: "strict", examSchedule: "oneMidterm", missedExam: "makeup" },
    multi: { teamRoles: ["ta"], struggling: ["gradebook"] },
    field: { "course.prereqs": "MATH 20", "lateAdd.window": "two weeks after enrolling" },
  });
  const plan = text(generatePlan(s));
  assert.match(plan, /☐ Upload the week's lecture recordings \(TAs, in turns\)\./);
  assert.match(plan, /☐ \*\*5 days after:\*\* Hold makeup exams/);
  assert.match(plan, /get until two weeks after enrolling/);
  assert.match(plan, /The prerequisites \(MATH 20\) are enforced, without waivers\./);
  assert.match(plan, /After the first quiz, in week 4, and after each midterm: check the gradebook/);
  // Unanswered planning decisions are placeholders.
  assert.match(text(generatePlan(empty())), /\{\{Decide how to handle late adds\}\}/);
});

test("every example writes every document without errors", () => {
  for (const preset of Object.values(PRESETS)) {
    const s = migrate(structuredClone(preset.state));
    for (const doc of [generate, generateTeam, generatePlan]) assert.ok(doc(s).length > 0);
  }
});

test("exam versions and accommodation timing reach every document", () => {
  const s = answers({
    choice: { examSchedule: "twoMidterms", examVersions: "three", accommodationTiming: "window" },
    field: { "accom.window": "1 hour before to 3 hours after the main exam starts" },
    multi: { proctoring: ["accommodations"], teamRoles: ["ta"] },
  });
  assert.match(text(generate(s)), /starting any time from 1 hour before to 3 hours after the main exam starts/);
  assert.match(text(generate(s)), /Don't discuss an exam with anyone until everyone has taken it/);
  const team = text(generateTeam(s));
  assert.match(team, /Give version C to students who arrive late/);
  assert.match(team, /version C of the exam, starting any time from 1 hour before/);
  assert.match(text(generatePlan(s)), /Make versions B and C/);
});

test("the instructor checklist dates each exam's tasks from its lead times", () => {
  const s = answers({
    choice: { examSchedule: "oneMidterm", missedExam: "makeup" },
    field: { "exam.dates": "2026-10-21", "course.finalDate": "2026-12-08", "lead.write": "10" },
  });
  setDateStyle("iso");
  const plan = text(generatePlan(s));
  assert.match(plan, /☐ \*\*10 days before:\*\* Write the exam/);
  assert.match(plan, /\*\*Midterm: 2026-10-21\*\*/);
  assert.match(plan, /☐ 2026-10-11: Write the exam/);
  assert.match(plan, /☐ 2026-10-26: Hold makeup exams/);
  assert.match(plan, /\*\*Final exam: 2026-12-08\*\*/);
  assert.match(plan, /☐ 2026-11-28: Write the exam/);
  setDateStyle(undefined);
});

test("migrate turns early or late accommodated exams into a range of start times", () => {
  const s = migrate(answers({ choice: { accommodationTiming: "late" } }));
  assert.equal(s.choice.accommodationTiming, "window");
  assert.equal(s.field["accom.window"], "the start of the main exam until later the same day");
});

test("the course website's uses include the instructor's own", () => {
  const s = answers({ multi: { lmsUses: ["grades", "custom"] }, field: { "lmsUses.custom": "Practice exams\nOffice hours queue" } });
  assert.match(JSON.stringify(generate(s)), /"Your scores","Practice exams","Office hours queue"/);
});

test("course links: every link is listed once in Course basics, and uses of the course website link to their pages", () => {
  const links = QUESTION_BY_ID.get("links");
  assert.ok(links?.fields?.length);
  assert.equal(new Set(links.fields.map(f => f.id)).size, links.fields.length);
  const s = answers({ multi: { lmsUses: ["notes", "readings"] }, field: { "lms.link.notes": "https://example.edu/notes" } });
  assert.match(JSON.stringify(generate(s)), /\[Class notes\]\(https:\/\/example.edu\/notes\)","Readings"/);
  assert.deepEqual(migrate(answers({ multi: { lmsUses: ["materials", "grades"] } })).multi.lmsUses, ["notes", "readings", "grades"]);
});

test("section quiz stakes are their own question, and completion grading migrates to it", () => {
  const s = migrate(answers({ choice: { quizzes: "section", sectionQuizGrading: "completion" } }));
  assert.equal(s.choice.sectionQuizStakes, "completion");
  assert.equal(s.choice.sectionQuizGrading, undefined);
  const team = text(generateTeam(answers({ choice: { quizzes: "section", discussion: "required", sectionQuizGrading: "ownTA", sectionQuizStakes: "high" }, multi: { teamRoles: ["ta"] } })));
  assert.match(team, /Grade your own section's quizzes .* The quizzes are high stakes, so follow the rubric exactly/);
});
