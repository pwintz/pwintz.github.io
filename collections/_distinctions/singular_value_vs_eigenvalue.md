---
title: Eigenvalue vs. singular value
kind: siblings
areas: [linear-algebra]
summary: >
  Eigenvalues and singular values both describe how a matrix stretches vectors, but they agree only for special matrices.
  An eigenvalue of a square matrix $A$ is a factor $\lambda$ by which $A$ scales a particular nonzero vector $x$, called a eigenvalue: $Ax = \lambda x$.
  A singular value of a matrix $A$, square or not, is a factor $\sigma$ by which $A$ stretches vectors along some direction, allowing it them turn.
  [Singular values](/definitions/singular-value) are real and nonnegative, but [eigenvalues](/definitions/eigenvalue) can be negative or complex.
# Singular values are the square roots of the eigenvalues of $A^{\top} A$.D
# An eigenvalue of a square matrix $A$ is a factor by which $A$ stretches some nonzero vector without turning it off its line.
terms:
  - eigenvalue
  - singular_value
examples_note: >-
  Each cell lists the eigenvalues or the singular values of the matrix in that row.
examples:
  - example: diag_2_minus_3
  - example: begin_bmatrix_0_minus_1_1_0_end_bmatrix
  - example: matrix_jordan_block
  - example: begin_bmatrix_1_0_2_0_1_3_end_bmatrix
see_also:
  - types_of_matrix_decompositions
---
## Notes

- For a normal matrix ($A^{\top} A = A A^{\top}$, such as a symmetric or [orthogonal matrix](/definitions/orthogonal-matrix)), the [singular values](/definitions/singular-value) are the absolute values of the [eigenvalues](/definitions/eigenvalue).
- For a square matrix, the product of the singular values is $\abs{\det A}$, the absolute value of the product of the eigenvalues.
