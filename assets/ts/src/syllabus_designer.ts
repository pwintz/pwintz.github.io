// ╭───────────────────────────────────────────────────────────────╮
// │   Syllabus designer: questions with pros and cons → syllabus  │
// ╰───────────────────────────────────────────────────────────────╯
// The page lists the decisions that go into a STEM course syllabus (syllabus/questions.ts), each
// with options and their pros and cons. As the instructor answers, the syllabus is written from
// the answers (syllabus/generate.ts) and shown in a preview beside the questions. The syllabus can
// be copied as formatted text (for pasting into Canvas or another learning management system) or
// downloaded as HTML or Markdown. Answers are saved in this browser.

import { setupHelp } from "./common/help";
import { setupPanels } from "./common/panels";
import { loadJSON, loadString, removeSaved, saveJSON, saveString } from "./common/storage";
import { State, generate } from "./syllabus/generate";
import { WEEKDAYS } from "./syllabus/read";
import { Block, Item, esc, inlineHtml, toHtml, toMarkdown, toPlain } from "./syllabus/markup";
import { PRESETS } from "./syllabus/presets";
import { DATE_STYLES, formatDate, formatDateValue, setDateStyle } from "./syllabus/dates";
import { Holiday, approximateTerm, holidaysBetween } from "./syllabus/holidays";
import { generateQuiz } from "./syllabus/quiz";
import { generateTeam } from "./syllabus/team";
import {
  COMPONENT_KINDS, CUSTOM, ComponentKind, DECISIONS, DEFAULT_WEIGHTS, FIELD_BY_ID, Field, Option, Question,
  CONTEXT_NOTES, QUESTION_BY_ID, SCALE_PRESETS, SECTIONS, SIZE_FITS, SIZE_LABELS, Size, TERM_LABELS, TERM_NOTES, termOf,
} from "./syllabus/questions";

const STATE_KEY = "syllabus-designer-state";
const PINNED_KEY = "syllabus-designer-pinned";
const PROS_KEY = "syllabus-designer-pros-cons";
const SYNC_KEY = "syllabus-designer-sync";
const FOCUS_KEY = "syllabus-designer-focus";
const REMAINING_KEY = "syllabus-designer-remaining";
const DATE_FIELD = "doc.dateFormat";
const DOC_KEY = "syllabus-designer-document";

// Which document the preview and exports show: the student syllabus, the teaching team syllabus,
// or the syllabus quiz.
type Doc = "student" | "team" | "quiz";
const DOCS: Record<Doc, { generate: (s: State) => Block[]; file: string }> = {
  student: { generate, file: "syllabus" },
  team: { generate: generateTeam, file: "teaching-team-syllabus" },
  quiz: { generate: generateQuiz, file: "syllabus-quiz" },
};
const savedDoc = loadString(DOC_KEY) as Doc | null;
let doc: Doc = savedDoc && savedDoc in DOCS ? savedDoc : "student";
const TEAM_SECTION = "team";

function emptyState(): State {
  return { choice: {}, multi: {}, field: {}, weights: structuredClone(DEFAULT_WEIGHTS), scale: [] };
}

// Saved answers from an older version of the page may lack parts or have the wrong shapes.
function validState(x: unknown): State | null {
  if (!x || typeof x !== "object") return null;
  const s = x as Partial<State>;
  const obj = (o: unknown) => (o && typeof o === "object" && !Array.isArray(o) ? o : {});
  return {
    choice: obj(s.choice) as State["choice"],
    multi: obj(s.multi) as State["multi"],
    field: obj(s.field) as State["field"],
    weights: Array.isArray(s.weights) ? s.weights.filter(w => w && typeof w.weight === "number") : structuredClone(DEFAULT_WEIGHTS),
    scale: Array.isArray(s.scale) ? s.scale.filter(r => r && typeof r.min === "number") : [],
  };
}

let state: State = validState(loadJSON(STATE_KEY)) ?? emptyState();

// ⋘──────── Elements ────────⋙

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const questionsEl = $<HTMLDivElement>("syl-questions");
const previewEl = $<HTMLDivElement>("syl-preview");
const previewWrap = $<HTMLElement>("syl-preview-wrap");
const layout = $<HTMLDivElement>("syl-layout");
const progressEl = $<HTMLSpanElement>("syl-progress");
const navEl = $<HTMLElement>("syl-nav");
const exampleSelect = $<HTMLSelectElement>("syl-example");
const resetButton = $<HTMLButtonElement>("syl-reset");
const prosToggle = $<HTMLInputElement>("syl-pros-cons");
const copyButton = $<HTMLButtonElement>("syl-copy");
const panel = document.querySelector<HTMLElement>(".syl-panel")!;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> & { className?: string } = {}, ...children: (Node | string)[]): HTMLElementTagNameMap[K] {
  const e = Object.assign(document.createElement(tag), props);
  e.append(...children);
  return e;
}

// ⋘──────── Building the questions ────────⋙

// Questions that list the holidays in the term, and the weekday of each weekday option.
const HOLIDAY_QUESTIONS = ["hwDay", "examDay"];
const WEEKDAY_OF: Record<string, number> = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5 };

// ⋘──────── Date lists ────────⋙
// A list of dates ("dates") or of dates with descriptions ("dateList"), edited as rows of date
// pickers. The rows' inputs are not field inputs themselves; the widget writes the whole list to
// its field, and is redrawn when the field changes elsewhere (the same field can appear twice).

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const widgets: { id: string; el: HTMLElement; render: () => void }[] = [];

interface DateRow { start: string; end: string; text: string }

function dateListEl(f: Field, labelText: HTMLElement): HTMLElement {
  const withText = f.kind === "dateList";
  // For assignments, the second date is when the assignment becomes available, stored first, as a
  // range ending at the deadline ("available..deadline"). Otherwise it ends a range of dates.
  const avail = !!f.availableFrom;
  const list = el("div", { className: `syl-dates${withText ? " syl-dates-text" : ""}` });
  const parse = (value: string): DateRow[] => withText
    ? value.split("\n").filter(l => l.trim()).map(l => {
      const [d, ...rest] = l.split("|");
      const [a = "", b = ""] = d.trim().split("..");
      const [start, end] = avail && b ? [b, a] : [a, b];
      return { start, end, text: rest.join("|").trim() };
    })
    : value.split(/[;\n]/).map(t => t.trim()).filter(Boolean).map(start => ({ start, end: "", text: "" }));
  // Dates typed as text before the date pickers stay editable as text.
  const dateInput = (value: string, label: string, className: string) => {
    const input = el("input", { type: value && !ISO_DATE.test(value) ? "text" : "date", value, ariaLabel: label, className });
    if (input.type === "text") input.title = "Clear this and choose a date";
    return input;
  };
  const rowEl = (r: DateRow) => {
    const remove = el("button", { type: "button", className: "syl-remove", textContent: "×", ariaLabel: "Remove this date" });
    remove.addEventListener("click", () => { row.remove(); save(remove); });
    const row = el("div", { className: "syl-date-row" },
      dateInput(r.start, avail ? "Deadline" : "Date", "syl-date-start"),
      ...(withText ? [
        dateInput(r.end, avail ? "Available from (optional)" : "End date, for a range (optional)", avail ? "syl-date-end syl-date-avail" : "syl-date-end"),
        el("input", { type: "text", value: r.text, placeholder: f.placeholder ?? "", ariaLabel: "Event", className: "syl-date-text" }),
      ] : []),
      remove);
    return row;
  };
  const serialize = () => [...list.querySelectorAll<HTMLElement>(".syl-date-row:not(.syl-date-head)")].map(row => {
    const start = row.querySelector<HTMLInputElement>(".syl-date-start")!.value.trim();
    if (!withText) return start;
    const end = row.querySelector<HTMLInputElement>(".syl-date-end")!.value.trim();
    const text = row.querySelector<HTMLInputElement>(".syl-date-text")!.value.trim();
    const dates = !end ? start : avail ? `${end}..${start}` : `${start}..${end}`;
    return start || text ? `${dates} | ${text}` : "";
  }).filter(Boolean).join(withText ? "\n" : "; ");
  const save = (source: Element) => setFieldValue(f.id, serialize(), source);
  const add = el("button", { type: "button", textContent: withText ? "Add date" : "Add exam date" });
  add.addEventListener("click", () => {
    const row = rowEl({ start: "", end: "", text: "" });
    add.before(row);
    row.querySelector("input")!.focus();
  });
  const head = withText ? el("div", { className: "syl-date-row syl-date-head" }, el("span", { textContent: avail ? "Deadline" : "Date" }), el("span", { textContent: avail ? "Available from" : "End (for a range)" }), el("span", { textContent: avail ? "Assignment" : "Event" }), el("span")) : null;
  const render = () => list.replaceChildren(...(head ? [head] : []), ...parse(state.field[f.id] ?? "").map(rowEl), add);
  list.addEventListener("input", e => save(e.target as Element));
  widgets.push({ id: f.id, el: list, render });
  render();
  return el("div", { className: "syl-field syl-field-wide" }, el("span", { className: "syl-field-label" }, labelText), list);
}

