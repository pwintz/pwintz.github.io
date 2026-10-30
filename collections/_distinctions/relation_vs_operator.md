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
      "$2 < 3$" is true and "$4 < 4$" is false. Neither produces a number.
  - example: plus_and_by_on_reals
    why: >-
      "$2 + 4$" produces a new number, $6$.
  - example: union_on_the_subsets_of_a_set_x
    why: >-
      The union of two subsets of $X$ is a subset of $X$.
  - example: subtraction_on_naturals
    why: >-
      $3 - 5$ is not in $\mathbb{N}$, so subtraction is not a binary operation on $\mathbb{N}$ (it is one on $\mathbb{Z}$).
see_also:
  - predicate_vs_proposition
  - types_of_maps
---
## Notes

- "$2 + 3 = 5$" combines both: $+$ is an operation that produces $5$, and $=$ is a relation that makes the whole statement a proposition.
- "Operator" is often used for "operation" in elementary arithmetic (the "plus operator"), but in analysis an operator is a map between vector spaces. See [types of maps](/distinctions/types-of-maps).
