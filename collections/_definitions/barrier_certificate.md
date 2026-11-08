---
published: false
title: Barrier certificate
term: barrier certificate
applies_to: safety problems
levels:
  graduate:
    text: |-
      Consider a system $\dot{x} = f(x)$ with an initial set $X_0$ and an unsafe set $X_u$.
      A _barrier certificate_ for the system is a [continuously differentiable](/definitions/continuously-differentiable) function $B$ with

      1. $B(x) \leq 0$ for every $x \in X_0$,
      2. $B(x) > 0$ for every $x \in X_u$, and
      3. $\nabla B(x) \cdot f(x) \leq 0$ for every $x$.
properties:
  - >-
    If a barrier certificate exists, the system is safe: no solution starting in $X_0$ reaches $X_u$.
  - >-
    When $f$ is [polynomial](/definitions/polynomial) and the sets are semialgebraic, barrier certificates can be found with sum-of-squares programming (Prajna and Jadbabaie).
---
Many variations weaken the derivative condition, for example requiring it only near the zero level set $\setdef{x \suchthat B(x) = 0}$.
