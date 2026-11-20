// ╭───────────────────────────────────────────────────────────────╮
// │        Hanon exercises: keys, transposition, and rhythm        │
// ╰───────────────────────────────────────────────────────────────╯
// The music logic for ../hanon.ts (see there for an overview), with no drawing or audio code, so
// it can be tested.

import type { HanonExercise } from "../data/hanon_data";

// ╭────────────────────────────────────────╮
// │                  Keys                  │
// ╰────────────────────────────────────────╯

export interface ModeInfo {
  name       : string;     // In titles: "D Dorian", "E♭ harmonic minor"
  menu       : string;     // In the Mode menu, with common alternative names
  group      : string;     // Menu group
  scale      : number[];   // Semitones above the tonic for each scale degree
  descending?: number[];   // A different scale for the descending half (classical melodic minor)
  // The major key whose signature is used, as [letters, semitones] below the tonic. Church modes
  // use their parent major's signature (D Dorian: C major). Other scales use the tonic's major or
  // minor signature, by their third; accidentals cover the rest.
  parent     : [number, number];
  about?     : string;     // Short description naming the mode
  wiki?      : string;     // Wikipedia article about the mode
}

// Heptatonic scales from https://en.wikipedia.org/wiki/Category:Heptatonic_scales that have one
// note per letter, so Hanon's patterns map onto them degree by degree.
const AS_MAJOR: [number, number] = [0, 0];   // Tonic major's signature
const AS_MINOR: [number, number] = [5, 9];   // Tonic minor's signature (its relative major is a minor third up)
export const MODES = {
  // ⋘──────── Basic: the scales most pianists practice Hanon in ────────⋙
  "major"            : { name: "major",            menu: "Major",                    group: "Basic",          scale: [0, 2, 4, 5, 7, 9, 11], parent: [0, 0],
    about: "The major scale is the most common scale in Western music, with whole (W) and half (H) steps in the pattern W–W–H–W–W–W–H. Its bright, stable sound is the basis of most tonal music.",
    wiki: "https://en.wikipedia.org/wiki/Major_scale" },
  "natural-minor"    : { name: "natural minor",    menu: "Natural minor",            group: "Basic",          scale: [0, 2, 3, 5, 7, 8, 10], parent: [5, 9],
    about: "The natural minor scale lowers the third, sixth, and seventh degrees of the major scale. It has the same notes as its relative major, a minor third above, and is the same as the Aeolian mode.",
    wiki: "https://en.wikipedia.org/wiki/Minor_scale#Natural_minor_scale" },
  "harmonic-minor"   : { name: "harmonic minor",   menu: "Harmonic minor",           group: "Basic",          scale: [0, 2, 3, 5, 7, 8, 11], parent: AS_MINOR,
    about: "The harmonic minor scale is the natural minor scale with a raised seventh degree. The raised seventh is a leading tone that pulls up to the tonic, and it leaves an augmented second between the sixth and seventh degrees.",
    wiki: "https://en.wikipedia.org/wiki/Harmonic_minor_scale" },
  // ⋘──────── The seven modes of the major scale (Ionian and Aeolian repeat major and natural minor) ────────⋙
  "ionian"           : { name: "Ionian",           menu: "Ionian (Major)",           group: "Diatonic modes", scale: [0, 2, 4, 5, 7, 9, 11], parent: [0, 0],
    about: "The Ionian mode is the first mode of the major scale, with the same notes as the major scale.",
    wiki: "https://en.wikipedia.org/wiki/Ionian_mode" },
  "dorian"           : { name: "Dorian",           menu: "Dorian",                   group: "Diatonic modes", scale: [0, 2, 3, 5, 7, 9, 10], parent: [1, 2],
    about: "The Dorian mode is a minor mode with a major (raised) sixth. It is the second mode of the major scale and is common in jazz, folk, and rock.",
    wiki: "https://en.wikipedia.org/wiki/Dorian_mode" },
  "phrygian"         : { name: "Phrygian",         menu: "Phrygian",                 group: "Diatonic modes", scale: [0, 1, 3, 5, 7, 8, 10], parent: [2, 4],
    about: "The Phrygian mode is a minor mode with a lowered second. It is the third mode of the major scale; the half step above the tonic gives it a dark, Spanish-sounding color.",
    wiki: "https://en.wikipedia.org/wiki/Phrygian_mode" },
  "lydian"           : { name: "Lydian",           menu: "Lydian",                   group: "Diatonic modes", scale: [0, 2, 4, 6, 7, 9, 11], parent: [3, 5],
    about: "The Lydian mode is a major mode with a raised fourth. It is the fourth mode of the major scale and sounds bright and floating; it is often heard in film music.",
    wiki: "https://en.wikipedia.org/wiki/Lydian_mode" },
  "mixolydian"       : { name: "Mixolydian",       menu: "Mixolydian",               group: "Diatonic modes", scale: [0, 2, 4, 5, 7, 9, 10], parent: [4, 7],
    about: "The Mixolydian mode is a major mode with a lowered seventh. It is the fifth mode of the major scale and is common in blues, rock, and folk music.",
    wiki: "https://en.wikipedia.org/wiki/Mixolydian_mode" },
  "aeolian"          : { name: "Aeolian",          menu: "Aeolian (Minor)",          group: "Diatonic modes", scale: [0, 2, 3, 5, 7, 8, 10], parent: [5, 9],
    about: "The Aeolian mode is the sixth mode of the major scale, with the same notes as the natural minor scale.",
    wiki: "https://en.wikipedia.org/wiki/Aeolian_mode" },
  "locrian"          : { name: "Locrian",          menu: "Locrian",                  group: "Diatonic modes", scale: [0, 1, 3, 5, 6, 8, 10], parent: [6, 11],
    about: "The Locrian mode is the seventh mode of the major scale, with a lowered second and fifth. Its tonic chord is diminished, so it is rarely used as a home key.",
    wiki: "https://en.wikipedia.org/wiki/Locrian_mode" },
  // ⋘──────── Melodic minor, and modes of the jazz (ascending) melodic minor scale ────────⋙
  "melodic-minor"    : { name: "melodic minor",    menu: "Melodic minor (classical)", group: "Melodic minor modes", scale: [0, 2, 3, 5, 7, 9, 11], descending: [0, 2, 3, 5, 7, 8, 10], parent: AS_MINOR,
    about: "The classical melodic minor scale raises the sixth and seventh degrees going up and returns to the natural minor coming down, so this exercise uses the raised notes in its ascending half only.",
    wiki: "https://en.wikipedia.org/wiki/Minor_scale#Melodic_minor_scale" },
  "jazz-minor"       : { name: "jazz minor",       menu: "Jazz minor (melodic minor ascending)", group: "Melodic minor modes", scale: [0, 2, 3, 5, 7, 9, 11], parent: AS_MINOR,
    about: "The jazz minor scale is the ascending form of the melodic minor, used both ascending and descending: a minor scale with a major sixth and seventh. It and its modes are central to jazz harmony.",
    wiki: "https://en.wikipedia.org/wiki/Jazz_minor_scale" },
  "lydian-augmented" : { name: "Lydian augmented", menu: "Lydian augmented (mode 3)", group: "Melodic minor modes", scale: [0, 2, 4, 6, 8, 9, 11], parent: AS_MAJOR,
    about: "The Lydian augmented scale is the third mode of the jazz melodic minor scale: a major scale with a raised fourth and fifth.",
    wiki: "https://en.wikipedia.org/wiki/Lydian_augmented_scale" },
  "lydian-dominant"  : { name: "Lydian dominant",  menu: "Lydian dominant (acoustic, mode 4)", group: "Melodic minor modes", scale: [0, 2, 4, 6, 7, 9, 10], parent: AS_MAJOR,
    about: "The Lydian dominant scale, also called the acoustic or overtone scale, is the fourth mode of the jazz melodic minor scale: a major scale with a raised fourth and a lowered seventh.",
    wiki: "https://en.wikipedia.org/wiki/Acoustic_scale" },
  "half-diminished"  : { name: "half-diminished",  menu: "Half-diminished (Locrian ♮2, mode 6)", group: "Melodic minor modes", scale: [0, 2, 3, 5, 6, 8, 10], parent: AS_MINOR,
    about: "The half-diminished scale is the sixth mode of the jazz melodic minor scale: the Locrian mode with a natural second. It fits half-diminished (minor seven flat five) chords.",
    wiki: "https://en.wikipedia.org/wiki/Half_diminished_scale" },
  "altered"          : { name: "altered",          menu: "Altered (super-Locrian, mode 7)", group: "Melodic minor modes", scale: [0, 1, 3, 4, 6, 8, 10], parent: AS_MINOR,
    about: "The altered scale, also called the super-Locrian scale, is the seventh mode of the jazz melodic minor scale. It contains the common alterations of a dominant chord (♭9, ♯9, ♯11, ♭13) and is used over altered dominant chords in jazz.",
    wiki: "https://en.wikipedia.org/wiki/Altered_scale" },
  // ⋘──────── Scales with an augmented second, related to harmonic minor and major ────────⋙
  "phrygian-dominant": { name: "Phrygian dominant", menu: "Phrygian dominant (harmonic minor, mode 5)", group: "Harmonic scales", scale: [0, 1, 4, 5, 7, 8, 10], parent: AS_MAJOR,
    about: "The Phrygian dominant scale is the fifth mode of the harmonic minor scale: the Phrygian mode with a major third. It is common in flamenco, klezmer, and Middle Eastern music.",
    wiki: "https://en.wikipedia.org/wiki/Phrygian_dominant_scale" },
  "harmonic-major"   : { name: "harmonic major",   menu: "Harmonic major",           group: "Harmonic scales", scale: [0, 2, 4, 5, 7, 8, 11], parent: AS_MAJOR,
    about: "The harmonic major scale is a major scale with a lowered sixth, which creates an augmented second between the sixth and seventh degrees.",
    wiki: "https://en.wikipedia.org/wiki/Harmonic_major_scale" },
  "double-harmonic"  : { name: "double harmonic major", menu: "Double harmonic major (Byzantine)", group: "Harmonic scales", scale: [0, 1, 4, 5, 7, 8, 11], parent: AS_MAJOR,
    about: "The double harmonic major scale, also called the Byzantine scale, has two augmented seconds: between the second and third degrees and between the sixth and seventh.",
    wiki: "https://en.wikipedia.org/wiki/Double_harmonic_scale" },
  "hungarian-minor"  : { name: "Hungarian minor",  menu: "Hungarian minor (double harmonic, mode 4)", group: "Harmonic scales", scale: [0, 2, 3, 6, 7, 8, 11], parent: AS_MINOR,
    about: "The Hungarian minor scale is a harmonic minor scale with a raised fourth, giving it two augmented seconds. It is the fourth mode of the double harmonic scale.",
    wiki: "https://en.wikipedia.org/wiki/Hungarian_minor_scale" },
} satisfies Record<string, ModeInfo>;

