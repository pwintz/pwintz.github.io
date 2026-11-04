---
published: false
title: Operation vs. relation
kind: siblings
areas: [sets]
status: draft
summary: >
  A binary relation takes two objects and says whether they are related (true or false).
  A binary operation takes two objects and produces a new object of the same type.
terms:
  - binary_operation
  - relation
examples:
  - example: eq_lt_and_subseteq
    why: >-
      $=$, $<$, and $\subseteq$ are relations because they make statements that are true or false: "$2 < 3$" is true and "$4 < 4$" is false.
      They are not binary operations, because they do not produce a new number or set.
  - example: plus_and_by_on_reals
    why: >-
      $+$ and $\times$ are binary operations on $\reals$ because they combine two real numbers into a new one: "$2 + 4$" produces $6$.
      They are not relations, because "$2 + 4$" is not true or false.
  - example: union_on_the_subsets_of_a_set_x
    why: >-
      $\cup$ is a binary operation on the subsets of $X$ because the union of two subsets of $X$ is a subset of $X$.
      It is not a relation, because "$A \cup B$" is not true or false.
  - example: subtraction_on_naturals
    why: >-
      Subtraction is not a binary operation on $\mathbb{N}$, because $3 - 5$ is not in $\mathbb{N}$ (it is one on $\mathbb{Z}$).
      It is not a relation, because "$5 - 3$" is not true or false.
see_also:
  - predicate_vs_proposition
  - types_of_maps
---
## Notes

- "$2 + 3 = 5$" combines both: $+$ is an operation that produces $5$, and $=$ is a relation that makes the whole statement a proposition.
- "Operator" is often used for "operation" in elementary arithmetic (the "plus operator"), but in analysis an operator is a map between vector spaces.
  See [types of maps](/distinctions/types-of-maps).
