---
published: false
title: Well-posed vs. consistent vs. stable vs. convergent
kind: siblings
areas: [differential-equations, computing]
summary: >
  Solving a partial differential equation numerically raises questions about both the equation and the method.
  Well-posedness is a property of the problem.
  Consistency, stability, and convergence are properties of a numerical scheme for solving it.
  Convergence is what we want, and for linear problems, the Lax equivalence theorem says it follows from consistency and stability.
terms:
  - well_posed
  - consistent_scheme
  - stable_scheme
  - convergent_scheme
examples_note: >-
  Here, $r = \Delta t / \Delta x^2$, and FTCS is the forward-time, centered-space finite-difference scheme.
examples:
  - example: the_heat_equation_u_t_eq_u_xx_forward_in_time
  - example: the_backward_heat_equation_u_t_eq_minus_u_xx
  - example: ftcs_for_u_t_eq_u_xx_with_r_leq_1_over_2
  - example: ftcs_for_u_t_eq_u_xx_with_r_gt_1_over_2
  - example: ftcs_for_u_t_plus_a_u_x_eq_0
see_also:
  - types_of_PDEs_eigenvalue_classification
  - types_of_dynamic_stability
---
## The Lax equivalence theorem

For a [consistent](/definitions/consistent-scheme) finite-difference scheme for a [well-posed](/definitions/well-posed) linear initial value problem, the scheme is convergent if and only if it is stable.
Consistency alone is not enough, as the unstable examples above show.
