---
published: false
title: Barrier certificate
term: barrier certificate
applies_to: safety problems
levels:
  graduate:
    text: |-
      A _barrier certificate_ for $\dot{x} = f(x)$, with initial set $X_0$ and unsafe set $X_u$, is a [continuously differentiable](/definitions/continuously-differentiable) function $B$ with $B(x) \leq 0$ for $x \in X_0$, $B(x) > 0$ for $x \in X_u$, and $\nabla B(x) \cdot f(x) \leq 0$ for all $x$.
properties:
  - >-
    If a barrier certificate exists, the system is safe: no solution starting in $X_0$ reaches $X_u$.
  - >-
    When $f$ is polynomial and the sets are semialgebraic, barrier certificates can be found with sum-of-squares programming (Prajna and Jadbabaie).
---
Many variations weaken the derivative condition, for example requiring it only near the zero level set $\lbrace x : B(x) = 0 \rbrace$.
