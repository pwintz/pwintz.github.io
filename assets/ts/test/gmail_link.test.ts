import { test } from "node:test";
import assert from "node:assert/strict";
import { convertUrl, emailFor, emailProblem, encodeEmail, readableHref, trimTrailingBlanks } from "../src/gmail_link/convert";

const ACCOUNTS = ["me@gmail.com", "work@example.org", "", "a+b@x.co.uk"];

test("Gmail: /u/N becomes /a/email", () => {
  const r = convertUrl("https://mail.google.com/mail/u/1/#inbox/abc", ACCOUNTS);
  assert.deepEqual(r, { url: "https://mail.google.com/mail/a/work@example.org/#inbox/abc", index: 1, email: "work@example.org" });
});

test("Gmail: special characters in the email are encoded, except @", () => {
  const r = convertUrl("mail.google.com/mail/u/3/", ACCOUNTS);
  assert.equal(r.url, "https://mail.google.com/mail/a/a%2Bb@x.co.uk/");
  assert.equal(encodeEmail("a+b@x.com"), "a%2Bb@x.com");
});

test("Gmail: a bare /mail/ URL means account 0", () => {
  const r = convertUrl("https://mail.google.com/mail/#inbox", ACCOUNTS);
  assert.equal(r.url, "https://mail.google.com/mail/a/me@gmail.com/#inbox");
  assert.equal(r.index, 0);
  assert.match(r.note!, /u\/0/);
  assert.equal(convertUrl("https://mail.google.com/mail", ACCOUNTS).url, "https://mail.google.com/mail/a/me@gmail.com/");
});

test("other apps: /u/N moves to the authuser parameter", () => {
  const r = convertUrl("https://drive.google.com/drive/u/1/my-drive", ACCOUNTS);
  assert.equal(r.url, "https://drive.google.com/drive/my-drive?authuser=work@example.org");
  const docs = convertUrl("https://docs.google.com/document/d/XYZ/edit?usp=sharing&authuser=0", ACCOUNTS);
  assert.equal(docs.url, "https://docs.google.com/document/d/XYZ/edit?usp=sharing&authuser=me@gmail.com");
});

test("the /u/N match needs a whole path segment", () => {
  // "/u/12abc" is not an account index.
  assert.throws(() => convertUrl("https://drive.google.com/u/12abc/x", ACCOUNTS), /Couldn't find an account index/);
  const r = convertUrl("https://calendar.google.com/calendar/u/0", ACCOUNTS);
  assert.equal(r.url, "https://calendar.google.com/calendar?authuser=me@gmail.com");
});

test("URLs that already use an email", () => {
  const gmail = convertUrl("https://mail.google.com/mail/a/me@gmail.com/#inbox", ACCOUNTS);
  assert.equal(gmail.url, "https://mail.google.com/mail/a/me@gmail.com/#inbox");
  assert.equal(gmail.index, null);
  assert.match(gmail.note!, /already uses an email/);
  const drive = convertUrl("https://drive.google.com/drive/my-drive?authuser=me%40gmail.com", ACCOUNTS);
  assert.equal(drive.url, "https://drive.google.com/drive/my-drive?authuser=me@gmail.com");
});

test("an email in another app's path moves to authuser", () => {
  const r = convertUrl("https://drive.google.com/drive/a/me@gmail.com/my-drive", ACCOUNTS);
  assert.equal(r.url, "https://drive.google.com/drive/my-drive?authuser=me@gmail.com");
  assert.equal(r.email, "me@gmail.com");
  assert.match(r.note!, /Moved/);
});

test("subdomains of google.com are accepted; other hosts are not", () => {
  assert.doesNotThrow(() => convertUrl("https://google.com/u/0/", ACCOUNTS));
  for (const url of ["https://notgoogle.com/u/0/", "https://google.com.evil.org/u/0/", "https://example.org/u/0"]) {
    assert.throws(() => convertUrl(url, ACCOUNTS), /Only google.com/, url);
  }
});

test("input errors", () => {
  assert.throws(() => convertUrl("   ", ACCOUNTS), /Paste a URL first/);
  assert.throws(() => convertUrl("https://", ACCOUNTS), /valid URL/);
  assert.throws(() => convertUrl("https://mail.google.com/mail/u/2/", ACCOUNTS), /No email address is saved for account u\/2/);
  assert.throws(() => convertUrl("https://mail.google.com/mail/u/9/", ACCOUNTS), /No email address is saved for account u\/9/);
  assert.throws(() => convertUrl("https://mail.google.com/mail/u/0/", ["not an email"]), /needs fixing/);
  assert.throws(() => convertUrl("https://docs.google.com/document/d/X?authuser=abc", ACCOUNTS), /Couldn't find an account index/);
});

test("emailProblem", () => {
  assert.equal(emailProblem(0, ["me@gmail.com"]), "");
  assert.equal(emailProblem(0, [""]), "");
  assert.equal(emailProblem(5, []), "");
  assert.match(emailProblem(0, ["me@gmail"]), /valid email/);
  assert.match(emailProblem(0, ["me @gmail.com"]), /valid email/);
  assert.match(emailProblem(0, ["a@b@c.com"]), /valid email/);
  // The second copy (ignoring case and spaces) is the problem, not the first.
  assert.equal(emailProblem(0, ["me@gmail.com", " ME@gmail.com "]), "");
  assert.match(emailProblem(1, ["me@gmail.com", " ME@gmail.com "]), /already used for u\/0/);
});

test("emailFor trims the saved email", () => {
  assert.equal(emailFor(0, ["  me@gmail.com "]), "me@gmail.com");
});

test("readableHref leaves @ readable only in authuser", () => {
  const url = new URL("https://drive.google.com/x?q=a%40b&authuser=me%40gmail.com#h");
  assert.equal(readableHref(url), "https://drive.google.com/x?q=a%40b&authuser=me@gmail.com#h");
});

test("trimTrailingBlanks keeps blanks in the middle", () => {
  assert.deepEqual(trimTrailingBlanks(["a", "", "b", " ", ""]), ["a", "", "b"]);
  assert.deepEqual(trimTrailingBlanks(["", " "]), []);
  const input = ["a", ""];
  trimTrailingBlanks(input);
  assert.deepEqual(input, ["a", ""], "input unchanged");
});
