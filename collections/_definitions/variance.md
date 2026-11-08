---
published: false
title: Variance
term: variance
applies_to: random variables and data
levels:
  high-school:
    text: |-
      Consider data $x_1, \dots, x_n$ with [mean](/definitions/arithmetic-mean) $\bar{x}$.
      The _variance_ of the data is the mean of the squared distances from the mean:

      $$\operatorname{Var} = \frac{1}{n} \sum_{i = 1}^{n} (x_i - \bar{x})^2.$$
  undergraduate:
    text: |-
      Consider a [random variable](/definitions/random-variable) $X$ with [expected value](/definitions/expected-value) $\mu = \mathbb{E}[X]$.
      The _variance_ of $X$ is

      $$\operatorname{Var}(X) = \mathbb{E}[(X - \mu)^2].$$
properties:
  - >-
    The variance is in squared units: if $X$ is in meters, $\operatorname{Var}(X)$ is in square meters.
  - >-
    The _sample variance_ of data, used to estimate the variance of a population, divides by $n - 1$ instead of $n$.
---
