---
published: false
title: Singular distribution
term: singular distribution
applies_to: probability distributions
synonyms: [singular continuous distribution]
levels:
  graduate:
    context: measure-theoretic probability
    text: |-
      Consider a [random variable](/dictionary/definitions/random-variable) $X$.
      The [distribution](/dictionary/definitions/probability-distribution) of $X$ is _singular (continuous)_ if

      1. $P(X = x) = 0$ for every $x \in \reals$, and
      2. there is a set $S \subseteq \reals$ of [Lebesgue measure](/dictionary/definitions/lebesgue-measure) zero such that $P(X \in S) = 1$.
properties:
  - >-
    A singular distribution has a [continuous](/dictionary/definitions/continuous) [cumulative distribution function](/dictionary/definitions/cumulative-distribution-function), but it has neither a [probability mass function](/dictionary/definitions/probability-mass-function) nor a [probability density](/dictionary/definitions/probability-density).
  - >-
    By the Lebesgue decomposition, every distribution on $\reals$ is a mixture of a [discrete](/dictionary/definitions/discrete-distribution) part, a [continuous](/dictionary/definitions/continuous-distribution) part, and a singular part.
---
