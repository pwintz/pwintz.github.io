---
title: Detectable system
term: detectable
applies_to: control systems
levels:
  undergraduate:
    context: linear systems
    text: |-
      Consider a linear system $\dot{x} = A x + B u$ with output $y = C x$, and its unobservable modes: the parts of the state that do not affect the output.
      The system is _detectable_ if every unobservable mode is [asymptotically stable](/dictionary/definitions/asymptotically-stable).
  graduate:
    context: nonlinear systems
    text: |-
      Consider a system $\dot{x} = f(x)$ with output $y = h(x)$.
      The system is (zero-state) _detectable_ if every solution such that $y(t) = 0$ for all $t \geq 0$ converges to the origin.
properties:
  - >-
    A linear system is detectable if and only if there is a [matrix](/dictionary/definitions/matrix) $L$ such that $A - L C$ is Hurwitz, so a Luenberger [observer](/dictionary/definitions/observer) can estimate the state with an error that converges to zero.
  - >-
    Detectability is dual to stabilizability, and every [observable](/dictionary/definitions/observable) linear system is detectable.
---
