---
title: Reachable system
term: reachable
applies_to: control systems
levels:
  high-school:
    text: |-
      Consider a control system  with an input that you choose.
      The system is _reachable_ if you can steer it from the origin to every state you choose in a finite amount of time.
  undergraduate:
    text: |-
      Consider a system with state $x$ and input $u$, starting from the origin.
      The system is _reachable_ if every state can be reached in finite time by some input.
properties:
  - >-
    For $\dot{x} = A x + B u$, reachability and controllability are equivalent.
  - >-
    For $x_{k+1} = A x_k + B u_k$, reachability implies controllability.
    The converse holds when $A$ is [invertible](/dictionary/definitions/invertible-matrix), but fails in general: if $A = 0$ and $B = 0$, every state reaches the origin in one step, but no other state can be reached.
---
