---
title: '$f(x) = x^2$ composed with $g(x) = x + 1$'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-3, 2]
    y: [-2, 5]
    curves:
      - {"f": "x^2", "label": "f"}
      - {"f": "x + 1", "label": "g"}
      - {"f": "(x + 1)^2", "label": "f \\circ g"}
  caption: |-
    The graphs of $f(x) = x^2$, $g(x) = x + 1$, and $(f \circ g)(x) = (x + 1)^2$.
  alt: "An upward parabola for f, a straight line for g, and the same parabola moved one unit left for f composed with g."
is: [function_composition]
values:
  function_composition: '$(f \circ g)(x) = (x + 1)^2$'
why:
  function_composition: >-
    The composition $f \circ g$ first adds $1$ and then squares, so $(f \circ g)(x) = f(x + 1) = (x + 1)^2$.
    In the other order, $(g \circ f)(x) = x^2 + 1$, which is a different function, because $(f \circ g)(1) = 4$ but $(g \circ f)(1) = 2$.
---
