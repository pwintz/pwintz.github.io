---
title: Viability kernel
term: viability kernel
applies_to: control system
levels:
  graduate:
    text: |-
      Consider a control system $\dot x = f(x, u)$ and a set of state constraints $K$.
      The _viability kernel_ of $K$ is a [subset](/dictionary/definitions/subset) of $V \subset K$ such that for every initial state $x_0 \in V$, there exists at least one choice of admissible inputs $u(t)$ such that a solution starting from $x_0$ and controlled by $u(t)$ stays in $K$ forever.
properties:
  - >-
    The viability kernel is the largest [controlled invariant](/dictionary/definitions/controlled-invariant) (or weakly [forward invariant](/dictionary/definitions/forward-invariant)) [subset](/dictionary/definitions/subset) of $K$.
---
