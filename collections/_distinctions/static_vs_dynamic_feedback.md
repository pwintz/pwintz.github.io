---
published: false
title: Static vs. dynamic feedback
kind: siblings
areas: [control]
status: draft
summary: >
  A feedback controller may or may not have memory.
  A static feedback law computes the input from the current measurement alone.
  A dynamic feedback law has its own state, so the input can depend on the history of the measurements.
terms:
  - static_feedback
  - dynamic_feedback
examples:
  - example: proportional_control_u_eq_minus_k_p_e
    why: >-
      Proportional control is static feedback because the input depends only on the current error $e$.
      It is not dynamic feedback, because the controller has no state.
  - example: pi_control_u_eq_minus_k_p_e_minus_k_i_int_0_t_e_s
    why: >-
      PI control is dynamic feedback because the integral is an internal controller state $z$, with $\dot{z} = e$.
      It is not static feedback, because the input depends on the history of the error, not only its current value.
  - example: a_lead_compensator_c_s_eq_s_plus_1_over_s_plus_10
    why: >-
      The lead compensator is dynamic feedback because its transfer function is not constant, so it has an internal state.
      It is not static feedback, because its output depends on the history of its input.
  - example: an_observer_based_controller
    why: >-
      An observer-based controller is dynamic feedback because the observer state $\hat{x}$ is the controller's state.
      It is not static feedback, because the input depends on the history of the measurements through $\hat{x}$.
  - example: lqr_state_feedback_u_eq_minus_k_x
    why: >-
      LQR state feedback is static feedback because the gain $K$ is constant, and the input depends only on the current state.
      It is not dynamic feedback, because the controller has no state of its own.
see_also:
  - state_vs_output_feedback
  - open_loop_vs_closed_loop
---
## Notes

- "Static" does not mean "constant."
  A static feedback law $u = k(y)$ can be nonlinear and still has no memory.
- The double integrator with position output cannot be stabilized by static output feedback, but a dynamic controller, such as a lead compensator or an observer-based controller, stabilizes it.
- A dynamic controller can be viewed as static feedback for an augmented system whose state includes the controller state.
