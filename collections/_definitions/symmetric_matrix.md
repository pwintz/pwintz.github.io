---
title: Symmetric matrix
term: symmetric matrix
applies_to: matrices
levels:
  high-school:
    text: |-
      A square [matrix](/dictionary/definitions/matrix) $A$ is called _symmetric_ if $A$ is unchanged when flipped across the main diagonal: for every $i$ and $j$, the entry in row $i$ and column $j$ of $A$ equals the entry in row $j$ and column $i$ of $A$.
  undergraduate:
    text: |-
      A square [matrix](/dictionary/definitions/matrix) $A$ is called _symmetric_ if $A$ is equal to its [transpose](/dictionary/definitions/transpose): 
      
      $$A^{\top} = A.$$ 
      
    # so $a_{ij} = a_{ji}$. A _skew-symmetric_ matrix has $A^{\top} = -A$.
properties:
  - >-
    A real symmetric matrix has real [eigenvalues](/dictionary/definitions/eigenvalue) and an [orthonormal](/dictionary/definitions/orthonormal) [basis](/dictionary/definitions/vector-basis) of [eigenvectors](/dictionary/definitions/eigenvector) (the spectral theorem), so $A = Q \Lambda Q^{\top}$ with $Q$ orthogonal and $\Lambda$ diagonal.
  - |-
    Every square [matrix](/dictionary/definitions/matrix) is the sum of a symmetric matrix and a [skew-symmetric matrix](/dictionary/definitions/skew-symmetric-matrix), called its [Toeplitz decomposition](/dictionary/definitions/toeplitz-decomposition):

    $$A = \frac{1}{2}(A + A^{\top}) + \frac{1}{2}(A - A^{\top}).$$
---
