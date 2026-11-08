---
published: false
title: Types of stability
kind: family
areas: [dynamics, control]
summary: >
  Stability describes how solutions behave near an [equilibrium](/definitions/equilibrium), and it comes in several strengths.
  Stability means "stays close," and attractivity means "eventually converges."
  Neither implies the other, and asymptotic stability requires both.
  Global, exponential, and finite-time stability strengthen asymptotic stability in different directions: where it holds, and how fast.
terms:
  - lyapunov_stable
  - asymptotically_stable
  - globally_asymptotically_stable
  - attractive
  - exponentially_stable
  - finite_time_stable
examples_note: >-
  Each row is about the equilibrium at $0$ (or $\theta = 0$) of the given system.
examples:
  - example: xdot_eq_0
  - example: xdot_eq_minus_x
  - example: xdot_eq_minus_x_cubed
  - example: xdot_eq_minus_x_plus_x_squared
  - example: xdot_eq_minus_sign_x_sqrt_x
  - example: dot_theta_eq_1_minus_cos_theta_on_the_circle
see_also:
  - types_of_comparison_functions
  - types_stability_criterion
  - types_of_dynamic_set_invariance
  - types_of_lyapunov_functions
  - types_of_input_output_stability
  - types_of_attracting_sets
---
## Other notions of stability

Each of these modifies the definitions above in a different direction.

- **Uniform stability** (for time-varying systems): the constants $\delta$ (and the rate of convergence) do not depend on the initial time.
  "Uniformly [globally asymptotically stable](/definitions/globally-asymptotically-stable)" (UGAS) combines this with global asymptotic stability.
- **Stability of sets** (rather than points), such as a [limit cycle](/definitions/limit-cycle) or an [attractor](/definitions/attractor).
- **Linear systems:** $\dot{x} = A x$ is [asymptotically stable](/definitions/asymptotically-stable) exactly when $A$ is _Hurwitz_ (every [eigenvalue](/definitions/eigenvalue) has negative real part), and $x_{k+1} = A x_k$ is asymptotically stable exactly when $A$ is _Schur_ (every eigenvalue has magnitude less than $1$).
  It is _marginally stable_ if it is stable but not asymptotically stable.
- **Systems with inputs:** input-to-state stability (ISS), bounded-input bounded-output (BIBO) stability, and finite-gain $L_p$ stability describe how the state or output responds to inputs.
  See also [passivity](/distinctions/types-of-dynamic-passivity).
- **Robust and practical stability:** robust stability tolerates [perturbations](/definitions/perturbation) of the system; practical stability allows convergence to a small [neighborhood](/definitions/neighborhood) instead of a point.
- **Hybrid systems:** _pre_-asymptotic stability allows solutions that are not complete (they stop), which is common in [hybrid systems](/definitions/hybrid-system).
