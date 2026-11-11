---
title: Observable vs. reconstructible vs. detectable
kind: hierarchy
areas: [control]
summary: >
  Observability, reconstructibility, and detectability describe how much the output of a system reveals about its state.
  An [observable](/dictionary/definitions/observable) system's _initial_ state can be determined from its output, whereas a [reconstructible](/dictionary/definitions/reconstructible) system's _current_ state can be determined.
  A [detectable](/dictionary/definitions/detectable) system may have unobservable parts but those parts must that decay to zero so that an observer's error still converges.
relation: >
  observable ⊂ detectable, and for continuous-time linear systems, observable = reconstructible.
terms:
  - observable
  - reconstructible
  - detectable
examples:
  - example: xdot_eq_x_y_eq_x
  - example: dot_x_1_eq_x_2_dot_x_2_eq_u_with_position_output
  - example: dot_x_1_eq_x_2_dot_x_2_eq_u_with_velocity_output
  - example: xdot_eq_minus_x_y_eq_0
  - example: x_k_plus_1_eq_0_cdot_x_k_y_k_eq_0
see_also:
  - controllable_vs_reachable_vs_stabilizable
  - types_of_state_estimators
---
## Duality

Each notion is dual to one on the [controllability page](/dictionary/distinctions/controllable-vs-reachable-vs-stabilizable).
With $(A, C)$ paired with $(A^{\top}, C^{\top})$:

- observability is dual to reachability,
- reconstructibility is dual to controllability (to the origin), and
- detectability is dual to stabilizability.

For continuous-time linear systems, the first two pairs coincide, which is why observability is usually described as dual to controllability.
