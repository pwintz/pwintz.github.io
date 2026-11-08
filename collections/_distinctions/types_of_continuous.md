---
published: false
title: Types of continuity
kind: siblings
areas: [analysis]
summary: >
  There are several strengths of continuity.
  On a [compact](/definitions/compact) interval, each is a special case of the next, from [continuously differentiable](/definitions/continuously-differentiable) to [continuous](/definitions/continuous).
relation: >
  On a compact interval $[a, b]$:
  continuously differentiable ⊂ Lipschitz continuous ⊂ absolutely continuous ⊂ uniformly continuous = continuous.
terms:
  - continuous
  - uniformly_continuous
  - Lipschitz_continuous
  - continuously_differentiable
  - absolutely_continuous
examples:
  - example: x_to_x_squared_on_0_1
  - example: f_x_eq_x_squared_sin_1_x_for_x_neq_0_f_0_eq_0_on
  - example: x_to_sqrt_x_on_0_1
  - example: the_cantor_function_on_0_1
  - example: x_to_sin_1_x_on_0_1
  - example: square_on_reals
see_also:
  - continuous_vs_uniform_continuous
  - continuity_uniform_vs_absolute
  - continuity_absolute_vs_Lipschitz
  - continuity_Lipschitz_vs_continuously_differentiable
---
## Notes

- Each neighboring pair in the chain has its own page, listed under "See also."
- On domains other than [compact](/definitions/compact) intervals, the chain changes.
  [Lipschitz continuous](/definitions/lipschitz-continuous) ⊂ [uniformly continuous](/definitions/uniformly-continuous) ⊂ [continuous](/definitions/continuous) still holds, but continuous functions need not be uniformly continuous, and [continuously differentiable](/definitions/continuously-differentiable) functions need not be Lipschitz continuous (see the last two examples).
- Hölder continuity lies between Lipschitz continuity and uniform continuity.
  It is not covered here yet.
