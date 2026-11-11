---
published: false
title: Moving horizon estimator
term: moving horizon estimator
applies_to: state estimation
synonyms: [moving horizon estimation, MHE]
levels:
  graduate:
    context: "discrete-time systems with noise and constraints"
    text: |-
      Consider a discrete-time system with state $x_k$, input $u_k$, and measured output $y_k$, given by

      $$x_{k+1} = f(x_k, u_k) + w_k, \qquad y_k = h(x_k) + v_k,$$

      with unknown [disturbances](/dictionary/definitions/disturbance) $w_k$ and $v_k$, and a horizon length $N$.
      A _moving horizon estimator_ for this system computes the state estimate $\hat{x}_k$ at each time $k$ by solving an optimization problem over the last $N$ steps: it chooses states $x_{k-N}, \dots, x_k$ that satisfy the model and all known constraints, and that minimize a cost penalizing the disturbances $w_j$, the output errors $y_j - h(x_j)$, and the distance of $x_{k-N}$ from a prior estimate (the _arrival cost_).
      The estimate $\hat{x}_k$ is the final state $x_k$ of the minimizing trajectory.
properties:
  - >-
    A moving horizon estimator can enforce constraints on the state and [disturbances](/dictionary/definitions/disturbance), such as nonnegative concentrations, which the [Kalman filter](/dictionary/definitions/kalman-filter) cannot.
  - >-
    For a linear system without constraints, with quadratic costs weighted by the inverse noise covariances and an arrival cost given by the [Kalman filter](/dictionary/definitions/kalman-filter), the moving horizon estimate equals the Kalman filter's estimate.
---
Moving horizon estimation is the estimation counterpart of model predictive control, which solves a similar optimization problem over a horizon in the future instead of the past.
