---
published: false
title: "Rank: number of axes vs. rank of a matrix"
kind: conflicting
areas: [linear-algebra, computing]
summary: >
  "Rank" means two different things for arrays and for matrices, so the rank of a matrix depends on which meaning is intended.
  The "rank" of an array (or tensor) is its number of axes, so every matrix has rank $2$ in this sense.
  The rank of a matrix in linear algebra is its number of [linearly independent](/dictionary/definitions/linearly-independent) columns.
terms:
  - array_rank
  - matrix_rank
examples_note: >-
  Each cell is the rank of the matrix in that row, in the ___ sense.
examples:
  - example: ones_3_by_4
  - example: identity_3_by_3
see_also:
  - types_of_array_quantities
  - types_of_everything
---
## Notes

- For tensors, "rank" has a third meaning: the smallest number of rank-one tensors (outer products of vectors) that sum to the tensor.
  For matrices, this agrees with the linear-algebra rank.
- In NumPy, the number of axes is `ndim`, and the matrix rank is `numpy.linalg.matrix_rank`.
