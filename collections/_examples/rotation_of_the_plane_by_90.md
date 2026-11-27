---
title: 'Rotation of the plane by $90°$'
level: high-school
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-2.2, 2.2]
    y: [-2.2, 2.2]
    shapes:
      - { polygon: [[0, 0], [0.4, 0], [0.4, 0.8], [1, 0.8], [1, 1.1], [0.4, 1.1], [0.4, 1.5], [1.2, 1.5], [1.2, 1.8], [0, 1.8]], label: F }
      - { polygon: [[0, 0], [0.4, 0], [0.4, 0.8], [1, 0.8], [1, 1.1], [0.4, 1.1], [0.4, 1.5], [1.2, 1.5], [1.2, 1.8], [0, 1.8]], map: [[0, -1], [1, 0]], color: 1, label: "f(F)" }
  caption: |-
    A shape $F$ (blue) and its rotation by $90°$ (orange).
  alt: "A letter-F shape and the same shape turned a quarter turn counterclockwise about the origin."
is: [linear_map]
is_not: [
  matrix,
  array
]
---
