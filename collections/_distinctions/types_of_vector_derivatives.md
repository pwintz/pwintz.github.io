---
published: false
title: Types of derivatives in vector calculus
kind: siblings
areas: [analysis]
status: draft
summary: >
  The Jacobian of a vector field contains all of its first partial derivatives. The divergence (a scalar) and curl (a vector) summarize parts of it.
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
      A rotation does not spread out, so its divergence (the trace of its Jacobian) is $0$. Its curl points along the rotation axis.
  - example: paraboloid_xyz
    why: >-
      The Laplacian is the sum of the second partial derivatives. Divergence and curl apply to vector fields, not to scalar functions such as $f$.
see_also:
  - types_of_scalar_derivatives
---
## Notes

- The divergence is the trace of the Jacobian, and the curl comes from its antisymmetric part.
- The divergence of a vector field is unrelated to a divergent sequence.
