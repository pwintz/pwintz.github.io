---
title: Right angle vs. perpendicular vs. orthogonal vs. normal
kind: siblings
areas: [geometry, linear-algebra]
summary: >
  Right angles, perpendicular lines, orthogonal vectors, and normal vectors all describe things that meet "squarely."
  A [right angle](/dictionary/definitions/right-angle) is an angle of $90^\circ$, so the term describes an angle.
  [Perpendicular](/dictionary/definitions/perpendicular) describes lines or planes that intersect and form right angles.
  [Orthogonal](/dictionary/definitions/orthogonal-vectors) describes vectors whose [inner product](/dictionary/definitions/inner-product) is $0$, which extends the idea to vectors that do not meet, such as directions of skew lines, to the [zero vector](/dictionary/definitions/zero-vector), and to vectors that are not arrows, such as functions.
  A [normal vector](/dictionary/definitions/normal-vector) is perpendicular to a line, curve, or surface at a point, so the term describes a vector relative to a shape.
terms:
  - right_angle
  - perpendicular
  - orthogonal_vectors
  - normal_vector
examples:
  - example: corner_of_a_rectangle
  - example: lines_y_eq_x_and_y_eq_minus_x
  - example: skew_lines_x_axis_and_shifted_y_axis
    why: >-
      The $x$-axis and the line through $(0, 0, 1)$ parallel to the $y$-axis show that orthogonal lines need not intersect, so orthogonal lines need not be perpendicular.
  - example: vector_1_1_and_line_x_plus_y_eq_1
    why: >-
      The vector $(1, 1)$ and the line $x + y = 1$ show that a normal vector is described relative to a shape: the vector is normal to the line and orthogonal to its direction vector.
  - example: vector_and_zero_vector_r2
    why: >-
      The vectors $(1, 0)$ and $(0, 0)$ show that orthogonality is defined by the inner product alone, so the zero vector is orthogonal to every vector even though the zero vector forms no angle.
  - example: sin_and_cos_on_minus_pi_pi
    why: >-
      The functions $\sin$ and $\cos$ show that orthogonality applies to vectors that are not arrows in space, where "perpendicular" and "right angle" have no geometric meaning.
see_also:
  - linearly_independent_vs_orthogonal
---
## Notes

- In an [inner product space](/dictionary/definitions/inner-product-space), the angle $\theta$ between nonzero vectors $u$ and $v$ is defined by $\cos \theta = \ip{u}{v} / (\norm{u} \norm{v})$, so nonzero [orthogonal vectors](/dictionary/definitions/orthogonal-vectors) form a [right angle](/dictionary/definitions/right-angle) in this generalized sense.
- Some authors use "[perpendicular](/dictionary/definitions/perpendicular)" and "orthogonal" as synonyms for nonzero vectors.