// A list of records ("rows"), such as books, edited as cards of labeled boxes. Like a date list,
// the widget writes the whole list to its field as lines of values separated by "|".
function rowsEl(f: Field, labelText: HTMLElement): HTMLElement {
  const columns = f.columns ?? [];
  const list = el("div", { className: "syl-rows" });
  const parse = (value: string) => value.split("\n").filter(l => l.trim()).map(l => l.split("|").map(c => c.trim()));
  const cardEl = (values: string[]) => {
    const boxes = columns.map((c, i) => {
      const value = values[i] ?? "";
      let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (c.options) {
        const select = el("select");
        for (const o of c.options) select.append(el("option", { value: o, textContent: o }));
        if (value && !c.options.includes(value)) select.append(el("option", { value, textContent: value }));
        select.value = value || c.options[0];
        input = select;
      } else if (c.long) input = el("textarea", { rows: 2, value, placeholder: c.placeholder ?? "" });
      else input = el("input", { type: "text", value, placeholder: c.placeholder ?? "" });
      if (c.label === "Link") input.dataset.url = "1";
      input.classList.add("syl-row-value");
      return el("label", { className: `syl-row-box syl-span-${c.span ?? 1}` }, el("span", { className: "syl-field-label", textContent: c.label }), input);
    });
    const remove = el("button", { type: "button", className: "syl-remove", textContent: "×", ariaLabel: "Remove" });
    const card = el("div", { className: "syl-row-card" }, ...boxes, remove);
    remove.addEventListener("click", () => { card.remove(); save(remove); });
    return card;
  };
  // "|" separates the values, and each record is one line, so neither can be inside a value.
  const clean = (v: string) => v.replace(/\s*\n\s*/g, " ").replace(/\|/g, "/").trim();
  const serialize = () => [...list.querySelectorAll(".syl-row-card")].map(card => {
    const values = [...card.querySelectorAll<HTMLInputElement>(".syl-row-value")].map(i => clean(i.value));
    // A row with only the drop-down's first choice is empty.
    const filled = values.some((v, i) => v && !(columns[i].options && v === columns[i].options![0]));
    return filled ? values.join(" | ").replace(/(\s\|\s*)+$/, "") : "";
  }).filter(Boolean).join("\n");
  const save = (source: Element) => setFieldValue(f.id, serialize(), source);
  const add = el("button", { type: "button", textContent: f.addLabel ?? "Add" });
  add.addEventListener("click", () => {
    const card = cardEl([]);
    add.before(card);
    card.querySelector<HTMLElement>("input, textarea")?.focus();
  });
  const render = () => {
    const rows = parse(state.field[f.id] ?? "");
    list.replaceChildren(...(rows.length ? rows : [[]]).map(cardEl), add);
  };
  list.addEventListener("input", e => save(e.target as Element));
  list.addEventListener("change", e => { if (e.target instanceof HTMLSelectElement) save(e.target); });
  widgets.push({ id: f.id, el: list, render });
  render();
  return el("div", { className: "syl-field syl-field-wide" }, el("span", { className: "syl-field-label" }, labelText), list);
}

// A button that turns the selected text in a box (or all of it) into a Markdown link,
// [text](https://), and selects "https://" so that the address can be pasted over it.
function linkButton(input: HTMLInputElement | HTMLTextAreaElement): HTMLButtonElement {
  const button = el("button", { type: "button", className: "syl-link-btn", textContent: "Link", title: "Turn the selected text (or all of it) into a link" });
  button.addEventListener("mousedown", e => e.preventDefault());   // Keep the selection.
  button.addEventListener("click", () => {
    const value = input.value;
    let a = input.selectionStart ?? 0;
    let b = input.selectionEnd ?? 0;
    if (a === b) { a = 0; b = value.length; }
    const selected = value.slice(a, b);
    const text = selected.trim() || "link text";
    // Already a link: select its address.
    const existing = /^\[[^\]]*\]\(([^)]*)\)$/.exec(selected.trim());
    input.focus();
    if (existing) {
      const start = a + selected.indexOf("](") + 2;
      input.setSelectionRange(start, start + existing[1].length);
      return;
    }
    input.value = `${value.slice(0, a)}[${text}](https://)${value.slice(b)}`;
    const start = a + text.length + 3;
    input.setSelectionRange(start, start + "https://".length);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  return button;
}

// Days of the week, as a row of checkboxes, stored as "monday,wednesday,friday".
function weekdaysEl(f: Field, labelText: HTMLElement): HTMLElement {
  const row = el("div", { className: "syl-weekdays" });
  const boxes = WEEKDAYS.map(([id, name]) => {
    const box = el("input", { type: "checkbox", value: id, ariaLabel: name });
    row.append(el("label", { className: "syl-weekday" }, box, el("span", { textContent: name.slice(0, 3) })));
    return box;
  });
  // Changes are handled here, not as a question's checkboxes.
  row.addEventListener("change", e => {
    e.stopPropagation();
    setFieldValue(f.id, boxes.filter(b => b.checked).map(b => b.value).join(","), e.target as Element);
  });
  const render = () => {
    const days = (state.field[f.id] ?? "").split(",");
    boxes.forEach(b => (b.checked = days.includes(b.value)));
  };
  widgets.push({ id: f.id, el: row, render });
  render();
  return el("div", { className: "syl-field syl-field-wide" }, el("span", { className: "syl-field-label" }, labelText), row);
}

