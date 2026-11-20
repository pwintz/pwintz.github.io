// ╭───────────────────────────────────────────────────────────────╮
// │   Exam timer: a countdown to the end of an exam, in minutes   │
// ╰───────────────────────────────────────────────────────────────╯
// Shows the time remaining until the end of an exam, for projecting in the exam room. The display
// shows whole minutes only, since a ticking seconds count distracts students. Extensions (for a
// fire alarm or another disruption) move the end time and are listed, so the instructor can
// report them. The settings are saved in this browser, so a reload keeps the timer running.

import { setupHelp } from "./common/help";
import { loadJSON, saveJSON } from "./common/storage";
import { Extension, clockText, endTime, remainingText, todayAt } from "./exam_timer/timing";

const KEY = "exam-timer";
interface Saved { title: string; end: string; hour12: boolean; extensions: Extension[]; day: string }

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const titleInput = $<HTMLInputElement>("et-title");
const endInput = $<HTMLInputElement>("et-end");
const hourSelect = $<HTMLSelectElement>("et-hour12");
const display = $<HTMLDivElement>("et-display");
const titleEl = $<HTMLDivElement>("et-show-title");
const remainingEl = $<HTMLDivElement>("et-remaining");
const endsEl = $<HTMLDivElement>("et-ends");
const nowEl = $<HTMLDivElement>("et-now");
const extList = $<HTMLUListElement>("et-extensions");
const reasonInput = $<HTMLInputElement>("et-reason");
const customInput = $<HTMLInputElement>("et-minutes");
const fullButton = $<HTMLButtonElement>("et-full");

const today = () => new Date().toDateString();
const saved = loadJSON<Saved>(KEY);
// Extensions belong to one exam: they are cleared on a new day.
const state: Saved = {
  title: saved?.title ?? "",
  end: saved?.end ?? "",
  hour12: saved?.hour12 ?? true,
  extensions: saved?.day === today() ? saved.extensions ?? [] : [],
  day: today(),
};
titleInput.value = state.title;
endInput.value = state.end;
hourSelect.value = state.hour12 ? "12" : "24";

function save(): void {
  state.day = today();
  saveJSON(KEY, state);
}

function renderExtensions(): void {
  extList.replaceChildren(...state.extensions.map((e, i) => {
    const remove = Object.assign(document.createElement("button"), { type: "button", textContent: "Remove", className: "et-small" });
    remove.addEventListener("click", () => { state.extensions.splice(i, 1); changed(); });
    const li = document.createElement("li");
    li.append(`+${e.minutes} min${e.reason ? `: ${e.reason}` : ""} `, remove);
    return li;
  }));
  $<HTMLElement>("et-ext-none").hidden = state.extensions.length > 0;
}

// Shrinks a line of text, from its size in the style sheet, until it fits the width of the display.
function fit(el: HTMLElement): void {
  el.style.fontSize = "";
  const room = display.clientWidth - 32;
  if (el.scrollWidth > room && room > 0) {
    el.style.fontSize = `${(parseFloat(getComputedStyle(el).fontSize) * room) / el.scrollWidth}px`;
  }
}
const fitAll = () => [titleEl, remainingEl, endsEl, nowEl].forEach(fit);

let last = "";
function tick(): void {
  const now = new Date();
  const scheduled = todayAt(state.end, now);
  titleEl.textContent = state.title;
  titleEl.hidden = !state.title;
  nowEl.textContent = `Now ${clockText(now, state.hour12)}`;
  if (!scheduled) {
    remainingEl.textContent = "Set the end time";
    endsEl.textContent = "";
    display.className = "et-display";
    fitAll();
    return;
  }
  const end = endTime(scheduled, state.extensions);
  const left = end.getTime() - now.getTime();
  const text = remainingText(left);
  if (text !== last) { remainingEl.textContent = text; last = text; }
  fitAll();
  const extended = state.extensions.reduce((s, e) => s + e.minutes, 0);
  endsEl.textContent = `${left <= 0 ? "Ended" : "Ends"} at ${clockText(end, state.hour12)}${extended ? ` (extended ${extended} min)` : ""}`;
  display.className = `et-display${left <= 0 ? " et-done" : left <= 5 * 60_000 ? " et-last5" : left <= 15 * 60_000 ? " et-last15" : ""}`;
}

function changed(): void {
  save();
  renderExtensions();
  last = "";
  tick();
}

titleInput.addEventListener("input", () => { state.title = titleInput.value; changed(); });
endInput.addEventListener("input", () => { state.end = endInput.value; changed(); });
hourSelect.addEventListener("change", () => { state.hour12 = hourSelect.value === "12"; changed(); });

function extend(minutes: number): void {
  if (!(minutes > 0)) return;
  state.extensions.push({ minutes, reason: reasonInput.value.trim() });
  reasonInput.value = "";
  changed();
}
for (const b of document.querySelectorAll<HTMLButtonElement>("[data-extend]")) b.addEventListener("click", () => extend(Number(b.dataset.extend)));
$<HTMLButtonElement>("et-add").addEventListener("click", () => { extend(Math.round(Number(customInput.value))); customInput.value = ""; });

// Full screen shows only the display, as large as the screen allows.
fullButton.addEventListener("click", () => {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void display.requestFullscreen?.();
});
addEventListener("resize", fitAll);
document.addEventListener("fullscreenchange", () => {
  requestAnimationFrame(fitAll);
  fullButton.textContent = document.fullscreenElement ? "Exit full screen" : "Full screen";
});
if (!document.fullscreenEnabled) fullButton.hidden = true;
display.addEventListener("dblclick", () => fullButton.click());

setupHelp("et");
renderExtensions();
tick();
// Checked every second, but the text changes only once a minute.
setInterval(tick, 1000);
