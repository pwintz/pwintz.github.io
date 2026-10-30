---
published: false
title: Directional vs. Fréchet vs. Gâteaux derivative
kind: hierarchy
areas: [analysis]
status: draft
summary: >
  A directional derivative is the rate of change in one direction. A function is Gâteaux differentiable if every directional derivative exists and they depend linearly on the direction,
  and Fréchet differentiable if, in addition, the linear approximation is uniformly good in all directions at once.
relation: >
  Fréchet differentiable ⇒ Gâteaux differentiable ⇒ every directional derivative exists. Neither converse holds.
terms:
  - directional_derivative
  - frechet_derivative
  - gateaux_derivative
examples:
  - example: f_x_y_eq_x_squared_plus_y_squared_at_the_origin
    why: >-
      It is smooth, with derivative $0$ at the origin.
  - example: f_x_y_eq_x_cubed_y_over_x_6_plus_y_squared_with_f
    why: >-
      Every directional derivative at the origin is $0$, which is linear in the direction. But $f = \frac{1}{2}$ along the curve $y = x^3$, so $f$ is not even continuous at the origin.
  - example: f_x_y_eq_x_squared_y_over_x_squared_plus_y
    why: >-
      In the direction $(h_1, h_2)$, the directional derivative is $\frac{h_1^2 h_2}{h_1^2 + h_2^2}$, which is not linear in the direction.
see_also:
  - types_of_derivatives
  - types_of_scalar_derivatives
  - types_of_differentiability
---
## Notes

- In finite dimensions, the Fréchet derivative is the usual derivative of multivariable calculus. The distinction matters most in infinite-dimensional spaces, such as in the calculus of variations, where the Gâteaux derivative of a functional is its _first variation_.
- Some authors do not require the Gâteaux derivative to be linear in the direction, which makes it the same as having all directional derivatives.
