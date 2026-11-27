---
published: false
title: '$f(x) = 1 / \ln(1/x)$ for $0 < x \leq \frac{1}{2}$, $f(0) = 0$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-0.05, 0.6]
    y: [-0.2, 1.7]
    curves:
      - {"f": "1/ln(1/x)", "label": "f", "samples": 6000, "from": 0, "to": 0.5, "ends": " ]"}
    points:
      - {"at": [0, 0]}
  caption: |-
    The graph of $f(x) = 1 / \ln(1/x)$ on $(0, 1/2]$, with $f(0) = 0$ (dot).
  alt: "A curve rising very steeply from the origin and then more slowly up to x = 1/2."
is: [uniformly_continuous]
is_not: [
  Holder_continuous,
  Lipschitz_continuous
]
why:
  Lipschitz_continuous: >-
    $f(x) = 1 / \ln(1/x)$ for $0 < x \leq 1/2$, $f(0) = 0$, is not Lipschitz continuous, because it is not Hölder continuous with $\alpha = 1$: $f(x) / x \to \infty$ as $x \to 0$.
  uniformly_continuous: >-
    The function $f(x) = 1 / \ln(1/x)$ is uniformly continuous because it is continuous on the compact interval $[0, \frac{1}{2}]$.
  Holder_continuous: >-
    $f(x) = 1 / \ln(1/x)$ for $0 < x \leq 1/2$, $f(0) = 0$, is not Hölder continuous for any $\alpha > 0$, because $f(x) / x^{\alpha} \to \infty$ as $x \to 0$.
---
