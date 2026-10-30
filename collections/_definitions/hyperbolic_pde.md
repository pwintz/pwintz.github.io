---
published: false
title: Hyperbolic PDE
term: hyperbolic
applies_to: second-order PDEs
levels:
  undergraduate:
    context: two variables
    text: |-
      The equation

      $$A u_{xx} + 2B u_{xy} + C u_{yy} + (\text{lower-order terms}) = 0$$

      is _hyperbolic_ where $B^2 - AC > 0$. The wave equation $u_{tt} = u_{xx}$ is the model example.
  graduate:
    context: $n$ variables
    text: |-
      The equation

      $$\sum_{i,j} a_{ij} \partial_i \partial_j u + (\text{lower-order terms}) = 0$$

      is _hyperbolic_ where the [coefficient](/definitions/coefficient) [matrix](/definitions/matrix) $(a_{ij})$ has no zero [eigenvalues](/definitions/eigenvalue), one eigenvalue of one sign, and all others of the opposite sign.
properties:
  - >-
    Hyperbolic equations typically describe waves. Disturbances travel at finite speed and are not smoothed out.
---
