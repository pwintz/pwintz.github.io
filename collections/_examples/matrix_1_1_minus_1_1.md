---
title: 'The matrix $$\begin{bmatrix} 1 & 1 \\ -1 & 1 \end{bmatrix}$$'
level: undergraduate
is_not: [
  symmetric
  positive_definite_matrix,
  positive_semidefinite_matrix
]
why:
  positive_definite_matrix: >-
    The matrix $$A = \begin{bmatrix} 1 & 1 \\ -1 & 1 \end{bmatrix}$$ is not positive definite under the usual convention, because it is not symmetric, even though $x^{\top} A x = x_1^2 + x_2^2 > 0$ for every nonzero $x$.
    Authors who do not require symmetry call it positive definite.
---
