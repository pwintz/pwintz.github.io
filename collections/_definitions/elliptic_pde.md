---
published: false
title: Elliptic PDE
term: elliptic
applies_to: second-order PDEs
levels:
  undergraduate:
    context: two variables
    text: |-
      The equation

      $$A u_{xx} + 2B u_{xy} + C u_{yy} + (\text{lower-order terms}) = 0$$

      is _elliptic_ where $B^2 - AC < 0$. The Laplace equation $u_{xx} + u_{yy} = 0$ is the model example.
  graduate:
    context: $n$ variables
    text: |-
      The equation

      $$\sum_{i,j} a_{ij} \partial_i \partial_j u + (\text{lower-order terms}) = 0,$$

      with $a_{ij}$ symmetric, is _elliptic_ where all [eigenvalues](/definitions/eigenvalue) of $(a_{ij})$ are nonzero and have the same sign.
properties:
  - >-
    Elliptic equations typically describe [steady states](/definitions/steady-state), such as [equilibrium](/definitions/equilibrium) temperatures or electrostatic potentials.
  - >-
    Elliptic equations are posed with [boundary](/definitions/boundary) conditions, not initial conditions.
---
