---
published: false
title: Passive system
term: passive
applies_to: input-output systems
levels:
  high-school:
    text: |-
      A system is _passive_ if it cannot produce energy on its own: it can only store or lose the energy that is put into it.
  undergraduate:
    context: physical systems
    text: |-
      A system is _passive_ if it cannot produce more energy than is supplied to it: the energy stored at any time is at most the initial stored energy plus the energy supplied through the input.
  graduate:
    context: nonlinear control
    text: |-
      A system $\dot{x} = f(x, u)$, $y = h(x, u)$ is _passive_ if there is a [continuously differentiable](/definitions/continuously-differentiable) storage function $V \geq 0$ with $u^{\top} y \geq \dot{V}$ along all solutions.
properties:
  - >-
    Every [lossless](/definitions/lossless) system is passive.
  - >-
    The negative [feedback](/definitions/feedback) connection of two passive systems is passive.
---
