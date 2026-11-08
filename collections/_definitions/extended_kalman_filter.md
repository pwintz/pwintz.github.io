---
title: Extended Kalman filter
term: extended Kalman filter
applies_to: state estimation
synonyms: [EKF]
levels:
  high-school:
    text: |-
      An _extended Kalman filter_ is a version of the [Kalman filter](/definitions/kalman-filter) for systems that are not linear.
      At each step, it approximates the system by a linear one near the current estimate, then applies the Kalman filter's predict-and-correct steps to the approximation.
  undergraduate:
    context: "discrete-time nonlinear systems with noise"
    text: |-
      Consider a discrete-time system with state $x_k$, input $u_k$, and measured output $y_k$, given by

      $$x_{k+1} = f(x_k, u_k) + w_k, \qquad y_k = h(x_k) + v_k,$$

      where $f$ and $h$ are [differentiable](/definitions/differentiable), and the noises $w_k$ and $v_k$ are independent, zero-mean, and white, with covariances $Q$ and $R$.
      The _extended Kalman filter_ for this system is the [filter](/definitions/filter-estimation) that computes a state estimate $\hat{x}_k$ and an approximate error covariance $P_k$ by repeating two steps.
      First, it predicts

      $$\hat{x}_k^- = f(\hat{x}_{k-1}, u_{k-1}), \qquad P_k^- = F_{k-1} P_{k-1} F_{k-1}^\top + Q,$$

      where $F_{k-1}$ is the [Jacobian](/definitions/jacobian) of $f$ with respect to $x$ at $(\hat{x}_{k-1}, u_{k-1})$.
      Then, it corrects the prediction using the measurement $y_k$:

      $$\hat{x}_k = \hat{x}_k^- + K_k \bigl(y_k - h(\hat{x}_k^-)\bigr), \qquad P_k = (I - K_k H_k) P_k^-,$$

      where $H_k$ is the Jacobian of $h$ at $\hat{x}_k^-$ and $K_k = P_k^- H_k^\top (H_k P_k^- H_k^\top + R)^{-1}$.
properties:
  - >-
    If $f$ and $h$ are linear, then the extended Kalman filter is the [Kalman filter](/definitions/kalman-filter).
  - >-
    The extended Kalman filter is not optimal in general, and its estimate can diverge if the initial estimate is poor or the system is strongly nonlinear, because the linearization is accurate only near the estimate.
---
The continuous-time version is called the _extended Kalman–Bucy filter_.
