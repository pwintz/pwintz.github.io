// ╭───────────────────────────────────────────────────────────────╮
// │          Practice paths and progress (shared by the tools)     │
// ╰───────────────────────────────────────────────────────────────╯
// Shared by the linear algebra practice pages (the matrix of a linear map, Gaussian elimination,
// and the REF/RREF quiz). The styles are in _includes/practice-styles.html.
//
// A practice path is a list of stages, from easy to hard, each giving random problems of one kind.
// The student either follows the path ("Practice path") or picks the kind of problem with the
// page's own menus ("Choose problems"). Pages with levels (how much of each problem the student
// does) show them in the same settings box, below the stage.
//
// Each finished problem is recorded (in this browser) with its stage, its level, and the hints the
// student needed; a problem with no hints counts as "clean". After enough clean problems at a stage
// (or level), the page suggests the next one. The progress section shows a table of the stages and
// a log of recent problems. "Continue where you left off" returns to the furthest stage reached, at
// the level last used there.

import { loadJSON, saveJSON } from "./storage";

export interface Stage { id: string; title: string; note: string }

// A finished problem. `problem` identifies it (e.g., its URL query); `stage` is a stage id.
export interface Attempt { problem: string; stage?: string; level?: number; hints: number; clean: boolean; time?: number }

export interface LevelOptions {
  count: number;
  cleanToAdvance: number;
  current: () => number | null;   // 1-based, or null for a custom combination
  set: (level: number) => void;   // Selects a level (without making a new problem)
}

export interface PracticeOptions {
  key: string;                     // Prefix for the saved data, e.g. "gaussian_elimination"
  stages: Stage[];
  cleanToAdvanceStage: number;
  levels?: LevelOptions;
  hintWords?: [string, string];    // What the count is called: ["hint", "hints"] by default
  box: HTMLElement;                // The settings box: the path's controls go at its start
  customControls: HTMLElement[];   // Shown only when choosing problems
  progress: HTMLElement;           // Where the "Your progress" section goes
  newProblem: () => void;          // Makes a new problem for the current mode and stage
  helpText?: string;               // For the "?" beside "Stage" (with the page's setupHelp)
  // "list" (the default, used by every page): a vertical list of "Stage N" pills with the stages' titles,
  // like the levels. "menu": a drop-down menu with ← and → buttons.
  stageStyle?: "menu" | "list";
}

export interface Practice {
  mode: () => "path" | "custom";
  stage: () => number;
  // The stage of the problem shown, or null for one the student chose (or typed in).
  problemStage: () => number | null;
  setProblemStage: (i: number | null) => void;
  urlStage: number | null;         // The stage in the page's URL (&st=N), if any
  goToStage: (i: number) => void;
  record: (problem: string, hints: number, clean: boolean, isNew: boolean) => void;
  render: () => void;              // Updates the menus, the progress section, and the resume button
  levelChanged: () => void;        // Call after the student changes the level
  // What to suggest after finishing a problem: the next stage, or else the next level.
  suggestion: () => { text: string; label: string; action: () => void } | null;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className = "", html = ""): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html) e.innerHTML = html;
  return e;
}

