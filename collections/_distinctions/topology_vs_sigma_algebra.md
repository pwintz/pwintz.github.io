---
title: Topology vs. σ-algebra
kind: siblings
areas: [topology, analysis, statistics]
summary: >
  Topologies and σ-algebras are both collections of [subsets](/dictionary/definitions/subset) that are closed under some operations.
  A [topology](/dictionary/definitions/topology) is closed under arbitrary [unions](/dictionary/definitions/set-union) and finite [intersections](/dictionary/definitions/set-intersection), and describes nearness.
  A [σ-algebra](/dictionary/definitions/sigma-algebra) is closed under complements and [countable](/dictionary/definitions/countable) unions, and describes what can be measured.
terms:
  - topology
  - sigma_algebra
  - open_set
  - measurable_set
  - continuous
  - measurable_map
examples:
  - example: partition_collection_1_23
  - example: sierpinski_collection
  - example: power_set_collection
  - example: open_sets_of_reals
  - example: borel_sets_of_reals
  - example: finite_or_cofinite_subsets
  - example: indicator_of_rationals_borel
    why: >-
      The indicator function of $\mathbb{Q}$ shows that a measurable map need not be continuous: a σ-algebra has many more sets than a topology, so measurability is a much weaker condition.
see_also:
  - interior_vs_exterior_vs_boundary
  - types_of_sparsity
---
## Notes

- The axioms differ in two ways: a [topology](/dictionary/definitions/topology) allows any union (even [uncountable](/dictionary/definitions/uncountable)) but not complements, while a [σ-algebra](/dictionary/definitions/sigma-algebra) allows complements but only [countable](/dictionary/definitions/countable) [unions](/dictionary/definitions/set-union).

- [Continuous](/dictionary/definitions/continuous) maps pull [open sets](/dictionary/definitions/open-set) back to open sets; [measurable maps](/dictionary/definitions/measurable-map) pull [measurable sets](/dictionary/definitions/measurable-set) back to measurable sets.
