#!/usr/bin/env python3
"""Link the first unlinked mention of each defined term in the Dictionary of Fine Distinctions.

Following the "Link other terms" rule in collections/README.md, the first mention of another defined
term in each unit of prose gets a link to the term's page, e.g., "[metric space](/dictionary/definitions/metric-space)".
The units are each level's `text` and `caveat` and each property of a definition, the `summary` of a
distinction, and the Markdown body of a definition or distinction.

The script does not link:
  - text inside math ($...$), code, existing links, italics, headings, or HTML comments,
  - a term inside a longer defined term (e.g., "ball" inside "open ball"); an existing link to the
    shorter term, such as "[vector](...) space", is widened to the longer term,
  - a term on its own page, or a term that is already linked in the same unit,
  - the words in AMBIGUOUS, which are usually used in an everyday sense. Link those by hand.

Usage:
  python3 scripts/link_dictionary_terms.py            # List the links that would be added.
  python3 scripts/link_dictionary_terms.py --write    # Add them.
  python3 scripts/link_dictionary_terms.py FILE ...   # Only these files.
"""
import glob
import os
import re
import sys

import yaml

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "collections")

# Terms that usually appear in an everyday sense. They are never linked automatically.
AMBIGUOUS = {
    # Words that the 2026-11-17 run linked in the wrong sense (a function's argument, the flow of water or of
    # a hybrid system, "sound like", a combination of things, singular perturbations, the north pole, ...).
    "argument", "flow", "sound", "valid", "combination", "singular", "symmetry", "prior", "pole", "affine",
    "symmetric",  # Linked by hand: symmetric operation, relation, or matrix, or symmetry of a shape.
    "set", "sets", "function", "functions", "map", "maps", "point", "points", "number", "numbers",
    "value", "values", "equal", "term", "terms", "factor", "factors", "root", "roots", "area", "volume",
    "length", "size", "average", "mean", "mode", "range", "image", "domain", "graph", "group", "field",
    "order", "rank", "dimension", "state", "input", "output", "system", "solution", "solutions",
    "limit", "error", "change", "difference", "distance", "zero", "one", "plot", "chart", "figure",
    "diagram", "curve", "edge", "edges", "boundary", "interior", "closure", "expression", "formula",
    "identity", "equation", "inequality", "collection", "sequence", "sequences", "vector", "vectors",
    "matrix", "matrices", "array", "arrays", "relation", "relations", "operation", "division",
    "addition", "insert", "append", "prepend", "proposition", "theorem", "lemma", "claim", "law",
    "theory", "hypothesis", "conjecture", "axiom", "assumption", "postulate", "measure", "integral",
    "derivative", "estimator", "filter", "predictor", "observer", "feedback", "safe", "uniform",
    "invariant", "constant", "stable", "finite", "infinite", "infinity",
    "complete", "equivalent", "congruent", "isomorphic", "identified", "trace", "span", "kernel",
    "transpose", "pivot", "coefficient", "ratio", "fraction", "minimum", "maximum", "lower bound",
    "linear", "differential", "normal", "shape", "unit", "grid", "partition", "target", "smooth",
    "event", "outcome", "sample point", "orthogonal", "perpendicular", "object", "objects", "interpretation", "interpretations", "interpreted",
    "element of", "maximal", "separated", "number of elements", "number of axes", "sentence",
    "algebra", "consistent",
}


# Phrases that contain a defined term in a different sense. They are never linked.
STOP_PHRASES = re.compile(
    r"probability spaces?|(?:converges?|convergence) in probability|continuous (?:random variables?|ones?|distributions?)|exterior derivatives?|affine (?:coordinates?|coordinate systems?|functions?|combinations?)|transforms? coordinates",
    re.I,
)


def slug_url(path):
    name = os.path.basename(path)[:-3]
    return "/dictionary/definitions/" + name.lower().replace("_", "-")


def load_terms():
    """Map each linkable phrase (lowercase) to the URL of its definition."""
    urls = {}
    for path in glob.glob(os.path.join(ROOT, "_definitions", "*.md")):
        front = open(path).read().split("---\n")[1]
        data = yaml.safe_load(front) or {}
        # Single-word synonyms (e.g., "list" for sequence) are too often everyday words, so only the
        # term itself and multiword synonyms are used.
        synonyms = [s for s in (data.get("synonyms") or []) if isinstance(s, str) and " " in s.strip()]
        for name in [data.get("term") or ""] + synonyms:
            name = re.sub(r"\s*\(.*?\)", "", str(name)).strip()
            if not name or "$" in name or name.lower() in AMBIGUOUS or len(name) < 4:
                continue
            for form in {name, name + "s", name + "es"}:
                urls.setdefault(form.lower(), set()).add(slug_url(path))
    # A phrase that names several definitions (e.g., "convergent") is ambiguous, so it is skipped.
    return {phrase: next(iter(u)) for phrase, u in urls.items() if len(u) == 1}


