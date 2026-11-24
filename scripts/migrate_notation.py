#!/usr/bin/env python3
"""Rewrite literal notation in the dictionary as the reader-selectable macros of _data/notation.yml.

For example, "\\operatorname{rank} A" becomes "\\rank{A}", "\\ker(A - \\lambda I)" becomes "\\nullspaceOf{A - \\lambda I}",
"A^{\\top}" becomes "A\\trans", and "\\mathbb{R}" becomes "\\reals". With the default choices, the pages look the same.

Text that is *about* a notation (for example, "some books write $\\operatorname{im} T$") must stay literal, so review the
diff, and list files that discuss notation in SKIP.

Usage:
  python3 scripts/migrate_notation.py            # List the changes.
  python3 scripts/migrate_notation.py --write    # Make them.
  python3 scripts/migrate_notation.py FILE ...   # Only these files.
"""
import glob
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "collections")
DIRS = ["_definitions", "_distinctions", "_examples"]

# Files that discuss a notation itself.
SKIP = {"transpose.md"}

# Operators written without parentheses: TeX of the operator → macro.
OPERATORS = {
    r"\operatorname{range}": "range",
    r"\ker": "nullspace",
    r"\operatorname{col}": "colspace",
    r"\operatorname{row}": "rowspace",
    r"\operatorname{rank}": "rank",
    r"\operatorname{nullity}": "nullity",
    r"\operatorname{tr}": "trace",
    r"\operatorname{span}": "Span",
    r"\operatorname{Re}": "realpart",
    r"\operatorname{Im}": "imagpart",
}

# A simple argument: a letter or digit with an optional subscript, a command such as \Phi, or a bmatrix.
SIMPLE_ARG = re.compile(
    r"\\begin\{bmatrix\}.*?\\end\{bmatrix\}|\\[A-Za-z]+|[A-Za-z0-9](?:_\{[^{}]*\}|_[A-Za-z0-9])?"
)

NUMBER_SETS = {"R": "reals", "N": "nats", "Z": "integers", "Q": "rationals", "C": "complexes"}


def balanced_parens(text, start):
    """Return the index just past the ")" that matches the "(" at `start`, or -1."""
    depth = 0
    for i in range(start, len(text)):
        if text[i] == "(":
            depth += 1
        elif text[i] == ")":
            depth -= 1
            if depth == 0:
                return i + 1
    return -1


def control_word(macro, following):
    """\\macro, with a space if the next character is a letter (so that "\\trans y" isn't read as "\\transy")."""
    return "\\" + macro + (" " if following[:1].isalpha() else "")


def rewrite_operators(text):
    pattern = re.compile("(" + "|".join(re.escape(k) for k in OPERATORS) + r")(?![A-Za-z])\s*")
    out, pos = [], 0
    for m in pattern.finditer(text):
        if m.start() < pos:
            continue
        name = OPERATORS[m.group(1)]
        after = m.end()
        if text.startswith("(", after):
            end = balanced_parens(text, after)
            if end < 0:
                continue
            inner = text[after + 1:end - 1]
            # span(...) takes its list directly; the others get the parenthesized \<name>Of form.
            replacement = "\\Span{" + inner + "}" if name == "Span" else "\\" + name + "Of{" + inner + "}"
        else:
            arg = SIMPLE_ARG.match(text, after)
            if not arg:
                continue
            end = arg.end()
            replacement = "\\" + name + "{" + arg.group(0) + "}"
        out.append(text[pos:m.start()])
        out.append(replacement)
        pos = end
    out.append(text[pos:])
    return "".join(out)


def rewrite(text):
    text = rewrite_operators(text)
    text = re.sub(r"\^\{\\top\}|\^\\top(?![A-Za-z])", lambda m: control_word("trans", text_after(m)), text)
    text = re.sub(r"\\mathbb\{([RNZQC])\}", lambda m: control_word(NUMBER_SETS[m.group(1)], text_after(m)), text)
    return text


def text_after(m):
    return m.string[m.end():m.end() + 1]


def main():
    write = "--write" in sys.argv
    files = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not files:
        files = sorted(f for d in DIRS for f in glob.glob(os.path.join(ROOT, d, "*.md")))
    changed = 0
    for path in files:
        if os.path.basename(path) in SKIP:
            continue
        old = open(path).read()
        new = rewrite(old)
        if new == old:
            continue
        changed += 1
        if write:
            open(path, "w").write(new)
        else:
            print(os.path.relpath(path, ROOT))
            for a, b in zip(old.splitlines(), new.splitlines()):
                if a != b:
                    print("  -", a.strip()[:150])
                    print("  +", b.strip()[:150])
    print(f"{changed} files {'changed' if write else 'would change'}.")


if __name__ == "__main__":
    main()
