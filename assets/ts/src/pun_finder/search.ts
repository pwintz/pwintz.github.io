// ╭───────────────────────────────────────────────────────────────╮
// │        Pun finder: sounds, the dictionary, and searching       │
// ╰───────────────────────────────────────────────────────────────╯
// The search logic for ../pun_finder.ts (see there for an overview), with no page code, so it can
// be tested.

// ⋘──────── Constants ────────⋙

const COMMON_ZIPF = 3;  // "Common words" are used at least once per million words
const MAX_EXTRA_GROUP   = 5;  // Matches with this many extra sounds or more are grouped together
const MAX_SIMILAR_GROUP = 3;  // Likewise for similar sounds matched instead of the original
// Closeness score weights (lower is closer), used to choose which of a word's pronunciations
// matches best; each extra phoneme costs 1.
const SUBSTITUTION_COST = 0.5;   // Matching a similar sound instead of the original
const STRESS_COST       = 0.25;  // Matching a vowel with different stress (when it isn't locked)
const MAX_PHRASE_PRONUNCIATIONS = 12; // Cap on pronunciation combinations for a multi-word phrase

// Selected sounds at each selected position: position → base phonemes (no stress digit).
// A position is selected exactly when it has an entry, and each entry has at least one sound.
export type Selection = Map<number, Set<string>>;

export interface Dictionary {
  words    : string[];               // Word for each pronunciation (repeated for variants)
  stressed : string[];               // Pronunciation as " L EH1 T AH0 S " (padded with spaces)
  index    : Map<string, number[]>;  // Word → indices of its pronunciations
}

// Which words to include: common dictionary words, all dictionary words (including proper
// nouns), or everything in CMUdict.
export type WordFilter = "common" | "dictionary" | "all";

export interface WordInfo {
  display : string;          // Spelling to show, e.g. "Caitlin"
  zipf    : number;          // wordfreq Zipf frequency (0 if unknown)
  kind    : "w" | "n" | "";  // Dictionary word, proper noun, or neither
  rank    : number;          // Frequency rank (1 = most common; Infinity if zipf is 0)
  offensive : number;        // Severity from 1 (mild) to 4 (severe), or 0 if not offensive
}

export const OFFENSIVE_LABELS = ["", "Mildly offensive", "Offensive", "Strongly offensive", "Very offensive"];

export interface SearchOptions {
  anchorStart  : boolean;      // Matching words must start with the selected sounds
  anchorEnd    : boolean;      // Matching words must end with them
  stressLocked : Set<number>;  // Positions whose vowel must have the original's stress
  lettersOnly  : boolean;  // Skip entries like "abc's" and "a.m."
  words        : WordFilter;
  hideOffensive: boolean;
}

export interface Match {
  word        : string;
  phones      : string[];             // The matching pronunciation, with stress digits
  highlighted : Map<number, boolean>; // Matched phoneme index → whether it's the original sound
  extra       : number;               // Phonemes not covered by the selection
  substituted : number;               // Matched phonemes that are similar sounds, not the original
  score       : number;               // How far the word is from the selected sounds (0 = same)
  rank        : number;               // Frequency rank (1 = most common; Infinity if unknown)
}

// A word's English definitions for one part of speech, as plain text.
export interface Sense {
  partOfSpeech : string;
  definitions  : string[];
}

export interface Alternative {
  phone  : string;  // Base ARPAbet phoneme
  reason : string;  // How it differs from the original, e.g. "voiced" or "lower"
}

