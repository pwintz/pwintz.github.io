---
published: false
title: Reconstructible system
term: reconstructible
applies_to: control systems
synonyms: [constructible]
levels:
  undergraduate:
    text: |-
      A system is _reconstructible_ if its current state is uniquely determined by its past input and output over some finite time interval.
properties:
  - >-
    For continuous-time linear systems, reconstructibility and observability are equivalent.
  - >-
    For $x_{k+1} = A x_k + B u_k$, $y_k = C x_k$, observability implies reconstructibility. The converse fails when $A$ is singular: if $A = 0$, the current state is always $0$ after one step, even if nothing can be learned about the initial state.
---
