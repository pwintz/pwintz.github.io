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
    $\dot x_1 = u$, $\dot x_2 = x_1^2$, is not linear, affine, or feedback linearizable, because its linearization at the origin is not controllable, so no change of coordinates and feedback can make it a controllable linear system near the origin.
---