// IPA and an example word for each ARPAbet phoneme (from the CMUdict documentation).
export const PHONEMES: Record<string, { ipa: string; example: string }> = {
  AA: { ipa: "ɑ",  example: "odd"     }, AE: { ipa: "æ",  example: "at"      },
  AH: { ipa: "ʌ",  example: "hut"     }, AO: { ipa: "ɔ",  example: "ought"   },
  AW: { ipa: "aʊ", example: "cow"     }, AY: { ipa: "aɪ", example: "hide"    },
  B : { ipa: "b",  example: "be"      }, CH: { ipa: "tʃ", example: "cheese"  },
  D : { ipa: "d",  example: "dee"     }, DH: { ipa: "ð",  example: "thee"    },
  EH: { ipa: "ɛ",  example: "Ed"      }, ER: { ipa: "ɝ",  example: "hurt"    },
  EY: { ipa: "eɪ", example: "ate"     }, F : { ipa: "f",  example: "fee"     },
  G : { ipa: "ɡ",  example: "green"   }, HH: { ipa: "h",  example: "he"      },
  IH: { ipa: "ɪ",  example: "it"      }, IY: { ipa: "i",  example: "eat"     },
  JH: { ipa: "dʒ", example: "gee"     }, K : { ipa: "k",  example: "key"     },
  L : { ipa: "l",  example: "lee"     }, M : { ipa: "m",  example: "me"      },
  N : { ipa: "n",  example: "knee"    }, NG: { ipa: "ŋ",  example: "ping"    },
  OW: { ipa: "oʊ", example: "oat"     }, OY: { ipa: "ɔɪ", example: "toy"     },
  P : { ipa: "p",  example: "pee"     }, R : { ipa: "ɹ",  example: "read"    },
  S : { ipa: "s",  example: "sea"     }, SH: { ipa: "ʃ",  example: "she"     },
  T : { ipa: "t",  example: "tea"     }, TH: { ipa: "θ",  example: "theta"   },
  UH: { ipa: "ʊ",  example: "hood"    }, UW: { ipa: "u",  example: "two"     },
  V : { ipa: "v",  example: "vee"     }, W : { ipa: "w",  example: "we"      },
  Y : { ipa: "j",  example: "yield"   }, Z : { ipa: "z",  example: "zee"     },
  ZH: { ipa: "ʒ",  example: "seizure" },
};
const STRESS_NAMES = ["unstressed", "primary stress", "secondary stress"];
// IPA stress marks for stress digits 1 (primary) and 2 (secondary), written before the syllable.
const STRESS_MARKS = ["", "ˈ", "ˌ"];

// Consonant clusters that can start an English syllable, used to find where a stressed syllable
// begins (see stressMarkPositions). Any single consonant but NG can, too.
const ONSETS = new Set([
  "P R", "P L", "B R", "B L", "T R", "D R", "K R", "K L", "G R", "G L", "F R", "F L", "TH R", "SH R",
  "S P", "S T", "S K", "S M", "S N", "S L", "S W", "S F",
  "T W", "D W", "K W", "G W", "TH W",
  "P Y", "B Y", "K Y", "G Y", "F Y", "V Y", "M Y", "HH Y",  // As in "pure", "cute", "few", "music"
  "S P R", "S P L", "S T R", "S K R", "S K W", "S P Y", "S K Y",
]);

// ⋘──────── Similar sounds ────────⋙

// Vowel features, on the IPA vowel chart. Height runs from 0 (close) to 6 (open): close,
// near-close, close-mid, mid, open-mid, near-open, open. EY and OW are diphthongs in American
// English but are placed at their starting points, [e] and [o].
type Backness = "front" | "central" | "back";
const VOWELS: Record<string, { height: number; backness: Backness; rounded: boolean }> = {
  IY: { height: 0, backness: "front",   rounded: false },
  IH: { height: 1, backness: "front",   rounded: false },
  EY: { height: 2, backness: "front",   rounded: false },
  EH: { height: 4, backness: "front",   rounded: false },
  AE: { height: 5, backness: "front",   rounded: false },
  AH: { height: 4, backness: "central", rounded: false },
  AA: { height: 6, backness: "back",    rounded: false },
  AO: { height: 4, backness: "back",    rounded: true  },
  OW: { height: 2, backness: "back",    rounded: true  },
  UH: { height: 1, backness: "back",    rounded: true  },
  UW: { height: 0, backness: "back",    rounded: true  },
};
const MAX_HEIGHT_CHANGE = 2;  // How far apart in height two vowels can be and still count as close

// Vowels that the feature table doesn't cover: diphthongs, which change features partway
// through, and the r-colored ER.
const SPECIAL_VOWEL_ALTERNATIVES: Record<string, Alternative[]> = {
  AY: [{ phone: "AW", reason: "back glide" }, { phone: "OY", reason: "rounded" }],
  AW: [{ phone: "AY", reason: "front glide" }],
  OY: [{ phone: "AY", reason: "unrounded" }],
  ER: [{ phone: "AH", reason: "no r" }],
};

