---
published: false
title: '$f(x) = x^2 \sin(1/x)$ for $x \neq 0$, $f(0) = 0$, on $[-1, 1]$'
level: undergraduate
is: [
  Lipschitz_continuous,
  continuous,
  uniformly_continuous,
  absolutely_continuous
]
is_not: [continuously_differentiable]
why:
  continuously_differentiable: >-
    $f(x) = x^2 \sin(1/x)$ for $x \neq 0$, $f(0) = 0$, on $[-1, 1]$, is not continuously differentiable, because its derivative is not continuous at $0$.
  Lipschitz_continuous: >-
    The function $f(x) = x^2 \sin(1/x)$ is Lipschitz continuous on $[-1, 1]$ because it is differentiable everywhere with $\abs{f^{\prime}(x)} \leq 3$.
---
