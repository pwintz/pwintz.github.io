---
published: false
title: Output feedback
term: output feedback
applies_to: control laws
levels:
  high-school:
    text: |-
      _Output feedback_ is control that uses only some measurements of a system (its output), not its whole state.
  undergraduate:
    text: |-
      _Output feedback_ is a control law that uses only the measured output $y$, either directly, as in $u = k(y)$, or through a dynamic controller.
properties:
  - >-
    Static output feedback cannot always stabilize a [controllable](/definitions/controllable) and [observable](/definitions/observable) system. Dynamic output feedback can, for example by combining an [observer](/definitions/observer) with [state feedback](/definitions/state-feedback) (the separation principle).
---
