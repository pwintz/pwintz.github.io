---
title: 'A Kalman filter'
definition: kalman_filter
level: undergraduate
is: [observer, estimator, filter_estimation]
is_not: [predictor]
why:
  estimator: >-
    A Kalman filter is a filter, and so an estimator, because it estimates the current state from noisy measurements.
  predictor: >-
    A Kalman filter is an observer with a time-varying gain chosen to minimize the mean-square error, and it is not a predictor, because it estimates the present.
---
