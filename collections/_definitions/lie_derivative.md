---
title: Lie derivative
term: Lie derivative
applies_to: functions along vector fields
synonyms: [$L_F V$, "$\\dot{V}$"]
levels:
  undergraduate:
    context: dynamical systems
    text: |-
      Consider a function $V$ and a [vector field](/dictionary/definitions/vector-field) $F$, with solutions of $\dot{x} = F(x)$.
      The _Lie derivative_ of $V$ along $F$ is

      $$L_F V(x) = \nabla V(x) \cdot F(x).$$

      It is the rate of change of $V$ along those solutions.
  graduate:
    context: differential geometry
    text: |-
      Consider a function $V$ and a [vector field](/dictionary/definitions/vector-field) $F$ on a manifold, where $\phi_t$ is the [flow](/dictionary/definitions/flow) of $F$.
      The _Lie derivative_ of $V$ along $F$ is

      $$L_F V(x) = \frac{\mathrm{d}}{\mathrm{d}t} V(\phi_t(x)) \big\rvert_{t = 0}.$$

      [Lie derivatives](/dictionary/definitions/lie-derivative) are also defined for [vector fields](/dictionary/definitions/vector-field) and [differential forms](/dictionary/definitions/differential-form).
properties:
  - >-
    If $L_F V(x) \leq 0$ for all $x$, then $V$ never increases along solutions of $\dot{x} = F(x)$.
    This is how [Lyapunov functions](/dictionary/definitions/lyapunov-function) are checked, without solving the system.
---
