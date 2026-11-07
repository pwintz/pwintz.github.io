---
title: 'The matrix $$\begin{bmatrix} 2 & 0 \\ 0 & -3 \end{bmatrix}$$'
level: undergraduate
values:
  eigenvalue: '$2$ and $-3$'
  singular_value: '$3$ and $2$'
why:
  eigenvalue: >-
    The eigenvalues are $2$ and $-3$, because $$\begin{bmatrix} 2 & 0 \\ 0 & -3 \end{bmatrix} \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 2 \\ 0 \end{bmatrix} = 2 \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$ and $$\begin{bmatrix} 2 & 0 \\ 0 & -3 \end{bmatrix} \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ -3 \end{bmatrix} = -3 \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$.
  singular_value: >-
    The singular values of $$A = \begin{bmatrix} 2 & 0 \\ 0 & -3 \end{bmatrix}$$ are $3$ and $2$, the square roots of the eigenvalues $9$ and $4$ of $$A^{\top} A = \begin{bmatrix} 4 & 0 \\ 0 & 9 \end{bmatrix}$$.
    $A$ is symmetric, so its singular values are the absolute values of its eigenvalues.
---
