---
published: false
title: Stability criteria and which systems they apply to
kind: family
areas: [control, dynamics]
status: draft
summary: >
  Each stability test applies to a particular kind of system and information.
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
      The Routh–Hurwitz criterion applies, because it checks whether all roots of a polynomial are in the left half-plane.
      Lyapunov's direct and indirect methods also apply, but the Jury criterion does not, because it is for discrete time.
  - example: discrete_time_lti_system_with_a_known
    why: >-
      The Jury criterion applies, because it checks whether all roots of a polynomial are inside the unit circle.
      The Routh–Hurwitz criterion does not, because discrete-time stability requires roots inside the unit circle, not in the left half-plane.
  - example: feedback_loop_with_a_time_delay_from_measured
    why: >-
      The Nyquist criterion applies, because it uses the open-loop frequency response, which can be measured.
      The Routh–Hurwitz and Jury criteria do not, because a time delay makes the characteristic equation non-polynomial.
  - example: nonlinear_system_with_a_candidate_energy_function
    why: >-
      Lyapunov's direct method applies, because it works on the nonlinear system itself, with the energy function as a candidate Lyapunov function.
      The Routh–Hurwitz, Jury, and Nyquist criteria do not, because they are for linear systems.
  - example: equilibrium_of_xdot_eq_minus_x_cubed
    why: >-
      Lyapunov's direct method applies, because $V = x^2$ gives $\dot{V} = -2 x^4$, which shows asymptotic stability.
      The indirect method is inconclusive, because the linearization $\dot{x} = 0$ has eigenvalue $0$.
  - example: linear_plant_in_feedback_with_an_uncertain_sector
    why: >-
      This is a Lur'e system, so the circle criterion applies and gives absolute stability, and it is proved with Lyapunov's direct method.
      The Routh–Hurwitz and Jury criteria do not apply, because the nonlinearity is uncertain.
see_also:
  - types_of_dynamic_stability
  - types_of_dynamic_passivity
  - gain_margin_vs_phase_margin
  - types_of_lyapunov_functions
---
## Notes

- For linear systems, the eigenvalue test (Hurwitz or Schur) is exact.
  A repeated eigenvalue on the imaginary axis with a nontrivial Jordan block makes $\dot{x} = A x$ unstable, while a simple one gives marginal stability.
- Krasovskii's method constructs a Lyapunov function from $f$ itself, such as $V(x) = f(x)^{\top} f(x)$.
- The negative feedback connection of two passive systems is passive, and under additional conditions (such as strict passivity of one of them, or zero-state observability), its equilibrium is asymptotically stable.
  This is another way to prove stability without solving the system.
