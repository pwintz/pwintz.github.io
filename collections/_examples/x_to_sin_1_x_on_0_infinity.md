---
title: '$x \mapsto \sin(1/x)$ on $(0, \infty)$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-0.2, 3]
    y: [-1.4, 1.4]
    curves:
      - {"f": "sin(1/x)", "samples": 8000, "from": 0}
  caption: |-
    The graph of $x \mapsto \sin(1/x)$ on $(0, \infty)$.
  alt: "A wave whose oscillations crowd together toward x = 0, and which flattens toward the x-axis on the right."
is: [continuous]
is_not: [uniformly_continuous]
why:
  continuous: >-
    $x \mapsto \sin(1/x)$ is continuous on $(0, \infty)$.
  uniformly_continuous: >-
    $x \mapsto \sin(1/x)$ is not uniformly continuous, because it oscillates between $-1$ and $1$ faster and faster as $x \to 0$.
---
