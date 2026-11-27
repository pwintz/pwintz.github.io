---
title: 'One side of a square'
level: elementary
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.8, 1.8]
    y: [-1.8, 1.8]
    grid: false
    shapes:
      - { polygon: [[-1, -1], [1, -1], [1, 1], [-1, 1]], fill: false, dash: true }
      - { segment: [[-1, -1], [1, -1]], color: 1 }
  caption: |-
    A square (dashed), with one side (orange).
  alt: "A dashed square with its bottom side drawn solid in orange."
is: [edge_polygon]
is_not: [boundary]
why:
  edge_polygon: >-
    One side of a square is an edge of the square, viewed as a polygon.
  boundary: >-
    One side of a square is not the boundary of the square, because the boundary consists of all four sides.
---
