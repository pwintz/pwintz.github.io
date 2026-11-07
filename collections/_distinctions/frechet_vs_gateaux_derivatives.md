---
published: false
title: Directional vs. Fréchet vs. Gâteaux derivative
kind: hierarchy
areas: [analysis]
status: draft
summary: >
  For a function of several variables (or on an infinite-dimensional space), "differentiable" can be made precise in several ways.
  A directional derivative is the rate of change in one direction.
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
    why: >-
      $f(x, y) = x^2 + y^2$ is Fréchet differentiable at the origin, with derivative $0$, because $f(h) = \lVert h \rVert^2$ is small compared with $\lVert h \rVert$.
      So it is also Gâteaux differentiable there, and every directional derivative at the origin is $0$.
  - example: f_x_y_eq_x_cubed_y_over_x_6_plus_y_squared_with_f
    why: >-
      This $f$ has every directional derivative at the origin, and they are all $0$, which is linear in the direction, so $f$ is Gâteaux differentiable there.
      It is not Fréchet differentiable at the origin, because $f = \frac{1}{2}$ along the curve $y = x^3$, so $f$ is not even continuous there.
  - example: f_x_y_eq_x_squared_y_over_x_squared_plus_y
    why: >-
      This $f$ has a directional derivative at the origin in every direction $(h_1, h_2)$, namely $\frac{h_1^2 h_2}{h_1^2 + h_2^2}$.
      It is not Gâteaux differentiable there, because that formula is not linear in the direction, and so it is not Fréchet differentiable either.
see_also:
  - types_of_derivatives
  - types_of_scalar_derivatives
  - types_of_differentiability
---
## Notes

- In finite dimensions, the Fréchet derivative is the usual derivative of multivariable calculus.
  The distinction matters most in infinite-dimensional spaces, such as in the calculus of variations, where the Gâteaux derivative of a functional is its _first variation_.
- Some authors do not require the Gâteaux derivative to be linear in the direction, which makes it the same as having all directional derivatives.
