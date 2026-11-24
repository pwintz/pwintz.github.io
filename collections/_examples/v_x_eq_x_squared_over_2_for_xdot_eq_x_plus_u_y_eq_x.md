---
published: false
title: '$V(x) = x^2/2$, for $\dot{x} = x + u$, $y = x$'
level: graduate
is_not: [
  storage_function,
  iss_lyapunov_function
]
why:
  storage_function: >-
    $V(x) = x^2/2$ is not a storage function for $\dot{x} = x + u$, $y = x$, because $\dot{V} = x^2 + x u$ and $u y = x u$, so $\dot{V} \leq u y$ would require $x^2 \leq 0$.
  iss_lyapunov_function: >-
    $V(x) = x^2/2$ is not an ISS-Lyapunov function for $\dot{x} = x + u$, because with $u = 0$, $\dot{V} = x^2 > 0$ for every $x \neq 0$.
---
