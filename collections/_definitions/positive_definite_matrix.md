---
title: Positive definite matrix
term: positive definite matrix
applies_to: symmetric matrices
levels:
  undergraduate:
    text: |-
      A [symmetric](/dictionary/definitions/symmetric-matrix) $n \times n$ real [matrix](/dictionary/definitions/matrix) $A$ is called _positive definite_ if

      $$x^{\top} A x > 0 \quad \text{for every nonzero vector } x \in \reals^n.$$
properties:
  - >-
    A [symmetric matrix](/dictionary/definitions/symmetric-matrix) is positive definite if and only if all of its [eigenvalues](/dictionary/definitions/eigenvalue) are positive.
  - >-
    A [symmetric matrix](/dictionary/definitions/symmetric-matrix) is positive definite if and only if all of its leading principal minors (the [determinants](/dictionary/definitions/determinant) of its upper-left $k \times k$ submatrices) are positive (Sylvester's criterion).
  - >-
    A [symmetric matrix](/dictionary/definitions/symmetric-matrix) is positive definite if and only if it has a [Cholesky decomposition](/dictionary/definitions/cholesky-decomposition) $A = L L^{\top}$ with $L$ [invertible](/dictionary/definitions/invertible-matrix).
  - >-
    A positive definite matrix $A$ defines an [inner product](/dictionary/definitions/inner-product) $\ip{x}{y} = x^{\top} A y$ on $\reals^n$.
---
Some authors do not require $A$ to be symmetric.
Then $x^{\top} A x > 0$ depends only on the symmetric part $\frac{1}{2}(A + A^{\top})$, so, for example, a rotation by less than $90°$ counts as positive definite.

For complex matrices, $A$ is required to be Hermitian, and $x^{\top}$ is replaced by the conjugate transpose $x^{\ast}$.
