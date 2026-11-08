---
published: false
title: Lipschitz continuous vs. continuously differentiable
kind: hierarchy
areas: [analysis]
summary: >
  Lipschitz continuity and [continuous](/definitions/continuous) differentiability both rule out functions that are too steep or too wild, but in different ways.
  A [Lipschitz continuous](/definitions/lipschitz-continuous) function has a [bounded](/definitions/bounded) slope but may have corners.
  A [continuously differentiable](/definitions/continuously-differentiable) function has no corners, but its slope may be unbounded on an unbounded domain.
relation: On a compact interval $[a, b]$, continuously differentiable ⊂ Lipschitz continuous.
terms:
  - Lipschitz_continuous
  - continuously_differentiable
examples:
  - example: x_to_x_on_minus_1_1
  - example: f_x_eq_x_squared_sin_1_x_for_x_neq_0_f_0_eq_0_on
  - example: x_to_x_squared_on_0_1
  - example: square_on_reals
see_also:
  - types_of_continuous
  - continuity_absolute_vs_Lipschitz
---
## Notes

- If $f$ is [continuously differentiable](/definitions/continuously-differentiable) on $[a, b]$, then $f^{\prime}$ is a [continuous](/definitions/continuous) function on a [compact](/definitions/compact) set, so $\abs{f^{\prime}}$ is [bounded](/definitions/bounded) by some $L$.
  By the mean value theorem, $f$ is [Lipschitz continuous](/definitions/lipschitz-continuous) with constant $L$.
- On every domain, a continuously differentiable function is _locally_ Lipschitz continuous: it is Lipschitz continuous on each compact interval in its domain.
