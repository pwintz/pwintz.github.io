// ╭───────────────────────────────────────────────────────────────╮
// │                  Eigenvalues and eigenvectors                  │
// ╰───────────────────────────────────────────────────────────────╯
// The page /tools/eigenvalues/ (collections/_pages/eigenvalues.html): practice problems worked in
// steps (eigen/practice_page.ts), with a picture of the problem's 2 × 2 matrix acting on the plane
// (eigen/visualizer.ts). The math is in eigen/eigen_math.ts.

import { setupHelp } from "./common/help";
import { setupPanels } from "./common/panels";
import { loadJSON, saveJSON } from "./common/storage";
import { setupVisualizer } from "./eigen/visualizer";
import { formatFraction } from "./matrix/fraction";
import { PIN_KEY, setupPracticePage } from "./eigen/practice_page";

function initPage(): void {
  // One problem: the practice problem is the one drawn, and the picture's values stay hidden
  // until its steps are finished.
  const visualizer = setupVisualizer();
  setupPracticePage({
    onLoad(p) {
      visualizer.showProblem(p.A.length === 2 ? p.A.flat().map(x => formatFraction(x).replace("−", "-")) : null,
        p.v && p.A.length === 2 ? p.v.map(x => Number(x.num) / Number(x.den)) : undefined);
    },
    onStatus({ finished }) {
      visualizer.setNumbersShown(finished);
    },
  });
  setupHelp("ev");
  const panels = setupPanels("ev", () =>
    saveJSON(PIN_KEY, panels.list.map((panel, i) => (panels.isPinned(panel) ? i : -1)).filter(i => i >= 0)));
  for (const i of loadJSON<number[]>(PIN_KEY) ?? []) {
    if (panels.list[i]) panels.setPinned(panels.list[i], true);
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initPage);
  else initPage();
}
