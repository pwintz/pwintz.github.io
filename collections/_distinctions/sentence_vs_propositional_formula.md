---
title: Sentence vs. propositional formula
kind: siblings
areas: [sets]
summary: >
  Formal logic has formulas at two levels: [propositional logic](/definitions/propositional-logic) (zeroth-order logic), whose variables stand for whole statements, and [first-order logic](/definitions/first-order-logic), whose variables stand for objects such as numbers.
  A [sentence](/definitions/sentence-logic) is a formula of first-order logic in which a [quantifier](/definitions/quantifier), such as "for all" ($\forall$) or "there exists" ($\exists$), binds every variable, and the sentence is true or false once its symbols are interpreted, for example as statements about [real numbers](/definitions/real-number).
  A [propositional formula](/definitions/propositional-formula) is a formula of propositional logic, built from propositional variables with [logical connectives](/definitions/logical-connective) such as $\land$ and $\neg$, and the formula is true or false once each variable is assigned a truth value.
terms:
  - sentence_logic
  - propositional_formula
examples:
  - example: for_all_x_x_squared_geq_0
  - example: p_land_neg_q
  - example: every_square_nonnegative_and_no_square_negative
    why: >-
      The sentence $\forall x \, (x^2 \geq 0) \land \neg \exists x \, (x^2 < 0)$ has the propositional form $p \land \neg q$: the propositional formula records only how the statements are combined, and the sentence also says what the statements are about.
  - example: x_gt_3
    why: >-
      "$x > 3$" is neither a sentence nor a propositional formula: "$x > 3$" is a formula of first-order logic, but its variable $x$ is free, and $x$ stands for a number, not a proposition.
see_also:
  - sentence_vs_proposition
  - proposition_vs_propositional_formula
  - proposition_vs_predicate
---
## Notes

- The truth of a [propositional formula](/definitions/propositional-formula) depends on a truth assignment to its variables, and the truth of a sentence depends on an [interpretation](/definitions/interpretation-logic) of its symbols, such as the set the variables range over.
- Some books call every propositional formula without variables a "sentence" of [propositional logic](/definitions/propositional-logic); this page uses "sentence" in the first-order sense.
