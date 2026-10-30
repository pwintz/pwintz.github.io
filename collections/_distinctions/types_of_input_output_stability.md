---
published: false
title: Types of input-output stability
kind: family
areas: [control, dynamics]
status: draft
summary: >
  Input-to-state stability bounds the state for every initial state and input. BIBO stability only requires bounded outputs for bounded inputs, starting from zero.
  A finite $L_2$ gain bounds the energy of the output by the energy of the input.
terms:
  - bibo_stable
  - input_to_state_stable
  - finite_l2_gain
examples:
  - example: xdot_eq_minus_x_plus_d_y_eq_x
    why: >-
      A stable linear system has all three properties.
  - example: xdot_eq_minus_x_cubed_plus_d_y_eq_x
    why: >-
      A small constant input $d = \varepsilon$ gives the steady state $x = \varepsilon^{1/3}$, which is much larger than $\varepsilon$. Over long times, no finite gain bounds the output energy.
  - example: xdot_eq_d_y_eq_x_an_integrator
    why: >-
      A constant input produces a ramp.
  - example: xdot_eq_x_y_eq_d
    why: >-
      The output ignores the state, so the input-output behavior is fine, but the state grows from any nonzero initial state.
see_also:
  - types_of_dynamic_stability
  - types_of_lyapunov_functions
  - types_of_dynamic_passivity
---
## Notes

- For linear time-invariant systems with a minimal realization, input-to-state stability, BIBO stability, finite $L_2$ gain, and asymptotic stability of the origin are all equivalent. The distinctions matter for nonlinear systems and for non-minimal realizations.
- Input-to-state stability is about the state from every initial state. BIBO stability and $L_2$ gain are about the input-output map, usually from the zero initial state.
