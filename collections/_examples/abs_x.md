---
title: '$f(x) = \lvert x \rvert$'
level: high-school
is: [idempotent]
is_not: [differentiable, continuously_differentiable, smooth, analytic, constant_function]
values:
  one_sided_derivative: '$f_{+}^{\prime}(0) = 1$ and $f_{-}^{\prime}(0) = -1$'
  # dini_derivative: '$D^{+} f(0) = D_{+} f(0) = 1$ and $D^{-} f(0) = D_{-} f(0) = -1$'
  # TODO: Check dini_derivative
  clarke_generalized_gradient: '$\partial f(0) = [-1, 1]$'
  subdifferential: '$\partial f(0) = [-1, 1]$'
  weak_derivative: '$f^{\prime}(x) = \operatorname{sign}(x)$'
why:
  # dini_derivative: >-
  #   The Dini derivatives of $\lvert x \rvert$ at $0$ equal its one-sided derivatives there, because Dini derivatives equal a one-sided derivative whenever it exists.
  clarke_generalized_gradient: >-
    The Clarke generalized gradient of $\lvert x \rvert$ at $0$ is $[-1, 1]$, the convex hull of the nearby derivatives $\pm 1$.
  subdifferential: >-
    The subdifferential of $\lvert x \rvert$ at $0$ equals its Clarke generalized gradient, because $\lvert x \rvert$ is convex.
  weak_derivative: >-
    The weak derivative of $\lvert x \rvert$ is $\operatorname{sign}(x)$, because $\operatorname{sign}(x)$ satisfies the integration-by-parts formula for $\lvert x \rvert$.
    The value of $\operatorname{sign}(x)$ at the single point $0$ does not matter.
---
