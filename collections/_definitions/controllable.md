---
published: false
title: Controllable system
term: controllable
applies_to: control systems
levels:
  elementary:
    text: |-
      Think of a system that you can steer, like a toy car with a remote control.
      The system is _controllable_ if you can steer it to any state you want.
  high-school:
    text: |-
      Consider a system whose behavior depends on an input that you choose.
      The system is _controllable_ if, by choosing its input, you can drive it from any starting state to the origin in a finite amount of time.
  undergraduate:
    text: |-
      Consider a system $\dot{x} = f(x, u)$ (or $x_{k+1} = f(x_k, u_k)$) with state $x$ and input $u$.
      The system is _controllable_ if, for every initial state, some input steers the state to the origin in finite time.
properties:
  - |-
    For $\dot{x} = A x + B u$ with $n$ states, controllability holds exactly when

    $$\operatorname{rank} \begin{bmatrix} B & A B & \cdots & A^{n-1} B \end{bmatrix} = n$$

    (the Kalman [rank](/definitions/matrix-rank) condition).
  - >-
    Every controllable linear system is [stabilizable](/definitions/stabilizable).
---
Many authors, especially for continuous-time linear systems, define "controllable" to mean that any state can be steered to any other state.
For continuous-time linear systems, this agrees with controllability to the origin and with reachability, but in discrete time the notions differ.
