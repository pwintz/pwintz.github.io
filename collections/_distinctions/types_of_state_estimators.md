---
published: false
title: Types of estimators
kind: family
areas: [control]
status: draft
summary: >
  An estimator is any rule for estimating an unknown quantity.
  An observer is a dynamical system whose state estimate converges to the true state.
  A filter estimates the current state from noisy measurements, and a predictor estimates a future state.
terms:
  - estimator
  - predictor
  - filter_estimation
  - observer
examples:
  - example: a_luenberger_observer
    why: >-
      A Luenberger observer is an observer, and so an estimator, because it estimates the current state of a deterministic system from its inputs and outputs.
      It is not a predictor, because it estimates the present, not the future.
  - example: a_kalman_filter
    why: >-
      A Kalman filter is a filter, and so an estimator, because it estimates the current state from noisy measurements.
      It is an observer with a time-varying gain chosen to minimize the mean-square error, and it is not a predictor, because it estimates the present.
  - example: a_weather_forecast_for_tomorrow
    why: >-
      A weather forecast is a predictor, and so an estimator, because it estimates a future state.
      It is not an observer or a filter, because those estimate the current state.
  - example: a_least_squares_estimate_of_a_constant_parameter
    why: >-
      A least-squares estimate is an estimator because it estimates a quantity from data.
      It is not an observer, filter, or predictor, because it estimates a constant parameter, not a changing state.
  - example: a_low_pass_filter_on_a_sensor_signal
    why: >-
      A low-pass filter is a filter in the signal-processing sense: it smooths a signal.
      It is not a filter in the estimation sense, an observer, or a predictor, because it does not estimate a state.
see_also:
  - observable_vs_detectable_vs_reconstructible
  - state_vs_output_feedback
---
## Notes

- A _smoother_ estimates a past state from measurements up to the present, which is more accurate than filtering because it uses later data.
- The Kalman filter alternates a _prediction_ step (propagating the estimate forward with the model) and an _update_ step (correcting it with a new measurement).
