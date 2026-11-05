---
title: Symmetric matrix
term: symmetric matrix
applies_to: matrices
levels:
  high-school:
    text: |-
      A square [matrix](/definitions/matrix) $A$ is called _symmetric_ if $A$ is unchanged when flipped across the main diagonal: for every $i$ and $j$, the entry in row $i$ and column $j$ of $A$ equals the entry in row $j$ and column $i$ of $A$.
  undergraduate:
    text: |-
      A square [matrix](/definitions/matrix) $A$ is called _symmetric_ if $A$ is equal to its [transpose](/definitions/transpose): 
      
      $$A^{\top} = A.$$ 
      
    # so $a_{ij} = a_{ji}$. A _skew-symmetric_ matrix has $A^{\top} = -A$.
properties:
  - >-
    A real symmetric matrix has real [eigenvalues](/definitions/eigenvalue) and an orthonormal basis of eigenvectors (the spectral theorem), so $A = Q \Lambda Q^{\top}$ with $Q$ orthogonal and $\Lambda$ diagonal.
  - |-
    Every square [matrix](/definitions/matrix) is the sum of a symmetric matrix and a [skew-symmetric matrix](/definitions/skew-symmetric-matrix):

    $$A = \frac{1}{2}(A + A^{\top}) + \frac{1}{2}(A - A^{\top}).$$
---
