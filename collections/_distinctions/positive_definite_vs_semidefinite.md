---
title: Positive definite vs. positive semidefinite
kind: hierarchy
areas: [linear-algebra]
summary: >
  A symmetric matrix $A$ is positive semidefinite if $x^{\top} A x \geq 0$ for every vector $x$, and positive definite if $x^{\top} A x > 0$ for every nonzero $x$.
  Equivalently, the eigenvalues of $A$ are nonnegative or positive.
relation: positive definite ⊂ positive semidefinite
terms:
  - positive_definite_matrix
  - positive_semidefinite_matrix
examples:
  - example: identity_3_by_3
    why: >-
      The $3 \times 3$ identity matrix is positive definite, because $x^{\top} I x = \lVert x \rVert^2 > 0$ for every nonzero $x$.
      So it is also positive semidefinite.
  - example: matrix_4_2_2_3
    why: >-
      The matrix $$\begin{bmatrix} 4 & 2 \\ 2 & 3 \end{bmatrix}$$ is positive definite, because its leading principal minors $4$ and $4 \cdot 3 - 2 \cdot 2 = 8$ are positive.
      So it is also positive semidefinite.
  - example: begin_bmatrix_1_2_2_4_end_bmatrix
    why: >-
      The matrix $$\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$$ is positive semidefinite, because $x^{\top} A x = (x_1 + 2 x_2)^2 \geq 0$.
      It is not positive definite, because $x = (2, -1)$ gives $x^{\top} A x = 0$; its eigenvalues are $5$ and $0$.
  - example: begin_bmatrix_1_2_2_3_end_bmatrix
    why: >-
      The matrix $$\begin{bmatrix} 1 & 2 \\ 2 & 3 \end{bmatrix}$$ is not positive semidefinite (and so not positive definite), because $x = (2, -1)$ gives $x^{\top} A x = 4 - 8 + 3 = -1$.
      Its determinant is $-1$, so it has one positive and one negative eigenvalue: it is _indefinite_.
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
- A [positive definite function](/definitions/positive-definite-function), as used for Lyapunov functions, is a different notion: a function with $V(0) = 0$ and $V(x) > 0$ for $x \neq 0$.
  The quadratic form $V(x) = x^{\top} A x$ is a positive definite function exactly when $A$ is a positive definite matrix.
