---
published: false
title: Lipschitz continuous vs. continuously differentiable
kind: hierarchy
areas: [analysis]
status: draft
summary: >
  Lipschitz continuity and continuous differentiability both rule out functions that are too steep or too wild, but in different ways.
  A Lipschitz continuous function has a bounded slope but may have corners.
  A continuously differentiable function has no corners, but its slope may be unbounded on an unbounded domain.
relation: On a compact interval $[a, b]$, continuously differentiable ⊂ Lipschitz continuous.
terms:
  - Lipschitz_continuous
  - continuously_differentiable
examples:
  - example: x_to_x_on_minus_1_1
    why: >-
      $x \mapsto \lvert x \rvert$ is Lipschitz continuous with constant $1$.
      It is not continuously differentiable, because it is not differentiable at $0$.
  - example: f_x_eq_x_squared_sin_1_x_for_x_neq_0_f_0_eq_0_on
    why: >-
      This $f$ is Lipschitz continuous because it is differentiable everywhere with $\lvert f^{\prime}(x) \rvert \leq 3$.
      It is not continuously differentiable, because $f^{\prime}(x) = 2x \sin(1/x) - \cos(1/x)$ has no limit as $x \to 0$.
  - example: x_to_x_squared_on_0_1
    why: >-
      $x \mapsto x^2$ on $[0, 1]$ is continuously differentiable because its derivative $2x$ is continuous.
      It is Lipschitz continuous because that derivative is at most $2$ on $[0, 1]$.
  - example: square_on_reals
    why: >-
      $x \mapsto x^2$ on $\reals$ is continuously differentiable because its derivative $2x$ is continuous.
      It is not Lipschitz continuous, because its slope $2x$ is unbounded on $\reals$.
see_also:
  - types_of_continuous
  - continuity_absolute_vs_Lipschitz
---
## Notes

- If $f$ is continuously differentiable on $[a, b]$, then $f^{\prime}$ is a continuous function on a compact set, so $\lvert f^{\prime} \rvert$ is bounded by some $L$.
  By the mean value theorem, $f$ is Lipschitz continuous with constant $L$.
- On any domain, a continuously differentiable function is _locally_ Lipschitz continuous: it is Lipschitz continuous on each compact interval in its domain.
