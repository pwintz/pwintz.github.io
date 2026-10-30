---
published: false
title: Hybrid automaton
term: hybrid automaton
applies_to: hybrid systems
levels:
  graduate:
    text: |-
      A _hybrid automaton_ is a model of a [hybrid system](/definitions/hybrid-system) as a finite graph. Each node (a mode, or location) has [continuous](/definitions/continuous) dynamics and an invariant (domain), and each edge has a guard (when the transition may occur) and a reset map (how the state jumps).
properties:
  - >-
    Every hybrid automaton can be written in the form $\dot{x} \in F(x)$ on $C$, $x^{+} \in G(x)$ on $D$, with the mode as a discrete state variable.
---
