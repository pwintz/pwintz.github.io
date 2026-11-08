---
title: Schur decomposition
term: Schur decomposition
applies_to: square matrices
levels:
  undergraduate:
    context: real matrices with real eigenvalues
    text: |-
      Consider a square real [matrix](/definitions/matrix) $A$ whose [eigenvalues](/definitions/eigenvalue) are all real.
      A _Schur decomposition_ of $A$ is a factorization

      $$A = Q T Q^{\top},$$

      where $Q$ is orthogonal and $T$ is upper triangular.
  graduate:
    context: complex matrices
    text: |-
      Consider a square complex [matrix](/definitions/matrix) $A$.
      A _Schur decomposition_ of $A$ is a factorization $A = Q T Q^*$, where $Q$ is unitary ($Q^* Q = I$) and $T$ is upper triangular.
properties:
  - |-
    Every square complex matrix has a Schur decomposition, but it is not unique.
    The diagonal entries of $T$ are the [eigenvalues](/definitions/eigenvalue) of $A$.
  - |-
    The upper triangular factor $T$ is diagonal exactly when $A$ is normal ($A A^* = A^* A$).
    For a real [symmetric matrix](/definitions/symmetric-matrix), a Schur decomposition is an [eigendecomposition](/definitions/eigendecomposition) $A = Q \Lambda Q^{\top}$.
  - |-
    Unlike an [eigendecomposition](/definitions/eigendecomposition), a Schur decomposition exists for every matrix and uses an orthogonal (or unitary) $Q$, so it can be computed stably.
    The QR algorithm for [eigenvalues](/definitions/eigenvalue) computes a Schur decomposition.
---
A real matrix with complex [eigenvalues](/definitions/eigenvalue) has a _real Schur decomposition_ $A = Q T Q^{\top}$ with $Q$ real orthogonal, in which $T$ is upper triangular except for $2 \times 2$ blocks on its diagonal, one for each pair of complex-conjugate eigenvalues.
