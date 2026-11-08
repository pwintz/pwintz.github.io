---
published: false
title: Linearly independent vs. spanning vs. basis
kind: siblings
areas: [linear-algebra]
summary: >
  A list of vectors in a vector space can have too few vectors to reach everything, or too many to avoid redundancy.
  [Linearly independent](/definitions/linearly-independent) vectors have no redundancy, and spanning vectors reach every vector by linear combinations.
  A [basis](/definitions/vector-basis) is both: linearly independent and spanning.
terms:
  - linearly_independent
  - span
  - vector_basis
examples:
  - example: standard_basis_r2
  - example: skew_basis_r2
  - example: three_vectors_r2
    why: >-
      The vectors $(1, 0)$, $(0, 1)$, and $(1, 1)$ span $\reals^2$ but are not linearly independent, so they are not a basis: one vector too many.
  - example: parallel_vectors_r2
    why: >-
      The vectors $(1, 0)$ and $(2, 0)$ are neither linearly independent nor spanning: two vectors are enough for a basis of $\reals^2$ only if they point in different directions.
see_also:
  - vector_vs_vector_coordinate
---
## Notes

- In an $n$-dimensional space, $n$ [linearly independent](/definitions/linearly-independent) vectors automatically span, and $n$ spanning vectors are automatically linearly independent.
