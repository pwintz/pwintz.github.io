---
published: false
title: Observable system
term: observable
applies_to: control systems
levels:
  elementary:
    text: |-
      A system is _observable_ if you can figure out everything about it just by watching what you can measure.
  high-school:
    text: |-
      A system is _observable_ if you can figure out its starting state by watching its output (and knowing its input) for a while.
  undergraduate:
    text: |-
      A system is _observable_ if its initial state is uniquely determined by its input and output over some finite time interval.
properties:
  - >-
    For $\dot{x} = A x + B u$, $y = C x$ with $n$ states, observability holds exactly when $$\operatorname{rank} \begin{bmatrix} C \\ C A \\ \vdots \\ C A^{n-1} \end{bmatrix} = n.$$
  - >-
    Observability is dual to controllability: $(A, C)$ is observable if and only if $(A^{\top}, C^{\top})$ is [controllable](/definitions/controllable).
---
