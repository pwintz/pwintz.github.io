// ╭───────────────────────────────────────────────────────────────╮
// │           Hanon piano exercises, rendered in any key          │
// ╰───────────────────────────────────────────────────────────────╯
// Takes Hanon's exercises (written in C major, see data/hanon_data.ts), transposes them diatonically
// to the chosen key, and engraves them as a grand staff with VexFlow.
//
// "Diatonically" means each note keeps its scale degree: C major's C D E F G A B becomes, e.g.,
// E♭ F G A♭ B♭ C D in E♭ major, so every pattern stays within the new key's scale.

import VexFlow, {
  Accidental, Articulation as VexArticulation, Barline, Beam, Curve, Dot, Formatter, Fraction, FretHandFinger,
  Modifier, Renderer, Stave, StaveConnector, StaveNote, Stem, SVGContext, Tuplet, Voice,
} from "vexflow/bravura";
import { HANON_EXERCISES, HanonExercise } from "./data/hanon_data";
import { HANON_TEXT } from "./data/hanon_text";
import { loadString as loadSetting, saveString as saveSetting } from "./common/storage";
import {
  Articulation, articulationIn, ARTICULATIONS, asciiKeyLabel, buildPerformance, chooseClef, Clef,
  fingeringAbove, isAvailable, Key, keyLabel, keySignatureSpec, makeTransposer, Mode, modeFormula,
  ModeInfo, MODES, parseHand, PlayedEvent, prettyTonic, Rhythm, RHYTHMS, ROOT_CHOICES,
  signatureSize, STAFF_LINES, STEP_MIDDLE_C, StyledEvent, styleMeasures, toMeasures, Transposer,
  visibleMeasures,
} from "./hanon/music";

// ╭────────────────────────────────────────╮
// │               Engraving                │
// ╰────────────────────────────────────────╯

interface RenderOptions {
  exercise      : HanonExercise;
  key           : Key;
  rhythm        : Rhythm;
  articulation  : Articulation;
  showFingering : boolean;
  zoom          : number;    // 1 = full size
  abbreviate    : boolean;   // Show only the key measures, with ellipses for the rest
}

// ⋘──────── Vertical spacing ────────⋙
// Units are unscaled pixels: VexFlow staff lines are 10px apart, so one diatonic step is 5px.

const STEP_PX        = 5;
const STAFF_HEIGHT   = 40;   // Top line to bottom line
const STAVE_TOP_GAP  = 40;   // VexFlow draws a stave's top line 40px below the stave's y
const FINGERING_PX   = 13;   // Room for a fingering number
const STEM_ROOM_PX   = 16;   // Room for stems and beams that poke out of the staff
const TUPLET_PX      = 16;   // Room for triplet numbers, on the hand's outer side
const MARKS_PX       = 10;   // Room for staccato dots and slurs, which can go on either side
const STAFF_GAP_MIN  = 30;   // Minimum space between the two staves of a line
const LINE_GAP_PX    = 16;   // Extra space between lines

// How far notes (and their fingerings) reach above and below a staff, beyond its outer lines.
function staffExtent(
  measures: StyledEvent[][], clef: Clef, transposer: Transposer, isRightHand: boolean, showFingering: boolean,
): { above: number; below: number } {
  const tuplets = measures.flat().some((event) => event.beatNote?.triplet);
  const marks   = measures.flat().some((event) => event.staccato || event.slur) ? MARKS_PX : 0;
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
  const tupletRoom = tuplets ? TUPLET_PX : 0;
  return {
    above: above + STEM_ROOM_PX + marks + (isRightHand ? tupletRoom : 0),
    below: below + STEM_ROOM_PX + marks + (isRightHand ? 0 : tupletRoom),
  };
}

// A tuplet whose number stays on its hand's outer side (above the right hand, below the left), so
// the two hands' numbers don't collide between the staves. VexFlow's own placement can leave the
// number far from the notes or on top of a staccato dot, so this places it just beyond each note's
// outer edge: its stem tip (or beam), or else its notehead plus the fingerings, staccato dots, and
// slurs on that side. (The music font's glyph boxes are too tall to measure the drawing instead.)
class OuterTuplet extends Tuplet {
  constructor(notes: StaveNote[], private readonly outer: number, private readonly slurred: boolean[]) {
    super(notes, { notesOccupied: 2 });
  }

