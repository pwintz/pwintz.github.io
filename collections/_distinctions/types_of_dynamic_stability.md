---
published: false
title: Types of stability
kind: family
areas: [dynamics, control]
status: draft
summary: >
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
    why: >-
      The origin of $\dot{x} = 0$ is Lyapunov stable because solutions stay where they start.
      It is not attractive, so it is not asymptotically, globally asymptotically, exponentially, or finite-time stable.
  - example: xdot_eq_minus_x
    why: >-
      The origin of $\dot{x} = -x$ is globally exponentially stable because $x(t) = x(0) e^{-t}$, so it is also Lyapunov stable, attractive, and (globally) asymptotically stable.
      It is not finite-time stable, because solutions converge but do not reach $0$.
  - example: xdot_eq_minus_x_cubed
    why: >-
      The origin of $\dot{x} = -x^3$ is globally asymptotically stable, and so Lyapunov stable and attractive, because every solution decreases in size to $0$.
      It is not exponentially or finite-time stable, because solutions converge like $1 / \sqrt{2t}$, slower than any exponential.
  - example: xdot_eq_minus_x_plus_x_squared
    why: >-
      The origin of $\dot{x} = -x + x^2$ is exponentially stable, and so Lyapunov stable, attractive, and asymptotically stable, because the linearization is $\dot{x} = -x$.
      It is not globally asymptotically stable, because solutions starting above $x = 1$ diverge, and it is not finite-time stable.
  - example: xdot_eq_minus_sign_x_sqrt_x
    why: >-
      The origin of $\dot{x} = -\operatorname{sign}(x) \sqrt{\lvert x \rvert}$ is finite-time stable because a solution starting at $x_0 > 0$ reaches $0$ at time $2 \sqrt{x_0}$.
      So it is also Lyapunov stable, attractive, and globally asymptotically stable.
  - example: dot_theta_eq_1_minus_cos_theta_on_the_circle
    why: >-
      The equilibrium $\theta = 0$ is attractive because every solution converges to it.
      It is not Lyapunov stable, and so not asymptotically stable, because solutions starting just after $0$ first travel all the way around the circle.
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
  "Uniformly globally asymptotically stable" (UGAS) combines this with global asymptotic stability.
- **Stability of sets** (rather than points), such as a limit cycle or an attractor.
- **Linear systems:** $\dot{x} = A x$ is asymptotically stable exactly when $A$ is _Hurwitz_ (every eigenvalue has negative real part), and $x_{k+1} = A x_k$ is asymptotically stable exactly when $A$ is _Schur_ (every eigenvalue has magnitude less than $1$).
  It is _marginally stable_ if it is stable but not asymptotically stable.
- **Systems with inputs:** input-to-state stability (ISS), bounded-input bounded-output (BIBO) stability, and finite-gain $L_p$ stability describe how the state or output responds to inputs.
  See also [passivity](/distinctions/types-of-dynamic-passivity).
- **Robust and practical stability:** robust stability tolerates perturbations of the system; practical stability allows convergence to a small neighborhood instead of a point.
- **Hybrid systems:** _pre_-asymptotic stability allows solutions that are not complete (they stop), which is common in hybrid systems.
