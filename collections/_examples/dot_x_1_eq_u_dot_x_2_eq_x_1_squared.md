---
published: false
title: '$\dot x_1 = u$, $\dot x_2 = x_1^2$'
level: graduate
is: [control_affine]
is_not: [linear_system, affine_system, feedback_linearizable]
why:
  control_affine: >-
    $\dot x_1 = u$, $\dot x_2 = x_1^2$ is control-affine, because $u$ enters linearly.
  feedback_linearizable: >-
    $\dot x_1 = u$, $\dot x_2 = x_1^2$, is not feedback linearizable, because its linearization at the origin is not controllable, so no change of coordinates and feedback can make it a controllable linear system near the origin.
  linear_system: >-
    $\dot x_1 = u$, $\dot x_2 = x_1^2$, is not linear, because its linearization at the origin is not controllable, so no change of coordinates and feedback can make it a controllable linear system near the origin.
  affine_system: >-
    $\dot x_1 = u$, $\dot x_2 = x_1^2$, is not affine, because its linearization at the origin is not controllable, so no change of coordinates and feedback can make it a controllable linear system near the origin.
---
