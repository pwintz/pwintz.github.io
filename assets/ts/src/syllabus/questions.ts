// ╭───────────────────────────────────────────────────────────────╮
// │        Syllabus designer: the questions and their options     │
// ╰───────────────────────────────────────────────────────────────╯
// Each section is a group of decisions. A question is answered with one option ("single"), several
// options ("multi"), or by filling in fields ("fields"). Options can have follow-up fields that are
// shown when the option is chosen. Field ids are global, so the syllabus generator (generate.ts)
// reads them by id. A single-choice question with `custom: true` also has a "Write my own" option,
// whose text is stored in the field "<question id>.custom".

// "date" is one date; "dates" is a list of dates; "dateList" is a list of dates (or ranges), each
// with a description. Dates are stored as ISO dates (see dates.ts).
// The stakes of quizzes given in discussion sections: high for closed-book quizzes graded for
// correctness, low for quizzes revised with help; null when quizzes aren't given in sections.
// Whether quizzes are given in discussion sections.
function sectionQuizzes(s: { choice: Record<string, string>; field: Record<string, string> }): boolean {
  return s.choice.quizzes === "section" || (s.choice.quizzes === "highStakes" && /section/i.test(s.field["quiz.where"] || "discussion sections"));
}
// The stakes suggested by how quizzes work in Coursework.
function suggestedStakes(s: { choice: Record<string, string> }): "low" | "high" {
  return s.choice.quizzes === "highStakes" ? "high" : "low";
}
function quizStakes(s: { choice: Record<string, string>; field: Record<string, string> }): "high" | "low" | null {
  if (!sectionQuizzes(s)) return null;
  const chosen = s.choice.sectionQuizStakes;
  return chosen === "high" ? "high" : chosen ? "low" : suggestedStakes(s);
}

export type FieldKind = "text" | "textarea" | "number" | "checkbox" | "date" | "dates" | "dateList" | "rows" | "weekdays";

// A column of a "rows" field: a list of records, each edited as a card of labeled boxes and stored
// as one line with the values separated by "|".
export interface Column {
  label: string;
  placeholder?: string;
  options?: string[];       // A drop-down with these choices
  span?: 1 | 2 | 3;         // Width in the card's three-column grid (default 1)
  long?: boolean;           // A text area
}

export interface Field {
  id: string;
  label: string;
  kind?: FieldKind;         // Default "text"
  placeholder?: string;
  help?: string;            // Shown by a "?" button (plain text, or "#template-id")
  defaultValue?: string;    // Used in the syllabus when the field is left empty
  wide?: boolean;           // Takes a full row
  open?: boolean;           // Shows an "Open" link to the address in the box, for checking it
  columns?: Column[];       // For a "rows" field
  availableFrom?: boolean;  // For a "dateList" field: the second date is when the item becomes available
  addLabel?: string;        // For a "rows" field: the text of the button that adds a row
  pattern?: string;         // For a text field: a regular expression that a valid value matches
  patternHint?: string;     // Shown when the value doesn't match, as "Enter …"
}

const PERCENT = { pattern: "\\d+(\\.\\d+)?\\s*%?", patternHint: "a percentage, such as 65%" };

export interface Option {
  id: string;
  label: string;
  summary?: string;          // {{field.id}} shows that field's current value
  pros?: string[];
  cons?: string[];
  fields?: Field[];
  exclusive?: boolean;      // In a multi-choice question, choosing this clears the others
}

export type QuestionKind = "single" | "multi" | "fields" | "weights" | "scale" | "perRole";

export interface Question {
  id: string;
  title: string;
  why?: string;
  kind: QuestionKind;
  options?: Option[];
  // For a "perRole" question: one choice among the options for each of these roles, stored as
  // choice["<question>.<role>"]. A role is asked only when it is chosen in rolesFrom (a multi
  // question).
  // A role whose `relevant` is false, given the other answers, isn't asked.
  roles?: { id: string; label: string; relevant?: (s: Answers) => boolean }[];
  rolesFrom?: string;
  // For a "multi" question: an option whose id is an option of this question (a multi question)
  // is shown only when it is chosen there (or here), such as roles that are on the team.
  optionsFrom?: string;
  fields?: Field[];
  custom?: boolean;
  // For a single-choice question with `custom`: the answer is always your own text, and the
  // options are templates to start it from (an option that writes no text is chosen as it is).
  templates?: boolean;
  // Whether the question matters, given the other answers. A question that doesn't is dimmed,
  // with a note, and doesn't count toward progress.
  relevant?: (s: { choice: Record<string, string>; multi: Record<string, string[]>; field: Record<string, string> }) => boolean;
  irrelevantNote?: string;
}

export interface Section {
  id: string;
  title: string;
  intro?: string;
  questions: Question[];
}

export const CUSTOM = "custom";

// A link to the page of the course website with one of its uses (the "lmsUses" question).
const USE_LABELS: Record<string, string> = { announcements: "Announcements", notes: "Class notes", readings: "Readings", calendar: "Calendar", submissions: "Submitting work", grades: "Grades", recordings: "Lecture recordings" };
function useLink(use: string): Field {
  return { id: `lms.link.${use}`, label: "Link (optional)", placeholder: "https://…", wide: true, help: `The page with the ${USE_LABELS[use].toLowerCase()}. The syllabus links to it. All of the course links are also listed together in Course basics.` };
}

