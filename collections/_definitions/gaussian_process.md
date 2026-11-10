---
published: false
title: Gaussian process
term: Gaussian process
applies_to: random processes
levels:
  undergraduate:
    context: probability
    text: |-
      A _Gaussian process_ is a [stochastic process](/definitions/stochastic-process) $(X_t)_{t \in T}$ such that, for every finite list of times $t_1, \dots, t_n$ in $T$, the random vector

      $$(X_{t_1}, \dots, X_{t_n})$$

      has a multivariate [normal distribution](/definitions/normal-distribution).
properties:
  - >-
    A Gaussian process is determined by the mean function $m(t) = \mathbb{E}[X_t]$ and the [covariance](/definitions/covariance) function $k(s, t) = \operatorname{Cov}(X_s, X_t)$.
  - >-
    Every value $X_t$ of a Gaussian process has a [normal distribution](/definitions/normal-distribution).
---
In machine learning, Gaussian processes are used as [prior distributions](/definitions/prior) over unknown functions, and "Gaussian process regression" computes the [posterior distribution](/definitions/posterior) of the function after observing some of the function's values.
