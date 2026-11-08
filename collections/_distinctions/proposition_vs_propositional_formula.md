---
title: Proposition vs. propositional formula
kind: siblings
areas: [sets]
summary: >
  In logic, statements are combined with [logical connectives](/definitions/logical-connective) such as "and" ($\land$), "or" ($\lor$), and "not" ($\neg$).
  A [proposition](/definitions/proposition) is a particular statement that is true or false, such as "$7$ is prime."
  A [propositional formula](/definitions/propositional-formula) is a pattern, such as $p \land \neg q$, built from propositional variables that stand for propositions, and the formula has a truth value only once each variable is assigned a truth value.
  Substituting a proposition for each variable in a propositional formula gives a proposition.
terms:
  - proposition
  - propositional_formula
examples:
  - example: 7_is_prime
  - example: p_land_neg_q
  - example: 7_is_prime_and_4_is_not_prime
    why: >-
      Substituting "$7$ is prime" for $p$ and "$4$ is prime" for $q$ in the formula $p \land \neg q$ gives the proposition "$7$ is prime and $4$ is not prime," which is true.
  - example: p_lor_neg_p
    why: >-
      The tautology $p \lor \neg p$ is true for every truth value of $p$, but $p \lor \neg p$ is still a formula, not a proposition, because $p \lor \neg p$ says nothing about a particular statement until $p$ is replaced.
see_also:
  - proposition_vs_predicate
---
## Notes

- A [propositional formula](/definitions/propositional-formula) plays the same role for propositions that an algebraic [expression](/definitions/expression) such as $x + 1$ plays for numbers: the formula has a value only once its variables have values.
