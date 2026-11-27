---
published: false
title: 'The solution from $x = 1$ of $\dot{x} = x^2$ on $C = \reals$'
level: graduate
figure:
  widget: function-plot
  params:
    var: t
    y_var: x
    x: [-2, 1.5]
    y: [-0.5, 8]
    curves:
      - { f: "1/(1 - t)", to: 0.999, label: "x(t) = 1/(1 - t)", label_at: -1.2 }
    points:
      - { at: [0, 1] }
  caption: |-
    The solution $x(t) = 1/(1 - t)$, with $x(0) = 1$ (dot).
  alt: "A curve through (0, 1) that rises faster and faster, without bound, as t approaches 1."
is: [maximal_solution]
is_not: [complete_solution]
why:
  maximal_solution: >-
    The solution from $x = 1$ is $x(t) = \frac{1}{1 - t}$, which is maximal because it escapes to infinity at $t = 1$ and so cannot be extended.
  complete_solution: >-
    The solution from $x = 1$ is not complete, because it exists only for $t < 1$.
---
