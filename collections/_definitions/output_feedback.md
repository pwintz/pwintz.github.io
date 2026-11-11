---
title: Output feedback
term: output feedback
applies_to: control laws
levels:
  # high-school:
  #   text: |-
  #     Consider a system whose state (position, velocity, and angle) cannot be measured, but some of the values can be measured.
  #     
  #     _Output feedback_ is control that uses only the output, not the whole state.
  undergraduate:
    text: |-
      Consider a control system with state $x$ and measured output $y$.
      _Output feedback_ is a control law that uses only $y$, either directly, as in $u = k(y)$, or through a dynamic controller.
properties:
  - >-
    Some [controllable](/dictionary/definitions/controllable) and [observable](/dictionary/definitions/observable) systems cannot be stabilized by [static](/dictionary/definitions/static_feedback) output feedback, but can be by .
    They can, however, be stabilized by [dynamic](/dictionary/definitions/dynamic_feedback) output feedback, for example by combining an [observer](/dictionary/definitions/observer) with [state feedback](/dictionary/definitions/state-feedback) (the separation principle).
---
