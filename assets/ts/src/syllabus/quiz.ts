// ╭───────────────────────────────────────────────────────────────╮
// │      Syllabus designer: the syllabus quiz                     │
// ╰───────────────────────────────────────────────────────────────╯
// A third document: a short multiple-choice quiz on the policies in the student syllabus, with an
// answer key. Each question is written from one answer, so the quiz covers only the policies that
// the syllabus states, and its answers match the syllabus.

import { State, activeWeights } from "./generate";
import { Block, esc } from "./markup";
import { reader } from "./read";

interface QuizQuestion {
  text: string;
  correct: string;
  wrong: string[];
  src: string;          // The question (in the designer) that the policy comes from
  where: string;        // The part of the syllabus with the answer
}

const LETTERS = "ABCDE";

export function generateQuiz(s: State): Block[] {
  const { ch, has, val, v, opt, pct, orList, checked } = reader(s);
  const code = v("course.code", "Course number");
  const term = v("course.term", "Term");
  const lms = v("course.lms", "Course website");
  const ohLabel = ch("ohName") === "student" ? "student hours" : "office hours";
  const subjectCode = val("course.code") ? esc(val("course.code")) : "{{Course number}}";
  const n = (id: string) => Number(val(id)) || 0;
  const qs: QuizQuestion[] = [];
  const add = (q: QuizQuestion) => qs.push(q);
  const TRUE_FALSE = (statement: string, isTrue: boolean, src: string, where: string) =>
    add({ text: `True or false: ${statement}`, correct: isTrue ? "True" : "False", wrong: [isTrue ? "False" : "True"], src, where });

  // Grading
  const weights = activeWeights(s);
  if (weights.length && ch("approach") !== "specs" && ch("approach") !== "standards") {
    const big = [...weights].sort((a, b) => b.weight - a.weight)[0];
    const others = [big.weight - 15, big.weight + 15, Math.round(big.weight / 10) * 5, big.weight + 10].filter(x => x > 0 && x <= 100 && x !== big.weight);
    add({ text: `What percent of your final grade comes from ${esc(big.label.toLowerCase())}?`, correct: `${big.weight}%`, wrong: [...new Set(others)].slice(0, 3).map(x => `${x}%`), src: "weights", where: "Grading Policy" });
  }
  if (ch("passGate") === "kOfN") {
    add({
      text: "Which of these is required to pass the class?",
      correct: `Scoring ${pct("gate.pct")} or better on at least ${opt("gate.k")} of the ${opt("gate.n")} exams`,
      wrong: ["Attending every lecture", "A total score of at least 50%, no matter how you do on the exams", "Submitting every homework assignment"],
      src: "passGate", where: "Grading Policy",
    });
  } else if (ch("passGate") === "final") {
    add({ text: "Which of these is required to pass the class?", correct: `Scoring ${pct("gate.finalPct")} or better on the final exam`, wrong: ["Attending every lecture", "Submitting every homework assignment", "Nothing beyond a passing total score"], src: "passGate", where: "Grading Policy" });
  }

  // Attendance
  if (ch("attendance") === "graded") {
    const k = n("att.drops");
    add({ text: "How many classes can you miss without losing participation points?", correct: String(k), wrong: [String(k === 0 ? 1 : 0), String(k + 2), "As many as you like, as long as you watch the recordings"], src: "attendance", where: "Attendance Policy" });
  } else if (ch("attendance") === "penalty") {
    const k = n("att.allowed");
    add({ text: "How many unexcused absences are allowed before your grade is lowered?", correct: String(k), wrong: [String(k === 0 ? 1 : 0), String(k + 2), "Unlimited"], src: "attendance", where: "Attendance Policy" });
  }
  if (ch("switchSection") === "oneTime") {
    add({ text: "You need to attend a different discussion section one week. What should you do?", correct: "Email the TA of the section you want to attend, before you go", wrong: ["Just go; any section is fine", "Nothing; you may not attend another section for any reason", "Ask a classmate in that section to save you a seat"], src: "switchSection", where: "Attendance Policy" });
  } else if (ch("switchSection") === "noSwitch") {
    TRUE_FALSE("You may attend a different discussion section whenever it fits your schedule better.", false, "switchSection", "Attendance Policy");
  }

  // Deadlines and late work
  const dueText: Record<string, string> = { midnight: "11:59 pm", evening: opt("due.time"), beforeClass: "At the start of class" };
  if (dueText[ch("dueTime")]) {
    add({ text: "Unless an assignment says otherwise, when is it due on its due date?", correct: dueText[ch("dueTime")], wrong: ["11:59 pm", "At the start of class", "Noon", "8:00 am"].filter(x => x !== dueText[ch("dueTime")]).slice(0, 3), src: "dueTime", where: "Weekly Rhythm" });
  }
  switch (ch("late")) {
    case "penalty":
      add({ text: "An assignment is due Friday at 11:59 pm, and you submit it Saturday morning. What happens?", correct: checked("late.cap") ? `The highest score you can earn is lowered by ${pct("late.pct")}` : `You lose ${pct("late.pct")} of the possible points`, wrong: ["Nothing; there is a grace period", "It receives a zero", checked("late.cap") ? `You lose ${pct("late.pct")} of your score, whatever it is` : "You lose half of the points"], src: "late", where: "Late Policy" });
      break;
    case "tokens":
      add({ text: "How many late days do you have for the whole term?", correct: String(n("late.tokens")), wrong: [String(n("late.tokens") + 2), "One per assignment", "None"], src: "late", where: "Late Policy" });
      break;
    case "none":
      TRUE_FALSE("Late work is accepted with a small penalty.", false, "late", "Late Policy");
      break;
    case "flexible":
      add({ text: "Until when is late work accepted without penalty?", correct: opt("late.final"), wrong: ["One day after the deadline", "Late work is not accepted", "One week after the deadline"], src: "late", where: "Late Policy" });
      break;
  }
  const how: Record<string, string> = {
    subject: `Email the instructor with the subject line “${subjectCode} - ${v("exc.subject", "Subject")}”`,
    form: "Submit the exception request form",
    dean: "Email the instructor (or, for absences longer than a week, contact the Dean of Students)",
  };
  if (how[ch("exceptions")]) {
    add({ text: "You are sick and need an extension. How do you ask for one?", correct: how[ch("exceptions")], wrong: ["Post on the discussion forum", "Ask a classmate to tell the instructor", "Wait until the end of the term and explain then"], src: "exceptions", where: "Communication" });
  }

  // Asking questions
  const where = s.multi.contentQuestions ?? [];
  if (where.length) {
    const place: Record<string, string> = { class: "in class", section: "in discussion section", officeHours: `in ${ohLabel}`, forum: `on ${opt("contact.forum")}`, email: "by email" };
    const answer = orList(where.map(w => place[w]).filter(Boolean));
    const wrongPlaces = [...(has("contentNot", "email") ? ["By email to the instructor"] : []), ...(has("contentNot", "lms") ? [`Through ${lms} messages`] : []), "In a comment on your homework submission", "On social media"];
    add({ text: "Where should you ask questions about the course material?", correct: answer.charAt(0).toUpperCase() + answer.slice(1), wrong: wrongPlaces.slice(0, 3), src: "contentQuestions", where: "Communication" });
  }

  // Integrity and AI
  switch (ch("collaboration")) {
    case "discuss": TRUE_FALSE("You may discuss homework problems with classmates, but you must write your own solutions.", true, "collaboration", "Academic Integrity"); break;
    case "individual": TRUE_FALSE("You may work on homework together with a classmate.", false, "collaboration", "Academic Integrity"); break;
    case "groups": add({ text: "How is homework done?", correct: `In groups of ${opt("collab.size")}, with one submission per group`, wrong: ["Individually, with no discussion", "With anyone you like, each submitting their own", "In groups chosen each week"], src: "collaboration", where: "Academic Integrity" }); break;
  }
  switch (ch("ai")) {
    case "learning": TRUE_FALSE("You may ask an AI tool to solve an assigned problem, as long as you rewrite its answer in your own words.", false, "ai", "Use of Generative AI"); break;
    case "prohibited": TRUE_FALSE("You may use AI tools such as ChatGPT on homework if you check their answers.", false, "ai", "Use of Generative AI"); break;
    case "disclose": add({ text: "If you use an AI tool on homework, what must you do?", correct: "Say which tools you used and how, in a short statement at the end of the assignment", wrong: ["Nothing; AI tools are allowed without restriction", "Get permission from the instructor first", "Nothing; AI tools are not allowed"], src: "ai", where: "Use of Generative AI" }); break;
    case "integrated": TRUE_FALSE("AI tools are allowed on exams.", false, "ai", "Use of Generative AI"); break;
  }

  // Exams
  const aids: Record<string, string> = { closed: "Nothing: exams are closed book and closed notes", sheet: `Handwritten notes (${opt("exam.sheet")})`, open: "Your book and notes" };
  if (aids[ch("examAids")]) {
    add({ text: "What may you bring to an exam?", correct: aids[ch("examAids")], wrong: Object.entries(aids).filter(([k]) => k !== ch("examAids")).map(([, t]) => t).concat(["Your phone, for a calculator"]).slice(0, 3), src: "examAids", where: "Exams" });
  }
  const missed: Record<string, string> = {
    makeup: "Contact the instructor as soon as possible, before the exam if you can, to arrange a makeup exam",
    shift: `${checked("exc.docs") ? "Provide documentation; t" : "T"}he weight of the exam moves to the final exam`,
    zero: "Arrange an alternative with the instructor before the exam; otherwise it receives a zero",
  };
  if (missed[ch("missedExam")]) {
    add({ text: "What happens if you miss an exam because of an illness?", correct: missed[ch("missedExam")], wrong: ["Your lowest homework score replaces it", "Nothing; the exam is dropped automatically", "You take it the following week without notice"], src: "missedExam", where: "Exams" });
  }

  // Grades and feedback
  if (ch("regrades") && ch("regradeDeadline") !== "none") {
    const window = ch("regradeDeadline") === "window" ? opt("regrade.window") : "one week";
    const correct = ch("regradeDeadline") === "beforeFinal" ? `By ${opt("regrade.final")}` : `${window.charAt(0).toUpperCase()}${window.slice(1)} after grades are released`;
    const wrong = ch("regradeDeadline") === "beforeFinal" ? ["One week after grades are released", "24 hours after grades are released", "Regrades are not allowed"] : ["Until the end of the term", "24 hours", "Regrades are not allowed"];
    add({ text: "How long do you have to request a regrade?", correct, wrong, src: "regradeDeadline", where: "Feedback and Regrades" });
  }
  if (ch("dropLowest") === "drop" && n("drop.quiz") && ch("quizzes") !== "none") {
    add({ text: "How many of your quiz scores are dropped?", correct: String(n("drop.quiz")), wrong: [String(n("drop.quiz") + 1), String(n("drop.quiz") + 2), "None"].filter(x => x !== "0"), src: "dropLowest", where: "Grading Policy" });
  }
  if (ch("extraCredit") === "none") TRUE_FALSE("You can raise your grade at the end of the term with an extra credit project.", false, "extraCredit", "Extra Credit");
  if (ch("electronics") === "notes") TRUE_FALSE("You may use your laptop in class to check email, as long as you are quiet.", false, "electronics", "How to Behave in Class");
  if (has("statements", "accommodations")) {
    add({ text: "You have a disability that affects your exams. Whom should you contact first?", correct: `The ${opt("support.drc")}`, wrong: ["Your TA, during the exam", "Nobody; accommodations are automatic", "The registrar"], src: "statements", where: "Disability Accommodations" });
  }

  // ⋘──────── Document ────────⋙
  const blocks: Block[] = [{ t: "h1", text: `${code} Syllabus Quiz (${term})`, src: "syllabusQuiz" }];
  blocks.push({ t: "p", src: "syllabusQuiz", text: `This quiz checks that you know the course policies that affect your grade. Answer each question using the syllabus. Complete it on ${lms} by ${opt("quiz.due")}.` });
  if (!qs.length) {
    blocks.push({ t: "p", src: "syllabusQuiz", text: "{{Answer the questions about your policies, and quiz questions will appear here}}" });
    return blocks;
  }
  const key: string[][] = [];
  qs.forEach((q, i) => {
    // The correct answer moves around, so that it isn't always first. True or false keeps its order.
    const choices = q.correct === "True" || q.correct === "False"
      ? ["True", "False"]
      : (() => { const c = [...q.wrong.slice(0, 3)]; c.splice(i % (c.length + 1), 0, q.correct); return c; })();
    const letter = LETTERS[choices.indexOf(q.correct)];
    blocks.push(
      { t: "p", src: q.src, text: `**${i + 1}.** ${q.text}` },
      { t: "ul", src: q.src, items: choices.map((c, j) => `${LETTERS[j]}. ${c}`) },
    );
    key.push([String(i + 1), `${letter}. ${q.correct}`, q.where]);
  });
  blocks.push(
    { t: "h2", text: "Answer Key", src: "syllabusQuiz" },
    { t: "p", text: "For the instructor. Remove this section before giving the quiz to students.", src: "syllabusQuiz" },
    { t: "table", src: "syllabusQuiz", head: ["Question", "Answer", "Where in the syllabus"], rows: key },
  );
  return blocks;
}
