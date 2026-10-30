---
published: false
title: Stability criteria and which systems they apply to
kind: family
areas: [control, dynamics]
status: draft
summary: >
  Each stability test applies to a particular kind of system and information. Using a continuous-time test on a discrete-time system,
  or a linear test on a nonlinear system, gives meaningless results.
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
      Routh–Hurwitz checks for roots in the left half-plane.
  - example: discrete_time_lti_system_with_a_known
    why: >-
      Stability requires roots inside the unit circle, not the left half-plane.
  - example: feedback_loop_with_a_time_delay_from_measured
    why: >-
      A time delay makes the characteristic equation non-polynomial, but the Nyquist plot still applies.
  - example: nonlinear_system_with_a_candidate_energy_function
    why: >-
      Lyapunov's direct method works on the nonlinear system itself.
  - example: equilibrium_of_xdot_eq_minus_x_cubed
    why: >-
      The linearization $\dot{x} = 0$ has eigenvalue $0$, so the indirect method is inconclusive, but $V = x^2$ shows asymptotic stability.
  - example: linear_plant_in_feedback_with_an_uncertain_sector
    why: >-
      A Lur'e system, for which the circle criterion gives absolute stability.
see_also:
  - types_of_dynamic_stability
  - types_of_dynamic_passivity
  - gain_margin_vs_phase_margin
  - types_of_lyapunov_functions
---
## Notes

- For linear systems, the eigenvalue test (Hurwitz or Schur) is exact. A repeated eigenvalue on the imaginary axis with a nontrivial Jordan block makes $\dot{x} = A x$ unstable, while a simple one gives marginal stability.
- Krasovskii's method constructs a Lyapunov function from $f$ itself, such as $V(x) = f(x)^{\top} f(x)$.
- The negative feedback connection of two passive systems is passive, and under additional conditions (such as strict passivity of one of them, or zero-state observability), its equilibrium is asymptotically stable. This is another way to prove stability without solving the system.
