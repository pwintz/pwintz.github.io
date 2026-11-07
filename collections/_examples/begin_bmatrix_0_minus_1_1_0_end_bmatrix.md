---
title: 'The matrix $$\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$'
level: high-school
values:
  eigenvalue: '$i$ and $-i$'
  singular_value: '$1$ and $1$'
is: [array, matrix]
is_not: [linear_map]
why:
  eigenvalue: >-
    The eigenvalues of $$A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$ are $i$ and $-i$, because $$A \begin{bmatrix} 1 \\ -i \end{bmatrix} = \begin{bmatrix} i \\ 1 \end{bmatrix} = i \begin{bmatrix} 1 \\ -i \end{bmatrix}$$ and $$A \begin{bmatrix} 1 \\ i \end{bmatrix} = \begin{bmatrix} -i \\ 1 \end{bmatrix} = -i \begin{bmatrix} 1 \\ i \end{bmatrix}$$.
    $A$ rotates every nonzero real vector by $90°$, so it has no real eigenvalues.
  singular_value: >-
    The singular values of $$A = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$ are $1$ and $1$, because $A^{\top} A = I$, whose eigenvalues are $1$ and $1$.
    A rotation does not change the length of any vector.
---
