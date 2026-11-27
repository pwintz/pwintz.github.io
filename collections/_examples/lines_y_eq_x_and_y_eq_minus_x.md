---
title: 'The lines $y = x$ and $y = -x$ in the plane, with direction vectors $(1, 1)$ and $(1, -1)$'
level: high-school
figure:
  widget: plane
  aspect: 1 / 1
  params:
    x: [-2, 2]
    y: [-2, 2]
    shapes:
      - { line: [[0, 0], [1, 1]], label: "y = x", label_at: [1.4, 1.4] }
      - { line: [[0, 0], [1, -1]], color: 1, label: "y = -x", label_at: [1.4, -1.4] }
      - { vector: [1, 1], label: "(1, 1)" }
      - { vector: [1, -1], color: 1, label: "(1, -1)" }
  caption: |-
    The lines $y = x$ (blue) and $y = -x$ (orange), with the direction vectors $(1, 1)$ and $(1, -1)$.
  alt: "Two lines crossing at the origin at right angles, each with an arrow along it."
is: [
  right_angle,
  perpendicular,
  orthogonal_vectors
]
why:
  right_angle: >-
    The lines $y = x$ and $y = -x$ cross at the origin and form four right angles there.
  perpendicular: >-
    The lines $y = x$ and $y = -x$ are perpendicular, because the lines intersect at the origin and the product of their slopes is $1 \cdot (-1) = -1$.
  orthogonal_vectors: >-
    The direction vectors $(1, 1)$ and $(1, -1)$ of the lines $y = x$ and $y = -x$ are orthogonal, because their dot product is $1 - 1 = 0$.
---
