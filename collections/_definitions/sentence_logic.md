---
title: Sentence (logic)
term: sentence
applies_to: formulas in logic
synonyms: [closed formula]
levels:
  undergraduate:
    context: first-order logic
    text: |-
      Consider a formula of [first-order logic](/definitions/first-order-logic), such as $\forall x \, (x^2 \geq 0)$ or $x > 3$.
      The formula is a _sentence_ if it has no free variables: every variable in it is bound by a [quantifier](/definitions/quantifier).
properties:
  - >-
    Once its symbols are [interpreted](/definitions/interpretation-logic) in a structure (such as $\reals$ with its usual operations), a sentence is true or false, so it expresses a [proposition](/definitions/proposition).
  - >-
    A formula with free variables, such as $x > 3$, expresses a [predicate](/definitions/predicate).
    Quantifying every free variable turns it into a sentence.
---
In everyday grammar, a "sentence" is any complete sentence, including questions and commands, which are not propositions.

<!-- TODO: Note on the connection to everyday grammar. If you have an unbound variable x, then reading it as a natural language sentence does not give a complete statement: "x is greater than 3". The terms don't agree exactly, however. -->