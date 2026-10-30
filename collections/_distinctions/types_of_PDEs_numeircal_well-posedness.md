---
published: false
title: Well-posed vs. consistent vs. stable vs. convergent
kind: siblings
areas: [differential-equations, computing]
status: draft
summary: >
  Well-posedness is a property of the problem. Consistency, stability, and convergence are properties of a numerical scheme for solving it.
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
    why: >-
      Solutions exist, are unique, and depend continuously on the initial data.
  - example: the_backward_heat_equation_u_t_eq_minus_u_xx
    why: >-
      High-frequency perturbations of the initial data grow arbitrarily fast, so solutions do not depend continuously on the data.
  - example: ftcs_for_u_t_eq_u_xx_with_r_leq_1_over_2
    why: >-
      Consistent and stable, so convergent.
  - example: ftcs_for_u_t_eq_u_xx_with_r_gt_1_over_2
    why: >-
      Errors at high frequencies are amplified at every step.
  - example: ftcs_for_u_t_plus_a_u_x_eq_0
    why: >-
      Unstable for every step size, despite being consistent.
see_also:
  - types_of_PDEs_eigenvalue_classification
  - types_of_dynamic_stability
---
## The Lax equivalence theorem

For a consistent finite-difference scheme for a well-posed linear initial value problem, the scheme is convergent if and only if it is stable.
Consistency alone is not enough, as the unstable examples above show.
