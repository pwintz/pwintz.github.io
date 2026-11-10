---
published: false
title: Maximum likelihood estimator
term: maximum likelihood estimator
applies_to: statistical models
synonyms: [MLE, maximum likelihood estimate]
levels:
  high-school:
    text: |-
      Consider data and a model of how the data came about, where the model has an unknown parameter.
      The _maximum likelihood estimate_ of the parameter is the value of the parameter that makes the observed data most probable.
  undergraduate:
    context: statistics
    text: |-
      Consider a statistical model that gives a [probability](/definitions/probability) (or [probability density](/definitions/probability-density)) $p(x \mid \theta)$ of data $x$ for each value of a parameter $\theta$.
      The _maximum likelihood estimator_ of $\theta$ is the [estimator](/definitions/estimator) that maps the observed data $x$ to the value of $\theta$ that maximizes the [likelihood](/definitions/likelihood) $L(\theta) = p(x \mid \theta)$:

      $$\hat{\theta}(x) = \arg\max_{\theta} \, p(x \mid \theta).$$
properties:
  - >-
    The logarithm is increasing, so the maximum likelihood estimate also maximizes the log-likelihood $\ln L(\theta)$, which is often easier to compute.
  - >-
    For independent data that are normally distributed with unknown mean and [variance](/definitions/variance), the maximum likelihood estimate of the mean is the sample mean, and the maximum likelihood estimate of the variance divides by $n$ instead of $n - 1$, so the estimate is biased.
  - >-
    Least squares fitting, as in [linear regression](/definitions/linear-regression), gives the maximum likelihood estimate when the errors are independent and normally distributed with equal [variances](/definitions/variance).
  - >-
    Under mild conditions, the maximum likelihood estimator converges to the true parameter as the amount of data grows, and its error is approximately normally distributed.
---
The _estimator_ is the rule $x \mapsto \hat{\theta}(x)$, and the _estimate_ is the number $\hat{\theta}(x)$ that the rule gives for the observed data.
