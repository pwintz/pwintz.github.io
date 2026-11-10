---
published: false
title: 'The Cantor function on $[0, 1]$'
level: undergraduate
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
    The Cantor function is Hölder continuous with $\alpha = \log 2 / \log 3$, and so it is uniformly continuous.
  continuous: >-
    The Cantor function is continuous, and uniformly continuous because $[0, 1]$ is compact.
---
