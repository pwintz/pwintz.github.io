---
published: false
title: Open vs. closed sets
kind: siblings
areas: [topology, analysis]
summary: >
  Open and [closed sets](/dictionary/definitions/closed-set) describe how a set sits inside a larger space, and the names suggest opposites, but they are not.
  An [open set](/dictionary/definitions/open-set) contains a small [ball](/dictionary/definitions/ball) around each of its points, so it contains none of its boundary.
  A closed set contains all of its boundary, and its complement is open.
  A set can be both, or neither.
terms:
  - open_set
  - closed_set
examples:
  - example: open_unit_interval
  - example: closed_unit_interval
  - example: half_open_unit_interval
    why: >-
      The interval $[0, 1)$ contains one of its boundary points but not the other, so it is neither open nor closed.
  - example: reals
    why: >-
      As a subset of itself, $\reals$ is both open and closed, because its complement $\emptyset$ is both open and closed.
  - example: empty_set_example
  - example: rationals_as_a_subset_of_reals
    why: >-
      Every real number is a boundary point of $\mathbb{Q}$, so $\mathbb{Q}$ contains some of its boundary points (the rational ones) but not all, and it is neither open nor closed.
see_also:
  - interior_vs_exterior_vs_boundary
  - types_of_compactness
  - continuous_vs_open
---
## Notes

- Whether a set is open or closed depends on the surrounding space: $[0, 1)$ is neither in $\reals$, but it is open in the space $[0, \infty)$, and closed in the space $(-1, 1)$.
- In a [connected](/dictionary/definitions/connected) space, such as $\reals$, the only sets that are both open and closed are $\emptyset$ and the whole space.
