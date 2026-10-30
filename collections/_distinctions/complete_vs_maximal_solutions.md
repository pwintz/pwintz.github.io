---
published: false
title: Complete vs. maximal vs. Zeno solutions of hybrid systems
kind: hierarchy
areas: [dynamics]
status: draft
summary: >
  A maximal solution cannot be extended, and a complete solution goes on forever. A maximal solution can stop early by escaping to infinity or by getting stuck where it can neither flow nor jump.
  A Zeno solution is complete but jumps infinitely often in finite time.
relation: complete ⊂ maximal, and every Zeno solution is complete.
terms:
  - complete_solution
  - maximal_solution
  - zeno_solution
examples:
  - example: a_solution_of_the_bouncing_ball_with_a
    why: >-
      The time between bounces shrinks geometrically, so infinitely many bounces happen in finite time.
  - example: a_solution_of_the_timer_dot_tau_eq_1_on_c_eq_0_1
    why: >-
      It flows for one unit of time between jumps, forever.
  - example: the_solution_from_x_eq_0_of_xdot_eq_1_on_c_eq_0_1
    why: >-
      At $x = 1$, it can neither flow (it would leave $C$) nor jump ($D$ is empty), so it stops.
  - example: the_solution_from_x_eq_1_of_xdot_eq_x_squared_on
    why: >-
      It is $x(t) = \frac{1}{1 - t}$, which escapes to infinity at $t = 1$.
  - example: a_solution_of_the_timer_dot_tau_eq_1_on_c_eq_0_1_2
    why: >-
      It can be extended.
see_also:
  - hybrid_vs_switched_systems
  - types_of_ode_solutions
---
## Notes

- Solutions of hybrid systems are defined on _hybrid time domains_, subsets of $[0, \infty) \times \lbrace 0, 1, 2, \dots \rbrace$ that record both the ordinary time $t$ and the number of jumps $j$.
- Stability notions for hybrid systems, such as pre-asymptotic stability, are stated for maximal solutions, so that solutions which stop are not counted against stability.
