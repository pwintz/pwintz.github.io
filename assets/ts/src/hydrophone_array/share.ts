// ╭───────────────────────────────────────────────────────────────╮
// │            The tool's configuration in the page's address      │
// ╰───────────────────────────────────────────────────────────────╯
// Shared by the hydrophone array tool (../hydrophone_array.ts) and its tests.
// The address holds everything that the tool also saves in this browser, so a link opens the page
// as it was (but paused):
//   ?pattern=short&speed=250&dist=1200&n=5&spacing=400&layout=level&surface=300&floor=1000
//    &depth=600&echoes=both&rate=1&left=H1&right=H5&call=12.15&t=13.3&view=-0.6,0.35
//    &loop=1&ph=-800,0,0;-400,0,50;…
// `loop` appears only when looping is on, and `ph` (each hydrophone's x, y, z in meters) only when
// a hydrophone has been dragged; otherwise the hydrophones are placed from the settings.

export interface Phone { x: number; y: number; z: number; }

export interface SavedState {
  controls: Record<string, string>; // Control values, by element id
  loop    : boolean;
  speakers: { left: string; right: string }; // "off", "whale", or a hydrophone's index
  phones  : Phone[] | null; // Only when dragged; otherwise they're placed from the controls
  marked  : number;
  now     : number;
  view3d  : { yaw: number; pitch: number };
}

// Each control's parameter name and element id. Selects are checked against their options when
// restored; the other controls are sliders, which take only numbers.
const CONTROLS: { key: string; id: string; select: boolean }[] = [
  { key: "pattern", id: "wh-pattern",  select: true  },
  { key: "speed",   id: "wh-speed",    select: false },
  { key: "dist",    id: "wh-distance", select: false },
  { key: "n",       id: "wh-count",    select: false },
  { key: "spacing", id: "wh-spacing",  select: false },
  { key: "layout",  id: "wh-depths",   select: true  },
  { key: "surface", id: "wh-surface",  select: false },
  { key: "floor",   id: "wh-floor",    select: false },
  { key: "depth",   id: "wh-depth",    select: false },
  { key: "echoes",  id: "wh-echoes",   select: true  },
  { key: "rate",    id: "wh-rate",     select: true  },
];

export const SHARE_KEYS = [
  ...CONTROLS.map(c => c.key), "left", "right", "call", "t", "view", "loop", "ph",
] as const;

// A number with at most `digits` decimals and no trailing zeros, such as 12.15 or 400.
const num = (x: number, digits: number) => String(Number(x.toFixed(digits)));

const NUMBER = /^-?\d+(\.\d+)?$/;
const toNumber = (s: string | undefined) => (s !== undefined && NUMBER.test(s) ? Number(s) : null);
const numbers = (s: string | undefined) => s?.split(",").map(toNumber) ?? [];

// Speakers are written with the hydrophones' names (H1, H2, …) rather than their indices.
const listenerName = (value: string) => (/^\d+$/.test(value) ? `H${Number(value) + 1}` : value);
function listenerValue(name: string | undefined): string | undefined {
  if (name === "off" || name === "whale") return name;
  const match = /^H([1-9]\d*)$/i.exec(name ?? "");
  return match ? String(Number(match[1]) - 1) : undefined;
}

/** The query parameters (without "?") for this state. */
export function encodeState(s: SavedState): string[] {
  const parts = CONTROLS.filter(c => s.controls[c.id] !== undefined)
    .map(c => `${c.key}=${encodeURIComponent(s.controls[c.id])}`);
  parts.push(
    `left=${listenerName(s.speakers.left)}`,
    `right=${listenerName(s.speakers.right)}`,
    `call=${num(s.marked, 3)}`,
    `t=${num(s.now, 2)}`,
    `view=${num(s.view3d.yaw, 3)},${num(s.view3d.pitch, 3)}`,
  );
  if (s.loop) parts.push("loop=1");
  if (s.phones) parts.push(`ph=${s.phones.map(p => [p.x, p.y, p.z].map(v => num(v, 1)).join(",")).join(";")}`);
  return parts;
}

/**
 * The state in a query string, each part only if it is present and well formed, or null if the
 * query holds none of the tool's parameters. Parts that are left out get their default values.
 */
export function decodeState(search: string): Partial<SavedState> | null {
  const params = new Map<string, string>();
  for (const part of search.replace(/^\?/, "").split("&")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    try {
      params.set(decodeURIComponent(part.slice(0, i)), decodeURIComponent(part.slice(i + 1).replace(/\+/g, " ")));
    } catch { /* A malformed escape: skip this parameter */ }
  }
  if (!SHARE_KEYS.some(key => params.has(key))) return null;

  const out: Partial<SavedState> = { loop: params.get("loop") === "1", phones: null };
  const controls: Record<string, string> = {};
  for (const { key, id, select } of CONTROLS) {
    const value = params.get(key);
    if (value === undefined) continue;
    if (select ? /^[A-Za-z0-9.]+$/.test(value) : toNumber(value) !== null) controls[id] = value;
  }
  out.controls = controls;

  const left = listenerValue(params.get("left")), right = listenerValue(params.get("right"));
  out.speakers = { left: left ?? "off", right: right ?? "off" };

  const call = toNumber(params.get("call"));
  if (call !== null) out.marked = call;
  const t = toNumber(params.get("t"));
  if (t !== null) out.now = t;
  const [yaw, pitch] = numbers(params.get("view"));
  if (typeof yaw === "number" && typeof pitch === "number") out.view3d = { yaw, pitch };

  const phones = params.get("ph")?.split(";").map(numbers);
  if (phones?.length && phones.every(p => p.length === 3 && p.every(v => v !== null))) {
    out.phones = phones.map(([x, y, z]) => ({ x: x!, y: y!, z: z! }));
  }
  return out;
}
