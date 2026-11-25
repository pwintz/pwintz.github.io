// ╭───────────────────────────────────────────────────────────────╮
// │   Exam timer: a countdown to the end of an exam, in minutes   │
// ╰───────────────────────────────────────────────────────────────╯
// Shows the time remaining until the end of an exam, for projecting in the exam room. The display
// shows whole minutes only, since a ticking seconds count distracts students. Extensions (for a
// fire alarm or another disruption) move the end time and are listed, so the instructor can
// report them. The settings are saved in this browser, so a reload keeps the timer running.
// The display can be shown full screen or in a floating window that stays on top of other windows
// (for example, over the exam's slides); in both, the screen is kept awake.

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
const floatButton = $<HTMLButtonElement>("et-float");
const floatingNote = $<HTMLDivElement>("et-floating-note");

// The Document Picture-in-Picture API (Chromium browsers only, so far) is not in TypeScript's DOM types.
interface DocumentPictureInPicture { requestWindow(options?: { width?: number; height?: number }): Promise<Window> }
const documentPip = (window as unknown as { documentPictureInPicture?: DocumentPictureInPicture }).documentPictureInPicture;

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
    // The display can be in the floating window, whose styles are computed by that window.
    const view = el.ownerDocument.defaultView ?? window;
    el.style.fontSize = `${(parseFloat(view.getComputedStyle(el).fontSize) * room) / el.scrollWidth}px`;
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

// Checked every second, but the text changes only once a minute.
let timer = window.setInterval(tick, 1000);
// The floating window, while it is open.
let floatWindow: Window | null = null;

// ⋘──────── Keeping the screen awake ────────⋙
// While the display is full screen or floating, a screen wake lock stops the computer from dimming
// the screen or going to sleep, as video players do. The browser releases the lock when the page
// is hidden, so it is requested again when the page is shown.
let wakeLock: WakeLockSentinel | null = null;
let wakeLockWindow: Window | null = null;
async function updateWakeLock(): Promise<void> {
  // The floating window stays visible when the page's tab is hidden, so it holds the lock then.
  const win = floatWindow ?? (document.fullscreenElement === display ? window : null);
  if (wakeLock && !wakeLock.released && wakeLockWindow === win) return;
  const old = wakeLock;
  wakeLock = null;
  wakeLockWindow = win;
  await old?.release().catch(() => {});
  if (!win || win.document.visibilityState !== "visible" || !("wakeLock" in win.navigator)) return;
  try {
    const lock = await win.navigator.wakeLock.request("screen");
    // The display might have left full screen or the floating window while the request was pending.
    if (wakeLockWindow === win) wakeLock = lock;
    else void lock.release();
  } catch {
    // Refused, for example by a battery saver: the timer still works.
  }
}
document.addEventListener("visibilitychange", () => void updateWakeLock());

// ⋘──────── Full screen ────────⋙
// Full screen shows only the display, as large as the screen allows.
fullButton.addEventListener("click", () => {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void display.requestFullscreen?.();
});
addEventListener("resize", fitAll);
document.addEventListener("fullscreenchange", () => {
  requestAnimationFrame(fitAll);
  fullButton.textContent = document.fullscreenElement ? "Exit full screen" : "Full screen";
  void updateWakeLock();
});
if (!document.fullscreenEnabled) fullButton.hidden = true;
display.addEventListener("dblclick", () => { if (!floatWindow) fullButton.click(); });

// ⋘──────── Floating window ────────⋙
// The display moves into a small window that stays on top of other windows. Closing that window
// moves the display back into the page.
async function openFloatWindow(): Promise<void> {
  if (!documentPip || floatWindow) return;
  if (document.fullscreenElement) await document.exitFullscreen();
  const win = await documentPip.requestWindow({ width: 480, height: 270 });
  // The page's styles, copied so that the display looks the same in the floating window.
  for (const sheet of document.styleSheets) {
    try {
      const style = win.document.createElement("style");
      style.textContent = [...sheet.cssRules].map(rule => rule.cssText).join("\n");
      win.document.head.append(style);
    } catch {
      // A style sheet from another site cannot be read, but it can be linked.
      if (!sheet.href) continue;
      const link = Object.assign(win.document.createElement("link"), { rel: "stylesheet", href: sheet.href });
      win.document.head.append(link);
    }
  }
  win.document.title = state.title || "Exam timer";
  const wrapper = Object.assign(win.document.createElement("div"), { className: "et et-floating" });
  wrapper.append(display);
  win.document.body.append(wrapper);
  floatWindow = win;
  floatingNote.hidden = false;
  // A hidden tab's timers can be slowed to once a minute, but the floating window stays visible,
  // so it runs the clock.
  clearInterval(timer);
  timer = win.setInterval(tick, 1000);
  win.addEventListener("resize", fitAll);
  win.document.addEventListener("visibilitychange", () => void updateWakeLock());
  win.addEventListener("pagehide", () => {
    floatingNote.before(display);
    floatingNote.hidden = true;
    floatWindow = null;
    timer = window.setInterval(tick, 1000);
    requestAnimationFrame(fitAll);
    void updateWakeLock();
  });
  requestAnimationFrame(fitAll);
  void updateWakeLock();
}

if (documentPip) {
  floatButton.addEventListener("click", () => void openFloatWindow());
  $<HTMLButtonElement>("et-unfloat").addEventListener("click", () => floatWindow?.close());
} else {
  floatButton.hidden = true;
}

setupHelp("et");
renderExtensions();
tick();
