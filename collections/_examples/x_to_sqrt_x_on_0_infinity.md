---
title: '$x \mapsto \sqrt{x}$ on $[0, \infty)$'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-1, 6]
    y: [-0.5, 2.8]
    curves:
      - {"f": "sqrt(x)", "from": 0, "ends": "[ "}
  caption: |-
    The graph of $x \mapsto \sqrt{x}$ on $[0, \infty)$.
  alt: "A curve rising steeply from the origin and then more and more slowly, with a dot at the origin."
is: [
  continuous,
  uniformly_continuous
]
values:
  domain: '$[0, \infty)$'
why:
  uniformly_continuous: >-
    $x \mapsto \sqrt{x}$ is uniformly continuous, and so continuous, because $\abs{\sqrt{x} - \sqrt{y}} \leq \sqrt{\abs{x - y}}$, so the choice $\delta = \varepsilon^2$ works everywhere.
---
