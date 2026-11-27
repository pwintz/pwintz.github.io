---
published: false
title: '$1$, for the interval $[0, 1)$'
level: high-school
figure:
  widget: plane
  aspect: 4 / 1
  params:
    number_line: true
    x: [-0.5, 1.5]
    shapes:
      - { interval: [0, 1], ends: "[)", label: "[0, 1)" }
      - { point: [1, 0], open: true, color: 1, label: "1" }
  caption: |-
    The interval $[0, 1)$ (blue) and the number $1$ (orange).
  alt: "A number line with the segment from 0 to 1 highlighted, filled at 0 and hollow at 1, with the hollow dot at 1 in orange."
is: [supremum]
is_not: [maximum]
why:
  maximum: >-
    $1$ is not in the set, and the set has no largest element.
  supremum: >-
    $1$ is the supremum of $[0, 1)$ because it is the least upper bound.
---
