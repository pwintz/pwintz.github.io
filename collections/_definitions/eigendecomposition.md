---
title: Eigendecomposition
term: eigendecomposition
applies_to: square matrices
synonyms: [diagonalization, spectral decomposition]
levels:
  undergraduate:
    text: |-
      Consider a square [matrix](/dictionary/definitions/matrix) $A$.
      An _eigendecomposition_ of $A$ is a factorization

      $$A = P D P^{-1},$$

      where $P$ is [invertible](/dictionary/definitions/invertible-matrix) and $D$ is diagonal.
      The diagonal entries of $D$ are [eigenvalues](/dictionary/definitions/eigenvalue) of $A$, and the columns of $P$ are corresponding [eigenvectors](/dictionary/definitions/eigenvector).
properties:
  - |-
    A square matrix $A$ has an eigendecomposition exactly when $A$ is diagonalizable, that is, when $A$ has $n$ [linearly independent](/dictionary/definitions/linearly-independent) [eigenvectors](/dictionary/definitions/eigenvector), where $A$ is $n \times n$.
    If the $n$ [eigenvalues](/dictionary/definitions/eigenvalue) of $A$ are distinct, then $A$ is diagonalizable.
  - |-
    If $A$ is real and [symmetric](/dictionary/definitions/symmetric-matrix), then $A$ has an eigendecomposition $A = Q \Lambda Q^{\top}$ with $Q$ orthogonal and $\Lambda$ real (the spectral theorem).
  - |-
    An eigendecomposition turns powers and functions of $A$ into powers and functions of numbers: $A^k = P D^k P^{-1}$ and $e^{A t} = P e^{D t} P^{-1}$.
---
For a symmetric [positive semidefinite](/dictionary/definitions/positive-semidefinite-matrix) matrix, the eigendecomposition $A = Q \Lambda Q^{\top}$ is also a [singular value decomposition](/dictionary/definitions/singular-value-decomposition).
For other matrices, the two differ: $P$ need not be orthogonal, and the entries of $D$ can be negative or complex.
