---
title: '$x \mapsto x^3$, from $\reals$ to $\reals$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-2, 2]
    y: [-5, 5]
    curves:
      - {"f": "x^3"}
  caption: |-
    The graph of $x \mapsto x^3$.
  alt: "A curve through the origin, flat there, falling steeply to the left and rising steeply to the right."
is: [
  continuous,
  open_map,
  closed_map
]
why:
  # TODO: This explanation is a bit round about. 
  continuous: >-
    $x \mapsto x^3$ is a homeomorphism of $\reals$: it is continuous, with the continuous inverse $x \mapsto \sqrt[3]{x}$.
    So it maps open sets to open sets and closed sets to closed sets.
---
