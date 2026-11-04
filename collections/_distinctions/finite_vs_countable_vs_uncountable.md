---
published: false
title: Finite vs. countable vs. uncountable
kind: hierarchy
areas: [sets, numbers]
status: draft
summary: >
  A finite set can be counted completely.
  A countable set can be listed one element at a time, even if the list never ends.
  An uncountable set is too large to list at all.
  Every set is either countable or uncountable.
relation: >
  finite ⊂ countable, and uncountable means "not countable."
  The countable sets that are not finite are the countably infinite sets.
terms:
  - finite_set
  - countable
  - uncountable
examples:
  - example: empty_set_example
    why: >-
      $\emptyset$ is finite because it has $0$ elements.
      So it is countable, and not uncountable.
  - example: set_1_2_3
    why: >-
      $\lbrace 1, 2, 3 \rbrace$ is finite because it has $3$ elements.
      So it is countable, and not uncountable.
  - example: naturals
    why: >-
      $\mathbb{N}$ is countable because the list $0, 1, 2, \dots$ reaches every natural number.
      It is not finite, because the list does not end.
  - example: integers
    why: >-
      $\mathbb{Z}$ is countable because the list $0, 1, -1, 2, -2, \dots$ reaches every integer.
      It is not finite, because the list does not end.
  - example: rationals_intersect_0_1
    why: >-
      $\mathbb{Q} \cap [0, 1]$ is countable because the fractions $p/q$ in $[0, 1]$ can be listed in order of their denominators $q$.
      It is not finite, because it contains $1/n$ for every $n \geq 1$.
  - example: closed_unit_interval
    why: >-
      $[0, 1]$ is uncountable because Cantor's diagonal argument shows that no list of numbers in $[0, 1]$ contains them all.
      So it is not finite or countable.
  - example: the_cantor_set
    why: >-
      The Cantor set is uncountable because its points correspond to the infinite sequences of $0$s and $2$s (their base-$3$ digits), and those cannot be listed.
      So it is not finite or countable.
  - example: power_set_of_naturals
    why: >-
      The set of all subsets of $\mathbb{N}$ is uncountable because, by Cantor's theorem, no list of subsets of $\mathbb{N}$ contains them all.
      So it is not finite or countable.
see_also:
  - types_of_infinity
  - types_of_size
---
## Notes

- "Countable" is used in two ways.
  In this dictionary it means finite or countably infinite, but some authors use it only for [countably infinite](/definitions/countably-infinite) sets.
  "At most countable" is unambiguous.
- Size and countability are different: the Cantor set has length $0$ but is uncountable, while $\mathbb{Q}$ is dense in $\reals$ but countable.
