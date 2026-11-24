---
published: false
title: '$V(x) = x^2/2$, for $\dot{x} = -x + u$, $y = -x$'
level: graduate
is: [iss_lyapunov_function]
is_not: [storage_function]
why:
  storage_function: >-
    $V(x) = x^2/2$ is not a storage function for $\dot{x} = -x + u$, $y = -x$, because $\dot{V} = -x^2 + x u$ and $u y = -x u$, so $\dot{V} \leq u y$ would require $2 x u \leq x^2$, which fails for $x = 1$ and $u = 1$.
  iss_lyapunov_function: >-
    $V(x) = x^2/2$ is an ISS-Lyapunov function for $\dot{x} = -x + u$, because $\dot{V} = -x^2 + x u \leq -x^2/2 + u^2/2$.
    The inequality does not involve the output.
---
