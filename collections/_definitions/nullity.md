---
published: false
title: Nullity
term: nullity
applies_to: matrices and linear maps
synonyms: ['$\operatorname{nullity} A$']
levels:
  high-school:
    text: |-
      Consider a [matrix](/dictionary/definitions/matrix) $A$ and its reduced row echelon form.
      The _nullity_ of $A$ is the number of columns of the reduced row echelon form that have no [leading entry](/dictionary/definitions/leading-entry).
  undergraduate:
    text: |-
      Consider a [linear map](/dictionary/definitions/linear-map) $T$ (or a matrix).
      The _nullity_ of $T$ is the dimension of its [kernel](/dictionary/definitions/kernel):

      $$\operatorname{nullity} T = \dim \ker T.$$
properties:
  - >-
    For an $m \times n$ matrix $A$, $\operatorname{rank} A + \operatorname{nullity} A = n$ (the rank–nullity theorem).
  - >-
    The nullity of a matrix $A$ is the number of free variables in the solutions of $A x = 0$.
  - >-
    The nullity of a matrix $A$ is $0$ if and only if the columns of $A$ are [linearly independent](/dictionary/definitions/linearly-independent), if and only if the map $x \mapsto A x$ is [injective](/dictionary/definitions/injective).
---
