---
published: false
title: '$f(x) = x \sin(1/x)$ for $x \neq 0$, $f(0) = 0$, on $[0, 1]$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-0.1, 1.1]
    y: [-0.4, 0.9]
    curves:
      - {"f": "x sin(1/x)", "label": "f", "samples": 8000, "from": 0, "to": 1, "ends": " ]"}
    points:
      - {"at": [0, 0]}
  caption: |-
    The graph of $f(x) = x \sin(1/x)$ on $(0, 1]$, with $f(0) = 0$ (dot).
  alt: "A wave that oscillates faster and faster toward x = 0 while its height shrinks to 0, with dots at the origin and at x = 1."
is: [uniformly_continuous]
is_not: [absolutely_continuous]
why:
  absolutely_continuous: >-
    ([source](https://en.wikipedia.org/wiki/Absolute_continuity#Examples))
  uniformly_continuous: >-
    The function $f(x) = x \sin(1/x)$ is uniformly continuous on $[0, 1]$, because it is continuous on a compact interval.
---
