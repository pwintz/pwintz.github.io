---
published: false
title: Feedback linearizable system
term: feedback linearizable
applies_to: control systems
levels:
  graduate:
    text: |-
      A [control-affine](/definitions/control-affine) system $\dot{x} = f(x) + g(x) u$ is _feedback linearizable_ (on a region) if a change of coordinates $z = T(x)$ and a [feedback](/definitions/feedback) law $u = \alpha(x) + \beta(x) v$, with $\beta(x)$ invertible, transform it into a [controllable](/definitions/controllable) linear system $\dot{z} = A z + B v$.
properties:
  - >-
    A single-input system with $n$ states is feedback linearizable near a point if and only if the [vector](/definitions/vector) fields $$g, \operatorname{ad}_f g, \dots, \operatorname{ad}_f^{n-1} g$$ are linearly independent there and $$g, \dots, \operatorname{ad}_f^{n-2} g$$ span an involutive distribution.
  - >-
    [Feedback](/definitions/feedback) linearization is exact, unlike [Jacobian](/definitions/jacobian) linearization, which only approximates the system near an [equilibrium](/definitions/equilibrium).
---
