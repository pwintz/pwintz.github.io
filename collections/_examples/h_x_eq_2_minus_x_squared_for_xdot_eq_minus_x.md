---
published: false
title: '$h(x) = 2 - x^2$, for $\dot{x} = -x$'
level: graduate
description: >-
  With initial set $X_0 = [-1, 1]$ and unsafe set $X_u = \setdef{x \suchthat \abs{x} \geq 2}$.
is: [barrier_function]
is_not: [barrier_function_optimization, barrier_certificate]
why:
  barrier_function_optimization: >-
    $h(x) = 2 - x^2$ is not a barrier function in optimization, because it stays bounded near the boundary.
  barrier_function: >-
    $h(x) = 2 - x^2$ is a barrier function in control theory, because it is zero on the boundary of $[-\sqrt{2}, \sqrt{2}]$, and $\nabla h(x) \cdot f(x) = 2 x^2 \geq -h(x)$, so this set is forward invariant.
  barrier_certificate: >-
    $h(x) = 2 - x^2$ is not a barrier certificate, because it has the wrong sign: it is positive on the initial set.
---
