---
published: false
title: Types of set sparsity
kind: family
areas: [analysis, topology]
status: draft
summary: >
  "Nowhere dense" means small in a topological sense, and "measure zero" means small in a size sense.
  Neither implies the other.
  An event of probability zero can still happen.
terms:
  - probability_zero
  - measure_zero
  - nowhere_dense
examples:
  - example: the_cantor_set
    why: >-
      The Cantor set is nowhere dense, because it contains no interval, and it has measure zero, because its total length is $0$.
      Both hold even though it is uncountable.
  - example: rationals
    why: >-
      $\mathbb{Q}$ has measure zero, because it is countable.
      It is not nowhere dense, because it is dense in $\reals$.
  - example: a_fat_cantor_set
    why: >-
      A fat Cantor set is nowhere dense, because it contains no interval.
      It does not have measure zero, because the intervals removed in its construction are small enough that it keeps a positive length.
  - example: a_uniform_random_number_on_0_1_is_rational
    why: >-
      This event has probability zero, because $\mathbb{Q} \cap [0, 1]$ has measure zero.
      It is not impossible, because every rational number in $[0, 1]$ is a possible outcome.
see_also:
  - types_of_everything
  - types_of_nothing
---
## Notes

- A countable union of nowhere dense sets is called _meager_ (or of first category).
  The Baire category theorem says $\reals$ is not meager.
- "Almost every" means "except on a set of measure zero," and "almost never" means "with probability zero."
