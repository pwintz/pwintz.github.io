---
title: 'Two adjacent sides of a rectangle, as segments meeting at a corner'
level: elementary
figure:
  widget: plane
  params:
    x: [-0.5, 3.5]
    y: [-0.5, 2.5]
    grid: false
    shapes:
      - { polygon: [[0, 0], [3, 0], [3, 2], [0, 2]], fill: false, dash: true }
      - { segment: [[0, 0], [3, 0]], color: 1 }
      - { segment: [[0, 0], [0, 2]], color: 1 }
  caption: |-
    A rectangle (dashed), with two adjacent sides (orange).
  alt: "A dashed rectangle with its bottom and left sides drawn solid in orange, meeting at the lower-left corner."
is: [
  right_angle,
  perpendicular
]
why:
  right_angle: >-
    The angle at the corner of a rectangle where two adjacent sides meet is a right angle, because every angle of a rectangle measures $90^\circ$.
  perpendicular: >-
    Two adjacent sides of a rectangle are perpendicular, because the sides meet at the corner and form a right angle there.
---
