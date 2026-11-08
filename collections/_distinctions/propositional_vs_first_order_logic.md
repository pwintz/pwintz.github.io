---
published: false
title: Zeroth-order (propositional) vs. first-order logic
kind: hierarchy
areas: [sets]
summary: >
  Formal logics differ in how far they look inside statements.
  [Propositional logic](/definitions/propositional-logic), also called zeroth-order logic, treats each statement as a unit $p$ that is true or false, and combines the units with [logical connectives](/definitions/logical-connective).
  [First-order logic](/definitions/first-order-logic) looks inside statements: a statement can say that [objects](/definitions/object-logic) have properties, and [quantifiers](/definitions/quantifier) can say "for all objects" or "there exists an object."
relation: propositional logic ⊂ first-order logic
terms:
  - propositional_logic
  - first_order_logic
examples:
  - example: p_land_neg_q
  - example: for_all_x_x_squared_geq_0
  - example: socrates_syllogism
    why: >-
      The Socrates argument is valid in first-order logic but not in propositional logic, because the validity depends on the shared parts "human," "mortal," and "Socrates" inside the statements, which propositional logic does not see.
see_also:
  - sentence_vs_propositional_formula
  - proposition_vs_propositional_formula
---
## Notes

- "Zeroth-order" fits the pattern of the names: [first-order logic](/definitions/first-order-logic) quantifies over objects, second-order logic also quantifies over sets of objects, and [zeroth-order logic](/definitions/propositional-logic) quantifies over nothing.
