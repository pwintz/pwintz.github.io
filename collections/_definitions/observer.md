---
title: Observer
term: observer
applies_to: state estimation
synonyms: [state observer]
levels:
  high-school:
    text: |-
      Consider a system with some quantities that you can measure and others that you cannot.
      An _observer_ is a calculation that estimates the quantities you cannot measure directly from the ones you can.
  undergraduate:
    text: |-
      Consider a plant with input $u$, output $y$, and an unknown state $x(t)$.
      An _observer_ is a dynamical system that takes $u$ and $y$ and produces a state estimate $\hat{x}(t)$ such that $\hat{x}(t) - x(t) \to 0$.
properties:
  - >-
    A [Luenberger observer](/definitions/luenberger-observer) whose error converges to zero (that is, with $A - L C$ Hurwitz) exists exactly when $(A, C)$ is [detectable](/definitions/detectable).
---
