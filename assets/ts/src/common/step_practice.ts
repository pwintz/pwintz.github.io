// ╭───────────────────────────────────────────────────────────────╮
// │           Practice problems worked in checked steps            │
// ╰───────────────────────────────────────────────────────────────╯
// A practice section for the linear algebra tools: random problems, each worked in steps. Each step
// has entry boxes (numbers, vectors, matrices, or a Yes/No pill) and Check, Hint, and Show buttons.
// A step whose answer depends on an earlier one stays hidden until that step is right or shown.
// The page counts the hints used: shown answers and wrong checks count too (checking the same wrong
// answer again doesn't count twice).
//
// The practice path and progress come from common/practice.ts. The problem is saved in the
// address (by the page's `encode`), and the student's entries, hints, and checks are saved in
// this browser for that problem. The styles are in _includes/step-practice-styles.html; the page
// supplies the elements, with ids that start with its prefix (see `byId` calls below).
//
// Support levels (shown as "Support"): at the first level the page works every step, as a worked
// example; at each later level it works fewer (each step's `given` is the last level at which the
// page works it); at the last level the student works every step.
//
// A page can show the problem somewhere else too (such as in a visualizer): `onLoad` tells it when
// this code loads a problem, `show` loads a problem the student designed there, and `onStatus` tells
// it whether the steps are finished (so it can keep the answers hidden until then).

import { setupPractice, Stage } from "./practice";
import { typeset as typesetMath } from "./mathjax";
import { replaceQuery } from "./query";
import { loadJSON, saveJSON } from "./storage";
import { Fraction, equals, parseEntry } from "../matrix/fraction";

// ⋘──────── Steps ────────⋙

export type Group =
  | { type: "scalar"; before?: string; after?: string; whenYes?: boolean }
  | { type: "vec"; n: number; before?: string; after?: string }
  | { type: "mat"; rows: number; cols: number; before?: string; after?: string }
  | { type: "yesno"; before?: string };

// marks: for each box, true (right), false (wrong), or null (not marked).
export interface Verdict { ok: boolean; message?: string; marks?: (boolean | null)[] }

export interface Step {
  title: string;
  intro?: string;
  groups: Group[];
  answer: string[];                       // One per box; "yes"/"no" for Yes/No
  check: (values: string[]) => Verdict;
  hints: string[];
  worked: string;                         // Shown once the step is right or shown
  prereqs: number[];                      // Steps that must be right or shown first
  shownNote?: string;                     // Added to "The answer is filled in", such as "(other multiples are right too)"
  given?: number;                         // The last support level at which the page works this step (default 1)
}

export const parseAll = (values: string[]) => values.map(v => parseEntry(v));

/** Each box must equal its expected value; each box is marked. */
export const exact = (expected: Fraction[], message?: string) => (values: string[]): Verdict => {
  const got = parseAll(values);
  const marks = got.map((x, i) => x !== null && equals(x, expected[i]));
  const ok = marks.every(Boolean);
  return { ok, marks, message: ok ? undefined : message };
};

/** "yes", "no", or "" from a Yes/No box. */
export const yesNo = (v: string) => (v === "yes" || v === "no" ? v : "");

// ⋘──────── Helpers ────────⋙

// Typesets math, then takes it out of the Tab order (MathJax makes each formula focusable), so that
// Tab moves between the entry boxes and buttons.
function typeset(els: Element[]): Promise<void> {
  return typesetMath(els).then(() => {
    for (const el of els) el.querySelectorAll<HTMLElement>("mjx-container[tabindex]").forEach(m => { m.tabIndex = -1; });
  });
}

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = "", html = ""): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html) e.innerHTML = html;
  return e;
}

// ⋘──────── The page ────────⋙

