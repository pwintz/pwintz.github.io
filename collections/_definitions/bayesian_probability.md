---
published: false
title: Bayesian probability
term: Bayesian probability
applies_to: interpretations of probability
synonyms: [Bayesianism, Bayesian]
levels:
  high-school:
    text: |-
      In the _Bayesian_ interpretation, the [probability](/definitions/probability) of a statement is a degree of belief that the statement is true, which is updated as new data arrive.
  undergraduate:
    context: statistics
    text: |-
      In the _Bayesian_ interpretation, a [probability](/definitions/probability) is a degree of belief, so an unknown parameter $\theta$ is a random quantity with a [prior](/definitions/prior) distribution $p(\theta)$.
      Observing data $x$ updates the prior to the [posterior](/definitions/posterior) $p(\theta \mid x)$ by _Bayes' rule_, which multiplies the prior by the [likelihood](/definitions/likelihood) $p(x \mid \theta)$ of the data and divides by the total probability $p(x)$ of the data so that the posterior adds up (or integrates) to $1$:

      $$p(\theta \mid x) = \frac{p(x \mid \theta) \, p(\theta)}{p(x)}.$$

      In words, values of $\theta$ that make the observed data more probable become more plausible after the data are observed.
properties:
  - >-
    Bayesian statistics describes uncertainty about $\theta$ by the posterior, for example by credible intervals.
---
