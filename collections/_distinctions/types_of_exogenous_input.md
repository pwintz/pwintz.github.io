---
published: false
title: Types of exogenous inputs
kind: family
areas: [control]
status: draft
summary: >
  Exogenous inputs come from outside the system.
  A control input is chosen; a disturbance acts on the dynamics; measurement noise only corrupts what is measured.
  A perturbation is a change to the system itself, which may or may not be modeled as an input.
terms:
  - exogenous_input
  - control_input
  - disturbance
  - measurement_noise
  - perturbation
examples:
  - example: the_motor_commands_of_a_quadcopter_drone
    why: >-
      The motor commands are a control input, and so an exogenous input, because the flight controller chooses them.
      They are not a disturbance or measurement noise, because they are chosen, not imposed.
  - example: a_gust_of_wind_hitting_a_quadcopter_drone
    why: >-
      The gust is a disturbance, and so an exogenous input, because it changes the drone's actual motion and is not chosen.
      It is not a control input or measurement noise.
  - example: jitter_in_a_quadcopter_drones_gps_position
    why: >-
      The GPS jitter is measurement noise, and so an exogenous input, because it changes what the controller sees, not where the drone is.
      It is not a disturbance or a control input.
  - example: a_payload_that_makes_a_quadcopter_drone_10
    why: >-
      The extra payload is a perturbation because it changes a parameter of the model, the drone's mass.
      It is not an exogenous input or measurement noise, because it is not a signal.
see_also:
  - types_of_dynamic_stability
  - open_loop_vs_closed_loop
  - types_of_input_output_stability
---
