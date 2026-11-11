---
title: Proposition vs. predicate
kind: siblings
areas: [sets]
summary: >
  In logic, statements are classified by whether they include enough information to determine whether they are true or false.
  A [proposition](/dictionary/definitions/proposition) is a statement that is true or false, such as "$7 > 3$."
  A [predicate](/dictionary/definitions/predicate) is a statement with variables, such as "$x > 3$," that becomes a proposition once its variable $x$ is given a value, such as "$7 > 3$" (true) or bound by [quantifiers](/dictionary/definitions/quantifier), such as "$\forall x,\, x > 3$" (false).
terms:
  - proposition
  - predicate
examples:
  - example: 7_is_prime
  - example: x_gt_3
    why: >-
      "$x > 3$" is a predicate, and giving $x$ the value $5$ turns the predicate into the proposition "$5 > 3$," which is true.
  - example: for_all_x_x_squared_geq_0
    why: >-
      Binding the variable of the predicate "$x^2 \geq 0$" with the quantifier $\forall x$ turns the predicate into a proposition.
see_also:
  - proposition_vs_propositional_formula
  - sentence_vs_proposition
  - types_of_results
  - relation_vs_operator
  - equal_signs
---
## Notes

- An $n$-place [predicate](/dictionary/definitions/predicate) and an $n$-ary [relation](/dictionary/definitions/relation) carry the same information: the relation is the set of tuples that satisfy the predicate (its _extension_).