// Consonants that differ only in voicing.
const VOICING_PAIRS = [["P", "B"], ["T", "D"], ["K", "G"], ["F", "V"], ["TH", "DH"], ["S", "Z"], ["SH", "ZH"], ["CH", "JH"]];
const VOICED = new Set(VOICING_PAIRS.map(([, voiced]) => voiced));

// The vowels closest in height to `height`, among `candidates`, within MAX_HEIGHT_CHANGE.
function closestInHeight(height: number, candidates: string[]): string[] {
  const distance = (v: string) => Math.abs(VOWELS[v].height - height);
  const best = Math.min(...candidates.map(distance));
  return best <= MAX_HEIGHT_CHANGE ? candidates.filter((v) => distance(v) === best) : [];
}

// Sounds that differ from `phone` (a base phoneme) in one feature: for vowels, tongue height
// (higher or lower), rounding, or backness (front vs central vs back); for consonants, voicing.
export function alternativesOf(phone: string): Alternative[] {
  const pair = VOICING_PAIRS.find((p) => p.includes(phone));
  if (pair) {
    const other = pair[0] === phone ? pair[1] : pair[0];
    return [{ phone: other, reason: VOICED.has(other) ? "voiced" : "voiceless" }];
  }
  const special = SPECIAL_VOWEL_ALTERNATIVES[phone];
  const vowel   = VOWELS[phone];
  if (!vowel) {
    return special ?? [];
  }
  const others = Object.keys(VOWELS).filter((v) => v !== phone);
  const alternatives: Alternative[] = [];

  // Height: the nearest higher and nearest lower vowel with the same backness and rounding.
  const sameShape = others.filter((v) => VOWELS[v].backness === vowel.backness && VOWELS[v].rounded === vowel.rounded);
  const higher    = sameShape.filter((v) => VOWELS[v].height < vowel.height);
  const lower     = sameShape.filter((v) => VOWELS[v].height > vowel.height);
  if (higher.length > 0) {
    alternatives.push({ phone: higher.reduce((a, b) => VOWELS[a].height > VOWELS[b].height ? a : b), reason: "higher" });
  }
  if (lower.length > 0) {
    alternatives.push({ phone: lower.reduce((a, b) => VOWELS[a].height < VOWELS[b].height ? a : b), reason: "lower" });
  }

  // Rounding: same backness, opposite rounding, similar height.
  const otherRounding = others.filter((v) => VOWELS[v].backness === vowel.backness && VOWELS[v].rounded !== vowel.rounded);
  for (const v of closestInHeight(vowel.height, otherRounding)) {
    alternatives.push({ phone: v, reason: VOWELS[v].rounded ? "rounded" : "unrounded" });
  }

  // Backness: each other backness, similar height. English has no front rounded vowels and few
  // back unrounded ones, so if no vowel there shares the rounding, allow the other rounding.
  for (const backness of ["front", "central", "back"] as Backness[]) {
    if (backness === vowel.backness) {
      continue;
    }
    const there   = others.filter((v) => VOWELS[v].backness === backness);
    const matching = closestInHeight(vowel.height, there.filter((v) => VOWELS[v].rounded === vowel.rounded));
    for (const v of matching.length > 0 ? matching : closestInHeight(vowel.height, there)) {
      alternatives.push({ phone: v, reason: backness });
    }
  }
  if (phone === "AH") {
    alternatives.push({ phone: "ER", reason: "with r" });
  }
  return alternatives;
}

// ╭────────────────────────────────────────╮
// │          Dictionary and search         │
// ╰────────────────────────────────────────╯

export function parseDictionary(text: string): Dictionary {
  const dict: Dictionary = { words: [], stressed: [], index: new Map() };
  for (const line of text.split("\n")) {
    const tokens = line.split("#")[0].trim().split(/\s+/);
    if (tokens.length < 2) {
      continue;
    }
    const word   = tokens[0].replace(/\(\d+\)$/, "");  // "read(2)" → "read"
    const phones = " " + tokens.slice(1).join(" ") + " ";
    const i      = dict.words.length;
    dict.words.push(word);
    dict.stressed.push(phones);
    const indices = dict.index.get(word);
    if (indices) {
      indices.push(i);
    } else {
      dict.index.set(word, [i]);
    }
  }
  return dict;
}

