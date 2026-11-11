---
title: Lipschitz continuous vs. continuously differentiable
kind: hierarchy
areas: [analysis]
summary: >
  Lipschitz continuity and [continuous](/dictionary/definitions/continuous) differentiability both rule out functions that are too steep or too wild, but in different ways.
  A [Lipschitz continuous](/dictionary/definitions/lipschitz-continuous) function has a [bounded](/dictionary/definitions/bounded) slope but may have corners.
  A [continuously differentiable](/dictionary/definitions/continuously-differentiable) function has no corners, but its slope may be unbounded on an unbounded domain.
relation:
  context: 'On a compact interval $[a, b]$:'
  relation: continuously differentiable ⊂ Lipschitz continuous
terms:
  - Lipschitz_continuous
  - continuously_differentiable
examples:
  - example: x_to_x_on_minus_1_1
  - example: f_x_eq_x_squared_sin_1_x_for_x_neq_0_f_0_eq_0_on
  - example: x_to_x_squared_on_0_1
  - example: x_sq_on_reals
see_also:
  - types_of_continuous
  - continuity_absolute_vs_Lipschitz
---
## Notes

- If $f$ is [continuously differentiable](/dictionary/definitions/continuously-differentiable) on $[a, b]$, then $f^{\prime}$ is a [continuous](/dictionary/definitions/continuous) function on a [compact](/dictionary/definitions/compact) set, so $\abs{f^{\prime}}$ is [bounded](/dictionary/definitions/bounded) by some $L$.
  By the mean value theorem, $f$ is [Lipschitz continuous](/dictionary/definitions/lipschitz-continuous) with constant $L$.
- On every domain, a continuously differentiable function is _locally_ Lipschitz continuous: it is Lipschitz continuous on each compact interval in its domain.
