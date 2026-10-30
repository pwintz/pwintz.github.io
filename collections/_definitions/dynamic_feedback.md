---
published: false
title: Dynamic feedback
term: dynamic feedback
applies_to: control laws
levels:
  high-school:
    text: |-
      A [feedback](/definitions/feedback) controller is _dynamic_ if it also remembers past measurements.
  undergraduate:
    text: |-
      A [feedback](/definitions/feedback) law is _dynamic_ if the controller has its own internal state $z$, as in $\dot{z} = g(z, y)$ and $u = k(z, y)$, so the input can depend on past measurements.
properties:
  - >-
    PID controllers, observer-based controllers, and lead-lag compensators are dynamic. A proportional controller is static.
---
