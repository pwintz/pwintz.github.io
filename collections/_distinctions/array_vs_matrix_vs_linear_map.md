---
published: false
title: Array vs. matrix vs. linear map
kind: siblings
areas: [linear-algebra, computing]
status: draft
summary: >
  An array is a grid of data. A matrix is a grid of numbers with matrix arithmetic.
  A linear map is a function between vector spaces, which a matrix represents only after bases are chosen.
terms:
  - array
  - matrix
  - linear_map
examples:
  - example: a_3_by_3_grid_of_names
    why: >-
      Its entries cannot be added or multiplied.
  - example: a_2_by_3_by_4_block_of_numbers
    why: >-
      It has three axes, so it is not a matrix (it is sometimes called a tensor).
  - example: begin_bmatrix_0_minus_1_1_0_end_bmatrix
    why: >-
      It represents rotation by $90°$ in the standard basis, but it is a grid of numbers, not a function.
  - example: rotation_of_the_plane_by_90
    why: >-
      It is a function. Different bases give different matrices for it.
  - example: differentiation_on_polynomials_of_degree_at_most_2
    why: >-
      In the basis $(1, x, x^2)$, its matrix has rows $(0, 1, 0)$, $(0, 0, 2)$, and $(0, 0, 0)$.
see_also:
  - types_of_array_quantities
  - vector_vs_vector_coordinate
---
## Notes

- A matrix $A$ defines the linear map $x \mapsto A x$ from $\reals^n$ to $\reals^m$, and every linear map between these spaces has this form. This is why matrices and linear maps are easily identified.
- For a linear map $T : V \to V$, changing the basis by an invertible matrix $P$ changes its matrix from $A$ to $P^{-1} A P$. Properties of $T$ (such as eigenvalues, trace, and determinant) are those that all of these matrices share.
