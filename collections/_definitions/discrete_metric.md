---
title: Discrete metric
term: discrete metric
applies_to: points
synonyms: []
levels:
  undergraduate:
    text: |-
      Consider a set $X$.
      The _discrete metric_ on $X$ is the [metric](/definitions/metric) $d$ such that $d(p, q) = 1$ for $p \neq q$ and $d(p, p) = 0$.
properties:
  - >-
    The discrete metric does not come from a [norm](/definitions/norm), even on $\reals^n$, because $d(2p, 0) = 1 = d(p, 0)$ for every $p \neq 0$, so it does not scale.
  - >-
    In the discrete metric, every set is open, and a sequence converges only if it is eventually constant.
---
