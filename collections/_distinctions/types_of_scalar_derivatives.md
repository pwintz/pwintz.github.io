---
title: Types of multivariable derivatives
kind: siblings
areas: [analysis]
summary: >
  The directional derivative, the Jacobian, the gradient, the differential, and the Lie derivative all package the [partial derivatives](/dictionary/definitions/partial-derivative) of a function differently: as a vector ([gradient](/dictionary/definitions/gradient)), a matrix ([Jacobian](/dictionary/definitions/jacobian)), a [linear map](/dictionary/definitions/linear-map) (differential), or a single number in a chosen direction ([directional derivative](/dictionary/definitions/directional-derivative)) or along a [vector field](/dictionary/definitions/vector-field) ([Lie derivative](/dictionary/definitions/lie-derivative)).
terms:
  - gradient
  - jacobian
  - directional_derivative
  - differential
  - lie_derivative
examples_note: >-
  Each cell is the ___ of the function in that row.
examples:
  - example: x_squared_plus_3y
    why: >-
      The gradient of $f$ is a vector, its Jacobian is the $1 \times 2$ matrix with the same entries, and its differential is the linear map given by that matrix.
      The directional derivative needs a direction $v$, and the Lie derivative uses a direction $F(x, y)$ that varies from point to point.
see_also:
  - types_of_vector_derivatives
  - vector_vs_covector
  - types_of_differentiability
  - types_of_derivatives
  - frechet_vs_gateaux_derivatives
---
## Notes

- At each point, the [gradient](/dictionary/definitions/gradient) is a vector and the differential is a [covector](/dictionary/definitions/covector).
  The differential needs no extra structure, but the gradient depends on an [inner product](/dictionary/definitions/inner-product): $\nabla f(x)$ is the vector with $\ip{\nabla f(x)}{v} = \mathrm{d}f_x(v)$ for every $v$.
  With the [dot product](/dictionary/definitions/dot-product), they have the same components in the standard [basis](/dictionary/definitions/vector-basis) of $\reals^n$ (or every [orthonormal](/dictionary/definitions/orthonormal) basis), but not in other coordinates.
  In polar coordinates, for example, $\mathrm{d}f$ has components $(\partial_r f, \partial_\theta f)$, while $\nabla f$ has components $(\partial_r f, \frac{1}{r^2} \partial_\theta f)$ in the coordinate basis $(\partial_r, \partial_\theta)$.
  See [vector vs. covector](/dictionary/distinctions/vector-vs-covector).
<!-- - In control theory, the Lie derivative of a Lyapunov function $V$ along $\dot{x} = F(x)$ is often written $\dot{V}(x)$. -->
