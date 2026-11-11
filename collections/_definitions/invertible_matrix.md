---
published: false
title: Invertible matrix
term: invertible
applies_to: square matrices
synonyms: [nonsingular]
levels:
  high-school:
    text: |-
      Consider an $n \times n$ [matrix](/dictionary/definitions/matrix) $A$.
      The matrix $A$ is _invertible_ if there is a matrix $A^{-1}$, called the _inverse_ of $A$, with

      $$A A^{-1} = A^{-1} A = I.$$
properties:
  - >-
    A square matrix $A$ is invertible if and only if $\det A \neq 0$, if and only if its columns are [linearly independent](/dictionary/definitions/linearly-independent), if and only if $A x = 0$ only for $x = 0$.
  - >-
    For a $2 \times 2$ matrix, $$\begin{bmatrix} a & b \\ c & d \end{bmatrix}^{-1} = \frac{1}{a d - b c} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$$.
---
