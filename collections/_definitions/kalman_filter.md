---
title: Kalman filter
term: Kalman filter
applies_to: state estimation
levels:
  high-school:
    text: |-
      A _Kalman filter_ is a method for estimating a changing quantity, such as the position of a car, from noisy measurements made over time.
      At each step, it predicts the quantity from a model of how the quantity changes, then corrects the prediction toward the new measurement, trusting whichever of the two is less uncertain more.
  undergraduate:
    context: "discrete-time linear systems with Gaussian noise"
    text: |-
      Consider a discrete-time [linear system](/definitions/linear-system) with state $x_k$, input $u_k$, and measured output $y_k$, given by

      $$x_{k+1} = A x_k + B u_k + w_k, \qquad y_k = C x_k + v_k,$$

      where the process noise $w_k$ and the [measurement noise](/definitions/measurement-noise) $v_k$ are independent, zero-mean, Gaussian, and white, with covariances $Q$ and $R$, and the initial state $x_0$ has mean $\hat{x}_0$ and covariance $P_0$.
      The _Kalman filter_ for this system is the [filter](/definitions/filter-estimation) that computes a state estimate $\hat{x}_k$ and its error covariance $P_k$ by repeating two steps.
      First, it predicts

      $$\hat{x}_k^- = A \hat{x}_{k-1} + B u_{k-1}, \qquad P_k^- = A P_{k-1} A^\top + Q.$$

      Then, it corrects the prediction using the measurement $y_k$:

      $$\hat{x}_k = \hat{x}_k^- + K_k (y_k - C \hat{x}_k^-), \qquad P_k = (I - K_k C) P_k^-,$$

      where $K_k = P_k^- C^\top (C P_k^- C^\top + R)^{-1}$ is the _Kalman gain_.
properties:
  - >-
    For a linear system with Gaussian noise, the Kalman filter's estimate $\hat{x}_k$ is the conditional mean of $x_k$ given the measurements $y_1, \dots, y_k$, so it has the smallest mean-square error of every [estimator](/definitions/estimator) of $x_k$ from those measurements.
  - >-
    The Kalman filter is an [observer](/definitions/observer) with the same structure as a [Luenberger observer](/definitions/luenberger-observer), but with a time-varying gain $K_k$ chosen from the noise covariances $Q$ and $R$.
  - >-
    If $(A, C)$ is [detectable](/definitions/detectable) and $(A, Q^{1/2})$ is [stabilizable](/definitions/stabilizable), then the Kalman gain $K_k$ converges to a constant gain as $k \to \infty$.
---
For nonlinear systems, variants such as the [extended Kalman filter](/definitions/extended-kalman-filter) and the [unscented Kalman filter](/definitions/unscented-kalman-filter) apply the same predict-and-correct steps to approximations of the system.
These variants are not optimal in general.

The continuous-time version is called the _Kalman–Bucy filter_.
