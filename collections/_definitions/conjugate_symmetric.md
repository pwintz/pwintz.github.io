---
published: false
title: Conjugate Symmetric Function
term: conjugate symmetric
applies_to: complex-valued functions of two arguments
synonyms: [conjugate symmetry, Hermitian symmetric, Hermitian symmetry]
levels:
  undergraduate:
    text: |-
      Consider a set $X$ and a function $f : X \times X \to \complexes$.
      The function $f$ is _conjugate symmetric_ if swapping the two arguments replaces the value of $f$ by its [complex conjugate](/dictionary/definitions/complex-conjugate):

      $$f(x, y) = \conj{f(y, x)} \quad \text{for all } x, y \in X.$$
properties:
  - |-
    A conjugate symmetric function $f$ has a real value $f(x, x)$ at every pair of equal arguments, because $f(x, x) = \conj{f(x, x)}$.
  - |-
    A real-valued function is conjugate symmetric if and only if the function is [symmetric](/dictionary/definitions/symmetric-operation), because the [complex conjugate](/dictionary/definitions/complex-conjugate) of a [real number](/dictionary/definitions/real-number) is the number itself.
  - |-
    A sesquilinear form $B(x, y) = y^{\ast} A x$ on $\complexes^n$ is conjugate symmetric if and only if $A$ is equal to its [conjugate transpose](/dictionary/definitions/conjugate-transpose).
---
An [inner product](/dictionary/definitions/inner-product) on a complex [vector space](/dictionary/definitions/vector-space) is conjugate symmetric, $\ip{x}{y} = \conj{\ip{y}{x}}$, instead of [symmetric](/dictionary/definitions/symmetric-operation).
Conjugate symmetry and linearity in the first argument together make the inner product conjugate-linear in the second argument.