export type Mode = keyof typeof MODES;

export interface Key {
  tonic : string;   // Letter plus optional "#" or "b", e.g. "F#", "Bb"
  mode  : Mode;
}

// The Key menu's choices, in keyboard order. Black keys (and B/C♭) have two spellings; the page
// shows a sharp/flat toggle for those.
export const ROOT_CHOICES = [["C"], ["C#", "Db"], ["D"], ["D#", "Eb"], ["E"], ["F"], ["F#", "Gb"], ["G"], ["G#", "Ab"], ["A"], ["A#", "Bb"], ["B", "Cb"]];
export const ROOTS = ROOT_CHOICES.flat();

// Major keys with a standard key signature (7 sharps to 7 flats).
const MAJOR_KEYS = ["C", "G", "D", "A", "E", "B", "F#", "C#", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];


const LETTERS          = "CDEFGAB";
const LETTER_SEMITONES = [0, 2, 4, 5, 7, 9, 11];   // Semitones above C for each natural letter

const ACCIDENTAL_TEXT: Record<number, string> = { [-2]: "bb", [-1]: "b", 0: "", 1: "#", 2: "##" };

// Semitones above C of a tonic like "F#" or "Bb".
function tonicSemitones(tonic: string): number {
  return LETTER_SEMITONES[LETTERS.indexOf(tonic[0])] + (tonic.includes("#") ? 1 : tonic.includes("b") ? -1 : 0);
}