function fieldEl(f: Field): HTMLElement {
  const labelText = el("span", { textContent: f.label });
  if (f.help) labelText.dataset.help = f.help;
  if (f.kind === "dates" || f.kind === "dateList") return dateListEl(f, labelText);
  if (f.kind === "rows") return rowsEl(f, labelText);
  if (f.kind === "weekdays") return weekdaysEl(f, labelText);
  if (f.kind === "checkbox") {
    const input = el("input", { type: "checkbox" });
    input.dataset.field = f.id;
    return el("label", { className: "syl-check syl-field-wide" }, input, labelText);
  }
  const input = f.kind === "textarea"
    ? el("textarea", { rows: 3, placeholder: f.placeholder ?? "" })
    : el("input", { type: f.kind === "number" ? "number" : f.kind === "date" ? "date" : "text", placeholder: f.placeholder ?? "" });
  if (f.kind === "number") Object.assign(input, { min: "0", step: "1", inputMode: "numeric" });
  if (f.pattern) {
    input.dataset.pattern = f.pattern;
    input.dataset.hint = f.patternHint ?? "a valid value";
  }
  input.dataset.field = f.id;
  // Boxes for a web address alone.
  if (/^https?:\/\//.test(f.placeholder ?? "") || /link\)?/i.test(f.label)) input.dataset.url = "1";
  // Boxes whose help suggests a Markdown link get a button that writes one.
  const box = f.help?.includes("Markdown link") ? el("span", { className: "syl-link-box" }, input, linkButton(input)) : input;
  return el("label", { className: `syl-field${f.wide || f.kind === "textarea" ? " syl-field-wide" : ""}` }, el("span", { className: "syl-field-label" }, labelText), box);
}

function optionCard(q: Question, o: Option): HTMLElement {
  // In a "perRole" question, the cards only describe the options; the choices are in the table.
  const info = q.kind === "perRole";
  const input = el("input", { type: q.kind === "multi" ? "checkbox" : "radio", name: `syl-${q.id}`, value: o.id });
  input.dataset.q = q.id;
  const card = el(info ? "div" : "label", { className: `syl-opt${info ? " syl-opt-info" : ""}` }, el("span", { className: "syl-opt-head" }, ...(info ? [] : [input]), el("span", { className: "syl-opt-label", textContent: o.label })));
  card.dataset.opt = o.id;
  if (SIZE_FITS[`${q.id}.${o.id}`]) card.dataset.fit = `${q.id}.${o.id}`;
  if (o.summary) {
    const summary = el("span", { className: "syl-opt-summary", textContent: o.summary });
    if (/\{\{.+?\}\}/.test(o.summary)) summary.dataset.template = o.summary;
    card.append(summary);
  }
  if (o.pros?.length) card.append(el("ul", { className: "syl-pros" }, ...o.pros.map(t => el("li", { textContent: t }))));
  if (o.cons?.length) card.append(el("ul", { className: "syl-cons" }, ...o.cons.map(t => el("li", { textContent: t }))));
  if (card.dataset.fit) card.append(el("span", { className: "syl-size", hidden: true }));
  if (HOLIDAY_QUESTIONS.includes(q.id) && o.id in WEEKDAY_OF) {
    const note = el("span", { className: "syl-term syl-holiday-opt", hidden: true });
    note.dataset.weekday = String(WEEKDAY_OF[o.id]);
    card.append(note);
  }
  if (CONTEXT_NOTES[`${q.id}.${o.id}`]) {
    const note = el("span", { className: "syl-context", hidden: true });
    note.dataset.context = `${q.id}.${o.id}`;
    card.append(note);
  }
  if (TERM_NOTES[`${q.id}.${o.id}`]) {
    const note = el("span", { className: "syl-term", hidden: true });
    note.dataset.term = `${q.id}.${o.id}`;
    card.append(note);
  }
  return card;
}

// ⋘──────── Starting your own text from an option ────────⋙
// A "Write my own" box can be filled with the text that an option writes, to edit from there.

// The text written from question q with option id chosen, in the markup of the box.
function optionText(q: string, id: string): string {
  const trial: State = { ...structuredClone(state), choice: { ...state.choice, [q]: id } };
  const item = (i: Item): string[] => (typeof i === "string" ? [`- ${i}`] : [`- ${i.text}`, ...i.items.flatMap(item)]);
  for (const d of ["student", "team"] as Doc[]) {
    const own = DOCS[d].generate(trial).filter(b => b.src === q && !/^h[1-4]$/.test(b.t));
    if (!own.length) continue;
    return own.map(b => {
      switch (b.t) {
        case "p": return b.text;
        case "ul": case "ol": return b.items.flatMap(item).join("\n");
        case "kv": return b.rows.map(([label, value]) => `**${label}:** ${value.map(v => ("text" in v ? v.text : "")).join(" ")}`).join("\n\n");
        case "table": return b.rows.map(r => `- ${r.join(" | ")}`).join("\n");
        default: return "";
      }
    }).filter(Boolean).join("\n\n");
  }
  return "";
}

function startFromEl(q: Question, options: Option[]): HTMLElement {
  const select = el("select", { ariaLabel: "Option to start from" },
    el("option", { value: "", textContent: "Start from an option…" }),
    ...options.map(o => el("option", { value: o.id, textContent: o.label })));
  const note = el("span", { className: "syl-start-note" });
  select.addEventListener("change", () => {
    const id = select.value;
    select.value = "";
    if (!id) return;
    const box = select.closest(".syl-followup")!.querySelector<HTMLTextAreaElement>(`textarea[data-field="${q.id}.custom"]`)!;
    if (box.value.trim() && !confirm("Replace your text with the text from this option?")) return;
    const text = optionText(q.id, id);
    note.textContent = text ? "" : "That option doesn't write any text here.";
    if (!text) return;
    box.value = text;
    setField(box, text);
    box.focus();
  });
  return el("div", { className: "syl-start-from syl-field-wide" }, select, note);
}

// A "perRole" question: the options as cards (for their pros and cons), then a table with one row
// of choices for each role.
function perRoleEl(q: Question): HTMLElement {
  const options = q.options ?? [];
  const head = el("tr", {}, el("th", { textContent: "" }), ...options.map(o => el("th", { textContent: o.label })));
  const rows = (q.roles ?? []).map(r => {
    const cells = options.map(o => {
      const input = el("input", { type: "radio", name: `syl-${q.id}-${r.id}`, value: o.id, ariaLabel: `${r.label}: ${o.label}` });
      input.dataset.q = `${q.id}.${r.id}`;
      return el("td", {}, input);
    });
    const row = el("tr", {}, el("th", { scope: "row", textContent: r.label }), ...cells);
    row.dataset.role = r.id;
    return row;
  });
  return el("div", { className: "syl-role-table" }, el("table", {}, el("thead", {}, head), el("tbody", {}, ...rows)));
}

function questionCard(q: Question, number: string): HTMLElement {
  const card = el("div", { className: "syl-q", id: `syl-q-${q.id}` });
  card.dataset.q = q.id;
  const clear = el("button", { type: "button", className: "syl-clear", textContent: "Clear" });
  clear.dataset.clear = q.id;
  card.append(el("div", { className: "syl-q-head" }, el("h3", {}, el("span", { className: "syl-q-num", textContent: number }), q.title), ...(q.kind === "single" || q.kind === "multi" || q.kind === "perRole" ? [clear] : [])));
  if (q.why) card.append(el("p", { className: "syl-why", textContent: q.why }));
  if (q.relevant) card.append(el("p", { className: "syl-na-note", textContent: q.irrelevantNote ?? "Not needed with your other answers." }));
  if (TERM_NOTES[q.id]) {
    const note = el("p", { className: "syl-term syl-term-q" });
    note.dataset.term = q.id;
    card.append(note);
  }
  if (HOLIDAY_QUESTIONS.includes(q.id)) card.append(el("div", { className: "syl-holidays" }));
  if (CONTEXT_NOTES[q.id]) {
    const note = el("p", { className: "syl-context syl-context-q", hidden: true });
    note.dataset.context = q.id;
    card.append(note);
  }

  const options = [...(q.options ?? [])];
  if (q.custom) {
    options.push(q.kind === "multi"
      ? { id: CUSTOM, label: "Add your own", summary: "Add items of your own to the list." }
      : { id: CUSTOM, label: "Write my own", summary: "Replace the generated text with your own." });
  }
  if (options.length) {
    // Follow-up fields, shown for the chosen options, right below the option they belong to.
    const followup = (o: Option): HTMLElement | null => {
      const fields = o.id === CUSTOM
        ? [q.kind === "multi"
          ? { id: `${q.id}.custom`, label: "Your items (one per line)", kind: "textarea" as const, wide: true, help: "Each line becomes an item in the list. Write **bold** for a bold lead-in, as in “**Be curious.** Ask why, not only how.”" }
          : { id: `${q.id}.custom`, label: "Your text", kind: "textarea" as const, wide: true, help: "#syl-custom-help" }]
        : o.fields ?? [];
      if (!fields.length) return null;
      const box = el("div", { className: "syl-followup", hidden: true }, ...fields.map(fieldEl));
      box.dataset.followup = o.id;
      if (o.id === CUSTOM && q.kind === "single") box.append(startFromEl(q, options.filter(x => x.id !== CUSTOM)));
      return box;
    };
    if (q.kind === "multi" || q.kind === "single") {
      card.append(el("div", { className: "syl-options" }, ...options.map(o => {
        const box = followup(o);
        return box ? el("div", { className: "syl-opt-group" }, optionCard(q, o), box) : optionCard(q, o);
      })));
    } else {
      card.append(el("div", { className: "syl-options" }, ...options.map(o => optionCard(q, o))));
      for (const o of options) {
        const box = followup(o);
        if (box) card.append(box);
      }
    }
  }
  if (q.kind === "perRole") card.append(perRoleEl(q));
  if (q.kind === "weights") card.append(el("div", { id: "syl-weights" }));
  if (q.kind === "scale") card.append(el("div", { id: "syl-scale" }));
  if (q.fields?.length) card.append(el("div", { className: "syl-fields" }, ...q.fields.map(fieldEl)));
  return card;
}

SECTIONS.forEach((section, i) => {
  const sec = el("section", { className: "syl-section", id: `syl-sec-${section.id}` }, el("h2", { textContent: `${i + 1}. ${section.title}` }));
  if (section.intro) sec.append(el("p", { className: "syl-intro", textContent: section.intro }));
  section.questions.forEach((q, j) => sec.append(questionCard(q, `${i + 1}.${j + 1}`)));
  questionsEl.append(sec);
  const link = el("a", { href: `#syl-sec-${section.id}`, className: "syl-nav-link" });
  link.dataset.section = section.id;
  navEl.append(link);
});

// ⋘──────── Grade components (weights) ────────⋙

const weightsEl = $<HTMLDivElement>("syl-weights");

function renderWeights(): void {
  const rows = state.weights.map((w, i) => {
    const kind = el("select", { ariaLabel: "Kind" }, ...COMPONENT_KINDS.map(([k, label]) => el("option", { value: k, textContent: label, selected: k === w.kind })));
    kind.addEventListener("change", () => { state.weights[i].kind = kind.value as ComponentKind; changed("weights"); });
    const label = el("input", { type: "text", value: w.label, ariaLabel: "Name" });
    label.addEventListener("input", () => { state.weights[i].label = label.value; changed("weights"); });
    const weight = el("input", { type: "number", min: "0", max: "100", step: "any", value: String(w.weight), ariaLabel: "Weight (percent)" });
    weight.addEventListener("input", () => { state.weights[i].weight = Number(weight.value) || 0; changed("weights"); });
    const desc = el("textarea", { rows: 1, value: w.desc, placeholder: "Written from your answers", ariaLabel: "Description" });
    desc.addEventListener("input", () => { state.weights[i].desc = desc.value; changed("weights"); });
    const remove = el("button", { type: "button", className: "syl-remove", textContent: "×", ariaLabel: `Remove ${w.label}` });
    remove.addEventListener("click", () => { state.weights.splice(i, 1); renderWeights(); changed("weights"); });
    const row = el("div", { className: "syl-weight-row" }, el("span", { className: "syl-pct" }, weight, "%"), label, kind, desc, remove);
    if (unused(w)) {
      row.classList.add("syl-unused");
      row.title = "Not counted: you chose No quizzes. Remove this component, or give its weight to the others.";
    }
    return row;
  });
  const unusedNote = state.weights.some(w => unused(w) && w.weight > 0)
    ? [el("p", { className: "syl-note syl-warn", textContent: "Quiz components are left out of the syllabus because you chose No quizzes (Coursework). Remove them, and give their weight to the other components." })]
    : [];
  const add = el("button", { type: "button", textContent: "Add component" });
  add.addEventListener("click", () => { state.weights.push({ kind: "other", label: "Other", weight: 0, desc: "" }); renderWeights(); changed("weights"); });
  const total = el("span", { id: "syl-weight-total", className: "syl-total" });
  const head = el("div", { className: "syl-weight-row syl-weight-head" }, el("span", { textContent: "Weight" }), el("span", { textContent: "Name" }), el("span", { textContent: "Kind" }), el("span", { textContent: "Description (optional)" }), el("span"));
  weightsEl.replaceChildren(el("p", { id: "syl-weights-note", className: "syl-note", hidden: true, textContent: "Weights are not used with specifications or standards-based grading; the requirements for each grade replace them." }), head, ...rows, ...unusedNote, el("div", { className: "syl-weight-foot" }, add, total));
  updateTotal();
}

// A component that the syllabus leaves out: quizzes, when the course has none.
function unused(w: { kind: ComponentKind }): boolean {
  return w.kind === "quizzes" && state.choice.quizzes === "none";
}

function updateTotal(): void {
  const total = state.weights.filter(w => !unused(w)).reduce((sum, w) => sum + w.weight, 0);
  const totalEl = document.getElementById("syl-weight-total")!;
  totalEl.textContent = `Total: ${Number(total.toFixed(2))}%${total === 100 ? "" : " (should be 100%)"}`;
  totalEl.classList.toggle("syl-warn", total !== 100);
  const specs = state.choice.approach === "specs" || state.choice.approach === "standards";
  document.getElementById("syl-weights-note")!.hidden = !specs;
}

// ⋘──────── Grade scale ────────⋙

const scaleEl = $<HTMLDivElement>("syl-scale");

function renderScale(): void {
  if (!state.scale.length) {
    scaleEl.replaceChildren(el("p", { className: "syl-note", textContent: "Choose a starting point above to edit the thresholds." }));
    return;
  }
  const describe = state.field["scale.describe"] === "1";
  const rows = state.scale.map((r, i) => {
    const grade = el("input", { type: "text", value: r.grade, ariaLabel: "Grade" });
    grade.addEventListener("input", () => { state.scale[i].grade = grade.value; checkScaleOrder(); changed("scale"); });
    const min = el("input", { type: "number", min: "0", max: "100", step: "any", value: String(r.min), ariaLabel: `Minimum percent for ${r.grade}` });
    min.addEventListener("input", () => { state.scale[i].min = Number(min.value) || 0; checkScaleOrder(); changed("scale"); });
    const desc = el("input", { type: "text", value: r.desc, ariaLabel: `Description of ${r.grade}`, placeholder: "Description (optional)" });
    desc.addEventListener("input", () => { state.scale[i].desc = desc.value; changed("scale"); });
    desc.hidden = !describe;
    const remove = el("button", { type: "button", className: "syl-remove", textContent: "×", ariaLabel: `Remove ${r.grade}` });
    remove.addEventListener("click", () => { state.scale.splice(i, 1); renderScale(); changed("scale"); });
    return el("div", { className: `syl-scale-row${describe ? " syl-scale-described" : ""}` }, grade, el("span", { className: "syl-pct" }, "≥ ", min, "%"), desc, remove);
  });
  const add = el("button", { type: "button", textContent: "Add grade" });
  add.addEventListener("click", () => { state.scale.push({ grade: "", min: 0, desc: "" }); renderScale(); changed("scale"); });
  scaleEl.replaceChildren(...rows, el("div", { className: "syl-weight-foot" }, add));
  checkScaleOrder();
}

// Warns at each grade whose minimum isn't below the minimum of the grade above it.
function checkScaleOrder(): void {
  const rows = [...scaleEl.querySelectorAll(".syl-scale-row")];
  rows.forEach((row, i) => {
    const above = state.scale[i - 1];
    const here = state.scale[i];
    const label = (r: { grade: string }) => (r.grade.trim() ? `“${r.grade.trim()}”` : "the grade above");
    dateWarning(row, above && here.min >= above.min
      ? `The minimum for ${here.grade.trim() ? `“${here.grade.trim()}”` : "this grade"} (${here.min}%) should be lower than the minimum for ${label(above)} (${above.min}%).`
      : "");
  });
}

// ⋘──────── Showing the answers ────────⋙

// Puts the answers into the inputs (after loading saved answers or an example).
function fillInputs(): void {
  for (const input of questionsEl.querySelectorAll<HTMLInputElement>("input[data-q]")) {
    const q = input.dataset.q!;
    input.checked = input.type === "radio" ? state.choice[q] === input.value : (state.multi[q] ?? []).includes(input.value);
  }
  for (const input of questionsEl.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-field]")) {
    const value = state.field[input.dataset.field!] ?? "";
    if (input instanceof HTMLInputElement && input.type === "checkbox") input.checked = value === "1";
    else input.value = value;
  }
  for (const w of widgets) w.render();
  renderWeights();
  renderScale();
  updateSelections();
  checkAllEntries();
  dateSelect.value = state.field[DATE_FIELD] ?? "long";
}

