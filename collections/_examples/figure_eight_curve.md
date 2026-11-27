---
title: 'A figure-eight curve'
level: graduate
figure:
  widget: plane
  aspect: 16 / 9
  params:
    x: [-2.4, 2.4]
    y: [-1.4, 1.4]
    grid: false
    shapes:
      - { circle: [-1, 0, 1] }
      - { circle: [1, 0, 1] }
      - { point: [0, 0], color: 1, label: '(0, 0)', label_at: [0.33, 0] }
  caption: |-
    The circles of radius $1$ centered at $(-1, 0)$ and $(1, 0)$, with their crossing point $(0, 0)$ (orange).
  alt: "Two circles side by side that touch at one point, the origin (0, 0), shaped like the digit 8 on its side."
description: >-
  A curve in the plane shaped like the digit $8$: two loops that meet at a single crossing point.
  An example is the union of the circles of radius $1$ centered at $(-1, 0)$ and $(1, 0)$, which meet at the origin.
is_not: [
  circle_topological,
  manifold
]
why:
  circle_topological: >-
    A figure-eight curve is not a topological circle, because removing its crossing point leaves two pieces, but removing a single point of a circle leaves one piece.
  manifold: >-
    A figure-eight curve is not a manifold, because no [neighborhood](/dictionary/definitions/neighborhood) of its crossing point is [homeomorphic](/dictionary/definitions/homeomorphism) to an open interval.
---
