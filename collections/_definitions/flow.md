---
published: false
title: Flow
term: flow
applies_to: dynamical systems
synonyms: [solution map]
levels:
  undergraduate:
    context: ordinary differential equations
    text: |-
      Consider a dynamical system $\dot{x} = f(x)$ on $\reals^n$ whose solutions are unique.
      The _flow_ of the system is the function $\varphi$ that maps each time $t$ and initial state $x_0$ to the state $\varphi(t, x_0)$ at time $t$ of the solution that starts at $x_0$:

      $$\frac{\partial}{\partial t} \varphi(t, x_0) = f\bigl(\varphi(t, x_0)\bigr), \qquad \varphi(0, x_0) = x_0.$$
properties:
  - >-
    For each initial state $x_0$, the function $t \mapsto \varphi(t, x_0)$ is a [trajectory](/definitions/trajectory).
  - >-
    For each time $t$, the function $x_0 \mapsto \varphi(t, x_0)$ moves every state forward by the time $t$, and is called the time-$t$ map.
  - >-
    A flow satisfies $\varphi(s + t, x_0) = \varphi\bigl(s, \varphi(t, x_0)\bigr)$ whenever both sides are defined.
  - >-
    If $f$ is [continuously differentiable](/definitions/continuously-differentiable), then each time-$t$ map is a diffeomorphism onto its image.
---
In fluid dynamics, the "flow" is the motion of the fluid itself, which is described by a velocity field, and the flow map of the velocity field is the flow in the sense of this page.
