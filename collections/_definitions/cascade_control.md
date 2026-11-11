---
title: Cascade control
term: cascade control
applies_to: control architectures
synonyms: [inner-outer loop control, nested loop control]
levels:
  high-school:
    text: |-
      _Cascade control_ is a way of controlling a system with two controllers, one inside the other.
      The outer controller decides what an intermediate quantity should be, and the inner controller makes that quantity follow the decision.
      For example, to control the temperature of a room, an outer controller chooses how much hot water should flow, and an inner controller adjusts a valve until the water flow matches.
  undergraduate:
    context: feedback control
    text: |-
      Consider a plant in which an intermediate variable $y_2$, which can be measured, lies between the [control input](/dictionary/definitions/control-input) $u$ and the output $y_1$ to be controlled.
      _Cascade control_ uses two nested [feedback](/dictionary/definitions/feedback) loops:

      1. the outer loop compares $y_1$ with its reference $r_1$ and computes a reference $r_2$ for the intermediate variable, and
      2. the inner loop compares $y_2$ with $r_2$ and computes the control input $u$.
properties:
  - >-
    The inner loop is usually designed to be several times faster than the outer loop, so that the outer controller sees the inner loop as nearly ideal.
  - >-
    The inner loop corrects [disturbances](/dictionary/definitions/disturbance) that enter near the input, such as changes in supply pressure, before the disturbances affect the output.
  - >-
    Cascade control is different from a _cascade of systems_, in which the output of one system is the input of the next with no feedback between them.
---
