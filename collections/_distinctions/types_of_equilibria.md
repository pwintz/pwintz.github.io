---
published: false
title: Equilibrium vs. fixed point vs. steady state vs. set point vs. operating point
kind: siblings
areas: [dynamics, control]
status: draft
summary: >
  Several terms describe states that a system rests at or aims for.
  An equilibrium is a state where the system stays put.
  In discrete time it is a fixed point of the update map, but in continuous time it is a zero of the vector field.
  A steady state is what the system settles into, which need not be an equilibrium.
  An operating point pairs an equilibrium with its input, and a set point is a target.
terms:
  - equilibrium
  - fixed_point
  - steady_state
  - set_point
  - operating_point
examples:
  - example: 1_for_xdot_eq_f_x_eq_1_minus_x
    why: >-
      $1$ is an equilibrium because $f(1) = 0$, and it is the steady state because every solution settles there.
      It is not a fixed point of $f$, because $f(1) = 0 \neq 1$.
  - example: 1_over_2_for_xdot_eq_f_x_eq_1_minus_x
    why: >-
      $\frac{1}{2}$ is a fixed point of $f$ because $f(\frac{1}{2}) = \frac{1}{2}$.
      It is not an equilibrium or a steady state, because $\dot{x} = \frac{1}{2}$ there, so the state does not stay.
  - example: 2_for_x_k_plus_1_eq_1_over_2_x_k_plus_1
    why: >-
      $2$ is a fixed point of the update map because $\frac{1}{2} \cdot 2 + 1 = 2$, so it is an equilibrium, since in discrete time the equilibria are exactly the fixed points of the update map.
      It is the steady state because every solution converges to it.
  - example: 1_over_2_sin_t_minus_cos_t_for_xdot_eq_minus_x
    why: >-
      $\frac{1}{2}(\sin t - \cos t)$ is the steady state because every solution approaches this oscillation.
      It is not an equilibrium or an operating point, because it is not constant, and the system has no equilibrium.
  - example: x_ast_u_ast_eq_1_1_for_xdot_eq_minus_x_plus_u
    why: >-
      $(1, 1)$ is an operating point because, with the constant input $u = 1$, the state $x = 1$ is an equilibrium: $-1 + 1 = 0$.
  - example: a_thermostat_setting_of_20_degrees
    why: >-
      A thermostat setting of $20$ degrees is a set point because it is a target chosen for the room.
      It is not an equilibrium or an operating point, because on a very cold day, the room may not reach it.
see_also:
  - regulation_vs_tracking_vs_stabilization
  - types_of_dynamic_stability
  - types_of_unchanging
---
## Notes

- Equilibria are also called rest points, stationary points, or (in some texts) critical points, which can be confused with the critical points of a function, where its gradient is zero.
- An equilibrium is a special kind of steady state.
  Others include periodic orbits and, in chaotic systems, strange attractors.
