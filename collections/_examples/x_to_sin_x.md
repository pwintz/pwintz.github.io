---
title: '$x \mapsto \sin x$'
level: high-school
is: [
  differentiable,
  continuously_differentiable,
  smooth,
  analytic
]
is_not: [
  polynomial_function,
  convex_function
]
why:
  convex_function: >-
    The function $\sin$ is not convex, because its second derivative, $-\sin x$, is negative on $(0, \pi)$.
  polynomial_function: >-
    $\sin x$ is not a polynomial function.
    It has infinitely many roots, but a nonzero polynomial has only finitely many.
  analytic: >-
    $\sin$ is analytic because its Taylor series converges to it everywhere.
  continuously_differentiable: >-
    $x \mapsto \sin x$ is smooth, continuously differentiable, and differentiable, because it is analytic.
---
