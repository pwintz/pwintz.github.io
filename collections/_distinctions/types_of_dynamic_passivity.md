---
published: false
title: Types of passivity
kind: family
areas: [control]
status: draft
summary: >
  A passive system cannot generate energy. The variants say where energy is dissipated: in proportion to the input, the output, or the state.
  A lossless system dissipates none.
terms:
  - passive
  - lossless
  - input_strictly_passive
  - output_strictly_passive
  - strictly_passive
examples_note: >-
  These follow the definitions in Khalil's _Nonlinear Systems_.
examples:
  - example: integrator_xdot_eq_u_y_eq_x
    why: >-
      With $V = \frac{1}{2} x^2$, $\dot{V} = x u = u y$ exactly.
  - example: first_order_lag_xdot_eq_minus_x_plus_u_y_eq_x
    why: >-
      With $V = \frac{1}{2} x^2$, $u y = \dot{V} + y^2$. It is not input strictly passive, because its gain $\operatorname{Re} \frac{1}{1 + i \omega}$ tends to $0$ at high frequencies.
  - example: resistor_y_eq_u
    why: >-
      $u y = u^2 = y^2$, with $V = 0$. It has no state.
  - example: frictionless_mass_on_a_spring_with_force_input
    why: >-
      The total mechanical energy changes exactly by the work done by the input.
see_also:
  - types_of_dynamic_stability
---
## Notes

- Strict passivity dissipates energy whenever the state is nonzero. If the storage function $V$ is positive definite, it is then a Lyapunov function, and the origin of the unforced system ($u = 0$) is asymptotically stable.
- Output strict passivity implies finite $L_2$ gain, a form of input-output stability.
