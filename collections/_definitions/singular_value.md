---
title: Singular value
term: singular value
applies_to: matrices
levels:
  undergraduate:
    text: |-
      Consider an $m \times n$ real [matrix](/definitions/matrix) $A$.
      The _singular values_ of $A$ are the square roots of the [eigenvalues](/definitions/eigenvalue) of the $n \times n$ matrix $A^{\top} A$, which are nonnegative.
properties:
  - >-
    Geometrically, $A$ maps the unit sphere to an ellipsoid, and the lengths of the ellipsoid's semi-axes are the singular values of $A$.
  - >-
    The largest singular value of $A$ is its operator norm $\lVert A \rVert_2$, the most that $A$ stretches a vector.
  - >-
    For a symmetric matrix, the singular values are the absolute values of the eigenvalues.
---
