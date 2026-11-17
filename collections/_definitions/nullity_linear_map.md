---
published: false
title: Nullity of a Linear Map
term: nullity (of a linear map)
applies_to: linear maps
synonyms: ['$\nullity{T}$']
levels:
  undergraduate:
    context: linear algebra
    text: |-
      Consider a [linear map](/dictionary/definitions/linear-map) $T : V \to W$ between [vector spaces](/dictionary/definitions/vector-space) $V$ and $W$.
      The _nullity_ of $T$ is the [dimension](/dictionary/definitions/dimension-vector-space) of the [kernel](/dictionary/definitions/kernel) of $T$, the set of vectors that $T$ maps to $0$:

      $$\nullity{T} = \dim(\nullspace{T}).$$
properties:
  - >-
    The kernel of $T$ is a subspace of $V$, so $\nullity{T} \leq \dim V$.
  - |-
    If $V$ is finite-dimensional, then the [rank](/dictionary/definitions/rank-linear-map) and the nullity of $T$ add up to the dimension of $V$ (the rank–nullity theorem):

    $$\rank{T} + \nullity{T} = \dim V.$$
  - >-
    The [linear map](/dictionary/definitions/linear-map) $T$ is [injective](/dictionary/definitions/injective) if and only if $\nullity{T} = 0$.
  - >-
    For an $m \times n$ [matrix](/dictionary/definitions/matrix) $A$, the [nullity of $A$](/dictionary/definitions/nullity) is the nullity of the [linear map](/dictionary/definitions/linear-map) $x \mapsto A x$ from $\reals^n$ to $\reals^m$, because the kernel of that map is the [null space](/dictionary/definitions/kernel) of $A$.
  - >-
    If $V$ and $W$ are finite-dimensional, then the nullity of $T$ is the nullity of the [matrix of $T$](/dictionary/definitions/matrix-of-a-linear-map) relative to every pair of bases.
---
