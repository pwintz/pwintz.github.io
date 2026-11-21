import { test } from "node:test";
import assert from "node:assert/strict";
import { Block, esc, inlineHtml, inlinePlain, textBlocks, toHtml, toMarkdown, toPlain } from "../src/syllabus/markup";

test("esc escapes markup but keeps Markdown links", () => {
  assert.equal(esc("a*b* [x] {y}"), "a\\*b\\* \\[x\\] \\{y\\}");
  assert.equal(esc("see [the *site*](https://example.com)"), "see [the \\*site\\*](https://example.com)");
  assert.equal(esc("[Wiki](https://en.wikipedia.org/wiki/A_(b))"), "[Wiki](https://en.wikipedia.org/wiki/A_(b))");
});

test("inlineHtml renders emphasis, placeholders, and escapes", () => {
  assert.equal(inlineHtml("**bold** and *it*", "preview"), "<strong>bold</strong> and <em>it</em>");
  assert.equal(inlineHtml("a < b & c", "preview"), "a &lt; b &amp; c");
  assert.equal(inlineHtml("\\*not italic\\*", "preview"), "*not italic*");
  assert.equal(inlineHtml("{{Room}}", "preview"), `<mark class="syl-ph">Room</mark>`);
  assert.equal(inlineHtml("{{Room}}", "lms"), `<mark style="background: #fff3a8;">[Room]</mark>`);
});

test("inlineHtml makes safe links only", () => {
  assert.equal(inlineHtml("[site](https://a.org)", "preview"), `<a href="https://a.org" target="_blank" rel="noopener">site</a>`);
  assert.equal(inlineHtml("[site](www.a.org)", "preview"), `<a href="https://www.a.org" target="_blank" rel="noopener">site</a>`);
  assert.equal(inlineHtml("[bad](javascript:alert)", "preview"), "bad");
  assert.equal(inlineHtml("Go to https://a.org/x.", "preview"), `Go to <a href="https://a.org/x" target="_blank" rel="noopener">https://a.org/x</a>.`);
  assert.equal(inlineHtml("Email me@uni.edu.", "preview"), `Email <a href="mailto:me@uni.edu">me@uni.edu</a>.`);
});

test("inlinePlain strips markup", () => {
  assert.equal(inlinePlain("**Due** *Friday* at {{Time}}: [form](https://f.org) \\*"), "Due Friday at [Time]: form (https://f.org) *");
});

test("textBlocks splits paragraphs and bullets", () => {
  const blocks = textBlocks("First line\ncontinues.\n\n- one\n* two\nAfter list\n\n\n", "q1");
  assert.deepEqual(blocks, [
    { t: "p", text: "First line continues.", src: "q1" },
    { t: "ul", items: ["one", "two"], src: "q1" },
    { t: "p", text: "After list", src: "q1" },
  ]);
  assert.deepEqual(textBlocks("   "), []);
});

const DOC: Block[] = [
  { t: "h1", text: "Math 1", src: "title" },
  { t: "p", text: "Room {{Room}}", indent: true },
  { t: "ol", items: ["a", { text: "b", items: ["c"] }] },
  { t: "kv", rows: [["Instructor", [{ t: "p", text: "Ada" }]]] },
  { t: "table", head: ["Week", "Topic"], rows: [["1", "a|b"]] },
];

test("toMarkdown", () => {
  assert.equal(toMarkdown(DOC), [
    "# Math 1",
    "Room \\[Room\\]",
    "1. a\n2. b\n  - c",
    "**Instructor:** Ada",
    "| Week | Topic |\n| --- | --- |\n| 1 | a\\|b |",
  ].join("\n\n") + "\n");
});

test("toPlain", () => {
  assert.equal(toPlain(DOC), [
    "MATH 1",
    "Room [Room]",
    "1. a\n2. b\n  • c",
    "Instructor: Ada",
    "Week\tTopic\n1\ta|b",
  ].join("\n\n") + "\n");
});

test("toHtml: preview keeps source attributes and classes", () => {
  const html = toHtml(DOC, "preview");
  assert.match(html, /^<h1 data-src="title">Math 1<\/h1>/);
  assert.match(html, /<p style="padding-left: 40px;">Room <mark class="syl-ph">Room<\/mark><\/p>/);
  assert.match(html, /<ol><li>a<\/li><li>b<ul><li>c<\/li><\/ul><\/li><\/ol>/);
  assert.match(html, /<table class="syl-kv"><tbody><tr><th>Instructor<\/th><td><p>Ada<\/p><\/td><\/tr>/);
  assert.match(html, /<table class="syl-table"><thead><tr><th>Week<\/th><th>Topic<\/th><\/tr><\/thead>/);
});

