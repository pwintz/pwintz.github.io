---
published: false
title: Safe system
term: safe
applies_to: dynamical systems with initial and unsafe sets
levels:
  high-school:
    text: |-
      A system is _safe_ if, starting from any allowed initial state, it never reaches an unsafe state.
  graduate:
    context: dynamical systems
    text: |-
      A system is _safe_ with respect to an initial set $X_0$ and an unsafe set $X_u$ if no solution starting in $X_0$ ever reaches $X_u$.
properties:
  - >-
    A system is safe if there is a [forward invariant](/definitions/forward-invariant) set that contains $X_0$ and does not meet $X_u$. [Barrier certificates](/definitions/barrier-certificate) are one way to find such a set.
---
Safety is a property of the system together with $X_0$ and $X_u$, not of a single set. In the [control barrier function](/definitions/control-barrier-function) literature, the "safe set" is a set that should be rendered [forward invariant](/definitions/forward-invariant), which is a different usage.
