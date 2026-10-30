---
published: false
title: 'The $3 \times 4$ matrix of ones, stored as an array'
level: high-school
values:
  array_rank: '$2$'
  array_shape: '$(3, 4)$'
  array_size: '$12$'
  matrix_rank: '$1$'
why:
  array_rank: >-
    It takes two indices (row and column) to pick out an entry.
  array_size: >-
    In NumPy, `a.size` is $12$. In MATLAB, `numel(A)` is $12$.
  array_shape: >-
    In NumPy, `a.shape` is `(3, 4)`. In MATLAB, `size(A)` is `[3 4]`.
  matrix_rank: >-
    All of its columns are equal, so only one is linearly independent.
---
