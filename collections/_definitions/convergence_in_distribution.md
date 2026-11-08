---
published: false
title: Convergence in distribution
term: convergence in distribution
applies_to: sequences of random variables
synonyms: [weak convergence, convergence in law]
levels:
  high-school:
    text: |-
      Consider a sequence of random quantities, each with its own probabilities for its possible values.
      The sequence _converges in distribution_ if those probabilities approach a fixed pattern (a distribution), even if the quantities themselves do not settle down.
  undergraduate:
    text: |-
      Consider a sequence of [random variables](/definitions/random-variable) $X_n$ and a random variable $X$, whose cumulative distribution function is $x \mapsto P(X \leq x)$.
      The sequence $X_n$ _converges in distribution_ to $X$ if

      $$P(X_n \leq x) \to P(X \leq x) \quad \text{as } n \to \infty$$

      for every $x$ at which that function is [continuous](/definitions/continuous).
properties:
  - |-
    Convergence in distribution depends only on the distributions of the $X_n$, not on their values.
    The $X_n$ need not even be defined on the same probability space.
  - |-
    [Convergence in probability](/definitions/convergence-in-probability) implies convergence in distribution.
    The converse holds when the limit $X$ is a constant.
  - |-
    The central limit theorem is a statement about convergence in distribution.
---
