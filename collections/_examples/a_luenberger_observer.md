---
title: 'A Luenberger observer'
definition: luenberger_observer
level: undergraduate
is: [observer, estimator]
is_not: [predictor]
why:
  observer: >-
    A Luenberger observer $\dot{\hat{x}} = A \hat{x} + B u + L (y - C \hat{x})$, for $\dot{x} = A x + B u$ and $y = C x$, is an observer when $A - L C$ is Hurwitz, because then its estimation error converges to zero.
  predictor: >-
    A Luenberger observer is not a predictor, because it estimates the present, not the future.
  estimator: >-
    A Luenberger observer is an observer, and so an estimator, because it estimates the current state of a deterministic system from its inputs and outputs.
---
