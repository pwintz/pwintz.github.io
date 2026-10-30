---
published: false
title: Equilibrium vs. fixed point vs. steady state vs. set point vs. operating point
kind: siblings
areas: [dynamics, control]
status: draft
summary: >
  An equilibrium is a state where the system stays put. In discrete time it is a fixed point of the update map, but in continuous time it is a zero of the vector field.
  A steady state is what the system settles into, which need not be an equilibrium. An operating point pairs an equilibrium with its input, and a set point is a target.
terms:
  - equilibrium
  - fixed_point
  - steady_state
  - set_point
  - operating_point
examples:
  - example: 1_for_xdot_eq_f_x_eq_1_minus_x
    why: >-
      $f(1) = 0$, so $1$ is an equilibrium, and every solution settles there. But $f(1) \neq 1$, so it is not a fixed point of $f$.
  - example: 1_over_2_for_xdot_eq_f_x_eq_1_minus_x
    why: >-
      $f(\frac{1}{2}) = \frac{1}{2}$, but the state does not stay there, since $\dot{x} = \frac{1}{2}$.
  - example: 2_for_x_k_plus_1_eq_1_over_2_x_k_plus_1
    why: >-
      In discrete time, equilibria are exactly the fixed points of the update map.
  - example: 1_over_2_sin_t_minus_cos_t_for_xdot_eq_minus_x
    why: >-
      Every solution approaches this oscillation, but there is no equilibrium.
  - example: x_ast_u_ast_eq_1_1_for_xdot_eq_minus_x_plus_u
    why: >-
      With the constant input $u = 1$, the state $x = 1$ is an equilibrium.
  - example: a_thermostat_setting_of_20_degrees
    why: >-
      It is a target. On a very cold day, the room may never reach it.
see_also:
  - regulation_vs_tracking_vs_stabilization
  - types_of_dynamic_stability
  - types_of_unchanging
---
## Notes

- Equilibria are also called rest points, stationary points, or (in some texts) critical points, which can be confused with the critical points of a function, where its gradient is zero.
- An equilibrium is a special kind of steady state. Others include periodic orbits and, in chaotic systems, strange attractors.
