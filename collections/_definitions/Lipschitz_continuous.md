---
published: false
title: Lipschitz continuous function
term: Lipschitz continuous
applies_to: functions
levels:
  high-school:
    text: |-
      A function $f$ is _Lipschitz continuous_ if there is a number $L$ such that every line through two points on the graph of $f$ has a slope between $-L$ and $L$.
  undergraduate:
    context: metric spaces
    text: |-
      A function $f : X \to Y$ is _Lipschitz continuous_ if there exists $L \geq 0$ such that $d(f(x), f(y)) \leq L d(x, y)$ for all $x, y \in X$. The smallest such $L$ is the _Lipschitz constant_ of $f$.
properties:
  - >-
    Every Lipschitz continuous function is [uniformly continuous](/definitions/uniformly-continuous).
  - >-
    A Lipschitz continuous function on an interval is [absolutely continuous](/definitions/absolutely-continuous). A Lipschitz continuous function on $\reals^n$ is [differentiable](/definitions/differentiable) [almost everywhere](/definitions/almost-everywhere) (Rademacher's theorem).
  - >-
    A [differentiable](/definitions/differentiable) function on an interval is Lipschitz continuous with constant $L$ if and only if $\lvert f^{\prime}(x) \rvert \leq L$ for all $x$ (by the mean value theorem).
---
