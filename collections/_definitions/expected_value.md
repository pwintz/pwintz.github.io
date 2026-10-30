---
published: false
title: Expected value
term: expected value
applies_to: random variables
synonyms: [expectation, "$\\mathbb{E}[X]$", population mean]
levels:
  high-school:
    text: |-
      The _expected value_ of a random quantity is its long-run average: the average of its possible values, weighted by how likely each one is.
  undergraduate:
    context: probability
    text: |-
      The _expected value_ of a random variable $X$ is $\mathbb{E}[X] = \sum_x x P(X = x)$ (discrete) or $\int x f(x) \mathrm{d}x$ (with density $f$). It is a [weighted average](/definitions/weighted-average) of the possible values, weighted by their probabilities.
properties:
  - >-
    By the law of large numbers, the mean of many independent samples approaches the expected value.
  - >-
    Expected value is linear: $\mathbb{E}[a X + b Y] = a \mathbb{E}[X] + b \mathbb{E}[Y]$.
---
The expected value is a property of a probability distribution, while the mean of a data set is a property of the data.
