---
published: false
title: Lipschitz continuous vs. continuously differentiable
kind: hierarchy
areas: [analysis]
status: draft
summary: >
  A Lipschitz continuous function has a bounded slope but may have corners.
  A continuously differentiable function has no corners, but its slope may be unbounded on an unbounded domain.
relation: On a compact interval $[a, b]$, continuously differentiable ⊂ Lipschitz continuous.
terms:
  - Lipschitz_continuous
  - continuously_differentiable
examples:
  - example: x_to_x_on_minus_1_1
    why: >-
      It is not differentiable at $0$.
  - example: f_x_eq_x_squared_sin_1_x_for_x_neq_0_f_0_eq_0_on
    why: >-
      It is differentiable everywhere with $\lvert f^{\prime}(x) \rvert \leq 3$, but $f^{\prime}$ is not continuous at $0$.
  - example: x_to_x_squared_on_0_1
    why: >-
      Its derivative $2x$ is continuous and at most $2$ on $[0, 1]$.
  - example: square_on_reals
    why: >-
      Its slope $2x$ is unbounded, so the inclusion fails on an unbounded domain.
see_also:
  - types_of_continuous
  - continuity_absolute_vs_Lipschitz
---
## Notes

- If $f$ is continuously differentiable on $[a, b]$, then $f^{\prime}$ is a continuous function on a compact set, so $\lvert f^{\prime} \rvert$ is bounded by some $L$. By the mean value theorem, $f$ is Lipschitz continuous with constant $L$.
- On any domain, a continuously differentiable function is _locally_ Lipschitz continuous: it is Lipschitz continuous on each compact interval in its domain.
