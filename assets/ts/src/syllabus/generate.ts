// ╭───────────────────────────────────────────────────────────────╮
// │        Syllabus designer: writing the syllabus from choices   │
// ╰───────────────────────────────────────────────────────────────╯
// `generate` turns the instructor's answers into blocks of syllabus text (see markup.ts). Every
// block records the question it comes from (`src`), so the page can scroll the preview to the text
// that a change affects. The text is written in the instructor's voice and follows the structure of
// the AM 10 syllabus that the tool is modeled on: welcome, basics, expectations, grading,
// schedule, resources, and FAQs.

import { Block, Item, esc, textBlocks } from "./markup";
import { CUSTOM, FIELD_BY_ID, ScaleRow, WeightRow } from "./questions";
import { dateKey, formatDate, formatDateSpec } from "./dates";
import { WEEKDAYS, reader } from "./read";

export interface State {
  choice: Record<string, string>;     // Single-choice question id → option id
  multi: Record<string, string[]>;    // Multi-choice question id → option ids
  field: Record<string, string>;      // Field id → value ("1" for a checked checkbox)
  weights: WeightRow[];
  scale: ScaleRow[];
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// Month and day of a date written like "October 14", "Wed Oct 7", or "10/14", for sorting.
function monthDay(text: string): number | null {
  const named = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})\b/i.exec(text);
  if (named) return (MONTHS.indexOf(named[1].toLowerCase()) + 1) * 100 + Number(named[2]);
  const numeric = /\b(\d{1,2})\/(\d{1,2})\b/.exec(text);
  if (numeric) return Number(numeric[1]) * 100 + Number(numeric[2]);
  return null;
}

// "10%" → "20%" for two days of a per-day penalty, when the penalty is a plain percentage.
function times(pct: string, n: number): string | null {
  const m = /^(\d+(?:\.\d+)?)\s*%?$/.exec(pct.trim());
  return m ? `${Number(m[1]) * n}%` : null;
}

// The grade components that count: those with weight, leaving out quizzes when the course has none.
export function activeWeights(s: State): WeightRow[] {
  return s.weights.filter(w => w.weight > 0 && !(w.kind === "quizzes" && s.choice.quizzes === "none"));
}

