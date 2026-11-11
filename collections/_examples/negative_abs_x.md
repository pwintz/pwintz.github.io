---
title: '$f(x) = -\abs{x}$'
level: high-school
values:
  one_sided_derivative: '$f_{+}^{\prime}(0) = -1$ and $f_{-}^{\prime}(0) = 1$'
  clarke_generalized_gradient: '$\partial f(0) = [-1, 1]$'
  subdifferential: '$\partial f(0) = \emptyset$'
why:
  subdifferential: >-
    The function is concave, so no line through $(0, 0)$ lies below its graph, and it has an empty subgradients at $0$.

  # TODO: Add a longer "why"
  clarke_generalized_gradient: >-
    At $0$, the one-sided derivatives of $-\abs{x}$ are $-1$ and $1$, and its Clarke generalized gradient is $[-1, 1]$.
---
