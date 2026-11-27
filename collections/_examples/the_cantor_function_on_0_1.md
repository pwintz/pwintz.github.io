---
title: 'The Cantor function on $[0, 1]$'
# TODO: Add details.
level: undergraduate
figure:
  widget: function-plot
  params:
    x: [-0.1, 1.1]
    y: [-0.1, 1.1]
    curves:
      - {"f": "cantor(x)", "samples": 4000, "from": 0, "to": 1, "ends": "[]"}
  caption: |-
    The graph of the Cantor function.
  alt: "A staircase-like curve from the origin to (1, 1) with infinitely many flat steps, the biggest at height 1/2 over the middle third."
is: [
  Holder_continuous,
  uniformly_continuous,
  continuous
]
is_not: [
  Lipschitz_continuous,
  absolutely_continuous,
  continuously_differentiable
]
why:
  Lipschitz_continuous: >-
    The Cantor function is not Lipschitz continuous, because it rises by $2^{-n}$ over intervals of length $3^{-n}$, so its slopes are unbounded.
  uniformly_continuous: >-
    The Cantor function is uniformly continuous because it is continuous on the compact interval $[0, 1]$.
  absolutely_continuous: >-
    The Cantor function is not absolutely continuous: it rises from $0$ to $1$, but its derivative is $0$ almost everywhere, so it is not the integral of its derivative.
  Holder_continuous: >-
    The Cantor function is Hölder continuous with $\alpha = \log 2 / \log 3$, because it rises by at most $2^{-n}$ over each interval of length $3^{-n}$.
  continuous: >-
    The Cantor function is continuous, because it is nondecreasing and takes every value in $[0, 1]$, so it has no jumps.
---