export const SECTIONS: Section[] = [
  // ⋘──────── Basics ────────⋙
  {
    id: "basics",
    title: "Course basics",
    intro: "Facts to copy from elsewhere: the course catalog (number, title, units, description, prerequisites), the schedule of classes (times, location, final exam), and the registrar's academic calendar (holidays and deadlines). Leave a field empty to show a highlighted placeholder in the syllabus, which you can fill in later.",
    questions: [
      {
        id: "course",
        title: "Course information",
        kind: "fields",
        fields: [
          { id: "course.code", label: "Course number", placeholder: "MATH 110" },
          { id: "course.title", label: "Course title", placeholder: "Linear Algebra for Engineers" },
          { id: "course.term", label: "Term", placeholder: "Fall 2026" },
          { id: "course.start", label: "First day of instruction", kind: "date" },
          { id: "course.end", label: "Last day of instruction", kind: "date" },
          { id: "course.units", label: "Units", placeholder: "5 units" },
          { id: "course.hours", label: "Hours per week", placeholder: "15", help: "#syl-hours-help", pattern: "\\d+(\\.\\d+)?(\\s*[–-]\\s*\\d+(\\.\\d+)?)?\\+?", patternHint: "a number of hours, such as 15, 15+, or 12–15" },
          { id: "course.days", label: "Class meeting days", kind: "weekdays", wide: true, help: "The days of the week that the whole class meets (not discussion sections). The options for exam days follow these days." },
          { id: "course.meetings", label: "Meeting times", placeholder: "9:20–10:25 am" },
          { id: "course.location", label: "Location", placeholder: "Science Hall 101" },
                    { id: "course.lms", label: "Course website", placeholder: "[Canvas](https://canvas.example.edu/courses/12345)", defaultValue: "Canvas", help: "The learning management system or website where you post materials and announcements, such as Canvas, Moodle, Blackboard, or a course website. To link to it, write a Markdown link: [Canvas](https://canvas.example.edu/courses/12345)." },
          { id: "course.prereqs", label: "Prerequisites", placeholder: "MATH 20 or MATH 21" },
          { id: "course.finalDate", label: "Final exam date", kind: "date" },
          { id: "course.finalTime", label: "Final exam time", placeholder: "8:00–11:00 am" },
          { id: "course.description", label: "Catalog description", kind: "textarea", wide: true, placeholder: "An applications-oriented introduction to linear algebra…" },
          { id: "course.outcomes", label: "Learning outcomes (one per line)", kind: "textarea", wide: true, help: "#syl-outcomes-help", placeholder: "Solve systems of linear equations by row reduction.\nCompute eigenvalues and eigenvectors and use them to analyze dynamical systems." },
        ],
      },
      {
        id: "enrollment",
        title: "How many students are enrolled?",
        why: "Many policies that work well with 25 students are unmanageable with 400, and the reverse. After you choose, options throughout the page are marked as suiting or straining a class of this size, with notes on what changes.",
        kind: "single",
        options: [
          { id: "small", label: "Fewer than 30", summary: "You can learn every name, handle requests one at a time, and grade much of the work yourself." },
          { id: "medium", label: "30 to 100", summary: "Large enough that consistent written policies matter, small enough that you can still make exceptions by hand." },
          { id: "large", label: "100 to 300", summary: "Usually with TAs and sections. Every policy that needs individual attention multiplies, so automate where you can." },
          { id: "huge", label: "More than 300", summary: "Policies must work without individual decisions: requests, makeups, and regrades arrive daily." },
        ],
      },
      {
        id: "instructor",
        title: "Instructor and teaching team",
        kind: "fields",
        fields: [
          { id: "inst.name", label: "Name", placeholder: "Jordan Lee" },
          { id: "inst.pronouns", label: "Pronouns", placeholder: "he/him", help: "Sharing your pronouns invites students to share theirs. Leave empty to omit them." },
          { id: "inst.address", label: "How students should address you", placeholder: "“Jordan” or “Dr. Lee”" },
          { id: "inst.email", label: "Email", placeholder: "jlee@example.edu" },
          { id: "inst.oh", label: "Office hours times and place", placeholder: "Listed in the Canvas calendar" },
          { id: "inst.ohLink", label: "Office hours page (link)", placeholder: "https://…", wide: true, help: "A page with the times and places of office hours for the whole teaching team. The syllabus links to it wherever it mentions office hours." },
          { id: "inst.website", label: "Website", placeholder: "https://example.edu/~jlee" },
          { id: "inst.team", label: "Teaching assistants (one per line: name | email | section)", kind: "textarea", wide: true, placeholder: "Ada Lovelace | ada@example.edu | Tu 2:00 pm" },
        ],
      },
      {
        id: "dates",
        title: "Important dates",
        why: "Copy holidays and the add, drop, and withdrawal deadlines from your registrar's academic calendar. The first and last days of instruction, the final exam, the midterm dates (Exams section), and the major assignment dates (Schedule section) are added automatically.",
        kind: "fields",
        fields: [
          { id: "dates.list", label: "Dates", kind: "dateList", wide: true, placeholder: "Last day to drop (without a grade)", help: "Holidays and deadlines. For a range, such as a break, also give an end date." },
        ],
      },
    ],
  },

  // ⋘──────── Tone ────────⋙
  {
    id: "tone",
    title: "Welcome and tone",
    intro: "Students form an impression of you and the course from the first page of the syllabus.",
    questions: [
      {
        id: "welcome",
        title: "How should the syllabus open?",
        why: "In a study by Harnish and Bridges (2011), students who read a warmly written syllabus rated the instructor as more approachable and more motivated to teach than students who read the same policies written coldly. Write the opening in your own words, starting from one of the templates below if you like.",
        kind: "single",
        custom: true,
        templates: true,
        options: [
          {
            id: "letter",
            label: "Personal welcome letter",
            summary: "A short letter in your voice: why the course is worth taking, that struggling is a normal part of learning, and that help is available.",
            pros: [
              "Signals that you are approachable, which makes students more likely to ask for help.",
              "Frames difficulty as normal before students first struggle, so struggling feels less like failing.",
            ],
            cons: [
              "Adds length to a document that students already skim.",
              "Reads as boilerplate if it could appear in every course.",
            ],
          },
          {
            id: "overview",
            label: "Brief course overview",
            summary: "One paragraph on what the course covers and why it is useful.",
            pros: ["Short, and puts the content first.", "Motivates the course without being personal."],
            cons: ["Misses the chance to tell students that struggling is normal."],
            fields: [{ id: "welcome.overview", label: "Overview", kind: "textarea", wide: true, placeholder: "This course introduces the linear algebra that engineers use to model and simulate systems…" }],
          },
          {
            id: "none",
            label: "No introduction",
            summary: "Open with the course information and policies.",
            pros: ["Fastest for students to scan for a fact.", "Works well as a reference document."],
            cons: ["Makes a cold first impression.", "Policies with no context can read as rules for their own sake."],
          },
        ],
      },
      {
        id: "guide",
        title: "Include a syllabus reading guide?",
        why: "A syllabus covers many policies, but only some of them affect students' grades directly.",
        kind: "single",
        options: [
          {
            id: "yes",
            label: "Yes, near the top",
            summary: "A short list of which sections to read carefully and which to skim.",
            pros: [
              "Students skim long syllabi anyway; this points them to the policies that matter most.",
              "Respects students' time, which builds goodwill.",
            ],
            cons: ["Implies that some sections are skippable.", "Needs updating when sections change."],
          },
          {
            id: "no",
            label: "No",
            pros: ["Shorter.", "Every section is presented as equally important."],
            cons: ["Important policies are easy to miss among the required statements."],
          },
        ],
      },
      {
        id: "syllabusQuiz",
        title: "Check that students read the syllabus?",
        kind: "single",
        options: [
          {
            id: "quiz",
            label: "Syllabus quiz",
            summary: "A short, low-stakes quiz on the key policies in the first week. The quiz is written from your answers as a separate document: choose Syllabus quiz above the preview.",
            fields: [{ id: "quiz.due", label: "Due", placeholder: "the end of the first week", defaultValue: "the end of the first week" }],
            pros: [
              "Makes students read the policies that affect their grade.",
              "Cuts the number of questions that the syllabus already answers.",
              "Gives you a record that students were told the policies.",
            ],
            cons: ["One more thing to set up and grade (though usually auto-graded).", "Can feel bureaucratic."],
          },
          {
            id: "none",
            label: "No check",
            pros: ["Nothing extra to set up."],
            cons: ["Many students never read past the first page."],
          },
        ],
      },
    ],
  },

  // ⋘──────── Class meetings ────────⋙
  {
    id: "class",
    title: "Class meetings",
    questions: [
      {
        id: "format",
        title: "How will class time be used?",
        why: "In a meta-analysis of 225 studies of undergraduate STEM courses, Freeman et al. (2014) found that students in traditional lectures were 1.5 times as likely to fail as students in courses with active learning, and scored about half a standard deviation lower on exams.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "lecture",
            label: "Traditional lecture",
            summary: "You present the material and work examples; students take notes and ask questions.",
            pros: ["Covers the most material per hour.", "Predictable, and easy to prepare and record."],
            cons: ["Students are mostly passive, so they remember less.", "Higher failure rates than courses with active learning."],
          },
          {
            id: "active",
            label: "Lecture with active learning",
            summary: "Short explanations alternate with polls, think-pair-share questions, and problems that students work in groups.",
            pros: [
              "Better exam scores and lower failure rates than traditional lecture.",
              "Shows you, during class, what students have not understood.",
              "Polls can double as attendance.",
            ],
            cons: ["Covers less material per hour.", "Takes more preparation.", "Some students resist at first, so the format needs explaining."],
          },
          {
            id: "flipped",
            label: "Flipped classroom",
            summary: "Students watch videos or read before class; class time is for solving problems together.",
            pros: ["Most class time goes to the hard part: applying ideas with help nearby.", "Students can rewatch explanations at their own pace."],
            cons: [
              "Students who skip the preparation get little from class.",
              "Recording videos is a large up-front investment.",
              "Needs a strategy for checking preparation, such as a pre-class quiz.",
            ],
          },
        ],
      },
      {
        id: "attendance",
        title: "How will attendance count?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "graded",
            label: "Graded through in-class activities, with free absences",
            summary: "Participation points come from in-class polls or activities, graded for completion; a few of the lowest scores are dropped.",
            pros: [
              "Rewards coming to class without making attendance high-stakes.",
              "Free absences cover illness and emergencies without asking students for documentation.",
              "Activities give you feedback on what students understand.",
            ],
            cons: [
              "Measures presence, not learning.",
              "Students can earn points from outside the room unless the activity requires being there.",
              "Poll software or clickers need setting up.",
            ],
            fields: [
              { id: "att.method", label: "Measured by", placeholder: "in-class polls", defaultValue: "in-class polls" },
              { id: "att.drops", label: "Free absences", kind: "number", placeholder: "3", defaultValue: "3" },
            ],
          },
          {
            id: "expected",
            label: "Expected but not graded",
            summary: "Students are told that attendance matters, but it is not part of the grade.",
            pros: [
              "Treats students as adults and saves bookkeeping.",
              "No incentive for sick students to come to class.",
              "No need to judge which absences are excused.",
            ],
            cons: [
              "Attendance usually declines over the term.",
              "Students who struggle most are often the first to stop coming.",
            ],
          },
          {
            id: "penalty",
            label: "Required; extra absences lower the grade",
            summary: "A set number of absences is allowed; each one after that costs points.",
            pros: ["A strong incentive to attend.", "Clear and easy to explain."],
            cons: [
              "Encourages sick students to come to class.",
              "You must judge which absences are excused, and documentation is harder for some students to get than others.",
              "Can feel punitive.",
            ],
            fields: [
              { id: "att.allowed", label: "Absences allowed", kind: "number", placeholder: "3", defaultValue: "3" },
            ],
          },
        ],
      },
      {
        id: "recordings",
        title: "Will lectures be recorded?",
        kind: "single",
        options: [
          {
            id: "posted",
            label: "Recorded and posted",
            pros: [
              "Helps students who are sick, have caregiving duties, or need to review.",
              "Helps students who process spoken language slowly or are learning English.",
            ],
            cons: ["Some students attend less.", "Some students are less willing to ask questions when they are recorded."],
          },
          {
            id: "request",
            label: "Recorded, shared on request",
            summary: "Recordings are shared with students who have an excused absence or an accommodation.",
            pros: ["Covers students who need recordings without discouraging attendance."],
            cons: ["Requests take time to handle.", "Students must ask, which some are reluctant to do."],
          },
          {
            id: "none",
            label: "Not recorded",
            pros: ["Encourages attendance and open discussion."],
            cons: ["Students who miss class can catch up only from notes.", "You may still need to record for students with an accommodation."],
          },
        ],
      },
      {
        id: "discussion",
        title: "Are there discussion sections or labs?",
        why: "Sections led by TAs give students a smaller group in which to ask questions and work problems.",
        kind: "single",
        options: [
          {
            id: "none",
            label: "No sections",
            pros: ["Simpler scheduling and staffing."],
            cons: ["In a large class, students have no small-group setting to ask questions."],
          },
          {
            id: "required",
            label: "Required sections",
            summary: "Attendance is expected, usually with graded work such as quizzes.",
            pros: ["Every student gets regular small-group practice.", "A natural place for quizzes and feedback."],
            cons: ["Requests to switch sections need a policy."],
            fields: [{ id: "sec.when", label: "When and where", placeholder: "Weekly, 65 minutes; see the Teaching Team page", wide: true }],
          },
          {
            id: "optional",
            label: "Optional sections",
            summary: "Problem-solving help for students who want it.",
            pros: ["Students who come want to be there.", "Fewer graded items to manage."],
            cons: ["The students who need help most often don't come.", "Attendance drops over the term, which is hard on TAs."],
            fields: [{ id: "sec.when", label: "When and where", placeholder: "Weekly, 65 minutes; see the Teaching Team page", wide: true }],
          },
        ],
      },
      {
        id: "sectionTiming",
        title: "When do discussion sections meet, relative to deadlines and exams?",
        why: "The timing of sections decides how much help students get while they work. Sections before a homework deadline are help sessions for the homework; sections after it are a chance to review it. Sections just before an exam act as review sessions, while sections in the days after an exam are poorly attended. When sections meet on different days, students in some sections get more help before each deadline and exam than students in others.",
        kind: "single",
        relevant: s => s.choice.discussion === "required" || s.choice.discussion === "optional",
        irrelevantNote: "Only needed when the class has discussion sections.",
        options: [
          {
            id: "beforeHw",
            label: "Before the homework deadline",
            summary: "Students can bring questions about the homework they are working on.",
            pros: ["Students get help while they work, when it helps most.", "Sections are well attended."],
            cons: ["TAs are pushed to give away homework answers.", "Students who haven't started the homework get little out of section."],
          },
          {
            id: "afterHw",
            label: "After the homework deadline",
            summary: "Sections go over the homework that was just due, and practice for what comes next.",
            pros: ["Students get feedback on problems they just worked on.", "No pressure on TAs to give away answers."],
            cons: ["Students who are stuck on the homework have only office hours and the forum before the deadline."],
          },
          {
            id: "spread",
            label: "Spread across the week",
            summary: "Some sections meet before the deadline and some after.",
            pros: ["More section times for students' schedules."],
            cons: [
              "Students in early and late sections get different amounts of help before each deadline and exam, which is unfair if the work counts much.",
              "Quiz questions can spread from earlier sections to later ones.",
              "Consider a common review session before exams, so every student gets the same review.",
            ],
          },
        ],
      },
      {
        id: "switchSection",
        title: "Can students switch sections?",
        why: "Only relevant when there are sections. Full sections and graded section work make switching a common question.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "noSwitch",
            label: "No switching",
            pros: ["Rosters, grading, and room capacity stay predictable."],
            cons: ["Students with a one-time conflict lose that week's section work."],
          },
          {
            id: "oneTime",
            label: "One-time visits with the TA's approval",
            summary: "Permanent switches only through enrollment, if there is space.",
            pros: ["Covers occasional conflicts.", "TAs control their room capacity."],
            cons: ["TAs must handle requests and track visiting students' quizzes."],
          },
          {
            id: "free",
            label: "Any section with space",
            pros: ["Most flexible for students.", "No requests to handle."],
            cons: ["Popular sections overflow.", "Section grades are harder to track."],
          },
        ],
      },
      {
        id: "electronics",
        title: "What is the policy on laptops and phones?",
        why: "Sana, Weston, and Cepeda (2013) found that students multitasking on laptops learned less, and so did the students who could see their screens. Studies comparing handwritten and typed notes are mixed.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "open",
            label: "No restrictions",
            pros: ["No policing.", "Students can use digital notes, the textbook, and accessibility tools."],
            cons: ["Screens distract the students who use them and the students around them."],
          },
          {
            id: "notes",
            label: "Only for course work and note-taking",
            summary: "Devices are allowed for course-related purposes only, and handwritten notes are recommended.",
            pros: ["Allows tablets for notes and phones for polls.", "Sets an expectation without a ban."],
            cons: ["Hard to enforce in a large room.", "Asking a student to leave is a confrontation."],
          },
          {
            id: "none",
            label: "No devices",
            summary: "Laptops and phones are put away, except as an accommodation.",
            pros: ["Removes the distraction for everyone.", "Easy to see whether the policy is followed."],
            cons: [
              "Students who use a device as an accommodation are singled out.",
              "Rules out digital note-taking and phone polls.",
            ],
          },
        ],
      },
      {
        id: "behavior",
        title: "Which classroom expectations should be listed?",
        kind: "multi",
        custom: true,
        options: [
          { id: "respect", label: "Be respectful", summary: "Treat classmates and the teaching staff with kindness." },
          { id: "participate", label: "Participate actively", summary: "Students will work on problems with classmates during class." },
          { id: "ontime", label: "Arrive on time", summary: "Late arrivals disrupt others; unexcused lateness may count as an absence." },
          { id: "questions", label: "Ask questions", summary: "Questions are welcome; if one student is confused, others probably are too." },
        ],
      },
      {
        id: "drops",
        title: "Can students be dropped from the course?",
        why: "Many universities let instructors drop students who do not attend early in the term, which frees seats for waitlisted students. Check your institution's rules before listing these. Dropping is trickier than it looks: students can add the course late, so some students miss the first week or the first assignment because they weren't enrolled yet, and dropped students often ask to be added back, sometimes after their seat has gone to someone on the waitlist.",
        kind: "multi",
        options: [
          { id: "none", label: "Don't mention drops", exclusive: true, pros: ["No drops to process, and no requests to be added back."], cons: ["Students who never intended to take the course keep seats that waitlisted students need."] },
          {
            id: "firstWeek", label: "Missing class during the first week", summary: "Unless excused by emailing you.",
            pros: ["Frees seats early, while waitlisted students can still catch up."],
            cons: [
              "Students who add the course late weren't enrolled in the first week, so you must track when each student added.",
              "Dropped students often ask to be added back, and by then their seat may be gone.",
            ],
          },
          {
            id: "firstHw", label: "Not submitting the first assignment",
            pros: ["An objective rule that the course website can check."],
            cons: [
              "Students who add late may not have had time to submit it.",
              "Dropped students often ask to be added back, and by then their seat may be gone.",
            ],
          },
        ],
      },
    ],
  },

  // ⋘──────── Communication ────────⋙
  {
    id: "communication",
    title: "Communication and help",
    questions: [
      {
        id: "contentQuestions",
        title: "Where should students ask questions about the course content?",
        why: "Choose every place where content questions are welcome. The syllabus lists them and, in the next question, names the channels students should not use for content questions.",
        kind: "multi",
        options: [
          {
            id: "class",
            label: "In class",
            pros: ["A question asked in class helps everyone who has the same confusion.", "You hear right away what is unclear."],
            cons: ["Many students are reluctant to ask in front of a large class."],
          },
          {
            id: "section",
            label: "In discussion sections",
            pros: ["Small groups make asking easier.", "TAs can work through the question at the board."],
            cons: ["Only useful if the class has sections."],
          },
          {
            id: "officeHours",
            label: "In office hours",
            pros: ["Questions turn into conversations, which teach more than written answers.", "You can see the student's work and where they got stuck."],
            cons: ["Students with schedule conflicts get less help.", "Students who are stuck at night or on weekends must wait."],
          },
          {
            id: "forum",
            label: "On an online discussion board",
            summary: "Such as Ed or Piazza, answered by the teaching team and classmates.",
            pros: [
              "Each answer helps every student who has the same question.",
              "Classmates and TAs can answer too, so questions are answered faster.",
              "Anonymous posting helps students who are shy about asking.",
            ],
            cons: ["One more platform for students to check.", "Needs moderation, especially near deadlines."],
            fields: [
              { id: "contact.forum", label: "Discussion board", placeholder: "[Ed Discussion](https://edstem.org/us/courses/12345)", defaultValue: "the course discussion forum", help: "The name of the discussion board, such as Ed Discussion or Piazza. To link to its website, write a Markdown link, such as [Ed Discussion](https://edstem.org/us/courses/12345)." },
            ],
          },
          {
            id: "email",
            label: "By email",
            pros: ["Private, which some students prefer."],
            cons: ["The same question arrives many times.", "Each answer helps only one student.", "Math is hard to write in email."],
          },
        ],
      },
      {
        id: "contentNot",
        title: "Where should students not ask questions about the content?",
        why: "Saying which channels are not for content questions saves you from answering the same question privately many times, and tells students where they will get a faster answer.",
        kind: "multi",
        options: [
          {
            id: "email",
            label: "Not by email",
            summary: "Email is for personal and logistical matters only.",
            pros: ["Keeps your inbox for matters that need your decision.", "Steers questions to places where answers help everyone."],
            cons: ["Students who can't come in person, or are shy about posting, lose a private option."],
          },
          {
            id: "lms",
            label: "Not through course-website messages",
            summary: "Such as Canvas messages, which are easy to miss.",
            pros: ["Messages that might not be seen for days are steered elsewhere."],
            cons: ["One more rule for students to remember."],
          },
          { id: "none", label: "No restrictions", exclusive: true },
        ],
      },
      {
        id: "contact",
        title: "How should students contact you about personal or logistical matters?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "email",
            label: "Email the instructor",
            pros: ["Familiar to everyone.", "Private."],
            cons: ["Your inbox fills up near deadlines."],
          },
          {
            id: "staffEmail",
            label: "A shared course email address",
            summary: "An address read by the whole teaching team.",
            pros: ["Requests are answered even when you are away.", "The team sees every request, so decisions are consistent."],
            cons: ["Needs setting up and a plan for who answers what.", "Some students want to reach the instructor directly."],
            fields: [{ id: "contact.staffEmail", label: "Course email address", placeholder: "math110-staff@example.edu" }],
          },
          {
            id: "lms",
            label: "Messages in the course website",
            pros: ["Messages are kept with the course."],
            cons: ["Many students don't check those messages, so replies go unread."],
          },
        ],
        fields: [{ id: "contact.time", label: "Response time", placeholder: "within two business days", defaultValue: "within two business days" }],
      },
      {
        id: "exceptions",
        title: "How should students ask for exceptions?",
        why: "Extensions, excused absences, and makeup exams. A single, clear process makes decisions consistent and keeps requests from getting lost.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "subject",
            label: "Email with a set subject line",
            summary: "For example, “{{course.code}} - {{exc.subject}}”, with the reason in the body.",
            pros: ["Requests are easy to find and filter.", "No setup."],
            cons: ["Requests still arrive scattered among other email."],
            fields: [{ id: "exc.subject", label: "Subject line", placeholder: "Request for Exception", defaultValue: "Request for Exception" }],
          },
          {
            id: "form",
            label: "An online request form",
            pros: ["Every request has the same information.", "Requests are collected in one list, which the teaching team can share."],
            cons: ["Needs setting up.", "Feels impersonal for serious situations."],
            fields: [{ id: "exc.form", label: "Form link", placeholder: "https://…", wide: true, help: "The form students fill out to request an exception, such as a Google Form or a survey in the course website. The syllabus links to it." }],
          },
          {
            id: "dean",
            label: "Through the Dean of Students for long absences",
            summary: "Short requests by email; absences of more than a week go through the Dean of Students, who notifies all of the student's instructors.",
            pros: ["Students don't have to explain a crisis to every instructor.", "The dean's office can connect students with support."],
            cons: ["Slower.", "Students may not know the office exists."],
            fields: [{ id: "exc.dean", label: "Office", placeholder: "[the Dean of Students](https://example.edu/dean-of-students)", defaultValue: "the Dean of Students", help: "The campus office that verifies emergencies and notifies instructors, often the Dean of Students. To link to its website, write a Markdown link, such as [the Dean of Students](https://example.edu/dean-of-students)." }],
          },
        ],
        fields: [{ id: "exc.docs", label: "Documentation required", kind: "checkbox", help: "Requiring documentation, such as a doctor's note, deters false excuses, but many campus clinics don't write notes for short illnesses, and documentation is harder for some students to get than others. Some universities, including UC Santa Cruz, don't allow instructors to ask for documentation, so check your institution's policy. The syllabus mentions documentation only when this is checked." }],
      },
      {
        id: "officeHours",
        title: "How will office hours work?",
        kind: "single",
        options: [
          {
            id: "fixed",
            label: "Fixed weekly hours",
            pros: ["Predictable for students and for you.", "Students can drop in without arranging anything."],
            cons: ["Students whose schedules conflict cannot come."],
          },
          {
            id: "fixedPlus",
            label: "Fixed weekly hours plus appointments",
            summary: "Students who cannot attend, or are uncomfortable attending, can email for a one-on-one meeting.",
            pros: ["Covers students with conflicts.", "Gives a private option to students who are nervous about asking questions in a group."],
            cons: ["Appointments take more of your time per student."],
          },
          {
            id: "appointment",
            label: "By appointment only",
            pros: ["Fits your schedule.", "No time spent waiting for students who don't come."],
            cons: ["Students must ask first, which many will not do.", "No informal drop-in help."],
          },
        ],
        fields: [{ id: "inst.ohLink", label: "Office hours page (link)", placeholder: "https://…", wide: true, help: "A page with the times and places of office hours for the whole teaching team. The syllabus links to it wherever it mentions office hours." }],
      },
      {
        id: "ohName",
        title: "What should office hours be called?",
        why: "Many students, especially first-generation college students, do not know what office hours are for, and some think they are time for the instructor to work in their office.",
        kind: "single",
        options: [
          {
            id: "office",
            label: "“Office hours”",
            pros: ["The standard name, which matches the rest of the university."],
            cons: ["Some students don't realize that office hours are for them."],
          },
          {
            id: "student",
            label: "“Student hours”",
            summary: "With a sentence saying what they are for.",
            pros: ["Says who the time is for.", "Invites students who would not come otherwise."],
            cons: ["Nonstandard, so it needs a short explanation."],
          },
        ],
      },
      {
        id: "helpPurposes",
        title: "Which kinds of help will you say the purpose of?",
        why: "Students often don't know what each kind of help is for, so they skip the ones that would help them most. Some think office hours are only for students who are failing, or that tutoring is remedial. The syllabus gets a table that says what each chosen kind of help is for and how to prepare, in place of a bare list of resources.",
        kind: "multi",
        options: [
          {
            id: "lectures",
            label: "Lectures",
            summary: "Where new ideas are introduced, and what to do before and after class. The text follows your class format.",
            pros: ["Students learn that lecture is a first exposure, not the whole explanation, and that reviewing notes afterward is part of the work."],
            fields: [{ id: "help.lectures", label: "What lectures are for (leave empty to use the text written for you)", kind: "textarea", wide: true }],
          },
          {
            id: "sections",
            label: "Discussion sections",
            summary: "Practice in a small group, led by a TA.",
            pros: ["Students who know that sections are for practice come ready to work problems, instead of expecting a second lecture."],
            cons: ["Only useful if the class has sections."],
            fields: [{ id: "help.sections", label: "What sections are for (leave empty to use the text written for you)", kind: "textarea", wide: true }],
          },
          {
            id: "officeHours",
            label: "Office hours",
            summary: "Time set aside for students, with or without a prepared question. Uses your name for office hours.",
            pros: [
              "Students who think office hours are for emergencies, or for students who are failing, learn that they are for everyone.",
              "Telling students what to bring makes the time more productive.",
            ],
            cons: ["More students may come than your room or time can handle."],
            fields: [{ id: "help.officeHours", label: "What office hours are for (leave empty to use the text written for you)", kind: "textarea", wide: true }],
          },
          {
            id: "taHours",
            label: "TA office hours",
            summary: "Like the instructor's office hours, at more times during the week.",
            pros: ["Spreads questions across the teaching team.", "Some students are more comfortable asking a TA than the instructor."],
            fields: [{ id: "help.taHours", label: "What TA office hours are for (leave empty to use the text written for you)", kind: "textarea", wide: true }],
          },
          {
            id: "forum",
            label: "Discussion forum",
            summary: "Questions that other students might have too, and what not to post.",
            pros: ["Students search before posting, so the same question is asked less often.", "Sets the rule about posting solutions before it is broken."],
            fields: [
              { id: "contact.forum", label: "Forum", placeholder: "[Ed Discussion](https://edstem.org/us/courses/12345)", defaultValue: "the course discussion forum", help: "The name of the discussion board, such as Ed Discussion or Piazza. To link to its website, write a Markdown link, such as [Ed Discussion](https://edstem.org/us/courses/12345)." },
              { id: "help.forum", label: "What the forum is for (leave empty to use the text written for you)", kind: "textarea", wide: true },
            ],
          },
          {
            id: "studyGroups",
            label: "Classmates and study groups",
            summary: "Working with classmates, within your collaboration policy.",
            pros: ["Students who study together tend to stay in the course and do better.", "Connects the encouragement to the collaboration rules, so students know where the line is."],
            fields: [{ id: "help.studyGroups", label: "What study groups are for (leave empty to use the text written for you)", kind: "textarea", wide: true }],
          },
          {
            id: "tutors",
            label: "Tutoring",
            summary: "Extra practice with a tutor outside the teaching team.",
            pros: ["Students who are reluctant to ask the instructor may be comfortable with a peer tutor."],
            cons: ["Tutors may teach methods or notation that differ from yours, which the text warns about."],
            fields: [
              { id: "support.tutoring", label: "Service", placeholder: "[Learning Support Services](https://example.edu/tutoring)", defaultValue: "the campus tutoring center", help: "The campus tutoring or learning center. To link to its website, write a Markdown link, such as [Learning Support Services](https://example.edu/tutoring)." },
              { id: "help.tutors", label: "What tutoring is for (leave empty to use the text written for you)", kind: "textarea", wide: true },
            ],
          },
          { id: "none", label: "None", summary: "Keep a short list of resources instead.", exclusive: true },
        ],
      },
    ],
  },

  // ⋘──────── Coursework ────────⋙
  {
    id: "coursework",
    title: "Coursework",
    questions: [
      {
        id: "homework",
        title: "What kind of homework?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "problemSets",
            label: "Written problem sets graded for correctness",
            pros: ["Graders see students' reasoning and give partial credit.", "Practices writing out solutions, as on exams."],
            cons: ["Grading takes many hours.", "Solutions are easy to copy from online sources or AI."],
          },
          {
            id: "completion",
            label: "Graded for completion, with solutions posted",
            summary: "Students get full credit for a complete, honest attempt and check their work against solutions.",
            pros: [
              "Low stakes, so students have less reason to copy.",
              "Fast to grade.",
              "Shifts the purpose of homework from earning points to practicing.",
            ],
            cons: ["Little individual feedback.", "Some students submit careless attempts."],
          },
          {
            id: "online",
            label: "Online, auto-graded",
            summary: "A homework system such as WeBWorK, MyOpenMath, or a publisher's platform.",
            pros: ["Instant feedback and several attempts per problem.", "No grading time, so it scales to large classes."],
            cons: [
              "Checks only final answers, not reasoning.",
              "Answers spread quickly among students.",
              "Publisher platforms can cost students money.",
            ],
          },
          {
            id: "reports",
            label: "Reports and projects with code",
            summary: "Students compute, plot, and explain results in written reports.",
            pros: [
              "Close to how engineers and scientists use the material.",
              "Practices computing and technical writing.",
              "Explanations show understanding that a final answer cannot.",
            ],
            cons: ["Grading takes many hours and needs a clear rubric.", "Fewer problems per week than a problem set."],
          },
        ],
        fields: [
          { id: "hw.frequency", label: "How often", placeholder: "weekly", defaultValue: "weekly" },
          { id: "hw.submit", label: "Submitted on", placeholder: "Gradescope" },
        ],
      },
      {
        id: "collaboration",
        title: "Can students work together on homework?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "individual",
            label: "Individual work only",
            pros: ["Each submission shows one student's work."],
            cons: ["Students lose the learning that comes from discussing problems.", "Difficult to enforce."],
          },
          {
            id: "discuss",
            label: "Discuss together, write up alone",
            summary: "Students may discuss problems, but must do their own calculations and write their own solutions.",
            pros: ["Students learn from explaining to each other.", "Keeps each submission individual."],
            cons: ["The line between discussing and copying is blurry, so give examples."],
          },
          {
            id: "groups",
            label: "Group submissions",
            pros: ["Students learn teamwork.", "Fewer submissions to grade."],
            cons: ["Some students do little and earn the same grade.", "Groups need forming and conflicts need resolving."],
            fields: [{ id: "collab.size", label: "Group size", placeholder: "3–4", defaultValue: "3–4", pattern: "\\d+(\\s*[–-]\\s*\\d+)?", patternHint: "a number or a range, such as 3 or 3–4" }],
          },
        ],
      },
      {
        id: "quizzes",
        title: "Will there be quizzes?",
        why: "Frequent low-stakes quizzes are a form of retrieval practice: recalling material strengthens memory of it more than rereading does (the testing effect).",
        kind: "single",
        custom: true,
        options: [
          {
            id: "none",
            label: "No quizzes",
            pros: ["More class time for other work.", "Less grading."],
            cons: ["Students and you learn about gaps only on exams."],
          },
          {
            id: "section",
            label: "Low stakes, weekly in sections, with revision",
            summary: "After a short quiz, students work together, get help from the TA, and revise before submitting.",
            pros: [
              "Retrieval practice followed by immediate feedback.",
              "Revision turns mistakes into learning.",
              "Low stress.",
            ],
            cons: ["Scores say little about individual mastery.", "Takes section time."],
          },
          {
            id: "lecture",
            label: "Low stakes, weekly in lecture",
            summary: "Short quizzes worth little each, often with the lowest ones dropped.",
            pros: ["Retrieval practice every week.", "Encourages keeping up and attending."],
            cons: ["Takes lecture time.", "Grading load grows with class size."],
          },
          {
            id: "highStakes",
            label: "High stakes, graded for correctness",
            summary: "Closed-book quizzes that together count about as much as an exam.",
            pros: ["Proctored evidence of individual mastery throughout the term.", "Spreads exam weight over many smaller events."],
            cons: [
              "Raises stress every week.",
              "Students are graded before they have had time to practice.",
              "Every high-stakes assessment must include disability accommodations, such as extra time or a quiet room. That means scheduling students to take each quiz in a separate testing center.",
            ],
            fields: [{ id: "quiz.where", label: "Given in", placeholder: "discussion sections", defaultValue: "discussion sections" }],
          },
          {
            id: "online",
            label: "Low stakes, online, open book",
            pros: ["No class time needed.", "Auto-graded."],
            cons: ["Easy to complete with outside help, so scores mean little."],
          },
        ],
      },
      {
        id: "rubric",
        title: "Explain how written work is scored?",
        kind: "single",
        options: [
          {
            id: "fourPart",
            label: "Four-part rubric",
            summary: "Correctness, explanations, effort, and presentation.",
            pros: ["Students know that explanations and clear presentation count.", "Partial credit for effort encourages attempting hard problems."],
            cons: ["Graders need training to apply it consistently."],
            fields: [{ id: "rubric.image", label: "Point breakdown (optional)", placeholder: "About 50% correctness, 30% explanations, 10% effort, 10% presentation", wide: true }],
          },
          {
            id: "showWork",
            label: "“Show your work” statement",
            summary: "Credit comes from correct answers with supporting work; partial credit for valid methods with mistakes.",
            pros: ["Short and familiar."],
            cons: ["Students don't learn how much explanations count."],
          },
          {
            id: "none",
            label: "Don't explain",
            pros: ["Shorter syllabus."],
            cons: ["More grade disputes, since students don't know what is expected."],
          },
        ],
      },
    ],
  },

  // ⋘──────── Exams ────────⋙
  {
    id: "exams",
    title: "Exams",
    questions: [
      {
        id: "examSchedule",
        title: "How many exams?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "twoMidterms",
            label: "Two midterms and a cumulative final",
            pros: [
              "Two early checks on progress.",
              "Each exam carries less weight than with one midterm.",
              "A cumulative final encourages remembering earlier material.",
            ],
            cons: ["Three high-stakes days.", "Each midterm takes a class day."],
          },
          {
            id: "oneMidterm",
            label: "One midterm and a cumulative final",
            pros: ["Loses only one class day."],
            cons: ["Each exam weighs more, so one bad day hurts more.", "Only one early check."],
          },
          {
            id: "frequent",
            label: "Frequent shorter exams",
            summary: "Four to six exams of 30–50 minutes, possibly with a final.",
            pros: ["Retrieval practice throughout the term.", "Each exam is lower stakes.", "Students get feedback while there is time to change."],
            cons: ["More exams to write and grade.", "Less time per topic within each exam."],
          },
          {
            id: "project",
            label: "Midterms and a final project",
            pros: ["A project can be more realistic and more motivating than an exam."],
            cons: ["Harder to verify individual work, especially with AI tools.", "Covers fewer topics than a final exam."],
          },
        ],
        fields: [{ id: "exam.dates", label: "Midterm dates", kind: "dates", wide: true }],
      },
      {
        id: "examDay",
        title: "When are midterm exams held?",
        why: "Check the academic calendar before setting exam dates: a holiday on the exam day, or in the days just before it, takes away a class or review session, and students who travel for a long weekend study less. The holiday notes on the options follow the term in Course basics.",
        kind: "single",
        options: [
          { id: "monday", label: "Monday, in class", pros: ["Students have the weekend to study."], cons: ["Students cram over the weekend, when little help is available."] },
          { id: "tuesday", label: "Tuesday, in class", pros: ["Students have the weekend and Monday to study."], cons: ["Monday holidays take away the last class or review session before the exam."] },
          { id: "wednesday", label: "Wednesday, in class", pros: ["A review session or office hours fit in on Monday and Tuesday.", "Few holidays fall on Wednesdays."], cons: ["Splits the week, so Monday is the only class to review in."] },
          { id: "thursday", label: "Thursday, in class", pros: ["A review session or office hours fit in earlier in the week.", "Students who take a long weekend afterward have finished the exam."], cons: ["Thanksgiving falls on a Thursday in the fall."] },
          { id: "friday", label: "Friday, in class", pros: ["Students can relax over the weekend afterward.", "A full week of class before the exam."], cons: ["More students are absent on Fridays, for travel and long weekends."] },
          { id: "section", label: "In discussion sections", pros: ["Small rooms are easy to proctor."], cons: ["Sections need different versions of the exam, since students talk between sections.", "Section lengths are often short for an exam."] },
          {
            id: "evening", label: "In the evening, outside class time",
            summary: "A common exam time for every section of the course.",
            pros: ["Longer than a class period, so the exam can be less rushed.", "Every student takes the same exam at the same time."],
            cons: ["Conflicts with other classes, jobs, and family obligations, so you need a conflict exam.", "Needs large rooms booked in advance."],
            fields: [{ id: "exam.evening", label: "Time", placeholder: "7:00–9:00 pm", defaultValue: "7:00–9:00 pm" }],
          },
        ],
      },
      {
        id: "examAids",
        title: "What can students bring to exams?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "closed",
            label: "Closed book, no notes",
            pros: ["Simple to administer.", "Encourages memorizing key definitions and formulas."],
            cons: ["Rewards memorizing formulas that engineers would look up.", "Raises anxiety."],
          },
          {
            id: "sheet",
            label: "One handwritten note sheet",
            pros: ["Making the sheet is a good study activity.", "Lowers anxiety about forgetting a formula."],
            cons: ["Some students copy worked examples instead of learning methods."],
            fields: [{ id: "exam.sheet", label: "Sheet size", placeholder: "one 8.5″ × 11″ sheet, both sides", defaultValue: "one 8.5″ × 11″ sheet, both sides" }],
          },
          {
            id: "open",
            label: "Open book and notes",
            pros: ["Questions can test applying ideas instead of recalling them.", "Lowest anxiety."],
            cons: ["Students who rely on looking things up run out of time.", "Questions are harder to write."],
          },
        ],
      },
      {
        id: "calculators",
        title: "What calculators are allowed?",
        kind: "single",
        options: [
          {
            id: "none",
            label: "No calculators",
            pros: ["Exams test methods, not button-pressing.", "Equal for all students."],
            cons: ["Problems must have numbers that work out by hand."],
          },
          {
            id: "scientific",
            label: "Scientific only",
            pros: ["Arithmetic help without matrix or symbolic solvers.", "Inexpensive."],
            cons: ["Checking each student's model takes time."],
          },
          {
            id: "graphing",
            label: "Scientific or graphing",
            pros: ["Students can use the calculator they already own."],
            cons: [
              "Graphing calculators can row-reduce and invert matrices, which some questions must account for.",
              "Students without one are at a disadvantage.",
            ],
          },
          {
            id: "any",
            label: "Any calculator, but no phones",
            pros: ["No checking at the door."],
            cons: ["Advanced calculators can solve whole problems."],
          },
        ],
      },
      {
        id: "passGate",
        title: "Must students pass the exams to pass the course?",
        why: "When homework can be copied or written by AI, proctored exams are the most reliable evidence of each student's individual mastery.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "none",
            label: "No; only the weighted total counts",
            pros: ["Simple, and every point counts the same way.", "Strong homework can make up for one bad exam."],
            cons: ["A student who copies homework can pass with weak exam scores."],
          },
          {
            id: "kOfN",
            label: "A minimum score on most exams",
            summary: "For example, at least 65% on at least two of the three exams.",
            pros: [
              "A passing grade shows individual, proctored competence.",
              "Removes the payoff from copying homework.",
              "Allows one bad exam.",
            ],
            cons: [
              "A student can fail with a passing weighted total, which surprises students unless it is stated clearly.",
              "A student can fail before the final exam: with 2 of 3 required, missing the minimum on both midterms means failing with weeks of the term left and no reason to keep working. Decide what you will tell those students, such as whether to withdraw before the deadline.",
              "Raises the stakes of exams.",
              "Check that your department allows it.",
            ],
            fields: [
              { id: "gate.pct", label: "Minimum score", placeholder: "65%", defaultValue: "65%", ...PERCENT },
              { id: "gate.k", label: "On at least", kind: "number", placeholder: "2", defaultValue: "2" },
              { id: "gate.n", label: "Of the exams", kind: "number", placeholder: "3", defaultValue: "3", help: "Filled in from your exam schedule and midterm dates (midterms plus the final exam) until you change it." },
            ],
          },
          {
            id: "final",
            label: "Must pass the final exam",
            pros: ["Ensures that students who pass know the whole course."],
            cons: ["Everything rides on one day."],
            fields: [{ id: "gate.finalPct", label: "Minimum final exam score", placeholder: "60%", defaultValue: "60%", ...PERCENT }],
          },
        ],
      },
      {
        id: "secondChance",
        title: "Can students recover from a bad exam?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "none",
            label: "No",
            pros: ["Simple.", "Every exam counts as written."],
            cons: ["One bad day can sink a grade.", "Students who improve late are not rewarded."],
          },
          {
            id: "replace",
            label: "The final replaces the lowest midterm",
            summary: "If the final exam percentage is higher than the lowest midterm percentage, it replaces it.",
            pros: ["Rewards growth.", "Covers an illness or bad day without documentation.", "No extra exams to write."],
            cons: [
              "Some students put less effort into midterms.",
              "Combined with a minimum score on most exams, students will assume that a strong final also makes up a failed midterm for the pass requirement. Say whether it does (next question).",
            ],
          },
          {
            id: "corrections",
            label: "Exam corrections",
            summary: "Students explain and correct their mistakes to earn back part of the lost points.",
            pros: ["Students learn from their mistakes instead of only seeing the score."],
            cons: ["More grading.", "Corrections can be copied from classmates."],
            fields: [{ id: "exam.correctionShare", label: "Share of points earned back", placeholder: "half", defaultValue: "half" }],
          },
          {
            id: "retake",
            label: "Retakes",
            summary: "Students can take a second version of an exam, and the higher score counts.",
            pros: ["Builds mastery.", "Lowers anxiety."],
            cons: ["Writing, proctoring, and grading extra exams takes much more time."],
          },
        ],
      },
      {
        id: "gateSecondChance",
        title: "Do second chances count toward the pass requirement?",
        why: "When passing requires a minimum score on most exams, a second chance (a final that replaces a midterm, corrections, or a retake) raises a question that students will ask: does the improved score count toward the requirement, or only toward the weighted total? The syllabus states the answer next to the requirement.",
        kind: "single",
        relevant: s => s.choice.passGate === "kOfN" && ["replace", "corrections", "retake"].includes(s.choice.secondChance),
        irrelevantNote: "Only needed when passing requires a minimum score on most exams and students have a second chance on exams.",
        options: [
          {
            id: "original",
            label: "No: the requirement uses the original exam scores",
            summary: "The second chance changes only the weighted total.",
            pros: ["The requirement still shows competence on proctored exams, as first taken.", "Simple to check."],
            cons: [
              "A student who failed two midterms has already failed the course before the final, however well they do on it.",
              "Students who misread the policy will be upset at the end of the term, so state it plainly.",
            ],
          },
          {
            id: "improved",
            label: "Yes: the improved scores count",
            summary: "For a final that replaces the lowest midterm, the final counts in place of that midterm.",
            pros: ["Students who fail early still have a path to passing, so they keep working.", "Rewards students who learn the material by the end."],
            cons: [
              "With a final that replaces a midterm, a passing final score counts twice, so it can satisfy “2 of 3” almost on its own. Check that this is what you want.",
              "Corrected or retaken scores are less proctored evidence than first attempts.",
            ],
          },
        ],
      },
      {
        id: "missedExam",
        title: "What happens if a student misses an exam?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "makeup",
            label: "Makeup exam for an excused absence",
            pros: ["Every student takes every exam."],
            cons: ["Writing and proctoring makeups takes time.", "Students taking a makeup can learn about the exam from classmates."],
          },
          {
            id: "shift",
            label: "Weight moves to the final for an excused absence",
            pros: ["No makeup exams to write.", "The final covers the same material."],
            cons: ["Puts more weight on one exam."],
          },
          {
            id: "zero",
            label: "Zero unless arranged in advance",
            pros: ["Strong incentive to attend."],
            cons: ["Harsh for sudden illness and emergencies."],
          },
        ],
      },
      {
        id: "examVersions",
        title: "How many versions of each exam will there be?",
        why: "Versions differ in the order of problems or in the numbers, so that a student can't copy from a neighbor. More versions make copying harder but take longer to write, check, and grade. The teaching team syllabus tells proctors how to hand them out.",
        kind: "single",
        options: [
          {
            id: "one",
            label: "One version",
            pros: ["Easiest to write, check, and grade."],
            cons: ["In a crowded hall, students can easily copy from their neighbors.", "Works only with an empty seat between students, as in a small class with a large room."],
          },
          {
            id: "two",
            label: "Two versions",
            summary: "Handed out in alternating seats, so that neighbors have different versions.",
            pros: ["Students can't read the answers of the students beside them."],
            cons: ["A student who arrives late may find the only empty seat between two students with different versions, so either version lets them copy one neighbor.", "Twice the solutions and rubrics to check."],
          },
          {
            id: "three",
            label: "Three versions",
            summary: "Two alternate in the seats; the third goes to students who arrive late and to students at the testing center.",
            pros: ["Late arrivals get a version that neither neighbor has.", "Students who take the exam at the testing center after the main exam get a version that nobody can share with them."],
            cons: ["The most work to write, check, and grade, and the versions must be equally difficult."],
          },
        ],
      },
      {
        id: "accommodationTiming",
        title: "When do students with testing accommodations take exams?",
        why: "Students with accommodations, such as extra time or a quiet room, often take exams at a testing center, whose hours may not match your exam. Taking the exam at a different time lets answers be shared, so decide which times you allow, and with what safeguards.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "same",
            label: "At the same time as the main exam",
            summary: "The accommodated exam starts when the main exam starts.",
            pros: ["Nobody can share questions or answers.", "Corrections announced during the exam reach the testing center in time."],
            cons: ["The testing center may not have room at that time, and students with extended time may have conflicts with their next class."],
          },
          {
            id: "window",
            label: "Within a range of start times",
            summary: "Students may start the exam any time from {{accom.window}}.",
            pros: ["Fits around the student's other classes and the testing center's hours.", "A short range keeps the time for sharing questions short."],
            cons: ["Students who start early can pass on the questions, and students who start late can learn them; ask students not to discuss the exam, and consider a separate version (see the question above)."],
            fields: [{ id: "accom.window", label: "Start times allowed", placeholder: "2 hours before to 2 hours after the main exam starts", defaultValue: "2 hours before to 2 hours after the main exam starts", help: "The earliest and latest times a student may start the exam, relative to the main exam, such as “1 hour before to 3 hours after the main exam starts”." }],
          },
          {
            id: "either",
            label: "Any time on the same day",
            pros: ["Flexible, while keeping the window short."],
            cons: ["Both early and late takers can share questions."],
          },
        ],
      },
    ],
  },

  // ⋘──────── Grades ────────⋙
  {
    id: "grades",
    title: "Grades",
    questions: [
      {
        id: "approach",
        title: "How will letter grades be determined?",
        kind: "single",
        options: [
          {
            id: "fixed",
            label: "Weighted total with a fixed scale",
            pros: ["Transparent: students can compute their own grade.", "Students are not competing, so they can help each other."],
            cons: ["An exam that turns out too hard lowers everyone's grade."],
          },
          {
            id: "fixedLower",
            label: "Fixed scale that may only be lowered",
            summary: "The thresholds are guaranteed; at the end of the term, you may lower them but never raise them.",
            pros: ["As transparent as a fixed scale.", "Lets you correct for an exam that was too hard."],
            cons: ["Students may count on a lowering that does not come."],
          },
          {
            id: "curve",
            label: "Curve",
            summary: "Grades depend on rank in the class.",
            pros: ["Corrects automatically for exams that were too hard or too easy."],
            cons: [
              "Students compete with each other, which discourages working together.",
              "A student's grade depends on others' performance, not only their own.",
            ],
            fields: [{ id: "curve.target", label: "Target", placeholder: "a median grade of B", defaultValue: "a median grade of B" }],
          },
          {
            id: "specs",
            label: "Specifications grading",
            summary: "Each assignment is graded Satisfactory or Not Yet; the letter grade depends on which assignments are completed satisfactorily (Nilson, 2015).",
            pros: ["Clear standards and fewer disputes over partial credit.", "Revisions build mastery.", "Fast grading of each submission."],
            cons: ["Unfamiliar to students, so it needs explaining.", "Designing the bundles takes time.", "Revisions add grading."],
          },
          {
            id: "standards",
            label: "Standards-based grading",
            summary: "Students are assessed on a list of skills, each marked Mastered or Not Yet, with reassessments during the term.",
            pros: ["Students see exactly which skills they have mastered.", "Rewards eventual mastery, not speed."],
            cons: ["Reassessments are hard to run in a large class.", "Unfamiliar to students and advisors."],
          },
        ],
        fields: [{ id: "specs.table", label: "For specifications or standards-based grading: requirements for each grade (one per line: grade | requirements)", kind: "textarea", wide: true, placeholder: "A | All 12 standards mastered and 4 of 5 projects satisfactory\nB | 10 standards mastered and 3 projects satisfactory" }],
      },
      {
        id: "examWeight",
        title: "How much of the grade should come from proctored exams?",
        why: "This guides the weights below. Weight on proctored work is the main protection against copied and AI-written work.",
        kind: "single",
        options: [
          {
            id: "low",
            label: "Less than 40%",
            pros: ["Lower stakes and less test anxiety.", "Rewards steady work."],
            cons: ["Grades can reflect copied or AI-written work.", "Grades say less about what each student can do alone."],
          },
          {
            id: "mid",
            label: "40–60%",
            pros: ["Balances steady work and individual mastery."],
            cons: ["Still needs an integrity strategy for homework."],
          },
          {
            id: "high",
            label: "More than 60%",
            pros: ["Grades mostly reflect individual, proctored work."],
            cons: ["One bad exam day has a large effect.", "Students may skip homework, which is where they practice."],
          },
        ],
      },
      {
        id: "weights",
        title: "Grade components and weights",
        why: "Rows with a weight of zero are left out of the syllabus. The description of each row is written from your other answers unless you write your own.",
        kind: "weights",
      },
      {
        id: "dropLowest",
        title: "Drop the lowest scores?",
        kind: "single",
        options: [
          {
            id: "none",
            label: "No drops",
            pros: ["Every assignment counts, so students do them all."],
            cons: ["Students must ask for extensions for every illness."],
          },
          {
            id: "drop",
            label: "Drop the lowest few",
            pros: ["Covers illness and emergencies without paperwork.", "Fewer extension requests."],
            cons: ["Students may skip assignments whose material then appears on exams."],
            fields: [
              { id: "drop.hw", label: "Homework dropped", kind: "number", placeholder: "1", defaultValue: "1" },
              { id: "drop.quiz", label: "Quizzes dropped", kind: "number", placeholder: "1", defaultValue: "1" },
            ],
          },
        ],
      },
      {
        id: "scale",
        title: "Grade scale",
        why: "Choose a starting point, then edit the thresholds.",
        kind: "scale",
        options: [
          {
            id: "plusMinus",
            label: "With + and −",
            pros: ["Finer distinctions reward effort near a boundary."],
            cons: ["More boundaries means more students just below one, asking for points."],
          },
          {
            id: "aPlus",
            label: "With +, −, and A+",
            pros: ["Recognizes exceptional work."],
            cons: ["At many universities, an A+ counts the same as an A in the GPA."],
          },
          {
            id: "letters",
            label: "Letters only",
            pros: ["Fewer boundaries and disputes."],
            cons: ["Large jumps at each boundary: 89.9% and 80% get the same grade."],
          },
        ],
        fields: [
          { id: "scale.describe", label: "Describe what each letter grade means", kind: "checkbox" },
          { id: "scale.points", label: "Also show points out of", kind: "number", placeholder: "1000", help: "Leave empty to show only percentages. Points help students who track their grade by adding points in the learning management system." },
        ],
      },
      {
        id: "rounding",
        title: "Will final percentages be rounded?",
        kind: "single",
        options: [
          {
            id: "none",
            label: "No rounding",
            pros: ["The thresholds mean exactly what they say."],
            cons: ["A student at 89.98% gets a B+ and will likely email you."],
          },
          {
            id: "nearest",
            label: "Round to the nearest whole percent",
            pros: ["Removes the most painful near-misses."],
            cons: ["Moves the boundary instead of removing it: 89.4% still misses."],
          },
          {
            id: "judgment",
            label: "Borderline grades decided by overall work",
            summary: "Students within 1% of a threshold may be moved up based on their exams or participation.",
            pros: ["Lets you reward improvement and engagement."],
            cons: ["Subjective, so students may see it as unfair.", "Invites lobbying."],
          },
        ],
      },
      {
        id: "late",
        title: "What is the late work policy?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "none",
            label: "Not accepted",
            pros: ["Solutions can be posted right after the deadline.", "Simple."],
            cons: ["Harsh for emergencies, so you'll handle many extension requests."],
          },
          {
            id: "penalty",
            label: "Penalty per day, up to a limit",
            pros: ["Flexibility at a cost that students can predict.", "Keeps students close to the schedule."],
            cons: [
              "Delays posting solutions.",
              "Calculating penalties takes bookkeeping (most platforms automate it).",
              "Platforms apply penalties differently. Canvas's automatic late policy lowers the maximum score instead of subtracting from the score: with a 30% penalty, a late submission that earns 70% keeps its 70%, and only scores above 70% are reduced. Choose the rule below that matches how your platform applies it.",
            ],
            fields: [
              { id: "late.pct", label: "Penalty per day", placeholder: "10%", defaultValue: "10%", ...PERCENT },
              { id: "late.days", label: "Up to (days)", kind: "number", placeholder: "3", defaultValue: "3" },
              { id: "late.cap", label: "The penalty lowers the maximum score (as Canvas applies it), rather than being subtracted from the score", kind: "checkbox", help: "Subtracted: a 70% submitted one day late with a 10% penalty becomes 60%. Lowers the maximum: the most it can earn is 90%, so a 70% stays 70% and a 95% becomes 90%. Canvas's automatic late policy lowers the maximum. The syllabus describes the rule you choose here, so it matches what students will see." },
            ],
          },
          {
            id: "tokens",
            label: "Late days to spend",
            summary: "Each student gets a few late days to use on any assignments, no questions asked.",
            pros: ["Flexibility without judging excuses.", "Far fewer extension emails.", "Teaches planning."],
            cons: ["Tracking each student's balance takes bookkeeping.", "Students who spend their late days early have none left for an emergency."],
            fields: [{ id: "late.tokens", label: "Late days", kind: "number", placeholder: "4", defaultValue: "4" }],
          },
          {
            id: "flexible",
            label: "Accepted without penalty until a final date",
            pros: ["Compassionate.", "Students focus on learning, not deadlines."],
            cons: ["Work piles up at the end of the term.", "Solutions can't be posted until the final date."],
            fields: [{ id: "late.final", label: "Final date", placeholder: "the last day of instruction", defaultValue: "the last day of instruction" }],
          },
        ],
      },
      {
        id: "turnaround",
        title: "How quickly will graded work be returned?",
        why: "Feedback helps most when it arrives before students do the next assignment on the same topic.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "oneWeek",
            label: "Within one week",
            pros: ["Students get feedback before the next assignment.", "Grades stay current, so students know where they stand."],
            cons: ["Grading must keep pace, which is hard in weeks with exams."],
          },
          {
            id: "twoWeeks",
            label: "Within two weeks",
            pros: ["A promise that the teaching team can keep in busy weeks."],
            cons: ["Students may repeat a mistake on the next assignment before seeing feedback."],
          },
          {
            id: "beforeExam",
            label: "Before the next exam",
            summary: "Exams within one week; everything covered by an exam returned before that exam.",
            pros: ["Guarantees feedback when it matters most.", "Flexible in other weeks."],
            cons: ["Students may go weeks without grades."],
          },
        ],
      },
      {
        id: "regrades",
        title: "How do students request a regrade?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "platform",
            label: "Through the grading platform",
            pros: ["Requests are tracked and go to the right grader.", "Easy for students."],
            cons: ["Easy requests mean more requests."],
            fields: [
              { id: "regrade.platform", label: "Platform", placeholder: "[Gradescope](https://www.gradescope.com/courses/12345)", defaultValue: "Gradescope", help: "The website where students submit work and see their grades, such as Gradescope. To link to it, write a Markdown link: [Gradescope](https://www.gradescope.com/courses/12345). The syllabus shows it as a link wherever it names the platform." },
              { id: "regrade.help", label: "Instructions for requesting a regrade (link)", placeholder: "https://guides.gradescope.com/hc/en-us/articles/…", wide: true, help: "A page that shows students how to submit a regrade request on the platform, such as the platform's help article. The syllabus links to it from the regrade policy and the FAQ." },
            ],
          },
          {
            id: "written",
            label: "Written request; the whole assignment may be regraded",
            pros: ["Discourages requests for points without reason."],
            cons: ["Discourages legitimate requests too, especially from less confident students."],
          },
          {
            id: "person",
            label: "In person, in office hours",
            pros: ["Turns the request into a conversation about the material."],
            cons: ["Students with conflicts can't come.", "Some students are uncomfortable asking face to face."],
          },
        ],
      },
      {
        id: "regradeHandler",
        title: "Who handles regrade requests?",
        why: "Regrade requests arrive all term. Deciding who answers them, and when they go to you, keeps answers consistent and keeps students from asking several people until one says yes. The student syllabus says who answers and how soon; the teaching team syllabus says how to handle requests.",
        relevant: s => !!s.choice.regrades,
        irrelevantNote: "Only needed once you choose how students request regrades (Grades).",
        kind: "single",
        custom: true,
        options: [
          {
            id: "grader",
            label: "The person who graded the problem",
            summary: "The grader answers, and forwards requests about policy, or that they are unsure about, to you.",
            pros: ["The grader knows the rubric and the mistakes they saw.", "Spreads the work across the team."],
            cons: ["Graders may defend their own grading.", "Answers vary between graders unless they share rubric changes."],
          },
          {
            id: "instructor",
            label: "The instructor",
            pros: ["Consistent answers.", "You see where the rubric or the problems were unclear."],
            cons: ["A lot of work in a large class, concentrated after each exam."],
          },
          {
            id: "headTA",
            label: "One designated TA",
            summary: "One TA answers every request and forwards hard cases to you.",
            fields: [{ id: "team.regradeTA", label: "TA", placeholder: "Ada Lovelace" }],
            pros: ["Consistent answers without all of the work falling on you."],
            cons: ["A heavy load for one TA after exams; adjust their other duties."],
          },
        ],
        fields: [{ id: "team.regradeDue", label: "Answered within", placeholder: "one week", defaultValue: "one week" }],
      },
      {
        id: "regradeDeadline",
        title: "When must regrade requests be submitted?",
        why: "Without a deadline, requests for the whole term arrive in the last week, when students start counting points toward a grade cutoff and the graders no longer remember the rubric.",
        relevant: s => !!s.choice.regrades,
        irrelevantNote: "Only needed once you choose how students request regrades.",
        kind: "single",
        options: [
          {
            id: "window",
            label: "Within a set time after grades are released",
            summary: "Each assignment's regrade window closes {{regrade.window}} after its grades are released.",
            pros: ["Requests arrive while graders still remember the rubric.", "Students check their feedback right away.", "No pile of requests at the end of the term."],
            cons: ["Students who miss the window lose the chance, even for a real grading error; decide whether to fix obvious errors anyway."],
            fields: [{ id: "regrade.window", label: "Window", placeholder: "one week", defaultValue: "one week" }],
          },
          {
            id: "beforeFinal",
            label: "By one date near the end of the term",
            summary: "Every request is due by {{regrade.final}}.",
            pros: ["One deadline to remember."],
            cons: ["Requests from the whole term arrive at once, when you are busiest.", "Students go back over early assignments looking for points."],
            fields: [{ id: "regrade.final", label: "Deadline", placeholder: "the last day of instruction", defaultValue: "the last day of instruction" }],
          },
          {
            id: "none",
            label: "No deadline",
            pros: ["Real grading errors can always be fixed."],
            cons: ["Requests pile up at the end of the term, and some arrive after grades are submitted."],
          },
        ],
      },
      {
        id: "extraCredit",
        title: "Will there be extra credit?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "none",
            label: "No extra credit",
            pros: ["Grades reflect the assigned work.", "Avoids end-of-term requests for one more chance."],
            cons: ["No way to recognize work beyond the assignments."],
          },
          {
            id: "small",
            label: "Small, available to everyone",
            summary: "Optional activities worth a few percent, announced to the whole class.",
            pros: ["Rewards curiosity, such as reporting errors in the textbook or attending a seminar."],
            cons: [
              "Students with less free time, such as those who work, can't take part as easily.",
              "A maximum total is hard to enforce: gradebooks such as Canvas add extra credit without a limit, so you must check every student's total by hand. Giving each opportunity a fixed value, and offering only a few, limits the total without a cap.",
            ],
            fields: [
              { id: "extra.each", label: "Each opportunity is worth (optional)", placeholder: "0.5% of the final grade" },
              { id: "extra.cap", label: "Maximum in total (optional)", placeholder: "2% of the final grade", help: "Leave empty to set no maximum. A maximum must be enforced by hand, since gradebooks don't cap extra credit, and students whose extra credit goes over it ask why it didn't count." },
            ],
          },
          {
            id: "bonus",
            label: "Bonus questions on exams",
            pros: ["Challenges the strongest students.", "Available to everyone during the exam."],
            cons: ["Takes exam time from students who are still working on the required questions."],
          },
        ],
      },
    ],
  },

  // ⋘──────── Integrity ────────⋙
  {
    id: "integrity",
    title: "Academic integrity and AI",
    questions: [
      {
        id: "integrityStyle",
        title: "How should the integrity policy be presented?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "formal",
            label: "The policy and its penalties",
            pros: ["Short and unambiguous."],
            cons: ["Reads as a threat, and doesn't say why integrity matters."],
          },
          {
            id: "guardrails",
            label: "Explain why, and describe the guardrails",
            summary: "Explains that shortcuts harm learning, then describes how the course is designed to catch and discourage cheating.",
            pros: [
              "Students who understand the reasons are more likely to comply.",
              "Describing how cheating is detected deters it.",
              "Frames the policy as being on the students' side.",
            ],
            cons: ["Longer."],
          },
          {
            id: "pledge",
            label: "Honor pledge",
            summary: "Students sign a pledge on each exam.",
            pros: ["Signing a pledge just before an exam reminds students of their commitment."],
            cons: ["Little effect without a culture of honor that the institution supports."],
            fields: [{ id: "integrity.pledge", label: "Pledge", placeholder: "I have neither given nor received unauthorized help on this exam.", defaultValue: "I have neither given nor received unauthorized help on this exam.", wide: true }],
          },
        ],
        fields: [{ id: "integrity.office", label: "Office that handles misconduct reports", placeholder: "[the Academic Integrity Office](https://example.edu/integrity)", defaultValue: "the Academic Integrity Office", help: "The campus office that receives reports of academic misconduct. Find it on your institution's academic integrity or student conduct page. To link to its website, write a Markdown link, such as [the Academic Integrity Office](https://example.edu/integrity)." }],
      },
      {
        id: "ai",
        title: "What is the policy on generative AI?",
        why: "AI detectors are unreliable: Liang et al. (2023) found that they flagged most essays by non-native English speakers as AI-written. A policy that depends on detection will produce false accusations.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "prohibited",
            label: "Prohibited",
            pros: ["Clear.", "Students practice every skill themselves."],
            cons: [
              "Impossible to enforce on take-home work.",
              "Students lose a legitimate tool for getting explanations.",
            ],
          },
          {
            id: "learning",
            label: "For learning, but not for assigned problems",
            summary: "Students may ask AI to explain concepts or debug code, but not to solve assigned questions, and must be able to explain everything they submit.",
            pros: ["Allows the uses that help learning.", "The “must be able to explain” rule can be checked in person."],
            cons: ["The boundary depends on student honesty.", "Still hard to enforce on take-home work."],
            fields: [{ id: "ai.guide", label: "Link to a guide on using AI productively (optional)", placeholder: "https://…", wide: true, help: "A page on using AI tools for learning, such as a campus guide or your own page. The syllabus links to it from the AI policy." }],
          },
          {
            id: "disclose",
            label: "Allowed with disclosure",
            summary: "Students may use AI on homework if they describe how they used it.",
            pros: ["Honest about how students actually work.", "Disclosure statements show you how students use AI."],
            cons: ["Hard to grade what is the student's own work.", "Students may underreport."],
          },
          {
            id: "integrated",
            label: "Integrated into assignments",
            summary: "Some assignments ask students to use AI and evaluate its output.",
            pros: ["Prepares students for how AI is used at work.", "Teaches students to check AI output critically."],
            cons: [
              "Students may skip practicing basic skills.",
              "Paid AI tools give some students an advantage.",
              "Assignments must be redesigned.",
            ],
          },
        ],
      },
    ],
  },

  // ⋘──────── Materials ────────⋙
  {
    id: "materials",
    title: "Materials",
    questions: [
      {
        id: "textbook",
        title: "What textbook will students use?",
        why: "Surveys repeatedly find that most college students have skipped buying a required textbook because of its cost.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "oer",
            label: "Free, openly licensed textbook",
            summary: "Open educational resources, such as OpenStax or LibreTexts.",
            pros: ["Every student has the book on the first day.", "You can adapt and redistribute it."],
            cons: ["Fewer exercises and supplements than some commercial books.", "Quality varies."],
          },
          {
            id: "library",
            label: "Free through the library",
            summary: "An ebook that the university library licenses.",
            pros: ["Free to students.", "Often a well-known, polished text."],
            cons: ["Off-campus access needs a VPN or sign-in, so describe how to get access (below).", "Some licenses limit downloads or simultaneous readers."],
          },
          {
            id: "commercial",
            label: "Commercial textbook",
            pros: ["Polished, with many exercises and supplements."],
            cons: ["Costs students $100 or more.", "Students who can't afford it fall behind."],
            fields: [{ id: "book.where", label: "Where to get it", placeholder: "the campus bookstore", defaultValue: "the campus bookstore" }],
          },
          {
            id: "notes",
            label: "Your own notes",
            pros: ["Matches the course exactly.", "Free."],
            cons: ["Takes a long time to write.", "Students have no second explanation to turn to."],
          },
        ],
        fields: [
          {
            id: "book.list", label: "Books", kind: "rows", wide: true, addLabel: "Add a book",
            columns: [
              { label: "Required or optional", options: ["Required", "Optional"] },
              { label: "Title", placeholder: "Applied Linear Algebra and Matrix Analysis", span: 2 },
              { label: "Author and year", placeholder: "Thomas S. Shores (2018)" },
              { label: "Link", placeholder: "https://…", span: 2 },
              { label: "Note (optional)", placeholder: "The main textbook for our class.", span: 3, long: true },
            ],
          },
          { id: "book.access", label: "How students get access (optional)", kind: "textarea", wide: true, placeholder: "Sign in with your university account. Off campus, connect to the campus VPN first.", help: "Anything students need to do to read the books: signing in, using a VPN or library proxy, redeeming an access code, or picking up a course reader. Leave empty if the links in the list are enough." },
          { id: "book.accessLink", label: "Access instructions (link, optional)", placeholder: "https://…", wide: true, help: "A page with step-by-step instructions, such as the library's off-campus access guide or the campus VPN page." },
        ],
      },
      {
        id: "software",
        title: "What software is required?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "matlab",
            label: "MATLAB",
            pros: ["Widely used in engineering.", "Excellent documentation and toolboxes."],
            cons: ["Students lose access when their university license ends."],
          },
          {
            id: "python",
            label: "Python",
            pros: ["Free and open source.", "Used across industry and science."],
            cons: ["Installing packages trips up beginners; consider a hosted notebook service."],
          },
          {
            id: "either",
            label: "MATLAB or Python",
            summary: "Instruction in one language; students comfortable with the other may use it.",
            pros: ["Students with experience can use what they know."],
            cons: ["Two sets of solutions and help to provide."],
          },
          {
            id: "none",
            label: "None",
            pros: ["No setup."],
            cons: ["Students don't practice computation, which most STEM careers need."],
          },
        ],
        fields: [{ id: "software.link", label: "Link to installation instructions (optional)", placeholder: "https://…", wide: true }],
      },
    ],
  },

  // ⋘──────── Platforms ────────⋙
  {
    id: "platforms",
    title: "Course website and grading platform",
    intro: "Where students find materials, submit work, and see their grades. Each platform you add is one more place for students to check, and data that doesn't move between platforms has to be entered twice.",
    questions: [
      {
        id: "lmsUses",
        title: "What is the course website used for?",
        why: "Students look for everything in one place. Saying what is on the course website (and what isn't) prevents “Where do I find…?” questions.",
        kind: "multi",
        custom: true,
        options: [
          { id: "announcements", label: "Announcements", summary: "Students are asked to turn on notifications.", pros: ["Reaches every student, including those who missed class."], fields: [useLink("announcements")] },
          { id: "notes", label: "Class notes", fields: [useLink("notes")] },
          { id: "readings", label: "Readings", fields: [useLink("readings")] },
          { id: "calendar", label: "Calendar and due dates", pros: ["Due dates appear in students' calendars and to-do lists."], cons: ["Due dates for work submitted elsewhere (such as Gradescope) must be entered on the course website too."], fields: [useLink("calendar")] },
          { id: "submissions", label: "Submitting work", fields: [useLink("submissions")] },
          { id: "grades", label: "Grades", fields: [useLink("grades")] },
          { id: "recordings", label: "Lecture recordings", fields: [useLink("recordings")] },
        ],
      },
      {
        id: "submitPlatform",
        title: "Where do students submit written work, and where is it graded?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "lms",
            label: "On the course website",
            summary: "Students upload work to Canvas (or another learning management system), and graders grade it there.",
            pros: ["One place for students to submit and check grades.", "Due dates, extensions, and late flags are all in one gradebook."],
            cons: ["Grading handwritten math in the website's grader is slow.", "No shared rubric per problem, so grading by problem across several graders is hard to keep consistent."],
          },
          {
            id: "gradescope",
            label: "On Gradescope, with scores sent to the course website",
            summary: "Students upload work to Gradescope, graders grade it by question with shared rubrics, and scores are posted to Canvas.",
            pros: [
              "Fast, consistent grading by question: a change to a rubric item applies to every student who got it.",
              "Regrade requests are built in and tied to the question.",
              "Handles scanned handwritten work well.",
            ],
            cons: [
              "Extensions and late submissions are not transferred to Canvas: Canvas doesn't know about an extension given on Gradescope, so it may mark work as late or missing, or apply its own late policy. Decide where late work is handled (next question).",
              "Due dates must be entered on both platforms, and changes must be made twice.",
              "Scores reach Canvas only when you post them from Gradescope, and only for assignments linked to Canvas.",
              "Students must match each page to its question when they upload; unmatched pages are easy to miss when grading.",
            ],
            fields: [
              { id: "regrade.platform", label: "Platform", placeholder: "[Gradescope](https://www.gradescope.com/courses/12345)", defaultValue: "Gradescope", help: "The website where students submit work and see their grades, such as Gradescope. To link to it, write a Markdown link: [Gradescope](https://www.gradescope.com/courses/12345). The syllabus shows it as a link wherever it names the platform." },
            ],
          },
          {
            id: "paper",
            label: "On paper, in class",
            pros: ["Nothing to scan or upload.", "Easy for students without a scanner or reliable internet."],
            cons: ["Paper can be lost, and returning it takes class time.", "Scores must be entered by hand.", "Late work and extensions need their own tracking."],
          },
        ],
      },
      {
        id: "gsExtensions",
        title: "Where are due dates and extensions kept?",
        why: "The grading platform and the course website keep separate due dates. An extension entered on one isn't copied to the other, so a student with an extension can be shown as late, and students can see two different due dates.",
        kind: "single",
        relevant: s => s.choice.submitPlatform === "gradescope",
        irrelevantNote: "Only needed when work is submitted on a grading platform separate from the course website.",
        options: [
          {
            id: "noDates",
            label: "On the grading platform only; the course website has no due dates for this work",
            summary: "Due dates and extensions are set on {{regrade.platform}}. The assignments on the course website have no due date, so it never marks them late or missing.",
            pros: ["One place for each due date and extension.", "No false late or missing flags."],
            cons: ["Due dates don't appear in the course website's calendar or to-do list, so list them in the syllabus schedule or an announcement."],
          },
          {
            id: "flags",
            label: "Due dates on both, extensions on the grading platform only",
            summary: "Both show the due dates, but extensions are entered only on {{regrade.platform}}. Students are told to ignore late and missing flags on the course website.",
            pros: ["Due dates appear in the course website's calendar.", "One place to enter each extension."],
            cons: ["The course website shows students with extensions as late or missing, which worries them.", "Students see different due dates in the two places."],
          },
          {
            id: "both",
            label: "Due dates and extensions on both",
            summary: "Each extension is entered on {{regrade.platform}} and on the course website.",
            pros: ["Students see the same due dates everywhere.", "Needed if the course website applies late penalties."],
            cons: ["Every extension is entered twice, and a forgotten one shows a student as late."],
          },
        ],
      },
      {
        id: "gsPenalty",
        title: "How do late penalties get into grades for work on the grading platform?",
        why: "The grading platform records how late each submission is, counting any extension given there, but its scores don't include the late penalty. The course website can apply a late policy, but it doesn't know when work was submitted on the grading platform. Someone has to connect the two.",
        kind: "single",
        relevant: s => s.choice.submitPlatform === "gradescope" && (s.choice.late === "penalty" || s.choice.late === "tokens"),
        irrelevantNote: "Only needed when work is submitted on a separate grading platform and the late work policy has penalties or late days.",
        options: [
          {
            id: "copyDays",
            label: "Copy the days late to the course website, which applies its late policy",
            summary: "After scores are posted, someone enters each late submission's days late (from {{regrade.platform}}) on the course website, and its late policy takes off the points.",
            pros: ["Graders grade without checking submission times.", "The grading platform's days late already count extensions given there.", "The penalty rule is set once, in the course website's late policy."],
            cons: ["Copying by hand for every late submission, after every assignment; easy to miss one.", "The course website's rule may differ from the syllabus: Canvas lowers the maximum score instead of subtracting points.", "The penalty shows only on the course website, not with the feedback."],
          },
          {
            id: "grader",
            label: "Graders take off points on the grading platform",
            summary: "Graders apply a “Late” rubric item, so the score sent to the course website already includes the penalty.",
            pros: ["Students see the penalty with their feedback.", "Nothing to copy afterward."],
            cons: ["Graders must check each submission's time and extension, and some will miss them.", "With grading by problem, several graders each apply it, or one person applies it at the end."],
          },
          {
            id: "endOfTerm",
            label: "Tracked in a spreadsheet and applied to final grades",
            summary: "Days late are exported or copied into a spreadsheet, and penalties or late days are applied once, to final grades.",
            pros: ["No bookkeeping during grading.", "Fits late days, which depend on each student's balance rather than one assignment."],
            cons: ["Scores during the term don't show penalties, so students misjudge their standing.", "Large adjustments at the end of the term surprise students."],
          },
        ],
      },
      {
        id: "gradebook",
        title: "Is the total on the course website the student's grade?",
        why: "Learning management systems can apply weights and drop the lowest scores, but they can't apply rules such as a minimum score on most exams, a final that replaces a midterm, or specifications grading. Students take the total they see as their grade.",
        kind: "single",
        options: [
          {
            id: "official",
            label: "Yes: the course website calculates grades as the syllabus says",
            summary: "Weights and drops are set up in the gradebook.",
            pros: ["Students can see their standing at any time."],
            cons: ["Only possible when every grading rule can be set up there; check yours against the gradebook's options.", "Setting up and checking the gradebook takes time at the start of the term."],
          },
          {
            id: "estimate",
            label: "No: the total is only an estimate",
            summary: "The syllabus says which rules the total doesn't apply.",
            pros: ["Honest about what the website can calculate."],
            cons: ["Students must work out their standing themselves; consider a grade calculator or a midterm progress report."],
          },
          {
            id: "hidden",
            label: "The total is hidden",
            summary: "Students see their scores, but not a total.",
            pros: ["No misleading totals."],
            cons: ["Students email to ask about their standing."],
          },
        ],
      },
    ],
  },

  // ⋘──────── Schedule ────────⋙
  {
    id: "schedule",
    title: "Schedule",
    questions: [
      {
        id: "cadence",
        title: "What is the weekly rhythm of the class?",
        kind: "single",
        options: [
          {
            id: "fixed",
            label: "The same rhythm every week",
            summary: "For example: new material Monday and Wednesday, practice Friday, quiz in section, homework due Wednesday night.",
            pros: ["Students build routines and miss fewer deadlines.", "Fewer questions about what is due when."],
            cons: ["Holidays and exams break the pattern, so those weeks need announcing."],
          },
          {
            id: "varies",
            label: "Varies from week to week",
            pros: ["Flexibility to fit the material and the calendar."],
            cons: ["Students must check the schedule every week, and more of them miss deadlines."],
          },
        ],
        fields: [{ id: "cadence.list", label: "A typical week (one per line: when | what happens)", kind: "textarea", wide: true, placeholder: "Monday and Wednesday | New material in lecture\nFriday | Practice problems in groups\nThursday | Quiz in discussion section\nWednesday, 11:59 pm | Homework report due" }],
      },
      {
        id: "workload",
        title: "Will you show how students' weekly time breaks down?",
        why: "Students new to college often underestimate the work outside of class. The US federal definition of a credit hour assumes about two hours of work outside of class for each hour in class. A breakdown also shows students where to spend their time, not only how much.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "table",
            label: "A table of hours per week for each activity",
            summary: "For example, class 3 hours, section 1, reading 2, homework 6, and studying for exams 3, with the total.",
            pros: [
              "Makes the total concrete, so students can plan their weeks and their course load.",
              "Shows that reading, reviewing notes, and studying are expected work, not only homework.",
              "Adding up the hours checks whether the workload fits the course's units.",
            ],
            cons: [
              "Students vary widely; students who need more time may think they are falling behind.",
              "Estimates can be far off until you have taught the course, so ask students how long the work takes.",
            ],
            fields: [{
              id: "time.list", label: "Activities (one per line: activity | hours per week | note)", kind: "textarea", wide: true,
              help: "Hours can be ranges, such as 2–3. The syllabus adds up the hours, so compare the total with the hours per week in Course basics. Notes are optional.",
              placeholder: "Lectures | 3 |\nDiscussion section | 1 |\nReading and reviewing notes | 2 | Before and after each lecture\nHomework | 6 |\nStudying for quizzes and exams | 3 |",
              defaultValue: "Lectures | 3 |\nDiscussion section | 1 |\nReading and reviewing notes | 2 | Before and after each lecture\nHomework | 6 |\nStudying for quizzes and exams | 3 |",
            }],
          },
          {
            id: "totalOnly",
            label: "Only the total hours per week",
            summary: "Uses the hours per week from Course basics.",
            pros: ["Short, and hard to get wrong."],
            cons: ["Doesn't say where the time should go."],
          },
          {
            id: "none",
            label: "Don't mention the workload",
            pros: ["Avoids estimates that may not fit every student."],
            cons: ["Students learn the workload only by falling behind."],
          },
        ],
      },
      {
        id: "dueTime",
        title: "When are assignments due?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "midnight",
            label: "11:59 pm",
            pros: ["The most common deadline, so students expect it.", "The most time for students with daytime jobs."],
            cons: ["Encourages working late into the night.", "No help is available in the last hours."],
          },
          {
            id: "evening",
            label: "Early evening (5–8 pm)",
            fields: [{ id: "due.time", label: "Time", placeholder: "6:00 pm", defaultValue: "6:00 pm" }],
            pros: ["Students can still get help from office hours or the forum before the deadline.", "Doesn't reward staying up late."],
            cons: ["Less time for students who work during the day."],
          },
          {
            id: "beforeClass",
            label: "Before class",
            pros: ["Work can be discussed in class right after the deadline."],
            cons: ["Students may skip class to finish."],
          },
        ],
      },
      {
        id: "hwDay",
        title: "What day of the week is homework due?",
        why: "A fixed day lets students build a routine. A deadline that falls on a holiday must move, which breaks the routine and needs an announcement, so check the academic calendar; the holiday notes on the options follow the term in Course basics. Also avoid the day of an exam, or move the deadline in exam weeks.",
        kind: "single",
        options: [
          { id: "monday", label: "Monday", pros: ["Students can use the weekend to finish."], cons: ["Students work over the weekend, when little help is available."] },
          { id: "tuesday", label: "Tuesday", pros: ["Monday office hours and sections can help right before the deadline.", "Keeps the weekend free if students start early."], cons: ["Students who wait until the weekend still work then."] },
          { id: "wednesday", label: "Wednesday", pros: ["Midweek, with help available on Monday and Tuesday.", "Few holidays fall on Wednesdays."], cons: ["Splits the week, so new material from Monday may not be on that week's homework."] },
          { id: "thursday", label: "Thursday", pros: ["Covers most of the week's material.", "Help is available all week."], cons: ["Material from Friday class waits a week to be practiced."] },
          { id: "friday", label: "Friday", pros: ["The weekend stays free.", "Covers the whole week's material."], cons: ["Students may skip Friday class to finish."] },
          { id: "sunday", label: "Sunday", pros: ["The most time to finish."], cons: ["Students work over the weekend, when little help is available.", "No weekend break from the course."] },
          { id: "varies", label: "Varies", pros: ["Deadlines can fit the material and the calendar."], cons: ["Students must check every deadline, and more of them miss one."] },
        ],
      },
      {
        id: "scheduleWhere",
        title: "Where is the schedule of topics and due dates?",
        kind: "single",
        options: [
          {
            id: "table",
            label: "In the syllabus",
            pros: ["Students can plan the whole term from one document."],
            cons: ["Goes out of date when the schedule changes."],
          },
          {
            id: "tentative",
            label: "In the syllabus, marked tentative",
            pros: ["Students can plan ahead, and you keep room to adjust."],
            cons: ["Students must check for changes."],
          },
          {
            id: "lms",
            label: "In the course website calendar",
            pros: ["One place to update.", "Due dates appear in students' calendars."],
            cons: ["A printed or downloaded syllabus doesn't include it.", "A calendar shows dates well but topics and readings poorly."],
          },
          {
            id: "page",
            label: "On a separate Schedule page",
            summary: "A page (on the course website or elsewhere) lists each week's topics, readings, and due dates.",
            pros: ["One place to update, and easy to change during the term.", "Topics and readings are easier to read than in a calendar."],
            cons: ["A printed or downloaded syllabus doesn't include it.", "Due dates don't appear in students' calendars unless you also enter them there."],
            fields: [{ id: "schedule.page", label: "Schedule page", placeholder: "[Schedule](https://canvas.example.edu/courses/12345/pages/schedule)", wide: true, help: "The name of the page, or a link to it. To link to it, write a Markdown link, such as [Schedule](https://canvas.example.edu/courses/12345/pages/schedule)." }],
          },
        ],
        fields: [
          { id: "schedule.major", label: "Major assignment dates", kind: "dateList", availableFrom: true, wide: true, placeholder: "Report 1", help: "Each major assignment's deadline and, optionally, the date it becomes available. The deadlines are added to the Important Dates." },
          { id: "schedule.list", label: "Schedule (one per line: week | topics | due)", kind: "textarea", wide: true, placeholder: "1 | Vectors and linear combinations | \n2 | Systems of equations and row reduction | Report 1\n3 | Matrix algebra | Report 2" },
        ],
      },
    ],
  },

  // ⋘──────── Support ────────⋙
  {
    id: "support",
    title: "Support and required statements",
    intro: "Many institutions require some of these statements. Check your institution's syllabus guidelines for required wording.",
    questions: [
      {
        id: "statements",
        title: "Which statements should be included?",
        kind: "multi",
        options: [
          {
            id: "accommodations",
            label: "Disability accommodations",
            summary: "How to request accommodations, and an invitation to do so early.",
            pros: ["Required at most US institutions.", "Students who request accommodations early get them in time for the first exam."],
            fields: [
              { id: "support.drc", label: "Office", placeholder: "[Disability Resource Center](https://example.edu/drc)", defaultValue: "Disability Resource Center", help: "The campus office that arranges disability accommodations. To link to its website, write a Markdown link, such as [Disability Resource Center](https://example.edu/drc)." },
              { id: "support.drcContact", label: "Contact", placeholder: "drc@example.edu, 555-0100" },
            ],
          },
          {
            id: "titleIX",
            label: "Title IX and reporting",
            summary: "Protection against discrimination, harassment, and violence, and your obligation to report.",
            pros: ["Required at many institutions.", "Tells students before they confide in you that you must report, and where to talk confidentially."],
            fields: [
              { id: "support.titleIX", label: "Title IX Office website", placeholder: "https://example.edu/title-ix" },
              { id: "support.confidential", label: "Confidential resource", placeholder: "[Counseling and Psychological Services](https://example.edu/caps)", defaultValue: "the campus counseling center", help: "A campus office where students can talk about sexual misconduct confidentially, such as the counseling center or a CARE office. To link to its website, write a Markdown link, such as [Counseling and Psychological Services](https://example.edu/caps)." },
            ],
          },
          {
            id: "wellness",
            label: "Mental health",
            pros: ["Students who are struggling may not know that free counseling exists."],
            fields: [{ id: "support.counseling", label: "Counseling service", placeholder: "[Counseling and Psychological Services](https://example.edu/caps)", defaultValue: "the campus counseling center", help: "The campus counseling center. To link to its website, write a Markdown link, such as [Counseling and Psychological Services](https://example.edu/caps)." }],
          },
          {
            id: "basicNeeds",
            label: "Food and housing insecurity",
            pros: ["Many students face food or housing insecurity, and few know where to get help."],
            fields: [{ id: "support.basicNeeds", label: "Office", placeholder: "[the Basic Needs Center](https://example.edu/basic-needs)", defaultValue: "the Dean of Students", help: "The campus office that helps students with food, housing, and financial emergencies. To link to its website, write a Markdown link, such as [the Basic Needs Center](https://example.edu/basic-needs)." }],
          },
          {
            id: "tutoring",
            label: "Tutoring and study halls",
            fields: [
              { id: "support.tutoring", label: "Service", placeholder: "[Learning Support Services](https://example.edu/tutoring)", defaultValue: "the campus tutoring center", help: "The campus tutoring or learning center. To link to its website, write a Markdown link, such as [Learning Support Services](https://example.edu/tutoring)." },
            ],
          },
          {
            id: "inclusion",
            label: "Inclusive classroom",
            pros: ["States the expectation of respect before an incident happens."],
            cons: ["Means little unless your teaching matches it."],
          },
          {
            id: "religious",
            label: "Religious observances",
            pros: ["Students can plan around conflicts early instead of asking for a makeup at the last minute."],
          },
          {
            id: "names",
            label: "Names and pronouns",
            pros: ["Rosters can show names that students don't use."],
          },
        ],
      },
    ],
  },

  // ⋘──────── FAQs ────────⋙
  {
    id: "faq",
    title: "Frequently asked questions",
    intro: "Answers are written from your other choices, so each one matches your policies.",
    questions: [
      {
        id: "faqs",
        title: "Which questions should the FAQ answer?",
        kind: "multi",
        options: [
          // Help and communication
          { id: "findX", label: "Where do I find “X”?", fields: [{ id: "faq.index", label: "Link to a course index (optional)", placeholder: "https://…", wide: true }] },
          { id: "help", label: "I'm struggling. Where can I get help?" },
          { id: "contact", label: "How should I contact you, and how quickly will you reply?" },
          { id: "accommodations", label: "I have accommodations. What should I do?" },
          // Attendance and sections
          { id: "attend", label: "Am I required to attend class?" },
          { id: "miss", label: "What if I miss class?" },
          { id: "recordings", label: "Are lectures recorded?" },
          { id: "switchSection", label: "Can I go to a different section?" },
          // Assignments
          { id: "dueDates", label: "Where can I find the due dates?" },
          { id: "submit", label: "How do I submit my work, and what if the upload fails?" },
          { id: "deadline", label: "What if I can't finish an assignment by the deadline?" },
          { id: "collab", label: "Can I work with other students?" },
          { id: "ai", label: "Can I use ChatGPT or other AI tools?" },
          // Exams
          { id: "examBring", label: "What can I bring to exams?" },
          { id: "quizTopics", label: "What will be on this week's quiz?" },
          // Grades
          { id: "currentGrade", label: "What is my grade right now?" },
          { id: "extraCredit", label: "Is there extra credit?" },
          { id: "curve", label: "Is the class curved?" },
          { id: "regrade", label: "What if I disagree with my grade?" },
          // Materials
          { id: "textbook", label: "Do I need to buy the textbook?" },
          { id: "calculator", label: "Do I need to buy a calculator?" },
          // Enrollment
          { id: "lateAdd", label: "I added the class late (or I'm on the waitlist). What should I do?" },
          { id: "incomplete", label: "What if I can't complete the class?" },
        ],
      },
    ],
  },

  // ⋘──────── Teaching team ────────⋙
  {
    id: "team",
    title: "Teaching team syllabus",
    intro: "A second document, for your TAs, tutors, and readers: what each role does, how the team works together, how grading works, and how to handle common situations with students. Much of it is written from your answers above, so it matches the student syllabus. The preview switches to the teaching team syllabus while you are in this section; use the buttons above the preview to switch by hand.",
    questions: [
      {
        id: "teamRoles",
        title: "Who is on the teaching team?",
        why: "The names and emails of TAs come from Instructor and teaching team, in Course basics. Hours per week appear in each role's responsibilities, so that team members can plan their time and tell you early when the work takes longer.",
        kind: "multi",
        options: [
          {
            id: "ta",
            label: "Teaching assistants",
            summary: "Usually graduate students who lead discussion sections, hold office hours, and grade.",
            fields: [{ id: "team.taHours", label: "Hours per week (each)", kind: "number", placeholder: "20", help: "Check the appointment: many universities cap TA hours, often at 20 per week for a half-time appointment." }],
          },
          {
            id: "tutor",
            label: "Tutors or learning assistants",
            summary: "Usually undergraduates who help during class and hold drop-in hours, but don't grade.",
            pros: ["Make group work possible in a large class.", "Students often find a recent student easier to ask than a TA or instructor."],
            cons: ["Need training in how to help without giving away answers."],
            fields: [{ id: "team.tutorHours", label: "Hours per week (each)", kind: "number", placeholder: "6" }],
          },
          {
            id: "reader",
            label: "Readers or graders",
            summary: "Grade written work; usually don't meet with students.",
            pros: ["Free TAs' time for teaching."],
            cons: ["Don't see students' confusion in person, so they need detailed rubrics."],
            fields: [{ id: "team.readerHours", label: "Hours per week (each)", kind: "number", placeholder: "10" }],
          },
        ],
      },
      {
        id: "teamTasks",
        title: "Who does each course management task?",
        why: "Routine tasks take hours every week. Naming one person (or a rotation) for each task keeps it from falling between people, and handing tasks to TAs frees your time for teaching. The teaching team syllabus lists who does what, and the instructor checklist assigns each weekly task. Who answers regrade requests is asked in Grades, right after how students request regrades.",
        kind: "perRole",
        roles: [
          { id: "graders", label: "Managing graders: assigning grading and checking that it is done on time", relevant: s => (s.multi.teamRoles ?? []).some(r => r === "ta" || r === "reader") },
          { id: "tutors", label: "Coordinating tutors: schedules, training, and substitutes", relevant: s => (s.multi.teamRoles ?? []).includes("tutor") },
          { id: "videos", label: "Uploading lecture videos", relevant: s => s.choice.recordings === "posted" || s.choice.recordings === "request" },
          { id: "pages", label: "Creating assignment pages on the course website" },
          { id: "rubrics", label: "Writing rubrics" },
        ],
        relevant: s => (s.multi.teamRoles ?? []).length > 0,
        irrelevantNote: "Only needed once you choose the roles on the teaching team.",
        options: [
          {
            id: "instructor",
            label: "Instructor",
            pros: ["Done the way you want it."],
            cons: ["Takes hours that could go to teaching and to students."],
          },
          {
            id: "headTA",
            label: "Head TA",
            summary: "One TA, named below, with fewer of the other duties.",
            pros: ["One person for the team to ask.", "Experience in running a course, which helps TAs who want to teach."],
            cons: ["Reduce the head TA's other duties, so that the work fits within their hours."],
          },
          {
            id: "tas",
            label: "TAs take turns",
            summary: "On a schedule set at the first team meeting.",
            pros: ["Spreads the work."],
            cons: ["Needs a schedule, and quality varies from week to week."],
          },
        ],
        fields: [{ id: "team.headTA", label: "Head TA", placeholder: "Ada Lovelace", help: "The TA who does the tasks marked Head TA. Leave empty if no task is." }],
      },
      {
        id: "teamMeeting",
        title: "How will the team meet?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "weekly",
            label: "A weekly team meeting",
            summary: "Review the past week, preview the next week's material and section plan, and agree on grading.",
            pros: ["Problems surface early.", "Everyone gives students the same answers."],
            cons: ["Costs an hour of everyone's paid time each week."],
            fields: [{ id: "team.meetingTime", label: "Day, time, and place", placeholder: "Mondays, 12:00–1:00 pm, Baskin 152" }],
          },
          {
            id: "async",
            label: "Written updates in a team channel",
            summary: "A weekly post with the plan, plus meetings when needed.",
            pros: ["Fits everyone's schedule.", "Leaves a written record."],
            cons: ["Easy to skim, so misunderstandings last longer.", "Less sense of being a team."],
          },
          {
            id: "start",
            label: "Once before the term, then as needed",
            pros: ["Least time."],
            cons: ["Inconsistencies between sections and graders go unnoticed."],
          },
        ],
      },
      {
        id: "teamChannel",
        title: "How will the team communicate between meetings?",
        kind: "single",
        options: [
          {
            id: "chat",
            label: "A team chat",
            summary: "Such as Slack, Discord, or Microsoft Teams.",
            pros: ["Quick questions get quick answers.", "Grading questions can be settled for everyone at once."],
            cons: ["Can feel like being on call; set expectations for evenings and weekends."],
            fields: [{ id: "team.chat", label: "Chat", placeholder: "Slack", defaultValue: "the team chat" }],
          },
          {
            id: "email",
            label: "Email",
            pros: ["No new platform."],
            cons: ["Threads get long, and some people miss replies."],
          },
        ],
      },
      {
        id: "sectionPrep",
        title: "Who prepares the notes for discussion sections?",
        why: "Section notes are the worksheet, solutions, and a plan for running the section. If they are posted for students, the student syllabus says so, and students who miss section are told to work through them.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "provided",
            label: "The instructor",
            summary: "A worksheet, solutions, and a plan for each section.",
            pros: ["Every section covers the same material.", "Least preparation for TAs, and the best fit for new TAs."],
            cons: ["TAs get less practice designing teaching.", "More work for you each week."],
          },
          {
            id: "rotate",
            label: "TAs take turns",
            summary: "Each week, one TA writes the notes for every section, and the instructor reviews them.",
            pros: ["Every section covers the same material.", "Spreads the work, and each TA practices writing teaching materials."],
            cons: ["Quality varies from week to week.", "Reviewing drafts still takes your time."],
          },
          {
            id: "shared",
            label: "The instructor writes the problems; each TA plans the section",
            pros: ["Sections cover the same problems, and TAs choose how to teach them.", "TAs develop as teachers."],
            cons: ["Quality varies across sections."],
          },
          {
            id: "own",
            label: "Each TA writes their own",
            summary: "Within a list of topics for each week.",
            pros: ["Experienced TAs can teach to their strengths."],
            cons: ["Sections drift apart, and students notice.", "Much more preparation for TAs."],
          },
        ],
        fields: [
          { id: "team.prepDue", label: "Section notes shared with the team by", placeholder: "the Friday before", defaultValue: "the Friday before" },
          { id: "team.postNotes", label: "Post section notes for students", kind: "checkbox", help: "Posting worksheets and solutions after the last section each week helps students who missed section and makes review easier. Students who know the solutions will be posted may put less effort into section." },
        ],
      },
      {
        id: "sectionQuizPrep",
        title: "Who prepares the quizzes for discussion sections?",
        why: "Students in later sections can learn the questions from students in earlier ones, so many courses write a different version for each section. How much difficulty and security matter depends on the stakes of the quizzes (Coursework), and the notes below follow your answer.",
        relevant: s => quizStakes(s) !== null,
        irrelevantNote: "Only needed when quizzes are given in discussion sections (Coursework).",
        kind: "single",
        custom: true,
        options: [
          {
            id: "instructor",
            label: "The instructor",
            pros: ["Quizzes match the lectures and exams.", "Equal difficulty in every section.", "The quiz itself tells the TAs which topics matter, so they know what to emphasize in section."],
            cons: ["More work for you each week, especially with several versions."],
          },
          {
            id: "rotate",
            label: "TAs take turns, and the instructor reviews",
            pros: ["Spreads the work.", "TAs practice writing assessments."],
            cons: ["Difficulty varies from week to week.", "TAs may not know which topics the quiz should cover, so it can miss what you emphasized or include what you skipped; list the topics for each week.", "Reviewing drafts still takes your time."],
          },
          {
            id: "own",
            label: "Each TA writes their own section's quiz",
            pros: ["Each version is different, so questions can't spread between sections."],
            cons: ["Difficulty differs across sections."],
          },
        ],
        fields: [
          { id: "team.quizVersions", label: "A different version for each section", kind: "checkbox", help: "The student syllabus then says that each section takes a different version, and the academic integrity section prohibits sharing quiz questions with students in later sections." },
          { id: "team.quizDue", label: "Quizzes ready by", placeholder: "two days before the first section", defaultValue: "two days before the first section" },
        ],
      },
      {
        id: "sectionQuizStakes",
        title: "How are section quizzes graded?",
        why: "How much a quiz score counts decides how carefully it must be graded, and so who should grade it (the next question) and how the quizzes are written (the question above). The suggested answer follows how quizzes work in Coursework.",
        relevant: s => sectionQuizzes(s),
        irrelevantNote: "Only needed when quizzes are given in discussion sections (Coursework).",
        kind: "single",
        options: [
          {
            id: "completion",
            label: "For completion",
            summary: "Full credit for a good-faith attempt; the answers are reviewed in section.",
            pros: ["Almost no grading.", "Low pressure, so students focus on learning."],
            cons: ["Students get little written feedback.", "Some students put in little effort."],
          },
          {
            id: "low",
            label: "For correctness, low stakes",
            summary: "Graded with the answer key, generously; each quiz counts little, or can be revised.",
            pros: ["Students get feedback on what they got wrong.", "Small differences between graders matter little."],
            cons: ["Grading takes time every week."],
          },
          {
            id: "high",
            label: "For correctness, high stakes",
            summary: "Graded strictly with a rubric; the quizzes count for a large share of the grade.",
            pros: ["Rewards keeping up, and gives a reliable measure before the exams."],
            cons: ["Grading must be consistent across sections, and quizzes must be equally difficult and kept secret.", "More regrade requests."],
          },
        ],
      },
      {
        id: "sectionQuizGrading",
        title: "Who grades section quizzes?",
        why: "Section quizzes come in every week, so grading them is a steady load. Who grades them decides how fast students get feedback and how consistent the scores are across sections.",
        relevant: s => quizStakes(s) !== null,
        irrelevantNote: "Only needed when quizzes are given in discussion sections (Coursework).",
        kind: "single",
        custom: true,
        options: [
          {
            id: "ownTA",
            label: "Each TA grades their own section",
            pros: ["The TA sees what their students struggle with, and can address it in the next section.", "Fast, since each TA has a small stack."],
            cons: ["Scores vary between TAs, which matters when quizzes are high stakes.", "Students may ask their TA to change a score."],
          },
          {
            id: "shared",
            label: "Graded by problem, across all sections",
            summary: "Each grader grades the same problem for every section, with a shared rubric.",
            pros: ["Consistent scores across sections.", "Fast with a grading platform such as Gradescope."],
            cons: ["TAs see less of their own students' work.", "Needs a shared rubric each week and a single deadline."],
          },
          {
            id: "readers",
            label: "Readers (graders who don't lead sections)",
            pros: ["Frees TAs to prepare for sections and hold office hours."],
            cons: ["Readers don't know what was emphasized in each section.", "Needs readers in the budget."],
          },
        ],
        fields: [{ id: "team.quizGradeDue", label: "Graded within", placeholder: "one week", defaultValue: "one week" }],
      },
      {
        id: "proctoring",
        title: "Which exam-room rules should proctors follow?",
        why: "Proctors make quick decisions under pressure, so agreeing on the rules in advance keeps exams fair and consistent across rooms. Rules marked for students also appear in the Exams section of the student syllabus, so that students know what to expect. The next three questions cover IDs, help during the exam, and how the exam ends.",
        kind: "multi",
        options: [
          { id: "allowed", label: "What is allowed on exams", summary: "Lists the allowed materials (from your exam aids and calculator answers) and what is not allowed, such as phones and smartwatches. Also in the student syllabus." },
          { id: "bags", label: "Bags and phones at the front or sides of the room", summary: "Phones off and in bags; no smartwatches or earbuds. Also in the student syllabus.", pros: ["Removes the most common way of cheating."], cons: ["Students worry about their belongings; let them keep wallets and keys."] },
          { id: "seating", label: "Spread-out or assigned seating", summary: "Students leave an empty seat between them, or sit in assigned seats. Also in the student syllabus.", pros: ["Makes copying much harder."], cons: ["Needs a room with about twice as many seats as students, or time to make a seating chart."] },
          {
            id: "restroom", label: "Restroom breaks one at a time",
            summary: "Before leaving, the student hands the proctor their phone, exam, and student ID; while the student is out, the proctor checks the ID against the roster. Also in the student syllabus.",
            pros: [
              "An exam can't be taken out of the room, including by someone who isn't enrolled and doesn't come back.",
              "Checking the ID during the break confirms that the student is enrolled, without slowing the start of the exam.",
            ],
            cons: ["Needs a proctor at the front of the room to hold items, and a roster."],
          },
          { id: "incidents", label: "Record suspected cheating without confronting", summary: "Note the student, seat, time, and what you saw; quietly move the student if needed, and tell the instructor after the exam.", pros: ["Lets the student finish the exam and keeps the formal process intact."] },
          { id: "accommodations", label: "Accommodated students take the exam elsewhere", summary: "At the testing center, with the same exam and instructions; proctors pass on corrections announced during the exam." },
        ],
      },
      {
        id: "examIds",
        title: "How do proctors check student IDs?",
        why: "Checking IDs keeps someone else from taking a student's exam. Checking at the door delays the start, so most courses check during the exam or when exams are turned in. The student syllabus tells students to bring their ID and when to show it.",
        kind: "single",
        options: [
          {
            id: "during",
            label: "During the exam",
            summary: "Students put their ID on the desk; proctors walk the rows and compare each ID with the student and the name on the exam.",
            pros: ["Doesn't delay the start of the exam.", "Every ID is checked while the student is in their seat."],
            cons: ["Hard in a crowded lecture hall: proctors can't reach the middle of full rows without disturbing students.", "Proctors walking the rows can distract students."],
          },
          {
            id: "turnIn",
            label: "When exams are turned in",
            summary: "Each student shows their ID while handing in the exam, and the proctor checks it against the name on the exam.",
            pros: ["Works in any room: every student passes a proctor at the end.", "Nobody is disturbed during the exam."],
            cons: ["Lines form at the end, so have several proctors collecting.", "Doesn't work if proctors collect exams at the seats."],
          },
          {
            id: "none",
            label: "Don't check IDs",
            pros: ["No time spent.", "In a small class, you know every student."],
            cons: ["Someone else could take a student's exam."],
          },
        ],
      },
      {
        id: "examHelp",
        title: "What help do proctors give during exams?",
        why: "Students ask proctors for help during every exam. When proctors answer differently, students in some rooms get more help than others. Whatever you choose, an error in a problem is corrected for everyone: announced to the whole room, written on the board, and sent to the testing center.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "clarify",
            label: "Answer only clarifying questions",
            summary: "Proctors explain what a problem asks, but not how to solve it.",
            pros: ["Every student gets the same information.", "Easy for proctors to apply consistently."],
            cons: ["A student stuck on the first step of a problem can't show what they know about the rest."],
          },
          {
            id: "hints",
            label: "Give hints",
            summary: "Proctors may point a stuck student to a relevant idea, without solving any part of the problem.",
            pros: ["Students who are stuck early can still show what they know about the rest of the problem.", "Lowers anxiety."],
            cons: ["Hints differ between proctors and rooms, and students who don't ask get none.", "Students at the testing center get no hints."],
          },
          {
            id: "check",
            label: "Check students' answers",
            summary: "When asked, proctors tell a student whether an answer is right, so that the student can look for the mistake.",
            pros: ["Good for students who are struggling: the exam becomes a chance to learn.", "A small mistake doesn't cost a whole problem."],
            cons: ["Can be distracting or intimidating for students.", "Works only in small classes, with enough proctors to reach every student who asks."],
          },
        ],
      },
      {
        id: "examEnd",
        title: "How do exams end?",
        why: "The last minutes of an exam are when the rules are hardest to enforce: students keep writing, crowd the front, or leave while others are still working. Deciding in advance lets every room end the same way. The student syllabus tells students what to do when time is called.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "seated",
            label: "Students stay seated until exams are collected",
            summary: "When time is called, students stop writing, and proctors collect the exams from the seats.",
            pros: ["Nobody keeps writing while waiting in line.", "Calm and orderly."],
            cons: ["Slow in a large room, and needs a proctor for each block of seats."],
          },
          {
            id: "front",
            label: "Students bring their exams to the front",
            summary: "When time is called, students stop writing and hand their exams to a proctor.",
            pros: ["Fast in a small room.", "Proctors can check IDs as exams are handed in."],
            cons: ["Crowds form at the front, and students in line may keep writing, so proctors must watch for it."],
          },
          {
            id: "rows",
            label: "Exams are passed to the ends of the rows",
            summary: "When time is called, students stop writing and pass their exams to the aisle, where proctors collect them.",
            pros: ["The fastest way to collect exams in a full lecture hall."],
            cons: ["Students handle each other's exams, and an exam can go missing, so count them against the roster."],
          },
        ],
        fields: [
          { id: "exam.timeCalls", label: "Announce the time remaining at", placeholder: "the halfway point and at 15 and 5 minutes", defaultValue: "the halfway point and at 15 and 5 minutes" },
          { id: "exam.leaveEarly", label: "Students who finish early may leave, except in the last 10 minutes", kind: "checkbox", help: "Students who finish early turn in their exam and leave quietly. In the last 10 minutes, everyone stays seated, so that people leaving don't disturb students who are finishing." },
        ],
      },
      {
        id: "gradingProcess",
        title: "How is grading divided?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "byProblem",
            label: "By problem",
            summary: "Each grader grades the same problems for every student.",
            pros: ["The most consistent grading: one person applies each rubric item.", "Each grader learns one rubric well."],
            cons: ["Needs a platform that splits submissions by problem, such as Gradescope.", "Graders don't see a whole student's work."],
          },
          {
            id: "bySection",
            label: "By section",
            summary: "Each TA grades their own section's work.",
            pros: ["TAs see where their own students struggle."],
            cons: ["Grading differs across sections, and students compare.", "A TA's relationship with students can bias grading."],
          },
          {
            id: "rotate",
            label: "By rotation",
            summary: "Grading is split evenly, with assignments rotating among graders.",
            pros: ["Spreads the workload evenly week to week."],
            cons: ["Less consistent than grading by problem.", "Works only when one grader can grade a whole assignment by the grading deadline."],
          },
        ],
        fields: [
          { id: "team.calibrate", label: "Calibrate before grading", kind: "checkbox", help: "Grading by section or by rotation: before grading, each grader grades the same few submissions, and the team compares scores and settles the rubric. It takes 15–30 minutes and catches most inconsistencies. Grading by problem: each rubric is applied by one grader, so instead each grader checks their rubric with you after grading the first few submissions (or calibrates with the others grading the same problem, if a problem is shared)." },
          { id: "team.gradeDue", label: "Grading due", placeholder: "within 5 days of the deadline", defaultValue: "within 5 days of the deadline" },
        ],
      },
      {
        id: "teamExceptions",
        title: "Who decides on extensions and other exceptions?",
        why: "Students ask whoever seems most likely to say yes. One decision-maker keeps exceptions consistent; letting TAs decide small requests keeps them fast.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "instructor",
            label: "Only the instructor",
            summary: "Team members send students to the exception process in the syllabus.",
            pros: ["Consistent decisions.", "TAs are spared awkward conversations."],
            cons: ["Slower, and more work for you."],
          },
          {
            id: "taShort",
            label: "TAs may grant short extensions",
            fields: [{ id: "team.taExtension", label: "Up to", placeholder: "2 days", defaultValue: "2 days" }],
            pros: ["Fast answers for small requests."],
            cons: ["TAs decide differently, and students compare.", "Hard to track a student's total extensions across TAs."],
          },
        ],
      },
      {
        id: "extensionLog",
        title: "How are extensions and other exceptions tracked?",
        why: "A record of every exception shows when a student has asked several times, lets anyone on the team answer “Do I have an extension?”, and keeps graders from marking excused work as late.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "spreadsheet",
            label: "A shared spreadsheet",
            summary: "One row for each exception: the student, the assignment or exam, the new deadline, the reason, and who granted it.",
            pros: ["Every exception in one place, including excused absences and makeup exams.", "Shows at a glance when a student has asked several times."],
            cons: ["Entered separately from the grading platform, so the two can disagree.", "Holds private information, so share it only with the team."],
            fields: [{ id: "team.extensionSheet", label: "Spreadsheet", placeholder: "the Extensions sheet in the team drive", defaultValue: "the extensions spreadsheet" }],
          },
          {
            id: "platform",
            label: "In the grading platform",
            summary: "Each extension is a new due date for the student on that assignment, which Gradescope and Canvas both support.",
            pros: ["The new deadline is enforced automatically, so late flags are right.", "Nothing to enter twice."],
            cons: ["Spread across assignments, so it's hard to see how many extensions a student has had.", "Doesn't cover excused absences or makeup exams."],
          },
          {
            id: "form",
            label: "In the responses to the request form",
            summary: "Requests from the online form collect in a spreadsheet, with added columns for the decision and who made it.",
            pros: ["Each request and its decision are kept together.", "No separate list to keep up."],
            cons: ["Requests that arrive by email or in person must be added by hand."],
          },
        ],
      },
      {
        id: "teamIntegrity",
        title: "What should team members do about suspected cheating?",
        kind: "single",
        custom: true,
        options: [
          {
            id: "report",
            label: "Tell the instructor, and don't confront the student",
            pros: ["The formal process protects both students and staff.", "Many institutions require the instructor to handle it."],
            cons: ["Innocent explanations take longer to clear up."],
          },
          {
            id: "discuss",
            label: "TAs may ask the student to explain their work first",
            pros: ["Misunderstandings can be cleared up quickly."],
            cons: ["Students may feel accused by someone who can't decide the outcome.", "Conversations can compromise a later formal process."],
          },
        ],
      },
      {
        id: "teamLecture",
        title: "Who is required to attend lectures?",
        why: "Lectures take several hours of a team member's week, out of a fixed number of paid hours. Saying who must attend keeps team members from guessing what is expected. Team members who aren't required to attend are told that they may, and to read the lecture notes or slides instead.",
        kind: "multi",
        optionsFrom: "teamRoles",
        relevant: s => (s.multi.teamRoles ?? []).length > 0,
        irrelevantNote: "Only needed once you choose the roles on the teaching team.",
        options: [
          {
            id: "ta",
            label: "Teaching assistants",
            pros: ["Sections build on exactly what was said in class.", "TAs hear the questions students ask in lecture."],
            cons: ["Takes several hours of each TA's week, leaving fewer for office hours and grading."],
          },
          {
            id: "tutor",
            label: "Tutors or learning assistants",
            pros: ["Needed when tutors help students during in-class activities.", "Tutors know what students are working on."],
            cons: ["Takes hours from drop-in tutoring."],
          },
          {
            id: "reader",
            label: "Readers or graders",
            pros: ["Readers grade with the methods and notation that students were taught."],
            cons: ["Rarely worth the hours: reading the lecture notes for the topics they grade is usually enough."],
          },
          {
            id: "none",
            label: "No one",
            exclusive: true,
            summary: "Team members read the lecture notes or slides instead.",
            pros: ["Frees hours for office hours, grading, and preparation."],
            cons: ["Sections may use different notation or methods from lecture.", "Team members miss what confused students in class."],
          },
        ],
      },
      {
        id: "teamConduct",
        title: "Which expectations should be listed?",
        kind: "multi",
        options: [
          { id: "privacy", label: "Student privacy", summary: "Grades and student information stay within the teaching team (FERPA, in the US)." },
          { id: "materials", label: "Course materials stay private", summary: "No sharing solutions, exams, or rubrics outside the team." },
          { id: "noAi", label: "No student work in AI tools", summary: "Uploading student work to outside AI tools can violate privacy rules." },
          { id: "respond", label: "Response times", summary: "Reply to students and the team within two business days, and check the team channel on weekdays." },
          { id: "absences", label: "Absences and substitutes", summary: "Arrange a substitute for your section or office hours, and tell the instructor in advance." },
          { id: "boundaries", label: "Professional boundaries", summary: "No romantic relationships with students in the course, and care with social media." },
          { id: "reporting", label: "Mandated reporting", summary: "Team members are required to report the discrimination, harassment, and sexual violence that they learn about, including cases that nobody tells them about directly (Title IX, in the US)." },
        ],
      },
      {
        id: "teamSupport",
        title: "How will you support the team?",
        kind: "multi",
        options: [
          { id: "training", label: "Training before the term", fields: [{ id: "team.training", label: "Training", placeholder: "the campus TA training", defaultValue: "the campus TA training" }], pros: ["New TAs start with techniques for leading sections and grading."] },
          { id: "observe", label: "Section observations", summary: "The instructor or a peer visits a section and gives feedback.", pros: ["The most direct way to help TAs improve.", "Gives you material for recommendation letters."], cons: ["Can feel like an evaluation; say it is for development."] },
          { id: "feedback", label: "Mid-term feedback from students", summary: "A short anonymous survey about sections, after a few weeks.", pros: ["TAs can improve during the term instead of after it."] },
          { id: "checkin", label: "A one-on-one check-in", summary: "Each team member meets with the instructor once during the term.", pros: ["Problems with workload or students come up before they grow."] },
          { id: "letters", label: "Letters of recommendation", summary: "Offer to write letters for team members.", pros: ["Recognizes the work, which TAs and tutors value."] },
        ],
      },
      {
        id: "teamOpportunities",
        title: "What teaching opportunities will you offer the team?",
        why: "Many TAs want teaching experience beyond sections, for their development and for job applications. Offering it to the whole team gives everyone the same chance, not only those who think to ask.",
        kind: "multi",
        custom: true,
        options: [
          {
            id: "lecture",
            label: "Give a lecture",
            summary: "A team member teaches a class meeting, with your help preparing and your feedback afterward.",
            pros: ["The experience that most TAs who want to teach lack.", "Material for teaching statements and recommendation letters."],
            cons: ["Preparation takes hours, which must fit within the appointment.", "Students notice the change of style, and a weak lecture costs them a class."],
          },
          {
            id: "examProblems",
            label: "Write exam problems",
            summary: "Team members propose problems, and you choose and edit them.",
            pros: ["Teaches how to write a fair assessment.", "A source of new problems."],
            cons: ["You still review every problem for difficulty and clarity.", "Every proposed problem must stay secret, used or not."],
          },
          {
            id: "review",
            label: "Lead a review session",
            summary: "Before an exam, a team member runs an optional review for students.",
            pros: ["Lower stakes than a lecture.", "Students get extra help when they need it most."],
            cons: ["Takes preparation time in exam weeks, when grading is heavy."],
          },
          { id: "none", label: "None this term", exclusive: true },
        ],
      },
    ],
  },

  // ⋘──────── Planning ────────⋙
  {
    id: "planning",
    title: "Planning (not in the syllabus)",
    intro: "Decisions that students don't need to read, but that come up every term. Your answers, and a checklist of tasks before the term, each week, and around each exam, are in the instructor checklist. The preview switches to the checklist while you are in this section.",
    questions: [
      {
        id: "lateAdds",
        title: "How will you handle students who add the course late?",
        why: "Students add in the first week or two, after some work is due. Deciding in advance gives every late add the same deal and saves negotiating each case.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "extend",
            label: "Extend the deadlines of the work they missed",
            summary: "Work due before the student enrolled is due {{lateAdd.window}}.",
            pros: ["Late adds do all of the work, and learn the material that later work builds on."],
            cons: ["Extra deadlines to track and grade, out of step with everyone else's."],
            fields: [{ id: "lateAdd.window", label: "New deadline", placeholder: "one week after enrolling", defaultValue: "one week after enrolling" }],
          },
          {
            id: "excuse",
            label: "Excuse the work from before they enrolled",
            summary: "The weight of the excused work moves to the rest of its category.",
            pros: ["No catch-up deadlines to track."],
            cons: ["Late adds may skip material that later work builds on.", "Each excused assignment must be marked in the gradebook."],
          },
          {
            id: "drops",
            label: "Count the missed work as dropped scores",
            summary: "The policy of dropping the lowest scores absorbs the missed work.",
            pros: ["No special handling: the syllabus policy already covers it."],
            cons: ["Leaves late adds no drops for illnesses later in the term.", "Works only when the drops cover all of the missed work."],
          },
          {
            id: "cutoff",
            label: "No adds after the first week",
            summary: "Permission to add is given only in the first week of the term.",
            pros: ["Everyone starts together, and nobody has work to make up."],
            cons: ["Students who need the course to graduate on time may have to wait a term.", "Your department may set its own add policy."],
          },
        ],
      },
      {
        id: "prereqs",
        title: "How will you handle requests to waive prerequisites?",
        why: "Students who took an equivalent course elsewhere, or who taught themselves, ask to enroll without the listed prerequisites. Check your department's policy first: some departments decide these requests themselves.",
        kind: "single",
        custom: true,
        options: [
          {
            id: "strict",
            label: "Enforce the prerequisites",
            summary: "No waivers; students take the prerequisites first.",
            pros: ["Consistent, and quick to answer.", "Students arrive prepared."],
            cons: ["Blocks students with equivalent preparation, such as transfer students."],
          },
          {
            id: "evidence",
            label: "Waive with evidence of an equivalent course",
            summary: "A transcript, plus the syllabus of the course if it was taken elsewhere.",
            pros: ["Fair to transfer students.", "Decisions rest on something you can check."],
            cons: ["Takes time to compare courses.", "Doesn't help students who learned the material on their own."],
          },
          {
            id: "conversation",
            label: "Decide after a conversation or a diagnostic quiz",
            summary: "The student shows you that they know the prerequisite material.",
            pros: ["Tests what the student actually knows."],
            cons: ["The most time per request.", "Can feel arbitrary unless the quiz or the questions are the same for everyone."],
          },
          {
            id: "request",
            label: "Waive on request",
            summary: "The student accepts the risk of starting without the prerequisites.",
            pros: ["The least work.", "Respects students' judgment about their own preparation."],
            cons: ["Unprepared students struggle, and some fail or drop late."],
          },
        ],
      },
      {
        id: "examLeads",
        title: "How far ahead is each exam task due?",
        why: "The instructor checklist lists the tasks for each exam with these lead times. When the midterm dates (Exams) and the final exam date (Course basics) are entered, it also lists the tasks for each exam with their dates. Leave a box empty to use the suggested number of days.",
        kind: "fields",
        fields: [
          { id: "lead.problems", label: "Collect problems from the team (days before)", kind: "number", placeholder: "21", defaultValue: "21" },
          { id: "lead.write", label: "Write the exam and solutions (days before)", kind: "number", placeholder: "14", defaultValue: "14" },
          { id: "lead.rooms", label: "Confirm rooms and conflict exams (days before)", kind: "number", placeholder: "14", defaultValue: "14" },
          { id: "lead.versions", label: "Make the other versions (days before)", kind: "number", placeholder: "10", defaultValue: "10" },
          { id: "lead.review", label: "Schedule the review session (days before)", kind: "number", placeholder: "10", defaultValue: "10" },
          { id: "lead.testing", label: "Send to the testing center (days before)", kind: "number", placeholder: "7", defaultValue: "7", help: "Testing centers set their own deadlines, often a week or more before the exam. Check yours." },
          { id: "lead.rubric", label: "Write the rubric (days before)", kind: "number", placeholder: "3", defaultValue: "3" },
          { id: "lead.print", label: "Print the exams (days before)", kind: "number", placeholder: "2", defaultValue: "2" },
          { id: "lead.proctors", label: "Remind the proctors of the rules (days before)", kind: "number", placeholder: "1", defaultValue: "1" },
          { id: "lead.grades", label: "Release grades (days after)", kind: "number", placeholder: "7", defaultValue: "7", help: "Regrade requests and exam corrections open when grades are released." },
          { id: "lead.makeup", label: "Hold makeup exams (days after)", kind: "number", placeholder: "5", defaultValue: "5" },
          { id: "lead.retake", label: "Hold the retake (days after)", kind: "number", placeholder: "14", defaultValue: "14" },
        ],
      },
      {
        id: "struggling",
        title: "How will you notice students who are struggling?",
        why: "Students who fall behind often stop coming to class and office hours, so they don't ask for help. Reaching out early, while a recovery is still possible, makes the most difference.",
        kind: "multi",
        custom: true,
        options: [
          {
            id: "gradebook",
            label: "Check the gradebook at set points",
            summary: "At set points in the term, email every student whose grade is below a threshold, with ways to get help.",
            pros: ["Catches every student, not only those the team notices.", "Quick with a sorted gradebook."],
            cons: ["Grades lag: by the first check, a student may already be far behind."],
            fields: [
              { id: "struggle.when", label: "When", placeholder: "after the first quiz, in week 4, and after each midterm", defaultValue: "after the first quiz, in week 4, and after each midterm" },
              { id: "struggle.threshold", label: "Below", placeholder: "70%", defaultValue: "70%", ...PERCENT },
            ],
          },
          {
            id: "missing",
            label: "Watch for missing work",
            summary: "Email students who miss two assignments in a row.",
            pros: ["Missing work is the earliest sign of trouble, before grades show it."],
            cons: ["Weekly work for someone, unless the platform can report it."],
          },
          {
            id: "teamFlags",
            label: "Team members flag students",
            summary: "TAs and tutors add students who seem lost, stop attending, or seem distressed to a shared list, which you review each week.",
            pros: ["The team sees things that grades don't, such as a student who stops coming to section."],
            cons: ["Depends on how well team members know their students.", "The list holds private information, so share it only with the team."],
            fields: [{ id: "struggle.list", label: "Shared list", placeholder: "the Student Concerns sheet in the team drive", defaultValue: "the shared list of students to check on" }],
          },
          {
            id: "earlyAlert",
            label: "Use the campus early-alert system",
            summary: "Refer students to advisers, who contact them about every course they take.",
            pros: ["Advisers see the whole picture, such as a student struggling in every course.", "Connects students with support that you can't give."],
            cons: ["Students may feel reported rather than helped; tell them first."],
            fields: [{ id: "struggle.system", label: "System", placeholder: "EAB Navigate", defaultValue: "the campus early-alert system" }],
          },
        ],
      },
    ],
  },
];

