---
published: false
title: Differentiable vs. continuously differentiable vs. smooth vs. analytic
kind: hierarchy
areas: [analysis]
status: draft
summary: >
  Each condition is stronger than the previous one. A smooth function has derivatives of every order, but it can still differ from its Taylor series, which an analytic function cannot.
relation: analytic ⊂ smooth ⊂ continuously differentiable ⊂ differentiable
terms:
  - differentiable
  - continuously_differentiable
  - smooth
  - analytic
examples:
  - example: x_to_sin_x
    why: >-
      Its Taylor series converges to it everywhere.
  - example: f_x_eq_e_minus_1_x_for_x_gt_0_f_x_eq_0_for_x_leq_0
    why: >-
      Every derivative at $0$ is $0$, so its Taylor series at $0$ is $0$, but $f(x) > 0$ for $x > 0$.
  - example: x_to_x_x
    why: >-
      Its derivative $2 \lvert x \rvert$ is continuous but not differentiable at $0$.
  - example: f_x_eq_x_squared_sin_1_x_for_x_neq_0_f_0_eq_0
    why: >-
      $f^{\prime}(0) = 0$, but $f^{\prime}(x) = 2x \sin(1/x) - \cos(1/x)$ has no limit as $x \to 0$.
  - example: abs_x
    why: >-
      It has a corner at $0$.
see_also:
  - types_of_continuous
  - types_of_scalar_derivatives
  - types_of_nonsmooth_derivatives
---
## Notes

- $C^k$ functions have $k$ continuous derivatives, so the chain continues: $C^{\infty} \subset \dots \subset C^2 \subset C^1$.
- For complex functions, the chain collapses: a function that is complex differentiable on an open set (holomorphic) is automatically analytic.
