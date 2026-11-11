---
published: false
title: Convergence in probability
term: convergence in probability
applies_to: sequences of random variables
levels:
  high-school:
    text: |-
      Consider a sequence of random quantities $X_1, X_2, \dots$ and another random quantity $X$.
      The sequence _converges in probability_ to $X$ if, as $n$ grows, it becomes more and more likely that $X_n$ is within every given distance of $X$.
  undergraduate:
    text: |-
      Consider a sequence of [random variables](/dictionary/definitions/random-variable) $X_n$ and a random variable $X$.
      The sequence _converges in probability_ to $X$ if, for every $\varepsilon > 0$,

      $$P(\abs{X_n - X} > \varepsilon) \to 0 \quad \text{as } n \to \infty.$$
properties:
  - |-
    Convergence in probability implies [convergence in distribution](/dictionary/definitions/convergence-in-distribution).
  - |-
    Almost sure convergence (convergence with [probability](/dictionary/definitions/probability) $1$) implies convergence in probability.
  - |-
    The weak law of large numbers says that the average of $n$ independent, identically distributed [random variables](/dictionary/definitions/random-variable) converges in probability to their [expected value](/dictionary/definitions/expected-value).
---
