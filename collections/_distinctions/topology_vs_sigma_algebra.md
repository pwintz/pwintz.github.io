---
title: Topology vs. σ-algebra
kind: siblings
areas: [topology, analysis, statistics]
summary: >
  Topologies and σ-algebras are both collections of [subsets](/definitions/subset) that are closed under some operations.
  A [topology](/definitions/topology) is closed under arbitrary [unions](/definitions/set-union) and finite [intersections](/definitions/set-intersection), and describes nearness.
  A [σ-algebra](/definitions/sigma-algebra) is closed under complements and [countable](/definitions/countable) unions, and describes what can be measured.
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

- The axioms differ in two ways: a [topology](/definitions/topology) allows any union (even [uncountable](/definitions/uncountable)) but not complements, while a [σ-algebra](/definitions/sigma-algebra) allows complements but only [countable](/definitions/countable) [unions](/definitions/set-union).

- [Continuous](/definitions/continuous) maps pull [open sets](/definitions/open-set) back to open sets; [measurable maps](/definitions/measurable-map) pull [measurable sets](/definitions/measurable-set) back to measurable sets.
