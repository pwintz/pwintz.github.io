---
title: '$x \mapsto \sin(x)$ on $\reals$'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-7, 7]
    y: [-1.5, 1.5]
    curves:
      - {"f": "sin x"}
  caption: |-
    The graph of $x \mapsto \sin(x)$.
  alt: "A wave between -1 and 1 that passes through the origin."
is: [
  continuous,
  uniformly_continuous
]
why:
  uniformly_continuous: >-
    $\sin$ is uniformly continuous, and so continuous, because $\abs{\sin(x) - \sin(y)} \leq \abs{x - y}$, so the choice $\delta = \varepsilon$ works everywhere.
---
