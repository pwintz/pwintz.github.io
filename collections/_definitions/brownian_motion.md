---
published: false
title: Brownian motion
term: Brownian motion
applies_to: random processes
synonyms: [Wiener process, '$W_t$']
levels:
  undergraduate:
    context: probability
    text: |-
      A _Brownian motion_ is a random function $t \mapsto W_t$ of time, starting at $W_0 = 0$, such that

      1. $W$ is [continuous](/definitions/continuous),
      2. its increments over disjoint time intervals are independent, and
      3. each increment $W_t - W_s$, for $s < t$, is normally distributed with mean $0$ and [variance](/definitions/variance) $t - s$.
properties:
  - >-
    Brownian motion is [continuous](/definitions/continuous) but nowhere [differentiable](/definitions/differentiable), and its total variation on every interval is infinite.
---
