---
published: false
title: Sample variance
term: sample variance
applies_to: data sampled from a population
synonyms: [unbiased sample variance]
levels:
  high-school:
    text: |-
      Consider data $x_1, \dots, x_n$ that are a random sample from a larger population, with sample [mean](/definitions/arithmetic-mean) $\bar{x}$.
      The _sample variance_ of the data is the sum of the squared distances from the mean divided by $n - 1$:

      $$s^2 = \frac{1}{n - 1} \sum_{i = 1}^{n} (x_i - \bar{x})^2.$$

      The sample variance estimates the [variance](/definitions/variance) of the whole population.
  undergraduate:
    context: statistics
    text: |-
      Consider independent [random variables](/definitions/random-variable) $X_1, \dots, X_n$ that have the same distribution, with sample mean $\bar{X} = \frac{1}{n} \sum_{i = 1}^{n} X_i$, such that $n \geq 2$.
      The _sample variance_ is the random variable

      $$S^2 = \frac{1}{n - 1} \sum_{i = 1}^{n} (X_i - \bar{X})^2.$$
properties:
  - >-
    The sample variance is an unbiased estimator of the variance $\sigma^2$ of each $X_i$: $\mathbb{E}[S^2] = \sigma^2$.
  - >-
    The data are closer, on average, to their own sample mean $\bar{x}$ than to the population mean $\mu$, because $\bar{x}$ is the number that minimizes the sum of squared distances to the data.
    Dividing by $n$ would therefore underestimate the variance on average, and dividing by $n - 1$ instead (Bessel's correction) exactly compensates.
  - >-
    The sample variance of a single data point is undefined, because one data point carries no information about the spread of the population.
---
