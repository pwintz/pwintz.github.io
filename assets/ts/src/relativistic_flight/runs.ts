// ╭───────────────────────────────────────────────────────────────╮
// │     Relativistic Flight: recorded runs and their ghosts        │
// ╰───────────────────────────────────────────────────────────────╯
// Best runs and their ghost recordings for ../relativistic_flight.ts, with no storage access, so
// they can be tested.

/** Number of best runs kept for each combination of settings, each replayed as a ghost. */
export const MAX_BEST_RUNS = 5;

/** A sample of a recorded run, for replaying it as a ghost. */
export interface GhostSample {
  t: number;
  x: number;
  y: number;
  h: number;
  vx: number;
  vy: number;
  tau: number;
}

export interface Run {
  /** Identifies the run's ghost recording in storage. */
  id?: string;
  t: number;
  tau: number;
  samples: GhostSample[];
}

// A run's ghost recording is stored under its own key, next to its list's key.
export const GHOST_SEPARATOR = "~ghost~";

export function ghostKey(listKey: string, id: string): string {
  return `${listKey}${GHOST_SEPARATOR}${id}`;
}

/** A ghost recording stored as columns of rounded numbers, which is several times smaller than a
 *  list of objects. */
export interface StoredGhost {
  t: number[];
  x: number[];
  y: number[];
  h: number[];
  vx: number[];
  vy: number[];
  tau: number[];
}

export function encodeGhost(samples: GhostSample[]): StoredGhost {
  const column = (get: (q: GhostSample) => number, digits: number) =>
    samples.map(q => Math.round(get(q) * 10 ** digits) / 10 ** digits);
  return {
    t: column(q => q.t, 3), x: column(q => q.x, 1), y: column(q => q.y, 1), h: column(q => q.h, 3),
    vx: column(q => q.vx, 1), vy: column(q => q.vy, 1), tau: column(q => q.tau, 3),
  };
}

export function decodeGhost(stored: StoredGhost | null): GhostSample[] {
  if (!stored || !Array.isArray(stored.t)) return [];
  return stored.t.map((t, i) => ({
    t, x: stored.x[i], y: stored.y[i], h: stored.h[i], vx: stored.vx[i], vy: stored.vy[i], tau: stored.tau[i],
  }));
}

/** Adds a run to the list of best runs, keeping the fastest MAX_BEST_RUNS. Returns the run's rank
 *  (1 for the fastest), or 0 if it is too slow to make the list. */
export function insertRun(runs: Run[], run: Run, max = MAX_BEST_RUNS): number {
  const rank = runs.filter(r => r.t <= run.t).length + 1;
  if (rank > max) return 0;
  runs.splice(rank - 1, 0, run);
  runs.length = Math.min(runs.length, max);
  return rank;
}

/** The state of a recorded run at rest-frame time t. Before the start and after the finish, the
 *  ghost waits at rest at its first and last positions. */
export function sampleRunAt(samples: GhostSample[], t: number): GhostSample {
  if (t <= samples[0].t) return { ...samples[0], t, vx: 0, vy: 0 };
  const last = samples[samples.length - 1];
  if (t >= last.t) return { ...last, t, vx: 0, vy: 0 };
  let lo = 0;
  let hi = samples.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (samples[mid].t <= t) lo = mid;
    else hi = mid;
  }
  const a = samples[lo];
  const b = samples[hi];
  const f = (t - a.t) / (b.t - a.t);
  const mix = (p: number, q: number) => p + f * (q - p);
  let dh = b.h - a.h;
  dh -= 2 * Math.PI * Math.round(dh / (2 * Math.PI));
  return { t, x: mix(a.x, b.x), y: mix(a.y, b.y), h: a.h + f * dh, vx: mix(a.vx, b.vx), vy: mix(a.vy, b.vy), tau: mix(a.tau, b.tau) };
}
