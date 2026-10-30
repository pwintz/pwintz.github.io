---
published: false
title: Forward invariant vs. safe vs. admissible vs. controlled invariant
kind: siblings
areas: [dynamics, control]
status: draft
summary: >
  A forward invariant set traps every solution that starts in it. A controlled invariant set can be made to trap solutions by choosing inputs.
  An admissible set only satisfies the constraints now. Safety means solutions from the initial set never reach the unsafe set, which does not require the initial set to be invariant.
terms:
  - forward_invariant
  - safe
  - admissible_set
  - controlled_invariant
examples:
  - example: minus_1_1_for_xdot_eq_minus_x
    why: >-
      Solutions move toward $0$, so they cannot leave.
  - example: 1_2_for_xdot_eq_minus_x
    why: >-
      Solutions starting in $[1, 2]$ leave through $1$ on their way to $0$.
  - example: xdot_eq_minus_x_with_initial_set_1_2_and_unsafe
    why: >-
      Solutions decrease, so they never reach $3$. The initial set is not forward invariant, but $[0, 2]$ is, and it separates the initial set from the unsafe set.
  - example: 0_1_for_xdot_eq_u_with_u_leq_1
    why: >-
      The input $u = 0$ keeps solutions in place, but $u = 1$ pushes them out through $1$.
  - example: the_state_of_a_car_1_m_from_a_wall_approaching_at
    why: >-
      The state satisfies the constraint "distance $\geq 0$," so it is in the admissible set. But no braking input can avoid a collision, so it is in no controlled invariant subset of the admissible set.
see_also:
  - types_of_dynamic_stability
  - types_of_tangent_spaces
  - types_of_unchanging
  - types_of_barrier_functions
  - types_of_attraction_regions
---
## Notes

- The largest controlled invariant subset of the admissible set is the _viability kernel_. States outside it are admissible but doomed.
- Forward invariance is about the future. A set is _backward invariant_ if every solution through it has stayed in it for all past time, and _invariant_ if it is both.
- An invariant set is preserved as a whole. Its individual points move.