export function setupPractice(o: PracticeOptions): Practice {
  const [hintWord, hintsWord] = o.hintWords ?? ["hint", "hints"];
  const SETTINGS_KEY = `${o.key}_practice`;
  const LOG_KEY = `${o.key}_practice_log`;
  const LEFT_OFF_KEY = `${o.key}_practice_left_off`;
  const stageIndex = (id: string | undefined) => o.stages.findIndex(s => s.id === id);

  // ⋘──────── State ────────⋙
  const saved = loadJSON<{ mode?: string; stageId?: string }>(SETTINGS_KEY) ?? {};
  let mode: "path" | "custom" = saved.mode === "custom" ? "custom" : "path";
  let stage = Math.max(0, stageIndex(saved.stageId));
  let problemStage: number | null = null;
  const linked = Number(new URLSearchParams(location.search).get("st"));
  const urlStage = Number.isInteger(linked) && linked >= 1 && linked <= o.stages.length ? linked - 1 : null;
  if (urlStage !== null) { mode = "path"; stage = urlStage; }
  const saveSettings = () => saveJSON(SETTINGS_KEY, { mode, stageId: o.stages[stage].id });

  const loadLog = (): Attempt[] => {
    const log = loadJSON<Attempt[]>(LOG_KEY);
    return Array.isArray(log) ? log.filter(a => a && typeof a.problem === "string") : [];
  };
  let log = loadLog();
  const savedLeftOff = loadJSON<{ stageId: string; level?: number }>(LEFT_OFF_KEY);
  let leftOff: { stage: number; level?: number } | null =
    savedLeftOff && stageIndex(savedLeftOff.stageId) >= 0 ? { stage: stageIndex(savedLeftOff.stageId), level: savedLeftOff.level } : null;

  // ⋘──────── The controls in the settings box ────────⋙
  const controls = el("div", "pr-controls");
  const modeRow = el("div", "pr-row");
  const modes = el("div", "pr-modes");
  modes.setAttribute("role", "group");
  modes.setAttribute("aria-label", "How to choose problems");
  const pathButton = el("button", "", "Practice path");
  const customButton = el("button", "", "Choose problems");
  for (const b of [pathButton, customButton]) { b.type = "button"; modes.append(b); }
  modeRow.append(modes);

  const stageRow = el("div", "pr-row pr-stage-row");
  const stageLabel = el("label", "pr-field");
  const stageText = el("span", "", "Stage");
  if (o.helpText) stageText.dataset.help = o.helpText;
  const stageSelect = el("select");
  stageLabel.append(stageText, stageSelect);
  const prev = el("button", "pr-nav", "←");
  const next = el("button", "pr-nav", "→");
  prev.type = next.type = "button";
  prev.setAttribute("aria-label", "Previous stage"); prev.title = "Previous stage";
  next.setAttribute("aria-label", "Next stage"); next.title = "Next stage";
  const navs = el("span", "pr-navs");
  navs.append(prev, next);
  // As a list: "Stage" beside a vertical list of radio buttons, styled like the levels.
  const asList = (o.stageStyle ?? "list") === "list";
  const openInfo = new Set<number>();  // The stages whose explanations are shown
  const stageList = el("span", "pr-level-list");
  stageList.setAttribute("role", "radiogroup");
  stageList.setAttribute("aria-label", "Stage");
  if (asList) {
    stageRow.classList.add("pr-levels");
    const listLabel = el("span", "pr-levels-label");
    listLabel.append(stageText);
    stageRow.append(listLabel, stageList);
    stageList.addEventListener("change", event => {
      const radio = event.target as HTMLInputElement;
      goToStage(Number(radio.value));
    });
  } else {
    stageRow.append(stageLabel, navs);
  }
  const note = el("p", "pr-note");
  const resume = el("p", "pr-resume");
  const resumeButton = el("button");
  resumeButton.type = "button";
  resume.append(resumeButton);
  controls.append(modeRow, stageRow, note, resume);
  o.box.prepend(controls);

  // ⋘──────── Progress ────────⋙
  const cleanAt = (i: number) => log.filter(a => a.stage === o.stages[i].id && a.clean).length;
  const cleanAtLevel = (lv: number) => log.filter(a => a.level === lv && a.clean).length;
  const count = (n: number) => `${n} ${n === 1 ? hintWord : hintsWord}`;

  function renderMenus(): void {
    pathButton.setAttribute("aria-pressed", String(mode === "path"));
    customButton.setAttribute("aria-pressed", String(mode === "custom"));
    stageRow.hidden = mode !== "path";
    note.hidden = mode !== "path" || asList;  // A list explains each stage with its "i" button
    for (const c of o.customControls) c.hidden = mode !== "custom";
    stageSelect.replaceChildren(...o.stages.map((s, i) =>
      new Option(`${i + 1}. ${s.title}${cleanAt(i) >= o.cleanToAdvanceStage ? " ✓" : ""}`, `${i}`, false, i === stage)));
    if (asList) {
      // Each stage: its radio button and title, then an "i" button that shows what the stage is
      // about (below it).
      stageList.replaceChildren(...o.stages.map((s, i) => {
        const item = el("div", "pr-stage-item");
        const label = el("label", "pr-level");
        const radio = el("input");
        radio.type = "radio";
        radio.name = `${o.key}-stage`;
        radio.value = `${i}`;
        radio.checked = i === stage;
        const done = cleanAt(i) >= o.cleanToAdvanceStage;
        label.append(radio, el("span", "pr-pill", `Stage ${i + 1}`),
          el("span", "", `${s.title}${done ? ` <span class="pr-clean" title="Mastered">✓</span>` : ""}`));
        const info = el("button", "pr-info", "i");
        info.type = "button";
        info.setAttribute("aria-label", `About stage ${i + 1}`);
        const about = el("p", "pr-stage-info");
        about.id = `${o.key}-stage-info-${i}`;
        about.textContent = s.note;
        about.hidden = !openInfo.has(i);
        info.setAttribute("aria-controls", about.id);
        info.setAttribute("aria-expanded", String(!about.hidden));
        info.addEventListener("click", () => {
          about.hidden = !about.hidden;
          info.setAttribute("aria-expanded", String(!about.hidden));
          if (about.hidden) openInfo.delete(i); else openInfo.add(i);
        });
        item.append(label, info);
        // Beside the furthest stage reached, when the student is at another one: a button back.
        if (leftOff && leftOff.stage === i && stage !== i) {
          const back = el("button", "pr-continue", `↩ Continue${leftOff.level !== undefined && o.levels ? ` at Level ${leftOff.level}` : ""}`);
          back.type = "button";
          back.title = "Go back to where you left off: your furthest stage, at the level you were using";
          back.addEventListener("click", resumeLeftOff);
          item.append(back);
        }
        item.append(about);
        return item;
      }));
    }
    prev.disabled = stage === 0;
    next.disabled = stage === o.stages.length - 1;
    note.textContent = asList ? o.stages[stage].note : `Stage ${stage + 1} of ${o.stages.length}: ${o.stages[stage].note}`;
    // Where the student left off: beside that stage in the list (see above), or else here.
    const away = leftOff !== null && (mode !== "path" || stage !== leftOff.stage);
    resume.hidden = !away || (asList && mode === "path");
    if (away) {
      const lv = leftOff!.level !== undefined && o.levels ? `, Level ${leftOff!.level}` : "";
      resumeButton.textContent = `↩ Continue the path: stage ${leftOff!.stage + 1}${lv}`;
    }
  }

  // The furthest stage reached (and the level used there), for "Continue where you left off".
  function noteStage(i: number): void {
    if (leftOff && i < leftOff.stage) return;
    leftOff = { stage: i, level: o.levels?.current() ?? undefined };
    saveJSON(LEFT_OFF_KEY, { stageId: o.stages[i].id, level: leftOff.level });
  }

  const row = (cells: string[], current = false) => `<tr${current ? ` class="pr-current"` : ""}>${cells.map(c => `<td>${c}</td>`).join("")}</tr>`;
  const head = (cells: string[]) => `<thead><tr>${cells.map(c => `<th scope="col">${c}</th>`).join("")}</tr></thead>`;
  const mark = (a: Attempt) => (a.clean ? `<span class="pr-clean">✓</span> No ${hintsWord}` : count(a.hints));
  const when = (t?: number) => (t === undefined ? "" : new Date(t).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }));

  const progressBody = el("div");
  const levelSuggest = el("p", "pr-suggest");
  const reset = el("button", "pr-small", "Reset progress");
  reset.type = "button";
  const progressHead = el("div", "pr-progress-head");
  progressHead.append(el("h2", "", "Your progress"), reset);
  o.progress.classList.add("pr-progress");
  o.progress.replaceChildren(progressHead, progressBody, levelSuggest);

  // ⋘──────── Mastery ────────⋙
  // How well the student has done a stage: 0 not tried, 1 finished (with hints), 2 finished with
  // no hints but with help (a lower level, where the page does some of the steps), 3 mastered
  // (with no hints, at the top level, or, for pages without levels, enough times to move on).
  function mastery(i: number): { rank: number; label: string } {
    const at = log.filter(a => a.stage === o.stages[i].id);
    if (at.length === 0) return { rank: 0, label: "Not tried yet" };
    const clean = at.filter(a => a.clean);
    if (!o.levels) {
      if (clean.length >= o.cleanToAdvanceStage) return { rank: 3, label: `Mastered: no ${hintsWord}` };
      if (clean.length > 0) return { rank: 2, label: `No ${hintsWord} once` };
      return { rank: 1, label: `Finished, with ${hintsWord}` };
    }
    const top = o.levels.count;
    const best = Math.max(0, ...clean.map(a => a.level ?? 0));
    if (best === top) return { rank: 3, label: `Mastered: no ${hintsWord}, no help (Level ${top})` };
    if (best > 0) return { rank: 2, label: `No ${hintsWord}, with help (Level ${best})` };
    const highest = Math.max(0, ...at.map(a => a.level ?? 0));
    return { rank: 1, label: `Finished, with ${hintsWord}${highest > 0 ? ` (up to Level ${highest})` : ""}` };
  }

  // One sentence for the whole path, like "Mastered 2 of 9 stages; 1 more with no hints, with help."
  function masterySummary(): string {
    const ranks = o.stages.map((_, i) => mastery(i).rank);
    const n = (r: number) => ranks.filter(x => x === r).length;
    const parts = [`<strong>Mastered ${n(3)} of ${o.stages.length} stages</strong>${o.levels ? ` (no ${hintsWord}, no help)` : ""}`];
    if (n(2) > 0) parts.push(`${n(2)} more with no ${hintsWord}${o.levels ? ", with help" : " once"}`);
    if (n(1) > 0) parts.push(`${n(1)} finished with ${hintsWord}`);
    const nextUp = ranks.findIndex(r => r < 3);
    const next = nextUp < 0 ? " You've mastered every stage!" : ` Next to master: stage ${nextUp + 1}, ${o.stages[nextUp].title}.`;
    return `${parts.join("; ")}.${next}`;
  }

  function renderProgress(): void {
    if (log.length === 0) {
      progressBody.innerHTML = `<p class="pr-empty">Finish a problem to start tracking your progress.</p>`;
    } else {
      const stageRows = o.stages.map((s, i) => {
        const at = log.filter(a => a.stage === s.id);
        const recent = at.slice(-12).map(a => (a.clean ? `<span class="pr-clean" title="No ${hintsWord}">✓</span>` : `${a.hints}`)).join(" ");
        const m = mastery(i);
        return row([`${i + 1}. ${s.title}`, `<span class="pr-mastery pr-mastery-${m.rank}">${m.label}</span>`, `${at.length}`, `${cleanAt(i)}`,
          at.length === 0 ? "" : `${at.length > 12 ? "… " : ""}${recent}`],
          mode === "path" && i === stage);
      }).join("");
      const LOG_LENGTH = 15;
      const logRows = log.slice(-LOG_LENGTH).reverse().map(a => {
        const i = stageIndex(a.stage);
        const name = i >= 0 ? `${i + 1}. ${o.stages[i].title}` : a.stage === undefined ? "Your choice" : "An earlier stage";
        return row([when(a.time), name, ...(o.levels ? [a.level === undefined ? "Custom" : `Level ${a.level}`] : []), mark(a)]);
      }).join("");
      progressBody.innerHTML =
        `<h3>Mastery</h3><p class="pr-summary">${masterySummary()}</p>`
        + `<div class="pr-scroll"><table class="pr-table">${head(["Stage", "Mastery", "Finished", `With no ${hintsWord}`, `${hintsWord[0].toUpperCase()}${hintsWord.slice(1)} per problem (oldest first; ✓ = none)`])}<tbody>${stageRows}</tbody></table></div>`
        + `<h3>Recent problems</h3><div class="pr-scroll"><table class="pr-table">${head(["Finished", "Stage", ...(o.levels ? ["Level"] : []), hintsWord[0].toUpperCase() + hintsWord.slice(1)])}<tbody>${logRows}</tbody></table></div>`
        + (log.length > LOG_LENGTH ? `<p class="pr-empty">Showing the last ${LOG_LENGTH} of ${log.length} problems.</p>` : "");
    }
    // The next level, after enough clean problems at this one.
    const lv = o.levels?.current() ?? null;
    const levelReady = o.levels && lv !== null && lv < o.levels.count && cleanAtLevel(lv) >= o.levels.cleanToAdvance;
    levelSuggest.hidden = !levelReady;
    if (levelReady) {
      const button = el("button", "", `Go to Level ${lv! + 1}`);
      button.type = "button";
      button.addEventListener("click", () => goToLevel(lv! + 1));
      levelSuggest.replaceChildren(el("span", "", `You've solved ${cleanAtLevel(lv!)} problems at Level ${lv} with no ${hintsWord}. Ready for Level ${lv! + 1}?`), button);
    }
  }

  function render(): void {
    renderMenus();
    renderProgress();
  }

  // ⋘──────── Moving around ────────⋙
  function goToStage(i: number): void {
    stage = Math.min(Math.max(i, 0), o.stages.length - 1);
    mode = "path";
    saveSettings();
    o.newProblem();
    render();
  }

  function goToLevel(lv: number): void {
    o.levels?.set(lv);
    if (mode === "path" && leftOff && stage === leftOff.stage) noteStage(stage);
    o.newProblem();
    render();
  }

  const setMode = (m: "path" | "custom") => {
    if (m === mode) return;
    mode = m;
    saveSettings();
    o.newProblem();
    render();
  };
  pathButton.addEventListener("click", () => setMode("path"));
  customButton.addEventListener("click", () => setMode("custom"));
  stageSelect.addEventListener("change", () => goToStage(Number(stageSelect.value)));
  prev.addEventListener("click", () => goToStage(stage - 1));
  next.addEventListener("click", () => goToStage(stage + 1));
  function resumeLeftOff(): void {
    if (!leftOff) return;
    if (leftOff.level !== undefined) o.levels?.set(leftOff.level);
    goToStage(leftOff.stage);
  }
  resumeButton.addEventListener("click", resumeLeftOff);
  reset.addEventListener("click", () => {
    if (!window.confirm("Erase your progress at every stage and level? This can't be undone.")) return;
    log = [];
    leftOff = null;
    saveJSON(LOG_KEY, log);
    saveJSON(LEFT_OFF_KEY, null);
    render();
  });

  return {
    mode: () => mode,
    stage: () => stage,
    problemStage: () => problemStage,
    setProblemStage: i => { problemStage = i; },
    urlStage,
    goToStage,
    // A problem is added when an answer finishes it (`isNew`); afterward, its count is updated if
    // the student uses more hints.
    record(problem, hints, clean, isNew) {
      const level = o.levels?.current() ?? undefined;
      const entry: Attempt = { problem, hints, clean, time: Date.now() };
      if (level !== undefined) entry.level = level;
      if (problemStage !== null) entry.stage = o.stages[problemStage].id;
      const i = log.findIndex(a => a.problem === problem && a.level === entry.level && a.stage === entry.stage);
      if (i < 0 && !isNew) return;
      if (i >= 0 && log[i].hints === hints && log[i].clean === clean) return;
      if (i >= 0) log[i] = { ...entry, time: log[i].time };
      else log.push(entry);
      saveJSON(LOG_KEY, log);
      if (problemStage !== null && i < 0) noteStage(problemStage);
      render();
    },
    render,
    levelChanged() {
      if (mode === "path" && leftOff && stage === leftOff.stage) noteStage(stage);
      render();
    },
    suggestion() {
      const st = problemStage;
      if (st !== null && st < o.stages.length - 1 && cleanAt(st) >= o.cleanToAdvanceStage) {
        return {
          text: `You've solved ${cleanAt(st)} problems at this stage with no ${hintsWord}. Ready for stage ${st + 2}: ${o.stages[st + 1].title}?`,
          label: `Go to stage ${st + 2}`,
          action: () => { noteStage(st + 1); goToStage(st + 1); },
        };
      }
      const lv = o.levels?.current() ?? null;
      if (o.levels && lv !== null && lv < o.levels.count && cleanAtLevel(lv) >= o.levels.cleanToAdvance) {
        return {
          text: `You've solved ${cleanAtLevel(lv)} problems at Level ${lv} with no ${hintsWord}. Ready for Level ${lv + 1}?`,
          label: `Go to Level ${lv + 1}`,
          action: () => goToLevel(lv + 1),
        };
      }
      return null;
    },
  };
}
