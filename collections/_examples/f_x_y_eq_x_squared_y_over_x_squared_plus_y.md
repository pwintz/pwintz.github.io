---
published: false
title: '$f(x, y) = \frac{x^2 y}{x^2 + y^2}$, with $f(0) = 0$, at the origin'
level: graduate
is: [directional_derivative]
is_not: [
  gateaux_derivative,
  frechet_derivative
]
why:
  directional_derivative: >-
    The function $f(x, y) = \frac{x^2 y}{x^2 + y^2}$ has a directional derivative at the origin in every direction $(h_1, h_2)$, namely $\frac{h_1^2 h_2}{h_1^2 + h_2^2}$.
  gateaux_derivative: >-
    The function $f(x, y) = \frac{x^2 y}{x^2 + y^2}$ is not Gâteaux differentiable at the origin, because its directional derivative is not linear in the direction, and so it is not Fréchet differentiable either.
---
