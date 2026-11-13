---
published: false
title: Matrix exponential
term: matrix exponential
applies_to: square matrices
synonyms: ['$e^{A}$', '$\exp(A)$', expm]
levels:
  undergraduate:
    text: |-
      Consider a square [matrix](/dictionary/definitions/matrix) $A$.
      The _matrix exponential_ of $A$ is the matrix defined by the power series

      $$e^{A} = \sum_{k = 0}^{\infty} \frac{A^k}{k!} = I + A + \frac{A^2}{2!} + \frac{A^3}{3!} + \cdots.$$

      The series converges for every square matrix $A$.
properties:
  - >-
    For every square matrix $A$, the solution of $\dot{x} = A x$ with $x(0) = x_0$ is $x(t) = e^{t A} x_0$.
  - >-
    If $A B = B A$, then $e^{A + B} = e^{A} e^{B}$.
    For matrices that do not commute, this equation can fail.
  - >-
    $\det e^{A} = e^{\operatorname{tr} A}$, so $e^{A}$ is [invertible](/dictionary/definitions/invertible-matrix), and its inverse is $e^{-A}$.
  - >-
    If $A = P D P^{-1}$, then $e^{A} = P e^{D} P^{-1}$, and if $D$ is diagonal, then $e^{D}$ is the diagonal matrix whose entries are $e$ raised to the entries of $D$.
---
In MATLAB, the matrix exponential is `expm(A)`, and in Python it is `scipy.linalg.expm(A)`.
The functions `exp(A)` in MATLAB and `numpy.exp(A)` in Python compute the [entrywise exponential](/dictionary/definitions/entrywise-exponential) instead.
