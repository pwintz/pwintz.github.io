---
published: false
title: Expected value
term: expected value
applies_to: random variables
synonyms: [expectation, "$\\mathbb{E}[X]$", population mean]
levels:
  high-school:
    text: |-
      Consider a random quantity with several possible values, each with a [probability](/dictionary/definitions/probability).
      The _expected value_ of the quantity is its long-run average: the average of its possible values, weighted by how likely each one is.
  undergraduate:
    context: probability
    text: |-
      Consider a [random variable](/dictionary/definitions/random-variable) $X$, either discrete or with a density $f$.
      The _expected value_ of $X$ is

      $$\mathbb{E}[X] = \sum_x x P(X = x) \quad \text{(discrete)} \qquad \text{or} \qquad \mathbb{E}[X] = \int x f(x) \mathrm{d}x \quad \text{(with density } f\text{)}.$$

      It is a [weighted average](/dictionary/definitions/weighted-average) of the possible values, weighted by their probabilities.
properties:
  - >-
    By the law of large numbers, the mean of many independent samples approaches the expected value.
  - >-
    Expected value is linear: $\mathbb{E}[a X + b Y] = a \mathbb{E}[X] + b \mathbb{E}[Y]$.
---
The expected value is a property of a [probability distribution](/dictionary/definitions/probability-distribution), while the mean of a data set is a property of the data.
