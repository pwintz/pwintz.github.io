---
title: '$[0, 1] \cup [2, 3]$'
level: high-school
figure:
  widget: plane
  aspect: 4 / 1
  params:
    number_line: true
    x: [-0.5, 3.5]
    shapes:
      - { interval: [0, 1], ends: "[]" }
      - { interval: [2, 3], ends: "[]" }
  caption: |-
    The set $[0, 1] \cup [2, 3]$.
  alt: "A number line with the segments from 0 to 1 and from 2 to 3 highlighted, with a gap between them."
is_not: [
  connected,
  path_connected,
  simply_connected
]
why:
  connected: >-
    $[0, 1] \cup [2, 3]$ is not connected, because it has two components with a gap in between.
  simply_connected: >-
    $[0, 1] \cup [2, 3]$ is not simply connected, because it is not connected.
  path_connected: >-
    $[0, 1] \cup [2, 3]$ is not path-connected, because it is not connected.
---
