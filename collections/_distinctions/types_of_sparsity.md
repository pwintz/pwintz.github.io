---
published: false
title: Types of set sparsity
kind: family
areas: [analysis, topology]
status: draft
summary: >
  "Nowhere dense" means small in a topological sense, and "measure zero" means small in a size sense. Neither implies the other.
  An event of probability zero can still happen.
terms:
  - probability_zero
  - measure_zero
  - nowhere_dense
examples:
  - example: the_cantor_set
    why: >-
      It contains no interval, and its total length is $0$, even though it is uncountable.
  - example: rationals
    why: >-
      It is countable, so it has measure zero, but it is dense in $\reals$.
  - example: a_fat_cantor_set
    why: >-
      Built like the Cantor set, but removing smaller intervals so that the remaining set has positive length.
  - example: a_uniform_random_number_on_0_1_is_rational
    why: >-
      $\mathbb{Q} \cap [0, 1]$ has measure zero, so this event has probability zero, though it is not impossible.
see_also:
  - types_of_everything
  - types_of_nothing
---
## Notes

- A countable union of nowhere dense sets is called _meager_ (or of first category). The Baire category theorem says $\reals$ is not meager.
- "Almost every" means "except on a set of measure zero," and "almost never" means "with probability zero."
