---
published: false
title: Convergence in probability
term: convergence in probability
applies_to: sequences of random variables
levels:
  high-school:
    text: |-
      Consider a sequence of random quantities $X_1, X_2, \dots$ and another random quantity $X$.
      The sequence _converges in probability_ to $X$ if, as $n$ grows, it becomes more and more likely that $X_n$ is within any given distance of $X$.
  undergraduate:
    text: |-
      Consider a sequence of [random variables](/definitions/random-variable) $X_n$ and a random variable $X$.
      The sequence _converges in probability_ to $X$ if, for every $\varepsilon > 0$,

      $$P(\abs{X_n - X} > \varepsilon) \to 0 \quad \text{as } n \to \infty.$$
properties:
  - |-
    Convergence in probability implies [convergence in distribution](/definitions/convergence-in-distribution).
  - |-
    Almost sure convergence (convergence with probability $1$) implies convergence in probability.
  - |-
    The weak law of large numbers says that the average of $n$ independent, identically distributed [random variables](/definitions/random-variable) converges in probability to their [expected value](/definitions/expected-value).
---