export interface StepPracticeOptions<P, K extends string> {
  prefix: string;                         // Element ids start with it, such as "pl-statement"
  key: string;                            // Prefix of the saved data, such as "projection_least_squares"
  stages: (Stage & { kind: K })[];
  kinds: readonly K[];                    // The values of the "Problem" menu (#<prefix>-kind)
  cleanToAdvanceStage?: number;
  helpText: string;                       // For the "?" beside "Difficulty"
  urlKeys: readonly string[];             // The address parameters that `encode` writes
  randomProblem: (kind: K) => P;
  encode: (p: P) => string;               // Address parameters, such as "pk=projv&pv=4,2&px=1,3"
  decode: (query: string) => P | null;
  statementHtml: (p: P) => string;
  buildSteps: (p: P) => Step[];
  // Support levels, from the most to the least: names (such as "Full") and what the student does.
  levels?: { names: string[]; descriptions: string[]; helpText?: string };
  // Whether the address names a problem, even one with no steps (by default, whether `decode` reads one).
  hasProblem?: (query: string) => boolean;
  noStepsHtml?: string;                   // Shown instead of the steps for a problem without them
  // This code loaded a problem (random, earlier, or from the address), in this mode.
  onLoad?: (p: P, mode: "path" | "custom") => void;
  onStatus?: (status: { finished: boolean; hasSteps: boolean; mode: "path" | "custom" }) => void;
}

export interface StepPractice<P> {
  current: () => P | null;
  mode: () => "path" | "custom";
  /** Loads a problem the student designed (null for one with no steps), unless it is the one shown. */
  show: (p: P | null) => void;
}

type Status = "" | "right" | "shown";
interface Work {
  problem: string;
  entries: string[][];
  status: Status[];
  hintLevel: number[];
  hintsUsed: number;
  wrongChecks: number;
  wrongSeen: string[][];
}