// The roles asked in a "perRole" question: those chosen in its rolesFrom question.
function roleRows(q: Question): { id: string; label: string }[] {
  const chosen = state.multi[q.rolesFrom ?? ""] ?? [];
  return (q.roles ?? []).filter(r => !q.rolesFrom || chosen.includes(r.id));
}

function answered(q: Question): boolean {
  if (q.kind === "perRole") {
    const roles = roleRows(q);
    return roles.length > 0 && roles.every(r => !!state.choice[`${q.id}.${r.id}`]);
  }
  return q.kind === "multi" ? (state.multi[q.id]?.length ?? 0) > 0 : !!state.choice[q.id];
}

// ⋘──────── Dates outside the term ────────⋙
// Warns when the last day of instruction is before the first, or when another date is outside
// the term. The final exam and the dates in lists may fall after the last day of instruction, up
// to the final exam (such as "Grades due" during finals week).

function dateWarning(host: Element, message: string): void {
  let note = host.nextElementSibling as HTMLElement | null;
  if (!note?.classList.contains("syl-date-warn")) note = null;
  if (!message) { note?.remove(); return; }
  if (!note) {
    note = el("span", { className: "syl-date-warn", role: "status" });
    host.after(note);
  }
  note.textContent = message;
}

function checkDates(): void {
  const start = state.field["course.start"] ?? "";
  const end = state.field["course.end"] ?? "";
  const final = state.field["course.finalDate"] ?? "";
  const valid = (d: string) => ISO_DATE.test(d);
  const term = valid(start) && valid(end) && end >= start;
  const show = (d: string) => formatDate(d, true) ?? d;
  for (const input of questionsEl.querySelectorAll<HTMLInputElement>('input[type="date"]')) {
    const value = input.value;
    const row = input.closest(".syl-date-row");
    const id = input.dataset.field;
    let message = "";
    const deadline = row?.querySelector<HTMLInputElement>(".syl-date-start")?.value ?? "";
    if (input.classList.contains("syl-date-avail") && valid(value) && valid(deadline) && value > deadline) message = `This assignment becomes available after its deadline (${show(deadline)}).`;
    else if (id === "course.start") message = "";
    else if (id === "course.end") {
      if (valid(value) && valid(start) && value < start) message = `The last day of instruction is before the first day (${show(start)}).`;
    } else if (valid(value) && term) {
      const latest = id === "course.finalDate" ? "" : valid(final) && final > end ? final : end;
      if (value < start) message = `This date is before the first day of instruction (${show(start)}).`;
      else if (id === "course.finalDate" && value < end) message = `The final exam is before the last day of instruction (${show(end)}).`;
      else if (latest && value > latest) message = `This date is after the ${latest === final ? "final exam" : "last day of instruction"} (${show(latest)}).`;
    }
    if (row) {
      // One note per row of a date list, for whichever of its dates is outside the term.
      if (input.classList.contains("syl-date-start") || message) dateWarning(row, message);
    } else dateWarning(input, message);
  }
}

// Only the days the class meets are offered for in-class exams (a chosen day stays visible).
function updateMeetingDays(): void {
  const days = (state.field["course.days"] ?? "").split(",").filter(Boolean);
  for (const card of questionsEl.querySelectorAll<HTMLElement>('#syl-q-examDay .syl-opt')) {
    const id = card.dataset.opt!;
    if (!WEEKDAYS.some(([d]) => d === id)) continue;
    card.hidden = days.length > 0 && !days.includes(id) && state.choice.examDay !== id;
  }
}

// The progress bar at the top of the window.
const progressBar = $<HTMLElement>("syl-progress-bar");
const progressFill = $<HTMLElement>("syl-progress-fill");
const progressHere = $<HTMLElement>("syl-progress-here");
let hereQueued = false;
// Moves the marker to the share of the questions above the middle of the window.
function updateHere(): void {
  hereQueued = false;
  const rect = questionsEl.getBoundingClientRect();
  const fraction = rect.height ? Math.min(1, Math.max(0, (innerHeight / 2 - rect.top) / rect.height)) : 0;
  progressHere.style.left = `${100 * fraction}%`;
}
addEventListener("scroll", () => { if (!hereQueued) { hereQueued = true; requestAnimationFrame(updateHere); } }, { passive: true });
addEventListener("resize", () => requestAnimationFrame(updateHere));

function updateRoleRows(): void {
  for (const q of SECTIONS.flatMap(sec => sec.questions).filter(x => x.kind === "perRole")) {
    const shown = new Set(roleRows(q).map(r => r.id));
    for (const row of questionsEl.querySelectorAll<HTMLElement>(`#syl-q-${q.id} tr[data-role]`)) row.hidden = !shown.has(row.dataset.role!);
  }
}

function updateSelections(): void {
  checkDates();
  updateRoleRows();
  updateMeetingDays();
  for (const card of questionsEl.querySelectorAll<HTMLElement>(".syl-q")) {
    const q = card.dataset.q!;
    const chosen = state.multi[q] ?? (state.choice[q] ? [state.choice[q]] : []);
    for (const opt of card.querySelectorAll<HTMLElement>(".syl-opt")) opt.classList.toggle("syl-chosen", chosen.includes(opt.dataset.opt!));
    for (const box of card.querySelectorAll<HTMLElement>(".syl-followup")) box.hidden = !chosen.includes(box.dataset.followup!);
    const question = QUESTION_BY_ID.get(q);
    card.classList.toggle("syl-answered", question?.kind === "perRole" ? answered(question) : chosen.length > 0);
    card.classList.toggle("syl-decision", !!question && DECISIONS.includes(question));
    card.classList.toggle("syl-na", !!question?.relevant && !question.relevant(state));
  }
  // Progress
  // Questions that don't apply, given the other answers, don't count.
  const applies = (q: Question) => !q.relevant || q.relevant(state);
  const open = DECISIONS.filter(applies);
  const made = open.filter(answered).length;
  progressEl.textContent = `${made} of ${open.length} decisions made`;
  progressFill.style.width = `${open.length ? (100 * made) / open.length : 0}%`;
  progressBar.setAttribute("aria-valuemax", String(open.length));
  progressBar.setAttribute("aria-valuenow", String(made));
  progressBar.title = progressEl.textContent;
  for (const link of navEl.querySelectorAll<HTMLAnchorElement>(".syl-nav-link")) {
    const section = SECTIONS.find(s => s.id === link.dataset.section)!;
    const decisions = section.questions.filter(q => DECISIONS.includes(q) && applies(q));
    const n = decisions.filter(answered).length;
    const complete = decisions.length > 0 && n === decisions.length;
    link.textContent = decisions.length ? `${complete ? "✓ " : ""}${section.title} ${n}/${decisions.length}` : section.title;
    link.classList.toggle("syl-complete", complete);
  }
  updateTotal();
  updateSizeMarks();
  updateTermNotes();
  setDateStyle(state.field[DATE_FIELD]);
  updateHolidayNotes();
  updateContextNotes();
  updateExamCount();
  // Summaries that show field values, such as an example subject line with the course number.
  for (const span of questionsEl.querySelectorAll<HTMLElement>("[data-template]")) {
    // The values may be Markdown links, which are shown as links.
    const text = span.dataset.template!.split(/\{\{(.+?)\}\}/).map((part, i) => {
      if (i % 2 === 0) return esc(part);
      const f = FIELD_BY_ID.get(part);
      return esc(state.field[part]?.trim() || f?.defaultValue || f?.placeholder || part);
    }).join("");
    span.innerHTML = inlineHtml(text, "preview");
  }
}

// The number of exams, from the exam schedule and the midterm dates (Exams section).
function examCount(): number {
  const sched = state.choice.examSchedule;
  const dates = (state.field["exam.dates"] ?? "").split(/[;\n]/).map(t => t.trim()).filter(Boolean).length;
  const midterms = dates || (sched === "twoMidterms" ? 2 : sched === "oneMidterm" ? 1 : 0);
  const final = sched === "twoMidterms" || sched === "oneMidterm" || (sched === "frequent" && !!(state.field["course.finalDate"] || state.field["course.final"])?.trim());
  return midterms + (final ? 1 : 0);
}

// Fills in "of the exams" for the pass requirement, until the instructor types their own number.
const AUTO_N = "gate.n.auto";
function updateExamCount(): void {
  const n = examCount();
  const current = state.field["gate.n"];
  if (!n || (current && state.field[AUTO_N] !== "1")) return;
  if (current === String(n)) return;
  state.field["gate.n"] = String(n);
  state.field[AUTO_N] = "1";
  for (const input of questionsEl.querySelectorAll<HTMLInputElement>('[data-field="gate.n"]')) input.value = String(n);
  saveJSON(STATE_KEY, state);
}

// Notes that depend on other answers, such as whether section quizzes are high stakes.
function updateContextNotes(): void {
  for (const note of questionsEl.querySelectorAll<HTMLElement>("[data-context]")) {
    const found = CONTEXT_NOTES[note.dataset.context!](state);
    note.hidden = !found;
    if (!found) continue;
    note.textContent = found.text;
    note.classList.toggle("syl-context-good", found.tone === "good");
    note.classList.toggle("syl-context-warn", found.tone === "warn");
  }
}

// ⋘──────── Holidays in the term ────────⋙
// The questions about which day of the week work is due and exams are held list the holidays that
// fall within the term, and each weekday option says which of them land on that day.

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function isoDate(value: string | undefined): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}

const longDate = (d: Date) => formatDateValue(d);
const shortDate = (d: Date) => formatDateValue(d);

