---
title: Prior
term: prior
applies_to: Bayesian inference
synonyms: [prior distribution, a priori distribution, prior probability, a priori probability]
levels:
  high-school:
    text: |-
      Consider an unknown quantity, such as the chance that a coin lands heads.
      The _prior_ is a description of what you believe about the quantity _before_ you see the data, given by a probability for each possible value.
      In the case of the coin, you may have a prior belief that the coin is fair: It lands on heads 50% of the time. 
  undergraduate:
    context: Bayesian inference
    text: |-
      Consider a statistical model $p(x \mid \theta)$ of data $x$ for each value of a parameter $\theta$.
      A _prior_ is a [probability distribution](/definitions/probability-distribution) $p(\theta)$ on the parameter that is chosen before the data are observed.
properties:
  - >-
    "A priori" is Latin for "from the earlier," and "a posteriori" is Latin for "from the later."
  - >-
    In a [Kalman filter](/definitions/kalman-filter), the _a priori_ estimate is the prediction before the measurement update, and the _a posteriori_ estimate is the estimate after it.
---
