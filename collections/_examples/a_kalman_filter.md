---
title: 'A Kalman filter'
definition: kalman_filter
level: undergraduate
is: [
  observer,
  estimator,
  filter_estimation
]
is_not: [predictor]
why:
  estimator: >-
    A Kalman filter is an estimator, because it estimates the state from noisy measurements.
  observer: >-
    A Kalman filter is an observer, because it uses a time-varying gain chosen to minimize the mean-square error.
  filter_estimation: >-
    A Kalman filter is a filter, because it estimates the current state from the measurements up to the current time.
  predictor: >-
    A Kalman filter is not a predictor, because it estimates the present state, not a future one.
---
