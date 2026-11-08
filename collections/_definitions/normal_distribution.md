---
title: Normal distribution
term: normal distribution
applies_to: random variables
synonyms: [Gaussian distribution, bell curve]
levels:
  high-school:
    text: |-
      A [random variable](/definitions/random-variable) has a _normal distribution_ if its values cluster symmetrically around a [mean](/definitions/expected-value) $\mu$, following a bell-shaped curve whose width is set by the [standard deviation](/definitions/standard-deviation) $\sigma$.
  undergraduate:
    text: |-
      A [random variable](/definitions/random-variable) $X$ has a _normal distribution_ with [mean](/definitions/expected-value) $\mu$ and [variance](/definitions/variance) $\sigma^2 > 0$, written $X \sim \mathcal{N}(\mu, \sigma^2)$, if $X$ has the [probability density](/definitions/probability-density)

      $$f(x) = \frac{1}{\sqrt{2 \pi \sigma^2}} \exp\left(-\frac{(x - \mu)^2}{2 \sigma^2}\right).$$
properties:
  - >-
    By the central limit theorem, the sum of many independent random variables with finite variance is approximately normal, which is why measurement errors are often modeled as normal.
  - >-
    About $68\%$ of the probability of a normal distribution lies within one standard deviation of the mean, and about $95\%$ lies within two.
---
