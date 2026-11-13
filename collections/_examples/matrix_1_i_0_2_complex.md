---
published: false
title: 'The linear map $T(x) = A x$ on $\mathbb{C}^2$ with the standard inner product, where $$A = \begin{bmatrix} 1 & i \\ 0 & 2 \end{bmatrix}$$'
level: undergraduate
values:
  transpose: '$$A^{\top} = \begin{bmatrix} 1 & 0 \\ i & 2 \end{bmatrix}$$'
  conjugate_transpose: '$$A^{\ast} = \begin{bmatrix} 1 & 0 \\ -i & 2 \end{bmatrix}$$'
  adjoint: '$$T^{\ast}(y) = \begin{bmatrix} 1 & 0 \\ -i & 2 \end{bmatrix} y$$'
why:
  transpose: >-
    The transpose of the matrix $$A = \begin{bmatrix} 1 & i \\ 0 & 2 \end{bmatrix}$$ moves the entry $i$ from position $(1, 2)$ to position $(2, 1)$ and does not conjugate it.
  conjugate_transpose: >-
    The conjugate transpose of the matrix $$A = \begin{bmatrix} 1 & i \\ 0 & 2 \end{bmatrix}$$ moves the entry $i$ to position $(2, 1)$ and replaces it by its conjugate $-i$.
  adjoint: >-
    The adjoint of the linear map $T(x) = A x$ with the standard inner product $\ip{x}{y} = \sum_j x_j \overline{y_j}$ is $T^{\ast}(y) = A^{\ast} y$, where $A^{\ast}$ is the conjugate transpose of $A$, because $\ip{A x}{y} = y^{\ast} A x = (A^{\ast} y)^{\ast} x = \ip{x}{A^{\ast} y}$.
---
