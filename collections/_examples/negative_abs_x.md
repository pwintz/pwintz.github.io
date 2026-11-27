---
title: '$f(x) = -\abs{x}$'
level: high-school
figure:
  widget: function-plot
  aspect: 4 / 3
  params:
    equal: true
    x: [-2, 2]
    y: [-2.5, 0.5]
    curves:
      - {"f": "-abs(x)", "label": "f"}
  caption: |-
    The graph of $f(x) = -\abs{x}$.
  alt: "An upside-down V-shaped graph with its corner at the origin."
values:
  one_sided_derivative: '$f_{+}^{\prime}(0) = -1$ and $f_{-}^{\prime}(0) = 1$'
  clarke_generalized_gradient: '$\partial f(0) = [-1, 1]$'
  subdifferential: '$\partial f(0) = \emptyset$'
why:
  subdifferential: >-
    The subdifferential of $x \mapsto -\abs{x}$ at $0$ is empty, because the function is concave with a corner at $0$, so no line through $(0, 0)$ lies below its graph.

  # TODO: Add a longer "why"
  clarke_generalized_gradient: >-
    At $0$, the one-sided derivatives of $-\abs{x}$ are $-1$ and $1$, and its Clarke generalized gradient is $[-1, 1]$.
---
