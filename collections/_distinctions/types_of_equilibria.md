---
published: false
title: Equilibrium vs. fixed point vs. steady state vs. set point vs. operating point
kind: siblings
areas: [dynamics, control]
summary: >
  Several terms describe states that a system rests at or aims for.
  An [equilibrium](/dictionary/definitions/equilibrium) is a state where the system stays put.
  In discrete time it is a [fixed point](/dictionary/definitions/fixed-point) of the update map, but in [continuous](/dictionary/definitions/continuous) time it is a zero of the vector field.
  A [steady state](/dictionary/definitions/steady-state) is what the system settles into, which need not be an equilibrium.
  A [set point](/dictionary/definitions/set-point) is a target, and an [operating point](/dictionary/definitions/operating-point) pairs an equilibrium with its input.
terms:
  - equilibrium
  - fixed_point
  - steady_state
  - set_point
  - operating_point
examples:
  - example: 1_for_xdot_eq_f_x_eq_1_minus_x
  - example: 1_over_2_for_xdot_eq_f_x_eq_1_minus_x
  - example: 2_for_x_k_plus_1_eq_1_over_2_x_k_plus_1
  - example: 1_over_2_sin_t_minus_cos_t_for_xdot_eq_minus_x
  - example: x_ast_u_ast_eq_1_1_for_xdot_eq_minus_x_plus_u
  - example: a_thermostat_setting_of_20_degrees
see_also:
  - regulation_vs_tracking_vs_stabilization
  - types_of_dynamic_stability
  - types_of_unchanging
---
## Notes

- Equilibria are also called rest points, [stationary points](/dictionary/definitions/equilibrium), or (in some texts) critical points, which can be confused with the critical points of a function, where its [gradient](/dictionary/definitions/gradient) is zero.
- An equilibrium is a special kind of [steady state](/dictionary/definitions/steady-state).
  Others include [periodic](/dictionary/definitions/periodic) orbits and, in chaotic systems, strange [attractors](/dictionary/definitions/attractor).