test("toHtml: LMS output uses inline styles and no source attributes", () => {
  const html = toHtml(DOC, "lms");
  assert.doesNotMatch(html, /data-src|class=/);
  assert.match(html, /<table style="width: 100%;/);
  assert.match(html, /<th style="padding: 8px; text-align: right;/);
});

test("escaped asterisks stay in every output format", () => {
  for (const text of ["0.4 * exams + 0.6 * homework", "a*b and c*d", "2**3**4", "***", "\\ and *"]) {
    const escaped = esc(text);
    assert.equal(inlinePlain(escaped), text, `plain: ${text}`);
    assert.equal(inlineHtml(escaped, "preview"), text.replace(/&/g, "&amp;"), `html: ${text}`);
  }
});

test("an escaped asterisk inside emphasis doesn't end it", () => {
  assert.equal(inlineHtml("*a \\* b*", "preview"), "<em>a * b</em>");
  assert.equal(inlineHtml("**a \\** b**", "preview"), "<strong>a ** b</strong>");
  assert.equal(inlinePlain("*a \\* b*"), "a * b");
  assert.equal(inlinePlain("**a \\** b**"), "a ** b");
});

test("emphasis doesn't span lines", () => {
  assert.equal(inlineHtml("*a\nb*", "preview"), "*a\nb*");
});

test("bold italic", () => {
  assert.equal(inlineHtml("***x***", "preview"), "<strong><em>x</em></strong>");
  assert.equal(inlineHtml("say ***x y*** now", "lms"), "say <strong><em>x y</em></strong> now");
  assert.equal(inlinePlain("***x***"), "x");
});

test("inlinePlain handles markup inside links and emphasis", () => {
  assert.equal(inlinePlain("[**Form**](https://f.org)"), "Form (https://f.org)");
  assert.equal(inlinePlain("**see {{Room}}**"), "see [Room]");
  assert.equal(inlinePlain("[{{Name}}](https://x.org)"), "[Name] (https://x.org)");
});

const link = (url: string) => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`;

test("bare URLs keep balanced parentheses", () => {
  const wiki = "https://en.wikipedia.org/wiki/A_(b)";
  assert.equal(inlineHtml(`see ${wiki} now`, "preview"), `see ${link(wiki)} now`);
  assert.equal(inlineHtml(`see ${wiki}.`, "preview"), `see ${link(wiki)}.`);
  assert.equal(inlineHtml("(see https://a.org/x)", "preview"), `(see ${link("https://a.org/x")})`);
  assert.equal(inlineHtml("(see https://a.org/x).", "preview"), `(see ${link("https://a.org/x")}).`);
  assert.equal(inlineHtml("https://a.org/f(x)_(y)?", "preview"), `${link("https://a.org/f(x)_(y)")}?`);
  assert.equal(inlineHtml("https://a.org/x(", "preview"), `${link("https://a.org/x")}(`);
});

test("textBlocks reads numbered lists", () => {
  assert.deepEqual(textBlocks("1. one\n2) two\n10. ten"), [{ t: "ol", items: ["one", "two", "ten"], src: undefined }]);
  assert.deepEqual(textBlocks("Steps:\n1. one\n2. two\n- note\nDone."), [
    { t: "p", text: "Steps:", src: undefined },
    { t: "ol", items: ["one", "two"], src: undefined },
    { t: "ul", items: ["note"], src: undefined },
    { t: "p", text: "Done.", src: undefined },
  ]);
});

test("textBlocks needs a space after the number", () => {
  assert.deepEqual(textBlocks("2.5 hours a week"), [{ t: "p", text: "2.5 hours a week", src: undefined }]);
  assert.deepEqual(textBlocks("1.Intro"), [{ t: "p", text: "1.Intro", src: undefined }]);
});

test("numbered lists in plain text, Markdown, and HTML", () => {
  const blocks = textBlocks("1. one\n2. two");
  assert.equal(toPlain(blocks), "1. one\n2. two\n");
  assert.equal(toMarkdown(blocks), "1. one\n2. two\n");
  assert.equal(toHtml(blocks, "preview"), "<ol><li>one</li><li>two</li></ol>");
  assert.equal(toPlain([{ t: "ol", items: [{ text: "a", items: ["b"] }] }]), "1. a\n  • b\n");
});

test("plain lists have no bullets in HTML", () => {
  const html = toHtml([{ t: "ul", items: ["☐ Task"], src: "q", plain: true }], "lms");
  assert.equal(html, `<ul style="list-style: none; padding-left: 0;"><li>☐ Task</li></ul>`);
});
