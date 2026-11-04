---
published: false
title: 'Jacobian: matrix vs. determinant'
kind: conflicting
areas: [analysis, linear-algebra]
status: draft
summary: >
  "The Jacobian" can mean the matrix of all partial derivatives of a function, or the determinant of that matrix.
  The matrix exists for any differentiable $f : \reals^n \to \reals^m$; the determinant only when $m = n$.
terms:
  - jacobian
  - jacobian_determinant
examples_note: >-
  Each cell is the ___ of the function in that row.
examples:
  - example: scaling_map_2_3
    why: >-
      The Jacobian matrix of $f$ is diagonal, with the stretch factors $2$ and $3$.
      Its determinant, $6$, is the factor by which $f$ multiplies areas.
  - example: swap_coordinates_map
    why: >-
      The Jacobian matrix of $f$ swaps the coordinates.
      Its determinant is $-1$ because $f$ keeps areas the same but reverses orientation.
  - example: polar_coordinates_map
    why: >-
      The Jacobian matrix of $f$ has the partial derivatives of $r \cos \theta$ and $r \sin \theta$ as its rows.
      Its determinant is $r$, which is why $\mathrm{d}x \mathrm{d}y = r \mathrm{d}r \mathrm{d}\theta$ in the change-of-variables formula, where "the Jacobian" means the determinant.
  - example: rotation_field_3d
    why: >-
      The Jacobian matrix of $F$ is not zero.
      Its determinant is $0$ because $F$ has no $z$-component, so the last row of the matrix is zero, and $F$ flattens space onto a plane.
  - example: map_plane_to_space
    why: >-
      The Jacobian matrix of $f$ is $3 \times 2$, because $f$ maps $\reals^2$ to $\reals^3$.
      It has no Jacobian determinant, because only square matrices have determinants.
see_also:
  - types_of_vector_derivatives
  - types_of_scalar_derivatives
---
## Avoiding the ambiguity

Say "Jacobian matrix" or "Jacobian determinant."
Notation helps too: $Df(x)$ or $J_f(x)$ for the matrix, and $\det Df(x)$ for the determinant.
