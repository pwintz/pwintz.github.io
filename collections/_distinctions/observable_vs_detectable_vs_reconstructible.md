---
published: false
title: Observable vs. reconstructible vs. detectable
kind: hierarchy
areas: [control]
status: draft
summary: >
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
      The output is the state.
  - example: dot_x_1_eq_x_2_dot_x_2_eq_u_with_position_output
    why: >-
      The velocity can be inferred from how the position changes.
  - example: dot_x_1_eq_x_2_dot_x_2_eq_u_with_velocity_output
    why: >-
      The position $x_1$ is never seen, and its mode (with eigenvalue $0$) does not decay.
  - example: xdot_eq_minus_x_y_eq_0
    why: >-
      The output carries no information, but the unknown state decays to $0$ anyway.
  - example: x_k_plus_1_eq_0_cdot_x_k_y_k_eq_0
    why: >-
      After one step, the state is $0$, so the current state is known even though the initial state is not.
see_also:
  - controllable_vs_reachable_vs_stabilizable
  - types_of_state_estimators
---
## Duality

Each notion is dual to one on the [controllability page](/distinctions/controllable-vs-reachable-vs-stabilizable). With $(A, C)$ paired with $(A^{\top}, C^{\top})$:

- observability is dual to reachability,
- reconstructibility is dual to controllability (to the origin), and
- detectability is dual to stabilizability.

For continuous-time linear systems, the first two pairs coincide, which is why observability is usually described as dual to controllability.
