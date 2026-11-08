---
published: false
title: Complete vs. maximal vs. Zeno solutions of hybrid systems
kind: hierarchy
areas: [dynamics]
summary: >
  A solution of a [hybrid system](/definitions/hybrid-system) can flow and jump, and it can end in several ways or not at all.
  A maximal solution cannot be extended, and a complete solution goes on forever.
  A maximal solution can stop early by escaping to infinity or by getting stuck where it can neither flow nor jump.
  A [Zeno](/definitions/zeno-solution) solution is complete but jumps infinitely often in finite time.
relation: complete ⊂ maximal, and every Zeno solution is complete.
terms:
  - complete_solution
  - maximal_solution
  - zeno_solution
examples:
  - example: a_solution_of_the_bouncing_ball_with_a
  - example: a_solution_of_the_timer_dot_tau_eq_1_on_c_eq_0_1
  - example: the_solution_from_x_eq_0_of_xdot_eq_1_on_c_eq_0_1
  - example: the_solution_from_x_eq_1_of_xdot_eq_x_squared_on
  - example: a_solution_of_the_timer_dot_tau_eq_1_on_c_eq_0_1_2
see_also:
  - hybrid_vs_switched_systems
  - types_of_ode_solutions
---
## Notes

- Solutions of [hybrid systems](/definitions/hybrid-system) are defined on _hybrid time domains_, [subsets](/definitions/subset) of $[0, \infty) \times \setdef{0, 1, 2, \dots}$ that record both the ordinary time $t$ and the number of jumps $j$.
- Stability notions for hybrid systems, such as pre-asymptotic stability, are stated for maximal solutions, so that solutions which stop are not counted against stability.
