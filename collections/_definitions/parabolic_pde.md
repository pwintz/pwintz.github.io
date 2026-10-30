---
published: false
title: Parabolic PDE
term: parabolic
applies_to: second-order PDEs
levels:
  undergraduate:
    context: two variables
    text: |-
      The equation

      $$A u_{xx} + 2B u_{xy} + C u_{yy} + (\text{lower-order terms}) = 0$$

      is _parabolic_ where $B^2 - AC = 0$. The heat equation $u_t = u_{xx}$ is the model example.
  graduate:
    context: $n$ variables
    text: |-
      The equation

      $$\sum_{i,j} a_{ij} \partial_i \partial_j u + (\text{lower-order terms}) = 0$$

      is _parabolic_ where the [coefficient](/definitions/coefficient) [matrix](/definitions/matrix) $(a_{ij})$ has one zero [eigenvalue](/definitions/eigenvalue) and all of its other eigenvalues have the same sign (with a first-order term in the direction of the zero eigenvalue, such as $u_t$).
properties:
  - >-
    Parabolic equations typically describe diffusion. Disturbances spread instantly but are smoothed out over time.
---
