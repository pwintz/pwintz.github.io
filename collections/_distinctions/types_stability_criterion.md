---
published: false
title: Stability criteria and which systems they apply to
kind: family
areas: [control, dynamics]
summary: >
  Each stability test, such as the [Routh–Hurwitz](/dictionary/definitions/routh-hurwitz), [Jury](/dictionary/definitions/jury-criterion), [Nyquist](/dictionary/definitions/nyquist-criterion), and [circle](/dictionary/definitions/circle) criteria and Lyapunov's methods, applies to a particular kind of system and information.
  Using a continuous-time test on a discrete-time system, or a linear test on a nonlinear system, gives meaningless results.
terms:
  - routh_hurwitz
  - lyapunov_direct
  - lyapunov_indirect
  - jury_criterion
  - nyquist_criterion
  - circle_criterion
examples_note: >-
  Does the ___ test apply to the given problem?
examples:
  - example: continuous_time_lti_system_with_a_known
    why: >-
      Lyapunov's direct and indirect methods also apply to a continuous-time LTI system, but the Jury criterion does not, because it is for discrete time.
  - example: discrete_time_lti_system_with_a_known
  - example: feedback_loop_with_a_time_delay_from_measured
  - example: nonlinear_system_with_a_candidate_energy_function
  - example: equilibrium_of_xdot_eq_minus_x_cubed
  - example: linear_plant_in_feedback_with_an_uncertain_sector
see_also:
  - types_of_dynamic_stability
  - types_of_dynamic_passivity
  - gain_margin_vs_phase_margin
  - types_of_lyapunov_functions
---
## Notes

- For linear systems, the [eigenvalue](/dictionary/definitions/eigenvalue) test (Hurwitz or Schur) is exact.
  A repeated eigenvalue on the imaginary axis with a nontrivial Jordan block makes $\dot{x} = A x$ unstable, while a simple one gives marginal stability.
- Krasovskii's method constructs a [Lyapunov function](/dictionary/definitions/lyapunov-function) from $f$ itself, such as $V(x) = f(x)^{\top} f(x)$.
- The negative feedback connection of two [passive](/dictionary/definitions/passive) systems is passive, and under additional conditions (such as strict passivity of one of them, or zero-state observability), its [equilibrium](/dictionary/definitions/equilibrium) is [asymptotically stable](/dictionary/definitions/asymptotically-stable).
  This is another way to prove stability without solving the system.