// ⋘──────── Course links ────────⋙
// Every link in the syllabus, gathered in one card in Course basics, so that they can be set and
// checked in one place. Each is the same field as in its own question (the boxes stay in step).

const LINKS: [string, string][] = [
  ["course.lms", "Course website"],
  ...Object.entries(USE_LABELS).map(([use, label]): [string, string] => [`lms.link.${use}`, `Course website: ${label.toLowerCase()}`]),
  ["schedule.page", "Schedule page"],
  ["inst.ohLink", "Office hours page"],
  ["contact.forum", "Discussion forum"],
  ["regrade.platform", "Grading platform"],
  ["regrade.help", "Regrade instructions"],
  ["exc.form", "Exception request form"],
  ["exc.dean", "Dean of Students"],
  ["book.accessLink", "Textbook access instructions"],
  ["software.link", "Software installation instructions"],
  ["ai.guide", "Guide to using AI"],
  ["faq.index", "Course index"],
  ["integrity.office", "Academic integrity office"],
  ["support.drc", "Disability resources"],
  ["support.titleIX", "Title IX office"],
  ["support.confidential", "Confidential resource"],
  ["support.counseling", "Counseling"],
  ["support.basicNeeds", "Basic needs"],
  ["support.tutoring", "Tutoring"],
];
{
  const all = SECTIONS.flatMap(sec => sec.questions).flatMap(q => [...(q.fields ?? []), ...(q.options ?? []).flatMap(o => o.fields ?? [])]);
  const fields = LINKS.map(([id, label]): Field => {
    const f = all.find(x => x.id === id);
    if (!f) throw new Error(`No field ${id}`);
    return { ...f, label, wide: true, open: true };
  });
  SECTIONS[0].questions.splice(SECTIONS[0].questions.findIndex(q => q.id === "instructor") + 1, 0, {
    id: "links",
    title: "Course links",
    why: "Every link in the syllabus, in one place, so that you can set and check them all at once. Each box is the same as the one in its own question, where it is explained. Use “Open” to check that a link goes to the right page. A link is used only when its question's answer mentions it.",
    kind: "fields",
    fields,
  });
}

