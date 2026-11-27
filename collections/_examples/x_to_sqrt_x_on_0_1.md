---
title: '$x \mapsto \sqrt{x}$ on $[0, 1]$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-0.3, 1.5]
    y: [-0.3, 1.3]
    curves:
      - {"f": "sqrt(x)", "from": 0, "to": 1, "ends": "[]"}
  caption: |-
    The graph of $x \mapsto \sqrt{x}$ on $[0, 1]$.
  alt: "A curve rising steeply from the origin and leveling off toward (1, 1), with dots at its ends."
is: [
  Holder_continuous,
  uniformly_continuous,
  absolutely_continuous,
  continuous
]
is_not: [
  locally_Lipschitz_continuous,
  Lipschitz_continuous,
  continuously_differentiable
]
why:
  Lipschitz_continuous: >-
    $x \mapsto \sqrt{x}$ is not Lipschitz continuous, because its slope is unbounded near $0$.
  absolutely_continuous: >-
    $x \mapsto \sqrt{x}$ is absolutely continuous because it is the integral of its derivative $\frac{1}{2 \sqrt{t}}$, which is integrable on $[0, 1]$.
  uniformly_continuous: >-
    $x \mapsto \sqrt{x}$ on $[0, 1]$ is uniformly continuous, because it is Hölder continuous: $\abs{\sqrt{x} - \sqrt{y}} \leq \abs{x - y}^{1/2}$.
  continuous: >-
    $x \mapsto \sqrt{x}$ on $[0, 1]$ is continuous, because it is uniformly continuous.
  continuously_differentiable: >-
    $x \mapsto \sqrt{x}$ on $[0, 1]$ is not continuously differentiable, because it is not differentiable at $0$: its slope is unbounded near $0$.
  locally_Lipschitz_continuous: >-
    $x \mapsto \sqrt{x}$ on $[0, 1]$ is not locally Lipschitz continuous, because every neighborhood of $0$ contains points $x$ where the slope $\sqrt{x} / x = 1 / \sqrt{x}$ of the line from $(0, 0)$ is arbitrarily large.
  Holder_continuous: >-
    $x \mapsto \sqrt{x}$ on $[0, 1]$ is Hölder continuous with $\alpha = 1/2$, because $\abs{\sqrt{x} - \sqrt{y}} \leq \abs{x - y}^{1/2}$.
---
