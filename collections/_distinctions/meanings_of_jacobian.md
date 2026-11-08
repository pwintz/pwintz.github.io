---
published: false
title: 'Jacobian: matrix vs. determinant'
kind: conflicting
areas: [analysis, linear-algebra]
summary: >
  "The [Jacobian](/definitions/jacobian)" can mean the matrix of all [partial derivatives](/definitions/partial-derivative) of a function, or the [determinant](/definitions/determinant) of that matrix.
  The matrix exists for every [differentiable](/definitions/differentiable) $f : \reals^n \to \reals^m$; the determinant only when $m = n$.
terms:
  - jacobian
  - jacobian_determinant
examples_note: >-
  Each cell is the ___ of the function in that row.
examples:
  - example: scaling_map_2_3
  - example: swap_coordinates_map
  - example: polar_coordinates_map
  - example: rotation_field_3d
  - example: map_plane_to_space
see_also:
  - types_of_vector_derivatives
  - types_of_scalar_derivatives
---
## Avoiding the ambiguity

Say "[Jacobian](/definitions/jacobian) matrix" or "[Jacobian determinant](/definitions/jacobian-determinant)."
Notation helps too: $Df(x)$ or $J_f(x)$ for the matrix, and $\det Df(x)$ for the [determinant](/definitions/determinant).
