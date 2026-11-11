---
published: false
title: Controllable vs. reachable vs. stabilizable
kind: hierarchy
areas: [control]
summary: >
  Controllability, reachability, and stabilizability describe how much a [control input](/dictionary/definitions/control-input) can influence the state of a system.
  A [controllable](/dictionary/definitions/controllable) system can be steered from every state to the origin, and a [reachable](/dictionary/definitions/reachable) system can be steered from the origin to every state.
  A [stabilizable](/dictionary/definitions/stabilizable) system only needs feedback that makes it converge, so its uncontrollable parts must already be stable.
relation: >
  controllable ⊂ stabilizable, and for continuous-time linear systems, controllable = reachable.
terms:
  - controllable
  - reachable
  - stabilizable
examples:
  - example: xdot_eq_u
  - example: dot_x_1_eq_x_2_dot_x_2_eq_u_double_integrator
  - example: dot_x_1_eq_minus_x_1_dot_x_2_eq_x_2_plus_u
  - example: xdot_eq_x_plus_0_cdot_u
  - example: x_k_plus_1_eq_0_cdot_x_k_plus_0_cdot_u_k
see_also:
  - observable_vs_detectable_vs_reconstructible
  - state_vs_output_feedback
  - types_of_dynamic_stability
---
## Notes

- The discrete-time example shows why "[controllable](/dictionary/definitions/controllable)" and "[reachable](/dictionary/definitions/reachable)" are different definitions.
  They agree for continuous-time linear systems, and for discrete-time linear systems with an [invertible](/dictionary/definitions/invertible-matrix) $A$.
- For nonlinear systems, controllability does not imply stabilizability by [continuous](/dictionary/definitions/continuous) feedback.
  The nonholonomic integrator is controllable, but Brockett's condition shows that no continuous [static feedback](/dictionary/definitions/static-feedback) stabilizes it.