# Spans that must not be touched: math, code, links, italics, HTML comments.
PROTECTED = re.compile(
    r"\$\$.*?\$\$|\$[^$\n]*\$|`[^`]*`|\[[^\]]*\]\([^)]*\)|<!--.*?-->|(?<![\w\\])_[^_\n]+_(?!\w)|\*[^*\n]+\*",
    re.S,
)


# A link followed by one or two words, such as "[vector](/dictionary/definitions/vector) space".
LINK_THEN_WORDS = re.compile(r"\[([^\]$]+)\]\((/dictionary/definitions/[a-z0-9-]+)\)((?: [A-Za-z-]+){1,2})")


def extend_links(text, terms, log):
    """Widen a link to a longer defined term that it starts, e.g. "[vector] space" -> "[vector space]"."""
    def widen(m):
        words = m.group(3).split()
        for k in (2, 1):
            if len(words) < k:
                continue
            phrase = m.group(1) + " " + " ".join(words[:k])
            url = terms.get(phrase.lower())
            if url and url != m.group(2):
                log.append(f"{phrase!r} -> {url} (widened from {m.group(1)!r})")
                rest = " ".join(words[k:])
                return f"[{phrase}]({url})" + (" " + rest if rest else "")
        return m.group(0)
    return LINK_THEN_WORDS.sub(widen, text)


def link_unit(text, terms, own_url, log):
    """Link the first unlinked mention of each term in one unit of prose."""
    # Prefer the longer term: "[vector](…) space" becomes a link to "vector space".
    text = extend_links(text, terms, log)
    linked = set(re.findall(r"\]\((/dictionary/definitions/[a-z0-9-]+)\)", text)) | {own_url}
    protected = [m.span() for m in PROTECTED.finditer(text)]
    taken = list(protected)
    edits = []
    # Phrases in which a term is used in another sense, such as "probability" in "probability space".
    for m in STOP_PHRASES.finditer(text):
        taken.append(m.span())
    lower = text.lower()
    # Longest phrases first, so "open ball" wins over "ball".
    for phrase in sorted(terms, key=len, reverse=True):
        if phrase not in lower:
            continue
        url = terms[phrase]
        matches = list(re.finditer(r"(?<![\w\[/-])" + re.escape(phrase) + r"(?![\w\]-])", text, re.I))
        if url in linked:
            # Protect every mention, so a shorter term is not linked inside this one.
            taken.extend(m.span() for m in matches)
            continue
        for m in matches:
            a, b = m.span()
            if any(s < b and a < e for s, e in taken):
                continue
            # Skip headings.
            line_start = text.rfind("\n", 0, a) + 1
            if text[line_start:a].lstrip().startswith("#"):
                continue
            edits.append((a, b, url))
            linked.add(url)
            log.append(f"{m.group(0)!r} -> {url}")
            break
        # Protect every mention of this term, linked or not, from shorter terms.
        taken.extend(m.span() for m in matches)
    for a, b, url in sorted(edits, reverse=True):
        text = text[:a] + f"[{text[a:b]}]({url})" + text[b:]
    return text


def process(path, terms):
    text = open(path).read()
    own = slug_url(path) if "/_definitions/" in path else None
    _, front, body = text.split("---\n", 2)
    log = []
    lines = front.split("\n")
    out = []
    i = 0
    # Block scalars to process: text, caveat, summary, and the items under properties.
    in_properties = False
    while i < len(lines):
        line = lines[i]
        if re.match(r"^\S", line):
            in_properties = line.startswith("properties:")
        m = re.match(r"^(\s*)(?:(text|caveat|summary):|(- )) *[|>]-?\s*$", line)
        if m and (m.group(2) or (m.group(3) and in_properties)):
            indent = len(m.group(1))
            out.append(line)
            i += 1
            block = []
            while i < len(lines) and (not lines[i].strip() or len(lines[i]) - len(lines[i].lstrip()) > indent):
                block.append(lines[i])
                i += 1
            out.extend(link_unit("\n".join(block), terms, own, log).split("\n"))
            continue
        out.append(line)
        i += 1
    new_body = link_unit(body, terms, own, log)
    new = "---\n" + "\n".join(out) + "---\n" + new_body
    return new, log


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    write = "--write" in sys.argv
    paths = args or sorted(
        glob.glob(os.path.join(ROOT, "_definitions", "*.md")) + glob.glob(os.path.join(ROOT, "_distinctions", "*.md"))
    )
    terms = load_terms()
    total = 0
    for path in paths:
        new, log = process(path, terms)
        if not log:
            continue
        total += len(log)
        print(os.path.relpath(path, ROOT))
        for entry in log:
            print("   ", entry)
        if write:
            open(path, "w").write(new)
    print(f"{total} links {'added' if write else 'to add'}.")


if __name__ == "__main__":
    main()
