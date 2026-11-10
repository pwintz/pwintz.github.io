---
published: false
title: 'Linear plant in feedback with an uncertain sector-bounded nonlinearity'
level: graduate
is: [
  circle_criterion,
  lyapunov_direct
]
is_not: [
  routh_hurwitz,
  jury_criterion
]
why:
  routh_hurwitz: >-
    The Routh–Hurwitz and Jury criteria do not apply, because the nonlinearity is uncertain.
  circle_criterion: >-
    The circle criterion applies to a linear plant in feedback with an uncertain sector-bounded nonlinearity, because the loop is a Lur'e system, and it gives absolute stability.
  lyapunov_direct: >-
    Lyapunov's direct method applies to a linear plant in feedback with an uncertain sector-bounded nonlinearity, because the circle criterion is proved with a quadratic Lyapunov function.
---
