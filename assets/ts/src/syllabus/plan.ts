// ╭───────────────────────────────────────────────────────────────╮
// │      Syllabus designer: the instructor checklist              │
// ╰───────────────────────────────────────────────────────────────╯
// A third document, for the instructor alone: checklists of the tasks before the term, each week,
// during the term, and around each exam, written from the answers, followed by the planning
// decisions that don't go in either syllabus (the "planning" section of questions.ts). Tasks that
// someone else on the team does name who does them (teamTasks).

import { State, activeWeights } from "./generate";
import { formatDateValue } from "./dates";
import { Block, esc } from "./markup";
import { CUSTOM, QUESTION_BY_ID } from "./questions";
import { reader as answers } from "./read";

export function generatePlan(s: State): Block[] {
  const { ch, has, raw, val, v, opt, checked, p, custom, andList, plural } = answers(s);

  const code = v("course.code", "Course number");
  const term = v("course.term", "Term");
  const lms = v("course.lms", "Course website");
  const ohLabel = ch("ohName") === "student" ? "student hours" : "office hours";
  const sections = ch("discussion") === "required" || ch("discussion") === "optional";
  const roles = s.multi.teamRoles ?? [];
  const forum = has("contentQuestions", "forum") ? opt("contact.forum") : "";
  const platform = ch("submitPlatform") === "gradescope" ? opt("regrade.platform") : "";
  const chat = ch("teamChannel") === "chat" ? opt("team.chat") : "";
  const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
  const relevant = (q: string) => { const r = QUESTION_BY_ID.get(q)?.relevant; return !r || r(s); };
  // Who does a course task (teamTasks), as " (who)"; nothing when it's the instructor.
  const who = (task: string) => ({
    headTA: ` (${v("team.headTA", "Head TA's name")})`,
    tas: " (TAs, in turns)",
  } as Record<string, string>)[ch(`teamTasks.${task}`)] ?? "";
  const assigned = (task: string) => relevant("teamTasks") && !!ch(`teamTasks.${task}`)
    && (QUESTION_BY_ID.get("teamTasks")?.roles ?? []).some(r => r.id === task && (!r.relevant || r.relevant(s)));

  const blocks: Block[] = [];
  const push = (...b: Block[]) => blocks.push(...b);
  // A checklist: each item with the question it comes from. Consecutive items from the same
  // question form one list, so that clicking an item finds its question.
  const checklist = (heading: string, src: string, items: [string, string][]) => {
    if (!items.length) return;
    push({ t: "h2", text: heading, src });
    for (const [from, text] of items) {
      const last = blocks[blocks.length - 1];
      if (last.t === "ul" && last.src === from) last.items.push(`☐ ${text}`);
      else push({ t: "ul", src: from, items: [`☐ ${text}`], plain: true });
    }
  };

  push({ t: "h1", text: `${code} Instructor Checklist (${term})`, src: "course" });
  push(p("The tasks that keep the course running, written from your answers: before the term, each week, during the term, and around each exam. Tasks that someone else on the team does name who does them. The planning decisions that aren't in either syllabus come last.", "course"));

  // ⋘──────── Before the term ────────⋙
  const before: [string, string][] = [];
  before.push(["course", `Check the classroom${raw("course.location") ? ` (${esc(raw("course.location"))})` : ""}: the projector, the boards, and the microphone.`]);
  before.push(["course", `Publish the course website (${lms}) with the syllabus, the schedule, and the first week's materials.`]);
  before.push(["dates", "Put the exam dates, holidays, and deadlines on the course calendar."]);
  const bookText: Record<string, string> = {
    commercial: `Check that the textbook is in stock at ${opt("book.where")}, and ask the library to put a copy on reserve.`,
    library: "Check that the library's online access to the textbook works, including from off campus.",
    oer: "Check that the links to the textbook work.",
    notes: "Post your notes for the first weeks.",
  };
  if (bookText[ch("textbook")]) before.push(["textbook", bookText[ch("textbook")]]);
  if (ch("software") && ch("software") !== "none" && ch("software") !== CUSTOM) before.push(["software", "Test the software installation instructions, and check that students can use the software on campus computers."]);
  if (platform) before.push(["submitPlatform", `Create the course on ${platform}, link it to ${lms}, and add the teaching team.`]);
  if (forum) before.push(["contentQuestions", `Set up ${forum}, add the students and the team, and post a welcome message.`]);
  if (ch("recordings") === "posted" || ch("recordings") === "request") before.push(["recordings", "Arrange lecture recording: request it for the room, or test your recording setup."]);
  if (ch("attendance") === "graded") before.push(["attendance", `Set up ${opt("att.method")}, and test the setup in the room.`]);
  if (ch("syllabusQuiz") === "quiz") before.push(["syllabusQuiz", `Create the syllabus quiz on ${lms} (the questions are in the syllabus quiz document).`]);
  if (ch("exceptions") === "form") before.push(["exceptions", "Create the exception request form, and check that the syllabus links to it."]);
  if (ch("extensionLog") === "spreadsheet") before.push(["extensionLog", `Create ${opt("team.extensionSheet")}, and share it with the team only.`]);
  if (has("struggling", "teamFlags")) before.push(["struggling", `Create ${opt("struggle.list")}, and share it with the team only.`]);
  if (ch("late") === "tokens") before.push(["late", "Set up a way to track each student's late days, such as a spreadsheet: the grading platforms don't track them across assignments."]);
  if (activeWeights(s).length && ch("approach") !== "specs" && ch("approach") !== "standards") before.push(["weights", `Set up the grade categories and weights in the gradebook on ${lms}, matching the syllabus.`]);
  if (ch("examDay") === "evening") before.push(["examDay", "Book rooms for the evening exams, and plan conflict exams."]);
  if (has("statements", "accommodations") || has("proctoring", "accommodations")) {
    before.push([has("proctoring", "accommodations") ? "proctoring" : "statements", `Read the accommodation letters from the ${opt("support.drc")}, and book the testing center for each exam.`]);
  }
  if (roles.length) before.push(["teamRoles", "Confirm the teaching team's appointments, and send them the teaching team syllabus."]);
  if (chat) before.push(["teamChannel", `Set up ${chat} for the team.`]);
  if (has("teamSupport", "training")) before.push(["teamSupport", `Make sure that new team members are signed up for ${opt("team.training")}.`]);
  if (roles.length && ch("teamMeeting")) {
    const agenda = ["go over the teaching team syllabus"];
    if (sections && ch("sectionPrep") === "rotate") agenda.push("set the rotation for section notes");
    if (relevant("sectionQuizPrep") && ch("sectionQuizPrep") === "rotate") agenda.push("set the rotation for section quizzes");
    if (forum) agenda.push("set the schedule for answering the forum");
    if ((QUESTION_BY_ID.get("teamTasks")?.roles ?? []).some(r => assigned(r.id) && ch(`teamTasks.${r.id}`) === "tas")) agenda.push("set the schedule for the tasks that TAs take turns on");
    if (ch("teamMeeting") === "weekly" && !raw("team.meetingTime")) agenda.push("choose the time of the weekly meeting");
    before.push(["teamMeeting", `Hold the first team meeting: ${andList(agenda)}.`]);
  }
  if (ch("officeHours") || roles.length) before.push(["officeHours", `${roles.length ? "Collect the team's availability, and post" : "Post"} the ${ohLabel} schedule${raw("inst.ohLink") ? ` on the ${ohLabel} page` : ""}.`]);
  if (sections && ch("sectionPrep")) {
    const first: Record<string, string> = { provided: "", rotate: " (the first TA in the rotation)", shared: " (you write the problems; each TA plans their section)", own: " (each TA)" };
    before.push(["sectionPrep", `Have the notes for the first sections ready${first[ch("sectionPrep")] ?? ""}.`]);
  }
  if (ch("homework")) before.push(["homework", "Write the first assignment and its solutions."]);
  if (assigned("pages")) before.push(["teamTasks", `Create the first assignment pages${who("pages")}.`]);
  before.push(["welcome", `A few days before the term, send a welcome announcement: how to find ${lms}, and what to read first${ch("syllabusQuiz") === "quiz" ? ", including when the syllabus quiz is due" : ""}.`]);
  if (has("struggling", "earlyAlert")) before.push(["struggling", `Find out how to refer a student through ${opt("struggle.system")}.`]);
  checklist("Before the Term", "course", before);

  // ⋘──────── Each week ────────⋙
  const weekly: [string, string][] = [];
  if (roles.length && ch("teamMeeting") === "weekly") weekly.push(["teamMeeting", `Team meeting${raw("team.meetingTime") ? ` (${esc(raw("team.meetingTime"))})` : ""}: review the past week, preview the next, and agree on answers to common questions.`]);
  else if (roles.length && ch("teamMeeting") === "async") weekly.push(["teamMeeting", `Post the week's plan for the team in ${chat || "an email to the team"}.`]);
  weekly.push(["course", `Post the week's materials and announcements on ${lms}.`]);
  if (ch("homework")) weekly.push(["homework", "Write the next assignment and its solutions, and post it at least a week before it is due."]);
  if (assigned("pages")) weekly.push(["teamTasks", `Create the next assignment pages${who("pages")}.`]);
  if (assigned("rubrics")) weekly.push(["teamTasks", `Write the rubric for the work due this week, before grading starts${who("rubrics")}.`]);
  if (sections && ch("sectionPrep")) {
    const by: Record<string, string> = { provided: "", rotate: " (the TA whose turn it is)", shared: " (you write the problems)", own: " (each TA)" };
    weekly.push(["sectionPrep", `Section notes shared with the team by ${opt("team.prepDue")}${by[ch("sectionPrep")] ?? ""}.`]);
    if (checked("team.postNotes")) weekly.push(["sectionPrep", "Post the section notes for students after the last section."]);
  }
  if (relevant("sectionQuizPrep") && ch("sectionQuizPrep")) {
    const by: Record<string, string> = { instructor: "", rotate: " (the TA whose turn it is)", own: " (each TA)" };
    weekly.push(["sectionQuizPrep", `Section quizzes ready by ${opt("team.quizDue")}${by[ch("sectionQuizPrep")] ?? ""}.`]);
  }
  if (relevant("sectionQuizGrading") && ch("sectionQuizGrading")) weekly.push(["sectionQuizGrading", `Section quizzes graded within ${opt("team.quizGradeDue")}.`]);
  if (assigned("graders")) weekly.push(["teamTasks", `Assign the grading, and check that it is finished ${opt("team.gradeDue")}${who("graders")}. Then release the grades.`]);
  else if (ch("gradingProcess")) weekly.push(["gradingProcess", `Check that grading is finished ${opt("team.gradeDue")}, then release the grades.`]);
  if (ch("regrades")) {
    const by: Record<string, string> = { grader: " (each grader, for the problems they graded)", headTA: ` (${v("team.regradeTA", "TA's name")})` };
    weekly.push([ch("regradeHandler") ? "regradeHandler" : "regrades", `Answer regrade requests within ${opt("team.regradeDue")}${by[ch("regradeHandler")] ?? ""}.`]);
  }
  if (assigned("videos")) weekly.push(["teamTasks", `Upload the week's lecture recordings${who("videos")}.`]);
  else if (ch("recordings") === "posted") weekly.push(["recordings", "Upload the week's lecture recordings."]);
  if (forum) weekly.push(["contentQuestions", `Check ${forum} for unanswered questions.`]);
  if (assigned("tutors")) weekly.push(["teamTasks", `Check the tutoring schedule, and arrange substitutes${who("tutors")}.`]);
  if (ch("late") === "tokens") weekly.push(["late", "Update each student's late-day balance."]);
  if (platform && ch("gsPenalty") === "copyDays") weekly.push(["gsPenalty", `Copy the days late of late submissions from ${platform} to ${lms}.`]);
  if (ch("extensionLog") && ch("extensionLog") !== CUSTOM) weekly.push(["extensionLog", "Review the new exceptions, and follow up with students who have asked several times."]);
  if (has("struggling", "missing")) weekly.push(["struggling", "Email students who have missed two assignments in a row."]);
  if (has("struggling", "teamFlags")) weekly.push(["struggling", `Review ${opt("struggle.list")}, and contact the students on it.`]);
  checklist("Each Week", "course", weekly);

  // ⋘──────── During the term ────────⋙
  const during: [string, string][] = [];
  if (ch("lateAdds") && ch("lateAdds") !== "cutoff") during.push(["lateAdds", "In the first weeks, apply the late-add policy (below) to each student who adds, and tell them their deadlines in writing."]);
  if (has("struggling", "gradebook")) during.push(["struggling", `${cap(opt("struggle.when"))}: check the gradebook, and email every student below ${opt("struggle.threshold")} with an invitation to ${ohLabel} and other ways to get help.`]);
  if (has("struggling", "earlyAlert")) during.push(["struggling", `Refer students who are falling behind to ${opt("struggle.system")}, after telling them that you are doing so.`]);
  if (has("teamOpportunities", "lecture")) during.push(["teamOpportunities", "By week 3, ask which team members would like to give a lecture, and schedule them."]);
  if (has("teamSupport", "observe")) during.push(["teamSupport", "Visit one section of each TA, and share feedback afterward."]);
  if (has("teamSupport", "feedback")) during.push(["teamSupport", "A few weeks into the term, run the anonymous survey about sections, and share each TA's results with them."]);
  if (has("teamSupport", "checkin")) during.push(["teamSupport", "Meet one-on-one with each team member."]);
  checklist("During the Term", "course", during);

  // ⋘──────── Each exam ────────⋙
  // Each task has a lead time: days before the exam (negative), after it (positive), or on the day.
  const exam: [string, string, number][] = [];
  const lead = (id: string, sign: -1 | 1) => sign * Math.max(0, Math.round(Number(val(id)) || 0));
  if (ch("examSchedule")) {
    if (has("teamOpportunities", "examProblems")) exam.push(["teamOpportunities", "Collect proposed problems from the team.", lead("lead.problems", -1)]);
    exam.push(["examSchedule", `Write the exam and its solutions, and have ${roles.length ? "a team member" : "a colleague"} take it to check the timing and catch errors.`, lead("lead.write", -1)]);
    if (ch("examDay") === "evening") exam.push(["examDay", "Confirm the rooms and the conflict exams.", lead("lead.rooms", -1)]);
    const versions: Record<string, string> = { two: "Make the second version, with its solutions, and check that both versions are equally difficult.", three: "Make versions B and C, with their solutions, and check that all three are equally difficult. Version C goes to late arrivals and the testing center." };
    if (versions[ch("examVersions")]) exam.push(["examVersions", versions[ch("examVersions")], lead("lead.versions", -1)]);
    if (has("teamOpportunities", "review")) exam.push(["teamOpportunities", "Schedule the review session, and help the team member who leads it prepare.", lead("lead.review", -1)]);
    if (has("proctoring", "accommodations") || has("statements", "accommodations")) exam.push([has("proctoring", "accommodations") ? "proctoring" : "statements", `Send the exam${ch("examVersions") === "three" ? " (version C)" : ""} to the testing center${ch("accommodationTiming") && ch("accommodationTiming") !== CUSTOM ? ", and book times that follow your timing rule" : ""}.`, lead("lead.testing", -1)]);
    if (assigned("rubrics")) exam.push(["teamTasks", `Write the exam rubric${who("rubrics")}.`, lead("lead.rubric", -1)]);
    exam.push(["proctoring", `Print the exams, plus a few extra${roles.length ? ", and assign proctors to rooms" : ""}.`, lead("lead.print", -1)]);
    if (roles.length && ((s.multi.proctoring ?? []).length || ch("examHelp") || ch("examEnd"))) exam.push(["proctoring", "Remind the proctors of the rules (Proctoring Exams, in the teaching team syllabus).", lead("lead.proctors", -1)]);
    if (ch("examIds") === "during" || ch("examIds") === "turnIn" || has("proctoring", "restroom") || ch("examEnd") === "rows") exam.push([ch("examIds") ? "examIds" : "proctoring", "Bring the roster, for checking IDs and counting exams.", 0]);
    const release = lead("lead.grades", 1);
    exam.push([ch("gradingProcess") ? "gradingProcess" : "examSchedule", `Grade ${roles.length ? "together, " : ""}with a rubric, and release the grades once every problem is graded and checked.`, release]);
    if (ch("regrades")) {
      const by = ({ window: ` for ${opt("regrade.window")}`, beforeFinal: ` until ${opt("regrade.final")}` } as Record<string, string>)[ch("regradeDeadline")] ?? "";
      exam.push([ch("regradeDeadline") ? "regradeDeadline" : "regrades", `Accept regrade requests${by}.`, release]);
    }
    if (ch("missedExam") === "makeup") exam.push(["missedExam", "Hold makeup exams for students who missed the exam.", lead("lead.makeup", 1)]);
    if (ch("secondChance") === "corrections") exam.push(["secondChance", "Post the instructions and deadline for exam corrections.", release]);
    if (ch("secondChance") === "retake") exam.push(["secondChance", "Hold the retake (write the retake version first).", lead("lead.retake", 1)]);
  }
  exam.sort((x, y) => x[2] - y[2]);
  const when = (d: number) => (d === 0 ? "exam day" : `${plural(Math.abs(d), "day")} ${d < 0 ? "before" : "after"}`);
  checklist("For Each Exam", "examSchedule", exam.map(([src, t, d]) => [src, `**${cap(when(d))}:** ${t}`]));

  // The same tasks with their dates, for each exam whose date is known.
  const iso = (t: string) => /^\d{4}-\d{2}-\d{2}$/.test(t);
  const midterms = raw("exam.dates").split(/[;\n]/).map(t => t.trim()).filter(iso);
  const named: [string, string][] = midterms.map((d, i) => [ch("examSchedule") === "frequent" ? `Exam ${i + 1}` : midterms.length === 1 ? "Midterm" : `Midterm ${i + 1}`, d]);
  if (iso(raw("course.finalDate")) && ch("examSchedule") !== "project") named.push(["Final exam", raw("course.finalDate")]);
  if (exam.length && named.length) {
    push({ t: "h3", text: "Dates for Each Exam", src: "examLeads" });
    for (const [label, date] of named) {
      const [y, m, d] = date.split("-").map(Number);
      const on = (days: number) => formatDateValue(new Date(y, m - 1, d + days));
      push(p(`**${label}: ${on(0)}**`, "examLeads"), { t: "ul", src: "examLeads", plain: true, items: exam.map(([, t, days]) => `☐ ${on(days)}: ${t}`) });
    }
  }

  // ⋘──────── Planning decisions ────────⋙
  push({ t: "h2", text: "Planning Decisions", src: "lateAdds" });
  push({ t: "h3", text: "Students Who Add Late", src: "lateAdds" });
  const lateAddText: Record<string, string> = {
    extend: `Students who add late get until ${opt("lateAdd.window")} to submit the work that was due before they enrolled. Tell each late add their new deadlines in writing${ch("extensionLog") === "spreadsheet" ? `, and record them in ${opt("team.extensionSheet")}` : ""}.`,
    excuse: "Work that was due before a student enrolled is excused, and its weight moves to the rest of its category. Mark the excused assignments in the gradebook as soon as the student enrolls.",
    drops: "Work that was due before a student enrolled counts as that student's dropped scores. Tell late adds that they have used their drops, so that they can plan for illnesses later in the term.",
    cutoff: "Permission to add is given only in the first week of the term. After that, point students to the next term's offering.",
  };
  if (ch("lateAdds") === CUSTOM) push(...custom("lateAdds"));
  else push(p(lateAddText[ch("lateAdds")] ?? "{{Decide how to handle late adds}}", "lateAdds"));

  push({ t: "h3", text: "Prerequisite Waivers", src: "prereqs" });
  const prereqs = raw("course.prereqs") ? ` (${esc(raw("course.prereqs"))})` : "";
  const prereqText: Record<string, string> = {
    strict: `The prerequisites${prereqs} are enforced, without waivers.`,
    evidence: `A prerequisite${prereqs} is waived when the student shows an equivalent course: a transcript, plus the syllabus of the course if it was taken at another institution.`,
    conversation: `A prerequisite${prereqs} is waived after a short conversation or a diagnostic quiz shows that the student knows the prerequisite material. Use the same questions for every student.`,
    request: `Prerequisites${prereqs} are waived on request. Tell the student which topics the course assumes, and suggest material to review.`,
  };
  if (ch("prereqs") === CUSTOM) push(...custom("prereqs"));
  else push(p(prereqText[ch("prereqs")] ?? "{{Decide how to handle requests to waive prerequisites}}", "prereqs"));

  push({ t: "h3", text: "Noticing Students Who Are Struggling", src: "struggling" });
  const struggleText: Record<string, string> = {
    gradebook: `**Gradebook checks.** ${cap(opt("struggle.when"))}, email every student below ${opt("struggle.threshold")}, with an invitation to ${ohLabel} and other ways to get help.`,
    missing: "**Missing work.** Email students who miss two assignments in a row, before they fall further behind.",
    teamFlags: `**Flags from the team.** Team members add students who seem lost, stop attending, or seem distressed to ${opt("struggle.list")}, which you review each week.`,
    earlyAlert: `**Early alerts.** Refer students who are falling behind to ${opt("struggle.system")}, after telling them that you are doing so.`,
  };
  const struggle = (s.multi.struggling ?? []).filter(x => x in struggleText).map(x => struggleText[x]);
  if (has("struggling", CUSTOM)) {
    const own = raw("struggling.custom").split("\n").map(l => l.trim().replace(/^[-*•]\s+/, "")).filter(Boolean);
    struggle.push(...(own.length ? own : ["{{Your own way}}"]));
  }
  if (struggle.length) push({ t: "ul", src: "struggling", items: struggle });
  else push(p("{{Choose how you will notice students who are struggling}}", "struggling"));

  return blocks;
}
