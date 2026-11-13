---
title: Determinant
term: determinant
applies_to: square matrices
levels:
  high-school:
    text: |-
      Consider a $2 \times 2$ [matrix](/dictionary/definitions/matrix) $$A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$$.
      The _determinant_ of $A$ is

      $$\det A = a d - b c.$$

      The absolute value of $\det A$ is the area of the parallelogram spanned by the columns of $A$.

  # TODO: Make this more clear.
  undergraduate:
    text: |-
      Consider an $n \times n$ [matrix](/dictionary/definitions/matrix) $A = [a_{ij}]$.
      The determinant of $A$ is defined recursively.

      If $n = 1$ (the base case: $A$ is a scalar), then the _determinant_ of $A$ is $\det A = a_{11}$.


      If $n \geq 2$, then the _determinant_ of $A$ is defined by expanding along the first row:

      $$\det A = \sum_{j = 1}^{n} (-1)^{1 + j} a_{1j} \det A^{(1, j)},$$

      where $A^{(1, j)}$ is the $(n - 1) \times (n - 1)$ matrix obtained by deleting row $1$ and column $j$ of $A$.

      The number $\det A^{(1, j)}$ is the $(1, j)$ [minor](/dictionary/definitions/minor) $M_{1j}$ of $A$, and $(-1)^{1 + j} \det A^{(1, j)}$ is the $(1, j)$ [cofactor](/dictionary/definitions/cofactor) $C_{1j}$, so the expansion is $\det A = \sum_{j} a_{1j} C_{1j}$.
      Each minor $\det A^{(1, j)}$ is computed the same way, until the matrices are $1 \times 1$.
  graduate:
    context: permutations
    text: |-
      Consider an $n \times n$ [matrix](/dictionary/definitions/matrix) $A = [a_{ij}]$.
      The _determinant_ of $A$ is the number

      $$\det A = \sum_{\sigma} \operatorname{sign}(\sigma) a_{1 \sigma(1)} a_{2 \sigma(2)} \cdots a_{n \sigma(n)},$$

      where the sum is over all [permutations](/dictionary/definitions/permutation) $\sigma$ of $\setdef{1, \dots, n}$, and $\operatorname{sign}(\sigma)$ is $1$ if $\sigma$ is a product of an even number of swaps and $-1$ if $\sigma$ is a product of an odd number of swaps.
properties:
  - >-
    Expanding along a different row, or along a column, gives the same determinant (the Laplace expansion): $\det A = \sum_{j} a_{ij} C_{ij}$ for each row $i$, where $C_{ij}$ is the $(i, j)$ [cofactor](/dictionary/definitions/cofactor) of $A$.
  - >-
    $\abs{\det A}$ is the factor by which $A$ scales volumes, and the sign of $\det A$ says whether $A$ preserves or reverses orientation.
  - >-
    $A$ is [invertible](/dictionary/definitions/invertible-matrix) if and only if $\det A \neq 0$.
  - >-
    $\det(A B) = \det A \det B$, and $\det A$ is the product of the [eigenvalues](/dictionary/definitions/eigenvalue) of $A$.
---