  getYPosition(): number {
    this.setTupletLocation(this.outer);   // Beaming sets it to the stem side
    const top  = this.outer === Tuplet.LOCATION_TOP;
    const side = top ? Modifier.Position.ABOVE : Modifier.Position.BELOW;
    const edges = (this.notes as StaveNote[]).map((note, index) => {
      const stemOutward = (note.getStemDirection() === Stem.UP) === top;
      if (stemOutward) return note.getStemExtents().topY;
      const marks = [...note.getModifiersByType(FretHandFinger.CATEGORY), ...note.getModifiersByType(VexArticulation.CATEGORY)]
        .filter((modifier) => modifier.getPosition() === side).length;
      const reach = 7 + 14 * marks + (this.slurred[index] ? 20 : 0);   // Beyond the notehead's center
      return top ? Math.min(...note.getYs()) - reach : Math.max(...note.getYs()) + reach;
    });
    // Never inside the staff.
    const stave = this.notes[0].checkStave();
    return top
      ? Math.min(...edges, stave.getYForLine(0) - 4) - 8
      : Math.max(...edges, stave.getYForLine(4) + 4) + 8;
  }
}

// The notes of one measure, and the tuplets grouping its triplets. (Tuplets change their notes'
// lengths, so they must exist before the notes go into a voice.)
function makeNotes(
  measure: StyledEvent[], clef: Clef, transposer: Transposer, isRightHand: boolean, showFingering: boolean,
  descending: boolean,
): { notes: StaveNote[]; tuplets: OuterTuplet[] } {
  const notes = measure.map((event) => {
    const note = new StaveNote({
      keys     : event.steps.map((step) => transposer.vexKey(step, descending)),
      duration : event.beatNote?.duration ?? event.duration,
      dots     : event.beatNote?.dots ?? 0,
      clef,
    });
    if (event.beatNote?.dots) Dot.buildAndAttach([note], { all: true });
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

  // Each run of three triplet sixteenths fits in the time of an eighth.
  let inSlur = false;
  const slurred = measure.map((event) => {
    if (event.slur === "start") inSlur = true;
    const under = inSlur;
    if (event.slur === "end") inSlur = false;
    return under;
  });
  const tuplets: OuterTuplet[] = [];
  for (let start = 0; start < notes.length; start++) {
    if (!measure[start].beatNote?.triplet) continue;
    const outer = isRightHand ? Tuplet.LOCATION_TOP : Tuplet.LOCATION_BOTTOM;
    tuplets.push(new OuterTuplet(notes.slice(start, start + 3), outer, slurred.slice(start, start + 3)));
    start += 2;
  }
  return { notes, tuplets };
}

// Staccato dots and slurs go on the notehead side, away from the stems, so they're added once
// beaming has set the stem directions.
function addArticulation(notes: StaveNote[], measure: StyledEvent[]): Curve[] {
  const slurs: Curve[] = [];
  let slurStart: StaveNote | null = null;
  notes.forEach((note, index) => {
    const event = measure[index];
    if (event.staccato) {
      const below = note.getStemDirection() === Stem.UP;
      note.addModifier(new VexArticulation("a.").setPosition(below ? Modifier.Position.BELOW : Modifier.Position.ABOVE));
    }
    if (event.slur === "start") slurStart = note;
    if (event.slur === "end" && slurStart) {
      slurs.push(new Curve(slurStart, note, {}));
      slurStart = null;
    }
  });
  return slurs;
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
  const { exercise, key, rhythm, articulation, showFingering, zoom, abbreviate } = options;
  const transposer = makeTransposer(key);
  const rightHand  = styleMeasures(toMeasures(parseHand(exercise.rightHand)), rhythm, articulation);
  const leftHand   = styleMeasures(toMeasures(parseHand(exercise.leftHand)), rhythm, articulation);
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
      const { notes: upperNotes, tuplets: upperTuplets } = makeNotes(rightHand[index], upperClef, transposer, true, showFingering, descending);
      const { notes: lowerNotes, tuplets: lowerTuplets } = makeNotes(leftHand[index], lowerClef, transposer, false, showFingering, descending);
      const upperVoice = new Voice({ numBeats: 2, beatValue: 4 }).addTickables(upperNotes);
      const lowerVoice = new Voice({ numBeats: 2, beatValue: 4 }).addTickables(lowerNotes);

      // Show accidentals the key signature doesn't cover (e.g. the raised 7th in harmonic minor).
      Accidental.applyAccidentals([upperVoice], keySpec);
      Accidental.applyAccidentals([lowerVoice], keySpec);

      // Beam each beat's four notes together.
      const groups = [new Fraction(1, 4)];
      const beams  = [
        ...Beam.generateBeams(upperNotes, { groups }),
        ...Beam.generateBeams(lowerNotes, { groups }),
      ];
      const upperSlurs = addArticulation(upperNotes, rightHand[index]);
      const lowerSlurs = addArticulation(lowerNotes, leftHand[index]);

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
      [...upperSlurs, ...lowerSlurs, ...upperTuplets, ...lowerTuplets].forEach((element) => element.setContext(context).draw());
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

// What playback sounds: the notes, the notes with a metronome, only the metronome, or nothing (the
// score still highlights and scrolls along).
type Sound = "piano" | "piano-metronome" | "metronome" | "none";


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
    if (sound === "piano" || sound === "piano-metronome") {
      for (const note of performance.notes) {
        if (note.start < from) continue;
        this.scheduleNote(note.midi, this.startedAt + note.start * this.secondsPerSixteenth,
          note.duration * this.secondsPerSixteenth, note.start % 4 === 0);
      }
    }
    if (sound === "piano-metronome" || sound === "metronome") {
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

async function initPage(): Promise<void> {
  const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
  const exerciseSelect = $<HTMLSelectElement>("hanon-exercise");
  if (!exerciseSelect) return;   // Not on the Hanon page
  const rootSelect     = $<HTMLSelectElement>("hanon-root");
  const spellingGroup  = $<HTMLSpanElement>("hanon-spelling");
  const spellingField  = $<HTMLDivElement>("hanon-spelling-field");
  const modeSelect     = $<HTMLSelectElement>("hanon-mode");
  const rhythmSelect   = $<HTMLSelectElement>("hanon-rhythm");
  const articulationSelect = $<HTMLSelectElement>("hanon-articulation");
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
  for (const [id, rhythm] of Object.entries(RHYTHMS)) rhythmSelect.add(new Option(rhythm.menu, id));
  for (const [id, articulation] of Object.entries(ARTICULATIONS)) articulationSelect.add(new Option(articulation.menu, id));

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
  choose(rhythmSelect, params.get("rhythm"));
  choose(articulationSelect, params.get("articulation"));
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
    const music = buildPerformance(options.exercise, options.key, options.rhythm, options.articulation);
    void player.play(music,Number(tempoSlider.value), from, sound, (event) => {
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
      rhythm        : rhythmSelect.value as Rhythm,
      articulation  : articulationSelect.value as Articulation,
      showFingering : fingeringBox.checked,
      zoom          : Number(zoomSlider.value) / 100,
      abbreviate    : abbreviateBox.checked,
    };
  }

  function update(): void {
    const options = currentOptions();
    renderSpelling();
    // Articulation names can depend on the rhythm (e.g. "Triplet slurred, eighth staccato").
    for (const option of articulationSelect.options) {
      option.text = articulationIn(option.value as Articulation, options.rhythm).menu;
    }
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
    if (options.rhythm !== "even") next.set("rhythm", options.rhythm);
    if (options.articulation !== "legato") next.set("articulation", options.articulation);
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
  // A new rhythm or articulation keeps the same measures, so playback continues from the same place.
  for (const control of [rhythmSelect, articulationSelect]) {
    control.addEventListener("change", () => {
      update();
      if (player.playing) startPlayback(player.position());
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
