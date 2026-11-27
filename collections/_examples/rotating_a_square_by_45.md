---
published: false
title: 'Rotating a square by $45^\circ$ about its center'
level: elementary
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.8, 1.8]
    y: [-1.8, 1.8]
    grid: false
    shapes:
      - { polygon: [[-1, -1], [1, -1], [1, 1], [-1, 1]] }
      - { polygon: [[-1, -1], [1, -1], [1, 1], [-1, 1]], map: [[0.70711, -0.70711], [0.70711, 0.70711]], color: 1, fill: false, dash: true }
  caption: |-
    A square (blue) and its rotation by $45°$ about its center (orange, dashed).
  alt: "A square and the same square rotated an eighth of a turn, which points its corners up, down, left, and right."
is_not: [
  geometric_symmetry,
  automorphism
]
why:
  geometric_symmetry: >-
    The rotated square does not land on the original one.
---
