---
title: 'The function $g : [0, 1] \to [0, 1]$ defined by $g(x) = x$'
level: high-school
figure:
  widget: function-plot
  aspect: 5 / 4
  params:
    equal: true
    x: [-0.5, 1.5]
    y: [-0.3, 1.3]
    curves:
      - {"f": "x", "label": "g", "from": 0, "to": 1, "ends": "[]"}
  caption: |-
    The graph of $g(x) = x$ on $[0, 1]$.
  alt: "A segment from the origin to (1, 1), with dots at its ends."
is: [
  identity_function,
  inclusion_map
]
why:
  identity_function: >-
    The function $g : [0, 1] \to [0, 1]$ defined by $g(x) = x$ is the identity function on $[0, 1]$, because $g$ sends each point of $[0, 1]$ to itself and its codomain is its domain.
    It is a different function from the identity function on $\reals$, because its domain is different.
  inclusion_map: >-
    The function $g : [0, 1] \to [0, 1]$ defined by $g(x) = x$ is the inclusion map of $[0, 1]$ into itself, because $[0, 1]$ is a subset of itself and $g$ sends each point to itself.
---
