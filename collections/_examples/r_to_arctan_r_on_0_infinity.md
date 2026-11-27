---
title: '$r \mapsto \arctan r$ on $[0, \infty)$'
level: graduate
figure:
  widget: function-plot
  params:
    x: [-1, 10]
    y: [-0.3, 1.9]
    var: r
    curves:
      - {"f": "arctan(r)", "from": 0, "ends": "[ "}
      - {"f": "pi/2", "dash": true, "color": 5}
  caption: |-
    The graph of $r \mapsto \arctan r$ on $[0, \infty)$, and the line $y = \pi/2$ (dashed).
  alt: "A curve rising from the origin and leveling off below a dashed horizontal line at pi/2."
is: [
  class_K,
  positive_definite_function
]
is_not: [class_K_infinity]
why:
  positive_definite_function: >-
    $r \mapsto \arctan r$ on $[0, \infty)$ is positive definite, because $\arctan 0 = 0$ and $\arctan r > 0$ for $r > 0$.
  class_K: >-
    $r \mapsto \arctan r$ is of class $\mathcal{K}$, because it is continuous, increasing, and zero at $0$.
  class_K_infinity: >-
    $r \mapsto \arctan r$ is not of class $\mathcal{K}_{\infty}$, because it is bounded by $\pi / 2$.
---
