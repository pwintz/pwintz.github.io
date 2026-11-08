---
published: false
title: Lipschitz continuous vs. absolutely continuous
kind: hierarchy
areas: [analysis]
summary: >
  Absolute continuity and Lipschitz continuity are both stronger than continuity, and both are used to justify integrating a derivative.
  An [absolutely continuous](/definitions/absolutely-continuous) function is the integral of its derivative, which may be unbounded.
  A [Lipschitz continuous](/definitions/lipschitz-continuous) function has a [bounded](/definitions/bounded) slope.
relation: Lipschitz continuous ⊂ absolutely continuous
terms:
  - Lipschitz_continuous
  - absolutely_continuous
examples:
  - example: x_to_sqrt_x_on_0_1
  - example: x_to_x_on_minus_1_1
  - example: x_to_x_squared_on_0_1
see_also:
  - types_of_continuous
  - continuity_uniform_vs_absolute
  - continuity_Lipschitz_vs_continuously_differentiable
---
## Notes

- If $f$ is [Lipschitz continuous](/definitions/lipschitz-continuous) with constant $L > 0$, then choosing $\delta = \varepsilon / L$ in the definition of absolute continuity works, which is why every Lipschitz continuous function is [absolutely continuous](/definitions/absolutely-continuous).
