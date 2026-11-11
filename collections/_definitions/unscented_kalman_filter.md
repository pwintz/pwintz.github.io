---
title: Unscented Kalman filter
term: unscented Kalman filter
applies_to: state estimation
synonyms: [UKF]
levels:
  high-school:
    text: |-
      An _unscented Kalman filter_ is a version of the [Kalman filter](/dictionary/definitions/kalman-filter) for systems that are not linear.
      Instead of approximating the system by a linear one, it represents the current estimate and its uncertainty by a few carefully chosen sample points, passes each point through the system's model, and computes the new estimate and uncertainty from the results.
  graduate:
    context: "discrete-time nonlinear systems with noise"
    text: |-
      Consider a discrete-time system with state $x_k \in \reals^n$, input $u_k$, and measured output $y_k$, given by

      $$x_{k+1} = f(x_k, u_k) + w_k, \qquad y_k = h(x_k) + v_k,$$

      where the noises $w_k$ and $v_k$ are independent, zero-mean, and white, with covariances $Q$ and $R$.
      The _unscented Kalman filter_ for this system is the [filter](/dictionary/definitions/filter-estimation) that alternates prediction and correction steps like the [Kalman filter](/dictionary/definitions/kalman-filter), but computes each mean and covariance by the _unscented transform_.
      To pass a mean $\hat{x}$ and covariance $P$ through a function $g$, the unscented [transform](/dictionary/definitions/transform) chooses $2 n + 1$ points, called _sigma points_, whose [weighted mean](/dictionary/definitions/weighted-average) is $\hat{x}$ and whose weighted covariance is $P$, applies $g$ to each point, and returns the weighted mean and covariance of the results.
properties:
  - >-
    The unscented Kalman filter does not need the [Jacobians](/dictionary/definitions/jacobian) of $f$ and $h$, unlike the [extended Kalman filter](/dictionary/definitions/extended-kalman-filter).
  - >-
    The unscented [transform](/dictionary/definitions/transform) computes the mean and covariance of $g(x)$ correctly to second order in the Taylor expansion of $g$, whereas the linearization in the [extended Kalman filter](/dictionary/definitions/extended-kalman-filter) is correct only to first order.
  - >-
    If $f$ and $h$ are linear, then the unscented Kalman filter is the [Kalman filter](/dictionary/definitions/kalman-filter).
---
The sigma points are not random samples, unlike the particles of a [particle filter](/dictionary/definitions/particle-filter).