// The holidays within the term, from the first and last days of instruction (or, if those aren't
// entered, approximate dates for the term and year), plus holidays and breaks in Important dates.
function termHolidays(): { list: Holiday[]; approximate: boolean } | null {
  let start = isoDate(state.field["course.start"]);
  let end = isoDate(state.field["course.end"]);
  let approximate = false;
  if (!start || !end) {
    const term = termOf(state.field["course.term"]);
    const year = /\b(20\d\d)\b/.exec(state.field["course.term"] ?? "")?.[1];
    if (!term || !year) return null;
    [start, end] = approximateTerm(term, Number(year));
    approximate = true;
  }
  const list = holidaysBetween(start, end);
  const same = (a: Date, b: Date) => a.getTime() === b.getTime();
  for (const line of (state.field["dates.list"] ?? "").split("\n")) {
    const [spec = "", ...rest] = line.split("|");
    const name = rest.join("|").trim();
    if (!/holiday|break|no class|recess|closed|observ/i.test(name)) continue;
    const [a, b] = spec.trim().split("..");
    const first = isoDate(a);
    if (!first) continue;
    const last = isoDate(b) ?? first;
    for (let d = new Date(first), n = 0; d <= last && n < 14; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1), n++) {
      if (d.getDay() === 0 || d.getDay() === 6 || d < start || d > end) continue;
      if (!list.some(h => same(h.date, d))) list.push({ name, date: new Date(d) });
    }
  }
  list.sort((x, y) => x.date.getTime() - y.date.getTime());
  return { list, approximate };
}

function updateHolidayNotes(): void {
  const found = termHolidays();
  for (const box of questionsEl.querySelectorAll<HTMLElement>(".syl-holidays")) {
    if (!found) {
      box.replaceChildren(el("p", { className: "syl-term", textContent: "Enter the term and the first and last days of instruction in Course basics to list the holidays in your term." }));
      continue;
    }
    const title = found.approximate
      ? "Holidays in this term (approximate: enter the first and last days of instruction in Course basics for an exact list)"
      : "Holidays in this term";
    box.replaceChildren(el("div", { className: "syl-term" },
      el("b", { textContent: `${title}:` }),
      found.list.length
        ? el("ul", {}, ...found.list.map(h => el("li", { textContent: `${longDate(h.date)}: ${h.name}${h.note ? ` (${h.note})` : ""}` })))
        : el("p", { textContent: "No common US holidays. Check your academic calendar for campus closures." }),
      el("p", { textContent: "Add campus holidays and breaks to Important dates in Course basics, and they are included here." }),
    ));
  }
  for (const note of questionsEl.querySelectorAll<HTMLElement>(".syl-holiday-opt")) {
    note.hidden = !found;
    if (!found) continue;
    const day = Number(note.dataset.weekday);
    const hits = found.list.filter(h => h.date.getDay() === day);
    note.textContent = hits.length
      ? `This term, ${hits.length === 1 ? "1 holiday falls" : `${hits.length} holidays fall`} on a ${WEEKDAY_NAMES[day]}: ${hits.map(h => `${h.name} (${shortDate(h.date)})`).join("; ")}.`
      : `No holidays fall on a ${WEEKDAY_NAMES[day]} this term.`;
    note.classList.toggle("syl-holiday-none", !hits.length);
    // The exact list replaces the general notes for the term on this option.
    const general = note.parentElement!.querySelector<HTMLElement>(".syl-term[data-term]");
    if (general) general.hidden = true;
  }
}

// Shows the holiday notes for the term entered in Course basics.
function updateTermNotes(): void {
  const term = termOf(state.field["course.term"]);
  for (const note of questionsEl.querySelectorAll<HTMLElement>("[data-term]")) {
    const text = term ? TERM_NOTES[note.dataset.term!][term] : undefined;
    const question = !note.dataset.term!.includes(".");
    if (question && !term) {
      note.hidden = false;
      note.textContent = "Enter the term (such as “Fall 2026”) in Course basics to see the holidays that affect this choice.";
      continue;
    }
    note.hidden = !text;
    if (text) note.textContent = `${TERM_LABELS[term!]}${question ? " holidays" : ""}: ${text}`;
  }
}

// Marks the options that suit or strain a class of the chosen size.
function updateSizeMarks(): void {
  const size = state.choice.enrollment as Size | undefined;
  for (const card of questionsEl.querySelectorAll<HTMLElement>(".syl-opt[data-fit]")) {
    const fit = SIZE_FITS[card.dataset.fit!];
    const good = !!size && !!fit.good?.includes(size);
    const poor = !!size && !!fit.poor?.includes(size);
    const note = size ? fit.note?.[size] : undefined;
    const tag = card.querySelector<HTMLElement>(".syl-size")!;
    card.classList.toggle("syl-fit-good", good);
    card.classList.toggle("syl-fit-poor", poor);
    tag.hidden = !(good || poor || note);
    if (size) tag.textContent = `${good ? "Good with" : poor ? "Hard with" : "With"} ${SIZE_LABELS[size]}${note ? `: ${note}` : "."}`;
  }
}

// ⋘──────── Preview ────────⋙

let blocks: Block[] = [];
let pendingFocus: string | null = null;
let renderQueued = false;

// The questions whose text in the student or teaching team syllabus still has placeholders (the
// highlighted text that needs filling in). "Hide completed questions" keeps them visible.
function markIncomplete(current: Block[]): void {
  const sources = new Set<string>();
  const visit = (b: Block, src?: string) => {
    const own = b.src ?? src;
    const texts = b.t === "kv" ? "" : "text" in b ? b.text : JSON.stringify(b);
    if (own && texts.includes("{{")) sources.add(own);
    if (b.t === "kv") for (const [label, value] of b.rows) {
      if (own && label.includes("{{")) sources.add(own);
      value.forEach(v => visit(v, own));
    }
  };
  for (const d of ["student", "team"] as Doc[]) (d === doc ? current : DOCS[d].generate(state)).forEach(b => visit(b));
  for (const card of questionsEl.querySelectorAll<HTMLElement>(".syl-q")) card.classList.toggle("syl-incomplete", sources.has(card.dataset.q!));
}

function render(): void {
  renderQueued = false;
  setDateStyle(state.field[DATE_FIELD]);
  blocks = DOCS[doc].generate(state);
  markIncomplete(blocks);
  dependents = null;
  clearSources();
  // Each block's elements are tagged with the block's index, for showing only some of them.
  previewEl.replaceChildren(...blocks.flatMap((b, i) => {
    const t = document.createElement("template");
    t.innerHTML = toHtml([b], "preview");
    const els = [...t.content.children] as HTMLElement[];
    els.forEach(e => (e.dataset.b = String(i)));
    return els;
  }));
  applyEditFocus();
  if (pendingFocus) {
    const targets = [...previewEl.querySelectorAll<HTMLElement>(`[data-src="${pendingFocus}"]`)];
    pendingFocus = null;
    if (targets.length) {
      // Scroll only the preview's own scroll area, never the page.
      if (previewWrap.scrollHeight > previewWrap.clientHeight + 1) {
        const wrapTop = previewWrap.getBoundingClientRect().top;
        const top = targets[0].getBoundingClientRect().top - wrapTop + previewWrap.scrollTop;
        const bottom = targets[targets.length - 1].getBoundingClientRect().bottom - wrapTop + previewWrap.scrollTop;
        const visible = top >= previewWrap.scrollTop && bottom <= previewWrap.scrollTop + previewWrap.clientHeight;
        if (!visible) previewWrap.scrollTo({ top: Math.max(0, top - 70), behavior: "smooth" });
      }
      cancelSync();
      targets.forEach(t => t.classList.add("syl-flash"));
    }
  }
  markLinked();
}

// Shows a document in the preview.
const docButtons = [...document.querySelectorAll<HTMLButtonElement>("[data-doc]")];
const DOC_NAMES: Record<Doc, string> = { student: "student syllabus", team: "teaching team syllabus", quiz: "syllabus quiz" };
function showDocButtons(d: Doc): void {
  for (const b of docButtons) b.setAttribute("aria-pressed", String(b.dataset.doc === d));
  document.getElementById("syl-export-label")!.textContent = `Export the ${DOC_NAMES[d]}:`;
}
function setDoc(d: Doc, now = false): void {
  showDocButtons(d);
  if (d === doc) return;
  doc = d;
  saveString(DOC_KEY, d);
  previewWrap.scrollTop = 0;
  if (now) render();
  else changed();
}
for (const b of docButtons) b.addEventListener("click", () => setDoc(b.dataset.doc as Doc));
const teamQuestions = new Set(SECTIONS.find(sec => sec.id === TEAM_SECTION)!.questions.map(q => q.id));

function changed(q?: string): void {
  if (q) pendingFocus = q;
  // Answering a teaching team question shows the teaching team syllabus; choosing a syllabus quiz
  // shows the quiz.
  const show: Doc | null = q && teamQuestions.has(q) ? "team" : q === "syllabusQuiz" && state.choice.syllabusQuiz === "quiz" ? "quiz" : null;
  if (show && doc !== show) { doc = show; saveString(DOC_KEY, doc); previewWrap.scrollTop = 0; showDocButtons(doc); }
  saveJSON(STATE_KEY, state);
  updateSelections();
  if (!renderQueued) {
    renderQueued = true;
    requestAnimationFrame(render);
  }
}

// Clicking text in the preview shows the question it comes from.
previewEl.addEventListener("click", e => {
  const target = e.target as HTMLElement;
  if (target.closest("a")) return;
  // Selecting text (to copy it) doesn't jump to the question.
  if (!(getSelection()?.isCollapsed ?? true)) return;
  const src = target.closest<HTMLElement>("[data-src]")?.dataset.src;
  const card = src && document.getElementById(`syl-q-${src}`);
  if (!card) return;
  // Don't let the questions' scrolling move the preview away from the clicked text.
  syncPausedUntil = performance.now() + 1000;
  cancelSync();
  setActive(src);
  layout.classList.remove("syl-show-preview");
  updateViewButtons();
  scrollToCard(card);
  card.classList.remove("syl-flash");
  void card.offsetWidth;
  card.classList.add("syl-flash");
});

// ⋘──────── Questions behind a block of text ────────⋙
// Clicking text in the preview also lists every question whose answer changes that text, found
// by writing the document again with each other answer to each question (as for the focus view).
// The work is split across frames, so the page stays responsive.

const sourcesEl = $<HTMLElement>("syl-sources");
let sourcesRun = 0;

function clearSources(): void {
  sourcesRun++;
  sourcesEl.hidden = true;
  for (const c of questionsEl.querySelectorAll(".syl-source")) c.classList.remove("syl-source");
  for (const b of previewEl.querySelectorAll(".syl-source-block")) b.classList.remove("syl-source-block");
}

