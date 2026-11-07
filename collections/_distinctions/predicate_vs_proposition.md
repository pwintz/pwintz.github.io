---
published: false
title: Types of logical statements
kind: siblings
areas: [sets]
status: draft
summary: >
  Logic distinguishes statements by whether, and how, they can be true or false.
  An expression names an object, such as a number, and is not true or false.
  A proposition is true or false.
  A predicate becomes a proposition once its variables are given values.
  A propositional formula becomes a proposition once its propositional variables are given truth values.
  A sentence is a formula of logic with no free variables, so it expresses a proposition once its symbols are interpreted.
  A relation is the set of tuples that make a predicate true.
terms:
  - expression
  - proposition
  - predicate
  - sentence_logic
  - propositional_formula
  - relation
examples:
  - example: x_squared_plus_1_as_an_expression
    why: >-
      $x^2 + 1$ is an expression, because it names a number once $x$ is given.
      It is not a proposition, a predicate, or a sentence, because it has no relation sign, so it is never true or false.
  - example: 7_is_prime
    why: >-
      "$7$ is prime" is a proposition because it is true.
      It is not a predicate or a propositional formula, because it has no variables, and it is not an expression, because it is a statement, not a name for an object.
  - example: x_gt_3
    why: >-
      "$x > 3$" is a predicate because its truth depends on $x$.
      It is not a proposition, because it is not true or false until $x$ is given, and it is not a sentence, because $x$ is free.
      It is not a relation, which is a set of pairs.
  - example: for_all_x_x_squared_geq_0
    why: >-
      $\forall x \, (x^2 \geq 0)$ is a sentence, because the quantifier binds its only variable $x$.
      With $x$ ranging over $\reals$, it is a true proposition, and it is not a predicate or an expression.
  - example: p_land_neg_q
    why: >-
      $p \land \neg q$ is a propositional formula because its truth depends on the truth values of $p$ and $q$.
      It is not a proposition, because it is not true or false by itself, and it is not a predicate, because $p$ and $q$ stand for propositions, not objects.
      It is not a sentence of first-order logic, because it is a formula of propositional logic.
  - example: set_x_y_in_reals_squared_x_lt_y
    why: >-
      $\setdef{(x, y) \in \reals^2 \suchthat x < y}$ is a relation: the set of pairs for which the predicate "$x < y$" is true.
      It is not a predicate or a proposition, because it is a set, not a statement.
see_also:
  - types_of_results
  - relation_vs_operator
  - equal_signs
---
## Notes

- An $n$-place predicate and an $n$-ary relation carry the same information: the relation is the set of tuples that satisfy the predicate (its _extension_).
- A predicate with all of its variables quantified, such as "for every $x$, $x^2 \geq 0$," is a proposition.
