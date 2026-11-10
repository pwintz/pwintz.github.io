---
title: '$u = -k y$, for $\dot x_1 = x_2$, $\dot x_2 = u$ with $y = x_1$'
level: undergraduate
is: [output_feedback]
is_not: [state_feedback]
why:
  output_feedback: >-
    $u = -k y$ is output feedback because the input uses only the measured position $y = x_1$, not the velocity.
    The closed loop $\ddot x_1 = -k x_1$ oscillates for every $k > 0$, so no static output feedback stabilizes the double integrator.
---
