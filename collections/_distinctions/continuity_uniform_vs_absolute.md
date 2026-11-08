---
published: false
title: Uniformly continuous vs. absolutely continuous
kind: hierarchy
areas: [analysis]
summary: >
  Uniform and absolute continuity both strengthen continuity on an interval, but they control different things.
  Uniform continuity controls how much $f$ changes over one short interval.
  Absolute continuity controls the total change of $f$ over many short intervals at once.
relation: absolutely continuous ⊂ uniformly continuous
terms:
  - uniformly_continuous
  - absolutely_continuous
examples:
  - example: the_cantor_function_on_0_1
  - example: f_x_eq_x_sin_1_x_for_x_neq_0_f_0_eq_0_on_0_1
  - example: x_to_sqrt_x_on_0_1
see_also:
  - types_of_continuous
  - continuous_vs_uniform_continuous
  - continuity_absolute_vs_Lipschitz
---
## Notes

- Every [continuous](/definitions/continuous) function on a [compact](/definitions/compact) interval $[a, b]$ is [uniformly continuous](/definitions/uniformly-continuous), so on $[a, b]$ this is also the distinction between continuous and [absolutely continuous](/definitions/absolutely-continuous) functions.
- Taking $n = 1$ in the definition of absolute continuity gives the definition of uniform continuity, which is why every absolutely continuous function is uniformly continuous.