// ⋘──────── Lookups ────────⋙

export const QUESTIONS: Question[] = SECTIONS.flatMap(s => s.questions);
export const QUESTION_BY_ID = new Map(QUESTIONS.map(q => [q.id, q]));

// ⋘──────── Notes that depend on other answers ────────⋙
// Keys are a question id (a note under the question) or "<question id>.<option id>". Each returns a
// note for the current answers, or null for none.

export interface ContextNote { tone: "good" | "warn" | "info"; text: string }
type Answers = { choice: Record<string, string>; multi: Record<string, string[]>; field: Record<string, string> };


export const CONTEXT_NOTES: Record<string, (s: Answers) => ContextNote | null> = {
  "gsExtensions.noDates": s => ((s.multi.lmsUses ?? []).includes("calendar")
    ? { tone: "warn", text: "You use the course website for the calendar of due dates, but this option leaves work on the grading platform out of it." }
    : null),
  teamLecture: s => ((s.multi.teamRoles ?? []).includes("tutor") && (s.multi.teamLecture ?? []).length > 0 && !(s.multi.teamLecture ?? []).includes("tutor") && (s.choice.format === "active" || s.choice.format === "flipped")
    ? { tone: "warn", text: "Your tutors or learning assistants help students during class (Class meetings), so they still need to attend those class meetings." }
    : null),
  "teamLecture.tutor": s => (s.choice.format === "active" || s.choice.format === "flipped"
    ? { tone: "good", text: "Your tutors help students during class (Class meetings), so they need to be there." }
    : null),
  "examVersions.one": s => (!(s.multi.proctoring ?? []).includes("seating")
    ? { tone: "warn", text: "You haven't chosen spread-out or assigned seating (exam-room rules, in the teaching team section). Without an empty seat between students, one version is easy to copy from." }
    : { tone: "good", text: "Students sit with an empty seat between them (exam-room rules), which makes one version workable." }),
  "accommodationTiming.window": s => (s.choice.examVersions && s.choice.examVersions !== "three"
    ? { tone: "warn", text: "Students who take the exam later can learn the questions from the main exam. Three versions (the question above) gives the testing center its own version." }
    : null),
  "accommodationTiming.either": s => (s.choice.examVersions && s.choice.examVersions !== "three"
    ? { tone: "warn", text: "Students who take the exam later can learn the questions from the main exam. Three versions (the question above) gives the testing center its own version." }
    : null),
  "examIds.turnIn": s => (s.choice.examEnd === "seated"
    ? { tone: "warn", text: "Proctors collect exams at the seats (How do exams end?), so there is no moment when students hand in their exams. Check IDs during the exam, or have students bring their exams to the front." }
    : s.choice.examEnd === "front" ? { tone: "good", text: "Students bring their exams to the front, where proctors can check each ID." } : null),
  "examHelp.hints": s => ((s.multi.proctoring ?? []).includes("accommodations")
    ? { tone: "warn", text: "Students with accommodations take the exam at the testing center, where nobody gives hints. Consider sending the hints that proctors gave to the testing center." }
    : null),
  "extensionLog.form": s => (!s.choice.exceptions ? null : s.choice.exceptions === "form"
    ? { tone: "good", text: "Students already request exceptions with an online form (Communication)." }
    : { tone: "warn", text: "Students don't request exceptions with an online form (Communication), so every request would be entered by hand." }),
  "extensionLog.platform": s => ((s.choice.missedExam === "makeup" || s.choice.attendance === "graded")
    ? { tone: "warn", text: "Makeup exams and excused absences, which your other answers allow, have no place on the grading platform; record them somewhere else too." }
    : null),
  "lateAdds.drops": s => {
    if (!s.choice.dropLowest) return null;
    const drops = (id: string) => Number(s.field[id] ?? "1") || 0;
    return s.choice.dropLowest === "drop" && drops("drop.hw") + drops("drop.quiz") > 0 ? null : { tone: "warn", text: "Your syllabus doesn't drop the lowest scores (Grades), so there are no drops to absorb the missed work." };
  },
  "lateAdds.excuse": s => (s.choice.dropLowest === "drop"
    ? { tone: "info", text: "You also drop the lowest scores (Grades), which can absorb one or two missed assignments without excusing them." }
    : null),
  "struggling.teamFlags": s => ((s.multi.teamRoles ?? []).length
    ? null
    : { tone: "warn", text: "You haven't chosen a teaching team (Teaching team syllabus) to flag students." }),
  "gradingProcess.byProblem": s => (s.field["team.calibrate"] === "1"
    ? { tone: "info", text: "With grading by problem, each rubric is applied by one grader, so calibrating everyone on the same submissions matters less. The teaching team syllabus asks each grader to check their rubric with you after the first few submissions instead." }
    : null),
  sectionQuizStakes: s => (!sectionQuizzes(s) ? null : suggestedStakes(s) === "high"
    ? { tone: "info", text: "Your section quizzes are closed-book quizzes graded for correctness (Coursework), which suggests high stakes." }
    : { tone: "info", text: "Your section quizzes are revised with help before they are submitted (Coursework), which suggests completion or low stakes." }),
  "sectionQuizGrading.ownTA": s => (s.choice.sectionQuizStakes === "high"
    ? { tone: "warn", text: "Scores vary between TAs, which matters with high-stakes quizzes. Calibrate on a few quizzes each week, or grade by problem." }
    : s.choice.sectionQuizStakes ? { tone: "good", text: "A good fit for completion or low-stakes quizzes: the TA sees their own students' work, and small differences between TAs matter little." } : null),
  "sectionQuizGrading.shared": s => (s.choice.sectionQuizStakes === "high"
    ? { tone: "good", text: "The best fit for high-stakes quizzes: each problem is graded the same way in every section." }
    : s.choice.sectionQuizStakes === "completion" ? { tone: "info", text: "More process than completion grading needs." } : null),
  sectionQuizPrep: s => {
    switch (quizStakes(s)) {
      case "high": return { tone: "warn", text: "Your section quizzes are high stakes (graded for correctness), so every section must get quizzes of equal difficulty, and questions must not reach students in later sections. A different version for each section, written or reviewed by one person, is the safest choice." };
      case "low": return { tone: "info", text: "Your section quizzes are low stakes (revised with help before submitting), so small differences between sections matter little, and leaked questions do little harm." };
      default: return null;
    }
  },
  "sectionQuizPrep.instructor": s => {
    switch (quizStakes(s)) {
      case "high": return { tone: "good", text: "Best fit for high-stakes quizzes: one author keeps difficulty equal and controls who sees the questions before the quiz." };
      case "low": return { tone: "info", text: "More control than low-stakes quizzes need; consider sharing the work with the TAs." };
      default: return null;
    }
  },
  "sectionQuizPrep.rotate": s => {
    switch (quizStakes(s)) {
      case "high": return { tone: "warn", text: "Review each draft for difficulty: with high-stakes quizzes, an easier week for some students, or a TA-written quiz that resembles their own section's practice, is unfair." };
      case "low": return { tone: "good", text: "A good fit for low-stakes quizzes: differences in difficulty from week to week matter little." };
      default: return null;
    }
  },
  "sectionQuizPrep.own": s => {
    switch (quizStakes(s)) {
      case "high": return { tone: "warn", text: "Not recommended for high-stakes quizzes: students in sections with harder quizzes are graded more harshly, and grade complaints follow." };
      case "low": return { tone: "good", text: "Acceptable for low-stakes quizzes, where revising the quiz matters more than the score." };
      default: return null;
    }
  },
};

