---
title: Switched system
term: switched system
applies_to: dynamical systems
levels:
  high-school:
    text: |-
      A dynamical system is called a _switched system_ if it exhibits instantaneous switches between several sets of rules for how it changes over time.
  undergraduate:
    text: |-
      A _switched system_ is a family of continuous-time systems $\dot{x} = f_{p}(x)$, $p \in \lbrace 1, \dots, m \rbrace$, together with a switching signal $\sigma(t)$ that selects the active one: $\dot{x} = f_{\sigma(t)}(x)$. 
properties:
  - >-
    A switched system can be unstable even if every subsystem $\dot{x} = f_{p}(x)$ is [asymptotically stable](/definitions/asymptotically-stable), because of how the switching is timed. A common [Lyapunov function](/definitions/lyapunov-function) for all subsystems guarantees stability under arbitrary switching.
---
In contrast to a hybrid system, the state of a switched system is [continuous](/definitions/continuous) at switches.