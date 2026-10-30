---
published: false
title: Directional derivative
term: directional derivative
applies_to: functions
levels:
  high-school:
    text: |-
      The _directional derivative_ of a function of several variables is its rate of change as you move in a particular direction, like the slope of a hill in the direction you are walking.
  undergraduate:
    text: |-
      The _directional derivative_ of $f$ at $x$ in the direction $v$ is the rate of change of $f$ in that direction: $D_v f(x) = \lim_{t \to 0} \frac{f(x + t v) - f(x)}{t}$.
properties:
  - >-
    If $f$ is [differentiable](/definitions/differentiable), then $D_v f(x) = \nabla f(x) \cdot v$.
  - >-
    A function can have directional derivatives in every direction and still not be [differentiable](/definitions/differentiable), or even [continuous](/definitions/continuous).
---
Some authors require $v$ to be a unit [vector](/definitions/vector), so that $D_v f(x)$ is a rate per unit distance.
