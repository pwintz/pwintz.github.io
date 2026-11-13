---
published: false
title: 'The matrix $$\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$$'
level: high-school
is_not: [symmetric_matrix]
values:
  leading_entry: '$1$ (row $1$) and $3$ (row $2$)'
  pivot: '$1$ and $-2$, in positions $(1, 1)$ and $(2, 2)$'
  matrix_rank: '$\operatorname{rank} A = 2$'
  nullity: '$\operatorname{nullity} A = 0$'
why:
  symmetric_matrix: >-
    The entries $2$ and $3$, across the diagonal from each other, differ.
  leading_entry: >-
    The leading entries of $$\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$$ are $1$ and $3$, the first nonzero entries of its rows, and both are in column $1$.
  pivot: >-
    Subtracting $3$ times row $1$ from row $2$ of $$\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$$ gives the echelon form $$\begin{bmatrix} 1 & 2 \\ 0 & -2 \end{bmatrix}$$, whose leading entries $1$ and $-2$ are the pivots.
    The pivot $-2$ is not an entry of the original matrix.
  matrix_rank: >-
    The matrix $$\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$$ has rank $2$, because its echelon form has two nonzero rows.
  nullity: >-
    The matrix $$\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$$ has nullity $0$, because its determinant is $-2 \neq 0$, so $A x = 0$ only for $x = 0$.
---
