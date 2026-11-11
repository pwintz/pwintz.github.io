---
title: Linearly independent vs. pairwise non-parallel
kind: hierarchy
areas: [linear-algebra]
summary: >
  A list of vectors can avoid redundancy as a whole or one pair at a time.
  A list of [linearly independent](/dictionary/definitions/linearly-independent) vectors has no vector that is a [linear combination](/dictionary/definitions/linear-combination) of the others, which rules out redundancy among three or more vectors as well as among pairs.
  A list of [pairwise linearly independent](/dictionary/definitions/pairwise-linearly-independent) (pairwise non-parallel) vectors has no two vectors on the same line through the origin.
relation: linearly independent ⊂ pairwise non-parallel
terms:
  - pairwise_linearly_independent
  - linearly_independent
examples:
  - example: standard_basis_r2
  - example: three_vectors_r2
    why: >-
      The vectors $(1, 0)$, $(0, 1)$, and $(1, 1)$ show that pairwise non-parallel vectors need not be linearly independent: no two of the vectors are parallel, but $(1, 1) = (1, 0) + (0, 1)$.
  - example: vector_and_zero_vector_r2
  - example: parallel_vectors_r2
see_also:
  - linearly_independent_vs_orthogonal
  - span_vs_linear_independence_vs_basis
---
## Notes

- For two vectors, the two notions are the same; the difference appears only for lists of three or more vectors.
- In $\reals^n$, a list of more than $n$ vectors is linearly dependent, but the list can still be pairwise non-parallel, as for every list of distinct directions in the plane.
