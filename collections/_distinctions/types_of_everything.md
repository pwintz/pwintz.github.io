---
published: false
title: Dense vs. almost everywhere
kind: family
areas: [analysis, topology]
status: draft
summary: >
  Both terms mean "nearly everything," in different senses. A dense set is close to everything; an "almost everywhere" set misses only a set of measure zero.
  Neither implies the other.
terms:
  - dense_set
  - almost_everywhere
examples:
  - example: rationals_as_a_subset_of_reals
    why: >-
      Every interval contains a rational number, but $\mathbb{Q}$ has measure zero.
  - example: reals_minus_rationals_as_a_subset_of_reals
    why: >-
      Its complement $\mathbb{Q}$ has measure zero.
  - example: the_complement_of_a_fat_cantor_set_in_0_1
    why: >-
      The fat Cantor set contains no interval, but it has positive measure.
see_also:
  - types_of_sparsity
  - types_of_nothing
---
## Notes

- "Dense" has another meaning for matrices: a dense matrix has mostly nonzero entries, the opposite of a sparse matrix. It is unrelated to a dense set.
