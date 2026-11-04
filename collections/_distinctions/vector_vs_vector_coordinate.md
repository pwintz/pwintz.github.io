---
title: Vector vs. coordinate vector
kind: siblings
areas: [linear-algebra]
status: draft
summary: >
  A vector is an element of a vector space.
  Its coordinate vector is a list of numbers (coordinates) that describes it relative to a chosen basis.
  Changing the basis changes the coordinates, not the vector.
terms:
  - vector
  - coordinate_vector
examples:
  - example: the_polynomial_p_x_eq_3_plus_2x
    why: >-
      $3 + 2x$ is a vector in the vector space of polynomials.
      It is not a coordinate vector, because it is not a list of numbers.
  - example: 3_2_relative_to_the_basis_1_x
    why: >-
      $(3, 2)$ is the coordinate vector of $p = 3 + 2x$ relative to the basis $(1, x)$, because $p = 3 \cdot 1 + 2 \cdot x$.
  - example: 3_minus_1_relative_to_the_basis_1_plus_x_x
    why: >-
      $(3, -1)$ is the coordinate vector of $p = 3 + 2x$ relative to the basis $(1 + x, x)$, because $p = 3 (1 + x) - 1 \cdot x$.
      The same vector has different coordinates in a different basis.
  - example: 3_2_in_reals_squared_relative_to_the_standard
    why: >-
      $(3, 2)$ is a vector in $\reals^2$, and it is its own coordinate vector relative to the standard basis, because $(3, 2) = 3 (1, 0) + 2 (0, 1)$.
      This is why vectors and coordinate vectors are easy to confuse in $\reals^n$.
see_also:
  - vector_vs_point
  - vector_vs_covector
  - array_vs_matrix_vs_linear_map
---
