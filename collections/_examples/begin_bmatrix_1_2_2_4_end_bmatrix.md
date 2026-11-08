---
published: false
title: 'The matrix $$\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$$'
level: undergraduate
values:
  determinant: '$\det A = 1 \cdot 4 - 2 \cdot 2 = 0$'
  trace: '$\operatorname{tr} A = 1 + 4 = 5$'
  kernel: '$$\ker A = \operatorname{span} \begin{bmatrix} 2 \\ -1 \end{bmatrix}$$'
is: [positive_semidefinite_matrix, symmetric_matrix]
is_not: [full_rank, positive_definite_matrix, invertible_matrix]
why:
  invertible_matrix: >-
    The matrix $$A = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$$ is not invertible, because $\det A = 0$: its second row is twice its first.
  kernel: >-
    The kernel of $$A = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$$ is a line, because $$A \begin{bmatrix} 2 \\ -1 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$.
  positive_semidefinite_matrix: >-
    The matrix $$\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$$ is positive semidefinite, because $x^{\top} A x = (x_1 + 2 x_2)^2 \geq 0$.
  positive_definite_matrix: >-
    The matrix $$\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$$ is not positive definite, because $x = (2, -1)$ gives $x^{\top} A x = 0$; its eigenvalues are $5$ and $0$.
---
