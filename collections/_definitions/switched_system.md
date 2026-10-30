---
published: false
title: Switched system
term: switched system
applies_to: dynamical systems
levels:
  high-school:
    text: |-
      A _switched system_ is a system that switches between several sets of rules for how it changes.
  undergraduate:
    text: |-
      A _switched system_ is a family of continuous-time systems $\dot{x} = f_{p}(x)$, $p \in \lbrace 1, \dots, m \rbrace$, together with a switching signal $\sigma(t)$ that selects the active one: $\dot{x} = f_{\sigma(t)}(x)$. The state is [continuous](/definitions/continuous) at switches.
properties:
  - >-
    A switched system can be unstable even if every subsystem $\dot{x} = f_{p}(x)$ is [asymptotically stable](/definitions/asymptotically-stable), because of how the switching is timed. A common [Lyapunov function](/definitions/lyapunov-function) for all subsystems guarantees stability under arbitrary switching.
---
