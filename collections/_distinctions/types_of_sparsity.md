---
title: Types of set sparsity
kind: family
areas: [analysis, topology]
summary: >
  Several terms describe a set that is "small" or "negligible," even when it has infinitely many points.
  "[Nowhere dense](/definitions/nowhere-dense)" means small in a topological sense (and a [meager](/definitions/meager-set) set is a [countable](/definitions/countable) [union](/definitions/set-union) of nowhere dense sets), and "[measure zero](/definitions/measure-zero)" means small in a size sense.
  Neither implies the other.
  An [event](/definitions/event) of [probability zero](/definitions/probability-zero) is a set of measure zero for a [probability measure](/definitions/probability-measure).
terms:
  - measure_zero
  - nowhere_dense
  - meager_set
  - probability_zero
examples:
  - example: the_cantor_set
    why: >-
      The Cantor set is nowhere dense and has measure zero, even though it is uncountable.
  - example: rationals
  - example: a_fat_cantor_set
  - example: a_uniform_random_number_on_0_1_is_rational
see_also:
  - types_of_everything
  - types_of_nothing
---
## Notes

- A [countable](/definitions/countable) [union](/definitions/set-union) of [nowhere dense](/definitions/nowhere-dense) sets is called _meager_ (or of first category).
  The Baire category theorem says $\reals$ is not meager.
  
- "Almost every" means "except on a set of [measure zero](/definitions/measure-zero)," and "almost never" means "with [probability zero](/definitions/probability-zero)."
