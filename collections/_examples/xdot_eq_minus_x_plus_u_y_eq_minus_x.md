---
published: false
title: '$\dot{x} = -x + u$, $y = -x$'
level: graduate
is: [input_to_state_stable]
is_not: [passive]
why:
  passive: >-
    $\dot{x} = -x + u$, $y = -x$ is not passive, because the constant input $u = 1$ makes $x(t)$ approach $1$, so $\int_0^t u y \, d\tau = -\int_0^t x \, d\tau$ tends to $-\infty$, while passivity requires this integral to be at least $-V(x(0))$.
  input_to_state_stable: >-
    $\dot{x} = -x + u$, $y = -x$ is input-to-state stable, because it is a stable linear system.
    The output does not affect input-to-state stability.
---
