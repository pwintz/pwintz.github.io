---
published: false
title: '$[-1, 1]$, for $\dot{x} = x + u$ with $\abs{u} \leq 1$ and constraint set $K = [-2, 2]$'
level: graduate
is: [viability_kernel]
is_not: [forward_invariant]
why:
  viability_kernel: >-
    $[-1, 1]$ is the viability kernel of $K$ because, for $\abs{x} \leq 1$, the input $u = -x$ holds the state still, and for $1 < \abs{x} \leq 2$, every allowed input pushes the state out of $K$.
  forward_invariant: >-
    $[-1, 1]$ is not forward invariant for every input, because from $x = 1$, the input $u = 1$ pushes the state out.
---
