// ╭───────────────────────────────────────────────────────────────╮
// │                    Typesetting with MathJax                   │
// ╰───────────────────────────────────────────────────────────────╯
// Shared by the tools that render math they generate after the page loads.

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (els: Element[]) => Promise<void>;
      typesetClear?: (els: Element[]) => void;
      startup?: { promise?: Promise<void> };
    };
  }
}

// ⋘──────── MathJax ────────⋙
// MathJax loads asynchronously, so typesetting waits until it's ready. Calls are queued because
// MathJax can't typeset concurrently.

let mathQueue: Promise<void> = Promise.resolve();

export function mathJaxReady(): Promise<boolean> {
  return new Promise((resolve) => {
    const started = Date.now();
    const poll = () => {
      const mj = window.MathJax;
      if (mj?.typesetPromise) {
        (mj.startup?.promise ?? Promise.resolve()).then(() => resolve(true), () => resolve(false));
      } else if (Date.now() - started > 15000) {
        resolve(false);
      } else {
        window.setTimeout(poll, 100);
      }
    };
    poll();
  });
}

// ⋘──────── Hiding TeX until it's typeset ────────⋙
// While an element waits to be typeset (MathJax may still be loading), it's hidden, keeping its
// space, so raw TeX like "\color[RGB]{…}" doesn't flash on the page. `pending` counts the typesets
// waiting on each element, so it's shown again only after the last one. If MathJax doesn't load or
// fails, the element is shown anyway, with its TeX source.

const HIDDEN_CLASS = "mathjax-typesetting";
const pending = new WeakMap<Element, number>();
let styleAdded = false;

function hideUntilTypeset(els: Element[]): () => void {
  if (!styleAdded && typeof document !== "undefined") {
    const style = document.createElement("style");
    style.textContent = `.${HIDDEN_CLASS} { visibility: hidden; }`;
    document.head.append(style);
    styleAdded = true;
  }
  for (const el of els) {
    pending.set(el, (pending.get(el) ?? 0) + 1);
    el.classList.add(HIDDEN_CLASS);
  }
  return () => {
    for (const el of els) {
      const left = (pending.get(el) ?? 1) - 1;
      pending.set(el, left);
      if (left <= 0) el.classList.remove(HIDDEN_CLASS);
    }
  };
}

export function typeset(els: Element[]): Promise<void> {
  const reveal = hideUntilTypeset(els);
  mathQueue = mathQueue.catch(() => undefined).then(async () => {
    if (!(await mathJaxReady())) return;
    window.MathJax!.typesetClear?.(els);
    await window.MathJax!.typesetPromise!(els).catch(() => { /* Leave the TeX source visible */ });
  });
  const done = mathQueue.finally(reveal);
  mathQueue = done;
  return done;
}

/** Runs `task` in the MathJax queue, after any typesetting already queued. */
export function enqueueMath(task: () => Promise<void>): Promise<void> {
  mathQueue = mathQueue.catch(() => undefined).then(task);
  return mathQueue;
}

// ⋘──────── Math as HTML, right away ────────⋙
// For math that changes while something is dragged (such as a readout of numbers), typesetting the
// page each frame would be slow and flicker. `mathHTML` instead converts TeX straight to MathJax's
// SVG markup, cached, so it can go in innerHTML like any other HTML. Until MathJax is ready it
// gives a hidden placeholder, and calls `onReady` once MathJax is ready so the caller can redraw.

const mathCache = new Map<string, string>();
const readyCallbacks = new Set<() => void>();
let mathIsReady = false;
let waitingForMath = false;

const escapeHTML = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function mathHTML(tex: string, onReady?: () => void): string {
  const hit = mathCache.get(tex);
  if (hit !== undefined) return hit;
  const mj = window.MathJax as unknown as { tex2svg?: (t: string, o: object) => HTMLElement } | undefined;
  if (!mathIsReady || !mj?.tex2svg) {
    if (onReady) readyCallbacks.add(onReady);
    if (!waitingForMath) {
      waitingForMath = true;
      void mathJaxReady().then(async ok => {
        // tex2svg can't load TeX packages on demand, so load the ones used here (\color) first.
        const mjp = window.MathJax as unknown as { tex2svgPromise?: (t: string) => Promise<unknown> } | undefined;
        if (ok) await mjp?.tex2svgPromise?.('{\\color[RGB]{0,0,0}{x}}').catch(() => undefined);
        mathIsReady = ok;
        if (!ok) return;
        const callbacks = [...readyCallbacks];
        readyCallbacks.clear();
        callbacks.forEach(f => f());
      });
    }
    return `<span style="visibility:hidden">${escapeHTML(tex)}</span>`;
  }
  let html: string;
  try {
    html = mj.tex2svg(tex, { display: false }).outerHTML;
  } catch {
    html = `<span>${escapeHTML(tex)}</span>`;
  }
  // Numbers that change while dragging make many distinct strings; keep the cache bounded.
  if (mathCache.size > 2000) mathCache.clear();
  mathCache.set(tex, html);
  return html;
}
