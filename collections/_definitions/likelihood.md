---
published: false
title: Likelihood
term: likelihood
applies_to: statistical models
synonyms: [likelihood function]
levels:
  undergraduate:
    context: statistics
    text: |-
      Consider a statistical model that gives a [probability](/definitions/probability) (or [probability density](/definitions/probability-density)) $p(x \mid \theta)$ of data $x$ for each value of a parameter $\theta$, and observed data $x$.
      The _likelihood_ of $\theta$ is the probability of the observed data, viewed as a function of the parameter:

      $$L(\theta) = p(x \mid \theta).$$
properties:
  - >-
    A likelihood is not a [probability distribution](/definitions/probability-distribution) over $\theta$: its values need not add up (or integrate) to $1$ over $\theta$.
  - >-
    The maximum likelihood estimate of $\theta$ is the value that maximizes $L(\theta)$.
---
