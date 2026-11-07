---
published: false
title: Forward invariant vs. safe vs. admissible vs. controlled invariant
kind: siblings
areas: [dynamics, control]
status: draft
summary: >
  For a dynamical system with a set of states, there are several ways to say that solutions stay in the set or avoid danger.
  A forward invariant set traps every solution that starts in it.
  A controlled invariant set can be made to trap solutions by choosing inputs.
  An admissible set only satisfies the constraints now.
  Safety means solutions from the initial set never reach the unsafe set, which does not require the initial set to be invariant.
terms:
  - forward_invariant
  - safe
  - admissible_set
  - controlled_invariant
examples:
  - example: minus_1_1_for_xdot_eq_minus_x
    why: >-
      $[-1, 1]$ is forward invariant for $\dot{x} = -x$ because solutions move toward $0$, so they cannot leave.
  - example: 1_2_for_xdot_eq_minus_x
    why: >-
      $[1, 2]$ is not forward invariant for $\dot{x} = -x$, because solutions starting in it leave through $1$ on their way to $0$.
  - example: xdot_eq_minus_x_with_initial_set_1_2_and_unsafe
    why: >-
      The system is safe because solutions decrease, so they do not reach $3$.
      The initial set is not forward invariant, but $[0, 2]$ is, and it separates the initial set from the unsafe set.
  - example: 0_1_for_xdot_eq_u_with_u_leq_1
    why: >-
      $[0, 1]$ is controlled invariant because the input $u = 0$ keeps solutions in place.
      It is not forward invariant for every input, because $u = 1$ pushes solutions out through $1$.
  - example: the_state_of_a_car_1_m_from_a_wall_approaching_at
    why: >-
      The car's state is in the admissible set because it satisfies the constraint "distance $\geq 0$."
      It is not in a controlled invariant subset of the admissible set, and it is not safe, because no braking input can avoid a collision.
see_also:
  - types_of_dynamic_stability
  - types_of_tangent_spaces
  - types_of_unchanging
  - types_of_barrier_functions
  - types_of_attraction_regions
---
## Notes

- The largest controlled invariant subset of the admissible set is the _viability kernel_.
  States outside it are admissible but doomed.
- Forward invariance is about the future.
  A set is _backward invariant_ if every solution through it has stayed in it for all past time, and _invariant_ if it is both.
- An invariant set is preserved as a whole.
  Its individual points move.
