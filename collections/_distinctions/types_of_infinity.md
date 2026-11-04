---
published: false
title: Types of infinity
kind: family
areas: [sets, analysis]
status: draft
summary: >
  An infinite set has infinitely many elements, but it can be bounded.
  Infinite sets come in different sizes: countable and uncountable.
  A divergent sequence does not converge, but it need not go to infinity.
terms:
  - infinity
  - infinite_set
  - bounded
  - divergent
  - countably_infinite
  - uncountable
examples:
  - example: naturals
    why: >-
      $\mathbb{N}$ is countably infinite, and so infinite, because it can be listed as $0, 1, 2, \dots$.
      It is not bounded, because it has arbitrarily large elements, and it is not uncountable.
  - example: rationals_intersect_0_1
    why: >-
      $\mathbb{Q} \cap [0, 1]$ is countably infinite, and so infinite, because its infinitely many fractions can be listed.
      It is bounded, because all of its elements are between $0$ and $1$, and it is not uncountable.
  - example: closed_unit_interval
    why: >-
      $[0, 1]$ is uncountable, and so infinite, because Cantor's diagonal argument shows it cannot be listed.
      It is bounded, and it is not countably infinite.
  - example: sequence_alternating
    why: >-
      The sequence $1, -1, 1, -1, \dots$ is divergent because it does not converge.
      It is bounded, so it does not go to infinity.
  - example: the_sequence_1_2_3_etc
    why: >-
      The sequence $1, 2, 3, \dots$ is divergent because it diverges to $\infty$.
      It is not bounded.
  - example: infinity
    why: >-
      $\infty$ is infinity: a symbol (or an element of the extended reals) for something larger than every real number.
      It is not an infinite set, because it is not a set.
see_also:
  - finite_vs_countable_vs_uncountable
  - types_of_finite
  - types_of_size
---
## Notes

- A set is unbounded if it does not fit in any ball: for every $M > 0$, it has two points farther than $M$ apart.
  This requires a notion of distance, whereas being infinite does not.
- "Infinitely many" and "arbitrarily large" are different.
  The set $\lbrace 1/n : n \in \mathbb{N} \rbrace$ has infinitely many elements, none larger than $1$.
