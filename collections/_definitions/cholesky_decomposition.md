---
title: Cholesky decomposition
term: Cholesky decomposition
applies_to: symmetric positive definite matrices
synonyms: [Cholesky factorization]
levels:
  undergraduate:
    text: |-
      Consider a [symmetric matrix](/definitions/symmetric-matrix) $A$ whose [eigenvalues](/definitions/eigenvalue) are all positive (that is, $A$ is positive definite).
      The _Cholesky decomposition_ of $A$ is the factorization

      $$A = L L^{\top},$$

      where $L$ is lower triangular with positive diagonal entries.
properties:
  - |-
    A real square matrix $A$ has a Cholesky decomposition exactly when $A$ is symmetric positive definite, and then the decomposition is unique.
  - |-
    Computing a Cholesky decomposition takes about half the work of an [LU decomposition](/definitions/lu-decomposition), and it needs no row exchanges.
  - |-
    If $z$ is a vector of independent standard normal [random variables](/definitions/random-variable) and $\Sigma = L L^{\top}$, then $\mu + L z$ is normally distributed with mean $\mu$ and covariance $\Sigma$.
---
The related $L D L^{\top}$ decomposition, with $L$ lower triangular with ones on its diagonal and $D$ diagonal, avoids square roots and also applies to some symmetric matrices that are not positive definite.

For complex matrices, $A$ is Hermitian positive definite and $A = L L^*$.
