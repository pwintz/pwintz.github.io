---
title: Vector vs. coordinate vector
kind: siblings
areas: [linear-algebra]
summary: >
  Vectors in a vector space are often described by lists of numbers, which depend on a choice of basis.
  A vector is an element of a vector space.
  Its [coordinate vector](/definitions/coordinate-vector) is a list of numbers (coordinates) that describes it relative to a chosen [basis](/definitions/vector-basis).
  Changing the basis changes the coordinates, not the vector.
terms:
  - vector
  - coordinate_vector
examples:
  - example: the_polynomial_p_x_eq_3_plus_2x
  - example: 3_2_relative_to_the_basis_1_x
  - example: 3_minus_1_relative_to_the_basis_1_plus_x_x
    why: >-
      The same vector $3 + 2x$ has different coordinates in a different basis.
  - example: 3_2_in_R2_relative_to_the_standard
    why: >-
      In $\reals^n$ with the standard basis, a vector is its own coordinate vector, which is why vectors and coordinate vectors are easy to confuse.
see_also:
  - vector_vs_point
  - vector_vs_covector
  - array_vs_matrix_vs_linear_map
---
