---
title: LU decomposition
term: LU decomposition
applies_to: square matrices
synonyms: [LU factorization]
levels:
  undergraduate:
    text: |-
      Consider a square [matrix](/dictionary/definitions/matrix) $A$.
      An _LU decomposition_ of $A$ is a factorization $A = L U$, where $L$ is lower triangular (usually with ones on its diagonal) and $U$ is upper triangular.
properties:
  - |-
    Gaussian elimination without row exchanges computes an LU decomposition: $U$ is the resulting echelon form, and $L$ records the multiples of rows that were subtracted.
  - |-
    Not every [invertible](/dictionary/definitions/invertible-matrix) matrix has an LU decomposition.
    With a permutation matrix $P$ that reorders the rows, every square matrix has a [PLU decomposition](/dictionary/definitions/plu-decomposition) $A = P L U$.
  - |-
    Once $A = L U$ is known, $A x = b$ can be solved quickly by solving $L y = b$ and then $U x = y$, each by substitution.
---
