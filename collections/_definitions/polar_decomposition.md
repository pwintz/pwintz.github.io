---
published: false
title: Polar decomposition
term: polar decomposition
applies_to: square matrices
levels:
  undergraduate:
    context: real matrices
    text: |-
      Consider a square real [matrix](/dictionary/definitions/matrix) $A$.
      A _polar decomposition_ of $A$ is a factorization $A = Q S$, where $Q$ is orthogonal and $S$ is a [symmetric matrix](/dictionary/definitions/symmetric-matrix) whose [eigenvalues](/dictionary/definitions/eigenvalue) are all nonnegative (that is, $S$ is [positive semidefinite](/dictionary/definitions/positive-semidefinite-matrix)).
properties:
  - |-
    Every square matrix $A$ has a polar decomposition, and its factor $S$ is always $S = \sqrt{A^{\top} A}$, the unique [positive semidefinite](/dictionary/definitions/positive-semidefinite-matrix) square root of $A^{\top} A$.
    If $A$ is [invertible](/dictionary/definitions/invertible-matrix), then $Q = A S^{-1}$ is also unique.
  - |-
    The [eigenvalues](/dictionary/definitions/eigenvalue) of $S$ are the [singular values](/dictionary/definitions/singular-value) of $A$.
    If $A = U \Sigma V^{\top}$ is a [singular value decomposition](/dictionary/definitions/singular-value-decomposition), then $Q = U V^{\top}$ and $S = V \Sigma V^{\top}$.
  - |-
    Geometrically, $S$ stretches space along perpendicular axes, and $Q$ then rotates (or reflects) it.
---
The name comes from the polar form $z = e^{i \theta} r$ of a complex number: $Q$ plays the role of the rotation $e^{i \theta}$, and $S$ plays the role of the length $r \geq 0$.

Some authors use the _left_ polar decomposition $A = P Q$, with $P = \sqrt{A A^{\top}}$, instead.
For complex matrices, $Q$ is unitary and $S = \sqrt{A^{\ast} A}$ is Hermitian [positive semidefinite](/dictionary/definitions/positive-semidefinite-matrix).