// Lowercase word → its information, from pun_finder_words.tsv (most common first).
export function parseWordInfo(text: string): Map<string, WordInfo> {
  const info = new Map<string, WordInfo>();
  let rank = 0;
  for (const line of text.split("\n")) {
    if (!line || line.startsWith("#")) {
      continue;
    }
    const [display, zipfText, kind = "", offensive = ""] = line.split("\t");
    const zipf = Number(zipfText) || 0;
    rank++;
    info.set(display.toLowerCase(), {
      display, zipf, kind: kind.trim() as WordInfo["kind"], rank: zipf > 0 ? rank : Infinity,
      offensive: Number(offensive) || 0,
    });
  }
  return info;
}

// Phonemes as an array, from a padded pronunciation string.
function splitPhones(padded: string): string[] {
  return padded.trim().split(" ");
}

// Without its stress digit: "EH1" → "EH".
export function baseOf(phone: string): string {
  return phone.replace(/\d/g, "");
}

// A base phoneme with a stress digit added if it's a vowel (consonants have none): "AE", "1" → "AE1".
export function withStress(sound: string, stress: string): string {
  return sound in VOWELS || sound in SPECIAL_VOWEL_ALTERNATIVES ? sound + stress : sound;
}

// Every pronunciation of a word or phrase, as phoneme arrays. A phrase's pronunciations are all
// combinations of its words' pronunciations (capped). Returns the words not found, if any.
export function pronunciationsOf(input: string, dict: Dictionary): { pronunciations: string[][]; missing: string[] } {
  const words = input.toLowerCase().split(/\s+/).filter(Boolean);
  const missing = words.filter((word) => !dict.index.has(word));
  if (words.length === 0 || missing.length > 0) {
    return { pronunciations: [], missing };
  }
  let combos: string[][] = [[]];
  for (const word of words) {
    const variants = dict.index.get(word)!.map((i) => splitPhones(dict.stressed[i]));
    combos = combos.flatMap((prefix) => variants.map((v) => [...prefix, ...v]))
                   .slice(0, MAX_PHRASE_PRONUNCIATIONS);
  }
  return { pronunciations: combos, missing: [] };
}

// Groups sorted indices into runs of consecutive indices: [0, 1, 2, 5, 6] → [[0, 1, 2], [5, 6]].
export function runsOf(indices: number[]): number[][] {
  const runs: number[][] = [];
  for (const i of indices) {
    const last = runs[runs.length - 1];
    if (last && i === last[last.length - 1] + 1) {
      last.push(i);
    } else {
      runs.push([i]);
    }
  }
  return runs;
}

