---
title: Cofactor of a matrix
term: cofactor
applies_to: square matrices
synonyms: ['$C_{ij}$']
levels:
  high-school:
    text: |-
      Consider a $3 \times 3$ [matrix](/dictionary/definitions/matrix) $A$ and a row number $i$ and a column number $j$.
      The $(i, j)$ _cofactor_ of $A$ is the $(i, j)$ [minor](/dictionary/definitions/minor) of $A$, with its sign changed when $i + j$ is odd, following the checkerboard pattern

      $$\begin{bmatrix} + & - & + \\ - & + & - \\ + & - & + \end{bmatrix}.$$
  undergraduate:
    text: |-
      Consider an $n \times n$ [matrix](/dictionary/definitions/matrix) $A$ and indices $i$ and $j$.
      The $(i, j)$ _cofactor_ of $A$ is the $(i, j)$ [minor](/dictionary/definitions/minor) $M_{ij}$ of $A$ multiplied by $(-1)^{i + j}$:

      $$C_{ij} = (-1)^{i + j} M_{ij}.$$
properties:
  - >-
    The [determinant](/dictionary/definitions/determinant) of $A$ is the sum of the entries of one row times their cofactors (the Laplace, or cofactor, expansion): $\det A = \sum_{j = 1}^{n} a_{ij} C_{ij}$ for each row $i$, where $a_{ij}$ is the $(i, j)$ entry of $A$, and similarly for each column.
  - >-
    The transpose of the matrix of cofactors is the _adjugate_ $\operatorname{adj} A$ of $A$, which satisfies $A \operatorname{adj} A = (\det A) I$.
    So if $\det A \neq 0$, then $A^{-1} = \operatorname{adj} A / \det A$.
  - >-
    The cofactor $C_{ij}$ is the [partial derivative](/dictionary/definitions/partial-derivative) of $\det A$ with respect to the entry $a_{ij}$.
---
