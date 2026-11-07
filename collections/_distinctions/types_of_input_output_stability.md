---
published: false
title: Types of input-output stability
kind: family
areas: [control, dynamics]
status: draft
summary: >
  For a system with inputs, stability can be required of the state or only of the output.
  Input-to-state stability bounds the state for every initial state and input.
  BIBO stability only requires bounded outputs for bounded inputs, starting from zero.
  A finite $L_2$ gain bounds the energy of the output by the energy of the input.
terms:
  - bibo_stable
  - input_to_state_stable
  - finite_l2_gain
examples:
  - example: xdot_eq_minus_x_plus_d_y_eq_x
    why: >-
      $\dot{x} = -x + d$, $y = x$ is input-to-state stable, BIBO stable, and has finite $L^2$ gain, because it is a stable linear system.
  - example: xdot_eq_minus_x_cubed_plus_d_y_eq_x
    why: >-
      $\dot{x} = -x^3 + d$, $y = x$ is input-to-state stable, and so BIBO stable, because bounded inputs give bounded states.
      It does not have finite $L^2$ gain, because a small constant input $d = \varepsilon$ gives the steady state $x = \varepsilon^{1/3}$, which is much larger than $\varepsilon$, so over long times no finite gain bounds the output energy.
  - example: xdot_eq_d_y_eq_x_an_integrator
    why: >-
      The integrator is not input-to-state stable, BIBO stable, or of finite $L^2$ gain, because a constant input produces a ramp.
  - example: xdot_eq_x_y_eq_d
    why: >-
      $\dot{x} = x$, $y = d$ is BIBO stable and has finite $L^2$ gain, because the output equals the input and ignores the state.
      It is not input-to-state stable, because the state grows from any nonzero initial state.
see_also:
  - types_of_dynamic_stability
  - types_of_lyapunov_functions
  - types_of_dynamic_passivity
---
## Notes

- For linear time-invariant systems with a minimal realization, input-to-state stability, BIBO stability, finite $L_2$ gain, and asymptotic stability of the origin are all equivalent.
  The distinctions matter for nonlinear systems and for non-minimal realizations.
- Input-to-state stability is about the state from every initial state.
  BIBO stability and $L_2$ gain are about the input-output map, usually from the zero initial state.
