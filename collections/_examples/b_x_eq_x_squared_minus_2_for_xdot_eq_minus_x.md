---
published: false
title: '$B(x) = x^2 - 2$, for $\dot{x} = -x$'
level: graduate
description: >-
  With initial set $X_0 = [-1, 1]$ and unsafe set $X_u = \setdef{x \suchthat \abs{x} \geq 2}$.
is: [barrier_certificate]
is_not: [barrier_function]
why:
  barrier_certificate: >-
    $B(x) = x^2 - 2$ is a barrier certificate because $B \leq -1$ on $X_0$, $B \geq 2$ on $X_u$, and $\nabla B(x) \cdot f(x) = -2 x^2 \leq 0$.
  barrier_function: >-
    $B(x) = x^2 - 2$ is not a barrier function, because it has the wrong sign: it is negative on the safe set.
---
