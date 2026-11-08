---
title: '$f(x) = \abs{x}$'
level: high-school
is: [idempotent, convex_function]
is_not: [differentiable, continuously_differentiable, smooth, analytic, constant_function]
values:
  one_sided_derivative: '$f_{+}^{\prime}(0) = 1$ and $f_{-}^{\prime}(0) = -1$'
  # dini_derivative: '$D^{+} f(0) = D_{+} f(0) = 1$ and $D^{-} f(0) = D_{-} f(0) = -1$'
  # TODO: Check dini_derivative
  clarke_generalized_gradient: '$\partial f(0) = [-1, 1]$'
  subdifferential: '$\partial f(0) = [-1, 1]$'
  weak_derivative: '$f^{\prime}(x) = \operatorname{sign}(x)$'
why:
  convex_function: >-
    The function $x \mapsto \abs{x}$ is convex, because the segment between two points on its V-shaped graph lies on or above the graph.
  # dini_derivative: >-
  #   The Dini derivatives of $\abs{x}$ at $0$ equal its one-sided derivatives there, because Dini derivatives equal a one-sided derivative whenever it exists.
  clarke_generalized_gradient: >-
    The Clarke generalized gradient of $\abs{x}$ at $0$ is $[-1, 1]$, the convex hull of the nearby derivatives $\pm 1$.
  subdifferential: >-
    The subdifferential of $\abs{x}$ at $0$ equals its Clarke generalized gradient, because $\abs{x}$ is convex.
  weak_derivative: >-
    The weak derivative of $\abs{x}$ is $\operatorname{sign}(x)$, because $\operatorname{sign}(x)$ satisfies the integration-by-parts formula for $\abs{x}$.
    The value of $\operatorname{sign}(x)$ at the single point $0$ does not matter.
  differentiable: >-
    $x \mapsto \abs{x}$ is not differentiable at $0$, because it has a corner there.
  idempotent: >-
    $x \mapsto \abs{x}$ is idempotent, because $\abs{\abs{x}} = \abs{x}$.
  constant_function: >-
    $x \mapsto \abs{x}$ is not constant.
  continuously_differentiable: >-
    $f(x) = \abs{x}$ is not continuously differentiable, smooth, or analytic, because it is not even differentiable at $0$.
  one_sided_derivative: >-
    At $0$, the one-sided derivatives of $\abs{x}$ are $1$ and $-1$, and the corresponding Dini derivatives equal them.
---
