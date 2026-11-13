---
published: false
title: Singular matrix vs. defective matrix
kind: siblings
areas: [linear-algebra]
summary: >
  "Singular" and "defective" each describe a way in which a square matrix is degenerate, so the two words are easy to mix up.
  A [singular](/dictionary/definitions/singular-matrix) matrix sends some nonzero vector to zero, so a singular matrix has the [eigenvalue](/dictionary/definitions/eigenvalue) $0$ and no inverse.
  A [defective](/dictionary/definitions/defective-matrix) matrix has too few [linearly independent](/dictionary/definitions/linearly-independent) [eigenvectors](/dictionary/definitions/eigenvector) to form a [basis](/dictionary/definitions/vector-basis), so a defective matrix is not diagonalizable.
  The two properties are independent of each other: a matrix can be singular, defective, both, or neither.
terms:
  - singular_matrix
  - defective_matrix
examples:
  - example: matrix_2_1_4_3
  - example: begin_bmatrix_1_2_2_4_end_bmatrix
  - example: matrix_jordan_block
  - example: nilpotent_0_1_0_0
  - example: zero_2_by_2
    why: >-
      The $2 \times 2$ zero matrix is as singular as a matrix can be, but the zero matrix is not defective, because the zero matrix is already diagonal.
see_also:
  - types_of_square_matrices
  - singular_value_vs_eigenvalue
---
