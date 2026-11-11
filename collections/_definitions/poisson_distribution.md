---
title: Poisson distribution
term: Poisson distribution
applies_to: random variables
levels:
  high-school:
    text: |-
      Consider events that happen independently of each other at an average rate of $\lambda$ per unit of time, such as customers arriving at a shop.
      The number $X$ of events in one unit of time has a _Poisson distribution_ with [mean](/dictionary/definitions/expected-value) $\lambda$:

      $$P(X = k) = \frac{\lambda^k e^{-\lambda}}{k!} \quad \text{for } k = 0, 1, 2, \dots.$$
properties:
  - >-
    A Poisson random variable with mean $\lambda$ also has [variance](/dictionary/definitions/variance) $\lambda$.
  - >-
    The Poisson distribution is the limit of the [binomial distribution](/dictionary/definitions/binomial-distribution) with parameters $n$ and $\lambda / n$ as $n \to \infty$.
---
