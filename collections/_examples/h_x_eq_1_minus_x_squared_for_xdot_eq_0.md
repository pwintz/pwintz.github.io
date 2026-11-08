---
published: false
title: '$h(x) = 1 - x^2$, for $\dot{x} = 0$'
level: graduate
is: [barrier_function]
is_not: [lyapunov_function]
why:
  barrier_function: >-
    $h(x) = 1 - x^2$ is a barrier function for $\dot{x} = 0$ because $\nabla h(x) \cdot f(x) = 0$, so $[-1, 1]$ is forward invariant.
  lyapunov_function: >-
    $h(x) = 1 - x^2$ is not a Lyapunov function, because $h$ is not positive definite and no solution converges.
---
