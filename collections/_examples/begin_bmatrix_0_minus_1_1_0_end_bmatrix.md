---
title: 'The matrix $$\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$'
level: high-school
values:
  eigenvalue: '$i$ and $-i$'
  singular_value: '$1$ and $1$'
  transpose: '$$A^{\top} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$$'
  determinant: '$\det A = 0 \cdot 0 - (-1) \cdot 1 = 1$'
  trace: '$\operatorname{tr} A = 0 + 0 = 0$'
  invertible_matrix: '$$A^{-1} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$$'
is: [array, matrix, invertible_matrix, orthogonal_matrix, skew_symmetric_matrix]
is_not: [linear_map, symmetric_matrix]
why:
  orthogonal_matrix: >-
    The rotation $$A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$ is orthogonal, because its inverse, the rotation by $-90°$, is its transpose.
  skew_symmetric_matrix: >-
    The rotation $$A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$ is skew-symmetric, because $A^{\top} = -A$.
  eigenvalue: >-
    The eigenvalues of $$A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$ are $i$ and $-i$, because $$A \begin{bmatrix} 1 \\ -i \end{bmatrix} = \begin{bmatrix} i \\ 1 \end{bmatrix} = i \begin{bmatrix} 1 \\ -i \end{bmatrix}$$ and $$A \begin{bmatrix} 1 \\ i \end{bmatrix} = \begin{bmatrix} -i \\ 1 \end{bmatrix} = -i \begin{bmatrix} 1 \\ i \end{bmatrix}$$.
    $A$ rotates every nonzero real vector by $90°$, so it has no real eigenvalues.
  singular_value: >-
    The singular values of $$A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$ are $1$ and $1$, because $A^{\top} A = I$, whose eigenvalues are $1$ and $1$.
    A rotation does not change the length of any vector.
  transpose: >-
    For the rotation by $90°$, the transpose and the inverse are the same matrix, because the rotation is orthogonal.
---
