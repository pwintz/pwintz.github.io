import { test } from "node:test";
import assert from "node:assert/strict";
import {
  Match, SearchOptions, Selection, alternativesOf, baseOf, decodeSelection, describePhone,
  encodeSelection, extraLabel, findMatches, groupOf, groupParts, ipaOf, ipaPronunciation,
  parseDictionary, parseWordInfo, pronunciationsOf, runsOf, stressMarkPositions, withStress,
} from "../src/pun_finder/search";

const DICT = parseDictionary([
  "# a comment line",
  "lettuce L EH1 T AH0 S",
  "let L EH1 T",
  "letter L EH1 T ER0",
  "outlet AW1 T L EH2 T",
  "latte L AA1 T EY2",
  "led L EH1 D",
  "lead L IY1 D",
  "lead(2) L EH1 D # metal",
  "read R IY1 D",
  "read(2) R EH1 D",
  "a.m. EY2 EH1 M",
  "pal P AE1 L",
  "paul P AO1 L",
  "",
].join("\n"));

const INFO = parseWordInfo([
  "# word\tzipf\tkind\toffensive",
  "let\t5.5\tw",
  "lead\t5\tw",
  "letter\t4.8\tw",
  "read\t4.5\tw",
  "outlet\t3.5\tw",
  "lettuce\t3.2\tw",
  "led\t2.5\tw",
  "Paul\t4.4\tn",
  "pal\t3.1\tw\t1",
  "latte\t0\t",
].join("\n"));

const OPTIONS: SearchOptions = {
  anchorStart: false, anchorEnd: false, stressLocked: new Set(), lettersOnly: true, words: "all", hideOffensive: false,
};
const words = (matches: Match[]) => matches.map(m => m.word);
const select = (entries: [number, string[]][]): Selection => new Map(entries.map(([i, s]) => [i, new Set(s)]));

test("parseDictionary groups variants and skips blank and comment-only lines", () => {
  assert.deepEqual(DICT.index.get("lead"), [6, 7]);
  assert.equal(DICT.stressed[7], " L EH1 D ");
  assert.equal(DICT.words.length, 13);
  assert.ok(!DICT.index.has("#"));
});

test("parseWordInfo ranks by line and handles missing fields", () => {
  const let_ = INFO.get("let")!;
  assert.deepEqual(let_, { display: "let", zipf: 5.5, kind: "w", rank: 1, offensive: 0 });
  assert.equal(INFO.get("paul")!.display, "Paul");
  assert.equal(INFO.get("pal")!.offensive, 1);
  assert.equal(INFO.get("latte")!.rank, Infinity, "unknown frequency");
  assert.equal(INFO.get("latte")!.kind, "");
});

test("pronunciationsOf words and phrases", () => {
  assert.deepEqual(pronunciationsOf("Read", DICT).pronunciations, [["R", "IY1", "D"], ["R", "EH1", "D"]]);
  const phrase = pronunciationsOf(" read  lead ", DICT);
  assert.equal(phrase.pronunciations.length, 4);
  assert.deepEqual(phrase.pronunciations[0], ["R", "IY1", "D", "L", "IY1", "D"]);
  assert.deepEqual(pronunciationsOf("read xyzzy qq", DICT), { pronunciations: [], missing: ["xyzzy", "qq"] });
  assert.deepEqual(pronunciationsOf("   ", DICT), { pronunciations: [], missing: [] });
});

test("pronunciationsOf caps the combinations of a long phrase", () => {
  assert.equal(pronunciationsOf("read read read read read", DICT).pronunciations.length, 12);
});

test("findMatches: contiguous selection anywhere in a word", () => {
  const phones = ["L", "EH1", "T", "AH0", "S"];
  const matches = findMatches(phones, select([[0, ["L"]], [1, ["EH"]], [2, ["T"]]]), new Set(["lettuce"]), DICT, INFO, OPTIONS);
  // Sorted by extra sounds, then by frequency.
  assert.deepEqual(words(matches), ["let", "letter", "outlet"]);
  const outlet = matches.find(m => m.word === "outlet")!;
  assert.equal(outlet.extra, 2);
  assert.deepEqual([...outlet.highlighted], [[2, true], [3, true], [4, true]]);
  assert.equal(outlet.score, 2 + 0.25, "secondary stress costs a little");
});

