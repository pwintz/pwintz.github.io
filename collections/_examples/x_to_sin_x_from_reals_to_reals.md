---
published: false
title: '$x \mapsto \sin x$, from $\reals$ to $\reals$'
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-7, 7]
    y: [-1.5, 1.5]
    curves:
      - {"f": "sin x"}
  caption: |-
    The graph of $x \mapsto \sin x$.
  alt: "A wave between -1 and 1 that passes through the origin."
is: [continuous]
is_not: [
  open_map,
  closed_map
]
why:
  continuous: >-
    $\sin$ is continuous.
  open_map: >-
    $\sin$ is not an open map, because $\sin((-\pi, \pi)) = [-1, 1]$ is not open.
  closed_map: >-
    $\sin$ is not a closed map, because the closed set $\setdef{2 \pi n + 1/n \suchthat n \geq 2}$ maps to $\setdef{\sin(1/n) \suchthat n \geq 2}$, which does not contain its limit $0$.
---