// Finds dictionary words whose pronunciation contains the selected sounds of `phones`.
export function findMatches(
  phones: string[], selection: Selection, exclude: Set<string>, dict: Dictionary,
  wordInfo: Map<string, WordInfo>, options: SearchOptions,
): Match[] {
  const positions = [...selection.keys()].sort((a, b) => a - b);
  if (positions.length === 0) {
    return [];
  }
  // Each position becomes an alternation of its selected sounds, each run of positions a capture
  // group, and runs are separated by one or more other phonemes. Vowels match any stress digit,
  // unless the position's stress is locked: then every alternative takes the original vowel's
  // stress. Strings are padded with spaces, so " L EH " can't match inside " L EHX ".
  const runs = runsOf(positions);
  const soundPattern = (i: number): string => {
    const stress = options.stressLocked.has(i) ? (phones[i].match(/\d/)?.[0] ?? "") : "\\d";
    const sounds = [...selection.get(i)!].map((sound) => withStress(sound, stress));
    return sounds.length === 1 ? sounds[0] : `(?:${sounds.join("|")})`;
  };
  const prefix  = options.anchorStart ? "^ " : " ";
  const suffix  = options.anchorEnd   ? " $" : " ";
  const body    = runs.map((run) => `(${run.map(soundPattern).join(" ")})`).join(" (?:[A-Z0-9]+ )+?");
  const pattern = new RegExp(prefix + body + suffix, "d");
  const targets = dict.stressed;

  const best = new Map<string, Match>();  // One match per word: its closest pronunciation
  for (let i = 0; i < targets.length; i++) {
    const word = dict.words[i];
    const info = wordInfo.get(word);
    // Without the word data (if it failed to load), every word is kept.
    const filtered = wordInfo.size > 0 && (
      (options.words !== "all" && !info?.kind) || (options.words === "common" && (info?.zipf ?? 0) < COMMON_ZIPF)
      || (options.hideOffensive && (info?.offensive ?? 0) > 0));
    if (exclude.has(word) || filtered || (options.lettersOnly && !/^[a-z]+$/.test(word))) {
      continue;
    }
    const target = targets[i];
    const found  = pattern.exec(target);
    if (!found) {
      continue;
    }
    // Convert each group's character offset into phoneme indices by counting the spaces before it.
    const matchPhones = splitPhones(target);
    const highlighted = new Map<number, boolean>();
    const extra = matchPhones.length - positions.length;
    let substituted = 0;
    let score = extra;
    runs.forEach((run, g) => {
      const first = target.slice(0, found.indices![g + 1][0]).split(" ").length - 2;
      run.forEach((position, k) => {
        const matched    = matchPhones[first + k];
        const isOriginal = baseOf(matched) === baseOf(phones[position]);
        highlighted.set(first + k, isOriginal);
        substituted += isOriginal ? 0 : 1;
        score += isOriginal ? 0 : SUBSTITUTION_COST;
        score += (matched.match(/\d/)?.[0] ?? "") === (phones[position].match(/\d/)?.[0] ?? "") ? 0 : STRESS_COST;
      });
    });
    const match: Match = { word, phones: matchPhones, highlighted, extra, substituted, score, rank: info?.rank ?? Infinity };
    const previous = best.get(word);
    if (!previous || match.score < previous.score) {
      best.set(word, match);
    }
  }
  return [...best.values()].sort(compareMatches);
}

// How closely a word matches, as a group number (lower is closer): by the number of similar
// sounds matched instead of the original ones (capped at MAX_SIMILAR_GROUP), then by the number
// of extra sounds (capped at MAX_EXTRA_GROUP). So all matches with only the original sounds come
// first, from fewest to most extra sounds, then those with one similar sound, and so on.
export function groupOf(match: Match): number {
  return Math.min(match.substituted, MAX_SIMILAR_GROUP) * (MAX_EXTRA_GROUP + 1)
    + Math.min(match.extra, MAX_EXTRA_GROUP);
}

// A group's number of similar sounds (its section) and of extra sounds (its subsection).
export function groupParts(group: number): { similar: number; extra: number } {
  return { similar: Math.floor(group / (MAX_EXTRA_GROUP + 1)), extra: group % (MAX_EXTRA_GROUP + 1) };
}

// Section heading and description, by the number of similar sounds.
export const SIMILAR_SECTIONS = [
  { title: "Exact sounds",                 description: "Every selected sound matches exactly." },
  { title: "One similar sound",            description: "One sound is swapped for a similar one (highlighted in blue)." },
  { title: "Two similar sounds",           description: "Two sounds are swapped for similar ones (highlighted in blue)." },
  { title: "Three or more similar sounds", description: "Three or more sounds are swapped for similar ones (highlighted in blue)." },
];

// Subsection heading, by the number of extra sounds: "No extra sounds", "1 extra sound", ...
export function extraLabel(extra: number): string {
  if (extra === 0) {
    return "No extra sounds";
  }
  return extra === MAX_EXTRA_GROUP ? `${extra} or more extra sounds` : `${extra} extra sound${extra === 1 ? "" : "s"}`;
}

// Closest group first; within a group, most common first, then alphabetical.
function compareMatches(a: Match, b: Match): number {
  return groupOf(a) - groupOf(b) || (a.rank === b.rank ? 0 : a.rank < b.rank ? -1 : 1) || a.word.localeCompare(b.word);
}

// ╭────────────────────────────────────────╮
// │        IPA and the selection URL       │
// ╰────────────────────────────────────────╯

