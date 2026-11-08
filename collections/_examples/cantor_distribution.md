---
published: false
title: 'A random number $X = \sum_{k=1}^\infty 2 B_k 3^{-k}$, where $B_1, B_2, \dots$ are independent fair coin flips with values $0$ and $1$'
level: graduate
detail: |-
  The digits of $X$ in base $3$ are $0$ or $2$, so $X$ lies in [the Cantor set](/examples/the-cantor-set), and the [cumulative distribution function](/definitions/cumulative-distribution-function) of $X$ is [the Cantor function](/examples/the-cantor-function-on-0-1).
values:
  discrete_distribution: 'No'
  continuous_distribution: 'No'
  mixed_distribution: 'No'
  singular_distribution: 'Yes'
why:
  discrete_distribution: >-
    The Cantor distribution is not discrete, because each single value has probability $0$: pinning down $X$ exactly requires infinitely many coin flips to match.
  continuous_distribution: >-
    The Cantor distribution is not continuous, because it puts probability $1$ on the Cantor set, which has length $0$, and an integral of a density over a set of length $0$ is $0$.
  mixed_distribution: >-
    The Cantor distribution is not mixed, because no single value has positive probability.
  singular_distribution: >-
    The Cantor distribution is singular, because each single value has probability $0$ and the Cantor set, which has Lebesgue measure zero, has probability $1$.
---
