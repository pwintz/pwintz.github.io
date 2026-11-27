---
title: '$f(t) = e^{t^2}$ for $t \geq 0$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-0.5, 2.2]
    y: [-2, 25]
    var: t
    curves:
      - {"f": "e^(t^2)", "label": "f", "from": 0, "ends": "[ "}
  caption: |-
    The graph of $f(t) = e^{t^2}$ for $t \geq 0$.
  alt: "A curve starting at height 1 at t = 0 and rising faster and faster."
values:
  laplace_transform: 'None'
why:
  laplace_transform: >-
    $f(t) = e^{t^2}$ has no Laplace transform.
    It grows faster than every exponential $e^{s t}$, so the Laplace integral diverges for every $s$.
---