test("findMatches: a word's closest pronunciation wins", () => {
  const matches = findMatches(["L", "EH1", "D"], select([[0, ["L"]], [1, ["EH", "IY"]], [2, ["D"]]]), new Set(), DICT, INFO, OPTIONS);
  const lead = matches.find(m => m.word === "lead")!;
  assert.deepEqual(lead.phones, ["L", "EH1", "D"]);
  assert.equal(lead.substituted, 0);
  assert.equal(matches.filter(m => m.word === "lead").length, 1);
});

test("findMatches: similar sounds count as substitutions", () => {
  const matches = findMatches(["L", "EH1", "D"], select([[0, ["L"]], [1, ["IY"]], [2, ["D"]]]), new Set(["lead"]), DICT, INFO, OPTIONS);
  assert.deepEqual(words(matches), []);
  const all = findMatches(["L", "EH1", "D"], select([[0, ["L"]], [1, ["IY"]], [2, ["D"]]]), new Set(), DICT, INFO, OPTIONS);
  assert.equal(all[0].substituted, 1);
  assert.equal(all[0].highlighted.get(1), false);
});

test("findMatches: gaps between runs need at least one phoneme", () => {
  const dict = parseDictionary("lt L T\nlat L AE1 T\nlast L AE1 S T");
  // L _ T: "lt" has nothing between L and T, so it doesn't match.
  const matches = findMatches(["L", "AE1", "T"], select([[0, ["L"]], [2, ["T"]]]), new Set(), dict, new Map(), OPTIONS);
  assert.deepEqual(words(matches), ["lat", "last"]);
  assert.deepEqual([...matches[1].highlighted.keys()], [0, 3]);
});

test("findMatches: anchors and stress locks", () => {
  const phones = ["L", "EH1", "T"];
  const sel = select([[0, ["L"]], [1, ["EH"]], [2, ["T"]]]);
  const end = findMatches(phones, sel, new Set(), DICT, INFO, { ...OPTIONS, anchorEnd: true });
  assert.deepEqual(words(end).sort(), ["let", "outlet"]);
  const start = findMatches(phones, sel, new Set(), DICT, INFO, { ...OPTIONS, anchorStart: true, anchorEnd: true });
  assert.deepEqual(words(start), ["let"]);
  const locked = findMatches(phones, sel, new Set(), DICT, INFO, { ...OPTIONS, stressLocked: new Set([1]) });
  assert.ok(!words(locked).includes("outlet"), "outlet's EH has secondary stress");
});

test("findMatches: word filters", () => {
  const phones = ["P", "AE1", "L"];
  const sel = select([[2, ["L"]]]);
  const run = (o: Partial<SearchOptions>) => words(findMatches(phones, sel, new Set(), DICT, INFO, { ...OPTIONS, ...o })).sort();
  assert.ok(run({}).includes("paul"));
  assert.ok(run({ words: "common" }).includes("paul"), "common names count as common words");
  assert.ok(run({ words: "dictionary" }).includes("paul"));
  const t = (o: Partial<SearchOptions>) => words(findMatches(["T"], select([[0, ["T"]]]), new Set(), DICT, INFO, { ...OPTIONS, ...o }));
  assert.ok(t({}).includes("latte"));
  assert.ok(!t({ words: "dictionary" }).includes("latte"), "neither a dictionary word nor a name");
  assert.ok(!run({ hideOffensive: true }).includes("pal"));
  assert.ok(!run({ words: "common" }).includes("led"), "led is too rare");
  // Without word data, nothing is filtered by frequency or kind.
  assert.ok(words(findMatches(["EH1", "M"], select([[1, ["M"]]]), new Set(), DICT, new Map(), { ...OPTIONS, lettersOnly: false, words: "common" })).includes("a.m."));
  assert.ok(!words(findMatches(["EH1", "M"], select([[1, ["M"]]]), new Set(), DICT, new Map(), { ...OPTIONS, words: "common" })).includes("a.m."));
});

test("findMatches with nothing selected", () => {
  assert.deepEqual(findMatches(["L"], new Map(), new Set(), DICT, INFO, OPTIONS), []);
});

test("findMatches: a pattern can't match part of a phoneme", () => {
  // AH must not match inside AH0's neighbor tokens like "AW1".
  const matches = findMatches(["AH1"], select([[0, ["AH"]]]), new Set(), DICT, INFO, OPTIONS);
  assert.deepEqual(words(matches), ["lettuce"]);
});

