---
published: false
title: Reachable set
term: reachable set
applies_to: dynamical and control systems
synonyms: [reach set, attainable set]
levels:
  high-school:
    text: |-
      The _reachable set_ of a system is the set of all states it can get to from a given set of starting states.
  undergraduate:
    text: |-
      The _reachable set_ of a system from an initial set $X_0$ is the set of states that solutions starting in $X_0$ (with any admissible input) reach, either at a given time $t$ or at some time up to a horizon $T$.
properties:
  - >-
    A system is safe with respect to an unsafe set $X_u$ exactly when its reachable set from $X_0$, over all time, does not meet $X_u$.
---
