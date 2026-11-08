---
published: false
title: Linear vs. affine vs. control-affine vs. feedback linearizable systems
kind: hierarchy
areas: [control, dynamics]
summary: >
  Control systems are classified by how the state and input enter the dynamics.
  A linear system has no offset, and an [affine](/definitions/affine-system) system may have one.
  A [control-affine](/definitions/control-affine) system can be nonlinear in the state but enters the input linearly.
  A [feedback linearizable](/definitions/feedback-linearizable) system is nonlinear, but a change of coordinates and feedback make it exactly linear.
relation: >
  linear ⊂ affine ⊂ control-affine, and every feedback linearizable system is control-affine.
terms:
  - linear_system
  - affine_system
  - control_affine
  - feedback_linearizable
examples:
  - example: xdot_eq_minus_x_plus_u
  - example: xdot_eq_minus_x_plus_u_plus_1
  - example: dot_x_1_eq_x_2_dot_x_2_eq_minus_sin_x_1_plus_u
  - example: dot_x_1_eq_u_dot_x_2_eq_x_1_squared
  - example: xdot_eq_x_plus_u_cubed
see_also:
  - time_invariant_vs_unforced
  - controllable_vs_reachable_vs_stabilizable
---
## Linearization vs. feedback linearization

- _Jacobian linearization_ approximates a system near an [operating point](/definitions/operating-point) by its first-order Taylor expansion.
  Every smooth system has one, but it is only an approximation.
- _Feedback linearization_ is exact on a region, but only some systems allow it.

## Other meanings of "linear"

In adaptive control and system identification, a model is "linear in the parameters" if the unknown parameters enter linearly, even when the model is nonlinear in the state, such as $\dot{x} = \theta x^2 + u$.
