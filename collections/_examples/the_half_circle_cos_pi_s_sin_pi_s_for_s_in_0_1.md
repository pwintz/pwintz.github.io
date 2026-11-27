---
title: 'The half circle $\gamma(s) = (\cos \pi s, \sin \pi s)$, for $s \in [0, 1]$'
level: undergraduate
figure:
  widget: plane
  params:
    x: [-1.5, 1.5]
    y: [-0.5, 1.5]
    shapes:
      - { curve: ["cos(pi t)", "sin(pi t)"], t: [0, 1], label: "\\gamma" }
      - { point: [1, 0], label: "\\gamma(0)" }
      - { point: [-1, 0], label: "\\gamma(1)" }
  caption: |-
    The path $\gamma$, from $\gamma(0) = (1, 0)$ to $\gamma(1) = (-1, 0)$.
  alt: "The upper half of the unit circle, from (1, 0) to (-1, 0)."
is: [path_continuous]
is_not: [path_graph]
why:
  path_continuous: >-
    The half circle $\gamma$ is a continuous path from $(1, 0)$ to $(-1, 0)$, because $\gamma$ is a continuous function from $[0, 1]$ to $\reals^2$.
  path_graph: >-
    The half circle $\gamma$ is not a path in a graph, because $\gamma$ is a function on the interval $[0, 1]$, not a sequence of vertices of a graph.
---
