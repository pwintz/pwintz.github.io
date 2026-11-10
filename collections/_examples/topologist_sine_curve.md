---
published: false
title: 'The topologist''s sine curve'
detail: 'The graph of $\sin(1/x)$ for $0 < x \leq 1$, together with the segment from $(0, -1)$ to $(0, 1)$.'
level: graduate
is: [connected]
is_not: [
  path_connected,
  simply_connected
]
why:
  connected: >-
    The graph comes arbitrarily close to every point of the segment, so the two cannot be separated by open sets.
  path_connected: >-
    No path can travel from the segment to the graph, because the graph oscillates infinitely often near the segment.
  simply_connected: >-
    The topologist's sine curve is not path-connected, because no path can travel from the segment to the graph through the infinitely many oscillations, so it is not simply connected either.
---
