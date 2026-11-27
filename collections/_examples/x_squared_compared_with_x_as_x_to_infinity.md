---
title: '$x^2$ compared with $x$, as $x \to \infty$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-2, 2]
    curves:
      - {"f": "x^2", "label": "f"}
      - {"f": "x", "label": "g"}
  caption: |-
    The graphs of $f(x) = x^2$ and $g(x) = x$.
  alt: "An upward parabola and a straight line through the origin, which meet at (0, 0) and (1, 1)."
is: [big_Omega]
is_not: [
  big_O,
  little_o,
  big_Theta,
  asymptotically_equivalent
]
why:
  big_O: >-
    $x^2$ grows faster than every constant times $x$.
---
