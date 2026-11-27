---
published: false
title: '$x \mapsto e^x$, as a function $\reals \to (0, \infty)$'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-3, 2]
    curves:
      - {"f": "e^x"}
  caption: |-
    The graph of $x \mapsto e^x$.
  alt: "A curve that rises from just above the x-axis on the left, steeper and steeper to the right."
is: [
  injective,
  surjective,
  bijective
]
why:
  injective: >-
    $x \mapsto e^x$ is injective because it is increasing.
  surjective: >-
    $x \mapsto e^x$, as a function $\reals \to (0, \infty)$, is surjective, because every positive $y$ is $e^{\ln y}$.
  bijective: >-
    $x \mapsto e^x$, as a function $\reals \to (0, \infty)$, is bijective, because it is injective and surjective.
---
