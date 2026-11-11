---
published: false
title: Trace vs. determinant vs. transpose vs. inverse
kind: siblings
areas: [linear-algebra]
summary: >
  Square matrices come with several standard derived quantities, which are often confused because of similar notation, such as $A^{\top}$ and $A^{-1}$.
  The trace and the [determinant](/dictionary/definitions/determinant) are numbers: the sum and the product of the [eigenvalues](/dictionary/definitions/eigenvalue).
  The transpose and the inverse are matrices, and they are equal exactly for orthogonal matrices.
terms:
  - trace
  - determinant
  - transpose
  - invertible_matrix
examples:
  - example: matrix_2_1_4_3
  - example: begin_bmatrix_0_minus_1_1_0_end_bmatrix
  - example: begin_bmatrix_1_2_2_4_end_bmatrix
    why: >-
      The matrix $$\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$$ has a transpose but no inverse: every matrix has a transpose, but only matrices with nonzero determinant have inverses.
see_also:
  - types_of_square_matrices
  - singular_value_vs_eigenvalue
---
