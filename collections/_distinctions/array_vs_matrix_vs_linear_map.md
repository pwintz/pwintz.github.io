---
title: Array vs. matrix vs. linear map
kind: siblings
areas: [linear-algebra, computing]
summary: >
  Grids of numbers appear throughout linear algebra and computing, but a grid can be just data, a matrix with its own arithmetic, or a way of writing a linear map.
  An array is a grid of data. A matrix is a grid of numbers with matrix arithmetic.
  A [linear map](/dictionary/definitions/linear-map) is a function between vector spaces. A matrix represents a linear map as an array of scalars with respect to a given [vector basis](/dictionary/definitions/vector-basis).
terms:
  - array
  - matrix
  - linear_map
examples:
  - example: a_3_by_3_grid_of_names
  - example: a_2_by_3_by_4_block_of_numbers
  - example: begin_bmatrix_0_minus_1_1_0_end_bmatrix
    why: >-
      The matrix represents rotation by $90°$ in the standard basis, but it is a grid of numbers, not a function.
  - example: rotation_of_the_plane_by_90
    why: >-
      Rotation of the plane by $90°$ is a function, and different bases give different matrices for it.
  - example: differentiation_on_polynomials_of_degree_at_most_2
    why: >-
      In the basis $(1, x, x^2)$, the matrix of differentiation has rows $(0, 1, 0)$, $(0, 0, 2)$, and $(0, 0, 0)$.
see_also:
  - types_of_array_quantities
  - vector_vs_vector_coordinate
---
## Notes

- A matrix $A$ defines the linear map $x \mapsto A x$ from $\reals^n$ to $\reals^m$, and every linear map between these spaces has this form. This is why matrices and [linear maps](/dictionary/definitions/linear-map) are easily identified.
- For a linear map $T : V \to V$, changing the [basis](/dictionary/definitions/vector-basis) by an [invertible](/dictionary/definitions/invertible-matrix) matrix $P$ changes its matrix from $A$ to $P^{-1} A P$. Properties of $T$ (such as [eigenvalues](/dictionary/definitions/eigenvalue), trace, and [determinant](/dictionary/definitions/determinant)) are those that all of these matrices share.
