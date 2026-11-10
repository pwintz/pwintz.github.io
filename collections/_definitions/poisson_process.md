---
published: false
title: Poisson process
term: Poisson process
applies_to: random processes
levels:
  high-school:
    text: |-
      Consider events that happen independently of each other at a constant average rate $\lambda$.
      The _Poisson process_ of the events is the count $N_t$ of the events that have happened up to time $t$.
  undergraduate:
    context: probability
    text: |-
      A _Poisson process_ with rate $\lambda > 0$ is a [stochastic process](/definitions/stochastic-process) $(N_t)_{t \geq 0}$ with $N_0 = 0$ such that

      1. the increments $N_t - N_s$ over disjoint time intervals $(s, t]$ are independent, and
      2. for $s < t$, the increment $N_t - N_s$ has a [Poisson distribution](/definitions/poisson-distribution) with mean $\lambda (t - s)$.
properties:
  - >-
    The times between consecutive events of a Poisson process are independent and have an [exponential distribution](/definitions/exponential-distribution) with rate $\lambda$.
  - >-
    The sample paths of a Poisson process are step functions that jump up by $1$ at each event.
---
