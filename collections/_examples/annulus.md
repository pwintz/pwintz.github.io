---
title: 'The ring $\setdef{(x, y) \suchthat 1 \leq x^2 + y^2 \leq 4}$ (an annulus)'
level: high-school
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
