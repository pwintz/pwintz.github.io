---
published: false
title: 'A high-gain observer'
definition: high_gain_observer
level: graduate
is: [observer, estimator]
is_not: [predictor]
why:
  observer: >-
    A high-gain observer is an observer, because, without measurement noise, its estimation error becomes arbitrarily small after a short transient when its gain is high enough.
  predictor: >-
    A high-gain observer is designed for deterministic systems, not noisy measurements, which it amplifies, and it is not a predictor, because it estimates the present.
  estimator: >-
    A high-gain observer is an observer, and so an estimator, because its estimation error becomes small after a short transient.
---
