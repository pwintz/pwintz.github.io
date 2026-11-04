---
published: false
title: Types of Lyapunov functions
kind: siblings
areas: [dynamics, control]
status: draft
summary: >
  A Lyapunov function decreases along the solutions of a system without inputs.
  A control Lyapunov function can be made to decrease by choosing the input.
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
      $V(x) = x^2$ is a Lyapunov function for $\dot{x} = -x$ because it is positive definite and $\dot{V} = -2 x^2$ is negative definite.
  - example: v_x_eq_x_squared_for_xdot_eq_x_plus_u
    why: >-
      $V(x) = x^2$ is a control Lyapunov function for $\dot{x} = x + u$ because the input $u = -2x$ gives $\dot{V} = -2 x^2 < 0$.
      It is not a Lyapunov function, because with $u = 0$, $\dot{V} = 2 x^2 > 0$.
  - example: v_x_eq_x_squared_for_xdot_eq_minus_x_plus_d
    why: >-
      $V(x) = x^2$ is an ISS Lyapunov function for $\dot{x} = -x + d$ because $\dot{V} = -2 x^2 + 2 x d \leq -x^2 + d^2$, since $2 x d \leq x^2 + d^2$.
      With $d = 0$, it is a Lyapunov function.
  - example: v_x_eq_x_squared_for_xdot_eq_minus_x_plus_x
    why: >-
      $V(x) = x^2$ is a Lyapunov function for $\dot{x} = -x + x^2 d$ with $d = 0$, because then $\dot{V} = -2 x^2$.
      It is not an ISS Lyapunov function, because the constant input $d = 1$ makes solutions starting above $1$ blow up, so the system is not ISS.
  - example: v_x_eq_x_squared_for_xdot_eq_x
    why: >-
      $V(x) = x^2$ is not a Lyapunov function for $\dot{x} = x$, because $\dot{V} = 2 x^2 > 0$.
      It is not a control or ISS Lyapunov function, because there is no input to change that.
see_also:
  - lyapunov_vs_barrier_functions
  - types_of_input_output_stability
  - types_of_dynamic_stability
---
## Notes

- A Lyapunov function is a property of a system with no input (or a fixed feedback law).
  A control Lyapunov function is a property of a control system, before a feedback law is chosen.
- Lyapunov's direct method uses a Lyapunov function to prove stability without solving the system.
  See [stability criteria](/distinctions/types-stability-criterion).
