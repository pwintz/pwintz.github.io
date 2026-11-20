---
# TODO: Use \vect and \trans throughout this page. 
title: Transpose
term: transpose
applies_to: matrices
synonyms: ['$A^{\top}$', '$A^T$']
levels:

  high-school:
    text: |-
      Consider an $m \times n$ [matrix](/dictionary/definitions/matrix) $A$.
      The _transpose_ of $A$ is the $n \times m$ matrix $A\trans$ such that each row $i$ in $A\trans$ contains the same entries as column $i$ of $A$.

  undergraduate:
    text: |-
      Consider an $m \times n$ [matrix](/dictionary/definitions/matrix) $A = [a_{ij}]$.
      The _transpose_ of $A$ is the $n \times m$ matrix $A^{\top}$ whose rows are the columns of $A$:

      $$(A^{\top})_{ij} = a_{ji}.$$
properties:
  - >-
    $(A B)^{\top} = B^{\top} A^{\top}$
  - >-
    $(A^{\top})^{\top} = A$.
  - >-
    For real column vectors $\vect{x}, \vect{y} \in \reals^n$, the [dot product](/dictionary/definitions/dot-product) is $x \cdot y = x^{\top} y$.
---
