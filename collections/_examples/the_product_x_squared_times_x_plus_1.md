---
title: 'The product $f(x) \, g(x) = x^2 (x + 1)$ of $f(x) = x^2$ and $g(x) = x + 1$'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-2, 1.5]
    y: [-2, 3.5]
    curves:
      - {"f": "x^2", "label": "f"}
      - {"f": "x + 1", "label": "g"}
      - {"f": "x^2 (x + 1)", "label": "f g"}
  caption: |-
    The graphs of $f(x) = x^2$, $g(x) = x + 1$, and their product $f(x) \, g(x) = x^2 (x + 1)$.
  alt: "An upward parabola for f, a straight line for g, and a cubic curve for their product, which is 0 at x = -1 and at x = 0."
is_not: [function_composition]
why:
  function_composition: >-
    The product $f(x) \, g(x) = x^2 (x + 1)$ is not the composition of $f$ and $g$, because the product multiplies the outputs of $f$ and $g$, whereas the composition $f \circ g$ uses the output of $g$ as the input of $f$, giving $(x + 1)^2$.
---
