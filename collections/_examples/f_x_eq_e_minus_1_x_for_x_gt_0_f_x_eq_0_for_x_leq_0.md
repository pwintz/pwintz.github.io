---
published: false
title: '$f(x) = e^{-1/x}$ for $x > 0$, $f(x) = 0$ for $x \leq 0$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-2, 4]
    y: [-0.2, 1]
    curves:
      - {"f": "0", "label": "f", "to": 0}
      - {"f": "e^(-1/x)", "same": true, "from": 0}
  caption: |-
    The graph of $f(x) = e^{-1/x}$ for $x > 0$ and $f(x) = 0$ for $x \leq 0$.
  alt: "A graph along the x-axis for negative x, then rising very slowly from the origin and leveling off below height 1."
is: [
  differentiable,
  continuously_differentiable,
  smooth
]
is_not: [analytic]
values:
  taylor_series: '$0$ at $0$'
why:
  smooth: >-
    The function $f$, with $f(x) = e^{-1/x}$ for $x > 0$ and $f(x) = 0$ for $x \leq 0$, is smooth, because it has derivatives of every order, including at $0$, where every derivative is $0$.
  analytic: >-
    The function $f$, with $f(x) = e^{-1/x}$ for $x > 0$ and $f(x) = 0$ for $x \leq 0$, is not analytic, because every derivative at $0$ is $0$, so its Taylor series at $0$ is $0$, but $f(x) > 0$ for $x > 0$.
  continuously_differentiable: >-
    The function $f$, with $f(x) = e^{-1/x}$ for $x > 0$ and $f(x) = 0$ for $x \leq 0$, is continuously differentiable, because it is smooth.
  differentiable: >-
    The function $f$, with $f(x) = e^{-1/x}$ for $x > 0$ and $f(x) = 0$ for $x \leq 0$, is differentiable, because it is smooth.
  taylor_series: >-
    The Taylor series at $0$ of the function $f$, with $f(x) = e^{-1/x}$ for $x > 0$ and $f(x) = 0$ for $x \leq 0$, is $0$, because every derivative of $f$ at $0$ is $0$.
---
