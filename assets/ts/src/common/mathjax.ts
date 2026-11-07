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

export function typeset(els: Element[]): Promise<void> {
  mathQueue = mathQueue.catch(() => undefined).then(async () => {
    if (!(await mathJaxReady())) return;
    window.MathJax!.typesetClear?.(els);
    await window.MathJax!.typesetPromise!(els).catch(() => { /* Leave the TeX source visible */ });
  });
  return mathQueue;
}

/** Runs `task` in the MathJax queue, after any typesetting already queued. */
export function enqueueMath(task: () => Promise<void>): Promise<void> {
  mathQueue = mathQueue.catch(() => undefined).then(task);
  return mathQueue;
}
