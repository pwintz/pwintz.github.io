---
published: false
title: State feedback vs. output feedback
kind: siblings
areas: [control]
status: draft
summary: >
  State feedback uses the full state, which is rarely measured directly. Output feedback uses only the measured output,
  and it may need an observer or other dynamics to do what state feedback can.
terms:
  - state_feedback
  - output_feedback
examples:
  - example: u_eq_minus_k_x_with_the_full_state_measured
    why: >-
      For a controllable system, $K$ can place the closed-loop eigenvalues anywhere.
  - example: u_eq_minus_k_y_for_dot_x_1_eq_x_2_dot_x_2_eq_u
    why: >-
      The closed loop $\ddot x_1 = -k x_1$ oscillates for every $k > 0$, so no static output feedback stabilizes the double integrator.
  - example: u_eq_minus_k_hat_x_where_an_observer_computes_hat
    why: >-
      By the separation principle, a stabilizing state feedback combined with a converging observer stabilizes the system.
  - example: u_eq_minus_k_y_when_y_eq_x
    why: >-
      When the whole state is measured, the two coincide.
see_also:
  - static_vs_dynamic_feedback
  - observable_vs_detectable_vs_reconstructible
  - types_of_state_estimators
---
