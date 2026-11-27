---
title: '$f(x) = \sqrt{x}$ composed with $g(x) = x - 4$, on the real numbers'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-1, 9]
    y: [-2, 3.5]
    curves:
      - {"f": "sqrt(x)", "label": "f", "from": 0, "ends": "[ "}
      - {"f": "x - 4", "label": "g"}
      - {"f": "sqrt(x - 4)", "label": "f \\circ g", "from": 4, "ends": "[ "}
  caption: |-
    The graphs of $f(x) = \sqrt{x}$, $g(x) = x - 4$, and $(f \circ g)(x) = \sqrt{x - 4}$.
  alt: "A square-root curve from the origin for f, a straight line for g, and the same square-root curve starting at x = 4 for f composed with g."
is: [function_composition]
values:
  function_composition: '$(f \circ g)(x) = \sqrt{x - 4}$, for $x \geq 4$'
why:
  function_composition: >-
    The composition $f \circ g$ is defined only at the inputs $x$ such that $g(x) = x - 4$ is an input of $f$, which requires $x - 4 \geq 0$, so the domain of $f \circ g$ is $[4, \infty)$.
---
