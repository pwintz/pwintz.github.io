---
published: false
title: Types of Lyapunov functions
kind: siblings
areas: [dynamics, control]
status: draft
summary: >
  A Lyapunov function decreases along the solutions of a system without inputs. A control Lyapunov function can be made to decrease by choosing the input.
  An ISS-Lyapunov function decreases whenever the state is large compared with a disturbance input.
terms:
  - lyapunov_function
  - control_lyapunov_function
  - iss_lyapunov_function
examples_note: >-
  In each row, is $V$ a ___ for the given system?
examples:
  - example: v_x_eq_x_squared_for_xdot_eq_minus_x
    why: >-
      $\dot{V} = -2 x^2$, which is negative definite.
  - example: v_x_eq_x_squared_for_xdot_eq_x_plus_u
    why: >-
      With $u = 0$, $\dot{V} = 2 x^2 > 0$. But the input $u = -2x$ gives $\dot{V} = -2 x^2 < 0$.
  - example: v_x_eq_x_squared_for_xdot_eq_minus_x_plus_d
    why: >-
      $\dot{V} = -2 x^2 + 2 x d \leq -x^2 + d^2$, since $2 x d \leq x^2 + d^2$. With $d = 0$, it is a Lyapunov function.
  - example: v_x_eq_x_squared_for_xdot_eq_minus_x_plus_x
    why: >-
      With $d = 0$, the origin is globally asymptotically stable. But the constant input $d = 1$ makes solutions starting above $1$ blow up, so the system is not ISS.
  - example: v_x_eq_x_squared_for_xdot_eq_x
    why: >-
      $\dot{V} = 2 x^2 > 0$, and there is no input to change it.
see_also:
  - lyapunov_vs_barrier_functions
  - types_of_input_output_stability
  - types_of_dynamic_stability
---
## Notes

- A Lyapunov function is a property of a system with no input (or a fixed feedback law). A control Lyapunov function is a property of a control system, before a feedback law is chosen.
- Lyapunov's direct method uses a Lyapunov function to prove stability without solving the system. See [stability criteria](/distinctions/types-stability-criterion).
