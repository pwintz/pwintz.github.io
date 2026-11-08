---
published: false
title: Eigenvector
term: eigenvector
applies_to: square matrices and linear maps
levels:
  high-school:
    text: |-
      Consider a square [matrix](/definitions/matrix) $A$, which stretches and turns [vectors](/definitions/vector) when it multiplies them.
      An _eigenvector_ of $A$ is a nonzero vector $v$ that $A$ stretches without turning it off its line:

      $$A v = \lambda v$$

      for some number $\lambda$, the [eigenvalue](/definitions/eigenvalue) of $v$.
    caveat: >-
      An eigenvector can have complex entries, with a complex [eigenvalue](/definitions/eigenvalue).
      Then the picture of stretching without turning does not apply in the real plane: the matrix that rotates the plane by $90°$ turns every real vector off its line, but $(1, -i)$ is an eigenvector with eigenvalue $i$.
  undergraduate:
    text: |-
      Consider a square [matrix](/definitions/matrix) $A$.
      An _eigenvector_ of $A$ is a nonzero [vector](/definitions/vector) $v$ such that

      $$A v = \lambda v$$

      for some number $\lambda$, called the [eigenvalue](/definitions/eigenvalue) of $v$.
properties:
  - >-
    Every nonzero multiple of an eigenvector is an eigenvector with the same [eigenvalue](/definitions/eigenvalue).
    The eigenvectors for an eigenvalue $\lambda$, together with $0$, form a subspace, the _eigenspace_ $\ker(A - \lambda I)$.
  - >-
    Eigenvectors with different [eigenvalues](/definitions/eigenvalue) are [linearly independent](/definitions/linearly-independent).
  - >-
    An $n \times n$ matrix is diagonalizable if and only if it has $n$ [linearly independent](/definitions/linearly-independent) eigenvectors.
---
The [zero vector](/definitions/zero-vector) is excluded, because $A 0 = \lambda 0$ for every $\lambda$.
