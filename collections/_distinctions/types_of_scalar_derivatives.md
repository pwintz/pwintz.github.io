---
published: false
title: Types of multivariable derivatives
kind: siblings
areas: [analysis]
status: draft
summary: >
  All of these package the partial derivatives of a function differently: as a vector (gradient), a matrix (Jacobian), a linear map (differential),
  or a single number in a chosen direction (directional derivative) or along a vector field (Lie derivative).
terms:
  - directional_derivative
  - jacobian
  - gradient
  - differential
  - lie_derivative
examples_note: >-
  Each cell is the ___ of the function in that row.
examples:
  - example: x_squared_plus_3y
    why: >-
      The gradient is a vector, the Jacobian is a $1 \times 2$ matrix (its transpose), and the differential is a linear map. The directional derivative needs a direction, and the Lie derivative uses a direction that varies from point to point.
see_also:
  - types_of_vector_derivatives
  - vector_vs_covector
  - types_of_differentiability
  - types_of_derivatives
  - frechet_vs_gateaux_derivatives
---
## Notes

- The gradient is a vector and the differential is a covector. They have the same components in the standard basis of $\reals^n$, but they transform differently under changes of coordinates. See [vector vs. covector](/distinctions/vector-vs-covector).
- In control theory, the Lie derivative of a Lyapunov function $V$ along $\dot{x} = F(x)$ is often written $\dot{V}(x)$.
