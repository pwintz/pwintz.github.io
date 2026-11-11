---
title: State feedback vs. output feedback
kind: siblings
areas: [control]
summary: >
  A [feedback](/dictionary/definitions/feedback) controller computes its input from information about the system, which may be more or less complete.
  [State feedback](/dictionary/definitions/state-feedback) uses the full state, which is rarely measured directly.
  [Output feedback](/dictionary/definitions/output-feedback) uses only the measured output, and it may need an [observer](/dictionary/definitions/observer) or other dynamics to do what state feedback can.
terms:
  - state_feedback
  - output_feedback
examples:
  - example: u_eq_minus_k_x_with_the_full_state_measured
  - example: u_eq_minus_k_y_for_dot_x_1_eq_x_2_dot_x_2_eq_u
  - example: u_eq_minus_k_hat_x_where_an_observer_computes_hat
  - example: u_eq_minus_k_y_when_y_eq_x
see_also:
  - static_vs_dynamic_feedback
  - observable_vs_detectable_vs_reconstructible
  - types_of_state_estimators
---
