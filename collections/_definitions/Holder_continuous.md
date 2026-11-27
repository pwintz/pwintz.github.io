---
published: false
title: Hölder Continuous Function
term: Hölder continuous
applies_to: functions
levels:
  undergraduate:
    context: $\reals^n$
    text: |-
      Consider a function $f : \reals^m \to \reals^n$ and a number $\alpha \in (0, 1]$.
      The function $f$ is _Hölder continuous_ with exponent $\alpha$ if there exists $C \geq 0$ such that

      $$\norm{f(\vect{x}) - f(\vect{y})} \leq C \norm{\vect{x} - \vect{y}}^{\alpha} \quad \text{for all } \vect{x}, \vect{y} \in \reals^m.$$
  graduate:
    context: metric spaces
    text: |-
      Consider a function $f : X \to Y$ between [metric spaces](/dictionary/definitions/metric-space), and a number $\alpha \in (0, 1]$.
      The function $f$ is _Hölder continuous_ with exponent $\alpha$ if there exists $C \geq 0$ such that

      $$d(f(x), f(y)) \leq C d(x, y)^{\alpha} \quad \text{for all } x, y \in X.$$
properties:
  - |-
    With $\alpha = 1$, Hölder continuity is Lipschitz continuity.
  - |-
    Every Hölder continuous function is [uniformly continuous](/dictionary/definitions/uniformly-continuous).
  - |-
    On an interval, a function that is Hölder continuous with exponent $\alpha > 1$ must be constant, which is why $\alpha$ is restricted to $(0, 1]$.
---
