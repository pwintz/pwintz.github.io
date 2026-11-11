---
published: false
title: Orthonormal vectors
term: orthonormal
applies_to: lists of vectors in an inner product space
synonyms: [orthonormal vectors, orthonormal list, orthonormal set]
levels:
  high-school:
    text: |-
      A list of vectors is _orthonormal_ if every vector in the list has length $1$ and every two different vectors in the list are at [right angles](/dictionary/definitions/right-angle).
  undergraduate:
    context: inner product spaces
    text: |-
      Consider an [inner product space](/dictionary/definitions/inner-product-space) and a list $e_1, \dots, e_k$ of vectors in the space.
      The list is _orthonormal_ if

      $$\ip{e_i}{e_j} = \begin{cases} 1 & \text{if } i = j, \\ 0 & \text{if } i \neq j. \end{cases}$$
properties:
  - >-
    A list is orthonormal exactly when the list is [orthogonal](/dictionary/definitions/orthogonal-vectors) and every vector in the list is a [unit vector](/dictionary/definitions/unit-vector).
  - >-
    Dividing each vector of an orthogonal list of nonzero vectors by its [norm](/dictionary/definitions/norm) gives an orthonormal list.
  - >-
    A square matrix is an [orthogonal matrix](/dictionary/definitions/orthogonal-matrix) exactly when its columns are orthonormal.
---
