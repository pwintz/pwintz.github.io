---
title: Types of estimators
kind: family
areas: [control]
summary: >
  When the state of a system is not measured directly, it can be estimated in several ways.
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
  - example: a_kalman_filter
  - example: an_extended_kalman_filter
  - example: an_unscented_kalman_filter
  - example: a_particle_filter
  - example: a_moving_horizon_estimator
  - example: a_high_gain_observer
  - example: a_weather_forecast_for_tomorrow
  - example: a_least_squares_estimate_of_a_constant_parameter
  - example: a_low_pass_filter_on_a_sensor_signal
see_also:
  - observable_vs_detectable_vs_reconstructible
  - state_vs_output_feedback
---
## Notes

<!-- - A _smoother_ estimates a past state from measurements up to the present, which is more accurate than filtering because it uses later data. -->
- The [Kalman filter](/dictionary/definitions/kalman-filter) alternates a _prediction_ step (propagating the estimate forward with the model) and an _update_ step (correcting it with a new measurement).
