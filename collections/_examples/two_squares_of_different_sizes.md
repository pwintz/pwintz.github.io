---
published: false
title: 'Two squares of different sizes'
level: elementary
figure:
  widget: plane
  params:
    x: [-0.5, 5]
    y: [-0.5, 2.5]
    grid: false
    shapes:
      - { polygon: [[0, 0], [1, 0], [1, 1], [0, 1]] }
      - { polygon: [[2, 0], [4, 0], [4, 2], [2, 2]], color: 1 }
  caption: |-
    A square of side $1$ (blue) and a square of side $2$ (orange).
  alt: "A small shaded square next to a square twice as wide."
is_not: [congruent]
why:
  congruent: >-
    Two squares of different sizes are not congruent.
    They have the same shape (they are similar), but not the same size.
---