function showSources(index: number, blockEls: HTMLElement[]): void {
  clearSources();
  const run = sourcesRun;
  blockEls.forEach(b => b.classList.add("syl-source-block"));
  const target = JSON.stringify(blocks[index]);
  const list = el("span", { className: "syl-source-list", textContent: "Finding the questions…" });
  const close = el("button", { type: "button", className: "syl-remove", textContent: "×", ariaLabel: "Close" });
  close.addEventListener("click", clearSources);
  sourcesEl.replaceChildren(el("b", { textContent: "This text depends on: " }), list, close);
  sourcesEl.hidden = false;
  const questions = SECTIONS.flatMap(sec => sec.questions);
  const found: Question[] = [];
  let i = 0;
  const step = () => {
    if (run !== sourcesRun) return;
    const end = performance.now() + 12;
    while (i < questions.length && performance.now() < end) {
      const q = questions[i++];
      const changes = q.id === blocks[index].src || variants(q.id).some(v => !DOCS[doc].generate(v).some(b => JSON.stringify(b) === target));
      if (changes) found.push(q);
    }
    if (i < questions.length) { requestAnimationFrame(step); return; }
    list.replaceChildren(...found.flatMap((q, n) => {
      const link = el("a", { href: `#syl-q-${q.id}`, textContent: `${numberOf(q)} ${q.title}` });
      link.addEventListener("click", e => {
        e.preventDefault();
        const card = document.getElementById(`syl-q-${q.id}`)!;
        scrollToCard(card);
        card.classList.remove("syl-flash");
        void card.offsetWidth;
        card.classList.add("syl-flash");
      });
      return n ? [document.createTextNode(" · "), link] : [link];
    }));
    if (!found.length) list.textContent = "no question (this text is always included).";
    for (const q of found) document.getElementById(`syl-q-${q.id}`)?.classList.add("syl-source");
  };
  requestAnimationFrame(step);
}

const numberOf = (q: Question) => document.querySelector(`#syl-q-${q.id} .syl-q-num`)?.textContent ?? "";

previewEl.addEventListener("click", e => {
  const target = e.target as HTMLElement;
  if (target.closest("a") || !(getSelection()?.isCollapsed ?? true)) return;
  const blockEl = target.closest<HTMLElement>("#syl-preview > [data-b]");
  if (!blockEl) return;
  const index = Number(blockEl.dataset.b);
  showSources(index, [...previewEl.querySelectorAll<HTMLElement>(`:scope > [data-b="${index}"]`)]);
});

// Scrolls a question card to the middle of the window: smoothly when it is near, and at once when
// it is far, since a long smooth scroll makes the browser paint the whole page on the way (which
// can flash white).
function scrollToCard(card: HTMLElement): void {
  const far = Math.abs(card.getBoundingClientRect().top - innerHeight / 2) > 1.5 * innerHeight;
  card.scrollIntoView({ behavior: far ? "auto" : "smooth", block: "center" });
}

// ⋘──────── Scrolling together ────────⋙
// As the questions scroll, the preview scrolls to the text written from the question at the
// reading line (a little above the middle of the screen), and both are highlighted. Within a
// question, the preview moves in proportion, so the two panes move together.

let activeQ: string | null = null;
let syncTarget = 0;
let syncFrame = 0;
let syncQueued = false;
let syncPausedUntil = 0;
let wasInTeam: boolean | null = null;
const cards = [...questionsEl.querySelectorAll<HTMLElement>(".syl-q")];

function cancelSync(): void {
  cancelAnimationFrame(syncFrame);
  syncFrame = 0;
}

// The outermost preview elements written from question q, in order.
function previewTargets(q: string): HTMLElement[] {
  const all = [...previewEl.querySelectorAll<HTMLElement>(`[data-src="${CSS.escape(q)}"]`)];
  return all.filter(t => t.getClientRects().length > 0 && !all.some(other => other !== t && other.contains(t)));
}

function markLinked(): void {
  for (const t of previewEl.querySelectorAll(".syl-linked")) t.classList.remove("syl-linked");
  if (activeQ) previewTargets(activeQ).forEach(t => t.classList.add("syl-linked"));
}

function setActive(q: string | null): void {
  if (q === activeQ) return;
  activeQ = q;
  for (const card of cards) card.classList.toggle("syl-current", card.dataset.q === q);
  markLinked();
}

function bothVisible(): boolean {
  return questionsEl.getClientRects().length > 0 && previewWrap.getClientRects().length > 0
    && previewWrap.scrollHeight > previewWrap.clientHeight + 1;
}

function syncFromQuestions(): void {
  syncQueued = false;
  if (!syncToggle.checked || !bothVisible() || performance.now() < syncPausedUntil) return;
  const top = parseFloat(layout.style.getPropertyValue("--syl-top")) || 0;
  const readingY = top + 0.3 * (innerHeight - top);
  let card = cards[0];
  for (const c of cards) {
    if (c.getBoundingClientRect().top <= readingY) card = c;
    else break;
  }
  setActive(card.dataset.q!);
  // Entering or leaving the teaching team section switches the document shown.
  const inTeam = teamQuestions.has(card.dataset.q!);
  if (inTeam !== wasInTeam) {
    if (wasInTeam !== null) setDoc(inTeam ? "team" : "student", true);
    wasInTeam = inTeam;
  }
  const targets = previewTargets(card.dataset.q!);
  if (!targets.length) return;      // Nothing written from this question: leave the preview where it is.

  // The first run of adjacent targets.
  const wrapRect = previewWrap.getBoundingClientRect();
  const toContent = (y: number) => y - wrapRect.top + previewWrap.scrollTop;
  const first = targets[0].getBoundingClientRect();
  let bottom = first.bottom;
  for (const t of targets.slice(1)) {
    const r = t.getBoundingClientRect();
    if (r.top - bottom > 40) break;
    bottom = Math.max(bottom, r.bottom);
  }
  const rect = card.getBoundingClientRect();
  const fraction = Math.min(1, Math.max(0, (readingY - rect.top) / rect.height));
  const point = toContent(first.top) + fraction * (bottom - first.top);
  const max = previewWrap.scrollHeight - previewWrap.clientHeight;
  syncTarget = Math.min(max, Math.max(0, point - (readingY - wrapRect.top)));
  if (!syncFrame) syncFrame = requestAnimationFrame(stepSync);
}

// Eases the preview toward the target, so that jumps between questions are smooth.
function stepSync(): void {
  const current = previewWrap.scrollTop;
  const d = syncTarget - current;
  // Jumps longer than the pane are made at once: easing through them makes the browser paint
  // every page of text in between, which shows as flicker (or a blank pane) while it catches up.
  if (Math.abs(d) < 2 || Math.abs(d) > previewWrap.clientHeight) {
    previewWrap.scrollTop = syncTarget;
    syncFrame = 0;
    return;
  }
  previewWrap.scrollTop = current + Math.sign(d) * Math.max(1, Math.abs(d) * 0.25);
  if (previewWrap.scrollTop === current) { syncFrame = 0; return; }
  syncFrame = requestAnimationFrame(stepSync);
}

function queueSync(): void {
  if (syncQueued) return;
  syncQueued = true;
  requestAnimationFrame(syncFromQuestions);
}
addEventListener("scroll", queueSync, { passive: true });
// The "Scroll panes together" setting (above the preview); turning it off also clears the highlights.
const syncToggle = $<HTMLInputElement>("syl-sync");
syncToggle.checked = loadString(SYNC_KEY) !== "0";
syncToggle.addEventListener("change", () => {
  saveString(SYNC_KEY, syncToggle.checked ? "1" : "0");
  if (syncToggle.checked) queueSync();
  else { cancelSync(); setActive(null); }
});
addEventListener("resize", queueSync);
// Scrolling the preview by hand takes over from the questions until they scroll again.
for (const type of ["wheel", "touchstart", "pointerdown"]) previewWrap.addEventListener(type, cancelSync, { passive: true });
questionsEl.addEventListener("focusin", e => {
  const q = (e.target as HTMLElement).closest<HTMLElement>(".syl-q")?.dataset.q;
  if (q) setActive(q);
  const field = (e.target as HTMLElement).dataset.field;
  const key = q ? `${q}|${field ?? ""}` : null;
  if (key !== editing?.key) {
    editing = q ? { key: key!, q, field } : null;
    dependents = null;
    applyEditFocus();
  }
});
// The focus view ends when the focus moves outside the questions and the preview (with Tab, or by
// clicking elsewhere on the page). Clicking or selecting text in the preview keeps it, so that the
// text can be copied.
function endEditFocus(): void {
  if (!editing) return;
  editing = null;
  applyEditFocus();
}
const keepsFocusView = (node: Node | null) => !!node && (questionsEl.contains(node) || previewWrap.contains(node));
questionsEl.addEventListener("focusout", () => {
  // Wait for the focus to land. Clicking text that can't take the focus leaves it on the body;
  // the pointerdown handler below decides those.
  setTimeout(() => {
    const active = document.activeElement;
    if (active && active !== document.body && !keepsFocusView(active)) endEditFocus();
  });
});
document.addEventListener("pointerdown", e => {
  if (!keepsFocusView(e.target as Node)) endEditFocus();
});

// ⋘──────── Showing only what the current question affects ────────⋙
// While a question is being edited, the preview shows only the blocks that depend on it,
// directly or through other answers. A block depends on the question if it changes when the
// question's answer changes: the document is written again with each other answer to the
// question (or, for a field, with the field empty and with other text), and every block that
// doesn't appear unchanged in all of them depends on it. Each shown block keeps its heading.

let editing: { key: string; q: string; field?: string } | null = null;
let dependents: Set<number> | null = null;   // Indices of the blocks, for the current answers

function variants(q: string, field?: string): State[] {
  const out: State[] = [];
  const copy = (): State => structuredClone(state);
  const fieldVariants = (id: string) => {
    for (const value of ["", "Zz9 other text"]) {
      if ((state.field[id] ?? "") === value) continue;
      const v = copy();
      if (value) v.field[id] = value; else delete v.field[id];
      out.push(v);
    }
  };
  if (field) { fieldVariants(field); return out; }
  const question = QUESTION_BY_ID.get(q);
  if (question?.kind === "perRole") {
    for (const r of question.roles ?? []) for (const o of question.options ?? []) {
      const key = `${q}.${r.id}`;
      if (state.choice[key] === o.id) continue;
      const v = copy();
      v.choice[key] = o.id;
      out.push(v);
    }
    return out;
  }
  for (const o of question?.options ?? []) {
    const v = copy();
    if (question!.kind === "multi") {
      const list = v.multi[q] ?? [];
      v.multi[q] = list.includes(o.id) ? list.filter(x => x !== o.id) : [...list, o.id];
    } else if (v.choice[q] !== o.id) v.choice[q] = o.id;
    else delete v.choice[q];
    out.push(v);
  }
  // Fields in the question's card, including date lists.
  const card = document.getElementById(`syl-q-${q}`);
  const ids = new Set([...card?.querySelectorAll<HTMLElement>("[data-field]") ?? []].map(x => x.dataset.field!));
  for (const w of widgets) if (card?.contains(w.el)) ids.add(w.id);
  ids.forEach(fieldVariants);
  return out;
}

