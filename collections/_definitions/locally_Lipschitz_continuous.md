---
title: Locally Lipschitz continuous function
term: locally Lipschitz continuous
applies_to: functions
synonyms: [locally Lipschitz]
levels:
  high-school:
    text: |-
      Consider a function $f$ and the lines through pairs of points on its graph.
      The function $f$ is _locally Lipschitz continuous_ if each point has a surrounding interval in which the slopes of those lines are bounded, though the bound can be different for different intervals.
  undergraduate:
    context: metric spaces
    text: |-
      Consider a function $f : X \to Y$ between [metric spaces](/dictionary/definitions/metric-space).
      The function $f$ is _locally Lipschitz continuous_ if every point $x_0 \in X$ has a [neighborhood](/dictionary/definitions/neighborhood) $U$ and a number $L_U \geq 0$ such that

      $$d(f(x), f(y)) \leq L_U \, d(x, y) \quad \text{for all } x, y \in U.$$
properties:
  - >-
    Every [continuously differentiable](/dictionary/definitions/continuously-differentiable) function on an open subset of $\reals^n$ is locally Lipschitz continuous.
  - >-
    A locally Lipschitz continuous function is [(globally) Lipschitz continuous](/dictionary/definitions/lipschitz-continuous) on every [compact](/dictionary/definitions/compact) subset of its domain.
  - >-
    If $f$ is locally Lipschitz continuous, then the differential equation $\dot{x} = f(x)$ has a unique solution from each initial condition on some time interval, but the solution can blow up in finite time, as for $\dot{x} = x^2$.
    If $f$ is Lipschitz continuous on $\reals^n$, then each solution exists for all time.
---
