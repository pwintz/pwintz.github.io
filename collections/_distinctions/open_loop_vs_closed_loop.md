---
published: false
title: Types of control
kind: siblings
areas: [control]
status: draft
summary: >
  A controller can decide its input with or without measuring what the system is doing.
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
      A toaster that runs for a fixed time is open-loop control because it does not measure how brown the toast is.
      So it is not closed-loop or feedback control.
  - example: a_thermostat
    why: >-
      A thermostat is closed-loop feedback control because it measures the temperature and switches the heater accordingly.
      It is not open-loop or feedforward control, because it reacts only to the measured temperature, not to a measured disturbance.
  - example: a_precomputed_optimal_input_u_t_applied_without
    why: >-
      A precomputed input is open-loop control because it uses no measurements.
      It is not feedback control, so any disturbance or model error goes uncorrected.
  - example: raising_heater_power_when_an_outdoor_thermometer
    why: >-
      Raising heater power on a cold-snap report is feedforward control because it acts on a measured disturbance before the room temperature drops.
      It is not feedback control, because it does not use the room temperature.
  - example: cruise_control_that_uses_both_the_speed_error_and
    why: >-
      This cruise control is closed-loop feedback control because it corrects the measured speed error.
      It is also feedforward control because it uses the map to anticipate the hills.
see_also:
  - state_vs_output_feedback
  - static_vs_dynamic_feedback
  - regulation_vs_tracking_vs_stabilization
---
## Notes

- In loop analysis, the "open-loop transfer function" $L(s)$ is the loop broken at one point.
  It describes a closed-loop design, not open-loop control.
- Pure feedforward control is a form of open-loop control, so some authors use the terms interchangeably.
