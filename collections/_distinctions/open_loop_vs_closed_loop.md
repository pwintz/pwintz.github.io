---
published: false
title: Types of control
kind: siblings
areas: [control]
status: draft
summary: >
  Open-loop control computes the input without measuring the output, and closed-loop (feedback) control uses the measured output to correct errors.
  Feedforward acts on a measured disturbance or a known reference before it affects the output, and is usually combined with feedback.
terms:
  - open_loop
  - closed_loop
  - feedback
  - feedforward
examples:
  - example: a_toaster_that_runs_for_a_fixed_time
    why: >-
      It never checks how brown the toast is.
  - example: a_thermostat
    why: >-
      It measures the temperature and switches the heater accordingly.
  - example: a_precomputed_optimal_input_u_t_applied_without
    why: >-
      Any disturbance or model error goes uncorrected.
  - example: raising_heater_power_when_an_outdoor_thermometer
    why: >-
      It acts on a measured disturbance before the room temperature drops.
  - example: cruise_control_that_uses_both_the_speed_error_and
    why: >-
      Feedback corrects errors, and feedforward anticipates the hills.
see_also:
  - state_vs_output_feedback
  - static_vs_dynamic_feedback
  - regulation_vs_tracking_vs_stabilization
---
## Notes

- In loop analysis, the "open-loop transfer function" $L(s)$ is the loop broken at one point. It describes a closed-loop design, not open-loop control.
- Pure feedforward control is a form of open-loop control, so some authors use the terms interchangeably.
