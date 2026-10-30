---
published: false
title: Linear vs. affine vs. control-affine vs. feedback linearizable systems
kind: hierarchy
areas: [control, dynamics]
status: draft
summary: >
  A linear system has no offset, and an affine system may have one. A control-affine system can be nonlinear in the state but enters the input linearly.
  A feedback linearizable system is nonlinear, but a change of coordinates and feedback make it exactly linear.
relation: >
  linear ⊂ affine ⊂ control-affine, and every feedback linearizable system is control-affine.
terms:
  - linear_system
  - affine_system
  - control_affine
  - feedback_linearizable
examples:
  - example: xdot_eq_minus_x_plus_u
    why: >-
      It is already linear.
  - example: xdot_eq_minus_x_plus_u_plus_1
    why: >-
      The constant offset makes it affine. Shifting coordinates to an equilibrium removes it.
  - example: dot_x_1_eq_x_2_dot_x_2_eq_minus_sin_x_1_plus_u
    why: >-
      The feedback $u = \sin x_1 + v$ cancels the nonlinearity exactly, leaving the double integrator $\dot x_1 = x_2$, $\dot x_2 = v$.
  - example: dot_x_1_eq_u_dot_x_2_eq_x_1_squared
    why: >-
      Its linearization at the origin is not controllable, so no change of coordinates and feedback can make it a controllable linear system near the origin.
  - example: xdot_eq_x_plus_u_cubed
    why: >-
      It is not affine in the input.
see_also:
  - time_invariant_vs_unforced
  - controllable_vs_reachable_vs_stabilizable
---
## Linearization vs. feedback linearization

- _Jacobian linearization_ approximates a system near an operating point by its first-order Taylor expansion. Every smooth system has one, but it is only an approximation.
- _Feedback linearization_ is exact on a region, but only some systems allow it.

## Other meanings of "linear"

In adaptive control and system identification, a model is "linear in the parameters" if the unknown parameters enter linearly, even when the model is nonlinear in the state, such as $\dot{x} = \theta x^2 + u$.
