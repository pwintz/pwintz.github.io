---
published: false
title: "Total derivative: along a path vs. linear map"
kind: conflicting
areas: [analysis]
summary: >
  "Total derivative" has two meanings.
  It can mean the derivative of $f(t, x(t))$ with respect to $t$ along a path, including the change that comes through $x(t)$.
  It can also mean the [linear map](/definitions/linear-map) $Df(x)$ of multivariable calculus, also called the differential.
terms:
  - total_derivative
  - total_derivative_linear_map
examples_note: >-
  Each cell is the total derivative of the function in that row, in the ___ sense.
examples:
  - example: t_x_squared_on_path
  - example: t_x_squared
see_also:
  - types_of_derivatives
  - types_of_scalar_derivatives
---
## How the two meanings are related

The total derivative along a path is the [linear map](/definitions/linear-map) applied to the velocity of the path:

$$\frac{\mathrm{d}}{\mathrm{d}t} f(t, x(t)) = Df(t, x(t))~(1, \dot{x}(t)).$$

## Notes

- Writing $\frac{\mathrm{d}f}{\mathrm{d}t}$ for a function $f(t, x)$ is ambiguous unless it is clear whether $x$ depends on $t$.
  Writing $\frac{\mathrm{d}}{\mathrm{d}t} f(t, x(t))$ removes the ambiguity.
- In fluid mechanics, the total derivative along the motion of a fluid particle is called the _material derivative_.
  In Lyapunov analysis, $\dot{V}$ is the total derivative of $V(x(t))$ along solutions.
