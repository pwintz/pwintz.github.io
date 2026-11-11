---
published: false
title: Types of passivity
kind: family
areas: [control]
summary: >
  Passivity describes systems that store and dissipate energy but cannot produce it.
  A [passive](/dictionary/definitions/passive) system cannot generate energy.
  The variants say where energy is dissipated: in proportion to the input, the output, or the state.
  A [lossless](/dictionary/definitions/lossless) system dissipates none.
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
  - example: first_order_lag_xdot_eq_minus_x_plus_u_y_eq_x
  - example: resistor_y_eq_u
  - example: frictionless_mass_on_a_spring_with_force_input
see_also:
  - types_of_dynamic_stability
---
## Notes

- Strict passivity dissipates energy whenever the state is nonzero.
  If the storage function $V$ is positive definite, it is then a [Lyapunov function](/dictionary/definitions/lyapunov-function), and the origin of the [unforced](/dictionary/definitions/unforced) system ($u = 0$) is [asymptotically stable](/dictionary/definitions/asymptotically-stable).
- Output strict passivity implies finite $L_2$ gain, a form of input-output stability.
