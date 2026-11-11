---
published: false
title: Hybrid automaton
term: hybrid automaton
applies_to: hybrid systems
levels:
  graduate:
    text: |-
      Consider a [hybrid system](/dictionary/definitions/hybrid-system) that switches between finitely many modes.
      A _hybrid automaton_ models the system as a finite graph.
      Each node (a mode, or location) has [continuous](/dictionary/definitions/continuous) dynamics and an invariant (domain), and each edge has a guard (when the transition may occur) and a reset map (how the state jumps).
properties:
  - >-
    Every hybrid automaton can be written in the form $\dot{x} \in F(x)$ on $C$, $x^{+} \in G(x)$ on $D$, with the mode as a discrete state variable.
---