export function setupStepPractice<P, K extends string>(o: StepPracticeOptions<P, K>): StepPractice<P> {
  const byId = <T extends HTMLElement>(name: string) => document.getElementById(`${o.prefix}-${name}`) as T;
  const SETTINGS_KEY = `${o.key}_practice_settings`;
  const WORKS_KEY = `${o.key}_works`;
  const LAST_KEY = `${o.key}_last_problem`;

  const statement = byId<HTMLDivElement>("statement");
  const stepsBox = byId<HTMLDivElement>("steps");
  const hintCount = byId<HTMLSpanElement>("hint-count");
  const doneBox = byId<HTMLDivElement>("done");
  const doneText = byId<HTMLElement>("done-text");
  const doneSuggest = byId<HTMLParagraphElement>("done-suggest");
  const doneSuggestText = byId<HTMLSpanElement>("done-suggest-text");
  const doneNextLevel = byId<HTMLButtonElement>("done-next-level");
  const kindSelect = byId<HTMLSelectElement>("kind");
  let doneSuggestAction: () => void = () => undefined;

  const savedSettings = loadJSON<{ kind?: string; level?: number }>(SETTINGS_KEY) ?? {};
  if (savedSettings.kind && o.kinds.includes(savedSettings.kind as K)) kindSelect.value = savedSettings.kind;
  const saveSettings = () => saveJSON(SETTINGS_KEY, { kind: kindSelect.value, level });

  // ⋘──────── Support levels ────────⋙
  const levelCount = o.levels?.names.length ?? 1;
  let level = Number.isInteger(savedSettings.level) && savedSettings.level! >= 1 && savedSettings.level! <= levelCount
    ? savedSettings.level! : Math.min(2, levelCount);
  const levelRadios: HTMLInputElement[] = [];
  const box = byId<HTMLDivElement>("practice");
  if (o.levels) {
    const row = element("div", "pr-levels");
    const label = element("span", "pr-levels-label");
    const text = element("span", "", "Support");
    if (o.levels.helpText) text.dataset.help = o.levels.helpText;
    label.append(text);
    const list = element("span", "pr-level-list");
    list.setAttribute("role", "radiogroup");
    list.setAttribute("aria-label", "Support");
    o.levels.names.forEach((name, i) => {
      const item = element("label", "pr-level");
      const radio = element("input");
      radio.type = "radio";
      radio.name = `${o.prefix}-support`;
      radio.value = `${i + 1}`;
      radio.checked = i + 1 === level;
      radio.addEventListener("change", () => {
        level = i + 1;
        saveSettings();
        renderSteps();
        practice.levelChanged();
      });
      levelRadios.push(radio);
      item.append(radio, element("span", "pr-pill", name), element("span", "", o.levels!.descriptions[i]));
      list.append(item);
    });
    row.append(label, list);
    box.append(element("hr", "pr-divider"), row);
  }

  const practice = setupPractice({
    key: o.key,
    stages: o.stages,
    cleanToAdvanceStage: o.cleanToAdvanceStage ?? 2,
    levels: o.levels ? {
      count: levelCount,
      names: o.levels.names,
      cleanToAdvance: 2,
      current: () => level,
      set: (lv: number) => {
        level = lv;
        levelRadios.forEach(r => { r.checked = Number(r.value) === lv; });
        saveSettings();
      },
    } : undefined,
    box,
    customControls: [byId<HTMLDivElement>("custom-controls")],
    progress: byId<HTMLElement>("progress"),
    newProblem: () => newProblem(),
    helpText: o.helpText,
  });

  // ⋘──────── State ────────⋙
  let problem: P | null = null;
  let code = "";                          // The problem's encoding, or "" for none
  let steps: Step[] = [];
  let work!: Work;
  let inputs: HTMLInputElement[][] = [];
  let cards: HTMLElement[] = [];
  let feedbacks: HTMLDivElement[] = [];
  let hintBoxes: HTMLDivElement[] = [];
  let workedBoxes: HTMLDivElement[] = [];
  let checkButtons: HTMLButtonElement[] = [];
  let actionRows: HTMLDivElement[] = [];
  let yesNoBoxes: { box: HTMLElement; input: HTMLInputElement; radios: HTMLInputElement[] }[][] = [];
  let moreNote: HTMLParagraphElement;

  const saveWork = () => {
    const all = loadJSON<Record<string, Work>>(WORKS_KEY) ?? {};
    delete all[work.problem];
    all[work.problem] = work;
    const keys = Object.keys(all);
    for (const k of keys.slice(0, Math.max(0, keys.length - 40))) delete all[k];
    saveJSON(WORKS_KEY, all);
  };

  // A step the page works at this level: filled in, with its worked solution.
  const given = (s: number) => level <= (steps[s].given ?? 1);
  const isDone = (s: number) => given(s) || work.status[s] !== "";
  const unlocked = (s: number) => steps[s].prereqs.every(isDone);

  // ⋘──────── Building the steps ────────⋙
  function entryInput(label: string, s: number): HTMLInputElement {
    const input = element("input", "sp-entry");
    input.type = "text";
    input.inputMode = "decimal";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("aria-label", label);
    input.addEventListener("input", () => {
      input.classList.remove("sp-wrong", "sp-right");
      work.entries[s] = inputs[s].map(i => i.value);
      saveWork();
      updateButtons(s);
    });
    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && !checkButtons[s].disabled) check(s);
    });
    return input;
  }

  function buildGroup(g: Group, s: number, gi: number): HTMLElement {
    const wrap = element("span", "sp-entry-group");
    if (g.before) wrap.append(element("span", "sp-entry-label", g.before));
    const plain = (html: string) => html.replace(/<[^>]+>/g, "").replace(/\\\(|\\\)|\\vect\{(\w)\}|\\/g, (_m, v) => v ?? "");
    const label = plain(g.before ?? steps[s].title);
    if (g.type === "scalar") {
      const input = entryInput(label || "Answer", s);
      input.dataset.group = `${gi}`;
      inputs[s].push(input);
      wrap.append(input);
    } else if (g.type === "vec" || g.type === "mat") {
      const rows = g.type === "vec" ? g.n : g.rows, cols = g.type === "vec" ? 1 : g.cols;
      const bracket = element("span", "sp-bracket");
      bracket.style.gridTemplateColumns = `repeat(${cols}, auto)`;
      for (let k = 0; k < rows * cols; k++) {
        const name = g.type === "vec" ? `entry ${k + 1}` : `row ${Math.floor(k / cols) + 1}, column ${(k % cols) + 1}`;
        const input = entryInput(`${label}, ${name}`, s);
        input.dataset.group = `${gi}`;
        inputs[s].push(input);
        bracket.append(input);
      }
      wrap.append(bracket);
    } else {
      // Yes/No: a hidden input holds the answer, set by two radio buttons styled as a pill.
      const box = element("span", "sp-yes-no");
      box.setAttribute("role", "radiogroup");
      box.setAttribute("aria-label", plain(g.before ?? "Yes or no"));
      const input = element("input");
      input.type = "hidden";
      input.dataset.group = `${gi}`;
      inputs[s].push(input);
      const name = `${o.prefix}-yn-${s}-${gi}`;
      const radios = (["yes", "no"] as const).map(value => {
        const option = element("label", "sp-yn-option");
        const radio = element("input");
        radio.type = "radio";
        radio.name = name;
        radio.value = value;
        radio.addEventListener("change", () => {
          input.value = value;
          box.classList.remove("sp-wrong", "sp-right");
          work.entries[s] = inputs[s].map(i => i.value);
          saveWork();
          updateButtons(s);
        });
        option.append(radio, element("span", "", value === "yes" ? "Yes" : "No"));
        box.append(option);
        return radio;
      });
      yesNoBoxes[s].push({ box, input, radios });
      wrap.append(box, input);
    }
    if (g.type !== "yesno" && g.after) wrap.append(element("span", "sp-entry-label", g.after));
    return wrap;
  }

  const syncYesNo = (s: number) => {
    for (const { input, radios } of yesNoBoxes[s]) radios.forEach(r => { r.checked = r.value === input.value; });
  };

  function renderSteps(): void {
    stepsBox.innerHTML = "";
    inputs = steps.map(() => []);
    yesNoBoxes = steps.map(() => []);
    cards = []; feedbacks = []; hintBoxes = []; workedBoxes = []; checkButtons = []; actionRows = [];
    steps.forEach((step, s) => {
      const card = element("section", "sp-step");
      card.append(element("h4", "sp-step-title", `Step ${s + 1}. ${step.title}`));
      if (step.intro) card.append(element("div", "sp-step-intro", step.intro));
      const entries = element("div", "sp-entries");
      step.groups.forEach((g, gi) => entries.append(buildGroup(g, s, gi)));
      card.append(entries);
      const actions = element("div", "sp-step-actions");
      const checkButton = element("button", "sp-primary", "Check");
      checkButton.type = "button";
      checkButton.addEventListener("click", () => check(s));
      const hintButton = element("button", "", "Hint");
      hintButton.type = "button";
      hintButton.addEventListener("click", () => hint(s));
      const showButton = element("button", "", "Show");
      showButton.type = "button";
      showButton.title = "Fill in the answer (counts as a hint)";
      showButton.addEventListener("click", () => show(s));
      actions.append(checkButton, hintButton, showButton);
      card.append(actions);
      const hintBox = element("div", "sp-hint-box");
      hintBox.hidden = true;
      const feedback = element("div", "sp-feedback");
      feedback.setAttribute("role", "status");
      const worked = element("div", "sp-worked");
      card.append(hintBox, feedback, worked);
      stepsBox.append(card);
      cards.push(card); feedbacks.push(feedback); hintBoxes.push(hintBox); workedBoxes.push(worked);
      checkButtons.push(checkButton); actionRows.push(actions);
    });
    moreNote = element("p", "sp-more-steps", "More steps appear as you finish the steps above.");
    stepsBox.append(moreNote);
    if (!problem) stepsBox.innerHTML = o.noStepsHtml ?? "";
    // Restore saved entries and marks, and fill in the steps the page works.
    steps.forEach((step, s) => {
      if (given(s)) {
        inputs[s].forEach((input, i) => { input.value = step.answer[i] ?? ""; });
        syncYesNo(s);
        cards[s].classList.add("sp-step-given");
        actionRows[s].hidden = true;
        feedbacks[s].innerHTML = `<p class="sp-feedback-note">Worked by the page.</p>`;
        return;
      }
      inputs[s].forEach((input, i) => { input.value = work.entries[s]?.[i] ?? ""; });
      syncYesNo(s);
      if (work.status[s]) mark(s, work.status[s] === "right" ? "sp-right" : "sp-shown");
      if (work.hintLevel[s] > 0) renderHint(s);
    });
    update();
    void typeset([stepsBox]);  // Also when the steps are rebuilt for another support level
  }

  // ⋘──────── Marks, buttons, and visibility ────────⋙
  function clearMarks(s: number): void {
    inputs[s].forEach(i => i.classList.remove("sp-right", "sp-wrong", "sp-shown"));
    yesNoBoxes[s].forEach(y => y.box.classList.remove("sp-right", "sp-wrong", "sp-shown"));
  }

  /** Marks every box of a step, or each box by `marks`. */
  function mark(s: number, cls: string, marks?: (boolean | null)[]): void {
    clearMarks(s);
    const yn = new Map(yesNoBoxes[s].map(y => [y.input, y.box]));
    inputs[s].forEach((input, i) => {
      const m = marks ? marks[i] : true;
      if (m === null || m === undefined) return;
      const c = marks ? (m ? "sp-right" : "sp-wrong") : cls;
      (yn.get(input) ?? input).classList.add(c);
    });
  }

  /** The boxes that must be filled for Check: all, except a "whenYes" box after "No". */
  function required(s: number): HTMLInputElement[] {
    const yes = yesNoBoxes[s][0]?.input.value === "yes";
    return inputs[s].filter(input => {
      const g = steps[s].groups[Number(input.dataset.group)];
      return !(g.type === "scalar" && g.whenYes && !yes);
    });
  }

  function updateButtons(s: number): void {
    const done = isDone(s);
    const filled = required(s).every(i => i.value.trim() !== "");
    checkButtons[s].disabled = done || !filled;
    for (const b of actionRows[s].querySelectorAll("button")) if (b !== checkButtons[s]) (b as HTMLButtonElement).disabled = done;
    const yes = yesNoBoxes[s][0]?.input.value === "yes";
    inputs[s].forEach(input => {
      const g = steps[s].groups[Number(input.dataset.group)];
      input.disabled = done || (g.type === "scalar" && !!g.whenYes && !yes);
    });
    yesNoBoxes[s].forEach(y => y.radios.forEach(r => { r.disabled = done; }));
  }

  function update(answered = false): void {
    const changed: Element[] = [];
    let anyHidden = false;
    steps.forEach((step, s) => {
      const visible = unlocked(s);
      if (!visible) anyHidden = true;
      cards[s].hidden = !visible;
      cards[s].classList.toggle("sp-step-right", work.status[s] === "right");
      cards[s].classList.toggle("sp-step-shown", work.status[s] === "shown");
      const html = isDone(s) ? step.worked : "";
      if (workedBoxes[s].dataset.html !== html) {
        workedBoxes[s].dataset.html = html;
        workedBoxes[s].innerHTML = html;
        changed.push(workedBoxes[s]);
      }
      updateButtons(s);
    });
    moreNote.hidden = !anyHidden;
    if (changed.length) void typeset(changed);
    const hasSteps = steps.length > 0;
    const wrong = work.wrongChecks;
    hintCount.textContent = !hasSteps ? "" : work.hintsUsed === 0 ? "No hints used"
      : `Hints used: ${work.hintsUsed}${wrong > 0 ? ` (including ${wrong} wrong check${wrong === 1 ? "" : "s"})` : ""}`;
    const finished = hasSteps && steps.every((_, s) => isDone(s));
    const worked = finished && steps.every((_, s) => given(s));  // A worked example: the page did every step
    doneBox.hidden = !finished;
    let next: { text: string; label: string; action: () => void } | null = null;
    if (worked) {
      doneText.textContent = "A worked example: the page did every step. Read each one, then try the next problem.";
      if (levelCount > 1) {
        next = { text: "Ready to work some steps yourself?", label: `Try ${o.levels!.names[1].toLowerCase()} support`, action: () => practice.goToLevel(2) };
      }
    } else if (finished) {
      const mine = steps.map((_, s) => s).filter(s => !given(s));
      const allRight = mine.every(s => work.status[s] === "right");
      doneText.textContent = allRight
        ? work.hintsUsed === 0 ? "Every step is right, with no hints!" : `Every step is right (hints used: ${work.hintsUsed}).`
        : "All steps are finished. Try another problem to get them right on your own.";
      practice.record(work.problem, work.hintsUsed, allRight && work.hintsUsed === 0, answered);
      next = practice.suggestion();
    }
    doneSuggest.hidden = next === null;
    if (next) {
      doneSuggestText.textContent = next.text;
      doneNextLevel.textContent = next.label;
      doneSuggestAction = next.action;
    }
    o.onStatus?.({ finished, hasSteps, mode: practice.mode() });
  }

  // ⋘──────── Check, Hint, Show ────────⋙
  function check(s: number): void {
    if (isDone(s)) return;
    const values = inputs[s].map(i => i.value.trim());
    // Entries that aren't numbers are marked without counting as a wrong check.
    const bad = inputs[s].filter((input, i) => input.type !== "hidden" && !input.disabled && values[i] !== "" && parseEntry(values[i]) === null);
    if (bad.length > 0) {
      bad.forEach(i => i.classList.add("sp-wrong"));
      feedbacks[s].innerHTML = `<p class="sp-feedback-wrong">Enter numbers like <code>-3</code>, <code>0.5</code>, or <code>1/2</code>.</p>`;
      return;
    }
    const verdict = steps[s].check(values);
    if (verdict.ok) {
      work.status[s] = "right";
      mark(s, "sp-right");
      feedbacks[s].innerHTML = `<p class="sp-feedback-right">Right!</p>`;
    } else {
      const key = values.join("|");
      work.wrongSeen[s] = work.wrongSeen[s] ?? [];
      if (!work.wrongSeen[s].includes(key)) {
        work.wrongSeen[s].push(key);
        work.hintsUsed++;
        work.wrongChecks++;
      }
      if (verdict.marks) mark(s, "", verdict.marks);
      else mark(s, "sp-wrong");
      feedbacks[s].innerHTML = `<p class="sp-feedback-wrong">Not quite.</p>${verdict.message ? `<p class="sp-feedback-note">${verdict.message}</p>` : ""}`;
      void typeset([feedbacks[s]]);
    }
    saveWork();
    update(verdict.ok);
    if (verdict.ok) focusNext(s);
  }

  // After a right answer, the first box of the next open step.
  function focusNext(s: number): void {
    for (let t = s + 1; t < steps.length; t++) {
      if (!isDone(t) && unlocked(t)) {
        const first = inputs[t].find(i => i.type !== "hidden" && !i.disabled);
        (first ?? yesNoBoxes[t][0]?.radios[0])?.focus({ preventScroll: true });
        return;
      }
    }
  }

  function renderHint(s: number): void {
    const level = Math.min(work.hintLevel[s], steps[s].hints.length);
    hintBoxes[s].hidden = level === 0;
    hintBoxes[s].innerHTML = steps[s].hints.slice(0, level).map(h => (h.startsWith("<") ? h : `<p>${h}</p>`)).join("");
    void typeset([hintBoxes[s]]);
  }

  function hint(s: number): void {
    if (work.hintLevel[s] < steps[s].hints.length) {
      work.hintLevel[s]++;
      work.hintsUsed++;
      saveWork();
    }
    renderHint(s);
    update();
  }

  function show(s: number): void {
    if (isDone(s)) return;
    work.entries[s] = [...steps[s].answer];
    inputs[s].forEach((input, i) => { input.value = steps[s].answer[i] ?? ""; });
    syncYesNo(s);
    work.status[s] = "shown";
    work.hintsUsed++;
    mark(s, "sp-shown");
    feedbacks[s].innerHTML = `<p class="sp-feedback-note">The answer is filled in${steps[s].shownNote ? ` ${steps[s].shownNote}` : ""}.</p>`;
    void typeset([feedbacks[s]]);
    saveWork();
    update(true);
  }

  // ⋘──────── Loading problems ────────⋙
  const seen: string[] = [];
  let seenIndex = -1;
  const prevButton = byId<HTMLButtonElement>("prev");
  const nextButton = byId<HTMLButtonElement>("next");
  const updateNav = () => { prevButton.disabled = seenIndex <= 0; };
  const urlKeys = [...o.urlKeys, "st"];

  function load(p: P | null, restore: boolean, fromStage: number | null, remember = true, notify = true): void {
    problem = p;
    practice.setProblemStage(p === null ? null : fromStage);
    steps = p === null ? [] : o.buildSteps(p);
    code = p === null ? "" : o.encode(p);
    if (p === null) {
      replaceQuery(["st"], []);
      work = { problem: "", entries: [], status: [], hintLevel: [], hintsUsed: 0, wrongChecks: 0, wrongSeen: [] };
      statement.innerHTML = "";
      renderSteps();
      return;
    }
    const query = `${code}${fromStage === null ? "" : `&st=${fromStage + 1}`}`;
    replaceQuery(urlKeys, query.split("&"));
    saveJSON(LAST_KEY, query);
    if (notify) o.onLoad?.(p, practice.mode());
    if (remember) {
      seen.splice(seenIndex + 1);
      seen.push(query);
      seenIndex = seen.length - 1;
      updateNav();
    }
    const saved = (loadJSON<Record<string, Work>>(WORKS_KEY) ?? {})[code];
    work = restore && saved && saved.problem === code && Array.isArray(saved.entries) && saved.status?.length === steps.length
      ? { ...saved, wrongSeen: saved.wrongSeen ?? steps.map(() => []), wrongChecks: saved.wrongChecks ?? 0 }
      : {
        problem: code, entries: steps.map(() => []), status: steps.map(() => "" as Status), hintLevel: steps.map(() => 0),
        hintsUsed: 0, wrongChecks: 0, wrongSeen: steps.map(() => []),
      };
    statement.innerHTML = o.statementHtml(p);
    renderSteps();
    void typeset([statement, stepsBox]);
    if (!restore) saveWork();
  }

  const stageOf = (query: string) => {
    const st = Number(new URLSearchParams(query).get("st"));
    return Number.isInteger(st) && st >= 1 && st <= o.stages.length ? st - 1 : null;
  };

  function goTo(index: number): void {
    seenIndex = index;
    const query = seen[index];
    const p = o.decode(query);
    if (p) load(p, true, stageOf(query), false);
    updateNav();
  }
  prevButton.addEventListener("click", () => { if (seenIndex > 0) goTo(seenIndex - 1); });
  nextButton.addEventListener("click", () => {
    if (seenIndex < seen.length - 1) goTo(seenIndex + 1);
    else newProblem();
  });

  function newProblem(): void {
    const path = practice.mode() === "path";
    const kind = path ? o.stages[practice.stage()].kind : (kindSelect.value as K);
    load(o.randomProblem(kind), false, path ? practice.stage() : null);
  }

  kindSelect.addEventListener("change", () => {
    saveSettings();
    newProblem();
  });
  byId<HTMLButtonElement>("done-new").addEventListener("click", () => {
    nextButton.click();
    window.scrollTo({ top: statement.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
  });
  doneNextLevel.addEventListener("click", () => doneSuggestAction());

  // The problem in the address; else the last one here; else a new one.
  const search = location.search;
  if (o.hasProblem ? o.hasProblem(search) : o.decode(search) !== null) {
    load(o.decode(search), true, practice.urlStage);
  } else {
    const last = loadJSON<string>(LAST_KEY);
    const p = typeof last === "string" ? o.decode(last) : null;
    if (p) load(p, true, stageOf(last!));
    else newProblem();
  }
  practice.render();

  return {
    current: () => problem,
    mode: () => practice.mode(),
    show(p) {
      const next = p === null ? "" : o.encode(p);
      if (next === code && (p === null) === (problem === null)) return;
      load(p, true, null, p !== null, false);
    },
  };
}
