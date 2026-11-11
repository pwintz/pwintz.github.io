---
published: false
title: Interpretation (logic)
term: interpretation
applies_to: formal languages
levels:
  high-school:
    text: |-
      Consider a statement written in symbols, such as $\exists x \, (x^2 = 2)$.
      An _interpretation_ of the statement says what the symbols mean: which objects the variables stand for, and what the other symbols, such as $=$ and the squaring operation, do.
      The same symbols can be true under one interpretation and false under another: $\exists x \, (x^2 = 2)$ is true if $x$ stands for [real numbers](/dictionary/definitions/real-number) and false if $x$ stands for [rational numbers](/dictionary/definitions/rational-number).
  undergraduate:
    context: first-order logic
    text: |-
      Consider a first-order language with constant symbols, function symbols, and relation symbols.
      An _interpretation_ of the language consists of

      1. a nonempty set $D$, called the _domain of discourse_, whose elements are the [objects](/dictionary/definitions/object-logic),
      2. an element of $D$ for each constant symbol,
      3. a function on $D$ with the same number of inputs for each function symbol, and
      4. a relation on $D$ with the same number of places for each relation symbol.
properties:
  - >-
    An interpretation gives each [sentence](/dictionary/definitions/sentence-logic) of the language a truth value, so a sentence expresses a [proposition](/dictionary/definitions/proposition) only once an interpretation is chosen.
  - >-
    An interpretation in which every sentence of a set $T$ is true is called a _model_ of $T$.
---
In everyday language, an "interpretation" is any explanation of what something means, as in the frequentist and Bayesian interpretations of [probability](/dictionary/definitions/probability); that meaning is not technical.
