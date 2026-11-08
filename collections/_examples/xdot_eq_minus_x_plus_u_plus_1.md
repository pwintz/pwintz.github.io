---
published: false
title: '$\dot{x} = -x + u + 1$'
level: undergraduate
is: [affine_system, control_affine, feedback_linearizable]
is_not: [linear_system]
why:
  control_affine: >-
    $\dot{x} = -x + u + 1$ is affine, and so control-affine, because it is linear plus the constant offset $1$.
  feedback_linearizable: >-
    $\dot{x} = -x + u + 1$ is not linear, but it is feedback linearizable, because shifting coordinates to an equilibrium removes the offset.
---