function findDependents(q: string, field?: string): Set<number> {
  const base = blocks.map(b => JSON.stringify(b));
  const found = new Set<number>();
  for (const v of variants(q, field)) {
    const counts = new Map<string, number>();
    for (const b of DOCS[doc].generate(v)) {
      const k = JSON.stringify(b);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    base.forEach((k, i) => {
      const n = counts.get(k) ?? 0;
      if (n > 0) counts.set(k, n - 1);
      else found.add(i);
    });
  }
  // Blocks written from the question, even if no variant changed them.
  if (!field) blocks.forEach((b, i) => { if (b.src === q) found.add(i); });
  return found;
}

// The other documents that change when the question's answer changes.
function otherDocsChanged(q: string, field?: string): Doc[] {
  const vs = variants(q, field);
  return (Object.keys(DOCS) as Doc[]).filter(d => {
    if (d === doc) return false;
    const base = JSON.stringify(DOCS[d].generate(state));
    return vs.some(v => JSON.stringify(DOCS[d].generate(v)) !== base);
  });
}

function applyEditFocus(): void {
  const children = [...previewEl.children] as HTMLElement[];
  const on = focusToggle.checked && editing;
  if (on && !dependents) dependents = findDependents(editing!.q, editing!.field);
  const show = new Set(on ? dependents! : []);
  // Keep the headings above each shown block (the nearest of each level).
  for (const i of [...show]) {
    const own = /^h([1-4])$/.exec(blocks[i].t);
    let level = own ? Number(own[1]) : 5;
    for (let j = i - 1; j >= 0 && level > 1; j--) {
      const m = /^h([1-4])$/.exec(blocks[j].t);
      if (m && Number(m[1]) < level) { show.add(j); level = Number(m[1]); }
    }
  }
  const filtering = !!on && dependents!.size > 0;
  previewEl.classList.toggle("syl-edit-focus", filtering);
  children.forEach(c => c.classList.toggle("syl-dep", show.has(Number(c.dataset.b))));
  // Nothing in this document depends on the question: say which documents it does change.
  const elsewhere = on && !filtering ? otherDocsChanged(editing!.q, editing!.field) : [];
  focusNote.hidden = !filtering;
  // Nothing in this document depends on the question: hide the document and say which documents
  // it changes, with buttons to show them.
  const away = elsewhere.length > 0;
  previewEl.classList.toggle("syl-edit-away", away);
  elsewhereEl.hidden = !away;
  if (away) {
    elsewhereEl.replaceChildren(
      el("p", { textContent: `This question doesn't change the ${DOC_NAMES[doc]}. It changes the ${elsewhere.map(d => DOC_NAMES[d]).join(" and the ")}.` }),
      ...elsewhere.map(d => {
        const button = el("button", { type: "button", textContent: `Show the ${DOC_NAMES[d]}` });
        // Keep the focus in the question, so the focus view stays on.
        button.addEventListener("mousedown", e => e.preventDefault());
        button.addEventListener("click", () => setDoc(d, true));
        return button;
      }));
  }
  if (filtering) revealDependents();
}

// Scrolls the preview to the first shown block that isn't a heading, unless one is in view.
function revealDependents(): void {
  const shown = [...previewEl.querySelectorAll<HTMLElement>(":scope > .syl-dep")].filter(e => !/^H[1-4]$/.test(e.tagName));
  if (!shown.length || previewWrap.scrollHeight <= previewWrap.clientHeight + 1) return;
  const wrap = previewWrap.getBoundingClientRect();
  const inView = shown.some(e => { const r = e.getBoundingClientRect(); return r.bottom > wrap.top + 40 && r.top < wrap.bottom - 40; });
  if (inView) return;
  cancelSync();
  syncPausedUntil = performance.now() + 600;
  previewWrap.scrollTop += shown[0].getBoundingClientRect().top - wrap.top - 70;
}

// "Only remaining questions": hides answered questions, questions that don't apply, and the
// cards that aren't decisions (such as the course facts). The question being edited stays, so it
// doesn't vanish when it is answered; it hides once the focus moves to another question.
const remainingToggle = $<HTMLInputElement>("syl-remaining");
let keptCard: HTMLElement | null = null;
function keepCard(card: HTMLElement | null): void {
  if (card === keptCard) return;
  keptCard?.classList.remove("syl-keep");
  keptCard = card;
  keptCard?.classList.add("syl-keep");
}
remainingToggle.checked = loadString(REMAINING_KEY) === "1";
const applyRemaining = () => questionsEl.classList.toggle("syl-only-remaining", remainingToggle.checked);
remainingToggle.addEventListener("change", () => { saveString(REMAINING_KEY, remainingToggle.checked ? "1" : "0"); keepCard(null); applyRemaining(); queueSync(); });
questionsEl.addEventListener("focusin", e => keepCard((e.target as HTMLElement).closest<HTMLElement>(".syl-q")));
questionsEl.addEventListener("pointerdown", e => keepCard((e.target as HTMLElement).closest<HTMLElement>(".syl-q")));
applyRemaining();

const focusToggle = $<HTMLInputElement>("syl-focus");
const focusNote = $<HTMLElement>("syl-focus-note");
const elsewhereEl = $<HTMLElement>("syl-elsewhere");
focusToggle.checked = loadString(FOCUS_KEY) !== "0";
focusToggle.addEventListener("change", () => { saveString(FOCUS_KEY, focusToggle.checked ? "1" : "0"); applyEditFocus(); });

// ⋘──────── Checking entries ────────⋙
// Number boxes accept only digits (and a decimal point where decimals make sense), and every box
// whose entry doesn't fit shows an error under it.

// ⋘──────── Checking links ────────⋙
// Checks the form of web addresses, not whether the pages exist (the page can't load other sites).

// A web address that a link can use: http(s) with a host name that has a dot, "www." (which gets
// "https://"), or mailto: with an email address.
function validUrl(url: string): boolean {
  if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(url)) return true;
  const full = /^www\./i.test(url) ? `https://${url}` : url;
  if (!/^https?:\/\//i.test(full)) return false;
  try {
    const host = new URL(full).hostname;
    return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(host) && !/\s/.test(full);
  } catch {
    return false;
  }
}

function linkError(value: string, urlOnly: boolean): string {
  if (!value) return "";
  if (urlOnly) {
    if (/^https?:\/\/…?$/.test(value)) return "";
    return validUrl(value) ? "" : "Enter a full web address, such as https://example.edu/page.";
  }
  if (/\]\s+\(/.test(value)) return "To make a link, write the text and the address with no space between them: [text](https://…).";
  for (const m of value.matchAll(/\[([^\]]*)\]\(([^)\s]*)(\)?)/g)) {
    if (!m[3]) return "This link is missing its closing parenthesis: [text](https://…).";
    if (!m[1].trim()) return "This link has no text between the brackets: [text](https://…).";
    if (!validUrl(m[2])) return `“${m[2] || "(empty)"}” isn't a full web address. Links need one, such as https://example.edu/page.`;
  }
  for (const m of value.matchAll(/(^|\s)(https?:\/\/\S*)/g)) if (!validUrl(m[2].replace(/[.,;:!?)]+$/, ""))) return `“${m[2]}” isn't a full web address.`;
  return "";
}

function entryError(input: HTMLInputElement | HTMLTextAreaElement): string {
  const value = input.value.trim();
  if (input instanceof HTMLTextAreaElement || input.type === "text") {
    const link = linkError(value, !!input.dataset.url);
    if (link) return link;
  }
  if (input instanceof HTMLTextAreaElement) return "";
  if (input.type === "number") {
    if (input.validity.badInput) return "Enter a number.";
    if (!value) return "";
    if (input.step !== "any" && !/^\d+$/.test(value)) return "Enter a whole number.";
    if (input.validity.rangeUnderflow || input.validity.rangeOverflow) return input.max ? `Enter a number from ${input.min || 0} to ${input.max}.` : `Enter a number of at least ${input.min || 0}.`;
    return "";
  }
  if (input.dataset.pattern && value && !new RegExp(`^(?:${input.dataset.pattern})$`).test(value)) return `Enter ${input.dataset.hint}.`;
  return "";
}

function checkEntry(input: HTMLInputElement | HTMLTextAreaElement): void {
  const message = entryError(input);
  input.classList.toggle("syl-invalid", !!message);
  input.setAttribute("aria-invalid", String(!!message));
  // The message goes under the field, or under the row of a weights or grade table.
  const host = input.closest<HTMLElement>(".syl-weight-row, .syl-scale-row, .syl-link-box") ?? input;
  let note = host.nextElementSibling as HTMLElement | null;
  if (!note?.classList.contains("syl-error")) note = null;
  if (!message) { note?.remove(); return; }
  if (!note) {
    note = el("span", { className: "syl-error", role: "alert" });
    host.after(note);
  }
  note.textContent = message;
}

