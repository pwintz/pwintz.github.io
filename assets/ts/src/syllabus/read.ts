// ╭───────────────────────────────────────────────────────────────╮
// │      Syllabus designer: reading answers for a document        │
// ╰───────────────────────────────────────────────────────────────╯
// Helpers shared by the documents written from the answers (the teaching team syllabus and the
// syllabus quiz).

import { State } from "./generate";
import { Block, esc, textBlocks } from "./markup";
import { FIELD_BY_ID } from "./questions";

export const WEEKDAYS: [string, string][] = [["monday", "Monday"], ["tuesday", "Tuesday"], ["wednesday", "Wednesday"], ["thursday", "Thursday"], ["friday", "Friday"], ["saturday", "Saturday"], ["sunday", "Sunday"]];

export function reader(s: State) {
  const ch = (q: string) => s.choice[q];
  const has = (q: string, o: string) => (s.multi[q] ?? []).includes(o);
  const raw = (id: string) => (s.field[id] ?? "").trim();
  const val = (id: string) => raw(id) || FIELD_BY_ID.get(id)?.defaultValue || "";
  // A field's value as inline text, or a highlighted placeholder if it is empty.
  const v = (id: string, placeholder: string) => (val(id) ? esc(val(id)) : `{{${placeholder}}}`);
  const opt = (id: string) => esc(val(id));
  const checked = (id: string) => raw(id) === "1";
  // A percentage field, with "%" added to a bare number.
  const pct = (id: string) => (/^\d+(\.\d+)?$/.test(val(id)) ? `${val(id)}%` : esc(val(id)));
  const rows = (id: string) => val(id).split("\n").map(l => l.trim()).filter(Boolean).map(l => l.split("|").map(c => c.trim()));
  const p = (text: string, src?: string): Block => ({ t: "p", text, src });
  const custom = (q: string): Block[] => {
    const text = raw(`${q}.custom`);
    return text ? textBlocks(text, q) : [p("{{Write your own text for this section}}", q)];
  };
  const andList = (items: string[]) => (items.length <= 2 ? items.join(" and ") : `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`);
  const orList = (items: string[]) => (items.length <= 2 ? items.join(" or ") : `${items.slice(0, -1).join(", ")}, or ${items[items.length - 1]}`);
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : word.endsWith("quiz") ? "zes" : /(s|ch|sh|x)$/.test(word) ? "es" : "s"}`;
  // What students may use on exams, from the exam aids and calculator answers.
  const examAllowed = (): string[] => {
    const allowed = ["pencils and erasers"];
    if (ch("examAids") === "sheet") allowed.push(`handwritten notes (${opt("exam.sheet")})`);
    if (ch("examAids") === "open") allowed.push("the textbook and notes");
    const calc: Record<string, string> = { scientific: "a scientific calculator (not a graphing calculator)", graphing: "a scientific or graphing calculator", any: "any calculator (but not a phone or computer)" };
    if (calc[ch("calculators")]) allowed.push(calc[ch("calculators")]);
    return allowed;
  };
  // The class meeting days and times, such as "Mon, Wed, Fri 9:20–10:25 am".
  const meetings = () => {
    const days = WEEKDAYS.filter(([id]) => raw("course.days").split(",").includes(id)).map(([, name]) => name.slice(0, 3));
    const times = raw("course.meetings");
    if (!days.length) return v("course.meetings", "Meeting days and times");
    return `${days.join(", ")} ${times ? esc(times) : "{{Meeting times}}"}`;
  };
  return { meetings, ch, has, raw, val, v, opt, pct, checked, rows, p, custom, andList, orList, plural, examAllowed };
}
