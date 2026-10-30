---
published: false
title: Lyapunov function vs. barrier function
kind: siblings
areas: [dynamics, control]
status: draft
summary: >
  A Lyapunov function proves stability or convergence: it is positive definite and does not increase along solutions.
  A barrier function proves that a set is forward invariant (safety): it need not be definite, and its derivative only needs the right sign near the boundary of the set.
terms:
  - lyapunov_function
  - barrier_function
  - barrier_certificate
examples:
  - example: v_x_eq_x_squared_for_xdot_eq_minus_x
    why: >-
      $\dot{V} = -2 x^2$. Its sublevel sets are forward invariant, so $h = 1 - V$ is also a barrier function for $[-1, 1]$.
  - example: h_x_eq_1_minus_x_squared_for_xdot_eq_0
    why: >-
      $\nabla h(x) \cdot f(x) = 0$, so $[-1, 1]$ is forward invariant. But nothing converges, and $h$ is not positive definite.
  - example: h_x_eq_x_for_xdot_eq_1
    why: >-
      $[0, \infty)$ is forward invariant, even though the system has no equilibrium at all.
  - example: b_x_eq_x_squared_minus_4_for_xdot_eq_minus_x_with
    why: >-
      $B \leq -3$ on $X_0$, $B \geq 5$ on $X_u$, and $\nabla B(x) \cdot f(x) = -2 x^2 \leq 0$. It decreases along solutions but is not positive definite, since $B(0) = -4$.
see_also:
  - types_of_lyapunov_functions
  - types_of_barrier_functions
  - types_of_dynamic_set_invariance
---
## Notes

- A Lyapunov function gives barrier functions for free: if $\dot{V} \leq 0$, each sublevel set $\lbrace x : V(x) \leq c \rbrace$ is forward invariant. The converse fails, because a barrier function says nothing about convergence.
- Stability is a property of an equilibrium (or set) and its neighborhood. Safety is a property of where solutions go from a given initial set. A system can be safe without having any stable equilibrium.
- Control Lyapunov functions and control barrier functions are often combined in a single quadratic program that chooses an input to make progress toward a goal while staying safe.
