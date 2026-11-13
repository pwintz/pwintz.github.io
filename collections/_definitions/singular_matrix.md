---
published: false
title: Singular matrix
term: singular (matrix)
applies_to: square matrices
synonyms: [non-invertible matrix, degenerate matrix]
levels:
  high-school:
    text: |-
      Consider a square [matrix](/dictionary/definitions/matrix) $A$.
      The matrix $A$ is _singular_ if its [determinant](/dictionary/definitions/determinant) is zero:

      $$\det A = 0.$$
  undergraduate:
    text: |-
      Consider an $n \times n$ [matrix](/dictionary/definitions/matrix) $A$.
      The matrix $A$ is _singular_ if there is a nonzero vector $x$ such that

      $$A x = 0.$$
properties:
  - >-
    A square matrix is singular if and only if the matrix is not [invertible](/dictionary/definitions/invertible-matrix).
  - >-
    A square matrix $A$ is singular if and only if $0$ is an [eigenvalue](/dictionary/definitions/eigenvalue) of $A$.
  - >-
    An $n \times n$ matrix is singular if and only if its [rank](/dictionary/definitions/matrix-rank) is less than $n$, if and only if its [nullity](/dictionary/definitions/nullity) is positive.
---
Only square matrices are called singular or nonsingular.

"Singular" here is unrelated to [singular values](/dictionary/definitions/singular-value), which every matrix has.
A square matrix is singular exactly when one of its singular values is $0$.