test("alternativesOf", () => {
  assert.deepEqual(alternativesOf("T"), [{ phone: "D", reason: "voiced" }]);
  assert.deepEqual(alternativesOf("ZH"), [{ phone: "SH", reason: "voiceless" }]);
  assert.deepEqual(alternativesOf("M"), []);
  assert.deepEqual(alternativesOf("ER"), [{ phone: "AH", reason: "no r" }]);
  assert.ok(alternativesOf("AH").some(a => a.phone === "ER" && a.reason === "with r"));
  for (const v of ["IY", "IH", "EY", "EH", "AE", "AH", "AA", "AO", "OW", "UH", "UW"]) {
    const alts = alternativesOf(v);
    assert.ok(alts.length > 0, v);
    assert.ok(alts.every(a => a.phone !== v), `${v} isn't its own alternative`);
    assert.equal(new Set(alts.map(a => a.phone)).size, alts.length, `${v} has no duplicates`);
  }
  const eh = alternativesOf("EH").map(a => `${a.phone}:${a.reason}`);
  assert.ok(eh.includes("IH:higher") || eh.includes("EY:higher"));
  assert.ok(eh.includes("AE:lower"));
});

test("small phoneme helpers", () => {
  assert.equal(baseOf("EH1"), "EH");
  assert.equal(withStress("AE", "1"), "AE1");
  assert.equal(withStress("AY", "\\d"), "AY\\d");
  assert.equal(withStress("T", "1"), "T");
  assert.deepEqual(runsOf([0, 1, 2, 5, 6, 9]), [[0, 1, 2], [5, 6], [9]]);
  assert.deepEqual(runsOf([]), []);
});

test("groups and labels", () => {
  const m = (substituted: number, extra: number) => ({ substituted, extra }) as Match;
  assert.equal(groupOf(m(0, 0)), 0);
  assert.equal(groupOf(m(0, 9)), 5);
  assert.equal(groupOf(m(1, 0)), 6);
  assert.equal(groupOf(m(7, 7)), 3 * 6 + 5);
  for (const [s, e] of [[0, 0], [1, 3], [3, 5]]) assert.deepEqual(groupParts(groupOf(m(s, e))), { similar: s, extra: e });
  assert.equal(extraLabel(0), "No extra sounds");
  assert.equal(extraLabel(1), "1 extra sound");
  assert.equal(extraLabel(2), "2 extra sounds");
  assert.equal(extraLabel(5), "5 or more extra sounds");
});

test("IPA", () => {
  assert.equal(ipaOf("AH0"), "ə");
  assert.equal(ipaOf("ER0"), "ɚ");
  assert.equal(ipaOf("XX"), "XX");
  assert.equal(ipaPronunciation(["L", "EH1", "T", "AH0", "S"]), "ˈlɛtəs");
  // The stress mark goes before consonants that can start a syllable.
  assert.equal(ipaPronunciation(["AE1", "L", "AH0", "G", "EY2", "T", "ER0"]), "ˈæləˌɡeɪtɚ");
  assert.equal(ipaPronunciation(["S", "T", "R", "IH1", "NG"]), "ˈstɹɪŋ");
  assert.deepEqual([...stressMarkPositions(["AH0", "S", "T", "R", "EY1"])], [[1, "ˈ"]]);
  // "NG" can't start a syllable, and "N T" isn't an onset, so only T moves.
  assert.deepEqual([...stressMarkPositions(["S", "IH1", "NG", "ER0", "IH0", "N", "T", "EH2", "N"])], [[0, "ˈ"], [6, "ˌ"]]);
  assert.match(describePhone("EH1"), /^\/ɛ\/ as in ".+", primary stress$/);
  assert.equal(describePhone("QQ"), "QQ");
});

test("selection URL text round-trips", () => {
  const phones = ["L", "EH1", "T"];
  const sel = select([[2, ["T"]], [0, ["L"]], [1, ["EH", "AE"]]]);
  const text = encodeSelection(sel, phones);
  assert.equal(text, "0,1:EH.AE,2");
  assert.deepEqual(decodeSelection(text, phones), sel);
});

test("decodeSelection skips invalid parts", () => {
  const phones = ["L", "EH1", "T"];
  assert.deepEqual(decodeSelection("", phones), new Map());
  assert.deepEqual(decodeSelection("-1,3,x,1.5,,2:QQ.T", phones), select([[2, ["T"]]]));
  assert.deepEqual(decodeSelection("1:QQ", phones), new Map());
});
