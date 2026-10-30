// ╭───────────────────────────────────────────────────────────────╮
// │                     Note names and pitches                     │
// ╰───────────────────────────────────────────────────────────────╯
// Pitches are MIDI note numbers: 69 is A4, and each semitone is 1, so the fractional part is the
// distance from the nearest note in hundredths of a semitone (cents).

export const NOTE_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

// `a4` is the reference pitch of A4 (Hz).
export const freqToMidi = (f: number, a4: number) => 69 + 12 * Math.log2(f / a4);
export const midiToFreq = (m: number, a4: number) => a4 * 2 ** ((m - 69) / 12);
export const centsOff   = (midi: number) => 100 * (midi - Math.round(midi));

export function noteName(midi: number): string {
  const m = Math.round(midi);
  return NOTE_NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
}

export function formatCents(cents: number): string {
  const c = Math.round(cents);
  return c === 0 ? "±0¢" : `${c > 0 ? "+" : "−"}${Math.abs(c)}¢`;
}
