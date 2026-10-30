---
published: false
title: "Rank: number of axes vs. rank of a matrix"
kind: conflicting
areas: [linear-algebra, computing]
status: draft
summary: >
  The "rank" of an array (or tensor) is its number of axes, so every matrix has rank $2$ in this sense.
  The rank of a matrix in linear algebra is its number of linearly independent columns.
terms:
  - array_rank
  - matrix_rank
examples_note: >-
  Each cell is the rank of the matrix in that row, in the ___ sense.
examples:
  - example: ones_3_by_4
    why: >-
      It has two axes (rows and columns), but all of its columns are equal, so only one is linearly independent.
  - example: identity_3_by_3
    why: >-
      Its columns are linearly independent, but it still has only two axes.
see_also:
  - types_of_array_quantities
  - types_of_everything
---
## Notes

- For tensors, "rank" has a third meaning: the smallest number of rank-one tensors (outer products of vectors) that sum to the tensor. For matrices, this agrees with the linear-algebra rank.
- In NumPy, the number of axes is `ndim`, and the matrix rank is `numpy.linalg.matrix_rank`.
