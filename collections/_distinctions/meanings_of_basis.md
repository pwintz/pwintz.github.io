---
title: "Basis: Vector Space vs. Topology"
kind: conflicting
areas: [linear-algebra, topology]
summary: >
  In linear algebra and in [topology](/dictionary/definitions/topology), a basis is a collection of building blocks from which every object of interest can be built.
  A [basis of a vector space](/dictionary/definitions/vector-basis) is a set of vectors from which every vector is built as a unique [linear combination](/dictionary/definitions/linear-combination).
  A [basis for a topology](/dictionary/definitions/topological-basis) is a collection of [open sets](/dictionary/definitions/open-set) from which every open set is built as a [union](/dictionary/definitions/set-union) (not necessarily unique).
  A basis of a [vector space](/dictionary/definitions/vector-space) has no redundant vectors, but a basis for a topology can contain sets that are unions of other sets in the basis.
terms:
  - vector_basis
  - topological_basis
examples:
  - example: standard_basis_r2
  - example: all_vectors_in_r2
  - example: open_intervals_in_reals_for_the_standard_topology
  - example: all_open_sets_of_reals_for_the_standard_topology
    why: >-
      The collection of all open sets of $\reals$ is a basis for the standard topology, even though most of its sets are unions of other sets in the collection.
      In contrast, the set of all vectors in $\reals^2$ is not a basis of $\reals^2$, because a basis of a vector space cannot contain a vector that is a linear combination of the others.
  - example: closed_intervals_in_reals_for_the_standard_topology
see_also:
  - basis_vs_coordinate_system
---
## Notes

- Both meanings require that every object be built from the basis, but only the vector-space meaning requires that each object be built in exactly one way.
  Removing a vector from a basis of a [vector space](/dictionary/definitions/vector-space) produces a set that does not span the space, but removing a set from a basis for a [topology](/dictionary/definitions/topology) can produce another basis.