// Wraps a semitone difference to -6..5, the range accidentals live in.
function wrapSemitones(semitones: number): number {
  return ((semitones % 12) + 18) % 12 - 6;
}

// The major key whose signature this key uses, e.g. "C" for D Dorian, or null if that key has
// no standard signature (e.g. G♯ major would need 8 sharps).
export function signatureKey(key: Key): string | null {
  const [letters, semitones] = MODES[key.mode].parent;
  const letter     = (LETTERS.indexOf(key.tonic[0]) - letters + 7) % 7;
  const accidental = wrapSemitones(tonicSemitones(key.tonic) - semitones - LETTER_SEMITONES[letter]);
  const name       = LETTERS[letter] + (ACCIDENTAL_TEXT[accidental] ?? "?");
  return MAJOR_KEYS.includes(name) ? name : null;
}

export function isAvailable(key: Key): boolean {
  return signatureKey(key) !== null;
}

// Number of sharps or flats in a key's signature (MAJOR_KEYS lists 0–7 sharps, then 1–7 flats).
export function signatureSize(key: Key): number {
  const index = MAJOR_KEYS.indexOf(signatureKey(key) ?? "");
  return index < 0 ? Infinity : index <= 7 ? index : index - 7;
}

// Shows "Bb" as "B♭", for labels.
export function prettyTonic(tonic: string): string {
  return tonic.replace("#", "♯").replace("b", "♭");   // The letter is uppercase, so "b" is always the flat
}

