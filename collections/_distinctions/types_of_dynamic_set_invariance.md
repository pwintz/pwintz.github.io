---
published: false
title: Forward invariant vs. safe vs. admissible vs. controlled invariant
kind: siblings
areas: [dynamics, control]
summary: >
  For a dynamical system with a set of states, there are several ways to say that solutions stay in the set or avoid danger.
  A [forward invariant](/dictionary/definitions/forward-invariant) set traps every solution that starts in it.
  Safety means solutions from the initial set never reach the unsafe set, which does not require the initial set to be invariant.
  An [admissible set](/dictionary/definitions/admissible-set) only satisfies the constraints now.
  A [controlled invariant](/dictionary/definitions/controlled-invariant) set can be made to trap solutions by choosing inputs.
terms:
  - forward_invariant
  - safe
  - admissible_set
  - controlled_invariant
examples:
  - example: minus_1_1_for_xdot_eq_minus_x
  - example: 1_2_for_xdot_eq_minus_x
  - example: xdot_eq_minus_x_with_initial_set_1_2_and_unsafe
  - example: 0_1_for_xdot_eq_u_with_u_leq_1
  - example: the_state_of_a_car_1_m_from_a_wall_approaching_at
see_also:
  - types_of_dynamic_stability
  - types_of_tangent_spaces
  - types_of_unchanging
  - types_of_barrier_functions
  - types_of_attraction_regions
---
## Notes

- The largest [controlled invariant](/dictionary/definitions/controlled-invariant) [subset](/dictionary/definitions/subset) of the [admissible set](/dictionary/definitions/admissible-set) is the _viability kernel_.
  States outside it are admissible but doomed.
- Forward invariance is about the future.
  A set is _backward invariant_ if every solution through it has stayed in it for all past time, and _invariant_ if it is both.
- An invariant set is preserved as a whole.
  Its individual points move.
