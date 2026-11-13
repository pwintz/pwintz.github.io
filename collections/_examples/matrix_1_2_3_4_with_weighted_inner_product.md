---
published: false
title: 'The linear map $T(x) = A x$ on $\reals^2$ with the inner product $\ip{x}{y} = x_1 y_1 + 2 x_2 y_2$, where $$A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$$'
level: undergraduate
values:
  transpose: '$$A^{\top} = \begin{bmatrix} 1 & 3 \\ 2 & 4 \end{bmatrix}$$'
  conjugate_transpose: '$$A^{\ast} = \begin{bmatrix} 1 & 3 \\ 2 & 4 \end{bmatrix}$$'
  adjoint: '$$T^{\ast}(y) = \begin{bmatrix} 1 & 6 \\ 1 & 4 \end{bmatrix} y$$'
why:
  transpose: >-
    The transpose of the matrix $$A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$$ has the rows of $A$ as its columns, whatever inner product is used.
  conjugate_transpose: >-
    The conjugate transpose of the matrix $$A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$$ is its transpose, because the entries of $A$ are real.
  adjoint: |-
    The inner product $\ip{x}{y} = x_1 y_1 + 2 x_2 y_2$ is $x^{\top} W y$ with $W = \operatorname{diag}(1, 2)$, so the adjoint of the linear map $T(x) = A x$ is $T^{\ast}(y) = W^{-1} A^{\top} W y$, where

    $$W^{-1} A^{\top} W = \begin{bmatrix} 1 & 0 \\ 0 & 1/2 \end{bmatrix} \begin{bmatrix} 1 & 3 \\ 2 & 4 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & 2 \end{bmatrix} = \begin{bmatrix} 1 & 6 \\ 1 & 4 \end{bmatrix}.$$

    This choice satisfies $\ip{T x}{y} = x^{\top} A^{\top} W y = x^{\top} W (W^{-1} A^{\top} W y) = \ip{x}{T^{\ast} y}$.
---
