---
published: false
title: Locally Lipschitz continuous vs. (globally) Lipschitz continuous
kind: hierarchy
areas: [analysis]
summary: >
  Lipschitz conditions bound the slopes of the lines through pairs of points on the graph of a function.
  A [locally Lipschitz continuous](/definitions/locally-lipschitz-continuous) function has a bound near each point, but the bound can grow without limit across the domain, toward infinity or toward a missing boundary point.
  A [Lipschitz continuous](/definitions/lipschitz-continuous) (or _globally_ Lipschitz continuous) function has one bound $L$ that works on the whole domain.
relation: Lipschitz continuous ⊂ locally Lipschitz continuous ⊂ continuous
terms:
  - locally_Lipschitz_continuous
  - Lipschitz_continuous
examples:
  - example: x_to_x_squared_on_0_1
  - example: x_to_x_on_minus_1_1
  - example: x_sq_on_reals
    why: >-
      For $x \mapsto x^2$ on $\reals$, the slope bound on $[-R, R]$ is $2R$, which grows without limit as $R \to \infty$, so the function is locally but not globally Lipschitz continuous.
  - example: x_to_sin_1_x_on_0_1
    why: >-
      For $x \mapsto \sin(1/x)$ on $(0, 1]$, the slope bound near $x_0$ grows without limit as $x_0 \to 0$, a point missing from the domain, so the function is locally but not globally Lipschitz continuous.
  - example: x_to_sqrt_x_on_0_1
see_also:
  - continuity_Holder_vs_Lipschitz
  - continuity_Lipschitz_vs_continuously_differentiable
  - types_of_continuous
---
## Notes

- On a [compact](/definitions/compact) domain, such as $[0, 1]$, locally Lipschitz continuous and Lipschitz continuous are equivalent, so the difference appears only on domains that are unbounded or missing boundary points.
- The difference matters for differential equations $\dot{x} = f(x)$: local Lipschitz continuity of $f$ gives unique solutions for a short time, and global Lipschitz continuity also rules out finite-time blow-up, as in $\dot{x} = x^2$, whose solution from $x(0) = 1$ is $x(t) = 1 / (1 - t)$.
