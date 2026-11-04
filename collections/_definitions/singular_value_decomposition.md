---
published: false
title: Singular value decomposition
term: singular value decomposition
applies_to: matrices
synonyms: [SVD]
levels:
  undergraduate:
    text: |-
      Consider an $m \times n$ real [matrix](/definitions/matrix) $A$.
      A _singular value decomposition_ of $A$ is a factorization $A = U \Sigma V^{\top}$, where $U$ and $V$ are orthogonal matrices and $\Sigma$ is an $m \times n$ diagonal matrix whose diagonal entries $\sigma_1 \geq \sigma_2 \geq \dots \geq 0$ are the _singular values_ of $A$.
properties:
  - |-
    Every matrix has a singular value decomposition.
    The singular values are the square roots of the [eigenvalues](/definitions/eigenvalue) of $A^{\top} A$.
  - |-
    The [rank](/definitions/matrix-rank) of $A$ is the number of nonzero singular values.
  - |-
    Geometrically, every [linear map](/definitions/linear-map) is a rotation (or reflection), followed by stretching along perpendicular axes, followed by another rotation (or reflection).
---
For complex matrices, $V^{\top}$ is replaced by the conjugate transpose $V^{\ast}$, and $U$ and $V$ are unitary.
