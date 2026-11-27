// ╭───────────────────────────────────────────────────────────────╮
// │              Some subsets of the Arens–Fort space               │
// ╰───────────────────────────────────────────────────────────────╯
// The Arens–Fort space is ℕ² = {(m, n) : m, n = 0, 1, 2, …}, whose columns are the sets
// X_m = {m} × ℕ. A set U is open if (0, 0) ∉ U, or if (0, 0) ∈ U and U misses only finitely many
// points of X_m for all m outside some finite set M. Each set here is given by a rule for all of
// ℕ², so the figure can draw any part of it, and says which columns it misses infinitely often.

export interface ArensFortSet {
  /** The name in the figure's menu. */
  menu: string;
  has(m: number, n: number): boolean;
  /** Whether the set misses infinitely many points of the column X_m. */
  missesInfinitely(m: number): boolean;
  /** Whether the set is open (from the definition, given the two functions above). */
  open: boolean;
  /** The readout, in HTML. */
  says: string;
}

const X = (m: number | string) => `<i>X</i><sub>${m}</sub>`;
const ORIGIN = "(0, 0)";

// The finitely many points that the first set misses outside the column X₂.
const MISSED = new Set(["0,3", "1,1", "1,5", "3,2", "4,0", "5,4", "6,1", "6,2"]);

export const ARENS_FORT_SETS: Record<string, ArensFortSet> = {
  open: {
    menu: "An open set U that contains (0, 0)",
    has: (m, n) => m !== 2 && !MISSED.has(`${m},${n}`),
    missesInfinitely: m => m === 2,
    open: true,
    says: `<i>U</i> contains ${ORIGIN}. It misses every point of ${X(2)}, and only finitely many points of every other column ` +
      `(none beyond ${X(6)}), so <i>U</i> is open, with <i>M</i> = {2}.`,
  },
  away: {
    menu: "An open set U that does not contain (0, 0)",
    has: (m, n) => m === 3 || ["1,2", "4,4", "5,1", "6,5"].includes(`${m},${n}`),
    missesInfinitely: m => m !== 3,
    open: true,
    says: `<i>U</i> does not contain ${ORIGIN}, so <i>U</i> is open, by the first condition, ` +
      `even though it misses infinitely many points of every column except ${X(3)}. ` +
      `In particular, every set {(<i>m</i>, <i>n</i>)} other than {${ORIGIN}} is open.`,
  },
  column: {
    menu: "The column X₀, which is not open",
    has: m => m === 0,
    missesInfinitely: m => m !== 0,
    open: false,
    says: `${X(0)} contains ${ORIGIN}, but it misses every point of ${X(1)}, ${X(2)}, ${X(3)}, …. ` +
      `Infinitely many columns can't fit in a finite set <i>M</i>, so ${X(0)} is not open.`,
  },
  diagonal: {
    menu: "V = X ∖ {(1, 1), (2, 2), (3, 3), …}",
    has: (m, n) => m === 0 || m !== n,
    missesInfinitely: () => false,
    open: true,
    says: `<i>V</i> contains ${ORIGIN} and misses exactly one point (<i>m</i>, <i>m</i>) of each column ${X("<i>m</i>")} with <i>m</i> ≥ 1, ` +
      `so <i>V</i> is open, with <i>M</i> = ∅. (The proof that the space is not first countable uses a set like <i>V</i>.)`,
  },
};