// ⋘──────── Class size ────────⋙
// How well each option suits each class size (the "enrollment" question). Options are marked on
// the page as suiting ("good") or straining ("poor") a class of the chosen size, with a note.

export type Size = "small" | "medium" | "large" | "huge";
export const SIZE_LABELS: Record<Size, string> = { small: "fewer than 30 students", medium: "30–100 students", large: "100–300 students", huge: "more than 300 students" };

// ⋘──────── Term ────────⋙
// Holidays depend on the term (US academic calendars), so some questions and options carry notes
// for each term, shown once the term is entered in Course basics.

export type Term = "fall" | "winter" | "spring" | "summer";
export const TERM_LABELS: Record<Term, string> = { fall: "Fall", winter: "Winter", spring: "Spring", summer: "Summer" };

export function termOf(text: string | undefined): Term | undefined {
  const m = /\b(fall|autumn|winter|spring|summer)\b/i.exec(text ?? "");
  if (!m) return undefined;
  const t = m[1].toLowerCase();
  return t === "autumn" ? "fall" : t as Term;
}

// Keys are a question id (a note under the question) or "<question id>.<option id>".
export const TERM_NOTES: Record<string, Partial<Record<Term, string>>> = {
  examDay: {
    fall: "Avoid Thanksgiving week: many students leave on Tuesday or Wednesday. Veterans Day (November 11) falls on a different weekday each year, and Labor Day comes before many quarter terms start but early in semesters.",
    winter: "Two Monday holidays, Martin Luther King Jr. Day (January) and Presidents' Day (February), fall in a ten-week quarter. An exam right after a long weekend loses the class before it.",
    spring: "In a spring semester, avoid the week after spring break, when students have lost study time, and the Monday holidays in January and February. In a spring quarter, Cesar Chavez Day (March 31, in California) and Memorial Day (late May) can fall on class days.",
    summer: "Summer terms are short, so one lost class matters more. Juneteenth (June 19) and Independence Day (July 4) fall on different weekdays each year.",
  },
  "examDay.monday": {
    fall: "Labor Day and, on some campuses, Indigenous Peoples' Day are Mondays; avoid the Monday after Thanksgiving, when students are traveling back.",
    winter: "Martin Luther King Jr. Day and Presidents' Day are both Mondays in a winter quarter, so a Monday exam has fewer Mondays to choose from.",
    spring: "Spring semesters include two Monday holidays (January and February); spring quarters include Memorial Day.",
    summer: "Memorial Day can fall in early summer sessions, and Independence Day falls on a Monday in some years.",
  },
  "examDay.wednesday": {
    fall: "Avoid the Wednesday before Thanksgiving, when many students have already left.",
    winter: "No standard holidays fall on Wednesdays in winter.",
    summer: "Juneteenth and Independence Day fall on a Wednesday in some years.",
  },
  "examDay.friday": {
    fall: "Thanksgiving Friday is a holiday, and many students leave early that week. Veterans Day falls on a Friday in some years.",
    winter: "Fridays before the Monday holidays start long weekends, and attendance drops.",
    spring: "Cesar Chavez Day (in California) and, on some campuses, Good Friday can fall on a Friday.",
    summer: "Juneteenth and Independence Day fall on a Friday in some years.",
  },
  "examDay.evening": {
    fall: "Evening exams before Thanksgiving week or on Veterans Day conflict with travel and campus closures.",
    summer: "Summer students often work during the day, so evening exams may conflict with jobs less, but campus buildings may close earlier.",
  },
  hwDay: {
    fall: "Fall terms have Thanksgiving (Thursday and Friday) and Veterans Day (November 11, on a different weekday each year).",
    winter: "A winter quarter has two Monday holidays: Martin Luther King Jr. Day (January) and Presidents' Day (February).",
    spring: "A spring semester has two Monday holidays and spring break; a spring quarter has Cesar Chavez Day (in California) and Memorial Day.",
    summer: "Juneteenth (June 19) and Independence Day (July 4) fall on different weekdays each year.",
  },
  "hwDay.monday": {
    fall: "Labor Day and, on some campuses, Indigenous Peoples' Day move a Monday deadline.",
    winter: "Martin Luther King Jr. Day and Presidents' Day move the deadline twice in a ten-week quarter.",
    spring: "The January and February Monday holidays (semesters) or Memorial Day (quarters) move a Monday deadline.",
  },
  "hwDay.thursday": { fall: "Thanksgiving moves the deadline once.", summer: "Independence Day falls on a Thursday in some years." },
  "hwDay.friday": { fall: "Thanksgiving Friday moves the deadline once.", spring: "Cesar Chavez Day (in California) falls on a Friday in some years.", summer: "Juneteenth and Independence Day fall on a Friday in some years." },
  "hwDay.sunday": { fall: "A Sunday deadline over Thanksgiving weekend falls while many students are traveling." },
};

