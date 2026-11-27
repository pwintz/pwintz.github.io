---
published: false
title: 'A high-gain observer'
definition: high_gain_observer
level: graduate
is: [
  observer,
  estimator
]
is_not: [predictor]
why:
  observer: >-
    A high-gain observer is an observer, because, without measurement noise, its estimation error becomes arbitrarily small after a short transient when its gain is high enough.
  predictor: >-
    A high-gain observer is not a predictor, because it estimates the present state, not a future one.
  estimator: >-
    A high-gain observer is an estimator, because it computes an estimate of the state of a system from its inputs and outputs.
---
