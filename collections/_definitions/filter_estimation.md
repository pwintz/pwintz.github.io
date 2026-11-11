---
title: Filter (estimation)
term: filter (estimation)
applies_to: state estimation
levels:
  high-school:
    text: |-
      Consider a quantity that is measured over time, with noisy measurements.
      In estimation, a _filter_ estimates the current value of the quantity from the measurements made up to now.
  undergraduate:
    text: |-
      Consider a system with state $x(t)$ and noisy measurements of it.
      In estimation, a _filter_ computes an estimate of the current state $x(t)$ from the measurements up to time $t$.
properties:
  - >-
    The [Kalman filter](/dictionary/definitions/kalman-filter) is the optimal (minimum mean-square error) filter for linear systems with Gaussian noise.
---
In signal processing, a _filter_ is a system that shapes the frequency content of a signal, such as a low-pass filter.
Such a filter is not a state [estimator](/dictionary/definitions/estimator).
