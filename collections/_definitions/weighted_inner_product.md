---
published: false
title: Weighted inner product
term: weighted inner product
applies_to: vectors in $\reals^n$
synonyms: ['$\ip{x}{y}_W$', $W$-inner product]
levels:
  undergraduate:
    text: |-
      Consider a symmetric [positive definite](/definitions/positive-definite-matrix) $n \times n$ matrix $W$.
      The _weighted inner product_ with weight $W$ is the [inner product](/definitions/inner-product) on $\reals^n$ given by

      $$\ip{x}{y}_W = x^{\top} W y.$$
properties:
  - >-
    With $W = I$, the weighted inner product is the [dot product](/definitions/dot-product).
  - >-
    Every [inner product](/definitions/inner-product) on $\reals^n$ is a weighted inner product for some symmetric positive definite $W$, namely the matrix with entries $W_{ij} = \ip{e_i}{e_j}$.
  - >-
    Whether two vectors are [orthogonal](/definitions/orthogonal-vectors) depends on the [inner product](/definitions/inner-product): vectors that are perpendicular for the [dot product](/definitions/dot-product) need not be orthogonal for a weighted inner product.
---
