---
published: false
title: Detectable system
term: detectable
applies_to: control systems
levels:
  undergraduate:
    context: linear systems
    text: |-
      A linear system $\dot{x} = A x + B u$, $y = C x$ is _detectable_ if every unobservable mode is [asymptotically stable](/definitions/asymptotically-stable).
  graduate:
    context: nonlinear systems
    text: |-
      A system $\dot{x} = f(x)$, $y = h(x)$ is (zero-state) _detectable_ if every solution with $y(t) = 0$ for all $t \geq 0$ converges to the origin.
properties:
  - >-
    A linear system is detectable if and only if there is a [matrix](/definitions/matrix) $L$ such that $A - L C$ is Hurwitz, so a Luenberger [observer](/definitions/observer) can estimate the state with an error that converges to zero.
  - >-
    Detectability is dual to stabilizability, and every [observable](/definitions/observable) linear system is detectable.
---
