---
title: Basis of a Vector Space
term: basis (of a vector space)
applies_to: vector spaces
synonyms: [vector basis, Hamel basis]
levels:
  high-school:
    text: |-
      Consider a space of [vectors](/dictionary/definitions/vector), such as the plane, in which vectors can be added and stretched.
      A _basis_ of the space is a set of vectors from which every vector in the space can be built in exactly one way, by stretching each of them and adding the results.
  undergraduate:
    text: |-
      Consider a [vector](/dictionary/definitions/vector) space $V$.
      A _basis_ of $V$ is a set of vectors in $V$ that is [linearly independent](/dictionary/definitions/linearly-independent) and spans $V$.
properties:
  - |-
    Every vector $\vect{v}$ in $V$ can be written in exactly one way as a [linear combination](/dictionary/definitions/linear-combination) $\vect{v} = c_1 \vect{b}_1 + \dots + c_n \vect{b}_n$ of the basis vectors.
    The numbers $c_1, \dots, c_n$ form the [coordinate vector](/dictionary/definitions/coordinate-vector) of $\vect{v}$.
  - |-
    Every vector space has a basis (assuming the axiom of choice), and all bases of the same space have the same number of vectors: its [dimension](/dictionary/definitions/dimension-vector-space).
  - |-
    A vector space has many bases.
    The [matrix](/dictionary/definitions/matrix) that represents a [linear map](/dictionary/definitions/linear-map) depends on which bases are chosen.
---
In infinite-dimensional spaces, such as spaces of functions, a basis in this sense (a _Hamel basis_) allows only finite [linear combinations](/dictionary/definitions/linear-combination).
A _Schauder basis_ also allows infinite sums, which requires a notion of convergence.
