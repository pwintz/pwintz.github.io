---
published: false
title: '$f(x) = \lvert x \rvert$'
level: high-school
is: [idempotent]
is_not: [differentiable, continuously_differentiable, smooth, analytic, constant_function]
values:
  one_sided_derivative: '$f_{+}^{\prime}(0) = 1$ and $f_{-}^{\prime}(0) = -1$'
  dini_derivative: '$D^{+} f(0) = D_{+} f(0) = 1$ and $D^{-} f(0) = D_{-} f(0) = -1$'
  clarke_generalized_gradient: '$\partial f(0) = [-1, 1]$'
  subdifferential: '$\partial f(0) = [-1, 1]$'
  weak_derivative: '$f^{\prime}(x) = \operatorname{sign}(x)$'
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
