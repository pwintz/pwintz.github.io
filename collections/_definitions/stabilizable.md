---
published: false
title: Stabilizable system
term: stabilizable
applies_to: control systems
levels:
  high-school:
    text: |-
      A system is _stabilizable_ if some [feedback](/definitions/feedback) controller can make it settle at an [equilibrium](/definitions/equilibrium).
  undergraduate:
    text: |-
      A system $\dot{x} = f(x, u)$ is _stabilizable_ (at the origin) if there is a [feedback](/definitions/feedback) law $u = k(x)$ that makes the origin of $\dot{x} = f(x, k(x))$ [asymptotically stable](/definitions/asymptotically-stable). For $\dot{x} = A x + B u$, this means there is a [matrix](/definitions/matrix) $K$ such that $A + B K$ is Hurwitz.
properties:
  - |-
    A linear system is stabilizable if and only if every uncontrollable mode is [asymptotically stable](/definitions/asymptotically-stable):

    $$\operatorname{rank} \begin{bmatrix} \lambda I - A & B \end{bmatrix} = n$$

    for every [eigenvalue](/definitions/eigenvalue) $\lambda$ of $A$ with $\operatorname{Re} \lambda \geq 0$ (the PBH test).
  - >-
    For a [controllable](/definitions/controllable) linear system, the closed-loop [eigenvalues](/definitions/eigenvalue) can be placed anywhere by [state feedback](/definitions/state-feedback) ([pole](/definitions/pole) placement).
  - >-
    Some nonlinear systems that are [controllable](/definitions/controllable) cannot be stabilized by any [continuous](/definitions/continuous) [static feedback](/definitions/static-feedback), such as the nonholonomic integrator (Brockett's condition).
---
