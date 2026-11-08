---
published: false
title: Types of ODE solutions
kind: family
areas: [differential-equations, dynamics]
summary: >
  For a differential equation whose right-hand side is discontinuous, [classical solutions](/definitions/classical-solution) may not exist, so weaker notions of solution are used.
  A classical solution satisfies the differential equation at every time, and a [Carathéodory solution](/definitions/caratheodory-solution) at almost every time.
  Filippov and [Krasovskii solutions](/definitions/krasovskii-solution) replace a discontinuous right-hand side by a set of nearby values, so that solutions exist even where the right-hand side jumps.
  [Hermes solutions](/definitions/hermes-solution) are limits of solutions with vanishing measurement errors, and they turn out to be the Krasovskii solutions.
relation: >
  classical ⊂ Carathéodory, and Filippov ⊂ Krasovskii = Hermes (for locally bounded $f$).
  When $f$ is continuous, all of these notions agree.
terms:
  - classical_solution
  - caratheodory_solution
  - filippov_solution
  - krasovskii_solution
  - hermes_solution
examples:
  - example: x_t_eq_0_for_xdot_eq_minus_sign_x_with_sign_0_eq_0
  - example: x_t_eq_max_1_minus_t_0_for_xdot_eq_minus_sign_x
  - example: x_t_eq_max_1_minus_t_0_for_xdot_eq_minus_sign_x_2
  - example: x_t_eq_0_for_xdot_eq_f_x_with_f_x_eq_1_for_x_neq
see_also:
  - complete_vs_maximal_solutions
  - types_of_nonsmooth_derivatives
---
## Notes

- [Filippov solutions](/definitions/filippov-solution) are the standard solution concept for sliding mode control and other discontinuous feedback.
  [Krasovskii solutions](/definitions/krasovskii-solution) appear in the theory of [hybrid systems](/definitions/hybrid-system), where they make stability robust to small measurement errors.
- [Hermes solutions](/definitions/hermes-solution) explain why: a discontinuous feedback law evaluated at slightly wrong measurements can produce any Krasovskii solution, including ones that Filippov solutions rule out.
  So a property that holds for all Filippov solutions may fail in practice, while a property that holds for all Krasovskii solutions is robust to small measurement errors.
- [Carathéodory solutions](/definitions/caratheodory-solution) are needed for systems driven by inputs $u(t)$ that are merely measurable, such as bang-bang inputs, even when the dependence on $x$ is smooth.
