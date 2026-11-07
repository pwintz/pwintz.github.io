---
published: false
title: Observable vs. reconstructible vs. detectable
kind: hierarchy
areas: [control]
status: draft
summary: >
  These properties describe how much the output of a system reveals about its state.
  An observable system's initial state can be determined from its output, and a reconstructible system's current state can be.
  A detectable system only needs its unobserved parts to decay on their own, so that an observer's error still converges.
relation: >
  observable ⊂ detectable, and for continuous-time linear systems, observable = reconstructible.
terms:
  - observable
  - reconstructible
  - detectable
examples:
  - example: xdot_eq_x_y_eq_x
    why: >-
      $\dot{x} = x$, $y = x$ is observable because the output is the state.
      So it is also reconstructible and detectable.
  - example: dot_x_1_eq_x_2_dot_x_2_eq_u_with_position_output
    why: >-
      The double integrator with position output is observable because the velocity can be inferred from how the position changes.
      So it is also reconstructible and detectable.
  - example: dot_x_1_eq_x_2_dot_x_2_eq_u_with_velocity_output
    why: >-
      The double integrator with velocity output is not observable or reconstructible, because the output does not show the position $x_1$.
      It is not detectable, because the position's mode (with eigenvalue $0$) does not decay.
  - example: xdot_eq_minus_x_y_eq_0
    why: >-
      $\dot{x} = -x$, $y = 0$ is not observable or reconstructible, because the output carries no information.
      It is detectable, because the unknown state decays to $0$ anyway.
  - example: x_k_plus_1_eq_0_cdot_x_k_y_k_eq_0
    why: >-
      $x_{k+1} = 0 \cdot x_k$, $y_k = 0$ is not observable, because the output carries no information about the initial state.
      It is reconstructible and detectable, because the state is $0$ after one step, so the current state is known.
see_also:
  - controllable_vs_reachable_vs_stabilizable
  - types_of_state_estimators
---
## Duality

Each notion is dual to one on the [controllability page](/distinctions/controllable-vs-reachable-vs-stabilizable).
With $(A, C)$ paired with $(A^{\top}, C^{\top})$:

- observability is dual to reachability,
- reconstructibility is dual to controllability (to the origin), and
- detectability is dual to stabilizability.

For continuous-time linear systems, the first two pairs coincide, which is why observability is usually described as dual to controllability.
