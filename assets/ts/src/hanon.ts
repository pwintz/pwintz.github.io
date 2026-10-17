// ╭───────────────────────────────────────────────────────────────╮
// │           Hanon piano exercises, rendered in any key          │
// ╰───────────────────────────────────────────────────────────────╯
// Takes Hanon's exercises (written in C major, see data/hanon_data.ts), transposes them diatonically
// to the chosen key, and engraves them as a grand staff with VexFlow.
//
// "Diatonically" means each note keeps its scale degree: C major's C D E F G A B becomes, e.g.,
// E♭ F G A♭ B♭ C D in E♭ major, so every pattern stays within the new key's scale.

import VexFlow, {
  Accidental, Barline, Beam, Formatter, Fraction, FretHandFinger, Modifier,
  Renderer, Stave, StaveConnector, StaveNote, SVGContext, Voice,
} from "vexflow/bravura";
export { HANON_EXERCISES };
import { HANON_EXERCISES, HanonExercise } from "./data/hanon_data";
import { HANON_TEXT } from "./data/hanon_text";

// ╭────────────────────────────────────────╮
// │                  Keys                  │
// ╰────────────────────────────────────────╯

interface ModeInfo {
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

type Mode = keyof typeof MODES;

interface Key {
  tonic : string;   // Letter plus optional "#" or "b", e.g. "F#", "Bb"
  mode  : Mode;
}

// The Key menu's choices, in keyboard order. Black keys (and B/C♭) have two spellings; the page
// shows a sharp/flat toggle for those.
const ROOT_CHOICES = [["C"], ["C#", "Db"], ["D"], ["D#", "Eb"], ["E"], ["F"], ["F#", "Gb"], ["G"], ["G#", "Ab"], ["A"], ["A#", "Bb"], ["B", "Cb"]];
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

function isAvailable(key: Key): boolean {
  return signatureKey(key) !== null;
}

// Number of sharps or flats in a key's signature (MAJOR_KEYS lists 0–7 sharps, then 1–7 flats).
function signatureSize(key: Key): number {
  const index = MAJOR_KEYS.indexOf(signatureKey(key) ?? "");
  return index < 0 ? Infinity : index <= 7 ? index : index - 7;
}

// Shows "Bb" as "B♭", for labels.
function prettyTonic(tonic: string): string {
  return tonic.replace("#", "♯").replace("b", "♭");   // The letter is uppercase, so "b" is always the flat
}

function keyLabel(key: Key): string {
  return `${prettyTonic(key.tonic)} ${MODES[key.mode].name}`;
}

// An ASCII version of a key's name, for file names: "C-sharp major", "B-flat Dorian".
function asciiKeyLabel(key: Key): string {
  const tonic = key.tonic.replace("#", "-sharp").replace(/^([A-G])b$/, "$1-flat");
  return `${tonic} ${MODES[key.mode].name}`;
}

// The mode's formula relative to the major scale, e.g. "1 2 ♭3 4 5 6 ♭7" for Dorian.
function modeFormula(scale: number[]): string {
  const signs: Record<number, string> = { [-2]: "𝄫", [-1]: "♭", 0: "", 1: "♯", 2: "𝄪" };
  return scale.map((semitones, degree) => signs[semitones - MODES.major.scale[degree]] + (degree + 1)).join(" ");
}

// VexFlow's key-signature name: the major key with the same signature ("C" for D Dorian).
function keySignatureSpec(key: Key): string {
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

interface Transposer {
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
// │               Engraving                │
// ╰────────────────────────────────────────╯

type Clef = "treble" | "bass";

interface RenderOptions {
  exercise      : HanonExercise;
  key           : Key;
  showFingering : boolean;
  zoom          : number;    // 1 = full size
  abbreviate    : boolean;   // Show only the key measures, with ellipses for the rest
}

const STEP_MIDDLE_C = 4 * 7;   // C4 in diatonic steps

// Splits a hand into measures of 2/4 time (8 sixteenths, or one half note).
function toMeasures(events: WrittenEvent[]): WrittenEvent[][] {
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
const STAFF_LINES: Record<Clef, { bottom: number; top: number }> = {
  treble: { bottom: STEP_MIDDLE_C + 2, top: STEP_MIDDLE_C + 10 },   // E4 to F5
  bass  : { bottom: STEP_MIDDLE_C - 10, top: STEP_MIDDLE_C - 2 },   // G2 to A3
};

// Number of ledger lines a note needs on a staff.
function ledgerLines(step: number, clef: Clef): number {
  const { bottom, top } = STAFF_LINES[clef];
  if (step < bottom) return Math.floor((bottom - step) / 2);
  if (step > top)    return Math.floor((step - top) / 2);
  return 0;
}

// Picks the clef for one staff of one line. Each hand keeps its usual clef (treble for the right,
// bass for the left) unless the other clef needs at least a third fewer ledger lines. (The right
// hand starts an octave below middle C, so it often begins in the bass clef.)
function chooseClef(measures: WrittenEvent[][], transposer: Transposer, isRightHand: boolean): Clef {
  const steps = measures.flat().flatMap((event) => event.steps.map(transposer.shiftedStep));
  const cost  = (clef: Clef) => steps.reduce((sum, step) => sum + ledgerLines(step, clef), 0);
  const usual = isRightHand ? "treble" : "bass";
  const other = isRightHand ? "bass" : "treble";
  return cost(other) < cost(usual) * 2 / 3 ? other : usual;
}

// Which side of the note a fingering goes on: away from the staff for notes above or below it,
// otherwise the hand's usual side (above for the right hand, below for the left).
function fingeringAbove(step: number, clef: Clef, isRightHand: boolean): boolean {
  const { bottom, top } = STAFF_LINES[clef];
  if (step < bottom) return false;
  if (step > top)    return true;
  return isRightHand;
}

// ⋘──────── Vertical spacing ────────⋙
// Units are unscaled pixels: VexFlow staff lines are 10px apart, so one diatonic step is 5px.

const STEP_PX        = 5;
const STAFF_HEIGHT   = 40;   // Top line to bottom line
const STAVE_TOP_GAP  = 40;   // VexFlow draws a stave's top line 40px below the stave's y
const FINGERING_PX   = 13;   // Room for a fingering number
const STEM_ROOM_PX   = 16;   // Room for stems and beams that poke out of the staff
const STAFF_GAP_MIN  = 30;   // Minimum space between the two staves of a line
const LINE_GAP_PX    = 16;   // Extra space between lines

// How far notes (and their fingerings) reach above and below a staff, beyond its outer lines.
function staffExtent(
  measures: WrittenEvent[][], clef: Clef, transposer: Transposer, isRightHand: boolean, showFingering: boolean,
): { above: number; below: number } {
  const { bottom, top } = STAFF_LINES[clef];
  let above = 0;
  let below = 0;
  for (const event of measures.flat()) {
    event.steps.forEach((written, index) => {
      const step    = transposer.shiftedStep(written);
      const fingers = showFingering && event.fingers[index] !== null;
      const up      = fingers && fingeringAbove(step, clef, isRightHand);
      above = Math.max(above, Math.max(0, step - top) * STEP_PX + (up ? FINGERING_PX : 0));
      below = Math.max(below, Math.max(0, bottom - step) * STEP_PX + (fingers && !up ? FINGERING_PX : 0));
    });
  }
  return { above: above + STEM_ROOM_PX, below: below + STEM_ROOM_PX };
}

function makeNotes(
  measure: WrittenEvent[], clef: Clef, transposer: Transposer, isRightHand: boolean, showFingering: boolean,
  descending: boolean,
): StaveNote[] {
  return measure.map((event) => {
    const note = new StaveNote({
      keys     : event.steps.map((step) => transposer.vexKey(step, descending)),
      duration : event.duration,
      clef,
    });
    if (showFingering) {
      event.fingers.forEach((finger, index) => {
        if (!finger) return;
        const above    = fingeringAbove(transposer.shiftedStep(event.steps[index]), clef, isRightHand);
        const position = above ? Modifier.Position.ABOVE : Modifier.Position.BELOW;
        note.addModifier(new FretHandFinger(finger).setPosition(position), index);
      });
    }
    return note;
  });
}

// Which measures to show. Abbreviated shows the first two (the pattern and how it moves), the two
// around the turn (where the direction changes), and the last two (the repeat and the final note).
function visibleMeasures(exercise: HanonExercise, total: number, abbreviate: boolean): number[] {
  if (!abbreviate) return [...Array(total).keys()];
  const wanted = [0, 1, exercise.turn - 1, exercise.turn, total - 2, total - 1];
  return [...new Set(wanted)].filter((index) => index >= 0 && index < total).sort((a, b) => a - b);
}

// One measure's place in the layout.
interface MeasureSlot {
  index        : number;    // Measure index in the exercise
  segmentStart : boolean;   // First measure of a line, or right after an omission: shows clef and key signature
  gapAfter     : boolean;   // Followed by omitted measures (drawn as an ellipsis)
}

// The drawn notes of each measure, keyed by "measure:event", for highlighting during playback.
type NoteElements = Map<string, SVGElement[]>;

// What playback needs from a drawing: the notes to highlight, and where each measure's line is
// (in CSS pixels from the top of the score), for scrolling. Line positions come from the layout,
// since the music font's glyph boxes are much taller than the notes look.
interface RenderResult {
  elements : NoteElements;
  lines    : Map<number, { top: number; bottom: number }>;   // By measure index
}

// Draws the exercise into `container`, wrapping measures onto lines that fit its width.
function renderExercise(container: HTMLElement, options: RenderOptions): RenderResult {
  const { exercise, key, showFingering, zoom, abbreviate } = options;
  const transposer = makeTransposer(key);
  const rightHand  = toMeasures(parseHand(exercise.rightHand));
  const leftHand   = toMeasures(parseHand(exercise.leftHand));
  const keySpec    = keySignatureSpec(key);
  const total      = rightHand.length;

  // ⋘──────── Horizontal layout ────────⋙
  // Lay out on a virtual page of width availableWidth / zoom, then scale it to fit. Smaller zoom
  // fits more measures on each line. The page is at least 420px wide so narrow screens still get
  // readable measures.
  const availableWidth = Math.max(container.clientWidth, 280);
  const pageWidth      = Math.max(availableWidth / zoom, 420);
  const scale          = availableWidth / pageWidth;
  const marginLeft     = 28;    // Room for the brace, which is drawn left of the staves
  const marginRight    = 4;
  const headerWidth    = 100;   // Extra room for the clef and key signature at the start of a segment
  const gapWidth       = 44;    // Room for the ellipsis that marks omitted measures
  const measureWidth   = 175;
  const usableWidth    = pageWidth - marginLeft - marginRight;
  // The final measure holds a single half note, so it gets less room.
  const weightOf       = (index: number) => (index === total - 1 ? 0.45 : 1);

  // Fill lines greedily. An omission's ellipsis stays at the end of the line it follows.
  const visible = visibleMeasures(exercise, total, abbreviate);
  const lines: MeasureSlot[][] = [];
  let line: MeasureSlot[] = [];
  let lineWidth = 0;
  visible.forEach((index, position) => {
    const afterGap = position > 0 && index !== visible[position - 1] + 1;
    if (afterGap) {
      // The previous measure is always the last one on the current line (lines only wrap below).
      line[line.length - 1].gapAfter = true;
      lineWidth += gapWidth;
    }
    const need = (line.length === 0 || afterGap ? headerWidth : 0) + measureWidth * weightOf(index);
    if (line.length > 0 && lineWidth + need > usableWidth) {
      lines.push(line);
      line = [];
      lineWidth = 0;
    }
    const segmentStart = line.length === 0 || afterGap;
    line.push({ index, segmentStart, gapAfter: false });
    lineWidth += (segmentStart ? headerWidth : 0) + measureWidth * weightOf(index);
  });
  if (line.length) lines.push(line);

  // Splits a line into segments (runs of measures that share a clef and key-signature header).
  const segmentsOf = (slots: MeasureSlot[]) => {
    const segments: MeasureSlot[][] = [];
    for (const slot of slots) {
      if (slot.segmentStart) segments.push([]);
      segments[segments.length - 1].push(slot);
    }
    return segments;
  };

  // ⋘──────── Vertical layout: size each line to its notes, choose clefs per segment ────────⋙
  interface LineLayout {
    slots    : MeasureSlot[];
    clefs    : Map<number, { upper: Clef; lower: Clef }>;
    upperTop : number;   // y of the upper staff's top line
    lowerTop : number;
    top      : number;   // The line's full extent, including notes above and below the staves
    bottom   : number;
  }
  const layouts: LineLayout[] = [];
  let cursor = 4;
  for (const slots of lines) {
    const clefs = new Map<number, { upper: Clef; lower: Clef }>();
    let upper = { above: 0, below: 0 };
    let lower = { above: 0, below: 0 };
    for (const segment of segmentsOf(slots)) {
      const right     = segment.map((slot) => rightHand[slot.index]);
      const left      = segment.map((slot) => leftHand[slot.index]);
      const upperClef = chooseClef(right, transposer, true);
      const lowerClef = chooseClef(left, transposer, false);
      segment.forEach((slot) => clefs.set(slot.index, { upper: upperClef, lower: lowerClef }));
      const u = staffExtent(right, upperClef, transposer, true, showFingering);
      const l = staffExtent(left, lowerClef, transposer, false, showFingering);
      upper = { above: Math.max(upper.above, u.above), below: Math.max(upper.below, u.below) };
      lower = { above: Math.max(lower.above, l.above), below: Math.max(lower.below, l.below) };
    }
    const upperTop = cursor + upper.above;   // y of the upper staff's top line
    const lowerTop = upperTop + STAFF_HEIGHT + Math.max(STAFF_GAP_MIN, upper.below + lower.above);
    const bottom = lowerTop + STAFF_HEIGHT + lower.below;
    layouts.push({ slots, clefs, upperTop, lowerTop, top: cursor, bottom });
    cursor = bottom + LINE_GAP_PX;
  }

  container.replaceChildren();
  const noteElements: NoteElements = new Map();
  const lineSpans: RenderResult["lines"] = new Map();

  layouts.forEach(({ slots, clefs, upperTop, lowerTop, top, bottom }, lineIndex) => {
    const span = { top: top * scale, bottom: bottom * scale };
    slots.forEach((slot) => lineSpans.set(slot.index, span));

    // Each line is its own SVG, so printing can break pages between lines (instead of moving the
    // whole score to the next page, or cutting through a staff). The lines tile the layout exactly:
    // each SVG's viewBox shows its slice of the page, so drawing uses page coordinates throughout.
    const sliceTop    = lineIndex === 0 ? 0 : top;
    const sliceBottom = layouts[lineIndex + 1]?.top ?? cursor;
    const lineElement = document.createElement("div");
    lineElement.className = "hanon-line";
    container.append(lineElement);
    const renderer = new Renderer(lineElement, Renderer.Backends.SVG);
    renderer.resize(availableWidth, (sliceBottom - sliceTop) * scale);
    const context = renderer.getContext() as SVGContext;
    context.scale(scale, scale);
    context.setViewBox(0, sliceTop, pageWidth, sliceBottom - sliceTop);

    // Three dots centered on a staff, marking omitted measures. Returns the drawn group so playback
    // can highlight it while the omitted measures sound.
    const drawEllipsis = (centerX: number, staffTop: number): SVGElement => {
      const group = context.openGroup("hanon-ellipsis") as SVGElement;
      for (const dx of [-8, 0, 8]) {
        context.beginPath();
        context.arc(centerX + dx, staffTop + STAFF_HEIGHT / 2, 2.2, 0, 2 * Math.PI, false);
        context.fill();
      }
      context.closeGroup();
      return group;
    };

    // Justify the line by stretching measures (not headers or gaps). The last line is stretched
    // only if it's nearly full, so a short final line isn't spread out.
    const fixed   = slots.reduce((sum, slot) => sum + (slot.segmentStart ? headerWidth : 0) + (slot.gapAfter ? gapWidth : 0), 0);
    const weights = slots.reduce((sum, slot) => sum + weightOf(slot.index), 0);
    const natural = fixed + weights * measureWidth;
    const isLast  = lineIndex === layouts.length - 1;
    const stretch = !isLast || natural >= usableWidth * 0.75;
    const unit    = stretch ? (usableWidth - fixed) / weights : measureWidth;

    let x = marginLeft;
    for (const slot of slots) {
      const { index, segmentStart, gapAfter } = slot;
      const { upper: upperClef, lower: lowerClef } = clefs.get(index)!;
      const width = unit * weightOf(index) + (segmentStart ? headerWidth : 0);
      const upper = new Stave(x, upperTop - STAVE_TOP_GAP, width);
      const lower = new Stave(x, lowerTop - STAVE_TOP_GAP, width);

      if (segmentStart) {
        upper.addClef(upperClef).addKeySignature(keySpec);
        lower.addClef(lowerClef).addKeySignature(keySpec);
        if (index === 0) {
          upper.addTimeSignature("2/4");
          lower.addTimeSignature("2/4");
        }
        upper.setMeasure(index + 1);   // Measure number at the start of each segment
      }

      // ⋘──────── Barlines: double bar at the turn, repeat before the final note, end bar ────────⋙
      let barType = Barline.type.SINGLE;
      if (index === exercise.turn - 1) barType = Barline.type.DOUBLE;
      if (index === total - 2)         barType = Barline.type.REPEAT_END;
      if (index === total - 1)         barType = Barline.type.END;
      upper.setEndBarType(barType);
      lower.setEndBarType(barType);

      // Line up the first notes of both staves, whatever their clefs and key signatures take up.
      const noteStart = Math.max(upper.getNoteStartX(), lower.getNoteStartX());
      upper.setNoteStartX(noteStart);
      lower.setNoteStartX(noteStart);

      upper.setContext(context).draw();
      lower.setContext(context).draw();

      if (segmentStart) {
        if (slot === slots[0]) new StaveConnector(upper, lower).setType("brace").setContext(context).draw();
        new StaveConnector(upper, lower).setType("singleLeft").setContext(context).draw();
      }
      // Join the staves with a barline of the same kind, so double, repeat, and final bars span the
      // whole grand staff.
      const connector = barType === Barline.type.DOUBLE ? "thinDouble"
        : barType === Barline.type.REPEAT_END || barType === Barline.type.END ? "boldDoubleRight"
        : "singleRight";
      new StaveConnector(upper, lower).setType(connector).setContext(context).draw();

      // ⋘──────── Notes ────────⋙
      // Measures from the turn on are the descending half (which matters for melodic minor).
      const descending = index >= exercise.turn;
      const upperNotes = makeNotes(rightHand[index], upperClef, transposer, true, showFingering, descending);
      const lowerNotes = makeNotes(leftHand[index], lowerClef, transposer, false, showFingering, descending);
      const upperVoice = new Voice({ numBeats: 2, beatValue: 4 }).addTickables(upperNotes);
      const lowerVoice = new Voice({ numBeats: 2, beatValue: 4 }).addTickables(lowerNotes);

      // Show accidentals the key signature doesn't cover (e.g. the raised 7th in harmonic minor).
      Accidental.applyAccidentals([upperVoice], keySpec);
      Accidental.applyAccidentals([lowerVoice], keySpec);

      // Beam sixteenths in groups of four (one beat).
      const groups = [new Fraction(1, 4)];
      const beams  = [
        ...Beam.generateBeams(upperNotes, { groups }),
        ...Beam.generateBeams(lowerNotes, { groups }),
      ];

      // Format both voices together so the hands line up vertically. The end padding leaves about
      // as much space after the last note as VexFlow leaves before the first; double bars and
      // repeat signs are wider, so they get more.
      const endPadding = barType === Barline.type.REPEAT_END ? 36
        : barType === Barline.type.DOUBLE ? 26
        : 20;
      const formatter  = new Formatter();
      formatter.joinVoices([upperVoice]);
      formatter.joinVoices([lowerVoice]);
      formatter.format([upperVoice, lowerVoice], upper.getNoteEndX() - noteStart - endPadding);

      upperVoice.draw(context, upper);
      lowerVoice.draw(context, lower);
      beams.forEach((beam) => beam.setContext(context).draw());
      upperNotes.forEach((note, event) => {
        const elements = [note, lowerNotes[event]].map((n) => n?.getSVGElement()).filter((e) => e !== undefined);
        noteElements.set(`${index}:${event}`, elements);
      });

      x += width;
      if (gapAfter) {
        const dots = [drawEllipsis(x + gapWidth / 2, upperTop), drawEllipsis(x + gapWidth / 2, lowerTop)];
        // Every measure this ellipsis stands for highlights it ("measure:all").
        const nextShown = visible[visible.indexOf(index) + 1];
        for (let hidden = index + 1; hidden < nextShown; hidden++) {
          noteElements.set(`${hidden}:all`, dots);
          lineSpans.set(hidden, span);
        }
        x += gapWidth;
      }
    }
  });
  return { elements: noteElements, lines: lineSpans };
}

// ╭────────────────────────────────────────╮
// │                Playback                │
// ╰────────────────────────────────────────╯
// A small piano-like synthesizer built on the Web Audio API, so playback needs no sample files.

// What playback sounds: the notes, the notes with a metronome, or only the metronome.
type Sound = "piano" | "piano-metronome" | "metronome";

interface PlayedNote  { midi: number; start: number; duration: number }   // Times in sixteenths
interface PlayedEvent { start: number; measure: number; event: number }   // For highlighting

// MIDI note number of a VexFlow key like "eb/4" (middle C = 60).
export function midiOf(vexKey: string): number {
  const match = vexKey.match(/^([a-g])(#{1,2}|b{1,2})?\/(-?\d+)$/);
  if (!match) throw new Error(`Bad key: ${vexKey}`);
  const accidental = !match[2] ? 0 : match[2][0] === "#" ? match[2].length : -match[2].length;
  return 12 * (Number(match[3]) + 1) + LETTER_SEMITONES[LETTERS.indexOf(match[1].toUpperCase())] + accidental;
}

// Every note of the whole exercise (playback ignores Abbreviate), and when each event starts.
export function buildPerformance(exercise: HanonExercise, key: Key): { notes: PlayedNote[]; events: PlayedEvent[]; length: number } {
  const transposer = makeTransposer(key);
  const notes: PlayedNote[] = [];
  const events: PlayedEvent[] = [];
  let length = 0;
  for (const hand of [exercise.rightHand, exercise.leftHand]) {
    let time = 0;
    toMeasures(parseHand(hand)).forEach((measure, measureIndex) => {
      const descending = measureIndex >= exercise.turn;
      measure.forEach((written, event) => {
        const duration = written.duration === "2" ? 8 : 1;
        for (const step of written.steps) {
          notes.push({ midi: midiOf(transposer.vexKey(step, descending)), start: time, duration });
        }
        if (hand === exercise.rightHand) events.push({ start: time, measure: measureIndex, event });
        time += duration;
      });
    });
    length = Math.max(length, time);
  }
  return { notes, events, length };
}

class Player {
  private context  : AudioContext | null = null;
  private output   : GainNode | null = null;
  private sources  : OscillatorNode[] = [];
  private frame    = 0;
  private startedAt = 0;   // AudioContext time of sixteenth 0
  private secondsPerSixteenth = 0;
  playing = false;

  // Plays `notes` from sixteenth `from`. `onEvent` gets the event now sounding (null when done).
  async play(
    performance: ReturnType<typeof buildPerformance>, bpm: number, from: number, sound: Sound,
    onEvent: (event: PlayedEvent | null) => void,
  ): Promise<void> {
    this.stop();
    this.context ??= new AudioContext();
    await this.context.resume();   // Browsers start audio suspended until a user gesture
    const context = this.context;

    // Master volume into a compressor, so chords and fast passages don't clip.
    const compressor = context.createDynamicsCompressor();
    compressor.connect(context.destination);
    this.output = context.createGain();
    this.output.gain.value = 0.6;
    this.output.connect(compressor);

    this.secondsPerSixteenth = 60 / bpm / 4;
    this.startedAt = context.currentTime + 0.1 - from * this.secondsPerSixteenth;
    if (sound !== "metronome") {
      for (const note of performance.notes) {
        if (note.start < from) continue;
        this.scheduleNote(note.midi, this.startedAt + note.start * this.secondsPerSixteenth,
          note.duration * this.secondsPerSixteenth, note.start % 4 === 0);
      }
    }
    if (sound !== "piano") {
      // A click on every quarter-note beat, accented on the first beat of each 2/4 measure.
      for (let beat = Math.ceil(from / 4) * 4; beat < performance.length; beat += 4) {
        this.scheduleClick(this.startedAt + beat * this.secondsPerSixteenth, beat % 8 === 0);
      }
    }

    // Follow along: report the event now sounding, once per animation frame.
    this.playing = true;
    let current = -1;
    const tick = () => {
      if (!this.playing) return;
      const now = (context.currentTime - this.startedAt) / this.secondsPerSixteenth;
      if (now >= performance.length + 2) {
        this.stop();
        onEvent(null);
        return;
      }
      let next = current;
      while (next + 1 < performance.events.length && performance.events[next + 1].start <= now) next++;
      if (next !== current && next >= 0) {
        current = next;
        onEvent(performance.events[current]);
      }
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  // How far playback has gone, in sixteenths (fractional, so following can move smoothly).
  time(): number {
    if (!this.context || !this.playing) return 0;
    return Math.max(0, (this.context.currentTime - this.startedAt) / this.secondsPerSixteenth);
  }

  // The sixteenth now sounding, for restarting at a new tempo from the same place.
  position(): number {
    return Math.floor(this.time());
  }

  stop(): void {
    this.playing = false;
    cancelAnimationFrame(this.frame);
    for (const source of this.sources) {
      try {
        source.stop();
      } catch {
        // Already stopped.
      }
    }
    this.sources = [];
    this.output?.disconnect();
    this.output = null;
  }

  // One metronome click: a short, bright blip (higher on the accented beat).
  private scheduleClick(time: number, accent: boolean): void {
    const context    = this.context!;
    const oscillator = context.createOscillator();
    const envelope   = context.createGain();
    oscillator.type            = "square";
    oscillator.frequency.value = accent ? 1760 : 1320;
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(accent ? 0.22 : 0.14, time + 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
    oscillator.connect(envelope).connect(this.output!);
    oscillator.start(time);
    oscillator.stop(time + 0.06);
    this.sources.push(oscillator);
  }

  // One note: a few harmonics with a fast attack and a piano-like decay (quicker for high notes).
  private scheduleNote(midi: number, start: number, duration: number, accent: boolean): void {
    const context   = this.context!;
    const frequency = 440 * 2 ** ((midi - 69) / 12);
    const end       = start + duration;
    const envelope  = context.createGain();
    const peak      = accent ? 0.2 : 0.16;
    const decay     = Math.max(0.12, 0.9 - (midi - 36) * 0.012);
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(peak, start + 0.005);
    envelope.gain.setTargetAtTime(0, start + 0.005, decay);   // Decay while held
    envelope.gain.setTargetAtTime(0, end, 0.04);               // Release
    envelope.connect(this.output!);

    for (const [multiple, level, type] of [[1, 1, "triangle"], [2, 0.3, "sine"], [3, 0.1, "sine"]] as const) {
      const oscillator = context.createOscillator();
      const gain       = context.createGain();
      oscillator.type            = type;
      oscillator.frequency.value = frequency * multiple;
      gain.gain.value            = level;
      oscillator.connect(gain).connect(envelope);
      oscillator.start(start);
      oscillator.stop(end + 0.3);
      this.sources.push(oscillator);
    }
  }
}

// ╭────────────────────────────────────────╮
// │              Page wiring               │
// ╰────────────────────────────────────────╯

// Per-viewer preferences, so they live in localStorage rather than the URL.
const ZOOM_STORAGE_KEY  = "hanon-zoom";
const TEMPO_STORAGE_KEY = "hanon-tempo";
const VIEW_STORAGE_KEY  = "hanon-view-options-open";
const SOUND_STORAGE_KEY = "hanon-sound";

function loadSetting(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;   // Storage unavailable: use the default
  }
}

function saveSetting(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable: the setting just won't be remembered.
  }
}

async function initPage(): Promise<void> {
  const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
  const exerciseSelect = $<HTMLSelectElement>("hanon-exercise");
  if (!exerciseSelect) return;   // Not on the Hanon page
  const rootSelect     = $<HTMLSelectElement>("hanon-root");
  const spellingGroup  = $<HTMLSpanElement>("hanon-spelling");
  const spellingField  = $<HTMLDivElement>("hanon-spelling-field");
  const modeSelect     = $<HTMLSelectElement>("hanon-mode");
  const fingeringBox   = $<HTMLInputElement>("hanon-fingering");
  const abbreviateBox  = $<HTMLInputElement>("hanon-abbreviate");
  const zoomSlider     = $<HTMLInputElement>("hanon-zoom");
  const zoomOutput     = $<HTMLOutputElement>("hanon-zoom-value");
  const title          = document.querySelector<HTMLHeadingElement>(".hanon-title")!;
  const score          = $<HTMLDivElement>("hanon-score");
  const status         = $<HTMLParagraphElement>("hanon-status");
  const printLink      = $<HTMLAnchorElement>("hanon-print-link");
  const infoTitle      = document.querySelector<HTMLHeadingElement>(".hanon-info-title")!;
  const infoFingers    = $<HTMLParagraphElement>("hanon-info-fingers");
  const infoText       = $<HTMLDivElement>("hanon-info-text");
  const infoMode       = $<HTMLDivElement>("hanon-info-mode");
  let shareUrl   = printLink.dataset.base ?? "";   // Updated with the current settings
  let shareTitle = "Hanon";
  let printTitle = "";
  const shareNative    = $<HTMLButtonElement>("hanon-share-native");
  const copyLinkButton = $<HTMLButtonElement>("hanon-copy-link");
  const copyLinkLabel  = $<HTMLSpanElement>("hanon-copy-label");
  const shareEmail     = $<HTMLAnchorElement>("hanon-share-email");
  const printButton    = $<HTMLButtonElement>("hanon-print");
  const viewOptions    = $<HTMLDetailsElement>("hanon-view-options");
  const playButton     = $<HTMLButtonElement>("hanon-play");
  const playbackBar    = document.querySelector<HTMLDivElement>(".hanon-playback")!;
  const playLabel      = $<HTMLSpanElement>("hanon-play-label");
  const tempoSlider    = $<HTMLInputElement>("hanon-tempo");
  const tempoOutput    = $<HTMLOutputElement>("hanon-tempo-value");
  const soundSelect    = $<HTMLSelectElement>("hanon-sound");
  const helpButton     = $<HTMLButtonElement>("hanon-fingering-help-button");
  const helpPopup      = $<HTMLSpanElement>("hanon-fingering-help");

  // ⋘──────── Fill the menus ────────⋙
  for (const exercise of HANON_EXERCISES) {
    exerciseSelect.add(new Option(`No. ${exercise.number}`, String(exercise.number)));
  }
  for (const spellings of ROOT_CHOICES) {
    rootSelect.add(new Option(spellings.map(prettyTonic).join(" / "), spellings.join("/")));
  }
  const groups = new Map<string, HTMLOptGroupElement>();
  for (const [id, mode] of Object.entries(MODES)) {
    if (!groups.has(mode.group)) {
      const group = document.createElement("optgroup");
      group.label = mode.group;
      groups.set(mode.group, group);
      modeSelect.append(group);
    }
    groups.get(mode.group)!.append(new Option(mode.menu, id));
  }

  // ⋘──────── Spelling of enharmonic roots (C♯ / D♭) ────────⋙
  // The spelling the user picked with the toggle, kept across mode changes while it has a key
  // signature. Without a pick, the spelling with fewer sharps or flats is used.
  let chosenSpelling: string | null = null;

  function currentTonic(): string {
    const mode      = modeSelect.value as Mode;
    const available = rootSelect.value.split("/").filter((tonic) => isAvailable({ tonic, mode }));
    if (chosenSpelling && available.includes(chosenSpelling)) return chosenSpelling;
    return available.reduce((best, tonic) =>
      signatureSize({ tonic, mode }) < signatureSize({ tonic: best, mode }) ? tonic : best);
  }

  // Shows the sharp/flat toggle (in View options) for roots with two spellings. A spelling with no standard key
  // signature in this mode (e.g. D♯ major) is disabled.
  function renderSpelling(): void {
    const spellings = rootSelect.value.split("/");
    const mode      = modeSelect.value as Mode;
    const tonic     = currentTonic();
    spellingField.hidden = spellings.length < 2;
    spellingGroup.replaceChildren(...spellings.map((spelling) => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type     = "radio";
      radio.name     = "hanon-spelling";
      radio.value    = spelling;
      radio.checked  = spelling === tonic;
      radio.disabled = !isAvailable({ tonic: spelling, mode });
      radio.addEventListener("change", () => {
        chosenSpelling = spelling;   // Only the notation changes (same pitches), so playback continues
        update();
      });
      label.append(radio, prettyTonic(spelling));
      label.title = radio.disabled ? `${keyLabel({ tonic: spelling, mode })} has no standard key signature` : "";
      return label;
    }));
  }

  // ⋘──────── Restore the selection from the URL (so links can share a specific exercise) ────────⋙
  const params = new URLSearchParams(location.search);
  const choose = (select: HTMLSelectElement, value: string | null) => {
    if (value && [...select.options].some((option) => option.value === value)) select.value = value;
  };
  choose(exerciseSelect, params.get("exercise"));
  choose(modeSelect, params.get("mode"));
  const urlKey = params.get("key");
  const urlRoot = ROOT_CHOICES.find((spellings) => urlKey && spellings.includes(urlKey));
  if (urlRoot) {
    rootSelect.value = urlRoot.join("/");
    chosenSpelling = urlKey;
  }
  if (params.get("fingering") === "off") fingeringBox.checked = false;
  if (params.get("abbreviate") === "on") abbreviateBox.checked = true;

  zoomSlider.value  = loadSetting(ZOOM_STORAGE_KEY) ?? zoomSlider.value;
  tempoSlider.value = loadSetting(TEMPO_STORAGE_KEY) ?? tempoSlider.value;
  soundSelect.value = loadSetting(SOUND_STORAGE_KEY) ?? soundSelect.value;
  if (!soundSelect.value) soundSelect.selectedIndex = 0;   // A stored value that no longer exists
  viewOptions.open  = loadSetting(VIEW_STORAGE_KEY) === "true";
  viewOptions.addEventListener("toggle", () => saveSetting(VIEW_STORAGE_KEY, String(viewOptions.open)));

  // ⋘──────── Playback ────────⋙
  const player = new Player();
  let drawing: RenderResult = { elements: new Map(), lines: new Map() };
  let playingEvent: PlayedEvent | null = null;
  let highlighted: SVGElement[] = [];

  // Highlights the notes now sounding (or, in the abbreviated view, the ellipsis standing for them).
  function highlight(event: PlayedEvent | null): void {
    playingEvent = event;
    highlighted.forEach((element) => element.classList.remove("hanon-playing"));
    highlighted = event
      ? drawing.elements.get(`${event.measure}:${event.event}`) ?? drawing.elements.get(`${event.measure}:all`) ?? []
      : [];
    highlighted.forEach((element) => element.classList.add("hanon-playing"));
  }

  // ⋘──────── Following: keep the playing line near the middle of the window ────────⋙
  // Each line plays from `start` to `end` (in sixteenths; every 2/4 measure is 8). The follow
  // point stays on the playing line's center, then over the line's last 40% glides (with ease-in-
  // out) to the next line's center. The page eases toward that point every frame, so scrolling is
  // continuous rather than jumping per line.
  interface FollowLine { start: number; end: number; center: number }

  function followLines(): FollowLine[] {
    const lines: FollowLine[] = [];
    const measures = [...drawing.lines.keys()].sort((a, b) => a - b);
    for (const measure of measures) {
      const span = drawing.lines.get(measure)!;
      const last = lines[lines.length - 1];
      if (last && last.center === (span.top + span.bottom) / 2) {
        last.end = (measure + 1) * 8;
      } else {
        lines.push({ start: measure * 8, end: (measure + 1) * 8, center: (span.top + span.bottom) / 2 });
      }
    }
    return lines;
  }

  // The page scroll position that puts the follow point at time `t` in the middle of the area
  // below the (stuck) playback bar.
  function followTarget(t: number): number | null {
    const lines = followLines();
    if (!lines.length) return null;
    const found    = lines.findIndex((line) => t < line.end);
    const index    = found === -1 ? lines.length - 1 : found;   // Past the end: stay on the last line
    const line     = lines[index];
    const next     = lines[index + 1] ?? line;
    const progress = Math.min(1, Math.max(0, (t - line.start) / (line.end - line.start)));
    const glide    = Math.max(0, (progress - 0.6) / 0.4);
    const eased    = glide * glide * (3 - 2 * glide);   // Smoothstep
    const y        = line.center + eased * (next.center - line.center);
    const barHeight = playbackBar.getBoundingClientRect().height;
    const middle    = barHeight + (window.innerHeight - barHeight) / 2;
    const scoreTop  = score.getBoundingClientRect().top + window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(maxScroll, Math.max(0, scoreTop + y - middle));
  }

  // Scrolling by hand pauses following for a few seconds, so it doesn't fight the reader.
  let followPausedUntil = 0;
  const pauseFollowing = () => (followPausedUntil = performance.now() + 3000);
  window.addEventListener("wheel", pauseFollowing, { passive: true });
  window.addEventListener("touchmove", pauseFollowing, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) pauseFollowing();
  });

  let followFrame = 0;
  let lastFrameTime = 0;
  function follow(now: number): void {
    if (!player.playing) return;
    const elapsed = lastFrameTime ? (now - lastFrameTime) / 1000 : 0;
    lastFrameTime = now;
    const target = followTarget(player.time());
    if (target !== null && now >= followPausedUntil) {
      // Ease toward the target (time constant 0.3s), independent of the frame rate.
      const current = window.scrollY;
      const next    = current + (target - current) * (1 - Math.exp(-elapsed / 0.3));
      if (Math.abs(next - current) >= 0.5) window.scrollTo({ top: next, behavior: "instant" });
    }
    followFrame = requestAnimationFrame(follow);
  }

  function startFollowing(): void {
    cancelAnimationFrame(followFrame);
    lastFrameTime = 0;
    followFrame = requestAnimationFrame(follow);
  }

  function setPlayingState(playing: boolean): void {
    playButton.setAttribute("aria-pressed", String(playing));
    playLabel.textContent = playing ? "Stop" : "Play";
  }

  function startPlayback(from: number): void {
    const options = currentOptions();
    setPlayingState(true);
    const sound = soundSelect.value as Sound;
    void player.play(buildPerformance(options.exercise, options.key), Number(tempoSlider.value), from, sound, (event) => {
      highlight(event);
      if (event === null) setPlayingState(false);
    }).then(startFollowing);
  }

  function stopPlayback(): void {
    player.stop();
    highlight(null);
    setPlayingState(false);
  }

  playButton.addEventListener("click", () => (player.playing ? stopPlayback() : startPlayback(0)));

  // Shows "♩ = 72", drawing the quarter note with the music font (system fonts often show ♩ as an emoji).
  const showTempo = () => {
    const note = document.createElement("span");
    note.className   = "hanon-quarter";
    note.textContent = "\uE1D5";   // SMuFL metNoteQuarterUp
    note.setAttribute("aria-label", "quarter note");
    tempoOutput.replaceChildren(note, ` = ${tempoSlider.value}`);
  };

  soundSelect.addEventListener("change", () => {
    saveSetting(SOUND_STORAGE_KEY, soundSelect.value);
    if (player.playing) startPlayback(player.position());   // Switch sound without losing the place
  });

  tempoSlider.addEventListener("input", () => {
    showTempo();
    saveSetting(TEMPO_STORAGE_KEY, tempoSlider.value);
    if (player.playing) startPlayback(player.position());   // Continue from the same place at the new tempo
  });
  showTempo();

  // ⋘──────── Render ────────⋙
  function currentOptions(): RenderOptions {
    return {
      exercise      : HANON_EXERCISES.find((exercise) => String(exercise.number) === exerciseSelect.value)!,
      key           : { tonic: currentTonic(), mode: modeSelect.value as Mode },
      showFingering : fingeringBox.checked,
      zoom          : Number(zoomSlider.value) / 100,
      abbreviate    : abbreviateBox.checked,
    };
  }

  function update(): void {
    const options = currentOptions();
    renderSpelling();
    const titleText = `No. ${options.exercise.number} in ${keyLabel(options.key)}`;
    // "Hanon" is shown only in print, where the page heading is hidden.
    const printPrefix = document.createElement("span");
    printPrefix.className   = "hanon-print-only";
    printPrefix.textContent = "Hanon ";
    title.replaceChildren(printPrefix, titleText);
    document.title = `${titleText} – Hanon`;
    // Browsers name saved PDFs after the page title; use plain ASCII there ("C-sharp", not "C♯").
    printTitle = `Hanon No. ${options.exercise.number} in ${asciiKeyLabel(options.key)}`;
    renderInfo(options);
    zoomOutput.textContent = `${zoomSlider.value}%`;

    try {
      drawing = renderExercise(score, options);
      highlight(playingEvent);   // Keep the highlight through redraws (e.g. resizing while playing)
      status.hidden = true;
    } catch (error) {
      status.textContent = `Couldn't draw the music: ${error instanceof Error ? error.message : error}`;
      status.hidden = false;
      console.error(error);
    }

    // Keep the URL in sync so the current view can be bookmarked or shared.
    const next = new URLSearchParams({ exercise: exerciseSelect.value, key: options.key.tonic, mode: modeSelect.value });
    if (!fingeringBox.checked) next.set("fingering", "off");
    if (abbreviateBox.checked) next.set("abbreviate", "on");
    history.replaceState(null, "", `${location.pathname}?${next}`);
    shareUrl   = `${printLink.dataset.base}?${next}`;   // Shared links reopen this exact view
    shareTitle = `Hanon ${titleText}`;
    shareEmail.href = `mailto:?subject=${encodeURIComponent(shareTitle)}`
      + `&body=${encodeURIComponent(`${shareTitle}:\n${shareUrl}`)}`;
  }

  // Changing the music stops playback; changing only how it's shown doesn't.
  rootSelect.addEventListener("change", () => {
    chosenSpelling = null;   // A new root starts with its simpler spelling
    stopPlayback();
    update();
  });
  for (const control of [exerciseSelect, modeSelect]) {
    control.addEventListener("change", () => {
      stopPlayback();
      update();
    });
  }
  for (const control of [fingeringBox, abbreviateBox]) {
    control.addEventListener("change", update);
  }
  zoomSlider.addEventListener("input", () => {
    saveSetting(ZOOM_STORAGE_KEY, zoomSlider.value);
    update();
  });

  // ⋘──────── Print attribution at the bottom of every page ────────⋙
  // CSS page margin boxes (@page { @bottom-center }) print text in the page margin, so it sits at
  // the bottom of each page without overlapping the music. Chromium supports them from version 131;
  // other browsers fall back to the credit line after the music (see the page's print styles).
  // Margin text can't be a link, so it shows the address of this exact view.
  const chromium = (navigator as Navigator & { userAgentData?: { brands: { brand: string; version: string }[] } })
    .userAgentData?.brands.find((brand) => brand.brand === "Chromium");
  const marginBoxes = chromium !== undefined && Number(chromium.version) >= 131;
  const marginStyle = document.createElement("style");
  if (marginBoxes) {
    document.head.append(marginStyle);
    document.documentElement.classList.add("hanon-margin-credit");
  }

  if (marginBoxes) {
    const url  = (printLink.dataset.base ?? "").replace(/^https?:\/\//, "");   // The tool's page, without settings
    const text = `Generated by Paul Wintz's Hanon exercise tool: ${url}`
      + ` · Notes from the Mutopia Project edition (Javier Ruiz-Alma, CC BY-SA 4.0)`;
    marginStyle.textContent = `@media print { @page { margin: 0.5in 0.5in 0.7in;
      @bottom-center { content: ${JSON.stringify(text)}; font: 8pt sans-serif; color: #555; } } }`;
  }

  // While printing, switch to the ASCII title so the saved PDF's default file name is plain.
  let screenTitle = "";
  window.addEventListener("beforeprint", () => {
    screenTitle    = document.title;
    document.title = printTitle;
  });
  window.addEventListener("afterprint", () => {
    if (screenTitle) document.title = screenTitle;
  });

  // ⋘──────── Notes in the option panels: Hanon's on the exercise, and about the mode ────────⋙
  function renderInfo(options: RenderOptions): void {
    const text = HANON_TEXT[options.exercise.number];
    // Hanon wrote every exercise in C major, so his notes refer to that version.
    infoTitle.textContent   = `Hanon's notes on Exercise No. ${options.exercise.number} (in C Major)`;
    infoFingers.hidden      = text.fingers.length === 0;
    infoFingers.textContent = `Fingers trained: ${text.fingers.join("-")}`;   // Hanon's notation, e.g. "3-4-5"
    infoText.replaceChildren(...text.paragraphs.map((paragraph) => {
      const element = document.createElement("p");
      element.textContent = paragraph;
      return element;
    }));

    const mode = MODES[options.key.mode] as ModeInfo;
    infoMode.hidden = !mode.about;
    if (!mode.about) return;

    // Note names like "E♭", "F𝄪" from VexFlow keys like "eb/4", "f##/4".
    const transposer = makeTransposer(options.key);
    const noteName = (vexKey: string) => {
      const [, letter, accidental] = vexKey.match(/^([a-g])([#b]*)/)!;
      const signs: Record<string, string> = { "": "", "#": "♯", "##": "𝄪", "b": "♭", "bb": "𝄫" };
      return letter.toUpperCase() + signs[accidental];
    };
    const notes = (descending: boolean) =>
      [0, 1, 2, 3, 4, 5, 6].map((degree) => noteName(transposer.vexKey(STEP_MIDDLE_C + degree, descending))).join(" ");

    const heading = document.createElement("h3");
    heading.textContent = `The ${keyLabel(options.key)} scale`;
    const scaleLine = document.createElement("p");
    scaleLine.className   = "hanon-info-scale";
    scaleLine.textContent = mode.descending
      ? `Notes: ${notes(false)} ascending; ${notes(true)} descending. Formula (ascending): ${modeFormula(mode.scale)}`
      : `Notes: ${notes(false)}. Formula: ${modeFormula(mode.scale)}`;
    const about = document.createElement("p");
    about.textContent = `${mode.about} `;
    const link = document.createElement("a");
    link.href        = mode.wiki!;
    link.textContent = "More on Wikipedia";
    link.target      = "_blank";
    link.rel         = "noopener";
    about.append(link);
    infoMode.replaceChildren(heading, scaleLine, about);
  }

  // ⋘──────── Sharing (links use the site's address, with the current settings) ────────⋙
  if ("share" in navigator) {
    shareNative.hidden = false;   // The device's own share sheet, where supported (mostly phones)
    shareNative.addEventListener("click", () => {
      navigator.share({ title: shareTitle, url: shareUrl }).catch(() => {
        // Cancelled by the user: nothing to do.
      });
    });
  }

  let copyResetTimer: number | undefined;
  copyLinkButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      copyLinkLabel.textContent = "Link copied";
      copyLinkButton.classList.add("hanon-copied");
    } catch {
      copyLinkLabel.textContent = "Couldn't copy";
    }
    clearTimeout(copyResetTimer);
    copyResetTimer = window.setTimeout(() => {
      copyLinkLabel.textContent = "Copy link";
      copyLinkButton.classList.remove("hanon-copied");
    }, 2000);
  });

  printButton.addEventListener("click", () => window.print());

  // ⋘──────── Fingering help: shown on hover (CSS) or toggled by clicking/tapping the "?" ────────⋙
  const setHelp = (open: boolean) => {
    helpPopup.hidden = !open;
    helpButton.setAttribute("aria-expanded", String(open));
  };
  helpButton.addEventListener("click", (event) => {
    event.stopPropagation();
    setHelp(helpPopup.hidden);
  });
  document.addEventListener("click", (event) => {
    if (!helpPopup.contains(event.target as Node)) setHelp(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setHelp(false);
  });

  // Redraw when the width changes (e.g. rotating a phone), so lines rewrap to fit.
  let lastWidth = score.clientWidth;
  let resizeTimer: number | undefined;
  new ResizeObserver(() => {
    if (score.clientWidth === lastWidth) return;
    lastWidth = score.clientWidth;
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(update, 150);
  }).observe(score);

  // The music font is embedded but loads asynchronously; draw once it's ready.
  await document.fonts.load("30px Bravura");
  update();
}

void VexFlow;   // The default import registers the embedded Bravura font
if (typeof document === "undefined") {
  // Loaded outside a browser (e.g. for testing): nothing to set up.
} else if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => void initPage());
} else {
  void initPage();
}
