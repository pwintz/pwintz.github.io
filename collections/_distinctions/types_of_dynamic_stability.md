---
published: false
title: Types of stability
kind: family
areas: [dynamics, control]
status: draft
summary: >
  Stability means "stays close," and attractivity means "eventually converges." Neither implies the other, and asymptotic stability requires both.
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
      Solutions stay where they start.
  - example: xdot_eq_minus_x
    why: >-
      $x(t) = x(0) e^{-t}$ converges, but never reaches $0$.
  - example: xdot_eq_minus_x_cubed
    why: >-
      Solutions converge like $1 / \sqrt{2t}$, slower than any exponential.
  - example: xdot_eq_minus_x_plus_x_squared
    why: >-
      Solutions starting above $x = 1$ diverge.
  - example: xdot_eq_minus_sign_x_sqrt_x
    why: >-
      A solution starting at $x_0 > 0$ reaches $0$ at time $2 \sqrt{x_0}$.
  - example: dot_theta_eq_1_minus_cos_theta_on_the_circle
    why: >-
      Every solution converges to $\theta = 0$, but solutions starting just after $0$ first travel all the way around the circle.
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

- **Uniform stability** (for time-varying systems): the constants $\delta$ (and the rate of convergence) do not depend on the initial time. "Uniformly globally asymptotically stable" (UGAS) combines this with global asymptotic stability.
- **Stability of sets** (rather than points), such as a limit cycle or an attractor.
- **Linear systems:** $\dot{x} = A x$ is asymptotically stable exactly when $A$ is _Hurwitz_ (every eigenvalue has negative real part), and $x_{k+1} = A x_k$ is asymptotically stable exactly when $A$ is _Schur_ (every eigenvalue has magnitude less than $1$). It is _marginally stable_ if it is stable but not asymptotically stable.
- **Systems with inputs:** input-to-state stability (ISS), bounded-input bounded-output (BIBO) stability, and finite-gain $L_p$ stability describe how the state or output responds to inputs. See also [passivity](/distinctions/types-of-dynamic-passivity).
- **Robust and practical stability:** robust stability tolerates perturbations of the system; practical stability allows convergence to a small neighborhood instead of a point.
- **Hybrid systems:** _pre_-asymptotic stability allows solutions that are not complete (they stop), which is common in hybrid systems.
