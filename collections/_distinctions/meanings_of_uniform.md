---
published: false
title: 'Meanings of "uniform"'
kind: conflicting
areas: [language, analysis]
summary: >
  "Uniform" means "the same everywhere," and what is the same depends on the context.
  A property holds uniformly in a parameter when the same constants work for every value of the parameter, as in uniform continuity and [uniform convergence](/dictionary/definitions/uniform-convergence).
  A [uniform distribution](/dictionary/definitions/uniform-distribution) gives every [outcome](/dictionary/definitions/outcome) the same [probability](/dictionary/definitions/probability), and a uniform field or material has the same value at every point.
terms:
  - uniform_in_parameter
  - uniformly_continuous
  - uniform_convergence
  - uniformly_stable
  - uniform_distribution
  - spatially_uniform
examples:
  - example: x_to_sin_x_on_reals
  - example: x_sq_on_reals
    why: >-
      $x \mapsto x^2$ is continuous at every point, but the $\delta$ needed for a given $\varepsilon$ shrinks as $\abs{x}$ grows, so it is continuous but not uniformly continuous.
  - example: x_n_to_0_on_0_1_over_2
  - example: x_n_to_0_on_0_1
    why: >-
      On $[0, 1)$, $x^n \to 0$ at every point, but the $N$ needed for a given $\varepsilon$ grows without bound as $x \to 1$, so the convergence is pointwise but not uniform.
  - example: a_uniform_random_number_on_0_1_is_rational
  - example: field_between_parallel_plates
  - example: xdot_eq_minus_x
  - example: xdot_eq_6t_sin_t_minus_2t_x
    why: >-
      The origin of $\dot{x} = (6 t \sin t - 2 t) x$ is stable for each initial time, but the $\delta$ needed shrinks as the initial time grows, so it is stable but not uniformly stable.
see_also:
  - types_of_unchanging
  - continuous_vs_uniform_continuous
---
