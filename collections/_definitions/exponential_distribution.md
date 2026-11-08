---
title: Exponential distribution
term: exponential distribution
applies_to: random variables
levels:
  undergraduate:
    text: |-
      Consider events that happen independently of each other at an average rate of $\lambda$ per unit of time, such as customers arriving at a shop.
      The waiting time $T$ until the first event has an _exponential distribution_ with rate $\lambda$, which has the [probability density](/definitions/probability-density)

      $$f(t) = \lambda e^{-\lambda t} \quad \text{for } t \geq 0.$$
properties:
  - >-
    An exponential random variable with rate $\lambda$ has [mean](/definitions/expected-value) $1 / \lambda$ and satisfies $P(T > t) = e^{-\lambda t}$.
  - >-
    The exponential distribution is memoryless: $P(T > s + t \mid T > s) = P(T > t)$.
    The exponential distribution is the continuous counterpart of the [geometric distribution](/definitions/geometric-distribution).
---
