---
published: false
title: '$\dot x_1 = x_2$, $\dot x_2 = -\sin x_1 + u$ (pendulum)'
level: graduate
is: [
  control_affine,
  feedback_linearizable
]
is_not: [
  linear_system,
  affine_system
]
why:
  feedback_linearizable: >-
    The pendulum is feedback linearizable, because the feedback $u = \sin x_1 + v$ turns it into the double integrator $\dot x_1 = x_2$, $\dot x_2 = v$.
  linear_system: >-
    $\dot x_1 = x_2$, $\dot x_2 = -\sin x_1 + u$ (pendulum), is not linear, because of the $\sin x_1$ term.
  affine_system: >-
    $\dot x_1 = x_2$, $\dot x_2 = -\sin x_1 + u$ (pendulum), is not affine, because of the $\sin x_1$ term.
  control_affine: >-
    The pendulum is control-affine, because the input $u$ enters linearly, added to a function of the state.
---
