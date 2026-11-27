---
published: false
title: 'The indicator of $[0, \infty)$, from $\reals$ to $\setdef{0, 1}$ with the discrete topology'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-2, 2]
    y: [-0.5, 1.5]
    curves:
      - {"f": "0", "to": 0, "ends": " )"}
      - {"f": "1", "same": true, "from": 0, "ends": "[ "}
  caption: |-
    The graph of the indicator of $[0, \infty)$, with the value $1$ at $x = 0$ (filled dot).
  alt: "A horizontal line at height 0 for negative x ending in a hollow dot at the origin, and a horizontal line at height 1 starting with a filled dot at x = 0."
is: [
  open_map,
  closed_map
]
is_not: [continuous]
why:
  continuous: >-
    The indicator is not continuous, because the preimage of the open set $\setdef{1}$ is $[0, \infty)$, which is not open.
  closed_map: >-
    The indicator is a closed map, because every subset of $\setdef{0, 1}$, with the discrete topology, is closed.
  open_map: >-
    The indicator is an open map, because every subset of $\setdef{0, 1}$, with the discrete topology, is open.
---
