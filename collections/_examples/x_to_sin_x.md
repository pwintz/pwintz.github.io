---
title: '$x \mapsto \sin x$'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-7, 7]
    y: [-1.5, 1.5]
    curves:
      - {"f": "sin x"}
  caption: |-
    The graph of $x \mapsto \sin x$.
  alt: "A wave between -1 and 1 that passes through the origin."
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
values:
  taylor_series: '$x - x^3/3! + x^5/5! - x^7/7! + \dots$ at $0$'
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
  taylor_series: >-
    The derivatives of $\sin x$ at $0$ repeat $0, 1, 0, -1$, so the Taylor series of $\sin x$ at $0$ has only odd powers, with alternating signs.
---