export function keyLabel(key: Key): string {
  return `${prettyTonic(key.tonic)} ${MODES[key.mode].name}`;
}

// An ASCII version of a key's name, for file names: "C-sharp major", "B-flat Dorian".
export function asciiKeyLabel(key: Key): string {
  const tonic = key.tonic.replace("#", "-sharp").replace(/^([A-G])b$/, "$1-flat");
  return `${tonic} ${MODES[key.mode].name}`;
}

// The mode's formula relative to the major scale, e.g. "1 2 ♭3 4 5 6 ♭7" for Dorian.
export function modeFormula(scale: number[]): string {
  const signs: Record<number, string> = { [-2]: "𝄫", [-1]: "♭", 0: "", 1: "♯", 2: "𝄪" };
  return scale.map((semitones, degree) => signs[semitones - MODES.major.scale[degree]] + (degree + 1)).join(" ");
}

// VexFlow's key-signature name: the major key with the same signature ("C" for D Dorian).
export function keySignatureSpec(key: Key): string {
  const name = signatureKey(key);
  if (!name) throw new Error(`${keyLabel(key)} has no standard key signature`);
  return name;
}

// ╭────────────────────────────────────────╮
// │        Parsing and transposition       │
// ╰────────────────────────────────────────╯

// A note or chord in C major, as written. Steps count diatonic steps: octave * 7 + letter (C=0).
interface WrittenEvent {
  steps    : number[];
  fingers  : (string | null)[];
  duration : "16" | "2";
}

// Parses the token format documented in data/hanon_data.ts ("C4/1", "E3+C4", "C3:2").
export function parseHand(text: string): WrittenEvent[] {
  return text.split(/\s+/).filter((token) => token && token !== "|").map((token) => {
    const [notes, duration = "16"] = token.split(":");
    const parts = notes.split("+").map((part) => {
      const match = part.match(/^([A-G])(\d)(?:\/(\d))?$/);
      if (!match) throw new Error(`Bad note token: ${token}`);
      return { step: Number(match[2]) * 7 + LETTERS.indexOf(match[1]), finger: match[3] ?? null };
    });
    return {
      steps    : parts.map((part) => part.step),
      fingers  : parts.map((part) => part.finger),
      duration : duration as "16" | "2",
    };
  });
}

