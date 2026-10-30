---
title: Symmetric matrix
term: symmetric matrix
applies_to: matrices
levels:
  high-school:
    text: |-
      A _symmetric matrix_ is a square [matrix](/definitions/matrix) that is unchanged when flipped across its main diagonal: the entry in row $i$ and column $j$ equals the entry in row $j$ and column $i$.
  undergraduate:
    text: |-
      A _symmetric matrix_ is a square [matrix](/definitions/matrix) that is equal to its [transpose](/definitions/transpose): 
      
      $$A^{\top} = A.$$ 
      
    # so $a_{ij} = a_{ji}$. A _skew-symmetric_ matrix has $A^{\top} = -A$.
properties:
  - >-
    A real symmetric matrix has real [eigenvalues](/definitions/eigenvalue) and an orthonormal basis of eigenvectors (the spectral theorem), so $A = Q \Lambda Q^{\top}$ with $Q$ orthogonal and $\Lambda$ diagonal.
  - |-
    Every square [matrix](/definitions/matrix) is the sum of a symmetric matrix and a [skew-symmetric matrix](/definitions/skew-symmetric matrix):

    $$A = \frac{1}{2}(A + A^{\top}) + \frac{1}{2}(A - A^{\top}).$$
---
