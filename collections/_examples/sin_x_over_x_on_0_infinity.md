---
published: false
title: '$f(x) = \frac{\sin x}{x}$ on $(0, \infty)$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-1, 25]
    y: [-0.4, 1.2]
    curves:
      - {"f": "sin(x)/x", "label": "f", "from": 0}
    points:
      - {"at": [0, 1], "open": true}
  caption: |-
    The graph of $f(x) = (\sin x)/x$ on $(0, \infty)$.
  alt: "A wave starting near height 1 at the left and rippling toward the x-axis, with smaller and smaller ripples."
values:
  riemann_integral: 'None'
  improper_integral: '$\lim_{t \to \infty} \int_0^t \frac{\sin x}{x} \dx = \frac{\pi}{2}$'
  lebesgue_integral: 'None'
why:
  riemann_integral: >-
    The function $\frac{\sin x}{x}$ has no Riemann integral on $(0, \infty)$, because Riemann integrals are only defined on bounded intervals.
  improper_integral: >-
    The improper integral of $\frac{\sin x}{x}$ exists because the positive and negative humps of the graph cancel more and more exactly; its value $\frac{\pi}{2}$ comes from complex analysis.
  lebesgue_integral: >-
    The function $\frac{\sin x}{x}$ is not Lebesgue integrable on $(0, \infty)$, because $\int_0^{\infty} \abs{\frac{\sin x}{x}} \dx = \infty$: the Lebesgue integral requires the positive and negative parts to have finite integrals separately.
---
