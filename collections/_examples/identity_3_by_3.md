---
title: 'The $3 \times 3$ identity matrix'
level: high-school
is: [positive_definite_matrix, positive_semidefinite_matrix]
values:
  array_rank: '$2$'
  array_shape: '$(3, 3)$'
  array_size: '$3 \cdot 3 = 9$'
  matrix_rank: '$\operatorname{rank} I = 3$'
why:
  matrix_rank: >-
    The $3 \times 3$ identity matrix has rank $3$, because its columns are linearly independent.
  array_rank: >-
    The identity matrix has two axes, so its number of axes is $2$.
    Its rank as a matrix is $3$, because its $3$ columns are linearly independent.
  positive_definite_matrix: >-
    The $3 \times 3$ identity matrix is positive definite, because $x^{\top} I x = \norm{x}^2 > 0$ for every nonzero $x$.
  positive_semidefinite_matrix: >-
    The $3 \times 3$ identity matrix is positive semidefinite, because it is positive definite.
---
