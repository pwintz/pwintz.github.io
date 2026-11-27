---
title: 'The topologist''s sine curve'
detail: 'The graph of $\sin(1/x)$ for $0 < x \leq 1$, together with the segment from $(0, -1)$ to $(0, 1)$.'
level: graduate
figure:
  widget: function-plot
  params:
    x: [-0.15, 1.05]
    y: [-1.3, 1.3]
    curves:
      - { f: "sin(1/x)", from: 0.003, to: 1, samples: 20000, key: 'y = \sin(1/x), \ 0 < x \leq 1' }
    segments:
      - { from: [0, -1], to: [0, 1], color: 1, key: 'x = 0, \ -1 \leq y \leq 1' }
  caption: |-
    The graph of $\sin(1/x)$ for $0 < x \leq 1$ (blue) and the segment from $(0, -1)$ to $(0, 1)$ (orange).
    Point at a part to highlight it.
  alt: "A curve that oscillates faster and faster as it approaches the y-axis, next to a vertical segment on the y-axis."
is: [connected]
is_not: [
  path_connected,
  simply_connected
]
why:
  connected: >-
    The topologists sine curve is connected, because the graph comes arbitrarily close to every point of the segment, so the two cannot be separated by open sets.
  path_connected: >-
    The topologists sine curve is not path-connected, because no path can travel from the segment to the graph, which oscillates infinitely often near the segment.
  simply_connected: >-
    The topologists sine curve is not simply connected, because it is not path-connected.
---
