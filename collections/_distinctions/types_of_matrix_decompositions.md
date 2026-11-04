---
published: false
title: Types of matrix decompositions
kind: siblings
areas: [linear-algebra, computing]
status: draft
summary: >
  A matrix decomposition writes a matrix in terms of simpler matrices.
  LU, QR, and singular value decompositions are products (triangular times triangular, orthonormal times triangular, and orthogonal times diagonal times orthogonal), while the Jordan–Chevalley decomposition is a sum of commuting diagonalizable and nilpotent parts.
terms:
  - lu_decomposition
  - qr_decomposition
  - singular_value_decomposition
  - jordan_chevalley_decomposition
examples_note: >-
  Each cell is the ___ of the matrix $A$ in that row, when it is easy to write down.
examples:
  - example: matrix_2_1_4_3
    why: >-
      $A$ has an LU decomposition, because subtracting $2$ times row $1$ from row $2$ makes it upper triangular, and $L$ records the $2$.
      $A$ has the distinct eigenvalues $\frac{5 \pm \sqrt{17}}{2}$, so it is diagonalizable, and its Jordan–Chevalley decomposition has $D = A$ and $N = 0$.
  - example: matrix_swap_rows
    why: >-
      $A$ has no LU decomposition without exchanging rows, because its top-left entry is $0$, even though $A$ is invertible.
      $A$ is orthogonal, so its QR decomposition is $A \cdot I$, its singular value decomposition is $A \cdot I \cdot I$, and its Jordan–Chevalley decomposition has $N = 0$ because $A$ is diagonalizable.
  - example: matrix_jordan_block
    why: >-
      $A$ is upper triangular, so its LU decomposition is $I \cdot A$, and its QR decomposition is $I \cdot A$.
      $A$ is not diagonalizable, so its Jordan–Chevalley decomposition has a nonzero nilpotent part $N$.
  - example: diagonal_split_not_jc
    why: >-
      Splitting the matrix into its diagonal and the part above the diagonal is not its Jordan–Chevalley decomposition, because the two parts do not commute.
      The matrix has the distinct eigenvalues $1$ and $2$, so it is diagonalizable, and its Jordan–Chevalley decomposition has $N = 0$.
  - example: polar_decomposition
    why: >-
      A polar decomposition is not a QR decomposition, because $S$ is symmetric positive semidefinite, not upper triangular.
  - example: eigendecomposition
    why: >-
      An eigendecomposition is not a singular value decomposition, because $P$ need not be orthogonal, and the entries of $D$ can be negative or complex.
see_also:
  - types_of_array_quantities
  - poles_vs_eigenvalues_vs_zeros
---
## What each decomposition is for

- **LU:** solving $A x = b$ for many right-hand sides $b$.
  It is Gaussian elimination, recorded.
- **QR:** least-squares problems and the QR algorithm for eigenvalues.
  It is the Gram–Schmidt process, recorded.
- **SVD:** rank, low-rank approximation, and the geometry of a linear map.
- **Jordan–Chevalley:** separating the diagonalizable part of a matrix from its nilpotent part, as in computing $e^{A t} = e^{D t} e^{N t}$.
