---
published: false
title: Rank of a Linear Map
term: rank (of a linear map)
applies_to: linear maps
synonyms: ['$\rank{T}$']
levels:
  undergraduate:
    context: linear algebra
    text: |-
      Consider a [linear map](/dictionary/definitions/linear-map) $T : V \to W$ between [vector spaces](/dictionary/definitions/vector-space) $V$ and $W$.
      The _rank_ of $T$ is the [dimension](/dictionary/definitions/dimension-vector-space) of the [range](/dictionary/definitions/range-image) of $T$, the set of all outputs $T v$:

      $$\rank{T} = \dim(\range{T}).$$
properties:
  - >-
    The range of $T$ is a subspace of $W$, so $\rank{T} \leq \dim W$.
    Also, $\rank{T} \leq \dim V$, because $T$ maps each [basis](/dictionary/definitions/vector-basis) of $V$ to a set that spans the range of $T$.
  - |-
    If $V$ is finite-dimensional, then the rank and the [nullity](/dictionary/definitions/nullity-linear-map) of $T$ add up to the dimension of $V$ (the rank–nullity theorem):

    $$\rank{T} + \nullity{T} = \dim V.$$

    Each dimension of $V$ either survives in the range or is collapsed into the [kernel](/dictionary/definitions/kernel).
  - >-
    For an $m \times n$ [matrix](/dictionary/definitions/matrix) $A$, the [rank of $A$](/dictionary/definitions/matrix-rank) is the rank of the [linear map](/dictionary/definitions/linear-map) $x \mapsto A x$ from $\reals^n$ to $\reals^m$, because the range of that map is the [column space](/dictionary/definitions/column-space) of $A$.
  - >-
    If $V$ and $W$ are finite-dimensional, then the rank of $T$ is the rank of the [matrix of $T$](/dictionary/definitions/matrix-of-a-linear-map) relative to every pair of bases.
    Thus, all matrices of $T$ have the same rank, even though the matrices differ.
  - >-
    If $W$ is finite-dimensional, then $T$ is [surjective](/dictionary/definitions/surjective) if and only if $\rank{T} = \dim W$.
  - >-
    If $V$ is infinite-dimensional, then the rank of $T$ can be infinite.
    A [linear map](/dictionary/definitions/linear-map) with finite rank is called a _finite-rank operator_.
---
