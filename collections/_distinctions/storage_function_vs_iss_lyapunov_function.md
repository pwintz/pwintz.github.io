---
published: false
title: Storage Function vs. ISS-Lyapunov Function
kind: siblings
areas: [control, dynamics]
summary: >
  A storage function and an [ISS-Lyapunov function](/dictionary/definitions/iss-lyapunov-function) are both nonnegative functions of the state whose derivative along solutions is bounded by a term involving the input.
  A [storage function](/dictionary/definitions/storage-function) is bounded by the supply rate $u\trans y$, which depends on the output $y$ and need not decrease when $u = 0$.
  An ISS-Lyapunov function does not depend on an output and must decrease strictly whenever the state is large compared with the input.
terms:
  - storage_function
  - iss_lyapunov_function
examples_note: >-
  In each row, is $V$ a ___ for the given system?
examples:
  - example: v_x_eq_x_squared_over_2_for_xdot_eq_minus_x_plus_u_y_eq_x
  - example: v_x_eq_x_squared_over_2_for_xdot_eq_minus_x_plus_u_y_eq_minus_x
  - example: v_x_eq_x_squared_over_2_for_xdot_eq_u_y_eq_x
  - example: v_x_eq_x_squared_over_2_for_xdot_eq_x_plus_u_y_eq_x
see_also:
  - types_of_lyapunov_functions
  - types_of_dynamic_passivity
  - passive_vs_input_to_state_stable
---
## Notes

- Both functions satisfy a dissipation inequality $\dot{V} \leq w$ for a _supply rate_ $w$.
  For a [storage function](/dictionary/definitions/storage-function), $w = u\trans y$.
  For an [ISS-Lyapunov function](/dictionary/definitions/iss-lyapunov-function), $w = \sigma(\norm{d}) - \alpha_3(\norm{x})$.
- A storage function depends on the choice of output $y$, while an ISS-Lyapunov function does not.
  The same $V$ can be an ISS-Lyapunov function for a system and be a storage function for one output but not for another.
- With zero input, a storage function gives only $\dot{V} \leq 0$, which proves stability when $V$ is [positive definite](/dictionary/definitions/positive-definite-function).
  With zero input, an ISS-Lyapunov function gives $\dot{V} \leq -\alpha_3(\norm{x})$, which proves [global asymptotic stability](/dictionary/definitions/globally-asymptotically-stable).
- An ISS-Lyapunov function must satisfy $\alpha_1(\norm{x}) \leq V(x) \leq \alpha_2(\norm{x})$.
  A storage function only needs to satisfy $V \geq 0$, so it can be zero away from the origin.
- Suppose the output is the state, $y = x$, and $V$ satisfies $u\trans y \geq \dot{V} + \delta \norm{y}^2$ for some $\delta > 0$.
  Then $V$ is an ISS-Lyapunov function whenever it also satisfies the bounds $\alpha_1(\norm{x}) \leq V(x) \leq \alpha_2(\norm{x})$, because

  $$\dot{V} \leq u\trans x - \delta \norm{x}^2 \leq -\frac{\delta}{2} \norm{x}^2 + \frac{1}{2 \delta} \norm{u}^2.$$
