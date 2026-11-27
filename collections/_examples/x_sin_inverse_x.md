---
published: false
title: '$f(x) = x \sin(1/x)$, with $f(0) = 0$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-1, 1]
    y: [-0.4, 0.9]
    curves:
      - {"f": "x sin(1/x)", "label": "f", "samples": 8000}
    points:
      - {"at": [0, 0]}
  caption: |-
    The graph of $f(x) = x \sin(1/x)$, with $f(0) = 0$ (dot).
  alt: "A wave that oscillates faster and faster toward x = 0 while its height shrinks to 0, with a dot at the origin."
values:
  one_sided_derivative: '$f_{+}^{\prime}(0)$ and $f_{-}^{\prime}(0)$ do not exist'
  dini_derivative: '$D^{+} f(0) = D^{-} f(0) = 1$ and $D_{+} f(0) = D_{-} f(0) = -1$'
why:
  dini_derivative: >-
    The difference quotient $\frac{f(h) - f(0)}{h} = \sin(1/h)$ oscillates, so the one-sided derivatives do not exist, but its limit superior and limit inferior do.
  one_sided_derivative: >-
    The difference quotient $\frac{f(h) - f(0)}{h} = \sin(1/h)$ oscillates between $-1$ and $1$, so the one-sided derivatives at $0$ do not exist.
---
