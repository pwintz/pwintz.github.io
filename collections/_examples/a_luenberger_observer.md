---
published: false
title: 'A Luenberger observer'
definition: luenberger_observer
level: undergraduate
is: [observer, estimator]
is_not: [predictor]
why:
  observer: >-
    A Luenberger observer $\dot{\hat{x}} = A \hat{x} + B u + L (y - C \hat{x})$, for $\dot{x} = A x + B u$ and $y = C x$, is an observer when $A - L C$ is Hurwitz, because then its estimation error converges to zero.
---