function checkAllEntries(): void {
  for (const input of questionsEl.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[type="number"], input[type="text"], textarea')) checkEntry(input);
}

questionsEl.addEventListener("keydown", e => {
  const input = e.target as HTMLInputElement;
  if (input.type !== "number" || e.ctrlKey || e.metaKey || e.key.length !== 1) return;
  // Letters (including "e" for exponents) and signs are never valid here.
  const decimals = input.step === "any";
  if (!/[0-9]/.test(e.key) && !(decimals && e.key === ".")) e.preventDefault();
});
questionsEl.addEventListener("input", e => {
  const input = e.target as HTMLInputElement;
  if (input instanceof HTMLTextAreaElement || (input instanceof HTMLInputElement && (input.type === "number" || input.type === "text"))) checkEntry(input);
});

// ⋘──────── Answering ────────⋙

questionsEl.addEventListener("change", e => {
  const input = e.target as HTMLInputElement;
  const q = input.dataset.q;
  if (q && input.type === "radio" && q.includes(".")) {
    // A role's choice in a "perRole" question.
    state.choice[q] = input.value;
    changed(input.closest<HTMLElement>(".syl-q")?.dataset.q);
  } else if (q && input.type === "radio") {
    state.choice[q] = input.value;
    if (q === "quizzes") renderWeights();
    if (q === "scale") {
      state.scale = structuredClone(SCALE_PRESETS[input.value] ?? []);
      renderScale();
    }
    changed(q);
  } else if (q && input.type === "checkbox") {
    const option = SECTIONS.flatMap(s => s.questions).find(x => x.id === q)!.options!.find(o => o.id === input.value);
    let list = state.multi[q] ?? [];
    if (input.checked) {
      // An exclusive option ("None") clears the others, and the others clear it.
      const exclusive = new Set(SECTIONS.flatMap(s => s.questions).find(x => x.id === q)!.options!.filter(o => o.exclusive).map(o => o.id));
      list = option?.exclusive ? [input.value] : [...list.filter(id => !exclusive.has(id)), input.value];
    } else {
      list = list.filter(id => id !== input.value);
    }
    state.multi[q] = list;
    if (!list.length) delete state.multi[q];
    for (const box of questionsEl.querySelectorAll<HTMLInputElement>(`input[data-q="${q}"]`)) box.checked = list.includes(box.value);
    changed(q);
  } else if (input.dataset.field && input.type === "checkbox") {
    setField(input, input.checked ? "1" : "");
    if (input.dataset.field === "scale.describe") renderScale();
  }
});

function setField(input: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  setFieldValue(input.dataset.field!, value, input);
}

// Sets a field from one of its inputs (source), and updates its other inputs.
function setFieldValue(id: string, value: string, source: Element): void {
  if (id === "gate.n") delete state.field[AUTO_N];   // The instructor's own number
  if (value) state.field[id] = value;
  else delete state.field[id];
  // The same field can appear under more than one option.
  for (const other of questionsEl.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(`[data-field="${CSS.escape(id)}"]`)) {
    if (other === source) continue;
    if (other instanceof HTMLInputElement && other.type === "checkbox") other.checked = value === "1";
    else other.value = value;
  }
  for (const w of widgets) if (w.id === id && !w.el.contains(source)) w.render();
  changed(source.closest<HTMLElement>(".syl-q")?.dataset.q);
}

questionsEl.addEventListener("input", e => {
  const input = e.target as HTMLInputElement | HTMLTextAreaElement;
  if (input.dataset.field && !(input instanceof HTMLInputElement && input.type === "checkbox")) setField(input, input.value);
});

questionsEl.addEventListener("click", e => {
  const q = (e.target as HTMLElement).closest<HTMLElement>("[data-clear]")?.dataset.clear;
  if (!q) return;
  delete state.choice[q];
  delete state.multi[q];
  for (const key of Object.keys(state.choice)) if (key.startsWith(`${q}.`)) delete state.choice[key];
  for (const input of questionsEl.querySelectorAll<HTMLInputElement>(`input[data-q="${q}"], input[data-q^="${q}."]`)) input.checked = false;
  if (q === "quizzes") renderWeights();
  changed(q);
});

// ⋘──────── Toolbar ────────⋙

for (const [id, preset] of Object.entries(PRESETS)) {
  let group = [...exampleSelect.querySelectorAll("optgroup")].find(g => g.label === preset.group);
  if (!group) exampleSelect.append(group = el("optgroup", { label: preset.group }));
  group.append(el("option", { value: id, textContent: preset.label }));
}
exampleSelect.addEventListener("change", () => {
  const preset = PRESETS[exampleSelect.value];
  exampleSelect.value = "";
  if (!preset) return;
  state = structuredClone(preset.state);
  fillInputs();
  changed();
  previewWrap.scrollTo({ top: 0 });
});

let resetTimer = 0;
resetButton.addEventListener("click", () => {
  if (!resetButton.classList.contains("syl-confirm")) {
    resetButton.classList.add("syl-confirm");
    resetButton.textContent = "Click again to clear all answers";
    resetTimer = window.setTimeout(() => { resetButton.classList.remove("syl-confirm"); resetButton.textContent = "Start over"; }, 4000);
    return;
  }
  clearTimeout(resetTimer);
  resetButton.classList.remove("syl-confirm");
  resetButton.textContent = "Start over";
  state = emptyState();
  removeSaved(STATE_KEY);
  fillInputs();
  changed();
});

// ⋘──────── View settings ────────⋙



// How dates are written in the documents. It is part of the answers, so it is saved with them.
const dateSelect = $<HTMLSelectElement>("syl-date-format");
// It is asked with the important dates, first.
document.querySelector("#syl-q-dates .syl-fields")?.prepend($("syl-date-format-field"));
const sample = new Date(2026, 9, 21);
for (const [id, label] of DATE_STYLES) dateSelect.append(el("option", { value: id, textContent: `${label}: ${formatDateValue(sample, false, id)}` }));
dateSelect.addEventListener("change", () => {
  if (dateSelect.value === "long") delete state.field[DATE_FIELD];
  else state.field[DATE_FIELD] = dateSelect.value;
  changed("dates");
  updateSelections();
});

prosToggle.checked = loadString(PROS_KEY) !== "0";
const applyPros = () => questionsEl.classList.toggle("syl-hide-pros", !prosToggle.checked);
prosToggle.addEventListener("change", () => { saveString(PROS_KEY, prosToggle.checked ? "1" : "0"); applyPros(); });
applyPros();

// On narrow screens, the questions and the preview take turns.
const viewButtons = [...document.querySelectorAll<HTMLButtonElement>("[data-view]")];
function updateViewButtons(): void {
  const preview = layout.classList.contains("syl-show-preview");
  for (const b of viewButtons) b.setAttribute("aria-pressed", String((b.dataset.view === "preview") === preview));
}
for (const b of viewButtons) {
  b.addEventListener("click", () => {
    layout.classList.toggle("syl-show-preview", b.dataset.view === "preview");
    updateViewButtons();
    layout.scrollIntoView({ block: "start" });
  });
}
updateViewButtons();

// ⋘──────── Exports ────────⋙

function fileName(ext: string): string {
  const code = (state.field["course.code"] ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${code ? `${code}-` : ""}${DOCS[doc].file}.${ext}`;
}

function download(text: string, type: string, name: string): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = el("a", { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function standaloneHtml(): string {
  const title = (blocks.find(b => b.t === "h1") as { text: string } | undefined)?.text.replace(/\{\{(.+?)\}\}/g, "[$1]").replace(/\\(.)/g, "$1") ?? "Syllabus";
  const escTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escTitle}</title>
<style>
  body { max-width: 52rem; margin: 2rem auto; padding: 0 1rem; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; line-height: 1.5; color: #222; }
  h1 { font-size: 1.7rem; } h2 { margin-top: 2rem; border-bottom: 1px solid #ddd; } h3 { margin-top: 1.5rem; }
  table { font-size: 0.95em; }
</style>
</head>
<body>
${toHtml(blocks, "lms")}
</body>
</html>
`;
}

$<HTMLButtonElement>("syl-download-html").addEventListener("click", () => download(standaloneHtml(), "text/html", fileName("html")));
$<HTMLButtonElement>("syl-download-md").addEventListener("click", () => download(toMarkdown(blocks), "text/markdown", fileName("md")));

function flashButton(button: HTMLButtonElement, ok: boolean, text: string): void {
  const original = button.dataset.label ?? button.textContent!;
  button.dataset.label = original;
  button.textContent = text;
  button.classList.toggle("syl-ok", ok);
  button.classList.toggle("syl-fail", !ok);
  setTimeout(() => { button.textContent = original; button.classList.remove("syl-ok", "syl-fail"); }, 1800);
}

copyButton.addEventListener("click", async () => {
  const html = toHtml(blocks, "lms");
  try {
    await navigator.clipboard.write([new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([toPlain(blocks)], { type: "text/plain" }),
    })]);
    flashButton(copyButton, true, "Copied");
  } catch {
    // Older browsers: copy a selection of rendered HTML.
    const holder = el("div", { className: "syl-copy-holder" });
    holder.innerHTML = html;
    document.body.append(holder);
    const range = document.createRange();
    range.selectNodeContents(holder);
    const selection = getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    const ok = document.execCommand("copy");
    selection.removeAllRanges();
    holder.remove();
    flashButton(copyButton, ok, ok ? "Copied" : "Copy failed");
  }
});

// ⋘──────── Saving and loading answers as JSON ────────⋙

const JSON_FORMAT = "syllabus-designer-answers";

$<HTMLButtonElement>("syl-export-json").addEventListener("click", () => {
  const file = { format: JSON_FORMAT, version: 1, saved: new Date().toISOString(), answers: state };
  const code = (state.field["course.code"] ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  download(JSON.stringify(file, null, 2), "application/json", `${code ? `${code}-` : ""}syllabus-answers.json`);
});

const importButton = $<HTMLButtonElement>("syl-import-json");
const importFile = $<HTMLInputElement>("syl-import-file");
importButton.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", async () => {
  const file = importFile.files?.[0];
  importFile.value = "";
  if (!file) return;
  let loaded: State | null = null;
  try {
    const data = JSON.parse(await file.text());
    // A file saved by this page, or a bare set of answers.
    loaded = validState(data?.format === JSON_FORMAT ? data.answers : data);
    if (loaded && !Object.keys(loaded.choice).length && !Object.keys(loaded.multi).length && !Object.keys(loaded.field).length) loaded = null;
  } catch {
    loaded = null;
  }
  if (!loaded) {
    flashButton(importButton, false, "Not a saved answers file");
    return;
  }
  state = loaded;
  fillInputs();
  changed();
  previewWrap.scrollTo({ top: 0 });
  flashButton(importButton, true, "Loaded");
});

// ⋘──────── Pinning ────────⋙

const panels = setupPanels("syl", () => {
  saveJSON(PINNED_KEY, panels.isPinned(panel));
  updateStickyTop();
});
// The preview sticks below the toolbar when the toolbar is pinned.
function updateStickyTop(): void {
  const top = panels.isPinned(panel) ? panel.offsetHeight : 0;
  layout.style.setProperty("--syl-top", `${top + 8}px`);
}
new ResizeObserver(updateStickyTop).observe(panel);
if (loadJSON<boolean>(PINNED_KEY)) panels.setPinned(panel, true);
updateStickyTop();

// ⋘──────── Start ────────⋙
requestAnimationFrame(updateHere);

setupHelp("syl");
showDocButtons(doc);
fillInputs();
render();
queueSync();
