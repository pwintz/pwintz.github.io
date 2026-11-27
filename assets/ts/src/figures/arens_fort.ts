// ╭───────────────────────────────────────────────────────────────╮
// │                    The Arens–Fort space ℕ²                      │
// ╰───────────────────────────────────────────────────────────────╯
// The points (m, n) with m, n from 0 to 7 (the rest go on up and to the right), with the columns
// X_m. A menu chooses a set: its points are filled, and the points it misses are hollow. When the
// set contains (0, 0), each column that it misses infinitely many points of is shaded orange.

import { OKABE_ITO } from "../common/scene3d";
import { ARENS_FORT_SETS } from "./arens_fort_sets";
import { Widget, addSelect } from "./widget";

const SIZE = 8;
const IN = OKABE_ITO.blue;
const OUT = "rgba(90, 110, 140, 0.75)";
const BAND = "rgba(213, 94, 0, 0.16)";
const BAND_EDGE = "rgba(213, 94, 0, 0.7)";
const sub = (k: number) => String(k).replace(/\d/g, d => "₀₁₂₃₄₅₆₇₈₉"[+d]);

export const arensFort: Widget = env => {
  let key = "open";
  addSelect(env, "Set", Object.entries(ARENS_FORT_SETS).map(([k, v]): [string, string] => [k, v.menu]), key, v => { key = v; });

  return () => {
    const s = env.scene;
    const set = ARENS_FORT_SETS[key];
    // Room around the lattice for the column names below it and the dots beyond it.
    s.begin(env.canvas, { dim: 2, yaw: 0, pitch: 0, perspective: false, center: [(SIZE - 1) / 2 + 0.25, (SIZE - 1) / 2 + 0.1, 0], extent: SIZE / 2 + 0.6 });
    const ctx = s.ctx;
    const hasOrigin = set.has(0, 0);
    for (let m = 0; m < SIZE; m++) {
      const [x0, yTop] = s.project([m - 0.38, SIZE - 0.45, 0]), [x1, yBottom] = s.project([m + 0.38, -0.45, 0]);
      const flagged = hasOrigin && set.missesInfinitely(m);
      ctx.beginPath();
      ctx.roundRect(x0, yTop, x1 - x0, yBottom - yTop, 6);
      ctx.fillStyle = flagged ? BAND : "rgba(90, 110, 140, 0.07)";
      ctx.fill();
      if (flagged) {
        ctx.strokeStyle = BAND_EDGE;
        ctx.lineWidth = 1.25;
        ctx.stroke();
      }
      const [lx, ly] = s.project([m, -0.85, 0]);
      ctx.textBaseline = "middle";
      s.haloText(`X${sub(m)}`, lx, ly, flagged ? OKABE_ITO.vermillion : "#5f6368", `italic ${s.px(14)}px serif`);
      // The column goes on upward.
      const [tx, ty] = s.project([m, SIZE - 0.05, 0]);
      s.haloText("⋮", tx, ty, "#5f6368", `${s.px(14)}px serif`);
    }
    // The columns go on to the right.
    const [rx, ry] = s.project([SIZE - 0.1, (SIZE - 1) / 2, 0]);
    s.haloText("⋯", rx, ry, "#5f6368", `${s.px(18)}px serif`);
    ctx.textBaseline = "alphabetic";

    const r = Math.max(3, Math.min(7, s.pxPerUnit * 0.17));
    for (let m = 0; m < SIZE; m++) {
      for (let n = 0; n < SIZE; n++) {
        const [x, y] = s.project([m, n, 0]);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        if (set.has(m, n)) {
          ctx.fillStyle = IN;
          ctx.fill();
        } else {
          ctx.fillStyle = "#fff";
          ctx.fill();
          ctx.strokeStyle = OUT;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }
    // The point (0, 0), which the definition of the open sets singles out.
    const [ox, oy] = s.project([0, 0, 0]);
    ctx.beginPath();
    ctx.arc(ox, oy, r + 4, 0, 2 * Math.PI);
    ctx.strokeStyle = OKABE_ITO.vermillion;
    ctx.lineWidth = 2;
    ctx.stroke();
    s.finish();
    env.readout.innerHTML = set.says;
  };
};
