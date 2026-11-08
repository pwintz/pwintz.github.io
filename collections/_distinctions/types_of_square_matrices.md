---
published: false
title: Symmetric vs. skew-symmetric vs. orthogonal vs. invertible matrices
kind: siblings
areas: [linear-algebra]
summary: >
  Several kinds of square matrices are defined by how the matrix relates to its transpose or its inverse.
  A [symmetric matrix](/definitions/symmetric-matrix) equals its transpose, and a [skew-symmetric](/definitions/skew-symmetric-matrix) matrix equals the negative of its transpose.
  An [orthogonal matrix](/definitions/orthogonal-matrix) is a matrix whose inverse is its transpose, and an [invertible](/definitions/invertible-matrix) matrix is a matrix that has an inverse.
terms:
  - invertible_matrix
  - symmetric_matrix
  - skew_symmetric_matrix
  - orthogonal_matrix
examples:
  - example: matrix_2_1_4_3
  - example: begin_bmatrix_1_2_2_3_end_bmatrix
  - example: begin_bmatrix_1_2_2_4_end_bmatrix
    why: >-
      The matrix $$\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$$ is symmetric but not invertible, so being symmetric does not imply being invertible.
  - example: begin_bmatrix_0_minus_1_1_0_end_bmatrix
    why: >-
      The rotation by $90°$ is both orthogonal and skew-symmetric: its transpose is both its inverse and its negative.
see_also:
  - matrix_transpose_vs_inverse
  - positive_definite_vs_semidefinite
---
