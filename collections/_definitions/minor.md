---
title: Minor of a matrix
term: minor
applies_to: square matrices
synonyms: ['$M_{ij}$']
levels:
  high-school:
    text: |-
      Consider a $3 \times 3$ [matrix](/dictionary/definitions/matrix) $A$ and a row number $i$ and a column number $j$.
      The $(i, j)$ _minor_ of $A$ is the [determinant](/dictionary/definitions/determinant) of the $2 \times 2$ matrix that is left after crossing out row $i$ and column $j$ of $A$.

      For example, consider the matrix

      $$A = \begin{bmatrix} a & b & c \\ d & e & f \\ g & h & k \end{bmatrix}.$$

      Crossing out row $2$ and column $3$ of $A$ leaves the $2 \times 2$ matrix with the entries $a$, $b$, $g$, and $h$, so the $(2, 3)$ minor of $A$ is

      $$M_{23} = \det \begin{bmatrix} a & b \\ g & h \end{bmatrix} = a h - b g.$$
  undergraduate:
    text: |-
      Consider an $n \times n$ [matrix](/dictionary/definitions/matrix) $A$ and indices $i$ and $j$, and let $A^{(i, j)}$ be the $(n - 1) \times (n - 1)$ matrix obtained by deleting row $i$ and column $j$ of $A$.
      The $(i, j)$ _minor_ of $A$ is the [determinant](/dictionary/definitions/determinant)

      $$M_{ij} = \det A^{(i, j)}.$$
properties:
  - >-
    The $(i, j)$ [cofactor](/dictionary/definitions/cofactor) of $A$ is the $(i, j)$ minor with a sign: $C_{ij} = (-1)^{i + j} M_{ij}$.
  - >-
    A [symmetric matrix](/dictionary/definitions/symmetric-matrix) is [positive definite](/dictionary/definitions/positive-definite-matrix) if and only if all of its leading principal minors are positive (Sylvester's criterion).
---
More generally, a _minor of order $k$_ of a matrix, square or not, is the [determinant](/dictionary/definitions/determinant) of a $k \times k$ submatrix obtained by keeping $k$ of its rows and $k$ of its columns.
In this sense, the $(i, j)$ minor of an $n \times n$ matrix is a minor of order $n - 1$.
A _principal minor_ keeps the same rows as columns, and a _leading principal minor_ keeps the first $k$ rows and the first $k$ columns.