export interface Transposer {
  // VexFlow key for a written step, e.g. "eb/4". `descending` selects a mode's descending form.
  vexKey(step: number, descending?: boolean): string;
  // The transposed diatonic step (for choosing clefs and spacing).
  shiftedStep(step: number): number;
}

export function makeTransposer(key: Key): Transposer {
  const mode        = MODES[key.mode] as ModeInfo;
  const tonicLetter = LETTERS.indexOf(key.tonic[0]);
  const tonic       = tonicSemitones(key.tonic);
  // Move up to C–F or down to G–B, so the exercise stays within about a fourth of where Hanon wrote it.
  const shift = tonicLetter <= 3 ? tonicLetter : tonicLetter - 7;

  return {
    shiftedStep: (step) => step + shift,
    vexKey(step, descending = false) {
      const scale   = descending && mode.descending ? mode.descending : mode.scale;
      const degree  = ((step % 7) + 7) % 7;   // Scale degree in C major (C = 0)
      const shifted = step + shift;
      const letter  = ((shifted % 7) + 7) % 7;
      const octave  = Math.floor(shifted / 7);
      // Accidental = how far the scale's pitch is from the natural letter.
      const offset  = wrapSemitones(tonic + scale[degree] - LETTER_SEMITONES[letter]);
      return `${LETTERS[letter].toLowerCase()}${ACCIDENTAL_TEXT[offset]}/${octave}`;
    },
  };
}

// ╭────────────────────────────────────────╮
// │        Rhythm and articulation         │
// ╰────────────────────────────────────────╯
// Hanon wrote every exercise in even sixteenths, four to a beat. A rhythm rewrites each beat's four
// notes, keeping 2/4 time (so a dotted pair is a dotted sixteenth and a thirty-second, and a triplet
// is three sixteenths in the time of an eighth). An articulation marks each measure's eight notes.

// How one note of a beat is written, and how long it lasts (in sixteenths).
interface BeatNote {
  duration : "8" | "16" | "32";
  dots     : number;
  triplet  : boolean;   // One of three triplet sixteenths
  length   : number;
}

const SIXTEENTH: BeatNote         = { duration: "16", dots: 0, triplet: false, length: 1 };
const DOTTED_SIXTEENTH: BeatNote  = { duration: "16", dots: 1, triplet: false, length: 1.5 };
const THIRTY_SECOND: BeatNote     = { duration: "32", dots: 0, triplet: false, length: 0.5 };
const TRIPLET_SIXTEENTH: BeatNote = { duration: "16", dots: 0, triplet: true,  length: 2 / 3 };
const EIGHTH: BeatNote            = { duration: "8",  dots: 0, triplet: false, length: 2 };

export const RHYTHMS = {
  "even"         : { menu: "Even sixteenths (as written)",       beat: [SIXTEENTH, SIXTEENTH, SIXTEENTH, SIXTEENTH] },
  "long-short"   : { menu: "Dotted (long–short)",                beat: [DOTTED_SIXTEENTH, THIRTY_SECOND, DOTTED_SIXTEENTH, THIRTY_SECOND] },
  "short-long"   : { menu: "Reverse dotted (short–long)",        beat: [THIRTY_SECOND, DOTTED_SIXTEENTH, THIRTY_SECOND, DOTTED_SIXTEENTH] },
  "triplet-long" : { menu: "Triplet + eighth (three quick, one long)", beat: [TRIPLET_SIXTEENTH, TRIPLET_SIXTEENTH, TRIPLET_SIXTEENTH, EIGHTH] },
  "long-triplet" : { menu: "Eighth + triplet (one long, three quick)", beat: [EIGHTH, TRIPLET_SIXTEENTH, TRIPLET_SIXTEENTH, TRIPLET_SIXTEENTH] },
} satisfies Record<string, { menu: string; beat: BeatNote[] }>;

