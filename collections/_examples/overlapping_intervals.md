---
published: false
title: 'The intervals $[0, 0.6]$ and $[0.4, 1]$, for $[0, 1]$'
level: high-school
figure:
  widget: plane
  aspect: 3 / 1
  params:
    number_line: true
    y: [-0.45, 0.9]
    x: [-0.5, 1.5]
    ticks: [0, 0.2, 0.4, 0.6, 0.8, 1]
    shapes:
      - { interval: [0, 0.6], ends: "[]", height: 0.55, label: "[0, 0.6]" }
      - { interval: [0.4, 1], ends: "[]", height: 0.25, color: 1, label: "[0.4, 1]" }
  caption: |-
    The intervals $[0, 0.6]$ (blue) and $[0.4, 1]$ (orange).
  alt: "Two segments above a number line, from 0 to 0.6 and from 0.4 to 1, overlapping between 0.4 and 0.6."
is_not: [interval_partition]
why:
  interval_partition: >-
    The intervals $[0, 0.6]$ and $[0.4, 1]$ do not form a partition of $[0, 1]$, because they overlap.
    The pieces of a partition meet only at their cut points.
---
