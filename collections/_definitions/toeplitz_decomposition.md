---
title: Toeplitz decomposition
term: Toeplitz decomposition
applies_to: square matrices
synonyms: [Cartesian decomposition, Hermitian decomposition]
levels:
  undergraduate:
    context: real matrices
    text: |-
      Consider a square real [matrix](/definitions/matrix) $A$.
      The _Toeplitz decomposition_ of $A$ is a sum

      $$A = H + K$$ 

      where $H$ is a [symmetric matrix](/definitions/symmetric-matrix) and a $K$ is skew-symmetric.
#   graduate:
#     context: complex matrices
#     text: |-
#       Consider a square complex [matrix](/definitions/matrix) $A$, and let $A^*$ be the conjugate transpose of $A$.
#       The _Toeplitz decomposition_ of $A$ writes $A$ as $A = H + i K$, where
# 
#       $$H = \frac{1}{2}(A + A^*) \quad \text{and} \quad K = \frac{1}{2 i}(A - A^*)$$
# 
#       are Hermitian ($H^* = H$ and $K^* = K$).
properties:
  - |-
    The Toeplitz decomposition exists and is unique.

  - |-
    The Toeplitz decomposition of a square matrix $A$ is 
    
    $$A = \frac{1}{2}(A + A^{\top}) + \frac{1}{2}(A - A^{\top})$$
    
  # - |-
  #   For a real matrix $A$, $H$ is the symmetric part $\frac{1}{2}(A + A^{\top})$ and $i K$ is the skew-symmetric part $\frac{1}{2}(A - A^{\top})$.
  # - |-
  #    $A = H + i K$ with $H$ and $K$ Hermitian, then $H = \frac{1}{2}(A + A^*)$ and $K = \frac{1}{2 i}(A - A^*)$.
  # - |-
  #   For every vector $x$, the numbers $x^* H x$ and $x^* K x$ are real, so $x^* A x = x^* H x + i \, x^* K x$ splits $x^* A x$ into its real and imaginary parts.
  #   In particular, $\operatorname{Re}(x^* A x) < 0$ for every $x \neq 0$ exactly when $H$ is negative definite.
  - |-
    The matrix $A$ is normal ($A A^\top = A^\top A$) exactly when $H$ and $K$ commute.

---
<!-- The Toeplitz decomposition is the matrix version of writing a complex number as $z = x + i y$ with $x$ and $y$ real: $H$ and $K$ play the roles of the real and imaginary parts, and Hermitian matrices play the role of real numbers. -->

Do not confuse the Toeplitz decomposition (named after Otto Toeplitz) with decompositions _of_ Toeplitz matrices, such as the Vandermonde decomposition of a positive semidefinite Toeplitz matrix.
