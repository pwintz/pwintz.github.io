"""
Generates assets/data/pun_finder_words.tsv, the word data for the Pun Finder tool
(collections/_pages/pun_finder.html and assets/ts/src/pun_finder.ts).

For every word in the CMU Pronouncing Dictionary, it records how common the word is, using
wordfreq (which combines Wikipedia, books, news, the web, subtitles, and social media), and
whether it's a real English word, using the Hunspell en_US spelling dictionary (from SCOWL):
  - "w": a dictionary word, e.g. "snared" or "assort" (inflected forms count).
  - "n": a proper noun, listed in the spelling dictionary only capitalized, e.g. "Caitlin".
  - "":  neither; mostly rare surnames and spellings that CMUdict includes, e.g. "flett".

It also flags offensive words (profanity, slurs, and crude slang), using dsojevic/profanity-list,
which rates each entry from 1 (mild) to 4 (severe). Entries match whole words and their simple
inflections ("bitches", "fucking"), plus hyphenated compounds containing one ("dumb-ass"). The
list's partial matching isn't used, since in a dictionary it flags innocent words like "grape"
and "therapist". NOT_OFFENSIVE removes entries that are clinical or everyday words.

The output lists words from most to least common, so a word's line number among the data lines
is its frequency rank. Each line is "word<TAB>zipf<TAB>kind<TAB>offensive", where word is spelled
as it should be displayed (proper nouns capitalized), zipf is wordfreq's Zipf frequency (log10
of the word's frequency per billion words, so 3 is once per million words), and offensive is
the severity from 1 to 4, or empty. Words that wordfreq doesn't know have a Zipf frequency of 0
and come last, alphabetically.

Usage (needs internet access to download the dictionaries):
    pip install wordfreq spylls
    python dev/generate_pun_finder_words.py

The data is derived from wordfreq (CC BY-SA 4.0), CMUdict (BSD), SCOWL/Hunspell (MIT-like), and
dsojevic/profanity-list (MIT).
"""

import json
import os
import re
import tempfile
import urllib.request

import wordfreq
from spylls.hunspell import Dictionary

# Pinned to the same commits as the URLs in pun_finder.ts, so that the words match.
CMUDICT_URL = "https://raw.githubusercontent.com/cmusphinx/cmudict/74790861f652b15e4ac49015a90074ad62a27690/cmudict.dict"
HUNSPELL_URL = "https://raw.githubusercontent.com/wooorm/dictionaries/8cfea406b505e4d7df52d5a19bce525df98c54ab/dictionaries/en/index"
PROFANITY_URL = "https://raw.githubusercontent.com/dsojevic/profanity-list/c27924319aa9bd6f917e3782b4f4b6604a50b652/en.json"
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "assets", "data", "pun_finder_words.tsv")

# Words in the profanity list whose usual meaning is clinical, technical, or everyday rather
# than offensive, so flagging (and hiding) them would mostly hide innocent puns.
NOT_OFFENSIVE = {
    # Anatomy and medicine
    "anal", "anus", "breasts", "genitals", "nipple", "nipples", "penis", "penises", "rectum",
    "semen", "vagina", "vaginal", "clitoris", "masturbate", "masturbated", "masturbates",
    "masturbating", "masturbation", "ejaculate", "ejaculation", "orgasm", "orgasms",
    # Neutral words for sex, nudity, and crimes
    "sex", "sexes", "intercourse", "lovemaking", "nude", "nudes", "nudity", "topless",
    "porn", "porno", "pornographic", "pornography", "incest", "bestiality", "pedophile",
    "pedophiles", "pedophilia", "rape", "raped", "rapes", "raping", "rapist", "rapists",
    "sodomy", "threesome", "vibrator", "vibrators", "swastika", "swastikas",
    # Everyday words with other main meanings
    "hell", "christ", "jesus", "bloody", "snatch", "snatched", "snatches", "snatching",
    "collared", "domination", "fingered", "fingering", "snowballing", "pegging", "pansy",
    "spunk", "spunky", "skeet", "playboy", "grope", "groped", "gropes", "panties", "viagra",
    # Inflections and names that happen to match an entry
    "spices", "spiced", "spicing", "cocked", "cocking", "half-cocked", "half-cock", "dicker",
    "dickers", "retarding", "cummings", "sexed", "negros",
}

# Compounds that the whole-word matching misses because they aren't hyphenated.
OFFENSIVE_COMPOUNDS = {
    "motherfucker": 4, "motherfuckers": 4, "motherfucking": 4, "jackass": 1,
    "dickhead": 2, "shitload": 2, "whorehouse": 3,
}

