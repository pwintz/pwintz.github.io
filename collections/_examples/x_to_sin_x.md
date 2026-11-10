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
  differentiable: >-
    $x \mapsto \sin x$ is differentiable at every $x$, with derivative $\cos x$.
  continuously_differentiable: >-
    $x \mapsto \sin x$ is continuously differentiable, because its derivative $\cos x$ is continuous.
  smooth: >-
    $x \mapsto \sin x$ is smooth, because its derivatives $\cos x$, $-\sin x$, $-\cos x$, $\sin x$, … repeat and all exist.
---
