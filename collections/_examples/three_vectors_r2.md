---
published: false
title: 'The vectors $(1, 0)$, $(0, 1)$, and $(1, 1)$ in $\reals^2$'
level: high-school
is: [
  span,
  pairwise_linearly_independent
]
is_not: [
  vector_basis,
  linearly_independent,
  orthogonal_vectors,
  orthonormal
]
why:
  linearly_independent: >-
    The vectors $(1, 0)$, $(0, 1)$, and $(1, 1)$ are not linearly independent, because $(1, 1) = (1, 0) + (0, 1)$.
  vector_basis: >-
    The vectors $(1, 0)$, $(0, 1)$, and $(1, 1)$ are not a basis of $\reals^2$.
    They span $\reals^2$, but they are not independent: $(1, 1) = (1, 0) + (0, 1)$, so $(1, 1)$ is redundant.
  pairwise_linearly_independent: >-
    The vectors $(1, 0)$, $(0, 1)$, and $(1, 1)$ are pairwise linearly independent, because no one of the three vectors is a scalar multiple of another.
  orthogonal_vectors: >-
    The vectors $(1, 0)$, $(0, 1)$, and $(1, 1)$ are not orthogonal, because the dot product of $(1, 0)$ and $(1, 1)$ is $1$.
  orthonormal: >-
    The vectors $(1, 0)$, $(0, 1)$, and $(1, 1)$ are not orthonormal, because the vectors are not orthogonal.
---
