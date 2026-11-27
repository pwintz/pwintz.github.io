---
title: 'The ring $\setdef{(x, y) \suchthat 1 \leq x^2 + y^2 \leq 4}$ (an annulus)'
level: high-school
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-2.5, 2.5]
    y: [-2.5, 2.5]
    grid: false
    shapes:
      - { disk: [0, 0, 2], hole: 1 }
      - { segment: [[-1.5, 0], [1.5, 0]], color: 1, dash: true }
  caption: |-
    The annulus $1 \leq x^2 + y^2 \leq 4$, with the segment from $(-1.5, 0)$ to $(1.5, 0)$ (dashed).
  alt: "A shaded ring between circles of radius 1 and 2 around the origin, with a dashed segment crossing the hole."
is: [
  connected,
  path_connected
]
is_not: [
  simply_connected,
  convex_set
]
why:
  convex_set: >-
    The annulus is not convex, because the segment between $(-1.5, 0)$ and $(1.5, 0)$ passes through the hole at the origin.
  simply_connected: >-
    A loop around the hole cannot be shrunk to a point without leaving the ring.
  path_connected: >-
    The annulus is path-connected, and so connected, because every two points can be joined by a path that goes around the ring.
---
