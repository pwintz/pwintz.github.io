---
published: false
title: Differentiable vs. continuously differentiable vs. smooth vs. analytic
kind: hierarchy
areas: [analysis]
status: draft
summary: >
  Functions can be sorted by how many derivatives they have and how well behaved those derivatives are.
  Each condition is stronger than the previous one.
  A smooth function has derivatives of every order, but it can still differ from its Taylor series, which an analytic function cannot.
relation: analytic ⊂ smooth ⊂ continuously differentiable ⊂ differentiable
terms:
  - differentiable
  - continuously_differentiable
  - smooth
  - analytic
examples:
  - example: x_to_sin_x
    why: >-
      $\sin$ is analytic because its Taylor series converges to it everywhere.
      So it is also smooth, continuously differentiable, and differentiable.
  - example: f_x_eq_e_minus_1_x_for_x_gt_0_f_x_eq_0_for_x_leq_0
    why: >-
      This $f$ is smooth because it has derivatives of every order, so it is also continuously differentiable and differentiable.
      It is not analytic, because every derivative at $0$ is $0$, so its Taylor series at $0$ is $0$, but $f(x) > 0$ for $x > 0$.
  - example: x_to_x_x
    why: >-
      $x \mapsto x \lvert x \rvert$ is continuously differentiable, and so differentiable, because its derivative $2 \lvert x \rvert$ is continuous.
      It is not smooth or analytic, because $2 \lvert x \rvert$ is not differentiable at $0$.
  - example: f_x_eq_x_squared_sin_1_x_for_x_neq_0_f_0_eq_0
    why: >-
      This $f$ is differentiable, with $f^{\prime}(0) = 0$.
      It is not continuously differentiable, smooth, or analytic, because $f^{\prime}(x) = 2x \sin(1/x) - \cos(1/x)$ has no limit as $x \to 0$.
  - example: abs_x
    why: >-
      $x \mapsto \lvert x \rvert$ is not differentiable at $0$, because it has a corner there.
      So it is not continuously differentiable, smooth, or analytic.
see_also:
  - types_of_continuous
  - types_of_scalar_derivatives
  - types_of_nonsmooth_derivatives
---
## Notes

- $C^k$ functions have $k$ continuous derivatives, so the chain continues: $C^{\infty} \subset \dots \subset C^2 \subset C^1$.
- For complex functions, the chain collapses: a function that is complex differentiable on an open set (holomorphic) is automatically analytic.
