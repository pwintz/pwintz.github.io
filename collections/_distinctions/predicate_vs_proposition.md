---
published: false
title: Proposition vs. predicate vs. relation vs. propositional formula
kind: siblings
areas: [sets]
status: draft
summary: >
  A proposition is true or false.
  A predicate becomes a proposition once its variables are given values.
  A propositional formula becomes a proposition once its propositional variables are given truth values.
  A relation is the set of tuples that make a predicate true.
terms:
  - proposition
  - predicate
  - relation
  - propositional_formula
examples:
  - example: 7_is_prime
    why: >-
      "$7$ is prime" is a proposition because it is true.
      It is not a predicate or a propositional formula, because it has no variables.
  - example: x_gt_3
    why: >-
      "$x > 3$" is a predicate because its truth depends on $x$.
      It is not a proposition, because it is not true or false until $x$ is given, and it is not a relation, which is a set of pairs.
  - example: p_land_neg_q
    why: >-
      $p \land \neg q$ is a propositional formula because its truth depends on the truth values of $p$ and $q$.
      It is not a proposition, because it is not true or false by itself, and it is not a predicate, because $p$ and $q$ stand for propositions, not objects.
  - example: set_x_y_in_reals_squared_x_lt_y
    why: >-
      $\setdef{(x, y) \in \reals^2 \suchthat x < y}$ is a relation: the set of pairs for which the predicate "$x < y$" is true.
      It is not a predicate or a proposition, because it is a set, not a statement.
see_also:
  - relation_vs_operator
  - equal_signs
---
## Notes

- An $n$-place predicate and an $n$-ary relation carry the same information: the relation is the set of tuples that satisfy the predicate (its _extension_).
- A predicate with all of its variables quantified, such as "for every $x$, $x^2 \geq 0$," is a proposition.