export function generate(s: State): Block[] {
  // ⋘──────── Reading answers ────────⋙
  const ch = (q: string) => s.choice[q];
  const has = (q: string, o: string) => (s.multi[q] ?? []).includes(o);
  const raw = (id: string) => (s.field[id] ?? "").trim();
  const val = (id: string) => raw(id) || FIELD_BY_ID.get(id)?.defaultValue || "";
  // A field's value as inline text, or a highlighted placeholder if it is empty.
  const v = (id: string, placeholder: string) => (val(id) ? esc(val(id)) : `{{${placeholder}}}`);
  const opt = (id: string) => esc(val(id));
  const checked = (id: string) => raw(id) === "1";
  const { pct, meetings } = reader(s);
  const rows = (id: string) => val(id).split("\n").map(l => l.trim()).filter(Boolean).map(l => l.split("|").map(c => c.trim()));
  const custom = (q: string): Block[] => {
    const text = raw(`${q}.custom`);
    return text ? textBlocks(text, q) : [{ t: "p", text: "{{Write your own text for this section}}", src: q }];
  };
  const p = (text: string, src?: string): Block => ({ t: "p", text, src });
  const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

  // ⋘──────── Common phrases ────────⋙
  const code = v("course.code", "Course number");
  const title = v("course.title", "Course title");
  const term = v("course.term", "Term");
  const lms = v("course.lms", "Course website");
  const name = v("inst.name", "Instructor name");
  const email = v("inst.email", "Email");
  const studentHours = ch("ohName") === "student";
  const ohLabel = studentHours ? "student hours" : "office hours";
  const OhLabel = studentHours ? "Student hours" : "Office hours";
  const sections = ch("discussion") === "required" || ch("discussion") === "optional";
  // Text that links to a page when the instructor gave its address.
  // Text that is already a link (written as a Markdown link) stays as it is.
  const linkTo = (text: string, id: string) => (/^https?:\/\//i.test(raw(id)) && !/\]\(/.test(text) ? `[${text}](${raw(id)})` : text);
  const forum = has("contentQuestions", "forum") ? linkTo(opt("contact.forum"), "contact.forumLink") : "";
  const ohRef = linkTo(ohLabel, "inst.ohLink");
  const tutoring = linkTo(opt("support.tutoring"), "support.tutoringLink");
  const attendanceDrops = Number(val("att.drops")) || 0;
  const dropping = ch("dropLowest") === "drop";
  const quizDrops = dropping && ch("quizzes") !== "none" ? Number(val("drop.quiz")) || 0 : 0;
  const hwDrops = dropping ? Number(val("drop.hw")) || 0 : 0;
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : word.endsWith("quiz") ? "zes" : /(s|ch|sh|x)$/.test(word) ? "es" : "s"}`;
  // "Your lowest quiz score is" or "Your 2 lowest quiz scores are"
  const lowest = (n: number, noun: string) => (n === 1 ? `Your lowest ${noun} is` : `Your ${n} lowest ${noun}s are`);
  const orList = (items: string[]) => (items.length <= 2 ? items.join(" or ") : `${items.slice(0, -1).join(", ")}, or ${items[items.length - 1]}`);
  const purposes = (s.multi.helpPurposes ?? []).filter(x => x !== "none");
  const sectionQuiz = ch("quizzes") === "section" || (ch("quizzes") === "highStakes" && /section/i.test(val("quiz.where")));
  const quizVersions = sectionQuiz && checked("team.quizVersions");
  const postNotes = sections && checked("team.postNotes");
  // Dates, in one format throughout ("Wednesday, October 21").
  const day = (spec: string) => formatDateSpec(spec) ?? esc(spec);
  const finalExam = raw("course.finalDate")
    ? `${day(raw("course.finalDate"))}${raw("course.finalTime") ? `, ${esc(raw("course.finalTime"))}` : ""}`
    : raw("course.final") ? esc(raw("course.final")) : "";
  const midterms = raw("exam.dates").split(/[;\n]/).map(d => d.trim()).filter(Boolean);
  const midtermText = midterms.map(day).join(" and ");
  const subjectCode = val("course.code") ? esc(val("course.code")) : "{{Course number}}";

  // Documentation is mentioned only when the course requires it (some universities don't allow it).
  const illness = checked("exc.docs") ? "a documented illness or emergency" : "an illness or emergency";
  const exceptionHow = (() => {
    const docs = checked("exc.docs") ? " Please include documentation, such as a note from a medical provider." : "";
    switch (ch("exceptions")) {
      case "subject": return `email me with the subject line “${subjectCode} - ${v("exc.subject", "Subject")}” and describe the reason in the body.${docs}`;
      case "form": return `submit the ${raw("exc.form") ? `[exception request form](${raw("exc.form")})` : "{{exception request form link}}"}.${docs}`;
      case "dean": return `email me. For absences longer than a week, contact ${opt("exc.dean")}, who will notify all of your instructors.${docs}`;
      default: return `email me at ${email}.${docs}`;
    }
  })();

  const blocks: Block[] = [];
  const push = (...b: Block[]) => blocks.push(...b);

  push({ t: "h1", text: `${code} — ${title} (${term})`, src: "course" });

  // ⋘──────── Welcome ────────⋙
  switch (ch("welcome")) {
    case "letter":
      push(
        p(`Welcome to ${code}! My teaching team and I are excited to start the term with you. I have done my best to design this course to be useful, interesting, and (hopefully) even fun, so that you will be well equipped to use what you learn here in your later courses and career.`, "welcome"),
        p("This course is challenging, and there will likely be times when you feel frustrated. Although it might feel like you are stuck at these points, research shows that when learning feels most difficult is often when you are learning the most. Please stick with it, and know that you are not alone. My teaching team and I are here to help you, along with many services across campus. If you ever feel that you are not achieving your learning goals, please contact me or a TA so that we can help.", "welcome"),
        p("Best,", "welcome"),
        { t: "p", text: name, src: "welcome", indent: true },
      );
      break;
    case "overview":
      push(...(raw("welcome.overview") ? textBlocks(raw("welcome.overview"), "welcome") : [p("{{Course overview}}", "welcome")]));
      break;
    case CUSTOM:
      push(...custom("welcome"));
      break;
  }

  if (ch("guide") === "yes") {
    const careful: string[] = [];
    if (ch("attendance")) careful.push("Attendance Policy");
    if (ch("integrityStyle")) careful.push("Academic Integrity");
    if (ch("ai")) careful.push("Use of Generative AI");
    if (ch("textbook") || ch("software") || ch("calculators")) careful.push("Required Materials");
    push(
      p("The rest of this page contains important information about the class. Here is a quick guide to where to direct your attention:", "guide"),
      {
        t: "ul", src: "guide", items: [
          "**The Basics**: Skim this section. Most of it is standard information you would find in the course catalog.",
          careful.length
            ? { text: "**Course Expectations**: Read carefully, especially these sections:", items: careful }
            : "**Course Expectations**: Read carefully.",
          "**Grading Policy**: Read carefully, so that you understand how your final grade is determined.",
          purposes.length
            ? "**Resources to Help You Succeed**: Read the first part, which says what each kind of help is for, and skim the rest."
            : "**Resources to Help You Succeed**: Skim this section to see what resources are available.",
          ...(s.multi.faqs?.length ? ["**Frequently Asked Questions**: Look here if you have a specific question."] : []),
        ],
      },
    );
  }

  // ⋘──────── The basics ────────⋙
  push({ t: "h2", text: "The Basics" });

  const sessionRows: [string, Block[]][] = [
    ["Days and times", [p(meetings(), "course")]],
    ["Location", [p(v("course.location", "Location"), "course")]],
  ];
  if (sections) {
    const kind = ch("discussion") === "required" ? "Required" : "Optional";
    const discussionBlocks = [p(`${kind}. ${v("sec.when", "Section times and places")}`, "discussion")];
    const timingText: Record<string, string> = {
      beforeHw: "Sections meet before the homework is due, so start the homework early and bring your questions to section.",
      afterHw: "Sections meet after the homework is due and go over it, so try every problem before your section.",
    };
    if (timingText[ch("sectionTiming")]) discussionBlocks.push(p(timingText[ch("sectionTiming")], "sectionTiming"));
    if (postNotes) discussionBlocks.push(p(`Section worksheets and solutions are posted on ${lms} after the last section each week.`, "sectionPrep"));
    sessionRows.push(["Discussion sections", discussionBlocks]);
  }
  const formatText: Record<string, string> = {
    lecture: "Lectures, in which I present new material and work through examples.",
    active: "Lectures with active learning: short explanations alternate with polls and problems that you work on with your classmates.",
    flipped: "Flipped: before class, you watch short videos or read; class time is spent solving problems together, with help from me and the TAs.",
  };
  if (ch("format") === CUSTOM) sessionRows.push(["Format", custom("format")]);
  else if (ch("format")) sessionRows.push(["Format", [p(formatText[ch("format")], "format")]]);
  const recordingText: Record<string, string> = {
    posted: `Lectures are recorded and posted on ${lms}. The recordings are a backup for when you miss class or want to review, not a replacement for attending.`,
    request: "Lectures are recorded. Recordings are shared with students who have an excused absence or an accommodation.",
    none: "Lectures are not recorded.",
  };
  if (ch("recordings")) sessionRows.push(["Recordings", [p(recordingText[ch("recordings")], "recordings")]]);
  push({ t: "h3", text: "Class Sessions", src: "course" }, { t: "kv", rows: sessionRows, src: "course" });

  // Instructor
  const pronouns = raw("inst.pronouns") ? ` (${esc(raw("inst.pronouns"))})` : "";
  const nameBlocks: Block[] = [p(`${name}${pronouns}`, "instructor")];
  if (raw("inst.address")) nameBlocks.push(p(`You may address me as ${esc(raw("inst.address"))} (whichever you are most comfortable with).`, "instructor"));
  const ohBlocks: Block[] = [];
  const oh = v("inst.oh", "Office hours times and place");
  switch (ch("officeHours")) {
    case "fixed": ohBlocks.push(p(`${oh}.`, "officeHours")); break;
    case "fixedPlus": ohBlocks.push(p(`${oh}.`, "officeHours"), p(`If you are unable or uncomfortable attending my regular ${ohLabel}, email me, and we can set up a one-on-one meeting.`, "officeHours")); break;
    case "appointment": ohBlocks.push(p("By appointment. Email me to set up a meeting.", "officeHours")); break;
    default: ohBlocks.push(p(oh, "instructor"));
  }
  if (studentHours && !purposes.includes("officeHours")) ohBlocks.push(p("Student hours are time set aside for you. Come with questions about the material, the homework, or anything else about the course or your studies. No appointment is needed, and you are welcome to just listen to other students' questions.", "ohName"));
  const instRows: [string, Block[]][] = [
    ["Name", nameBlocks],
    ["Contact", [p(email, "instructor")]],
    [OhLabel, raw("inst.ohLink") ? [...ohBlocks, p(`See the ${linkTo(`${ohLabel} page`, "inst.ohLink")} for the times and places of ${ohLabel} for the whole teaching team.`, "officeHours")] : ohBlocks],
  ];
  if (raw("inst.website")) instRows.push(["Website", [p(esc(raw("inst.website")), "instructor")]]);
  push({ t: "h3", text: "Instructor", src: "instructor" }, { t: "kv", rows: instRows, src: "instructor" });

  const team = rows("inst.team");
  if (team.length) {
    push({ t: "h3", text: "Teaching Team", src: "instructor" }, {
      t: "table", src: "instructor", head: ["Teaching Assistant", "Email", "Section"],
      rows: team.map(r => [esc(r[0] ?? ""), esc(r[1] ?? ""), esc(r[2] ?? "")]),
    });
  }

  // Course information
  const infoRows: [string, Block[]][] = [
    ["Course number", [p(code, "course")]],
    ["Term", [p(term, "course")]],
  ];
  const start = formatDate(raw("course.start"));
  const end = formatDate(raw("course.end"), true);
  if (start || end) infoRows.push(["Dates", [p(`${start ?? "{{First day}}"} – ${end ?? "{{Last day}}"}`, "course")]]);
  else if (raw("course.dates")) infoRows.push(["Dates", [p(esc(raw("course.dates")), "course")]]);
  infoRows.push(["Units", [p(v("course.units", "Units"), "course")]]);
  if (raw("course.prereqs")) infoRows.push(["Prerequisites", [p(esc(raw("course.prereqs")), "course")]]);
  infoRows.push(["Description", raw("course.description") ? textBlocks(esc(raw("course.description")), "course") : [p("{{Catalog description}}", "course")]]);
  infoRows.push(["Course website", [p(lms, "course")]]);
  push({ t: "h3", text: "Course Information", src: "course" }, { t: "kv", rows: infoRows, src: "course" });

  const outcomes = raw("course.outcomes").split("\n").map(l => l.trim().replace(/^[-*•]\s+/, "")).filter(Boolean);
  if (outcomes.length) {
    push(
      { t: "h3", text: "Learning Outcomes", src: "course" },
      p("By the end of this course, you will be able to", "course"),
      { t: "ul", items: outcomes.map(esc), src: "course" },
    );
  }

  // Important dates
  // Each row: [date as entered, date as written, event].
  const entered: [string, string, string][] = rows("dates.list").map(r => [r[0] ?? "", day(r[0] ?? ""), esc(r.slice(1).join(" | "))]);
  // The first and last days of instruction, unless the list already has an event about
  // instruction on that date.
  for (const [id, label] of [["course.start", "First day of instruction"], ["course.end", "Last day of instruction"]]) {
    const d = raw(id);
    if (dateKey(d) && !entered.some(r => dateKey(r[0]) === d && /instruction|classes/i.test(r[2]))) entered.push([d, day(d), label]);
  }
  midterms.forEach((d, i) => entered.push([d, day(d), midterms.length > 1 ? `Midterm exam ${i + 1}` : "Midterm exam"]));
  // Assignments: "available..deadline" or just the deadline.
  for (const r of rows("schedule.major")) {
    const [a = "", b = ""] = (r[0] ?? "").split("..");
    const [deadline, available] = b ? [b, a] : [a, ""];
    const from = available ? formatDate(available) : null;
    entered.push([deadline, day(deadline), `${esc(r.slice(1).join(" | "))} due${from ? ` (available from ${from})` : ""}`]);
  }
  if (finalExam) entered.push([raw("course.finalDate") || raw("course.final"), finalExam, "Final exam"]);
  if (entered.every(r => dateKey(r[0]))) entered.sort((a, b) => dateKey(a[0])!.localeCompare(dateKey(b[0])!));
  const dateRows: string[][] = entered.map(r => [r[1], r[2]]);
  if (dateRows.length && !entered.every(r => dateKey(r[0]))) {
    // Dates typed as text (saved before the date pickers): sort by month and day.
    const keys = dateRows.map(r => monthDay(r[0]));
    if (keys.every(k => k !== null)) {
      // Terms that run from fall into January sort January after December.
      const fall = keys.some(k => k! >= 800);
      const order = (k: number) => (fall && k < 300 ? k + 1200 : k);
      const sorted = dateRows.map((r, i) => ({ r, k: order(keys[i]!) })).sort((a, b) => a.k - b.k);
      dateRows.splice(0, dateRows.length, ...sorted.map(x => x.r));
    }
  }
  if (dateRows.length) {
    push({ t: "h3", text: "Important Dates", src: "dates" }, { t: "table", head: ["Date", "Event"], rows: dateRows, src: "dates" });
  }

  // ⋘──────── Expectations ────────⋙
  push({ t: "h2", text: "Course Expectations" });
  push(p("This class requires participation in class and work outside of class to study and complete assignments.", "course"));
  if (ch("workload") !== "none" && (raw("course.hours") || ch("workload") === "totalOnly")) {
    push({ t: "ul", items: [`**You should be prepared to spend ${v("course.hours", "Hours")} hours per week on this class.**`], src: ch("workload") ? "workload" : "course" });
  }
  if (ch("workload") === "table") {
    const acts = rows("time.list");
    // Hours like "3" or "2–3"; the total is shown when every row has hours.
    const ranges = acts.map(r => /^(\d+(?:\.\d+)?)(?:\s*[–-]\s*(\d+(?:\.\d+)?))?$/.exec(r[1] ?? ""));
    const notes = acts.some(r => r.slice(2).join("").trim());
    const tableRows = acts.map(r => [esc(r[0] ?? ""), esc(r[1] ?? ""), ...(notes ? [esc(r.slice(2).join(" | "))] : [])]);
    if (acts.length && ranges.every(Boolean)) {
      const round = (x: number) => String(Number(x.toFixed(2)));
      const lo = ranges.reduce((sum, m) => sum + Number(m![1]), 0);
      const hi = ranges.reduce((sum, m) => sum + Number(m![2] ?? m![1]), 0);
      tableRows.push(["**Total**", `**${lo === hi ? round(lo) : `${round(lo)}–${round(hi)}`}**`, ...(notes ? [""] : [])]);
    }
    push(
      p(raw("course.hours") ? "In a typical week, that time breaks down roughly as follows. Some weeks, and some students, will need more or less." : "In a typical week, expect to spend your time roughly as follows. Some weeks, and some students, will need more or less.", "workload"),
      { t: "table", src: "workload", head: ["Activity", "Hours per week", ...(notes ? ["Notes"] : [])], rows: tableRows.length ? tableRows : [["{{Activity}}", "{{Hours}}"]] },
    );
  } else if (ch("workload") === CUSTOM) push(...custom("workload"));

  // Weekly rhythm and due times
  const cadence = rows("cadence.list");
  const dueText: Record<string, string> = {
    midnight: "Unless stated otherwise, assignments are due at 11:59 pm on their due dates.",
    evening: `Unless stated otherwise, assignments are due at ${opt("due.time")} on their due dates, so that you can still get help from the teaching team before the deadline.`,
    beforeClass: "Unless stated otherwise, assignments are due at the start of class on their due dates.",
  };
  const DAYS: Record<string, string> = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", sunday: "Sunday" };
  const hwTime: Record<string, string> = { midnight: " at 11:59 pm", evening: ` at ${opt("due.time")}`, beforeClass: " at the start of class" };
  if (ch("cadence") || cadence.length || ch("dueTime") || ch("hwDay")) {
    push({ t: "h3", text: "Weekly Rhythm", src: "cadence" });
    const table: Block = {
      t: "table", src: "cadence", head: ["When", "What"],
      rows: cadence.length ? cadence.map(r => [esc(r[0] ?? ""), esc(r.slice(1).join(" | "))]) : [["{{Day}}", "{{What happens}}"]],
    };
    if (ch("cadence") === "fixed") push(p("Each week of the course follows the same rhythm:", "cadence"), table);
    else if (ch("cadence") === "varies") {
      push(p(`The work for each week varies, so check the schedule on ${lms} at the start of each week.`, "cadence"));
      if (cadence.length) push(p("A typical week looks like this:", "cadence"), table);
    } else if (cadence.length) push(table);
    if (DAYS[ch("hwDay")]) push(p(`Homework is due every ${DAYS[ch("hwDay")]}${hwTime[ch("dueTime")] ?? ""}. If a due date falls on a holiday, the homework is due on the next day that classes meet.`, "hwDay"));
    else if (ch("hwDay") === "varies") push(p(`Homework due dates vary from week to week, so check each assignment's due date on ${lms}.`, "hwDay"));
    if (ch("dueTime") === CUSTOM) push(...custom("dueTime"));
    else if (ch("dueTime")) push(p(dueText[ch("dueTime")], "dueTime"));
  }

  // Course website, submitting work, and grades
  const platform = opt("regrade.platform");
  const platformRef = linkTo(platform, "grading.link");
  const uses = s.multi.lmsUses ?? [];
  const useText: Record<string, string> = {
    announcements: "announcements (please turn on notifications, so that you don't miss them)",
    materials: "notes, slides, and readings",
    calendar: "the calendar of due dates",
    submissions: "assignment submissions",
    grades: "your scores",
    recordings: "lecture recordings",
  };
  const late = ch("late") === "penalty" || ch("late") === "tokens";
  const siteItems: Item[] = [];
  const useItems = uses.filter(u => u in useText).map(u => useText[u].charAt(0).toUpperCase() + useText[u].slice(1));
  if (useItems.length) siteItems.push({ text: `**${lms}** has`, items: useItems });
  switch (ch("submitPlatform")) {
    case "lms": siteItems.push(`**Submitting work:** Submit written work on ${lms}.`); break;
    case "gradescope":
      siteItems.push(`**Submitting work:** Submit written work on ${platformRef}. When you upload, match each page to the question it answers; work on unmatched pages may not be graded. Scores are posted to ${lms} after grading.`);
      if (ch("gsExtensions") === "noDates") siteItems.push(`**Due dates and extensions** for work submitted on ${platform} are listed on ${platform}.`);
      if (ch("gsExtensions") === "flags") siteItems.push(`**Extensions** are recorded on ${platform}. ${lms} may show work that you submitted on ${platform} with an extension as late or missing; you can ignore those flags.`);
      if (late && ch("gsPenalty") === "copyDays") siteItems.push(`**Late penalties** are applied on ${lms} after scores are posted, so the score for a late submission may drop after it first appears on ${lms}.`);
      if (late && ch("gsPenalty") === "endOfTerm") siteItems.push("**Late penalties** are applied at the end of the term, so your scores during the term don't include them.");
      break;
    case "paper": siteItems.push("**Submitting work:** Turn in written work on paper at the start of class. Graded work is returned in class."); break;
  }
  const notApplied: string[] = [];
  if (ch("passGate") === "kOfN" || ch("passGate") === "final") notApplied.push("the minimum exam scores needed to pass");
  if (ch("secondChance") === "replace") notApplied.push("the final exam replacing your lowest midterm");
  if (late && ch("submitPlatform") === "gradescope" && ch("gsPenalty") === "endOfTerm") notApplied.push("late penalties");
  if (ch("approach") === "curve") notApplied.push("the curve");
  switch (ch("gradebook")) {
    case "official": siteItems.push(`**Your grade:** The total on ${lms} is calculated as described in this syllabus. If a score is missing or wrong, tell me within one week after it is posted.`); break;
    case "estimate": siteItems.push(`**Your grade:** The total on ${lms} is only an estimate${notApplied.length ? `: it doesn't apply ${reader(s).andList(notApplied)}` : ""}. Your final grade is calculated as described in this syllabus.`); break;
    case "hidden": siteItems.push(`**Your grade:** ${lms} shows your scores but not a total, because it can't apply every rule in this syllabus. If you want to know where you stand, come to ${ohRef}.`); break;
  }
  if (siteItems.length || ch("submitPlatform") === CUSTOM) {
    push({ t: "h3", text: "Course Website and Submitting Work", src: "lmsUses" });
    if (siteItems.length) push({ t: "ul", items: siteItems, src: ch("submitPlatform") ? "submitPlatform" : uses.length ? "lmsUses" : "gradebook" });
    if (ch("submitPlatform") === CUSTOM) push(...custom("submitPlatform"));
  }

  // Attendance
  if (ch("attendance") || sections || (s.multi.drops?.length && !has("drops", "none"))) {
    push({ t: "h3", text: "Attendance Policy", src: "attendance" });
    switch (ch("attendance")) {
      case "graded":
        push(
          p(`You are expected to attend every class. Attendance is measured by ${opt("att.method")}, which count toward your participation grade. Full credit is given for completing them; they are not checked for accuracy.`, "attendance"),
          p(`${lowest(attendanceDrops, "participation score")} dropped, so you can miss ${plural(attendanceDrops, "class")} without penalty. If you miss more classes because of an illness, emergency, or other legitimate reason, ${exceptionHow}`, "attendance"),
        );
        break;
      case "expected":
        push(p("Attendance is not graded, but you are expected to attend every class. Students who attend regularly learn much more, and some material and announcements are given only in class.", "attendance"));
        break;
      case "penalty":
        push(p(`Attendance is required. You may miss ${plural(Number(val("att.allowed")) || 0, "class")} without penalty. Each additional unexcused absence lowers your final grade. Absences for illness, emergencies, religious observances, and university-sanctioned activities are excused; to request an excused absence, ${exceptionHow}`, "attendance"));
        break;
      case CUSTOM:
        push(...custom("attendance"));
        break;
    }
    if (ch("attendance")) {
      push(p(`If you miss a class, it is your responsibility to catch up on the material and announcements you missed, using the notes posted on ${lms}${ch("recordings") === "posted" ? ", the lecture recordings," : ""} and your classmates' notes.`, "attendance"));
    }
    if (ch("discussion") === "required") {
      const quiz = ch("quizzes") === "section" || (ch("quizzes") === "highStakes" && /section/i.test(val("quiz.where")));
      push(p(`Discussion sections are required.${quiz ? " Quizzes are given in sections each week." : ""}`, "discussion"));
    } else if (ch("discussion") === "optional") {
      push(p("Discussion sections are optional, but they are the best place to get help working through problems.", "discussion"));
    }
    if (sections) {
      const switchText: Record<string, string> = {
        noSwitch: "You must attend the section you are enrolled in. You can switch to another section permanently only through enrollment, and only if the other section has space.",
        oneTime: "You cannot switch sections without permission, because most sections are full. If you have a one-time reason to attend a different section, email the TA who leads the section you want to attend; they decide on a case-by-case basis. If you attend a section you are not enrolled in without permission, your work there may not be graded. You can transfer permanently only if the other section has space.",
        free: "You may attend any section that has space. Your section work counts no matter which section you attend.",
      };
      if (ch("switchSection") === CUSTOM) push(...custom("switchSection"));
      else if (ch("switchSection")) push(p(switchText[ch("switchSection")], "switchSection"));
    }
    const dropReasons: Record<string, string> = {
      firstWeek: "Missing class during the first week (unless excused by emailing me).",
      firstHw: "Not submitting the first assignment.",
    };
    const reasons = (s.multi.drops ?? []).filter(r => r in dropReasons);
    if (reasons.length) {
      push(p("**You may be dropped from this class for any of the following reasons:**", "drops"), { t: "ul", items: reasons.map(r => dropReasons[r]), src: "drops" });
    }
  }

  // Classroom behavior
  const behaviorText: Record<string, string> = {
    respect: "**Be respectful.** All students are expected to act respectfully toward each other and the teaching staff. Please be kind and supportive toward yourself and others.",
    participate: "**Participate actively.** This class requires active participation. You will be directed to work on problems with your classmates.",
    ontime: "**Arrive on time.** You are expected to be in the classroom before class starts. Arriving late disrupts your learning and your classmates'. Unexcused lateness may be counted as an absence.",
    questions: "**Ask questions.** Questions are encouraged during class. If you are confused or curious about something, someone else probably is too!",
  };
  const electronicsText: Record<string, string> = {
    open: "**Electronics.** You may use laptops, tablets, and phones in class. Please keep them to course-related use, since screens distract the people around you.",
    notes: "**No electronics except for note-taking.** During lectures and sections, electronics must be used for course-related purposes only. If you are clearly using your device for something else, you may be asked to leave.",
    none: "**No devices.** Please put away laptops and phones during class. If you need a device as an accommodation, let me know, and we will make it work.",
  };
  const behaviorItems: string[] = (s.multi.behavior ?? []).filter(b => b in behaviorText).map(b => behaviorText[b]);
  if (has("behavior", CUSTOM)) {
    const own = raw("behavior.custom").split("\n").map(l => l.trim().replace(/^[-*•]\s+/, "")).filter(Boolean);
    behaviorItems.push(...(own.length ? own : ["{{Your own expectation}}"]));
  }
  if (ch("electronics") && ch("electronics") !== CUSTOM) behaviorItems.push(electronicsText[ch("electronics")]);
  if (behaviorItems.length || ch("electronics") === CUSTOM) {
    push({ t: "h3", text: "How to Behave in Class", src: "behavior" });
    if (behaviorItems.length) push({ t: "ul", items: behaviorItems, src: ch("electronics") && !s.multi.behavior?.length ? "electronics" : "behavior" });
    if (ch("electronics") === CUSTOM) push(...custom("electronics"));
  }

  // Communication
  const askWhere = s.multi.contentQuestions ?? [];
  const askNot = (s.multi.contentNot ?? []).filter(x => x !== "none");
  if (askWhere.length || askNot.length || ch("contact") || ch("exceptions")) {
    push({ t: "h3", text: "Communication", src: "contact" });
    const items: string[] = [];
    const places: string[] = [];
    if (askWhere.includes("class")) places.push("in class");
    if (askWhere.includes("section")) places.push("in discussion sections");
    if (askWhere.includes("officeHours")) places.push(`in ${ohRef}`);
    if (askWhere.includes("forum")) places.push(`on ${forum}`);
    if (askWhere.includes("email")) places.push(`by email${sections ? " to me or your TA" : ""}`);
    if (places.length) {
      const forumNote = places.length === 1 && askWhere.includes("forum")
        ? " That way, everyone benefits from the answers, and you are encouraged to answer your classmates' questions too."
        : askWhere.includes("forum") ? ` Post on ${forum} when other students might have the same question, so that everyone benefits from the answer; you are encouraged to answer your classmates' questions too.` : "";
      const inPerson = askWhere.some(x => x === "class" || x === "section" || x === "officeHours") && !askWhere.includes("email") ? " Questions about math are much easier to answer in person than in writing." : "";
      items.push(`**Questions about the material and assignments:** Ask them ${orList(places)}.${forumNote}${inPerson}`);
    }
    if (askNot.length) {
      const not = askNot.map(x => (x === "email" ? "by email" : `through ${lms} messages`));
      items.push(`**Please don't send questions about the material ${not.join(" or ")}.** ${askNot.includes("email") ? "Email is for personal and logistical matters. " : ""}Questions asked ${places.length ? `${orList(places)}` : "in person"} get answered faster, and the answers help other students too.`);
    }
    const time = ch("contact") ? ` I will reply ${opt("contact.time")}.` : "";
    switch (ch("contact")) {
      case "email": items.push(`**Personal or logistical matters:** Email me at ${email}.${time}`); break;
      case "staffEmail": items.push(`**Personal or logistical matters:** Email the teaching team at ${v("contact.staffEmail", "Course email address")}, which the whole teaching team reads.${time.replace("I will", "We will")}`); break;
      case "lms": items.push(`**Personal or logistical matters:** Send me a message on ${lms}.${time}`); break;
    }
    if (ch("exceptions") && ch("exceptions") !== CUSTOM) {
      items.push(`**Requests for exceptions** (extensions, excused absences, and makeup exams): ${exceptionHow.charAt(0).toUpperCase()}${exceptionHow.slice(1)}`);
    }
    if (items.length) push({ t: "ul", items, src: askWhere.length ? "contentQuestions" : askNot.length ? "contentNot" : ch("contact") ? "contact" : "exceptions" });
    if (ch("contact") === CUSTOM) push(...custom("contact"));
    if (ch("exceptions") === CUSTOM) push(...custom("exceptions"));
  }

  // Academic integrity
  const collabText: Record<string, string> = {
    individual: "Homework must be done individually. You may ask the teaching team for help, but not other students.",
    discuss: "On homework, you may discuss problems with your classmates, but you must perform your own calculations and write your solutions yourself.",
    groups: `Homework is done in groups of ${opt("collab.size")}. Each group submits one solution, and every member must be able to explain every part of it.`,
  };
  const office = opt("integrity.office");
  const prohibited: string[] = [
    `Copying solutions from another student, the internet, ${ch("ai") === "prohibited" || ch("ai") === "learning" ? "AI tools, " : ""}or elsewhere.`,
    "Allowing another student to copy your work.",
    "Using outside help during an exam (for example, phones or hidden notes).",
    "Sharing or receiving questions or answers for upcoming exams.",
    ...(quizVersions ? ["Sharing quiz questions with students in later sections."] : []),
  ];
  if (ch("integrityStyle") || ch("collaboration")) {
    push({ t: "h3", text: "Academic Integrity", src: "integrityStyle" });
    const gate = ch("passGate") === "kOfN" || ch("passGate") === "final";
    switch (ch("integrityStyle")) {
      case "formal":
        push(p(`All work you submit must be your own. Cheating on an exam, quiz, or assignment results in no credit for that work and is reported to ${office}. Penalties for cheating can include failing the course, suspension, and expulsion.`, "integrityStyle"));
        break;
      case "guardrails":
        push(
          p("My goal is to design every part of this course to help you thrive, intellectually and personally. Learning is often frustrating, stressful, and difficult. Under the pressure of deadlines and exams, it becomes tempting to take shortcuts that may improve your grade but degrade your learning. To help you resist that temptation, I take academic honesty extremely seriously, and the course has several guardrails:", "integrityStyle"),
          {
            t: "ol", src: "integrityStyle", items: [
              gate
                ? "**Course design.** To pass the course, you must demonstrate a minimum level of competency on proctored exams. The take-home assignments are designed to prepare you for the exams, so if you complete them yourself, you will be well prepared. On the other hand, a student who copies solutions to take-home assignments will likely be unable to pass the exams, and therefore fail the class."
                : "**Course design.** The take-home assignments are designed to prepare you for the exams, so if you complete them yourself, you will be well prepared. A student who copies solutions skips that preparation, and will likely do poorly on the exams.",
              "**Looking for suspicious submissions.** When reviewing homework and exams, the teaching team looks for signs of copying.",
              "**Low threshold for reporting.** Instructors are required to report cases where they have a “reasonable suspicion” of misconduct. This is a much lower standard than “beyond a reasonable doubt,” which you may expect in a court of law.",
              `**Penalties.** Cheating on an exam, quiz, or assignment results in no credit for that work and is reported to ${office}. Penalties can include failing the course, suspension, and expulsion. Going through the reporting process is no fun for anybody, so please avoid anything that gives me reasonable suspicion!`,
            ],
          },
        );
        break;
      case "pledge":
        push(
          p(`This course follows an honor code. On each exam, you will sign this pledge: “${opt("integrity.pledge")}”`, "integrityStyle"),
          p(`Cheating on an exam, quiz, or assignment results in no credit for that work and is reported to ${office}.`, "integrityStyle"),
        );
        break;
      case CUSTOM:
        push(...custom("integrityStyle"));
        break;
    }
    push(p("Prohibited actions include the following:", "integrityStyle"), { t: "ul", items: prohibited, src: "integrityStyle" });
    if (ch("collaboration") === CUSTOM) push(...custom("collaboration"));
    else if (ch("collaboration")) push(p(collabText[ch("collaboration")], "collaboration"));
    if (ch("integrityStyle") === "guardrails") {
      push(p("This might all sound like a bit of a downer, but these policies are rooted in my belief that each of you is capable of succeeding in this course. If you ever feel like you cannot, please talk to me or any of the teaching staff. We are all on your team!", "integrityStyle"));
    }
  }

  // Generative AI
  if (ch("ai")) {
    push({ t: "h3", text: "Use of Generative AI (ChatGPT, Claude, Gemini, etc.)", src: "ai" });
    switch (ch("ai")) {
      case "prohibited":
        push(p("You may not use generative AI tools, such as ChatGPT, Claude, or Gemini, for any work in this course. Submitting AI-generated work as your own is a violation of academic integrity.", "ai"));
        break;
      case "learning":
        push(p("Your use of generative AI tools, such as Claude, ChatGPT, and Gemini, must be limited. **You must not ask them to solve assigned questions, and you must not copy text from them, or from other internet resources, into your submissions.** You may use them to explain concepts, to generate practice problems, or to help find bugs in your code. After submitting an assignment, you must be able to explain everything in your submission.", "ai"));
        if (raw("ai.guide")) push(p(`See [Using Generative AI Productively](${raw("ai.guide")}) for suggestions on how to use these tools effectively.`, "ai"));
        push(p("**This class has zero tolerance for submitting AI-generated work as your own.**", "ai"));
        break;
      case "disclose":
        push(p("You may use generative AI tools on homework if you say how you used them. At the end of each assignment, include a short statement naming the tools you used, what you asked them, and how you used their output. Undisclosed use is a violation of academic integrity. You are responsible for the correctness of everything you submit, and you must be able to explain it. AI tools are not allowed on exams.", "ai"));
        break;
      case "integrated":
        push(p("Generative AI tools are part of this course. Some assignments ask you to use them and to evaluate their output critically. Unless an assignment says otherwise, you may use them on homework, but you are responsible for the correctness of everything you submit, and you must be able to explain it. AI tools are not allowed on exams.", "ai"));
        break;
      case CUSTOM:
        push(...custom("ai"));
        break;
    }
  }

  // Materials
  const materialRows: [string, Block[]][] = [];
  if (ch("textbook") || raw("book.list")) {
    const book: Block[] = [];
    switch (ch("textbook")) {
      case "oer": book.push(p("The textbooks for this course are free and openly licensed, so you can read them online, download them, or print them.", "textbook")); break;
      case "library": book.push(p("The required textbooks for this course are freely (and legally) available to students through the library.", "textbook")); break;
      case "commercial": book.push(p(`You can buy or rent the textbook from ${opt("book.where")}.`, "textbook")); break;
      case "notes": book.push(p(`There is no required textbook. Course notes are posted on ${lms}.`, "textbook")); break;
      case CUSTOM: book.push(...custom("textbook")); break;
    }
    // How to get access. (Saved answers from before this field may have a VPN link instead.)
    const accessLink = raw("book.accessLink") || raw("book.vpn");
    const instructions = /^https?:\/\//i.test(accessLink) ? `See the [instructions for getting access](${accessLink}).` : "";
    if (raw("book.access")) {
      const access = textBlocks(esc(raw("book.access")), "textbook");
      const last = access[access.length - 1];
      if (instructions && last.t === "p") last.text += ` ${instructions}`;
      else if (instructions) access.push(p(instructions, "textbook"));
      book.push(...access);
    } else if (instructions) book.push(p(instructions, "textbook"));
    const books: Item[] = rows("book.list").map(r => {
      const [kind = "", bookTitle = "", author = "", url = "", note = ""] = r;
      const t = url ? `[*${esc(bookTitle)}*](${url})` : `*${esc(bookTitle)}*`;
      const text = `${kind ? `**${esc(kind)}:** ` : ""}${t}${author ? `, by ${esc(author)}` : ""}.`;
      return note ? { text, items: [esc(note)] } : text;
    });
    if (books.length) book.push({ t: "ul", items: books, src: "textbook" });
    materialRows.push(["Textbook", book]);
  }
  const calcText: Record<string, string> = {
    none: "Calculators are not allowed on exams. Exam problems are designed to be done by hand.",
    scientific: "You need a scientific calculator for this course. Graphing calculators are not allowed on exams.",
    graphing: "You need a scientific or graphing calculator for this course.",
    any: "You may use any calculator, including on exams, but not phones or computers.",
  };
  if (ch("calculators")) materialRows.push(["Calculator", [p(calcText[ch("calculators")], "calculators")]]);
  if (ch("electronics") === "notes" || ch("electronics") === "none") {
    materialRows.push(["Note-taking materials", [
      p("During class, take notes by hand on paper or on a tablet. Writing equations by hand is much faster than typing them.", "electronics"),
      p("A three-ring binder lets you add, remove, and rearrange pages. Use paper that is at least 8.5″ × 11″, so you have plenty of space for calculations.", "electronics"),
    ]]);
  }
  const softwareText: Record<string, string> = {
    matlab: "You must have access to a computer with MATLAB installed.",
    python: "You must have access to a computer with Python installed, including the NumPy and Matplotlib packages.",
    either: "You must have access to a computer with MATLAB or Python installed. Most instruction is given for MATLAB, so choose Python only if you are already comfortable with the language.",
  };
  if (ch("software") && ch("software") !== "none") {
    const sw = ch("software") === CUSTOM ? custom("software") : [p(softwareText[ch("software")], "software")];
    if (raw("software.link")) sw.push(p(`Instructions for installing the software are [here](${raw("software.link")}).`, "software"));
    materialRows.push([ch("software") === "matlab" ? "Computer with MATLAB" : ch("software") === "python" ? "Computer with Python" : ch("software") === "either" ? "Computer with MATLAB or Python" : "Software", sw]);
  }
  if (materialRows.length) {
    push({ t: "h3", text: "Required Materials", src: "textbook" }, p("For this class, you need the following:", "textbook"), { t: "kv", rows: materialRows, src: "textbook" });
  }

  // ⋘──────── Grading ────────⋙
  push({ t: "h2", text: "Grading Policy", src: "weights" });
  const approach = ch("approach");
  const specs = approach === "specs" || approach === "standards";

  // Descriptions of the grade components, written from other answers.
  const examScheduleText: Record<string, string> = {
    twoMidterms: "Two midterm exams and a cumulative final exam.",
    oneMidterm: "One midterm exam and a cumulative final exam.",
    frequent: "Several shorter exams spread through the term.",
    project: "Midterm exams and a final project.",
  };
  const gateText = ch("passGate") === "kOfN"
    ? `**You must score ${pct("gate.pct")} or better on at least ${opt("gate.k")} of the ${opt("gate.n")} exams to pass the class.**`
    : ch("passGate") === "final" ? `**You must score ${pct("gate.finalPct")} or better on the final exam to pass the class.**` : "";
  const hwText: Record<string, string> = {
    problemSets: "Written problem sets, graded for correctness.",
    completion: "Problem sets graded for completion: full credit for a complete, honest attempt. Check your work against the posted solutions.",
    online: "Online homework, graded automatically, with several attempts per problem.",
    reports: "Reports in which you compute, plot, and explain results.",
  };
  const quizText: Record<string, string> = {
    section: "Quizzes are given in discussion sections. Immediately after each quiz, you will have a chance to work together, get help from the TA, and revise your quiz before submitting it.",
    lecture: "Short quizzes are given in lecture each week, on the previous week's material.",
    highStakes: `Closed-book quizzes are given in ${opt("quiz.where")} each week and graded for correctness.`,
    online: `Online quizzes on ${lms}, open book.`,
  };
  const componentBlocks = (row: WeightRow): Block[] => {
    if (row.desc.trim()) return textBlocks(row.desc, "weights");
    const out: string[] = [];
    switch (row.kind) {
      case "participation":
        if (ch("attendance") === "graded") out.push(`Measured by ${opt("att.method")}. Full credit is given for completion (they are not checked for accuracy). ${lowest(attendanceDrops, "score")} dropped, so you can miss ${plural(attendanceDrops, "class")} without penalty.`);
        else if (ch("attendance") === "penalty") out.push("See the Attendance Policy.");
        else out.push("{{How participation is measured}}");
        break;
      case "quizzes":
        out.push(ch("quizzes") && ch("quizzes") !== CUSTOM && ch("quizzes") !== "none" ? quizText[ch("quizzes")] : "{{How quizzes work}}");
        if (quizVersions) out.push("Each section takes a different version of the quiz.");
        if (quizDrops) out.push(`${lowest(quizDrops, "quiz score")} dropped, so you can miss ${quizDrops === 1 ? "one quiz" : `${quizDrops} quizzes`} without penalty.`);
        break;
      case "homework": {
        const freq = val("hw.frequency");
        const submit = raw("hw.submit");
        out.push(ch("homework") && ch("homework") !== CUSTOM ? hwText[ch("homework")] : "{{Homework format}}");
        if (freq || submit) out.push(`Assigned ${esc(freq || "regularly")}${submit ? ` and submitted on ${esc(submit)}` : ""}.`);
        if (hwDrops) out.push(`${lowest(hwDrops, "homework score")} dropped.`);
        break;
      }
      case "exams":
        out.push(ch("examSchedule") && ch("examSchedule") !== CUSTOM ? examScheduleText[ch("examSchedule")] : "{{Exam schedule}}");
        if (gateText) out.push(gateText);
        break;
      case "midterms":
        out.push(ch("examSchedule") === "twoMidterms" ? "Two midterm exams." : ch("examSchedule") === "oneMidterm" ? "One midterm exam." : "Midterm exams.");
        if (midterms.length) out.push(`On ${midtermText}.`);
        if (gateText) out.push(gateText);
        break;
      case "final":
        out.push(`Cumulative.${finalExam ? ` ${finalExam}.` : ""}`);
        if (gateText && !row.label.match(/midterm/i) && !activeWeights(s).some(w => w.kind === "midterms")) out.push(gateText);
        break;
      default:
        return [];
    }
    return out.map(t => p(t, row.kind === "participation" ? "attendance" : row.kind === "quizzes" ? "quizzes" : row.kind === "homework" ? "homework" : "examSchedule"));
  };

  if (specs) {
    const intro = approach === "specs"
      ? "This course uses **specifications grading**. Each assignment is graded Satisfactory or Not Yet, based on clear specifications that are posted with the assignment. Work marked Not Yet can be revised. Your letter grade depends on which assignments you complete satisfactorily, as shown below."
      : "This course uses **standards-based grading**. Your work is assessed on a list of learning standards (skills), each marked Mastered or Not Yet, and you can reassess standards during the term. Your letter grade depends on how many standards you master, as shown below.";
    const specRows = rows("specs.table");
    push(p(intro, "approach"), {
      t: "table", src: "approach", head: ["Grade", "Requirements"],
      rows: specRows.length ? specRows.map(r => [esc(r[0] ?? ""), esc(r.slice(1).join(" | "))]) : [["{{Grade}}", "{{Requirements}}"]],
    });
  } else {
    const weights = activeWeights(s);
    if (weights.length) {
      push(p("Your final grade is calculated from the following components:", "weights"), {
        t: "kv", src: "weights",
        rows: weights.map(w => [`${w.weight}% ${esc(w.label)}`, componentBlocks(w)]),
      });
    }
  }

  // Thresholds
  if (!specs && (approach || ch("scale"))) {
    push({ t: "h3", text: "Final Grade Thresholds", src: "scale" });
    switch (approach) {
      case "fixed": push(p("Final letter grades are assigned using the following thresholds.", "approach")); break;
      case "fixedLower": push(p("Final letter grades are assigned using the following thresholds. I may lower these thresholds at the end of the term (which can only raise grades), but I will not raise them.", "approach")); break;
      case "curve": push(p(`Final letter grades are curved, based on each student's total relative to the class, targeting ${opt("curve.target")}. The curve can only raise grades: you are guaranteed at least the grade shown below for your percentage.`, "approach")); break;
    }
    if (ch("scale") && s.scale.length) {
      const sorted = [...s.scale].sort((a, b) => b.min - a.min);
      const points = Number(raw("scale.points")) || 0;
      const describe = checked("scale.describe");
      const head = ["Grade", "Percent", ...(points ? ["Points"] : []), ...(describe ? ["Description"] : [])];
      const tableRows = sorted.map((r, i) => {
        const upper = i === 0 ? 100 : sorted[i - 1].min;
        const range = `${r.min}%–${upper}%`;
        return [esc(r.grade), range, ...(points ? [r.min > 0 ? String(Math.round(r.min * points / 100)) : ""] : []), ...(describe ? [esc(r.desc)] : [])];
      });
      push({ t: "table", head, rows: tableRows, src: "scale" });
    }
    const roundText: Record<string, string> = {
      none: "Final percentages are not rounded.",
      nearest: "Final percentages are rounded to the nearest whole percent before letter grades are assigned.",
      judgment: "If your final percentage is within 1% of a threshold, I may raise your grade based on your exam scores, participation, and improvement over the term.",
    };
    if (ch("rounding")) push(p(roundText[ch("rounding")], "rounding"));
  }

  // Exams
  // Exam-day rules for students, from the proctoring guidance in the teaching team questions.
  const examDayText: Record<string, string> = {
    allowed: `**What you may use:** ${reader(s).andList(reader(s).examAllowed())}. Nothing else is allowed, including phones, smartwatches, and earbuds.`,
    bags: "**Bags and phones:** Before the exam starts, turn off your phone and put it in your bag at the front or side of the room. Smartwatches and earbuds are not allowed.",
    seating: "**Seating:** Leave an empty seat between you and your neighbors, or sit in your assigned seat if there is one.",
    ids: "**Bring your student ID.** Proctors will check it during the exam.",
    restroom: "**Restroom breaks:** One student at a time. Before you leave, give the proctor your phone, your exam, and your student ID, and pick them up when you return. Bring your student ID to every exam.",
  };
  const examDay = (s.multi.proctoring ?? []).filter(x => x in examDayText).map(x => examDayText[x]);
  if (ch("examSchedule") || ch("examDay") || ch("examAids") || ch("missedExam") || ch("secondChance") || examDay.length) {
    push({ t: "h3", text: "Exams", src: "examSchedule" });
    const items: string[] = [];
    const whenText: Record<string, string> = {
      ...Object.fromEntries(WEEKDAYS.map(([id, name]) => [id, `Midterm exams are held in class on ${name}s.`])),
      section: "Midterm exams are held in discussion sections. Take the exam in the section you are enrolled in.",
      evening: `Midterm exams are held in the evening (${opt("exam.evening")}), outside class time. If you have a conflict with another class or a job, tell me in the first two weeks, so that we can arrange a conflict exam.`,
    };
    if (ch("examSchedule") && ch("examSchedule") !== CUSTOM) items.push(examScheduleText[ch("examSchedule")] + (midterms.length ? ` The midterm exams are on ${midtermText}.` : "") + (finalExam ? ` The final exam is on ${finalExam}.` : ""));
    if (whenText[ch("examDay")]) items.push(whenText[ch("examDay")]);
    const aidsText: Record<string, string> = {
      closed: "Exams are closed book and closed notes.",
      sheet: `You may bring handwritten notes to each exam (${opt("exam.sheet")}).`,
      open: "Exams are open book and open notes. Electronic devices other than calculators are not allowed.",
    };
    if (ch("examAids") && ch("examAids") !== CUSTOM) items.push(aidsText[ch("examAids")]);
    const missedText: Record<string, string> = {
      makeup: `If you miss an exam because of an illness or emergency, contact me as soon as possible (before the exam, if you can)${checked("exc.docs") ? " and provide documentation" : ""}, and you will take a makeup exam.`,
      shift: `If you miss an exam because of ${illness}, the weight of that exam is moved to the final exam.`,
      zero: "A missed exam receives a score of zero unless you arrange an alternative with me before the exam. In an emergency, contact me as soon as possible.",
    };
    if (ch("missedExam") && ch("missedExam") !== CUSTOM) items.push(missedText[ch("missedExam")]);
    const secondText: Record<string, string> = {
      replace: "If your percentage on the final exam is higher than your lowest midterm percentage, your final exam percentage replaces it.",
      corrections: `After each midterm, you may submit corrections that explain and fix your mistakes to earn back ${opt("exam.correctionShare")} of the points you lost.`,
      retake: "After each midterm, you may take a second version of the exam, and the higher of the two scores counts.",
    };
    if (ch("secondChance") && secondText[ch("secondChance")]) items.push(secondText[ch("secondChance")]);
    if (gateText) items.push(gateText);
    // How a second chance counts toward the pass requirement.
    if (ch("passGate") === "kOfN" && secondText[ch("secondChance")]) {
      const kind: Record<string, [string, string]> = {
        replace: ["a final exam score that replaces your lowest midterm in your grade", "If your final exam score replaces a midterm score, it also replaces that midterm score for this requirement."],
        corrections: ["points earned back through exam corrections", "Points earned back through exam corrections count toward this requirement."],
        retake: ["the higher score from a retake", "The higher score from a retake counts toward this requirement."],
      };
      const [what, improved] = kind[ch("secondChance")];
      if (ch("gateSecondChance") === "original") items.push(`**The requirement to pass uses your original exam scores.** ${what.charAt(0).toUpperCase()}${what.slice(1)} raises your weighted total, but it does not count toward the requirement. This means you can fail the class before the final exam.`);
      else if (ch("gateSecondChance") === "improved") items.push(improved);
      else items.push("{{Say whether second chances count toward the requirement to pass}}");
    }
    if (items.length) push({ t: "ul", items, src: "examSchedule" });
    for (const q of ["examSchedule", "examAids", "missedExam", "secondChance", "passGate"]) if (ch(q) === CUSTOM) push(...custom(q));
    if (examDay.length) push(p("**On exam day:**", "proctoring"), { t: "ul", items: examDay, src: "proctoring" });
  }

  // Grading rubric
  if (ch("rubric") === "fourPart") {
    push(
      { t: "h3", text: "Grading Rubric", src: "rubric" },
      p("Written work is graded roughly on the following:", "rubric"),
      {
        t: "ul", src: "rubric", items: [
          "**Correctness**: Around half of your points come from correct final answers found with valid methods. Partial credit is awarded if your methods are mostly correct but you make computational or conceptual mistakes.",
          "**Explanations**: To receive full credit, you must demonstrate your *understanding* by clearly describing how you arrived at the answer. Show your work!",
          "**Effort**: You might work hard on a problem and not figure it out by the deadline. You will still get some points *if you show your work*.",
          "**Presentation**: The way you present your work matters. Submit tidy, well-formatted work so that you don't lose points because the grader struggles to read it.",
        ],
      },
    );
    if (raw("rubric.image")) push(p(esc(raw("rubric.image")), "rubric"));
  } else if (ch("rubric") === "showWork") {
    push({ t: "h3", text: "Grading Rubric", src: "rubric" }, p("Show your work! Full credit requires a correct answer supported by clear work. Partial credit is awarded for valid methods with computational or conceptual mistakes. A correct answer with no work may receive little credit.", "rubric"));
  }

  // Turnaround and regrades
  const turnaroundText: Record<string, string> = {
    oneWeek: "We aim to return graded work within one week of the deadline.",
    twoWeeks: "We aim to return graded work within two weeks of the deadline.",
    beforeExam: "Exams are returned within one week, and all work covered by an exam is returned before that exam.",
  };
  // When regrade requests are due (one week after grades are released, unless chosen otherwise).
  const regradeBy = ({
    window: ` within ${opt("regrade.window")} after grades are released`,
    beforeFinal: ` by ${opt("regrade.final")}`,
    none: "",
  } as Record<string, string>)[ch("regradeDeadline")] ?? " within one week after grades are released";
  const regradeText: Record<string, string> = {
    platform: `If you disagree with a grade on an exam or assignment, submit a regrade request on ${opt("regrade.platform")}${regradeBy}, explaining what you think was graded incorrectly.${/^https?:\/\//i.test(raw("regrade.help")) ? ` See [how to request a regrade on ${opt("regrade.platform")}](${raw("regrade.help")}).` : ""} The teaching team does its best to grade fairly, but we will make mistakes.`,
    written: `Regrade requests must be submitted in writing${regradeBy} and must explain specifically what you believe was graded incorrectly. The entire assignment may be regraded, so your score may go up or down.`,
    person: `To request a regrade, bring your work to ${ohRef}${regradeBy}.`,
  };
  if (ch("turnaround") || ch("regrades")) {
    push({ t: "h3", text: "Feedback and Regrades", src: "turnaround" });
    if (ch("turnaround") === CUSTOM) push(...custom("turnaround"));
    else if (ch("turnaround")) push(p(turnaroundText[ch("turnaround")], "turnaround"));
    if (ch("regrades") === CUSTOM) push(...custom("regrades"));
    else if (ch("regrades")) push(p(regradeText[ch("regrades")], "regrades"));
  }

  // Late work
  const lateBlocks = (): Block[] => {
    const penalty = pct("late.pct");
    const days = Number(val("late.days")) || 0;
    switch (ch("late")) {
      case "none":
        return [p(`Late work is not accepted, because solutions are posted right after the deadline. If you have an illness or emergency, request an extension as soon as possible: ${exceptionHow}`, "late")];
      case "penalty": {
        const two = times(val("late.pct"), 2);
        const out: Block[] = [];
        if (checked("late.cap")) {
          // The penalty lowers the maximum score (Canvas's automatic late policy).
          const m = /^(\d+(?:\.\d+)?)\s*%?$/.exec(val("late.pct"));
          const capNum = (n: number) => (m ? Math.max(0, 100 - Number(m[1]) * n) : null);
          const cap = (n: number) => (capNum(n) === null ? null : `${capNum(n)}%`);
          const below = capNum(1) === null ? 0 : Math.max(0, Math.floor((capNum(1)! - 15) / 5) * 5);
          out.push(p(`You can submit assignments up to ${plural(days, "day")} late. Each day after the deadline lowers the highest score you can earn on the assignment by ${penalty}. A score below that maximum is not reduced.`, "late"));
          if (cap(1)) out.push(p(`**Example:** If an assignment is due Friday at 11:59 pm and you submit it on Saturday, the most you can earn is ${cap(1)}: a perfect score becomes ${cap(1)}, but a score of ${below}% stays ${below}%.${days >= 2 && cap(2) ? ` If you submit it on Sunday, the most you can earn is ${cap(2)}.` : ""}`, "late"));
        } else {
          out.push(p(`You can submit assignments up to ${plural(days, "day")} late. For each day after the deadline, ${penalty} of the possible points is subtracted from your score.`, "late"));
          if (two && days >= 2) out.push(p(`**Example:** If an assignment is due Friday at 11:59 pm and you submit it on Saturday, you lose ${penalty} of the possible points. If you submit it on Sunday, you lose ${two}.`, "late"));
        }
        out.push(p(`Exceptions are made only for ${illness}. To request one, ${exceptionHow}`, "late"));
        return out;
      }
      case "tokens": {
        const n = Number(val("late.tokens")) || 0;
        return [p(`You have ${plural(n, "late day")} to use during the term, no questions asked. Each late day extends the deadline of one assignment by 24 hours, and you may use several on the same assignment. Save some for emergencies: after your late days are used up, late work is accepted only for ${illness}.`, "late")];
      }
      case "flexible":
        return [p(`Late work is accepted without penalty until ${opt("late.final")}. Keeping up with the schedule is still important, because each assignment prepares you for the next class, quiz, and exam.`, "late")];
      case CUSTOM:
        return custom("late");
      default:
        return [];
    }
  };
  if (ch("late")) push({ t: "h3", text: "Late Policy", src: "late" }, ...lateBlocks());

  if (ch("extraCredit")) {
    const extraText: Record<string, string> = {
      none: "There is no extra credit in this course.",
      small: `Occasional extra credit opportunities are announced to the whole class.${raw("extra.each") ? ` Each is worth ${esc(raw("extra.each"))}.` : ""}${raw("extra.cap") ? ` Extra credit counts for at most ${esc(raw("extra.cap"))} in total.` : ""}${raw("extra.each") || raw("extra.cap") ? "" : " Each is worth {{Value of each opportunity}}."}`,
      bonus: "Some exams include bonus questions, which can raise your exam score.",
    };
    push({ t: "h3", text: "Extra Credit", src: "extraCredit" }, ...(ch("extraCredit") === CUSTOM ? custom("extraCredit") : [p(extraText[ch("extraCredit")], "extraCredit")]));
  }

  // ⋘──────── Schedule ────────⋙
  if (ch("scheduleWhere")) {
    push({ t: "h2", text: "Course Schedule", src: "scheduleWhere" });
    const sched = rows("schedule.list");
    const table: Block = {
      t: "table", src: "scheduleWhere", head: ["Week", "Topics", "Due"],
      rows: sched.length ? sched.map(r => [esc(r[0] ?? ""), esc(r[1] ?? ""), esc(r.slice(2).join(" | "))]) : [["{{Week}}", "{{Topics}}", "{{Due}}"]],
    };
    if (ch("scheduleWhere") === "page") push(p(`The schedule of topics, readings, and due dates is on the ${raw("schedule.page") ? esc(raw("schedule.page")) : "{{Schedule page}}"} page on ${lms}.`, "scheduleWhere"));
    else if (ch("scheduleWhere") === "lms") push(p(`The schedule of topics, readings, and due dates is in the ${lms} calendar.`, "scheduleWhere"));
    else if (ch("scheduleWhere") === "tentative") push(p(`This schedule is tentative. Changes will be announced in class and on ${lms}.`, "scheduleWhere"), table);
    else push(table);
  }

  // ⋘──────── Resources ────────⋙
  const stmts = s.multi.statements ?? [];
  push({ t: "h2", text: "Resources to Help You Succeed", src: "statements" });
  push(p(`We are committed to giving you the support and resources you need, recognizing that students come from diverse backgrounds, face diverse challenges, and benefit from diverse forms of support.${purposes.length ? "" : " There are many resources available to help you:"}`, "statements"));
  if (purposes.length) {
    // What each kind of help is for.
    const sectionQuiz = ch("quizzes") === "section";
    const defaults: Record<string, [string, string]> = {
      lectures: ch("format") === "flipped"
        ? ["Class meetings", "Class meetings are for practice, not for a first look at new material. Watch the videos or do the reading before class, so that you can spend class time solving problems with help from me and the TAs."]
        : ch("format") === "active"
          ? ["Lectures", "Lectures are where new ideas are introduced and first practiced, through polls and problems that you work on with your classmates. Mistakes in class are expected and help you learn, so try every problem. Afterward, review your notes within a day or two, while the ideas are fresh."]
          : ["Lectures", "Lectures are where new ideas are introduced and worked through in examples. A lecture is your first look at a topic, not the whole explanation, so review your notes within a day or two, while the ideas are fresh."],
      sections: ["Discussion sections", `Discussion sections are for practice. A TA works through problems like those on the homework and exams with a small group, where it is much easier to ask questions than in lecture.${sectionQuiz ? " Sections also include a weekly quiz." : ""} Try the homework before section, so that you know where you are stuck.`],
      officeHours: [OhLabel, `${OhLabel} are time that I set aside for you. Come to ask about the material, to get unstuck on a homework problem, to go over an exam, or to talk about the course, your major, or your plans. They are not only for students who are struggling; many students come to go deeper into the material. ${ch("officeHours") === "appointment" ? "Email me to set up a time." : "No appointment is needed, and you are welcome to come just to listen to other students' questions."} If you are stuck on a problem, bring your work so far, so that we can see where you got stuck.${raw("inst.ohLink") ? ` Times and places are on the ${linkTo(`${ohLabel} page`, "inst.ohLink")}.` : ""}`],
      taHours: [`TA ${ohLabel}`, `TA ${ohRef} work like mine, at other times during the week. The TAs know the assignments well and are often the fastest way to get unstuck on a problem.`],
      forum: ["Discussion forum", `${linkTo(cap(opt("contact.forum")), "contact.forumLink")} is for questions that other students might have too, about the material, assignments, or logistics. Search before posting, because your question may already be answered, and answer your classmates' questions when you can. Don't post solutions to homework problems; if your question needs your work, post it privately to the teaching team.`],
      studyGroups: ["Classmates and study groups", ch("collaboration") === "individual"
        ? "Your classmates are one of your best resources for studying. Explaining ideas to each other and studying together for quizzes and exams are among the best ways to learn. Homework, however, must be done on your own (see Academic Integrity)."
        : ch("collaboration") === "groups"
          ? "Your homework group is the first place to get help. Beyond your group, studying with classmates for quizzes and exams, and explaining ideas to each other, are among the best ways to learn."
          : "Your classmates are one of your best resources. Discussing problems, explaining ideas to each other, and comparing approaches are among the best ways to learn. You must still write your own solutions (see Academic Integrity)."],
      tutors: ["Tutoring", `${linkTo(cap(opt("support.tutoring")), "support.tutoringLink")} offers tutoring for extra practice and for working through problems with someone who has taken a course like this one. Tutors are not part of the teaching team, so they can't answer questions about this course's policies or grading, and they may use methods or notation that differ from ours. When in doubt, follow what we do in class.`],
    };
    const order = ["lectures", "sections", "officeHours", "taHours", "forum", "studyGroups", "tutors"];
    const chosen = order.filter(id => purposes.includes(id) || (id === "tutors" && stmts.includes("tutoring")));
    push(
      p("Here is what each kind of help in this course is for:", "helpPurposes"),
      {
        t: "kv", src: "helpPurposes",
        rows: chosen.map(id => [defaults[id][0], raw(`help.${id}`) ? textBlocks(raw(`help.${id}`), "helpPurposes") : [p(defaults[id][1], "helpPurposes")]]),
      },
    );
  } else {
    const resources: string[] = [`${linkTo(OhLabel, "inst.ohLink")} with the instructor${sections || rows("inst.team").length ? " and TAs" : ""}.`];
    if (forum) resources.push(`The discussion forum on ${forum}.`);
    if (stmts.includes("tutoring")) resources.push(`Tutoring and study halls through ${tutoring}.`);
    push({ t: "ul", items: resources, src: "statements" });
  }

  if (stmts.includes("accommodations")) {
    const contact = raw("support.drcContact") ? ` (${esc(raw("support.drcContact"))})` : "";
    push(
      { t: "h3", text: "Disability Accommodations", src: "statements" },
      p(`If you have, or think you may have, a disability that affects your education, please contact the ${opt("support.drc")}${contact} to determine your eligibility for accommodations. I encourage you to contact them early in the term, and to share your accommodation letter with me as soon as possible, so that we can discuss how to put your accommodations in place before the first exam.`, "statements"),
    );
  }
  if (stmts.includes("titleIX")) {
    const site = raw("support.titleIX") ? `[Title IX Office website](${raw("support.titleIX")})` : "{{Title IX Office website}}";
    push(
      { t: "h3", text: "Title IX: Protection Against Discrimination, Harassment, and Violence", src: "statements" },
      p(`I want all of you to be safe and to feel safe. If you are experiencing discrimination, harassment, threats, or violence, please talk to me about it. University policies and federal law (Title IX) protect our community from sex discrimination, sexual harassment, sexual violence, and related misconduct. Please know that, as a university employee, I am required to report incidents that you tell me about to the Title IX Office. To talk with someone confidentially, contact ${opt("support.confidential")}. Information about campus resources and online reporting is on the ${site}.`, "statements"),
    );
  }
  if (stmts.includes("wellness")) {
    push(
      { t: "h3", text: "Mental Health", src: "statements" },
      p(`College can be stressful. If you are struggling, you are not alone, and help is available: ${opt("support.counseling")} offers free, confidential counseling. If something is getting in the way of your work in this course, please let me know, so that we can figure out a plan together.`, "statements"),
    );
  }
  if (stmts.includes("basicNeeds")) {
    push(
      { t: "h3", text: "Food and Housing", src: "statements" },
      p(`If you have trouble affording enough food or finding a safe and stable place to live, and you think this may affect your performance in this course, please contact ${opt("support.basicNeeds")} for support. If you are comfortable doing so, please also let me know, so that I can help you find resources.`, "statements"),
    );
  }
  if (stmts.includes("inclusion")) {
    push(
      { t: "h3", text: "An Inclusive Classroom", src: "statements" },
      p("Students in this class come from many backgrounds and bring many perspectives, and that is a strength. I expect everyone to treat each other with respect. If something in class makes you feel unwelcome, please tell me or a member of the teaching team.", "statements"),
    );
  }
  if (stmts.includes("religious")) {
    push(
      { t: "h3", text: "Religious Observances", src: "statements" },
      p("If a religious observance conflicts with an exam or deadline, please let me know within the first two weeks of the term, and we will arrange an alternative.", "statements"),
    );
  }
  if (stmts.includes("names")) {
    push(
      { t: "h3", text: "Names and Pronouns", src: "statements" },
      p("Everyone has the right to be addressed by the name and pronouns they use. Class rosters may show names that you don't use, so please tell me the name you go by and, if you like, your pronouns.", "statements"),
    );
  }

  // ⋘──────── FAQs ────────⋙
  // The questions, grouped by category, in this order.
  const faqs = s.multi.faqs ?? [];
  if (faqs.length) {
    push({ t: "h2", text: "Frequently Asked Questions (FAQs)", src: "faqs" });
    const a = (...texts: string[]) => push(...texts.map(t => p(t, "faqs")));
    const participation = activeWeights(s).find(w => w.kind === "participation");
    const { andList, examAllowed } = reader(s);
    const entries: { id: string; category: string; question: string; answer: () => void }[] = [
      {
        id: "findX", category: "Help and Communication", question: "Where do I find “X”?",
        answer: () => {
          a(raw("faq.index") ? `See the [Course Index: Where to Find Things](${raw("faq.index")}).` : `Everything for the course is on ${lms}: announcements, assignments, notes, and the calendar.`);
        },
      },
      {
        id: "help", category: "Help and Communication", question: "I'm struggling with “X”. Where can I get help?",
        answer: () => {
          const places = [`come to ${ohRef}`, ...(sections ? ["ask your TA in discussion section"] : []), ...(forum ? [`post on ${forum}`] : [])];
          a(`Start early, and don't wait until you are completely stuck: ${orList(places)}. See Resources to Help You Succeed, above, for more.`);
        },
      },
      {
        id: "contact", category: "Help and Communication", question: "How should I contact you, and how quickly will you reply?",
        answer: () => {
          const time = ch("contact") ? ` I will reply ${opt("contact.time")}.` : "";
          const how: Record<string, string> = {
            email: `For personal or logistical matters, email me at ${email}.${time}`,
            staffEmail: `For personal or logistical matters, email the teaching team at ${v("contact.staffEmail", "Course email address")}.${time.replace("I will", "We will")}`,
            lms: `For personal or logistical matters, send me a message on ${lms}.${time}`,
          };
          const content = forum ? ` Questions about the material are best asked on ${forum}, where everyone can benefit from the answer.` : "";
          a(how[ch("contact")] ? how[ch("contact")] + content : "{{Answer from your contact policy}}");
        },
      },
      {
        id: "accommodations", category: "Help and Communication", question: "I have accommodations. What should I do?",
        answer: () => {
          a(`If you haven't already, request accommodations through ${opt("support.drc")}. Then share your accommodation letter with me as early in the term as possible, and before the first exam at the latest, so that we have time to put them in place.`);
        },
      },
      {
        id: "attend", category: "Attendance and Sections", question: "Am I required to attend class?",
        answer: () => {
          switch (ch("attendance")) {
            case "graded": a(`Attendance counts toward your participation grade, so if you regularly miss class, you will lose points. ${participation ? `Participation is only ${participation.weight}% of your final grade, so you could pass the class without consistently attending, but it will be much harder to get a good grade.` : ""}`); break;
            case "expected": a("Attendance is not graded, but you are expected to attend. Students who attend regularly learn much more and do better on exams."); break;
            case "penalty": a(`Yes. You may miss ${plural(Number(val("att.allowed")) || 0, "class")} without penalty; after that, each unexcused absence lowers your final grade.`); break;
            default: a("{{Answer from your attendance policy}}");
          }
        },
      },
      {
        id: "miss", category: "Attendance and Sections", question: "What if I miss class?",
        answer: () => {
          const free: string[] = [];
          if (ch("attendance") === "graded" && attendanceDrops) free.push(plural(attendanceDrops, "participation score"));
          if (quizDrops) free.push(plural(quizDrops, "section quiz"));
          if (free.length) a(`Your lowest ${free.join(" and ")} ${free.length === 1 && (ch("attendance") === "graded" ? attendanceDrops : quizDrops) === 1 ? "is" : "are"} dropped automatically. Regularly attending class${sections ? " and discussion sections" : ""} is important for your success, but of course many things can cause you to miss class.`);
          a(`If you miss more classes than that because of an illness, emergency, or other legitimate reason, ${exceptionHow} If you miss class for a reason that isn't excusable (for example, a vacation or a project for another class), you do not need to email me, since it will not make a difference.`);
          a("**After you miss a class,** it is critical that you catch up on whatever you missed. It is your responsibility to do this using the resources provided.");
          a("**Do**");
          push({
            t: "ul", src: "faqs", items: [
              ...(ch("recordings") === "posted" ? [`Watch the lecture recording on ${lms}.`] : []),
              "Read the assigned reading in the textbook.",
              `Read the class notes posted on ${lms}.`,
              "Ask your classmates about what you missed.",
              ...(postNotes ? [`Work through the section worksheet and solutions posted on ${lms}.`] : []),
              `Come to ${ohRef} with *specific* questions after completing the steps above.`,
            ],
          });
          a("**Don't**");
          push({ t: "ul", src: "faqs", items: ["Ask the instructor or TAs “What did I miss?” or “What did we cover that day?” We want to help you, but we can't recap the entire class, so please bring us specific questions."] });
        },
      },
      {
        id: "recordings", category: "Attendance and Sections", question: "Are lectures recorded?",
        answer: () => {
          a(recordingText[ch("recordings")] ?? "{{Answer from your recording policy}}");
        },
      },
      {
        id: "switchSection", category: "Attendance and Sections", question: "Can I go to a different section?",
        answer: () => {
          const answers: Record<string, string> = {
            noSwitch: "No. You must attend the section you are enrolled in. You can switch permanently only through enrollment, and only if the other section has space.",
            oneTime: "In general, no: most sections are full, so you cannot switch without permission. If you have a one-time reason to attend a different section, email the TA who leads the section you want to attend; they decide on a case-by-case basis. You can transfer permanently only if the other section has space.",
            free: "Yes, you may attend any section that has space.",
          };
          a(answers[ch("switchSection")] ?? "{{Answer from your section-switching policy}}");
        },
      },
      {
        id: "dueDates", category: "Assignments", question: "Where can I find the due dates?",
        answer: () => {
          const parts: string[] = [];
          if (DAYS[ch("hwDay")]) parts.push(`Homework is due every ${DAYS[ch("hwDay")]}${hwTime[ch("dueTime")] ?? ""}.`);
          const where: Record<string, string> = {
            table: "The Course Schedule, below, lists the due dates for the whole term.",
            tentative: `The Course Schedule, below, lists the due dates. It may change; changes are announced in class and on ${lms}.`,
            lms: `All due dates are in the ${lms} calendar.`,
            page: `All due dates are on the ${raw("schedule.page") ? esc(raw("schedule.page")) : "{{Schedule page}}"} page on ${lms}.`,
          };
          if (where[ch("scheduleWhere")]) parts.push(where[ch("scheduleWhere")]);
          if (ch("submitPlatform") === "gradescope" && ch("gsExtensions") === "noDates") parts.push(`Due dates for work submitted on ${platformRef} are listed there, not in the ${lms} calendar.`);
          if (rows("schedule.major").length) parts.push("The major assignment deadlines are also in Important Dates, above.");
          a(parts.length ? parts.join(" ") : "{{Answer from your schedule}}");
        },
      },
      {
        id: "submit", category: "Assignments", question: "How do I submit my work, and what if the upload fails?",
        answer: () => {
          const fails = "If the upload fails, email me your work before the deadline, so that I know you finished on time, and then submit it as soon as you can.";
          switch (ch("submitPlatform")) {
            case "lms": a(`Submit written work on ${lms}. ${fails}`); break;
            case "gradescope": a(`Submit written work on ${platformRef}. When you upload, match each page to the question it answers; work on unmatched pages may not be graded. ${fails}`); break;
            case "paper": a("Turn in written work on paper at the start of class."); break;
            default: a("{{Answer from your submission platform}}");
          }
        },
      },
      {
        id: "deadline", category: "Assignments", question: "What if I can't finish an assignment by the deadline?",
        answer: () => {
          const late = lateBlocks();
          if (late.length) push(...late.map(b => ({ ...b, src: "faqs" })));
          else a("{{Answer from your late policy}}");
        },
      },
      {
        id: "collab", category: "Assignments", question: "Can I work with other students?",
        answer: () => {
          a(collabText[ch("collaboration")] ? `${collabText[ch("collaboration")]} On exams, all work must be your own.` : "{{Answer from your collaboration policy}}");
        },
      },
      {
        id: "ai", category: "Assignments", question: "Can I use ChatGPT or other AI tools?",
        answer: () => {
          const ai: Record<string, string> = {
            prohibited: "No. You may not use generative AI tools for any work in this course.",
            learning: "Only to help you learn: you may ask them to explain concepts, but you must not ask them to solve assigned questions, and you must not copy their output.",
            disclose: "Yes, on homework, if you say how you used them in a short statement at the end of each assignment.",
            integrated: "Yes. Some assignments ask you to use them, and you may use them on other homework unless the assignment says otherwise. You are responsible for everything you submit.",
          };
          a(ai[ch("ai")] ? `${ai[ch("ai")]} See Use of Generative AI, above, for details.` : ch("ai") === CUSTOM ? "See Use of Generative AI, above." : "{{Answer from your AI policy}}");
        },
      },
      {
        id: "examBring", category: "Exams", question: "What can I bring to exams?",
        answer: () => {
          a(`You may bring ${andList(examAllowed())}. Nothing else is allowed, including phones, smartwatches, and earbuds.`);
        },
      },
      {
        id: "quizTopics", category: "Exams", question: "What topics will be on this week's quiz?",
        answer: () => {
          a("Each week's quiz covers the topics from the previous week's lectures. To prepare, complete the practice problems listed in the course schedule.");
        },
      },
      {
        id: "currentGrade", category: "Grades", question: "What is my grade right now?",
        answer: () => {
          const text: Record<string, string> = {
            official: `The total on ${lms} is your current grade, calculated as described in the Grading Policy. If a score is missing or wrong, tell me within one week after it is posted.`,
            estimate: `The total on ${lms} is only an estimate${notApplied.length ? `: it doesn't apply ${andList(notApplied)}` : ""}. Your final grade is calculated as described in the Grading Policy.`,
            hidden: `${lms} shows your scores but not a total, because it can't apply every rule in this syllabus. If you want to know where you stand, come to ${ohRef}.`,
          };
          a(text[ch("gradebook")] ?? "{{Answer from your gradebook policy}}");
        },
      },
      {
        id: "extraCredit", category: "Grades", question: "Is there extra credit?",
        answer: () => {
          const text: Record<string, string> = {
            none: "No. There is no extra credit in this course, and none is offered to individual students. Your time is better spent on the regular assignments, which count for much more.",
            small: "Occasionally. Extra credit opportunities are announced to the whole class. Extra credit isn't offered to individual students.",
            bonus: "Some exams include bonus questions. There is no other extra credit.",
          };
          a(text[ch("extraCredit")] ?? (ch("extraCredit") === CUSTOM ? "See Extra Credit, above." : "{{Answer from your extra credit policy}}"));
        },
      },
      {
        id: "curve", category: "Grades", question: "Is the class curved?",
        answer: () => {
          const text: Record<string, string> = {
            fixed: "No. Letter grades are assigned using the thresholds in the Grading Policy, so your grade doesn't depend on how other students do.",
            fixedLower: "No. Letter grades are assigned using the thresholds in the Grading Policy. I may lower the thresholds at the end of the term, which can only raise grades, but I won't raise them.",
            curve: "Yes. Letter grades are curved, based on each student's total relative to the class. The curve can only raise grades: you are guaranteed at least the grade from the thresholds in the Grading Policy.",
            specs: "No. Your grade depends on which specifications you meet, not on how other students do.",
            standards: "No. Your grade depends on which standards you meet, not on how other students do.",
          };
          const round: Record<string, string> = {
            nearest: " Final percentages are rounded to the nearest whole percent.",
            judgment: " If your final percentage is within 1% of a threshold, I may raise your grade based on your exams, participation, and improvement.",
          };
          a(text[approach] ? text[approach] + (specs ? "" : round[ch("rounding")] ?? "") : "{{Answer from your grading approach}}");
        },
      },
      {
        id: "regrade", category: "Grades", question: "What if I disagree with my grade?",
        answer: () => {
          a(ch("regrades") && regradeText[ch("regrades")] ? regradeText[ch("regrades")] : "{{Answer from your regrade policy}}");
        },
      },
      {
        id: "textbook", category: "Materials", question: "Do I need to buy the textbook?",
        answer: () => {
          const text: Record<string, string> = {
            oer: "No. The textbooks are free and openly licensed. See Required Materials, above.",
            library: "No. The required textbooks are free through the library. See Required Materials, above, for how to get them.",
            commercial: `Yes. You can buy or rent it from ${opt("book.where")}. See Required Materials, above.`,
            notes: `No. There is no required textbook; course notes are posted on ${lms}.`,
          };
          a(text[ch("textbook")] ?? "{{Answer from your textbook policy}}");
        },
      },
      {
        id: "calculator", category: "Materials", question: "Do I need to buy a calculator?",
        answer: () => {
          const text: Record<string, string> = {
            none: "No. Calculators are not allowed on exams, and exam problems are designed to be done by hand.",
            scientific: "Yes: a basic scientific calculator, which costs about $15. Graphing calculators are not allowed on exams.",
            graphing: "You need a scientific or graphing calculator. A basic scientific calculator, which costs about $15, is enough; you don't need to buy a graphing calculator.",
            any: "You may use any calculator, but not a phone or computer. A basic scientific calculator, which costs about $15, is enough.",
          };
          a(text[ch("calculators")] ?? "{{Answer from your calculator policy}}");
        },
      },
      {
        id: "lateAdd", category: "Enrollment", question: "I added the class late (or I'm on the waitlist). What should I do?",
        answer: () => {
          a(
            "Welcome! Read this syllabus first, and then catch up on what you missed using the steps under “What if I miss class?”",
            "If you are on the waitlist, attend class and do the work as though you were enrolled, so that you don't fall behind if you get in.",
            "For assignments that were due before you enrolled, email me in your first week in the class, so that we can decide what you need to make up.",
          );
        },
      },
      {
        id: "incomplete", category: "Enrollment", question: "What if I don't think I will be able to complete the class?",
        answer: () => {
          a(
            "In rare cases, students are unable to complete the class because of an emergency, illness, or other life circumstance.",
            "If this happens early in the term, you may be able to drop or withdraw from the class. After the withdrawal deadline, you can request an “Incomplete”, which may allow you to finish the course in a later term.",
            "In either case, please let me know what is going on, so that I can help you navigate the process smoothly.",
          );
        },
      },
    ];
    let category = "";
    for (const e of entries) {
      if (!faqs.includes(e.id)) continue;
      if (e.category !== category) {
        category = e.category;
        push({ t: "h3", text: category, src: "faqs" });
      }
      push({ t: "h4", text: `Q: ${e.question}`, src: "faqs" });
      e.answer();
    }
  }

  return blocks;
}