export interface SizeFit { good?: Size[]; poor?: Size[]; note?: Partial<Record<Size, string>> }

const LARGE: Size[] = ["large", "huge"];
const SMALL: Size[] = ["small", "medium"];

// Keys are "<question id>.<option id>".
export const SIZE_FITS: Record<string, SizeFit> = {
  "syllabusQuiz.quiz": { good: LARGE, note: { huge: "Answers questions that would otherwise arrive by email hundreds of times." } },
  "format.lecture": { good: ["huge"], poor: ["small"], note: { small: "With so few students, a conversation-style class costs you nothing and teaches more." } },
  "format.active": { good: ["small", "medium", "large"], note: { huge: "Works with polls and pair discussion, but group problems need TAs or learning assistants walking the room." } },
  "format.flipped": { good: SMALL, note: { large: "Needs TAs in the room to help groups.", huge: "Needs many TAs in the room to help groups, and a room where students can face each other." } },
  "attendance.graded": { good: LARGE, note: { small: "In a small class, you can take attendance by name in a minute.", huge: "Use polls or clicker questions; there is no other practical way to measure attendance." } },
  "attendance.penalty": { poor: LARGE, note: { large: "Every absence becomes an excuse to evaluate.", huge: "Hundreds of excused-absence requests to evaluate each term." } },
  "attendance.expected": { good: ["small"], note: { small: "In a small class, absences are noticed without grading them." } },
  "recordings.posted": { good: LARGE, note: { small: "Recording a small class can make students reluctant to speak." } },
  "recordings.request": { poor: ["huge"], note: { huge: "Requests for access arrive constantly." } },
  "discussion.none": { good: ["small"], poor: LARGE, note: { small: "The class itself can work like a section." } },
  "discussion.required": { good: LARGE, note: { small: "Usually unnecessary in a class this size." } },
  "switchSection.free": { poor: ["huge"], note: { huge: "Popular section times overflow their rooms." } },
  "switchSection.oneTime": { good: LARGE },
  "contentQuestions.forum": { good: LARGE, note: { small: "A forum may be quiet in a small class, and so go unchecked." } },
  "contentQuestions.class": { good: SMALL, note: { huge: "Few students will ask in front of hundreds; polls and a board for questions help." } },
  "contentQuestions.section": { good: LARGE },
  "contentQuestions.officeHours": { good: SMALL, note: { huge: "Office hours cannot hold everyone who has a question." } },
  "contentNot.email": { good: LARGE },
  "contentQuestions.email": { poor: LARGE, note: { small: "Manageable with a small class.", large: "The same questions arrive by email dozens of times." } },
  "contact.staffEmail": { good: LARGE, note: { small: "Usually unnecessary in a class this size." } },
  "contact.email": { good: SMALL, poor: ["huge"], note: { huge: "Your inbox becomes the course's help desk." } },
  "exceptions.form": { good: LARGE, note: { small: "More setup than a handful of requests needs." } },
  "exceptions.subject": { good: SMALL },
  "officeHours.appointment": { poor: LARGE, note: { small: "Workable when only a few students need meetings." } },
  "officeHours.fixedPlus": { note: { huge: "Appointment requests can pile up; consider asking students to try TA hours first." } },
  "helpPurposes.taHours": { good: LARGE },
  "helpPurposes.forum": { good: LARGE },
  "homework.online": { good: LARGE, note: { small: "With a small class, written work that you grade gives more feedback." } },
  "homework.reports": { good: SMALL, poor: ["huge"], note: { large: "Needs enough graders to read every report carefully.", huge: "Grading hundreds of reports each week takes a large grading team." } },
  "homework.problemSets": { note: { huge: "Needs a large grading team, or grading only a few problems from each set." } },
  "homework.completion": { good: LARGE },
  "collaboration.groups": { note: { huge: "Fewer submissions to grade, but group conflicts need someone to resolve them." } },
  "quizzes.section": { good: LARGE },
  "quizzes.online": { good: ["huge"] },
  "examSchedule.frequent": { good: ["small"], poor: ["huge"], note: { huge: "Each exam needs a room, proctors, and a grading session." } },
  "examAids.open": { note: { huge: "Easier to proctor than checking hundreds of note sheets." } },
  "secondChance.retake": { good: ["small"], poor: LARGE, note: { large: "Doubles the exams to write, proctor, and grade." } },
  "secondChance.corrections": { poor: ["huge"], note: { huge: "Hundreds of corrections to grade after each exam." } },
  "secondChance.replace": { good: LARGE, note: { large: "No extra grading." } },
  "missedExam.makeup": { good: SMALL, poor: ["huge"], note: { huge: "Expect several makeups for every exam." } },
  "missedExam.shift": { good: LARGE, note: { large: "No makeup exams to write." } },
  "approach.curve": { poor: ["small"], note: { small: "With so few students, a curve depends heavily on who happens to enroll.", huge: "Statistically stable, but students compete instead of collaborating." } },
  "approach.specs": { good: SMALL, poor: ["huge"], note: { huge: "Revisions multiply the grading; needs a large grading team and clear specifications." } },
  "approach.standards": { good: SMALL, poor: ["huge"], note: { huge: "Reassessments multiply the grading." } },
  "rounding.judgment": { good: ["small"], poor: LARGE, note: { large: "Hard to apply consistently across many borderline students." } },
  "late.tokens": {
    poor: ["huge"],
    note: {
      large: "Fewer extension requests, but someone must track each student's balance: Canvas and Gradescope don't track late-day balances across assignments.",
      huge: "Tracking hundreds of late-day balances needs a spreadsheet or a script, and students will ask for their balance. Harder still if work is submitted on Gradescope, since late submissions aren't transferred to Canvas.",
    },
  },
  "late.flexible": { good: ["small"], poor: LARGE, note: { large: "Grading piles up at the end of the term." } },
  "late.none": { note: { huge: "Expect many exception requests, which need a clear process." } },
  "turnaround.oneWeek": { note: { huge: "Needs a grading team sized for it." } },
  "regrades.platform": { good: LARGE },
  "regrades.person": { good: ["small"], poor: LARGE, note: { large: "Regrade requests crowd out help with the material in office hours." } },
  "integrityStyle.pledge": { good: ["small"] },
  "proctoring.seating": { note: { huge: "Spreading out needs exam rooms with about twice as many seats as students." } },
  "examVersions.one": { good: ["small"], poor: LARGE, note: { large: "A full lecture hall leaves no empty seats between students." } },
  "examVersions.two": { good: ["medium", "large"] },
  "examVersions.three": { good: ["huge"], note: { small: "More versions than a small class needs." } },
  "examIds.during": { poor: ["huge"], note: { large: "In a crowded lecture hall, proctors can't reach the middle of full rows; check those students' IDs when they turn in their exams.", huge: "In a full lecture hall, proctors can't reach the middle of the rows without disturbing students." } },
  "examIds.turnIn": { good: LARGE },
  "examIds.none": { good: ["small"], poor: LARGE, note: { small: "You know every student, so checking IDs adds little." } },
  "examHelp.check": { good: ["small"], poor: LARGE, note: { medium: "Possible with several proctors, but students wait for one to come by." } },
  "examHelp.hints": { poor: ["huge"], note: { huge: "With many proctors in many rooms, hints can't be kept consistent." } },
  "examEnd.seated": { good: ["small"], note: { large: "Needs a proctor for each block of seats.", huge: "Collecting hundreds of exams from the seats takes a long time." } },
  "examEnd.front": { good: ["small", "medium"], poor: ["huge"], note: { large: "Collect at several spots, so that lines stay short.", huge: "Hundreds of students crowd the front at once." } },
  "examEnd.rows": { good: LARGE, note: { small: "Unnecessary in a small room." } },
  "teamTasks.instructor": { poor: ["huge"], note: { huge: "Every task you keep multiplies with the size of the team." } },
  "lateAdds.extend": { poor: ["huge"], note: { huge: "Dozens of late adds, each with their own deadlines." } },
  "prereqs.conversation": { good: ["small"], poor: LARGE, note: { large: "Too many requests to meet with each student." } },
  "struggling.gradebook": { good: LARGE },
  "struggling.missing": { note: { huge: "Use a report from the platform, not a manual check." } },
  "gradingProcess.rotate": {
    good: ["small"],
    poor: LARGE,
    note: {
      large: "One grader can't grade hundreds of submissions of a whole assignment by the deadline; split each assignment among the graders, by problem.",
      huge: "Doesn't work at this size: no single grader can grade every submission of an assignment in time. Split each assignment among the graders, by problem.",
    },
  },
  "gradingProcess.byProblem": { good: LARGE, note: { huge: "With several graders on each problem, calibrate those graders with each other." } },
  "gsPenalty.copyDays": { poor: ["huge"], note: { large: "Expect dozens of late submissions to copy after each assignment.", huge: "Expect a hundred or more late submissions to copy after each assignment." } },
  "regradeDeadline.beforeFinal": { poor: LARGE, note: { large: "Expect hundreds of requests in the last week." } },
  "regradeHandler.instructor": { good: ["small", "medium"], poor: ["huge"], note: { huge: "Expect hundreds of requests after each exam." } },
  "sectionQuizGrading.ownTA": { note: { large: "With many sections, check each TA's scores for consistency, or grade by problem instead." } },
  "sectionQuizPrep.own": { poor: LARGE, note: { large: "With many sections, difficulty varies widely between them." } },
  "examDay.evening": { good: LARGE, poor: ["small"], note: { small: "Not worth the room booking and conflict exams for a small class." } },
  "examDay.section": { poor: ["small"], note: { large: "Needs a version of the exam for each section time." } },
  "submitPlatform.gradescope": { good: LARGE, note: { small: "The setup may not pay off with so few submissions to grade." } },
  "submitPlatform.paper": { poor: LARGE, note: { large: "Handing back hundreds of papers takes class time." } },
  "gsExtensions.both": { good: ["small"], poor: LARGE, note: { large: "Entering every extension twice adds up quickly." } },
  "ai.integrated": { note: { huge: "Checking how students used the tools is impractical at this size." } },
  "ai.disclose": { note: { huge: "Reading every disclosure statement takes grader time." } },
};

