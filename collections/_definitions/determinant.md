---
published: false
title: Determinant
term: determinant
applies_to: square matrices
levels:
  high-school:
    text: |-
      Consider a $2 \times 2$ [matrix](/dictionary/definitions/matrix) $$A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$$.
      The _determinant_ of $A$ is

      $$\det A = a d - b c.$$

      Its absolute value is the area of the parallelogram spanned by the columns of $A$.
  undergraduate:
    text: |-
      Consider an $n \times n$ [matrix](/dictionary/definitions/matrix) $A$.
      The _determinant_ of $A$ is the number

      $$\det A = \sum_{\sigma} \operatorname{sign}(\sigma) A_{1 \sigma(1)} A_{2 \sigma(2)} \cdots A_{n \sigma(n)},$$

      where the sum is over all permutations $\sigma$ of $\setdef{1, \dots, n}$.
properties:
  - >-
    $\abs{\det A}$ is the factor by which $A$ scales volumes, and the sign of $\det A$ says whether $A$ preserves or reverses orientation.
  - >-
    $A$ is [invertible](/dictionary/definitions/invertible-matrix) if and only if $\det A \neq 0$.
  - >-
    $\det(A B) = \det A \det B$, and $\det A$ is the product of the [eigenvalues](/dictionary/definitions/eigenvalue) of $A$.
---
