---
published: false
title: Reachable set
term: reachable set
applies_to: dynamical and control systems
synonyms: [reach set, attainable set]
levels:
  high-school:
    text: |-
      Consider a system and a set of starting states.
      The _reachable set_ of the system is the set of all states it can get to from those starting states.
  undergraduate:
    text: |-
      Consider a system with an initial set $X_0$ and admissible inputs.
      The _reachable set_ of the system from $X_0$ is the set of states that solutions starting in $X_0$ (with some admissible input) reach, either at a given time $t$ or at some time up to a horizon $T$.
properties:
  - >-
    A system is safe with respect to an unsafe set $X_u$ exactly when its reachable set from $X_0$, over all time, does not meet $X_u$.
---
