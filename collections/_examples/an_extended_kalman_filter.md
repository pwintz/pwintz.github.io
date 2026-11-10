---
title: 'An extended Kalman filter'
definition: extended_kalman_filter
level: undergraduate
is: [
  estimator,
  filter_estimation
]
is_not: [
  observer,
  predictor
]
why:
  filter_estimation: >-
    An extended Kalman filter is a filter, because it estimates the current state of a nonlinear system from noisy measurements up to now.
  estimator: >-
    An extended Kalman filter is a filter, and so an estimator, because it estimates the current state of a nonlinear system from noisy measurements, by applying the Kalman filter to a linearization of the system.
  observer: >-
    An extended Kalman filter is not an observer in general, because its error is not guaranteed to converge.
  predictor: >-
    An extended Kalman filter is not a predictor, because it estimates the present state, not a future one.
---
