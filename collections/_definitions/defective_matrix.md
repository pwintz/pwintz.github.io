---
published: false
title: Defective matrix
term: defective (matrix)
applies_to: square matrices
levels:
  undergraduate:
    text: |-
      Consider an $n \times n$ [matrix](/dictionary/definitions/matrix) $A$ with complex entries.
      The matrix $A$ is _defective_ if $A$ has an [eigenvalue](/dictionary/definitions/eigenvalue) $\lambda$ that has fewer [linearly independent](/dictionary/definitions/linearly-independent) [eigenvectors](/dictionary/definitions/eigenvector) than its multiplicity $m_\lambda$ as a root of the characteristic [polynomial](/dictionary/definitions/polynomial) $\det(A - x I)$:

      $$\dim \ker (A - \lambda I) < m_\lambda.$$
properties:
  - >-
    An $n \times n$ matrix is defective if and only if the matrix has fewer than $n$ [linearly independent](/dictionary/definitions/linearly-independent) [eigenvectors](/dictionary/definitions/eigenvector), if and only if it has no [eigendecomposition](/dictionary/definitions/eigendecomposition) (the matrix is not diagonalizable).
  - >-
    A matrix with $n$ distinct [eigenvalues](/dictionary/definitions/eigenvalue) is not defective.
  - >-
    A matrix is defective if and only if its [Jordan normal form](/dictionary/definitions/jordan-normal-form) has a Jordan block of size $2$ or more.
  - >-
    Real [symmetric matrices](/dictionary/definitions/symmetric-matrix) are not defective.
---
The number $\dim \ker (A - \lambda I)$ is the _geometric multiplicity_ of $\lambda$, and $m_\lambda$ is its _algebraic multiplicity_.
Every [eigenvalue](/dictionary/definitions/eigenvalue) has geometric multiplicity at most its algebraic multiplicity.

A real matrix such as the rotation $$\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$$ has no real [eigenvectors](/dictionary/definitions/eigenvector), but it is not defective, because it has the two independent complex eigenvectors $(1, -i)$ and $(1, i)$.
