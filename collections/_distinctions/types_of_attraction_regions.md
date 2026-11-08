---
published: false
title: Region of attraction vs. basin of attraction vs. invariant set vs. reachable set vs. viability kernel
kind: family
areas: [dynamics, control]
summary: >
  In a dynamical system, several kinds of sets describe where solutions go or stay.
  A region (or basin) of attraction is where solutions converge to an [equilibrium](/definitions/equilibrium) (or [attractor](/definitions/attractor)).
  An invariant set traps solutions, but they need not converge.
  A [reachable set](/definitions/reachable-set) is where solutions can go, and a [viability kernel](/definitions/viability-kernel) is where some solution can stay within the constraints forever.
terms:
  - region_of_attraction
  - basin_of_attraction
  - forward_invariant
  - reachable_set
  - viability_kernel
examples:
  - example: minus_infinity_1_for_xdot_eq_minus_x_plus_x
  - example: minus_1_over_2_1_over_2_for_xdot_eq_minus_x_plus
  - example: e_minus_1_1_for_xdot_eq_minus_x_starting_from_x_0
  - example: minus_1_1_for_xdot_eq_x_plus_u_with_u_leq_1_and
  - example: the_plane_without_the_origin_for_the_van_der_pol
see_also:
  - types_of_dynamic_set_invariance
  - types_of_attracting_sets
  - types_of_lyapunov_functions
---
## Notes

- A system is safe exactly when its reachable set from the initial set is disjoint from the unsafe set.
  [Reachable sets](/definitions/reachable-set) and [viability kernels](/definitions/viability-kernel) are computed, for example, with Hamilton–Jacobi reachability methods.
- The [region of attraction](/definitions/region-of-attraction) itself is usually impossible to compute exactly, so in practice, [forward invariant](/definitions/forward-invariant) estimates of it are used.
