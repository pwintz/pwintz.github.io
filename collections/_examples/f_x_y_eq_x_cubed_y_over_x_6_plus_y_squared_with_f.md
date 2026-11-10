---
published: false
title: '$f(x, y) = \frac{x^3 y}{x^6 + y^2}$, with $f(0) = 0$, at the origin'
level: graduate
is: [
  gateaux_derivative,
  directional_derivative
]
is_not: [frechet_derivative]
why:
  gateaux_derivative: >-
    The function $f(x, y) = \frac{x^3 y}{x^6 + y^2}$ has every directional derivative at the origin, all equal to $0$, which is linear in the direction, so $f$ is Gâteaux differentiable there.
  frechet_derivative: >-
    The function $f(x, y) = \frac{x^3 y}{x^6 + y^2}$ is not Fréchet differentiable at the origin, because $f = \frac{1}{2}$ along the curve $y = x^3$, so $f$ is not even continuous there.
---
