---
title: '$x \mapsto e^x$ on $\reals$'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-3, 2]
    curves:
      - {"f": "e^x"}
  caption: |-
    The graph of $x \mapsto e^x$.
  alt: "A curve that rises from just above the x-axis on the left, steeper and steeper to the right."
is: [
  continuous,
  analytic
]
is_not: [uniformly_continuous]
values:
  taylor_series: '$1 + x + x^2/2! + x^3/3! + \dots$ at $0$'
why:
  analytic: >-
    $e^x$ is analytic on $\reals$, because it equals the power series $1 + x + \frac{x^2}{2} + \frac{x^3}{6} + \dots$ for every $x$.
  continuous: >-
    $x \mapsto e^x$ is continuous.
  uniformly_continuous: >-
    $x \mapsto e^x$ is not uniformly continuous, because its graph gets steeper without bound as $x$ increases.
  taylor_series: >-
    Every derivative of $e^x$ is $e^x$, which is $1$ at $0$, so the coefficients of the Taylor series of $e^x$ at $0$ are $1/n!$.
---
