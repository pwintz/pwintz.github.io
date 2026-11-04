---
published: false
title: Linear vs. affine vs. control-affine vs. feedback linearizable systems
kind: hierarchy
areas: [control, dynamics]
status: draft
summary: >
  A linear system has no offset, and an affine system may have one.
  A control-affine system can be nonlinear in the state but enters the input linearly.
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
      $\dot{x} = -x + u$ is a linear system, so it is also affine, control-affine, and feedback linearizable.
  - example: xdot_eq_minus_x_plus_u_plus_1
    why: >-
      $\dot{x} = -x + u + 1$ is affine, and so control-affine, because it is linear plus the constant offset $1$.
      It is not linear, but it is feedback linearizable, because shifting coordinates to an equilibrium removes the offset.
  - example: dot_x_1_eq_x_2_dot_x_2_eq_minus_sin_x_1_plus_u
    why: >-
      The pendulum is control-affine, because $u$ enters linearly, and it is feedback linearizable, because $u = \sin x_1 + v$ leaves the double integrator $\dot x_1 = x_2$, $\dot x_2 = v$.
      It is not linear or affine, because of the $\sin x_1$ term.
  - example: dot_x_1_eq_u_dot_x_2_eq_x_1_squared
    why: >-
      $\dot x_1 = u$, $\dot x_2 = x_1^2$ is control-affine, because $u$ enters linearly.
      It is not linear, affine, or feedback linearizable, because its linearization at the origin is not controllable, so no change of coordinates and feedback can make it a controllable linear system near the origin.
  - example: xdot_eq_x_plus_u_cubed
    why: >-
      $\dot{x} = x + u^3$ is not control-affine, because it is not affine in the input $u$, so it is not linear or affine either.
see_also:
  - time_invariant_vs_unforced
  - controllable_vs_reachable_vs_stabilizable
---
## Linearization vs. feedback linearization

- _Jacobian linearization_ approximates a system near an operating point by its first-order Taylor expansion.
  Every smooth system has one, but it is only an approximation.
- _Feedback linearization_ is exact on a region, but only some systems allow it.

## Other meanings of "linear"

In adaptive control and system identification, a model is "linear in the parameters" if the unknown parameters enter linearly, even when the model is nonlinear in the state, such as $\dot{x} = \theta x^2 + u$.
