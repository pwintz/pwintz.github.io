---
published: false
title: Probability distribution
term: probability distribution
applies_to: random variables
synonyms: [distribution, law]
levels:
  high-school:
    text: |-
      Consider a [random variable](/dictionary/definitions/random-variable) $X$.
      The _probability distribution_ of $X$ says how likely $X$ is to take each value or to land in each range of values.
  undergraduate:
    context: measure-theoretic probability
    text: |-
      Consider a [random variable](/dictionary/definitions/random-variable) $X$ on a probability space $(\Omega, \mathcal{F}, P)$.
      The _distribution_ of $X$ is the [probability measure](/dictionary/definitions/probability-measure) $\mu_X$ on $\reals$ given by

      $$\mu_X(B) = P(X \in B) \quad \text{for every Borel set } B \subseteq \reals.$$
properties:
  - >-
    A distribution can be described by its [cumulative distribution function](/dictionary/definitions/cumulative-distribution-function), and also by a [probability mass function](/dictionary/definitions/probability-mass-function) (for a discrete [random variable](/dictionary/definitions/random-variable)) or a [probability density](/dictionary/definitions/probability-density) (for a continuous one).
  - >-
    Different [random variables](/dictionary/definitions/random-variable) can have the same distribution: a fair coin flip and $1$ minus that flip both take the values $0$ and $1$ with [probability](/dictionary/definitions/probability) $\frac{1}{2}$.
---
