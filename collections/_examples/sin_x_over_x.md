---
title: '$f(x) = \frac{\sin x}{x}$, at $x = 0$'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-15, 15]
    y: [-0.4, 1.2]
    curves:
      - {"f": "sin(x)/x", "label": "f"}
    points:
      - {"at": [0, 1], "open": true}
  caption: |-
    The graph of $f(x) = (\sin x)/x$, with the point $(0, 1)$ missing (hollow dot).
  alt: "A wave with a tall central peak at height 1 and shrinking ripples on both sides, with a hollow dot at (0, 1)."
values:
  limit_of_function: '$\lim_{x \to 0} f(x) = 1$'
  left_limit: '$\lim_{x \to 0^{-}} f(x) = 1$'
  right_limit: '$\lim_{x \to 0^{+}} f(x) = 1$'
is_not: [continuous]
why:
  # TODO: Show calculation for why the limit exists.
  limit_of_function: >-
    The limit of $\frac{\sin x}{x}$ at $0$ is $1$, because its left and right limits are both $1$. The value $f(0)$ is undefined, but the limit exists anyway.
  right_limit: >-
    The right limit of $\frac{\sin x}{x}$ at $0$ is $1$, because $\frac{\sin x}{x}$ approaches $1$ as $x$ approaches $0$ from the right, even though $f(0)$ is undefined.
  continuous: >-
    The function is not continuous at $x = 0$ because $f(0)$ is undefined, so $x = 0$ is not in the domain of $f$.
  left_limit: >-
    The left limit of $\frac{\sin x}{x}$ at $0$ is $1$, because $\frac{\sin x}{x}$ approaches $1$ as $x$ approaches $0$ from the left.
---
