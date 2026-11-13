---
title: Statistical moment
term: statistical moment
applies_to: random variables
synonyms: [moment]
levels:
  high-school:
    text: |-
      Consider a random quantity $X$.
      The _moments_ of $X$ are the long-run averages of the powers of $X$: the first moment is the average of $X$, the second moment is the average of $X^2$, the third moment is the average of $X^3$, and so on.
  undergraduate:
    context: probability
    text: |-
      Consider a [random variable](/dictionary/definitions/random-variable) $X$ and a positive [integer](/dictionary/definitions/integer) $k$.
      The $k$th _moment_ of $X$ is the [expected value](/dictionary/definitions/expected-value)

      $$\mathbb{E}[X^k].$$
properties:
  - >-
    The first moment of a [random variable](/dictionary/definitions/random-variable) is the mean of the random variable.
  - >-
    The second [central moment](/dictionary/definitions/central-moment) of a [random variable](/dictionary/definitions/random-variable) is the [variance](/dictionary/definitions/variance) of the random variable.
  - >-
    The [variance](/dictionary/definitions/variance) is the second moment minus the square of the first moment: $\operatorname{Var}(X) = \mathbb{E}[X^2] - (\mathbb{E}[X])^2$.
  - >-
    The third and fourth [central moments](/dictionary/definitions/central-moment), divided by $\sigma^3$ and $\sigma^4$, where $\sigma$ is the [standard deviation](/dictionary/definitions/standard-deviation), are the skewness and the kurtosis.
---
The name comes from physics: the first moment of a mass distribution locates the center of mass, and the second moment is the moment of inertia.

The moments of a data set $x_1, \dots, x_n$, called sample moments, are the averages $(x_1^k + \dots + x_n^k) / n$.
