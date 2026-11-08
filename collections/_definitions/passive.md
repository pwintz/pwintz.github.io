---
published: false
title: Passive system
term: passive
applies_to: input-output systems
levels:
  high-school:
    text: |-
      Consider a system that can receive energy from outside, like a spring or a resistor.
      The system is _passive_ if it cannot produce energy on its own: it can only store or lose the energy that is put into it.
  undergraduate:
    context: physical systems
    text: |-
      Consider a physical system that stores energy and receives energy through its input.
      The system is _passive_ if it cannot produce more energy than is supplied to it: the energy stored at every time is at most the initial stored energy plus the energy supplied through the input.
  graduate:
    context: nonlinear control
    text: |-
      Consider a system $\dot{x} = f(x, u)$ with output $y = h(x, u)$.
      The system is _passive_ if there is a [continuously differentiable](/definitions/continuously-differentiable) storage function $V \geq 0$ with

      $$u^{\top} y \geq \dot{V}$$

      along all solutions.
properties:
  - >-
    Every [lossless](/definitions/lossless) system is passive.
  - >-
    The negative [feedback](/definitions/feedback) connection of two passive systems is passive.
---
