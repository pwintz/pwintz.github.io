// ╭───────────────────────────────────────────────────────────────╮
// │                Finding where each note starts and ends               │
// ╰───────────────────────────────────────────────────────────────╯
// The audio is measured in short steps ("hops", about 5 ms apart). A note starts when the level
// rises well above the background noise, and ends when it falls back for a moment, or when the
// pitch moves to a different note without a break (legato).

export interface Hop {
  t      : number; // Time of the middle of the analyzed audio (s)
  level  : number; // RMS level, in dB relative to a full-scale sine
  freq   : number; // Pitch (Hz), or 0 if there's no clear pitch
  midi   : number; // Pitch as a MIDI note number, or NaN
  clarity: number; // How periodic the sound is, from 0 to 1
}

// The hops of the last several seconds, numbered from when listening began.
export class HopLog {
  private hops: Hop[] = [];
  first = 0; // Number of the oldest hop kept

  constructor(private readonly keep: number) {}

  get end(): number { return this.first + this.hops.length; } // Number of the next hop
  get(i: number): Hop { return this.hops[i - this.first]; }
  has(i: number): boolean { return i >= this.first && i < this.end; }

  push(hop: Hop): void {
    this.hops.push(hop);
    // Dropped in batches, which is cheaper than one at a time.
    if (this.hops.length > this.keep * 1.25) {
      const drop = this.hops.length - this.keep;
      this.hops.splice(0, drop);
      this.first += drop;
    }
  }

  slice(start: number, end: number): Hop[] {
    return this.hops.slice(Math.max(0, start - this.first), Math.max(0, end - this.first));
  }
}

export interface NoteSpan {
  start      : number;  // Number of the note's first hop
  end        : number;  // Number of the hop after its last
  legatoStart: boolean; // Whether the note began by changing pitch from the previous note
  legatoEnd  : boolean; // Whether it ended by changing pitch to the next note
  floor      : number;  // Level of the background noise (dB)
}

export interface SegmenterSettings {
  onsetDb: number; // How far above the background noise a note must rise (dB)
}

const FLOOR_RISE_SECONDS = 2;    // Time constant of the noise level rising to follow louder noise
const FLOOR_MIN          = -100; // dB
const MIN_ONSET_LEVEL    = -70;  // A note must be at least this loud (dB)
const ONSET_LOOKBACK     = 0.06; // How far back the start of a note is looked for (s)
const ONSET_ABOVE_FLOOR  = 6;    // The note starts where the level first rose this far above the noise (dB)
const RELEASE_HYSTERESIS = 6;    // A note ends this much below the level that starts one (dB)
const RELEASE_BELOW_PEAK = 40;   // …or this far below its loudest moment (dB)
const END_HOLD           = 0.08; // The level must stay low this long for the note to end (s)
const LEGATO_CENTS       = 80;   // A change of pitch this large, without a break, starts a new note
const LEGATO_HOLD        = 0.06; // …if it lasts this long (s)
const LEGATO_SETTLE      = 0.15; // The note's pitch is measured after this long (s)
const LEGATO_MIN_NOTE    = 0.3;  // A change of pitch sooner than this after a note starts is a scoop into it, not a new note (s)
const PITCH_FOLLOW       = 0.02; // How quickly the note's pitch follows a slow drift (per hop)
const CLEAR              = 0.85; // Hops at least this clear are used to follow the pitch
const MAX_NOTE_SECONDS   = 20;

export class Segmenter {
  floor = NaN;      // Level of the background noise (dB)
  fixedFloor: number | null = null; // The noise level from a calibration, used instead of following the noise
  inNote = false;
  noteStart = 0;    // Number of the current note's first hop
  private peak = -Infinity;
  private belowSince = -1;  // Hop where the level dropped below the release level, or −1
  private pitchRef = NaN;   // The current note's pitch (MIDI)
  private devSince = -1;    // Hop where the pitch moved away from the note's, or −1
  legatoStart = false;      // Whether the current note began by changing pitch from the previous note

  constructor(private readonly log: HopLog, private readonly settings: SegmenterSettings) {}

  get onsetLevel(): number { return Math.max(this.floor + this.settings.onsetDb, MIN_ONSET_LEVEL); }
  get releaseLevel(): number { return Math.max(this.onsetLevel - RELEASE_HYSTERESIS, this.peak - RELEASE_BELOW_PEAK); }

