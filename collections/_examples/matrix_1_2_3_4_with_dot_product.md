---
published: false
title: 'The linear map $T(x) = A x$ on $\reals^2$ with the dot product, where $$A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$$'
level: undergraduate
values:
  transpose: '$$A^{\top} = \begin{bmatrix} 1 & 3 \\ 2 & 4 \end{bmatrix}$$'
  conjugate_transpose: '$$A^{\ast} = \begin{bmatrix} 1 & 3 \\ 2 & 4 \end{bmatrix}$$'
  adjoint: '$$T^{\ast}(y) = \begin{bmatrix} 1 & 3 \\ 2 & 4 \end{bmatrix} y$$'
why:
  transpose: >-
    The transpose of the matrix $$A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$$ has the rows of $A$ as its columns.
  conjugate_transpose: >-
    The conjugate transpose of the matrix $$A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$$ is its transpose, because the entries of $A$ are real, so conjugating them changes nothing.
  adjoint: >-
    The adjoint of the linear map $T(x) = A x$ with the dot product is $T^{\ast}(y) = A^{\top} y$, because $(A x) \cdot y = (A x)^{\top} y = x^{\top} (A^{\top} y) = x \cdot (A^{\top} y)$.
---
