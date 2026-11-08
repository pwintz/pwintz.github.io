---
published: false
title: 'Seven heads in ten flips of a coin with unknown probability $\theta$ of heads, starting from a uniform prior on $\theta$'
level: undergraduate
values:
  prior: '$p(\theta) = 1$ for $\theta \in [0, 1]$'
  posterior: '$p(\theta \mid x) = 1320 \, \theta^7 (1 - \theta)^3$, the Beta(8, 4) density'
why:
  prior: >-
    In the seven-heads example, the uniform prior treats every value of $\theta$ in $[0, 1]$ as equally plausible before the flips.
  posterior: >-
    In the seven-heads example, the posterior is the likelihood $\binom{10}{7} \theta^7 (1 - \theta)^3$ times the uniform prior, scaled to integrate to $1$; it is largest at $\theta = 0.7$.
---
