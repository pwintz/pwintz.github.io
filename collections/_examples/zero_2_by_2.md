---
title: 'The $2 \times 2$ zero matrix'
level: undergraduate
values:
  entrywise_exponential: '$$\begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}$$'
  matrix_exponential: '$$e^{0} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$'
  matrix_rank: '$\operatorname{rank} 0 = 0$'
  nullity: '$\operatorname{nullity} 0 = 2$'
is: [singular_matrix]
is_not: [defective_matrix]
why:
  entrywise_exponential: >-
    The entrywise exponential of the $2 \times 2$ zero matrix is the matrix of ones, because $e^0 = 1$ for each entry.
  matrix_exponential: >-
    The matrix exponential of the $2 \times 2$ zero matrix is the identity matrix, because every term of $I + 0 + 0^2 / 2! + \cdots$ after $I$ is zero.
  matrix_rank: >-
    The $2 \times 2$ zero matrix has rank $0$, because its column space is $\setdef{0}$.
  nullity: >-
    The $2 \times 2$ zero matrix has nullity $2$, because it sends every vector in $\reals^2$ to $0$.
  singular_matrix: >-
    The $2 \times 2$ zero matrix is singular, because its determinant is $0$.
  defective_matrix: >-
    The $2 \times 2$ zero matrix is not defective, because its eigenvalue $0$ has multiplicity $2$ and every nonzero vector is an eigenvector, so it has $2$ linearly independent eigenvectors.
---
