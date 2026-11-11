---
published: false
title: Covariance
term: covariance
applies_to: pairs of random variables
levels:
  high-school:
    text: |-
      Consider paired data $(x_1, y_1), \dots, (x_n, y_n)$ with [means](/dictionary/definitions/arithmetic-mean) $\bar{x}$ and $\bar{y}$.
      The _covariance_ of the data is the mean of the products of the deviations from the means:

      $$\operatorname{Cov} = \frac{1}{n} \sum_{i = 1}^{n} (x_i - \bar{x})(y_i - \bar{y}).$$

      The covariance is positive if $x$ and $y$ tend to be above their means together and below their means together, and the covariance is negative if one tends to be above its mean when the other is below.
  undergraduate:
    text: |-
      Consider [random variables](/dictionary/definitions/random-variable) $X$ and $Y$ with [expected values](/dictionary/definitions/expected-value) $\mu_X = \mathbb{E}[X]$ and $\mu_Y = \mathbb{E}[Y]$.
      The _covariance_ of $X$ and $Y$ is

      $$\operatorname{Cov}(X, Y) = \mathbb{E}[(X - \mu_X)(Y - \mu_Y)].$$
  graduate:
    text: |-
      Consider a random vector $X$ in $\reals^n$ with expected value $\mu = \mathbb{E}[X]$.
      The _covariance matrix_ of $X$ is the $n \times n$ matrix

      $$\Sigma = \mathbb{E}[(X - \mu)(X - \mu)^\top],$$

      whose $(i, j)$ entry is $\operatorname{Cov}(X_i, X_j)$.
properties:
  - >-
    The covariance of a random variable with itself is its [variance](/dictionary/definitions/variance): $\operatorname{Cov}(X, X) = \operatorname{Var}(X)$.
  - >-
    If $X$ and $Y$ are independent, then $\operatorname{Cov}(X, Y) = 0$, but the converse is false: if $X$ is uniform on $[-1, 1]$ and $Y = X^2$, then $\operatorname{Cov}(X, Y) = 0$, although $Y$ is determined by $X$.
  - >-
    Dividing the covariance by the product of the [standard deviations](/dictionary/definitions/standard-deviation) gives the correlation coefficient, which lies in $[-1, 1]$ and does not depend on the units of $X$ and $Y$.
  - >-
    A covariance matrix is symmetric and [positive semidefinite](/dictionary/definitions/positive-semidefinite-matrix).
---
