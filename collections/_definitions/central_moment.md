---
published: false
title: Central moment
term: central moment
applies_to: random variables
synonyms: [moment about the mean]
levels:
  high-school:
    text: |-
      Consider a random quantity $X$ with average $\mu$.
      The _central moments_ of $X$ are the long-run averages of the powers of the deviation $X - \mu$: the second central moment is the average of $(X - \mu)^2$, the third central moment is the average of $(X - \mu)^3$, and so on.
  undergraduate:
    context: probability
    text: |-
      Consider a [random variable](/dictionary/definitions/random-variable) $X$ with mean $\mu = \mathbb{E}[X]$, and a positive [integer](/dictionary/definitions/integer) $k$.
      The $k$th _central moment_ of $X$ is the [expected value](/dictionary/definitions/expected-value)

      $$\mathbb{E}\bigl[(X - \mu)^k\bigr].$$
properties:
  - >-
    The first central moment of every [random variable](/dictionary/definitions/random-variable) with a mean is $0$.
  - >-
    The second central moment of a [random variable](/dictionary/definitions/random-variable) is its [variance](/dictionary/definitions/variance).
  - >-
    Central moments do not change when a constant is added to $X$: $X + c$ has the same central moments as $X$.
  - >-
    Central moments can be computed from moments, such as $\mathbb{E}[(X - \mu)^2] = \mathbb{E}[X^2] - \mu^2$.
---
The third and fourth central moments, divided by $\sigma^3$ and $\sigma^4$, where $\sigma$ is the [standard deviation](/dictionary/definitions/standard-deviation), are the skewness and the kurtosis.
