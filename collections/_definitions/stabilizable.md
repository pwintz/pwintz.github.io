---
published: false
title: Stabilizable system
term: stabilizable
applies_to: control systems
levels:
  high-school:
    text: |-
      Consider a system that might not settle down on its own, and a [feedback](/dictionary/definitions/feedback) controller added to it.
      The system is _stabilizable_ if some such controller can make it settle at an [equilibrium](/dictionary/definitions/equilibrium).
  undergraduate:
    text: |-
      Consider a system $\dot{x} = f(x, u)$ and [feedback](/dictionary/definitions/feedback) laws $u = k(x)$.
      The system is _stabilizable_ (at the origin) if some such feedback law makes the origin of $\dot{x} = f(x, k(x))$ [asymptotically stable](/dictionary/definitions/asymptotically-stable).
      For $\dot{x} = A x + B u$, this means there is a [matrix](/dictionary/definitions/matrix) $K$ such that $A + B K$ is Hurwitz.
properties:
  - |-
    A linear system is stabilizable if and only if every uncontrollable mode is [asymptotically stable](/dictionary/definitions/asymptotically-stable):

    $$\operatorname{rank} \begin{bmatrix} \lambda I - A & B \end{bmatrix} = n$$

    for every [eigenvalue](/dictionary/definitions/eigenvalue) $\lambda$ of $A$ such that $\operatorname{Re} \lambda \geq 0$ (the PBH test).
  - >-
    For a [controllable](/dictionary/definitions/controllable) linear system, the closed-loop [eigenvalues](/dictionary/definitions/eigenvalue) can be placed anywhere by [state feedback](/dictionary/definitions/state-feedback) ([pole](/dictionary/definitions/pole) placement).
  - >-
    Some nonlinear systems that are [controllable](/dictionary/definitions/controllable) cannot be stabilized by any [continuous](/dictionary/definitions/continuous) [static feedback](/dictionary/definitions/static-feedback), such as the nonholonomic integrator (Brockett's condition).
---
