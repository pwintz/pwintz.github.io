---
published: false
title: 'The straight-line path $\gamma(s) = (1 - s, s)$, for $s \in [0, 1]$, compared with the harmonic oscillator $\dot{x} = y$, $\dot{y} = -x$'
level: undergraduate
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.6, 1.6]
    y: [-1.6, 1.6]
    field: ["y", "-x"]
    shapes:
      - { segment: [[1, 0], [0, 1]], color: 1, label: "\\gamma" }
      - { point: [1, 0], color: 1 }
      - { point: [0, 1], color: 1 }
  caption: |-
    The path $\gamma$ from $(1, 0)$ to $(0, 1)$ (orange), with the vector field $(y, -x)$ of the harmonic oscillator.
  alt: "Gray arrows circling the origin clockwise, and an orange segment from (1, 0) to (0, 1) that cuts across them."
is: [path_continuous]
is_not: [trajectory]
why:
  path_continuous: >-
    The straight line $\gamma(s) = (1 - s, s)$ is a path from $(1, 0)$ to $(0, 1)$, because $\gamma$ is continuous on $[0, 1]$.
  trajectory: >-
    The straight line $\gamma(s) = (1 - s, s)$ is not a trajectory of the harmonic oscillator, because $\gamma^{\prime}(s) = (-1, 1)$, whereas the harmonic oscillator requires the velocity $(y, -x) = (s, s - 1)$ at the point $(1 - s, s)$.
---
