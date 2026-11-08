---
title: Geometric distribution
term: geometric distribution
applies_to: random variables
levels:
  high-school:
    text: |-
      Consider a sequence of independent trials, each of which succeeds with [probability](/definitions/probability) $p$.
      The number $N$ of trials up to and including the first success has a _geometric distribution_ with parameter $p$:

      $$P(N = k) = (1 - p)^{k - 1} p \quad \text{for } k = 1, 2, 3, \dots.$$
properties:
  - >-
    A geometric random variable with parameter $p$ has [mean](/definitions/expected-value) $1 / p$.
  - >-
    Some authors instead count the failures before the first success, which takes values $0, 1, 2, \dots$ and has mean $(1 - p) / p$.
  - >-
    The geometric distribution is memoryless: $P(N > j + k \mid N > j) = P(N > k)$.
  - >-
    The geometric distribution is the discrete counterpart of the [exponential distribution](/definitions/exponential-distribution).

---