export type Rhythm = keyof typeof RHYTHMS;

// Marks for each of a measure's eight notes: "." staccato, "(" and ")" the first and last notes
// under a slur, "-" a note inside a slur, " " unmarked. `byRhythm` adapts an articulation to a
// rhythm whose groups don't fit it (a slur over two notes would split a triplet).
interface ArticulationInfo {
  menu      : string;
  marks     : string;
  byRhythm? : Partial<Record<Rhythm, { menu: string; marks: string }>>;
}

export const ARTICULATIONS = {
  "legato"          : { menu: "Legato (as written)",       marks: "        " },
  "staccato"        : { menu: "Staccato",                  marks: "........" },
  "staccato-legato" : { menu: "Four staccato, four legato", marks: "....(--)" },
  "legato-staccato" : { menu: "Four legato, four staccato", marks: "(--)...." },
  "slurred-staccato": { menu: "Two slurred, two staccato",  marks: "()..().." , byRhythm: {
    "triplet-long" : { menu: "Triplet slurred, eighth staccato", marks: "(-).(-)." },
    "long-triplet" : { menu: "Eighth staccato, triplet slurred", marks: ".(-).(-)" },
  } },
} satisfies Record<string, ArticulationInfo>;

export type Articulation = keyof typeof ARTICULATIONS;

// An articulation's name and marks in the given rhythm.
export function articulationIn(articulation: Articulation, rhythm: Rhythm): { menu: string; marks: string } {
  const info: ArticulationInfo = ARTICULATIONS[articulation];
  return info.byRhythm?.[rhythm] ?? info;
}

// A note or chord as written and played in the chosen rhythm and articulation.
export interface StyledEvent extends WrittenEvent {
  beatNote : BeatNote | null;   // null for the final half note, which keeps its written value
  length   : number;            // In sixteenths
  staccato : boolean;
  slur     : "start" | "end" | null;
}

export function styleMeasures(measures: WrittenEvent[][], rhythm: Rhythm, articulation: Articulation): StyledEvent[][] {
  const beat  = RHYTHMS[rhythm].beat;
  const marks = articulationIn(articulation, rhythm).marks;
  return measures.map((measure) => measure.map((event, index) => {
    if (event.duration !== "16") return { ...event, beatNote: null, length: 8, staccato: false, slur: null };
    const mark = marks[index];
    return {
      ...event,
      beatNote : beat[index % 4],
      length   : beat[index % 4].length,
      staccato : mark === ".",
      slur     : mark === "(" ? "start" : mark === ")" ? "end" : null,
    };
  }));
}

// ╭────────────────────────────────────────╮
// │                 Layout                 │
// ╰────────────────────────────────────────╯

export type Clef = "treble" | "bass";

export const STEP_MIDDLE_C = 4 * 7;   // C4 in diatonic steps

// Splits a hand into measures of 2/4 time (8 sixteenths, or one half note).
export function toMeasures(events: WrittenEvent[]): WrittenEvent[][] {
  const measures: WrittenEvent[][] = [];
  let current: WrittenEvent[] = [];
  let ticks = 0;
  for (const event of events) {
    current.push(event);
    ticks += event.duration === "2" ? 8 : 1;
    if (ticks % 8 === 0) {
      measures.push(current);
      current = [];
    }
  }
  return measures;
}

// The bottom and top lines of each staff, in diatonic steps.
export const STAFF_LINES: Record<Clef, { bottom: number; top: number }> = {
  treble: { bottom: STEP_MIDDLE_C + 2, top: STEP_MIDDLE_C + 10 },   // E4 to F5
  bass  : { bottom: STEP_MIDDLE_C - 10, top: STEP_MIDDLE_C - 2 },   // G2 to A3
};

// Number of ledger lines a note needs on a staff.
export function ledgerLines(step: number, clef: Clef): number {
  const { bottom, top } = STAFF_LINES[clef];
  if (step < bottom) return Math.floor((bottom - step) / 2);
  if (step > top)    return Math.floor((step - top) / 2);
  return 0;
}

