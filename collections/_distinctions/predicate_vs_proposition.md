---
published: false
title: Proposition vs. predicate vs. relation vs. propositional formula
kind: siblings
areas: [sets]
status: draft
summary: >
  A proposition is true or false. A predicate becomes a proposition once its variables are given values.
  A propositional formula becomes a proposition once its propositional variables are given truth values. A relation is the set of tuples that make a predicate true.
terms:
  - proposition
  - predicate
  - relation
  - propositional_formula
examples:
  - example: 7_is_prime
    why: >-
      It is true.
  - example: x_gt_3
    why: >-
      Its truth depends on $x$.
  - example: p_land_neg_q
    why: >-
      Its truth depends on the truth values of $p$ and $q$.
  - example: set_x_y_in_reals_squared_x_lt_y
    why: >-
      It is the set of pairs for which the predicate "$x < y$" is true.
see_also:
  - relation_vs_operator
  - equal_signs
---
## Notes

- An $n$-place predicate and an $n$-ary relation carry the same information: the relation is the set of tuples that satisfy the predicate (its _extension_).
- A predicate with all of its variables quantified, such as "for every $x$, $x^2 \geq 0$," is a proposition.
