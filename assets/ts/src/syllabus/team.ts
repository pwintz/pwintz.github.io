// ╭───────────────────────────────────────────────────────────────╮
// │      Syllabus designer: the teaching team syllabus            │
// ╰───────────────────────────────────────────────────────────────╯
// A second document, for TAs, tutors, and readers. It describes each role's responsibilities, how
// the team works together, how grading works, and how to handle common situations with students.
// Most of it is written from the answers to the student syllabus questions, so that the two
// documents agree; the "team" section of questions.ts adds the decisions that only the team needs.

import { State, activeWeights } from "./generate";
import { Block, esc } from "./markup";
import { CUSTOM, QUESTION_BY_ID } from "./questions";
import { reader as answers } from "./read";

export function generateTeam(s: State): Block[] {
  const { ch, has, raw, val, v, opt, pct, checked, rows, p, custom, andList, examAllowed, meetings } = answers(s);

  const code = v("course.code", "Course number");
  const term = v("course.term", "Term");
  const lms = v("course.lms", "Course website");
  const name = v("inst.name", "Instructor name");
  const email = v("inst.email", "Email");
  const ohLabel = ch("ohName") === "student" ? "student hours" : "office hours";
  const sections = ch("discussion") === "required" || ch("discussion") === "optional";
  const linkTo = (text: string, id: string) => (/^https?:\/\//i.test(raw(id)) && !/\]\(/.test(text) ? `[${text}](${raw(id)})` : text);
  const forum = has("contentQuestions", "forum") ? linkTo(opt("contact.forum"), "contact.forumLink") : "";
  const roles = s.multi.teamRoles ?? [];
  const ta = roles.includes("ta");
  const tutor = roles.includes("tutor");
  const reader = roles.includes("reader");
  // Whether a role must attend lectures: "required", "optional", or "" when the question isn't answered.
  const lecture = (role: string) => (!(s.multi.teamLecture ?? []).length ? "" : has("teamLecture", role) ? "required" : "optional");
  const graders = reader ? "readers" : ta ? "TAs" : "graders";
  const hours = (id: string) => (raw(id) ? ` Your appointment is about ${esc(raw(id))} hours per week, including preparation and meetings. Keep track of your hours, and tell me early if the work is taking more time, so that we can adjust.` : "");
  const chat = ch("teamChannel") === "chat" ? opt("team.chat") : "email";
  const logWhere = ({
    spreadsheet: `in ${opt("team.extensionSheet")}`,
    platform: "as a new due date for the student on the grading platform",
    form: "in the spreadsheet of request form responses",
  } as Record<string, string>)[ch("extensionLog")] ?? (chat === "email" ? "in a message to me" : `in ${chat}`);

  const blocks: Block[] = [];
  const push = (...b: Block[]) => blocks.push(...b);

  // Course management tasks (teamTasks): who does each one, for the tasks that apply.
  const headTA = v("team.headTA", "Head TA's name");
  const platformName = ch("submitPlatform") === "gradescope" ? opt("regrade.platform") : "";
  const taskInfo: Record<string, { short: string; detail: string }> = {
    graders: { short: "manage graders", detail: `Assign each assignment's grading, share the rubric and the deadline, and check that grading is finished ${opt("team.gradeDue")}.` },
    tutors: { short: "coordinate tutors", detail: "Set the tutors' schedules for class and drop-in hours, help new tutors get started, and find substitutes." },
    videos: { short: "upload lecture videos", detail: ch("recordings") === "request" ? "Upload each lecture recording within a day, and share it with the students who have an excused absence or an accommodation." : `Upload each lecture recording to ${lms} within a day, titled with the date and topic.` },
    pages: { short: "create assignment pages", detail: `Create each assignment on ${lms}${platformName ? ` and ${platformName}` : ""}, with its instructions, points, and due date, at least a week before it is due.` },
    rubrics: { short: "write rubrics", detail: "Write the rubric for each assignment and exam before grading starts, and share it with the graders." },
  };
  const taskWho: Record<string, string> = { instructor: "Instructor", headTA: `Head TA (${headTA})`, tas: "TAs, in turns" };
  const tasks = (QUESTION_BY_ID.get("teamTasks")?.roles ?? [])
    .filter(r => (!r.relevant || r.relevant(s)) && taskWho[ch(`teamTasks.${r.id}`)])
    .map(r => ({ id: r.id, who: ch(`teamTasks.${r.id}`) }));
  const tasksFor = (who: string) => tasks.filter(t => t.who === who).map(t => taskInfo[t.id].short);
  const sentence = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
  // The main duties of each role, for the summary table.
  const duties: Record<string, string[]> = { ta: [], tutor: [], reader: [] };
  const exams = !!ch("examSchedule") || (s.multi.proctoring ?? []).length > 0;

  // Where students learn from the team, for the thank-you.
  const where: string[] = [];
  if (sections && ta) where.push("in sections");
  if (tutor && (ch("format") === "active" || ch("format") === "flipped")) where.push("during class");
  if (ta || tutor) where.push(`in ${ta ? ohLabel : "tutoring hours"}`);
  where.push("through your feedback on their work");

  push({ t: "h1", text: `${code} Teaching Team Syllabus (${term})`, src: "teamRoles" });
  push(
    p(`This document is for the ${code} teaching team. It describes what each of us does, how we work together, and how to handle common situations with students. The student syllabus has the course policies. When a student asks about a policy, point them to the syllabus, so that every student gets the same answer.`, "teamRoles"),
    p(`Thank you for being part of the team. Much of what students learn in this course, they learn from you: ${andList(where)}.`, "teamRoles"),
  );

  // ⋘──────── The team ────────⋙
  push({ t: "h2", text: "The Team", src: "instructor" });
  push({ t: "kv", src: "instructor", rows: [["Instructor", [p(`${name}, ${email}`, "instructor")]]] });
  const team = rows("inst.team");
  if (team.length) {
    push({ t: "table", src: "instructor", head: ["Teaching Assistant", "Email", "Section"], rows: team.map(r => [esc(r[0] ?? ""), esc(r[1] ?? ""), esc(r[2] ?? "")]) });
  }

  // ⋘──────── Course at a glance ────────⋙
  push({ t: "h2", text: "The Course at a Glance", src: "course" });
  const formatText: Record<string, string> = {
    lecture: "Traditional lectures.",
    active: "Lectures with active learning: short explanations alternate with polls and problems that students work on in small groups.",
    flipped: "Flipped: students watch videos or read before class, and class time is spent solving problems in groups.",
  };
  const glance: [string, Block[]][] = [
    ["Meetings", [p(`${meetings()}, ${v("course.location", "Location")}`, "course")]],
  ];
  if (formatText[ch("format")]) glance.push(["Format", [p(formatText[ch("format")], "format")]]);
  if (sections) glance.push(["Discussion sections", [p(`${ch("discussion") === "required" ? "Required" : "Optional"}. ${v("sec.when", "Section times and places")}`, "discussion")]]);
  glance.push(["Course website", [p(lms, "course")]]);
  const weights = activeWeights(s);
  if (weights.length && ch("approach") !== "specs" && ch("approach") !== "standards") {
    glance.push(["Grading", [{ t: "ul", src: "weights", items: weights.map(w => `${w.weight}% ${esc(w.label)}`) }]]);
  }
  push({ t: "kv", src: "course", rows: glance });
  const cadence = rows("cadence.list");
  if (cadence.length) {
    push(p("Each week, students follow this rhythm:", "cadence"), { t: "table", src: "cadence", head: ["When", "What"], rows: cadence.map(r => [esc(r[0] ?? ""), esc(r.slice(1).join(" | "))]) });
  }

  // ⋘──────── Responsibilities ────────⋙
  // Each role's duties are written as a list, then summarized in a table at the top of the section.
  const roleBlocks: Block[] = [];
  if (ta) {
    const items: string[] = [];
    if (sections) {
      const prep: Record<string, string> = {
        rotate: `Each week, one TA writes the notes (worksheet, solutions, and plan) for every section, on a rotation that we set at the first meeting. Share a draft with me for review, and share the final notes with the team by ${opt("team.prepDue")}.`,
        provided: `I will share a worksheet, solutions, and a plan for each section by ${opt("team.prepDue")}. Work through the problems yourself before section, so that you know where students will get stuck.`,
        shared: `I will share the problems for each section by ${opt("team.prepDue")}. You decide how to run the section: which problems to start with, when to work in groups, and what to put on the board.`,
        own: `You design your own sections, covering the week's topics. Share your plan with the team by ${opt("team.prepDue")}, so that sections stay roughly in step.`,
      };
      let text = "**Lead discussion sections.** Sections are for practice: keep students working on problems, ideally in small groups, rather than lecturing.";
      const timing: Record<string, string> = {
        beforeHw: "Sections meet before the homework is due, so students will ask about it: help them get started and find their mistakes, but don't solve the problems for them.",
        afterHw: "Sections meet after the homework is due, so begin by going over the problems that gave students the most trouble.",
        spread: "Sections meet on different days, so some meet before the homework deadline and some after. Give every section the same help with the homework, so that no section has an advantage, and keep quiz questions to yourself until every section has met.",
      };
      if (timing[ch("sectionTiming")]) text += ` ${timing[ch("sectionTiming")]}`;
      if (prep[ch("sectionPrep")]) text += ` ${prep[ch("sectionPrep")]}`;
      if (checked("team.postNotes")) text += ` After the last section each week, the notes are posted on ${lms} for students.`;
      if (ch("quizzes") === "section") text += " Each section includes the weekly quiz: give the quiz, then help students revise it together before they submit it.";
      else if (ch("quizzes") === "highStakes") text += ` Proctor the weekly quiz in ${opt("quiz.where")}. Students with testing accommodations take it at the testing center, so confirm with me each week who those students are.`;
      items.push(text);
      duties.ta.push(ch("sectionPrep") === "rotate" || ch("sectionPrep") === "own" ? "lead and plan discussion sections" : "lead discussion sections");
      const sectionQuiz = ch("quizzes") === "section" || (ch("quizzes") === "highStakes" && /section/i.test(val("quiz.where")));
      const versions = checked("team.quizVersions") ? ", with a different version for each section" : "";
      const quizPrep: Record<string, string> = {
        instructor: `**Section quizzes.** I write the weekly quizzes${versions} and share them by ${opt("team.quizDue")}.`,
        rotate: `**Section quizzes.** TAs take turns writing the weekly quiz${versions}. Share your draft with me for review, and share the final version with the team by ${opt("team.quizDue")}.`,
        own: `**Section quizzes.** Write your own section's quiz each week, on the topics we agree on, and share it with me by ${opt("team.quizDue")}.`,
      };
      if (sectionQuiz && quizPrep[ch("sectionQuizPrep")]) items.push(`${quizPrep[ch("sectionQuizPrep")]} Don't share quiz questions with students until every section has taken the quiz.`);
      if (sectionQuiz && (ch("sectionQuizPrep") === "rotate" || ch("sectionQuizPrep") === "own")) duties.ta.push("write section quizzes");
      const due = opt("team.quizGradeDue");
      const quizGrading: Record<string, string> = {
        ownTA: `**Grading section quizzes.** Grade your own section's quizzes within ${due}, using the shared answer key. Note what students struggled with, and review it at the start of the next section.`,
        shared: `**Grading section quizzes.** Quizzes from every section are graded by problem: each of us grades the same problem for all sections, with a shared rubric, within ${due} after the last section.`,
        readers: `**Grading section quizzes.** Readers grade the section quizzes within ${due}. TAs share the answer key, and anything they emphasized in section, with the readers.`,
      };
      const stakesText: Record<string, string> = {
        completion: " Quizzes are graded for completion: give full credit for a good-faith attempt, and review the answers in section, so that students get feedback.",
        low: " Grade for correctness with the answer key, but generously: the quizzes are low stakes, and the feedback matters more than the score.",
        high: " The quizzes are high stakes, so follow the rubric exactly, and raise any question about it with the team, so that every section is graded the same way.",
      };
      if (sectionQuiz && ch("sectionQuizGrading") === "custom") items.push(...custom("sectionQuizGrading").map(b => ("text" in b ? b.text : "")).filter(Boolean));
      else if (sectionQuiz && quizGrading[ch("sectionQuizGrading")]) items.push(quizGrading[ch("sectionQuizGrading")] + (stakesText[ch("sectionQuizStakes")] ?? ""));
      else if (sectionQuiz && stakesText[ch("sectionQuizStakes")]) items.push(`**Grading section quizzes.**${stakesText[ch("sectionQuizStakes")]}`);
      if (sectionQuiz && (ch("sectionQuizGrading") === "ownTA" || ch("sectionQuizGrading") === "shared")) duties.ta.push("grade section quizzes");
    }
    items.push(`**Hold ${ohLabel}.**${raw("inst.ohLink") ? ` Keep your times and place up to date on the ${linkTo(`${ohLabel} page`, "inst.ohLink")}.` : ""} Welcome every student, and start by asking what they have tried. Help them find the next step instead of giving the answer, and look at their work to see where they got stuck.`);
    duties.ta.push(`hold ${ohLabel}`);
    if (forum) {
      items.push(`**Answer questions on ${forum}.** We share the forum on a schedule that we set at the first meeting, so that every question is answered within a day. Never post solutions to homework before the deadline.`);
      duties.ta.push(`answer questions on ${forum}`);
    }
    if (!reader) {
      items.push("**Grade assigned work** using the rubric, by the grading deadline (see Grading, below).");
      duties.ta.push("grade assigned work");
    }
    if (exams) {
      items.push(`**Proctor and grade exams** with the whole team${(s.multi.proctoring ?? []).length || ch("examEnd") ? ", following Proctoring Exams, below" : ""}.`);
      duties.ta.push("proctor and grade exams");
    }
    const lectureText: Record<string, string> = {
      required: "**Attend lectures**, so that sections build on what was said in class and you hear the questions students ask there.",
      optional: `**Lectures are optional for you.** Attend when it helps, such as before a section on new material. When you don't attend, read the lecture notes or slides on ${lms} before section, so that you use the same notation and methods as lecture.`,
    };
    if (lectureText[lecture("ta")]) items.push(lectureText[lecture("ta")]);
    if (lecture("ta") === "required") duties.ta.push("attend lectures");
    const turns = tasksFor("tas");
    if (turns.length) {
      items.push(`**Course tasks.** TAs take turns to ${andList(turns)}, on a schedule that we set at the first meeting (see Course Tasks, below).`);
      duties.ta.push(...turns.map(t => `${t} (in turns)`));
    }
    roleBlocks.push({ t: "h3", text: "Teaching Assistants", src: "teamRoles" }, { t: "ul", src: "teamRoles", items });
    if (hours("team.taHours")) roleBlocks.push(p(hours("team.taHours").trim(), "teamRoles"));
  }
  const headTasks = tasksFor("headTA");
  if (headTasks.length) {
    roleBlocks.push(
      { t: "h3", text: "Head TA", src: "teamTasks" },
      p(`${headTA} is the head TA this term. In addition to the duties of a TA, the head TA will ${andList(headTasks)} (see Course Tasks, below). The head TA has fewer of the other duties, so that the work fits within their hours. Bring questions about these tasks to ${headTA} first.`, "teamTasks"),
    );
  }
  if (tutor) {
    const items: string[] = [];
    const inClass = ch("format") === "active" || ch("format") === "flipped";
    if (inClass) {
      items.push("**Help students during class.** During group work, walk around, listen to how groups are thinking, and ask questions that help them get unstuck. A good question helps more than a correct answer.");
      duties.tutor.push("help students during class");
    }
    const tutorLecture: Record<string, string> = {
      required: "**Attend lectures**, so that you know what students are working on and can help during class.",
      // Tutors who help during class are there anyway.
      optional: inClass ? "" : `**Lectures are optional for you**, but attending helps you tutor what students are learning. When you don't attend, read the lecture notes or slides on ${lms}, so that you use the same notation and methods as lecture.`,
    };
    if (tutorLecture[lecture("tutor")]) items.push(tutorLecture[lecture("tutor")]);
    if (lecture("tutor") === "required") duties.tutor.push("attend lectures");
    items.push("**Hold drop-in tutoring hours.** Help students work through practice problems and homework, without doing the problems for them.");
    duties.tutor.push("hold drop-in tutoring hours");
    items.push(`**Send policy questions to me.** Tutors don't grade or decide on exceptions. If a student asks about grades, deadlines, or exceptions, point them to the syllabus or to me.`);
    roleBlocks.push({ t: "h3", text: "Tutors and Learning Assistants", src: "teamRoles" }, { t: "ul", src: "teamRoles", items });
    if (hours("team.tutorHours")) roleBlocks.push(p(hours("team.tutorHours").trim(), "teamRoles"));
  }
  if (reader) {
    const readerLecture: Record<string, string> = {
      required: "**Attend lectures**, so that you grade with the same methods and notation that students were taught.",
      optional: `**Lectures are optional for you.** Attend when it helps you grade, such as before grading a new topic, or read the lecture notes on ${lms} for the topics you grade.`,
    };
    duties.reader.push("grade assigned work");
    if (lecture("reader") === "required") duties.reader.push("attend lectures");
    duties.reader.push("report common mistakes");
    roleBlocks.push({ t: "h3", text: "Readers", src: "teamRoles" }, {
      t: "ul", src: "teamRoles", items: [
        "**Grade assigned work** using the rubric, by the grading deadline (see Grading, below).",
        ...(readerLecture[lecture("reader")] ? [readerLecture[lecture("reader")]] : []),
        "**Report patterns.** Tell me about common mistakes, so that I can address them in class, and about submissions that look copied.",
        "**Leave communication with students to the rest of the team.** If a student contacts you about a grade, send them to the regrade process in the syllabus.",
      ],
    });
    if (hours("team.readerHours")) roleBlocks.push(p(hours("team.readerHours").trim(), "teamRoles"));
  }
  if (roles.length) {
    push({ t: "h2", text: "Responsibilities", src: "teamRoles" });
    // The duties of each role at a glance.
    const summary: [string, string, string][] = [];
    if (ta) summary.push(["Teaching assistants", "ta", "team.taHours"]);
    if (headTasks.length) summary.push([`Head TA (${headTA})`, "head", ""]);
    if (tutor) summary.push(["Tutors and learning assistants", "tutor", "team.tutorHours"]);
    if (reader) summary.push(["Readers", "reader", "team.readerHours"]);
    const withHours = summary.some(([, , id]) => raw(id));
    push(p("The duties of each role, in short:", "teamRoles"), {
      t: "table", src: "teamRoles",
      head: ["Role", "Main duties", ...(withHours ? ["Hours per week"] : [])],
      rows: summary.map(([label, id, hoursId]) => {
        const list = id === "head" ? ["the TA duties", ...headTasks] : duties[id];
        return [label, list.length ? `${sentence(andList(list))}.` : "", ...(withHours ? [esc(raw(hoursId))] : [])];
      }),
    });
    push(...roleBlocks);
  }
  if (tasks.length) {
    push(
      { t: "h3", text: "Course Tasks", src: "teamTasks" },
      p("Who does each of the routine tasks that keep the course running:", "teamTasks"),
      { t: "table", src: "teamTasks", head: ["Task", "Who", "What it involves"], rows: tasks.map(t => [sentence(taskInfo[t.id].short), taskWho[t.who], taskInfo[t.id].detail]) },
    );
  }

  // ⋘──────── Working together ────────⋙
  if (ch("teamMeeting") || ch("teamChannel")) {
    push({ t: "h2", text: "How We Work Together", src: "teamMeeting" });
    switch (ch("teamMeeting")) {
      case "weekly":
        push(p(`We meet every week${raw("team.meetingTime") ? ` (${esc(raw("team.meetingTime"))})` : ""}. At each meeting, we review the past week (what confused students, and how grading went), preview the next week's material and section plan, and agree on how to answer common questions. The meeting counts toward your hours.`, "teamMeeting"));
        break;
      case "async":
        push(p(`Each week, I will post the plan for the week in ${chat}: the material, the section plan, and grading assignments. Please read it, and reply with problems you see from your sections and office hours. We will meet when something needs discussion.`, "teamMeeting"));
        break;
      case "start":
        push(p("We meet once before the term starts to go over this document, and then as needed. If you notice a problem, please don't wait for a meeting: tell me right away.", "teamMeeting"));
        break;
      case CUSTOM:
        push(...custom("teamMeeting"));
        break;
    }
    if (ch("teamChannel") === "chat") push(p(`Between meetings, we use ${chat} for quick questions. Grading questions especially belong there, so that everyone applies the same answer. Nobody is expected to reply in the evenings or on weekends.`, "teamChannel"));
    else if (ch("teamChannel") === "email") push(p("Between meetings, we use email. When a question affects how everyone grades or answers students, reply to the whole team.", "teamChannel"));
  }

  // ⋘──────── Grading ────────⋙
  if (ch("gradingProcess") || ch("rubric") || ch("regrades")) {
    push({ t: "h2", text: "Grading", src: "gradingProcess" });
    const items: string[] = [];
    const processText: Record<string, string> = {
      byProblem: `Grading is divided by problem: each grader grades the same problems for every student, so that each rubric is applied by one person.`,
      bySection: "Each TA grades their own section's work. Since students compare scores across sections, follow the rubric closely, and raise any question about it with the team.",
      rotate: `Grading is split evenly among the ${graders}, and assignments rotate from week to week.`,
    };
    if (processText[ch("gradingProcess")]) items.push(processText[ch("gradingProcess")]);
    if (checked("team.calibrate") && ch("gradingProcess") === "byProblem") items.push("**Check your rubric before grading the rest.** After grading the first few submissions for your problem, check your rubric with me (and with anyone else grading the same problem), so that we settle questions about partial credit before most of the grading is done.");
    else if (checked("team.calibrate")) items.push("**Calibrate before grading.** Each grader first grades the same few submissions; then we compare scores and settle the rubric before grading the rest.");
    const turnaround: Record<string, string> = { oneWeek: "within one week", twoWeeks: "within two weeks", beforeExam: "before the related exam" };
    items.push(`**Deadline.** Finish grading ${opt("team.gradeDue")}${turnaround[ch("turnaround")] ? `, so that students get their work back ${turnaround[ch("turnaround")]}, as the syllabus promises` : ""}.`);
    if (ch("rubric") === "fourPart") items.push("**Rubric.** Grade with the four-part rubric in the syllabus: correctness, explanations, effort, and presentation. Award points for valid methods even when the final answer is wrong.");
    else if (ch("rubric") === "showWork") items.push("**Rubric.** Students must show their work: a correct answer with no work receives little credit, and valid methods with mistakes receive partial credit.");
    const platform = opt("regrade.platform");
    if (ch("submitPlatform") === "gradescope") {
      items.push(`**${platform}.** Grade by question, using the shared rubric: change a rubric item rather than adjusting one student's score, so that the change applies to everyone with the same mistake. Don't post grades to students; I post them once grading is finished and checked.`);
      const extensionText: Record<string, string> = {
        noDates: `Due dates and extensions are kept on ${platform} only; the assignments on ${lms} have no due dates.`,
        flags: `Extensions are entered on ${platform} only. ${lms} shows students with extensions as late or missing; ignore those flags.`,
        both: `Every extension must be entered on both ${platform} and ${lms}, because they don't share due dates. If you grant an extension, enter it in both places, or tell me.`,
      };
      if (extensionText[ch("gsExtensions")]) items.push(`**Extensions.** ${extensionText[ch("gsExtensions")]}`);
      const penaltyText: Record<string, string> = {
        grader: `Check whether each submission is late, after any extension, and apply the “Late” rubric item on ${platform}.`,
        copyDays: `Don't take off points for lateness. After scores are posted, the days late for each late submission are copied from ${platform} to ${lms}, which applies the late policy.`,
        endOfTerm: "Grade late work like on-time work; late days and penalties are tracked separately and applied at the end of the term.",
      };
      if ((ch("late") === "penalty" || ch("late") === "tokens") && penaltyText[ch("gsPenalty")]) items.push(`**Late penalties.** ${penaltyText[ch("gsPenalty")]}`);
    }
    items.push("**Comments.** Write short comments that explain why points were taken off. Students read them to learn, and clear comments prevent regrade requests.");
    const regradeBy = ({
      window: ` within ${opt("regrade.window")} after grades are released`,
      beforeFinal: ` by ${opt("regrade.final")}`,
      none: "",
    } as Record<string, string>)[ch("regradeDeadline")] ?? " within one week";
    const regrades: Record<string, string> = {
      platform: `**Regrades.** Students submit regrade requests on ${opt("regrade.platform")}${regradeBy}${/^https?:\/\//i.test(raw("regrade.help")) ? ` ([instructions for students](${raw("regrade.help")}))` : ""}.`,
      written: `**Regrades.** Students submit regrade requests in writing${regradeBy}.`,
      person: `**Regrades.** Students bring regrade requests to ${ohLabel}${regradeBy}. If you regrade a problem, record the change and tell the original grader.`,
    };
    const due = opt("team.regradeDue");
    const handler: Record<string, string> = {
      grader: `The person who graded the problem answers the request within ${due}. Forward requests that involve a policy, or that you are unsure about, to me.`,
      instructor: `I answer every regrade request. If a student asks you, send them to the regrade process instead of changing the score yourself.`,
      headTA: `${v("team.regradeTA", "TA's name")} answers every regrade request within ${due} and forwards hard cases to me. If a student asks you directly, send them to the regrade process.`,
    };
    if (regrades[ch("regrades")]) {
      const who = ch("regradeHandler") === "custom" ? "" : handler[ch("regradeHandler")] ?? "";
      items.push(`${regrades[ch("regrades")]}${who ? ` ${who}` : ""}`);
      if (ch("regradeHandler") === "custom") items.push(...custom("regradeHandler").map(b => ("text" in b ? b.text : "")).filter(Boolean));
    }
    const late: Record<string, string> = {
      none: "**Late work.** Late work is not accepted unless I grant an extension.",
      penalty: `**Late work.** The late penalty (${pct("late.pct")} per day, for up to ${esc(val("late.days") || "{{days}}")} days) applies to all late work; don't waive it yourself.`,
      tokens: "**Late work.** Students use late days, which I track. Grade late work the same as on-time work.",
      flexible: "**Late work.** Late work is accepted without penalty, so expect submissions to arrive through the term.",
    };
    if (late[ch("late")]) items.push(late[ch("late")]);
    push({ t: "ul", src: "gradingProcess", items });
    if (ch("gradingProcess") === CUSTOM) push(...custom("gradingProcess"));
  }

  // ⋘──────── Proctoring ────────⋙
  const proctorText: Record<string, string> = {
    allowed: `**What is allowed.** Students may use ${andList(examAllowed())}. Nothing else is allowed: no phones, smartwatches, earbuds, or other electronic devices${ch("examAids") === "sheet" ? ", and no notes beyond the allowed sheet. Check note sheets as you walk around" : ""}.`,
    bags: "**Bags and phones.** Before the exam starts, students turn off their phones and leave them in their bags at the front or sides of the room. Students may keep wallets and keys.",
    seating: "**Seating.** Students leave an empty seat between them, or sit in their assigned seats. Seat students before handing out exams.",
    restroom: "**Restroom breaks.** One student at a time. Before leaving, the student hands you their phone, exam, and student ID. While the student is out, check the ID against the roster to confirm that they are enrolled, and note the time out and back. Return the items when they come back. This keeps exams from leaving the room, including with someone who isn't enrolled and doesn't return.",
    incidents: "**Suspected cheating.** Don't confront the student or take their exam. Note the student, seat, time, and what you saw; if needed, quietly move the student to another seat. Tell me after the exam.",
    accommodations: `**Accommodations.** Students with testing accommodations take the exam at the testing center, with the same instructions${ch("examVersions") === "three" ? " and version C of the exam" : ""}${({ same: ", at the same time as the main exam", window: `, starting any time from ${opt("accom.window")}`, either: ", at any time on the day of the exam" } as Record<string, string>)[ch("accommodationTiming")] ?? ""}. Send any correction announced during the exam to the testing center right away.${ch("accommodationTiming") === "window" || ch("accommodationTiming") === "either" ? " Don't discuss the exam with students until every student has taken it." : ""}`,
  };
  const idText: Record<string, string> = {
    during: "**IDs.** Students put their student ID on the desk. During the exam, walk the rows and compare each ID with the student and the name on the exam. Where full rows make that hard, check those students' IDs when they turn in their exams.",
    turnIn: "**IDs.** Check each student's ID against the name on the exam as they turn it in. Note any student without an ID, and tell me after the exam.",
  };
  const correction = "If a problem has an error, tell me, and announce the correction to the whole room and write it on the board.";
  const helpText: Record<string, string> = {
    clarify: `**Questions.** Answer only questions that clarify what a problem asks; don't give hints. ${correction}`,
    hints: `**Questions and hints.** When a student is stuck, you may give a small hint, such as pointing to a relevant idea, but don't solve any part of the problem. Give the same hint to anyone who asks about the same problem, and tell me which hints you gave, so that other rooms can give them too. ${correction}`,
    check: `**Checking answers.** When a student asks, tell them whether an answer is correct, but not what the mistake is. Walk the room, so that every student who wants a check gets one, not only those who ask first. ${correction}`,
  };
  const endText: Record<string, string> = {
    seated: "**End of the exam.** When time is called, students stop writing and stay seated while you collect the exams from the seats. Count the exams against the number of students before anyone leaves.",
    front: "**End of the exam.** When time is called, students stop writing and bring their exams to the front. Watch the line: nobody writes after time is called.",
    rows: "**End of the exam.** When time is called, students stop writing and pass their exams to the end of their row, where you collect them. Count the exams against the roster before students leave.",
  };
  const proctorItems: string[] = [];
  const rule = (x: string) => { if (has("proctoring", x)) proctorItems.push(proctorText[x]); };
  ["allowed", "bags", "seating"].forEach(rule);
  const versionText: Record<string, string> = {
    two: "**Versions.** Hand out the two versions in alternating seats, so that neighbors have different versions. Seat late arrivals where neither neighbor has their version, if a seat like that is left.",
    three: "**Versions.** Hand out versions A and B in alternating seats, so that neighbors have different versions. Give version C to students who arrive late, wherever they sit.",
  };
  if (versionText[ch("examVersions")]) proctorItems.push(versionText[ch("examVersions")]);
  if (idText[ch("examIds")]) proctorItems.push(idText[ch("examIds")]);
  rule("restroom");
  if (helpText[ch("examHelp")]) proctorItems.push(helpText[ch("examHelp")]);
  if (ch("examEnd")) proctorItems.push(`**Time.** Announce the time remaining at ${opt("exam.timeCalls")}.`);
  if (endText[ch("examEnd")]) proctorItems.push(`${endText[ch("examEnd")]}${checked("exam.leaveEarly") ? " Students who finish early may turn in their exam and leave quietly, except in the last 10 minutes." : ""}`);
  ["incidents", "accommodations"].forEach(rule);
  const ownProctoring = [ch("examHelp") === CUSTOM ? custom("examHelp") : [], ch("examEnd") === CUSTOM ? custom("examEnd") : []].flat();
  if (proctorItems.length || ownProctoring.length) {
    push({ t: "h2", text: "Proctoring Exams", src: "proctoring" });
    if (proctorItems.length) push({ t: "ul", src: "proctoring", items: proctorItems });
    push(...ownProctoring);
  }

  // ⋘──────── Working with students ────────⋙
  push({ t: "h2", text: "Working with Students", src: "teamExceptions" });
  const situations: string[] = [];
  switch (ch("teamExceptions")) {
    case "instructor":
      situations.push("**Extensions and other exceptions.** Only I grant exceptions, so that students are treated consistently. If a student asks you for one, be kind, and send them to the exception process in the syllabus. Please don't promise anything.");
      break;
    case "taShort":
      situations.push(`**Extensions and other exceptions.** You may grant extensions of up to ${opt("team.taExtension")} for illness or emergencies. Record each one ${logWhere}, so that we can see when a student has asked more than once. Send longer or repeated requests, and requests about exams, to me.`);
      break;
  }
  const logText: Record<string, string> = {
    spreadsheet: `**Tracking exceptions.** Every extension and other exception is recorded in ${opt("team.extensionSheet")}: the student, the assignment or exam, the new deadline, the reason, and who granted it. Check it before answering a request, and before marking work as late. It holds private information, so keep it within the team.`,
    platform: `**Tracking exceptions.** Every extension is entered on ${platformName || lms} as a new due date for the student on that assignment, so that the deadline is enforced and the work isn't marked late. Excused absences and makeup exams go to me.`,
    form: "**Tracking exceptions.** Requests from the online request form collect in a spreadsheet, with columns for the decision and who made it. Add requests that reach you another way, by email or in person, so that the list is complete.",
  };
  if (logText[ch("extensionLog")]) situations.push(logText[ch("extensionLog")]);
  const lateAddText: Record<string, string> = {
    extend: `**Students who add late.** Work that was due before a student enrolled is due ${opt("lateAdd.window")}. If a student who added late asks about it, send them to me to confirm their deadlines.`,
    excuse: "**Students who add late.** Work that was due before a student enrolled is excused. Don't grade it as missing.",
    drops: "**Students who add late.** Work that was due before a student enrolled counts as that student's dropped scores.",
  };
  if (lateAddText[ch("lateAdds")]) situations.push(lateAddText[ch("lateAdds")]);
  const switchText: Record<string, string> = {
    noSwitch: "**Section changes.** Students must attend the section they are enrolled in. Please don't make exceptions, so that sections stay within room capacity.",
    oneTime: "**Section changes.** A student who wants to attend your section once must email you first. Decide case by case, based on space in the room. Students can transfer permanently only through enrollment.",
    free: "**Section changes.** Students may attend any section with space. Record their participation and quizzes no matter which section they attend.",
  };
  if (sections && switchText[ch("switchSection")]) situations.push(switchText[ch("switchSection")]);
  situations.push(`**Accommodations.** Students arrange accommodations through the ${opt("support.drc")}, and I receive their letters. If a student asks you for an accommodation, send them to me. Don't ask students about a disability.`);
  const integrity: Record<string, string> = {
    report: `**Suspected cheating.** If you suspect cheating, including unauthorized use of AI, tell me, and include the evidence (for example, the matching submissions). Don't confront the student or change their grade: the process ${ch("integrityStyle") ? `goes through ${opt("integrity.office")}` : "is formal"}, and it protects both the student and you.`,
    discuss: "**Suspected cheating.** If you suspect cheating, you may ask the student to explain their work, without accusing them. If the explanation doesn't settle it, tell me, and include the evidence. Don't change the student's grade yourself.",
  };
  if (integrity[ch("teamIntegrity")]) situations.push(integrity[ch("teamIntegrity")]);
  if (has("struggling", "teamFlags")) situations.push(`**Students who are falling behind.** If a student stops coming to section, falls behind, or seems lost, add them to ${opt("struggle.list")}, with what you noticed. I review it each week and follow up. It holds private information, so keep it within the team.`);
  situations.push(`**Students in distress.** If a student seems to be struggling, tell them about ${opt("support.counseling")}, and let me know. If a student may be in danger, call 911.`);
  push({ t: "ul", src: "teamExceptions", items: situations });
  if (ch("teamExceptions") === CUSTOM) push(...custom("teamExceptions"));
  if (ch("teamIntegrity") === CUSTOM) push(...custom("teamIntegrity"));

  // ⋘──────── Professional conduct ────────⋙
  const conductText: Record<string, string> = {
    privacy: "**Student privacy.** Grades and other information about students stay within the teaching team. Discuss a student's grade only with that student, never with parents or other students, and never in a public place such as the forum.",
    materials: "**Course materials.** Solutions, exams, and rubrics stay within the team. Don't post them or share them with students outside the course process.",
    noAi: "**AI tools.** Don't upload student work to outside AI tools: it shares students' work without their consent and can violate privacy rules.",
    respond: "**Response times.** Reply to messages from students and the team within two business days, and check the team channel on weekdays.",
    absences: "**Absences.** If you have to miss a section or office hours, find a substitute from the team, and tell me in advance. In an emergency, tell me as soon as you can, and I will find coverage.",
    boundaries: "**Professional boundaries.** Romantic or sexual relationships with students in the course are not allowed. Be friendly but professional, including on social media, and avoid one-on-one meetings in private places.",
    reporting: `**Mandated reporting.** As university employees, team members are required to report the discrimination, harassment, and sexual violence that they learn about (Title IX). This includes what a student tells you directly and what you learn in other ways, such as from another student, from an overheard conversation, or from a student's work. If a student starts to share something like this, let them know before they go on, and point them to ${opt("support.confidential")} if they want to talk confidentially.`,
  };
  const conduct = (s.multi.teamConduct ?? []).filter(c => c in conductText);
  if (conduct.length) push({ t: "h2", text: "Professional Conduct", src: "teamConduct" }, { t: "ul", src: "teamConduct", items: conduct.map(c => conductText[c]) });

  // ⋘──────── Support ────────⋙
  const supportText: Record<string, string> = {
    training: `**Training.** If this is your first time on a teaching team, please complete ${opt("team.training")} before the term starts.`,
    observe: "**Observations.** I (or another team member) will visit one of your sections and share feedback afterward. The visit is for your development, not for evaluation.",
    feedback: "**Feedback from students.** A few weeks into the term, students fill out a short anonymous survey about sections. I will share your results with you, so that you can adjust during the term.",
    checkin: "**Check-in.** We will meet one-on-one once during the term to talk about how things are going, including your workload.",
    letters: "**Letters of recommendation.** I am happy to write letters for team members. Ask me at least a month before the deadline.",
  };
  const support = (s.multi.teamSupport ?? []).filter(x => x in supportText);
  push({ t: "h2", text: "Support for the Team", src: "teamSupport" });
  if (support.length) push({ t: "ul", src: "teamSupport", items: support.map(x => supportText[x]) });
  push(p(`If anything is going wrong, whether with a student, with grading, or with your workload, please tell me early. Problems are much easier to fix in week 2 than in week 8. You can reach me at ${email}${ch("teamChannel") === "chat" ? ` or in ${chat}` : ""}.`, "teamSupport"));

  // ⋘──────── Opportunities ────────⋙
  const opportunityText: Record<string, string> = {
    lecture: "**Give a lecture.** If you would like to teach a class meeting, tell me by week 3. We will choose a topic together, I will help you prepare, and we will meet afterward to talk about how it went. Preparation counts toward your hours.",
    examProblems: "**Write exam problems.** Propose problems for the exams, and I will choose and edit them. Keep every proposed problem private, whether or not it is used.",
    review: "**Lead a review session.** Before each exam, a team member may lead an optional review session for students. Tell me if you are interested, and we will plan it together.",
  };
  const opportunities = (s.multi.teamOpportunities ?? []).filter(x => x in opportunityText).map(x => opportunityText[x]);
  if (has("teamOpportunities", CUSTOM)) {
    const own = raw("teamOpportunities.custom").split("\n").map(l => l.trim().replace(/^[-*•]\s+/, "")).filter(Boolean);
    opportunities.push(...(own.length ? own : ["{{Your own opportunity}}"]));
  }
  if (opportunities.length) {
    push(
      { t: "h2", text: "Opportunities to Teach", src: "teamOpportunities" },
      p("If you want more teaching experience, for your own development or for job applications, these opportunities are open to everyone on the team:", "teamOpportunities"),
      { t: "ul", src: "teamOpportunities", items: opportunities },
    );
  }

  return blocks;
}
