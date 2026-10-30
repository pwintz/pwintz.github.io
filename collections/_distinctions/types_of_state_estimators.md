---
published: false
title: Types of estimators
kind: family
areas: [control]
status: draft
summary: >
  An estimator is any rule for estimating an unknown quantity. An observer is a dynamical system whose state estimate converges to the true state.
  A filter estimates the current state from noisy measurements, and a predictor estimates a future state.
terms:
  - estimator
  - predictor
  - filter_estimation
  - observer
examples:
  - example: a_luenberger_observer
    why: >-
      It estimates the current state of a deterministic system.
  - example: a_kalman_filter
    why: >-
      It has the form of an observer, with a time-varying gain chosen to minimize the mean-square error under noise.
  - example: a_weather_forecast_for_tomorrow
    why: >-
      It estimates a future state.
  - example: a_least_squares_estimate_of_a_constant_parameter
    why: >-
      It estimates a parameter, not a changing state.
  - example: a_low_pass_filter_on_a_sensor_signal
    why: >-
      It is a filter in the signal-processing sense. It smooths a signal but does not estimate a state.
see_also:
  - observable_vs_detectable_vs_reconstructible
  - state_vs_output_feedback
---
## Notes

- A _smoother_ estimates a past state from measurements up to the present, which is more accurate than filtering because it uses later data.
- The Kalman filter alternates a _prediction_ step (propagating the estimate forward with the model) and an _update_ step (correcting it with a new measurement).
