---
published: false
title: Directional vs. Fréchet vs. Gâteaux derivative
kind: hierarchy
areas: [analysis]
summary: >
  For a function of several variables (or on an infinite-dimensional space), "[differentiable](/definitions/differentiable)" can be made precise in several ways.
  A [directional derivative](/definitions/directional-derivative) is the rate of change in one direction.
  A function is Gâteaux differentiable if every directional derivative exists and they depend linearly on the direction, and Fréchet differentiable if, in addition, the linear approximation is uniformly good in all directions at once.
relation: >
  Fréchet differentiable ⇒ Gâteaux differentiable ⇒ every directional derivative exists.
  Neither converse holds.
terms:
  - directional_derivative
  - frechet_derivative
  - gateaux_derivative
examples:
  - example: f_x_y_eq_x_squared_plus_y_squared_at_the_origin
  - example: f_x_y_eq_x_cubed_y_over_x_6_plus_y_squared_with_f
  - example: f_x_y_eq_x_squared_y_over_x_squared_plus_y
see_also:
  - types_of_derivatives
  - types_of_scalar_derivatives
  - types_of_differentiability
---
## Notes

- In finite dimensions, the Fréchet derivative is the usual derivative of multivariable calculus.
  The distinction matters most in infinite-dimensional spaces, such as in the calculus of variations, where the [Gâteaux derivative](/definitions/gateaux-derivative) of a [functional](/definitions/functional) is its _first variation_.
- Some authors do not require the Gâteaux derivative to be linear in the direction, which makes it the same as having all [directional derivatives](/definitions/directional-derivative).
