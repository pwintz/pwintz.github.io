---
title: 'Multiplication of $2 \times 2$ real matrices'
level: undergraduate
is: [associative]
is_not: [commutative]
why:
  associative: |-
    Multiplication of $2 \times 2$ matrices is associative, because $(A B) C$ and $A (B C)$ both represent the composition of the same three linear maps.
    For example, multiplying the first two matrices first and multiplying the last two matrices first give the same product:

    $$
    \left(
    \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}
    \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix}
    \right)
    \begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}
    = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}
    \begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}
    = \begin{bmatrix} 4 & 1 \\ 2 & 1 \end{bmatrix},
    $$

    $$
    \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}
    \left(
    \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix}
    \begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}
    \right)
    = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}
    \begin{bmatrix} 2 & 0 \\ 2 & 1 \end{bmatrix}
    = \begin{bmatrix} 4 & 1 \\ 2 & 1 \end{bmatrix}.
    $$
  commutative: |-
    Multiplication of $2 \times 2$ matrices is not commutative, because multiplying the same two matrices in opposite orders can give different products:

    $$
    \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}
    \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix}
    = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix},
    \qquad
    \begin{bmatrix} 1 & 0 \\ 1 & 1 \end{bmatrix}
    \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}
    = \begin{bmatrix} 1 & 1 \\ 1 & 2 \end{bmatrix}.
    $$
---