INFLECTIONS = ["s", "es", "ed", "d", "er", "ers", "ing", "in'", "'s"]


def download(url: str) -> str:
    with urllib.request.urlopen(url) as response:
        return response.read().decode("utf-8")


def cmudict_words() -> list[str]:
    """Every distinct word in CMUdict, without variant markers like "(2)"."""
    words = set()
    for line in download(CMUDICT_URL).splitlines():
        tokens = line.split("#")[0].split()
        if len(tokens) >= 2:
            words.add(tokens[0].split("(")[0])
    return sorted(words)


def load_hunspell() -> tuple[Dictionary, dict[str, str]]:
    """The spelling dictionary, and lowercase → spelling for entries with capitals (e.g. "McDonald")."""
    directory = tempfile.mkdtemp()
    dic_text = download(HUNSPELL_URL + ".dic")
    for extension, text in [(".dic", dic_text), (".aff", download(HUNSPELL_URL + ".aff"))]:
        with open(os.path.join(directory, "en_US" + extension), "w", encoding="utf-8") as file:
            file.write(text)
    capitalized = {}
    for line in dic_text.splitlines()[1:]:   # The first line is the entry count
        entry = line.split("/")[0].strip()
        if entry and entry != entry.lower():
            capitalized.setdefault(entry.lower(), entry)
    return Dictionary.from_files(os.path.join(directory, "en_US")), capitalized


def classify(word: str, dictionary: Dictionary, capitalized: dict[str, str]) -> tuple[str, str]:
    """(display spelling, kind) for a lowercase CMUdict word; see the module docstring."""
    if dictionary.lookup(word):
        return word, "w"
    for spelling in [capitalized.get(word), word[:1].upper() + word[1:]]:
        if spelling and dictionary.lookup(spelling):
            return spelling, "n"
    return word, ""


def profanity_patterns() -> list[tuple[re.Pattern, int]]:
    """(regex for a whole word, severity) for each term in the profanity list."""
    patterns = []
    for entry in json.loads(download(PROFANITY_URL)):
        for term in entry["match"].split("|"):
            # "*" lets the previous letter repeat, to catch spellings like "biiitch" in chat
            # messages. Dictionary words aren't spelled that way, and allowing it causes false
            # matches ("shi*t" matching "Shiites"), so it's dropped.
            term = term.strip().replace("*", "")
            if term in NOT_OFFENSIVE:
                continue   # So that inflections like "hell's" and "snatcher" aren't flagged either
            body = re.escape(term)
            # Inflections may double the last letter: "shit" → "shitty", "crap" → "crappy".
            last = re.escape(term[-1])
            suffixes = "|".join(re.escape(s) for s in INFLECTIONS)
            regex = re.compile(rf"^(?:{body})(?:(?:{suffixes})|{last}(?:y|ier|iest|ed|ing|er|ers))?$")
            patterns.append((regex, entry["severity"]))
    return patterns


def offensive_severity(word: str, patterns: list[tuple[re.Pattern, int]]) -> int:
    """The highest severity among the profanity terms that this word (or part of it) is, or 0."""
    if word in NOT_OFFENSIVE:
        return 0
    if word in OFFENSIVE_COMPOUNDS:
        return OFFENSIVE_COMPOUNDS[word]
    parts = word.split("-") if "-" in word else [word]
    return max((severity for part in parts if part not in NOT_OFFENSIVE
                for regex, severity in patterns if regex.match(part)), default=0)


def main() -> None:
    words = cmudict_words()
    dictionary, capitalized = load_hunspell()
    patterns = profanity_patterns()
    rows = []
    for word in words:
        spelling, kind = classify(word, dictionary, capitalized)
        severity = offensive_severity(word, patterns)
        rows.append((spelling, wordfreq.zipf_frequency(word, "en", wordlist="large"), kind, severity or ""))
    rows.sort(key=lambda row: (-row[1], row[0].lower()))

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as file:
        file.write("# Word data for the Pun Finder, generated by dev/generate_pun_finder_words.py; see it for details.\n")
        file.write("# Frequencies from wordfreq (https://github.com/rspeer/wordfreq), CC BY-SA 4.0.\n")
        file.write("# word\tzipf\tkind (w: dictionary word, n: proper noun, empty: neither)\toffensive (severity 1-4, or empty)\n")
        for spelling, zipf, kind, severity in rows:
            file.write(f"{spelling}\t{zipf:g}\t{kind}\t{severity}\n")
    print(f"Wrote {len(rows)} words to {os.path.normpath(OUTPUT_PATH)}")


if __name__ == "__main__":
    main()
