---
published: false
title: 'A moving horizon estimator'
definition: moving_horizon_estimator
level: graduate
is: [
  estimator,
  filter_estimation
]
is_not: [predictor]
why:
  filter_estimation: >-
    A moving horizon estimator is a filter, because it estimates the current state from the measurements in a window that ends now.
  predictor: >-
    A moving horizon estimator is not a predictor, because it estimates the present.
  estimator: >-
    A moving horizon estimator is a filter, and so an estimator, because it estimates the current state by optimizing over the measurements in a window that ends now.
---
