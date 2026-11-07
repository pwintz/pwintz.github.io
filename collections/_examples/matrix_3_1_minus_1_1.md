---
title: 'The matrix $$\begin{bmatrix} 3 & 1 \\ -1 & 1 \end{bmatrix}$$'
level: undergraduate
values:
  jordan_normal_form: '$$P = \begin{bmatrix} 1 & 1 \\ -1 & 0 \end{bmatrix}$$, $$J = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}$$'
  eigenvalue: '$2$ (twice)'
why:
  jordan_normal_form: >-
    The matrix $$A = \begin{bmatrix} 3 & 1 \\ -1 & 1 \end{bmatrix}$$ has the eigenvalue $2$ twice, but its eigenvectors are only the multiples of $(1, -1)$, so it is not diagonalizable, and $J$ is a single $2 \times 2$ Jordan block.
    The columns of $P$ are the eigenvector $v_1 = (1, -1)$ and a vector $v_2 = (1, 0)$ with $(A - 2I) v_2 = v_1$.
    To check, $$A P = P J = \begin{bmatrix} 2 & 3 \\ -2 & -1 \end{bmatrix}$$.
  eigenvalue: >-
    The eigenvalue of $$A = \begin{bmatrix} 3 & 1 \\ -1 & 1 \end{bmatrix}$$ is $2$, because $$A \begin{bmatrix} 1 \\ -1 \end{bmatrix} = \begin{bmatrix} 2 \\ -2 \end{bmatrix} = 2 \begin{bmatrix} 1 \\ -1 \end{bmatrix}$$.
---
