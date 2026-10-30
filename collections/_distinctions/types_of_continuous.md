---
published: false
title: Types of continuity
kind: siblings
areas: [analysis]
status: draft
summary: >
  There are several strengths of continuity.
  On a compact interval, each is a special case of the next, from continuously differentiable to continuous.
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
    why: >-
      Its derivative $2x$ is continuous and bounded on $[0, 1]$.
  - example: f_x_eq_x_squared_sin_1_x_for_x_neq_0_f_0_eq_0_on
    why: >-
      Its derivative is bounded but not continuous at $0$.
  - example: x_to_sqrt_x_on_0_1
    why: >-
      It is the integral of its derivative, but its slope is unbounded near $0$.
  - example: the_cantor_function_on_0_1
    why: >-
      It rises from $0$ to $1$, but its derivative is $0$ almost everywhere.
  - example: x_to_sin_1_x_on_0_1
    why: >-
      Not a compact interval: the function oscillates faster and faster as $x \to 0$.
  - example: square_on_reals
    why: >-
      Not a compact interval: its slope is unbounded.
see_also:
  - continuous_vs_uniform_continuous
  - continuity_uniform_vs_absolute
  - continuity_absolute_vs_Lipschitz
  - continuity_Lipschitz_vs_continuously_differentiable
---
## Notes

- Each neighboring pair in the chain has its own page, listed under "See also."
- On domains other than compact intervals, the chain changes.
  Lipschitz continuous ⊂ uniformly continuous ⊂ continuous still holds, but continuous functions need not be uniformly continuous, and continuously differentiable functions need not be Lipschitz continuous (see the last two examples).
- Hölder continuity lies between Lipschitz continuity and uniform continuity. It is not covered here yet.
