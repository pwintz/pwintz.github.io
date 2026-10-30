---
published: false
title: Reachable system
term: reachable
applies_to: control systems
levels:
  high-school:
    text: |-
      A system is _reachable_ if, starting from rest at the origin, you can steer it to any state you want in a finite amount of time.
  undergraduate:
    text: |-
      A system is _reachable_ if every state can be reached in finite time, starting from the origin, by some input.
properties:
  - >-
    For $\dot{x} = A x + B u$, reachability and controllability are equivalent.
  - >-
    For $x_{k+1} = A x_k + B u_k$, reachability implies controllability. The converse holds when $A$ is invertible, but fails in general: if $A = 0$ and $B = 0$, every state reaches the origin in one step, but no other state can be reached.
---
