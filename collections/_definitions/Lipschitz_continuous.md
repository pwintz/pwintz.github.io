---
title: Lipschitz continuous function
term: Lipschitz continuous
applies_to: functions
synonyms: [globally Lipschitz continuous, Lipschitz]
levels:
  high-school:
    text: |-
      Consider a function $f$ and the lines through pairs of points on its graph.
      The function $f$ is _Lipschitz continuous_ if there is a number $L$ such that every one of those lines has a slope between $-L$ and $L$.
  undergraduate:
    context: metric spaces
    text: |-
      Consider a function $f : X \to Y$ between [metric spaces](/definitions/metric-space).
      The function $f$ is _Lipschitz continuous_ if there exists $L \geq 0$ such that

      $$d(f(x), f(y)) \leq L d(x, y) \quad \text{for all } x, y \in X.$$

      The smallest such $L$ is the _Lipschitz constant_ of $f$.
properties:
  - >-
    Every Lipschitz continuous function is [uniformly continuous](/definitions/uniformly-continuous).
  - >-
    A Lipschitz continuous function on an interval is [absolutely continuous](/definitions/absolutely-continuous).
  - >-
    A Lipschitz continuous function on $\reals^n$ is [differentiable](/definitions/differentiable) [almost everywhere](/definitions/almost-everywhere) (Rademacher's theorem).
  - >-
    A [differentiable](/definitions/differentiable) function on an interval is Lipschitz continuous with constant $L$ if and only if $\abs{f^{\prime}(x)} \leq L$ for all $x$ (by the mean value theorem).
  - >-
    If $f : \reals^n \to \reals^n$ is Lipschitz continuous, then for every initial condition $x_0 \in \reals^n$, the differential equation $\dot{x} = f(x)$ with $x(0) = x_0$ has exactly one solution, and the solution is defined for all $t \in \reals$ (the global Picard–Lindelöf theorem).
    If $f$ is only [locally Lipschitz continuous](/definitions/locally-lipschitz-continuous), then the solution exists and is unique on some time interval around $0$, but the solution can blow up in finite time: the solution of $\dot{x} = x^2$ with $x(0) = 1$ is $x(t) = 1 / (1 - t)$, which blows up at $t = 1$.
---
