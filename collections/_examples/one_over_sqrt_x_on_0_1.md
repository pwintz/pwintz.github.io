---
published: false
title: '$f(x) = 1 / \sqrt{x}$ on $(0, 1]$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-0.2, 1.3]
    y: [-0.5, 8]
    curves:
      - {"f": "1/sqrt(x)", "label": "f", "from": 0, "to": 1, "ends": " ]"}
  caption: |-
    The graph of $f(x) = 1 / \sqrt{x}$ on $(0, 1]$.
  alt: "A curve that falls from very high near x = 0 to height 1 at x = 1."
values:
  riemann_integral: 'None'
  improper_integral: '$\lim_{t \to 0^{+}} \int_t^1 x^{-1/2} \dx = \lim_{t \to 0^{+}} (2 - 2 \sqrt{t}) = 2$'
  lebesgue_integral: '$2$'
why:
  riemann_integral: >-
    The function $1 / \sqrt{x}$ has no Riemann integral on $[0, 1]$, because it is unbounded near $0$.
  lebesgue_integral: >-
    The Lebesgue integral of $1 / \sqrt{x}$ on $(0, 1]$ is $2$, the same as the improper integral, because the function is nonnegative.
---
