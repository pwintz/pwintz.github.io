---
published: false
title: Continuous distribution
term: continuous distribution
applies_to: probability distributions
synonyms: [absolutely continuous distribution, continuous random variable]
levels:
  high-school:
    text: |-
      Consider a [random variable](/definitions/random-variable) $X$.
      The [distribution](/definitions/probability-distribution) of $X$ is _continuous_ if the [probability](/definitions/probability) of $X$ landing in each range of values is the area under a curve, called the [probability density](/definitions/probability-density), over that range.
  undergraduate:
    context: measure-theoretic probability
    text: |-
      Consider a [random variable](/definitions/random-variable) $X$.
      The [distribution](/definitions/probability-distribution) of $X$ is _(absolutely) continuous_ if there is a [probability density](/definitions/probability-density) $f$ such that

      $$P(X \in B) = \int_B f(x) \, dx \quad \text{for every Borel set } B \subseteq \reals.$$
properties:
  - >-
    For a continuous distribution, every single value has probability $0$: $P(X = x) = 0$ for every $x$.
  - >-
    "Continuous" here is short for [absolutely continuous](/definitions/absolutely-continuous) with respect to [Lebesgue measure](/definitions/lebesgue-measure). A distribution whose [cumulative distribution function](/definitions/cumulative-distribution-function) is merely [continuous](/definitions/continuous) can be [singular](/definitions/singular-distribution) instead.
---
