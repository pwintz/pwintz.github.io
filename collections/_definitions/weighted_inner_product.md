---
published: false
title: Weighted inner product
term: weighted inner product
applies_to: vectors in $\reals^n$
synonyms: ['$\ip{x}{y}_W$', $W$-inner product]
levels:
  undergraduate:
    text: |-
      Consider a symmetric [positive definite](/dictionary/definitions/positive-definite-matrix) $n \times n$ matrix $W$.
      The _weighted inner product_ with weight $W$ is the [inner product](/dictionary/definitions/inner-product) on $\reals^n$ given by

      $$\ip{x}{y}_W = x^{\top} W y.$$
properties:
  - >-
    With $W = I$, the weighted inner product is the [dot product](/dictionary/definitions/dot-product).
  - >-
    Every [inner product](/dictionary/definitions/inner-product) on $\reals^n$ is a weighted inner product for some symmetric positive definite $W$, namely the matrix $W = [w_{ij}]$ with the entries $w_{ij} = \ip{e_i}{e_j}$.
  - >-
    Whether two vectors are [orthogonal](/dictionary/definitions/orthogonal-vectors) depends on the [inner product](/dictionary/definitions/inner-product): vectors that are perpendicular for the [dot product](/dictionary/definitions/dot-product) need not be orthogonal for a weighted inner product.
---
