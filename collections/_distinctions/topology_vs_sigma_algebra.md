---
published: false
title: Topology vs. σ-algebra
kind: siblings
areas: [topology, analysis, statistics]
status: draft
summary: >
  Both are collections of subsets that are closed under some operations.
  A topology is closed under arbitrary unions and finite intersections, and describes nearness.
  A σ-algebra is closed under complements and countable unions, and describes what can be measured.
terms:
  - topology
  - sigma_algebra
examples:
  - example: partition_collection_1_23
    why: >-
      This collection is a topology on $X$ because it contains $\emptyset$ and $X$ and is closed under unions and intersections.
      It is a σ-algebra because it is also closed under complements: the complement of $\lbrace 1 \rbrace$ is $\lbrace 2, 3 \rbrace$.
  - example: sierpinski_collection
    why: >-
      This collection is a topology on $X$ because it contains $\emptyset$ and $X$ and is closed under unions and intersections.
      It is not a σ-algebra, because the complement $\lbrace 2 \rbrace$ of $\lbrace 1 \rbrace$ is missing.
  - example: power_set_collection
    why: >-
      The power set of $X$ is a topology and a σ-algebra on $X$, because it contains every subset of $X$, so it is closed under every set operation.
  - example: open_sets_of_reals
    why: >-
      The open sets of $\reals$ form a topology because unions and finite intersections of open sets are open.
      They do not form a σ-algebra, because the complement $\reals \setminus (0, 1)$ of the open set $(0, 1)$ is not open.
  - example: borel_sets_of_reals
    why: >-
      The Borel sets of $\reals$ form a σ-algebra: the smallest σ-algebra that contains the open sets.
      They do not form a topology, because every set is a union of singletons, which are Borel, but not every set is Borel.
  - example: finite_or_cofinite_subsets
    why: >-
      The finite or cofinite subsets of $\reals$ are not a topology, because the union of the singletons $\lbrace n \rbrace$ for $n \in \mathbb{N}$ is neither finite nor cofinite.
      They are not a σ-algebra, for the same reason: $\mathbb{N}$ is a countable union of them, but it is not one of them.
see_also:
  - interior_vs_exterior_vs_boundary
  - types_of_sparsity
---
## Notes

- The axioms differ in two ways: a topology allows any union (even uncountable) but not complements, while a σ-algebra allows complements but only countable unions.
- Continuous maps pull open sets back to open sets; measurable maps pull measurable sets back to measurable sets.
  The analogy is why the two are easily confused.
