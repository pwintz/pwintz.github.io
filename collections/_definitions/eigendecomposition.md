---
title: Eigendecomposition
term: eigendecomposition
applies_to: square matrices
synonyms: [diagonalization, spectral decomposition]
levels:
  undergraduate:
    text: |-
      Consider a square [matrix](/definitions/matrix) $A$.
      An _eigendecomposition_ of $A$ is a factorization $A = P D P^{-1}$, where $P$ is invertible and $D$ is diagonal.
      The diagonal entries of $D$ are [eigenvalues](/definitions/eigenvalue) of $A$, and the columns of $P$ are corresponding eigenvectors.
properties:
  - |-
    A square matrix $A$ has an eigendecomposition exactly when $A$ is diagonalizable, that is, when $A$ has $n$ linearly independent eigenvectors, where $A$ is $n \times n$.
    If the $n$ eigenvalues of $A$ are distinct, then $A$ is diagonalizable.
  - |-
    If $A$ is real and [symmetric](/definitions/symmetric-matrix), then $A$ has an eigendecomposition $A = Q \Lambda Q^{\top}$ with $Q$ orthogonal and $\Lambda$ real (the spectral theorem).
  - |-
    An eigendecomposition turns powers and functions of $A$ into powers and functions of numbers: $A^k = P D^k P^{-1}$ and $e^{A t} = P e^{D t} P^{-1}$.
---
For a symmetric positive semidefinite matrix, the eigendecomposition $A = Q \Lambda Q^{\top}$ is also a [singular value decomposition](/definitions/singular-value-decomposition).
For other matrices, the two differ: $P$ need not be orthogonal, and the entries of $D$ can be negative or complex.
