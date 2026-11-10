---
published: false
title: 'Finding the shortest curve $y(x)$ in the plane from $(0, 0)$ to $(1, 1)$'
level: undergraduate
detail: >-
  Minimize the length $\int_0^1 \sqrt{1 + y^{\prime}(x)^2} \, \mathrm{d}x$ subject to $y(0) = 0$ and $y(1) = 1$.
is: [
  calculus_of_variations,
  optimal_control
]
why:
  calculus_of_variations: >-
    Finding the shortest curve from $(0, 0)$ to $(1, 1)$ is a problem in the calculus of variations, because the unknown is a function $y$ with fixed end values, and the length is the integral of $L(y^{\prime}) = \sqrt{1 + (y^{\prime})^2}$.
    The Euler–Lagrange equation gives $y^{\prime\prime} = 0$, so the shortest curve is the straight line $y = x$.
  optimal_control: >-
    Finding the shortest curve from $(0, 0)$ to $(1, 1)$ is an optimal control problem with the state $y$, the input $u = y^{\prime}$, the dynamics $\dot{y} = u$, and the cost $\int_0^1 \sqrt{1 + u^2} \, \mathrm{d}x$.
---
