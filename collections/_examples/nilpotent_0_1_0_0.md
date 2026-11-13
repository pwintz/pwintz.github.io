---
published: false
title: 'The matrix $$\begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$$'
level: undergraduate
values:
  entrywise_exponential: '$$\begin{bmatrix} 1 & e \\ 1 & 1 \end{bmatrix}$$'
  matrix_exponential: '$$\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$$'
is: [
  singular_matrix,
  defective_matrix
]
why:
  entrywise_exponential: >-
    The entrywise exponential of $$\begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$$ has $e^1 = e$ in the upper right and $e^0 = 1$ elsewhere.
  matrix_exponential: >-
    The matrix exponential of $$N = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$$ is $I + N$, because $N^2 = 0$, so every later term of the series is zero.
  singular_matrix: >-
    The matrix $$\begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$$ is singular, because it sends the nonzero vector $(1, 0)$ to $0$.
  defective_matrix: >-
    The matrix $$\begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$$ is defective, because its eigenvalue $0$ has multiplicity $2$, but its eigenvectors are the nonzero multiples of $(1, 0)$, which span only a line.
---
