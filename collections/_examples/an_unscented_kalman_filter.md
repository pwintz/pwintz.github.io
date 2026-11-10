---
title: 'An unscented Kalman filter'
definition: unscented_kalman_filter
level: graduate
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
    An unscented Kalman filter is a filter, because it estimates the current state of a nonlinear system from noisy measurements up to now.
  estimator: >-
    An unscented Kalman filter is a filter, and so an estimator, because it estimates the current state of a nonlinear system from noisy measurements, by passing sample points through the system's model.
  observer: >-
    An unscented Kalman filter is not an observer in general, because its error is not guaranteed to converge.
  predictor: >-
    An unscented Kalman filter is not a predictor, because it estimates the present state, not a future one.
---
