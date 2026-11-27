---
published: false
title: '$x \mapsto x^2$, from $\reals$ to $\reals$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-2, 2]
    curves:
      - {"f": "x^2"}
  caption: |-
    The graph of $x \mapsto x^2$.
  alt: "A parabola opening upward with its vertex at the origin."
is: [
  continuous,
  closed_map
]
is_not: [open_map]
why:
  open_map: >-
    $x \mapsto x^2$ is not an open map, because the image of $(-1, 1)$ is $[0, 1)$, which is not open.
  continuous: >-
    $x \mapsto x^2$ is continuous, because it is a polynomial.
  closed_map: >-
    $x \mapsto x^2$ is a closed map, because it maps closed sets to closed sets: a sequence of outputs $x_n^2$ that converges comes from bounded inputs, which have a convergent subsequence.
---
