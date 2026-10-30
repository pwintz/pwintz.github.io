---
published: false
title: '$f(x) = \lvert x \rvert$'
level: high-school
is: [idempotent]
is_not: [differentiable, continuously_differentiable, smooth, analytic, constant_function]
values:
  one_sided_derivative: '$1$ (from the right) and $-1$ (from the left), at $x = 0$'
  dini_derivative: '$1$ (both right Dini derivatives) and $-1$ (both left), at $x = 0$'
  clarke_generalized_gradient: '$[-1, 1]$, at $x = 0$'
  subdifferential: '$[-1, 1]$, at $x = 0$'
  weak_derivative: '$\operatorname{sign}(x)$'
why:
  dini_derivative: >-
    When a one-sided derivative exists, the corresponding Dini derivatives equal it.
  clarke_generalized_gradient: >-
    The convex hull of the nearby derivatives $\pm 1$.
  subdifferential: >-
    Since $\lvert x \rvert$ is convex, its subdifferential equals its Clarke generalized gradient.
  weak_derivative: >-
    It satisfies the integration-by-parts formula, and its value at the single point $0$ does not matter.
---
