---
published: false
title: Region of attraction vs. basin of attraction vs. invariant set vs. reachable set vs. viability kernel
kind: family
areas: [dynamics, control]
status: draft
summary: >
  A region (or basin) of attraction is where solutions converge to an equilibrium (or attractor). An invariant set traps solutions, but they need not converge.
  A reachable set is where solutions can go, and a viability kernel is where some solution can stay within the constraints forever.
terms:
  - region_of_attraction
  - basin_of_attraction
  - forward_invariant
  - reachable_set
  - viability_kernel
examples:
  - example: minus_infinity_1_for_xdot_eq_minus_x_plus_x
    why: >-
      Solutions starting below $1$ converge to $0$, and solutions starting above $1$ diverge.
  - example: minus_1_over_2_1_over_2_for_xdot_eq_minus_x_plus
    why: >-
      It is a forward invariant subset of the region of attraction, the kind of estimate that a sublevel set of a Lyapunov function provides.
  - example: e_minus_1_1_for_xdot_eq_minus_x_starting_from_x_0
    why: >-
      It contains the states $e^{-t}$ for $0 \leq t \leq 1$. Solutions keep decreasing below $e^{-1}$, so it is not forward invariant.
  - example: minus_1_1_for_xdot_eq_x_plus_u_with_u_leq_1_and
    why: >-
      For $\lvert x \rvert \leq 1$, the input $u = -x$ holds the state still. For $1 < \lvert x \rvert \leq 2$, every allowed input pushes the state out of $K$. It is not forward invariant for every input: from $x = 1$, the input $u = 1$ pushes the state out.
  - example: the_plane_without_the_origin_for_the_van_der_pol
    why: >-
      It is the basin of attraction of the limit cycle: every solution except the equilibrium at the origin converges to it. "Region of attraction" usually refers to an equilibrium.
see_also:
  - types_of_dynamic_set_invariance
  - types_of_attracting_sets
  - types_of_lyapunov_functions
---
## Notes

- A system is safe exactly when its reachable set from the initial set never meets the unsafe set. Reachable sets and viability kernels are computed, for example, with Hamilton–Jacobi reachability methods.
- The region of attraction itself is usually impossible to compute exactly, so in practice, forward invariant estimates of it are used.
