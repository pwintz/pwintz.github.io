---
title: Types of matrix decompositions
kind: siblings
areas: [linear-algebra, computing]
summary: >
  A matrix decomposition writes a matrix in terms of simpler matrices.
  Most are products: LU, PLU, and [Cholesky decompositions](/definitions/cholesky-decomposition) use triangular factors, QR and [singular value decompositions](/definitions/singular-value-decomposition) use orthogonal factors, and [eigendecompositions](/definitions/eigendecomposition), [Schur decompositions](/definitions/schur-decomposition), and [Jordan normal forms](/definitions/jordan-normal-form) are similarities $A = P M P^{-1}$ to a simpler matrix $M$ (diagonal, triangular, or made of Jordan blocks).
  In contrast, the [Jordan–Chevalley decomposition](/definitions/jordan-chevalley-decomposition) is a sum of commuting diagonalizable and nilpotent parts, and the [Toeplitz decomposition](/definitions/toeplitz-decomposition) is a sum $H + K$ of a [symmetric matrix](/definitions/symmetric-matrix) $H$ and a [skew-symmetric](/definitions/skew-symmetric-matrix) matrix $K$.
terms:
  - lu_decomposition
  - plu_decomposition
  - cholesky_decomposition
  - qr_decomposition
  - singular_value_decomposition
  - eigendecomposition
  - schur_decomposition
  - jordan_normal_form
  - jordan_chevalley_decomposition
  - toeplitz_decomposition
examples_note: >-
  Each cell is the ___ of the matrix $A$ in that row, when it is easy to write down.
examples:
  - example: matrix_2_1_4_3
  - example: matrix_4_2_2_3
    why: >-
      The matrix $$A = \begin{bmatrix} 4 & 2 \\ 2 & 3 \end{bmatrix}$$ is symmetric positive definite, so it has every decomposition in the table, including a Cholesky decomposition.
      Its eigendecomposition, Schur decomposition, Jordan normal form, and singular value decomposition all coincide, and its polar and Toeplitz decompositions are trivial.
  - example: matrix_swap_rows
  - example: matrix_jordan_block
  - example: diagonal_split_not_jc
  - example: polar_decomposition
  - example: eigendecomposition
see_also:
  - types_of_array_quantities
  - poles_vs_eigenvalues_vs_zeros
---
## What each decomposition is for

- **LU:** solving $A x = b$ for many right-hand sides $b$.
  LU is Gaussian elimination, recorded.
  
- **PLU:** the same as LU except it works for every square matrix due to permuting the rows of $A$. 
<!-- artial pivoting for numerical stability. -->
  PLU is Gaussian elimination with row exchanges, recorded.

- **QR:** least-squares problems and the QR algorithm for [eigenvalues](/definitions/eigenvalue).
  QR is the Gram–Schmidt process, recorded.
  
- **SVD:** rank, low-rank approximation, and the geometry of a [linear map](/definitions/linear-map).

- **Cholesky:** solving $A x = b$ when $A$ is symmetric positive definite, as in least squares and optimization, at half the cost of LU, and sampling from a multivariate normal distribution.

- **Eigendecomposition:** computing powers and exponentials of a diagonalizable matrix, and decoupling linear systems into independent modes.

- **Schur:** computing eigenvalues stably; it exists for every matrix, unlike an [eigendecomposition](/definitions/eigendecomposition).

- **Jordan normal form:** classifying matrices up to similarity, and computing $e^{A t}$ for matrices that are not diagonalizable, by hand.

- **Jordan–Chevalley:** separating the diagonalizable part of a matrix from its nilpotent part, as in computing $e^{A t} = e^{D t} e^{N t}$.

- **Toeplitz:** separating the symmetric part $H$ of a matrix $A$, which alone determines the quadratic form $x^{\top} A x = x^{\top} H x$, as in energy and stability arguments.