// IPA for a phoneme, without stress. Unstressed AH and ER are reduced vowels, written as schwas.
export function ipaOf(phone: string): string {
  if (phone === "AH0") return "ə";
  if (phone === "ER0") return "ɚ";
  return PHONEMES[baseOf(phone)]?.ipa ?? phone;
}

// The stress mark for a phoneme ("ˈ", "ˌ", or "" for consonants and unstressed vowels).
export function stressMarkOf(phone: string): string {
  return STRESS_MARKS[Number(phone.match(/\d/)?.[0] ?? 0)] ?? "";
}

// Where to write each stress mark in a pronunciation: phoneme index → mark. As in dictionaries,
// the mark goes at the start of the stressed syllable, so it's placed before as many of the
// consonants preceding the vowel as can start a syllable (all of them, at the start of a word):
// "lettuce" is /ˈlɛtəs/, and "alligator" is /ˈæləˌɡeɪtɚ/.
export function stressMarkPositions(phones: string[]): Map<number, string> {
  const isVowel = (phone: string) => /\d/.test(phone);
  const marks = new Map<number, string>();
  phones.forEach((phone, i) => {
    const mark = stressMarkOf(phone);
    if (!mark) {
      return;
    }
    let start = i;
    const firstVowel = !phones.slice(0, i).some(isVowel);
    while (start > 0 && !isVowel(phones[start - 1])
           && (firstVowel || ONSETS.has(phones.slice(start - 1, i).map(baseOf).join(" "))
               || (start === i && baseOf(phones[start - 1]) !== "NG"))) {
      start--;
    }
    marks.set(start, mark);
  });
  return marks;
}

// A pronunciation in IPA with stress marks: ["L", "EH1", "T", "AH0", "S"] → "ˈlɛtəs".
export function ipaPronunciation(phones: string[]): string {
  const marks = stressMarkPositions(phones);
  return phones.map((phone, i) => (marks.get(i) ?? "") + ipaOf(phone)).join("");
}

// Sounds listed in the IPA guide, as [phoneme, example] (examples override PHONEMES'). Each
// voicing pair is kept together.
export const GUIDE_VOWELS: [string, string?][] = [
  ["IY1"], ["IH1"], ["EY1"], ["EH1"], ["AE1"], ["AH1"], ["AH0", "about"], ["AA1"], ["AO1"], ["OW1"],
  ["UH1"], ["UW1"], ["ER1"], ["ER0", "butter"], ["AY1"], ["AW1"], ["OY1"],
];
export const GUIDE_CONSONANTS: [string, string?][] = [
  ...VOICING_PAIRS.flat().map((phone): [string] => [phone]),
  ["HH"], ["M"], ["N"], ["NG"], ["L"], ["R"], ["W"], ["Y"],
];

export function describePhone(phone: string): string {
  const info   = PHONEMES[baseOf(phone)];
  const digit  = phone.match(/\d/)?.[0];
  const stress = digit ? `, ${STRESS_NAMES[Number(digit)]}` : "";
  return info ? `/${ipaOf(phone)}/ as in "${info.example}"${stress}` : phone;
}

// The selection as URL text: positions separated by ",", each optionally followed by ":" and its
// sounds joined with ".". A bare position means just the original sound. E.g. "0,1:EH.AE,2".
export function encodeSelection(selection: Selection, phones: string[]): string {
  return [...selection.keys()].sort((a, b) => a - b).map((i) => {
    const sounds = [...selection.get(i)!];
    return sounds.length === 1 && sounds[0] === baseOf(phones[i]) ? String(i) : `${i}:${sounds.join(".")}`;
  }).join(",");
}

export function decodeSelection(text: string, phones: string[]): Selection {
  const selection: Selection = new Map();
  for (const part of text.split(",").filter(Boolean)) {
    const [index, sounds] = part.split(":");
    const i = Number(index);
    if (!Number.isInteger(i) || i < 0 || i >= phones.length) {
      continue;
    }
    const valid = (sounds ? sounds.split(".") : [baseOf(phones[i])]).filter((sound) => sound in PHONEMES);
    if (valid.length > 0) {
      selection.set(i, new Set(valid));
    }
  }
  return selection;
}
