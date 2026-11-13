---
published: false
title: Feedback linearizable system
term: feedback linearizable
applies_to: control systems
levels:
  graduate:
    text: |-
      Consider a [control-affine](/dictionary/definitions/control-affine) system $\dot{x} = f(x) + g(x) u$.
      The system is _feedback linearizable_ (on a region) if a change of coordinates $z = T(x)$ and a [feedback](/dictionary/definitions/feedback) law $u = \alpha(x) + \beta(x) v$, with $\beta(x)$ [invertible](/dictionary/definitions/invertible-matrix), [transform](/dictionary/definitions/transform) it into a [controllable](/dictionary/definitions/controllable) linear system $\dot{z} = A z + B v$.
properties:
  - >-
    A single-input system with $n$ states is feedback linearizable near a point if and only if the [vector fields](/dictionary/definitions/vector-field) $$g, \operatorname{ad}_f g, \dots, \operatorname{ad}_f^{n-1} g$$ are [linearly independent](/dictionary/definitions/linearly-independent) there and $$g, \dots, \operatorname{ad}_f^{n-2} g$$ span an involutive distribution.
  - >-
    [Feedback](/dictionary/definitions/feedback) linearization is exact, unlike [Jacobian](/dictionary/definitions/jacobian) linearization, which only approximates the system near an [equilibrium](/dictionary/definitions/equilibrium).
---
