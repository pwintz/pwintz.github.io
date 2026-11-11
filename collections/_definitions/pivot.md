---
published: false
title: Pivot
term: pivot
applies_to: matrices in Gaussian elimination
levels:
  high-school:
    # TODO: Revise.
    text: |-
      Consider a [matrix](/dictionary/definitions/matrix).
      A _pivot_ of the matrix is the [leading entry](/dictionary/definitions/leading-entry) of one of its nonzero rows.
      Its position is a _pivot position_, and its column is a _pivot column_.
  undergraduate:
    context: Gaussian elimination
    text: |-
      In Gaussian elimination, a _pivot_ is a nonzero entry used to eliminate the other entries in its column.
      The pivots become the leading entries of the resulting echelon form, and their positions, the _pivot positions_ of the original matrix, do not depend on which row operations are used.
properties:
  - |-
    The number of pivots of a matrix equals its [rank](/dictionary/definitions/matrix-rank).
  - |-
    In a linear system, the variables of the pivot columns are the basic variables, and the others are free variables.
---
In numerical computation, _partial pivoting_ chooses the entry of largest absolute value in a column as the pivot, to reduce rounding errors.
That pivot need not be the [leading entry](/dictionary/definitions/leading-entry) of its row before the rows are exchanged.

To practice, see the [Gaussian elimination practice tool](/tools/gaussian_elimination_practice/).
