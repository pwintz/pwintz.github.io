---
published: false
title: Elliptic PDE
term: elliptic
applies_to: second-order PDEs
levels:
  undergraduate:
    context: two variables
    text: |-
      Consider a second-order partial differential equation in two variables,

      $$A u_{xx} + 2B u_{xy} + C u_{yy} + (\text{lower-order terms}) = 0.$$

      The equation is _elliptic_ where $B^2 - AC < 0$.
      The Laplace equation $u_{xx} + u_{yy} = 0$ is the model example.
  graduate:
    context: $n$ variables
    text: |-
      Consider a second-order partial differential equation in $n$ variables,

      $$\sum_{i,j} a_{ij} \partial_i \partial_j u + (\text{lower-order terms}) = 0,$$

      with $a_{ij}$ symmetric.
      The equation is _elliptic_ where all [eigenvalues](/dictionary/definitions/eigenvalue) of $(a_{ij})$ are nonzero and have the same sign.
properties:
  - >-
    Elliptic equations typically describe [steady states](/dictionary/definitions/steady-state), such as [equilibrium](/dictionary/definitions/equilibrium) temperatures or electrostatic potentials.
  - >-
    Elliptic equations are posed with [boundary](/dictionary/definitions/boundary) conditions, not initial conditions.
---
