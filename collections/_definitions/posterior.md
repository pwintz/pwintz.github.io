---
title: Posterior
term: posterior
applies_to: Bayesian inference
synonyms: [posterior distribution, a posteriori distribution, posterior probability, a posteriori probability]
levels:
  high-school:
    text: |-
      Consider an unknown quantity, such as the chance that a coin lands heads, and a [prior](/dictionary/definitions/prior) belief about the quantity.
      The _posterior_ is a description of what you believe about the quantity _after_ you see the data, found by updating the prior with the data.
      In the case of the coin, you may have a prior belief that the coin is fair: It lands on heads 50% of the time. But if you flip the coin 1000 times and it comes up heads 900 times, your posterior belief may become that the probability of the coin landing on heads is around 90%.
  undergraduate:
    context: Bayesian inference
    text: |-
      Consider a statistical model $p(x \mid \theta)$ with parameter $\theta$, a [prior](/dictionary/definitions/prior) $p(\theta)$, and observed data $x$.
      The _posterior_ is the conditional [probability distribution](/dictionary/definitions/probability-distribution) of the parameter given the data, which is given by Bayes' rule:

      $$p(\theta \mid x) = \frac{p(x \mid \theta) \, p(\theta)}{p(x)}.$$
properties:
  - >-
    The posterior is proportional to the [likelihood](/dictionary/definitions/likelihood) times the prior: $p(\theta \mid x) \propto L(\theta) \, p(\theta)$.
  - >-
    The maximum a posteriori (MAP) estimate of $\theta$ is the value that maximizes $p(\theta \mid x)$.
    If the prior is uniform, then the MAP estimate equals the maximum likelihood estimate.
---
