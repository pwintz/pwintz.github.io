---
published: false
title: '$\dot x_1 = x_2$, $\dot x_2 = -\sin x_1 + u$ (pendulum)'
level: graduate
is: [control_affine, feedback_linearizable]
is_not: [linear_system, affine_system]
why:
  feedback_linearizable: >-
    The pendulum is control-affine, because $u$ enters linearly, and it is feedback linearizable, because $u = \sin x_1 + v$ leaves the double integrator $\dot x_1 = x_2$, $\dot x_2 = v$.
  linear_system: >-
    $\dot x_1 = x_2$, $\dot x_2 = -\sin x_1 + u$ (pendulum), is not linear or affine, because of the $\sin x_1$ term.
---
