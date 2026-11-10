---
published: false
title: Differentiable vs. continuously differentiable
kind: hierarchy
areas: [analysis]
summary: >
  For a function of a real variable, the derivative $f^{\prime}(x)$ measures the slope of the graph at each point $x$.
  A [differentiable](/definitions/differentiable) function has a derivative at every point, but the derivative can oscillate wildly as $x$ changes.
  A [continuously differentiable](/definitions/continuously-differentiable) function has a derivative at every point, and the derivative is also a [continuous](/definitions/continuous) function of $x$.
relation: continuously differentiable ⊂ differentiable
terms:
  - differentiable
  - continuously_differentiable
examples:
  - example: x_to_sin_x
  - example: x_to_x_x
    why: >-
      $x \mapsto x \abs{x}$ shows that a continuously differentiable function can still have a derivative with a corner: the derivative $2 \abs{x}$ is continuous but not differentiable.
  - example: f_x_eq_x_squared_sin_1_x_for_x_neq_0_f_0_eq_0
    why: >-
      $f(x) = x^2 \sin(1/x)$ for $x \neq 0$, $f(0) = 0$, is the standard example of a differentiable function that is not continuously differentiable: the derivative exists at $0$, but the derivative $2x \sin(1/x) - \cos(1/x)$ oscillates between about $-1$ and $1$ near $0$, so the derivative is not continuous at $0$.
  - example: abs_x
see_also:
  - types_of_differentiability
  - continuity_Lipschitz_vs_continuously_differentiable
---
## Notes

- A derivative cannot jump: by Darboux's theorem, every derivative has the intermediate value property, so a derivative that is discontinuous must be discontinuous by oscillating, as in $x^2 \sin(1/x)$.