  reset(): void {
    this.inNote = false;
    this.belowSince = this.devSince = -1;
  }

  // Takes the newest hop (number `i`) into account and returns the note that it ends, if any.
  update(i: number): NoteSpan | null {
    const hop = this.log.get(i);
    if (!this.inNote) {
      this.followFloor(i);
      if (hop.level > this.onsetLevel) this.begin(this.findOnset(i), false);
      return null;
    }

    const start = this.log.get(this.noteStart);
    this.peak = Math.max(this.peak, hop.level);

    // The note ends once the level stays low for END_HOLD. The quiet hops are kept in the note,
    // since they show how it faded away.
    if (hop.level < this.releaseLevel) {
      if (this.belowSince < 0) this.belowSince = i;
      if (hop.t - this.log.get(this.belowSince).t >= END_HOLD) return this.finish(i + 1, false);
    } else {
      this.belowSince = -1;
    }

    // A clear change of pitch that lasts LEGATO_HOLD ends the note and starts the next one.
    if (hop.clarity >= CLEAR && Number.isFinite(hop.midi)) {
      if (Number.isNaN(this.pitchRef)) {
        if (hop.t - start.t >= LEGATO_SETTLE) this.pitchRef = this.notePitch(i);
      } else if (Math.abs(hop.midi - this.pitchRef) * 100 > LEGATO_CENTS) {
        if (this.devSince < 0) this.devSince = i;
        if (hop.t - this.log.get(this.devSince).t >= LEGATO_HOLD) {
          const next = this.devSince;
          if (this.log.get(next).t - start.t < LEGATO_MIN_NOTE) {
            // A scoop (or slide) into the note: it carries on at its new pitch.
            this.pitchRef = hop.midi;
            this.devSince = -1;
          } else {
            const span = this.finish(next, true);
            this.begin(next, true);
            return span;
          }
        }
      } else {
        this.devSince = -1;
        this.pitchRef += (hop.midi - this.pitchRef) * PITCH_FOLLOW;
      }
    }

    if (hop.t - start.t > MAX_NOTE_SECONDS) return this.finish(i + 1, false);
    return null;
  }

  // In silence, the noise level falls at once to a quieter level and rises slowly toward a louder one.
  private followFloor(i: number): void {
    const hop = this.log.get(i);
    const level = Math.max(FLOOR_MIN, hop.level);
    if (this.fixedFloor !== null) {
      this.floor = this.fixedFloor;
    } else if (Number.isNaN(this.floor) || level < this.floor) {
      this.floor = level;
    } else if (this.log.has(i - 1)) {
      const dt = hop.t - this.log.get(i - 1).t;
      this.floor += (level - this.floor) * Math.min(1, dt / FLOOR_RISE_SECONDS);
    }
  }

  // The level crosses the onset level partway up its rise, so the note's start is traced back to
  // where the level first rose above the noise.
  private findOnset(i: number): number {
    const t = this.log.get(i).t;
    let s = i;
    while (this.log.has(s - 1) && t - this.log.get(s - 1).t <= ONSET_LOOKBACK
      && this.log.get(s - 1).level > this.floor + ONSET_ABOVE_FLOOR) s--;
    return s;
  }

  private begin(start: number, legato: boolean): void {
    this.inNote = true;
    this.noteStart = start;
    this.legatoStart = legato;
    this.peak = -Infinity;
    for (let j = start; j < this.log.end; j++) this.peak = Math.max(this.peak, this.log.get(j).level);
    this.belowSince = this.devSince = -1;
    this.pitchRef = NaN;
  }

  private finish(end: number, legatoEnd: boolean): NoteSpan {
    this.inNote = false;
    return { start: this.noteStart, end, legatoStart: this.legatoStart, legatoEnd, floor: this.floor };
  }

  // Median pitch of the clear hops of the current note so far, after its first moments.
  private notePitch(i: number): number {
    const t0 = this.log.get(this.noteStart).t + LEGATO_SETTLE / 2;
    const pitches: number[] = [];
    for (let j = this.noteStart; j <= i; j++) {
      const h = this.log.get(j);
      if (h.t >= t0 && h.clarity >= CLEAR && Number.isFinite(h.midi)) pitches.push(h.midi);
    }
    if (!pitches.length) return NaN;
    pitches.sort((a, b) => a - b);
    return pitches[pitches.length >> 1];
  }
}
