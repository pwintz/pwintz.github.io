---
title: Types of control
kind: siblings
areas: [control]
summary: >
  A controller can decide its input with or without measuring what the system is doing.
  Open-loop control computes the input without measuring the output, and closed-loop (feedback) control uses the measured output to correct errors.
  [Feedforward](/dictionary/definitions/feedforward) acts on a measured [disturbance](/dictionary/definitions/disturbance) or a known reference before it affects the output, and is usually combined with feedback.
terms:
  - open_loop
  - closed_loop
  - feedback
  - feedforward
examples:
  - example: a_toaster_that_runs_for_a_fixed_time
  - example: a_thermostat
  - example: a_precomputed_optimal_input_u_t_applied_without
  - example: raising_heater_power_when_an_outdoor_thermometer
  - example: cruise_control_that_uses_both_the_speed_error_and
see_also:
  - state_vs_output_feedback
  - static_vs_dynamic_feedback
  - regulation_vs_tracking_vs_stabilization
---
## Notes

- In loop analysis, the "open-loop transfer function" $L(s)$ is the loop broken at one point.
  It describes a closed-loop design, not open-loop control.
- Pure [feedforward control](/dictionary/definitions/open-loop) is a form of open-loop control, so some authors use the terms interchangeably.
