---
published: false
title: Entrywise exponential
term: entrywise exponential
applies_to: matrices and arrays
synonyms: [elementwise exponential]
levels:
  high-school:
    text: |-
      Consider a [matrix](/dictionary/definitions/matrix) $A = [a_{ij}]$.
      The _entrywise exponential_ of $A$ is the matrix $B = [b_{ij}]$ of the same size such that

      $$b_{ij} = e^{a_{ij}} \quad \text{for all } i \text{ and } j.$$
properties:
  - >-
    The entrywise exponential is defined for matrices of every shape, not only for square matrices.
  - >-
    Every entry of the entrywise exponential of a real matrix is positive.
---
In MATLAB, `exp(A)` computes the entrywise exponential, and in Python, `numpy.exp(A)` does.
The [matrix exponential](/dictionary/definitions/matrix-exponential) is `expm(A)` in MATLAB and `scipy.linalg.expm(A)` in Python.
