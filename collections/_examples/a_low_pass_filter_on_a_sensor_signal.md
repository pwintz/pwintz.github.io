---
title: 'A low-pass filter on a sensor signal'
level: high-school
is_not: [
  observer,
  filter_estimation,
  predictor
]
why:
  filter_estimation: >-
    A low-pass filter is a filter in the signal-processing sense: it smooths a signal. It is not a filter estimator because it does not estimate an unknown value.
  predictor: >-
    A low-pass filter on a sensor signal is not a predictor, because it does not estimate the future state of a system.
  observer: >-
    A low-pass filter on a sensor signal is not an observer, because it does not estimate the state of a system.
---
