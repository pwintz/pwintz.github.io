---
published: false
title: 'The matrix $$\begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix}$$'
level: undergraduate
values:
  entrywise_exponential: '$$\begin{bmatrix} e & 1 \\ 1 & e^2 \end{bmatrix}$$'
  matrix_exponential: '$$\begin{bmatrix} e & 0 \\ 0 & e^2 \end{bmatrix}$$'
why:
  entrywise_exponential: >-
    The entrywise exponential of $$\begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix}$$ has $e^0 = 1$ off the diagonal, because each zero entry becomes $e^0$.
  matrix_exponential: >-
    The matrix exponential of the diagonal matrix $$\begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix}$$ is diagonal, with $e^1$ and $e^2$ on the diagonal, because every power of a diagonal matrix is diagonal, with the powers of the diagonal entries.
---
