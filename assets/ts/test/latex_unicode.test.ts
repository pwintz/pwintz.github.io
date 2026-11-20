import { test } from "node:test";
import assert from "node:assert/strict";
import { SYMBOLS, Segment, convertLatex, quoteList, searchSymbols, suggest } from "../src/latex_unicode/convert";

const text = (segments: Segment[]) => segments.map(s => s.text).join("");
const flagged = (segments: Segment[]) => segments.filter(s => s.unsupported).map(s => [s.text, s.unsupported!.summary]);

test("converts symbols, scripts, fractions, and roots", () => {
  assert.deepEqual(convertLatex("\\alpha^2 \\leq x_{12}"), [{ text: "α² ≤ x₁₂" }]);
  assert.equal(text(convertLatex("\\mathbb{R} \\in \\sqrt{x}")), "ℝ ∈ √x");
  assert.equal(text(convertLatex("\\frac{1}{2}")), "1/2");
  assert.equal(text(convertLatex("\\frac{1}{2}", { vulgarFractions: true })), "½");
  assert.match(text(convertLatex("\\frac{a}{b}", { display: true })), /a\n─+\n b/);
  assert.deepEqual(convertLatex(""), []);
});

test("scripts without Unicode versions are flagged with the missing characters", () => {
  const segments = convertLatex("x^π");
  assert.deepEqual(segments.map(s => s.text), ["x", "^π"]);
  assert.equal(segments[1].unsupported!.summary, "Unicode has no superscript “π”.");
  assert.match(segments[1].unsupported!.details!, /^Superscripts exist only for .* 2 .* β/);
  assert.deepEqual(flagged(convertLatex("x_{a→b}")), [["_{a→b}", "Unicode has no subscript “→” and “b”."]]);
});

test("unknown commands get a suggestion when one is close", () => {
  assert.deepEqual(flagged(convertLatex("\\alpah")), [["\\alpah", "UnicodeIt doesn't know \\alpah. Did you mean \\alpha?"]]);
  assert.deepEqual(flagged(convertLatex("\\zzzzzzzz")), [["\\zzzzzzzz", "UnicodeIt doesn't know \\zzzzzzzz."]]);
});

test("suggest prefers anagrams among equally close commands", () => {
  assert.equal(suggest("\\alpah"), "\\alpha");
  assert.equal(suggest("\\aplha"), "\\alpha");
  assert.equal(suggest("\\inn"), "\\in");
  assert.equal(suggest("\\sinn"), "\\sin");
  assert.equal(suggest("\\qqqqqq"), undefined);
});

test("commands missing arguments, or with unsupported ones", () => {
  assert.deepEqual(flagged(convertLatex("\\frac")), [["\\frac", "\\frac needs two arguments, like \\frac{a}{b}."]]);
  assert.deepEqual(flagged(convertLatex("\\hat")), [["\\hat", "\\hat needs an argument, like \\hat{x}."]]);
  const [cal] = convertLatex("\\mathcal{1}");
  assert.equal(cal.unsupported!.summary, "Unicode has no \\mathcal version of “1”.");
  assert.match(cal.unsupported!.details!, /^\\mathcal works for .* A .* z\.$/);
});

test("environments", () => {
  assert.deepEqual(flagged(convertLatex("\\begin{bmatrix} 1")), [["\\begin{bmatrix}", "The bmatrix environment isn't closed. Add \\end{bmatrix} after it."]]);
  assert.deepEqual(flagged(convertLatex("\\end{cases}")), [["\\end{cases}", "This \\end{cases} has no matching \\begin{cases} before it."]]);
  assert.deepEqual(flagged(convertLatex("\\begin")), [["\\begin", "\\begin needs an environment name in braces, like \\begin{bmatrix}."]]);
  assert.deepEqual(flagged(convertLatex("\\begin{bmat")), [["\\begin", "\\begin{bmat is missing its closing brace “}”."]]);
  const foo = convertLatex("\\begin{foo} a \\end{foo}");
  assert.equal(foo.filter(s => s.unsupported).length, 2);
  assert.equal(foo[0].unsupported!.summary, "The foo environment isn't supported.");
  assert.match(foo[0].unsupported!.details!, /and cases are converted\.$/);
  assert.equal(text(convertLatex("\\begin{pmatrix} 1 & 2 \\end{pmatrix}")).includes("\\"), false);
});

test("segments cover the whole output in order", () => {
  const segments = convertLatex("a \\foo b^π c");
  assert.equal(segments.length, 5);
  assert.deepEqual(segments.map(s => !!s.unsupported), [false, true, false, true, false]);
});

test("SYMBOLS are sorted shortest first", () => {
  for (let i = 1; i < SYMBOLS.length; i++) assert.ok(SYMBOLS[i - 1].command.length <= SYMBOLS[i].command.length);
  assert.ok(SYMBOLS.some(s => s.command === "\\hat{}" && s.symbol === "◌̂"));
});

test("searchSymbols by command or by symbol", () => {
  assert.deepEqual(searchSymbols("\\in").slice(0, 3).map(s => s.command), ["\\in", "\\inj", "\\int"]);
  assert.deepEqual(searchSymbols("in"), searchSymbols("\\in"));
  assert.ok(searchSymbols("ALPHA").some(s => s.command === "\\alpha"), "case-insensitive");
  assert.ok(searchSymbols(" α ").every(s => s.symbol === "α" || s.command.toLowerCase().includes("α")));
  assert.equal(searchSymbols("   ").length, SYMBOLS.length);
  assert.deepEqual(searchSymbols("no such command"), []);
});

test("quoteList", () => {
  assert.equal(quoteList([]), "");
  assert.equal(quoteList(["a"]), "“a”");
  assert.equal(quoteList(["a", "b"]), "“a” and “b”");
  assert.equal(quoteList(["a", "b", "c"]), "“a”, “b”, and “c”");
});
