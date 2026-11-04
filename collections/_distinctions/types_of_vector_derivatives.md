---
published: false
title: Types of derivatives in vector calculus
kind: siblings
areas: [analysis]
status: draft
summary: >
  The Jacobian of a vector field contains all of its first partial derivatives.
  The divergence (a scalar) and curl (a vector) summarize parts of it.
  The Laplacian is a second-order operator on scalar functions.
terms:
  - jacobian
  - divergence
  - curl
  - laplacian
examples_note: >-
  Each cell is the ___ of the vector field or function in that row.
examples:
  - example: rotation_field_3d
    why: >-
      The divergence of $F$ is the trace of its Jacobian, $0$, because a rotation does not spread out.
      The curl of $F$ is $(0, 0, 2)$, which points along the rotation axis.
  - example: paraboloid_xyz
    why: >-
      The Laplacian of $f$ is the sum of its second partial derivatives, $2 + 2 + 0 = 4$, and its Jacobian is the row of its first partial derivatives.
      $f$ has no divergence or curl, because those apply to vector fields, not to scalar functions such as $f$.
see_also:
  - types_of_scalar_derivatives
---
## Notes

- The divergence is the trace of the Jacobian, and the curl comes from its antisymmetric part.
- The divergence of a vector field is unrelated to a divergent sequence.
