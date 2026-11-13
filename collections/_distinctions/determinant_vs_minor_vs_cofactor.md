---
published: false
title: Determinant vs. minor vs. cofactor
kind: siblings
areas: [linear-algebra]
summary: >
  The determinant, the minors, and the cofactors of a square matrix are numbers that occur in calculations when a determinant is computed by expanding along a row.
  The [determinant](/dictionary/definitions/determinant) of a matrix $A$ is a single number, which measures how $A$ scales volumes.
  The $(i, j)$ [minor](/dictionary/definitions/minor) $M_{ij}$ of $A$ is the determinant of the smaller matrix obtained by deleting row $i$ and column $j$ of $A$, so an $n \times n$ matrix has $n^2$ minors of this kind.
  The $(i, j)$ [cofactor](/dictionary/definitions/cofactor) $C_{ij} = (-1)^{i + j} M_{ij}$ is the minor with a sign, so each cofactor is either equal to its minor or equal to the negative of its minor.
  Expanding along row $i$ gives $\det A = \sum_j a_{ij} C_{ij}$, where $a_{ij}$ is the $(i, j)$ entry of $A$.
examples_note: >-
  Each cell is the ___ of the matrix in that row.
terms:
  - determinant
  - minor
  - cofactor
examples:
  - example: matrix_2_1_4_3
  - example: matrix_1_2_3_4_5_6_7_8_10
see_also:
  - matrix_transpose_vs_inverse
  - types_of_square_matrices
---
## Notes

- The "adjugate" of $A$, the transpose of its matrix of [cofactors](/dictionary/definitions/cofactor), is also called the "classical adjoint," which is unrelated to the [adjoint](/dictionary/definitions/adjoint) of a [linear map](/dictionary/definitions/linear-map).
