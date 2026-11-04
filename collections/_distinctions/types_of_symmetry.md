---
published: false
title: Types of symmetry
kind: family
areas: [geometry, linear-algebra]
status: draft
summary: >
  "Symmetric" means "unchanged by some swap or transformation" in every sense, but what is swapped differs: points of a shape, $x$ and $-x$, rows and columns, or the two sides of a relation.
terms:
  - geometric_symmetry
  - even_function
  - symmetric_matrix
  - symmetric_relation
examples:
  - example: a_square
    why: >-
      A square has geometric symmetry, with $8$ symmetries: $4$ rotations (by multiples of $90°$) and $4$ reflections.
  - example: x_to_cos_x
    why: >-
      $\cos$ is an even function because $\cos(-x) = \cos x$.
  - example: x_to_x_cubed
    why: >-
      $x \mapsto x^3$ is not an even function, because $(-x)^3 = -x^3$; it is odd.
  - example: begin_bmatrix_1_2_2_3_end_bmatrix
    why: >-
      The matrix is symmetric because it equals its transpose: the $2$s above and below the diagonal match.
  - example: is_a_sibling_of
    why: >-
      "Is a sibling of" is a symmetric relation, because if $a$ is a sibling of $b$, then $b$ is a sibling of $a$.
  - example: leq_on_reals
    why: >-
      $\leq$ is not a symmetric relation, because $1 \leq 2$ but not $2 \leq 1$; it is antisymmetric.
see_also:
  - types_of_unchanging
  - types_of_sameness
---
