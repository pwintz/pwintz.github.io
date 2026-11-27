---
published: false
title: 'A closed disk'
level: graduate
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.5, 1.5]
    y: [-1.5, 1.5]
    grid: false
    shapes:
      - { disk: [0, 0, 1] }
      - { point: [-0.4, 0.2], open: true, color: 1 }
      - { point: [0.45, -0.3], open: true, color: 1 }
  caption: |-
    A closed disk, with two points removed (hollow dots).
  alt: "A shaded disk with two hollow dots inside it."
is_not: [circle_topological]
why:
  circle_topological: >-
    Removing two points of a circle disconnects it, but removing two points of a disk does not.
---
