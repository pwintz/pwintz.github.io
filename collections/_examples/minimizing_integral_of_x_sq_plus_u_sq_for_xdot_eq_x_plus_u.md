---
published: false
title: 'Minimizing $\int_0^\infty \bigl(x(t)^2 + u(t)^2\bigr) \, \mathrm{d}t$ for the system $\dot{x} = x + u$, with $x(0) = 1$'
level: graduate
is: [
  calculus_of_variations,
  optimal_control
]
why:
  calculus_of_variations: >-
    Minimizing $\int_0^\infty (x^2 + u^2) \, \mathrm{d}t$ for $\dot{x} = x + u$ is also a problem in the calculus of variations, because the input is unconstrained, so substituting $u = \dot{x} - x$ gives the functional $\int_0^\infty \bigl(x^2 + (\dot{x} - x)^2\bigr) \, \mathrm{d}t$ of $x$ alone.
  optimal_control: >-
    Minimizing $\int_0^\infty (x^2 + u^2) \, \mathrm{d}t$ for $\dot{x} = x + u$ is an optimal control problem, a linear-quadratic regulator problem, whose solution is the feedback $u = -(1 + \sqrt{2}) x$.
---
