---
title: 'A particle filter'
definition: particle_filter
level: undergraduate
is: [
  estimator,
  filter_estimation
]
is_not: [predictor]
why:
  filter_estimation: >-
    A particle filter is a filter, because it estimates the current state from noisy measurements up to now, by approximating the state's distribution with weighted samples.
  predictor: >-
    A particle filter is not a predictor, because it estimates the present.
  estimator: >-
    A particle filter is a filter, and so an estimator, because it estimates the current state from noisy measurements, by approximating the state's distribution with weighted samples.
---
