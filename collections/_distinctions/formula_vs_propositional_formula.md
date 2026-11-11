---
published: false
title: Formula (first-order logic) vs. propositional formula
kind: siblings
areas: [sets]
summary: >
  Both [propositional logic](/dictionary/definitions/propositional-logic) and [first-order logic](/dictionary/definitions/first-order-logic) build formulas with [logical connectives](/dictionary/definitions/logical-connective), but the variables in the formulas stand for different things.
  A [propositional formula](/dictionary/definitions/propositional-formula), such as $p \land \neg q$, has variables that stand for whole statements, and the formula is true or false once each variable is given a truth value.
  A [formula](/dictionary/definitions/formula-logic) of first-order logic, such as $\forall x \, (x^2 \geq 0)$, has variables that stand for [objects](/dictionary/definitions/object-logic), such as numbers, and the formula can also use relation symbols, such as $\geq$, and [quantifiers](/dictionary/definitions/quantifier).
terms:
  - propositional_formula
  - formula_logic
examples:
  - example: p_land_neg_q
  - example: x_gt_3
  - example: for_all_x_x_squared_geq_0
  - example: every_square_nonnegative_and_no_square_negative
    why: >-
      The first-order formula $\forall x \, (x^2 \geq 0) \land \neg \exists x \, (x^2 < 0)$ has the shape of the propositional formula $p \land \neg q$: the propositional formula shows only how the two statements are combined, and the first-order formula also shows what each statement says about numbers.
see_also:
  - formula_vs_sentence
  - sentence_vs_propositional_formula
  - propositional_vs_first_order_logic
---
## Notes

- Some books treat each propositional variable as a relation symbol with no inputs, so that every [propositional formula](/dictionary/definitions/propositional-formula) is also a first-order formula; this page uses the more common convention that the two kinds of formulas belong to different languages.
