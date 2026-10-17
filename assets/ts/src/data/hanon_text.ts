// ╭───────────────────────────────────────────────────────────────╮
// │       Hanon's notes on exercises 1–20 (The Virtuoso Pianist)  │
// ╰───────────────────────────────────────────────────────────────╯
// Hanon's text for each exercise (generated, then edited), from the Mutopia Project edition
// (https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=2037), typeset by Javier Ruiz-Alma,
// licensed CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/).
//
// `fingers` lists the fingers the exercise trains. Most come from Hanon's marks (e.g. "(3-4)"); for
// exercises without a mark (Nos. 1, 9, 12, 15, 16, 17, 20) they come from his text: the fingers he
// says are exercised ("Extension of 1-5, and exercise for 3-4-5" → 3, 4, 5), the fourth and fifth
// for No. 1's stretch, and all five for "general" or "all 5 fingers" exercises. Footnote
// markers that refer to symbols in the printed score have been removed. No. 1's notes keep only
// its first sentence; the rest of Hanon's text there is general instructions for the whole book.

export interface HanonText {
  fingers    : number[];
  paragraphs : string[];
}

export const HANON_TEXT: Record<number, HanonText> = {
  1: {
    fingers: [4, 5],
    paragraphs: [
      "Stretch between the fifth and fourth fingers of the left hand in ascending, and the fifth and fourth fingers of the right hand in descending.",
    ],
  },
  2: {
    fingers: [3, 4],
    paragraphs: [
      "When this exercise is mastered, recommence the preceding one, and play both together four times without interruption; the fingers will gain considerably by practising these exercises, and those following, in this way.",
      "The fourth and fifth fingers being naturally weak, it should be observed that this exercise, and those following it up to Nº 31, are intended to render them as strong and agile as the second and third.",
    ],
  },
  3: {
    fingers: [2, 3, 4],
    paragraphs: [
      "Before beginning to practise Nº 3, play through the preceding exercises once or twice without stopping. When Nº 3 is mastered, practise Nº 4, and then Nº 5, and as soon as they are thoroughly learned play through all three at least four times without interruption, not stopping until the last note on page 6. The entire work should be practised in this manner. Therefore, when playing the numbers in the First Part, stop only on the last note on pp. 3, 6, 9, 12, 15, 18, and 21.",
    ],
  },
  4: {
    fingers: [3, 4, 5],
    paragraphs: [
      "Special exercise for the 3rd, 4th and 5th fingers of the hand.",
    ],
  },
  5: {
    fingers: [1, 2, 3, 4, 5],
    paragraphs: [
      "We repeat, that the fingers should be lifted high, and with precision, until this entire volume is mastered.",
    ],
  },
  6: {
    fingers: [5],
    paragraphs: [
      "To obtain the good results which we promise those who study this work, it is indispensable to play daily, at least once, the exercises already learned.",
    ],
  },
  7: {
    fingers: [3, 4, 5],
    paragraphs: [
      "Exercise of the greatest importance for the 3rd, 4th and 5th fingers.",
    ],
  },
  8: {
    fingers: [1, 2, 3, 4, 5],
    paragraphs: [
      "Very important exercise for all five fingers.",
    ],
  },
  9: {
    fingers: [1, 2, 3, 4, 5],
    paragraphs: [
      "Extension of the 4th and 5th, and general finger-exercise.",
    ],
  },
  10: {
    fingers: [3, 4],
    paragraphs: [
      "Preparation for the trill, for the 3rd and 4th fingers of the left hand in ascending; and for the 3rd and 4th of the right, descending.",
    ],
  },
  11: {
    fingers: [3, 4, 5],
    paragraphs: [
      "Another preparation for the trill, for the 4th and 5th fingers.",
    ],
  },
  12: {
    fingers: [3, 4, 5],
    paragraphs: [
      "Extension of 1-5, and exercise for 3-4-5.",
    ],
  },
  13: {
    fingers: [3, 4, 5],
    paragraphs: [
    ],
  },
  14: {
    fingers: [3, 4],
    paragraphs: [
      "Another preparation for the trill, for the 3rd and 4th fingers.",
    ],
  },
  15: {
    fingers: [1, 2, 3, 4, 5],
    paragraphs: [
      "Extension of 1-2, and exercise for all 5 fingers.",
    ],
  },
  16: {
    fingers: [3, 4, 5],
    paragraphs: [
      "Extension of 3-5, and exercise for 3-4-5.",
    ],
  },
  17: {
    fingers: [3, 4, 5],
    paragraphs: [
      "Extension of 1-2, 2-4, 4-5, and exercise for 3-4-5.",
    ],
  },
  18: {
    fingers: [1, 2, 3, 4, 5],
    paragraphs: [
    ],
  },
  19: {
    fingers: [1, 2, 3, 4, 5],
    paragraphs: [
    ],
  },
  20: {
    fingers: [2, 3, 4],
    paragraphs: [
      "Extension of 2-4, 4-5, and exercise for 2-3-4.",
    ],
  },
};
