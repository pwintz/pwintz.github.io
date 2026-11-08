---
published: false
title: 'An unscented Kalman filter'
definition: unscented_kalman_filter
level: graduate
is: [estimator, filter_estimation]
is_not: [predictor]
why:
  filter_estimation: >-
    An unscented Kalman filter is a filter, because it estimates the current state of a nonlinear system from noisy measurements up to now.
  estimator: >-
    An unscented Kalman filter is a filter, and so an estimator, because it estimates the current state of a nonlinear system from noisy measurements, by passing sample points through the system's model.
  observer: >-
    The error of an unscented Kalman filter is not guaranteed to converge, so it is not an observer in general, and it is not a predictor, because it estimates the present.
---
