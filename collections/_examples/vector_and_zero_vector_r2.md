---
title: 'The vectors $(1, 0)$ and $(0, 0)$ in $\reals^2$'
level: undergraduate
is: [orthogonal_vectors]
is_not: [
  linearly_independent,
  perpendicular,
  pairwise_linearly_independent,
  orthonormal
]
why:
  linearly_independent: >-
    The vectors $(1, 0)$ and $(0, 0)$ are not linearly independent, because $0 \cdot (1, 0) + 1 \cdot (0, 0) = (0, 0)$ is a linear combination with a nonzero coefficient that equals the zero vector.
  orthogonal_vectors: >-
    The vectors $(1, 0)$ and $(0, 0)$ are orthogonal, because their dot product is $1 \cdot 0 + 0 \cdot 0 = 0$.
  perpendicular: >-
    The vectors $(1, 0)$ and $(0, 0)$ are not perpendicular, because the zero vector has no direction, so the vectors form no angle.
  pairwise_linearly_independent: >-
    The vectors $(1, 0)$ and $(0, 0)$ are not pairwise linearly independent, because $(0, 0) = 0 \cdot (1, 0)$ is a scalar multiple of $(1, 0)$.
  orthonormal: >-
    The vectors $(1, 0)$ and $(0, 0)$ are not orthonormal, because $(0, 0)$ has length $0$.
---
