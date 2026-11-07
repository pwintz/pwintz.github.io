---
published: false
title: Types of matrix decompositions
kind: siblings
areas: [linear-algebra, computing]
status: draft
summary: >
  A matrix decomposition writes a matrix in terms of simpler matrices.
  Most are products: LU, PLU, and Cholesky decompositions use triangular factors, QR and singular value decompositions use orthogonal factors, and eigendecompositions, Schur decompositions, and Jordan normal forms are similarities $A = P M P^{-1}$ to a simpler matrix $M$ (diagonal, triangular, or made of Jordan blocks).
  In contrast, the Jordan–Chevalley decomposition is a sum of commuting diagonalizable and nilpotent parts, and the Toeplitz decomposition is a sum $H + K$ of a symmetric matrix $H$ and a skew-symmetric matrix $K$.
terms:
  - lu_decomposition
  - plu_decomposition
  - cholesky_decomposition
  - qr_decomposition
  - eigendecomposition
  - schur_decomposition
  - jordan_normal_form
  - singular_value_decomposition
  - jordan_chevalley_decomposition
  - toeplitz_decomposition
examples_note: >-
  Each cell is the ___ of the matrix $A$ in that row, when it is easy to write down.
examples:
  - example: matrix_2_1_4_3
    why: >-
      $A$ has an LU decomposition, because subtracting $2$ times row $1$ from row $2$ makes it upper triangular, and $L$ records the $2$.
      $A$ has the distinct eigenvalues $\frac{5 \pm \sqrt{17}}{2}$, so it is diagonalizable, and its Jordan–Chevalley decomposition has $D = A$ and $N = 0$.
  - example: matrix_4_2_2_3
    why: >-
      The matrix $$A = \begin{bmatrix} 4 & 2 \\ 2 & 3 \end{bmatrix}$$ is symmetric positive definite, so it has every decomposition in the table, including a Cholesky decomposition.
      Its eigendecomposition, Schur decomposition, Jordan normal form, and singular value decomposition all coincide, and its polar and Toeplitz decompositions are trivial.
  - example: matrix_swap_rows
    why: >-
      $A$ has no LU decomposition without exchanging rows, because its top-left entry is $0$, even though $A$ is invertible, but it has the PLU decomposition $A = A \cdot I \cdot I$.
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
  
- **PLU:** the same, for every square matrix, and with partial pivoting for numerical stability.
  It is Gaussian elimination with row exchanges, recorded, and it is what numerical libraries compute.

- **QR:** least-squares problems and the QR algorithm for eigenvalues.
  It is the Gram–Schmidt process, recorded.
  
- **SVD:** rank, low-rank approximation, and the geometry of a linear map.

- **Cholesky:** solving $A x = b$ when $A$ is symmetric positive definite, as in least squares and optimization, at half the cost of LU, and sampling from a multivariate normal distribution.
- **Eigendecomposition:** computing powers and exponentials of a diagonalizable matrix, and decoupling linear systems into independent modes.
- **Schur:** computing eigenvalues stably; it exists for every matrix, unlike an eigendecomposition.
- **Jordan normal form:** classifying matrices up to similarity, and computing $e^{A t}$ for matrices that are not diagonalizable, by hand.
- **Jordan–Chevalley:** separating the diagonalizable part of a matrix from its nilpotent part, as in computing $e^{A t} = e^{D t} e^{N t}$.

- **Toeplitz:** separating the symmetric part $H$ of a matrix $A$, which alone determines the quadratic form $x^{\top} A x = x^{\top} H x$, as in energy and stability arguments.

