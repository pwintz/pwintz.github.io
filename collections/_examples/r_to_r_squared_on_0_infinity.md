---
published: false
title: '$r \mapsto r^2$ on $[0, \infty)$'
level: graduate
figure:
  widget: function-plot
  params:
    x: [-1, 3]
    y: [-0.8, 7]
    var: r
    curves:
      - {"f": "r^2", "from": 0, "ends": "[ "}
  caption: |-
    The graph of $r \mapsto r^2$ on $[0, \infty)$.
  alt: "A curve rising from the origin, steeper and steeper, with a dot at the origin."
is: [
  class_K,
  class_K_infinity,
  positive_definite_function
]
is_not: [class_L]
why:
  positive_definite_function: >-
    $r \mapsto r^2$ on $[0, \infty)$ is positive definite, because $0^2 = 0$ and $r^2 > 0$ for $r > 0$.
  class_K: >-
    $r \mapsto r^2$ is of class $\mathcal{K}$, because it is continuous, increasing, and zero at $0$.
  class_L: >-
    $r \mapsto r^2$ is not of class $\mathcal{L}$, because it does not decrease to $0$.
  class_K_infinity: >-
    $r \mapsto r^2$ is of class $\mathcal{K}_{\infty}$, because it is of class $\mathcal{K}$ and unbounded.
---
