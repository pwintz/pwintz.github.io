---
published: false
title: Types of exogenous inputs
kind: family
areas: [control]
status: draft
summary: >
  Exogenous inputs come from outside the system. A control input is chosen; a disturbance acts on the dynamics; measurement noise only corrupts what is measured.
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
      Chosen by the flight controller.
  - example: a_gust_of_wind_hitting_a_quadcopter_drone
    why: >-
      It changes the drone's actual motion.
  - example: jitter_in_a_quadcopter_drones_gps_position
    why: >-
      It changes what the controller sees, not where the drone is.
  - example: a_payload_that_makes_a_quadcopter_drone_10
    why: >-
      A change to a parameter of the model, not a signal.
see_also:
  - types_of_dynamic_stability
  - open_loop_vs_closed_loop
  - types_of_input_output_stability
---
