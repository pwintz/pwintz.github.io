---
published: false
title: Mixed distribution
term: mixed distribution
applies_to: probability distributions
levels:
  high-school:
    text: |-
      Consider a [random variable](/definitions/random-variable) $X$.
      The [distribution](/definitions/probability-distribution) of $X$ is _mixed_ if some single values of $X$ have positive [probability](/definitions/probability) and the rest of the probability is spread over a range of values by a [probability density](/definitions/probability-density).
  undergraduate:
    context: measure-theoretic probability
    text: |-
      Consider a [random variable](/definitions/random-variable) $X$.
      The [distribution](/definitions/probability-distribution) $\mu_X$ of $X$ is _mixed_ if there are a number $\lambda \in (0, 1)$, a [discrete distribution](/definitions/discrete-distribution) $\mu_d$, and a [continuous distribution](/definitions/continuous-distribution) $\mu_c$ such that

      $$\mu_X = \lambda \, \mu_d + (1 - \lambda) \, \mu_c.$$
properties:
  - >-
    The [cumulative distribution function](/definitions/cumulative-distribution-function) of a mixed distribution has jumps, like a staircase, and also rises continuously between the jumps.
---
