---
title: '$0 < 0.5 < 1$, for the interval $[0, 1]$'
level: high-school
# figure:
#   widget: plane
#   aspect: 4 / 1
#   params:
#     number_line: true
#     x: [-0.5, 1.5]
#     shapes:
#       - { interval: [0, 1], ends: "  " }
#       - { point: [0, 0], color: 1 }
#       - { point: [0.5, 0], color: 1 }
#       - { point: [1, 0], color: 1 }
#   caption: |-
#     The interval $[0, 1]$, with the points $0$, $0.5$, and $1$ (orange).
#   alt: "A number line with the segment from 0 to 1 highlighted and dots at 0, 0.5, and 1."
is: [interval_partition]
is_not: [set_partition]
why:
  set_partition: >-
    The subintervals $[0, 0.5]$ and $[0.5, 1]$ do not form a set partition of $[0, 1]$, because they share the point $0.5$.
  interval_partition: >-
    The points $0 < 0.5 < 1$ give an interval partition of $[0, 1]$ into the subintervals $[0, 0.5]$ and $[0.5, 1]$.
---
