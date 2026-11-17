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
