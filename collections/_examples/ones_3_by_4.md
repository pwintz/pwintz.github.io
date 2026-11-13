---
title: 'The $3 \times 4$ matrix of ones'
detail: '$$\begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & 1 & 1 & 1 \\ 1 & 1 & 1 & 1 \end{bmatrix}$$'
level: high-school
values:
  array_rank: '$2$'
  array_shape: '$(3, 4)$'
  array_size: '$3 \cdot 4 = 12$'
  matrix_rank: '$1$'
  nullity: '$\operatorname{nullity} = 3$'
why:
  array_rank: >-
    The $3 \times 4$ matrix of ones has array rank $2$, because it takes two indices (row and column) to pick out an entry.
  array_size: >-
    In NumPy, `a.size` is $12$.
    In MATLAB, `numel(A)` is $12$.
  array_shape: >-
    In NumPy, `a.shape` is `(3, 4)`.
    In MATLAB, `size(A)` is `[3 4]`.
  matrix_rank: >-
    The rank of the $3 \times 4$ matrix of ones is $1$, because every row is $(1, 1, 1, 1)$.
    The $3 \times 4$ matrix of ones has matrix rank $1$, because all of its columns are equal, so only one is linearly independent.
  nullity: >-
    The $3 \times 4$ matrix of ones has nullity $3$, because its kernel is the set of vectors $x$ in $\reals^4$ such that $x_1 + x_2 + x_3 + x_4 = 0$, which is a $3$-dimensional subspace.
    This agrees with the rank–nullity theorem: $4 - 1 = 3$.
---
