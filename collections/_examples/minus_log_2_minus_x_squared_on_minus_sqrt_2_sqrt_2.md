---
published: false
title: '$-\log(2 - x^2)$, on $(-\sqrt{2}, \sqrt{2})$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-2, 2]
    y: [-1.5, 4]
    curves:
      - {"f": "-ln(2 - x^2)", "from": -1.41421356, "to": 1.41421356}
  caption: |-
    The graph of $-\log(2 - x^2)$ on $(-\sqrt{2}, \sqrt{2})$.
  alt: "A U-shaped curve with its lowest point at x = 0, rising to infinity toward minus and plus the square root of 2."
is: [barrier_function_optimization]
is_not: [barrier_function]
why:
  barrier_function_optimization: >-
    $-\log(2 - x^2)$ is a barrier function in optimization, because it tends to infinity at the boundary of the feasible set $\setdef{x \suchthat x^2 - 2 < 0}$.
  barrier_function: >-
    $-\log(2 - x^2)$ is not a barrier function in control theory, because it involves no system, and it is not zero on the boundary.
---
