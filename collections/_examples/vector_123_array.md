---
published: false
# ???
title: 'The vector $(1, 2, 3)$, stored as an array of shape $3 \times 1$'
level: high-school
values:
  array_rank: '$1$'
  array_shape: '$3 \times 1$'
  array_size: '$3 \cdot 1 = 3$'
why:
  # array_rank: >-
  #   NumPy calls this `ndim`, the number of dimensions, even though the vector lies in the three-dimensional space $\reals^3$.
  array_rank: >-
    The array has one axis, so its number of axes is $1$.
    NumPy calls this `ndim`, the number of dimensions, even though the vector lies in the three-dimensional space $\reals^3$.
  array_shape: >-
    The array has shape $3 \times 1$, so it has $3 \cdot 1 = 3$ entries.
    It has one axis, because one index picks out an entry.
  array_size: >-
    The vector $(1, 2, 3)$, stored as a $3 \times 1$ array, has $3$ rows and $1$ column, so it has $3$ elements. In NumPy, `a.size` is $3$ and `a.shape` is `(3, 1)`.
---
