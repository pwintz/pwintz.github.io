---
title: Binomial distribution
term: binomial distribution
applies_to: discrete random variables
levels:
  high-school:
    text: |-
      Consider $n$ independent trials, each of which succeeds with [probability](/definitions/probability) $p$.
      The number $X$ of successes has a _binomial distribution_ with parameters $n$ and $p$:

      $$P(X = k) = \binom{n}{k} p^k (1 - p)^{n - k} \quad \text{for } k = 0, 1, \dots, n.$$
properties:
  - >-
    A binomial random variable is the sum of $n$ independent [Bernoulli](/definitions/bernoulli-distribution) random variables, so it has [mean](/definitions/expected-value) $n p$ and [variance](/definitions/variance) $n p (1 - p)$.
  - >-
    For large $n$, the binomial distribution is approximately [normal](/definitions/normal-distribution), and for large $n$ and small $p$, the binomial distribution is approximately [Poisson](/definitions/poisson-distribution) with mean $n p$.
---
