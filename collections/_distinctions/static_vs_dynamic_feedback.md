---
published: false
title: Static vs. dynamic feedback
kind: siblings
areas: [control]
status: draft
summary: >
  A static feedback law computes the input from the current measurement alone. A dynamic feedback law has its own state,
  so the input can depend on the history of the measurements.
terms:
  - static_feedback
  - dynamic_feedback
examples:
  - example: proportional_control_u_eq_minus_k_p_e
    why: >-
      The input depends only on the current error $e$.
  - example: pi_control_u_eq_minus_k_p_e_minus_k_i_int_0_t_e_s
    why: >-
      The integral is an internal controller state $z$, with $\dot{z} = e$.
  - example: a_lead_compensator_c_s_eq_s_plus_1_over_s_plus_10
    why: >-
      A transfer function that is not constant has internal states.
  - example: an_observer_based_controller
    why: >-
      The observer state $\hat{x}$ is the controller state.
  - example: lqr_state_feedback_u_eq_minus_k_x
    why: >-
      The gain is constant, and the input depends only on the current state.
see_also:
  - state_vs_output_feedback
  - open_loop_vs_closed_loop
---
## Notes

- "Static" does not mean "constant." A static feedback law $u = k(y)$ can be nonlinear and still has no memory.
- The double integrator with position output cannot be stabilized by static output feedback, but a dynamic controller, such as a lead compensator or an observer-based controller, stabilizes it.
- A dynamic controller can be viewed as static feedback for an augmented system whose state includes the controller state.
