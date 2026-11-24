---
published: false
title: '$V(x) = x^2/2$, for $\dot{x} = -x + u$, $y = x$'
level: graduate
is: [
  storage_function,
  iss_lyapunov_function
]
why:
  storage_function: >-
    $V(x) = x^2/2$ is a storage function for $\dot{x} = -x + u$, $y = x$, because $\dot{V} = -x^2 + x u = u y - x^2 \leq u y$.
  iss_lyapunov_function: >-
    $V(x) = x^2/2$ is an ISS-Lyapunov function for $\dot{x} = -x + u$, $y = x$, because $\dot{V} = -x^2 + x u \leq -x^2/2 + u^2/2$, since $x u \leq x^2/2 + u^2/2$.
---
