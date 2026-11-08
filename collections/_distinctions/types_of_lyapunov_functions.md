---
published: false
title: Types of Lyapunov functions
kind: siblings
areas: [dynamics, control]
summary: >
  [Lyapunov functions](/definitions/lyapunov-function) prove stability, and variants handle systems with [control inputs](/definitions/control-input) or [disturbances](/definitions/disturbance).
  A Lyapunov function decreases along the solutions of a system without inputs.
  A [control Lyapunov function](/definitions/control-lyapunov-function) can be made to decrease by choosing the input.
  An [ISS-Lyapunov function](/definitions/iss-lyapunov-function) decreases whenever the state is large compared with a disturbance input.
terms:
  - lyapunov_function
  - control_lyapunov_function
  - iss_lyapunov_function
examples_note: >-
  In each row, is $V$ a ___ for the given system?
examples:
  - example: v_x_eq_x_squared_for_xdot_eq_minus_x
  - example: v_x_eq_x_squared_for_xdot_eq_x_plus_u
  - example: v_x_eq_x_squared_for_xdot_eq_minus_x_plus_d
  - example: v_x_eq_x_squared_for_xdot_eq_minus_x_plus_x
  - example: v_x_eq_x_squared_for_xdot_eq_x
see_also:
  - lyapunov_vs_barrier_functions
  - types_of_input_output_stability
  - types_of_dynamic_stability
---
## Notes

- A [Lyapunov function](/definitions/lyapunov-function) is a property of a system with no input (or a fixed feedback law).
  A [control Lyapunov function](/definitions/control-lyapunov-function) is a property of a control system, before a feedback law is chosen.
- Lyapunov's direct method uses a Lyapunov function to prove stability without solving the system.
  See [stability criteria](/distinctions/types-stability-criterion).
