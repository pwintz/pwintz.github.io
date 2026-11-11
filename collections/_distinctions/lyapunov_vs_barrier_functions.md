---
published: false
title: Lyapunov function vs. barrier function
kind: siblings
areas: [dynamics, control]
summary: >
  [Lyapunov functions](/dictionary/definitions/lyapunov-function) and barrier functions both certify properties of a dynamical system without solving it, using a function that behaves well along solutions.
  A Lyapunov function proves stability or convergence: it is positive definite and does not increase along solutions.
  A barrier function proves that a set is [forward invariant](/dictionary/definitions/forward-invariant) (safety): it need not be definite, and its derivative only needs the right sign near the boundary of the set.
terms:
  - lyapunov_function
  - barrier_function
  - barrier_certificate
examples:
  - example: v_x_eq_x_squared_for_xdot_eq_minus_x
    why: >-
      The sublevel sets of the Lyapunov function $V(x) = x^2$ are forward invariant, so $h = 1 - V$ is a barrier function for $[-1, 1]$.
  - example: h_x_eq_1_minus_x_squared_for_xdot_eq_0
  - example: h_x_eq_x_for_xdot_eq_1
  - example: b_x_eq_x_squared_minus_4_for_xdot_eq_minus_x_with
see_also:
  - types_of_lyapunov_functions
  - types_of_barrier_functions
  - types_of_dynamic_set_invariance
---
## Notes

- A [Lyapunov function](/dictionary/definitions/lyapunov-function) gives barrier functions for free: if $\dot{V} \leq 0$, each sublevel set $\setdef{x \suchthat V(x) \leq c}$ is [forward invariant](/dictionary/definitions/forward-invariant).
  The converse fails, because a barrier function says nothing about convergence.
- Stability is a property of an [equilibrium](/dictionary/definitions/equilibrium) (or set) and its [neighborhood](/dictionary/definitions/neighborhood).
  Safety is a property of where solutions go from a given initial set.
  A system can be safe without having any stable equilibrium.
- [Control Lyapunov functions](/dictionary/definitions/control-lyapunov-function) and [control barrier functions](/dictionary/definitions/control-barrier-function) are often combined in a single quadratic program that chooses an input to make progress toward a goal while staying safe.
