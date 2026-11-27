---
published: false
title: 'Rotating a square by $90^\circ$ about its center'
level: high-school
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-1.8, 1.8]
    y: [-1.8, 1.8]
    grid: false
    shapes:
      - { polygon: [[-1, -1], [1, -1], [1, 1], [-1, 1]] }
      - { polygon: [[-1, -1], [1, -1], [1, 1], [-1, 1]], map: [[0, -1], [1, 0]], color: 1, fill: false, dash: true }
      - { point: [1, 1], label: A }
      - { point: [1, 1], map: [[0, -1], [1, 0]], color: 1, label: "A'" }
  caption: |-
    A square (blue) and its rotation by $90°$ about its center (orange, dashed), with a corner $A$ and its image $A'$.
  alt: "A square and the same square rotated a quarter turn, which lands exactly on the original; one corner moves to the next corner."
is: [automorphism]
---
