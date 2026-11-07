---
published: false
title: Lyapunov function vs. barrier function
kind: siblings
areas: [dynamics, control]
status: draft
summary: >
  Lyapunov functions and barrier functions both certify properties of a dynamical system without solving it, using a function that behaves well along solutions.
  A Lyapunov function proves stability or convergence: it is positive definite and does not increase along solutions.
  A barrier function proves that a set is forward invariant (safety): it need not be definite, and its derivative only needs the right sign near the boundary of the set.
terms:
  - lyapunov_function
  - barrier_function
  - barrier_certificate
examples:
  - example: v_x_eq_x_squared_for_xdot_eq_minus_x
    why: >-
      $V(x) = x^2$ is a Lyapunov function for $\dot{x} = -x$ because it is positive definite and $\dot{V} = -2 x^2$ is negative definite.
      Its sublevel sets are forward invariant, so $h = 1 - V$ is a barrier function for $[-1, 1]$.
  - example: h_x_eq_1_minus_x_squared_for_xdot_eq_0
    why: >-
      $h(x) = 1 - x^2$ is a barrier function for $\dot{x} = 0$ because $\nabla h(x) \cdot f(x) = 0$, so $[-1, 1]$ is forward invariant.
      It is not a Lyapunov function, because $h$ is not positive definite and no solution converges.
  - example: h_x_eq_x_for_xdot_eq_1
    why: >-
      $h(x) = x$ is a barrier function for $\dot{x} = 1$ because $\nabla h(x) \cdot f(x) = 1 \geq 0$, so $[0, \infty)$ is forward invariant.
      It is not a Lyapunov function, because the system has no equilibrium at all.
  - example: b_x_eq_x_squared_minus_4_for_xdot_eq_minus_x_with
    why: >-
      $B(x) = x^2 - 4$ is a barrier certificate because $B \leq -3$ on $X_0$, $B \geq 5$ on $X_u$, and $\nabla B(x) \cdot f(x) = -2 x^2 \leq 0$.
      It is not a Lyapunov function, because it is not positive definite, since $B(0) = -4$.
see_also:
  - types_of_lyapunov_functions
  - types_of_barrier_functions
  - types_of_dynamic_set_invariance
---
## Notes

- A Lyapunov function gives barrier functions for free: if $\dot{V} \leq 0$, each sublevel set $\setdef{x \suchthat V(x) \leq c}$ is forward invariant.
  The converse fails, because a barrier function says nothing about convergence.
- Stability is a property of an equilibrium (or set) and its neighborhood.
  Safety is a property of where solutions go from a given initial set.
  A system can be safe without having any stable equilibrium.
- Control Lyapunov functions and control barrier functions are often combined in a single quadratic program that chooses an input to make progress toward a goal while staying safe.
