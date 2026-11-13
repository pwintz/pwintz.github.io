---
published: false
title: Conjugate transpose
term: conjugate transpose
applies_to: matrices
synonyms: [Hermitian transpose, '$A^{\ast}$', '$A^{\mathsf{H}}$', '$A^{\dagger}$']
levels:
  undergraduate:
    text: |-
      Consider an $m \times n$ [matrix](/dictionary/definitions/matrix) $A = [a_{ij}]$ with complex entries.
      The _conjugate transpose_ of $A$ is the $n \times m$ matrix $A^{\ast}$ obtained by [transposing](/dictionary/definitions/transpose) $A$ and replacing each entry by its complex conjugate:

      $$(A^{\ast})_{ij} = \overline{a_{ji}}.$$
properties:
  - >-
    If $A$ has real entries, then $A^{\ast} = A^{\top}$.
  - >-
    $(A B)^{\ast} = B^{\ast} A^{\ast}$, and $(A^{\ast})^{\ast} = A$.
  - >-
    For the standard [inner product](/dictionary/definitions/inner-product) $\ip{x}{y} = \sum_i x_i \overline{y_i}$ on $\mathbb{C}^n$, $\ip{A x}{y} = \ip{x}{A^{\ast} y}$ for all $x$ and $y$, so the [adjoint](/dictionary/definitions/adjoint) of the linear map $x \mapsto A x$ is the linear map $y \mapsto A^{\ast} y$.
  - >-
    A square matrix that is equal to its conjugate transpose is called _Hermitian_ (or _self-adjoint_).
    Every [eigenvalue](/dictionary/definitions/eigenvalue) of a Hermitian matrix is real.
---
The notation varies by field: $A^{\ast}$ is common in mathematics, $A^{\mathsf{H}}$ in engineering, and $A^{\dagger}$ in physics.
Some linear algebra texts call the conjugate transpose $A^{\ast}$ the "adjoint" of the matrix $A$, because, for the standard [inner product](/dictionary/definitions/inner-product), the [adjoint](/dictionary/definitions/adjoint) of the linear map $x \mapsto A x$ is the linear map $y \mapsto A^{\ast} y$.
