---
# TODO: Make this vector space vs. module vs. algebra.
title: Vector Space vs. Module vs. algebra
kind: siblings
areas: [algebra, linear-algebra]
summary: >
  A module and an algebra each generalize a [vector space](/dictionary/definitions/vector-space), in different directions.
  A [module](/dictionary/definitions/module) allows its scalars to come from a [ring](/dictionary/definitions/ring) instead of a [field](/dictionary/definitions/field), but, like a vector space, a module has no multiplication of two elements.
  An [algebra](/dictionary/definitions/algebra-over-a-field) keeps its scalars in a field but adds a bilinear multiplication of elements.
  Every algebra over a field $F$ is a vector space over $F$, and so every algebra over $F$ is also a module over $F$.
terms:
  - vector_space
  - module
  - algebra_over_a_field
examples:
  - example: R2_with_vector_operations
  - example: Z2_as_a_Z_module
  - example: real_2_by_2_matrices
  - example: continuous_functions_on_0_1
  - example: vector_fields_as_module
see_also:
  - group_vs_ring_vs_field
---
## Notes

- An _algebra over a ring_ $R$ is a [module](/dictionary/definitions/module) over $R$ with a bilinear multiplication, so an algebra over a ring combines both generalizations.
- Many authors require an algebra to be [associative](/dictionary/definitions/associative) and unital; a Lie algebra is an algebra only in the broader sense.
