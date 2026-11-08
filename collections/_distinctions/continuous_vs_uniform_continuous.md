---
published: false
title: Continuous vs. uniformly continuous
kind: hierarchy
areas: [analysis]
summary: >
  Continuity says that small changes in input cause small changes in output, and uniform continuity asks for this at the same scale everywhere.
  A [continuous](/definitions/continuous) function may need a smaller $\delta$ at some points than at others.
  A [uniformly continuous](/definitions/uniformly-continuous) function has one $\delta$ that works everywhere.
relation: uniformly continuous ⊂ continuous
terms:
  - continuous
  - uniformly_continuous
examples:
  - example: x_sq_on_reals
  - example: x_to_e_x_on_reals
  - example: x_to_tan_x_on_minus_pi_2_pi_2
  - example: x_to_sin_1_x_on_0_infinity
  - example: x_to_sin_x_on_reals
  - example: x_to_sqrt_x_on_0_infinity
  - example: x_to_x_squared_on_0_1
see_also:
  - types_of_continuous
  - continuity_uniform_vs_absolute
---
## Notes

- Every [uniformly continuous](/definitions/uniformly-continuous) function is [continuous](/definitions/continuous) (as the name suggests), but some continuous functions are not uniformly continuous.
- Uniform continuity is defined for functions between [metric spaces](/definitions/metric-space) (or, more generally, uniform spaces), whereas continuity is defined for functions between all topological spaces.
- To distinguish continuity from uniform continuity, the former is sometimes called "ordinary continuity" or "pointwise continuity."
- Uniform continuity is a global property, whereas continuity is a local property.
- On a [compact](/definitions/compact) domain, every continuous function is uniformly continuous (the Heine–Cantor theorem).
