---
published: false
title: Complete vs. maximal vs. Zeno solutions of hybrid systems
kind: hierarchy
areas: [dynamics]
status: draft
summary: >
  A maximal solution cannot be extended, and a complete solution goes on forever.
  A maximal solution can stop early by escaping to infinity or by getting stuck where it can neither flow nor jump.
  A Zeno solution is complete but jumps infinitely often in finite time.
relation: complete ⊂ maximal, and every Zeno solution is complete.
terms:
  - complete_solution
  - maximal_solution
  - zeno_solution
examples:
  - example: a_solution_of_the_bouncing_ball_with_a
    why: >-
      The bouncing ball's solution is complete and maximal because it has infinitely many bounces.
      It is Zeno because the time between bounces shrinks geometrically, so the infinitely many bounces happen in finite time.
  - example: a_solution_of_the_timer_dot_tau_eq_1_on_c_eq_0_1
    why: >-
      The timer's solution is complete and maximal because it flows for one unit of time between jumps, without end.
      It is not Zeno, because its flow time grows without bound.
  - example: the_solution_from_x_eq_0_of_xdot_eq_1_on_c_eq_0_1
    why: >-
      This solution is maximal because at $x = 1$ it can neither flow (it would leave $C$) nor jump ($D$ is empty), so it cannot be extended.
      It is not complete, because it stops at time $1$.
  - example: the_solution_from_x_eq_1_of_xdot_eq_x_squared_on
    why: >-
      This solution is $x(t) = \frac{1}{1 - t}$, which is maximal because it escapes to infinity at $t = 1$ and so cannot be extended.
      It is not complete, because it exists only for $t < 1$.
  - example: a_solution_of_the_timer_dot_tau_eq_1_on_c_eq_0_1_2
    why: >-
      The restricted solution is not maximal, because it can be extended past $t = \frac{1}{2}$.
      It is not complete, because it stops at $t = \frac{1}{2}$.
see_also:
  - hybrid_vs_switched_systems
  - types_of_ode_solutions
---
## Notes

- Solutions of hybrid systems are defined on _hybrid time domains_, subsets of $[0, \infty) \times \lbrace 0, 1, 2, \dots \rbrace$ that record both the ordinary time $t$ and the number of jumps $j$.
- Stability notions for hybrid systems, such as pre-asymptotic stability, are stated for maximal solutions, so that solutions which stop are not counted against stability.
