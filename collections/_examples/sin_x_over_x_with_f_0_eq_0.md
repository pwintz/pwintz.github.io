---
title: '$f(x) = \frac{\sin x}{x}$ for $x \neq 0$, $f(0) = 0$, at $x = 0$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-15, 15]
    y: [-0.4, 1.2]
    curves:
      - {"f": "sin(x)/x", "label": "f"}
    points:
      - {"at": [0, 1], "open": true}
      - {"at": [0, 0]}
  caption: |-
    The graph of $f(x) = (\sin x)/x$ for $x \neq 0$, with $f(0) = 0$ (filled dot) and the point $(0, 1)$ missing (hollow dot).
  alt: "A wave with a central peak approaching height 1 and shrinking ripples on both sides, with a hollow dot at (0, 1) and a filled dot at the origin."
is: [removable_discontinuity]
is_not: [
  jump_discontinuity,
  infinite_discontinuity,
  oscillating_discontinuity
]
why:
  removable_discontinuity: >-
    $f(x) = \frac{\sin x}{x}$ for $x \neq 0$, $f(0) = 0$, has a removable discontinuity at $0$, because $\lim_{x \to 0} \frac{\sin x}{x} = 1$ exists but $f(0) = 0 \neq 1$; redefining $f(0) = 1$ makes $f$ continuous.
  jump_discontinuity: >-
    $f(x) = \frac{\sin x}{x}$ for $x \neq 0$, $f(0) = 0$, has no jump discontinuity at $0$, because the left and right limits at $0$ are both $1$.
  infinite_discontinuity: >-
    $f(x) = \frac{\sin x}{x}$ for $x \neq 0$, $f(0) = 0$, has no infinite discontinuity at $0$, because $\abs{f(x)} \leq 1$ for every $x$.
  oscillating_discontinuity: >-
    $f(x) = \frac{\sin x}{x}$ for $x \neq 0$, $f(0) = 0$, has no oscillating discontinuity at $0$, because $f(x)$ tends to $1$ from both sides.
---
