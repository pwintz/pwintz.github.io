---
published: false
title: Output feedback
term: output feedback
applies_to: control laws
levels:
  high-school:
    text: |-
      Consider a system whose whole condition (its state) cannot be measured, but some of it (its output) can.
      _Output feedback_ is control that uses only the output, not the whole state.
  undergraduate:
    text: |-
      Consider a system with state $x$ and measured output $y$.
      _Output feedback_ is a control law that uses only $y$, either directly, as in $u = k(y)$, or through a dynamic controller.
properties:
  - >-
    Some [controllable](/definitions/controllable) and [observable](/definitions/observable) systems cannot be stabilized by static output feedback.
    Dynamic output feedback can, for example by combining an [observer](/definitions/observer) with [state feedback](/definitions/state-feedback) (the separation principle).
---
