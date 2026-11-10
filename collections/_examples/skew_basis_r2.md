---
published: false
title: 'The vectors $(1, 0)$ and $(1, 1)$ in $\reals^2$'
level: high-school
is: [
  vector_basis,
  linearly_independent,
  span,
  pairwise_linearly_independent
]
is_not: [
  orthogonal_vectors,
  orthonormal
]
why:
  vector_basis: >-
    A basis need not be perpendicular: $(x, y) = (x - y)(1, 0) + y (1, 1)$.
  orthogonal_vectors: >-
    The vectors $(1, 0)$ and $(1, 1)$ are not orthogonal, because their dot product is $1 \cdot 1 + 0 \cdot 1 = 1$.
  pairwise_linearly_independent: >-
    The vectors $(1, 0)$ and $(1, 1)$ are pairwise linearly independent, because neither vector is a scalar multiple of the other.
  orthonormal: >-
    The vectors $(1, 0)$ and $(1, 1)$ are not orthonormal, because their dot product is $1$ and $(1, 1)$ has length $\sqrt{2}$.
---