// Every field, wherever it appears, by id.
export const FIELD_BY_ID = new Map<string, Field>();
for (const q of QUESTIONS) {
  for (const f of q.fields ?? []) FIELD_BY_ID.set(f.id, f);
  for (const o of q.options ?? []) for (const f of o.fields ?? []) if (!FIELD_BY_ID.has(f.id)) FIELD_BY_ID.set(f.id, f);
}

// The questions that count toward progress (decisions, not facts).
export const DECISIONS = QUESTIONS.filter(q => q.kind === "single" || q.kind === "multi" || q.kind === "scale" || q.kind === "perRole");

// ⋘──────── Grade components and scales ────────⋙

export type ComponentKind = "participation" | "quizzes" | "homework" | "exams" | "midterms" | "final" | "project" | "labs" | "other";

export const COMPONENT_KINDS: [ComponentKind, string][] = [
  ["participation", "Participation"],
  ["quizzes", "Quizzes"],
  ["homework", "Homework"],
  ["exams", "Exams (all)"],
  ["midterms", "Midterm exams"],
  ["final", "Final exam"],
  ["project", "Project"],
  ["labs", "Labs"],
  ["other", "Other"],
];

export interface WeightRow { kind: ComponentKind; label: string; weight: number; desc: string }

export const DEFAULT_WEIGHTS: WeightRow[] = [
  { kind: "participation", label: "Participation", weight: 5, desc: "" },
  { kind: "quizzes", label: "Quizzes", weight: 10, desc: "" },
  { kind: "homework", label: "Homework", weight: 25, desc: "" },
  { kind: "midterms", label: "Midterm exams", weight: 30, desc: "" },
  { kind: "final", label: "Final exam", weight: 30, desc: "" },
];

