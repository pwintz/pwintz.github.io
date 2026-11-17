// ╭───────────────────────────────────────────────────────────────╮
// │        Stable roommates: Irving's algorithm (1985)            │
// ╰───────────────────────────────────────────────────────────────╯
// Decides whether people with preferences over each other can be paired so that no two people
// would both rather be with each other than with their partners, and finds such a pairing if one
// exists. Used by stable_pairing.ts.
//
// Preferences come from an attraction matrix: person i prefers j to k if a[i][j] > a[i][k]. Ties
// are broken by index, so a pairing found is stable for the original (tied) preferences too, but
// with ties, "no stable pairing" means none for the tie-broken preferences.
//
// The algorithm has two phases:
//   1. Proposals: each person proposes to people in order of preference; each person holds the
//      best proposal so far and rejects the rest. Then each person y holding a proposal from x
//      drops everyone they like less than x (and is dropped from those people's lists).
//   2. Rotations: while some list has two or more people, find a rotation (x₀, x₁, …), where
//      x_{i+1} is the last choice of the second choice of x_i, and eliminate it: each second
//      choice z_i of x_i drops everyone they like less than x_i.
// People who are rejected by everyone they find acceptable in phase 1 stay single (every stable
// pairing leaves the same people single). If another list becomes empty, no stable pairing
// exists; if every other list has one person, the lists are a stable pairing.
//
// i and j are acceptable to each other if canPair(i, j) and both attractions are positive.

/** Returns each person's partner in a stable pairing (−1 for someone left single), or null if no
 *  stable pairing exists. */
export function stablePairing(a: number[][], canPair: (i: number, j: number) => boolean): number[] | null {
  const n = a.length;
  const pref: number[][] = [];
  const rank: number[][] = [];
  const alive: boolean[][] = [];
  for (let i = 0; i < n; i++) {
    const others = [...Array(n).keys()].filter(j => j !== i && canPair(i, j) && a[i][j] > 0 && a[j][i] > 0);
    others.sort((j, k) => a[i][k] - a[i][j] || j - k);
    pref.push(others);
    rank.push(Array(n).fill(Infinity));
    others.forEach((j, r) => { rank[i][j] = r; });
    alive.push(Array.from({ length: n }, (_, j) => others.includes(j)));
  }
  const remove = (i: number, j: number) => { alive[i][j] = false; alive[j][i] = false; };
  const list = (i: number) => pref[i].filter(j => alive[i][j]);

  // ── Phase 1: proposals ──
  const held = Array<number>(n).fill(-1); // held[y]: who y is holding a proposal from
  const next = Array<number>(n).fill(0);  // next[x]: index in pref[x] of x's next proposal
  const free = [...Array(n).keys()];
  while (free.length) {
    const x = free.pop()!;
    while (next[x] < pref[x].length) {
      const y = pref[x][next[x]];
      const h = held[y];
      if (h === -1 || rank[y][x] < rank[y][h]) {
        held[y] = x;
        if (h !== -1) { next[h]++; free.push(h); }
        break;
      }
      next[x]++;
    }
    // A person rejected by everyone acceptable stays single.
  }
  for (let y = 0; y < n; y++) {
    const x = held[y];
    if (x === -1) continue;
    for (const w of pref[y]) if (rank[y][w] > rank[y][x]) remove(y, w);
  }
  const single = [...Array(n).keys()].map(i => list(i).length === 0);
  const emptied = () => [...Array(n).keys()].some(i => !single[i] && list(i).length === 0);
  if (emptied()) return null;

  // ── Phase 2: rotations ──
  for (;;) {
    const p0 = [...Array(n).keys()].find(i => list(i).length >= 2);
    if (p0 === undefined) break;
    const xs = [p0];
    const zs: number[] = [];
    const seen = new Map<number, number>([[p0, 0]]);
    let start = 0;
    for (;;) {
      const lx = list(xs[xs.length - 1]);
      if (lx.length < 2) return null;
      const z = lx[1];
      zs.push(z);
      const lz = list(z);
      const x = lz[lz.length - 1];
      const at = seen.get(x);
      if (at !== undefined) { start = at; break; }
      seen.set(x, xs.length);
      xs.push(x);
    }
    // Collect the removals first, since the rotation's people can overlap.
    const removals: [number, number][] = [];
    for (let k = start; k < xs.length; k++) {
      const x = xs[k], z = zs[k];
      for (const w of list(z)) if (rank[z][w] > rank[z][x]) removals.push([z, w]);
    }
    removals.forEach(([i, j]) => remove(i, j));
    if (emptied()) return null;
  }
  const partner = [...Array(n).keys()].map(i => (single[i] ? -1 : list(i)[0]));
  return partner.every((j, i) => j === -1 || partner[j] === i) ? partner : null;
}
