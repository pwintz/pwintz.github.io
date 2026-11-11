---
title: Linearly independent vs. orthogonal
kind: hierarchy
areas: [linear-algebra]
summary: >
  A list of vectors can point in "different directions" in two senses.
  A set of [linearly independent](/dictionary/definitions/linearly-independent) vectors have no redundant vectors: no vector in the list is a [linear combination](/dictionary/definitions/linear-combination) of the others.
  [Orthogonal](/dictionary/definitions/orthogonal-vectors) vectors are pairwise at [right angles](/dictionary/definitions/right-angle): every two different vectors in the list have [inner product](/dictionary/definitions/inner-product) $0$.
  Linear independence is defined in every vector space, but orthogonality requires an inner product.
relation: orthogonal and nonzero ⊂ linearly independent
terms:
  - linearly_independent
  - orthogonal_vectors
examples:
  - example: standard_basis_r2
  - example: skew_basis_r2
    why: >-
      The vectors $(1, 0)$ and $(1, 1)$ show that linearly independent vectors need not be orthogonal: the vectors point in different directions, but not at a right angle.
  - example: vector_and_zero_vector_r2
    why: >-
      The vectors $(1, 0)$ and $(0, 0)$ show why orthogonal vectors must be nonzero to be linearly independent: the zero vector is orthogonal to every vector, but every list containing the zero vector is linearly dependent.
  - example: parallel_vectors_r2
see_also:
  - linearly_independent_vs_pairwise_non_parallel
  - span_vs_linear_independence_vs_basis
---
## Notes

- The Gram–Schmidt process turns every [linearly independent](/dictionary/definitions/linearly-independent) list into an [orthogonal](/dictionary/definitions/orthogonal-vectors) list with the same [span](/dictionary/definitions/span).
