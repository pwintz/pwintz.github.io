---
published: false
title: Rank of a Matrix
term: rank (of a matrix)
applies_to: matrices
levels:
  high-school:
    text: |-
      Consider a [matrix](/dictionary/definitions/matrix) $A$ and its reduced row echelon form.
      The _rank_ of $A$ is the number of nonzero rows of the reduced row echelon form, which is the number of its [leading entries](/dictionary/definitions/leading-entry).
  undergraduate:
    text: |-
      Consider a [matrix](/dictionary/definitions/matrix) and its [column space](/dictionary/definitions/column-space), the span of its columns.
      The _rank_ of the matrix is the dimension of its column space: the maximum number of [linearly independent](/dictionary/definitions/linearly-independent) columns.
properties:
  - >-
    The rank of an $m \times n$ matrix $A$ is the [rank](/dictionary/definitions/rank-linear-map) of the [linear map](/dictionary/definitions/linear-map) $x \mapsto A x$ from $\reals^n$ to $\reals^m$, because the [column space](/dictionary/definitions/column-space) of $A$ is the [range](/dictionary/definitions/range-image) of that map.
  - >-
    If $A$ is the [matrix of a linear map](/dictionary/definitions/matrix-of-a-linear-map) $T$ relative to some pair of bases, then $\rank{A} = \rank{T}$.
  - >-
    The rank also equals the maximum number of [linearly independent](/dictionary/definitions/linearly-independent) rows (row rank equals column rank).
  - >-
    For an $m \times n$ [matrix](/dictionary/definitions/matrix) $A$, the rank plus the [nullity](/dictionary/definitions/nullity) (the dimension of the [null space](/dictionary/definitions/kernel)) of $A$ is $n$ (the rank–nullity theorem).
---
