---
title: PLU decomposition
term: PLU decomposition
applies_to: square matrices
synonyms: [LU decomposition with partial pivoting, LUP decomposition]
levels:
  undergraduate:
    text: |-
      Consider a square [matrix](/definitions/matrix) $A$.
      A _PLU decomposition_ of $A$ is a factorization

      $$A = P L U,$$

      where

      1. $P$ is a permutation matrix (the identity matrix with its rows reordered),
      2. $L$ is lower triangular with ones on its diagonal, and
      3. $U$ is upper triangular.
properties:
  - |-
    Every square matrix has a PLU decomposition, unlike an [LU decomposition](/definitions/lu-decomposition), which need not exist.
  - |-
    Gaussian elimination with row exchanges computes a PLU decomposition: $P$ records the row exchanges, $U$ is the resulting echelon form, and $L$ records the multiples of rows that were subtracted.
  - |-
    The PLU decomposition of a matrix is not unique in general, because different row exchanges can be chosen.
    _Partial pivoting_, which brings the entry of largest absolute value in each column to the pivot position, makes the multipliers in $L$ at most $1$ in absolute value, which limits the growth of rounding errors.
---
Some authors write $P A = L U$ instead of $A = P L U$.
The two conventions use inverse permutation matrices, since $P^{-1} = P^{\top}$.

Numerical libraries (for example, `lu` in MATLAB and `scipy.linalg.lu` in Python) compute a PLU decomposition with partial pivoting, not a plain [LU decomposition](/definitions/lu-decomposition).