// Picks the clef for one staff of one line. Each hand keeps its usual clef (treble for the right,
// bass for the left) unless the other clef needs at least a third fewer ledger lines. (The right
// hand starts an octave below middle C, so it often begins in the bass clef.)
export function chooseClef(measures: WrittenEvent[][], transposer: Transposer, isRightHand: boolean): Clef {
  const steps = measures.flat().flatMap((event) => event.steps.map(transposer.shiftedStep));
  const cost  = (clef: Clef) => steps.reduce((sum, step) => sum + ledgerLines(step, clef), 0);
  const usual = isRightHand ? "treble" : "bass";
  const other = isRightHand ? "bass" : "treble";
  return cost(other) < cost(usual) * 2 / 3 ? other : usual;
}

// Which side of the note a fingering goes on: away from the staff for notes above or below it,
// otherwise the hand's usual side (above for the right hand, below for the left).
export function fingeringAbove(step: number, clef: Clef, isRightHand: boolean): boolean {
  const { bottom, top } = STAFF_LINES[clef];
  if (step < bottom) return false;
  if (step > top)    return true;
  return isRightHand;
}

// Which measures to show. Abbreviated shows the first two (the pattern and how it moves), the two
// around the turn (where the direction changes), and the last two (the repeat and the final note).
export function visibleMeasures(exercise: HanonExercise, total: number, abbreviate: boolean): number[] {
  if (!abbreviate) return [...Array(total).keys()];
  const wanted = [0, 1, exercise.turn - 1, exercise.turn, total - 2, total - 1];
  return [...new Set(wanted)].filter((index) => index >= 0 && index < total).sort((a, b) => a - b);
}

// ╭────────────────────────────────────────╮
// │                Playback                │
// ╰────────────────────────────────────────╯

// Staccato notes sound for this fraction of their written length.
const STACCATO_LENGTH = 0.4;

interface PlayedNote  { midi: number; start: number; duration: number }   // Times in sixteenths (fractional for dotted and triplet rhythms)
export interface PlayedEvent { start: number; measure: number; event: number }   // For highlighting

// MIDI note number of a VexFlow key like "eb/4" (middle C = 60).
export function midiOf(vexKey: string): number {
  const match = vexKey.match(/^([a-g])(#{1,2}|b{1,2})?\/(-?\d+)$/);
  if (!match) throw new Error(`Bad key: ${vexKey}`);
  const accidental = !match[2] ? 0 : match[2][0] === "#" ? match[2].length : -match[2].length;
  return 12 * (Number(match[3]) + 1) + LETTER_SEMITONES[LETTERS.indexOf(match[1].toUpperCase())] + accidental;
}

// Every note of the whole exercise (playback ignores Abbreviate), and when each event starts.
export function buildPerformance(
  exercise: HanonExercise, key: Key, rhythm: Rhythm, articulation: Articulation,
): { notes: PlayedNote[]; events: PlayedEvent[]; length: number } {
  const transposer = makeTransposer(key);
  const notes: PlayedNote[] = [];
  const events: PlayedEvent[] = [];
  let length = 0;
  for (const hand of [exercise.rightHand, exercise.leftHand]) {
    styleMeasures(toMeasures(parseHand(hand)), rhythm, articulation).forEach((measure, measureIndex) => {
      const descending = measureIndex >= exercise.turn;
      let time = measureIndex * 8;   // Counting from each measure's start keeps triplets from drifting
      measure.forEach((styled, event) => {
        const duration = styled.staccato ? styled.length * STACCATO_LENGTH : styled.length;
        for (const step of styled.steps) {
          notes.push({ midi: midiOf(transposer.vexKey(step, descending)), start: time, duration });
        }
        if (hand === exercise.rightHand) events.push({ start: time, measure: measureIndex, event });
        time += styled.length;
      });
      length = Math.max(length, time);
    });
  }
  return { notes, events, length };
}
