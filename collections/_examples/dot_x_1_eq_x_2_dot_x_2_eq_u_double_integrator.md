---
published: false
title: '$\dot x_1 = x_2$, $\dot x_2 = u$ (double integrator)'
level: undergraduate
is: [
  controllable,
  reachable,
  stabilizable
]
why:
  controllable: >-
    The double integrator is controllable and reachable because, with $B = (0, 1)^{\top}$, the matrix $\begin{bmatrix} B & A B \end{bmatrix}$ has rank $2$.
  stabilizable: >-
    The double integrator is stabilizable, because it is controllable.
---
