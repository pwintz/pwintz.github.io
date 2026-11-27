---
title: 'The boundary of a square'
level: high-school
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.8, 1.8]
    y: [-1.8, 1.8]
    grid: false
    shapes:
      - { polygon: [[-1, -1], [1, -1], [1, 1], [-1, 1]], fill: false }
  caption: |-
    The boundary of a square.
  alt: "The four sides of a square, not shaded inside."
is: [circle_topological]
is_not: [circle]
why:
  circle: >-
    The boundary of a square is not a (geometric) circle, because its points are not all at the same distance from the center.
  circle_topological: >-
    The boundary of a square is a topological circle, because it can be continuously deformed into a circle.
---
