---
published: false
title: Observer
term: observer
applies_to: state estimation
synonyms: [state observer]
levels:
  high-school:
    text: |-
      An _observer_ is a calculation that estimates quantities you cannot measure directly from ones you can.
  undergraduate:
    text: |-
      An _observer_ is a dynamical system that takes the input $u$ and output $y$ of a plant and produces a state estimate $\hat{x}(t)$ with $\hat{x}(t) - x(t) \to 0$.
properties:
  - >-
    A Luenberger observer whose error converges to zero (that is, with $A - L C$ Hurwitz) exists exactly when $(A, C)$ is [detectable](/definitions/detectable).
---
