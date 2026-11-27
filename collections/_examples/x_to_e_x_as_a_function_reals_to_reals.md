---
published: false
title: '$x \mapsto e^x$, as a function $\reals \to \reals$'
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
is: [injective]
is_not: [
  surjective,
  bijective
]
why:
  injective: >-
    $x \mapsto e^x$ is injective because it is increasing.
  surjective: >-
    $x \mapsto e^x$, as a function $\reals \to \reals$, is not surjective, because negative numbers are not outputs.
  bijective: >-
    $x \mapsto e^x$, as a function $\reals \to \reals$, is not bijective, because it is not surjective.
---
