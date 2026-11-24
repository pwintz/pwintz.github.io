---
# TODO: Use macros configured in settings for this page. Also, add an option for how unit vectors are displayed. 
title: Orthonormal Vectors
term: orthonormal
applies_to: lists of vectors in an inner product space
synonyms: [orthonormal list, orthonormal set]
levels:
  high-school:
    text: |-
      A list of vectors is _orthonormal_ if every vector in the list has length $1$ and if the [angle](/dictionary/definitions/angular-measure) between every pair of two different vectors in the list is a [right angle](/dictionary/definitions/right-angle).
  undergraduate:
    context: $\reals^3$
    text: |-
      A list of $e_1, \dots, e_k$ of vectors in $\reals^n$ is callled  _orthonormal_  if
      
      1. each vector $\vec{e_i}$ is a unit vector, meaning the [norm](/dictionary/definitions/norm) is one: $\norm{\vect{e}_i} = 1,$ and 

      2. every pair of distinct vectors $\vect{e}_i$ and $\vect{e}_j$ (with $i \neq j$) is orthogonal: $\ip{\vect{e}_i}{\vect{e}_j} = 0$

  graduate:
    context: inner product spaces
    text: |-
      Consider an [inner product space](/dictionary/definitions/inner-product-space) $V$. 
      A list $e_1, \dots, e_k$ of vectors in $V$ is called _orthonormal_ if

      $$\ip{e_i}{e_j} = \begin{cases} 1 & \text{if } i = j, \\ 0 & \text{if } i \neq j. \end{cases}$$
properties:
  - |-
    A list is orthonormal exactly when the list is [orthogonal](/dictionary/definitions/orthogonal-vectors) and every vector in the list is a [unit vector](/dictionary/definitions/unit-vector).
  - |-
    Dividing each vector of an orthogonal list of nonzero vectors by its [norm](/dictionary/definitions/norm) gives an orthonormal list.
  - |-
    A square matrix is an [orthogonal matrix](/dictionary/definitions/orthogonal-matrix) exactly when its columns are orthonormal.

  # TODO: Add a note about why orthonormal sets are exceptionally nice as coordinate systems: It is very easy to find coordinates and projections. 
---
