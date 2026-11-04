---
published: false
title: Region of attraction vs. basin of attraction vs. invariant set vs. reachable set vs. viability kernel
kind: family
areas: [dynamics, control]
status: draft
summary: >
  A region (or basin) of attraction is where solutions converge to an equilibrium (or attractor).
  An invariant set traps solutions, but they need not converge.
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
      $(-\infty, 1)$ is the region of attraction (or basin of attraction) of $0$ because solutions starting below $1$ converge to $0$, and solutions starting above $1$ diverge.
      It is forward invariant because solutions starting in it stay in it.
  - example: minus_1_over_2_1_over_2_for_xdot_eq_minus_x_plus
    why: >-
      $[-\frac{1}{2}, \frac{1}{2}]$ is forward invariant because $\dot{x} = x(x - 1)$ points inward at both ends.
      It is not the region of attraction, because it is only part of it, the kind of estimate that a sublevel set of a Lyapunov function provides.
  - example: e_minus_1_1_for_xdot_eq_minus_x_starting_from_x_0
    why: >-
      $[e^{-1}, 1]$ is the reachable set because it contains the states $e^{-t}$ for $0 \leq t \leq 1$.
      It is not forward invariant, because solutions keep decreasing below $e^{-1}$.
  - example: minus_1_1_for_xdot_eq_x_plus_u_with_u_leq_1_and
    why: >-
      $[-1, 1]$ is the viability kernel of $K$ because, for $\lvert x \rvert \leq 1$, the input $u = -x$ holds the state still, and for $1 < \lvert x \rvert \leq 2$, every allowed input pushes the state out of $K$.
      It is not forward invariant for every input, because from $x = 1$, the input $u = 1$ pushes the state out.
  - example: the_plane_without_the_origin_for_the_van_der_pol
    why: >-
      The plane without the origin is the basin of attraction of the limit cycle because every solution except the equilibrium at the origin converges to it, and it is forward invariant.
      It is not called a region of attraction, because that term usually refers to an equilibrium.
see_also:
  - types_of_dynamic_set_invariance
  - types_of_attracting_sets
  - types_of_lyapunov_functions
---
## Notes

- A system is safe exactly when its reachable set from the initial set is disjoint from the unsafe set.
  Reachable sets and viability kernels are computed, for example, with Hamilton–Jacobi reachability methods.
- The region of attraction itself is usually impossible to compute exactly, so in practice, forward invariant estimates of it are used.