export interface ScaleRow { grade: string; min: number; desc: string }

const DESCRIPTIONS: Record<string, string> = {
  A: "The student has demonstrated a strong and comprehensive understanding of the topics of this course.",
  B: "The student has demonstrated a good understanding of the topics of this course, but there are some gaps in their knowledge or effort.",
  C: "The student has demonstrated a moderate understanding of the topics of this course, but there are significant gaps in their knowledge or effort.",
  D: "The student has demonstrated a weak understanding of the topics of this course.",
  F: "The student has not demonstrated a sufficient understanding of the topics of this course.",
};

function scaleRows(pairs: [string, number][]): ScaleRow[] {
  return pairs.map(([grade, min]) => ({ grade, min, desc: DESCRIPTIONS[grade] ?? "" }));
}

export const SCALE_PRESETS: Record<string, ScaleRow[]> = {
  plusMinus: scaleRows([["A", 93], ["A−", 90], ["B+", 87], ["B", 83], ["B−", 80], ["C+", 77], ["C", 73], ["C−", 70], ["D+", 67], ["D", 63], ["D−", 60], ["F", 0]]),
  aPlus: scaleRows([["A+", 97], ["A", 93], ["A−", 90], ["B+", 87], ["B", 83], ["B−", 80], ["C+", 77], ["C", 73], ["C−", 70], ["D", 60], ["F", 0]]),
  letters: scaleRows([["A", 90], ["B", 80], ["C", 70], ["D", 60], ["F", 0]]),
};
