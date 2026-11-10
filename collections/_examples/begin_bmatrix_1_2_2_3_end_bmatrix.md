---
published: false
title: 'The matrix $$\begin{bmatrix} 1 & 2 \\ 2 & 3 \end{bmatrix}$$'
level: high-school
values:
  transpose: '$A^{\top} = A$'
  determinant: '$\det A = 1 \cdot 3 - 2 \cdot 2 = -1$'
  trace: '$\operatorname{tr} A = 1 + 3 = 4$'
is_not: [
  positive_definite_matrix,
  positive_semidefinite_matrix,
  orthogonal_matrix,
  skew_symmetric_matrix
]
is: [
  symmetric_matrix,
  invertible_matrix
]
why:
  transpose: >-
    The matrix $$A = \begin{bmatrix} 1 & 2 \\ 2 & 3 \end{bmatrix}$$ is its own transpose, because it is symmetric.
  invertible_matrix: >-
    The matrix $$A = \begin{bmatrix} 1 & 2 \\ 2 & 3 \end{bmatrix}$$ is invertible, because $\det A = -1 \neq 0$.
  positive_semidefinite_matrix: >-
    The matrix $$\begin{bmatrix} 1 & 2 \\ 2 & 3 \end{bmatrix}$$ is not positive semidefinite (and so not positive definite), because $x = (2, -1)$ gives $x^{\top} A x = 4 - 8 + 3 = -1$.
---
