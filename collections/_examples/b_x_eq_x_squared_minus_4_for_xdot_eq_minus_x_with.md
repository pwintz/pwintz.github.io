---
published: false
title: '$B(x) = x^2 - 4$, for $\dot{x} = -x$, with $X_0 = [-1, 1]$ and $X_u = [3, \infty)$'
level: graduate
is: [barrier_certificate]
is_not: [lyapunov_function]
why:
  barrier_certificate: >-
    $B(x) = x^2 - 4$ is a barrier certificate because $B \leq -3$ on $X_0$, $B \geq 5$ on $X_u$, and $\nabla B(x) \cdot f(x) = -2 x^2 \leq 0$.
  lyapunov_function: >-
    $B(x) = x^2 - 4$ is not a Lyapunov function, because it is not positive definite, since $B(0) = -4$.
---
