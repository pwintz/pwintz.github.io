---
title: Formula vs. sentence
kind: hierarchy
areas: [sets]
summary: >
  In [first-order logic](/definitions/first-order-logic), statements about objects are written as strings of symbols with variables and [quantifiers](/definitions/quantifier).
  A [formula](/definitions/formula-logic) is every such string that is built by the rules of the language, such as $x > 3$ or $\forall x \, (x^2 \geq 0)$, and the variables in a formula can be free or bound by quantifiers.
  A [sentence](/definitions/sentence-logic) is a formula in which a quantifier binds every variable, so a sentence is true or false once its symbols are interpreted, without assigning values to variables.
relation: sentence ⊂ formula
terms:
  - formula_logic
  - sentence_logic
examples:
  - example: x_gt_3
    why: >-
      "$x > 3$" is a formula but not a sentence, because its variable $x$ is free.
  - example: exists_y_y_gt_x
    why: >-
      $\exists y \, (y > x)$ shows that a formula with a quantifier can still fail to be a sentence: the quantifier binds $y$ but leaves $x$ free.
  - example: for_all_x_x_squared_geq_0
  - example: x_squared_plus_1_as_an_expression
    why: >-
      $x^2 + 1$ is neither a formula nor a sentence, because $x^2 + 1$ is a term, which names a number instead of making a claim.
see_also:
  - sentence_vs_proposition
  - sentence_vs_propositional_formula
  - proposition_vs_predicate
---
## Notes

- Quantifying every free variable of a formula gives a sentence: $\forall x \, (x > 3)$ and $\exists x \, (x > 3)$ are sentences.
- A formula with free variables expresses a [predicate](/definitions/predicate), and a sentence expresses a [proposition](/definitions/proposition) once its symbols are interpreted.
