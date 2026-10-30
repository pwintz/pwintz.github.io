---
published: false
title: Vector vs. coordinate vector
kind: siblings
areas: [linear-algebra]
status: draft
summary: >
  A vector is an element of a vector space. Its coordinate vector is a list of numbers that describes it relative to a chosen basis.
  Changing the basis changes the coordinates, not the vector.
terms:
  - vector
  - coordinate_vector
examples:
  - example: the_polynomial_p_x_eq_3_plus_2x
    why: >-
      It is an element of the vector space of polynomials, not a list of numbers.
  - example: 3_2_relative_to_the_basis_1_x
    why: >-
      $p = 3 \cdot 1 + 2 \cdot x$.
  - example: 3_minus_1_relative_to_the_basis_1_plus_x_x
    why: >-
      $p = 3 (1 + x) - 1 \cdot x$. The same vector has different coordinates in a different basis.
  - example: 3_2_in_reals_squared_relative_to_the_standard
    why: >-
      In $\reals^n$ with the standard basis, a vector is its own coordinate vector, which is why the two are easy to confuse.
see_also:
  - vector_vs_point
  - vector_vs_covector
  - array_vs_matrix_vs_linear_map
---
