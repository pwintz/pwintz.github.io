---
published: false
title: Orthogonal matrix
term: orthogonal matrix
applies_to: square matrices
levels:
  undergraduate:
    text: |-
      Consider a real $n \times n$ [matrix](/dictionary/definitions/matrix) $Q$.
      The matrix $Q$ is _orthogonal_ if its [transpose](/dictionary/definitions/transpose) is its inverse:

      $$Q^{\top} Q = Q Q^{\top} = I.$$
properties:
  - >-
    A matrix is orthogonal if and only if its columns are [unit vectors](/dictionary/definitions/unit-vector) that are perpendicular to each other (an [orthonormal](/dictionary/definitions/orthonormal) [basis](/dictionary/definitions/vector-basis)).
  - >-
    Orthogonal matrices preserve lengths and angles: $\norm{Q x} = \norm{x}$.
    They are the rotations and reflections, and $\det Q = \pm 1$.
---
The name is a historical accident: the columns of an orthogonal matrix are [orthonormal](/dictionary/definitions/orthonormal), not just orthogonal.
