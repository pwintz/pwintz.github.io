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
      Consider a [random variable](/definitions/random-variable) $X$.
      The [distribution](/definitions/probability-distribution) of $X$ is _singular (continuous)_ if

      1. $P(X = x) = 0$ for every $x \in \reals$, and
      2. there is a set $S \subseteq \reals$ of [Lebesgue measure](/definitions/lebesgue-measure) zero such that $P(X \in S) = 1$.
properties:
  - >-
    A singular distribution has a [continuous](/definitions/continuous) [cumulative distribution function](/definitions/cumulative-distribution-function), but it has neither a [probability mass function](/definitions/probability-mass-function) nor a [probability density](/definitions/probability-density).
  - >-
    By the Lebesgue decomposition, every distribution on $\reals$ is a mixture of a [discrete](/definitions/discrete-distribution) part, a [continuous](/definitions/continuous-distribution) part, and a singular part.
---
