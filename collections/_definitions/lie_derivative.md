---
published: false
title: Lie derivative
term: Lie derivative
applies_to: functions along vector fields
synonyms: [$L_F V$, "$\\dot{V}$"]
levels:
  undergraduate:
    context: dynamical systems
    text: |-
      The _Lie derivative_ of a function $V$ along a [vector](/definitions/vector) field $F$ is $L_F V(x) = \nabla V(x) \cdot F(x)$. It is the rate of change of $V$ along solutions of $\dot{x} = F(x)$.
  graduate:
    context: differential geometry
    text: |-
      The _Lie derivative_ of $V$ along $F$ is $L_F V(x) = \frac{\mathrm{d}}{\mathrm{d}t} V(\phi_t(x)) \big\rvert_{t = 0}$, where $\phi_t$ is the flow of $F$. Lie derivatives are also defined for [vector](/definitions/vector) fields and differential forms.
properties:
  - >-
    If $L_F V(x) \leq 0$ for all $x$, then $V$ never increases along solutions of $\dot{x} = F(x)$. This is how [Lyapunov functions](/definitions/lyapunov-function) are checked, without solving the system.
---
