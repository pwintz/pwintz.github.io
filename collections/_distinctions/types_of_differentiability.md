---
published: false
title: Differentiable vs. continuously differentiable vs. smooth vs. analytic
kind: hierarchy
areas: [analysis]
summary: >
  Functions can be sorted by how many derivatives they have and how well behaved those derivatives are.
  Each condition is stronger than the previous one.
  A smooth function has derivatives of every order, but it can still differ from its Taylor series, which an [analytic](/definitions/analytic) function cannot.
relation: analytic ⊂ smooth ⊂ continuously differentiable ⊂ differentiable
terms:
  - differentiable
  - continuously_differentiable
  - smooth
  - analytic
examples:
  - example: x_to_sin_x
  - example: f_x_eq_e_minus_1_x_for_x_gt_0_f_x_eq_0_for_x_leq_0
  - example: x_to_x_x
  - example: f_x_eq_x_squared_sin_1_x_for_x_neq_0_f_0_eq_0
  - example: abs_x
see_also:
  - types_of_continuous
  - types_of_scalar_derivatives
  - types_of_nonsmooth_derivatives
---
## Notes

- $C^k$ functions have $k$ [continuous](/definitions/continuous) derivatives, so the chain continues: $C^{\infty} \subset \dots \subset C^2 \subset C^1$.
- For complex functions, the chain collapses: a function that is complex [differentiable](/definitions/differentiable) on an [open set](/definitions/open-set) (holomorphic) is automatically [analytic](/definitions/analytic).
