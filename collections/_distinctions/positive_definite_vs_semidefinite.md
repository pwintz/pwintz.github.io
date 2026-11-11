---
title: Positive definite vs. positive semidefinite
kind: hierarchy
areas: [linear-algebra]
summary: >
  Positive definiteness and semidefiniteness describe the sign of the quadratic form $x^{\top} A x$ of a symmetric matrix, and they appear in optimization, stability, and statistics.
  A [symmetric matrix](/dictionary/definitions/symmetric-matrix) $A$ is [positive semidefinite](/dictionary/definitions/positive-semidefinite-matrix) if $x^{\top} A x \geq 0$ for every vector $x$, and positive definite if $x^{\top} A x > 0$ for every nonzero $x$.
  Equivalently, the [eigenvalues](/dictionary/definitions/eigenvalue) of $A$ are nonnegative or positive.
relation: positive definite ⊂ positive semidefinite
terms:
  - positive_definite_matrix
  - positive_semidefinite_matrix
examples:
  - example: identity_3_by_3
  - example: matrix_4_2_2_3
  - example: begin_bmatrix_1_2_2_4_end_bmatrix
  - example: begin_bmatrix_1_2_2_3_end_bmatrix
    why: >-
      The matrix $$\begin{bmatrix} 1 & 2 \\ 2 & 3 \end{bmatrix}$$ has determinant $-1$, so it has one positive and one negative eigenvalue: it is _indefinite_.
  - example: matrix_1_1_minus_1_1
    why: >-
      The matrix $$\begin{bmatrix} 1 & 1 \\ -1 & 1 \end{bmatrix}$$ satisfies $x^{\top} A x = x_1^2 + x_2^2 > 0$ for every nonzero $x$, but it is not symmetric, so under the usual convention it is neither positive definite nor positive semidefinite.
      Authors who do not require symmetry call it positive definite.
see_also:
  - types_of_matrix_decompositions
  - singular_value_vs_eigenvalue
---
## Notes

- Negative definite and negative semidefinite matrices are defined the same way, with the inequalities reversed: $A$ is negative definite exactly when $-A$ is positive definite.
- A matrix that is neither positive nor negative semidefinite is _indefinite_.
- A [positive definite function](/dictionary/definitions/positive-definite-function), as used for [Lyapunov functions](/dictionary/definitions/lyapunov-function), is a different notion: a function with $V(0) = 0$ and $V(x) > 0$ for $x \neq 0$.
  The quadratic form $V(x) = x^{\top} A x$ is a positive definite function exactly when $A$ is a positive definite matrix.
