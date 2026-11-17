---
published: false
title: Nullity of a Matrix
term: nullity (of a matrix)
applies_to: matrices
synonyms: ['$\nullity{A}$']
levels:
  high-school:
    text: |-
      Consider a [matrix](/dictionary/definitions/matrix) $A$ and its reduced row echelon form.
      The _nullity_ of $A$ is the number of columns of the reduced row echelon form that have no [leading entry](/dictionary/definitions/leading-entry).
  undergraduate:
    text: |-
      Consider an $m \times n$ [matrix](/dictionary/definitions/matrix) $A$ and its [null space](/dictionary/definitions/kernel), the set of vectors $x \in \reals^n$ such that $A x = 0$.
      The _nullity_ of $A$ is the [dimension](/dictionary/definitions/dimension-vector-space) of the null space of $A$:

      $$\nullity{A} = \dim(\nullspace{A}).$$
properties:
  - >-
    The nullity of $A$ is the [nullity](/dictionary/definitions/nullity-linear-map) of the [linear map](/dictionary/definitions/linear-map) $x \mapsto A x$, because the [null space](/dictionary/definitions/kernel) of $A$ is the kernel of that map.
  - >-
    For an $m \times n$ matrix $A$, $\rank{A} + \nullity{A} = n$ (the rank–nullity theorem).
  - >-
    The nullity of a matrix $A$ is the number of free variables in the solutions of $A x = 0$.
  - >-
    The nullity of a matrix $A$ is $0$ if and only if the columns of $A$ are [linearly independent](/dictionary/definitions/linearly-independent), if and only if the map $x \mapsto A x$ is [injective](/dictionary/definitions/injective).
---
